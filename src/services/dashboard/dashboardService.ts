// ==================================================
// SMC Trading Journal — Dashboard Service
// ==================================================

import { TradingMode, DashboardData, PerformanceMetrics } from '../../types';
import { AnalyticsService } from '../analytics/analyticsService';
import { DailyBalanceService } from '../balances/balanceService';

export class DashboardService {
  /**
   * Generates the comprehensive dashboard view.
   */
  static async getDashboardData(
    accessToken: string,
    userId: string,
    mode: TradingMode
  ): Promise<Partial<DashboardData>> {
    // 1. Get Overall Metrics
    const overall = await AnalyticsService.getPerformanceMetrics(accessToken, userId, mode) as PerformanceMetrics;
    
    // 2. Get Dimensional Data for "Best Of"
    const byPair = await AnalyticsService.getPerformanceByPair(accessToken, userId, mode);
    const bySession = await AnalyticsService.getPerformanceBySession(accessToken, userId, mode);

    const best_pair = byPair.length > 0 ? byPair[0].pair : null;
    const best_session = bySession.length > 0 ? bySession[0].session : null;

    // 3. Get Balances (For "today" and balance snapshot)
    // In a real app we'd determine the user's timezone date. 
    // For now we'll fetch the latest balance record.
    const allBalances = await DailyBalanceService.getAllBalances(accessToken, userId, mode);
    
    let startingBalance = 0;
    let currentBalance = 0;
    let today = null;

    if (allBalances.length > 0) {
      // Assuming ordered by date asc based on service
      const firstBalance = allBalances[0];
      const latestBalance = allBalances[allBalances.length - 1];

      startingBalance = Number(firstBalance.starting_balance);
      currentBalance = Number(latestBalance.ending_balance) || Number(latestBalance.starting_balance);

      today = {
        date: latestBalance.balance_date,
        starting_balance: Number(latestBalance.starting_balance),
        ending_balance: Number(latestBalance.ending_balance),
        trades: latestBalance.number_of_trades || 0,
        wins: latestBalance.wins || 0,
        losses: latestBalance.losses || 0,
        break_even: latestBalance.break_even || 0,
        daily_pnl: Number(latestBalance.daily_pnl) || 0,
        daily_r: Number(latestBalance.daily_r) || 0,
        win_rate: Number(latestBalance.daily_win_rate) || 0,
        return_percentage: Number(latestBalance.daily_return_percentage) || 0
      };
    }

    // 4. Streaks (Simple implementation: not full iteration of all trades, leaving as placeholder for MVP speed)
    const streaks = {
      current_winning_streak: 0,
      current_losing_streak: 0,
      longest_winning_streak: 0,
      longest_losing_streak: 0,
      current_profitable_day_streak: 0,
      current_losing_day_streak: 0,
    };

    return {
      mode,
      balance: {
        starting: startingBalance,
        current: currentBalance,
      },
      overall,
      today,
      streaks,
      best_pair,
      best_session,
      best_time_window: null, // Left as expansion
      best_setup: null,       // Left as expansion
      most_common_mistake: null // Left as expansion
    };
  }
}
