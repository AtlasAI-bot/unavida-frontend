import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Star, Check, X, Search, Filter } from 'lucide-react';
import { useFlashcards } from '../hooks/useFlashcards';

export const Flashcards = ({ chapterId }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch flashcards from API
  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.REACT_APP_API_URL || 'https://unavida-backend-production.up.railway.app/api';
        const chapterToFetch = chapterId || 'ch1_intro_to_pharmacology';
        const url = `${apiUrl}/chapters/${chapterToFetch}/flashcards`;
        
        console.log('Fetching flashcards from:', url);
        
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Failed to fetch flashcards: ${response.status} ${response.statusText}`);
        
        const data = await response.json();
        console.log('Loaded flashcards:', data.count, 'cards');
        
        if (!data.cards || !Array.isArray(data.cards)) {
          throw new Error('API returned invalid card data');
        }
        
        setCards(data.cards);
        setError(null);
      } catch (err) {
        console.error('Error fetching flashcards:', err);
        setError(err.message);
        setCards([]); // Don't show fallback data - show error instead
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [chapterId]);

  // Initialize hook with fetched cards
  const {
    currentCard,
    setCurrentCard,
    isFlipped,
    setIsFlipped,
    filteredCards,
    studyMode,
    setStudyMode,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isShuffle,
    setIsShuffle,
    getCategories,
    starredCards,
    toggleStar,
    cardStatus,
    markCardStatus,
    navigate,
    stats,
    startStudySession,
    endStudySession
  } = useFlashcards(cards);

  // Keyboard shortcuts - memoize handler to prevent excessive re-renders
  const handleKeyDown = useCallback((e) => {
    if (e.code === 'ArrowRight') {
      navigate('next');
    } else if (e.code === 'ArrowLeft') {
      navigate('prev');
    } else if (e.code === 'Space') {
      e.preventDefault();
      setIsFlipped(!isFlipped);
    }
  }, [navigate, isFlipped, setIsFlipped]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Start/end study session
  useEffect(() => {
    startStudySession();
    return () => endStudySession();
  }, [startStudySession, endStudySession]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-cyan-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-cyan-50 to-purple-50">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Flashcards</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-cyan-50 to-purple-50">
        <div className="text-center max-w-md">
          <div className="text-amber-500 text-5xl mb-4">📭</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Flashcards Found</h2>
          <p className="text-gray-600">No flashcards available for this chapter.</p>
        </div>
      </div>
    );
  }

  const card = filteredCards[currentCard];
  const isFavorite = card && starredCards.includes(card.id);
  const cardProgress = cardStatus[card?.id] || null;

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 h-full flex flex-col bg-gradient-to-br from-cyan-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Flashcard Study</h2>
        <p className="text-gray-600">Master all {filteredCards.length} cards • Study Mode: <span className="font-semibold text-cyan-700">{studyMode}</span></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-white border-2 border-cyan-200 rounded-lg p-3 md:p-4 text-center shadow-sm hover:shadow-md transition-shadow">
          <p className="text-gray-600 text-xs md:text-sm font-semibold">Progress</p>
          <p className="text-xl md:text-2xl font-bold text-cyan-600">
            {currentCard + 1}/{filteredCards.length}
          </p>
        </div>
        <div className="bg-white border-2 border-emerald-200 rounded-lg p-3 md:p-4 text-center shadow-sm hover:shadow-md transition-shadow">
          <p className="text-gray-600 text-xs md:text-sm font-semibold">Mastered</p>
          <p className="text-xl md:text-2xl font-bold text-emerald-600">{stats.cardsMastered}</p>
        </div>
        <div className="bg-white border-2 border-amber-200 rounded-lg p-3 md:p-4 text-center shadow-sm hover:shadow-md transition-shadow">
          <p className="text-gray-600 text-xs md:text-sm font-semibold">Need Practice</p>
          <p className="text-xl md:text-2xl font-bold text-amber-600">{stats.cardsNeedPractice}</p>
        </div>
        <div className="bg-white border-2 border-purple-200 rounded-lg p-3 md:p-4 text-center shadow-sm hover:shadow-md transition-shadow">
          <p className="text-gray-600 text-xs md:text-sm font-semibold">% Complete</p>
          <p className="text-xl md:text-2xl font-bold text-purple-600">
            {filteredCards.length > 0 ? Math.round(((currentCard + 1) / filteredCards.length) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-sm">
          <div
            className="bg-gradient-to-r from-cyan-500 to-purple-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${filteredCards.length > 0 ? ((currentCard + 1) / filteredCards.length) * 100 : 0}%` }}
          ></div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="mb-6 flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 text-cyan-600" size={18} />
          <input
            type="text"
            placeholder="Search flashcards..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border-2 border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-colors shadow-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-cyan-500 hover:bg-cyan-50 transition-all duration-200 font-medium shadow-sm active:scale-95"
        >
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mb-6 p-4 bg-white rounded-lg border-2 border-cyan-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded text-gray-800 font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
              >
                <option value="all">All Categories</option>
                {getCategories().map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Study Mode */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Study Mode</label>
              <select
                value={studyMode}
                onChange={(e) => setStudyMode(e.target.value)}
                className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded text-gray-800 font-medium focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 transition-colors"
              >
                <option value="normal">Normal Flip</option>
                <option value="multiple-choice">Multiple Choice</option>
                <option value="matching">Matching</option>
                <option value="timed-quiz">Timed Quiz</option>
              </select>
            </div>

            {/* Shuffle & Starred */}
            <div className="flex items-end gap-2">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`flex-1 px-3 py-2 rounded font-semibold transition-all duration-200 active:scale-95 ${
                  isShuffle
                    ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {isShuffle ? '🔀 Shuffle ON' : '🔀 Shuffle OFF'}
              </button>
              <button
                onClick={() => {
                  if (selectedCategory === 'starred') {
                    setSelectedCategory('all');
                  } else {
                    // Filter to starred
                    const starred = getStarredOnly();
                    if (starred.length > 0) {
                      // Create temporary category for starred
                      setSelectedCategory('starred');
                    }
                  }
                }}
                className={`flex-1 px-3 py-2 rounded font-semibold transition-all duration-200 active:scale-95 ${
                  starredCards.length > 0
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md hover:shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                }`}
              >
                ⭐ {starredCards.length}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Flashcard */}
      <div className="flex-1 mb-6">
        {card ? (
          <div
            className="relative w-full h-full min-h-80 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* Question Side */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-cyan-400 via-cyan-300 to-teal-400 rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl ${
                isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'
              }`}
            >
              <div className="text-center flex flex-col h-full justify-center">
                <p className="text-white text-sm uppercase tracking-widest mb-4 font-bold drop-shadow">
                  Question {currentCard + 1} of {filteredCards.length}
                </p>
                <p className="text-2xl md:text-4xl font-bold text-white mb-4 break-words drop-shadow-lg">
                  {card.question}
                </p>
                {card.category && (
                  <p className="text-white text-sm mt-4 italic drop-shadow font-medium">
                    Category: <span className="font-bold">{card.category}</span>
                  </p>
                )}
                <p className="text-white text-sm mt-8 opacity-90 drop-shadow">
                  ← Click to reveal answer →
                </p>
              </div>
            </div>

            {/* Answer Side */}
            <div
              className={`absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-400 via-purple-300 to-pink-400 rounded-2xl shadow-2xl transition-all duration-500 hover:shadow-3xl ${
                isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div className="text-center flex flex-col h-full justify-center">
                <p className="text-white text-sm uppercase tracking-widest mb-4 font-bold drop-shadow">
                  Answer
                </p>
                <p className="text-2xl md:text-3xl font-bold text-white mb-4 break-words drop-shadow-lg">
                  {card.answer}
                </p>
                <p className="text-white text-sm mt-8 opacity-90 drop-shadow">
                  ← Click to flip back →
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-white rounded-xl border-2 border-gray-200 shadow-sm">
            <p className="text-gray-600 font-medium">No flashcards match your filters</p>
          </div>
        )}
      </div>

      {/* Card Actions */}
      {card && (
        <div className="mb-6 flex gap-2 flex-wrap justify-center">
          <button
            onClick={() => toggleStar(card.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 ${
              isFavorite
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-md hover:shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50'
            }`}
          >
            <Star size={18} fill={isFavorite ? 'currentColor' : 'none'} />
            {isFavorite ? 'Starred' : 'Star'}
          </button>

          <button
            onClick={() => markCardStatus(card.id, 'know-well')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 ${
              cardProgress === 'know-well'
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-md hover:shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
            }`}
          >
            <Check size={18} /> I Know This
          </button>

          <button
            onClick={() => markCardStatus(card.id, 'need-practice')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 active:scale-95 ${
              cardProgress === 'need-practice'
                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg'
                : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-red-300 hover:bg-red-50'
            }`}
          >
            <X size={18} /> Need Practice
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <button
          onClick={() => navigate('prev')}
          disabled={currentCard === 0}
          className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-lg font-semibold hover:border-cyan-400 hover:bg-cyan-50 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white transition-all duration-200 active:scale-95 text-sm md:text-base shadow-sm"
        >
          <ChevronLeft size={20} /> Previous
        </button>

        <button
          onClick={() => {
            setCurrentCard(0);
            setIsFlipped(false);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-lg font-semibold hover:border-purple-400 hover:bg-purple-50 transition-all duration-200 active:scale-95 text-sm md:text-base shadow-sm"
        >
          <RotateCw size={20} /> Reset
        </button>

        <button
          onClick={() => navigate('next')}
          disabled={currentCard === filteredCards.length - 1}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-300 transition-all duration-200 active:scale-95 text-sm md:text-base shadow-md hover:shadow-lg"
        >
          Next <ChevronRight size={20} />
        </button>
      </div>

      {/* Tips */}
      <div className="mt-6 p-4 bg-white rounded-lg border-2 border-cyan-200 shadow-sm">
        <p className="text-sm text-gray-700">
          💡 <strong className="text-cyan-700">Keyboard Shortcuts:</strong> <span className="text-gray-600">Left/Right arrows to navigate • Space to flip • Use filters to focus your study</span>
        </p>
      </div>
    </div>
  );
};

export default Flashcards;
