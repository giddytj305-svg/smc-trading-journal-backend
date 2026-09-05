// ==================================================
// SMC Trading Journal — Auth Routes
// ==================================================

import { Router } from 'express';
import { AuthController } from '../controllers/auth/authController';
import { requireAuth } from '../middleware/auth';

const router = Router();

// ── Public routes (no token needed) ───────────────

// POST /api/auth/signup
router.post('/signup', AuthController.signUp);

// POST /api/auth/signin
router.post('/signin', AuthController.signIn);

// POST /api/auth/refresh
router.post('/refresh', AuthController.refreshToken);

// ── Protected routes (token required) ─────────────

// POST /api/auth/signout
router.post('/signout', requireAuth, AuthController.signOut);

// GET /api/auth/me
router.get('/me', requireAuth, AuthController.getMe);

// PATCH /api/auth/password
router.patch('/password', requireAuth, AuthController.changePassword);

export default router;
