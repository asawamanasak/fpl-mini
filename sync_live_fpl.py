import urllib.request
import urllib.error
import http.client
import socket
import json
import time
import os
import sys
import shutil
import argparse
import subprocess
import random
import threading
from datetime import datetime, timezone, timedelta
from concurrent.futures import ThreadPoolExecutor

# Guard against hung low-level sockets across all worker threads
socket.setdefaulttimeout(20)

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}

def fetch(url, headers_override=None, retries=5, delay=2.0, timeout=15):
    """Fetch JSON from URL with exponential backoff, jitter, and network timeout recovery."""
    req_headers = headers_override if headers_override is not None else headers
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=req_headers)
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                data = resp.read().decode('utf-8')
                return json.loads(data)
        except urllib.error.HTTPError as e:
            if e.code == 404:
                # 404 Not Found is deterministic; do not retry
                raise e
            if e.code in (429, 500, 502, 503, 504):
                # Exponential backoff with jitter to protect against rate limits and temporary outages
                base_wait = delay * (2 ** attempt)
                jitter = random.uniform(0.5, 1.5)
                wait_time = base_wait + jitter
                status_desc = "Rate limited (429)" if e.code == 429 else f"Server error ({e.code})"
                print(f"{status_desc} fetching {url}. Waiting {wait_time:.1f}s before retry (attempt {attempt + 1}/{retries})...")
                time.sleep(wait_time)
                continue
            if attempt == retries - 1:
                print(f"Failed to fetch {url} after {retries} attempts: {e}")
                raise e
            wait_time = delay * (2 ** attempt) + random.uniform(0.5, 1.5)
            time.sleep(wait_time)
        except (urllib.error.URLError, socket.timeout, TimeoutError, http.client.RemoteDisconnected,
                ConnectionResetError, ConnectionRefusedError, http.client.IncompleteRead, json.JSONDecodeError) as e:
            if attempt == retries - 1:
                print(f"Failed to fetch {url} after {retries} attempts: {e}")
                raise e
            base_wait = delay * (2 ** attempt)
            jitter = random.uniform(0.5, 1.5)
            wait_time = base_wait + jitter
            err_type = type(e).__name__
            print(f"Transient network/payload issue ({err_type}: {e}) fetching {url}. Retrying in {wait_time:.1f}s (attempt {attempt + 1}/{retries})...")
            time.sleep(wait_time)
        except Exception as e:
            if attempt == retries - 1:
                print(f"Failed to fetch {url} after {retries} attempts: {e}")
                raise e
            wait_time = delay * (2 ** attempt) + random.uniform(0.5, 1.5)
            time.sleep(wait_time)

def recover_missing_teams_from_cache(current_results, cached_results):
    """
    Ensure no teams are dropped from gameweek results due to transient fetch timeouts.
    If a team was in cached_results but is missing from current_results, recover it.
    """
    if not cached_results:
        return list(current_results)
    
    current_eids = {r.get("entry_id") for r in current_results if r.get("entry_id") is not None}
    merged_results = list(current_results)
    
    for c_r in cached_results:
        c_eid = c_r.get("entry_id")
        if c_eid is not None and c_eid not in current_eids:
            merged_results.append(c_r)
            current_eids.add(c_eid)
            
    return merged_results

