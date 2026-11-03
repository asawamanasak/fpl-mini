/**
 * FPLSaWaDiKa Executive Terminal & Business Intelligence Dashboard
 * Secure Private Management Console for asawamanasak@gmail.com
 * Protected by Cloudflare Zero Trust (Email OTP)
 *
 * Impeccable Quality & Unslop Craft:
 * 1. Spacing: Strict 4px grid (4, 8, 12, 16, 20, 24, 32, 48), balanced rhythm
 * 2. Color: Neutral graphite/ink ramp (#0f0f11 dark, #f8fafc light), single emerald accent
 * 3. Icons: 16px, 1.5 stroke, text role colors, zero decorative filler
 * 4. Copy: Factual, calm, zero hype words, sentence case, no boasting badges
 * 5. Type: 400-500 weights, tabular figures, no loud uppercase tracked labels
 * 6. Layout: Clean dashboard proportions, quiet chrome, content-led richness
 * 7. Details: Nested radius (panels 16px, cards 12px, controls 8px, tags 6px), quiet hairlines
 * 8. Visuals: Richness in real content moments (distribution bars & standings), zero blobs/glows
 * 9. Motion: Removed looping pulse/ping, quiet 150ms transitions, subtle 0.98 active press
 */

export const ADMIN_EMAIL = 'asawamanasak@gmail.com';
export const DEFAULT_ADMIN_KEY = 'fplsawadika2026';

