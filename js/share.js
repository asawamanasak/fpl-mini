/**
 * Social & LINE Group Sharing Formatter (No Emojis)
 */

class ShareManager {
  constructor(config = window.LEAGUE_CONFIG) {
    this.config = config;
  }

  /**
   * สร้างข้อความสรุปผลประจำ Gameweek สำหรับส่งในกลุ่ม LINE (สไตล์ บอ.บู๋ สั้น กระชับ กวนๆ ฮาๆ พร้อมประเด็นชิป/Hits/ตัวนอกสายตา)
   */
  generateGameweekShareText(gwNumber, gwResult, tagline, standings = []) {
    if (!gwResult || !gwResult.standings) return '';

    const isFinished = gwResult.is_finished === true;
    const sorted = gwResult.standings;
    const leader = sorted[0];

    // Gather notable hit takers, chips, bench heroes
    const hitTakers = sorted.filter(t => t.hits > 0).map(t => `${t.entry_name || t.team_name} (-${t.hits})`).join(', ');
    const chipsUsed = sorted.filter(t => t.chip).map(t => `${t.entry_name || t.team_name} (${t.chip})`).join(', ');
    const topBench = [...sorted].sort((a, b) => b.bench_points - a.bench_points)[0];

    let text = `=== FPL ${this.config.leagueName} ===\n`;

    if (isFinished) {
      text += `สรุปผล GAMEWEEK ${gwNumber}\n`;
      text += `----------------------------------------\n`;
      text += `แชมป์ประจำสัปดาห์: ${leader.entry_name || leader.team_name} (${leader.player_name})\n`;
      text += `แต้มสุทธิ: ${leader.net_points} pts | กัปตัน: ${leader.captain || '-'}${leader.chip ? ' | การ์ด: ' + leader.chip : ''}\n\n`;
      
      const taglineText = tagline && tagline.text ? tagline.text : '';
      if (taglineText) {
        text += `สรุปสั้นๆ สไตล์เซียนอยู่รู:\n"${taglineText}"\n\n`;
      }

      text += `ไฮไลท์แท็กติกสัปดาห์นี้:\n`;
      text += chipsUsed ? `- สายปล่อยการ์ด: ${chipsUsed}\n` : `- การ์ดชิป: เก็บกริบ ไม่มีใครยอมปล่อย\n`;
      text += hitTakers ? `- สายยอมเจ็บ: ${hitTakers}\n` : `- แต้มลบ Hits: ไม่มีใครยอมโดนหัก\n`;
      if (topBench && topBench.bench_points >= 10) {
        text += `- สำรองล้นเบาะ: ${topBench.entry_name || topBench.team_name} (${topBench.bench_points} pts คาเบาะ)\n`;
      }

      text += `----------------------------------------\n`;
      text += `ตารางคะแนนสัปดาห์นี้:\n`;
      sorted.forEach((t, idx) => {
        const hitStr = t.hits > 0 ? ` (-${t.hits})` : '';
        text += `${idx + 1}. ${t.entry_name || t.team_name}: ${t.net_points} pts${hitStr}\n`;
      });

      if (standings && standings.length > 0) {
        text += `----------------------------------------\n`;
        text += `จ่าฝูงรวม: ${standings[0].entry_name} (${standings[0].total} pts)\n`;
      }
      text += `ใครอยู่รูรีบปีนขึ้นมา... สัปดาห์หน้าเจอกันใหม่!`;
    } else {
      text += `รายงานสด GAMEWEEK ${gwNumber} (กำลังเตะ)\n`;
      text += `----------------------------------------\n`;
      text += `ผู้นำสดชั่วคราว: ${leader.entry_name || leader.team_name} (${leader.player_name})\n`;
      text += `แต้มสดสุทธิ: ${leader.net_points} pts | กัปตัน: ${leader.captain || '-'}${leader.chip ? ' | การ์ด: ' + leader.chip : ''}\n\n`;

      const taglineText = tagline && tagline.text ? tagline.text : '';
      if (taglineText) {
        text += `โน้ตเกาะติดขอบสนาม:\n"${taglineText}"\n\n`;
      }

      text += `ไฮไลท์สดรอบนี้:\n`;
      if (chipsUsed) text += `- คนงัดการ์ด: ${chipsUsed}\n`;
      if (hitTakers) text += `- คนยอมโดนหักแต้ม: ${hitTakers}\n`;

      text += `----------------------------------------\n`;
      text += `อันดับสดสัปดาห์นี้ (Top 3):\n`;
      sorted.slice(0, 3).forEach((t, idx) => {
        const hitStr = t.hits > 0 ? ` (-${t.hits})` : '';
        text += `${idx + 1}. ${t.entry_name || t.team_name}: ${t.net_points} pts${hitStr}\n`;
      });
      text += `----------------------------------------\n`;
      text += `เตือนแล้วนะ: บอลยังเตะไม่ครบทุกคู่ อย่าเพิ่งรีบโม้ รอดูของจริงตอนจบสัปดาห์!`;
    }

    return text;
  }

