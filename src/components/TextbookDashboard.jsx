import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const atlasPhrases = [
  'Small steps, safe meds, strong nurse.',
  'You are building clinical judgment one section at a time.',
  'Read for understanding, not just completion.',
  'If it seems unclear, slow down and verify.',
  'Confidence comes from repetition + reflection.',
];

const courseContent = {
  NUR1100: {
    code: 'NUR1100',
    name: 'Pharmacology I',
    chapters: [
      {
        id: 'ch1',
        title: 'Chapter 1: Introduction to Pharmacology',
        status: 'In Progress',
        sections: [
          { id: 'ch1_0', label: '1.0 Overview & Introduction', status: 'Completed' },
          { id: 'ch1_1', label: '1.1 Definition & Scope', status: 'In Progress' },
          { id: 'ch1_2', label: '1.2 Historical Context', status: 'In Progress' },
          { id: 'ch1_3', label: '1.3 Drug Classification Systems', status: 'Not Started' },
          { id: 'ch1_11', label: '1.11 Review Questions & Assessment', status: 'Not Started' },
        ],
      },
      {
        id: 'ch2',
        title: 'Chapter 2: Medication Safety Foundations',
        status: 'Not Started',
        sections: [
          { id: 'ch2_0', label: '2.0 Safety Framework', status: 'Not Started' },
          { id: 'ch2_1', label: '2.1 Error Prevention', status: 'Not Started' },
          { id: 'ch2_2', label: '2.2 Clinical Monitoring', status: 'Not Started' },
        ],
      },
    ],
  },
  NUR2110: {
    code: 'NUR2110',
    name: 'Pharmacology II',
    chapters: [
      {
        id: 'p2_ch1',
        title: 'Chapter 1: Advanced Therapeutics',
        status: 'Not Started',
        sections: [
          { id: 'p2_ch1_0', label: '1.0 Complex Drug Regimens', status: 'Not Started' },
          { id: 'p2_ch1_1', label: '1.1 Polypharmacy Strategy', status: 'Not Started' },
          { id: 'p2_ch1_2', label: '1.2 High-Risk Populations', status: 'Not Started' },
        ],
      },
      {
        id: 'p2_ch2',
        title: 'Chapter 2: Critical Care Pharmacology',
        status: 'Not Started',
        sections: [
          { id: 'p2_ch2_0', label: '2.0 Vasoactive Medications', status: 'Not Started' },
          { id: 'p2_ch2_1', label: '2.1 Sedation & Analgesia', status: 'Not Started' },
          { id: 'p2_ch2_2', label: '2.2 Sepsis Protocols', status: 'Not Started' },
        ],
      },
    ],
  },
};

const statusColor = (status) => {
  if (status === 'Completed') return '#16a34a';
  if (status === 'In Progress') return '#eab308';
  return '#ef4444';
};

