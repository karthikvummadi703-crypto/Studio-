
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

export const AIAdvisorChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('Recent chat history.'),
  userInput: z.string().describe('User input.'),
  userContext: z.object({
    points: z.number(),
    score: z.number(),
    level: z.string(),
    challengesCompleted: z.number(),
  }).describe('User sustainability stats.'),
});

export const AIAdvisorChatOutputSchema = z.object({
  responseText: z.string().describe('Short, actionable response.'),
  suggestedTitle: z.string().optional().describe('3-5 word title.'),
});

// Prompt definition for both streaming and non-streaming use
export const advisorPrompt = ai.definePrompt({
  name: 'aiAdvisorChatPrompt',
  input: { schema: AIAdvisorChatInputSchema },
  output: { schema: AIAdvisorChatOutputSchema },
  config: {
    temperature: 0.3, // Lower temperature for maximum speed and precision
    maxOutputTokens: 400,
  },
  prompt: `You are EcoPulse AI, a high-speed sustainability expert. 

User Context:
- Score: {{userContext.score}}
- Points: {{userContext.points}}
- Level: {{userContext.level}}
- Challenges: {{userContext.challengesCompleted}}

History:
{{#each history}}
{{role}}: {{text}}
{{/each}}

User: {{{userInput}}}

Instruction: Provide a concise, 2-sentence actionable tip. Be specific to their stats. If this is the start of a conversation, provide a suggestedTitle for the chat.`,
});

export async function aiAdvisorChat(input: z.infer<typeof AIAdvisorChatInputSchema>): Promise<z.infer<typeof AIAdvisorChatOutputSchema>> {
  const { output } = await advisorPrompt(input);
  return output!;
}
