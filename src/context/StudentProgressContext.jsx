import React, { createContext, useContext, useEffect, useState } from 'react';

const StudentProgressContext = createContext();

export const StudentProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState(() => {
    const saved = localStorage.getItem('unavida_progress');
    return saved ? JSON.parse(saved) : {
      bookmarks: [],
      notes: {},
      readingPosition: {},
      completedSections: [],
      lastAccessed: {}
    };
  });

  useEffect(() => {
    localStorage.setItem('unavida_progress', JSON.stringify(progress));
  }, [progress]);

  const addBookmark = (chapterId, sectionId, text, position) => {
    setProgress(prev => ({
      ...prev,
      bookmarks: [
        ...prev.bookmarks,
        {
          id: `${chapterId}-${sectionId}-${Date.now()}`,
          chapterId,
          sectionId,
          text,
          position,
          createdAt: new Date().toISOString()
        }
      ]
    }));
  };

  const removeBookmark = (bookmarkId) => {
    setProgress(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(b => b.id !== bookmarkId)
    }));
  };

  const addNote = (chapterId, sectionId, content) => {
    const key = `${chapterId}-${sectionId}`;
    setProgress(prev => ({
      ...prev,
      notes: {
        ...prev.notes,
        [key]: content
      }
    }));
  };

  const getNote = (chapterId, sectionId) => {
    return progress.notes[`${chapterId}-${sectionId}`] || '';
  };

  const updateReadingPosition = (chapterId, position) => {
    setProgress(prev => ({
      ...prev,
      readingPosition: {
        ...prev.readingPosition,
        [chapterId]: position
      },
      lastAccessed: {
        ...prev.lastAccessed,
        [chapterId]: new Date().toISOString()
      }
    }));
  };

  const markSectionComplete = (chapterId, sectionId) => {
    const sectionKey = `${chapterId}-${sectionId}`;
    setProgress(prev => {
      if (prev.completedSections.includes(sectionKey)) {
        return prev;
      }
      return {
        ...prev,
        completedSections: [...prev.completedSections, sectionKey]
      };
    });
  };

  const getChapterProgress = (chapterId, totalSections) => {
    const completed = progress.completedSections.filter(
      s => s.startsWith(`${chapterId}-`)
    ).length;
    return totalSections > 0 ? Math.round((completed / totalSections) * 100) : 0;
  };

  const updateProgress = (chapterId, progressData) => {
    setProgress(prev => ({
      ...prev,
      readingPosition: {
        ...prev.readingPosition,
        [chapterId]: progressData.currentSection || 0
      },
      lastAccessed: {
        ...prev.lastAccessed,
        [chapterId]: new Date().toISOString()
      }
    }));
  };

  const getNotes = (chapterId, sectionId) => {
    const key = `${chapterId}-${sectionId}`;
    const note = progress.notes[key];
    if (typeof note === 'string') {
      return [{ id: key, content: note }];
    }
    return Array.isArray(note) ? note : [];
  };

  return (
    <StudentProgressContext.Provider
      value={{
        progress,
        addBookmark,
        removeBookmark,
        addNote,
        getNote,
        getNotes,
        updateReadingPosition,
        updateProgress,
        markSectionComplete,
        getChapterProgress
      }}
    >
      {children}
    </StudentProgressContext.Provider>
  );
};

export const useStudentProgress = () => {
  const context = useContext(StudentProgressContext);
  if (!context) {
    throw new Error('useStudentProgress must be used within StudentProgressProvider');
  }
  return context;
};
