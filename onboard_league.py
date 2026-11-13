#!/usr/bin/env python3
"""
FPLSaWaDiKa — Concierge Customer League Onboarding CLI

Registers a new (or updates an existing) mini-league in config/leagues_config.json,
validates it against the official FPL Classic League API, runs a targeted single-league
sync (sync_live_fpl.py --league <id>), and rebuilds tenant-scoped HTML via update_preview.py.
"""

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CONFIG_PATH = os.path.join(BASE_DIR, "config", "leagues_config.json")
SITE_CONFIG_PATH = os.path.join(BASE_DIR, "config", "site_config.json")


def fetch_fpl_league_meta(league_id: str, timeout: int = 12) -> dict:
    """Fetch official FPL league metadata and entrant count from standings API."""
    url = f"https://fantasy.premierleague.com/api/leagues-classic/{league_id}/standings/?page_standings=1&page_new_entries=1"
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    league = data.get("league") or {}
    standings = (data.get("standings") or {}).get("results") or []
    new_entries = (data.get("new_entries") or {}).get("results") or []
    has_next = bool(
        (data.get("standings") or {}).get("has_next")
        or (data.get("new_entries") or {}).get("has_next")
    )
    unique_ids = {row.get("entry") for row in (standings + new_entries) if row.get("entry")}
    return {
        "name": str(league.get("name") or f"League {league_id}").strip(),
        "team_count": len(unique_ids),
        "has_next": has_next,
    }


def parse_non_prize_teams(raw_val: str) -> list:
    """Parse comma-separated entry IDs into clean integers."""
    if not raw_val:
        return []
    out = []
    for part in str(raw_val).split(","):
        s = part.strip()
        if s.isdigit():
            val = int(s)
            if val not in out:
                out.append(val)
    return out


def build_league_entry(
    league_id: str,
    league_name: str,
    short_name: str,
    tier: int,
    plan: str,
    status: str,
    tenant_group: str,
    visibility: str,
    prize_model: str,
    weekly_prize: int,
    non_prize_teams: list,
    override_cfg: dict | None = None,
) -> dict:
    """Construct a validated config/leagues_config.json record."""
    features = {
        "cup": True,
        "monthly_prize": prize_model == "monthly",
        "penalties": prize_model == "penalties",
    }
    entry = {
        "name": league_name,
        "short_name": short_name or league_name[:12].strip(),
        "tier": tier,
        "plan": plan,
        "status": status,
        "tenant_group": tenant_group,
        "visibility": visibility,
        "non_prize_teams": non_prize_teams,
        "payout_model": prize_model,
        "features": features,
    }
    if prize_model in ("weekly", "penalties") and weekly_prize > 0:
        entry["weekly_prize_amount"] = weekly_prize
    if override_cfg:
        for k, v in override_cfg.items():
            if k != "league_id":
                entry[k] = v
    return entry


def load_site_url() -> str:
    """Read primary public URL from config/site_config.json."""
    try:
        with open(SITE_CONFIG_PATH, "r", encoding="utf-8") as f:
            site = json.load(f)
        return str(site.get("site_url") or "https://www.fplsawadika.com").rstrip("/")
    except Exception:
        return "https://www.fplsawadika.com"


