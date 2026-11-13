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
