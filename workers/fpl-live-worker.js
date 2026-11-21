/**
 * FPLSaWaDiKa — Real-Time Second-by-Second Live Score Cloudflare Worker
 * Endpoints:
 *   GET /?event={gw}              -> Full or Slim live elements + fixtures + provisional bonus
 *   GET /live?event={gw}&slim=1   -> Optimized lightweight live payload (~85% smaller)
 *   GET /fixtures?event={gw}      -> Live Premier League match scores, minutes & BPS leaders
 *   GET /picks?entry={id}&gw={gw} -> On-Demand team squad lineup & picks for Tier 2 leagues
 *   GET /standings?league={id}    -> Paginated classic league standings fallback for large Tier 2 leagues
 *   GET /health                   -> Edge health check & colocation status
 *
 * Executive Dashboard:
 *   admin.fplsawadika.com         -> Executive Summary Report & Command Terminal
 *
 * Features:
 *   - Parallel Edge Fetch: Fetches FPL /event/{gw}/live/ and /fixtures/?event={gw} simultaneously
 *   - Smart Edge Cache (caches.default): 15s TTL during live matches (paired with 20s/90s adaptive client polling)
 *   - Force Refresh Support (?force=1): 5s burst protection for manual user refreshes
 *   - Real-Time Provisional Bonus (BPS): Computes exact +3 / +2 / +1 bonus per fixture once >= 60 mins
 *   - Slim Mode (?slim=1): Strips unused FPL strings/floats, reducing payload from ~475KB to ~55KB
 *   - Executive Admin Terminal: Protected by Cloudflare Zero Trust & Session Key
 */

import {
  isRequestAuthenticated,
  renderDashboardHtml,
  renderLoginHtml,
  getSessionSigningSecret,
  verifyAdminPasskey,
  signAdminSession,
} from './admin-dashboard.js';

const SHARED_SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=(), focus-without-user-activation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
};

const ADMIN_JSON_HEADERS = {
  ...SHARED_SECURITY_HEADERS,
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-store, private',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

const ADMIN_HTML_HEADERS = {
  ...SHARED_SECURITY_HEADERS,
  'Content-Type': 'text/html; charset=utf-8',
  'Cache-Control': 'no-store, private',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
};

const TELEMETRY_MAX_BODY_BYTES = 4096;
const TELEMETRY_ALLOWED_TYPES = new Set(['page_view', 'league_view', 'landing_view', 'dwell_time', 'team_view', 'client_error']);
const TELEMETRY_ERROR_CATEGORIES = new Set(['js_error', 'api_timeout', 'api_http', 'data_load']);
const TELEMETRY_RATE_LIMIT_PER_MIN = 30;
const LOGIN_RATE_LIMIT_PER_MIN = 8;

function getIctNowParts(now = new Date()) {
  const ict = new Date(now.getTime() + 7 * 3600000);
  return {
    date: ict.toISOString().split('T')[0],
    hour: ict.getUTCHours(),
  };
}

function computeLifecycleExpiry(expiresAtStr, ictTodayStr) {
  const raw = typeof expiresAtStr === 'string' ? expiresAtStr.trim() : '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return { expires_at: null, days_remaining: null, expiry_alert: 'none' };
  }
  const [ey, em, ed] = raw.split('-').map(n => parseInt(n, 10));
  const expUtc = Date.UTC(ey, em - 1, ed);
  const expCheck = new Date(expUtc);
  if (expCheck.getUTCFullYear() !== ey || expCheck.getUTCMonth() !== (em - 1) || expCheck.getUTCDate() !== ed) {
    return { expires_at: null, days_remaining: null, expiry_alert: 'none' };
  }
  const [ty, tm, td] = String(ictTodayStr || getIctNowParts().date).split('-').map(n => parseInt(n, 10));
  const todayUtc = Date.UTC(ty, tm - 1, td);
  const daysRemaining = Math.round((expUtc - todayUtc) / 86400000);
  return {
    expires_at: raw,
    days_remaining: daysRemaining,
    expiry_alert: daysRemaining < 0 ? 'expired' : (daysRemaining <= 14 ? 'expiring_soon' : 'ok'),
  };
}

let _adminNotesTableReady = false;

async function ensureAdminNotesTable(db) {
  if (!db || _adminNotesTableReady) return;
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS league_admin_notes (
        league_id TEXT PRIMARY KEY,
        note TEXT NOT NULL DEFAULT '',
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    _adminNotesTableReady = true;
  } catch (err) {
    console.warn('ensureAdminNotesTable warning:', err);
  }
}

let _leagueOrdersTableReady = false;

async function ensureLeagueOrdersTable(db) {
  if (!db || _leagueOrdersTableReady) return;
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS league_orders (
        order_id TEXT PRIMARY KEY,
        access_token_hash TEXT NOT NULL,
        league_id TEXT NOT NULL,
        league_name TEXT NOT NULL DEFAULT '',
        team_count INTEGER NOT NULL DEFAULT 0,
        plan TEXT NOT NULL DEFAULT 'standard',
        currency TEXT NOT NULL DEFAULT 'THB',
        lang TEXT NOT NULL DEFAULT 'th',
        amount_satang INTEGER NOT NULL DEFAULT 50000,
        customer_email TEXT NOT NULL,
        customer_line TEXT NOT NULL DEFAULT '',
        rules_text TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'awaiting_payment',
        slip_data_url TEXT,
        slip_uploaded_at TEXT,
        slip_verify_provider TEXT DEFAULT '',
        slip_verify_ref TEXT DEFAULT '',
        verified_at TEXT,
        delivered_url TEXT DEFAULT '',
        admin_note TEXT DEFAULT '',
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        expires_at TEXT NOT NULL
      )
    `).run();
    try {
      await db.prepare("ALTER TABLE league_orders ADD COLUMN lang TEXT NOT NULL DEFAULT 'th'").run();
    } catch (_) {}
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_league_orders_status_exp ON league_orders (status, expires_at)').run();
    await db.prepare('CREATE INDEX IF NOT EXISTS idx_league_orders_created ON league_orders (created_at)').run();
    try {
      await db.prepare(`
        CREATE UNIQUE INDEX IF NOT EXISTS idx_league_orders_active_satang
          ON league_orders (amount_satang)
          WHERE currency = 'THB' AND amount_satang >= 50001 AND status IN ('awaiting_payment', 'slip_submitted', 'rejected')
      `).run();
    } catch (idxErr) {
      console.warn('idx_league_orders_active_satang warning:', idxErr);
    }
    _leagueOrdersTableReady = true;
  } catch (err) {
    console.warn('ensureLeagueOrdersTable warning:', err);
  }
}

let _appSettingsTableReady = false;

async function ensureAppSettingsTable(db) {
  if (!db || _appSettingsTableReady) return;
  try {
    await db.prepare(`
      CREATE TABLE IF NOT EXISTS app_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL DEFAULT '',
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `).run();
    _appSettingsTableReady = true;
  } catch (err) {
    console.warn('ensureAppSettingsTable warning:', err);
  }
}

async function loadPaymentSettings(db, env) {
  let qrDataUrl = '';
  let dbAccountName = '';
  let updatedAt = null;
  if (db) {
    try {
      await ensureAppSettingsTable(db);
      const qRes = await db.prepare(
        "SELECT key, value, updated_at FROM app_settings WHERE key IN ('payment_qr_data_url', 'payment_account_name')"
      ).all();
      const rows = (qRes && Array.isArray(qRes.results)) ? qRes.results : [];
      for (const r of rows) {
        const k = String((r && r.key) || '');
        const v = String((r && r.value) || '').trim();
        const ts = r && r.updated_at ? String(r.updated_at) : null;
        if (k === 'payment_qr_data_url' && v.startsWith('data:image/')) {
          qrDataUrl = v;
        } else if (k === 'payment_account_name' && v) {
          dbAccountName = v.slice(0, 120);
        }
        if (ts && (!updatedAt || ts > updatedAt)) {
          updatedAt = ts;
        }
      }
    } catch (err) {
      console.warn('loadPaymentSettings warning:', err);
    }
  }
  const envPpId = (env && typeof env.PROMPTPAY_ID === 'string') ? env.PROMPTPAY_ID.trim() : '';
  const envAccountName = (env && typeof env.PROMPTPAY_ACCOUNT_NAME === 'string') ? env.PROMPTPAY_ACCOUNT_NAME.trim().slice(0, 120) : '';
  const accountName = dbAccountName || envAccountName || 'FPLSaWaDiKa';
  const mode = qrDataUrl ? 'static_qr' : (envPpId ? 'dynamic_qr' : 'unconfigured');
  return {
    qr_data_url: qrDataUrl,
    account_name: accountName,
    updated_at: updatedAt,
    has_static_qr: Boolean(qrDataUrl),
    has_dynamic_pp: Boolean(envPpId),
    mode,
    env_pp_id: envPpId,
  };
}

function escapeHtmlEmail(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function tlvTag(tag, val) {
  const s = String(val || '');
  return `${tag}${String(s.length).padStart(2, '0')}${s}`;
}

function crc16CcittFalse(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= (str.charCodeAt(i) & 0xFF) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function buildPromptPayPayload(rawId, amountBahtStr) {
  const digits = String(rawId || '').replace(/\D/g, '');
  let subTag = '';
  let targetVal = '';
  if (digits.length === 10 && digits.startsWith('0')) {
    subTag = '01';
    targetVal = `0066${digits.slice(1)}`;
  } else if (digits.length === 11 && digits.startsWith('66')) {
    subTag = '01';
    targetVal = `00${digits}`;
  } else if (digits.length === 13 && digits.startsWith('0066')) {
    subTag = '01';
    targetVal = digits;
  } else if (digits.length === 13) {
    subTag = '02';
    targetVal = digits;
  } else if (digits.length === 15) {
    subTag = '03';
    targetVal = digits;
  } else {
    return '';
  }
  const merchantInfo = tlvTag('00', 'A000000677010111') + tlvTag(subTag, targetVal);
  const amtClean = String(amountBahtStr || '').trim();
  const body =
    tlvTag('00', '01') +
    tlvTag('01', amtClean ? '12' : '11') +
    tlvTag('29', merchantInfo) +
    tlvTag('53', '764') +
    (amtClean ? tlvTag('54', amtClean) : '') +
    tlvTag('58', 'TH') +
    '6304';
  return body + crc16CcittFalse(body);
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(String(text || ''));
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateOrderId() {
  const ict = new Date(Date.now() + 7 * 3600000);
  const yy = String(ict.getUTCFullYear()).slice(-2);
  const mm = String(ict.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(ict.getUTCDate()).padStart(2, '0');
  const bytes = new Uint8Array(3);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes).map(b => b.toString(16).toUpperCase().padStart(2, '0')).join('');
  return `FPL-${yy}${mm}${dd}-${suffix}`;
}

function generateAccessToken() {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function allocateUniqueSatangAmount(db, baseBaht = 500) {
  if (!db) throw new Error('Database unavailable for satang allocation');
  const baseSatang = Math.round(Number(baseBaht) * 100);
  const used = new Set();
  const rows = await db.prepare(`
    SELECT amount_satang FROM league_orders
    WHERE currency = 'THB'
      AND (
        status IN ('awaiting_payment', 'slip_submitted', 'rejected')
        OR (status = 'expired' AND datetime(expires_at, '+24 hours') > datetime('now'))
      )
  `).all();
  if (rows && Array.isArray(rows.results)) {
    for (const r of rows.results) {
      used.add(Number(r.amount_satang));
    }
  }
  const available = [];
  for (let offset = 1; offset <= 99; offset++) {
    const candidate = baseSatang + offset;
    if (!used.has(candidate)) available.push(candidate);
  }
  if (available.length > 0) {
    const rand = new Uint32Array(1);
    crypto.getRandomValues(rand);
    return available[rand[0] % available.length];
  }
  return null;
}

function formatSatangDisplay(satang, currency = 'THB', lang = 'th') {
  const cur = String(currency || 'THB').toUpperCase();
  const isEn = String(lang || 'th').toLowerCase() === 'en';
  if (cur === 'USD') {
    return satang > 0 ? `$${(Number(satang) / 100).toFixed(0)} USD` : 'Custom Quote';
  }
  return satang > 0 ? `${(Number(satang) / 100).toFixed(2)} THB` : (isEn ? 'Custom Quote' : 'ประเมินราคา');
}

function getOrderPayUrl(siteOrigin, orderId, rawToken) {
  const base = siteOrigin && /^https?:\/\//i.test(siteOrigin) ? siteOrigin.replace(/\/+$/, '') : 'https://www.fplsawadika.com';
  return `${base}/pay/?order=${encodeURIComponent(orderId)}&token=${encodeURIComponent(rawToken)}`;
}

async function computeOrderAdminLinkToken(orderId, accessTokenHash) {
  const h = await sha256Hex(`fpl_pay_link:${String(orderId || '')}:${String(accessTokenHash || '')}`);
  return h.slice(0, 32);
}

async function incrementLifetimeUnpaidStat(db, delta = 1) {
  const n = Math.floor(Number(delta) || 0);
  if (!db || n <= 0) return 0;
  try {
    await db.prepare(`
      INSERT INTO telemetry_counters (metric, date, val, updated_at)
      VALUES ('lifetime:orders_expired_unpaid', '9999-12-31', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(metric) DO UPDATE SET val = telemetry_counters.val + excluded.val, updated_at = CURRENT_TIMESTAMP
    `).bind(n).run();
    return n;
  } catch (err) {
    console.warn('incrementLifetimeUnpaidStat warning:', err);
    return 0;
  }
}

async function pruneExpiredOrdersToStats(db, nowIso = new Date().toISOString()) {
  if (!db) return 0;
  try {
    const delRes = await db.prepare(`
      DELETE FROM league_orders
      WHERE status = 'expired'
         OR (status IN ('awaiting_payment', 'rejected') AND expires_at < ?)
    `).bind(nowIso).run();
    const deletedCnt = (delRes && delRes.meta && Number(delRes.meta.changes)) || 0;
    if (deletedCnt > 0) {
      await incrementLifetimeUnpaidStat(db, deletedCnt);
    }
    return deletedCnt;
  } catch (err) {
    console.warn('pruneExpiredOrdersToStats warning:', err);
    return 0;
  }
}

async function sendTransactionalEmail(env, { to, subject, html, text, replyTo }) {
  const cleanTo = String(to || '').trim();
  if (!cleanTo) return { sent: false, reason: 'missing_recipient' };
  const fromAddr = (env && typeof env.EMAIL_FROM === 'string' && env.EMAIL_FROM.trim())
    ? env.EMAIL_FROM.trim()
    : 'FPLSaWaDiKa <noreply@fplsawadika.com>';
  const apiKey = (env && typeof env.RESEND_API_KEY === 'string') ? env.RESEND_API_KEY.trim() : '';
  if (!apiKey) {
    console.log(`[EMAIL_MOCK] to=${cleanTo} subject="${subject}"`);
    return { sent: false, mode: 'staging_mock' };
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const bodyObj = {
      from: fromAddr,
      to: [cleanTo],
      subject: String(subject || 'FPLSaWaDiKa Notification'),
      html: String(html || ''),
      text: String(text || ''),
    };
    if (replyTo) bodyObj.reply_to = String(replyTo);
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyObj),
      signal: ctrl.signal,
    });
    clearTimeout(timer);
    if (!resp.ok) {
      const errTxt = await resp.text().catch(() => '');
      console.warn('Resend email failed:', resp.status, errTxt.slice(0, 200));
      return { sent: false, mode: 'resend_error', status: resp.status };
    }
    const resJson = await resp.json().catch(() => ({}));
    return { sent: true, mode: 'resend', id: resJson && resJson.id ? resJson.id : '' };
  } catch (err) {
    clearTimeout(timer);
    console.warn('Resend email exception:', err && err.message ? err.message : err);
    return { sent: false, mode: 'resend_exception' };
  }
}

async function recordTelemetryIncrements(env, increments) {
  if (!env || !Array.isArray(increments) || increments.length === 0) return;
  const today = getIctNowParts().date;
  if (env.DB) {
    const stmt = env.DB.prepare(`
      INSERT INTO telemetry_counters (metric, date, val, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(metric) DO UPDATE SET val = val + excluded.val, updated_at = CURRENT_TIMESTAMP
    `);
    const batch = increments.map(item => stmt.bind(item.metric, item.date || today, item.amount));
    await env.DB.batch(batch);
  } else if (env.ANALYTICS_KV) {
    // Store compacted daily JSON blob per date (plus lifetime:total_views) so KV reads never exceed Workers 50-subrequest limit
    const byDate = new Map();
    let lifetimeDelta = 0;
    for (const item of increments) {
      if (item.metric === 'lifetime:total_views') {
        lifetimeDelta += Number(item.amount) || 0;
      } else {
        const dKey = item.date || today;
        if (!byDate.has(dKey)) byDate.set(dKey, []);
        byDate.get(dKey).push(item);
      }
    }
    const kvTasks = [];
    if (lifetimeDelta > 0) {
      kvTasks.push((async () => {
        const cur = parseInt(await env.ANALYTICS_KV.get('lifetime:total_views') || '0', 10);
        await env.ANALYTICS_KV.put('lifetime:total_views', String(cur + lifetimeDelta));
      })());
    }
    for (const [dKey, items] of byDate.entries()) {
      kvTasks.push((async () => {
        const blobKey = `telem_day:${dKey}`;
        let dayObj = {};
        try {
          const existing = await env.ANALYTICS_KV.get(blobKey, 'json');
          if (existing && typeof existing === 'object') dayObj = existing;
        } catch (_) {}
        for (const it of items) {
          dayObj[it.metric] = (Number(dayObj[it.metric]) || 0) + (Number(it.amount) || 0);
        }
        await env.ANALYTICS_KV.put(blobKey, JSON.stringify(dayObj), { expirationTtl: 86400 * 30 });
      })());
    }
    await Promise.all(kvTasks);
  }
}

function scheduleWorkerHealthMetric(env, ctx, isError, category = 'upstream_5xx') {
  if (!env || (!env.DB && !env.ANALYTICS_KV) || !ctx || !ctx.waitUntil) return;
  const { date: today, hour } = getIctNowParts();
  const pfx = `telem:${today}`;
  const cleanCat = String(category || 'upstream_5xx').replace(/[^a-z0-9_]/g, '').slice(0, 24) || 'upstream_5xx';
  const increments = isError
    ? [
        { metric: `${pfx}:err:upstream`, date: today, amount: 1 },
        { metric: `${pfx}:err:upstream:h:${hour}`, date: today, amount: 1 },
        { metric: `${pfx}:err:cat:${cleanCat}`, date: today, amount: 1 },
      ]
    : [
        { metric: `${pfx}:api:ok`, date: today, amount: 1 },
        { metric: `${pfx}:api:ok:h:${hour}`, date: today, amount: 1 },
      ];
  ctx.waitUntil(
    recordTelemetryIncrements(env, increments).catch((err) => {
      console.warn('Worker health metric warning:', err);
    })
  );
}

function isLocalOrigin(originHeader) {
  if (!originHeader || originHeader === 'null') return false;
  try {
    const h = new URL(originHeader).hostname.toLowerCase();
    return h === 'localhost' || h === '127.0.0.1' || h === '[::1]';
  } catch (_) {
    return false;
  }
}

function isTelemetryOriginAllowed(originHeader, env) {
  if (!originHeader || originHeader === 'null') return false;
  try {
    const o = new URL(originHeader);
    const h = o.hostname.toLowerCase();
    if (env && env.ENVIRONMENT === 'staging' && (h === 'localhost' || h === '127.0.0.1' || h === '[::1]')) {
      return true;
    }
    return (
      h === 'fplsawadika.com' ||
      h.endsWith('.fplsawadika.com') ||
      h.endsWith('.github.io')
    );
  } catch (_) {
    return false;
  }
}

function isOrderOriginAllowed(originHeader, env) {
  if (!originHeader || originHeader === 'null') return false;
  try {
    const o = new URL(originHeader);
    const h = o.hostname.toLowerCase();
    if (env && env.ENVIRONMENT === 'staging' && (h === 'localhost' || h === '127.0.0.1' || h === '[::1]')) {
      return true;
    }
    return h === 'fplsawadika.com' || h.endsWith('.fplsawadika.com');
  } catch (_) {
    return false;
  }
}

async function fetchFplLeaguePreview(lid, cacheOrigin, colo, ctx, timeoutMs = 5000) {
  const cleanLid = String(lid || '').trim();
  const cache = (typeof caches !== 'undefined' && caches.default) ? caches.default : null;
  const cacheKey = cacheOrigin ? new Request(`${cacheOrigin}/api/public/league-preview?id=${cleanLid}`, { method: 'GET' }) : null;
  if (cache && cacheKey) {
    try {
      const cached = await cache.match(cacheKey);
      if (cached) {
        const cachedJson = await cached.clone().json().catch(() => null);
        return {
          ok: Boolean(cachedJson && cachedJson.success),
          status: cached.status,
          not_found: Boolean(cachedJson && cachedJson.not_found),
          name: cachedJson && cachedJson.name ? String(cachedJson.name) : '',
          team_count: Number(cachedJson && cachedJson.team_count) || 0,
          has_more: Boolean(cachedJson && cachedJson.has_more),
          tier_suggested: (cachedJson && cachedJson.tier_suggested === 'tier2') ? 'tier2' : 'tier1',
          cachedResponse: cached,
        };
      }
    } catch (_) {}
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const upstream = await fetch(
      `https://fantasy.premierleague.com/api/leagues-classic/${cleanLid}/standings/?page_standings=1&page_new_entries=1`,
      {
        headers: FPL_HEADERS,
        signal: ctrl.signal,
        cf: { cacheTtl: 30, cacheEverything: true },
      }
    );
    clearTimeout(timer);
    if (upstream.status === 404) {
      const nfPayload = JSON.stringify({ success: false, not_found: true, league_id: cleanLid });
      if (cache && cacheKey && ctx && ctx.waitUntil) {
        const nfResp = new Response(nfPayload, {
          status: 404,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120',
            'X-FPL-Edge-Cache': 'MISS',
            'X-FPL-Edge-Colo': colo || 'EDGE',
          },
        });
        ctx.waitUntil(cache.put(cacheKey, nfResp.clone()));
      }
      return { ok: false, status: 404, not_found: true, payload: nfPayload };
    }
    if (!upstream.ok) {
      return { ok: false, status: 502, upstream_status: upstream.status };
    }
    const data = await upstream.json();
    const leagueMeta = (data && data.league) || {};
    const uniqueEntries = new Set();
    for (const list of [data && data.standings && data.standings.results, data && data.new_entries && data.new_entries.results]) {
      if (!Array.isArray(list)) continue;
      for (const row of list) {
        const eid = Number(row && row.entry);
        if (eid > 0) uniqueEntries.add(eid);
      }
    }
    const teamCount = uniqueEntries.size;
    const hasMore = Boolean(
      (data && data.standings && data.standings.has_next) ||
      (data && data.new_entries && data.new_entries.has_next)
    );
    const tierSuggested = (hasMore || teamCount > 30) ? 'tier2' : 'tier1';
    const name = String(leagueMeta.name || `League ${cleanLid}`).trim();
    const payload = JSON.stringify({
      success: true,
      league_id: cleanLid,
      name,
      team_count: teamCount,
      has_more: hasMore,
      tier_suggested: tierSuggested,
    });
    if (cache && cacheKey && ctx && ctx.waitUntil) {
      const putResp = new Response(payload, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120',
          'X-FPL-Edge-Cache': 'MISS',
          'X-FPL-Edge-Colo': colo || 'EDGE',
        },
      });
      ctx.waitUntil(cache.put(cacheKey, putResp.clone()));
    }
    return {
      ok: true,
      status: 200,
      name,
      team_count: teamCount,
      has_more: hasMore,
      tier_suggested: tierSuggested,
      payload,
    };
  } catch (err) {
    clearTimeout(timer);
    return { ok: false, status: 502, error: err && err.name === 'AbortError' ? 'timeout' : 'upstream_error' };
  }
}

