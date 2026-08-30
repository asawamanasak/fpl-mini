/**
 * Configuration for FPL Mini-League 40700 ("เซียนอยู่รู หมูอยู่ตึก")
 * Season: 2026/27
 */

const LEAGUE_CONFIG = {
  leagueId: 40700,
  leagueName: 'เซียนอยู่รู หมูอยู่ตึก',
  season: '2026/27',
  totalTeams: 12,
  entryFeePerTeam: 2000,
  totalPrizePool: 22000,
  totalGameweeks: 38,
  currentActiveGW: 2, // Active live week

  // โครงสร้างเงินรางวัล (Prize Structure)
  prizes: {
    weekly: {
      amountPerWeek: 350,
      totalWeeks: 38,
      totalAmount: 13300,
      description: 'รางวัลแชมป์ประจำสัปดาห์ 38 วีค (สัปดาห์ละ 350 บาท คำนวณเมื่อจบสัปดาห์)'
    },
    cup: {
      champion: 1000,
      runnerUp: 650,
      totalAmount: 1650,
      description: 'รางวัลแชมป์และรองแชมป์บอลถ้วย'
    },
    season: {
      ranks: [
        { rank: 1, prize: 3500, label: 'ชนะเลิศอันดับ 1' },
        { rank: 2, prize: 2000, label: 'รองชนะเลิศอันดับ 1' },
        { rank: 3, prize: 1000, label: 'อันดับ 3' },
        { rank: 4, prize: 550, label: 'อันดับ 4' }
      ],
      totalAmount: 7050,
      description: 'รางวัลแชมป์ฤดูกาล อันดับ 1-4'
    }
  },

  // รอบการเคลียร์เงินรางวัล 6 Phase
  settlementPhases: [
    {
      phase: 1,
      name: 'รอบที่ 1',
      startGW: 1,
      endGW: 6,
      weeks: 6,
      weeklyBudget: 2100,
      isFinal: false
    },
    {
      phase: 2,
      name: 'รอบที่ 2',
      startGW: 7,
      endGW: 12,
      weeks: 6,
      weeklyBudget: 2100,
      isFinal: false
    },
    {
      phase: 3,
      name: 'รอบที่ 3',
      startGW: 13,
      endGW: 18,
      weeks: 6,
      weeklyBudget: 2100,
      isFinal: false
    },
    {
      phase: 4,
      name: 'รอบที่ 4',
      startGW: 19,
      endGW: 24,
      weeks: 6,
      weeklyBudget: 2100,
      isFinal: false
    },
    {
      phase: 5,
      name: 'รอบที่ 5',
      startGW: 25,
      endGW: 30,
      weeks: 6,
      weeklyBudget: 2100,
      isFinal: false
    },
    {
      phase: 6,
      name: 'รอบที่ 6 (ท้ายฤดูกาล)',
      startGW: 31,
      endGW: 38,
      weeks: 8,
      weeklyBudget: 2800,
      isFinal: true,
      hasCup: true,
      hasSeasonPrizes: true
    }
  ],

  // CORS Proxy list for fallback API requests on GitHub Pages
  corsProxies: [
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
  ]
};

window.LEAGUE_CONFIG = LEAGUE_CONFIG;
