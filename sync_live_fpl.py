import urllib.request
import json
import time
import os
import sys
import argparse
from datetime import datetime, timezone, timedelta
from concurrent.futures import ThreadPoolExecutor

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)'}

def fetch(url, retries=3, delay=1.5):
    """Fetch JSON from URL with retry mechanism."""
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                return json.loads(resp.read().decode('utf-8'))
        except Exception as e:
            if attempt == retries - 1:
                print(f"Failed to fetch {url} after {retries} attempts: {e}")
                raise e
            time.sleep(delay * (attempt + 1))

def is_gw_fixtures_finished(gw_id):
    """
    Smart Fixture-Aware Finish Check:
    Check FPL fixtures API to verify if all fixtures for the Gameweek have finished.
    Returns True if all fixtures have started and are finished (or provisional finished).
    """
    try:
        fixtures = fetch(f'https://fantasy.premierleague.com/api/fixtures/?event={gw_id}')
        if fixtures and len(fixtures) > 0:
            return all(f.get('started') and (f.get('finished') or f.get('finished_provisional')) for f in fixtures)
    except Exception as e:
        print(f"Notice checking fixtures for GW {gw_id}: {e}")
    return False

def atomic_json_dump(data, file_path):
    """Safely write JSON to a temp file first, then atomically replace the target file."""
    temp_path = f"{file_path}.tmp"
    with open(temp_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    os.replace(temp_path, file_path)

def main():
    parser = argparse.ArgumentParser(description="FPL Live Data Sync Engine")
    parser.add_argument('--force', action='store_true', help="Force full re-sync for all GWs (bypass cache)")
    args = parser.parse_args()

    start_time = time.time()
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Starting FPL Sync Engine (force={args.force})...")

    # 1. Fetch bootstrap-static
    print("Fetching bootstrap-static...")
    boot = fetch('https://fantasy.premierleague.com/api/bootstrap-static/')
    elements = {p['id']: p for p in boot['elements']}
    teams_by_id = {t['id']: t['short_name'] for t in boot['teams']}
    element_types = {et['id']: et['singular_name_short'] for et in boot['element_types']}

    events = boot['events']
    current_event = next((e for e in events if e['is_current']), events[0])
    max_gw = current_event['id']

    # 2. Determine Smart Finished status for all GWs up to max_gw
    gw_status_map = {}
    for gw_info in events:
        gw_id = gw_info['id']
        if gw_id <= max_gw:
            bootstrap_finished = bool(gw_info.get('finished'))
            if bootstrap_finished:
                gw_status_map[gw_id] = True
            else:
                fixtures_fin = is_gw_fixtures_finished(gw_id)
                gw_status_map[gw_id] = fixtures_fin
                if fixtures_fin:
                    print(f" -> Smart Fixture Check: GW {gw_id} matches all finished! Marked as finished.")
                else:
                    print(f" -> GW {gw_id}: Currently LIVE in progress.")

    # 3. Load leagues config
    base_dir = os.path.dirname(os.path.abspath(__file__))
    config_path = os.path.join(base_dir, 'config', 'leagues_config.json')
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            leagues_config = json.load(f)
    else:
        leagues_config = {
            "40700": {"id": 40700, "name": "เซียนอยู่รู หมูอยู่ตึก"},
            "675290": {"id": 675290, "name": "NudNee"},
            "38491": {"id": 38491, "name": "รอ แมน โอน"}
        }

    # 4. Load existing multi_fpl_data.json for Incremental Sync caching
    multi_json_path = os.path.join(base_dir, 'multi_fpl_data.json')
    cached_data = None
    if not args.force and os.path.exists(multi_json_path):
        try:
            with open(multi_json_path, 'r', encoding='utf-8') as f:
                cached_data = json.load(f)
            print("Loaded existing multi_fpl_data.json cache for incremental sync.")
        except Exception as e:
            print(f"Warning: Could not read existing multi_fpl_data.json: {e}")
            cached_data = None

    # Determine which GWs need live points fetched
    gws_to_fetch_live = set()
    for gw in range(1, max_gw + 1):
        if args.force or not gw_status_map.get(gw, False):
            gws_to_fetch_live.add(gw)
        else:
            needs_gw = False
            if cached_data and "leagues" in cached_data:
                for lid_str in leagues_config.keys():
                    cached_league = cached_data["leagues"].get(lid_str)
                    if not cached_league or str(gw) not in cached_league.get("gameweeks", {}):
                        needs_gw = True
                        break
            else:
                needs_gw = True
            if needs_gw:
                gws_to_fetch_live.add(gw)

    live_by_gw = {}
    for gw in range(1, max_gw + 1):
        if gw in gws_to_fetch_live:
            try:
                print(f"Fetching live elements for GW {gw}...")
                live_data = fetch(f'https://fantasy.premierleague.com/api/event/{gw}/live/')
                live_by_gw[gw] = {el['id']: el['stats']['total_points'] for el in live_data['elements']}
            except Exception as e:
                print(f"Error fetching live GW {gw}: {e}")
                live_by_gw[gw] = {}
        else:
            print(f"Skipping live elements fetch for completed GW {gw} (using cached squad points).")

    # Thai timestamp formatting
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

    summary_stats = []

    for lid_str, lcfg in leagues_config.items():
        lid = int(lid_str)
        league_name_cfg = lcfg.get('name', 'League')
        print(f"\nProcessing League {lid} ({league_name_cfg})...")
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
            for gw_id in range(1, max_gw + 1):
                gameweeks_dict[str(gw_id)] = {
                    "gw": gw_id,
                    "is_finished": gw_status_map.get(gw_id, False),
                    "results": []
                }

            squads_dict = {}

            cached_league = cached_data.get("leagues", {}).get(lid_str, {}) if cached_data else {}
            cached_gw_data = cached_league.get("gameweeks", {})
            cached_squads = cached_league.get("squads", {})

            work_items = []
            for gw in range(1, max_gw + 1):
                gw_is_finished = gw_status_map.get(gw, False)
                cached_gw = cached_gw_data.get(str(gw))
                
                # Check if we can reuse finished cached GW data
                can_use_cache = (
                    not args.force and
                    gw_is_finished and
                    cached_gw and
                    cached_gw.get("is_finished") and
                    len(cached_gw.get("results", [])) == len(standings_teams)
                )

                if can_use_cache:
                    all_squads_present = True
                    for t_obj in standings_teams:
                        s_key = f"{t_obj['entry']}_{gw}"
                        if s_key not in cached_squads:
                            all_squads_present = False
                            break
                    if not all_squads_present:
                        can_use_cache = False

                if can_use_cache:
                    print(f" -> Reusing cached data for League {lid} GW {gw} (Finished)")
                    gameweeks_dict[str(gw)]["results"] = cached_gw.get("results", [])
                    gameweeks_dict[str(gw)]["is_finished"] = True
                    for t_obj in standings_teams:
                        s_key = f"{t_obj['entry']}_{gw}"
                        squads_dict[s_key] = cached_squads.get(s_key)
                else:
                    for t_obj in standings_teams:
                        work_items.append((t_obj, gw))

            if work_items:
                print(f" -> Fetching {len(work_items)} team-gameweek picks for League {lid}...")

                def process_team_picks(entry_tuple):
                    t_obj, gw = entry_tuple
                    eid = t_obj['entry']
                    try:
                        picks_resp = fetch(f'https://fantasy.premierleague.com/api/entry/{eid}/event/{gw}/picks/')
                        hist = picks_resp.get('entry_history', {})
                        chip = picks_resp.get('active_chip')
                        hits = hist.get('event_transfers_cost', 0)
                        auto_subs = picks_resp.get('automatic_subs', [])
                        
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
                            "bench": bench,
                            "automatic_subs": auto_subs
                        }
                        return (gw, eid, result_item, squad_item)
                    except Exception as err:
                        print(f"Error {eid} GW {gw}: {err}")
                        return None

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

            summary_stats.append({
                "id": lid,
                "name": league_name,
                "teams_count": len(teams_list),
                "gws_count": max_gw
            })

        except Exception as e:
            print(f"Error processing league {lid}: {e}")

    # 5. Write multi_fpl_data.json atomically
    atomic_json_dump(multi_league_output, multi_json_path)

    # 6. Write real_fpl_40700_data.json for backwards compatibility atomically
    real_json_path = os.path.join(base_dir, 'real_fpl_40700_data.json')
    if "40700" in multi_league_output["leagues"]:
        atomic_json_dump({
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
        }, real_json_path)

    elapsed = time.time() - start_time
    print(f"\n=======================================================")
    print(f"✅ Successfully synced all leagues in {elapsed:.2f} seconds!")
    print(f"   Last Sync: {sync_time_str}")
    print(f"   Max Gameweek: GW {max_gw} ({'Finished' if gw_status_map.get(max_gw) else 'LIVE'})")
    print(f"=======================================================")
    for s in summary_stats:
        print(f"   - League {s['id']} ({s['name']}): {s['teams_count']} teams")
    print(f"=======================================================\n")

    # 7. Write to GITHUB_STEP_SUMMARY if running in GitHub Actions
    step_summary_path = os.environ.get('GITHUB_STEP_SUMMARY')
    if step_summary_path:
        try:
            status_badge = "✅ FINISHED" if gw_status_map.get(max_gw) else "🔴 LIVE"
            summary_md = f"""## ⚽ FPL Mini-League Auto Sync Summary

- **🕒 Last Sync:** {sync_time_str} (`{sync_iso_str}`)
- **🏆 Active Gameweek:** **GW {max_gw}** ({status_badge})
- **⏱️ Execution Duration:** `{elapsed:.2f}s`

### 📊 Leagues Processed
| League ID | League Name | Teams | Gameweeks |
|:---|:---|:---:|:---:|
"""
            for s in summary_stats:
                summary_md += f"| `{s['id']}` | **{s['name']}** | {s['teams_count']} | GW 1 - {s['gws_count']} |\n"

            with open(step_summary_path, 'a', encoding='utf-8') as f:
                f.write(summary_md)
        except Exception as e:
            print(f"Notice: Could not write GITHUB_STEP_SUMMARY: {e}")

if __name__ == '__main__':
    main()
