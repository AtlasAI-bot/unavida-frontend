import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Bookshelf = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('unavidaTheme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    const nextTheme = nextDark ? (localStorage.getItem('unavidaThemeLastDark') || 'darkplus') : 'light';
    localStorage.setItem('unavidaTheme', nextTheme);
    if (nextDark) localStorage.setItem('unavidaThemeLastDark', nextTheme);
  };

  const textbooks = [
    {
      id: 'NUR1100',
      title: 'Pharmacology I',
      courseCode: 'NUR1100',
      chapters: 13,
      status: 'In Progress',
      statusClass: 'bg-cyan-500/20 text-cyan-300',
    },
    {
      id: 'NUR2300',
      title: 'Medical-Surgical Nursing',
      courseCode: 'NUR2300',
      chapters: 24,
      status: 'New',
      statusClass: 'bg-blue-500/20 text-blue-300',
    },
    {
      id: 'NUR2200',
      title: 'Maternal-Child',
      courseCode: 'NUR2200',
      chapters: 18,
      status: 'Continue',
      statusClass: 'bg-purple-500/20 text-purple-300',
    },
    {
      id: 'NUR2400',
      title: 'Psychiatric Nursing',
      courseCode: 'NUR2400',
      chapters: 16,
      status: 'Saved',
      statusClass: 'bg-pink-500/20 text-pink-300',
    },
  ];

  const chapters = [
    {
      id: '1.0',
      title: 'Overview & Introduction',
      status: 'Ready',
      duration: '25 min',
      info: 'Intro video available',
      action: 'Open',
    },
    {
      id: '1.1',
      title: 'Definition & Scope',
      status: 'Ready',
      duration: '20 min',
      info: 'Video + image set',
      action: 'Open',
    },
    {
      id: '1.6',
      title: 'Pharmacokinetics vs Pharmacodynamics',
      status: 'In progress',
      duration: '45 min',
      info: 'Video live',
      action: 'Continue',
      isPrimary: true,
    },
    {
      id: '1.11',
      title: 'Review Questions & Assessment',
      status: 'Not started',
      duration: '',
      info: 'Quiz + case studies',
      action: 'Start',
    },
  ];

  const handleCardClick = (textbookId) => {
    navigate(`/textbook/${textbookId}`);
  };

  const handleChapterClick = (chapterId) => {
    navigate(`/chapter/${chapterId}`);
  };

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? 'bg-[#0b1020] text-white' : 'bg-[#edf2ff] text-[#1b2542]'}`}>
      {/* Navigation */}
      <div className={`flex gap-6 px-7 py-[18px] items-center sticky top-0 z-50 ${isDarkMode ? 'bg-gradient-to-b from-black/65 to-black/0' : 'bg-gradient-to-b from-[#dfe8ff] to-[#dfe8ff00]'}`}>
        <div className={`font-black text-lg tracking-wide ${isDarkMode ? 'text-[#39d0c8]' : 'text-[#39d0c8]'}`}>
          UnaVida
        </div>
        <div className={`${isDarkMode ? 'text-white' : 'text-[#1b2542]'}`}>Home</div>
        <div className={`${isDarkMode ? 'text-white' : 'text-[#1b2542]'}`}>My Courses</div>
        <div className={`${isDarkMode ? 'text-white' : 'text-[#1b2542]'}`}>Continue Learning</div>
        <button
          onClick={toggleTheme}
          className={`ml-auto px-3.5 py-2.5 rounded-[10px] border transition-colors ${
            isDarkMode
              ? 'border-white/18 bg-white/8 text-white hover:bg-white/12'
              : 'border-[#cfd9f7] bg-white text-[#1b2542] hover:bg-[#f5f8ff]'
          }`}
        >
          {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Hero Section */}
      <section
        className={`px-7 py-6 border-b transition-colors ${
          isDarkMode
            ? 'bg-gradient-to-b from-[#111831] to-[#0b1020] border-white/8'
            : 'bg-gradient-to-b from-[#dfe8ff] to-[#edf2ff] border-[#cfd9f7]'
        }`}
        style={{
          backgroundImage: isDarkMode
            ? 'radial-gradient(circle at 70% 20%, rgba(57, 208, 200, 0.2), transparent 40%), linear-gradient(180deg, #111831, #0b1020)'
            : 'radial-gradient(circle at 70% 20%, rgba(57, 208, 200, 0.18), transparent 40%), linear-gradient(180deg, #dfe8ff, #edf2ff)',
        }}
      >
        <div>
          <h1 className={`text-4xl font-bold mb-2.5 ${isDarkMode ? 'text-white' : 'text-[#1b2542]'}`}>
            Pharmacology, but make it binge-worthy.
          </h1>
          <p
            className={`mb-4 max-w-[760px] leading-6 ${
              isDarkMode ? 'text-[#d7dcff]' : 'text-[#42527f]'
            }`}
          >
            Netflix-style discovery + nursing-school structure. Pick a textbook, jump into chapters like episodes, and keep
            your progress moving with flashcards, cases, and quick checkpoints.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleChapterClick('1.6')}
              className={`px-3.5 py-2.5 rounded-[10px] border font-bold transition-colors ${
                isDarkMode
                  ? 'bg-[#39d0c8] text-[#04201f] border-none hover:bg-[#2fb5ad]'
                  : 'bg-[#39d0c8] text-[#04201f] border-none hover:bg-[#2fb5ad]'
              }`}
            >
              Continue Chapter 1.6
            </button>
            <button
              onClick={() => handleCardClick('NUR1100')}
              className={`px-3.5 py-2.5 rounded-[10px] border transition-colors ${
                isDarkMode
                  ? 'border-white/18 bg-white/8 text-white hover:bg-white/12'
                  : 'border-[#cfd9f7] bg-white text-[#1b2542] hover:bg-[#f5f8ff]'
              }`}
            >
              Open Chapter List
            </button>
          </div>
        </div>
      </section>

      {/* Popular This Term Section */}
      <section className={`px-7 py-5 ${isDarkMode ? '' : ''}`}>
        <h2 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-[#e9edff]' : 'text-[#42527f]'}`}>
          Popular This Term
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {textbooks.map((book) => (
            <a
              key={book.id}
              onClick={(e) => {
                e.preventDefault();
                handleCardClick(book.id);
              }}
              href="#"
              className={`rounded-[14px] border overflow-hidden transition-all cursor-pointer no-underline ${
                isDarkMode
                  ? 'bg-[#151d38] border-white/8 hover:border-cyan-300/60'
                  : 'bg-white border-[#d9e3ff] hover:border-cyan-300/60'
              }`}
            >
              <div
                className={`aspect-video flex items-center justify-center text-sm ${
                  isDarkMode ? 'bg-[#202c57] text-[#a6b3ff]' : 'bg-[#ecf1ff] text-[#6273a8]'
                }`}
              >
                Cover
              </div>
              <div className="p-2.5">
                <div className={`text-sm font-bold mb-1.5 ${isDarkMode ? 'text-white' : 'text-[#1b2542]'}`}>
                  {book.title}
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-[#aeb8db]' : 'text-[#60709d]'}`}>
                  {book.courseCode} • {book.chapters} chapters
                </div>
                <span
                  className={`inline-block mt-2 text-xs px-2 py-1 rounded-full ${book.statusClass}`}
                >
                  {book.status}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Detail Section with Chapters */}
      <section
        className={`mx-7 mb-7 mt-7 p-4.5 rounded-[14px] border ${
          isDarkMode
            ? 'bg-[#121a34] border-white/10'
            : 'bg-white border-[#d9e3ff]'
        }`}
      >
        <h2 className={`m-0 ${isDarkMode ? 'text-white' : 'text-[#1b2542]'}`}>
          Pharmacology I — Chapter Lineup
        </h2>
        <p
          className={`m-0 mt-1.5 text-sm ${
            isDarkMode ? 'text-[#aeb8db]' : 'text-[#60709d]'
          }`}
        >
          Click-to-open chapter episodes with progress state and quick tools.
        </p>

        <div className="space-y-2.5 mt-3">
          {chapters.map((chapter) => (
            <div
              key={chapter.id}
              className={`grid grid-cols-[74px_1fr_auto] gap-3 items-center p-2.5 rounded-[10px] ${
                isDarkMode
                  ? 'bg-[#1a2448]'
                  : 'bg-[#f5f8ff]'
              }`}
            >
              <div
                className={`w-[74px] h-11 rounded-2xl flex items-center justify-center text-xs ${
                  isDarkMode
                    ? 'bg-[#2d3a71] text-[#b9c6ff]'
                    : 'bg-[#dfe8ff] text-[#6273a8]'
                }`}
              >
                {chapter.id}
              </div>
              <div>
                <h4 className={`m-0 text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-[#1b2542]'}`}>
                  {chapter.title}
                </h4>
                <p className={`m-0 mt-0.5 text-xs ${isDarkMode ? 'text-[#aeb8db]' : 'text-[#60709d]'}`}>
                  {chapter.status} • {chapter.duration} • {chapter.info}
                </p>
              </div>
              <button
                onClick={() => handleChapterClick(chapter.id)}
                className={`px-3.5 py-2 rounded-[10px] text-sm font-medium transition-colors whitespace-nowrap ${
                  chapter.isPrimary
                    ? isDarkMode
                      ? 'bg-[#39d0c8] text-[#04201f] hover:bg-[#2fb5ad]'
                      : 'bg-[#39d0c8] text-[#04201f] hover:bg-[#2fb5ad]'
                    : isDarkMode
                    ? 'border border-white/18 bg-white/8 text-white hover:bg-white/12'
                    : 'border border-[#cfd9f7] bg-white text-[#1b2542] hover:bg-[#f5f8ff]'
                }`}
              >
                {chapter.action}
              </button>
            </div>
          ))}
        </div>

        {/* Atlas Corner */}
        <div
          className={`mt-3.5 p-3 rounded-[10px] border-2 border-dashed ${
            isDarkMode
              ? 'bg-[#0f1833] border-[#39d0c8] text-[#d9fff9]'
              : 'bg-[#eef7ff] border-[#39d0c8] text-[#144057]'
          }`}
        >
          <strong>Atlas corner:</strong> "Think of chapters like episodes—except skipping this one won't ruin the plot, it'll ruin your med pass."
        </div>
      </section>
    </div>
  );
};

export default Bookshelf;
