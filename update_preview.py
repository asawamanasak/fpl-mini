import json

with open('real_fpl_40700_data.json', 'r', encoding='utf-8') as f:
    fpl_data = json.load(f)

# Cup data: FPL Mini-League Cup has not started yet at GW 1-2
fpl_data['cup'] = {
    'is_started': False,
    'is_finished': False,
    'prizes': {
        'champion': {'prize': 1000, 'status': 'รอผลการแข่งขัน'},
        'runnerUp': {'prize': 650, 'status': 'รอผลการแข่งขัน'}
    },
    'rounds': []
}

data_json_str = json.dumps(fpl_data, ensure_ascii=False, indent=2)

html_content = """<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>เซียนอยู่รู หมูอยู่ตึก 2026/27 | FPL League 40700</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            theme: {
              main: '#f8fafc',
              card: '#ffffff',
              border: '#e2e8f0',
              primary: '#0f172a',
              secondary: '#475569',
              muted: '#94a3b8'
            }
          },
          fontFamily: {
            sans: ['Sukhumvit Set', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
            display: ['Sukhumvit Set', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
          }
        }
      }
    }
  </script>

  <style>
    /* Sukhumvit Set Font-Face Declarations */
    @font-face {
      font-family: 'Sukhumvit Set';
      src: local('Sukhumvit Set'),
           local('SukhumvitSet-Text'),
           url('./fonts/SukhumvitSet-Text.ttf') format('truetype'),
           url('https://raw.githubusercontent.com/bluenex/baansuan_prannok/master/fonts/sukhumvit-set/SukhumvitSet-Text.ttf') format('truetype');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'Sukhumvit Set';
      src: local('Sukhumvit Set Medium'),
           local('SukhumvitSet-Medium'),
           url('./fonts/SukhumvitSet-Medium.ttf') format('truetype'),
           url('https://raw.githubusercontent.com/bluenex/baansuan_prannok/master/fonts/sukhumvit-set/SukhumvitSet-Medium.ttf') format('truetype');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'Sukhumvit Set';
      src: local('Sukhumvit Set SemiBold'),
           local('SukhumvitSet-SemiBold'),
           url('./fonts/SukhumvitSet-SemiBold.ttf') format('truetype'),
           url('https://raw.githubusercontent.com/bluenex/baansuan_prannok/master/fonts/sukhumvit-set/SukhumvitSet-SemiBold.ttf') format('truetype');
      font-weight: 600;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'Sukhumvit Set';
      src: local('Sukhumvit Set Bold'),
           local('SukhumvitSet-Bold'),
           url('./fonts/SukhumvitSet-Bold.ttf') format('truetype'),
           url('https://raw.githubusercontent.com/bluenex/baansuan_prannok/master/fonts/sukhumvit-set/SukhumvitSet-Bold.ttf') format('truetype');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }

    :root {
      --font-family: 'Sukhumvit Set', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    * {
      font-family: var(--font-family) !important;
    }

    body {
      font-family: var(--font-family) !important;
      background-color: #f8fafc;
      color: #0f172a;
      letter-spacing: -0.01em;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .font-display {
      font-family: var(--font-family) !important;
    }

    /* Minimalist Modern White Cards */
    .glass-card {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.03);
    }

    .glass-card-elevated {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -2px rgba(0, 0, 0, 0.04);
    }

    .glass-card-glow {
      background: #ffffff;
      border: 1.5px solid #10b981;
      box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.1);
    }

    .glass-card-live {
      background: #ffffff;
      border: 1.5px solid #0284c7;
      box-shadow: 0 4px 14px 0 rgba(2, 132, 199, 0.1);
    }

    .glass-card-gold {
      background: #ffffff;
      border: 1.5px solid #f59e0b;
      box-shadow: 0 4px 14px 0 rgba(245, 158, 11, 0.1);
    }

    /* Scrollbars */
    .scrollbar-thin::-webkit-scrollbar {
      height: 5px;
      width: 5px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 9999px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 9999px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }

    /* Hide scrollbar for clean touch swiping */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }

    .touch-scroll {
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-x: contain;
      scroll-snap-type: x mandatory;
    }

    .snap-center-item {
      scroll-snap-align: center;
    }

    /* Football Pitch Styling */
    .fpl-pitch {
      background: radial-gradient(circle at center, #1e5a29 0%, #15421c 70%, #0d2c13 100%);
      position: relative;
      border-radius: 1.25rem;
      border: 1.5px solid rgba(255, 255, 255, 0.25);
      overflow: hidden;
      box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-height: 340px;
      padding: 1rem 0.25rem;
    }

    @media (min-width: 640px) {
      .fpl-pitch {
        min-height: 400px;
        padding: 1.25rem 0.5rem;
      }
    }

    .fpl-pitch::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.25);
      pointer-events: none;
    }

    .fpl-pitch::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.25);
      pointer-events: none;
    }

    @media (min-width: 640px) {
      .fpl-pitch::after {
        width: 70px;
        height: 70px;
      }
    }

    .fpl-pitch-line {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;
      position: relative;
      z-index: 10;
      margin: 0.15rem 0;
    }

    @media (min-width: 640px) {
      .fpl-pitch-line {
        margin: 0.25rem 0;
      }
    }

    /* Chip Badges */
    .chip-badge {
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 0.35rem;
      display: inline-flex;
      align-items: center;
      letter-spacing: 0.02em;
    }
    .badge-3xc, .badge-triple_captain { background: #fdf2f8; color: #be185d; border: 1px solid #fbcfe8; }
    .badge-bboost, .badge-bench_boost { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .badge-freehit { background: #fff7ed; color: #c2410c; border: 1px solid #fed7aa; }
    .badge-wildcard { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }

    /* Modal Backdrop */
    .modal-backdrop {
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
    }
  </style>
</head>
<body class="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 antialiased selection:bg-slate-900 selection:text-white">

  <!-- ==================== 1. ส่วนหัวเว็บ (HEADER & GLOBAL NAVIGATION) ==================== -->
  <header class="border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
      
      <!-- 1.1 ข้อมูลประจำลีก (League Identity) -->
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xs sm:text-sm font-display flex-shrink-0 shadow-sm">
          FPL
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5 flex-wrap">
            <h1 class="text-sm sm:text-xl font-bold text-slate-900 tracking-tight truncate">เซียนอยู่รู หมูอยู่ตึก</h1>
            <span class="text-[9px] sm:text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200 px-1.5 sm:px-2 py-0.5 rounded-full font-display flex-shrink-0">
              LEAGUE 40700
            </span>
          </div>
          <p class="text-[11px] sm:text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium truncate">
            <span>ฤดูกาล 2026/27</span>
            <span>•</span>
            <span>12 ทีมสมาชิก</span>
          </p>
        </div>
      </div>

      <!-- 1.2 แถบสถานะระบบ & 1.3 ปุ่ม Action หลัก -->
      <div class="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        <div id="api-status-text" class="text-xs text-slate-700 hidden md:flex items-center bg-slate-100 px-3.5 py-1.5 rounded-xl border border-slate-200 font-medium">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-600 mr-2 animate-pulse"></span>
          Gameweek 2 กำลังแข่งขัน (Live)
        </div>

        <button 
          onclick="app.shareCurrentGameweek()"
          class="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-white transition-all shadow-sm active:scale-95 flex-shrink-0"
          title="คัดลอกสรุปผลและไฮไลท์สัปดาห์ปัจจุบันลงคลิปบอร์ด"
        >
          <svg class="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
          <span class="hidden sm:inline">คัดลอกสรุปส่ง LINE</span>
          <span class="sm:hidden text-[11px]">ส่ง LINE</span>
        </button>
      </div>

    </div>

    <!-- 1.4 แถบเมนู 5 แท็บหลัก -->
    <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 border-t border-slate-200/80">
      <nav class="flex space-x-1 sm:space-x-2 overflow-x-auto touch-scroll no-scrollbar py-1.5 sm:py-2">
        <button 
          data-tab-target="gameweek-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs"
        >
          LIVE (Gameweek Hub)
        </button>
        <button 
          data-tab-target="prizes-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 border border-transparent hover:text-slate-900 hover:bg-slate-100"
        >
          เงินรางวัล & รอบเคลียร์
        </button>
        <button 
          data-tab-target="hall-of-fame-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 border border-transparent hover:text-slate-900 hover:bg-slate-100"
        >
          Hall of Fame
        </button>
        <button 
          data-tab-target="cup-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 border border-transparent hover:text-slate-900 hover:bg-slate-100"
        >
          บอลถ้วย
        </button>
        <button 
          data-tab-target="rules-view" 
          class="tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 border border-transparent hover:text-slate-900 hover:bg-slate-100"
        >
          กติกาของลีก
        </button>
      </nav>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-3.5 sm:py-6 space-y-4 sm:space-y-6">

    <!-- ==================== 2. แท็บ 1: ผลสด & สัปดาห์ (LIVE - GAMEWEEK HUB) ==================== -->
    <div id="gameweek-view" class="tab-content space-y-4 sm:space-y-6">
      
      <!-- 1. ส่วนหัวของหน้า (Section Header) -->
      <div class="flex items-center justify-between gap-2">
        <h2 class="text-sm sm:text-lg font-bold text-slate-900 tracking-tight">
          เลือกรอบการแข่งขัน (GW 1 - 38)
        </h2>
        <span class="text-[10px] sm:text-xs font-semibold text-slate-500 font-display bg-white border border-slate-200 px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl flex-shrink-0 shadow-xs">
          GAMEWEEK MATCHDAY
        </span>
      </div>

      <!-- 2. แถบเลื่อนเลือกสัปดาห์ (Gameweek Selector) -->
      <div id="gw-selector-container" class="flex gap-1 sm:gap-1.5 overflow-x-auto touch-scroll no-scrollbar pb-1.5 pt-0.5">
        <!-- Dynamic Compact GW buttons -->
      </div>

      <!-- 3. การ์ดไฮไลท์ผลงานประจำสัปดาห์ (Gameweek Spotlight Card) -->
      <div id="champion-card-container">
        <!-- Dynamic Champion/Live Card -->
      </div>

      <!-- 4. ตารางคะแนนประจำสัปดาห์ & 5. ตารางคะแนนรวมสะสม -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
        
        <!-- 4. ตารางคะแนนประจำสัปดาห์ (Matchday Score Table) -->
        <div class="lg:col-span-7 glass-card rounded-2xl p-3.5 sm:p-6 border border-slate-200">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h3 class="text-sm sm:text-base font-bold text-slate-900">
                ตารางคะแนนประจำสัปดาห์นี้
              </h3>
              <p class="text-[11px] sm:text-xs text-slate-500 mt-0.5">คะแนนสุทธิ = แต้มดิบ - แต้มลบจากการย้ายตัว (Hits)</p>
            </div>
            <span id="gw-table-badge" class="text-[10px] sm:text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 sm:px-3 py-0.5 sm:py-1 rounded-xl font-display flex-shrink-0">
              MATCHDAY STANDINGS
            </span>
          </div>

          <div class="overflow-x-auto no-scrollbar">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/80 border-b border-slate-200 font-semibold">
                <tr>
                  <th class="py-2.5 px-1.5 sm:px-3.5 text-center w-8 sm:w-12">อันดับ</th>
                  <th class="py-2.5 px-2 sm:px-3.5">ทีม / ผู้จัดการ</th>
                  <th class="py-2.5 px-2 sm:px-3.5 text-center hidden sm:table-cell">กัปตัน (C)</th>
                  <th class="py-2.5 px-1 sm:px-3.5 text-center w-12 sm:w-16">แต้มดิบ</th>
                  <th class="py-2.5 px-1 sm:px-3.5 text-center w-10 sm:w-14 text-rose-600">Hits</th>
                  <th class="py-2.5 px-1.5 sm:px-3.5 text-center w-14 sm:w-20 text-slate-900">แต้มสุทธิ</th>
                  <th class="py-2.5 px-2 sm:px-3.5 text-center hidden sm:table-cell text-slate-400">สำรอง</th>
                </tr>
              </thead>
              <tbody id="matchday-table-body" class="divide-y divide-slate-100">
                <!-- Dynamic rows -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. ตารางคะแนนรวมสะสม (Overall Standings) -->
        <div class="lg:col-span-5 glass-card rounded-2xl p-3.5 sm:p-6 border border-slate-200">
          <div class="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h3 class="text-sm sm:text-base font-bold text-slate-900">
                ตารางคะแนนรวมสะสม (Overall Standings)
              </h3>
              <p class="text-[11px] sm:text-xs text-slate-500 mt-0.5">อันดับคะแนนรวมสะสมของทั้ง 12 ทีม</p>
            </div>
          </div>

          <div class="overflow-x-auto no-scrollbar">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead class="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/80 border-b border-slate-200 font-semibold">
                <tr>
                  <th class="py-2.5 px-1.5 sm:px-3.5 text-center w-8 sm:w-12">อันดับ</th>
                  <th class="py-2.5 px-2 sm:px-3.5">ทีม / ผู้จัดการ</th>
                  <th class="py-2.5 px-1 sm:px-3.5 text-center w-10 sm:w-14 text-slate-500">GW</th>
                  <th class="py-2.5 px-1.5 sm:px-3.5 text-center w-14 sm:w-20 text-slate-900">แต้มรวม</th>
                </tr>
              </thead>
              <tbody id="overall-standings-body" class="divide-y divide-slate-100">
                <!-- Dynamic rows -->
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>

    <!-- ==================== 3. แท็บ 2: เงินรางวัล & รอบเคลียร์ ==================== -->
    <div id="prizes-view" class="tab-content hidden space-y-4 sm:space-y-6">
      
      <!-- 3.1 ป้ายสรุปงบเงินรางวัลรวม -->
      <div class="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 relative overflow-hidden bg-white">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 relative z-10">
          <div>
            <span class="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 font-bold">TOTAL PRIZE MATRIX</span>
            <h2 class="text-xl sm:text-3xl font-bold text-slate-900 font-display mt-0.5">สรุปเงินรางวัลรวม 22,000 บาท</h2>
            <p class="text-[11px] sm:text-sm text-slate-500 mt-0.5">11 ทีม × ค่าสมัคร 2,000 บาท | แบ่ง 3 หมวดรางวัล</p>
          </div>
          <div class="grid grid-cols-3 gap-2 sm:gap-3">
            <div class="bg-slate-50 border border-slate-200 p-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-center">
              <span class="text-[9px] sm:text-[11px] text-slate-500 block leading-tight">แชมป์ 38 วีค</span>
              <strong class="text-slate-900 font-display text-xs sm:text-base block mt-0.5">13,300 บ.</strong>
            </div>
            <div class="bg-slate-50 border border-slate-200 p-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-center">
              <span class="text-[9px] sm:text-[11px] text-slate-500 block leading-tight">บอลถ้วย</span>
              <strong class="text-slate-900 font-display text-xs sm:text-base block mt-0.5">1,650 บ.</strong>
            </div>
            <div class="bg-slate-50 border border-slate-200 p-2 sm:px-4 sm:py-2.5 rounded-xl sm:rounded-2xl text-center">
              <span class="text-[9px] sm:text-[11px] text-slate-500 block leading-tight">แชมป์ลีก</span>
              <strong class="text-slate-900 font-display text-xs sm:text-base block mt-0.5">7,050 บ.</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- 3.2 ตารางเงินรางวัลสะสมของทั้ง 12 ทีม -->
      <div class="glass-card rounded-2xl p-3.5 sm:p-6 border border-slate-200">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h3 class="text-sm sm:text-base font-bold text-slate-900">
              ตารางสรุปเงินรางวัลสะสมของทั้ง 12 ทีม (ที่ได้รับจริง ณ ปัจจุบัน)
            </h3>
            <p class="text-[11px] sm:text-xs text-slate-500 mt-0.5">เงินรางวัลแชมป์วีคคำนวณเฉพาะสัปดาห์ที่แข่งเสร็จสิ้นแล้ว (350 บ./ครั้ง) | บอลถ้วยและแชมป์ลีกจะสรุปผลใน GW 38</p>
          </div>
        </div>

        <div class="overflow-x-auto no-scrollbar">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead class="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/80 border-b border-slate-200 font-semibold">
              <tr>
                <th class="py-2.5 px-1.5 sm:px-3.5 text-center w-8 sm:w-12">อันดับ</th>
                <th class="py-2.5 px-2 sm:px-3.5">ทีม / ผู้จัดการ</th>
                <th class="py-2.5 px-1 sm:px-3.5 text-center w-16 sm:w-24 text-slate-700">ชนะวีค</th>
                <th class="py-2.5 px-2 sm:px-3.5 text-center hidden sm:table-cell">แชมป์วีค (350 บ.)</th>
                <th class="py-2.5 px-2 sm:px-3.5 text-center hidden md:table-cell">บอลถ้วย</th>
                <th class="py-2.5 px-2 sm:px-3.5 text-center hidden md:table-cell">แชมป์ฤดูกาล</th>
                <th class="py-2.5 px-1.5 sm:px-3.5 text-center w-20 sm:w-28 text-slate-900">รวมเงินที่ได้รับจริง</th>
              </tr>
            </thead>
            <tbody id="prize-leaderboard-body" class="divide-y divide-slate-100">
              <!-- Dynamic Rows -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3.3 การ์ดรอบเคลียร์เงินรางวัล 6 Phase -->
      <div>
        <div class="mb-3 sm:mb-4">
          <h3 class="text-sm sm:text-base font-bold text-slate-900">
            รอบเคลียร์เงินรางวัล 6 Phase (ทุก 6 GW / ท้าย 8 GW)
          </h3>
          <p class="text-[11px] sm:text-xs text-slate-500 mt-0.5">สรุปยอดเงินรางวัลที่ต้องโอนเคลียร์ให้สมาชิกในแต่ละรอบ</p>
        </div>

        <div id="settlement-phases-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          <!-- Dynamic Phase Cards -->
        </div>
      </div>

    </div>

    <!-- ==================== 4. แท็บ 3: HALL OF FAME ==================== -->
    <div id="hall-of-fame-view" class="tab-content hidden space-y-4 sm:space-y-6">
      
      <!-- 4.1 การ์ดสถิติไฮไลท์ 4 ด้าน -->
      <div id="hall-of-fame-records" class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <!-- Dynamic Record Cards -->
      </div>

      <!-- 4.2 ตารางสถิติเชิงลึก 12 ทีม -->
      <div class="glass-card rounded-2xl p-3.5 sm:p-6 border border-slate-200">
        <div class="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h3 class="text-sm sm:text-base font-bold text-slate-900">
              สถิติเชิงลึกและประสิทธิภาพการเล่นของทั้ง 12 ทีม
            </h3>
            <p class="text-[11px] sm:text-xs text-slate-500 mt-0.5">สถิติคะแนนเฉลี่ย, อัตราติด Top 3, แต้มสูงสุด/ต่ำสุด และแต้มลบสะสม</p>
          </div>
        </div>

        <div class="overflow-x-auto no-scrollbar">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead class="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 bg-slate-50/80 border-b border-slate-200 font-semibold">
              <tr>
                <th class="py-2.5 px-1.5 sm:px-3.5 text-center w-8 sm:w-12">อันดับ</th>
                <th class="py-2.5 px-2 sm:px-3.5">ทีม / ผู้จัดการ</th>
                <th class="py-2.5 px-1 sm:px-3.5 text-center w-12 sm:w-16 text-slate-700">แชมป์วีค</th>
                <th class="py-2.5 px-1 sm:px-3.5 text-center w-14 sm:w-20 text-slate-700">เฉลี่ย/GW</th>
                <th class="py-2.5 px-2 sm:px-3.5 text-center hidden sm:table-cell">สูงสุด</th>
                <th class="py-2.5 px-2 sm:px-3.5 text-center hidden sm:table-cell">ต่ำสุด</th>
                <th class="py-2.5 px-2 sm:px-3.5 text-center hidden sm:table-cell text-rose-600">Hits รวม</th>
                <th class="py-2.5 px-1 sm:px-3.5 text-center w-14 sm:w-20 text-slate-700">% Top 3</th>
              </tr>
            </thead>
            <tbody id="hall-of-fame-table-body" class="divide-y divide-slate-100">
              <!-- Dynamic rows -->
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ==================== 5. แท็บ 4: บอลถ้วย ==================== -->
    <div id="cup-view" class="tab-content hidden space-y-6">
      <div id="cup-tournament-container">
        <!-- 5.1 การ์ดเงินรางวัลบอลถ้วย & 5.2 ผังการแข่งขันแบบ Knockout -->
      </div>
    </div>

    <!-- ==================== 6. แท็บ 5: กติกาของลีก ==================== -->
    <div id="rules-view" class="tab-content hidden space-y-4">
      
      <!-- Top Overview Banner -->
      <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-white">
        <div>
          <span class="text-[11px] uppercase tracking-widest text-slate-500 font-bold font-display">OFFICIAL LEAGUE RULES & PRIZE MATRIX</span>
          <h2 class="text-xl sm:text-2xl font-bold text-slate-900 font-display mt-0.5">กติกาแฟนตาซี เซียนอยู่รู หมูอยู่ตึก (ฤดูกาล 2026/27)</h2>
          <p class="text-xs text-slate-500 mt-0.5">LEAGUE ID: <strong class="text-slate-800">40700</strong> | สมาชิก 11-12 ทีม | ค่าสมัคร 2,000 บาท/ทีม | งบเงินรางวัลรวม <strong>22,000 บาท</strong></p>
        </div>
        <div class="flex items-center gap-2">
          <span class="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-3 py-1 rounded-xl font-bold font-display">38 GAMEWEEKS</span>
          <span class="bg-slate-100 text-slate-700 border border-slate-200 text-xs px-3 py-1 rounded-xl font-bold font-display">22,000 THB POOL</span>
        </div>
      </div>

      <!-- 3-Column Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <!-- Column 1: ข้อมูลลีก & แชมป์ประจำสัปดาห์ -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between space-y-3">
          <div>
            <div class="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
              <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center font-display">1</span>
              <h3 class="font-bold text-slate-900 text-sm">การแข่งขัน & แชมป์สัปดาห์</h3>
            </div>
            
            <div class="space-y-2 text-xs text-slate-600">
              <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <strong class="text-slate-900 block mb-0.5">• รูปแบบ & สมาชิก:</strong>
                <span>11-12 ทีม แข่งขัน 38 สัปดาห์ (GW 1 - 38) ชิงเงินรางวัลรวม 22,000 บาท (ค่าสมัคร 2,000 บ./ทีม)</span>
              </div>

              <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <strong class="text-slate-900 block mb-0.5">• แชมป์วีค 38 สัปดาห์ (งบ 13,300 บ.):</strong>
                <span>สัปดาห์ละ <strong>350 บาท</strong> คิดจากแต้มสุทธิ (Net Points = แต้มดิบ - Hits) เฉพาะสัปดาห์ที่แข่งจบแล้ว (หากแต้มเท่ากันหารรางวัลเท่ากัน)</span>
              </div>
            </div>
          </div>

          <div class="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            * หักแต้มย้ายทีม (Hits) มีผลโดยตรงต่อการตัดสินแชมป์วีค
          </div>
        </div>

        <!-- Column 2: รางวัลแชมป์ฤดูกาล & บอลถ้วย -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between space-y-3">
          <div>
            <div class="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
              <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center font-display">2</span>
              <h3 class="font-bold text-slate-900 text-sm">แชมป์ฤดูกาล & บอลถ้วย</h3>
            </div>

            <div class="space-y-2 text-xs text-slate-600">
              <!-- แชมป์ลีก -->
              <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <div class="flex justify-between items-center mb-1">
                  <strong class="text-slate-900">• แชมป์ลีก 4 อันดับ:</strong>
                  <span class="font-bold text-slate-800">รวม 7,050 บ.</span>
                </div>
                <div class="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                  <span>อันดับ 1: <strong class="text-slate-900">3,500 บ.</strong></span>
                  <span>อันดับ 2: <strong class="text-slate-900">2,000 บ.</strong></span>
                  <span>อันดับ 3: <strong class="text-slate-900">1,000 บ.</strong></span>
                  <span>อันดับ 4: <strong class="text-slate-900">550 บ.</strong></span>
                </div>
              </div>

              <!-- บอลถ้วย -->
              <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                <div class="flex justify-between items-center mb-1">
                  <strong class="text-slate-900">• บอลถ้วย (Knockout):</strong>
                  <span class="font-bold text-slate-800">รวม 1,650 บ.</span>
                </div>
                <div class="grid grid-cols-2 gap-1 text-[11px] text-slate-600">
                  <span>แชมป์บอลถ้วย: <strong class="text-slate-900">1,000 บ.</strong></span>
                  <span>รองแชมป์: <strong class="text-slate-900">650 บ.</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            * สรุปผลและมอบเงินรางวัลเมื่อสิ้นสุดการแข่งขันใน GW 38
          </div>
        </div>

        <!-- Column 3: รอบเคลียร์เงินรางวัล 6 Phase -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-slate-200 flex flex-col justify-between space-y-3">
          <div>
            <div class="flex items-center gap-2 mb-2 pb-2 border-b border-slate-100">
              <span class="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center font-display">3</span>
              <h3 class="font-bold text-slate-900 text-sm">รอบเคลียร์เงินรางวัล (6 Phase)</h3>
            </div>

            <div class="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1">
              <div class="flex justify-between py-0.5 border-b border-slate-200/60"><span>รอบ 1 (GW 1-6):</span><strong class="text-slate-900">2,100 บ.</strong></div>
              <div class="flex justify-between py-0.5 border-b border-slate-200/60"><span>รอบ 2 (GW 7-12):</span><strong class="text-slate-700">2,100 บ.</strong></div>
              <div class="flex justify-between py-0.5 border-b border-slate-200/60"><span>รอบ 3 (GW 13-18):</span><strong class="text-slate-700">2,100 บ.</strong></div>
              <div class="flex justify-between py-0.5 border-b border-slate-200/60"><span>รอบ 4 (GW 19-24):</span><strong class="text-slate-700">2,100 บ.</strong></div>
              <div class="flex justify-between py-0.5 border-b border-slate-200/60"><span>รอบ 5 (GW 25-30):</span><strong class="text-slate-700">2,100 บ.</strong></div>
              <div class="flex justify-between py-0.5 text-slate-900"><span>รอบ 6 (GW 31-38):</span><strong>11,500 บ.*</strong></div>
            </div>
          </div>

          <div class="text-[10px] text-slate-400 pt-2 border-t border-slate-100">
            * รอบ 6 รวมงบวีค 2,800 บ. + ถ้วย 1,650 บ. + แชมป์ลีก 7,050 บ.
          </div>
        </div>

      </div>

    </div>

  </main>

  <!-- ==================== 6. หน้าต่างป๊อปอัป ==================== -->

  <!-- 6.1 ผังสนามจัดทัพนักเตะ -->
  <div id="team-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden" onclick="if (event.target === this) app.closeTeamModal()">
    <div class="bg-white rounded-3xl p-6 max-w-2xl w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <div>
          <span class="text-xs uppercase tracking-wider text-slate-500 font-bold">ข้อมูลการจัดทัพสัปดาห์นี้</span>
          <h3 id="team-modal-title" class="text-xl font-bold text-slate-900">ชื่อทีม</h3>
        </div>
        <button onclick="app.closeTeamModal()" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Pitch -->
      <div class="fpl-pitch p-4 min-h-[360px] flex flex-col justify-around rounded-2xl mb-4">
        <div id="team-pitch-container" class="grid grid-cols-4 gap-2">
          <!-- Starting 11 -->
        </div>
      </div>

      <!-- Bench -->
      <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200/80">
        <span class="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-2">ตัวสำรอง (Substitutes)</span>
        <div id="team-bench-container" class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <!-- Bench players -->
        </div>
      </div>
    </div>
  </div>

  <!-- 6.2 หน้าต่างแก้ไขไฮไลท์ -->
  <div id="tagline-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden" onclick="if (event.target === this) app.closeTaglineModal()">
    <div class="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl relative" onclick="event.stopPropagation()">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
        <h3 id="tagline-modal-title" class="text-lg font-bold text-slate-900">แก้ไขจุดเด่น / Tagline ประจำสัปดาห์</h3>
        <button onclick="app.closeTaglineModal()" class="text-slate-400 hover:text-slate-600 p-1 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="space-y-4">
        <p class="text-xs text-slate-500">ใส่ข้อความไฮไลท์ หรือโน้ตจุดเด่นประจำวีคนี้ เพื่อแสดงบนหน้าเว็บและส่งลงกลุ่ม LINE:</p>
        <textarea 
          id="tagline-input" 
          rows="3" 
          class="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-slate-800"
          placeholder="เช่น บรูโน่กัปตันพาวิน ตัวสำรองยังช่วยยิง เซียนอยู่รูบอกเลยว่าของแทร่!"
        ></textarea>

        <div class="flex justify-end gap-2">
          <button onclick="app.closeTaglineModal()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700">ยกเลิก</button>
          <button id="tagline-save-btn" class="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-sm">บันทึกข้อความ</button>
        </div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 mt-auto">
    <div class="max-w-7xl mx-auto px-4">
      <p class="font-medium text-slate-700">เซียนอยู่รู หมูอยู่ตึก ฤดูกาล 2026/27 • League ID: 40700</p>
      <p class="mt-1 text-[11px] text-slate-400">Fantasy Premier League Mini-League Presentation Dashboard | Ready for GitHub Pages</p>
    </div>
  </footer>

  <!-- STANDALONE JAVASCRIPT LOGIC -->
  <script>
    const LEAGUE_CONFIG = {
      leagueId: 40700,
      leagueName: 'เซียนอยู่รู หมูอยู่ตึก',
      season: '2026/27',
      totalTeams: 12,
      entryFeePerTeam: 2000,
      totalPrizePool: 22000,
      totalGameweeks: 38,
      currentActiveGW: 2,
      prizes: {
        weekly: { amountPerWeek: 350, totalWeeks: 38, totalAmount: 13300 },
        cup: { champion: 1000, runnerUp: 650, totalAmount: 1650 },
        season: {
          ranks: [
            { rank: 1, prize: 3500, label: 'ชนะเลิศอันดับ 1' },
            { rank: 2, prize: 2000, label: 'รองชนะเลิศอันดับ 1' },
            { rank: 3, prize: 1000, label: 'อันดับ 3' },
            { rank: 4, prize: 550, label: 'อันดับ 4' }
          ],
          totalAmount: 7050
        }
      },
      settlementPhases: [
        { phase: 1, name: 'รอบที่ 1', startGW: 1, endGW: 6, weeks: 6, weeklyBudget: 2100, isFinal: false },
        { phase: 2, name: 'รอบที่ 2', startGW: 7, endGW: 12, weeks: 6, weeklyBudget: 2100, isFinal: false },
        { phase: 3, name: 'รอบที่ 3', startGW: 13, endGW: 18, weeks: 6, weeklyBudget: 2100, isFinal: false },
        { phase: 4, name: 'รอบที่ 4', startGW: 19, endGW: 24, weeks: 6, weeklyBudget: 2100, isFinal: false },
        { phase: 5, name: 'รอบที่ 5', startGW: 25, endGW: 30, weeks: 6, weeklyBudget: 2100, isFinal: false },
        { phase: 6, name: 'รอบที่ 6 (ท้ายฤดูกาล)', startGW: 31, endGW: 38, weeks: 8, weeklyBudget: 2800, isFinal: true, hasCup: true, hasSeasonPrizes: true }
      ]
    };

    // 100% REAL OFFICIAL DATA DIRECTLY FROM FPL API
    const MOCK_DATA = """ + data_json_str + """;

    /**
     * ระบบคิดสดและเขียนใหม่ทุกครั้ง (Dynamic Live Commentary Engine - Borbou Style)
     */
    class LiveCommentaryEngine {
      static generateFreshNote(gwNumber, gwData) {
        if (!gwData || !gwData.results || gwData.results.length === 0) {
          return "Gameweek นี้กำลังรอผลการแข่งขันจากสนามจริง";
        }

        const sorted = [...gwData.results].sort((a, b) => b.net_points - a.net_points);
        const leader = sorted[0];
        const runnerUp = sorted[1] || leader;
        const diff = leader.net_points - runnerUp.net_points;
        const isFinished = gwData.is_finished === true;
        const isJoint = diff === 0 && leader.entry_id !== runnerUp.entry_id;

        const hitTakers = sorted.filter(t => t.hits > 0);
        const mostHits = hitTakers.length > 0 ? [...hitTakers].sort((a, b) => b.hits - a.hits)[0] : null;

        if (isFinished) {
          const finishedTemplates = [
            `สุดยอดฟอร์มสัปดาห์นี้ ${leader.team_name} โชว์เก๋าคว้าแชมป์ GW ${gwNumber} ฟันแต้มสุทธิ ${leader.net_points} แต้ม รับเงินรางวัล 350 บาทเข้ากระเป๋าเหน่งๆ`,
            `${leader.team_name} ของผู้จัดการ ${leader.player_name} ร้อนแรงเกินต้าน กดไป ${leader.net_points} แต้มสุทธิ ซิวแชมป์วีค ${gwNumber} ไปครองอย่างสมศักดิ์ศรี`,
            `ไร้ข้อกังขา! ${leader.team_name} ${leader.captain ? 'ได้กัปตัน ' + leader.captain + ' ช่วยแบก' : 'ระเบิดฟอร์มจัดจ้าน'} กวาด ${leader.net_points} แต้ม เข้าป้ายแชมป์ Gameweek ${gwNumber} สำเร็จ`,
            `เซียนตัวจริงสัปดาห์นี้ต้องยกให้ ${leader.team_name} ซัดไป ${leader.net_points} แต้ม คว้าแชมป์ Gameweek ${gwNumber} พร้อมเงินรางวัล 350 บาทแบบไร้รอยต่อ`
          ];
          return finishedTemplates[Math.floor(Math.random() * finishedTemplates.length)];
        } else {
          const liveTemplates = [
            `สถานการณ์ล่าสุด GW ${gwNumber} ${leader.team_name} กำลังนำจ่าฝูงที่ ${leader.net_points} แต้มสุทธิ ${leader.captain ? '(กัปตัน ' + leader.captain + ')' : ''} เกมยังไม่จบอย่าเพิ่งนับศพทหาร`,
            `เดือดจัดกลางสัปดาห์! ${leader.team_name} ขึ้นแท่นผู้นำชั่วคราวด้วย ${leader.net_points} แต้ม ${runnerUp && !isJoint ? 'นำอันดับสอง ' + diff + ' แต้ม' : 'ขับเคี่ยวแต้มเท่ากัน'} รอลุ้นคู่ที่เหลือ`,
            `${leader.team_name} กุมความได้เปรียบสดๆ ที่ ${leader.net_points} แต้มสุทธิ ${mostHits ? 'ขณะที่ ' + mostHits.team_name + ' โดนหักย้ายตัวไป -' + mostHits.hits + ' แต้ม' : ''} รอดูว่าใครจะปาดหน้าท้ายวีค`,
            `ผู้นำชั่วคราว GW ${gwNumber} คือ ${leader.team_name} (${leader.net_points} แต้ม) ผลยังไม่นิ่ง คะแนนโบนัสและการแข่งขันที่เหลือพร้อมพลิกโผได้ทุกนาที`
          ];
          return liveTemplates[Math.floor(Math.random() * liveTemplates.length)];
        }
      }
    }

    /**
     * Main Application Controller (Fully Dynamic & Connected to Real FPL Data)
     */
    class StandaloneApp {
      constructor() {
        this.data = MOCK_DATA;
        this.config = LEAGUE_CONFIG;
        this.selectedGW = 2; // Default to current active Gameweek
        this.maxAvailableGW = 2;
        this.liveNotesCache = {};
        this.init();
      }

      init() {
        this.initTabNavigation();
        this.initKeyboardShortcuts();
        this.renderGameweekSelector();
        this.renderGameweekView();
        this.renderPrizesView();
        this.renderHallOfFameView();
        this.renderCupView();
      }

      initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') {
            this.closeTeamModal();
            this.closeTaglineModal();
          }
        });
      }

      /**
       * Dynamic Calculation: Overall Standings from All Available Gameweeks
       */
      getComputedStandings() {
        const teamsMap = {};
        (this.data.teams || []).forEach(t => {
          teamsMap[t.entry_id] = {
            entry_id: t.entry_id,
            entry_name: t.entry_name,
            player_name: t.player_name,
            total: 0,
            gw_points: 0,
            total_hits: 0,
            gw_history: {}
          };
        });

        // Compute cumulative points across all available gameweeks
        Object.keys(this.data.gameweeks || {}).forEach(gwKey => {
          const gw = this.data.gameweeks[gwKey];
          if (gw && gw.results) {
            gw.results.forEach(r => {
              if (teamsMap[r.entry_id]) {
                teamsMap[r.entry_id].total += (r.net_points || 0);
                teamsMap[r.entry_id].total_hits += (r.hits || 0);
                teamsMap[r.entry_id].gw_history[gwKey] = r.net_points || 0;
                if (parseInt(gwKey) === this.selectedGW) {
                  teamsMap[r.entry_id].gw_points = r.net_points || 0;
                }
              }
            });
          }
        });

        const list = Object.values(teamsMap).sort((a, b) => b.total - a.total);
        list.forEach((t, idx) => {
          t.rank = idx + 1;
        });
        return list;
      }

      /**
       * Dynamic Calculation: Prizes Leaderboard
       */
      getComputedPrizes() {
        const standings = this.getComputedStandings();
        const teamsMap = {};
        standings.forEach(t => {
          teamsMap[t.entry_id] = {
            ...t,
            weeklyWins: 0,
            wonGWs: [],
            weeklyPrize: 0,
            cupPrize: 0,
            seasonPrize: 0,
            actualTotal: 0
          };
        });

        // Scan only finished gameweeks
        Object.keys(this.data.gameweeks || {}).forEach(gwKey => {
          const gw = this.data.gameweeks[gwKey];
          if (gw && gw.is_finished === true && gw.results && gw.results.length > 0) {
            const sorted = [...gw.results].sort((a, b) => b.net_points - a.net_points);
            const highestNet = sorted[0].net_points;
            const winners = sorted.filter(r => r.net_points === highestNet);
            const prizePerWinner = 350 / winners.length;

            winners.forEach(w => {
              if (teamsMap[w.entry_id]) {
                teamsMap[w.entry_id].weeklyWins += (winners.length > 1 ? 0.5 : 1);
                teamsMap[w.entry_id].wonGWs.push(parseInt(gwKey));
                teamsMap[w.entry_id].weeklyPrize += prizePerWinner;
                teamsMap[w.entry_id].actualTotal += prizePerWinner;
              }
            });
          }
        });

        return Object.values(teamsMap).sort((a, b) => {
          if (b.actualTotal !== a.actualTotal) return b.actualTotal - a.actualTotal;
          return b.total - a.total;
        });
      }

      /**
       * Dynamic Calculation: Hall of Fame Records & Deep Dive
       */
      getComputedHallOfFame() {
        const standings = this.getComputedStandings();
        const prizes = this.getComputedPrizes();
        const prizesMap = {};
        prizes.forEach(p => { prizesMap[p.entry_id] = p; });

        let highestGWScore = { score: 0, teamName: '-', playerName: '-', gw: 1 };
        let mostWeeklyWins = { weeklyWins: 0, teamName: '-', playerName: '-' };
        let bestBenchPoints = { points: 0, teamName: '-', playerName: '-', gw: 1 };

        const totalGWs = Object.keys(this.data.gameweeks || {}).length || 1;

        // Scan all gameweek results for records
        Object.keys(this.data.gameweeks || {}).forEach(gwKey => {
          const gw = this.data.gameweeks[gwKey];
          if (gw && gw.results) {
            gw.results.forEach(r => {
              if (r.net_points > highestGWScore.score) {
                highestGWScore = { score: r.net_points, teamName: r.team_name, playerName: r.player_name, gw: parseInt(gwKey) };
              }
              if ((r.bench_points || 0) > bestBenchPoints.points) {
                bestBenchPoints = { points: r.bench_points || 0, teamName: r.team_name, playerName: r.player_name, gw: parseInt(gwKey) };
              }
            });
          }
        });

        // Most weekly wins
        const sortedByWins = [...prizes].sort((a, b) => b.weeklyWins - a.weeklyWins);
        if (sortedByWins.length > 0 && sortedByWins[0].weeklyWins > 0) {
          mostWeeklyWins = { weeklyWins: sortedByWins[0].weeklyWins, teamName: sortedByWins[0].entry_name, playerName: sortedByWins[0].player_name };
        } else if (sortedByWins.length > 0) {
          mostWeeklyWins = { weeklyWins: 0, teamName: sortedByWins[0].entry_name, playerName: sortedByWins[0].player_name };
        }

        // Leader / Highest Avg
        const highestAvgTeam = standings.length > 0 
          ? { avgNetPoints: (standings[0].total / totalGWs).toFixed(1), teamName: standings[0].entry_name, playerName: standings[0].player_name }
          : { avgNetPoints: 0, teamName: '-', playerName: '-' };

        // Team stats deep dive table
        const teamStats = standings.map(t => {
          const pw = prizesMap[t.entry_id] || { weeklyWins: 0 };
          const gwScores = Object.values(t.gw_history || {});
          const high = gwScores.length > 0 ? Math.max(...gwScores) : 0;
          const low = gwScores.length > 0 ? Math.min(...gwScores) : 0;
          const avg = (t.total / (gwScores.length || 1)).toFixed(1);

          // Calculate % Top 3 finishes in gameweeks
          let top3Count = 0;
          Object.keys(this.data.gameweeks || {}).forEach(gwKey => {
            const gw = this.data.gameweeks[gwKey];
            if (gw && gw.results) {
              const sorted = [...gw.results].sort((a, b) => b.net_points - a.net_points);
              const top3Ids = sorted.slice(0, 3).map(r => r.entry_id);
              if (top3Ids.includes(t.entry_id)) top3Count++;
            }
          });
          const top3Rate = Math.round((top3Count / (gwScores.length || 1)) * 100);

          return {
            entry_id: t.entry_id,
            teamName: t.entry_name,
            playerName: t.player_name,
            weeklyWins: pw.weeklyWins,
            avgNetPoints: avg,
            highestScore: high,
            lowestScore: low,
            totalHits: t.total_hits || 0,
            top3Rate: top3Rate
          };
        });

        return {
          records: { highestGWScore, mostWeeklyWins, highestAvgTeam, bestBenchPoints },
          teamStats: teamStats
        };
      }

      getNoteForCurrentGW() {
        const gw = this.selectedGW;
        if (!this.liveNotesCache[gw]) {
          const gwData = this.data.gameweeks[gw];
          this.liveNotesCache[gw] = LiveCommentaryEngine.generateFreshNote(gw, gwData);
        }
        return this.liveNotesCache[gw];
      }

      regenerateLiveNote() {
        const gw = this.selectedGW;
        const gwData = this.data.gameweeks[gw];
        const newNote = LiveCommentaryEngine.generateFreshNote(gw, gwData);
        this.liveNotesCache[gw] = newNote;
        
        const noteEl = document.getElementById('current-gw-note-text');
        if (noteEl) {
          noteEl.style.opacity = '0';
          setTimeout(() => {
            noteEl.innerText = `"${newNote}"`;
            noteEl.style.opacity = '1';
          }, 150);
        }
      }

      initTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-nav-btn');
        tabBtns.forEach(btn => {
          btn.addEventListener('click', (e) => {
            const targetId = btn.getAttribute('data-tab-target');
            
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(tc => tc.classList.add('hidden'));
            
            // Show active tab
            const activeTab = document.getElementById(targetId);
            if (activeTab) activeTab.classList.remove('hidden');

            // Reset tab styles
            tabBtns.forEach(b => {
              b.className = 'tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 text-slate-600 border border-transparent hover:text-slate-900 hover:bg-slate-100';
            });

            // Set active style
            btn.className = 'tab-nav-btn flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-slate-900 text-white shadow-xs';
          });
        });
      }

      selectGameweek(gw) {
        if (gw > this.maxAvailableGW) return;
        this.selectedGW = gw;
        this.renderGameweekSelector();
        this.renderGameweekView();
      }

      renderGameweekSelector() {
        const container = document.getElementById('gw-selector-container');
        if (!container) return;

        let html = '';
        for (let gw = 1; gw <= 38; gw++) {
          const isSelected = gw === this.selectedGW;
          const isLive = gw === this.maxAvailableGW;
          const isAvailable = gw <= this.maxAvailableGW;

          if (isAvailable) {
            html += `
              <button 
                onclick="app.selectGameweek(${gw})"
                class="flex-shrink-0 snap-center-item px-2 sm:px-2.5 py-1 rounded-xl font-medium text-xs transition-all duration-150 flex flex-col items-center min-w-[50px] sm:min-w-[54px] active:scale-95 ${
                  isSelected 
                    ? 'bg-slate-900 text-white font-bold shadow-sm scale-105 border-0' 
                    : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs'
                }"
              >
                <span class="text-[8px] uppercase font-semibold ${isSelected ? 'text-slate-300' : 'text-slate-400'} font-display leading-none">WEEK</span>
                <span class="text-sm font-bold font-display leading-tight my-0.5">${gw}</span>
                <span class="text-[8px] uppercase font-bold ${
                  isSelected 
                    ? 'text-emerald-400' 
                    : isLive 
                      ? 'text-rose-600' 
                      : 'text-slate-500'
                } font-display leading-none">
                  ${isLive ? 'LIVE' : 'FINISHED'}
                </span>
              </button>
            `;
          } else {
            html += `
              <div 
                class="flex-shrink-0 snap-center-item px-2 sm:px-2.5 py-1 rounded-xl text-xs flex flex-col items-center min-w-[50px] sm:min-w-[54px] bg-slate-100 text-slate-400 border border-slate-200/60 cursor-not-allowed opacity-60 select-none"
                title="ยังไม่ถึงสัปดาห์การแข่งขัน"
              >
                <span class="text-[8px] uppercase font-medium text-slate-400 font-display leading-none">WEEK</span>
                <span class="text-sm font-bold font-display leading-tight text-slate-400 my-0.5">${gw}</span>
                <span class="text-[8px] uppercase font-medium text-slate-400 font-display leading-none">LOCKED</span>
              </div>
            `;
          }
        }
        container.innerHTML = html;

        setTimeout(() => {
          const activeBtn = container.querySelector('.scale-105');
          if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }, 50);
      }

      renderGameweekView() {
        const gwData = this.data.gameweeks[this.selectedGW];
        const container = document.getElementById('champion-card-container');
        const matchdayBody = document.getElementById('matchday-table-body');
        const overallBody = document.getElementById('overall-standings-body');

        if (!gwData || !gwData.results) {
          container.innerHTML = `<div class="glass-card p-6 rounded-2xl text-center text-slate-500">ยังไม่มีข้อมูลการแข่งขันสำหรับ Gameweek ${this.selectedGW}</div>`;
          matchdayBody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400">รอผลการแข่งขัน</td></tr>`;
          return;
        }

        const isFinished = gwData.is_finished === true;
        const currentLiveNote = this.getNoteForCurrentGW();

        const results = gwData.results.map(r => {
          const t = this.data.teams.find(team => team.entry_id === r.entry_id) || {};
          return {
            ...r,
            team_name: t.entry_name || r.team_name,
            player_name: t.player_name || r.player_name
          };
        }).sort((a, b) => b.net_points - a.net_points);

        const leader = results[0];
        const isJoint = results[1] && results[1].net_points === leader.net_points;
        const chipBadge = leader.chip ? `<span class="chip-badge badge-${leader.chip.toLowerCase()}">${leader.chip}</span>` : '';

        // 3A: Finished Gameweek
        if (isFinished) {
          container.innerHTML = `
            <div class="relative overflow-hidden glass-card rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-slate-200">
              <div class="relative z-10">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 sm:mb-4">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-display flex-shrink-0 shadow-sm">
                      WIN
                    </div>
                    <div class="min-w-0">
                      <span class="text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500 font-bold font-display block leading-none">GAMEWEEK ${this.selectedGW} CHAMPION</span>
                      <h3 class="text-base sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 leading-tight truncate">แชมป์ประจำสัปดาห์</h3>
                    </div>
                  </div>

                  <div class="self-start sm:self-auto flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 sm:px-3.5 py-1 rounded-xl">
                    <span class="text-slate-800 font-bold text-[11px] sm:text-xs font-display">${isJoint ? 'แชมป์ร่วมประจำสัปดาห์' : 'สรุปผลประจำสัปดาห์'}</span>
                  </div>
                </div>

                <!-- Team Details & Responsive Stats Box -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-center bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-3 sm:mb-4">
                  <div class="md:col-span-2">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 class="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight break-words">
                        ${leader.team_name} ${isJoint ? '& ' + results[1].team_name : ''}
                      </h4>
                      ${chipBadge}
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-slate-600">
                      <span>ผู้จัดการ: <strong class="text-slate-900 font-semibold">${leader.player_name} ${isJoint ? '& ' + results[1].player_name : ''}</strong></span>
                      ${leader.captain ? `<span class="text-slate-700 font-medium">• กัปตัน: <strong>${leader.captain}</strong></span>` : ''}
                    </div>
                  </div>

                  <!-- 3-Box Stats Widget -->
                  <div class="grid grid-cols-3 gap-1.5 sm:gap-2 bg-white p-2 sm:p-3 rounded-xl border border-slate-200 text-center shadow-xs">
                    <div>
                      <span class="block text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-semibold font-display">RAW PTS</span>
                      <span class="text-base sm:text-lg font-bold text-slate-900 font-display">${leader.points}</span>
                    </div>
                    <div class="border-x border-slate-200">
                      <span class="block text-[9px] sm:text-[11px] uppercase tracking-wider text-rose-600 font-semibold font-display">HITS</span>
                      <span class="text-base sm:text-lg font-bold ${leader.hits > 0 ? 'text-rose-600' : 'text-slate-400'} font-display">${leader.hits > 0 ? `-${leader.hits}` : '0'}</span>
                    </div>
                    <div>
                      <span class="block text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-900 font-bold font-display">NET PTS</span>
                      <span class="text-lg sm:text-2xl font-black text-slate-900 font-display">${leader.net_points}</span>
                    </div>
                  </div>
                </div>

                <!-- 3.5 Champion Highlight Note (Borbou Style - Dynamic Live) -->
                <div class="bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <span class="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-bold font-display">CHAMPION HIGHLIGHT NOTE</span>
                    <div class="flex items-center gap-1 flex-shrink-0">
                      <button 
                        onclick="app.regenerateLiveNote()"
                        class="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-all"
                        title="สุ่มคิดโน้ตสดใหม่"
                      >
                        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </button>
                      <button 
                        id="tagline-edit-btn"
                        onclick="app.openTaglineModal(${this.selectedGW}, '${currentLiveNote.replace(/'/g, "\\'")}')"
                        class="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-all"
                        title="แก้ไขโน้ตด้วยตนเอง"
                      >
                        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                    </div>
                  </div>
                  <p id="current-gw-note-text" class="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                    "${currentLiveNote}"
                  </p>
                </div>
              </div>
            </div>
          `;
        } else {
          // 3B: Live Gameweek
          container.innerHTML = `
            <div class="relative overflow-hidden glass-card rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-slate-200">
              <div class="relative z-10">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 sm:mb-4">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-display flex-shrink-0 shadow-sm">
                      LIVE
                    </div>
                    <div class="min-w-0">
                      <span class="text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500 font-bold font-display block leading-none">GAMEWEEK ${this.selectedGW} (IN PROGRESS)</span>
                      <h3 class="text-base sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 leading-tight truncate">ผู้นำคะแนนประจำสัปดาห์ชั่วคราว</h3>
                    </div>
                  </div>

                  <div class="self-start sm:self-auto flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 sm:px-3.5 py-1 rounded-xl">
                    <span class="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                    <span class="text-slate-800 font-bold text-[11px] sm:text-xs font-display">กำลังแข่งขัน (ยังไม่จบสัปดาห์)</span>
                  </div>
                </div>

                <!-- Team Details & Responsive Stats Box -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-center bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-3 sm:mb-4">
                  <div class="md:col-span-2">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 class="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight break-words">
                        ${leader.team_name} ${isJoint ? '& ' + results[1].team_name : ''}
                      </h4>
                      ${chipBadge}
                    </div>
                    <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-slate-600">
                      <span>ผู้นำคะแนน: <strong class="text-slate-900 font-semibold">${leader.player_name} ${isJoint ? '& ' + results[1].player_name : ''}</strong></span>
                      ${leader.captain ? `<span class="text-slate-700 font-medium">• กัปตัน: <strong>${leader.captain}</strong></span>` : ''}
                    </div>
                    <p class="text-[10px] sm:text-[11px] text-slate-500 mt-1">หมายเหตุ: ผลคะแนนจะสรุปอย่างเป็นทางการเมื่อแข่งครบทุกคู่ในสัปดาห์</p>
                  </div>

                  <!-- 3-Box Stats Widget -->
                  <div class="grid grid-cols-3 gap-1.5 sm:gap-2 bg-white p-2 sm:p-3 rounded-xl border border-slate-200 text-center shadow-xs">
                    <div>
                      <span class="block text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-semibold font-display">RAW PTS</span>
                      <span class="text-base sm:text-lg font-bold text-slate-900 font-display">${leader.points}</span>
                    </div>
                    <div class="border-x border-slate-200">
                      <span class="block text-[9px] sm:text-[11px] uppercase tracking-wider text-rose-600 font-semibold font-display">HITS</span>
                      <span class="text-base sm:text-lg font-bold ${leader.hits > 0 ? 'text-rose-600' : 'text-slate-400'} font-display">${leader.hits > 0 ? `-${leader.hits}` : '0'}</span>
                    </div>
                    <div>
                      <span class="block text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-900 font-bold font-display">LIVE NET</span>
                      <span class="text-lg sm:text-2xl font-black text-slate-900 font-display">${leader.net_points}</span>
                    </div>
                  </div>
                </div>

                <!-- 3.5 Matchday Live Note (Borbou Style - Dynamic Live) -->
                <div class="bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4">
                  <div class="flex items-center justify-between gap-2 mb-1">
                    <span class="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-bold font-display">MATCHDAY LIVE NOTE</span>
                    <div class="flex items-center gap-1 flex-shrink-0">
                      <button 
                        onclick="app.regenerateLiveNote()"
                        class="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-all"
                        title="สุ่มคิดโน้ตสดใหม่"
                      >
                        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </button>
                      <button 
                        id="tagline-edit-btn"
                        onclick="app.openTaglineModal(${this.selectedGW}, '${currentLiveNote.replace(/'/g, "\\'")}')"
                        class="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-all"
                        title="แก้ไขโน้ตด้วยตนเอง"
                      >
                        <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                    </div>
                  </div>
                  <p id="current-gw-note-text" class="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                    "${currentLiveNote}"
                  </p>
                </div>
              </div>
            </div>
          `;
        }

        // 4. Matchday Table (Responsive on Phone / Tablet)
        let matchdayHtml = '';
        results.forEach((team, idx) => {
          const rankBadge = idx === 0 
            ? '<span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] sm:text-xs flex items-center justify-center font-display shadow-xs">1</span>'
            : idx === 1
              ? '<span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] sm:text-xs flex items-center justify-center font-display">2</span>'
              : idx === 2
                ? '<span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] sm:text-xs flex items-center justify-center font-display">3</span>'
                : `<span class="text-slate-400 text-xs font-medium font-display">${idx + 1}</span>`;

          const chip = team.chip ? `<span class="chip-badge badge-${team.chip.toLowerCase()} font-display">${team.chip}</span>` : '';
          const hits = team.hits > 0 ? `<span class="text-rose-600 font-bold font-display text-xs sm:text-sm">-${team.hits}</span>` : '<span class="text-slate-300 font-display text-xs sm:text-sm">-</span>';

          matchdayHtml += `
            <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
              <td class="py-2.5 px-1.5 sm:px-3.5 text-center">${rankBadge}</td>
              <td class="py-2.5 px-2 sm:px-3.5">
                <button onclick="app.openTeamModal(${team.entry_id}, '${team.team_name}')" class="text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-slate-600 transition-colors flex items-center gap-1.5 flex-wrap">
                  <span class="break-words">${team.team_name}</span>
                  ${chip}
                </button>
                <div class="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                  <span class="truncate max-w-[110px] sm:max-w-none">${team.player_name}</span>
                  <span class="sm:hidden text-slate-600 font-medium">• (C) ${team.captain || '-'}</span>
                </div>
              </td>
              <td class="py-2.5 px-2 sm:px-3.5 text-center hidden sm:table-cell">
                <span class="text-xs text-slate-600 font-medium">${team.captain || '-'}</span>
              </td>
              <td class="py-2.5 px-1 sm:px-3.5 text-center font-display font-medium text-slate-700 text-xs sm:text-sm">${team.points}</td>
              <td class="py-2.5 px-1 sm:px-3.5 text-center">${hits}</td>
              <td class="py-2.5 px-1.5 sm:px-3.5 text-center">
                <span class="text-xs sm:text-base font-bold font-display text-slate-900">${team.net_points}</span>
              </td>
              <td class="py-2.5 px-2 sm:px-3.5 text-center hidden sm:table-cell">
                <span class="text-xs text-slate-400 font-display">${team.bench_points || 0}</span>
              </td>
            </tr>
          `;
        });
        matchdayBody.innerHTML = matchdayHtml;

        // 5. Overall Standings Table (Computed Dynamically)
        const computedStandings = this.getComputedStandings();
        let overallHtml = '';
        computedStandings.forEach((team) => {
          const rank = team.rank;
          const isTop3 = rank <= 3;
          const rankBadge = rank === 1 
            ? '<span class="text-[8px] sm:text-[10px] bg-slate-900 text-white px-1 sm:px-2 py-0.5 rounded font-bold font-display flex-shrink-0">TOP 1</span>'
            : rank === 2
              ? '<span class="text-[8px] sm:text-[10px] bg-slate-200 text-slate-800 px-1 sm:px-2 py-0.5 rounded font-bold font-display flex-shrink-0">TOP 2</span>'
              : rank === 3
                ? '<span class="text-[8px] sm:text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-1 sm:px-2 py-0.5 rounded font-bold font-display flex-shrink-0">TOP 3</span>'
                : '';

          overallHtml += `
            <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100 ${isTop3 ? 'bg-slate-50/40' : ''}">
              <td class="py-2.5 px-1.5 sm:px-3.5 font-display font-bold text-center text-xs sm:text-sm text-slate-800">${rank}</td>
              <td class="py-2.5 px-2 sm:px-3.5">
                <button onclick="app.openTeamModal(${team.entry_id}, '${team.entry_name}')" class="font-bold text-xs sm:text-sm text-slate-900 hover:text-slate-600 transition-colors text-left block truncate max-w-[140px] sm:max-w-none">
                  ${team.entry_name}
                </button>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span class="text-[11px] text-slate-500 truncate max-w-[100px] sm:max-w-none">${team.player_name}</span>
                  ${rankBadge}
                </div>
              </td>
              <td class="py-2.5 px-1 sm:px-3.5 text-center font-display text-slate-600 text-xs sm:text-sm">${team.gw_points}</td>
              <td class="py-2.5 px-1.5 sm:px-3.5 text-center font-display font-black text-slate-900 text-xs sm:text-base">${team.total}</td>
            </tr>
          `;
        });
        overallBody.innerHTML = overallHtml;
      }

      renderPrizesView() {
        const prizeBody = document.getElementById('prize-leaderboard-body');
        const phaseContainer = document.getElementById('settlement-phases-container');

        const computedPrizes = this.getComputedPrizes();

        let prizeHtml = '';
        computedPrizes.forEach((t, idx) => {
          const actualTotal = t.actualTotal;
          prizeHtml += `
            <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
              <td class="py-2.5 px-1.5 sm:px-3.5 font-display font-bold text-center text-xs sm:text-sm text-slate-800">${idx + 1}</td>
              <td class="py-2.5 px-2 sm:px-3.5">
                <span class="font-bold text-xs sm:text-sm text-slate-900 block truncate max-w-[130px] sm:max-w-none">${t.entry_name}</span>
                <span class="text-[11px] text-slate-500 truncate block max-w-[110px] sm:max-w-none">${t.player_name}</span>
              </td>
              <td class="py-2.5 px-1 sm:px-3.5 text-center font-display font-bold text-slate-800 text-xs sm:text-sm">
                ${t.weeklyWins > 0 ? t.weeklyWins + ' ครั้ง' : '0'}
                ${t.wonGWs.length > 0 ? `<span class="block text-[8px] sm:text-[10px] text-slate-400 font-normal font-display">(GW ${t.wonGWs.join(', ')})</span>` : ''}
              </td>
              <td class="py-2.5 px-2 sm:px-3.5 text-center font-display text-slate-700 text-xs sm:text-sm hidden sm:table-cell">${t.weeklyPrize > 0 ? t.weeklyPrize.toLocaleString() + ' บาท' : '-'}</td>
              <td class="py-2.5 px-2 sm:px-3.5 text-center font-display text-slate-400 text-[11px] sm:text-xs hidden md:table-cell">-</td>
              <td class="py-2.5 px-2 sm:px-3.5 text-center font-display text-slate-400 text-[11px] sm:text-xs hidden md:table-cell">-</td>
              <td class="py-2.5 px-1.5 sm:px-3.5 text-center font-display font-bold text-xs sm:text-base text-slate-900">
                ${actualTotal > 0 ? actualTotal.toLocaleString() + ' บ.' : '-'}
              </td>
            </tr>
          `;
        });
        if (prizeBody) prizeBody.innerHTML = prizeHtml;

        // Settlement Phases
        let phaseHtml = '';
        this.config.settlementPhases.forEach(p => {
          const isP1 = p.phase === 1;
          const isCompleted = false;
          const isCurrent = isP1;

          const badgeClass = isCompleted 
            ? 'bg-slate-900 text-white' 
            : isCurrent 
              ? 'bg-slate-100 text-slate-800 border-slate-300' 
              : 'bg-slate-50 text-slate-400 border-slate-200';

          const statusText = isCompleted 
            ? 'เสร็จสิ้นรอบแล้ว' 
            : isCurrent 
              ? 'ยังไม่ครบรอบ (1/6 GW)' 
              : 'ยังไม่ถึงรอบ';

          const buttonHtml = isCompleted
            ? `<button 
                onclick="app.copyPhaseShareText(${p.phase})" 
                class="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all flex items-center gap-1.5 active:scale-95 shadow-xs min-h-[36px]"
              >
                <span>ส่ง LINE</span>
              </button>`
            : `<button 
                disabled 
                class="text-xs bg-slate-100 text-slate-400 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-slate-200 cursor-not-allowed opacity-60 select-none min-h-[36px]"
                title="ยังแข่งไม่ครบจำนวนสัปดาห์ในรอบนี้"
              >
                <span>ยังไม่ครบรอบ</span>
              </button>`;

          phaseHtml += `
            <div class="glass-card rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200 flex flex-col justify-between ${!isCompleted ? 'opacity-90' : ''}">
              <div>
                <div class="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                  <span class="text-[11px] sm:text-xs uppercase tracking-wider font-bold text-slate-500 font-display">${p.name}</span>
                  <span class="text-[9px] sm:text-[11px] px-2 py-0.5 rounded-full border ${badgeClass} font-semibold flex-shrink-0">${statusText}</span>
                </div>
                <h4 class="text-sm sm:text-base font-bold text-slate-900 font-display mb-0.5">GW ${p.startGW} - ${p.endGW} (${p.weeks} สัปดาห์)</h4>
                <p class="text-[11px] sm:text-xs text-slate-500 mb-2.5 sm:mb-3">งบแชมป์วีค: <strong class="text-slate-800">${p.weeklyBudget.toLocaleString()} บาท</strong> ${p.hasCup ? '+ ถ้วย & ลีก' : ''}</p>
                
                <div class="bg-slate-50 rounded-xl p-2.5 sm:p-3.5 mb-2.5 sm:mb-3.5 border border-slate-200/80">
                  <span class="text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">สรุปแชมป์วีคที่สรุปผลแล้ว:</span>
                  ${isP1 ? `
                    <div class="space-y-1 text-xs">
                      <div class="flex justify-between items-center"><span class="text-slate-800 truncate max-w-[130px] sm:max-w-none">1. GEMINI UNITED (GW 1)</span><strong class="text-slate-900 flex-shrink-0">350 บ.</strong></div>
                      <div class="flex justify-between items-center text-slate-500"><span>- GW 2 (กำลังเตะ)</span><span class="text-rose-600 font-medium">รอจบวีค</span></div>
                      <div class="flex justify-between items-center text-slate-400"><span>- GW 3 - 6</span><span>รอแข่ง</span></div>
                    </div>
                  ` : '<p class="text-xs text-slate-400 py-1 text-center">รอผลการแข่งขันในรอบนี้</p>'}
                </div>
              </div>

              <div class="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span class="text-xs text-slate-500">จ่ายแล้ว: <strong class="text-slate-900 font-display font-bold">${isP1 ? '350' : '0'} บ.</strong></span>
                ${buttonHtml}
              </div>
            </div>
          `;
        });
        if (phaseContainer) phaseContainer.innerHTML = phaseHtml;
      }

      renderHallOfFameView() {
        const recordsContainer = document.getElementById('hall-of-fame-records');
        const hofTable = document.getElementById('hall-of-fame-table-body');

        const hofData = this.getComputedHallOfFame();
        const records = hofData.records;
        const teamStats = hofData.teamStats;

        if (recordsContainer) {
          recordsContainer.innerHTML = `
            <div class="glass-card p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span class="text-[9px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold block mb-0.5 truncate">คะแนนสูงสุด 1 วีค</span>
                <div class="flex items-baseline gap-1 my-0.5">
                  <span class="text-xl sm:text-3xl font-black text-slate-900 font-display">${records.highestGWScore.score}</span>
                  <span class="text-[8px] sm:text-xs text-slate-500 font-medium font-display">PTS (GW ${records.highestGWScore.gw})</span>
                </div>
              </div>
              <div>
                <p class="text-xs sm:text-sm font-bold text-slate-900 truncate">${records.highestGWScore.teamName}</p>
                <span class="text-[10px] sm:text-[11px] text-slate-500 truncate block">${records.highestGWScore.playerName}</span>
              </div>
            </div>

            <div class="glass-card p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span class="text-[9px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold block mb-0.5 truncate">จอมกวาดแชมป์วีค</span>
                <div class="flex items-baseline gap-1 my-0.5">
                  <span class="text-xl sm:text-3xl font-black text-slate-900 font-display">${records.mostWeeklyWins.weeklyWins}</span>
                  <span class="text-[8px] sm:text-xs text-slate-500 font-medium">ครั้ง (GW 1)</span>
                </div>
              </div>
              <div>
                <p class="text-xs sm:text-sm font-bold text-slate-900 truncate">${records.mostWeeklyWins.teamName}</p>
                <span class="text-[10px] sm:text-[11px] text-slate-500 truncate block">${records.mostWeeklyWins.playerName}</span>
              </div>
            </div>

            <div class="glass-card p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span class="text-[9px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold block mb-0.5 truncate">จ่าฝูงแต้มรวมสูงสุด</span>
                <div class="flex items-baseline gap-1 my-0.5">
                  <span class="text-xl sm:text-3xl font-black text-slate-900 font-display">${records.highestAvgTeam.avgNetPoints}</span>
                  <span class="text-[8px] sm:text-xs text-slate-500 font-medium font-display">AVG / GW</span>
                </div>
              </div>
              <div>
                <p class="text-xs sm:text-sm font-bold text-slate-900 truncate">${records.highestAvgTeam.teamName}</p>
                <span class="text-[10px] sm:text-[11px] text-slate-500 truncate block">${records.highestAvgTeam.playerName}</span>
              </div>
            </div>

            <div class="glass-card p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span class="text-[9px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold block mb-0.5 truncate">สำรองแต้มกระจาย</span>
                <div class="flex items-baseline gap-1 my-0.5">
                  <span class="text-xl sm:text-3xl font-black text-slate-900 font-display">${records.bestBenchPoints.points}</span>
                  <span class="text-[8px] sm:text-xs text-slate-500 font-medium font-display">BENCH (GW ${records.bestBenchPoints.gw})</span>
                </div>
              </div>
              <div>
                <p class="text-xs sm:text-sm font-bold text-slate-900 truncate">${records.bestBenchPoints.teamName}</p>
                <span class="text-[10px] sm:text-[11px] text-slate-500 truncate block">${records.bestBenchPoints.playerName}</span>
              </div>
            </div>
          `;
        }

        if (hofTable) {
          let hofHtml = '';
          teamStats.forEach((t, idx) => {
            hofHtml += `
              <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
                <td class="py-2.5 px-1.5 sm:px-3.5 font-display font-bold text-center text-slate-500 text-xs sm:text-sm">${idx + 1}</td>
                <td class="py-2.5 px-2 sm:px-3.5">
                  <span class="font-bold text-xs sm:text-sm text-slate-900 block truncate max-w-[130px] sm:max-w-none">${t.teamName}</span>
                  <span class="text-[11px] text-slate-500 truncate block max-w-[110px] sm:max-w-none">${t.playerName}</span>
                </td>
                <td class="py-2.5 px-1 sm:px-3.5 text-center font-display font-bold text-slate-900 text-xs sm:text-sm">${t.weeklyWins}</td>
                <td class="py-2.5 px-1 sm:px-3.5 text-center font-display font-bold text-slate-800 text-xs sm:text-sm">${t.avgNetPoints}</td>
                <td class="py-2.5 px-2 sm:px-3.5 text-center font-display text-slate-600 text-xs sm:text-sm hidden sm:table-cell">${t.highestScore}</td>
                <td class="py-2.5 px-2 sm:px-3.5 text-center font-display text-slate-400 text-xs sm:text-sm hidden sm:table-cell">${t.lowestScore}</td>
                <td class="py-2.5 px-2 sm:px-3.5 text-center font-display text-rose-600 text-xs sm:text-sm hidden sm:table-cell">-${t.totalHits}</td>
                <td class="py-2.5 px-1 sm:px-3.5 text-center font-display text-slate-800 font-semibold text-xs sm:text-sm">${t.top3Rate}%</td>
              </tr>
            `;
          });
          hofTable.innerHTML = hofHtml;
        }
      }

      renderCupView() {
        const container = document.getElementById('cup-tournament-container');
        if (!container) return;

        container.innerHTML = `
          <!-- Header Banner -->
          <div class="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200 relative overflow-hidden bg-white">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <span class="text-[10px] sm:text-xs uppercase tracking-widest text-slate-500 font-bold font-display">MINI-LEAGUE KNOCKOUT TOURNAMENT</span>
                <h3 class="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5">ฟุตบอลถ้วยแฟนตาซี (League Cup)</h3>
                <p class="text-xs sm:text-sm text-slate-500 mt-0.5">การแข่งขันแบบแพ้คัดออก (Knockout) เงินรางวัลรวม 1,650 บาท</p>
              </div>
              <div class="self-start sm:self-auto flex items-center gap-2 bg-slate-100 border border-slate-200 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl">
                <span class="w-2 h-2 rounded-full bg-slate-400"></span>
                <span class="text-slate-700 font-bold text-xs sm:text-sm font-display">ยังไม่เริ่มการแข่งขัน (รอระบบ FPL)</span>
              </div>
            </div>
          </div>

          <!-- Prize Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
            <div class="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 text-center">
              <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold font-display">CUP CHAMPION (แชมป์บอลถ้วย)</span>
              <h4 class="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1 sm:mt-2 mb-0.5 sm:mb-1">1,000 บาท</h4>
              <span class="text-[11px] sm:text-xs text-slate-500 mt-0.5 block">สถานะ: รอผลการแข่งขันรอบชิงชนะเลิศ</span>
            </div>

            <div class="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 text-center">
              <span class="text-[10px] sm:text-xs uppercase tracking-wider text-slate-500 font-bold font-display">CUP RUNNER-UP (รองแชมป์บอลถ้วย)</span>
              <h4 class="text-2xl sm:text-3xl font-black text-slate-900 font-display mt-1 sm:mt-2 mb-0.5 sm:mb-1">650 บาท</h4>
              <span class="text-[11px] sm:text-xs text-slate-500 mt-0.5 block">สถานะ: รอผลการแข่งขันรอบชิงชนะเลิศ</span>
            </div>
          </div>

          <!-- Tournament Status Box -->
          <div class="glass-card rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 text-center">
            <div class="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto mb-3 sm:mb-4 text-slate-700">
              <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h4 class="text-base sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2">หน้านี้จะแสดงผลผังการแข่งขันและผลคะแนนเมื่อบอลถ้วยจบลงแล้ว</h4>
            <p class="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
              การแข่งขันฟุตบอลถ้วยของมินิลีก (Mini-League Cup) จะเริ่มแข่งขันตามรอบที่ระบบ FPL กำหนด 
              โดยระบบจะทำการจับสลากประกบคู่แข่งขันแบบน็อกเอาต์แพ้คัดออก (รอบ 8 ทีม, รอบรองชนะเลิศ และรอบชิงชนะเลิศ) 
              และจะแสดงผลคะแนนรวมถึงผู้ชนะอย่างเป็นทางการในหน้านี้เมื่อการแข่งขันเสร็จสิ้น
            </p>
          </div>
        `;
      }

      openTeamModal(entryId, teamName) {
        document.getElementById('team-modal-title').innerText = teamName;
        const pitch = document.getElementById('team-pitch-container');
        const bench = document.getElementById('team-bench-container');

        const squadKey = `${entryId}_${this.selectedGW}`;
        const squad = this.data.squads[squadKey] || Object.values(this.data.squads)[0];

        if (squad && squad.starting) {
          const gks = squad.starting.filter(p => p.pos === 'GKP');
          const defs = squad.starting.filter(p => p.pos === 'DEF');
          const mids = squad.starting.filter(p => p.pos === 'MID');
          const fwds = squad.starting.filter(p => p.pos === 'FWD');

          const renderPlayerCard = (p) => `
            <div class="flex flex-col items-center justify-center p-0.5 text-center flex-1 max-w-[56px] xs:max-w-[64px] sm:max-w-[80px]">
              <div class="relative">
                <div class="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-slate-900 border-2 ${p.is_captain ? 'border-amber-400 ring-2 ring-amber-400/30' : p.is_vice ? 'border-slate-300' : 'border-emerald-400/50'} flex items-center justify-center shadow-md">
                  <span class="text-[8px] sm:text-[10px] font-bold text-white">${p.pos}</span>
                </div>
                ${p.is_captain ? '<span class="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[7px] sm:text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-display shadow">C</span>' : ''}
                ${p.is_vice ? '<span class="absolute -top-1 -right-1 bg-slate-200 text-slate-950 font-black text-[7px] sm:text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-display shadow">V</span>' : ''}
              </div>
              <span class="font-bold text-[9px] sm:text-[11px] text-white bg-black/80 px-1 py-0.5 rounded mt-0.5 truncate max-w-full block">${p.name}</span>
              <span class="text-[8px] sm:text-[10px] font-bold text-emerald-300 font-display mt-0.5">${p.points} pts</span>
            </div>
          `;

          pitch.innerHTML = `
            <div class="fpl-pitch-line">${gks.map(renderPlayerCard).join('')}</div>
            <div class="fpl-pitch-line">${defs.map(renderPlayerCard).join('')}</div>
            <div class="fpl-pitch-line">${mids.map(renderPlayerCard).join('')}</div>
            <div class="fpl-pitch-line">${fwds.map(renderPlayerCard).join('')}</div>
          `;
        }

        if (squad && squad.bench) {
          let bHtml = '';
          squad.bench.forEach(p => {
            bHtml += `
              <div class="bg-white border border-slate-200 rounded-xl p-2 sm:p-2.5 flex items-center justify-between shadow-xs">
                <div class="flex items-center gap-2">
                  <span class="text-[9px] sm:text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-display">${p.pos}</span>
                  <span class="text-xs font-bold text-slate-900">${p.name}</span>
                </div>
                <span class="text-xs font-bold text-slate-500 font-display">${p.points} pts</span>
              </div>
            `;
          });
          bench.innerHTML = bHtml;
        }

        document.getElementById('team-modal').classList.remove('hidden');
      }

      closeTeamModal() {
        const modal = document.getElementById('team-modal');
        if (modal) modal.classList.add('hidden');
      }

      openTaglineModal(gw, text) {
        document.getElementById('tagline-modal-title').innerText = `แก้ไขจุดเด่น Gameweek ${gw}`;
        const input = document.getElementById('tagline-input');
        input.value = text;
        document.getElementById('tagline-modal').classList.remove('hidden');
        input.focus();

        document.getElementById('tagline-save-btn').onclick = () => {
          this.liveNotesCache[gw] = input.value;
          this.closeTaglineModal();
          this.renderGameweekView();
        };
      }

      closeTaglineModal() {
        const modal = document.getElementById('tagline-modal');
        if (modal) modal.classList.add('hidden');
      }

      shareCurrentGameweek() {
        const gwData = this.data.gameweeks[this.selectedGW];
        if (!gwData || !gwData.results) return;

        const isFinished = gwData.is_finished === true;
        const sorted = [...gwData.results].sort((a, b) => b.net_points - a.net_points);
        const leader = sorted[0];
        const currentLiveNote = this.getNoteForCurrentGW();

        const hitTakers = sorted.filter(t => t.hits > 0).map(t => `${t.team_name} (-${t.hits})`).join(', ');
        const chipsUsed = sorted.filter(t => t.chip).map(t => `${t.team_name} (${t.chip})`).join(', ');

        let text = `เซียนอยู่รู หมูอยู่ตึก (League 40700)\n`;
        text += `สรุปผล Gameweek ${this.selectedGW} (${isFinished ? 'จบการแข่งขัน' : 'กำลังแข่งขัน'})\n\n`;

        if (isFinished) {
          text += `แชมป์ประจำสัปดาห์: ${leader.team_name} (${leader.player_name})\n`;
          text += `แต้มสุทธิ: ${leader.net_points} pts (แต้มดิบ ${leader.points} | Hits -${leader.hits})\n`;
          text += `เงินรางวัล: 350 บาท\n\n`;
        } else {
          text += `ผู้นำคะแนนสด: ${leader.team_name} (${leader.player_name})\n`;
          text += `แต้มสุทธิชั่วคราว: ${leader.net_points} pts (แต้มดิบ ${leader.points} | Hits -${leader.hits})\n\n`;
        }

        text += `ไฮไลท์เด็ด:\n"${currentLiveNote}"\n\n`;

        if (hitTakers) text += `ทีมติดลบย้ายตัว: ${hitTakers}\n`;
        if (chipsUsed) text += `ชิปที่ใช้งาน: ${chipsUsed}\n`;

        text += `\nสรุปคะแนน 5 อันดับแรก GW ${this.selectedGW}:\n`;
        sorted.slice(0, 5).forEach((t, i) => {
          text += `${i + 1}. ${t.team_name} : ${t.net_points} pts (ดิบ ${t.points}${t.hits > 0 ? ' -' + t.hits : ''})\n`;
        });

        text += `\nดูตารางคะแนนและเงินรางวัลเต็มๆ ได้ที่:\nhttps://asawamanasak.github.io/fpl-mini/`;

        navigator.clipboard.writeText(text).then(() => {
          alert('คัดลอกสรุปผล Gameweek ลงคลิปบอร์ดแล้ว! พร้อมวางส่งในกลุ่ม LINE ได้ทันที');
        }).catch(() => {
          prompt('คัดลอกข้อความสรุปด้านล่างนี้เพื่อส่งใน LINE:', text);
        });
      }

      copyPhaseShareText(phaseNum) {
        const p = this.config.settlementPhases.find(item => item.phase === phaseNum);
        if (!p) return;

        let text = `สรุปยอดเงินรางวัล เซียนอยู่รู หมูอยู่ตึก\n`;
        text += `รอบที่ ${p.phase} (Gameweek ${p.startGW} - ${p.endGW})\n`;
        text += `งบแชมป์วีค: ${p.weeklyBudget.toLocaleString()} บาท\n\n`;

        if (p.phase === 1) {
          text += `1. GEMINI UNITED (Micky) : 350 บาท (แชมป์ GW 1)\n`;
          text += `GW 2-6: รอการแข่งขัน\n\n`;
        }

        text += `ดูรายละเอียดเพิ่มเติม: https://asawamanasak.github.io/fpl-mini/`;

        navigator.clipboard.writeText(text).then(() => {
          alert(`คัดลอกสรุปยอดเงินรอบที่ ${p.phase} เรียบร้อยแล้ว!`);
        });
      }
    }

    // Initialize Standalone App
    document.addEventListener('DOMContentLoaded', () => {
      window.app = new StandaloneApp();
    });
  </script>
</body>
</html>
"""

# Write to preview.html (for local verification)
with open('preview.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# Write to index.html (for GitHub Pages parity)
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Successfully regenerated fully dynamic preview.html and index.html!")
