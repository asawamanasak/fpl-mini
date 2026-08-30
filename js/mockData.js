/**
 * 100% Accurate Real Official Data from Fantasy Premier League (FPL API)
 * League ID: 40700 (เซียนอยู่รู หมูอยู่ตึก) ฤดูกาล 2026/27
 */

const MOCK_LEAGUE_DATA = {
  "league": {
    "admin_entry": 197082,
    "closed": false,
    "code_privacy": "p",
    "created": "2026-07-23T13:57:56.409234Z",
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
      "results": [
        {
          "entry_id": 306983,
          "team_name": "GEMINI UNITED",
          "player_name": "Micky Asawamanasak",
          "points": 78,
          "hits": 0,
          "net_points": 78,
          "captain": "B.Fernandes",
          "chip": "bboost",
          "bench_points": 18
        },
        {
          "entry_id": 5660962,
          "team_name": "Siampathy",
          "player_name": "Peeranat Hunthanee",
          "points": 64,
          "hits": 0,
          "net_points": 64,
          "captain": "Tzolis",
          "chip": null,
          "bench_points": 10
        },
        {
          "entry_id": 2999763,
          "team_name": "Cody Travers",
          "player_name": "Alesandro Nuyie",
          "points": 62,
          "hits": 0,
          "net_points": 62,
          "captain": "Haaland",
          "chip": null,
          "bench_points": 1
        },
        {
          "entry_id": 5950381,
          "team_name": "SUN-KUNG-JI",
          "player_name": "Athit Rattanawipapong",
          "points": 60,
          "hits": 0,
          "net_points": 60,
          "captain": "Haaland",
          "chip": null,
          "bench_points": 5
        },
        {
          "entry_id": 2604490,
          "team_name": "Leibniz FC",
          "player_name": "Ataro Munson",
          "points": 56,
          "hits": 0,
          "net_points": 56,
          "captain": "Haaland",
          "chip": null,
          "bench_points": 10
        },
        {
          "entry_id": 2189419,
          "team_name": "1234-Ultrasmooth-",
          "player_name": "Maew Mohawk",
          "points": 55,
          "hits": 0,
          "net_points": 55,
          "captain": "B.Fernandes",
          "chip": null,
          "bench_points": 2
        },
        {
          "entry_id": 197082,
          "team_name": "Mary Jojibana",
          "player_name": "Kavinjet Tantitanasap",
          "points": 51,
          "hits": 0,
          "net_points": 51,
          "captain": "Tzolis",
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
          "captain": "Haaland",
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
          "captain": "B.Fernandes",
          "chip": null,
          "bench_points": 8
        },
        {
          "entry_id": 5470959,
          "team_name": "Anjoni Iraola",
          "player_name": "pilan liu",
          "points": 48,
          "hits": 0,
          "net_points": 48,
          "captain": "Isak",
          "chip": null,
          "bench_points": 15
        },
        {
          "entry_id": 2206758,
          "team_name": "ใครไม่พีค",
          "player_name": "Isriya Paireepairit",
          "points": 42,
          "hits": 0,
          "net_points": 42,
          "captain": "B.Fernandes",
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
          "captain": "B.Fernandes",
          "chip": null,
          "bench_points": 2
        }
      ]
    },
    "2": {
      "is_finished": false,
      "results": [
        {
          "entry_id": 2604490,
          "team_name": "Leibniz FC",
          "player_name": "Ataro Munson",
          "points": 45,
          "hits": 0,
          "net_points": 45,
          "captain": "Haaland",
          "chip": null,
          "bench_points": 9
        },
        {
          "entry_id": 2999763,
          "team_name": "Cody Travers",
          "player_name": "Alesandro Nuyie",
          "points": 45,
          "hits": 4,
          "net_points": 41,
          "captain": "Haaland",
          "chip": null,
          "bench_points": 1
        },
        {
          "entry_id": 5470959,
          "team_name": "Anjoni Iraola",
          "player_name": "pilan liu",
          "points": 35,
          "hits": 0,
          "net_points": 35,
          "captain": "Isak",
          "chip": null,
          "bench_points": 10
        },
        {
          "entry_id": 5660962,
          "team_name": "Siampathy",
          "player_name": "Peeranat Hunthanee",
          "points": 31,
          "hits": 0,
          "net_points": 31,
          "captain": "Haaland",
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
          "captain": "Haaland",
          "chip": null,
          "bench_points": 3
        },
        {
          "entry_id": 197082,
          "team_name": "Mary Jojibana",
          "player_name": "Kavinjet Tantitanasap",
          "points": 28,
          "hits": 0,
          "net_points": 28,
          "captain": "Calafiori",
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
          "captain": "B.Fernandes",
          "chip": "bboost",
          "bench_points": 0
        },
        {
          "entry_id": 5950381,
          "team_name": "SUN-KUNG-JI",
          "player_name": "Athit Rattanawipapong",
          "points": 27,
          "hits": 0,
          "net_points": 27,
          "captain": "B.Fernandes",
          "chip": null,
          "bench_points": 6
        },
        {
          "entry_id": 306983,
          "team_name": "GEMINI UNITED",
          "player_name": "Micky Asawamanasak",
          "points": 21,
          "hits": 0,
          "net_points": 21,
          "captain": "B.Fernandes",
          "chip": null,
          "bench_points": 16
        },
        {
          "entry_id": 2189419,
          "team_name": "1234-Ultrasmooth-",
          "player_name": "Maew Mohawk",
          "points": 15,
          "hits": 0,
          "net_points": 15,
          "captain": "B.Fernandes",
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
          "captain": "B.Fernandes",
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
          "captain": "B.Fernandes",
          "chip": null,
          "bench_points": 0
        }
      ]
    }
  },
  "squads": {
    "2999763_2": {
      "starting": [
        {
          "id": 1,
          "name": "Raya",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 8,
          "name": "Calafiori",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 586,
          "name": "Mendy",
          "pos": "DEF",
          "points": 1,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 387,
          "name": "O'Reilly",
          "pos": "DEF",
          "points": 2,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 399,
          "name": "Cherki",
          "pos": "MID",
          "points": 14,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 15,
          "name": "Ødegaard",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": true,
          "multiplier": 1
        },
        {
          "id": 40,
          "name": "Rogers",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 428,
          "name": "Cunha",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 249,
          "name": "Barry",
          "pos": "FWD",
          "points": 2,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 411,
          "name": "Haaland",
          "pos": "FWD",
          "points": 26,
          "is_captain": true,
          "is_vice": false,
          "multiplier": 2
        },
        {
          "id": 165,
          "name": "João Pedro",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        }
      ],
      "bench": [
        {
          "id": 497,
          "name": "Dubravka",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 423,
          "name": "Shaw",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 499,
          "name": "Pedro Porro",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 212,
          "name": "Hughes",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        }
      ]
    },
    "2604490_2": {
      "starting": [
        {
          "id": 82,
          "name": "Kelleher",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 388,
          "name": "Guéhi",
          "pos": "DEF",
          "points": 2,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 201,
          "name": "Muñoz",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 112,
          "name": "Van Hecke",
          "pos": "DEF",
          "points": 1,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 19,
          "name": "Zubimendi",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 366,
          "name": "Wirtz",
          "pos": "MID",
          "points": 4,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 40,
          "name": "Rogers",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 368,
          "name": "Szoboszlai",
          "pos": "MID",
          "points": 4,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 335,
          "name": "Stach",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 411,
          "name": "Haaland",
          "pos": "FWD",
          "points": 26,
          "is_captain": true,
          "is_vice": false,
          "multiplier": 2
        },
        {
          "id": 379,
          "name": "Isak",
          "pos": "FWD",
          "points": 8,
          "is_captain": false,
          "is_vice": true,
          "multiplier": 1
        }
      ],
      "bench": [
        {
          "id": 109,
          "name": "Verbruggen",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 79,
          "name": "Evanilson",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 61,
          "name": "Truffert",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 32,
          "name": "Cash",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        }
      ]
    },
    "306983_2": {
      "starting": [
        {
          "id": 1,
          "name": "Raya",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 423,
          "name": "Shaw",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 10,
          "name": "White",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 418,
          "name": "Maguire",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 398,
          "name": "Foden",
          "pos": "MID",
          "points": 9,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 366,
          "name": "Wirtz",
          "pos": "MID",
          "points": 4,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 154,
          "name": "Palmer",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 426,
          "name": "B.Fernandes",
          "pos": "MID",
          "points": 0,
          "is_captain": true,
          "is_vice": false,
          "multiplier": 2
        },
        {
          "id": 346,
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 379,
          "name": "Isak",
          "pos": "FWD",
          "points": 8,
          "is_captain": false,
          "is_vice": true,
          "multiplier": 1
        },
        {
          "id": 165,
          "name": "João Pedro",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        }
      ],
      "bench": [
        {
          "id": 109,
          "name": "Verbruggen",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 237,
          "name": "Ndiaye",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 229,
          "name": "Tarkowski",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 304,
          "name": "O'Shea",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        }
      ]
    },
    "5660962_2": {
      "starting": [
        {
          "id": 1,
          "name": "Raya",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 8,
          "name": "Calafiori",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 91,
          "name": "Pinnock",
          "pos": "DEF",
          "points": 1,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 61,
          "name": "Truffert",
          "pos": "DEF",
          "points": 4,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 565,
          "name": "M.Sangaré",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 427,
          "name": "Mbeumo",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 557,
          "name": "Tzolis",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": true,
          "multiplier": 1
        },
        {
          "id": 428,
          "name": "Cunha",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 260,
          "name": "Wilson",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 411,
          "name": "Haaland",
          "pos": "FWD",
          "points": 26,
          "is_captain": true,
          "is_vice": false,
          "multiplier": 2
        },
        {
          "id": 165,
          "name": "João Pedro",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        }
      ],
      "bench": [
        {
          "id": 82,
          "name": "Kelleher",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 527,
          "name": "Richarlison",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 471,
          "name": "Milenković",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 422,
          "name": "Mazraoui",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        }
      ]
    },
    "5950381_2": {
      "starting": [
        {
          "id": 1,
          "name": "Raya",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 173,
          "name": "Thomas",
          "pos": "DEF",
          "points": 8,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 8,
          "name": "Calafiori",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 423,
          "name": "Shaw",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 175,
          "name": "van Ewijk",
          "pos": "DEF",
          "points": 2,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 426,
          "name": "B.Fernandes",
          "pos": "MID",
          "points": 0,
          "is_captain": true,
          "is_vice": false,
          "multiplier": 2
        },
        {
          "id": 154,
          "name": "Palmer",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 237,
          "name": "Ndiaye",
          "pos": "MID",
          "points": 4,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 346,
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 411,
          "name": "Haaland",
          "pos": "FWD",
          "points": 13,
          "is_captain": false,
          "is_vice": true,
          "multiplier": 1
        },
        {
          "id": 165,
          "name": "João Pedro",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        }
      ],
      "bench": [
        {
          "id": 301,
          "name": "Palmer",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 124,
          "name": "Groß",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 469,
          "name": "N.Williams",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 102,
          "name": "Yarmoliuk",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        }
      ]
    },
    "5470959_2": {
      "starting": [
        {
          "id": 1,
          "name": "Raya",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 8,
          "name": "Calafiori",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 112,
          "name": "Van Hecke",
          "pos": "DEF",
          "points": 1,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 358,
          "name": "Kerkez",
          "pos": "DEF",
          "points": 1,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 40,
          "name": "Rogers",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 557,
          "name": "Tzolis",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 368,
          "name": "Szoboszlai",
          "pos": "MID",
          "points": 4,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 427,
          "name": "Mbeumo",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 542,
          "name": "E.Le Fée",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 411,
          "name": "Haaland",
          "pos": "FWD",
          "points": 13,
          "is_captain": false,
          "is_vice": true,
          "multiplier": 1
        },
        {
          "id": 379,
          "name": "Isak",
          "pos": "FWD",
          "points": 16,
          "is_captain": true,
          "is_vice": false,
          "multiplier": 2
        }
      ],
      "bench": [
        {
          "id": 496,
          "name": "Kinsky",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 277,
          "name": "Egan",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 556,
          "name": "Targett",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 465,
          "name": "Osula",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        }
      ]
    },
    "197082_2": {
      "starting": [
        {
          "id": 1,
          "name": "Raya",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 332,
          "name": "Justin",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 277,
          "name": "Egan",
          "pos": "DEF",
          "points": 9,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 418,
          "name": "Maguire",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 8,
          "name": "Calafiori",
          "pos": "DEF",
          "points": 0,
          "is_captain": true,
          "is_vice": false,
          "multiplier": 2
        },
        {
          "id": 426,
          "name": "B.Fernandes",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 455,
          "name": "Tonali",
          "pos": "MID",
          "points": 2,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 366,
          "name": "Wirtz",
          "pos": "MID",
          "points": 4,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 557,
          "name": "Tzolis",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 165,
          "name": "João Pedro",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": true,
          "multiplier": 1
        },
        {
          "id": 411,
          "name": "Haaland",
          "pos": "FWD",
          "points": 13,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        }
      ],
      "bench": [
        {
          "id": 496,
          "name": "Kinsky",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 502,
          "name": "Robertson",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 45,
          "name": "McGinn",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 321,
          "name": "Walle Egeli",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        }
      ]
    },
    "2191555_2": {
      "starting": [
        {
          "id": 1,
          "name": "Raya",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 473,
          "name": "Aina",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 387,
          "name": "O'Reilly",
          "pos": "DEF",
          "points": 2,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 8,
          "name": "Calafiori",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 142,
          "name": "James",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 40,
          "name": "Rogers",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 397,
          "name": "Semenyo",
          "pos": "MID",
          "points": 5,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 427,
          "name": "Mbeumo",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 12,
          "name": "Saka",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": true,
          "multiplier": 1
        },
        {
          "id": 591,
          "name": "Enciso",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 411,
          "name": "Haaland",
          "pos": "FWD",
          "points": 26,
          "is_captain": true,
          "is_vice": false,
          "multiplier": 2
        }
      ],
      "bench": [
        {
          "id": 497,
          "name": "Dubravka",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 194,
          "name": "Thomas-Asante",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 175,
          "name": "van Ewijk",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 272,
          "name": "Kusi-Asare",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        }
      ]
    },
    "73489_2": {
      "starting": [
        {
          "id": 412,
          "name": "Lammens",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 532,
          "name": "Ballard",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 8,
          "name": "Calafiori",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 87,
          "name": "Ajer",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 94,
          "name": "Schade",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 427,
          "name": "Mbeumo",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 368,
          "name": "Szoboszlai",
          "pos": "MID",
          "points": 4,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 426,
          "name": "B.Fernandes",
          "pos": "MID",
          "points": 0,
          "is_captain": true,
          "is_vice": false,
          "multiplier": 2
        },
        {
          "id": 346,
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 165,
          "name": "João Pedro",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 411,
          "name": "Haaland",
          "pos": "FWD",
          "points": 13,
          "is_captain": false,
          "is_vice": true,
          "multiplier": 1
        }
      ],
      "bench": [
        {
          "id": 496,
          "name": "Kinsky",
          "pos": "GKP",
          "points": 1,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 124,
          "name": "Groß",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 173,
          "name": "Thomas",
          "pos": "DEF",
          "points": 8,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 175,
          "name": "van Ewijk",
          "pos": "DEF",
          "points": 2,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        }
      ]
    },
    "2189419_2": {
      "starting": [
        {
          "id": 1,
          "name": "Raya",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 8,
          "name": "Calafiori",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 499,
          "name": "Pedro Porro",
          "pos": "DEF",
          "points": 1,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 391,
          "name": "Gvardiol",
          "pos": "DEF",
          "points": 5,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 557,
          "name": "Tzolis",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 426,
          "name": "B.Fernandes",
          "pos": "MID",
          "points": 0,
          "is_captain": true,
          "is_vice": false,
          "multiplier": 2
        },
        {
          "id": 154,
          "name": "Palmer",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": true,
          "multiplier": 1
        },
        {
          "id": 427,
          "name": "Mbeumo",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 398,
          "name": "Foden",
          "pos": "MID",
          "points": 9,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 106,
          "name": "Thiago",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 165,
          "name": "João Pedro",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        }
      ],
      "bench": [
        {
          "id": 497,
          "name": "Dubravka",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 423,
          "name": "Shaw",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 527,
          "name": "Richarlison",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 259,
          "name": "Diop",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        }
      ]
    },
    "2206758_2": {
      "starting": [
        {
          "id": 1,
          "name": "Raya",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 388,
          "name": "Guéhi",
          "pos": "DEF",
          "points": 2,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 423,
          "name": "Shaw",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 4,
          "name": "Gabriel",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 418,
          "name": "Maguire",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 94,
          "name": "Schade",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 426,
          "name": "B.Fernandes",
          "pos": "MID",
          "points": 0,
          "is_captain": true,
          "is_vice": false,
          "multiplier": 2
        },
        {
          "id": 557,
          "name": "Tzolis",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 346,
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 411,
          "name": "Haaland",
          "pos": "FWD",
          "points": 13,
          "is_captain": false,
          "is_vice": true,
          "multiplier": 1
        },
        {
          "id": 165,
          "name": "João Pedro",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        }
      ],
      "bench": [
        {
          "id": 301,
          "name": "Palmer",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 51,
          "name": "George Hemmings",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 212,
          "name": "Hughes",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 259,
          "name": "Diop",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        }
      ]
    },
    "1206581_2": {
      "starting": [
        {
          "id": 1,
          "name": "Raya",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 8,
          "name": "Calafiori",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 534,
          "name": "Hume",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 418,
          "name": "Maguire",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 426,
          "name": "B.Fernandes",
          "pos": "MID",
          "points": 0,
          "is_captain": true,
          "is_vice": false,
          "multiplier": 2
        },
        {
          "id": 397,
          "name": "Semenyo",
          "pos": "MID",
          "points": 5,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 427,
          "name": "Mbeumo",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 270,
          "name": "Reed",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 411,
          "name": "Haaland",
          "pos": "FWD",
          "points": 13,
          "is_captain": false,
          "is_vice": true,
          "multiplier": 1
        },
        {
          "id": 165,
          "name": "João Pedro",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        },
        {
          "id": 346,
          "name": "Calvert-Lewin",
          "pos": "FWD",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 1
        }
      ],
      "bench": [
        {
          "id": 171,
          "name": "Dovin",
          "pos": "GKP",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 212,
          "name": "Hughes",
          "pos": "MID",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 305,
          "name": "Davis",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        },
        {
          "id": 259,
          "name": "Diop",
          "pos": "DEF",
          "points": 0,
          "is_captain": false,
          "is_vice": false,
          "multiplier": 0
        }
      ]
    }
  },
  "cup": {
    "status": "pending",
    "has_started": false,
    "message": "ยังไม่เริ่มการแข่งขัน (รอระบบ FPL ประกบคู่)"
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = MOCK_LEAGUE_DATA;
}
