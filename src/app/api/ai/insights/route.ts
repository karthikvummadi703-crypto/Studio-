import { reductionPlanPrompt, GenerateReductionPlanInputSchema } from '@/ai/flows/generate-reduction-plan';
import { NextRequest } from 'next/server';
import { getErrorMessage } from '@/lib/handle-error';
import { checkRateLimit } from '@/lib/rate-limiter';

const RATE_LIMIT_THRESHOLD = 10;
const RATE_LIMIT_WINDOW = 60 * 1000;

/**
 * Simplified API Route for AI Environmental Insights.
 * Changed to non-streaming to guarantee build success on Vercel.
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing or invalid token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Distributed Rate Limiting via Firestore
    const ipHeader = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'anonymous';
    const ip = ipHeader.split(',')[0].trim();

    const { allowed } = await checkRateLimit(ip, RATE_LIMIT_THRESHOLD, RATE_LIMIT_WINDOW);

    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }

    const input = await req.json();
    const parsedInput = GenerateReductionPlanInputSchema.parse(input);

    // Call the prompt directly (non-streaming)
    const response = await reductionPlanPrompt(parsedInput);

    if (!response || !response.output) {
      throw new Error('AI failed to generate insights');
    }

    // Return the full JSON output
    return new Response(JSON.stringify(response.output), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error: unknown) {
    console.error('[AI Insights Error]:', error);
    return new Response(JSON.stringify({ error: getErrorMessage(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
