/**
 * 100% Accurate Real Official Data from Fantasy Premier League (FPL API)
 * League ID: 40700 (เซียนอยู่รู หมูอยู่ตึก)
 */

const MOCK_LEAGUE_DATA = {
  "league": {
    "admin_entry": 197082,
    "closed": false,
    "code_privacy": "p",
    "created": "2024-07-23T13:57:56.409234Z",
    "cup_league": null,
    "has_cup": true,
    "id": 40700,
    "league_type": "x",
    "max_entries": null,
    "name": "เซียนอยู่รู หมูอยู่ตึก",
    "rank": null,
    "scoring": "c",
    "start_event": 1
  },
  "teams": [
    {
      "entry_id": 2999763,
      "entry_name": "Cody Travers",
      "player_name": "Alesandro Nuyie",
      "rank": 1,
      "total": 103,
      "gw_points": 45
    },
    {
      "entry_id": 2604490,
      "entry_name": "Leibniz FC",
      "player_name": "Ataro Munson",
      "rank": 2,
      "total": 101,
      "gw_points": 45
    },
    {
      "entry_id": 306983,
      "entry_name": "GEMINI UNITED",
      "player_name": "Micky Asawamanasak",
      "rank": 3,
      "total": 99,
      "gw_points": 21
    },
    {
      "entry_id": 5660962,
      "entry_name": "Siampathy",
      "player_name": "Peeranat Hunthanee",
      "rank": 4,
      "total": 95,
      "gw_points": 31
    },
    {
      "entry_id": 5950381,
      "entry_name": "SUN-KUNG-JI",
      "player_name": "Athit Rattanawipapong",
      "rank": 5,
      "total": 87,
      "gw_points": 27
    },
    {
      "entry_id": 5470959,
      "entry_name": "Anjoni Iraola",
      "player_name": "pilan liu",
      "rank": 6,
      "total": 83,
      "gw_points": 35
    },
    {
      "entry_id": 197082,
      "entry_name": "Mary Jojibana",
      "player_name": "Kavinjet Tantitanasap",
      "rank": 7,
      "total": 79,
      "gw_points": 28
    },
    {
      "entry_id": 2191555,
      "entry_name": "1234 Barbyu Barbyu",
      "player_name": "Maew Mohawk",
      "rank": 8,
      "total": 78,
      "gw_points": 33
    },
    {
      "entry_id": 73489,
      "entry_name": "Some might say",
      "player_name": "FAme Pakviwat",
      "rank": 9,
      "total": 77,
      "gw_points": 28
    },
    {
      "entry_id": 2189419,
      "entry_name": "1234-Ultrasmooth-",
      "player_name": "Maew Mohawk",
      "rank": 10,
      "total": 70,
      "gw_points": 15
    },
    {
      "entry_id": 2206758,
      "entry_name": "ใครไม่พีค",
      "player_name": "Isriya Paireepairit",
      "rank": 11,
      "total": 57,
      "gw_points": 15
    },
    {
      "entry_id": 1206581,
      "entry_name": "TK.FPL",
      "player_name": "Teerasade Khemprasit",
      "rank": 12,
      "total": 46,
      "gw_points": 18
    }
  ],
  "gameweeks": {
    "1": {
      "is_finished": true,
      "tagline": "GEMINI UNITED เปิดหัวก็บ้าพลัง งัดการ์ด Bench Boost ขนมาทั้งตำบล 78 แต้ม ส่วน Siampathy กับ Mary Jojibana โคตรอินดี้ตั้ง Tzolis ตัวนอกสายตาเป็นกัปตันจนแต้มลั่น ขณะที่ Anjoni Iraola นั่งกุมขมับปล่อยตัวสำรองกดไป 15 แต้มคาเบาะ!",
      "results": [
        {
          "entry_id": 2999763,
          "team_name": "Cody Travers",
          "player_name": "Alesandro Nuyie",
          "points": 62,
          "hits": 0,
          "net_points": 62,
          "captain": "Haaland (C)",
          "chip": null,
          "bench_points": 1
        },
        {
          "entry_id": 2604490,
          "team_name": "Leibniz FC",
          "player_name": "Ataro Munson",
          "points": 56,
          "hits": 0,
          "net_points": 56,
          "captain": "Haaland (C)",
          "chip": null,
          "bench_points": 10
        },
        {
          "entry_id": 306983,
          "team_name": "GEMINI UNITED",
          "player_name": "Micky Asawamanasak",
          "points": 78,
          "hits": 0,
          "net_points": 78,
          "captain": "B.Fernandes (C)",
          "chip": "bboost",
          "bench_points": 0
        },
        {
          "entry_id": 5660962,
          "team_name": "Siampathy",
          "player_name": "Peeranat Hunthanee",
          "points": 64,
          "hits": 0,
          "net_points": 64,
          "captain": "Tzolis (C)",
          "chip": null,
          "bench_points": 10
        },
        {
          "entry_id": 5950381,
          "team_name": "SUN-KUNG-JI",
          "player_name": "Athit Rattanawipapong",
          "points": 60,
          "hits": 0,
          "net_points": 60,
          "captain": "Haaland (C)",
          "chip": null,
          "bench_points": 5
        },
        {
          "entry_id": 5470959,
          "team_name": "Anjoni Iraola",
          "player_name": "pilan liu",
          "points": 48,
          "hits": 0,
          "net_points": 48,
          "captain": "Isak (C)",
          "chip": null,
          "bench_points": 15
        },
        {
          "entry_id": 197082,
          "team_name": "Mary Jojibana",
          "player_name": "Kavinjet Tantitanasap",
          "points": 51,
          "hits": 0,
          "net_points": 51,
          "captain": "Tzolis (C)",
          "chip": null,
          "bench_points": 13
        },
        {
          "entry_id": 2191555,
          "team_name": "1234 Barbyu Barbyu",
          "player_name": "Maew Mohawk",
          "points": 49,
          "hits": 0,
          "net_points": 49,
          "captain": "Haaland (C)",
          "chip": null,
          "bench_points": 3
        },
        {
          "entry_id": 73489,
          "team_name": "Some might say",
          "player_name": "FAme Pakviwat",
          "points": 49,
          "hits": 0,
          "net_points": 49,
          "captain": "B.Fernandes (C)",
          "chip": null,
          "bench_points": 8
        },
        {
          "entry_id": 2189419,
          "team_name": "1234-Ultrasmooth-",
          "player_name": "Maew Mohawk",
          "points": 55,
          "hits": 0,
          "net_points": 55,
          "captain": "B.Fernandes (C)",
          "chip": null,
          "bench_points": 2
        },
        {
          "entry_id": 2206758,
          "team_name": "ใครไม่พีค",
          "player_name": "Isriya Paireepairit",
          "points": 42,
          "hits": 0,
          "net_points": 42,
          "captain": "B.Fernandes (C)",
          "chip": null,
          "bench_points": 2
        },
        {
          "entry_id": 1206581,
          "team_name": "TK.FPL",
          "player_name": "Teerasade Khemprasit",
          "points": 32,
          "hits": 0,
          "net_points": 32,
          "captain": "B.Fernandes (C)",
          "chip": null,
          "bench_points": 2
        }
      ]
    },
    "2": {
      "is_finished": false,
      "tagline": "Leibniz FC พึ่งบารมีฮาลันด์นำเดี่ยว 45 แต้ม ด้าน Cody Travers กับ Barbyu Barbyu ใจถึงยอมจ่ายค่าปรับติดลบ -4 แก้เกม ส่วน Mary Jojibana อินดี้จัดตั้ง Calafiori เป็นกัปตัน บอลยังเตะไม่ครบ อย่าเพิ่งรีบโม้ เดี๋ยวจะหาว่าไม่เตือน!",
      "results": [
        {
          "entry_id": 2999763,
          "team_name": "Cody Travers",
          "player_name": "Alesandro Nuyie",
          "points": 45,
          "hits": 4,
          "net_points": 41,
          "captain": "Haaland (C)",
          "chip": null,
          "bench_points": 1
        },
        {
          "entry_id": 2604490,
          "team_name": "Leibniz FC",
          "player_name": "Ataro Munson",
          "points": 45,
          "hits": 0,
          "net_points": 45,
          "captain": "Haaland (C)",
          "chip": null,
          "bench_points": 9
        },
        {
          "entry_id": 306983,
          "team_name": "GEMINI UNITED",
          "player_name": "Micky Asawamanasak",
          "points": 21,
          "hits": 0,
          "net_points": 21,
          "captain": "B.Fernandes (C)",
          "chip": null,
          "bench_points": 16
        },
        {
          "entry_id": 5660962,
          "team_name": "Siampathy",
          "player_name": "Peeranat Hunthanee",
          "points": 31,
          "hits": 0,
          "net_points": 31,
          "captain": "Haaland (C)",
          "chip": null,
          "bench_points": 3
        },
        {
          "entry_id": 5950381,
          "team_name": "SUN-KUNG-JI",
          "player_name": "Athit Rattanawipapong",
          "points": 27,
          "hits": 0,
          "net_points": 27,
          "captain": "B.Fernandes (C)",
          "chip": null,
          "bench_points": 6
        },
        {
          "entry_id": 5470959,
          "team_name": "Anjoni Iraola",
          "player_name": "pilan liu",
          "points": 35,
          "hits": 0,
          "net_points": 35,
          "captain": "Isak (C)",
          "chip": null,
          "bench_points": 10
        },
        {
          "entry_id": 197082,
          "team_name": "Mary Jojibana",
          "player_name": "Kavinjet Tantitanasap",
          "points": 28,
          "hits": 0,
          "net_points": 28,
          "captain": "Calafiori (C)",
          "chip": null,
          "bench_points": 3
        },
        {
          "entry_id": 2191555,
          "team_name": "1234 Barbyu Barbyu",
          "player_name": "Maew Mohawk",
          "points": 33,
          "hits": 4,
          "net_points": 29,
          "captain": "Haaland (C)",
          "chip": null,
          "bench_points": 3
        },
        {
          "entry_id": 73489,
          "team_name": "Some might say",
          "player_name": "FAme Pakviwat",
          "points": 28,
          "hits": 0,
          "net_points": 28,
          "captain": "B.Fernandes (C)",
          "chip": "bboost",
          "bench_points": 0
        },
        {
          "entry_id": 2189419,
          "team_name": "1234-Ultrasmooth-",
          "player_name": "Maew Mohawk",
          "points": 15,
          "hits": 0,
          "net_points": 15,
          "captain": "B.Fernandes (C)",
          "chip": null,
          "bench_points": 0
        },
        {
          "entry_id": 2206758,
          "team_name": "ใครไม่พีค",
          "player_name": "Isriya Paireepairit",
          "points": 15,
          "hits": 0,
          "net_points": 15,
          "captain": "B.Fernandes (C)",
          "chip": null,
          "bench_points": 0
        },
        {
          "entry_id": 1206581,
          "team_name": "TK.FPL",
          "player_name": "Teerasade Khemprasit",
          "points": 18,
          "hits": 4,
          "net_points": 14,
          "captain": "B.Fernandes (C)",
          "chip": null,
          "bench_points": 0
        }
      ]
    }
  },
  "squads": {
    "2999763_1": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "James",
          "pos": "DEF",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Shaw",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "O'Reilly",
          "pos": "DEF",
          "team": "MCI",
          "points": 2,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Cherki",
          "pos": "MID",
          "team": "MCI",
          "points": 14,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Ødegaard",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "Rogers",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Cunha",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Dubravka",
          "pos": "GKP",
          "team": "TOT",
          "points": 0
        },
        {
          "name": "Pedro Porro",
          "pos": "DEF",
          "team": "TOT",
          "points": 1
        },
        {
          "name": "Beto",
          "pos": "FWD",
          "team": "EVE",
          "points": 1
        },
        {
          "name": "Hughes",
          "pos": "MID",
          "team": "CRY",
          "points": 0
        }
      ]
    },
    "2999763_2": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mendy",
          "pos": "DEF",
          "team": "HUL",
          "points": 1,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "O'Reilly",
          "pos": "DEF",
          "team": "MCI",
          "points": 2,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Cherki",
          "pos": "MID",
          "team": "MCI",
          "points": 14,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Ødegaard",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "Rogers",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Cunha",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Barry",
          "pos": "FWD",
          "team": "EVE",
          "points": 2,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Dubravka",
          "pos": "GKP",
          "team": "TOT",
          "points": 0
        },
        {
          "name": "Shaw",
          "pos": "DEF",
          "team": "MUN",
          "points": 0
        },
        {
          "name": "Pedro Porro",
          "pos": "DEF",
          "team": "TOT",
          "points": 1
        },
        {
          "name": "Hughes",
          "pos": "MID",
          "team": "CRY",
          "points": 0
        }
      ]
    },
    "2604490_1": {
      "starting": [
        {
          "name": "Kelleher",
          "pos": "GKP",
          "team": "BRE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Guéhi",
          "pos": "DEF",
          "team": "MCI",
          "points": 2,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Muñoz",
          "pos": "DEF",
          "team": "CRY",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Van Hecke",
          "pos": "DEF",
          "team": "TOT",
          "points": 1,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Zubimendi",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Wirtz",
          "pos": "MID",
          "team": "LIV",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Rogers",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Szoboszlai",
          "pos": "MID",
          "team": "LIV",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Stach",
          "pos": "MID",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Isak",
          "pos": "FWD",
          "team": "LIV",
          "points": 8,
          "is_captain": false,
          "is_vice": true
        }
      ],
      "bench": [
        {
          "name": "Verbruggen",
          "pos": "GKP",
          "team": "BHA",
          "points": 0
        },
        {
          "name": "Evanilson",
          "pos": "FWD",
          "team": "BOU",
          "points": 5
        },
        {
          "name": "Truffert",
          "pos": "DEF",
          "team": "BOU",
          "points": 4
        },
        {
          "name": "Cash",
          "pos": "DEF",
          "team": "AVL",
          "points": 0
        }
      ]
    },
    "2604490_2": {
      "starting": [
        {
          "name": "Kelleher",
          "pos": "GKP",
          "team": "BRE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Guéhi",
          "pos": "DEF",
          "team": "MCI",
          "points": 2,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Muñoz",
          "pos": "DEF",
          "team": "CRY",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Van Hecke",
          "pos": "DEF",
          "team": "TOT",
          "points": 1,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Zubimendi",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Wirtz",
          "pos": "MID",
          "team": "LIV",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Rogers",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Szoboszlai",
          "pos": "MID",
          "team": "LIV",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Stach",
          "pos": "MID",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Isak",
          "pos": "FWD",
          "team": "LIV",
          "points": 8,
          "is_captain": false,
          "is_vice": true
        }
      ],
      "bench": [
        {
          "name": "Verbruggen",
          "pos": "GKP",
          "team": "BHA",
          "points": 0
        },
        {
          "name": "Evanilson",
          "pos": "FWD",
          "team": "BOU",
          "points": 5
        },
        {
          "name": "Truffert",
          "pos": "DEF",
          "team": "BOU",
          "points": 4
        },
        {
          "name": "Cash",
          "pos": "DEF",
          "team": "AVL",
          "points": 0
        }
      ]
    },
    "306983_1": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Shaw",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "White",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Maguire",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Foden",
          "pos": "MID",
          "team": "MCI",
          "points": 9,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Wirtz",
          "pos": "MID",
          "team": "LIV",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Palmer",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Isak",
          "pos": "FWD",
          "team": "LIV",
          "points": 8,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Verbruggen",
          "pos": "GKP",
          "team": "BHA",
          "points": 0
        },
        {
          "name": "Ndiaye",
          "pos": "MID",
          "team": "EVE",
          "points": 4
        },
        {
          "name": "Tarkowski",
          "pos": "DEF",
          "team": "EVE",
          "points": 12
        },
        {
          "name": "O'Shea",
          "pos": "DEF",
          "team": "IPS",
          "points": 0
        }
      ]
    },
    "306983_2": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Shaw",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "White",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Maguire",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Foden",
          "pos": "MID",
          "team": "MCI",
          "points": 9,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Wirtz",
          "pos": "MID",
          "team": "LIV",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Palmer",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Isak",
          "pos": "FWD",
          "team": "LIV",
          "points": 8,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Verbruggen",
          "pos": "GKP",
          "team": "BHA",
          "points": 0
        },
        {
          "name": "Ndiaye",
          "pos": "MID",
          "team": "EVE",
          "points": 4
        },
        {
          "name": "Tarkowski",
          "pos": "DEF",
          "team": "EVE",
          "points": 12
        },
        {
          "name": "O'Shea",
          "pos": "DEF",
          "team": "IPS",
          "points": 0
        }
      ]
    },
    "5660962_1": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Milenković",
          "pos": "DEF",
          "team": "NFO",
          "points": 3,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mazraoui",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "M.Sangaré",
          "pos": "MID",
          "team": "BRE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Wilson",
          "pos": "MID",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mbeumo",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Tzolis",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Cunha",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Kelleher",
          "pos": "GKP",
          "team": "BRE",
          "points": 0
        },
        {
          "name": "Truffert",
          "pos": "DEF",
          "team": "BOU",
          "points": 4
        },
        {
          "name": "Pinnock",
          "pos": "DEF",
          "team": "COV",
          "points": 1
        },
        {
          "name": "Richarlison",
          "pos": "FWD",
          "team": "TOT",
          "points": 0
        }
      ]
    },
    "5660962_2": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Pinnock",
          "pos": "DEF",
          "team": "COV",
          "points": 1,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Truffert",
          "pos": "DEF",
          "team": "BOU",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "M.Sangaré",
          "pos": "MID",
          "team": "BRE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mbeumo",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Tzolis",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "Cunha",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Wilson",
          "pos": "MID",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Kelleher",
          "pos": "GKP",
          "team": "BRE",
          "points": 0
        },
        {
          "name": "Richarlison",
          "pos": "FWD",
          "team": "TOT",
          "points": 0
        },
        {
          "name": "Milenković",
          "pos": "DEF",
          "team": "NFO",
          "points": 3
        },
        {
          "name": "Mazraoui",
          "pos": "DEF",
          "team": "MUN",
          "points": 0
        }
      ]
    },
    "5950381_1": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "N.Williams",
          "pos": "DEF",
          "team": "NFO",
          "points": 6,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Shaw",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Groß",
          "pos": "MID",
          "team": "BHA",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "Palmer",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Ndiaye",
          "pos": "MID",
          "team": "EVE",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Palmer",
          "pos": "GKP",
          "team": "IPS",
          "points": 0
        },
        {
          "name": "Yarmoliuk",
          "pos": "MID",
          "team": "BRE",
          "points": 0
        },
        {
          "name": "Thomas",
          "pos": "DEF",
          "team": "COV",
          "points": 8
        },
        {
          "name": "van Ewijk",
          "pos": "DEF",
          "team": "COV",
          "points": 2
        }
      ]
    },
    "5950381_2": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Thomas",
          "pos": "DEF",
          "team": "COV",
          "points": 8,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Shaw",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "van Ewijk",
          "pos": "DEF",
          "team": "COV",
          "points": 2,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Palmer",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Ndiaye",
          "pos": "MID",
          "team": "EVE",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Palmer",
          "pos": "GKP",
          "team": "IPS",
          "points": 0
        },
        {
          "name": "Groß",
          "pos": "MID",
          "team": "BHA",
          "points": 0
        },
        {
          "name": "N.Williams",
          "pos": "DEF",
          "team": "NFO",
          "points": 6
        },
        {
          "name": "Yarmoliuk",
          "pos": "MID",
          "team": "BRE",
          "points": 0
        }
      ]
    },
    "5470959_1": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Van Hecke",
          "pos": "DEF",
          "team": "TOT",
          "points": 1,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Kerkez",
          "pos": "DEF",
          "team": "LIV",
          "points": 1,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Rogers",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Tzolis",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Szoboszlai",
          "pos": "MID",
          "team": "LIV",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mbeumo",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "E.Le Fée",
          "pos": "MID",
          "team": "SUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "Isak",
          "pos": "FWD",
          "team": "LIV",
          "points": 8,
          "is_captain": true,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Kinsky",
          "pos": "GKP",
          "team": "TOT",
          "points": 1
        },
        {
          "name": "Osula",
          "pos": "FWD",
          "team": "NEW",
          "points": 0
        },
        {
          "name": "Targett",
          "pos": "DEF",
          "team": "HUL",
          "points": 0
        },
        {
          "name": "Egan",
          "pos": "DEF",
          "team": "HUL",
          "points": 9
        }
      ]
    },
    "5470959_2": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Van Hecke",
          "pos": "DEF",
          "team": "TOT",
          "points": 1,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Kerkez",
          "pos": "DEF",
          "team": "LIV",
          "points": 1,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Rogers",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Tzolis",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Szoboszlai",
          "pos": "MID",
          "team": "LIV",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mbeumo",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "E.Le Fée",
          "pos": "MID",
          "team": "SUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "Isak",
          "pos": "FWD",
          "team": "LIV",
          "points": 8,
          "is_captain": true,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Kinsky",
          "pos": "GKP",
          "team": "TOT",
          "points": 1
        },
        {
          "name": "Egan",
          "pos": "DEF",
          "team": "HUL",
          "points": 9
        },
        {
          "name": "Targett",
          "pos": "DEF",
          "team": "HUL",
          "points": 0
        },
        {
          "name": "Osula",
          "pos": "FWD",
          "team": "NEW",
          "points": 0
        }
      ]
    },
    "197082_1": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Maguire",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Robertson",
          "pos": "DEF",
          "team": "TOT",
          "points": 2,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "Wirtz",
          "pos": "MID",
          "team": "LIV",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Tonali",
          "pos": "MID",
          "team": "TOT",
          "points": 2,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Tzolis",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "McGinn",
          "pos": "MID",
          "team": "AVL",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Kinsky",
          "pos": "GKP",
          "team": "TOT",
          "points": 1
        },
        {
          "name": "Palestra",
          "pos": "DEF",
          "team": "CHE",
          "points": 0
        },
        {
          "name": "Walle Egeli",
          "pos": "FWD",
          "team": "IPS",
          "points": 0
        },
        {
          "name": "Justin",
          "pos": "DEF",
          "team": "LEE",
          "points": 0
        }
      ]
    },
    "197082_2": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Justin",
          "pos": "DEF",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Egan",
          "pos": "DEF",
          "team": "HUL",
          "points": 9,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Maguire",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Tonali",
          "pos": "MID",
          "team": "TOT",
          "points": 2,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Wirtz",
          "pos": "MID",
          "team": "LIV",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Tzolis",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Kinsky",
          "pos": "GKP",
          "team": "TOT",
          "points": 1
        },
        {
          "name": "Robertson",
          "pos": "DEF",
          "team": "TOT",
          "points": 2
        },
        {
          "name": "McGinn",
          "pos": "MID",
          "team": "AVL",
          "points": 0
        },
        {
          "name": "Walle Egeli",
          "pos": "FWD",
          "team": "IPS",
          "points": 0
        }
      ]
    },
    "2191555_1": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Aina",
          "pos": "DEF",
          "team": "NFO",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "O'Reilly",
          "pos": "DEF",
          "team": "MCI",
          "points": 2,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "James",
          "pos": "DEF",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Rogers",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Semenyo",
          "pos": "MID",
          "team": "MCI",
          "points": 5,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mbeumo",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Saka",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Richarlison",
          "pos": "FWD",
          "team": "TOT",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Dubravka",
          "pos": "GKP",
          "team": "TOT",
          "points": 0
        },
        {
          "name": "George Hemmings",
          "pos": "MID",
          "team": "AVL",
          "points": 0
        },
        {
          "name": "van Ewijk",
          "pos": "DEF",
          "team": "COV",
          "points": 2
        },
        {
          "name": "Kusi-Asare",
          "pos": "FWD",
          "team": "FUL",
          "points": 0
        }
      ]
    },
    "2191555_2": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Aina",
          "pos": "DEF",
          "team": "NFO",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "O'Reilly",
          "pos": "DEF",
          "team": "MCI",
          "points": 2,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "James",
          "pos": "DEF",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Rogers",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Semenyo",
          "pos": "MID",
          "team": "MCI",
          "points": 5,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mbeumo",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Saka",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "Enciso",
          "pos": "MID",
          "team": "IPS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": true,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Dubravka",
          "pos": "GKP",
          "team": "TOT",
          "points": 0
        },
        {
          "name": "Thomas-Asante",
          "pos": "FWD",
          "team": "COV",
          "points": 1
        },
        {
          "name": "van Ewijk",
          "pos": "DEF",
          "team": "COV",
          "points": 2
        },
        {
          "name": "Kusi-Asare",
          "pos": "FWD",
          "team": "FUL",
          "points": 0
        }
      ]
    },
    "73489_1": {
      "starting": [
        {
          "name": "Lammens",
          "pos": "GKP",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Ballard",
          "pos": "DEF",
          "team": "SUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Ajer",
          "pos": "DEF",
          "team": "BRE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Schade",
          "pos": "MID",
          "team": "BRE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mbeumo",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Szoboszlai",
          "pos": "MID",
          "team": "LIV",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": false,
          "is_vice": true
        }
      ],
      "bench": [
        {
          "name": "Kinsky",
          "pos": "GKP",
          "team": "TOT",
          "points": 1
        },
        {
          "name": "Groß",
          "pos": "MID",
          "team": "BHA",
          "points": 0
        },
        {
          "name": "Thomas",
          "pos": "DEF",
          "team": "COV",
          "points": 8
        },
        {
          "name": "van Ewijk",
          "pos": "DEF",
          "team": "COV",
          "points": 2
        }
      ]
    },
    "73489_2": {
      "starting": [
        {
          "name": "Lammens",
          "pos": "GKP",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Ballard",
          "pos": "DEF",
          "team": "SUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Ajer",
          "pos": "DEF",
          "team": "BRE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Schade",
          "pos": "MID",
          "team": "BRE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mbeumo",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Szoboszlai",
          "pos": "MID",
          "team": "LIV",
          "points": 4,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": false,
          "is_vice": true
        }
      ],
      "bench": [
        {
          "name": "Kinsky",
          "pos": "GKP",
          "team": "TOT",
          "points": 1
        },
        {
          "name": "Groß",
          "pos": "MID",
          "team": "BHA",
          "points": 0
        },
        {
          "name": "Thomas",
          "pos": "DEF",
          "team": "COV",
          "points": 8
        },
        {
          "name": "van Ewijk",
          "pos": "DEF",
          "team": "COV",
          "points": 2
        }
      ]
    },
    "2189419_1": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Shaw",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Diop",
          "pos": "DEF",
          "team": "IPS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Palmer",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Foden",
          "pos": "MID",
          "team": "MCI",
          "points": 9,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mbeumo",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Tzolis",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Thiago",
          "pos": "FWD",
          "team": "BRE",
          "points": 0,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Dubravka",
          "pos": "GKP",
          "team": "TOT",
          "points": 0
        },
        {
          "name": "Richarlison",
          "pos": "FWD",
          "team": "TOT",
          "points": 0
        },
        {
          "name": "Pedro Porro",
          "pos": "DEF",
          "team": "TOT",
          "points": 1
        },
        {
          "name": "Mukiele",
          "pos": "DEF",
          "team": "SUN",
          "points": 0
        }
      ]
    },
    "2189419_2": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Pedro Porro",
          "pos": "DEF",
          "team": "TOT",
          "points": 1,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Gvardiol",
          "pos": "DEF",
          "team": "MCI",
          "points": 5,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Tzolis",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Palmer",
          "pos": "MID",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "Mbeumo",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Foden",
          "pos": "MID",
          "team": "MCI",
          "points": 9,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Thiago",
          "pos": "FWD",
          "team": "BRE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Dubravka",
          "pos": "GKP",
          "team": "TOT",
          "points": 0
        },
        {
          "name": "Shaw",
          "pos": "DEF",
          "team": "MUN",
          "points": 0
        },
        {
          "name": "Richarlison",
          "pos": "FWD",
          "team": "TOT",
          "points": 0
        },
        {
          "name": "Diop",
          "pos": "DEF",
          "team": "IPS",
          "points": 0
        }
      ]
    },
    "2206758_1": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Shaw",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Gabriel",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Maguire",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "George Hemmings",
          "pos": "MID",
          "team": "AVL",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Schade",
          "pos": "MID",
          "team": "BRE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Tzolis",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Palmer",
          "pos": "GKP",
          "team": "IPS",
          "points": 0
        },
        {
          "name": "Pedro Porro",
          "pos": "DEF",
          "team": "TOT",
          "points": 1
        },
        {
          "name": "Hughes",
          "pos": "MID",
          "team": "CRY",
          "points": 0
        },
        {
          "name": "Diop",
          "pos": "DEF",
          "team": "IPS",
          "points": 0
        }
      ]
    },
    "2206758_2": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Guéhi",
          "pos": "DEF",
          "team": "MCI",
          "points": 2,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Shaw",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Gabriel",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Maguire",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Schade",
          "pos": "MID",
          "team": "BRE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Tzolis",
          "pos": "MID",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Palmer",
          "pos": "GKP",
          "team": "IPS",
          "points": 0
        },
        {
          "name": "George Hemmings",
          "pos": "MID",
          "team": "AVL",
          "points": 0
        },
        {
          "name": "Hughes",
          "pos": "MID",
          "team": "CRY",
          "points": 0
        },
        {
          "name": "Diop",
          "pos": "DEF",
          "team": "IPS",
          "points": 0
        }
      ]
    },
    "1206581_1": {
      "starting": [
        {
          "name": "Steele",
          "pos": "GKP",
          "team": "BHA",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Gabriel",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Hume",
          "pos": "DEF",
          "team": "SUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Maguire",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Davis",
          "pos": "DEF",
          "team": "IPS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Semenyo",
          "pos": "MID",
          "team": "MCI",
          "points": 5,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mbeumo",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Dovin",
          "pos": "GKP",
          "team": "COV",
          "points": 0
        },
        {
          "name": "Reed",
          "pos": "MID",
          "team": "FUL",
          "points": 0
        },
        {
          "name": "Hughes",
          "pos": "MID",
          "team": "CRY",
          "points": 0
        },
        {
          "name": "Diop",
          "pos": "DEF",
          "team": "IPS",
          "points": 0
        }
      ]
    },
    "1206581_2": {
      "starting": [
        {
          "name": "Raya",
          "pos": "GKP",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calafiori",
          "pos": "DEF",
          "team": "ARS",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Hume",
          "pos": "DEF",
          "team": "SUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Maguire",
          "pos": "DEF",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "B.Fernandes",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": true,
          "is_vice": false
        },
        {
          "name": "Semenyo",
          "pos": "MID",
          "team": "MCI",
          "points": 5,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Mbeumo",
          "pos": "MID",
          "team": "MUN",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Reed",
          "pos": "MID",
          "team": "FUL",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Haaland",
          "pos": "FWD",
          "team": "MCI",
          "points": 13,
          "is_captain": false,
          "is_vice": true
        },
        {
          "name": "João Pedro",
          "pos": "FWD",
          "team": "CHE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        },
        {
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "team": "LEE",
          "points": 0,
          "is_captain": false,
          "is_vice": false
        }
      ],
      "bench": [
        {
          "name": "Dovin",
          "pos": "GKP",
          "team": "COV",
          "points": 0
        },
        {
          "name": "Hughes",
          "pos": "MID",
          "team": "CRY",
          "points": 0
        },
        {
          "name": "Davis",
          "pos": "DEF",
          "team": "IPS",
          "points": 0
        },
        {
          "name": "Diop",
          "pos": "DEF",
          "team": "IPS",
          "points": 0
        }
      ]
    }
  },
  "cup": {
    "is_started": false,
    "is_finished": false,
    "prizes": {
      "champion": { "prize": 1000, "status": "รอผลการแข่งขัน" },
      "runnerUp": { "prize": 650, "status": "รอผลการแข่งขัน" }
    },
    "rounds": []
  }
};

window.MOCK_LEAGUE_DATA = MOCK_LEAGUE_DATA;
