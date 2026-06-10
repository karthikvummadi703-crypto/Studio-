import { describe, it, expect } from 'vitest';
import { cn } from '../utils';
import { getLevelFromPoints } from '../levels';

describe('Utility Functions', () => {
  describe('cn()', () => {
    it('merges tailwind classes correctly', () => {
      expect(cn('px-2 py-2', 'px-4')).toBe('py-2 px-4');
    });

    it('handles conditional classes', () => {
      expect(cn('base', true && 'active', false && 'hidden')).toBe('base active');
    });
  });

  describe('getLevelFromPoints()', () => {
    it('handles boundary values correctly', () => {
      expect(getLevelFromPoints(0)).toBe('Seedling');
      expect(getLevelFromPoints(99)).toBe('Seedling');
      expect(getLevelFromPoints(100)).toBe('Seedling');
      expect(getLevelFromPoints(101)).toBe('Eco Warrior');
      expect(getLevelFromPoints(500)).toBe('Eco Warrior');
      expect(getLevelFromPoints(501)).toBe('Climate Champion');
      expect(getLevelFromPoints(999)).toBe('Climate Champion');
      expect(getLevelFromPoints(1000)).toBe('Climate Champion');
      expect(getLevelFromPoints(1001)).toBe('Planet Guardian');
    });
  });
});