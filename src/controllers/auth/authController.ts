// ==================================================
// SMC Trading Journal — Auth Controller
// ==================================================

import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../../config/database';
import { AuthenticatedRequest } from '../../types/api';

export class AuthController {

  // ── Sign Up ───────────────────────────────────────
  static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, full_name } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters',
        });
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // auto-confirm email so no verification email needed
        user_metadata: {
          full_name: full_name || '',
        },
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      // Sign them in immediately after creating the account
      const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError || !signInData.session) {
        return res.status(201).json({
          success: true,
          message: 'Account created. Please sign in.',
          data: { user: data.user },
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Account created and signed in successfully',
        data: {
          user: {
            id: signInData.user?.id,
            email: signInData.user?.email,
            full_name: signInData.user?.user_metadata?.full_name || '',
          },
          access_token: signInData.session.access_token,
          refresh_token: signInData.session.refresh_token,
          expires_at: signInData.session.expires_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Sign In ───────────────────────────────────────
  static async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
        });
      }

      const { data, error } = await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      });

      if (error || !data.session) {
        return res.status(401).json({
          success: false,
          message: error?.message || 'Invalid credentials',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Signed in successfully',
        data: {
          user: {
            id: data.user?.id,
            email: data.user?.email,
            full_name: data.user?.user_metadata?.full_name || '',
          },
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Refresh Token ─────────────────────────────────
  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return res.status(400).json({
          success: false,
          message: 'refresh_token is required',
        });
      }

      const { data, error } = await supabaseAdmin.auth.refreshSession({
        refresh_token,
      });

      if (error || !data.session) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token. Please sign in again.',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Sign Out ──────────────────────────────────────
  static async signOut(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (token) {
        // Revoke the session server-side
        await supabaseAdmin.auth.admin.signOut(token);
      }

      return res.status(200).json({
        success: true,
        message: 'Signed out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Get Current User ──────────────────────────────
  static async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.getUserById(req.userId!);

      if (error || !data.user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name || '',
          created_at: data.user.created_at,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  // ── Change Password ───────────────────────────────
  static async changePassword(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;

      if (!password || password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'New password must be at least 6 characters',
        });
      }

      const { error } = await supabaseAdmin.auth.admin.updateUserById(req.userId!, {
        password,
      });

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Password updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
