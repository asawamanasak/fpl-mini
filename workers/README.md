# ⚡ FPLSaWaDiKa Cloudflare Worker — Real-Time Live Score Engine

ระบบดึงคะแนนสดวินาทีต่อวินาทีผ่าน **Cloudflare Workers Edge Network** (โควตาฟรี 100,000 ครั้ง/วัน) พร้อมระบบคำนวณ **Provisional Bonus (BPS)** รายคู่แข่งขัน และ **Smart Edge Caching**

---

## 🚀 จุดเด่นของสถาปัตยกรรม (Key Features)

1. **Parallel Edge Fetch (`Promise.all`):**
   ดึงข้อมูล `/api/event/{gw}/live/` และ `/api/fixtures/?event={gw}` จากเซิร์ฟเวอร์ FPL พร้อมกันที่โหนด Cloudflare Edge (เช่น `BKK` กรุงเทพฯ)
2. **Real-Time Provisional Bonus (BPS -> +3 / +2 / +1):**
   เมื่อการแข่งขันในคู่ใดผ่านนาทีที่ 60 (`minutes >= 60`) และทาง FPL ยังไม่ประกาศโบนัสทางการ (`bonus === 0`) Worker จะจัดอันดับแต้ม `bps` ในคู่นั้นและบวกโบนัสคาดการณ์ (`+3, +2, +1` ตามกติกา Tie-break ของ FPL แท้ 100%) เข้าไปในคะแนนสดทันที
3. **Slim Payload Optimization (`?slim=1`):**
   ตัดฟิลด์ข้อความและทศนิยมที่ไม่ได้ใช้งานของ FPL ออก ลดขนาดไฟล์ JSON จาก **~475 KB เหลือเพียง ~55 KB** (เล็กลงกว่า 85% โหลดไวระดับเสี้ยววินาทีบนมือถือ)
4. **Smart Edge Cache (15 วินาที):**
   แคชผลลัพธ์ไว้ที่ Cloudflare Edge นาน 15 วินาทีขณะมีบอลเตะ ต่อให้สมาชิกในลีกเปิดหน้าเว็บดูพร้อมกัน 500 คน ระบบจะยิงไปถาม FPL เพียง **4 ครั้งต่อนาที** (ใช้โควตาฟรีไม่ถึง 3% ต่อวัน)
5. **Force Refresh (`?force=1`):**
   รองรับการกดปุ่ม **"⚡ อัปเดตสดทันที"** บนหน้าเว็บ โดยมีระบบ Burst Protection 5 วินาทีป้องกันการยิงซ้ำถี่เกินไป

---

## 🛠️ วิธีอัปเดตโค้ดขึ้น Cloudflare Dashboard (ทำผ่านหน้าเว็บได้ทันทีใน 1 นาที)

### วิธีที่ 1: วางโค้ดผ่านหน้าเว็บ Cloudflare Dashboard (ง่ายที่สุด ไม่ต้องลงโปรแกรม)
1. เข้าไปที่ [Cloudflare Dashboard](https://dash.cloudflare.com/) -> เมนูซ้ายเลือก **Workers & Pages**
2. คลิกที่ Worker เดิมของคุณ (**`fpl-live-relay`**) หรือกด **Create application** -> **Create Worker**
3. กดปุ่ม **Edit code** (มุมขวาบน)
4. คัดลอกโค้ดทั้งหมดในไฟล์ [`workers/fpl-live-worker.js`](./fpl-live-worker.js) ไปวางทับในไฟล์ `worker.js` บนหน้าเว็บ แล้วกด **Deploy**
5. **(แนะนำ) ผูก Subdomain `api.fplsawadika.com`:**
   - ในหน้า Worker กดแท็บ **Settings** -> **Domains & Routes** -> กด **+ Add** -> เลือก **Custom Domain**
   - พิมพ์ **`api.fplsawadika.com`** แล้วกด **Add Custom Domain** (Cloudflare จะสร้าง DNS และ SSL ให้เองอัตโนมัติ)

### วิธีที่ 2: อัปเดตผ่านคำสั่ง Wrangler CLI (สำหรับรันผ่าน Terminal)
```bash
cd workers
npx wrangler deploy
```

---

## 🔗 รายการ Endpoints ที่รองรับ

* **ดึงคะแนนสด + โบนัส BPS + สถานะแมตช์ (Slim Mode):**
  `https://api.fplsawadika.com/live?event=9&slim=1`
  *(หรือ `https://fpl-live-relay.asawamanasak.workers.dev/?event=9&slim=1`)*
* **บังคับดึงข้อมูลสดใหม่ทันที (Manual Refresh):**
  `https://api.fplsawadika.com/live?event=9&slim=1&force=1`
* **ดึงเฉพาะสกอร์และเวลาการแข่งขันพรีเมียร์ลีกสด:**
  `https://api.fplsawadika.com/fixtures?event=9`
* **ตรวจสอบสถานะความพร้อมของ Edge Worker:**
  `https://api.fplsawadika.com/health`
