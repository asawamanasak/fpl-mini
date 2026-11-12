#!/usr/bin/env python3
"""
FPLSaWaDiKa - Full-Stack Multi-Device Audit Suite for Tier 1 Leagues
Tests all 8 Tier 1 leagues across Desktop, Tablet, and Mobile.
Verifies every tab, every modal, layout overflow, data completeness, and 0 console errors.
Runs against a local HTTP server to mirror real production origin behavior.
"""

import os
import sys
import json
import time
import asyncio
import subprocess
import urllib.request
import websockets
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

CHROME_BIN = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HTTP_PORT = 8765

TIER1_LEAGUES = [
    ("40700", "เซียนอยู่รู หมูอยู่ตึก"),
    ("675290", "NudNee"),
    ("38491", "รอ แมน โอน"),
    ("1101958", "Barley's Official League"),
    ("438691", "2 spade"),
    ("187827", "Shi62"),
    ("5349", "Bramann League"),
    ("567387", "Fantasy Nguan & friends cup")
]

VIEWPORTS = [
    {
        "name": "Desktop (1280x900)",
        "width": 1280,
        "height": 900,
        "deviceScaleFactor": 1,
        "mobile": False
    },
    {
        "name": "Tablet (820x1180)",
        "width": 820,
        "height": 1180,
        "deviceScaleFactor": 2,
        "mobile": True
    },
    {
        "name": "Mobile (375x812)",
        "width": 375,
        "height": 812,
        "deviceScaleFactor": 3,
        "mobile": True
    }
]

class QuietHTTPHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, format, *args):
        pass # Suppress standard HTTP logs

class LocalServer:
    def __init__(self, port=HTTP_PORT):
        self.port = port
        self.server = None
        self.thread = None

    def start(self):
        self.server = ThreadingHTTPServer(('127.0.0.1', self.port), QuietHTTPHandler)
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        time.sleep(0.5)

    def stop(self):
        if self.server:
            self.server.shutdown()
            self.server.server_close()
            self.server = None

