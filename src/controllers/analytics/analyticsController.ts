// ==================================================
// SMC Trading Journal — Analytics Controller
// ==================================================

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, TradingMode } from '../../types';
import { AnalyticsService } from '../../services/analytics/analyticsService';

export class AnalyticsController {
  
  // ── GENERIC HANDLER ───────────────────────────────

  private static async getMetricsData(req: AuthenticatedRequest, res: Response, next: NextFunction, mode: TradingMode) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;

      const [overall, byPair, bySession] = await Promise.all([
        AnalyticsService.getPerformanceMetrics(accessToken, req.userId!, mode, startDate, endDate),
        AnalyticsService.getPerformanceByPair(accessToken, req.userId!, mode, startDate, endDate),
        AnalyticsService.getPerformanceBySession(accessToken, req.userId!, mode, startDate, endDate)
      ]);

      res.status(200).json({
        success: true,
        data: {
          overall,
          byPair,
          bySession
        }
      });
    } catch (error) {
      next(error);
    }
  }


  // ── ENDPOINTS ─────────────────────────────────────

  static async getBacktestAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    return AnalyticsController.getMetricsData(req, res, next, TradingMode.BACKTEST);
  }

  static async getLiveAnalytics(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    return AnalyticsController.getMetricsData(req, res, next, TradingMode.LIVE);
  }
}
