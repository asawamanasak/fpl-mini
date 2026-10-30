#!/usr/bin/env python3
"""
archive_season.py - FPL Mini-League Historical Season Archival Engine

Preserves completed FPL seasons permanently so that historical data is never lost
when the official Fantasy Premier League resets for a new season.

Usage:
    python3 archive_season.py [--season 2026-27] [--checkpoint] [--force] [--init-managers]

Outputs to:
    seasons/index.json                (Global season registry)
    seasons/<season_id>/
        meta.json                     (Metadata, status, SHA-256 checksums)
        config.json                   (Snapshot of league rules, prizes, and configs)
        core.json                     (Teams and gameweeks without heavy squads)
        summary.json                  (Podium, records, and quick stats for Hall of Fame)
        squads/<league_id>.json       (Dedicated squad files per league)
    config/managers.json              (Cross-season manager identity registry)
"""

import os
import sys
import json
import time
import hashlib
import argparse
import tempfile
from datetime import datetime

def sha256_file(filepath):
    """Compute SHA-256 hash of a file."""
    h = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def atomic_dump(data, filepath, indent=None):
    """Safely write JSON file via temporary file and atomic rename."""
    dirname = os.path.dirname(filepath)
    os.makedirs(dirname, exist_ok=True)
    with tempfile.NamedTemporaryFile('w', dir=dirname, delete=False, encoding='utf-8') as tf:
        if indent is not None:
            json.dump(data, tf, ensure_ascii=False, indent=indent)
        else:
            json.dump(data, tf, ensure_ascii=False, separators=(',', ':'))
        temp_name = tf.name
    os.replace(temp_name, filepath)

def build_season_summary(multi_data, leagues_config):
    """
    Build high-level executive summary for all leagues in the season.
    Small (<15KB) and optimized for All-Time Hall of Fame views.
    """
    summary = {}
    for lid, l in multi_data.get('leagues', {}).items():
        teams = l.get('teams', [])
        gws = l.get('gameweeks', {})

        standings = sorted(teams, key=lambda t: t.get('total_points', 0), reverse=True)
        podium = [
            {
                'rank': i + 1,
                'entry_id': t.get('entry_id'),
                'player_name': t.get('player_name', ''),
                'team_name': t.get('entry_name', ''),
                'total_points': t.get('total_points', 0)
            }
            for i, t in enumerate(standings[:4])
        ]

        top_gw = {'score': -1, 'gw': None, 'team': None, 'player': None, 'entry_id': None}
        top_bench = {'bench': -1, 'gw': None, 'team': None, 'player': None, 'entry_id': None}

        for gw_num, gw_data in gws.items():
            for res in gw_data.get('results', []):
                net = res.get('net_points', 0)
                if net > top_gw['score']:
                    top_gw = {
                        'score': net,
                        'gw': int(gw_num),
                        'team': res.get('team_name'),
                        'player': res.get('player_name'),
                        'entry_id': res.get('entry_id')
                    }
                bp = res.get('bench_points', 0)
                if bp > top_bench['bench']:
                    top_bench = {
                        'bench': bp,
                        'gw': int(gw_num),
                        'team': res.get('team_name'),
                        'player': res.get('player_name'),
                        'entry_id': res.get('entry_id')
                    }

        summary[str(lid)] = {
            'id': str(lid),
            'name': l.get('name', ''),
            'teams_count': len(teams),
            'podium': podium,
            'record_gw': top_gw,
            'record_bench': top_bench
        }
    return summary

def update_managers_registry(base_dir, season_id, multi_data):
    """
    Maintain config/managers.json cross-season registry.
    Maps unique manager identities across multiple seasons and leagues.
    """
    managers_file = os.path.join(base_dir, 'config', 'managers.json')
    reg = {"_version": 1, "managers": []}
    if os.path.exists(managers_file):
        try:
            with open(managers_file, 'r', encoding='utf-8') as f:
                reg = json.load(f)
        except Exception as e:
            print(f"Notice reading existing managers.json: {e}")

    # Build index by normalized player_name
    by_name = {}
    for m in reg.get("managers", []):
        for name in [m.get("display_name")] + m.get("aliases", []):
            if name:
                by_name[name.strip().lower()] = m

    for lid, l in multi_data.get("leagues", {}).items():
        for t in l.get("teams", []):
            raw_name = t.get("player_name", "").strip()
            norm = raw_name.lower()
            if not norm:
                continue

            mgr = by_name.get(norm)
            if not mgr:
                # Generate slug id: mgr_firstname_lastname
                clean_slug = "".join(c if c.isalnum() else "_" for c in norm).strip("_")
                mgr_id = f"mgr_{clean_slug}"
                mgr = {
                    "id": mgr_id,
                    "display_name": raw_name,
                    "aliases": [raw_name],
                    "seasons": {}
                }
                reg["managers"].append(mgr)
                by_name[norm] = mgr

            if "seasons" not in mgr:
                mgr["seasons"] = {}
            if season_id not in mgr["seasons"]:
                mgr["seasons"][season_id] = {"entries": {}}

            mgr["seasons"][season_id]["entries"][str(lid)] = {
                "entry_id": t.get("entry_id"),
                "team_name": t.get("entry_name")
            }

    # Sort managers alphabetically by display_name
    reg["managers"].sort(key=lambda m: m.get("display_name", "").lower())
    atomic_dump(reg, managers_file, indent=2)
    print(f"✅ Updated manager registry: {managers_file} ({len(reg['managers'])} managers tracked)")
    return len(reg["managers"])

