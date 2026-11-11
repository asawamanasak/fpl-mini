# FPLSaWaDiKa: Project Context & Architecture

> **เอกสารสรุปบริบทโปรเจกต์ (Project Blueprint & Single Source of Context)**
> บันทึกสถานะปัจจุบัน โครงสร้างระบบ สถาปัตยกรรม และประวัติการพัฒนาจากทุกแชท เพื่อให้ AI และผู้พัฒนาในทุก Session เข้าใจภาพรวมได้ทันที 100%

---

## 📌 1. ภาพรวมโปรเจกต์ (Project Overview)
โปรเจกต์ **FPLSaWaDiKa** เป็นแพลตฟอร์ม **Fantasy Premier League (FPL) Mini-League Presentation & Analytics Dashboard** ที่ออกแบบมาเพื่อรองรับแฟนตาซีมินิลีกหลายลีกพร้อมกัน นำเสนอข้อมูลแบบ Real-time Live & Historical พร้อมระบบคำนวณเงินรางวัล, Hall of Fame, ผังผู้เล่น 11 ตัวจริง (Authentic Pitch), และระบบบทวิเคราะห์แชมป์ประจำสัปดาห์สไตล์ **"บอ.บู๋" (Borbou Commentary Engine)**

* **Production URL:** `https://www.fplsawadika.com/`
* **Direct League URLs:**
  * ลีก 5349 (Bramann League): `https://www.fplsawadika.com/5349`
  * ลีก 38491 (รอ แมน โอน): `https://www.fplsawadika.com/38491`
  * ลีก 40700 (เซียนอยู่รู หมูอยู่ตึก): `https://www.fplsawadika.com/40700`
  * ลีก 187827 (Shi62): `https://www.fplsawadika.com/187827`
  * ลีก 438691 (2 spade): `https://www.fplsawadika.com/438691`
  * ลีก 567387 (Fantasy Nguan & friends cup): `https://www.fplsawadika.com/567387`
  * ลีก 675290 (NudNee): `https://www.fplsawadika.com/675290`
  * ลีก 1101958 (Barley's Official League): `https://www.fplsawadika.com/1101958`
* **Repository:** `https://github.com/asawamanasak/fpl-mini`

> [!IMPORTANT]
> **ข้อกำหนดการทำงานด้าน Git & Deploy (Strict Deployment Gatekeeper):**
> ห้ามรัน `git commit` หรือ `git push` (รวมถึงคำสั่ง `./rollback.sh save`) โดยพลการโดยเด็ดขาด!
> ทุกการเปลี่ยนแปลงให้ทำและทดสอบบนเครื่อง Local เท่านั้น (`update_preview.py`, `verify_local.py`, Headless Chrome, `preview.html`) 
> เมื่อตรวจสอบเสร็จสิ้น ให้รายงานผลและรอให้ผู้ใช้เป็นผู้สั่งให้นำขึ้นระบบออนไลน์ด้วยตนเองทุกครั้ง.

> [!IMPORTANT]
> **หลักการปรับปรุงโครงสร้าง UX/UI (Cross-League Feature Consistency Principle):**
> ทุกครั้งที่มีการปรับปรุงโครงสร้างการแสดงผล, รูปแบบการจัดวาง (Layout), โทนสี หรือ UX/UI ของหัวข้อ/ฟีเจอร์ใดๆ จะต้องตรวจสอบและอัปเดตให้ครอบคลุม **"ทุกลีกที่มีหัวข้อ/ฟีเจอร์นั้นๆ เกี่ยวข้อง"** เสมอ เพื่อรักษามาตรฐาน ประสบการณ์ผู้ใช้ และความสอดคล้องของแม่แบบ (Template Archetype) ให้เหมือนกันทั่วทั้งระบบ 100% โดยไม่มีตกหล่น.

> [!IMPORTANT]
> **ข้อกำหนดการทดสอบแบบครบวงจรระดับเข้มงวด (Mandatory Comprehensive Interactive Testing Protocol):**
> ทุกครั้งที่มีการพัฒนา เพิ่มเติม หรือแก้ไขฟีเจอร์และ UX/UI ใดๆ ในระบบ **จะต้องดำเนินการทดสอบเชิงลึกแบบครบวงจรผ่าน Headless Chrome / CDP ก่อนส่งมอบงานเสมอ** โดยครอบคลุม:
> 1. **Multi-Viewport:** ทดสอบจริงทั้ง **Desktop (1440x900)**, **Tablet/iPad (768x1024)** และ **Mobile (375x812 - iPhone Standard)**
> 2. **All Interactive Elements & Buttons:** ทดสอบการคลิกจริงของ "ทุกปุ่มและทุกฟังก์ชัน" ที่เกี่ยวข้อง เช่น Tab Navigation, Gameweek Stepper (`prev`/`next`), Gameweek Select Dropdown, Language Toggle (`th` <-> `en`), Theme Switcher (`light` <-> `dark`), และปุ่มเปิด/ปิด Modal (เช่น Squad Pitch Modal)
> 3. **Mobile Layout & Zero Overflow:** ตรวจสอบอย่างเข้มงวดว่าไม่มีการล้นขอบแนวนอนบนหน้าจอมือถือ (`scrollWidth <= clientWidth`, `overflowCount = 0`) และการ์ดจัดเรียงแบบ Single-Column สวยงาม
> 4. **Touch Targets:** ขนาดปุ่มกดบนมือถือต้องมีพื้นที่สัมผัสที่แตะได้ง่าย ไม่ซ้อนทับ และไม่ตกขอบ
> 5. **Cross-League Consistency:** ตรวจสอบความถูกต้องของการเรนเดอร์ข้ามทุกลีกในระบบ (ครบทั้ง 8 ลีก)
> 6. **Visual Proof & Screenshots:** จับภาพหน้าจอจริง (Screenshots) ทั้ง Light Mode และ Dark Mode บนทุก Viewport เพื่อตรวจสอบความเรียบร้อยก่อนรายงานผู้ใช้ทุกครั้ง.

---

## 🏗️ 2. สถาปัตยกรรมระบบ (System Architecture)

ระบบแบ่งออกเป็น 3 เลเยอร์หลัก:

```mermaid
flowchart TD
    subgraph Data Layer [1. Backend & Live Data Fetcher]
        A[Official FPL API] -->|urllib + ThreadPool| B[sync_live_fpl.py]
        B --> C[multi_fpl_data.json]
        B --> D[real_fpl_40700_data.json]
    end

    subgraph Build Layer [2. Standalone HTML Generator]
        C --> E[update_preview.py]
        F[config/leagues_config.json] --> E
        E --> G[index.html / preview.html]
        E --> H[40700/index.html & 675290/index.html]
        E --> I[404.html]
    end

    subgraph CI/CD Layer [3. Automation & Hosting]
        J[GitHub Actions Cron: 3,18,33,48 * * * * (15m)] -->|Run sync & build| B
        J -->|Git Auto-Commit| K[GitHub Pages Deployment]
    end
```

---

## 📁 3. โครงสร้างไฟล์ในโปรเจกต์ (File Directory Map)

```
/Users/micky/Desktop/FPL เซียนอยู่รู/
├── .github/
│   └── workflows/
│       └── fpl_auto_sync.yml     # GitHub Actions รัน Auto-Sync ทุก 15 นาที (3, 18, 33, 48)
├── config/
│   ├── leagues_config.json       # ไฟล์ตั้งค่ามินิลีก (ID, ชื่อลีก, กติการางวัล)
│   └── shi62_special.txt         # ไฟล์บันทึกข้อมูลมินิเกม Shi'62 Special รายสัปดาห์
├── fonts/
│   ├── SukhumvitSet-Bold.ttf
│   ├── SukhumvitSet-Medium.ttf
│   ├── SukhumvitSet-SemiBold.ttf
│   └── SukhumvitSet-Text.ttf     # ฟอนต์พรีเมียม Sukhumvit Set ภาษาไทย
├── images/
│   └── fpl-logo.jpg              # โลโก้ FPL ประจำหัวเว็บ
├── js/ (Modular Core for Local Dev)
│   ├── api.js                   # API Fetcher & Fallback Proxy
│   ├── app.js                   # App Controller
│   ├── calculator.js            # สูตรคำนวณแต้มสุทธิ (หัก Hits), สถิติ Hall of Fame
│   ├── config.js                # ค่าคอนฟิกลีก 40700
│   ├── mockData.js              # ข้อมูลออฟไลน์สำรอง
│   ├── share.js                 # ฟังก์ชันคัดลอกสรุปผลส่ง LINE
│   ├── taglines.js              # เครื่องมือสร้างคำคมแชมป์
│   └── ui.js                    # UI Rendering Engine
├── css/
│   └── styles.css               # สไตล์ CSS และสนามฟุตบอล
├── 40700/index.html             # Entrypoint ตรงสำหรับลีก 40700
├── 675290/index.html            # Entrypoint ตรงสำหรับลีก 675290
├── 38491/index.html             # Entrypoint ตรงสำหรับลีก 38491
├── 404.html                     # รองรับ Single-Page Routing บน GitHub Pages
├── index.html                   # หน้า Dashboard หลัก (Standalone Bundle)
├── preview.html                 # หน้า Preview ในเครื่อง
├── multi_fpl_data.json          # ไฟล์ข้อมูลรวมทุกมินิลีก (Data Hub)
├── real_fpl_40700_data.json     # ไฟล์ข้อมูลย้อนหลังเฉพาะลีก 40700
├── sync_live_fpl.py             # สคริปต์ Python ดึงข้อมูลสดจาก Official FPL API
├── parse_shi62_special.py       # ระบบ Parser & คำนวณเงินรางวัลมินิเกม Shi'62 Special
├── update_preview.py            # สคริปต์คอมไพล์ Standalone HTML ทุกมินิลีก
├── PROJECT_CONTEXT.md           # [ไฟล์นี้] สรุปพิมพ์เขียวโปรเจกต์ทั้งหมด
└── README.md                    # เอกสารแนะนำและกติกา
```

---

## ⚙️ 4. รายละเอียดมินิลีกและกติกา (League Rules & Configs)

ข้อมูลถูกควบคุมผ่าน `config/leagues_config.json`:

### ลีก 1: 40700 - "เซียนอยู่รู หมูอยู่ตึก"
* **สมาชิก:** 12 ทีม
* **งบประมาณรางวัลรวม:** **22,000 บาท**
* **โครงสร้างรางวัล:**
  1. **แชมป์ประจำสัปดาห์ (Weekly Champ):** 350 บาท x 38 สัปดาห์ = 13,300 บาท
  2. **แชมป์ฟุตบอลถ้วย (Cup Tournament):** แชมป์ 1,000 บาท / รองแชมป์ 650 บาท = 1,650 บาท
  3. **แชมป์คะแนนรวมฤดูกาล (Season Overall):** อันดับ 1 (3,500 บ.), อันดับ 2 (2,000 บ.), อันดับ 3 (1,000 บ.), อันดับ 4 (550 บ.) = 7,050 บาท
* **รอบเคลียร์เงิน 6 Phase:**
  * Phase 1 (GW 1-6), Phase 2 (GW 7-12), Phase 3 (GW 13-18), Phase 4 (GW 19-24), Phase 5 (GW 25-30), Phase 6 (GW 31-38 + บอลถ้วย + แชมป์ลีก)

### ลีก 2: 675290 - "NudNee"
* **สมาชิก:** 59 ทีม
* **งบประมาณรางวัลรวม:** **36,000 บาท** (พร้อมสมทบเพิ่มหากมีผู้ลงเล่นประจำเดือนเพิ่ม)
* **โครงสร้างรางวัล:** 
  1. **รางวัลคะแนนรวมประจำฤดูกาล (Season Overall):** รวม 13,500 บาท
     * อันดับ 1 : 5,000 บาท
     * อันดับ 2 : 3,500 บาท
     * อันดับ 3 : 2,500 บาท
     * อันดับ 4 : 1,500 บาท
     * อันดับ 5 : 1,000 บาท
  2. **รางวัลประจำเดือน (Monthly Prizes):** 10 เดือน (ส.ค. 2026 - พ.ค. 2027) รวม 10,000 บาท
     * แชมป์ประจำเดือน : 600 บาท / เดือน (รวม 6,000 บาท)
     * รองแชมป์ประจำเดือน : 400 บาท / เดือน (รวม 4,000 บาท)
  3. **แชมป์ฟุตบอลถ้วย (Cup Champion):** 3,000 บาท (วัดผลสำหรับคนที่ลุ้นรางวัล ถ้าตกรอบเดียวกัน ให้คนที่คะแนนสูงกว่าชนะ)
  4. **ยอดเงินบริจาคการกุศล (Charity Donation):** 9,500 บาท (บริจาคทำบุญให้แก่โรงพยาบาล)
  * *หมายเหตุ: เงินรางวัลอาจมีการเพิ่มเติม ถ้าในระหว่างสิบเดือนของฤดูกาล มีผู้ลงเล่นประจำเดือน*

### ลีก 3: 38491 - "รอ แมน โอน"
* **สมาชิก:** 15 ทีม
* **ค่าสมัคร:** 1,900 บาท/ทีม (50 บาท x 38 สัปดาห์)
* **งบประมาณรางวัลรวม:** **28,500 บาท**
* **การบริหารกองกลาง:** เก็บงวดเดียวเต็มจำนวน 1,900 บาท/ทีม โดยมี "เฟม" (Some might say) เป็นผู้ประสานงานและดูแลเงินกองกลาง
* **โครงสร้างรางวัล:**
  1. **แชมป์ประจำสัปดาห์ (Weekly Champ):** 500 บาท x 38 สัปดาห์ = 19,000 บาท (หักแต้มย้าย Hits, หากแต้มเท่ากันหารรางวัลเท่ากัน)
  2. **แชมป์คะแนนรวมฤดูกาล (Season Overall):** รวม 9,500 บาท
     * อันดับ 1: 4,500 บาท
     * อันดับ 2: 2,500 บาท
     * อันดับ 3: 1,000 บาท
     * อันดับ 4 - 5: อันดับละ 500 บาท
  3. **แชมป์ลีคคัพ (Mini-League Cup):** 1,000 บาท (เริ่มแข่งขันรอบ Knockout ใน Gameweek 35 เฉพาะทีมที่ชำระค่าสมัคร)

### ลีก 4: 1101958 - "Barley's Official League"
* **สมาชิก:** 17 ทีม (12 ทีมชิงเงินรางวัล + 5 ทีมร่วมสนุก)
  * **ทีมชิงเงินรางวัล (12 ทีม):** BMFC™, Oöraora Grandé, Jazzzmith, Ekamai United, Natthapol's Team (Golffu), NuttChan, Univerpool, RJarnOat, เถลิงบัลลังก์แชมป์, BoomBaraka, The AI era, ทีมระบบครับ
  * **ทีมร่วมสนุก (5 ทีม):** GEMINI UNITED, worawolf, pae takam, TUNBO CHICKEN RICE, AI Boys
* **ค่าสมัคร:** รายวีค 200 THB x 38 วีค (7,600 THB) + รายปี 1,000 THB = รวม 8,600 THB / ทีม
* **งบประมาณรางวัลรวม:** **103,200 บาท** (คำนวณจาก 12 ทีมชิงรางวัล: รายวีค 91,200 THB + รายปี 12,000 THB)
* **โครงสร้างรางวัล:**
  1. **รางวัลประจำสัปดาห์ (Top 3 Weekly Prizes):** รวม 2,400 บาท / สัปดาห์ (38 สัปดาห์ รวม 91,200 บาท)
     * อันดับ 1: 1,200 บาท / วีค
     * อันดับ 2: 720 บาท / วีค
     * อันดับ 3: 480 บาท / วีค
     * *กรณีคะแนนสุทธิเท่ากัน (Tie-breaker):* ตัดสินด้วยทีมที่มีตัวทำแต้มสูงสุด (Highest Scoring Player) ในสัปดาห์นั้น หากยังเท่ากันให้ดูตัวทำแต้มสูงสุดอันดับถัดไปทีละคนจนกว่าจะหาผู้ชนะได้ (หากตัวทำแต้มเท่ากันหมดทุกตัวจึงหารรางวัลเท่ากัน)
  2. **รางวัลประจำฤดูกาล (Season Overall Top 3):** รวม 12,000 บาท
     * อันดับ 1: 6,000 บาท
     * อันดับ 2: 3,600 บาท
     * อันดับ 3: 2,400 บาท

### ลีก 5: 438691 - "2 spade"
* **สมาชิก:** 13 ทีม (12 ทีมชิงรางวัล & จ่ายค่าปรับ + 1 ทีมร่วมสนุก)
  * **ทีมชิงรางวัล (12 ทีม):** BMFC™, MFV F.C., Natthapol's Team, ทีมของ Thanakorn, Kafare, TopPP FC, Shoot FC, JOEYMON #10, H, RJarnOat, suriya's Team, KFC
  * **ทีมร่วมสนุก (1 ทีม):** GEMINI UNITED (ID: 306983)
* **ค่าสมัคร:** ไม่มีค่าสมัครแรกเข้า (ใช้ระบบค่าปรับ 5 อันดับท้ายสะสมเข้ากองกลาง)
* **งบประมาณกองกลางสะสมสุทธิ:** **68,400 บาท** (สุทธิ 1,800 บาท / วีค x 38 สัปดาห์)
* **โครงสร้างรางวัล & ค่าปรับ:**
  1. **รางวัลแชมป์ประจำสัปดาห์ (Weekly Winner):** 200 บาท / สัปดาห์ (หักจากเงินค่าปรับประจำสัปดาห์ 2,000 บาท)
  2. **ค่าปรับ 5 อันดับสุดท้ายจากบ๊วย (Weekly Fines into Central Pool):** รวม 2,000 บาท / สัปดาห์
     * อันดับสุดท้าย (บ๊วย): เสียค่าปรับ 600 บาท
     * รองบ๊วย (อันดับ 2 จากท้าย): เสียค่าปรับ 500 บาท
     * อันดับ 3 จากท้าย: เสียค่าปรับ 400 บาท
     * อันดับ 4 จากท้าย: เสียค่าปรับ 300 บาท
     * อันดับ 5 จากท้าย: เสียค่าปรับ 200 บาท
     * *(อันดับ 2 ถึง 7 ปลอดภัย ไม่เสียค่าปรับ)*
  3. **การสะสมเข้ากองกลาง:** เงินค่าปรับ 2,000 บาท หักรางวัลที่ 1 (200 บาท) เหลือสะสมเข้ากองกลางสุทธิ 1,800 บาท / สัปดาห์ (38 สัปดาห์ รวม 68,400 บาท)
  4. **กติกา Tie-breaker:** ตัดสินด้วยทีมที่มีตัวทำแต้มสูงสุด (Highest Scoring Player) ในสัปดาห์นั้น หากยังเท่ากันให้ดูตัวทำแต้มสูงสุดอันดับถัดไปทีละคน (หากเท่ากันหมดทุกตัวจึงหารรางวัลหรือเฉลี่ยค่าปรับ)

### ลีก 6: 187827 - "Shi62"
* **สมาชิก:** 13 ทีม (12 ทีมชิงรางวัล & ร่วมจ่ายค่าปรับ + 1 ทีมร่วมสนุก)
  * **ทีมชิงรางวัล (12 ทีม):** amornTong, Oöraora Grandé, Riin FC, Totti Toon Army, The Cannon, Benjamin Seskooan, SiaLeela, Emery's Revenge, Carrickysseus, Bruno carrick, Bluebert's Team, Winwinwin
  * **ทีมร่วมสนุก (1 ทีม):** GEMINI UNITED (ID: 306983)
* **ค่าสมัคร:** จ่ายตามผลอันดับสิ้นฤดูกาล (อันดับ 7-12 จ่ายให้อันดับ 1-6)
* **งบประมาณรวมแบบ Zero-Sum:** **3,100 บาท** (ไม่มีเงินกองกลางค้าง เคลียร์จ่ายทีเดียวหลังจบ GW 38)
* **โครงสร้างรางวัล & ค่าปรับ (คะแนนรวมรายปี จ่ายตังทีเดียว):**
  1. **กลุ่มผู้ได้รับเงินรางวัล (อันดับ 1 - 6 รวม +3,100 บาท):**
     * อันดับ 1 (แชมป์ลีก): ได้รับ +1,000 บาท
     * อันดับ 2: ได้รับ +800 บาท
     * อันดับ 3: ได้รับ +600 บาท
     * อันดับ 4: ได้รับ +400 บาท
     * อันดับ 5: ได้รับ +200 บาท
     * อันดับ 6: ได้รับ +100 บาท
  2. **กลุ่มผู้ร่วมจ่ายเงินค่าปรับ (อันดับ 7 - 12 รวม -3,100 บาท):**
     * อันดับ 7: จ่าย -100 บาท
     * อันดับ 8: จ่าย -200 บาท
     * อันดับ 9: จ่าย -400 บาท
     * อันดับ 10: จ่าย -600 บาท
     * อันดับ 11: จ่าย -800 บาท
     * อันดับ 12 (บ๊วย): จ่าย -1,000 บาท
  3. **ทีมร่วมสนุก:** GEMINI UNITED ไม่ได้รับเงินรางวัลและไม่ร่วมจ่ายเงินค่าปรับ (แสดงผลร่วมสนุกอย่างเดียว)
  4. **การตัดสิน:** ตัดสินจากคะแนนสะสมสุทธิหลังจบการแข่งขัน GW 38 ครบถ้วน หากคะแนนรวมเท่ากัน ตัดสินตามระบบทางการของ FPL (คะแนนรวม -> ประตูได้ -> ประตูเสีย)
* **มินิเกมพิเศษประจำสัปดาห์: 'Shi\'62 Special' (แท็บเฉพาะลีก 187827):**
  * **ผู้เล่น:** สมาชิกในลีก 187827 (ยกเว้น GEMINI UNITED) พร้อมผู้ร่วมทายผลเฉพาะมินิเกม ('Nod' ซึ่งไม่ได้ลงเล่นแฟนตาซี FPL)
  * **รูปแบบ:** ทายผลฟุตบอลพรีเมียร์ลีกพร้อมแต้มต่อ (Handicap) รายคู่ในแต่ละ Gameweek
  * **กติกาได้-เสีย (Peer-to-Peer Zero-Sum):**
    * แทงผิดเสียขาละ 100 บาทต่อคู่
    * เงินกองกลางของคนที่แทงผิดจะถูกนำมาหารเฉลี่ยให้ผู้ที่ทายช่องถูกทุกคนเท่ากัน
    * หากมีเศษปัดให้คนที่มีชื่อแรกสุดในช่องถูกได้มากกว่า 5 หรือ 10 บาท (เช่น เสีย 200 บาท / ชนะ 3 คน -> คนแรกได้ 70 บาท, อีกสองคนได้คนละ 65 บาท)
    * หากคู่นั้นไม่มีใครทายถูกเลย ถือเป็นโมฆะ (Push / เจ๊า) ไม่มีใครได้และไม่มีใครเสียเงิน
  * **ช่องทางอัปเดตข้อมูล:** ผ่านไฟล์ข้อความ `config/shi62_special.txt` โดยวางบันทึกย่อคู่แข่งขันและผลชนะได้โดยตรง ระบบมี Parser คำนวณเงินและอัปเดตเว็บให้อัตโนมัติ
  * **การแสดงผล:** แท็บเฉพาะ (ปัจจุบันตั้งชื่อชั่วคราวว่า 'BETA') ประกอบด้วยสถิติภาพรวม, ตารางเงินสะสมตลอดฤดูกาล, ตัวเลือกดูย้อนหลังรายสัปดาห์ (GW Selector), การ์ดแจกแจงผลรายคู่ (แสดงชื่อทีมเต็มและผลเสมอ เช่น `BRE`, `draw`, `LIV` แทนตัวย่อตัวเดียว), และปุ่มคัดลอกสรุปผลส่ง LINE
  * **รายชื่อทีมและตัวย่อในมินิเกม (12 ทีม FPL + 1 Guest):**
    * `Tong`: amornTong (Amornthep Taveephanich)
    * `Oo`: Oöraora Grandé (Patrick Oo)
    * `Riin`: Riin FC (WARIN SINAROJ)
    * `Totti`: Totti Toon Army (Totti NUFC)
    * `Poang`: The Cannon (Kasidit Boonyawat)
    * `Oan`: Benjamin Seskooan (Nattaporn Yaemsaard)
    * `Sia`: SiaLeela (Prachya Leelamantep)
    * `Mai`: Emery's Revenge (Rati Leetrakul)
    * `Boy`: Carrickysseus (Thamrong Pattarajiarapan)
    * `Bert`: Bluebert's Team (Bluebert Tingnongnoi)
    * `Pong+`: Winwinwin (Ratapan W)
    * `Dow`: Bruno Carrick (Bruno Zoro)
    * `Nod`: ผู้ร่วมทายผล (เล่นเฉพาะมินิเกม ไม่ได้ลงเล่นแฟนตาซี FPL)

### ลีก 7: 5349 - "Bramann League"
* **สมาชิก:** 20 ทีม (19 ทีมแข่งขัน + 1 ทีมร่วมสนุก GEMINI UNITED)
  * **ทีมร่วมสนุก (1 ทีม):** GEMINI UNITED (ID: 306983)
  * **สมาชิกแข่งขัน (19 ทีม):** -Nk_KOP, Oöraora Grandé, van Xke, BMFC™, Putun KNVB, Micchester United, 4OUR, NUKE-UTD®, CasanoVej, Univerpool, Falco.245, Talidtidty, KwangSettha, HereAu, golden club, Pongacku, Dotman 2026, 67, Supalerk's Team
* **สถานะกติกา & เงินรางวัล:** อยู่ระหว่างรอประกาศกติกาและโครงสร้างเงินรางวัลอย่างเป็นทางการ (Pending Rules & Prizes)
* **Direct League URL:** `https://www.fplsawadika.com/5349`

### ลีก 8: 567387 - "Fantasy Nguan & friends cup"
* **สมาชิก:** 12 ทีม
  * **สมาชิก:** GEMINI UNITED, Punizio, ATikom, LARPWAHAHA FC, bomb29599, Attack The Champion, Pokko Utd, The Red Company, FAKETHIS, Inwza007, and others
* **สถานะกติกา & เงินรางวัล:** อยู่ระหว่างรอผู้ดูแลลีกประกาศกติกาและโครงสร้างเงินรางวัล (Pending Rules & Prizes)
* **Direct League URL:** `https://www.fplsawadika.com/567387`

---

## 🎨 5. ไฮไลต์ฟีเจอร์สำคัญด้าน UI/UX & Frontend

1. **Standalone Single-File Distribution (`update_preview.py`):**
   - รวม HTML, Tailwind CSS (CDN), Chart.js (CDN), และ Multi-League Data JSON ไว้ในไฟล์เดียว
   - ตัดปัญหา CORS 100% รันได้ทันทีทั้ง Local (file://) และ GitHub Pages
2. **Authentic Pitch Formation & Official FPL Club Kits:**
   - ผังสนามฟุตบอล 4 ชั้น (GK, DEF, MID, FWD) พร้อมม้านั่งสำรอง
   - แสดงเสื้อแข่งจริงของสโมสร (Official FPL Kits) ทั้งเสื้อผู้เล่นเหย้าและเสื้อผู้รักษาประตู พร้อมเซฟเป็น Local Assets ใน `images/shirts/`
   - มี Badge แสดง Captain (C), Vice-Captain (V), และชิป (3xC, Bench Boost, Free Hit, Wildcard)
3. **Borbou Commentary Engine (ระบบวิเคราะห์สไตล์ บอ.บู๋):**
   - **กฎเหล็ก:** **งดใช้อีโมจิ 100%**, ใช้สำนวนดุดัน กวน ขยี้ ปากจัด แบบคอลัมนิสต์รุ่นเก๋า
   - **Century Club:** มีคำคมพิเศษเฉพาะสำหรับทีมที่ทำแต้มทะลุ 100+ คะแนนในสัปดาห์เดียว
   - **Customizable Note:** แอดมินสามารถพิมพ์แก้ไขบทวิเคราะห์สดได้บนหน้าเว็บ
4. **Instant LINE Copy:**
   - ปุ่มคัดลอกสรุปผลคะแนน ตารางอันดับ และเงินรางวัล เพื่อนำไปวางในกลุ่มแชท LINE ได้ทันที
5. **Visitor Counter Badge:**
   - แสดงยอดผู้เข้าชมเว็บไซต์แบบเรียลไทม์ที่ Footer ดีไซน์มินิมอลสีเทา `Visitors: xxxx`
   - เชื่อมต่อกับ `api.visitorbadge.io` แบบ Serverless พร้อมระบบ Cache บน `localStorage` ป้องกันหน้ากระตุก
   - **Anti-Spam / Cooldown Lock:** ล็อกคูลดาวน์ 1 ชั่วโมงต่อบราวเซอร์ ป้องกันยอดเฟ้อจากการกด Refresh (F5) หรือสลับแท็บไปมา
6. **Competition View (ภาพรวมการแข่งขัน & ข้อมูลเชิงลึก):**
   - อยู่ระหว่างแท็บ **Weekly Highlight** และ **สรุปรางวัล** รองรับข้อมูลแบบไดนามิกตามมินิลีกที่ผู้ใช้เลือก (Dynamic Multi-League Integration)
   - **Card Available:** ตารางวิเคราะห์ชิป/การ์ดคงเหลือของทุกทีมในลีก (WC1, WC2, FH, 3xC, BB) พร้อมการ์ดสรุปยอดคงเหลือของทั้งลีก ช่วยให้ประเมินการ์ดคู่แข่งได้ทันที
   - **Important Players (> 70%):** แสดงนักเตะมหาชนที่ถูกเลือกเกิน 70% ในลีก พร้อม % ถือครอง, จำนวนทีม และรายชื่อทีมที่เลือก
   - **Differential Players (< 20%):** แสดงนักเตะทีเด็ดที่ถูกเลือกน้อยกว่า 20% ในลีก พร้อมฟิลเตอร์แยกตำแหน่ง (GKP, DEF, MID, FWD) และแท็กแสดงชื่อทีมที่เป็นเจ้าของ
   - **Transfer Suggestions:** คำแนะนำการย้ายตัวประจำสัปดาห์ (Best Players & Best Value) จาก FPL Gameweek พร้อม Projected Points, % ถือครองในลีก และระบบดร็อปดาวน์ไฮไลท์นักเตะในทีมตนเอง (Bold + Badge ในทีม)

---

## 🔄 6. ระบบ Backend & GitHub Actions Sync

1. **สคริปต์ `sync_live_fpl.py`:**
   - ใช้ `ThreadPoolExecutor(max_workers=10)` ดึงข้อมูล Picks, Live Points, Sub, Captain ของทุกทีมพร้อมกัน
   - ดึงข้อมูลจาก:
     - `/api/bootstrap-static/` (รายชื่อนักเตะ, ทีม, สถานะ GW)
     - `/api/event/{gw}/live/` (แต้มสดและโบนัส BPS)
     - `/api/leagues-classic/{lid}/standings/` (ตารางอันดับลีก)
     - `/api/entry/{eid}/event/{gw}/picks/` (11 ตัวจริง, ตัวสำรอง, กัปตัน, Hits, ชิป)
   - คำนวณ Net Points = `Raw Points - Transfer Cost (Hits)` อย่างแม่นยำ
2. **การทำงานของ GitHub Actions Workflow (`fpl_auto_sync.yml`):**
   - Trigger: รันอัตโนมัติทุกๆ 15 นาที (`cron: '3,18,33,48 * * * *'`) หรือกดรันมือได้ (`workflow_dispatch`)
   - ขั้นตอน: Checkout -> Python 3.11 -> `python3 sync_live_fpl.py` -> `python3 update_preview.py` -> Auto Commit & Push `[skip ci]`

---

## 🔍 7. ปัญหาที่พบบ่อยและข้อสังเกตทางเทคนิค (Technical Insights)

### เรื่อง: สถานะ Gameweek แสดงเป็น `LIVE` แม้เตะจบครบทุกคู่แล้ว
* **สาเหตุ:** ทาง Official FPL Server ใช้เวลาประมาณ 8–18 ชั่วโมงหลังเกมนัดสุดท้ายจบ เพื่อรัน Batch ตรวจสอบข้อมูลระดับโลก (`data_checked`) ก่อนจะสลับค่า `finished: true` ใน `/api/bootstrap-static/`
* **แนวทางแก้ไขล่วงหน้า:** สามารถปรับให้ `sync_live_fpl.py` ตรวจสอบสถานะจาก `/api/fixtures/?event=X` หากทุกคู่ขึ้น `finished = true` หรือ `finished_provisional = true` ครบ 10 คู่ ให้ปรับ `is_finished = true` ให้อัตโนมัติทันที

### เรื่อง: การกดดูแผนจัดทีมเปิดไม่ติดในทีมที่มีเครื่องหมายคำพูด (Quote-Safety)
* **สาเหตุ:** ชื่อทีมที่มีเครื่องหมาย `'` เช่น `Ziang's Team` หรือ `Chatiwat's Team` ทำให้ inline `onclick` string attribute ถูกตัดสตริงและเกิด JS SyntaxError
* **แนวทางแก้ไขที่เสร็จสิ้น:** ปรับให้ส่งเฉพาะ `entry_id` (Number) เท่านั้น และค้นหาข้อมูลจาก JSON Object โดยตรง พร้อมเพิ่มการจัดการกรณีไม่มีข้อมูลแผนในสัปดาห์นั้นให้แสดงกล่องว่างแบบสวยงาม (Graceful Empty State) แทนการดึงข้อมูลทีมอื่นมาแสดง

### เรื่อง: การบันทึกไฟล์อัตโนมัติใน GitHub Actions (`.github/workflows/fpl_auto_sync.yml`)
* **จุดที่ตรวจพบ:** บรรทัดที่ 39 ในไฟล์ workflow เดิมมีคำสั่ง `git add real_fpl_40700_data.json index.html preview.html` ซึ่งข้ามการบันทึก `multi_fpl_data.json` และหน้าลีกลำดับอื่น (`40700/index.html`, `675290/index.html`, `38491/index.html`, `404.html`)
* **วิธีแก้ไข:** แนะนำให้กด Edit ไฟล์ `.github/workflows/fpl_auto_sync.yml` บนหน้าเว็บ GitHub โดยเปลี่ยนบรรทัดที่ 39 เป็น `git add -A` เพื่อให้ระบบ Auto Sync ทุก 15 นาทีบันทึกและอัปเดตไฟล์ของทุกลีกขึ้นสู่เว็บอย่างสมบูรณ์แบบ


### เรื่อง: ฟังก์ชัน Competition (ข้อมูลเจาะลึกคู่แข่ง & การวิเคราะห์ขุมกำลัง)
* **ตำแหน่งเมนู:** อยู่ระหว่าง `Weekly Highlight` และ `สรุปรางวัล`
* **ฟีเจอร์ภายใน:**
  1. **Card Available:** ตารางและ Matrix แสดงการ์ดคงเหลือของทุกทีมในลีก (WC1, FH, 3xC, BB) โดยซ่อน WC2 จนกว่าจะถึง GW20 พร้อมฟิลเตอร์ Active State และ Sticky Column สำหรับจอมือถือ
  2. **Important Players:** รายชื่อนักเตะยอดนิยมที่ถูกเลือกมากกว่า 70% พร้อมระบุจำนวนทีมและ %
  3. **Differential Players:** รายชื่อตัวทีเด็ดดิฟเฟอเรนเชียลที่ถูกเลือกน้อยกว่า 20%
  4. **Transfer Suggestions:** แนะนำการย้ายทีม (Best Players / Best Value) รายตำแหน่ง อ้างอิงจาก AI Algorithm พร้อมไฮไลต์ทีมในลีกตามลำดับ Total Leaderboard
* **ระบบการกระพริบของแท็บเมนู (Tab Blinking Logic):**
  * **ขณะเกมวีคกำลังแข่งขัน (`is_finished = false`):** แท็บ `LIVE` และ `Weekly Highlight` กระพริบสีเขียว เพื่อดึงดูดให้ผู้ใช้ติดตามผลสด ส่วนแท็บ `Competition` หยุดกระพริบ
  * **เมื่อจบการแข่งขันเกมวีคนั้นแล้ว (`is_finished = true`):** แท็บ `LIVE` และ `Weekly Highlight` หยุดกระพริบ ส่วนแท็บ `Competition` จะขึ้นกระพริบแทน เพื่อเตือนให้ผู้จัดการทีมเข้ามาดูการ์ดคู่แข่งและวางแผนย้ายตัวก่อนเกมวีคถัดไปจะเริ่ม
* **การจัดเรียงลำดับทีม (Team Ordering & Non-prize Separation):**
  * ทีมที่แข่งขันชิงเงินรางวัลจะถูกจัดเรียงตามลำดับ Total Leaderboard (อันดับ 1, 2, 3...) อยู่ด้านบน
  * ทีมร่วมสนุก (`non_prize_teams`) จะถูกแยกนำไปไว้ด้านล่างทั้งหมด คั่นด้วยแถบหัวข้อ `ทีมร่วมสนุก (ไม่นำมาคิดคำนวณเงินรางวัล)` พร้อมแสดงป้าย `[ ร่วมสนุก ]` และสัญลักษณ์วงกลมแบบไม่มีตัวเลขอันดับ เช่นเดียวกับหน้าสรุปรางวัล
* **ระบบจัดการคะแนนนักเตะที่ยังไม่ได้ลงแข่งขัน (Unstarted Players Points UI/UX):**
  * ในเกมวีคที่กำลังแข่งขันอยู่ (`is_finished = false`) หากนักเตะคู่ใดยังไม่ได้เริ่มแข่งขัน (`not_played_yet = true` หรือยังไม่ Kickoff) ระบบจะไม่แสดงคะแนน `0 pts` ในหน้าสนามจัดทัพ (Squad Pitch Modal) เพื่อให้ผู้ใช้ทราบชัดเจนว่านักเตะยังมีโอกาสลงสนามทำคะแนนอยู่
  * สำหรับผู้เล่นตัวสำรองที่ยังไม่ได้ลงแข่งขัน จะแสดงเครื่องหมาย `-` แทนตัวเลข `0 pts` และไม่นับรวมเป็นผลรวมคะแนนบนม้านั่งสำรองจนกว่าจะเริ่มเตะ




### เรื่อง: Dev Corner (About View) & Eye-Comfort Light Mode
* **Dev Corner:** ลบกล่อง Quote คำคม (ทั้งหัวข้อและเนื้อหา "Once you bid farewell to discipline...") ออกทั้งหมด ทำให้ 6 ฟีเจอร์หลัก (6 Core Feature Pillars) แสดงผลขึ้นมาที่ตำแหน่งบนสุดของแท็บทันที สะอาด กระชับ เข้าถึงง่าย
* **Eye-Comfort Light Mode:** ปรับปรุงโทนสีโหมดสว่างให้ถนอมสายตา โดยใช้ Canvas พื้นหลังสีเทาสเลทนุ่ม `#f1f5f9` (Slate-100), ปรับแถบ Header เป็น `bg-slate-100/90 backdrop-blur-xl border-slate-200/90`, กล่องคอนเทนต์เป็นการ์ดสีขาวขอบบางละมุน, และจุดสิ้นสุดของ Spotlight Gradients จบที่ `#f8fafc` ลดปัญหาแสงจ้าสะท้อนตา (White Glare) ลง ~25-30%

### เรื่อง: มาตรฐานการปรับปรุง UX/UI ข้ามทุกลีก (Cross-League Archetype Standardization)
* **หลักการ:** เมื่อมีการอัปเกรดหน้าตาหรือโครงสร้างของฟีเจอร์ใดๆ ต้องปรับปรุงให้ทุกลีกที่มีฟีเจอร์นั้นๆ มีหน้าตาตรงกันเสมอ
* **กรณีศึกษา 1 - แท็บ "ทายผล" (Prediction Feature):**
  * ลีกที่มีฟีเจอร์นี้: **League 5349 (Bramann League)** และ **League 187827 (Shi62 Special)**
  * **แม่แบบที่กำหนด (Archetype Standards):**
    1. การ์ดยกระดับ `rounded-2xl` ขอบมนและเงามิติละมุน
    2. มี Match Index Badge (`#1`, `#2`, ...) และ Tournament Tag (`[UCL]`, `[EPL]`)
    3. ป้ายราคาต่อรอง Amber Handicap Badges แยกค่าต่อรอง (`-0.5`, `-1`, `-0.5/1`) ออกจากชื่อทีมชัดเจน
    4. โลโก้สโมสรจริงแบบคมชัดและชื่อทีมเต็ม (ดึงจาก Assets เครื่อง `images/teams/*.png`)
    5. ไฮไลต์ฝั่งชนะด้วย Emerald Box พร้อม Badge `ชนะ ✅`, ฝั่งแพ้ใช้ Slate Neutral นิ่งตา
    6. ชิปรายชื่อผู้ทายผลพร้อมเอฟเฟกต์ Hover และแถบสรุปเงินได้-เสียสุทธิรายบุคคลใต้คู่ (Net Payout Chips)
    7. Responsive Layout รองรับทั้ง 2 ตัวเลือกและ 3 ตัวเลือก ไม่มีการบีบอัดตัวอักษรบนจอมือถือ
* **กรณีศึกษา 2 - แท็บ "เรดาร์ฟอร์ม" (Team Consistency Radar) - [ACTIVE & VERIFIED]:**
  * ครอบคลุม: **ทุกลีกในระบบ (ครบทั้ง 8 ลีก)** ผ่านการสร้างเทมเพลตเดียวใน `update_preview.py`
  * **แม่แบบที่กำหนด (Unslopping & Editorial Clean Standards):**
    1. **Color Reduction & Neutral Ramp:** ปลดสีลูกกวาด (Cyan, Emerald, Amber, Purple) ในการ์ด 4 สถิติเด่นออกทั้งหมด ใช้การ์ดยกพื้นสีสเลทนิ่งตาเท่ากัน เน้นตัวเลขสถิติแบบ `tabular-nums font-mono` ชัดเจน
    2. **Restrained Tier Palette:** ปรับระบบป้ายระดับความสม่ำเสมอ (Consistency Tiers) จาก 5 สีฉูดฉาดเป็น 3 โทนกลมกลืน (S-Tier สีดำ/ขาวพรีเมียม, A-Tier สเลทคอนทราสต์, B/C-Tier นิวทรัลซอฟต์, Volatile สีเตือนระวังแบบนุ่มนวล)
    3. **Live vs Finished Dual States:** ระบบคำนวณเฉพาะ Gameweek ที่จบสมบูรณ์ 100% (Official Settled Only) เพื่อป้องกันสถิติแกว่งหลอกตา พร้อมแสดงแบนเนอร์แจ้งเตือนสถานะชัดเจนเมื่อมีคู่แข่งสด (`GW X In-Play • Stats based on finalized GW 1 - X-1`)
    4. **Adaptive Sticky Table (Mobile Priority):** ตรึงคอลัมน์ `#` และ `ชื่อทีม` ชิดซ้าย พร้อมจัดลำดับคอลัมน์สำคัญ (คะแนนรวม, คะแนนเฉลี่ย, ระดับ Tier) ให้อยู่ถัดจากชื่อทีมทันที เพื่อให้อ่านข้อมูลหลักได้ทันทีบนจอมือถือโดยไม่ต้องเลื่อนจอไปทางขวาไกล
    5. **Compact Collapsible Layout:** ยุบกล่องเกณฑ์การประเมินให้พับเก็บเป็นค่าเริ่มต้น (`Collapsed by default`) ช่วยประหยัดพื้นที่แนวตั้งบนมือถือกว่า 350px และปรับแถบจัดอันดับความแข็งแกร่งลีกให้กะทัดรัด สบายตา
    6. **100% Bilingual & Multi-Device Parity:** รองรับการสลับภาษา ไทย/อังกฤษ คมชัดทุกป้าย และผ่านการทดสอบเรนเดอร์จริงบน Desktop (1440x900), Tablet (768x1024), และ Mobile (375x812) โดยไม่มี Horizontal Overflow (`scrollWidth <= clientWidth`)
* **กรณีศึกษา 3 - แท็บ "ไฮไลท์" (Weekly Highlights Architecture & Impeccable Audit) - [ACTIVE & VERIFIED]:**
  * ครอบคลุม: **ทุกลีกในระบบ (ครบทั้ง 8 ลีก)** ผ่านการเรนเดอร์จาก `renderHighlightsView()` ใน `update_preview.py`
  * **แม่แบบที่กำหนด (Impeccable & Smart Deduplication Standards):**
    1. **Hero Spotlight with Subtle Gold Hairline:** ปรับการ์ดแชมป์ประจำสัปดาห์ด้วยขอบทองละมุนตา (`border-amber-400/40 dark:border-amber-500/30 ring-1 ring-amber-400/20`) แสดงผลสถิติแบบคลีนล้วน (Pure Stats: คะแนน, กัปตัน, แต้มลบ, และสถานะสด/สรุปผล) โดยไม่ใส่ข้อความบทวิเคราะห์ที่รกรุงรัง
    2. **Smart Deduplication:** ตัดปัญหาการ์ดซ้ำซ้อน (เช่น ผู้จัดการคนเดียวกันได้ทั้ง `Sharpest Trader` และ `Hit Hero` พร้อมข้อความตัวย้ายซ้ำกัน 100%) ให้เหลือการ์ดเด่นเพียงใบเดียวแบบมีเอกลักษณ์ และตัดการ์ดย้ายตัวผิดซ้ำซ้อน (`Transfer Tangle` vs `Painful Hit`)
    3. **Balanced 3-Section Hierarchy:** ยุบรวม `มูลค่าทีมสูงสุด (Value King)` เข้ากับหมวด `แท็กติก & มูลค่าทีม (Tactics, Chips & Finances)` กำจัดการ์ดใบเดียวโดดเดี่ยวใน Section 4 ทำให้ตาราง Grid 3 คอลัมน์บน Desktop เต็มแน่นสมดุล
    4. **Strict Localization (100% Thai / 100% English):** ชื่อหัวข้อการ์ดรางวัลทุกใบแปลเป็นภาษาไทย 100% เมื่อเลือกภาษาไทย (`ฟอร์มสะดุด`, `ไต่อันดับสูงสุด`, `อันดับร่วงลงแรง`, `เซียนเปิดการ์ด`, `ไม่ง้อชิปการ์ด`, `การ์ดยังไม่โดน`, `ดองแต้มสำรอง`, `มูลค่าทีมสูงสุด`, `ดึงตัวเข้าเป้าสุดปัง`, `ดึงผิดชีวิตเปลี่ยน`, `ย้ายตัวเดียวเสียวทั้งลีก`, `สายลบไม่ยั้ง`) และภาษาอังกฤษสากล 100% เมื่อเลือกภาษาอังกฤษ
    5. **Collision-Free Mobile Headers:** บนจอมือถือ (< 640px) ซ่อนคำอธิบายย่อยทางขวา (`hidden sm:inline`) เหลือเฉพาะชื่อหมวดหลักสั้นกระชับ เพื่อแก้ปัญหาข้อความเบียดขึ้นบรรทัดใหม่ซ้อนกัน
    6. **Accessibility Complete:** เพิ่ม `aria-label` และ `title` ให้กับปุ่ม Stepper เปลี่ยน GW ก่อนหน้า/ถัดไป และปุ่มกดเปิดดูผังทีมครบถ้วน ผ่านการตรวจสอบ Headless Chrome 0 runtime errors ทุกลีก 100%

---

## 🚀 8. แนวทางการพัฒนาต่อยอดในอนาคต (Roadmap & Scaling Architecture)

### 8.1 สถาปัตยกรรมรองรับการขยายตัวบน GitHub Free Tier (Micro-SaaS Ready)
1. **Tiered League Architecture (การแยกเกรดของลีก) - [ACTIVE & VERIFIED]:**
   * **Tier 1: Mini-League (1 – 30 ทีม):**
     * โหมด Full Analytics & Pitch View (ดึง Picks, 11 ตัวจริง, ตัวสำรอง, กัปตัน, Hits, ชิป, สถิติเงินรางวัล)
     * รองรับได้สูงสุด ~20 – 30 ลีก (300 – 500 ทีมรวม) ต่อรอบการรัน เพื่อไม่ให้ชน Rate Limit 429 ของ FPL
   * **Tier 2: Large League (31 – 1,000+ ทีม):**
     * โหมด Standings & Leaderboard Only
     * ข้ามการดึง Squad และ Picks รายทีมทั้งหมด (`squads = {}`) ดึงเฉพาะตารางคะแนน `/api/leagues-classic/{lid}/standings/` (หน้าละ 50 ทีม)
     * ลดการเรียก Network API ลงมากกว่า 85% และลดการประมวลผลให้เบาเป็นศูนย์ รองรับลีกขนาดใหญ่ 1,000+ ทีมได้ทันทีโดยไม่ติดโควตา
2. **Decoupled Data Architecture (แยกไฟล์ข้อมูลรายลีก) - [ACTIVE & VERIFIED]:**
   * บันทึกไฟล์ข้อมูลแยกรายลีกแบบเพียว JSON ลงที่ `data/leagues/{id}.json` (ขนาดเพียง ~280 KB - 1.4 MB ต่อลีก)
   * หน้า HTML ของแต่ละลีก (`40700/index.html`, `675290/index.html`, ฯลฯ) รวมเฉพาะข้อมูล Squads ของลีกตัวเองเท่านั้น โดยตัด Squads ของลีกอื่นออกทั้งหมด
   * ส่งผลให้ขนาดไฟล์ HTML ลดลงกว่า 60% (จาก 4.95 MB เหลือ ~1.95 MB) และลด Git Commit Bloat ลงกว่า 30 MB ในทุกรอบซิงก์
   * รองรับการสลับลีกแบบไดนามิก: ดึงข้อมูลอัตโนมัติผ่าน `fetch('data/leagues/{id}.json')` พร้อม Graceful Fallback สลับหน้าบน `file:///` ทันที
3. **Smart Finished Detection - [ACTIVE & VERIFIED]:**
   * ตรวจสอบสถานะจบ Gameweek ทันทีจากผลการแข่งขันจริงใน `/api/fixtures/?event=X` โดยไม่ต้องรอ Batch `data_checked` ของ FPL Server
4. **Head-to-Head & Cup Bracket Visualization:** ผังสายการแข่งขันบอลถ้วยแบบอินเทอร์แอคทีฟ
5. **Player Transfer Analytics & Dedicated Transfers Tab - [ACTIVE & VERIFIED]:** แยกแท็บใหม่ “วิเคราะห์การย้ายตัว” (Transfers) รวมสถิติการย้ายตัวประจำสัปดาห์ (Transfers In/Out, Hits Deduction, Net Points Impact, Best Transfer of the Week), นักเตะมหาชน > 70%, นักเตะทีเด็ด < 20%, และคำแนะนำการย้ายตัว (Transfer Suggestions) พร้อมระบบสองภาษา (ไทย/อังกฤษ) 100% ไม่ปนกัน
6. **Unslop Chips Status Redesign (Status-First Architecture) - [ACTIVE & VERIFIED]:** ปรับปรุง UX/UI หน้า 'สถานะชิป' (Chips Status) ตามหลัก Unslop:
   * **Status-First Color Architecture:** ลดสีรุ้ง (7-8 สี) เหลือ Neutral Ramp นุ่มตา + Semantic Status (Active/Live = Hero Accent, Available = เขียวมินิมอล, Used = เทานิ่ง GW X, Expired = เทาอ่อน) พร้อม Typographic Badges (WC, FH, TC, BB)
   * **Live Matchday Spotlight:** แผง Spotlight สรุปผู้จัดการทีมที่เปิดใช้งานชิปในสัปดาห์นั้นแบบสดๆ (พร้อมบอกกัปตัน TC และแต้มม้านั่ง BB) และติดป้าย `⚡ LIVE` ในตาราง เมื่อแข่งจบจะปรับเป็นโหมดคลังชิปนิ่งสงบอัตโนมัติ
   * **Interactive Metric Cards:** รวมการ์ดสถิติ 4 ใบเข้ากับฟิลเตอร์กรองข้อมูลในตัว ตัดปุ่มฟิลเตอร์ซ้ำซ้อนด้านล่างออก เหลือเพียงช่องค้นหาคลีนๆ
   * **Streamlined Sticky Table:** ตัดหลอดกราฟหนาๆ ในช่องสรุปให้เหลือตัวเลข 4/4 โปร่งสบายตา ล็อกคอลัมน์ชื่อทีม เลื่อนตารางแนวนอนลื่นไหลบน Mobile/Tablet/Desktop รองรับทั้ง Light/Dark mode และ สองภาษา (TH/EN) ครบทั้ง 8 มินิลีก
7. **Export as Image (Social Share Card) - [CANCELLED / REMOVED]:** ยกเลิกการพัฒนาตาม Product Strategy เพื่อส่งเสริมให้สมาชิกเข้ามาดูอันดับและคะแนนสดผ่านหน้าเว็บไซต์โดยตรง (Retain Direct Web Traffic)
8. **Unslop Transfer Analytics Redesign (Monochrome & Semantic Architecture) - [ACTIVE & VERIFIED]:** ปรับปรุง UX/UI หน้า 'วิเคราะห์การย้ายตัว' (Transfers Analytics) ตามหลัก Unslop:
   * **Monochrome Neutral Ramp + Semantic Accent:** ลดสีลูกกวาด (เดิม 8+ สี) เหลือเพียง Slate Ramp (50-950) คุมพื้นผิวทั้งหมด และสงวนสีเขียว/แดงไว้เฉพาะความหมายของข้อมูล (กำไร/ขาดทุน/In/Out)
   * **Typographic Numbering (01 / 02 / 03):** แยก 3 ส่วนหลัก (01 / สถิติการย้ายตัว, 02 / โครงสร้างนักเตะ, 03 / คำแนะนำการย้ายตัว) ด้วยตัวเลขโมโนสเปซและเส้นแบ่ง Hairline ชัดเจน สบายตา
   * **Live vs Finished Dual-Mode:** เมื่อ Live แสดงป้าย `⚡ LIVE` กะพริบนวลตา พร้อมระบุแต้ม ROI ชั่วคราว / เมื่อ Finished แสดง `✓ OFFICIAL` นิ่งสงบ พร้อมสรุปผลทางการและดีลยอดเยี่ยมประจำสัปดาห์
   * **Interactive KPI Filter Cards:** การ์ดสถิติ 4 ใบด้านบนทำหน้าที่เป็นตัวกรองในตัว (ย้ายตัว, แต้มลบ, กำไรสุทธิ, ดีลยอดเยี่ยม) ตัดปุ่มฟิลเตอร์ซ้ำซ้อนออก เหลือช่องค้นหาคลีนๆ
   * **Clean Monochromatic Tags & Solid Bar:** ป้ายตำแหน่งนักเตะ (GKP, DEF, MID, FWD) ปรับเป็น Monospace Tag โทน Slate เรียบหรู ตัดสีลูกกวาด 4 สีออก, เปลี่ยน Progress Bar เป็นเส้นสีทึบเรียบเนียนไร้ Gradient
   * **Segmented Mobile Switcher & Crisp Table:** ตารางคำแนะนำการย้ายตัวใช้ Segmented Control บน Mobile ไร้การล้นขอบ (Zero Overflow) และตารางคู่ Side-by-Side คมชัดบน Desktop/iPad พร้อมไฮไลท์นักเตะในทีมด้วยป้ายมินิมอลสบายตา รองรับทั้ง 8 มินิลีก, 2 ภาษา (TH/EN) และ 2 โหมดสี (Light/Dark)
   * **Impeccable Audit & Micro-Polish:** ผ่านการตรวจประเมินคุณภาพตามมาตรฐาน Impeccable (7 มิติ UX/UI) พร้อมเพิ่ม Actionable Empty State มีปุ่มรีเซ็ตฟิลเตอร์คลิกเดียวสำหรับรายการย้ายตัวและนักเตะทีเด็ด, ปรับ Smooth Hover Transition (duration-200 / duration-150) บนการ์ดผู้จัดการและ KPI Filter Buttons ครบถ้วน 100% ไร้ Runtime Error บนทุกอุปกรณ์.
9. **Unslop Dev Corner & System Architecture Redesign (Monochrome & Live/Finished Dual-Mode) - [ACTIVE & VERIFIED]:** ปรับปรุง UX/UI หน้า 'Dev Corner' ตามมาตรฐาน Unslop & Impeccable:
   * **Monochrome Neutral Ramp + Typographic Indexing (01 - 06):** ปลดสีรุ้งลูกกวาดทั้ง 6 สี (เขียว, ฟ้า, ม่วง, ส้ม, เหลือง, ไซแอน) ในการ์ด 6 เสาหลักออกทั้งหมด ใช้ Slate Neutral Ramp สบายตาเท่ากันทุกใบ และแยกหัวข้อด้วยตัวเลขโมโนสเปซคมชัด `01` ถึง `06` พร้อมตัดการใส่ตัวเลขซ้ำซ้อนด้านหน้าชื่อฟังก์ชัน
   * **Live vs Finished Dynamic Telemetry:** แบนเนอร์ด้านบนและเสาหลักปรับเปลี่ยนตามสถานะแมตช์จริงอัตโนมัติ (Live: แจ้งเตือน `⚡ LIVE RELAY • 15s Edge Poll` พร้อมติดป้าย `● LIVE` / `● IN-ACTION` บนเสาหลักคะแนนสดและส่องแผน / Finished: ปรับเป็น `✓ OFFICIAL SETTLED • Cached` พร้อมติดป้าย `✓ SETTLED` / `✓ FINAL` บนเสาหลักเงินรางวัลและทำเนียบแชมป์)
   * **Progressive Disclosure Architecture:** คงโครงสร้าง `<details>` พับเก็บข้อมูลเชิงลึกทางเทคนิค (Specs & Diagrams) ไว้เป็นค่าเริ่มต้น ช่วยประหยัดพื้นที่แนวตั้งบนจอมือถือกว่า 1,200px พร้อมไฮไลท์ STAGE 04 (Client Runtime & 15s Relay) ด้วยเส้นขอบและป้ายไฟสีเขียวนุ่มตาในระหว่าง Live
   * **Mobile & Tablet Zero Overflow:** ปรับแผงแบดจ์หัวเว็บให้ wrap ลงมาอย่างสวยงามบนจอมือถือ ป้องกันการล้นขอบแนวนอน (`overflowCount = 0` บน Viewport 375px)
   * **100% Cross-League & Bilingual Parity:** อัปเดตรองรับทั้ง 8 มินิลีกในระบบ (5349, 38491, 40700, 187827, 438691, 567387, 675290, 1101958, index.html, preview.html, 404.html), รองรับ 2 ภาษา (TH/EN 100% ไม่ปนกัน) และ 2 โหมดสี (Light/Dark Mode) ผ่านการตรวจสอบ Headless Chrome 0 runtime errors ครบทุกหน้า.
   * **Impeccable Technical Audit & A11y Polish (19/20 Score):** ผ่านการตรวจประเมินคุณภาพตามมาตรฐาน Impeccable ทั้ง 5 มิติ (Accessibility, Performance, Theming, Responsive, Implementation Integrity) พร้อมเพิ่ม `aria-label` แจ้งเตือนการเปิดหน้าต่างใหม่ของปุ่ม LINE สองภาษา, เพิ่ม `aria-hidden="true"` ให้ SVG ตกแต่งทั้งหมด และใส่พรีฟิกซ์ `motion-safe:animate-pulse` เคารพการตั้งค่าลดการเคลื่อนไหวของผู้ใช้ตามมาตรฐาน WCAG 2.1 AA ครบถ้วน 100%.

---

## ⏪ 9. ระบบ Rollback & Milestone Management

โปรเจกต์นี้มีระบบจัดการเวอร์ชันย้อนหลังและจุดบันทึกการพัฒนา (Milestone) สำหรับเวลาเพิ่มทีม/ลีกใหม่:
* **ข้อตกลงการตั้งชื่อ (Naming Convention):** ใช้ชื่อ `rollback_(จำนวนทีมหรือลีก)` เช่น:
  * `rollback_2` : รองรับ 2 ลีก (40700, 675290)
  * `rollback_3` : รองรับ 3 ลีก (40700, 675290, 38491) พร้อมเสื้อแข่งจริงครบทุกสโมสร, ผังจัดทีม 4 ชั้น, และระบบ Quote-Safe
  * `rollback_4` : แก้ไขการแสดงผลอันดับเวลาค้นหาทีม
  * `rollback_5` : รองรับ 3 ลีกสมบูรณ์แบบ, คำนวณอันดับ Tied Rank, แบ่งเงินรางวัลแชมป์ร่วม, ปรับ UX ตารางมือถือไม่ล้นขอบ, และตัดปุ่มดินสอแก้ไขออก
  * `rollback_6` : ยกเลิก Inner Scroll + Sticky Header Table ทั้งหมด, เปลี่ยนหัวตาราง GAMEWEEK STANDING เป็น 'คะแนนดิบ' และ '(C)'
  * `rollback_14` : ปรับเปลี่ยนฟอนต์ของทั้งระบบเป็น Sarabun (Google Fonts + Local Fallback TTF)
  * `rollback_16` : รองรับ 8 ลีกสมบูรณ์แบบ (เพิ่มลีก 567387: Fantasy Nguan & friends cup ครบทั้งการวิเคราะห์สดและผังสนาม)
  * `rollback_17` : สร้างแท็บใหม่ "วิเคราะห์การย้ายตัว" แยกจาก "สถานะชิป", รองรับสถิติย้ายตัวประจำสัปดาห์ (Transfers In/Out & ROI), และทำความสะอาดภาษา ไทย/อังกฤษ 100% ไม่ปนกัน
  * `rollback_25` : ปรับปรุง UX/UI หน้าวิเคราะห์การย้ายตัว (Transfers Analytics) ตามมาตรฐาน Unslop และ Impeccable (Monochrome Palette, Interactive KPI Filters, Dynamic Live/Finished Mode, Mobile Segmented Control Zero Overflow และ Actionable Empty States)
  * `rollback_26` : ปรับปรุง UX/UI หน้า Dev Corner & สถาปัตยกรรมระบบ ตามมาตรฐาน Unslop และ Impeccable (Slate Neutral Ramp, Typographic Indexing 01-06, Dynamic Live/Settled Telemetry, Progressive Disclosure Specs, A11y ARIA 2 ภาษา และ motion-safe pulse ครบทั้ง 8 มินิลีก)
* **เครื่องมือนำทาง (`./rollback.sh`):**
  * ดูรายชื่อ rollback ทั้งหมด: `./rollback.sh list`
  * ย้ายไปยังเวอร์ชันที่ต้องการ: `./rollback.sh go <number>`
  * กลับมายังเวอร์ชันล่าสุด: `./rollback.sh main`
  * บันทึก milestone ใหม่: `./rollback.sh save <number>`

