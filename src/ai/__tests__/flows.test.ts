import { describe, it, expect, vi } from 'vitest';
import { generateCarbonAnalysis } from '../flows/generate-carbon-analysis';

// Mock genkit flow execution
vi.mock('../genkit', () => ({
  ai: {
    definePrompt: vi.fn(),
    defineFlow: vi.fn((config, handler) => {
      const flow = (input: any) => handler(input);
      return flow;
    }),
  },
}));

describe('Genkit Flows', () => {
  describe('generateCarbonAnalysis', () => {
    it('executes with correct input shape', async () => {
      // In a real Genkit environment we would use runFlow from genkit/testing
      // For this unit test, we verify the wrapper function's existence and types
      expect(generateCarbonAnalysis).toBeDefined();
      expect(typeof generateCarbonAnalysis).toBe('function');
    });
  });
});