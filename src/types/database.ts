// ==================================================
// SMC Trading Journal — Database Row Types
// ==================================================
// These interfaces mirror the database tables exactly.
// ==================================================

// ── Base Trade Fields (shared by backtest & live) ──
export interface TradeRow {
  id: string;
  user_id: string;

  // Basic Info
  trade_date: string;           // DATE as ISO string
  trade_timestamp: string | null;
  pair: string;
  direction: string;            // 'BUY' | 'SELL'
  session: string | null;
  time_window: string | null;

  // HTF Analysis
  weekly_bias: string | null;
  daily_bias: string | null;
  h4_bias: string | null;
  m30_bias: string | null;
  overall_htf_bias: string | null;

  // Market Structure
  structure_direction: string | null;
  swing_high: number | null;
  swing_low: number | null;
  structure_event: string | null;
  structure_timeframe: string | null;
  break_confirmation: string | null;

  // BOS
  bos_broken_swing: number | null;
  bos_direction: string | null;
  bos_timeframe: string | null;
  bos_confirmation_type: string | null;

  // CHoCH
  choch_direction: string | null;
  choch_broken_structure: number | null;
  choch_timeframe: string | null;
  choch_candle_close_confirmation: boolean | null;
  choch_wick_only: boolean | null;

  // Liquidity
  liquidity_type: string | null;
  liquidity_level: number | null;
  liquidity_swept: boolean | null;
  sweep_direction: string | null;
  sweep_timeframe: string | null;
  sweep_time: string | null;
  pdh: number | null;
  pdl: number | null;
  asian_high: number | null;
  asian_low: number | null;
  previous_session_high: number | null;
  previous_session_low: number | null;
  equal_highs: boolean | null;
  equal_lows: boolean | null;
  internal_liquidity: string | null;
  external_liquidity: string | null;

  // Accumulation
  accumulation_present: boolean | null;
  accumulation_timeframe: string | null;
  accumulation_start: string | null;
  accumulation_end: string | null;
  accumulation_high: number | null;
  accumulation_low: number | null;
  displacement_after_accumulation: boolean | null;

  // POI
  poi_type: string | null;
  poi_timeframe: string | null;
  poi_valid: boolean | null;
  poi_mitigated: boolean | null;
  poi_price_high: number | null;
  poi_price_low: number | null;

  // FVG
  fvg_present: boolean | null;
  fvg_direction: string | null;
  fvg_timeframe: string | null;
  fvg_price_high: number | null;
  fvg_price_low: number | null;
  fvg_mitigated: boolean | null;

  // IFVG
  ifvg_present: boolean | null;
  ifvg_direction: string | null;
  ifvg_timeframe: string | null;
  ifvg_price_high: number | null;
  ifvg_price_low: number | null;
  ifvg_mitigated: boolean | null;

  // Order Block
  ob_present: boolean | null;
  ob_direction: string | null;
  ob_timeframe: string | null;
  ob_price_high: number | null;
  ob_price_low: number | null;
  ob_mitigated: boolean | null;
  ob_used_for_entry: boolean | null;

  // Mitigation Block
  mb_present: boolean | null;
  mb_direction: string | null;
  mb_timeframe: string | null;
  mb_price_high: number | null;
  mb_price_low: number | null;
  mb_mitigated: boolean | null;
  mb_used_for_entry: boolean | null;

  // Entry Confirmation
  entry_timeframe: string | null;
  entry_confirmation: string | null;
  confirmation_direction: string | null;
  confirmation_valid: boolean | null;

  // Trade Entry
  entry_price: number | null;
  planned_entry: number | null;
  actual_entry: number | null;
  entry_time: string | null;
  entry_quality: number | null;

  // Stop Loss
  planned_stop_loss: number | null;
  actual_stop_loss: number | null;
  invalidation_level: number | null;
  stop_loss_distance: number | null;
  stop_loss_reason: string | null;

  // Take Profit
  planned_take_profit: number | null;
  actual_take_profit: number | null;
  tp_reason: string | null;
  target_type: string | null;

  // Risk Management
  account_size_snapshot: number | null;
  risk_percentage: number | null;
  risk_amount: number | null;
  lot_size: number | null;
  planned_reward: number | null;
  planned_rr: number | null;
  actual_rr: number | null;
  pnl: number | null;

  // Result
  result: string | null;
  exit_price: number | null;
  exit_time: string | null;
  actual_r: number | null;
  exit_reason: string | null;

