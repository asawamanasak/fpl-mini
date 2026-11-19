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


def format_money_label(raw_val: str, currency: str = "THB", suffix_th: str = "", suffix_en: str = "") -> tuple[str, str]:
    """Format a numeric or free-text money string into (TH_label, EN_label)."""
    cleaned = str(raw_val or "").strip()
    if not cleaned:
        return ("", "")
    num_only = cleaned.replace(",", "").strip()
    cur = "USD" if str(currency or "THB").upper() == "USD" else "THB"
    if re.fullmatch(r"\d+", num_only):
        n_fmt = f"{int(num_only):,}"
        th_lbl = f"{n_fmt} {cur}{suffix_th}"
        en_lbl = (f"${n_fmt}" if cur == "USD" else f"{n_fmt} THB") + suffix_en
        return (th_lbl, en_lbl)
    return (cleaned, cleaned)


def parse_season_prizes(raw_val: str, currency: str = "THB") -> dict:
    """Parse '1st:3000,2nd:2000,3rd:1000' into {'1st': '3,000 THB', ...}."""
    cleaned = str(raw_val or "").strip()
    if not cleaned:
        return {}
    out = {}
    for pair in cleaned.split(","):
        if ":" not in pair:
            continue
        k, v = pair.split(":", 1)
        rank_key = k.strip()
        val_str = v.strip()
        if rank_key and val_str:
            th_lbl, _ = format_money_label(val_str, currency)
            out[rank_key] = th_lbl
    return out


def parse_cup_prize(raw_val: str, currency: str = "THB") -> tuple[str, str]:
    """Parse '1000' or '1000/500' into (cup_champion_prize, cup_runner_up_prize)."""
    cleaned = str(raw_val or "").strip()
    if not cleaned:
        return ("", "")
    parts = cleaned.split("/", 1)
    champ_th, _ = format_money_label(parts[0].strip(), currency) if parts[0].strip() else ("", "")
    runner_th, _ = format_money_label(parts[1].strip(), currency) if len(parts) > 1 and parts[1].strip() else ("", "")
    return (champ_th, runner_th)


def parse_penalty_tiers(raw_val: str) -> dict:
    """Parse '300,200,100' into {'last_1': 300, 'last_2': 200, 'last_3': 100}."""
    cleaned = str(raw_val or "").strip()
    if not cleaned:
        return {}
    nums = []
    for part in cleaned.split(","):
        s = part.strip().replace(",", "")
        if s.isdigit() and int(s) > 0:
            nums.append(int(s))
    return {f"last_{idx + 1}": val for idx, val in enumerate(nums)}


def build_default_monthly_schedule(champ: int, runner: int, currency: str = "THB") -> list:
    """Build a 10-month 2026/27 monthly prize schedule covering GW 1-38 aligned with renderPrizesView()."""
    cur = "USD" if str(currency or "THB").upper() == "USD" else "THB"
    c_val = max(0, int(champ))
    r_val = max(0, int(runner))
    tot = c_val + r_val
    budget_th = (
        f"{tot:,} {cur} (แชมป์ {c_val:,} / รอง {r_val:,})"
        if r_val > 0
        else f"{tot:,} {cur}"
    )
    months = [
        (1, "สิงหาคม 2026", "Aug 2026", [1, 2, 3]),
        (2, "กันยายน 2026", "Sep 2026", [4, 5, 6]),
        (3, "ตุลาคม 2026", "Oct 2026", [7, 8, 9]),
        (4, "พฤศจิกายน 2026", "Nov 2026", [10, 11, 12, 13]),
        (5, "ธันวาคม 2026", "Dec 2026", [14, 15, 16, 17, 18, 19]),
        (6, "มกราคม 2027", "Jan 2027", [20, 21, 22, 23]),
        (7, "กุมภาพันธ์ 2027", "Feb 2027", [24, 25, 26, 27]),
        (8, "มีนาคม 2027", "Mar 2027", [28, 29, 30, 31]),
        (9, "เมษายน 2027", "Apr 2027", [32, 33, 34]),
        (10, "พฤษภาคม 2027", "May 2027", [35, 36, 37, 38]),
    ]
    return [
        {
            "id": m_num,
            "month": name_th,
            "month_en": name_en,
            "gws": f"GW {gw_list[0]} - {gw_list[-1]}",
            "gw_list": gw_list,
            "budget": budget_th,
        }
        for (m_num, name_th, name_en, gw_list) in months
    ]


