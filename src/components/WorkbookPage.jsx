import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const priorityColor = (priority = '') => {
  const p = String(priority).toLowerCase();
  if (p === 'high') return '#f97316';
  if (p === 'low') return '#22c55e';
  return '#facc15';
};

export const WorkbookPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCourse, setActiveCourse] = useState('NUR1100');
  const [tab, setTab] = useState('bookmarks');
  const [bookmarks, setBookmarks] = useState([]);
  const [highlights, setHighlights] = useState([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('unavidaTheme') || 'darkplus';
    setIsDarkMode(savedTheme !== 'light');

    try {
      const storedBookmarks = JSON.parse(localStorage.getItem('unavida:bookmarks') || '[]');
      const normalizedBookmarks = storedBookmarks
        .filter((entry) => typeof entry === 'object' && entry)
        .map((entry, index) => ({
          id: entry.id || `${entry.sectionId || 'bookmark'}-${index}`,
          sectionId: entry.sectionId || '',
          sectionLabel: entry.sectionLabel || entry.sectionId || 'Unknown section',
          marker: entry.marker || '',
          createdAt: entry.createdAt || null,
        }));
      setBookmarks(normalizedBookmarks);
    } catch {
      setBookmarks([]);
    }

    try {
      const storedHighlights = JSON.parse(localStorage.getItem('unavida:annotations') || '[]');
      const normalizedHighlights = storedHighlights
        .filter((entry) => typeof entry === 'object' && entry)
        .map((entry, index) => ({
          id: entry.id || `${entry.sectionId || 'highlight'}-${index}`,
          sectionId: entry.sectionId || '',
          sectionLabel: entry.sectionLabel || entry.sectionId || 'Unknown section',
          text: entry.text || '',
          color: entry.color || 'yellow',
          priority: entry.priority || 'Medium',
          createdAt: entry.createdAt || null,
        }));
      setHighlights(normalizedHighlights);
    } catch {
      setHighlights([]);
    }
  }, []);

  const palette = useMemo(() => {
    if (isDarkMode) {
      return {
        page: '#0f1113',
        panel: '#181b1f',
        panel2: '#22262b',
        text: '#f5f7fa',
        muted: '#c5cbd3',
        border: 'rgba(255,255,255,.12)',
      };
    }
    return {
      page: '#edf2ff',
      panel: '#d8e3ff',
      panel2: '#c8d8ff',
      text: '#101827',
      muted: '#334155',
      border: '#9fb3e8',
    };
  }, [isDarkMode]);

  const saveBookmarks = (next) => {
    setBookmarks(next);
    localStorage.setItem('unavida:bookmarks', JSON.stringify(next));
  };

  const saveHighlights = (next) => {
    setHighlights(next);
    localStorage.setItem('unavida:annotations', JSON.stringify(next));
  };

  const editBookmark = (itemId) => {
    const current = bookmarks.find((item) => item.id === itemId);
    if (!current) return;
    const updatedMarker = window.prompt('Edit bookmark label:', current.marker || '');
    if (updatedMarker === null) return;
    const next = bookmarks.map((item) => (item.id === itemId ? { ...item, marker: updatedMarker.trim() } : item));
    saveBookmarks(next);
  };

  const removeBookmark = (itemId) => {
    if (!window.confirm('Delete this bookmark?')) return;
    const next = bookmarks.filter((item) => item.id !== itemId);
    saveBookmarks(next);
  };

  const editHighlight = (itemId) => {
    const current = highlights.find((item) => item.id === itemId);
    if (!current) return;
    const updatedText = window.prompt('Edit highlight note:', current.text || '');
    if (updatedText === null) return;
    const next = highlights.map((item) => (item.id === itemId ? { ...item, text: updatedText.trim() } : item));
    saveHighlights(next);
  };

  const removeHighlight = (itemId) => {
    if (!window.confirm('Delete this highlight?')) return;
    const next = highlights.filter((item) => item.id !== itemId);
    saveHighlights(next);
  };

  const compactCountStyle = {
    padding: '2px 8px',
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 700,
    border: `1px solid ${palette.border}`,
    background: palette.panel2,
  };

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${palette.border}`, background: isDarkMode ? '#14171a' : '#dfe8ff' }}>
        <div style={{ fontSize: 13, color: palette.muted }}>Bookshelf / Mastering Pharmacology / Workbook</div>
        <div style={{ marginTop: 4, fontWeight: 700, fontSize: 22 }}>Workbook</div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              const nextDark = !isDarkMode;
              setIsDarkMode(nextDark);
              const nextTheme = nextDark ? (localStorage.getItem('unavidaThemeLastDark') || 'darkplus') : 'light';
              localStorage.setItem('unavidaTheme', nextTheme);
              if (nextDark) localStorage.setItem('unavidaThemeLastDark', nextTheme);
            }}
            style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button
            onClick={() => navigate(`/textbook/${activeCourse}`)}
            style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}
          >
            Back to Textbook
          </button>
        </div>
      </div>

      <div style={{ padding: 20, maxWidth: 980, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {['NUR1100', 'NUR2110'].map((code) => (
            <button
              key={code}
              onClick={() => setActiveCourse(code)}
              style={{
                padding: '7px 12px',
                borderRadius: 999,
                border: `1px solid ${palette.border}`,
                background: activeCourse === code ? '#39d0c8' : palette.panel2,
                color: activeCourse === code ? '#032320' : palette.text,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              {code}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
          <button
            onClick={() => setTab('bookmarks')}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${palette.border}`,
              background: tab === 'bookmarks' ? '#39d0c8' : palette.panel,
              color: tab === 'bookmarks' ? '#032320' : palette.text,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Bookmarks
          </button>
          <span style={compactCountStyle}>{bookmarks.length}</span>

          <button
            onClick={() => setTab('highlights')}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: `1px solid ${palette.border}`,
              background: tab === 'highlights' ? '#39d0c8' : palette.panel,
              color: tab === 'highlights' ? '#032320' : palette.text,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Highlights
          </button>
          <span style={compactCountStyle}>{highlights.length}</span>
        </div>

        {tab === 'bookmarks' && (
          <div style={{ display: 'grid', gap: 10 }}>
            {bookmarks.length === 0 ? (
              <div style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14, color: palette.muted }}>
                No bookmarks yet.
              </div>
            ) : (
              bookmarks.map((item) => (
                <article key={item.id} style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 12, color: palette.muted, marginBottom: 4 }}>{item.sectionId}</div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.sectionLabel}</div>
                  <div style={{ fontSize: 14, color: palette.muted, marginBottom: 10 }}>{item.marker || 'No label'}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => editBookmark(item.id)} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => removeBookmark(item.id)} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid #b91c1c`, background: '#7f1d1d', color: '#fecaca', cursor: 'pointer' }}>Delete</button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}

        {tab === 'highlights' && (
          <div style={{ display: 'grid', gap: 10 }}>
            {highlights.length === 0 ? (
              <div style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14, color: palette.muted }}>
                No highlights yet.
              </div>
            ) : (
              highlights.map((item) => (
                <article key={item.id} style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <div style={{ fontSize: 12, color: palette.muted }}>{item.sectionId}</div>
                    <span style={{ padding: '2px 8px', borderRadius: 999, fontSize: 11, fontWeight: 700, color: '#111', background: priorityColor(item.priority) }}>
                      {item.priority}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>{item.sectionLabel}</div>
                  <div style={{ fontSize: 14, color: palette.muted, marginBottom: 10 }}>{item.text || 'No note text'}</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => editHighlight(item.id)} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text, cursor: 'pointer' }}>Edit</button>
                    <button onClick={() => removeHighlight(item.id)} style={{ padding: '6px 10px', borderRadius: 8, border: `1px solid #b91c1c`, background: '#7f1d1d', color: '#fecaca', cursor: 'pointer' }}>Delete</button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkbookPage;