def load_cached_data(json_path):
    """Load JSON cache, automatically falling back to .bak if corrupted or missing."""
    if not os.path.exists(json_path):
        bak_path = f"{json_path}.bak"
        if os.path.exists(bak_path):
            try:
                with open(bak_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                print(f"Recovered cache from backup file: {bak_path}")
                return data
            except Exception:
                return None
        return None

    try:
        with open(json_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        return data
    except Exception as e:
        print(f"Warning: Could not read {json_path} (possible corruption): {e}")
        bak_path = f"{json_path}.bak"
        if os.path.exists(bak_path):
            try:
                with open(bak_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                print(f"✅ Successfully recovered cache from {bak_path}!")
                return data
            except Exception as bak_err:
                print(f"Warning: Backup file {bak_path} also unusable: {bak_err}")
        return None

def get_gw_fixture_status(gw_id):
    """
    Smart Fixture-Aware Status Check:
    Check FPL fixtures API to verify if fixtures have started or finished.
    Returns (is_started, is_finished, finished_teams, unstarted_teams).
    - is_started: True if at least one fixture has started.
    - is_finished: True if all fixtures have started and finished (or provisionally finished).
    - finished_teams: Set of team IDs whose active fixtures in this GW have all finished.
    - unstarted_teams: Set of team IDs whose active fixtures in this GW have not started yet.
    """
    try:
        fixtures = fetch(f'https://fantasy.premierleague.com/api/fixtures/?event={gw_id}')
        if fixtures and len(fixtures) > 0:
            active_fixtures = [f for f in fixtures if not bool(f.get('postponed'))]
            if not active_fixtures:
                return False, False, set(), set()
            is_started = any(bool(f.get('started')) for f in active_fixtures)
            is_finished = all(bool(f.get('started')) and (bool(f.get('finished')) or bool(f.get('finished_provisional'))) for f in active_fixtures)
            team_fixtures_done = {}
            team_fixtures_started = {}
            for f in active_fixtures:
                f_done = bool(f.get('started')) and (bool(f.get('finished')) or bool(f.get('finished_provisional')))
                f_start = bool(f.get('started'))
                for tid in (f.get('team_h'), f.get('team_a')):
                    if tid is not None:
                        team_fixtures_done.setdefault(tid, []).append(f_done)
                        team_fixtures_started.setdefault(tid, []).append(f_start)
            finished_teams = {tid for tid, done_list in team_fixtures_done.items() if done_list and all(done_list)}
            unstarted_teams = {tid for tid, start_list in team_fixtures_started.items() if not any(start_list)}
            # Any of the 20 Premier League clubs with 0 active fixtures in this GW (e.g. Blank GW or postponed)
            # are considered finished (have 0 matches remaining) and are not unstarted.
            all_pl_team_ids = set(range(1, 21))
            active_team_ids = set(team_fixtures_done.keys())
            blank_or_postponed_teams = all_pl_team_ids - active_team_ids
            finished_teams.update(blank_or_postponed_teams)
            return is_started, is_finished, finished_teams, unstarted_teams
    except Exception as e:
        print(f"Notice checking fixtures for GW {gw_id}: {e}")
    return False, False, set(), set()

def is_gw_fixtures_finished(gw_id):
    _, finished, _, _ = get_gw_fixture_status(gw_id)
    return finished

def get_active_in_play_fixture_count(gw_id):
    """
    Check FPL fixtures API to count fixtures currently in-play.
    A match is considered in-play if:
    - started is True
    - finished is False
    - finished_provisional is False
    - not postponed
    Returns None if a transient network error occurs so callers can distinguish
    between '0 matches in-play' and 'API temporarily unreachable'.
    """
    try:
        fixtures = fetch(f'https://fantasy.premierleague.com/api/fixtures/?event={gw_id}')
        if isinstance(fixtures, list):
            active_fixtures = [f for f in fixtures if not bool(f.get('postponed'))]
            return sum(1 for f in active_fixtures if bool(f.get('started')) and not bool(f.get('finished')) and not bool(f.get('finished_provisional')))
        return 0
    except Exception as e:
        print(f"Notice checking in-play fixtures for GW {gw_id}: {e}")
        return None

def derive_season_info(events):
    """
    Derive machine season_id (e.g. '2026-27') and display string (e.g. '2026/27')
    from FPL bootstrap events deadline timestamps.
    """
    if not events:
        return "2026-27", "2026/27"
    ev1 = events[0]
    deadline_iso = ev1.get('deadline_time', '')
    if len(deadline_iso) >= 4 and deadline_iso[:4].isdigit():
        start_year = int(deadline_iso[:4])
        end_year_short = (start_year + 1) % 100
        return f"{start_year}-{end_year_short:02d}", f"{start_year}/{end_year_short:02d}"
    return "2026-27", "2026/27"

_last_publish_time = 0

def trigger_publish():
    """Regenerate dashboard HTML presentations and commit/push updates to GitHub."""
    global _last_publish_time
    if os.environ.get("GITHUB_ACTIONS") != "true":
        print(" -> [Live Matchday Publisher] Skipping git commit/push on local workstation.")
        return

    # Enforce minimum 5-minute cooldown between in-play pushes to stay within GitHub Pages 10 builds/hour limit
    now_ts = time.time()
    if now_ts - _last_publish_time < 300:
        remaining = int(300 - (now_ts - _last_publish_time))
        print(f" -> [Live Matchday Publisher] Cooldown active ({remaining}s remaining). Skipping micro-push.")
        return

    base_dir = os.path.dirname(os.path.abspath(__file__))
    update_script = os.path.join(base_dir, "update_preview.py")
    multi_json_path = os.path.join(base_dir, "multi_fpl_data.json")
    real_json_path = os.path.join(base_dir, "real_fpl_40700_data.json")
    try:
        print("\n -> [Live Matchday Publisher] Regenerating dashboard presentations...")
        subprocess.run([sys.executable, update_script], check=True, cwd=base_dir)
        subprocess.run(["git", "config", "user.name", "github-actions[bot]"], cwd=base_dir)
        subprocess.run(["git", "config", "user.email", "github-actions[bot]@users.noreply.github.com"], cwd=base_dir)
        subprocess.run(["git", "add", "-A"], check=True, cwd=base_dir)
        diff_chk = subprocess.run(["git", "diff", "--staged", "--quiet"], cwd=base_dir)
        if diff_chk.returncode != 0:
            commit_msg = "Auto-sync live FPL data (in-play update) [skip ci]"
            subprocess.run(["git", "commit", "-m", commit_msg], check=True, cwd=base_dir)
            push_res = subprocess.run(["git", "pull", "--rebase", "origin", "main"], cwd=base_dir)
            if push_res.returncode == 0:
                push_res = subprocess.run(["git", "push", "origin", "main"], cwd=base_dir)
            if push_res.returncode != 0:
                print("Notice: Git push conflict, preserving fresh sync data and resetting to origin/main...")
                saved_multi_obj = None
                saved_real_obj = None
                if os.path.exists(multi_json_path):
                    try:
                        with open(multi_json_path, "r", encoding="utf-8") as f:
                            saved_multi_obj = json.load(f)
                    except Exception:
                        pass
                if os.path.exists(real_json_path):
                    try:
                        with open(real_json_path, "r", encoding="utf-8") as f:
                            saved_real_obj = json.load(f)
                    except Exception:
                        pass
                subprocess.run(["git", "fetch", "origin", "main"], check=True, cwd=base_dir)
                subprocess.run(["git", "reset", "--hard", "origin/main"], check=True, cwd=base_dir)
                if saved_multi_obj is not None:
                    atomic_json_dump(saved_multi_obj, multi_json_path)
                if saved_real_obj is not None:
                    atomic_json_dump(saved_real_obj, real_json_path)
                subprocess.run([sys.executable, update_script], check=True, cwd=base_dir)
                subprocess.run(["git", "add", "-A"], check=True, cwd=base_dir)
                retry_diff = subprocess.run(["git", "diff", "--staged", "--quiet"], cwd=base_dir)
                if retry_diff.returncode != 0:
                    subprocess.run(["git", "commit", "-m", commit_msg], check=True, cwd=base_dir)
                    subprocess.run(["git", "push", "origin", "main"], check=True, cwd=base_dir)
            _last_publish_time = time.time()
            print("🚀 [Live Matchday Publisher] Successfully pushed live in-play update to GitHub!")
        else:
            print("   No staged changes to commit.")
    except Exception as e:
        print(f"Notice during live matchday publish: {e}")

def format_delta_friendly_json(d):
    """
    Format multi_fpl_data.json with line breaks per league, team, gameweek, and squad.
    Reduces Git commit delta size by ~99% while maintaining 100% JSON data fidelity.
    """
    lines = ['{']
    keys = list(d.keys())
    for i, k in enumerate(keys):
        val = d[k]
        comma = ',' if i < len(keys) - 1 else ''
        if k == 'leagues' and isinstance(val, dict):
            lines.append('  "leagues": {')
            lkeys = list(val.keys())
            for li, lid in enumerate(lkeys):
                lval = val[lid]
                lcomma = ',' if li < len(lkeys) - 1 else ''
                lines.append(f'    "{lid}": {{')
                lines.append(f'      "id": {json.dumps(lval.get("id"))},')
                lines.append(f'      "name": {json.dumps(lval.get("name"))},')
                lines.append(f'      "season": {json.dumps(lval.get("season"))},')
                
                # Teams: one team per line
                teams = lval.get("teams", [])
                lines.append('      "teams": [')
                for ti, t in enumerate(teams):
                    tcomma = ',' if ti < len(teams) - 1 else ''
                    lines.append('        ' + json.dumps(t, ensure_ascii=False, separators=(',', ':')) + tcomma)
                lines.append('      ],')
                
                # Gameweeks: one GW per line
                gws = lval.get("gameweeks", {})
                lines.append('      "gameweeks": {')
                gw_keys = sorted(list(gws.keys()), key=lambda x: int(x) if str(x).isdigit() else 0)
                for gi, gw in enumerate(gw_keys):
                    gcomma = ',' if gi < len(gw_keys) - 1 else ''
                    lines.append(f'        "{gw}": ' + json.dumps(gws[gw], ensure_ascii=False, separators=(',', ':')) + gcomma)
                lines.append('      },')
                
                # Squads: one squad per line
                sqs = lval.get("squads", {})
                lines.append('      "squads": {')
                sq_keys = list(sqs.keys())
                for si, sk in enumerate(sq_keys):
                    scomma = ',' if si < len(sq_keys) - 1 else ''
                    lines.append(f'        "{sk}": ' + json.dumps(sqs[sk], ensure_ascii=False, separators=(',', ':')) + scomma)
                lines.append('      }')
                lines.append(f'    }}{lcomma}')
            lines.append('  }' + comma)
        else:
            lines.append(f'  "{k}": {json.dumps(val, ensure_ascii=False, separators=(",", ":"))}{comma}')
    lines.append('}')
    return '\n'.join(lines)

def atomic_json_dump(data, file_path, create_backup=True):
    """Safely write JSON to an isolated temp file first, then atomically replace the target file."""
    temp_path = f"{file_path}.tmp.{os.getpid()}_{time.time_ns()}"
    try:
        with open(temp_path, 'w', encoding='utf-8') as f:
            if isinstance(data, dict) and "leagues" in data:
                f.write(format_delta_friendly_json(data))
            else:
                json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
        if create_backup and os.path.exists(file_path):
            bak_path = f"{file_path}.bak"
            bak_tmp = f"{bak_path}.tmp.{os.getpid()}_{time.time_ns()}"
            try:
                shutil.copyfile(file_path, bak_tmp)
                os.replace(bak_tmp, bak_path)
            except Exception:
                if os.path.exists(bak_tmp):
                    try:
                        os.remove(bak_tmp)
                    except Exception:
                        pass
        os.replace(temp_path, file_path)
    except Exception as e:
        if os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass
        raise e

def check_data_has_changed(cached_data, new_output):
    """
    Compare cached data and new output to detect any meaningful changes:
    - Gameweek count / max_gw
    - League structure or team count
    - Team scores (points, hits, net_points, captain, chip) in any gameweek
    - Gameweek is_finished status
    Returns True if data changed, False if 100% identical.
    """
    if not cached_data or "leagues" not in cached_data:
        return True

    if cached_data.get("max_gw") != new_output.get("max_gw"):
        return True

    cached_leagues = cached_data.get("leagues", {})
    new_leagues = new_output.get("leagues", {})

    if set(cached_leagues.keys()) != set(new_leagues.keys()):
        return True

    for lid, new_l in new_leagues.items():
        cached_l = cached_leagues.get(lid, {})
        
        # Compare teams count
        if len(cached_l.get("teams", [])) != len(new_l.get("teams", [])):
            return True

        # Compare gameweeks results
        cached_gws = cached_l.get("gameweeks", {})
        new_gws = new_l.get("gameweeks", {})

        if set(cached_gws.keys()) != set(new_gws.keys()):
            return True

        for gw_str, new_gw in new_gws.items():
            cached_gw = cached_gws.get(gw_str, {})
            if (cached_gw.get("is_finished") != new_gw.get("is_finished") or
                cached_gw.get("is_started") != new_gw.get("is_started") or
                cached_gw.get("data_checked") != new_gw.get("data_checked") or
                cached_gw.get("unstarted_teams") != new_gw.get("unstarted_teams")):
                return True
            
            # Compare results list
            c_res = {r["entry_id"]: r for r in cached_gw.get("results", [])}
            n_res = {r["entry_id"]: r for r in new_gw.get("results", [])}

            if set(c_res.keys()) != set(n_res.keys()):
                return True

            for eid, nr in n_res.items():
                cr = c_res.get(eid)
                if not cr:
                    return True
                # Check points, hits, net_points, captain, chip, bench_points, team_value, bank, transfers
                if (cr.get("points") != nr.get("points") or
                    cr.get("hits") != nr.get("hits") or
                    cr.get("net_points") != nr.get("net_points") or
                    cr.get("captain") != nr.get("captain") or
                    cr.get("chip") != nr.get("chip") or
                    cr.get("bench_points") != nr.get("bench_points") or
                    cr.get("team_value") != nr.get("team_value") or
                    cr.get("bank") != nr.get("bank") or
                    cr.get("transfers_count") != nr.get("transfers_count") or
                    cr.get("transfers_net_impact") != nr.get("transfers_net_impact")):
                    return True

        # Check active GW squads for auto_subs or player status updates
        max_gw_s = str(new_output.get("max_gw", ""))
        if max_gw_s:
            c_squads = cached_l.get("squads", {})
            n_squads = new_l.get("squads", {})
            for r in new_gws.get(max_gw_s, {}).get("results", []):
                s_key = f"{r['entry_id']}_{max_gw_s}"
                csq = c_squads.get(s_key, {})
                nsq = n_squads.get(s_key, {})
                if csq.get("auto_subs") != nsq.get("auto_subs"):
                    return True
                c_start = [(p.get("id"), p.get("points"), p.get("not_played_yet")) for p in csq.get("starting", [])]
                n_start = [(p.get("id"), p.get("points"), p.get("not_played_yet")) for p in nsq.get("starting", [])]
                if c_start != n_start:
                    return True

    return False

def sync_once(args):
    start_time = time.time()
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Starting FPL Sync Engine (force={args.force})...")

    # 1. Fetch bootstrap-static (with FPL Maintenance Window resiliency)
    print("Fetching bootstrap-static...")
    try:
        boot = fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
    except Exception as e:
        print(f"\n⚠️  [Resilience Notice] FPL API unavailable (possible maintenance / 503 / network issue): {e}")
        base_dir = os.path.dirname(os.path.abspath(__file__))
        multi_json_path = os.path.join(base_dir, 'multi_fpl_data.json')
        c_data = load_cached_data(multi_json_path)
        if c_data:
            print("   Safely preserving existing cached data without crash.")
            try:
                c_data["sync_status"] = "offline"
                atomic_json_dump(c_data, multi_json_path)
            except Exception:
                pass
            print("   Dashboard will continue serving latest available scores. Exiting cleanly (code 0).")
            return False, 0, 1
        else:
            print("   Fatal: No existing cache found to fall back to.")
            raise e

    elements = {p['id']: p for p in boot['elements']}
    teams_by_id = {t['id']: t['short_name'] for t in boot['teams']}
    element_types = {et['id']: et['singular_name_short'] for et in boot['element_types']}

    events = boot['events']
    current_event = next((e for e in events if e['is_current']), events[0])
    max_gw = current_event['id']

    # Extract gameweek deadlines and next upcoming deadline
    events_deadlines = []
    next_deadline_event = None
    now_epoch = int(time.time())
    for ev in events:
        ev_id = ev.get('id')
        ev_name = ev.get('name', f"Gameweek {ev_id}")
        ev_deadline_epoch = ev.get('deadline_time_epoch', 0)
        ev_deadline_iso = ev.get('deadline_time', '')
        ev_is_current = bool(ev.get('is_current'))
        ev_is_next = bool(ev.get('is_next'))
        ev_finished = bool(ev.get('finished'))
        item = {
            "id": ev_id,
            "name": ev_name,
            "deadline_epoch": ev_deadline_epoch,
            "deadline_iso": ev_deadline_iso,
            "is_current": ev_is_current,
            "is_next": ev_is_next,
            "finished": ev_finished
        }
        events_deadlines.append(item)
        if ev_is_next and not next_deadline_event:
            next_deadline_event = {
                "id": ev_id,
                "name": ev_name,
                "deadline_epoch": ev_deadline_epoch,
                "deadline_iso": ev_deadline_iso
            }

    if not next_deadline_event:
        for ev in events_deadlines:
            if ev["deadline_epoch"] > now_epoch:
                next_deadline_event = {
                    "id": ev["id"],
                    "name": ev["name"],
                    "deadline_epoch": ev["deadline_epoch"],
                    "deadline_iso": ev["deadline_iso"]
                }
                break

    # 2. Determine Smart Finished and Started status for all GWs up to max_gw
    gw_status_map = {}
    gw_started_map = {}
    gw_checked_map = {}
    gw_finished_teams_map = {}
    gw_unstarted_teams_map = {}
    for gw_info in events:
        gw_id = gw_info['id']
        if gw_id <= max_gw:
            bootstrap_finished = bool(gw_info.get('finished'))
            data_checked = bool(gw_info.get('data_checked'))
            gw_checked_map[gw_id] = data_checked
            if bootstrap_finished:
                gw_status_map[gw_id] = True
                gw_started_map[gw_id] = True
                gw_finished_teams_map[gw_id] = set(teams_by_id.keys())
                gw_unstarted_teams_map[gw_id] = set()
            else:
                is_started, fixtures_fin, fin_teams, unstarted_teams = get_gw_fixture_status(gw_id)
                gw_status_map[gw_id] = fixtures_fin
                gw_started_map[gw_id] = is_started or fixtures_fin
                gw_finished_teams_map[gw_id] = fin_teams
                gw_unstarted_teams_map[gw_id] = unstarted_teams
                if fixtures_fin:
                    print(f" -> Smart Fixture Check: GW {gw_id} matches all finished! Marked as finished (provisional).")
                elif is_started:
                    print(f" -> GW {gw_id}: Currently LIVE in progress. (Unstarted teams: {len(unstarted_teams)})")
                else:
                    print(f" -> GW {gw_id}: Pre-Match / Squads locked (0 matches kicked off).")

    # 2.5 Season Derivation & Rollover Guard
    season_id, season_display = derive_season_info(events)
    print(f"Detected FPL Season: {season_display} (Machine ID: {season_id})")

    # 3. Load leagues config
    base_dir = os.path.dirname(os.path.abspath(__file__))
    season_cfg_path = os.path.join(base_dir, 'config', 'season_config.json')
    configured_season = None
    if os.path.exists(season_cfg_path):
        try:
            with open(season_cfg_path, 'r', encoding='utf-8') as f:
                s_cfg = json.load(f)
                configured_season = s_cfg.get("current_season")
        except Exception as e:
            print(f"Warning reading season_config.json: {e}")

    if configured_season and season_id != configured_season:
        print("\n" + "=" * 70)
        print("🚨 [SEASON ROLLOVER GUARD TRIGGERED] 🚨")
        print(f"   FPL API reports new season: '{season_id}' (GW 1: {events[0].get('deadline_time')})")
        print(f"   Configured active season:   '{configured_season}'")
        print("   CRITICAL: Sync halted to prevent overwriting previous season data!")
        print("   Action required: Run 'python3 archive_season.py' to preserve the past season,")
        print("   then update 'config/season_config.json' and 'config/leagues_config.json'.")
        print("=" * 70 + "\n")
        multi_json_path = os.path.join(base_dir, 'multi_fpl_data.json')
        c_data = load_cached_data(multi_json_path)
        if c_data:
            c_data["sync_status"] = "season_rollover_blocked"
            atomic_json_dump(c_data, multi_json_path)
        sys.exit(2)

    config_path = os.path.join(base_dir, 'config', 'leagues_config.json')
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            leagues_config = json.load(f)
    else:
        leagues_config = {
            "40700": {"id": 40700, "name": "เซียนอยู่รู หมูอยู่ตึก"},
            "675290": {"id": 675290, "name": "NudNee"},
            "38491": {"id": 38491, "name": "รอ แมน โอน"},
            "1101958": {"id": 1101958, "name": "Barley's Official League"},
            "438691": {"id": 438691, "name": "2 spade"},
            "187827": {"id": 187827, "name": "Shi62"},
            "5349": {"id": 5349, "name": "Bramann League"}
        }

    # 4. Load existing multi_fpl_data.json for Incremental Sync caching
    multi_json_path = os.path.join(base_dir, 'multi_fpl_data.json')
    cached_data = None
    if not args.force:
        cached_data = load_cached_data(multi_json_path)
        if cached_data:
            print("Loaded existing multi_fpl_data.json cache for incremental sync.")

    # Determine which GWs need live points fetched
    gws_to_fetch_live = set()
    for gw in range(1, max_gw + 1):
        if args.force or not gw_status_map.get(gw, False) or (gw == max_gw and not gw_checked_map.get(gw, False)):
            gws_to_fetch_live.add(gw)
        else:
            needs_gw = False
            if cached_data and "leagues" in cached_data:
                for lid_str in leagues_config.keys():
                    cached_league = cached_data["leagues"].get(lid_str)
                    if not cached_league or str(gw) not in cached_league.get("gameweeks", {}):
                        needs_gw = True
                        break
            else:
                needs_gw = True
            if needs_gw:
                gws_to_fetch_live.add(gw)

    live_by_gw = {}
    live_mins_by_gw = {}
    for gw in range(1, max_gw + 1):
        if gw in gws_to_fetch_live:
            try:
                print(f"Fetching live elements for GW {gw}...")
                live_data = fetch(f'https://fantasy.premierleague.com/api/event/{gw}/live/')
                live_by_gw[gw] = {el['id']: el['stats']['total_points'] for el in live_data['elements']}
                live_mins_by_gw[gw] = {el['id']: el['stats']['minutes'] for el in live_data['elements']}
            except Exception as e:
                print(f"Error fetching live GW {gw}: {e}")
                live_by_gw[gw] = {}
                live_mins_by_gw[gw] = {}
        else:
            print(f"Skipping live elements fetch for completed GW {gw} (using cached squad points).")

    def ensure_live_gw(gw_num):
        if gw_num not in live_by_gw or not live_by_gw[gw_num]:
            try:
                print(f" -> Fetching live elements for GW {gw_num}...")
                ld = fetch(f'https://fantasy.premierleague.com/api/event/{gw_num}/live/')
                live_by_gw[gw_num] = {el['id']: el['stats']['total_points'] for el in ld['elements']}
                live_mins_by_gw[gw_num] = {el['id']: el['stats']['minutes'] for el in ld['elements']}
            except Exception as err:
                print(f"Error fetching live GW {gw_num}: {err}")
                if gw_num not in live_by_gw:
                    live_by_gw[gw_num] = {}
                if gw_num not in live_mins_by_gw:
                    live_mins_by_gw[gw_num] = {}
        return live_by_gw[gw_num]

    # Thai timestamp formatting
    thai_months = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
    tz_th = timezone(timedelta(hours=7))
    now_th = datetime.now(tz_th)
    sync_time_str = f"{now_th.day} {thai_months[now_th.month]} {now_th.year}, {now_th.strftime('%H:%M น.')}"
    sync_iso_str = now_th.strftime('%Y-%m-%d %H:%M:%S')

    multi_league_output = {
        "last_sync": sync_time_str,
        "last_sync_iso": sync_iso_str,
        "sync_status": "ok",
        "season_id": season_id,
        "season": season_display,
        "max_gw": max_gw,
        "league_order": list(leagues_config.keys()),
        "next_deadline": next_deadline_event,
        "events_deadlines": events_deadlines,
        "leagues": {}
    }

    global_picks_cache = {}
    picks_lock = threading.Lock()
    summary_stats = []

    for lid_str, lcfg in leagues_config.items():
        lid = int(lid_str)
        league_name_cfg = lcfg.get('name', 'League')
        print(f"\nProcessing League {lid} ({league_name_cfg})...")
        try:
            page = 1
            standings_teams = []
            league_name = league_name_cfg
            while True:
                league_resp = fetch(f'https://fantasy.premierleague.com/api/leagues-classic/{lid}/standings/?page_standings={page}')
                if 'league' in league_resp and 'name' in league_resp['league']:
                    league_name = league_resp['league']['name']
                results = league_resp.get('standings', {}).get('results', [])
                standings_teams.extend(results)
                has_next = league_resp.get('standings', {}).get('has_next', False)
                if not has_next or not results:
                    break
                page += 1

            # Deduplicate by entry_id if needed
            seen_entries = set()
            unique_standings_teams = []
            for t in standings_teams:
                if t['entry'] not in seen_entries:
                    seen_entries.add(t['entry'])
                    unique_standings_teams.append(t)
            standings_teams = unique_standings_teams

            # If non-prize teams are configured but missing from standings (e.g. GEMINI UNITED unranked in 187827), append them
            non_prize_cfg = lcfg.get('non_prize_teams', [])
            for np_id in non_prize_cfg:
                np_id_int = int(np_id)
                if not any(t['entry'] == np_id_int for t in standings_teams):
                    try:
                        e_info = fetch(f'https://fantasy.premierleague.com/api/entry/{np_id_int}/')
                        p_name = f"{e_info.get('player_first_name', '')} {e_info.get('player_last_name', '')}".strip()
                        standings_teams.append({
                            'entry': np_id_int,
                            'entry_name': e_info.get('name', 'GEMINI UNITED'),
                            'player_name': p_name or 'GEMINI UNITED',
                            'rank': 999,
                            'last_rank': 999,
                            'total': e_info.get('summary_overall_points', 0),
                            'event_total': e_info.get('summary_event_points', 0)
                        })
                        print(f" -> [Non-Prize] Appended {e_info.get('name')} ({np_id_int}) to standings for league {lid}.")
                    except Exception as e:
                        print(f"Notice fetching non_prize team {np_id_int}: {e}")

            cached_league = cached_data.get("leagues", {}).get(lid_str, {}) if cached_data else {}
            teams_list = []
            for t in standings_teams:
                teams_list.append({
                    "entry_id": t['entry'],
                    "entry_name": t['entry_name'],
                    "player_name": t['player_name'],
                    "rank": t.get('rank'),
                    "last_rank": t.get('last_rank'),
                    "total_points": t.get('total'),
                    "event_total": t.get('event_total')
                })

            gameweeks_dict = {}
            for gw_id in range(1, max_gw + 1):
                gameweeks_dict[str(gw_id)] = {
                    "gw": gw_id,
                    "is_finished": gw_status_map.get(gw_id, False),
                    "is_started": gw_started_map.get(gw_id, False),
                    "data_checked": gw_checked_map.get(gw_id, False),
                    "results": []
                }

            squads_dict = {}
            cached_gw_data = cached_league.get("gameweeks", {})
            cached_squads = cached_league.get("squads", {})

            work_items = []
            gw_can_reuse_raw_picks_map = {}
            for gw in range(1, max_gw + 1):
                gw_is_finished = gw_status_map.get(gw, False)
                gw_is_started = gw_started_map.get(gw, False)
                cached_gw = cached_gw_data.get(str(gw), {})
                cached_res = cached_gw.get("results", [])
                
                # Check if cached results exist and are non-corrupted (> 0 pts) and contain enriched transfer data
                has_corrupt_cache = (not cached_res) or all(r.get("points", 0) == 0 and r.get("net_points", 0) == 0 for r in cached_res)
                needs_enrichment = any(r.get("team_value") is None or r.get("transfers_net_impact") is None for r in cached_res)
                
                # Resiliency: Only treat a GW as fully finalized once it was ALREADY cached with data_checked=True
                is_checked = gw_checked_map.get(gw, False)
                cached_checked = cached_gw.get("data_checked", False)
                gw_fully_finalized = bool(cached_checked)

                # Check for points mismatch against official event_total for max_gw
                has_points_mismatch = False
                if gw == max_gw and gw_is_finished and cached_res:
                    c_pts_map = {r.get("entry_id"): r.get("points") for r in cached_res}
                    for t_obj in standings_teams:
                        ev_tot = t_obj.get('event_total')
                        if ev_tot is not None and t_obj['entry'] in c_pts_map:
                            if c_pts_map[t_obj['entry']] != ev_tot:
                                has_points_mismatch = True
                                break

                # Only reuse raw_picks when:
                # 1. GW is live in progress (started but not finished -> picks are locked and automatic_subs haven't run yet), OR
                # 2. GW is finished, fully finalized (data_checked settled), and has no points mismatch.
                gw_can_reuse_raw_picks_map[gw] = (
                    (not gw_is_finished and gw_is_started)
                    or (gw_is_finished and gw_fully_finalized and not has_points_mismatch and not has_corrupt_cache)
                )

                if not args.force and gw_is_finished and cached_gw.get("is_finished") and gw_fully_finalized and not has_corrupt_cache and not needs_enrichment and not has_points_mismatch:
                    cached_res_map = {r["entry_id"]: r for r in cached_res if (r.get("points", 0) > 0 or r.get("net_points", 0) > 0 or f"{r['entry_id']}_{gw}" in cached_squads)}
                    
                    teams_to_fetch_gw = []
                    for t_obj in standings_teams:
                        eid = t_obj['entry']
                        s_key = f"{eid}_{gw}"
                        if (gw < max_gw or gw_is_started) and s_key in cached_squads and cached_squads[s_key] and cached_squads[s_key].get("dnp"):
                            squads_dict[s_key] = cached_squads[s_key]
                            continue
                        if eid in cached_res_map and s_key in cached_squads:
                            gameweeks_dict[str(gw)]["results"].append(cached_res_map[eid])
                            c_sq_obj = cached_squads.get(s_key)
                            if gw < max_gw and gw_fully_finalized and isinstance(c_sq_obj, dict):
                                c_sq_obj = {k: v for k, v in c_sq_obj.items() if k not in ("raw_picks", "raw_hist")}
                            squads_dict[s_key] = c_sq_obj
                        else:
                            teams_to_fetch_gw.append(t_obj)
                            
                    if len(teams_to_fetch_gw) == 0:
                        print(f" -> Reusing cached data for League {lid} GW {gw} (Finished, {len(standings_teams)} teams)")
                        gameweeks_dict[str(gw)]["is_finished"] = True
                        gameweeks_dict[str(gw)]["is_started"] = True
                        continue
                    else:
                        print(f" -> Reused {len(gameweeks_dict[str(gw)]['results'])} cached teams, fetching {len(teams_to_fetch_gw)} new/missing teams for League {lid} GW {gw}...")
                        for t_obj in teams_to_fetch_gw:
                            work_items.append((t_obj, gw))
                else:
                    for t_obj in standings_teams:
                        work_items.append((t_obj, gw))

            if work_items:
                # Ensure live elements are available for any GW present in work_items
                work_gws = set(gw for (_, gw) in work_items)
                for wgw in work_gws:
                    if wgw not in live_by_gw or not live_by_gw[wgw]:
                        try:
                            print(f" -> Fetching live elements for GW {wgw} (required for team picks)...")
                            live_data = fetch(f'https://fantasy.premierleague.com/api/event/{wgw}/live/')
                            live_by_gw[wgw] = {el['id']: el['stats']['total_points'] for el in live_data['elements']}
                            live_mins_by_gw[wgw] = {el['id']: el['stats']['minutes'] for el in live_data['elements']}
                        except Exception as e:
                            print(f"Error fetching live GW {wgw}: {e}")
                            if wgw not in live_by_gw:
                                live_by_gw[wgw] = {}
                            if wgw not in live_mins_by_gw:
                                live_mins_by_gw[wgw] = {}

                print(f" -> Fetching {len(work_items)} team-gameweek picks for League {lid}...")

                def process_team_picks(entry_tuple):
                    t_obj, gw = entry_tuple
                    eid = t_obj['entry']
                    this_gw_finished = gw_status_map.get(gw, False)
                    this_gw_started = gw_started_map.get(gw, False)
                    this_gw_checked = gw_checked_map.get(gw, False)
                    can_reuse_raw_picks = gw_can_reuse_raw_picks_map.get(gw, False)
                    try:
                        s_key = f"{eid}_{gw}"
                        cached_sq = cached_squads.get(s_key)
                        is_safe_cached_sq = cached_sq and cached_sq.get("raw_picks") and (
                            (not this_gw_finished and this_gw_started) or cached_sq.get("final_checked") or not this_gw_checked
                        )
                        if not args.force and can_reuse_raw_picks and is_safe_cached_sq:
                            picks = cached_sq.get("raw_picks", [])
                            hist = cached_sq.get("raw_hist", {})
                            chip = cached_sq.get("chip")
                            hits = int(hist.get('event_transfers_cost') if hist.get('event_transfers_cost') is not None else (cached_sq.get("hits") or 0))
                            chip_norm = str(chip or '').strip().lower().replace('_', '')
                            if chip_norm in ('wildcard', 'freehit'):
                                hits = 0
                            auto_subs = cached_sq.get("auto_subs", [])
                        else:
                            cache_key = (eid, gw)
                            with picks_lock:
                                picks_resp = global_picks_cache.get(cache_key)
                            if picks_resp is None:
                                picks_resp = fetch(f'https://fantasy.premierleague.com/api/entry/{eid}/event/{gw}/picks/')
                                with picks_lock:
                                    global_picks_cache[cache_key] = picks_resp
                            hist = picks_resp.get('entry_history', {})
                            chip = picks_resp.get('active_chip')
                            hits = int(hist.get('event_transfers_cost') or 0)
                            chip_norm = str(chip or '').strip().lower().replace('_', '')
                            if chip_norm in ('wildcard', 'freehit'):
                                hits = 0
                            auto_subs = picks_resp.get('automatic_subs', [])
                            picks = picks_resp.get('picks', [])
                        starters = []
                        bench = []
                        capt_name = '-'
                        live_pts_gw = live_by_gw.get(gw, {})
                        live_mins_gw = live_mins_by_gw.get(gw, {})

                        # Clone picks so cached_sq['raw_picks'] is never mutated in-place
                        raw_picks = [dict(p) for p in picks]

                        # Identify initial captain and vice-captain
                        cap_pick = next((p for p in raw_picks if p.get('is_captain')), None)
                        vc_pick = next((p for p in raw_picks if p.get('is_vice_captain')), None)
                        orig_cap_id = cap_pick['element'] if cap_pick else None
                        orig_vc_id = vc_pick['element'] if vc_pick else None

                        if cap_pick:
                            el_info = elements.get(cap_pick['element'], {})
                            capt_name = el_info.get('web_name', 'Captain')

                        # Starters and bench cloned independently for safe substitution/promotion
                        actual_starters_picks = [dict(p) for p in raw_picks if p.get('position', 1) <= 11]
                        actual_bench_picks = [dict(p) for p in raw_picks if p.get('position', 1) > 11]
                        final_auto_subs = list(auto_subs)
                        is_bboost = chip in ('bboost', 'bench_boost')
                        default_cap_mult = 3 if chip in ('3xc', 'triple_captain') else 2

                        # 1. Apply official FPL automatic substitutions (when confirmed by FPL)
                        if auto_subs:
                            for sub in auto_subs:
                                el_in = sub.get('element_in')
                                el_out = sub.get('element_out')
                                s_match = next((p for p in actual_starters_picks if p['element'] == el_out), None)
                                b_match = next((p for p in actual_bench_picks if p['element'] == el_in), None)
                                if s_match and b_match:
                                    s_idx = actual_starters_picks.index(s_match)
                                    b_idx = actual_bench_picks.index(b_match)
                                    b_match_copy = dict(b_match)
                                    b_match_copy['multiplier'] = b_match.get('multiplier') if b_match.get('multiplier', 0) > 0 else 1
                                    s_match_copy = dict(s_match)
                                    s_match_copy['multiplier'] = 0
                                    actual_starters_picks[s_idx] = b_match_copy
                                    actual_bench_picks[b_idx] = s_match_copy
                                    if s_match.get('is_captain'):
                                        s_match_copy['is_captain'] = False
                        elif not is_bboost:
                            # 2. Provisional Real-Time Auto-Substitutions during live matches:
                            # If a starter's fixture is finished and they played 0 minutes,
                            # find eligible bench player in priority order (pos 12, 13, 14, 15) that maintains valid formation:
                            # exactly 1 GKP, at least 3 DEF, 2 MID, 1 FWD.
                            bench_sorted = sorted(actual_bench_picks, key=lambda x: x.get('position', 99))
                            used_bench_elements = set()

                            for s_pick in list(actual_starters_picks):
                                s_eid = s_pick['element']
                                s_info = elements.get(s_eid, {})
                                s_tid = s_info.get('team')
                                s_finished = this_gw_finished or (s_tid in gw_finished_teams_map.get(gw, set()))
                                s_mins = live_mins_gw.get(s_eid, 0)

                                if s_finished and s_mins == 0:
                                    s_pos_type = element_types.get(s_info.get('element_type'), 'MID')
                                    for b_pick in bench_sorted:
                                        b_eid = b_pick['element']
                                        if b_eid in used_bench_elements:
                                            continue
                                        b_info = elements.get(b_eid, {})
                                        b_tid = b_info.get('team')
                                        b_finished = this_gw_finished or (b_tid in gw_finished_teams_map.get(gw, set()))
                                        b_mins = live_mins_gw.get(b_eid, 0)
                                        if b_finished and b_mins == 0:
                                            continue
                                        b_pos_type = element_types.get(b_info.get('element_type'), 'MID')

                                        # GK can only replace GK
                                        if s_pos_type == 'GKP':
                                            if b_pos_type != 'GKP':
                                                continue
                                        else:
                                            if b_pos_type == 'GKP':
                                                continue

                                        # Test hypothetical formation if swapped
                                        hypo_starters = [p for p in actual_starters_picks if p['element'] != s_eid] + [b_pick]
                                        hypo_types = [element_types.get(elements.get(p['element'], {}).get('element_type'), 'MID') for p in hypo_starters]
                                        def_cnt = hypo_types.count('DEF')
                                        mid_cnt = hypo_types.count('MID')
                                        fwd_cnt = hypo_types.count('FWD')
                                        gkp_cnt = hypo_types.count('GKP')

                                        if gkp_cnt == 1 and def_cnt >= 3 and mid_cnt >= 2 and fwd_cnt >= 1:
                                            if b_mins == 0 and not b_finished:
                                                # This bench slot is next in priority and its fixture hasn't finished yet;
                                                # reserve priority for this bench slot without subbing in a 0-min player yet.
                                                used_bench_elements.add(b_eid)
                                                break
                                            s_idx = actual_starters_picks.index(s_pick)
                                            b_idx = actual_bench_picks.index(b_pick)

                                            b_copy = dict(b_pick)
                                            b_copy['multiplier'] = 1
                                            s_copy = dict(s_pick)
                                            s_copy['multiplier'] = 0

                                            actual_starters_picks[s_idx] = b_copy
                                            actual_bench_picks[b_idx] = s_copy
                                            used_bench_elements.add(b_eid)
                                            final_auto_subs.append({
                                                "element_in": b_eid,
                                                "element_out": s_eid,
                                                "is_provisional": True
                                            })
                                            if s_pick.get('is_captain'):
                                                s_copy['is_captain'] = False
                                            break

                        # 3. Robust Captain and Vice-Captain Resolution:
                        # Evaluated comprehensively across scoring pool after all substitutions run.
                        scoring_pool = actual_starters_picks + (actual_bench_picks if is_bboost else [])
                        orig_cap_in_pool = next((p for p in scoring_pool if p['element'] == orig_cap_id), None)
                        orig_cap_tid = elements.get(orig_cap_id, {}).get('team') if orig_cap_id else None
                        orig_cap_fixture_fin = this_gw_finished or (orig_cap_tid in gw_finished_teams_map.get(gw, set()))
                        orig_cap_played_zero = orig_cap_fixture_fin and live_mins_gw.get(orig_cap_id, 0) == 0

                        orig_vc_tid = elements.get(orig_vc_id, {}).get('team') if orig_vc_id else None
                        orig_vc_fixture_fin = this_gw_finished or (orig_vc_tid in gw_finished_teams_map.get(gw, set()))
                        orig_vc_played_zero = orig_vc_fixture_fin and live_mins_gw.get(orig_vc_id, 0) == 0

                        active_vc_in_pool = next((p for p in scoring_pool if p['element'] == orig_vc_id), None)
                        fpl_promoted_vc = active_vc_in_pool and active_vc_in_pool.get('multiplier', 1) >= 2
                        cap_failed = (orig_cap_in_pool is None) or orig_cap_played_zero or (orig_cap_in_pool.get('multiplier') == 0)

                        if orig_vc_id and active_vc_in_pool and ((cap_failed and not orig_vc_played_zero) or fpl_promoted_vc):
                            # Promote Vice-Captain to Captain
                            active_vc_in_pool['multiplier'] = default_cap_mult
                            active_vc_in_pool['is_captain'] = True
                            if orig_cap_in_pool and orig_cap_in_pool['element'] != active_vc_in_pool['element']:
                                orig_cap_in_pool['is_captain'] = False
                                if orig_cap_in_pool.get('multiplier', 1) > 1:
                                    orig_cap_in_pool['multiplier'] = 1
                            for bp in actual_bench_picks:
                                if bp['element'] == orig_cap_id:
                                    bp['is_captain'] = False
                                    bp['multiplier'] = 0
                            vc_info = elements.get(orig_vc_id, {})
                            capt_name = vc_info.get('web_name', 'Captain')
                        elif orig_cap_in_pool:
                            orig_cap_in_pool['multiplier'] = 0 if orig_cap_played_zero else default_cap_mult
                            orig_cap_in_pool['is_captain'] = True
                            cap_info = elements.get(orig_cap_id, {})
                            capt_name = cap_info.get('web_name', 'Captain')
                        elif orig_cap_id:
                            for bp in actual_bench_picks:
                                if bp['element'] == orig_cap_id:
                                    bp['is_captain'] = True
                                    bp['multiplier'] = 0
                            cap_info = elements.get(orig_cap_id, {})
                            capt_name = cap_info.get('web_name', 'Captain')

                        gw_is_fin = gw_status_map.get(gw, False)
                        unstarted_tids = gw_unstarted_teams_map.get(gw, set())

                        for p in actual_starters_picks:
                            pid = p['element']
                            mult = p.get('multiplier', 1)
                            is_cap = p.get('is_captain', False)
                            is_vice = p.get('is_vice_captain', False)
                            el_info = elements.get(pid, {})
                            el_tid = el_info.get('team')
                            team_code = teams_by_id.get(el_tid, 'PL')
                            pos_code = element_types.get(el_info.get('element_type'), 'MID')
                            p_pts = live_pts_gw.get(pid, 0)
                            not_played = (not gw_is_fin) and (el_tid in unstarted_tids)
                            p_obj = {
                                "id": pid,
                                "name": el_info.get('web_name', 'Player'),
                                "pos": pos_code,
                                "team": team_code,
                                "team_code": el_info.get('team_code', 0),
                                "points": p_pts * mult,
                                "raw_points": p_pts,
                                "multiplier": mult,
                                "is_captain": is_cap,
                                "is_vice": is_vice,
                                "not_played_yet": not_played
                            }
                            if is_cap:
                                capt_name = el_info.get('web_name', 'Captain')
                            starters.append(p_obj)

                        for p in actual_bench_picks:
                            pid = p['element']
                            mult = p.get('multiplier', 1) if is_bboost else 1
                            is_cap = p.get('is_captain', False)
                            is_vice = p.get('is_vice_captain', False)
                            el_info = elements.get(pid, {})
                            el_tid = el_info.get('team')
                            team_code = teams_by_id.get(el_tid, 'PL')
                            pos_code = element_types.get(el_info.get('element_type'), 'MID')
                            p_pts = live_pts_gw.get(pid, 0)
                            not_played = (not gw_is_fin) and (el_tid in unstarted_tids)
                            p_obj = {
                                "id": pid,
                                "name": el_info.get('web_name', 'Player'),
                                "pos": pos_code,
                                "team": team_code,
                                "team_code": el_info.get('team_code', 0),
                                "points": p_pts * (mult if mult > 0 else 1),
                                "raw_points": p_pts,
                                "multiplier": mult,
                                "is_captain": is_cap,
                                "is_vice": is_vice,
                                "not_played_yet": not_played
                            }
                            if is_cap:
                                capt_name = el_info.get('web_name', 'Captain')
                            bench.append(p_obj)

                        start_raw = sum(p['points'] for p in starters)
                        bench_raw = sum(p['points'] for p in bench)

                        if is_bboost:
                            raw_points = start_raw + bench_raw
                            bench_pts_disp = 0
                        else:
                            raw_points = start_raw
                            bench_pts_disp = bench_raw

                        # Resiliency: Only override with official entry_history points once data_checked is True (settled)
                        # or if live raw_points is 0 while official_pts > 0.
                        official_pts = hist.get('points')
                        if official_pts is not None and official_pts > 0 and (raw_points == 0 or (this_gw_finished and this_gw_checked)):
                            raw_points = official_pts

                        hits = int(hits or 0)
                        net_points = raw_points - hits
                        team_val = round((hist.get('value') or 1000) / 10.0, 1)
                        team_bank = round((hist.get('bank') or 0) / 10.0, 1)
                        event_tx = hist.get('event_transfers', 0)

                        result_item = {
                            "entry_id": eid,
                            "team_name": t_obj['entry_name'],
                            "player_name": t_obj['player_name'],
                            "points": raw_points,
                            "hits": hits,
                            "net_points": net_points,
                            "captain": capt_name,
                            "chip": chip,
                            "bench_points": bench_pts_disp,
                            "team_value": team_val,
                            "bank": team_bank,
                            "transfers_count": event_tx,
                            "overall_rank": hist.get('overall_rank')
                        }

                        is_settled_past_gw = bool(gw < max_gw and this_gw_finished and this_gw_checked)
                        squad_item = {
                            "starting": starters,
                            "bench": bench,
                            "auto_subs": final_auto_subs,
                            "chip": chip,
                            "hits": hits,
                            "final_checked": bool(this_gw_finished and this_gw_checked)
                        }
                        if not is_settled_past_gw:
                            squad_item["raw_picks"] = raw_picks
                            squad_item["raw_hist"] = hist
                        return (gw, eid, result_item, squad_item)
                    except Exception as err:
                        print(f"Error {eid} GW {gw}: {err}")
                        if cached_gw_data and cached_squads:
                            c_gw = cached_gw_data.get(str(gw), {})
                            c_res = next((r for r in c_gw.get("results", []) if r.get("entry_id") == eid), None)
                            c_sq = cached_squads.get(f"{eid}_{gw}")
                            if (gw < max_gw or this_gw_started) and c_sq and c_sq.get("dnp"):
                                return (gw, eid, None, c_sq)
                            if c_res:
                                print(f" -> Recovered cached data for team {eid} GW {gw} following fetch error.")
                                return (gw, eid, c_res, c_sq or {})
                        
                        # Resilient fallback for 404 / late joiner / missing event picks (only mark DNP after GW starts)
                        if ("404" in str(err) or "Not Found" in str(err)) and (gw < max_gw or this_gw_started):
                            print(f" -> Team {eid} was not active in GW {gw} (404/joined late). Marking as DNP.")
                            dnp_squad = {
                                "dnp": True,
                                "starting": [],
                                "bench": [],
                                "auto_subs": []
                            }
                            return (gw, eid, None, dnp_squad)
                        print(f"⚠️ [WARNING] Failed to fetch team {eid} for GW {gw} and no valid cache exists! Team may be missing from this run.")
                        return None

                with ThreadPoolExecutor(max_workers=5) as executor:
                    fetched_results = list(executor.map(process_team_picks, work_items))

                for res in fetched_results:
                    if res:
                        gw, eid, result_item, squad_item = res
                        if result_item:
                            gameweeks_dict[str(gw)]["results"].append(result_item)
                        if squad_item:
                            squads_dict[f"{eid}_{gw}"] = squad_item

                # Cache Corruption Prevention: Recover any missing teams from previous cache
                for gw_idx in range(1, max_gw + 1):
                    gw_k = str(gw_idx)
                    cached_gw_res = cached_gw_data.get(gw_k, {}).get("results", []) if cached_gw_data else []
                    gameweeks_dict[gw_k]["results"] = recover_missing_teams_from_cache(
                        gameweeks_dict[gw_k]["results"],
                        cached_gw_res
                    )

                # Preserve any existing cached squads that were not refreshed
                if cached_squads:
                    for s_k, s_v in cached_squads.items():
                        if s_k not in squads_dict:
                            squads_dict[s_k] = s_v

                # Resiliency: Strictly deduplicate results by entry_id for all gameweeks
                for gw_key in gameweeks_dict:
                    seen_eids = set()
                    unique_res = []
                    for r in gameweeks_dict[gw_key]["results"]:
                        reid = r.get("entry_id")
                        if reid not in seen_eids:
                            seen_eids.add(reid)
                            unique_res.append(r)
                    gameweeks_dict[gw_key]["results"] = unique_res

                # Precompute O(1) web_name lookup map and helper to extract player element ID safely
                web_name_to_id = {el.get("web_name"): el_id for el_id, el in elements.items() if el.get("web_name")}
                def extract_pid(p):
                    if isinstance(p, dict):
                        if "id" in p and p["id"]:
                            return p["id"]
                        return web_name_to_id.get(p.get("name"))
                    return None

                # Calculate transfer impact between consecutive GWs for each team
                for gw in range(1, max_gw + 1):
                    gw_str = str(gw)
                    gw_res_list = gameweeks_dict[gw_str]["results"]
                    if (
                        not args.force
                        and gw < max_gw
                        and gw_status_map.get(gw, False)
                        and gw_res_list
                        and all(r.get("transfers_net_impact") is not None and r.get("transfer_moves") is not None for r in gw_res_list)
                    ):
                        continue
                    gw_live = ensure_live_gw(gw) if gw > 1 else None
                    for r in gw_res_list:
                        eid = r["entry_id"]
                        if gw == 1:
                            r["transfers_count"] = 0
                            r["transfers_pts_gain"] = 0
                            r["transfers_net_impact"] = 0
                            r["transfer_moves"] = []
                        else:
                            sq_curr = squads_dict.get(f"{eid}_{gw}")
                            # If previous gameweek was Free Hit, the baseline squad reverts back to before Free Hit
                            prev_gw = gw - 1
                            while prev_gw >= 1:
                                prev_res = gameweeks_dict.get(str(prev_gw), {}).get("results", [])
                                prev_r = next((x for x in prev_res if x.get("entry_id") == eid), None)
                                prev_chip = str(prev_r.get("chip") or '').strip().lower().replace('_', '') if prev_r else ''
                                if prev_r and prev_chip == "freehit":
                                    prev_gw -= 1
                                else:
                                    break
                            sq_prev = squads_dict.get(f"{eid}_{prev_gw}")
                            if sq_curr and sq_prev:
                                curr_ids = set(extract_pid(p) for p in sq_curr.get("starting", []) + sq_curr.get("bench", []) if extract_pid(p) is not None)
                                prev_ids = set(extract_pid(p) for p in sq_prev.get("starting", []) + sq_prev.get("bench", []) if extract_pid(p) is not None)
                                tin = curr_ids - prev_ids
                                tout = prev_ids - curr_ids
                                pts_in = sum(gw_live.get(pid, 0) for pid in tin) if gw_live else 0
                                pts_out = sum(gw_live.get(pid, 0) for pid in tout) if gw_live else 0
                                moves_gain = pts_in - pts_out
                                team_hits = int(r.get("hits") or 0)
                                net_impact = moves_gain - team_hits

                                moves = []
                                in_list = sorted(list(tin), key=lambda x: elements.get(x, {}).get('element_type', 99))
                                out_list = sorted(list(tout), key=lambda x: elements.get(x, {}).get('element_type', 99))
                                max_len = max(len(in_list), len(out_list))
                                for i in range(max_len):
                                    m_in_id = in_list[i] if i < len(in_list) else None
                                    m_out_id = out_list[i] if i < len(out_list) else None
                                    m_in_name = elements.get(m_in_id, {}).get("web_name", "-") if m_in_id else "-"
                                    m_out_name = elements.get(m_out_id, {}).get("web_name", "-") if m_out_id else "-"
                                    m_in_pts = gw_live.get(m_in_id, 0) if (gw_live and m_in_id) else 0
                                    m_out_pts = gw_live.get(m_out_id, 0) if (gw_live and m_out_id) else 0
                                    moves.append({
                                        "in": m_in_name,
                                        "in_id": m_in_id,
                                        "in_pts": m_in_pts,
                                        "out": m_out_name,
                                        "out_id": m_out_id,
                                        "out_pts": m_out_pts,
                                        "net": m_in_pts - m_out_pts
                                    })

                                r["transfers_count"] = len(tin)
                                r["transfers_pts_gain"] = moves_gain
                                r["transfers_net_impact"] = net_impact
                                r["transfer_moves"] = moves
                            else:
                                if "transfers_count" not in r:
                                    r["transfers_count"] = 0
                                r["transfers_pts_gain"] = 0
                                r["transfers_net_impact"] = -int(r.get("hits") or 0)
                                r["transfer_moves"] = []

            # Sort and finalize all gameweeks results
            for gw in range(1, max_gw + 1):
                gw_str = str(gw)
                gameweeks_dict[gw_str]["results"].sort(key=lambda x: x.get("net_points", 0), reverse=True)
                gameweeks_dict[gw_str]["is_finished"] = gw_status_map.get(gw, False)
                gameweeks_dict[gw_str]["is_started"] = gw_started_map.get(gw, False)
                gameweeks_dict[gw_str]["unstarted_teams"] = [teams_by_id.get(tid, str(tid)) for tid in gw_unstarted_teams_map.get(gw, set())]

            # Enrich teams_list with latest overall_rank
            latest_gw_res = {r["entry_id"]: r.get("overall_rank") for r in gameweeks_dict.get(str(max_gw), {}).get("results", []) if r.get("overall_rank")}
            for t in teams_list:
                if t["entry_id"] in latest_gw_res:
                    t["overall_rank"] = latest_gw_res[t["entry_id"]]

            if cached_league and cached_league.get("teams") and len(teams_list) == 0:
                print(f" -> [Resilience] Fetched teams empty for League {lid}. Safely falling back to cached league data.")
                multi_league_output["leagues"][str(lid)] = cached_league
            else:
                multi_league_output["leagues"][str(lid)] = {
                    "id": lid,
                    "name": league_name,
                    "season": season_display,
                    "teams": teams_list,
                    "gameweeks": gameweeks_dict,
                    "squads": squads_dict
                }

            summary_stats.append({
                "id": lid,
                "name": league_name,
                "teams_count": len(teams_list),
                "gws_count": max_gw
            })

        except Exception as e:
            print(f"Error processing league {lid}: {e}")
            if cached_data and "leagues" in cached_data and str(lid) in cached_data["leagues"]:
                print(f" -> [Resilience] Safely preserving existing cached data for League {lid}.")
                multi_league_output["leagues"][str(lid)] = cached_data["leagues"][str(lid)]
                summary_stats.append({
                    "id": lid,
                    "name": cached_data["leagues"][str(lid)].get("name", f"League {lid}"),
                    "teams_count": len(cached_data["leagues"][str(lid)].get("teams", [])),
                    "gws_count": max_gw
                })

    # Ensure every configured league is preserved in output, falling back to cache if missed
    if cached_data and "leagues" in cached_data:
        for lid_str in leagues_config.keys():
            if lid_str not in multi_league_output["leagues"] and lid_str in cached_data["leagues"]:
                print(f" -> [Resilience] Restoring missing League {lid_str} from cache.")
                multi_league_output["leagues"][lid_str] = cached_data["leagues"][lid_str]

    # 4.4 Fetch Transfer Suggestions from FPL Gameweek
    has_changed = False
    next_event = next((e for e in events if e.get('is_next')), None)
    upcoming_gw = next_event['id'] if next_event else (max_gw + 1 if gw_status_map.get(max_gw) else max_gw)
    print(f"Fetching Transfer Suggestions for upcoming GW {upcoming_gw}...")
    try:
        azure_key = os.environ.get('AZURE_TRANSFER_FUNCTION_KEY')
        if not azure_key:
            print(" -> Notice: AZURE_TRANSFER_FUNCTION_KEY not set. Retaining cached suggestions.")
            if cached_data and "transfer_suggestions" in cached_data:
                multi_league_output["transfer_suggestions"] = cached_data["transfer_suggestions"]
            ts_data = None
        else:
            ts_url = f'https://fontendfunctionsnortheuropenew.azurewebsites.net/api/TransferSuggestionsFunction?gameweeks={upcoming_gw}&generalSuggestions=1'
            ts_headers = {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                'FunctionKey': azure_key
            }
            ts_data = fetch(ts_url, headers_override=ts_headers, retries=3, delay=1.5, timeout=12)
        if ts_data and ts_data.get("Succeeded"):
            new_gk = ts_data.get("GoalKeepers", [])
            new_def = ts_data.get("Defenders", [])
            new_mid = ts_data.get("Midfielders", [])
            new_fwd = ts_data.get("Forwards", [])

            cached_ts = cached_data.get("transfer_suggestions", {}) if cached_data else {}
            content_changed = (
                new_gk != cached_ts.get("GoalKeepers") or
                new_def != cached_ts.get("Defenders") or
                new_mid != cached_ts.get("Midfielders") or
                new_fwd != cached_ts.get("Forwards") or
                upcoming_gw != cached_ts.get("gw")
            )
            updated_ts_time = datetime.now(timezone.utc).isoformat() if content_changed else cached_ts.get("updated_at", datetime.now(timezone.utc).isoformat())

            multi_league_output["transfer_suggestions"] = {
                "gw": upcoming_gw,
                "updated_at": updated_ts_time,
                "GoalKeepers": new_gk,
                "Defenders": new_def,
                "Midfielders": new_mid,
                "Forwards": new_fwd
            }
            if content_changed:
                print(f" -> Successfully updated Transfer Suggestions for GW {upcoming_gw} (New data)!")
                has_changed = True
            else:
                print(f" -> Transfer Suggestions for GW {upcoming_gw} unchanged. Preserving timestamp.")
        else:
            if cached_data and "transfer_suggestions" in cached_data:
                multi_league_output["transfer_suggestions"] = cached_data["transfer_suggestions"]
    except Exception as ts_err:
        print(f"Notice: Could not fetch transfer suggestions: {ts_err}")
        if cached_data and "transfer_suggestions" in cached_data:
            print(" -> [Resilience] Preserving existing cached transfer suggestions.")
            multi_league_output["transfer_suggestions"] = cached_data["transfer_suggestions"]

    # 4.5 Smart Commit: Detect if any scores, standings, or GW status changed
    has_changed = check_data_has_changed(cached_data, multi_league_output) or has_changed

    # Heartbeat: Allow sync if it's been more than 6 hours since last sync
    HEARTBEAT_INTERVAL_SECONDS = 6 * 3600  # 6 hours
    last_sync_iso = cached_data.get("last_sync_iso") if cached_data else None
    is_heartbeat = False
    if last_sync_iso:
        try:
            last_dt = datetime.strptime(last_sync_iso, '%Y-%m-%d %H:%M:%S').replace(tzinfo=tz_th)
            if (now_th - last_dt).total_seconds() >= HEARTBEAT_INTERVAL_SECONDS:
                is_heartbeat = True
                print(f" -> [Smart Commit] Periodic Heartbeat triggered (> {HEARTBEAT_INTERVAL_SECONDS // 3600}h since last sync).")
        except Exception:
            is_heartbeat = True

    if not has_changed and not is_heartbeat and not args.force and cached_data:
        print("\n⚡ [Smart Commit] No matchday score changes detected.")
        print(f"   Preserving sync timestamp: {cached_data.get('last_sync')}")
        print("   Skipping redundant Git commit (Zero Git Bloat) 🚀")
        sync_time_str = cached_data.get("last_sync", sync_time_str)
        sync_iso_str = cached_data.get("last_sync_iso", sync_iso_str)
        multi_league_output["last_sync"] = sync_time_str
        multi_league_output["last_sync_iso"] = sync_iso_str

        # If data is completely identical to cached data on disk, do not touch files to avoid git churn
        try:
            if multi_league_output == cached_data:
                print("   Cached JSON file is already up to date. Preserving file on disk.")
                elapsed = time.time() - start_time
                print(f"\n=======================================================")
                print(f"✅ Fast sync completed in {elapsed:.2f} seconds (0 disk mutations)!")
                print(f"   Last Sync: {sync_time_str}")
                return False, 0, max_gw
        except Exception:
            pass
    else:
        change_reason = "Points/Rank change" if has_changed else ("Heartbeat" if is_heartbeat else "Initial/Force sync")
        print(f"\n🚀 [Smart Commit] Live data update triggered: {change_reason} -> Updating sync timestamp to {sync_time_str}")

    # 5. Write multi_fpl_data.json atomically
    atomic_json_dump(multi_league_output, multi_json_path)

    # 6. Write real_fpl_40700_data.json for backwards compatibility atomically
    real_json_path = os.path.join(base_dir, 'real_fpl_40700_data.json')
    if "40700" in multi_league_output["leagues"]:
        atomic_json_dump({
            "league": {
                "id": 40700,
                "name": multi_league_output["leagues"]["40700"]["name"],
                "season": season_display,
                "last_sync": sync_time_str,
                "last_sync_iso": sync_iso_str
            },
            "teams": multi_league_output["leagues"]["40700"]["teams"],
            "gameweeks": multi_league_output["leagues"]["40700"]["gameweeks"],
            "squads": multi_league_output["leagues"]["40700"]["squads"]
        }, real_json_path)

    elapsed = time.time() - start_time
    print(f"\n=======================================================")
    print(f"✅ Successfully synced all leagues in {elapsed:.2f} seconds!")
    print(f"   Last Sync: {sync_time_str}")
    print(f"   Max Gameweek: GW {max_gw} ({'Finished' if gw_status_map.get(max_gw) else 'LIVE'})")
    print(f"=======================================================")
    for s in summary_stats:
        print(f"   - League {s['id']} ({s['name']}): {s['teams_count']} teams")
    print(f"=======================================================\n")

    # 7. Write to GITHUB_STEP_SUMMARY if running in GitHub Actions
    step_summary_path = os.environ.get('GITHUB_STEP_SUMMARY')
    if step_summary_path:
        try:
            status_badge = "✅ FINISHED" if gw_status_map.get(max_gw) else "🔴 LIVE"
            summary_md = f"""## ⚽ FPL Mini-League Auto Sync Summary

- **🕒 Last Sync:** {sync_time_str} (`{sync_iso_str}`)
- **🏆 Active Gameweek:** **GW {max_gw}** ({status_badge})
- **⏱️ Execution Duration:** `{elapsed:.2f}s`

### 📊 Leagues Processed
| League ID | League Name | Teams | Gameweeks |
|:---|:---|:---:|:---:|
"""
            for s in summary_stats:
                summary_md += f"| `{s['id']}` | **{s['name']}** | {s['teams_count']} | GW 1 - {s['gws_count']} |\n"

            with open(step_summary_path, 'w', encoding='utf-8') as f:
                f.write(summary_md)
        except Exception as e:
            print(f"Notice: Could not write GITHUB_STEP_SUMMARY: {e}")

    active_in_play = get_active_in_play_fixture_count(max_gw)
    return has_changed, active_in_play, max_gw

def main():
    parser = argparse.ArgumentParser(description="FPL Live Data Sync Engine")
    parser.add_argument('--force', action='store_true', help="Force full re-sync for all GWs (bypass cache)")
    parser.add_argument('--live-loop', action='store_true', help="Run continuous live polling daemon during matchday in-play window")
    parser.add_argument('--max-minutes', type=int, default=14, help="Max duration in minutes to keep daemon alive (default: 14)")
    parser.add_argument('--interval', type=int, default=60, help="Polling interval in seconds during in-play (default: 60)")
    parser.add_argument('--push', action='store_true', help="Automatically commit and push when live scores change")
    args = parser.parse_args()

    has_changed, in_play_count, max_gw = sync_once(args)

    is_ci = os.environ.get("GITHUB_ACTIONS") == "true"
    should_loop = args.live_loop
    should_push = args.push or is_ci

    if not should_loop:
        return

    if in_play_count is None:
        print(f"\n⚠️ [Matchday Live Daemon] Transient error checking in-play fixtures for GW {max_gw}. Retrying in 3s...")
        time.sleep(3)
        in_play_count = get_active_in_play_fixture_count(max_gw)

    if not in_play_count:
        print(f"\n⚡ [Matchday Live Daemon] No active in-play matches in GW {max_gw}. Finished single sync.")
        return

    print(f"\n🔥 [Matchday Live Daemon] {in_play_count} Premier League match(es) actively in-play in GW {max_gw}!")
    print(f"   Entering continuous polling loop (interval: {args.interval}s, max runtime: {args.max_minutes}m, push={should_push})...")

    if has_changed and should_push:
        trigger_publish()

    loop_start = time.time()
    iteration = 1
    while True:
        elapsed = time.time() - loop_start
        if elapsed >= args.max_minutes * 60:
            print(f"\n⏱️ Reached max daemon runtime ({args.max_minutes}m). Exiting cleanly for next scheduled trigger.")
            break

        time.sleep(args.interval)
        iteration += 1

        in_play_count = get_active_in_play_fixture_count(max_gw)
        if in_play_count is None:
            print(f"\n⚠️ [Daemon Iteration {iteration}] Transient network error checking in-play fixtures. Continuing to next poll...")
            continue
        if in_play_count == 0:
            print(f"\n🏁 All matches in this slot have concluded. Performing final sync and closing daemon.")
            has_changed, _, _ = sync_once(args)
            if has_changed and should_push:
                trigger_publish()
            break

        print(f"\n--- [Daemon Iteration {iteration} | Elapsed: {int(elapsed)}s] Polling live points ({in_play_count} match in-play)... ---")
        has_changed, _, _ = sync_once(args)
        if has_changed:
            print(f"⚽ [Score Change Detected] Live scores updated at {datetime.now().strftime('%H:%M:%S')}!")
            if should_push:
                trigger_publish()
        else:
            print(f"   No score changes at {datetime.now().strftime('%H:%M:%S')}. Waiting next poll ({args.interval}s)...")

if __name__ == '__main__':
    main()
