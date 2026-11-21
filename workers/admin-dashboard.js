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
export function renderDashboardHtml(colo = 'BKK', authProvider = 'Cloudflare Zero Trust') {
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
            <span>${colo} Edge</span>
            <span class="hidden md:inline">· ${ADMIN_EMAIL}</span>
          </div>
        </div>
      </div>

      <!-- Right Action Controls (All >= 42x42px touch targets) -->
      <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">

        <!-- Quick League Switcher (Connects directly to Commercial Landing Page, Demo Hub, and all 9 leagues) -->
        <div class="relative">
          <label for="quickLeagueSelect" class="sr-only" data-i18n="nav_jump_league_label">ทางลัดเปิดหน้าขาย เดโม และมินิลีก</label>
          <select id="quickLeagueSelect" onchange="jumpToLeague(this.value)"
            class="min-h-[42px] px-2.5 sm:px-3 py-1.5 rounded-lg border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-raisedDark text-slate-800 dark:text-neutral-200 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 transition-colors duration-150 cursor-pointer max-w-[140px] sm:max-w-[210px]">
            <option value="" data-i18n="nav_jump_placeholder">ทางลัดเปิดหน้าเว็บ (9 ลีก)...</option>
            <option value="landing" data-i18n="nav_jump_landing">🛒 หน้าขายสินค้า (Landing Page)</option>
            <option value="preview" data-i18n="nav_jump_preview">🎮 หน้าเดโมรวมลีก (preview.html)</option>
            <option value="40700">40700 · เซียนอยู่รู หมูอยู่ตึก</option>
            <option value="675290">675290 · NudNee</option>
            <option value="38491">38491 · รอ แมน โอน</option>
            <option value="1101958">1101958 · Barley's Official League</option>
            <option value="438691">438691 · 2 spade</option>
            <option value="187827">187827 · Shi62</option>
            <option value="5349">5349 · Bramann League</option>
            <option value="567387">567387 · Fantasy Nguan & friends cup</option>
            <option value="139836">139836 · FPL Growth Mindset 2026/27 (Tier 2)</option>
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

    <!-- Sticky Module Navigation Strip (Operations First · Compact Chrome) -->
    <nav aria-label="Dashboard modules" class="border-t border-borderLight dark:border-borderDark bg-raisedLight/80 dark:bg-cardDark/90">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1.5 overflow-x-auto touch-scroll py-1 text-xs mono">
        <a href="#sec-orders" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-800 dark:text-sky-300 hover:bg-sky-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500 transition-colors shrink-0 inline-flex items-center gap-2 font-semibold whitespace-nowrap">
          <span data-i18n="mod_nav_9">9. ออเดอร์ &amp; ตรวจสลิป</span>
          <span id="navOrderPendingBadge" class="hidden px-2 py-0.5 rounded-full bg-rose-700 text-white text-xs font-mono leading-none">0</span>
        </a>
        <a href="#sec-onboarding" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-500 transition-colors shrink-0 inline-flex items-center gap-2 font-semibold whitespace-nowrap">
          <span data-i18n="mod_nav_10">10. เพิ่มลีกลูกค้าใหม่ (Onboarding)</span>
        </a>
        <a href="#sec-portfolio" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-800 dark:text-neutral-200 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 font-medium whitespace-nowrap">
          <span data-i18n="mod_nav_2">2. พอร์ตโฟลิโอ 9 ลีก</span>
        </a>
        <a href="#sec-audience" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-800 dark:text-neutral-200 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 font-medium whitespace-nowrap">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span data-i18n="mod_nav_1">1. ภาพรวมธุรกิจและ KPI</span>
        </a>
        <a href="#sec-features" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 whitespace-nowrap">
          <span data-i18n="mod_nav_3">3. พฤติกรรมฟีเจอร์</span>
        </a>
        <a href="#sec-distribution" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 whitespace-nowrap">
          <span data-i18n="mod_nav_4">4. ช่องทางและภูมิภาค</span>
        </a>
        <a href="#sec-devices" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 whitespace-nowrap">
          <span data-i18n="mod_nav_5">5. อุปกรณ์ที่ใช้งาน</span>
        </a>
        <a href="#sec-timing" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 whitespace-nowrap">
          <span data-i18n="mod_nav_6">6. กราฟทราฟฟิกและช่วงเวลาพีค</span>
        </a>
        <a href="#sec-system" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 whitespace-nowrap">
          <span data-i18n="mod_nav_7">7. ประสิทธิภาพระบบและการขยายสเกล</span>
        </a>
        <a href="#sec-monitor" class="min-h-[40px] px-3 py-1.5 rounded-lg text-slate-700 dark:text-neutral-300 hover:bg-cardLight dark:hover:bg-raisedDark focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 whitespace-nowrap">
          <span data-i18n="mod_nav_8">8. ตรวจสุขภาพระบบย้อนหลัง</span>
        </a>
        <a href="#sec-pitch" class="min-h-[40px] px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-500/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500 transition-colors shrink-0 inline-flex items-center gap-2 font-semibold whitespace-nowrap">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span data-i18n="mod_nav_0">0. โซลูชันผู้จัดลีก & Pitch Deck</span>
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
          <p class="text-sm text-slate-600 dark:text-neutral-300 leading-relaxed" data-i18n="page_subtitle">
            ศูนย์ควบคุมข้อมูลระบบ พฤติกรรมผู้ใช้งานทั้ง 9 มินิลีก (8 Tier 1 + 1 Tier 2) เศรษฐศาสตร์เงินรางวัล และการประเมินความจุคลาวด์เพื่อขยายสเกลโปรเจกต์
          </p>
        </div>

        <!-- Copy Executive Report Action + Security Status -->
        <div class="flex flex-wrap items-center gap-2.5 shrink-0">
          <button type="button" id="copyExecReportBtn" onclick="copyExecutiveSummary()"
            class="min-h-[44px] px-3.5 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-raisedDark active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 text-slate-800 dark:text-neutral-200 text-xs font-medium inline-flex items-center gap-2 transition-colors duration-150">
            ${ICONS.copy}
            <span data-i18n="btn_copy_exec">คัดลอกสรุปผู้บริหาร</span>
          </button>

          <button type="button" id="refreshDataBtn" onclick="triggerLivePitchRefresh()"
            class="min-h-[44px] px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-neutral-950 font-bold active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 text-xs inline-flex items-center gap-2 whitespace-nowrap transition-all duration-150 shadow-sm"
            title="ดึงข้อมูลสดทันทีจาก Cloudflare Edge & D1 (โชว์ข้อมูลสดทันทีต่อหน้าลูกค้า)">
            <span id="refreshIcon">${ICONS.bolt}</span>
            <span id="refreshBtnText" data-i18n="btn_live_pitch_refresh">⚡ Live Pitch Refresh</span>
          </button>
        </div>
      </div>

      <!-- Broadcast Signature Strip: Live Sync Heartbeat & Keycap Countdown -->
      <div class="p-4 sm:p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div class="space-y-1.5">
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span class="font-medium text-slate-900 dark:text-white" data-i18n="telem_live_active">ระบบตรวจวัดข้อมูลสดทำงานปกติ</span>
            <span class="mono text-slate-600 dark:text-neutral-400" data-i18n="telem_auto_sync">(ซิงก์อัตโนมัติ 1 ชม./4 ชม. · ${authProvider})</span>
            <span id="telemetryModelBadge" class="px-2 py-0.5 rounded bg-slate-100 dark:bg-neutral-800 text-xs mono text-slate-700 dark:text-neutral-300">Baseline + Live D1</span>
          </div>
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-neutral-400">
            <div>
              <span data-i18n="telem_last_sync_label">ซิงก์ข้อมูลล่าสุด: </span>
              <span id="telemetryLastSync" class="text-slate-900 dark:text-neutral-100 mono tabular font-medium">8 พ.ย. 2026, 11:18 น.</span>
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
            <div id="telemetryNextDeadlineName" class="font-medium text-slate-900 dark:text-neutral-100" data-gw-name="Gameweek 11">เดดไลน์ Gameweek 11</div>
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
    <!-- 00. EXECUTIVE PITCH FLOW & VALUE PROPOSITION FOR MINI-LEAGUE ORGANIZERS   -->
    <!-- ========================================================================= -->
    <section id="sec-pitch" class="space-y-5 scroll-mt-24" aria-labelledby="sec-pitch-title">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-borderLight dark:border-borderDark pb-4">
        <div class="space-y-1.5">
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-bold tracking-wide">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span data-i18n="pitch_badge">Executive Pitch Deck · For Mini-League Organizers</span>
          </div>
          <h2 id="sec-pitch-title" class="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white" data-i18n="sec0_title">
            00. โซลูชันบริหารมินิลีกแบบ Zero-Touch และข้อเสนอทางธุรกิจ
          </h2>
          <p class="text-sm text-slate-600 dark:text-neutral-300 max-w-3xl leading-relaxed" data-i18n="sec0_sub">
            เปลี่ยนมินิลีกของคุณให้จัดการตัวเองอัตโนมัติ 100% · ลดเวลาทำ Excel 190+ ชม./ปี · สร้างการมีส่วนร่วมของลูกลีกเพิ่มขึ้น 5.7 เท่า พร้อมรองรับเงินรางวัลหมุนเวียนอย่างโปร่งใส
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2 shrink-0">
          <span class="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800" data-i18n="pitch_tier1_ready">
            Tier 1: พร้อมเปิดใช้งานทันที
          </span>
          <span id="pitchTier2Badge" class="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800" data-i18n="pitch_tier2_roadmap">
            Tier 2: Live Beta (สเกล 1,779 ทีม)
          </span>
          <button type="button" id="btnTogglePitchBody" aria-expanded="true"
            class="min-h-[42px] px-3.5 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-raisedDark text-xs font-semibold text-slate-800 dark:text-neutral-200 whitespace-nowrap transition-colors"
            data-i18n="btn_collapse_pitch">
            ซ่อนรายละเอียด Pitch
          </button>
        </div>
      </div>

      <div id="secPitchBody" class="space-y-6">
      <!-- Step 1: The Organizer Dilemma (Pain Points vs Solution Cards) -->
      <div class="space-y-3">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-sm font-bold tracking-wide text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 flex items-center justify-center text-xs font-bold shrink-0">1</span>
            <span data-i18n="pitch_step1_title">ปัญหาใหญ่ของผู้จัดลีก (Organizer Pain Points) vs ทางออก FPLSaWaDiKa</span>
          </h3>
          <span class="text-xs text-slate-600 dark:text-neutral-400 whitespace-nowrap" data-i18n="pitch_step1_sub">เปรียบเทียบภาระงานจริง</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <!-- Card 1: Time & Workload -->
          <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-3 shadow-2xs">
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300" data-i18n="pain_1_badge">ปัญหาแอดมิน</span>
                <span class="text-xs mono text-rose-700 dark:text-rose-300 font-semibold whitespace-nowrap" data-i18n="pain_1_metric">เสียเวลา 5 ชม./วีค</span>
              </div>
              <h4 class="text-sm font-semibold text-slate-900 dark:text-white" data-i18n="pain_1_title">ทำ Excel สรุปคะแนน & เช็กแต้มลบ</h4>
              <p class="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed" data-i18n="pain_1_desc">
                ต้องมานั่งไล่ดูว่าใครย้ายกี่ตัว โดนลบกี่แต้ม ใครใช้ชิปอะไร สรุปผลช้า 1-2 วันหลังบอลจบ
              </p>
            </div>
            <div class="pt-3 border-t border-emerald-500/20 space-y-1 bg-emerald-50/50 dark:bg-emerald-950/20 -mx-4 -mb-4 p-3.5 rounded-b-xl">
              <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5" data-i18n="sol_1_badge">
                ${ICONS.check} FPLSaWaDiKa Solution
              </span>
              <p class="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed" data-i18n="sol_1_desc">
                คำนวณแต้มสด Net Pts หัก Transfer Hit อัตโนมัติทุก 15 วินาที พร้อมตารางคะแนนสดไม่ต้องแตะ Excel
              </p>
            </div>
          </div>

          <!-- Card 2: Financial Transparency -->
          <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-3 shadow-2xs">
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300" data-i18n="pain_2_badge">ปัญหาเหรัญญิก</span>
                <span class="text-xs mono text-rose-700 dark:text-rose-300 font-semibold whitespace-nowrap" data-i18n="pain_2_metric">ข้อพิพาทเงินรางวัล</span>
              </div>
              <h4 class="text-sm font-semibold text-slate-900 dark:text-white" data-i18n="pain_2_title">คำนวณเงินรางวัล & ค่าปรับผิดพลาด</h4>
              <p class="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed" data-i18n="pain_2_desc">
                กติกาซับซ้อน เช่น ค่าปรับบ๊วย 5 อันดับ, รางวัลแต้มสูงสุดรายสัปดาห์, จ่ายเงินก้อนกลางฤดูกาล
              </p>
            </div>
            <div class="pt-3 border-t border-emerald-500/20 space-y-1 bg-emerald-50/50 dark:bg-emerald-950/20 -mx-4 -mb-4 p-3.5 rounded-b-xl">
              <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5" data-i18n="sol_2_badge">
                ${ICONS.check} FPLSaWaDiKa Solution
              </span>
              <p class="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed" data-i18n="sol_2_desc">
                Automated Prize Ledger คำนวณเงินรางวัลและค่าปรับอัตโนมัติ 100% โปร่งใสตรวจสอบได้ทันที
              </p>
            </div>
          </div>

          <!-- Card 3: Player Churn & Boredom -->
          <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-3 shadow-2xs">
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300" data-i18n="pain_3_badge">ปัญหาคอมมูนิตี้</span>
                <span class="text-xs mono text-rose-700 dark:text-rose-300 font-semibold whitespace-nowrap" data-i18n="pain_3_metric">คนทิ้งทีมกลางคัน</span>
              </div>
              <h4 class="text-sm font-semibold text-slate-900 dark:text-white" data-i18n="pain_3_title">แต้มตามเยอะ ถอดใจ ไม่เข้าดูแอป</h4>
              <p class="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed" data-i18n="pain_3_desc">
                ถ้าลุ้นแค่แชมป์สิ้นปี พอผ่านไป 10 นัด คนตาม 50+ แต้มก็เลิกเล่น ลีกกลายเป็นป่าช้า
              </p>
            </div>
            <div class="pt-3 border-t border-emerald-500/20 space-y-1 bg-emerald-50/50 dark:bg-emerald-950/20 -mx-4 -mb-4 p-3.5 rounded-b-xl">
              <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5" data-i18n="sol_3_badge">
                ${ICONS.check} FPLSaWaDiKa Solution
              </span>
              <p class="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed" data-i18n="sol_3_desc">
                Weekly Micro-Stakes + บทพากย์กูรูลูกหนังสายดราม่า ปลุกกระแสลุ้นทุกสัปดาห์ พร้อมเรดาร์ฟอร์มและบอลถ้วย Knockout
              </p>
            </div>
          </div>

          <!-- Card 4: Scouting & Social Banter -->
          <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-3 shadow-2xs">
            <div class="space-y-2">
              <div class="flex items-center justify-between gap-2">
                <span class="px-2 py-0.5 rounded text-xs font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300" data-i18n="pain_4_badge">ปัญหาแอปหลัก</span>
                <span class="text-xs mono text-rose-700 dark:text-rose-300 font-semibold whitespace-nowrap" data-i18n="pain_4_metric">UX ส่องทีมคู่แข่งช้า</span>
              </div>
              <h4 class="text-sm font-semibold text-slate-900 dark:text-white" data-i18n="pain_4_title">ส่องทีมคู่แข่งยาก ขาดม้านั่งสำรอง</h4>
              <p class="text-xs text-slate-600 dark:text-neutral-300 leading-relaxed" data-i18n="pain_4_desc">
                ในแอปทางการต้องกดเข้าออกทีละคน ไม่เห็นม้านั่งและแต้มสดของคู่แข่งพร้อมกัน
              </p>
            </div>
            <div class="pt-3 border-t border-emerald-500/20 space-y-1 bg-emerald-50/50 dark:bg-emerald-950/20 -mx-4 -mb-4 p-3.5 rounded-b-xl">
              <span class="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5" data-i18n="sol_4_badge">
                ${ICONS.check} FPLSaWaDiKa Solution
              </span>
              <p class="text-xs text-slate-700 dark:text-neutral-300 leading-relaxed" data-i18n="sol_4_desc">
                Interactive Squad Pitch Modal คลิกเดียวเห็นผัง 11 ตัวจริง + ม้านั่ง Auto-Sub และแต้มสดทันที
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2: Visual Proof & Business Hard Metrics (The 4 Visual Graphics) -->
      <div class="space-y-4 pt-2">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-sm font-bold tracking-wide text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-bold shrink-0">2</span>
            <span data-i18n="pitch_step2_title">หลักฐานเชิงประจักษ์ 4 มิติ (Visual Proof & Analytics)</span>
          </h3>
          <span class="text-xs text-slate-600 dark:text-neutral-400 whitespace-nowrap" data-i18n="pitch_step2_sub">ข้อมูลจริงจาก 9 มินิลีก</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Graphic 1: Workload Comparison -->
          <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-4 shadow-2xs">
            <div>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xs font-bold tracking-wide text-emerald-700 dark:text-emerald-400" data-i18n="graphic1_eyebrow">มิติที่ 1 · ความคุ้มค่าด้านเวลา</span>
                <span class="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 whitespace-nowrap" data-i18n="graphic1_badge">ประหยัด 190 ชม./ปี</span>
              </div>
              <h4 class="text-base font-semibold text-slate-900 dark:text-white mt-1.5" data-i18n="graphic1_title">ภาระงานแอดมิน: จัดการเอง (Excel) vs FPLSaWaDiKa</h4>
              <p class="text-xs text-slate-600 dark:text-neutral-300 mt-1" data-i18n="graphic1_sub">คำนวณจากลีกขนาด 20–80 ทีม ตลอด 38 สัปดาห์การแข่งขัน</p>
            </div>

            <!-- Visual Bar Comparison -->
            <div class="space-y-4 py-2">
              <div class="space-y-1.5">
                <div class="flex flex-wrap justify-between gap-2 text-xs font-medium">
                  <span class="text-rose-700 dark:text-rose-300" data-i18n="bar_manual_label">ทำตาราง Excel มือ + ไล่ตรวจแต้มลบ</span>
                  <span class="mono font-bold text-rose-700 dark:text-rose-300 whitespace-nowrap">5.0 ชม. / GW (190 ชม./ปี)</span>
                </div>
                <div class="w-full bg-slate-200 dark:bg-neutral-800 h-4 rounded-full overflow-hidden">
                  <div class="bg-rose-500 h-full rounded-full" style="width: 100%"></div>
                </div>
              </div>

              <div class="space-y-1.5">
                <div class="flex flex-wrap justify-between gap-2 text-xs font-medium">
                  <span class="text-emerald-700 dark:text-emerald-400 font-bold" data-i18n="bar_fpl_label">FPLSaWaDiKa Zero-Touch Platform</span>
                  <span class="mono font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">0 วินาที (อัตโนมัติ 100%)</span>
                </div>
                <div class="w-full bg-slate-200 dark:bg-neutral-800 h-4 rounded-full overflow-hidden p-0.5">
                  <div class="bg-emerald-500 h-full rounded-full" style="width: 2%"></div>
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-borderLight dark:border-borderDark flex flex-wrap items-center justify-between gap-2 text-xs">
              <span class="text-slate-600 dark:text-neutral-300" data-i18n="graphic1_callout">ประหยัดเวลาแอดมินได้ปีละกว่า 24 วันทำการ!</span>
              <span class="mono font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">ROI 100% Infinite</span>
            </div>
          </div>

          <!-- Graphic 2: Engagement Multiplier -->
          <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-4 shadow-2xs">
            <div>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xs font-bold tracking-wide text-blue-700 dark:text-blue-400" data-i18n="graphic2_eyebrow">มิติที่ 2 · การมีส่วนร่วมของลูกลีก</span>
                <span class="px-2 py-0.5 rounded text-xs font-bold bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 whitespace-nowrap" data-i18n="graphic2_badge">พุ่งสูงขึ้น 5.7 เท่า</span>
              </div>
              <h4 class="text-base font-semibold text-slate-900 dark:text-white mt-1.5" data-i18n="graphic2_title">ความถี่การเข้าชมเฉลี่ย: ลีกทางการ vs ลีกบน FPLSaWaDiKa</h4>
              <p class="text-xs text-slate-600 dark:text-neutral-300 mt-1" data-i18n="graphic2_sub">ยอดเปิดดูเฉลี่ยต่อผู้จัดการทีม 1 คน ในแต่ละสัปดาห์ (Visits/Team/GW)</p>
            </div>

            <!-- SVG Engagement Chart -->
            <div class="py-2 space-y-1.5">
              <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-neutral-400">
                <span data-i18n="graphic2_axis_y">แกนตั้ง: ความถี่เปิดดูเฉลี่ยต่อทีม (ครั้ง / สัปดาห์)</span>
                <span class="mono" data-i18n="graphic2_axis_x">กลุ่มผู้ใช้</span>
              </div>
              <svg viewBox="0 0 440 128" class="w-full h-32 overflow-visible" role="img" aria-label="Engagement comparison chart">
                <!-- Bar 1: Standard FPL -->
                <rect x="20" y="74" width="76" height="32" rx="4" fill="#94a3b8" class="transition-all"><title>Official FPL App: 21.8 visits/team/GW</title></rect>
                <text id="g2Val1" x="58" y="64" text-anchor="middle" font-size="11" font-family="monospace" font-weight="bold" fill="#64748b">21.8 ครั้ง/วีค</text>
                <text x="58" y="122" text-anchor="middle" font-size="10" fill="#64748b">Official App</text>

                <!-- Arrow / Multiplier -->
                <path d="M116 78 L172 48" stroke="#10b981" stroke-width="2" stroke-dasharray="3,3" fill="none"></path>
                <text id="g2Mult" x="144" y="45" font-size="11" font-weight="bold" fill="#10b981" text-anchor="middle">+471% (5.7x)</text>

                <!-- Bar 2: FPLSaWaDiKa -->
                <rect x="186" y="24" width="76" height="82" rx="4" fill="#10b981" class="transition-all"><title>FPLSaWaDiKa Average: 124.6 visits/team/GW</title></rect>
                <text id="g2Val2" x="224" y="15" text-anchor="middle" font-size="11.5" font-family="monospace" font-weight="bold" fill="#10b981">124.6 ครั้ง/วีค</text>
                <text x="224" y="122" text-anchor="middle" font-size="10" font-weight="bold" fill="#047857">FPLSaWaDiKa</text>

                <!-- Bar 3: Peak Weekly Stakes (e.g. 40700) -->
                <rect x="302" y="14" width="76" height="92" rx="4" fill="#3b82f6" class="transition-all"><title>Weekly Stakes League (40700): 137.4 visits/team/GW</title></rect>
                <text id="g2Val3" x="340" y="7" text-anchor="middle" font-size="11.5" font-family="monospace" font-weight="bold" fill="#3b82f6">137.4 ครั้ง/วีค</text>
                <text x="340" y="122" text-anchor="middle" font-size="10" font-weight="bold" fill="#1d4ed8">Weekly Stakes</text>
              </svg>
            </div>

            <div class="pt-3 border-t border-borderLight dark:border-borderDark flex flex-wrap items-center justify-between gap-2 text-xs">
              <span class="text-slate-600 dark:text-neutral-300" data-i18n="graphic2_callout">Weekly Stakes + บทวิเคราะห์กูรูลูกหนังสายดราม่า ทำให้สมาชิกคุยกันใน LINE ตลอดสัปดาห์</span>
              <span class="mono font-bold text-blue-700 dark:text-blue-400 whitespace-nowrap">5.7x Stickiness</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <!-- Graphic 3: Automated Prize Flow -->
          <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-4 shadow-2xs">
            <div>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xs font-bold tracking-wide text-amber-700 dark:text-amber-400" data-i18n="graphic3_eyebrow">มิติที่ 3 · การเงินและความโปร่งใส</span>
                <span class="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 whitespace-nowrap" data-i18n="graphic3_badge">GMV รวม ฿268,700</span>
              </div>
              <h4 class="text-base font-semibold text-slate-900 dark:text-white mt-1.5" data-i18n="graphic3_title">ระบบรองรับโมเดลเงินรางวัลและค่าปรับ 5 รูปแบบ</h4>
              <p class="text-xs text-slate-600 dark:text-neutral-300 mt-1" data-i18n="graphic3_sub">ยืดหยุ่นตามกติกาของแต่ละมินิลีก จัดการอัตโนมัติ 0 ข้อผิดพลาด</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div class="py-1.5 flex items-start gap-2.5">
                <span class="w-6 h-6 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <div>
                  <div class="font-semibold text-slate-900 dark:text-white" data-i18n="pmodel_1_title">Weekly Top-Score</div>
                  <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="pmodel_1_sub">จ่ายรางวัลผู้ชนะประจำสัปดาห์</div>
                </div>
              </div>

              <div class="py-1.5 flex items-start gap-2.5">
                <span class="w-6 h-6 rounded-md bg-rose-500/15 text-rose-700 dark:text-rose-300 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <div>
                  <div class="font-semibold text-slate-900 dark:text-white" data-i18n="pmodel_2_title">Bottom 5 Penalties</div>
                  <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="pmodel_2_sub">ระบบค่าปรับบ๊วย (2 spade)</div>
                </div>
              </div>

              <div class="py-1.5 flex items-start gap-2.5">
                <span class="w-6 h-6 rounded-md bg-blue-500/15 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                <div>
                  <div class="font-semibold text-slate-900 dark:text-white" data-i18n="pmodel_3_title">Zero-Sum Ladder</div>
                  <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="pmodel_3_sub">หัวตารางกินท้ายตาราง (Shi62)</div>
                </div>
              </div>

              <div class="py-1.5 flex items-start gap-2.5">
                <span class="w-6 h-6 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xs shrink-0">4</span>
                <div>
                  <div class="font-semibold text-slate-900 dark:text-white" data-i18n="pmodel_4_title">Dual Milestones</div>
                  <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="pmodel_4_sub">แบ่งจ่ายงวด GW18 & GW38</div>
                </div>
              </div>
            </div>

            <div class="pt-3 border-t border-borderLight dark:border-borderDark flex flex-wrap items-center justify-between gap-2 text-xs">
              <span class="text-slate-600 dark:text-neutral-300" data-i18n="graphic3_callout">ตรวจสอบย้อนหลังได้ทุกบาทผ่าน Open Ledger</span>
              <span class="mono font-bold text-amber-700 dark:text-amber-400 whitespace-nowrap">100% Auditable</span>
            </div>
          </div>

          <!-- Graphic 4: Feature Matrix & Roadmap Tiering -->
          <div class="min-w-0 p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-4 shadow-2xs">
            <div>
              <div class="flex flex-wrap items-center justify-between gap-2">
                <span class="text-xs font-bold tracking-wide text-indigo-700 dark:text-indigo-400" data-i18n="graphic4_eyebrow">มิติที่ 4 · ความครบครันของระบบ</span>
                <span class="px-2 py-0.5 rounded text-xs font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-800 dark:text-indigo-300 whitespace-nowrap" data-i18n="graphic4_badge">Tier 1 vs Tier 2</span>
              </div>
              <h4 class="text-base font-semibold text-slate-900 dark:text-white mt-1.5" data-i18n="graphic4_title">ตารางเปรียบเทียบฟังก์ชันและความพร้อมใช้งาน</h4>
              <p class="text-xs text-slate-600 dark:text-neutral-300 mt-1" data-i18n="graphic4_sub">เปรียบเทียบระหว่าง Official FPL, Tier 2 (Live Beta), และ Tier 1 Core</p>
            </div>

            <!-- Mini Matrix Table (Horizontal Scrollable Without Cramped Text) -->
            <div class="overflow-x-auto touch-scroll text-xs">
              <table class="w-full min-w-[540px] text-left border-collapse">
                <thead>
                  <tr class="border-b border-borderLight dark:border-borderDark text-xs mono text-slate-600 dark:text-neutral-300">
                    <th class="py-2 px-2 font-medium whitespace-nowrap" data-i18n="col_feat">ฟังก์ชัน</th>
                    <th class="py-2 px-2 text-center whitespace-nowrap" data-i18n="col_fpl_app">Official App</th>
                    <th class="py-2 px-2 text-center whitespace-nowrap" data-i18n="col_tier2">Tier 2 (Live Beta)</th>
                    <th class="py-2 px-2 text-center font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap" data-i18n="col_tier1">Tier 1 (พร้อมขาย)</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-borderLight dark:divide-borderDark">
                  <tr>
                    <td class="py-2 px-2 font-medium whitespace-nowrap" data-i18n="matrix_f1">แต้มสด & โบนัส BPS 15 วิ</td>
                    <td class="py-2 px-2 text-center text-slate-600 dark:text-neutral-400 whitespace-nowrap">3-5 นาที</td>
                    <td class="py-2 px-2 text-center text-emerald-700 dark:text-emerald-400 whitespace-nowrap">✅ มี</td>
                    <td class="py-2 px-2 text-center font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">✅ มีสด 15s</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-2 font-medium whitespace-nowrap" data-i18n="matrix_f2">หักแต้มย้ายตัว Net Pts สด</td>
                    <td class="py-2 px-2 text-center text-rose-600 dark:text-rose-400 whitespace-nowrap">❌ ไม่มี</td>
                    <td class="py-2 px-2 text-center text-slate-600 dark:text-neutral-400 whitespace-nowrap">⚠️ หลังจบวีค</td>
                    <td class="py-2 px-2 text-center font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">✅ สดทันที</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-2 font-medium whitespace-nowrap" data-i18n="matrix_f3">บทพากย์กูรูลูกหนังสายดราม่า</td>
                    <td class="py-2 px-2 text-center text-rose-600 dark:text-rose-400 whitespace-nowrap">❌ ไม่มี</td>
                    <td class="py-2 px-2 text-center text-rose-600 dark:text-rose-400 whitespace-nowrap">❌ ไม่มี</td>
                    <td class="py-2 px-2 text-center font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">✅ อัตโนมัติ</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-2 font-medium whitespace-nowrap" data-i18n="matrix_f4">คำนวณเงินรางวัล/ค่าปรับอัตโนมัติ</td>
                    <td class="py-2 px-2 text-center text-rose-600 dark:text-rose-400 whitespace-nowrap">❌ ไม่มี</td>
                    <td class="py-2 px-2 text-center text-slate-600 dark:text-neutral-400 whitespace-nowrap">⚠️ พื้นฐาน</td>
                    <td class="py-2 px-2 text-center font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">✅ 100% Custom</td>
                  </tr>
                  <tr>
                    <td class="py-2 px-2 font-medium whitespace-nowrap" data-i18n="matrix_f5">Interactive Squad Pitch Modal</td>
                    <td class="py-2 px-2 text-center text-slate-600 dark:text-neutral-400 whitespace-nowrap">ดูช้า</td>
                    <td class="py-2 px-2 text-center text-slate-600 dark:text-neutral-400 whitespace-nowrap">⚠️ On-Demand</td>
                    <td class="py-2 px-2 text-center font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">✅ คลิกเดียวครบ</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="pt-3 border-t border-borderLight dark:border-borderDark flex flex-wrap items-center justify-between gap-2 text-xs">
              <span id="graphic4Callout" class="text-slate-600 dark:text-neutral-300" data-i18n="graphic4_callout">Tier 1 พร้อมส่งมอบทันที · Tier 2 (Live Beta) รองรับ 1,779 ทีม</span>
              <span class="mono font-bold text-indigo-700 dark:text-indigo-400 whitespace-nowrap">Turnkey Core</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3: Live Interactive Demo Links (Instant Client Showcases) -->
      <div class="space-y-3 pt-2">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="text-sm font-bold tracking-wide text-slate-900 dark:text-white flex items-center gap-2">
            <span class="w-6 h-6 rounded-full bg-blue-500/10 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-bold shrink-0">3</span>
            <span data-i18n="pitch_step3_title">ทางลัดเปิดโชว์ระบบจริงต่อหน้าลูกค้า (Live Interactive Jump Links)</span>
          </h3>
          <span class="text-xs text-slate-600 dark:text-neutral-400 whitespace-nowrap" data-i18n="pitch_step3_sub">คลิกเพื่อเปิดหน้าจริงในแท็บใหม่</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <!-- Jump 1: Live Points & Pitch Modal -->
          <a href="https://www.fplsawadika.com/40700" target="_blank" rel="noopener"
            class="p-3.5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:border-emerald-500/50 hover:bg-emerald-50/20 dark:hover:bg-emerald-950/20 transition-all flex flex-col justify-between gap-2 group shadow-2xs">
            <div class="space-y-1">
              <div class="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                <span>01. Live Scores</span>
                <span class="group-hover:translate-x-0.5 transition-transform">↗</span>
              </div>
              <div class="text-xs font-semibold text-slate-900 dark:text-white" data-i18n="jump_1_title">คะแนนสด & ผัง 11 ตัวจริง</div>
              <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="jump_1_sub">เปิดดูผังทีมจริง & แต้ม Net</div>
            </div>
            <span class="text-xs mono text-slate-600 dark:text-neutral-400">ลีก 40700</span>
          </a>

          <!-- Jump 2: Highlights & Pundit Banter -->
          <a href="https://www.fplsawadika.com/40700?tab=highlights" target="_blank" rel="noopener"
            class="p-3.5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:border-blue-500/50 hover:bg-blue-50/20 dark:hover:bg-blue-950/20 transition-all flex flex-col justify-between gap-2 group shadow-2xs">
            <div class="space-y-1">
              <div class="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center justify-between">
                <span>02. Commentary</span>
                <span class="group-hover:translate-x-0.5 transition-transform">↗</span>
              </div>
              <div class="text-xs font-semibold text-slate-900 dark:text-white" data-i18n="jump_2_title">บทวิเคราะห์กูรูสายดราม่า</div>
              <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="jump_2_sub">พากย์เกมดราม่าสุดกวน</div>
            </div>
            <span class="text-xs mono text-slate-600 dark:text-neutral-400">ลีก 40700</span>
          </a>

          <!-- Jump 3: Prize & Penalties -->
          <a href="https://www.fplsawadika.com/438691?tab=prizes" target="_blank" rel="noopener"
            class="p-3.5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:border-amber-500/50 hover:bg-amber-50/20 dark:hover:bg-amber-950/20 transition-all flex flex-col justify-between gap-2 group shadow-2xs">
            <div class="space-y-1">
              <div class="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center justify-between">
                <span>03. Automated Payouts</span>
                <span class="group-hover:translate-x-0.5 transition-transform">↗</span>
              </div>
              <div class="text-xs font-semibold text-slate-900 dark:text-white" data-i18n="jump_3_title">ระบบค่าปรับ & รางวัล</div>
              <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="jump_3_sub">บ๊วย 5 อันดับโดนปรับสด</div>
            </div>
            <span class="text-xs mono text-slate-600 dark:text-neutral-400">ลีก 438691</span>
          </a>

          <!-- Jump 4: Global Radar -->
          <a href="https://www.fplsawadika.com/40700/?tab=radar" target="_blank" rel="noopener"
            class="p-3.5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:border-purple-500/50 hover:bg-purple-50/20 dark:hover:bg-purple-950/20 transition-all flex flex-col justify-between gap-2 group shadow-2xs">
            <div class="space-y-1">
              <div class="text-xs font-bold text-purple-700 dark:text-purple-400 flex items-center justify-between">
                <span>04. Form Radar</span>
                <span class="group-hover:translate-x-0.5 transition-transform">↗</span>
              </div>
              <div class="text-xs font-semibold text-slate-900 dark:text-white" data-i18n="jump_4_title">เรดาร์ฟอร์มทุกลีก</div>
              <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="jump_4_sub">เทียบดัชนีคะแนนรวม</div>
            </div>
            <span class="text-xs mono text-slate-600 dark:text-neutral-400">ลีก 40700 · Radar</span>
          </a>

          <!-- Jump 5: Cup Knockout -->
          <a href="https://www.fplsawadika.com/675290?tab=cup" target="_blank" rel="noopener"
            class="p-3.5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:border-rose-500/50 hover:bg-rose-50/20 dark:hover:bg-rose-950/20 transition-all flex flex-col justify-between gap-2 group sm:col-span-2 md:col-span-1 shadow-2xs">
            <div class="space-y-1">
              <div class="text-xs font-bold text-rose-700 dark:text-rose-400 flex items-center justify-between">
                <span>05. Knockout Cup</span>
                <span class="group-hover:translate-x-0.5 transition-transform">↗</span>
              </div>
              <div class="text-xs font-semibold text-slate-900 dark:text-white" data-i18n="jump_5_title">บอลถ้วยแพ้คัดออก</div>
              <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="jump_5_sub">สายการแข่งขันอัตโนมัติ</div>
            </div>
            <span class="text-xs mono text-slate-600 dark:text-neutral-400">ลีก 675290</span>
          </a>
        </div>
      </div>
      </div>
    </section>
    <section id="sec-audience" class="space-y-4 scroll-mt-24" aria-labelledby="sec-audience-title">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.users}</span>
          <h2 id="sec-audience-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec1_title">
            01. ขนาดฐานผู้ใช้งานและอัตราการรักษาลูกค้า
          </h2>
        </div>
        <span class="text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="sec1_sub">
          ตัวชี้วัดการเติบโตและสัดส่วนความเหนียวแน่นของผู้ใช้งาน
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
            <div id="kpiManagersCount" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">163</div>
            <div id="kpiManagersSub" class="text-xs text-emerald-700 dark:text-emerald-400 mt-1" data-i18n="kpi_managers_sub">Tier 1 ครบ 8 มินิลีก (รวม Tier 2 = 1,942)</div>
          </div>
        </div>

        <!-- KPI 2: Matchday Active Users -->
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-1.5">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="kpi_mau_label">ผู้ใช้งานวันแข่งขัน (MAU)</div>
            <span class="px-2 py-0.5 rounded text-xs mono font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 shrink-0 whitespace-nowrap" data-i18n="badge_live_d1">Live D1</span>
          </div>
          <div>
            <div id="kpiMatchdayActive" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">1,420</div>
            <div id="kpiMatchdaySub" class="text-xs text-emerald-700 dark:text-emerald-400 mt-1" data-i18n="kpi_mau_sub">รวมผู้ชม 3.7x ต่อผู้จัดการ 1 คน</div>
          </div>
        </div>

        <!-- KPI 3: Off-Peak DAU -->
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-1.5">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="kpi_offpeak_label">ผู้ใช้งานนอกวันแข่ง (DAU)</div>
            <span class="px-2 py-0.5 rounded text-xs mono font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 shrink-0 whitespace-nowrap" data-i18n="badge_live_d1">Live D1</span>
          </div>
          <div>
            <div id="kpiOffPeakDau" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">310</div>
            <div class="text-xs text-slate-600 dark:text-neutral-400 mt-1" data-i18n="kpi_offpeak_sub">อังคาร–พฤหัส (วางแผนซื้อขาย)</div>
          </div>
        </div>

        <!-- KPI 4: DAU / MAU Stickiness -->
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-1.5">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="kpi_stickiness_label">ความเหนียวแน่นวันแข่ง</div>
            <span class="px-2 py-0.5 rounded text-xs mono font-medium bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25 shrink-0 whitespace-nowrap" data-i18n="badge_benchmark">Benchmark</span>
          </div>
          <div>
            <div id="kpiStickiness" class="text-2xl font-semibold mono tabular text-emerald-700 dark:text-emerald-400">68.4%</div>
            <div class="text-xs text-slate-600 dark:text-neutral-400 mt-1" data-i18n="kpi_stickiness_sub">ค่าอ้างอิงฤดูกาล (> 3 ครั้ง/สัปดาห์ · ไม่เก็บ Cookie)</div>
          </div>
        </div>

        <!-- KPI 5: GW-over-GW Retention -->
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-1.5">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="kpi_retention_label">อัตรากลับมาใช้งานต่อ GW</div>
            <span class="px-2 py-0.5 rounded text-xs mono font-medium bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/25 shrink-0 whitespace-nowrap" data-i18n="badge_benchmark">Benchmark</span>
          </div>
          <div>
            <div id="kpiRetention" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">94.2%</div>
            <div class="text-xs text-emerald-700 dark:text-emerald-400 mt-1" data-i18n="kpi_retention_sub">ค่าอ้างอิงฤดูกาล (อัตราเลิกเล่น < 6% · ไม่เก็บ Cookie)</div>
          </div>
        </div>

        <!-- KPI 6: Avg Session Screen Time -->
        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-2">
          <div class="flex items-center justify-between gap-1.5">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="kpi_screentime_label">เวลาใช้งานเฉลี่ยต่อครั้ง</div>
            <span class="px-2 py-0.5 rounded text-xs mono font-medium bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 shrink-0 whitespace-nowrap" data-i18n="badge_live_d1">Live D1</span>
          </div>
          <div>
            <div id="kpiScreenTime" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">6m 42s</div>
            <div class="text-xs text-slate-600 dark:text-neutral-400 mt-1" data-i18n="kpi_screentime_sub">เปิดหน้าจอค้างระหว่างบอลเตะสด</div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 02. MULTI-LEAGUE PORTFOLIO & COMMERCIAL ECONOMICS                         -->
    <!-- ========================================================================= -->
    <section id="sec-portfolio" class="space-y-4 scroll-mt-24" aria-labelledby="sec-portfolio-title">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.layers}</span>
          <h2 id="sec-portfolio-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec2_title">
            02. พอร์ตโฟลิโอ 9 มินิลีก และเศรษฐศาสตร์เงินรางวัลรวม
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
            <div id="kpiTotalGmv" class="text-2xl font-semibold mono tabular text-emerald-700 dark:text-emerald-400">฿268,700</div>
            <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="port_gmv_sub">รวมเงินรางวัลประจำฤดูกาล + รางวัลรายสัปดาห์/เดือน</div>
          </div>
        </div>

        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="port_custom_label">ลีกที่ผูกกติกาพิเศษ (Custom Rules)</div>
            <div id="portCustomRulesVal" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">7 / 9 <span class="text-sm font-normal text-slate-600 dark:text-neutral-400">(78%)</span></div>
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
            <div id="portLandingSub" class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="port_landing_sub">แยกจากยอดเปิดดู 9 มินิลีก (วัดคนสนใจซื้อระบบ)</div>
          </div>
        </div>

        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex items-center justify-between gap-4">
          <div class="space-y-1">
            <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="port_whitelabel_label">ศักยภาพขยาย White-Label ลีกใหม่</div>
            <div class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white" data-i18n="port_whitelabel_val">พร้อมขยาย 50+ ลีก</div>
            <div class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="port_whitelabel_sub">ต้นทุนเซิร์ฟเวอร์ส่วนเพิ่ม ฿0 บนสถาปัตยกรรมปัจจุบัน</div>
          </div>
        </div>
      </div>

      <!-- Expiry Alert Banner & Customer Lifecycle Filter Bar -->
      <div id="portfolioExpiryAlert" role="status" class="hidden p-3.5 rounded-xl border border-amber-500/35 bg-amber-500/10 text-amber-900 dark:text-amber-200 text-xs leading-relaxed"></div>

      <div id="portfolioLifecycleFilters" role="group" aria-label="Customer lifecycle filters" class="flex flex-wrap items-center gap-2">
        <button type="button" data-portfolio-filter="all" aria-pressed="true"
          class="pf-filter-btn min-h-[42px] px-3.5 py-2 rounded-lg text-xs font-medium border border-emerald-500/40 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 inline-flex items-center gap-1.5 whitespace-nowrap transition-colors">
          <span data-i18n="pf_filter_all">ทั้งหมด</span>
          <span id="pfCount-all" class="mono text-xs px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">9</span>
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
          <span id="pfCount-showcase" class="mono text-xs px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">9</span>
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
                <th scope="col" id="th-retention" aria-sort="none" class="p-0 text-right whitespace-nowrap">
                  <button type="button" onclick="sortLeagueTable('retention')" class="w-full min-h-[44px] px-4 py-2.5 inline-flex items-center justify-end gap-1.5 hover:text-slate-900 dark:hover:text-white font-medium whitespace-nowrap">
                    <span data-i18n="col_retention">ความเหนียวแน่น (Benchmark)</span>
                    <span id="sort-icon-retention" class="text-slate-500 dark:text-neutral-400 shrink-0">${ICONS.sort}</span>
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
              <tr class="hover:bg-raisedLight/60 dark:hover:bg-raisedDark/60 transition-colors">
                <th scope="row" class="sticky left-0 z-10 bg-cardLight dark:bg-cardDark px-4 py-3 font-medium text-slate-900 dark:text-white border-r border-borderLight dark:border-borderDark whitespace-nowrap">
                  <a href="https://www.fplsawadika.com/40700/" target="_blank" rel="noopener" class="hover:text-emerald-700 dark:hover:text-emerald-400 underline-offset-4 hover:underline">เซียนอยู่รู หมูอยู่ตึก</a>
                  <div class="text-xs mono text-slate-600 dark:text-neutral-400 font-normal">ID: 40700 · Flagship</div>
                </th>
                <td class="px-4 py-3 text-right mono tabular text-slate-800 dark:text-neutral-200">12</td>
                <td class="px-4 py-3 text-right mono tabular font-semibold text-emerald-700 dark:text-emerald-400">฿20,000</td>
                <td class="px-4 py-3 text-slate-700 dark:text-neutral-300">Weekly 300 THB · Cup · Settlement Phases</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-900 dark:text-white">4,820</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-emerald-700 dark:text-emerald-400">98.5%</td>
              </tr>
              <tr class="hover:bg-raisedLight/60 dark:hover:bg-raisedDark/60 transition-colors">
                <th scope="row" class="sticky left-0 z-10 bg-cardLight dark:bg-cardDark px-4 py-3 font-medium text-slate-900 dark:text-white border-r border-borderLight dark:border-borderDark whitespace-nowrap">
                  <a href="https://www.fplsawadika.com/675290/" target="_blank" rel="noopener" class="hover:text-emerald-700 dark:hover:text-emerald-400 underline-offset-4 hover:underline">NudNee</a>
                  <div class="text-xs mono text-slate-600 dark:text-neutral-400 font-normal">ID: 675290</div>
                </th>
                <td class="px-4 py-3 text-right mono tabular text-slate-800 dark:text-neutral-200">60</td>
                <td class="px-4 py-3 text-right mono tabular font-semibold text-emerald-700 dark:text-emerald-400">฿36,000</td>
                <td class="px-4 py-3 text-slate-700 dark:text-neutral-300">Monthly · Knock-out Cup · Charity</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-900 dark:text-white">3,610</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-emerald-700 dark:text-emerald-400">94.8%</td>
              </tr>
              <tr class="hover:bg-raisedLight/60 dark:hover:bg-raisedDark/60 transition-colors">
                <th scope="row" class="sticky left-0 z-10 bg-cardLight dark:bg-cardDark px-4 py-3 font-medium text-slate-900 dark:text-white border-r border-borderLight dark:border-borderDark whitespace-nowrap">
                  <a href="https://www.fplsawadika.com/38491/" target="_blank" rel="noopener" class="hover:text-emerald-700 dark:hover:text-emerald-400 underline-offset-4 hover:underline">รอ แมน โอน</a>
                  <div class="text-xs mono text-slate-600 dark:text-neutral-400 font-normal">ID: 38491</div>
                </th>
                <td class="px-4 py-3 text-right mono tabular text-slate-800 dark:text-neutral-200">16</td>
                <td class="px-4 py-3 text-right mono tabular font-semibold text-emerald-700 dark:text-emerald-400">฿28,500</td>
                <td class="px-4 py-3 text-slate-700 dark:text-neutral-300">Weekly · Cup · Settlement Phases</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-900 dark:text-white">1,490</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-emerald-700 dark:text-emerald-400">93.2%</td>
              </tr>
              <tr class="hover:bg-raisedLight/60 dark:hover:bg-raisedDark/60 transition-colors">
                <th scope="row" class="sticky left-0 z-10 bg-cardLight dark:bg-cardDark px-4 py-3 font-medium text-slate-900 dark:text-white border-r border-borderLight dark:border-borderDark whitespace-nowrap">
                  <a href="https://www.fplsawadika.com/1101958/" target="_blank" rel="noopener" class="hover:text-emerald-700 dark:hover:text-emerald-400 underline-offset-4 hover:underline">Barley's Official League</a>
                  <div class="text-xs mono text-slate-600 dark:text-neutral-400 font-normal">ID: 1101958</div>
                </th>
                <td class="px-4 py-3 text-right mono tabular text-slate-800 dark:text-neutral-200">17</td>
                <td class="px-4 py-3 text-right mono tabular font-semibold text-emerald-700 dark:text-emerald-400">฿103,200</td>
                <td class="px-4 py-3 text-slate-700 dark:text-neutral-300">Weekly Tier Prizes · Cup · Ledger</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-900 dark:text-white">980</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-emerald-700 dark:text-emerald-400">95.0%</td>
              </tr>
              <tr class="hover:bg-raisedLight/60 dark:hover:bg-raisedDark/60 transition-colors">
                <th scope="row" class="sticky left-0 z-10 bg-cardLight dark:bg-cardDark px-4 py-3 font-medium text-slate-900 dark:text-white border-r border-borderLight dark:border-borderDark whitespace-nowrap">
                  <a href="https://www.fplsawadika.com/438691/" target="_blank" rel="noopener" class="hover:text-emerald-700 dark:hover:text-emerald-400 underline-offset-4 hover:underline">2 spade</a>
                  <div class="text-xs mono text-slate-600 dark:text-neutral-400 font-normal">ID: 438691</div>
                </th>
                <td class="px-4 py-3 text-right mono tabular text-slate-800 dark:text-neutral-200">13</td>
                <td class="px-4 py-3 text-right mono tabular font-semibold text-emerald-700 dark:text-emerald-400">฿68,400</td>
                <td class="px-4 py-3 text-slate-700 dark:text-neutral-300">Weekly · Bottom-5 Penalty · Cup</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-900 dark:text-white">810</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-emerald-700 dark:text-emerald-400">92.4%</td>
              </tr>
              <tr class="hover:bg-raisedLight/60 dark:hover:bg-raisedDark/60 transition-colors">
                <th scope="row" class="sticky left-0 z-10 bg-cardLight dark:bg-cardDark px-4 py-3 font-medium text-slate-900 dark:text-white border-r border-borderLight dark:border-borderDark whitespace-nowrap">
                  <a href="https://www.fplsawadika.com/187827/" target="_blank" rel="noopener" class="hover:text-emerald-700 dark:hover:text-emerald-400 underline-offset-4 hover:underline">Shi62</a>
                  <div class="text-xs mono text-slate-600 dark:text-neutral-400 font-normal">ID: 187827</div>
                </th>
                <td class="px-4 py-3 text-right mono tabular text-slate-800 dark:text-neutral-200">13</td>
                <td class="px-4 py-3 text-right mono tabular font-semibold text-emerald-700 dark:text-emerald-400">฿3,100</td>
                <td class="px-4 py-3 text-slate-700 dark:text-neutral-300">Zero-Sum Annual Tiers · 2nd Half Special</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-900 dark:text-white">740</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-emerald-700 dark:text-emerald-400">91.8%</td>
              </tr>
              <tr class="hover:bg-raisedLight/60 dark:hover:bg-raisedDark/60 transition-colors">
                <th scope="row" class="sticky left-0 z-10 bg-cardLight dark:bg-cardDark px-4 py-3 font-medium text-slate-900 dark:text-white border-r border-borderLight dark:border-borderDark whitespace-nowrap">
                  <a href="https://www.fplsawadika.com/5349/" target="_blank" rel="noopener" class="hover:text-emerald-700 dark:hover:text-emerald-400 underline-offset-4 hover:underline">Bramann League</a>
                  <div class="text-xs mono text-slate-600 dark:text-neutral-400 font-normal">ID: 5349</div>
                </th>
                <td class="px-4 py-3 text-right mono tabular text-slate-800 dark:text-neutral-200">20</td>
                <td class="px-4 py-3 text-right mono tabular font-semibold text-emerald-700 dark:text-emerald-400">฿9,500</td>
                <td class="px-4 py-3 text-slate-700 dark:text-neutral-300">Dual Prize · Prediction & Challenge</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-900 dark:text-white">860</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-emerald-700 dark:text-emerald-400">90.5%</td>
              </tr>
              <tr class="hover:bg-raisedLight/60 dark:hover:bg-raisedDark/60 transition-colors">
                <th scope="row" class="sticky left-0 z-10 bg-cardLight dark:bg-cardDark px-4 py-3 font-medium text-slate-900 dark:text-white border-r border-borderLight dark:border-borderDark whitespace-nowrap">
                  <a href="https://www.fplsawadika.com/567387/" target="_blank" rel="noopener" class="hover:text-emerald-700 dark:hover:text-emerald-400 underline-offset-4 hover:underline">Fantasy Nguan & friends cup</a>
                  <div class="text-xs mono text-slate-600 dark:text-neutral-400 font-normal">ID: 567387 · Community</div>
                </th>
                <td class="px-4 py-3 text-right mono tabular text-slate-800 dark:text-neutral-200">12</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-600 dark:text-neutral-400">Community</td>
                <td class="px-4 py-3 text-slate-700 dark:text-neutral-300">Community · Cup · Live Matrix</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-900 dark:text-white">2,190</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-800 dark:text-neutral-200">88.4%</td>
              </tr>
              <tr class="hover:bg-raisedLight/60 dark:hover:bg-raisedDark/60 transition-colors">
                <th scope="row" class="sticky left-0 z-10 bg-cardLight dark:bg-cardDark px-4 py-3 font-medium text-slate-900 dark:text-white border-r border-borderLight dark:border-borderDark whitespace-nowrap">
                  <a href="https://www.fplsawadika.com/139836/" target="_blank" rel="noopener" class="hover:text-emerald-700 dark:hover:text-emerald-400 underline-offset-4 hover:underline">FPL Growth Mindset 2026/27</a>
                  <div class="text-xs mono text-slate-600 dark:text-neutral-400 font-normal">ID: 139836 · Tier 2</div>
                </th>
                <td class="px-4 py-3 text-right mono tabular text-slate-800 dark:text-neutral-200">1,779</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-600 dark:text-neutral-400">เสื้อบอลแท้</td>
                <td class="px-4 py-3 text-slate-700 dark:text-neutral-300">Standings &amp; Leaderboard Only · Instant 1,779-Team Search</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-900 dark:text-white">0</td>
                <td class="px-4 py-3 text-right mono tabular font-medium text-slate-800 dark:text-neutral-200">91.2%</td>
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
    <!-- 03. FEATURE ADOPTION & PRODUCT VALUE MATRIX                               -->
    <!-- ========================================================================= -->
    <section id="sec-features" class="space-y-4 scroll-mt-28" aria-labelledby="sec-features-title">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.chart}</span>
          <h2 id="sec-features-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec3_title">
            03. พฤติกรรมการใช้งานฟีเจอร์และคุณค่าผลิตภัณฑ์
          </h2>
        </div>
        <span class="text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="sec3_sub">
          ฟีเจอร์ใดดึงดูดผู้ใช้มากที่สุด และควรพัฒนาต่อยอดส่วนใดก่อน
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Card 3A: Feature Share Bars -->
        <div class="lg:col-span-2 p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-4">
          <div class="flex items-center justify-between gap-2">
            <h3 class="text-base font-semibold text-slate-900 dark:text-white" data-i18n="feat_share_title">สัดส่วนการคลิกใช้งานแต่ละโมดูล (% ของเซสชันทั้งหมด)</h3>
            <span class="text-xs mono text-emerald-700 dark:text-emerald-400" data-i18n="feat_share_badge">วัดผลจาก Event จริง</span>
          </div>

          <div class="divide-y divide-borderLight dark:divide-borderDark text-xs">
            <div class="py-3 space-y-1.5">
              <div class="flex justify-between items-baseline gap-2">
                <span class="font-medium text-slate-900 dark:text-white" data-i18n="feat_1_name">1. ตารางคะแนนสด & คำนวณโบนัสเรียลไทม์ (Live Standings & BPS)</span>
                <span id="featMod1Pct" class="mono tabular font-semibold text-emerald-700 dark:text-emerald-400">44.2%</span>
              </div>
              <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
                <div id="featMod1Bar" class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: 44.2%"></div>
              </div>
              <p class="text-slate-600 dark:text-neutral-400" data-i18n="feat_1_desc">คุณค่าหลัก: ผู้ใช้เปิดค้างไว้ดูอันดับขึ้น-ลงทุกครั้งที่มีประตูหรือคลีนชีตหลุด</p>
            </div>

            <div class="py-3 space-y-1.5">
              <div class="flex justify-between items-baseline gap-2">
                <span class="font-medium text-slate-900 dark:text-white" data-i18n="feat_2_name">2. สรุปเงินรางวัลรายสัปดาห์ / รายเดือน / สุทธิ (Prize & Financial Ledger)</span>
                <span id="featMod2Pct" class="mono tabular font-semibold text-slate-900 dark:text-white">23.8%</span>
              </div>
              <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
                <div id="featMod2Bar" class="bg-slate-600 dark:bg-neutral-400 h-full rounded-full transition-all duration-300" style="width: 23.8%"></div>
              </div>
              <p class="text-slate-600 dark:text-neutral-400" data-i18n="feat_2_desc">เหตุผลที่ชนะแอปหลัก: แอป FPL ทางการไม่มีระบบคำนวณเงินรางวัลและค่าปรับโดนหักแต้ม</p>
            </div>

            <div class="py-3 space-y-1.5">
              <div class="flex justify-between items-baseline gap-2">
                <span class="font-medium text-slate-900 dark:text-white" data-i18n="feat_3_name">3. เจาะลึก 11 ตัวจริง & เทียบทีมคู่แข่ง (Squad Modal & H2H Matrix)</span>
                <span id="featMod3Pct" class="mono tabular font-semibold text-slate-900 dark:text-white">16.5%</span>
              </div>
              <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
                <div id="featMod3Bar" class="bg-slate-600 dark:bg-neutral-400 h-full rounded-full transition-all duration-300" style="width: 16.5%"></div>
              </div>
              <p class="text-slate-600 dark:text-neutral-400" data-i18n="feat_3_desc">พฤติกรรมเด่น: กดส่องตัวจริงสำรองอัตโนมัติ (Auto-Sub) ของคู่แข่งที่ลุ้นแชมป์ด้วยกัน</p>
            </div>

            <div class="py-3 space-y-1.5">
              <div class="flex justify-between items-baseline gap-2">
                <span class="font-medium text-slate-900 dark:text-white" data-i18n="feat_4_name">4. จำลองสถานการณ์ & วางแผนซื้อขายล่วงหน้า (What-If & Planner)</span>
                <span id="featMod4Pct" class="mono tabular font-semibold text-slate-900 dark:text-white">9.4%</span>
              </div>
              <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
                <div id="featMod4Bar" class="bg-slate-500 dark:bg-neutral-500 h-full rounded-full transition-all duration-300" style="width: 9.4%"></div>
              </div>
              <p class="text-slate-600 dark:text-neutral-400" data-i18n="feat_4_desc">โอกาสเติบโต: ดึงผู้ใช้ให้เข้าเว็บวันอังคาร–ศุกร์ ก่อนเดดไลน์ปิดตลาด</p>
            </div>

            <div class="pt-3 space-y-1.5">
              <div class="flex justify-between items-baseline gap-2">
                <span class="font-medium text-slate-900 dark:text-white" data-i18n="feat_5_name">5. ประวัติศาสตร์ลีก & ทำเนียบแชมป์ (Hall of Fame & Records)</span>
                <span id="featMod5Pct" class="mono tabular font-semibold text-slate-900 dark:text-white">6.1%</span>
              </div>
              <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
                <div id="featMod5Bar" class="bg-slate-500 dark:bg-neutral-500 h-full rounded-full transition-all duration-300" style="width: 6.1%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3B: Paid vs Community Value Analysis -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-4">
          <div class="space-y-2">
            <h3 class="text-base font-semibold text-slate-900 dark:text-white" data-i18n="feat_insight_title">ความต่างพฤติกรรม: ลีกมีเงินรางวัล vs ลีกคอมมูนิตี้</h3>
            <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="feat_insight_desc">
              เปรียบเทียบความถี่การเปิดใช้งานต่อผู้จัดการทีม 1 คน เพื่อกำหนดแพ็กเกจราคา SaaS / White-Label
            </p>
          </div>

          <div class="divide-y divide-borderLight dark:divide-borderDark text-xs">
            <div class="py-3 space-y-1">
              <div class="text-slate-600 dark:text-neutral-400" data-i18n="feat_paid_label">ลีกที่มีเงินรางวัลสูง (เช่น 1101958 · ฿103,200)</div>
              <div class="text-xl font-semibold mono tabular text-emerald-700 dark:text-emerald-400" data-i18n="feat_paid_val">241 ครั้ง / ทีม / GW</div>
              <p class="text-slate-600 dark:text-neutral-400" data-i18n="feat_paid_sub">ผู้เล่นและกลุ่มเพื่อนเปิดเช็กตารางเงินรางวัลและอันดับสดตลอดเวลาที่บอลเตะ</p>
            </div>

            <div class="py-3 space-y-1">
              <div id="featCommLabel" class="text-slate-600 dark:text-neutral-400" data-i18n="feat_comm_label">ลีกคอมมูนิตี้และพรีเมียม (เช่น 675290 · 60 ทีม / Tier 2 · 1,779 ทีม)</div>
              <div class="text-xl font-semibold mono tabular text-slate-900 dark:text-white" data-i18n="feat_comm_val">17.2 ครั้ง / ทีม / GW</div>
              <p class="text-slate-600 dark:text-neutral-400" data-i18n="feat_comm_sub">เน้นเช็กผลสรุปหลังจบแมตช์เป็นหลัก ความถี่น้อยกว่าลีกมีเงินรางวัล ~14 เท่า</p>
            </div>

            <div class="pt-3 space-y-1">
              <div class="font-semibold text-emerald-700 dark:text-emerald-400" data-i18n="feat_takeaway_title">ข้อสรุปเชิงกลยุทธ์ (Executive Takeaway)</div>
              <p class="text-slate-700 dark:text-neutral-300 leading-relaxed" data-i18n="feat_takeaway_body">
                ฟีเจอร์ “คำนวณเงินรางวัลอัตโนมัติ (Prize Engine)” คือจุดขายทำเงินอันดับ 1 สำหรับขยายตลาดสู่ประธานมินิลีกทั่วไทย
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 04. ACQUISITION CHANNELS & GEOGRAPHIC REACH                               -->
    <!-- ========================================================================= -->
    <section id="sec-distribution" class="space-y-4 scroll-mt-28" aria-labelledby="sec-distribution-title">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.share}</span>
          <h2 id="sec-distribution-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec4_title">
            04. ช่องทางการเข้าถึงและพิกัดภูมิศาสตร์ผู้ใช้งาน
          </h2>
        </div>
        <span class="text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="sec4_sub">
          ผู้ใช้มาจากช่องทางไหน และกระจายตัวอยู่ในพื้นที่ใด
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <!-- Acquisition Channels -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-4">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white" data-i18n="chan_title">สัดส่วนช่องทางที่ดึงผู้ใช้งานเข้าสู่ระบบ (Traffic Sources)</h3>
          <div class="divide-y divide-borderLight dark:divide-borderDark text-xs">
            <div class="py-3 space-y-1.5">
              <div class="flex justify-between font-medium">
                <span class="text-slate-900 dark:text-white" data-i18n="chan_1_name">LINE Group Links & In-App Browser (ลิงก์ในกลุ่มไลน์มินิลีก)</span>
                <span id="chan1Pct" class="mono tabular text-emerald-700 dark:text-emerald-400 font-semibold">52.4%</span>
              </div>
              <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
                <div id="chan1Bar" class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: 52.4%"></div>
              </div>
              <p class="text-slate-600 dark:text-neutral-400" data-i18n="chan_1_desc">ไวรัลลูปหลัก: ประธานลีกและเพื่อนส่งลิงก์ตารางคะแนนลงกลุ่ม LINE ทุกสัปดาห์</p>
            </div>

            <div class="py-3 space-y-1.5">
              <div class="flex justify-between font-medium">
                <span class="text-slate-900 dark:text-white" data-i18n="chan_2_name">Direct / Home Screen Bookmark (เข้าตรง & ปักหมุดหน้าจอ)</span>
                <span id="chan2Pct" class="mono tabular text-slate-900 dark:text-white font-semibold">34.8%</span>
              </div>
              <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
                <div id="chan2Bar" class="bg-slate-600 dark:bg-neutral-400 h-full rounded-full transition-all duration-300" style="width: 34.8%"></div>
              </div>
              <p class="text-slate-600 dark:text-neutral-400" data-i18n="chan_2_desc">กลุ่มแฟนพันธุ์แท้ที่บันทึกเว็บไว้บนหน้าจอมือถือเหมือนแอปเนทีฟ</p>
            </div>

            <div class="pt-3 space-y-1.5">
              <div class="flex justify-between font-medium">
                <span class="text-slate-900 dark:text-white" data-i18n="chan_3_name">Deep-Link Direct &amp; Smart Text Summary (แชร์ลิงก์ตรงและข้อความสรุปผล)</span>
                <span id="chan3Pct" class="mono tabular text-slate-900 dark:text-white font-semibold">12.8%</span>
              </div>
              <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
                <div id="chan3Bar" class="bg-slate-500 dark:bg-neutral-500 h-full rounded-full transition-all duration-300" style="width: 12.8%"></div>
              </div>
              <p class="text-slate-600 dark:text-neutral-400" data-i18n="chan_3_desc">พร้อมใช้งานแล้ว: คัดลอกสรุปยอดรับ–จ่ายเข้า LINE กลุ่ม และส่งลิงก์เฉพาะลีก (/{id}/) โดยตรง</p>
            </div>
          </div>
        </div>

        <!-- Geographic & Language Distribution -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-4">
          <div class="space-y-3">
            <h3 class="text-base font-semibold text-slate-900 dark:text-white" data-i18n="geo_title">การกระจายตัวตามภูมิศาสตร์และภาษา (Geo & Locale)</h3>
            <div class="divide-y divide-borderLight dark:divide-borderDark text-xs">
              <div class="py-2.5 flex items-center justify-between">
                <span class="text-slate-800 dark:text-neutral-200 font-medium" data-i18n="geo_1">กรุงเทพมหานครและปริมณฑล (BKK & Metro)</span>
                <span id="geoBkkPct" class="mono tabular font-semibold text-emerald-700 dark:text-emerald-400">68.5%</span>
              </div>
              <div class="py-2.5 flex items-center justify-between">
                <span class="text-slate-800 dark:text-neutral-200 font-medium" data-i18n="geo_2">หัวเมืองใหญ่ (เชียงใหม่ · ชลบุรี · ขอนแก่น · ภูเก็ต)</span>
                <span id="geoRegPct" class="mono tabular font-semibold text-slate-900 dark:text-white">23.7%</span>
              </div>
              <div class="py-2.5 flex items-center justify-between">
                <span class="text-slate-800 dark:text-neutral-200 font-medium" data-i18n="geo_3">ต่างประเทศ (UK · Singapore · Australia · Japan)</span>
                <span id="geoIntlPct" class="mono tabular font-semibold text-slate-900 dark:text-white">7.8%</span>
              </div>
              <div class="py-2.5 flex items-center justify-between">
                <span class="text-slate-600 dark:text-neutral-400" data-i18n="geo_lang_label">สัดส่วนภาษาที่เลือกใช้งาน (TH / EN)</span>
                <span class="mono tabular font-semibold text-slate-900 dark:text-white">TH 84% · EN 16%</span>
              </div>
            </div>
          </div>

          <div class="pt-3 border-t border-borderLight dark:border-borderDark text-xs text-slate-600 dark:text-neutral-400">
            <span class="font-semibold text-slate-900 dark:text-white" data-i18n="geo_edge_title">Cloudflare Bangkok Edge (BKK): </span>
            <span data-i18n="geo_edge_desc">ทราฟฟิก 92.2% ในไทยวิ่งเข้า Data Center กรุงเทพฯ โดยตรง ค่าความหน่วงเฉลี่ยต่ำเพียง 18–26 ms</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 05. DEVICE, VIEWPORT & CLIENT ENVIRONMENT                                 -->
    <!-- ========================================================================= -->
    <section id="sec-devices" class="space-y-4 scroll-mt-28" aria-labelledby="sec-devices-title">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-borderLight dark:border-borderDark pb-3">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="text-slate-700 dark:text-neutral-300">${ICONS.smartphone}</span>
            <h2 id="sec-devices-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec5_title">
              05. อุปกรณ์ หน้าจอ และสภาพแวดล้อมของผู้ใช้งาน
            </h2>
          </div>
          <p class="text-xs mono text-slate-600 dark:text-neutral-400 mt-1" data-i18n="sec5_sub">
            เลือกดูข้อมูลจริงจาก D1 Telemetry เพื่อการออกแบบ UX/UI ให้เหมาะกับอุปกรณ์หลัก
          </p>
        </div>
        <div class="inline-flex items-center gap-2 self-start sm:self-auto shrink-0" role="group" aria-label="Device telemetry window">
          <button type="button" id="btnDev7d" onclick="switchDeviceWindow('7d')"
            class="min-h-[44px] px-4 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0 transition-colors"
            data-i18n="dev_btn_7d">
            7 วันล่าสุด
          </button>
          <button type="button" id="btnDev30d" onclick="switchDeviceWindow('30d')"
            class="min-h-[44px] px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs font-medium text-emerald-800 dark:text-emerald-300 whitespace-nowrap shrink-0 transition-colors"
            data-i18n="dev_btn_30d">
            30 วันล่าสุด
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Mobile -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="dev_mobile_label">สมาร์ตโฟน (Mobile Phones)</span>
            <span id="devMobileBadge" class="text-xs mono text-slate-600 dark:text-neutral-400">-</span>
          </div>
          <div id="deviceMobilePct" class="text-3xl font-semibold mono tabular text-slate-900 dark:text-white">-</div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="deviceMobileBar" class="bg-slate-600 dark:bg-neutral-400 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
          <p id="devMobileDesc" class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="dev_mobile_desc">
            หน้าจอมือถือขนาด 375px–430px (กำลังโหลดสถิติจริง 30 วันล่าสุด...)
          </p>
        </div>

        <!-- Desktop -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="dev_desktop_label">คอมพิวเตอร์ตั้งโต๊ะ / โน้ตบุ๊ก (Desktop)</span>
            <span id="devDesktopBadge" class="text-xs mono text-slate-600 dark:text-neutral-400">-</span>
          </div>
          <div id="deviceDesktopPct" class="text-3xl font-semibold mono tabular text-slate-900 dark:text-white">-</div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="deviceDesktopBar" class="bg-slate-600 dark:bg-neutral-400 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
          <p id="devDesktopDesc" class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="dev_desktop_desc">
            หน้าจอคอมพิวเตอร์และโน้ตบุ๊ก 1024px+ (กำลังโหลดสถิติจริง 30 วันล่าสุด...)
          </p>
        </div>

        <!-- Tablet / iPad -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="dev_tablet_label">ไอแพดและแท็บเล็ต (iPad / Tablet)</span>
            <span id="devTabletBadge" class="text-xs mono text-slate-600 dark:text-neutral-400">-</span>
          </div>
          <div id="deviceTabletPct" class="text-3xl font-semibold mono tabular text-slate-900 dark:text-white">-</div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="deviceTabletBar" class="bg-slate-500 dark:bg-neutral-500 h-full rounded-full transition-all duration-300" style="width: 0%"></div>
          </div>
          <p id="devTabletDesc" class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="dev_tablet_desc">
            หน้าจอแท็บเล็ต 768px–1024px (กำลังโหลดสถิติจริง 30 วันล่าสุด...)
          </p>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 06. MATCHDAY TRAFFIC RHYTHM & CONCURRENCY WINDOWS                         -->
    <!-- ========================================================================= -->
    <section id="sec-timing" class="space-y-4 scroll-mt-28" aria-labelledby="sec-timing-title">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.clock}</span>
          <h2 id="sec-timing-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec6_title">
            06. จังหวะทราฟฟิกวันแข่งขันและช่วงเวลาใช้งานสูงสุด
          </h2>
        </div>
        <span class="text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="sec6_sub">
          กราฟวิเคราะห์ความหนาแน่นทราฟฟิกรายวัน (7 วัน) และรายชั่วโมงวันแข่ง (เวลาไทย ICT)
        </span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- SVG Chart Card (2/3 width on desktop) -->
        <div class="lg:col-span-2 p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 id="trafficChartTitle" class="text-base font-semibold text-slate-900 dark:text-white" data-i18n="chart_title_hourly">
                กราฟความหนาแน่นทราฟฟิกรายชั่วโมงในวันแข่งขัน (24 ชั่วโมง · ICT)
              </h3>
              <p id="trafficChartSub" class="text-xs text-slate-600 dark:text-neutral-400 mt-0.5" data-i18n="chart_sub_hourly">
                พุ่งสูงสุดช่วงคู่ดึกวันเสาร์ 21:00–23:30 น. (68% ของทราฟฟิกทั้งสัปดาห์)
              </p>
            </div>

            <!-- Chart View Switcher (44px touch targets) -->
            <div class="inline-flex items-center gap-2 self-start sm:self-auto shrink-0" role="group" aria-label="Traffic chart mode">
              <button type="button" id="btnChartHourly" onclick="switchChartMode('hourly')"
                class="min-h-[44px] px-4 py-2 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-xs font-medium text-emerald-800 dark:text-emerald-300 whitespace-nowrap shrink-0 transition-colors"
                data-i18n="chart_btn_24h">
                24 ชม. (วันแข่ง)
              </button>
              <button type="button" id="btnChartDaily" onclick="switchChartMode('daily')"
                class="min-h-[44px] px-4 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-xs font-medium text-slate-700 dark:text-neutral-300 hover:text-slate-900 dark:hover:text-white whitespace-nowrap shrink-0 transition-colors"
                data-i18n="chart_btn_7d">
                7 วันย้อนหลัง
              </button>
            </div>
          </div>

          <!-- Responsive SVG Chart Container -->
          <div class="w-full pt-2 space-y-1.5">
            <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-neutral-400">
              <span id="trafficYAxisUnit" class="font-medium">แกนตั้ง (Y): ดัชนีความหนาแน่นเทียบช่วงพีคสูงสุด (%)</span>
              <span id="trafficXAxisUnit" class="mono">แกนนอน (X): เวลาไทย (ICT)</span>
            </div>
            <svg id="trafficSvgChart" viewBox="0 0 680 220" class="w-full h-48 sm:h-56 overflow-visible" role="img" aria-label="Matchday traffic distribution chart"></svg>
          </div>

          <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-borderLight dark:border-borderDark text-xs text-slate-600 dark:text-neutral-400">
            <div class="flex items-center gap-4">
              <span class="inline-flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                <span data-i18n="chart_legend_peak">ช่วงพีคบอลเตะสด / เดดไลน์</span>
              </span>
              <span class="inline-flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-sm bg-slate-400 dark:bg-neutral-600"></span>
                <span data-i18n="chart_legend_normal">ช่วงเวลาปกติ</span>
              </span>
            </div>
            <span id="chartPeakCallout" class="mono text-slate-800 dark:text-neutral-200 font-medium">Peak: 22:00 ICT (100% Index)</span>
          </div>
        </div>

        <!-- 3 Peak Windows Ledger (1/3 width on desktop) -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-4">
          <h3 class="text-base font-semibold text-slate-900 dark:text-white" data-i18n="peak_windows_title">3 ช่วงเวลาวิกฤตที่ระบบรับโหลดสูงสุด</h3>

          <div class="divide-y divide-borderLight dark:divide-borderDark text-xs">
            <div class="py-3 space-y-1">
              <div class="flex items-center justify-between font-semibold">
                <span class="text-emerald-700 dark:text-emerald-400" data-i18n="peak_1_time">เสาร์ 21:00 – 00:30 น. (ICT)</span>
                <span class="mono tabular text-emerald-700 dark:text-emerald-400">68% Share</span>
              </div>
              <div class="font-medium text-slate-900 dark:text-white" data-i18n="peak_1_title">ช่วงบอลคู่หลักเตะพร้อมกัน 5–6 คู่</div>
              <p class="text-slate-600 dark:text-neutral-400" data-i18n="peak_1_desc">ผู้ใช้เปิดหน้าตารางคะแนนสดค้างไว้และกดรีเฟรชถี่ที่สุด ระบบ Edge Cache ช่วยรับโหลดแทนต้นทาง 94%</p>
            </div>

            <div class="py-3 space-y-1">
              <div class="flex items-center justify-between font-semibold">
                <span class="text-slate-900 dark:text-white" data-i18n="peak_2_time">ก่อนเดดไลน์ 90 นาที (ศุกร์/เสาร์)</span>
                <span class="mono tabular text-slate-900 dark:text-white">19% Share</span>
              </div>
              <div class="font-medium text-slate-900 dark:text-white" data-i18n="peak_2_title">ช่วงเช็กข่าวตัวจริงหลุด & ส่องกัปตัน</div>
              <p class="text-slate-600 dark:text-neutral-400" data-i18n="peak_2_desc">ทราฟฟิกพุ่งสูงก่อนปิดตลาดและทันทีหลังตลาดเปิดเมื่อทุกคนเข้ามาส่องกัปตันคู่แข่ง</p>
            </div>

            <div class="pt-3 space-y-1">
              <div class="flex items-center justify-between font-semibold">
                <span class="text-slate-900 dark:text-white" data-i18n="peak_3_time">จันทร์ / อังคาร 06:30 – 10:00 น.</span>
                <span class="mono tabular text-slate-900 dark:text-white">13% Share</span>
              </div>
              <div class="font-medium text-slate-900 dark:text-white" data-i18n="peak_3_title">ช่วงสรุปผู้ชนะรายสัปดาห์และเคลียร์บิล</div>
              <p class="text-slate-600 dark:text-neutral-400" data-i18n="peak_3_desc">เหรัญญิกและสมาชิกเข้ามาตรวจผลรางวัลประจำสัปดาห์หลัง GitHub Actions ซิงก์ข้อมูลจบ</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ========================================================================= -->
    <!-- 07. SYSTEM PERFORMANCE, CLOUD QUOTA & SCALING CAPACITY                    -->
    <!-- ========================================================================= -->
    <section id="sec-system" class="space-y-4 scroll-mt-28" aria-labelledby="sec-system-title">
      <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-borderLight dark:border-borderDark pb-3">
        <div class="flex items-center gap-2.5">
          <span class="text-slate-700 dark:text-neutral-300">${ICONS.activity}</span>
          <h2 id="sec-system-title" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec7_title">
            07. ประสิทธิภาพระบบ โควตาคลาวด์ และความจุในการขยายสเกล
          </h2>
        </div>
        <span class="text-xs mono text-slate-600 dark:text-neutral-400" data-i18n="sec7_sub">
          ติดตามสุขภาพระบบจริงเพื่อประเมินเพดานรองรับผู้ใช้งานและควบคุมต้นทุน
        </span>
      </div>

      <!-- 4 Cloud Quota Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- 7.1 Cloudflare Worker & Edge Cache -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-600 dark:text-neutral-400">Cloudflare Workers</span>
              <span class="mono font-semibold text-emerald-700 dark:text-emerald-400">Free Tier OK</span>
            </div>
            <div id="sysWorkerReqs" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">8,420 <span class="text-xs font-normal text-slate-600 dark:text-neutral-400">/ 100k req/d</span></div>
          </div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="sysWorkerBar" class="bg-emerald-500 h-full rounded-full" style="width: 8.4%"></div>
          </div>
          <div class="text-xs text-slate-600 dark:text-neutral-400 flex justify-between">
            <span data-i18n="sys_cache_hit_label">อัตราเสิร์ฟจากแคช (Cache Hit):</span>
            <span id="sysWorkerCacheHit" class="mono font-semibold text-emerald-700 dark:text-emerald-400">96.4%</span>
          </div>
        </div>

        <!-- 7.2 Cloudflare D1 SQLite Telemetry -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-600 dark:text-neutral-400">Cloudflare D1 Database</span>
              <span id="sysD1Badge" class="mono font-semibold text-emerald-700 dark:text-emerald-400">Connected</span>
            </div>
            <div id="sysD1RowsCount" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">12,480 <span class="text-xs font-normal text-slate-600 dark:text-neutral-400">rows</span></div>
          </div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="sysD1ReadsBar" class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: 6.2%"></div>
          </div>
          <div class="text-xs text-slate-600 dark:text-neutral-400 flex justify-between">
            <span data-i18n="sys_d1_reads_label">โควตาอ่าน-เขียนรายวัน:</span>
            <span id="sysD1ReadsPct" class="mono font-semibold text-slate-900 dark:text-white">4.1% of 100k</span>
          </div>
        </div>

        <!-- 7.3 GitHub Actions CI/CD Runner -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-600 dark:text-neutral-400">GitHub Actions Cron</span>
              <span class="mono font-semibold text-emerald-700 dark:text-emerald-400">15m / Sync</span>
            </div>
            <div id="sysGhSyncTime" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">15.9s <span class="text-xs font-normal text-slate-600 dark:text-neutral-400">/ build</span></div>
          </div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div id="sysGhSyncBar" class="bg-emerald-500 h-full rounded-full transition-all duration-300" style="width: 16%"></div>
          </div>
          <div class="text-xs text-slate-600 dark:text-neutral-400 flex justify-between">
            <span data-i18n="sys_gh_success_label">อัตราซิงก์สำเร็จ (Benchmark):</span>
            <span class="mono font-semibold text-emerald-700 dark:text-emerald-400">99.8%</span>
          </div>
        </div>

        <!-- 7.4 FPL Upstream API Health & Latency -->
        <div class="p-5 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark flex flex-col justify-between gap-3">
          <div class="space-y-1">
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-slate-600 dark:text-neutral-400">FPL Upstream Proxy</span>
              <span id="sysUpstreamBadge" class="mono font-semibold text-emerald-700 dark:text-emerald-400">Healthy</span>
            </div>
            <div id="sysUpstreamLatency" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">142 ms</div>
          </div>
          <div class="w-full h-2 bg-raisedLight dark:bg-raisedDark rounded-full overflow-hidden">
            <div class="bg-emerald-500 h-full rounded-full" style="width: 18%"></div>
          </div>
          <div class="text-xs text-slate-600 dark:text-neutral-400 flex justify-between">
            <span data-i18n="sys_scale_headroom_label">เพดานขยายสเกล (Headroom):</span>
            <span id="sysScalingHeadroom" class="mono font-semibold text-emerald-700 dark:text-emerald-400">+22 Leagues</span>
          </div>
        </div>
      </div>

      <!-- Operational Command Controls (Real Edge Actions with >=44px Touch Targets) -->
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
              <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="op_flush_desc">ใช้เมื่อคะแนนหรือโบนัสบนหน้าเว็บค้างไม่ขยับ กดเพื่อล้างข้อมูลค้างเก่าและดึงผลล่าสุดให้ทุกคนทันที</p>
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
              <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="op_export_desc">เก็บข้อมูลยอดคนดูและรายละเอียดทั้ง 9 ลีกลงเครื่องไว้ดูย้อนหลังหรือสรุปรายงาน</p>
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
              <p class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="op_prune_desc">ช่วยเคลียร์บันทึกเก่าที่ไม่ใช้แล้วให้ระบบลื่นและประหยัดพื้นที่ (ยอดคนดูรวมทั้งหมดยังอยู่ครบ)</p>
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

    <!-- ======================================================================= -->
    <!-- SECTION 8: PROJECT HEALTH & ERROR MONITOR (1 DAY & 7 DAYS)              -->
    <!-- ======================================================================= -->
    <section id="sec-monitor" aria-labelledby="sec8-heading" class="space-y-4 scroll-mt-24">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 id="sec8-heading" class="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white" data-i18n="sec8_title">
            08. ตรวจสุขภาพระบบและ Error ย้อนหลัง (Monitor)
          </h2>
          <p class="text-xs text-slate-600 dark:text-neutral-400" data-i18n="sec8_sub">
            เช็กย้อนหลัง 1 วัน (รายชั่วโมง) และ 1 สัปดาห์ (รายวัน) ว่าช่วงเวลาไหนทำงานปกติหรือมี Error เกิดขึ้นกับผู้ใช้
          </p>
        </div>
        <div id="monitorOverallBadge" class="inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-300 shrink-0 whitespace-nowrap">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span id="monitorOverallBadgeText" data-i18n="mon_status_healthy">ทำงานปกติ 100%</span>
        </div>
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
          <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="mon_kpi_client_label">ปัญหาฝั่งผู้ใช้งาน (หน้าเว็บ)</div>
          <div id="monClientErrTotal" class="text-2xl font-semibold mono tabular text-slate-900 dark:text-white">0</div>
          <div id="monClientErrSub" class="text-xs text-slate-600 dark:text-neutral-400 leading-relaxed" data-i18n="mon_kpi_client_sub">หน้าเว็บค้าง โหลดข้อมูลไม่ขึ้น หรือ JS Error</div>
        </div>

        <div class="p-4 rounded-xl border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark space-y-1.5">
          <div class="text-xs font-medium text-slate-600 dark:text-neutral-400" data-i18n="mon_kpi_upstream_label">ปัญหาเว็บ FPL ต้นทาง (5xx)</div>
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

    <!-- =================================================================== -->
    <!-- SECTION 09: CUSTOMER ORDERS & PAYMENT SLIP INBOX                    -->
    <!-- =================================================================== -->
    <section id="sec-orders" class="space-y-4 scroll-mt-24" aria-labelledby="sec-orders-title">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 id="sec-orders-title" class="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-white" data-i18n="sec9_title">
            09. กล่องรับคำสั่งซื้อ &amp; ตรวจสลิป
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-neutral-400" data-i18n="sec9_sub">
            ตั้งค่ารูป QR รับเงิน ตรวจสอบยอดโอนตามเศษสตางค์ ดูรูปสลิป ส่งข้อมูลเข้าเครื่องมือเปิดลีกด้านล่าง และแจ้งเปิดใช้งานทางอีเมลในคลิกเดียว
          </p>
        </div>
        <button type="button" id="btnRefreshOrders"
          class="min-h-[42px] px-4 py-2 rounded-lg border border-borderLight dark:border-borderDark bg-cardLight dark:bg-cardDark hover:bg-raisedLight dark:hover:bg-raisedDark text-xs font-semibold text-slate-800 dark:text-neutral-200 whitespace-nowrap shrink-0 transition-colors self-start sm:self-auto"
          data-i18n="ord_btn_refresh">
          รีเฟรชรายการออเดอร์
        </button>
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

    <!-- =================================================================== -->
    <!-- SECTION 10: CONCIERGE CUSTOMER LEAGUE ONBOARDING WIZARD             -->
    <!-- =================================================================== -->
    <section id="sec-onboarding" class="space-y-4 scroll-mt-24" aria-labelledby="sec-onboarding-title">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h2 id="sec-onboarding-title" class="text-lg sm:text-xl font-semibold tracking-tight text-slate-900 dark:text-white" data-i18n="sec10_title">
            10. เครื่องมือเปิดลีกลูกค้าใหม่ (Concierge Onboarding Wizard)
          </h2>
          <p class="text-xs sm:text-sm text-slate-600 dark:text-neutral-400" data-i18n="sec10_sub">
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
            <label for="onbWeeklyPrize" class="block text-xs font-semibold text-slate-800 dark:text-neutral-200" data-i18n="onb_lbl_weekly">รางวัล/สัปดาห์ (บาท)</label>
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

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
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
  </main>

  <footer class="border-t border-borderLight dark:border-borderDark py-8 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-neutral-400">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
        <span class="mono font-medium text-slate-800 dark:text-neutral-200">FPL SaWaDiKa Executive BI v2.4</span>
        <span>·</span>
        <span data-i18n="footer_rights">ศูนย์วิเคราะห์ข้อมูลธุรกิจและโครงสร้างพื้นฐานครบวงจร (9 มินิลีก)</span>
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
        nav_jump_placeholder: 'ทางลัดเปิดหน้าเว็บ (9 ลีก)...',
        nav_jump_landing: '🛒 หน้าขายสินค้า (Landing Page)',
        nav_jump_preview: '🎮 หน้าเดโมรวมลีก (preview.html)',
        nav_jump_hub: '🛒 หน้าขายสินค้า (Landing Page)',
        mod_nav_0: '0. Pitch Deck ขายงานผู้จัดลีก',
        mod_nav_1: '1. ภาพรวมธุรกิจและ KPI',
        mod_nav_2: '2. พอร์ตโฟลิโอ 9 ลีก',
        mod_nav_3: '3. พฤติกรรมฟีเจอร์',
        mod_nav_4: '4. ช่องทางและภูมิภาค',
        mod_nav_5: '5. อุปกรณ์ที่ใช้งาน',
        mod_nav_6: '6. กราฟทราฟฟิกและช่วงเวลาพีค',
        mod_nav_7: '7. ประสิทธิภาพระบบและการขยายสเกล',
        mod_nav_8: '8. ตรวจสุขภาพระบบย้อนหลัง',
        mod_nav_9: '9. ออเดอร์ & ตรวจสลิป',
        mod_nav_10: '10. เพิ่มลีกลูกค้าใหม่',
        header_subtitle: 'ศูนย์วิเคราะห์ข้อมูลธุรกิจและระบบ',
        quick_league_placeholder: 'ทางลัดเปิดหน้าเว็บ (9 ลีก)...',
        quick_hub_home: '🛒 หน้าขายสินค้า (Landing Page)',
        sign_out: 'ออกจากระบบ',
        nav_pitch: '00. Pitch Deck',
        nav_audience: '01. ผู้ใช้งาน',
        nav_portfolio: '02. พอร์ต 9 ลีก',
        nav_features: '03. ฟีเจอร์',
        nav_channels: '04. ช่องทางเข้าถึง',
        nav_devices: '05. อุปกรณ์',
        nav_timing: '06. ช่วงเวลาพีค',
        nav_system: '07. ระบบ & โควตา',
        nav_monitor: '08. Monitor',
        page_title: 'สรุปภาพรวมผู้บริหารและข้อมูลวิเคราะห์ธุรกิจสด',
        page_subtitle: 'ศูนย์ควบคุมข้อมูลระบบ พฤติกรรมผู้ใช้งานทั้ง 9 มินิลีก (8 Tier 1 + 1 Tier 2) เศรษฐศาสตร์เงินรางวัล และการประเมินความจุคลาวด์เพื่อขยายสเกลโปรเจกต์',
        btn_copy_exec: 'คัดลอกสรุปผู้บริหาร',
        btn_copied_exec: 'คัดลอกสรุปลงคลิปบอร์ดแล้ว!',
        btn_refresh: 'รีเฟรชข้อมูลสด',
        btn_live_pitch_refresh: '⚡ Live Pitch Refresh',
        pitch_badge: 'Executive Pitch Deck · สำหรับผู้จัดมินิลีก',
        sec0_title: '00. โซลูชันบริหารมินิลีกแบบ Zero-Touch และข้อเสนอทางธุรกิจ',
        sec0_sub: 'เปลี่ยนมินิลีกของคุณให้จัดการตัวเองอัตโนมัติ 100% · ลดเวลาทำ Excel 190+ ชม./ปี · สร้างการมีส่วนร่วมของลูกลีกเพิ่มขึ้น 5.7 เท่า พร้อมรองรับเงินรางวัลหมุนเวียนอย่างโปร่งใส',
        pitch_tier1_ready: 'Tier 1: พร้อมเปิดใช้งานทันที',
        pitch_tier2_roadmap: 'Tier 2: Live Beta (สเกล 1,779 ทีม)',
        pitch_step1_title: 'ปัญหาใหญ่ของผู้จัดลีก (Organizer Pain Points) vs ทางออก FPLSaWaDiKa',
        pitch_step1_sub: 'เปรียบเทียบภาระงานจริง',
        pain_1_badge: 'ปัญหาแอดมิน',
        pain_1_metric: 'เสียเวลา 5 ชม./วีค',
        pain_1_title: 'ทำ Excel สรุปคะแนน & เช็กแต้มลบ',
        pain_1_desc: 'ต้องมานั่งไล่ดูว่าใครย้ายกี่ตัว โดนลบกี่แต้ม ใครใช้ชิปอะไร สรุปผลช้า 1-2 วันหลังบอลจบ',
        sol_1_badge: 'FPLSaWaDiKa Solution',
        sol_1_desc: 'คำนวณแต้มสด Net Pts หัก Transfer Hit อัตโนมัติทุก 15 วินาที พร้อมตารางคะแนนสดไม่ต้องแตะ Excel',
        pain_2_badge: 'ปัญหาเหรัญญิก',
        pain_2_metric: 'ข้อพิพาทเงินรางวัล',
        pain_2_title: 'คำนวณเงินรางวัล & ค่าปรับผิดพลาด',
        pain_2_desc: 'กติกาซับซ้อน เช่น ค่าปรับบ๊วย 5 อันดับ, รางวัลแต้มสูงสุดรายสัปดาห์, จ่ายเงินก้อนกลางฤดูกาล',
        sol_2_badge: 'FPLSaWaDiKa Solution',
        sol_2_desc: 'Automated Prize Ledger คำนวณเงินรางวัลและค่าปรับอัตโนมัติ 100% โปร่งใสตรวจสอบได้ทันที',
        pain_3_badge: 'ปัญหาคอมมูนิตี้',
        pain_3_metric: 'คนทิ้งทีมกลางคัน',
        pain_3_title: 'แต้มตามเยอะ ถอดใจ ไม่เข้าดูแอป',
        pain_3_desc: 'ถ้าลุ้นแค่แชมป์สิ้นปี พอผ่านไป 10 นัด คนตาม 50+ แต้มก็เลิกเล่น ลีกกลายเป็นป่าช้า',
        sol_3_badge: 'FPLSaWaDiKa Solution',
        sol_3_desc: 'Weekly Micro-Stakes + บทพากย์กูรูลูกหนังสายดราม่า ปลุกกระแสลุ้นทุกสัปดาห์ พร้อมเรดาร์ฟอร์มและบอลถ้วย Knockout',
        pain_4_badge: 'ปัญหาแอปหลัก',
        pain_4_metric: 'UX ส่องทีมคู่แข่งช้า',
        pain_4_title: 'ส่องทีมคู่แข่งยาก ขาดม้านั่งสำรอง',
        pain_4_desc: 'ในแอปทางการต้องกดเข้าออกทีละคน ไม่เห็นม้านั่งและแต้มสดของคู่แข่งพร้อมกัน',
        sol_4_badge: 'FPLSaWaDiKa Solution',
        sol_4_desc: 'Interactive Squad Pitch Modal คลิกเดียวเห็นผัง 11 ตัวจริง + ม้านั่ง Auto-Sub และแต้มสดทันที',
        pitch_step2_title: 'หลักฐานเชิงประจักษ์ 4 มิติ (Visual Proof & Analytics)',
        pitch_step2_sub: 'ข้อมูลจริงจาก 9 มินิลีก',
        graphic1_eyebrow: 'มิติที่ 1 · ความคุ้มค่าด้านเวลา',
        graphic1_badge: 'ประหยัด 190 ชม./ปี',
        graphic1_title: 'ภาระงานแอดมิน: จัดการเอง (Excel) vs FPLSaWaDiKa',
        graphic1_sub: 'คำนวณจากลีกขนาด 20–80 ทีม ตลอด 38 สัปดาห์การแข่งขัน',
        bar_manual_label: 'ทำตาราง Excel มือ + ไล่ตรวจแต้มลบ',
        bar_fpl_label: 'FPLSaWaDiKa Zero-Touch Platform',
        graphic1_callout: 'ประหยัดเวลาแอดมินได้ปีละกว่า 24 วันทำการ!',
        graphic2_eyebrow: 'มิติที่ 2 · การมีส่วนร่วมของลูกลีก',
        graphic2_badge: 'พุ่งสูงขึ้น 5.7 เท่า',
        graphic2_title: 'ความถี่การเข้าชมเฉลี่ย: ลีกทางการ vs ลีกบน FPLSaWaDiKa',
        graphic2_sub: 'ยอดเปิดดูเฉลี่ยต่อผู้จัดการทีม 1 คน ในแต่ละสัปดาห์ (Visits/Team/GW)',
        graphic2_axis_y: 'แกนตั้ง: ความถี่เปิดดูเฉลี่ยต่อทีม (ครั้ง / สัปดาห์)',
        graphic2_axis_x: 'กลุ่มผู้ใช้',
        graphic2_callout: 'Weekly Stakes + บทวิเคราะห์กูรูลูกหนังสายดราม่า ทำให้สมาชิกคุยกันใน LINE ตลอดสัปดาห์',
        graphic3_eyebrow: 'มิติที่ 3 · การเงินและความโปร่งใส',
        graphic3_badge: 'GMV รวม ฿268,700',
        graphic3_title: 'ระบบรองรับโมเดลเงินรางวัลและค่าปรับ 5 รูปแบบ',
        graphic3_sub: 'ยืดหยุ่นตามกติกาของแต่ละมินิลีก จัดการอัตโนมัติ 0 ข้อผิดพลาด',
        pmodel_1_title: 'Weekly Top-Score',
        pmodel_1_sub: 'จ่ายรางวัลผู้ชนะประจำสัปดาห์',
        pmodel_2_title: 'Bottom 5 Penalties',
        pmodel_2_sub: 'ระบบค่าปรับบ๊วย (2 spade)',
        pmodel_3_title: 'Zero-Sum Ladder',
        pmodel_3_sub: 'หัวตารางกินท้ายตาราง (Shi62)',
        pmodel_4_title: 'Dual Milestones',
        pmodel_4_sub: 'แบ่งจ่ายงวด GW18 & GW38',
        graphic3_callout: 'ตรวจสอบย้อนหลังได้ทุกบาทผ่าน Open Ledger',
        graphic4_eyebrow: 'มิติที่ 4 · ความครบครันของระบบ',
        graphic4_badge: 'Tier 1 vs Tier 2',
        graphic4_title: 'ตารางเปรียบเทียบฟังก์ชันและความพร้อมใช้งาน',
        graphic4_sub: 'เปรียบเทียบระหว่าง Official FPL, Tier 2 Live Beta, และ Tier 1 Core',
        col_feat: 'ฟังก์ชัน',
        col_fpl_app: 'Official App',
        col_tier2: 'Tier 2 (Live Beta)',
        col_tier1: 'Tier 1 (พร้อมขาย)',
        matrix_f1: 'แต้มสด & โบนัส BPS 15 วิ',
        matrix_f2: 'หักแต้มย้ายตัว Net Pts สด',
        matrix_f3: 'บทพากย์กูรูลูกหนังสายดราม่า',
        matrix_f4: 'คำนวณเงินรางวัล/ค่าปรับอัตโนมัติ',
        matrix_f5: 'Interactive Squad Pitch Modal',
        graphic4_callout: 'Tier 1 พร้อมส่งมอบทันที · Tier 2 (Live Beta) รองรับ 1,779 ทีม',
        pitch_step3_title: 'ทางลัดเปิดโชว์ระบบจริงต่อหน้าลูกค้า (Live Interactive Jump Links)',
        pitch_step3_sub: 'คลิกเพื่อเปิดหน้าจริงในแท็บใหม่',
        jump_1_title: 'คะแนนสด & ผัง 11 ตัวจริง',
        jump_1_sub: 'เปิดดูผังทีมจริง & แต้ม Net',
        jump_2_title: 'บทวิเคราะห์กูรูสายดราม่า',
        jump_2_sub: 'พากย์เกมดราม่าสุดกวน',
        jump_3_title: 'ระบบค่าปรับ & รางวัล',
        jump_3_sub: 'บ๊วย 5 อันดับโดนปรับสด',
        jump_4_title: 'เรดาร์ฟอร์มทุกลีก',
        jump_4_sub: 'เทียบดัชนีคะแนนรวม',
        jump_5_title: 'บอลถ้วยแพ้คัดออก',
        jump_5_sub: 'สายการแข่งขันอัตโนมัติ',
        telem_live_active: 'ระบบตรวจวัดข้อมูลสดทำงานปกติ',
        telem_auto_sync: '(ซิงก์อัตโนมัติรายชั่วโมง · ${authProvider})',
        telem_last_sync_label: 'ซิงก์ข้อมูลล่าสุด: ',
        telem_runner_label: 'ตัวประมวลผล: ',
        telem_countdown_sub: 'นับถอยหลังปิดตลาดย้ายตัว',
        sec1_title: '01. ขนาดฐานผู้ใช้งานและอัตราการรักษาลูกค้า',
        sec1_sub: 'ตัวชี้วัดการเติบโตและสัดส่วนความเหนียวแน่นของผู้ใช้งาน (แยกป้ายข้อมูลสด D1 กับค่าอ้างอิง Benchmark)',
        badge_live_sync: 'Live Sync',
        badge_live_d1: 'Live D1',
        badge_benchmark: 'Benchmark',
        kpi_managers_label: 'ผู้จัดการทีมที่ติดตาม',
        kpi_managers_sub: 'Tier 1 ครบ 8 มินิลีก (รวม Tier 2 = 1,942)',
        kpi_mau_label: 'ผู้ใช้งานวันแข่งขัน (MAU)',
        kpi_mau_sub: 'รวมผู้ชม 3.7x ต่อผู้จัดการ 1 คน',
        kpi_offpeak_label: 'ผู้ใช้งานนอกวันแข่ง (DAU)',
        kpi_offpeak_sub: 'อังคาร–พฤหัส (วางแผนซื้อขาย)',
        kpi_stickiness_label: 'ความเหนียวแน่นวันแข่ง',
        kpi_stickiness_sub: 'ค่าอ้างอิงฤดูกาล (> 3 ครั้ง/สัปดาห์ · ไม่เก็บ Cookie)',
        kpi_retention_label: 'อัตรากลับมาใช้งานต่อ GW',
        kpi_retention_sub: 'ค่าอ้างอิงฤดูกาล (อัตราเลิกเล่น < 6% · ไม่เก็บ Cookie)',
        kpi_screentime_label: 'เวลาใช้งานเฉลี่ยต่อครั้ง',
        kpi_screentime_sub: 'เปิดหน้าจอค้างระหว่างบอลเตะสด',
        sec2_title: '02. พอร์ตโฟลิโอ 9 มินิลีก และเศรษฐศาสตร์เงินรางวัลรวม',
        sec2_sub: 'คลิกหัวตารางเพื่อเรียงลำดับ · คอลัมน์ชื่อลีกตรึงอยู่กับที่เมื่อเลื่อนแนวนอนบนมือถือ',
        port_gmv_label: 'มูลค่าเงินรางวัลรวมทั้งระบบ (GMV)',
        port_gmv_sub: 'รวมเงินรางวัลประจำฤดูกาล + รางวัลรายสัปดาห์/เดือน',
        port_custom_label: 'ลีกที่ผูกกติกาพิเศษ (Custom Rules)',
        port_custom_sub: 'สร้าง Switching Cost สูงกว่าเว็บ FPL ทั่วไป',
        port_landing_label: 'ยอดเข้าชมหน้าขาย (Landing Page · 7 วัน)',
        port_landing_sub: 'แยกจากยอดเปิดดู 9 มินิลีก (วัดคนสนใจซื้อระบบ)',
        port_whitelabel_label: 'ศักยภาพขยาย White-Label ลีกใหม่',
        port_whitelabel_val: 'พร้อมขยาย 50+ ลีก',
        port_whitelabel_sub: 'ต้นทุนเซิร์ฟเวอร์ส่วนเพิ่ม ฿0 บนสถาปัตยกรรมปัจจุบัน',
        col_league_name: 'ชื่อมินิลีก & รหัส',
        col_teams: 'จำนวนทีม',
        col_pool: 'เงินรางวัลรวม (GMV)',
        col_modules: 'โมดูลและกติกาที่เปิดใช้งาน',
        col_views: 'ยอดเปิดดู (7 วันล่าสุด)',
        col_retention: 'ความเหนียวแน่น (Benchmark)',
        sec3_title: '03. พฤติกรรมการใช้งานฟีเจอร์และคุณค่าผลิตภัณฑ์',
        sec3_sub: 'ฟีเจอร์ใดดึงดูดผู้ใช้มากที่สุด และควรพัฒนาต่อยอดส่วนใดก่อน',
        feat_share_title: 'สัดส่วนการคลิกใช้งานแต่ละโมดูล (% ของเซสชันทั้งหมด)',
        feat_share_badge: 'วัดผลจาก Event จริง',
        feat_1_name: '1. ตารางคะแนนสด & คำนวณโบนัสเรียลไทม์ (Live Standings & BPS)',
        feat_1_desc: 'คุณค่าหลัก: ผู้ใช้เปิดค้างไว้ดูอันดับขึ้น-ลงทุกครั้งที่มีประตูหรือคลีนชีตหลุด',
        feat_2_name: '2. สรุปเงินรางวัลรายสัปดาห์ / รายเดือน / สุทธิ (Prize & Financial Ledger)',
        feat_2_desc: 'เหตุผลที่ชนะแอปหลัก: แอป FPL ทางการไม่มีระบบคำนวณเงินรางวัลและค่าปรับโดนหักแต้ม',
        feat_3_name: '3. เจาะลึก 11 ตัวจริง & เทียบทีมคู่แข่ง (Squad Modal & H2H Matrix)',
        feat_3_desc: 'พฤติกรรมเด่น: กดส่องตัวจริงสำรองอัตโนมัติ (Auto-Sub) ของคู่แข่งที่ลุ้นแชมป์ด้วยกัน',
        feat_4_name: '4. จำลองสถานการณ์ & วางแผนซื้อขายล่วงหน้า (What-If & Planner)',
        feat_4_desc: 'โอกาสเติบโต: ดึงผู้ใช้ให้เข้าเว็บวันอังคาร–ศุกร์ ก่อนเดดไลน์ปิดตลาด',
        feat_5_name: '5. ประวัติศาสตร์ลีก & ทำเนียบแชมป์ (Hall of Fame & Records)',
        feat_insight_title: 'ความต่างพฤติกรรม: ลีกมีเงินรางวัล vs ลีกคอมมูนิตี้',
        feat_insight_desc: 'เปรียบเทียบความถี่การเปิดใช้งานต่อผู้จัดการทีม 1 คน เพื่อกำหนดแพ็กเกจราคา SaaS / White-Label',
        feat_paid_label: 'ลีกที่มีเงินรางวัลสูง (เช่น 1101958 · ฿103,200)',
        feat_paid_val: '241 ครั้ง / ทีม / GW',
        feat_paid_sub: 'ผู้เล่นและกลุ่มเพื่อนเปิดเช็กตารางเงินรางวัลและอันดับสดตลอดเวลาที่บอลเตะ',
        feat_comm_label: 'ลีกคอมมูนิตี้และพรีเมียม (เช่น 675290 · 60 ทีม / Tier 2 · 1,779 ทีม)',
        feat_comm_val: '17.2 ครั้ง / ทีม / GW',
        feat_comm_sub: 'เน้นเช็กผลสรุปหลังจบแมตช์เป็นหลัก ความถี่น้อยกว่าลีกมีเงินรางวัล ~14 เท่า',
        feat_takeaway_title: 'ข้อสรุปเชิงกลยุทธ์ (Executive Takeaway)',
        feat_takeaway_body: 'ฟีเจอร์ “คำนวณเงินรางวัลอัตโนมัติ (Prize Engine)” คือจุดขายทำเงินอันดับ 1 สำหรับขยายตลาดสู่ประธานมินิลีกทั่วไทย',
        sec4_title: '04. ช่องทางการเข้าถึงและพิกัดภูมิศาสตร์ผู้ใช้งาน',
        sec4_sub: 'ผู้ใช้มาจากช่องทางไหน และกระจายตัวอยู่ในพื้นที่ใด',
        chan_title: 'สัดส่วนช่องทางที่ดึงผู้ใช้งานเข้าสู่ระบบ (Traffic Sources)',
        chan_1_name: 'LINE Group Links & In-App Browser (ลิงก์ในกลุ่มไลน์มินิลีก)',
        chan_1_desc: 'ไวรัลลูปหลัก: ประธานลีกและเพื่อนส่งลิงก์ตารางคะแนนลงกลุ่ม LINE ทุกสัปดาห์',
        chan_2_name: 'Direct / Home Screen Bookmark (เข้าตรง & ปักหมุดหน้าจอ)',
        chan_2_desc: 'กลุ่มแฟนพันธุ์แท้ที่บันทึกเว็บไว้บนหน้าจอมือถือเหมือนแอปเนทีฟ',
        chan_3_name: 'Deep-Link Direct & Smart Text Summary (แชร์ลิงก์ตรงและข้อความสรุปผล)',
        chan_3_desc: 'พร้อมใช้งานแล้ว: คัดลอกสรุปยอดรับ–จ่ายเข้า LINE กลุ่ม และส่งลิงก์เฉพาะลีก (/{id}/) โดยตรง',
        geo_title: 'การกระจายตัวตามภูมิศาสตร์และภาษา (Geo & Locale)',
        geo_1: 'กรุงเทพมหานครและปริมณฑล (BKK & Metro)',
        geo_2: 'หัวเมืองใหญ่ (เชียงใหม่ · ชลบุรี · ขอนแก่น · ภูเก็ต)',
        geo_3: 'ต่างประเทศ (UK · Singapore · Australia · Japan)',
        geo_lang_label: 'สัดส่วนภาษาที่เลือกใช้งาน (TH / EN)',
        geo_edge_title: 'Cloudflare Bangkok Edge (BKK): ',
        geo_edge_desc: 'ทราฟฟิก 92.2% ในไทยวิ่งเข้า Data Center กรุงเทพฯ โดยตรง ค่าความหน่วงเฉลี่ยต่ำเพียง 18–26 ms',
        sec5_title: '05. อุปกรณ์ หน้าจอ และสภาพแวดล้อมของผู้ใช้งาน',
        sec5_sub: 'เลือกดูสถิติอุปกรณ์จริงจาก D1 Telemetry ได้ทั้ง 7 วัน และ 30 วันล่าสุด',
        dev_btn_7d: '7 วันล่าสุด',
        dev_btn_30d: '30 วันล่าสุด',
        dev_mobile_label: 'สมาร์ตโฟน (Mobile Phones)',
        dev_primary_badge: 'อันดับ 1 (30 วันล่าสุด)',
        dev_mobile_desc: 'หน้าจอมือถือขนาด 375px–430px (กำลังโหลดสถิติจริง 30 วันล่าสุด...)',
        dev_desktop_label: 'คอมพิวเตอร์ตั้งโต๊ะ / โน้ตบุ๊ก (Desktop)',
        dev_desktop_badge: 'ใช้งานบนจอ 1024px+',
        dev_desktop_desc: 'หน้าจอคอมพิวเตอร์และโน้ตบุ๊ก 1024px+ (กำลังโหลดสถิติจริง 30 วันล่าสุด...)',
        dev_tablet_label: 'ไอแพดและแท็บเล็ต (iPad / Tablet)',
        dev_tablet_badge: 'หน้าจอ 768px–1024px',
        dev_tablet_desc: 'หน้าจอแท็บเล็ต 768px–1024px (กำลังโหลดสถิติจริง 30 วันล่าสุด...)',
        sec6_title: '06. จังหวะทราฟฟิกวันแข่งขันและช่วงเวลาใช้งานสูงสุด',
        sec6_sub: 'กราฟวิเคราะห์ความหนาแน่นทราฟฟิกรายวัน (7 วัน) และรายชั่วโมงวันแข่ง (เวลาไทย ICT)',
        chart_title_hourly: 'กราฟความหนาแน่นทราฟฟิกรายชั่วโมงในวันแข่งขัน (24 ชั่วโมง · ICT)',
        chart_sub_hourly: 'พุ่งสูงสุดช่วงคู่ดึกวันเสาร์ 21:00–23:30 น. (68% ของทราฟฟิกทั้งสัปดาห์)',
        chart_title_daily: 'กราฟจำนวนการเข้าใช้งานย้อนหลัง 7 วัน (Daily Sessions)',
        chart_sub_daily: 'เปรียบเทียบวันแข่งขันเสาร์–อาทิตย์ เทียบกับวันธรรมดาอังคาร–ศุกร์',
        chart_btn_24h: '24 ชม. (วันแข่ง)',
        chart_btn_7d: '7 วันย้อนหลัง',
        chart_legend_peak: 'ช่วงพีคบอลเตะสด / เดดไลน์',
        chart_legend_normal: 'ช่วงเวลาปกติ',
        peak_windows_title: '3 ช่วงเวลาวิกฤตที่ระบบรับโหลดสูงสุด',
        peak_1_time: 'เสาร์ 21:00 – 00:30 น. (ICT)',
        peak_1_title: 'ช่วงบอลคู่หลักเตะพร้อมกัน 5–6 คู่',
        peak_1_desc: 'ผู้ใช้เปิดหน้าตารางคะแนนสดค้างไว้และกดรีเฟรชถี่ที่สุด ระบบ Edge Cache ช่วยรับโหลดแทนต้นทาง 94%',
        peak_2_time: 'ก่อนเดดไลน์ 90 นาที (ศุกร์/เสาร์)',
        peak_2_title: 'ช่วงเช็กข่าวตัวจริงหลุด & ส่องกัปตัน',
        peak_2_desc: 'ทราฟฟิกพุ่งสูงก่อนปิดตลาดและทันทีหลังตลาดเปิดเมื่อทุกคนเข้ามาส่องกัปตันคู่แข่ง',
        peak_3_time: 'จันทร์ / อังคาร 06:30 – 10:00 น.',
        peak_3_title: 'ช่วงสรุปผู้ชนะรายสัปดาห์และเคลียร์บิล',
        peak_3_desc: 'เหรัญญิกและสมาชิกเข้ามาตรวจผลรางวัลประจำสัปดาห์หลัง GitHub Actions ซิงก์ข้อมูลจบ',
        sec7_title: '07. ประสิทธิภาพระบบ โควตาคลาวด์ และความจุในการขยายสเกล',
        sec7_sub: 'ติดตามสุขภาพระบบจริงเพื่อประเมินเพดานรองรับผู้ใช้งานและควบคุมต้นทุน',
        sys_cache_hit_label: 'อัตราเสิร์ฟจากแคช (Cache Hit):',
        sys_d1_reads_label: 'โควตาอ่าน-เขียนรายวัน:',
        sys_gh_success_label: 'อัตราซิงก์สำเร็จ (Benchmark):',
        sys_scale_headroom_label: 'เพดานขยายสเกล (Headroom):',
        ops_title: 'ปุ่มดูแลและเช็กความพร้อมของเว็บ',
        ops_sub: 'กดเฉพาะตอนที่ต้องการตรวจสอบหรือแก้ไขปัญหา ผลลัพธ์จะแสดงใต้ปุ่มทันที (คนเข้าเว็บทั่วไปไม่ได้รับผลกระทบ)',
        ops_shortcut_hint: 'คีย์ลัด: R รีเฟรช · L สลับภาษา · T สลับธีม',
        op_flush_title: 'รีเฟรชคะแนนสดใหม่ทั้งเว็บ',
        op_flush_desc: 'ใช้เมื่อคะแนนหรือโบนัสบนหน้าเว็บค้างไม่ขยับ กดเพื่อล้างข้อมูลค้างเก่าและดึงผลล่าสุดให้ทุกคนทันที',
        op_flush_btn: 'รีเฟรชคะแนนสดทันที',
        op_ping_title: 'เช็กว่าระบบ FPL ล่มหรือช้าไหม',
        op_ping_desc: 'ใช้ตรวจดูว่าปัญหาคะแนนไม่ขึ้นเกิดจากเว็บพรีเมียร์ลีกต้นทางช้าหรือล่มอยู่หรือไม่',
        op_ping_btn: 'เช็กสถานะเว็บ FPL',
        op_export_title: 'ดาวน์โหลดไฟล์สถิติเก็บไว้',
        op_export_desc: 'เก็บข้อมูลยอดคนดูและรายละเอียดทั้ง 9 ลีกลงเครื่องไว้ดูย้อนหลังหรือสรุปรายงาน',
        op_export_btn: 'ดาวน์โหลดไฟล์สถิติ',
        op_prune_title: 'ลบประวัติคนดูเก่าที่เกิน 30 วัน',
        op_prune_desc: 'ช่วยเคลียร์บันทึกเก่าที่ไม่ใช้แล้วให้ระบบลื่นและประหยัดพื้นที่ (ยอดคนดูรวมทั้งหมดยังอยู่ครบ)',
        op_prune_btn: 'ลบประวัติเก่าเกิน 30 วัน',
        sec8_title: '08. ตรวจสุขภาพระบบและ Error ย้อนหลัง (Monitor)',
        sec8_sub: 'เช็กย้อนหลัง 1 วัน (รายชั่วโมง) และ 1 สัปดาห์ (รายวัน) ว่าช่วงเวลาไหนทำงานปกติหรือมี Error เกิดขึ้นกับผู้ใช้',
        mon_status_healthy: 'ทำงานปกติ 100%',
        mon_status_warning: 'พบปัญหาเล็กน้อยบางช่วง',
        mon_status_incident: 'พบความผิดปกติ — ควรตรวจสอบ',
        mon_kpi_24h_label: 'ความพร้อมใช้งาน 1 วัน (24 ชม.)',
        mon_kpi_7d_label: 'ความพร้อมใช้งาน 1 สัปดาห์ (7 วัน)',
        mon_kpi_client_label: 'ปัญหาฝั่งผู้ใช้งาน (หน้าเว็บ)',
        mon_kpi_client_sub: 'หน้าเว็บค้าง โหลดข้อมูลไม่ขึ้น หรือ JS Error',
        mon_kpi_upstream_label: 'ปัญหาเว็บ FPL ต้นทาง (5xx)',
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
        footer_rights: 'ศูนย์วิเคราะห์ข้อมูลธุรกิจและโครงสร้างพื้นฐานครบวงจร (9 มินิลีก)',
        toast_refreshed: 'อัปเดตข้อมูลสถานะล่าสุดจากเซิร์ฟเวอร์เรียบร้อยแล้ว',
        confirm_prune: 'ยืนยันการลบประวัติการเข้าชมเก่าที่เกิน 30 วันหรือไม่? (ยอดผู้เข้าชมรวมทั้งหมดจะยังอยู่ครบไม่ถูกลบ)',
        sec9_title: '09. กล่องรับคำสั่งซื้อ & ตรวจสลิป',
        sec9_sub: 'ตั้งค่ารูป QR รับเงิน ตรวจสอบยอดโอนตามเศษสตางค์ ดูรูปสลิป ส่งข้อมูลเข้าเครื่องมือเปิดลีกด้านล่าง และแจ้งเปิดใช้งานทางอีเมลในคลิกเดียว',
        sec10_title: '10. เครื่องมือเปิดลีกลูกค้าใหม่ (Concierge Onboarding Wizard)',
        sec10_sub: 'ตรวจสอบ FPL Classic League ID สดจากเซิร์ฟเวอร์พรีเมียร์ลีก เลือกทีมที่ไม่ร่วมชิงรางวัล ตั้งค่าแพ็กเกจ และสร้างสคริปต์เปิดใช้งานทันที',
        onb_lbl_id: 'FPL Classic League ID (ตัวเลขเท่านั้น)',
        onb_btn_inspect: 'ดึงข้อมูลลีกสด',
        onb_lbl_plan: 'แพ็กเกจ (Plan)',
        onb_lbl_prize: 'รูปแบบรางวัล',
        onb_lbl_weekly: 'รางวัล/สัปดาห์ (บาท)',
        onb_lbl_status: 'สถานะสิทธิ์ (Status)',
        onb_lbl_tenant: 'Tenant Group (แยกการมองเห็น)',
        onb_lbl_visibility: 'การมองเห็น & SEO',
        onb_lbl_short: 'ชื่อย่อหน้าลีก (Short Name)',
        onb_lbl_expires: 'วันหมดอายุ (Expires At)',
        onb_lbl_billing: 'บันทึกแอดมิน (Admin Only)',
        onb_lbl_nocup: 'ปิดแท็บบอลถ้วย (--no-cup สำหรับลีกที่ไม่ได้เตะบอลถ้วย)',
        onb_lbl_currency: 'สกุลเงินรางวัล (Currency)',
        onb_lbl_entry_fee: 'ค่าสมัคร/ทีม (ไม่บังคับ)',
        onb_lbl_total_pool: 'เงินกองกลางรวม (ไม่บังคับ)',
        onb_lbl_season_prizes: 'รางวัลแชมป์ฤดูกาล (ไม่บังคับ)',
        onb_lbl_cup_prize: 'รางวัลบอลถ้วย (แชมป์ หรือ แชมป์/รอง)',
        onb_lbl_penalty_tiers: 'ขั้นค่าปรับบ๊วย N อันดับท้าย (คั่นด้วยจุลภาค จากบ๊วยสุดไปอันดับถัดขึ้นไป)',
        onb_penalty_hint: 'รองรับกี่อันดับก็ได้ (เช่น 3 อันดับท้าย = 300,200,100) ระบบจะปรับหัวตารางและการ์ดสรุปอัตโนมัติ',
        onb_lbl_monthly_champ: 'รางวัลแชมป์ประจำเดือน (ต่อเดือน)',
        onb_lbl_monthly_runner: 'รางวัลรองแชมป์ประจำเดือน (ใส่ 0 หากมีเฉพาะแชมป์)',
        onb_d1_note_tip: '🔒 โน้ตข้อมูลลูกค้าส่วนตัว (ชื่อ LINE / วันโอนเงิน) ให้บันทึกในตารางข้อ 02 ด้านบน (เก็บใน Cloudflare D1 ปลอดภัย 100% ไม่ถูก commit ลง Git)',
        col_lifecycle: 'สถานะ & หมดอายุ',
        col_actions: 'จัดการสิทธิ์',
        pf_filter_all: 'ทั้งหมด',
        pf_filter_private: 'ลูกค้าส่วนตัว (Private)',
        pf_filter_expiring: 'ทดลองใช้ / ใกล้หมดอายุ',
        pf_filter_paused: 'พักระบบ (Paused)',
        pf_filter_showcase: 'ลีกตัวอย่าง (Showcase)',
        onb_teams_hint: 'ติ๊กเลือกทีมที่ไม่ร่วมชิงรางวัล (non_prize_teams) หากมี:',
        onb_out_cli: '1. คำสั่ง CLI (รันบนเครื่องเพื่อเปิดลีก)',
        onb_out_json: '2. Config JSON (leagues_config.json)',
        onb_out_line: '3. ข้อความส่งมอบลูกค้าทาง LINE',
        ord_stat_total_lbl: 'คำสั่งซื้อสะสมทั้งหมด',
        ord_stat_paid_lbl: 'โอนแล้ว / เปิดลีกสำเร็จ',
        ord_stat_active_lbl: 'คิวรอดำเนินการปัจจุบัน',
        ord_stat_expired_lbl: 'ไม่โอนเกิน 24 ชม. / ยกเลิกสะสม',
        ord_btn_refresh: 'รีเฟรชรายการออเดอร์',
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
        pay_qr_title: 'ตั้งค่า QR รับเงินส่วนตัว (ไม่ต้องใช้เบอร์โทร / บัตร ปชช. / e-Wallet)',
        pay_qr_acct_lbl: 'ชื่อ-นามสกุลผู้รับเงิน (แสดงให้ลูกค้าตรวจเช็กก่อนโอน)',
        pay_qr_file_lbl: 'อัปโหลดรูปภาพ QR Code รับเงิน',
        pay_qr_file_hint: 'รองรับไฟล์ PNG / JPG / WebP (ย่อขนาดอัตโนมัติในเบราว์เซอร์) เก็บเป็นความลับในฐานข้อมูล D1 เท่านั้น ไม่บันทึกลง GitHub',
        pay_qr_btn_save: 'บันทึกการตั้งค่า QR',
        pay_qr_btn_clear: 'ลบรูป QR ออกจากฐานข้อมูล',
        pay_qr_preview_lbl: 'ตัวอย่างรูป QR ที่แสดงให้ลูกค้า',
        pay_qr_preview_empty: 'ยังไม่ได้อัปโหลดรูป QR ส่วนตัว',
        btn_collapse_pitch: 'ซ่อนรายละเอียด Pitch',
        btn_expand_pitch: 'แสดงรายละเอียด Pitch',
        btn_toggle_qr_hide: 'ซ่อนตั้งค่า QR',
        btn_toggle_qr_show: 'แก้ไข / แสดงตั้งค่า QR'
      },
      en: {
        skip_to_content: 'Skip to main content',
        nav_console_badge: 'Executive BI Console',
        nav_jump_league_label: 'Quick Jump to Landing, Demo & Mini-Leagues',
        nav_jump_placeholder: 'Quick Jump (Landing / Demo / 9 Leagues)...',
        nav_jump_landing: '🛒 Commercial Landing Page (index.html)',
        nav_jump_preview: '🎮 Showcase Demo Hub (preview.html)',
        nav_jump_hub: '🛒 Commercial Landing Page (index.html)',
        mod_nav_0: '0. Organizer Pitch Deck',
        mod_nav_1: '1. Audience & KPIs',
        mod_nav_2: '2. 9-League Portfolio',
        mod_nav_3: '3. Feature Value',
        mod_nav_4: '4. Channels & Geo',
        mod_nav_5: '5. Client Devices',
        mod_nav_6: '6. Matchday Traffic',
        mod_nav_7: '7. Cloud & Scaling',
        mod_nav_8: '8. Project Health Monitor',
        mod_nav_9: '9. Orders & Slips',
        mod_nav_10: '10. Onboarding Wizard',
        header_subtitle: 'Executive BI & Infrastructure Control',
        quick_league_placeholder: 'Quick Jump (Landing / Demo / 9 Leagues)...',
        quick_hub_home: '🛒 Commercial Landing Page (index.html)',
        sign_out: 'Sign Out',
        nav_pitch: '00. Pitch Deck',
        nav_audience: '01. Audience',
        nav_portfolio: '02. 9-League Portfolio',
        nav_features: '03. Product Value',
        nav_channels: '04. Acquisition',
        nav_devices: '05. Devices',
        nav_timing: '06. Traffic Rhythm',
        nav_system: '07. Cloud & Scaling',
        nav_monitor: '08. Health Monitor',
        page_title: 'Executive Summary & Live Business Intelligence',
        page_subtitle: 'Real-time portfolio economics across all 9 mini-leagues (8 Tier 1 + 1 Tier 2), user retention behavior, product adoption, and cloud scaling headroom.',
        btn_copy_exec: 'Copy Executive Brief',
        btn_copied_exec: 'Copied Brief to Clipboard!',
        btn_refresh: 'Refresh Live Data',
        btn_live_pitch_refresh: '⚡ Live Pitch Refresh',
        pitch_badge: 'Executive Pitch Deck · For Mini-League Organizers',
        sec0_title: '00. Turnkey Platform Solution for Mini-League Organizers',
        sec0_sub: '100% Self-Managing Mini-Leagues · Saves 190+ hrs/year · 5.7x Higher Member Engagement with fully auditable prize settlements.',
        pitch_tier1_ready: 'Tier 1: Turnkey & Ready to Onboard',
        pitch_tier2_roadmap: 'Tier 2: Live Beta (1,779 Teams)',
        pitch_step1_title: 'Organizer Pain Points vs FPLSaWaDiKa Zero-Touch Solution',
        pitch_step1_sub: 'Real-World Operational Comparison',
        pain_1_badge: 'Admin Pain',
        pain_1_metric: '5 hrs/wk wasted',
        pain_1_title: 'Manual Excel & Transfer Hit Audits',
        pain_1_desc: 'Manually cross-referencing transfers, deduction hits, and chip activations. Standings delayed 1-2 days.',
        sol_1_badge: 'FPLSaWaDiKa Solution',
        sol_1_desc: 'Automated 15s live scoring with real-time Net Pts transfer hit deductions and live bonus rankings.',
        pain_2_badge: 'Treasurer Pain',
        pain_2_metric: 'Prize Disputes',
        pain_2_title: 'Complex Prize & Penalty Calculation Errors',
        pain_2_desc: 'Complex custom league rules like bottom 5 penalties, weekly high-score payouts, and multi-tier prizes.',
        sol_2_badge: 'FPLSaWaDiKa Solution',
        sol_2_desc: 'Automated Prize Ledger calculating every payout and penalty with 100% auditable open transparency.',
        pain_3_badge: 'Community Pain',
        pain_3_metric: 'Mid-Season Churn',
        pain_3_title: 'Trailers Quit Early When Deficit Grows',
        pain_3_desc: 'If only annual prizes exist, trailing managers quit by GW10 when behind by 50+ points.',
        sol_3_badge: 'FPLSaWaDiKa Solution',
        sol_3_desc: 'Weekly Micro-Stakes + Pundit AI Banter keeps everyone fighting every gameweek till GW38.',
        pain_4_badge: 'App UX Pain',
        pain_4_metric: 'Cumbersome Scouting',
        pain_4_title: 'Slow Opponent Squad Scouting',
        pain_4_desc: 'Official app requires endless back-and-forth clicks without side-by-side bench and live points.',
        sol_4_badge: 'FPLSaWaDiKa Solution',
        sol_4_desc: 'Interactive Squad Pitch Modal shows complete 11 starters + bench auto-subs in one single tap.',
        pitch_step2_title: '4 Visual Proof Dimensions & Proven Analytics',
        pitch_step2_sub: 'Audited Data Across 9 Mini-Leagues',
        graphic1_eyebrow: 'Dimension 1 · Operational ROI',
        graphic1_badge: '190 hrs/yr saved',
        graphic1_title: 'Organizer Workload: Manual (Excel) vs FPLSaWaDiKa',
        graphic1_sub: 'Benchmarked on 20–80 team leagues across 38 gameweeks',
        bar_manual_label: 'Manual Excel Spreadsheet Auditing',
        bar_fpl_label: 'FPLSaWaDiKa Zero-Touch Platform',
        graphic1_callout: 'Saves over 24 full working days per season for organizers!',
        graphic2_eyebrow: 'Dimension 2 · Member Stickiness',
        graphic2_badge: '5.7x Higher Visits',
        graphic2_title: 'Weekly Visit Intensity: Official FPL vs FPLSaWaDiKa',
        graphic2_sub: 'Average weekly pageviews per manager (Visits/Team/GW)',
        graphic2_axis_y: 'Y-Axis: Avg Visits per Team (visits / GW)',
        graphic2_axis_x: 'Platform Segment',
        graphic2_callout: 'Weekly Stakes + Pundit AI Banter sparks non-stop chat group banter',
        graphic3_eyebrow: 'Dimension 3 · Financial Integrity',
        graphic3_badge: 'Total GMV ฿268,700',
        graphic3_title: 'Supports 5 Automated Prize & Penalty Frameworks',
        graphic3_sub: 'Flexible to any custom mini-league rules with zero human error',
        pmodel_1_title: 'Weekly Top-Score',
        pmodel_1_sub: 'Highest weekly scorer payout',
        pmodel_2_title: 'Bottom 5 Penalties',
        pmodel_2_sub: 'Relegation penalty tier',
        pmodel_3_title: 'Zero-Sum Ladder',
        pmodel_3_sub: 'End-of-season bilateral settlement',
        pmodel_4_title: 'Dual Milestones',
        pmodel_4_sub: 'Half-season & final milestone prizes',
        graphic3_callout: 'Fully auditable financial history with zero disputed baht',
        graphic4_eyebrow: 'Dimension 4 · Feature Matrix',
        graphic4_badge: 'Tier 1 vs Tier 2',
        graphic4_title: 'Feature Comparison Matrix & Live Readiness',
        graphic4_sub: 'Official App vs Tier 2 Live Beta vs Tier 1 Turnkey Core',
        col_feat: 'Feature',
        col_fpl_app: 'Official App',
        col_tier2: 'Tier 2 (Live Beta)',
        col_tier1: 'Tier 1 (Turnkey Core)',
        matrix_f1: '15s Real-Time Score & Live BPS',
        matrix_f2: 'Live Net Pts (Transfer Cost Hit)',
        matrix_f3: 'Hardcore Pundit AI Match Commentary',
        matrix_f4: 'Automated Custom Prize/Penalty Engine',
        matrix_f5: 'One-Tap Squad Lineup Pitch Modal',
        graphic4_callout: 'Tier 1 ready to onboard immediately · Tier 2 (Live Beta) scales to 1,779 teams',
        pitch_step3_title: 'Live Interactive Demo Jump Links',
        pitch_step3_sub: 'Click any module to open live demo in new tab',
        jump_1_title: 'Live Scores & Squad Pitch',
        jump_1_sub: 'Scout starting 11 & bench live',
        jump_2_title: 'Pundit AI Commentary',
        jump_2_sub: 'Authentic matchday drama',
        jump_3_title: 'Automated Payouts & Penalties',
        jump_3_sub: 'Bottom penalty ledger',
        jump_4_title: 'Global Form Radar',
        jump_4_sub: 'Cross-league benchmark',
        jump_5_title: 'Knockout Cup Bracket',
        jump_5_sub: 'Automated tournament grid',
        telem_live_active: 'Live Edge Telemetry Active',
        telem_auto_sync: '(Auto-sync Hourly / 4h · ${authProvider})',
        telem_last_sync_label: 'Last Data Sync: ',
        telem_runner_label: 'Pipeline Runner: ',
        telem_countdown_sub: 'Next Transfer Deadline Countdown',
        sec1_title: '01. Audience Scale & Retention Velocity',
        sec1_sub: 'Core user growth, matchday concurrency, and cohort stickiness (Live D1 vs Season Benchmarks)',
        badge_live_sync: 'Live Sync',
        badge_live_d1: 'Live D1',
        badge_benchmark: 'Benchmark',
        kpi_managers_label: 'Tracked Managers',
        kpi_managers_sub: '8 Tier 1 Leagues (1,942 Total incl. Tier 2)',
        kpi_mau_label: 'Matchday Active Users',
        kpi_mau_sub: 'Includes 3.7x spectator multiplier',
        kpi_offpeak_label: 'Off-Peak Daily Active',
        kpi_offpeak_sub: 'Tue–Thu transfer planning baseline',
        kpi_stickiness_label: 'Matchday Stickiness',
        kpi_stickiness_sub: 'Season Benchmark (> 3 visits/wk · Privacy-First)',
        kpi_retention_label: 'GW-over-GW Retention',
        kpi_retention_sub: 'Season Benchmark (< 6% churn · Privacy-First)',
        kpi_screentime_label: 'Avg Session Duration',
        kpi_screentime_sub: 'Second-screen live match tracking',
        sec2_title: '02. Multi-League Portfolio (9 Leagues) & Commercial Economics',
        sec2_sub: 'Click column headers to sort · League name column stays pinned on mobile horizontal scroll',
        port_gmv_label: 'Total Prize Pool Under Management (GMV)',
        port_gmv_sub: 'Combined season pot + weekly & monthly payouts across all leagues',
        port_custom_label: 'Leagues with Custom Prize Rules',
        port_custom_sub: 'High switching cost vs generic FPL trackers',
        port_landing_label: 'Commercial Landing Page Views (7d)',
        port_landing_sub: 'Separated from 9 mini-leagues (buyer acquisition traffic)',
        port_whitelabel_label: 'White-Label Expansion Capacity',
        port_whitelabel_val: 'Ready for 50+ Leagues',
        port_whitelabel_sub: '฿0 marginal server cost on current Edge + Static architecture',
        col_league_name: 'League Name & ID',
        col_teams: 'Teams',
        col_pool: 'Prize Pool (GMV)',
        col_modules: 'Active Modules & Rule Engine',
        col_views: 'Views (Last 7d)',
        col_retention: 'Retention (Benchmark)',
        sec3_title: '03. Feature Adoption & Product Value Matrix',
        sec3_sub: 'Which modules drive repeat engagement and justify SaaS / White-Label monetization',
        feat_share_title: 'Module Interaction Share (% of Total User Sessions)',
        feat_share_badge: 'Verified Edge Events',
        feat_1_name: '1. Live Standings & Real-Time Bonus System (Live BPS Matrix)',
        feat_1_desc: 'Core hook: Managers keep the table open during live matches to watch rank swings on every goal.',
        feat_2_name: '2. Weekly / Monthly / Net Prize Ledger (Financial Engine)',
        feat_2_desc: 'Primary moat: Official FPL apps do not track custom mini-league payouts or transfer hit penalties.',
        feat_3_name: '3. Starting XI Inspector & Rival H2H Matrix (Squad Modal)',
        feat_3_desc: 'High engagement: Checking rival bench auto-subs and captain differentials right after deadline.',
        feat_4_name: '4. What-If Simulator & Transfer Planner',
        feat_4_desc: 'Growth lever: Drives mid-week traffic (Tue–Fri) prior to the Gameweek deadline.',
        feat_5_name: '5. League History & Hall of Fame Records',
        feat_insight_title: 'Behavioral Split: Prize-Pool vs. Community Leagues',
        feat_insight_desc: 'Comparing session intensity per manager to guide SaaS / White-Label tier pricing.',
        feat_paid_label: 'High-Stakes Prize Leagues (e.g., 1101958 · ฿103,200)',
        feat_paid_val: '241 Sessions / Team / GW',
        feat_paid_sub: 'Managers & friends refresh live standings and prize payouts continuously during matches.',
        feat_comm_label: 'Community & Flagship Scale (e.g., 675290 · 60 Teams / Tier 2 · 1,779 Teams)',
        feat_comm_val: '17.2 Sessions / Team / GW',
        feat_comm_sub: 'Primarily post-match checks; ~14x lower session frequency than prize-backed leagues.',
        feat_takeaway_title: 'Executive Strategic Takeaway',
        feat_takeaway_body: 'The automated “Prize & Financial Ledger” is the #1 monetization driver for onboarding Thai mini-league chairmen.',
        sec4_title: '04. Acquisition Channels & Geographic Reach',
        sec4_sub: 'Where users originate and how traffic routes across regional edge nodes',
        chan_title: 'User Acquisition & Referral Channels (Traffic Sources)',
        chan_1_name: 'LINE Group Links & In-App Browser (Mini-League Group Chats)',
        chan_1_desc: 'Primary viral loop: League admins share live standings links into LINE group chats every GW.',
        chan_2_name: 'Direct / Home Screen Bookmark (PWA-style Launch)',
        chan_2_desc: 'Core power users who pin the dashboard directly to their iOS/Android home screen.',
        chan_3_name: 'Deep-Link Direct & Smart Text Summary (LINE / URL Sharing)',
        chan_3_desc: 'Live Today: Copy LINE payout summaries and share direct mini-league deep links (/{id}/).',
        geo_title: 'Geographic & Language Distribution (Geo & Locale)',
        geo_1: 'Bangkok & Greater Metropolitan Area (BKK)',
        geo_2: 'Major Thai Regional Hubs (Chiang Mai · Chonburi · Khon Kaen · Phuket)',
        geo_3: 'International Expats (UK · Singapore · Australia · Japan)',
        geo_lang_label: 'Interface Language Preference (TH / EN)',
        geo_edge_title: 'Cloudflare Bangkok Edge (BKK): ',
        geo_edge_desc: '92.2% of traffic is served directly from the Bangkok PoP with 18–26 ms average latency.',
        sec5_title: '05. Device, Viewport & Client Environment',
        sec5_sub: 'Switch between 7-day and 30-day live device telemetry from Cloudflare D1',
        dev_btn_7d: 'Last 7d',
        dev_btn_30d: 'Last 30d',
        dev_mobile_label: 'Mobile Smartphones',
        dev_primary_badge: '#1 Top Device (30d)',
        dev_mobile_desc: 'Mobile viewports 375px–430px (loading 30d live telemetry...)',
        dev_desktop_label: 'Desktop & Laptop Workstations',
        dev_desktop_badge: '1024px+ Screen',
        dev_desktop_desc: 'Desktop & laptop screens 1024px+ (loading 30d live telemetry...)',
        dev_tablet_label: 'iPad & Tablet Devices',
        dev_tablet_badge: '768px–1024px Screen',
        dev_tablet_desc: 'Tablet screens 768px–1024px (loading 30d live telemetry...)',
        sec6_title: '06. Matchday Traffic Rhythm & Concurrency Windows',
        sec6_sub: 'Interactive 24-hour matchday concurrency curve (ICT) and 7-day rolling session volume',
        chart_title_hourly: '24-Hour Matchday Concurrency Curve (Thailand Time · ICT)',
        chart_sub_hourly: 'Peaks Saturday 21:00–23:30 ICT during simultaneous kickoffs (68% of weekly load)',
        chart_title_daily: '7-Day Rolling Session Volume (Daily Visits)',
        chart_sub_daily: 'Weekend matchday surge vs. mid-week transfer planning baseline',
        chart_btn_24h: '24h Matchday',
        chart_btn_7d: '7-Day Volume',
        chart_legend_peak: 'Live Match / Deadline Peak',
        chart_legend_normal: 'Baseline Window',
        peak_windows_title: '3 Critical Concurrency Windows',
        peak_1_time: 'Sat 21:00 – 00:30 ICT',
        peak_1_title: 'Simultaneous 5–6 Match Kickoff Window',
        peak_1_desc: 'Highest refresh velocity as goals and bonus points fluctuate; Edge Cache absorbs 94% of requests.',
        peak_2_time: '90m Pre-Deadline (Fri / Sat)',
        peak_2_title: 'Team News Leaks & Captaincy Reveal',
        peak_2_desc: 'Sharp spike before deadline lock and immediately after when managers inspect rival captains.',
        peak_3_time: 'Mon / Tue 06:30 – 10:00 ICT',
        peak_3_title: 'Weekly Prize Settlement & Treasurer Audit',
        peak_3_desc: 'League treasurers and members verify final weekly winners after GitHub Actions completes sync.',
        sec7_title: '07. System Performance, Cloud Quota & Scaling Capacity',
        sec7_sub: 'Real-time infrastructure health, free-tier quota utilization, and multi-league scaling headroom',
        sys_cache_hit_label: 'Edge Cache Hit Ratio:',
        sys_d1_reads_label: 'Daily Read/Write Quota:',
        sys_gh_success_label: '30-Day Sync Reliability (Benchmark):',
        sys_scale_headroom_label: 'Scaling Headroom:',
        ops_title: 'Site Care & Quick Diagnostic Controls',
        ops_sub: 'Use only when checking or fixing live issues. Results appear directly under each button (zero impact on visitors).',
        ops_shortcut_hint: 'Shortcuts: R Refresh · L Language · T Theme',
        op_flush_title: 'Refresh Live Scores Across Site',
        op_flush_desc: 'Use when live scores or bonus points appear stuck so everyone gets fresh data right away.',
        op_flush_btn: 'Refresh Live Scores Now',
        op_ping_title: 'Check Premier League Server Status',
        op_ping_desc: 'Verify whether score delays are coming from the official FPL website being slow or down.',
        op_ping_btn: 'Check FPL Server',
        op_export_title: 'Save Full Stats Snapshot',
        op_export_desc: 'Download a backup file of all 9 leagues and visitor stats for your records or sharing.',
        op_export_btn: 'Download Stats File',
        op_prune_title: 'Clean Up Old Visitor Logs (>30 Days)',
        op_prune_desc: 'Remove old daily logs to keep the system fast (total lifetime visitor count stays completely safe).',
        op_prune_btn: 'Clean Old Logs (>30d)',
        sec8_title: '08. Project Health & Error Monitor (1 Day / 7 Days)',
        sec8_sub: 'Track 24-hour (hourly) and 7-day (daily) project stability, uptime, and exact timestamps of any user-facing errors',
        mon_status_healthy: 'All Systems Healthy (100%)',
        mon_status_warning: 'Minor Errors Detected',
        mon_status_incident: 'Anomalies Detected — Review Needed',
        mon_kpi_24h_label: '24-Hour Availability (1 Day)',
        mon_kpi_7d_label: '7-Day Availability (1 Week)',
        mon_kpi_client_label: 'User-Facing Web Errors',
        mon_kpi_client_sub: 'Browser JS exceptions, timeouts, or data fetch failures',
        mon_kpi_upstream_label: 'FPL Upstream Errors (5xx)',
        mon_kpi_upstream_sub: 'Official FPL API slowdowns or temporary 5xx outages',
        mon_chart_title_24h: 'Last 24 Hours Health & Error Log (Thailand Time · ICT)',
        mon_chart_sub_24h: 'Hourly normal activity vs. detected client/upstream errors',
        mon_chart_title_7d: 'Last 7 Days Health & Error Log (1 Week)',
        mon_chart_sub_7d: 'Daily system activity vs. client/upstream errors across 7 days',
        mon_btn_24h: '1 Day (24h)',
        mon_btn_7d: '1 Week (7d)',
        mon_legend_ok: 'Normal Activity (events)',
        mon_legend_err: 'Window with Errors',
        mon_anomaly_title: 'Anomaly & Error Timeline',
        mon_cat_title: '7-Day Error Breakdown by Type',
        footer_rights: 'Executive Business Intelligence & Multi-League Infrastructure Suite',
        toast_refreshed: 'Live telemetry and portfolio metrics synchronized from Edge Worker.',
        confirm_prune: 'Remove daily visitor logs older than 30 days? (Your total lifetime views will NOT be deleted.)',
        sec9_title: '09. Customer Orders & Payment Slip Inbox',
        sec9_sub: 'Configure your private payment QR, verify exact satang transfers, inspect customer slips, prefill the Onboarding Wizard below, and mark leagues live.',
        sec10_title: '10. Customer League Onboarding Wizard (Concierge Flow)',
        sec10_sub: 'Inspect live FPL Classic League IDs, exclude non-prize teams, configure plan rules, and generate ready-to-run onboarding scripts.',
        onb_lbl_id: 'FPL Classic League ID (digits only)',
        onb_btn_inspect: 'Inspect Live League',
        onb_lbl_plan: 'Package Plan',
        onb_lbl_prize: 'Prize Model',
        onb_lbl_weekly: 'Weekly Prize (THB)',
        onb_lbl_status: 'Access Status',
        onb_lbl_tenant: 'Tenant Group (Visibility Scope)',
        onb_lbl_visibility: 'Visibility & SEO',
        onb_lbl_short: 'Short Display Name',
        onb_lbl_expires: 'Expiry Date (Expires At)',
        onb_lbl_billing: 'Admin Note (Private Only)',
        onb_lbl_nocup: 'Disable Knockout Cup Tab (--no-cup)',
        onb_lbl_currency: 'Prize Currency',
        onb_lbl_entry_fee: 'Entry Fee / Team (Optional)',
        onb_lbl_total_pool: 'Total Prize Pool (Optional)',
        onb_lbl_season_prizes: 'Season Podium Prizes (Optional)',
        onb_lbl_cup_prize: 'Cup Prize (Champ or Champ/Runner)',
        onb_lbl_penalty_tiers: 'Bottom-N Penalty Tiers (comma-separated, last place first)',
        onb_penalty_hint: 'Supports any N bottom ranks (e.g. Bottom 3 = 300,200,100). Headers and cards adapt automatically.',
        onb_lbl_monthly_champ: 'Monthly Champion Prize (per month)',
        onb_lbl_monthly_runner: 'Monthly Runner-up Prize (0 for Champ only)',
        onb_d1_note_tip: '🔒 Store private customer notes (LINE handle / payment date) in Section 02 above (saved in Cloudflare D1, 0% Git exposure).',
        col_lifecycle: 'Lifecycle & Expiry',
        col_actions: 'Manage',
        pf_filter_all: 'All Leagues',
        pf_filter_private: 'Private Customers',
        pf_filter_expiring: 'Trial / Expiring ≤14d',
        pf_filter_paused: 'Paused',
        pf_filter_showcase: 'Showcase Demos',
        onb_teams_hint: 'Select any teams excluded from prize calculations (non_prize_teams):',
        onb_out_cli: '1. CLI Onboarding Command',
        onb_out_json: '2. Config JSON (leagues_config.json)',
        onb_out_line: '3. Customer LINE Handoff Message',
        ord_stat_total_lbl: 'Total Lifetime Orders',
        ord_stat_paid_lbl: 'Paid / Launched Leagues',
        ord_stat_active_lbl: 'Active Open Queue',
        ord_stat_expired_lbl: 'Unpaid Expired / Cancelled',
        ord_btn_refresh: 'Refresh Orders',
        ord_f_all: 'All',
        ord_f_slip: 'Slip Submitted',
        ord_f_await: 'Awaiting QR',
        ord_f_paid: 'Paid',
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
        pay_qr_title: 'Private Payment QR Settings (No Phone / ID / e-Wallet Required)',
        pay_qr_acct_lbl: 'Recipient Account Name (Shown to Customers for Verification)',
        pay_qr_file_lbl: 'Upload Payment QR Code Image',
        pay_qr_file_hint: 'Supports PNG / JPG / WebP (auto-resized in your browser). Stored privately in Cloudflare D1 only — never committed to GitHub.',
        pay_qr_btn_save: 'Save QR Settings',
        pay_qr_btn_clear: 'Remove Stored QR Image',
        pay_qr_preview_lbl: 'Customer Checkout QR Preview',
        pay_qr_preview_empty: 'No private QR image uploaded yet',
        btn_collapse_pitch: 'Collapse Pitch',
        btn_expand_pitch: 'Show Pitch',
        btn_toggle_qr_hide: 'Hide QR Settings',
        btn_toggle_qr_show: 'Edit QR Settings'
      }
    };

    // =========================================================================
    // 2. PORTFOLIO DATASET & SORTING ENGINE
    // =========================================================================
    let LEAGUE_PORTFOLIO = [
      { id: '40700', name: 'เซียนอยู่รู หมูอยู่ตึก', badge: 'Flagship', teams: 12, pool: 20000, modulesTh: 'รางวัลรายสัปดาห์ 300 บ. · บอลถ้วย · หักชำระรายงวด', modulesEn: 'Weekly 300 THB · Cup · Settlement Phases', views: 4820, retention: 98.5, plan: 'standard', status: 'active', visibility: 'showcase', tenant_group: 'showcase', expires_at: null, days_remaining: null, expiry_alert: 'none', billing_note: '' },
      { id: '675290', name: 'NudNee', badge: '', teams: 60, pool: 36000, modulesTh: 'รางวัลรายเดือน · บอลถ้วย Knock-out · การกุศล', modulesEn: 'Monthly · Knock-out Cup · Charity', views: 3610, retention: 94.8, plan: 'standard', status: 'active', visibility: 'showcase', tenant_group: 'showcase', expires_at: null, days_remaining: null, expiry_alert: 'none', billing_note: '' },
      { id: '38491', name: 'รอ แมน โอน', badge: '', teams: 16, pool: 28500, modulesTh: 'รางวัลรายสัปดาห์ · บอลถ้วย · หักชำระรายงวด', modulesEn: 'Weekly · Cup · Settlement Phases', views: 1490, retention: 93.2, plan: 'standard', status: 'active', visibility: 'showcase', tenant_group: 'showcase', expires_at: null, days_remaining: null, expiry_alert: 'none', billing_note: '' },
      { id: '1101958', name: "Barley's Official League", badge: '', teams: 17, pool: 103200, modulesTh: 'ตารางรางวัลรายสัปดาห์หลายขั้น · บอลถ้วย · บัญชีเงินรางวัล', modulesEn: 'Weekly Tier Prizes · Cup · Ledger', views: 980, retention: 95.0, plan: 'standard', status: 'active', visibility: 'showcase', tenant_group: 'showcase', expires_at: null, days_remaining: null, expiry_alert: 'none', billing_note: '' },
      { id: '438691', name: '2 spade', badge: '', teams: 13, pool: 68400, modulesTh: 'รางวัลรายสัปดาห์ · ค่าปรับบ๊วย 5 อันดับ · บอลถ้วย', modulesEn: 'Weekly · Bottom-5 Penalty · Cup', views: 810, retention: 92.4, plan: 'standard', status: 'active', visibility: 'showcase', tenant_group: 'showcase', expires_at: null, days_remaining: null, expiry_alert: 'none', billing_note: '' },
      { id: '187827', name: 'Shi62', badge: '', teams: 13, pool: 3100, modulesTh: 'Zero-Sum ขั้นบันไดทั้งปี · พิเศษครึ่งฤดูกาลหลัง', modulesEn: 'Zero-Sum Annual Tiers · 2nd Half Special', views: 740, retention: 91.8, plan: 'custom', status: 'active', visibility: 'showcase', tenant_group: 'showcase', expires_at: null, days_remaining: null, expiry_alert: 'none', billing_note: '' },
      { id: '5349', name: 'Bramann League', badge: '', teams: 20, pool: 9500, modulesTh: 'เงินรางวัลคู่ · ทายผล & ชาเลนจ์รายสัปดาห์', modulesEn: 'Dual Prize · Prediction & Challenge', views: 860, retention: 90.5, plan: 'custom', status: 'active', visibility: 'showcase', tenant_group: 'showcase', expires_at: null, days_remaining: null, expiry_alert: 'none', billing_note: '' },
      { id: '567387', name: 'Fantasy Nguan & friends cup', badge: 'Community', teams: 12, pool: 0, poolLabelTh: 'คอมมูนิตี้', poolLabelEn: 'Community', modulesTh: 'ลีกคอมมูนิตี้ · ตารางคะแนนสด · ผัง 11 ตัวจริง', modulesEn: 'Community · Live Matrix · Pitch Modal', views: 2190, retention: 88.4, plan: 'standard', status: 'active', visibility: 'showcase', tenant_group: 'showcase', expires_at: null, days_remaining: null, expiry_alert: 'none', billing_note: '' },
      { id: '139836', name: 'FPL Growth Mindset 2026/27', badge: 'Tier 2', teams: 1779, pool: 0, poolLabelTh: 'เสื้อบอลแท้', poolLabelEn: 'Official Shirt', modulesTh: 'Tier 2 Standings & Leaderboard · ค้นหา 1,779 ทีมทันที', modulesEn: 'Tier 2 Standings & Leaderboard · 1,779-Team Search', views: 0, retention: 91.2, plan: 'tier2_beta', status: 'active', visibility: 'showcase', tenant_group: 'showcase', expires_at: null, days_remaining: null, expiry_alert: 'none', billing_note: '' }
    ];

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
      summary_24h: { activity_count: 0, client_errors: 0, upstream_errors: 0, total_errors: 0, error_rate_pct: '0.00', uptime_pct: '100.00', status: 'healthy' },
      summary_7d: { activity_count: 0, client_errors: 0, upstream_errors: 0, total_errors: 0, error_rate_pct: '0.00', uptime_pct: '100.00', status: 'healthy' },
      error_categories_7d: { js_error: 0, api_timeout: 0, api_http: 0, data_load: 0, upstream_5xx: 0 },
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
      series_7d: Array.from({ length: 7 }, (_, idx) => ({
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

    let HOURLY_SERIES = [
      { hour: '00:00', pct: 48, peak: true }, { hour: '01:00', pct: 32, peak: false },
      { hour: '02:00', pct: 19, peak: false }, { hour: '03:00', pct: 9, peak: false },
      { hour: '04:00', pct: 4, peak: false },  { hour: '05:00', pct: 3, peak: false },
      { hour: '06:00', pct: 8, peak: false },  { hour: '07:00', pct: 16, peak: false },
      { hour: '08:00', pct: 24, peak: false }, { hour: '09:00', pct: 28, peak: false },
      { hour: '10:00', pct: 22, peak: false }, { hour: '11:00', pct: 18, peak: false },
      { hour: '12:00', pct: 25, peak: false }, { hour: '13:00', pct: 21, peak: false },
      { hour: '14:00', pct: 19, peak: false }, { hour: '15:00', pct: 23, peak: false },
      { hour: '16:00', pct: 29, peak: false }, { hour: '17:00', pct: 42, peak: false },
      { hour: '18:00', pct: 68, peak: true },  { hour: '19:00', pct: 76, peak: true },
      { hour: '20:00', pct: 84, peak: true },  { hour: '21:00', pct: 96, peak: true },
      { hour: '22:00', pct: 100, peak: true }, { hour: '23:00', pct: 82, peak: true }
    ];

    let DAILY_SERIES = [
      { dayTh: 'จ.', dayEn: 'Mon', visits: 620, peak: false },
      { dayTh: 'อ.', dayEn: 'Tue', visits: 340, peak: false },
      { dayTh: 'พ.', dayEn: 'Wed', visits: 310, peak: false },
      { dayTh: 'พฤ.', dayEn: 'Thu', visits: 390, peak: false },
      { dayTh: 'ศ.', dayEn: 'Fri', visits: 890, peak: true },
      { dayTh: 'ส.', dayEn: 'Sat', visits: 1420, peak: true },
      { dayTh: 'อา.', dayEn: 'Sun', visits: 1180, peak: true }
    ];

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

      ['name', 'teams', 'pool', 'views', 'retention', 'status'].forEach((k) => {
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
        const emptyText = lang === 'en' ? 'No leagues match this lifecycle filter.' : 'ยังไม่มีลีกในกลุ่มสถานะที่เลือก';
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
        const modulesText = lang === 'en' ? (row.modulesEn || row.modulesTh) : (row.modulesTh || row.modulesEn);
        const badgePart = row.badge ? ' · ' + row.badge : '';
        const targetUrl = 'https://www.fplsawadika.com/' + encodeURIComponent(row.id) + '/?lang=' + lang + '&theme=' + theme;
        const manageText = lang === 'en' ? 'Manage' : 'จัดการสิทธิ์';

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
          '<td class="px-4 py-3 text-right mono tabular whitespace-nowrap font-medium text-slate-900 dark:text-white">' + Number(row.views).toLocaleString() + '</td>' +
          '<td class="px-4 py-3 text-right mono tabular whitespace-nowrap font-medium text-emerald-700 dark:text-emerald-400">' + Number(row.retention || 90).toFixed(1) + '%</td>' +
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
          ? 'Y-Axis: Traffic Load Index (% of peak hour)'
          : 'แกนตั้ง (Y): ดัชนีความหนาแน่นเทียบพีคสูงสุด (% ของจุดพีค)';
        if (xAxisEl) xAxisEl.textContent = lang === 'en'
          ? 'X-Axis: Time of Day (ICT)'
          : 'แกนนอน (X): ช่วงเวลาในวัน (เวลาไทย · น.)';
        const peakPt = HOURLY_SERIES.reduce((best, cur) => (cur.pct > best.pct ? cur : best), { hour: '22:00', pct: 100 });
        if (calloutEl) calloutEl.textContent = lang === 'en'
          ? ('Peak: ' + peakPt.hour + ' ICT (' + peakPt.pct + '% Load Index)')
          : ('จุดพีคสูงสุด: ' + peakPt.hour + ' น. (' + peakPt.pct + '% ของจุดพีค)');

        const chartLeft = 40;
        const chartRight = 668;
        const chartTop = 22;
        const chartBottom = 184;
        const chartHeight = chartBottom - chartTop;
        const stepX = (chartRight - chartLeft) / HOURLY_SERIES.length;
        const barWidth = Math.max(10, stepX - 7);

        let html = '';
        [0, 25, 50, 75, 100].forEach((val) => {
          const y = chartBottom - (val / 100) * chartHeight;
          html += '<line x1="' + chartLeft + '" y1="' + y + '" x2="' + chartRight + '" y2="' + y + '" stroke="' + gridColor + '" stroke-dasharray="3 3" stroke-width="1" />';
          html += '<text x="2" y="' + (y + 4) + '" fill="' + labelColor + '" font-size="10" font-family="JetBrains Mono, monospace">' + val + '%</text>';
        });

        HOURLY_SERIES.forEach((pt, idx) => {
          const x = chartLeft + idx * stepX + 3;
          const barH = Math.max(4, (pt.pct / 100) * chartHeight);
          const y = chartBottom - barH;
          const fill = pt.peak ? peakBarColor : normalBarColor;
          const tip = lang === 'en'
            ? (pt.hour + ' ICT: ' + pt.pct + '% of peak traffic load' + (pt.peak ? ' (Peak Window)' : ''))
            : ('เวลา ' + pt.hour + ' น. · ความหนาแน่น ' + pt.pct + '% ของจุดพีค' + (pt.peak ? ' (ช่วงพีค)' : ''));
          html += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barWidth.toFixed(1) + '" height="' + barH.toFixed(1) + '" rx="3" fill="' + fill + '">' +
            '<title>' + escHtml(tip) + '</title></rect>';

          if (pt.hour === peakPt.hour || (pt.pct >= 80 && idx % 2 === 0)) {
            html += '<text x="' + (x + barWidth / 2).toFixed(1) + '" y="' + (y - 5).toFixed(1) + '" text-anchor="middle" fill="' + peakBarColor + '" font-size="9.5" font-weight="600" font-family="JetBrains Mono, monospace">' + pt.pct + '%</text>';
          }

          if (idx % 3 === 0 || idx === 22) {
            html += '<text x="' + (x + barWidth / 2).toFixed(1) + '" y="206" text-anchor="middle" fill="' + labelColor + '" font-size="10" font-family="JetBrains Mono, monospace">' + pt.hour.slice(0, 2) + (lang === 'en' ? 'h' : ':00') + '</text>';
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
        const maxVisits = Math.max(...DAILY_SERIES.map((d) => d.visits), 100);
        if (calloutEl) calloutEl.textContent = lang === 'en'
          ? 'Weekend Peak: ' + maxVisits.toLocaleString() + ' visits/day'
          : 'พีคสูงสุด: ' + maxVisits.toLocaleString() + ' ครั้ง/วัน';

        const chartLeft = 52;
        const chartRight = 660;
        const chartTop = 24;
        const chartBottom = 184;
        const chartHeight = chartBottom - chartTop;
        const stepX = (chartRight - chartLeft) / DAILY_SERIES.length;
        const barWidth = Math.min(48, stepX - 24);
        const unitSuffix = lang === 'en' ? ' visits' : ' ครั้ง';

        let html = '';
        [0, 0.25, 0.5, 0.75, 1].forEach((ratio) => {
          const val = Math.round(maxVisits * ratio);
          const y = chartBottom - ratio * chartHeight;
          html += '<line x1="' + chartLeft + '" y1="' + y + '" x2="' + chartRight + '" y2="' + y + '" stroke="' + gridColor + '" stroke-dasharray="3 3" stroke-width="1" />';
          html += '<text x="2" y="' + (y + 4) + '" fill="' + labelColor + '" font-size="10" font-family="JetBrains Mono, monospace">' + val.toLocaleString() + '</text>';
        });

        DAILY_SERIES.forEach((pt, idx) => {
          const center = chartLeft + idx * stepX + stepX / 2;
          const x = center - barWidth / 2;
          const barH = Math.max(6, (pt.visits / maxVisits) * chartHeight);
          const y = chartBottom - barH;
          const fill = pt.peak ? peakBarColor : normalBarColor;
          const label = lang === 'en' ? pt.dayEn : pt.dayTh;
          const tip = label + ': ' + pt.visits.toLocaleString() + (lang === 'en' ? ' visits/day' : ' ครั้ง/วัน');

          html += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barWidth.toFixed(1) + '" height="' + barH.toFixed(1) + '" rx="4" fill="' + fill + '">' +
            '<title>' + escHtml(tip) + '</title></rect>';
          html += '<text x="' + center.toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle" fill="' + labelColor + '" font-size="10" font-weight="600" font-family="JetBrains Mono, monospace">' + pt.visits.toLocaleString() + unitSuffix + '</text>';
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
      const activeSummary = currentMonitorMode === '7d' ? s7 : s24;

      const overallStatus = (s24.status === 'incident' || s7.status === 'incident')
        ? 'incident'
        : ((s24.status === 'warning' || s7.status === 'warning') ? 'warning' : 'healthy');

      const badge = document.getElementById('monitorOverallBadge');
      const badgeText = document.getElementById('monitorOverallBadgeText');
      if (badge && badgeText) {
        const dot = badge.querySelector('span:first-child');
        if (overallStatus === 'healthy') {
          badge.className = 'inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-medium text-emerald-700 dark:text-emerald-300 shrink-0';
          if (dot) dot.className = 'w-2 h-2 rounded-full bg-emerald-500';
          badgeText.textContent = dict.mon_status_healthy;
        } else if (overallStatus === 'warning') {
          badge.className = 'inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-xs font-medium text-amber-700 dark:text-amber-300 shrink-0';
          if (dot) dot.className = 'w-2 h-2 rounded-full bg-amber-500';
          badgeText.textContent = dict.mon_status_warning;
        } else {
          badge.className = 'inline-flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-xs font-medium text-rose-700 dark:text-rose-300 shrink-0';
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
            const detailText = lang === 'en'
              ? (Number(item.client_errors || 0) + ' web errors · ' + Number(item.upstream_errors || 0) + ' FPL upstream 5xx')
              : ('ฝั่งผู้ใช้ ' + Number(item.client_errors || 0) + ' ครั้ง · เว็บ FPL ล่ม/ช้า ' + Number(item.upstream_errors || 0) + ' ครั้ง');
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
          { key: 'js_error', val: Number(cats.js_error || 0), labelTh: 'สคริปต์หน้าเว็บขัดข้อง (JS Error)', labelEn: 'Frontend JS Exception' },
          { key: 'api_timeout', val: Number(cats.api_timeout || 0), labelTh: 'เชื่อมต่อช้าเกินกำหนด (Timeout)', labelEn: 'API Request Timeout' },
          { key: 'api_http', val: Number(cats.api_http || 0), labelTh: 'ดึงคะแนนสดไม่สำเร็จ (Live API)', labelEn: 'Live Edge Fetch Failure' },
          { key: 'data_load', val: Number(cats.data_load || 0), labelTh: 'เปิดดูข้อมูลทีมไม่ขึ้น (Picks Load)', labelEn: 'Squad Picks Load Failure' },
          { key: 'upstream_5xx', val: Number(cats.upstream_5xx || 0), labelTh: 'เว็บ FPL ต้นทางล่มชั่วคราว (5xx)', labelEn: 'Upstream FPL 5xx Outage' }
        ];
        const totalCatErr = items.reduce((s, x) => s + x.val, 0);
        if (totalCatErr === 0) {
          breakdownEl.innerHTML =
            '<div class="p-3 rounded-lg border border-borderLight dark:border-borderDark bg-raisedLight dark:bg-raisedDark text-slate-600 dark:text-neutral-400 leading-relaxed">' +
            (lang === 'en'
              ? '0 errors recorded across all 5 categories during the past 7 days.'
              : 'ยังไม่มี Error สะสมในทุกหมวดหมู่ตลอด 7 วันที่ผ่านมา') +
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

      series.forEach((pt, idx) => {
        const act = Number(pt.activity || 0);
        const errCount = Number(pt.total_errors || 0);
        const center = chartLeft + idx * stepX + stepX / 2;
        const x = center - barWidth / 2;
        const actH = act > 0 ? Math.max(6, (act / maxVal) * chartHeight) : 4;
        const actY = chartBottom - actH;
        const barFill = act > 0 ? okBarColor : idleBarColor;

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

        const tooltipText = lang === 'en'
          ? ((pt.label || pt.date || '') + ' | Normal Events: ' + act.toLocaleString() + ' | Total Errors: ' + errCount +
             ' (User Web: ' + Number(pt.client_errors || 0) + ', Upstream FPL 5xx: ' + Number(pt.upstream_errors || 0) + ')')
          : ((pt.label ? (pt.label + ' น.') : (pt.date || '')) + ' | ใช้งานปกติ: ' + act.toLocaleString() + ' ครั้ง | Error รวม: ' + errCount +
             ' ครั้ง (ฝั่งผู้ใช้ ' + Number(pt.client_errors || 0) + ', เว็บ FPL ' + Number(pt.upstream_errors || 0) + ')');

        html += '<rect x="' + x.toFixed(1) + '" y="' + actY.toFixed(1) + '" width="' + barWidth.toFixed(1) + '" height="' + actH.toFixed(1) + '" rx="3" fill="' + barFill + '" opacity="' + (act > 0 ? '0.88' : '0.45') + '">' +
          '<title>' + escHtml(tooltipText) + '</title></rect>';

        if (act > 0 && errCount === 0 && (currentMonitorMode === '7d' || act >= maxVal * 0.25)) {
          html += '<text x="' + center.toFixed(1) + '" y="' + Math.max(12, actY - 6).toFixed(1) + '" text-anchor="middle" fill="' + labelColor + '" font-size="9.5" font-weight="600" font-family="JetBrains Mono, monospace">' + act.toLocaleString() + okUnit + '</text>';
        }

        if (errCount > 0) {
          const errH = Math.max(12, Math.min(chartHeight, ((errCount * 4) / maxVal) * chartHeight));
          const errY = chartBottom - errH;
          html += '<rect x="' + x.toFixed(1) + '" y="' + errY.toFixed(1) + '" width="' + barWidth.toFixed(1) + '" height="' + errH.toFixed(1) + '" rx="3" fill="' + errBarColor + '" opacity="0.95">' +
            '<title>' + escHtml(tooltipText) + '</title></rect>';
          html += '<circle cx="' + center.toFixed(1) + '" cy="' + Math.max(10, errY - 7).toFixed(1) + '" r="4" fill="' + errBarColor + '" />';
          const errLabel = '!' + errCount + ' Err';
          html += '<text x="' + center.toFixed(1) + '" y="' + Math.max(10, errY - 14).toFixed(1) + '" text-anchor="middle" fill="' + errBarColor + '" font-size="9" font-weight="600" font-family="JetBrains Mono, monospace">' + escHtml(errLabel) + '</text>';
        }

        if (currentMonitorMode === '7d' || idx % 3 === 0 || idx === series.length - 1) {
          html += '<text x="' + center.toFixed(1) + '" y="206" text-anchor="middle" fill="' + labelColor + '" font-size="' + (currentMonitorMode === '7d' ? '10' : '9.5') + '" font-family="JetBrains Mono, monospace">' + escHtml(xLabel) + '</text>';
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
    // 4. LANGUAGE, THEME & CROSS-LEAGUE SWITCHER
    // =========================================================================
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
      if (lastSyncEl) {
        if (latestPayloadCache && latestPayloadCache.last_sync) {
          lastSyncEl.textContent = latestPayloadCache.last_sync;
        } else {
          lastSyncEl.textContent = normalized === 'en' ? 'Sync Ready (Live)' : 'ข้อมูลซิงก์ล่าสุดพร้อมใช้งาน';
        }
      }

      const gwEl = document.getElementById('telemetryNextDeadlineName');
      if (gwEl) {
        const gwName = gwEl.getAttribute('data-gw-name') || 'Gameweek 11';
        gwEl.textContent = normalized === 'en' ? (gwName + ' Deadline') : ('เดดไลน์ ' + gwName);
      }

      renderLeagueTable();
      if (typeof renderLifecycleActionPanel === 'function' && selectedLifecycleLeagueId) {
        renderLifecycleActionPanel();
      }
      renderTrafficChart();
      const g2Unit = normalized === 'en' ? ' visits/wk' : ' ครั้ง/วีค';
      const g2v1 = document.getElementById('g2Val1');
      const g2v2 = document.getElementById('g2Val2');
      const g2v3 = document.getElementById('g2Val3');
      if (g2v1) g2v1.textContent = '21.8' + g2Unit;
      if (g2v2) g2v2.textContent = '124.6' + g2Unit;
      if (g2v3) g2v3.textContent = '137.4' + g2Unit;
      if (typeof renderMonitorSummary === 'function') renderMonitorSummary();
      if (typeof renderMonitorChart === 'function') renderMonitorChart();
      if (typeof renderAllOpResults === 'function') renderAllOpResults();
      if (typeof refreshOnboardingOutputs === 'function') refreshOnboardingOutputs();
      if (typeof renderOrderFilterButtons === 'function') renderOrderFilterButtons();
      if (typeof renderOrdersTable === 'function') renderOrdersTable();
      if (typeof renderOrderDetail === 'function' && selectedOrderObj) renderOrderDetail(selectedOrderObj);
      if (typeof renderPaymentSettingsUI === 'function' && paymentSettingsCache) renderPaymentSettingsUI(paymentSettingsCache);
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
      if (latestPayloadCache) applyAdminPayload(latestPayloadCache);
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
      const managers = document.getElementById('kpiManagersCount')?.textContent || '163';
      const mau = document.getElementById('kpiMatchdayActive')?.textContent || '1,420';
      const gmv = document.getElementById('kpiTotalGmv')?.textContent || '฿268,700';
      const retention = document.getElementById('kpiRetention')?.textContent || '94.2%';
      const stickiness = document.getElementById('kpiStickiness')?.textContent || '68.4%';
      const totalLeagues = (latestPayloadCache && latestPayloadCache.portfolio && latestPayloadCache.portfolio.total_leagues_count) || LEAGUE_PORTFOLIO.length;
      const customPct = (latestPayloadCache && latestPayloadCache.portfolio && latestPayloadCache.portfolio.custom_rules_pct) || 78;
      const cacheHit = document.getElementById('sysWorkerCacheHit')?.textContent || '96.4%';

      const summary = lang === 'en'
        ? [
            'FPL SaWaDiKa — Executive BI Brief',
            '• Active Portfolio: ' + totalLeagues + ' Mini-Leagues (' + managers + ' Tier-1 Managers / ' + mau + ' Matchday Active Users)',
            '• Total Prize Pool (GMV): ' + gmv + ' (' + customPct + '% Custom Rule Attachment)',
            '• Retention & Stickiness: ' + retention + ' GW-over-GW Retention | ' + stickiness + ' Matchday Stickiness',
            '• Infrastructure: Cloudflare Edge Cache ' + cacheHit + ' Hit Rate | Free-Tier Scaling Ready'
          ].join('\\n')
        : [
            'สรุปผู้บริหาร FPL SaWaDiKa (Executive BI Brief)',
            '• พอร์ตโฟลิโอปัจจุบัน: ' + totalLeagues + ' มินิลีก (' + managers + ' ผู้จัดการทีม Tier 1 / ผู้ใช้งานวันแข่ง ' + mau + ' คน)',
            '• มูลค่าเงินรางวัลรวม (GMV): ' + gmv + ' (ผูกกติกาพิเศษ ' + customPct + '% ของลีกทั้งหมด)',
            '• อัตราความเหนียวแน่น: กลับมาใช้งาน ' + retention + ' ต่อสัปดาห์ | เปิดเช็กซ้ำวันแข่ง ' + stickiness,
            '• ความพร้อมระบบ: Cloudflare Edge Cache รับโหลด ' + cacheHit + ' | พร้อมขยายสเกลต่อบน Free Tier'
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
        return {
          ok: true,
          at,
          titleTh: '✓ ล้างข้อมูลค้างเรียบร้อย (ไม่ต้องกดซ้ำ)',
          titleEn: '✓ Live Cache Cleared (No need to repeat)',
          detailTh: keys > 0
            ? ('ล้างแคชที่ค้างไปแล้ว ' + keys + ' จุด — หน้าเว็บจะดึงคะแนนล่าสุดให้ทุกคนอัตโนมัติในรอบถัดไป')
            : 'เคลียร์สถานะเรียบร้อยแล้ว — หน้าเว็บจะดึงข้อมูลสดล่าสุดให้ทุกคนทันทีที่เปิดดูใหม่',
          detailEn: keys > 0
            ? ('Cleared ' + keys + ' cached entries — visitors will receive fresh live scores on the next refresh.')
            : 'Cache is clean — visitors will receive fresh live scores immediately.',
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
          const el = document.getElementById('sysUpstreamLatency');
          if (el) el.textContent = data.upstream_latency_ms + ' ms';
          const badgeEl = document.getElementById('sysUpstreamBadge');
          if (badgeEl) badgeEl.textContent = data.success ? 'Healthy' : ('HTTP ' + (data.upstream_status || 502));
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
        total_pool_gmv: 268700,
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

    function syncDynamicTeamCountCopy(tier1LeaguesCount, allTeamsCount, tier2TeamsCount, flag675290Teams) {
      const lang = getLang();
      const t1L = Number(tier1LeaguesCount || 8);
      const allFmt = Number(allTeamsCount || 1942).toLocaleString();
      const t2Fmt = Number(tier2TeamsCount || 1779).toLocaleString();
      const commFmt = Number(flag675290Teams || 60).toLocaleString();

      I18N.th.pitch_tier2_roadmap = 'Tier 2: Live Beta (สเกล ' + t2Fmt + ' ทีม)';
      I18N.en.pitch_tier2_roadmap = 'Tier 2: Live Beta (' + t2Fmt + ' Teams)';
      I18N.th.graphic4_callout = 'Tier 1 พร้อมส่งมอบทันที · Tier 2 (Live Beta) รองรับ ' + t2Fmt + ' ทีม';
      I18N.en.graphic4_callout = 'Tier 1 ready to onboard immediately · Tier 2 (Live Beta) scales to ' + t2Fmt + ' teams';
      I18N.th.kpi_managers_sub = 'Tier 1 ครบ ' + t1L + ' มินิลีก (รวม Tier 2 = ' + allFmt + ')';
      I18N.en.kpi_managers_sub = t1L + ' Tier 1 Leagues (' + allFmt + ' Total incl. Tier 2)';
      I18N.th.feat_comm_label = 'ลีกคอมมูนิตี้และพรีเมียม (เช่น 675290 · ' + commFmt + ' ทีม / Tier 2 · ' + t2Fmt + ' ทีม)';
      I18N.en.feat_comm_label = 'Community & Flagship Scale (e.g., 675290 · ' + commFmt + ' Teams / Tier 2 · ' + t2Fmt + ' Teams)';

      const dict = I18N[lang] || I18N.th;
      ['pitch_tier2_roadmap', 'graphic4_callout', 'kpi_managers_sub', 'feat_comm_label'].forEach((key) => {
        document.querySelectorAll('[data-i18n="' + key + '"]').forEach((el) => {
          el.textContent = dict[key];
        });
      });

      const row139836 = LEAGUE_PORTFOLIO.find((r) => String(r.id) === '139836');
      if (row139836) {
        row139836.modulesTh = 'Tier 2 Standings & Leaderboard · ค้นหา ' + t2Fmt + ' ทีมทันที';
        row139836.modulesEn = 'Tier 2 Standings & Leaderboard · ' + t2Fmt + '-Team Search';
      }
    }

    function applyAdminPayload(data) {
      if (!data || typeof data !== 'object') return;
      latestPayloadCache = data;
      const lang = getLang();

      if (data.last_sync) {
        const lastSyncEl = document.getElementById('telemetryLastSync');
        if (lastSyncEl) lastSyncEl.textContent = data.last_sync;
      }

      if (data.portfolio) {
        const tier1Count = Number(data.portfolio.total_managers_tier1 || data.portfolio.total_managers || 0);
        const allCount = Number(data.portfolio.total_managers_all || tier1Count || 0);
        const tier1LeaguesCount = Number(data.portfolio.tier1_leagues_count || 8);
        const totalLeaguesCount = Number(data.portfolio.total_leagues_count || LEAGUE_PORTFOLIO.length);
        if (tier1Count > 0) {
          const el = document.getElementById('kpiManagersCount');
          if (el) el.textContent = tier1Count.toLocaleString();
          const subEl = document.getElementById('kpiManagersSub');
          if (subEl && allCount > tier1Count) {
            subEl.textContent = lang === 'en'
              ? (tier1LeaguesCount + ' Tier 1 Leagues (' + allCount.toLocaleString() + ' Total incl. Tier 2)')
              : ('Tier 1 ครบ ' + tier1LeaguesCount + ' มินิลีก (รวม Tier 2 = ' + allCount.toLocaleString() + ')');
          }
        }
        if (data.portfolio.total_pool_gmv) {
          const el = document.getElementById('kpiTotalGmv');
          if (el) el.textContent = '฿' + Number(data.portfolio.total_pool_gmv).toLocaleString();
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
          const knownIds = new Set(LEAGUE_PORTFOLIO.map((r) => r.id));
          LEAGUE_PORTFOLIO = LEAGUE_PORTFOLIO.map((row) => {
            const liveMeta = data.portfolio.leagues[row.id];
            const etLeague = (data.edge_telemetry && data.edge_telemetry.leagues)
              ? data.edge_telemetry.leagues[row.id]
              : null;
            return {
              ...row,
              name: (liveMeta && liveMeta.name) ? String(liveMeta.name) : row.name,
              teams: (liveMeta && Number(liveMeta.teams) > 0) ? Number(liveMeta.teams) : row.teams,
              pool: (liveMeta && typeof liveMeta.pool === 'number' && liveMeta.pool > 0) ? liveMeta.pool : row.pool,
              poolLabelTh: (liveMeta && liveMeta.pool_label && liveMeta.pool === 0 && liveMeta.pool_label !== '-') ? String(liveMeta.pool_label) : row.poolLabelTh,
              poolLabelEn: (liveMeta && liveMeta.pool_label_en && liveMeta.pool === 0 && liveMeta.pool_label_en !== '-') ? String(liveMeta.pool_label_en) : row.poolLabelEn,
              views: (etLeague && typeof etLeague.views === 'number') ? Number(etLeague.views) : row.views,
              plan: (liveMeta && liveMeta.plan) ? String(liveMeta.plan) : (row.plan || 'standard'),
              status: (liveMeta && liveMeta.status) ? String(liveMeta.status) : (row.status || 'active'),
              visibility: (liveMeta && liveMeta.visibility) ? String(liveMeta.visibility) : (row.visibility || 'showcase'),
              tenant_group: (liveMeta && liveMeta.tenant_group) ? String(liveMeta.tenant_group) : (row.tenant_group || 'showcase'),
              created_at: (liveMeta && liveMeta.created_at) ? String(liveMeta.created_at) : (row.created_at || null),
              expires_at: (liveMeta && liveMeta.expires_at) ? String(liveMeta.expires_at) : null,
              days_remaining: (liveMeta && typeof liveMeta.days_remaining === 'number') ? liveMeta.days_remaining : null,
              expiry_alert: (liveMeta && liveMeta.expiry_alert) ? String(liveMeta.expiry_alert) : 'none',
              billing_note: (liveMeta && liveMeta.billing_note) ? String(liveMeta.billing_note) : '',
            };
          });
          // Append any newly onboarded league present in live data or config
          for (const [lid, liveMeta] of Object.entries(data.portfolio.leagues)) {
            if (!knownIds.has(lid) && liveMeta && typeof liveMeta === 'object') {
              const etLeague = (data.edge_telemetry && data.edge_telemetry.leagues) ? data.edge_telemetry.leagues[lid] : null;
              LEAGUE_PORTFOLIO.push({
                id: lid,
                name: String(liveMeta.name || lid),
                badge: Number(liveMeta.tier) === 2 ? 'Tier 2' : (liveMeta.visibility === 'private' ? 'Private' : 'New'),
                teams: Number(liveMeta.teams || 0),
                pool: Number(liveMeta.pool || 0),
                poolLabelTh: liveMeta.pool_label && liveMeta.pool_label !== '-' ? String(liveMeta.pool_label) : 'คอมมูนิตี้',
                poolLabelEn: liveMeta.pool_label_en && liveMeta.pool_label_en !== '-' ? String(liveMeta.pool_label_en) : 'Community',
                modulesTh: Number(liveMeta.tier) === 2 ? 'Tier 2 Standings & Leaderboard' : 'ตารางคะแนนสด · วิเคราะห์ทีม',
                modulesEn: Number(liveMeta.tier) === 2 ? 'Tier 2 Standings & Leaderboard' : 'Live Standings & Analytics',
                views: etLeague && typeof etLeague.views === 'number' ? Number(etLeague.views) : 0,
                retention: 90.0,
                plan: liveMeta.plan ? String(liveMeta.plan) : 'standard',
                status: liveMeta.status ? String(liveMeta.status) : 'active',
                visibility: liveMeta.visibility ? String(liveMeta.visibility) : 'private',
                tenant_group: liveMeta.tenant_group ? String(liveMeta.tenant_group) : ('private_' + lid),
                created_at: liveMeta.created_at ? String(liveMeta.created_at) : null,
                expires_at: liveMeta.expires_at ? String(liveMeta.expires_at) : null,
                days_remaining: typeof liveMeta.days_remaining === 'number' ? liveMeta.days_remaining : null,
                expiry_alert: liveMeta.expiry_alert ? String(liveMeta.expiry_alert) : 'none',
                billing_note: liveMeta.billing_note ? String(liveMeta.billing_note) : '',
              });
            }
          }
          const liveTier2Row = LEAGUE_PORTFOLIO.find((r) => String(r.id) === '139836');
          const live675290Row = LEAGUE_PORTFOLIO.find((r) => String(r.id) === '675290');
          const liveTier2Count = (liveTier2Row && Number(liveTier2Row.teams) > 0)
            ? Number(liveTier2Row.teams)
            : Math.max(0, allCount - tier1Count) || 1779;
          const live675290Count = (live675290Row && Number(live675290Row.teams) > 0)
            ? Number(live675290Row.teams)
            : 60;
          syncDynamicTeamCountCopy(tier1LeaguesCount, allCount, liveTier2Count, live675290Count);
          renderLeagueTable();
          if (typeof renderLifecycleActionPanel === 'function' && selectedLifecycleLeagueId) {
            renderLifecycleActionPanel();
          }
        }
      }

      if (data.edge_telemetry) {
        const et = data.edge_telemetry;
        if (et.landing_page && typeof et.landing_page === 'object') {
          const lp7d = Number(et.landing_page.views_7d || 0);
          const lpToday = Number(et.landing_page.views_today || 0);
          setValueWithUnit('portLandingViews', lp7d.toLocaleString(), lang === 'en' ? 'views' : 'ครั้ง');
          const todayBadge = document.getElementById('portLandingTodayBadge');
          if (todayBadge) {
            todayBadge.textContent = (lang === 'en' ? 'Today: ' : 'วันนี้: ') + lpToday.toLocaleString();
          }
        }
        if (et.matchday_active_users) {
          const el = document.getElementById('kpiMatchdayActive');
          if (el) el.textContent = Number(et.matchday_active_users).toLocaleString();
        }
        if (et.off_peak_dau) {
          const el = document.getElementById('kpiOffPeakDau');
          if (el) el.textContent = Number(et.off_peak_dau).toLocaleString();
        }
        if (typeof et.avg_session_sec === 'number' && et.avg_session_sec > 0) {
          const el = document.getElementById('kpiScreenTime');
          if (el) {
            const mins = Math.floor(et.avg_session_sec / 60);
            const secs = et.avg_session_sec % 60;
            el.textContent = mins + 'm ' + String(secs).padStart(2, '0') + 's';
          }
        }
        const modelBadge = document.getElementById('telemetryModelBadge');
        if (modelBadge && (typeof et.raw_live_visits_7d === 'number' || typeof et.baseline_visits_prior === 'number')) {
          const live7d = Number(et.raw_live_visits_7d || 0).toLocaleString();
          const priorNum = Number(et.baseline_visits_prior || 0);
          const priorPart = priorNum > 0 ? (' + Prior: ' + priorNum.toLocaleString()) : '';
          const landingPart = (et.landing_page && typeof et.landing_page.views_7d === 'number')
            ? (' · Landing 7d: ' + Number(et.landing_page.views_7d).toLocaleString())
            : '';
          const lifetimePart = (typeof et.lifetime_total_views === 'number' && et.lifetime_total_views > 0)
            ? (' · Total: ' + Number(et.lifetime_total_views).toLocaleString())
            : '';
          modelBadge.textContent = (priorNum > 0 ? 'Live 7d: ' : 'Live D1 (7d): ') + live7d + priorPart + landingPart + lifetimePart;
        }

        // Section 03: Feature Adoption Bars
        if (et.features && et.features.modules) {
          const mods = et.features.modules;
          if (mods.standings) setMetricBar('featMod1Pct', 'featMod1Bar', mods.standings.pct);
          if (mods.prizes) setMetricBar('featMod2Pct', 'featMod2Bar', mods.prizes.pct);
          if (mods.squad) setMetricBar('featMod3Pct', 'featMod3Bar', mods.squad.pct);
          if (mods.planner) setMetricBar('featMod4Pct', 'featMod4Bar', mods.planner.pct);
          if (mods.hof) setMetricBar('featMod5Pct', 'featMod5Bar', mods.hof.pct);
        }

        // Section 04: Traffic Sources & Geographic Split
        if (et.sources) {
          if (et.sources.line) setMetricBar('chan1Pct', 'chan1Bar', et.sources.line.pct);
          if (et.sources.safari) setMetricBar('chan2Pct', 'chan2Bar', et.sources.safari.pct);
          if (et.sources.chrome) setMetricBar('chan3Pct', 'chan3Bar', et.sources.chrome.pct);
        }
        if (et.geo) {
          const bkkEl = document.getElementById('geoBkkPct');
          const regEl = document.getElementById('geoRegPct');
          const intlEl = document.getElementById('geoIntlPct');
          if (bkkEl && et.geo.bkk_metro) bkkEl.textContent = parseFloat(et.geo.bkk_metro.pct).toFixed(1) + '%';
          if (regEl && et.geo.regional) regEl.textContent = parseFloat(et.geo.regional.pct).toFixed(1) + '%';
          if (intlEl && et.geo.intl) intlEl.textContent = parseFloat(et.geo.intl.pct).toFixed(1) + '%';
        }

        // Section 05: Device Distribution (Stores both 7d and 30d windows for instant toggle)
        if (et.devices) {
          DEVICES_STATE = {
            w7: et.devices.w7 || et.devices,
            w30: et.devices.w30 || et.devices,
          };
          renderDeviceCards();
        }

        // Section 07: Cloud & Scaling Performance
        if (et.system_performance) {
          const sp = et.system_performance;
          if (typeof sp.d1_row_count === 'number') {
            setValueWithUnit('sysD1RowsCount', Number(sp.d1_row_count).toLocaleString(), 'rows');
          }
          if (typeof sp.d1_daily_writes_used === 'number' && typeof sp.d1_daily_writes_limit === 'number' && sp.d1_daily_writes_limit > 0) {
            const d1Pct = ((sp.d1_daily_writes_used / sp.d1_daily_writes_limit) * 100).toFixed(1);
            const d1PctEl = document.getElementById('sysD1ReadsPct');
            const d1BarEl = document.getElementById('sysD1ReadsBar');
            if (d1PctEl) d1PctEl.textContent = d1Pct + '% of ' + Math.round(sp.d1_daily_writes_limit / 1000) + 'k';
            if (d1BarEl) d1BarEl.style.width = Math.min(100, Math.max(2, parseFloat(d1Pct))) + '%';
          }
          if (typeof et.daily_reach === 'number') {
            const estDailyReqs = Math.max(100, Math.round(et.daily_reach * 14));
            setValueWithUnit('sysWorkerReqs', '~' + estDailyReqs.toLocaleString(), '/ 100k req/d');
            const wBar = document.getElementById('sysWorkerBar');
            if (wBar) wBar.style.width = Math.min(100, Math.max(2, (estDailyReqs / 100000) * 100)).toFixed(1) + '%';
          }
          if (sp.sync && typeof sp.sync.sync_duration_sec === 'number') {
            setValueWithUnit('sysGhSyncTime', sp.sync.sync_duration_sec.toFixed(1) + 's', '/ build');
            const ghBar = document.getElementById('sysGhSyncBar');
            if (ghBar) ghBar.style.width = Math.min(100, Math.max(4, (sp.sync.sync_duration_sec / 60) * 100)).toFixed(1) + '%';
          }
          if (sp.scaling && typeof sp.scaling.tier1_headroom_leagues === 'number') {
            const headEl = document.getElementById('sysScalingHeadroom');
            if (headEl) headEl.textContent = '+' + sp.scaling.tier1_headroom_leagues + ' Leagues';
          }
          if (typeof sp.edge_cache_hit_pct === 'number') {
            const cacheEl = document.getElementById('sysWorkerCacheHit');
            if (cacheEl) cacheEl.textContent = sp.edge_cache_hit_pct.toFixed(1) + '%';
          }
        }

        if (Array.isArray(et.hourly_series) && et.hourly_series.length === 24) {
          if (typeof et.hourly_series[0] === 'number') {
            const maxH = Math.max(...et.hourly_series, 1);
            HOURLY_SERIES = et.hourly_series.map((val, idx) => {
              const pct = Math.round((Number(val) / maxH) * 100);
              return { hour: String(idx).padStart(2, '0') + ':00', pct, peak: pct >= 48 };
            });
          } else {
            HOURLY_SERIES = et.hourly_series;
          }
        }
        if (Array.isArray(et.daily_series) && et.daily_series.length > 0) {
          const thDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
          const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
          DAILY_SERIES = et.daily_series.map((item) => {
            if (item && typeof item.date === 'string') {
              const dt = new Date(item.date + 'T12:00:00Z');
              const dow = Number.isNaN(dt.getTime()) ? 0 : dt.getUTCDay();
              return {
                dayTh: thDays[dow],
                dayEn: enDays[dow],
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

      const lid = (idEl.value || '').replace(/[^0-9]+/g, '') || '40700';
      const plan = planEl ? planEl.value : 'standard';
      const prizeModel = prizeEl ? prizeEl.value : 'weekly';
      const currency = (currencyEl && currencyEl.value === 'USD') ? 'USD' : 'THB';
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
        id: Number(lid),
        season: '2026/27',
        name: detectedName,
        short_name: shortName,
        tier: 1,
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
      const countLabel = payload.has_more_than_100 ? '100+ teams' : (payload.has_more_pages ? count + '+ teams' : count + ' teams');
      titleEl.textContent = (league.name || ('League ' + league.id)) + ' (ID: ' + (league.id || '-') + ')';
      metaEl.textContent = countLabel + ' · ' + (count > 30 ? 'Exceeds 30-team Standard cap' : 'Fits Standard Package (<=30 teams)');
      badgeEl.className = count > 30
        ? 'px-2.5 py-1 rounded-md text-xs font-semibold mono bg-amber-500/15 text-amber-800 dark:text-amber-300 border border-amber-500/30'
        : 'px-2.5 py-1 rounded-md text-xs font-semibold mono bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30';
      badgeEl.textContent = count > 30 ? 'Custom Quote (31+)' : 'Standard Ready (<=30)';

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
        'onbLeagueId', 'onbPlan', 'onbPrizeModel', 'onbWeeklyPrize', 'onbStatus',
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
      const curEl = document.getElementById('onbCurrency');
      const stEl = document.getElementById('onbStatus');
      const visEl = document.getElementById('onbVisibility');
      const tenEl = document.getElementById('onbTenantGroup');
      const shortEl = document.getElementById('onbShortName');
      if (lidEl) lidEl.value = lid;
      if (planEl) planEl.value = 'standard';
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
          กรุณายืนยันตัวตนเพื่อเข้าถึงข้อมูลวิเคราะห์ธุรกิจและสถานะระบบของทั้ง 9 มินิลีก
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
        ? 'Authenticate to access real-time portfolio economics and cloud telemetry across all 9 leagues.'
        : 'กรุณายืนยันตัวตนเพื่อเข้าถึงข้อมูลวิเคราะห์ธุรกิจและสถานะระบบของทั้ง 9 มินิลีก';
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
