/**
 * Dynamic Gameweek Live Commentary Engine (Borbou Style - No Emojis)
 * ระบบคิดสดและเขียนใหม่ทุกครั้งตามสถานะการแข่งขันจริง
 */

class TaglineManager {
  constructor(storageKey = 'fpl_league_40700_taglines') {
    this.storageKey = storageKey;
    this.customTaglines = this.loadCustomTaglines();
    this.sessionCache = {};
  }

  loadCustomTaglines() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      console.warn('Error loading custom taglines:', e);
      return {};
    }
  }

  saveTagline(gameweek, text) {
    try {
      this.customTaglines[gameweek] = text.trim();
      this.sessionCache[gameweek] = text.trim();
      localStorage.setItem(this.storageKey, JSON.stringify(this.customTaglines));
      return true;
    } catch (e) {
      console.warn('Error saving tagline:', e);
      return false;
    }
  }

  regenerateFreshTagline(gameweek, gwResult) {
    const fresh = this.generateDynamicCommentary(gameweek, gwResult);
    this.sessionCache[gameweek] = fresh;
    return fresh;
  }

  getTagline(gameweek, gwResult) {
    if (this.customTaglines[gameweek]) {
      return {
        text: this.customTaglines[gameweek],
        isCustom: true
      };
    }

    if (this.sessionCache[gameweek]) {
      return {
        text: this.sessionCache[gameweek],
        isCustom: false
      };
    }

    const fresh = this.generateDynamicCommentary(gameweek, gwResult);
    this.sessionCache[gameweek] = fresh;
    return {
      text: fresh,
      isCustom: false
    };
  }

  /**
   * คิดสดและเขียนใหม่ทุกครั้ง: วิเคราะห์ Leader, ชิป/การ์ด, แต้มลบ Hits, ตัวนอกสายตา, ตัวสำรอง และความห่างของคะแนน
   */
  generateDynamicCommentary(gameweek, gwResult) {
    if (!gwResult || !gwResult.results || gwResult.results.length === 0) {
      return `Gameweek ${gameweek}: บอลยังไม่เตะ อย่าเพิ่งรีบโม้ รอดูของจริงในสนาม!`;
    }

    const results = [...gwResult.results].sort((a, b) => b.net_points - a.net_points);
    const leader = results[0];
    const runnerUp = results[1];
    const margin = runnerUp ? (leader.net_points - runnerUp.net_points) : 0;
    const isFinished = gwResult.is_finished === true;

    // Context detection
    const hitTakers = results.filter(t => t.hits > 0);
    const chipUsers = results.filter(t => t.chip);
    const benchKing = [...results].sort((a, b) => b.bench_points - a.bench_points)[0];
    const uniqueCaptains = results.filter(t => t.captain && !['Haaland', 'Salah'].includes(t.captain));

    // 1. Leader Sentence (ประโยคเปิดตัวนำ)
    let leadPhrases = [];
    if (isFinished) {
      if (leader.chip === 'BBOOST' || leader.chip === 'BENCH_BOOST' || leader.chip === 'Bench Boost') {
        leadPhrases = [
          `${leader.entry_name || leader.team_name} เปิดหัวก็บ้าพลัง งัดการ์ด Bench Boost ขนมาทั้งตำบล กวาด ${leader.net_points} แต้ม ยึดหัวหาดแบบหล่อๆ`,
          `${leader.entry_name || leader.team_name} ปล่อยของแต่หัววัน เปิดชิป Bench Boost ตัวจริงก็มา สำรองก็ยิง ล่อไป ${leader.net_points} แต้ม ขึ้นนำแบบไร้ข้อกังขา`,
          `ของแทร่ไม่ต้องพูดเยอะ ${leader.entry_name || leader.team_name} สวมวิญญาณป๋า งัด Bench Boost โกย ${leader.net_points} แต้ม ฟันแชมป์วีคสบายแฮ`
        ];
      } else if (leader.chip === '3XC' || leader.chip === 'TRIPLE_CAPTAIN' || leader.chip === 'Triple Captain') {
        leadPhrases = [
          `${leader.entry_name || leader.team_name} ใส่ 3XC ทริปเปิ้ลกัปตันเต็มข้อ ล่อไป ${leader.net_points} แต้ม คว้าแชมป์วีคแบบไม่ต้องสืบ`,
          `${leader.entry_name || leader.team_name} เลือกกัปตันถูกคู่ กดการ์ด 3XC ระเบิดฟอร์ม กวาด ${leader.net_points} แต้ม ยึดจ่าฝูงคนเดียวแบบเหงาๆ`
        ];
      } else if (margin === 1) {
        leadPhrases = [
          `${leader.entry_name || leader.team_name} ปาดหน้าเข้าวินวินาทีสุดท้าย เฉือนชนะ ${runnerUp.entry_name || runnerUp.team_name} แค่ 1 แต้ม ชนะแต้มเดียวก็คือชนะ ร้องไห้ทำไม`,
          `หัวใจจะวาย ${leader.entry_name || leader.team_name} เบียดชนะ ${runnerUp.entry_name || runnerUp.team_name} ปลายจมูก 1 แต้ม เข้าป้ายแชมป์ GW ${gameweek} แบบสะใจโก๋`
        ];
      } else if (leader.net_points >= 75) {
        leadPhrases = [
          `${leader.entry_name || leader.team_name} ฟอร์มอย่างโหด โกรธใครมา กดไป ${leader.net_points} แต้ม ทิ้งห่างชาวบ้านแบบไม่ไว้หน้าใคร`,
          `${leader.entry_name || leader.team_name} ร่างทองระเบิดฟอร์ม โกยยับ ${leader.net_points} แต้ม ยึดแชมป์สัปดาห์แบบไร้เทียมทาน`
        ];
      } else {
        leadPhrases = [
          `${leader.entry_name || leader.team_name} วางหมากเฉียบคม อาศัยกัปตัน ${leader.captain || 'ตัวเก่ง'} โกย ${leader.net_points} แต้ม ยึดบัลลังก์แชมป์ Gameweek ${gameweek}`,
          `${leader.entry_name || leader.team_name} คว้า ${leader.net_points} แต้มเข้าป้ายแบบนิ่มๆ ใครตามไม่ทัน...ก็ต้องยอมอยู่รูต่อไป`
        ];
      }
    } else {
      // LIVE in progress
      leadPhrases = [
        `${leader.entry_name || leader.team_name} นำเดี่ยว ${leader.net_points} แต้ม อาศัยบารมีกัปตัน ${leader.captain || 'ตัวเก๋า'} ยึดจ่าฝูงชั่วคราว`,
        `${leader.entry_name || leader.team_name} กดไป ${leader.net_points} แต้ม ขึ้นมาสูดอากาศข้างบนชั่วคราว`,
        `${leader.entry_name || leader.team_name} เครื่องติดไว ซัดไป ${leader.net_points} แต้ม นั่งเก้าอี้ผู้นำสดไปก่อน`
      ];
    }
    const leadSentence = leadPhrases[Math.floor(Math.random() * leadPhrases.length)];

    // 2. Tactical Middle (การ์ด / Hits / ตัวนอกสายตา / สำรองคาเบาะ)
    let midPhrases = [];
    if (hitTakers.length > 0) {
      const hitNames = hitTakers.slice(0, 2).map(t => `${t.entry_name || t.team_name} (-${t.hits})`).join(' กับ ');
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
        `ส่วน ${diff.entry_name || diff.team_name} โคตรอินดี้ตั้ง ${diff.captain} กัปตันนอกสายตาจนแต้มลั่น`,
        `ขณะที่ ${diff.entry_name || diff.team_name} สวนกระแสจิ้ม ${diff.captain} เป็นกัปตันตัวตึง`
      ];
      midPhrases.push(diffTexts[Math.floor(Math.random() * diffTexts.length)]);
    }
    if (benchKing && benchKing.bench_points >= 10 && (!isFinished || leader.chip !== 'BBOOST')) {
      const benchTexts = [
        `ขณะที่ ${benchKing.entry_name || benchKing.team_name} นั่งกุมขมับปล่อยตัวสำรองกดไป ${benchKing.bench_points} แต้มคาเบาะ`,
        `ด้าน ${benchKing.entry_name || benchKing.team_name} น้ำตาตกใน ตัวสำรองลั่นทุ่ง ${benchKing.bench_points} แต้มแต่นั่งมองตาปริบๆ`
      ];
      midPhrases.push(benchTexts[Math.floor(Math.random() * benchTexts.length)]);
    }

    // 3. Ending Punchline (ลูกเตือนกวนๆ สไตล์ บอ.บู๋)
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

    let combined = leadSentence;
    if (midPhrases.length > 0) {
      combined += ' ' + midPhrases.join(' ') + ' ' + endSentence;
    } else {
      combined += ' ' + endSentence;
    }

    return combined;
  }
}

window.TaglineManager = TaglineManager;
