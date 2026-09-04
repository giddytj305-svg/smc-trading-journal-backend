-- ==================================================
-- SMC FOREX TRADING JOURNAL — INITIAL SCHEMA
-- ==================================================
-- Run this in your Supabase SQL Editor or via CLI
-- All timestamps stored in UTC
-- Backtest and Live systems are COMPLETELY SEPARATE
-- ==================================================


-- ==================================================
-- BACKTEST TRADES
-- ==================================================

CREATE TABLE IF NOT EXISTS backtest_trades (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- ── Basic Info ──────────────────────────────────
  trade_date                  DATE NOT NULL,
  trade_timestamp             TIMESTAMPTZ,
  pair                        TEXT NOT NULL,
  direction                   TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL')),
  session                     TEXT,
  time_window                 TEXT,

  -- ── Higher Timeframe Analysis ──────────────────
  weekly_bias                 TEXT CHECK (weekly_bias       IN ('BULLISH','BEARISH','NEUTRAL')),
  daily_bias                  TEXT CHECK (daily_bias        IN ('BULLISH','BEARISH','NEUTRAL')),
  h4_bias                     TEXT CHECK (h4_bias           IN ('BULLISH','BEARISH','NEUTRAL')),
  m30_bias                    TEXT CHECK (m30_bias          IN ('BULLISH','BEARISH','NEUTRAL')),
  overall_htf_bias            TEXT CHECK (overall_htf_bias  IN ('BULLISH','BEARISH','NEUTRAL')),

  -- ── Market Structure ───────────────────────────
  structure_direction         TEXT,
  swing_high                  DECIMAL(20,5),
  swing_low                   DECIMAL(20,5),
  structure_event             TEXT CHECK (structure_event IN ('BOS','CHOCH','NONE')),
  structure_timeframe         TEXT,
  break_confirmation          TEXT,

  -- ── BOS Details ────────────────────────────────
  bos_broken_swing            DECIMAL(20,5),
  bos_direction               TEXT,
  bos_timeframe               TEXT,
  bos_confirmation_type       TEXT,

  -- ── CHoCH Details ──────────────────────────────
  choch_direction             TEXT,
  choch_broken_structure      DECIMAL(20,5),
  choch_timeframe             TEXT,
  choch_candle_close_confirmation BOOLEAN,
  choch_wick_only             BOOLEAN,

  -- ── Liquidity ──────────────────────────────────
  liquidity_type              TEXT,
  liquidity_level             DECIMAL(20,5),
  liquidity_swept             BOOLEAN,
  sweep_direction             TEXT CHECK (sweep_direction IN ('BUY_SIDE','SELL_SIDE','BOTH','NONE')),
  sweep_timeframe             TEXT,
  sweep_time                  TIMESTAMPTZ,
  pdh                         DECIMAL(20,5),
  pdl                         DECIMAL(20,5),
  asian_high                  DECIMAL(20,5),
  asian_low                   DECIMAL(20,5),
  previous_session_high       DECIMAL(20,5),
  previous_session_low        DECIMAL(20,5),
  equal_highs                 BOOLEAN,
  equal_lows                  BOOLEAN,
  internal_liquidity          TEXT,
  external_liquidity          TEXT,

  -- ── Accumulation / Consolidation ───────────────
  accumulation_present        BOOLEAN,
  accumulation_timeframe      TEXT,
  accumulation_start          TIMESTAMPTZ,
  accumulation_end            TIMESTAMPTZ,
  accumulation_high           DECIMAL(20,5),
  accumulation_low            DECIMAL(20,5),
  displacement_after_accumulation BOOLEAN,

  -- ── Point of Interest ──────────────────────────
  poi_type                    TEXT,
  poi_timeframe               TEXT,
  poi_valid                   BOOLEAN,
  poi_mitigated               BOOLEAN,
  poi_price_high              DECIMAL(20,5),
  poi_price_low               DECIMAL(20,5),

  -- ── FVG ────────────────────────────────────────
  fvg_present                 BOOLEAN,
  fvg_direction               TEXT,
  fvg_timeframe               TEXT,
  fvg_price_high              DECIMAL(20,5),
  fvg_price_low               DECIMAL(20,5),
  fvg_mitigated               BOOLEAN,

  -- ── IFVG ───────────────────────────────────────
  ifvg_present                BOOLEAN,
  ifvg_direction              TEXT,
  ifvg_timeframe              TEXT,
  ifvg_price_high             DECIMAL(20,5),
  ifvg_price_low              DECIMAL(20,5),
  ifvg_mitigated              BOOLEAN,

  -- ── Order Block ────────────────────────────────
  ob_present                  BOOLEAN,
  ob_direction                TEXT,
  ob_timeframe                TEXT,
  ob_price_high               DECIMAL(20,5),
  ob_price_low                DECIMAL(20,5),
  ob_mitigated                BOOLEAN,
  ob_used_for_entry           BOOLEAN,

  -- ── Mitigation Block ──────────────────────────
  mb_present                  BOOLEAN,
  mb_direction                TEXT,
  mb_timeframe                TEXT,
  mb_price_high               DECIMAL(20,5),
  mb_price_low                DECIMAL(20,5),
  mb_mitigated                BOOLEAN,
  mb_used_for_entry           BOOLEAN,

  -- ── Entry Confirmation ─────────────────────────
  entry_timeframe             TEXT,
  entry_confirmation          TEXT,
  confirmation_direction      TEXT,
  confirmation_valid          BOOLEAN,

  -- ── Trade Entry ────────────────────────────────
  entry_price                 DECIMAL(20,5),
  planned_entry               DECIMAL(20,5),
  actual_entry                DECIMAL(20,5),
  entry_time                  TIMESTAMPTZ,
  entry_quality               INTEGER CHECK (entry_quality BETWEEN 1 AND 5),

  -- ── Stop Loss ──────────────────────────────────
  planned_stop_loss           DECIMAL(20,5),
  actual_stop_loss            DECIMAL(20,5),
  invalidation_level          DECIMAL(20,5),
  stop_loss_distance          DECIMAL(20,5),
  stop_loss_reason            TEXT,

  -- ── Take Profit ────────────────────────────────
  planned_take_profit         DECIMAL(20,5),
  actual_take_profit          DECIMAL(20,5),
  tp_reason                   TEXT,
  target_type                 TEXT,

  -- ── Risk Management ────────────────────────────
  account_size_snapshot       DECIMAL(15,2),
  risk_percentage             DECIMAL(5,2) CHECK (risk_percentage >= 0),
  risk_amount                 DECIMAL(15,2) CHECK (risk_amount >= 0),
  lot_size                    DECIMAL(10,4),
  planned_reward              DECIMAL(15,2),
  planned_rr                  DECIMAL(10,2),
  actual_rr                   DECIMAL(10,2),
  pnl                         DECIMAL(15,2),

  -- ── Result ────────────────────────────────────
  result                      TEXT CHECK (result IN ('WIN','LOSS','BREAK_EVEN')),
  exit_price                  DECIMAL(20,5),
  exit_time                   TIMESTAMPTZ,
  actual_r                    DECIMAL(10,2),
  exit_reason                 TEXT,

  -- ── Early Exit ────────────────────────────────
  early_exit                  BOOLEAN DEFAULT FALSE,
  early_exit_reason           TEXT,
  planned_exit_price          DECIMAL(20,5),
  actual_exit_price           DECIMAL(20,5),
  missed_potential_r          DECIMAL(10,2),

  -- ── Mistakes (array — supports multiple) ──────
  mistakes                    TEXT[] DEFAULT '{}',

  -- ── Psychology ────────────────────────────────
  psychology_before           TEXT,
  psychology_during           TEXT,
  psychology_after            TEXT,
  confidence_score            INTEGER CHECK (confidence_score BETWEEN 1 AND 5),
  discipline_score            INTEGER CHECK (discipline_score BETWEEN 1 AND 5),

  -- ── Plan Adherence ────────────────────────────
  plan_followed               TEXT CHECK (plan_followed IN ('YES','NO','PARTIALLY')),
  plan_adherence_score        INTEGER CHECK (plan_adherence_score BETWEEN 1 AND 5),

  -- ── Review ────────────────────────────────────
  general_review              TEXT,
  why_i_entered               TEXT,
  what_happened               TEXT,
  what_i_did_well             TEXT,
  mistake_description         TEXT,
  why_i_exited                TEXT,
  what_i_should_have_done     TEXT,
  lesson                      TEXT,
  improvement_for_next_trade  TEXT,

  -- ── Market Condition ──────────────────────────
  market_condition            TEXT,

  -- ── Indicator Metadata (optional, future use) ─
  indicator_version           TEXT,
  detected_htf_bias           TEXT,
  detected_structure          TEXT,
  detected_liquidity          TEXT,
  detected_poi                TEXT,
  detected_confirmation       TEXT,

  -- ── Timestamps ────────────────────────────────
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);


