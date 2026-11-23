/**
 * FPLSaWaDiKa Executive Terminal & Business Intelligence Dashboard
 * Secure Private Management Console (asawamanasak@gmail.com, noii.patchara@gmail.com)
 * Protected by Cloudflare Zero Trust (Email OTP)
 *
 * Impeccable + Unslop Broadcast Control Room Edition:
 * - Direction: Exact, composed, broadcast-technical (Premier League control room & financial ledger)
 * - Palette: Neutral graphite/ink ramp (#0b0d11 dark, #f8fafc light) + single pitch-emerald accent (#10b981)
 * - Contrast: WCAG 2.2 AA verified (>= 4.5:1 across all Light & Dark tokens)
 * - Bilingual: Full TH / EN toggle synced with main platform (`fpl_lang` & `fpl_theme`)
 * - Responsive: Zero horizontal overflow at 375px mobile, >= 44x44px touch targets, sticky table column on mobile/iPad
 * - Architecture: Flat single-layer cards (0 nested-cards, 0 border-accent-on-rounded, clear 1.25x type scale)
 */

export const ADMIN_EMAIL = 'asawamanasak@gmail.com';
export const ADMIN_EMAILS = ['asawamanasak@gmail.com', 'noii.patchara@gmail.com'];

const SESSION_TTL_SECONDS = 2592000; // 30 days
const JWKS_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour
const jwksCache = new Map();

function escapeHtmlAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function toBase64Url(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i++) {
    bin += String.fromCharCode(bytes[i]);
  }
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(b64url) {
  const b64 = String(b64url || '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    out[i] = bin.charCodeAt(i);
  }
  return out;
}

function decodeJwtPart(b64url) {
  const bytes = fromBase64Url(b64url);
  return JSON.parse(new TextDecoder().decode(bytes));
}

export function getSessionSecret(env) {
  const sessionSecret = env && typeof env.ADMIN_SESSION_SECRET === 'string' ? env.ADMIN_SESSION_SECRET.trim() : '';
  if (sessionSecret) return sessionSecret;
  const key = env && typeof env.ADMIN_SECRET_KEY === 'string' ? env.ADMIN_SECRET_KEY.trim() : '';
  return key;
}

export async function getSessionSigningSecret(env) {
  const dedicated = env && typeof env.ADMIN_SESSION_SECRET === 'string' ? env.ADMIN_SESSION_SECRET.trim() : '';
  if (dedicated) return dedicated;
  const passkey = env && typeof env.ADMIN_SECRET_KEY === 'string' ? env.ADMIN_SECRET_KEY.trim() : '';
  if (!passkey) return '';
  // Domain-separated session signing key so raw passkey is never reused directly as HMAC key
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`fpl-admin-session-v1:${passkey}`)
  );
  return toBase64Url(new Uint8Array(digest));
}

export function getAllowedAdminEmail(env) {
  const raw = env && typeof env.ADMIN_EMAIL === 'string' ? env.ADMIN_EMAIL.trim() : '';
  if (!raw) return ADMIN_EMAIL;
  const first = raw.split(',')[0].trim();
  return first || ADMIN_EMAIL;
}

export function getAllowedAdminEmails(env) {
  const fromEnv = [
    env && typeof env.ADMIN_EMAIL === 'string' ? env.ADMIN_EMAIL : '',
    env && typeof env.ADMIN_EMAILS === 'string' ? env.ADMIN_EMAILS : '',
  ]
    .join(',')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  if (fromEnv.length > 0) {
    return Array.from(new Set(fromEnv));
  }
  return ADMIN_EMAILS.map(e => e.toLowerCase());
}

async function importHmacKey(secret) {
  const raw = new TextEncoder().encode(secret);
  return crypto.subtle.importKey(
    'raw',
    raw,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const enc = new TextEncoder();
  const [hashA, hashB] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ]);
  const bytesA = new Uint8Array(hashA);
  const bytesB = new Uint8Array(hashB);
  let diff = 0;
  for (let i = 0; i < bytesA.length; i++) {
    diff |= bytesA[i] ^ bytesB[i];
  }
  return diff === 0;
}

export async function verifyAdminPasskey(passkey, env) {
  const expected = env && typeof env.ADMIN_SECRET_KEY === 'string' ? env.ADMIN_SECRET_KEY.trim() : '';
  if (!expected || typeof passkey !== 'string' || !passkey) return false;
  return constantTimeEqual(passkey, expected);
}

export async function signAdminSession(secret, ttlSeconds = SESSION_TTL_SECONDS) {
  const expMs = Date.now() + ttlSeconds * 1000;
  const payload = String(expMs);
  const key = await importHmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(sig))}`;
}

export async function verifyAdminSession(token, secret) {
  if (!token || !secret || typeof token !== 'string') return false;
  const dotIdx = token.indexOf('.');
  if (dotIdx <= 0) return false;
  const payload = token.slice(0, dotIdx);
  const sigB64 = token.slice(dotIdx + 1);
  if (!/^\d+$/.test(payload) || !sigB64) return false;
  const expMs = Number(payload);
  if (!Number.isFinite(expMs) || expMs <= Date.now()) return false;
  try {
    const key = await importHmacKey(secret);
    const sigBytes = fromBase64Url(sigB64);
    return await crypto.subtle.verify('HMAC', key, sigBytes, new TextEncoder().encode(payload));
  } catch (_) {
    return false;
  }
}

async function fetchAccessJwks(teamDomain) {
  const cleanDomain = String(teamDomain || '').replace(/^https?:\/\//, '').replace(/\/+$/, '');
  if (!cleanDomain) return [];
  const cached = jwksCache.get(cleanDomain);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.keys;
  }
  const resp = await fetch(`https://${cleanDomain}/cdn-cgi/access/certs`, {
    headers: { 'Accept': 'application/json' },
  });
  if (!resp.ok) return [];
  const data = await resp.json();
  const keys = Array.isArray(data && data.keys) ? data.keys : [];
  jwksCache.set(cleanDomain, { keys, expiresAt: Date.now() + JWKS_CACHE_TTL_MS });
  return keys;
}

async function verifyAccessJwt(request, env) {
  const jwt = request.headers.get('cf-access-jwt-assertion');
  const teamDomain = env && typeof env.CF_ACCESS_TEAM_DOMAIN === 'string' ? env.CF_ACCESS_TEAM_DOMAIN.trim() : '';
  const expectedAud = env && typeof env.CF_ACCESS_AUD === 'string' ? env.CF_ACCESS_AUD.trim() : '';
  if (!jwt || !teamDomain || !expectedAud) return null;

  const parts = jwt.split('.');
  if (parts.length !== 3) return null;

  try {
    const header = decodeJwtPart(parts[0]);
    const payload = decodeJwtPart(parts[1]);
    if (!header || header.alg !== 'RS256' || !header.kid) return null;

    const nowSec = Math.floor(Date.now() / 1000);
    if (typeof payload.exp !== 'number' || payload.exp <= nowSec) return null;
    if (typeof payload.nbf === 'number' && payload.nbf > nowSec + 60) return null;

    const audList = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audList.includes(expectedAud)) return null;

    const cleanDomain = teamDomain.replace(/^https?:\/\//, '').replace(/\/+$/, '');
    const expectedIss = `https://${cleanDomain}`;
    if (payload.iss !== expectedIss) return null;

    const allowedEmails = new Set(getAllowedAdminEmails(env));
    const tokenEmail = typeof payload.email === 'string' ? payload.email.toLowerCase() : '';
    if (!tokenEmail || !allowedEmails.has(tokenEmail)) return null;

    const keys = await fetchAccessJwks(cleanDomain);
    const jwk = keys.find(k => k && k.kid === header.kid);
    if (!jwk) return null;

    const cryptoKey = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const signedData = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
    const sigBytes = fromBase64Url(parts[2]);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', cryptoKey, sigBytes, signedData);
    return valid ? payload.email : null;
  } catch (_) {
    return null;
  }
}

// Accessible 16x16 Line Icons (1.5 stroke, currentColor inheritance, aria-hidden="true")
const ICONS = {
  shield: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/></svg>`,
  server: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.75 5.1a3 3 0 012.4-1.35h7.7a3 3 0 012.4 1.35l1.6 3.45a4.5 4.5 0 01.9 2.7"/></svg>`,
  activity: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12h3.75l2.25-6 4.5 12 2.25-6H21"/></svg>`,
  users: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>`,
  deviceMobile: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>`,
  deviceDesktop: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/></svg>`,
  deviceTablet: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5h3m-6.75 2.25h10.5a2.25 2.25 0 002.25-2.25v-15a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 4.5v15a2.25 2.25 0 002.25 2.25z"/></svg>`,
  clock: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  bolt: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>`,
  trash: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"/></svg>`,
  database: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 5.625c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"/></svg>`,
  external: `<svg aria-hidden="true" focusable="false" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/></svg>`,
  logout: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/></svg>`,
  sun: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"/></svg>`,
  moon: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/></svg>`,
  lock: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/></svg>`,
  refresh: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>`,
  check: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`,
  coins: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
  cpu: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 16.5V21m3.75-18v1.5m0 16.5V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z"/></svg>`,
  share: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"/></svg>`,
  layers: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6.429 9.75L2.25 12l9.75 5.25 9.75-5.25-4.179-2.25m-11.142 4.5L2.25 16.5l9.75 5.25 9.75-5.25-4.179-2.25M12 3.75L2.25 9 12 14.25 21.75 9 12 3.75z"/></svg>`,
  trendUp: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>`,
  globe: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/></svg>`,
  copy: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 01-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 011.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 00-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 01-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 01-1.125-1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75"/></svg>`,
  sort: `<svg aria-hidden="true" focusable="false" class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"/></svg>`,
  chart: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>`,
  smartphone: `<svg aria-hidden="true" focusable="false" class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"/></svg>`,
};

/**
 * Verify whether request is authenticated (fail-closed: verified Zero Trust JWT or HMAC-signed session cookie)
 */
export async function isRequestAuthenticated(request, env) {
  const verifiedEmail = await verifyAccessJwt(request, env);
  if (verifiedEmail) {
    return { authenticated: true, identity: verifiedEmail, provider: 'Cloudflare Zero Trust (JWT)' };
  }

  const signingSecret = await getSessionSigningSecret(env);
  if (signingSecret) {
    const cookieHeader = request.headers.get('Cookie') || '';
    const match = cookieHeader.match(/(?:^|;\s*)fpl_admin_auth=([^;]+)/);
    if (match && match[1]) {
      const validSession = await verifyAdminSession(decodeURIComponent(match[1]), signingSecret);
      if (validSession) {
        return { authenticated: true, identity: getAllowedAdminEmail(env), provider: 'Signed Passkey Session' };
      }
    }
  }

  return { authenticated: false };
}

/**
 * Render Executive Summary Report & Business Intelligence Dashboard HTML
 */
export function renderDashboardHtml(colo = 'BKK', authProvider = 'Cloudflare Zero Trust', authIdentity = '') {
  const safeIdentity = escapeHtmlAttr(authIdentity || ADMIN_EMAIL);
  const safeColo = escapeHtmlAttr(colo || 'EDGE');
  const safeProvider = escapeHtmlAttr(authProvider || 'Cloudflare Zero Trust');
  return `<!DOCTYPE html>
<html lang="th" class="dark h-full scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="color-scheme" content="light dark">
  <title>Executive Summary & Live Business Intelligence | FPLSaWaDiKa</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Sarabun:wght@400;500;600&display=swap" rel="stylesheet">
  <script>
    (function() {
      try {
        var params = new URLSearchParams(window.location.search);
        var urlTheme = params.get('theme');
        var savedTheme = localStorage.getItem('fpl_theme') || localStorage.getItem('fpl_admin_theme');
        var systemDark = !window.matchMedia || window.matchMedia('(prefers-color-scheme: dark)').matches;
        var isDark = (urlTheme === 'dark') || (!urlTheme && (savedTheme === 'dark' || (!savedTheme && systemDark)));
        if (urlTheme === 'light') isDark = false;
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        var csMeta = document.querySelector('meta[name="color-scheme"]');
        if (csMeta) csMeta.content = savedTheme ? (isDark ? 'dark' : 'light') : 'light dark';

        var urlLang = params.get('lang');
        var savedLang = localStorage.getItem('fpl_lang') || localStorage.getItem('fpl_admin_lang');
        var initLang = (urlLang === 'en' || (!urlLang && savedLang === 'en')) ? 'en' : 'th';
        document.documentElement.lang = initLang;
        window.__INIT_LANG__ = initLang;
      } catch (_) {}
    })();
  </script>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            pageDark: '#0b0d11',
            cardDark: '#12151c',
            raisedDark: '#191d26',
            borderDark: '#252a36',
            pageLight: '#f8fafc',
            cardLight: '#ffffff',
            raisedLight: '#f1f5f9',
            borderLight: '#cbd5e1',
          }
        }
      }
    }
  </script>
  <style>
    :root {
      color-scheme: light dark;
      caret-color: #10b981;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Sarabun", "IBM Plex Sans Thai", "Noto Sans Thai", "Segoe UI", sans-serif;
      font-size: 0.875rem;
      line-height: 1.65;
      text-underline-offset: 3px;
    }
    h1, h2, h3, h4 {
      text-wrap: balance;
    }
    p, li, dd {
      text-wrap: pretty;
    }
    .text-xs {
      font-size: 0.75rem;
      line-height: 1.55;
    }
    h1 {
      font-size: 1.75rem;
      line-height: 1.25;
    }
    h2 {
      font-size: 1.25rem;
      line-height: 1.35;
    }
    h3 {
      font-size: 1.05rem;
      line-height: 1.4;
    }
    ::selection {
      background-color: rgba(16, 185, 129, 0.22);
      color: inherit;
    }
    .mono {
      font-family: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    }
    .tabular {
      font-variant-numeric: tabular-nums;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .animate-spin-custom {
      animation: spin 0.8s linear infinite;
    }
    .touch-scroll {
      -webkit-overflow-scrolling: touch;
      scrollbar-width: thin;
      scrollbar-color: rgba(100, 116, 139, 0.35) transparent;
    }
    .bar-fill {
      transform-origin: left center;
      transition: transform 240ms cubic-bezier(0.22, 1, 0.36, 1);
    }
    @media (prefers-reduced-motion: reduce) {
      *, ::before, ::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
      }
    }
  </style>
</head>
<body class="bg-pageLight dark:bg-pageDark text-slate-800 dark:text-neutral-200 min-h-screen antialiased transition-colors duration-150 overflow-x-hidden">

  <!-- Top Navigation Header (Quiet Broadcast Chrome, Compact Operations Bar) -->
  <header class="border-b border-borderLight dark:border-borderDark bg-cardLight/95 dark:bg-pageDark/95 backdrop-blur sticky top-0 z-40 transition-colors duration-150">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2">
      
      <!-- Brand & Console Title -->
      <div class="flex items-center gap-2.5 min-w-0">
        <div class="w-8 h-8 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-cardDark flex items-center justify-center text-emerald-700 dark:text-emerald-400 shrink-0">
          ${ICONS.shield}
        </div>
        <div class="min-w-0">
          <div class="text-sm sm:text-base font-medium tracking-tight text-slate-900 dark:text-white flex items-center gap-2 truncate">
            <span>FPLSaWaDiKa</span>
            <span class="hidden sm:inline-block text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="nav_console_badge">Executive BI Console</span>
          </div>
          <div class="text-xs mono text-slate-600 dark:text-neutral-400 flex items-center gap-1.5 truncate">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
            <span>${safeColo} Edge</span>
            <span class="hidden md:inline">· ${safeIdentity}</span>
          </div>
        </div>
      </div>

      <!-- Right Action Controls (All >= 42x42px touch targets) -->
      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">

        <!-- Dynamic Quick League Switcher (Landing, Preview, and all live leagues) -->
        <div class="relative">
          <label for="quickLeagueSelect" class="sr-only" data-i18n="nav_jump_league_label">ทางลัดเปิดหน้าขาย เดโม และมินิลีก</label>
          <select id="quickLeagueSelect" onchange="jumpToLeague(this.value)"
            class="min-h-[42px] px-2.5 sm:px-3 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-raisedDark text-slate-800 dark:text-neutral-200 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 transition-colors duration-150 cursor-pointer max-w-[140px] sm:max-w-[220px]">
            <option value="" data-i18n="nav_jump_placeholder">ทางลัดเปิดหน้าเว็บ...</option>
            <option value="landing" data-i18n="nav_jump_landing">🛒 หน้าขายสินค้า (Landing Page)</option>
            <option value="preview" data-i18n="nav_jump_preview">🎮 หน้าเดโมรวมลีก (preview.html)</option>
          </select>
        </div>

        <!-- Language Switcher (TH | EN) -->
        <button type="button" id="langToggleBtn" onclick="toggleLanguage()" title="Switch Language (TH / EN) [Shortcut: L]" aria-label="Switch Language (TH / EN)"
          class="min-w-[42px] min-h-[42px] px-2.5 flex items-center justify-center gap-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-raisedDark active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 text-slate-800 dark:text-neutral-200 text-xs mono font-medium whitespace-nowrap transition-colors duration-150">
          ${ICONS.globe}
          <span id="langToggleLabel">TH</span>
        </button>

        <!-- Theme Toggle (Light | Dark) -->
        <button type="button" id="themeToggleBtn" onclick="toggleTheme()" title="Toggle Light / Dark Mode [Shortcut: T]" aria-label="Toggle color theme"
          class="min-w-[42px] min-h-[42px] p-2 flex items-center justify-center rounded-lg border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-raisedDark active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 text-slate-700 dark:text-neutral-300 transition-colors duration-150">
          <span id="themeIconSun" class="hidden dark:inline-block">${ICONS.sun}</span>
          <span id="themeIconMoon" class="inline-block dark:hidden">${ICONS.moon}</span>
        </button>

        <!-- Sign Out -->
        <form method="POST" action="/logout" class="m-0">
          <button type="submit" title="Sign Out" aria-label="Sign Out"
            class="min-w-[42px] min-h-[42px] p-2 flex items-center justify-center rounded-lg border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-raisedDark active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white transition-colors duration-150">
            ${ICONS.logout}
          </button>
        </form>

      </div>
    </div>

    <!-- Sticky Module Navigation Strip (Ordered 01 -> 11 matching page flow 100%) -->
    <nav aria-label="Dashboard modules" class="border-t border-borderLight dark:border-borderDark bg-raisedLight/80 dark:bg-cardDark/90">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto touch-scroll py-1 text-xs mono">
        <a href="#sec-audience" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-800 dark:text-neutral-200 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 font-medium whitespace-nowrap">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span data-i18n="mod_nav_1">01. ภาพรวม KPI</span>
        </a>
        <a href="#sec-portfolio" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-800 dark:text-neutral-200 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 font-medium whitespace-nowrap">
          <span data-i18n="mod_nav_2">02. พอร์ตโฟลิโอลีก</span>
        </a>
        <a href="#sec-orders" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-800 dark:text-sky-300 hover:bg-sky-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 transition-colors shrink-0 inline-flex items-center gap-2 font-semibold whitespace-nowrap">
          <span data-i18n="mod_nav_3">03. ออเดอร์ &amp; ตรวจสลิป</span>
          <span id="navOrderPendingBadge" class="hidden px-2 py-0.5 rounded-full bg-rose-700 text-white text-xs font-mono leading-none">0</span>
        </a>
        <a href="#sec-onboarding" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 transition-colors shrink-0 inline-flex items-center gap-2 font-semibold whitespace-nowrap">
          <span data-i18n="mod_nav_4">04. เพิ่มลีกลูกค้าใหม่</span>
        </a>
        <a href="#sec-features" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 whitespace-nowrap">
          <span data-i18n="mod_nav_5">05. พฤติกรรมฟีเจอร์</span>
        </a>
        <a href="#sec-distribution" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 whitespace-nowrap">
          <span data-i18n="mod_nav_6">06. เบราว์เซอร์ &amp; ภาษา</span>
        </a>
        <a href="#sec-devices" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 whitespace-nowrap">
          <span data-i18n="mod_nav_7">07. อุปกรณ์</span>
        </a>
        <a href="#sec-timing" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 whitespace-nowrap">
          <span data-i18n="mod_nav_8">08. ช่วงเวลาพีค</span>
        </a>
        <a href="#sec-system" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 whitespace-nowrap">
          <span data-i18n="mod_nav_9">09. ระบบ &amp; โควตา</span>
        </a>
        <a href="#sec-monitor" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 whitespace-nowrap">
          <span data-i18n="mod_nav_10">10. Monitor</span>
        </a>
        <a href="#sec-pitch" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 font-semibold whitespace-nowrap">
          <span data-i18n="mod_nav_11">11. Pitch Deck</span>
        </a>
      </div>
    </nav>
  </header>

  <!-- Main Content Container -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">

    <!-- Page Header & Live Sync Heartbeat Strip -->
    <section aria-labelledby="page-main-heading" class="space-y-5 pb-6 border-b border-borderLight dark:border-borderDark">
      <div class="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div class="space-y-2 max-w-3xl">
          <h1 id="page-main-heading" class="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-900 dark:text-white leading-tight" data-i18n="page_title">
            สรุปภาพรวมผู้บริหารและข้อมูลวิเคราะห์ธุรกิจสด
          </h1>
          <p id="pageSubtitleDesc" class="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed" data-i18n="page_subtitle">
            ศูนย์ควบคุมข้อมูลระบบ พฤติกรรมผู้ใช้งาน เศรษฐศาสตร์เงินรางวัล และการประเมินความจุคลาวด์จากข้อมูลสด 100%
          </p>
        </div>

        <!-- Copy Executive Report Action + Live Refresh -->
        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <button type="button" id="copyExecReportBtn" onclick="copyExecutiveSummary()"
            class="min-h-[44px] px-3.5 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-raisedDark active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 text-slate-800 dark:text-neutral-200 text-xs font-medium inline-flex items-center gap-2 transition-colors duration-150">
            ${ICONS.copy}
            <span data-i18n="btn_copy_exec">คัดลอกสรุปผู้บริหาร</span>
          </button>

          <button type="button" id="refreshDataBtn" onclick="triggerLivePitchRefresh()"
            class="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-neutral-950 font-bold active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 text-xs inline-flex items-center gap-2 whitespace-nowrap transition-all duration-150 shadow-sm"
            title="ดึงข้อมูลสดทันทีจาก Cloudflare Edge & D1">
            <span id="refreshIcon">${ICONS.bolt}</span>
            <span id="refreshBtnText" data-i18n="btn_live_pitch_refresh">⚡ Live Refresh</span>
          </button>
        </div>
      </div>

      <!-- Broadcast Signature Strip: Live Sync Heartbeat & Keycap Countdown -->
      <div class="p-4 sm:p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span id="telemetrySyncDot" class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span id="telemetryLiveStatusText" class="font-medium text-slate-900 dark:text-white" data-i18n="telem_live_active">ระบบตรวจวัดข้อมูลสดทำงานปกติ</span>
            <span class="mono text-slate-600 dark:text-neutral-400" data-i18n="telem_auto_sync">(ซิงก์ 1 ชม. ศ.–จ. / 4 ชม. อ.–พฤ. · ${safeProvider})</span>
            <span id="telemetryModelBadge" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-xs mono text-slate-700 dark:text-neutral-300">Live D1</span>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-neutral-400">
            <div>
              <span data-i18n="telem_last_sync_label">ซิงก์ข้อมูลล่าสุด: </span>
              <span id="telemetryLastSync" class="text-slate-900 dark:text-neutral-100 mono tabular font-medium">—</span>
              <span id="telemetryTimeAgo" class="mono tabular ml-1 text-slate-600 dark:text-neutral-400"></span>
            </div>
            <span aria-hidden="true" class="hidden sm:inline text-slate-600 dark:text-neutral-400">·</span>
            <div>
              <span data-i18n="telem_runner_label">ตัวประมวลผล: </span>
              <span class="mono text-slate-800 dark:text-neutral-200">GitHub Actions + Cloudflare D1</span>
            </div>
          </div>
        </div>

        <!-- Keycap Deadline Countdown -->
        <div class="flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-end gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-borderLight dark:border-borderDark">
          <div class="text-xs">
            <div id="telemetryNextDeadlineName" class="font-medium text-slate-900 dark:text-neutral-100" data-gw-name="Gameweek">เดดไลน์ถัดไป</div>
            <div class="text-slate-600 dark:text-neutral-400 mono text-xs" data-i18n="telem_countdown_sub">นับถอยหลังปิดตลาดย้ายตัว</div>
          </div>
          <div class="flex items-center gap-1.5 mono tabular text-slate-900 dark:text-white text-xs font-medium" aria-label="Deadline countdown">
            <span class="inline-flex items-baseline gap-0.5 px-2 py-1 rounded-md bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark">
              <span id="cdDays" class="font-semibold tabular">--</span><span class="text-slate-600 dark:text-neutral-400">d</span>
            </span>
            <span class="text-slate-600 dark:text-neutral-400">:</span>
            <span class="inline-flex items-baseline gap-0.5 px-2 py-1 rounded-md bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark">
              <span id="cdHours" class="font-semibold tabular">--</span><span class="text-slate-600 dark:text-neutral-400">h</span>
            </span>
            <span class="text-slate-600 dark:text-neutral-400">:</span>
            <span class="inline-flex items-baseline gap-0.5 px-2 py-1 rounded-md bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark">
              <span id="cdMins" class="font-semibold tabular">--</span><span class="text-slate-600 dark:text-neutral-400">m</span>
            </span>
            <span class="text-slate-600 dark:text-neutral-400">:</span>
            <span class="inline-flex items-baseline gap-0.5 px-2 py-1 rounded-md bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark">
              <span id="cdSecs" class="font-semibold tabular">--</span><span class="text-slate-600 dark:text-neutral-400">s</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Accessible Live Toast Region -->
      <div id="liveStatusToast" role="status" aria-live="polite" class="hidden p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-xs mono text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
        <span class="text-emerald-700 dark:text-emerald-400">${ICONS.check}</span>
        <span id="liveStatusToastText" data-i18n="toast_refreshed">อัปเดตข้อมูลสถานะล่าสุดจากเซิร์ฟเวอร์เรียบร้อยแล้ว</span>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 01. LIVE AUDIENCE & TRAFFIC KPIS (100% REAL D1 & SYNC DATA)               -->
    <!-- ========================================================================= -->
    <section id="sec-audience" class="space-y-4 scroll-mt-28" aria-labelledby="sec-audience-title">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.users}</span>
          <h2 id="sec-audience-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec1_title">
            01. ภาพรวมทราฟฟิกและตัวชี้วัดผู้ใช้งานสด
          </h2>
        </div>
        <span class="text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="sec1_sub">
          ตัวเลขจริง 100% จากการซิงก์ลีกและฐานข้อมูล Cloudflare D1 (ไม่เก็บ Cookie · ไม่มีเลขสมมติ)
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- KPI 1: Tracked Managers -->
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-1.5">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="kpi_managers_label">ผู้จัดการทีมที่ติดตาม</div>
            <span class="px-2 py-0.5 rounded text-xs mono font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 shrink-0 whitespace-nowrap" data-i18n="badge_live_sync">Live Sync</span>
          </div>
          <div>
            <div id="kpiManagersCount" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">—</div>
            <div id="kpiManagersSub" class="text-xs text-emerald-700 dark:text-emerald-400 mt-1" data-i18n="kpi_managers_sub">กำลังโหลดจำนวนทีมจากระบบ...</div>
          </div>
        </div>

        <!-- KPI 2: 7-Day Peak Daily Views -->
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-1.5">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="kpi_mau_label">ยอดเข้าชมสูงสุดรายวัน (7 วัน)</div>
            <span class="px-2 py-0.5 rounded text-xs mono font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 shrink-0 whitespace-nowrap" data-i18n="badge_live_d1">Live D1</span>
          </div>
          <div>
            <div id="kpiMatchdayActive" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">0</div>
            <div id="kpiMatchdaySub" class="text-xs text-emerald-700 dark:text-emerald-400 mt-1" data-i18n="kpi_mau_sub">จำนวนเข้าชมลีกสูงสุดใน 1 วัน (รอบ 7 วัน)</div>
          </div>
        </div>

        <!-- KPI 3: Off-Peak Weekday Average -->
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-1.5">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="kpi_offpeak_label">ยอดเข้าชมเฉลี่ยวันธรรมดา (อ.–พฤ.)</div>
            <span class="px-2 py-0.5 rounded text-xs mono font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 shrink-0 whitespace-nowrap" data-i18n="badge_live_d1">Live D1</span>
          </div>
          <div>
            <div id="kpiOffPeakDau" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">0</div>
            <div class="text-xs text-slate-600 dark:text-neutral-400 mt-1" data-i18n="kpi_offpeak_sub">ค่าเฉลี่ยจริงช่วงอังคาร–พฤหัส (วางแผนซื้อขาย)</div>
          </div>
        </div>

        <!-- KPI 4: Matchday vs Off-Peak Share -->
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-1.5">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="kpi_stickiness_label">สัดส่วนวันแข่ง (ศ.–จ.) vs วันธรรมดา</div>
            <span class="px-2 py-0.5 rounded text-xs mono font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 shrink-0 whitespace-nowrap" data-i18n="badge_live_d1">Live D1</span>
          </div>
          <div>
            <div id="kpiMatchdaySplit" class="text-2xl font-semibold mono tabular text-emerald-700 dark:text-emerald-400">—</div>
            <div id="kpiMatchdaySplitSub" class="text-xs text-slate-600 dark:text-neutral-400 mt-1" data-i18n="kpi_stickiness_sub">เปรียบเทียบยอดเข้าชม 7 วันจริงระหว่างวันแข่งกับกลางสัปดาห์</div>
          </div>
        </div>

        <!-- KPI 5: Lifetime Total Site Views -->
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-1.5">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="kpi_retention_label">ยอดเข้าชมสะสมตลอดกาล (Lifetime)</div>
            <span class="px-2 py-0.5 rounded text-xs mono font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 shrink-0 whitespace-nowrap" data-i18n="badge_live_d1">Live D1</span>
          </div>
          <div>
            <div id="kpiLifetimeViews" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">0</div>
            <div id="kpiLifetimeSub" class="text-xs text-emerald-700 dark:text-emerald-400 mt-1" data-i18n="kpi_retention_sub">นับจริงแบบลดซ้ำ 30 นาที (ตั้งแต่ พ.ย. 2026)</div>
          </div>
        </div>

        <!-- KPI 6: Avg Session Screen Time -->
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-1.5">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="kpi_screentime_label">เวลาใช้งานเฉลี่ยต่อครั้ง</div>
            <span class="px-2 py-0.5 rounded text-xs mono font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 shrink-0 whitespace-nowrap" data-i18n="badge_live_d1">Live D1</span>
          </div>
          <div>
            <div id="kpiScreenTime" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">—</div>
            <div id="kpiScreenTimeSub" class="text-xs text-slate-600 dark:text-neutral-400 mt-1" data-i18n="kpi_screentime_sub">วัดจริงจาก Dwell Time Beacon (รอบ 7 วัน)</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 02. MULTI-LEAGUE PORTFOLIO & COMMERCIAL ECONOMICS                         -->
    <!-- ========================================================================= -->
    <section id="sec-portfolio" class="space-y-4 scroll-mt-28" aria-labelledby="sec-portfolio-title">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.layers}</span>
          <h2 id="sec-portfolio-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec2_title">
            02. พอร์ตโฟลิโอมินิลีกและเศรษฐศาสตร์เงินรางวัลรวม
          </h2>
        </div>
        <span class="text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="sec2_sub">
          คลิกหัวตารางเพื่อเรียงลำดับ · คอลัมน์ชื่อลีกตรึงอยู่กับที่เมื่อเลื่อนแนวนอนบนมือถือ
        </span>
      </div>

      <!-- Portfolio Summary KPIs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="port_gmv_label">มูลค่าเงินรางวัลรวมทั้งระบบ (GMV)</div>
            <div id="kpiTotalGmv" class="text-2xl font-semibold mono tabular text-emerald-700 dark:text-emerald-400">฿0</div>
            <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="port_gmv_sub">รวมเงินรางวัลประจำฤดูกาล + รางวัลรายสัปดาห์/เดือน</div>
          </div>
        </div>

        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="port_custom_label">ลีกที่ผูกกติกาพิเศษ (Custom Rules)</div>
            <div id="portCustomRulesVal" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">—</div>
            <div class="text-xs text-emerald-700 dark:text-emerald-400" data-i18n="port_custom_sub">สร้าง Switching Cost สูงกว่าเว็บ FPL ทั่วไป</div>
          </div>
        </div>

        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex items-center justify-between gap-4">
          <div class="space-y-1 w-full">
            <div class="flex items-center justify-between gap-2">
              <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="port_landing_label">ยอดเข้าชมหน้าขาย (Landing Page · 7 วัน)</div>
              <span id="portLandingTodayBadge" class="px-2 py-0.5 rounded text-xs mono font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 shrink-0 whitespace-nowrap">วันนี้: 0</span>
            </div>
            <div id="portLandingViews" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">0 <span class="text-xs font-normal text-slate-600 dark:text-neutral-400">ครั้ง</span></div>
            <div id="portLandingSub" class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="port_landing_sub">แยกจากยอดเปิดดูมินิลีก (วัดคนสนใจซื้อระบบ)</div>
          </div>
        </div>

        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="port_whitelabel_label">ความจุที่รองรับเพิ่ม (Tier 1 Headroom)</div>
            <div id="portWhiteLabelVal" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">—</div>
            <div id="portWhiteLabelSub" class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="port_whitelabel_sub">คำนวณตรงกับเพดาน 30 ลีก / 500 ทีม Tier 1 (ต้นทุนเพิ่ม ฿0)</div>
          </div>
        </div>
      </div>

      <!-- Expiry Alert Banner & Customer Lifecycle Filter Bar -->
      <div id="portfolioExpiryAlert" role="status" class="hidden p-3.5 rounded-xl border border-amber-500/35 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs leading-relaxed"></div>

      <div id="portfolioLifecycleFilters" role="group" aria-label="Customer lifecycle filters" class="flex flex-wrap items-center gap-2">
        <button type="button" data-portfolio-filter="all" aria-pressed="true"
          class="pf-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg text-xs font-medium border border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 inline-flex items-center gap-1.5 whitespace-nowrap transition-colors">
          <span data-i18n="pf_filter_all">ทั้งหมด</span>
          <span id="pfCount-all" class="mono text-xs px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">0</span>
        </button>
        <button type="button" data-portfolio-filter="private" aria-pressed="false"
          class="pf-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg text-xs font-medium border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300 hover:bg-raisedLight dark:hover:bg-raisedDark inline-flex items-center gap-1.5 whitespace-nowrap transition-colors">
          <span data-i18n="pf_filter_private">ลูกค้าส่วนตัว (Private)</span>
          <span id="pfCount-private" class="mono text-xs px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">0</span>
        </button>
        <button type="button" data-portfolio-filter="expiring" aria-pressed="false"
          class="pf-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg text-xs font-medium border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300 hover:bg-raisedLight dark:hover:bg-raisedDark inline-flex items-center gap-1.5 whitespace-nowrap transition-colors">
          <span data-i18n="pf_filter_expiring">ทดลองใช้ / ใกล้หมดอายุ</span>
          <span id="pfCount-expiring" class="mono text-xs px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">0</span>
        </button>
        <button type="button" data-portfolio-filter="paused" aria-pressed="false"
          class="pf-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg text-xs font-medium border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300 hover:bg-raisedLight dark:hover:bg-raisedDark inline-flex items-center gap-1.5 whitespace-nowrap transition-colors">
          <span data-i18n="pf_filter_paused">พักระบบ (Paused)</span>
          <span id="pfCount-paused" class="mono text-xs px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">0</span>
        </button>
        <button type="button" data-portfolio-filter="showcase" aria-pressed="false"
          class="pf-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg text-xs font-medium border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300 hover:bg-raisedLight dark:hover:bg-raisedDark inline-flex items-center gap-1.5 whitespace-nowrap transition-colors">
          <span data-i18n="pf_filter_showcase">ลีกตัวอย่าง (Showcase)</span>
          <span id="pfCount-showcase" class="mono text-xs px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">0</span>
        </button>
      </div>

      <!-- Sortable & Sticky Portfolio + Lifecycle Table -->
      <div class="rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark overflow-hidden">
        <div class="overflow-x-auto touch-scroll focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500" tabindex="0" role="region" aria-labelledby="sec-portfolio-title">
          <table class="w-full text-left border-collapse min-w-[1060px]">
            <thead>
              <tr class="border-b border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-700 dark:text-neutral-300">
                <th scope="col" id="th-name" aria-sort="none" class="sticky left-0 z-10 bg-raisedLight dark:bg-raisedDark p-0 border-r border-borderLight dark:border-borderDark whitespace-nowrap">
                  <button type="button" onclick="sortLeagueTable('name')" class="w-full min-h-[44px] px-4 py-2.5 inline-flex items-center justify-between gap-2 hover:text-slate-900 dark:hover:text-white text-left font-medium whitespace-nowrap">
                    <span data-i18n="col_league_name">ชื่อมินิลีก & รหัส</span>
                    <span id="sort-icon-name" class="text-slate-500 dark:text-neutral-400 shrink-0">${ICONS.sort}</span>
                  </button>
                </th>
                <th scope="col" id="th-teams" aria-sort="none" class="p-0 text-right whitespace-nowrap">
                  <button type="button" onclick="sortLeagueTable('teams')" class="w-full min-h-[44px] px-4 py-2.5 inline-flex items-center justify-end gap-1.5 hover:text-slate-900 dark:hover:text-white font-medium whitespace-nowrap">
                    <span data-i18n="col_teams">จำนวนทีม</span>
                    <span id="sort-icon-teams" class="text-slate-500 dark:text-neutral-400 shrink-0">${ICONS.sort}</span>
                  </button>
                </th>
                <th scope="col" id="th-pool" aria-sort="descending" class="p-0 text-right whitespace-nowrap">
                  <button type="button" onclick="sortLeagueTable('pool')" class="w-full min-h-[44px] px-4 py-2.5 inline-flex items-center justify-end gap-1.5 hover:text-slate-900 dark:hover:text-white font-medium whitespace-nowrap">
                    <span data-i18n="col_pool">เงินรางวัลรวม (GMV)</span>
                    <span id="sort-icon-pool" class="text-emerald-700 dark:text-emerald-400 shrink-0">${ICONS.sort}</span>
                  </button>
                </th>
                <th scope="col" class="px-4 py-2.5 font-medium whitespace-nowrap min-w-[220px]" data-i18n="col_modules">โมดูลและกติกาที่เปิดใช้งาน</th>
                <th scope="col" id="th-views" aria-sort="none" class="p-0 text-right whitespace-nowrap">
                  <button type="button" onclick="sortLeagueTable('views')" class="w-full min-h-[44px] px-4 py-2.5 inline-flex items-center justify-end gap-1.5 hover:text-slate-900 dark:hover:text-white font-medium whitespace-nowrap">
                    <span data-i18n="col_views">ยอดเปิดดู (7 วันล่าสุด)</span>
                    <span id="sort-icon-views" class="text-slate-500 dark:text-neutral-400 shrink-0">${ICONS.sort}</span>
                  </button>
                </th>
                <th scope="col" id="th-vpt" aria-sort="none" class="p-0 text-right whitespace-nowrap">
                  <button type="button" onclick="sortLeagueTable('vpt')" class="w-full min-h-[44px] px-4 py-2.5 inline-flex items-center justify-end gap-1.5 hover:text-slate-900 dark:hover:text-white font-medium whitespace-nowrap">
                    <span data-i18n="col_engagement">เวลาดูเฉลี่ย / ต่อทีม</span>
                    <span id="sort-icon-vpt" class="text-slate-500 dark:text-neutral-400 shrink-0">${ICONS.sort}</span>
                  </button>
                </th>
                <th scope="col" id="th-status" aria-sort="none" class="p-0 whitespace-nowrap">
                  <button type="button" onclick="sortLeagueTable('status')" class="w-full min-h-[44px] px-4 py-2.5 inline-flex items-center justify-between gap-1.5 hover:text-slate-900 dark:hover:text-white font-medium whitespace-nowrap">
                    <span data-i18n="col_lifecycle">สถานะ & หมดอายุ</span>
                    <span id="sort-icon-status" class="text-slate-500 dark:text-neutral-400 shrink-0">${ICONS.sort}</span>
                  </button>
                </th>
                <th scope="col" class="px-4 py-2.5 text-right font-medium whitespace-nowrap" data-i18n="col_actions">จัดการสิทธิ์</th>
              </tr>
            </thead>
            <tbody id="leagueTableBody" class="divide-y divide-borderLight dark:divide-borderDark text-xs">
              <tr>
                <td colspan="8" class="px-4 py-8 text-center text-slate-600 dark:text-neutral-400">กำลังโหลดข้อมูลพอร์ตโฟลิโอลีกจากระบบ…</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Inline Customer Lifecycle Management Panel -->
      <div id="lifecycleActionPanel" class="hidden p-5 rounded-xl border border-emerald-500/35 bg-cardLight dark:bg-cardDark space-y-4">
        <div class="flex flex-wrap items-start justify-between gap-3 border-b border-borderLight dark:border-borderDark pb-3">
          <div class="space-y-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h3 id="lcPanelTitle" class="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">-</h3>
              <span id="lcPanelBadges" class="inline-flex flex-wrap items-center gap-1.5 text-xs mono"></span>
            </div>
            <p id="lcPanelMeta" class="text-xs mono text-slate-600 dark:text-neutral-400">-</p>
            <p id="lcPanelBillingNote" class="hidden text-xs text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/25 rounded-md px-2.5 py-1"></p>
          </div>
          <button type="button" id="btnCloseLifecyclePanel" aria-label="Close lifecycle panel"
            class="min-w-[44px] min-h-[44px] px-3 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-700 dark:text-neutral-200 hover:bg-slate-200 dark:hover:bg-neutral-800 whitespace-nowrap transition-colors">
            ✕
          </button>
        </div>

        <!-- Private D1 Customer Note Editor (Never pushed to Git) -->
        <div class="pt-1 pb-4 border-b border-borderLight dark:border-borderDark space-y-2">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <label for="lcNoteInput" id="lcLblD1Note" class="text-xs font-semibold text-slate-800 dark:text-neutral-200">
              โน้ตลูกค้าส่วนตัว (บันทึกใน Cloudflare D1 — ไม่ลง Git)
            </label>
            <span id="lcNotePrivacyBadge" class="px-2 py-0.5 rounded text-xs mono bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 whitespace-nowrap">
              D1 Private · 0% Git Exposure
            </span>
          </div>
          <div class="flex flex-col sm:flex-row gap-2">
            <input id="lcNoteInput" type="text" maxlength="500" placeholder="เช่น LINE @somchai · โอน 500฿ 19 พ.ย."
              class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            <button type="button" id="btnSaveLeagueNote"
              class="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors">
              บันทึกโน้ตลง D1
            </button>
          </div>
          <p id="lcNoteStatus" role="status" class="hidden text-xs mono text-emerald-700 dark:text-emerald-400"></p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <label for="lcOutRenewCli" id="lcLblRenew" class="text-xs font-semibold text-slate-800 dark:text-neutral-200">1. ต่ออายุ / เปิดเต็มระบบ (Active)</label>
              <button type="button" data-copy-target="lcOutRenewCli" class="onb-copy-btn min-h-[42px] px-3.5 py-1.5 rounded-lg border border-borderLight dark:border-borderDark text-xs mono whitespace-nowrap shrink-0 hover:bg-raisedLight dark:hover:bg-raisedDark">Copy</button>
            </div>
            <textarea id="lcOutRenewCli" readonly rows="4" class="w-full p-3 rounded-lg border border-borderLight dark:border-borderDark bg-slate-950 text-emerald-300 text-xs mono leading-relaxed"></textarea>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <label for="lcOutPauseCli" id="lcLblPause" class="text-xs font-semibold text-slate-800 dark:text-neutral-200">2. พักระบบชั่วคราว (Paused)</label>
              <button type="button" data-copy-target="lcOutPauseCli" class="onb-copy-btn min-h-[42px] px-3.5 py-1.5 rounded-lg border border-borderLight dark:border-borderDark text-xs mono whitespace-nowrap shrink-0 hover:bg-raisedLight dark:hover:bg-raisedDark">Copy</button>
            </div>
            <textarea id="lcOutPauseCli" readonly rows="4" class="w-full p-3 rounded-lg border border-borderLight dark:border-borderDark bg-slate-950 text-amber-300 text-xs mono leading-relaxed"></textarea>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <label for="lcOutLineMsg" id="lcLblLine" class="text-xs font-semibold text-slate-800 dark:text-neutral-200">3. ข้อความแจ้งเตือนต่ออายุทาง LINE</label>
              <button type="button" data-copy-target="lcOutLineMsg" class="onb-copy-btn min-h-[42px] px-3.5 py-1.5 rounded-lg border border-borderLight dark:border-borderDark text-xs mono whitespace-nowrap shrink-0 hover:bg-raisedLight dark:hover:bg-raisedDark">Copy</button>
            </div>
            <textarea id="lcOutLineMsg" readonly rows="4" class="w-full p-3 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-slate-900 dark:text-neutral-100 text-xs leading-relaxed"></textarea>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 03. CUSTOMER ORDERS & PAYMENT SLIP INBOX                                  -->
    <!-- ========================================================================= -->
    <section id="sec-orders" class="space-y-4 scroll-mt-28" aria-labelledby="sec-orders-title">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div>
          <h2 id="sec-orders-title" class="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-white" data-i18n="sec3_title">
            03. กล่องรับคำสั่งซื้อ &amp; ตรวจสลิป
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-neutral-400" data-i18n="sec3_sub">
            ตั้งค่ารูป QR รับเงิน ตรวจสอบยอดโอนตามเศษสตางค์ ดูรูปสลิป ส่งข้อมูลเข้าเครื่องมือเปิดลีกด้านล่าง และแจ้งเปิดใช้งานทางอีเมลในคลิกเดียว
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2 self-start sm:self-auto shrink-0">
          <span id="ordersEmailStatusBadge" class="px-2.5 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs mono text-slate-700 dark:text-neutral-300 whitespace-nowrap">
            Email: Checking…
          </span>
          <button type="button" id="btnRefreshOrders"
            class="min-h-[42px] px-4 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-raisedDark text-xs font-semibold text-slate-800 dark:text-neutral-200 whitespace-nowrap shrink-0 transition-colors"
            data-i18n="ord_btn_refresh">
            รีเฟรชรายการออเดอร์
          </button>
        </div>
      </div>

      <!-- Private Payment QR Settings Card -->
      <div id="paymentQrSettingsCard" class="rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark p-4 sm:p-5 space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
          <h3 class="text-sm font-semibold text-slate-900 dark:text-white" data-i18n="pay_qr_title">
            ตั้งค่า QR รับเงินส่วนตัว (ไม่ต้องใช้เบอร์โทร / บัตร ปชช. / e-Wallet)
          </h3>
          <div class="flex flex-wrap items-center gap-2 shrink-0">
            <span id="payQrModeBadge" class="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/15 text-slate-700 dark:text-neutral-300 border border-slate-500/30 whitespace-nowrap">กำลังโหลด…</span>
            <button type="button" id="btnToggleQrBody" aria-expanded="true"
              class="min-h-[42px] px-3 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark hover:bg-slate-200 dark:hover:bg-neutral-800 text-xs font-semibold text-slate-800 dark:text-neutral-200 whitespace-nowrap transition-colors"
              data-i18n="btn_toggle_qr_hide">
              ซ่อนตั้งค่า QR
            </button>
          </div>
        </div>

        <div id="paymentQrSettingsBody" class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <div class="lg:col-span-8 space-y-3">
            <div class="space-y-1.5">
              <label for="payQrAccountNameInput" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="pay_qr_acct_lbl">
                ชื่อ-นามสกุลผู้รับเงิน (แสดงให้ลูกค้าตรวจเช็กก่อนโอน)
              </label>
              <input id="payQrAccountNameInput" type="text" maxlength="120" placeholder="เช่น นาย สมชาย ใจดี"
                class="w-full min-h-[42px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs text-slate-900 dark:text-white" />
            </div>

            <div class="space-y-1.5">
              <label for="payQrFileInput" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="pay_qr_file_lbl">
                อัปโหลดรูปภาพ QR Code รับเงิน
              </label>
              <input id="payQrFileInput" type="file" accept="image/png,image/jpeg,image/webp"
                class="block w-full min-h-[42px] text-xs text-slate-700 dark:text-neutral-300 file:mr-3 file:min-h-[40px] file:px-3.5 file:py-1.5 file:rounded-lg file:border file:border-borderLight dark:file:border-borderDark file:bg-raisedLight dark:file:bg-raisedDark file:text-xs file:font-semibold file:text-slate-800 dark:file:text-neutral-200 hover:file:bg-slate-200 dark:hover:file:bg-slate-800 cursor-pointer" />
              <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="pay_qr_file_hint">
                รองรับไฟล์ PNG / JPG / WebP (ย่อขนาดอัตโนมัติในเบราว์เซอร์) เก็บเป็นความลับในฐานข้อมูล D1 เท่านั้น ไม่บันทึกลง GitHub
              </p>
              <div id="payQrFileMeta" class="text-xs font-mono text-sky-700 dark:text-sky-400"></div>
            </div>

            <div class="flex flex-wrap gap-2 pt-1">
              <button type="button" id="btnSavePaymentQr"
                class="min-h-[42px] px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                data-i18n="pay_qr_btn_save">
                บันทึกการตั้งค่า QR
              </button>
              <button type="button" id="btnClearPaymentQr"
                class="hidden min-h-[42px] px-4 py-2 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                data-i18n="pay_qr_btn_clear">
                ลบรูป QR ออกจากฐานข้อมูล
              </button>
            </div>

            <div id="payQrFeedback" role="status" class="hidden p-2.5 rounded-lg text-xs border"></div>
          </div>

          <div class="lg:col-span-4 lg:border-l border-borderLight dark:border-borderDark lg:pl-5 pt-3 lg:pt-0 border-t lg:border-t-0 text-center space-y-2">
            <div class="text-xs font-semibold text-slate-700 dark:text-neutral-300" data-i18n="pay_qr_preview_lbl">
              ตัวอย่างรูป QR ที่แสดงให้ลูกค้า
            </div>
            <div id="payQrPreviewEmpty" class="py-8 text-xs text-slate-600 dark:text-neutral-400" data-i18n="pay_qr_preview_empty">
              ยังไม่ได้อัปโหลดรูป QR ส่วนตัว
            </div>
            <img id="payQrPreviewImg" src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=" alt="Payment QR Preview" class="hidden max-h-[180px] w-auto mx-auto rounded-lg border border-borderLight dark:border-borderDark object-contain bg-white p-1.5" />
            <div id="payQrUpdatedAt" class="text-xs mono text-slate-600 dark:text-neutral-400"></div>
          </div>
        </div>
      </div>

      <!-- Conversion & 24h Unpaid Order Stats Monitor -->
      <div id="ordersStatsMonitorStrip" class="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div class="p-3.5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-1">
          <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="ord_stat_total_lbl">คำสั่งซื้อสะสมทั้งหมด</div>
          <div id="ordStatTotal" class="text-xl font-bold mono text-slate-900 dark:text-white">0</div>
        </div>
        <div class="p-3.5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-1">
          <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="ord_stat_paid_lbl">โอนแล้ว / เปิดลีกสำเร็จ</div>
          <div class="flex items-center gap-2">
            <span id="ordStatPaidLive" class="text-xl font-bold mono text-emerald-700 dark:text-emerald-400">0</span>
            <span id="ordStatConvPct" class="px-2 py-0.5 rounded-full text-xs font-mono font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">0%</span>
          </div>
        </div>
        <div class="p-3.5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-1">
          <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="ord_stat_active_lbl">คิวรอดำเนินการปัจจุบัน</div>
          <div id="ordStatActive" class="text-xl font-bold mono text-sky-700 dark:text-sky-400">0</div>
        </div>
        <div class="p-3.5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-1">
          <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="ord_stat_expired_lbl">ไม่โอนเกิน 24 ชม. / ยกเลิกสะสม</div>
          <div id="ordStatExpiredTotal" class="text-xl font-bold mono text-amber-700 dark:text-amber-300">0</div>
        </div>
      </div>

      <div id="ordersFilterPills" class="flex flex-wrap gap-2">
        <button type="button" data-order-filter="all" class="ord-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300">
          <span data-i18n="ord_f_all">ทั้งหมด</span> (<span id="ordCnt_all">0</span>)
        </button>
        <button type="button" data-order-filter="slip_submitted" class="ord-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300">
          <span data-i18n="ord_f_slip">รอตรวจสลิป</span> (<span id="ordCnt_slip_submitted">0</span>)
        </button>
        <button type="button" data-order-filter="awaiting_payment" class="ord-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300">
          <span data-i18n="ord_f_await">รอโอน QR</span> (<span id="ordCnt_awaiting_payment">0</span>)
        </button>
        <button type="button" data-order-filter="paid" class="ord-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300">
          <span data-i18n="ord_f_paid">ตรวจยอดแล้ว</span> (<span id="ordCnt_paid">0</span>)
        </button>
        <button type="button" data-order-filter="quote_requested" class="ord-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300">
          <span data-i18n="ord_f_quote">ขอราคา / USD</span> (<span id="ordCnt_quote_requested">0</span>)
        </button>
        <button type="button" data-order-filter="live" class="ord-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300">
          <span data-i18n="ord_f_live">เปิดลีกแล้ว</span> (<span id="ordCnt_live">0</span>)
        </button>
        <button type="button" data-order-filter="rejected" class="ord-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300">
          <span data-i18n="ord_f_rejected">ปฏิเสธ</span> (<span id="ordCnt_rejected">0</span>)
        </button>
      </div>

      <div class="rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark overflow-hidden">
        <div class="overflow-x-auto touch-scroll">
          <table class="min-w-[860px] w-full divide-y divide-borderLight dark:divide-borderDark text-xs">
            <thead class="bg-raisedLight dark:bg-raisedDark text-slate-700 dark:text-neutral-300">
              <tr>
                <th scope="col" class="px-4 py-3 text-left font-semibold whitespace-nowrap" data-i18n="ord_col_id">รหัสออเดอร์</th>
                <th scope="col" class="px-4 py-3 text-left font-semibold whitespace-nowrap" data-i18n="ord_col_league">ลีก FPL</th>
                <th scope="col" class="px-4 py-3 text-right font-semibold whitespace-nowrap" data-i18n="ord_col_amount">ยอดชำระ</th>
                <th scope="col" class="px-4 py-3 text-left font-semibold whitespace-nowrap" data-i18n="ord_col_contact">ช่องทางติดต่อ</th>
                <th scope="col" class="px-4 py-3 text-left font-semibold whitespace-nowrap" data-i18n="ord_col_status">สถานะ</th>
                <th scope="col" class="px-4 py-3 text-left font-semibold whitespace-nowrap" data-i18n="ord_col_created">เวลาสั่งซื้อ</th>
                <th scope="col" class="px-4 py-3 text-right font-semibold whitespace-nowrap" data-i18n="ord_col_action">ตรวจสอบ</th>
              </tr>
            </thead>
            <tbody id="ordersTableBody" class="divide-y divide-borderLight dark:divide-borderDark">
              <tr>
                <td colspan="7" class="px-4 py-8 text-center text-slate-600 dark:text-neutral-400">กำลังโหลดข้อมูลออเดอร์…</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Order Inspector & Slip Verification Panel -->
      <div id="orderDetailPanel" class="hidden p-5 sm:p-6 rounded-xl border border-sky-500/40 bg-cardLight dark:bg-cardDark space-y-5">
        <div class="flex flex-wrap items-start justify-between gap-3 border-b border-borderLight dark:border-borderDark pb-4">
          <div class="space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <a id="ordDetId" href="#" target="_blank" rel="noopener noreferrer" class="min-h-[42px] px-3 py-2 rounded-lg bg-raisedLight dark:bg-raisedDark font-mono text-xs font-bold text-sky-700 dark:text-sky-300 underline underline-offset-2 hover:text-sky-600 dark:hover:text-sky-200 inline-flex items-center whitespace-nowrap">-</a>
              <span id="ordDetStatusBadge" class="px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap">-</span>
              <a id="ordDetOpenPayLink" href="#" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center min-h-[42px] px-3 py-1.5 rounded-lg border border-sky-500/40 bg-sky-500/10 hover:bg-sky-500/20 text-xs font-semibold text-sky-800 dark:text-sky-300 whitespace-nowrap transition-colors"
                data-i18n="ord_det_open_pay">
                เปิดหน้าออเดอร์ลูกค้า (/pay/) ↗
              </a>
              <button type="button" id="btnOrdCopyPayLink"
                class="inline-flex items-center min-h-[42px] px-3 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark hover:border-sky-500 text-xs font-semibold text-slate-800 dark:text-neutral-200 whitespace-nowrap transition-colors"
                data-i18n="ord_det_copy_pay">
                คัดลอกลิงก์ออเดอร์
              </button>
            </div>
            <h3 id="ordDetLeagueTitle" class="text-base font-semibold text-slate-900 dark:text-white">-</h3>
            <p id="ordDetContact" class="text-xs text-slate-600 dark:text-neutral-400 break-all">-</p>
            <div class="flex flex-wrap gap-2 pt-0.5">
              <button type="button" id="btnOrdCopyLineReply"
                class="inline-flex items-center min-h-[42px] px-3.5 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-800 dark:text-emerald-300 whitespace-nowrap transition-colors"
                data-i18n="ord_det_copy_line">
                คัดลอกข้อความแจ้งสถานะ (ส่ง LINE)
              </button>
              <a id="btnOrdEmailCustomer" href="#"
                class="inline-flex items-center min-h-[42px] px-3.5 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark hover:border-sky-500 text-xs font-semibold text-slate-800 dark:text-neutral-200 whitespace-nowrap transition-colors"
                data-i18n="ord_det_email_cust">
                เปิดร่างอีเมลตอบลูกค้า ↗
              </a>
            </div>
          </div>
          <div class="text-left sm:text-right">
            <div class="text-xs uppercase tracking-wide text-slate-600 dark:text-neutral-400" data-i18n="ord_det_amount_lbl">ยอดโอนที่ต้องตรงกัน</div>
            <div id="ordDetAmount" class="text-2xl font-bold mono text-emerald-700 dark:text-emerald-400">-</div>
            <div id="ordDetCreated" class="text-xs mono text-slate-600 dark:text-neutral-400">-</div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <!-- Controls & Rules -->
          <div class="lg:col-span-7 space-y-4">
            <div class="space-y-1.5">
              <div class="text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="ord_det_rules_lbl">กติกาและรายละเอียดที่ลูกค้ากรอก</div>
              <pre id="ordDetRules" class="p-3.5 rounded-lg bg-raisedLight dark:bg-raisedDark text-xs text-slate-800 dark:text-neutral-200 whitespace-pre-wrap font-sans">-</pre>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1.5">
                <label for="orderAdminNoteInput" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="ord_lbl_note">บันทึกแอดมิน / เหตุผลกรณีปฏิเสธสลิป</label>
                <input id="orderAdminNoteInput" type="text" placeholder="e.g. สลิปไม่ชัด / ยอดไม่ตรง"
                  class="w-full min-h-[42px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs text-slate-900 dark:text-white" />
              </div>
              <div class="space-y-1.5">
                <label for="orderDeliveredUrlInput" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="ord_lbl_url">ลิงก์ลีกที่จะส่งมอบ (Delivered URL)</label>
                <input id="orderDeliveredUrlInput" type="text" placeholder="https://www.fplsawadika.com/40700/"
                  class="w-full min-h-[42px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs mono text-slate-900 dark:text-white" />
              </div>
            </div>

            <!-- Primary Fulfillment Workflow Buttons -->
            <div class="space-y-3 pt-1">
              <div class="flex flex-wrap gap-2">
                <button type="button" id="btnOrdVerifyPaid"
                  class="min-h-[42px] px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold whitespace-nowrap transition-colors"
                  data-i18n="ord_act_verify">
                  ✓ ยืนยันรับยอดโอน (Paid)
                </button>
                <button type="button" id="btnOrdPrefillOnb"
                  class="min-h-[42px] px-4 py-2 rounded-lg bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold whitespace-nowrap transition-colors"
                  data-i18n="ord_act_prefill">
                  Prefill Onboarding ↓
                </button>
                <button type="button" id="btnOrdMarkLive"
                  class="min-h-[42px] px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold whitespace-nowrap transition-colors"
                  data-i18n="ord_act_live">
                  เปิดลีกแล้ว &amp; ส่งอีเมล (Mark Live)
                </button>
              </div>

              <!-- Secondary & Cleanup Controls -->
              <div class="pt-3 border-t border-borderLight dark:border-borderDark flex flex-wrap gap-2">
                <button type="button" id="btnOrdReject"
                  class="min-h-[42px] px-3.5 py-2 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-semibold whitespace-nowrap transition-colors"
                  data-i18n="ord_act_reject">
                  ปฏิเสธสลิป + ส่งอีเมล
                </button>
                <button type="button" id="btnOrdDeleteSlip"
                  class="min-h-[42px] px-3.5 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-neutral-300 text-xs font-semibold whitespace-nowrap transition-colors"
                  data-i18n="ord_act_delslip">
                  ลบรูปสลิป
                </button>
                <button type="button" id="btnOrdDeleteUnpaid"
                  class="min-h-[42px] px-3.5 py-2 rounded-lg border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-semibold whitespace-nowrap transition-colors"
                  data-i18n="ord_act_del_unpaid">
                  ลบออเดอร์ไม่โอน (+นับสถิติ)
                </button>
                <button type="button" id="btnOrdDeleteTest"
                  class="min-h-[42px] px-3.5 py-2 rounded-lg border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 text-xs font-semibold whitespace-nowrap transition-colors"
                  data-i18n="ord_act_del_test">
                  ลบออเดอร์ทดสอบ (ไม่นับสถิติ)
                </button>
              </div>
            </div>

            <div id="orderActionFeedback" role="status" class="hidden p-3 rounded-lg text-xs border"></div>
          </div>

          <!-- Slip Preview -->
          <div class="lg:col-span-5 lg:border-l border-borderLight dark:border-borderDark lg:pl-5 pt-4 lg:pt-0 border-t lg:border-t-0 space-y-3 text-center">
            <div class="flex items-center justify-between text-xs gap-2">
              <strong class="text-slate-800 dark:text-neutral-200" data-i18n="ord_slip_heading">รูปสลิปโอนเงินที่ลูกค้าแนบ</strong>
              <span id="ordDetSlipUploadedAt" class="mono text-xs text-slate-600 dark:text-neutral-400">-</span>
            </div>
            <div id="ordDetSlipEmpty" class="py-8 text-xs text-slate-600 dark:text-neutral-400">ยังไม่มีรูปสลิปในคำสั่งซื้อนี้</div>
            <div id="ordDetSlipLoading" class="hidden py-8 text-xs text-sky-600 dark:text-sky-400">กำลังโหลดรูปสลิปจากฐานข้อมูล…</div>
            <img id="orderSlipImg" src="data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=" alt="Customer Transfer Slip" class="hidden max-h-[380px] w-auto mx-auto rounded-lg border border-borderLight dark:border-borderDark object-contain bg-white" />
            <button type="button" id="btnLoadOrderSlip" class="hidden min-h-[42px] px-3.5 py-2 rounded-lg border border-borderLight dark:border-borderDark text-xs font-medium hover:bg-raisedLight dark:hover:bg-raisedDark whitespace-nowrap" data-i18n="ord_btn_reload_slip">
              โหลดรูปสลิปอีกครั้ง
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 04. CONCIERGE CUSTOMER LEAGUE ONBOARDING WIZARD                           -->
    <!-- ========================================================================= -->
    <section id="sec-onboarding" class="space-y-4 scroll-mt-28" aria-labelledby="sec-onboarding-title">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div>
          <h2 id="sec-onboarding-title" class="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-white" data-i18n="sec4_title">
            04. เครื่องมือเปิดลีกลูกค้าใหม่ (Concierge Onboarding Wizard)
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-neutral-400" data-i18n="sec4_sub">
            ตรวจสอบ FPL Classic League ID สดจากเซิร์ฟเวอร์พรีเมียร์ลีก เลือกทีมที่ไม่ร่วมชิงรางวัล ตั้งค่าแพ็กเกจ และสร้างสคริปต์เปิดใช้งานทันที
          </p>
        </div>
        <span class="px-2.5 py-1 rounded-md text-xs font-medium mono bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30 self-start sm:self-auto whitespace-nowrap">
          Type A Concierge Flow
        </span>
      </div>

      <div class="p-5 sm:p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          <div class="lg:col-span-4 space-y-1.5">
            <label for="onbLeagueId" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_id">
              FPL Classic League ID (ตัวเลขเท่านั้น)
            </label>
            <div class="flex gap-2">
              <input id="onbLeagueId" type="text" inputmode="numeric" pattern="[0-9]*" placeholder="e.g. 40700"
                class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-sm mono text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              <button type="button" id="btnOnbInspect"
                class="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 active:scale-[0.98] text-white text-xs font-semibold whitespace-nowrap shrink-0 transition-colors"
                data-i18n="onb_btn_inspect">
                ดึงข้อมูลลีกสด
              </button>
            </div>
          </div>

          <div class="lg:col-span-2 space-y-1.5">
            <label for="onbPlan" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_plan">แพ็กเกจ (Plan)</label>
            <select id="onbPlan" class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-900 dark:text-white">
              <option value="standard">Standard (฿500 / $19)</option>
              <option value="tier2_quote">Tier 2 Quote (31+ ทีม)</option>
              <option value="custom" disabled>Custom — Roadmap H2H/Predict (฿900 / $29)</option>
            </select>
          </div>

          <div class="lg:col-span-2 space-y-1.5">
            <label for="onbPrizeModel" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_prize">รูปแบบรางวัล</label>
            <select id="onbPrizeModel" class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-900 dark:text-white">
              <option value="weekly">Weekly Top-Score</option>
              <option value="standard">Season Top Only</option>
              <option value="monthly">Monthly Top-Score</option>
              <option value="penalties">Weekly + Penalties</option>
            </select>
          </div>

          <div class="lg:col-span-2 space-y-1.5">
            <label id="onbWeeklyPrizeLbl" for="onbWeeklyPrize" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_weekly">รางวัล/สัปดาห์ (บาท)</label>
            <input id="onbWeeklyPrize" type="text" inputmode="numeric" value="300"
              class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-sm mono text-slate-900 dark:text-white" />
          </div>

          <div class="lg:col-span-2 space-y-1.5">
            <label for="onbStatus" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_status">สถานะสิทธิ์ (Status)</label>
            <select id="onbStatus" class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-900 dark:text-white">
              <option value="active">Active (ใช้งานเต็มระบบ)</option>
              <option value="trial">Trial (ทดลองใช้งาน)</option>
              <option value="paused">Paused (หมดอายุ/พักระบบ)</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-end">
          <div class="space-y-1.5">
            <label for="onbTier" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_tier">ระดับสถาปัตยกรรม (Tier)</label>
            <select id="onbTier" class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-900 dark:text-white">
              <option value="1">Tier 1 — Full Analytics (≤30 ทีม)</option>
              <option value="2">Tier 2 — Auto-Picks Live (31–3,000 ทีม)</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label for="onbCurrency" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_currency">สกุลเงินรางวัล (Currency)</label>
            <select id="onbCurrency" class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-900 dark:text-white">
              <option value="THB">THB (฿ บาท)</option>
              <option value="USD">USD ($ ดอลลาร์)</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label for="onbEntryFee" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_entry_fee">ค่าสมัคร/ทีม (ไม่บังคับ)</label>
            <input id="onbEntryFee" type="text" placeholder="e.g. 500 or 20"
              class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs mono text-slate-900 dark:text-white" />
          </div>
          <div class="space-y-1.5">
            <label for="onbTotalPool" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_total_pool">เงินกองกลางรวม (ไม่บังคับ)</label>
            <input id="onbTotalPool" type="text" placeholder="e.g. 15000"
              class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs mono text-slate-900 dark:text-white" />
          </div>
          <div class="space-y-1.5">
            <label for="onbSeasonPrizes" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_season_prizes">รางวัลแชมป์ฤดูกาล (ไม่บังคับ)</label>
            <input id="onbSeasonPrizes" type="text" placeholder="1st:3000,2nd:2000,3rd:1000"
              class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs mono text-slate-900 dark:text-white" />
          </div>
          <div class="space-y-1.5">
            <label for="onbCupPrize" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_cup_prize">รางวัลบอลถ้วย (แชมป์ หรือ แชมป์/รอง)</label>
            <input id="onbCupPrize" type="text" placeholder="e.g. 1000 or 1000/500"
              class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs mono text-slate-900 dark:text-white" />
          </div>
        </div>

        <div id="onbPenaltyTiersWrap" class="hidden grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-4 border-t border-borderLight dark:border-borderDark">
          <div class="space-y-1.5">
            <label for="onbPenaltyTiers" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_penalty_tiers">ขั้นค่าปรับบ๊วย N อันดับท้าย (คั่นด้วยจุลภาค จากบ๊วยสุดไปอันดับถัดขึ้นไป)</label>
            <input id="onbPenaltyTiers" type="text" value="300,200,100" placeholder="e.g. 300,200,100 or 600,500,400,300,200"
              class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs mono text-slate-900 dark:text-white" />
          </div>
          <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="onb_penalty_hint">
            รองรับกี่อันดับก็ได้ (เช่น 3 อันดับท้าย = 300,200,100) ระบบจะปรับหัวตารางและการ์ดสรุปอัตโนมัติ
          </div>
        </div>

        <div id="onbMonthlySplitWrap" class="hidden grid grid-cols-1 md:grid-cols-2 gap-4 items-end pt-4 border-t border-borderLight dark:border-borderDark">
          <div class="space-y-1.5">
            <label for="onbMonthlyChamp" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_monthly_champ">รางวัลแชมป์ประจำเดือน (ต่อเดือน)</label>
            <input id="onbMonthlyChamp" type="text" inputmode="numeric" value="600"
              class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs mono text-slate-900 dark:text-white" />
          </div>
          <div class="space-y-1.5">
            <label for="onbMonthlyRunner" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_monthly_runner">รางวัลรองแชมป์ประจำเดือน (ใส่ 0 หากมีเฉพาะแชมป์)</label>
            <input id="onbMonthlyRunner" type="text" inputmode="numeric" value="400"
              class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs mono text-slate-900 dark:text-white" />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div class="space-y-1.5">
            <label for="onbTenantGroup" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_tenant">Tenant Group (แยกการมองเห็น)</label>
            <input id="onbTenantGroup" type="text" placeholder="private_<id> (auto)"
              class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs mono text-slate-900 dark:text-white" />
          </div>
          <div class="space-y-1.5">
            <label for="onbVisibility" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_visibility">การมองเห็น & SEO</label>
            <select id="onbVisibility" class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-900 dark:text-white">
              <option value="private">Private (noindex, isolated)</option>
              <option value="showcase">Showcase (public demo + sitemap)</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <label for="onbShortName" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_short">ชื่อย่อหน้าลีก (Short Name)</label>
            <input id="onbShortName" type="text" placeholder="Auto from FPL name"
              class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs text-slate-900 dark:text-white" />
          </div>
          <div class="space-y-1.5">
            <label for="onbExpiresAt" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_expires">วันหมดอายุ (Expires At)</label>
            <input id="onbExpiresAt" type="date"
              class="w-full min-h-[44px] px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs mono text-slate-900 dark:text-white" />
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4">
          <label for="onbNoCup" class="inline-flex items-center gap-2 min-h-[44px] px-3 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight/60 dark:bg-raisedDark/60 text-xs font-medium text-slate-800 dark:text-neutral-200 cursor-pointer">
            <input id="onbNoCup" type="checkbox" class="rounded border-slate-400 text-emerald-600 focus:ring-emerald-500" />
            <span data-i18n="onb_lbl_nocup">ปิดแท็บบอลถ้วย (--no-cup สำหรับลีกที่ไม่ได้เตะบอลถ้วย)</span>
          </label>
          <div id="onbD1NoteCallout" class="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-500/10 border border-emerald-500/25 rounded-lg px-3 py-2" data-i18n="onb_d1_note_tip">
            🔒 โน้ตข้อมูลลูกค้าส่วนตัว (ชื่อ LINE / วันโอนเงิน) ให้บันทึกในตารางข้อ 02 ด้านบน (เก็บใน Cloudflare D1 ปลอดภัย 100% ไม่ถูก commit ลง Git)
          </div>
        </div>

        <div id="onbInspectStatus" role="status" class="hidden p-3 rounded-lg text-xs border"></div>

        <div id="onbInspectResult" class="hidden space-y-3 pt-4 border-t border-borderLight dark:border-borderDark">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <div id="onbLeagueNameTitle" class="text-sm font-bold text-slate-900 dark:text-white">-</div>
              <div id="onbLeagueMetaLine" class="text-xs mono text-slate-600 dark:text-neutral-400">-</div>
            </div>
            <span id="onbTierBadge" class="px-2.5 py-1 rounded-md text-xs font-semibold mono"></span>
          </div>
          <div class="text-xs font-medium text-slate-700 dark:text-neutral-300" data-i18n="onb_teams_hint">
            ติ๊กเลือกทีมที่ไม่ร่วมชิงรางวัล (non_prize_teams) หากมี:
          </div>
          <div id="onbTeamsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1"></div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <label for="onbOutCli" class="text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_out_cli">1. คำสั่ง CLI (รันบนเครื่องเพื่อเปิดลีก)</label>
              <button type="button" data-copy-target="onbOutCli" class="onb-copy-btn min-h-[42px] px-3.5 py-1.5 rounded-lg border border-borderLight dark:border-borderDark text-xs mono whitespace-nowrap shrink-0 hover:bg-raisedLight dark:hover:bg-raisedDark">Copy</button>
            </div>
            <textarea id="onbOutCli" readonly rows="5" class="w-full p-3 rounded-lg border border-borderLight dark:border-borderDark bg-slate-950 text-emerald-300 text-xs mono leading-relaxed"></textarea>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <label for="onbOutJson" class="text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_out_json">2. Config JSON (leagues_config.json)</label>
              <button type="button" data-copy-target="onbOutJson" class="onb-copy-btn min-h-[42px] px-3.5 py-1.5 rounded-lg border border-borderLight dark:border-borderDark text-xs mono whitespace-nowrap shrink-0 hover:bg-raisedLight dark:hover:bg-raisedDark">Copy</button>
            </div>
            <textarea id="onbOutJson" readonly rows="5" class="w-full p-3 rounded-lg border border-borderLight dark:border-borderDark bg-slate-950 text-sky-300 text-xs mono leading-relaxed"></textarea>
          </div>

          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <label for="onbOutLine" class="text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_out_line">3. ข้อความส่งมอบลูกค้าทาง LINE</label>
              <button type="button" data-copy-target="onbOutLine" class="onb-copy-btn min-h-[42px] px-3.5 py-1.5 rounded-lg border border-borderLight dark:border-borderDark text-xs mono whitespace-nowrap shrink-0 hover:bg-raisedLight dark:hover:bg-raisedDark">Copy</button>
            </div>
            <textarea id="onbOutLine" readonly rows="5" class="w-full p-3 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-slate-900 dark:text-neutral-100 text-xs leading-relaxed"></textarea>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 05. FEATURE ADOPTION & REAL SEGMENT ENGAGEMENT                            -->
    <!-- ========================================================================= -->
    <section id="sec-features" class="space-y-4 scroll-mt-28" aria-labelledby="sec-features-title">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.chart}</span>
          <h2 id="sec-features-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec5_title">
            05. พฤติกรรมการใช้งานฟีเจอร์และคุณค่าผลิตภัณฑ์ (สด 7 วัน)
          </h2>
        </div>
        <span class="text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="sec5_sub">
          รวมทุกแท็บจริงบนเว็บ รวมถึง Transfer Advisor · คำนวณ 100% จาก D1 Beacon
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Card 5A: Real Feature Adoption List -->
        <div class="lg:col-span-2 p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-base font-semibold text-slate-900 dark:text-white" data-i18n="feat_share_title">สัดส่วนการคลิกใช้งานแต่ละโมดูลจริง (รอบ 7 วัน)</h3>
            <span id="featTotalHitsBadge" class="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-xs mono text-emerald-700 dark:text-emerald-400">0 events</span>
          </div>

          <div id="featureAdoptionList" class="divide-y divide-borderLight dark:divide-borderDark text-xs">
            <div class="py-6 text-center text-slate-600 dark:text-neutral-400">กำลังรอข้อมูลกิจกรรมฟีเจอร์จาก Cloudflare D1…</div>
          </div>
        </div>

        <!-- Card 5B: Real Segment Engagement Comparison -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-4">
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-base font-semibold text-slate-900 dark:text-white" data-i18n="feat_seg_title">การมีส่วนร่วม: ลีกเงินรางวัล vs ลีกทั่วไป</h3>
              <span id="segMultiplierBadge" class="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/25 text-xs mono font-semibold text-emerald-800 dark:text-emerald-300">—</span>
            </div>
            <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="feat_seg_desc">
              เปรียบเทียบอัตราการเปิดดูต่อทีม (Visits / Team · 7 วัน) จากยอดเข้าชมจริงใน D1 แยกตามลีกที่ตั้งเงินรางวัลและลีกคอมมูนิตี้
            </p>

            <div class="space-y-3 pt-2 border-t border-borderLight dark:border-borderDark">
              <div class="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 space-y-1">
                <div class="flex items-center justify-between gap-2 text-xs">
                  <span class="font-medium text-emerald-900 dark:text-emerald-200" data-i18n="seg_prize_lbl">ลีกเงินรางวัล (Prize Leagues)</span>
                  <span id="segPrizeVpt" class="text-lg font-bold mono tabular text-emerald-700 dark:text-emerald-400">0</span>
                </div>
                <div id="segPrizeMeta" class="text-xs mono text-slate-600 dark:text-neutral-400">—</div>
              </div>

              <div class="p-3 rounded-lg bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark space-y-1">
                <div class="flex items-center justify-between gap-2 text-xs">
                  <span class="font-medium text-slate-800 dark:text-neutral-200" data-i18n="seg_comm_lbl">ลีกทั่วไป / ฟรีลีก (Community)</span>
                  <span id="segCommVpt" class="text-lg font-bold mono tabular text-slate-900 dark:text-white">0</span>
                </div>
                <div id="segCommMeta" class="text-xs mono text-slate-600 dark:text-neutral-400">—</div>
              </div>
            </div>
          </div>

          <div id="segTopPrizeDesc" class="p-3 rounded-lg bg-raisedLight dark:bg-raisedDark text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">
            กำลังคำนวณลีกที่มีการมีส่วนร่วมสูงสุดจากฐานข้อมูล…
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 06. BROWSER / IN-APP, GEO & LANGUAGE (TH / EN)                            -->
    <!-- ========================================================================= -->
    <section id="sec-distribution" class="space-y-4 scroll-mt-28" aria-labelledby="sec-distribution-title">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.globe}</span>
          <h2 id="sec-distribution-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec6_title">
            06. ช่องทางเข้าใช้งาน (Browser), ภูมิภาค และภาษา (TH / EN)
          </h2>
        </div>
        <span class="text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="sec6_sub">
          จำแนก LINE In-App Browser, Safari, Chrome · พื้นที่จริงจาก Edge · สัดส่วน TH vs EN
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Card 6A: Browser & In-App Client Breakdown -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-4">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-base font-semibold text-slate-900 dark:text-white" data-i18n="dist_src_title">เบราว์เซอร์และแอปที่ผู้ใช้เปิดลิงก์ (7 วัน)</h3>
            <span id="browserTotalBadge" class="text-xs mono text-slate-600 dark:text-neutral-400">0 events</span>
          </div>
          <div id="browserDistributionList" class="space-y-3 text-xs">
            <div class="py-4 text-center text-slate-600 dark:text-neutral-400">กำลังโหลดข้อมูล User-Agent จาก D1…</div>
          </div>
        </div>

        <!-- Card 6B: Real Geo Split + Live Language Preference (TH / EN) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-4">
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-2">
              <h3 class="text-base font-semibold text-slate-900 dark:text-white" data-i18n="dist_geo_title">พื้นที่เชื่อมต่อและสัดส่วนภาษาที่ใช้งานจริง</h3>
              <span id="geoTotalBadge" class="text-xs mono text-emerald-700 dark:text-emerald-400">CF Geo + Locale</span>
            </div>

            <!-- Geo 3-Bucket Grid -->
            <div class="grid grid-cols-3 gap-2.5 text-center">
              <div class="p-3 rounded-lg bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark">
                <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="geo_bkk_lbl">กทม. &amp; ปริมณฑล</div>
                <div id="geoBkkPct" class="text-lg font-bold mono tabular text-slate-900 dark:text-white mt-0.5">0.0%</div>
                <div id="geoBkkCount" class="text-xs mono text-slate-600 dark:text-neutral-400">0 hits</div>
              </div>
              <div class="p-3 rounded-lg bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark">
                <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="geo_reg_lbl">ต่างจังหวัด</div>
                <div id="geoRegPct" class="text-lg font-bold mono tabular text-slate-900 dark:text-white mt-0.5">0.0%</div>
                <div id="geoRegCount" class="text-xs mono text-slate-600 dark:text-neutral-400">0 hits</div>
              </div>
              <div class="p-3 rounded-lg bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark">
                <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="geo_intl_lbl">ต่างประเทศ</div>
                <div id="geoIntlPct" class="text-lg font-bold mono tabular text-slate-900 dark:text-white mt-0.5">0.0%</div>
                <div id="geoIntlCount" class="text-xs mono text-slate-600 dark:text-neutral-400">0 hits</div>
              </div>
            </div>

            <!-- Real Locale Split (TH vs EN) -->
            <div class="space-y-2 pt-2 border-t border-borderLight dark:border-borderDark">
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium text-slate-800 dark:text-neutral-200" data-i18n="dist_locale_lbl">ภาษาหน้าเว็บที่ผู้ใช้เลือก (TH vs EN)</span>
                <span id="geoLocaleSplit" class="mono font-semibold text-slate-900 dark:text-white">ยังไม่มีข้อมูลสลับภาษา</span>
              </div>
              <div class="w-full h-2.5 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden flex">
                <div id="localeThBar" class="bg-emerald-500 h-full transition-all duration-300" style="width: 0%"></div>
                <div id="localeEnBar" class="bg-sky-500 h-full transition-all duration-300" style="width: 0%"></div>
              </div>
              <div id="localeCountsMeta" class="flex justify-between text-xs mono text-slate-600 dark:text-neutral-400">
                <span>TH: 0</span>
                <span>EN: 0</span>
              </div>
            </div>
          </div>

          <div id="geoEdgeFooter" class="p-3 rounded-lg bg-raisedLight dark:bg-raisedDark text-xs mono text-slate-600 dark:text-neutral-400">
            Edge Colo: ${safeColo} · กำลังรอสัญญาณ Geo จาก Edge Request
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 07. CLIENT DEVICES & VIEWPORT READINESS                                   -->
    <!-- ========================================================================= -->
    <section id="sec-devices" class="space-y-4 scroll-mt-28" aria-labelledby="sec-devices-title">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.smartphone}</span>
          <div>
            <h2 id="sec-devices-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec7_title">
              07. สัดส่วนอุปกรณ์ผู้ใช้งานจริง (รองรับ iPadOS แท็บเล็ต)
            </h2>
            <p class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="sec7_sub">
              ตรวจจับหน้าจอ + Touch เพื่อแยก iPad ออกจาก Desktop ไม่รวมปนกัน
            </p>
          </div>
        </div>
        <div class="inline-flex items-center gap-2 self-start sm:self-auto shrink-0" role="group" aria-label="Device telemetry window">
          <button type="button" id="btnDev7d" onclick="switchDeviceWindow('7d')"
            class="min-h-[44px] px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs font-medium text-emerald-800 dark:text-emerald-300 whitespace-nowrap shrink-0 transition-colors"
            data-i18n="dev_btn_7d">
            7 วันล่าสุด
          </button>
          <button type="button" id="btnDev30d" onclick="switchDeviceWindow('30d')"
            class="min-h-[44px] px-4 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0 transition-colors"
            data-i18n="dev_btn_30d">
            30 วันล่าสุด
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="inline-flex items-center gap-2 font-medium text-slate-800 dark:text-neutral-200">${ICONS.deviceMobile} <span data-i18n="dev_mobile_label">สมาร์ตโฟน (Mobile Phones)</span></span>
            <span id="devMobileBadge" class="mono text-slate-600 dark:text-neutral-400">0</span>
          </div>
          <div id="deviceMobilePct" class="text-3xl font-semibold mono tabular text-emerald-700 dark:text-emerald-400">0.0%</div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="deviceMobileBar" class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
          <p id="devMobileDesc" class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="dev_mobile_desc">iOS / Android &lt; 768px</p>
        </div>

        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="inline-flex items-center gap-2 font-medium text-slate-800 dark:text-neutral-200">${ICONS.deviceDesktop} <span data-i18n="dev_desktop_label">คอมพิวเตอร์ตั้งโต๊ะ / โน้ตบุ๊ก (Desktop)</span></span>
            <span id="devDesktopBadge" class="mono text-slate-600 dark:text-neutral-400">0</span>
          </div>
          <div id="deviceDesktopPct" class="text-3xl font-semibold mono tabular text-slate-900 dark:text-white">0.0%</div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="deviceDesktopBar" class="bg-slate-600 dark:bg-neutral-400 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
          <p id="devDesktopDesc" class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="dev_desktop_desc">macOS / Windows Non-Touch</p>
        </div>

        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-3">
          <div class="flex items-center justify-between text-xs">
            <span class="inline-flex items-center gap-2 font-medium text-slate-800 dark:text-neutral-200">${ICONS.deviceTablet} <span data-i18n="dev_tablet_label">ไอแพดและแท็บเล็ต (iPadOS / Tablet)</span></span>
            <span id="devTabletBadge" class="mono text-slate-600 dark:text-neutral-400">0</span>
          </div>
          <div id="deviceTabletPct" class="text-3xl font-semibold mono tabular text-slate-900 dark:text-white">0.0%</div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="deviceTabletBar" class="bg-sky-500 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
          <p id="devTabletDesc" class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="dev_tablet_desc">iPadOS Touch &amp; Tablets</p>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 08. MATCHDAY TRAFFIC RHYTHM & REAL PEAK WINDOWS                           -->
    <!-- ========================================================================= -->
    <section id="sec-timing" class="space-y-4 scroll-mt-28" aria-labelledby="sec-timing-title">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.clock}</span>
          <h2 id="sec-timing-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec8_title">
            08. ช่วงเวลาใช้งานพีคและพฤติกรรมวันแข่งขัน (ICT · 7 วันล่าสุด)
          </h2>
        </div>
        <span class="text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="sec8_sub">
          กราฟจากเวลาเข้าชมจริงใน Cloudflare D1 (ไม่มีเส้นจำลอง)
        </span>
      </div>

      <div class="p-5 sm:p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 id="trafficChartTitle" class="text-base font-semibold text-slate-900 dark:text-white" data-i18n="chart_title_hourly">
              กราฟความหนาแน่นทราฟฟิกรายชั่วโมง (24 ชั่วโมง · ICT)
            </h3>
            <p id="trafficChartSub" class="text-xs text-slate-600 dark:text-neutral-400 mt-0.5" data-i18n="chart_sub_hourly">
              รวมยอดเข้าชมจริง 7 วันย้อนหลังตามชั่วโมง (00:00–23:59 ICT)
            </p>
          </div>
          <div class="inline-flex items-center gap-2 self-start sm:self-auto shrink-0" role="group" aria-label="Traffic chart mode">
            <button type="button" id="btnChartHourly" onclick="switchChartMode('hourly')"
              class="min-h-[44px] px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs font-medium text-emerald-800 dark:text-emerald-300 whitespace-nowrap shrink-0 transition-colors"
              data-i18n="chart_btn_24h">
              รายชั่วโมง (24 ชม.)
            </button>
            <button type="button" id="btnChartDaily" onclick="switchChartMode('daily')"
              class="min-h-[44px] px-4 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0 transition-colors"
              data-i18n="chart_btn_7d">
              รายวัน (7 วัน)
            </button>
          </div>
        </div>

        <div class="w-full space-y-1.5">
          <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-neutral-400">
            <span id="trafficYAxisUnit" class="font-medium">แกนตั้ง (Y): จำนวนการเข้าชมจริง (ครั้ง)</span>
            <span id="trafficXAxisUnit" class="mono">แกนนอน (X): ชั่วโมงเวลาไทย 00:00–23:00 น.</span>
          </div>
          <svg id="trafficSvgChart" viewBox="0 0 680 220" class="w-full h-48 sm:h-56 overflow-visible" role="img" aria-label="Matchday traffic distribution chart"></svg>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-borderLight dark:border-borderDark text-xs text-slate-600 dark:text-neutral-400">
          <div class="flex items-center gap-4">
            <span class="inline-flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
              <span data-i18n="chart_legend_peak">ชั่วโมงพีคสูงสุด (Peak)</span>
            </span>
            <span class="inline-flex items-center gap-1.5">
              <span class="w-2.5 h-2.5 rounded-sm bg-slate-400 dark:bg-neutral-600"></span>
              <span data-i18n="chart_legend_normal">ช่วงเวลาปกติ</span>
            </span>
          </div>
          <span id="chartPeakCallout" class="mono text-slate-800 dark:text-neutral-200 font-medium">กำลังรอข้อมูลทราฟฟิกรายชั่วโมงจาก D1…</span>
        </div>

        <!-- 3 Real D1 Time-of-Day Windows -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-borderLight dark:border-borderDark">
          <div class="p-4 rounded-xl bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark space-y-1">
            <div class="flex items-center justify-between text-xs gap-2">
              <span class="font-semibold text-slate-900 dark:text-white" data-i18n="win_evening_title">ช่วงค่ำ–ดึกแข่งขัน (18:00–02:59 น.)</span>
              <span id="peakWinEveningPct" class="mono font-bold text-emerald-700 dark:text-emerald-400 shrink-0">0.0%</span>
            </div>
            <div id="peakWinEveningHits" class="text-xs mono text-slate-600 dark:text-neutral-400">0 visits (7d)</div>
          </div>

          <div class="p-4 rounded-xl bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark space-y-1">
            <div class="flex items-center justify-between text-xs gap-2">
              <span class="font-semibold text-slate-900 dark:text-white" data-i18n="win_daytime_title">ช่วงกลางวัน &amp; วางแผน (11:00–17:59 น.)</span>
              <span id="peakWinDaytimePct" class="mono font-bold text-slate-900 dark:text-white shrink-0">0.0%</span>
            </div>
            <div id="peakWinDaytimeHits" class="text-xs mono text-slate-600 dark:text-neutral-400">0 visits (7d)</div>
          </div>

          <div class="p-4 rounded-xl bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark space-y-1">
            <div class="flex items-center justify-between text-xs gap-2">
              <span class="font-semibold text-slate-900 dark:text-white" data-i18n="win_morning_title">ช่วงเช้า &amp; สรุปผล (03:00–10:59 น.)</span>
              <span id="peakWinMorningPct" class="mono font-bold text-slate-900 dark:text-white shrink-0">0.0%</span>
            </div>
            <div id="peakWinMorningHits" class="text-xs mono text-slate-600 dark:text-neutral-400">0 visits (7d)</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 09. SYSTEM PERFORMANCE, CLOUD QUOTA & SCALING CAPACITY                    -->
    <!-- ========================================================================= -->
    <section id="sec-system" class="space-y-4 scroll-mt-28" aria-labelledby="sec-system-title">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.activity}</span>
          <h2 id="sec-system-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec9_title">
            09. ประสิทธิภาพระบบ โควตาคลาวด์ และความจุในการขยายสเกล
          </h2>
        </div>
        <span class="text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="sec9_sub">
          ติดตามโควตา Worker (สุ่ม Cache HIT 10%), จำนวนแถว D1 ครบ 4 ตาราง และผลซิงก์ GitHub Actions จริง
        </span>
      </div>

      <!-- 4 Cloud Quota Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 9.1 Cloudflare Worker & Sampled Edge Cache -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-600 dark:text-neutral-400">Cloudflare Workers</span>
              <span class="mono font-semibold text-emerald-700 dark:text-emerald-400">Free 100k/d</span>
            </div>
            <div id="sysWorkerReqs" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">0 <span class="text-xs font-normal text-slate-600 dark:text-neutral-400">/ 100k req/d</span></div>
          </div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="sysWorkerBar" class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
          <div class="text-xs text-slate-600 dark:text-neutral-400 flex justify-between gap-2">
            <span data-i18n="sys_cache_hit_label">Edge Cache Hit (7d):</span>
            <span id="sysWorkerCacheHit" class="mono font-semibold text-emerald-700 dark:text-emerald-400">—</span>
          </div>
        </div>

        <!-- 9.2 Cloudflare D1 SQLite Telemetry (All 4 Tables) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-600 dark:text-neutral-400">Cloudflare D1 Database</span>
              <span id="sysD1Badge" class="mono font-semibold text-emerald-700 dark:text-emerald-400">Connected</span>
            </div>
            <div id="sysD1RowsCount" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">0 <span class="text-xs font-normal text-slate-600 dark:text-neutral-400">rows</span></div>
            <div id="sysD1TablesBreakdown" class="text-xs mono text-slate-600 dark:text-neutral-400 truncate">—</div>
          </div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="sysD1ReadsBar" class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
          <div class="text-xs text-slate-600 dark:text-neutral-400 flex justify-between gap-2">
            <span data-i18n="sys_d1_reads_label">D1 Writes วันนี้:</span>
            <span id="sysD1ReadsPct" class="mono font-semibold text-slate-900 dark:text-white">0% of 100k</span>
          </div>
        </div>

        <!-- 9.3 GitHub Actions Sync Engine -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-600 dark:text-neutral-400">GitHub Actions Cron</span>
              <span class="mono font-semibold text-emerald-700 dark:text-emerald-400" title="Matchdays (Fri–Mon): every 1h · Off-days (Tue–Thu): every 4h">1h / 4h Cron</span>
            </div>
            <div id="sysGhSyncTime" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">— <span class="text-xs font-normal text-slate-600 dark:text-neutral-400">/ build</span></div>
          </div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="sysGhSyncBar" class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
          <div id="sysGhSyncDetail" class="text-xs text-slate-600 dark:text-neutral-400 truncate">
            รอข้อมูล sync_telemetry ล่าสุด
          </div>
        </div>

        <!-- 9.4 FPL Upstream API Health & Scaling Headroom -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-600 dark:text-neutral-400">FPL Upstream Proxy</span>
              <span id="sysUpstreamBadge" class="mono font-semibold text-slate-600 dark:text-neutral-400" data-i18n="sys_upstream_ready">พร้อมเช็ก</span>
            </div>
            <div id="sysUpstreamLatency" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">— <span class="text-xs font-normal font-sans text-slate-500 dark:text-neutral-400" data-i18n="sys_upstream_tap_hint">(กดเช็กด้านล่าง)</span></div>
          </div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="sysUpstreamBar" class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
          <div class="text-xs text-slate-600 dark:text-neutral-400 flex justify-between gap-2">
            <span data-i18n="sys_scale_headroom_label">เพดานขยายสเกล (Headroom):</span>
            <span id="sysScalingHeadroom" class="mono font-semibold text-emerald-700 dark:text-emerald-400">—</span>
          </div>
        </div>
      </div>

      <!-- Operational Command Controls -->
      <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 class="text-base font-semibold text-slate-900 dark:text-white" data-i18n="ops_title">ปุ่มดูแลและเช็กความพร้อมของเว็บ</h3>
            <p class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="ops_sub">กดเฉพาะตอนที่ต้องการตรวจสอบหรือแก้ไขปัญหา ผลลัพธ์จะแสดงใต้ปุ่มทันที (คนเข้าเว็บทั่วไปไม่ได้รับผลกระทบ)</p>
          </div>
          <span class="text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="ops_shortcut_hint">คีย์ลัด: R รีเฟรช · L สลับภาษา · T สลับธีม</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-borderLight dark:divide-borderDark pt-2 border-t border-borderLight dark:border-borderDark">
          <!-- Op 1: Flush Edge Cache -->
          <div class="flex flex-col justify-between gap-3 py-3 sm:py-1 sm:pr-4">
            <div class="space-y-1">
              <div class="text-xs font-semibold text-slate-900 dark:text-white" data-i18n="op_flush_title">รีเฟรชคะแนนสดใหม่ทั้งเว็บ</div>
              <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="op_flush_desc">ใช้เมื่อคะแนนหรือโบนัสบนหน้าเว็บค้างไม่ขยับ ล้างแคช /live, /fixtures, /visitors และ /standings ทันที</p>
            </div>
            <div class="space-y-2">
              <button type="button" id="btnFlushCache" onclick="runEdgeAction('flush-cache')"
                class="min-h-[44px] w-full px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark hover:bg-slate-200/70 dark:hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium text-slate-900 dark:text-white transition-colors"
                data-i18n="op_flush_btn">
                รีเฟรชคะแนนสดทันที
              </button>
              <div id="opResult-flush-cache" role="status" aria-live="polite" class="hidden rounded-lg border p-2.5 text-xs leading-relaxed"></div>
            </div>
          </div>

          <!-- Op 2: Ping Upstream FPL API -->
          <div class="flex flex-col justify-between gap-3 py-3 sm:py-1 sm:px-4">
            <div class="space-y-1">
              <div class="text-xs font-semibold text-slate-900 dark:text-white" data-i18n="op_ping_title">เช็กว่าระบบ FPL ล่มหรือช้าไหม</div>
              <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="op_ping_desc">ใช้ตรวจดูว่าปัญหาคะแนนไม่ขึ้นเกิดจากเว็บพรีเมียร์ลีกต้นทางช้าหรือล่มอยู่หรือไม่</p>
            </div>
            <div class="space-y-2">
              <button type="button" id="btnPingUpstream" onclick="runEdgeAction('ping-upstream')"
                class="min-h-[44px] w-full px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark hover:bg-slate-200/70 dark:hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium text-slate-900 dark:text-white transition-colors"
                data-i18n="op_ping_btn">
                เช็กสถานะเว็บ FPL
              </button>
              <div id="opResult-ping-upstream" role="status" aria-live="polite" class="hidden rounded-lg border p-2.5 text-xs leading-relaxed"></div>
            </div>
          </div>

          <!-- Op 3: Export JSON Snapshot -->
          <div class="flex flex-col justify-between gap-3 py-3 sm:py-1 sm:px-4">
            <div class="space-y-1">
              <div class="text-xs font-semibold text-slate-900 dark:text-white" data-i18n="op_export_title">ดาวน์โหลดไฟล์สถิติเก็บไว้</div>
              <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="op_export_desc">เก็บข้อมูลยอดคนดูและรายละเอียดมินิลีกทั้งหมดในระบบลงเครื่องไว้ดูย้อนหลังหรือสรุปรายงาน</p>
            </div>
            <div class="space-y-2">
              <button type="button" id="btnExportJson" onclick="exportDashboardJson()"
                class="min-h-[44px] w-full px-3 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark hover:bg-slate-200/70 dark:hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium text-slate-900 dark:text-white transition-colors"
                data-i18n="op_export_btn">
                ดาวน์โหลดไฟล์สถิติ
              </button>
              <div id="opResult-export-json" role="status" aria-live="polite" class="hidden rounded-lg border p-2.5 text-xs leading-relaxed"></div>
            </div>
          </div>

          <!-- Op 4: Prune D1 Telemetry (>30d) -->
          <div class="flex flex-col justify-between gap-3 py-3 sm:py-1 sm:pl-4">
            <div class="space-y-1">
              <div class="text-xs font-semibold text-slate-900 dark:text-white" data-i18n="op_prune_title">ลบประวัติคนดูเก่าที่เกิน 30 วัน</div>
              <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="op_prune_desc">ช่วยเคลียร์บันทึกเก่าที่ไม่ใช้แล้วให้ระบบลื่นและประหยัดพื้นที่ (ยอดคนดูสะสมตลอดกาลยังอยู่ครบ)</p>
            </div>
            <div class="space-y-2">
              <button type="button" id="btnPruneD1" onclick="runEdgeAction('prune-telemetry')"
                class="min-h-[44px] w-full px-3 py-2 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed text-xs font-medium text-rose-700 dark:text-rose-300 transition-colors"
                data-i18n="op_prune_btn">
                ลบประวัติเก่าเกิน 30 วัน
              </button>
              <div id="opResult-prune-telemetry" role="status" aria-live="polite" class="hidden rounded-lg border p-2.5 text-xs leading-relaxed"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 10. PROJECT HEALTH, SYNC FRESHNESS & ERROR MONITOR (24H / 7D)             -->
    <!-- ========================================================================= -->
    <section id="sec-monitor" aria-labelledby="sec10-heading" class="space-y-4 scroll-mt-28">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-borderLight dark:border-borderDark pb-3">
        <div>
          <h2 id="sec10-heading" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec10_title">
            10. ตรวจสุขภาพระบบ ความสดใหม่การซิงก์ และ Error ย้อนหลัง (Monitor)
          </h2>
          <p class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="sec10_sub">
            เช็กย้อนหลัง 1 วัน (รายชั่วโมง) และ 1 สัปดาห์ (รายวัน) พร้อมตรวจจับความสดใหม่ของการซิงก์ GitHub Actions
          </p>
        </div>
        <div id="monitorOverallBadge" class="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-300 shrink-0 whitespace-nowrap">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span id="monitorOverallBadgeText" data-i18n="mon_status_healthy">ทำงานปกติ 100%</span>
        </div>
      </div>

      <!-- Sync Freshness Banner -->
      <div id="monitorSyncHealthBanner" role="status" class="p-3.5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-xs mono text-slate-700 dark:text-neutral-300 flex flex-wrap items-center justify-between gap-2">
        <span>กำลังตรวจสอบความสดใหม่ของตารางซิงก์อัตโนมัติ (GitHub Actions)…</span>
      </div>

      <!-- 4 Health Summary KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-1.5">
          <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="mon_kpi_24h_label">ความพร้อมใช้งาน 1 วัน (24 ชม.)</div>
          <div id="mon24hUptime" class="text-2xl font-semibold mono tabular text-emerald-700 dark:text-emerald-400">100.0%</div>
          <div id="mon24hSub" class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">0 Error จากกิจกรรมทั้งหมด</div>
        </div>

        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-1.5">
          <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="mon_kpi_7d_label">ความพร้อมใช้งาน 1 สัปดาห์ (7 วัน)</div>
          <div id="mon7dUptime" class="text-2xl font-semibold mono tabular text-emerald-700 dark:text-emerald-400">100.0%</div>
          <div id="mon7dSub" class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed">0 Error ตลอด 7 วันที่ผ่านมา</div>
        </div>

        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-1.5">
          <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="mon_kpi_client_label">ปัญหาฝั่งผู้ใช้งาน (หน้าเว็บ/ชำระเงิน)</div>
          <div id="monClientErrTotal" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">0</div>
          <div id="monClientErrSub" class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="mon_kpi_client_sub">หน้าเว็บค้าง โหลดข้อมูลไม่ขึ้น หรือ JS Error</div>
        </div>

        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-1.5">
          <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="mon_kpi_upstream_label">ปัญหาเว็บ FPL ต้นทาง (5xx/Fixtures)</div>
          <div id="monUpstreamErrTotal" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">0</div>
          <div id="monUpstreamErrSub" class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="mon_kpi_upstream_sub">เว็บพรีเมียร์ลีกต้นทางตอบช้าหรือล่มชั่วคราว</div>
        </div>
      </div>

      <!-- Interactive Chart & Anomaly Timeline -->
      <div class="p-5 sm:p-6 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 id="monitorChartTitle" class="text-sm font-semibold text-slate-900 dark:text-white" data-i18n="mon_chart_title_24h">
              บันทึกการทำงานย้อนหลัง 24 ชั่วโมงล่าสุด (เวลาไทย · ICT)
            </h3>
            <p id="monitorChartSub" class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="mon_chart_sub_24h">
              เปรียบเทียบช่วงเวลาที่ระบบทำงานปกติ กับช่วงเวลาที่ตรวจพบ Error
            </p>
          </div>
          <div class="flex items-center gap-2 shrink-0" role="group" aria-label="Monitor time range">
            <button type="button" id="btnMon24h" onclick="switchMonitorMode('24h')"
              class="min-h-[44px] px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs font-medium text-emerald-800 dark:text-emerald-300 whitespace-nowrap shrink-0 transition-colors"
              data-i18n="mon_btn_24h">
              1 วัน (24 ชม.)
            </button>
            <button type="button" id="btnMon7d" onclick="switchMonitorMode('7d')"
              class="min-h-[44px] px-4 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0 transition-colors"
              data-i18n="mon_btn_7d">
              1 สัปดาห์ (7 วัน)
            </button>
          </div>
        </div>

        <div class="w-full space-y-1.5">
          <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-neutral-400">
            <span id="monitorYAxisUnit" class="font-medium">แกนตั้ง (Y): จำนวนเหตุการณ์ใช้งานจริง &amp; Error (ครั้ง/ชม.)</span>
            <span id="monitorXAxisUnit" class="mono">แกนนอน (X): ช่วงเวลา 24 ชม. ล่าสุด (เวลาไทย · น.)</span>
          </div>
          <svg id="monitorSvgChart" viewBox="0 0 680 220" class="w-full h-52 sm:h-60 overflow-visible" role="img" aria-label="Project Health and Error Log Chart"></svg>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-neutral-400 pt-2 border-t border-borderLight dark:border-borderDark">
          <div class="flex flex-wrap items-center gap-4">
            <span class="inline-flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-emerald-500 inline-block"></span>
              <span data-i18n="mon_legend_ok">ใช้งานปกติ (จำนวนครั้ง)</span>
            </span>
            <span class="inline-flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-sm bg-rose-500 inline-block"></span>
              <span data-i18n="mon_legend_err">ช่วงเวลาที่พบ Error</span>
            </span>
          </div>
          <span id="monitorWindowCallout" class="mono text-emerald-700 dark:text-emerald-400 font-medium">ไม่มีช่วงเวลาผิดปกติ</span>
        </div>

        <!-- Anomaly Windows & Error Breakdown Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-2 border-t border-borderLight dark:border-borderDark">
          <div class="lg:col-span-7 space-y-2">
            <div class="text-xs font-semibold text-slate-900 dark:text-white" data-i18n="mon_anomaly_title">
              ประวัติช่วงเวลาที่ทำงานผิดปกติ (Anomaly Timeline)
            </div>
            <div id="monitorAnomalyList" class="space-y-2 text-xs"></div>
          </div>
          <div class="lg:col-span-5 space-y-2">
            <div class="text-xs font-semibold text-slate-900 dark:text-white" data-i18n="mon_cat_title">
              สรุปประเภท Error สะสม 7 วันล่าสุด
            </div>
            <div id="monitorCategoryBreakdown" class="space-y-2 text-xs"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 11. LIVE DEMO PITCH & COMMERCIAL PLAYBOOK (COLLAPSED BY DEFAULT)          -->
    <!-- ========================================================================= -->
    <section id="sec-pitch" class="space-y-4 scroll-mt-28" aria-labelledby="sec-pitch-title">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-emerald-600 dark:text-emerald-400">${ICONS.trendUp}</span>
          <div>
            <h2 id="sec-pitch-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec11_title">
              11. คู่มือ Live Pitch และสไลด์นำเสนอลูกค้า (ตัวเลขสด 100%)
            </h2>
            <p class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="sec11_sub">
              พับเก็บเป็นค่าเริ่มต้น กดปุ่มเปิดเมื่อเตรียมแชร์หน้าจอพรีเซนต์ลูกค้า — กราฟและแพ็กเกจซิงก์กับระบบจริง
            </p>
          </div>
        </div>
        <button type="button" id="btnTogglePitchBody" aria-expanded="false" aria-controls="secPitchBody"
          class="min-h-[44px] px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-800 dark:text-emerald-300 whitespace-nowrap shrink-0 transition-colors self-start sm:self-auto"
          data-i18n="btn_expand_pitch">
          เปิดคู่มือ Live Pitch ↓
        </button>
      </div>

      <div id="secPitchBody" class="space-y-6 hidden">
        <!-- Row 1: Graphic 2 (Live SVG Engagement Bar) + Graphic 3 (5 Prize Models) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <!-- Graphic 2: Real D1 Segment Engagement Chart -->
          <div class="lg:col-span-6 p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-semibold text-slate-900 dark:text-white" data-i18n="pitch_g2_title">
                  กราฟเปรียบเทียบการมีส่วนร่วมจริงต่อทีม (Visits / Team · 7 วัน)
                </h3>
                <p class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="pitch_g2_sub">คำนวณจากยอดเข้าชม D1 จริง ไม่มีค่าสมมติ</p>
              </div>
              <span id="g2Badge" class="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs mono font-semibold text-emerald-800 dark:text-emerald-300">Live D1</span>
            </div>

            <svg viewBox="0 0 460 155" class="w-full h-40 overflow-visible" role="img" aria-label="Segment engagement comparison chart">
              <text x="4" y="28" class="fill-slate-600 dark:fill-neutral-400 text-[11px]" font-family="sans-serif">ฟรีลีก / ทั่วไป</text>
              <rect x="115" y="14" width="230" height="20" rx="5" class="fill-slate-200 dark:fill-neutral-800"></rect>
              <rect id="g2Bar1" x="115" y="14" width="0" height="20" rx="5" class="fill-slate-500 dark:fill-neutral-500 transition-all duration-300"></rect>
              <text id="g2Val1" x="355" y="28" class="fill-slate-800 dark:fill-neutral-200 text-[11px] font-semibold" font-family="monospace">—</text>

              <text x="4" y="70" class="fill-slate-800 dark:fill-neutral-200 text-[11px] font-medium" font-family="sans-serif">ลีกเงินรางวัล (เฉลี่ย)</text>
              <rect x="115" y="56" width="230" height="20" rx="5" class="fill-slate-200 dark:fill-neutral-800"></rect>
              <rect id="g2Bar2" x="115" y="56" width="0" height="20" rx="5" class="fill-emerald-500 transition-all duration-300"></rect>
              <text id="g2Val2" x="355" y="70" class="fill-emerald-700 dark:fill-emerald-400 text-[11px] font-semibold" font-family="monospace">—</text>

              <text x="4" y="112" class="fill-slate-800 dark:fill-neutral-200 text-[11px] font-medium" font-family="sans-serif">Top Prize League</text>
              <rect x="115" y="98" width="230" height="20" rx="5" class="fill-slate-200 dark:fill-neutral-800"></rect>
              <rect id="g2Bar3" x="115" y="98" width="0" height="20" rx="5" class="fill-emerald-400 transition-all duration-300"></rect>
              <text id="g2Val3" x="355" y="112" class="fill-emerald-700 dark:fill-emerald-300 text-[11px] font-semibold" font-family="monospace">—</text>

              <text id="g2Mult" x="4" y="146" class="fill-slate-600 dark:fill-neutral-400 text-[11px]" font-family="monospace">รอเปรียบเทียบจากทราฟฟิกจริง…</text>
            </svg>
          </div>

          <!-- Graphic 3: 5 Supported Prize & League Models -->
          <div class="lg:col-span-6 p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-4">
            <div class="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-semibold text-slate-900 dark:text-white" data-i18n="pitch_g3_title">5 รูปแบบกติกาลีกที่ระบบคำนวณให้อัตโนมัติ</h3>
                <p class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="pitch_g3_sub">ครอบคลุมทั้งลีกเงินรางวัลเต็มรูปแบบและลีกคอมมูนิตี้ขนาดใหญ่</p>
              </div>
              <span id="pitchGmvBadge" class="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs mono font-semibold text-emerald-800 dark:text-emerald-300">GMV ฿0</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div class="p-3 rounded-lg bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark">
                <div class="font-semibold text-slate-900 dark:text-white">1. Weekly Top-Score</div>
                <div class="text-slate-600 dark:text-neutral-400">แชมป์วีค (THB/USD) + สรุปยอดรับสุทธิ</div>
              </div>
              <div class="p-3 rounded-lg bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark">
                <div class="font-semibold text-slate-900 dark:text-white">2. Weekly + Bottom Penalties</div>
                <div class="text-slate-600 dark:text-neutral-400">หักค่าปรับ N อันดับบ๊วยอัตโนมัติ (เช่น 40700)</div>
              </div>
              <div class="p-3 rounded-lg bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark">
                <div class="font-semibold text-slate-900 dark:text-white">3. Monthly Top-Score</div>
                <div class="text-slate-600 dark:text-neutral-400">แชมป์ &amp; รองแชมป์ประจำเดือน (เช่น 38491)</div>
              </div>
              <div class="p-3 rounded-lg bg-raisedLight dark:bg-raisedDark border border-borderLight dark:border-borderDark">
                <div class="font-semibold text-slate-900 dark:text-white">4. Season Top &amp; Cup Only</div>
                <div class="text-slate-600 dark:text-neutral-400">แชมป์ฤดูกาล + ถ้วยน็อคเอาท์ (THB/USD)</div>
              </div>
              <div class="sm:col-span-2 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between gap-2">
                <div>
                  <div class="font-semibold text-emerald-900 dark:text-emerald-200">5. Community / Large League (Tier 2 Quote)</div>
                  <div class="text-slate-700 dark:text-neutral-300">Auto-Picks Live รองรับ 31–3,000 ทีม (เช่น 139836)</div>
                </div>
                <span id="pitchTier2Badge" class="px-2 py-0.5 rounded bg-emerald-700 text-white text-xs mono shrink-0">Live</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Graphic 4: Verified Product Matrix & Tier Pricing -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-white" data-i18n="pitch_g4_title">แพ็กเกจและฟีเจอร์เด่นที่เปิดใช้งานจริงบนระบบ</h3>
            <span id="graphic4Callout" class="text-xs mono text-emerald-700 dark:text-emerald-400">Standard ฿500/$19 · Tier 2 Quote · Custom Roadmap ฿900/$29</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div class="p-4 rounded-xl border border-emerald-500/35 bg-emerald-500/5 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 dark:text-white">Standard (≤30 ทีม · Tier 1)</span>
                <span class="mono font-bold text-emerald-700 dark:text-emerald-400">฿500 / $19</span>
              </div>
              <p class="text-slate-600 dark:text-neutral-400">ตารางคะแนนสด + BPS, บัญชีเงินรางวัล &amp; ค่าปรับ, Transfer Advisor v2, Provisional Auto-Subs, Global Radar, บอลถ้วย</p>
            </div>
            <div class="p-4 rounded-xl border border-sky-500/35 bg-sky-500/5 space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 dark:text-white">Large League (31–3,000 ทีม · Tier 2)</span>
                <span class="mono font-bold text-sky-700 dark:text-sky-400">Quote</span>
              </div>
              <p class="text-slate-600 dark:text-neutral-400">Auto-Picks Live Edge Proxy โหลดเร็วระดับมิลลิวินาที แยก JSON รายทีม ลดภาระโหลดไฟล์ขนาดใหญ่</p>
            </div>
            <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="font-bold text-slate-900 dark:text-white">Custom H2H / Predict (Roadmap)</span>
                <span class="mono font-semibold text-amber-700 dark:text-amber-300">฿900 / $29</span>
              </div>
              <p class="text-slate-600 dark:text-neutral-400">กำลังพัฒนาเพิ่มเติมใน Roadmap (ตาราง H2H / ทายผลเฉพาะกิจ) ปิดการสั่งซื้ออัตโนมัติชั่วคราว</p>
            </div>
          </div>

          <!-- Step 3: Live Demo Jump Links -->
          <div class="pt-3 border-t border-borderLight dark:border-borderDark space-y-2">
            <div class="text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="pitch_demo_links_title">
              ทางลัดเปิดหน้าเดโมจริงระหว่างพรีเซนต์ลูกค้า:
            </div>
            <div class="flex flex-wrap gap-2 text-xs mono">
              <a href="https://www.fplsawadika.com/40700/?tab=transfer-advisor" target="_blank" rel="noopener noreferrer" class="min-h-[40px] px-3 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20 inline-flex items-center gap-1.5">Transfer Advisor (40700) ↗</a>
              <a href="https://www.fplsawadika.com/40700/" target="_blank" rel="noopener noreferrer" class="min-h-[40px] px-3 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-slate-800 dark:text-neutral-200 hover:border-emerald-500 inline-flex items-center gap-1.5">40700 · Weekly + Penalties ↗</a>
              <a href="https://www.fplsawadika.com/675290/" target="_blank" rel="noopener noreferrer" class="min-h-[40px] px-3 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-slate-800 dark:text-neutral-200 hover:border-emerald-500 inline-flex items-center gap-1.5">675290 · Weekly + Shi'62 ↗</a>
              <a href="https://www.fplsawadika.com/38491/" target="_blank" rel="noopener noreferrer" class="min-h-[40px] px-3 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-slate-800 dark:text-neutral-200 hover:border-emerald-500 inline-flex items-center gap-1.5">38491 · Monthly Split ↗</a>
              <a href="https://www.fplsawadika.com/1101958/" target="_blank" rel="noopener noreferrer" class="min-h-[40px] px-3 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-slate-800 dark:text-neutral-200 hover:border-emerald-500 inline-flex items-center gap-1.5">1101958 · USD Currency ↗</a>
              <a href="https://www.fplsawadika.com/139836/" target="_blank" rel="noopener noreferrer" class="min-h-[40px] px-3 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-slate-800 dark:text-neutral-200 hover:border-emerald-500 inline-flex items-center gap-1.5">139836 · Tier 2 (1,779 Teams) ↗</a>
              <a href="https://www.fplsawadika.com/preview.html" target="_blank" rel="noopener noreferrer" class="min-h-[40px] px-3 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-slate-800 dark:text-neutral-200 hover:border-emerald-500 inline-flex items-center gap-1.5">Showcase Preview Hub ↗</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="border-t border-borderLight dark:border-borderDark py-8 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-neutral-400">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span class="mono font-medium text-slate-800 dark:text-neutral-200">FPL SaWaDiKa Executive BI</span>
        <span>·</span>
        <span id="footerLeagueSummary" data-i18n="footer_rights">ศูนย์วิเคราะห์ข้อมูลธุรกิจและโครงสร้างพื้นฐานครบวงจร (Live Config)</span>
      </div>
      <div class="mono">
        <span>Cloudflare Workers + D1 Edge Telemetry</span>
      </div>
    </div>
  </footer>

  <script>
    // =========================================================================
    // 1. BILINGUAL I18N DICTIONARY (100% TH / EN PARITY)
    // =========================================================================
    const I18N = {
      th: {
        skip_to_content: 'ข้ามไปยังเนื้อหาหลัก',
        nav_console_badge: 'ศูนย์วิเคราะห์ข้อมูลธุรกิจ',
        nav_jump_league_label: 'ทางลัดเปิดหน้าขาย เดโม และมินิลีก',
        nav_jump_placeholder: 'ทางลัดเปิดหน้าเว็บ (ลีก & หน้าขาย)...',
        nav_jump_landing: '🛒 หน้าขายสินค้า (Landing Page)',
        nav_jump_preview: '🎮 หน้าเดโมรวมลีก (preview.html)',
        mod_nav_1: '01. ภาพรวม KPI',
        mod_nav_2: '02. พอร์ตโฟลิโอลีก',
        mod_nav_3: '03. ออเดอร์ & ตรวจสลิป',
        mod_nav_4: '04. เพิ่มลีกลูกค้าใหม่',
        mod_nav_5: '05. พฤติกรรมฟีเจอร์',
        mod_nav_6: '06. เบราว์เซอร์ & ภาษา',
        mod_nav_7: '07. อุปกรณ์',
        mod_nav_8: '08. ช่วงเวลาพีค',
        mod_nav_9: '09. ระบบ & โควตา',
        mod_nav_10: '10. Monitor',
        mod_nav_11: '11. Pitch Deck',
        sign_out: 'ออกจากระบบ',
        page_title: 'สรุปภาพรวมผู้บริหารและข้อมูลวิเคราะห์ธุรกิจสด',
        page_subtitle: 'ศูนย์ควบคุมข้อมูลระบบ พฤติกรรมผู้ใช้งาน เศรษฐศาสตร์เงินรางวัล และการประเมินความจุคลาวด์จากข้อมูลสด 100%',
        btn_copy_exec: 'คัดลอกสรุปผู้บริหาร',
        btn_copied_exec: 'คัดลอกสรุปลงคลิปบอร์ดแล้ว!',
        btn_live_pitch_refresh: '⚡ Live Refresh',
        telem_live_active: 'ระบบตรวจวัดข้อมูลสดทำงานปกติ',
        telem_auto_sync: '(ซิงก์ 1 ชม. ศ.–จ. / 4 ชม. อ.–พฤ.)',
        telem_last_sync_label: 'ซิงก์ข้อมูลล่าสุด: ',
        telem_runner_label: 'ตัวประมวลผล: ',
        telem_countdown_sub: 'นับถอยหลังปิดตลาดย้ายตัว',
        toast_refreshed: 'อัปเดตข้อมูลสถานะล่าสุดจากเซิร์ฟเวอร์เรียบร้อยแล้ว',
        badge_live_sync: 'Live Sync',
        badge_live_d1: 'Live D1',
        sec1_title: '01. ภาพรวมทราฟฟิกและตัวชี้วัดผู้ใช้งานสด',
        sec1_sub: 'ตัวเลขจริง 100% จากการซิงก์ลีกและฐานข้อมูล Cloudflare D1 (ไม่เก็บ Cookie · ไม่มีเลขสมมติ)',
        kpi_managers_label: 'ผู้จัดการทีมที่ติดตาม',
        kpi_managers_sub: 'กำลังโหลดจำนวนทีมจากระบบ...',
        kpi_mau_label: 'ยอดเข้าชมสูงสุดรายวัน (7 วัน)',
        kpi_mau_sub: 'จำนวนเข้าชมลีกสูงสุดใน 1 วัน (รอบ 7 วัน)',
        kpi_offpeak_label: 'ยอดเข้าชมเฉลี่ยวันธรรมดา (อ.–พฤ.)',
        kpi_offpeak_sub: 'ค่าเฉลี่ยจริงช่วงอังคาร–พฤหัส (วางแผนซื้อขาย)',
        kpi_stickiness_label: 'สัดส่วนวันแข่ง (ศ.–จ.) vs วันธรรมดา',
        kpi_stickiness_sub: 'เปรียบเทียบยอดเข้าชม 7 วันจริงระหว่างวันแข่งกับกลางสัปดาห์',
        kpi_retention_label: 'ยอดเข้าชมสะสมตลอดกาล (Lifetime)',
        kpi_retention_sub: 'นับจริงแบบลดซ้ำ 30 นาที (ตั้งแต่ พ.ย. 2026)',
        kpi_screentime_label: 'เวลาใช้งานเฉลี่ยต่อครั้ง',
        kpi_screentime_sub: 'วัดจริงจาก Dwell Time Beacon (รอบ 7 วัน)',
        sec2_title: '02. พอร์ตโฟลิโอมินิลีกและเศรษฐศาสตร์เงินรางวัลรวม',
        sec2_sub: 'คลิกหัวตารางเพื่อเรียงลำดับ · คอลัมน์ชื่อลีกตรึงอยู่กับที่เมื่อเลื่อนแนวนอนบนมือถือ',
        port_gmv_label: 'มูลค่าเงินรางวัลรวมทั้งระบบ (GMV)',
        port_gmv_sub: 'รวมเงินรางวัลประจำฤดูกาล + รางวัลรายสัปดาห์/เดือน',
        port_custom_label: 'ลีกที่ผูกกติกาพิเศษ (Custom Rules)',
        port_custom_sub: 'สร้าง Switching Cost สูงกว่าเว็บ FPL ทั่วไป',
        port_landing_label: 'ยอดเข้าชมหน้าขาย (Landing Page · 7 วัน)',
        port_landing_sub: 'แยกจากยอดเปิดดูมินิลีก (วัดคนสนใจซื้อระบบ)',
        port_whitelabel_label: 'ความจุที่รองรับเพิ่ม (Tier 1 Headroom)',
        port_whitelabel_sub: 'คำนวณตรงกับเพดาน 30 ลีก / 500 ทีม Tier 1 (ต้นทุนเพิ่ม ฿0)',
        pf_filter_all: 'ทั้งหมด',
        pf_filter_private: 'ลูกค้าส่วนตัว (Private)',
        pf_filter_expiring: 'ทดลองใช้ / ใกล้หมดอายุ',
        pf_filter_paused: 'พักระบบ (Paused)',
        pf_filter_showcase: 'ลีกตัวอย่าง (Showcase)',
        col_league_name: 'ชื่อมินิลีก & รหัส',
        col_teams: 'จำนวนทีม',
        col_pool: 'เงินรางวัลรวม (GMV)',
        col_modules: 'โมดูลและกติกาที่เปิดใช้งาน',
        col_views: 'ยอดเปิดดู (7 วันล่าสุด)',
        col_engagement: 'เวลาดูเฉลี่ย / ต่อทีม',
        col_lifecycle: 'สถานะ & หมดอายุ',
        col_actions: 'จัดการสิทธิ์',
        sec3_title: '03. กล่องรับคำสั่งซื้อ & ตรวจสลิป',
        sec3_sub: 'ตั้งค่ารูป QR รับเงิน ตรวจสอบยอดโอนตามเศษสตางค์ ดูรูปสลิป ส่งข้อมูลเข้าเครื่องมือเปิดลีกด้านล่าง และแจ้งเปิดใช้งานทางอีเมลในคลิกเดียว',
        ord_btn_refresh: 'รีเฟรชรายการออเดอร์',
        pay_qr_title: 'ตั้งค่า QR รับเงินส่วนตัว (ไม่ต้องใช้เบอร์โทร / บัตร ปชช. / e-Wallet)',
        btn_toggle_qr_hide: 'ซ่อนตั้งค่า QR',
        btn_toggle_qr_show: 'แก้ไข / แสดงตั้งค่า QR',
        pay_qr_acct_lbl: 'ชื่อ-นามสกุลผู้รับเงิน (แสดงให้ลูกค้าตรวจเช็กก่อนโอน)',
        pay_qr_file_lbl: 'อัปโหลดรูปภาพ QR Code รับเงิน',
        pay_qr_file_hint: 'รองรับไฟล์ PNG / JPG / WebP (ย่อขนาดอัตโนมัติในเบราว์เซอร์) เก็บเป็นความลับในฐานข้อมูล D1 เท่านั้น ไม่บันทึกลง GitHub',
        pay_qr_btn_save: 'บันทึกการตั้งค่า QR',
        pay_qr_btn_clear: 'ลบรูป QR ออกจากฐานข้อมูล',
        pay_qr_preview_lbl: 'ตัวอย่างรูป QR ที่แสดงให้ลูกค้า',
        pay_qr_preview_empty: 'ยังไม่ได้อัปโหลดรูป QR ส่วนตัว',
        ord_stat_total_lbl: 'คำสั่งซื้อสะสมทั้งหมด',
        ord_stat_paid_lbl: 'โอนแล้ว / เปิดลีกสำเร็จ',
        ord_stat_active_lbl: 'คิวรอดำเนินการปัจจุบัน',
        ord_stat_expired_lbl: 'ไม่โอนเกิน 24 ชม. / ยกเลิกสะสม',
        ord_f_all: 'ทั้งหมด',
        ord_f_slip: 'รอตรวจสลิป',
        ord_f_await: 'รอโอน QR',
        ord_f_paid: 'ตรวจยอดแล้ว',
        ord_f_quote: 'ขอราคา / USD',
        ord_f_live: 'เปิดลีกแล้ว',
        ord_f_rejected: 'ปฏิเสธ',
        ord_col_id: 'รหัสออเดอร์',
        ord_col_league: 'ลีก FPL',
        ord_col_amount: 'ยอดชำระ',
        ord_col_contact: 'ช่องทางติดต่อ',
        ord_col_status: 'สถานะ',
        ord_col_created: 'เวลาสั่งซื้อ',
        ord_col_action: 'ตรวจสอบ',
        ord_det_amount_lbl: 'ยอดโอนที่ต้องตรงกัน',
        ord_det_rules_lbl: 'กติกาและรายละเอียดที่ลูกค้ากรอก',
        ord_det_open_pay: 'เปิดหน้าออเดอร์ลูกค้า (/pay/) ↗',
        ord_det_copy_pay: 'คัดลอกลิงก์ออเดอร์',
        ord_det_copy_line: 'คัดลอกข้อความแจ้งสถานะ (ส่ง LINE)',
        ord_det_email_cust: 'เปิดร่างอีเมลตอบลูกค้า ↗',
        ord_lbl_note: 'บันทึกแอดมิน / เหตุผลกรณีปฏิเสธสลิป',
        ord_lbl_url: 'ลิงก์ลีกที่จะส่งมอบ (Delivered URL)',
        ord_act_verify: '✓ ยืนยันรับยอดโอน (Paid)',
        ord_act_prefill: 'Prefill Onboarding ↓',
        ord_act_live: 'เปิดลีกแล้ว & ส่งอีเมล (Mark Live)',
        ord_act_reject: 'ปฏิเสธสลิป + ส่งอีเมล',
        ord_act_delslip: 'ลบรูปสลิป',
        ord_act_del_unpaid: 'ลบออเดอร์ไม่โอน (+นับสถิติ)',
        ord_act_del_test: 'ลบออเดอร์ทดสอบ (ไม่นับสถิติ)',
        ord_slip_heading: 'รูปสลิปโอนเงินที่ลูกค้าแนบ',
        ord_btn_reload_slip: 'โหลดรูปสลิปอีกครั้ง',
        sec4_title: '04. เครื่องมือเปิดลีกลูกค้าใหม่ (Concierge Onboarding Wizard)',
        sec4_sub: 'ตรวจสอบ FPL Classic League ID สดจากเซิร์ฟเวอร์พรีเมียร์ลีก เลือกทีมที่ไม่ร่วมชิงรางวัล ตั้งค่าแพ็กเกจ และสร้างสคริปต์เปิดใช้งานทันที',
        onb_lbl_id: 'FPL Classic League ID (ตัวเลขเท่านั้น)',
        onb_btn_inspect: 'ดึงข้อมูลลีกสด',
        onb_lbl_plan: 'แพ็กเกจ (Plan)',
        onb_lbl_prize: 'รูปแบบรางวัล',
        onb_lbl_weekly: 'รางวัล/สัปดาห์ (บาท)',
        onb_lbl_status: 'สถานะสิทธิ์ (Status)',
        onb_lbl_tier: 'ระดับสถาปัตยกรรม (Tier)',
        onb_lbl_currency: 'สกุลเงินรางวัล (Currency)',
        onb_lbl_entry_fee: 'ค่าสมัคร/ทีม (ไม่บังคับ)',
        onb_lbl_total_pool: 'เงินกองกลางรวม (ไม่บังคับ)',
        onb_lbl_season_prizes: 'รางวัลแชมป์ฤดูกาล (ไม่บังคับ)',
        onb_lbl_cup_prize: 'รางวัลบอลถ้วย (แชมป์ หรือ แชมป์/รอง)',
        onb_lbl_penalty_tiers: 'ขั้นค่าปรับบ๊วย N อันดับท้าย (คั่นด้วยจุลภาค จากบ๊วยสุดไปอันดับถัดขึ้นไป)',
        onb_penalty_hint: 'รองรับกี่อันดับก็ได้ (เช่น 3 อันดับท้าย = 300,200,100) ระบบจะปรับหัวตารางและการ์ดสรุปอัตโนมัติ',
        onb_lbl_monthly_champ: 'รางวัลแชมป์ประจำเดือน (ต่อเดือน)',
        onb_lbl_monthly_runner: 'รางวัลรองแชมป์ประจำเดือน (ใส่ 0 หากมีเฉพาะแชมป์)',
        onb_lbl_tenant: 'Tenant Group (แยกการมองเห็น)',
        onb_lbl_visibility: 'การมองเห็น & SEO',
        onb_lbl_short: 'ชื่อย่อหน้าลีก (Short Name)',
        onb_lbl_expires: 'วันหมดอายุ (Expires At)',
        onb_lbl_nocup: 'ปิดแท็บบอลถ้วย (--no-cup สำหรับลีกที่ไม่ได้เตะบอลถ้วย)',
        onb_d1_note_tip: '🔒 โน้ตข้อมูลลูกค้าส่วนตัว (ชื่อ LINE / วันโอนเงิน) ให้บันทึกในตารางข้อ 02 ด้านบน (เก็บใน Cloudflare D1 ปลอดภัย 100% ไม่ถูก commit ลง Git)',
        onb_teams_hint: 'ติ๊กเลือกทีมที่ไม่ร่วมชิงรางวัล (non_prize_teams) หากมี:',
        onb_out_cli: '1. คำสั่ง CLI (รันบนเครื่องเพื่อเปิดลีก)',
        onb_out_json: '2. Config JSON (leagues_config.json)',
        onb_out_line: '3. ข้อความส่งมอบลูกค้าทาง LINE',
        sec5_title: '05. พฤติกรรมการใช้งานฟีเจอร์และคุณค่าผลิตภัณฑ์ (สด 7 วัน)',
        sec5_sub: 'รวมทุกแท็บจริงบนเว็บ รวมถึง Transfer Advisor · คำนวณ 100% จาก D1 Beacon',
        feat_share_title: 'สัดส่วนการคลิกใช้งานแต่ละโมดูลจริง (รอบ 7 วัน)',
        feat_seg_title: 'การมีส่วนร่วม: ลีกเงินรางวัล vs ลีกทั่วไป',
        feat_seg_desc: 'เปรียบเทียบอัตราการเปิดดูต่อทีม (Visits / Team · 7 วัน) จากยอดเข้าชมจริงใน D1 แยกตามลีกที่ตั้งเงินรางวัลและลีกคอมมูนิตี้',
        seg_prize_lbl: 'ลีกเงินรางวัล (Prize Leagues)',
        seg_comm_lbl: 'ลีกทั่วไป / ฟรีลีก (Community)',
        sec6_title: '06. ช่องทางเข้าใช้งาน (Browser), ภูมิภาค และภาษา (TH / EN)',
        sec6_sub: 'จำแนก LINE In-App Browser, Safari, Chrome · พื้นที่จริงจาก Edge · สัดส่วน TH vs EN',
        dist_src_title: 'เบราว์เซอร์และแอปที่ผู้ใช้เปิดลิงก์ (7 วัน)',
        dist_geo_title: 'พื้นที่เชื่อมต่อและสัดส่วนภาษาที่ใช้งานจริง',
        geo_bkk_lbl: 'กทม. & ปริมณฑล',
        geo_reg_lbl: 'ต่างจังหวัด',
        geo_intl_lbl: 'ต่างประเทศ',
        dist_locale_lbl: 'ภาษาหน้าเว็บที่ผู้ใช้เลือก (TH vs EN)',
        sec7_title: '07. สัดส่วนอุปกรณ์ผู้ใช้งานจริง (รองรับ iPadOS แท็บเล็ต)',
        sec7_sub: 'ตรวจจับหน้าจอ + Touch เพื่อแยก iPad ออกจาก Desktop ไม่รวมปนกัน',
        dev_btn_7d: '7 วันล่าสุด',
        dev_btn_30d: '30 วันล่าสุด',
        dev_mobile_label: 'สมาร์ตโฟน (Mobile Phones)',
        dev_desktop_label: 'คอมพิวเตอร์ตั้งโต๊ะ / โน้ตบุ๊ก (Desktop)',
        dev_tablet_label: 'ไอแพดและแท็บเล็ต (iPadOS / Tablet)',
        dev_mobile_desc: 'iOS / Android < 768px',
        dev_desktop_desc: 'macOS / Windows Non-Touch',
        dev_tablet_desc: 'iPadOS Touch & Tablets',
        sec8_title: '08. ช่วงเวลาใช้งานพีคและพฤติกรรมวันแข่งขัน (ICT · 7 วันล่าสุด)',
        sec8_sub: 'กราฟจากเวลาเข้าชมจริงใน Cloudflare D1 (ไม่มีเส้นจำลอง)',
        chart_title_hourly: 'กราฟความหนาแน่นทราฟฟิกรายชั่วโมง (24 ชั่วโมง · ICT)',
        chart_sub_hourly: 'รวมยอดเข้าชมจริง 7 วันย้อนหลังตามชั่วโมง (00:00–23:59 ICT)',
        chart_title_daily: 'กราฟจำนวนการเข้าใช้งานย้อนหลัง 7 วัน (Daily Visits)',
        chart_sub_daily: 'เปรียบเทียบยอดเข้าชมรายวันจริงตลอด 7 วันที่ผ่านมา (เวลาไทย ICT)',
        chart_btn_24h: 'รายชั่วโมง (24 ชม.)',
        chart_btn_7d: 'รายวัน (7 วัน)',
        chart_legend_peak: 'ชั่วโมงพีคสูงสุด (Peak)',
        chart_legend_normal: 'ช่วงเวลาปกติ',
        win_evening_title: 'ช่วงค่ำ–ดึกแข่งขัน (18:00–02:59 น.)',
        win_daytime_title: 'ช่วงกลางวัน & วางแผน (11:00–17:59 น.)',
        win_morning_title: 'ช่วงเช้า & สรุปผล (03:00–10:59 น.)',
        sec9_title: '09. ประสิทธิภาพระบบ โควตาคลาวด์ และความจุในการขยายสเกล',
        sec9_sub: 'ติดตามโควตา Worker (สุ่ม Cache HIT 10%), จำนวนแถว D1 ครบ 4 ตาราง และผลซิงก์ GitHub Actions จริง',
        sys_cache_hit_label: 'Edge Cache Hit (7d):',
        sys_d1_reads_label: 'D1 Writes วันนี้:',
        sys_upstream_ready: 'พร้อมเช็ก',
        sys_upstream_tap_hint: '(กดเช็กด้านล่าง)',
        sys_scale_headroom_label: 'เพดานขยายสเกล (Headroom):',
        ops_title: 'ปุ่มดูแลและเช็กความพร้อมของเว็บ',
        ops_sub: 'กดเฉพาะตอนที่ต้องการตรวจสอบหรือแก้ไขปัญหา ผลลัพธ์จะแสดงใต้ปุ่มทันที (คนเข้าเว็บทั่วไปไม่ได้รับผลกระทบ)',
        ops_shortcut_hint: 'คีย์ลัด: R รีเฟรช · L สลับภาษา · T สลับธีม',
        op_flush_title: 'รีเฟรชคะแนนสดใหม่ทั้งเว็บ',
        op_flush_desc: 'ใช้เมื่อคะแนนหรือโบนัสบนหน้าเว็บค้างไม่ขยับ ล้างแคช /live, /fixtures, /visitors และ /standings ทันที',
        op_flush_btn: 'รีเฟรชคะแนนสดทันที',
        op_ping_title: 'เช็กว่าระบบ FPL ล่มหรือช้าไหม',
        op_ping_desc: 'ใช้ตรวจดูว่าปัญหาคะแนนไม่ขึ้นเกิดจากเว็บพรีเมียร์ลีกต้นทางช้าหรือล่มอยู่หรือไม่',
        op_ping_btn: 'เช็กสถานะเว็บ FPL',
        op_export_title: 'ดาวน์โหลดไฟล์สถิติเก็บไว้',
        op_export_desc: 'เก็บข้อมูลยอดคนดูและรายละเอียดมินิลีกทั้งหมดในระบบลงเครื่องไว้ดูย้อนหลังหรือสรุปรายงาน',
        op_export_btn: 'ดาวน์โหลดไฟล์สถิติ',
        op_prune_title: 'ลบประวัติคนดูเก่าที่เกิน 30 วัน',
        op_prune_desc: 'ช่วยเคลียร์บันทึกเก่าที่ไม่ใช้แล้วให้ระบบลื่นและประหยัดพื้นที่ (ยอดคนดูสะสมตลอดกาลยังอยู่ครบ)',
        op_prune_btn: 'ลบประวัติเก่าเกิน 30 วัน',
        confirm_prune: 'ยืนยันการลบประวัติการเข้าชมเก่าที่เกิน 30 วันหรือไม่? (ยอดเข้าชมสะสมตลอดกาลจะยังอยู่ครบไม่ถูกลบ)',
        sec10_title: '10. ตรวจสุขภาพระบบ ความสดใหม่การซิงก์ และ Error ย้อนหลัง (Monitor)',
        sec10_sub: 'เช็กย้อนหลัง 1 วัน (รายชั่วโมง) และ 1 สัปดาห์ (รายวัน) พร้อมตรวจจับความสดใหม่ของการซิงก์ GitHub Actions',
        mon_status_healthy: 'ทำงานปกติ 100%',
        mon_status_warning: 'พบคำเตือน / ซิงก์ล่าช้า',
        mon_status_incident: 'พบความผิดปกติ — ควรตรวจสอบ',
        mon_kpi_24h_label: 'ความพร้อมใช้งาน 1 วัน (24 ชม.)',
        mon_kpi_7d_label: 'ความพร้อมใช้งาน 1 สัปดาห์ (7 วัน)',
        mon_kpi_client_label: 'ปัญหาฝั่งผู้ใช้งาน (หน้าเว็บ/ชำระเงิน)',
        mon_kpi_client_sub: 'หน้าเว็บค้าง โหลดข้อมูลไม่ขึ้น หรือ JS Error',
        mon_kpi_upstream_label: 'ปัญหาเว็บ FPL ต้นทาง (5xx/Fixtures)',
        mon_kpi_upstream_sub: 'เว็บพรีเมียร์ลีกต้นทางตอบช้าหรือล่มชั่วคราว',
        mon_chart_title_24h: 'บันทึกการทำงานย้อนหลัง 24 ชั่วโมงล่าสุด (เวลาไทย · ICT)',
        mon_chart_sub_24h: 'เปรียบเทียบช่วงเวลาที่ระบบทำงานปกติ กับช่วงเวลาที่ตรวจพบ Error รายชั่วโมง',
        mon_chart_title_7d: 'บันทึกการทำงานย้อนหลัง 7 วันล่าสุด (1 สัปดาห์)',
        mon_chart_sub_7d: 'สรุปปริมาณการใช้งานและจำนวน Error แยกตามวันย้อนหลัง 7 วัน',
        mon_btn_24h: '1 วัน (24 ชม.)',
        mon_btn_7d: '1 สัปดาห์ (7 วัน)',
        mon_legend_ok: 'ใช้งานปกติ (จำนวนครั้ง)',
        mon_legend_err: 'ช่วงเวลาที่พบ Error',
        mon_anomaly_title: 'ประวัติช่วงเวลาที่ทำงานผิดปกติ (Anomaly Timeline)',
        mon_cat_title: 'สรุปประเภท Error สะสม 7 วันล่าสุด',
        sec11_title: '11. คู่มือ Live Pitch และสไลด์นำเสนอลูกค้า (ตัวเลขสด 100%)',
        sec11_sub: 'พับเก็บเป็นค่าเริ่มต้น กดปุ่มเปิดเมื่อเตรียมแชร์หน้าจอพรีเซนต์ลูกค้า — กราฟและแพ็กเกจซิงก์กับระบบจริง',
        btn_expand_pitch: 'เปิดคู่มือ Live Pitch ↓',
        btn_collapse_pitch: 'ซ่อนคู่มือ Live Pitch ↑',
        pitch_g2_title: 'กราฟเปรียบเทียบการมีส่วนร่วมจริงต่อทีม (Visits / Team · 7 วัน)',
        pitch_g2_sub: 'คำนวณจากยอดเข้าชม D1 จริง ไม่มีค่าสมมติ',
        pitch_g3_title: '5 รูปแบบกติกาลีกที่ระบบคำนวณให้อัตโนมัติ',
        pitch_g3_sub: 'ครอบคลุมทั้งลีกเงินรางวัลเต็มรูปแบบและลีกคอมมูนิตี้ขนาดใหญ่',
        pitch_g4_title: 'แพ็กเกจและฟีเจอร์เด่นที่เปิดใช้งานจริงบนระบบ',
        pitch_demo_links_title: 'ทางลัดเปิดหน้าเดโมจริงระหว่างพรีเซนต์ลูกค้า:',
        footer_rights: 'ศูนย์วิเคราะห์ข้อมูลธุรกิจและโครงสร้างพื้นฐานครบวงจร (Live Config)'
      },
      en: {
        skip_to_content: 'Skip to main content',
        nav_console_badge: 'Executive BI Console',
        nav_jump_league_label: 'Quick Jump to Landing, Demo & Mini-Leagues',
        nav_jump_placeholder: 'Quick Jump (Landing / Demo / Leagues)...',
        nav_jump_landing: '🛒 Commercial Landing Page (index.html)',
        nav_jump_preview: '🎮 Showcase Demo Hub (preview.html)',
        mod_nav_1: '01. Audience KPIs',
        mod_nav_2: '02. Portfolio',
        mod_nav_3: '03. Orders & Slips',
        mod_nav_4: '04. Onboarding',
        mod_nav_5: '05. Features',
        mod_nav_6: '06. Browser & Geo',
        mod_nav_7: '07. Devices',
        mod_nav_8: '08. Peak Traffic',
        mod_nav_9: '09. System & Quota',
        mod_nav_10: '10. Monitor',
        mod_nav_11: '11. Pitch Deck',
        sign_out: 'Sign Out',
        page_title: 'Executive Summary & Live Business Intelligence',
        page_subtitle: '100% live system telemetry, member engagement, prize pool economics, and cloud scaling capacity.',
        btn_copy_exec: 'Copy Executive Brief',
        btn_copied_exec: 'Copied Brief to Clipboard!',
        btn_live_pitch_refresh: '⚡ Live Refresh',
        telem_live_active: 'Live telemetry active',
        telem_auto_sync: '(Syncs 1h Fri–Mon / 4h Tue–Thu)',
        telem_last_sync_label: 'Last sync: ',
        telem_runner_label: 'Runner: ',
        telem_countdown_sub: 'Countdown to transfer deadline',
        toast_refreshed: 'Refreshed live metrics from Cloudflare Edge & D1',
        badge_live_sync: 'Live Sync',
        badge_live_d1: 'Live D1',
        sec1_title: '01. Live Audience & Traffic KPIs',
        sec1_sub: '100% real data from league sync and Cloudflare D1 (cookieless · zero synthetic fallbacks)',
        kpi_managers_label: 'Tracked Managers',
        kpi_managers_sub: 'Loading league counts from system...',
        kpi_mau_label: '7-Day Peak Daily Views',
        kpi_mau_sub: 'Highest single-day league views in rolling 7 days',
        kpi_offpeak_label: 'Weekday Avg Views (Tue–Thu)',
        kpi_offpeak_sub: 'Actual Tue–Thu off-peak planning baseline',
        kpi_stickiness_label: 'Matchday (Fri–Mon) vs Weekday Share',
        kpi_stickiness_sub: 'Real 7-day visit split between matchdays and mid-week',
        kpi_retention_label: 'Lifetime Total Site Views',
        kpi_retention_sub: '30-min deduped counter (since Nov 2026)',
        kpi_screentime_label: 'Avg Session Screen Time',
        kpi_screentime_sub: 'Measured directly via Dwell Time Beacon (7d)',
        sec2_title: '02. Multi-League Portfolio & Commercial Economics',
        sec2_sub: 'Click column headers to sort · League column stays sticky on horizontal scroll',
        port_gmv_label: 'Total Prize Pool (GMV)',
        port_gmv_sub: 'Combined season + weekly/monthly league prize pools',
        port_custom_label: 'Custom Rules Leagues',
        port_custom_sub: 'Higher switching cost vs standard FPL tables',
        port_landing_label: 'Landing Page Views (7d)',
        port_landing_sub: 'Isolated from mini-league dashboard traffic',
        port_whitelabel_label: 'Tier 1 Capacity Headroom',
        port_whitelabel_sub: 'Remaining capacity under 30 leagues / 500 teams Tier 1 cap (฿0 marginal cost)',
        pf_filter_all: 'All',
        pf_filter_private: 'Private Customers',
        pf_filter_expiring: 'Trial / Expiring Soon',
        pf_filter_paused: 'Paused',
        pf_filter_showcase: 'Showcase Demos',
        col_league_name: 'League & ID',
        col_teams: 'Teams',
        col_pool: 'Prize Pool (GMV)',
        col_modules: 'Active Modules & Rules',
        col_views: '7d Views',
        col_engagement: 'Avg Time / Per Team',
        col_lifecycle: 'Status & Expiry',
        col_actions: 'Manage',
        sec3_title: '03. Customer Orders & Payment Slip Inbox',
        sec3_sub: 'Configure private payment QR, verify exact satang transfers, inspect customer slips, prefill Onboarding below, and mark leagues live.',
        ord_btn_refresh: 'Refresh Orders',
        pay_qr_title: 'Private Payment QR Settings (No Phone / ID / e-Wallet Required)',
        btn_toggle_qr_hide: 'Hide QR Settings',
        btn_toggle_qr_show: 'Edit / Show QR Settings',
        pay_qr_acct_lbl: 'Recipient Account Name (Shown to Customers for Verification)',
        pay_qr_file_lbl: 'Upload Payment QR Code Image',
        pay_qr_file_hint: 'Supports PNG / JPG / WebP (auto-resized in your browser). Stored privately in Cloudflare D1 only — never committed to GitHub.',
        pay_qr_btn_save: 'Save QR Settings',
        pay_qr_btn_clear: 'Remove Stored QR Image',
        pay_qr_preview_lbl: 'Customer Checkout QR Preview',
        pay_qr_preview_empty: 'No private QR image uploaded yet',
        ord_stat_total_lbl: 'Total Recorded Orders',
        ord_stat_paid_lbl: 'Paid / Live Orders',
        ord_stat_active_lbl: 'Active Pending Queue',
        ord_stat_expired_lbl: 'Unpaid >24h / Canceled',
        ord_f_all: 'All',
        ord_f_slip: 'Slip Uploaded',
        ord_f_await: 'Awaiting QR Pay',
        ord_f_paid: 'Verified Paid',
        ord_f_quote: 'Quote / USD',
        ord_f_live: 'Live',
        ord_f_rejected: 'Rejected',
        ord_col_id: 'Order ID',
        ord_col_league: 'FPL League',
        ord_col_amount: 'Amount',
        ord_col_contact: 'Customer Contact',
        ord_col_status: 'Status',
        ord_col_created: 'Created',
        ord_col_action: 'Inspect',
        ord_det_amount_lbl: 'Exact Match Amount',
        ord_det_rules_lbl: 'Customer Rules & Notes',
        ord_det_open_pay: 'Open Customer Checkout (/pay/) ↗',
        ord_det_copy_pay: 'Copy Order Link',
        ord_det_copy_line: 'Copy Status Reply (LINE)',
        ord_det_email_cust: 'Draft Reply Email ↗',
        ord_lbl_note: 'Admin Note / Rejection Reason',
        ord_lbl_url: 'Delivered League URL',
        ord_act_verify: '✓ Verify Payment (Paid)',
        ord_act_prefill: 'Prefill Onboarding ↓',
        ord_act_live: 'Mark Live & Email Customer',
        ord_act_reject: 'Reject Slip & Email',
        ord_act_delslip: 'Delete Slip Image',
        ord_act_del_unpaid: 'Delete Unpaid (+Stats)',
        ord_act_del_test: 'Delete Test Order (No Stats)',
        ord_slip_heading: 'Uploaded Transfer Slip',
        ord_btn_reload_slip: 'Reload Slip Image',
        sec4_title: '04. Concierge Customer League Onboarding Wizard',
        sec4_sub: 'Inspect live FPL Classic League IDs, exclude non-prize teams, configure rules/tiers, and generate instant setup scripts.',
        onb_lbl_id: 'FPL Classic League ID (Numbers only)',
        onb_btn_inspect: 'Inspect Live League',
        onb_lbl_plan: 'Plan',
        onb_lbl_prize: 'Prize Model',
        onb_lbl_weekly: 'Weekly Prize (THB)',
        onb_lbl_status: 'License Status',
        onb_lbl_tier: 'Architecture Tier',
        onb_lbl_currency: 'Prize Currency',
        onb_lbl_entry_fee: 'Entry Fee / Team (Optional)',
        onb_lbl_total_pool: 'Total Pool (Optional)',
        onb_lbl_season_prizes: 'Season Prizes (Optional)',
        onb_lbl_cup_prize: 'Cup Prize (Champion or C/R)',
        onb_lbl_penalty_tiers: 'Bottom N Penalty Tiers (comma-separated, worst rank first)',
        onb_penalty_hint: 'Supports any N bottom ranks (e.g. 300,200,100); table columns & summary cards adapt automatically.',
        onb_lbl_monthly_champ: 'Monthly Champion Prize',
        onb_lbl_monthly_runner: 'Monthly Runner-up Prize (0 if none)',
        onb_lbl_tenant: 'Tenant Group (Isolation)',
        onb_lbl_visibility: 'Visibility & SEO',
        onb_lbl_short: 'League Short Name',
        onb_lbl_expires: 'Expires At',
        onb_lbl_nocup: 'Disable Cup tab (--no-cup for leagues without FPL Cup)',
        onb_d1_note_tip: '🔒 Store private customer notes (LINE contact / payment dates) in Section 02 above (kept securely in Cloudflare D1, never committed to Git).',
        onb_teams_hint: 'Check teams excluded from prizes (non_prize_teams) if applicable:',
        onb_out_cli: '1. CLI Command (Run locally to provision)',
        onb_out_json: '2. Config JSON (leagues_config.json)',
        onb_out_line: '3. Customer Handoff Message (LINE)',
        sec5_title: '05. Feature Adoption & Product Value (Live 7d)',
        sec5_sub: 'Tracks every live tab including Transfer Advisor · 100% from D1 Beacon events',
        feat_share_title: 'Actual Feature Interactions Share (7d)',
        feat_seg_title: 'Engagement: Prize vs Community Leagues',
        feat_seg_desc: 'Real 7-day Visits/Team comparison from D1 separating prize-pool leagues and community leagues.',
        seg_prize_lbl: 'Prize Leagues',
        seg_comm_lbl: 'Community / Free Leagues',
        sec6_title: '06. Browsers, Geo & Locale Preference (TH / EN)',
        sec6_sub: 'LINE In-App Browser, Safari, Chrome · Cloudflare Edge Geo · Live TH vs EN language split',
        dist_src_title: 'Browser & In-App Client Distribution (7d)',
        dist_geo_title: 'Edge Geography & Active Language Preference',
        geo_bkk_lbl: 'Bangkok & Metro',
        geo_reg_lbl: 'Regional Thailand',
        geo_intl_lbl: 'International',
        dist_locale_lbl: 'Active UI Language (TH vs EN)',
        sec7_title: '07. Client Devices (with iPadOS Touch Detection)',
        sec7_sub: 'Combines screen & touch detection so iPadOS is categorized as Tablet rather than Desktop',
        dev_btn_7d: 'Last 7 Days',
        dev_btn_30d: 'Last 30 Days',
        dev_mobile_label: 'Mobile Phones',
        dev_desktop_label: 'Desktop & Laptop',
        dev_tablet_label: 'Tablets / iPadOS',
        dev_mobile_desc: 'iOS / Android < 768px',
        dev_desktop_desc: 'macOS / Windows Non-Touch',
        dev_tablet_desc: 'iPadOS Touch & Tablets',
        sec8_title: '08. Matchday Traffic Rhythm & Real Peak Windows (ICT · 7d)',
        sec8_sub: 'Plotted strictly from Cloudflare D1 visit timestamps (zero synthetic curves)',
        chart_title_hourly: '24-Hour Visit Density (Thailand Time · ICT)',
        chart_sub_hourly: 'Aggregated real D1 league & landing views across hours 00:00–23:59 ICT (7d)',
        chart_title_daily: '7-Day Rolling Session Volume (Daily Visits)',
        chart_sub_daily: 'Real daily visit counts over the last 7 ICT calendar days',
        chart_btn_24h: 'Hourly (24h)',
        chart_btn_7d: 'Daily (7d)',
        chart_legend_peak: 'Peak Hour',
        chart_legend_normal: 'Normal Hour',
        win_evening_title: 'Evening Match Window (18:00–02:59 ICT)',
        win_daytime_title: 'Daytime & Planning (11:00–17:59 ICT)',
        win_morning_title: 'Morning Settlement (03:00–10:59 ICT)',
        sec9_title: '09. System Performance, Cloud Quota & Scaling Capacity',
        sec9_sub: 'Live Worker quota (10%-sampled HIT tracking), 4-table D1 breakdown & GitHub Actions sync telemetry',
        sys_cache_hit_label: 'Edge Cache Hit (7d):',
        sys_d1_reads_label: 'D1 Writes Today:',
        sys_upstream_ready: 'Ready',
        sys_upstream_tap_hint: '(Tap below to test)',
        sys_scale_headroom_label: 'Scaling Headroom:',
        ops_title: 'Edge Operations & Health Check Controls',
        ops_sub: 'Run on demand to troubleshoot live issues. Results appear inline without disrupting public visitors.',
        ops_shortcut_hint: 'Shortcuts: R Refresh · L Language · T Theme',
        op_flush_title: 'Flush Live Edge Cache',
        op_flush_desc: 'Clear /live, /fixtures, /visitors & /standings edge caches immediately if live scores lag.',
        op_flush_btn: 'Flush Edge Cache Now',
        op_ping_title: 'Ping Upstream FPL API',
        op_ping_desc: 'Verify whether Premier League upstream API is reachable and measure edge latency.',
        op_ping_btn: 'Ping FPL Upstream',
        op_export_title: 'Download JSON Snapshot',
        op_export_desc: 'Export complete live metrics, portfolio details and D1 breakdown as a JSON file.',
        op_export_btn: 'Export Metrics JSON',
        op_prune_title: 'Prune Old D1 Telemetry (>30d)',
        op_prune_desc: 'Delete telemetry rows older than 30 days to keep D1 lean (lifetime total views remain preserved).',
        op_prune_btn: 'Prune Telemetry >30d',
        confirm_prune: 'Remove daily visitor logs older than 30 days? (Your lifetime total views counter will NOT be deleted.)',
        sec10_title: '10. Project Health, Sync Freshness & Error Monitor (24h / 7d)',
        sec10_sub: 'Real 24h hourly & 7d daily incident logs plus GitHub Actions schedule freshness check',
        mon_status_healthy: 'All Systems Healthy (100%)',
        mon_status_warning: 'Warnings / Sync Delay',
        mon_status_incident: 'Anomalies Detected — Review Needed',
        mon_kpi_24h_label: '24-Hour Uptime',
        mon_kpi_7d_label: '7-Day Uptime',
        mon_kpi_client_label: 'Client Errors (Site / Checkout)',
        mon_kpi_client_sub: 'Frontend freezes, data load failures, or JS errors',
        mon_kpi_upstream_label: 'FPL Upstream Errors (5xx/Fixtures)',
        mon_kpi_upstream_sub: 'Premier League API timeouts or 5xx responses',
        mon_chart_title_24h: 'Last 24 Hours Health & Error Log (ICT)',
        mon_chart_sub_24h: 'Hourly normal activity vs detected client/upstream errors',
        mon_chart_title_7d: 'Last 7 Days Health & Error Log (1 Week)',
        mon_chart_sub_7d: 'Daily system activity vs client/upstream errors across 7 days',
        mon_btn_24h: '24 Hours',
        mon_btn_7d: '7 Days',
        mon_legend_ok: 'Normal Activity',
        mon_legend_err: 'Errors Detected',
        mon_anomaly_title: 'Anomaly Timeline Windows',
        mon_cat_title: '7-Day Error Category Breakdown',
        sec11_title: '11. Live Demo Pitch & Commercial Playbook (100% Live Figures)',
        sec11_sub: 'Collapsed by default — expand during live customer walkthroughs with live-synced metrics & pricing',
        btn_expand_pitch: 'Expand Live Pitch ↓',
        btn_collapse_pitch: 'Collapse Live Pitch ↑',
        pitch_g2_title: 'Live Segment Engagement Comparison (Visits / Team · 7d)',
        pitch_g2_sub: 'Calculated directly from Cloudflare D1 views (zero synthetic numbers)',
        pitch_g3_title: '5 Automated Prize & League Models Supported',
        pitch_g3_sub: 'Built for both high-engagement prize leagues and large community leagues',
        pitch_g4_title: 'Live Product Matrix & Package Pricing',
        pitch_demo_links_title: 'Live Demo Jump Links During Customer Calls:',
        footer_rights: 'Executive BI & Infrastructure Control (Live Config)'
      }
    };

    // =========================================================================
    // 2. PORTFOLIO DATASET & SORTING ENGINE
    // =========================================================================
    let LEAGUE_PORTFOLIO = [];

    let currentSortKey = 'pool';
    let currentSortDir = 'desc';
    let currentPortfolioFilter = 'all';
    let selectedLifecycleLeagueId = null;
    let currentChartMode = 'hourly';
    let currentMonitorMode = '24h';
    let currentDeviceWindow = '30d';
    let latestPayloadCache = null;
    let DEVICES_STATE = { w7: null, w30: null };

    let MONITOR_STATE = {
      sync_health: { status: 'unknown', age_minutes: null, expected_interval_min: null },
      summary_24h: { activity_count: 0, client_errors: 0, upstream_errors: 0, total_errors: 0, error_rate_pct: '0.00', uptime_pct: '100.00', status: 'healthy' },
      summary_7d: { activity_count: 0, client_errors: 0, upstream_errors: 0, total_errors: 0, error_rate_pct: '0.00', uptime_pct: '100.00', status: 'healthy' },
      error_categories_7d: { js_error: 0, api_timeout: 0, api_http: 0, data_load: 0, upstream_5xx: 0, upstream_fixtures: 0 },
      anomaly_windows_24h: [],
      anomaly_windows_7d: [],
      series_24h: Array.from({ length: 24 }, (_, idx) => ({
        label: String(idx).padStart(2, '0') + ':00',
        utc_date: '',
        ict_hour: idx,
        visits: 0,
        api_ok: 0,
        activity: 0,
        client_errors: 0,
        upstream_errors: 0,
        total_errors: 0,
        status: 'healthy'
      })),
      series_7d: Array.from({ length: 7 }, () => ({
        date: '',
        visits: 0,
        api_ok: 0,
        activity: 0,
        client_errors: 0,
        upstream_errors: 0,
        total_errors: 0,
        status: 'healthy'
      }))
    };

    let HOURLY_SERIES = Array.from({ length: 24 }, (_, idx) => ({
      hour: String(idx).padStart(2, '0') + ':00',
      count: 0,
      pct: 0,
      peak: false
    }));

    let DAILY_SERIES = [];

    function escHtml(str) {
      return String(str == null ? '' : str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function getLang() {
      return document.documentElement.lang === 'en' ? 'en' : 'th';
    }

    function matchesPortfolioFilter(row, filterKey) {
      if (filterKey === 'private') return row.visibility === 'private';
      if (filterKey === 'showcase') return row.visibility !== 'private';
      if (filterKey === 'paused') return row.status === 'paused';
      if (filterKey === 'expiring') {
        return row.status === 'trial' || row.expiry_alert === 'expiring_soon' || row.expiry_alert === 'expired';
      }
      return true;
    }

    function getExpirySortRank(row) {
      if (row.expiry_alert === 'expired') return 0;
      if (row.expiry_alert === 'expiring_soon') return 1;
      if (row.status === 'trial') return 2;
      if (row.status === 'paused') return 3;
      if (typeof row.days_remaining === 'number') return 10 + row.days_remaining;
      return 10000;
    }

    function getLifecycleBadgeHtml(row, lang) {
      const status = row.status || 'active';
      const vis = row.visibility === 'private' ? 'private' : 'showcase';
      const statusCls = status === 'paused'
        ? 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border-rose-500/30'
        : (status === 'trial'
          ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/30'
          : 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-500/30');
      const statusLbl = status.toUpperCase();
      const visCls = vis === 'private'
        ? 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border-sky-500/30'
        : 'bg-slate-500/10 text-slate-700 dark:text-neutral-300 border-slate-400/30';
      const visLbl = vis === 'private' ? 'Private' : 'Showcase';
      const planLbl = String(row.plan || 'standard').toUpperCase();

      let expLine = '';
      if (row.expires_at) {
        const d = row.days_remaining;
        let remText = '';
        let expTextCls = 'text-slate-600 dark:text-neutral-400';
        if (typeof d === 'number') {
          if (d < 0) {
            remText = lang === 'en' ? (' (expired ' + Math.abs(d) + 'd ago)') : (' (เลยกำหนด ' + Math.abs(d) + ' วัน)');
            expTextCls = 'text-rose-700 dark:text-rose-400 font-semibold';
          } else if (d <= 14) {
            remText = lang === 'en' ? (' (' + d + 'd left)') : (' (เหลือ ' + d + ' วัน)');
            expTextCls = 'text-amber-800 dark:text-amber-300 font-semibold';
          } else {
            remText = lang === 'en' ? (' (' + d + 'd)') : (' (' + d + ' วัน)');
          }
        }
        expLine = '<div class="text-xs mono mt-1 whitespace-nowrap ' + expTextCls + '">' + escHtml(row.expires_at + remText) + '</div>';
      } else {
        expLine = '<div class="text-xs mono mt-1 text-slate-600 dark:text-neutral-400 whitespace-nowrap">' + escHtml(planLbl) + ' · —</div>';
      }

      return '<div class="flex flex-wrap items-center gap-1">' +
        '<span class="px-2 py-0.5 rounded border text-xs font-semibold mono whitespace-nowrap ' + statusCls + '">' + escHtml(statusLbl) + '</span>' +
        '<span class="px-2 py-0.5 rounded border text-xs font-medium mono whitespace-nowrap ' + visCls + '">' + escHtml(visLbl) + '</span>' +
      '</div>' + expLine;
    }

    function renderPortfolioFilterCounts() {
      const counts = {
        all: LEAGUE_PORTFOLIO.length,
        private: LEAGUE_PORTFOLIO.filter(r => matchesPortfolioFilter(r, 'private')).length,
        expiring: LEAGUE_PORTFOLIO.filter(r => matchesPortfolioFilter(r, 'expiring')).length,
        paused: LEAGUE_PORTFOLIO.filter(r => matchesPortfolioFilter(r, 'paused')).length,
        showcase: LEAGUE_PORTFOLIO.filter(r => matchesPortfolioFilter(r, 'showcase')).length,
      };
      Object.entries(counts).forEach(([k, val]) => {
        const el = document.getElementById('pfCount-' + k);
        if (el) el.textContent = String(val);
      });
      document.querySelectorAll('.pf-filter-btn').forEach((btn) => {
        const key = btn.getAttribute('data-portfolio-filter');
        const active = key === currentPortfolioFilter;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        btn.className = active
          ? 'pf-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg text-xs font-medium border border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 inline-flex items-center gap-1.5 whitespace-nowrap transition-colors'
          : 'pf-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg text-xs font-medium border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300 hover:bg-raisedLight dark:hover:bg-raisedDark inline-flex items-center gap-1.5 whitespace-nowrap transition-colors';
      });
    }

    function renderExpiryAlertBanner(lang) {
      const banner = document.getElementById('portfolioExpiryAlert');
      if (!banner) return;
      const flagged = LEAGUE_PORTFOLIO.filter(r => r.expiry_alert === 'expired' || r.expiry_alert === 'expiring_soon');
      if (!flagged.length) {
        banner.classList.add('hidden');
        banner.replaceChildren();
        return;
      }
      const namesList = flagged.map((r) => {
        const d = typeof r.days_remaining === 'number'
          ? (r.days_remaining < 0 ? (lang === 'en' ? 'expired' : 'หมดอายุแล้ว') : (lang === 'en' ? r.days_remaining + 'd left' : 'เหลือ ' + r.days_remaining + ' วัน'))
          : (r.expires_at || '');
        return r.name + ' (ID ' + r.id + ': ' + d + ')';
      }).join(' · ');
      const title = lang === 'en'
        ? 'Renewal / Trial Alert (' + flagged.length + ' league' + (flagged.length > 1 ? 's' : '') + ' expiring within 14 days or expired): '
        : 'แจ้งเตือนต่ออายุ / ใกล้หมดช่วงทดลองใช้ (' + flagged.length + ' ลีกภายใน 14 วัน): ';
      const strong = document.createElement('strong');
      strong.textContent = title;
      const span = document.createElement('span');
      span.textContent = namesList;
      banner.replaceChildren(strong, span);
      banner.classList.remove('hidden');
    }

    function openLifecycleActionPanel(leagueId) {
      const prevId = selectedLifecycleLeagueId;
      selectedLifecycleLeagueId = String(leagueId || '');
      const statusEl = document.getElementById('lcNoteStatus');
      if (statusEl && prevId !== selectedLifecycleLeagueId) {
        statusEl.classList.add('hidden');
        statusEl.textContent = '';
      }
      renderLifecycleActionPanel();
      const panel = document.getElementById('lifecycleActionPanel');
      if (panel && !panel.classList.contains('hidden')) {
        panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    function renderLifecycleActionPanel() {
      const panel = document.getElementById('lifecycleActionPanel');
      if (!panel) return;
      const row = selectedLifecycleLeagueId
        ? LEAGUE_PORTFOLIO.find(r => String(r.id) === String(selectedLifecycleLeagueId))
        : null;
      if (!row) {
        panel.classList.add('hidden');
        return;
      }
      const lang = getLang();
      const titleEl = document.getElementById('lcPanelTitle');
      const badgesEl = document.getElementById('lcPanelBadges');
      const metaEl = document.getElementById('lcPanelMeta');
      const noteEl = document.getElementById('lcPanelBillingNote');
      const lblD1Note = document.getElementById('lcLblD1Note');
      const noteInput = document.getElementById('lcNoteInput');
      const btnSaveNote = document.getElementById('btnSaveLeagueNote');
      const renewTa = document.getElementById('lcOutRenewCli');
      const pauseTa = document.getElementById('lcOutPauseCli');
      const lineTa = document.getElementById('lcOutLineMsg');
      const lblRenew = document.getElementById('lcLblRenew');
      const lblPause = document.getElementById('lcLblPause');
      const lblLine = document.getElementById('lcLblLine');

      if (titleEl) titleEl.textContent = row.name + ' (ID: ' + row.id + ')';
      if (badgesEl) {
        const makeBadge = (txt) => {
          const s = document.createElement('span');
          s.className = 'px-2 py-0.5 rounded border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-slate-700 dark:text-neutral-200';
          s.textContent = txt;
          return s;
        };
        badgesEl.replaceChildren(
          makeBadge((row.status || 'active').toUpperCase()),
          makeBadge(row.visibility === 'private' ? 'PRIVATE' : 'SHOWCASE'),
          makeBadge(String(row.plan || 'standard').toUpperCase())
        );
      }
      if (metaEl) {
        const expText = row.expires_at
          ? (row.expires_at + (typeof row.days_remaining === 'number' ? ' (' + row.days_remaining + 'd)' : ''))
          : (lang === 'en' ? 'No expiry set' : 'ยังไม่กำหนดวันหมดอายุ');
        metaEl.textContent = 'Tenant: ' + (row.tenant_group || 'showcase') +
          (lang === 'en' ? ' · Expires: ' : ' · วันหมดอายุ: ') + expText;
      }
      if (noteEl) {
        if (row.billing_note) {
          noteEl.textContent = (lang === 'en' ? 'Admin Note (D1): ' : 'โน้ตแอดมิน (D1 ส่วนตัว): ') + row.billing_note;
          noteEl.classList.remove('hidden');
        } else {
          noteEl.textContent = '';
          noteEl.classList.add('hidden');
        }
      }
      if (lblD1Note) {
        lblD1Note.textContent = lang === 'en'
          ? 'Private Customer Note (Saved in Cloudflare D1 — Never committed to Git)'
          : 'โน้ตลูกค้าส่วนตัว (บันทึกใน Cloudflare D1 — ไม่ลง Git)';
      }
      if (noteInput) {
        noteInput.placeholder = lang === 'en'
          ? 'e.g. LINE @somchai · Paid 500 THB on 19 Nov'
          : 'เช่น LINE @somchai · โอน 500฿ 19 พ.ย.';
        if (document.activeElement !== noteInput) {
          noteInput.value = row.billing_note || '';
        }
      }
      if (btnSaveNote && !btnSaveNote.disabled) {
        btnSaveNote.textContent = lang === 'en' ? 'Save to D1' : 'บันทึกโน้ตลง D1';
      }
      if (lblRenew) lblRenew.textContent = lang === 'en' ? '1. Activate / Renew (Active)' : '1. ต่ออายุ / เปิดเต็มระบบ (Active)';
      if (lblPause) lblPause.textContent = lang === 'en' ? '2. Pause Subscription (Paused)' : '2. พักระบบชั่วคราว (Paused)';
      if (lblLine) lblLine.textContent = lang === 'en' ? '3. Customer LINE Renewal Notice' : '3. ข้อความแจ้งเตือนต่ออายุทาง LINE';

      if (renewTa) {
        renewTa.value = 'python3 onboard_league.py --league-id ' + row.id + ' --update-lifecycle --status active --expires-at 2027-06-01';
      }
      if (pauseTa) {
        pauseTa.value = 'python3 onboard_league.py --league-id ' + row.id + ' --update-lifecycle --status paused --skip-sync';
      }
      if (lineTa) {
        const dashUrl = 'https://www.fplsawadika.com/' + row.id + '/';
        const expDisplay = row.expires_at || 'ฤดูกาล 2026/27';
        lineTa.value = lang === 'en'
          ? ('FPLSaWaDiKa Renewal Reminder for "' + row.name + '" (ID: ' + row.id + ')\\n'
            + 'Dashboard: ' + dashUrl + '\\n'
            + 'Current period ends: ' + (row.expires_at || 'End of 2026/27 Season') + '\\n'
            + 'Reply here to renew and keep live matchday scores active!')
          : ('แจ้งเตือนสถานะระบบ FPLSaWaDiKa สำหรับลีก "' + row.name + '" (ID: ' + row.id + ')\\n'
            + 'ลิงก์แดชบอร์ด: ' + dashUrl + '\\n'
            + 'วันครบกำหนดรอบปัจจุบัน: ' + expDisplay + '\\n'
            + 'หากต้องการต่ออายุใช้งานต่อเนื่องตลอดฤดูกาล แจ้งแอดมินทางแชทนี้ได้เลยครับ');
      }
      panel.classList.remove('hidden');
    }

    async function saveLeagueNoteToD1() {
      if (!selectedLifecycleLeagueId) return;
      const noteInput = document.getElementById('lcNoteInput');
      const btnSave = document.getElementById('btnSaveLeagueNote');
      const statusEl = document.getElementById('lcNoteStatus');
      if (!noteInput || !btnSave) return;

      const lang = getLang();
      const noteVal = (noteInput.value || '').trim().slice(0, 500);
      btnSave.disabled = true;
      btnSave.textContent = lang === 'en' ? 'Saving...' : 'กำลังบันทึก...';
      if (statusEl) {
        statusEl.className = 'text-xs mono text-slate-600 dark:text-neutral-400';
        statusEl.textContent = lang === 'en' ? 'Saving private note to Cloudflare D1...' : 'กำลังบันทึกโน้ตลงฐานข้อมูล D1...';
        statusEl.classList.remove('hidden');
      }
      try {
        const resp = await fetch('/api/admin/league-note', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            league_id: String(selectedLifecycleLeagueId),
            note: noteVal
          })
        });
        const payload = await resp.json();
        if (!resp.ok || !payload.success) {
          throw new Error(payload.error || ('HTTP ' + resp.status));
        }
        const row = LEAGUE_PORTFOLIO.find(r => String(r.id) === String(selectedLifecycleLeagueId));
        if (row) {
          row.billing_note = payload.note || '';
          row.billing_note_source = payload.note ? 'd1' : '';
        }
        if (latestPayloadCache && latestPayloadCache.liveLeagueSummaries && latestPayloadCache.liveLeagueSummaries[selectedLifecycleLeagueId]) {
          latestPayloadCache.liveLeagueSummaries[selectedLifecycleLeagueId].billing_note = payload.note || '';
          latestPayloadCache.liveLeagueSummaries[selectedLifecycleLeagueId].billing_note_source = payload.note ? 'd1' : '';
        }
        noteInput.value = payload.note || '';
        renderLifecycleActionPanel();
        if (statusEl) {
          statusEl.className = 'text-xs mono text-emerald-700 dark:text-emerald-400';
          statusEl.textContent = payload.note
            ? (lang === 'en' ? '✓ Saved privately to Cloudflare D1 (0% Git exposure)' : '✓ บันทึกลง Cloudflare D1 เรียบร้อย (ไม่ถูกอัปโหลดลง Git)')
            : (lang === 'en' ? '✓ Cleared private note from Cloudflare D1' : '✓ ลบโน้ตออกจาก Cloudflare D1 เรียบร้อย');
          statusEl.classList.remove('hidden');
        }
      } catch (err) {
        if (statusEl) {
          statusEl.className = 'text-xs mono text-rose-600 dark:text-rose-400';
          statusEl.textContent = (lang === 'en' ? 'Failed to save note: ' : 'บันทึกไม่สำเร็จ: ') + (err.message || 'Unknown error');
          statusEl.classList.remove('hidden');
        }
      } finally {
        btnSave.disabled = false;
        btnSave.textContent = getLang() === 'en' ? 'Save to D1' : 'บันทึกโน้ตลง D1';
      }
    }

    function initPortfolioLifecycleControls() {
      const filtersWrap = document.getElementById('portfolioLifecycleFilters');
      if (filtersWrap) {
        filtersWrap.addEventListener('click', (e) => {
          const btn = e.target && e.target.closest ? e.target.closest('[data-portfolio-filter]') : null;
          if (!btn) return;
          currentPortfolioFilter = btn.getAttribute('data-portfolio-filter') || 'all';
          renderLeagueTable();
        });
      }
      const tbody = document.getElementById('leagueTableBody');
      if (tbody) {
        tbody.addEventListener('click', (e) => {
          const btn = e.target && e.target.closest ? e.target.closest('[data-manage-league-id]') : null;
          if (!btn) return;
          openLifecycleActionPanel(btn.getAttribute('data-manage-league-id'));
        });
      }
      const closeBtn = document.getElementById('btnCloseLifecyclePanel');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          selectedLifecycleLeagueId = null;
          const panel = document.getElementById('lifecycleActionPanel');
          if (panel) panel.classList.add('hidden');
        });
      }
      const saveNoteBtn = document.getElementById('btnSaveLeagueNote');
      if (saveNoteBtn) {
        saveNoteBtn.addEventListener('click', saveLeagueNoteToD1);
      }
    }

    function renderLeagueTable() {
      const tbody = document.getElementById('leagueTableBody');
      if (!tbody) return;
      const lang = getLang();
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';

      renderPortfolioFilterCounts();
      renderExpiryAlertBanner(lang);

      const filtered = LEAGUE_PORTFOLIO.filter(r => matchesPortfolioFilter(r, currentPortfolioFilter));
      const sorted = [...filtered].sort((a, b) => {
        if (currentSortKey === 'status') {
          const ra = getExpirySortRank(a);
          const rb = getExpirySortRank(b);
          return currentSortDir === 'asc' ? ra - rb : rb - ra;
        }
        let va = a[currentSortKey];
        let vb = b[currentSortKey];
        if (typeof va === 'string') {
          return currentSortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va);
        }
        return currentSortDir === 'asc' ? va - vb : vb - va;
      });

      ['name', 'teams', 'pool', 'views', 'vpt', 'status'].forEach((k) => {
        const th = document.getElementById('th-' + k);
        const icon = document.getElementById('sort-icon-' + k);
        if (th) {
          th.setAttribute('aria-sort', k === currentSortKey ? (currentSortDir === 'asc' ? 'ascending' : 'descending') : 'none');
        }
        if (icon) {
          icon.className = k === currentSortKey
            ? 'text-emerald-700 dark:text-emerald-400'
            : 'text-slate-500 dark:text-neutral-400';
        }
      });

      if (!sorted.length) {
        const emptyText = LEAGUE_PORTFOLIO.length === 0
          ? (lang === 'en' ? 'Loading live league portfolio…' : 'กำลังโหลดข้อมูลพอร์ตโฟลิโอลีกสดจากระบบ…')
          : (lang === 'en' ? 'No leagues match this lifecycle filter.' : 'ยังไม่มีลีกในกลุ่มสถานะที่เลือก');
        tbody.innerHTML = '<tr><td colspan="8" class="px-4 py-8 text-center text-xs text-slate-600 dark:text-neutral-400">' + escHtml(emptyText) + '</td></tr>';
        return;
      }

      tbody.innerHTML = sorted.map((row) => {
        const poolText = row.pool > 0
          ? '฿' + Number(row.pool).toLocaleString()
          : escHtml(lang === 'en' ? (row.poolLabelEn || 'Community') : (row.poolLabelTh || 'คอมมูนิตี้'));
        const poolClass = row.pool > 0
          ? 'font-semibold text-emerald-700 dark:text-emerald-400'
          : 'font-medium text-slate-600 dark:text-neutral-400';
        const modulesText = lang === 'en' ? (row.modulesEn || row.modulesTh || '—') : (row.modulesTh || row.modulesEn || '—');
        const badgePart = row.badge ? ' · ' + row.badge : '';
        const targetUrl = 'https://www.fplsawadika.com/' + encodeURIComponent(row.id) + '/?lang=' + lang + '&theme=' + theme;
        const manageText = lang === 'en' ? 'Manage' : 'จัดการสิทธิ์';
        const avgTimeText = lang === 'en' ? (row.avgScreenTimeEn || '—') : (row.avgScreenTime || '—');
        const vptText = Number(row.vpt || 0).toFixed(1) + (lang === 'en' ? '/team (7d)' : '/ทีม (7d)');

        return '<tr class="hover:bg-raisedLight/60 dark:hover:bg-raisedDark/60 transition-colors">' +
          '<th scope="row" class="sticky left-0 z-10 bg-cardLight dark:bg-cardDark px-4 py-1.5 font-medium text-slate-900 dark:text-white border-r border-borderLight dark:border-borderDark whitespace-nowrap">' +
            '<a href="' + targetUrl + '" target="_blank" rel="noopener" class="min-h-[44px] flex flex-col justify-center hover:text-emerald-700 dark:hover:text-emerald-400">' +
              '<span class="underline-offset-4 hover:underline">' + escHtml(row.name) + '</span>' +
              '<span class="text-xs mono text-slate-600 dark:text-neutral-400 font-normal">ID: ' + escHtml(row.id + badgePart) + '</span>' +
            '</a>' +
          '</th>' +
          '<td class="px-4 py-3 text-right mono tabular whitespace-nowrap text-slate-800 dark:text-neutral-200">' + Number(row.teams).toLocaleString() + '</td>' +
          '<td class="px-4 py-3 text-right mono tabular whitespace-nowrap ' + poolClass + '">' + poolText + '</td>' +
          '<td class="px-4 py-3 min-w-[220px] max-w-[300px] text-slate-700 dark:text-neutral-300">' + escHtml(modulesText) + '</td>' +
          '<td class="px-4 py-3 text-right mono tabular whitespace-nowrap font-medium text-slate-900 dark:text-white">' + Number(row.views || 0).toLocaleString() + '</td>' +
          '<td class="px-4 py-3 text-right mono tabular whitespace-nowrap">' +
            '<div class="font-medium text-emerald-700 dark:text-emerald-400">' + escHtml(avgTimeText) + '</div>' +
            '<div class="text-xs text-slate-600 dark:text-neutral-400">' + escHtml(vptText) + '</div>' +
          '</td>' +
          '<td class="px-4 py-2.5 whitespace-nowrap">' + getLifecycleBadgeHtml(row, lang) + '</td>' +
          '<td class="px-4 py-2.5 text-right whitespace-nowrap">' +
            '<button type="button" data-manage-league-id="' + escHtml(row.id) + '" class="min-h-[42px] px-3.5 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-800 dark:text-neutral-200 hover:border-emerald-500/50 hover:text-emerald-700 dark:hover:text-emerald-300 whitespace-nowrap transition-colors">' + escHtml(manageText) + '</button>' +
          '</td>' +
        '</tr>';
      }).join('');
    }

    function sortLeagueTable(key) {
      if (currentSortKey === key) {
        currentSortDir = currentSortDir === 'desc' ? 'asc' : 'desc';
      } else {
        currentSortKey = key;
        currentSortDir = (key === 'name' || key === 'status') ? 'asc' : 'desc';
      }
      renderLeagueTable();
      if (typeof renderLifecycleActionPanel === 'function' && selectedLifecycleLeagueId) {
        renderLifecycleActionPanel();
      }
    }

    // =========================================================================
    // 3. INTERACTIVE SVG CHART RENDERER (24H CONCURRENCY & 7D VOLUME)
    // =========================================================================
    function canPlaceSvgLabel(placedList, centerX, y, textStr, charWidth, minGap, verticalBand) {
      const halfW = (String(textStr || '').length * (charWidth || 6.6)) / 2;
      const gap = typeof minGap === 'number' ? minGap : 4;
      const vBand = typeof verticalBand === 'number' ? verticalBand : 15;
      const left = centerX - halfW - gap;
      const right = centerX + halfW + gap;
      for (let i = 0; i < placedList.length; i++) {
        const p = placedList[i];
        if (Math.abs(p.y - y) < vBand && left < p.right && right > p.left) {
          return false;
        }
      }
      placedList.push({ left: centerX - halfW, right: centerX + halfW, y });
      return true;
    }

    function renderTrafficChart() {
      const svg = document.getElementById('trafficSvgChart');
      if (!svg) return;
      const lang = getLang();
      const isDark = document.documentElement.classList.contains('dark');
      const gridColor = isDark ? '#282e3d' : '#e2e8f0';
      const labelColor = isDark ? '#a3a3a3' : '#475569';
      const normalBarColor = isDark ? '#525252' : '#94a3b8';
      const peakBarColor = '#10b981';

      const titleEl = document.getElementById('trafficChartTitle');
      const subEl = document.getElementById('trafficChartSub');
      const calloutEl = document.getElementById('chartPeakCallout');
      const yAxisEl = document.getElementById('trafficYAxisUnit');
      const xAxisEl = document.getElementById('trafficXAxisUnit');
      const dict = I18N[lang];

      if (currentChartMode === 'hourly') {
        if (titleEl) titleEl.textContent = dict.chart_title_hourly;
        if (subEl) subEl.textContent = dict.chart_sub_hourly;
        if (yAxisEl) yAxisEl.textContent = lang === 'en'
          ? 'Y-Axis: Real Recorded Visits (7d Sum)'
          : 'แกนตั้ง (Y): จำนวนการเข้าชมจริง (รวม 7 วัน)';
        if (xAxisEl) xAxisEl.textContent = lang === 'en'
          ? 'X-Axis: Time of Day (ICT)'
          : 'แกนนอน (X): ช่วงเวลาในวัน (เวลาไทย · น.)';

        const series24 = (Array.isArray(HOURLY_SERIES) && HOURLY_SERIES.length === 24)
          ? HOURLY_SERIES
          : Array.from({ length: 24 }, (_, idx) => ({ hour: String(idx).padStart(2, '0') + ':00', count: 0, pct: 0, peak: false }));
        const maxHourlyCount = Math.max(...series24.map((pt) => Number(pt.count || 0)), 0);

        if (maxHourlyCount === 0) {
          if (calloutEl) calloutEl.textContent = lang === 'en'
            ? 'No hourly visit data recorded in Cloudflare D1 over the past 7 days yet.'
            : 'ยังไม่มีข้อมูลทราฟฟิกรายชั่วโมงใน Cloudflare D1 รอบ 7 วันล่าสุด';
          svg.innerHTML = '<text x="340" y="110" text-anchor="middle" fill="' + labelColor + '" font-size="12" font-family="sans-serif">' +
            escHtml(lang === 'en' ? 'Waiting for live D1 visit events…' : 'ยังไม่มีข้อมูลทราฟฟิกรายชั่วโมงในรอบ 7 วัน (รอ Beacon จริง)') +
            '</text>';
          return;
        }

        const peakPt = series24.reduce((best, cur) => (Number(cur.count || 0) > Number(best.count || 0) ? cur : best), series24[0]);
        const peakCount = Number(peakPt.count || 0);
        if (calloutEl) calloutEl.textContent = lang === 'en'
          ? ('Peak Hour: ' + peakPt.hour + ' ICT (' + peakCount.toLocaleString() + ' visits · ' + (peakPt.pct || 100) + '%)')
          : ('ชั่วโมงพีคสูงสุด: ' + peakPt.hour + ' น. (' + peakCount.toLocaleString() + ' ครั้ง · ' + (peakPt.pct || 100) + '%)');

        const chartLeft = 44;
        const chartRight = 668;
        const chartTop = 22;
        const chartBottom = 184;
        const chartHeight = chartBottom - chartTop;
        const stepX = (chartRight - chartLeft) / series24.length;
        const barWidth = Math.max(10, stepX - 7);

        let html = '';
        [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
          const val = Math.round(maxHourlyCount * ratio);
          const y = chartBottom - ratio * chartHeight;
          html += '<line x1="' + chartLeft + '" y1="' + y + '" x2="' + chartRight + '" y2="' + y + '" stroke="' + gridColor + '" stroke-dasharray="3 3" stroke-width="1" />';
          html += '<text x="2" y="' + (y + 4) + '" fill="' + labelColor + '" font-size="10" font-family="JetBrains Mono, monospace">' + val.toLocaleString() + '</text>';
        });

        const placedTopLabels = [];
        const placedXLabels = [];
        const trafficPoints = series24.map((pt, idx) => {
          const cnt = Number(pt.count || 0);
          const pct = Number(pt.pct != null ? pt.pct : Math.round((cnt / maxHourlyCount) * 100));
          const x = chartLeft + idx * stepX + 3;
          const center = x + barWidth / 2;
          const barH = cnt > 0 ? Math.max(4, (cnt / maxHourlyCount) * chartHeight) : 2;
          const y = chartBottom - barH;
          return {
            pt: { ...pt, count: cnt, pct },
            idx,
            x,
            center,
            barH,
            y,
            labelY: Math.max(12, y - 5),
            topText: String(cnt),
            isPeak: pt.hour === peakPt.hour && cnt > 0,
            showTop: false,
          };
        });

        trafficPoints
          .filter((item) => item.pt.count > 0 && (item.isPeak || item.pt.pct >= 75))
          .sort((a, b) => (b.pt.count - a.pt.count) || (a.idx - b.idx))
          .forEach((item) => {
            if (canPlaceSvgLabel(placedTopLabels, item.center, item.labelY, item.topText, 6.6, 5, 15)) {
              item.showTop = true;
            }
          });

        trafficPoints.forEach((item) => {
          const { pt, idx, x, center, barH, y } = item;
          const fill = pt.count > 0 && (item.isPeak || pt.peak) ? peakBarColor : normalBarColor;
          const tip = lang === 'en'
            ? (pt.hour + ' ICT: ' + pt.count.toLocaleString() + ' visits (' + pt.pct + '% of peak)')
            : ('เวลา ' + pt.hour + ' น. · ' + pt.count.toLocaleString() + ' ครั้ง (' + pt.pct + '% ของจุดพีค)');
          html += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barWidth.toFixed(1) + '" height="' + barH.toFixed(1) + '" rx="3" fill="' + fill + '">' +
            '<title>' + escHtml(tip) + '</title></rect>';

          if (item.showTop) {
            html += '<text x="' + center.toFixed(1) + '" y="' + item.labelY.toFixed(1) + '" text-anchor="middle" fill="' + peakBarColor + '" font-size="9.5" font-weight="600" font-family="JetBrains Mono, monospace">' + escHtml(item.topText) + '</text>';
          }

          if ((idx % 3 === 0 && idx !== 21) || idx === 22) {
            const xLabel = pt.hour.slice(0, 2) + (lang === 'en' ? 'h' : ':00');
            if (canPlaceSvgLabel(placedXLabels, center, 206, xLabel, 6.6, 8, 16)) {
              html += '<text x="' + center.toFixed(1) + '" y="206" text-anchor="middle" fill="' + labelColor + '" font-size="10" font-family="JetBrains Mono, monospace">' + xLabel + '</text>';
            }
          }
        });

        svg.innerHTML = html;
      } else {
        if (titleEl) titleEl.textContent = dict.chart_title_daily;
        if (subEl) subEl.textContent = dict.chart_sub_daily;
        if (yAxisEl) yAxisEl.textContent = lang === 'en'
          ? 'Y-Axis: Website Visits (visits/day)'
          : 'แกนตั้ง (Y): ปริมาณการเข้าชมเว็บ (ครั้ง/วัน)';
        if (xAxisEl) xAxisEl.textContent = lang === 'en'
          ? 'X-Axis: Day of Week (Last 7 Days)'
          : 'แกนนอน (X): วันในสัปดาห์ (ย้อนหลัง 7 วัน)';

        const days = Array.isArray(DAILY_SERIES) ? DAILY_SERIES : [];
        const maxDailyVisits = Math.max(...days.map((d) => Number(d.visits || 0)), 0);
        if (!days.length || maxDailyVisits === 0) {
          if (calloutEl) calloutEl.textContent = lang === 'en'
            ? 'No daily visit data recorded over the past 7 days yet.'
            : 'ยังไม่มีข้อมูลการเข้าชมรายวันในรอบ 7 วันล่าสุด (D1)';
          svg.innerHTML = '<text x="340" y="110" text-anchor="middle" fill="' + labelColor + '" font-size="12" font-family="sans-serif">' +
            escHtml(lang === 'en' ? 'Waiting for daily visit records in D1…' : 'ยังไม่มีข้อมูลการเข้าชมรายวันในรอบ 7 วัน') +
            '</text>';
          return;
        }

        if (calloutEl) calloutEl.textContent = lang === 'en'
          ? 'Peak Day (7d): ' + maxDailyVisits.toLocaleString() + ' visits/day'
          : 'พีคสูงสุด (7 วัน): ' + maxDailyVisits.toLocaleString() + ' ครั้ง/วัน';

        const chartLeft = 52;
        const chartRight = 660;
        const chartTop = 24;
        const chartBottom = 184;
        const chartHeight = chartBottom - chartTop;
        const stepX = (chartRight - chartLeft) / days.length;
        const barWidth = Math.min(48, stepX - 24);
        const unitSuffix = lang === 'en' ? ' visits' : ' ครั้ง';

        let html = '';
        [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
          const val = Math.round(maxDailyVisits * ratio);
          const y = chartBottom - ratio * chartHeight;
          html += '<line x1="' + chartLeft + '" y1="' + y + '" x2="' + chartRight + '" y2="' + y + '" stroke="' + gridColor + '" stroke-dasharray="3 3" stroke-width="1" />';
          html += '<text x="2" y="' + (y + 4) + '" fill="' + labelColor + '" font-size="10" font-family="JetBrains Mono, monospace">' + val.toLocaleString() + '</text>';
        });

        days.forEach((pt, idx) => {
          const cnt = Number(pt.visits || 0);
          const center = chartLeft + idx * stepX + stepX / 2;
          const x = center - barWidth / 2;
          const barH = cnt > 0 ? Math.max(6, (cnt / maxDailyVisits) * chartHeight) : 2;
          const y = chartBottom - barH;
          const fill = cnt === maxDailyVisits || pt.peak ? peakBarColor : normalBarColor;
          const label = lang === 'en' ? (pt.dayEn || '-') : (pt.dayTh || '-');
          const tip = label + ': ' + cnt.toLocaleString() + (lang === 'en' ? ' visits/day' : ' ครั้ง/วัน');

          html += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barWidth.toFixed(1) + '" height="' + barH.toFixed(1) + '" rx="4" fill="' + fill + '">' +
            '<title>' + escHtml(tip) + '</title></rect>';
          html += '<text x="' + center.toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" fill="' + labelColor + '" font-size="10" font-weight="600" font-family="JetBrains Mono, monospace">' + cnt.toLocaleString() + unitSuffix + '</text>';
          html += '<text x="' + center.toFixed(1) + '" y="206" text-anchor="middle" fill="' + labelColor + '" font-size="11" font-family="JetBrains Mono, monospace">' + escHtml(label) + '</text>';
        });

        svg.innerHTML = html;
      }
    }

    function switchChartMode(mode) {
      currentChartMode = mode === 'daily' ? 'daily' : 'hourly';
      const btnH = document.getElementById('btnChartHourly');
      const btnD = document.getElementById('btnChartDaily');
      const activeCls = 'min-h-[44px] px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs font-medium text-emerald-800 dark:text-emerald-300 whitespace-nowrap shrink-0 transition-colors';
      const inactiveCls = 'min-h-[44px] px-4 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0 transition-colors';
      if (btnH) btnH.className = currentChartMode === 'hourly' ? activeCls : inactiveCls;
      if (btnD) btnD.className = currentChartMode === 'daily' ? activeCls : inactiveCls;
      renderTrafficChart();
    }

    function renderMonitorSummary() {
      const lang = getLang();
      const dict = I18N[lang];
      const s24 = MONITOR_STATE.summary_24h || {};
      const s7 = MONITOR_STATE.summary_7d || {};
      const sh = MONITOR_STATE.sync_health || { status: 'unknown', age_minutes: null, expected_interval_min: null };
      const activeSummary = currentMonitorMode === '7d' ? s7 : s24;

      let overallStatus = (s24.status === 'incident' || s7.status === 'incident')
        ? 'incident'
        : ((s24.status === 'warning' || s7.status === 'warning') ? 'warning' : 'healthy');
      if (sh.status === 'incident') overallStatus = 'incident';
      else if (sh.status === 'stale' && overallStatus === 'healthy') overallStatus = 'warning';

      const syncBanner = document.getElementById('monitorSyncHealthBanner');
      if (syncBanner) {
        const ageTxt = typeof sh.age_minutes === 'number'
          ? (sh.age_minutes >= 60
              ? (Math.floor(sh.age_minutes / 60) + (lang === 'en' ? 'h ' : ' ชม. ') + (sh.age_minutes % 60) + (lang === 'en' ? 'm' : ' นาที'))
              : (sh.age_minutes + (lang === 'en' ? 'm' : ' นาที')))
          : '—';
        const cadenceTxt = sh.is_matchday_cadence === true
          ? (lang === 'en' ? 'Matchday Cadence (Fri–Mon · 60m)' : 'ตารางวันแข่ง (ศ.–จ. · ทุก 60 นาที)')
          : (sh.is_matchday_cadence === false
              ? (lang === 'en' ? 'Weekday Cadence (Tue–Thu · 240m)' : 'ตารางวันธรรมดา (อ.–พฤ. · ทุก 4 ชม.)')
              : (lang === 'en' ? 'Auto Cron Schedule' : 'ตารางซิงก์อัตโนมัติ'));
        let cls = 'p-3.5 rounded-xl border text-xs mono flex flex-wrap items-center justify-between gap-2 ';
        let msg = '';
        if (sh.status === 'healthy') {
          cls += 'border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
          msg = lang === 'en'
            ? ('✓ GitHub Actions Sync Fresh (' + ageTxt + ' ago · Expected ≤ ' + (sh.expected_interval_min || 60) + 'm)')
            : ('✓ ซิงก์ GitHub Actions สดใหม่ (ซิงก์เมื่อ ' + ageTxt + ' ก่อน · รอบปกติทุก ' + (sh.expected_interval_min || 60) + ' นาที)');
        } else if (sh.status === 'stale') {
          cls += 'border-amber-500/35 bg-amber-500/10 text-amber-800 dark:text-amber-300';
          msg = lang === 'en'
            ? ('⚠ Sync Delayed (' + ageTxt + ' ago > ' + (sh.stale_threshold_min || 150) + 'm threshold)')
            : ('⚠ ซิงก์ล่าช้ากว่ากำหนด (' + ageTxt + ' ก่อน · เกณฑ์ ' + (sh.stale_threshold_min || 150) + ' นาที)');
        } else if (sh.status === 'incident') {
          cls += 'border-rose-500/40 bg-rose-500/10 text-rose-800 dark:text-rose-300';
          msg = lang === 'en'
            ? ('⚠ Sync Stale Alert (' + ageTxt + ' ago >= ' + (sh.incident_threshold_min || 240) + 'm — Check GitHub Actions)')
            : ('⚠ ซิงก์หยุดค้าง (' + ageTxt + ' ก่อน · เกิน ' + (sh.incident_threshold_min || 240) + ' นาที — ควรตรวจสอบ GitHub Actions)');
        } else {
          cls += 'border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300';
          msg = lang === 'en' ? 'Sync Freshness: Waiting for admin_summary timestamp…' : 'ความสดใหม่การซิงก์: รอ Timestamp ล่าสุด…';
        }
        syncBanner.className = cls;
        const leftSpan = document.createElement('span');
        leftSpan.textContent = msg;
        const rightSpan = document.createElement('span');
        rightSpan.className = 'opacity-80';
        rightSpan.textContent = cadenceTxt;
        syncBanner.replaceChildren(leftSpan, rightSpan);
      }

      const badge = document.getElementById('monitorOverallBadge');
      const badgeText = document.getElementById('monitorOverallBadgeText');
      if (badge && badgeText) {
        const dot = badge.querySelector('span:first-child');
        if (overallStatus === 'healthy') {
          badge.className = 'inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-300 shrink-0 whitespace-nowrap';
          if (dot) dot.className = 'w-2 h-2 rounded-full bg-emerald-500';
          badgeText.textContent = dict.mon_status_healthy;
        } else if (overallStatus === 'warning') {
          badge.className = 'inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-300 shrink-0 whitespace-nowrap';
          if (dot) dot.className = 'w-2 h-2 rounded-full bg-amber-500';
          badgeText.textContent = dict.mon_status_warning;
        } else {
          badge.className = 'inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-xs font-medium text-rose-700 dark:text-rose-300 shrink-0 whitespace-nowrap';
          if (dot) dot.className = 'w-2 h-2 rounded-full bg-rose-500 animate-pulse';
          badgeText.textContent = dict.mon_status_incident;
        }
      }

      const up24El = document.getElementById('mon24hUptime');
      const sub24El = document.getElementById('mon24hSub');
      if (up24El) {
        up24El.textContent = (s24.uptime_pct || '100.00') + '%';
        up24El.className = 'text-2xl font-semibold mono tabular ' + (s24.total_errors > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400');
      }
      if (sub24El) {
        sub24El.textContent = lang === 'en'
          ? (Number(s24.total_errors || 0).toLocaleString() + ' errors across ' + Number(s24.activity_count || 0).toLocaleString() + ' events')
          : ('พบ ' + Number(s24.total_errors || 0).toLocaleString() + ' Error จากกิจกรรม ' + Number(s24.activity_count || 0).toLocaleString() + ' ครั้ง');
      }

      const up7El = document.getElementById('mon7dUptime');
      const sub7El = document.getElementById('mon7dSub');
      if (up7El) {
        up7El.textContent = (s7.uptime_pct || '100.00') + '%';
        up7El.className = 'text-2xl font-semibold mono tabular ' + (s7.total_errors > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400');
      }
      if (sub7El) {
        sub7El.textContent = lang === 'en'
          ? (Number(s7.total_errors || 0).toLocaleString() + ' errors across ' + Number(s7.activity_count || 0).toLocaleString() + ' events')
          : ('พบ ' + Number(s7.total_errors || 0).toLocaleString() + ' Error จากกิจกรรม ' + Number(s7.activity_count || 0).toLocaleString() + ' ครั้ง');
      }

      const cliEl = document.getElementById('monClientErrTotal');
      const upErrEl = document.getElementById('monUpstreamErrTotal');
      const cliCount = Number(activeSummary.client_errors || 0);
      const upCount = Number(activeSummary.upstream_errors || 0);
      if (cliEl) {
        cliEl.textContent = cliCount.toLocaleString();
        cliEl.className = 'text-2xl font-semibold mono tabular ' + (cliCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white');
      }
      if (upErrEl) {
        upErrEl.textContent = upCount.toLocaleString();
        upErrEl.className = 'text-2xl font-semibold mono tabular ' + (upCount > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white');
      }

      const anomalyListEl = document.getElementById('monitorAnomalyList');
      if (anomalyListEl) {
        const anomalies = currentMonitorMode === '7d'
          ? (MONITOR_STATE.anomaly_windows_7d || [])
          : (MONITOR_STATE.anomaly_windows_24h || []);
        if (anomalies.length === 0) {
          anomalyListEl.innerHTML =
            '<div class="p-3 rounded-lg border border-emerald-500/25 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 leading-relaxed">' +
            (lang === 'en'
              ? 'No errors or abnormal windows recorded in this period. All services ran normally.'
              : '✓ ไม่พบ Error หรือช่วงเวลาที่ทำงานผิดปกติในช่วงนี้ — ระบบทำงานเรียบร้อยดี 100%') +
            '</div>';
        } else {
          anomalyListEl.innerHTML = anomalies.slice().reverse().slice(0, 6).map((item) => {
            const whenLabel = currentMonitorMode === '7d'
              ? escHtml(item.date || '-')
              : (escHtml(item.label || '-') + (lang === 'en' ? ' ICT' : ' น.') + (item.utc_date ? ' (' + escHtml(item.utc_date) + ')' : ''));
            const sevCls = item.status === 'incident'
              ? 'border-rose-500/30 bg-rose-500/10 text-rose-800 dark:text-rose-300'
              : 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300';
            const cErrNum = Number(item.client_errors || 0);
            const uErrNum = Number(item.upstream_errors || 0);
            const isMinorClientHiccup = item.status === 'warning' && uErrNum === 0 && cErrNum > 0 && cErrNum <= 2;
            const detailText = lang === 'en'
              ? (isMinorClientHiccup
                  ? (cErrNum + ' minor client hiccup(s) (likely mobile network/tab switch) · 0 FPL upstream errors')
                  : (cErrNum + ' web errors · ' + uErrNum + ' FPL upstream errors'))
              : (isMinorClientHiccup
                  ? ('ฝั่งผู้ใช้ ' + cErrNum + ' ครั้ง (อาการสะดุดเฉพาะเครื่อง/เน็ตมือถือ) · เว็บ FPL ต้นทาง 0 ครั้ง')
                  : ('ฝั่งผู้ใช้ ' + cErrNum + ' ครั้ง · เว็บ FPL ต้นทาง ' + uErrNum + ' ครั้ง'));
            return '<div class="flex items-center justify-between gap-2 p-2.5 rounded-lg border ' + sevCls + '">' +
              '<div class="font-medium mono">' + whenLabel + '</div>' +
              '<div>' + escHtml(detailText) + '</div>' +
              '</div>';
          }).join('');
        }
      }

      const breakdownEl = document.getElementById('monitorCategoryBreakdown');
      if (breakdownEl) {
        const cats = MONITOR_STATE.error_categories_7d || {};
        const items = [
          { key: 'js_error', val: Number(cats.js_error || 0), labelTh: 'สคริปต์หน้าเว็บ/ชำระเงิน (JS Error)', labelEn: 'Frontend JS Exception' },
          { key: 'api_timeout', val: Number(cats.api_timeout || 0), labelTh: 'เชื่อมต่อช้าเกินกำหนด (Timeout)', labelEn: 'API Request Timeout' },
          { key: 'api_http', val: Number(cats.api_http || 0), labelTh: 'ดึงคะแนนสดไม่สำเร็จ (Live API)', labelEn: 'Live Edge Fetch Failure' },
          { key: 'data_load', val: Number(cats.data_load || 0), labelTh: 'เปิดดูข้อมูลทีมไม่ขึ้น (Picks Load)', labelEn: 'Squad Picks Load Failure' },
          { key: 'upstream_5xx', val: Number(cats.upstream_5xx || 0), labelTh: 'เว็บ FPL ต้นทางล่ม (5xx / Picks)', labelEn: 'Upstream FPL 5xx / Picks' },
          { key: 'upstream_fixtures', val: Number(cats.upstream_fixtures || 0), labelTh: 'ตารางแข่ง FPL ต้นทางขัดข้อง (Fixtures)', labelEn: 'Upstream Fixtures Error' }
        ];
        const totalCatErr = items.reduce((s, x) => s + x.val, 0);
        if (totalCatErr === 0) {
          breakdownEl.innerHTML =
            '<div class="p-3 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-slate-600 dark:text-neutral-400 leading-relaxed">' +
            (lang === 'en'
              ? '0 errors recorded across all 6 categories during the past 7 days.'
              : 'ยังไม่มี Error สะสมในทั้ง 6 หมวดหมู่ตลอด 7 วันที่ผ่านมา') +
            '</div>';
        } else {
          breakdownEl.innerHTML = items.map((c) => {
            const pct = Math.round((c.val / totalCatErr) * 100);
            const barColor = c.val > 0 ? 'bg-rose-500' : 'bg-slate-400/30 dark:bg-neutral-700';
            return '<div class="space-y-1">' +
              '<div class="flex items-center justify-between text-xs">' +
                '<span class="text-slate-700 dark:text-neutral-300">' + escHtml(lang === 'en' ? c.labelEn : c.labelTh) + '</span>' +
                '<span class="mono font-medium text-slate-900 dark:text-white">' + c.val.toLocaleString() + ' (' + pct + '%)</span>' +
              '</div>' +
              '<div class="w-full h-1.5 rounded-full bg-raisedLight dark:bg-raisedDark overflow-hidden">' +
                '<div class="h-full rounded-full ' + barColor + '" style="width:' + Math.max(c.val > 0 ? 4 : 0, pct) + '%"></div>' +
              '</div>' +
            '</div>';
          }).join('');
        }
      }
    }

    function renderMonitorChart() {
      const svg = document.getElementById('monitorSvgChart');
      if (!svg) return;
      const lang = getLang();
      const dict = I18N[lang];
      const isDark = document.documentElement.classList.contains('dark');
      const gridColor = isDark ? '#282e3d' : '#e2e8f0';
      const labelColor = isDark ? '#a3a3a3' : '#475569';
      const okBarColor = '#10b981';
      const idleBarColor = isDark ? '#334155' : '#cbd5e1';
      const errBarColor = '#f43f5e';

      const titleEl = document.getElementById('monitorChartTitle');
      const subEl = document.getElementById('monitorChartSub');
      const calloutEl = document.getElementById('monitorWindowCallout');
      const yAxisEl = document.getElementById('monitorYAxisUnit');
      const xAxisEl = document.getElementById('monitorXAxisUnit');
      const series = currentMonitorMode === '7d' ? (MONITOR_STATE.series_7d || []) : (MONITOR_STATE.series_24h || []);
      const anomalies = currentMonitorMode === '7d' ? (MONITOR_STATE.anomaly_windows_7d || []) : (MONITOR_STATE.anomaly_windows_24h || []);

      if (titleEl) titleEl.textContent = currentMonitorMode === '7d' ? dict.mon_chart_title_7d : dict.mon_chart_title_24h;
      if (subEl) subEl.textContent = currentMonitorMode === '7d' ? dict.mon_chart_sub_7d : dict.mon_chart_sub_24h;
      if (yAxisEl) {
        yAxisEl.textContent = currentMonitorMode === '7d'
          ? (lang === 'en' ? 'Y-Axis: Real Events & Errors (count/day)' : 'แกนตั้ง (Y): จำนวนเหตุการณ์ใช้งานจริง & Error (ครั้ง/วัน)')
          : (lang === 'en' ? 'Y-Axis: Real Events & Errors (count/hr)' : 'แกนตั้ง (Y): จำนวนเหตุการณ์ใช้งานจริง & Error (ครั้ง/ชม.)');
      }
      if (xAxisEl) {
        xAxisEl.textContent = currentMonitorMode === '7d'
          ? (lang === 'en' ? 'X-Axis: Date (Last 7 Days)' : 'แกนนอน (X): วันที่ (ย้อนหลัง 7 วัน)')
          : (lang === 'en' ? 'X-Axis: Last 24 Hours (ICT)' : 'แกนนอน (X): ช่วงเวลา 24 ชม. ล่าสุด (เวลาไทย · น.)');
      }
      if (calloutEl) {
        if (anomalies.length === 0) {
          calloutEl.className = 'mono text-emerald-700 dark:text-emerald-400 font-medium';
          calloutEl.textContent = lang === 'en' ? '0 Anomaly Windows Detected' : 'ไม่มีช่วงเวลาผิดปกติ (ปกติ 100%)';
        } else {
          calloutEl.className = 'mono text-rose-600 dark:text-rose-400 font-medium';
          calloutEl.textContent = lang === 'en'
            ? (anomalies.length + ' Window(s) with Errors')
            : ('พบความผิดปกติ ' + anomalies.length + ' ช่วงเวลา');
        }
      }

      if (series.length === 0) {
        svg.innerHTML = '';
        return;
      }

      const maxVal = Math.max(
        10,
        ...series.map((d) => Math.max(Number(d.activity || 0), Number(d.total_errors || 0) * 4))
      );

      const chartLeft = 46;
      const chartRight = 666;
      const chartTop = 24;
      const chartBottom = 184;
      const chartHeight = chartBottom - chartTop;
      const stepX = (chartRight - chartLeft) / series.length;
      const barWidth = currentMonitorMode === '7d' ? Math.min(48, stepX - 24) : Math.max(10, stepX - 7);
      const okUnit = lang === 'en' ? ' ok' : ' ครั้ง';

      let html = '';
      [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
        const val = Math.round(maxVal * ratio);
        const y = chartBottom - ratio * chartHeight;
        html += '<line x1="' + chartLeft + '" y1="' + y + '" x2="' + chartRight + '" y2="' + y + '" stroke="' + gridColor + '" stroke-dasharray="3 3" stroke-width="1" />';
        html += '<text x="2" y="' + (y + 4) + '" fill="' + labelColor + '" font-size="10" font-family="JetBrains Mono, monospace">' + val.toLocaleString() + '</text>';
      });

      const thDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
      const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const placedTopLabels = [];
      const placedXLabels = [];

      const monitorPoints = series.map((pt, idx) => {
        const act = Number(pt.activity || 0);
        const errCount = Number(pt.total_errors || 0);
        const center = chartLeft + idx * stepX + stepX / 2;
        const x = center - barWidth / 2;
        const actH = act > 0 ? Math.max(6, (act / maxVal) * chartHeight) : 4;
        const actY = chartBottom - actH;
        const errH = errCount > 0 ? Math.max(12, Math.min(chartHeight, ((errCount * 4) / maxVal) * chartHeight)) : 0;
        const errY = errCount > 0 ? chartBottom - errH : chartBottom;

        let xLabel = '';
        if (currentMonitorMode === '7d') {
          if (pt.date) {
            const dt = new Date(pt.date + 'T12:00:00Z');
            const dow = Number.isNaN(dt.getTime()) ? 0 : dt.getUTCDay();
            xLabel = (lang === 'en' ? enDays[dow] : thDays[dow]) + ' ' + pt.date.slice(5);
          } else {
            xLabel = 'D' + (idx + 1);
          }
        } else {
          xLabel = String(pt.label || '').slice(0, 2) + (lang === 'en' ? 'h' : ':00');
        }

        const actLabelText = currentMonitorMode === '7d'
          ? (act.toLocaleString() + okUnit)
          : act.toLocaleString();
        const errLabelText = currentMonitorMode === '7d'
          ? ('!' + errCount + ' Err')
          : ('!' + errCount);

        return {
          pt,
          idx,
          act,
          errCount,
          center,
          x,
          actH,
          actY,
          errH,
          errY,
          actLabelY: Math.max(12, actY - 6),
          errLabelY: Math.max(10, errY - 14),
          actLabelText,
          errLabelText,
          xLabel,
          showErrLabel: false,
          showActLabel: false
        };
      });

      // Reserve error labels first (highest error count takes priority on collision)
      monitorPoints
        .filter((item) => item.errCount > 0)
        .sort((a, b) => b.errCount - a.errCount || a.idx - b.idx)
        .forEach((item) => {
          if (canPlaceSvgLabel(placedTopLabels, item.center, item.errLabelY, item.errLabelText, 6.6, 5, 16)) {
            item.showErrLabel = true;
          }
        });

      // Reserve normal-activity labels next (highest activity first, skip narrow collisions)
      monitorPoints
        .filter((item) => item.act > 0 && item.errCount === 0 && (currentMonitorMode === '7d' || item.act >= maxVal * 0.25))
        .sort((a, b) => b.act - a.act || a.idx - b.idx)
        .forEach((item) => {
          if (canPlaceSvgLabel(placedTopLabels, item.center, item.actLabelY, item.actLabelText, 6.6, 4, 15)) {
            item.showActLabel = true;
          }
        });

      monitorPoints.forEach((item) => {
        const { pt, idx, act, errCount, center, x, actH, actY, errH, errY, xLabel } = item;
        const barFill = act > 0 ? okBarColor : idleBarColor;

        const tooltipText = lang === 'en'
          ? ((pt.label || pt.date || '') + ' | Normal Events: ' + act.toLocaleString() + ' | Total Errors: ' + errCount +
             ' (User Web: ' + Number(pt.client_errors || 0) + ', Upstream FPL 5xx: ' + Number(pt.upstream_errors || 0) + ')')
          : ((pt.label ? (pt.label + ' น.') : (pt.date || '')) + ' | ใช้งานปกติ: ' + act.toLocaleString() + ' ครั้ง | Error รวม: ' + errCount +
             ' ครั้ง (ฝั่งผู้ใช้ ' + Number(pt.client_errors || 0) + ', เว็บ FPL ' + Number(pt.upstream_errors || 0) + ')');

        html += '<rect x="' + x.toFixed(1) + '" y="' + actY.toFixed(1) + '" width="' + barWidth.toFixed(1) + '" height="' + actH.toFixed(1) + '" rx="3" fill="' + barFill + '" opacity="' + (act > 0 ? '0.88' : '0.45') + '">' +
          '<title>' + escHtml(tooltipText) + '</title></rect>';

        if (item.showActLabel) {
          html += '<text x="' + center.toFixed(1) + '" y="' + item.actLabelY.toFixed(1) + '" text-anchor="middle" fill="' + labelColor + '" font-size="9.5" font-weight="600" font-family="JetBrains Mono, monospace">' + escHtml(item.actLabelText) + '</text>';
        }

        if (errCount > 0) {
          html += '<rect x="' + x.toFixed(1) + '" y="' + errY.toFixed(1) + '" width="' + barWidth.toFixed(1) + '" height="' + errH.toFixed(1) + '" rx="3" fill="' + errBarColor + '" opacity="0.95">' +
            '<title>' + escHtml(tooltipText) + '</title></rect>';
          html += '<circle cx="' + center.toFixed(1) + '" cy="' + Math.max(10, errY - 7).toFixed(1) + '" r="4" fill="' + errBarColor + '" />';
          if (item.showErrLabel) {
            html += '<text x="' + center.toFixed(1) + '" y="' + item.errLabelY.toFixed(1) + '" text-anchor="middle" fill="' + errBarColor + '" font-size="9" font-weight="600" font-family="JetBrains Mono, monospace">' + escHtml(item.errLabelText) + '</text>';
          }
        }

        if (currentMonitorMode === '7d' || idx % 3 === 0 || idx === series.length - 1) {
          if (canPlaceSvgLabel(placedXLabels, center, 206, xLabel, 6.6, 8, 16)) {
            html += '<text x="' + center.toFixed(1) + '" y="206" text-anchor="middle" fill="' + labelColor + '" font-size="' + (currentMonitorMode === '7d' ? '10' : '9.5') + '" font-family="JetBrains Mono, monospace">' + escHtml(xLabel) + '</text>';
          }
        }
      });

      svg.innerHTML = html;
    }

    function switchMonitorMode(mode) {
      currentMonitorMode = mode === '7d' ? '7d' : '24h';
      const btn24 = document.getElementById('btnMon24h');
      const btn7 = document.getElementById('btnMon7d');
      const activeCls = 'min-h-[44px] px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs font-medium text-emerald-800 dark:text-emerald-300 whitespace-nowrap shrink-0 transition-colors';
      const inactiveCls = 'min-h-[44px] px-4 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0 transition-colors';
      if (btn24) btn24.className = currentMonitorMode === '24h' ? activeCls : inactiveCls;
      if (btn7) btn7.className = currentMonitorMode === '7d' ? activeCls : inactiveCls;
      renderMonitorSummary();
      renderMonitorChart();
    }

    function renderDeviceCards() {
      const devWin = currentDeviceWindow === '7d'
        ? (DEVICES_STATE.w7 || DEVICES_STATE.w30)
        : (DEVICES_STATE.w30 || DEVICES_STATE.w7);
      if (!devWin) return;
      const lang = getLang();
      if (devWin.mobile) setMetricBar('deviceMobilePct', 'deviceMobileBar', devWin.mobile.pct);
      if (devWin.desktop) setMetricBar('deviceDesktopPct', 'deviceDesktopBar', devWin.desktop.pct);
      if (devWin.tablet) setMetricBar('deviceTabletPct', 'deviceTabletBar', devWin.tablet.pct);
      const winDays = Number(devWin.window_days || (currentDeviceWindow === '7d' ? 7 : 30));

      const devList = [
        {
          key: 'mobile',
          count: Number((devWin.mobile && devWin.mobile.count) || 0),
          pct: parseFloat((devWin.mobile && devWin.mobile.pct) || 0) || 0,
          badgeId: 'devMobileBadge',
          barId: 'deviceMobileBar',
          descId: 'devMobileDesc',
          descTh: 'เข้าชมจริง ' + Number((devWin.mobile && devWin.mobile.count) || 0).toLocaleString() + ' ครั้ง (' + winDays + ' วันล่าสุด) · หน้าจอมือถือ 375px–430px',
          descEn: Number((devWin.mobile && devWin.mobile.count) || 0).toLocaleString() + ' recorded visits (last ' + winDays + 'd) · Smartphone viewports 375px–430px',
        },
        {
          key: 'desktop',
          count: Number((devWin.desktop && devWin.desktop.count) || 0),
          pct: parseFloat((devWin.desktop && devWin.desktop.pct) || 0) || 0,
          badgeId: 'devDesktopBadge',
          barId: 'deviceDesktopBar',
          descId: 'devDesktopDesc',
          descTh: 'เข้าชมจริง ' + Number((devWin.desktop && devWin.desktop.count) || 0).toLocaleString() + ' ครั้ง (' + winDays + ' วันล่าสุด) · เปิดบนคอมพิวเตอร์/โน้ตบุ๊ก 1024px+',
          descEn: Number((devWin.desktop && devWin.desktop.count) || 0).toLocaleString() + ' recorded visits (last ' + winDays + 'd) · Desktop & laptop browsers 1024px+',
        },
        {
          key: 'tablet',
          count: Number((devWin.tablet && devWin.tablet.count) || 0),
          pct: parseFloat((devWin.tablet && devWin.tablet.pct) || 0) || 0,
          badgeId: 'devTabletBadge',
          barId: 'deviceTabletBar',
          descId: 'devTabletDesc',
          descTh: 'เข้าชมจริง ' + Number((devWin.tablet && devWin.tablet.count) || 0).toLocaleString() + ' ครั้ง (' + winDays + ' วันล่าสุด) · หน้าจอแท็บเล็ต 768px–1024px',
          descEn: Number((devWin.tablet && devWin.tablet.count) || 0).toLocaleString() + ' recorded visits (last ' + winDays + 'd) · Tablet viewports 768px–1024px',
        }
      ];
      const sortedDevs = devList.slice().sort((a, b) => (b.count - a.count) || (b.pct - a.pct));
      const rankByKey = new Map(sortedDevs.map((item, idx) => [item.key, idx + 1]));

      devList.forEach((item) => {
        const rank = rankByKey.get(item.key) || 3;
        const isTop = rank === 1;
        const badgeEl = document.getElementById(item.badgeId);
        const barEl = document.getElementById(item.barId);
        const descEl = document.getElementById(item.descId);

        if (badgeEl) {
          badgeEl.textContent = lang === 'en'
            ? (isTop ? ('#1 Top Device (' + winDays + 'd)') : ('Rank #' + rank + ' (' + winDays + 'd)'))
            : (isTop ? ('อันดับ 1 (' + winDays + ' วันล่าสุด)') : ('อันดับ ' + rank + ' (' + winDays + ' วันล่าสุด)'));
          badgeEl.className = isTop
            ? 'text-xs mono font-semibold text-emerald-700 dark:text-emerald-400'
            : 'text-xs mono text-slate-600 dark:text-neutral-400';
        }
        if (barEl) {
          barEl.className = (isTop ? 'bg-emerald-500' : 'bg-slate-600 dark:bg-neutral-400') + ' h-full rounded-full transition-all duration-300';
        }
        if (descEl) {
          descEl.textContent = lang === 'en' ? item.descEn : item.descTh;
        }
      });
    }

    function switchDeviceWindow(win) {
      currentDeviceWindow = win === '7d' ? '7d' : '30d';
      const btn7 = document.getElementById('btnDev7d');
      const btn30 = document.getElementById('btnDev30d');
      const activeCls = 'min-h-[44px] px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs font-medium text-emerald-800 dark:text-emerald-300 whitespace-nowrap shrink-0 transition-colors';
      const inactiveCls = 'min-h-[44px] px-4 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0 transition-colors';
      if (btn7) btn7.className = currentDeviceWindow === '7d' ? activeCls : inactiveCls;
      if (btn30) btn30.className = currentDeviceWindow === '30d' ? activeCls : inactiveCls;
      renderDeviceCards();
    }

    // =========================================================================
    // 4. LANGUAGE, THEME, CROSS-LEAGUE SWITCHER & LIVE SECTION RENDERERS
    // =========================================================================
    function formatTimeAgo(isoStr, lang) {
      const raw = typeof isoStr === 'string' ? isoStr.trim() : '';
      if (!raw) return '';
      const norm = /^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2}$/.test(raw)
        ? raw.replace(/\s+/, 'T') + '+07:00'
        : raw;
      const ms = Date.parse(norm);
      if (Number.isNaN(ms)) return '';
      const diffMin = Math.max(0, Math.round((Date.now() - ms) / 60000));
      if (diffMin < 1) return lang === 'en' ? '(just now)' : '(เมื่อสักครู่)';
      if (diffMin < 60) return lang === 'en' ? ('(' + diffMin + 'm ago)') : ('(' + diffMin + ' นาทีที่แล้ว)');
      const hrs = Math.floor(diffMin / 60);
      const mins = diffMin % 60;
      if (hrs < 48) {
        return lang === 'en'
          ? ('(' + hrs + 'h ' + mins + 'm ago)')
          : ('(' + hrs + ' ชม. ' + mins + ' นาทีที่แล้ว)');
      }
      const days = Math.floor(hrs / 24);
      return lang === 'en' ? ('(' + days + 'd ago)') : ('(' + days + ' วันที่แล้ว)');
    }

    function renderQuickLeagueOptions() {
      const sel = document.getElementById('quickLeagueSelect');
      if (!sel) return;
      const lang = getLang();
      const dict = I18N[lang] || I18N.th;
      const curVal = sel.value || '';

      const opts = [];
      const optPh = document.createElement('option');
      optPh.value = '';
      optPh.textContent = dict.nav_jump_placeholder || (lang === 'en' ? 'Quick Jump...' : 'ทางลัดเปิดหน้าเว็บ...');
      opts.push(optPh);

      const optLanding = document.createElement('option');
      optLanding.value = 'landing';
      optLanding.textContent = dict.nav_jump_landing || 'Landing Page (index.html)';
      opts.push(optLanding);

      const optPreview = document.createElement('option');
      optPreview.value = 'preview';
      optPreview.textContent = dict.nav_jump_preview || 'Showcase Demo Hub (preview.html)';
      opts.push(optPreview);

      (LEAGUE_PORTFOLIO || []).forEach((row) => {
        const o = document.createElement('option');
        o.value = String(row.id);
        const visTag = row.visibility === 'private' ? ' [Private]' : '';
        o.textContent = String(row.id) + ' · ' + String(row.name || row.id) + ' (' + Number(row.teams || 0).toLocaleString() + ')' + visTag;
        opts.push(o);
      });

      sel.replaceChildren(...opts);
      if (curVal && Array.from(sel.options).some((o) => o.value === curVal)) {
        sel.value = curVal;
      }
    }

    function renderFeatureAdoption(features, lang) {
      const listEl = document.getElementById('featureAdoptionList');
      const badgeEl = document.getElementById('featTotalHitsBadge');
      if (!listEl) return;
      const fObj = features || {};
      const items = Array.isArray(fObj.items) ? fObj.items : [];
      const totalHits = Number(fObj.total_interactions || 0);
      if (badgeEl) {
        badgeEl.textContent = totalHits.toLocaleString() + (lang === 'en' ? ' events (7d)' : ' ครั้ง (7 วัน)');
      }
      if (!items.length || totalHits === 0) {
        listEl.innerHTML = '<div class="py-6 text-center text-slate-600 dark:text-neutral-400">' +
          escHtml(lang === 'en'
            ? 'No feature tab or pitch modal events recorded in Cloudflare D1 during the past 7 days yet.'
            : 'ยังไม่มีการบันทึกสถิติการเปิดแท็บฟีเจอร์ใน Cloudflare D1 รอบ 7 วันล่าสุด') +
          '</div>';
        return;
      }
      listEl.innerHTML = items.map((item, idx) => {
        const pctNum = Math.max(0, Math.min(100, parseFloat(item.pct || 0) || 0));
        const label = lang === 'en' ? (item.label_en || item.key) : (item.label_th || item.key);
        const isFirst = idx === 0 && Number(item.count || 0) > 0;
        const barColor = isFirst ? 'bg-emerald-500' : (item.is_new ? 'bg-sky-500' : 'bg-slate-500 dark:bg-neutral-400');
        const newTag = item.is_new
          ? ' <span class="ml-1.5 px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30 text-[10px] mono">NEW</span>'
          : '';
        return '<div class="py-2.5 space-y-1.5">' +
          '<div class="flex items-baseline justify-between gap-2">' +
            '<span class="font-medium text-slate-900 dark:text-white">' + (idx + 1) + '. ' + escHtml(label) + newTag + '</span>' +
            '<span class="mono tabular text-xs shrink-0 font-semibold ' + (isFirst ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-800 dark:text-neutral-200') + '">' +
              Number(item.count || 0).toLocaleString() + ' (' + pctNum.toFixed(1) + '%)' +
            '</span>' +
          '</div>' +
          '<div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">' +
            '<div class="h-full rounded-full transition-all duration-300 ' + barColor + '" style="width:' + (Number(item.count || 0) > 0 ? Math.max(2, pctNum) : 0) + '%"></div>' +
          '</div>' +
        '</div>';
      }).join('');
    }

    function renderSegmentComparison(seg, lang) {
      const s = seg || {};
      const prize = s.prize_leagues || {};
      const comm = s.community_leagues || {};
      const multEl = document.getElementById('segMultiplierBadge');
      const pVptEl = document.getElementById('segPrizeVpt');
      const pMetaEl = document.getElementById('segPrizeMeta');
      const cVptEl = document.getElementById('segCommVpt');
      const cMetaEl = document.getElementById('segCommMeta');
      const topEl = document.getElementById('segTopPrizeDesc');
      const unitTxt = lang === 'en' ? ' visits/team' : ' ครั้ง/ทีม';

      if (pVptEl) pVptEl.textContent = Number(prize.visits_per_team_7d || 0).toFixed(1) + unitTxt;
      if (pMetaEl) {
        pMetaEl.textContent = lang === 'en'
          ? (Number(prize.leagues_count || 0) + ' leagues · ' + Number(prize.total_teams || 0).toLocaleString() + ' teams · ' + Number(prize.total_views_7d || 0).toLocaleString() + ' views (7d)')
          : (Number(prize.leagues_count || 0) + ' ลีก · ' + Number(prize.total_teams || 0).toLocaleString() + ' ทีม · ' + Number(prize.total_views_7d || 0).toLocaleString() + ' ครั้ง (7 วัน)');
      }
      if (cVptEl) cVptEl.textContent = Number(comm.visits_per_team_7d || 0).toFixed(1) + unitTxt;
      if (cMetaEl) {
        cMetaEl.textContent = lang === 'en'
          ? (Number(comm.leagues_count || 0) + ' leagues · ' + Number(comm.total_teams || 0).toLocaleString() + ' teams · ' + Number(comm.total_views_7d || 0).toLocaleString() + ' views (7d)')
          : (Number(comm.leagues_count || 0) + ' ลีก · ' + Number(comm.total_teams || 0).toLocaleString() + ' ทีม · ' + Number(comm.total_views_7d || 0).toLocaleString() + ' ครั้ง (7 วัน)');
      }
      if (multEl) {
        multEl.textContent = (typeof s.multiplier === 'number' && s.multiplier > 0)
          ? (s.multiplier.toFixed(1) + 'x')
          : '—';
      }
      if (topEl) {
        const top = s.top_prize_league;
        if (top && Number(top.views_7d || 0) > 0) {
          topEl.textContent = lang === 'en'
            ? ('Top active prize league (7d): "' + top.name + '" (' + top.id + ') — ' + Number(top.visits_per_team_7d || 0).toFixed(1) + ' visits/team (' + Number(top.views_7d || 0).toLocaleString() + ' views across ' + Number(top.teams || 0) + ' teams).')
            : ('ลีกเงินรางวัลที่เปิดดูต่อทีมสูงสุด (7 วัน): "' + top.name + '" (' + top.id + ') เฉลี่ย ' + Number(top.visits_per_team_7d || 0).toFixed(1) + ' ครั้ง/ทีม (' + Number(top.views_7d || 0).toLocaleString() + ' ครั้ง จาก ' + Number(top.teams || 0) + ' ทีม)');
        } else {
          topEl.textContent = lang === 'en'
            ? 'No 7-day prize-league views recorded in D1 yet.'
            : 'ยังไม่มีข้อมูลการเข้าชมของลีกเงินรางวัลในรอบ 7 วันล่าสุด';
        }
      }
    }

    function renderBrowserAndLocale(browsers, locale, geo, lang) {
      const bList = document.getElementById('browserDistributionList');
      const bTotalEl = document.getElementById('browserTotalBadge');
      const bObj = browsers || {};
      const bTotal = Number(bObj.total || 0);
      if (bTotalEl) {
        bTotalEl.textContent = bTotal.toLocaleString() + (lang === 'en' ? ' events (7d)' : ' ครั้ง (7 วัน)');
      }
      if (bList) {
        if (bTotal === 0) {
          bList.innerHTML = '<div class="py-4 text-center text-slate-600 dark:text-neutral-400">' +
            escHtml(lang === 'en' ? 'No browser User-Agent telemetry recorded in D1 (7d).' : 'ยังไม่มีข้อมูล User-Agent ในรอบ 7 วันล่าสุด (D1)') +
            '</div>';
        } else {
          const rows = [
            { key: 'line', data: bObj.line || {}, labelTh: 'LINE In-App Browser (ลิงก์ในกลุ่ม LINE)', labelEn: 'LINE In-App Browser', accent: 'bg-emerald-500' },
            { key: 'safari', data: bObj.safari || {}, labelTh: 'Safari (iOS / macOS)', labelEn: 'Safari (iOS / macOS)', accent: 'bg-sky-500' },
            { key: 'chrome', data: bObj.chrome || {}, labelTh: 'Chrome / Edge / Android Browser', labelEn: 'Chrome / Edge / Android', accent: 'bg-slate-600 dark:bg-neutral-400' },
            { key: 'fb', data: bObj.fb || {}, labelTh: 'Facebook / Messenger In-App', labelEn: 'Facebook / Messenger In-App', accent: 'bg-slate-500 dark:bg-neutral-500' },
            { key: 'other', data: bObj.other || {}, labelTh: 'เบราว์เซอร์อื่น / บอต (Other)', labelEn: 'Other Browsers', accent: 'bg-slate-400 dark:bg-neutral-600' }
          ];
          bList.innerHTML = rows.map((r) => {
            const cnt = Number(r.data.count || 0);
            const pct = Math.max(0, Math.min(100, parseFloat(r.data.pct || 0) || 0));
            return '<div class="space-y-1">' +
              '<div class="flex justify-between items-baseline gap-2">' +
                '<span class="font-medium text-slate-900 dark:text-white">' + escHtml(lang === 'en' ? r.labelEn : r.labelTh) + '</span>' +
                '<span class="mono tabular font-semibold text-slate-800 dark:text-neutral-200">' + cnt.toLocaleString() + ' (' + pct.toFixed(1) + '%)</span>' +
              '</div>' +
              '<div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">' +
                '<div class="h-full rounded-full transition-all duration-300 ' + r.accent + '" style="width:' + (cnt > 0 ? Math.max(2, pct) : 0) + '%"></div>' +
              '</div>' +
            '</div>';
          }).join('');
        }
      }

      const gObj = geo || {};
      const bkkPctEl = document.getElementById('geoBkkPct');
      const regPctEl = document.getElementById('geoRegPct');
      const intlPctEl = document.getElementById('geoIntlPct');
      const bkkCntEl = document.getElementById('geoBkkCount');
      const regCntEl = document.getElementById('geoRegCount');
      const intlCntEl = document.getElementById('geoIntlCount');
      if (bkkPctEl) bkkPctEl.textContent = (parseFloat((gObj.bkk_metro && gObj.bkk_metro.pct) || 0) || 0).toFixed(1) + '%';
      if (regPctEl) regPctEl.textContent = (parseFloat((gObj.regional && gObj.regional.pct) || 0) || 0).toFixed(1) + '%';
      if (intlPctEl) intlPctEl.textContent = (parseFloat((gObj.intl && gObj.intl.pct) || 0) || 0).toFixed(1) + '%';
      if (bkkCntEl) bkkCntEl.textContent = Number((gObj.bkk_metro && gObj.bkk_metro.count) || 0).toLocaleString() + ' hits';
      if (regCntEl) regCntEl.textContent = Number((gObj.regional && gObj.regional.count) || 0).toLocaleString() + ' hits';
      if (intlCntEl) intlCntEl.textContent = Number((gObj.intl && gObj.intl.count) || 0).toLocaleString() + ' hits';

      const locObj = locale || {};
      const locTotal = Number(locObj.total || 0);
      const thCnt = Number((locObj.th && locObj.th.count) || 0);
      const enCnt = Number((locObj.en && locObj.en.count) || 0);
      const thPct = parseFloat((locObj.th && locObj.th.pct) || 0) || 0;
      const enPct = parseFloat((locObj.en && locObj.en.pct) || 0) || 0;
      const splitEl = document.getElementById('geoLocaleSplit');
      const thBarEl = document.getElementById('localeThBar');
      const enBarEl = document.getElementById('localeEnBar');
      const locMetaEl = document.getElementById('localeCountsMeta');
      if (splitEl) {
        splitEl.textContent = locTotal > 0
          ? ('TH ' + thPct.toFixed(1) + '% · EN ' + enPct.toFixed(1) + '%')
          : (lang === 'en' ? 'Waiting for language signals…' : 'ยังไม่มีข้อมูลสลับภาษา (รอ Beacon)');
      }
      if (thBarEl) thBarEl.style.width = (locTotal > 0 ? thPct : 0) + '%';
      if (enBarEl) enBarEl.style.width = (locTotal > 0 ? enPct : 0) + '%';
      if (locMetaEl) {
        const thS = document.createElement('span');
        thS.textContent = 'TH: ' + thCnt.toLocaleString();
        const enS = document.createElement('span');
        enS.textContent = 'EN: ' + enCnt.toLocaleString();
        locMetaEl.replaceChildren(thS, enS);
      }

      const geoFoot = document.getElementById('geoEdgeFooter');
      if (geoFoot) {
        const colo = gObj.colo || 'EDGE';
        const gTot = Number(gObj.total || 0);
        geoFoot.textContent = gTot > 0
          ? ('Edge Colo: ' + colo + ' · ' + gTot.toLocaleString() + (lang === 'en' ? ' geo-tagged requests (7d)' : ' คำขอที่ระบุพื้นที่จริง (7 วัน)'))
          : ('Edge Colo: ' + colo + ' · ' + (lang === 'en' ? 'Local / No CF city header yet' : 'ยังไม่มี CF City Header จากผู้เข้าชมจริง'));
      }
    }

    function renderPeakWindows(pw, lang) {
      const obj = pw || {};
      const ev = obj.evening_matchday || {};
      const dy = obj.daytime_planning || {};
      const mo = obj.morning_settlement || {};
      const unit = lang === 'en' ? ' visits (7d)' : ' ครั้ง (7 วัน)';
      const ePct = document.getElementById('peakWinEveningPct');
      const eHits = document.getElementById('peakWinEveningHits');
      const dPct = document.getElementById('peakWinDaytimePct');
      const dHits = document.getElementById('peakWinDaytimeHits');
      const mPct = document.getElementById('peakWinMorningPct');
      const mHits = document.getElementById('peakWinMorningHits');
      if (ePct) ePct.textContent = (parseFloat(ev.pct || 0) || 0).toFixed(1) + '%';
      if (eHits) eHits.textContent = Number(ev.hits || 0).toLocaleString() + unit;
      if (dPct) dPct.textContent = (parseFloat(dy.pct || 0) || 0).toFixed(1) + '%';
      if (dHits) dHits.textContent = Number(dy.hits || 0).toLocaleString() + unit;
      if (mPct) mPct.textContent = (parseFloat(mo.pct || 0) || 0).toFixed(1) + '%';
      if (mHits) mHits.textContent = Number(mo.hits || 0).toLocaleString() + unit;
    }

    function renderPitchDeckLiveMetrics(et, portfolio, lang) {
      const seg = (et && et.features && et.features.segment_comparison) ? et.features.segment_comparison : {};
      const comm = seg.community_leagues || {};
      const prize = seg.prize_leagues || {};
      const top = seg.top_prize_league || null;
      const v1 = Number(comm.visits_per_team_7d || 0);
      const v2 = Number(prize.visits_per_team_7d || 0);
      const v3 = top ? Number(top.visits_per_team_7d || 0) : 0;
      const maxV = Math.max(v1, v2, v3, 0);
      const unit = lang === 'en' ? '/team (7d)' : '/ทีม (7d)';

      const bar1 = document.getElementById('g2Bar1');
      const val1 = document.getElementById('g2Val1');
      const bar2 = document.getElementById('g2Bar2');
      const val2 = document.getElementById('g2Val2');
      const bar3 = document.getElementById('g2Bar3');
      const val3 = document.getElementById('g2Val3');
      const multEl = document.getElementById('g2Mult');
      const g2Badge = document.getElementById('g2Badge');

      const setSvgW = (el, v) => {
        if (!el) return;
        const w = maxV > 0 && v > 0 ? Math.max(6, Math.round((v / maxV) * 230)) : 0;
        el.setAttribute('width', String(w));
      };
      setSvgW(bar1, v1);
      setSvgW(bar2, v2);
      setSvgW(bar3, v3);
      if (val1) val1.textContent = maxV > 0 ? (v1.toFixed(1) + unit) : '—';
      if (val2) val2.textContent = maxV > 0 ? (v2.toFixed(1) + unit) : '—';
      if (val3) val3.textContent = (top && maxV > 0) ? (v3.toFixed(1) + unit) : '—';
      if (g2Badge) {
        g2Badge.textContent = (typeof seg.multiplier === 'number' && seg.multiplier > 0)
          ? (seg.multiplier.toFixed(1) + 'x Higher')
          : 'Live D1';
      }
      if (multEl) {
        if (maxV === 0) {
          multEl.textContent = lang === 'en' ? 'Waiting for live 7-day visits in D1…' : 'รอข้อมูลทราฟฟิก 7 วันจาก D1…';
        } else if (typeof seg.multiplier === 'number' && seg.multiplier > 0) {
          multEl.textContent = lang === 'en'
            ? ('Prize leagues see ' + seg.multiplier.toFixed(1) + 'x more visits/team than community leagues (7d).')
            : ('ลีกเงินรางวัลมียอดเปิดดูต่อทีมสูงกว่าลีกทั่วไป ' + seg.multiplier.toFixed(1) + ' เท่า (รอบ 7 วัน)');
        } else {
          multEl.textContent = lang === 'en' ? 'Computed strictly from real D1 7-day visits.' : 'คำนวณจากยอดเปิดดู D1 จริงในรอบ 7 วัน';
        }
      }

      const gmvBadge = document.getElementById('pitchGmvBadge');
      if (gmvBadge && portfolio) {
        gmvBadge.textContent = 'GMV ฿' + Number(portfolio.total_pool_gmv || 0).toLocaleString();
      }
      const g4Callout = document.getElementById('graphic4Callout');
      if (g4Callout && et && et.system_performance && et.system_performance.scaling) {
        const sc = et.system_performance.scaling;
        g4Callout.textContent = lang === 'en'
          ? ('Tier 1 Cap: ' + Number(sc.tier1_used_teams || 0) + '/' + Number(sc.tier1_safe_capacity_teams || 500) + ' teams · Tier 2 Cap: ≤' + Number(sc.tier2_autopicks_max_teams || 3000).toLocaleString())
          : ('ความจุ Tier 1 ใช้แล้ว ' + Number(sc.tier1_used_teams || 0) + '/' + Number(sc.tier1_safe_capacity_teams || 500) + ' ทีม · Tier 2 สูงสุด ' + Number(sc.tier2_autopicks_max_teams || 3000).toLocaleString() + ' ทีม');
      }
    }

    function setLanguage(lang) {
      const normalized = lang === 'en' ? 'en' : 'th';
      document.documentElement.lang = normalized;
      try { localStorage.setItem('fpl_lang', normalized); } catch (e) {}

      const dict = I18N[normalized];
      document.querySelectorAll('[data-i18n]').forEach((el) => {
        const key = el.getAttribute('data-i18n');
        if (dict[key] && !el.disabled) {
          el.textContent = dict[key];
        }
      });

      const langLbl = document.getElementById('langToggleLabel');
      if (langLbl) {
        langLbl.textContent = normalized.toUpperCase();
      }

      const lastSyncEl = document.getElementById('telemetryLastSync');
      const timeAgoEl = document.getElementById('telemetryTimeAgo');
      if (lastSyncEl) {
        if (latestPayloadCache && latestPayloadCache.last_sync) {
          lastSyncEl.textContent = latestPayloadCache.last_sync;
        } else {
          lastSyncEl.textContent = normalized === 'en' ? 'Sync Ready (Live)' : 'ข้อมูลซิงก์ล่าสุดพร้อมใช้งาน';
        }
      }
      if (timeAgoEl && latestPayloadCache) {
        timeAgoEl.textContent = formatTimeAgo(latestPayloadCache.last_sync_iso || (latestPayloadCache.edge_telemetry && latestPayloadCache.edge_telemetry.system_performance && latestPayloadCache.edge_telemetry.system_performance.sync && latestPayloadCache.edge_telemetry.system_performance.sync.last_sync_iso), normalized);
      }

      const gwEl = document.getElementById('telemetryNextDeadlineName');
      if (gwEl) {
        const gwName = gwEl.getAttribute('data-gw-name') || 'Gameweek';
        gwEl.textContent = normalized === 'en' ? (gwName + ' Deadline') : ('เดดไลน์ ' + gwName);
      }

      renderQuickLeagueOptions();
      renderLeagueTable();
      if (typeof renderLifecycleActionPanel === 'function' && selectedLifecycleLeagueId) {
        renderLifecycleActionPanel();
      }
      renderTrafficChart();
      if (typeof renderDeviceCards === 'function') renderDeviceCards();
      if (typeof renderMonitorSummary === 'function') renderMonitorSummary();
      if (typeof renderMonitorChart === 'function') renderMonitorChart();
      if (typeof renderAllOpResults === 'function') renderAllOpResults();
      if (typeof refreshOnboardingOutputs === 'function') refreshOnboardingOutputs();
      if (typeof renderOrderFilterButtons === 'function') renderOrderFilterButtons();
      if (typeof renderOrdersTable === 'function') renderOrdersTable();
      if (typeof renderOrderDetail === 'function' && selectedOrderObj) renderOrderDetail(selectedOrderObj);
      if (typeof renderPaymentSettingsUI === 'function' && paymentSettingsCache) renderPaymentSettingsUI(paymentSettingsCache);
      if (typeof renderOrdersEmailBadge === 'function') renderOrdersEmailBadge();
      const pitchBtn = document.getElementById('btnTogglePitchBody');
      const pitchBody = document.getElementById('secPitchBody');
      if (pitchBtn && pitchBody) {
        const isClosed = pitchBody.classList.contains('hidden');
        pitchBtn.textContent = dict[isClosed ? 'btn_expand_pitch' : 'btn_collapse_pitch'] || pitchBtn.textContent;
      }
      const qrBtn = document.getElementById('btnToggleQrBody');
      const qrBody = document.getElementById('paymentQrSettingsBody');
      if (qrBtn && qrBody) {
        const isClosed = qrBody.classList.contains('hidden');
        qrBtn.textContent = dict[isClosed ? 'btn_toggle_qr_show' : 'btn_toggle_qr_hide'] || qrBtn.textContent;
      }
      if (latestPayloadCache) {
        applyAdminPayload(latestPayloadCache);
      } else {
        renderFeatureAdoption(null, normalized);
        renderSegmentComparison(null, normalized);
        renderBrowserAndLocale(null, null, null, normalized);
        renderPeakWindows(null, normalized);
      }
    }

    function toggleLanguage() {
      setLanguage(getLang() === 'th' ? 'en' : 'th');
    }

    function updateThemeUI() {
      const isDark = document.documentElement.classList.contains('dark');
      const iconSun = document.getElementById('themeIconSun');
      const iconMoon = document.getElementById('themeIconMoon');
      const label = document.getElementById('themeBtnLabel');
      if (iconSun && iconMoon) {
        iconSun.classList.toggle('hidden', !isDark);
        iconMoon.classList.toggle('hidden', isDark);
      }
      if (label) {
        label.textContent = isDark ? 'Dark' : 'Light';
      }
      renderTrafficChart();
      renderLeagueTable();
      if (typeof renderLifecycleActionPanel === 'function' && selectedLifecycleLeagueId) {
        renderLifecycleActionPanel();
      }
      if (typeof renderMonitorChart === 'function') renderMonitorChart();
    }

    function toggleTheme() {
      const isDark = document.documentElement.classList.toggle('dark');
      const theme = isDark ? 'dark' : 'light';
      document.documentElement.style.colorScheme = theme;
      try { localStorage.setItem('fpl_theme', theme); } catch (e) {}
      updateThemeUI();
    }

    function jumpToLeague(val) {
      if (!val) return;
      const lang = getLang();
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      let baseUrl = 'https://www.fplsawadika.com/';
      if (val === 'landing' || val === 'hub') {
        baseUrl = 'https://www.fplsawadika.com/';
      } else if (val === 'preview') {
        baseUrl = 'https://www.fplsawadika.com/preview.html';
      } else if (val.startsWith('http')) {
        baseUrl = val;
      } else {
        const clean = val.replace(/^\\/+|\\/+$/g, '');
        baseUrl = 'https://www.fplsawadika.com/' + clean + '/';
      }
      const sep = baseUrl.includes('?') ? '&' : '?';
      window.open(baseUrl + sep + 'lang=' + lang + '&theme=' + theme, '_blank', 'noopener');
      const select = document.getElementById('quickLeagueSelect');
      if (select) select.value = '';
    }

    // =========================================================================
    // 5. EXECUTIVE BRIEF COPY & OPERATIONAL COMMANDS
    // =========================================================================
    function showToast(msg, isError = false) {
      const toast = document.getElementById('liveStatusToast');
      const text = document.getElementById('liveStatusToastText');
      if (!toast || !text) return;
      toast.classList.toggle('border-rose-500/40', Boolean(isError));
      toast.classList.toggle('bg-rose-500/10', Boolean(isError));
      toast.classList.toggle('text-rose-800', Boolean(isError));
      toast.classList.toggle('dark:text-rose-300', Boolean(isError));
      toast.classList.toggle('border-emerald-500/30', !isError);
      toast.classList.toggle('bg-emerald-500/10', !isError);
      toast.classList.toggle('text-emerald-800', !isError);
      toast.classList.toggle('dark:text-emerald-300', !isError);
      text.textContent = msg;
      toast.classList.remove('hidden');
      setTimeout(() => { toast.classList.add('hidden'); }, 4500);
    }

    function copyExecutiveSummary() {
      const lang = getLang();
      const managers = document.getElementById('kpiManagersCount')?.textContent || '0';
      const peakDaily = document.getElementById('kpiMatchdayActive')?.textContent || '0';
      const lifetime = document.getElementById('kpiLifetimeViews')?.textContent || '0';
      const matchSplit = document.getElementById('kpiMatchdaySplit')?.textContent || '—';
      const gmv = document.getElementById('kpiTotalGmv')?.textContent || '฿0';
      const totalLeagues = (latestPayloadCache && latestPayloadCache.portfolio && latestPayloadCache.portfolio.total_leagues_count) || LEAGUE_PORTFOLIO.length;
      const customPct = (latestPayloadCache && latestPayloadCache.portfolio && typeof latestPayloadCache.portfolio.custom_rules_pct === 'number')
        ? latestPayloadCache.portfolio.custom_rules_pct
        : 0;
      const cacheHit = document.getElementById('sysWorkerCacheHit')?.textContent || '—';

      const summary = lang === 'en'
        ? [
            'FPL SaWaDiKa — Live Executive BI Brief',
            '• Active Portfolio: ' + totalLeagues + ' Mini-Leagues (' + managers + ' Tier-1 Managers · Peak 7d Day: ' + peakDaily + ')',
            '• Total Prize Pool (GMV): ' + gmv + ' (' + customPct + '% Custom Rule Attachment)',
            '• Traffic & Lifetime: Matchday vs Weekday ' + matchSplit + ' | Lifetime Views: ' + lifetime,
            '• Infrastructure: Edge Cache Hit ' + cacheHit + ' | Cloudflare Workers + D1 Live'
          ].join('\\n')
        : [
            'สรุปผู้บริหาร FPL SaWaDiKa (ข้อมูลสด 100%)',
            '• พอร์ตโฟลิโอปัจจุบัน: ' + totalLeagues + ' มินิลีก (' + managers + ' ผู้จัดการทีม Tier 1 · พีครายวัน 7 วัน: ' + peakDaily + ')',
            '• มูลค่าเงินรางวัลรวม (GMV): ' + gmv + ' (ผูกกติกาพิเศษ ' + customPct + '% ของลีกทั้งหมด)',
            '• ทราฟฟิกจริง: สัดส่วนวันแข่ง/วันธรรมดา ' + matchSplit + ' | ยอดเข้าชมสะสมตลอดกาล: ' + lifetime,
            '• โครงสร้างพื้นฐาน: Edge Cache Hit ' + cacheHit + ' | Cloudflare Workers + D1 Live'
          ].join('\\n');

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(summary).then(() => {
          showToast(I18N[lang].btn_copied_exec);
        });
      }
    }

    const OP_META = {
      'flush-cache': { btnId: 'btnFlushCache', i18nKey: 'op_flush_btn', cooldownSec: 10 },
      'ping-upstream': { btnId: 'btnPingUpstream', i18nKey: 'op_ping_btn', cooldownSec: 5 },
      'export-json': { btnId: 'btnExportJson', i18nKey: 'op_export_btn', cooldownSec: 4 },
      'prune-telemetry': { btnId: 'btnPruneD1', i18nKey: 'op_prune_btn', cooldownSec: 10 },
    };
    const OP_STATE = {};

    function formatOpTime(ts) {
      try {
        return new Date(ts).toLocaleTimeString('th-TH', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
      } catch (_) {
        return '';
      }
    }

    function renderOpResult(action) {
      const state = OP_STATE[action];
      const box = document.getElementById('opResult-' + action);
      if (!box || !state || !state.lastResult) return;
      const lang = getLang();
      const r = state.lastResult;
      const timeStr = formatOpTime(r.at);

      box.className = r.ok
        ? 'rounded-lg border p-2.5 text-xs leading-relaxed border-emerald-500/35 bg-emerald-500/10 text-emerald-900 dark:text-emerald-200 space-y-1'
        : 'rounded-lg border p-2.5 text-xs leading-relaxed border-rose-500/35 bg-rose-500/10 text-rose-900 dark:text-rose-200 space-y-1';

      const head = document.createElement('div');
      head.className = 'flex items-center justify-between gap-2 font-semibold';
      const titleSpan = document.createElement('span');
      titleSpan.textContent = lang === 'en' ? r.titleEn : r.titleTh;
      const timeSpan = document.createElement('span');
      timeSpan.className = 'mono text-xs opacity-80 shrink-0';
      timeSpan.textContent = timeStr;
      head.append(titleSpan, timeSpan);

      const desc = document.createElement('p');
      desc.className = 'opacity-90';
      desc.textContent = lang === 'en' ? r.detailEn : r.detailTh;

      box.replaceChildren(head, desc);
      box.classList.remove('hidden');
    }

    function renderAllOpResults() {
      Object.keys(OP_META).forEach((act) => {
        renderOpResult(act);
        const st = OP_STATE[act];
        const meta = OP_META[act];
        const btn = document.getElementById(meta.btnId);
        if (btn && st && st.cooldown > 0) {
          btn.textContent = getLang() === 'en'
            ? ('✓ Done · Wait ' + st.cooldown + 's')
            : ('✓ กดแล้ว · ไม่ต้องกดซ้ำ (' + st.cooldown + ' วิ)');
        }
      });
    }

    function startOpCooldown(action) {
      const meta = OP_META[action];
      if (!meta) return;
      const btn = document.getElementById(meta.btnId);
      if (!OP_STATE[action]) OP_STATE[action] = {};
      const st = OP_STATE[action];
      if (st.timer) clearInterval(st.timer);

      let left = meta.cooldownSec;
      st.cooldown = left;
      if (btn) {
        btn.disabled = true;
        btn.textContent = getLang() === 'en'
          ? ('✓ Done · Wait ' + left + 's')
          : ('✓ กดแล้ว · ไม่ต้องกดซ้ำ (' + left + ' วิ)');
      }

      st.timer = setInterval(() => {
        left -= 1;
        st.cooldown = left;
        const b = document.getElementById(meta.btnId);
        if (left <= 0) {
          clearInterval(st.timer);
          st.timer = null;
          st.cooldown = 0;
          if (b) {
            b.disabled = false;
            const dict = I18N[getLang()];
            b.textContent = (dict && dict[meta.i18nKey]) ? dict[meta.i18nKey] : b.textContent;
          }
        } else if (b) {
          b.textContent = getLang() === 'en'
            ? ('✓ Done · Wait ' + left + 's')
            : ('✓ กดแล้ว · ไม่ต้องกดซ้ำ (' + left + ' วิ)');
        }
      }, 1000);
    }

    function buildEdgeResultText(action, data) {
      const at = Date.now();
      if (action === 'flush-cache') {
        const keys = Number(data.deleted_keys || 0);
        const coloTxt = data.colo ? (' [' + data.colo + ']') : '';
        const scopesTxt = Array.isArray(data.flushed_scopes) && data.flushed_scopes.length
          ? (' (' + data.flushed_scopes.join(', ') + ')')
          : '';
        return {
          ok: true,
          at,
          titleTh: '✓ ล้างข้อมูลค้างเรียบร้อย' + coloTxt + ' (ไม่ต้องกดซ้ำ)',
          titleEn: '✓ Live Cache Cleared' + coloTxt + ' (No need to repeat)',
          detailTh: keys > 0
            ? ('ล้างแคชไปแล้ว ' + keys + ' รายการ' + scopesTxt + ' — หน้าเว็บจะดึงคะแนนล่าสุดให้ทุกคนอัตโนมัติในรอบถัดไป')
            : ('เคลียร์สถานะเรียบร้อยแล้ว' + scopesTxt + ' — หน้าเว็บจะดึงข้อมูลสดล่าสุดให้ทุกคนทันทีที่เปิดดูใหม่'),
          detailEn: keys > 0
            ? ('Cleared ' + keys + ' cached entries' + scopesTxt + ' — visitors will receive fresh live scores immediately.')
            : ('Cache is clean' + scopesTxt + ' — visitors will receive fresh live scores immediately.'),
        };
      }
      if (action === 'ping-upstream') {
        const ms = Number(data.upstream_latency_ms || 0);
        const stCode = Number(data.upstream_status || 200);
        const speedTh = ms < 300 ? 'เร็วมาก' : (ms < 800 ? 'ปกติ' : 'ค่อนข้างช้า');
        const speedEn = ms < 300 ? 'Fast' : (ms < 800 ? 'Normal' : 'Slow');
        return {
          ok: Boolean(data.success),
          at,
          titleTh: data.success ? ('✓ เว็บ FPL ใช้งานได้ปกติ (' + ms + ' ms)') : ('⚠️ เว็บ FPL ตอบสนองผิดปกติ (HTTP ' + stCode + ')'),
          titleEn: data.success ? ('✓ FPL Server Healthy (' + ms + ' ms)') : ('⚠️ FPL Server Issue (HTTP ' + stCode + ')'),
          detailTh: data.success
            ? ('เชื่อมต่อกับเซิร์ฟเวอร์พรีเมียร์ลีกได้ปกติ ความเร็วระดับ "' + speedTh + '" (สถานะ ' + stCode + ')')
            : ('เว็บพรีเมียร์ลีกต้นทางอาจกำลังช้าหรือปรับปรุง (HTTP ' + stCode + ' · ' + ms + ' ms)'),
          detailEn: data.success
            ? ('Official Premier League server responded normally — speed "' + speedEn + '" (HTTP ' + stCode + ').')
            : ('Official FPL server returned HTTP ' + stCode + ' (' + ms + ' ms).'),
        };
      }
      if (action === 'prune-telemetry') {
        const pruned = Number(data.pruned_rows || 0);
        return {
          ok: true,
          at,
          titleTh: '✓ ล้างประวัติเก่าเรียบร้อย (ไม่ต้องกดซ้ำ)',
          titleEn: '✓ Old Logs Cleaned (No need to repeat)',
          detailTh: pruned > 0
            ? ('ลบประวัติรายวันเก่าเกิน 30 วันไปแล้ว ' + pruned.toLocaleString() + ' รายการ (ยอดผู้เข้าชมรวมทั้งหมดยังอยู่ครบ)')
            : 'ตอนนี้ยังไม่มีประวัติที่เก่าเกิน 30 วัน ระบบสะอาดดีอยู่แล้ว (ยอดผู้เข้าชมรวมยังอยู่ครบ)',
          detailEn: pruned > 0
            ? ('Removed ' + pruned.toLocaleString() + ' daily records older than 30 days (lifetime view counter untouched).')
            : 'No records older than 30 days found — database is already tidy (lifetime views untouched).',
        };
      }
      return {
        ok: true,
        at,
        titleTh: '✓ ดำเนินการสำเร็จ (ไม่ต้องกดซ้ำ)',
        titleEn: '✓ Completed (No need to repeat)',
        detailTh: data.message || 'ดำเนินการเรียบร้อยแล้ว',
        detailEn: data.message || 'Operation completed.',
      };
    }

    async function runEdgeAction(action) {
      const lang = getLang();
      const meta = OP_META[action];
      if (!OP_STATE[action]) OP_STATE[action] = {};
      const st = OP_STATE[action];
      if (st.loading || (st.cooldown && st.cooldown > 0)) return;

      if (action === 'prune-telemetry') {
        if (!window.confirm(I18N[lang].confirm_prune)) return;
      }

      const btn = meta ? document.getElementById(meta.btnId) : null;
      st.loading = true;
      if (btn) {
        btn.disabled = true;
        btn.textContent = lang === 'en' ? 'Working...' : 'กำลังดำเนินการ...';
      }

      try {
        const res = await fetch('/api/admin/' + action, { method: 'POST', credentials: 'same-origin' });
        let data = {};
        try { data = await res.json(); } catch (_) {}
        if (!res.ok || (data.success === false && action !== 'ping-upstream')) {
          const errMsg = data.error || data.message || ('HTTP ' + res.status);
          st.lastResult = {
            ok: false,
            at: Date.now(),
            titleTh: '⚠️ ดำเนินการไม่สำเร็จ',
            titleEn: '⚠️ Action Failed',
            detailTh: 'เกิดข้อผิดพลาด (' + errMsg + ') — กรุณารอสักครู่แล้วลองใหม่อีกครั้ง',
            detailEn: 'Error (' + errMsg + ') — please check connection or re-login and try again.',
          };
          renderOpResult(action);
          if (btn) {
            btn.disabled = false;
            const dict = I18N[getLang()];
            if (meta && dict[meta.i18nKey]) btn.textContent = dict[meta.i18nKey];
          }
          showToast(lang === 'en' ? ('Action failed: ' + errMsg) : ('ดำเนินการไม่สำเร็จ: ' + errMsg), true);
          return;
        }
        if (action === 'ping-upstream' && data.upstream_latency_ms) {
          const msVal = Number(data.upstream_latency_ms) || 0;
          const el = document.getElementById('sysUpstreamLatency');
          if (el) el.textContent = msVal + ' ms';
          const badgeEl = document.getElementById('sysUpstreamBadge');
          if (badgeEl) {
            badgeEl.removeAttribute('data-i18n');
            badgeEl.textContent = data.success ? 'Healthy' : ('HTTP ' + (data.upstream_status || 502));
            badgeEl.className = data.success
              ? 'mono font-semibold text-emerald-700 dark:text-emerald-400'
              : 'mono font-semibold text-rose-600 dark:text-rose-400';
          }
          const barEl = document.getElementById('sysUpstreamBar');
          if (barEl) {
            const pct = Math.min(100, Math.max(8, Math.round((msVal / 1000) * 100)));
            barEl.style.width = pct + '%';
            barEl.className = data.success
              ? 'bg-emerald-500 h-full rounded-full transition-all duration-300'
              : 'bg-rose-500 h-full rounded-full transition-all duration-300';
          }
        }
        if (action === 'prune-telemetry' && data.success) {
          loadLiveData(false);
        }
        st.lastResult = buildEdgeResultText(action, data);
        renderOpResult(action);
        startOpCooldown(action);
        showToast(lang === 'en' ? st.lastResult.titleEn : st.lastResult.titleTh, !st.lastResult.ok);
      } catch (err) {
        const errDetail = (err && err.message) ? err.message : 'network unreachable';
        st.lastResult = {
          ok: false,
          at: Date.now(),
          titleTh: '⚠️ เชื่อมต่อระบบไม่สำเร็จ',
          titleEn: '⚠️ Network Error',
          detailTh: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ในขณะนี้ (' + errDetail + ')',
          detailEn: 'Could not reach Edge Worker (' + errDetail + ').',
        };
        renderOpResult(action);
        if (btn) {
          btn.disabled = false;
          const dict = I18N[getLang()];
          if (meta && dict[meta.i18nKey]) btn.textContent = dict[meta.i18nKey];
        }
        showToast(
          lang === 'en'
            ? ('Network error executing edge action: ' + errDetail)
            : ('ไม่สามารถติดต่อเซิร์ฟเวอร์ได้: ' + errDetail),
          true
        );
      } finally {
        st.loading = false;
      }
    }

    function exportDashboardJson() {
      const action = 'export-json';
      if (!OP_STATE[action]) OP_STATE[action] = {};
      const st = OP_STATE[action];
      if (st.cooldown && st.cooldown > 0) return;

      const filename = 'fplsawadika-executive-bi-snapshot.json';
      const payload = latestPayloadCache || {
        exported_at: new Date().toISOString(),
        leagues: LEAGUE_PORTFOLIO
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);

      const totalLeagues = (payload.portfolio && payload.portfolio.total_leagues_count) || LEAGUE_PORTFOLIO.length;
      st.lastResult = {
        ok: true,
        at: Date.now(),
        titleTh: '✓ ดาวน์โหลดไฟล์เรียบร้อย (ไม่ต้องกดซ้ำ)',
        titleEn: '✓ File Downloaded (No need to repeat)',
        detailTh: 'บันทึกไฟล์ "' + filename + '" (ข้อมูล ' + totalLeagues + ' ลีก) ลงในเครื่องเรียบร้อยแล้ว',
        detailEn: 'Saved "' + filename + '" (' + totalLeagues + ' leagues snapshot) to your device.',
      };
      renderOpResult(action);
      startOpCooldown(action);
      showToast(getLang() === 'en' ? st.lastResult.titleEn : st.lastResult.titleTh);
    }

    // =========================================================================
    // 6. LIVE TELEMETRY HYDRATION & DEADLINE COUNTDOWN
    // =========================================================================
    let nextDeadlineEpoch = Date.now() + (3 * 86400 + 6 * 3600 + 24 * 60) * 1000;

    function tickCountdown() {
      const diff = Math.max(0, Math.floor((nextDeadlineEpoch - Date.now()) / 1000));
      const d = Math.floor(diff / 86400);
      const h = Math.floor((diff % 86400) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      const pad = (n) => String(n).padStart(2, '0');
      const elD = document.getElementById('cdDays');
      const elH = document.getElementById('cdHours');
      const elM = document.getElementById('cdMins');
      const elS = document.getElementById('cdSecs');
      if (elD) elD.textContent = pad(d);
      if (elH) elH.textContent = pad(h);
      if (elM) elM.textContent = pad(m);
      if (elS) elS.textContent = pad(s);
    }

    function setMetricBar(pctId, barId, pctVal) {
      const num = Math.max(0, Math.min(100, parseFloat(pctVal)));
      if (Number.isNaN(num)) return;
      const txtEl = document.getElementById(pctId);
      const barEl = document.getElementById(barId);
      const formatted = num.toFixed(1) + '%';
      if (txtEl) txtEl.textContent = formatted;
      if (barEl) barEl.style.width = formatted;
    }

    function setValueWithUnit(elId, primaryText, unitText) {
      const el = document.getElementById(elId);
      if (!el) return;
      const unitSpan = document.createElement('span');
      unitSpan.className = 'text-xs font-normal text-slate-600 dark:text-neutral-400';
      unitSpan.textContent = unitText;
      el.replaceChildren(document.createTextNode(primaryText + ' '), unitSpan);
    }

    function applyAdminPayload(data) {
      if (!data || typeof data !== 'object') return;
      latestPayloadCache = data;
      const lang = getLang();

      const syncIso = data.last_sync_iso ||
        (data.edge_telemetry && data.edge_telemetry.system_performance && data.edge_telemetry.system_performance.sync && data.edge_telemetry.system_performance.sync.last_sync_iso) ||
        '';
      if (data.last_sync) {
        const lastSyncEl = document.getElementById('telemetryLastSync');
        if (lastSyncEl) lastSyncEl.textContent = data.last_sync;
      }
      const timeAgoEl = document.getElementById('telemetryTimeAgo');
      if (timeAgoEl) {
        timeAgoEl.textContent = formatTimeAgo(syncIso, lang);
      }

      if (data.portfolio) {
        const tier1Count = Number(data.portfolio.total_managers_tier1 || 0);
        const allCount = Number(data.portfolio.total_managers_all || tier1Count || 0);
        const tier1LeaguesCount = Number(data.portfolio.tier1_leagues_count || 0);
        const totalLeaguesCount = Number(data.portfolio.total_leagues_count || 0);

        const kpiMgrEl = document.getElementById('kpiManagersCount');
        if (kpiMgrEl) kpiMgrEl.textContent = tier1Count.toLocaleString();
        const kpiMgrSub = document.getElementById('kpiManagersSub');
        if (kpiMgrSub) {
          kpiMgrSub.textContent = lang === 'en'
            ? (tier1LeaguesCount + ' Tier 1 Leagues (' + allCount.toLocaleString() + ' Total across ' + totalLeaguesCount + ' leagues)')
            : ('Tier 1 ' + tier1LeaguesCount + ' มินิลีก (รวมทั้งหมด ' + allCount.toLocaleString() + ' ทีม / ' + totalLeaguesCount + ' ลีก)');
        }

        const gmvEl = document.getElementById('kpiTotalGmv');
        if (gmvEl) gmvEl.textContent = '฿' + Number(data.portfolio.total_pool_gmv || 0).toLocaleString();

        const footEl = document.getElementById('footerLeagueSummary');
        if (footEl) {
          footEl.textContent = lang === 'en'
            ? ('Executive BI & Infrastructure Control (' + totalLeaguesCount + ' Mini-Leagues · ' + allCount.toLocaleString() + ' Teams)')
            : ('ศูนย์วิเคราะห์ข้อมูลธุรกิจและโครงสร้างพื้นฐานครบวงจร (' + totalLeaguesCount + ' มินิลีก · ' + allCount.toLocaleString() + ' ทีม)');
        }

        if (typeof data.portfolio.custom_rules_count === 'number') {
          const customEl = document.getElementById('portCustomRulesVal');
          if (customEl) {
            const pct = typeof data.portfolio.custom_rules_pct === 'number'
              ? data.portfolio.custom_rules_pct
              : Math.round((data.portfolio.custom_rules_count / Math.max(1, totalLeaguesCount)) * 100);
            const pctSpan = document.createElement('span');
            pctSpan.className = 'text-sm font-normal text-slate-600 dark:text-neutral-400';
            pctSpan.textContent = '(' + pct + '%)';
            customEl.replaceChildren(
              document.createTextNode(data.portfolio.custom_rules_count + ' / ' + totalLeaguesCount + ' '),
              pctSpan
            );
          }
        }

        if (data.portfolio.leagues && typeof data.portfolio.leagues === 'object') {
          const etLeagues = (data.edge_telemetry && data.edge_telemetry.leagues) || {};
          LEAGUE_PORTFOLIO = Object.entries(data.portfolio.leagues).map(([lid, liveMeta]) => {
            const m = liveMeta || {};
            const etL = etLeagues[lid] || {};
            const tierVal = Number(m.tier || 1);
            const tCount = Number(m.teams || 0);
            const poolVal = Number(m.pool || 0);
            const vptVal = Number(etL.visits_per_team_7d != null ? etL.visits_per_team_7d : 0);
            const avgTimeTh = etL.avg_screen_time || '—';
            const avgTimeEn = etL.avg_screen_time_en || '—';
            const badgeStr = tierVal === 2
              ? 'Tier 2'
              : (m.visibility === 'private' ? 'Private' : (lid === '40700' ? 'Flagship' : ''));
            return {
              id: lid,
              name: String(m.name || lid),
              badge: badgeStr,
              teams: tCount,
              pool: poolVal,
              poolLabelTh: (m.pool_label && m.pool_label !== '-') ? String(m.pool_label) : 'คอมมูนิตี้',
              poolLabelEn: (m.pool_label_en && m.pool_label_en !== '-') ? String(m.pool_label_en) : 'Community',
              modulesTh: String(m.modules_th || (tierVal === 2 ? 'Tier 2 Auto-Picks Live' : 'ตารางคะแนนสด')),
              modulesEn: String(m.modules_en || (tierVal === 2 ? 'Tier 2 Auto-Picks Live' : 'Live Standings')),
              views: Number(etL.views || 0),
              vpt: vptVal,
              avgScreenTime: avgTimeTh,
              avgScreenTimeEn: avgTimeEn,
              avgScreenTimeSec: etL.avg_screen_time_sec != null ? Number(etL.avg_screen_time_sec) : null,
              plan: m.plan ? String(m.plan) : (tierVal === 2 ? 'tier2_quote' : 'standard'),
              status: m.status ? String(m.status) : 'active',
              visibility: m.visibility ? String(m.visibility) : 'showcase',
              tenant_group: m.tenant_group ? String(m.tenant_group) : 'showcase',
              created_at: m.created_at ? String(m.created_at) : null,
              expires_at: m.expires_at ? String(m.expires_at) : null,
              days_remaining: typeof m.days_remaining === 'number' ? m.days_remaining : null,
              expiry_alert: m.expiry_alert ? String(m.expiry_alert) : 'none',
              billing_note: m.billing_note ? String(m.billing_note) : '',
            };
          });
          renderQuickLeagueOptions();
          renderLeagueTable();
          if (typeof renderLifecycleActionPanel === 'function' && selectedLifecycleLeagueId) {
            renderLifecycleActionPanel();
          }
        }
      }

      if (data.edge_telemetry) {
        const et = data.edge_telemetry;

        // Section 02 Landing Card
        if (et.landing_page && typeof et.landing_page === 'object') {
          const lp7d = Number(et.landing_page.views_7d || 0);
          const lpToday = Number(et.landing_page.views_today || 0);
          setValueWithUnit('portLandingViews', lp7d.toLocaleString(), lang === 'en' ? 'views' : 'ครั้ง');
          const todayBadge = document.getElementById('portLandingTodayBadge');
          if (todayBadge) {
            todayBadge.textContent = (lang === 'en' ? 'Today: ' : 'วันนี้: ') + lpToday.toLocaleString();
          }
        }

        // Section 01 Live KPIs
        const peakDailyEl = document.getElementById('kpiMatchdayActive');
        if (peakDailyEl) peakDailyEl.textContent = Number(et.matchday_active_users || 0).toLocaleString();
        const peakSubEl = document.getElementById('kpiMatchdaySub');
        if (peakSubEl && et.peak_day_date) {
          peakSubEl.textContent = lang === 'en'
            ? ('Peak 7d date: ' + et.peak_day_date + ' (live league views)')
            : ('วันที่ยอดเข้าชมสูงสุด (7 วัน): ' + et.peak_day_date);
        }

        const offPeakEl = document.getElementById('kpiOffPeakDau');
        if (offPeakEl) offPeakEl.textContent = Number(et.off_peak_dau || 0).toLocaleString();

        const splitEl = document.getElementById('kpiMatchdaySplit');
        const splitSubEl = document.getElementById('kpiMatchdaySplitSub');
        const mv = et.matchday_vs_offpeak || {};
        const mvTot = Number(mv.matchday_visits || 0) + Number(mv.offpeak_visits || 0);
        if (splitEl) {
          splitEl.textContent = mvTot > 0
            ? (Number(mv.matchday_pct || 0) + '% / ' + Number(mv.offpeak_pct || 0) + '%')
            : '0% / 0%';
        }
        if (splitSubEl) {
          splitSubEl.textContent = lang === 'en'
            ? ('Fri–Mon: ' + Number(mv.matchday_visits || 0).toLocaleString() + ' vs Tue–Thu: ' + Number(mv.offpeak_visits || 0).toLocaleString() + ' (7d)')
            : ('ศ.–จ.: ' + Number(mv.matchday_visits || 0).toLocaleString() + ' vs อ.–พฤ.: ' + Number(mv.offpeak_visits || 0).toLocaleString() + ' (7 วัน)');
        }

        const lifeEl = document.getElementById('kpiLifetimeViews');
        if (lifeEl) lifeEl.textContent = Number(et.lifetime_total_views || 0).toLocaleString();

        const screenEl = document.getElementById('kpiScreenTime');
        if (screenEl) {
          if (typeof et.avg_session_sec === 'number' && et.avg_session_sec > 0) {
            const mins = Math.floor(et.avg_session_sec / 60);
            const secs = et.avg_session_sec % 60;
            screenEl.textContent = mins + 'm ' + String(secs).padStart(2, '0') + 's';
          } else {
            screenEl.textContent = '—';
          }
        }

        const modelBadge = document.getElementById('telemetryModelBadge');
        if (modelBadge) {
          const live7d = Number(et.raw_live_visits_7d || 0).toLocaleString();
          const landing7d = Number((et.landing_page && et.landing_page.views_7d) || 0).toLocaleString();
          const lifetime = Number(et.lifetime_total_views || 0).toLocaleString();
          modelBadge.textContent = 'Live 7d: ' + live7d + ' · Landing: ' + landing7d + ' · Total: ' + lifetime;
        }

        // Section 05 Feature Adoption + Segment Comparison
        renderFeatureAdoption(et.features, lang);
        renderSegmentComparison(et.features ? et.features.segment_comparison : null, lang);

        // Section 06 Browser, Geo & Locale
        renderBrowserAndLocale(et.browsers, et.locale, et.geo, lang);

        // Section 07 Devices
        if (et.devices) {
          DEVICES_STATE = {
            w7: et.devices.w7 || et.devices,
            w30: et.devices.w30 || et.devices,
          };
          renderDeviceCards();
        }

        // Section 08 Peak Windows
        renderPeakWindows(et.peak_windows, lang);

        // Section 09 Cloud Quota, 4-table D1 & Scaling Headroom (+ Section 02 Headroom card)
        if (et.system_performance) {
          const sp = et.system_performance;
          if (typeof sp.d1_row_count === 'number') {
            setValueWithUnit('sysD1RowsCount', Number(sp.d1_row_count).toLocaleString(), 'rows');
          }
          const d1TblEl = document.getElementById('sysD1TablesBreakdown');
          if (d1TblEl && sp.d1_tables) {
            const dt = sp.d1_tables;
            d1TblEl.textContent = 'telem:' + Number(dt.telemetry_counters || 0)
              + ' · ord:' + Number(dt.league_orders || 0)
              + ' · notes:' + Number(dt.league_admin_notes || 0)
              + ' · cfg:' + Number(dt.app_settings || 0);
          }
          if (typeof sp.d1_daily_writes_used === 'number' && typeof sp.d1_daily_writes_limit === 'number' && sp.d1_daily_writes_limit > 0) {
            const d1Pct = ((sp.d1_daily_writes_used / sp.d1_daily_writes_limit) * 100).toFixed(1);
            const d1PctEl = document.getElementById('sysD1ReadsPct');
            const d1BarEl = document.getElementById('sysD1ReadsBar');
            if (d1PctEl) d1PctEl.textContent = Number(sp.d1_daily_writes_used).toLocaleString() + ' (' + d1Pct + '% / ' + Math.round(sp.d1_daily_writes_limit / 1000) + 'k)';
            if (d1BarEl) d1BarEl.style.width = Math.min(100, parseFloat(d1Pct)) + '%';
          }
          const workerReqs = Number(sp.worker_reqs_today || 0);
          setValueWithUnit('sysWorkerReqs', workerReqs.toLocaleString(), '/ 100k req/d');
          const wBar = document.getElementById('sysWorkerBar');
          if (wBar) wBar.style.width = Math.min(100, (workerReqs / 100000) * 100).toFixed(1) + '%';

          const cacheEl = document.getElementById('sysWorkerCacheHit');
          if (cacheEl) {
            if (typeof sp.edge_cache_hit_pct === 'number') {
              const sTot = Number(sp.edge_cache_sample_total_7d || 0).toLocaleString();
              cacheEl.textContent = sp.edge_cache_hit_pct.toFixed(1) + '% (' + sTot + ')';
            } else {
              cacheEl.textContent = '—';
            }
          }

          if (sp.sync) {
            if (typeof sp.sync.sync_duration_sec === 'number') {
              setValueWithUnit('sysGhSyncTime', sp.sync.sync_duration_sec.toFixed(1) + 's', '/ build');
              const ghBar = document.getElementById('sysGhSyncBar');
              if (ghBar) ghBar.style.width = Math.min(100, Math.max(4, (sp.sync.sync_duration_sec / 60) * 100)).toFixed(1) + '%';
            }
            const ghDetEl = document.getElementById('sysGhSyncDetail');
            if (ghDetEl) {
              const calls = sp.sync.api_calls_count != null ? Number(sp.sync.api_calls_count).toLocaleString() : '—';
              const retries = sp.sync.api_retry_count != null ? Number(sp.sync.api_retry_count) : 0;
              const rl = sp.sync.api_rate_limit_count != null ? Number(sp.sync.api_rate_limit_count) : 0;
              const kb = sp.sync.master_payload_bytes ? Math.round(Number(sp.sync.master_payload_bytes) / 1024) + ' KB' : '—';
              ghDetEl.textContent = lang === 'en'
                ? (calls + ' API calls · ' + retries + ' retries · ' + rl + ' 429s · ' + kb)
                : (calls + ' API calls · retry ' + retries + ' · 429: ' + rl + ' · ' + kb);
            }
          }

          if (sp.scaling) {
            const hl = Number(sp.scaling.tier1_headroom_leagues || 0);
            const ht = Number(sp.scaling.tier1_headroom_teams || 0);
            const headEl = document.getElementById('sysScalingHeadroom');
            if (headEl) {
              headEl.textContent = lang === 'en'
                ? ('+' + hl + ' Leagues / +' + ht + ' Teams')
                : ('+' + hl + ' ลีก / +' + ht + ' ทีม');
            }
            const wlEl = document.getElementById('portWhiteLabelVal');
            if (wlEl) {
              wlEl.textContent = lang === 'en'
                ? ('+' + hl + ' Leagues (' + ht + ' teams left)')
                : ('+' + hl + ' ลีก (' + ht + ' ทีม)');
            }
          }
        }

        if (Array.isArray(et.hourly_series) && et.hourly_series.length === 24) {
          HOURLY_SERIES = et.hourly_series.map((pt, idx) => {
            if (typeof pt === 'number') {
              return { hour: String(idx).padStart(2, '0') + ':00', count: pt, pct: 0, peak: false };
            }
            return {
              hour: String((pt && pt.hour) || (String(idx).padStart(2, '0') + ':00')),
              count: Number((pt && pt.count) || 0),
              pct: Number((pt && pt.pct) || 0),
              peak: Boolean(pt && pt.peak),
            };
          });
        }

        if (Array.isArray(et.daily_series)) {
          const thDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
          const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          DAILY_SERIES = et.daily_series.map((item) => {
            if (item && typeof item.date === 'string') {
              const dt = new Date(item.date + 'T12:00:00Z');
              const dow = Number.isNaN(dt.getTime()) ? 0 : dt.getUTCDay();
              return {
                dayTh: thDays[dow],
                dayEn: enDays[dow],
                date: item.date,
                visits: Number(item.visits || 0),
                peak: dow === 5 || dow === 6 || dow === 0,
              };
            }
            return item;
          });
        }

        if (et.monitor) {
          MONITOR_STATE = et.monitor;
        }

        renderPitchDeckLiveMetrics(et, data.portfolio, lang);
      }

      if (data.fpl_upstream && data.fpl_upstream.next_deadline_time) {
        const parsed = Date.parse(data.fpl_upstream.next_deadline_time);
        if (!Number.isNaN(parsed)) {
          nextDeadlineEpoch = parsed;
          tickCountdown();
        }
        if (data.fpl_upstream.next_gw_name) {
          const gwEl = document.getElementById('telemetryNextDeadlineName');
          if (gwEl) {
            gwEl.setAttribute('data-gw-name', data.fpl_upstream.next_gw_name);
            gwEl.textContent = lang === 'en'
              ? (data.fpl_upstream.next_gw_name + ' Deadline')
              : ('เดดไลน์ ' + data.fpl_upstream.next_gw_name);
          }
        }
      }

      renderTrafficChart();
      if (typeof renderMonitorSummary === 'function') renderMonitorSummary();
      if (typeof renderMonitorChart === 'function') renderMonitorChart();
    }

    async function loadLiveData(showBanner) {
      const lang = getLang();
      try {
        const res = await fetch('/api/admin/metrics', { credentials: 'same-origin' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        applyAdminPayload(data);
        if (typeof loadOrdersData === 'function') loadOrdersData(currentOrderFilter);
        if (showBanner) showToast(I18N[lang].toast_refreshed);
      } catch (err) {
        if (showBanner) {
          showToast(
            lang === 'en'
              ? ('Failed to load live metrics (' + (err && err.message ? err.message : 'network') + ')')
              : ('โหลดข้อมูลสดไม่สำเร็จ (' + (err && err.message ? err.message : 'กรุณาตรวจสอบการเชื่อมต่อ') + ')'),
            true
          );
        }
      }
    }

    let isPitchRefreshing = false;
    let pitchCooldownSec = 0;
    let pitchCooldownInterval = null;

    async function triggerLivePitchRefresh() {
      if (isPitchRefreshing || pitchCooldownSec > 0) return;
      isPitchRefreshing = true;
      const lang = getLang();
      const btn = document.getElementById('refreshDataBtn');
      const icon = document.getElementById('refreshIcon');
      const btnText = document.getElementById('refreshBtnText');
      if (btn) btn.disabled = true;
      if (icon) icon.classList.add('animate-spin');
      if (btnText) btnText.textContent = lang === 'en' ? 'Fetching Live...' : 'กำลังดึงสด...';

      const tStart = performance.now();
      try {
        const res = await fetch('/api/admin/metrics?force=1', { credentials: 'same-origin' });
        const tDuration = Math.round(performance.now() - tStart);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        applyAdminPayload(data);
        if (typeof loadOrdersData === 'function') loadOrdersData(currentOrderFilter);

        const edgeColo = (data.edge_metadata && data.edge_metadata.colo) ? data.edge_metadata.colo : 'EDGE';
        const msg = lang === 'en'
          ? '⚡ Live data refreshed in ' + tDuration + 'ms (' + edgeColo + ' Edge Live)'
          : '⚡ อัปเดตข้อมูลสดสำเร็จใน ' + tDuration + 'ms (' + edgeColo + ' Edge Live)';
        showToast(msg);
      } catch (err) {
        const tDuration = Math.round(performance.now() - tStart);
        const msg = lang === 'en'
          ? '⚠️ Live refresh failed in ' + tDuration + 'ms (' + (err && err.message ? err.message : 'Please re-login') + ')'
          : '⚠️ อัปเดตข้อมูลสดไม่สำเร็จใน ' + tDuration + 'ms (' + (err && err.message ? err.message : 'กรุณาลองใหม่') + ')';
        showToast(msg, true);
      } finally {
        isPitchRefreshing = false;
        if (icon) icon.classList.remove('animate-spin');
        
        // Start 5s cooldown
        pitchCooldownSec = 5;
        if (pitchCooldownInterval) clearInterval(pitchCooldownInterval);
        pitchCooldownInterval = setInterval(() => {
          pitchCooldownSec--;
          if (pitchCooldownSec <= 0) {
            clearInterval(pitchCooldownInterval);
            if (btn) btn.disabled = false;
            if (btnText) btnText.textContent = I18N[getLang()].btn_live_pitch_refresh || '⚡ Live Pitch Refresh';
          } else {
            if (btnText) btnText.textContent = (lang === 'en' ? 'Cooldown (' : 'รอสักครู่ (') + pitchCooldownSec + 's)';
          }
        }, 1000);
      }
    }

    // =========================================================================
    // 6. CONCIERGE CUSTOMER LEAGUE ONBOARDING WIZARD
    // =========================================================================
    let onbInspectedLeague = null;
    let onbExcludedEntryIds = new Set();

    function setOnbStatusMessage(text, isError) {
      const box = document.getElementById('onbInspectStatus');
      if (!box) return;
      if (!text) {
        box.className = 'hidden p-3 rounded-lg text-xs border';
        box.textContent = '';
        return;
      }
      box.className = isError
        ? 'p-3 rounded-lg text-xs border border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300'
        : 'p-3 rounded-lg text-xs border border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
      box.textContent = text;
    }

    function getDefaultTrialExpiryIso(days = 14) {
      const dt = new Date(Date.now() + 7 * 3600000 + days * 86400000);
      return dt.toISOString().split('T')[0];
    }

    function refreshOnboardingOutputs() {
      const idEl = document.getElementById('onbLeagueId');
      const planEl = document.getElementById('onbPlan');
      const prizeEl = document.getElementById('onbPrizeModel');
      const weeklyEl = document.getElementById('onbWeeklyPrize');
      const statusEl = document.getElementById('onbStatus');
      const tierEl = document.getElementById('onbTier');
      const currencyEl = document.getElementById('onbCurrency');
      const entryFeeEl = document.getElementById('onbEntryFee');
      const totalPoolEl = document.getElementById('onbTotalPool');
      const seasonPrizesEl = document.getElementById('onbSeasonPrizes');
      const cupPrizeEl = document.getElementById('onbCupPrize');
      const penaltyWrapEl = document.getElementById('onbPenaltyTiersWrap');
      const penaltyTiersEl = document.getElementById('onbPenaltyTiers');
      const monthlyWrapEl = document.getElementById('onbMonthlySplitWrap');
      const monthlyChampEl = document.getElementById('onbMonthlyChamp');
      const monthlyRunnerEl = document.getElementById('onbMonthlyRunner');
      const tenantEl = document.getElementById('onbTenantGroup');
      const visEl = document.getElementById('onbVisibility');
      const shortEl = document.getElementById('onbShortName');
      const expiresEl = document.getElementById('onbExpiresAt');
      const noCupEl = document.getElementById('onbNoCup');

      const outCli = document.getElementById('onbOutCli');
      const outJson = document.getElementById('onbOutJson');
      const outLine = document.getElementById('onbOutLine');
      if (!idEl || !outCli || !outJson || !outLine) return;

      const rawLid = (idEl.value || '').replace(/[^0-9]+/g, '');
      const lid = rawLid || '<LEAGUE_ID>';
      const tierNum = (tierEl && Number(tierEl.value) === 2) ? 2 : 1;
      const plan = planEl ? planEl.value : 'standard';
      const prizeModel = prizeEl ? prizeEl.value : 'weekly';
      const currency = (currencyEl && currencyEl.value === 'USD') ? 'USD' : 'THB';
      const weeklyLbl = document.getElementById('onbWeeklyPrizeLbl');
      if (weeklyLbl) {
        weeklyLbl.textContent = getLang() === 'en'
          ? ('Weekly Prize (' + currency + ')')
          : ('รางวัล/สัปดาห์ (' + (currency === 'USD' ? 'USD' : 'บาท') + ')');
      }
      const weeklyVal = parseInt((weeklyEl ? weeklyEl.value : '300').replace(/[^0-9]+/g, ''), 10) || 0;
      const accessStatus = statusEl ? statusEl.value : 'active';
      const entryFeeRaw = (entryFeeEl && entryFeeEl.value) ? entryFeeEl.value.trim() : '';
      const totalPoolRaw = (totalPoolEl && totalPoolEl.value) ? totalPoolEl.value.trim() : '';
      const seasonPrizesRaw = (seasonPrizesEl && seasonPrizesEl.value) ? seasonPrizesEl.value.trim() : '';
      const cupPrizeRaw = (cupPrizeEl && cupPrizeEl.value) ? cupPrizeEl.value.trim() : '';
      const penaltyTiersRaw = (penaltyTiersEl && penaltyTiersEl.value) ? penaltyTiersEl.value.trim() : '300,200,100';
      const monthlyChampVal = parseInt((monthlyChampEl ? monthlyChampEl.value : '600').replace(/[^0-9]+/g, ''), 10) || 0;
      const monthlyRunnerVal = parseInt((monthlyRunnerEl ? monthlyRunnerEl.value : '400').replace(/[^0-9]+/g, ''), 10) || 0;
      const tenantGroup = (tenantEl && tenantEl.value.trim()) ? tenantEl.value.trim() : ('private_' + lid);
      const visibility = visEl ? visEl.value : 'private';
      const expiresVal = (expiresEl && expiresEl.value) ? expiresEl.value.trim() : '';
      const noCup = Boolean(noCupEl && noCupEl.checked);
      const detectedName = (onbInspectedLeague && onbInspectedLeague.league && onbInspectedLeague.league.name)
        ? onbInspectedLeague.league.name
        : ('League ' + lid);
      const shortName = (shortEl && shortEl.value.trim()) ? shortEl.value.trim() : detectedName.slice(0, 12).trim();
      const nonPrizeArr = Array.from(onbExcludedEntryIds);

      if (penaltyWrapEl) {
        penaltyWrapEl.classList.toggle('hidden', prizeModel !== 'penalties');
      }
      if (monthlyWrapEl) {
        monthlyWrapEl.classList.toggle('hidden', prizeModel !== 'monthly');
      }
      if (cupPrizeEl) {
        cupPrizeEl.disabled = noCup;
        cupPrizeEl.classList.toggle('opacity-50', noCup);
      }

      const cliParts = [
        'python3 onboard_league.py',
        '--league-id ' + lid,
        '--tier ' + tierNum,
        '--plan ' + plan,
        '--prize-model ' + prizeModel,
        '--currency ' + currency,
        '--weekly-prize ' + (prizeModel === 'monthly' ? (monthlyChampVal + monthlyRunnerVal) : weeklyVal),
        '--tenant-group ' + tenantGroup,
        '--visibility ' + visibility,
        '--status ' + accessStatus
      ];
      if (shortName) cliParts.push('--short-name "' + shortName.replace(/"/g, '') + '"');
      if (entryFeeRaw) cliParts.push('--entry-fee "' + entryFeeRaw.replace(/"/g, '') + '"');
      if (totalPoolRaw) cliParts.push('--total-pool "' + totalPoolRaw.replace(/"/g, '') + '"');
      if (seasonPrizesRaw) cliParts.push('--season-prizes "' + seasonPrizesRaw.replace(/"/g, '') + '"');
      if (cupPrizeRaw && !noCup) cliParts.push('--cup-prize "' + cupPrizeRaw.replace(/"/g, '') + '"');
      if (prizeModel === 'penalties' && penaltyTiersRaw) {
        cliParts.push('--penalty-tiers "' + penaltyTiersRaw.replace(/"/g, '') + '"');
      }
      if (prizeModel === 'monthly') {
        cliParts.push('--monthly-champ ' + monthlyChampVal);
        cliParts.push('--monthly-runner ' + monthlyRunnerVal);
      }
      if (expiresVal) cliParts.push('--expires-at ' + expiresVal);
      if (noCup) cliParts.push('--no-cup');
      if (nonPrizeArr.length > 0) cliParts.push('--non-prize-teams ' + nonPrizeArr.join(','));
      outCli.value = cliParts.join(' ');

      const cfgObj = {};
      const isWeeklyLike = (prizeModel === 'weekly' || prizeModel === 'penalties');
      const featObj = {
        prize_model: isWeeklyLike ? 'weekly' : (prizeModel === 'monthly' ? 'monthly' : 'standard'),
        currency: currency,
        has_weekly_prizes: isWeeklyLike,
        has_monthly_prizes: prizeModel === 'monthly',
        has_weekly_penalties: prizeModel === 'penalties',
        has_settlement_phases: false,
        has_cup: !noCup
      };
      if (isWeeklyLike && weeklyVal > 0) {
        featObj.weekly_prize_amount = weeklyVal;
      } else if (prizeModel === 'monthly') {
        featObj.monthly_prize_amount = monthlyChampVal + monthlyRunnerVal;
      }
      if (prizeModel === 'penalties') {
        const parsedTiers = {};
        penaltyTiersRaw.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0).forEach((val, idx) => {
          parsedTiers['last_' + (idx + 1)] = val;
        });
        if (Object.keys(parsedTiers).length > 0) {
          featObj.weekly_penalty_tiers = parsedTiers;
        }
      }
      const leagueRecord = {
        id: rawLid ? Number(rawLid) : '<LEAGUE_ID>',
        season: '2026/27',
        name: detectedName,
        short_name: shortName,
        tier: tierNum,
        plan: plan,
        status: accessStatus,
        currency: currency,
        tenant_group: tenantGroup,
        visibility: visibility,
        non_prize_teams: nonPrizeArr,
        features: featObj
      };
      const fmtPreviewMoney = (raw, sufTh, sufEn) => {
        const clean = String(raw || '').replace(/,/g, '').trim();
        if (/^\d+$/.test(clean)) {
          const n = Number(clean).toLocaleString();
          return {
            th: n + ' ' + currency + (sufTh || ''),
            en: (currency === 'USD' ? ('$' + n) : (n + ' THB')) + (sufEn || '')
          };
        }
        return { th: raw, en: raw };
      };
      if (entryFeeRaw) {
        const ef = fmtPreviewMoney(entryFeeRaw, '/ทีม', '/team');
        leagueRecord.entry_fee = ef.th;
        leagueRecord.entry_fee_en = ef.en;
      }
      if (totalPoolRaw) {
        const tp = fmtPreviewMoney(totalPoolRaw, '', '');
        leagueRecord.total_pool = tp.th;
        leagueRecord.total_pool_en = tp.en;
      }
      if (seasonPrizesRaw) {
        const spObj = {};
        seasonPrizesRaw.split(',').forEach((pair) => {
          const parts = pair.split(':');
          if (parts.length === 2) {
            const k = parts[0].trim();
            const v = parts[1].trim();
            if (k && v) spObj[k] = fmtPreviewMoney(v, '', '').th;
          }
        });
        if (Object.keys(spObj).length > 0) leagueRecord.season_prizes = spObj;
      }
      if (cupPrizeRaw && !noCup) {
        const cpParts = cupPrizeRaw.split('/');
        if (cpParts[0] && cpParts[0].trim()) {
          leagueRecord.cup_champion_prize = fmtPreviewMoney(cpParts[0].trim(), '', '').th;
        }
        if (cpParts[1] && cpParts[1].trim()) {
          leagueRecord.cup_runner_up_prize = fmtPreviewMoney(cpParts[1].trim(), '', '').th;
        }
      }
      if (expiresVal) leagueRecord.expires_at = expiresVal;
      cfgObj[lid] = leagueRecord;
      outJson.value = JSON.stringify(cfgObj, null, 2);

      const urlStr = 'https://www.fplsawadika.com/' + lid + '/';
      if (getLang() === 'en') {
        outLine.value = 'FPLSaWaDiKa Dashboard is ready for ' + detectedName + ' (ID ' + lid + ')!\\n'
          + 'URL: ' + urlStr + '\\n'
          + 'Plan: ' + plan.toUpperCase() + ' (' + currency + ') | Status: ' + accessStatus + (expiresVal ? (' (valid til ' + expiresVal + ')') : '') + '\\n'
          + 'Private & hidden from search engines (noindex). Bookmark on your home screen for live GW matchday updates!';
      } else {
        outLine.value = 'เปิดระบบ FPLSaWaDiKa สำหรับลีก "' + detectedName + '" (ID: ' + lid + ') เรียบร้อยแล้วครับ!\\n'
          + 'ลิงก์เข้าดูคะแนนสด: ' + urlStr + '\\n'
          + 'แพ็กเกจ: ' + plan.toUpperCase() + ' (' + currency + ') | สถานะ: ' + accessStatus + (expiresVal ? (' (ใช้งานได้ถึง ' + expiresVal + ')') : '') + '\\n'
          + 'หมายเหตุ: ลิงก์นี้ตั้งค่า Private (noindex) เพื่อความเป็นส่วนตัวเฉพาะสมาชิกในกลุ่ม LINE ครับ';
      }
    }

    function renderInspectedTeams(payload) {
      const wrap = document.getElementById('onbInspectResult');
      const titleEl = document.getElementById('onbLeagueNameTitle');
      const metaEl = document.getElementById('onbLeagueMetaLine');
      const badgeEl = document.getElementById('onbTierBadge');
      const grid = document.getElementById('onbTeamsGrid');
      if (!wrap || !titleEl || !metaEl || !badgeEl || !grid) return;

      const league = payload.league || {};
      const count = Number(payload.team_count || 0);
      const needsTier2 = count > 30 || Boolean(payload.has_more_pages);
      const countLabel = payload.has_more_than_100 ? '100+ teams' : (payload.has_more_pages ? count + '+ teams' : count + ' teams');
      titleEl.textContent = (league.name || ('League ' + league.id)) + ' (ID: ' + (league.id || '-') + ')';
      metaEl.textContent = countLabel + ' · ' + (needsTier2 ? (count > 3000 ? 'Tier 2 Standings + On-Demand (>3,000 cap)' : 'Tier 2 Auto-Picks Live (31–3,000 teams)') : 'Fits Tier 1 Standard Package (<=30 teams)');
      badgeEl.className = needsTier2
        ? 'px-2.5 py-1 rounded-md text-xs font-semibold mono bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
        : 'px-2.5 py-1 rounded-md text-xs font-semibold mono bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30';
      badgeEl.textContent = needsTier2 ? (count > 3000 ? 'Tier 2 Standings (>3,000)' : 'Tier 2 Auto-Picks (31+)') : 'Tier 1 Standard Ready (<=30)';

      const tierSelect = document.getElementById('onbTier');
      const planSelect = document.getElementById('onbPlan');
      if (tierSelect) tierSelect.value = needsTier2 ? '2' : '1';
      if (planSelect) planSelect.value = needsTier2 ? 'tier2_quote' : 'standard';

      grid.innerHTML = '';
      (payload.teams || []).forEach((team) => {
        const label = document.createElement('label');
        label.className = 'flex items-center gap-2 p-2 rounded-lg border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-xs cursor-pointer';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = String(team.entry);
        cb.checked = onbExcludedEntryIds.has(Number(team.entry));
        cb.className = 'rounded border-slate-400 text-emerald-600 focus:ring-emerald-500';
        cb.addEventListener('change', () => {
          const eid = Number(cb.value);
          if (cb.checked) onbExcludedEntryIds.add(eid);
          else onbExcludedEntryIds.delete(eid);
          refreshOnboardingOutputs();
        });
        const span = document.createElement('span');
        span.className = 'truncate text-slate-800 dark:text-neutral-200';
        span.textContent = (team.entry_name || ('Team ' + team.entry)) + ' (' + (team.player_name || team.entry) + ')';
        label.appendChild(cb);
        label.appendChild(span);
        grid.appendChild(label);
      });

      wrap.classList.remove('hidden');
      const shortInput = document.getElementById('onbShortName');
      if (shortInput && !shortInput.value.trim() && league.name) {
        shortInput.value = String(league.name).slice(0, 12).trim();
      }
      const tenantInput = document.getElementById('onbTenantGroup');
      if (tenantInput && !tenantInput.value.trim() && league.id) {
        tenantInput.value = 'private_' + String(league.id);
      }
      refreshOnboardingOutputs();
    }

    async function inspectCustomerLeague() {
      const idEl = document.getElementById('onbLeagueId');
      const btn = document.getElementById('btnOnbInspect');
      if (!idEl) return;
      const lid = (idEl.value || '').trim();
      if (!/^[0-9]{1,10}$/.test(lid)) {
        setOnbStatusMessage(getLang() === 'en' ? 'Please enter digits only for FPL League ID.' : 'กรุณากรอก FPL League ID เป็นตัวเลขเท่านั้น', true);
        return;
      }
      const prevLid = (onbInspectedLeague && onbInspectedLeague.league && onbInspectedLeague.league.id)
        ? String(onbInspectedLeague.league.id)
        : '';
      if (prevLid && prevLid !== lid) {
        const shortInput = document.getElementById('onbShortName');
        const tenantInput = document.getElementById('onbTenantGroup');
        if (shortInput) shortInput.value = '';
        if (tenantInput) tenantInput.value = '';
      }
      if (btn) btn.disabled = true;
      setOnbStatusMessage(getLang() === 'en' ? 'Inspecting FPL league ' + lid + '...' : 'กำลังดึงข้อมูลลีก ' + lid + ' จาก FPL API...', false);
      try {
        const resp = await fetch('/api/admin/inspect-league?id=' + encodeURIComponent(lid), { credentials: 'same-origin' });
        const payload = await resp.json();
        if (!resp.ok || !payload.success) {
          throw new Error(payload.error || ('HTTP ' + resp.status));
        }
        onbInspectedLeague = payload;
        onbExcludedEntryIds = new Set();
        renderInspectedTeams(payload);
        setOnbStatusMessage(
          getLang() === 'en'
            ? 'Loaded "' + payload.league.name + '" (' + payload.team_count + ' teams).'
            : 'ดึงข้อมูลลีก "' + payload.league.name + '" สำเร็จ (' + payload.team_count + ' ทีม)',
          false
        );
      } catch (err) {
        setOnbStatusMessage(err.message || 'Failed to inspect league', true);
      } finally {
        if (btn) btn.disabled = false;
      }
    }

    function initOnboardingWizard() {
      const btn = document.getElementById('btnOnbInspect');
      if (btn) btn.addEventListener('click', inspectCustomerLeague);
      const statusEl = document.getElementById('onbStatus');
      const expiresEl = document.getElementById('onbExpiresAt');
      if (statusEl && expiresEl) {
        statusEl.addEventListener('change', () => {
          if (statusEl.value === 'trial' && !expiresEl.value) {
            expiresEl.value = getDefaultTrialExpiryIso(14);
          }
          refreshOnboardingOutputs();
        });
      }
      [
        'onbLeagueId', 'onbTier', 'onbPlan', 'onbPrizeModel', 'onbWeeklyPrize', 'onbStatus',
        'onbCurrency', 'onbEntryFee', 'onbTotalPool', 'onbSeasonPrizes', 'onbCupPrize',
        'onbPenaltyTiers', 'onbMonthlyChamp', 'onbMonthlyRunner',
        'onbTenantGroup', 'onbVisibility', 'onbShortName', 'onbExpiresAt', 'onbNoCup'
      ].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          el.addEventListener('input', refreshOnboardingOutputs);
          el.addEventListener('change', refreshOnboardingOutputs);
        }
      });
      document.querySelectorAll('.onb-copy-btn').forEach((copyBtn) => {
        copyBtn.addEventListener('click', async () => {
          const targetId = copyBtn.getAttribute('data-copy-target');
          const ta = targetId ? document.getElementById(targetId) : null;
          if (!ta) return;
          try {
            await navigator.clipboard.writeText(ta.value);
            const prev = copyBtn.textContent;
            copyBtn.textContent = getLang() === 'en' ? 'Copied!' : 'คัดลอกแล้ว';
            setTimeout(() => { copyBtn.textContent = prev; }, 1400);
          } catch (_) {}
        });
      });
      refreshOnboardingOutputs();
    }

    // =========================================================================
    // 10. CUSTOMER ORDERS & PROMPTPAY SLIP INBOX (Cloudflare D1)
    // =========================================================================
    let currentOrderFilter = 'all';
    let ordersListCache = [];
    let ordersCountsCache = {};
    let ordersStatsCache = {};
    let selectedOrderObj = null;
    let paymentSettingsCache = null;
    let stagedPaymentQrDataUrl = '';
    let paymentQrInFlight = false;

    function setPaymentQrFeedback(msg, isError) {
      const el = document.getElementById('payQrFeedback');
      if (!el) return;
      if (!msg) {
        el.classList.add('hidden');
        el.textContent = '';
        return;
      }
      el.className = isError
        ? 'p-2.5 rounded-lg text-xs border border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300'
        : 'p-2.5 rounded-lg text-xs border border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
      el.textContent = msg;
      el.classList.remove('hidden');
    }

    function renderPaymentSettingsUI(cfg) {
      if (!cfg) return;
      const isEn = getLang() === 'en';
      const badge = document.getElementById('payQrModeBadge');
      const acctInput = document.getElementById('payQrAccountNameInput');
      const prevEmpty = document.getElementById('payQrPreviewEmpty');
      const prevImg = document.getElementById('payQrPreviewImg');
      const clearBtn = document.getElementById('btnClearPaymentQr');
      const updatedEl = document.getElementById('payQrUpdatedAt');

      if (badge) {
        if (cfg.mode === 'static_qr') {
          badge.textContent = isEn ? 'Static QR Active ✓' : 'โหมดรูป QR ส่วนตัวพร้อมใช้ ✓';
          badge.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30 whitespace-nowrap';
        } else if (cfg.mode === 'dynamic_qr') {
          badge.textContent = isEn ? 'Dynamic Secret Fallback' : 'ใช้ PromptPay Secret สำรอง';
          badge.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30 whitespace-nowrap';
        } else {
          badge.textContent = isEn ? 'Not Configured' : 'ยังไม่ตั้งค่ารูป QR';
          badge.className = 'px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30 whitespace-nowrap';
        }
      }

      if (acctInput && document.activeElement !== acctInput) {
        acctInput.value = String(cfg.account_name || '');
      }

      const displaySrc = stagedPaymentQrDataUrl || (cfg.qr_data_url ? String(cfg.qr_data_url) : '');
      const hasValidSrc = /^data:image\\/(png|jpeg|jpg|webp);base64,/i.test(displaySrc);
      if (prevImg && prevEmpty) {
        if (hasValidSrc) {
          prevImg.src = displaySrc;
          prevImg.classList.remove('hidden');
          prevEmpty.classList.add('hidden');
        } else {
          prevImg.classList.add('hidden');
          prevImg.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
          prevEmpty.classList.remove('hidden');
        }
      }

      if (clearBtn) {
        clearBtn.classList.toggle('hidden', !cfg.has_static_qr);
      }

      if (updatedEl) {
        if (cfg.updated_at) {
          const parsed = new Date(cfg.updated_at.indexOf('T') !== -1 ? cfg.updated_at : cfg.updated_at.replace(' ', 'T') + 'Z');
          updatedEl.textContent = (isEn ? 'Saved: ' : 'บันทึกล่าสุด: ') + (isNaN(parsed.getTime()) ? String(cfg.updated_at) : parsed.toLocaleString(isEn ? 'en-US' : 'th-TH'));
        } else {
          updatedEl.textContent = '';
        }
      }
    }

    function handlePaymentQrFile(file) {
      const isEn = getLang() === 'en';
      const metaEl = document.getElementById('payQrFileMeta');
      stagedPaymentQrDataUrl = '';
      setPaymentQrFeedback('', false);
      if (metaEl) metaEl.textContent = '';
      if (!file) {
        if (paymentSettingsCache) renderPaymentSettingsUI(paymentSettingsCache);
        return;
      }
      if (!/^image\\/(png|jpeg|jpg|webp)$/i.test(file.type || '')) {
        setPaymentQrFeedback(isEn ? 'Please select a .png, .jpg, or .webp image file.' : 'กรุณาเลือกไฟล์รูปภาพ .png, .jpg หรือ .webp เท่านั้น', true);
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setPaymentQrFeedback(isEn ? 'Image file exceeds 15MB limit.' : 'ขนาดไฟล์ใหญ่เกินไป (ไม่เกิน 15MB)', true);
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const rawSrc = typeof reader.result === 'string' ? reader.result : '';
        if (!rawSrc) {
          setPaymentQrFeedback(isEn ? 'Unable to read this image file.' : 'ไม่สามารถอ่านไฟล์รูปภาพนี้ได้ กรุณาลองไฟล์อื่น', true);
          return;
        }
        const img = new Image();
        img.onload = () => {
          const renderScaled = (maxDim, mime, quality) => {
            const longest = Math.max(img.width || 1, img.height || 1);
            const scale = longest > maxDim ? (maxDim / longest) : 1;
            const tw = Math.max(1, Math.round((img.width || 1) * scale));
            const th = Math.max(1, Math.round((img.height || 1) * scale));
            const cvs = document.createElement('canvas');
            cvs.width = tw;
            cvs.height = th;
            const ctx = cvs.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, tw, th);
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, tw, th);
            return mime === 'image/png' ? cvs.toDataURL('image/png') : cvs.toDataURL('image/jpeg', quality);
          };
          let dataUrl = renderScaled(720, 'image/png', 1);
          if (dataUrl.length > 280000) dataUrl = renderScaled(720, 'image/jpeg', 0.92);
          if (dataUrl.length > 360000) dataUrl = renderScaled(600, 'image/jpeg', 0.86);
          if (dataUrl.length > 380000) {
            setPaymentQrFeedback(isEn ? 'Compressed QR image is still too large. Please crop closely around the QR code.' : 'รูปภาพยังมีขนาดใหญ่เกินกำหนด กรุณาครอปให้กระชับรอบตัว QR แล้วลองใหม่', true);
            return;
          }
          stagedPaymentQrDataUrl = dataUrl;
          const kb = Math.round((dataUrl.length * 0.75) / 1024);
          if (metaEl) {
            metaEl.textContent = (isEn ? 'Staged: ' : 'เตรียมอัปโหลด: ') + file.name + ' (' + kb + ' KB)';
          }
          const prevEmpty = document.getElementById('payQrPreviewEmpty');
          const prevImg = document.getElementById('payQrPreviewImg');
          if (prevImg && prevEmpty) {
            prevImg.src = dataUrl;
            prevImg.classList.remove('hidden');
            prevEmpty.classList.add('hidden');
          }
        };
        img.onerror = () => {
          setPaymentQrFeedback(isEn ? 'Unable to decode this image file.' : 'ไม่สามารถอ่านไฟล์รูปภาพนี้ได้ กรุณาลองไฟล์อื่น', true);
        };
        img.src = rawSrc;
      };
      reader.onerror = () => {
        setPaymentQrFeedback(isEn ? 'Unable to read this image file.' : 'ไม่สามารถอ่านไฟล์รูปภาพนี้ได้ กรุณาลองไฟล์อื่น', true);
      };
      reader.readAsDataURL(file);
    }

    async function loadPaymentSettings() {
      try {
        const res = await fetch('/api/admin/payment-settings', { credentials: 'same-origin' });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data || !data.success) {
          throw new Error((data && data.error) || ('HTTP ' + res.status));
        }
        paymentSettingsCache = data;
        renderPaymentSettingsUI(data);
      } catch (err) {
        setPaymentQrFeedback((err && err.message) || 'Failed to load QR settings', true);
      }
    }

    async function savePaymentSettings() {
      if (paymentQrInFlight) return;
      const isEn = getLang() === 'en';
      const saveBtn = document.getElementById('btnSavePaymentQr');
      const clearBtn = document.getElementById('btnClearPaymentQr');
      const acctInput = document.getElementById('payQrAccountNameInput');
      const fileInput = document.getElementById('payQrFileInput');
      const metaEl = document.getElementById('payQrFileMeta');
      const acctVal = acctInput ? acctInput.value.trim() : '';

      paymentQrInFlight = true;
      if (saveBtn) saveBtn.disabled = true;
      if (clearBtn) clearBtn.disabled = true;
      setPaymentQrFeedback(isEn ? 'Saving QR settings…' : 'กำลังบันทึกการตั้งค่า QR…', false);
      try {
        const payload = { account_name: acctVal };
        if (stagedPaymentQrDataUrl) {
          payload.qr_data_url = stagedPaymentQrDataUrl;
        }
        const res = await fetch('/api/admin/payment-settings', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data || !data.success) {
          throw new Error((data && data.error) || ('HTTP ' + res.status));
        }
        stagedPaymentQrDataUrl = '';
        if (fileInput) fileInput.value = '';
        if (metaEl) metaEl.textContent = '';
        paymentSettingsCache = data;
        renderPaymentSettingsUI(data);
        const msg = isEn ? 'Payment QR settings saved to Cloudflare D1 ✓' : 'บันทึกการตั้งค่า QR ลง Cloudflare D1 เรียบร้อย ✓';
        setPaymentQrFeedback(msg, false);
        showToast(msg);
      } catch (err) {
        const msg = (err && err.message) || 'Failed to save QR settings';
        setPaymentQrFeedback(msg, true);
        showToast(msg, true);
      } finally {
        paymentQrInFlight = false;
        if (saveBtn) saveBtn.disabled = false;
        if (clearBtn) clearBtn.disabled = false;
      }
    }

    async function clearPaymentQr() {
      if (paymentQrInFlight) return;
      const isEn = getLang() === 'en';
      const saveBtn = document.getElementById('btnSavePaymentQr');
      const clearBtn = document.getElementById('btnClearPaymentQr');
      const acctInput = document.getElementById('payQrAccountNameInput');
      const fileInput = document.getElementById('payQrFileInput');
      const metaEl = document.getElementById('payQrFileMeta');
      const acctVal = acctInput ? acctInput.value.trim() : '';

      paymentQrInFlight = true;
      if (saveBtn) saveBtn.disabled = true;
      if (clearBtn) clearBtn.disabled = true;
      setPaymentQrFeedback(isEn ? 'Removing stored QR image…' : 'กำลังลบรูป QR จากฐานข้อมูล…', false);
      try {
        const res = await fetch('/api/admin/payment-settings', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clear_qr: true, account_name: acctVal })
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data || !data.success) {
          throw new Error((data && data.error) || ('HTTP ' + res.status));
        }
        stagedPaymentQrDataUrl = '';
        if (fileInput) fileInput.value = '';
        if (metaEl) metaEl.textContent = '';
        paymentSettingsCache = data;
        renderPaymentSettingsUI(data);
        const msg = isEn ? 'Stored QR image removed ✓' : 'ลบรูป QR ออกจากฐานข้อมูลเรียบร้อย ✓';
        setPaymentQrFeedback(msg, false);
        showToast(msg);
      } catch (err) {
        const msg = (err && err.message) || 'Failed to remove QR image';
        setPaymentQrFeedback(msg, true);
        showToast(msg, true);
      } finally {
        paymentQrInFlight = false;
        if (saveBtn) saveBtn.disabled = false;
        if (clearBtn) clearBtn.disabled = false;
      }
    }

    function getOrderStatusMeta(status, lang) {
      const isEn = lang === 'en';
      const map = {
        awaiting_payment: { label: isEn ? 'Awaiting QR' : 'รอโอน QR', cls: 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-500/30' },
        slip_submitted: { label: isEn ? 'Slip Submitted' : 'ส่งสลิปแล้ว', cls: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40' },
        paid: { label: isEn ? 'Paid' : 'ยืนยันยอดแล้ว', cls: 'bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30' },
        live: { label: isEn ? 'Live' : 'เปิดลีกแล้ว', cls: 'bg-emerald-700 text-white border border-emerald-600' },
        quote_requested: { label: isEn ? 'Quote / USD' : 'ขอราคา / USD', cls: 'bg-sky-500/15 text-sky-800 dark:text-sky-300 border border-sky-500/30' },
        rejected: { label: isEn ? 'Rejected' : 'ปฏิเสธสลิป', cls: 'bg-rose-500/15 text-rose-800 dark:text-rose-300 border border-rose-500/30' },
        expired: { label: isEn ? 'Expired' : 'หมดอายุ', cls: 'bg-slate-500/15 text-slate-700 dark:text-neutral-300 border border-slate-500/30' }
      };
      return map[status] || map.awaiting_payment;
    }

    function setOrderActionFeedback(msg, isError) {
      const el = document.getElementById('orderActionFeedback');
      if (!el) return;
      if (!msg) {
        el.classList.add('hidden');
        el.textContent = '';
        return;
      }
      el.className = isError
        ? 'p-3 rounded-lg text-xs border border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-300'
        : 'p-3 rounded-lg text-xs border border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300';
      el.textContent = msg;
      el.classList.remove('hidden');
    }

    function getSafeAdminOrderPayUrl(rawUrl) {
      const s = String(rawUrl || '').trim();
      return /^https?:\\/\\/[^<>\\s"']+$/i.test(s) ? s : '';
    }

    function renderOrderStatsMonitor() {
      const st = ordersStatsCache || {};
      const setTxt = (id, val) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(val);
      };
      setTxt('ordStatTotal', Number(st.total_recorded || 0).toLocaleString());
      setTxt('ordStatPaidLive', Number(st.paid_or_live || 0).toLocaleString());
      setTxt('ordStatConvPct', String(Number(st.conversion_pct || 0)) + '%');
      setTxt('ordStatActive', Number(st.active_pending || 0).toLocaleString());
      setTxt('ordStatExpiredTotal', Number(st.expired_unpaid_total || 0).toLocaleString());
    }

    function renderOrderFilterButtons() {
      const btns = document.querySelectorAll('.ord-filter-btn');
      btns.forEach((btn) => {
        const f = btn.getAttribute('data-order-filter') || 'all';
        const active = f === currentOrderFilter;
        btn.className = 'ord-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg border text-xs font-semibold whitespace-nowrap transition-colors ' + (active
          ? 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300'
          : 'border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark text-slate-700 dark:text-neutral-300 hover:bg-raisedLight dark:hover:bg-raisedDark');
      });
      ['all', 'slip_submitted', 'awaiting_payment', 'paid', 'quote_requested', 'live', 'rejected'].forEach((k) => {
        const cEl = document.getElementById('ordCnt_' + k);
        if (cEl) cEl.textContent = String(ordersCountsCache[k] || 0);
      });
      const pendingBadge = document.getElementById('navOrderPendingBadge');
      if (pendingBadge) {
        const pendingCnt = (ordersCountsCache.slip_submitted || 0) + (ordersCountsCache.quote_requested || 0);
        pendingBadge.textContent = String(pendingCnt);
        pendingBadge.classList.toggle('hidden', pendingCnt <= 0);
      }
    }

    function renderOrdersTable() {
      const tbody = document.getElementById('ordersTableBody');
      if (!tbody) return;
      const lang = getLang();
      const isEn = lang === 'en';
      tbody.innerHTML = '';

      if (!ordersListCache.length) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 7;
        td.className = 'px-4 py-8 text-center text-xs text-slate-500 dark:text-neutral-400';
        td.textContent = isEn ? 'No orders in this filter yet.' : 'ยังไม่มีรายการคำสั่งซื้อในสถานะนี้';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
      }

      ordersListCache.forEach((o) => {
        const tr = document.createElement('tr');
        const isSel = selectedOrderObj && selectedOrderObj.order_id === o.order_id;
        tr.className = (isSel ? 'bg-sky-500/10 ' : 'hover:bg-raisedLight/60 dark:hover:bg-raisedDark/60 ') + 'transition-colors';

        const tdId = document.createElement('td');
        tdId.className = 'px-4 py-3 font-mono font-semibold whitespace-nowrap';
        const safePayUrl = getSafeAdminOrderPayUrl(o.customer_pay_url);
        if (safePayUrl) {
          const a = document.createElement('a');
          a.href = safePayUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'text-sky-700 dark:text-sky-300 hover:underline underline-offset-2';
          a.title = isEn ? 'Open customer checkout/tracking page' : 'เปิดหน้าชำระเงิน/ติดตามสถานะของลูกค้า';
          a.textContent = String(o.order_id || '') + ' ↗';
          tdId.appendChild(a);
        } else {
          const sp = document.createElement('span');
          sp.className = 'text-slate-900 dark:text-white';
          sp.textContent = String(o.order_id || '');
          tdId.appendChild(sp);
        }
        tr.appendChild(tdId);

        const tdLeague = document.createElement('td');
        tdLeague.className = 'px-4 py-3 text-slate-800 dark:text-neutral-200';
        const lName = document.createElement('div');
        lName.className = 'font-medium';
        lName.textContent = o.league_name ? (o.league_name + ' (ID: ' + o.league_id + ')') : ('League ' + o.league_id);
        const lMeta = document.createElement('div');
        lMeta.className = 'text-xs text-slate-600 dark:text-neutral-400';
        lMeta.textContent = (o.team_count ? (o.team_count + (isEn ? ' teams · ' : ' ทีม · ')) : '') + String(o.plan || 'standard');
        tdLeague.appendChild(lName);
        tdLeague.appendChild(lMeta);
        tr.appendChild(tdLeague);

        const tdAmt = document.createElement('td');
        tdAmt.className = 'px-4 py-3 text-right font-mono font-semibold text-emerald-700 dark:text-emerald-400 whitespace-nowrap';
        tdAmt.textContent = String(o.amount_display || '-');
        tr.appendChild(tdAmt);

        const tdContact = document.createElement('td');
        tdContact.className = 'px-4 py-3 text-slate-700 dark:text-neutral-300';
        const cEmail = document.createElement('div');
        cEmail.className = 'truncate max-w-[180px]';
        cEmail.textContent = String(o.customer_email || '-');
        tdContact.appendChild(cEmail);
        if (o.customer_line) {
          const cLine = document.createElement('div');
          cLine.className = 'text-xs font-mono text-emerald-700 dark:text-emerald-400 truncate max-w-[180px]';
          cLine.textContent = 'LINE: ' + String(o.customer_line);
          tdContact.appendChild(cLine);
        }
        tr.appendChild(tdContact);

        const tdStatus = document.createElement('td');
        tdStatus.className = 'px-4 py-3 whitespace-nowrap';
        const meta = getOrderStatusMeta(o.status, lang);
        const stBadge = document.createElement('span');
        stBadge.className = 'inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ' + meta.cls;
        stBadge.textContent = meta.label;
        tdStatus.appendChild(stBadge);
        if (o.has_slip) {
          const sDot = document.createElement('span');
          sDot.className = 'ml-1.5 text-xs font-mono text-amber-700 dark:text-amber-300';
          sDot.textContent = '[Slip]';
          tdStatus.appendChild(sDot);
        }
        tr.appendChild(tdStatus);

        const tdTime = document.createElement('td');
        tdTime.className = 'px-4 py-3 text-xs font-mono text-slate-600 dark:text-neutral-400 whitespace-nowrap';
        tdTime.textContent = o.created_at ? new Date(o.created_at).toLocaleString(isEn ? 'en-US' : 'th-TH') : '-';
        tr.appendChild(tdTime);

        const tdAct = document.createElement('td');
        tdAct.className = 'px-4 py-3 text-right whitespace-nowrap';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'min-h-[42px] px-3.5 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-800 dark:text-neutral-200 hover:border-sky-500 whitespace-nowrap transition-colors';
        btn.setAttribute('data-inspect-order', String(o.order_id || ''));
        btn.textContent = isEn ? 'Inspect' : 'ตรวจสอบ';
        btn.addEventListener('click', () => selectOrder(o));
        tdAct.appendChild(btn);
        tr.appendChild(tdAct);

        tbody.appendChild(tr);
      });
    }

    async function loadOrderSlipImage(orderId) {
      const emptyEl = document.getElementById('ordDetSlipEmpty');
      const loadEl = document.getElementById('ordDetSlipLoading');
      const imgEl = document.getElementById('orderSlipImg');
      const reloadBtn = document.getElementById('btnLoadOrderSlip');
      if (emptyEl) emptyEl.classList.add('hidden');
      if (imgEl) {
        imgEl.classList.add('hidden');
        imgEl.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
      }
      if (loadEl) loadEl.classList.remove('hidden');
      try {
        const res = await fetch('/api/admin/orders/slip?order=' + encodeURIComponent(orderId), { credentials: 'same-origin' });
        const data = await res.json().catch(() => null);
        if (loadEl) loadEl.classList.add('hidden');
        if (!res.ok || !data || !data.success || !data.slip_data_url) {
          if (emptyEl) {
            emptyEl.textContent = getLang() === 'en' ? 'No slip image attached.' : 'ยังไม่มีรูปสลิปในคำสั่งซื้อนี้';
            emptyEl.classList.remove('hidden');
          }
          if (reloadBtn) reloadBtn.classList.add('hidden');
          return;
        }
        const safeDataUrl = String(data.slip_data_url);
        if (!/^data:image\\/(jpeg|jpg|png|webp);base64,/i.test(safeDataUrl)) {
          throw new Error('Invalid image format');
        }
        if (imgEl) {
          imgEl.src = safeDataUrl;
          imgEl.classList.remove('hidden');
        }
        if (reloadBtn) reloadBtn.classList.remove('hidden');
      } catch (err) {
        if (loadEl) loadEl.classList.add('hidden');
        if (emptyEl) {
          emptyEl.textContent = (err && err.message) || 'Failed to load slip image';
          emptyEl.classList.remove('hidden');
        }
      }
    }

    function copyAdminText(text, okMsg) {
      const val = String(text || '').trim();
      if (!val) return;
      const done = () => {
        if (okMsg) {
          setOrderActionFeedback(okMsg, false);
          showToast(okMsg);
        }
      };
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(val).then(done).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = val;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            done();
          });
          return;
        }
      } catch (_) {}
      const ta = document.createElement('textarea');
      ta.value = val;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch (_) {}
      ta.remove();
      done();
    }

    function buildAdminOrderReplyText(o, lang) {
      const isEn = lang === 'en';
      const oid = String(o.order_id || '-');
      const lid = String(o.league_id || '-');
      const lname = String(o.league_name || ('League ' + lid));
      const amt = String(o.amount_display || '-');
      const payUrl = getSafeAdminOrderPayUrl(o.customer_pay_url);
      const delivUrl = String(o.delivered_url || ('https://www.fplsawadika.com/' + lid + '/'));
      const meta = getOrderStatusMeta(o.status, lang);
      if (isEn) {
        const lines = [
          'FPLSaWaDiKa Order Status Update',
          'Order ID: ' + oid,
          'League: ' + lname + ' (ID: ' + lid + ')',
          'Status: ' + meta.label,
          'Amount: ' + amt,
        ];
        if (o.status === 'live') lines.push('Dashboard Link: ' + delivUrl);
        if (payUrl) lines.push('Order Tracking Page: ' + payUrl);
        return lines.join('\\n');
      }
      const lines = [
        'อัปเดตสถานะคำสั่งซื้อ FPLSaWaDiKa',
        'เลขที่คำสั่งซื้อ: ' + oid,
        'ลีก: ' + lname + ' (ID: ' + lid + ')',
        'สถานะล่าสุด: ' + meta.label,
        'ยอดรายการ: ' + amt,
      ];
      if (o.status === 'live') lines.push('ลิงก์เข้าใช้งานลีก: ' + delivUrl);
      if (payUrl) lines.push('หน้าชำระเงิน/ติดตามสถานะ: ' + payUrl);
      return lines.join('\\n');
    }

    function copyAdminOrderPayLink() {
      if (!selectedOrderObj) return;
      const safeUrl = getSafeAdminOrderPayUrl(selectedOrderObj.customer_pay_url);
      if (!safeUrl) return;
      const isEn = getLang() === 'en';
      copyAdminText(
        safeUrl,
        isEn
          ? ('Copied checkout link for ' + selectedOrderObj.order_id + ' ✓')
          : ('คัดลอกลิงก์หน้าออเดอร์ ' + selectedOrderObj.order_id + ' เรียบร้อย ✓')
      );
    }

    function copyAdminOrderLineReply() {
      if (!selectedOrderObj) return;
      const lang = getLang();
      const msg = buildAdminOrderReplyText(selectedOrderObj, lang);
      copyAdminText(
        msg,
        lang === 'en'
          ? ('Copied status reply for ' + selectedOrderObj.order_id + ' (ready to paste in LINE) ✓')
          : ('คัดลอกข้อความแจ้งสถานะ ' + selectedOrderObj.order_id + ' แล้ว (วางส่ง LINE ได้ทันที) ✓')
      );
    }

    function renderOrderDetail(o) {
      const panel = document.getElementById('orderDetailPanel');
      if (!panel || !o) return;
      const lang = getLang();
      const isEn = lang === 'en';
      const setTxt = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
      };
      const safePayUrl = getSafeAdminOrderPayUrl(o.customer_pay_url);
      const idEl = document.getElementById('ordDetId');
      if (idEl) {
        idEl.textContent = String(o.order_id || '-') + (safePayUrl ? ' ↗' : '');
        idEl.setAttribute('href', safePayUrl || '#');
      }
      const openPayEl = document.getElementById('ordDetOpenPayLink');
      if (openPayEl) {
        openPayEl.setAttribute('href', safePayUrl || '#');
        openPayEl.classList.toggle('hidden', !safePayUrl);
      }
      const copyPayBtn = document.getElementById('btnOrdCopyPayLink');
      if (copyPayBtn) {
        copyPayBtn.disabled = !safePayUrl;
      }

      const meta = getOrderStatusMeta(o.status, lang);
      const badge = document.getElementById('ordDetStatusBadge');
      if (badge) {
        badge.textContent = meta.label;
        badge.className = 'px-2.5 py-1 rounded-full text-xs font-semibold ' + meta.cls;
      }
      setTxt('ordDetLeagueTitle', (o.league_name ? (o.league_name + ' · ') : '') + 'League ID: ' + String(o.league_id || '-') + (o.team_count ? (' (' + o.team_count + (isEn ? ' teams)' : ' ทีม)')) : ''));
      setTxt('ordDetContact', 'Email: ' + String(o.customer_email || '-') + (o.customer_line ? (' · LINE: ' + String(o.customer_line)) : ''));
      setTxt('ordDetAmount', String(o.amount_display || '-'));
      setTxt('ordDetCreated', o.created_at ? new Date(o.created_at).toLocaleString(isEn ? 'en-US' : 'th-TH') : '-');
      setTxt('ordDetRules', o.rules_text ? String(o.rules_text) : (isEn ? '(No custom rules note)' : '(ไม่ได้ระบุรายละเอียดเพิ่มเติม)'));
      setTxt('ordDetSlipUploadedAt', o.slip_uploaded_at ? new Date(o.slip_uploaded_at).toLocaleString(isEn ? 'en-US' : 'th-TH') : '-');

      const emailCustBtn = document.getElementById('btnOrdEmailCustomer');
      if (emailCustBtn) {
        const cleanEmail = String(o.customer_email || '').trim();
        if (cleanEmail && !/[<>\\s]/.test(cleanEmail)) {
          const subj = (isEn ? '[FPLSaWaDiKa] Order Update: ' : '[FPLSaWaDiKa] แจ้งสถานะคำสั่งซื้อ ') + String(o.order_id || '');
          const bodyTxt = buildAdminOrderReplyText(o, lang);
          emailCustBtn.setAttribute('href', 'mailto:' + cleanEmail + '?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(bodyTxt));
          emailCustBtn.classList.remove('hidden');
        } else {
          emailCustBtn.setAttribute('href', '#');
          emailCustBtn.classList.add('hidden');
        }
      }

      const noteIn = document.getElementById('orderAdminNoteInput');
      if (noteIn && noteIn.getAttribute('data-loaded-for') !== o.order_id) {
        noteIn.value = String(o.admin_note || '');
        noteIn.setAttribute('data-loaded-for', String(o.order_id || ''));
      }
      const urlIn = document.getElementById('orderDeliveredUrlInput');
      if (urlIn && urlIn.getAttribute('data-loaded-for') !== o.order_id) {
        urlIn.value = String(o.delivered_url || ('https://www.fplsawadika.com/' + String(o.league_id || '') + '/'));
        urlIn.setAttribute('data-loaded-for', String(o.order_id || ''));
      }
      if (!o.has_slip) {
        const emptyEl = document.getElementById('ordDetSlipEmpty');
        const imgEl = document.getElementById('orderSlipImg');
        const loadEl = document.getElementById('ordDetSlipLoading');
        const reloadBtn = document.getElementById('btnLoadOrderSlip');
        if (loadEl) loadEl.classList.add('hidden');
        if (imgEl) {
          imgEl.classList.add('hidden');
          imgEl.src = 'data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=';
        }
        if (reloadBtn) reloadBtn.classList.add('hidden');
        if (emptyEl) {
          emptyEl.textContent = isEn ? 'No slip image attached yet.' : 'ยังไม่มีรูปสลิปในคำสั่งซื้อนี้';
          emptyEl.classList.remove('hidden');
        }
      }
      panel.classList.remove('hidden');
    }

    function selectOrder(o) {
      if (!o) return;
      selectedOrderObj = o;
      setOrderActionFeedback('', false);
      renderOrdersTable();
      renderOrderDetail(o);
      if (o.has_slip) {
        loadOrderSlipImage(o.order_id);
      }
    }

    function prefillOnboardingFromOrder(o) {
      if (!o) return;
      const lid = String(o.league_id || '').trim();
      const lidEl = document.getElementById('onbLeagueId');
      const planEl = document.getElementById('onbPlan');
      const tierEl = document.getElementById('onbTier');
      const curEl = document.getElementById('onbCurrency');
      const stEl = document.getElementById('onbStatus');
      const visEl = document.getElementById('onbVisibility');
      const tenEl = document.getElementById('onbTenantGroup');
      const shortEl = document.getElementById('onbShortName');
      const isTier2Quote = o.plan === 'tier2_quote';
      if (lidEl) lidEl.value = lid;
      if (planEl) planEl.value = isTier2Quote ? 'tier2_quote' : 'standard';
      if (tierEl) tierEl.value = isTier2Quote ? '2' : '1';
      if (curEl) curEl.value = o.currency === 'USD' ? 'USD' : 'THB';
      if (stEl) stEl.value = 'active';
      if (visEl) visEl.value = 'private';
      if (tenEl) tenEl.value = lid ? ('private_' + lid) : '';
      if (shortEl) shortEl.value = o.league_name ? String(o.league_name).slice(0, 12).trim() : '';
      refreshOnboardingOutputs();
      const sec9 = document.getElementById('sec-onboarding');
      if (sec9) sec9.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (/^[0-9]{1,10}$/.test(lid)) {
        inspectCustomerLeague();
      }
    }

    let orderActionInFlight = false;

    async function submitOrderAction(action) {
      if (!selectedOrderObj || orderActionInFlight) return;
      const isEn = getLang() === 'en';
      const noteEl = document.getElementById('orderAdminNoteInput');
      const urlEl = document.getElementById('orderDeliveredUrlInput');
      const adminNote = noteEl ? noteEl.value.trim() : '';
      const deliveredUrl = urlEl ? urlEl.value.trim() : '';

      if (action === 'reject' && !adminNote) {
        setOrderActionFeedback(isEn ? 'Please enter a rejection reason in Admin Note before rejecting.' : 'กรุณาระบุเหตุผลในช่องบันทึกแอดมินก่อนปฏิเสธสลิป', true);
        if (noteEl) noteEl.focus();
        return;
      }

      const actionBtnIds = ['btnOrdVerifyPaid', 'btnOrdMarkLive', 'btnOrdReject', 'btnOrdDeleteSlip', 'btnOrdPrefillOnb', 'btnOrdDeleteUnpaid', 'btnOrdDeleteTest'];
      orderActionInFlight = true;
      actionBtnIds.forEach((id) => {
        const b = document.getElementById(id);
        if (b) b.disabled = true;
      });
      setOrderActionFeedback(isEn ? 'Saving action…' : 'กำลังบันทึกการดำเนินการ…', false);
      try {
        const oid = selectedOrderObj.order_id;
        const res = await fetch('/api/admin/orders/action', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            order_id: oid,
            action,
            admin_note: adminNote,
            delivered_url: deliveredUrl
          })
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data || !data.success) {
          throw new Error((data && data.error) || ('HTTP ' + res.status));
        }

        if (data.deleted) {
          const delMsg = data.counted_unpaid
            ? (isEn ? ('Deleted unpaid order ' + oid + ' (+stats) ✓') : ('ลบออเดอร์ไม่โอน ' + oid + ' และนับเข้าสถิติเรียบร้อย ✓'))
            : (isEn ? ('Deleted test order ' + oid + ' (stats unchanged) ✓') : ('ลบออเดอร์ทดสอบ ' + oid + ' เรียบร้อย (ไม่นับสถิติ) ✓'));
          selectedOrderObj = null;
          const panel = document.getElementById('orderDetailPanel');
          if (panel) panel.classList.add('hidden');
          showToast(delMsg);
          await loadOrdersData(currentOrderFilter);
          return;
        }

        if (data.status) selectedOrderObj.status = data.status;
        if (data.slip_deleted) selectedOrderObj.has_slip = false;
        if (adminNote) selectedOrderObj.admin_note = adminNote;
        if (data.delivered_url) selectedOrderObj.delivered_url = data.delivered_url;

        let okMsg = '';
        if (action === 'delete_slip') {
          okMsg = isEn ? ('Deleted slip image for ' + oid) : ('ลบรูปสลิปของ ' + oid + ' เรียบร้อย');
        } else {
          okMsg = isEn
            ? ('Updated ' + oid + ' → ' + (data.status || ''))
            : ('อัปเดต ' + oid + ' เป็น ' + (data.status || '') + ' เรียบร้อย');
        }
        if (data.email) {
          if (data.email.sent) {
            okMsg += isEn ? ' (Email sent ✓)' : ' (ส่งอีเมลแจ้งลูกค้าแล้ว ✓)';
          } else {
            const emMode = data.email.mode || data.email.reason || 'disabled';
            okMsg += isEn ? (' (Email NOT sent: ' + emMode + ')') : (' (ยังไม่ได้ส่งอีเมลอัตโนมัติ: ' + emMode + ')');
          }
        }
        renderOrderDetail(selectedOrderObj);
        setOrderActionFeedback(okMsg, false);
        showToast(okMsg);
        await loadOrdersData(currentOrderFilter);
      } catch (err) {
        const msg = (err && err.message) || 'Action failed';
        setOrderActionFeedback(msg, true);
        showToast(msg, true);
      } finally {
        orderActionInFlight = false;
        actionBtnIds.forEach((id) => {
          const b = document.getElementById(id);
          if (b) b.disabled = false;
        });
      }
    }

    let ordersEmailStatusCache = null;

    function renderOrdersEmailBadge() {
      const el = document.getElementById('ordersEmailStatusBadge');
      if (!el || !ordersEmailStatusCache) return;
      const lang = getLang();
      const es = ordersEmailStatusCache;
      if (es.ready) {
        const modeTxt = es.mode === 'resend' ? 'Resend Ready' : 'MailChannels Ready';
        el.className = 'px-2.5 py-1.5 rounded-lg border border-emerald-500/35 bg-emerald-500/10 text-xs mono text-emerald-800 dark:text-emerald-300 whitespace-nowrap';
        el.textContent = lang === 'en' ? ('✓ Email: ' + modeTxt) : ('✓ อีเมลพร้อมส่ง (' + modeTxt + ')');
      } else {
        el.className = 'px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 text-xs mono text-amber-800 dark:text-amber-300 whitespace-nowrap';
        el.textContent = lang === 'en' ? '⚠ Email: Not Configured' : '⚠ อีเมลอัตโนมัติ: ยังไม่ตั้งค่า Key';
      }
    }

    async function loadOrdersData(filterKey) {
      if (filterKey) currentOrderFilter = filterKey;
      renderOrderFilterButtons();
      try {
        const qs = (currentOrderFilter && currentOrderFilter !== 'all')
          ? ('?status=' + encodeURIComponent(currentOrderFilter))
          : '';
        const res = await fetch('/api/admin/orders' + qs, { credentials: 'same-origin' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json().catch(() => null);
        if (!data || !data.success) throw new Error((data && data.error) || 'Failed to load orders');
        ordersListCache = Array.isArray(data.orders) ? data.orders : [];
        ordersCountsCache = data.counts || {};
        ordersStatsCache = data.stats || {};
        if (data.email_status) {
          ordersEmailStatusCache = data.email_status;
          renderOrdersEmailBadge();
        }
        renderOrderStatsMonitor();
        renderOrderFilterButtons();
        if (selectedOrderObj) {
          const fresh = ordersListCache.find((item) => item.order_id === selectedOrderObj.order_id);
          if (fresh) {
            selectedOrderObj = fresh;
            renderOrderDetail(selectedOrderObj);
          } else {
            selectedOrderObj = null;
            const panel = document.getElementById('orderDetailPanel');
            if (panel) panel.classList.add('hidden');
          }
        }
        renderOrdersTable();
      } catch (err) {
        const tbody = document.getElementById('ordersTableBody');
        if (tbody) {
          tbody.innerHTML = '';
          const tr = document.createElement('tr');
          const td = document.createElement('td');
          td.colSpan = 7;
          td.className = 'px-4 py-6 text-center text-xs text-rose-600 dark:text-rose-400';
          td.textContent = (err && err.message) || 'Unable to load orders';
          tr.appendChild(td);
          tbody.appendChild(tr);
        }
      }
    }

    function initOrdersInbox() {
      const qrFileIn = document.getElementById('payQrFileInput');
      if (qrFileIn) {
        qrFileIn.addEventListener('change', (e) => {
          const f = e && e.target && e.target.files ? e.target.files[0] : null;
          handlePaymentQrFile(f);
        });
      }
      const btnSaveQr = document.getElementById('btnSavePaymentQr');
      if (btnSaveQr) btnSaveQr.addEventListener('click', () => savePaymentSettings());
      const btnClearQr = document.getElementById('btnClearPaymentQr');
      if (btnClearQr) btnClearQr.addEventListener('click', () => clearPaymentQr());

      const refBtn = document.getElementById('btnRefreshOrders');
      if (refBtn) refBtn.addEventListener('click', () => loadOrdersData(currentOrderFilter));
      document.querySelectorAll('.ord-filter-btn').forEach((btn) => {
        btn.addEventListener('click', () => {
          const fk = btn.getAttribute('data-order-filter') || 'all';
          loadOrdersData(fk);
        });
      });
      const reloadSlipBtn = document.getElementById('btnLoadOrderSlip');
      if (reloadSlipBtn) {
        reloadSlipBtn.addEventListener('click', () => {
          if (selectedOrderObj) loadOrderSlipImage(selectedOrderObj.order_id);
        });
      }
      const btnCopyPay = document.getElementById('btnOrdCopyPayLink');
      if (btnCopyPay) btnCopyPay.addEventListener('click', () => copyAdminOrderPayLink());
      const btnCopyLine = document.getElementById('btnOrdCopyLineReply');
      if (btnCopyLine) btnCopyLine.addEventListener('click', () => copyAdminOrderLineReply());
      const btnVerify = document.getElementById('btnOrdVerifyPaid');
      if (btnVerify) btnVerify.addEventListener('click', () => submitOrderAction('verify_payment'));
      const btnPrefill = document.getElementById('btnOrdPrefillOnb');
      if (btnPrefill) btnPrefill.addEventListener('click', () => prefillOnboardingFromOrder(selectedOrderObj));
      const btnLive = document.getElementById('btnOrdMarkLive');
      if (btnLive) btnLive.addEventListener('click', () => submitOrderAction('mark_live_and_notify'));
      const btnReject = document.getElementById('btnOrdReject');
      if (btnReject) btnReject.addEventListener('click', () => submitOrderAction('reject'));
      const btnDelSlip = document.getElementById('btnOrdDeleteSlip');
      if (btnDelSlip) btnDelSlip.addEventListener('click', () => submitOrderAction('delete_slip'));
      const btnDelUnpaid = document.getElementById('btnOrdDeleteUnpaid');
      if (btnDelUnpaid) btnDelUnpaid.addEventListener('click', () => submitOrderAction('delete_unpaid'));
      const btnDelTest = document.getElementById('btnOrdDeleteTest');
      if (btnDelTest) btnDelTest.addEventListener('click', () => submitOrderAction('delete_test'));

      const btnTogglePitch = document.getElementById('btnTogglePitchBody');
      if (btnTogglePitch) {
        btnTogglePitch.addEventListener('click', () => {
          const body = document.getElementById('secPitchBody');
          if (!body) return;
          const isHidden = body.classList.toggle('hidden');
          btnTogglePitch.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
          const dict = I18N[getLang()] || I18N.th;
          btnTogglePitch.textContent = dict[isHidden ? 'btn_expand_pitch' : 'btn_collapse_pitch'] || btnTogglePitch.textContent;
        });
      }
      const btnToggleQr = document.getElementById('btnToggleQrBody');
      if (btnToggleQr) {
        btnToggleQr.addEventListener('click', () => {
          const body = document.getElementById('paymentQrSettingsBody');
          if (!body) return;
          const isHidden = body.classList.toggle('hidden');
          btnToggleQr.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
          const dict = I18N[getLang()] || I18N.th;
          btnToggleQr.textContent = dict[isHidden ? 'btn_toggle_qr_show' : 'btn_toggle_qr_hide'] || btnToggleQr.textContent;
        });
      }
    }

    // Keyboard shortcuts (R = Refresh, L = Language, T = Theme)
    document.addEventListener('keydown', (e) => {
      if (!e || typeof e.key !== 'string') return;
      if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === 'l') { e.preventDefault(); toggleLanguage(); }
      else if (k === 't') { e.preventDefault(); toggleTheme(); }
      else if (k === 'r') { e.preventDefault(); triggerLivePitchRefresh(); }
    });

    // Initialize UI on DOM ready
    updateThemeUI();
    initPortfolioLifecycleControls();
    initOrdersInbox();
    setLanguage(document.documentElement.lang || 'th');
    initOnboardingWizard();
    tickCountdown();
    setInterval(tickCountdown, 1000);
    loadLiveData(false);
    loadPaymentSettings();
    loadOrdersData('all');
  </script>
</body>
</html>`;
}

export function renderLoginHtml(errorMessage = '') {
  return `<!DOCTYPE html>
<html lang="th" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>FPL SaWaDiKa — Executive Access Gate</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Sarabun:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['-apple-system', 'BlinkMacSystemFont', 'Sarabun', 'system-ui', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace']
          }
        }
      }
    };
    (function() {
      try {
        var savedTheme = localStorage.getItem('fpl_theme') || 'dark';
        if (savedTheme === 'light') {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        } else {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        }
      } catch (e) {}
    })();
  </script>
  <style>
    body { font-size: 0.875rem; line-height: 1.6; }
    h1 { font-size: 1.5rem; line-height: 1.3; }
  </style>
</head>
<body class="bg-slate-50 dark:bg-[#0b0d11] text-slate-900 dark:text-neutral-100 min-h-screen flex flex-col justify-between p-4 antialiased">
  <header class="max-w-md w-full mx-auto pt-4 flex items-center justify-between">
    <span class="text-xs font-mono text-slate-600 dark:text-neutral-400">admin.fplsawadika.com</span>
    <div class="flex items-center gap-2">
      <button type="button" onclick="toggleLoginLang()" id="loginLangBtn"
        class="min-h-[44px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] text-xs font-mono text-slate-800 dark:text-neutral-200">
        TH / EN
      </button>
      <button type="button" onclick="toggleLoginTheme()" id="loginThemeBtn"
        class="min-h-[44px] px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] text-xs font-mono text-slate-800 dark:text-neutral-200">
        Theme
      </button>
    </div>
  </header>

  <main class="max-w-md w-full mx-auto my-auto py-8">
    <div class="p-6 sm:p-8 rounded-xl border border-slate-200 dark:border-neutral-800 bg-white dark:bg-[#12151c] space-y-6">
      <div class="space-y-2">
        <h1 id="loginTitle" class="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-white">
          เข้าสู่ระบบศูนย์ข้อมูลผู้บริหาร
        </h1>
        <p id="loginSub" class="text-xs sm:text-sm text-slate-600 dark:text-neutral-400 leading-relaxed">
          กรุณายืนยันตัวตนเพื่อเข้าถึงข้อมูลวิเคราะห์ธุรกิจและสถานะระบบของมินิลีกทั้งหมดในระบบ
        </p>
        <div class="inline-flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 pt-1">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span id="loginBadge">Protected Executive Portal</span>
        </div>
      </div>

      ${errorMessage ? `
      <div role="alert" class="p-3.5 rounded-lg border border-rose-500/30 bg-rose-500/10 text-xs text-rose-700 dark:text-rose-300 font-medium">
        ${escapeHtmlAttr(errorMessage)}
      </div>
      ` : ''}

      <form method="POST" action="/login" class="space-y-4">
        <div class="space-y-1.5">
          <label for="tokenInput" id="loginLabel" class="block text-xs font-medium text-slate-700 dark:text-neutral-300">
            รหัสผ่านผู้ดูแลระบบ (Admin Access Key)
          </label>
          <input id="tokenInput" name="passkey" type="password" required autocomplete="current-password"
            placeholder="••••••••••••••••"
            class="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-slate-300 dark:border-neutral-700 bg-slate-50 dark:bg-[#191d26] text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
        </div>

        <button type="submit" id="loginSubmit"
          class="w-full min-h-[44px] px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-sm transition-colors">
          เข้าสู่ระบบ (Sign In)
        </button>
      </form>
    </div>
  </main>

  <footer class="max-w-md w-full mx-auto pb-4 text-center text-xs text-slate-600 dark:text-neutral-400 font-mono">
    FPL SaWaDiKa · Zero-Trust Access Gate
  </footer>

  <script>
    function toggleLoginTheme() {
      var isDark = document.documentElement.classList.toggle('dark');
      var t = isDark ? 'dark' : 'light';
      document.documentElement.style.colorScheme = t;
      try { localStorage.setItem('fpl_theme', t); } catch (e) {}
    }
    function toggleLoginLang() {
      var next = document.documentElement.lang === 'en' ? 'th' : 'en';
      document.documentElement.lang = next;
      try { localStorage.setItem('fpl_lang', next); } catch (e) {}
      document.getElementById('loginTitle').textContent = next === 'en'
        ? 'Executive BI Sign In'
        : 'เข้าสู่ระบบศูนย์ข้อมูลผู้บริหาร';
      document.getElementById('loginSub').textContent = next === 'en'
        ? 'Authenticate to access real-time portfolio economics and cloud telemetry across all configured mini-leagues.'
        : 'กรุณายืนยันตัวตนเพื่อเข้าถึงข้อมูลวิเคราะห์ธุรกิจและสถานะระบบของมินิลีกทั้งหมดในระบบ';
      document.getElementById('loginLabel').textContent = next === 'en'
        ? 'Admin Access Key'
        : 'รหัสผ่านผู้ดูแลระบบ (Admin Access Key)';
      document.getElementById('loginSubmit').textContent = next === 'en'
        ? 'Sign In to Dashboard'
        : 'เข้าสู่ระบบ (Sign In)';
    }
  </script>
</body>
</html>`;
}
