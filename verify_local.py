#!/usr/bin/env python3
"""
FPL Mini-League - Local System Health & Verification Suite
Usage:
    python3 verify_local.py

Checks:
  1. Data Integrity: multi_fpl_data.json & leagues_config.json
  2. Backend Engine: sync_live_fpl.py runs cleanly
  3. Presentation Generator: update_preview.py generates all HTML files
  4. HTML Files: All 6 entry points exist and non-empty
  5. Front-End Health: Headless browser check for 0 JS console errors
  6. Git Working Tree Status
"""

import os
import sys
import json
import subprocess
import time

def print_header(title):
    print("\n" + "=" * 60)
    print(f"🔍 {title}")
    print("=" * 60)

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    all_passed = True

    print_header("FPL Mini-League: Local System Verification Suite")

    # 1. Config & Data JSON Validation
    print("Step 1: Validating JSON Data Integrity...")
    cfg_path = os.path.join(base_dir, 'config', 'leagues_config.json')
    data_path = os.path.join(base_dir, 'multi_fpl_data.json')
    
    try:
        with open(cfg_path, 'r', encoding='utf-8') as f:
            cfg = json.load(f)
        with open(data_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        leagues = data.get("leagues", {})
        print(f"  ✅ Config loaded: {len(cfg)} configured leagues ({', '.join(cfg.keys())})")
        print(f"  ✅ Data JSON loaded: {len(leagues)} leagues cached, max_gw={data.get('max_gw')}")
    except Exception as e:
        print(f"  ❌ JSON validation failed: {e}")
        all_passed = False

    # 2. Test Backend Sync Engine
    print("\nStep 2: Testing Backend Sync Engine (sync_live_fpl.py)...")
    t0 = time.time()
    res_sync = subprocess.run([sys.executable, os.path.join(base_dir, 'sync_live_fpl.py')], capture_output=True, text=True)
    t_sync = time.time() - t0
    if res_sync.returncode == 0:
        print(f"  ✅ sync_live_fpl.py executed successfully in {t_sync:.2f}s")
    else:
        print(f"  ❌ sync_live_fpl.py failed with code {res_sync.returncode}:")
        print(res_sync.stderr)
        all_passed = False

    # 3. Test HTML Presentation Generator
    print("\nStep 3: Testing Presentation Generator (update_preview.py)...")
    t0 = time.time()
    res_gen = subprocess.run([sys.executable, os.path.join(base_dir, 'update_preview.py')], capture_output=True, text=True)
    t_gen = time.time() - t0
    if res_gen.returncode == 0:
        print(f"  ✅ update_preview.py executed successfully in {t_gen:.2f}s")
    else:
        print(f"  ❌ update_preview.py failed with code {res_gen.returncode}:")
        print(res_gen.stderr)
        all_passed = False

    # 4. Check All HTML Files Exist
    print("\nStep 4: Checking Generated HTML Entry Points...")
    required_files = [
        'index.html',
        'preview.html',
        '404.html',
        '40700/index.html',
        '675290/index.html',
        '38491/index.html'
    ]
    for rf in required_files:
        fpath = os.path.join(base_dir, rf)
        if os.path.exists(fpath) and os.path.getsize(fpath) > 10000:
            print(f"  ✅ {rf} exists ({os.path.getsize(fpath):,} bytes)")
        else:
            print(f"  ❌ {rf} missing or too small!")
            all_passed = False

    # 5. Front-End Headless Browser Check
    print("\nStep 5: Testing Front-End JavaScript Runtime (Headless Chrome)...")
    chrome_bin = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    if os.path.exists(chrome_bin):
        pages_to_test = ['preview.html', '40700/index.html', '675290/index.html', '38491/index.html']
        for p in pages_to_test:
            target_url = f"file://{os.path.join(base_dir, p)}"
            out = subprocess.run([
                chrome_bin, '--headless=new', '--disable-gpu',
                '--virtual-time-budget=2000', '--enable-logging=stderr', '--v=1',
                target_url
            ], capture_output=True, text=True)
            errs = [line for line in out.stderr.split('\n') if any(k in line for k in ['Uncaught', 'SyntaxError', 'ReferenceError', 'TypeError'])]
            if not errs:
                print(f"  ✅ {p}: 0 JavaScript runtime errors")
            else:
                print(f"  ❌ {p}: {len(errs)} JS errors found: {errs}")
                all_passed = False
    else:
        print("  ℹ️ Chrome binary not found, skipping headless browser test.")

    # 6. Git Status Summary
    print("\nStep 6: Local Git Status Check...")
    git_stat = subprocess.run(['git', 'status', '-s'], capture_output=True, text=True)
    if git_stat.stdout.strip():
        print("  📌 Local files modified/uncommitted:")
        for line in git_stat.stdout.strip().split('\n'):
            print(f"     {line}")
    else:
        print("  ✅ Git working tree is completely clean.")

    # Final Verdict
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 ALL LOCAL VERIFICATION CHECKS PASSED (100% HEALTHY)!")
        print("   The local project is verified, stable, and ready.")
        print("   You can review locally or manually push whenever you wish.")
    else:
        print("⚠️ SOME CHECKS FAILED. Please review the errors above.")
    print("=" * 60 + "\n")

if __name__ == '__main__':
    main()
