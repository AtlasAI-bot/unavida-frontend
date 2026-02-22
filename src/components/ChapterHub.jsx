import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  BookOpen, BarChart3, Zap, CheckCircle, AlertCircle,
  FileText, BookMarked, Award, Clock, Target
} from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import CaseStudies from './CaseStudies';
import LearningOutcomes from './LearningOutcomes';
import PracticeProblems from './PracticeProblems';
import StudentAchievements from './StudentAchievements';

const ChapterHub = () => {
  const { chapterId = '1' } = useParams();
  const {
    initializeChapter,
    getStats,
    getProgress,
    getNextSteps,
    startStudySession,
    endStudySession,
    checkAchievements
  } = useProgress();

  const [activeTab, setActiveTab] = useState('overview');
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    initializeChapter(chapterId, 3);
    startStudySession(chapterId);
    setSessionActive(true);

    return () => {
      if (sessionActive) {
        endStudySession(chapterId);
      }
    };
  }, [chapterId, initializeChapter, startStudySession, endStudySession]);

  const stats = getStats(chapterId);
  const progressPercentage = getProgress(chapterId);
  const nextSteps = getNextSteps(chapterId);

  const handleCheckAchievements = () => {
    const newAchievements = checkAchievements(chapterId);
    if (newAchievements && newAchievements.length > 0) {
      alert(`🎉 Congratulations! You earned: ${newAchievements.join(', ')}`);
    }
  };

  if (!stats) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-950 text-white">
        <p>Loading chapter hub...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-gray-900 border-b border-gray-800 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BookOpen size={32} className="text-red-500" />
            <div>
              <h1 className="text-3xl font-bold">Chapter {chapterId} Learning Hub</h1>
              <p className="text-gray-400">Introduction to Pharmacology</p>
            </div>
          </div>
          <button
            onClick={handleCheckAchievements}
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded font-semibold transition-colors flex items-center gap-2"
          >
            <Award size={20} /> Check Achievements
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded p-3">
            <p className="text-xs text-gray-400 uppercase">Progress</p>
            <p className="text-xl font-bold text-red-500">{progressPercentage}%</p>
          </div>
          <div className="bg-gray-800 rounded p-3">
            <p className="text-xs text-gray-400 uppercase">Study Time</p>
            <p className="text-xl font-bold text-blue-500">{stats.timeInvested} min</p>
          </div>
          <div className="bg-gray-800 rounded p-3">
            <p className="text-xs text-gray-400 uppercase">Best Quiz Score</p>
            <p className="text-xl font-bold text-green-500">{stats.bestQuizScore}%</p>
          </div>
          <div className="bg-gray-800 rounded p-3">
            <p className="text-xs text-gray-400 uppercase">Problems Done</p>
            <p className="text-xl font-bold text-purple-500">{stats.practiceProblemsCompleted}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex overflow-x-auto gap-2 mb-8 border-b border-gray-800 pb-0">
          {[
            { id: 'overview', label: '📊 Overview', icon: <BarChart3 size={18} /> },
            { id: 'outcomes', label: '🎯 Learning Outcomes', icon: <Target size={18} /> },
            { id: 'cases', label: '💼 Case Studies', icon: <FileText size={18} /> },
            { id: 'problems', label: '🔢 Practice Problems', icon: <Calculator size={18} /> },
            { id: 'achievements', label: '🏆 Achievements', icon: <Award size={18} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 font-semibold whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-red-600 text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div>
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Progress Overview */}
              <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
                <h2 className="text-2xl font-bold mb-6">Your Progress</h2>

                {/* Main Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Overall Completion</span>
                    <span className="text-2xl font-bold text-red-500">{progressPercentage}%</span>
                  </div>
                  <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Detail Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-800 rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Sections Read</span>
                      <BookOpen size={18} className="text-blue-500" />
                    </div>
                    <p className="text-2xl font-bold">{stats.sectionsCompleted}/3</p>
                  </div>

                  <div className="bg-gray-800 rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Quiz Score</span>
                      <Zap size={18} className="text-yellow-500" />
                    </div>
                    <p className="text-2xl font-bold">{stats.bestQuizScore}%</p>
                  </div>

                  <div className="bg-gray-800 rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Case Studies</span>
                      <FileText size={18} className="text-green-500" />
                    </div>
                    <p className="text-2xl font-bold">{stats.caseStudiesCompleted}/5</p>
                  </div>

                  <div className="bg-gray-800 rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Learning Outcomes</span>
                      <CheckCircle size={18} className="text-purple-500" />
                    </div>
                    <p className="text-2xl font-bold">{stats.learningOutcomesCompleted}/9</p>
                  </div>

                  <div className="bg-gray-800 rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Flashcards</span>
                      <BookMarked size={18} className="text-pink-500" />
                    </div>
                    <p className="text-2xl font-bold">{stats.flashcardsStudied}</p>
                  </div>

                  <div className="bg-gray-800 rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Practice Problems</span>
                      <BarChart3 size={18} className="text-indigo-500" />
                    </div>
                    <p className="text-2xl font-bold">{stats.practiceProblemsCompleted}/10</p>
                  </div>

                  <div className="bg-gray-800 rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Study Time</span>
                      <Clock size={18} className="text-orange-500" />
                    </div>
                    <p className="text-2xl font-bold">{stats.timeInvested} min</p>
                  </div>

                  <div className="bg-gray-800 rounded p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Quiz Attempts</span>
                      <Target size={18} className="text-cyan-500" />
                    </div>
                    <p className="text-2xl font-bold">{stats.quizAttempts}</p>
                  </div>
                </div>
              </div>

              {/* Recommended Next Steps */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-lg border border-blue-700 p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                  <AlertCircle size={28} /> Recommended Next Steps
                </h2>
                <ul className="space-y-3">
                  {nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-blue-300 font-bold flex-shrink-0 mt-1">
                        {idx + 1}.
                      </span>
                      <span className="text-blue-100">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Study Tips */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Zap size={24} className="text-yellow-500" /> Study Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li>✓ Take detailed notes while reading</li>
                    <li>✓ Review case studies daily</li>
                    <li>✓ Practice problems strengthen skills</li>
                    <li>✓ Use flashcards for quick review</li>
                    <li>✓ Quiz yourself frequently</li>
                  </ul>
                </div>

                <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                  <h3 className="text-xl font-bold mb-4">📚 Chapter Overview</h3>
                  <p className="text-sm text-gray-300 mb-4">
                    This chapter covers fundamental pharmacology concepts including drug classification,
                    pharmacokinetics (ADME), pharmacodynamics, and nursing responsibilities in
                    medication administration and safety.
                  </p>
                  <p className="text-xs text-gray-400">
                    Estimated time to complete: 2-3 hours | Difficulty: Beginner to Intermediate
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Learning Outcomes Tab */}
          {activeTab === 'outcomes' && (
            <LearningOutcomes chapterId={chapterId} />
          )}

          {/* Case Studies Tab */}
          {activeTab === 'cases' && (
            <CaseStudies chapterId={chapterId} />
          )}

          {/* Practice Problems Tab */}
          {activeTab === 'problems' && (
            <PracticeProblems chapterId={chapterId} />
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <StudentAchievements />
          )}
        </div>
      </div>
    </div>
  );
};

// Import Calculator icon fix
import { Calculator } from 'lucide-react';

export default ChapterHub;
