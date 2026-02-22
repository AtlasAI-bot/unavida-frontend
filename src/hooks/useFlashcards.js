import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'flashcard_progress';

export const useFlashcards = (cards) => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState('normal'); // normal, multiple-choice, matching, timed-quiz
  const [starredCards, setStarredCards] = useState([]);
  const [cardStatus, setCardStatus] = useState({}); // { cardId: 'know-well' | 'need-practice' }
  const [filteredCards, setFilteredCards] = useState(cards);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isShuffle, setIsShuffle] = useState(false);
  const [studyStartTime, setStudyStartTime] = useState(null);
  const [stats, setStats] = useState({
    cardsStudied: 0,
    cardsMastered: 0,
    cardsNeedPractice: 0,
    totalTimeMinutes: 0
  });

  // Load progress from storage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { starred, status } = JSON.parse(saved);
      setStarredCards(starred || []);
      setCardStatus(status || {});
    }
  }, []);

  // Save progress to storage
  const saveProgress = useCallback(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      starred: starredCards,
      status: cardStatus
    }));
  }, [starredCards, cardStatus]);

  // Update stats when status changes
  useEffect(() => {
    const mastered = Object.values(cardStatus).filter(s => s === 'know-well').length;
    const needPractice = Object.values(cardStatus).filter(s => s === 'need-practice').length;
    
    setStats(prev => ({
      ...prev,
      cardsMastered: mastered,
      cardsNeedPractice: needPractice,
      cardsStudied: Object.keys(cardStatus).length
    }));
  }, [cardStatus]);

  // Apply filters and search
  useEffect(() => {
    let result = [...cards];

    // Filter by category
    if (selectedCategory !== 'all') {
      result = result.filter(card => card.category === selectedCategory);
    }

    // Search by keyword
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(card =>
        card.question.toLowerCase().includes(term) ||
        card.answer.toLowerCase().includes(term)
      );
    }

    // Shuffle if enabled
    if (isShuffle) {
      result = result.sort(() => Math.random() - 0.5);
    }

    setFilteredCards(result);
    setCurrentCard(0);
    setIsFlipped(false);
  }, [cards, selectedCategory, searchTerm, isShuffle]);

  const toggleStar = useCallback((cardId) => {
    setStarredCards(prev => {
      const updated = prev.includes(cardId)
        ? prev.filter(id => id !== cardId)
        : [...prev, cardId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        starred: updated,
        status: cardStatus
      }));
      return updated;
    });
  }, [cardStatus]);

  const markCardStatus = useCallback((cardId, status) => {
    setCardStatus(prev => ({
      ...prev,
      [cardId]: status
    }));
    saveProgress();
  }, [saveProgress]);

  const navigate = useCallback((direction) => {
    setCurrentCard(prevCard => {
      const newCard = direction === 'next' ? prevCard + 1 : prevCard - 1;
      // Ensure we don't go out of bounds
      if (newCard < 0 || newCard >= filteredCards.length) {
        return prevCard;
      }
      return newCard;
    });
    setIsFlipped(false);
  }, [filteredCards.length]);

  const startStudySession = useCallback(() => {
    setStudyStartTime(Date.now());
  }, []);

  const endStudySession = useCallback(() => {
    if (studyStartTime) {
      const duration = (Date.now() - studyStartTime) / 60000; // convert to minutes
      setStats(prev => ({
        ...prev,
        totalTimeMinutes: prev.totalTimeMinutes + duration
      }));
      setStudyStartTime(null);
    }
  }, [studyStartTime]);

  const getCategories = useCallback(() => {
    const categories = new Set(cards.map(card => card.category || 'general'));
    return Array.from(categories);
  }, [cards]);

  const getStarredOnly = useCallback(() => {
    return filteredCards.filter(card => starredCards.includes(card.id));
  }, [filteredCards, starredCards]);

  const getNeedPracticeOnly = useCallback(() => {
    return filteredCards.filter(card => cardStatus[card.id] === 'need-practice');
  }, [filteredCards, cardStatus]);

  return {
    // UI State
    currentCard,
    setCurrentCard,
    isFlipped,
    setIsFlipped,
    filteredCards,
    
    // Study Modes
    studyMode,
    setStudyMode,
    
    // Filtering & Search
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    isShuffle,
    setIsShuffle,
    getCategories,
    
    // Card Management
    starredCards,
    toggleStar,
    cardStatus,
    markCardStatus,
    
    // Navigation
    navigate,
    
    // Sessions
    startStudySession,
    endStudySession,
    
    // Stats & Data
    stats,
    getStarredOnly,
    getNeedPracticeOnly,
    saveProgress
  };
};
