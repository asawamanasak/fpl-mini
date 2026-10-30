#!/usr/bin/env python3
"""
import_historical_seasons.py - Fetch past FPL seasons history from Official API
and construct verified archived season datasets (summary.json, core.json, meta.json).
"""

import os
import json
import time
import hashlib
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def fetch_entry_history(entry_id):
    url = f"https://fantasy.premierleague.com/api/entry/{entry_id}/history/"
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"})
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                return entry_id, data.get("past", [])
        except Exception:
            time.sleep(0.5)
    return entry_id, []

def main():
    print("=" * 60)
    print("🏆 Importing Historical Season 2025/26 from FPL API...")
    print("=" * 60)

    multi_path = os.path.join(BASE_DIR, 'multi_fpl_data.json')
    with open(multi_path, 'r', encoding='utf-8') as f:
        multi_data = json.load(f)

    cfg_path = os.path.join(BASE_DIR, 'config', 'leagues_config.json')
    with open(cfg_path, 'r', encoding='utf-8') as f:
        leagues_config = json.load(f)

    # 1. Gather all unique entry IDs
    unique_entries = {}
    for lid, l in multi_data.get('leagues', {}).items():
        for t in l.get('teams', []):
            eid = t.get('entry_id')
            if eid and eid not in unique_entries:
                unique_entries[eid] = {
                    'entry_id': eid,
                    'player_name': t.get('player_name', ''),
                    'team_name': t.get('entry_name', ''),
                    'leagues': []
                }
            if eid:
                unique_entries[eid]['leagues'].append(lid)

    print(f"Fetching past history for {len(unique_entries)} unique managers in parallel...")
    history_map = {}
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(fetch_entry_history, eid): eid for eid in unique_entries.keys()}
        for f in as_completed(futures):
            eid, past_list = f.result()
            history_map[eid] = {p['season_name']: p for p in past_list}

    target_season_name = "2025/26"
    target_season_id = "2025-26"

    # 2. Build 2025/26 core.json and summary.json
    season_dir = os.path.join(BASE_DIR, 'seasons', target_season_id)
    os.makedirs(season_dir, exist_ok=True)
    os.makedirs(os.path.join(season_dir, 'squads'), exist_ok=True)

    summary_data = {
        "season_id": target_season_id,
        "season": target_season_name,
        "max_gw": 38,
        "archived_at": "2026-06-01T00:00:00Z",
        "is_frozen": True,
        "note": "Imported official historical season finish from FPL API",
        "leagues": {}
    }

    core_data = {
        "season_id": target_season_id,
        "last_sync": "Final Official Season Finish (GW 38)",
        "last_sync_iso": "2026-06-01T00:00:00Z",
        "sync_status": "Finished (Archived)",
        "max_gw": 38,
        "league_order": list(leagues_config.keys()),
        "leagues": {}
    }

    for lid, l_cfg in leagues_config.items():
        l_obj = multi_data.get("leagues", {}).get(lid, {})
        league_name = l_obj.get("name", l_cfg.get("name", f"League {lid}"))
        
        # Collect teams that have 2025/26 history
        league_teams_2025 = []
        for t in l_obj.get("teams", []):
            eid = t.get("entry_id")
            past = history_map.get(eid, {})
            if target_season_name in past:
                s_rec = past[target_season_name]
                league_teams_2025.append({
                    "entry_id": eid,
                    "entry_name": t.get("entry_name", ""),
                    "player_name": t.get("player_name", ""),
                    "total_points": s_rec.get("total_points", 0),
                    "overall_rank": s_rec.get("rank", 0)
                })

        league_teams_2025.sort(key=lambda x: x["total_points"], reverse=True)
        for idx, t in enumerate(league_teams_2025, 1):
            t["rank"] = idx

        # Podium
        podium = []
        for t in league_teams_2025[:4]:
            podium.append({
                "rank": t["rank"],
                "entry_id": t["entry_id"],
                "player_name": t["player_name"],
                "team_name": t["entry_name"],
                "total_points": t["total_points"],
                "overall_rank": t["overall_rank"]
            })

        summary_data["leagues"][lid] = {
            "id": lid,
            "name": league_name,
            "teams_count": len(league_teams_2025),
            "podium": podium
        }

        # Build gameweek 38 final standings in core.json so all tables render seamlessly
        gw38_results = []
        for t in league_teams_2025:
            gw38_results.append({
                "entry_id": t["entry_id"],
                "team_name": t["entry_name"],
                "player_name": t["player_name"],
                "points": t["total_points"],
                "net_points": t["total_points"],
                "total": t["total_points"],
                "rank": t["rank"],
                "overall_rank": t["overall_rank"],
                "hits": 0,
                "bench_points": 0
            })

        core_data["leagues"][lid] = {
            "id": lid,
            "name": league_name,
            "season": target_season_name,
            "teams": league_teams_2025,
            "gameweeks": {
                "38": {
                    "is_finished": True,
                    "is_started": True,
                    "results": gw38_results
                }
            },
            "squads": {}
        }

    # Save summary.json and core.json
    with open(os.path.join(season_dir, 'summary.json'), 'w', encoding='utf-8') as f:
        json.dump(summary_data, f, ensure_ascii=False, indent=2)

    with open(os.path.join(season_dir, 'core.json'), 'w', encoding='utf-8') as f:
        json.dump(core_data, f, ensure_ascii=False, separators=(',', ':'))

    # Save meta.json with SHA256 checksums
    def sha256_file(filepath):
        h = hashlib.sha256()
        with open(filepath, 'rb') as f:
            while chunk := f.read(65536):
                h.update(chunk)
        return h.hexdigest()

    meta_data = {
        "season_id": target_season_id,
        "season": target_season_name,
        "max_gw": 38,
        "is_frozen": True,
        "archived_at": "2026-06-01T00:00:00Z",
        "files": {
            "core.json": sha256_file(os.path.join(season_dir, 'core.json')),
            "summary.json": sha256_file(os.path.join(season_dir, 'summary.json'))
        }
    }
    with open(os.path.join(season_dir, 'meta.json'), 'w', encoding='utf-8') as f:
        json.dump(meta_data, f, ensure_ascii=False, indent=2)

    # 3. Update seasons/index.json
    idx_path = os.path.join(BASE_DIR, 'seasons', 'index.json')
    seasons_index = []
    if os.path.exists(idx_path):
        with open(idx_path, 'r', encoding='utf-8') as f:
            seasons_index = json.load(f)

    # Ensure 2026-27 is marked live
    has_2026 = False
    has_2025 = False
    for s in seasons_index:
        if s.get("id") == "2026-27":
            s["status"] = "live"
            has_2026 = True
        elif s.get("id") == "2025-26":
            has_2025 = True

    if not has_2026:
        seasons_index.insert(0, {
            "id": "2026-27",
            "name": "2026/27",
            "status": "live",
            "max_gw": multi_data.get("max_gw", 8),
            "is_frozen": False
        })

    if not has_2025:
        seasons_index.append({
            "id": "2025-26",
            "name": "2025/26",
            "status": "archived",
            "max_gw": 38,
            "is_frozen": True,
            "archived_at": "2026-06-01T00:00:00Z"
        })

    with open(idx_path, 'w', encoding='utf-8') as f:
        json.dump(seasons_index, f, ensure_ascii=False, indent=2)

    print(f"✅ Successfully created historical archive seasons/{target_season_id}/")
    print(f"✅ Updated seasons/index.json with {len(seasons_index)} seasons:")
    for s in seasons_index:
        print(f"   • {s['name']} ({s['id']}): {s['status'].upper()} (max_gw={s['max_gw']})")

if __name__ == '__main__':
    main()
