-- FPLSaWaDiKa Cloudflare D1 Schema (Local & Staging Initialization)
-- Matches all queries in workers/fpl-live-worker.js

CREATE TABLE IF NOT EXISTS telemetry_counters (
  metric TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  val INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_telemetry_counters_date
  ON telemetry_counters (date);

-- Permanent lifetime site view baseline (date = '9999-12-31' excluded from 30-day pruning)
INSERT OR IGNORE INTO telemetry_counters (metric, date, val)
VALUES ('lifetime:total_views', '9999-12-31', 2790);

-- Private admin customer notes per league (stored exclusively in Cloudflare D1, never committed to Git)
CREATE TABLE IF NOT EXISTS league_admin_notes (
  league_id TEXT PRIMARY KEY,
  note TEXT NOT NULL DEFAULT '',
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Customer orders, PromptPay satang allocation, compressed slip image & delivery status
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
);

CREATE INDEX IF NOT EXISTS idx_league_orders_status_exp
  ON league_orders (status, expires_at);

CREATE INDEX IF NOT EXISTS idx_league_orders_created
  ON league_orders (created_at);

CREATE UNIQUE INDEX IF NOT EXISTS idx_league_orders_active_satang
  ON league_orders (amount_satang)
  WHERE currency = 'THB' AND amount_satang >= 50001 AND status IN ('awaiting_payment', 'slip_submitted', 'rejected');