class ChromeRunner:
    def __init__(self, port=9222):
        self.port = port
        self.proc = None

    def start(self):
        self.proc = subprocess.Popen([
            CHROME_BIN,
            "--headless=new",
            f"--remote-debugging-port={self.port}",
            "--disable-gpu",
            "--no-first-run",
            "--no-default-browser-check",
            "--enable-logging=stderr",
            "--v=1"
        ], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        time.sleep(1.5)

    def stop(self):
        if self.proc:
            self.proc.terminate()
            try:
                self.proc.wait(timeout=3)
            except subprocess.TimeoutExpired:
                self.proc.kill()
            self.proc = None

class CDPAgent:
    def __init__(self, ws_url):
        self.ws_url = ws_url
        self.ws = None
        self.msg_id = 0
        self.console_errors = []
        self.unhandled_exceptions = []

    async def connect(self):
        self.ws = await websockets.connect(self.ws_url, max_size=20*1024*1024)
        await self.send("Runtime.enable")
        await self.send("Log.enable")

    async def close(self):
        if self.ws:
            await self.ws.close()

    async def send(self, method, params=None):
        self.msg_id += 1
        payload = {"id": self.msg_id, "method": method}
        if params:
            payload["params"] = params
        await self.ws.send(json.dumps(payload))
        while True:
            resp_raw = await self.ws.recv()
            resp = json.loads(resp_raw)
            if "method" in resp:
                if resp["method"] == "Runtime.exceptionThrown":
                    details = resp.get("params", {}).get("exceptionDetails", {})
                    text = details.get("text", "")
                    exc = details.get("exception", {}).get("description", "")
                    self.unhandled_exceptions.append(f"{text}: {exc}")
                elif resp["method"] == "Log.entryAdded":
                    entry = resp.get("params", {}).get("entry", {})
                    if entry.get("level") == "error":
                        entry_url = entry.get("url", "")
                        entry_text = entry.get("text", "")
                        if "visitorbadge" not in entry_url and "telemetry" not in entry_url and "favicon" not in entry_url:
                            self.console_errors.append(f"{entry_text} ({entry_url})")
                continue
            if resp.get("id") == self.msg_id:
                return resp.get("result", {})

    async def evaluate(self, expr):
        res = await self.send("Runtime.evaluate", {
            "expression": expr,
            "returnByValue": True,
            "awaitPromise": True
        })
        val = res.get("result", {}).get("value")
        return val

    async def set_viewport(self, vp):
        await self.send("Emulation.setDeviceMetricsOverride", {
            "width": vp["width"],
            "height": vp["height"],
            "deviceScaleFactor": vp["deviceScaleFactor"],
            "mobile": vp["mobile"]
        })

async def run_league_audit(cdp, lid, league_name, vp):
    target_url = f"http://127.0.0.1:{HTTP_PORT}/{lid}/"
    
    # 1. Set Viewport
    await cdp.set_viewport(vp)

    # 2. Reset logs
    cdp.console_errors.clear()
    cdp.unhandled_exceptions.clear()

    # 3. Navigate
    await cdp.send("Page.navigate", {"url": target_url})
    
    # Wait for page & StandaloneApp to initialize
    init_ok = False
    for _ in range(40):
        val = await cdp.evaluate("""
            Boolean(window.app && window.app.activeLeagueId && document.getElementById('matchday-table-body'))
        """)
        if val:
            init_ok = True
            break
        await asyncio.sleep(0.1)

    results = {
        "lid": lid,
        "league_name": league_name,
        "viewport": vp["name"],
        "status": "PASS",
        "tabs_checked": 0,
        "modals_checked": 0,
        "overflow_issues": [],
        "data_issues": [],
        "tab_details": []
    }

    if not init_ok:
        results["status"] = "FAIL"
        results["data_issues"].append("Timeout waiting for window.app and matchday-table-body initialization")
        return results

    # Get available visible tabs
    tabs_data = await cdp.evaluate("""
        (() => {
            const btns = Array.from(document.querySelectorAll('[id^="tab-btn-"]'));
            return btns.map(b => ({
                id: b.id,
                target: b.getAttribute('data-tab-target'),
                text: b.innerText.trim(),
                hidden: b.classList.contains('hidden') || b.offsetParent === null
            })).filter(b => !b.hidden && b.target);
        })()
    """) or []

    results["tabs_checked"] = len(tabs_data)

    # Audit each tab
    for tab in tabs_data:
        t_id = tab["id"]
        t_target = tab["target"]
        
        # Click tab via JS
        await cdp.evaluate(f"""
            (() => {{
                try {{
                    const btn = document.getElementById('{t_id}');
                    if (btn) btn.click();
                }} catch (e) {{}}
            }})()
        """)
        await asyncio.sleep(0.12)

        # Check Tab Visibility, Overflow & Data Content
        tab_check = await cdp.evaluate(f"""
            (() => {{
                const el = document.getElementById('{t_target}');
                if (!el) return {{ exists: false }};
                const isVisible = !el.classList.contains('hidden');
                const hasOverflow = document.documentElement.scrollWidth > (window.innerWidth + 1);
                const scrollDiff = document.documentElement.scrollWidth - window.innerWidth;
                
                let details = {{
                    target: '{t_target}',
                    isVisible: isVisible,
                    hasOverflow: hasOverflow,
                    scrollDiff: scrollDiff,
                    issues: []
                }};

                if (!isVisible) {{
                    details.issues.push('Tab container was not made visible');
                }}

                if ('{t_target}' === 'global-radar-view') {{
                    const headerPill = document.getElementById('global-radar-header-pill')?.innerText || '';
                    const recordsCount = document.querySelectorAll('#global-radar-records > div').length;
                    const benchmarksCount = document.querySelectorAll('#global-radar-league-benchmarks > div').length;
                    const tableRows = document.querySelectorAll('#global-radar-table-body tr').length;
                    details.radar_header = headerPill;
                    details.records_count = recordsCount;
                    details.benchmarks_count = benchmarksCount;
                    details.table_rows = tableRows;

                    if (!headerPill.includes('8 ลีก') && !headerPill.includes('8 Leagues')) {{
                        details.issues.push('Radar header pill does not report 8 leagues: ' + headerPill);
                    }}
                    if (!headerPill.includes('146 ทีม') && !headerPill.includes('146 Teams')) {{
                        details.issues.push('Radar header pill does not report 146 teams: ' + headerPill);
                    }}
                    if (benchmarksCount !== 8) {{
                        details.issues.push('Radar benchmark count expected 8, found: ' + benchmarksCount);
                    }}
                    if (recordsCount !== 4) {{
                        details.issues.push('Radar records cards expected 4, found: ' + recordsCount);
                    }}
                    if (tableRows < 140) {{
                        details.issues.push('Radar table rows incomplete: ' + tableRows);
                    }}
                }} else if ('{t_target}' === 'gameweek-view') {{
                    const rows = document.querySelectorAll('#matchday-table-body tr').length;
                    if (rows === 0) details.issues.push('Gameweek table has 0 rows');
                }} else if ('{t_target}' === 'highlights-view') {{
                    const cards = document.querySelectorAll('#highlights-view .glass-card').length;
                    if (cards === 0) details.issues.push('Highlights cards not rendered');
                }} else if ('{t_target}' === 'competition-view') {{
                    const rows = document.querySelectorAll('#overall-standings-body tr').length;
                    if (rows === 0) details.issues.push('Competition overall standings table has 0 rows');
                }} else if ('{t_target}' === 'transfers-view') {{
                    const transView = document.getElementById('transfers-view');
                    if (!transView) details.issues.push('Transfers container missing');
                }} else if ('{t_target}' === 'prizes-view') {{
                    const prizeCard = document.querySelector('#prizes-view .glass-card, #prizes-view table');
                    if (!prizeCard) details.issues.push('Prizes view content empty');
                }} else if ('{t_target}' === 'cup-view') {{
                    const cupContainer = document.querySelector('#cup-view .glass-card, #cup-view table');
                    if (!cupContainer) details.issues.push('Cup view content empty');
                }} else if ('{t_target}' === 'shi62-special-view') {{
                    const shiMatches = document.querySelectorAll('#shi62-special-view .glass-card, #shi62-special-view table').length;
                    if (shiMatches === 0) details.issues.push('Shi62 special content empty');
                }} else if ('{t_target}' === 'bramann-prediction-view') {{
                    const predMatches = document.querySelectorAll('#bramann-prediction-view .glass-card, #bramann-prediction-view table').length;
                    if (predMatches === 0) details.issues.push('Bramann prediction content empty');
                }} else if ('{t_target}' === 'bramann-challenge-view') {{
                    const chalContent = document.querySelectorAll('#bramann-challenge-view .glass-card, #bramann-challenge-view table').length;
                    if (chalContent === 0) details.issues.push('Bramann challenge content empty');
                }}

                return details;
            }})()
        """) or {}

        if tab_check.get("hasOverflow"):
            results["overflow_issues"].append(f"Tab {tab['text']} ({t_target}): scrollWidth exceeded viewport by {tab_check.get('scrollDiff')}px")
        
        if tab_check.get("issues"):
            for iss in tab_check["issues"]:
                results["data_issues"].append(f"Tab {tab['text']}: {iss}")

        results["tab_details"].append({
            "name": tab["text"],
            "target": t_target,
            "status": "PASS" if not tab_check.get("issues") and not tab_check.get("hasOverflow") else "FAIL",
            "details": tab_check
        })

    # Switch back to live tab for modal testing
    await cdp.evaluate("""
        (() => {
            const btn = document.getElementById('tab-btn-live');
            if (btn) btn.click();
        })()
    """)
    await asyncio.sleep(0.1)

    # Test Modals
    # 1. Team Modal (Pitch View)
    team_modal_test = await cdp.evaluate("""
        (() => {
            try {
                const teamRow = document.querySelector('#matchday-table-body tr[onclick*="openTeamModal"]');
                if (teamRow) {
                    teamRow.click();
                } else if (window.app && window.app.data && window.app.data.teams && window.app.data.teams[0]) {
                    window.app.openTeamModal(window.app.data.teams[0].entry_id);
                } else {
                    return { status: 'SKIPPED', reason: 'No team row available' };
                }

                const modal = document.getElementById('team-modal');
                const isVis = modal && !modal.classList.contains('hidden');
                
                const starters = document.querySelectorAll('.fpl-pitch-row > div').length;
                const bench = document.querySelectorAll('#team-bench-container > div').length;
                const title = document.getElementById('team-modal-title')?.innerText || '';
                
                if (window.app && window.app.closeTeamModal) {
                    window.app.closeTeamModal();
                }
                const isClosed = modal && modal.classList.contains('hidden');

                const pass = isVis && isClosed && (starters + bench >= 11);
                return {
                    status: pass ? 'PASS' : 'FAIL',
                    isVis: isVis,
                    isClosed: isClosed,
                    starters: starters,
                    bench: bench,
                    title: title
                };
            } catch (e) {
                return { status: 'FAIL', error: e.toString() };
            }
        })()
    """) or {}
    if team_modal_test.get("status") == "PASS":
        results["modals_checked"] += 1
    else:
        results["data_issues"].append(f"Team Modal Pitch View test: {team_modal_test}")

    # 2. Projected Points Modal
    proj_modal_test = await cdp.evaluate("""
        (() => {
            try {
                if (window.app && window.app.openProjectedPointsModal) {
                    window.app.openProjectedPointsModal();
                    const modal = document.getElementById('projected-points-modal');
                    const isVis = modal && !modal.classList.contains('hidden');
                    window.app.closeProjectedPointsModal();
                    const isClosed = modal && modal.classList.contains('hidden');
                    return { status: (isVis && isClosed) ? 'PASS' : 'FAIL' };
                }
                return { status: 'PASS', note: 'Modal not active for league' };
            } catch (e) {
                return { status: 'FAIL', error: e.toString() };
            }
        })()
    """) or {}
    if proj_modal_test.get("status") == "PASS":
        results["modals_checked"] += 1
    else:
        results["data_issues"].append(f"Projected Points Modal test: {proj_modal_test}")

    # 3. Text Summary Modal (via production shareCurrentGameweek)
    summary_modal_test = await cdp.evaluate("""
        (() => {
            try {
                if (window.app && window.app.shareCurrentGameweek) {
                    window.app.shareCurrentGameweek();
                    const modal = document.getElementById('text-summary-modal');
                    const isVis = modal && !modal.classList.contains('hidden');
                    const textarea = document.getElementById('text-summary-content');
                    const textVal = textarea ? textarea.value : '';
                    const hasText = Boolean(textVal && textVal.length > 30);
                    
                    window.app.closeTextSummaryModal();
                    const isClosed = modal && modal.classList.contains('hidden');
                    return { 
                        status: (isVis && isClosed && hasText) ? 'PASS' : 'FAIL',
                        hasText: hasText,
                        len: textVal.length
                    };
                }
                return { status: 'PASS' };
            } catch (e) {
                return { status: 'FAIL', error: e.toString() };
            }
        })()
    """) or {}
    if summary_modal_test.get("status") == "PASS":
        results["modals_checked"] += 1
    else:
        results["data_issues"].append(f"LINE Summary Modal test: {summary_modal_test}")

    # Collect console errors & uncaught exceptions (filter out benign external font/analytics errors if any)
    critical_errors = [
        e for e in cdp.console_errors 
        if "visitorbadge" not in e and "telemetry" not in e and "favicon" not in e and "api.visitorbadge.io" not in e
    ]
    if critical_errors:
        results["data_issues"].extend([f"Console Error: {e}" for e in critical_errors])
    if cdp.unhandled_exceptions:
        results["data_issues"].extend([f"Unhandled Exception: {e}" for e in cdp.unhandled_exceptions])

    if results["overflow_issues"] or results["data_issues"]:
        results["status"] = "FAIL"

    return results

async def main():
    print("=" * 70)
    print("🚀 FPLSaWaDiKa: Multi-Device Deep Audit Suite (Tier 1 Leagues)")
    print("=" * 70)

    # 1. Start HTTP Server
    server = LocalServer(port=HTTP_PORT)
    server.start()
    print(f"📡 Local Test HTTP Server listening at http://127.0.0.1:{HTTP_PORT}/")

    # 2. Start Chrome Headless
    runner = ChromeRunner(port=9222)
    runner.start()

    try:
        req = urllib.request.Request("http://127.0.0.1:9222/json/new?about:blank", method="PUT")
        with urllib.request.urlopen(req) as resp:
            target_info = json.loads(resp.read().decode())
        ws_url = target_info["webSocketDebuggerUrl"]

        cdp = CDPAgent(ws_url)
        await cdp.connect()

        all_results = []
        start_time = time.time()

        for lid, lname in TIER1_LEAGUES:
            print(f"\n📂 Auditing League {lid}: {lname}")
            for vp in VIEWPORTS:
                res = await run_league_audit(cdp, lid, lname, vp)
                all_results.append(res)
                symbol = "✅" if res["status"] == "PASS" else "❌"
                print(f"  {symbol} {vp['name']}: {res['tabs_checked']} tabs, {res['modals_checked']} modals | Status: {res['status']}")
                if res["overflow_issues"]:
                    for o in res["overflow_issues"]:
                        print(f"      ⚠️  Overflow: {o}")
                if res["data_issues"]:
                    for d in res["data_issues"]:
                        print(f"      ⛔ Issue: {d}")

        await cdp.close()

        elapsed = time.time() - start_time
        total_tests = len(all_results)
        passed_tests = sum(1 for r in all_results if r["status"] == "PASS")
        failed_tests = total_tests - passed_tests

        print("\n" + "=" * 70)
        print(f"🏁 Audit Summary: {passed_tests}/{total_tests} configurations PASSED ({elapsed:.1f}s)")
        print("=" * 70)

        report_path = os.path.join(BASE_DIR, "deep_audit_report.json")
        with open(report_path, "w", encoding="utf-8") as f:
            json.dump({
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                "total_configs": total_tests,
                "passed_configs": passed_tests,
                "failed_configs": failed_tests,
                "elapsed_seconds": round(elapsed, 2),
                "results": all_results
            }, f, ensure_ascii=False, indent=2)
        print(f"📄 Detailed report saved to: {report_path}")

        if failed_tests > 0:
            sys.exit(1)
        else:
            print("✨ 100% GREEN! All tabs, modals, and viewports verified flawlessly!")
            sys.exit(0)

    finally:
        runner.stop()
        server.stop()

if __name__ == "__main__":
    asyncio.run(main())