def build_auto_rules_cards(
    prize_model: str,
    currency: str,
    weekly_prize: int,
    entry_fee_th: str,
    entry_fee_en: str,
    total_pool_th: str,
    total_pool_en: str,
    season_prizes: dict,
    has_cup: bool,
    cup_champ: str,
    cup_runner: str,
    penalty_tiers: dict,
    monthly_champ: int,
    monthly_runner: int,
    non_prize_teams: list,
) -> tuple[list, list]:
    """Auto-generate bilingual rules_cards and rules_cards_en for a Standard league."""
    cur = "USD" if str(currency or "THB").upper() == "USD" else "THB"
    fmt_amt = lambda n: f"${int(n):,}" if cur == "USD" else f"{int(n):,} THB"
    cards_th = []
    cards_en = []

    if entry_fee_th or total_pool_th:
        items_th = []
        items_en = []
        if entry_fee_th:
            items_th.append({"label": "ค่าสมัครเข้าร่วมลีก", "desc": entry_fee_th})
            items_en.append({"label": "League Entry Fee", "desc": entry_fee_en or entry_fee_th})
        if total_pool_th:
            items_th.append({"label": "เงินกองกลางรวมทั้งฤดูกาล", "desc": total_pool_th})
            items_en.append({"label": "Total Season Prize Pool", "desc": total_pool_en or total_pool_th})
        if non_prize_teams:
            items_th.append({"label": "ทีมไม่ร่วมชิงเงินรางวัล", "desc": f"{len(non_prize_teams)} ทีม (แยกจากกติกาคำนวณเงินรางวัล)"})
            items_en.append({"label": "Non-Prize Participant Teams", "desc": f"{len(non_prize_teams)} team(s) excluded from prize settlement"})
        cards_th.append({"icon": "💰", "title": "ค่าสมัคร & กองกลาง", "color": "emerald", "items": items_th})
        cards_en.append({"icon": "💰", "title": "Entry Fee & Prize Pool", "color": "emerald", "items": items_en})

    if prize_model in ("weekly", "penalties") and weekly_prize > 0:
        w_items_th = [
            {"label": "แชมป์คะแนนสูงสุดประจำสัปดาห์", "desc": f"รับ {fmt_amt(weekly_prize)} / สัปดาห์ (คิดคะแนนสุทธิ Net Points หลังหัก Hit)"},
            {"label": "กรณีคะแนนสุทธิเท่ากัน", "desc": "หารเงินรางวัลเท่ากันทุกทีมที่ได้อันดับ 1 ร่วม"},
        ]
        w_items_en = [
            {"label": "Weekly Top Scorer", "desc": f"{fmt_amt(weekly_prize)} / GW (calculated from Net Points after transfer hits)"},
            {"label": "Tie-Breaker Rule", "desc": "Prize split equally among all tied top-scoring managers"},
        ]
        if prize_model == "penalties" and penalty_tiers:
            ordered_vals = [penalty_tiers[k] for k in sorted(penalty_tiers.keys(), key=lambda x: int(x.split("_")[1]))]
            tier_str = " / ".join(fmt_amt(v) for v in ordered_vals)
            w_items_th.append({"label": f"ค่าปรับบ๊วย {len(ordered_vals)} อันดับท้ายประจำสัปดาห์", "desc": f"เรียงจากบ๊วยสุดขึ้นไป: {tier_str}"})
            w_items_en.append({"label": f"Weekly Bottom {len(ordered_vals)} Penalties", "desc": f"From last place up: {tier_str}"})
        cards_th.append({"icon": "⚡", "title": "กติการางวัลรายสัปดาห์", "color": "amber", "items": w_items_th})
        cards_en.append({"icon": "⚡", "title": "Weekly Stakes Rules", "color": "amber", "items": w_items_en})
    elif prize_model == "monthly":
        m_items_th = [
            {"label": "แชมป์คะแนนรวมประจำเดือน (10 เดือน)", "desc": f"รับ {fmt_amt(monthly_champ)} / เดือน"},
        ]
        m_items_en = [
            {"label": "Monthly Top Scorer (10 months)", "desc": f"{fmt_amt(monthly_champ)} / month"},
        ]
        if monthly_runner > 0:
            m_items_th.append({"label": "รองแชมป์ประจำเดือน", "desc": f"รับ {fmt_amt(monthly_runner)} / เดือน"})
            m_items_en.append({"label": "Monthly Runner-up", "desc": f"{fmt_amt(monthly_runner)} / month"})
        m_items_th.append({"label": "เกณฑ์การคิดคะแนน", "desc": "คิดคะแนนสุทธิ (Net Points หลังหัก Hit) รวมทุก GW ในเดือนนั้นๆ"})
        m_items_en.append({"label": "Scoring Criteria", "desc": "Cumulative Net Points (after transfer hits) across all GWs in each month"})
        cards_th.append({"icon": "🗓️", "title": "กติการางวัลรายเดือน", "color": "sky", "items": m_items_th})
        cards_en.append({"icon": "🗓️", "title": "Monthly Prize Rules", "color": "sky", "items": m_items_en})

    if season_prizes:
        s_items_th = [{"label": f"อันดับ {k}", "desc": str(v)} for k, v in season_prizes.items()]
        s_items_en = [{"label": f"Rank {k}", "desc": str(v)} for k, v in season_prizes.items()]
        cards_th.append({"icon": "🏆", "title": "รางวัลแชมป์ประจำฤดูกาล", "color": "purple", "items": s_items_th})
        cards_en.append({"icon": "🏆", "title": "Season Championship Prizes", "color": "purple", "items": s_items_en})

    if has_cup and (cup_champ or cup_runner):
        c_items_th = []
        c_items_en = []
        if cup_champ:
            c_items_th.append({"label": "แชมป์บอลถ้วย (Cup Winner)", "desc": cup_champ})
            c_items_en.append({"label": "Knockout Cup Champion", "desc": cup_champ})
        if cup_runner:
            c_items_th.append({"label": "รองแชมป์บอลถ้วย (Runner-up)", "desc": cup_runner})
            c_items_en.append({"label": "Knockout Cup Runner-up", "desc": cup_runner})
        cards_th.append({"icon": "🥇", "title": "รางวัลบอลถ้วยแพ้คัดออก", "color": "rose", "items": c_items_th})
        cards_en.append({"icon": "🥇", "title": "Knockout Cup Prizes", "color": "rose", "items": c_items_en})

    return (cards_th, cards_en)