-- ==================================================
-- BACKTEST TRADE IMAGES
-- ==================================================

CREATE TABLE IF NOT EXISTS backtest_trade_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id      UUID NOT NULL REFERENCES backtest_trades(id) ON DELETE CASCADE,
  public_id     TEXT NOT NULL,
  secure_url    TEXT NOT NULL,
  image_type    TEXT NOT NULL CHECK (image_type IN ('BEFORE_SETUP','ENTRY','AFTER_TRADE')),
  uploaded_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ==================================================
-- BACKTEST DAILY BALANCES
-- ==================================================

CREATE TABLE IF NOT EXISTS backtest_daily_balances (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance_date              DATE NOT NULL,
  starting_balance          DECIMAL(15,2) NOT NULL,
  ending_balance            DECIMAL(15,2),
  daily_pnl                 DECIMAL(15,2) DEFAULT 0,
  daily_r                   DECIMAL(10,2) DEFAULT 0,
  number_of_trades          INTEGER DEFAULT 0,
  wins                      INTEGER DEFAULT 0,
  losses                    INTEGER DEFAULT 0,
  break_even                INTEGER DEFAULT 0,
  daily_win_rate            DECIMAL(5,2),
  daily_return_percentage   DECIMAL(10,4),
  daily_review_id           UUID,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, balance_date)
);


