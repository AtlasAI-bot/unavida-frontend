import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Library, Search, UserCircle2, BookOpen } from 'lucide-react';

export const Bookshelf = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('unavidaTheme') || 'darkplus';
    setIsDarkMode(savedTheme !== 'light');
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    const nextTheme = nextDark ? (localStorage.getItem('unavidaThemeLastDark') || 'darkplus') : 'light';
    localStorage.setItem('unavidaTheme', nextTheme);
    if (nextDark) localStorage.setItem('unavidaThemeLastDark', nextTheme);
  };

  const palette = useMemo(() => {
    if (isDarkMode) {
      return {
        page: '#0f1113', sidebar: '#12171d', topbar: '#161d24', panel: '#1a222b', panel2: '#222c36',
        text: '#f5f7fa', muted: '#b7c2ce', border: 'rgba(255,255,255,.12)'
      };
    }
    return {
      page: '#edf2ff', sidebar: '#dce7ff', topbar: '#e7efff', panel: '#d8e3ff', panel2: '#c8d8ff',
      text: '#101827', muted: '#334155', border: '#9fb3e8'
    };
  }, [isDarkMode]);

  const books = [
    {
      id: 'NUR1100',
      title: 'Mastering Pharmacology',
      subtitle: 'NUR1100 • Pharmacology I',
      edition: 'Foundation Track',
      type: 'eBook',
      status: 'Continue Reading',
      meta: 'Chapter 1 in progress',
      cover: '/assets/mastering-pharmacology-cover.jpg',
    },
    {
      id: 'NUR2110',
      title: 'Mastering Pharmacology',
      subtitle: 'NUR2110 • Pharmacology II',
      edition: 'Advanced Track',
      type: 'eBook',
      status: 'Open',
      meta: 'Ready to start',
      cover: '/assets/mastering-pharmacology-cover.jpg',
    },
  ];

  const filteredBooks = books.filter((b) => `${b.title} ${b.subtitle} ${b.edition}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text, display: 'grid', gridTemplateColumns: '240px 1fr' }}>
      {/* Sidebar */}
      <aside style={{ background: palette.sidebar, borderRight: `1px solid ${palette.border}`, padding: 16, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ fontWeight: 900, color: '#39d0c8', marginBottom: 18 }}>UnaVida</div>

        <div style={{ display: 'grid', gap: 8 }}>
          <button onClick={() => navigate('/bookshelf')} style={{ display: 'flex', gap: 8, alignItems: 'center', border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}><Home size={16} /> Home</button>
          <button onClick={() => navigate('/bookshelf')} style={{ display: 'flex', gap: 8, alignItems: 'center', border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text, borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}><Library size={16} /> My Library</button>
          <button onClick={() => navigate('/student-dashboard')} style={{ display: 'flex', gap: 8, alignItems: 'center', border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, borderRadius: 8, padding: '8px 10px', cursor: 'pointer' }}><BookOpen size={16} /> Learning Hub</button>
        </div>

        <div style={{ marginTop: 16, fontSize: 12, color: palette.muted }}>Study Tools</div>
        <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
          <button onClick={() => navigate('/quizzes')} style={{ textAlign: 'left', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, padding: '7px 10px', cursor: 'pointer' }}>Quizzes</button>
          <button onClick={() => navigate('/flashcards')} style={{ textAlign: 'left', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, padding: '7px 10px', cursor: 'pointer' }}>Flashcards</button>
          <button onClick={() => navigate('/case-studies')} style={{ textAlign: 'left', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, padding: '7px 10px', cursor: 'pointer' }}>Case Studies</button>
          <button onClick={() => navigate('/video-library')} style={{ textAlign: 'left', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, padding: '7px 10px', cursor: 'pointer' }}>Video Library</button>
        </div>
      </aside>

      {/* Main */}
      <div>
        <header style={{ position: 'sticky', top: 0, zIndex: 30, background: palette.topbar, borderBottom: `1px solid ${palette.border}`, padding: '12px 18px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: 480 }}>
            <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: palette.muted }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in My Library..."
              style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text }}
            />
          </div>
          <button onClick={toggleTheme} style={{ padding: '7px 10px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}>{isDarkMode ? '☀️' : '🌙'}</button>
          <button onClick={() => navigate('/student-dashboard')} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}><UserCircle2 size={18} /> My Account</button>
        </header>

        <main style={{ padding: 20 }}>
          <h1 style={{ margin: '0 0 10px', fontSize: 30 }}>My Library</h1>

          <div style={{ border: `1px solid ${palette.border}`, borderRadius: 12, overflow: 'hidden', background: palette.panel }}>
            {filteredBooks.map((book, idx) => (
              <article
                key={book.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '76px 1fr auto',
                  gap: 12,
                  alignItems: 'center',
                  padding: 12,
                  borderTop: idx === 0 ? 'none' : `1px solid ${palette.border}`,
                  background: idx % 2 === 0 ? palette.panel : palette.panel2,
                }}
              >
                <button onClick={() => navigate(`/textbook/${book.id}`)} style={{ border: `1px solid ${palette.border}`, padding: 0, borderRadius: 6, overflow: 'hidden', cursor: 'pointer', background: '#0b1323', width: 64, height: 88 }}>
                  <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>

                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{ fontSize: 11, borderRadius: 999, padding: '2px 8px', border: `1px solid ${palette.border}`, background: palette.page }}>{book.type}</span>
                  </div>
                  <div style={{ fontWeight: 800 }}>{book.title}</div>
                  <div style={{ fontSize: 13, color: palette.muted }}>{book.subtitle}</div>
                  <div style={{ fontSize: 12, color: palette.muted }}>{book.edition} • {book.meta}</div>
                </div>

                <button onClick={() => navigate(`/textbook/${book.id}`)} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: '#39d0c8', color: '#032320', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  {book.status}
                </button>
              </article>
            ))}

            {filteredBooks.length === 0 && (
              <div style={{ padding: 14, color: palette.muted }}>No books match your search.</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Bookshelf;
