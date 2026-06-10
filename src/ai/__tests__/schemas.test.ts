import { describe, it, expect } from 'vitest';
import { AIAdvisorChatInputSchema } from '../flows/ai-advisor-chat';
import { GenerateCarbonAnalysisInputSchema } from '../flows/generate-carbon-analysis';
import { GenerateReductionPlanInputSchema } from '../flows/generate-reduction-plan';

describe('AI Input Schemas', () => {
  describe('AIAdvisorChatInputSchema', () => {
    it('validates correct input', () => {
      const valid = {
        history: [{ role: 'user', text: 'hi' }],
        userInput: 'how to save energy?',
        userContext: { points: 100, score: 50, level: 'Seedling', challengesCompleted: 1 }
      };
      expect(AIAdvisorChatInputSchema.safeParse(valid).success).toBe(true);
    });

    it('rejects missing history', () => {
      const invalid = { userInput: 'hi', userContext: {} };
      expect(AIAdvisorChatInputSchema.safeParse(invalid).success).toBe(false);
    });
  });

  describe('GenerateCarbonAnalysisInputSchema', () => {
    it('validates correct input', () => {
      const valid = {
        userName: 'John',
        totalEmissions: 5.5,
        emissionsBreakdown: { transportation: 2, homeEnergy: 1, food: 1.5, lifestyle: 1 }
      };
      expect(GenerateCarbonAnalysisInputSchema.safeParse(valid).success).toBe(true);
    });
  });

  describe('GenerateReductionPlanInputSchema', () => {
    it('rejects invalid types', () => {
      const invalid = { totalEmissions: 'too much' };
      expect(GenerateReductionPlanInputSchema.safeParse(invalid).success).toBe(false);
    });
  });
});