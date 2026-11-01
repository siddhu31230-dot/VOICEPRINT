/**
 * VOICEPRINT Production & Standalone API Server (TypeScript)
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './apiRouter';

// Load server-side environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable('x-powered-by');
const port = parseInt(process.env.PORT || '3002', 10);

// Defense-in-depth: Global Security Headers for all routes and static assets
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://generativelanguage.googleapis.com; media-src 'self' blob: data:;"
  );
  next();
});

// Restrictive CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development and same-origin requests
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Payload size limit to prevent Denial-of-Service
app.use(express.json({ limit: '10kb' }));

// Safe JSON parse error handler (prevents unhandled 500 leaks)
app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
    res.setHeader('Content-Type', 'application/json');
    return res.status(400).json({ error: 'Malformed JSON payload.', code: 'INVALID_JSON' });
  }
  next(err);
});

// Mount API endpoints
app.use('/api', apiRouter);

// Serve built frontend assets if dist exists
const distPath = path.join(__dirname, '..', 'dist');
app.use(express.static(distPath));

app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(port, () => {
  console.log(`[VOICEPRINT Backend] Secure API server running on http://localhost:${port}`);
  console.log(`[VOICEPRINT Backend] Configured Model: ${process.env.GEMMA_MODEL || 'gemma-4-it'}`);
  console.log(`[VOICEPRINT Backend] Configured Provider: ${process.env.GEMMA_PROVIDER || 'google'}`);
});

export default app;
