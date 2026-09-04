// ==================================================
// Vercel Serverless Entry Point
// ==================================================
// Vercel needs a default export of the Express app.
// It will intercept all requests via vercel.json routing.

import '../src/app'; // ensure env is validated
import app from '../src/app';

module.exports = app;
export default app;
