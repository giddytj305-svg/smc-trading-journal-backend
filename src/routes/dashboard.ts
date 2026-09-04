// ==================================================
// SMC Trading Journal — Dashboard Routes
// ==================================================

import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { DashboardController } from '../controllers/dashboard/dashboardController';

const router = Router();

// Protect all dashboard routes with Supabase Auth
router.use(requireAuth);

router.get(
  '/backtest',
  DashboardController.getBacktestDashboard
);

router.get(
  '/live',
  DashboardController.getLiveDashboard
);

export default router;
