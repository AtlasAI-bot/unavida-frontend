import { useNotes as useNotesContext } from '../context/NotesContext';

/**
 * Custom hook for managing notes, bookmarks, and highlights
 * Provides a cleaner API for note-related operations
 */
export const useNotes = () => {
  const context = useNotesContext();

  return {
    // Notes management
    addNote: context.addNote,
    updateNote: context.updateNote,
    deleteNote: context.deleteNote,
    getNotes: (chapterId, sectionId = null) => {
      if (sectionId) {
        return context.getNotesBySection(chapterId, sectionId);
      }
      return context.getNotesByChapter(chapterId);
    },

    // Bookmarks management
    addBookmark: context.addBookmark,
    removeBookmark: context.removeBookmark,
    toggleBookmark: (chapterId, sectionId, title) => {
      if (context.isBookmarked(chapterId, sectionId)) {
        const bookmark = context.notes.bookmarks.find(
          b => b.chapterId === chapterId && b.sectionId === sectionId
        );
        if (bookmark) {
          context.removeBookmark(bookmark.id);
        }
      } else {
        context.addBookmark(chapterId, sectionId, title);
      }
    },
    isBookmarked: context.isBookmarked,
    getBookmarks: context.getBookmarksByChapter,

    // Highlights management
    addHighlight: context.addHighlight,
    removeHighlight: context.removeHighlight,
    getHighlights: (chapterId, sectionId = null) => {
      if (sectionId) {
        return context.getHighlightsBySection(chapterId, sectionId);
      }
      return context.getHighlightsByChapter(chapterId);
    },

    // Export/Summary
    exportNotes: context.exportNotes,
    getHighlightSummary: context.createHighlightSummary,
    clearChapterNotes: context.clearChapterNotes
  };
};

export default useNotes;
