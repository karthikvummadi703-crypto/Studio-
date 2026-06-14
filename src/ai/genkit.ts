/**
 * @fileOverview Singleton Genkit instance for EcoPulse AI.
 * Includes a typed module-level response cache to minimise redundant LLM calls.
 */

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash',
});

// Typed session-level response cache — no `any`
const responseCache = new Map<string, unknown>();

/**
 * Wraps a flow execution with a simple memory cache.
 *
 * @param key - Unique string key for the prompt/input combination.
 * @param fn  - The async function to execute on a cache miss.
 * @returns     Cached or fresh result.
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  if (responseCache.has(key)) {
    return responseCache.get(key) as T;
  }
  const result = await fn();
  responseCache.set(key, result);
  return result;
}
