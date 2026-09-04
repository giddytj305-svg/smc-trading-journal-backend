// ==================================================
// SMC Trading Journal — Live Trade Controller
// ==================================================

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, TradeFilterParams } from '../../types';
import { LiveTradeService } from '../../services/trades/liveTrade';

export class LiveTradeController {
  
  static async createTrade(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const trade = await LiveTradeService.createTrade(accessToken, req.userId!, req.body);
      
      res.status(201).json({
        success: true,
        data: trade,
        message: 'Live trade created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTrades(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const filters = req.query as unknown as TradeFilterParams;
      
      const result = await LiveTradeService.getTrades(accessToken, req.userId!, filters);
      
      res.status(200).json({
        success: true,
        data: result.trades,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTradeById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const tradeId = req.params.id as string;
      
      const trade = await LiveTradeService.getTradeById(accessToken, req.userId!, tradeId);
      
      res.status(200).json({
        success: true,
        data: trade,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTrade(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const tradeId = req.params.id as string;
      
      const trade = await LiveTradeService.updateTrade(accessToken, req.userId!, tradeId, req.body);
      
      res.status(200).json({
        success: true,
        data: trade,
        message: 'Live trade updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTrade(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const tradeId = req.params.id as string;
      
      await LiveTradeService.deleteTrade(accessToken, req.userId!, tradeId);
      
      res.status(200).json({
        success: true,
        message: 'Live trade deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