def archive_season(season_id=None, is_checkpoint=False, force=False, update_managers=True):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    multi_path = os.path.join(base_dir, 'multi_fpl_data.json')
    cfg_path = os.path.join(base_dir, 'config', 'leagues_config.json')
    season_cfg_path = os.path.join(base_dir, 'config', 'season_config.json')

    if not os.path.exists(multi_path):
        print(f"❌ Error: {multi_path} does not exist. Run sync_live_fpl.py first.")
        sys.exit(1)

    with open(multi_path, 'r', encoding='utf-8') as f:
        multi_data = json.load(f)

    with open(cfg_path, 'r', encoding='utf-8') as f:
        leagues_config = json.load(f)

    # Determine season
    if not season_id:
        if os.path.exists(season_cfg_path):
            try:
                with open(season_cfg_path, 'r', encoding='utf-8') as f:
                    s_cfg = json.load(f)
                    season_id = s_cfg.get("current_season")
            except Exception:
                pass
        if not season_id:
            season_id = multi_data.get("season_id", "2026-27")

    season_display = multi_data.get("season", season_id.replace('-', '/'))
    season_dir = os.path.join(base_dir, 'seasons', season_id)
    meta_path = os.path.join(season_dir, 'meta.json')

    # Frozen protection check
    if os.path.exists(meta_path) and not force:
        try:
            with open(meta_path, 'r', encoding='utf-8') as f:
                old_meta = json.load(f)
                if old_meta.get("is_frozen", False) and not is_checkpoint:
                    print(f"🔒 Season '{season_id}' is already frozen and archived! Aborting to prevent accidental overwrite.")
                    print("   If you intentionally want to overwrite, re-run with --force.")
                    return False
        except Exception as e:
            print(f"Notice reading existing meta: {e}")

    max_gw = multi_data.get("max_gw", 8)
    is_frozen = (not is_checkpoint) and (max_gw == 38)
    status = "archived" if is_frozen else ("checkpoint" if is_checkpoint else "live")

    print("\n" + "=" * 65)
    print(f"📦 Archiving Season: {season_display} (ID: {season_id})")
    print(f"   Mode: {'Checkpoint' if is_checkpoint else ('Frozen Final Archive' if is_frozen else 'In-Season Snapshot')}")
    print(f"   Max Gameweek: GW {max_gw}")
    print(f"   Output Directory: {season_dir}")
    print("=" * 65)

    os.makedirs(season_dir, exist_ok=True)
    squads_dir = os.path.join(season_dir, 'squads')
    os.makedirs(squads_dir, exist_ok=True)

    written_files = {}

    # 1. Config Snapshot
    config_snapshot = {
        "leagues_config": leagues_config,
        "archived_at": datetime.now().isoformat()
    }
    # Include special config files if present
    for special_cfg in ['shi62_special.txt', 'bramann_prediction.txt', 'bramann_challenge.json']:
        p = os.path.join(base_dir, 'config', special_cfg)
        if os.path.exists(p):
            with open(p, 'r', encoding='utf-8') as f:
                config_snapshot[special_cfg] = f.read()

    cfg_out_path = os.path.join(season_dir, 'config.json')
    atomic_dump(config_snapshot, cfg_out_path, indent=2)
    written_files['config.json'] = cfg_out_path
    print(f"  ✅ Written config snapshot: {cfg_out_path}")

    # 2. Core Data (Teams, Gameweeks without squads)
    core_data = {
        "season_id": season_id,
        "season": season_display,
        "max_gw": max_gw,
        "last_sync": multi_data.get("last_sync"),
        "last_sync_iso": multi_data.get("last_sync_iso"),
        "sync_status": multi_data.get("sync_status"),
        "league_order": multi_data.get("league_order", list(leagues_config.keys())),
        "next_deadline": multi_data.get("next_deadline"),
        "events_deadlines": multi_data.get("events_deadlines", []),
        "leagues": {}
    }

    for lid, l in multi_data.get("leagues", {}).items():
        core_data["leagues"][str(lid)] = {
            "id": l.get("id"),
            "name": l.get("name"),
            "season": l.get("season", season_display),
            "teams": l.get("teams", []),
            "gameweeks": l.get("gameweeks", {})
        }

    core_out_path = os.path.join(season_dir, 'core.json')
    atomic_dump(core_data, core_out_path)
    written_files['core.json'] = core_out_path
    print(f"  ✅ Written core data (no squads): {core_out_path} ({os.path.getsize(core_out_path):,} bytes)")

    # 3. Squads Data (split per league)
    for lid, l in multi_data.get("leagues", {}).items():
        sq_data = l.get("squads", {})
        sq_out_path = os.path.join(squads_dir, f"{lid}.json")
        atomic_dump(sq_data, sq_out_path)
        written_files[f'squads/{lid}.json'] = sq_out_path
        print(f"  ✅ Written squads for League {lid}: {sq_out_path} ({len(sq_data)} entries, {os.path.getsize(sq_out_path):,} bytes)")

    # 4. Summary Data (for All-Time Hall of Fame)
    summary_data = {
        "season_id": season_id,
        "season": season_display,
        "max_gw": max_gw,
        "archived_at": datetime.now().isoformat(),
        "leagues": build_season_summary(multi_data, leagues_config)
    }
    summary_out_path = os.path.join(season_dir, 'summary.json')
    atomic_dump(summary_data, summary_out_path, indent=2)
    written_files['summary.json'] = summary_out_path
    print(f"  ✅ Written season summary: {summary_out_path} ({os.path.getsize(summary_out_path):,} bytes)")

    # 5. Compute SHA-256 Checksums
    checksums = {}
    for rel_name, full_p in written_files.items():
        checksums[rel_name] = sha256_file(full_p)

    # 6. Meta
    meta_data = {
        "season_id": season_id,
        "season": season_display,
        "archived_at": datetime.now().isoformat(),
        "is_frozen": is_frozen,
        "status": status,
        "max_gw": max_gw,
        "leagues_count": len(multi_data.get("leagues", {})),
        "checksums": checksums
    }
    atomic_dump(meta_data, meta_path, indent=2)
    print(f"  ✅ Written meta & checksums: {meta_path}")

    # 7. Global Seasons Index (seasons/index.json)
    index_path = os.path.join(base_dir, 'seasons', 'index.json')
    seasons_index = []
    if os.path.exists(index_path):
        try:
            with open(index_path, 'r', encoding='utf-8') as f:
                seasons_index = json.load(f)
        except Exception:
            seasons_index = []

    # Update or append
    now_iso = datetime.now().isoformat()
    existing_entry = next((s for s in seasons_index if s.get("id") == season_id), None)
    if existing_entry:
        existing_entry["name"] = season_display
        existing_entry["status"] = status
        existing_entry["max_gw"] = max_gw
        existing_entry["is_frozen"] = is_frozen
        existing_entry["updated_at"] = now_iso
    else:
        seasons_index.append({
            "id": season_id,
            "name": season_display,
            "status": status,
            "max_gw": max_gw,
            "is_frozen": is_frozen,
            "archived_at": now_iso,
            "updated_at": now_iso
        })

    # Sort descending by start year
    def sort_key(s):
        raw = s.get("id", "0000").split("-")[0]
        return int(raw) if raw.isdigit() else 0
    seasons_index.sort(key=sort_key, reverse=True)

    atomic_dump(seasons_index, index_path, indent=2)
    print(f"  ✅ Updated global season registry: {index_path}")

    # 8. Managers Registry Update
    if update_managers:
        update_managers_registry(base_dir, season_id, multi_data)

    print("\n" + "=" * 65)
    print(f"🎉 Successfully completed archival for Season {season_display}!")
    print(f"   Status: {status.upper()} | Frozen: {is_frozen}")
    print("=" * 65 + "\n")
    return True

def main():
    parser = argparse.ArgumentParser(description="FPL Historical Season Archival Engine")
    parser.add_argument('--season', type=str, default=None, help="Season ID to archive (e.g. 2026-27). Defaults to current season.")
    parser.add_argument('--checkpoint', action='store_true', help="Create a mid-season checkpoint (is_frozen=False, status=checkpoint)")
    parser.add_argument('--force', action='store_true', help="Force overwrite of frozen archives")
    parser.add_argument('--init-managers', action='store_true', help="Only regenerate/update config/managers.json")
    args = parser.parse_args()

    base_dir = os.path.dirname(os.path.abspath(__file__))
    multi_path = os.path.join(base_dir, 'multi_fpl_data.json')

    if args.init_managers:
        if not os.path.exists(multi_path):
            print(f"❌ Error: {multi_path} not found.")
            sys.exit(1)
        with open(multi_path, 'r', encoding='utf-8') as f:
            multi_data = json.load(f)
        season_id = args.season or multi_data.get("season_id", "2026-27")
        update_managers_registry(base_dir, season_id, multi_data)
        return

    archive_season(season_id=args.season, is_checkpoint=args.checkpoint, force=args.force)

if __name__ == '__main__':
    main()
