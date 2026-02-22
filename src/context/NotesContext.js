import React, { createContext, useContext, useEffect, useState } from 'react';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('unavida_notes');
    return saved ? JSON.parse(saved) : {
      notes: [],
      bookmarks: [],
      highlights: []
    };
  });

  useEffect(() => {
    localStorage.setItem('unavida_notes', JSON.stringify(notes));
  }, [notes]);

  // Add a new note
  const addNote = (chapterId, sectionId, content, position = 0) => {
    const newNote = {
      id: `note-${Date.now()}`,
      chapterId,
      sectionId,
      content,
      position,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNotes(prev => ({
      ...prev,
      notes: [...prev.notes, newNote]
    }));

    return newNote.id;
  };

  // Update a note
  const updateNote = (noteId, content) => {
    setNotes(prev => ({
      ...prev,
      notes: prev.notes.map(note =>
        note.id === noteId
          ? { ...note, content, updatedAt: new Date().toISOString() }
          : note
      )
    }));
  };

  // Delete a note
  const deleteNote = (noteId) => {
    setNotes(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== noteId)
    }));
  };

  // Get notes for a specific chapter
  const getNotesByChapter = (chapterId) => {
    return notes.notes.filter(note => note.chapterId === chapterId);
  };

  // Get notes for a specific section
  const getNotesBySection = (chapterId, sectionId) => {
    return notes.notes.filter(
      note => note.chapterId === chapterId && note.sectionId === sectionId
    );
  };

  // Add a bookmark
  const addBookmark = (chapterId, sectionId, title) => {
    const newBookmark = {
      id: `bookmark-${Date.now()}`,
      chapterId,
      sectionId,
      title,
      createdAt: new Date().toISOString()
    };

    setNotes(prev => ({
      ...prev,
      bookmarks: [...prev.bookmarks, newBookmark]
    }));

    return newBookmark.id;
  };

  // Remove a bookmark
  const removeBookmark = (bookmarkId) => {
    setNotes(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(b => b.id !== bookmarkId)
    }));
  };

  // Check if section is bookmarked
  const isBookmarked = (chapterId, sectionId) => {
    return notes.bookmarks.some(
      b => b.chapterId === chapterId && b.sectionId === sectionId
    );
  };

  // Get bookmarks for a chapter
  const getBookmarksByChapter = (chapterId) => {
    return notes.bookmarks.filter(b => b.chapterId === chapterId);
  };

  // Add a highlight
  const addHighlight = (chapterId, sectionId, text, color = 'yellow', position = 0) => {
    const newHighlight = {
      id: `highlight-${Date.now()}`,
      chapterId,
      sectionId,
      text,
      color, // yellow, green, blue, red, pink
      position,
      createdAt: new Date().toISOString()
    };

    setNotes(prev => ({
      ...prev,
      highlights: [...prev.highlights, newHighlight]
    }));

    return newHighlight.id;
  };

  // Remove a highlight
  const removeHighlight = (highlightId) => {
    setNotes(prev => ({
      ...prev,
      highlights: prev.highlights.filter(h => h.id !== highlightId)
    }));
  };

  // Get highlights for a chapter
  const getHighlightsByChapter = (chapterId) => {
    return notes.highlights.filter(h => h.chapterId === chapterId);
  };

  // Get highlights for a section
  const getHighlightsBySection = (chapterId, sectionId) => {
    return notes.highlights.filter(
      h => h.chapterId === chapterId && h.sectionId === sectionId
    );
  };

  // Create summary from highlights
  const createHighlightSummary = (chapterId) => {
    const highlights = getHighlightsByChapter(chapterId);
    return highlights.map(h => `[${h.color.toUpperCase()}] ${h.text}`).join('\n');
  };

  // Export notes to JSON
  const exportNotes = (chapterId) => {
    const chapterNotes = getNotesByChapter(chapterId);
    const chapterBookmarks = getBookmarksByChapter(chapterId);
    const chapterHighlights = getHighlightsByChapter(chapterId);

    return {
      chapter: `Chapter ${chapterId}`,
      exportDate: new Date().toISOString(),
      notes: chapterNotes,
      bookmarks: chapterBookmarks,
      highlights: chapterHighlights,
      summary: createHighlightSummary(chapterId)
    };
  };

  // Clear all notes for a chapter
  const clearChapterNotes = (chapterId) => {
    setNotes(prev => ({
      ...prev,
      notes: prev.notes.filter(n => n.chapterId !== chapterId),
      bookmarks: prev.bookmarks.filter(b => b.chapterId !== chapterId),
      highlights: prev.highlights.filter(h => h.chapterId !== chapterId)
    }));
  };

  return (
    <NotesContext.Provider
      value={{
        notes,
        // Note operations
        addNote,
        updateNote,
        deleteNote,
        getNotesByChapter,
        getNotesBySection,
        // Bookmark operations
        addBookmark,
        removeBookmark,
        isBookmarked,
        getBookmarksByChapter,
        // Highlight operations
        addHighlight,
        removeHighlight,
        getHighlightsByChapter,
        getHighlightsBySection,
        createHighlightSummary,
        // Utility operations
        exportNotes,
        clearChapterNotes
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within NotesProvider');
  }
  return context;
};
