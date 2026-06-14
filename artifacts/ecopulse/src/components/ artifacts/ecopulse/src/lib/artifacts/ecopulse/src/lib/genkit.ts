import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-1.5-flash',
});

const responseCache = new Map<string, unknown>();

export async function withCache<T>(key: string, fn: () => Promise<T>): Promise<T> {
  if (responseCache.has(key)) {
    return responseCache.get(key) as T;
  }
  const result = await fn();
  responseCache.set(key, result);
  return result;
}
