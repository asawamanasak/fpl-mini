/**
 * UI Renderer for FPL Mini-League 40700 Dashboard
 * Modern Clean Light Theme & Sukhumvit Set Typography (No Emojis)
 */

class UIRenderer {
  constructor() {
    this.taglineManager = new TaglineManager();
    this.shareManager = new ShareManager();
    this.calculator = new LeagueCalculator();
  }

  /**
   * Render แถบเลื่อนเลือก Gameweek (GW 1 - 38)
   */
  renderGameweekSelector(currentGW, totalGW = 38, maxAvailableGW = 2) {
    const container = document.getElementById('gw-selector-container');
    if (!container) return;

    let html = '';
    for (let gw = 1; gw <= totalGW; gw++) {
      const isSelected = gw === currentGW;
      const isLive = gw === maxAvailableGW;
      const isAvailable = gw <= maxAvailableGW;

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
    }, 100);
  }

  /**
   * Render การ์ดผลงานประจำสัปดาห์
   */
  renderChampionCard(gwNumber, gwResult, defaultTagline = null, isFinished = false) {
    const container = document.getElementById('champion-card-container');
    if (!container) return;

    if (!gwResult || !gwResult.winners || gwResult.winners.length === 0) {
      container.innerHTML = `
        <div class="glass-card p-6 rounded-2xl text-center text-slate-500">
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
        <div class="relative overflow-hidden glass-card rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-slate-200">
          <div class="relative z-10">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 sm:mb-4">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-display flex-shrink-0 shadow-sm">
                  WIN
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500 font-bold font-display block leading-none">GAMEWEEK ${gwNumber} CHAMPION</span>
                  <h3 class="text-base sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 leading-tight truncate">แชมป์ประจำสัปดาห์</h3>
                </div>
              </div>

              <div class="self-start sm:self-auto flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 sm:px-3.5 py-1 rounded-xl">
                <span class="text-slate-800 font-bold text-[11px] sm:text-xs font-display">${isJoint ? 'แชมป์ร่วมประจำสัปดาห์' : 'สรุปผลประจำสัปดาห์'}</span>
              </div>
            </div>

            <!-- Team Details & Stats Box -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-center bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-3 sm:mb-4">
              <div class="md:col-span-2">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 class="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight break-words">
                    ${leader.entry_name || leader.team_name} ${isJoint ? '& ' + gwResult.winners[1].entry_name : ''}
                  </h4>
                  ${chipBadge}
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-slate-600">
                  <span>ผู้จัดการ: <strong class="text-slate-900 font-semibold">${leader.player_name} ${isJoint ? '& ' + gwResult.winners[1].player_name : ''}</strong></span>
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

            <!-- Champion Highlight Note -->
            <div class="bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-bold font-display">CHAMPION HIGHLIGHT NOTE</span>
                <div class="flex items-center gap-1 flex-shrink-0">
                  <button 
                    onclick="app.regenerateTagline(${gwNumber})"
                    class="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-all"
                    title="สุ่มคิดโน้ตสดใหม่"
                  >
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                  <button 
                    id="tagline-edit-btn"
                    onclick="app.openTaglineModal(${gwNumber}, '${taglineObj.text.replace(/'/g, "\\'")}')"
                    class="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-all"
                    title="แก้ไขโน้ตด้วยตนเอง"
                  >
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </div>
              </div>
              <p id="current-gw-note-text" class="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                "${taglineObj.text}"
              </p>
            </div>
          </div>
        </div>
      `;
    } else {
      // Live: Ongoing Gameweek
      container.innerHTML = `
        <div class="relative overflow-hidden glass-card rounded-2xl sm:rounded-3xl p-3.5 sm:p-7 border border-slate-200">
          <div class="relative z-10">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3 sm:mb-4">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xs font-display flex-shrink-0 shadow-sm">
                  LIVE
                </div>
                <div class="min-w-0">
                  <span class="text-[10px] sm:text-[11px] uppercase tracking-widest text-slate-500 font-bold font-display block leading-none">GAMEWEEK ${gwNumber} (IN PROGRESS)</span>
                  <h3 class="text-base sm:text-2xl font-bold text-slate-900 tracking-tight mt-0.5 leading-tight truncate">ผู้นำคะแนนประจำสัปดาห์ชั่วคราว</h3>
                </div>
              </div>

              <div class="self-start sm:self-auto flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 sm:px-3.5 py-1 rounded-xl">
                <span class="w-2 h-2 rounded-full bg-emerald-600 animate-ping"></span>
                <span class="text-slate-800 font-bold text-[11px] sm:text-xs font-display">กำลังแข่งขัน (ยังไม่จบสัปดาห์)</span>
              </div>
            </div>

            <!-- Team Details & Stats Box -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 items-center bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-5 mb-3 sm:mb-4">
              <div class="md:col-span-2">
                <div class="flex items-center gap-2 mb-1 flex-wrap">
                  <h4 class="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight break-words">
                    ${leader.entry_name || leader.team_name} ${isJoint ? '& ' + gwResult.winners[1].entry_name : ''}
                  </h4>
                  ${chipBadge}
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-xs sm:text-sm text-slate-600">
                  <span>ผู้นำคะแนน: <strong class="text-slate-900 font-semibold">${leader.player_name} ${isJoint ? '& ' + gwResult.winners[1].player_name : ''}</strong></span>
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

            <!-- Matchday Live Note -->
            <div class="bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4">
              <div class="flex items-center justify-between gap-2 mb-1">
                <span class="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-bold font-display">MATCHDAY LIVE NOTE</span>
                <div class="flex items-center gap-1 flex-shrink-0">
                  <button 
                    onclick="app.regenerateTagline(${gwNumber})"
                    class="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-all"
                    title="สุ่มคิดโน้ตสดใหม่"
                  >
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </button>
                  <button 
                    id="tagline-edit-btn"
                    onclick="app.openTaglineModal(${gwNumber}, '${taglineObj.text.replace(/'/g, "\\'")}')"
                    class="p-1.5 sm:p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-all"
                    title="แก้ไขโน้ตด้วยตนเอง"
                  >
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                </div>
              </div>
              <p id="current-gw-note-text" class="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed">
                "${taglineObj.text}"
              </p>
            </div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Render ตารางคะแนนประจำสัปดาห์ (Matchday Score Table)
   */
  renderMatchdayTable(gwResults) {
    const tableBody = document.getElementById('matchday-table-body');
    if (!tableBody) return;

    if (!gwResults || gwResults.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-6 text-slate-400">รอผลการแข่งขัน</td></tr>`;
      return;
    }

    let html = '';
    gwResults.forEach((team, idx) => {
      const rankBadge = idx === 0 
        ? '<span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 text-white font-bold text-[10px] sm:text-xs flex items-center justify-center font-display shadow-xs">1</span>'
        : idx === 1
          ? '<span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-200 text-slate-800 font-bold text-[10px] sm:text-xs flex items-center justify-center font-display">2</span>'
          : idx === 2
            ? '<span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-[10px] sm:text-xs flex items-center justify-center font-display">3</span>'
            : `<span class="text-slate-400 text-xs font-medium font-display">${idx + 1}</span>`;

      const chip = team.chip ? `<span class="chip-badge badge-${team.chip.toLowerCase()} font-display">${team.chip}</span>` : '';
      const hits = team.hits > 0 ? `<span class="text-rose-600 font-bold font-display text-xs sm:text-sm">-${team.hits}</span>` : '<span class="text-slate-300 font-display text-xs sm:text-sm">-</span>';

      html += `
        <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
          <td class="py-2.5 px-1.5 sm:px-3.5 text-center">${rankBadge}</td>
          <td class="py-2.5 px-2 sm:px-3.5">
            <button onclick="app.openTeamModal(${team.entry_id}, '${team.entry_name || team.team_name}')" class="text-left font-bold text-xs sm:text-sm text-slate-900 hover:text-slate-600 transition-colors flex items-center gap-1.5 flex-wrap">
              <span class="break-words">${team.entry_name || team.team_name}</span>
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

    tableBody.innerHTML = html;
  }

  /**
   * Render ตารางคะแนนรวมสะสม (Overall Standings)
   */
  renderOverallStandings(standings) {
    const tableBody = document.getElementById('overall-standings-body');
    if (!tableBody) return;

    let html = '';
    standings.forEach((team) => {
      const rank = team.rank;
      const isTop3 = rank <= 3;
      const rankBadge = rank === 1 
        ? '<span class="text-[8px] sm:text-[10px] bg-slate-900 text-white px-1 sm:px-2 py-0.5 rounded font-bold font-display flex-shrink-0">TOP 1</span>'
        : rank === 2
          ? '<span class="text-[8px] sm:text-[10px] bg-slate-200 text-slate-800 px-1 sm:px-2 py-0.5 rounded font-bold font-display flex-shrink-0">TOP 2</span>'
          : rank === 3
            ? '<span class="text-[8px] sm:text-[10px] bg-slate-100 text-slate-700 border border-slate-200 px-1 sm:px-2 py-0.5 rounded font-bold font-display flex-shrink-0">TOP 3</span>'
            : '';

      html += `
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

    tableBody.innerHTML = html;
  }

  /**
   * Render หน้าแท็บเงินรางวัล & รอบเคลียร์
   */
  renderPrizesView(prizesData) {
    const tableBody = document.getElementById('prize-leaderboard-body');
    const phaseContainer = document.getElementById('settlement-phases-container');

    if (tableBody) {
      let html = '';
      prizesData.teamPrizes.forEach((t, idx) => {
        const actualTotal = t.totalEarned;
        html += `
          <tr class="hover:bg-slate-50/80 transition-colors border-b border-slate-100">
            <td class="py-2.5 px-1.5 sm:px-3.5 font-display font-bold text-center text-xs sm:text-sm text-slate-800">${idx + 1}</td>
            <td class="py-2.5 px-2 sm:px-3.5">
              <span class="font-bold text-xs sm:text-sm text-slate-900 block truncate max-w-[130px] sm:max-w-none">${t.entry_name}</span>
              <span class="text-[11px] text-slate-500 truncate block max-w-[110px] sm:max-w-none">${t.player_name}</span>
            </td>
            <td class="py-2.5 px-1 sm:px-3.5 text-center font-display font-bold text-slate-800 text-xs sm:text-sm">
              ${t.weeklyWins > 0 ? t.weeklyWins + ' ครั้ง' : '0'}
              ${t.wonGWs && t.wonGWs.length > 0 ? `<span class="block text-[8px] sm:text-[10px] text-slate-400 font-normal font-display">(GW ${t.wonGWs.join(', ')})</span>` : ''}
            </td>
            <td class="py-2.5 px-2 sm:px-3.5 text-center font-display text-slate-700 text-xs sm:text-sm hidden sm:table-cell">${t.weeklyPrizeTotal > 0 ? t.weeklyPrizeTotal.toLocaleString() + ' บาท' : '-'}</td>
            <td class="py-2.5 px-2 sm:px-3.5 text-center font-display text-slate-400 text-[11px] sm:text-xs hidden md:table-cell">-</td>
            <td class="py-2.5 px-2 sm:px-3.5 text-center font-display text-slate-400 text-[11px] sm:text-xs hidden md:table-cell">-</td>
            <td class="py-2.5 px-1.5 sm:px-3.5 text-center font-display font-bold text-xs sm:text-base text-slate-900">
              ${actualTotal > 0 ? actualTotal.toLocaleString() + ' บ.' : '-'}
            </td>
          </tr>
        `;
      });
      tableBody.innerHTML = html;
    }

    if (phaseContainer) {
      let phaseHtml = '';
      prizesData.phases.forEach(p => {
        const isCompleted = p.isCompleted === true;
        const isCurrent = p.isCurrent === true;

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
              onclick="app.shareManager.sharePhaseSummary(${p.phase}, '${p.name}', ${p.startGW}, ${p.endGW}, ${p.budget}, ${JSON.stringify(p.winners || [])})"
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
              <p class="text-[11px] sm:text-xs text-slate-500 mb-2.5 sm:mb-3">งบแชมป์วีค: <strong class="text-slate-800">${p.budget.toLocaleString()} บาท</strong> ${p.hasCup ? '+ ถ้วย & ลีก' : ''}</p>
              
              <div class="bg-slate-50 rounded-xl p-2.5 sm:p-3.5 mb-2.5 sm:mb-3.5 border border-slate-200/80">
                <span class="text-[9px] sm:text-[11px] uppercase tracking-wider text-slate-500 font-bold block mb-1">สรุปแชมป์วีคที่สรุปผลแล้ว:</span>
                ${p.phase === 1 ? `
                  <div class="space-y-1 text-xs">
                    <div class="flex justify-between items-center"><span class="text-slate-800 truncate max-w-[130px] sm:max-w-none">1. GEMINI UNITED (GW 1)</span><strong class="text-slate-900 flex-shrink-0">350 บ.</strong></div>
                    <div class="flex justify-between items-center text-slate-500"><span>- GW 2 (กำลังเตะ)</span><span class="text-rose-600 font-medium">รอจบวีค</span></div>
                    <div class="flex justify-between items-center text-slate-400"><span>- GW 3 - 6</span><span>รอแข่ง</span></div>
                  </div>
                ` : '<p class="text-xs text-slate-400 py-1 text-center">รอผลการแข่งขันในรอบนี้</p>'}
              </div>
            </div>

            <div class="pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <span class="text-xs text-slate-500">จ่ายแล้ว: <strong class="text-slate-900 font-display font-bold">${p.phase === 1 ? '350' : '0'} บ.</strong></span>
              ${buttonHtml}
            </div>
          </div>
        `;
      });
      phaseContainer.innerHTML = phaseHtml;
    }
  }

  /**
   * Render หน้าแท็บ Hall of Fame (Analytics & Records)
   */
  renderHallOfFame(hallOfFameData) {
    const records = hallOfFameData.records;
    const teamStats = hallOfFameData.teamStats;

    // 1. Records Overview Cards (2x2 on mobile, 4 in row on desktop)
    const recContainer = document.getElementById('hall-of-fame-records');
    if (recContainer) {
      recContainer.innerHTML = `
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
              <span class="text-[8px] sm:text-xs text-slate-500 font-medium font-display">AVG 51.5</span>
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

    // 2. Comprehensive Statistics Table
    const tableBody = document.getElementById('hall-of-fame-table-body');
    if (tableBody) {
      let html = '';
      teamStats.forEach((t, idx) => {
        html += `
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
      tableBody.innerHTML = html;
    }
  }

  /**
   * Render ฟุตบอลถ้วย (Cup Tournament Bracket)
   */
  renderCupTournament(cupData) {
    const container = document.getElementById('cup-tournament-container');
    if (!container) return;

    const isFinished = cupData && cupData.is_finished === true;

    if (!isFinished || !cupData.rounds || cupData.rounds.length === 0) {
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
  }
}
