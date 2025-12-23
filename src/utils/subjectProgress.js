/**
 * Utility functions for calculating subject progress
 * Separates calculation logic from components
 */

/**
 * Calculate overall progress percentage for chapters
 * @param {Array} chapters - Array of chapter objects
 * @returns {number} Progress percentage (0-100)
 */
export const calculateOverallProgress = (chapters) => {
  if (!Array.isArray(chapters) || chapters.length === 0) {
    return 0;
  }

  const totalChapters = chapters.length;
  const completedChapters = chapters.filter((ch) => ch.status).length;
  return totalChapters > 0 ? Math.round((completedChapters / totalChapters) * 100) : 0;
};

/**
 * Calculate progress percentage for a specific chapter
 * @param {Object} chapter - Chapter object with sections
 * @returns {number} Progress percentage (0-100)
 */
export const calculateChapterProgress = (chapter) => {
  if (!chapter?.sections || !Array.isArray(chapter.sections)) {
    return 0;
  }

  const totalSections = chapter.sections.length;
  const completedSections = chapter.sections.filter((section) => section.status).length;
  return totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
};

/**
 * Prepare chapters with completion dates for submission
 * @param {Array} chapters - Array of chapter objects
 * @param {Object} completedAtDates - Object mapping keys to dates
 * @returns {Array} Updated chapters with completion dates
 */
export const prepareChaptersForSubmission = (chapters, completedAtDates) => {
  return chapters.map((chapter, cIndex) => {
    const chapterKey = `chapter-${cIndex}`;

    return {
      ...chapter,
      completedAt:
        chapter.status && !completedAtDates[chapterKey]
          ? new Date().toISOString().split('T')[0]
          : completedAtDates[chapterKey] || chapter.completedAt,
      sections: chapter.sections.map((section, sIndex) => {
        const sectionKey = `section-${cIndex}-${sIndex}`;
        return {
          ...section,
          completedAt:
            section.status && !completedAtDates[sectionKey]
              ? new Date().toISOString().split('T')[0]
              : completedAtDates[sectionKey] || section.completedAt,
        };
      }),
    };
  });
};

