# FPLSaWaDiKa — Workspace Rules (`GEMINI.md`)

These instructions apply automatically to every conversation inside the `FPLSaWaDiKa` workspace.

## 1. Communication & Reporting Preferences
* **Dual-Language Explanations:**
  * Whenever the user asks in English (or another non-Thai language), always structure the response in two parts:
    1. **Language the user asked in** (first)
    2. **Thai (`ภาษาไทย`)** (second)
  * When the user asks directly in Thai, answer clearly in Thai without duplicating sections.
* **Detailed Conclusions:**
  * Always provide complete, concrete details when concluding a task: modified file paths, commands/scripts run, exact verification outcomes (tests/CDP checks/HTTP responses), Git commit SHA & branch push status, and Cloudflare Worker version/URL when deployed.

## 2. Project Context & Architecture Entry Point
* Read `PROJECT_CONTEXT.md` (especially Sections 1, 9, and 10) before planning or modifying frontend templates, sync scripts, or Cloudflare Workers.
* **Source of Truth for Frontend:** Edit `update_preview.py` first, then run `python3 update_preview.py` to regenerate `assets/dashboard-app.js`, root HTML files (`index.html`, `preview.html`, `404.html`), and all 9 league entry directories (`config/leagues_config.json`). Never edit generated HTML files alone without updating `update_preview.py`.

## 3. Git, Deployment & Verification Guardrails
* **Strict Deployment Gatekeeper:** Do **not** run `git commit`, `git push`, `./rollback.sh save`, or `wrangler deploy` on your own unless the user explicitly asks you to commit, push, or deploy.
* **Mandatory Local Verification Before Hand-Off:** Run syntax/local checks (`python3 update_preview.py`, `node --check`, `verify_local.py`, and Headless Chrome CDP checks for responsive `1055px` / `390px` layouts and `0` runtime/console errors) before reporting completion.
* **Security & Telemetry Invariants:**
  * Never commit plaintext secrets (`ADMIN_SECRET_KEY`, `ADMIN_SESSION_SECRET`, API keys) into repository files.
  * Keep pinned versions + Subresource Integrity (`integrity="sha384-..."`, `crossorigin="anonymous"`) on third-party scripts (`@tailwindcss/browser@4.3.5`, `xlsx@0.18.5`).
  * Prefer `textContent`, `data-*` attributes, or `this.escapeHtml(...)` over raw interpolation in `innerHTML` or inline `onclick="..."`.
  * Keep Cloudflare D1 row `lifetime:total_views` (`date = '9999-12-31'`) excluded from 30-day telemetry pruning queries in `workers/fpl-live-worker.js`.

## 4. Dual-Workspace Routing & Isolation (`main` Online vs `FPLSaWaDiKa-commercial` Local)
The repository is intentionally split into **two separate Git worktrees** so commercial development never affects live users:
* **Online Production Workspace:** `/Users/micky/Desktop/Antigravity/FPLSaWaDiKa` on branch **`main`** (`https://www.fplsawadika.com/` + live Cloudflare Worker `fpl-live-relay`).
* **Commercial Local Workspace:** `/Users/micky/Desktop/Antigravity/FPLSaWaDiKa-commercial` on branch **`feat/commercial-landing`** (Product Landing Page, Pricing, Payment/Subscription, Customer Onboarding, Tenant Isolation, and `[env.staging]` Local Worker `fpl-live-relay-staging`).

### Mandatory Routing Rules Before Editing Any File
1. **Route to `FPLSaWaDiKa-commercial` (`feat/commercial-landing`):** Whenever the user labels `[งานขาย]` / `[Commercial]`, opens a Commercial-focused conversation, or asks about Landing Page redesign/copy, pricing/packages, payment/slip verification, customer league lock/expiration, tenant isolation (`private`), `onboard_league.py`, `config/site_config.json`, or Staging Worker (`8787`), perform **all** edits, scripts, tests, and dev servers inside `/Users/micky/Desktop/Antigravity/FPLSaWaDiKa-commercial` (always prefix commands with `cd /Users/micky/Desktop/Antigravity/FPLSaWaDiKa-commercial && ...` when the shell starts in `FPLSaWaDiKa`). **Never** edit `FPLSaWaDiKa` (`main`) or merge into `main` for commercial work unless the user explicitly orders a public launch.
2. **Route to `FPLSaWaDiKa` (`main`):** Whenever the user labels `[ออนไลน์]` / `[Production]` or asks to fix bugs / adjust features / sync live GW data for existing online leagues (`40700`, `675290`, `38491`, `1101958`, `438691`, `187827`, `5349`, `567387`, `139836`), work strictly inside `/Users/micky/Desktop/Antigravity/FPLSaWaDiKa`.
3. **Ask First When Ambiguous:** If a request could plausibly target either Online (`main`) or Commercial (`feat/commercial-landing`) and the target workspace has not been stated in the conversation, pause and confirm with the user **before** modifying any file or running sync/deploy commands.
4. **Cloudflare Worker Separation:** Never run `wrangler deploy` against top-level `fpl-live-relay` from `FPLSaWaDiKa-commercial/workers/`. Use `--local --env staging --port 8787` with `workers/schema.sql` and `?api=local` for commercial local testing (`http://127.0.0.1:8000/?api=local`).
5. **User Workflow Support:** The user prefers plain-language explanations without terminal jargon and relies on the agent to run `update_preview.py`, `verify_local.py`, local HTTP/Wrangler dev servers, and approved Git operations on their behalf.
