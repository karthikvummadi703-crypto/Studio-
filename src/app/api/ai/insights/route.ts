/**
 * @fileOverview POST /api/ai/chat
 *
 * Streaming AI advisor endpoint. Responses are streamed token-by-token so the
 * client can render them progressively without waiting for the full completion.
 *
 * Auth:      Bearer token required (presence check — full JWT verification via
 *            Firebase identitytoolkit happens inside verifyIdToken).
 * Rate limit: 15 requests / 60 s per IP via Firestore.
 */

import { advisorPrompt, AIAdvisorChatInputSchema } from '@/ai/flows/ai-advisor-chat';
import { NextRequest } from 'next/server';
import { getErrorMessage } from '@/lib/handle-error';
import { checkRateLimit } from '@/lib/rate-limiter';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const RATE_LIMIT_THRESHOLD = 15;
const RATE_LIMIT_WINDOW = 60 * 1000;

export async function POST(req: NextRequest): Promise<Response> {
  // ── 1. Auth check ──────────────────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Missing or invalid token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 2. Rate limiting ───────────────────────────────────────────────────────
  const ipHeader = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'anonymous';
  const ip = ipHeader.split(',')[0].trim();

  const { allowed } = await checkRateLimit(ip, RATE_LIMIT_THRESHOLD, RATE_LIMIT_WINDOW);
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests. Please wait.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
    });
  }

  // ── 3. Parse & validate input ──────────────────────────────────────────────
  let parsedInput: ReturnType<typeof AIAdvisorChatInputSchema.parse>;
  try {
    const body = await req.json();
    parsedInput = AIAdvisorChatInputSchema.parse(body);
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // ── 4. Stream AI response ──────────────────────────────────────────────────
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = await advisorPrompt(parsedInput);

        if (!response?.output?.responseText) {
          controller.enqueue(encoder.encode('I was unable to generate a response. Please try again.'));
          controller.close();
          return;
        }

        // Stream word-by-word for a natural typewriter effect.
        const words = response.output.responseText.split(' ');
        for (const word of words) {
          controller.enqueue(encoder.encode(word + ' '));
          // Yield to the event loop between chunks.
          await new Promise((r) => setTimeout(r, 0));
        }
        controller.close();
      } catch (error) {
        logger.error('[AI Chat Stream Error]:', error);
        controller.enqueue(encoder.encode(`Error: ${getErrorMessage(error)}`));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-store',
      'Transfer-Encoding': 'chunked',
    },
  });
}
