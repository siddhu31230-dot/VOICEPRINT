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
    // Safe JSON parse error handler (prevents unhandled 500 error leaks)
    app.use((err: any, _req: express.Request, res: express.Response, next: express.NextFunction) => {
      if (err instanceof SyntaxError && 'status' in err && (err as any).status === 400) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(400).json({ error: 'Malformed JSON payload.', code: 'INVALID_JSON' });
      }
      next(err);
    });
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
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-framer': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
});
