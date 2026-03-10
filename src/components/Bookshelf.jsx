import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Sparkles,
  UserCircle2,
  Store,
  MoreHorizontal,
  HelpCircle,
  Ticket,
  MessageCircle,
  X,
  Star,
  ExternalLink,
  Copy,
} from 'lucide-react';

export const Bookshelf = () => {
  const navigate = useNavigate();
  const [activeShelf, setActiveShelf] = useState('library');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [detailsBookId, setDetailsBookId] = useState(null);
  const [favorites, setFavorites] = useState(new Set());

  const palette = useMemo(
    () => ({
      page: '#f3f4f7',
      sidebar: '#ffffff',
      topbar: '#f3f4f7',
      card: '#ffffff',
      text: '#111827',
      muted: '#6b7280',
      border: '#e5e7eb',
      active: '#dff4fb',
      activeBar: '#0ea5c6',
    }),
    []
  );

  const allBooks = [
    {
      id: 'NUR1100',
      title: 'Mastering Pharmacology',
      subtitle: 'Used in NUR1100 and NUR2110',
      edition: 'Nursing Education Series',
      badges: ['NUR1100', 'NUR2110', 'eBook'],
      cover: '/assets/mastering-pharmacology-cover.jpg',
      route: '/textbook/NUR1100',
      authors: 'UnaVida Academic Team',
      publisher: 'UnaVida Press',
      copyright: '2026',
      format: 'ePub',
      vbid: 'NUR1100-UNAVIDA',
      url: 'https://unavida-frontend.vercel.app/textbook/NUR1100',
      description:
        'Mastering Pharmacology is a comprehensive nursing pharmacology experience designed across NUR1100 and NUR2110. It blends core medication science with bedside clinical judgment through structured chapter reading, interactive videos, adaptive quizzes, flashcard practice, and scenario-based case studies. Students build confidence in safe administration, dosage reasoning, pharmacokinetics/pharmacodynamics, and patient-centered medication decision-making as they progress from foundational to advanced coursework.',
    },
    {
      id: 'NUR1000',
      title: 'Fundamentals of Nursing',
      subtitle: 'Placeholder Cover',
      edition: 'Nursing Education Series',
      badges: ['NUR1000', 'eBook'],
      cover: '/assets/covers/nur1000-fundamentals-of-nursing.jpg',
      route: '/textbook/NUR1100',
      authors: 'UnaVida Academic Team',
      publisher: 'UnaVida Press',
      copyright: '2026',
      format: 'ePub',
      vbid: 'NUR1000-PLACEHOLDER',
      url: 'https://unavida-frontend.vercel.app/textbook/NUR1100',
      description: 'Fundamentals of Nursing introduces essential nursing principles that support safe, compassionate, and evidence-based patient care. Planned content focuses on foundational skills, communication, safety, infection prevention, clinical reasoning, and professionalism across care settings. This title is positioned as an early-sequence course anchor to help students develop confidence before entering complex specialty coursework.'
    },
    {
      id: 'NUR2200',
      title: 'Maternal Nursing Care',
      subtitle: 'Placeholder Cover',
      edition: 'Nursing Education Series',
      badges: ['NUR2200', 'eBook'],
      cover: '/assets/covers/nur2200-maternal-nursing-care.jpg',
      route: '/textbook/NUR1100',
      authors: 'UnaVida Academic Team',
      publisher: 'UnaVida Press',
      copyright: '2026',
      format: 'ePub',
      vbid: 'NUR2200-PLACEHOLDER',
      url: 'https://unavida-frontend.vercel.app/textbook/NUR1100',
      description: 'Maternal Nursing Care centers on pregnancy, labor, delivery, postpartum care, and newborn stabilization, with emphasis on family-centered and culturally responsive nursing practice. Planned modules include prenatal assessment, high-risk pregnancy warning signs, maternal complications, neonatal transition, and interdisciplinary communication for safer outcomes. The learning design supports both theory mastery and real-world bedside readiness.'
    },
    {
      id: 'NUR2300',
      title: 'Pediatric Nursing',
      subtitle: 'Placeholder Cover',
      edition: 'Nursing Education Series',
      badges: ['NUR2300', 'eBook'],
      cover: '/assets/covers/nur2300-pediatric-nursing.jpg',
      route: '/textbook/NUR1100',
      authors: 'UnaVida Academic Team',
      publisher: 'UnaVida Press',
      copyright: '2026',
      format: 'ePub',
      vbid: 'NUR2300-PLACEHOLDER',
      url: 'https://unavida-frontend.vercel.app/textbook/NUR1100',
      description: 'Pediatric Nursing is focused on age-specific nursing care from infancy through adolescence, integrating growth and development with clinical assessment, family education, and safety planning. Planned content includes medication considerations for children, pediatric communication strategies, common acute and chronic conditions, and prevention-oriented care. The course emphasizes clinical judgment that balances child physiology, family dynamics, and developmental needs.'
    },
    {
      id: 'NUR2400',
      title: 'Medical-Surgical Nursing',
      subtitle: 'Placeholder Cover',
      edition: 'Nursing Education Series',
      badges: ['NUR2400', 'eBook'],
      cover: '/assets/covers/nur2400-medical-surgical-nursing.jpg',
      route: '/textbook/NUR1100',
      authors: 'UnaVida Academic Team',
      publisher: 'UnaVida Press',
      copyright: '2026',
      format: 'ePub',
      vbid: 'NUR2400-PLACEHOLDER',
      url: 'https://unavida-frontend.vercel.app/textbook/NUR1100',
      description: 'Medical-Surgical Nursing prepares students to manage adult patients across diverse acute and chronic health conditions using systematic assessment, prioritization, and intervention frameworks. Planned coverage includes cardiovascular, respiratory, endocrine, renal, neurologic, and perioperative care with strong focus on deterioration recognition and escalation. Students practice translating pathophysiology into safe nursing action, patient education, and coordinated team-based care.'
    },
    {
      id: 'NUR2500',
      title: 'Psychiatric Nursing',
      subtitle: 'Placeholder Cover',
      edition: 'Nursing Education Series',
      badges: ['NUR2500', 'eBook'],
      cover: '/assets/covers/nur2500-psychiatric-nursing.jpg',
      route: '/textbook/NUR1100',
      authors: 'UnaVida Academic Team',
      publisher: 'UnaVida Press',
      copyright: '2026',
      format: 'ePub',
      vbid: 'NUR2500-PLACEHOLDER',
      url: 'https://unavida-frontend.vercel.app/textbook/NUR1100',
      description: 'Psychiatric Nursing addresses mental health assessment, therapeutic communication, psychopharmacology safety, crisis management, and trauma-informed care across inpatient and community settings. Planned modules include anxiety and mood disorders, psychosis, substance use, suicide risk screening, and legal/ethical standards in behavioral health. The course is designed to strengthen stigma-free practice and patient-centered mental health advocacy.'
    },
    {
      id: 'NUR2900',
      title: 'Nursing Leadership',
      subtitle: 'Placeholder Cover',
      edition: 'Nursing Education Series',
      badges: ['NUR2900', 'eBook'],
      cover: '/assets/covers/nur2900-nursing-leadership.jpg',
      route: '/textbook/NUR1100',
      authors: 'UnaVida Academic Team',
      publisher: 'UnaVida Press',
      copyright: '2026',
      format: 'ePub',
      vbid: 'NUR2900-PLACEHOLDER',
      url: 'https://unavida-frontend.vercel.app/textbook/NUR1100',
      description: 'Nursing Leadership develops the management and leadership competencies needed for safe unit operations, effective delegation, quality improvement, and interprofessional collaboration. Planned content includes staffing decisions, communication under pressure, conflict resolution, ethical leadership, and systems thinking in nursing practice. Students build readiness to lead teams, coordinate care delivery, and support positive patient and organizational outcomes.'
    },
  ];

  const books = activeShelf === 'favorites' ? allBooks.filter((b) => favorites.has(b.id)) : allBooks;
  const detailsBook = allBooks.find((b) => b.id === detailsBookId) || null;

  const toggleFavorite = (bookId) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(bookId)) next.delete(bookId);
      else next.add(bookId);
      return next;
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text, display: 'grid', gridTemplateColumns: '185px 1fr' }}>
      <aside style={{ background: palette.sidebar, borderRight: `1px solid ${palette.border}`, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px 14px', borderBottom: `1px solid ${palette.border}`, fontWeight: 700, fontSize: 23, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#f59e0b', fontSize: 16 }}>▮</span>
          <span style={{ fontSize: 24 }}>Bookshelf</span>
        </div>

        <nav style={{ padding: 12, display: 'grid', gap: 4 }}>
          <button onClick={() => navigate('/bookshelf')} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', padding: '8px 9px', borderRadius: 6, cursor: 'pointer', color: palette.text, fontSize: 13 }}><Home size={15} /> Home</button>
          <button onClick={() => navigate('/bookshelf')} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', padding: '8px 9px', borderRadius: 6, cursor: 'pointer', color: palette.text, fontSize: 13 }}><Search size={15} /> Search</button>
          <button onClick={() => navigate('/student-dashboard')} style={{ display: 'flex', alignItems: 'center', gap: 8, border: 'none', background: 'transparent', padding: '8px 9px', borderRadius: 6, cursor: 'pointer', color: palette.text, fontSize: 13 }}><Sparkles size={15} /> Recommendations</button>
        </nav>

        <div style={{ marginTop: 8, padding: '0 14px', fontSize: 12, fontWeight: 700, color: palette.muted }}>MY SHELVES</div>
        <div style={{ marginTop: 6 }}>
          <button onClick={() => setActiveShelf('library')} style={{ width: '100%', textAlign: 'left', border: 'none', background: activeShelf === 'library' ? palette.active : 'transparent', borderRight: activeShelf === 'library' ? `3px solid ${palette.activeBar}` : 'none', padding: '10px 14px', fontSize: 13, fontWeight: activeShelf === 'library' ? 700 : 500, cursor: 'pointer', color: palette.text }}>My Library</button>
          <button onClick={() => setActiveShelf('favorites')} style={{ width: '100%', textAlign: 'left', border: 'none', background: activeShelf === 'favorites' ? palette.active : 'transparent', borderRight: activeShelf === 'favorites' ? `3px solid ${palette.activeBar}` : 'none', padding: '10px 14px', fontSize: 13, fontWeight: activeShelf === 'favorites' ? 700 : 500, cursor: 'pointer', color: palette.text }}>Favorites</button>
        </div>

        <div style={{ marginTop: 'auto', padding: 12, borderTop: `1px solid ${palette.border}`, display: 'grid', gap: 6 }}>
          <button style={{ border: `1px solid ${palette.border}`, background: '#f9fafb', borderRadius: 6, padding: '7px 9px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><Store size={14} /> Store</button>
          <button style={{ border: 'none', background: 'transparent', textAlign: 'left', fontSize: 12, color: palette.muted, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><Ticket size={14} /> Redeem Code</button>
          <button style={{ border: 'none', background: 'transparent', textAlign: 'left', fontSize: 12, color: palette.muted, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><HelpCircle size={14} /> Help</button>
          <button style={{ border: 'none', background: 'transparent', textAlign: 'left', fontSize: 12, color: palette.muted, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><MessageCircle size={14} /> Feedback</button>
        </div>
      </aside>

      <div>
        <header style={{ height: 58, borderBottom: `1px solid ${palette.border}`, background: palette.topbar, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 16px', gap: 8 }}>
          <button style={{ border: `1px solid ${palette.border}`, background: '#fff', borderRadius: 7, padding: '7px 10px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}><Store size={14} /> Store</button>
          <button onClick={() => navigate('/student-dashboard')} style={{ border: `1px solid ${palette.border}`, background: '#fff', borderRadius: 7, padding: '7px 9px', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}><UserCircle2 size={18} /></button>
        </header>

        <main style={{ padding: '20px 24px' }}>
          <h1 style={{ margin: '0 0 18px', fontSize: 34, fontWeight: 700 }}>My Library</h1>

          <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 22 }}>
            {books.map((book) => {
              const isFav = favorites.has(book.id);
              return (
                <article key={book.id} style={{ position: 'relative' }}>
                  <button
                    onClick={() => navigate(book.route)}
                    style={{ width: '100%', aspectRatio: '0.74', border: `1px solid ${palette.border}`, borderRadius: 6, overflow: 'hidden', background: '#fff', padding: 0, cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,.08)' }}
                  >
                    <img src={book.cover} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>

                  <div style={{ marginTop: 8, display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                    {book.badges.map((badge) => (
                      <span key={badge} style={{ fontSize: 11, borderRadius: 999, border: `1px solid ${palette.border}`, background: '#f9fafb', padding: '2px 8px' }}>{badge}</span>
                    ))}
                    <button onClick={() => setOpenMenuId((id) => (id === book.id ? null : book.id))} style={{ marginLeft: 'auto', border: 'none', background: 'transparent', cursor: 'pointer', color: palette.muted }}><MoreHorizontal size={18} /></button>
                  </div>

                  {openMenuId === book.id && (
                    <div style={{ position: 'absolute', right: 0, top: 190, background: '#fff', border: `1px solid ${palette.border}`, borderRadius: 8, boxShadow: '0 10px 24px rgba(0,0,0,.14)', zIndex: 10, minWidth: 170 }}>
                      <button onClick={() => { navigate(book.route); setOpenMenuId(null); }} style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', padding: '9px 10px', cursor: 'pointer' }}>Open Book</button>
                      <button onClick={() => { setDetailsBookId(book.id); setOpenMenuId(null); }} style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', padding: '9px 10px', cursor: 'pointer' }}>Book Details</button>
                      <button onClick={() => { toggleFavorite(book.id); setOpenMenuId(null); }} style={{ width: '100%', textAlign: 'left', border: 'none', background: 'transparent', padding: '9px 10px', cursor: 'pointer' }}>{isFav ? 'Remove from Favorites' : 'Add to Favorites'}</button>
                    </div>
                  )}

                  <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4, lineHeight: 1.25 }}>{book.title}</div>
                  <div style={{ fontSize: 13, color: palette.muted, marginTop: 2 }}>{book.subtitle}</div>
                  <div style={{ fontSize: 13, color: palette.muted, marginTop: 2 }}>{book.edition}</div>
                </article>
              );
            })}
          </section>
        </main>
      </div>

      {detailsBook && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,.35)', zIndex: 70 }} onClick={() => setDetailsBookId(null)}>
          <aside
            onClick={(e) => e.stopPropagation()}
            style={{ position: 'absolute', right: 0, top: 0, height: '100%', width: 430, background: '#fff', borderLeft: `1px solid ${palette.border}`, boxShadow: '-10px 0 24px rgba(0,0,0,.15)', display: 'flex', flexDirection: 'column' }}
          >
            <div style={{ padding: 14, borderBottom: `1px solid ${palette.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Book Details</strong>
              <button onClick={() => setDetailsBookId(null)} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}><X size={18} /></button>
            </div>

            <div style={{ padding: 14, overflow: 'auto' }}>
              <img src={detailsBook.cover} alt={detailsBook.title} style={{ width: 120, borderRadius: 8, border: `1px solid ${palette.border}`, marginBottom: 10 }} />
              <h2 style={{ margin: '0 0 4px', fontSize: 22 }}>{detailsBook.title}</h2>
              <div style={{ color: palette.muted, marginBottom: 12 }}>{detailsBook.edition}</div>

              <div style={{ borderTop: `1px solid ${palette.border}`, paddingTop: 10, display: 'grid', gap: 8, fontSize: 14 }}>
                <div><strong>Author(s):</strong> {detailsBook.authors}</div>
                <div><strong>Publisher:</strong> {detailsBook.publisher}</div>
                <div><strong>Copyright:</strong> {detailsBook.copyright}</div>
                <div><strong>Format:</strong> {detailsBook.format}</div>
                <div><strong>VBID:</strong> {detailsBook.vbid}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <strong>URL:</strong>
                  <a href={detailsBook.url} target="_blank" rel="noreferrer" style={{ color: '#0ea5c6' }}>{detailsBook.url}</a>
                  <button onClick={() => navigator.clipboard?.writeText(detailsBook.url)} style={{ border: `1px solid ${palette.border}`, background: '#fff', borderRadius: 6, padding: '4px 6px', cursor: 'pointer' }}><Copy size={14} /></button>
                  <button onClick={() => window.open(detailsBook.url, '_blank')} style={{ border: `1px solid ${palette.border}`, background: '#fff', borderRadius: 6, padding: '4px 6px', cursor: 'pointer' }}><ExternalLink size={14} /></button>
                </div>
              </div>

              <div style={{ marginTop: 14, borderTop: `1px solid ${palette.border}`, paddingTop: 10 }}>
                <h3 style={{ margin: '0 0 8px', fontSize: 16 }}>Description</h3>
                <p style={{ margin: 0, color: '#374151', lineHeight: 1.5 }}>{detailsBook.description}</p>
              </div>

              <button
                onClick={() => {
                  toggleFavorite(detailsBook.id);
                }}
                style={{ marginTop: 14, border: `1px solid ${palette.border}`, background: '#fff', borderRadius: 8, padding: '8px 10px', display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}
              >
                <Star size={14} /> {favorites.has(detailsBook.id) ? 'Remove from Favorites' : 'Add to Favorites'}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Bookshelf;
