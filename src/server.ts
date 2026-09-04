// ==================================================
// SMC Trading Journal — Server Initialization
// ==================================================

import app from './app';
import { env } from './config/env';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  console.log(`[Server] 🚀 SMC Trading Journal API running on port ${PORT}`);
  console.log(`[Server] Environment: ${env.NODE_ENV}`);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Server] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('[Server] Process terminated.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[Server] SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('[Server] Process terminated.');
    process.exit(0);
  });
});
