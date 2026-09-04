// ==================================================
// SMC Trading Journal — API Response Types
// ==================================================

// ── Standard API Response ──────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

// ── Pagination ─────────────────────────────────────
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ── Trade Filter Params ────────────────────────────
export interface TradeFilterParams extends PaginationParams {
  date_from?: string;
  date_to?: string;
  pair?: string;
  direction?: string;
  session?: string;
  time_window?: string;
  result?: string;
  overall_htf_bias?: string;
  structure_event?: string;
  liquidity_type?: string;
  poi_type?: string;
  market_condition?: string;
  plan_followed?: string;
  mistake?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
}

// ── Analytics Types ────────────────────────────────
export interface PerformanceMetrics {
  total_trades: number;
  wins: number;
  losses: number;
  break_even: number;
  win_rate: number;
  total_pnl: number;
  total_r: number;
  average_r: number;
  average_pnl: number;
  profit_factor: number;
  expectancy: number;
  largest_win: number;
  largest_loss: number;
  max_drawdown: number;
  max_drawdown_percentage: number;
  average_win_r: number;
  average_loss_r: number;
}

export interface DailyPerformance {
  date: string;
  starting_balance: number;
  ending_balance: number;
  trades: number;
  wins: number;
  losses: number;
  break_even: number;
  daily_pnl: number;
  daily_r: number;
  win_rate: number;
  return_percentage: number;
}

export interface MonthlyPerformance extends PerformanceMetrics {
  month: string;            // 'YYYY-MM'
  starting_balance: number;
  ending_balance: number;
  return_percentage: number;
  profitable_days: number;
  losing_days: number;
  break_even_days: number;
  best_day: DailyPerformance | null;
  worst_day: DailyPerformance | null;
}

export interface PairPerformance extends PerformanceMetrics {
  pair: string;
}

export interface SessionPerformance extends PerformanceMetrics {
  session: string;
}

export interface TimeWindowPerformance extends PerformanceMetrics {
  time_window: string;
}

export interface SetupPerformance extends PerformanceMetrics {
  setup_description: string;
  // Combination of confluences
  has_liquidity_sweep: boolean;
  structure_event: string | null;
  poi_type: string | null;
  entry_confirmation: string | null;
}

export interface LiquidityPerformance extends PerformanceMetrics {
  liquidity_type: string;
}

export interface MistakeAnalytics {
  mistake: string;
  count: number;
  trades_with_mistake: number;
  win_rate_with_mistake: number;
  total_r: number;
  estimated_missed_r: number;
}

export interface PsychologyPerformance extends PerformanceMetrics {
  state: string;
  phase: 'before' | 'during' | 'after';
}

// ── Dashboard ──────────────────────────────────────
export interface DashboardData {
  mode: 'BACKTEST' | 'LIVE';
  balance: {
    starting: number;
    current: number;
  };
  overall: PerformanceMetrics;
  today: DailyPerformance | null;
  streaks: {
    current_winning_streak: number;
    current_losing_streak: number;
    longest_winning_streak: number;
    longest_losing_streak: number;
    current_profitable_day_streak: number;
    current_losing_day_streak: number;
  };
  best_pair: string | null;
  best_session: string | null;
  best_time_window: string | null;
  best_setup: string | null;
  most_common_mistake: string | null;
}

// ── Calendar View ──────────────────────────────────
export interface CalendarDay {
  date: string;
  starting_balance: number | null;
  trades: number;
  pnl: number;
  r: number;
  wins: number;
  losses: number;
  break_even: number;
  win_rate: number | null;
  status: 'profitable' | 'losing' | 'break_even' | 'no_trades';
}

// ── Equity Curve ───────────────────────────────────
export interface EquityCurvePoint {
  date: string;
  balance: number;
  cumulative_pnl: number;
  cumulative_r: number;
  drawdown: number;
  drawdown_percentage: number;
}

// ── Express Request Extension ──────────────────────
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userEmail?: string;
}
