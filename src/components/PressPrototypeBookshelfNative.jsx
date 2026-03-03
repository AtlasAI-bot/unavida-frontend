import React, { useMemo, useState } from 'react';

const textbooks = [
  { title: 'Pharmacology I', code: 'NUR1100 • 13 chapters', badge: 'In Progress' },
  { title: 'Medical-Surgical Nursing', code: 'NUR2300 • 24 chapters', badge: 'New' },
  { title: 'Maternal-Child', code: 'NUR2200 • 18 chapters', badge: 'Continue' },
  { title: 'Psychiatric Nursing', code: 'NUR2400 • 16 chapters', badge: 'Saved' },
];

const chapterLineup = [
  { id: '1.0', title: 'Overview & Introduction', meta: 'Ready • 25 min • Intro video available', cta: 'Open' },
  { id: '1.1', title: 'Definition & Scope', meta: 'Ready • 20 min • Video + image set', cta: 'Open' },
  { id: '1.6', title: 'Pharmacokinetics vs Pharmacodynamics', meta: 'In progress • 45 min • Video live', cta: 'Continue' },
  { id: '1.11', title: 'Review Questions & Assessment', meta: 'Not started • Quiz + case studies', cta: 'Start' },
];

export const PressPrototypeBookshelfNative = () => {
  const [darkPlus, setDarkPlus] = useState(false);

  const palette = useMemo(() => {
    if (darkPlus) {
      return {
        page: 'bg-black text-slate-100',
        card: 'bg-slate-900 border-slate-800',
        muted: 'text-slate-300',
        chip: 'bg-cyan-700/40 text-cyan-200',
      };
    }
    return {
      page: 'bg-slate-950 text-white',
      card: 'bg-slate-900/60 border-slate-700',
      muted: 'text-slate-300',
      chip: 'bg-cyan-600/30 text-cyan-100',
    };
  }, [darkPlus]);

  return (
    <div className={`h-full overflow-auto ${palette.page}`}>
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <section className={`rounded-2xl border ${palette.card} p-6`}>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="text-3xl font-bold">Pharmacology, but make it binge-worthy.</h2>
              <p className={`${palette.muted} mt-2 max-w-3xl`}>
                Netflix-style discovery + nursing-school structure. Pick a textbook, jump into chapters like episodes,
                and keep progress moving with flashcards, case studies, and quick checks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDarkPlus((v) => !v)}
              className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
            >
              {darkPlus ? '🌙 Dark Mode' : '🖤 Dark+ Mode'}
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-3">Popular This Term</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {textbooks.map((book) => (
              <article key={book.title} className={`rounded-xl border ${palette.card} p-4`}>
                <div className="h-28 rounded-lg bg-gradient-to-br from-cyan-800/40 to-indigo-900/40 mb-3 flex items-center justify-center text-sm text-slate-300">
                  Cover
                </div>
                <h4 className="font-semibold">{book.title}</h4>
                <p className={`text-sm ${palette.muted}`}>{book.code}</p>
                <span className={`inline-block mt-2 text-xs px-2 py-1 rounded ${palette.chip}`}>{book.badge}</span>
              </article>
            ))}
          </div>
        </section>

        <section className={`rounded-2xl border ${palette.card} p-6`}>
          <h3 className="text-xl font-semibold">Pharmacology I — Chapter Lineup</h3>
          <p className={`text-sm ${palette.muted} mt-1 mb-4`}>
            Click-to-open chapter episodes with progress state and quick tools.
          </p>

          <div className="space-y-3">
            {chapterLineup.map((ch) => (
              <div key={ch.id} className="rounded-xl border border-slate-700 p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-semibold">
                    {ch.id}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{ch.title}</p>
                    <p className={`text-sm ${palette.muted} truncate`}>{ch.meta}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold">{ch.cta}</button>
              </div>
            ))}
          </div>

          <p className="mt-5 text-sm text-slate-200">
            <strong>Atlas corner:</strong> “Think of chapters like episodes—except skipping this one won’t ruin the plot, it’ll ruin your med pass.”
          </p>
        </section>
      </div>
    </div>
  );
};

export default PressPrototypeBookshelfNative;
