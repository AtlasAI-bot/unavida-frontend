import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const sectionVideos = {
  NUR1100: [
    {
      id: 'sec1_overview_introduction',
      chapterNumber: 1,
      chapter: 'Chapter 1: Introduction to Pharmacology',
      sectionNumber: '1.0',
      section: 'Overview & Introduction',
      title: 'Chapter 1 Introduction',
      src: 'https://unavida-videos.s3.us-east-2.amazonaws.com/Pharmacology_+Chapter+1+Introduction_1080p_caption.mp4',
    },
    {
      id: 'sec1_1_definitions_scope',
      chapterNumber: 1,
      chapter: 'Chapter 1: Introduction to Pharmacology',
      sectionNumber: '1.1',
      section: 'Definition & Scope of Pharmacology',
      title: 'Definition and Scope',
      src: 'https://unavida-videos.s3.us-east-2.amazonaws.com/07_definition_and_scope.mp4',
    },
    {
      id: 'sec1_3_drug_classification',
      chapterNumber: 1,
      chapter: 'Chapter 1: Introduction to Pharmacology',
      sectionNumber: '1.3',
      section: 'Drug Classification Systems',
      title: 'Drug Classification Systems',
      src: 'https://unavida-videos.s3.us-east-2.amazonaws.com/06_drug_classification_systems.mp4',
    },
    {
      id: 'sec1_4_regulatory_bodies_fda',
      chapterNumber: 1,
      chapter: 'Chapter 1: Introduction to Pharmacology',
      sectionNumber: '1.4',
      section: 'Regulatory Bodies & FDA Process',
      title: 'FDA Approval Process',
      src: 'https://unavida-videos.s3.us-east-2.amazonaws.com/02_fda_approval_process.mp4',
    },
    {
      id: 'sec1_6_pk_vs_pd',
      chapterNumber: 1,
      chapter: 'Chapter 1: Introduction to Pharmacology',
      sectionNumber: '1.6',
      section: 'Pharmacokinetics vs Pharmacodynamics',
      title: 'Pharmacokinetics vs Pharmacodynamics',
      src: 'https://unavida-videos.s3.us-east-2.amazonaws.com/4982BE2B-4807-F9DC-41B2-6CCF565CF232.mp4',
    },
    {
      id: 'sec1_7_drug_interactions',
      chapterNumber: 1,
      chapter: 'Chapter 1: Introduction to Pharmacology',
      sectionNumber: '1.7',
      section: 'Drug Interactions & Patient Safety',
      title: 'Drug Interactions and Safety',
      src: 'https://unavida-videos.s3.us-east-2.amazonaws.com/03_drug_interactions_and_safety.mp4',
    },
    {
      id: 'sec1_8_dosage_calculations',
      chapterNumber: 1,
      chapter: 'Chapter 1: Introduction to Pharmacology',
      sectionNumber: '1.8',
      section: 'Dosage Calculations',
      title: 'Dosage Calculations',
      src: 'https://unavida-videos.s3.us-east-2.amazonaws.com/04_dosage_calculations.mp4',
    },
    {
      id: 'sec1_10_clinical_story_allergy_decision',
      chapterNumber: 1,
      chapter: 'Chapter 1: Introduction to Pharmacology',
      sectionNumber: '1.10',
      section: 'Clinical Story: The Allergy Decision',
      title: 'Clinical Story: Allergy Decision',
      src: 'https://unavida-videos.s3.us-east-2.amazonaws.com/05_clinical_story_allergy_decision.mp4',
    },
  ],
  NUR2110: [],
};

const sortBySection = (a, b) => {
  if (a.chapterNumber !== b.chapterNumber) return a.chapterNumber - b.chapterNumber;
  return Number(a.sectionNumber) - Number(b.sectionNumber);
};

export const VideoLibraryPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCourse, setActiveCourse] = useState('NUR1100');
  const [query, setQuery] = useState('');

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

  const videos = useMemo(() => {
    const courseVideos = [...(sectionVideos[activeCourse] || [])].sort(sortBySection);
    const q = query.trim().toLowerCase();
    if (!q) return courseVideos;
    return courseVideos.filter((video) => {
      const haystack = `${video.chapter} ${video.sectionNumber} ${video.section} ${video.title}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [activeCourse, query]);

  const groupedByChapter = useMemo(() => {
    const map = new Map();
    videos.forEach((video) => {
      if (!map.has(video.chapter)) map.set(video.chapter, []);
      map.get(video.chapter).push(video);
    });
    return Array.from(map.entries());
  }, [videos]);

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${palette.border}`, background: isDarkMode ? '#14171a' : '#dfe8ff' }}>
        <div style={{ fontSize: 13, color: palette.muted }}>Bookshelf / Mastering Pharmacology / Video Library</div>
        <div style={{ marginTop: 4, fontWeight: 700, fontSize: 22 }}>Video Library</div>
        <div style={{ marginTop: 6, fontSize: 13, color: palette.muted }}>
          Videos are sorted by chapter and section, with direct playback on this page.
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

        <div style={{ marginBottom: 14 }}>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search videos by chapter, section, or title..."
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 10,
              border: `1px solid ${palette.border}`,
              background: palette.panel,
              color: palette.text,
              outline: 'none',
            }}
          />
        </div>

        {groupedByChapter.length === 0 ? (
          <div style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14, color: palette.muted }}>
            No videos found for {activeCourse}{query ? ` matching "${query}"` : ''}.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 16 }}>
            {groupedByChapter.map(([chapter, chapterVideos]) => (
              <section key={chapter}>
                <h2 style={{ margin: '0 0 10px', fontSize: 18 }}>{chapter}</h2>
                <div style={{ display: 'grid', gap: 12 }}>
                  {chapterVideos.map((video) => (
                    <article key={video.id} style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
                      <h3 style={{ margin: '0 0 6px', fontSize: 16 }}>Section {video.sectionNumber} — {video.section}</h3>
                      <div style={{ marginBottom: 10, fontSize: 13, color: palette.muted }}>{video.title}</div>
                      <video controls preload="metadata" style={{ width: '100%', borderRadius: 10, background: '#000' }} src={video.src}>
                        Your browser does not support the video tag.
                      </video>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoLibraryPage;