-- ==================================================
-- BACKTEST DAILY REVIEWS
-- ==================================================

CREATE TABLE IF NOT EXISTS backtest_daily_reviews (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  review_date             DATE NOT NULL,
  starting_balance        DECIMAL(15,2),
  trades_count            INTEGER DEFAULT 0,
  wins                    INTEGER DEFAULT 0,
  losses                  INTEGER DEFAULT 0,
  break_even              INTEGER DEFAULT 0,
  daily_pnl               DECIMAL(15,2),
  daily_r                 DECIMAL(10,2),
  setups_observed         TEXT,
  market_conditions       TEXT,
  what_i_learned          TEXT,
  mistakes                TEXT,
  general_review          TEXT,
  strategy_observations   TEXT,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, review_date)
);


-- ==================================================
-- LIVE TRADES
-- ==================================================

CREATE TABLE IF NOT EXISTS live_trades (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- ── Basic Info ──────────────────────────────────
  trade_date                  DATE NOT NULL,
  trade_timestamp             TIMESTAMPTZ,
  pair                        TEXT NOT NULL,
  direction                   TEXT NOT NULL CHECK (direction IN ('BUY', 'SELL')),
  session                     TEXT,
  time_window                 TEXT,

  -- ── Higher Timeframe Analysis ──────────────────
  weekly_bias                 TEXT CHECK (weekly_bias       IN ('BULLISH','BEARISH','NEUTRAL')),
  daily_bias                  TEXT CHECK (daily_bias        IN ('BULLISH','BEARISH','NEUTRAL')),
  h4_bias                     TEXT CHECK (h4_bias           IN ('BULLISH','BEARISH','NEUTRAL')),
  m30_bias                    TEXT CHECK (m30_bias          IN ('BULLISH','BEARISH','NEUTRAL')),
  overall_htf_bias            TEXT CHECK (overall_htf_bias  IN ('BULLISH','BEARISH','NEUTRAL')),

  -- ── Market Structure ───────────────────────────
  structure_direction         TEXT,
  swing_high                  DECIMAL(20,5),
  swing_low                   DECIMAL(20,5),
  structure_event             TEXT CHECK (structure_event IN ('BOS','CHOCH','NONE')),
  structure_timeframe         TEXT,
  break_confirmation          TEXT,

  -- ── BOS Details ────────────────────────────────
  bos_broken_swing            DECIMAL(20,5),
  bos_direction               TEXT,
  bos_timeframe               TEXT,
  bos_confirmation_type       TEXT,

  -- ── CHoCH Details ──────────────────────────────
  choch_direction             TEXT,
  choch_broken_structure      DECIMAL(20,5),
  choch_timeframe             TEXT,
  choch_candle_close_confirmation BOOLEAN,
  choch_wick_only             BOOLEAN,

  -- ── Liquidity ──────────────────────────────────
  liquidity_type              TEXT,
  liquidity_level             DECIMAL(20,5),
  liquidity_swept             BOOLEAN,
  sweep_direction             TEXT CHECK (sweep_direction IN ('BUY_SIDE','SELL_SIDE','BOTH','NONE')),
  sweep_timeframe             TEXT,
  sweep_time                  TIMESTAMPTZ,
  pdh                         DECIMAL(20,5),
  pdl                         DECIMAL(20,5),
  asian_high                  DECIMAL(20,5),
  asian_low                   DECIMAL(20,5),
  previous_session_high       DECIMAL(20,5),
  previous_session_low        DECIMAL(20,5),
  equal_highs                 BOOLEAN,
  equal_lows                  BOOLEAN,
  internal_liquidity          TEXT,
  external_liquidity          TEXT,

  -- ── Accumulation / Consolidation ───────────────
  accumulation_present        BOOLEAN,
  accumulation_timeframe      TEXT,
  accumulation_start          TIMESTAMPTZ,
  accumulation_end            TIMESTAMPTZ,
  accumulation_high           DECIMAL(20,5),
  accumulation_low            DECIMAL(20,5),
  displacement_after_accumulation BOOLEAN,

  -- ── Point of Interest ──────────────────────────
  poi_type                    TEXT,
  poi_timeframe               TEXT,
  poi_valid                   BOOLEAN,
  poi_mitigated               BOOLEAN,
  poi_price_high              DECIMAL(20,5),
  poi_price_low               DECIMAL(20,5),

  -- ── FVG ────────────────────────────────────────
  fvg_present                 BOOLEAN,
  fvg_direction               TEXT,
  fvg_timeframe               TEXT,
  fvg_price_high              DECIMAL(20,5),
  fvg_price_low               DECIMAL(20,5),
  fvg_mitigated               BOOLEAN,

  -- ── IFVG ───────────────────────────────────────
  ifvg_present                BOOLEAN,
  ifvg_direction              TEXT,
  ifvg_timeframe              TEXT,
  ifvg_price_high             DECIMAL(20,5),
  ifvg_price_low              DECIMAL(20,5),
  ifvg_mitigated              BOOLEAN,

  -- ── Order Block ────────────────────────────────
  ob_present                  BOOLEAN,
  ob_direction                TEXT,
  ob_timeframe                TEXT,
  ob_price_high               DECIMAL(20,5),
  ob_price_low                DECIMAL(20,5),
  ob_mitigated                BOOLEAN,
  ob_used_for_entry           BOOLEAN,

  -- ── Mitigation Block ──────────────────────────
  mb_present                  BOOLEAN,
  mb_direction                TEXT,
  mb_timeframe                TEXT,
  mb_price_high               DECIMAL(20,5),
  mb_price_low                DECIMAL(20,5),
  mb_mitigated                BOOLEAN,
  mb_used_for_entry           BOOLEAN,

  -- ── Entry Confirmation ─────────────────────────
  entry_timeframe             TEXT,
  entry_confirmation          TEXT,
  confirmation_direction      TEXT,
  confirmation_valid          BOOLEAN,

  -- ── Trade Entry ────────────────────────────────
  entry_price                 DECIMAL(20,5),
  planned_entry               DECIMAL(20,5),
  actual_entry                DECIMAL(20,5),
  entry_time                  TIMESTAMPTZ,
  entry_quality               INTEGER CHECK (entry_quality BETWEEN 1 AND 5),

  -- ── Stop Loss ──────────────────────────────────
  planned_stop_loss           DECIMAL(20,5),
  actual_stop_loss            DECIMAL(20,5),
  invalidation_level          DECIMAL(20,5),
  stop_loss_distance          DECIMAL(20,5),
  stop_loss_reason            TEXT,

  -- ── Take Profit ────────────────────────────────
  planned_take_profit         DECIMAL(20,5),
  actual_take_profit          DECIMAL(20,5),
  tp_reason                   TEXT,
  target_type                 TEXT,

  -- ── Risk Management ────────────────────────────
  account_size_snapshot       DECIMAL(15,2),
  risk_percentage             DECIMAL(5,2) CHECK (risk_percentage >= 0),
  risk_amount                 DECIMAL(15,2) CHECK (risk_amount >= 0),
  lot_size                    DECIMAL(10,4),
  planned_reward              DECIMAL(15,2),
  planned_rr                  DECIMAL(10,2),
  actual_rr                   DECIMAL(10,2),
  pnl                         DECIMAL(15,2),

  -- ── Result ────────────────────────────────────
  result                      TEXT CHECK (result IN ('WIN','LOSS','BREAK_EVEN')),
  exit_price                  DECIMAL(20,5),
  exit_time                   TIMESTAMPTZ,
  actual_r                    DECIMAL(10,2),
  exit_reason                 TEXT,

  -- ── Early Exit ────────────────────────────────
  early_exit                  BOOLEAN DEFAULT FALSE,
  early_exit_reason           TEXT,
  planned_exit_price          DECIMAL(20,5),
  actual_exit_price           DECIMAL(20,5),
  missed_potential_r          DECIMAL(10,2),

  -- ── Mistakes (array — supports multiple) ──────
  mistakes                    TEXT[] DEFAULT '{}',

  -- ── Psychology ────────────────────────────────
  psychology_before           TEXT,
  psychology_during           TEXT,
  psychology_after            TEXT,
  confidence_score            INTEGER CHECK (confidence_score BETWEEN 1 AND 5),
  discipline_score            INTEGER CHECK (discipline_score BETWEEN 1 AND 5),

  -- ── Plan Adherence ────────────────────────────
  plan_followed               TEXT CHECK (plan_followed IN ('YES','NO','PARTIALLY')),
  plan_adherence_score        INTEGER CHECK (plan_adherence_score BETWEEN 1 AND 5),

  -- ── Review ────────────────────────────────────
  general_review              TEXT,
  why_i_entered               TEXT,
  what_happened               TEXT,
  what_i_did_well             TEXT,
  mistake_description         TEXT,
  why_i_exited                TEXT,
  what_i_should_have_done     TEXT,
  lesson                      TEXT,
  improvement_for_next_trade  TEXT,

  -- ── Market Condition ──────────────────────────
  market_condition            TEXT,

  -- ── Indicator Metadata (optional, future use) ─
  indicator_version           TEXT,
  detected_htf_bias           TEXT,
  detected_structure          TEXT,
  detected_liquidity          TEXT,
  detected_poi                TEXT,
  detected_confirmation       TEXT,

  -- ── Timestamps ────────────────────────────────
  created_at                  TIMESTAMPTZ DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ DEFAULT NOW()
);


