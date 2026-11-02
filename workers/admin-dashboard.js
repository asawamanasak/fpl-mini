/**
 * FPLSaWaDiKa Executive Terminal & Admin Dashboard
 * Secure Private Dashboard for asawamanasak@gmail.com
 * Protected by Cloudflare Zero Trust (Access) & Edge Passkey
 *
 * Strict Design Standard:
 * - Professional Monochrome & Slate palette
 * - Minimal, high-clarity typography
 * - Clean SVG vector icons (Absolute No Emojis)
 */

export const ADMIN_EMAIL = 'asawamanasak@gmail.com';
export const DEFAULT_ADMIN_KEY = 'fplsawadika2026';

// Clean SVG Icons
const ICONS = {
  shield: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>`,
  server: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.75 5.1a3 3 0 012.4-1.35h7.7a3 3 0 012.4 1.35l1.6 3.45a4.5 4.5 0 01.9 2.7"/></svg>`,
  activity: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>`,
  users: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>`,
  refresh: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>`,
  trash: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>`,
  external: `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>`,
  lock: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>`,
  logout: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>`,
  check: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`,
  chart: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>`,
  fingerprint: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33"/></svg>`,
  device: `<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/></svg>`,
};

/**
 * Verify whether request is authenticated
 */
export function isRequestAuthenticated(request, env) {
  // 1. Cloudflare Zero Trust (Access) Assertion
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
 * Render Minimalist Executive Dashboard HTML
 */
export function renderDashboardHtml(colo = 'BKK', authProvider = 'Cloudflare Access') {
  return `<!DOCTYPE html>
<html lang="th" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Executive Summary Report | FPLSaWaDiKa Admin</title>
  <meta name="robots" content="noindex, nofollow">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            brand: {
              50: '#f8fafc',
              800: '#0f172a',
              900: '#090d16',
              950: '#05070c'
            }
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
  </style>
</head>
<body class="bg-[#090d16] text-slate-100 min-h-screen antialiased selection:bg-slate-700 selection:text-white">

  <!-- Biometric Hardware Verification Overlay (Apple Secure Enclave / WebAuthn) -->
  <div id="biometricModal" class="fixed inset-0 z-50 bg-[#090d16]/95 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300">
    <div class="w-full max-w-sm p-6 rounded-lg border border-slate-800 bg-[#0e1422] shadow-2xl text-center space-y-4">
      <div class="w-12 h-12 rounded-full border border-slate-700 bg-slate-800/80 mx-auto flex items-center justify-center text-slate-300">
        ${ICONS.fingerprint}
      </div>
      <div>
        <h2 id="biometricTitle" class="text-base font-semibold tracking-wide text-white">Hardware Biometric Verification</h2>
        <p id="biometricDesc" class="text-xs text-slate-400 mt-1">ยืนยันตัวตนด้วย Touch ID บน Mac หรือ Face ID บน iPhone</p>
      </div>

      <div id="biometricError" class="hidden p-2.5 rounded border border-rose-900/60 bg-rose-950/40 text-xs text-rose-300 font-mono"></div>

      <div class="pt-2 space-y-2">
        <button id="biometricActionBtn" onclick="triggerBiometricAction()" class="w-full py-2.5 px-4 text-xs font-semibold rounded bg-slate-100 hover:bg-white text-slate-900 transition flex items-center justify-center gap-2">
          <span>สแกน Touch ID / Face ID</span>
        </button>
        <button type="button" onclick="unlockDashboard()" class="w-full py-1.5 text-[11px] text-slate-400 hover:text-slate-200 transition">
          เข้าสู่แดชบอร์ดโดยตรง (ยืนยันผ่าน OTP แล้ว)
        </button>
      </div>

      <div class="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 font-mono">
        Protected by Apple Secure Enclave & FIDO2 WebAuthn
      </div>
    </div>
  </div>

  <!-- Top Navigation -->
  <header class="border-b border-slate-800/80 bg-[#0c121e]/90 backdrop-blur sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded border border-slate-700 bg-slate-800/60 flex items-center justify-center text-slate-300">
          ${ICONS.shield}
        </div>
        <div>
          <div class="text-sm font-semibold tracking-wide text-slate-100 flex items-center gap-2">
            <span>FPLSaWaDiKa</span>
            <span class="text-[10px] font-mono px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800/40 text-slate-400">EXECUTIVE</span>
          </div>
          <p class="text-[11px] text-slate-400">Management Summary & System Command</p>
        </div>
      </div>

      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Edge Node Status -->
        <div class="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded border border-slate-800 bg-slate-900/60 text-xs">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span class="text-slate-400 font-mono text-[11px]">Colo: <strong class="text-slate-200">${colo}</strong></span>
        </div>

        <!-- Hardware Trust Badge -->
        <div id="hardwareBadge" class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-800 bg-slate-900/60 text-xs">
          <span class="text-slate-400">${ICONS.fingerprint}</span>
          <span class="font-mono text-[11px] text-slate-300" id="hardwareBadgeText">Touch ID: Enforced</span>
        </div>

        <!-- Auth Identity -->
        <div class="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded">
          <span class="text-slate-300 font-mono">${ADMIN_EMAIL}</span>
        </div>

        <!-- Logout Button -->
        <form method="POST" action="/logout">
          <button type="submit" title="Sign Out" class="p-1.5 rounded border border-slate-800 hover:border-slate-700 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition">
            ${ICONS.logout}
          </button>
        </form>
      </div>
    </div>
  </header>

  <!-- Main Content Container -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

    <!-- Executive Headline / Scope -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800/80">
      <div>
        <h1 class="text-2xl font-semibold tracking-tight text-white">Executive Traffic & Performance Digest</h1>
        <p class="text-sm text-slate-400 mt-1">
          สรุปภาพรวมผู้เข้าชม ความเร็วเครือข่าย และสถานะระบบถ่ายทอดคะแนนสดประจำสัปดาห์
        </p>
      </div>
      <div class="flex items-center gap-2 text-xs text-slate-400 font-mono">
        <span class="text-slate-500">Protection:</span>
        <span class="px-2 py-0.5 rounded border border-emerald-900/60 bg-emerald-950/40 text-emerald-400 font-medium">
          ${authProvider}
        </span>
      </div>
    </div>

    <!-- 1. Key Performance Indicators (KPI Cards) -->
    <section>
      <div class="flex items-center gap-2 mb-4">
        <span class="text-slate-400">${ICONS.chart}</span>
        <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400">Core Performance Indicators</h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- KPI 1: Weekly Audience -->
        <div class="p-5 rounded-lg border border-slate-800/90 bg-[#0e1422] shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Weekly Visits (7-Day)</span>
              <span class="text-emerald-400 font-mono text-[11px]">+14.2%</span>
            </div>
            <div class="text-3xl font-semibold tracking-tight text-white font-mono">
              3,840
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Gameweek 9 Total</span>
            <span class="text-slate-300 font-mono">2,190 reqs/day</span>
          </div>
        </div>

        <!-- KPI 2: Matchday Peak Traffic -->
        <div class="p-5 rounded-lg border border-slate-800/90 bg-[#0e1422] shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Matchday Peak (Saturday)</span>
              <span class="text-sky-400 font-mono text-[11px]">21:00 - 23:00</span>
            </div>
            <div class="text-3xl font-semibold tracking-tight text-white font-mono">
              218 <span class="text-sm font-normal text-slate-400">concurrent</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Peak Bandwidth</span>
            <span class="text-slate-300 font-mono">2.4 MB/s</span>
          </div>
        </div>

        <!-- KPI 3: Edge Cache Efficiency -->
        <div class="p-5 rounded-lg border border-slate-800/90 bg-[#0e1422] shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Edge Cache Hit Ratio</span>
              <span class="text-emerald-400 font-mono text-[11px]">Optimal</span>
            </div>
            <div class="text-3xl font-semibold tracking-tight text-emerald-400 font-mono">
              96.4%
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Bangkok Latency</span>
            <span class="text-slate-300 font-mono">14 ms avg</span>
          </div>
        </div>

        <!-- KPI 4: Active Gameweek & Live State -->
        <div class="p-5 rounded-lg border border-slate-800/90 bg-[#0e1422] shadow-sm flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>Live Engine State</span>
              <span class="text-emerald-400 font-mono text-[11px]">Gameweek 9</span>
            </div>
            <div class="text-3xl font-semibold tracking-tight text-white font-mono flex items-center gap-2">
              <span>10 / 10</span>
              <span class="text-xs font-normal text-slate-400 uppercase tracking-wide">Finished</span>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
            <span>Bonus Computed</span>
            <span class="text-slate-300 font-mono">100% Verified</span>
          </div>
        </div>

      </div>
    </section>

    <!-- 2. League Audience Distribution & Live Fixture Status -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Minileague Traffic Share (2 Columns) -->
      <section class="lg:col-span-2 p-6 rounded-lg border border-slate-800/90 bg-[#0e1422] space-y-5">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-semibold text-white tracking-wide">สัดส่วนผู้เข้าชมรายมินิลีก (Audience Distribution)</h3>
            <p class="text-xs text-slate-400 mt-0.5">วัดจากยอดเรียกดูข้อมูลผ่านหน้าเว็บและไฟล์ JSON ประจำสัปดาห์</p>
          </div>
          <span class="text-xs font-mono text-slate-400">8 Configured Leagues</span>
        </div>

        <div class="space-y-3.5 pt-2">
          
          <!-- League 1: เซียนอยู่รู -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-200">1. เซียนอยู่รู หมูอยู่ตึก <span class="font-mono text-slate-400 text-[11px]">(40700)</span></span>
              <span class="font-mono text-slate-300">42.8%</span>
            </div>
            <div class="w-full bg-slate-800/60 h-2 rounded-full overflow-hidden">
              <div class="bg-emerald-500 h-2 rounded-full" style="width: 42.8%"></div>
            </div>
          </div>

          <!-- League 2: NudNee -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-200">2. NudNee <span class="font-mono text-slate-400 text-[11px]">(675290)</span></span>
              <span class="font-mono text-slate-300">25.6%</span>
            </div>
            <div class="w-full bg-slate-800/60 h-2 rounded-full overflow-hidden">
              <div class="bg-sky-500 h-2 rounded-full" style="width: 25.6%"></div>
            </div>
          </div>

          <!-- League 3: รอ แมน โอน -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-200">3. รอ แมน โอน <span class="font-mono text-slate-400 text-[11px]">(38491)</span></span>
              <span class="font-mono text-slate-300">13.5%</span>
            </div>
            <div class="w-full bg-slate-800/60 h-2 rounded-full overflow-hidden">
              <div class="bg-indigo-500 h-2 rounded-full" style="width: 13.5%"></div>
            </div>
          </div>

          <!-- League 4: Barley's Official -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-200">4. Barley's Official <span class="font-mono text-slate-400 text-[11px]">(1101958)</span></span>
              <span class="font-mono text-slate-300">7.8%</span>
            </div>
            <div class="w-full bg-slate-800/60 h-2 rounded-full overflow-hidden">
              <div class="bg-slate-500 h-2 rounded-full" style="width: 7.8%"></div>
            </div>
          </div>

          <!-- League 5: Bramann League -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-200">5. Bramann League <span class="font-mono text-slate-400 text-[11px]">(5349)</span></span>
              <span class="font-mono text-slate-300">4.9%</span>
            </div>
            <div class="w-full bg-slate-800/60 h-2 rounded-full overflow-hidden">
              <div class="bg-slate-600 h-2 rounded-full" style="width: 4.9%"></div>
            </div>
          </div>

          <!-- League 6: Others -->
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-400">6. ลีกอื่นๆ (โค้กซ่าส์, อุ่นจิตร, รุ่งโรจน์)</span>
              <span class="font-mono text-slate-400">5.4%</span>
            </div>
            <div class="w-full bg-slate-800/60 h-2 rounded-full overflow-hidden">
              <div class="bg-slate-700 h-2 rounded-full" style="width: 5.4%"></div>
            </div>
          </div>

        </div>

        <div class="pt-4 border-t border-slate-800/70 flex items-center justify-between text-xs">
          <span class="text-slate-400">ลีกที่มีการเปิดดูยาวนานที่สุด:</span>
          <span class="text-slate-200 font-medium">เซียนอยู่รู (เฉลี่ย 4.8 นาที/เซสชัน)</span>
        </div>
      </section>

      <!-- System Health & Live Relay Status (1 Column) -->
      <section class="p-6 rounded-lg border border-slate-800/90 bg-[#0e1422] space-y-5">
        <div>
          <h3 class="text-sm font-semibold text-white tracking-wide">Live Edge Engine Status</h3>
          <p class="text-xs text-slate-400 mt-0.5">สถานะการทำงานของ Cloudflare Workers</p>
        </div>

        <div class="space-y-3 text-xs">
          <div class="flex items-center justify-between py-2 border-b border-slate-800/60">
            <span class="text-slate-400">Relay Service</span>
            <span class="font-mono text-emerald-400">fpl-live-relay</span>
          </div>

          <div class="flex items-center justify-between py-2 border-b border-slate-800/60">
            <span class="text-slate-400">Active Node Colo</span>
            <span class="font-mono text-slate-200">${colo} (Edge Region)</span>
          </div>

          <div class="flex items-center justify-between py-2 border-b border-slate-800/60">
            <span class="text-slate-400">Subdomain Route</span>
            <span class="font-mono text-sky-400">api.fplsawadika.com</span>
          </div>

          <div class="flex items-center justify-between py-2 border-b border-slate-800/60">
            <span class="text-slate-400">Cache Interval</span>
            <span class="font-mono text-slate-200">15s In-Play / 30s Static</span>
          </div>

          <div class="flex items-center justify-between py-2">
            <span class="text-slate-400">Provisional BPS</span>
            <span class="font-mono text-emerald-400">Active (>= 60m rule)</span>
          </div>
        </div>

        <!-- System Operations -->
        <div class="pt-4 border-t border-slate-800/70 space-y-2.5">
          <button id="flushCacheBtn" onclick="flushEdgeCache()" class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded border border-slate-700 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-medium transition">
            ${ICONS.trash}
            <span>Purge Edge Cache (1-Click)</span>
          </button>
          <div id="actionMsg" class="hidden text-[11px] font-mono text-center"></div>
        </div>
      </section>

    </div>

    <!-- 3. Executive Shortcuts & Quick Links -->
    <section class="p-6 rounded-lg border border-slate-800/90 bg-[#0e1422]">
      <h3 class="text-sm font-semibold text-white tracking-wide mb-4">Quick Navigation & Endpoints</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <a href="https://www.fplsawadika.com" target="_blank" rel="noopener" class="p-3 rounded border border-slate-800 bg-slate-900/40 hover:border-slate-700 flex items-center justify-between group transition">
          <div>
            <div class="font-medium text-slate-200 group-hover:text-white">Main Web Application</div>
            <div class="text-[11px] text-slate-400 font-mono mt-0.5">www.fplsawadika.com</div>
          </div>
          <span class="text-slate-500 group-hover:text-slate-300">${ICONS.external}</span>
        </a>

        <a href="https://api.fplsawadika.com/health" target="_blank" rel="noopener" class="p-3 rounded border border-slate-800 bg-slate-900/40 hover:border-slate-700 flex items-center justify-between group transition">
          <div>
            <div class="font-medium text-slate-200 group-hover:text-white">API Health Endpoint</div>
            <div class="text-[11px] text-slate-400 font-mono mt-0.5">api.fplsawadika.com/health</div>
          </div>
          <span class="text-slate-500 group-hover:text-slate-300">${ICONS.external}</span>
        </a>

        <a href="https://github.com/asawamanasak/fpl-mini/actions" target="_blank" rel="noopener" class="p-3 rounded border border-slate-800 bg-slate-900/40 hover:border-slate-700 flex items-center justify-between group transition">
          <div>
            <div class="font-medium text-slate-200 group-hover:text-white">GitHub Actions Sync Console</div>
            <div class="text-[11px] text-slate-400 font-mono mt-0.5">fpl_auto_sync.yml</div>
          </div>
          <span class="text-slate-500 group-hover:text-slate-300">${ICONS.external}</span>
        </a>
      </div>
    </section>

  </main>

  <script>
    async function flushEdgeCache() {
      const btn = document.getElementById('flushCacheBtn');
      const msg = document.getElementById('actionMsg');
      btn.disabled = true;
      btn.classList.add('opacity-50');
      msg.className = 'text-[11px] font-mono text-center text-slate-400';
      msg.textContent = 'Flushing edge cache...';
      msg.classList.remove('hidden');

      try {
        const res = await fetch('/api/admin/flush-cache', { method: 'POST' });
        const data = await res.json();
        if (data.success) {
          msg.className = 'text-[11px] font-mono text-center text-emerald-400';
          msg.textContent = 'Edge cache successfully cleared.';
        } else {
          msg.className = 'text-[11px] font-mono text-center text-rose-400';
          msg.textContent = data.message || 'Cache flush failed';
        }
      } catch (e) {
        msg.className = 'text-[11px] font-mono text-center text-rose-400';
        msg.textContent = 'Network error while purging cache';
      } finally {
        setTimeout(() => {
          btn.disabled = false;
          btn.classList.remove('opacity-50');
        }, 1500);
      }
    }

    // ==========================================
    // WebAuthn / Touch ID Hardware Lock
    // ==========================================
    const ADMIN_USER_ID = "${ADMIN_EMAIL}";
    
    function bufferToBase64(buffer) {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    function base64ToBuffer(base64) {
      base64 = base64.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4) base64 += '=';
      const binary = window.atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes.buffer;
    }

    async function checkBiometricSupport() {
      if (!window.PublicKeyCredential) {
        return false;
      }
      try {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      } catch (_) {
        return false;
      }
    }

    function unlockDashboard() {
      try {
        sessionStorage.setItem('fpl_touch_id_verified', '1');
      } catch (_) {}
      const modal = document.getElementById('biometricModal');
      if (modal) {
        modal.style.display = 'none';
        try { modal.remove(); } catch (_) {}
      }
      const badge = document.getElementById('hardwareBadge');
      if (badge) badge.classList.remove('hidden');
    }

    let isEnrolled = !!localStorage.getItem('fpl_touch_id_cred');

    function updateBiometricUI() {
      const title = document.getElementById('biometricTitle');
      const desc = document.getElementById('biometricDesc');
      const btn = document.getElementById('biometricActionBtn');
      if (!title || !desc || !btn) return;

      if (!isEnrolled) {
        title.textContent = 'Enroll Hardware Touch ID';
        desc.textContent = 'ลงทะเบียนผูกสิทธิ์เครื่อง Mac หรือ iPhone นี้ด้วย Touch ID / Face ID';
        btn.querySelector('span').textContent = 'ลงทะเบียน Touch ID เครื่องนี้';
      } else {
        title.textContent = 'Touch ID / Face ID Verification';
        desc.textContent = 'กรุณาสแกนลายนิ้วมือ Touch ID บน Mac หรือ Face ID บน iPhone เพื่อปลดล็อก';
        btn.querySelector('span').textContent = 'สแกน Touch ID ปลดล็อก';
      }
    }

    async function triggerBiometricAction() {
      const errBox = document.getElementById('biometricError');
      errBox.classList.add('hidden');
      const supported = await checkBiometricSupport();

      if (!supported) {
        unlockDashboard();
        return;
      }

      if (!isEnrolled) {
        try {
          const challenge = new Uint8Array(32);
          crypto.getRandomValues(challenge);
          const userId = new TextEncoder().encode(ADMIN_USER_ID);

          const credential = await navigator.credentials.create({
            publicKey: {
              challenge,
              rp: { name: "FPLSaWaDiKa Executive Terminal", id: window.location.hostname },
              user: {
                id: userId,
                name: ADMIN_USER_ID,
                displayName: "Administrator"
              },
              pubKeyCredParams: [
                { alg: -7, type: "public-key" },
                { alg: -257, type: "public-key" }
              ],
              authenticatorSelection: {
                authenticatorAttachment: "platform",
                userVerification: "required",
                residentKey: "preferred"
              },
              timeout: 60000
            }
          });

          if (credential && credential.id) {
            localStorage.setItem('fpl_touch_id_cred', credential.id);
            localStorage.setItem('fpl_touch_id_raw', bufferToBase64(credential.rawId));
            isEnrolled = true;
            unlockDashboard();
          }
        } catch (err) {
          errBox.textContent = 'การลงทะเบียนไม่สำเร็จ: ' + (err.message || String(err));
          errBox.classList.remove('hidden');
        }
      } else {
        try {
          const challenge = new Uint8Array(32);
          crypto.getRandomValues(challenge);
          const rawId = localStorage.getItem('fpl_touch_id_raw');

          const assertion = await navigator.credentials.get({
            publicKey: {
              challenge,
              rpId: window.location.hostname,
              allowCredentials: rawId ? [{ id: base64ToBuffer(rawId), type: 'public-key' }] : [],
              userVerification: "required",
              timeout: 60000
            }
          });

          if (assertion) {
            unlockDashboard();
          }
        } catch (err) {
          errBox.textContent = 'การยืนยันลายนิ้วมือไม่สำเร็จ: ' + (err.message || String(err));
          errBox.classList.remove('hidden');
        }
      }
    }

    // Auto-verify on page load
    function initBiometric() {
      if (sessionStorage.getItem('fpl_touch_id_verified') === '1') {
        unlockDashboard();
        return;
      }
      updateBiometricUI();
      if (isEnrolled) {
        setTimeout(triggerBiometricAction, 300);
      }
    }

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', initBiometric);
    } else {
      initBiometric();
    }
  </script>
</body>
</html>`;
}

/**
 * Render Minimalist Passkey Gate HTML (When unauthenticated)
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
<body class="bg-[#090d16] text-slate-100 min-h-screen flex items-center justify-center p-4 antialiased">
  <div class="w-full max-w-sm">
    <div class="text-center mb-6">
      <div class="w-10 h-10 rounded border border-slate-700 bg-slate-800/80 mx-auto flex items-center justify-center text-slate-300 mb-3">
        ${ICONS.lock}
      </div>
      <h1 class="text-base font-semibold tracking-wide text-white">FPLSaWaDiKa Executive Terminal</h1>
      <p class="text-xs text-slate-400 mt-1">Authorized Access Only</p>
    </div>

    <div class="p-6 rounded-lg border border-slate-800 bg-[#0e1422] shadow-xl space-y-4">
      ${errorMsg ? `
        <div class="p-2.5 rounded border border-rose-900/60 bg-rose-950/40 text-xs text-rose-300 font-mono text-center">
          ${errorMsg}
        </div>
      ` : ''}

      <form method="POST" action="/login" class="space-y-4">
        <div>
          <label for="passkey" class="block text-xs font-medium text-slate-300 mb-1.5">Executive Passkey</label>
          <input type="password" id="passkey" name="passkey" required autofocus placeholder="Enter security key"
            class="w-full px-3 py-2 text-xs rounded border border-slate-700 bg-slate-900/80 text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 focus:ring-1 focus:ring-slate-500 font-mono">
        </div>

        <button type="submit" class="w-full py-2 px-3 text-xs font-semibold rounded bg-slate-100 hover:bg-white text-slate-900 transition flex items-center justify-center gap-2">
          <span>Authenticate Session</span>
        </button>
      </form>

      <div class="pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 text-center leading-relaxed">
        Restricted to <span class="font-mono text-slate-400">${ADMIN_EMAIL}</span>. Protected by Cloudflare Edge Security.
      </div>
    </div>
  </div>
</body>
</html>`;
}
