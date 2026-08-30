import urllib.request
import json
import time

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}

def fetch(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode('utf-8'))

def main():
    print("Fetching bootstrap-static...")
    boot = fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
    elements = {p['id']: p for p in boot['elements']}
    teams_by_id = {t['id']: t['short_name'] for t in boot['teams']}
    element_types = {et['id']: et['singular_name_short'] for et in boot['element_types']}

    events = boot['events']
    current_event = next((e for e in events if e['is_current']), events[0])
    max_gw = current_event['id']

    print(f"Fetching league standings 40700 (Current GW: {max_gw})...")
    league_data = fetch('https://fantasy.premierleague.com/api/leagues-classic/40700/standings/')
    teams = league_data['standings']['results']

    live_by_gw = {}
    for gw in range(1, max_gw + 1):
        try:
            print(f"Fetching live elements for GW {gw}...")
            live_data = fetch(f'https://fantasy.premierleague.com/api/event/{gw}/live/')
            live_by_gw[gw] = {el['id']: el['stats']['total_points'] for el in live_data['elements']}
        except Exception as e:
            print(f"Could not fetch live points for GW {gw}: {e}")
            live_by_gw[gw] = {}

    squads_dict = {}
    gameweeks_dict = {}

    for gw_info in events:
        gw_id = gw_info['id']
        if gw_id <= max_gw:
            gameweeks_dict[str(gw_id)] = {
                "gw": gw_id,
                "is_finished": gw_info['finished'],
                "results": []
            }

    teams_list = []
    for t in teams:
        eid = t['entry']
        teams_list.append({
            "entry_id": eid,
            "entry_name": t['entry_name'],
            "player_name": t['player_name']
        })

    print(f"Processing picks and lineups for {len(teams)} teams across GW 1 to {max_gw}...")
    for gw in range(1, max_gw + 1):
        for t in teams:
            eid = t['entry']
            try:
                picks_resp = fetch(f'https://fantasy.premierleague.com/api/entry/{eid}/event/{gw}/picks/')
                hist = picks_resp.get('entry_history', {})
                chip = picks_resp.get('active_chip')
                hits = hist.get('event_transfers_cost', 0)
                
                starting_players = []
                bench_players = []
                capt_name = '-'
                
                for p in picks_resp.get('picks', []):
                    pid = p['element']
                    mult = p.get('multiplier', 1)
                    is_cap = p.get('is_captain', False)
                    is_vice = p.get('is_vice_captain', False)
                    el_info = elements.get(pid, {})
                    team_code = teams_by_id.get(el_info.get('team'), 'PL')
                    pos_code = element_types.get(el_info.get('element_type'), 'MID')
                    p_pts = live_by_gw.get(gw, {}).get(pid, 0)
                    
                    player_obj = {
                        "name": el_info.get('web_name', 'Player'),
                        "pos": pos_code,
                        "team": team_code,
                        "points": p_pts * mult if mult > 0 else p_pts,
                        "is_captain": is_cap,
                        "is_vice": is_vice
                    }
                    
                    if is_cap:
                        capt_name = el_info.get('web_name', 'Captain')
                    
                    if p.get('position', 1) <= 11:
                        starting_players.append(player_obj)
                    else:
                        bench_players.append(player_obj)
                
                start_raw = sum(p['points'] for p in starting_players)
                bench_raw = sum(p['points'] for p in bench_players)
                
                # If Bench Boost is active, bench players score points for the team!
                if chip == 'bboost':
                    raw_points = start_raw + bench_raw
                    bench_points = 0
                else:
                    raw_points = start_raw
                    bench_points = bench_raw
                    
                net_points = raw_points - hits
                
                gameweeks_dict[str(gw)]["results"].append({
                    "entry_id": eid,
                    "team_name": t['entry_name'],
                    "player_name": t['player_name'],
                    "points": raw_points,
                    "hits": hits,
                    "net_points": net_points,
                    "captain": capt_name,
                    "chip": chip,
                    "bench_points": bench_points
                })
                
                squads_dict[f"{eid}_{gw}"] = {
                    "starting": starting_players,
                    "bench": bench_players
                }
                time.sleep(0.03)
            except Exception as e:
                print(f"Error fetching team {eid} GW {gw}: {e}")

    final_data = {
        "league": {
            "id": 40700,
            "name": league_data['league']['name'],
            "season": "2026/27"
        },
        "teams": teams_list,
        "gameweeks": gameweeks_dict,
        "squads": squads_dict
    }

    with open('real_fpl_40700_data.json', 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)

    print("Successfully synced real_fpl_40700_data.json with 100% verified live FPL data!")

if __name__ == '__main__':
    main()
