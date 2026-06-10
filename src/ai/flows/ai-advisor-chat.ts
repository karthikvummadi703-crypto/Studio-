
'use server';
/**
 * @fileOverview A Genkit flow for the EcoPulse AI Advisor chat.
 *
 * - aiAdvisorChat - A function that handles the conversational AI advisor logic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MessageSchema = z.object({
  role: z.enum(['user', 'ai']),
  text: z.string(),
});

const AIAdvisorChatInputSchema = z.object({
  history: z.array(MessageSchema).describe('The conversation history.'),
  userInput: z.string().describe('The user\'s latest question or input.'),
  userContext: z.object({
    points: z.number(),
    score: z.number(),
    level: z.string(),
    challengesCompleted: z.number(),
  }).describe('The user\'s current sustainability profile.'),
});
export type AIAdvisorChatInput = z.infer<typeof AIAdvisorChatInputSchema>;

const AIAdvisorChatOutputSchema = z.object({
  responseText: z.string().describe('The AI\'s response text.'),
  suggestedTitle: z.string().optional().describe('A suggested title for the conversation (only for first message).'),
});
export type AIAdvisorChatOutput = z.infer<typeof AIAdvisorChatOutputSchema>;

export async function aiAdvisorChat(input: AIAdvisorChatInput): Promise<AIAdvisorChatOutput> {
  return aiAdvisorChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiAdvisorChatPrompt',
  input: { schema: AIAdvisorChatInputSchema },
  output: { schema: AIAdvisorChatOutputSchema },
  prompt: `You are the EcoPulse AI Advisor, a professional sustainability consultant.
Your goal is to provide personalized, actionable, and motivating advice to users to help them reduce their carbon footprint.

User Profile:
- Green Points: {{{userContext.points}}}
- Sustainability Score: {{{userContext.score}}}
- Level: {{{userContext.level}}}
- Challenges Completed: {{{userContext.challengesCompleted}}}

Conversation History:
{{#each history}}
- {{role}}: {{text}}
{{/each}}

Latest User Input: {{{userInput}}}

Analyze the user's situation and provide a helpful response. If this is the start of a conversation, suggest a brief, relevant title for this chat (e.g., "Transportation Strategy"). Be encouraging and use the user's metrics to make the advice feel specific.`,
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
