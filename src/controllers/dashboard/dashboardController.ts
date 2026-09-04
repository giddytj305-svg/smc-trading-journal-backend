// ==================================================
// SMC Trading Journal — Dashboard Controller
// ==================================================

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, TradingMode } from '../../types';
import { DashboardService } from '../../services/dashboard/dashboardService';

export class DashboardController {
  
  static async getBacktestDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const data = await DashboardService.getDashboardData(accessToken, req.userId!, TradingMode.BACKTEST);
      
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }

  static async getLiveDashboard(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const data = await DashboardService.getDashboardData(accessToken, req.userId!, TradingMode.LIVE);
      
      res.status(200).json({ success: true, data });
    } catch (error) {
      next(error);
    }
  }
}
