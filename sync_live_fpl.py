import urllib.request
import json
import time
import os
from datetime import datetime, timezone, timedelta
from concurrent.futures import ThreadPoolExecutor

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}

def fetch(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode('utf-8'))

def main():
    start_time = time.time()
    print("Fetching bootstrap-static...")
    boot = fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
    elements = {p['id']: p for p in boot['elements']}
    teams_by_id = {t['id']: t['short_name'] for t in boot['teams']}
    element_types = {et['id']: et['singular_name_short'] for et in boot['element_types']}

    events = boot['events']
    current_event = next((e for e in events if e['is_current']), events[0])
    max_gw = current_event['id']

    # Load leagues config
    base_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(base_dir, 'config', 'leagues_config.json')
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            leagues_config = json.load(f)
    else:
        leagues_config = {
            "40700": {"id": 40700, "name": "เซียนอยู่รู หมูอยู่ตึก"},
            "675290": {"id": 675290, "name": "NudNee"}
        }

    # Fetch live elements for all active gameweeks
    live_by_gw = {}
    for gw in range(1, max_gw + 1):
        try:
            print(f"Fetching live elements for GW {gw}...")
            live_data = fetch(f'https://fantasy.premierleague.com/api/event/{gw}/live/')
            live_by_gw[gw] = {el['id']: el['stats']['total_points'] for el in live_data['elements']}
        except Exception as e:
            print(f"Error fetching live GW {gw}: {e}")
            live_by_gw[gw] = {}

    # Thai timestamp
    thai_months = ['', 'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
    tz_th = timezone(timedelta(hours=7))
    now_th = datetime.now(tz_th)
    sync_time_str = f"{now_th.day} {thai_months[now_th.month]} {now_th.year}, {now_th.strftime('%H:%M น.')}"
    sync_iso_str = now_th.strftime('%Y-%m-%d %H:%M:%S')

    multi_league_output = {
        "last_sync": sync_time_str,
        "last_sync_iso": sync_iso_str,
        "max_gw": max_gw,
        "leagues": {}
    }

    for lid_str, lcfg in leagues_config.items():
        lid = int(lid_str)
        print(f"\nProcessing League {lid} ({lcfg.get('name', 'League')})...")
        try:
            league_resp = fetch(f'https://fantasy.premierleague.com/api/leagues-classic/{lid}/standings/')
            league_name = league_resp['league']['name']
            standings_teams = league_resp['standings']['results']
            print(f" -> {league_name}: {len(standings_teams)} teams")

            teams_list = []
            for t in standings_teams:
                teams_list.append({
                    "entry_id": t['entry'],
                    "entry_name": t['entry_name'],
                    "player_name": t['player_name']
                })

            gameweeks_dict = {}
            for gw_info in events:
                gw_id = gw_info['id']
                if gw_id <= max_gw:
                    gameweeks_dict[str(gw_id)] = {
                        "gw": gw_id,
                        "is_finished": gw_info['finished'],
                        "results": []
                    }

            squads_dict = {}

            def process_team_picks(entry_tuple):
                t_obj, gw = entry_tuple
                eid = t_obj['entry']
                try:
                    picks_resp = fetch(f'https://fantasy.premierleague.com/api/entry/{eid}/event/{gw}/picks/')
                    hist = picks_resp.get('entry_history', {})
                    chip = picks_resp.get('active_chip')
                    hits = hist.get('event_transfers_cost', 0)
                    
                    starters = []
                    bench = []
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
                        
                        p_obj = {
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
                            starters.append(p_obj)
                        else:
                            bench.append(p_obj)
                    
                    start_raw = sum(p['points'] for p in starters)
                    bench_raw = sum(p['points'] for p in bench)
                    
                    if chip == 'bboost':
                        raw_points = start_raw + bench_raw
                        bench_pts_disp = 0
                    else:
                        raw_points = start_raw
                        bench_pts_disp = bench_raw
                        
                    net_points = raw_points - hits
                    
                    result_item = {
                        "entry_id": eid,
                        "team_name": t_obj['entry_name'],
                        "player_name": t_obj['player_name'],
                        "points": raw_points,
                        "hits": hits,
                        "net_points": net_points,
                        "captain": capt_name,
                        "chip": chip,
                        "bench_points": bench_pts_disp
                    }
                    
                    squad_item = {
                        "starting": starters,
                        "bench": bench
                    }
                    return (gw, eid, result_item, squad_item)
                except Exception as err:
                    print(f"Error {eid} GW {gw}: {err}")
                    return None

            work_items = []
            for gw in range(1, max_gw + 1):
                for t_obj in standings_teams:
                    work_items.append((t_obj, gw))

            with ThreadPoolExecutor(max_workers=10) as executor:
                fetched_results = list(executor.map(process_team_picks, work_items))

            for res in fetched_results:
                if res:
                    gw, eid, result_item, squad_item = res
                    gameweeks_dict[str(gw)]["results"].append(result_item)
                    squads_dict[f"{eid}_{gw}"] = squad_item

            multi_league_output["leagues"][str(lid)] = {
                "id": lid,
                "name": league_name,
                "season": "2026/27",
                "teams": teams_list,
                "gameweeks": gameweeks_dict,
                "squads": squads_dict
            }
        except Exception as e:
            print(f"Error processing league {lid}: {e}")

    # Write multi_fpl_data.json
    multi_json_path = os.path.join(base_dir, 'multi_fpl_data.json')
    with open(multi_json_path, 'w', encoding='utf-8') as f:
        json.dump(multi_league_output, f, ensure_ascii=False, indent=2)

    # Write real_fpl_40700_data.json for backwards compatibility
    real_json_path = os.path.join(base_dir, 'real_fpl_40700_data.json')
    if "40700" in multi_league_output["leagues"]:
        with open(real_json_path, 'w', encoding='utf-8') as f:
            json.dump({
                "league": {
                    "id": 40700,
                    "name": multi_league_output["leagues"]["40700"]["name"],
                    "season": "2026/27",
                    "last_sync": sync_time_str,
                    "last_sync_iso": sync_iso_str
                },
                "teams": multi_league_output["leagues"]["40700"]["teams"],
                "gameweeks": multi_league_output["leagues"]["40700"]["gameweeks"],
                "squads": multi_league_output["leagues"]["40700"]["squads"]
            }, f, ensure_ascii=False, indent=2)

    elapsed = time.time() - start_time
    print(f"\nSuccessfully synced all leagues in {elapsed:.2f} seconds! (Last Sync: {sync_time_str})")

if __name__ == '__main__':
    main()
