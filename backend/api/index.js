// Vercel serverless entry point. Vercel calls the exported Express app for every request;
// vercel.json rewrites all paths here, so /api/... routes keep working unchanged.
import app from '../src/app.js';

export default app;
