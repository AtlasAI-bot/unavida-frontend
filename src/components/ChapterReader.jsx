import React from 'react';
import { useNavigate } from 'react-router-dom';

const sections = [
  '1.0 Overview',
  '1.1 Definition & Scope',
  '1.2 Historical Context',
  '1.6 PK vs PD',
  '1.11 Assessment',
];

export const ChapterReader = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f1113] text-slate-100">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-[#14171a] px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <div className="text-xs text-slate-400">Home / Pharmacology I / Reader</div>
          <div className="font-semibold">Reader Demo — Chapter Navigation Accordion</div>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          <button className="px-3 py-1.5 rounded border border-white/20 text-sm">☀️ Light Mode</button>
          <button className="px-3 py-1.5 rounded border border-white/20 text-sm">↔ Expand Reader</button>
          <button className="px-3 py-1.5 rounded border border-white/20 text-sm">⚙️ Reader Preferences</button>
          <button
            onClick={() => navigate('/textbook/NUR1100')}
            className="px-3 py-1.5 rounded border border-white/20 text-sm"
          >
            Back to Chapter List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-3 p-3">
        <aside className="col-span-12 lg:col-span-3 rounded-xl border border-white/10 bg-[#181b1f] p-3">
          <h3 className="font-semibold mb-3">Textbook Navigation</h3>
          <div className="rounded-lg border border-white/10 bg-[#22262b] p-2 mb-2 text-sm font-semibold">Chapter 1: Intro to Pharmacology</div>
          <div className="space-y-1 mb-3">
            {sections.map((s) => (
              <div
                key={s}
                className={`rounded px-2 py-1.5 text-sm ${s.includes('1.6') ? 'bg-[#2f3a42] border-l-2 border-cyan-300' : 'bg-[#1d2125]'}`}
              >
                {s}
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-white/10 bg-[#22262b] p-2 text-sm font-semibold">Chapter 2: Major Drug Classes</div>
        </aside>

        <main className="col-span-12 lg:col-span-6 rounded-xl border border-white/10 bg-[#181b1f] p-4">
          <h1 className="text-2xl font-bold">Section 1.6: Pharmacokinetics vs Pharmacodynamics</h1>
          <p className="text-sm text-slate-400 mt-1">45 min • video + guided cards + embedded visuals</p>

          <div className="mt-3 rounded-lg border border-yellow-300/40 bg-yellow-100/10 text-yellow-100 px-3 py-2 text-sm">
            <strong>Exam Alert:</strong> Instructor-highlighted topic — ADME sequence and first-pass metabolism are high-yield.
          </div>

          <section className="mt-3 rounded-xl border border-white/10 bg-[#1c2025] p-3">
            <h3 className="font-semibold mb-2">🎥 Featured Lesson Video</h3>
            <div className="aspect-video rounded-lg bg-[#2c3239] flex items-center justify-center text-slate-400 text-sm">
              Video Player Area (S3-backed in live app)
            </div>
          </section>

          <section className="mt-3 rounded-xl border border-white/10 bg-[#22272e] p-4">
            <h3 className="font-semibold text-lg mb-1">Absorption, Distribution, Metabolism, Elimination (ADME)</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Pharmacokinetics describes how the body handles a drug over time. In this section, students walk through each ADME phase and connect it to safe administration timing and monitoring responsibilities.
            </p>
          </section>
        </main>

        <aside className="col-span-12 lg:col-span-3 rounded-xl border border-white/10 bg-[#181b1f] p-3">
          <div className="rounded-lg bg-[#22262b] p-3 text-sm mb-2">
            <strong>Instructor Highlights</strong>
            <div className="text-slate-300 mt-1">Jump to instructor-pinned concepts and exam focus areas.</div>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#22262b] p-3 mb-2">
            <div className="font-semibold text-sm mb-2">Study Tools</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['Flashcards', 'Quiz', 'Case Studies', 'Practice', 'Outcomes', 'References'].map((t) => (
                <div key={t} className="rounded border border-white/10 bg-[#181b1f] px-2 py-1.5">{t}</div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-cyan-300/40 bg-cyan-900/20 p-3 text-xs">
            <strong>Atlas says:</strong> Nursing school is wild — one minute receptors, next minute IV rate math.
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ChapterReader;
