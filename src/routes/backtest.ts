// ==================================================
// SMC Trading Journal — Backtest Routes
// ==================================================

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { createTradeSchema, updateTradeSchema } from '../validators/tradeSchema';
import { dailyBalanceSchema, dailyReviewSchema, uploadBacktestImageSchema } from '../validators/miscSchema';
import { BacktestTradeController } from '../controllers/backtest/tradeController';
import { DailyBalanceController } from '../controllers/balances/balanceController';
import { DailyReviewController } from '../controllers/reviews/reviewController';
import { ImageController } from '../controllers/images/imageController';
import { AnalyticsController } from '../controllers/analytics/analyticsController';
import { uploadMiddleware } from '../middleware/upload';

const router = Router();

// Protect all backtest routes with Supabase Auth
router.use(requireAuth);

// ── Trades CRUD ────────────────────────────────────

router.post(
  '/',
  validateRequest(createTradeSchema),
  BacktestTradeController.createTrade
);

router.get(
  '/',
  BacktestTradeController.getTrades
);

router.get(
  '/:id',
  BacktestTradeController.getTradeById
);

router.put(
  '/:id',
  validateRequest(updateTradeSchema),
  BacktestTradeController.updateTrade
);

router.patch(
  '/:id',
  validateRequest(updateTradeSchema),
  BacktestTradeController.updateTrade
);

router.delete(
  '/:id',
  BacktestTradeController.deleteTrade
);

// ── Balances ───────────────────────────────────────

router.get(
  '/balances',
  DailyBalanceController.getAllBacktestBalances
);

router.get(
  '/balances/:date',
  DailyBalanceController.getBacktestBalance
);

router.post(
  '/balances',
  validateRequest(dailyBalanceSchema),
  DailyBalanceController.upsertBacktestBalance
);

router.post(
  '/balances/:date/sync',
  DailyBalanceController.syncBacktestBalance
);

// ── Reviews ────────────────────────────────────────

router.get(
  '/reviews',
  DailyReviewController.getBacktestReviews
);

router.get(
  '/reviews/:date',
  DailyReviewController.getBacktestReview
);

router.post(
  '/reviews',
  validateRequest(dailyReviewSchema),
  DailyReviewController.upsertBacktestReview
);

// ── Placeholders for Images & Reviews ────────────────
// router.post('/:id/images', ...);
// router.delete('/:id/images/:imageId', ...);
// router.get('/analytics', ...); // etc
// router.get('/daily-reviews', ...);

export default router;
