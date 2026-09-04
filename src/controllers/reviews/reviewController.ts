// ==================================================
// SMC Trading Journal — Daily Review Controller
// ==================================================

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, TradingMode } from '../../types';
import { DailyReviewService } from '../../services/reviews/reviewService';

export class DailyReviewController {
  
  // ── BACKTEST REVIEWS ─────────────────────────────

  static async getBacktestReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const date = req.params.date as string;
      const review = await DailyReviewService.getReviewByDate(accessToken, req.userId!, TradingMode.BACKTEST, date);
      
      res.status(200).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  }

  static async getBacktestReviews(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await DailyReviewService.getReviews(accessToken, req.userId!, TradingMode.BACKTEST, page, limit);
      
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async upsertBacktestReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const date = req.body.review_date as string;
      
      const review = await DailyReviewService.upsertReview(accessToken, req.userId!, TradingMode.BACKTEST, date, req.body);
      
      res.status(200).json({
        success: true,
        data: review,
        message: 'Backtest review updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }


  // ── LIVE REVIEWS ───────────────────────────────

  static async getLiveReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const date = req.params.date as string;
      const review = await DailyReviewService.getReviewByDate(accessToken, req.userId!, TradingMode.LIVE, date);
      
      res.status(200).json({ success: true, data: review });
    } catch (error) {
      next(error);
    }
  }

  static async getLiveReviews(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      
      const result = await DailyReviewService.getReviews(accessToken, req.userId!, TradingMode.LIVE, page, limit);
      
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  static async upsertLiveReview(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const date = req.body.review_date as string;
      
      const review = await DailyReviewService.upsertReview(accessToken, req.userId!, TradingMode.LIVE, date, req.body);
      
      res.status(200).json({
        success: true,
        data: review,
        message: 'Live review updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