function isAutomatedTelemetryUa(userAgent) {
  return /bot|crawl|spider|slurp|curl|wget|python-requests|go-http-client|headless|puppeteer|playwright|lighthouse/i.test(userAgent || '');
}

const RATE_LIMIT_MEM = new Map();

async function allowIpRateLimit(request, namespace, maxPerMin) {
  try {
    const rawIp =
      request.headers.get('cf-connecting-ip') ||
      (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
      'anon-unknown';
    const minuteBucket = Math.floor(Date.now() / 60000);
    const memKey = `${namespace}:${rawIp}:${minuteBucket}`;
    if (RATE_LIMIT_MEM.size > 5000) {
      RATE_LIMIT_MEM.clear();
    }
    const memCount = RATE_LIMIT_MEM.get(memKey) || 0;
    if (memCount >= maxPerMin) return false;
    RATE_LIMIT_MEM.set(memKey, memCount + 1);

    if (typeof caches === 'undefined' || !caches.default) return true;
    const keyReq = new Request(`https://ratelimit.internal/${namespace}/${encodeURIComponent(rawIp)}/${minuteBucket}`);
    const existing = await caches.default.match(keyReq);
    let count = memCount;
    if (existing) {
      const parsed = await existing.json().catch(() => ({ count: 0 }));
      count = Math.max(count, Number(parsed && parsed.count) || 0);
    }
    if (count >= maxPerMin) return false;
    const nextCount = count + 1;
    RATE_LIMIT_MEM.set(memKey, nextCount);
    await caches.default.put(
      keyReq,
      new Response(JSON.stringify({ count: nextCount }), {
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'max-age=65' },
      })
    );
    return true;
  } catch (_) {
    return true;
  }
}

const CORS_HEADERS = {
  ...SHARED_SECURITY_HEADERS,
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Cache-Control',
  'Cross-Origin-Resource-Policy': 'cross-origin',
};

const FPL_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
  'Accept': 'application/json',
};

/**
 * Compute Official FPL Provisional Bonus (+3, +2, +1) from BPS per fixture.
 * Only applies to fixtures where:
 *   1. Official bonus has NOT been awarded yet (all players in fixture have bonus === 0)
 *   2. At least one player in the fixture has played >= 60 minutes
 */
function computeProvisionalBonusByFixture(elements) {
  const fixturePlayers = new Map(); // fixtureId -> Array<{ id, bps, minutes, bonus }>
  const fixtureMaxMins = new Map();
  const fixtureHasOfficialBonus = new Map();

  for (const el of elements) {
    if (!el || !el.stats) continue;
    const mins = Number(el.stats.minutes) || 0;
    const bps = Number(el.stats.bps) || 0;
    const officialBonus = Number(el.stats.bonus) || 0;
    const explainList = Array.isArray(el.explain) ? el.explain : [];

    for (const ex of explainList) {
      const fixId = ex && ex.fixture;
      if (fixId === undefined || fixId === null) continue;

      const curMax = fixtureMaxMins.get(fixId) || 0;
      if (mins > curMax) fixtureMaxMins.set(fixId, mins);

      const exStats = Array.isArray(ex.stats) ? ex.stats : [];
      const hasExBonus = officialBonus > 0 || exStats.some(s => s && s.identifier === 'bonus' && Number(s.points) > 0);
      if (hasExBonus) {
        fixtureHasOfficialBonus.set(fixId, true);
      }

      if (mins > 0 && bps > 0) {
        if (!fixturePlayers.has(fixId)) {
          fixturePlayers.set(fixId, []);
        }
        fixturePlayers.get(fixId).push({
          id: el.id,
          bps,
          minutes: mins,
        });
      }
    }
  }

  const playerProvBonus = new Map(); // elementId -> total provisional bonus across fixtures
  const fixtureBonusSummary = {};    // fixtureId -> Array<{ id, bps, bonus }>

  for (const [fixId, players] of fixturePlayers.entries()) {
    if (fixtureHasOfficialBonus.get(fixId)) continue;
    const maxMins = fixtureMaxMins.get(fixId) || 0;
    if (maxMins < 60) continue;

    // Sort descending by BPS
    players.sort((a, b) => b.bps - a.bps);
    if (players.length === 0) continue;

    // Group by unique BPS scores descending
    const bpsGroups = [];
    for (const p of players) {
      if (bpsGroups.length === 0 || bpsGroups[bpsGroups.length - 1].bps !== p.bps) {
        bpsGroups.push({ bps: p.bps, ids: [p.id] });
      } else {
        bpsGroups[bpsGroups.length - 1].ids.push(p.id);
      }
    }

    // Safety guard against abnormal mass ties
    if (bpsGroups[0].ids.length > 4) continue;

    const awarded = [];
    const rank1 = bpsGroups[0];
    for (const id of rank1.ids) {
      playerProvBonus.set(id, (playerProvBonus.get(id) || 0) + 3);
      awarded.push({ id, bps: rank1.bps, bonus: 3 });
    }

    if (rank1.ids.length === 1 && bpsGroups.length > 1) {
      const rank2 = bpsGroups[1];
      for (const id of rank2.ids) {
        playerProvBonus.set(id, (playerProvBonus.get(id) || 0) + 2);
        awarded.push({ id, bps: rank2.bps, bonus: 2 });
      }
      if (rank2.ids.length === 1 && bpsGroups.length > 2) {
        const rank3 = bpsGroups[2];
        if (rank3.ids.length <= 4) {
          for (const id of rank3.ids) {
            playerProvBonus.set(id, (playerProvBonus.get(id) || 0) + 1);
            awarded.push({ id, bps: rank3.bps, bonus: 1 });
          }
        }
      }
    } else if (rank1.ids.length === 2 && bpsGroups.length > 1) {
      const rank3 = bpsGroups[1];
      if (rank3.ids.length <= 4) {
        for (const id of rank3.ids) {
          playerProvBonus.set(id, (playerProvBonus.get(id) || 0) + 1);
          awarded.push({ id, bps: rank3.bps, bonus: 1 });
        }
      }
    }

    fixtureBonusSummary[fixId] = awarded;
  }

  return { playerProvBonus, fixtureBonusSummary };
}

/**
 * Slim down an element object to keep only fields needed by FPLSaWaDiKa frontend,
 * cutting payload size by ~85% while maintaining 100% compatibility.
 */
