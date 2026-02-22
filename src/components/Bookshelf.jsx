import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Bookshelf = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

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
      icon: '💊',
      color: 'from-cyan-400 to-cyan-600',
      chapters: 3,
      totalMinutes: 600,
    },
    {
      id: 'NUR2110',
      title: 'Advanced Pharmacology',
      courseCode: 'NUR2110',
      description: 'Advanced drug therapies and specialized pharmacology for complex patient management.',
      icon: '🧬',
      color: 'from-purple-400 to-purple-600',
      chapters: 3,
      totalMinutes: 680,
    },
    {
      id: 'NUR3120',
      title: 'Clinical Pharmacology',
      courseCode: 'NUR3120',
      description: 'Real-world clinical applications and case studies in pharmacological practice.',
      icon: '🏥',
      color: 'from-emerald-400 to-emerald-600',
      chapters: 2,
      totalMinutes: 420,
      comingSoon: false, // Will build this later
    },
  ];

  const handleTextbookClick = (textbookId) => {
    navigate(`/textbook/${textbookId}`);
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
      <div className="relative h-80 bg-gradient-to-r from-cyan-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 via-purple-500 to-emerald-500 opacity-80"></div>
        <div className="absolute inset-0 flex items-center px-8">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold mb-4 text-white">Your Pharmacology Library</h2>
            <p className="text-xl mb-6 text-white font-light">
              Welcome back, {user?.name}! Select a textbook to begin your learning journey
            </p>
          </div>
        </div>
      </div>

      {/* Bookshelf - Textbooks Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Textbooks</h2>
        <p className="text-gray-600 mb-12">Click a textbook to explore chapters and learning materials</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {textbooks.map((textbook) => (
            <div
              key={textbook.id}
              onClick={() => !textbook.comingSoon && handleTextbookClick(textbook.id)}
              className={`group relative rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 ${
                textbook.comingSoon
                  ? 'border-gray-300 opacity-60 cursor-not-allowed'
                  : 'border-gray-200 hover:border-cyan-400 cursor-pointer hover:scale-105 transform duration-300'
              }`}
            >
              {/* Book Cover - Top Half */}
              <div className={`relative h-64 bg-gradient-to-br ${textbook.color} flex flex-col items-center justify-center overflow-hidden`}>
                <div className="text-9xl mb-4 opacity-90">{textbook.icon}</div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                
                {textbook.comingSoon && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <span className="text-white font-bold text-lg bg-purple-600 px-4 py-2 rounded">
                      Coming Soon
                    </span>
                  </div>
                )}
              </div>

              {/* Book Info - Bottom Half */}
              <div className="bg-white p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{textbook.title}</h3>
                <p className="text-sm text-cyan-600 font-semibold mb-4">{textbook.courseCode}</p>

                <p className="text-gray-600 text-sm mb-6 line-clamp-3 min-h-[3.5rem]">
                  {textbook.description}
                </p>

                {!textbook.comingSoon && (
                  <>
                    {/* Metadata */}
                    <div className="flex gap-6 mb-6 py-4 border-t border-b border-gray-200">
                      <div>
                        <p className="text-2xl font-bold text-cyan-600">{textbook.chapters}</p>
                        <p className="text-xs text-gray-500">Chapters</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">{textbook.totalMinutes}</p>
                        <p className="text-xs text-gray-500">Minutes</p>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2 group-hover:shadow-lg">
                      <BookOpen size={18} />
                      Open Textbook
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="border-t border-gray-300 bg-gradient-to-r from-blue-50 to-purple-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-4xl font-bold text-cyan-600">3</p>
            <p className="text-gray-600">Textbooks Available</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-purple-600">8+</p>
            <p className="text-gray-600">Total Chapters</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-emerald-600">1700+</p>
            <p className="text-gray-600">Minutes of Content</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookshelf;
