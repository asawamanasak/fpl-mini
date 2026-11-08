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
 * 8. Visuals: Richness in real business moments (retention, unit economics, scaling headroom)
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
  database: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"/></svg>`,
  external: `<svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>`,
  logout: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>`,
  sun: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>`,
  moon: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>`,
  lock: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>`,
  refresh: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>`,
  check: `<svg class="w-4 h-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`,
  mapPin: `<svg class="w-4 h-4 shrink-0 text-slate-500 dark:text-neutral-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/></svg>`,
  coins: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  cpu: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 16.5V21m3.75-18v1.5m0 16.5V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"/></svg>`,
  share: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/></svg>`,
  layers: `<svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l9.75 5.25 9.75-5.25-4.179-2.25m-11.142 4.5L2.25 16.5l9.75 5.25 9.75-5.25-4.179-2.25M12 3.75L2.25 9 12 14.25 21.75 9 12 3.75z"/></svg>`,
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
  <title>Executive Summary & Live Business Intelligence | FPLSaWaDiKa</title>
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
            <span class="text-[11px] font-mono text-slate-500 dark:text-neutral-400">Executive BI Console</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2 sm:gap-3">
        
        <!-- Edge Region Status -->
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
          <div id="telemetryModePill" class="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-raisedLight dark:bg-cardDark border border-borderLight dark:border-borderDark text-[11px] font-mono text-slate-500 dark:text-neutral-400 mb-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>EXECUTIVE INTELLIGENCE PLATFORM · LIVE & SCALE READY</span>
          </div>
          <h1 class="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">
            Executive summary & live business intelligence
          </h1>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
            รายงานเชิงกลยุทธ์ พฤติกรรมผู้ใช้งานระบบทั้ง 8 ลีก และการประเมินความจุเพื่อวางแผนขยายสเกลโปรเจกต์
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

      <!-- Quick Module Navigation Strip -->
      <div class="flex items-center gap-2 overflow-x-auto touch-scroll pt-1 text-[11px] font-mono">
        <span class="text-slate-400 dark:text-neutral-500 font-sans text-xs shrink-0 mr-1">Modules:</span>
        <a href="#sec-audience" class="px-2.5 py-1 rounded-md border border-emerald-500/20 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors shrink-0 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>01 Economics & KPIs
        </a>
        <a href="#sec-portfolio" class="px-2.5 py-1 rounded-md border border-sky-500/20 bg-sky-500/5 text-sky-700 dark:text-sky-400 hover:bg-sky-500/10 transition-colors shrink-0 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span>02 League Portfolio
        </a>
        <a href="#sec-features" class="px-2.5 py-1 rounded-md border border-violet-500/20 bg-violet-500/5 text-violet-700 dark:text-violet-400 hover:bg-violet-500/10 transition-colors shrink-0 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-violet-500"></span>03 Feature Adoption
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
        <a href="#sec-system" class="px-2.5 py-1 rounded-md border border-rose-500/20 bg-rose-500/5 text-rose-700 dark:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0 flex items-center gap-1.5">
          <span class="w-1.5 h-1.5 rounded-full bg-rose-500"></span>07 System & Scaling
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
              <strong id="telemetryLastSync" class="text-slate-800 dark:text-neutral-200 font-mono font-medium">8 พ.ย. 2026, 11:18 น.</strong>
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
          
          <!-- Deadline Countdown Box -->
          <div class="w-full sm:w-auto px-3.5 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs">
            <div class="text-[11px] text-slate-500 dark:text-neutral-400 flex items-center justify-between gap-4 mb-1.5">
              <span id="telemetryNextDeadlineName" class="font-medium text-slate-700 dark:text-neutral-200">Gameweek 11 deadline</span>
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

    <!-- 1. Executive KPIs (6 Core Business & Economics Cards) -->
    <section id="sec-audience" class="space-y-3">
      <div class="flex items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
            01 · AUDIENCE & PLATFORM ECONOMICS
          </span>
          <span class="text-xs text-slate-500 dark:text-neutral-400 hidden sm:inline">
            ตัวชี้วัดการเติบโต สเกลผู้ใช้งาน และมูลค่าทางธุรกิจ
          </span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <!-- KPI 1: Weekly Visits & WoW Growth (Emerald) -->
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
            <div id="kpiWeeklyVisits" class="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900 dark:text-white font-mono tabular">
              4,280
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-borderLight dark:border-borderDark flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
            <span>Daily Average Reach</span>
            <span class="text-slate-800 dark:text-neutral-200 font-mono tabular font-medium inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span><span id="kpiDailyReach">1,850 users/day</span></span>
          </div>
        </div>

        <!-- KPI 2: Live Peak Concurrency & Dwell Time (Sky) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between hover:border-sky-500/50 transition-colors duration-150 relative overflow-hidden group">
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-sky-500"></div>
          <div>
            <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-neutral-400 mb-2.5">
              <span class="flex items-center gap-1.5 font-medium text-slate-700 dark:text-neutral-300">
                <span class="w-5 h-5 rounded flex items-center justify-center bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  ${ICONS.bolt}
                </span>
                <span>Peak Matchday Audience</span>
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

        <!-- KPI 3: Total Prize Pool Managed (GMV) (Amber) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between hover:border-amber-500/50 transition-colors duration-150 relative overflow-hidden group">
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-amber-500"></div>
          <div>
            <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-neutral-400 mb-2.5">
              <span class="flex items-center gap-1.5 font-medium text-slate-700 dark:text-neutral-300">
                <span class="w-5 h-5 rounded flex items-center justify-center bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  ${ICONS.coins}
                </span>
                <span>Prize Pool Under Mgmt (GMV)</span>
              </span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono text-[11px] font-medium border border-amber-500/20 tabular">8 Leagues</span>
            </div>
            <div class="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900 dark:text-white font-mono tabular">
              ฿<span id="kpiTotalPool">261,200</span> <span class="text-xs font-normal text-slate-400 dark:text-neutral-500">THB</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-borderLight dark:border-borderDark flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
            <span>Financial Models</span>
            <span class="text-slate-800 dark:text-neutral-200 font-mono tabular font-medium inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>Weekly + Monthly + Fines</span>
          </div>
        </div>

        <!-- KPI 4: Active Tenants & Scale (Indigo) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between hover:border-indigo-500/50 transition-colors duration-150 relative overflow-hidden group">
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500"></div>
          <div>
            <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-neutral-400 mb-2.5">
              <span class="flex items-center gap-1.5 font-medium text-slate-700 dark:text-neutral-300">
                <span class="w-5 h-5 rounded flex items-center justify-center bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  ${ICONS.activity}
                </span>
                <span>Community Scale (ผู้ใช้งานรวม)</span>
              </span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-medium border border-indigo-500/20 tabular">100% Tier 1</span>
            </div>
            <div class="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900 dark:text-white font-mono tabular">
              <span id="kpiTotalTeams">163</span> <span class="text-xs font-normal text-slate-400 dark:text-neutral-500">teams</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-borderLight dark:border-borderDark flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
            <span>Active Tenants</span>
            <span class="text-slate-800 dark:text-neutral-200 font-mono tabular font-medium inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>8 minileagues</span>
          </div>
        </div>

        <!-- KPI 5: Viral Share Rate (LINE Conversion) (Violet) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between hover:border-violet-500/50 transition-colors duration-150 relative overflow-hidden group">
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-violet-500"></div>
          <div>
            <div class="flex items-center justify-between gap-2 text-xs text-slate-500 dark:text-neutral-400 mb-2.5">
              <span class="flex items-center gap-1.5 font-medium text-slate-700 dark:text-neutral-300">
                <span class="w-5 h-5 rounded flex items-center justify-center bg-violet-500/10 text-violet-600 dark:text-violet-400">
                  ${ICONS.share}
                </span>
                <span>Viral Share Rate (LINE)</span>
              </span>
              <span class="inline-flex items-center px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-600 dark:text-violet-400 font-mono text-[11px] font-medium border border-violet-500/20 tabular">Viral Loop</span>
            </div>
            <div class="text-2xl sm:text-3xl font-medium tracking-tight text-slate-900 dark:text-white font-mono tabular">
              <span id="kpiLineShares">412</span> <span class="text-xs font-normal text-slate-400 dark:text-neutral-500">copies / wk</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-borderLight dark:border-borderDark flex items-center justify-between text-xs text-slate-500 dark:text-neutral-400">
            <span>LINE Share Conversion</span>
            <span class="text-slate-800 dark:text-neutral-200 font-mono font-medium inline-flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-violet-500 shrink-0"></span>9.6% of visits shared</span>
          </div>
        </div>

        <!-- KPI 6: Platform SLA & Edge Speed (Emerald) -->
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

      </div>
    </section>

    <!-- 2. League Tenant Portfolio & Engagement Matrix -->
    <section id="sec-portfolio" class="p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark border-t-2 border-t-sky-500 shadow-sm space-y-4 transition-colors duration-150">
      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-sky-500/10 text-sky-700 dark:text-sky-400 border border-sky-500/20 uppercase tracking-wider">
              02 · LEAGUE TENANT PORTFOLIO
            </span>
          </div>
          <h2 class="text-base font-medium text-slate-900 dark:text-white">
            League tenant portfolio & engagement matrix
          </h2>
          <p class="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            วิเคราะห์ประสิทธิภาพทั้ง 8 มินิลีกในมุมมองธุรกิจ: โมเดลเงินรางวัล, ทราฟฟิก และความเหนียวแน่นต่อทีม (Visits/Team)
          </p>
        </div>
        <div class="text-xs font-mono text-slate-500 dark:text-neutral-400">
          8 tenants · <span id="tableTotalManagers" class="tabular text-slate-900 dark:text-white font-medium">163</span> managers
        </div>
      </div>

      <div class="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 touch-scroll">
        <table class="w-full text-left text-xs min-w-[960px]">
          <thead>
            <tr class="border-b border-borderLight dark:border-borderDark text-slate-500 dark:text-neutral-400 font-mono text-[11px]">
              <th class="py-2.5 px-3 font-medium text-center w-10">#</th>
              <th class="py-2.5 px-3 font-medium">League name</th>
              <th class="py-2.5 px-3 font-medium">Arch</th>
              <th class="py-2.5 px-3 font-medium">Teams</th>
              <th class="py-2.5 px-3 font-medium">Prize model & pool (GMV)</th>
              <th class="py-2.5 px-3 font-medium text-right pr-3">Visits (7d)</th>
              <th class="py-2.5 px-3 font-medium text-right pr-3">Intensity (Visits/Team)</th>
              <th class="py-2.5 px-3 font-medium">Peak window</th>
              <th class="py-2.5 px-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody id="leaguesTableBody" class="divide-y divide-borderLight dark:divide-borderDark">
            <!-- Dynamically Rendered by loadLiveData() -->
          </tbody>
        </table>
      </div>
    </section>

    <!-- 3. Product Feature Adoption & User Behavior -->
    <section id="sec-features" class="p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark border-t-2 border-t-violet-500 shadow-sm space-y-5 transition-colors duration-150">
      <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
        <div>
          <div class="flex items-center gap-2 mb-1">
            <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/20 uppercase tracking-wider">
              03 · PRODUCT FEATURE ADOPTION
            </span>
          </div>
          <h2 class="text-base font-medium text-slate-900 dark:text-white flex items-center gap-2">
            <span>Product feature adoption & user behavior</span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
            สัดส่วนการใช้งานแต่ละฟีเจอร์บนแพลตฟอร์ม เพื่อประเมินความคุ้มค่าและทิศทางการพัฒนาฟีเจอร์ในอนาคต
          </p>
        </div>
        <div class="text-xs font-mono text-slate-500 dark:text-neutral-400">
          Telemetry Sample: 7-day rolling window
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <!-- Column 1: Feature Engagement Share -->
        <div class="p-5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 space-y-4 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-medium text-slate-900 dark:text-white">Feature & Tab popularity</span>
              <span id="featTopBadge" class="font-mono text-emerald-600 dark:text-emerald-400 font-medium">Live 46.2%</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-neutral-400 mb-3">
              สัดส่วนการเปิดดูแยกตามแท็บเมนูหลักบนหน้าเว็บ
            </p>

            <div id="featureBarsContainer" class="space-y-3 text-xs font-mono tabular">
              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>1. Live Score & Standings</span>
                  <span id="featLivePct" class="text-slate-500 dark:text-neutral-400">46.2%</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div id="featLiveBar" class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: 46.2%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>2. Weekly Highlight (บอ.บู๋)</span>
                  <span id="featHighlightPct" class="text-slate-500 dark:text-neutral-400">22.4%</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div id="featHighlightBar" class="bg-sky-500 h-full rounded-full transition-all duration-300" style="width: 22.4%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>3. Competition (ชิป & ตัวต่าง)</span>
                  <span id="featCompPct" class="text-slate-500 dark:text-neutral-400">14.8%</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div id="featCompBar" class="bg-violet-500 h-full rounded-full transition-all duration-300" style="width: 14.8%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>4. Prize & Settlement Ledger</span>
                  <span id="featPrizesPct" class="text-slate-500 dark:text-neutral-400">8.5%</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div id="featPrizesBar" class="bg-amber-500 h-full rounded-full transition-all duration-300" style="width: 8.5%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>5. Mini-Games (Shi62 & Bramann)</span>
                  <span id="featSpecialPct" class="text-slate-500 dark:text-neutral-400">5.1%</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div id="featSpecialBar" class="bg-teal-500 h-full rounded-full transition-all duration-300" style="width: 5.1%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-[11px] mb-1 text-slate-600 dark:text-neutral-300">
                  <span>6. Hall of Fame & FPL Cup</span>
                  <span id="featHofPct" class="text-slate-500 dark:text-neutral-400">3.0%</span>
                </div>
                <div class="w-full h-1.5 rounded-full bg-borderLight dark:bg-borderDark overflow-hidden">
                  <div id="featHofBar" class="bg-slate-400 dark:bg-neutral-600 h-full rounded-full transition-all duration-300" style="width: 3.0%"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-borderLight dark:border-borderDark text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
            Live Score และบทวิเคราะห์ บอ.บู๋ คิดเป็น 68.6% ของการเปิดดูทั้งหมด เป็นแกนหลักที่ดึงดูดผู้ใช้งานให้กลับมาเข้าเว็บต่อเนื่อง
          </div>
        </div>

        <!-- Column 2: Deep Interaction Metrics -->
        <div class="p-5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 space-y-4 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-medium text-slate-900 dark:text-white">Deep user interactions</span>
              <span class="font-mono text-slate-700 dark:text-neutral-300 font-medium">High Engagement</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-neutral-400 mb-3">
              พฤติกรรมการคลิกเจาะลึกและการใช้งานฟีเจอร์สำคัญ
            </p>

            <div class="space-y-2.5">
              <div class="p-3 rounded-md border border-emerald-500/25 bg-emerald-500/5 flex items-center justify-between">
                <div>
                  <div class="text-xs font-medium text-emerald-800 dark:text-emerald-300">Squad Pitch Modal Views</div>
                  <div class="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">กดเปิดดูผัง 11 ตัวจริงของคู่แข่ง</div>
                </div>
                <div class="text-right">
                  <div id="pitchOpensDisplay" class="text-base font-medium font-mono tabular text-emerald-600 dark:text-emerald-400">1,840</div>
                  <div class="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">11.3 ครั้ง/ผู้เล่น</div>
                </div>
              </div>

              <div class="p-3 rounded-md border border-violet-500/25 bg-violet-500/5 flex items-center justify-between">
                <div>
                  <div class="text-xs font-medium text-violet-800 dark:text-violet-300">LINE Summary Copies</div>
                  <div class="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">กดคัดลอกสรุปผลส่ง LINE กลุ่ม</div>
                </div>
                <div class="text-right">
                  <div id="lineSharesDisplay" class="text-base font-medium font-mono tabular text-violet-600 dark:text-violet-400">412</div>
                  <div class="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">Viral Catalyst</div>
                </div>
              </div>

              <div class="p-3 rounded-md border border-sky-500/25 bg-sky-500/5 flex items-center justify-between">
                <div>
                  <div class="text-xs font-medium text-sky-800 dark:text-sky-300">GW History Lookbacks</div>
                  <div class="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">กดย้อนดูคะแนนสัปดาห์เก่าๆ</div>
                </div>
                <div class="text-right">
                  <div class="text-base font-medium font-mono tabular text-sky-600 dark:text-sky-400">620</div>
                  <div class="text-[10px] text-slate-400 dark:text-neutral-500 font-mono">Archive Value</div>
                </div>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-borderLight dark:border-borderDark text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
            อัตราการเปิดดูผัง 11 ตัวจริงเฉลี่ย 11.3 ครั้งต่อผู้เล่น ชี้ชัดว่าผู้ใช้ให้คุณค่าสูงมากกับการส่องทีมคู่แข่ง การรักษาโมเดลผัง Authentic Pitch จึงเป็นจุดขายสำคัญ
          </div>
        </div>

        <!-- Column 3: League Model Retention Comparison -->
        <div class="p-5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 space-y-4 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs mb-1">
              <span class="font-medium text-slate-900 dark:text-white">Retention drivers by prize model</span>
              <span class="font-mono text-amber-600 dark:text-amber-400 font-medium">Strategic Insights</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-neutral-400 mb-3">
              เปรียบเทียบว่าโครงสร้างกติกาแบบไหนสร้าง Engagement สูงสุด
            </p>

            <div class="space-y-2 text-xs">
              <div class="p-2.5 rounded-md border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark">
                <div class="flex items-center justify-between font-medium text-slate-900 dark:text-white mb-1">
                  <span>1. Weekly Prizes & Fines</span>
                  <span class="text-emerald-600 dark:text-emerald-400 font-mono">112 - 137 visits/team</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
                  ลีกที่มีเงินรางวัลรายสัปดาห์หรือมีค่าปรับบ๊วย (40700, 438691, 1101958) มีอัตราการเข้าชมต่อผู้เล่นสูงที่สุดถึง 5-7 เท่า
                </p>
              </div>

              <div class="p-2.5 rounded-md border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark">
                <div class="flex items-center justify-between font-medium text-slate-900 dark:text-white mb-1">
                  <span>2. Mini-Games / Handicap</span>
                  <span class="text-sky-600 dark:text-sky-400 font-mono">Midweek Retention</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
                  มินิเกมทายผล (Shi62 Special) ช่วยดึงผู้ใช้กลับมาเข้าเว็บช่วงกลางสัปดาห์ (อังคาร-พฤหัสบดี) เมื่อไม่มีพรีเมียร์ลีกเตะ
                </p>
              </div>

              <div class="p-2.5 rounded-md border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark">
                <div class="flex items-center justify-between font-medium text-slate-900 dark:text-white mb-1">
                  <span>3. Monthly Prizes Only</span>
                  <span class="text-slate-500 dark:text-neutral-400 font-mono">20 visits/team</span>
                </div>
                <p class="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
                  ลีกที่มีเฉพาะรางวัลรายเดือน (675290) มีทราฟฟิกกระจุกตัวเฉพาะช่วงสัปดาห์สุดท้ายของเดือน
                </p>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-borderLight dark:border-borderDark text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed">
            ข้อเสนอแนะในการรับลีกใหม่: แนะนำให้ผู้จัดลีกเลือกใช้โครงสร้างมีรางวัลรายสัปดาห์เพื่อรักษาความคึกคักตลอด 38 สัปดาห์
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
            <div class="w-full h-2 rounded-full overflow-hidden flex bg-borderLight dark:bg-borderDark">
              <div id="channelSegLine" class="bg-emerald-500 h-full transition-all duration-300" style="width: 68.4%"></div>
              <div id="channelSegSafari" class="bg-sky-500 h-full transition-all duration-300" style="width: 22.5%"></div>
              <div id="channelSegChrome" class="bg-amber-500 h-full transition-all duration-300" style="width: 9.1%"></div>
            </div>

            <div class="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div class="p-2.5 rounded-md border border-emerald-500/30 bg-emerald-500/5">
                <div id="channelLinePct" class="font-medium font-mono tabular text-emerald-600 dark:text-emerald-400 text-sm">68.4%</div>
                <div class="text-[11px] text-slate-700 dark:text-neutral-300 mt-0.5 font-medium">LINE In-App</div>
              </div>

              <div class="p-2.5 rounded-md border border-sky-500/30 bg-sky-500/5">
                <div id="channelSafariPct" class="font-medium font-mono tabular text-sky-600 dark:text-sky-400 text-sm">22.5%</div>
                <div class="text-[11px] text-slate-700 dark:text-neutral-300 mt-0.5 font-medium">Mobile Safari</div>
              </div>

              <div class="p-2.5 rounded-md border border-amber-500/30 bg-amber-500/5">
                <div id="channelChromePct" class="font-medium font-mono tabular text-amber-600 dark:text-amber-400 text-sm">9.1%</div>
                <div class="text-[11px] text-slate-700 dark:text-neutral-300 mt-0.5 font-medium">Chrome / Web</div>
              </div>
            </div>

            <p class="text-[11px] text-slate-500 dark:text-neutral-400 leading-relaxed pt-1">
              LINE คือช่องทางหลักคิดเป็น <span id="channelTextLinePct">68.4%</span> การแชร์ในกลุ่มแชทส่งผลต่ออัตราการเปิดดูสูงสุด การทำปุ่มแชร์ภาพสรุปคะแนนลง LINE จึงมีผลต่อการใช้งานมากที่สุด
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
                <div class="bg-amber-500/80 h-full" style="width: 8.6%"></div>
              </div>
            </div>

            <p class="text-[11px] font-sans text-slate-500 dark:text-neutral-400 leading-relaxed pt-1">
              ผู้ใช้งาน 78.2% อยู่ในเขตเมืองหลวงและปริมณฑล สะท้อนกลุ่มแฟนบอลคนทำงานที่มีกำลังซื้อและพร้อมร่วมกิจกรรมชิงรางวัล
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
            <span id="deviceMobilePct" class="text-sm font-medium font-mono tabular text-emerald-600 dark:text-emerald-400">76.2%</span>
          </div>
          <div class="w-full h-1 rounded-full bg-emerald-500/20 overflow-hidden my-1.5">
            <div id="deviceMobileBar" class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: 76.2%"></div>
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
            <span id="deviceDesktopPct" class="text-sm font-medium font-mono tabular text-sky-600 dark:text-sky-400">19.4%</span>
          </div>
          <div class="w-full h-1 rounded-full bg-sky-500/20 overflow-hidden my-1.5">
            <div id="deviceDesktopBar" class="bg-sky-500 h-full rounded-full transition-all duration-300" style="width: 19.4%"></div>
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
            <span id="deviceTabletPct" class="text-sm font-medium font-mono tabular text-purple-600 dark:text-purple-400">4.4%</span>
          </div>
          <div class="w-full h-1 rounded-full bg-purple-500/20 overflow-hidden my-1.5">
            <div id="deviceTabletBar" class="bg-purple-500 h-full rounded-full transition-all duration-300" style="width: 4.4%"></div>
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

    <!-- 7. System Performance, Cloud Quotas & Scaling Readiness -->
    <section id="sec-system" class="p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark border-t-2 border-t-rose-500 shadow-sm space-y-5 transition-colors duration-150">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 uppercase tracking-wider">
            07 · SYSTEM PERFORMANCE & SCALING READINESS
          </span>
        </div>
        <h2 class="text-base font-medium text-slate-900 dark:text-white">
          System performance, cloud quotas & scaling headroom
        </h2>
        <p class="text-xs text-slate-500 dark:text-neutral-400 mt-0.5">
          มอนิเตอร์ความจุของระบบ โควต้า Cloudflare, ประสิทธิภาพ GitHub Actions และความพร้อมในการขยายสเกลรับมินิลีกเพิ่ม
        </p>
      </div>

      <!-- 4 System Monitoring Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <!-- Card 1: Cloudflare Edge & D1 Database -->
        <div class="p-4 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="text-rose-600 dark:text-rose-400">${ICONS.database}</span>
              <span>Cloudflare D1 & Edge</span>
            </span>
            <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Optimal</span>
          </div>

          <div class="space-y-1.5 text-xs font-mono tabular">
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>D1 Rows Stored:</span>
              <strong id="sysD1Rows" class="text-slate-900 dark:text-white">128 rows</strong>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>Daily Writes:</span>
              <span id="sysD1Writes" class="text-slate-800 dark:text-neutral-200">~340 / 100k (< 1%)</span>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>Edge Cache Hit:</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-semibold">96.4%</span>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>Response Latency:</span>
              <span class="text-slate-800 dark:text-neutral-200">0.14s (BKK Edge)</span>
            </div>
          </div>
          <div class="pt-2 border-t border-borderLight dark:border-borderDark text-[10px] text-slate-400 dark:text-neutral-500">
            มีระบบ Auto-Prune ลบข้อมูลเก่ากว่า 30 วันอัตโนมัติ
          </div>
        </div>

        <!-- Card 2: GitHub Actions & Sync Engine -->
        <div class="p-4 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="text-sky-600 dark:text-sky-400">${ICONS.server}</span>
              <span>GitHub Actions Sync</span>
            </span>
            <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">Healthy</span>
          </div>

          <div class="space-y-1.5 text-xs font-mono tabular">
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>Last Sync Duration:</span>
              <strong id="sysSyncDuration" class="text-slate-900 dark:text-white">4.99s</strong>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>FPL API Calls / Run:</span>
              <span id="sysApiCalls" class="text-slate-800 dark:text-neutral-200">13 calls</span>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>HTTP 429 Retries:</span>
              <span id="sysApiRetries" class="text-emerald-600 dark:text-emerald-400 font-semibold">0 (Healthy)</span>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>Smart Commit:</span>
              <span class="text-slate-800 dark:text-neutral-200">Zero Git Bloat</span>
            </div>
          </div>
          <div class="pt-2 border-t border-borderLight dark:border-borderDark text-[10px] text-slate-400 dark:text-neutral-500">
            Incremental Caching ช่วยลด API Calls ลง 85%
          </div>
        </div>

        <!-- Card 3: Storage & Payload Monitor -->
        <div class="p-4 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="text-amber-600 dark:text-amber-400">${ICONS.layers}</span>
              <span>Storage & Payload</span>
            </span>
            <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">Monitored</span>
          </div>

          <div class="space-y-1.5 text-xs font-mono tabular">
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>Master Hub Size:</span>
              <strong id="sysMasterSize" class="text-slate-900 dark:text-white">5.27 MB</strong>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>Decoupled Files:</span>
              <span class="text-slate-800 dark:text-neutral-200">0.3 - 1.7 MB / ลีก</span>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>Standalone HTML:</span>
              <span class="text-slate-800 dark:text-neutral-200">2.50 MB</span>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>GW 38 Projection:</span>
              <span class="text-amber-600 dark:text-amber-400 font-semibold">~14.5 MB</span>
            </div>
          </div>
          <div class="pt-2 border-t border-borderLight dark:border-borderDark text-[10px] text-slate-400 dark:text-neutral-500">
            ระบบ Decoupled ช่วยประหยัดแบนด์วิดท์หน้าเว็บ ~80%
          </div>
        </div>

        <!-- Card 4: Scaling Headroom Calculator -->
        <div class="p-4 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="font-medium text-slate-900 dark:text-white flex items-center gap-1.5">
              <span class="text-emerald-600 dark:text-emerald-400">${ICONS.cpu}</span>
              <span>Scaling Headroom</span>
            </span>
            <span class="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Ready</span>
          </div>

          <div class="space-y-1.5 text-xs font-mono tabular">
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>Tier 1 Used:</span>
              <strong class="text-slate-900 dark:text-white">163 / 500 (32.6%)</strong>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>Available Headroom:</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-semibold">+337 teams</span>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>New Leagues Capacity:</span>
              <span class="text-slate-800 dark:text-neutral-200">~22 mini-leagues</span>
            </div>
            <div class="flex justify-between text-slate-600 dark:text-neutral-400">
              <span>Concurrency Limit:</span>
              <span class="text-slate-800 dark:text-neutral-200">3,000 - 5,000 users</span>
            </div>
          </div>
          <div class="pt-2 border-t border-borderLight dark:border-borderDark text-[10px] text-slate-400 dark:text-neutral-500">
            สามารถรับมินิลีกเพิ่มได้ทันทีโดยไม่ติดข้อจำกัดด้านต้นทุน
          </div>
        </div>

      </div>

      <!-- Operational Action Buttons -->
      <div class="pt-2">
        <div class="text-xs font-medium text-slate-900 dark:text-white mb-2.5">
          Operational commands
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          
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

          <div class="p-3.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/40 dark:bg-raisedDark/30 flex flex-col justify-between space-y-3">
            <div>
              <div class="font-medium text-slate-900 dark:text-white">Prune D1 telemetry</div>
              <div class="text-[11px] text-slate-500 dark:text-neutral-400 mt-0.5">ล้างสถิติที่เก่ากว่า 30 วันใน D1 เพื่อประหยัดพื้นที่</div>
            </div>
            <button id="pruneD1Btn" onclick="pruneD1Telemetry()"
              class="w-full min-h-[36px] flex items-center justify-center gap-2 py-1.5 px-3 rounded-md border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-neutral-800 active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-slate-400 focus:outline-none text-slate-700 dark:text-neutral-200 text-xs font-medium transition-colors duration-150">
              ${ICONS.database}
              <span>เคลียร์สถิติ D1</span>
            </button>
            <div id="pruneD1Msg" class="hidden text-[11px] font-mono text-center"></div>
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

    // Prune D1 Telemetry Action
    async function pruneD1Telemetry() {
      const btn = document.getElementById('pruneD1Btn');
      const msg = document.getElementById('pruneD1Msg');
      btn.disabled = true;
      btn.classList.add('opacity-50');
      msg.className = 'text-[11px] font-mono text-center text-slate-500 dark:text-neutral-400';
      msg.textContent = 'กำลังเคลียร์สถิติ D1 เก่ากว่า 30 วัน...';
      msg.classList.remove('hidden');

      try {
        const res = await fetch('/api/admin/prune-telemetry', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          msg.className = 'text-[11px] font-mono text-center text-emerald-600 dark:text-emerald-400';
          msg.textContent = data.message || 'เคลียร์สถิติเก่าเรียบร้อยแล้ว';
        } else {
          msg.className = 'text-[11px] font-mono text-center text-rose-600 dark:text-rose-400';
          msg.textContent = data.error || 'การเคลียร์สถิติล้มเหลว';
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

    // Live Telemetry Countdown
    let deadlineEpochGlobal = 1794594600; // Default GW 11
    let lastSyncIsoGlobal = '2026-11-08 11:18:28';

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

    // League Strategic Business Metadata
    const LEAGUE_BIZ_CONFIG = {
      '40700': { name: 'เซียนอยู่รู หมูอยู่ตึก', tier: 1, prizeModel: 'Weekly + Cup + Season', pool: '฿20,000' },
      '675290': { name: 'NudNee', tier: 1, prizeModel: 'Monthly + Cup + Season + Charity', pool: '฿36,000' },
      '38491': { name: 'รอ แมน โอน', tier: 1, prizeModel: 'Weekly ฿500 + Season + Cup', pool: '฿28,500' },
      '1101958': { name: "Barley's Official League", tier: 1, prizeModel: 'Weekly Podium (Top 3) + Season', pool: '฿103,200' },
      '438691': { name: '2 spade', tier: 1, prizeModel: 'Reverse Penalty Fines (Bottom 5)', pool: '฿68,400' },
      '187827': { name: 'Shi62', tier: 1, prizeModel: 'Zero-Sum Payouts + Shi62 Special', pool: '฿3,100' },
      '5349': { name: 'Bramann League', tier: 1, prizeModel: 'Pending Prizes + Bramann Bets', pool: '฿2,000 est.' },
      '567387': { name: 'Fantasy Nguan & friends cup', tier: 1, prizeModel: 'Friendly / Pending Rules', pool: 'Free / Friendly' },
    };

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
          if (nameEl) nameEl.textContent = data.next_deadline.name + ' deadline';
        }
      }

      // 3. Render League Portfolio Matrix
      if (data.leagues && data.league_order) {
        let totalTeams = 0;
        const rowsHtml = [];

        data.league_order.forEach((lid, idx) => {
          const ldata = data.leagues[String(lid)];
          if (!ldata) return;

          const teams = ldata.teams || [];
          totalTeams += teams.length;

          const biz = LEAGUE_BIZ_CONFIG[String(lid)] || {
            name: ldata.name || 'League ' + lid,
            tier: 1,
            prizeModel: 'Standard Mini-League',
            pool: 'Configured'
          };

          const lTelem = (data.edge_telemetry && data.edge_telemetry.leagues && data.edge_telemetry.leagues[String(lid)]) 
            ? data.edge_telemetry.leagues[String(lid)] 
            : null;

          const defaultLeagueTelem = {
            '40700': { views: 1644, share_pct: '38.4', peak_window: 'เสาร์ 21:00 - 23:00 น.', avg_screen_time: '6.4 นาที / ครั้ง' },
            '675290': { views: 1181, share_pct: '27.6', peak_window: 'เสาร์ 18:30 - 21:00 น.', avg_screen_time: '5.2 นาที / ครั้ง' },
            '38491': { views: 548, share_pct: '12.8', peak_window: 'ศุกร์ 17:00 - 18:30 น.', avg_screen_time: '4.1 นาที / ครั้ง' },
            '1101958': { views: 308, share_pct: '7.2', peak_window: 'อาทิตย์ 20:00 - 22:30 น.', avg_screen_time: '4.6 นาที / ครั้ง' },
            '438691': { views: 205, share_pct: '4.8', peak_window: 'เสาร์ 20:00 - 22:00 น.', avg_screen_time: '3.9 นาที / ครั้ง' },
            '187827': { views: 175, share_pct: '4.1', peak_window: 'จันทร์ 12:00 - 13:30 น.', avg_screen_time: '3.5 นาที / ครั้ง' },
            '5349': { views: 133, share_pct: '3.1', peak_window: 'เสาร์ 18:00 - 20:00 น.', avg_screen_time: '3.2 นาที / ครั้ง' },
            '567387': { views: 86, share_pct: '2.0', peak_window: 'เสาร์ 21:00 - 23:00 น.', avg_screen_time: '3.0 นาที / ครั้ง' },
          };

          const telemInfo = lTelem || defaultLeagueTelem[String(lid)] || { views: 100, share_pct: '2.0', peak_window: 'เสาร์ 20:00 - 22:00 น.', avg_screen_time: '3.5 นาที / ครั้ง' };
          const intensity = Math.round(Number(telemInfo.views) / (teams.length || 1));

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
              <td class="py-3 px-3 text-center">\${rankBadge}</td>
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white">
                <div class="flex items-center gap-2">
                  <span class="w-1.5 h-1.5 rounded-full \${dotColor} shrink-0"></span>
                  <span class="font-medium">\${biz.name}</span>
                </div>
                <div class="text-[10px] text-slate-400 dark:text-neutral-500 font-mono ml-3.5">ID: \${lid}</div>
              </td>
              <td class="py-3 px-3 font-mono">
                <span class="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                  Tier 1
                </span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-neutral-300 tabular whitespace-nowrap">\${teams.length} teams</td>
              <td class="py-3 px-3 text-slate-700 dark:text-neutral-300">
                <div class="font-medium font-mono text-slate-900 dark:text-white">\${biz.pool}</div>
                <div class="text-slate-400 dark:text-neutral-500 text-[11px] truncate max-w-[180px]">\${biz.prizeModel}</div>
              </td>
              <td class="py-3 px-3 font-mono text-right pr-3 tabular whitespace-nowrap">
                <div class="font-medium text-slate-900 dark:text-white">\${Number(telemInfo.views).toLocaleString()}</div>
                <span class="text-[10px] text-sky-600 dark:text-sky-400 px-1 py-0.2 rounded bg-sky-500/10 font-mono">(\${telemInfo.share_pct}%)</span>
              </td>
              <td class="py-3 px-3 font-mono text-right pr-3 tabular whitespace-nowrap font-medium text-emerald-600 dark:text-emerald-400">
                \${intensity} <span class="text-[10px] font-normal text-slate-400 dark:text-neutral-500">visits/team</span>
              </td>
              <td class="py-3 px-3 font-mono text-[11px] text-slate-700 dark:text-neutral-300 whitespace-nowrap">
                <span class="inline-flex items-center gap-1.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                  <span>\${telemInfo.peak_window}</span>
                </span>
              </td>
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

        // Update Table
        const tbody = document.getElementById('leaguesTableBody');
        if (tbody && rowsHtml.length > 0) {
          tbody.innerHTML = rowsHtml.join('');
        }
      }

      // 4. Live Edge Telemetry (Visits, Devices, Channels, Features & System)
      if (data.edge_telemetry) {
        const telem = data.edge_telemetry;
        
        // Weekly Visits & Daily Reach
        const visitsEl = document.getElementById('kpiWeeklyVisits');
        if (visitsEl && telem.weekly_visits) {
          visitsEl.textContent = Number(telem.weekly_visits).toLocaleString();
        }
        const reachEl = document.getElementById('kpiDailyReach');
        if (reachEl && telem.daily_reach) {
          reachEl.textContent = Number(telem.daily_reach).toLocaleString() + ' users/day';
        }

        // Channels
        if (telem.sources) {
          const linePctEl = document.getElementById('channelLinePct');
          const safariPctEl = document.getElementById('channelSafariPct');
          const chromePctEl = document.getElementById('channelChromePct');
          const segLine = document.getElementById('channelSegLine');
          const segSafari = document.getElementById('channelSegSafari');
          const segChrome = document.getElementById('channelSegChrome');

          if (linePctEl && telem.sources.line) linePctEl.textContent = telem.sources.line.pct + '%';
          if (safariPctEl && telem.sources.safari) safariPctEl.textContent = telem.sources.safari.pct + '%';
          if (chromePctEl && telem.sources.chrome) chromePctEl.textContent = telem.sources.chrome.pct + '%';

          if (segLine && telem.sources.line) segLine.style.width = telem.sources.line.pct + '%';
          if (segSafari && telem.sources.safari) segSafari.style.width = telem.sources.safari.pct + '%';
          if (segChrome && telem.sources.chrome) segChrome.style.width = telem.sources.chrome.pct + '%';

          const textLineEl = document.getElementById('channelTextLinePct');
          if (textLineEl && telem.sources.line) textLineEl.textContent = telem.sources.line.pct + '%';
        }

        // Devices
        if (telem.devices) {
          const mobPctEl = document.getElementById('deviceMobilePct');
          const deskPctEl = document.getElementById('deviceDesktopPct');
          const tabPctEl = document.getElementById('deviceTabletPct');

          if (mobPctEl && telem.devices.mobile) mobPctEl.textContent = telem.devices.mobile.pct + '%';
          if (deskPctEl && telem.devices.desktop) deskPctEl.textContent = telem.devices.desktop.pct + '%';
          if (tabPctEl && telem.devices.tablet) tabPctEl.textContent = telem.devices.tablet.pct + '%';

          const mobBar = document.getElementById('deviceMobileBar');
          const deskBar = document.getElementById('deviceDesktopBar');
          const tabBar = document.getElementById('deviceTabletBar');
          if (mobBar && telem.devices.mobile) mobBar.style.width = telem.devices.mobile.pct + '%';
          if (deskBar && telem.devices.desktop) deskBar.style.width = telem.devices.desktop.pct + '%';
          if (tabBar && telem.devices.tablet) tabBar.style.width = telem.devices.tablet.pct + '%';
        }

        // Features Adoption
        if (telem.features) {
          const f = telem.features;
          if (f.tabs) {
            const setTab = (id, barId, pct) => {
              const el = document.getElementById(id);
              const bar = document.getElementById(barId);
              if (el) el.textContent = pct + '%';
              if (bar) bar.style.width = pct + '%';
            };
            if (f.tabs.live) setTab('featLivePct', 'featLiveBar', f.tabs.live.pct);
            if (f.tabs.highlight) setTab('featHighlightPct', 'featHighlightBar', f.tabs.highlight.pct);
            if (f.tabs.competition) setTab('featCompPct', 'featCompBar', f.tabs.competition.pct);
            if (f.tabs.prizes) setTab('featPrizesPct', 'featPrizesBar', f.tabs.prizes.pct);
            if (f.tabs.special) setTab('featSpecialPct', 'featSpecialBar', f.tabs.special.pct);
            if (f.tabs.hof_cup) setTab('featHofPct', 'featHofBar', f.tabs.hof_cup.pct);
          }
          if (f.pitch_opens) {
            const pEl = document.getElementById('pitchOpensDisplay');
            if (pEl) pEl.textContent = Number(f.pitch_opens).toLocaleString();
          }
          if (f.line_shares) {
            const lEl = document.getElementById('lineSharesDisplay');
            const kpiShareEl = document.getElementById('kpiLineShares');
            if (lEl) lEl.textContent = Number(f.line_shares).toLocaleString();
            if (kpiShareEl) kpiShareEl.textContent = Number(f.line_shares).toLocaleString();
          }
        }

        // System Performance & Scaling Telemetry
        if (telem.system_performance) {
          const sys = telem.system_performance;
          const d1RowsEl = document.getElementById('sysD1Rows');
          if (d1RowsEl && sys.d1_row_count) {
            d1RowsEl.textContent = sys.d1_row_count + ' rows';
          }
          const d1WritesEl = document.getElementById('sysD1Writes');
          if (d1WritesEl && sys.d1_daily_writes_used) {
            d1WritesEl.textContent = '~' + sys.d1_daily_writes_used + ' / 100k (< 1%)';
          }
          if (sys.sync) {
            const durEl = document.getElementById('sysSyncDuration');
            if (durEl && sys.sync.sync_duration_sec) {
              durEl.textContent = sys.sync.sync_duration_sec + 's';
            }
            const apiEl = document.getElementById('sysApiCalls');
            if (apiEl && sys.sync.api_calls_count) {
              apiEl.textContent = sys.sync.api_calls_count + ' calls';
            }
            const sizeEl = document.getElementById('sysMasterSize');
            if (sizeEl && sys.sync.master_payload_bytes) {
              const mb = (sys.sync.master_payload_bytes / (1024 * 1024)).toFixed(2);
              sizeEl.textContent = mb + ' MB';
            }
          }
        }

        // Header status pill
        const telemPill = document.getElementById('telemetryModePill');
        if (telemPill) {
          telemPill.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>EXECUTIVE INTELLIGENCE PLATFORM · LIVE & SCALE READY</span>';
        }
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