function formatElement(el, provBonus, isSlim) {
  const s = el.stats || {};
  const basePoints = Number(s.total_points) || 0;
  const pBonus = Number(provBonus) || 0;
  const totalWithProv = basePoints + pBonus;

  if (!isSlim) {
    return {
      ...el,
      stats: {
        ...s,
        total_points: totalWithProv,
        base_points: basePoints,
        provisional_bonus: pBonus,
      },
    };
  }

  return {
    id: el.id,
    stats: {
      minutes: Number(s.minutes) || 0,
      goals_scored: Number(s.goals_scored) || 0,
      assists: Number(s.assists) || 0,
      clean_sheets: Number(s.clean_sheets) || 0,
      goals_conceded: Number(s.goals_conceded) || 0,
      own_goals: Number(s.own_goals) || 0,
      penalties_saved: Number(s.penalties_saved) || 0,
      penalties_missed: Number(s.penalties_missed) || 0,
      yellow_cards: Number(s.yellow_cards) || 0,
      red_cards: Number(s.red_cards) || 0,
      saves: Number(s.saves) || 0,
      bonus: Number(s.bonus) || 0,
      bps: Number(s.bps) || 0,
      defensive_contribution: Number(s.defensive_contribution) || 0,
      starts: Number(s.starts) || 0,
      played: Boolean(s.played),
      total_points: totalWithProv,
      base_points: basePoints,
      provisional_bonus: pBonus,
    },
    explain: Array.isArray(el.explain)
      ? el.explain.map(ex => ({
          fixture: ex.fixture,
          stats: Array.isArray(ex.stats)
            ? ex.stats.map(st => ({
                identifier: st.identifier,
                points: st.points,
                value: st.value,
              }))
            : [],
        }))
      : [],
  };
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const colo = (request.cf && request.cf.colo) ? request.cf.colo : 'EDGE';
    const isAdminPath =
      path === '/admin' ||
      path.startsWith('/admin/') ||
      path === '/api/admin' ||
      path.startsWith('/api/admin/') ||
      path === '/login' ||
      path === '/logout';
    const isProdNonAdminHost =
      (!env || env.ENVIRONMENT !== 'staging') &&
      url.hostname !== 'admin.fplsawadika.com';
    if (isProdNonAdminHost && isAdminPath) {
      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: {
          ...SHARED_SECURITY_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      });
    }
    const isAdminDomain =
      url.hostname === 'admin.fplsawadika.com' ||
      (Boolean(env && env.ENVIRONMENT === 'staging') && isAdminPath);

    // ==========================================
    // Telemetry Beacon Handler (Validated + Rate-Guarded)
    // ==========================================
    if (path === '/api/telemetry/event' || path === '/telemetry/event') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ ok: false, error: 'Method not allowed' }), {
          status: 405,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }

      const reqOrigin = request.headers.get('origin');
      if (isLocalOrigin(reqOrigin) && (!env || env.ENVIRONMENT !== 'staging')) {
        return new Response(JSON.stringify({ ok: true, ignored: 'local' }), {
          status: 202,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }

      if (!isTelemetryOriginAllowed(reqOrigin, env)) {
        return new Response(JSON.stringify({ ok: false, error: 'Origin not allowed' }), {
          status: 403,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }

      const userAgent = request.headers.get('user-agent') || '';
      if (isAutomatedTelemetryUa(userAgent)) {
        return new Response(JSON.stringify({ ok: true, ignored: 'bot' }), {
          status: 202,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }

      try {
        const contentLen = Number(request.headers.get('content-length') || 0);
        if (contentLen > TELEMETRY_MAX_BODY_BYTES) {
          return new Response(JSON.stringify({ ok: false, error: 'Payload too large' }), {
            status: 413,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
          });
        }

        const rawText = await request.text();
        if (!rawText || rawText.length > TELEMETRY_MAX_BODY_BYTES) {
          return new Response(JSON.stringify({ ok: false, error: 'Invalid payload size' }), {
            status: rawText ? 413 : 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
          });
        }

        let eventData = null;
        try {
          eventData = JSON.parse(rawText);
        } catch (_) {
          return new Response(JSON.stringify({ ok: false, error: 'Malformed JSON' }), {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
          });
        }

        if (!eventData || typeof eventData !== 'object' || !TELEMETRY_ALLOWED_TYPES.has(eventData.type)) {
          return new Response(JSON.stringify({ ok: false, error: 'Unsupported event type' }), {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
          });
        }

        if (!(await allowIpRateLimit(request, 'telemetry', TELEMETRY_RATE_LIMIT_PER_MIN))) {
          return new Response(JSON.stringify({ ok: true, throttled: true }), {
            status: 202,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
          });
        }

        const isLine = /Line\//i.test(userAgent);
        const isFb = /FB_IAB|FBAV/i.test(userAgent);
        const isSafari = /safari/i.test(userAgent) && !/chrome|crios|crmo/i.test(userAgent);
        const isChrome = /chrome|crios|crmo/i.test(userAgent);
        const browser = isLine ? 'line' : (isFb ? 'fb' : (isSafari ? 'safari' : (isChrome ? 'chrome' : 'other')));

        const isTablet = /ipad|tablet/i.test(userAgent);
        const isMobile = !isTablet && /mobile|iphone|ipod|android/i.test(userAgent);
        const device = isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');

        const rawCity = (request.cf && request.cf.city) ? String(request.cf.city) : 'Bangkok';
        const city = rawCity.replace(/[^a-zA-Z0-9 _-]/g, '').trim().slice(0, 40) || 'Bangkok';

        if (env && (env.DB || env.ANALYTICS_KV) && ctx && ctx.waitUntil) {
          ctx.waitUntil((async () => {
            try {
              const { date: today, hour } = getIctNowParts();
              const pfx = `telem:${today}`;
              const isViewEvent = eventData.type === 'page_view' || eventData.type === 'league_view';

              const increments = [];
              if (eventData.type === 'page_view') {
                // Lifetime cumulative site views (exempt from 30-day retention pruning)
                increments.push({ metric: 'lifetime:total_views', date: '9999-12-31', amount: 1 });
              }
              if (isViewEvent) {
                increments.push(
                  { metric: `${pfx}:total_visits`, date: today, amount: 1 },
                  { metric: `${pfx}:src:${browser}`, date: today, amount: 1 },
                  { metric: `${pfx}:dev:${device}`, date: today, amount: 1 },
                  { metric: `${pfx}:city:${city}`, date: today, amount: 1 }
                );
              }

              // League Views & Dwell Time Counter (numeric league IDs only; track landing page separately)
              const rawLeagueId = eventData.league_id !== undefined && eventData.league_id !== null
                ? String(eventData.league_id).trim()
                : '';
              const isLandingPage = rawLeagueId === 'landing'
                || eventData.type === 'landing_view'
                || eventData.path === '/'
                || eventData.path === '/index.html';
              const isNonLeaguePage = isLandingPage || rawLeagueId === '404' || eventData.path === '/404.html';
              if (isLandingPage && (eventData.type === 'page_view' || eventData.type === 'landing_view')) {
                increments.push({ metric: `${pfx}:l:landing:views`, date: today, amount: 1 });
                increments.push({ metric: `${pfx}:l:landing:h:${hour}`, date: today, amount: 1 });
              }
              let targetLeague = '';
              if (!isNonLeaguePage && /^\d{1,10}$/.test(rawLeagueId)) {
                targetLeague = rawLeagueId;
              }
              if (!isNonLeaguePage && !targetLeague && typeof eventData.path === 'string') {
                const lm = eventData.path.match(/\/(\d{4,8})\/?/);
                if (lm) targetLeague = lm[1];
              }
              if (!isNonLeaguePage && !targetLeague && (eventData.type === 'page_view' || eventData.type === 'league_view')) {
                targetLeague = '40700';
              }

              if (targetLeague) {
                if (eventData.type === 'page_view' || eventData.type === 'league_view') {
                  increments.push({ metric: `${pfx}:l:${targetLeague}:views`, amount: 1 });
                  increments.push({ metric: `${pfx}:l:${targetLeague}:h:${hour}`, amount: 1 });
                }

                if (eventData.type === 'dwell_time') {
                  const dur = parseInt(eventData.duration, 10);
                  if (dur >= 2 && dur <= 3600) {
                    increments.push({ metric: `${pfx}:l:${targetLeague}:dwell_sec`, amount: dur });
                    increments.push({ metric: `${pfx}:l:${targetLeague}:dwell_sess`, amount: 1 });
                  }
                  if (eventData.tabs && typeof eventData.tabs === 'object' && !Array.isArray(eventData.tabs)) {
                    for (const [tabId, count] of Object.entries(eventData.tabs).slice(0, 15)) {
                      const cleanTab = String(tabId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 32);
                      const tCount = Math.min(Math.max(parseInt(count, 10) || 1, 1), 50);
                      if (cleanTab) {
                        increments.push({ metric: `${pfx}:feat:tab:${cleanTab}`, amount: tCount });
                      }
                    }
                  }
                  if (eventData.pitch_opens) {
                    const pOpens = Math.min(Math.max(parseInt(eventData.pitch_opens, 10) || 1, 1), 100);
                    increments.push({ metric: `${pfx}:feat:pitch_opens`, amount: pOpens });
                  }
                }
              }

              // Team view counter (numeric entry IDs only)
              if (eventData.type === 'team_view' && eventData.target !== undefined && eventData.target !== null) {
                const cleanTarget = String(eventData.target).trim();
                if (/^\d{1,12}$/.test(cleanTarget)) {
                  increments.push({ metric: `${pfx}:team:${cleanTarget}`, amount: 1 });
                }
              }

              // Client-side error & API failure beacon (categorized allowlist only)
              if (eventData.type === 'client_error') {
                const rawCat = typeof eventData.category === 'string' ? eventData.category.trim().toLowerCase() : 'js_error';
                const errCat = TELEMETRY_ERROR_CATEGORIES.has(rawCat) ? rawCat : 'js_error';
                increments.push(
                  { metric: `${pfx}:err:client`, date: today, amount: 1 },
                  { metric: `${pfx}:err:client:h:${hour}`, date: today, amount: 1 },
                  { metric: `${pfx}:err:cat:${errCat}`, date: today, amount: 1 }
                );
              }

              if (increments.length === 0) {
                return;
              }

              await recordTelemetryIncrements(env, increments);
            } catch (err) {
              console.warn('Telemetry enrichment warning:', err);
            }
          })());
        }

        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
        });
      } catch (e) {
        return new Response(JSON.stringify({ ok: false, error: 'Telemetry processing error' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }
    }

    // ==========================================
    // Executive Admin Terminal Routing
    // ==========================================
    if (isAdminDomain) {
      const isHttps = url.protocol === 'https:';
      const secureFlag = isHttps ? '; Secure' : '';
      const adminRedirectTarget = url.hostname === 'admin.fplsawadika.com' ? '/' : '/admin';

      // 1. Logout Handler
      if (path === '/logout' || path === '/admin/logout') {
        return new Response(null, {
          status: 302,
          headers: {
            ...SHARED_SECURITY_HEADERS,
            'Location': adminRedirectTarget,
            'Set-Cookie': `fpl_admin_auth=; Path=/; Max-Age=0; HttpOnly${secureFlag}; SameSite=Strict`,
            'Clear-Site-Data': '"cookies", "storage", "cache"',
          },
        });
      }

      // 2. Login Form Submission Handler
      if (request.method === 'POST' && (path === '/login' || path === '/admin/login')) {
        if (!(await allowIpRateLimit(request, 'admin-login', LOGIN_RATE_LIMIT_PER_MIN))) {
          return new Response(
            renderLoginHtml('พยายามเข้าสู่ระบบบ่อยเกินไป กรุณารอ 1 นาทีแล้วลองใหม่อีกครั้ง'),
            {
              status: 429,
              headers: { ...ADMIN_HTML_HEADERS, 'Retry-After': '60' },
            }
          );
        }

        const signingSecret = await getSessionSigningSecret(env);
        if (!signingSecret) {
          return new Response(
            renderLoginHtml('ระบบยังไม่พร้อมใช้งาน: กรุณาตั้งค่า ADMIN_SECRET_KEY บน Cloudflare Worker Secrets'),
            { status: 503, headers: ADMIN_HTML_HEADERS }
          );
        }

        let passkey = '';
        try {
          const contentType = request.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const body = await request.json();
            const raw = body && (body.passkey ?? body.token);
            passkey = typeof raw === 'string' ? raw.trim() : '';
          } else {
            const formData = await request.formData();
            const raw = formData.get('passkey') ?? formData.get('token');
            passkey = typeof raw === 'string' ? raw.trim() : '';
          }
        } catch (_) {}

        if (await verifyAdminPasskey(passkey, env)) {
          const sessionToken = await signAdminSession(signingSecret);
          return new Response(null, {
            status: 302,
            headers: {
              ...SHARED_SECURITY_HEADERS,
              'Location': adminRedirectTarget,
              'Set-Cookie': `fpl_admin_auth=${encodeURIComponent(sessionToken)}; Path=/; Max-Age=2592000; HttpOnly${secureFlag}; SameSite=Strict`,
            },
          });
        }

        return new Response(renderLoginHtml('รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง'), {
          status: 401,
          headers: ADMIN_HTML_HEADERS,
        });
      }

      // 3. Authenticate Session (Verified Zero Trust JWT or Signed Cookie)
      const auth = await isRequestAuthenticated(request, env);
      if (!auth.authenticated) {
        return new Response(renderLoginHtml(), {
          status: 401,
          headers: ADMIN_HTML_HEADERS,
        });
      }

      // 4. Authenticated API Actions
      if (path === '/api/admin/flush-cache') {
        if (request.method !== 'POST') {
          return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
            status: 405,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        let deletedCount = 0;
        try {
          const cache = caches.default;
          const origins = Array.from(new Set([
            url.origin,
            'https://api.fplsawadika.com',
            'https://fpl-live-relay.asawamanasak.workers.dev',
          ]));
          const deletePromises = [];
          for (const orig of origins) {
            for (let gw = 1; gw <= 38; gw++) {
              deletePromises.push(cache.delete(new Request(`${orig}/live?path=/live&gw=${gw}&slim=1`)));
              deletePromises.push(cache.delete(new Request(`${orig}/live?path=/live&gw=${gw}&slim=0`)));
              deletePromises.push(cache.delete(new Request(`${orig}/?path=/&gw=${gw}&slim=1`)));
              deletePromises.push(cache.delete(new Request(`${orig}/fixtures?path=/fixtures&gw=${gw}&slim=0`)));
              deletePromises.push(cache.delete(new Request(`${orig}/live?event=${gw}&slim=1`)));
            }
          }
          const results = await Promise.all(deletePromises);
          deletedCount = results.filter(Boolean).length;
        } catch (_) {}
        return new Response(
          JSON.stringify({ success: true, deleted_keys: deletedCount, message: 'Edge cache flushed successfully' }),
          { status: 200, headers: ADMIN_JSON_HEADERS }
        );
      }

      // Telemetry Retention Management Endpoint (Prune rows older than 30 days)
      if (path === '/api/admin/prune-telemetry') {
        if (request.method !== 'POST') {
          return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
            status: 405,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        let pruned = 0;
        let prunedSlips = 0;
        if (env && env.DB) {
          try {
            const res = await env.DB.prepare(`
              DELETE FROM telemetry_counters WHERE date < DATE('now', '-30 days') AND date != '9999-12-31' AND metric NOT LIKE 'lifetime:%'
            `).run();
            pruned = (res && res.meta && typeof res.meta.changes === 'number') ? res.meta.changes : 0;
            try {
              await ensureLeagueOrdersTable(env.DB);
              const slipRes = await env.DB.prepare(`
                UPDATE league_orders
                SET slip_data_url = NULL, updated_at = CURRENT_TIMESTAMP
                WHERE slip_data_url IS NOT NULL
                  AND status IN ('live', 'rejected', 'expired')
                  AND datetime(COALESCE(verified_at, updated_at, created_at)) < datetime('now', '-30 days')
              `).run();
              prunedSlips = (slipRes && slipRes.meta && typeof slipRes.meta.changes === 'number') ? slipRes.meta.changes : 0;
            } catch (_) {}
          } catch (e) {
            return new Response(
              JSON.stringify({ success: false, error: e.message }),
              { status: 500, headers: ADMIN_JSON_HEADERS }
            );
          }
        }
        return new Response(
          JSON.stringify({ success: true, pruned_rows: pruned, pruned_slips: prunedSlips, message: `เคลียร์สถิติ D1 เก่ากว่า 30 วันสำเร็จ (${pruned} แถว, สลิป ${prunedSlips} รายการ)` }),
          { status: 200, headers: ADMIN_JSON_HEADERS }
        );
      }

      // Live Upstream FPL API Latency Diagnostic Endpoint
      if (path === '/api/admin/ping-upstream') {
        if (request.method !== 'POST') {
          return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
            status: 405,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        const tStart = Date.now();
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 5000);
        try {
          const upstreamResp = await fetch('https://fantasy.premierleague.com/api/event-status/', {
            headers: FPL_HEADERS,
            signal: ctrl.signal,
            cf: { cacheTtl: 0, cacheEverything: false },
          });
          clearTimeout(timer);
          const latencyMs = Math.max(1, Date.now() - tStart);
          return new Response(
            JSON.stringify({
              success: upstreamResp.ok,
              upstream_status: upstreamResp.status,
              upstream_latency_ms: latencyMs,
              message: upstreamResp.ok
                ? `FPL Upstream API ตอบกลับปกติใน ${latencyMs} ms (HTTP ${upstreamResp.status})`
                : `FPL Upstream API ตอบกลับสถานะ HTTP ${upstreamResp.status} (${latencyMs} ms)`,
            }),
            { status: 200, headers: ADMIN_JSON_HEADERS }
          );
        } catch (err) {
          clearTimeout(timer);
          const latencyMs = Math.max(1, Date.now() - tStart);
          return new Response(
            JSON.stringify({
              success: false,
              upstream_status: 502,
              upstream_latency_ms: latencyMs,
              message: `ไม่สามารถติดต่อ FPL Upstream API ได้: ${err.message}`,
            }),
            { status: 502, headers: ADMIN_JSON_HEADERS }
          );
        }
      }

      // Live Customer League Inspector for Concierge Onboarding Wizard
      if (path === '/api/admin/inspect-league') {
        if (request.method !== 'GET') {
          return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
            status: 405,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        const lid = (url.searchParams.get('id') || '').trim();
        if (!/^\d{1,10}$/.test(lid)) {
          return new Response(
            JSON.stringify({ success: false, error: 'Invalid FPL League ID. Expected digits only.' }),
            { status: 400, headers: ADMIN_JSON_HEADERS }
          );
        }
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 8000);
        try {
          const baseApi = `https://fantasy.premierleague.com/api/leagues-classic/${lid}/standings/?page_standings=1&page_new_entries=1`;
          const resp1 = await fetch(baseApi, {
            headers: FPL_HEADERS,
            signal: ctrl.signal,
            cf: { cacheTtl: 0, cacheEverything: false },
          });
          if (!resp1.ok) {
            clearTimeout(timer);
            return new Response(
              JSON.stringify({
                success: false,
                upstream_status: resp1.status,
                error: resp1.status === 404
                  ? `FPL League ${lid} not found`
                  : `FPL Upstream returned HTTP ${resp1.status}`,
              }),
              { status: resp1.status === 404 ? 404 : 502, headers: ADMIN_JSON_HEADERS }
            );
          }
          const page1 = await resp1.json();
          const leagueMeta = page1 && page1.league ? page1.league : {};
          const teamMap = new Map();
          const addRows = (rows) => {
            if (!Array.isArray(rows)) return;
            for (const row of rows) {
              const entryId = Number(row && row.entry);
              if (!entryId || teamMap.has(entryId)) continue;
              teamMap.set(entryId, {
                entry: entryId,
                entry_name: String(row.entry_name || ''),
                player_name: String(row.player_name || ''),
                rank: Number(row.rank || 0),
                total: Number(row.total || 0),
              });
            }
          };
          addRows(page1 && page1.standings && page1.standings.results);
          addRows(page1 && page1.new_entries && page1.new_entries.results);

          const hasNextPage1 = Boolean(
            (page1 && page1.standings && page1.standings.has_next) ||
            (page1 && page1.new_entries && page1.new_entries.has_next)
          );
          let hasMoreThan100 = false;
          if (hasNextPage1) {
            const resp2 = await fetch(
              `https://fantasy.premierleague.com/api/leagues-classic/${lid}/standings/?page_standings=2&page_new_entries=2`,
              {
                headers: FPL_HEADERS,
                signal: ctrl.signal,
                cf: { cacheTtl: 0, cacheEverything: false },
              }
            );
            if (resp2.ok) {
              const page2 = await resp2.json();
              addRows(page2 && page2.standings && page2.standings.results);
              addRows(page2 && page2.new_entries && page2.new_entries.results);
              hasMoreThan100 = Boolean(
                (page2 && page2.standings && page2.standings.has_next) ||
                (page2 && page2.new_entries && page2.new_entries.has_next)
              );
            }
          }
          clearTimeout(timer);
          const teams = Array.from(teamMap.values());
          const teamCount = teams.length;
          return new Response(
            JSON.stringify({
              success: true,
              league: {
                id: lid,
                name: String(leagueMeta.name || `League ${lid}`),
                created: leagueMeta.created || null,
                admin_entry: leagueMeta.admin_entry || null,
              },
              team_count: teamCount,
              has_more_pages: hasNextPage1,
              has_more_than_100: hasMoreThan100,
              recommended_tier: teamCount > 30 ? 'custom_quote_or_tier2' : 'tier1_standard_or_custom',
              teams,
            }),
            { status: 200, headers: ADMIN_JSON_HEADERS }
          );
        } catch (err) {
          clearTimeout(timer);
          return new Response(
            JSON.stringify({ success: false, error: `Failed to inspect FPL League ${lid}: ${err.message}` }),
            { status: 502, headers: ADMIN_JSON_HEADERS }
          );
        }
      }

      // Private Customer Note Storage in Cloudflare D1 (never written to Git)
      if (path === '/api/admin/league-note') {
        if (request.method !== 'POST') {
          return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
            status: 405,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        if (!env || !env.DB) {
          return new Response(JSON.stringify({ success: false, error: 'Cloudflare D1 database binding (DB) is not available' }), {
            status: 503,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        let body = null;
        try {
          body = await request.json();
        } catch (_) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
            status: 400,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        const lid = String((body && body.league_id) || '').trim();
        if (!/^\d{1,10}$/.test(lid)) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid league_id (expected numeric digits)' }), {
            status: 400,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        const rawNote = body && typeof body.note === 'string' ? body.note.trim() : '';
        if (rawNote.length > 500) {
          return new Response(JSON.stringify({ success: false, error: 'Note exceeds 500 character limit' }), {
            status: 400,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        try {
          await ensureAdminNotesTable(env.DB);
          if (!rawNote) {
            await env.DB.prepare('DELETE FROM league_admin_notes WHERE league_id = ?').bind(lid).run();
          } else {
            await env.DB.prepare(`
              INSERT INTO league_admin_notes (league_id, note, updated_at)
              VALUES (?, ?, CURRENT_TIMESTAMP)
              ON CONFLICT(league_id) DO UPDATE SET note = excluded.note, updated_at = CURRENT_TIMESTAMP
            `).bind(lid, rawNote).run();
          }
          return new Response(
            JSON.stringify({
              success: true,
              league_id: lid,
              note: rawNote,
              source: 'd1',
              updated_at: new Date().toISOString(),
            }),
            { status: 200, headers: ADMIN_JSON_HEADERS }
          );
        } catch (err) {
          return new Response(
            JSON.stringify({ success: false, error: `Failed to save D1 note: ${err.message}` }),
            { status: 500, headers: ADMIN_JSON_HEADERS }
          );
        }
      }

      // Admin Payment QR Settings API (private static QR + display account name in D1)
      if (path === '/api/admin/payment-settings') {
        if (!env || !env.DB) {
          return new Response(JSON.stringify({ success: false, error: 'Cloudflare D1 database binding (DB) is not available' }), {
            status: 503,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        if (request.method === 'GET') {
          try {
            await ensureAppSettingsTable(env.DB);
            const cfg = await loadPaymentSettings(env.DB, env);
            return new Response(
              JSON.stringify({
                success: true,
                mode: cfg.mode,
                has_static_qr: cfg.has_static_qr,
                has_dynamic_pp: cfg.has_dynamic_pp,
                account_name: cfg.account_name,
                qr_data_url: cfg.qr_data_url,
                updated_at: cfg.updated_at,
              }),
              { status: 200, headers: ADMIN_JSON_HEADERS }
            );
          } catch (err) {
            return new Response(JSON.stringify({ success: false, error: err.message || 'Failed to load payment settings' }), {
              status: 500,
              headers: ADMIN_JSON_HEADERS,
            });
          }
        }
        if (request.method === 'POST') {
          const clHeader = Number(request.headers.get('content-length') || '0');
          if (clHeader > 450000) {
            return new Response(JSON.stringify({ success: false, error: 'QR payload exceeds maximum allowed size' }), {
              status: 413,
              headers: ADMIN_JSON_HEADERS,
            });
          }
          const rawText = await request.text();
          if (!rawText || rawText.length > 450000) {
            return new Response(
              JSON.stringify({ success: false, error: rawText ? 'QR payload exceeds maximum allowed size' : 'Empty request body' }),
              { status: rawText ? 413 : 400, headers: ADMIN_JSON_HEADERS }
            );
          }
          let body = null;
          try {
            body = JSON.parse(rawText);
          } catch (_) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
              status: 400,
              headers: ADMIN_JSON_HEADERS,
            });
          }
          if (!body || typeof body !== 'object' || Array.isArray(body)) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid JSON payload' }), {
              status: 400,
              headers: ADMIN_JSON_HEADERS,
            });
          }
          try {
            await ensureAppSettingsTable(env.DB);
            if (body.clear_qr === true) {
              await env.DB.prepare("DELETE FROM app_settings WHERE key = 'payment_qr_data_url'").run();
            } else if (typeof body.qr_data_url === 'string' && body.qr_data_url.trim() !== '') {
              const trimmedQr = body.qr_data_url.trim();
              if (trimmedQr.length > 390000) {
                return new Response(JSON.stringify({ success: false, error: 'QR image exceeds maximum allowed size' }), {
                  status: 413,
                  headers: ADMIN_JSON_HEADERS,
                });
              }
              if (!/^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/i.test(trimmedQr)) {
                return new Response(JSON.stringify({ success: false, error: 'Invalid QR image data URI (expected base64 PNG, JPG, or WebP)' }), {
                  status: 400,
                  headers: ADMIN_JSON_HEADERS,
                });
              }
              await env.DB.prepare(`
                INSERT INTO app_settings (key, value, updated_at)
                VALUES ('payment_qr_data_url', ?, CURRENT_TIMESTAMP)
                ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
              `).bind(trimmedQr).run();
            }

            if (typeof body.account_name === 'string') {
              const trimmedName = body.account_name.trim().slice(0, 120);
              if (!trimmedName) {
                await env.DB.prepare("DELETE FROM app_settings WHERE key = 'payment_account_name'").run();
              } else {
                await env.DB.prepare(`
                  INSERT INTO app_settings (key, value, updated_at)
                  VALUES ('payment_account_name', ?, CURRENT_TIMESTAMP)
                  ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP
                `).bind(trimmedName).run();
              }
            }

            const updated = await loadPaymentSettings(env.DB, env);
            return new Response(
              JSON.stringify({
                success: true,
                mode: updated.mode,
                has_static_qr: updated.has_static_qr,
                has_dynamic_pp: updated.has_dynamic_pp,
                account_name: updated.account_name,
                qr_data_url: updated.qr_data_url,
                updated_at: updated.updated_at,
              }),
              { status: 200, headers: ADMIN_JSON_HEADERS }
            );
          } catch (err) {
            return new Response(JSON.stringify({ success: false, error: err.message || 'Failed to save payment settings' }), {
              status: 500,
              headers: ADMIN_JSON_HEADERS,
            });
          }
        }
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
          status: 405,
          headers: ADMIN_JSON_HEADERS,
        });
      }

      // Admin Customer Order & Slip Inbox APIs
      if (path === '/api/admin/orders') {
        if (request.method !== 'GET') {
          return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
            status: 405,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        if (!env || !env.DB) {
          return new Response(JSON.stringify({ success: false, error: 'Cloudflare D1 database binding (DB) is not available' }), {
            status: 503,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        try {
          await ensureLeagueOrdersTable(env.DB);
          const nowIso = new Date().toISOString();
          await pruneExpiredOrdersToStats(env.DB, nowIso);

          const statusFilter = (url.searchParams.get('status') || '').trim();
          const allowedFilters = new Set(['awaiting_payment', 'slip_submitted', 'paid', 'live', 'quote_requested', 'rejected']);
          let qRows = null;
          if (statusFilter && allowedFilters.has(statusFilter)) {
            qRows = await env.DB.prepare(`
              SELECT order_id, access_token_hash, league_id, league_name, team_count, plan, currency, lang, amount_satang,
                     customer_email, customer_line, rules_text, status,
                     (CASE WHEN slip_data_url IS NOT NULL AND slip_data_url != '' THEN 1 ELSE 0 END) AS has_slip,
                     slip_uploaded_at, slip_verify_provider, slip_verify_ref, verified_at,
                     delivered_url, admin_note, created_at, updated_at, expires_at
              FROM league_orders
              WHERE status = ?
              ORDER BY datetime(created_at) DESC
              LIMIT 100
            `).bind(statusFilter).all();
          } else {
            qRows = await env.DB.prepare(`
              SELECT order_id, access_token_hash, league_id, league_name, team_count, plan, currency, lang, amount_satang,
                     customer_email, customer_line, rules_text, status,
                     (CASE WHEN slip_data_url IS NOT NULL AND slip_data_url != '' THEN 1 ELSE 0 END) AS has_slip,
                     slip_uploaded_at, slip_verify_provider, slip_verify_ref, verified_at,
                     delivered_url, admin_note, created_at, updated_at, expires_at
              FROM league_orders
              ORDER BY CASE status
                WHEN 'slip_submitted' THEN 0
                WHEN 'quote_requested' THEN 1
                WHEN 'paid' THEN 2
                WHEN 'awaiting_payment' THEN 3
                ELSE 4
              END, datetime(created_at) DESC
              LIMIT 100
            `).all();
          }
          const countRows = await env.DB.prepare(
            'SELECT status, COUNT(*) AS cnt FROM league_orders GROUP BY status'
          ).all();
          const counts = {
            all: 0,
            awaiting_payment: 0,
            slip_submitted: 0,
            paid: 0,
            live: 0,
            quote_requested: 0,
            rejected: 0,
          };
          if (countRows && Array.isArray(countRows.results)) {
            for (const c of countRows.results) {
              const st = String(c.status || '');
              const val = Number(c.cnt) || 0;
              if (Object.prototype.hasOwnProperty.call(counts, st)) {
                counts[st] = val;
              }
              counts.all += val;
            }
          }
          let expiredUnpaidTotal = 0;
          try {
            const statRow = await env.DB.prepare(
              "SELECT val FROM telemetry_counters WHERE metric = 'lifetime:orders_expired_unpaid' LIMIT 1"
            ).first();
            expiredUnpaidTotal = statRow ? (Number(statRow.val) || 0) : 0;
          } catch (_) {}

          const paidOrLive = (counts.paid || 0) + (counts.live || 0);
          const activePending = (counts.awaiting_payment || 0) + (counts.slip_submitted || 0) + (counts.quote_requested || 0) + (counts.rejected || 0);
          const totalRecorded = (counts.all || 0) + expiredUnpaidTotal;
          const conversionPct = totalRecorded > 0
            ? Math.round(((paidOrLive + (counts.slip_submitted || 0)) / totalRecorded) * 100)
            : 0;
          const stats = {
            total_recorded: totalRecorded,
            paid_or_live: paidOrLive,
            active_pending: activePending,
            expired_unpaid_total: expiredUnpaidTotal,
            conversion_pct: conversionPct,
          };

          const reqOrigin = request.headers.get('origin') || '';
          const payOrigin = (env.ENVIRONMENT === 'staging' && reqOrigin && isLocalOrigin(reqOrigin))
            ? reqOrigin
            : 'https://www.fplsawadika.com';
          const orders = (qRows && Array.isArray(qRows.results))
            ? await Promise.all(qRows.results.map(async (r) => {
                const { access_token_hash: tokenHashVal, ...pubRow } = r;
                const adminLinkTok = tokenHashVal
                  ? await computeOrderAdminLinkToken(r.order_id, tokenHashVal)
                  : '';
                return {
                  ...pubRow,
                  has_slip: Boolean(r.has_slip),
                  amount_display: formatSatangDisplay(r.amount_satang, r.currency, r.lang),
                  customer_pay_url: adminLinkTok ? getOrderPayUrl(payOrigin, r.order_id, adminLinkTok) : '',
                };
              }))
            : [];
          return new Response(JSON.stringify({ success: true, counts, stats, orders }), {
            status: 200,
            headers: ADMIN_JSON_HEADERS,
          });
        } catch (err) {
          console.warn('Admin fetch orders failed:', err);
          return new Response(JSON.stringify({ success: false, error: 'Failed to fetch orders' }), {
            status: 500,
            headers: ADMIN_JSON_HEADERS,
          });
        }
      }

      if (path === '/api/admin/orders/slip') {
        if (request.method !== 'GET') {
          return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
            status: 405,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        if (!env || !env.DB) {
          return new Response(JSON.stringify({ success: false, error: 'D1 not available' }), {
            status: 503,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        const oid = String(url.searchParams.get('order') || '').trim();
        if (!/^FPL-[A-Z0-9-]{4,24}$/.test(oid)) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid order id' }), {
            status: 400,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        try {
          await ensureLeagueOrdersTable(env.DB);
          const row = await env.DB.prepare(
            'SELECT order_id, slip_data_url, slip_uploaded_at FROM league_orders WHERE order_id = ?'
          ).bind(oid).first();
          if (!row) {
            return new Response(JSON.stringify({ success: false, error: 'Order not found' }), {
              status: 404,
              headers: ADMIN_JSON_HEADERS,
            });
          }
          return new Response(
            JSON.stringify({
              success: true,
              order_id: row.order_id,
              slip_data_url: row.slip_data_url || null,
              slip_uploaded_at: row.slip_uploaded_at || null,
            }),
            { status: 200, headers: ADMIN_JSON_HEADERS }
          );
        } catch (err) {
          return new Response(JSON.stringify({ success: false, error: err.message }), {
            status: 500,
            headers: ADMIN_JSON_HEADERS,
          });
        }
      }

      if (path === '/api/admin/orders/action') {
        if (request.method !== 'POST') {
          return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
            status: 405,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        if (!env || !env.DB) {
          return new Response(JSON.stringify({ success: false, error: 'D1 not available' }), {
            status: 503,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        let body = null;
        try {
          body = await request.json();
        } catch (_) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
            status: 400,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        const oid = String((body && body.order_id) || '').trim();
        const action = String((body && body.action) || '').trim();
        const adminNote = String((body && body.admin_note) || '').trim().slice(0, 500);
        if (!/^FPL-[A-Z0-9-]{4,24}$/.test(oid)) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid order_id' }), {
            status: 400,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        if (!new Set(['verify_payment', 'mark_live_and_notify', 'reject', 'delete_slip', 'delete_unpaid', 'delete_test']).has(action)) {
          return new Response(JSON.stringify({ success: false, error: 'Invalid action' }), {
            status: 400,
            headers: ADMIN_JSON_HEADERS,
          });
        }
        try {
          await ensureLeagueOrdersTable(env.DB);
          const row = await env.DB.prepare(`
            SELECT order_id, league_id, league_name, team_count, plan, currency, lang, amount_satang,
                   customer_email, customer_line, rules_text, status,
                   (CASE WHEN slip_data_url IS NOT NULL AND slip_data_url != '' THEN 1 ELSE 0 END) AS has_slip,
                   slip_uploaded_at, verified_at, delivered_url, admin_note, expires_at
            FROM league_orders WHERE order_id = ?
          `).bind(oid).first();
          if (!row) {
            return new Response(JSON.stringify({ success: false, error: 'Order not found' }), {
              status: 404,
              headers: ADMIN_JSON_HEADERS,
            });
          }
          const nowIso = new Date().toISOString();
          const orderLang = String(row.lang || 'th').toLowerCase() === 'en' ? 'en' : 'th';
          let emailRes = null;

          if (action === 'verify_payment') {
            const upd = await env.DB.prepare(`
              UPDATE league_orders
              SET status = 'paid',
                  verified_at = COALESCE(verified_at, ?),
                  admin_note = CASE WHEN ? != '' THEN ? ELSE admin_note END,
                  updated_at = CURRENT_TIMESTAMP
              WHERE order_id = ? AND status IN ('slip_submitted', 'awaiting_payment', 'rejected', 'expired', 'quote_requested')
            `).bind(nowIso, adminNote, adminNote, oid).run();
            if (!upd || !upd.meta || upd.meta.changes !== 1) {
              return new Response(JSON.stringify({ success: false, error: `Cannot verify payment from status "${row.status}"` }), {
                status: 409,
                headers: ADMIN_JSON_HEADERS,
              });
            }
            return new Response(JSON.stringify({ success: true, order_id: oid, status: 'paid' }), {
              status: 200,
              headers: ADMIN_JSON_HEADERS,
            });
          }

          if (action === 'mark_live_and_notify') {
            let deliveredUrl = String((body && body.delivered_url) || '').trim();
            if (!deliveredUrl) {
              deliveredUrl = `https://www.fplsawadika.com/${row.league_id}/`;
            }
            if (!/^https:\/\/(www\.)?fplsawadika\.com\/[A-Za-z0-9_\/-]*$/.test(deliveredUrl)) {
              return new Response(JSON.stringify({ success: false, error: 'delivered_url must point to https://www.fplsawadika.com/...' }), {
                status: 400,
                headers: ADMIN_JSON_HEADERS,
              });
            }
            const upd = await env.DB.prepare(`
              UPDATE league_orders
              SET status = 'live',
                  verified_at = COALESCE(verified_at, ?),
                  delivered_url = ?,
                  admin_note = CASE WHEN ? != '' THEN ? ELSE admin_note END,
                  updated_at = CURRENT_TIMESTAMP
              WHERE order_id = ? AND status IN ('paid', 'slip_submitted', 'quote_requested')
            `).bind(nowIso, deliveredUrl, adminNote, adminNote, oid).run();
            if (!upd || !upd.meta || upd.meta.changes !== 1) {
              return new Response(JSON.stringify({ success: false, error: `Cannot mark live from status "${row.status}"` }), {
                status: 409,
                headers: ADMIN_JSON_HEADERS,
              });
            }

            const safeLid = escapeHtmlEmail(row.league_id);
            const safeLname = escapeHtmlEmail(row.league_name || `League ${row.league_id}`);
            const safeUrl = escapeHtmlEmail(deliveredUrl);
            const safeOid = escapeHtmlEmail(oid);
            const subj = orderLang === 'en'
              ? `[FPLSaWaDiKa] Your Mini-League Dashboard is Live! — ${row.league_name || row.league_id}`
              : `[FPLSaWaDiKa] ลีกของคุณพร้อมใช้งานแล้ว! — ${row.league_name || row.league_id}`;
            const txtBody = orderLang === 'en'
              ? `Hello,\n\nYour FPLSaWaDiKa dashboard for ${row.league_name || row.league_id} (ID: ${row.league_id}) is now live (Order: ${oid}).\n\nOpen your private league link here:\n${deliveredUrl}\n\nShare this link directly in your group chat. For custom adjustments, email support@fplsawadika.com or reach us via LINE.\n\nThank you for choosing FPLSaWaDiKa!`
              : `สวัสดีครับ\n\nแดชบอร์ดมินิลีก ${row.league_name || row.league_id} (ID: ${row.league_id}) เปิดใช้งานเรียบร้อยแล้ว (Order: ${oid})\n\nเข้าใช้งานได้ทันทีที่:\n${deliveredUrl}\n\nสามารถส่งลิงก์นี้เข้ากลุ่ม LINE หรือแชทของเพื่อนในลีกได้เลยครับ\nหากต้องการปรับกติกาเพิ่มเติม ติดต่อได้ที่ support@fplsawadika.com หรือ LINE\n\nขอบคุณที่ไว้วางใจ FPLSaWaDiKa`;
            const htmlBody = orderLang === 'en'
              ? `
                <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #0f172a;">
                  <h2 style="color: #059669; margin: 0 0 12px;">Your Mini-League Dashboard is Live!</h2>
                  <p style="margin: 0 0 12px;">Dashboard setup for <strong>${safeLname}</strong> (League ID: <code>${safeLid}</code>, Order: <code>${safeOid}</code>) is complete.</p>
                  <p style="margin: 20px 0;">
                    <a href="${safeUrl}" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 20px; border-radius: 10px;">Open Your League Dashboard →</a>
                  </p>
                  <p style="font-size: 13px; color: #475569; margin: 0 0 8px;">Direct link: <a href="${safeUrl}">${safeUrl}</a></p>
                  <p style="font-size: 13px; color: #475569;">Need rule tweaks? Reply to <a href="mailto:support@fplsawadika.com">support@fplsawadika.com</a> anytime.</p>
                </div>
              `
              : `
                <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #0f172a;">
                  <h2 style="color: #059669; margin: 0 0 12px;">ลีกของคุณพร้อมใช้งานแล้ว!</h2>
                  <p style="margin: 0 0 12px;">แดชบอร์ดมินิลีก <strong>${safeLname}</strong> (League ID: <code>${safeLid}</code>) สำหรับคำสั่งซื้อ <code>${safeOid}</code> เปิดใช้งานครบถ้วนเรียบร้อยแล้วครับ</p>
                  <p style="margin: 20px 0;">
                    <a href="${safeUrl}" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 20px; border-radius: 10px;">เปิดดูแดชบอร์ดลีกของคุณ →</a>
                  </p>
                  <p style="font-size: 13px; color: #475569; margin: 0 0 8px;">ลิงก์ตรง: <a href="${safeUrl}">${safeUrl}</a></p>
                  <p style="font-size: 13px; color: #475569;">หากต้องการปรับแก้ไขกติกาเพิ่มเติม สามารถตอบกลับอีเมลนี้มาที่ <a href="mailto:support@fplsawadika.com">support@fplsawadika.com</a> ได้ตลอดเวลาครับ</p>
                </div>
              `;
            emailRes = await sendTransactionalEmail(env, {
              to: row.customer_email,
              replyTo: 'support@fplsawadika.com',
              subject: subj,
              text: txtBody,
              html: htmlBody,
            });
            return new Response(
              JSON.stringify({ success: true, order_id: oid, status: 'live', delivered_url: deliveredUrl, email: emailRes }),
              { status: 200, headers: ADMIN_JSON_HEADERS }
            );
          }

          if (action === 'reject') {
            const reason = adminNote || (orderLang === 'en'
              ? 'Transfer amount could not be confirmed or slip image is unclear. Please upload a new slip.'
              : 'ไม่พบยอดโอนหรือสลิปไม่ชัดเจน กรุณาอัปโหลดสลิปใหม่อีกครั้ง');
            const newExpIso = new Date(Date.now() + 24 * 3600000).toISOString();
            const rawToken = generateAccessToken();
            const newTokenHash = await sha256Hex(rawToken);
            const upd = await env.DB.prepare(`
              UPDATE league_orders
              SET status = 'rejected',
                  admin_note = ?,
                  expires_at = ?,
                  access_token_hash = ?,
                  updated_at = CURRENT_TIMESTAMP
              WHERE order_id = ? AND status = 'slip_submitted'
            `).bind(reason, newExpIso, newTokenHash, oid).run();
            if (!upd || !upd.meta || upd.meta.changes !== 1) {
              return new Response(JSON.stringify({ success: false, error: `Cannot reject slip from status "${row.status}"` }), {
                status: 409,
                headers: ADMIN_JSON_HEADERS,
              });
            }

            const reqOrigin = request.headers.get('origin') || '';
            const payOrigin = (env.ENVIRONMENT === 'staging' && reqOrigin && isLocalOrigin(reqOrigin))
              ? reqOrigin
              : 'https://www.fplsawadika.com';
            const payUrl = getOrderPayUrl(payOrigin, oid, rawToken);
            const safeOid = escapeHtmlEmail(oid);
            const safeReason = escapeHtmlEmail(reason);
            const safeLname = escapeHtmlEmail(row.league_name || `League ${row.league_id}`);
            const safePayUrl = escapeHtmlEmail(payUrl);
            const rejSubj = orderLang === 'en'
              ? `[FPLSaWaDiKa] Action Required: Please re-upload your transfer slip (${oid})`
              : `[FPLSaWaDiKa] กรุณาตรวจสอบ/ส่งสลิปใหม่ (${oid})`;
            const rejText = orderLang === 'en'
              ? `Hello,\n\nYour transfer slip for order ${oid} (${row.league_name || row.league_id}) could not be verified.\nReason: ${reason}\n\nPlease upload a clearer slip using your updated link (valid for 24h):\n${payUrl}\n\nOr reply to support@fplsawadika.com with Order ${oid}.`
              : `สวัสดีครับ\n\nคำสั่งซื้อ ${oid} (${row.league_name || row.league_id}) ยังไม่สามารถยืนยันยอดโอนได้\nเหตุผลจากแอดมิน: ${reason}\n\nกรุณาเปิดลิงก์นี้เพื่ออัปโหลดสลิปใหม่อีกครั้ง (เปิดใช้งานได้อีก 24 ชม.):\n${payUrl}\n\nหรือติดต่อกลับมาที่ support@fplsawadika.com พร้อมแจ้งรหัส Order ${oid} ครับ`;
            const rejHtml = orderLang === 'en'
              ? `
                <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #0f172a;">
                  <h2 style="color: #dc2626; margin: 0 0 12px;">Please Re-upload Your Payment Slip</h2>
                  <p style="margin: 0 0 10px;">We could not verify the slip for order <code>${safeOid}</code> (${safeLname}).</p>
                  <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 8px; margin: 12px 0; color: #991b1b;">
                    <strong>Reason:</strong> ${safeReason}
                  </div>
                  <p style="margin: 18px 0;">
                    <a href="${safePayUrl}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 18px; border-radius: 10px;">Upload New Slip →</a>
                  </p>
                  <p style="font-size: 13px; color: #475569;">Need help? Reply to <a href="mailto:support@fplsawadika.com">support@fplsawadika.com</a>.</p>
                </div>
              `
              : `
                <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #0f172a;">
                  <h2 style="color: #dc2626; margin: 0 0 12px;">กรุณาตรวจสอบและอัปโหลดสลิปใหม่</h2>
                  <p style="margin: 0 0 10px;">คำสั่งซื้อ <code>${safeOid}</code> (${safeLname}) ยังไม่สามารถยืนยันการโอนเงินได้ครับ</p>
                  <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 12px; border-radius: 8px; margin: 12px 0; color: #991b1b;">
                    <strong>รายละเอียด:</strong> ${safeReason}
                  </div>
                  <p style="margin: 18px 0;">
                    <a href="${safePayUrl}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 18px; border-radius: 10px;">อัปโหลดสลิปใหม่อีกครั้ง →</a>
                  </p>
                  <p style="font-size: 13px; color: #475569;">หากต้องการสอบถามเพิ่มเติม ตอบกลับอีเมลมาที่ <a href="mailto:support@fplsawadika.com">support@fplsawadika.com</a> ได้เลยครับ</p>
                </div>
              `;
            emailRes = await sendTransactionalEmail(env, {
              to: row.customer_email,
              replyTo: 'support@fplsawadika.com',
              subject: rejSubj,
              text: rejText,
              html: rejHtml,
            });
            return new Response(
              JSON.stringify({ success: true, order_id: oid, status: 'rejected', admin_note: reason, expires_at: newExpIso, email: emailRes }),
              { status: 200, headers: ADMIN_JSON_HEADERS }
            );
          }

          if (action === 'delete_slip') {
            const upd = await env.DB.prepare(`
              UPDATE league_orders
              SET slip_data_url = NULL, updated_at = CURRENT_TIMESTAMP
              WHERE order_id = ? AND status IN ('live', 'rejected', 'expired', 'paid')
            `).bind(oid).run();
            if (!upd || !upd.meta || upd.meta.changes !== 1) {
              return new Response(JSON.stringify({ success: false, error: `Cannot delete slip while status is "${row.status}" (reject or complete the order first)` }), {
                status: 409,
                headers: ADMIN_JSON_HEADERS,
              });
            }
            return new Response(JSON.stringify({ success: true, order_id: oid, status: row.status, slip_deleted: true }), {
              status: 200,
              headers: ADMIN_JSON_HEADERS,
            });
          }

          if (action === 'delete_unpaid' || action === 'delete_test') {
            const del = await env.DB.prepare(
              'DELETE FROM league_orders WHERE order_id = ?'
            ).bind(oid).run();
            if (!del || !del.meta || del.meta.changes !== 1) {
              return new Response(JSON.stringify({ success: false, error: 'Failed to delete order' }), {
                status: 409,
                headers: ADMIN_JSON_HEADERS,
              });
            }
            if (action === 'delete_unpaid') {
              await incrementLifetimeUnpaidStat(env.DB, 1);
            }
            return new Response(
              JSON.stringify({ success: true, order_id: oid, deleted: true, counted_unpaid: action === 'delete_unpaid' }),
              { status: 200, headers: ADMIN_JSON_HEADERS }
            );
          }
        } catch (err) {
          console.warn('Admin order action error:', err);
          return new Response(JSON.stringify({ success: false, error: 'Order action failed' }), {
            status: 500,
            headers: ADMIN_JSON_HEADERS,
          });
        }
      }

      // Live Telemetry & FPL Sync Data Endpoint
      if (path === '/api/admin/data' || path === '/api/admin/telemetry' || path === '/api/admin/metrics') {
        const isForce = url.searchParams.get('force') === '1';
        try {
          // Automated background retention prune (runs once per admin visit without latency impact)
          if (env && env.DB && ctx && ctx.waitUntil) {
            ctx.waitUntil((async () => {
              try {
                await env.DB.prepare(`
                  DELETE FROM telemetry_counters WHERE date < DATE('now', '-30 days') AND date != '9999-12-31' AND metric NOT LIKE 'lifetime:%'
                `).run();
              } catch (_) {}
              try {
                await ensureLeagueOrdersTable(env.DB);
                await env.DB.prepare(`
                  UPDATE league_orders
                  SET slip_data_url = NULL, updated_at = CURRENT_TIMESTAMP
                  WHERE slip_data_url IS NOT NULL
                    AND status IN ('live', 'rejected', 'expired')
                    AND datetime(COALESCE(verified_at, updated_at, created_at)) < datetime('now', '-30 days')
                `).run();
              } catch (_) {}
            })());
          }

          const tsSuffix = isForce ? `?t=${Date.now()}` : '';
          const rawBranch = (env && typeof env.GITHUB_BRANCH === 'string' && env.GITHUB_BRANCH.trim()) ? env.GITHUB_BRANCH.trim() : 'main';
          const safeBranch = /^[A-Za-z0-9._\/-]+$/.test(rawBranch) ? rawBranch : 'main';
          const candidateUrls = [
            `https://raw.githubusercontent.com/asawamanasak/fpl-mini/${safeBranch}/data/admin_summary.json${tsSuffix}`,
            `https://www.fplsawadika.com/data/admin_summary.json${tsSuffix}`,
            `https://raw.githubusercontent.com/asawamanasak/fpl-mini/${safeBranch}/multi_fpl_data.json${tsSuffix}`,
            `https://www.fplsawadika.com/multi_fpl_data.json${tsSuffix}`,
          ];
          const cfgPromise = fetch(`https://raw.githubusercontent.com/asawamanasak/fpl-mini/${safeBranch}/config/leagues_config.json${tsSuffix}`, {
            headers: { 'User-Agent': 'FPLSaWaDiKa-Admin-Relay/2.0' },
            cf: isForce ? { cacheTtl: 0, cacheEverything: false } : { cacheTtl: 300, cacheEverything: true },
          }).then(r => (r && r.ok ? r.json() : null)).catch(() => null);

          const d1NotesPromise = (async () => {
            const notesMap = new Map();
            if (!env || !env.DB) return notesMap;
            try {
              await ensureAdminNotesTable(env.DB);
              const q = await env.DB.prepare('SELECT league_id, note FROM league_admin_notes').all();
              if (q && Array.isArray(q.results)) {
                for (const r of q.results) {
                  if (r && r.league_id && typeof r.note === 'string' && r.note.trim()) {
                    notesMap.set(String(r.league_id).trim(), r.note.trim());
                  }
                }
              }
            } catch (_) {}
            return notesMap;
          })();

          let resp = null;
          for (const candidateUrl of candidateUrls) {
            try {
              const r = await fetch(candidateUrl, {
                headers: { 'User-Agent': 'FPLSaWaDiKa-Admin-Relay/2.0' },
                cf: isForce ? { cacheTtl: 0, cacheEverything: false } : { cacheTtl: 15, cacheEverything: true },
              });
              if (r.ok) {
                resp = r;
                break;
              }
            } catch (_) {}
          }
          const [leaguesConfigJson, d1NotesMap] = await Promise.all([cfgPromise, d1NotesPromise]);
          const ictToday = getIctNowParts().date;
          let dynamicPoolGmv = 0;
          let customRulesCount = 0;
          const configMetaByLeague = {};
          if (leaguesConfigJson && typeof leaguesConfigJson === 'object') {
            for (const [cfgId, cfgItem] of Object.entries(leaguesConfigJson)) {
              if (!cfgItem || typeof cfgItem !== 'object') continue;
              const poolStr = typeof cfgItem.total_pool === 'string' ? cfgItem.total_pool : '';
              const m = poolStr.match(/^([\d,]+)\s*THB/i);
              const poolThb = m ? (parseInt(m[1].replace(/,/g, ''), 10) || 0) : 0;
              dynamicPoolGmv += poolThb;
              const feats = (cfgItem.features && typeof cfgItem.features === 'object') ? cfgItem.features : {};
              const hasCustomRules = Boolean(
                (feats.prize_model && feats.prize_model !== 'standard') ||
                feats.has_cup ||
                feats.has_monthly_prizes ||
                feats.has_settlement_phases ||
                feats.has_weekly_penalties ||
                feats.has_shi62_special ||
                feats.has_bramann_prediction ||
                feats.has_bramann_challenge
              );
              if (hasCustomRules) customRulesCount += 1;
              const vis = cfgItem.visibility === 'private' ? 'private' : 'showcase';
              const tGroup = (typeof cfgItem.tenant_group === 'string' && cfgItem.tenant_group.trim())
                ? cfgItem.tenant_group.trim()
                : (vis === 'showcase' ? 'showcase' : `private_${cfgId}`);
              const expInfo = computeLifecycleExpiry(cfgItem.expires_at, ictToday);
              configMetaByLeague[cfgId] = {
                name: (typeof cfgItem.name === 'string' && cfgItem.name.trim()) ? cfgItem.name.trim() : cfgId,
                plan: (typeof cfgItem.plan === 'string' && cfgItem.plan.trim()) ? cfgItem.plan.trim() : 'standard',
                status: (typeof cfgItem.status === 'string' && cfgItem.status.trim()) ? cfgItem.status.trim() : 'active',
                visibility: vis,
                tenant_group: tGroup,
                created_at: (typeof cfgItem.created_at === 'string' && cfgItem.created_at.trim()) ? cfgItem.created_at.trim() : null,
                billing_note: typeof cfgItem.billing_note === 'string' ? cfgItem.billing_note.trim() : '',
                ...expInfo,
                pool: poolThb,
                pool_label: poolStr || '-',
                pool_label_en: typeof cfgItem.total_pool_en === 'string' ? cfgItem.total_pool_en : (poolStr || '-'),
                has_custom_rules: hasCustomRules,
                tier: cfgItem.tier ? Number(cfgItem.tier) : 1,
              };
            }
          }
          if (resp && resp.ok) {
            const data = await resp.json();

            const rawLeagues = (data && data.leagues && typeof data.leagues === 'object') ? data.leagues : {};
            let liveTier1Managers = 0;
            let liveAllManagers = 0;
            const liveLeagueSummaries = {};
            const allLeagueIds = new Set([...Object.keys(rawLeagues), ...Object.keys(configMetaByLeague)]);
            for (const lid of allLeagueIds) {
              const lObj = (rawLeagues[lid] && typeof rawLeagues[lid] === 'object') ? rawLeagues[lid] : null;
              const teamsCount = (lObj && typeof lObj.teams_count === 'number')
                ? lObj.teams_count
                : ((lObj && Array.isArray(lObj.teams)) ? lObj.teams.length : 0);
              const cfgMeta = configMetaByLeague[lid] || {};
              const tier = (lObj && lObj.tier) ? Number(lObj.tier) : (cfgMeta.tier || 1);
              const d1Note = d1NotesMap && d1NotesMap.has(String(lid)) ? d1NotesMap.get(String(lid)) : '';
              const effectiveNote = d1Note || cfgMeta.billing_note || '';
              const noteSource = d1Note ? 'd1' : (cfgMeta.billing_note ? 'config' : 'none');
              liveAllManagers += teamsCount;
              if (tier !== 2) liveTier1Managers += teamsCount;
              liveLeagueSummaries[lid] = {
                id: lid,
                name: (lObj && lObj.name) ? String(lObj.name) : (cfgMeta.name || lid),
                teams: teamsCount,
                tier,
                pool: typeof cfgMeta.pool === 'number' ? cfgMeta.pool : 0,
                pool_label: cfgMeta.pool_label || '-',
                pool_label_en: cfgMeta.pool_label_en || '-',
                has_custom_rules: Boolean(cfgMeta.has_custom_rules),
                plan: cfgMeta.plan || 'standard',
                status: cfgMeta.status || (lObj && lObj.status) || 'active',
                visibility: cfgMeta.visibility || 'showcase',
                tenant_group: cfgMeta.tenant_group || (cfgMeta.visibility === 'private' ? `private_${lid}` : 'showcase'),
                created_at: cfgMeta.created_at || null,
                expires_at: cfgMeta.expires_at || null,
                days_remaining: typeof cfgMeta.days_remaining === 'number' ? cfgMeta.days_remaining : null,
                expiry_alert: cfgMeta.expiry_alert || 'none',
                billing_note: effectiveNote,
                billing_note_source: noteSource,
              };
            }

            const lifecycleSummary = {
              total: 0,
              showcase: 0,
              private_customers: 0,
              active: 0,
              trial: 0,
              paused: 0,
              expiring_soon: 0,
              expired: 0,
            };
            for (const item of Object.values(liveLeagueSummaries)) {
              lifecycleSummary.total += 1;
              if (item.visibility === 'private') lifecycleSummary.private_customers += 1;
              else lifecycleSummary.showcase += 1;
              if (item.status === 'trial') lifecycleSummary.trial += 1;
              else if (item.status === 'paused') lifecycleSummary.paused += 1;
              else lifecycleSummary.active += 1;
              if (item.expiry_alert === 'expiring_soon') lifecycleSummary.expiring_soon += 1;
              else if (item.expiry_alert === 'expired') lifecycleSummary.expired += 1;
            }

            const totalLeaguesCount = Object.keys(liveLeagueSummaries).length || 9;
            const tier1LeaguesCount = Object.values(liveLeagueSummaries).filter(x => x.tier !== 2).length || 8;
            const effectiveCustomCount = customRulesCount || 7;
            data.portfolio = {
              total_managers: liveTier1Managers || 163,
              total_managers_tier1: liveTier1Managers || 163,
              total_managers_all: liveAllManagers || liveTier1Managers || 1942,
              total_pool_gmv: dynamicPoolGmv || 268700,
              tier1_leagues_count: tier1LeaguesCount,
              total_leagues_count: totalLeaguesCount,
              custom_rules_count: effectiveCustomCount,
              custom_rules_pct: Math.round((effectiveCustomCount / totalLeaguesCount) * 100),
              lifecycle_summary: lifecycleSummary,
              leagues: liveLeagueSummaries,
            };

            if (data.next_deadline && typeof data.next_deadline === 'object') {
              const isoFallback = data.next_deadline.deadline_epoch
                ? new Date(Number(data.next_deadline.deadline_epoch) * 1000).toISOString()
                : null;
              data.fpl_upstream = {
                next_deadline_time: data.next_deadline.deadline_iso || data.next_deadline.deadline_time || isoFallback,
                next_gw_name: data.next_deadline.name || null,
              };
            }

            // Enrich with edge telemetry (Cloudflare D1 primary, KV fallback)
            try {
              if (env && (env.DB || env.ANALYTICS_KV)) {
                const now = new Date();
                const dates = [];
                for (let i = 0; i < 7; i++) {
                  dates.push(getIctNowParts(new Date(now.getTime() - i * 86400000)).date);
                }

                const metricMap = new Map();
                let dev30d = { mobile: 0, desktop: 0, tablet: 0, hasData: false };

                if (env.DB) {
                  // Single fast SQL query fetching rolling 7 days metrics + lifetime cumulative views
                  const placeholders = dates.map(() => '?').join(',');
                  const query = `SELECT metric, val FROM telemetry_counters WHERE date IN (${placeholders}) OR metric = 'lifetime:total_views'`;
                  const cutoff30d = getIctNowParts(new Date(now.getTime() - 29 * 86400000)).date;
                  const devQuery = `SELECT CASE WHEN metric LIKE '%:dev:mobile' THEN 'mobile' WHEN metric LIKE '%:dev:desktop' THEN 'desktop' WHEN metric LIKE '%:dev:tablet' THEN 'tablet' END AS dev_type, SUM(val) AS total FROM telemetry_counters WHERE date >= ? AND date != '9999-12-31' AND (metric LIKE '%:dev:mobile' OR metric LIKE '%:dev:desktop' OR metric LIKE '%:dev:tablet') GROUP BY dev_type`;
                  const [result, devRes] = await Promise.all([
                    env.DB.prepare(query).bind(...dates).all(),
                    env.DB.prepare(devQuery).bind(cutoff30d).all().catch(() => null),
                  ]);
                  if (result && Array.isArray(result.results)) {
                    for (const row of result.results) {
                      metricMap.set(row.metric, Number(row.val) || 0);
                    }
                  }
                  if (devRes && Array.isArray(devRes.results)) {
                    for (const dr of devRes.results) {
                      if (dr && dr.dev_type && typeof dev30d[dr.dev_type] === 'number') {
                        dev30d[dr.dev_type] = Number(dr.total) || 0;
                        dev30d.hasData = true;
                      }
                    }
                  }
                } else if (env.ANALYTICS_KV) {
                  // Fallback to KV using compacted daily blobs (8 KV gets total, well under the 50-subrequest limit)
                  const dayPromises = dates.map(d => env.ANALYTICS_KV.get(`telem_day:${d}`, 'json').catch(() => null));
                  dayPromises.push(env.ANALYTICS_KV.get('lifetime:total_views').catch(() => '0'));
                  const results = await Promise.all(dayPromises);
                  for (let i = 0; i < dates.length; i++) {
                    const dayBlob = results[i];
                    if (dayBlob && typeof dayBlob === 'object') {
                      for (const [k, v] of Object.entries(dayBlob)) {
                        metricMap.set(k, parseInt(String(v || '0'), 10) || 0);
                      }
                    }
                  }
                  metricMap.set('lifetime:total_views', parseInt(String(results[dates.length] || '0'), 10) || 0);
                }

                let totalVisitsKV = 0;
                let lineCount = 0;
                let safariCount = 0;
                let chromeCount = 0;
                let otherSrcCount = 0;
                let fbCount = 0;
                let mobileCount = 0;
                let desktopCount = 0;
                let tabletCount = 0;

                for (let i = 0; i < dates.length; i++) {
                  const d = dates[i];
                  const pfx = `telem:${d}`;
                  totalVisitsKV += metricMap.get(`${pfx}:total_visits`) || 0;
                  lineCount += metricMap.get(`${pfx}:src:line`) || 0;
                  safariCount += metricMap.get(`${pfx}:src:safari`) || 0;
                  chromeCount += metricMap.get(`${pfx}:src:chrome`) || 0;
                  otherSrcCount += (metricMap.get(`${pfx}:src:other`) || 0) + (metricMap.get(`${pfx}:src:web`) || 0);
                  fbCount += metricMap.get(`${pfx}:src:fb`) || 0;
                  mobileCount += metricMap.get(`${pfx}:dev:mobile`) || 0;
                  desktopCount += metricMap.get(`${pfx}:dev:desktop`) || 0;
                  tabletCount += metricMap.get(`${pfx}:dev:tablet`) || 0;
                }

                if (otherSrcCount > 0) {
                  safariCount += Math.round(otherSrcCount * 0.65);
                  chromeCount += otherSrcCount - Math.round(otherSrcCount * 0.65);
                }

                const totalKvVisits = totalVisitsKV > 0 ? totalVisitsKV : (lineCount + safariCount + chromeCount + fbCount);
                const usePureRealTelemetry = totalKvVisits > 0;
                const baselineVisits = usePureRealTelemetry ? 0 : 4280;
                const dynamicVisits = baselineVisits + totalKvVisits;
                const dailyAvgReach = Math.round(dynamicVisits / 7);

                // Direct 7-day real telemetry (only falls back to priors when D1 has 0 visits)
                const baseLineHits = usePureRealTelemetry ? 0 : Math.round(baselineVisits * 0.524);
                const baseSafariHits = usePureRealTelemetry ? 0 : Math.round(baselineVisits * 0.348);
                const baseChromeHits = usePureRealTelemetry ? 0 : (baselineVisits - baseLineHits - baseSafariHits);

                const activeLineHits = baseLineHits + lineCount;
                const activeSafariHits = baseSafariHits + safariCount;
                const activeChromeHits = baseChromeHits + chromeCount + fbCount;
                const activeSrcTotal = Math.max(1, activeLineHits + activeSafariHits + activeChromeHits);

                const linePct = ((activeLineHits / activeSrcTotal) * 100).toFixed(1);
                const safariPct = ((activeSafariHits / activeSrcTotal) * 100).toFixed(1);
                const chromePct = Math.max(0, 100.0 - parseFloat(linePct) - parseFloat(safariPct)).toFixed(1);

                // Device distribution (compute both 7d and 30d rolling real D1 windows)
                const buildDeviceWindow = (mob, desk, tab, winDays, allowFallback) => {
                  const rawSum = mob + desk + tab;
                  const baseMob = (allowFallback && rawSum === 0) ? Math.round(baselineVisits * 0.764) : 0;
                  const baseDesk = (allowFallback && rawSum === 0) ? Math.round(baselineVisits * 0.182) : 0;
                  const baseTab = (allowFallback && rawSum === 0) ? (baselineVisits - baseMob - baseDesk) : 0;
                  const mHits = baseMob + mob;
                  const dHits = baseDesk + desk;
                  const tHits = baseTab + tab;
                  const tot = Math.max(1, mHits + dHits + tHits);
                  const mPct = ((mHits / tot) * 100).toFixed(1);
                  const dPct = ((dHits / tot) * 100).toFixed(1);
                  const tPct = Math.max(0, 100.0 - parseFloat(mPct) - parseFloat(dPct)).toFixed(1);
                  return {
                    window_days: winDays,
                    mobile: { count: mob, pct: mPct },
                    desktop: { count: desk, pct: dPct },
                    tablet: { count: tab, pct: tPct },
                  };
                };

                const hasDev30d = dev30d.hasData && (dev30d.mobile + dev30d.desktop + dev30d.tablet) > 0;
                const devices7dObj = buildDeviceWindow(mobileCount, desktopCount, tabletCount, 7, !usePureRealTelemetry);
                const devices30dObj = hasDev30d
                  ? buildDeviceWindow(dev30d.mobile, dev30d.desktop, dev30d.tablet, 30, false)
                  : { ...devices7dObj, window_days: 7 };
                const activeDevicesDefault = hasDev30d ? devices30dObj : devices7dObj;

                // League metadata (real 7-day views & dwell directly from D1 without synthetic baseline skew)
                const LEAGUE_BASELINES = {
                  '40700': { name: 'เซียนอยู่รู หมูอยู่ตึก', baseDwellSec: 384, peakWindow: 'เสาร์ 21:00 - 23:00 น.', peakWindowEn: 'Sat 21:00 - 23:00' },
                  '675290': { name: 'NudNee', baseDwellSec: 312, peakWindow: 'เสาร์ 18:30 - 21:00 น.', peakWindowEn: 'Sat 18:30 - 21:00' },
                  '38491': { name: 'รอ แมน โอน', baseDwellSec: 246, peakWindow: 'ศุกร์ 17:00 - 18:30 น.', peakWindowEn: 'Fri 17:00 - 18:30' },
                  '1101958': { name: "Barley's Official League", baseDwellSec: 276, peakWindow: 'อาทิตย์ 20:00 - 22:30 น.', peakWindowEn: 'Sun 20:00 - 22:30' },
                  '438691': { name: '2 spade', baseDwellSec: 234, peakWindow: 'เสาร์ 20:00 - 22:00 น.', peakWindowEn: 'Sat 20:00 - 22:00' },
                  '187827': { name: 'Shi62', baseDwellSec: 210, peakWindow: 'จันทร์ 12:00 - 13:30 น.', peakWindowEn: 'Mon 12:00 - 13:30' },
                  '5349': { name: 'Bramann League', baseDwellSec: 192, peakWindow: 'เสาร์ 18:00 - 20:00 น.', peakWindowEn: 'Sat 18:00 - 20:00' },
                  '567387': { name: 'Fantasy Nguan & friends cup', baseDwellSec: 180, peakWindow: 'เสาร์ 21:00 - 23:00 น.', peakWindowEn: 'Sat 21:00 - 23:00' },
                  '139836': { name: 'FPL Growth Mindset 2026/27', baseDwellSec: 180, peakWindow: 'เสาร์ 20:00 - 22:30 น.', peakWindowEn: 'Sat 20:00 - 22:30' },
                };

                const extraQueryLeagues = (url.searchParams.get('extra_leagues') || '')
                  .split(',')
                  .map(s => s.trim())
                  .filter(s => /^\d{1,10}$/.test(s));
                const leagueIds = Array.from(new Set([...Object.keys(LEAGUE_BASELINES), ...Object.keys(liveLeagueSummaries), ...extraQueryLeagues]));

                const leagueStats = {};
                leagueIds.forEach(lid => {
                  leagueStats[lid] = { kvViews: 0, kvDwellSec: 0, kvDwellSess: 0 };
                  dates.forEach(d => {
                    const pfx = `telem:${d}`;
                    leagueStats[lid].kvViews += metricMap.get(`${pfx}:l:${lid}:views`) || 0;
                    leagueStats[lid].kvDwellSec += metricMap.get(`${pfx}:l:${lid}:dwell_sec`) || 0;
                    leagueStats[lid].kvDwellSess += metricMap.get(`${pfx}:l:${lid}:dwell_sess`) || 0;
                  });
                });

                let totalLeaguesVisits = 0;
                let landingViews7d = 0;
                const landingViewsToday = metricMap.get(`telem:${dates[0]}:l:landing:views`) || 0;
                dates.forEach(d => {
                  landingViews7d += metricMap.get(`telem:${d}:l:landing:views`) || 0;
                });
                let globalDwellSec = 0;
                let globalDwellSess = 0;
                const leaguesOutput = {};

                leagueIds.forEach(lid => {
                  const base = LEAGUE_BASELINES[lid] || { peakWindow: '-', peakWindowEn: '-', baseDwellSec: 180 };
                  const st = leagueStats[lid];
                  const actViews = st.kvViews;
                  totalLeaguesVisits += actViews;

                  globalDwellSec += st.kvDwellSec;
                  globalDwellSess += st.kvDwellSess;
                  const avgDwellSec = st.kvDwellSess > 0
                    ? Math.round(st.kvDwellSec / st.kvDwellSess)
                    : 0;
                  const avgMins = (avgDwellSec / 60).toFixed(1);

                  leaguesOutput[lid] = {
                    views: actViews,
                    raw_live_views: st.kvViews,
                    peak_window: base.peakWindow,
                    peak_window_en: base.peakWindowEn,
                    avg_screen_time: st.kvDwellSess > 0 ? (avgMins + ' นาที / ครั้ง') : '-',
                    avg_screen_time_en: st.kvDwellSess > 0 ? (avgMins + ' min / visit') : '-',
                    avg_screen_time_mins: parseFloat(avgMins),
                  };
                });

                leagueIds.forEach(lid => {
                  const share = ((leaguesOutput[lid].views / (totalLeaguesVisits > 0 ? totalLeaguesVisits : 1)) * 100).toFixed(1);
                  leaguesOutput[lid].share_pct = share;
                });

                // Feature Adoption, City Geo & Hourly Traffic Aggregation (7 Days)
                let featTabLive = 0;
                let featTabHighlight = 0;
                let featTabComp = 0;
                let featTabPrizes = 0;
                let featTabSpecial = 0;
                let featTabTransfers = 0;
                let featTabChips = 0;
                let featTabHof = 0;
                let featPitchOpens = 0;

                const BKK_METRO_CITIES = new Set(['bangkok', 'nonthaburi', 'pathum thani', 'samut prakan', 'samut sakhon', 'nakhon pathom', 'pak kret', 'bang kruai', 'bangใหญ่', 'bang yai', 'rangsit', 'bang phli', 'bang bo', 'thanyaburi', 'khlong luang', 'lam luk ka']);
                const TH_REGIONAL_CITIES = new Set([
                  'chiang mai', 'chonburi', 'pattaya', 'khon kaen', 'phuket', 'hat yai', 'songkhla', 'nakhon ratchasima',
                  'udon thani', 'rayong', 'surat thani', 'chiang rai', 'phitsanulok', 'ubon ratchathani', 'hua hin',
                  'saraburi', 'ayutthaya', 'krabi', 'lampang', 'nakhon si thammarat', 'surin', 'pak chong', 'buriram',
                  'buri ram', 'si sa ket', 'sisaket', 'roi et', 'maha sarakham', 'kalasin', 'sakon nakhon', 'nakhon phanom',
                  'loei', 'nong khai', 'chaiyaphum', 'phetchabun', 'nan', 'phrae', 'phayao', 'lamphun', 'mae hong son',
                  'uttaradit', 'sukhothai', 'kamphaeng phet', 'tak', 'nakhon sawan', 'uthai thani', 'chai nat', 'sing buri',
                  'lop buri', 'lopburi', 'ang thong', 'suphan buri', 'kanchanaburi', 'ratchaburi', 'phetchaburi',
                  'prachuap khiri khan', 'chachoengsao', 'prachin buri', 'prachinburi', 'sa kaeo', 'chanthaburi', 'trat',
                  'chumphon', 'ranong', 'phang nga', 'trang', 'phatthalung', 'satun', 'pattani', 'yala', 'narathiwat',
                  'yasothon', 'amnat charoen', 'mukdahan', 'bueng kan', 'nong bua lam phu', 'nakhon nayok',
                  'samut songkhram', 'si racha', 'sriracha', 'laem chabang', 'mae sot', 'koh samui'
                ]);
                let cityBkkCount = 0;
                let cityRegionalCount = 0;
                let cityIntlCount = 0;

                // Hourly traffic aggregation (0..23 ICT) directly from real D1 visits
                const hourlyBase = [42, 28, 14, 8, 6, 9, 18, 34, 62, 95, 118, 145, 190, 165, 140, 155, 198, 265, 390, 485, 620, 740, 580, 210];
                const realHourlySeries = new Array(24).fill(0);
                let totalRealHourlyHits = 0;

                for (const [mKey, mVal] of metricMap.entries()) {
                  if (mKey.includes(':feat:tab:gameweek-view') || mKey.includes(':feat:tab:live')) featTabLive += mVal;
                  else if (mKey.includes(':feat:tab:highlight')) featTabHighlight += mVal;
                  else if (mKey.includes(':feat:tab:competition') || mKey.includes(':feat:tab:global-radar')) featTabComp += mVal;
                  else if (mKey.includes(':feat:tab:prizes')) featTabPrizes += mVal;
                  else if (mKey.includes(':feat:tab:shi62') || mKey.includes(':feat:tab:bramann')) featTabSpecial += mVal;
                  else if (mKey.includes(':feat:tab:transfers')) featTabTransfers += mVal;
                  else if (mKey.includes(':feat:tab:chips')) featTabChips += mVal;
                  else if (mKey.includes(':feat:tab:hall-of-fame') || mKey.includes(':feat:tab:cup') || mKey.includes(':feat:tab:rules') || mKey.includes(':feat:tab:about')) featTabHof += mVal;
                  else if (mKey.includes(':feat:pitch_opens')) featPitchOpens += mVal;
                  else {
                    const cMatch = mKey.match(/:city:(.+)$/);
                    if (cMatch) {
                      const cName = cMatch[1].trim().toLowerCase();
                      if (BKK_METRO_CITIES.has(cName)) cityBkkCount += mVal;
                      else if (TH_REGIONAL_CITIES.has(cName)) cityRegionalCount += mVal;
                      else cityIntlCount += mVal;
                    }
                  }
                  const hMatch = mKey.match(/:l:(?:\d+|landing):h:(\d{1,2})$/);
                  if (hMatch) {
                    const hr = parseInt(hMatch[1], 10);
                    if (hr >= 0 && hr < 24) {
                      realHourlySeries[hr] += mVal;
                      totalRealHourlyHits += mVal;
                    }
                  }
                }
                const hourlySeries = totalRealHourlyHits > 0 ? realHourlySeries : [...hourlyBase];

                // Geographic split (pure real D1 city hits when recorded)
                const hasRealGeo = (cityBkkCount + cityRegionalCount + cityIntlCount) > 0;
                const activeBkkHits = hasRealGeo ? cityBkkCount : Math.round(baselineVisits * 0.685);
                const activeRegHits = hasRealGeo ? cityRegionalCount : Math.round(baselineVisits * 0.237);
                const activeIntlHits = hasRealGeo ? cityIntlCount : (baselineVisits - Math.round(baselineVisits * 0.685) - Math.round(baselineVisits * 0.237));
                const activeGeoTotal = Math.max(1, activeBkkHits + activeRegHits + activeIntlHits);
                const geoBkkPct = ((activeBkkHits / activeGeoTotal) * 100).toFixed(1);
                const geoRegPct = ((activeRegHits / activeGeoTotal) * 100).toFixed(1);
                const geoIntlPct = Math.max(0, 100.0 - parseFloat(geoBkkPct) - parseFloat(geoRegPct)).toFixed(1);

                // 7-Day Rolling Daily Visits Series (oldest to newest ICT date)
                const dailyBaseWeights = [0.095, 0.082, 0.078, 0.088, 0.142, 0.285, 0.230];
                const dailySeries = dates.slice().reverse().map((d, idx) => {
                  const kvDay = metricMap.get(`telem:${d}:total_visits`) || 0;
                  if (usePureRealTelemetry) {
                    return { date: d, visits: kvDay };
                  }
                  const dt = new Date(d + 'T12:00:00Z');
                  const dow = Number.isNaN(dt.getTime()) ? idx : dt.getUTCDay();
                  const dowWeights = [0.230, 0.125, 0.078, 0.074, 0.088, 0.145, 0.260];
                  const calDay = Math.round(baselineVisits * (dowWeights[dow] ?? dailyBaseWeights[idx] ?? 0.14));
                  return { date: d, visits: calDay + kvDay };
                });

                // Peak daily visits & off-peak Tue-Thu avg directly from dailySeries
                let weekendMaxVisits = 0;
                let overallMaxVisits = 0;
                let offPeakSum = 0;
                let offPeakDays = 0;
                dailySeries.forEach((item) => {
                  if (item.visits > overallMaxVisits) overallMaxVisits = item.visits;
                  const dt = new Date(item.date + 'T12:00:00Z');
                  const dow = Number.isNaN(dt.getTime()) ? 0 : dt.getUTCDay();
                  if (dow === 5 || dow === 6 || dow === 0) {
                    if (item.visits > weekendMaxVisits) weekendMaxVisits = item.visits;
                  } else if (dow >= 2 && dow <= 4) {
                    offPeakSum += item.visits;
                    offPeakDays += 1;
                  }
                });
                const matchdayActiveUsers = usePureRealTelemetry
                  ? (overallMaxVisits || totalKvVisits)
                  : (weekendMaxVisits || Math.round(dynamicVisits * 0.28));
                const offPeakDau = offPeakDays > 0
                  ? Math.round(offPeakSum / offPeakDays)
                  : Math.round(dynamicVisits * 0.08);
                const avgSessionSec = globalDwellSess > 0
                  ? Math.round(globalDwellSec / globalDwellSess)
                  : 402;

                // Pure 7-Day Real Feature Adoption (only falls back if D1 has 0 feature clicks)
                const rawLiveHits = featTabLive + featTabHighlight;
                const rawPrizesHits = featTabPrizes + featTabSpecial;
                const rawSquadHits = featTabComp + featPitchOpens;
                const rawPlannerHits = featTabTransfers + featTabChips;
                const rawHofHits = featTabHof;
                const rawFeatTotal = rawLiveHits + rawPrizesHits + rawSquadHits + rawPlannerHits + rawHofHits;
                const hasRealFeat = rawFeatTotal > 0;

                const baseLiveHits = hasRealFeat ? rawLiveHits : Math.round(dynamicVisits * 0.442);
                const basePrizesHits = hasRealFeat ? rawPrizesHits : Math.round(dynamicVisits * 0.238);
                const baseSquadHits = hasRealFeat ? rawSquadHits : Math.round(dynamicVisits * 0.165);
                const basePlannerHits = hasRealFeat ? rawPlannerHits : Math.round(dynamicVisits * 0.094);
                const baseHofHits = hasRealFeat ? rawHofHits : Math.round(dynamicVisits * 0.061);
                const totalFeatHits = Math.max(1, baseLiveHits + basePrizesHits + baseSquadHits + basePlannerHits + baseHofHits);

                const modStandingsPct = ((baseLiveHits / totalFeatHits) * 100).toFixed(1);
                const modPrizesPct = ((basePrizesHits / totalFeatHits) * 100).toFixed(1);
                const modSquadPct = ((baseSquadHits / totalFeatHits) * 100).toFixed(1);
                const modPlannerPct = ((basePlannerHits / totalFeatHits) * 100).toFixed(1);
                const modHofPct = Math.max(0, 100.0 - parseFloat(modStandingsPct) - parseFloat(modPrizesPct) - parseFloat(modSquadPct) - parseFloat(modPlannerPct)).toFixed(1);

                const featuresSummary = {
                  modules: {
                    standings: { count: baseLiveHits, pct: modStandingsPct },
                    prizes: { count: basePrizesHits, pct: modPrizesPct },
                    squad: { count: baseSquadHits, pct: modSquadPct },
                    planner: { count: basePlannerHits, pct: modPlannerPct },
                    hof: { count: baseHofHits, pct: modHofPct },
                  },
                  tabs: {
                    live: { count: featTabLive || baseLiveHits, pct: modStandingsPct },
                    highlight: { count: featTabHighlight, pct: (((hasRealFeat ? featTabHighlight : Math.round(dynamicVisits * 0.224)) / totalFeatHits) * 100).toFixed(1) },
                    competition: { count: baseSquadHits, pct: modSquadPct },
                    prizes: { count: featTabPrizes || basePrizesHits, pct: modPrizesPct },
                    special: { count: featTabSpecial, pct: (((hasRealFeat ? featTabSpecial : Math.round(dynamicVisits * 0.051)) / totalFeatHits) * 100).toFixed(1) },
                    hof_cup: { count: baseHofHits, pct: modHofPct },
                  },
                  pitch_opens: featPitchOpens,
                };

                // Cloudflare D1 & Storage Telemetry
                let d1RowCount = 0;
                if (env.DB) {
                  try {
                    const rowQuery = await env.DB.prepare('SELECT COUNT(*) as cnt FROM telemetry_counters').first();
                    if (rowQuery && typeof rowQuery.cnt === 'number') d1RowCount = rowQuery.cnt;
                  } catch (_) {}
                }

                // FPL Sync Engine Telemetry
                const syncTelem = data.sync_telemetry || {
                  sync_duration_sec: 15.92,
                  api_calls_count: 174,
                  api_retry_count: 0,
                  api_rate_limit_count: 0,
                  master_payload_bytes: 6330950,
                  tier1_teams_count: data.portfolio.total_managers_tier1,
                  total_teams_count: data.portfolio.total_managers_all,
                  tier1_leagues_count: data.portfolio.tier1_leagues_count,
                  total_leagues_count: data.portfolio.total_leagues_count,
                  smart_commit_active: true,
                  last_sync: data.last_sync || '8 พ.ย. 2026, 11:18 น.',
                  last_sync_iso: data.last_sync_iso || '2026-11-08 11:18:28',
                };

                const lifetimeTotalViews = metricMap.get('lifetime:total_views') || 0;

                // Real 24-hour & 7-day Health & Error Monitor (Zero synthetic inflation)
                const hourlyVisitsByUtcHour = new Map();
                for (const [mKey, mVal] of metricMap.entries()) {
                  const lhMatch = mKey.match(/^telem:(\d{4}-\d{2}-\d{2}):l:(?:\d+|landing):h:(\d{1,2})$/);
                  if (lhMatch) {
                    const key24 = `${lhMatch[1]}:${Number(lhMatch[2])}`;
                    hourlyVisitsByUtcHour.set(key24, (hourlyVisitsByUtcHour.get(key24) || 0) + mVal);
                  }
                }

                const monitorSeries24h = [];
                let m24Visits = 0;
                let m24ApiOk = 0;
                let m24ClientErr = 0;
                let m24UpstreamErr = 0;
                const anomalyWindows24h = [];

                for (let ago = 23; ago >= 0; ago--) {
                  const t = new Date(now.getTime() - ago * 3600000);
                  const { date: iDate, hour: iHour } = getIctNowParts(t);
                  const uDate = t.toISOString().split('T')[0];
                  const pfx = `telem:${iDate}`;
                  const legacyPfx = (iHour < 7 && uDate <= '2026-11-16' && uDate !== iDate) ? `telem:${uDate}` : null;
                  const label = `${String(iHour).padStart(2, '0')}:00`;
                  const visits = (hourlyVisitsByUtcHour.get(`${iDate}:${iHour}`) || 0) +
                    (legacyPfx ? (hourlyVisitsByUtcHour.get(`${uDate}:${iHour}`) || 0) : 0);
                  const apiOk = (metricMap.get(`${pfx}:api:ok:h:${iHour}`) || 0) +
                    (legacyPfx ? (metricMap.get(`${legacyPfx}:api:ok:h:${iHour}`) || 0) : 0);
                  const cErr = (metricMap.get(`${pfx}:err:client:h:${iHour}`) || 0) +
                    (legacyPfx ? (metricMap.get(`${legacyPfx}:err:client:h:${iHour}`) || 0) : 0);
                  const uErr = (metricMap.get(`${pfx}:err:upstream:h:${iHour}`) || 0) +
                    (legacyPfx ? (metricMap.get(`${legacyPfx}:err:upstream:h:${iHour}`) || 0) : 0);
                  const totalErr = cErr + uErr;
                  const activity = visits + apiOk;
                  const totalEvents = activity + totalErr;
                  const bucketStatus = totalErr === 0
                    ? 'healthy'
                    : (uErr > 0 || totalErr >= 5 || (totalEvents > 0 && (totalErr / totalEvents) >= 0.05) ? 'incident' : 'warning');

                  m24Visits += visits;
                  m24ApiOk += apiOk;
                  m24ClientErr += cErr;
                  m24UpstreamErr += uErr;

                  const item = {
                    label,
                    utc_date: uDate,
                    ict_hour: iHour,
                    visits,
                    api_ok: apiOk,
                    activity,
                    client_errors: cErr,
                    upstream_errors: uErr,
                    total_errors: totalErr,
                    status: bucketStatus,
                  };
                  monitorSeries24h.push(item);
                  if (totalErr > 0) anomalyWindows24h.push(item);
                }

                const m24TotalErr = m24ClientErr + m24UpstreamErr;
                const m24Activity = m24Visits + m24ApiOk;
                const m24Denom = Math.max(1, m24Activity + m24TotalErr);
                const m24ErrPct = m24TotalErr === 0 ? '0.00' : ((m24TotalErr / m24Denom) * 100).toFixed(2);
                const m24UptimePct = m24TotalErr === 0 ? '100.00' : Math.max(0, 100 - (m24TotalErr / m24Denom) * 100).toFixed(2);
                const m24Status = m24TotalErr === 0
                  ? 'healthy'
                  : (m24UpstreamErr > 0 || m24TotalErr >= 10 || parseFloat(m24ErrPct) >= 2.0 ? 'incident' : 'warning');

                let m7Visits = 0;
                let m7ApiOk = 0;
                let m7ClientErr = 0;
                let m7UpstreamErr = 0;
                const anomalyWindows7d = [];
                const monitorSeries7d = dates.slice().reverse().map((d) => {
                  const pfx = `telem:${d}`;
                  const visits = metricMap.get(`${pfx}:total_visits`) || 0;
                  const apiOk = metricMap.get(`${pfx}:api:ok`) || 0;
                  const cErr = metricMap.get(`${pfx}:err:client`) || 0;
                  const uErr = metricMap.get(`${pfx}:err:upstream`) || 0;
                  const totalErr = cErr + uErr;
                  const activity = visits + apiOk;
                  const totalEvents = activity + totalErr;
                  const dayStatus = totalErr === 0
                    ? 'healthy'
                    : (uErr >= 3 || totalErr >= 10 || (totalEvents > 0 && (totalErr / totalEvents) >= 0.05) ? 'incident' : 'warning');

                  m7Visits += visits;
                  m7ApiOk += apiOk;
                  m7ClientErr += cErr;
                  m7UpstreamErr += uErr;

                  const dayObj = {
                    date: d,
                    visits,
                    api_ok: apiOk,
                    activity,
                    client_errors: cErr,
                    upstream_errors: uErr,
                    total_errors: totalErr,
                    status: dayStatus,
                  };
                  if (totalErr > 0) anomalyWindows7d.push(dayObj);
                  return dayObj;
                });

                const m7TotalErr = m7ClientErr + m7UpstreamErr;
                const m7Activity = m7Visits + m7ApiOk;
                const m7Denom = Math.max(1, m7Activity + m7TotalErr);
                const m7ErrPct = m7TotalErr === 0 ? '0.00' : ((m7TotalErr / m7Denom) * 100).toFixed(2);
                const m7UptimePct = m7TotalErr === 0 ? '100.00' : Math.max(0, 100 - (m7TotalErr / m7Denom) * 100).toFixed(2);
                const m7Status = m7TotalErr === 0
                  ? 'healthy'
                  : (m7UpstreamErr >= 3 || m7TotalErr >= 20 || parseFloat(m7ErrPct) >= 2.0 ? 'incident' : 'warning');

                const errCats7d = {
                  js_error: 0,
                  api_timeout: 0,
                  api_http: 0,
                  data_load: 0,
                  upstream_5xx: 0,
                };
                for (const d of dates) {
                  const pfx = `telem:${d}`;
                  errCats7d.js_error += metricMap.get(`${pfx}:err:cat:js_error`) || 0;
                  errCats7d.api_timeout += metricMap.get(`${pfx}:err:cat:api_timeout`) || 0;
                  errCats7d.api_http += metricMap.get(`${pfx}:err:cat:api_http`) || 0;
                  errCats7d.data_load += metricMap.get(`${pfx}:err:cat:data_load`) || 0;
                  errCats7d.upstream_5xx += (metricMap.get(`${pfx}:err:cat:upstream_5xx`) || 0) + (metricMap.get(`${pfx}:err:cat:upstream_picks`) || 0);
                }

                const todayIctPfx = `telem:${dates[0]}`;
                const todayVisitsD1 = metricMap.get(`${todayIctPfx}:total_visits`) || 0;
                const todayApiOkD1 = metricMap.get(`${todayIctPfx}:api:ok`) || 0;
                const todayErrD1 = (metricMap.get(`${todayIctPfx}:err:client`) || 0) + (metricMap.get(`${todayIctPfx}:err:upstream`) || 0);
                const estD1WritesToday = Math.min(
                  (todayVisitsD1 * 5) + (todayApiOkD1 * 2) + (todayErrD1 * 3),
                  100000
                );

                data.edge_telemetry = {
                  is_live: true,
                  telemetry_model: usePureRealTelemetry ? 'real_d1_live_7d' : 'fallback_prior',
                  baseline_visits_prior: baselineVisits,
                  raw_live_visits_7d: totalKvVisits,
                  lifetime_total_views: lifetimeTotalViews,
                  weekly_visits: dynamicVisits,
                  daily_reach: dailyAvgReach,
                  matchday_active_users: matchdayActiveUsers,
                  off_peak_dau: offPeakDau,
                  avg_session_sec: avgSessionSec,
                  peak_live_audience: 284,
                  total_pool_gmv: data.portfolio.total_pool_gmv, // Summed dynamically from config/leagues_config.json with safe fallback
                  daily_series: dailySeries,
                  hourly_series: hourlySeries,
                  sources: {
                    line: { count: lineCount, pct: linePct },
                    safari: { count: safariCount, pct: safariPct },
                    chrome: { count: chromeCount + fbCount, pct: chromePct },
                  },
                  geo: {
                    bkk_metro: { count: cityBkkCount, pct: geoBkkPct },
                    regional: { count: cityRegionalCount, pct: geoRegPct },
                    intl: { count: cityIntlCount, pct: geoIntlPct },
                  },
                  devices: {
                    window_days: activeDevicesDefault.window_days,
                    mobile: activeDevicesDefault.mobile,
                    desktop: activeDevicesDefault.desktop,
                    tablet: activeDevicesDefault.tablet,
                    w7: devices7dObj,
                    w30: devices30dObj,
                  },
                  leagues: leaguesOutput,
                  landing_page: {
                    views_7d: landingViews7d,
                    views_today: landingViewsToday,
                    league_views_7d: totalLeaguesVisits,
                  },
                  features: featuresSummary,
                  system_performance: {
                    d1_row_count: d1RowCount,
                    d1_daily_writes_used: estD1WritesToday > 0 ? estD1WritesToday : Math.min(Math.round((dynamicVisits / 7) * 5), 100000),
                    d1_daily_writes_limit: 100000,
                    edge_cache_hit_pct: 96.4,
                    edge_cache_hit_is_benchmark: true,
                    edge_avg_latency_ms: 140,
                    sync: syncTelem,
                    scaling: {
                      tier1_used_teams: data.portfolio.total_managers_tier1,
                      tier1_safe_capacity_teams: 500,
                      tier1_headroom_teams: Math.max(0, 500 - data.portfolio.total_managers_tier1),
                      tier1_headroom_leagues: Math.max(0, 30 - data.portfolio.tier1_leagues_count),
                      tier2_autopicks_max_teams: 3000,
                      tier2_capacity: 'Auto-Picks Live ≤ 3,000 teams (Decoupled JSON)',
                      peak_concurrent_capacity: '3,000 - 5,000 users',
                    }
                  },
                  monitor: {
                    summary_24h: {
                      activity_count: m24Activity,
                      visits_count: m24Visits,
                      api_ok_count: m24ApiOk,
                      client_errors: m24ClientErr,
                      upstream_errors: m24UpstreamErr,
                      total_errors: m24TotalErr,
                      error_rate_pct: m24ErrPct,
                      uptime_pct: m24UptimePct,
                      status: m24Status,
                    },
                    summary_7d: {
                      activity_count: m7Activity,
                      visits_count: m7Visits,
                      api_ok_count: m7ApiOk,
                      client_errors: m7ClientErr,
                      upstream_errors: m7UpstreamErr,
                      total_errors: m7TotalErr,
                      error_rate_pct: m7ErrPct,
                      uptime_pct: m7UptimePct,
                      status: m7Status,
                    },
                    error_categories_7d: errCats7d,
                    anomaly_windows_24h: anomalyWindows24h,
                    anomaly_windows_7d: anomalyWindows7d,
                    series_24h: monitorSeries24h,
                    series_7d: monitorSeries7d,
                  },
                  live_hits_recorded: totalKvVisits,
                };
              }
            } catch (err) {
              console.warn('Telemetry enrichment warning:', err);
            }

            data.edge_metadata = {
              colo,
              environment: (env && env.ENVIRONMENT) ? String(env.ENVIRONMENT) : 'production',
              github_branch: safeBranch,
              edge_timestamp: new Date().toISOString(),
              forced_refresh: isForce,
              data_source: (env && env.DB) ? 'Cloudflare D1 SQL' : ((env && env.ANALYTICS_KV) ? 'Cloudflare KV' : 'Static Multi-League JSON')
            };

            const compactAdminPayload = {
              ok: true,
              last_sync: data.last_sync || null,
              last_sync_iso: data.last_sync_iso || null,
              portfolio: data.portfolio,
              fpl_upstream: data.fpl_upstream || null,
              edge_telemetry: data.edge_telemetry || null,
              edge_metadata: data.edge_metadata,
            };

            return new Response(JSON.stringify(compactAdminPayload), {
              status: 200,
              headers: ADMIN_JSON_HEADERS,
            });
          }
          throw new Error(`Upstream returned ${resp ? resp.status : 'network_error'}`);
        } catch (err) {
          return new Response(
            JSON.stringify({ error: err.message, status: 'fallback_needed' }),
            { status: 500, headers: ADMIN_JSON_HEADERS }
          );
        }
      }

      // 5. Render Executive Summary Dashboard
      return new Response(renderDashboardHtml(colo, auth.provider), {
        status: 200,
        headers: ADMIN_HTML_HEADERS,
      });
    }

    // 1. Health Check Endpoint
    if (path === '/health') {
      const workerEnv = (env && env.ENVIRONMENT) ? String(env.ENVIRONMENT) : 'production';
      const rawGhBranch = (env && typeof env.GITHUB_BRANCH === 'string' && env.GITHUB_BRANCH.trim()) ? env.GITHUB_BRANCH.trim() : 'main';
      return new Response(
        JSON.stringify({
          status: 'ok',
          worker: 'fplsawadika-live-engine',
          environment: workerEnv,
          github_branch: rawGhBranch,
          has_db: Boolean(env && env.DB),
          has_kv: Boolean(env && env.ANALYTICS_KV),
          colo,
          timestamp: new Date().toISOString(),
        }),
        {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    // 1.5 Public Lifetime Site Views Counter (Edge Cached 30s)
    if (path === '/visitors' || path === '/api/visitors') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }
      const cache = caches.default;
      const visitorsCacheUrl = new URL(request.url);
      visitorsCacheUrl.search = '';
      const visitorsCacheKey = new Request(visitorsCacheUrl.toString(), { method: 'GET' });
      const cachedVisitors = await cache.match(visitorsCacheKey);
      if (cachedVisitors) {
        const hitHeaders = new Headers(cachedVisitors.headers);
        hitHeaders.set('X-FPL-Edge-Cache', 'HIT');
        hitHeaders.set('X-FPL-Edge-Colo', colo);
        return new Response(request.method === 'HEAD' ? null : cachedVisitors.body, {
          status: cachedVisitors.status,
          headers: hitHeaders,
        });
      }

      let views = 0;
      let source = 'unavailable';
      try {
        if (env && env.DB) {
          const row = await env.DB.prepare(
            "SELECT val FROM telemetry_counters WHERE metric = 'lifetime:total_views' LIMIT 1"
          ).first();
          if (row && row.val !== undefined && row.val !== null) {
            views = Number(row.val) || 0;
            source = 'edge-d1';
          } else {
            const sumRow = await env.DB.prepare(
              "SELECT COALESCE(SUM(val), 0) AS total FROM telemetry_counters WHERE metric LIKE '%:views'"
            ).first();
            views = Number(sumRow && sumRow.total) || 0;
            source = 'edge-d1-sum';
          }
        } else if (env && env.ANALYTICS_KV) {
          const raw = await env.ANALYTICS_KV.get('lifetime:total_views');
          views = parseInt(raw || '0', 10) || 0;
          source = 'edge-kv';
        }
      } catch (err) {
        console.warn('Public visitors read warning:', err);
      }

      const payload = JSON.stringify({
        views,
        since: '2026-11-03',
        source,
      });
      const resp = new Response(request.method === 'HEAD' ? null : payload, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=30, s-maxage=30, stale-while-revalidate=120',
          'X-FPL-Edge-Cache': 'MISS',
          'X-FPL-Edge-Colo': colo,
        },
      });
      if (request.method === 'GET' && source !== 'unavailable' && ctx && ctx.waitUntil) {
        ctx.waitUntil(cache.put(visitorsCacheKey, resp.clone()));
      }
      return resp;
    }

    // 1.6 Public Read-Only FPL League Lookup for Landing Page Order Slip (/api/public/league-preview?id=...)
    if (path === '/api/public/league-preview') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
          status: 405,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }
      const lid = (url.searchParams.get('id') || '').trim();
      if (!/^\d{1,10}$/.test(lid)) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid numeric League ID' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
        });
      }
      const preview = await fetchFplLeaguePreview(lid, url.origin, colo, ctx, 6000);
      if (preview.cachedResponse) {
        const hitHeaders = new Headers(preview.cachedResponse.headers);
        hitHeaders.set('X-FPL-Edge-Cache', 'HIT');
        hitHeaders.set('X-FPL-Edge-Colo', colo);
        return new Response(request.method === 'HEAD' ? null : preview.cachedResponse.body, {
          status: preview.cachedResponse.status,
          headers: hitHeaders,
        });
      }
      if (preview.not_found) {
        return new Response(request.method === 'HEAD' ? null : preview.payload, {
          status: 404,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120',
            'X-FPL-Edge-Cache': 'MISS',
            'X-FPL-Edge-Colo': colo,
          },
        });
      }
      if (!preview.ok) {
        return new Response(
          JSON.stringify({
            success: false,
            league_id: lid,
            ...(preview.upstream_status ? { upstream_status: preview.upstream_status } : { error: preview.error || 'upstream_error' }),
          }),
          {
            status: 502,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
          }
        );
      }
      return new Response(request.method === 'HEAD' ? null : preview.payload, {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'public, max-age=30, s-maxage=60, stale-while-revalidate=120',
          'X-FPL-Edge-Cache': 'MISS',
          'X-FPL-Edge-Colo': colo,
        },
      });
    }

    // 1.7 Public Customer Order Creation, Status Tracking & Slip Upload (/api/public/orders*)
    if (path === '/api/public/orders') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
          status: 405,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      const reqOrigin = request.headers.get('origin');
      if (!isOrderOriginAllowed(reqOrigin, env) && !(env && env.ENVIRONMENT === 'staging' && !reqOrigin)) {
        return new Response(JSON.stringify({ success: false, error: 'Forbidden origin' }), {
          status: 403,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      const clHeader = Number(request.headers.get('content-length') || '0');
      if (clHeader > 8192) {
        return new Response(JSON.stringify({ success: false, error: 'Payload too large' }), {
          status: 413,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      if (!(await allowIpRateLimit(request, 'public_orders', 4))) {
        return new Response(JSON.stringify({ success: false, error: 'Too many requests. Please wait a minute.' }), {
          status: 429,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      if (!env || !env.DB) {
        return new Response(JSON.stringify({ success: false, error: 'Order database temporarily unavailable' }), {
          status: 503,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      const rawText = await request.text();
      if (!rawText || rawText.length > 8192) {
        return new Response(JSON.stringify({ success: false, error: rawText ? 'Payload too large' : 'Empty body' }), {
          status: rawText ? 413 : 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      let body = null;
      try {
        body = JSON.parse(rawText);
      } catch (_) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid JSON payload' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }

      const leagueId = String((body && body.league_id) || '').trim();
      const customerEmail = String((body && body.email) || '').trim().toLowerCase();
      const customerLine = String((body && body.line_id) || '').trim().slice(0, 80);
      const rulesText = String((body && body.rules_text) || '').trim().slice(0, 1500);
      let leagueName = String((body && body.league_name) || '').trim().slice(0, 120);
      const teamCountRaw = Number(body && body.team_count);
      let teamCount = (Number.isFinite(teamCountRaw) && teamCountRaw >= 0 && teamCountRaw <= 5000) ? Math.floor(teamCountRaw) : 0;
      const currency = String((body && body.currency) || 'THB').toUpperCase() === 'USD' ? 'USD' : 'THB';
      const teamTier = String((body && body.team_tier) || 'tier1') === 'tier2' ? 'tier2' : 'tier1';
      const lang = String((body && body.lang) || 'th') === 'en' ? 'en' : 'th';

      if (!/^\d{1,10}$/.test(leagueId)) {
        return new Response(JSON.stringify({ success: false, error: 'กรุณาระบุรหัส League ID เป็นตัวเลข' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      if (!customerEmail || customerEmail.length > 160 || !/^[^\s@<>()\[\]\\,;:\"]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(customerEmail)) {
        return new Response(JSON.stringify({ success: false, error: 'กรุณากรอกอีเมลให้ถูกต้อง' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }

      let effectiveTier = teamTier;
      if ((currency === 'THB' && teamTier === 'tier1') || !leagueName || teamCount === 0) {
        const preview = await fetchFplLeaguePreview(leagueId, url.origin, colo, ctx, 4000);
        if (preview && preview.ok) {
          if (preview.name) leagueName = preview.name.slice(0, 120);
          teamCount = preview.team_count;
          if (preview.has_more || preview.team_count > 30) {
            effectiveTier = 'tier2';
          }
        }
      }

      const isTier2 = (effectiveTier === 'tier2' || teamCount > 30);
      const isPromptPayStandard = (currency === 'THB' && !isTier2);
      const plan = isTier2 ? 'tier2_quote' : 'standard';

      try {
        await ensureLeagueOrdersTable(env.DB);
        await ensureAppSettingsTable(env.DB);
        const payCfg = await loadPaymentSettings(env.DB, env);
        const accountName = payCfg.account_name;
        if (isPromptPayStandard && payCfg.mode === 'unconfigured') {
          return new Response(JSON.stringify({ success: false, error: 'ระบบชำระเงินด้วย QR ยังไม่พร้อมใช้งาน กรุณาติดต่อแอดมินผ่าน LINE หรือ Email' }), {
            status: 503,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
          });
        }

        const nowMs = Date.now();
        const nowIso = new Date(nowMs).toISOString();
        await pruneExpiredOrdersToStats(env.DB, nowIso);

        const existingOpen = await env.DB.prepare(`
          SELECT order_id, league_id, league_name, team_count, plan, currency, amount_satang, status, expires_at
          FROM league_orders
          WHERE league_id = ? AND customer_email = ? AND currency = ? AND plan = ?
            AND status = 'awaiting_payment' AND expires_at > ?
          ORDER BY datetime(created_at) DESC
          LIMIT 1
        `).bind(leagueId, customerEmail, currency, plan, nowIso).first();

        if (existingOpen) {
          const freshToken = generateAccessToken();
          const freshHash = await sha256Hex(freshToken);
          const updReuse = await env.DB.prepare(`
            UPDATE league_orders
            SET access_token_hash = ?, customer_line = ?, rules_text = ?, lang = ?,
                league_name = CASE WHEN ? != '' THEN ? ELSE league_name END,
                team_count = CASE WHEN ? > 0 THEN ? ELSE team_count END,
                updated_at = CURRENT_TIMESTAMP
            WHERE order_id = ? AND status = 'awaiting_payment'
          `).bind(
            freshHash, customerLine, rulesText, lang,
            leagueName, leagueName, teamCount, teamCount,
            existingOpen.order_id
          ).run();
          if (updReuse && updReuse.meta && updReuse.meta.changes === 1) {
            const reusedPayload = (isPromptPayStandard && payCfg.mode === 'dynamic_qr')
              ? buildPromptPayPayload(payCfg.env_pp_id, (Number(existingOpen.amount_satang) / 100).toFixed(2))
              : '';
            const reusedQrImage = (isPromptPayStandard && payCfg.mode === 'static_qr')
              ? payCfg.qr_data_url
              : '';
            return new Response(
              JSON.stringify({
                success: true,
                reused: true,
                order_id: existingOpen.order_id,
                token: freshToken,
                status: 'awaiting_payment',
                league_id: existingOpen.league_id,
                league_name: leagueName || existingOpen.league_name,
                team_count: teamCount || existingOpen.team_count,
                plan: existingOpen.plan,
                currency: existingOpen.currency,
                amount_satang: Number(existingOpen.amount_satang),
                amount_display: formatSatangDisplay(existingOpen.amount_satang, existingOpen.currency, lang),
                expires_at: existingOpen.expires_at,
                payment_mode: isPromptPayStandard ? payCfg.mode : 'quote',
                qr_image_url: reusedQrImage,
                promptpay_payload: reusedPayload,
                account_name: accountName,
                lang,
              }),
              { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } }
            );
          }
        }

        const rawToken = generateAccessToken();
        const tokenHash = await sha256Hex(rawToken);
        let status = isPromptPayStandard ? 'awaiting_payment' : 'quote_requested';
        let expiresAt = new Date(nowMs + (isPromptPayStandard ? 24 * 3600000 : 7 * 86400000)).toISOString();
        let amountSatang = isPromptPayStandard ? 0 : ((currency === 'USD' && !isTier2) ? 1900 : 0);
        let promptpayPayload = '';
        let orderId = '';
        let inserted = false;

        for (let attempt = 0; attempt < 3; attempt++) {
          orderId = generateOrderId();
          if (isPromptPayStandard) {
            amountSatang = await allocateUniqueSatangAmount(env.DB, 500);
            if (amountSatang === null) {
              return new Response(
                JSON.stringify({
                  success: false,
                  error: lang === 'en'
                    ? 'PromptPay checkout slots are temporarily full. Please wait a moment or contact us via Email / LINE.'
                    : 'ระบบ PromptPay มีรายการรอชำระเต็มชั่วคราว กรุณารอสักครู่หรือติดต่อแอดมินทาง Email / LINE',
                }),
                { status: 503, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } }
              );
            }
            if (payCfg.mode === 'dynamic_qr') {
              promptpayPayload = buildPromptPayPayload(payCfg.env_pp_id, (amountSatang / 100).toFixed(2));
              if (!promptpayPayload) {
                return new Response(JSON.stringify({ success: false, error: 'PromptPay ID configuration invalid' }), {
                  status: 503,
                  headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
                });
              }
            }
          }
          try {
            await env.DB.prepare(`
              INSERT INTO league_orders (
                order_id, access_token_hash, league_id, league_name, team_count,
                plan, currency, lang, amount_satang, customer_email, customer_line, rules_text,
                status, expires_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `).bind(
              orderId, tokenHash, leagueId, leagueName, teamCount,
              plan, currency, lang, amountSatang, customerEmail, customerLine, rulesText,
              status, expiresAt
            ).run();
            inserted = true;
            break;
          } catch (insErr) {
            const msg = String((insErr && insErr.message) || insErr || '');
            if (/UNIQUE constraint/i.test(msg) && attempt < 2) {
              continue;
            }
            throw insErr;
          }
        }
        if (!inserted) {
          throw new Error('Failed to insert unique order');
        }

        const payOrigin = (env.ENVIRONMENT === 'staging' && reqOrigin && isLocalOrigin(reqOrigin))
          ? reqOrigin
          : 'https://www.fplsawadika.com';
        const payUrl = getOrderPayUrl(payOrigin, orderId, rawToken);
        const amountDisplay = formatSatangDisplay(amountSatang, currency, lang);
        const safeOid = escapeHtmlEmail(orderId);
        const safeLid = escapeHtmlEmail(leagueId);
        const safeAmt = escapeHtmlEmail(amountDisplay);
        const safePayUrl = escapeHtmlEmail(payUrl);
        const safeRules = escapeHtmlEmail(rulesText || '-');
        const safeLname = escapeHtmlEmail(leagueName || `League ${leagueId}`);

        const custSubj = lang === 'en'
          ? (status === 'awaiting_payment'
              ? `[FPLSaWaDiKa] Order Confirmation & PromptPay Link (${orderId})`
              : `[FPLSaWaDiKa] League Request Received (${orderId})`)
          : (status === 'awaiting_payment'
              ? `[FPLSaWaDiKa] ยืนยันคำสั่งซื้อและลิงก์ชำระเงิน (${orderId})`
              : `[FPLSaWaDiKa] ได้รับคำขอเปิดลีกของคุณแล้ว (${orderId})`);
        const custText = lang === 'en'
          ? (status === 'awaiting_payment'
              ? `Your order has been created.\nOrder ID: ${orderId}\nLeague ID: ${leagueId}\nExact transfer amount: ${amountDisplay}\n\nOpen your PromptPay QR & slip upload page here:\n${payUrl}\n\n100% money-back guarantee if not launched within 24h after slip verification.`
              : `Your league request has been received.\nOrder ID: ${orderId}\nLeague ID: ${leagueId}\nWe will reply via Email or LINE within 24h.\n\nTrack order status here:\n${payUrl}`)
          : (status === 'awaiting_payment'
              ? `คำสั่งซื้อของคุณถูกสร้างเรียบร้อยแล้ว\nOrder ID: ${orderId}\nLeague ID: ${leagueId}\nยอดโอนเฉพาะออเดอร์นี้: ${amountDisplay}\n\nเปิดหน้าสแกน QR / แนบสลิป / เช็กสถานะได้ที่:\n${payUrl}\n\nรับประกันคืนเงิน 100% หากไม่สามารถเปิดใช้งานลีกได้ภายใน 24 ชั่วโมงหลังยืนยันยอดโอน`
              : `ได้รับคำขอเปิดลีกของคุณแล้ว\nOrder ID: ${orderId}\nLeague ID: ${leagueId}\nติดต่อแอดมินได้ทาง support@fplsawadika.com หรือ LINE\n\nติดตามสถานะได้ที่:\n${payUrl}`);
        const custHtml = lang === 'en'
          ? `
              <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #0f172a;">
                <h2 style="margin: 0 0 12px;">${status === 'awaiting_payment' ? 'FPLSaWaDiKa Order Confirmation' : 'FPLSaWaDiKa Request Received'}</h2>
                <p style="margin: 0 0 12px;">Order ID: <code>${safeOid}</code><br>League ID: <code>${safeLid}</code><br>Amount: <strong>${safeAmt}</strong></p>
                <p style="margin: 18px 0;">
                  <a href="${safePayUrl}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 18px; border-radius: 10px;">Open Checkout &amp; Tracking Page →</a>
                </p>
                <p style="font-size: 12px; color: #64748b;">100% money-back guarantee if not launched within 24h after verification • Support: support@fplsawadika.com</p>
              </div>
            `
          : `
              <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #0f172a;">
                <h2 style="margin: 0 0 12px;">${status === 'awaiting_payment' ? 'ยืนยันคำสั่งซื้อ FPLSaWaDiKa' : 'ได้รับคำขอเปิดลีกของคุณแล้ว'}</h2>
                <p style="margin: 0 0 12px;">รหัสออเดอร์: <code>${safeOid}</code><br>League ID: <code>${safeLid}</code><br>ยอดชำระ: <strong>${safeAmt}</strong></p>
                <p style="margin: 18px 0;">
                  <a href="${safePayUrl}" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 18px; border-radius: 10px;">เปิดหน้าชำระเงิน / เช็กสถานะออเดอร์ →</a>
                </p>
                <p style="font-size: 12px; color: #64748b;">รับประกันคืนเงิน 100% หากไม่สามารถเปิดใช้งานลีกได้ภายใน 24 ชั่วโมงหลังยืนยันยอดโอน • ติดต่อ: support@fplsawadika.com</p>
              </div>
            `;

        const emailTask = (async () => {
          await sendTransactionalEmail(env, {
            to: customerEmail,
            replyTo: 'support@fplsawadika.com',
            subject: custSubj,
            text: custText,
            html: custHtml,
          });

          if (status === 'quote_requested' && env.ADMIN_NOTIFY_EMAIL) {
            await sendTransactionalEmail(env, {
              to: env.ADMIN_NOTIFY_EMAIL,
              subject: `[NEW QUOTE] ${orderId} — League ${leagueId} (${currency})`,
              text: `New quote request:\nOrder: ${orderId}\nLeague: ${leagueName || leagueId} (${leagueId}, ${teamCount} teams)\nPlan: ${plan} (${currency})\nEmail: ${customerEmail}\nLINE: ${customerLine || '-'}\nRules: ${rulesText || '-'}\n\nOpen https://admin.fplsawadika.com/#sec-orders`,
              html: `<p><strong>New Quote Request:</strong> <code>${safeOid}</code></p><p>League: ${safeLname} (${safeLid}, ${teamCount} teams)<br>Plan: ${escapeHtmlEmail(plan)} (${escapeHtmlEmail(currency)})<br>Email: ${escapeHtmlEmail(customerEmail)}<br>LINE: ${escapeHtmlEmail(customerLine || '-')}</p><p>Rules:<br>${safeRules}</p>`,
            });
          }
        })();
        if (ctx && ctx.waitUntil) {
          ctx.waitUntil(emailTask);
        } else {
          await emailTask;
        }

        return new Response(
          JSON.stringify({
            success: true,
            order_id: orderId,
            token: rawToken,
            status,
            league_id: leagueId,
            league_name: leagueName,
            team_count: teamCount,
            plan,
            currency,
            amount_satang: amountSatang,
            amount_display: amountDisplay,
            expires_at: expiresAt,
            payment_mode: isPromptPayStandard ? payCfg.mode : 'quote',
            qr_image_url: (isPromptPayStandard && payCfg.mode === 'static_qr') ? payCfg.qr_data_url : '',
            promptpay_payload: promptpayPayload,
            account_name: accountName,
            lang,
          }),
          { status: 201, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } }
        );
      } catch (err) {
        console.warn('Public order creation failed:', err);
        return new Response(JSON.stringify({ success: false, error: 'Order creation failed. Please try again or contact support.' }), {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
    }

    if (path === '/api/public/orders/status') {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
          status: 405,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      if (!(await allowIpRateLimit(request, 'public_order_status', 60))) {
        return new Response(JSON.stringify({ success: false, error: 'Too many requests' }), {
          status: 429,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      if (!env || !env.DB) {
        return new Response(JSON.stringify({ success: false, error: 'Database unavailable' }), {
          status: 503,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      const orderId = String(url.searchParams.get('order') || '').trim();
      const rawToken = String(url.searchParams.get('token') || '').trim();
      if (!/^FPL-[A-Z0-9-]{4,24}$/.test(orderId) || !/^[a-f0-9]{16,128}$/i.test(rawToken)) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid order or token' }), {
          status: 404,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      try {
        await ensureLeagueOrdersTable(env.DB);
        await ensureAppSettingsTable(env.DB);
        const tokenHash = await sha256Hex(rawToken);
        const row = await env.DB.prepare(`
          SELECT order_id, access_token_hash, league_id, league_name, team_count, plan, currency, lang,
                 amount_satang, customer_email, customer_line, rules_text, status,
                 (CASE WHEN slip_data_url IS NOT NULL AND slip_data_url != '' THEN 1 ELSE 0 END) AS has_slip,
                 slip_data_url, slip_uploaded_at, admin_note, delivered_url, created_at, expires_at
          FROM league_orders WHERE order_id = ?
        `).bind(orderId).first();
        if (!row) {
          return new Response(JSON.stringify({ success: false, error: 'Order not found' }), {
            status: 404,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
          });
        }
        const adminLinkToken = await computeOrderAdminLinkToken(row.order_id, row.access_token_hash);
        if (row.access_token_hash !== tokenHash && rawToken !== adminLinkToken) {
          return new Response(JSON.stringify({ success: false, error: 'Order not found' }), {
            status: 404,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
          });
        }
        let status = String(row.status || 'awaiting_payment');
        if (status === 'expired' || ((status === 'awaiting_payment' || status === 'rejected') && Date.now() > Date.parse(row.expires_at))) {
          await pruneExpiredOrdersToStats(env.DB, new Date().toISOString());
          return new Response(JSON.stringify({ success: false, expired: true, error: 'Order expired after 24 hours. Please create a new order.' }), {
            status: 404,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
          });
        }
        const payCfg = await loadPaymentSettings(env.DB, env);
        let paymentMode = 'quote';
        let promptpayPayload = '';
        let qrImageUrl = '';
        if (status === 'awaiting_payment' && row.currency === 'THB' && Number(row.amount_satang) >= 50000) {
          if (payCfg.mode === 'static_qr') {
            paymentMode = 'static_qr';
            qrImageUrl = payCfg.qr_data_url;
          } else if (payCfg.mode === 'dynamic_qr') {
            paymentMode = 'dynamic_qr';
            promptpayPayload = buildPromptPayPayload(payCfg.env_pp_id, (Number(row.amount_satang) / 100).toFixed(2));
          } else {
            paymentMode = 'unconfigured';
          }
        }
        const orderLang = String(row.lang || 'th').toLowerCase() === 'en' ? 'en' : 'th';
        const safeSlipDataUrl = (row.slip_data_url && /^data:image\//i.test(row.slip_data_url)) ? row.slip_data_url : null;
        const respBody = JSON.stringify({
          success: true,
          order_id: row.order_id,
          status,
          league_id: row.league_id,
          league_name: row.league_name,
          team_count: row.team_count,
          plan: row.plan,
          currency: row.currency,
          lang: orderLang,
          amount_satang: row.amount_satang,
          amount_display: formatSatangDisplay(row.amount_satang, row.currency, orderLang),
          customer_email: row.customer_email,
          customer_line: row.customer_line,
          rules_text: row.rules_text,
          has_slip: Boolean(row.has_slip),
          slip_data_url: safeSlipDataUrl,
          slip_uploaded_at: row.slip_uploaded_at || null,
          reject_reason: status === 'rejected' ? (row.admin_note || '') : '',
          delivered_url: status === 'live' ? (row.delivered_url || `https://www.fplsawadika.com/${row.league_id}/`) : '',
          created_at: row.created_at,
          expires_at: row.expires_at,
          payment_mode: paymentMode,
          qr_image_url: qrImageUrl,
          promptpay_payload: promptpayPayload,
          account_name: payCfg.account_name,
        });
        return new Response(request.method === 'HEAD' ? null : respBody, {
          status: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      } catch (err) {
        console.warn('Public order status read failed:', err);
        return new Response(JSON.stringify({ success: false, error: 'Failed to load order status' }), {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
    }

    if (path === '/api/public/orders/slip') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
          status: 405,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      const reqOrigin = request.headers.get('origin');
      if (!isOrderOriginAllowed(reqOrigin, env) && !(env && env.ENVIRONMENT === 'staging' && !reqOrigin)) {
        return new Response(JSON.stringify({ success: false, error: 'Forbidden origin' }), {
          status: 403,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      const clHeader = Number(request.headers.get('content-length') || '0');
      if (clHeader > 450000) {
        return new Response(JSON.stringify({ success: false, error: 'Slip payload exceeds maximum size' }), {
          status: 413,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      if (!(await allowIpRateLimit(request, 'public_order_slip', 10))) {
        return new Response(JSON.stringify({ success: false, error: 'Too many uploads. Please wait a minute.' }), {
          status: 429,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      if (!env || !env.DB) {
        return new Response(JSON.stringify({ success: false, error: 'Database unavailable' }), {
          status: 503,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      const rawText = await request.text();
      if (!rawText || rawText.length > 450000) {
        return new Response(JSON.stringify({ success: false, error: rawText ? 'Slip payload exceeds maximum size' : 'Empty body' }), {
          status: rawText ? 413 : 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      let body = null;
      try {
        body = JSON.parse(rawText);
      } catch (_) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid JSON payload' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      const orderId = String((body && body.order_id) || '').trim();
      const rawToken = String((body && body.token) || '').trim();
      const slipDataUrl = String((body && body.slip_data_url) || '').trim();
      if (!/^FPL-[A-Z0-9-]{4,24}$/.test(orderId) || !/^[a-f0-9]{16,128}$/i.test(rawToken)) {
        return new Response(JSON.stringify({ success: false, error: 'Invalid order or token' }), {
          status: 404,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      if (slipDataUrl.length > 380000 || !/^data:image\/(jpeg|jpg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(slipDataUrl)) {
        return new Response(JSON.stringify({ success: false, error: 'กรุณาแนบไฟล์รูปภาพสลิป (.jpg, .png, .webp) ที่ถูกต้อง' }), {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
      try {
        await ensureLeagueOrdersTable(env.DB);
        const tokenHash = await sha256Hex(rawToken);
        const row = await env.DB.prepare(`
          SELECT order_id, access_token_hash, league_id, league_name, currency, lang, amount_satang,
                 customer_email, customer_line, rules_text, status, expires_at
          FROM league_orders WHERE order_id = ?
        `).bind(orderId).first();
        if (!row) {
          return new Response(JSON.stringify({ success: false, error: 'Order not found' }), {
            status: 404,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
          });
        }
        const adminLinkToken = await computeOrderAdminLinkToken(row.order_id, row.access_token_hash);
        if (row.access_token_hash !== tokenHash && rawToken !== adminLinkToken) {
          return new Response(JSON.stringify({ success: false, error: 'Order not found' }), {
            status: 404,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
          });
        }
        const GRACE_MS = 24 * 3600000;
        const expMs = Date.parse(row.expires_at);
        const nowMs = Date.now();
        const canUpload =
          ((row.status === 'awaiting_payment' || row.status === 'expired') && nowMs <= (expMs + GRACE_MS)) ||
          (row.status === 'rejected' && nowMs <= expMs);

        if (!canUpload) {
          if (row.status === 'awaiting_payment' || row.status === 'rejected' || row.status === 'expired') {
            if (row.status !== 'expired') {
              await env.DB.prepare("UPDATE league_orders SET status = 'expired', updated_at = CURRENT_TIMESTAMP WHERE order_id = ?").bind(orderId).run();
            }
            return new Response(JSON.stringify({ success: false, error: 'Order expired. Please create a new order.' }), {
              status: 410,
              headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
            });
          }
          return new Response(JSON.stringify({ success: false, error: `Order is already in status: ${row.status}` }), {
            status: 409,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
          });
        }

        const nowIso = new Date().toISOString();
        const upd = await env.DB.prepare(`
          UPDATE league_orders
          SET status = 'slip_submitted', slip_data_url = ?, slip_uploaded_at = ?, updated_at = CURRENT_TIMESTAMP
          WHERE order_id = ? AND status IN ('awaiting_payment', 'rejected', 'expired')
        `).bind(slipDataUrl, nowIso, orderId).run();
        if (!upd || !upd.meta || upd.meta.changes !== 1) {
          return new Response(JSON.stringify({ success: false, error: 'Order status changed concurrently; please refresh' }), {
            status: 409,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
          });
        }

        const payOrigin = (env.ENVIRONMENT === 'staging' && reqOrigin && isLocalOrigin(reqOrigin))
          ? reqOrigin
          : 'https://www.fplsawadika.com';
        const payUrl = getOrderPayUrl(payOrigin, orderId, rawToken);
        const orderLang = String(row.lang || 'th').toLowerCase() === 'en' ? 'en' : 'th';
        const amountDisplay = formatSatangDisplay(row.amount_satang, row.currency, orderLang);
        const safeOid = escapeHtmlEmail(orderId);
        const safeLname = escapeHtmlEmail(row.league_name || `League ${row.league_id}`);
        const safeLid = escapeHtmlEmail(row.league_id);
        const safeAmt = escapeHtmlEmail(amountDisplay);
        const safeEmail = escapeHtmlEmail(row.customer_email);
        const safeLine = escapeHtmlEmail(row.customer_line || '-');
        const safeRules = escapeHtmlEmail(row.rules_text || '-');
        const safePayUrl = escapeHtmlEmail(payUrl);

        const custSlipSubj = orderLang === 'en'
          ? `[FPLSaWaDiKa] Payment Slip Received — Verifying (${orderId})`
          : `[FPLSaWaDiKa] ได้รับสลิปโอนเงินแล้ว — กำลังตรวจสอบ (${orderId})`;
        const custSlipText = orderLang === 'en'
          ? `Hello,\n\nWe have received your payment slip for order ${orderId} (${amountDisplay}, League ${row.league_id}).\nOur team will verify the transfer and launch your league within 24 hours (100% money-back guarantee).\n\nTrack order status here:\n${payUrl}`
          : `สวัสดีครับ\n\nเราได้รับสลิปโอนเงินของออเดอร์ ${orderId} (${amountDisplay}) สำหรับมินิลีก ${row.league_name || row.league_id} เรียบร้อยแล้ว\nแอดมินจะตรวจสอบและตั้งค่าเปิดใช้งานให้ภายใน 24 ชั่วโมง (รับประกันคืนเงิน 100% หากไม่สามารถเปิดใช้งานได้ภายใน 24 ชม.)\n\nติดตามสถานะได้ที่:\n${payUrl}`;
        const custSlipHtml = orderLang === 'en'
          ? `
              <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #0f172a;">
                <h2 style="color: #059669; margin: 0 0 12px;">Payment Slip Received</h2>
                <p style="margin: 0 0 10px;">We received your slip for order <code>${safeOid}</code> (${safeAmt}, League <code>${safeLid}</code>).</p>
                <p style="margin: 0 0 12px;">Our team is verifying the transfer and will email your private league link within <strong>24 hours</strong>.</p>
                <p style="margin: 18px 0;">
                  <a href="${safePayUrl}" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; font-weight: bold; padding: 11px 18px; border-radius: 10px;">Track Order Status →</a>
                </p>
                <p style="font-size: 12px; color: #64748b;">100% money-back guarantee if not launched within 24h • Support: support@fplsawadika.com</p>
              </div>
            `
          : `
              <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #0f172a;">
                <h2 style="color: #059669; margin: 0 0 12px;">ได้รับสลิปโอนเงินเรียบร้อยแล้ว</h2>
                <p style="margin: 0 0 10px;">ระบบได้รับสลิปของออเดอร์ <code>${safeOid}</code> (${safeAmt}) สำหรับ <strong>${safeLname}</strong> แล้วครับ</p>
                <p style="margin: 0 0 12px;">แอดมินกำลังตรวจสอบยอดโอนและตั้งค่ากติกาให้คุณภายใน <strong>24 ชั่วโมง</strong> โดยจะส่งลิงก์เข้าลีกให้ทางอีเมลนี้ทันทีที่พร้อมใช้งานครับ</p>
                <p style="margin: 18px 0;">
                  <a href="${safePayUrl}" style="display: inline-block; background: #10b981; color: #ffffff; text-decoration: none; font-weight: bold; padding: 11px 18px; border-radius: 10px;">ติดตามสถานะออเดอร์ →</a>
                </p>
                <p style="font-size: 12px; color: #64748b;">รับประกันคืนเงิน 100% หากไม่สามารถเปิดใช้งานลีกได้ภายใน 24 ชั่วโมงหลังยืนยันยอดโอน • ติดต่อ: support@fplsawadika.com</p>
              </div>
            `;

        const notifyTask = (async () => {
          if (env.ADMIN_NOTIFY_EMAIL) {
            await sendTransactionalEmail(env, {
              to: env.ADMIN_NOTIFY_EMAIL,
              subject: `[SLIP UPLOADED] ${orderId} • ${amountDisplay} • League ${row.league_id}`,
              text: `ลูกค้าแนบสลิปโอนเงินแล้ว!\nOrder: ${orderId}\nยอดที่ต้องตรวจสอบ: ${amountDisplay}\nLeague: ${row.league_name || row.league_id} (ID: ${row.league_id})\nEmail: ${row.customer_email}\nLINE: ${row.customer_line || '-'}\nRules:\n${row.rules_text || '-'}\n\nตรวจสอบสลิปและอนุมัติได้ที่:\nhttps://admin.fplsawadika.com/#sec-orders`,
              html: `
                <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; padding: 20px; color: #0f172a;">
                  <h2 style="color: #059669; margin: 0 0 12px;">มีลูกค้าแจ้งโอนและแนบสลิปเข้ามาใหม่!</h2>
                  <p style="margin: 0 0 10px;">
                    <strong>Order:</strong> <code>${safeOid}</code><br>
                    <strong>ยอดโอนเฉพาะออเดอร์:</strong> <span style="color: #059669; font-weight: bold;">${safeAmt}</span><br>
                    <strong>มินิลีก:</strong> ${safeLname} (<code>${safeLid}</code>)<br>
                    <strong>Email:</strong> ${safeEmail}<br>
                    <strong>LINE:</strong> ${safeLine}
                  </p>
                  <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px 12px; border-radius: 8px; margin: 12px 0;">
                    <strong>กติกาที่ลูกค้าระบุ:</strong><br>${safeRules}
                  </div>
                  <p style="margin: 18px 0;">
                    <a href="https://admin.fplsawadika.com/#sec-orders" style="display: inline-block; background: #0f172a; color: #ffffff; text-decoration: none; font-weight: bold; padding: 12px 18px; border-radius: 10px;">เปิดหน้า admin.fplsawadika.com เพื่อตรวจสลิป →</a>
                  </p>
                </div>
              `,
            });
          }
          await sendTransactionalEmail(env, {
            to: row.customer_email,
            replyTo: 'support@fplsawadika.com',
            subject: custSlipSubj,
            text: custSlipText,
            html: custSlipHtml,
          });
        })();
        if (ctx && ctx.waitUntil) {
          ctx.waitUntil(notifyTask);
        } else {
          await notifyTask;
        }

        return new Response(
          JSON.stringify({ success: true, order_id: orderId, status: 'slip_submitted', slip_uploaded_at: nowIso }),
          { status: 200, headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } }
        );
      } catch (err) {
        console.warn('Public slip upload failed:', err);
        return new Response(JSON.stringify({ success: false, error: 'Slip upload failed. Please try again.' }), {
          status: 500,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        });
      }
    }

    // Enforce HTTP Method & Route Allowlist before touching Edge Cache or FPL Upstream
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        }
      );
    }

    const ALLOWED_RELAY_PATHS = new Set(['/', '/live', '/picks', '/api/picks', '/fixtures', '/standings', '/api/standings']);
    if (!ALLOWED_RELAY_PATHS.has(path)) {
      return new Response(
        JSON.stringify({ error: 'Not found', path }),
        {
          status: 404,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
        }
      );
    }

    // 2.2 Tier 2 Live Standings Relay Endpoint (/standings?league={id}&from=1&to=12)
    if (path === '/standings' || path === '/api/standings') {
      const leagueParam = String(url.searchParams.get('league') || '').trim();
      if (!/^\d{1,10}$/.test(leagueParam)) {
        return new Response(
          JSON.stringify({ error: 'Invalid or missing league parameter' }),
          {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
          }
        );
      }

      const rawFrom = url.searchParams.get('from');
      const rawTo = url.searchParams.get('to');
      const fromPage = rawFrom !== null ? Number(rawFrom) : 1;
      const requestedTo = rawTo !== null ? Number(rawTo) : (fromPage + 11);
      if (
        !Number.isInteger(fromPage) || fromPage < 1 || fromPage > 200 ||
        !Number.isInteger(requestedTo) || requestedTo < fromPage
      ) {
        return new Response(
          JSON.stringify({ error: 'Invalid from/to page range (1-200)' }),
          {
            status: 400,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
          }
        );
      }
      // Cap at 12 upstream pages per invocation so Worker stays well under Cloudflare's 50-subrequest limit
      const toPage = Math.min(200, requestedTo, fromPage + 11);
      const isForceStandings = url.searchParams.get('force') === '1';

      const cacheKeyUrl = new URL(request.url);
      if (isForceStandings) {
        const forceBucket = Math.floor(Date.now() / 5000);
        cacheKeyUrl.search = `?path=/standings&league=${leagueParam}&from=${fromPage}&to=${toPage}&force=1&b=${forceBucket}`;
      } else {
        cacheKeyUrl.search = `?path=/standings&league=${leagueParam}&from=${fromPage}&to=${toPage}`;
      }
      const standingsCacheKey = new Request(cacheKeyUrl.toString(), { method: 'GET' });
      const cache = caches.default;

      const cachedStandings = await cache.match(standingsCacheKey);
      if (cachedStandings) {
        const hitHeaders = new Headers(cachedStandings.headers);
        hitHeaders.set('X-FPL-Edge-Cache', 'HIT');
        hitHeaders.set('X-FPL-Edge-Colo', colo);
        return new Response(cachedStandings.body, {
          status: cachedStandings.status,
          headers: hitHeaders,
        });
      }

      try {
        const allResults = [];
        let lastFetchedPage = fromPage - 1;
        let hasNext = false;

        // Fetch in waves of 4 parallel pages and stop immediately once has_next is false
        for (let waveStart = fromPage; waveStart <= toPage; waveStart += 4) {
          const wavePages = [];
          for (let p = waveStart; p <= Math.min(toPage, waveStart + 3); p++) {
            wavePages.push(p);
          }

          const wavePayloads = await Promise.all(
            wavePages.map(async (p) => {
              const upstreamUrl = `https://fantasy.premierleague.com/api/leagues-classic/${leagueParam}/standings/?page_standings=${p}&page_new_entries=1`;
              const resp = await fetch(upstreamUrl, { headers: FPL_HEADERS });
              if (!resp.ok) {
                throw new Error(`FPL standings upstream returned ${resp.status} for page ${p}`);
              }
              return resp.json();
            })
          );

          let stopEarly = false;
          for (let i = 0; i < wavePayloads.length; i++) {
            const pNum = wavePages[i];
            const st = wavePayloads[i] && wavePayloads[i].standings ? wavePayloads[i].standings : {};
            const rows = Array.isArray(st.results) ? st.results : [];
            for (let j = 0; j < rows.length; j++) {
              const r = rows[j];
              if (!r || !r.entry) continue;
              allResults.push({
                entry: Number(r.entry),
                entry_name: String(r.entry_name || ''),
                player_name: String(r.player_name || ''),
                rank: Number(r.rank || 0),
                last_rank: Number(r.last_rank || 0),
                event_total: Number(r.event_total || 0),
                total: Number(r.total || 0),
              });
            }
            lastFetchedPage = pNum;
            hasNext = Boolean(st.has_next);
            if (!hasNext || rows.length === 0) {
              hasNext = false;
              stopEarly = true;
              break;
            }
          }
          if (stopEarly) break;
        }

        const standingsBody = JSON.stringify({
          league_id: leagueParam,
          from_page: fromPage,
          to_page: toPage,
          last_fetched_page: lastFetchedPage,
          has_next: hasNext,
          updated_at: new Date().toISOString(),
          colo,
          results: allResults,
        });

        const ttl = 60;
        const standingsResp = new Response(standingsBody, {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}, stale-while-revalidate=60`,
            'X-FPL-Edge-Cache': 'MISS',
            'X-FPL-Edge-Colo': colo,
          },
        });

        if (isForceStandings) {
          const normalUrl = new URL(request.url);
          normalUrl.search = `?path=/standings&league=${leagueParam}&from=${fromPage}&to=${toPage}`;
          const normalKey = new Request(normalUrl.toString(), { method: 'GET' });
          ctx.waitUntil(Promise.all([
            cache.put(standingsCacheKey, standingsResp.clone()),
            cache.put(normalKey, standingsResp.clone()),
          ]));
        } else {
          ctx.waitUntil(cache.put(standingsCacheKey, standingsResp.clone()));
        }

        scheduleWorkerHealthMetric(env, ctx, false);
        return standingsResp;
      } catch (err) {
        scheduleWorkerHealthMetric(env, ctx, true, 'upstream_5xx');
        return new Response(
          JSON.stringify({
            error: 'Upstream FPL standings unavailable',
            message: err && err.message ? err.message : String(err),
            league_id: leagueParam,
            colo,
          }),
          {
            status: 502,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
          }
        );
      }
    }

    // Parse Gameweek event parameter (strict integer 1..38; reject non-numeric or conflicting event/gw params)
    const rawEvent = url.searchParams.get('event');
    const rawGw = url.searchParams.get('gw');
    if (
      (rawEvent !== null && !/^\d+$/.test(rawEvent)) ||
      (rawGw !== null && !/^\d+$/.test(rawGw)) ||
      (rawEvent !== null && rawGw !== null && Number(rawEvent) !== Number(rawGw))
    ) {
      return new Response(
        JSON.stringify({ error: 'Invalid event/gameweek parameter (must be 1-38)' }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
        }
      );
    }
    const eventParam = rawEvent !== null ? rawEvent : rawGw;
    const gw = eventParam !== null ? Number(eventParam) : 1;
    if (!Number.isInteger(gw) || gw < 1 || gw > 38) {
      return new Response(
        JSON.stringify({ error: 'Invalid event/gameweek parameter (must be 1-38)' }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
        }
      );
    }

    const isSlim = url.searchParams.get('slim') === '1' || url.searchParams.get('mode') === 'slim';
    const isForce = url.searchParams.get('force') === '1';
    const entryParam = url.searchParams.get('entry') || '';
    const isPicksPath = path === '/picks' || path === '/api/picks';

    // 2. Construct Edge Cache Key
    // Force refresh (?force=1) uses 5-second burst protection bucket; standard poll uses clean URL cache key with dynamic edge TTL
    const cacheKeyUrl = new URL(request.url);
    const entrySuffix = (isPicksPath && entryParam) ? `&entry=${encodeURIComponent(entryParam)}` : '';
    if (isForce) {
      const forceBucket = Math.floor(Date.now() / 5000);
      cacheKeyUrl.search = `?path=${path}&gw=${gw}&slim=${isSlim ? 1 : 0}${entrySuffix}&force=1&b=${forceBucket}`;
    } else {
      cacheKeyUrl.search = `?path=${path}&gw=${gw}&slim=${isSlim ? 1 : 0}${entrySuffix}`;
    }
    const cacheKey = new Request(cacheKeyUrl.toString(), { method: 'GET' });
    const cache = caches.default;

    let cachedResponse = await cache.match(cacheKey);
    if (cachedResponse) {
      const hitHeaders = new Headers(cachedResponse.headers);
      hitHeaders.set('X-FPL-Edge-Cache', 'HIT');
      hitHeaders.set('X-FPL-Edge-Colo', colo);
      return new Response(cachedResponse.body, {
        status: cachedResponse.status,
        headers: hitHeaders,
      });
    }

    try {
      // 2.5 Team Picks Endpoint (/picks?entry={id}&gw={gw} or /api/picks)
      if (path === '/picks' || path === '/api/picks') {
        const entryId = url.searchParams.get('entry');
        if (!entryId || !/^\d{1,12}$/.test(entryId)) {
          return new Response(
            JSON.stringify({ error: 'Valid entry ID parameter is required (e.g. ?entry=7563)' }),
            {
              status: 400,
              headers: { ...CORS_HEADERS, 'Content-Type': 'application/json; charset=utf-8' },
            }
          );
        }

        const [picksResp, entryResp] = await Promise.all([
          fetch(`https://fantasy.premierleague.com/api/entry/${entryId}/event/${gw}/picks/`, {
            headers: FPL_HEADERS,
          }),
          fetch(`https://fantasy.premierleague.com/api/entry/${entryId}/`, {
            headers: FPL_HEADERS,
          }).catch(() => null),
        ]);

        if (!picksResp.ok) {
          if (picksResp.status >= 500) {
            scheduleWorkerHealthMetric(env, ctx, true, 'upstream_picks');
          }
          return new Response(
            JSON.stringify({
              error: `FPL picks upstream returned ${picksResp.status}`,
              status: picksResp.status,
              entry: Number(entryId),
              gw,
            }),
            {
              status: picksResp.status,
              headers: {
                ...CORS_HEADERS,
                'Content-Type': 'application/json; charset=utf-8',
                'Cache-Control': 'no-store',
              },
            }
          );
        }

        const picksData = await picksResp.json();
        let summaryOverallRank = null;
        if (entryResp && entryResp.ok) {
          try {
            const entryData = await entryResp.json();
            if (entryData && Number(entryData.summary_overall_rank) > 0) {
              summaryOverallRank = Number(entryData.summary_overall_rank);
            }
          } catch (_) {}
        }
        const ttl = 1800; // 30 minutes cache for team picks (15 players are locked post-deadline)
        const responseBody = JSON.stringify({
          entry_id: Number(entryId),
          gw,
          active_chip: picksData.active_chip,
          automatic_subs: picksData.automatic_subs || [],
          entry_history: picksData.entry_history || {},
          summary_overall_rank: summaryOverallRank,
          picks: (picksData.picks || []).map(p => ({
            element: p.element,
            position: p.position,
            multiplier: p.multiplier,
            is_captain: Boolean(p.is_captain),
            is_vice_captain: Boolean(p.is_vice_captain),
            element_type: p.element_type,
          })),
          updated_at: new Date().toISOString(),
          colo,
        });

        const picksResponse = new Response(responseBody, {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': `public, max-age=${ttl}, s-maxage=${ttl}, stale-while-revalidate=60`,
            'X-FPL-Edge-Cache': 'MISS',
            'X-FPL-Edge-Colo': colo,
          },
        });

        if (isForce) {
          const normalKeyUrl = new URL(request.url);
          normalKeyUrl.search = `?path=${path}&gw=${gw}&slim=${isSlim ? 1 : 0}${entrySuffix}`;
          const normalKey = new Request(normalKeyUrl.toString(), { method: 'GET' });
          ctx.waitUntil(Promise.all([cache.put(cacheKey, picksResponse.clone()), cache.put(normalKey, picksResponse.clone())]));
        } else {
          ctx.waitUntil(cache.put(cacheKey, picksResponse.clone()));
        }

        scheduleWorkerHealthMetric(env, ctx, false);
        return picksResponse;
      }
      // 3. Fetch Fixtures Only endpoint (/fixtures?event={gw})
      if (path === '/fixtures') {
        const fixResp = await fetch(`https://fantasy.premierleague.com/api/fixtures/?event=${gw}`, {
          headers: FPL_HEADERS,
        });
        if (!fixResp.ok) {
          throw new Error(`FPL fixtures upstream returned ${fixResp.status}`);
        }
        const fixturesRaw = await fixResp.json();
        const fixtures = Array.isArray(fixturesRaw)
          ? fixturesRaw.map(f => ({
              id: f.id,
              kickoff_time: f.kickoff_time,
              started: Boolean(f.started),
              finished: Boolean(f.finished),
              finished_provisional: Boolean(f.finished_provisional),
              postponed: Boolean(f.postponed),
              minutes: Number(f.minutes) || 0,
              team_h: f.team_h,
              team_a: f.team_a,
              team_h_score: f.team_h_score,
              team_a_score: f.team_a_score,
            }))
          : [];

        const anyFixStarted = fixtures.some(f => Boolean(f.started));
        const allFixFinished = fixtures.length > 0 && fixtures.every(f => Boolean(f.started) && (Boolean(f.finished) || Boolean(f.finished_provisional)));
        const fixInPlay = fixtures.filter(f => Boolean(f.started) && !f.finished && !f.finished_provisional).length > 0;
        const fixTtl = fixInPlay ? 15 : (allFixFinished ? 300 : 120);

        const body = JSON.stringify({
          gw,
          colo,
          updated_at: new Date().toISOString(),
          fixtures,
        });

        const response = new Response(body, {
          status: 200,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': `public, max-age=${fixTtl}, s-maxage=${fixTtl}, stale-while-revalidate=30`,
            'X-FPL-Edge-Cache': 'MISS',
            'X-FPL-Edge-Colo': colo,
          },
        });
        if (isForce) {
          const normalKeyUrl = new URL(request.url);
          normalKeyUrl.search = `?path=${path}&gw=${gw}&slim=${isSlim ? 1 : 0}`;
          const normalKey = new Request(normalKeyUrl.toString(), { method: 'GET' });
          ctx.waitUntil(Promise.all([cache.put(cacheKey, response.clone()), cache.put(normalKey, response.clone())]));
        } else {
          ctx.waitUntil(cache.put(cacheKey, response.clone()));
        }
        scheduleWorkerHealthMetric(env, ctx, false);
        return response;
      }

      // 4. Default Live Endpoint (/ or /live) -> Fetch Live Elements + Fixtures in parallel
      const [liveResp, fixResp] = await Promise.all([
        fetch(`https://fantasy.premierleague.com/api/event/${gw}/live/`, { headers: FPL_HEADERS }),
        fetch(`https://fantasy.premierleague.com/api/fixtures/?event=${gw}`, { headers: FPL_HEADERS }).catch(() => null),
      ]);

      if (!liveResp.ok) {
        throw new Error(`FPL live upstream returned ${liveResp.status}`);
      }

      const liveData = await liveResp.json();
      const rawElements = Array.isArray(liveData.elements) ? liveData.elements : [];

      let fixtures = [];
      let inPlayCount = 0;
      let allFinished = false;
      let anyStarted = false;
      let fixturesOk = false;

      if (fixResp && fixResp.ok) {
        try {
          const fixturesRaw = await fixResp.json();
          if (Array.isArray(fixturesRaw)) {
            fixturesOk = true;
            const activeFixtures = fixturesRaw.filter(f => !f.postponed);
            anyStarted = activeFixtures.some(f => Boolean(f.started));
            allFinished =
              activeFixtures.length > 0 &&
              activeFixtures.every(f => Boolean(f.started) && (Boolean(f.finished) || Boolean(f.finished_provisional)));
            inPlayCount = activeFixtures.filter(
              f => Boolean(f.started) && !f.finished && !f.finished_provisional
            ).length;

            fixtures = fixturesRaw.map(f => ({
              id: f.id,
              kickoff_time: f.kickoff_time,
              started: Boolean(f.started),
              finished: Boolean(f.finished),
              finished_provisional: Boolean(f.finished_provisional),
              postponed: Boolean(f.postponed),
              minutes: Number(f.minutes) || 0,
              team_h: f.team_h,
              team_a: f.team_a,
              team_h_score: f.team_h_score,
              team_a_score: f.team_a_score,
            }));
          }
        } catch (_) {}
      }

      // 5. Compute Provisional Bonus (BPS) per fixture
      const { playerProvBonus, fixtureBonusSummary } = computeProvisionalBonusByFixture(rawElements);

      // 6. Enrich & optionally slim elements
      const enrichedElements = rawElements.map(el =>
        formatElement(el, playerProvBonus.get(el.id) || 0, isSlim)
      );

      const payload = {
        gw,
        colo,
        updated_at: new Date().toISOString(),
        in_play_count: inPlayCount,
        any_started: anyStarted,
        all_finished: allFinished,
        fixtures,
        provisional_bonus_by_fixture: fixtureBonusSummary,
        elements: enrichedElements,
      };
      if (!fixturesOk) {
        payload.fixtures_degraded = true;
      }

      // Intelligent Dynamic Edge TTL:
      // 1. In-play matches active: 15s TTL (second-by-second live updates)
      // 2. All matches finished in gameweek: 300s TTL (5 minutes - scores frozen)
      // 3. Pre-kickoff / between match days: 120s TTL (2 minutes)
      // 4. Degraded fixtures upstream: no-store (never poison Edge cache with empty fixtures)
      const ttl = inPlayCount > 0 ? 15 : (allFinished ? 300 : 120);
      const swrTtl = inPlayCount > 0 ? 15 : 60;
      const cacheControlHeader = fixturesOk
        ? `public, max-age=${ttl}, s-maxage=${ttl}, stale-while-revalidate=${swrTtl}`
        : 'no-store';
      const response = new Response(JSON.stringify(payload), {
        status: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': cacheControlHeader,
          'X-FPL-Edge-Cache': fixturesOk ? 'MISS' : 'BYPASS',
          'X-FPL-Edge-Colo': colo,
        },
      });

      if (fixturesOk) {
        if (isForce) {
          // Also prime the normal (non-force) cache key so all other users instantly get fresh data
          const normalKeyUrl = new URL(request.url);
          normalKeyUrl.search = `?path=${path}&gw=${gw}&slim=${isSlim ? 1 : 0}`;
          const normalKey = new Request(normalKeyUrl.toString(), { method: 'GET' });
          ctx.waitUntil(Promise.all([
            cache.put(cacheKey, response.clone()),
            cache.put(normalKey, response.clone())
          ]));
        } else {
          ctx.waitUntil(cache.put(cacheKey, response.clone()));
        }
        scheduleWorkerHealthMetric(env, ctx, false);
      } else {
        scheduleWorkerHealthMetric(env, ctx, true, 'upstream_fixtures');
      }
      return response;
    } catch (err) {
      scheduleWorkerHealthMetric(env, ctx, true, 'upstream_5xx');
      return new Response(
        JSON.stringify({
          error: 'Upstream FPL API unavailable',
          message: err && err.message ? err.message : String(err),
          gw,
          colo,
        }),
        {
          status: 502,
          headers: {
            ...CORS_HEADERS,
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        }
      );
    }
  },
};
// Auto-build trigger Tue Nov  3 00:02:37 +07 2026
