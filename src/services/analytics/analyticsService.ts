// ==================================================
// SMC Trading Journal — Analytics & Performance Service
// ==================================================

import { createUserClient } from '../../config/database';
import { TradingMode, PerformanceMetrics } from '../../types';

export class AnalyticsService {
  private static getTradeTable(mode: TradingMode): string {
    return mode === TradingMode.BACKTEST ? 'backtest_trades' : 'live_trades';
  }

  /**
   * Calculates comprehensive performance metrics across a given set of trades.
   * Can be filtered by date range or other criteria if needed.
   */
  static async getPerformanceMetrics(
    accessToken: string,
    userId: string,
    mode: TradingMode,
    startDate?: string,
    endDate?: string
  ): Promise<Partial<PerformanceMetrics>> {
    const supabase = createUserClient(accessToken);
    const table = this.getTradeTable(mode);

    let query = supabase
      .from(table)
      .select('result, pnl, actual_r')
      .eq('user_id', userId)
      .not('result', 'is', null);

    if (startDate) query = query.gte('trade_date', startDate);
    if (endDate) query = query.lte('trade_date', endDate);

    const { data: trades, error } = await query;
    if (error) throw new Error(error.message);

    if (!trades || trades.length === 0) {
      return { total_trades: 0 };
    }

    let wins = 0;
    let losses = 0;
    let break_even = 0;
    let gross_profit = 0;
    let gross_loss = 0;
    let total_pnl = 0;
    let total_r = 0;
    let largest_win = 0;
    let largest_loss = 0;

    let cumulative_pnl = 0;
    let peak_value = 0;
    let max_drawdown = 0;

    trades.forEach((trade) => {
      const pnl = Number(trade.pnl || 0);
      const r = Number(trade.actual_r || 0);

      total_pnl += pnl;
      total_r += r;

      if (trade.result === 'WIN') {
        wins++;
        gross_profit += pnl;
        if (pnl > largest_win) largest_win = pnl;
      } else if (trade.result === 'LOSS') {
        losses++;
        gross_loss += Math.abs(pnl);
        if (pnl < largest_loss) largest_loss = pnl;
      } else {
        break_even++;
      }

      // Drawdown calculation (assuming sequential based on fetch order, though date ordering would be better in a stricter approach)
      cumulative_pnl += pnl;
      if (cumulative_pnl > peak_value) {
        peak_value = cumulative_pnl;
      }
      const currentDrawdown = peak_value - cumulative_pnl;
      if (currentDrawdown > max_drawdown) {
        max_drawdown = currentDrawdown;
      }
    });

    const total_trades = wins + losses + break_even;
    const win_rate = total_trades > 0 ? (wins / total_trades) * 100 : 0;
    const profit_factor = gross_loss > 0 ? gross_profit / gross_loss : Object.is(gross_profit, 0) ? 0 : 999;
    
    // mathematical expectancy in PNL terms: (Win % x Avg Win) - (Loss % x Avg Loss)
    const average_pnl = total_trades > 0 ? (wins > 0 ? gross_profit / wins : 0) : 0;
    const average_loss_pnl = total_trades > 0 ? (losses > 0 ? gross_loss / losses : 0) : 0;
    const expectancy = total_trades > 0 ? (wins / total_trades) * average_pnl - (losses / total_trades) * average_loss_pnl : 0;
    const average_r = total_trades > 0 ? total_r / total_trades : 0;

    return {
      total_trades,
      wins,
      losses,
      break_even,
      win_rate,
      profit_factor,
      total_pnl,
      total_r,
      average_r,
      average_pnl,
      largest_win,
      largest_loss,
      expectancy,
      max_drawdown
    };
  }

  /**
   * Group trades by pair to find the most and least profitable.
   */
  static async getPerformanceByPair(
    accessToken: string,
    userId: string,
    mode: TradingMode,
    startDate?: string,
    endDate?: string
  ) {
    const supabase = createUserClient(accessToken);
    const table = this.getTradeTable(mode);

    let query = supabase
      .from(table)
      .select('pair, result, pnl, actual_r')
      .eq('user_id', userId)
      .not('result', 'is', null);

    if (startDate) query = query.gte('trade_date', startDate);
    if (endDate) query = query.lte('trade_date', endDate);

    const { data: trades, error } = await query;
    if (error) throw new Error(error.message);

    const pairStats: Record<string, { trades: number; wins: number; pnl: number }> = {};

    trades.forEach(t => {
      const p = t.pair?.toUpperCase() || 'UNKNOWN';
      if (!pairStats[p]) {
        pairStats[p] = { trades: 0, wins: 0, pnl: 0 };
      }
      pairStats[p].trades++;
      if (t.result === 'WIN') pairStats[p].wins++;
      pairStats[p].pnl += Number(t.pnl || 0);
    });

    const results = Object.keys(pairStats).map(pair => {
      const s = pairStats[pair];
      return {
        pair,
        total_trades: s.trades,
        win_rate: s.trades > 0 ? (s.wins / s.trades) * 100 : 0,
        total_pnl: s.pnl
      };
    });

    // Sort by total_pnl descending
    return results.sort((a, b) => b.total_pnl - a.total_pnl);
  }

  /**
   * Group trades by session
   */
  static async getPerformanceBySession(
    accessToken: string,
    userId: string,
    mode: TradingMode,
    startDate?: string,
    endDate?: string
  ) {
    const supabase = createUserClient(accessToken);
    const table = this.getTradeTable(mode);

    let query = supabase
      .from(table)
      .select('session, result, pnl')
      .eq('user_id', userId)
      .not('result', 'is', null);

    if (startDate) query = query.gte('trade_date', startDate);
    if (endDate) query = query.lte('trade_date', endDate);

    const { data: trades, error } = await query;
    if (error) throw new Error(error.message);

    const sessionStats: Record<string, { trades: number; wins: number; pnl: number }> = {};

    trades.forEach(t => {
      const s = t.session || 'UNKNOWN';
      if (!sessionStats[s]) {
        sessionStats[s] = { trades: 0, wins: 0, pnl: 0 };
      }
      sessionStats[s].trades++;
      if (t.result === 'WIN') sessionStats[s].wins++;
      sessionStats[s].pnl += Number(t.pnl || 0);
    });

    const results = Object.keys(sessionStats).map(session => {
      const st = sessionStats[session];
      return {
        session,
        total_trades: st.trades,
        win_rate: st.trades > 0 ? (st.wins / st.trades) * 100 : 0,
        total_pnl: st.pnl
      };
    });

    return results.sort((a, b) => b.total_pnl - a.total_pnl);
  }
}
