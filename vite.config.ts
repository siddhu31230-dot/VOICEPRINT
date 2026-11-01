import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import express from 'express';
import dotenv from 'dotenv';
import { apiRouter } from './server/apiRouter';

// Load environment variables
dotenv.config();

const apiPlugin = (): Plugin => ({
  name: 'voiceprint-api-server',
  configureServer(server) {
    const app = express();
    app.use(express.json({ limit: '10kb' }));
    app.use('/api', apiRouter);
    server.middlewares.use(app);
    console.log('[Vite API Plugin] Secure Gemma 4 /api router mounted on Vite dev server.');
  }
});

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiPlugin()],
  server: {
    port: 3000,
    open: false,
    host: true
  }
});
