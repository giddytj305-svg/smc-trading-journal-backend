// ==================================================
// SMC Trading Journal — Daily Review Service
// ==================================================

import { createUserClient } from '../../config/database';
import { NotFoundError } from '../../middleware/errorHandler';
import { TradingMode, BacktestDailyReviewRow, LiveDailyReviewRow } from '../../types';

export class DailyReviewService {
  private static getTableName(mode: TradingMode): string {
    return mode === TradingMode.BACKTEST ? 'backtest_daily_reviews' : 'live_daily_reviews';
  }

  /**
   * Get review for a specific date
   */
  static async getReviewByDate(accessToken: string, userId: string, mode: TradingMode, date: string) {
    const supabase = createUserClient(accessToken);
    const table = this.getTableName(mode);

    const { data: review, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .eq('review_date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new NotFoundError('Review not found for this date');
      throw new Error(error.message);
    }
    
    return review;
  }

  /**
   * Get all reviews for a user with pagination
   */
  static async getReviews(accessToken: string, userId: string, mode: TradingMode, page = 1, limit = 20) {
    const supabase = createUserClient(accessToken);
    const table = this.getTableName(mode);
    const offset = (page - 1) * limit;

    const { data: reviews, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('review_date', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Upsert a daily review with user notes
   */
  static async upsertReview(
    accessToken: string,
    userId: string,
    mode: TradingMode,
    date: string,
    reviewData: Partial<BacktestDailyReviewRow | LiveDailyReviewRow>
  ) {
    const supabase = createUserClient(accessToken);
    const table = this.getTableName(mode);

    // Ensure we don't accidentally update the user_id or date
    const safeData = {
      ...reviewData,
      user_id: userId,
      review_date: date,
    };

    const { data: review, error } = await supabase
      .from(table)
      .upsert(safeData, { onConflict: 'user_id, review_date' })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return review;
  }
}
