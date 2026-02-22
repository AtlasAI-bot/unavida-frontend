import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing chapter reading progress
 * Tracks: current section, reading time, completion %, notes, bookmarks
 * Persists to localStorage and can sync with backend
 */
export const useChapterProgress = (chapterId) => {
  const [progress, setProgress] = useState({
    chapterId,
    currentSection: 0,
    readingProgress: 0,
    timeSpent: 0,
    notes: [],
    bookmarks: [],
    highlights: [],
    completedSections: [],
    lastRead: new Date().toISOString(),
  });

  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState(null);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`chapter-progress-${chapterId}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setProgress(prev => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      console.error('Error loading progress:', err);
      setError('Failed to load progress');
    }
  }, [chapterId]);

  // Save progress to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`chapter-progress-${chapterId}`, JSON.stringify({
        ...progress,
        lastRead: new Date().toISOString()
      }));
      setIsSaved(true);
    } catch (err) {
      console.error('Error saving progress:', err);
      setError('Failed to save progress');
    }
  }, [progress, chapterId]);

  // Update current section
  const updateSection = useCallback((sectionIndex) => {
    setProgress(prev => ({
      ...prev,
      currentSection: sectionIndex,
      readingProgress: Math.round((sectionIndex / 12) * 100), // Assuming 12 sections
    }));
  }, []);

  // Update reading time
  const updateTimeSpent = useCallback((seconds) => {
    setProgress(prev => ({
      ...prev,
      timeSpent: seconds,
    }));
  }, []);

  // Add note
  const addNote = useCallback((sectionId, content) => {
    setProgress(prev => ({
      ...prev,
      notes: [
        ...prev.notes,
        {
          id: Date.now(),
          sectionId,
          content,
          timestamp: new Date().toLocaleString(),
        }
      ]
    }));
  }, []);

  // Remove note
  const removeNote = useCallback((noteId) => {
    setProgress(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId)
    }));
  }, []);

  // Get notes for section
  const getNotes = useCallback((sectionId) => {
    return progress.notes.filter(note => note.sectionId === sectionId);
  }, [progress.notes]);

  // Add bookmark
  const addBookmark = useCallback((sectionId, text) => {
    setProgress(prev => ({
      ...prev,
      bookmarks: [
        ...prev.bookmarks,
        {
          id: Date.now(),
          sectionId,
          text,
          timestamp: new Date().toLocaleString(),
        }
      ]
    }));
  }, []);

  // Remove bookmark
  const removeBookmark = useCallback((bookmarkId) => {
    setProgress(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(b => b.id !== bookmarkId)
    }));
  }, []);

  // Add highlight
  const addHighlight = useCallback((text, color = 'yellow') => {
    setProgress(prev => ({
      ...prev,
      highlights: [
        ...prev.highlights,
        {
          id: Date.now(),
          text,
          color,
          timestamp: new Date().toLocaleString(),
        }
      ]
    }));
  }, []);

  // Remove highlight
  const removeHighlight = useCallback((highlightId) => {
    setProgress(prev => ({
      ...prev,
      highlights: prev.highlights.filter(h => h.id !== highlightId)
    }));
  }, []);

  // Mark section complete
  const markSectionComplete = useCallback((sectionId) => {
    setProgress(prev => ({
      ...prev,
      completedSections: prev.completedSections.includes(sectionId)
        ? prev.completedSections
        : [...prev.completedSections, sectionId]
    }));
  }, []);

  // Get completion percentage
  const getCompletion = useCallback((totalSections = 12) => {
    return Math.round((progress.currentSection / totalSections) * 100);
  }, [progress.currentSection]);

  // Get reading stats
  const getStats = useCallback(() => {
    const hours = Math.floor(progress.timeSpent / 3600);
    const minutes = Math.floor((progress.timeSpent % 3600) / 60);
    const seconds = progress.timeSpent % 60;

    return {
      timeSpent: progress.timeSpent,
      timeFormatted: hours > 0 
        ? `${hours}h ${minutes}m`
        : minutes > 0
        ? `${minutes}m ${seconds}s`
        : `${seconds}s`,
      currentSection: progress.currentSection,
      completionPercent: getCompletion(),
      notesCount: progress.notes.length,
      bookmarksCount: progress.bookmarks.length,
      highlightsCount: progress.highlights.length,
      completedSectionsCount: progress.completedSections.length,
      lastRead: progress.lastRead,
    };
  }, [progress.timeSpent, progress.currentSection, progress.notes.length, progress.bookmarks.length, progress.highlights.length, progress.completedSections.length, progress.lastRead, getCompletion]);

  // Reset progress
  const resetProgress = useCallback(() => {
    setProgress({
      chapterId,
      currentSection: 0,
      readingProgress: 0,
      timeSpent: 0,
      notes: [],
      bookmarks: [],
      highlights: [],
      completedSections: [],
      lastRead: new Date().toISOString(),
    });
    localStorage.removeItem(`chapter-progress-${chapterId}`);
  }, [chapterId]);

  // Sync to backend (placeholder for API call)
  const syncToBackend = useCallback(async () => {
    try {
      const response = await fetch(`/api/chapters/${chapterId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(progress)
      });

      if (!response.ok) {
        throw new Error('Failed to sync progress');
      }

      setIsSaved(true);
      return response.json();
    } catch (err) {
      console.error('Error syncing to backend:', err);
      setError('Failed to sync progress');
      throw err;
    }
  }, [chapterId, progress]);

  return {
    progress,
    isSaved,
    error,
    updateSection,
    updateTimeSpent,
    addNote,
    removeNote,
    getNotes,
    addBookmark,
    removeBookmark,
    addHighlight,
    removeHighlight,
    markSectionComplete,
    getCompletion,
    getStats,
    resetProgress,
    syncToBackend,
  };
};

export default useChapterProgress;