-- ==================================================
-- LIVE TRADE IMAGES
-- ==================================================

CREATE TABLE IF NOT EXISTS live_trade_images (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trade_id      UUID NOT NULL REFERENCES live_trades(id) ON DELETE CASCADE,
  public_id     TEXT NOT NULL,
  secure_url    TEXT NOT NULL,
  image_type    TEXT NOT NULL CHECK (image_type IN ('PRE_TRADE','ENTRY','MANAGEMENT','EXIT','POST_TRADE')),
  uploaded_at   TIMESTAMPTZ DEFAULT NOW()
);


-- ==================================================
-- LIVE DAILY BALANCES
-- ==================================================

CREATE TABLE IF NOT EXISTS live_daily_balances (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                   UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  balance_date              DATE NOT NULL,
  starting_balance          DECIMAL(15,2) NOT NULL,
  ending_balance            DECIMAL(15,2),
  daily_pnl                 DECIMAL(15,2) DEFAULT 0,
  daily_r                   DECIMAL(10,2) DEFAULT 0,
  number_of_trades          INTEGER DEFAULT 0,
  wins                      INTEGER DEFAULT 0,
  losses                    INTEGER DEFAULT 0,
  break_even                INTEGER DEFAULT 0,
  daily_win_rate            DECIMAL(5,2),
  daily_return_percentage   DECIMAL(10,4),
  daily_review_id           UUID,
  created_at                TIMESTAMPTZ DEFAULT NOW(),
  updated_at                TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, balance_date)
);


