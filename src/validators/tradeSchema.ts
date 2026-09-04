// ==================================================
// SMC Trading Journal — Trade Validation Schemas
// ==================================================

import { z } from 'zod';
import {
  Direction,
  TradeResult,
  BiasDirection,
  StructureEvent,
  SweepDirection,
  Session,
  POIType,
  EntryConfirmation,
  StopLossReason,
  TargetType,
  MarketCondition,
  MistakeType,
  PsychologyStateBefore,
  PsychologyStateAfter,
  PlanAdherence,
  LiquidityType,
} from '../types/enums';

// Reusable numeric validations
const positiveNumber = z.number().positive().optional().nullable();
const nonNegativeNumber = z.number().min(0).optional().nullable();
const score = z.number().int().min(1).max(5).optional().nullable();

export const baseTradeSchema = z.object({
  // Basic Info
  trade_date: z.string().date('Invalid trade date'),
  trade_timestamp: z.string().datetime().optional().nullable(),
  pair: z.string().min(1, 'Pair is required').toUpperCase(),
  direction: z.nativeEnum(Direction),
  session: z.nativeEnum(Session).optional().nullable(),
  time_window: z.string().optional().nullable(),

  // HTF Analysis
  weekly_bias: z.nativeEnum(BiasDirection).optional().nullable(),
  daily_bias: z.nativeEnum(BiasDirection).optional().nullable(),
  h4_bias: z.nativeEnum(BiasDirection).optional().nullable(),
  m30_bias: z.nativeEnum(BiasDirection).optional().nullable(),
  overall_htf_bias: z.nativeEnum(BiasDirection).optional().nullable(),

  // Market Structure
  structure_direction: z.string().optional().nullable(),
  swing_high: positiveNumber,
  swing_low: positiveNumber,
  structure_event: z.nativeEnum(StructureEvent).optional().nullable(),
  structure_timeframe: z.string().optional().nullable(),
  break_confirmation: z.string().optional().nullable(),

  // BOS
  bos_broken_swing: positiveNumber,
  bos_direction: z.string().optional().nullable(),
  bos_timeframe: z.string().optional().nullable(),
  bos_confirmation_type: z.string().optional().nullable(),

  // CHoCH
  choch_direction: z.string().optional().nullable(),
  choch_broken_structure: positiveNumber,
  choch_timeframe: z.string().optional().nullable(),
  choch_candle_close_confirmation: z.boolean().optional().nullable(),
  choch_wick_only: z.boolean().optional().nullable(),

  // Liquidity
  liquidity_type: z.nativeEnum(LiquidityType).or(z.string()).optional().nullable(),
  liquidity_level: positiveNumber,
  liquidity_swept: z.boolean().optional().nullable(),
  sweep_direction: z.nativeEnum(SweepDirection).optional().nullable(),
  sweep_timeframe: z.string().optional().nullable(),
  sweep_time: z.string().datetime().optional().nullable(),
  pdh: positiveNumber,
  pdl: positiveNumber,
  asian_high: positiveNumber,
  asian_low: positiveNumber,
  previous_session_high: positiveNumber,
  previous_session_low: positiveNumber,
  equal_highs: z.boolean().optional().nullable(),
  equal_lows: z.boolean().optional().nullable(),
  internal_liquidity: z.string().optional().nullable(),
  external_liquidity: z.string().optional().nullable(),

  // Accumulation
  accumulation_present: z.boolean().optional().nullable(),
  accumulation_timeframe: z.string().optional().nullable(),
  accumulation_start: z.string().datetime().optional().nullable(),
  accumulation_end: z.string().datetime().optional().nullable(),
  accumulation_high: positiveNumber,
  accumulation_low: positiveNumber,
  displacement_after_accumulation: z.boolean().optional().nullable(),

  // POI
  poi_type: z.nativeEnum(POIType).or(z.string()).optional().nullable(),
  poi_timeframe: z.string().optional().nullable(),
  poi_valid: z.boolean().optional().nullable(),
  poi_mitigated: z.boolean().optional().nullable(),
  poi_price_high: positiveNumber,
  poi_price_low: positiveNumber,

  // FVG
  fvg_present: z.boolean().optional().nullable(),
  fvg_direction: z.string().optional().nullable(),
  fvg_timeframe: z.string().optional().nullable(),
  fvg_price_high: positiveNumber,
  fvg_price_low: positiveNumber,
  fvg_mitigated: z.boolean().optional().nullable(),

  // IFVG
  ifvg_present: z.boolean().optional().nullable(),
  ifvg_direction: z.string().optional().nullable(),
  ifvg_timeframe: z.string().optional().nullable(),
  ifvg_price_high: positiveNumber,
  ifvg_price_low: positiveNumber,
  ifvg_mitigated: z.boolean().optional().nullable(),

  // Order Block
  ob_present: z.boolean().optional().nullable(),
  ob_direction: z.string().optional().nullable(),
  ob_timeframe: z.string().optional().nullable(),
  ob_price_high: positiveNumber,
  ob_price_low: positiveNumber,
  ob_mitigated: z.boolean().optional().nullable(),
  ob_used_for_entry: z.boolean().optional().nullable(),

  // Mitigation Block
  mb_present: z.boolean().optional().nullable(),
  mb_direction: z.string().optional().nullable(),
  mb_timeframe: z.string().optional().nullable(),
  mb_price_high: positiveNumber,
  mb_price_low: positiveNumber,
  mb_mitigated: z.boolean().optional().nullable(),
  mb_used_for_entry: z.boolean().optional().nullable(),

  // Entry Confirmation
  entry_timeframe: z.string().optional().nullable(),
  entry_confirmation: z.nativeEnum(EntryConfirmation).or(z.string()).optional().nullable(),
  confirmation_direction: z.string().optional().nullable(),
  confirmation_valid: z.boolean().optional().nullable(),

  // Trade Entry
  entry_price: positiveNumber,
  planned_entry: positiveNumber,
  actual_entry: positiveNumber,
  entry_time: z.string().datetime().optional().nullable(),
  entry_quality: score,

  // Stop Loss
  planned_stop_loss: positiveNumber,
  actual_stop_loss: positiveNumber,
  invalidation_level: positiveNumber,
  stop_loss_distance: nonNegativeNumber,
  stop_loss_reason: z.nativeEnum(StopLossReason).or(z.string()).optional().nullable(),

  // Take Profit
  planned_take_profit: positiveNumber,
  actual_take_profit: positiveNumber,
  tp_reason: z.string().optional().nullable(),
  target_type: z.nativeEnum(TargetType).or(z.string()).optional().nullable(),

  // Risk Management
  account_size_snapshot: nonNegativeNumber,
  risk_percentage: z.number().min(0).max(100).optional().nullable(),
  risk_amount: nonNegativeNumber,
  lot_size: nonNegativeNumber,
  planned_reward: nonNegativeNumber,
  planned_rr: z.number().optional().nullable(),
  actual_rr: z.number().optional().nullable(),
  pnl: z.number().optional().nullable(),

  // Result
  result: z.nativeEnum(TradeResult).optional().nullable(),
  exit_price: positiveNumber,
  exit_time: z.string().datetime().optional().nullable(),
  actual_r: z.number().optional().nullable(),
  exit_reason: z.string().optional().nullable(),

  // Early Exit
  early_exit: z.boolean().optional().nullable(),
  early_exit_reason: z.string().optional().nullable(),
  planned_exit_price: positiveNumber,
  actual_exit_price: positiveNumber,
  missed_potential_r: z.number().optional().nullable(),

  // Mistakes
  mistakes: z.array(z.nativeEnum(MistakeType).or(z.string())).optional().nullable(),

  // Psychology
  psychology_before: z.nativeEnum(PsychologyStateBefore).or(z.string()).optional().nullable(),
  psychology_during: z.nativeEnum(PsychologyStateBefore).or(z.string()).optional().nullable(),
  psychology_after: z.nativeEnum(PsychologyStateAfter).or(z.string()).optional().nullable(),
  confidence_score: score,
  discipline_score: score,

  // Plan Adherence
  plan_followed: z.nativeEnum(PlanAdherence).optional().nullable(),
  plan_adherence_score: score,

  // Review
  general_review: z.string().optional().nullable(),
  why_i_entered: z.string().optional().nullable(),
  what_happened: z.string().optional().nullable(),
  what_i_did_well: z.string().optional().nullable(),
  mistake_description: z.string().optional().nullable(),
  why_i_exited: z.string().optional().nullable(),
  what_i_should_have_done: z.string().optional().nullable(),
  lesson: z.string().optional().nullable(),
  improvement_for_next_trade: z.string().optional().nullable(),

  // Market Condition
  market_condition: z.nativeEnum(MarketCondition).or(z.string()).optional().nullable(),
});

// Create trade allows a lot to be optional, but requires pair, direction, and trade_date
export const createTradeSchema = z.object({
  body: baseTradeSchema.extend({
    pair: z.string().min(1, 'Pair is required').toUpperCase(),
    direction: z.nativeEnum(Direction),
    trade_date: z.string().date('trade_date must be YYYY-MM-DD format'),
  })
});

// Updating a trade means everything theoretically could be patched (and potentially nullish, except ID/etc managed internally)
export const updateTradeSchema = z.object({
  body: baseTradeSchema.partial(),
  params: z.object({
    id: z.string().uuid('Invalid trade ID'),
  })
});
