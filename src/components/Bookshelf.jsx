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
      color: 'from-cyan-500/50 to-indigo-700/60',
      chapters: 3,
      totalMinutes: 600,
    },
    {
      id: 'NUR2110',
      title: 'Advanced Pharmacology',
      courseCode: 'NUR2110',
      description: 'Advanced drug therapies and specialized pharmacology for complex patient management.',
      icon: '🧬',
      color: 'from-fuchsia-500/40 to-purple-700/60',
      chapters: 3,
      totalMinutes: 680,
    },
    {
      id: 'NUR3120',
      title: 'Clinical Pharmacology',
      courseCode: 'NUR3120',
      description: 'Real-world clinical applications and case studies in pharmacological practice.',
      icon: '🏥',
      color: 'from-emerald-500/40 to-teal-700/60',
      chapters: 2,
      totalMinutes: 420,
      comingSoon: false,
    },
  ];

  const handleTextbookClick = (textbookId) => {
    navigate(`/textbook/${textbookId}`);
  };

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/unavidapress-logo.jpg" alt="UnaVida Press" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="text-2xl font-bold">UnaVida Press</h1>
              <p className="text-xs text-slate-300">Nursing Education & Curriculum Publishing • UnaVidaPress.com</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-300">Welcome, <strong className="text-white">{user?.name}</strong></span>
            <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>
      </div>

      <section className="px-6 py-10 border-b border-white/10 bg-[radial-gradient(circle_at_70%_20%,rgba(57,208,200,.2),transparent_40%),linear-gradient(180deg,#111831,#0b1020)]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-3">Your Pharmacology Library</h2>
          <p className="text-slate-300 max-w-3xl">Welcome back, {user?.name}. Select a textbook to continue your learning journey with videos, case studies, flashcards, and guided practice.</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h3 className="text-xl font-semibold mb-4 text-slate-100">Popular This Term</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {textbooks.map((textbook) => (
            <div
              key={textbook.id}
              onClick={() => !textbook.comingSoon && handleTextbookClick(textbook.id)}
              className={`rounded-2xl border border-white/10 bg-[#151d38] overflow-hidden transition-all ${textbook.comingSoon ? 'opacity-60' : 'hover:scale-[1.02] hover:border-cyan-300/60 cursor-pointer'}`}
            >
              <div className={`h-40 bg-gradient-to-br ${textbook.color} flex items-center justify-center text-6xl`}>
                {textbook.icon}
              </div>
              <div className="p-4">
                <h4 className="text-lg font-bold">{textbook.title}</h4>
                <p className="text-cyan-300 text-sm">{textbook.courseCode}</p>
                <p className="text-slate-300 text-sm mt-2 min-h-[3rem]">{textbook.description}</p>
                <div className="flex gap-6 mt-3 text-sm text-slate-300">
                  <span><strong className="text-white">{textbook.chapters}</strong> chapters</span>
                  <span><strong className="text-white">{textbook.totalMinutes}</strong> min</span>
                </div>
                <button className="w-full mt-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold flex items-center justify-center gap-2">
                  <BookOpen size={16} /> Open Textbook
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Bookshelf;
