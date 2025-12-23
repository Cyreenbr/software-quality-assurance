import { describe, it, expect } from 'vitest';
import { calculateOverallProgress, calculateChapterProgress, prepareChaptersForSubmission } from '../subjectProgress';

describe('subjectProgress utilities', () => {
  describe('calculateOverallProgress', () => {
    it('should return 0 for empty array', () => {
      expect(calculateOverallProgress([])).toBe(0);
    });

    it('should return 0 for null/undefined', () => {
      expect(calculateOverallProgress(null)).toBe(0);
      expect(calculateOverallProgress(undefined)).toBe(0);
    });

    it('should calculate progress correctly', () => {
      const chapters = [
        { status: true },
        { status: true },
        { status: false },
        { status: false },
      ];
      expect(calculateOverallProgress(chapters)).toBe(50);
    });

    it('should return 100 for all completed', () => {
      const chapters = [{ status: true }, { status: true }];
      expect(calculateOverallProgress(chapters)).toBe(100);
    });

    it('should return 0 for none completed', () => {
      const chapters = [{ status: false }, { status: false }];
      expect(calculateOverallProgress(chapters)).toBe(0);
    });
  });

  describe('calculateChapterProgress', () => {
    it('should return 0 for chapter without sections', () => {
      expect(calculateChapterProgress({})).toBe(0);
      expect(calculateChapterProgress(null)).toBe(0);
    });

    it('should calculate progress correctly', () => {
      const chapter = {
        sections: [
          { status: true },
          { status: true },
          { status: false },
        ],
      };
      expect(calculateChapterProgress(chapter)).toBe(67);
    });

    it('should return 100 for all sections completed', () => {
      const chapter = {
        sections: [{ status: true }, { status: true }],
      };
      expect(calculateChapterProgress(chapter)).toBe(100);
    });
  });

  describe('prepareChaptersForSubmission', () => {
    it('should add completion dates for completed chapters', () => {
      const chapters = [
        {
          status: true,
          completedAt: null,
          sections: [
            { status: true, completedAt: null },
          ],
        },
      ];
      const completedAtDates = {};

      const result = prepareChaptersForSubmission(chapters, completedAtDates);

      expect(result[0].completedAt).toBeTruthy();
      expect(result[0].sections[0].completedAt).toBeTruthy();
    });

    it('should use provided dates when available', () => {
      const chapters = [
        {
          status: true,
          completedAt: null,
          sections: [],
        },
      ];
      const completedAtDates = {
        'chapter-0': '2024-01-01',
      };

      const result = prepareChaptersForSubmission(chapters, completedAtDates);

      expect(result[0].completedAt).toBe('2024-01-01');
    });
  });
});

