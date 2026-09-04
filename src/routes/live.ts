// ==================================================
// SMC Trading Journal — Live Routes
// ==================================================

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validateRequest';
import { createTradeSchema, updateTradeSchema } from '../validators/tradeSchema';
import { dailyBalanceSchema, dailyReviewSchema, uploadLiveImageSchema } from '../validators/miscSchema';
import { LiveTradeController } from '../controllers/live/tradeController';
import { DailyBalanceController } from '../controllers/balances/balanceController';
import { DailyReviewController } from '../controllers/reviews/reviewController';
import { ImageController } from '../controllers/images/imageController';
import { AnalyticsController } from '../controllers/analytics/analyticsController';
import { uploadMiddleware } from '../middleware/upload';

const router = Router();

// Protect all live routes with Supabase Auth
router.use(requireAuth);

// ── Trades CRUD ────────────────────────────────────

router.post(
  '/',
  validateRequest(createTradeSchema),
  LiveTradeController.createTrade
);

router.get(
  '/',
  LiveTradeController.getTrades
);

router.get(
  '/:id',
  LiveTradeController.getTradeById
);

router.put(
  '/:id',
  validateRequest(updateTradeSchema),
  LiveTradeController.updateTrade
);

router.patch(
  '/:id',
  validateRequest(updateTradeSchema),
  LiveTradeController.updateTrade
);

router.delete(
  '/:id',
  LiveTradeController.deleteTrade
);

// ── Balances ───────────────────────────────────────

router.get(
  '/balances',
  DailyBalanceController.getAllLiveBalances
);

router.get(
  '/balances/:date',
  DailyBalanceController.getLiveBalance
);

router.post(
  '/balances',
  validateRequest(dailyBalanceSchema),
  DailyBalanceController.upsertLiveBalance
);

router.post(
  '/balances/:date/sync',
  DailyBalanceController.syncLiveBalance
);

// ── Reviews ────────────────────────────────────────

router.get(
  '/reviews',
  DailyReviewController.getLiveReviews
);

router.get(
  '/reviews/:date',
  DailyReviewController.getLiveReview
);

router.post(
  '/reviews',
  validateRequest(dailyReviewSchema),
  DailyReviewController.upsertLiveReview
);

// ── Images ────────────────────────────────────────

router.post(
  '/:id/images',
  uploadMiddleware.single('image'),
  validateRequest(uploadLiveImageSchema),
  ImageController.uploadLiveImage
);

router.delete(
  '/:id/images/:imageId',
  ImageController.deleteLiveImage
);

// ── Analytics ──────────────────────────────────────

router.get(
  '/analytics/performance',
  AnalyticsController.getLiveAnalytics
);

export default router;