def verify_built_league(base_dir: str, lid: str, entry: dict) -> None:
    """Verify generated {lid}/index.html has zero demo leaks, zero PII leaks, and externalized logo."""
    html_path = os.path.join(base_dir, str(lid), "index.html")
    if not os.path.isfile(html_path):
        raise RuntimeError(f"Self-check failed: expected generated dashboard at {html_path}")
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()
    if len(html) < 10000:
        raise RuntimeError(f"Self-check failed: {html_path} is unexpectedly small ({len(html)} bytes)")
    if entry.get("visibility") == "private" and 'content="noindex, nofollow"' not in html:
        raise RuntimeError(f"Self-check failed: private league {lid} missing noindex, nofollow meta tag")
    if "data:image/jpeg;base64," in html:
        raise RuntimeError(f"Self-check failed: inline Base64 JPEG logo still present in {html_path}")
    if '"billing_note"' in html:
        raise RuntimeError(f"Self-check failed: private billing_note leaked into {html_path}")
    # Ensure demo-specific fallback numbers never leak unless explicitly configured on this league
    entry_json_str = json.dumps(entry, ensure_ascii=False)
    for forbidden_demo_str in ("103,200 THB", "8,600 THB", "9,500 THB"):
        if forbidden_demo_str not in entry_json_str and forbidden_demo_str in html:
            raise RuntimeError(f"Self-check failed: demo fallback '{forbidden_demo_str}' leaked into {html_path}")
    print(f"  Self-check     : PASSED ({lid}/index.html · 0 demo leaks · 0 PII leaks · external logo verified)")


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
    currency: str = "THB",
    entry_fee_raw: str = "",
    total_pool_raw: str = "",
    season_prizes_raw: str = "",
    cup_prize_raw: str = "",
    penalty_tiers_raw: str = "",
    monthly_champ: int = 600,
    monthly_runner: int = 400,
) -> dict:
    """Construct a validated config/leagues_config.json record aligned with update_preview.py."""
    cur = "USD" if str(currency or "THB").upper() == "USD" else "THB"
    is_weekly_like = prize_model in ("weekly", "penalties")
    resolved_model = "weekly" if is_weekly_like else ("monthly" if prize_model == "monthly" else "standard")
    features = {
        "prize_model": resolved_model,
        "currency": cur,
        "has_weekly_prizes": is_weekly_like,
        "has_monthly_prizes": prize_model == "monthly",
        "has_weekly_penalties": prize_model == "penalties",
        "has_settlement_phases": False,
        "has_cup": not no_cup,
    }
    if is_weekly_like and weekly_prize > 0:
        features["weekly_prize_amount"] = weekly_prize
    elif prize_model == "monthly":
        m_total = (monthly_champ + monthly_runner) if (monthly_champ + monthly_runner) > 0 else weekly_prize
        features["monthly_champion_prize"] = max(0, int(monthly_champ))
        features["monthly_runner_up_prize"] = max(0, int(monthly_runner))
        if m_total > 0:
            features["monthly_prize_amount"] = m_total

    penalty_tiers = {}
    if prize_model == "penalties":
        penalty_tiers = parse_penalty_tiers(penalty_tiers_raw) or {
            "last_1": 600,
            "last_2": 500,
            "last_3": 400,
            "last_4": 300,
            "last_5": 200,
        }
        features["weekly_penalty_tiers"] = penalty_tiers

    entry = {
        "id": int(league_id),
        "season": "2026/27",
        "name": league_name,
        "short_name": short_name or league_name[:12].strip(),
        "tier": tier,
        "plan": plan,
        "status": status,
        "currency": cur,
        "tenant_group": tenant_group,
        "visibility": visibility,
        "created_at": created_at or today_ict_iso(),
        "non_prize_teams": non_prize_teams,
        "features": features,
    }

    entry_fee_th, entry_fee_en = format_money_label(entry_fee_raw, cur, suffix_th="/ทีม", suffix_en="/team")
    if entry_fee_th:
        entry["entry_fee"] = entry_fee_th
        entry["entry_fee_en"] = entry_fee_en

    total_pool_th, total_pool_en = format_money_label(total_pool_raw, cur)
    if total_pool_th:
        entry["total_pool"] = total_pool_th
        entry["total_pool_en"] = total_pool_en

    season_prizes = parse_season_prizes(season_prizes_raw, cur)
    if season_prizes:
        entry["season_prizes"] = season_prizes

    cup_champ, cup_runner = ("", "")
    if not no_cup and cup_prize_raw:
        cup_champ, cup_runner = parse_cup_prize(cup_prize_raw, cur)
        if cup_champ:
            entry["cup_champion_prize"] = cup_champ
        if cup_runner:
            entry["cup_runner_up_prize"] = cup_runner

    if prize_model == "monthly":
        entry["monthly_schedule"] = build_default_monthly_schedule(monthly_champ, monthly_runner, cur)

    rules_th, rules_en = build_auto_rules_cards(
        prize_model=prize_model,
        currency=cur,
        weekly_prize=weekly_prize,
        entry_fee_th=entry_fee_th,
        entry_fee_en=entry_fee_en,
        total_pool_th=total_pool_th,
        total_pool_en=total_pool_en,
        season_prizes=season_prizes,
        has_cup=not no_cup,
        cup_champ=cup_champ,
        cup_runner=cup_runner,
        penalty_tiers=penalty_tiers,
        monthly_champ=monthly_champ,
        monthly_runner=monthly_runner,
        non_prize_teams=non_prize_teams,
    )
    if rules_th:
        entry["rules_cards"] = rules_th
        entry["rules_cards_en"] = rules_en

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
    parser.add_argument("--currency", choices=["THB", "USD", "thb", "usd"], default="THB", help="Prize pool currency (THB or USD)")
    parser.add_argument("--weekly-prize", type=int, default=300, help="Weekly/monthly payout amount in currency (default: 300)")
    parser.add_argument("--entry-fee", default="", help="Optional entry fee per team (e.g. '500' or '20')")
    parser.add_argument("--total-pool", default="", help="Optional total season prize pool (e.g. '15000' or '500')")
    parser.add_argument("--season-prizes", default="", help="Optional rank prizes e.g. '1st:3000,2nd:2000,3rd:1000'")
    parser.add_argument("--cup-prize", default="", help="Optional cup prize e.g. '1000' or '1000/500' (champ/runner-up)")
    parser.add_argument("--penalty-tiers", default="", help="Optional bottom-N penalty amounts from last place up, e.g. '300,200,100'")
    parser.add_argument("--monthly-champ", type=int, default=600, help="Monthly champion prize when --prize-model monthly (default: 600)")
    parser.add_argument("--monthly-runner", type=int, default=400, help="Monthly runner-up prize when --prize-model monthly (default: 400)")
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
            currency=str(args.currency or "THB").upper(),
            entry_fee_raw=args.entry_fee,
            total_pool_raw=args.total_pool,
            season_prizes_raw=args.season_prizes,
            cup_prize_raw=args.cup_prize,
            penalty_tiers_raw=args.penalty_tiers,
            monthly_champ=args.monthly_champ,
            monthly_runner=args.monthly_runner,
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
        verify_built_league(BASE_DIR, lid, entry)

    site_url = load_site_url()
    print("\nLifecycle update complete!" if args.update_lifecycle else "\nOnboarding complete!")
    print(f"  Dashboard path : {os.path.join(BASE_DIR, lid, 'index.html')}")
    print(f"  Public URL     : {site_url}/{lid}/")
    exp_label = entry.get("expires_at") or "-"
    print(f"  Tenant group   : {entry.get('tenant_group', '-')} (visibility={entry.get('visibility', '-')}, status={entry.get('status', 'active')}, expires={exp_label})")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
