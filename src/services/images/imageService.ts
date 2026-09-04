// ==================================================
// SMC Trading Journal — Image Service (Cloudinary)
// ==================================================

import { Readable } from 'stream';
import cloudinary from '../../config/cloudinary';
import { createUserClient } from '../../config/database';
import { NotFoundError } from '../../middleware/errorHandler';
import { TradingMode } from '../../types';

export class ImageService {
  private static getTableName(mode: TradingMode): string {
    return mode === TradingMode.BACKTEST ? 'backtest_trade_images' : 'live_trade_images';
  }

  /**
   * Upload an image stream to Cloudinary
   */
  private static uploadToCloudinary(fileBuffer: Buffer, folder: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder, resource_type: 'image' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      const stream = Readable.from(fileBuffer);
      stream.pipe(uploadStream);
    });
  }

  /**
   * Upload image and save metadata to Supabase
   */
  static async uploadTradeImage(
    accessToken: string,
    tradeId: string,
    mode: TradingMode,
    imageType: string,
    file: Express.Multer.File
  ) {
    const supabase = createUserClient(accessToken);
    const table = this.getTableName(mode);

    // 1. Check if trade exists
    const tradeTable = mode === TradingMode.BACKTEST ? 'backtest_trades' : 'live_trades';
    const { data: trade, error: tradeError } = await supabase
      .from(tradeTable)
      .select('id')
      .eq('id', tradeId)
      .single();
      
    if (tradeError || !trade) {
      throw new NotFoundError('Trade not found');
    }

    // 2. Upload to Cloudinary
    const cloudinaryFolder = `smc_trading_journal/${mode}/${tradeId}`;
    const result = await this.uploadToCloudinary(file.buffer, cloudinaryFolder);

    // 3. Save to database
    const { data: record, error } = await supabase
      .from(table)
      .insert({
        trade_id: tradeId,
        image_type: imageType,
        image_url: result.secure_url,
        cloudinary_public_id: result.public_id,
      })
      .select()
      .single();

    if (error) {
      // Cleanup Cloudinary image if DB insert fails
      await cloudinary.uploader.destroy(result.public_id);
      throw new Error(error.message);
    }

    return record;
  }

  /**
   * Delete an image from Cloudinary and Supabase
   */
  static async deleteTradeImage(accessToken: string, imageId: string, mode: TradingMode) {
    const supabase = createUserClient(accessToken);
    const table = this.getTableName(mode);

    // 1. Get image metadata
    const { data: image, error: fetchError } = await supabase
      .from(table)
      .select('cloudinary_public_id')
      .eq('id', imageId)
      .single();

    if (fetchError || !image) {
      throw new NotFoundError('Image not found');
    }

    // 2. Delete from Cloudinary
    if (image.cloudinary_public_id) {
      await cloudinary.uploader.destroy(image.cloudinary_public_id);
    }

    // 3. Delete from DB
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq('id', imageId);

    if (deleteError) throw new Error(deleteError.message);

    return true;
  }
}
