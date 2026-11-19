#!/usr/bin/env python3
"""
FPLSaWaDiKa — Concierge Customer League Onboarding CLI

Registers a new (or updates an existing) mini-league in config/leagues_config.json,
validates it against the official FPL Classic League API, runs a targeted single-league
sync (sync_live_fpl.py --league <id>), and rebuilds tenant-scoped HTML via update_preview.py.
"""

import argparse
import datetime
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


def today_ict_iso() -> str:
    """Return today's date string in ICT (UTC+7) as YYYY-MM-DD."""
    return (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=7)).date().isoformat()


def validate_iso_date(val: str) -> str:
    """Validate YYYY-MM-DD ISO calendar dates; return '' for empty/'none', raise ValueError otherwise."""
    cleaned = str(val or "").strip()
    if not cleaned or cleaned.lower() == "none":
        return ""
    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", cleaned):
        raise ValueError(f"Invalid date '{cleaned}': expected YYYY-MM-DD or 'none'.")
    datetime.date.fromisoformat(cleaned)
    return cleaned


def normalize_billing_note(val: str) -> str:
    """Return clean admin billing note string, or '' for empty/'none'."""
    cleaned = str(val or "").strip()
    if not cleaned or cleaned.lower() == "none":
        return ""
    return cleaned


def print_leagues_table(leagues_cfg: dict) -> None:
    """Print fleet lifecycle summary across all configured leagues."""
    today = datetime.date.fromisoformat(today_ict_iso())
    header = f"{'ID':<10} {'Visibility':<10} {'Plan':<9} {'Status':<8} {'Expires':<12} {'DaysLeft':<9} Name"
    print(header)
    print("-" * len(header))
    for lid, item in leagues_cfg.items():
        if not isinstance(item, dict):
            continue
        vis = str(item.get("visibility") or "showcase")
        plan = str(item.get("plan") or "standard")
        status = str(item.get("status") or "active")
        exp = str(item.get("expires_at") or "-")
        days_str = "-"
        if re.fullmatch(r"\d{4}-\d{2}-\d{2}", exp):
            delta = (datetime.date.fromisoformat(exp) - today).days
            days_str = f"{delta}d"
        name = str(item.get("name") or lid)
        print(f"{lid:<10} {vis:<10} {plan:<9} {status:<8} {exp:<12} {days_str:<9} {name}")


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
    no_cup: bool = False,
    override_cfg: dict | None = None,
    expires_at: str = "",
    created_at: str = "",
    billing_note: str = "",
) -> dict:
    """Construct a validated config/leagues_config.json record aligned with update_preview.py."""
    is_weekly_like = prize_model in ("weekly", "penalties")
    resolved_model = "weekly" if is_weekly_like else ("monthly" if prize_model == "monthly" else "standard")
    features = {
        "prize_model": resolved_model,
        "has_weekly_prizes": is_weekly_like,
        "has_monthly_prizes": prize_model == "monthly",
        "has_weekly_penalties": prize_model == "penalties",
        "has_settlement_phases": False,
        "has_cup": not no_cup,
    }
    if is_weekly_like and weekly_prize > 0:
        features["weekly_prize_amount"] = weekly_prize
    elif prize_model == "monthly" and weekly_prize > 0:
        features["monthly_prize_amount"] = weekly_prize

    entry = {
        "id": int(league_id),
        "season": "2026/27",
        "name": league_name,
        "short_name": short_name or league_name[:12].strip(),
        "tier": tier,
        "plan": plan,
        "status": status,
        "tenant_group": tenant_group,
        "visibility": visibility,
        "created_at": created_at or today_ict_iso(),
        "non_prize_teams": non_prize_teams,
        "features": features,
    }
    if expires_at:
        entry["expires_at"] = expires_at
    if billing_note:
        entry["billing_note"] = billing_note
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
    parser.add_argument("--league-id", default="", help="Numeric FPL Classic League ID")
    parser.add_argument("--list-leagues", action="store_true", help="Print all configured leagues with lifecycle status and exit")
    parser.add_argument("--update-lifecycle", action="store_true", help="Update only supplied lifecycle fields without overwriting existing features/rules")
    parser.add_argument("--plan", choices=["standard", "custom"], default=None, help="Commercial tier plan")
    parser.add_argument(
        "--prize-model",
        choices=["weekly", "standard", "monthly", "penalties", "none"],
        default="weekly",
        help="Prize settlement preset",
    )
    parser.add_argument("--weekly-prize", type=int, default=300, help="Weekly/monthly payout amount in THB (default: 300)")
    parser.add_argument("--no-cup", action="store_true", help="Disable Knockout Cup tab for leagues that do not play a cup")
    parser.add_argument("--tenant-group", default="", help="Tenant isolation key (default: private_<league_id>)")
    parser.add_argument("--visibility", choices=["private", "showcase"], default=None, help="Visibility & sitemap exposure")
    parser.add_argument("--status", choices=["active", "trial", "paused"], default=None, help="League lifecycle status")
    parser.add_argument("--expires-at", default=None, help="Optional expiry date YYYY-MM-DD (or 'none' to clear)")
    parser.add_argument("--billing-note", default=None, help="Optional admin-only note (stripped from public HTML; 'none' to clear)")
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

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        leagues_cfg = json.load(f)

    if args.list_leagues:
        print_leagues_table(leagues_cfg)
        return 0

    lid = str(args.league_id).strip()
    if not lid or not re.fullmatch(r"\d{1,10}", lid):
        print(f"Error: Invalid or missing --league-id '{lid}'. Expected numeric digits only.", file=sys.stderr)
        return 1

    try:
        validated_expiry = validate_iso_date(args.expires_at) if args.expires_at is not None else None
    except ValueError as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    if args.update_lifecycle:
        if lid not in leagues_cfg or not isinstance(leagues_cfg[lid], dict):
            print(f"Error: League {lid} not found in {CONFIG_PATH}.", file=sys.stderr)
            return 1
        entry = dict(leagues_cfg[lid])
        if args.status is not None:
            entry["status"] = args.status
        if args.plan is not None:
            entry["plan"] = args.plan
        if args.visibility is not None:
            entry["visibility"] = args.visibility
        if args.tenant_group.strip():
            entry["tenant_group"] = args.tenant_group.strip()
        if validated_expiry is not None:
            if validated_expiry:
                entry["expires_at"] = validated_expiry
            else:
                entry.pop("expires_at", None)
        if args.billing_note is not None:
            clean_note = normalize_billing_note(args.billing_note)
            if clean_note:
                entry["billing_note"] = clean_note
            else:
                entry.pop("billing_note", None)
        entry.setdefault("created_at", today_ict_iso())
    else:
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
        existing_created = str((leagues_cfg.get(lid) or {}).get("created_at") or "")
        entry = build_league_entry(
            league_id=lid,
            league_name=resolved_name,
            short_name=args.short_name.strip(),
            tier=args.tier,
            plan=args.plan or "standard",
            status=args.status or "active",
            tenant_group=tenant_group,
            visibility=args.visibility or "private",
            prize_model=args.prize_model,
            weekly_prize=args.weekly_prize,
            non_prize_teams=non_prize,
            no_cup=args.no_cup,
            override_cfg=override_cfg,
            expires_at=validated_expiry or "",
            created_at=existing_created,
            billing_note=normalize_billing_note(args.billing_note or ""),
        )

    leagues_cfg[lid] = entry
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(leagues_cfg, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"Saved league {lid} to {CONFIG_PATH}")

    if not args.skip_sync and entry.get("status", "active") != "paused":
        print(f"Running targeted sync: sync_live_fpl.py --league {lid} ...")
        subprocess.check_call([sys.executable, os.path.join(BASE_DIR, "sync_live_fpl.py"), "--league", lid], cwd=BASE_DIR)

    if not args.skip_build:
        print("Rebuilding HTML outputs via update_preview.py ...")
        subprocess.check_call([sys.executable, os.path.join(BASE_DIR, "update_preview.py")], cwd=BASE_DIR)

    site_url = load_site_url()
    print("\nLifecycle update complete!" if args.update_lifecycle else "\nOnboarding complete!")
    print(f"  Dashboard path : {os.path.join(BASE_DIR, lid, 'index.html')}")
    print(f"  Public URL     : {site_url}/{lid}/")
    exp_label = entry.get("expires_at") or "-"
    print(f"  Tenant group   : {entry.get('tenant_group', '-')} (visibility={entry.get('visibility', '-')}, status={entry.get('status', 'active')}, expires={exp_label})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
