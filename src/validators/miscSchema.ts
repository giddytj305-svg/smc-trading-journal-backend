// ==================================================
// SMC Trading Journal — Misc Validation Schemas
// ==================================================

import { z } from 'zod';
import { BacktestImageType, LiveImageType } from '../types/enums';

// ── Daily Balance Validation ───────────────────────

export const dailyBalanceSchema = z.object({
  body: z.object({
    balance_date: z.string().date(),
    starting_balance: z.number().min(0, 'Starting balance cannot be negative'),
  })
});

// ── Daily Review Validation ────────────────────────

export const dailyReviewSchema = z.object({
  body: z.object({
    review_date: z.string().date(),
    setups_observed: z.string().optional().nullable(),
    market_conditions: z.string().optional().nullable(),
    what_i_learned: z.string().optional().nullable(),
    mistakes: z.string().optional().nullable(),
    general_review: z.string().optional().nullable(),
    strategy_observations: z.string().optional().nullable(),
    daily_bias: z.string().optional().nullable(),
    emotional_state: z.string().optional().nullable(),
    discipline_score: z.number().int().min(1).max(5).optional().nullable(),
    plan_adherence: z.string().optional().nullable(),
    what_i_did_well: z.string().optional().nullable(),
    lesson: z.string().optional().nullable(),
    tomorrows_focus: z.string().optional().nullable(),
  })
});

// ── Image Upload Validation ────────────────────────

export const uploadBacktestImageSchema = z.object({
  body: z.object({
    image_type: z.nativeEnum(BacktestImageType),
  }),
  params: z.object({
    id: z.string().uuid(),
  })
});

export const uploadLiveImageSchema = z.object({
  body: z.object({
    image_type: z.nativeEnum(LiveImageType),
  }),
  params: z.object({
    id: z.string().uuid(),
  })
});
