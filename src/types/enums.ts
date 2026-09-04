// ==================================================
// SMC Trading Journal — All Enums & Constants
// ==================================================

// ── Trade Direction ────────────────────────────────
export enum Direction {
  BUY = 'BUY',
  SELL = 'SELL',
}

// ── Trade Result ───────────────────────────────────
export enum TradeResult {
  WIN = 'WIN',
  LOSS = 'LOSS',
  BREAK_EVEN = 'BREAK_EVEN',
}

// ── Trading Mode ───────────────────────────────────
export enum TradingMode {
  BACKTEST = 'BACKTEST',
  LIVE = 'LIVE',
}

// ── HTF Bias Direction ─────────────────────────────
export enum BiasDirection {
  BULLISH = 'BULLISH',
  BEARISH = 'BEARISH',
  NEUTRAL = 'NEUTRAL',
}

// ── Structure Event ────────────────────────────────
export enum StructureEvent {
  BOS = 'BOS',
  CHOCH = 'CHOCH',
  NONE = 'NONE',
}

// ── Sweep Direction ────────────────────────────────
export enum SweepDirection {
  BUY_SIDE = 'BUY_SIDE',
  SELL_SIDE = 'SELL_SIDE',
  BOTH = 'BOTH',
  NONE = 'NONE',
}

// ── Trading Session ────────────────────────────────
export enum Session {
  ASIAN = 'ASIAN',
  LONDON = 'LONDON',
  NEW_YORK = 'NEW_YORK',
  LONDON_NEW_YORK_OVERLAP = 'LONDON_NEW_YORK_OVERLAP',
  OTHER = 'OTHER',
}

// ── POI Type ───────────────────────────────────────
export enum POIType {
  ORDER_BLOCK = 'ORDER_BLOCK',
  MITIGATION_BLOCK = 'MITIGATION_BLOCK',
  FVG = 'FVG',
  IFVG = 'IFVG',
  ACCUMULATION_CONSOLIDATION = 'ACCUMULATION_CONSOLIDATION',
  SWING_AREA = 'SWING_AREA',
  OTHER = 'OTHER',
}

// ── Entry Confirmation Type ────────────────────────
export enum EntryConfirmation {
  LTF_CHOCH = 'LTF_CHOCH',
  LTF_BOS = 'LTF_BOS',
  REJECTION = 'REJECTION',
  FVG = 'FVG',
  OB_MITIGATION = 'OB_MITIGATION',
  OTHER = 'OTHER',
}

// ── Stop Loss Reason ───────────────────────────────
export enum StopLossReason {
  STRUCTURE_INVALIDATION = 'STRUCTURE_INVALIDATION',
  LIQUIDITY_INVALIDATION = 'LIQUIDITY_INVALIDATION',
  POI_INVALIDATION = 'POI_INVALIDATION',
  OTHER = 'OTHER',
}

// ── Target Type ────────────────────────────────────
export enum TargetType {
  LIQUIDITY = 'LIQUIDITY',
  PREVIOUS_HIGH = 'PREVIOUS_HIGH',
  PREVIOUS_LOW = 'PREVIOUS_LOW',
  STRUCTURE_TARGET = 'STRUCTURE_TARGET',
  FIXED_RR = 'FIXED_RR',
  OTHER = 'OTHER',
}

// ── Market Condition ───────────────────────────────
export enum MarketCondition {
  TRENDING = 'TRENDING',
  CONSOLIDATING = 'CONSOLIDATING',
  CHOPPY = 'CHOPPY',
  HIGH_IMPACT_NEWS = 'HIGH_IMPACT_NEWS',
}

