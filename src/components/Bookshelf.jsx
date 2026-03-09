import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Bookshelf = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const courseTracks = [
    {
      id: 'NUR1100',
      label: 'NUR1100 Track',
      subtitle: 'Pharmacology I • Foundation sequence',
      progress: 'Chapter 1 active',
    },
    {
      id: 'NUR2110',
      label: 'NUR2110 Track',
      subtitle: 'Pharmacology II • Advanced sequence',
      progress: 'Ready to start',
    },
  ];

  const continueItems = [
    {
      title: 'Continue Reading',
      detail: 'Chapter 1 • Section 1.6 Pharmacokinetics vs Pharmacodynamics',
      action: 'Open Reader',
      onClick: () => navigate('/reader/ch1_intro?section=sec1_6_pk_vs_pd'),
    },
    {
      title: 'Workbook',
      detail: 'Bookmarks + Highlights',
      action: 'Open Workbook',
      onClick: () => navigate('/workbook'),
    },
    {
      title: 'Quizzes',
      detail: 'Build custom quizzes by chapter/section',
      action: 'Open Quizzes',
      onClick: () => navigate('/quizzes'),
    },
    {
      title: 'Flashcards',
      detail: 'Build deck + track Know it / Need practice',
      action: 'Open Flashcards',
      onClick: () => navigate('/flashcards'),
    },
    {
      title: 'Video Library',
      detail: 'Chapter/section video playback',
      action: 'Open Videos',
      onClick: () => navigate('/video-library'),
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${palette.border}`, background: isDarkMode ? '#14171a' : '#dfe8ff', position: 'sticky', top: 0, zIndex: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontWeight: 900, color: '#39d0c8', letterSpacing: 0.3 }}>UnaVida</div>
          <div style={{ fontSize: 13, color: palette.muted }}>Bookshelf / Mastering Pharmacology</div>
          <button
            onClick={toggleTheme}
            style={{ marginLeft: 'auto', padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}
          >
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      <section style={{ padding: '22px 22px 14px' }}>
        <h1 style={{ margin: '0 0 8px', fontSize: 34 }}>Mastering Pharmacology</h1>
        <p style={{ margin: 0, color: palette.muted, maxWidth: 860 }}>
          One textbook experience, two course tracks. Pick your course path and continue where you left off.
        </p>
      </section>

      <section style={{ padding: '0 22px 14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
          {courseTracks.map((course) => (
            <article key={course.id} style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, color: palette.muted, marginBottom: 4 }}>{course.id}</div>
              <h3 style={{ margin: '0 0 6px' }}>{course.label}</h3>
              <div style={{ fontSize: 13, color: palette.muted, marginBottom: 8 }}>{course.subtitle}</div>
              <div style={{ fontSize: 12, marginBottom: 10 }}>{course.progress}</div>
              <button
                onClick={() => navigate(`/textbook/${course.id}`)}
                style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: '#39d0c8', color: '#032320', fontWeight: 700, cursor: 'pointer' }}
              >
                Open {course.id}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 22px 24px' }}>
        <h2 style={{ margin: '6px 0 10px', fontSize: 20 }}>Continue Learning</h2>
        <div style={{ display: 'grid', gap: 10 }}>
          {continueItems.map((item) => (
            <article key={item.title} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'center', background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 12 }}>
              <div>
                <div style={{ fontWeight: 700 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: palette.muted }}>{item.detail}</div>
              </div>
              <button onClick={item.onClick} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text, cursor: 'pointer' }}>
                {item.action}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section style={{ padding: '0 22px 26px' }}>
        <div style={{ padding: 12, borderRadius: 12, border: `1px dashed #39d0c8`, background: isDarkMode ? '#11222a' : '#eefaf8', color: isDarkMode ? '#d9fff9' : '#114b45' }}>
          <strong>Atlas corner:</strong> Build the study session first, then grind it. Content selection > random review.
        </div>
      </section>
    </div>
  );
};

export default Bookshelf;
