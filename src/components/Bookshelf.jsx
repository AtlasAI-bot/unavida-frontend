import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Library, BookOpen, UserCircle2, Settings, LogOut } from 'lucide-react';

export const Bookshelf = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);

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
        page: '#0f1113',
        sidebar: '#11161b',
        topbar: '#141a20',
        panel: '#181f26',
        panel2: '#232c35',
        text: '#f5f7fa',
        muted: '#b9c3cf',
        border: 'rgba(255,255,255,.12)',
      };
    }
    return {
      page: '#edf2ff',
      sidebar: '#dce7ff',
      topbar: '#e7efff',
      panel: '#d8e3ff',
      panel2: '#c8d8ff',
      text: '#101827',
      muted: '#334155',
      border: '#9fb3e8',
    };
  }, [isDarkMode]);

  const bookCovers = {
    NUR1100: '/assets/mastering-pharmacology-cover.jpg',
    NUR2110: '/assets/mastering-pharmacology-cover.jpg',
  };

  const textbooks = [
    {
      id: 'NUR1100',
      title: 'Mastering Pharmacology',
      subtitle: 'NUR1100 • Pharmacology I',
      edition: 'Foundation Track',
      progress: 'Chapter 1 active',
    },
    {
      id: 'NUR2110',
      title: 'Mastering Pharmacology',
      subtitle: 'NUR2110 • Pharmacology II',
      edition: 'Advanced Track',
      progress: 'Ready to begin',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text, display: 'grid', gridTemplateColumns: '240px 1fr' }}>
      {/* Left Sidebar */}
      <aside style={{ background: palette.sidebar, borderRight: `1px solid ${palette.border}`, padding: 16, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ fontWeight: 900, color: '#39d0c8', letterSpacing: 0.3, marginBottom: 18 }}>UnaVida</div>

        <nav style={{ display: 'grid', gap: 8 }}>
          {[
            { label: 'Home', icon: <Home size={16} />, onClick: () => navigate('/bookshelf') },
            { label: 'My Library', icon: <Library size={16} />, onClick: () => navigate('/bookshelf') },
            { label: 'Continue Learning', icon: <BookOpen size={16} />, onClick: () => navigate('/textbook/NUR1100') },
          ].map((item) => (
            <button
              key={item.label}
              onClick={item.onClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                textAlign: 'left',
                borderRadius: 8,
                border: `1px solid ${palette.border}`,
                background: palette.panel,
                color: palette.text,
                padding: '8px 10px',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 16, fontSize: 12, color: palette.muted }}>My Shelves</div>
        <div style={{ display: 'grid', gap: 6, marginTop: 8 }}>
          <button onClick={() => navigate('/bookshelf')} style={{ textAlign: 'left', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text, padding: '7px 10px', cursor: 'pointer' }}>My Library</button>
          <button onClick={() => navigate('/workbook')} style={{ textAlign: 'left', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text, padding: '7px 10px', cursor: 'pointer' }}>Bookmarks + Highlights</button>
        </div>
      </aside>

      {/* Main Content */}
      <div>
        {/* Top Bar */}
        <header style={{ position: 'sticky', top: 0, zIndex: 30, background: palette.topbar, borderBottom: `1px solid ${palette.border}`, padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 13, color: palette.muted }}>Bookshelf / Mastering Pharmacology</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button onClick={toggleTheme} style={{ padding: '7px 10px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}>
              {isDarkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button onClick={() => navigate('/student-dashboard')} title="Account" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}>
              <UserCircle2 size={18} />
              Account
            </button>
          </div>
        </header>

        <main style={{ padding: 20 }}>
          <h1 style={{ margin: '0 0 6px', fontSize: 30 }}>My Library</h1>
          <p style={{ margin: '0 0 16px', color: palette.muted }}>Select a textbook to continue your learning.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,320px))', gap: 18 }}>
            {textbooks.map((book) => (
              <article key={book.id} style={{ display: 'grid', gridTemplateColumns: '20px 1fr', height: 290 }}>
                {/* Spine */}
                <div style={{ borderRadius: '8px 0 0 8px', border: `1px solid ${palette.border}`, borderRight: 'none', background: isDarkMode ? 'linear-gradient(180deg,#1e293b,#111827)' : 'linear-gradient(180deg,#b6c8f5,#8fb0ee)' }} />

                {/* Cover */}
                <button
                  onClick={() => navigate(`/textbook/${book.id}`)}
                  style={{
                    textAlign: 'left',
                    border: `1px solid ${palette.border}`,
                    borderRadius: '0 10px 10px 0',
                    background: palette.panel,
                    padding: 0,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    boxShadow: isDarkMode ? '0 12px 26px rgba(0,0,0,.35)' : '0 10px 20px rgba(77,99,158,.22)',
                  }}
                >
                  <div style={{ height: 170, background: '#0b1323', position: 'relative' }}>
                    {bookCovers[book.id] ? (
                      <img src={bookCovers[book.id]} alt={`${book.title} cover`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#0f172a,#1d4ed8,#06b6d4)' }} />
                    )}
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 45%, rgba(0,0,0,.45))' }} />
                  </div>

                  <div style={{ padding: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{book.title}</div>
                    <div style={{ fontSize: 13, color: palette.muted, marginBottom: 4 }}>{book.subtitle}</div>
                    <div style={{ fontSize: 12, color: palette.muted }}>{book.edition}</div>
                    <div style={{ marginTop: 10, display: 'inline-block', fontSize: 11, borderRadius: 999, padding: '3px 8px', border: `1px solid ${palette.border}`, background: palette.panel2 }}>{book.progress}</div>
                  </div>
                </button>
              </article>
            ))}
          </div>

          <section style={{ marginTop: 24, display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 10 }}>
            {[
              { label: 'Quizzes', onClick: () => navigate('/quizzes') },
              { label: 'Flashcards', onClick: () => navigate('/flashcards') },
              { label: 'Case Studies', onClick: () => navigate('/case-studies') },
              { label: 'Video Library', onClick: () => navigate('/video-library') },
              { label: 'Learning Hub', onClick: () => navigate('/student-dashboard') },
              { label: 'Settings', onClick: () => navigate('/student-dashboard'), icon: <Settings size={14} /> },
            ].map((item) => (
              <button key={item.label} onClick={item.onClick} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, padding: '10px 12px', cursor: 'pointer' }}>
                <span>{item.label}</span>
                {item.icon || <span style={{ color: palette.muted }}>→</span>}
              </button>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Bookshelf;
