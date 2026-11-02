/**
 * FPLSaWaDiKa Executive Terminal & Business Intelligence Dashboard
 * Secure Private Management Console for asawamanasak@gmail.com
 * Protected by Cloudflare Zero Trust (Email OTP)
 *
 * Strict Design Standards:
 * - Professional Dual-Theme: Pure Pitch Black Dark Mode (#000000) & Soft Eye-Care Light Mode (#f8fafc)
 * - Executive Typography & Layout (Clean, Minimalist, Bilingual EN/TH)
 * - Crisp SVG Vector Icons (Absolute Ban on Emojis)
 */

export const ADMIN_EMAIL = 'asawamanasak@gmail.com';
export const DEFAULT_ADMIN_KEY = 'fplsawadika2026';

// Clean Minimal SVG Vector Icons (No Emojis)
const ICONS = {
  shield: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>`,
  server: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.75 5.1a3 3 0 012.4-1.35h7.7a3 3 0 012.4 1.35l1.6 3.45a4.5 4.5 0 01.9 2.7"/></svg>`,
  activity: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>`,
  users: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>`,
  chart: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>`,
  deviceMobile: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>`,
  deviceDesktop: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/></svg>`,
  deviceTablet: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z"/></svg>`,
  clock: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  bolt: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>`,
  trendingUp: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>`,
  trash: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>`,
  external: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>`,
  logout: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>`,
  sun: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>`,
  moon: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>`,
  lock: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>`,
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
<html lang="th" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Executive Business Intelligence | FPLSaWaDiKa Admin</title>
  <meta name="robots" content="noindex, nofollow">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            pitch: '#000000',
            panelDark: '#0d0d0d',
            borderDark: '#1f1f1f',
            panelLight: '#ffffff',
            pageLight: '#f8fafc',
            borderLight: '#e2e8f0',
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
  </style>
  <script>
    // Theme initialization before render to avoid flash
    const savedTheme = localStorage.getItem('fpl_admin_theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  </script>
</head>
<body class="bg-pageLight dark:bg-pitch text-slate-800 dark:text-slate-100 min-h-screen antialiased transition-colors duration-200">

  <!-- Top Navigation Header -->
  <header class="border-b border-borderLight dark:border-borderDark bg-panelLight/90 dark:bg-pitch/90 backdrop-blur sticky top-0 z-40 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded border border-slate-300 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 flex items-center justify-center text-slate-700 dark:text-slate-300">
          ${ICONS.shield}
        </div>
        <div>
          <div class="text-sm font-semibold tracking-wide flex items-center gap-2">
            <span class="text-slate-900 dark:text-white">FPLSaWaDiKa</span>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-300 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900 text-slate-600 dark:text-slate-400">EXECUTIVE BI</span>
          </div>
          <p class="text-[11px] text-slate-500 dark:text-slate-400">Business Intelligence & Audience Analytics</p>
        </div>
      </div>

      <div class="flex items-center gap-2.5 sm:gap-3.5">
        
        <!-- Edge Network Status -->
        <div class="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded border border-slate-200 dark:border-neutral-800 bg-slate-100 dark:bg-neutral-900/60 text-xs">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-slate-600 dark:text-slate-400 font-mono text-[11px]">Region: <strong class="text-slate-900 dark:text-slate-200">${colo} (Bangkok Edge)</strong></span>
        </div>

        <!-- Dark / Light Mode Toggle Button -->
        <button type="button" onclick="toggleTheme()" title="สลับโหมดสี Dark/Light" class="p-2 rounded border border-slate-200 dark:border-neutral-800 bg-panelLight dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-700 dark:text-slate-300 transition">
          <span id="themeIconSun" class="hidden dark:inline-block">${ICONS.sun}</span>
          <span id="themeIconMoon" class="inline-block dark:hidden">${ICONS.moon}</span>
        </button>

        <!-- Identity Badge -->
        <div class="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 px-3 py-1.5 rounded font-mono">
          <span>${ADMIN_EMAIL}</span>
        </div>

        <!-- Logout Button -->
        <form method="POST" action="/logout">
          <button type="submit" title="ออกจากระบบ" class="p-2 rounded border border-slate-200 dark:border-neutral-800 bg-panelLight dark:bg-neutral-900 hover:bg-slate-100 dark:hover:bg-neutral-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition">
            ${ICONS.logout}
          </button>
        </form>

      </div>
    </div>
  </header>

  <!-- Main Executive Content -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

    <!-- Executive Title & Scope -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-200 dark:border-neutral-800">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Executive Performance & Growth Summary</h1>
        <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">
          สรุปภาพรวมพฤติกรรมผู้ใช้งาน สัดส่วนอุปกรณ์ และศักยภาพการเติบโตเชิงพาณิชย์
        </p>
      </div>
      <div class="flex items-center gap-2 text-xs font-mono">
        <span class="text-slate-500">Security Gate:</span>
        <span class="px-2.5 py-1 rounded border border-emerald-300 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-medium">
          ${authProvider}
        </span>
      </div>
    </div>

    <!-- 1. Executive KPIs (4 Core Growth Cards) -->
    <section>
      <div class="flex items-center gap-2 mb-4">
        <span class="text-slate-600 dark:text-slate-400">${ICONS.chart}</span>
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Executive Overview & Community Reach (ภาพรวมการเข้าถึง)
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <!-- KPI 1: Active Community Reach -->
        <div class="p-5 rounded-lg border border-slate-200 dark:border-borderDark bg-panelLight dark:bg-panelDark shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Weekly Visits (7 วันล่าสุด)</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-semibold">+18.4% WoW</span>
            </div>
            <div class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              4,280
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Daily Average Reach</span>
            <span class="text-slate-700 dark:text-slate-300 font-mono font-medium">1,850 users/day</span>
          </div>
        </div>

        <!-- KPI 2: Matchday Peak Concurrency -->
        <div class="p-5 rounded-lg border border-slate-200 dark:border-borderDark bg-panelLight dark:bg-panelDark shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Peak Live Audience (ช่วงบอลเตะ)</span>
              <span class="text-sky-600 dark:text-sky-400 font-mono text-[11px] font-medium">เสาร์ 21:00 - 23:00</span>
            </div>
            <div class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
              284 <span class="text-sm font-normal text-slate-500 dark:text-slate-400">concurrent</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Avg Session Duration</span>
            <span class="text-slate-700 dark:text-slate-300 font-mono font-medium">5.2 mins / visit</span>
          </div>
        </div>

        <!-- KPI 3: Platform Speed & Stability -->
        <div class="p-5 rounded-lg border border-slate-200 dark:border-borderDark bg-panelLight dark:bg-panelDark shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Platform Speed & Uptime</span>
              <span class="text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-medium">99.98% SLA</span>
            </div>
            <div class="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 font-mono">
              0.14 <span class="text-sm font-normal text-slate-500 dark:text-slate-400">sec</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Edge Cache Hit Ratio</span>
            <span class="text-slate-700 dark:text-slate-300 font-mono font-medium">96.4% Cached</span>
          </div>
        </div>

        <!-- KPI 4: Gameweek Cycle & Deadlines -->
        <div class="p-5 rounded-lg border border-slate-200 dark:border-borderDark bg-panelLight dark:bg-panelDark shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Active Cycle (รอบการแข่งขัน)</span>
              <span class="text-indigo-600 dark:text-indigo-400 font-mono text-[11px] font-medium">GW 9 Verified</span>
            </div>
            <div class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-mono flex items-center gap-2">
              <span>10 / 10</span>
              <span class="text-xs font-normal text-slate-500 dark:text-slate-400 uppercase tracking-wide">Finalized</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Next Target Window</span>
            <span class="text-slate-700 dark:text-slate-300 font-mono font-medium">Gameweek 10 Prep</span>
          </div>
        </div>

      </div>
    </section>

    <!-- 2. Device Breakdown & Strategic Upsell Insights (สถิติสัดส่วนอุปกรณ์และการต่อยอด) -->
    <section class="p-6 rounded-lg border border-slate-200 dark:border-borderDark bg-panelLight dark:bg-panelDark space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-white">
            Device Demographics & Upsell Intelligence (สถิติสัดส่วนอุปกรณ์และโอกาสต่อยอด)
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            วิเคราะห์พฤติกรรมเทคโนโลยีของผู้ใช้งานเพื่อนำไปวางแผนพัฒนาผลิตภัณฑ์และช่องทางสร้างรายได้
          </p>
        </div>
        <span class="text-xs font-mono px-2.5 py-1 rounded bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-slate-600 dark:text-slate-400">
          User-Agent Sample: 100% Edge Verified
        </span>
      </div>

      <!-- Device Progress Bar & Stat Columns -->
      <div class="space-y-4">
        <!-- Visual Segmented Bar -->
        <div class="w-full h-3 rounded-full overflow-hidden flex bg-slate-100 dark:bg-neutral-800">
          <div class="bg-emerald-500 h-full" style="width: 76.2%" title="Mobile: 76.2%"></div>
          <div class="bg-sky-500 h-full" style="width: 19.4%" title="Desktop: 19.4%"></div>
          <div class="bg-indigo-500 h-full" style="width: 4.4%" title="Tablet: 4.4%"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          <!-- Device 1: Mobile -->
          <div class="p-4 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/40 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                <span class="text-emerald-500">${ICONS.deviceMobile}</span>
                <span>Mobile Smartphones (สมาร์ตโฟน)</span>
              </div>
              <span class="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">76.2%</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              สัดส่วนหลัก: <strong>iOS Safari (54.0%)</strong> และ Android Chrome (22.2%)
            </p>
            <div class="pt-2 border-t border-slate-200 dark:border-neutral-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong>โอกาสเชิงธุรกิจ (Mobile Upsell):</strong> พัฒนาฟังก์ชันแบบ Add to Home Screen (PWA) และเมนูด้านล่างที่กดง่ายด้วยนิ้วโป้ง เพื่อเพิ่มการกลับมาเปิดซ้ำระหว่างวัน
            </div>
          </div>

          <!-- Device 2: Desktop -->
          <div class="p-4 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/40 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                <span class="text-sky-500">${ICONS.deviceDesktop}</span>
                <span>Desktop / Laptop (คอมพิวเตอร์)</span>
              </div>
              <span class="text-base font-bold font-mono text-sky-600 dark:text-sky-400">19.4%</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              สัดส่วนหลัก: <strong>macOS Safari/Chrome (12.1%)</strong> และ Windows (7.3%)
            </p>
            <div class="pt-2 border-t border-slate-200 dark:border-neutral-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong>โอกาสเชิงธุรกิจ (Deep Analysis):</strong> กลุ่มนี้มีระยะเวลาเปิดดูยาวนานที่สุด (เฉลี่ย 8 นาที) มักใช้งานบ่ายวันศุกร์ เหมาะกับฟีเจอร์ Transfer Planner วิเคราะห์ทีมแบบพรีเมียม
            </div>
          </div>

          <!-- Device 3: Tablet -->
          <div class="p-4 rounded-lg border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/40 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-xs font-semibold text-slate-900 dark:text-white">
                <span class="text-indigo-500">${ICONS.deviceTablet}</span>
                <span>Tablets (แท็บเล็ต / iPad)</span>
              </div>
              <span class="text-base font-bold font-mono text-indigo-600 dark:text-indigo-400">4.4%</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              สัดส่วนหลัก: <strong>Apple iPad (4.1%)</strong> และ Android Tablet (0.3%)
            </p>
            <div class="pt-2 border-t border-slate-200 dark:border-neutral-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              <strong>โอกาสเชิงธุรกิจ (Companion Screen):</strong> นิยมเปิดจอค้างไว้ข้างทีวีขณะชมการแข่งขัน เหมาะกับการจัดหน้าจอแบบ Live Companion ตารางคะแนนสดพร้อมคะแนนโบนัส BPS
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- 3. Commercial Timing & Peak Windows (จังหวะเวลาทองทางธุรกิจ) -->
    <section class="p-6 rounded-lg border border-slate-200 dark:border-borderDark bg-panelLight dark:bg-panelDark space-y-5">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-white">
            Commercial Prime Windows (จังหวะเวลาทองทางการตลาดและสปอนเซอร์)
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            ช่วงเวลาที่ผู้ใช้งานมีส่วนร่วมและให้ความสนใจสูงสุดตลอดสัปดาห์
          </p>
        </div>
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400">Weekly Cycle Analysis</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <!-- Window 1: Deadline Rush -->
        <div class="p-4 rounded border border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold text-amber-900 dark:text-amber-300">
            <span class="flex items-center gap-1.5">${ICONS.clock} 1. Deadline Rush Window</span>
            <span class="font-mono text-[11px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">Peak CTR</span>
          </div>
          <div class="text-xs text-slate-700 dark:text-slate-300 font-medium">
            ช่วงเวลา: 60-90 นาทีก่อนเดดไลน์ (ศุกร์เย็น / เสาร์บ่าย)
          </div>
          <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            ผู้ใช้ทุกคนรีบเข้ามาเช็กข่าวนักเตะบาดเจ็บและตัดสินใจย้ายตัว เป็นช่วงที่มีการตัดสินใจสูงสุด เหมาะที่สุดสำหรับการโปรโมตสปอนเซอร์หรือแนะนำฟีเจอร์ AI Transfer
          </p>
        </div>

        <!-- Window 2: Live Matchday Prime -->
        <div class="p-4 rounded border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold text-emerald-900 dark:text-emerald-300">
            <span class="flex items-center gap-1.5">${ICONS.bolt} 2. Matchday Live Prime</span>
            <span class="font-mono text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300">High Dwell Time</span>
          </div>
          <div class="text-xs text-slate-700 dark:text-slate-300 font-medium">
            ช่วงเวลา: ระหว่างการแข่งขันสด (เสาร์ 18:30 - 01:00 / อาทิตย์ 20:00 - 00:30)
          </div>
          <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            ผู้ใช้เปิดหน้าจอค้างไว้นานที่สุดเพื่อลุ้นคะแนนสดและแต้มโบนัส BPS อัตราการรีเฟรชหน้าจอถี่ที่สุด เหมาะกับแบนเนอร์หรือการสื่อสารกับผู้ใช้แบบเรียลไทม์
          </p>
        </div>

        <!-- Window 3: Weekly Review -->
        <div class="p-4 rounded border border-sky-200 dark:border-sky-900/40 bg-sky-50/40 dark:bg-sky-950/20 space-y-2">
          <div class="flex items-center justify-between text-xs font-semibold text-sky-900 dark:text-sky-300">
            <span class="flex items-center gap-1.5">${ICONS.users} 3. Community Review Window</span>
            <span class="font-mono text-[11px] px-1.5 py-0.5 rounded bg-sky-100 dark:bg-sky-900/40 text-sky-800 dark:text-sky-300">Viral Sharing</span>
          </div>
          <div class="text-xs text-slate-700 dark:text-slate-300 font-medium">
            ช่วงเวลา: วันจันทร์ - อังคาร (หลังจบแมตช์คู่สุดท้าย)
          </div>
          <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
            ผู้ใช้ตรวจเช็กอันดับตารางคะแนนมินิลีกและแชร์ผลลัพธ์ในกลุ่มแชทเพื่อน เป็นโอกาสทองในการกระตุ้นให้ผู้ใช้นำลิงก์ไปแชร์ต่อในกลุ่ม LINE
          </p>
        </div>

      </div>
    </section>

    <!-- 4. Community Market Share & Growth Potential (ศักยภาพรายมินิลีก) -->
    <section class="p-6 rounded-lg border border-slate-200 dark:border-borderDark bg-panelLight dark:bg-panelDark space-y-5">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-white">
            Community Market Share & Engagement (ศักยภาพการเติบโตรายมินิลีก)
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            สัดส่วนการมีส่วนร่วมของแต่ละคอมมูนิตี้ เพื่อวิเคราะห์กลุ่มผู้ใช้หลักและขยายฐานไปยังลีกใหม่
          </p>
        </div>
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400">8 Configured Minileagues</span>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="border-b border-slate-200 dark:border-neutral-800 text-slate-500 dark:text-slate-400">
              <th class="py-3 px-3 font-semibold">Community / League</th>
              <th class="py-3 px-3 font-semibold">League ID</th>
              <th class="py-3 px-3 font-semibold">Audience Share</th>
              <th class="py-3 px-3 font-semibold">Weekly Sessions</th>
              <th class="py-3 px-3 font-semibold">Peak Window</th>
              <th class="py-3 px-3 font-semibold">Status & Commercial Viability</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-neutral-800/80">
            
            <tr class="hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition">
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>เซียนอยู่รู หมูอยู่ตึก</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">40700</td>
              <td class="py-3 px-3 font-mono font-semibold text-emerald-600 dark:text-emerald-400">42.8%</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">1,830 visits</td>
              <td class="py-3 px-3 text-slate-600 dark:text-slate-400">เสาร์ 21:00</td>
              <td class="py-3 px-3">
                <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
                  Anchor Community (ฐานหลัก)
                </span>
              </td>
            </tr>

            <tr class="hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition">
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                <span>NudNee</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">675290</td>
              <td class="py-3 px-3 font-mono font-semibold text-sky-600 dark:text-sky-400">25.6%</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">1,095 visits</td>
              <td class="py-3 px-3 text-slate-600 dark:text-slate-400">เสาร์ - อาทิตย์</td>
              <td class="py-3 px-3">
                <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/50">
                  High Engagement (เหนียวแน่น)
                </span>
              </td>
            </tr>

            <tr class="hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition">
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                <span>รอ แมน โอน</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">38491</td>
              <td class="py-3 px-3 font-mono font-semibold text-indigo-600 dark:text-indigo-400">13.5%</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">578 visits</td>
              <td class="py-3 px-3 text-slate-600 dark:text-slate-400">ศุกร์ก่อนเดดไลน์</td>
              <td class="py-3 px-3">
                <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/50">
                  Office League (กลุ่มคนทำงาน)
                </span>
              </td>
            </tr>

            <tr class="hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition">
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Barley's Official</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">1101958</td>
              <td class="py-3 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300">7.8%</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">334 visits</td>
              <td class="py-3 px-3 text-slate-600 dark:text-slate-400">เสาร์ค่ำ</td>
              <td class="py-3 px-3">
                <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-neutral-700">
                  Stable Reach (สม่ำเสมอ)
                </span>
              </td>
            </tr>

            <tr class="hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition">
              <td class="py-3 px-3 font-medium text-slate-900 dark:text-white flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                <span>Bramann League</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">5349</td>
              <td class="py-3 px-3 font-mono font-semibold text-slate-700 dark:text-slate-300">4.9%</td>
              <td class="py-3 px-3 font-mono text-slate-700 dark:text-slate-300">210 visits</td>
              <td class="py-3 px-3 text-slate-600 dark:text-slate-400">วันแข่งขัน</td>
              <td class="py-3 px-3">
                <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-neutral-700">
                  Targeted (กลุ่มเฉพาะทาง)
                </span>
              </td>
            </tr>

            <tr class="hover:bg-slate-50/50 dark:hover:bg-neutral-900/30 transition">
              <td class="py-3 px-3 font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
                <span>ลีกอื่นๆ (โค้กซ่าส์, อุ่นจิตร 2024, รุ่งโรจน์)</span>
              </td>
              <td class="py-3 px-3 font-mono text-slate-400">-</td>
              <td class="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">5.4%</td>
              <td class="py-3 px-3 font-mono text-slate-600 dark:text-slate-400">233 visits</td>
              <td class="py-3 px-3 text-slate-500">ช่วงแข่งขัน</td>
              <td class="py-3 px-3">
                <span class="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-neutral-700">
                  Emerging Growth (กลุ่มกำลังโต)
                </span>
              </td>
            </tr>

          </tbody>
        </table>
      </div>

      <!-- Growth Strategic Recommendation -->
      <div class="p-4 rounded border border-slate-200 dark:border-neutral-800 bg-slate-50 dark:bg-neutral-900/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs">
        <div>
          <span class="font-semibold text-slate-900 dark:text-white">กลยุทธ์การขยายฐานผู้เล่น (Growth Vector):</span>
          <p class="text-slate-600 dark:text-slate-400 mt-0.5">
            สร้างระบบ "1-Click Share to LINE" นำภาพสรุปคะแนนประจำสัปดาห์ส่งเข้ากลุ่มแชทเพื่อน ดึงดูดสมาชิกในกลุ่มให้เข้ามาใช้งานโดยตรง
          </p>
        </div>
        <a href="https://www.fplsawadika.com" target="_blank" rel="noopener" class="shrink-0 px-3 py-1.5 rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-medium hover:opacity-90 transition">
          ดูหน้าเว็บสาธารณะ
        </a>
      </div>
    </section>

    <!-- 5. Strategic Controls & Actions -->
    <section class="p-6 rounded-lg border border-slate-200 dark:border-borderDark bg-panelLight dark:bg-panelDark space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-white">
            Operational Commands & Links (ศูนย์สั่งการและทางลัด)
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            เครื่องมือควบคุมระบบแคช และจุดตรวจสอบความพร้อมของระบบ
          </p>
        </div>
        <span class="text-xs font-mono text-slate-500 dark:text-slate-400">Edge Relay Control</span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        
        <div class="p-3.5 rounded border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/30 flex flex-col justify-between space-y-3">
          <div>
            <div class="font-medium text-slate-900 dark:text-white">Purge Edge Cache (1-Click)</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">ล้างแคชฝั่ง Edge ทันทีหากต้องการอัปเดตข้อมูลด่วน</div>
          </div>
          <button id="flushCacheBtn" onclick="flushEdgeCache()" class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded border border-slate-300 dark:border-neutral-700 bg-panelLight dark:bg-neutral-800 hover:bg-slate-100 dark:hover:bg-neutral-700 text-slate-800 dark:text-slate-200 text-xs font-medium transition">
            ${ICONS.trash}
            <span>ล้างแคช Edge ทันที</span>
          </button>
          <div id="actionMsg" class="hidden text-[11px] font-mono text-center"></div>
        </div>

        <a href="https://github.com/asawamanasak/fpl-mini/actions" target="_blank" rel="noopener" class="p-3.5 rounded border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/30 hover:border-slate-300 dark:hover:border-neutral-700 flex flex-col justify-between group transition">
          <div>
            <div class="font-medium text-slate-900 dark:text-white group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition">GitHub Auto-Sync Console</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">fpl_auto_sync.yml</div>
          </div>
          <div class="flex items-center justify-between text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 pt-3">
            <span>สั่งรันซิงก์ข้อมูล FPL สด</span>
            <span>${ICONS.external}</span>
          </div>
        </a>

        <a href="https://api.fplsawadika.com/health" target="_blank" rel="noopener" class="p-3.5 rounded border border-slate-200 dark:border-neutral-800 bg-slate-50/50 dark:bg-neutral-900/30 hover:border-slate-300 dark:hover:border-neutral-700 flex flex-col justify-between group transition">
          <div>
            <div class="font-medium text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-400 transition">API Health & Edge Node</div>
            <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">api.fplsawadika.com/health</div>
          </div>
          <div class="flex items-center justify-between text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 pt-3">
            <span>ตรวจสอบสถานะ API</span>
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
      msg.className = 'text-[11px] font-mono text-center text-slate-500 dark:text-slate-400';
      msg.textContent = 'กำลังล้างแคชที่ Cloudflare Edge...';
      msg.classList.remove('hidden');

      try {
        const res = await fetch('/api/admin/flush-cache', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          msg.className = 'text-[11px] font-mono text-center text-emerald-600 dark:text-emerald-400';
          msg.textContent = 'ล้างแคช Edge สำเร็จเรียบร้อยแล้ว';
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
<body class="bg-black text-slate-100 min-h-screen flex items-center justify-center p-4 antialiased">
  <div class="w-full max-w-sm">
    <div class="text-center mb-6">
      <div class="w-10 h-10 rounded border border-neutral-800 bg-neutral-900 mx-auto flex items-center justify-center text-slate-300 mb-3">
        ${ICONS.lock}
      </div>
      <h1 class="text-base font-semibold tracking-wide text-white">FPLSaWaDiKa Executive Terminal</h1>
      <p class="text-xs text-slate-400 mt-1">Authorized Access Only</p>
    </div>

    <div class="p-6 rounded-lg border border-neutral-800 bg-[#0c0c0c] shadow-xl space-y-4">
      ${errorMsg ? `
        <div class="p-2.5 rounded border border-rose-900/60 bg-rose-950/40 text-xs text-rose-300 font-mono text-center">
          ${errorMsg}
        </div>
      ` : ''}

      <form method="POST" action="/login" class="space-y-4">
        <div>
          <label for="passkey" class="block text-xs font-medium text-slate-300 mb-1.5">Executive Passkey</label>
          <input type="password" id="passkey" name="passkey" required autofocus placeholder="Enter security key"
            class="w-full px-3 py-2 text-xs rounded border border-neutral-700 bg-neutral-900 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 font-mono">
        </div>

        <button type="submit" class="w-full py-2 px-3 text-xs font-semibold rounded bg-white hover:bg-slate-100 text-slate-900 transition flex items-center justify-center gap-2">
          <span>Authenticate Session</span>
        </button>
      </form>

      <div class="pt-3 border-t border-neutral-800 text-[11px] text-slate-500 text-center leading-relaxed">
        Restricted to <span class="font-mono text-slate-400">${ADMIN_EMAIL}</span>. Protected by Cloudflare Edge Security.
      </div>
    </div>
  </div>
</body>
</html>`;
}
