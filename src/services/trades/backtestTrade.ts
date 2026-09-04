// ==================================================
// SMC Trading Journal — Backtest Trade Service
// ==================================================

import { createUserClient } from '../../config/database';
import { NotFoundError } from '../../middleware/errorHandler';
import { BacktestTradeRow, TradeFilterParams } from '../../types';

export class BacktestTradeService {
  /**
   * Create a new backtest trade
   */
  static async createTrade(accessToken: string, userId: string, data: Partial<BacktestTradeRow>) {
    const supabase = createUserClient(accessToken);
    const { data: trade, error } = await supabase
      .from('backtest_trades')
      .insert({ ...data, user_id: userId })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return trade;
  }

  /**
   * Get all backtest trades with filtering and pagination
   */
  static async getTrades(accessToken: string, userId: string, filters: TradeFilterParams) {
    const supabase = createUserClient(accessToken);
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('backtest_trades')
      .select('*', { count: 'exact' })
      .eq('user_id', userId);

    // Apply filters
    if (filters.date_from) query = query.gte('trade_date', filters.date_from);
    if (filters.date_to) query = query.lte('trade_date', filters.date_to);
    if (filters.pair) query = query.eq('pair', filters.pair);
    if (filters.direction) query = query.eq('direction', filters.direction);
    if (filters.session) query = query.eq('session', filters.session);
    if (filters.result) query = query.eq('result', filters.result);
    // Add more filters as needed

    // Sort
    const sortBy = filters.sort_by || 'trade_date';
    const sortOrder = filters.sort_order || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Pagination
    query = query.range(offset, offset + limit - 1);

    const { data: trades, error, count } = await query;

    if (error) throw new Error(error.message);

    return {
      trades,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    };
  }

  /**
   * Get a single backtest trade by ID
   */
  static async getTradeById(accessToken: string, userId: string, tradeId: string) {
    const supabase = createUserClient(accessToken);
    const { data: trade, error } = await supabase
      .from('backtest_trades')
      .select('*, backtest_trade_images(*)')
      .eq('id', tradeId)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new NotFoundError('Trade not found');
      throw new Error(error.message);
    }
    return trade;
  }

  /**
   * Update a backtest trade
   */
  static async updateTrade(accessToken: string, userId: string, tradeId: string, data: Partial<BacktestTradeRow>) {
    const supabase = createUserClient(accessToken);
    const { data: trade, error } = await supabase
      .from('backtest_trades')
      .update(data)
      .eq('id', tradeId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new NotFoundError('Trade not found');
      throw new Error(error.message);
    }
    return trade;
  }

  /**
   * Delete a backtest trade
   */
  static async deleteTrade(accessToken: string, userId: string, tradeId: string) {
    const supabase = createUserClient(accessToken);
    const { error, count } = await supabase
      .from('backtest_trades')
      .delete({ count: 'exact' })
      .eq('id', tradeId)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    if (count === 0) throw new NotFoundError('Trade not found');
    return true;
  }
}
