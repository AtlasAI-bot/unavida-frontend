import React, { useState } from 'react';
import { X, Bookmark, BookmarkCheck, Highlighter, MessageSquare, Zap, BookOpen } from 'lucide-react';
import { useStudentProgress } from '../context/StudentProgressContext';

const ChapterTools = ({ 
  chapterId, 
  sectionId, 
  sectionTitle, 
  isOpen, 
  onClose,
  chapter,
  bookmarks = []
}) => {
  const { addBookmark, removeBookmark, addNote, getNotes } = useStudentProgress();
  const [activeTab, setActiveTab] = useState('notes');
  const [noteContent, setNoteContent] = useState('');
  const [highlightColor, setHighlightColor] = useState('yellow');
  const [highlights, setHighlights] = useState([]);

  const sectionBookmarks = bookmarks.filter(b => b.sectionId === sectionId);
  const sectionNotes = getNotes(chapterId, sectionId) || [];

  const handleAddBookmark = () => {
    addBookmark(chapterId, sectionId, sectionTitle, 0);
  };

  const handleSaveNote = () => {
    if (noteContent.trim()) {
      addNote(chapterId, sectionId, noteContent);
      setNoteContent('');
    }
  };

  const handleAddHighlight = () => {
    if (noteContent.trim()) {
      setHighlights([...highlights, {
        id: Date.now(),
        text: noteContent,
        color: highlightColor,
        timestamp: new Date().toLocaleString()
      }]);
      setNoteContent('');
    }
  };

  const removeHighlight = (id) => {
    setHighlights(highlights.filter(h => h.id !== id));
  };

  const learningOutcomes = chapter.learningOutcomes.chapterLevel;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static top-0 right-0 h-screen w-96 bg-white border-l border-gray-200 shadow-lg transform transition-transform duration-300 z-40 lg:z-0 overflow-hidden flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-50 to-purple-50 border-b border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Study Tools</h2>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-600 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-xs text-gray-600">
            <span className="font-semibold">{sectionTitle}</span>
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'notes'
                ? 'border-b-2 border-teal-500 text-teal-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare size={16} /> Notes
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'bookmarks'
                ? 'border-b-2 border-teal-500 text-teal-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Bookmark size={16} /> Bookmarks
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'highlights'
                ? 'border-b-2 border-teal-500 text-teal-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Highlighter size={16} /> Highlights
          </button>
          <button
            onClick={() => setActiveTab('outcomes')}
            className={`flex-1 py-3 px-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${
              activeTab === 'outcomes'
                ? 'border-b-2 border-teal-500 text-teal-600 bg-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Zap size={16} /> Goals
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Add a Note
                </label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Write your thoughts, questions, or important points..."
                  className="w-full h-24 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none resize-none"
                />
                <button
                  onClick={handleSaveNote}
                  className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all font-semibold text-sm"
                >
                  Save Note
                </button>
              </div>

              {/* Saved Notes */}
              {sectionNotes.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Your Notes ({sectionNotes.length})</h4>
                  <div className="space-y-3">
                    {sectionNotes.map((note) => (
                      <div key={note.id} className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-gray-800">{note.content}</p>
                        <p className="text-xs text-gray-500 mt-2">{note.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Bookmarks Tab */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              <button
                onClick={handleAddBookmark}
                className="w-full px-4 py-3 bg-purple-100 text-purple-900 rounded-lg hover:bg-purple-200 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Bookmark size={18} /> Bookmark This Section
              </button>

              {sectionBookmarks.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Bookmarks ({sectionBookmarks.length})</h4>
                  <div className="space-y-2">
                    {sectionBookmarks.map((bookmark) => (
                      <div key={bookmark.id} className="p-3 bg-purple-50 border border-purple-200 rounded-lg group">
                        <p className="text-sm font-semibold text-purple-900">{bookmark.text}</p>
                        <button
                          onClick={() => removeBookmark(bookmark.id)}
                          className="text-xs text-purple-600 hover:text-purple-900 font-semibold mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Remove Bookmark
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {sectionBookmarks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Bookmark size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No bookmarks yet. Create one to save important sections.</p>
                </div>
              )}
            </div>
          )}

          {/* Highlights Tab */}
          {activeTab === 'highlights' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Highlight Important Text
                </label>
                <div className="flex gap-2 mb-3">
                  {['yellow', 'green', 'blue', 'pink', 'orange'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setHighlightColor(color)}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        highlightColor === color ? 'border-gray-900' : 'border-gray-300'
                      } ${
                        color === 'yellow' ? 'bg-yellow-300' :
                        color === 'green' ? 'bg-green-300' :
                        color === 'blue' ? 'bg-blue-300' :
                        color === 'pink' ? 'bg-pink-300' :
                        'bg-orange-300'
                      }`}
                    />
                  ))}
                </div>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Paste or type the text you want to highlight..."
                  className="w-full h-20 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none resize-none"
                />
                <button
                  onClick={handleAddHighlight}
                  className="w-full mt-3 px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg hover:from-teal-600 hover:to-teal-700 transition-all font-semibold text-sm"
                >
                  Add Highlight
                </button>
              </div>

              {/* Saved Highlights */}
              {highlights.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Highlights ({highlights.length})</h4>
                  <div className="space-y-3">
                    {highlights.map((highlight) => (
                      <div
                        key={highlight.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          highlight.color === 'yellow' ? 'bg-yellow-50 border-yellow-300' :
                          highlight.color === 'green' ? 'bg-green-50 border-green-300' :
                          highlight.color === 'blue' ? 'bg-blue-50 border-blue-300' :
                          highlight.color === 'pink' ? 'bg-pink-50 border-pink-300' :
                          'bg-orange-50 border-orange-300'
                        }`}
                      >
                        <p className="text-sm text-gray-800">{highlight.text}</p>
                        <div className="flex justify-between items-center mt-2">
                          <p className="text-xs text-gray-500">{highlight.timestamp}</p>
                          <button
                            onClick={() => removeHighlight(highlight.id)}
                            className="text-xs text-gray-600 hover:text-gray-900 font-semibold"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Learning Outcomes Tab */}
          {activeTab === 'outcomes' && (
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900 mb-3">Chapter Learning Outcomes</h4>
              <div className="space-y-3">
                {learningOutcomes.map((outcome) => (
                  <div key={outcome.id} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 rounded accent-blue-600 cursor-pointer"
                      />
                      <div>
                        <p className="text-sm text-gray-900">{outcome.outcome}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          <span className="font-semibold capitalize">{outcome.bloomLevel}</span> Level
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Terms */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                  <BookOpen size={16} /> Key Vocabulary
                </h4>
                <div className="space-y-2">
                  {chapter.keyTermsAndDefinitions && chapter.keyTermsAndDefinitions.slice(0, 5).map((term) => (
                    <div key={term.id} className="text-sm">
                      <p className="font-semibold text-purple-900">{term.term}</p>
                      <p className="text-xs text-purple-700 mt-1">{term.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChapterTools;
