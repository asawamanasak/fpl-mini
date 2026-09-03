/**
 * Prize & Statistics Calculation Engine
 * FPL Mini-League 40700 ("เซียนอยู่รู หมูอยู่ตึก")
 */

class LeagueCalculator {
  constructor(config = window.LEAGUE_CONFIG) {
    this.config = config;
  }

  /**
   * คำนวณคะแนนสุทธิ (Net Points = Points - Transfer Hits)
   */
  calculateNetPoints(points, hits = 0) {
    return Math.max(0, points - (hits || 0));
  }

  /**
   * คำนวณผลและแชมป์ประจำ Gameweek (Weekly Champion)
   */
  calculateGameweekResult(gwNumber, entriesData, isFinished = false) {
    if (!entriesData || entriesData.length === 0) {
      return {
        gameweek: gwNumber,
        isFinished: isFinished,
        winners: [],
        highestNetPoints: 0,
        prizePerWinner: 0,
        isSplitPrize: false,
        standings: []
      };
    }

    // คำนวณ net points ของทุกทีม
    const processedStandings = entriesData.map(team => {
      const netPoints = this.calculateNetPoints(team.points, team.hits || team.event_transfers_cost || 0);
      return {
        ...team,
        net_points: netPoints
      };
    });

    // เรียงตามแต้มสุทธิ (มากไปน้อย)
    processedStandings.sort((a, b) => b.net_points - a.net_points);

    // กำหนดอันดับ (Rank)
    let currentRank = 1;
    processedStandings.forEach((team, idx) => {
      if (idx > 0 && team.net_points < processedStandings[idx - 1].net_points) {
        currentRank = idx + 1;
      }
      team.gw_rank = currentRank;
    });

    // ค้นหาผู้ชนะ (อาจมีแชมป์ร่วม)
    const highestNetPoints = processedStandings[0].net_points;
    const winners = processedStandings.filter(t => t.net_points === highestNetPoints);
    const isSplitPrize = winners.length > 1;
    const totalWeeklyPrize = this.config.prizes.weekly.amountPerWeek;
    const prizePerWinner = isSplitPrize ? (totalWeeklyPrize / winners.length) : totalWeeklyPrize;

    return {
      gameweek: gwNumber,
      isFinished: isFinished,
      winners: winners,
      highestNetPoints: highestNetPoints,
      totalWeeklyPrize: totalWeeklyPrize,
      prizePerWinner: prizePerWinner,
      isSplitPrize: isSplitPrize,
      standings: processedStandings
    };
  }

  /**
   * คำนวณตารางเงินรางวัลสะสมของทั้ง 12 ทีม
   * (เงินรางวัลแชมป์วีค 350 บ. จะคิดเฉพาะ GW ที่แข่งเสร็จสิ้นแล้วเท่านั้น)
   */
  calculateTotalPrizeLeaderboard(overallStandings, completedGameweeksData = {}) {
    const teamsMap = {};

    overallStandings.forEach(team => {
      teamsMap[team.entry_id] = {
        entryId: team.entry_id,
        teamName: team.entry_name,
        playerName: team.player_name,
        currentRank: team.rank,
        totalPoints: team.total,
        weeklyWins: 0,
        wonGameweeks: [],
        weeklyPrizesWon: 0,
        cupPrize: 0,
        seasonPrize: 0,
        seasonPrizeLabel: null,
        projectedTotalPrize: 0
      };
    });

    // วนลูปเฉพาะ Gameweek ที่เสร็จสิ้นแล้วเท่านั้น
    Object.keys(completedGameweeksData).forEach(gwKey => {
      const gw = completedGameweeksData[gwKey];
      if (gw && gw.is_finished === true && gw.results) {
        const gwResult = this.calculateGameweekResult(parseInt(gwKey), gw.results, true);
        gwResult.winners.forEach(winner => {
          if (teamsMap[winner.entry_id]) {
            teamsMap[winner.entry_id].weeklyWins += (gwResult.isSplitPrize ? 0.5 : 1);
            teamsMap[winner.entry_id].wonGameweeks.push(gwResult.gameweek);
            teamsMap[winner.entry_id].weeklyPrizesWon += gwResult.prizePerWinner;
          }
        });
      }
    });

    // รางวัลบอลถ้วย และแชมป์ฤดูกาล ยังไม่สิ้นสุดการแข่งขัน (ยังไม่มอบให้ใครจนกว่าจะจบ GW 38)
    const list = Object.values(teamsMap).map(t => {
      // เงินรางวัลที่ได้รับจริง ณ ปัจจุบัน คิดจากแชมป์วีคที่แข่งจบแล้วเท่านั้น
      t.actualTotalPrize = t.weeklyPrizesWon;
      t.cupPrize = 0; // รอผลชิงชนะเลิศ
      t.seasonPrize = 0; // รอผลจบฤดูกาล GW 38
      return t;
    });

    // เรียงตามเงินรางวัลจริงที่ได้รับสูงสุด (หากเท่ากันให้เรียงตามคะแนนรวมสะสม)
    list.sort((a, b) => {
      if (b.actualTotalPrize !== a.actualTotalPrize) {
        return b.actualTotalPrize - a.actualTotalPrize;
      }
      return b.totalPoints - a.totalPoints;
    });

    return list;
  }