  // Early Exit
  early_exit: boolean;
  early_exit_reason: string | null;
  planned_exit_price: number | null;
  actual_exit_price: number | null;
  missed_potential_r: number | null;

  // Mistakes
  mistakes: string[];

  // Psychology
  psychology_before: string | null;
  psychology_during: string | null;
  psychology_after: string | null;
  confidence_score: number | null;
  discipline_score: number | null;

  // Plan Adherence
  plan_followed: string | null;
  plan_adherence_score: number | null;

  // Review
  general_review: string | null;
  why_i_entered: string | null;
  what_happened: string | null;
  what_i_did_well: string | null;
  mistake_description: string | null;
  why_i_exited: string | null;
  what_i_should_have_done: string | null;
  lesson: string | null;
  improvement_for_next_trade: string | null;

  // Market Condition
  market_condition: string | null;

  // Indicator Metadata
  indicator_version: string | null;
  detected_htf_bias: string | null;
  detected_structure: string | null;
  detected_liquidity: string | null;
  detected_poi: string | null;
  detected_confirmation: string | null;

  // Timestamps
  created_at: string;
  updated_at: string;
}

// Backtest and Live share the same shape
export type BacktestTradeRow = TradeRow;
export type LiveTradeRow = TradeRow;


// ── Trade Image ────────────────────────────────────
export interface TradeImageRow {
  id: string;
  trade_id: string;
  public_id: string;
  secure_url: string;
  image_type: string;
  uploaded_at: string;
}

export type BacktestTradeImageRow = TradeImageRow;
export type LiveTradeImageRow = TradeImageRow;


// ── Daily Balance ──────────────────────────────────
export interface DailyBalanceRow {
  id: string;
  user_id: string;
  balance_date: string;
  starting_balance: number;
  ending_balance: number | null;
  daily_pnl: number;
  daily_r: number;
  number_of_trades: number;
  wins: number;
  losses: number;
  break_even: number;
  daily_win_rate: number | null;
  daily_return_percentage: number | null;
  daily_review_id: string | null;
  created_at: string;
  updated_at: string;
}

export type BacktestDailyBalanceRow = DailyBalanceRow;
export type LiveDailyBalanceRow = DailyBalanceRow;


// ── Backtest Daily Review ──────────────────────────
export interface BacktestDailyReviewRow {
  id: string;
  user_id: string;
  review_date: string;
  starting_balance: number | null;
  trades_count: number;
  wins: number;
  losses: number;
  break_even: number;
  daily_pnl: number | null;
  daily_r: number | null;
  setups_observed: string | null;
  market_conditions: string | null;
  what_i_learned: string | null;
  mistakes: string | null;
  general_review: string | null;
  strategy_observations: string | null;
  created_at: string;
  updated_at: string;
}


// ── Live Daily Review ──────────────────────────────
export interface LiveDailyReviewRow {
  id: string;
  user_id: string;
  review_date: string;
  starting_balance: number | null;
  trades_count: number;
  wins: number;
  losses: number;
  break_even: number;
  daily_pnl: number | null;
  daily_r: number | null;
  daily_return_percentage: number | null;
  daily_bias: string | null;
  market_condition: string | null;
  emotional_state: string | null;
  discipline_score: number | null;
  plan_adherence: string | null;
  what_i_did_well: string | null;
  mistakes: string | null;
  general_review: string | null;
  lesson: string | null;
  tomorrows_focus: string | null;
  created_at: string;
  updated_at: string;
}


// ── Missed Setup ───────────────────────────────────
export interface MissedSetupRow {
  id: string;
  user_id: string;
  mode: string;
  setup_date: string;
  pair: string;
  direction: string | null;
  session: string | null;
  time_window: string | null;
  weekly_bias: string | null;
  daily_bias: string | null;
  h4_bias: string | null;
  overall_htf_bias: string | null;
  liquidity_type: string | null;
  liquidity_swept: boolean | null;
  structure_event: string | null;
  poi_type: string | null;
  expected_entry: number | null;
  expected_stop_loss: number | null;
  expected_take_profit: number | null;
  expected_rr: number | null;
  hypothetical_result: string | null;
  hypothetical_r: number | null;
  reason_missed: string | null;
  lesson: string | null;
  screenshot_url: string | null;
  screenshot_public_id: string | null;
  created_at: string;
  updated_at: string;
}
