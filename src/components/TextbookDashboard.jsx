import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, Play } from 'lucide-react';
import { useStudentProgress } from '../context/StudentProgressContext';

export const TextbookDashboard = () => {
  const navigate = useNavigate();
  const { textbookId } = useParams();
  const { getChapterProgress } = useStudentProgress();

  const textbookData = {
    NUR1100: {
      id: 'NUR1100', title: 'Pharmacology I', courseCode: 'NUR1100', description: 'Foundation pharmacology concepts for nursing practice', icon: '💊',
      units: [
        { number: 1, title: 'Foundations of Pharmacology', description: 'Core principles, pharmacokinetics & patient safety', chapters: [{ id: 'ch1_intro', number: 1, title: 'Introduction to Pharmacology', description: 'Core principles, pharmacokinetics & patient safety', duration: '180 min', icon: '💊', gradient: 'from-cyan-500/50 to-indigo-700/60' }] },
        { number: 2, title: 'Drug Classifications & Actions', description: 'Understanding drug classes and therapeutic mechanisms', chapters: [{ id: 'ch2_drugs', number: 2, title: 'Drug Classifications', description: 'Understanding drug classes and therapeutic mechanisms', duration: '200 min', icon: '🧪', gradient: 'from-fuchsia-500/40 to-purple-700/60' }] },
        { number: 3, title: 'Cardiovascular Pharmacology', description: 'Medications for heart and vascular system management', chapters: [{ id: 'ch3_cardio', number: 3, title: 'Cardiovascular Medications', description: 'Medications for heart and vascular system management', duration: '220 min', icon: '❤️', gradient: 'from-emerald-500/40 to-teal-700/60' }] },
      ],
    },
  };

  const textbook = textbookData[textbookId] || textbookData.NUR1100;

  return (
    <div className="min-h-screen bg-[#0b1020] text-white">
      <div className="sticky top-0 z-40 bg-black/40 backdrop-blur-md border-b border-white/10 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate('/bookshelf')} className="text-cyan-300 hover:text-cyan-200 text-sm flex items-center gap-2 mb-2"><ArrowLeft size={14} /> Bookshelf</button>
          <div className="flex items-center gap-3"><span className="text-4xl">{textbook.icon}</span><div><h1 className="text-2xl font-bold">{textbook.title}</h1><p className="text-slate-300 text-sm">{textbook.courseCode}</p></div></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {textbook.units.map((unit) => (
          <section key={unit.number} className="mb-10">
            <h2 className="text-xl font-bold mb-1">Unit {unit.number}: {unit.title}</h2>
            <p className="text-slate-300 mb-4">{unit.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unit.chapters.map((chapter) => {
                const progress = getChapterProgress(chapter.id, 10);
                return (
                  <article key={chapter.id} onClick={() => navigate(`/reader/${chapter.id}`)} className="rounded-xl border border-white/10 bg-[#151d38] overflow-hidden hover:border-cyan-300/60 cursor-pointer">
                    <div className={`h-36 bg-gradient-to-br ${chapter.gradient} flex items-center justify-center text-6xl`}>{chapter.icon}</div>
                    <div className="p-4">
                      <h3 className="font-semibold">Chapter {chapter.number}: {chapter.title}</h3>
                      <p className="text-sm text-slate-300 mt-1">{chapter.description}</p>
                      <div className="flex items-center justify-between text-xs text-slate-300 mt-3"><span className="flex items-center gap-1"><Clock size={12} /> {chapter.duration}</span><span>{progress}%</span></div>
                      <div className="mt-2 h-2 bg-slate-700 rounded-full"><div className="h-2 rounded-full bg-cyan-400" style={{ width: `${progress}%` }} /></div>
                      <button className="w-full mt-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold flex items-center justify-center gap-2"><Play size={14} /> {progress > 0 ? 'Continue' : 'Start'}</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TextbookDashboard;