-- ==================================================
-- LIVE DAILY REVIEWS
-- ==================================================

CREATE TABLE IF NOT EXISTS live_daily_reviews (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  review_date             DATE NOT NULL,
  starting_balance        DECIMAL(15,2),
  trades_count            INTEGER DEFAULT 0,
  wins                    INTEGER DEFAULT 0,
  losses                  INTEGER DEFAULT 0,
  break_even              INTEGER DEFAULT 0,
  daily_pnl               DECIMAL(15,2),
  daily_r                 DECIMAL(10,2),
  daily_return_percentage DECIMAL(10,4),
  daily_bias              TEXT,
  market_condition        TEXT,
  emotional_state         TEXT,
  discipline_score        INTEGER CHECK (discipline_score BETWEEN 1 AND 5),
  plan_adherence          TEXT CHECK (plan_adherence IN ('YES','NO','PARTIALLY')),
  what_i_did_well         TEXT,
  mistakes                TEXT,
  general_review          TEXT,
  lesson                  TEXT,
  tomorrows_focus         TEXT,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, review_date)
);


-- ==================================================
-- MISSED SETUPS
-- ==================================================

CREATE TABLE IF NOT EXISTS missed_setups (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode                    TEXT NOT NULL CHECK (mode IN ('BACKTEST','LIVE')),
  setup_date              DATE NOT NULL,
  pair                    TEXT NOT NULL,
  direction               TEXT CHECK (direction IN ('BUY','SELL')),
  session                 TEXT,
  time_window             TEXT,

  -- HTF context
  weekly_bias             TEXT CHECK (weekly_bias      IN ('BULLISH','BEARISH','NEUTRAL')),
  daily_bias              TEXT CHECK (daily_bias       IN ('BULLISH','BEARISH','NEUTRAL')),
  h4_bias                 TEXT CHECK (h4_bias          IN ('BULLISH','BEARISH','NEUTRAL')),
  overall_htf_bias        TEXT CHECK (overall_htf_bias IN ('BULLISH','BEARISH','NEUTRAL')),

  -- Setup details
  liquidity_type          TEXT,
  liquidity_swept         BOOLEAN,
  structure_event         TEXT CHECK (structure_event IN ('BOS','CHOCH','NONE')),
  poi_type                TEXT,

  -- Expected trade
  expected_entry          DECIMAL(20,5),
  expected_stop_loss      DECIMAL(20,5),
  expected_take_profit    DECIMAL(20,5),
  expected_rr             DECIMAL(10,2),
  hypothetical_result     TEXT CHECK (hypothetical_result IN ('WIN','LOSS','BREAK_EVEN')),
  hypothetical_r          DECIMAL(10,2),

  -- Why missed
  reason_missed           TEXT,
  lesson                  TEXT,

  -- Screenshot
  screenshot_url          TEXT,
  screenshot_public_id    TEXT,

  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);


