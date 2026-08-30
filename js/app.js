/**
 * Main Application Controller for FPL Mini-League 40700 Dashboard
 */

class App {
  constructor() {
    this.config = window.LEAGUE_CONFIG;
    this.api = new FPLApiClient(this.config);
    this.calculator = new LeagueCalculator(this.config);
    this.taglines = new TaglineManager();
    this.share = new ShareManager(this.config);
    this.ui = new UIRenderer();

    // State
    this.currentGW = this.config.currentActiveGW || 2;
    this.selectedGW = this.config.currentActiveGW || 2;
    this.maxAvailableGW = this.config.currentActiveGW || 2;
    this.leagueData = window.MOCK_LEAGUE_DATA;
    this.standings = [];
    this.gameweeksData = {};
  }

  async init() {
    this.bindEvents();
    await this.loadData();
    this.renderAll();
  }

  bindEvents() {
    // Tab Switching
    document.querySelectorAll('[data-tab-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetTab = btn.getAttribute('data-tab-target');
        this.switchTab(targetTab, btn);
      });
    });

    // Refresh Live Data Button
    const refreshBtn = document.getElementById('refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.refreshData());
    }

    // Share Gameweek Button
    const shareGWBtn = document.getElementById('share-gw-btn');
    if (shareGWBtn) {
      shareGWBtn.addEventListener('click', () => this.shareCurrentGameweek());
    }
  }

  switchTab(targetId, activeBtn) {
    // Update button styles
    document.querySelectorAll('[data-tab-target]').forEach(btn => {
      btn.classList.remove('bg-[#00ff87]/15', 'text-[#00ff87]', 'border-[#00ff87]/40');
      btn.classList.add('text-slate-400', 'border-transparent');
    });

    activeBtn.classList.add('bg-[#00ff87]/15', 'text-[#00ff87]', 'border-[#00ff87]/40');
    activeBtn.classList.remove('text-slate-400', 'border-transparent');

    // Toggle content
    document.querySelectorAll('.tab-content').forEach(content => {
      if (content.id === targetId) {
        content.classList.remove('hidden');
      } else {
        content.classList.add('hidden');
      }
    });
  }

  async loadData() {
    this.showLoading(true);

    try {
      // 1. Fetch live standings from FPL API
      const liveStandings = await this.api.fetchLeagueStandings();
      if (liveStandings && liveStandings.standings && liveStandings.standings.results) {
        this.standings = liveStandings.standings.results.map(r => ({
          entry_id: r.entry,
          entry_name: r.entry_name,
          player_name: r.player_name,
          rank: r.rank,
          total: r.total,
          gw_points: r.event_total
        }));
      } else {
        this.standings = this.leagueData.teams;
      }

      this.gameweeksData = this.leagueData.gameweeks;
      this.currentGW = this.leagueData.current_gameweek;
      this.maxAvailableGW = this.currentGW;
      this.selectedGW = this.currentGW;

      this.updateStatusText(`ข้อมูลตรงตาม FPL League 40700 (GW ${this.currentGW} Live)`);
    } catch (err) {
      console.warn('Using fallback data:', err);
      this.standings = this.leagueData.teams;
      this.gameweeksData = this.leagueData.gameweeks;
      this.updateStatusText('แสดงข้อมูล Standby (League 40700)');
    } finally {
      this.showLoading(false);
    }
  }

  async refreshData() {
    const statusText = document.getElementById('api-status-text');
    if (statusText) statusText.innerText = 'กำลังอัปเดตข้อมูลสด...';
    await this.loadData();
    this.renderAll();
    this.share.showToast('อัปเดตข้อมูลล่าสุดเรียบร้อยแล้ว');
  }

  renderAll() {
    // Tab 1: Gameweek View
    this.ui.renderGameweekSelector(this.selectedGW, this.config.totalGameweeks, this.maxAvailableGW);
    this.renderSelectedGameweek();
    this.ui.renderOverallStandings(this.standings);

    // Tab 2: Prizes & Settlements
    const prizeLeaderboard = this.calculator.calculateTotalPrizeLeaderboard(this.standings, this.gameweeksData);
    this.ui.renderPrizeLeaderboard(prizeLeaderboard);

    const settlementPhases = this.calculator.calculateSettlementPhases(this.gameweeksData);
    this.ui.renderSettlementPhases(settlementPhases);

    // Tab 3: Hall of Fame & Stats
    const hofData = this.calculator.calculateHallOfFame(this.standings, this.gameweeksData);
    this.ui.renderHallOfFame(hofData);

    // Tab 4: Cup Tournament
    this.ui.renderCupTournament(this.leagueData.cup);
  }

  selectGameweek(gwNumber) {
    if (gwNumber > this.maxAvailableGW) return; // Strict lock
    this.selectedGW = gwNumber;
    this.ui.renderGameweekSelector(this.selectedGW, this.config.totalGameweeks, this.maxAvailableGW);
    this.renderSelectedGameweek();
  }

  renderSelectedGameweek() {
    const gwData = this.gameweeksData[this.selectedGW];
    if (gwData && gwData.results) {
      const isFinished = gwData.is_finished === true;
      const gwResult = this.calculator.calculateGameweekResult(this.selectedGW, gwData.results, isFinished);
      
      // Inject team and player names
      gwResult.winners.forEach(w => {
        const team = this.standings.find(t => t.entry_id === w.entry_id);
        if (team) {
          w.entry_name = team.entry_name;
          w.player_name = team.player_name;
        }
      });

      gwResult.standings.forEach(s => {
        const team = this.standings.find(t => t.entry_id === s.entry_id);
        if (team) {
          s.entry_name = team.entry_name;
          s.player_name = team.player_name;
        }
      });

      this.ui.renderChampionCard(this.selectedGW, gwResult, gwData.tagline, isFinished);
      this.ui.renderMatchdayTable(gwResult);
    } else {
      this.ui.renderChampionCard(this.selectedGW, null, null, false);
      this.ui.renderMatchdayTable(null);
    }
  }

  // Deep-dive Team Squad Modal
  async openTeamModal(entryId, teamName) {
    const title = document.getElementById('team-modal-title');
    const pitch = document.getElementById('team-pitch-container');
    const bench = document.getElementById('team-bench-container');
    const modal = document.getElementById('team-modal');

    if (title) title.innerText = teamName;

    // Look up exact real squad by entryId and selected GW
    const squadKey = `${entryId}_${this.selectedGW}`;
    const squad = (this.leagueData.squads && this.leagueData.squads[squadKey]) || this.leagueData.sample_squad;

    if (pitch && squad && squad.starting) {
      const gks = squad.starting.filter(p => p.pos === 'GKP');
      const defs = squad.starting.filter(p => p.pos === 'DEF');
      const mids = squad.starting.filter(p => p.pos === 'MID');
      const fwds = squad.starting.filter(p => p.pos === 'FWD');

      const renderPlayerCard = (p) => `
        <div class="flex flex-col items-center justify-center p-0.5 text-center flex-1 max-w-[68px] sm:max-w-[85px]">
          <div class="relative">
            <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-slate-900/90 border-2 ${p.is_captain ? 'border-[#ffbe1a] ring-2 ring-[#ffbe1a]/30' : p.is_vice ? 'border-slate-300' : 'border-emerald-400/50'} flex items-center justify-center shadow-lg">
              <span class="text-[10px] sm:text-xs font-bold text-slate-200">${p.pos}</span>
            </div>
            ${p.is_captain ? '<span class="absolute -top-1 -right-1 bg-[#ffbe1a] text-slate-950 font-black text-[8px] sm:text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-display shadow">C</span>' : ''}
            ${p.is_vice ? '<span class="absolute -top-1 -right-1 bg-slate-300 text-slate-950 font-black text-[8px] sm:text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-display shadow">V</span>' : ''}
          </div>
          <span class="font-bold text-[10px] sm:text-xs text-white bg-black/80 px-1.5 py-0.5 rounded mt-1 truncate max-w-full block">${p.name}</span>
          <span class="text-[9px] sm:text-[10px] font-black text-[#00ff87] font-display mt-0.5">${p.points} pts</span>
        </div>
      `;

      pitch.innerHTML = `
        <div class="fpl-pitch-line">${gks.map(renderPlayerCard).join('')}</div>
        <div class="fpl-pitch-line">${defs.map(renderPlayerCard).join('')}</div>
        <div class="fpl-pitch-line">${mids.map(renderPlayerCard).join('')}</div>
        <div class="fpl-pitch-line">${fwds.map(renderPlayerCard).join('')}</div>
      `;
    }

    if (bench && squad && squad.bench) {
      bench.innerHTML = squad.bench.map(p => `
        <div class="bg-slate-900/90 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-bold text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded font-display">${p.pos}</span>
            <span class="text-xs font-bold text-slate-200">${p.name}</span>
          </div>
          <span class="text-xs font-black text-slate-400 font-display">${p.points} pts</span>
        </div>
      `).join('');
    }

    if (modal) modal.classList.remove('hidden');
  }

  closeTeamModal() {
    const modal = document.getElementById('team-modal');
    if (modal) modal.classList.add('hidden');
  }

  // Tagline Modal
  openTaglineModal(gwNumber, currentText) {
    const title = document.getElementById('tagline-modal-title');
    const input = document.getElementById('tagline-input');
    const modal = document.getElementById('tagline-modal');

    if (title) title.innerText = `แก้ไขจุดเด่น Gameweek ${gwNumber}`;
    if (input) input.value = currentText || '';
    if (modal) modal.classList.remove('hidden');

    const saveBtn = document.getElementById('tagline-save-btn');
    if (saveBtn) {
      saveBtn.onclick = () => {
        const text = input.value;
        this.taglines.saveTagline(gwNumber, text);
        this.closeTaglineModal();
        this.renderSelectedGameweek();
        this.share.showToast('บันทึกข้อความไฮไลท์เรียบร้อยแล้ว');
      };
    }
  }

  regenerateTagline(gwNumber) {
    const gwData = this.gameweeksData[gwNumber];
    if (gwData && gwData.results) {
      const isFinished = gwData.is_finished === true;
      const gwResult = this.calculator.calculateGameweekResult(gwNumber, gwData.results, isFinished);
      const newTagline = this.taglines.regenerateFreshTagline(gwNumber, gwResult);

      // Write new note directly into the card without pop-up
      const noteEl = document.getElementById('current-gw-note-text');
      if (noteEl) {
        noteEl.style.transition = 'opacity 0.15s ease-out';
        noteEl.style.opacity = '0.2';
        setTimeout(() => {
          noteEl.innerText = `"${newTagline.text}"`;
          noteEl.style.opacity = '1';
        }, 150);

        const editBtn = document.getElementById('tagline-edit-btn');
        if (editBtn) {
          editBtn.setAttribute('onclick', `app.openTaglineModal(${gwNumber}, '${newTagline.text.replace(/'/g, "\\'")}')`);
        }
      } else {
        this.renderSelectedGameweek();
      }
    }
  }

  closeTaglineModal() {
    const modal = document.getElementById('tagline-modal');
    if (modal) modal.classList.add('hidden');
  }

  // Share Actions
  shareCurrentGameweek() {
    const gwData = this.gameweeksData[this.selectedGW];
    if (gwData && gwData.results) {
      const isFinished = gwData.is_finished === true;
      const gwResult = this.calculator.calculateGameweekResult(this.selectedGW, gwData.results, isFinished);
      const tagline = this.taglines.getTagline(this.selectedGW, gwResult, gwData.tagline);
      const text = this.share.generateGameweekShareText(this.selectedGW, gwResult, tagline, this.standings);
      this.share.copyToClipboard(text, `คัดลอกสรุปผล GW ${this.selectedGW} สำหรับส่ง LINE แล้ว`);
    }
  }

  sharePhaseSummary(phaseNumber) {
    const settlementPhases = this.calculator.calculateSettlementPhases(this.gameweeksData);
    const phase = settlementPhases.find(p => p.phase === phaseNumber);
    if (phase) {
      const text = this.share.generatePhaseShareText(phase);
      this.share.copyToClipboard(text, `คัดลอกสรุปยอดเงิน ${phase.name} เรียบร้อยแล้ว`);
    }
  }

  showLoading(isLoading) {
    const spinner = document.getElementById('loading-spinner');
    if (spinner) {
      if (isLoading) spinner.classList.remove('hidden');
      else spinner.classList.add('hidden');
    }
  }

  updateStatusText(text) {
    const status = document.getElementById('api-status-text');
    if (status) {
      status.innerHTML = `<span class="inline-block w-2 h-2 rounded-full bg-[#00f0ff] mr-2"></span>${text}`;
    }
  }
}

// Global App Instance
const app = new App();
document.addEventListener('DOMContentLoaded', () => app.init());
