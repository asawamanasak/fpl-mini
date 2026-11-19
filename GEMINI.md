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
* **Mandatory Local Verification Before Hand-Off (Every Function × Every Device):** Before reporting any change complete, run syntax/local checks (`python3 update_preview.py`, `node --check`, `sloplint.mjs`, `verify_local.py`) **plus** Headless Chrome CDP end-to-end verification across **all 4 device classes** (`1440px` Desktop, `1055px` Laptop, `820px` Touch Tablet with `hover:none`/`pointer:coarse`, and `390px` Touch Mobile with `hover:none`/`pointer:coarse`). The CDP check must exercise **every interactive function** (mobile nav drawer, theme Dark/Light, language TH/EN, currency THB/USD, animated ticker/transitions still moving after touch taps/swipes, 6-screen switcher, matchday drama items, demo links, pricing button & disabled roadmap guard, FAQ accordion expand/collapse, order form URL extract/validation/copy slip) in both modes/languages with `0` horizontal overflow and `0` console/runtime errors.
* **Security & Telemetry Invariants:**
  * Never commit plaintext secrets (`ADMIN_SECRET_KEY`, `ADMIN_SESSION_SECRET`, API keys) into repository files.
  * Keep pinned versions + Subresource Integrity (`integrity="sha384-..."`, `crossorigin="anonymous"`) on third-party scripts (`@tailwindcss/browser@4.3.5`, `xlsx@0.18.5`).
  * Prefer `textContent`, `data-*` attributes, or `this.escapeHtml(...)` over raw interpolation in `innerHTML` or inline `onclick="..."`.
  * Keep Cloudflare D1 row `lifetime:total_views` (`date = '9999-12-31'`) excluded from 30-day telemetry pruning queries in `workers/fpl-live-worker.js`.

## 4. Dual-Workspace Routing & Isolation (`feat/commercial-landing` Commercial Local)
* **This Worktree (`/Users/micky/Desktop/Antigravity/FPLSaWaDiKa-commercial`, branch `feat/commercial-landing`):** Dedicated **exclusively** to Commercial development (Product Landing Page, Pricing, Payment/Subscription, Customer Onboarding, Tenant Isolation, and `[env.staging]` Local Worker `fpl-live-relay-staging`).
* **9 Unmigrated Online Leagues (Dual Role — Showcase Demos & Live Beta Group):** Until migrated post-launch, treat the 9 existing online leagues (`40700`, `675290`, `38491`, `1101958`, `438691`, `187827`, `5349`, `567387`, `139836`) as **both** (1) public showcase examples safe to link/present to prospective buyers (`index.html`, `preview.html`, `sitemap.xml`), and (2) the active live beta testing group used to catch bugs and validate improvements. Always keep them demo-safe (no exposed personal PII/bank accounts, zero-error responsive stability), keep them grouped under `tenant_group: "showcase"` / `visibility: "showcase"`, always verify all 9 dashboards remain healthy after shared frontend edits, and keep new private customer leagues strictly isolated (`visibility: "private"`, `tenant_group: "private_<id>"`, `noindex`, excluded from `data/radar.json`).
* **Never Touch Online Production:** Do **not** modify `/Users/micky/Desktop/Antigravity/FPLSaWaDiKa` (`main`), do **not** merge into `main`, and do **not** deploy Cloudflare Worker `fpl-live-relay` (`api.fplsawadika.com`) from this worktree unless explicitly ordered by the user to launch publicly.
* **Local Staging & Telemetry Isolation:**
  * Run local Worker with `cd /Users/micky/Desktop/Antigravity/FPLSaWaDiKa-commercial/workers && npx wrangler dev --local --env staging --port 8787` (uses local SQLite initialized from `workers/schema.sql` and gitignored `workers/.dev.vars`).
  * Run local web server on `127.0.0.1:8000` and test full integration via `http://127.0.0.1:8000/?api=local` (`resolveWorkerApiBase()` keeps production domains strictly locked to `https://api.fplsawadika.com` and keeps localhost telemetry blocked unless `?api=local` points to local/staging).
  * **Important Shell Path Guardrail:** If invoked from a conversation rooted in `/Users/micky/Desktop/Antigravity/FPLSaWaDiKa`, always `cd /Users/micky/Desktop/Antigravity/FPLSaWaDiKa-commercial && ...` before running any command or editing files.
* **User Workflow Support:** The user prefers plain-language explanations without terminal jargon and relies on the agent to run build/verification scripts, dev servers, and approved `feat/commercial-landing` Git operations on their behalf.
