import React, { createContext, useContext, useEffect, useState } from 'react';

const ProgressContext = createContext();

const ACHIEVEMENTS = {
  'bookworm': {
    id: 'bookworm',
    name: 'Bookworm',
    description: 'Read entire chapter',
    icon: '📚',
    requirement: 'Read 100% of chapter'
  },
  'quiz-master': {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Score 100% on quiz',
    icon: '🎯',
    requirement: 'Perfect quiz score'
  },
  'study-buddy': {
    id: 'study-buddy',
    name: 'Study Buddy',
    description: 'Complete all flashcards',
    icon: '🎴',
    requirement: 'Master all flashcards'
  },
  'case-expert': {
    id: 'case-expert',
    name: 'Case Expert',
    description: 'Complete all case studies',
    icon: '💼',
    requirement: 'Solve all clinical cases'
  },
  'speed-reader': {
    id: 'speed-reader',
    name: 'Speed Reader',
    description: 'Complete chapter in <3 hours',
    icon: '⚡',
    requirement: 'Study time < 3 hours'
  },
  'problem-solver': {
    id: 'problem-solver',
    name: 'Problem Solver',
    description: 'Complete all practice problems',
    icon: '🔢',
    requirement: 'Master all problems'
  },
  'note-taker': {
    id: 'note-taker',
    name: 'Note Taker',
    description: 'Create 10+ notes',
    icon: '📝',
    requirement: 'Create detailed notes'
  },
  'learning-leader': {
    id: 'learning-leader',
    name: 'Learning Leader',
    description: 'Master all learning outcomes',
    icon: '👑',
    requirement: 'Complete all outcomes'
  }
};

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('unavida_progress_advanced');
    return saved ? JSON.parse(saved) : {
      chapters: {},
      achievements: [],
      studyTime: {}, // chapter -> minutes
      lastAccessed: {},
      sessionStartTimes: {} // chapter -> timestamp
    };
  });

  useEffect(() => {
    localStorage.setItem('unavida_progress_advanced', JSON.stringify(progress));
  }, [progress]);

  // Initialize chapter progress
  const initializeChapter = (chapterId, totalSections = 3) => {
    if (!progress.chapters[chapterId]) {
      setProgress(prev => ({
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterId]: {
            id: chapterId,
            sectionsCompleted: [],
            quizAttempts: [],
            caseStudiesCompleted: [],
            flashcardsStudied: 0,
            practiceProblemsCompleted: [],
            learningOutcomesCompleted: [],
            totalSections,
            startedAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
          }
        }
      }));
    }
  };

  // Mark section as complete
  const markSectionComplete = (chapterId, sectionId) => {
    initializeChapter(chapterId);
    setProgress(prev => {
      const chapter = prev.chapters[chapterId];
      if (!chapter.sectionsCompleted.includes(sectionId)) {
        return {
          ...prev,
          chapters: {
            ...prev.chapters,
            [chapterId]: {
              ...chapter,
              sectionsCompleted: [...chapter.sectionsCompleted, sectionId],
              lastUpdated: new Date().toISOString()
            }
          }
        };
      }
      return prev;
    });
  };

  // Record quiz attempt
  const recordQuizAttempt = (chapterId, score, maxScore) => {
    initializeChapter(chapterId);
    setProgress(prev => {
      const chapter = prev.chapters[chapterId];
      return {
        ...prev,
        chapters: {
          ...prev.chapters,
          [chapterId]: {
            ...chapter,
            quizAttempts: [
              ...chapter.quizAttempts,
              {
                score,
                maxScore,
                percentage: Math.round((score / maxScore) * 100),
                timestamp: new Date().toISOString()
              }
            ],
            lastUpdated: new Date().toISOString()
          }
        }
      };
    });
  };

  // Mark case study as complete
  const markCaseStudyComplete = (chapterId, caseId) => {
    initializeChapter(chapterId);
    setProgress(prev => {
      const chapter = prev.chapters[chapterId];
      if (!chapter.caseStudiesCompleted.includes(caseId)) {
        return {
          ...prev,
          chapters: {
            ...prev.chapters,
            [chapterId]: {
              ...chapter,
              caseStudiesCompleted: [...chapter.caseStudiesCompleted, caseId],
              lastUpdated: new Date().toISOString()
            }
          }
        };
      }
      return prev;
    });
  };

  // Update flashcards studied
  const updateFlashcardsStudied = (chapterId, count) => {
    initializeChapter(chapterId);
    setProgress(prev => ({
      ...prev,
      chapters: {
        ...prev.chapters,
        [chapterId]: {
          ...prev.chapters[chapterId],
          flashcardsStudied: count,
          lastUpdated: new Date().toISOString()
        }
      }
    }));
  };

  // Mark practice problem as complete
  const markProblemComplete = (chapterId, problemId) => {
    initializeChapter(chapterId);
    setProgress(prev => {
      const chapter = prev.chapters[chapterId];
      if (!chapter.practiceProblemsCompleted.includes(problemId)) {
        return {
          ...prev,
          chapters: {
            ...prev.chapters,
            [chapterId]: {
              ...chapter,
              practiceProblemsCompleted: [...chapter.practiceProblemsCompleted, problemId],
              lastUpdated: new Date().toISOString()
            }
          }
        };
      }
      return prev;
    });
  };

  // Mark learning outcome as complete
  const markOutcomeComplete = (chapterId, outcomeId) => {
    initializeChapter(chapterId);
    setProgress(prev => {
      const chapter = prev.chapters[chapterId];
      if (!chapter.learningOutcomesCompleted.includes(outcomeId)) {
        return {
          ...prev,
          chapters: {
            ...prev.chapters,
            [chapterId]: {
              ...chapter,
              learningOutcomesCompleted: [...chapter.learningOutcomesCompleted, outcomeId],
              lastUpdated: new Date().toISOString()
            }
          }
        };
      }
      return prev;
    });
  };

  // Start study session
  const startStudySession = (chapterId) => {
    setProgress(prev => ({
      ...prev,
      sessionStartTimes: {
        ...prev.sessionStartTimes,
        [chapterId]: Date.now()
      }
    }));
  };

  // End study session and update study time
  const endStudySession = (chapterId) => {
    const startTime = progress.sessionStartTimes[chapterId];
    if (startTime) {
      const elapsedMinutes = Math.round((Date.now() - startTime) / 60000);
      setProgress(prev => {
        const currentTime = prev.studyTime[chapterId] || 0;
        return {
          ...prev,
          studyTime: {
            ...prev.studyTime,
            [chapterId]: currentTime + elapsedMinutes
          },
          sessionStartTimes: {
            ...prev.sessionStartTimes,
            [chapterId]: null
          },
          lastAccessed: {
            ...prev.lastAccessed,
            [chapterId]: new Date().toISOString()
          }
        };
      });
    }
  };

  // Get chapter progress percentage
  const getChapterProgressPercentage = (chapterId) => {
    const chapter = progress.chapters[chapterId];
    if (!chapter) return 0;

    const metrics = [
      (chapter.sectionsCompleted.length / (chapter.totalSections || 1)) * 0.25,
      (chapter.quizAttempts.length > 0 ? 0.25 : 0),
      (chapter.caseStudiesCompleted.length > 0 ? 0.25 : 0),
      (chapter.learningOutcomesCompleted.length > 0 ? 0.25 : 0)
    ];

    return Math.round(metrics.reduce((a, b) => a + b, 0) * 100);
  };

  // Get learning stats
  const getLearningStats = (chapterId) => {
    const chapter = progress.chapters[chapterId];
    if (!chapter) return null;

    const bestQuizScore = chapter.quizAttempts.length > 0
      ? Math.max(...chapter.quizAttempts.map(q => q.percentage))
      : 0;

    return {
      chaptersProgress: getChapterProgressPercentage(chapterId),
      timeInvested: progress.studyTime[chapterId] || 0,
      sectionsCompleted: chapter.sectionsCompleted.length,
      quizAttempts: chapter.quizAttempts.length,
      bestQuizScore,
      caseStudiesCompleted: chapter.caseStudiesCompleted.length,
      flashcardsStudied: chapter.flashcardsStudied,
      practiceProblemsCompleted: chapter.practiceProblemsCompleted.length,
      learningOutcomesCompleted: chapter.learningOutcomesCompleted.length
    };
  };

  // Check and award achievements
  const checkAchievements = (chapterId) => {
    const stats = getLearningStats(chapterId);
    if (!stats) return;

    const newAchievements = [];

    // Bookworm: Read entire chapter
    if (stats.sectionsCompleted === 3 && !progress.achievements.includes('bookworm')) {
      newAchievements.push('bookworm');
    }

    // Speed Reader: Complete chapter in <3 hours (180 minutes)
    if (stats.timeInvested < 180 && stats.chaptersProgress === 100 && !progress.achievements.includes('speed-reader')) {
      newAchievements.push('speed-reader');
    }

    // Quiz Master: Score 100%
    if (stats.bestQuizScore === 100 && !progress.achievements.includes('quiz-master')) {
      newAchievements.push('quiz-master');
    }

    // Case Expert: Complete all case studies
    if (stats.caseStudiesCompleted >= 5 && !progress.achievements.includes('case-expert')) {
      newAchievements.push('case-expert');
    }

    // Study Buddy: Complete all flashcards
    if (stats.flashcardsStudied >= 10 && !progress.achievements.includes('study-buddy')) {
      newAchievements.push('study-buddy');
    }

    // Problem Solver: Complete all practice problems
    if (stats.practiceProblemsCompleted >= 10 && !progress.achievements.includes('problem-solver')) {
      newAchievements.push('problem-solver');
    }

    // Learning Leader: Master all learning outcomes
    if (stats.learningOutcomesCompleted >= 9 && !progress.achievements.includes('learning-leader')) {
      newAchievements.push('learning-leader');
    }

    if (newAchievements.length > 0) {
      setProgress(prev => ({
        ...prev,
        achievements: [...new Set([...prev.achievements, ...newAchievements])]
      }));
    }

    return newAchievements;
  };

  // Get user achievements
  const getUserAchievements = () => {
    return progress.achievements.map(id => ACHIEVEMENTS[id]).filter(Boolean);
  };

  // Get recommended next steps
  const getRecommendedNextSteps = (chapterId) => {
    const stats = getLearningStats(chapterId);
    const recommendations = [];

    if (!stats) return recommendations;

    if (stats.sectionsCompleted < 3) {
      recommendations.push('Complete remaining chapter sections for better understanding');
    }

    if (stats.quizAttempts === 0) {
      recommendations.push('Take the chapter quiz to test your knowledge');
    } else if (stats.bestQuizScore < 80) {
      recommendations.push('Review and retake the quiz to improve your score');
    }

    if (stats.caseStudiesCompleted === 0) {
      recommendations.push('Work through clinical case studies for practical application');
    }

    if (stats.learningOutcomesCompleted < 5) {
      recommendations.push('Review learning outcomes to ensure mastery');
    }

    if (stats.practiceProblemsCompleted < 5) {
      recommendations.push('Complete more practice problems for dosage calculation skills');
    }

    if (stats.timeInvested < 60) {
      recommendations.push('Allocate more study time for deeper learning');
    }

    return recommendations;
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        ACHIEVEMENTS,
        // Section tracking
        initializeChapter,
        markSectionComplete,
        // Assessment tracking
        recordQuizAttempt,
        // Case studies
        markCaseStudyComplete,
        // Flashcards
        updateFlashcardsStudied,
        // Practice problems
        markProblemComplete,
        // Learning outcomes
        markOutcomeComplete,
        // Study session
        startStudySession,
        endStudySession,
        // Calculations
        getChapterProgressPercentage,
        getLearningStats,
        // Achievements
        checkAchievements,
        getUserAchievements,
        // Recommendations
        getRecommendedNextSteps
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
};
