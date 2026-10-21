#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Parser and calculation engine for Shi'62 Special mini-game (League 187827).
Zero-sum peer-to-peer handicap betting pool.
"""

import os
import re
import json

PLAYER_MAPPING = {
    "tong": {"entry_id": 1309919, "display_name": "Tong", "team_name": "amornTong", "manager": "Amornthep Taveephanich"},
    "oo": {"entry_id": 837763, "display_name": "Oo", "team_name": "Oöraora Grandé", "manager": "Patrick Oo"},
    "riin": {"entry_id": 2342390, "display_name": "Riin", "team_name": "Riin FC", "manager": "WARIN SINAROJ"},
    "totti": {"entry_id": 720631, "display_name": "Totti", "team_name": "Totti Toon Army", "manager": "Totti NUFC"},
    "poang": {"entry_id": 1153245, "display_name": "Poang", "team_name": "The Cannon", "manager": "Kasidit Boonyawat"},
    "oan": {"entry_id": 7601484, "display_name": "Oan", "team_name": "Benjamin Seskooan", "manager": "Nattaporn Yaemsaard"},
    "sia": {"entry_id": 3508212, "display_name": "Sia", "team_name": "SiaLeela", "manager": "Prachya Leelamantep"},
    "mai": {"entry_id": 1312974, "display_name": "Mai", "team_name": "Emery's Revenge", "manager": "Rati Leetrakul"},
    "boy": {"entry_id": 2804957, "display_name": "Boy", "team_name": "Carrickysseus", "manager": "Thamrong Pattarajiarapan"},
    "bert": {"entry_id": 4549514, "display_name": "Bert", "team_name": "Bluebert's Team", "manager": "Bluebert Tingnongnoi"},
    "pong+": {"entry_id": 5340913, "display_name": "Pong+", "team_name": "Winwinwin", "manager": "Ratapan W"},
    "dow": {"entry_id": 5463640, "display_name": "Dow", "team_name": "Bruno Carrick", "manager": "Bruno Zoro"},
    "nod": {"entry_id": None, "display_name": "Nod", "team_name": "เล่นเฉพาะมินิเกม", "manager": "ผู้ร่วมทายผล", "is_guest": True}
}

def get_player_info(raw_name):
    clean = raw_name.lower().strip()
    # alias checks
    if clean in ("poang", "ป๋อง", "เป๋ง"):
        clean = "poang"
    elif clean in ("pong+", "pong", "โป้ง", "win", "winwinwin"):
        clean = "pong+"
    elif clean in ("boy", "ดี้"):
        clean = "boy"
    elif clean in ("sia", "เสี่ย"):
        clean = "sia"
    elif clean in ("dow", "ดาว", "bruno"):
        clean = "dow"
    elif clean in ("oo", "อู๋"):
        clean = "oo"
    elif clean in ("nod", "น็อด"):
        clean = "nod"
    elif clean in ("riin", "rin", "ริน", "warin"):
        clean = "riin"
    elif clean in ("totti", "ต็อต"):
        clean = "totti"
    elif clean in ("tong", "ต๋อง", "amorn"):
        clean = "tong"
    elif clean in ("oan", "อ้วน", "seskooan"):
        clean = "oan"
    elif clean in ("mai", "ใหม่", "rati"):
        clean = "mai"
    elif clean in ("bert", "เบิร์ท", "bluebert"):
        clean = "bert"

    if clean in PLAYER_MAPPING:
        return PLAYER_MAPPING[clean]
    
    return {
        "entry_id": None,
        "display_name": raw_name.capitalize(),
        "team_name": raw_name.capitalize(),
        "manager": raw_name.capitalize()
    }

def calculate_payouts(losers, winners):
    """
    Losers pay 100 THB each.
    Winners split pool evenly. If remainder exists, distribute 5/10 THB to first listed winners.
    If no winners, void/push: nobody loses or wins.
    """
    payouts = {}
    if not winners:
        # Void / Push
        for l in losers:
            payouts[l] = {"net": 0, "status": "push"}
        return payouts, 0, "void"

    num_losers = len(losers)
    pool = num_losers * 100
    num_winners = len(winners)

    for l in losers:
        payouts[l] = {"net": -100, "status": "lost"}

    if num_winners == 0:
        return payouts, pool, "void"

    # Base amount in increments of 5 THB
    base = (pool // (num_winners * 5)) * 5
    rem = pool - (base * num_winners)

    for i, w in enumerate(winners):
        extra = 0
        if rem >= 5:
            extra = 5
            rem -= 5
        win_amt = base + extra
        payouts[w] = {"net": win_amt, "status": "won"}

    return payouts, pool, "normal"

def normalize_gw_name(raw_name):
    if not raw_name:
        return ""
    s = raw_name.strip()
    upper = s.upper()
    if upper == "COMMU" or "COMMU" in upper:
        return "GW1 (Commu)"
    m = re.match(r'^[Ww](\d+)', s)
    if m:
        return f"GW{m.group(1)}"
    m2 = re.match(r'^[Gg][Ww](\d+)', s)
    if m2:
        return f"GW{m2.group(1)}"
    return s

def parse_shi62_file(file_path):
    if not os.path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8") as f:
        lines = [l.strip() for l in f.readlines()]

    gameweeks = []
    current_gw_name = None
    current_gw_matches = []
    current_match = None

    # Helper to finalize match
    def finalize_match(match):
        if not match:
            return None
        winners = []
        losers = []
        has_winning_box = False
        winning_option = None

        for opt in match["options"]:
            if opt["is_win"]:
                has_winning_box = True
                winning_option = opt["label"]
                winners.extend(opt["names"])
            else:
                losers.extend(opt["names"])

        payouts, pool, status = calculate_payouts(losers, winners)
        match["winning_option"] = winning_option
        match["pool"] = pool
        match["status"] = status
        match["winners"] = winners
        match["losers"] = losers
        match["payouts"] = payouts
        return match

    # Helper to finalize gameweek
    def finalize_gw(gw_name, matches):
        if not gw_name or not matches:
            return None
        
        # Calculate GW summary
        gw_player_stats = {}
        total_gw_pool = 0

        for m in matches:
            total_gw_pool += m["pool"]
            for opt in m["options"]:
                for name in opt["names"]:
                    p_info = get_player_info(name)
                    disp = p_info["display_name"]
                    if disp not in gw_player_stats:
                        gw_player_stats[disp] = {
                            "player": p_info,
                            "matches": 0,
                            "won": 0,
                            "lost": 0,
                            "push": 0,
                            "net": 0
                        }

            for p_name, p_res in m["payouts"].items():
                p_info = get_player_info(p_name)
                disp = p_info["display_name"]
                st = gw_player_stats[disp]
                st["matches"] += 1
                if p_res["status"] == "won":
                    st["won"] += 1
                elif p_res["status"] == "lost":
                    st["lost"] += 1
                elif p_res["status"] == "push":
                    st["push"] += 1
                st["net"] += p_res["net"]

        # Sort GW summary descending by net
        sorted_stats = sorted(
            gw_player_stats.values(),
            key=lambda x: (x["net"], x["won"]),
            reverse=True
        )

        return {
            "name": gw_name,
            "matches": matches,
            "total_pool": total_gw_pool,
            "summary": sorted_stats
        }

    i = 0
    while i < len(lines):
        line = lines[i]
        if not line:
            i += 1
            continue

        # Check for GW header (e.g. W7, GW6, W5, GW4, GW3, GW2, W1, Commu)
        is_gw_header = False
        upper_line = line.upper()
        if (upper_line.startswith("GW") or upper_line.startswith("W") or upper_line == "COMMU") and len(line) <= 8 and not (':' in line or ' v ' in line.lower()):
            is_gw_header = True

        if is_gw_header:
            # Check if this is "Commu" right under "W1" or similar
            if upper_line == "COMMU" and current_gw_name in ("W1", "GW1") and len(current_gw_matches) == 0:
                current_gw_name = "GW1 (Commu)"
                i += 1
                continue

            if current_match:
                current_gw_matches.append(finalize_match(current_match))
                current_match = None

            if current_gw_name and current_gw_matches:
                gw_obj = finalize_gw(normalize_gw_name(current_gw_name), current_gw_matches)
                if gw_obj:
                    gameweeks.append(gw_obj)
                current_gw_matches = []

            current_gw_name = normalize_gw_name(line)
            i += 1
            continue

        # Check for match title: e.g. "EVE v CHE -0.5", "ARS : MCI", "BRE v LIV"
        # Match headers contain ' v ' or ' : ' and do NOT start with an option prefix like 'A.' or 'd.'
        is_match_header = (' v ' in line.lower() or ' : ' in line.lower()) and not re.match(r'^[A-Za-z]{1,3}[\.\:]\s*', line)
        if is_match_header:
            if current_match:
                current_gw_matches.append(finalize_match(current_match))
                current_match = None

            current_match = {
                "title": line,
                "options": []
            }
            i += 1
            continue

        # Otherwise, it's a bet option line: e.g. "E. Dow Totti", "C. Nod, Oo✅", "d. poang", "A: Dow✅"
        if current_match:
            is_win = "✅" in line
            cleaned = line.replace("✅", "").strip()
            parts = re.split(r'[\.\:]\s*', cleaned, maxsplit=1)
            opt_label = parts[0].strip()
            names_raw = parts[1].strip() if len(parts) > 1 else ""
            
            # Extract player names
            names = []
            for n in re.split(r'[, ]+', names_raw):
                n = n.strip()
                if n:
                    names.append(n)

            current_match["options"].append({
                "label": opt_label,
                "raw_text": line,
                "names": names,
                "is_win": is_win
            })

        i += 1

    # End of file cleanups
    if current_match:
        current_gw_matches.append(finalize_match(current_match))
    if current_gw_name and current_gw_matches:
        gw_obj = finalize_gw(normalize_gw_name(current_gw_name), current_gw_matches)
        if gw_obj:
            gameweeks.append(gw_obj)

    # Sort gameweeks descending (GW7, GW6, GW5, GW4, GW3, GW2, GW1, GW1 (Commu))
    def get_gw_sort_key(g):
        name = g["name"]
        if "COMMU" in name.upper():
            return (1, 0)
        m = re.match(r'GW(\d+)', name, re.IGNORECASE)
        if m:
            return (int(m.group(1)), 1)
        return (0, 0)

    gameweeks.sort(key=get_gw_sort_key, reverse=True)

    # Compute Overall Season Cumulative Standings
    cumulative = {}
    total_season_turnover = 0
    total_season_matches = 0

    for gw in gameweeks:
        total_season_turnover += gw["total_pool"]
        total_season_matches += len(gw["matches"])
        for p_stat in gw["summary"]:
            disp = p_stat["player"]["display_name"]
            if disp not in cumulative:
                cumulative[disp] = {
                    "player": p_stat["player"],
                    "matches": 0,
                    "won": 0,
                    "lost": 0,
                    "push": 0,
                    "total_won_amount": 0,
                    "total_lost_amount": 0,
                    "net": 0
                }
            c = cumulative[disp]
            c["matches"] += p_stat["matches"]
            c["won"] += p_stat["won"]
            c["lost"] += p_stat["lost"]
            c["push"] += p_stat["push"]
            c["net"] += p_stat["net"]
            if p_stat["net"] > 0:
                c["total_won_amount"] += p_stat["net"]
            elif p_stat["net"] < 0:
                c["total_lost_amount"] += abs(p_stat["net"])

    # Calculate win rate and sort cumulative
    cumulative_list = []
    for c in cumulative.values():
        total_decided = c["won"] + c["lost"]
        c["win_rate"] = round((c["won"] / total_decided * 100), 1) if total_decided > 0 else 0.0
        cumulative_list.append(c)

    cumulative_list.sort(key=lambda x: (x["net"], x["win_rate"], x["won"]), reverse=True)
    for rank, c in enumerate(cumulative_list, 1):
        c["rank"] = rank

    return {
        "league_id": 187827,
        "title": "Shi'62 Special",
        "description": "มินิเกมทายผลบอลพรีเมียร์ลีกสุดมันส์ประจำสัปดาห์ (แทงผิดเสียขาละ 100 คนถูกหารเงินรางวัล)",
        "total_season_matches": total_season_matches,
        "total_season_turnover": total_season_turnover,
        "cumulative_standings": cumulative_list,
        "gameweeks": gameweeks
    }

if __name__ == "__main__":
    result = parse_shi62_file("config/shi62_special.txt")
    print("Parsed GWs:", len(result["gameweeks"]))
    for gw in result["gameweeks"]:
        print(f"GW {gw['name']}: {len(gw['matches'])} matches, Pool: {gw['total_pool']} THB")
        for s in gw["summary"]:
            print(f"  {s['player']['display_name']}: {s['net']:+d} THB ({s['won']}W {s['lost']}L {s['push']}P)")
    print("\n--- Cumulative Standings ---")
    for c in result["cumulative_standings"]:
        print(f"#{c['rank']} {c['player']['display_name']} ({c['player']['team_name']}): {c['net']:+d} THB | {c['won']}W-{c['lost']}L ({c['win_rate']}%)")
    print("\nZero-sum check total net across all players:", sum(c['net'] for c in result["cumulative_standings"]))
