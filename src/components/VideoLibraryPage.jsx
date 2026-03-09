import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const sectionVideos = {
  NUR1100: [
    {
      id: 'ch1-sec1-0',
      chapter: 'Chapter 1: Introduction to Pharmacology',
      section: 'Section 1.0 — Overview & Introduction',
      title: 'Chapter 1 Segment 1: Introduction',
      src: '/videos/chapter1_videos/chapter1_seg1_intro.mp4',
    },
    {
      id: 'ch1-sec1-1',
      chapter: 'Chapter 1: Introduction to Pharmacology',
      section: 'Section 1.1 — Definition & Scope of Pharmacology',
      title: 'Chapter 1 Segment 2: Pharmacology Definition',
      src: '/videos/chapter1_videos/chapter1_seg2_pharmacology_definition.mp4',
    },
    {
      id: 'ch1-sec1-6',
      chapter: 'Chapter 1: Introduction to Pharmacology',
      section: 'Section 1.6 — Pharmacokinetics vs Pharmacodynamics',
      title: 'Chapter 1 Segment 3: ADME',
      src: '/videos/chapter1_videos/chapter1_seg3_adme.mp4',
    },
    {
      id: 'ch1-sec1-3',
      chapter: 'Chapter 1: Introduction to Pharmacology',
      section: 'Section 1.3 — Drug Classification Systems',
      title: 'Chapter 1 Segment 4: Classification',
      src: '/videos/chapter1_videos/chapter1_seg4_classification.mp4',
    },
    {
      id: 'ch1-sec1-4',
      chapter: 'Chapter 1: Introduction to Pharmacology',
      section: 'Section 1.4 — Regulatory Bodies & FDA Process',
      title: 'Chapter 1 Segment 5: FDA Approval',
      src: '/videos/chapter1_videos/chapter1_seg5_fda_approval.mp4',
    },
    {
      id: 'ch1-sec1-5',
      chapter: 'Chapter 1: Introduction to Pharmacology',
      section: 'Section 1.5 — Drug Names & Classification Codes',
      title: 'Chapter 1 Segment 6: Regulatory',
      src: '/videos/chapter1_videos/chapter1_seg6_regulatory.mp4',
    },
    {
      id: 'ch1-sec1-7',
      chapter: 'Chapter 1: Introduction to Pharmacology',
      section: 'Section 1.7 — Drug Interactions & Patient Safety',
      title: 'Chapter 1 Segment 7: Nursing Role',
      src: '/videos/chapter1_videos/chapter1_seg7_nursing_role.mp4',
    },
    {
      id: 'ch1-sec1-11',
      chapter: 'Chapter 1: Introduction to Pharmacology',
      section: 'Section 1.11 — Review Questions & Assessment',
      title: 'Chapter 1 Segment 8: Summary',
      src: '/videos/chapter1_videos/chapter1_seg8_summary.mp4',
    },
  ],
  NUR2110: [],
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

  const videos = sectionVideos[activeCourse] || [];

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${palette.border}`, background: isDarkMode ? '#14171a' : '#dfe8ff' }}>
        <div style={{ fontSize: 13, color: palette.muted }}>Bookshelf / Mastering Pharmacology / Video Library</div>
        <div style={{ marginTop: 4, fontWeight: 700, fontSize: 22 }}>Video Library</div>
        <div style={{ marginTop: 6, fontSize: 13, color: palette.muted }}>
          Videos are organized by chapter and section, and play directly on this page.
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

        {videos.length === 0 ? (
          <div style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14, color: palette.muted }}>
            No section videos published yet for {activeCourse}.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 14 }}>
            {videos.map((video) => (
              <article key={video.id} style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
                <div style={{ marginBottom: 8, fontSize: 12, color: palette.muted }}>{video.chapter}</div>
                <h3 style={{ margin: '0 0 6px', fontSize: 17 }}>{video.section}</h3>
                <div style={{ marginBottom: 10, fontSize: 13, color: palette.muted }}>{video.title}</div>
                <video
                  controls
                  preload="metadata"
                  style={{ width: '100%', borderRadius: 10, background: '#000' }}
                  src={video.src}
                >
                  Your browser does not support the video tag.
                </video>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLibraryPage;