-- ==================================================
-- INDEXES — Backtest Trades
-- ==================================================

CREATE INDEX idx_bt_user           ON backtest_trades(user_id);
CREATE INDEX idx_bt_date           ON backtest_trades(trade_date);
CREATE INDEX idx_bt_pair           ON backtest_trades(pair);
CREATE INDEX idx_bt_session        ON backtest_trades(session);
CREATE INDEX idx_bt_time_window    ON backtest_trades(time_window);
CREATE INDEX idx_bt_result         ON backtest_trades(result);
CREATE INDEX idx_bt_direction      ON backtest_trades(direction);
CREATE INDEX idx_bt_created        ON backtest_trades(created_at);

-- Composite indexes for analytics
CREATE INDEX idx_bt_pair_result    ON backtest_trades(pair, result);
CREATE INDEX idx_bt_session_result ON backtest_trades(session, result);
CREATE INDEX idx_bt_date_result    ON backtest_trades(trade_date, result);
CREATE INDEX idx_bt_date_pair      ON backtest_trades(trade_date, pair);
CREATE INDEX idx_bt_user_date      ON backtest_trades(user_id, trade_date);


-- ==================================================
-- INDEXES — Live Trades
-- ==================================================

CREATE INDEX idx_lt_user           ON live_trades(user_id);
CREATE INDEX idx_lt_date           ON live_trades(trade_date);
CREATE INDEX idx_lt_pair           ON live_trades(pair);
CREATE INDEX idx_lt_session        ON live_trades(session);
CREATE INDEX idx_lt_time_window    ON live_trades(time_window);
CREATE INDEX idx_lt_result         ON live_trades(result);
CREATE INDEX idx_lt_direction      ON live_trades(direction);
CREATE INDEX idx_lt_created        ON live_trades(created_at);

