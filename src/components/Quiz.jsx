import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, RotateCw, Clock, AlertCircle } from 'lucide-react';
import { useQuiz } from '../hooks/useQuiz';

export const Quiz = ({ chapterId }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startMode, setStartMode] = useState(null); // null, 'practice', 'timed'

  const quiz = useQuiz(questions);

  // Fetch quiz questions from API
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/chapters/${chapterId || 'ch1_intro_to_pharmacology'}/quiz`);
        if (!response.ok) throw new Error('Failed to fetch quiz');
        
        const data = await response.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError(err.message);
        // Fallback mock data
        setQuestions([
          {
            id: 'q_001',
            question: 'Define pharmacology.',
            options: ['The study of drugs', 'The study of diseases', 'The study of anatomy', 'The study of psychology'],
            correctAnswer: 0,
            explanation: 'Pharmacology is the science dealing with drugs and their effects on living organisms.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [chapterId]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center text-red-400">
          <AlertCircle size={48} className="mx-auto mb-4" />
          <p>Error loading quiz: {error}</p>
        </div>
      </div>
    );
  }

  // Mode selection screen
  if (!startMode) {
    return (
      <div className="max-w-2xl mx-auto p-8 h-full flex flex-col justify-center">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Chapter Quiz</h2>
          <p className="text-gray-400 text-lg">
            {questions.length} questions • ~5 minutes
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-2">📚 Previous Results</h3>
            {quiz.quizResults ? (
              <div className="space-y-2">
                <p className="text-white">
                  Score: <span className="font-bold text-red-600">{quiz.quizResults.score}/{quiz.quizResults.totalQuestions}</span>
                  ({quiz.quizResults.percentage}%)
                </p>
                <p className="text-gray-400 text-sm">
                  Completed: {new Date(quiz.quizResults.completedAt).toLocaleDateString()}
                </p>
                <div className={`mt-2 px-3 py-1 rounded text-sm font-semibold inline-block ${
                  quiz.quizResults.passed
                    ? 'bg-green-900 text-green-300'
                    : 'bg-red-900 text-red-300'
                }`}>
                  {quiz.quizResults.passed ? '✅ Passed' : '❌ Not Passed'}
                </div>
              </div>
            ) : (
              <p className="text-gray-400">No previous attempts</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => quiz.startQuiz('practice')}
            className="p-8 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-lg text-white text-center transition-all transform hover:scale-105"
          >
            <p className="text-2xl mb-2">📖</p>
            <h3 className="text-xl font-bold mb-2">Practice Mode</h3>
            <p className="text-sm text-gray-100">
              Untimed • Immediate feedback • Review answers
            </p>
          </button>

          <button
            onClick={() => quiz.startQuiz('timed')}
            className="p-8 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg text-white text-center transition-all transform hover:scale-105"
          >
            <p className="text-2xl mb-2">⏱️</p>
            <h3 className="text-xl font-bold mb-2">Timed Mode</h3>
            <p className="text-sm text-gray-100">
              5 minutes • Real exam conditions
            </p>
          </button>
        </div>
      </div>
    );
  }

  // Quiz results screen
  if (quiz.completed) {
    const wrongAnswers = quiz.getWrongAnswers();
    const percentage = quiz.percentage;

    return (
      <div className="max-w-3xl mx-auto p-4 md:p-8 h-full flex flex-col justify-center overflow-y-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">Quiz Complete!</h2>
          <p className="text-gray-400 text-lg">Your Results</p>
        </div>

        {/* Score Circle */}
        <div className="flex justify-center mb-8">
          <div className="relative w-48 h-48">
            <svg className="transform -rotate-90" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#374151"
                strokeWidth="8"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke={percentage >= 75 ? '#DC2626' : '#F97316'}
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - percentage / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl font-bold text-white">{percentage}%</p>
              <p className={`text-sm font-semibold ${percentage >= 75 ? 'text-green-400' : 'text-red-400'}`}>
                {percentage >= 75 ? '✅ PASSED' : '❌ NOT PASSED'}
              </p>
            </div>
          </div>
        </div>

        {/* Score Details */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Correct</p>
            <p className="text-3xl font-bold text-green-600">{quiz.score}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Total</p>
            <p className="text-3xl font-bold">{quiz.totalQuestions}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm">Incorrect</p>
            <p className="text-3xl font-bold text-red-600">
              {quiz.totalQuestions - quiz.score}
            </p>
          </div>
        </div>

        {/* Passing Criteria */}
        <div className={`rounded-lg p-6 mb-8 border-l-4 ${
          percentage >= 75
            ? 'bg-green-900 bg-opacity-30 border-green-600'
            : 'bg-orange-900 bg-opacity-30 border-orange-600'
        }`}>
          <p className="text-lg font-semibold mb-2">
            {percentage >= 75 ? '🎉 Excellent!' : '⚠️ Keep Studying'}
          </p>
          <p className="text-gray-300 text-sm">
            {percentage >= 75
              ? 'You passed with flying colors! Review the material one more time before the exam.'
              : 'You need to score 75% (6 out of 8) to pass. Review the incorrect answers and try again.'}
          </p>
          <p className="text-gray-400 text-xs mt-2">
            Pass Threshold: 75% (6 out of 8 correct)
          </p>
        </div>

        {/* Incorrect Answers */}
        {wrongAnswers.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4 text-red-400">Questions to Review</h3>
            <div className="space-y-4">
              {wrongAnswers.map((answer, idx) => {
                const question = questions[answer.questionIndex];
                return (
                  <div key={idx} className="bg-gray-800 rounded-lg p-4 border border-red-700 border-opacity-30">
                    <p className="text-white font-semibold mb-2">
                      Q{answer.questionIndex + 1}: {question.question}
                    </p>
                    <div className="mb-3 p-3 bg-red-900 bg-opacity-30 rounded">
                      <p className="text-sm text-red-300">Your answer: {question.options[answer.selectedAnswer]}</p>
                    </div>
                    <div className="mb-3 p-3 bg-green-900 bg-opacity-30 rounded">
                      <p className="text-sm text-green-300">Correct answer: {question.options[answer.correctAnswer]}</p>
                    </div>
                    <div className="p-3 bg-gray-700 rounded">
                      <p className="text-sm text-gray-200"><strong>Explanation:</strong> {question.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => {
              setStartMode(null);
            }}
            className="py-3 px-6 bg-gray-800 hover:bg-gray-700 rounded font-semibold transition-colors"
          >
            ← Back to Quiz Menu
          </button>
          <button
            onClick={() => quiz.restartQuiz()}
            className="flex items-center justify-center gap-2 py-3 px-6 bg-red-600 hover:bg-red-700 rounded font-semibold transition-colors"
          >
            <RotateCw size={20} /> Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  // Active quiz screen
  const question = questions[quiz.currentQuestion];
  const isAnswerCorrect = quiz.selectedAnswer === question.correctAnswer;
  const timeClass = quiz.timeRemaining < 60 ? 'text-red-600' : 'text-gray-300';

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-8 h-full flex flex-col overflow-y-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Question {quiz.currentQuestion + 1} of {quiz.totalQuestions}</h2>
            <p className="text-gray-400 text-sm">{quiz.quizMode === 'timed' ? 'Timed Mode' : 'Practice Mode'}</p>
          </div>
          {quiz.quizMode === 'timed' && (
            <div className={`flex items-center gap-2 text-2xl font-bold px-4 py-2 bg-gray-800 rounded-lg ${timeClass}`}>
              <Clock size={24} />
              {quiz.getFormattedTime()}
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${((quiz.currentQuestion + 1) / quiz.totalQuestions) * 100}%`
            }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700 flex-1">
        <h3 className="text-xl md:text-2xl font-bold text-white mb-6">
          {question.question}
        </h3>

        {/* Options */}
        <div className="space-y-3">
          {question.options.map((option, idx) => {
            const isSelected = quiz.selectedAnswer === idx;
            const isCorrect = idx === question.correctAnswer;
            let buttonClass = 'bg-gray-700 border-gray-600 hover:border-gray-500 cursor-pointer';

            if (quiz.answered) {
              if (isSelected && isCorrect) {
                buttonClass = 'bg-green-900 border-green-600 border-2 cursor-not-allowed';
              } else if (isSelected && !isCorrect) {
                buttonClass = 'bg-red-900 border-red-600 border-2 cursor-not-allowed';
              } else if (isCorrect) {
                buttonClass = 'bg-green-900 border-green-600 border-2 cursor-not-allowed';
              } else {
                buttonClass = 'bg-gray-700 border-gray-600 cursor-not-allowed opacity-50';
              }
            } else if (isSelected) {
              buttonClass = 'bg-gray-600 border-red-600 border-2 cursor-pointer';
            }

            return (
              <button
                key={idx}
                onClick={() => !quiz.answered && quiz.handleSelectAnswer(idx)}
                disabled={quiz.answered}
                className={`w-full text-left p-4 rounded border-2 transition-all ${buttonClass}`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded border-2 flex items-center justify-center font-semibold text-sm ${
                      quiz.answered
                        ? isSelected && isCorrect
                          ? 'bg-green-600 border-green-600 text-white'
                          : isSelected && !isCorrect
                          ? 'bg-red-600 border-red-600 text-white'
                          : isCorrect
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'border-gray-600 text-gray-400'
                        : isSelected
                        ? 'bg-red-600 border-red-600 text-white'
                        : 'border-gray-500 text-gray-400'
                    }`}
                  >
                    {quiz.answered && isSelected && isCorrect && '✓'}
                    {quiz.answered && isSelected && !isCorrect && '✗'}
                    {quiz.answered && !isSelected && isCorrect && '✓'}
                    {!quiz.answered && String.fromCharCode(65 + idx)}
                    {quiz.answered && !isSelected && !isCorrect && String.fromCharCode(65 + idx)}
                  </div>
                  <div className="flex-1">
                    <p className="text-white">{option}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {quiz.answered && (
        <div
          className={`rounded-lg p-6 mb-6 border-l-4 ${
            isAnswerCorrect
              ? 'bg-green-900 bg-opacity-30 border-green-600'
              : 'bg-red-900 bg-opacity-30 border-red-600'
          }`}
        >
          <div className="flex gap-3 mb-2 items-start">
            {isAnswerCorrect ? (
              <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            ) : (
              <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
            )}
            <p className="font-semibold">
              {isAnswerCorrect ? '✅ Correct!' : '❌ Incorrect'}
            </p>
          </div>
          <p className="text-sm text-gray-200 ml-8">{question.explanation}</p>
        </div>
      )}

      {/* Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {quiz.answered && quiz.currentQuestion > 0 && (
          <button
            onClick={() => {
              quiz.setCurrentQuestion(quiz.currentQuestion - 1);
              // This would need a previous handler in the hook
            }}
            className="py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded font-semibold transition-colors text-sm"
          >
            ← Previous
          </button>
        )}

        {!quiz.answered && (
          <button
            onClick={() => quiz.handleSkipQuestion()}
            className="py-3 px-4 bg-gray-800 hover:bg-gray-700 rounded font-semibold transition-colors text-sm"
          >
            ⏭️ Skip
          </button>
        )}

        <div></div>

        <button
          onClick={() => quiz.moveToNextQuestion()}
          disabled={!quiz.answered}
          className="py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded font-semibold transition-colors text-sm md:col-span-2"
        >
          {quiz.answered
            ? quiz.currentQuestion === quiz.totalQuestions - 1
              ? 'Finish Quiz →'
              : 'Next Question →'
            : 'Select an answer'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;
