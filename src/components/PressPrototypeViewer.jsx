import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const pages = {
  bookshelf: '/press-demo/bookshelf_offline_redesign_demo.html',
  textbook: '/press-demo/bookshelf_offline_redesign_pharmacology_detail.html',
  reader: '/press-demo/bookshelf_offline_redesign_chapter_1_6_reader.html',
};

export const PressPrototypeViewer = () => {
  const navigate = useNavigate();
  const [search] = useSearchParams();
  const page = search.get('page') || 'bookshelf';
  const src = pages[page] || pages.bookshelf;

  return (
    <div className="h-screen bg-slate-950 text-white flex flex-col">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-lg">UnaVida Press • Production Prototype</h1>
          <p className="text-xs text-slate-300">Nursing Education & Curriculum Publishing</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/press/prototype?page=bookshelf')} className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-sm">Bookshelf</button>
          <button onClick={() => navigate('/press/prototype?page=textbook')} className="px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-sm">Textbook</button>
          <button onClick={() => navigate('/press/prototype?page=reader')} className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-sm font-semibold">Reader</button>
          <button onClick={() => navigate('/bookshelf')} className="px-3 py-1.5 rounded border border-slate-500 text-sm">Back</button>
        </div>
      </div>

      <iframe title="UnaVida Press Prototype" src={src} className="flex-1 w-full border-0 bg-white" />
    </div>
  );
};

export default PressPrototypeViewer;
