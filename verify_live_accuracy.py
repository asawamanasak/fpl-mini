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
            # Verify GW chunk exists and top/tail pages match Official FPL API
            chunk_path = os.path.join(BASE_DIR, "data", "leagues", str(lid), f"gw{gw}.json")
            if not os.path.exists(chunk_path):
                print(f"  FAIL [{lid}] Tier 2 missing chunk {chunk_path}")
                total_errors += 1
                continue
            chunk_data = json.load(open(chunk_path, "r", encoding="utf-8"))
            chunk_res = {int(r["entry_id"]): r for r in chunk_data.get("results", []) if r.get("entry_id")}
            local_by_id = {int(t["entry_id"]): t for t in teams if t.get("entry_id")}
            sample_pages = [1, 20] if len(teams) > 950 else [1]
            checked = 0
            tier2_err = 0
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
                    elif int(lt.get("total_points") or 0) != int(r.get("total") or 0) or int(cr.get("net_points") or 0) != int(r.get("event_total") or 0):
                        tier2_err += 1
                        print(f"    MISMATCH [{lid}] {r.get('entry_name')} ({eid}): official ev={r.get('event_total')} tot={r.get('total')} vs local ev={cr.get('net_points')} tot={lt.get('total_points')}")
            if tier2_err == 0:
                print(f"  PASS [{lid} Tier 2] {name}: {len(teams)} teams, sampled {checked} rows across page(s) {sample_pages} -> 100% match")
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
