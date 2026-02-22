import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Award, LogOut } from 'lucide-react';
import { useStudentProgress } from '../context/StudentProgressContext';

export const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { progress, getChapterProgress } = useStudentProgress();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const chapters = [
    {
      id: 'ch1_intro',
      title: 'Introduction to Pharmacology',
      duration: '180 min',
      icon: '💊',
    },
    {
      id: 'ch2_drugs',
      title: 'Drug Classifications',
      duration: '200 min',
      icon: '🧪',
    },
    {
      id: 'ch3_cardio',
      title: 'Cardiovascular Medications',
      duration: '220 min',
      icon: '❤️',
    },
    {
      id: 'ch4_neuro',
      title: 'Neurological Medications',
      duration: '240 min',
      icon: '🧠',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white bg-opacity-90 backdrop-blur-md border-b border-cyan-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-black text-cyan-500">U</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-sm text-gray-500">Welcome, {user?.name}!</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Card */}
        <div className="bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl shadow-lg p-8 mb-12 text-white">
          <h2 className="text-3xl font-bold mb-2">Welcome back!</h2>
          <p className="text-lg opacity-90">
            Continue your pharmacology learning journey and advance your knowledge.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-cyan-500">
            <div className="flex items-center gap-4">
              <div className="text-3xl">📚</div>
              <div>
                <p className="text-gray-500 text-sm">Chapters Completed</p>
                <p className="text-2xl font-bold text-cyan-600">
                  {chapters.filter(ch => getChapterProgress(ch.id, 10) === 100).length}/{chapters.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center gap-4">
              <div className="text-3xl">⏱️</div>
              <div>
                <p className="text-gray-500 text-sm">Total Study Time</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(chapters.reduce((sum, ch) => sum + getChapterProgress(ch.id, 10), 0) * 0.8)} min
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-emerald-500">
            <div className="flex items-center gap-4">
              <div className="text-3xl">🏆</div>
              <div>
                <p className="text-gray-500 text-sm">Current Streak</p>
                <p className="text-2xl font-bold text-emerald-600">7 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Learning Path</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {chapters.map((chapter) => {
              const chapterProgress = getChapterProgress(chapter.id, 10);
              return (
                <div
                  key={chapter.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all overflow-hidden border border-gray-200 hover:border-cyan-400 cursor-pointer"
                  onClick={() => navigate(`/reader/${chapter.id}`)}
                >
                  <div className="h-32 bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
                    <div className="text-5xl">{chapter.icon}</div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{chapter.title}</h4>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <Clock size={16} />
                        {chapter.duration}
                      </span>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-500">Progress</span>
                        <span className="text-cyan-600 font-semibold">{chapterProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all"
                          style={{ width: `${chapterProgress}%` }}
                        ></div>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded font-semibold text-sm transition-all">
                      {chapterProgress > 0 ? 'Continue' : 'Start'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
