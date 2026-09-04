// ==================================================
// SMC Trading Journal — Image Controller
// ==================================================

import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, TradingMode } from '../../types';
import { ImageService } from '../../services/images/imageService';
import { ValidationError } from '../../middleware/errorHandler';

export class ImageController {
  
  // ── BACKTEST IMAGES ───────────────────────────────

  static async uploadBacktestImage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new ValidationError('No file uploaded', ['An image file must be provided']);
      }

      const accessToken = req.headers.authorization!.split(' ')[1];
      const tradeId = req.params.id as string;
      const imageType = req.body.image_type;
      
      const record = await ImageService.uploadTradeImage(
        accessToken, 
        tradeId, 
        TradingMode.BACKTEST, 
        imageType, 
        req.file
      );
      
      res.status(201).json({
        success: true,
        data: record,
        message: 'Backtest trade image uploaded successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteBacktestImage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const imageId = req.params.imageId as string;
      
      await ImageService.deleteTradeImage(accessToken, imageId, TradingMode.BACKTEST);
      
      res.status(200).json({
        success: true,
        message: 'Backtest trade image deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }


  // ── LIVE IMAGES ───────────────────────────────────

  static async uploadLiveImage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        throw new ValidationError('No file uploaded', ['An image file must be provided']);
      }

      const accessToken = req.headers.authorization!.split(' ')[1];
      const tradeId = req.params.id as string;
      const imageType = req.body.image_type;
      
      const record = await ImageService.uploadTradeImage(
        accessToken, 
        tradeId, 
        TradingMode.LIVE, 
        imageType, 
        req.file
      );
      
      res.status(201).json({
        success: true,
        data: record,
        message: 'Live trade image uploaded successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteLiveImage(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization!.split(' ')[1];
      const imageId = req.params.imageId as string;
      
      await ImageService.deleteTradeImage(accessToken, imageId, TradingMode.LIVE);
      
      res.status(200).json({
        success: true,
        message: 'Live trade image deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
