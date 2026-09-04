// ==================================================
// Centralized Error Handler Middleware
// ==================================================

import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public statusCode: number;
  public errors: string[];

  constructor(message: string, statusCode: number = 500, errors: string[] = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errors: string[] = []) {
    super(message, 400, errors);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

// Express error handler — must have 4 params
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err.message);
    if (!(err instanceof AppError)) {
      console.error(err.stack);
    }
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors.length > 0 ? err.errors : undefined,
    });
    return;
  }

  // Unknown errors — never expose internals
  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
}

// 404 handler for unmatched routes
export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
}
