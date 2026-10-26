#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Parser and calculation engine for Bramann League (League 5349) mini-games:
1. Bramann Prediction (ทายผล)
2. Bramann Challenge (ท้าชน)
"""

import os
import re
import json

PLAYER_MAPPING = {
    "jrj": {"entry_id": 1154605, "display_name": "jrj", "team_name": "67", "manager": "ming JRJ X"},
    "67": {"entry_id": 1154605, "display_name": "jrj", "team_name": "67", "manager": "ming JRJ X"},
    "anuth": {"entry_id": 226, "display_name": "Anuth", "team_name": "van Xke", "manager": "Anuth Duangmarn"},
    "van": {"entry_id": 226, "display_name": "Anuth", "team_name": "van Xke", "manager": "Anuth Duangmarn"},
    "oak": {"entry_id": 7501, "display_name": "Oak", "team_name": "BMFC™", "manager": "Thiti Oak"},
    "bmfc": {"entry_id": 7501, "display_name": "Oak", "team_name": "BMFC™", "manager": "Thiti Oak"},
    "oo": {"entry_id": 837763, "display_name": "Oo", "team_name": "Oöraora Grandé", "manager": "Patrick Oo"},
    "ooraola": {"entry_id": 837763, "display_name": "Oo", "team_name": "Oöraora Grandé", "manager": "Patrick Oo"},
    "auau": {"entry_id": 2160906, "display_name": "HereAu", "team_name": "HereAu", "manager": "Auau Auau"},
    "hereau": {"entry_id": 2160906, "display_name": "HereAu", "team_name": "HereAu", "manager": "Auau Auau"},
    "hong": {"entry_id": 1151793, "display_name": "Hong", "team_name": "Univerpool", "manager": "Hong Jakrapan"},
    "univerpool": {"entry_id": 1151793, "display_name": "Hong", "team_name": "Univerpool", "manager": "Hong Jakrapan"},
    "b": {"entry_id": 268461, "display_name": "B", "team_name": "Pongacku", "manager": "pongchlit kittipansopone"},
    "pongacku": {"entry_id": 268461, "display_name": "B", "team_name": "Pongacku", "manager": "pongchlit kittipansopone"},
    "dotman": {"entry_id": 1163206, "display_name": "Dotman", "team_name": "Dotman 2026", "manager": "Pirapat Nitichaiyanan"},
    "4our": {"entry_id": 171774, "display_name": "4OUR", "team_name": "4OUR", "manager": "jaturont usahacharoenporn"},
    "4": {"entry_id": 171774, "display_name": "4OUR", "team_name": "4OUR", "manager": "jaturont usahacharoenporn"},
    "kwang": {"entry_id": 8169868, "display_name": "kwang", "team_name": "KwangSettha", "manager": "Settha Eamchunam"},
    "fee": {"entry_id": None, "display_name": "Fee", "team_name": "ผู้ร่วมทายผล", "manager": "Fee (Guest)", "is_guest": True},
    "f": {"entry_id": None, "display_name": "Fee", "team_name": "ผู้ร่วมทายผล", "manager": "Fee (Guest)", "is_guest": True},
    "natee": {"entry_id": 2477350, "display_name": "Natee", "team_name": "-Nk_KOP", "manager": "Natee Kakeaw"},
    "vares": {"entry_id": 693142, "display_name": "Vares", "team_name": "Putun KNVB", "manager": "vares P"},
    "tanong": {"entry_id": 132673, "display_name": "Tanong", "team_name": "NUKE-UTD®", "manager": "Tanong Mapanya"},
    "ravi": {"entry_id": 1645622, "display_name": "Ravi", "team_name": "Micchester United", "manager": "Ravi Upadhaya"},
    "vej": {"entry_id": 1742533, "display_name": "Vej", "team_name": "CasanoVej", "manager": "Pativej Mahateerasombat"},
    "falco": {"entry_id": 1243502, "display_name": "Falco", "team_name": "Falco.245", "manager": "Falco Siwachat"},
    "jatsada": {"entry_id": 2316037, "display_name": "Jatsada", "team_name": "Talidtidty", "manager": "jatsada wisawawithayanukun"},
    "sema": {"entry_id": 3781407, "display_name": "Sema", "team_name": "golden club", "manager": "เสมา ขุนศึก"},
    "supalerk": {"entry_id": 9151303, "display_name": "Supalerk", "team_name": "Supalerk's Team", "manager": "Supalerk Wiwattarangkul"},
    "micky": {"entry_id": 306983, "display_name": "Micky", "team_name": "GEMINI UNITED", "manager": "Micky Asawamanasak", "is_guest": True}
}

def get_player_info(raw_name):
    clean = raw_name.lower().strip()
    if clean in PLAYER_MAPPING:
        return PLAYER_MAPPING[clean]
    return {
        "entry_id": None,
        "display_name": raw_name.capitalize(),
        "team_name": raw_name.capitalize(),
        "manager": raw_name.capitalize(),
        "is_guest": True
    }

def parse_bettor_token(token):
    """
    Parses token like 'Dotmanx5', 'Bx5', 'fee*5', 'feex2', 'jrj'
    Returns (clean_name, legs)
    """
    t = token.strip()
    # Check for multiplier like x5, *5, X5
    m = re.search(r'[xX*](\d+)$', t)
    if m:
        legs = max(1, min(5, int(m.group(1))))
        name = t[:m.start()].strip()
    else:
        legs = 1
        name = t
    return name, legs

def calculate_bramann_payouts(side1_bets, side2_bets, winning_side):
    """
    Bramann Prediction Payout Engine:
    - Minimum 100 THB per leg. Max 5 legs.
    - If winning_side is None, 'draw', or 'push': All void / push (net 0).
    - If one side has 0 bets: Void / push (net 0).
    - Loser pool = total_losing_legs * 100 THB.
    - Each winner leg gets (loser_pool / total_winning_legs).
    - Round to integer THB: round(legs * per_leg_win).
    - Adjust rounding discrepancy so sum(winners) == sum(losers).
    """
    payouts = {}

    def aggregate_bets(bets):
        res = {}
        for b in bets:
            res[b["name"]] = res.get(b["name"], 0) + b["legs"]
        return [{"name": k, "legs": v} for k, v in res.items()]

    agg_side1 = aggregate_bets(side1_bets)
    agg_side2 = aggregate_bets(side2_bets)

    total_side1_legs = sum(b["legs"] for b in agg_side1)
    total_side2_legs = sum(b["legs"] for b in agg_side2)

    # Initialize all to 0
    for b in agg_side1 + agg_side2:
        payouts[b["name"]] = {"net": 0, "legs": b["legs"], "status": "push"}

    if winning_side not in (1, 2) or total_side1_legs == 0 or total_side2_legs == 0:
        return payouts, 0, "push"

    if winning_side == 1:
        winners = agg_side1
        losers = agg_side2
        winner_legs = total_side1_legs
        loser_legs = total_side2_legs
    else:
        winners = agg_side2
        losers = agg_side1
        winner_legs = total_side2_legs
        loser_legs = total_side1_legs

    loser_pool = loser_legs * 100
    per_leg_payout = loser_pool / winner_legs

    # Losers pay 100 per leg
    for l in losers:
        lost_amt = l["legs"] * 100
        payouts[l["name"]] = {
            "net": -lost_amt,
            "legs": l["legs"],
            "status": "lost"
        }

    # Winners receive share
    allocated_sum = 0
    winner_items = []
    for w in winners:
        raw_win = w["legs"] * per_leg_payout
        win_amt = int(round(raw_win))
        allocated_sum += win_amt
        winner_items.append((w["name"], w["legs"], win_amt))

    # Reconcile rounding diff
    diff = loser_pool - allocated_sum
    if diff != 0 and winner_items:
        # Give or take diff from the winner with the most legs
        winner_items.sort(key=lambda x: x[1], reverse=True)
        top_name, top_legs, top_win = winner_items[0]
        winner_items[0] = (top_name, top_legs, top_win + diff)

    for name, legs, win_amt in winner_items:
        payouts[name] = {
            "net": win_amt,
            "legs": legs,
            "status": "won"
        }

    return payouts, loser_pool, "normal"

def parse_bramann_prediction_file(file_path):
    if not os.path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8") as f:
        raw_lines = [l.strip() for l in f.readlines()]

    gameweeks = []
    current_gw = None
    current_matches = []
    
    i = 0
    while i < len(raw_lines):
        line = raw_lines[i]
        if not line:
            i += 1
            continue

        # Match GW header like GW1, GW2, W1
        m_gw = re.match(r'^(?:GW|W)(\d+)', line, re.IGNORECASE)
        if m_gw:
            if current_gw and current_matches:
                gameweeks.append({
                    "name": f"GW{current_gw}",
                    "gw": current_gw,
                    "matches": current_matches
                })
            current_gw = int(m_gw.group(1))
            current_matches = []
            i += 1
            continue

        # Match fixture line e.g. 'HUL V MUN -1.5' or 'EVE V CRY'
        if re.search(r'\s+[vV:]\s+|\s+[vV][sS]\s+', line):
            fixture_title = line
            i += 1
            # Next line: Side 1
            side1_line = raw_lines[i] if i < len(raw_lines) else ""
            i += 1
            # Next line: Side 2
            side2_line = raw_lines[i] if i < len(raw_lines) else ""
            i += 1

            # Parse Side 1
            s1_win = "✅" in side1_line
            s1_clean = side1_line.replace("✅", "").strip()
            s1_tokens = s1_clean.split()
            s1_label = s1_tokens[0].rstrip('.') if s1_tokens else "Side 1"
            s1_bettor_tokens = s1_tokens[1:] if len(s1_tokens) > 1 else []
            s1_bets = []
            for bt in s1_bettor_tokens:
                pname, legs = parse_bettor_token(bt)
                pinfo = get_player_info(pname)
                s1_bets.append({"name": pinfo["display_name"], "raw_token": bt, "legs": legs})

            # Parse Side 2
            s2_win = "✅" in side2_line
            s2_clean = side2_line.replace("✅", "").strip()
            s2_tokens = s2_clean.split()
            s2_label = s2_tokens[0].rstrip('.') if s2_tokens else "Side 2"
            s2_bettor_tokens = s2_tokens[1:] if len(s2_tokens) > 1 else []
            s2_bets = []
            for bt in s2_bettor_tokens:
                pname, legs = parse_bettor_token(bt)
                pinfo = get_player_info(pname)
                s2_bets.append({"name": pinfo["display_name"], "raw_token": bt, "legs": legs})

            winning_side = None
            if s1_win and not s2_win:
                winning_side = 1
            elif s2_win and not s1_win:
                winning_side = 2
            else:
                winning_side = "push"

            payouts, pool, status = calculate_bramann_payouts(s1_bets, s2_bets, winning_side)

            current_matches.append({
                "title": fixture_title,
                "side1_label": s1_label,
                "side2_label": s2_label,
                "side1_bets": s1_bets,
                "side2_bets": s2_bets,
                "side1_legs": sum(b["legs"] for b in s1_bets),
                "side2_legs": sum(b["legs"] for b in s2_bets),
                "winning_side": winning_side,
                "winning_label": s1_label if winning_side == 1 else (s2_label if winning_side == 2 else "เสมอ/ยก"),
                "status": status,
                "pool": pool,
                "payouts": payouts
            })
            continue

        i += 1

    if current_gw and current_matches:
        gameweeks.append({
            "name": f"GW{current_gw}",
            "gw": current_gw,
            "matches": current_matches
        })

    # Calculate cumulative standings across all GWs
    player_cum = {}
    total_season_turnover = 0
    total_season_matches = 0

    for gw in gameweeks:
        for m in gw["matches"]:
            total_season_matches += 1
            total_season_turnover += m["pool"]
            
            # Combine all participants
            all_participants = {b["name"]: b["legs"] for b in m["side1_bets"] + m["side2_bets"]}
            for pname, legs in all_participants.items():
                pinfo = get_player_info(pname)
                disp = pinfo["display_name"]
                if disp not in player_cum:
                    player_cum[disp] = {
                        "player": pinfo,
                        "matches": 0,
                        "legs_total": 0,
                        "won": 0,
                        "lost": 0,
                        "push": 0,
                        "total_won_amount": 0,
                        "total_lost_amount": 0,
                        "net": 0
                    }
                rec = player_cum[disp]
                rec["matches"] += 1
                rec["legs_total"] += legs
                p_out = m["payouts"].get(disp, {"net": 0, "status": "push"})
                net_val = p_out["net"]
                rec["net"] += net_val
                if net_val > 0:
                    rec["won"] += 1
                    rec["total_won_amount"] += net_val
                elif net_val < 0:
                    rec["lost"] += 1
                    rec["total_lost_amount"] += abs(net_val)
                else:
                    rec["push"] += 1

    cum_list = list(player_cum.values())
    for c in cum_list:
        decided = c["won"] + c["lost"]
        c["win_rate"] = round((c["won"] / decided * 100.0), 1) if decided > 0 else 0.0

    cum_list.sort(key=lambda x: (x["net"], x["won"], -x["lost"]), reverse=True)
    for idx, c in enumerate(cum_list):
        c["rank"] = idx + 1

    return {
        "league_id": 5349,
        "title": "Bramann Prediction (ทายผล)",
        "description": "มินิเกมทายผลฟุตบอลแบบพูลหารเท่า ขาละ 100 บาท สูงสุด 5 ขาต่อคู่ เสมอแยกย้าย ปัดเศษบาทลงตัว",
        "total_season_matches": total_season_matches,
        "total_season_turnover": total_season_turnover,
        "gameweeks": gameweeks,
        "cumulative_standings": cum_list
    }

def parse_bramann_challenge_file(file_path, multi_data=None):
    if not os.path.exists(file_path):
        return None
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except Exception as e:
        print(f"Error reading bramann challenge file: {e}")
        return None

    # Resolve fantasy scores and tie breakers if multi_data provided
    gameweeks = data.get("gameweeks", [])
    player_cum = {}
    total_turnover = 0
    total_matches = 0

    l_data = multi_data.get("leagues", {}).get("5349", {}) if multi_data else {}
    gw_data = l_data.get("gameweeks", {})
    sq_data = l_data.get("squads", {})

    for gw_obj in gameweeks:
        gw_num = gw_obj.get("gw")
        gw_obj["name"] = gw_obj.get("name") or f"GW{gw_num}"
        gw_res = gw_data.get(str(gw_num), {}).get("results", [])
        
        for m in gw_obj.get("matches", []):
            total_matches += 1
            t1_id = m.get("team1_id")
            t2_id = m.get("team2_id")
            count_hits = m.get("count_hits", True)
            count_chips = m.get("count_chips", False)
            
            # Fetch scores and squads
            res1 = next((r for r in gw_res if r.get("entry_id") == t1_id), None)
            res2 = next((r for r in gw_res if r.get("entry_id") == t2_id), None)
            sq1 = sq_data.get(f"{t1_id}_{gw_num}", {})
            sq2 = sq_data.get(f"{t2_id}_{gw_num}", {})

            def adjust_score_for_chips(base_pts, res_obj, sq_obj):
                if count_chips or not res_obj or not sq_obj:
                    return base_pts
                chip = res_obj.get("chip") or sq_obj.get("chip")
                adj_pts = base_pts
                if chip in ("bboost", "bench_boost"):
                    bench_pts = sum(p.get("points", 0) for p in sq_obj.get("bench", []))
                    adj_pts -= bench_pts
                elif chip in ("3xc", "triple_captain"):
                    cap_p = next((p for p in sq_obj.get("starting", []) if p.get("is_captain") or p.get("multiplier", 1) == 3), None)
                    if cap_p:
                        raw_p = cap_p.get("raw_points", cap_p.get("points", 0) // 3)
                        adj_pts -= raw_p
                return adj_pts
            
            pts1 = 0
            pts2 = 0
            if res1:
                raw_pts1 = res1.get("net_points" if count_hits else "points", 0)
                pts1 = adjust_score_for_chips(raw_pts1, res1, sq1)
                m["team1_name"] = res1.get("team_name", m.get("team1_name"))
                m["team1_player"] = res1.get("player_name", "")
                m["team1_captain"] = res1.get("captain", "-")
            if res2:
                raw_pts2 = res2.get("net_points" if count_hits else "points", 0)
                pts2 = adjust_score_for_chips(raw_pts2, res2, sq2)
                m["team2_name"] = res2.get("team_name", m.get("team2_name"))
                m["team2_player"] = res2.get("player_name", "")
                m["team2_captain"] = res2.get("captain", "-")

            m["team1_pts"] = pts1
            m["team2_pts"] = pts2

            # Winner determination with Tie-Breaker Ladder
            winning_side = None
            tie_break_note = ""
            if pts1 > pts2:
                winning_side = 1
            elif pts2 > pts1:
                winning_side = 2
            else:
                # Tie-Breaker: Check Captain points
                def get_capt_pts(sq):
                    if not sq or not sq.get("starting"): return 0
                    pool = list(sq["starting"]) + (list(sq.get("bench", [])) if (count_chips and sq.get("chip") in ("bboost", "bench_boost")) else [])
                    c = next((p for p in pool if p.get("is_captain")), None)
                    if not c: return 0
                    if not count_chips and sq.get("chip") in ("3xc", "triple_captain"):
                        return c.get("raw_points", 0) * 2
                    return c.get("points", 0)

                def get_vcapt_pts(sq):
                    if not sq or not sq.get("starting"): return 0
                    pool = list(sq["starting"]) + (list(sq.get("bench", [])) if (count_chips and sq.get("chip") in ("bboost", "bench_boost")) else [])
                    vc = next((p for p in pool if p.get("is_vice") or p.get("is_vice_captain")), None)
                    return vc.get("points", 0) if vc else 0

                def get_sorted_player_scores(sq):
                    if not sq or not sq.get("starting"): return []
                    pool = list(sq["starting"]) + (list(sq.get("bench", [])) if (count_chips and sq.get("chip") in ("bboost", "bench_boost")) else [])
                    return sorted([p.get("raw_points", p.get("points", 0)) for p in pool], reverse=True)

                c1 = get_capt_pts(sq1)
                c2 = get_capt_pts(sq2)
                if c1 > c2:
                    winning_side = 1
                    tie_break_note = f"เสมอแต้มรวม ชนะกัปตัน ({c1} vs {c2})"
                elif c2 > c1:
                    winning_side = 2
                    tie_break_note = f"เสมอแต้มรวม ชนะกัปตัน ({c2} vs {c1})"
                else:
                    vc1 = get_vcapt_pts(sq1)
                    vc2 = get_vcapt_pts(sq2)
                    if vc1 > vc2:
                        winning_side = 1
                        tie_break_note = f"เสมอแต้มรวมและกัปตัน ชนะรองกัปตัน ({vc1} vs {vc2})"
                    elif vc2 > vc1:
                        winning_side = 2
                        tie_break_note = f"เสมอแต้มรวมและกัปตัน ชนะรองกัปตัน ({vc2} vs {vc1})"
                    else:
                        s1 = get_sorted_player_scores(sq1)
                        s2 = get_sorted_player_scores(sq2)
                        for idx_p in range(min(len(s1), len(s2))):
                            if s1[idx_p] > s2[idx_p]:
                                winning_side = 1
                                tie_break_note = f"ชนะตัวท็อปอันดับ {idx_p+1} ({s1[idx_p]} vs {s2[idx_p]})"
                                break
                            elif s2[idx_p] > s1[idx_p]:
                                winning_side = 2
                                tie_break_note = f"ชนะตัวท็อปอันดับ {idx_p+1} ({s2[idx_p]} vs {s1[idx_p]})"
                                break
                        if winning_side is None:
                            winning_side = "push"
                            tie_break_note = "แต้มเท่ากันทุกตำแหน่ง เสมอแยกย้าย"

            m["winning_side"] = winning_side
            m["tie_break_note"] = tie_break_note
            
            # Calculate betting payouts
            s1_bets = m.get("side1_bets", [])
            s2_bets = m.get("side2_bets", [])
            payouts, pool, status = calculate_bramann_payouts(s1_bets, s2_bets, winning_side)
            m["payouts"] = payouts
            m["pool"] = pool
            m["status"] = status
            total_turnover += pool

            # Cumulative stats
            for b in s1_bets + s2_bets:
                name = b["name"]
                pinfo = get_player_info(name)
                disp = pinfo["display_name"]
                if disp not in player_cum:
                    player_cum[disp] = {
                        "player": pinfo,
                        "matches": 0,
                        "legs_total": 0,
                        "won": 0,
                        "lost": 0,
                        "push": 0,
                        "net": 0
                    }
                rec = player_cum[disp]
                rec["matches"] += 1
                rec["legs_total"] += b["legs"]
                p_out = payouts.get(name, {"net": 0, "status": "push"})
                net_val = p_out["net"]
                rec["net"] += net_val
                if net_val > 0: rec["won"] += 1
                elif net_val < 0: rec["lost"] += 1
                else: rec["push"] += 1

    cum_list = list(player_cum.values())
    cum_list.sort(key=lambda x: (x["net"], x["won"]), reverse=True)
    for idx, c in enumerate(cum_list):
        c["rank"] = idx + 1

    return {
        "league_id": 5349,
        "title": "Bramann Challenge (ท้าชน)",
        "description": "ดวลกึ๋นแต้มแฟนตาซีตัวต่อตัวประจำสัปดาห์ พร้อมระบบวางเดิมพันร่วม",
        "total_season_matches": total_matches,
        "total_season_turnover": total_turnover,
        "gameweeks": gameweeks,
        "cumulative_standings": cum_list
    }

if __name__ == "__main__":
    pred = parse_bramann_prediction_file("config/bramann_prediction.txt")
    print("Parsed Prediction GWs:", len(pred["gameweeks"]))
    print("Total Matches:", pred["total_season_matches"])
    print("Total Turnover:", pred["total_season_turnover"])
    print("\nTop 5 Standings:")
    for s in pred["cumulative_standings"][:5]:
        print(f"#{s['rank']} {s['player']['display_name']}: Net {s['net']} THB (Won {s['won']}, Lost {s['lost']}, Push {s['push']})")
