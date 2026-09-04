// ==================================================
// SMC Trading Journal — Daily Balance Service
// ==================================================

import { createUserClient } from '../../config/database';
import { NotFoundError } from '../../middleware/errorHandler';
import { TradingMode, DailyBalanceRow } from '../../types';

export class DailyBalanceService {
  private static getTableName(mode: TradingMode): string {
    return mode === TradingMode.BACKTEST ? 'backtest_daily_balances' : 'live_daily_balances';
  }

  private static getTradesTableName(mode: TradingMode): string {
    return mode === TradingMode.BACKTEST ? 'backtest_trades' : 'live_trades';
  }

  /**
   * Get balance for a specific date
   */
  static async getBalanceByDate(accessToken: string, userId: string, mode: TradingMode, date: string): Promise<DailyBalanceRow> {
    const supabase = createUserClient(accessToken);
    const table = this.getTableName(mode);

    const { data: balance, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .eq('balance_date', date)
      .single();

    if (error) {
      if (error.code === 'PGRST116') throw new NotFoundError('Balance not found for this date');
      throw new Error(error.message);
    }
    
    return balance;
  }

  /**
   * Get all balances for a user (useful for graph/equity curve)
   */
  static async getAllBalances(accessToken: string, userId: string, mode: TradingMode): Promise<DailyBalanceRow[]> {
    const supabase = createUserClient(accessToken);
    const table = this.getTableName(mode);

    const { data: balances, error } = await supabase
      .from(table)
      .select('*')
      .eq('user_id', userId)
      .order('balance_date', { ascending: true });

    if (error) throw new Error(error.message);
    return balances;
  }

  /**
   * Upsert a daily starting balance (allows manual entry as per spec)
   */
  static async upsertStartingBalance(
    accessToken: string,
    userId: string,
    mode: TradingMode,
    date: string,
    startingBalance: number
  ): Promise<DailyBalanceRow> {
    const supabase = createUserClient(accessToken);
    const table = this.getTableName(mode);

    // Using UPSERT: on conflict (user_id, balance_date) update starting_balance
    const { data: balance, error } = await supabase
      .from(table)
      .upsert(
        {
          user_id: userId,
          balance_date: date,
          starting_balance: startingBalance,
        },
        { onConflict: 'user_id, balance_date' }
      )
      .select()
      .single();

    if (error) throw new Error(error.message);

    // After updating the starting balance, we should try to sync the daily trade metrics
    return await this.syncBalanceWithTrades(accessToken, userId, mode, date);
  }

  /**
   * Synchronize the daily balance record with the actual trades for that day.
   * Calculates P&L, R, win rate, ending balance, etc.
   */
  static async syncBalanceWithTrades(
    accessToken: string,
    userId: string,
    mode: TradingMode,
    date: string
  ): Promise<DailyBalanceRow> {
    const supabase = createUserClient(accessToken);
    const balanceTable = this.getTableName(mode);
    const tradesTable = this.getTradesTableName(mode);

    // 1. Get current balance record to get starting_balance
    let { data: balanceRecord, error: balanceError } = await supabase
      .from(balanceTable)
      .select('*')
      .eq('user_id', userId)
      .eq('balance_date', date)
      .single();

    if (balanceError && balanceError.code !== 'PGRST116') {
      throw new Error(balanceError.message);
    }
    
    // If no balance record exists, we can't sync it (we need a starting balance first). 
    // The user must manually input starting balance for a day, especially in live mode.
    if (!balanceRecord) {
      throw new Error('Balance record does not exist for this date.');
    }

    // 2. Fetch all completed trades for this day
    const { data: trades, error: tradesError } = await supabase
      .from(tradesTable)
      .select('result, pnl, actual_r')
      .eq('user_id', userId)
      .eq('trade_date', date)
      .not('result', 'is', null); // Only consider completed trades

    if (tradesError) throw new Error(tradesError.message);

    // 3. Calculate metrics
    let wins = 0;
    let losses = 0;
    let break_even = 0;
    let daily_pnl = 0;
    let daily_r = 0;

    trades.forEach((trade) => {
      if (trade.result === 'WIN') wins++;
      if (trade.result === 'LOSS') losses++;
      if (trade.result === 'BREAK_EVEN') break_even++;

      if (trade.pnl != null) daily_pnl += Number(trade.pnl);
      if (trade.actual_r != null) daily_r += Number(trade.actual_r);
    });

    const number_of_trades = wins + losses + break_even;
    const daily_win_rate = number_of_trades > 0 ? (wins / number_of_trades) * 100 : 0;
    const ending_balance = Number(balanceRecord.starting_balance) + daily_pnl;
    
    let daily_return_percentage = 0;
    if (Number(balanceRecord.starting_balance) > 0) {
      daily_return_percentage = (daily_pnl / Number(balanceRecord.starting_balance)) * 100;
    }

    // 4. Update the balance record
    const { data: updatedBalance, error: updateError } = await supabase
      .from(balanceTable)
      .update({
        ending_balance,
        daily_pnl,
        daily_r,
        number_of_trades,
        wins,
        losses,
        break_even,
        daily_win_rate,
        daily_return_percentage
      })
      .eq('id', balanceRecord.id)
      .select()
      .single();

    if (updateError) throw new Error(updateError.message);

    return updatedBalance;
  }
}
