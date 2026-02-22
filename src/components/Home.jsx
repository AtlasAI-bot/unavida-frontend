import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Clock, BookOpen, LogOut } from 'lucide-react';
import { useStudentProgress } from '../context/StudentProgressContext';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const navigate = useNavigate();
  const { progress, getChapterProgress } = useStudentProgress();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const textbooks = [
    {
      id: 'NUR1100',
      title: 'Pharmacology I',
      courseCode: 'NUR1100',
      description: 'Foundation pharmacology concepts for nursing practice - Drug actions, classifications, and basic therapeutic uses.',
      cover: '📚',
      icon: '💊',
      chapters: [
        {
          id: 'ch1_intro',
          chapterNumber: 1,
          title: 'Introduction to Pharmacology',
          unitNumber: 1,
          unitTitle: 'Foundations of Pharmacology',
          description: 'Core principles, pharmacokinetics & patient safety',
          duration: '180 min',
          progress: getChapterProgress('ch1_intro', 10),
          gradient: 'from-cyan-400 to-cyan-600',
          icon: '💊'
        },
        {
          id: 'ch2_drugs',
          chapterNumber: 2,
          title: 'Drug Classifications',
          unitNumber: 2,
          unitTitle: 'Drug Classifications & Actions',
          description: 'Understanding drug classes and therapeutic mechanisms',
          duration: '200 min',
          progress: getChapterProgress('ch2_drugs', 10),
          gradient: 'from-purple-400 to-purple-600',
          icon: '🧪'
        },
        {
          id: 'ch3_cardio',
          chapterNumber: 3,
          title: 'Cardiovascular Medications',
          unitNumber: 3,
          unitTitle: 'Cardiovascular Pharmacology',
          description: 'Medications for heart and vascular system management',
          duration: '220 min',
          progress: getChapterProgress('ch3_cardio', 10),
          gradient: 'from-emerald-400 to-emerald-600',
          icon: '❤️'
        }
      ]
    },
    {
      id: 'NUR2110',
      title: 'Advanced Pharmacology',
      courseCode: 'NUR2110',
      description: 'Advanced drug therapies and specialized pharmacology for complex patient management.',
      cover: '📗',
      icon: '🧬',
      chapters: [
        {
          id: 'ch4_neuro',
          chapterNumber: 1,
          title: 'Neurological Medications',
          unitNumber: 1,
          unitTitle: 'Advanced Neurological Pharmacology',
          description: 'CNS and peripheral nervous system medications',
          duration: '240 min',
          progress: getChapterProgress('ch4_neuro', 10),
          gradient: 'from-blue-400 to-blue-600',
          icon: '🧠'
        },
        {
          id: 'ch5_endo',
          chapterNumber: 2,
          title: 'Endocrine Medications',
          unitNumber: 2,
          unitTitle: 'Endocrine System Pharmacology',
          description: 'Hormonal medications and metabolic regulation',
          duration: '210 min',
          progress: getChapterProgress('ch5_endo', 10),
          gradient: 'from-pink-400 to-pink-600',
          icon: '⚗️'
        },
        {
          id: 'ch6_immune',
          chapterNumber: 3,
          title: 'Immunologic Agents',
          unitNumber: 3,
          unitTitle: 'Immune System Pharmacology',
          description: 'Vaccines, biologics, and immunotherapies',
          duration: '230 min',
          progress: getChapterProgress('ch6_immune', 10),
          gradient: 'from-amber-400 to-amber-600',
          icon: '🛡️'
        }
      ]
    },
    {
      id: 'NUR3120',
      title: 'Clinical Pharmacology',
      courseCode: 'NUR3120',
      description: 'Real-world clinical applications and case studies (Coming Soon)',
      cover: '📘',
      icon: '🏥',
      comingSoon: true,
      chapters: []
    }
  ];

  const handleChapterClick = (chapterId) => {
    navigate(`/reader/${chapterId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-blue-50 to-slate-100 text-gray-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white bg-opacity-90 backdrop-blur-md border-b border-cyan-200">
        <div className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl font-black text-cyan-500">U</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">UnaVida</h1>
              <p className="text-sm text-gray-500">Pharmacology Learning Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, <strong>{user?.name}</strong>!
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Featured Banner */}
      <div className="relative h-96 bg-gradient-to-r from-cyan-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-emerald-500 opacity-80"></div>
        <div className="absolute inset-0 flex items-center px-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold mb-4 text-white">Your Pharmacology Library</h2>
            <p className="text-xl mb-6 text-white font-light">
              Welcome back, {user?.name}! Continue your pharmacology journey
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (user?.role === 'student') {
                    navigate('/student-dashboard');
                  } else if (user?.role === 'instructor') {
                    navigate('/instructor-dashboard');
                  } else if (user?.role === 'admin') {
                    navigate('/admin-dashboard');
                  }
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Play size={20} /> Go to Dashboard
              </button>
              <button
                onClick={() => handleChapterClick('ch1_intro')}
                className="btn-secondary"
              >
                View Content
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Textbook Bookshelves */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Textbook Grid - Top Level */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Textbooks</h2>
          <p className="text-gray-600 mb-8">Select a textbook to explore chapters and units</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {textbooks.map((textbook) => (
              <div
                key={textbook.id}
                className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-200 hover:border-cyan-400"
              >
                {/* Textbook Cover */}
                <div className={`relative h-48 bg-gradient-to-br from-teal-400 to-purple-600 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
                  <div className="text-7xl opacity-80">{textbook.icon}</div>
                  {textbook.comingSoon && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold text-lg bg-purple-600 px-4 py-2 rounded">
                        Coming Soon
                      </span>
                    </div>
                  )}
                </div>

                {/* Textbook Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{textbook.title}</h3>
                  <p className="text-sm text-purple-600 font-semibold mb-3">{textbook.courseCode}</p>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3">{textbook.description}</p>

                  {!textbook.comingSoon && (
                    <>
                      <p className="text-sm text-gray-500 mb-4">
                        {textbook.chapters.length} chapters • {textbook.chapters.reduce((acc, ch) => acc + parseInt(ch.duration), 0)} min total
                      </p>
                      <button
                        onClick={() => {
                          // Scroll to textbook section
                          document.getElementById(`textbook-${textbook.id}`)?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded font-semibold text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <BookOpen size={16} />
                        View Chapters
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Textbook Sections */}
        {textbooks.map((textbook) =>
          textbook.comingSoon ? null : (
            <div key={textbook.id} id={`textbook-${textbook.id}`} className="mb-20 pt-12 border-t-2 border-gray-200">
              <div className="flex items-center gap-4 mb-12">
                <div className="text-5xl">{textbook.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{textbook.title}</h2>
                  <p className="text-gray-600">{textbook.courseCode} • {textbook.chapters.length} chapters</p>
                </div>
              </div>

              {/* Group chapters by unit */}
              {[1, 2, 3, 4].map((unitNum) => {
                const unitChapters = textbook.chapters.filter(ch => ch.unitNumber === unitNum);
                if (unitChapters.length === 0) return null;

                const unitInfo = unitChapters[0];

                return (
                  <div key={`${textbook.id}-unit-${unitNum}`} className="mb-12">
                    {/* Unit Header */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Unit {unitNum}: {unitInfo.unitTitle}
                    </h3>

                    {/* Horizontal Scrolling Container */}
                    <div className="relative group">
                      <div className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide">
                        {unitChapters.map((chapter) => (
                          <div
                            key={chapter.id}
                            onClick={() => handleChapterClick(chapter.id)}
                            className="flex-shrink-0 w-72 card-hover group/card cursor-pointer"
                          >
                            <div className="relative rounded-lg overflow-hidden bg-white border border-gray-200 group-hover/card:border-cyan-400 shadow-md hover:shadow-lg transition-all h-full flex flex-col">
                              {/* Thumbnail */}
                              <div className={`relative h-40 bg-gradient-to-br ${chapter.gradient} flex items-center justify-center overflow-hidden group-hover/card:scale-105 transition-transform duration-300`}>
                                <div className="absolute inset-0 opacity-20"></div>
                                <div className="text-6xl">{chapter.icon}</div>
                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white bg-opacity-90 px-2 py-1 rounded text-xs text-gray-800 font-semibold">
                                  <Clock size={12} />
                                  {chapter.duration}
                                </div>
                              </div>

                              {/* Content */}
                              <div className="p-4 flex-1 flex flex-col">
                                <h3 className="font-bold text-lg line-clamp-2 mb-2 text-gray-900">
                                  Chapter {chapter.chapterNumber}: {chapter.title}
                                </h3>
                                <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-1">
                                  {chapter.description}
                                </p>

                                {/* Progress Bar */}
                                <div className="mb-4">
                                  <div className="flex justify-between text-xs mb-2">
                                    <span className="text-gray-500">Progress</span>
                                    <span className="text-cyan-600 font-semibold">{chapter.progress}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                                      style={{ width: `${chapter.progress}%` }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Action Button */}
                                <button className="w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded font-semibold text-sm transition-all flex items-center justify-center gap-2">
                                  <Play size={16} />
                                  {chapter.progress > 0 ? 'Continue' : 'Start'}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Scroll Indicators */}
                      <style>{`
                        .scrollbar-hide {
                          -ms-overflow-style: none;
                          scrollbar-width: none;
                        }
                        .scrollbar-hide::-webkit-scrollbar {
                          display: none;
                        }
                      `}</style>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>

      {/* Stats Footer */}
      <div className="border-t border-gray-300 bg-gradient-to-r from-blue-50 to-purple-50 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-4 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-cyan-600">3</p>
            <p className="text-gray-600">Textbooks</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-purple-600">6+</p>
            <p className="text-gray-600">Chapters</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-emerald-600">6</p>
            <p className="text-gray-600">Units</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-teal-600">1200+</p>
            <p className="text-gray-600">Minutes Content</p>
          </div>
        </div>
      </div>
    </div>
  );
};
