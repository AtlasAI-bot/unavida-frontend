import { useProgress as useProgressContext } from '../context/ProgressContext';

/**
 * Custom hook for managing learning progress and achievements
 * Provides a cleaner API for progress tracking operations
 */
export const useProgress = () => {
  const context = useProgressContext();

  return {
    // Chapter initialization
    initializeChapter: context.initializeChapter,

    // Section tracking
    markSectionComplete: context.markSectionComplete,

    // Assessment tracking
    recordQuizAttempt: context.recordQuizAttempt,

    // Case studies
    markCaseStudyComplete: context.markCaseStudyComplete,

    // Flashcards
    updateFlashcardsStudied: context.updateFlashcardsStudied,

    // Practice problems
    markProblemComplete: context.markProblemComplete,

    // Learning outcomes
    markOutcomeComplete: context.markOutcomeComplete,

    // Study sessions
    startStudySession: context.startStudySession,
    endStudySession: context.endStudySession,

    // Progress metrics
    getProgress: context.getChapterProgressPercentage,
    getStats: context.getLearningStats,
    getProgressPercentage: (chapterId) => {
      return context.getChapterProgressPercentage(chapterId);
    },

    // Achievements
    checkAchievements: context.checkAchievements,
    getAchievements: context.getUserAchievements,
    getAvailableAchievements: () => {
      return Object.values(context.ACHIEVEMENTS);
    },

    // Recommendations
    getNextSteps: context.getRecommendedNextSteps,

    // Raw progress data (for advanced usage)
    rawProgress: context.progress
  };
};

export default useProgress;
