// ==================================================
// SMC Trading Journal — Daily Balance Controller
// ==================================================

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, TradingMode } from '../../types';
import { DailyBalanceService } from '../../services/balances/balanceService';

export class DailyBalanceController {
  
  // ── BACKTEST BALANCES ─────────────────────────────

  static async getBacktestBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const date = req.params.date as string;
      const balance = await DailyBalanceService.getBalanceByDate(accessToken, req.userId!, TradingMode.BACKTEST, date);
      
      res.status(200).json({ success: true, data: balance });
    } catch (error) {
      next(error);
    }
  }

  static async getAllBacktestBalances(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const balances = await DailyBalanceService.getAllBalances(accessToken, req.userId!, TradingMode.BACKTEST);
      
      res.status(200).json({ success: true, data: balances });
    } catch (error) {
      next(error);
    }
  }

  static async upsertBacktestBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const date = req.body.balance_date as string;
      const startingBalance = req.body.starting_balance as number;
      
      const balance = await DailyBalanceService.upsertStartingBalance(accessToken, req.userId!, TradingMode.BACKTEST, date, startingBalance);
      
      res.status(200).json({
        success: true,
        data: balance,
        message: 'Backtest balance updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async syncBacktestBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const date = req.params.date as string;
      
      const balance = await DailyBalanceService.syncBalanceWithTrades(accessToken, req.userId!, TradingMode.BACKTEST, date);
      
      res.status(200).json({
        success: true,
        data: balance,
        message: 'Backtest balance synchronized with trades'
      });
    } catch (error) {
      next(error);
    }
  }


  // ── LIVE BALANCES ───────────────────────────────

  static async getLiveBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const date = req.params.date as string;
      const balance = await DailyBalanceService.getBalanceByDate(accessToken, req.userId!, TradingMode.LIVE, date);
      
      res.status(200).json({ success: true, data: balance });
    } catch (error) {
      next(error);
    }
  }

  static async getAllLiveBalances(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const balances = await DailyBalanceService.getAllBalances(accessToken, req.userId!, TradingMode.LIVE);
      
      res.status(200).json({ success: true, data: balances });
    } catch (error) {
      next(error);
    }
  }

  static async upsertLiveBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const date = req.body.balance_date as string;
      const startingBalance = req.body.starting_balance as number;
      
      const balance = await DailyBalanceService.upsertStartingBalance(accessToken, req.userId!, TradingMode.LIVE, date, startingBalance);
      
      res.status(200).json({
        success: true,
        data: balance,
        message: 'Live balance updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async syncLiveBalance(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const date = req.params.date as string;
      
      const balance = await DailyBalanceService.syncBalanceWithTrades(accessToken, req.userId!, TradingMode.LIVE, date);
      
      res.status(200).json({
        success: true,
        data: balance,
        message: 'Live balance synchronized with trades'
      });
    } catch (error) {
      next(error);
    }
  }
}
