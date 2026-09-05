// ==================================================
// SMC Trading Journal — Express App Entry
// ==================================================

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env, validateEnv } from './config/env';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Validate environment before starting
validateEnv();

const app: Express = express();

// ── Security & Utility Middleware ──────────────────
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Request Logging (Dev only) ─────────────────────
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Health Check & Root Routes ─────────────────────
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🚀 SMC Trading Journal API',
    version: '1.0.0',
    docs: '/health',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'SMC Trading Journal API is running',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

import backtestRoutes from './routes/backtest';
import liveRoutes from './routes/live';
import dashboardRoutes from './routes/dashboard';
import authRoutes from './routes/auth';

// ── API Routes ─────────────────────────────────────
app.use('/api/auth', authRoutes);        // Public auth endpoints
app.use('/api/backtests', backtestRoutes);
app.use('/api/live-trades', liveRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ── 404 & Error Handling ───────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