  /**
   * สร้างข้อความสรุปเงินรางวัลรอบจ่าย (Settlement Phase) สำหรับส่ง LINE
   */
  generatePhaseShareText(phaseReport) {
    let text = `=== FPL ${this.config.leagueName} ===\n`;
    text += `สรุปยอดโอนเคลียร์เงินรางวัล: ${phaseReport.name} (GW ${phaseReport.startGW} - ${phaseReport.endGW})\n`;
    text += `----------------------------------------\n`;
    text += `ยอดเงินรางวัลรวมรอบนี้: ${phaseReport.totalWeeklyDistributed.toLocaleString()} บาท\n`;
    text += `งบแชมป์ประจำสัปดาห์: ${phaseReport.weeks} สัปดาห์ (สัปดาห์ละ 350 บ.)\n\n`;
    
    if (!phaseReport.teamEarnings || phaseReport.teamEarnings.length === 0) {
      text += `(ยังไม่มีข้อมูลการแข่งขันในรอบนี้)\n`;
    } else {
      text += `สรุปยอดเงินโอนเข้ากระเป๋ารอบนี้:\n`;
      phaseReport.teamEarnings.forEach((t, idx) => {
        text += `${idx + 1}. ${t.teamName} (${t.playerName})\n`;
        text += `   - ได้แชมป์ ${t.winsCount} วีค (GW ${t.wonWeeks.join(', ')})\n`;
        text += `   - ยอดรับเงินโอน: ${t.totalWeeklyPrize.toLocaleString()} บาท\n\n`;
      });
      text += `----------------------------------------\n`;
      text += `(ทีมที่เหลือในรอบนี้: 0 บาท สู้ใหม่รอบหน้าอย่าเพิ่งถอดใจ!)\n`;
    }

    text += `กรุณาตรวจเช็กยอดและโอนเคลียร์เงินรางวัลให้เรียบร้อยครับ!`;
    return text;
  }

  /**
   * คัดลอกข้อความไปยัง Clipboard พร้อมแจ้งเตือน Toast
   */
  async copyToClipboard(text, successMessage = 'คัดลอกข้อความสำหรับแชร์ลง LINE เรียบร้อยแล้ว') {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      this.showToast(successMessage, 'success');
      return true;
    } catch (err) {
      console.error('Failed to copy text: ', err);
      this.showToast('ไม่สามารถคัดลอกได้ กรุณาลองใหม่อีกครั้ง', 'error');
      return false;
    }
  }

  /**
   * แสดง Toast Notification
   */
  showToast(message, type = 'success') {
    const existing = document.getElementById('fpl-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'fpl-toast';
    toast.className = `fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 ${
      type === 'success' 
        ? 'bg-[#00ff87] text-slate-950 font-bold text-sm' 
        : 'bg-rose-600 text-white font-bold text-sm'
    }`;

    toast.innerText = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

window.ShareManager = ShareManager;
