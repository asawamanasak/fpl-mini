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