export const TextbookDashboard = () => {
  const navigate = useNavigate();
  const { textbookId } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('unavidaTheme') || 'darkplus';
    setIsDarkMode(savedTheme !== 'light');
  }, []);
  const [activeCourse, setActiveCourse] = useState(textbookId === 'NUR2110' ? 'NUR2110' : 'NUR1100');
  const [openChapterId, setOpenChapterId] = useState('ch1');
  const [atlasPhrase] = useState(() => atlasPhrases[Math.floor(Math.random() * atlasPhrases.length)]);

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

  const course = courseContent[activeCourse];

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${palette.border}`, background: isDarkMode ? '#14171a' : '#dfe8ff' }}>
        <div style={{ fontSize: 13, color: palette.muted }}>Bookshelf / Mastering Pharmacology</div>
        <div style={{ marginTop: 4, fontWeight: 700, fontSize: 22 }}>Mastering Pharmacology</div>
        <div style={{ marginTop: 6, fontSize: 13, color: palette.muted }}>
          Mastering Pharmacology is used in NUR1100 and NUR2110.
        </div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
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
          <button onClick={() => navigate('/bookshelf')} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}>
            Back to Bookshelf
          </button>
        </div>
      </div>

      <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1.25fr .75fr', gap: 16 }}>
        <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {(['NUR1100', 'NUR2110']).map((code) => (
              <button
                key={code}
                onClick={() => {
                  setActiveCourse(code);
                  setOpenChapterId(courseContent[code].chapters[0]?.id || null);
                }}
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

          <h2 style={{ margin: '0 0 10px', fontSize: 18 }}>{course.name} Chapters</h2>
          <div style={{ display: 'grid', gap: 10 }}>
            {course.chapters.map((chapter) => {
              const isOpen = openChapterId === chapter.id;
              return (
                <div key={chapter.id} style={{ border: `1px solid ${palette.border}`, borderRadius: 10, background: palette.panel2 }}>
                  <button
                    onClick={() => setOpenChapterId(isOpen ? null : chapter.id)}
                    style={{ width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: 'transparent', border: 0, color: palette.text, cursor: 'pointer' }}
                  >
                    <span style={{ fontWeight: 700 }}>{chapter.title}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 12, padding: '2px 8px', borderRadius: 999, background: isDarkMode ? '#0f1113' : '#edf2ff', color: statusColor(chapter.status), fontWeight: 700 }}>{chapter.status}</span>
                      {isOpen ? '▲' : '▼'}
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: '0 10px 10px', display: 'grid', gap: 8 }}>
                      {chapter.sections.map((section) => (
                        <button
                          key={section.id}
                          onClick={() => navigate(`/reader/${section.id}`)}
                          style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel, color: palette.text, padding: 9, cursor: 'pointer' }}
                        >
                          <div style={{ fontWeight: 600 }}>{section.label}</div>
                          <div style={{ fontSize: 12, color: statusColor(section.status) }}>{section.status}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <aside style={{ display: 'grid', gap: 12 }}>
          <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
            <h3 style={{ margin: '0 0 10px' }}>Quick Performance Snapshot</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 8 }}>
              <div style={{ background: palette.panel2, borderRadius: 8, padding: 10 }}><strong>Quiz Avg</strong><div>86%</div></div>
              <div style={{ background: palette.panel2, borderRadius: 8, padding: 10 }}><strong>Flashcard Mastery</strong><div>74%</div></div>
              <div style={{ background: palette.panel2, borderRadius: 8, padding: 10 }}><strong>Chapters Completed</strong><div>1 / 13</div></div>
              <div style={{ background: palette.panel2, borderRadius: 8, padding: 10 }}><strong>Time Studied</strong><div>3h 42m</div></div>
            </div>
          </section>

          <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
            <h3 style={{ margin: '0 0 10px' }}>Study Tools</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              <button onClick={() => navigate('/reader/ch1_0')} style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>🎴 Flashcards</button>
              <button onClick={() => navigate('/reader/ch1_11')} style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>❓ Quiz</button>
              <button style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>🩺 Case Studies (Design next)</button>
            </div>
          </section>

          <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
            <h3 style={{ margin: '0 0 10px' }}>Workbook + Video Library</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              <button style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>📝 Notes</button>
              <button style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>⚡ Quick Jump</button>
              <button style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>🔖 Bookmarks</button>
              <button style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>🎥 Video Library (Design next)</button>
            </div>
          </section>

          <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(110px,140px) 1fr', gap: 10, alignItems: 'end' }}>
              <img
                src="/assets/atlas-standing.jpg"
                alt="Atlas"
                style={{ width: '100%', maxHeight: 220, objectFit: 'contain', objectPosition: 'bottom center', borderRadius: 8, background: palette.panel2 }}
              />
              <div style={{ fontSize: 13 }}>
                <strong>Atlas says:</strong>
                <div style={{ marginTop: 4 }}>{atlasPhrase}</div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default TextbookDashboard;
