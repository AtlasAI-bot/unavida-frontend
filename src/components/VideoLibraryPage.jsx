import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const videoCatalog = {
  NUR1100: [
    {
      id: 'pk-overview',
      title: 'Pharmacokinetics: ADME in Clinical Practice',
      chapter: 'Chapter 1',
      duration: '6:56',
      format: 'Lesson Video',
      status: 'Ready',
      description: 'Breakdown of absorption, distribution, metabolism, and excretion with bedside nursing examples.',
      readerLink: '/reader/ch1_intro?section=sec1_6_pk_vs_pd',
    },
    {
      id: 'pd-overview',
      title: 'Pharmacodynamics: How Drugs Produce Effects',
      chapter: 'Chapter 1',
      duration: '7:53',
      format: 'Lesson Video',
      status: 'Ready',
      description: 'Receptors, dose-response basics, and practical implications for med administration safety.',
      readerLink: '/reader/ch1_intro?section=sec1_6_pk_vs_pd',
    },
    {
      id: 'dosage-calc',
      title: 'Dosage Calculations: Safe Math for Nursing',
      chapter: 'Chapter 1',
      duration: '10:25',
      format: 'Skills Video',
      status: 'Ready',
      description: 'Step-by-step dosage calculations, common pitfalls, and quick verification checks.',
      readerLink: '/reader/ch1_intro?section=sec1_8_dosage_calculations',
    },
    {
      id: 'ch2-safety-video',
      title: 'Medication Safety Foundations',
      chapter: 'Chapter 2',
      duration: 'TBD',
      format: 'Lesson Video',
      status: 'Coming Soon',
      description: 'Core safety framework, error prevention, and nurse accountability workflow.',
      readerLink: '/reader/ch1_intro',
    },
  ],
  NUR2110: [
    {
      id: 'adv-therapeutics-intro',
      title: 'Advanced Therapeutics Orientation',
      chapter: 'Chapter 1',
      duration: 'TBD',
      format: 'Orientation',
      status: 'Coming Soon',
      description: 'Roadmap for high-risk medications, polypharmacy, and advanced patient scenarios.',
      readerLink: '/textbook/NUR2110',
    },
    {
      id: 'critical-care-pharm',
      title: 'Critical Care Pharmacology Essentials',
      chapter: 'Chapter 2',
      duration: 'TBD',
      format: 'Lesson Video',
      status: 'Coming Soon',
      description: 'Vasoactive drips, sedation protocols, and rapid-response medication priorities.',
      readerLink: '/textbook/NUR2110',
    },
  ],
};

const statusStyle = (isDarkMode, status) => {
  if (status === 'Ready') {
    return {
      background: isDarkMode ? 'rgba(34,197,94,.15)' : '#dcfce7',
      color: isDarkMode ? '#86efac' : '#166534',
      border: isDarkMode ? '1px solid rgba(34,197,94,.4)' : '1px solid #86efac',
    };
  }
  return {
    background: isDarkMode ? 'rgba(234,179,8,.15)' : '#fef9c3',
    color: isDarkMode ? '#fde047' : '#854d0e',
    border: isDarkMode ? '1px solid rgba(234,179,8,.4)' : '1px solid #facc15',
  };
};

export const VideoLibraryPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCourse, setActiveCourse] = useState('NUR1100');

  useEffect(() => {
    const savedTheme = localStorage.getItem('unavidaTheme') || 'darkplus';
    setIsDarkMode(savedTheme !== 'light');
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

  const videos = videoCatalog[activeCourse] || [];
  const readyCount = videos.filter((video) => video.status === 'Ready').length;

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${palette.border}`, background: isDarkMode ? '#14171a' : '#dfe8ff' }}>
        <div style={{ fontSize: 13, color: palette.muted }}>Bookshelf / Mastering Pharmacology / Video Library</div>
        <div style={{ marginTop: 4, fontWeight: 700, fontSize: 22 }}>Video Library</div>
        <div style={{ marginTop: 6, fontSize: 13, color: palette.muted }}>
          Quick access to chapter videos by course with direct jump back into Reader.
        </div>

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
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
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

        <div style={{ marginBottom: 16, fontSize: 14, color: palette.muted }}>
          {readyCount} of {videos.length} videos ready for {activeCourse}
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {videos.map((video) => {
            const pill = statusStyle(isDarkMode, video.status);
            const isReady = video.status === 'Ready';
            return (
              <article key={video.id} style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: '0 0 6px', fontSize: 17 }}>{video.title}</h3>
                    <div style={{ fontSize: 13, color: palette.muted }}>
                      {video.chapter} • {video.format} • {video.duration}
                    </div>
                  </div>
                  <span style={{ ...pill, borderRadius: 999, padding: '2px 10px', fontSize: 12, fontWeight: 700 }}>
                    {video.status}
                  </span>
                </div>

                <p style={{ margin: '10px 0 14px', color: palette.muted }}>{video.description}</p>

                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => navigate(video.readerLink)}
                    style={{
                      padding: '8px 11px',
                      borderRadius: 8,
                      border: `1px solid ${palette.border}`,
                      background: isReady ? '#39d0c8' : palette.panel2,
                      color: isReady ? '#032320' : palette.text,
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {isReady ? 'Open in Reader' : 'View Chapter'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VideoLibraryPage;
