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
<html lang="th" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>เซียนอยู่รู หมูอยู่ตึก 2026/27 | FPL League 40700</title>
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            theme: {
              black: '#050507',
              card: '#0d0d12',
              elevated: '#14141b',
              border: '#1f1f2a',
              emerald: '#00ff87',
              cyan: '#00f0ff',
              gold: '#ffbe1a',
              rose: '#ff3366',
              purple: '#9d4edd'
            }
          },
          fontFamily: {
            sans: ['Prompt', 'Plus Jakarta Sans', 'sans-serif'],
            display: ['Plus Jakarta Sans', 'Prompt', 'sans-serif']
          }
        }
      }
    }
  </script>

  <!-- Google Fonts: Prompt & Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Prompt:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    :root {
      --bg-black: #050507;
      --card-black: #0d0d12;
      --card-elevated: #14141b;
      --accent-emerald: #00ff87;
      --accent-cyan: #00f0ff;
      --accent-gold: #ffbe1a;
      --accent-purple: #9d4edd;
    }

    body {
      font-family: 'Prompt', 'Plus Jakarta Sans', sans-serif;
      background-color: #050507;
      color: #f8fafc;
      background-image: 
        radial-gradient(at 0% 0%, rgba(0, 255, 135, 0.05) 0px, transparent 45%),
        radial-gradient(at 100% 0%, rgba(0, 240, 255, 0.05) 0px, transparent 45%),
        radial-gradient(at 50% 100%, rgba(255, 190, 26, 0.02) 0px, transparent 60%);
      background-attachment: fixed;
      letter-spacing: -0.01em;
    }

    .font-display {
      font-family: 'Plus Jakarta Sans', 'Prompt', sans-serif;
    }

    /* Minimalist Glass Cards */
    .glass-card {
      background: rgba(13, 13, 18, 0.94);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.07);
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.8);
    }

    .glass-card-glow {
      background: linear-gradient(145deg, rgba(16, 16, 24, 0.95), rgba(9, 9, 13, 0.95));
      backdrop-filter: blur(20px);
      border: 1px solid rgba(0, 255, 135, 0.35);
      box-shadow: 0 0 35px rgba(0, 255, 135, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    .glass-card-live {
      background: linear-gradient(145deg, rgba(14, 20, 28, 0.95), rgba(9, 11, 15, 0.95));
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 51, 102, 0.35);
      box-shadow: 0 0 35px rgba(255, 51, 102, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    .glass-card-gold {
      background: linear-gradient(145deg, rgba(22, 18, 10, 0.95), rgba(12, 11, 8, 0.95));
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 190, 26, 0.35);
      box-shadow: 0 0 35px rgba(255, 190, 26, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.08);
    }

    /* Scrollbar */
    .scrollbar-thin::-webkit-scrollbar {
      height: 5px;
      width: 5px;
    }
    .scrollbar-thin::-webkit-scrollbar-track {
      background: #08080c;
      border-radius: 9999px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: #272732;
      border-radius: 9999px;
    }
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: #00ff87;
    }

    /* Pitch Styling */
    .fpl-pitch {
      background: linear-gradient(180deg, #0f3813 0%, #174d1c 50%, #0f3813 100%);
      position: relative;
      border-radius: 1.25rem;
      border: 2px solid rgba(255, 255, 255, 0.15);
      overflow: hidden;
      box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.6);
    }
    .fpl-pitch::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(255, 255, 255, 0.18);
    }
    .fpl-pitch::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 76px;
      height: 76px;
      border-radius: 50%;
      border: 2px solid rgba(255, 255, 255, 0.18);
    }

    /* Chip Badges */
    .chip-badge {
      font-size: 0.68rem;
      font-weight: 800;
      padding: 0.2rem 0.5rem;
      border-radius: 0.4rem;
      display: inline-flex;
      align-items: center;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .badge-3xc, .badge-triple_captain { background: #7928ca; color: #fff; border: 1px solid #ff007a; }
    .badge-bboost, .badge-bench_boost { background: #0070f3; color: #fff; border: 1px solid #00dfd8; }
    .badge-freehit { background: #e65100; color: #fff; border: 1px solid #ff9100; }
    .badge-wildcard { background: #2e7d32; color: #fff; border: 1px solid #76ff03; }

    /* Modal Backdrop */
    .modal-backdrop {
      background: rgba(0, 0, 0, 0.88);
      backdrop-filter: blur(12px);
    }
  </style>
</head>
<body class="min-h-screen flex flex-col bg-[#050507] text-slate-100 antialiased selection:bg-[#00ff87] selection:text-slate-950">

  <!-- ==================== 1. ส่วนหัวเว็บ (HEADER & GLOBAL NAVIGATION) ==================== -->
  <header class="border-b border-white/[0.08] bg-[#08080c]/90 backdrop-blur-2xl sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
      
      <!-- 1.1 ข้อมูลประจำลีก (League Identity) -->
      <div class="flex items-center gap-3.5">
        <div class="w-10 h-10 rounded-xl bg-[#14141b] border border-white/[0.1] flex items-center justify-center text-[#00ff87] font-black text-base font-display">
          FPL
        </div>
        <div>
          <div class="flex items-center gap-2.5 flex-wrap">
            <h1 class="text-lg sm:text-xl font-extrabold text-white tracking-tight">เซียนอยู่รู หมูอยู่ตึก</h1>
            <span class="text-[11px] font-bold bg-[#14141b] text-[#00ff87] border border-[#00ff87]/30 px-2.5 py-0.5 rounded-full font-display">
              LEAGUE 40700
            </span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5 flex items-center gap-2 flex-wrap font-medium">
            <span>ฤดูกาล 2026/27</span>
            <span>•</span>
            <span>12 ทีมสมาชิก</span>
          </p>
        </div>
      </div>

      <!-- 1.2 แถบสถานะระบบ & 1.3 ปุ่ม Action หลัก -->
      <div class="flex items-center gap-3">
        <div id="api-status-text" class="text-xs text-slate-300 flex items-center bg-[#0d0d12] px-3.5 py-1.5 rounded-xl border border-white/[0.08]">
          <span class="inline-block w-2 h-2 rounded-full bg-[#ff3366] mr-2 animate-pulse"></span>
          Gameweek 2 กำลังแข่งขัน (Live)
        </div>

        <button 
          onclick="app.shareCurrentGameweek()"
          class="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#14141b] hover:bg-[#1a1a24] border border-white/[0.1] text-xs font-bold text-white transition-all shadow-md active:scale-95"
          title="คัดลอกสรุปผลและไฮไลท์สัปดาห์ปัจจุบันลงคลิปบอร์ด"
        >
          <svg class="w-3.5 h-3.5 text-[#00ff87]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
          <span>คัดลอกสรุปส่ง LINE</span>
        </button>
      </div>

    </div>

    <!-- 1.4 แถบเมนู 5 แท็บหลัก -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <nav class="flex space-x-2 sm:space-x-3 overflow-x-auto scrollbar-thin py-2.5 border-t border-white/[0.06]">
        <button 
          data-tab-target="gameweek-view" 
          class="tab-nav-btn flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 bg-[#00ff87]/15 text-[#00ff87] border border-[#00ff87]/40"
        >
          LIVE (Gameweek Hub)
        </button>
        <button 
          data-tab-target="prizes-view" 
          class="tab-nav-btn flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-slate-400 border border-transparent hover:text-white hover:bg-white/[0.04]"
        >
          เงินรางวัล & รอบเคลียร์
        </button>
        <button 
          data-tab-target="hall-of-fame-view" 
          class="tab-nav-btn flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-slate-400 border border-transparent hover:text-white hover:bg-white/[0.04]"
        >
          Hall of Fame
        </button>
        <button 
          data-tab-target="cup-view" 
          class="tab-nav-btn flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-slate-400 border border-transparent hover:text-white hover:bg-white/[0.04]"
        >
          บอลถ้วย
        </button>
        <button 
          data-tab-target="rules-view" 
          class="tab-nav-btn flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 text-slate-400 border border-transparent hover:text-white hover:bg-white/[0.04]"
        >
          กติกาของลีก
        </button>
      </nav>
    </div>
  </header>

  <!-- MAIN CONTAINER -->
  <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

    <!-- ==================== 2. แท็บ 1: ผลสด & สัปดาห์ (LIVE - GAMEWEEK HUB) ==================== -->
    <div id="gameweek-view" class="tab-content space-y-6">
      
      <!-- 1. ส่วนหัวของหน้า (Section Header) -->
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-base sm:text-lg font-bold text-white tracking-tight">
            เลือกรอบการแข่งขัน (GW 1 - 38)
          </h2>
        </div>
        <span class="text-xs font-bold text-slate-400 font-display bg-[#0d0d12] border border-white/[0.08] px-3 py-1 rounded-xl">
          GAMEWEEK MATCHDAY
        </span>
      </div>

      <!-- 2. แถบเลื่อนเลือกสัปดาห์ (Gameweek Selector: เล็กลง 50%) -->
      <div id="gw-selector-container" class="flex gap-1.5 overflow-x-auto scrollbar-thin pb-2 pt-1">
        <!-- Dynamic Compact GW buttons -->
      </div>

      <!-- 3. การ์ดไฮไลท์ผลงานประจำสัปดาห์ (Gameweek Spotlight Card) -->
      <div id="champion-card-container">
        <!-- Dynamic Champion/Live Card -->
      </div>

      <!-- 4. ตารางคะแนนประจำสัปดาห์ & 5. ตารางคะแนนรวมสะสม -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <!-- 4. ตารางคะแนนประจำสัปดาห์ (Matchday Score Table) -->
        <div class="lg:col-span-7 glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base sm:text-lg font-bold text-white">
                ตารางคะแนนประจำสัปดาห์นี้
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">คะแนนสุทธิ = แต้มดิบ - แต้มลบจากการย้ายตัว (Hits)</p>
            </div>
            <span id="gw-table-badge" class="text-xs font-bold text-[#00ff87] bg-[#00ff87]/10 border border-[#00ff87]/30 px-3 py-1 rounded-xl font-display">
              MATCHDAY STANDINGS
            </span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/[0.08]">
                <tr>
                  <th class="py-3 px-3.5">อันดับ</th>
                  <th class="py-3 px-3.5">ทีม / ผู้จัดการ</th>
                  <th class="py-3 px-3.5 text-center">กัปตัน (C)</th>
                  <th class="py-3 px-3.5 text-center">แต้มดิบ</th>
                  <th class="py-3 px-3.5 text-center text-rose-400">Hits</th>
                  <th class="py-3 px-3.5 text-center text-[#00ff87]">แต้มสุทธิ</th>
                  <th class="py-3 px-3.5 text-center text-slate-400">สำรอง</th>
                </tr>
              </thead>
              <tbody id="matchday-table-body" class="divide-y divide-white/[0.04]">
                <!-- Dynamic rows -->
              </tbody>
            </table>
          </div>
        </div>

        <!-- 5. ตารางคะแนนรวมสะสม (Overall Standings) -->
        <div class="lg:col-span-5 glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-base sm:text-lg font-bold text-white">
                ตารางคะแนนรวมสะสม (Overall Standings)
              </h3>
              <p class="text-xs text-slate-400 mt-0.5">อันดับคะแนนรวมสะสมของทั้ง 12 ทีม</p>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm">
              <thead class="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/[0.08]">
                <tr>
                  <th class="py-3 px-3.5 text-center">อันดับ</th>
                  <th class="py-3 px-3.5">ทีม</th>
                  <th class="py-3 px-3.5 text-center text-slate-300">GW</th>
                  <th class="py-3 px-3.5 text-center text-[#00ff87]">แต้มรวม</th>
                </tr>
              </thead>
              <tbody id="overall-standings-body" class="divide-y divide-white/[0.04]">
                <!-- Dynamic rows -->
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>

    <!-- ==================== 3. แท็บ 2: เงินรางวัล & รอบเคลียร์ ==================== -->
    <div id="prizes-view" class="tab-content hidden space-y-6">
      
      <!-- 3.1 ป้ายสรุปงบเงินรางวัลรวม -->
      <div class="glass-card-gold rounded-3xl p-6 sm:p-8 border border-[#ffbe1a]/30 relative overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div>
            <span class="text-xs uppercase tracking-widest text-[#ffbe1a] font-bold">TOTAL PRIZE MATRIX</span>
            <h2 class="text-2xl sm:text-3xl font-black text-white font-display mt-1">สรุปเงินรางวัลรวม 22,000 บาท</h2>
            <p class="text-xs sm:text-sm text-slate-300 mt-1">11 ทีม × ค่าสมัคร 2,000 บาท | แบ่ง 3 หมวดรางวัล</p>
          </div>
          <div class="flex flex-wrap items-center gap-3">
            <div class="bg-[#08080c]/90 border border-white/[0.1] px-4 py-2.5 rounded-2xl text-center">
              <span class="text-[11px] text-slate-400 block">แชมป์ 38 วีค (350 บ.)</span>
              <strong class="text-[#00ff87] font-display text-base">13,300 บาท</strong>
            </div>
            <div class="bg-[#08080c]/90 border border-white/[0.1] px-4 py-2.5 rounded-2xl text-center">
              <span class="text-[11px] text-slate-400 block">บอลถ้วย (2 รางวัล)</span>
              <strong class="text-[#ffbe1a] font-display text-base">1,650 บาท</strong>
            </div>
            <div class="bg-[#08080c]/90 border border-white/[0.1] px-4 py-2.5 rounded-2xl text-center">
              <span class="text-[11px] text-slate-400 block">แชมป์ฤดูกาล (4 รางวัล)</span>
              <strong class="text-[#9d4edd] font-display text-base">7,050 บาท</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- 3.2 ตารางเงินรางวัลสะสมของทั้ง 12 ทีม -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-white">
              ตารางสรุปเงินรางวัลสะสมของทั้ง 12 ทีม (ที่ได้รับจริง ณ ปัจจุบัน)
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">เงินรางวัลแชมป์วีคคำนวณเฉพาะสัปดาห์ที่แข่งเสร็จสิ้นแล้ว (350 บ./ครั้ง) | รางวัลบอลถ้วยและแชมป์ฤดูกาลจะสรุปผลเมื่อจบการแข่งขันใน GW 38</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/[0.08]">
              <tr>
                <th class="py-3 px-3.5 text-center">อันดับ</th>
                <th class="py-3 px-3.5">ทีม / ผู้จัดการ</th>
                <th class="py-3 px-3.5 text-center text-[#00f0ff]">ชนะวีค</th>
                <th class="py-3 px-3.5 text-center">แชมป์วีค (350 บ.)</th>
                <th class="py-3 px-3.5 text-center text-[#ffbe1a]">บอลถ้วย</th>
                <th class="py-3 px-3.5 text-center text-[#9d4edd]">แชมป์ฤดูกาล</th>
                <th class="py-3 px-3.5 text-center text-[#00ff87]">รวมเงินรางวัลที่ได้รับจริง</th>
              </tr>
            </thead>
            <tbody id="prize-leaderboard-body" class="divide-y divide-white/[0.04]">
              <!-- Dynamic Rows -->
            </tbody>
          </table>
        </div>
      </div>

      <!-- 3.3 การ์ดรอบเคลียร์เงินรางวัล 6 Phase -->
      <div>
        <div class="mb-4">
          <h3 class="text-base sm:text-lg font-bold text-white">
            รอบเคลียร์เงินรางวัล 6 Phase (ทุก 6 GW / ท้าย 8 GW)
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">สรุปยอดเงินรางวัลที่ต้องโอนเคลียร์ให้สมาชิกในแต่ละรอบ</p>
        </div>

        <div id="settlement-phases-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <!-- Dynamic Phase Cards -->
        </div>
      </div>

    </div>

    <!-- ==================== 4. แท็บ 3: HALL OF FAME ==================== -->
    <div id="hall-of-fame-view" class="tab-content hidden space-y-6">
      
      <!-- 4.1 การ์ดสถิติไฮไลท์ 4 ด้าน -->
      <div id="hall-of-fame-records" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Dynamic Record Cards -->
      </div>

      <!-- 4.2 ตารางสถิติเชิงลึก 12 ทีม -->
      <div class="glass-card rounded-2xl p-5 sm:p-6 border border-white/[0.08]">
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-base sm:text-lg font-bold text-white">
              สถิติเชิงลึกและประสิทธิภาพการเล่นของทั้ง 12 ทีม
            </h3>
            <p class="text-xs text-slate-400 mt-0.5">สถิติคะแนนเฉลี่ย, อัตราติด Top 3, แต้มสูงสุด/ต่ำสุด และแต้มลบสะสม</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead class="text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/[0.08]">
              <tr>
                <th class="py-3 px-3.5 text-center">อันดับ</th>
                <th class="py-3 px-3.5">ทีม / ผู้จัดการ</th>
                <th class="py-3 px-3.5 text-center text-[#00ff87]">แชมป์วีค (ครั้ง)</th>
                <th class="py-3 px-3.5 text-center text-[#00f0ff]">แต้มเฉลี่ย/GW</th>
                <th class="py-3 px-3.5 text-center">แต้มสูงสุด</th>
                <th class="py-3 px-3.5 text-center">แต้มต่ำสุด</th>
                <th class="py-3 px-3.5 text-center text-rose-400">แต้มลบรวม</th>
                <th class="py-3 px-3.5 text-center text-[#9d4edd]">% ติด Top 3</th>
              </tr>
            </thead>
            <tbody id="hall-of-fame-table-body" class="divide-y divide-white/[0.04]">
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
      <div class="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
        <div>
          <span class="text-[11px] uppercase tracking-widest text-[#00ff87] font-extrabold font-display">OFFICIAL LEAGUE RULES & PRIZE MATRIX</span>
          <h2 class="text-xl sm:text-2xl font-black text-white font-display mt-0.5">กติกาแฟนตาซี เซียนอยู่รู หมูอยู่ตึก (ฤดูกาล 2026/27)</h2>
          <p class="text-xs text-slate-400 mt-0.5">LEAGUE ID: <strong class="text-slate-200">40700</strong> | สมาชิก 11-12 ทีม | ค่าสมัคร 2,000 บาท/ทีม | งบเงินรางวัลรวม <strong>22,000 บาท</strong></p>
        </div>
        <div class="flex items-center gap-2">
          <span class="bg-[#00ff87]/15 text-[#00ff87] border border-[#00ff87]/30 text-xs px-3 py-1 rounded-xl font-bold font-display">38 GAMEWEEKS</span>
          <span class="bg-[#ffbe1a]/15 text-[#ffbe1a] border border-[#ffbe1a]/30 text-xs px-3 py-1 rounded-xl font-bold font-display">22,000 THB POOL</span>
        </div>
      </div>

      <!-- 3-Column Grid: Fully fits on one screen without scrolling -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <!-- Column 1: ข้อมูลลีก & แชมป์ประจำสัปดาห์ -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.08] flex flex-col justify-between space-y-3">
          <div>
            <div class="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.06]">
              <span class="w-6 h-6 rounded-lg bg-[#00f0ff]/15 text-[#00f0ff] font-bold text-xs flex items-center justify-center font-display">1</span>
              <h3 class="font-bold text-white text-sm">การแข่งขัน & แชมป์สัปดาห์</h3>
            </div>
            
            <div class="space-y-2 text-xs text-slate-300">
              <div class="bg-[#08080c] p-2.5 rounded-xl border border-white/[0.04]">
                <strong class="text-slate-100 block mb-0.5">• รูปแบบ & สมาชิก:</strong>
                <span>11-12 ทีม แข่งขัน 38 สัปดาห์ (GW 1 - 38) ชิงเงินรางวัลรวม 22,000 บาท (ค่าสมัคร 2,000 บ./ทีม)</span>
              </div>

              <div class="bg-[#08080c] p-2.5 rounded-xl border border-white/[0.04]">
                <strong class="text-[#00ff87] block mb-0.5">• แชมป์วีค 38 สัปดาห์ (งบ 13,300 บ.):</strong>
                <span>สัปดาห์ละ <strong>350 บาท</strong> คิดจากแต้มสุทธิ (Net Points = แต้มดิบ - Hits) เฉพาะสัปดาห์ที่แข่งจบแล้ว (หากแต้มเท่ากันหารรางวัลเท่ากัน)</span>
              </div>
            </div>
          </div>

          <div class="text-[11px] text-slate-500 pt-2 border-t border-white/[0.04]">
            * หักแต้มย้ายทีม (Hits) มีผลโดยตรงต่อการตัดสินแชมป์วีค
          </div>
        </div>

        <!-- Column 2: รางวัลแชมป์ฤดูกาล & บอลถ้วย -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.08] flex flex-col justify-between space-y-3">
          <div>
            <div class="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.06]">
              <span class="w-6 h-6 rounded-lg bg-[#ffbe1a]/15 text-[#ffbe1a] font-bold text-xs flex items-center justify-center font-display">2</span>
              <h3 class="font-bold text-white text-sm">แชมป์ฤดูกาล & บอลถ้วย</h3>
            </div>

            <div class="space-y-2 text-xs text-slate-300">
              <!-- แชมป์ลีก -->
              <div class="bg-[#08080c] p-2.5 rounded-xl border border-white/[0.04]">
                <div class="flex justify-between items-center mb-1">
                  <strong class="text-[#9d4edd]">• แชมป์ลีก 4 อันดับ:</strong>
                  <span class="font-bold text-slate-200">รวม 7,050 บ.</span>
                </div>
                <div class="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                  <span>อันดับ 1: <strong class="text-[#ffbe1a]">3,500 บ.</strong></span>
                  <span>อันดับ 2: <strong class="text-slate-200">2,000 บ.</strong></span>
                  <span>อันดับ 3: <strong class="text-amber-400">1,000 บ.</strong></span>
                  <span>อันดับ 4: <strong class="text-slate-400">550 บ.</strong></span>
                </div>
              </div>

              <!-- บอลถ้วย -->
              <div class="bg-[#08080c] p-2.5 rounded-xl border border-white/[0.04]">
                <div class="flex justify-between items-center mb-1">
                  <strong class="text-[#ffbe1a]">• บอลถ้วย (Knockout):</strong>
                  <span class="font-bold text-slate-200">รวม 1,650 บ.</span>
                </div>
                <div class="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                  <span>แชมป์บอลถ้วย: <strong class="text-[#ffbe1a]">1,000 บ.</strong></span>
                  <span>รองแชมป์: <strong class="text-slate-300">650 บ.</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div class="text-[11px] text-slate-500 pt-2 border-t border-white/[0.04]">
            * สรุปผลและมอบเงินรางวัลเมื่อสิ้นสุดการแข่งขันใน GW 38
          </div>
        </div>

        <!-- Column 3: รอบเคลียร์เงินรางวัล 6 Phase -->
        <div class="glass-card rounded-2xl p-4 sm:p-5 border border-white/[0.08] flex flex-col justify-between space-y-3">
          <div>
            <div class="flex items-center gap-2 mb-2 pb-2 border-b border-white/[0.06]">
              <span class="w-6 h-6 rounded-lg bg-[#00ff87]/15 text-[#00ff87] font-bold text-xs flex items-center justify-center font-display">3</span>
              <h3 class="font-bold text-white text-sm">รอบเคลียร์เงินรางวัล (6 Phase)</h3>
            </div>

            <div class="bg-[#08080c] p-2.5 rounded-xl border border-white/[0.04] text-xs text-slate-300 space-y-1">
              <div class="flex justify-between py-0.5 border-b border-white/[0.03]"><span>รอบ 1 (GW 1-6):</span><strong class="text-[#00ff87]">2,100 บ.</strong></div>
              <div class="flex justify-between py-0.5 border-b border-white/[0.03]"><span>รอบ 2 (GW 7-12):</span><strong class="text-slate-300">2,100 บ.</strong></div>
              <div class="flex justify-between py-0.5 border-b border-white/[0.03]"><span>รอบ 3 (GW 13-18):</span><strong class="text-slate-300">2,100 บ.</strong></div>
              <div class="flex justify-between py-0.5 border-b border-white/[0.03]"><span>รอบ 4 (GW 19-24):</span><strong class="text-slate-300">2,100 บ.</strong></div>
              <div class="flex justify-between py-0.5 border-b border-white/[0.03]"><span>รอบ 5 (GW 25-30):</span><strong class="text-slate-300">2,100 บ.</strong></div>
              <div class="flex justify-between py-0.5 text-[#ffbe1a]"><span>รอบ 6 (GW 31-38):</span><strong>11,500 บ.*</strong></div>
            </div>
          </div>

          <div class="text-[10px] text-slate-500 pt-2 border-t border-white/[0.04]">
            * รอบ 6 รวมงบวีค 2,800 บ. + ถ้วย 1,650 บ. + แชมป์ลีก 7,050 บ.
          </div>
        </div>

      </div>

    </div>

  </main>

  <!-- ==================== 6. หน้าต่างป๊อปอัป ==================== -->

  <!-- 6.1 ผังสนามจัดทัพนักเตะ -->
  <div id="team-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden">
    <div class="glass-card rounded-3xl p-6 max-w-2xl w-full border border-white/[0.1] shadow-2xl relative max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
        <div>
          <span class="text-xs uppercase tracking-wider text-[#00ff87] font-bold">ข้อมูลการจัดทัพสัปดาห์นี้</span>
          <h3 id="team-modal-title" class="text-xl font-extrabold text-white">ชื่อทีม</h3>
        </div>
        <button onclick="app.closeTeamModal()" class="text-slate-400 hover:text-white p-1 rounded-lg">
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
      <div class="bg-[#08080c] rounded-2xl p-4 border border-white/[0.06]">
        <span class="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-2">ตัวสำรอง (Substitutes)</span>
        <div id="team-bench-container" class="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <!-- Bench players -->
        </div>
      </div>
    </div>
  </div>

  <!-- 6.2 หน้าต่างแก้ไขไฮไลท์ -->
  <div id="tagline-modal" class="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop hidden">
    <div class="glass-card rounded-3xl p-6 max-w-lg w-full border border-purple-500/40 shadow-2xl relative">
      <div class="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-4">
        <h3 id="tagline-modal-title" class="text-lg font-bold text-white">แก้ไขจุดเด่น / Tagline ประจำสัปดาห์</h3>
        <button onclick="app.closeTaglineModal()" class="text-slate-400 hover:text-white p-1 rounded-lg">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <div class="space-y-4">
        <p class="text-xs text-slate-400">ใส่ข้อความไฮไลท์ หรือโน้ตจุดเด่นประจำวีคนี้ เพื่อแสดงบนหน้าเว็บและส่งลงกลุ่ม LINE:</p>
        <textarea 
          id="tagline-input" 
          rows="3" 
          class="w-full bg-[#08080c] border border-white/[0.1] rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#00ff87]"
          placeholder="เช่น บรูโน่กัปตันพาวิน ตัวสำรองยังช่วยยิง เซียนอยู่รูบอกเลยว่าของแทร่!"
        ></textarea>

        <div class="flex justify-end gap-2">
          <button onclick="app.closeTaglineModal()" class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white">ยกเลิก</button>
          <button id="tagline-save-btn" class="px-4 py-2 rounded-xl text-xs font-bold bg-[#00ff87] hover:bg-[#00e676] text-slate-950 shadow-lg shadow-[#00ff87]/20">บันทึกข้อความ</button>
        </div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <footer class="border-t border-white/[0.06] bg-[#050507] py-6 text-center text-xs text-slate-500 mt-auto">
    <div class="max-w-7xl mx-auto px-4">
      <p class="font-medium text-slate-400">เซียนอยู่รู หมูอยู่ตึก ฤดูกาล 2026/27 • League ID: 40700</p>
      <p class="mt-1 text-[11px] text-slate-600">Fantasy Premier League Mini-League Presentation Dashboard | Ready for GitHub Pages</p>
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
          return `Gameweek ${gwNumber}: บอลยังไม่เตะ อย่าเพิ่งรีบโม้ รอดูของจริงในสนาม!`;
        }

        const results = [...gwData.results].sort((a, b) => b.net_points - a.net_points);
        const leader = results[0];
        const runnerUp = results[1];
        const margin = runnerUp ? (leader.net_points - runnerUp.net_points) : 0;
        const isFinished = gwData.is_finished === true;

        // Context analysis
        const hitTakers = results.filter(t => t.hits > 0);
        const chipUsers = results.filter(t => t.chip);
        const benchKing = [...results].sort((a, b) => b.bench_points - a.bench_points)[0];
        const uniqueCaptains = results.filter(t => t.captain && !['Haaland', 'Salah'].includes(t.captain));

        // Part 1: Leader Opening (สไตล์ บอ.บู๋ ดุดัน กวนๆ สดใหม่)
        let leadPhrases = [];
        if (isFinished) {
          if (leader.chip === 'BBOOST' || leader.chip === 'Bench Boost') {
            leadPhrases = [
              `${leader.team_name} เปิดหัวก็บ้าพลัง งัดการ์ด Bench Boost ขนมาทั้งตำบล กวาด ${leader.net_points} แต้ม ยึดหัวหาดแบบหล่อๆ`,
              `${leader.team_name} ปล่อยของแต่หัววัน เปิดชิป Bench Boost ตัวจริงก็มา สำรองก็ยิง ล่อไป ${leader.net_points} แต้ม ขึ้นนำแบบไร้ข้อกังขา`,
              `ของแทร่ไม่ต้องพูดเยอะ ${leader.team_name} สวมวิญญาณป๋า งัด Bench Boost โกย ${leader.net_points} แต้ม ฟันแชมป์วีคสบายแฮ`
            ];
          } else if (leader.chip === '3XC' || leader.chip === 'Triple Captain') {
            leadPhrases = [
              `${leader.team_name} ใส่ 3XC ทริปเปิ้ลกัปตันเต็มข้อ ล่อไป ${leader.net_points} แต้ม คว้าแชมป์วีคแบบไม่ต้องสืบ`,
              `${leader.team_name} เลือกกัปตันถูกคู่ กดการ์ด 3XC ระเบิดฟอร์ม กวาด ${leader.net_points} แต้ม ยึดจ่าฝูงคนเดียวแบบเหงาๆ`
            ];
          } else if (margin === 1) {
            leadPhrases = [
              `${leader.team_name} ปาดหน้าเข้าวินวินาทีสุดท้าย เฉือนชนะ ${runnerUp.team_name} แค่ 1 แต้ม ชนะแต้มเดียวก็คือชนะ ร้องไห้ทำไม`,
              `หัวใจจะวาย ${leader.team_name} เบียดชนะ ${runnerUp.team_name} ปลายจมูก 1 แต้ม เข้าป้ายแชมป์ GW ${gwNumber} แบบสะใจโก๋`
            ];
          } else if (leader.net_points >= 75) {
            leadPhrases = [
              `${leader.team_name} ฟอร์มอย่างโหด โกรธใครมา กดไป ${leader.net_points} แต้ม ทิ้งห่างชาวบ้านแบบไม่ไว้หน้าใคร`,
              `${leader.team_name} ร่างทองระเบิดฟอร์ม โกยยับ ${leader.net_points} แต้ม ยึดแชมป์สัปดาห์แบบไร้เทียมทาน`
            ];
          } else {
            leadPhrases = [
              `${leader.team_name} วางหมากเฉียบคม อาศัยกัปตัน ${leader.captain || 'ตัวเก่ง'} โกย ${leader.net_points} แต้ม ยึดบัลลังก์แชมป์ Gameweek ${gwNumber}`,
              `${leader.team_name} คว้า ${leader.net_points} แต้มเข้าป้ายแบบนิ่มๆ ใครตามไม่ทัน...ก็ต้องยอมอยู่รูต่อไป`
            ];
          }
        } else {
          // LIVE (In progress)
          leadPhrases = [
            `${leader.team_name} นำเดี่ยว ${leader.net_points} แต้ม อาศัยบารมีกัปตัน ${leader.captain || 'ตัวเก๋า'} ยึดจ่าฝูงชั่วคราว`,
            `${leader.team_name} กดไป ${leader.net_points} แต้ม ขึ้นมาสูดอากาศข้างบนชั่วคราว`,
            `${leader.team_name} เครื่องติดไว ซัดไป ${leader.net_points} แต้ม นั่งเก้าอี้ผู้นำสดไปก่อน`
          ];
        }
        const leadSentence = leadPhrases[Math.floor(Math.random() * leadPhrases.length)];

        // Part 2: Hits & Chips & Differentials (ประเด็นแท็กติก)
        let midPhrases = [];
        if (hitTakers.length > 0) {
          const hitNames = hitTakers.slice(0, 2).map(t => `${t.team_name} (-${t.hits})`).join(' กับ ');
          const hitTexts = [
            `ด้าน ${hitNames} ใจถึงยอมจ่ายค่าปรับติดลบแก้เกม`,
            `ส่วนแก๊งยอมเจ็บอย่าง ${hitNames} โดนหักแต้มจี๊ดยันรู`,
            `ฝั่ง ${hitNames} ยอมจ่าย -4 แก้ขัดหวังลุ้นยาวๆ`
          ];
          midPhrases.push(hitTexts[Math.floor(Math.random() * hitTexts.length)]);
        }
        if (uniqueCaptains.length > 0) {
          const diff = uniqueCaptains[Math.floor(Math.random() * uniqueCaptains.length)];
          const diffTexts = [
            `ส่วน ${diff.team_name} โคตรอินดี้ตั้ง ${diff.captain} กัปตันนอกสายตาจนแต้มลั่น`,
            `ขณะที่ ${diff.team_name} สวนกระแสจิ้ม ${diff.captain} เป็นกัปตันตัวตึง`
          ];
          midPhrases.push(diffTexts[Math.floor(Math.random() * diffTexts.length)]);
        }
        if (benchKing && benchKing.bench_points >= 10 && (!isFinished || leader.chip !== 'BBOOST')) {
          const benchTexts = [
            `ขณะที่ ${benchKing.team_name} นั่งกุมขมับปล่อยตัวสำรองกดไป ${benchKing.bench_points} แต้มคาเบาะ`,
            `ด้าน ${benchKing.team_name} น้ำตาตกใน ตัวสำรองลั่นทุ่ง ${benchKing.bench_points} แต้มแต่นั่งมองตาปริบๆ`
          ];
          midPhrases.push(benchTexts[Math.floor(Math.random() * benchTexts.length)]);
        }

        // Part 3: Ending Punchline (ลูกเตือนกวนๆ สไตล์ บอ.บู๋)
        let endPhrases = [];
        if (isFinished) {
          endPhrases = [
            `ใครตามไม่ทัน...ก็ต้องอยู่รูต่อไป!`,
            `ของแทร่ไม่ต้องพูดเยอะ สัปดาห์หน้าเจอกันใหม่!`,
            `ฟอร์มแบบนี้บอกเลยว่า ยาวไปๆ!`,
            `เซียนอยู่รูของจริงไม่ต้องบรรยายเยอะ!`
          ];
        } else {
          endPhrases = [
            `บอลยังเตะไม่ครบ อย่าเพิ่งรีบโม้ เดี๋ยวจะหาว่าไม่เตือน!`,
            `บอลยังไม่จบอย่าเพิ่งนับศพทหาร รอดูของจริงตอนจบสัปดาห์!`,
            `จ่าฝูงชั่วคราวอย่าเพิ่งเหลิง บอลกลมๆ อะไรก็เกิดขึ้นได้!`,
            `ยังเหลือคู่อื่นให้ลุ้น ระวังหงายเงิบตอนจบวีค!`
          ];
        }
        const endSentence = endPhrases[Math.floor(Math.random() * endPhrases.length)];

        // Combine dynamically
        let combined = leadSentence;
        if (midPhrases.length > 0) {
          combined += ' ' + midPhrases.join(' ') + ' ' + endSentence;
        } else {
          combined += ' ' + endSentence;
        }

        return combined;
      }
    }

    class StandaloneApp {
      constructor() {
        this.config = LEAGUE_CONFIG;
        this.data = MOCK_DATA;
        this.selectedGW = 2;
        this.maxAvailableGW = this.config.currentActiveGW;
        this.standings = this.data.teams;
        this.liveNotesCache = {};
      }

      init() {
        this.setupTabs();
        this.renderGameweekSelector();
        this.renderGameweekView();
        this.renderPrizesView();
        this.renderHallOfFameView();
        this.renderCupView();
      }

      setupTabs() {
        document.querySelectorAll('.tab-nav-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-tab-target');
            document.querySelectorAll('.tab-nav-btn').forEach(b => {
              b.classList.remove('bg-[#00ff87]/15', 'text-[#00ff87]', 'border-[#00ff87]/40');
              b.classList.add('text-slate-400', 'border-transparent');
            });
            btn.classList.add('bg-[#00ff87]/15', 'text-[#00ff87]', 'border-[#00ff87]/40');
            btn.classList.remove('text-slate-400', 'border-transparent');

            document.querySelectorAll('.tab-content').forEach(c => {
              if (c.id === targetId) c.classList.remove('hidden');
              else c.classList.add('hidden');
            });
          });
        });
      }

      selectGameweek(gw) {
        if (gw > this.maxAvailableGW) return;
        this.selectedGW = gw;
        this.renderGameweekSelector();
        this.renderGameweekView();
      }

      regenerateLiveNote() {
        const gwData = this.data.gameweeks[this.selectedGW];
        if (!gwData) return;
        const freshNote = LiveCommentaryEngine.generateFreshNote(this.selectedGW, gwData);
        this.liveNotesCache[this.selectedGW] = freshNote;
        this.renderGameweekView();
        this.showToast('คิดสดและเขียนโน้ตใหม่เรียบร้อยแล้ว');
      }

      getNoteForCurrentGW() {
        if (this.liveNotesCache[this.selectedGW]) {
          return this.liveNotesCache[this.selectedGW];
        }
        const gwData = this.data.gameweeks[this.selectedGW];
        const fresh = LiveCommentaryEngine.generateFreshNote(this.selectedGW, gwData);
        this.liveNotesCache[this.selectedGW] = fresh;
        return fresh;
      }

      renderGameweekSelector() {
        const container = document.getElementById('gw-selector-container');
        let html = '';
        for (let gw = 1; gw <= 38; gw++) {
          const isSelected = gw === this.selectedGW;
          const isFinished = gw < this.maxAvailableGW;
          const isLive = gw === this.maxAvailableGW;
          const isAvailable = gw <= this.maxAvailableGW;

          if (isAvailable) {
            html += `
              <button 
                onclick="app.selectGameweek(${gw})"
                class="flex-shrink-0 px-2.5 py-1 rounded-xl font-medium text-xs transition-all duration-150 flex flex-col items-center min-w-[48px] ${
                  isSelected 
                    ? 'bg-[#00ff87] text-slate-950 font-black shadow-md shadow-[#00ff87]/20 scale-105 border-0' 
                    : 'bg-[#0d0d12] hover:bg-[#14141b] text-slate-200 border border-white/[0.08]'
                }"
              >
                <span class="text-[8px] uppercase font-extrabold ${isSelected ? 'text-slate-950' : 'text-slate-400'} font-display leading-none">WEEK</span>
                <span class="text-sm font-black font-display leading-tight my-0.5">${gw}</span>
                <span class="text-[8px] uppercase font-bold ${
                  isSelected 
                    ? 'text-slate-950' 
                    : isLive 
                      ? 'text-[#ff3366]' 
                      : 'text-[#00ff87]'
                } font-display leading-none">
                  ${isLive ? 'LIVE' : 'FINISHED'}
                </span>
              </button>
            `;
          } else {
            html += `
              <div 
                class="flex-shrink-0 px-2.5 py-1 rounded-xl text-xs flex flex-col items-center min-w-[48px] bg-[#08080c] text-slate-600 border border-white/[0.03] cursor-not-allowed opacity-40 select-none"
                title="ยังไม่ถึงสัปดาห์การแข่งขัน"
              >
                <span class="text-[8px] uppercase font-medium text-slate-600 font-display leading-none">WEEK</span>
                <span class="text-sm font-bold font-display leading-tight text-slate-600 my-0.5">${gw}</span>
                <span class="text-[8px] uppercase font-medium text-slate-700 font-display leading-none">LOCKED</span>
              </div>
            `;
          }
        }
        container.innerHTML = html;
      }

      renderGameweekView() {
        const gwData = this.data.gameweeks[this.selectedGW];
        const container = document.getElementById('champion-card-container');
        const matchdayBody = document.getElementById('matchday-table-body');
        const overallBody = document.getElementById('overall-standings-body');

        if (!gwData || !gwData.results) {
          container.innerHTML = `<div class="glass-card p-6 rounded-2xl text-center text-slate-400">ยังไม่มีข้อมูลการแข่งขันสำหรับ Gameweek ${this.selectedGW}</div>`;
          matchdayBody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-500">รอผลการแข่งขัน</td></tr>`;
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
            <div class="relative overflow-hidden glass-card-glow rounded-3xl p-6 sm:p-8">
              <div class="absolute -right-16 -top-16 w-64 h-64 bg-[#00ff87]/10 rounded-full blur-3xl pointer-events-none"></div>
              <div class="absolute -left-16 -bottom-16 w-64 h-64 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none"></div>

              <div class="relative z-10">
                <div class="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div class="flex items-center gap-3.5">
                    <div class="w-10 h-10 rounded-xl bg-[#00ff87]/15 border border-[#00ff87]/30 flex items-center justify-center text-[#00ff87] font-black text-xs font-display">
                      WIN
                    </div>
                    <div>
                      <span class="text-xs uppercase tracking-widest text-[#00ff87] font-bold font-display">GAMEWEEK ${this.selectedGW} CHAMPION</span>
                      <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight">แชมป์ประจำสัปดาห์</h3>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 bg-[#00ff87]/10 border border-[#00ff87]/30 px-4 py-2 rounded-2xl">
                    <span class="text-[#00ff87] font-bold text-xs sm:text-sm font-display">${isJoint ? 'แชมป์ร่วมประจำสัปดาห์' : 'สรุปผลประจำสัปดาห์'}</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-[#08080c] border border-white/[0.08] rounded-2xl p-5 mb-5">
                  <div class="md:col-span-2">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        ${leader.team_name} ${isJoint ? '& ' + results[1].team_name : ''}
                      </h4>
                      ${chipBadge}
                    </div>
                    <p class="text-slate-400 text-sm flex items-center gap-2 flex-wrap">
                      <span>ผู้จัดการ: <strong class="text-slate-100 font-semibold">${leader.player_name} ${isJoint ? '& ' + results[1].player_name : ''}</strong></span>
                      ${leader.captain ? `<span>• กัปตัน: <span class="text-[#00f0ff] font-semibold">${leader.captain}</span></span>` : ''}
                    </p>
                  </div>

                  <div class="flex items-center justify-start md:justify-end gap-5 border-t md:border-t-0 border-white/[0.08] pt-3 md:pt-0">
                    <div class="text-center">
                      <span class="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-display">RAW PTS</span>
                      <span class="text-lg font-bold text-slate-300 font-display">${leader.points}</span>
                    </div>
                    <div class="text-center">
                      <span class="block text-[11px] uppercase tracking-wider text-rose-400 font-semibold font-display">HITS</span>
                      <span class="text-lg font-bold ${leader.hits > 0 ? 'text-rose-400' : 'text-slate-500'} font-display">${leader.hits > 0 ? `-${leader.hits}` : '0'}</span>
                    </div>
                    <div class="text-center pl-3 border-l border-white/[0.1]">
                      <span class="block text-[11px] uppercase tracking-wider text-[#00ff87] font-extrabold font-display">NET PTS</span>
                      <span class="text-3xl font-black text-[#00ff87] font-display">${leader.net_points}</span>
                    </div>
                  </div>
                </div>

                <!-- 3.5 Champion Highlight Note (Borbou Style - Dynamic Live) -->
                <div class="bg-gradient-to-r from-[#14141b] via-[#0d0d12] to-[#14141b] border border-white/[0.1] rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div class="flex-1">
                    <span class="text-[11px] uppercase tracking-wider text-[#00f0ff] font-bold block font-display">CHAMPION HIGHLIGHT NOTE</span>
                    <p id="current-gw-note-text" class="text-sm sm:text-base font-medium text-slate-200 mt-0.5 leading-snug">
                      "${currentLiveNote}"
                    </p>
                  </div>
                  <div class="flex items-center gap-1.5 flex-shrink-0">
                    <button 
                      onclick="app.regenerateLiveNote()"
                      class="p-2 text-slate-400 hover:text-[#00ff87] hover:bg-white/[0.08] rounded-xl transition-all"
                      title="สุ่มคิดโน้ตสดใหม่"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button 
                      onclick="app.openTaglineModal(${this.selectedGW}, '${currentLiveNote.replace(/'/g, "\\'")}')"
                      class="p-2 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all"
                      title="แก้ไขโน้ตด้วยตนเอง"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else {
          // 3B: Live Gameweek
          container.innerHTML = `
            <div class="relative overflow-hidden glass-card-live rounded-3xl p-6 sm:p-8">
              <div class="absolute -right-16 -top-16 w-64 h-64 bg-[#ff3366]/10 rounded-full blur-3xl pointer-events-none"></div>

              <div class="relative z-10">
                <div class="flex flex-wrap items-center justify-between gap-4 mb-5">
                  <div class="flex items-center gap-3.5">
                    <div class="w-10 h-10 rounded-xl bg-[#ff3366]/15 border border-[#ff3366]/30 flex items-center justify-center text-[#ff3366] font-black text-xs font-display">
                      LIVE
                    </div>
                    <div>
                      <span class="text-xs uppercase tracking-widest text-[#ff3366] font-bold font-display">GAMEWEEK ${this.selectedGW} (IN PROGRESS)</span>
                      <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight">ผู้นำคะแนนประจำสัปดาห์ชั่วคราว</h3>
                    </div>
                  </div>

                  <div class="flex items-center gap-2 bg-[#ff3366]/10 border border-[#ff3366]/30 px-4 py-2 rounded-2xl">
                    <span class="w-2 h-2 rounded-full bg-[#ff3366] animate-ping"></span>
                    <span class="text-[#ff3366] font-bold text-xs sm:text-sm font-display">กำลังแข่งขัน (ยังไม่จบสัปดาห์)</span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-[#08080c] border border-white/[0.08] rounded-2xl p-5 mb-5">
                  <div class="md:col-span-2">
                    <div class="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        ${leader.team_name} ${isJoint ? '& ' + results[1].team_name : ''}
                      </h4>
                      ${chipBadge}
                    </div>
                    <p class="text-slate-400 text-sm flex items-center gap-2 flex-wrap">
                      <span>ผู้นำคะแนน: <strong class="text-slate-100 font-semibold">${leader.player_name} ${isJoint ? '& ' + results[1].player_name : ''}</strong></span>
                      ${leader.captain ? `<span>• กัปตัน: <span class="text-[#00f0ff] font-semibold">${leader.captain}</span></span>` : ''}
                    </p>
                    <p class="text-xs text-slate-400 mt-1">หมายเหตุ: ผลคะแนนจะสรุปอย่างเป็นทางการเมื่อแข่งครบทุกคู่ในสัปดาห์</p>
                  </div>

                  <div class="flex items-center justify-start md:justify-end gap-5 border-t md:border-t-0 border-white/[0.08] pt-3 md:pt-0">
                    <div class="text-center">
                      <span class="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold font-display">RAW PTS</span>
                      <span class="text-lg font-bold text-slate-300 font-display">${leader.points}</span>
                    </div>
                    <div class="text-center">
                      <span class="block text-[11px] uppercase tracking-wider text-rose-400 font-semibold font-display">HITS</span>
                      <span class="text-lg font-bold ${leader.hits > 0 ? 'text-rose-400' : 'text-slate-500'} font-display">${leader.hits > 0 ? `-${leader.hits}` : '0'}</span>
                    </div>
                    <div class="text-center pl-3 border-l border-white/[0.1]">
                      <span class="block text-[11px] uppercase tracking-wider text-[#00f0ff] font-extrabold font-display">LIVE NET PTS</span>
                      <span class="text-3xl font-black text-[#00f0ff] font-display">${leader.net_points}</span>
                    </div>
                  </div>
                </div>

                <!-- 3.5 Matchday Live Note (Borbou Style - Dynamic Live) -->
                <div class="bg-gradient-to-r from-[#14141b] via-[#0d0d12] to-[#14141b] border border-white/[0.1] rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div class="flex-1">
                    <span class="text-[11px] uppercase tracking-wider text-[#00f0ff] font-bold block font-display">MATCHDAY LIVE NOTE</span>
                    <p id="current-gw-note-text" class="text-sm sm:text-base font-medium text-slate-200 mt-0.5 leading-snug">
                      "${currentLiveNote}"
                    </p>
                  </div>
                  <div class="flex items-center gap-1.5 flex-shrink-0">
                    <button 
                      onclick="app.regenerateLiveNote()"
                      class="p-2 text-slate-400 hover:text-[#00ff87] hover:bg-white/[0.08] rounded-xl transition-all"
                      title="สุ่มคิดโน้ตสดใหม่"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </button>
                    <button 
                      onclick="app.openTaglineModal(${this.selectedGW}, '${currentLiveNote.replace(/'/g, "\\'")}')"
                      class="p-2 text-slate-400 hover:text-white hover:bg-white/[0.08] rounded-xl transition-all"
                      title="แก้ไขโน้ตด้วยตนเอง"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          `;
        }

        // 4. Matchday Table
        let matchdayHtml = '';
        results.forEach((team, idx) => {
          const rankText = idx + 1;
          const chip = team.chip ? `<span class="chip-badge badge-${team.chip.toLowerCase()} ml-2 font-display">${team.chip}</span>` : '';
          const hits = team.hits > 0 ? `<span class="text-rose-400 font-bold font-display">-${team.hits}</span>` : '<span class="text-slate-600 font-display">-</span>';

          matchdayHtml += `
            <tr class="hover:bg-white/[0.03] transition-colors">
              <td class="py-3 px-3.5 font-display font-bold ${idx < 3 ? 'text-[#ffbe1a]' : 'text-slate-400'}">${rankText}</td>
              <td class="py-3 px-3.5">
                <button onclick="app.openTeamModal(${team.entry_id}, '${team.team_name}')" class="text-left font-bold text-slate-100 hover:text-[#00f0ff] transition-colors flex items-center gap-1.5 flex-wrap">
                  <span>${team.team_name}</span>
                  ${chip}
                </button>
                <span class="text-xs text-slate-400 block">${team.player_name}</span>
              </td>
              <td class="py-3 px-3.5 text-center text-xs text-[#00f0ff] font-medium">${team.captain || '-'}</td>
              <td class="py-3 px-3.5 text-center font-display font-medium text-slate-300">${team.points}</td>
              <td class="py-3 px-3.5 text-center">${hits}</td>
              <td class="py-3 px-3.5 text-center">
                <span class="text-base font-black font-display text-slate-100">${team.net_points}</span>
              </td>
              <td class="py-3 px-3.5 text-center text-xs text-slate-400 font-display">${team.bench_points}</td>
            </tr>
          `;
        });
        matchdayBody.innerHTML = matchdayHtml;

        // 5. Overall Standings Table
        let overallHtml = '';
        this.standings.forEach((team, idx) => {
          const rank = team.rank;
          const isTop3 = rank <= 3;
          const rankBadge = rank === 1 
            ? '<span class="text-[10px] bg-[#ffbe1a]/15 text-[#ffbe1a] border border-[#ffbe1a]/30 px-2 py-0.5 rounded-md font-bold font-display">TOP 1</span>'
            : rank === 2
              ? '<span class="text-[10px] bg-slate-300/15 text-slate-200 border border-slate-300/30 px-2 py-0.5 rounded-md font-bold font-display">TOP 2</span>'
              : rank === 3
                ? '<span class="text-[10px] bg-amber-700/20 text-amber-300 border border-amber-600/30 px-2 py-0.5 rounded-md font-bold font-display">TOP 3</span>'
                : '';

          overallHtml += `
            <tr class="hover:bg-white/[0.03] transition-colors ${isTop3 ? 'bg-white/[0.02]' : ''}">
              <td class="py-3 px-3.5 font-display font-bold text-center ${rank === 1 ? 'text-[#ffbe1a]' : 'text-slate-300'}">${rank}</td>
              <td class="py-3 px-3.5">
                <button onclick="app.openTeamModal(${team.entry_id}, '${team.entry_name}')" class="font-bold text-slate-100 hover:text-[#00f0ff] transition-colors text-left block">
                  ${team.entry_name}
                </button>
                <div class="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span class="text-xs text-slate-400">${team.player_name}</span>
                  ${rankBadge}
                </div>
              </td>
              <td class="py-3 px-3.5 text-center font-display text-slate-300 text-sm">${team.gw_points}</td>
              <td class="py-3 px-3.5 text-center font-display font-black text-[#00ff87] text-base">${team.total}</td>
            </tr>
          `;
        });
        overallBody.innerHTML = overallHtml;
      }

      renderPrizesView() {
        const prizeBody = document.getElementById('prize-leaderboard-body');
        const phaseContainer = document.getElementById('settlement-phases-container');

        const prizeWinnersMap = {
          306983: { wins: 1, wonGW: [1], name: 'GEMINI UNITED', player: 'Micky Asawamanasak', weeklyPrize: 350, cupPrize: 0, seasonPrize: 0 }
        };

        // เรียงลำดับ: ผู้ที่ได้เงินรางวัลจริงแล้วขึ้นก่อน (GEMINI UNITED) ตามด้วยทีมอื่นๆ เรียงตามคะแนนรวม
        const sortedForPrize = [...this.standings].map(t => {
          const pw = prizeWinnersMap[t.entry_id] || { wins: 0, wonGW: [], weeklyPrize: 0, cupPrize: 0, seasonPrize: 0 };
          const actualTotal = pw.weeklyPrize;
          return {
            ...t,
            wins: pw.wins,
            wonGW: pw.wonGW,
            weeklyPrize: pw.weeklyPrize,
            cupPrize: pw.cupPrize,
            seasonPrize: pw.seasonPrize,
            actualTotal: actualTotal
          };
        }).sort((a, b) => {
          if (b.actualTotal !== a.actualTotal) return b.actualTotal - a.actualTotal;
          return b.total - a.total;
        });

        let prizeHtml = '';
        sortedForPrize.forEach((t, idx) => {
          const actualTotal = t.actualTotal;
          prizeHtml += `
            <tr class="hover:bg-white/[0.03] transition-colors">
              <td class="py-3.5 px-3.5 font-display font-bold text-center ${actualTotal > 0 ? 'text-[#ffbe1a]' : 'text-slate-500'}">${idx + 1}</td>
              <td class="py-3.5 px-3.5">
                <span class="font-bold text-slate-100 block">${t.entry_name}</span>
                <span class="text-xs text-slate-400">${t.player_name}</span>
              </td>
              <td class="py-3.5 px-3.5 text-center font-display font-bold text-[#00f0ff]">
                ${t.wins > 0 ? t.wins + ' ครั้ง' : '0'}
                ${t.wonGW.length > 0 ? `<span class="block text-[10px] text-slate-400 font-normal font-display">(GW ${t.wonGW.join(', ')})</span>` : ''}
              </td>
              <td class="py-3.5 px-3.5 text-center font-display text-slate-200">${t.weeklyPrize > 0 ? t.weeklyPrize.toLocaleString() + ' บาท' : '-'}</td>
              <td class="py-3.5 px-3.5 text-center font-display text-slate-500 text-xs">-</td>
              <td class="py-3.5 px-3.5 text-center font-display text-slate-500 text-xs">-</td>
              <td class="py-3.5 px-3.5 text-center font-display font-black text-base sm:text-lg ${actualTotal > 0 ? 'text-[#00ff87]' : 'text-slate-500'}">
                ${actualTotal > 0 ? actualTotal.toLocaleString() + ' บาท' : '-'}
              </td>
            </tr>
          `;
        });
        prizeBody.innerHTML = prizeHtml;

        // Settlement Phases
        let phaseHtml = '';
        this.config.settlementPhases.forEach(p => {
          const isP1 = p.phase === 1;
          const isCompleted = false; // Phase 1 is at GW 2 (1/6 finished), others not reached yet
          const isCurrent = isP1;

          const badgeClass = isCompleted 
            ? 'bg-[#00ff87]/15 text-[#00ff87] border-[#00ff87]/30' 
            : isCurrent 
              ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30' 
              : 'bg-[#14141b] text-slate-600 border-white/[0.04]';

          const statusText = isCompleted 
            ? 'เสร็จสิ้นรอบแล้ว' 
            : isCurrent 
              ? 'ยังไม่ครบรอบ (แข่งไปแล้ว 1/6 GW)' 
              : 'ยังไม่ถึงรอบ';

          const buttonHtml = isCompleted
            ? `<button 
                onclick="app.copyPhaseShareText(${p.phase})" 
                class="text-xs bg-[#14141b] hover:bg-[#1a1a24] text-[#00ff87] font-bold px-3.5 py-1.5 rounded-xl border border-[#00ff87]/40 transition-all flex items-center gap-1.5 active:scale-95 shadow-md"
              >
                <span>ส่ง LINE</span>
              </button>`
            : `<button 
                disabled 
                class="text-xs bg-[#08080c] text-slate-600 px-3.5 py-1.5 rounded-xl border border-white/[0.04] cursor-not-allowed opacity-40 select-none"
                title="ยังแข่งไม่ครบจำนวนสัปดาห์ในรอบนี้"
              >
                <span>ยังไม่ครบรอบ</span>
              </button>`;

          phaseHtml += `
            <div class="glass-card rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between ${!isCompleted ? 'opacity-85' : ''}">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs uppercase tracking-wider font-extrabold ${isCompleted ? 'text-[#00ff87]' : isCurrent ? 'text-[#00f0ff]' : 'text-slate-500'} font-display">${p.name}</span>
                  <span class="text-[11px] px-2.5 py-0.5 rounded-full border ${badgeClass} font-semibold">${statusText}</span>
                </div>
                <h4 class="text-lg font-black text-white font-display mb-1">GW ${p.startGW} - ${p.endGW} (${p.weeks} สัปดาห์)</h4>
                <p class="text-xs text-slate-400 mb-4">งบแชมป์วีค: <strong class="text-slate-200">${p.weeklyBudget.toLocaleString()} บาท</strong> ${p.hasCup ? '+ บอลถ้วย & แชมป์ลีก' : ''}</p>
                
                <div class="bg-[#08080c] rounded-xl p-3.5 mb-4 border border-white/[0.04]">
                  <span class="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-2">สรุปแชมป์วีคที่สรุปผลแล้ว:</span>
                  ${isP1 ? `
                    <div class="space-y-1.5 text-xs">
                      <div class="flex justify-between items-center"><span class="text-slate-200">1. GEMINI UNITED (แชมป์ GW 1)</span><strong class="text-[#00ff87]">350 บาท</strong></div>
                      <div class="flex justify-between items-center text-slate-400"><span>- GW 2 (กำลังแข่งขัน)</span><span class="text-rose-400">รอจบสัปดาห์</span></div>
                      <div class="flex justify-between items-center text-slate-600"><span>- GW 3 - 6</span><span>รอแข่ง</span></div>
                    </div>
                  ` : '<p class="text-xs text-slate-500 py-2 text-center">รอผลการแข่งขันในรอบนี้</p>'}
                </div>
              </div>

              <div class="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <span class="text-xs text-slate-400">จ่ายแล้ว: <strong class="${isCompleted ? 'text-[#00ff87]' : 'text-slate-300'} font-display font-bold">${isP1 ? '350' : '0'} บาท</strong></span>
                ${buttonHtml}
              </div>
            </div>
          `;
        });
        phaseContainer.innerHTML = phaseHtml;
      }

      renderHallOfFameView() {
        const recordsContainer = document.getElementById('hall-of-fame-records');
        const hofTable = document.getElementById('hall-of-fame-table-body');

        recordsContainer.innerHTML = `
          <div class="glass-card p-5 rounded-2xl border border-[#ffbe1a]/30">
            <span class="text-xs uppercase tracking-wider text-[#ffbe1a] font-bold block mb-1">คะแนนสูงสุดใน 1 วีค (จบแล้ว)</span>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-3xl font-black text-[#ffbe1a] font-display">78</span>
              <span class="text-xs text-amber-200/80 font-medium font-display">NET PTS (GW 1)</span>
            </div>
            <p class="text-sm font-bold text-white">GEMINI UNITED</p>
            <span class="text-xs text-slate-400">Micky Asawamanasak</span>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-[#00ff87]/30">
            <span class="text-xs uppercase tracking-wider text-[#00ff87] font-bold block mb-1">จอมกวาดแชมป์วีค</span>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-3xl font-black text-[#00ff87] font-display">1</span>
              <span class="text-xs text-emerald-200/80 font-medium">ครั้ง (GW 1)</span>
            </div>
            <p class="text-sm font-bold text-white">GEMINI UNITED</p>
            <span class="text-xs text-slate-400">Micky Asawamanasak</span>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-[#00f0ff]/30">
            <span class="text-xs uppercase tracking-wider text-[#00f0ff] font-bold block mb-1">จ่าฝูงแต้มรวมสูงสุด</span>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-3xl font-black text-[#00f0ff] font-display">103</span>
              <span class="text-xs text-cyan-200/80 font-medium font-display">AVG 51.5 / GW</span>
            </div>
            <p class="text-sm font-bold text-white">Cody Travers</p>
            <span class="text-xs text-slate-400">Alesandro Nuyie</span>
          </div>

          <div class="glass-card p-5 rounded-2xl border border-[#9d4edd]/30">
            <span class="text-xs uppercase tracking-wider text-purple-400 font-bold block mb-1">ตัวสำรองแต้มกระจาย</span>
            <div class="flex items-baseline gap-2 mb-1">
              <span class="text-3xl font-black text-purple-300 font-display">15</span>
              <span class="text-xs text-purple-200/80 font-medium font-display">BENCH PTS (GW 1)</span>
            </div>
            <p class="text-sm font-bold text-white">Anjoni Iraola</p>
            <span class="text-xs text-slate-400">pilan liu</span>
          </div>
        `;

        const hofData = [
          { name: 'Cody Travers', manager: 'Alesandro Nuyie', wins: 0, avg: 51.5, high: 62, low: 45, hits: 4, top3: 100 },
          { name: 'Leibniz FC', manager: 'Ataro Munson', wins: 0, avg: 50.5, high: 56, low: 45, hits: 0, top3: 100 },
          { name: 'GEMINI UNITED', manager: 'Micky Asawamanasak', wins: 1, avg: 49.5, high: 78, low: 21, hits: 0, top3: 50 },
          { name: 'Siampathy', manager: 'Peeranat Hunthanee', wins: 0, avg: 47.5, high: 64, low: 31, hits: 0, top3: 50 },
          { name: 'SUN-KUNG-JI', manager: 'Athit Rattanawipapong', wins: 0, avg: 43.5, high: 60, low: 27, hits: 0, top3: 50 },
          { name: 'Anjoni Iraola', manager: 'pilan liu', wins: 0, avg: 41.5, high: 48, low: 35, hits: 0, top3: 50 },
          { name: 'Mary Jojibana', manager: 'Kavinjet Tantitanasap', wins: 0, avg: 39.5, high: 51, low: 28, hits: 0, top3: 0 },
          { name: '1234 Barbyu Barbyu', manager: 'Maew Mohawk', wins: 0, avg: 39.0, high: 49, low: 33, hits: 4, top3: 0 },
          { name: 'Some might say', manager: 'FAme Pakviwat', wins: 0, avg: 38.5, high: 49, low: 28, hits: 0, top3: 0 },
          { name: '1234-Ultrasmooth-', manager: 'Maew Mohawk', wins: 0, avg: 35.0, high: 55, low: 15, hits: 0, top3: 0 },
          { name: 'ใครไม่พีค', manager: 'Isriya Paireepairit', wins: 0, avg: 28.5, high: 42, low: 15, hits: 0, top3: 0 },
          { name: 'TK.FPL', manager: 'Teerasade Khemprasit', wins: 0, avg: 23.0, high: 32, low: 18, hits: 4, top3: 0 }
        ];

        let hofHtml = '';
        hofData.forEach((t, idx) => {
          hofHtml += `
            <tr class="hover:bg-white/[0.03] transition-colors">
              <td class="py-3 px-3.5 font-display font-bold text-center text-slate-400">${idx + 1}</td>
              <td class="py-3 px-3.5">
                <span class="font-bold text-slate-100 block">${t.name}</span>
                <span class="text-xs text-slate-400">${t.manager}</span>
              </td>
              <td class="py-3 px-3.5 text-center font-display font-black text-[#00ff87]">${t.wins}</td>
              <td class="py-3 px-3.5 text-center font-display font-bold text-[#00f0ff]">${t.avg}</td>
              <td class="py-3 px-3.5 text-center font-display text-slate-300">${t.high}</td>
              <td class="py-3 px-3.5 text-center font-display text-slate-500">${t.low}</td>
              <td class="py-3 px-3.5 text-center font-display text-rose-400">-${t.hits}</td>
              <td class="py-3 px-3.5 text-center font-display text-[#9d4edd] font-semibold">${t.top3}%</td>
            </tr>
          `;
        });
        hofTable.innerHTML = hofHtml;
      }

      renderCupView() {
        const container = document.getElementById('cup-tournament-container');
        if (!container) return;

        container.innerHTML = `
          <!-- Header Banner -->
          <div class="glass-card rounded-3xl p-6 sm:p-8 border border-white/[0.08] relative overflow-hidden">
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span class="text-xs uppercase tracking-widest text-[#00f0ff] font-bold font-display">MINI-LEAGUE KNOCKOUT TOURNAMENT</span>
                <h3 class="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">ฟุตบอลถ้วยแฟนตาซี (League Cup)</h3>
                <p class="text-xs sm:text-sm text-slate-300 mt-1">การแข่งขันแบบแพ้คัดออก (Knockout) เงินรางวัลรวม 1,650 บาท</p>
              </div>
              <div class="flex items-center gap-2 bg-[#14141b] border border-white/[0.1] px-4 py-2 rounded-2xl">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                <span class="text-slate-300 font-bold text-xs sm:text-sm font-display">ยังไม่เริ่มการแข่งขัน (รอระบบ FPL)</span>
              </div>
            </div>
          </div>

          <!-- Prize Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="glass-card-gold rounded-3xl p-6 border border-[#ffbe1a]/30 text-center">
              <span class="text-xs uppercase tracking-wider text-[#ffbe1a] font-bold font-display">CUP CHAMPION (แชมป์บอลถ้วย)</span>
              <h4 class="text-3xl font-black text-white font-display mt-2 mb-1">1,000 บาท</h4>
              <span class="text-xs text-amber-200/80 mt-1 block">สถานะ: รอผลการแข่งขันรอบชิงชนะเลิศ</span>
            </div>

            <div class="glass-card rounded-3xl p-6 border border-white/[0.1] text-center">
              <span class="text-xs uppercase tracking-wider text-slate-300 font-bold font-display">CUP RUNNER-UP (รองแชมป์บอลถ้วย)</span>
              <h4 class="text-3xl font-black text-white font-display mt-2 mb-1">650 บาท</h4>
              <span class="text-xs text-slate-400 mt-1 block">สถานะ: รอผลการแข่งขันรอบชิงชนะเลิศ</span>
            </div>
          </div>

          <!-- Tournament Status Box -->
          <div class="glass-card rounded-3xl p-8 border border-white/[0.08] text-center">
            <div class="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center mx-auto mb-4 text-[#00f0ff]">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
            </div>
            <h4 class="text-lg sm:text-xl font-bold text-white mb-2">หน้านี้จะแสดงผลผังการแข่งขันและผลคะแนนเมื่อบอลถ้วยจบลงแล้ว</h4>
            <p class="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto leading-relaxed">
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
          let pHtml = '';
          squad.starting.forEach(p => {
            pHtml += `
              <div class="flex flex-col items-center justify-center p-1 text-center">
                <div class="relative">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-900 border-2 ${p.is_captain ? 'border-[#ffbe1a]' : 'border-slate-400'} flex items-center justify-center shadow-md">
                    <span class="text-xs font-bold text-slate-200">${p.pos}</span>
                  </div>
                  ${p.is_captain ? '<span class="absolute -top-1 -right-1 bg-[#ffbe1a] text-slate-950 font-black text-[9px] px-1 rounded-full font-display">C</span>' : ''}
                  ${p.is_vice ? '<span class="absolute -top-1 -right-1 bg-slate-300 text-slate-950 font-black text-[9px] px-1 rounded-full font-display">V</span>' : ''}
                </div>
                <span class="font-bold text-[11px] sm:text-xs text-white bg-slate-950/80 px-2 py-0.5 rounded mt-1 truncate max-w-[80px]">${p.name}</span>
                <span class="text-[10px] font-black text-[#00ff87] font-display">${p.points} pts</span>
              </div>
            `;
          });
          pitch.innerHTML = pHtml;
        }

        if (squad && squad.bench) {
          let bHtml = '';
          squad.bench.forEach(p => {
            bHtml += `
              <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-[10px] font-bold text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded font-display">${p.pos}</span>
                  <span class="text-xs font-bold text-slate-200">${p.name}</span>
                </div>
                <span class="text-xs font-black text-slate-400 font-display">${p.points} pts</span>
              </div>
            `;
          });
          bench.innerHTML = bHtml;
        }

        document.getElementById('team-modal').classList.remove('hidden');
      }

      closeTeamModal() {
        document.getElementById('team-modal').classList.add('hidden');
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
          this.showToast('บันทึกข้อความไฮไลท์เรียบร้อยแล้ว');
        };
      }

      closeTaglineModal() {
        document.getElementById('tagline-modal').classList.add('hidden');
      }

      // Borbou-style punchy, witty LINE message with hits, chips, and differentials
      shareCurrentGameweek() {
        const gwData = this.data.gameweeks[this.selectedGW];
        if (!gwData || !gwData.results) return;

        const isFinished = gwData.is_finished === true;
        const sorted = [...gwData.results].sort((a, b) => b.net_points - a.net_points);
        const leader = sorted[0];
        const currentLiveNote = this.getNoteForCurrentGW();

        // Gather notable hit takers & differentials
        const hitTakers = sorted.filter(t => t.hits > 0).map(t => `${t.team_name} (-${t.hits})`).join(', ');
        const chipsUsed = sorted.filter(t => t.chip).map(t => `${t.team_name} (${t.chip})`).join(', ');
        const topBench = [...sorted].sort((a, b) => b.bench_points - a.bench_points)[0];

        let text = '';
        if (isFinished) {
          text = `=== FPL ${this.config.leagueName} ===\\n` +
                 `สรุปผล GAMEWEEK ${this.selectedGW}\\n` +
                 `----------------------------------------\\n` +
                 `แชมป์ประจำสัปดาห์: ${leader.team_name} (${leader.player_name})\\n` +
                 `แต้มสุทธิ: ${leader.net_points} pts | กัปตัน: ${leader.captain || '-'}${leader.chip ? ' | การ์ด: ' + leader.chip : ''}\\n\\n` +
                 `สรุปสั้นๆ สไตล์เซียนอยู่รู:\\n` +
                 `"${currentLiveNote}"\\n\\n` +
                 `ไฮไลท์แท็กติกสัปดาห์นี้:\\n` +
                 (chipsUsed ? `- สายปล่อยการ์ด: ${chipsUsed}\\n` : '- การ์ดชิป: เก็บกริบ ไม่มีใครยอมปล่อย\\n') +
                 (hitTakers ? `- สายยอมเจ็บ: ${hitTakers}\\n` : '- แต้มลบ Hits: ไม่มีใครยอมโดนหัก\\n') +
                 (topBench && topBench.bench_points >= 10 ? `- สำรองล้นเบาะ: ${topBench.team_name} (${topBench.bench_points} pts คาเบาะ)\\n` : '') +
                 `----------------------------------------\\n` +
                 `ตารางคะแนนสัปดาห์นี้:\\n` +
                 sorted.map((t, i) => `${i + 1}. ${t.team_name}: ${t.net_points} pts${t.hits > 0 ? ' (-' + t.hits + ')' : ''}`).join('\\n') + '\\n' +
                 `----------------------------------------\\n` +
                 `จ่าฝูงรวม: ${this.standings[0].entry_name} (${this.standings[0].total} pts)\\n` +
                 `ใครอยู่รูรีบปีนขึ้นมา... สัปดาห์หน้าเจอกันใหม่!`;
        } else {
          text = `=== FPL ${this.config.leagueName} ===\\n` +
                 `รายงานสด GAMEWEEK ${this.selectedGW} (กำลังเตะ)\\n` +
                 `----------------------------------------\\n` +
                 `ผู้นำสดชั่วคราว: ${leader.team_name} (${leader.player_name})\\n` +
                 `แต้มสดสุทธิ: ${leader.net_points} pts | กัปตัน: ${leader.captain || '-'}${leader.chip ? ' | การ์ด: ' + leader.chip : ''}\\n\\n` +
                 `โน้ตเกาะติดขอบสนาม:\\n` +
                 `"${currentLiveNote}"\\n\\n` +
                 `ไฮไลท์สดรอบนี้:\\n` +
                 (chipsUsed ? `- คนงัดการ์ด: ${chipsUsed}\\n` : '') +
                 (hitTakers ? `- คนยอมโดนหักแต้ม: ${hitTakers}\\n` : '') +
                 `----------------------------------------\\n` +
                 `อันดับสด Top 3 สัปดาห์นี้:\\n` +
                 sorted.slice(0, 3).map((t, i) => `${i + 1}. ${t.team_name}: ${t.net_points} pts${t.hits > 0 ? ' (-' + t.hits + ')' : ''}`).join('\\n') + '\\n' +
                 `----------------------------------------\\n` +
                 `เตือนแล้วนะ: บอลยังเตะไม่ครบทุกคู่ อย่าเพิ่งรีบโม้ รอดูของจริงตอนจบสัปดาห์!`;
        }

        this.copyText(text);
      }

      copyPhaseShareText(phaseNumber) {
        const p = this.config.settlementPhases.find(x => x.phase === phaseNumber);
        if (!p) return;
        
        let text = `=== FPL ${this.config.leagueName} ===\\n` +
                   `สรุปยอดโอนเคลียร์เงินรางวัล: ${p.name} (GW ${p.startGW} - ${p.endGW})\\n` +
                   `----------------------------------------\\n` +
                   `ยอดเงินรางวัลรวมรอบนี้: ${p.weeklyBudget.toLocaleString()} บาท\\n` +
                   `งบแชมป์ประจำสัปดาห์: ${p.weeks} สัปดาห์ (สัปดาห์ละ 350 บ.)\\n\\n` +
                   `สรุปยอดเงินโอนเข้ากระเป๋ารอบนี้:\\n` +
                   `1. GEMINI UNITED (Micky Asawamanasak)\\n` +
                   `   - ได้แชมป์ 1 วีค (GW 1)\\n` +
                   `   - ยอดรับเงินโอน: 350 บาท\\n\\n` +
                   `----------------------------------------\\n` +
                   `(ทีมที่เหลือในรอบนี้: 0 บาท สู้ใหม่รอบหน้าอย่าเพิ่งถอดใจ!)\\n` +
                   `กรุณาตรวจเช็กยอดและโอนเคลียร์เงินรางวัลให้เรียบร้อยครับ!`;

        this.copyText(text);
      }

      copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToast('คัดลอกข้อความสรุปส่ง LINE เรียบร้อยแล้ว');
        }).catch(() => {
          this.showToast('คัดลอกข้อความสำเร็จ');
        });
      }

      showToast(msg) {
        const t = document.createElement('div');
        t.className = 'fixed bottom-6 right-6 z-50 bg-[#00ff87] text-slate-950 px-5 py-3 rounded-2xl shadow-2xl font-bold text-sm';
        t.innerText = msg;
        document.body.appendChild(t);
        setTimeout(() => t.remove(), 3000);
      }
    }

    const app = new StandaloneApp();
    document.addEventListener('DOMContentLoaded', () => app.init());
  </script>

</body>
</html>
"""

with open('preview.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print("Updated preview.html with dynamic LiveCommentaryEngine (thought fresh every time)!")
