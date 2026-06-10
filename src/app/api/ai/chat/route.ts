
import { ai } from '@/ai/genkit';
import { advisorPrompt, AIAdvisorChatInputSchema } from '@/ai/flows/ai-advisor-chat';
import { NextRequest } from 'next/server';

/**
 * Streaming API Route for AI Advisor
 * Provides sub-2-second first token latency
 */
export async function POST(req: NextRequest) {
  try {
    const input = await req.json();
    
    // Validate input
    const parsedInput = AIAdvisorChatInputSchema.parse(input);

    const { stream } = ai.generateStream({
      prompt: advisorPrompt(parsedInput),
    });

    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          if (chunk.text) {
            controller.enqueue(encoder.encode(chunk.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error: any) {
    console.error('[AI Stream Error]:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