// ── Mistake Type ───────────────────────────────────
export enum MistakeType {
  FOMO = 'FOMO',
  REVENGE_TRADING = 'REVENGE_TRADING',
  OVERTRADING = 'OVERTRADING',
  EARLY_ENTRY = 'EARLY_ENTRY',
  LATE_ENTRY = 'LATE_ENTRY',
  EARLY_EXIT = 'EARLY_EXIT',
  LATE_EXIT = 'LATE_EXIT',
  MOVED_SL = 'MOVED_SL',
  WIDENED_SL = 'WIDENED_SL',
  CLOSED_BEFORE_TP = 'CLOSED_BEFORE_TP',
  HELD_TOO_LONG = 'HELD_TOO_LONG',
  IGNORED_HTF_BIAS = 'IGNORED_HTF_BIAS',
  NO_LIQUIDITY_SWEEP = 'NO_LIQUIDITY_SWEEP',
  NO_STRUCTURE_CONFIRMATION = 'NO_STRUCTURE_CONFIRMATION',
  NO_LTF_CONFIRMATION = 'NO_LTF_CONFIRMATION',
  OUTSIDE_TRADING_WINDOW = 'OUTSIDE_TRADING_WINDOW',
  UNSUITABLE_MARKET = 'UNSUITABLE_MARKET',
  INCREASED_RISK = 'INCREASED_RISK',
  POOR_RISK_MANAGEMENT = 'POOR_RISK_MANAGEMENT',
  EMOTIONAL_ENTRY = 'EMOTIONAL_ENTRY',
  FORCED_SETUP = 'FORCED_SETUP',
  MISSED_VALID_SETUP = 'MISSED_VALID_SETUP',
  BROKE_TRADING_PLAN = 'BROKE_TRADING_PLAN',
  CHASED_PRICE = 'CHASED_PRICE',
}

// ── Psychology State (Before/During) ───────────────
export enum PsychologyStateBefore {
  CALM = 'CALM',
  CONFIDENT = 'CONFIDENT',
  UNCERTAIN = 'UNCERTAIN',
  FEARFUL = 'FEARFUL',
  EXCITED = 'EXCITED',
  FOMO = 'FOMO',
  FRUSTRATED = 'FRUSTRATED',
  TIRED = 'TIRED',
  DISTRACTED = 'DISTRACTED',
}

// Same values for during
export const PsychologyStateDuring = PsychologyStateBefore;

// ── Psychology State (After) ───────────────────────
export enum PsychologyStateAfter {
  SATISFIED = 'SATISFIED',
  FRUSTRATED = 'FRUSTRATED',
  ANGRY = 'ANGRY',
  REGRETFUL = 'REGRETFUL',
  NEUTRAL = 'NEUTRAL',
  DISAPPOINTED = 'DISAPPOINTED',
  CONFIDENT = 'CONFIDENT',
}

// ── Plan Adherence ─────────────────────────────────
export enum PlanAdherence {
  YES = 'YES',
  NO = 'NO',
  PARTIALLY = 'PARTIALLY',
}

// ── Backtest Image Type ────────────────────────────
export enum BacktestImageType {
  BEFORE_SETUP = 'BEFORE_SETUP',
  ENTRY = 'ENTRY',
  AFTER_TRADE = 'AFTER_TRADE',
}

// ── Live Image Type ────────────────────────────────
export enum LiveImageType {
  PRE_TRADE = 'PRE_TRADE',
  ENTRY = 'ENTRY',
  MANAGEMENT = 'MANAGEMENT',
  EXIT = 'EXIT',
  POST_TRADE = 'POST_TRADE',
}

// ── Missed Setup Reason ────────────────────────────
export enum MissedSetupReason {
  MISSED_ENTRY = 'MISSED_ENTRY',
  DID_NOT_SEE = 'DID_NOT_SEE',
  HESITATION = 'HESITATION',
  CONFIRMATION_TOO_LATE = 'CONFIRMATION_TOO_LATE',
  OUTSIDE_TRADING_WINDOW = 'OUTSIDE_TRADING_WINDOW',
  INTENTIONALLY_SKIPPED = 'INTENTIONALLY_SKIPPED',
  RULE_VIOLATION = 'RULE_VIOLATION',
  OTHER = 'OTHER',
}

// ── Liquidity Type (for analytics labels) ──────────
export enum LiquidityType {
  PDH = 'PDH',
  PDL = 'PDL',
  ASIAN_HIGH = 'ASIAN_HIGH',
  ASIAN_LOW = 'ASIAN_LOW',
  PREVIOUS_SESSION_HIGH = 'PREVIOUS_SESSION_HIGH',
  PREVIOUS_SESSION_LOW = 'PREVIOUS_SESSION_LOW',
  EQUAL_HIGHS = 'EQUAL_HIGHS',
  EQUAL_LOWS = 'EQUAL_LOWS',
  INTERNAL = 'INTERNAL',
  EXTERNAL = 'EXTERNAL',
  OTHER = 'OTHER',
}
