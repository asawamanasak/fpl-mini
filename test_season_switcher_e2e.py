import http.server
import socketserver
import threading
import os
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARTIFACTS_DIR = "/Users/micky/.gemini/antigravity/brain/8a1d178a-d4ce-4232-af31-905c8a8460e1"

class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass

def run():
    httpd = socketserver.TCPServer(('127.0.0.1', 0), QuietHandler)
    port = httpd.server_address[1]
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    print(f"Server started on http://127.0.0.1:{port}")

    chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

    tests = [
        ("Current Live Season 2026-27 (GW View)", f"http://127.0.0.1:{port}/preview.html", f"{ARTIFACTS_DIR}/test_live_season_2026_27.png"),
        ("Archived Season 2025-26 (Standings & Banner)", f"http://127.0.0.1:{port}/preview.html?season=2025-26", f"{ARTIFACTS_DIR}/test_archived_season_2025_26.png"),
        ("All-Time Hall of Fame (Roll of Honor & Medals)", f"http://127.0.0.1:{port}/preview.html?tab=hall-of-fame-view", f"{ARTIFACTS_DIR}/test_all_time_hall_of_fame.png"),
        ("League 675290 Archived 2025-26", f"http://127.0.0.1:{port}/675290/?season=2025-26", f"{ARTIFACTS_DIR}/test_league_675290_archived.png")
    ]

    for label, url, shot_path in tests:
        print(f"\n--- Testing: {label} ---")
        print(f"URL: {url}")
        res = subprocess.run([
            chrome_bin,
            "--headless=new",
            "--disable-gpu",
            "--window-size=1280,1000",
            "--virtual-time-budget=3000",
            "--enable-logging=stderr",
            f"--screenshot={shot_path}",
            url
        ], capture_output=True, text=True)

        errs = [line for line in res.stderr.split('\n') if any(k in line for k in ['Uncaught', 'SyntaxError', 'ReferenceError', 'TypeError'])]
        if errs:
            print(f"  ❌ JS Errors: {errs}")
        else:
            print(f"  ✅ 0 JavaScript runtime errors")

        if os.path.exists(shot_path) and os.path.getsize(shot_path) > 10000:
            print(f"  📸 Screenshot saved: {os.path.basename(shot_path)} ({os.path.getsize(shot_path):,} bytes)")
        else:
            print(f"  ⚠️ Screenshot failed")

    httpd.shutdown()

if __name__ == '__main__':
    run()
