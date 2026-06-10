
'use server';
/**
 * @fileOverview A hyper-optimized Genkit flow for the EcoPulse AI Advisor.
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
  responseText: z.string().describe('Short, actionable response.'),
  suggestedTitle: z.string().optional().describe('3-5 word title.'),
});

export async function aiAdvisorChat(input: z.infer<typeof AIAdvisorChatInputSchema>): Promise<z.infer<typeof AIAdvisorChatOutputSchema>> {
  return aiAdvisorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAdvisorChatPrompt',
  input: { schema: AIAdvisorChatInputSchema },
  output: { schema: AIAdvisorChatOutputSchema },
  config: {
    temperature: 0.4, // Lower temperature for faster, more predictable output
    maxOutputTokens: 300, // Limit response length for speed
  },
  prompt: `You are EcoPulse AI. Respond instantly and concisely.

Context: Score:{{userContext.score}}, Points:{{userContext.points}}, Level:{{userContext.level}}.

History:
{{#each history}}
{{role}}: {{text}}
{{/each}}

User: {{{userInput}}}

Instruction: Give a 2-sentence actionable tip. If first message, provide a short title.`,
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
