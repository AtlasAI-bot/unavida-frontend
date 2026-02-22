import { useState, useCallback, useEffect } from 'react';

const QUIZ_STORAGE_KEY = 'quiz_progress';

export const useQuiz = (questions) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizMode, setQuizMode] = useState('practice'); // practice, timed, review
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [skippedQuestions, setSkippedQuestions] = useState([]);

  // Timer effect for timed mode
  useEffect(() => {
    if (!isTimerActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimerActive(false);
          completeQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerActive, timeRemaining]);

  // Load previous quiz results
  useEffect(() => {
    const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setQuizResults(data);
      } catch (e) {
        console.error('Error loading quiz results:', e);
      }
    }
  }, []);

  const handleSelectAnswer = useCallback((optionIndex) => {
    if (!answered) {
      setSelectedAnswer(optionIndex);
      setAnswered(true);

      const question = questions[currentQuestion];
      const isCorrect = optionIndex === question.correctAnswer;
      
      if (isCorrect) {
        setScore(score + 1);
      }

      setAnswers(prev => [
        ...prev,
        {
          questionId: question.id,
          questionIndex: currentQuestion,
          selectedAnswer: optionIndex,
          correctAnswer: question.correctAnswer,
          isCorrect,
          explanation: question.explanation
        }
      ]);
    }
  }, [answered, currentQuestion, questions, score]);

  const handleSkipQuestion = useCallback(() => {
    setSkippedQuestions(prev => [...prev, currentQuestion]);
    moveToNextQuestion();
  }, [currentQuestion]);

  const moveToNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setAnswered(false);
    } else {
      completeQuiz();
    }
  }, [currentQuestion, questions.length]);

  const completeQuiz = useCallback(() => {
    const percentage = Math.round((score / questions.length) * 100);
    const passed = percentage >= 75; // 75% = 6/8 correct
    
    const results = {
      score,
      totalQuestions: questions.length,
      percentage,
      passed,
      completedAt: new Date().toISOString(),
      timeTaken: quizStartTime ? (Date.now() - quizStartTime) / 1000 : null,
      answers,
      mode: quizMode
    };

    setQuizResults(results);
    setCompleted(true);
    
    // Save results
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(results));
  }, [score, questions.length, answers, quizMode, quizStartTime]);

  const startQuiz = useCallback((mode = 'practice') => {
    setQuizMode(mode);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setCompleted(false);
    setAnswers([]);
    setSkippedQuestions([]);
    setQuizStartTime(Date.now());

    if (mode === 'timed') {
      setTimeRemaining(300); // 5 minutes
      setIsTimerActive(true);
    }
  }, []);

  const restartQuiz = useCallback(() => {
    startQuiz(quizMode);
  }, [quizMode, startQuiz]);

  const getFormattedTime = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getQuestionStatus = (index) => {
    if (index === currentQuestion) return 'current';
    
    const answer = answers.find(a => a.questionIndex === index);
    if (answer) return answer.isCorrect ? 'correct' : 'incorrect';
    
    if (skippedQuestions.includes(index)) return 'skipped';
    
    return 'unanswered';
  };

  const getWrongAnswers = useCallback(() => {
    return answers.filter(a => !a.isCorrect);
  }, [answers]);

  const getReviewData = useCallback(() => {
    return questions.map((question, index) => {
      const answer = answers.find(a => a.questionIndex === index);
      return {
        ...question,
        index,
        userAnswer: answer?.selectedAnswer,
        isCorrect: answer?.isCorrect,
        explanation: question.explanation
      };
    });
  }, [questions, answers]);

  return {
    // Question & Answer State
    currentQuestion,
    setCurrentQuestion,
    selectedAnswer,
    answered,
    
    // Quiz Progress
    score,
    completed,
    answers,
    quizResults,
    skippedQuestions,
    
    // Quiz Mode
    quizMode,
    
    // Timer
    timeRemaining,
    isTimerActive,
    getFormattedTime,
    
    // Actions
    handleSelectAnswer,
    handleSkipQuestion,
    moveToNextQuestion,
    startQuiz,
    restartQuiz,
    completeQuiz,
    
    // Utilities
    getQuestionStatus,
    getWrongAnswers,
    getReviewData,
    
    // Computed Values
    totalQuestions: questions.length,
    percentage: quizResults ? quizResults.percentage : 0,
    passed: quizResults ? quizResults.passed : false
  };
};