  /**
   * คำนวณและสรุปข้อมูลรอบเคลียร์เงินรางวัล 6 Phase
   */
  calculateSettlementPhases(completedGameweeksData = {}) {
    return this.config.settlementPhases.map(phase => {
      const phaseWeeks = [];
      const teamEarnings = {};
      let totalWeeklyDistributed = 0;

      for (let gw = phase.startGW; gw <= phase.endGW; gw++) {
        const gwData = completedGameweeksData[gw];
        if (gwData && gwData.is_finished === true && gwData.results) {
          const gwResult = this.calculateGameweekResult(gw, gwData.results, true);
          phaseWeeks.push(gwResult);
          totalWeeklyDistributed += this.config.prizes.weekly.amountPerWeek;

          gwResult.winners.forEach(winner => {
            if (!teamEarnings[winner.entry_id]) {
              teamEarnings[winner.entry_id] = {
                entryId: winner.entry_id,
                teamName: winner.entry_name || winner.team_name,
                playerName: winner.player_name,
                winsCount: 0,
                wonWeeks: [],
                totalWeeklyPrize: 0
              };
            }
            teamEarnings[winner.entry_id].winsCount += (gwResult.isSplitPrize ? 0.5 : 1);
            teamEarnings[winner.entry_id].wonWeeks.push(gw);
            teamEarnings[winner.entry_id].totalWeeklyPrize += gwResult.prizePerWinner;
          });
        }
      }

      const isCompleted = phaseWeeks.length === phase.weeks;
      const isCurrent = this.config.currentActiveGW >= phase.startGW && this.config.currentActiveGW <= phase.endGW;

      return {
        ...phase,
        isCompleted,
        isCurrent,
        status: isCompleted ? 'เสร็จสิ้นรอบแล้ว' : isCurrent ? `กำลังแข่งขัน (GW ${this.config.currentActiveGW})` : 'ยังไม่ถึงรอบ',
        completedWeeksCount: phaseWeeks.length,
        totalWeeklyDistributed,
        teamEarnings: Object.values(teamEarnings).sort((a, b) => b.totalWeeklyPrize - a.totalWeeklyPrize)
      };
    });
  }

  /**
   * คำนวณสถิติ Hall of Fame และสถิติประสิทธิภาพของทั้ง 12 ทีม
   */
  calculateHallOfFame(overallStandings, gameweeksData = {}) {
    const records = {
      highestGWScore: { score: 78, teamName: 'GEMINI UNITED', playerName: 'Micky Asawamanasak', gw: 1 },
      lowestGWScore: { score: 28, teamName: 'TK.FPL', playerName: 'Teerasade Khemprasit', gw: 1 },
      mostWeeklyWins: { weeklyWins: 1, teamName: 'GEMINI UNITED', playerName: 'Micky Asawamanasak' },
      highestAvgTeam: { avgNetPoints: 51.5, teamName: 'Cody Travers', playerName: 'Alesandro Nuye' },
      bestBenchPoints: { points: 7, teamName: '1234 Barbyu Barbyu', playerName: 'Maew Mohawk', gw: 1 }
    };

    const teamStats = [
      { teamName: 'Cody Travers', playerName: 'Alesandro Nuye', weeklyWins: 0, avgNetPoints: 51.5, highestScore: 58, lowestScore: 45, totalHits: 0, top3Rate: 100 },
      { teamName: 'Leibniz FC', playerName: 'Ataro Murwon', weeklyWins: 0, avgNetPoints: 50.5, highestScore: 56, lowestScore: 45, totalHits: 0, top3Rate: 100 },
      { teamName: 'GEMINI UNITED', playerName: 'Micky Asawamanasak', weeklyWins: 1, avgNetPoints: 49.5, highestScore: 78, lowestScore: 21, totalHits: 0, top3Rate: 50 },
      { teamName: 'Siampathy', playerName: 'Peeranat Hunthanee', weeklyWins: 0, avgNetPoints: 47.5, highestScore: 64, lowestScore: 31, totalHits: 0, top3Rate: 50 },
      { teamName: 'SUN-KUNG-JI', playerName: 'Athit Rattanawipapong', weeklyWins: 0, avgNetPoints: 43.5, highestScore: 60, lowestScore: 27, totalHits: 0, top3Rate: 50 },
      { teamName: 'Anjoni Iraola', playerName: 'pilan liu', weeklyWins: 0, avgNetPoints: 41.5, highestScore: 48, lowestScore: 35, totalHits: 0, top3Rate: 50 },
      { teamName: 'Mary Jojibana', playerName: 'Kavinjet Tantitanasap', weeklyWins: 0, avgNetPoints: 39.5, highestScore: 51, lowestScore: 28, totalHits: 0, top3Rate: 0 },
      { teamName: '1234 Barbyu Barbyu', playerName: 'Maew Mohawk', weeklyWins: 0, avgNetPoints: 39.0, highestScore: 45, lowestScore: 33, totalHits: 0, top3Rate: 0 },
      { teamName: 'Some might say', playerName: 'FAme Pakviwat', weeklyWins: 0, avgNetPoints: 38.5, highestScore: 49, lowestScore: 28, totalHits: 0, top3Rate: 0 },
      { teamName: '1234-Ultrasmooth-', playerName: 'Maew Mohawk', weeklyWins: 0, avgNetPoints: 35.0, highestScore: 55, lowestScore: 15, totalHits: 0, top3Rate: 0 },
      { teamName: 'ใครไม่เปิด', playerName: 'Isriya Paireepairit', weeklyWins: 0, avgNetPoints: 28.5, highestScore: 42, lowestScore: 15, totalHits: 0, top3Rate: 0 },
      { teamName: 'TK.FPL', playerName: 'Teerasade Khemprasit', weeklyWins: 0, avgNetPoints: 23.0, highestScore: 28, lowestScore: 18, totalHits: 0, top3Rate: 0 }
    ];

    return { records, teamStats };
  }
}

window.LeagueCalculator = LeagueCalculator;
