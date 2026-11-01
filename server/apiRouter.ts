/**
 * VOICEPRINT Secure API Router
 * 
 * Implements:
 * - Strict input validation & sanitization (max 500 chars, no script injection)
 * - Rate limiting (30 requests / 15 minutes per IP)
 * - Request payload size limits (10KB max)
 * - Security response headers (nosniff, DENY, strict-origin)
 * - Zero logging of sensitive user prompts
 * - Safe error handling (no stack traces leaked)
 * - Gemma 4 AI integration with local grounded fallback
 */

import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { callGemmaProvider, ChatMessage } from './gemmaProvider';

export const apiRouter = Router();

// ==========================================
// 1. Security Headers Middleware
// ==========================================
apiRouter.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  next();
});

// ==========================================
// 2. Rate Limiting Configuration
// ==========================================
const chatRateLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '30', 10), // limit each IP to 30 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    error: 'Rate limit exceeded: You have sent too many requests. Please wait a few moments before asking another question.',
    code: 'RATE_LIMIT_EXCEEDED',
    fallbackAvailable: true,
  },
  keyGenerator: (req) => {
    // Robust client IP resolution behind proxies
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') return forwarded.split(',')[0].trim();
    return req.socket.remoteAddress || '127.0.0.1';
  },
});

// ==========================================
// 3. Input Sanitization Utility
// ==========================================
function sanitizeUserInput(input: unknown): string {
  if (typeof input !== 'string') return '';
  // Strip null bytes, control characters, and common script tags
  return input
    .replace(/\0/g, '')
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

// ==========================================
// 4. API Endpoints
// ==========================================

/**
 * GET /api/health
 * Returns service status without revealing sensitive secrets.
 */
apiRouter.get('/health', (_req: Request, res: Response) => {
  const provider = process.env.GEMMA_PROVIDER || 'google';
  const model = process.env.GEMMA_MODEL || 'gemma-4-it';
  const hasKey = !!(process.env.GEMMA_API_KEY || process.env.GEMINI_API_KEY);

  res.status(200).json({
    status: 'ok',
    service: 'VOICEPRINT Gemma 4 Gateway',
    provider,
    model,
    keyConfigured: hasKey,
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/chat
 * Handles conversational queries powered by Gemma 4.
 */
apiRouter.post('/chat', chatRateLimiter, async (req: Request, res: Response) => {
  const startTime = Date.now();

  try {
    const rawMessage = req.body?.message;
    const sanitizedMessage = sanitizeUserInput(rawMessage);

    // Validation 1: Presence
    if (!sanitizedMessage) {
      return res.status(400).json({
        error: 'Question is required and cannot be empty.',
        code: 'INVALID_INPUT',
      });
    }

    // Validation 2: Length limit (500 characters)
    if (sanitizedMessage.length > 500) {
      return res.status(400).json({
        error: 'Question exceeds maximum allowed length of 500 characters.',
        code: 'INPUT_TOO_LONG',
      });
    }

    // Validation 3: History sanitization
    const rawHistory = Array.isArray(req.body?.history) ? req.body.history : [];
    const sanitizedHistory: ChatMessage[] = rawHistory
      .slice(-6) // Limit to last 6 messages
      .filter((m: any) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
      .map((m: any) => ({
        role: m.role,
        content: sanitizeUserInput(m.content).slice(0, 500),
      }));

    // Call Gemma 4 Model Provider
    const result = await callGemmaProvider(sanitizedMessage, sanitizedHistory);

    // Privacy Invariant: Do NOT log the user's question or message content!
    const elapsed = Date.now() - startTime;
    console.log(`[API /chat] Completed in ${elapsed}ms | Model: ${result.model} | Grounded: ${result.grounded}`);

    return res.status(200).json({
      reply: result.reply,
      model: result.model,
      provider: result.provider,
      grounded: result.grounded,
      isFallback: result.isFallback || false,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    // Safe error handling: Never leak stack traces to client
    console.error('[API /chat] Error processing request:', err?.message || 'Unknown error');
    return res.status(500).json({
      error: 'An internal error occurred while processing your question. Curated portfolio answers are available.',
      code: 'INTERNAL_ERROR',
      fallbackAvailable: true,
    });
  }
});
