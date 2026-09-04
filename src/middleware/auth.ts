// ==================================================
// Supabase Auth Middleware
// ==================================================
// Verifies the JWT from the Authorization header
// using Supabase's built-in auth.getUser()
// ==================================================

import { Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/database';
import { UnauthorizedError } from './errorHandler';
import { AuthenticatedRequest } from '../types/api';

export async function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Missing access token');
    }

    // Verify token with Supabase
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    // Attach user info to request
    req.userId = data.user.id;
    req.userEmail = data.user.email;

    next();
  } catch (err) {
    if (err instanceof UnauthorizedError) {
      next(err);
    } else {
      next(new UnauthorizedError('Authentication failed'));
    }
  }
}
