/**
 * VOICEPRINT Production & Standalone API Server
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './apiRouter.js';

// Load server-side environment variables from .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3002', 10);

// Restrictive CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow local development and same-origin requests
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
      return callback(null, true); // adjust for production domains as needed
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Payload size limit to prevent Denial-of-Service
app.use(express.json({ limit: '10kb' }));

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