-- Composite indexes for analytics
CREATE INDEX idx_lt_pair_result    ON live_trades(pair, result);
CREATE INDEX idx_lt_session_result ON live_trades(session, result);
CREATE INDEX idx_lt_date_result    ON live_trades(trade_date, result);
CREATE INDEX idx_lt_date_pair      ON live_trades(trade_date, pair);
CREATE INDEX idx_lt_user_date      ON live_trades(user_id, trade_date);


-- ==================================================
-- INDEXES — Images
-- ==================================================

CREATE INDEX idx_bt_img_trade      ON backtest_trade_images(trade_id);
CREATE INDEX idx_lt_img_trade      ON live_trade_images(trade_id);


-- ==================================================
-- INDEXES — Balances & Reviews
-- ==================================================

CREATE INDEX idx_bt_bal_date       ON backtest_daily_balances(user_id, balance_date);
CREATE INDEX idx_lt_bal_date       ON live_daily_balances(user_id, balance_date);
CREATE INDEX idx_bt_rev_date       ON backtest_daily_reviews(user_id, review_date);
CREATE INDEX idx_lt_rev_date       ON live_daily_reviews(user_id, review_date);


-- ==================================================
-- INDEXES — Missed Setups
-- ==================================================

CREATE INDEX idx_ms_user           ON missed_setups(user_id);
CREATE INDEX idx_ms_mode           ON missed_setups(mode);
CREATE INDEX idx_ms_date           ON missed_setups(setup_date);
CREATE INDEX idx_ms_pair           ON missed_setups(pair);


-- ==================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ==================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- Apply trigger to all tables with updated_at
CREATE TRIGGER trg_bt_trades_updated
  BEFORE UPDATE ON backtest_trades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_lt_trades_updated
  BEFORE UPDATE ON live_trades
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_bt_balances_updated
  BEFORE UPDATE ON backtest_daily_balances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_lt_balances_updated
  BEFORE UPDATE ON live_daily_balances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_bt_reviews_updated
  BEFORE UPDATE ON backtest_daily_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_lt_reviews_updated
  BEFORE UPDATE ON live_daily_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_missed_setups_updated
  BEFORE UPDATE ON missed_setups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- ==================================================
-- ROW LEVEL SECURITY (personal app — simple policy)
-- ==================================================

ALTER TABLE backtest_trades         ENABLE ROW LEVEL SECURITY;
ALTER TABLE backtest_trade_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE backtest_daily_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE backtest_daily_reviews  ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_trades             ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_trade_images       ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_daily_balances     ENABLE ROW LEVEL SECURITY;
ALTER TABLE live_daily_reviews      ENABLE ROW LEVEL SECURITY;
ALTER TABLE missed_setups           ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users access own backtest trades"
  ON backtest_trades FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users access own backtest images"
  ON backtest_trade_images FOR ALL
  USING (trade_id IN (SELECT id FROM backtest_trades WHERE user_id = auth.uid()));

CREATE POLICY "Users access own backtest balances"
  ON backtest_daily_balances FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users access own backtest reviews"
  ON backtest_daily_reviews FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users access own live trades"
  ON live_trades FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users access own live images"
  ON live_trade_images FOR ALL
  USING (trade_id IN (SELECT id FROM live_trades WHERE user_id = auth.uid()));

CREATE POLICY "Users access own live balances"
  ON live_daily_balances FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users access own live reviews"
  ON live_daily_reviews FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users access own missed setups"
  ON missed_setups FOR ALL
  USING (auth.uid() = user_id);