def main() -> int:
    parser = argparse.ArgumentParser(description="Onboard or update a customer mini-league in FPLSaWaDiKa.")
    parser.add_argument("--league-id", required=True, help="Numeric FPL Classic League ID")
    parser.add_argument("--plan", choices=["standard", "custom"], default="standard", help="Commercial tier plan")
    parser.add_argument(
        "--prize-model",
        choices=["weekly", "standard", "monthly", "penalties"],
        default="weekly",
        help="Prize settlement preset",
    )
    parser.add_argument("--weekly-prize", type=int, default=300, help="Weekly payout amount in THB (default: 300)")
    parser.add_argument("--tenant-group", default="", help="Tenant isolation key (default: private_<league_id>)")
    parser.add_argument("--visibility", choices=["private", "showcase"], default="private", help="Visibility & sitemap exposure")
    parser.add_argument("--status", choices=["active", "trial", "paused"], default="active", help="League lifecycle status")
    parser.add_argument("--non-prize-teams", default="", help="Comma-separated FPL entry IDs excluded from prizes")
    parser.add_argument("--short-name", default="", help="Optional compact label for UI pills/headers")
    parser.add_argument("--league-name", default="", help="Optional fallback league name if offline")
    parser.add_argument("--tier", type=int, choices=[1, 2], default=1, help="League tier (1=Mini-League, 2=Community)")
    parser.add_argument("--config-json", default="", help="Optional raw JSON string or .json file path overriding fields")
    parser.add_argument("--overwrite", action="store_true", help="Allow updating an existing league ID in leagues_config.json")
    parser.add_argument("--skip-fpl-check", action="store_true", help="Skip live FPL API metadata validation")
    parser.add_argument("--skip-sync", action="store_true", help="Skip running sync_live_fpl.py")
    parser.add_argument("--skip-build", action="store_true", help="Skip running update_preview.py")
    args = parser.parse_args()

    lid = str(args.league_id).strip()
    if not re.fullmatch(r"\d{1,10}", lid):
        print(f"Error: Invalid --league-id '{lid}'. Expected numeric digits only.", file=sys.stderr)
        return 1

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        leagues_cfg = json.load(f)

    if lid in leagues_cfg and not args.overwrite:
        print(f"Error: League {lid} already exists in {CONFIG_PATH}. Re-run with --overwrite to update.", file=sys.stderr)
        return 1

    override_cfg = None
    if args.config_json:
        raw_json = args.config_json.strip()
        if os.path.isfile(raw_json):
            with open(raw_json, "r", encoding="utf-8") as cf:
                override_cfg = json.load(cf)
        else:
            override_cfg = json.loads(raw_json)

    resolved_name = args.league_name.strip()
    if not args.skip_fpl_check:
        try:
            meta = fetch_fpl_league_meta(lid)
            resolved_name = meta["name"] or resolved_name
            count_note = f"{meta['team_count']}+" if meta["has_next"] else str(meta["team_count"])
            print(f"Verified FPL League {lid}: '{resolved_name}' ({count_note} teams detected)")
            if args.tier == 1 and (meta["team_count"] > 30 or meta["has_next"]):
                print("Warning: League exceeds 30 teams. Confirm Tier 1 Custom Quote or Tier 2 classification.")
        except urllib.error.HTTPError as exc:
            print(f"Error: FPL API returned HTTP {exc.code} for league {lid}.", file=sys.stderr)
            return 1
        except Exception as exc:
            if resolved_name:
                print(f"Warning: Could not reach FPL API ({exc}); using --league-name '{resolved_name}'.")
            else:
                print(f"Error: Could not reach FPL API ({exc}) and no --league-name fallback supplied.", file=sys.stderr)
                return 1
    elif not resolved_name:
        resolved_name = (leagues_cfg.get(lid) or {}).get("name") or f"League {lid}"

    tenant_group = args.tenant_group.strip() or f"private_{lid}"
    non_prize = parse_non_prize_teams(args.non_prize_teams)
    entry = build_league_entry(
        league_id=lid,
        league_name=resolved_name,
        short_name=args.short_name.strip(),
        tier=args.tier,
        plan=args.plan,
        status=args.status,
        tenant_group=tenant_group,
        visibility=args.visibility,
        prize_model=args.prize_model,
        weekly_prize=args.weekly_prize,
        non_prize_teams=non_prize,
        override_cfg=override_cfg,
    )

    leagues_cfg[lid] = entry
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(leagues_cfg, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"Saved league {lid} to {CONFIG_PATH}")

    if not args.skip_sync and args.status != "paused":
        print(f"Running targeted sync: sync_live_fpl.py --league {lid} ...")
        subprocess.check_call([sys.executable, os.path.join(BASE_DIR, "sync_live_fpl.py"), "--league", lid], cwd=BASE_DIR)

    if not args.skip_build:
        print("Rebuilding HTML outputs via update_preview.py ...")
        subprocess.check_call([sys.executable, os.path.join(BASE_DIR, "update_preview.py")], cwd=BASE_DIR)

    site_url = load_site_url()
    print("\nOnboarding complete!")
    print(f"  Dashboard path : {os.path.join(BASE_DIR, lid, 'index.html')}")
    print(f"  Public URL     : {site_url}/{lid}/")
    print(f"  Tenant group   : {entry['tenant_group']} (visibility={entry['visibility']}, status={entry['status']})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
