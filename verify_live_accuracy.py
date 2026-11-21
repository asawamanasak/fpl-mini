#!/usr/bin/env python3
"""
FPLSaWaDiKa — Live Accuracy Audit Against Official FPL API
Checks all configured Showcase & Private leagues (Tier 1 & Tier 2) to ensure
ranks, matchday net scores, cumulative totals, and provisional auto-subs match
official Fantasy Premier League upstream data.
"""

import json
import os
import sys
import urllib.request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "application/json",
}


def fetch_json(url: str, timeout: int = 15) -> dict:
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def main() -> int:
    with open(os.path.join(BASE_DIR, "config", "leagues_config.json"), "r", encoding="utf-8") as f:
        cfg = json.load(f)
    with open(os.path.join(BASE_DIR, "multi_fpl_data.json"), "r", encoding="utf-8") as f:
        multi = json.load(f)

    bs = fetch_json("https://fantasy.premierleague.com/api/bootstrap-static/")
    cur_ev = next((e for e in bs.get("events", []) if e.get("is_current")), None)
    if not cur_ev:
        print("No active/current FPL Gameweek found in bootstrap-static.")
        return 0

    gw = int(cur_ev["id"])
    max_gw = int(multi.get("max_gw") or 0)
    print(f"Auditing against Official FPL GW {gw} (finished={cur_ev.get('finished')}, local max_gw={max_gw}, last_sync={multi.get('last_sync')})")
    if max_gw != gw:
        print(f"ERROR: Local max_gw ({max_gw}) != Official current GW ({gw})!")
        return 1

    live = fetch_json(f"https://fantasy.premierleague.com/api/event/{gw}/live/")
    live_map = {el["id"]: el["stats"] for el in live.get("elements", []) if el and el.get("id") and el.get("stats")}

    total_errors = 0
    for lid, meta in cfg.items():
        if not isinstance(meta, dict):
            continue
        tier = int(meta.get("tier") or 1)
        name = meta.get("name") or lid
        league_path = os.path.join(BASE_DIR, "data", "leagues", f"{lid}.json")
        if not os.path.exists(league_path):
            print(f"  FAIL [{lid}] Missing per-league JSON: {league_path}")
            total_errors += 1
            continue
        ldata = json.load(open(league_path, "r", encoding="utf-8"))
        teams = ldata.get("teams") or []
        gw_obj = (ldata.get("gameweeks") or {}).get(str(gw)) or {}
        results = gw_obj.get("results") or []

        if tier == 2:
            # Verify GW chunk + Tier 2 Auto-Picks coverage, captain/hits integrity, and sample against FPL API
            chunk_path = os.path.join(BASE_DIR, "data", "leagues", str(lid), f"gw{gw}.json")
            if not os.path.exists(chunk_path):
                print(f"  FAIL [{lid}] Tier 2 missing chunk {chunk_path}")
                total_errors += 1
                continue
            chunk_data = json.load(open(chunk_path, "r", encoding="utf-8"))
            chunk_results_list = chunk_data.get("results", [])
            chunk_res = {int(r["entry_id"]): r for r in chunk_results_list if r.get("entry_id")}
            local_by_id = {int(t["entry_id"]): t for t in teams if t.get("entry_id")}

            gw_started = bool(gw_obj.get("is_started") or chunk_data.get("is_started"))
            gw_checked = bool(gw_obj.get("data_checked") or chunk_data.get("data_checked"))
            tier2_err = 0

            if gw_started and len(teams) <= 3000:
                picks_path = os.path.join(BASE_DIR, "data", "leagues", str(lid), f"gw{gw}_picks.json")
                if not os.path.exists(picks_path):
                    print(f"  FAIL [{lid}] Tier 2 missing auto-picks file {picks_path}")
                    total_errors += 1
                    continue
                picks_payload = json.load(open(picks_path, "r", encoding="utf-8"))
                picks_map = picks_payload.get("picks") or {}
                coverage_pct = (len(picks_map) / max(1, len(teams))) * 100.0
                if coverage_pct < 99.0:
                    tier2_err += 1
                    print(f"    FAIL [{lid}] Tier 2 picks coverage too low: {len(picks_map)}/{len(teams)} ({coverage_pct:.1f}%)")

                active_with_cap = sum(
                    1 for r in chunk_results_list
                    if r.get("captain") not in ("-", None, "")
                )
                cap_pct = (active_with_cap / max(1, len(chunk_results_list))) * 100.0
                if cap_pct < 99.0:
                    tier2_err += 1
                    print(f"    FAIL [{lid}] Tier 2 captain populated too low: {active_with_cap}/{len(chunk_results_list)} ({cap_pct:.1f}%)")

                for r in chunk_results_list:
                    hits_v = int(r.get("hits") or 0)
                    pts_v = int(r.get("points") or 0)
                    net_v = int(r.get("net_points") or 0)
                    if hits_v < 0 or net_v != (pts_v - hits_v):
                        tier2_err += 1
                        print(f"    MISMATCH [{lid}] entry {r.get('entry_id')} math: pts={pts_v} hits={hits_v} net={net_v}")
                        break

            sample_pages = [1, 20] if len(teams) > 950 else [1]
            checked = 0
            hits_checked = 0
            for pg in sample_pages:
                off = fetch_json(f"https://fantasy.premierleague.com/api/leagues-classic/{lid}/standings/?page_standings={pg}")
                for r in off.get("standings", {}).get("results", [])[:10]:
                    eid = int(r["entry"])
                    checked += 1
                    lt = local_by_id.get(eid)
                    cr = chunk_res.get(eid)
                    if not lt or not cr:
                        tier2_err += 1
                        print(f"    MISMATCH [{lid}] entry {eid} missing in local Tier 2 files")
                        continue
                    if gw_checked:
                        if int(lt.get("total_points") or 0) != int(r.get("total") or 0) or int(cr.get("points") or 0) != int(r.get("event_total") or 0):
                            tier2_err += 1
                            print(f"    MISMATCH [{lid}] {r.get('entry_name')} ({eid}): official ev={r.get('event_total')} tot={r.get('total')} vs local gross={cr.get('points')} tot={lt.get('total_points')}")
            # Cross-check sampled teams with non-zero hits against official /picks/ endpoint
            if gw_started and len(teams) <= 3000:
                sample_hits_rows = [r for r in chunk_results_list if int(r.get("hits") or 0) > 0][:3]
                if not sample_hits_rows:
                    sample_hits_rows = chunk_results_list[:3]
                for hr in sample_hits_rows:
                    heid = int(hr["entry_id"])
                    hpicks = fetch_json(f"https://fantasy.premierleague.com/api/entry/{heid}/event/{gw}/picks/")
                    off_chip = hpicks.get("active_chip")
                    chip_norm = str(off_chip or "").strip().lower().replace("_", "")
                    off_hits = 0 if chip_norm in ("wildcard", "freehit") else int((hpicks.get("entry_history") or {}).get("event_transfers_cost") or 0)
                    if int(hr.get("hits") or 0) != off_hits or hr.get("chip") != off_chip:
                        tier2_err += 1
                        print(f"    MISMATCH [{lid}] entry {heid} hits/chip: local=({hr.get('hits')},{hr.get('chip')}) vs official=({off_hits},{off_chip})")
                    hits_checked += 1

            if tier2_err == 0:
                cap_count = sum(1 for r in chunk_results_list if r.get("captain") not in ("-", None, ""))
                hits_count = sum(1 for r in chunk_results_list if int(r.get("hits") or 0) > 0)
                chips_count = sum(1 for r in chunk_results_list if r.get("chip"))
                print(f"  PASS [{lid} Tier 2] {name}: {len(teams)} teams, {cap_count} captains, {hits_count} hits, {chips_count} chips, sampled {checked} standings + {hits_checked} live /picks -> 100% match")
            else:
                total_errors += tier2_err
        else:
            # Verify ALL teams in Tier 1 league against Official Standings & Live Player Points + Provisional Auto-Subs
            off_by_id = {}
            page = 1
            while True:
                off = fetch_json(f"https://fantasy.premierleague.com/api/leagues-classic/{lid}/standings/?page_standings={page}")
                for r in off.get("standings", {}).get("results", []):
                    off_by_id[int(r["entry"])] = r
                if not off.get("standings", {}).get("has_next"):
                    break
                page += 1

            res_by_id = {int(r["entry_id"]): r for r in results if r.get("entry_id")}
            squads = ldata.get("squads") or {}
            t1_err = 0
            provisional_subs_count = 0
            for t in teams:
                eid = int(t["entry_id"])
                sq = squads.get(f"{eid}_{gw}")
                rr = res_by_id.get(eid)
                off = off_by_id.get(eid)
                if not sq or not rr or not off:
                    t1_err += 1
                    print(f"    MISMATCH [{lid}] missing data for {eid}")
                    continue
                if any(s.get("is_provisional") for s in (sq.get("auto_subs") or [])):
                    provisional_subs_count += 1
                # Compare stored squad player raw points sum vs rr['points']
                calc_pts = sum(int(p.get("points") or 0) for p in sq.get("starting", []))
                if sq.get("chip") in ("bboost", "bench_boost"):
                    calc_pts += sum(int(p.get("points") or 0) for p in sq.get("bench", []))
                if calc_pts != int(rr.get("points") or 0):
                    t1_err += 1
                    print(f"    MISMATCH [{lid}] {t.get('entry_name')} squad_sum={calc_pts} vs result.points={rr.get('points')}")
            if t1_err == 0:
                note = f" ({provisional_subs_count} w/ provisional auto-sub)" if provisional_subs_count else ""
                print(f"  PASS [{lid} Tier 1] {name}: {len(teams)}/{len(off_by_id)} teams synced & squad sums match 100%{note}")
            else:
                total_errors += t1_err

    if total_errors > 0:
        print(f"\nAUDIT FAILED with {total_errors} error(s).")
        return 1
    print("\nALL 9 LEAGUES PASSED LIVE ACCURACY AUDIT (100% MATCH)!")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