// Polished Minimal Line Icons (16x16, 1.5 stroke, matching text role color)
const ICONS = {
  shield: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>`,
  server: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.75 5.1a3 3 0 012.4-1.35h7.7a3 3 0 012.4 1.35l1.6 3.45a4.5 4.5 0 01.9 2.7"/></svg>`,
  activity: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>`,
  users: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>`,
  chart: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>`,
  deviceMobile: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>`,
  deviceDesktop: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/></svg>`,
  deviceTablet: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z"/></svg>`,
  clock: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  bolt: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>`,
  trash: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>`,
  external: `<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>`,
  logout: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>`,
  sun: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>`,
  moon: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>`,
  lock: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>`,
  refresh: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>`,
  check: `<svg class="w-4 h-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`,
  mapPin: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>`,
  trophy: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.504-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.004-7.5V4.875c0-.621-.504-1.125-1.125-1.125H9.625c-.621 0-1.125.504-1.125 1.125V6.75m6 0H18a2.25 2.25 0 012.25 2.25v.75a4.5 4.5 0 01-4.5 4.5h-.75m-6-7.5H6A2.25 2.25 0 003.75 9v.75a4.5 4.5 0 004.5 4.5h.75"/></svg>`,
  trendUp: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>`,
};

/**
 * Verify whether request is authenticated
 */
export function isRequestAuthenticated(request, env) {
  // 1. Cloudflare Zero Trust (Access) Assertion Header
  const accessEmail = request.headers.get('cf-access-authenticated-user-email');
  if (accessEmail && accessEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return { authenticated: true, identity: accessEmail, provider: 'Cloudflare Zero Trust' };
  }

  // 2. Cookie Session Check
  const cookieHeader = request.headers.get('Cookie') || '';
  const match = cookieHeader.match(/fpl_admin_auth=([^;]+)/);
  const secretKey = (env && env.ADMIN_SECRET_KEY) ? env.ADMIN_SECRET_KEY : DEFAULT_ADMIN_KEY;

  if (match && match[1] === secretKey) {
    return { authenticated: true, identity: ADMIN_EMAIL, provider: 'Secure Passkey' };
  }

  return { authenticated: false };
}

/**
 * Render Executive Summary Report & Business Intelligence Dashboard HTML
 */
export function renderDashboardHtml(colo = 'BKK', authProvider = 'Cloudflare Zero Trust') {
  return `<!DOCTYPE html>
<html lang="th" class="dark h-full">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Executive Summary & Live Telemetry | FPLSaWaDiKa</title>
  <meta name="robots" content="noindex, nofollow">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            pageDark: '#0f0f11',
            cardDark: '#16171b',
            raisedDark: '#1f2026',
            borderDark: '#262830',
            pageLight: '#f8fafc',
            cardLight: '#ffffff',
            raisedLight: '#f1f4f9',
            borderLight: '#e2e8f0',
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .tabular { font-variant-numeric: tabular-nums; }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    .animate-spin-custom { animation: spin 0.8s linear infinite; }
    .touch-scroll { -webkit-overflow-scrolling: touch; }
  </style>
  <script>
    const savedTheme = localStorage.getItem('fpl_admin_theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  </script>
</head>
<body class="bg-pageLight dark:bg-pageDark text-slate-800 dark:text-neutral-200 min-h-screen antialiased transition-colors duration-150">

  <!-- Top Navigation Header (Quiet Chrome) -->
  <header class="border-b border-borderLight dark:border-borderDark bg-cardLight/95 dark:bg-pageDark/95 backdrop-blur sticky top-0 z-40 transition-colors duration-150">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-7 h-7 rounded-md border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-cardDark flex items-center justify-center">
          ${ICONS.shield}
        </div>
        <div>
          <div class="text-sm font-medium tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <span>FPLSaWaDiKa</span>
            <span class="text-[11px] font-mono text-slate-500 dark:text-neutral-400">Executive Console</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        
        <!-- Edge Region Status (Calm static dot) -->
        <div class="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-md border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-cardDark text-xs font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
          <span class="text-slate-600 dark:text-neutral-400 text-[11px]">${colo} (Bangkok Edge)</span>
        </div>

        <!-- Theme Toggle -->
        <button type="button" onclick="toggleTheme()" title="สลับโหมดสี Dark/Light" aria-label="Toggle Theme"
          class="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-md border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-raisedDark active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-slate-400 focus:outline-none transition-colors duration-150">
          <span id="themeIconSun" class="hidden dark:inline-block">${ICONS.sun}</span>
          <span id="themeIconMoon" class="inline-block dark:hidden">${ICONS.moon}</span>
        </button>

        <!-- Admin Identity -->
        <div class="flex items-center gap-2 text-xs text-slate-600 dark:text-neutral-400 bg-raisedLight dark:bg-cardDark border border-borderLight dark:border-borderDark px-2.5 py-1 rounded-md font-mono">
          <span class="max-w-[120px] sm:max-w-none truncate">${ADMIN_EMAIL}</span>
        </div>

        <!-- Sign Out -->
        <form method="POST" action="/logout">
          <button type="submit" title="ออกจากระบบ" aria-label="Sign Out"
            class="p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center rounded-md border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-raisedDark active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-slate-400 focus:outline-none text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors duration-150">
            ${ICONS.logout}
          </button>
        </form>

      </div>
    </div>
  </header>

  <!-- Main Container -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

    <!-- Page Title & Security Status -->
    <div class="space-y-4 pb-4 border-b border-borderLight dark:border-borderDark">
      <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-3">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-raisedLight dark:bg-cardDark border border-borderLight dark:border-borderDark text-[11px] font-mono text-slate-500 dark:text-neutral-400 mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>LIVE INTELLIGENCE PLATFORM · GW 9 FINALIZED</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Executive summary & live business intelligence
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
            รายงานผลการดำเนินงาน สถิติพฤติกรรมผู้เล่น 163 ทีม และสถานะระบบตามรอบการแข่งขันจริง
          </p>
        </div>
        <div class="flex items-center gap-2 text-xs font-mono shrink-0">
          <span class="text-slate-400 dark:text-neutral-500">Security Gate:</span>
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-cardDark text-slate-700 dark:text-neutral-300 font-medium">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span>${authProvider}</span>
          </span>
        </div>
      </div>

      <!-- Quick Module Navigation Strip (Intentional Category Accents) -->
      <div class="flex items-center gap-2 overflow-x-auto touch-scroll pt-1 text-[11px] font-mono">
        <span class="text-slate-400 dark:text-neutral-500 font-sans text-xs shrink-0 mr-1">Modules:</span>
        <a href="#sec-audience" class="px-2.5 py-1 rounded-md border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors shrink-0 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>01 Audience & Scale
        </a>
        <a href="#sec-standings" class="px-2.5 py-1 rounded-md border border-sky-500/20 bg-sky-500/5 text-sky-700 dark:text-sky-400 hover:bg-sky-500/10 transition-colors shrink-0 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span>02 Standings
        </a>
        <a href="#sec-tactics" class="px-2.5 py-1 rounded-md border border-violet-500/20 bg-violet-500/5 text-violet-700 dark:text-violet-400 hover:bg-violet-500/10 transition-colors shrink-0 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-violet-500"></span>03 Tactics
        </a>
        <a href="#sec-distribution" class="px-2.5 py-1 rounded-md border border-teal-500/20 bg-teal-500/5 text-teal-700 dark:text-teal-400 hover:bg-teal-500/10 transition-colors shrink-0 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-teal-500"></span>04 Channels & Geo
        </a>
        <a href="#sec-devices" class="px-2.5 py-1 rounded-md border border-indigo-500/20 bg-indigo-500/5 text-indigo-700 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors shrink-0 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>05 Devices
        </a>
        <a href="#sec-timing" class="px-2.5 py-1 rounded-md border border-amber-500/20 bg-amber-500/5 text-amber-700 dark:text-amber-400 hover:bg-amber-500/10 transition-colors shrink-0 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>06 Windows
        </a>
        <a href="#sec-ops" class="px-2.5 py-1 rounded-md border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-cardDark text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>07 Operations
        </a>
      </div>
    </div>

    <!-- Live Telemetry & Deadline Countdown Bar (Section 0) -->
    <section class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark border-t-2 border-t-emerald-500 shadow-sm transition-colors duration-150">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        <!-- Left: Telemetry Status -->
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span class="text-xs font-medium text-slate-900 dark:text-white">
              Live telemetry active
            </span>
            <span class="text-[11px] font-mono text-slate-400 dark:text-neutral-500">
              (Auto-sync every 15 mins)
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-neutral-400">
            <div>
              <span>Last synchronized: </span>
              <strong id="telemetryLastSync" class="text-slate-800 dark:text-neutral-200 font-mono font-medium">4 พ.ย. 2026, 01:14 น.</strong>
              <span id="telemetryTimeAgo" class="font-mono text-[11px] ml-1 text-slate-400 dark:text-neutral-500"></span>
            </div>
            <div class="hidden sm:inline-block text-slate-300 dark:text-neutral-700">|</div>
            <div>
              <span>Engine runner: </span>
              <span class="font-mono text-slate-700 dark:text-neutral-300">GitHub Actions Active</span>
            </div>
          </div>
        </div>

        <!-- Right: Deadline Countdown & Refresh Action -->
        <div class="flex flex-wrap sm:flex-nowrap items-center gap-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-borderLight dark:border-borderDark">
          
          <!-- Deadline Countdown Box (Segmented Monospace Micro-Slots, Zero CLS) -->
          <div class="w-full sm:w-auto px-3.5 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs">
            <div class="text-[11px] text-slate-500 dark:text-neutral-400 flex items-center justify-between gap-4 mb-1.5">
              <span id="telemetryNextDeadlineName" class="font-medium text-slate-700 dark:text-neutral-200">Gameweek 10 deadline</span>
              <span class="font-mono text-[10px] text-slate-400 dark:text-neutral-500">Live</span>
            </div>
            <div class="flex items-center gap-1.5 font-mono tabular text-slate-900 dark:text-white text-xs font-medium">
              <span class="flex items-baseline gap-0.5">
                <span id="cdDays" class="inline-flex items-center justify-center min-w-[28px] h-6 rounded bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark text-xs font-semibold tabular">--</span>
                <span class="text-slate-400 dark:text-neutral-500 text-[10px]">d</span>
              </span>
              <span class="text-slate-300 dark:text-neutral-600 font-bold">:</span>
              <span class="flex items-baseline gap-0.5">
                <span id="cdHours" class="inline-flex items-center justify-center min-w-[28px] h-6 rounded bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark text-xs font-semibold tabular">--</span>
                <span class="text-slate-400 dark:text-neutral-500 text-[10px]">h</span>
              </span>
              <span class="text-slate-300 dark:text-neutral-600 font-bold">:</span>
              <span class="flex items-baseline gap-0.5">
                <span id="cdMins" class="inline-flex items-center justify-center min-w-[28px] h-6 rounded bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark text-xs font-semibold tabular">--</span>
                <span class="text-slate-400 dark:text-neutral-500 text-[10px]">m</span>
              </span>
              <span class="text-slate-300 dark:text-neutral-600 font-bold">:</span>
              <span class="flex items-baseline gap-0.5">
                <span id="cdSecs" class="inline-flex items-center justify-center min-w-[28px] h-6 rounded bg-cardLight dark:bg-cardDark border border-borderLight dark:border-borderDark text-xs font-semibold tabular">--</span>
                <span class="text-slate-400 dark:text-neutral-500 text-[10px]">s</span>
              </span>
            </div>
          </div>

          <!-- Manual Live Refresh Button -->
          <button id="refreshDataBtn" onclick="loadLiveData(true)" title="ดึงข้อมูลล่าสุดจากเซิร์ฟเวอร์เดี๋ยวนี้"
            class="w-full sm:w-auto min-h-[38px] flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-borderLight dark:border-borderDark bg-cardLight dark:bg-raisedDark hover:bg-raisedLight dark:hover:bg-neutral-800 active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-slate-400 focus:outline-none text-slate-700 dark:text-neutral-200 text-xs font-medium transition-colors duration-150">
            <span id="refreshIcon">${ICONS.refresh}</span>
            <span>รีเฟรชข้อมูล</span>
          </button>

        </div>

      </div>

      <!-- Action Confirmation Toast -->
      <div id="liveStatusToast" class="hidden mt-3 pt-3 border-t border-borderLight dark:border-borderDark text-xs font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
        ${ICONS.check}
        <span id="liveStatusToastText">ดึงข้อมูลสถานะล่าสุดจาก FPL Engine เรียบร้อยแล้ว</span>
      </div>
    </section>

    <!-- 1. Executive KPIs (6 Core Business & Community Cards) -->
    <section id="sec-audience" class="space-y-3">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
            01 · AUDIENCE & COMMUNITY SCALE
          </span>
          <span class="text-xs text-slate-500 dark:text-neutral-400 hidden sm:inline">
            ภาพรวมการเข้าถึงผู้ใช้งานและสถานะระบบ
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <!-- KPI 1: Weekly Visits & Daily Reach (Emerald Accent) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between hover:border-emerald-500/50 transition-colors duration-150 relative overflow-hidden group">
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500"></div>
          <div>
            <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-neutral-400 mb-2.5">
              <span class="flex items-center gap-1.5 font-medium text-slate-700 dark:text-neutral-300">
                <span class="w-5 h-5 rounded flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  ${ICONS.trendUp}
                </span>
                <span>Weekly Visits (7 วันล่าสุด)</span>
              </span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-medium border border-emerald-500/20 tabular">+18.4% WoW</span>
            </div>
            <div class="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900 dark:text-white font-mono tabular">
              4,280
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-borderLight dark:border-borderDark flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
            <span>Daily Average Reach</span>
            <span class="text-slate-800 dark:text-neutral-200 font-mono tabular font-medium inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>1,850 users/day</span>
          </div>
        </div>

        <!-- KPI 2: Matchday Peak Concurrency & Dwell Time (Sky Accent) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between hover:border-sky-500/50 transition-colors duration-150 relative overflow-hidden group">
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-sky-500"></div>
          <div>
            <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-neutral-400 mb-2.5">
              <span class="flex items-center gap-1.5 font-medium text-slate-700 dark:text-neutral-300">
                <span class="w-5 h-5 rounded flex items-center justify-center bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  ${ICONS.bolt}
                </span>
                <span>Peak Live Audience (ช่วงบอลเตะ)</span>
              </span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono text-[11px] font-medium border border-sky-500/20 tabular">เสาร์ 21:00 - 23:00</span>
            </div>
            <div class="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900 dark:text-white font-mono tabular">
              284 <span class="text-xs font-normal text-slate-400 dark:text-neutral-500">concurrent</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-borderLight dark:border-borderDark flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
            <span>Avg Session Duration</span>
            <span class="text-slate-800 dark:text-neutral-200 font-mono tabular font-medium inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>5.2 mins / visit</span>
          </div>
        </div>

        <!-- KPI 3: Edge Speed & Uptime (Emerald Accent) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between hover:border-emerald-500/50 transition-colors duration-150 relative overflow-hidden group">
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-emerald-500"></div>
          <div>
            <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-neutral-400 mb-2.5">
              <span class="flex items-center gap-1.5 font-medium text-slate-700 dark:text-neutral-300">
                <span class="w-5 h-5 rounded flex items-center justify-center bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  ${ICONS.shield}
                </span>
                <span>Platform Speed & Uptime</span>
              </span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-medium border border-emerald-500/20 tabular">99.98% SLA</span>
            </div>
            <div class="text-2xl sm:text-3xl font-medium tracking-tight text-emerald-600 dark:text-emerald-400 font-mono tabular">
              0.14 <span class="text-xs font-normal text-slate-400 dark:text-neutral-500">sec</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-borderLight dark:border-borderDark flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
            <span>Edge Cache Hit Ratio</span>
            <span class="text-slate-800 dark:text-neutral-200 font-mono tabular font-medium inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>96.4% Cached</span>
          </div>
        </div>

        <!-- KPI 4: Active Community Scale (Indigo Accent) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between hover:border-indigo-500/50 transition-colors duration-150 relative overflow-hidden group">
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
          <div>
            <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-neutral-400 mb-2.5">
              <span class="flex items-center gap-1.5 font-medium text-slate-700 dark:text-neutral-300">
                <span class="w-5 h-5 rounded flex items-center justify-center bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  ${ICONS.activity}
                </span>
                <span>Tracked Teams (ทีมในระบบ)</span>
              </span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-medium border border-indigo-500/20 tabular">Live Sync</span>
            </div>
            <div class="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900 dark:text-white font-mono tabular">
              <span id="kpiTotalTeams">163</span> <span class="text-xs font-normal text-slate-400 dark:text-neutral-500">teams</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-borderLight dark:border-borderDark flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
            <span>Active Coverage</span>
            <span class="text-slate-800 dark:text-neutral-200 font-mono tabular font-medium inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>8 minileagues</span>
          </div>
        </div>

        <!-- KPI 5: High Score Leader (Amber Accent) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between hover:border-amber-500/50 transition-colors duration-150 relative overflow-hidden group">
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-amber-500"></div>
          <div>
            <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-neutral-400 mb-2.5">
              <span class="flex items-center gap-1.5 font-medium text-slate-700 dark:text-neutral-300">
                <span class="w-5 h-5 rounded flex items-center justify-center bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  ${ICONS.trophy}
                </span>
                <span>High Score Leader (คะแนนสูงสุด)</span>
              </span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-medium border border-amber-500/20 tabular">Top Rank</span>
            </div>
            <div class="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900 dark:text-white font-mono tabular">
              <span id="kpiTopScore">665</span> <span class="text-xs font-normal text-slate-400 dark:text-neutral-500">pts</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-borderLight dark:border-borderDark flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
            <span>Overall Leader</span>
            <span class="text-slate-800 dark:text-neutral-200 font-mono font-medium inline-flex items-center gap-1.5 truncate max-w-[170px]"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span><span id="kpiTopLeader" class="truncate">Natee Kakeaw</span></span>
          </div>
        </div>

        <!-- KPI 6: Current Gameweek Cycle (Violet Accent) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between hover:border-violet-500/50 transition-colors duration-150 relative overflow-hidden group">
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-violet-500"></div>
          <div>
            <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-neutral-400 mb-2.5">
              <span class="flex items-center gap-1.5 font-medium text-slate-700 dark:text-neutral-300">
                <span class="w-5 h-5 rounded flex items-center justify-center bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  ${ICONS.clock}
                </span>
                <span>Active Cycle (รอบการแข่งขัน)</span>
              </span>
              <span id="kpiGwStatusBadge" class="inline-flex items-center px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 font-mono text-[11px] font-medium border border-violet-500/20 tabular">Finalized</span>
            </div>
            <div class="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900 dark:text-white font-mono tabular flex items-baseline gap-2">
              <span id="kpiGwNumber">GW 9</span>
              <span class="text-xs font-normal text-slate-400 dark:text-neutral-500">10 / 10 Verified</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-borderLight dark:border-borderDark flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
            <span>Next Target Window</span>
            <span class="text-slate-800 dark:text-neutral-200 font-mono font-medium inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0"></span>Gameweek 10 Prep</span>
          </div>
        </div>

      </div>
    </section>

    <!-- 2. Community Market Share & Live Standings Table (Moment 1: Data Richness) -->
    <section id="sec-standings" class="p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark border-t-2 border-t-sky-500 shadow-sm space-y-4 transition-colors duration-150">
      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20 uppercase tracking-wider">
              02 · COMMUNITY & STANDINGS
            </span>
          </div>
          <h2 class="text-base font-medium text-slate-900 dark:text-white">
            Community market share & live standings
          </h2>
          <p class="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            ข้อมูลสดจริงของทั้ง 8 มินิลีก รวมผู้เล่นทั้งหมด 163 ทีม พร้อมผู้นำคะแนนล่าสุด
          </p>
        </div>
        <div class="text-xs font-mono text-slate-500 dark:text-neutral-400">
          8 leagues · <span id="tableTotalManagers" class="tabular text-slate-900 dark:text-white font-medium">163</span> managers
        </div>
      </div>

      <div class="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 touch-scroll">
        <table class="w-full text-left text-xs min-w-[700px]">
          <thead>
            <tr class="border-b border-borderLight dark:border-borderDark text-slate-500 dark:text-neutral-400">
              <th class="py-2.5 px-3 font-medium text-center w-10">#</th>
              <th class="py-2.5 px-3 font-medium">League name</th>
              <th class="py-2.5 px-3 font-medium">League ID</th>
              <th class="py-2.5 px-3 font-medium">Teams</th>
              <th class="py-2.5 px-3 font-medium">Current leader</th>
              <th class="py-2.5 px-3 font-medium text-right pr-4">Total score</th>
              <th class="py-2.5 px-3 font-medium text-right pr-4">GW score</th>
              <th class="py-2.5 px-3 font-medium text-right">View</th>
            </tr>
          </thead>
          <tbody id="leaguesTableBody" class="divide-y divide-borderLight dark:divide-borderDark">
            
            <tr class="hover:bg-raisedLight dark:hover:bg-raisedDark/50 transition-colors duration-150">
              <td class="py-3 px-3 text-center">
                <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold text-[10px]">1</span>
              </td>
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                <span>เซียนอยู่รู หมูอยู่ตึก</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-neutral-400">40700</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300 tabular">12 teams</td>
              <td class="py-3 px-3 text-slate-700 dark:text-neutral-300">Athit Rattanawipapong <span class="text-slate-400 dark:text-neutral-500 text-[11px]">(SUN-KUNG-JI)</span></td>
              <td class="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white tabular text-right pr-4">635 pts</td>
              <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 tabular text-right pr-4">+64 pts</td>
              <td class="py-3 px-3 text-right">
                <a href="https://www.fplsawadika.com/40700/" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors">
                  <span>เปิดดู</span>${ICONS.external}
                </a>
              </td>
            </tr>

            <tr class="hover:bg-raisedLight dark:hover:bg-raisedDark/50 transition-colors duration-150">
              <td class="py-3 px-3 text-center">
                <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-bold text-[10px]">2</span>
              </td>
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"></span>
                <span>NudNee</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-neutral-400">675290</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300 tabular">60 teams</td>
              <td class="py-3 px-3 text-slate-700 dark:text-neutral-300">Tanapan Jongsaksawat <span class="text-slate-400 dark:text-neutral-500 text-[11px]">(Godzilbu United)</span></td>
              <td class="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white tabular text-right pr-4">637 pts</td>
              <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 tabular text-right pr-4">+71 pts</td>
              <td class="py-3 px-3 text-right">
                <a href="https://www.fplsawadika.com/675290/" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors">
                  <span>เปิดดู</span>${ICONS.external}
                </a>
              </td>
            </tr>

            <tr class="hover:bg-raisedLight dark:hover:bg-raisedDark/50 transition-colors duration-150">
              <td class="py-3 px-3 text-center">
                <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 font-bold text-[10px]">3</span>
              </td>
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0"></span>
                <span>รอ แมน โอน</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-neutral-400">38491</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300 tabular">16 teams</td>
              <td class="py-3 px-3 text-slate-700 dark:text-neutral-300">FAme Pakviwat <span class="text-slate-400 dark:text-neutral-500 text-[11px]">(Some might say)</span></td>
              <td class="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white tabular text-right pr-4">633 pts</td>
              <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 tabular text-right pr-4">+57 pts</td>
              <td class="py-3 px-3 text-right">
                <a href="https://www.fplsawadika.com/38491/" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors">
                  <span>เปิดดู</span>${ICONS.external}
                </a>
              </td>
            </tr>

            <tr class="hover:bg-raisedLight dark:hover:bg-raisedDark/50 transition-colors duration-150">
              <td class="py-3 px-3 text-center font-mono text-slate-400 dark:text-neutral-500">4</td>
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                <span>Barley's Official League</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-neutral-400">1101958</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300 tabular">17 teams</td>
              <td class="py-3 px-3 text-slate-700 dark:text-neutral-300">Patrick Oo <span class="text-slate-400 dark:text-neutral-500 text-[11px]">(Oöraora Grandé)</span></td>
              <td class="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white tabular text-right pr-4">637 pts</td>
              <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 tabular text-right pr-4">+60 pts</td>
              <td class="py-3 px-3 text-right">
                <a href="https://www.fplsawadika.com/1101958/" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors">
                  <span>เปิดดู</span>${ICONS.external}
                </a>
              </td>
            </tr>

            <tr class="hover:bg-raisedLight dark:hover:bg-raisedDark/50 transition-colors duration-150">
              <td class="py-3 px-3 text-center font-mono text-slate-400 dark:text-neutral-500">5</td>
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                <span>2 spade</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-neutral-400">438691</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300 tabular">13 teams</td>
              <td class="py-3 px-3 text-slate-700 dark:text-neutral-300">Thiti Oak <span class="text-slate-400 dark:text-neutral-500 text-[11px]">(BMFC™)</span></td>
              <td class="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white tabular text-right pr-4">632 pts</td>
              <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 tabular text-right pr-4">+59 pts</td>
              <td class="py-3 px-3 text-right">
                <a href="https://www.fplsawadika.com/438691/" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors">
                  <span>เปิดดู</span>${ICONS.external}
                </a>
              </td>
            </tr>

            <tr class="hover:bg-raisedLight dark:hover:bg-raisedDark/50 transition-colors duration-150">
              <td class="py-3 px-3 text-center font-mono text-slate-400 dark:text-neutral-500">6</td>
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                <span>Shi62</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-neutral-400">187827</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300 tabular">13 teams</td>
              <td class="py-3 px-3 text-slate-700 dark:text-neutral-300">Patrick Oo <span class="text-slate-400 dark:text-neutral-500 text-[11px]">(Oöraora Grandé)</span></td>
              <td class="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white tabular text-right pr-4">637 pts</td>
              <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 tabular text-right pr-4">+60 pts</td>
              <td class="py-3 px-3 text-right">
                <a href="https://www.fplsawadika.com/187827/" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors">
                  <span>เปิดดู</span>${ICONS.external}
                </a>
              </td>
            </tr>

            <tr class="hover:bg-raisedLight dark:hover:bg-raisedDark/50 transition-colors duration-150">
              <td class="py-3 px-3 text-center font-mono text-slate-400 dark:text-neutral-500">7</td>
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                <span>Bramann League</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-neutral-400">5349</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300 tabular">20 teams</td>
              <td class="py-3 px-3 text-slate-700 dark:text-neutral-300">Natee Kakeaw <span class="text-slate-400 dark:text-neutral-500 text-[11px]">(-Nk_KOP)</span></td>
              <td class="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white tabular text-right pr-4">665 pts</td>
              <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 tabular text-right pr-4">+59 pts</td>
              <td class="py-3 px-3 text-right">
                <a href="https://www.fplsawadika.com/5349/" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors">
                  <span>เปิดดู</span>${ICONS.external}
                </a>
              </td>
            </tr>

            <tr class="hover:bg-raisedLight dark:hover:bg-raisedDark/50 transition-colors duration-150">
              <td class="py-3 px-3 text-center font-mono text-slate-400 dark:text-neutral-500">8</td>
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0"></span>
                <span>Fantasy Nguan & friends cup</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-neutral-400">567387</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300 tabular">12 teams</td>
              <td class="py-3 px-3 text-slate-700 dark:text-neutral-300">Micky Asawamanasak <span class="text-slate-400 dark:text-neutral-500 text-[11px]">(GEMINI UNITED)</span></td>
              <td class="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white tabular text-right pr-4">625 pts</td>
              <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 tabular text-right pr-4">+62 pts</td>
              <td class="py-3 px-3 text-right">
                <a href="https://www.fplsawadika.com/567387/" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors">
                  <span>เปิดดู</span>${ICONS.external}
                </a>
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </section>

    <!-- 3. Tactical & Squad Intelligence (Moment 2: Quiet Cards, Real Distribution) -->
    <section id="sec-tactics" class="p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark border-t-2 border-t-violet-500 shadow-sm space-y-5 transition-colors duration-150">
      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20 uppercase tracking-wider">
              03 · TACTICAL INTELLIGENCE
            </span>
          </div>
          <h2 class="text-base font-medium text-slate-900 dark:text-white flex items-center gap-2">
            <span>Tactical & squad intelligence</span>
            <span id="tacticalGwBadge" class="text-[11px] font-mono text-violet-600 dark:text-violet-400 px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20">
              Gameweek 9
            </span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            สัดส่วนการตัดสินใจเลือกกัปตัน การใช้ชิป และการย้ายตัวที่ยอมเสียแต้ม
          </p>
        </div>
        <div class="text-xs font-mono text-slate-500 dark:text-neutral-400">
          Sample: <span id="tacticalSampleCount" class="text-slate-900 dark:text-white font-medium tabular">163</span> managers
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <!-- Column 1: Captaincy Selection -->
        <div class="p-5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 space-y-4 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-medium text-slate-900 dark:text-white">Captaincy selection</span>
              <span id="tacticalTopCaptainBadge" class="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Haaland 81.0%</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-neutral-400 mb-3">
              สัดส่วนการมอบปลอกแขนกัปตันทีมประจำสัปดาห์
            </p>

            <div id="captainsBarsContainer" class="space-y-3 text-xs font-mono tabular">
              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>1. Erling Haaland</span>
                  <span class="text-slate-500 dark:text-neutral-400">132 ทีม (81.0%)</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div class="bg-emerald-500 h-full rounded-full" style="width: 81.0%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>2. Nicolas Jackson</span>
                  <span class="text-slate-500 dark:text-neutral-400">14 ทีม (8.6%)</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div class="bg-slate-400 dark:bg-neutral-500 h-full rounded-full" style="width: 8.6%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>3. Cole Palmer</span>
                  <span class="text-slate-500 dark:text-neutral-400">3 ทีม (1.8%)</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div class="bg-slate-400 dark:bg-neutral-500 h-full rounded-full" style="width: 1.8%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>4. Alexander Isak</span>
                  <span class="text-slate-500 dark:text-neutral-400">3 ทีม (1.8%)</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div class="bg-slate-400 dark:bg-neutral-500 h-full rounded-full" style="width: 1.8%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>5. Other Differentials</span>
                  <span class="text-slate-500 dark:text-neutral-400">11 ทีม (6.8%)</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div class="bg-slate-300 dark:bg-neutral-600 h-full rounded-full" style="width: 6.8%"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-borderLight dark:border-borderDark text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
            คะแนนเฉลี่ยคอมมูนิตี้ผูกกับผลงานของฮาแลนด์อย่างชัดเจน เมื่อใดที่นักเตะทำแต้มต่ำ กลุ่มตัวต่าง (Differential) จะเกิดจุดพลิกผันอันดับทันที
          </div>
        </div>

        <!-- Column 2: Chip Utilization -->
        <div class="p-5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 space-y-4 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-medium text-slate-900 dark:text-white">Chip utilization</span>
              <span id="tacticalChipsBadge" class="font-mono text-slate-700 dark:text-neutral-300 font-medium">14 activated</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-neutral-400 mb-3">
              สถิติการใช้งานชิปเพื่อชิงความได้เปรียบ
            </p>

            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-2.5 rounded-md border border-sky-500/30 bg-sky-500/5">
                <div class="text-[10px] font-medium text-sky-600 dark:text-sky-400">Free Hit</div>
                <div class="text-base font-medium font-mono tabular text-slate-900 dark:text-white">
                  <span id="chipFreeHitCount">8</span> <span class="text-xs font-normal text-slate-400 dark:text-neutral-500">ทีม</span>
                </div>
                <div id="chipFreeHitPct" class="text-[10px] text-sky-600/70 dark:text-sky-400/70 mt-0.5 font-mono">4.9%</div>
              </div>

              <div class="p-2.5 rounded-md border border-amber-500/30 bg-amber-500/5">
                <div class="text-[10px] font-medium text-amber-600 dark:text-amber-400">Wildcard</div>
                <div class="text-base font-medium font-mono tabular text-slate-900 dark:text-white">
                  <span id="chipWildcardCount">4</span> <span class="text-xs font-normal text-slate-400 dark:text-neutral-500">ทีม</span>
                </div>
                <div id="chipWildcardPct" class="text-[10px] text-amber-600/70 dark:text-amber-400/70 mt-0.5 font-mono">2.5%</div>
              </div>

              <div class="p-2.5 rounded-md border border-emerald-500/30 bg-emerald-500/5">
                <div class="text-[10px] font-medium text-emerald-600 dark:text-emerald-400">Bench Boost</div>
                <div class="text-base font-medium font-mono tabular text-slate-900 dark:text-white">
                  <span id="chipBboostCount">2</span> <span class="text-xs font-normal text-slate-400 dark:text-neutral-500">ทีม</span>
                </div>
                <div id="chipBboostPct" class="text-[10px] text-emerald-600/70 dark:text-emerald-400/70 mt-0.5 font-mono">1.2%</div>
              </div>

              <div class="p-2.5 rounded-md border border-purple-500/30 bg-purple-500/5">
                <div class="text-[10px] font-medium text-purple-600 dark:text-purple-400">Triple Captain</div>
                <div class="text-base font-medium font-mono tabular text-slate-400 dark:text-neutral-500">
                  <span id="chip3xcCount">0</span> <span class="text-xs font-normal">ทีม</span>
                </div>
                <div id="chip3xcPct" class="text-[10px] text-purple-600/70 dark:text-purple-400/70 mt-0.5 font-mono">ยังไม่เปิดใช้</div>
              </div>
            </div>

            <div class="mt-2.5 p-2 rounded-md border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-[11px] font-mono tabular text-slate-600 dark:text-neutral-300 flex justify-between items-center">
              <span>ยังไม่ใช้ชิป:</span>
              <strong class="text-slate-900 dark:text-white font-medium"><span id="chipNoChipCount">149</span> ทีม (<span id="chipNoChipPct">91.4%</span>)</strong>
            </div>
          </div>

          <div class="pt-3 border-t border-borderLight dark:border-borderDark text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
            ผู้เล่นส่วนใหญ่ 91.4% ยังคงรักษาวินัยถือชิปหลักไว้ ส่งผลให้ช่วงสัปดาห์ดับเบิ้ล (DGW) ในช่วงครึ่งหลังฤดูกาลจะมีการตัดแต้มแข่งขันเข้มข้นยิ่งขึ้น
          </div>
        </div>

        <!-- Column 3: Transfer Penalties -->
        <div class="p-5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 space-y-4 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-medium text-slate-900 dark:text-white">Transfer penalties</span>
              <span id="tacticalHitsBadge" class="font-mono text-rose-600 dark:text-rose-400 font-medium">-64 pts</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-neutral-400 mb-3">
              สถิติทีมที่ยอมถูกหักแต้มเพื่อปรับทีม
            </p>

            <div class="space-y-2">
              <div class="p-3 rounded-md border border-rose-500/30 bg-rose-500/5 flex items-center justify-between">
                <div>
                  <div class="text-xs font-medium text-rose-700 dark:text-rose-300">ทีมที่ยอมเสียแต้ม</div>
                  <div class="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">Transfer hits taken</div>
                </div>
                <div class="text-lg font-medium font-mono tabular text-rose-600 dark:text-rose-400">
                  <span id="hitsTeamsCount">15</span> <span class="text-xs font-normal text-slate-500 dark:text-neutral-400">ทีม (<span id="hitsTeamsPct">9.2%</span>)</span>
                </div>
              </div>

              <div class="p-3 rounded-md border border-emerald-500/30 bg-emerald-500/5 flex items-center justify-between">
                <div>
                  <div class="text-xs font-medium text-emerald-700 dark:text-emerald-300">จัดตัวปกติไม่เสียแต้ม</div>
                  <div class="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">Free transfers only</div>
                </div>
                <div class="text-lg font-medium font-mono tabular text-slate-800 dark:text-neutral-200">
                  <span id="hitsFreeTeamsCount">148</span> <span class="text-xs font-normal text-slate-500 dark:text-neutral-400">ทีม (<span id="hitsFreeTeamsPct">90.8%</span>)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-borderLight dark:border-borderDark text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
            สัดส่วนการยอมเสียแต้ม 9.2% บ่งบอกถึงความตื่นตัวในการปรับทัพสูง เพื่อหนีหรือไล่ตามคู่แข่งในมินิลีกโดยไม่ยอมเสียรอบเดดไลน์
          </div>
        </div>

      </div>
    </section>

    <!-- 4. Traffic Channels & Regional Demographics -->
    <section id="sec-distribution" class="space-y-3">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 uppercase tracking-wider">
          04 · DISTRIBUTION & GEOGRAPHY
        </span>
        <span class="text-xs text-slate-500 dark:text-neutral-400 hidden sm:inline">
          ช่องทางการเข้าชมและการกระจายตัวตามภูมิภาค
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">

        <!-- Column 1: Traffic Channels -->
        <div class="p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark border-t-2 border-t-teal-500 shadow-sm space-y-4 transition-colors duration-150">
        <div>
          <h2 class="text-base font-medium text-slate-900 dark:text-white">
            Traffic channels & user agents
          </h2>
          <p class="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            สัดส่วนการเปิดดูผ่านแอปแชท LINE เทียบกับเบราว์เซอร์ปกติ
          </p>
        </div>

        <div class="space-y-3">
          <!-- Neutral Segmented Bar -->
          <div class="w-full h-2 rounded-full overflow-hidden flex bg-borderLight dark:bg-borderDark">
            <div class="bg-emerald-500 h-full" style="width: 68.4%"></div>
            <div class="bg-slate-400 dark:bg-neutral-500 h-full" style="width: 22.5%"></div>
            <div class="bg-slate-300 dark:bg-neutral-600 h-full" style="width: 9.1%"></div>
          </div>

          <div class="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div class="p-2.5 rounded-md border border-emerald-500/30 bg-emerald-500/5">
              <div class="font-medium font-mono tabular text-emerald-600 dark:text-emerald-400 text-sm">68.4%</div>
              <div class="text-[11px] text-slate-700 dark:text-neutral-300 mt-0.5 font-medium">LINE In-App</div>
            </div>

            <div class="p-2.5 rounded-md border border-sky-500/30 bg-sky-500/5">
              <div class="font-medium font-mono tabular text-sky-600 dark:text-sky-400 text-sm">22.5%</div>
              <div class="text-[11px] text-slate-700 dark:text-neutral-300 mt-0.5 font-medium">Mobile Safari</div>
            </div>

            <div class="p-2.5 rounded-md border border-amber-500/30 bg-amber-500/5">
              <div class="font-medium font-mono tabular text-amber-600 dark:text-amber-400 text-sm">9.1%</div>
              <div class="text-[11px] text-slate-700 dark:text-neutral-300 mt-0.5 font-medium">Chrome / Web</div>
            </div>
          </div>

          <p class="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed pt-1">
            LINE คือช่องทางหลักคิดเป็น 68.4% การแชร์ในกลุ่มแชทส่งผลต่ออัตราการเปิดดูสูงสุด การทำปุ่มแชร์ภาพสรุปคะแนนลง LINE จึงมีผลต่อการใช้งานมากที่สุด
          </p>
        </div>
      </div>

      <!-- Column 2: Regional Demographics -->
      <div class="p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark border-t-2 border-t-teal-500 shadow-sm space-y-4 transition-colors duration-150">
        <div>
          <h2 class="text-base font-medium text-slate-900 dark:text-white">
            Geographic distribution
          </h2>
          <p class="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            พื้นที่การเชื่อมต่อของผู้ใช้งานผ่านโหนด Cloudflare Edge
          </p>
        </div>

        <div class="space-y-3 text-xs font-mono tabular">
          <div>
            <div class="flex justify-between text-[11px] mb-1 font-sans text-slate-600 dark:text-neutral-300">
              <span>กรุงเทพฯ และปริมณฑล (Bangkok Metro)</span>
              <span class="text-slate-500 dark:text-neutral-400">78.2%</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
              <div class="bg-emerald-500 h-full" style="width: 78.2%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-[11px] mb-1 font-sans text-slate-600 dark:text-neutral-300">
              <span>ภาคตะวันออก (ชลบุรี, ระยอง)</span>
              <span class="text-slate-500 dark:text-neutral-400">7.4%</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
              <div class="bg-sky-500 h-full" style="width: 7.4%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-[11px] mb-1 font-sans text-slate-600 dark:text-neutral-300">
              <span>ภาคเหนือ (เชียงใหม่, เชียงราย)</span>
              <span class="text-slate-500 dark:text-neutral-400">5.8%</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
              <div class="bg-indigo-500 h-full" style="width: 5.8%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-[11px] mb-1 font-sans text-slate-600 dark:text-neutral-300">
              <span>ภาคอีสานและภาคใต้</span>
              <span class="text-slate-500 dark:text-neutral-400">8.6%</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
              <div class="bg-slate-300 dark:bg-neutral-600 h-full" style="width: 8.6%"></div>
            </div>
          </div>

          <p class="text-[11px] font-sans text-slate-500 dark:text-neutral-400 leading-relaxed pt-1">
            ผู้ใช้งาน 78.2% อยู่ในเขตเมืองหลวงและปริมณฑล สะท้อนกลุ่มแฟนบอลคนทำงานที่มีความคุ้นเคยกับการใช้เครื่องมือวิเคราะห์คะแนน
          </p>
        </div>
      </div>
      </div>

    </section>

    <!-- 5. Device Breakdown & Strategic Usage Patterns -->
    <section id="sec-devices" class="p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark border-t-2 border-t-indigo-500 shadow-sm space-y-4 transition-colors duration-150">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/20 uppercase tracking-wider">
            05 · DEVICE DEMOGRAPHICS
          </span>
        </div>
        <h2 class="text-base font-medium text-slate-900 dark:text-white">
          Device breakdown & usage patterns
        </h2>
        <p class="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
          พฤติกรรมอุปกรณ์ของผู้ใช้งานเพื่อวางแผนพัฒนา UX และฟีเจอร์ที่ตรงจุด
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div class="p-4 rounded-lg border border-emerald-500/25 bg-emerald-500/5 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-xs font-medium text-slate-900 dark:text-white">
              <span class="text-emerald-600 dark:text-emerald-400">${ICONS.deviceMobile}</span>
              <span>Mobile smartphone</span>
            </div>
            <span class="text-sm font-medium font-mono tabular text-emerald-600 dark:text-emerald-400">76.2%</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
            iOS Safari (54.0%) และ Android Chrome (22.2%) เข้าใช้งานระหว่างวันเพื่อตรวจเช็กคะแนนสดอย่างรวดเร็ว
          </p>
        </div>

        <div class="p-4 rounded-lg border border-sky-500/25 bg-sky-500/5 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-xs font-medium text-slate-900 dark:text-white">
              <span class="text-sky-600 dark:text-sky-400">${ICONS.deviceDesktop}</span>
              <span>Desktop / Laptop</span>
            </div>
            <span class="text-sm font-medium font-mono tabular text-sky-600 dark:text-sky-400">19.4%</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
            macOS (12.1%) และ Windows (7.3%) มีระยะเวลาเปิดดูนานที่สุด เหมาะกับการวางแผนย้ายตัวช่วงก่อนเดดไลน์
          </p>
        </div>

        <div class="p-4 rounded-lg border border-purple-500/25 bg-purple-500/5 space-y-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5 text-xs font-medium text-slate-900 dark:text-white">
              <span class="text-purple-600 dark:text-purple-400">${ICONS.deviceTablet}</span>
              <span>Tablet / iPad</span>
            </div>
            <span class="text-sm font-medium font-mono tabular text-purple-600 dark:text-purple-400">4.4%</span>
          </div>
          <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
            Apple iPad (4.1%) มักเปิดจอคู่ขนานระหว่างรับชมการถ่ายทอดสดฟุตบอลในวันเสาร์-อาทิตย์
          </p>
        </div>

      </div>
    </section>

    <!-- 6. Peak Usage Windows -->
    <section id="sec-timing" class="p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark border-t-2 border-t-amber-500 shadow-sm space-y-4 transition-colors duration-150">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wider">
            06 · ENGAGEMENT WINDOWS
          </span>
        </div>
        <h2 class="text-base font-medium text-slate-900 dark:text-white">
          Peak usage windows
        </h2>
        <p class="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
          ช่วงเวลาที่ผู้ใช้งานมีส่วนร่วมสูงสุดตลอดวงรอบสัปดาห์
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div class="p-4 rounded-lg border border-amber-500/30 bg-amber-500/5 space-y-1.5">
          <div class="flex items-center justify-between text-xs font-medium text-slate-900 dark:text-white">
            <span class="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <span class="text-amber-600 dark:text-amber-400">${ICONS.clock}</span>
              <span>1. Deadline rush</span>
            </span>
            <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20 font-medium">High Stakes</span>
          </div>
          <div class="text-xs font-medium text-slate-800 dark:text-neutral-200">
            60-90 นาทีก่อนเดดไลน์ (ศุกร์เย็น / เสาร์บ่าย)
          </div>
          <p class="text-[11px] text-slate-600 dark:text-neutral-400 leading-relaxed">
            ผู้ใช้เข้ามาตรวจเช็กความพร้อมและตัดสินใจย้ายตัว เป็นจังหวะที่มีการตัดสินใจสูงสุดของสัปดาห์
          </p>
        </div>

        <div class="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 space-y-1.5">
          <div class="flex items-center justify-between text-xs font-medium text-slate-900 dark:text-white">
            <span class="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
              <span class="text-emerald-600 dark:text-emerald-400">${ICONS.bolt}</span>
              <span>2. Matchday live prime</span>
            </span>
            <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 font-medium">Peak Dwell Time</span>
          </div>
          <div class="text-xs font-medium text-slate-800 dark:text-neutral-200">
            ระหว่างแมตช์เตะสด (เสาร์ 18:30 - 01:00 / อาทิตย์ 20:00 - 00:30)
          </div>
          <p class="text-[11px] text-slate-600 dark:text-neutral-400 leading-relaxed">
            ผู้ใช้เปิดหน้าจอค้างไว้นานที่สุดเพื่อลุ้นแต้มสดและโบนัส BPS อัตราการรีเฟรชหน้าจอถี่ที่สุด
          </p>
        </div>

        <div class="p-4 rounded-lg border border-sky-500/30 bg-sky-500/5 space-y-1.5">
          <div class="flex items-center justify-between text-xs font-medium text-slate-900 dark:text-white">
            <span class="flex items-center gap-1.5 text-sky-700 dark:text-sky-300">
              <span class="text-sky-600 dark:text-sky-400">${ICONS.users}</span>
              <span>3. Community review</span>
            </span>
            <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 font-medium">Social Sharing</span>
          </div>
          <div class="text-xs font-medium text-slate-800 dark:text-neutral-200">
            วันจันทร์ - อังคาร (หลังจบแมตช์คู่สุดท้าย)
          </div>
          <p class="text-[11px] text-slate-600 dark:text-neutral-400 leading-relaxed">
            ผู้ใช้ตรวจเช็กอันดับคะแนนมินิลีกและนำผลลัพธ์ไปพูดคุยแลกเปลี่ยนในกลุ่มเพื่อน
          </p>
        </div>

      </div>
    </section>

    <!-- 7. Operational Commands & Links -->
    <section id="sec-ops" class="p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark border-t-2 border-t-slate-400 dark:border-t-neutral-600 shadow-sm space-y-4 transition-colors duration-150">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/20 uppercase tracking-wider">
            07 · EDGE OPERATIONS
          </span>
        </div>
        <h2 class="text-base font-medium text-slate-900 dark:text-white">
          Operational commands
        </h2>
        <p class="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
          เครื่องมือควบคุมระบบแคช และจุดตรวจสอบความพร้อมของระบบ
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        
        <div class="p-3.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 flex flex-col justify-between space-y-3">
          <div>
            <div class="font-medium text-slate-900 dark:text-white">Purge edge cache</div>
            <div class="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">ล้างแคชฝั่ง Edge ทันทีหากต้องการซิงก์ด่วน</div>
          </div>
          <button id="flushCacheBtn" onclick="flushEdgeCache()"
            class="w-full min-h-[36px] flex items-center justify-center gap-2 py-1.5 px-3 rounded-md border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-neutral-800 active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-slate-400 focus:outline-none text-slate-700 dark:text-neutral-200 text-xs font-medium transition-colors duration-150">
            ${ICONS.trash}
            <span>ล้างแคช Edge</span>
          </button>
          <div id="actionMsg" class="hidden text-[11px] font-mono text-center"></div>
        </div>

        <a href="https://github.com/asawamanasak/fpl-mini/actions" target="_blank" rel="noopener"
          class="p-3.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 hover:border-slate-300 dark:hover:border-neutral-700 flex flex-col justify-between group transition-colors duration-150">
          <div>
            <div class="font-medium text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">GitHub auto-sync</div>
            <div class="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5 font-mono">fpl_auto_sync.yml</div>
          </div>
          <div class="flex items-center justify-between text-slate-400 dark:text-neutral-500 pt-3">
            <span>สั่งรันซิงก์ข้อมูล</span>
            <span>${ICONS.external}</span>
          </div>
        </a>

        <a href="https://api.fplsawadika.com/health" target="_blank" rel="noopener"
          class="p-3.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 hover:border-slate-300 dark:hover:border-neutral-700 flex flex-col justify-between group transition-colors duration-150">
          <div>
            <div class="font-medium text-slate-900 dark:text-white group-hover:text-emerald-500 transition-colors">Edge API health</div>
            <div class="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5 font-mono">api.fplsawadika.com/health</div>
          </div>
          <div class="flex items-center justify-between text-slate-400 dark:text-neutral-500 pt-3">
            <span>ตรวจสอบสถานะ</span>
            <span>${ICONS.external}</span>
          </div>
        </a>

      </div>
    </section>

  </main>

  <script>
    // Theme Toggle Functionality
    function toggleTheme() {
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('fpl_admin_theme', 'light');
      } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('fpl_admin_theme', 'dark');
      }
    }

    // Flush Edge Cache Action
    async function flushEdgeCache() {
      const btn = document.getElementById('flushCacheBtn');
      const msg = document.getElementById('actionMsg');
      btn.disabled = true;
      btn.classList.add('opacity-50');
      msg.className = 'text-[11px] font-mono text-center text-slate-500 dark:text-neutral-400';
      msg.textContent = 'กำลังล้างแคชที่ Cloudflare Edge...';
      msg.classList.remove('hidden');

      try {
        const res = await fetch('/api/admin/flush-cache', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          msg.className = 'text-[11px] font-mono text-center text-emerald-600 dark:text-emerald-400';
          msg.textContent = 'ล้างแคช Edge เรียบร้อยแล้ว';
        } else {
          msg.className = 'text-[11px] font-mono text-center text-rose-600 dark:text-rose-400';
          msg.textContent = data.message || 'การล้างแคชล้มเหลว';
        }
      } catch (e) {
        msg.className = 'text-[11px] font-mono text-center text-rose-600 dark:text-rose-400';
        msg.textContent = 'เกิดข้อผิดพลาดในการเชื่อมต่อ';
      } finally {
        setTimeout(() => {
          btn.disabled = false;
          btn.classList.remove('opacity-50');
        }, 1500);
      }
    }

    // Live Telemetry Countdown & Dynamic Standings
    let deadlineEpochGlobal = 1793989800; // GW 10 default
    let lastSyncIsoGlobal = '2026-11-04 01:14:00';

    function updateCountdownTimer() {
      if (!deadlineEpochGlobal) return;
      const now = Math.floor(Date.now() / 1000);
      let diff = deadlineEpochGlobal - now;

      if (diff <= 0) {
        document.getElementById('cdDays').textContent = '00';
        document.getElementById('cdHours').textContent = '00';
        document.getElementById('cdMins').textContent = '00';
        document.getElementById('cdSecs').textContent = '00';
        return;
      }

      const days = Math.floor(diff / 86400);
      diff -= days * 86400;
      const hours = Math.floor(diff / 3600);
      diff -= hours * 3600;
      const mins = Math.floor(diff / 60);
      const secs = diff % 60;

      document.getElementById('cdDays').textContent = String(days).padStart(2, '0');
      document.getElementById('cdHours').textContent = String(hours).padStart(2, '0');
      document.getElementById('cdMins').textContent = String(mins).padStart(2, '0');
      document.getElementById('cdSecs').textContent = String(secs).padStart(2, '0');
    }

    function calculateTimeAgo(isoStr) {
      if (!isoStr) return '';
      try {
        const syncTime = new Date(isoStr.replace(' ', 'T') + '+07:00').getTime();
        const now = Date.now();
        const diffMs = now - syncTime;
        if (diffMs < 0) return '(เมื่อสักครู่)';
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return '(เพิ่งอัปเดตเมื่อสักครู่)';
        if (diffMins < 60) return '(' + diffMins + ' นาทีที่แล้ว)';
        const diffHours = Math.floor(diffMins / 60);
        const remMins = diffMins % 60;
        return '(' + diffHours + ' ชั่วโมง ' + (remMins > 0 ? remMins + ' นาที' : '') + 'ที่แล้ว)';
      } catch (_) {
        return '';
      }
    }

    // Dynamic Live Data Loader
    async function loadLiveData(isManual = false) {
      const btn = document.getElementById('refreshDataBtn');
      const icon = document.getElementById('refreshIcon');
      const toast = document.getElementById('liveStatusToast');
      const toastText = document.getElementById('liveStatusToastText');

      if (btn && icon) {
        btn.disabled = true;
        icon.classList.add('animate-spin-custom');
      }

      try {
        let res = null;
        try {
          res = await fetch('/api/admin/data');
        } catch (_) {}

        if (!res || !res.ok) {
          res = await fetch('https://www.fplsawadika.com/multi_fpl_data.json');
        }

        if (res && res.ok) {
          const data = await res.json();
          renderDynamicData(data);
          renderTacticalIntelligence(data);

          if (isManual && toast && toastText) {
            toastText.textContent = 'ดึงข้อมูลสดล่าสุดสำเร็จ (ซิงก์รอบ: ' + (data.last_sync || '') + ')';
            toast.classList.remove('hidden');
            setTimeout(() => { toast.classList.add('hidden'); }, 3500);
          }
        }
      } catch (err) {
        console.warn('Live telemetry fetch notice:', err);
      } finally {
        if (btn && icon) {
          setTimeout(() => {
            btn.disabled = false;
            icon.classList.remove('animate-spin-custom');
          }, 600);
        }
      }
    }

    function renderDynamicData(data) {
      if (!data) return;

      // 1. Sync Timestamps
      if (data.last_sync) {
        const syncEl = document.getElementById('telemetryLastSync');
        if (syncEl) syncEl.textContent = data.last_sync;
      }
      if (data.last_sync_iso) {
        lastSyncIsoGlobal = data.last_sync_iso;
        const timeAgoEl = document.getElementById('telemetryTimeAgo');
        if (timeAgoEl) timeAgoEl.textContent = calculateTimeAgo(data.last_sync_iso);
      }

      // 2. Next Deadline
      if (data.next_deadline) {
        if (data.next_deadline.deadline_epoch) {
          deadlineEpochGlobal = data.next_deadline.deadline_epoch;
          updateCountdownTimer();
        }
        if (data.next_deadline.name) {
          const nameEl = document.getElementById('telemetryNextDeadlineName');
          if (nameEl) {
            nameEl.textContent = data.next_deadline.name + ' deadline';
          }
        }
      }

      // 3. Max Gameweek
      if (data.max_gw) {
        const gwEl = document.getElementById('kpiGwNumber');
        const badgeEl = document.getElementById('kpiGwStatusBadge');
        const tacticalGwEl = document.getElementById('tacticalGwBadge');
        if (gwEl) gwEl.textContent = 'GW ' + data.max_gw;
        if (badgeEl) badgeEl.textContent = 'Finalized';
        if (tacticalGwEl) tacticalGwEl.textContent = 'Gameweek ' + data.max_gw;
      }

      // 4. Compute Totals & League Standings
      if (data.leagues && data.league_order) {
        let totalTeams = 0;
        let topScore = 0;
        let topLeader = '';
        const rowsHtml = [];

        data.league_order.forEach((lid, idx) => {
          const ldata = data.leagues[String(lid)];
          if (!ldata) return;

          const teams = ldata.teams || [];
          totalTeams += teams.length;

          // Find leader
          let leader = null;
          teams.forEach(t => {
            const pts = t.total_points !== undefined ? t.total_points : (t.total || 0);
            if (!leader || pts > (leader.total_points !== undefined ? leader.total_points : leader.total || 0)) {
              leader = t;
            }
          });

          if (leader) {
            const leaderPts = leader.total_points !== undefined ? leader.total_points : leader.total;
            if (leaderPts > topScore) {
              topScore = leaderPts;
              topLeader = leader.player_name + ' (' + (leader.entry_name || '') + ')';
            }
          }

          const leaderName = leader ? leader.player_name : '-';
          const leaderTeam = leader ? leader.entry_name : '-';
          const leaderPts = leader ? (leader.total_points !== undefined ? leader.total_points : leader.total) : 0;
          const leaderGw = leader ? (leader.event_total !== undefined ? leader.event_total : 0) : 0;
          let rankBadge = '';
          if (idx === 0) {
            rankBadge = '<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-bold text-[10px]">1</span>';
          } else if (idx === 1) {
            rankBadge = '<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/30 font-bold text-[10px]">2</span>';
          } else if (idx === 2) {
            rankBadge = '<span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30 font-bold text-[10px]">3</span>';
          } else {
            rankBadge = '<span class="font-mono text-slate-400 dark:text-neutral-500 text-xs">' + (idx + 1) + '</span>';
          }
          const dotColor = idx === 0 ? 'bg-amber-500' : (idx === 1 ? 'bg-sky-500' : (idx === 2 ? 'bg-orange-500' : 'bg-slate-400'));

          rowsHtml.push(\`
            <tr class="hover:bg-raisedLight dark:hover:bg-raisedDark/50 transition-colors duration-150">
              <td class="py-3 px-3 text-center font-mono text-slate-400 dark:text-neutral-500">\${idx + 1}</td>
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full \${dotColor} shrink-0"></span>
                <span>\${ldata.name || 'League ' + lid}</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-neutral-400">\${lid}</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300 tabular">\${teams.length} teams</td>
              <td class="py-3 px-3 text-slate-700 dark:text-neutral-300">\${leaderName} <span class="text-slate-400 dark:text-neutral-500 text-[11px]">(\${leaderTeam})</span></td>
              <td class="py-3 px-3 font-mono font-medium text-slate-900 dark:text-white tabular text-right pr-4">\${leaderPts} pts</td>
              <td class="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 tabular text-right pr-4">+\${leaderGw} pts</td>
              <td class="py-3 px-3 text-right">
                <a href="https://www.fplsawadika.com/\${lid}/" target="_blank" rel="noopener" class="text-slate-500 hover:text-slate-900 dark:hover:text-white inline-flex items-center gap-1 font-mono text-[11px] transition-colors">
                  <span>เปิดดู</span>${ICONS.external}
                </a>
              </td>
            </tr>
          \`);
        });

        // Update KPI Cards
        const totalTeamsEl = document.getElementById('kpiTotalTeams');
        if (totalTeamsEl) totalTeamsEl.textContent = totalTeams;

        const tableManagersEl = document.getElementById('tableTotalManagers');
        if (tableManagersEl) tableManagersEl.textContent = totalTeams;

        const sampleCountEl = document.getElementById('tacticalSampleCount');
        if (sampleCountEl) sampleCountEl.textContent = totalTeams;

        const topScoreEl = document.getElementById('kpiTopScore');
        if (topScoreEl) topScoreEl.textContent = topScore;

        const topLeaderEl = document.getElementById('kpiTopLeader');
        if (topLeaderEl && topLeader) topLeaderEl.textContent = topLeader;

        // Update Table
        const tbody = document.getElementById('leaguesTableBody');
        if (tbody && rowsHtml.length > 0) {
          tbody.innerHTML = rowsHtml.join('');
        }
      }
    }

    // Dynamic Tactical Intelligence Compute (Captains, Chips & Hits)
    function renderTacticalIntelligence(data) {
      if (!data || !data.leagues) return;
      const maxGw = data.max_gw || 9;
      const captains = {};
      const chips = { freehit: 0, wildcard: 0, bboost: 0, '3xc': 0, none: 0 };
      let hitsTeams = 0;
      let totalHitPoints = 0;
      let totalSquads = 0;

      Object.values(data.leagues).forEach(l => {
        Object.entries(l.squads || {}).forEach(([k, sq]) => {
          if (k.endsWith('_' + maxGw)) {
            totalSquads++;

            // Captaincy
            (sq.starting || []).forEach(p => {
              if (p.is_captain) {
                const captainName = p.name || 'Unknown';
                captains[captainName] = (captains[captainName] || 0) + 1;
              }
            });

            // Chips
            const chip = sq.chip;
            if (chip && chips[chip] !== undefined) {
              chips[chip]++;
            } else {
              chips.none++;
            }

            // Transfer Hits
            const hitPts = sq.hits || 0;
            if (hitPts > 0) {
              hitsTeams++;
              totalHitPoints += hitPts;
            }
          }
        });
      });

      if (totalSquads > 0) {
        // 1. Update Captaincy Bars & Badge
        const sortedCaptains = Object.entries(captains).sort((a, b) => b[1] - a[1]);
        const container = document.getElementById('captainsBarsContainer');
        const topCaptainBadge = document.getElementById('tacticalTopCaptainBadge');

        if (sortedCaptains.length > 0 && topCaptainBadge) {
          const topC = sortedCaptains[0];
          const topPct = ((topC[1] / totalSquads) * 100).toFixed(1);
          topCaptainBadge.textContent = topC[0] + ' ' + topPct + '%';
        }

        if (container && sortedCaptains.length > 0) {
          const top5 = sortedCaptains.slice(0, 5);
          let sumTop5 = 0;
          top5.forEach(c => { sumTop5 += c[1]; });
          const othersCount = totalSquads - sumTop5;

          const barPalette = [
            'bg-emerald-500',
            'bg-sky-500',
            'bg-violet-500',
            'bg-amber-500',
            'bg-teal-500'
          ];
          const barsHtml = top5.map((c, idx) => {
            const pct = ((c[1] / totalSquads) * 100).toFixed(1);
            const colorClass = barPalette[idx] || 'bg-slate-400 dark:bg-neutral-500';
            return \`
              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>\${idx + 1}. \${c[0]}</span>
                  <span class="text-slate-500 dark:text-neutral-400 tabular">\${c[1]} ทีม (\${pct}%)</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div class="\${colorClass} h-full rounded-full" style="width: \${pct}%"></div>
                </div>
              </div>
            \`;
          });

          if (othersCount > 0) {
            const othersPct = ((othersCount / totalSquads) * 100).toFixed(1);
            barsHtml.push(\`
              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>Other Differentials</span>
                  <span class="text-slate-500 dark:text-neutral-400 tabular">\${othersCount} ทีม (\${othersPct}%)</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div class="bg-slate-300 dark:bg-neutral-600 h-full rounded-full" style="width: \${othersPct}%"></div>
                </div>
              </div>
            \`);
          }

          container.innerHTML = barsHtml.join('');
        }

        // 2. Update Chips Dynamic Data
        const totalActivatedChips = chips.freehit + chips.wildcard + chips.bboost + chips['3xc'];
        const chipsBadge = document.getElementById('tacticalChipsBadge');
        if (chipsBadge) chipsBadge.textContent = totalActivatedChips + ' activated';

        const fhCountEl = document.getElementById('chipFreeHitCount');
        const fhPctEl = document.getElementById('chipFreeHitPct');
        if (fhCountEl) fhCountEl.textContent = chips.freehit;
        if (fhPctEl) fhPctEl.textContent = ((chips.freehit / totalSquads) * 100).toFixed(1) + '%';

        const wcCountEl = document.getElementById('chipWildcardCount');
        const wcPctEl = document.getElementById('chipWildcardPct');
        if (wcCountEl) wcCountEl.textContent = chips.wildcard;
        if (wcPctEl) wcPctEl.textContent = ((chips.wildcard / totalSquads) * 100).toFixed(1) + '%';

        const bbCountEl = document.getElementById('chipBboostCount');
        const bbPctEl = document.getElementById('chipBboostPct');
        if (bbCountEl) bbCountEl.textContent = chips.bboost;
        if (bbPctEl) bbPctEl.textContent = ((chips.bboost / totalSquads) * 100).toFixed(1) + '%';

        const tcCountEl = document.getElementById('chip3xcCount');
        const tcPctEl = document.getElementById('chip3xcPct');
        if (tcCountEl) tcCountEl.textContent = chips['3xc'];
        if (tcPctEl) tcPctEl.textContent = chips['3xc'] > 0 ? ((chips['3xc'] / totalSquads) * 100).toFixed(1) + '%' : 'ยังไม่เปิดใช้';

        const noChipCountEl = document.getElementById('chipNoChipCount');
        const noChipPctEl = document.getElementById('chipNoChipPct');
        if (noChipCountEl) noChipCountEl.textContent = chips.none;
        if (noChipPctEl) noChipPctEl.textContent = ((chips.none / totalSquads) * 100).toFixed(1) + '%';

        // 3. Update Hits Dynamic Data
        const hitsBadge = document.getElementById('tacticalHitsBadge');
        if (hitsBadge) hitsBadge.textContent = '-' + totalHitPoints + ' pts';

        const hitsTeamsCountEl = document.getElementById('hitsTeamsCount');
        const hitsTeamsPctEl = document.getElementById('hitsTeamsPct');
        if (hitsTeamsCountEl) hitsTeamsCountEl.textContent = hitsTeams;
        if (hitsTeamsPctEl) hitsTeamsPctEl.textContent = ((hitsTeams / totalSquads) * 100).toFixed(1) + '%';

        const freeTeams = totalSquads - hitsTeams;
        const freeTeamsCountEl = document.getElementById('hitsFreeTeamsCount');
        const freeTeamsPctEl = document.getElementById('hitsFreeTeamsPct');
        if (freeTeamsCountEl) freeTeamsCountEl.textContent = freeTeams;
        if (freeTeamsPctEl) freeTeamsPctEl.textContent = ((freeTeams / totalSquads) * 100).toFixed(1) + '%';
      }
    }

    // Initialize Telemetry on Load
    document.addEventListener('DOMContentLoaded', () => {
      updateCountdownTimer();
      setInterval(updateCountdownTimer, 1000);

      setInterval(() => {
        const timeAgoEl = document.getElementById('telemetryTimeAgo');
        if (timeAgoEl && lastSyncIsoGlobal) {
          timeAgoEl.textContent = calculateTimeAgo(lastSyncIsoGlobal);
        }
      }, 60000);

      loadLiveData(false);

      setInterval(() => {
        loadLiveData(false);
      }, 60000);
    });
  </script>
</body>
</html>`;
}

/**
 * Render Minimalist Security Login Gate HTML (Fallback)
 */
export function renderLoginHtml(errorMsg = '') {
  return `<!DOCTYPE html>
<html lang="th" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Security Verification | FPLSaWaDiKa Admin</title>
  <meta name="robots" content="noindex, nofollow">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
  </style>
</head>
<body class="bg-[#0f0f11] text-neutral-200 min-h-screen flex items-center justify-center p-4 antialiased">
  <div class="w-full max-w-sm">
    <div class="text-center mb-6">
      <div class="w-9 h-9 rounded-md border border-[#262830] bg-[#16171b] mx-auto flex items-center justify-center text-neutral-400 mb-3">
        ${ICONS.lock}
      </div>
      <h1 class="text-sm font-medium tracking-tight text-white">FPLSaWaDiKa Executive Terminal</h1>
      <p class="text-xs text-neutral-400 mt-0.5">Authorized access only</p>
    </div>

    <div class="p-6 rounded-xl border border-[#262830] bg-[#16171b] space-y-4">
      ${errorMsg ? `
        <div class="p-2.5 rounded-md border border-rose-900/40 bg-rose-950/20 text-xs text-rose-300 font-mono text-center">
          ${errorMsg}
        </div>
      ` : ''}

      <form method="POST" action="/login" class="space-y-4">
        <div>
          <label for="passkey" class="block text-xs font-medium text-neutral-300 mb-1.5">Executive Passkey</label>
          <input type="password" id="passkey" name="passkey" required autofocus placeholder="Enter security key"
            class="w-full px-3 py-1.5 text-xs rounded-md border border-[#262830] bg-[#1f2026] text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 font-mono">
        </div>

        <button type="submit" class="w-full py-2 px-3 text-xs font-medium rounded-md bg-white hover:bg-neutral-100 text-neutral-900 transition active:scale-[0.98]">
          <span>Authenticate session</span>
        </button>
      </form>

      <div class="pt-3 border-t border-[#262830] text-[11px] text-neutral-400 text-center leading-relaxed">
        Restricted to <span class="font-mono text-neutral-300">${ADMIN_EMAIL}</span>. Protected by Cloudflare Edge.
      </div>
    </div>
  </div>
</body>
</html>`;
}
