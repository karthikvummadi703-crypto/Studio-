
'use server';
/**
 * @fileOverview A fast, optimized Genkit flow for the EcoPulse AI Advisor.
 *
 * - aiAdvisorChat - High-speed conversational AI consultant.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'ai']),
  text: z.string(),
});

const AIAdvisorChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('Recent chat history.'),
  userInput: z.string().describe('User input.'),
  userContext: z.object({
    points: z.number(),
    score: z.number(),
    level: z.string(),
    challengesCompleted: z.number(),
  }).describe('User sustainability stats.'),
});

const AIAdvisorChatOutputSchema = z.object({
  responseText: z.string().describe('Concise, fast response.'),
  suggestedTitle: z.string().optional().describe('Short title.'),
});

export async function aiAdvisorChat(input: z.infer<typeof AIAdvisorChatInputSchema>): Promise<z.infer<typeof AIAdvisorChatOutputSchema>> {
  return aiAdvisorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAdvisorChatPrompt',
  input: { schema: AIAdvisorChatInputSchema },
  output: { schema: AIAdvisorChatOutputSchema },
  config: {
    temperature: 0.7,
  },
  prompt: `You are EcoPulse AI, a high-performance sustainability consultant. 
Keep responses concise, professional, and extremely actionable.

User Status:
- Score: {{{userContext.score}}}
- Level: {{{userContext.level}}}
- Points: {{{userContext.points}}}

History:
{{#each history}}
- {{role}}: {{text}}
{{/each}}

User Question: {{{userInput}}}

Respond now. If new chat, provide a short title.`,
});

const aiAdvisorChatFlow = ai.defineFlow(
  {
    name: 'aiAdvisorChatFlow',
    inputSchema: AIAdvisorChatInputSchema,
    outputSchema: AIAdvisorChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
