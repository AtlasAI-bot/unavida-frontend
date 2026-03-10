import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Search, Sparkles, UserCircle2, Store, MoreHorizontal, HelpCircle, Ticket, MessageCircle } from 'lucide-react';

export const Bookshelf = () => {
  const navigate = useNavigate();

  const palette = useMemo(() => ({
    page: '#f3f4f7',
    sidebar: '#ffffff',
    topbar: '#f3f4f7',
    card: '#ffffff',
    text: '#111827',
    muted: '#6b7280',
    border: '#e5e7eb',
    active: '#dff4fb',
    activeBar: '#0ea5c6',
  }), []);

  // Single textbook per product rule (shared across NUR1100 + NUR2110)
  const books = [
    {
      id: 'NUR1100',
      title: 'Mastering Pharmacology',
      subtitle: 'Used in NUR1100 and NUR2110',
      edition: '9th Edition',
      badges: ['eBook'],
      cover: '/assets/mastering-pharmacology-cover.jpg',
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text, display: 'grid', gridTemplateColumns: '185px 1fr' }}>
      {/* Left rail */}
      <aside style={{ background: palette.sidebar, borderRight: `1px solid ${palette.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 14px', borderBottom: `1px solid ${palette.border}`, fontWeight: 700, fontSize: 23, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#f59e0b', fontSize: 16 }}>▮</span>
          <span style={{ fontSize: 24 }}>Bookshelf</span>
        </div>

        <nav style={{ padding: 12, display: 'grid', gap: 4 }}>
          <button onClick={() => navigate('/bookshelf')} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', padding: '8px 9px', borderRadius: 6, cursor: 'pointer', color: palette.text, fontSize: 13 }}>
            <Home size={15} /> Home
          </button>
          <button onClick={() => navigate('/bookshelf')} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', padding: '8px 9px', borderRadius: 6, cursor: 'pointer', color: palette.text, fontSize: 13 }}>
            <Search size={15} /> Search
          </button>
          <button onClick={() => navigate('/student-dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', padding: '8px 9px', borderRadius: 6, cursor: 'pointer', color: palette.text, fontSize: 13 }}>
            <Sparkles size={15} /> Recommendations
          </button>
        </nav>

        <div style={{ marginTop: 8, padding: '0 14px', fontSize: 12, fontWeight: 700, color: palette.muted }}>MY SHELVES</div>
        <div style={{ marginTop: 6 }}>
          <button style={{ width: '100%', textAlign: 'left', border: 'none', background: palette.active, borderRight: `3px solid ${palette.activeBar}`, padding: '10px 14px', fontSize: 13, fontWeight: 700, cursor: 'pointer', color: palette.text }}>
            My Library
          </button>
          <button style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', padding: '10px 14px', fontSize: 13, cursor: 'pointer', color: palette.text }}>
            Favorites
          </button>
        </div>

        <div style={{ marginTop: 'auto', padding: 12, borderTop: `1px solid ${palette.border}`, display: 'grid', gap: 6 }}>
          <button style={{ border: `1px solid ${palette.border}`, background: '#f9fafb', borderRadius: 6, padding: '7px 9px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><Store size={14} /> Store</button>
          <button style={{ border: 'none', background: 'transparent', textAlign: 'left', fontSize: 12, color: palette.muted, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><Ticket size={14} /> Redeem Code</button>
          <button style={{ border: 'none', background: 'transparent', textAlign: 'left', fontSize: 12, color: palette.muted, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><HelpCircle size={14} /> Help</button>
          <button style={{ border: 'none', background: 'transparent', textAlign: 'left', fontSize: 12, color: palette.muted, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><MessageCircle size={14} /> Feedback</button>
        </div>
      </aside>

      {/* Main */}
      <div>
        <header style={{ height: 58, borderBottom: `1px solid ${palette.border}`, background: palette.topbar, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 16px', gap: 8 }}>
          <button style={{ border: `1px solid ${palette.border}`, background: '#fff', borderRadius: 7, padding: '7px 10px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
            <Store size={14} /> Store
          </button>
          <button onClick={() => navigate('/student-dashboard')} style={{ border: `1px solid ${palette.border}`, background: '#fff', borderRadius: 7, padding: '7px 9px', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
            <UserCircle2 size={18} />
          </button>
        </header>

        <main style={{ padding: '20px 24px' }}>
          <h1 style={{ margin: '0 0 18px', fontSize: 34, fontWeight: 700 }}>My Library</h1>

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 22 }}>
            {books.map((book) => (
              <article key={book.id}>
                <button
                  onClick={() => navigate('/textbook/NUR1100')}
                  style={{
                    width: '100%',
                    aspectRatio: '0.74',
                    border: `1px solid ${palette.border}`,
                    borderRadius: 6,
                    overflow: 'hidden',
                    background: '#fff',
                    padding: 0,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,.08)',
                  }}
                >
                  <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </button>

                <div style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center' }}>
                  {book.badges.map((badge) => (
                    <span key={badge} style={{ fontSize: 11, borderRadius: 999, border: `1px solid ${palette.border}`, background: '#f9fafb', padding: '2px 8px' }}>{badge}</span>
                  ))}
                  <button style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', color: palette.muted }}>
                    <MoreHorizontal size={18} />
                  </button>
                </div>

                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, lineHeight: 1.25 }}>{book.title}</div>
                <div style={{ fontSize: 13, color: palette.muted, marginTop: 2 }}>{book.subtitle}</div>
                <div style={{ fontSize: 13, color: palette.muted, marginTop: 2 }}>{book.edition}</div>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Bookshelf;
