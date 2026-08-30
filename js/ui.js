/**
 * UI Renderer for FPL Mini-League 40700 Dashboard
 * Minimalist Clean Modern OLED Dark Design (No Emojis)
 */

class UIRenderer {
  constructor() {
    this.taglineManager = new TaglineManager();
    this.shareManager = new ShareManager();
    this.calculator = new LeagueCalculator();
  }

  /**
   * Render แถบเลื่อนเลือก Gameweek (GW 1 - 38)
   * กฎ: สัปดาห์ที่ยังไม่ถึงจะไม่สามารถคลิกเลือกได้
   */
  renderGameweekSelector(currentGW, totalGW = 38, maxAvailableGW = 2) {
    const container = document.getElementById('gw-selector-container');
    if (!container) return;

    let html = '';
    for (let gw = 1; gw <= totalGW; gw++) {
      const isSelected = gw === currentGW;
      const isLive = gw === maxAvailableGW;
      const isAvailable = gw <= maxAvailableGW;

      // Buttons reduced 50% in size (compact min-w-[48px], py-1 px-2.5)
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

    setTimeout(() => {
      const activeBtn = container.querySelector('.scale-105');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }, 100);
  }

  /**
   * Render การ์ดผลงานประจำสัปดาห์
   * กฎ: ถ้ายังเตะไม่จบ จะแสดงสถานะกำลังแข่งขัน (LIVE) และไม่สรุปว่าเป็นแชมป์ 350 บาท
   */
  renderChampionCard(gwNumber, gwResult, defaultTagline = null, isFinished = false) {
    const container = document.getElementById('champion-card-container');
    if (!container) return;

    if (!gwResult || !gwResult.winners || gwResult.winners.length === 0) {
      container.innerHTML = `
        <div class="glass-card p-6 rounded-2xl text-center text-slate-400">
          <p>ยังไม่มีข้อมูลการแข่งขันสำหรับ Gameweek ${gwNumber}</p>
        </div>
      `;
      return;
    }

    const leader = gwResult.winners[0];
    const taglineObj = this.taglineManager.getTagline(gwNumber, gwResult, defaultTagline);
    const chipBadge = leader.chip ? `<span class="chip-badge badge-${leader.chip.toLowerCase()} font-display">${leader.chip}</span>` : '';
    const isJoint = gwResult.winners.length > 1;

    if (isFinished) {
      // Finished: Declare Weekly Champion
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
                  <span class="text-xs uppercase tracking-widest text-[#00ff87] font-bold font-display">GAMEWEEK ${gwNumber} CHAMPION</span>
                  <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight">แชมป์ประจำสัปดาห์</h3>
                </div>
              </div>

              <div class="flex items-center gap-2 bg-[#00ff87]/10 border border-[#00ff87]/30 px-4 py-2 rounded-2xl">
                <span class="text-[#00ff87] font-bold text-xs sm:text-sm font-display">${isJoint ? 'แชมป์ร่วมประจำสัปดาห์' : 'สรุปผลประจำสัปดาห์'}</span>
              </div>
            </div>

            <!-- Team Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-[#08080c] border border-white/[0.08] rounded-2xl p-5 mb-5">
              <div class="md:col-span-2">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    ${leader.entry_name || leader.team_name} ${isJoint ? '& ' + gwResult.winners[1].entry_name : ''}
                  </h4>
                  ${chipBadge}
                </div>
                <p class="text-slate-400 text-sm flex items-center gap-2 flex-wrap">
                  <span>ผู้จัดการ: <strong class="text-slate-100 font-semibold">${leader.player_name} ${isJoint ? '& ' + gwResult.winners[1].player_name : ''}</strong></span>
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

            <!-- Tagline (Dynamic Live - Borbou Style) -->
            <div class="bg-gradient-to-r from-[#14141b] via-[#0d0d12] to-[#14141b] border border-white/[0.1] rounded-2xl p-4 flex items-center justify-between gap-3">
              <div class="flex-1">
                <span class="text-[11px] uppercase tracking-wider text-[#00f0ff] font-bold block font-display">CHAMPION HIGHLIGHT NOTE</span>
                <p class="text-sm sm:text-base font-medium text-slate-200 mt-0.5 leading-snug">
                  "${taglineObj.text}"
                </p>
              </div>
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <button 
                  onclick="app.regenerateTagline(${gwNumber})"
                  class="p-2 text-slate-400 hover:text-[#00ff87] hover:bg-white/[0.08] rounded-xl transition-all"
                  title="สุ่มคิดโน้ตใหม่"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
                <button 
                  onclick="app.openTaglineModal(${gwNumber}, '${taglineObj.text.replace(/'/g, "\\'")}')"
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
      // Live / In Progress: Do NOT award prize yet!
      container.innerHTML = `
        <div class="relative overflow-hidden glass-card-live rounded-3xl p-6 sm:p-8">
          <div class="absolute -right-16 -top-16 w-64 h-64 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div class="relative z-10">
            <div class="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div class="flex items-center gap-3.5">
                <div class="w-10 h-10 rounded-xl bg-[#00f0ff]/15 border border-[#00f0ff]/30 flex items-center justify-center text-[#00f0ff] font-black text-xs font-display">
                  LIVE
                </div>
                <div>
                  <span class="text-xs uppercase tracking-widest text-[#00f0ff] font-bold font-display">GAMEWEEK ${gwNumber} (IN PROGRESS)</span>
                  <h3 class="text-xl sm:text-2xl font-black text-white tracking-tight">ผู้นำคะแนนประจำสัปดาห์ชั่วคราว</h3>
                </div>
              </div>

              <div class="flex items-center gap-2 bg-[#00f0ff]/10 border border-[#00f0ff]/30 px-4 py-2 rounded-2xl">
                <span class="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
                <span class="text-[#00f0ff] font-bold text-xs sm:text-sm font-display">กำลังแข่งขัน (ยังไม่จบสัปดาห์)</span>
              </div>
            </div>

            <!-- Team Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-[#08080c] border border-white/[0.08] rounded-2xl p-5 mb-5">
              <div class="md:col-span-2">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 class="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    ${leader.entry_name || leader.team_name} ${isJoint ? '& ' + gwResult.winners[1].entry_name : ''}
                  </h4>
                  ${chipBadge}
                </div>
                <p class="text-slate-400 text-sm flex items-center gap-2 flex-wrap">
                  <span>ผู้นำคะแนน: <strong class="text-slate-100 font-semibold">${leader.player_name} ${isJoint ? '& ' + gwResult.winners[1].player_name : ''}</strong></span>
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

            <!-- Tagline (Dynamic Live - Borbou Style) -->
            <div class="bg-gradient-to-r from-[#14141b] via-[#0d0d12] to-[#14141b] border border-white/[0.1] rounded-2xl p-4 flex items-center justify-between gap-3">
              <div class="flex-1">
                <span class="text-[11px] uppercase tracking-wider text-[#00f0ff] font-bold block font-display">MATCHDAY LIVE NOTE</span>
                <p class="text-sm sm:text-base font-medium text-slate-200 mt-0.5 leading-snug">
                  "${taglineObj.text}"
                </p>
              </div>
              <div class="flex items-center gap-1.5 flex-shrink-0">
                <button 
                  onclick="app.regenerateTagline(${gwNumber})"
                  class="p-2 text-slate-400 hover:text-[#00ff87] hover:bg-white/[0.08] rounded-xl transition-all"
                  title="สุ่มคิดโน้ตใหม่"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </button>
                <button 
                  onclick="app.openTaglineModal(${gwNumber}, '${taglineObj.text.replace(/'/g, "\\'")}')"
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
  }

  /**
   * Render ตารางคะแนนประจำ Gameweek (Matchday Leaderboard - Neutral for all teams)
   */
  renderMatchdayTable(gwResult) {
    const container = document.getElementById('matchday-table-body');
    if (!container) return;

    if (!gwResult || !gwResult.standings || gwResult.standings.length === 0) {
      container.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-500">ไม่มีข้อมูลการแข่งขัน</td></tr>`;
      return;
    }

    let html = '';
    gwResult.standings.forEach((team, idx) => {
      const isTop = idx === 0;
      const rankBadge = isTop 
        ? '<span class="w-6 h-6 rounded-full bg-[#ffbe1a] text-slate-950 font-black text-xs flex items-center justify-center font-display shadow-md shadow-[#ffbe1a]/30">1</span>'
        : idx === 1
          ? '<span class="w-6 h-6 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center font-display">2</span>'
          : idx === 2
            ? '<span class="w-6 h-6 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center font-display">3</span>'
            : `<span class="text-slate-400 text-xs font-bold font-display pl-2">${idx + 1}</span>`;

      const chipBadge = team.chip ? `<span class="chip-badge badge-${team.chip.toLowerCase()} ml-2 font-display">${team.chip}</span>` : '';
      const hitsBadge = team.hits > 0 ? `<span class="text-rose-400 font-bold font-display">-${team.hits}</span>` : '<span class="text-slate-600 font-display">-</span>';

      html += `
        <tr class="hover:bg-white/[0.03] transition-colors">
          <td class="py-3 px-3.5">${rankBadge}</td>
          <td class="py-3 px-3.5">
            <button onclick="app.openTeamModal(${team.entry_id}, '${team.entry_name || team.team_name}')" class="text-left font-bold text-slate-100 hover:text-[#00f0ff] transition-colors flex items-center gap-1.5 flex-wrap">
              <span>${team.entry_name || team.team_name}</span>
              ${chipBadge}
            </button>
            <span class="text-xs text-slate-400 block">${team.player_name}</span>
          </td>
          <td class="py-3 px-3.5 text-center">
            <span class="text-xs text-[#00f0ff] font-medium">${team.captain || '-'}</span>
          </td>
          <td class="py-3 px-3.5 text-center font-display font-medium text-slate-300">${team.points}</td>
          <td class="py-3 px-3.5 text-center">${hitsBadge}</td>
          <td class="py-3 px-3.5 text-center">
            <span class="text-base font-black font-display text-slate-100">${team.net_points}</span>
          </td>
          <td class="py-3 px-3.5 text-center">
            <span class="text-xs text-slate-400 font-display">${team.bench_points !== undefined ? team.bench_points : '-'}</span>
          </td>
        </tr>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Render ตารางคะแนนรวมของลีก (Overall Standings - Neutral for all teams)
   */
  renderOverallStandings(standings) {
    const container = document.getElementById('overall-standings-body');
    if (!container) return;

    if (!standings || standings.length === 0) {
      container.innerHTML = `<tr><td colspan="4" class="text-center py-6 text-slate-500">ไม่มีข้อมูลตารางคะแนน</td></tr>`;
      return;
    }

    let html = '';
    standings.forEach((team, idx) => {
      const rank = team.rank || (idx + 1);
      const isTop3 = rank <= 3;
      const rankBadge = rank === 1 
        ? '<span class="text-[10px] bg-[#ffbe1a]/15 text-[#ffbe1a] border border-[#ffbe1a]/30 px-2 py-0.5 rounded-md font-bold font-display">TOP 1</span>'
        : rank === 2
          ? '<span class="text-[10px] bg-slate-300/15 text-slate-200 border border-slate-300/30 px-2 py-0.5 rounded-md font-bold font-display">TOP 2</span>'
          : rank === 3
            ? '<span class="text-[10px] bg-amber-700/20 text-amber-300 border border-amber-600/30 px-2 py-0.5 rounded-md font-bold font-display">TOP 3</span>'
            : '';

      html += `
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
          <td class="py-3 px-3.5 text-center font-display text-slate-300 text-sm">${team.gw_points || '-'}</td>
          <td class="py-3 px-3.5 text-center font-display font-black text-[#00ff87] text-base">${team.total}</td>
        </tr>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Render ตารางเงินรางวัลสะสม (Total Prize Money Leaderboard - Neutral)
   */
  renderPrizeLeaderboard(prizeList) {
    const container = document.getElementById('prize-leaderboard-body');
    if (!container) return;

    if (!prizeList || prizeList.length === 0) {
      container.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-500">ไม่มีข้อมูลเงินรางวัล</td></tr>`;
      return;
    }

    let html = '';
    prizeList.forEach((team, idx) => {
      const actualTotal = team.actualTotalPrize || team.weeklyPrizesWon || 0;
      const rankColor = actualTotal > 0 ? 'text-[#00ff87]' : 'text-slate-400';

      html += `
        <tr class="hover:bg-white/[0.03] transition-colors">
          <td class="py-3.5 px-3.5 font-display font-bold text-center ${actualTotal > 0 ? 'text-[#ffbe1a]' : 'text-slate-500'}">${idx + 1}</td>
          <td class="py-3.5 px-3.5">
            <span class="font-bold text-slate-100 block">${team.teamName}</span>
            <span class="text-xs text-slate-400">${team.playerName}</span>
          </td>
          <td class="py-3.5 px-3.5 text-center font-display font-bold text-[#00f0ff]">
            ${team.weeklyWins > 0 ? team.weeklyWins + ' ครั้ง' : '0'}
            ${team.wonGameweeks && team.wonGameweeks.length > 0 ? `<span class="block text-[10px] text-slate-400 font-normal font-display">(GW ${team.wonGameweeks.join(', ')})</span>` : ''}
          </td>
          <td class="py-3.5 px-3.5 text-center font-display text-slate-200">${team.weeklyPrizesWon > 0 ? team.weeklyPrizesWon.toLocaleString() + ' บาท' : '-'}</td>
          <td class="py-3.5 px-3.5 text-center font-display text-slate-500 text-xs">${team.cupPrize > 0 ? `${team.cupPrize.toLocaleString()} บาท` : '-'}</td>
          <td class="py-3.5 px-3.5 text-center font-display text-slate-500 text-xs">${team.seasonPrize > 0 ? `${team.seasonPrize.toLocaleString()} บาท` : '-'}</td>
          <td class="py-3.5 px-3.5 text-center font-display font-black text-base sm:text-lg ${actualTotal > 0 ? 'text-[#00ff87]' : 'text-slate-500'}">
            ${actualTotal > 0 ? actualTotal.toLocaleString() + ' บาท' : '-'}
          </td>
        </tr>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Render รอบเคลียร์เงินรางวัล 6 Phase (Settlement Phases)
   * กฎ: ถ้ารอบไหนยังไม่ครบจำนวน GW จะปิดปุ่มคลิกและแสดงผลเป็นสีเทา
   */
  renderSettlementPhases(phaseReports) {
    const container = document.getElementById('settlement-phases-container');
    if (!container) return;

    let html = '';
    phaseReports.forEach(phase => {
      const isCompleted = phase.isCompleted === true;
      const isCurrent = phase.isCurrent;
      
      const badgeClass = isCompleted 
        ? 'bg-[#00ff87]/15 text-[#00ff87] border-[#00ff87]/30' 
        : isCurrent 
          ? 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30' 
          : 'bg-[#14141b] text-slate-600 border-white/[0.04]';

      const statusText = isCompleted 
        ? 'เสร็จสิ้นรอบแล้ว' 
        : isCurrent 
          ? `ยังไม่ครบรอบ (${phase.completedWeeksCount}/${phase.weeks} GW)` 
          : 'ยังไม่ถึงรอบ';

      let winnersHtml = '';
      if (!phase.teamEarnings || phase.teamEarnings.length === 0) {
        winnersHtml = '<p class="text-xs text-slate-500 py-3 text-center">ยังไม่มีข้อมูลการแข่งขันในรอบนี้</p>';
      } else {
        phase.teamEarnings.forEach(t => {
          winnersHtml += `
            <div class="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0 text-xs sm:text-sm">
              <div>
                <span class="font-bold text-slate-200">${t.teamName}</span>
                <span class="text-xs text-slate-400 block">${t.playerName} (ชนะ ${t.winsCount} วีค: GW ${t.wonWeeks.join(', ')})</span>
              </div>
              <span class="font-black text-[#00ff87] font-display">${t.totalWeeklyPrize.toLocaleString()} บาท</span>
            </div>
          `;
        });
      }

      const buttonHtml = isCompleted
        ? `<button 
            onclick="app.sharePhaseSummary(${phase.phase})" 
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

      html += `
        <div class="glass-card rounded-2xl p-5 border border-white/[0.08] flex flex-col justify-between ${!isCompleted ? 'opacity-80' : ''}">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-xs uppercase tracking-wider font-extrabold ${isCompleted ? 'text-[#00ff87]' : isCurrent ? 'text-[#00f0ff]' : 'text-slate-500'} font-display">${phase.name}</span>
              <span class="text-[11px] px-2.5 py-0.5 rounded-full border ${badgeClass} font-semibold">${statusText}</span>
            </div>
            <h4 class="text-lg font-black text-white font-display mb-1">GW ${phase.startGW} - ${phase.endGW} (${phase.weeks} สัปดาห์)</h4>
            <p class="text-xs text-slate-400 mb-4">งบแชมป์วีค: <strong class="text-slate-200">${phase.weeklyBudget.toLocaleString()} บาท</strong> ${phase.hasCup ? '+ บอลถ้วย & แชมป์ลีก' : ''}</p>
            
            <div class="bg-[#08080c] rounded-xl p-3.5 mb-4 border border-white/[0.04]">
              <span class="text-[11px] uppercase tracking-wider text-slate-400 font-bold block mb-2">สรุปยอดเงินโอน:</span>
              ${winnersHtml}
            </div>
          </div>

          <div class="pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <span class="text-xs text-slate-400">จ่ายแล้ว: <strong class="${isCompleted ? 'text-[#00ff87]' : 'text-slate-300'} font-display font-bold">${phase.totalWeeklyDistributed.toLocaleString()} บาท</strong></span>
            ${buttonHtml}
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }

  /**
   * Render Hall of Fame & สถิติรวมของลีก (Comprehensive Statistics)
   */
  renderHallOfFame(hallOfFameData) {
    const records = hallOfFameData.records;
    const teamStats = hallOfFameData.teamStats;

    // 1. Records Overview Cards
    const recContainer = document.getElementById('hall-of-fame-records');
    if (recContainer) {
      recContainer.innerHTML = `
        <div class="glass-card p-5 rounded-2xl border border-[#ffbe1a]/30">
          <span class="text-xs uppercase tracking-wider text-[#ffbe1a] font-bold block mb-1">คะแนนสูงสุดใน 1 วีค (จบแล้ว)</span>
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-3xl font-black text-[#ffbe1a] font-display">${records.highestGWScore.score}</span>
            <span class="text-xs text-amber-200/80 font-medium font-display">NET PTS (GW ${records.highestGWScore.gw})</span>
          </div>
          <p class="text-sm font-bold text-white">${records.highestGWScore.teamName}</p>
          <span class="text-xs text-slate-400">${records.highestGWScore.playerName}</span>
        </div>

        <div class="glass-card p-5 rounded-2xl border border-[#00ff87]/30">
          <span class="text-xs uppercase tracking-wider text-[#00ff87] font-bold block mb-1">จอมกวาดแชมป์วีค</span>
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-3xl font-black text-[#00ff87] font-display">${records.mostWeeklyWins.weeklyWins}</span>
            <span class="text-xs text-emerald-200/80 font-medium">ครั้ง (${(records.mostWeeklyWins.weeklyWins * 350).toLocaleString()} บาท)</span>
          </div>
          <p class="text-sm font-bold text-white">${records.mostWeeklyWins.teamName}</p>
          <span class="text-xs text-slate-400">${records.mostWeeklyWins.playerName}</span>
        </div>

        <div class="glass-card p-5 rounded-2xl border border-[#00f0ff]/30">
          <span class="text-xs uppercase tracking-wider text-[#00f0ff] font-bold block mb-1">จ่าฝูงแต้มรวมสูงสุด</span>
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-3xl font-black text-[#00f0ff] font-display">${records.highestAvgTeam.avgNetPoints}</span>
            <span class="text-xs text-cyan-200/80 font-medium font-display">AVG PTS / GW</span>
          </div>
          <p class="text-sm font-bold text-white">${records.highestAvgTeam.teamName}</p>
          <span class="text-xs text-slate-400">${records.highestAvgTeam.playerName}</span>
        </div>

        <div class="glass-card p-5 rounded-2xl border border-[#9d4edd]/30">
          <span class="text-xs uppercase tracking-wider text-purple-400 font-bold block mb-1">ตัวสำรองแต้มกระจาย</span>
          <div class="flex items-baseline gap-2 mb-1">
            <span class="text-3xl font-black text-purple-300 font-display">${records.bestBenchPoints.points}</span>
            <span class="text-xs text-purple-200/80 font-medium font-display">BENCH PTS (GW ${records.bestBenchPoints.gw})</span>
          </div>
          <p class="text-sm font-bold text-white">${records.bestBenchPoints.teamName}</p>
          <span class="text-xs text-slate-400">${records.bestBenchPoints.playerName}</span>
        </div>
      `;
    }

    // 2. Comprehensive Statistics Table (Neutral)
    const tableBody = document.getElementById('hall-of-fame-table-body');
    if (tableBody) {
      let html = '';
      teamStats.forEach((t, idx) => {
        html += `
          <tr class="hover:bg-white/[0.03] transition-colors">
            <td class="py-3 px-3.5 font-display font-bold text-center text-slate-400">${idx + 1}</td>
            <td class="py-3 px-3.5">
              <span class="font-bold text-slate-100 block">${t.teamName}</span>
              <span class="text-xs text-slate-400">${t.playerName}</span>
            </td>
            <td class="py-3 px-3.5 text-center font-display font-black text-[#00ff87]">${t.weeklyWins}</td>
            <td class="py-3 px-3.5 text-center font-display font-bold text-[#00f0ff]">${t.avgNetPoints}</td>
            <td class="py-3 px-3.5 text-center font-display text-slate-300">${t.highestScore}</td>
            <td class="py-3 px-3.5 text-center font-display text-slate-500">${t.lowestScore}</td>
            <td class="py-3 px-3.5 text-center font-display text-rose-400">-${t.totalHits}</td>
            <td class="py-3 px-3.5 text-center font-display text-[#9d4edd] font-semibold">${t.top3Rate}%</td>
          </tr>
        `;
      });
      tableBody.innerHTML = html;
    }
  }

  /**
   * Render ฟุตบอลถ้วย (Cup Tournament Bracket)
   * กฎ: หน้านี้จะแสดงผลสายการแข่งขันและคะแนนเมื่อการแข่งขันเสร็จสิ้นแล้ว
   */
  renderCupTournament(cupData) {
    const container = document.getElementById('cup-tournament-container');
    if (!container) return;

    const isFinished = cupData && cupData.is_finished === true;

    if (!isFinished || !cupData.rounds || cupData.rounds.length === 0) {
      // Pending / Locked State until tournament is completed
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
      return;
    }

    // Finished Tournament Render
    let roundsHtml = '';
    cupData.rounds.forEach(r => {
      let matchesHtml = '';
      r.matches.forEach(m => {
        matchesHtml += `
          <div class="bg-[#08080c] border border-white/[0.06] rounded-xl p-3.5 mb-3 flex items-center justify-between">
            <div class="flex-1">
              <span class="block font-bold text-xs sm:text-sm text-slate-300">${m.team1}</span>
            </div>
            <div class="px-3 font-display font-black text-sm sm:text-base text-slate-500">
              ${m.score1} : ${m.score2}
            </div>
            <div class="flex-1 text-right">
              <span class="block font-bold text-xs sm:text-sm text-slate-300">${m.team2}</span>
            </div>
          </div>
        `;
      });

      roundsHtml += `
        <div class="glass-card rounded-2xl p-5 border border-white/[0.08]">
          <h4 class="text-sm sm:text-base font-black text-white font-display mb-3 text-[#00f0ff]">
            ${r.round_name}
          </h4>
          ${matchesHtml}
        </div>
      `;
    });

    container.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="glass-card-gold rounded-2xl p-5 border border-[#ffbe1a]/30 text-center">
          <span class="text-xs uppercase tracking-wider text-[#ffbe1a] font-bold font-display">CUP CHAMPION</span>
          <h4 class="text-2xl font-black text-white font-display mt-1">1,000 บาท</h4>
          <span class="text-xs text-amber-200/80 mt-1 block">สถานะ: ${cupData.prizes.champion.currentLeader || 'เสร็จสิ้น'}</span>
        </div>

        <div class="glass-card rounded-2xl p-5 border border-white/[0.1] text-center">
          <span class="text-xs uppercase tracking-wider text-slate-300 font-bold font-display">CUP RUNNER-UP</span>
          <h4 class="text-2xl font-black text-white font-display mt-1">650 บาท</h4>
          <span class="text-xs text-slate-400 mt-1 block">สถานะ: ${cupData.prizes.runnerUp.currentLeader || 'เสร็จสิ้น'}</span>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        ${roundsHtml}
      </div>
    `;
  }
}

window.UIRenderer = UIRenderer;
