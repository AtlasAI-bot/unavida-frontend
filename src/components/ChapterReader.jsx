import React, { useState, useEffect, useRef } from 'react';
import chapterData from '../data/CHAPTER_1_UNAVIDA_PRODUCTION.json';
import './ChapterReader.css';

export const ChapterReader = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [theme, setTheme] = useState('light');
  const [focusReader, setFocusReader] = useState(false);
  const [hideToc, setHideToc] = useState(false);
  const [readAloudOn, setReadAloudOn] = useState(false);
  const [nclexOn, setNclexOn] = useState(false);
  const [prefsModalOpen, setPrefsModalOpen] = useState(false);
  const [textSize, setTextSize] = useState(17);
  const [font, setFont] = useState('Inter, system-ui, sans-serif');
  const [lineHeight, setLineHeight] = useState(1.65);
  const [readerWidth, setReaderWidth] = useState(920);
  const mainScrollRef = useRef(null);

  const atlasLines = [
    'If your calculator dies during dosage math, that\'s a character-building event.',
    'Clinicals are like plot twists; the medication pass is where you become the main character.',
    'Nursing school: where caffeine becomes a co-author on your care plans.',
    'Pharmacology gets easier once ADME stops sounding like a Wi-Fi password.',
    'You can skip drama episodes, not med safety episodes.',
    'A good nurse catches errors before the patient catches side effects.',
    'The only thing stronger than this chapter is your end-of-semester resilience.',
    'Read once for confidence, read twice for competence.',
    'When in doubt: verify, clarify, then administer.',
    'You\'re not just memorizing meds; you\'re protecting futures.'
  ];

  const [atlasLine] = useState(() => atlasLines[Math.floor(Math.random() * atlasLines.length)]);

  const sectionVideoMap = {
    sec1_overview_introduction: 'https://unavida-videos.s3.us-east-2.amazonaws.com/Pharmacology_+Chapter+1+Introduction_1080p_caption.mp4',
    sec1_1_definitions_scope: 'https://unavida-videos.s3.us-east-2.amazonaws.com/07_definition_and_scope.mp4',
    sec1_3_drug_classification: 'https://unavida-videos.s3.us-east-2.amazonaws.com/06_drug_classification_systems.mp4',
    sec1_4_regulatory_bodies_fda: 'https://unavida-videos.s3.us-east-2.amazonaws.com/02_fda_approval_process.mp4',
    sec1_6_pk_vs_pd: 'https://unavida-videos.s3.us-east-2.amazonaws.com/4982BE2B-4807-F9DC-41B2-6CCF565CF232.mp4',
    sec1_7_drug_interactions: 'https://unavida-videos.s3.us-east-2.amazonaws.com/03_drug_interactions_and_safety.mp4',
    sec1_8_dosage_calculations: 'https://unavida-videos.s3.us-east-2.amazonaws.com/04_dosage_calculations.mp4',
    sec1_10_clinical_story_allergy_decision: 'https://unavida-videos.s3.us-east-2.amazonaws.com/05_clinical_story_allergy_decision.mp4',
  };

  const currentVideoUrl = selectedSection ? sectionVideoMap[selectedSection.id] : null;

  const sectionIllustrationMap = {
    sec1_overview_introduction: [
      '/images/ch1/section-1-0/ch1_s1_0_v01.png',
      '/images/ch1/section-1-0/Pharmacology Overview.png',
      '/images/ch1/section-1-0/Key Principles.png',
      '/images/ch1/section-1-0/Eight Rights Med.png',
      '/images/ch1/section-1-0/Drug Calcutation.png',
      '/images/ch1/section-1-0/Pharmacokinetics vs. Pharmacodynamics.png',
    ],
    sec1_1_definitions_scope: [
      '/images/ch1/section-1-1/ch1_s1_1_v01.png.png',
      '/images/ch1/section-1-1/Nurses administering care to elderly patient.png',
      '/images/ch1/section-1-1/Pharmacology concepts in a visual grid.png',
    ],
    sec1_2_historical_context: [
      '/images/ch1/section-1-2/ch1_s1_2_v01.png.png',
      '/images/ch1/section-1-2/Antibiotics and the Antibiotic Era.png',
      '/images/ch1/section-1-2/he rise of pharmacogenomics.png',
    ],
    sec1_3_drug_classification: [
      '/images/ch1/section-1-3/ch1_s1_3_v01.png.png',
      '/images/ch1/section-1-3/ch1_s1_3_v02.png',
    ],
    sec1_4_regulatory_bodies_fda: [
      '/images/ch1/section-1-4/ch1_s1_4_v01.png.png',
      '/images/ch1/section-1-4/ch1_s1_4_v02.png',
    ],
    sec1_6_pk_vs_pd: ['/images/ch1/section-1-6/ch1_s1_6_v01.png'],
    sec1_7_drug_interactions: [
      '/images/ch1/section-1-7/ch1_s1_7_v01.png.png',
      '/images/ch1/section-1-7/ch1_s1_7_v02.png',
    ],
    sec1_8_dosage_calculations: [
      '/images/ch1/section-1-8/ch1_s1_8_v01.png.png',
      '/images/ch1/section-1-8/ch1_s1_8_v02.png',
    ],
    sec1_9_key_terms_glossary: ['/images/ch1/section-1-9/ch1_s1_9_v01.png'],
    sec1_10_clinical_story_allergy_decision: [
      '/images/ch1/section-1-10/ch1_s1_10_v01.png.png',
      '/images/ch1/section-1-10/ch1_s1_10_v02.png',
    ],
    sec1_11_review_questions: ['/images/ch1/section-1-11/ch1_s1_11_v01.png'],
  };

  const currentSectionImages = selectedSection ? (sectionIllustrationMap[selectedSection.id] || []) : [];

  const sectionParagraphs = selectedSection?.content
    ? selectedSection.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  const cleanHeading = (value = '') =>
    value
      .replace(/^\[\s*EXPANDED CONTENT FOR\s*/i, '')
      .replace(/^\(?\s*Comprehensive\s+Overview\s+Section\s*\)?/i, '')
      .replace(/^Section\s+\d+(?:\.\d+)?\s*:\s*/i, '')
      .replace(/^Expanded\s+content\s+for\s*/i, '')
      .replace(/^[-–:\s]+|[-–:\s]+$/g, '')
      .trim();

  const cleanBody = (value = '') =>
    value
      .replace(/\[\s*EXPANDED CONTENT FOR[^\]]*\]/gi, '')
      .replace(/\(\s*Comprehensive\s+Overview\s+Section\s*\)/gi, '')
      .trim();

  const splitHeadingFromText = (text) => {
    if (!text) return { heading: null, body: '' };
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const first = lines[0] || '';
    const isHeadingLike = first.length > 0 && first.length < 110 && !first.endsWith('.') && !first.endsWith('?');
    if (isHeadingLike && lines.length > 1) {
      return { heading: cleanHeading(first), body: cleanBody(lines.slice(1).join('\n')) };
    }
    return { heading: null, body: cleanBody(text) };
  };

  const sectionTitle = cleanHeading(selectedSection?.title || '');

  const forcedSubheads = [
    'Key Principles for Safe Medication Use',
    'The Six Rights (Extended to Eight)',
    'The Scope of This Course',
  ];

  const splitForcedSubhead = (text) => {
    if (!text) return null;
    for (const h of forcedSubheads) {
      if (text.includes(h)) {
        const parts = text.split(h);
        return {
          before: parts[0]?.trim() || '',
          heading: h,
          after: parts.slice(1).join(h).trim(),
        };
      }
    }
    return null;
  };

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('unavidaTheme') || 'light';
    setTheme(savedTheme);
  }, []);

  // Set default section on mount
  useEffect(() => {
    if (chapterData.chapter.sections && chapterData.chapter.sections.length > 0) {
      setSelectedSection(chapterData.chapter.sections[0]);
    }
  }, []);

  // Always jump to top when section changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [selectedSection?.id]);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('unavidaTheme', newTheme);
  };

  const handleChapClick = (chap) => {
    const chapBtn = chap.querySelector('.chapBtn');
    const isOpen = chap.classList.contains('open');
    chap.classList.toggle('open');
    const arrow = chapBtn?.querySelector('small');
    if (arrow) {
      arrow.textContent = isOpen ? '▶' : '▼';
    }
  };

  return (
    <div className={`reader-container ${theme}`} style={{
      '--reader-font': font,
      '--reader-size': textSize + 'px',
      '--reader-line': lineHeight,
      '--reader-max': readerWidth + 'px'
    }}>
      <style>{`
        :root{
          --bg:#eaf0ff;
          --text:#1b2542;
          --top:#dfe8ff;
          --panel:#ffffff;
          --panel-border:#cfd9f7;
          --chapter:#eaf0ff;
          --chapter-2:#f3f6ff;
          --chapter-active:#dbe6ff;
          --chapter-hover:#e1eaff;
          --muted:#5b6a95;
          --card:#f7f9ff;
          --card-text:#122047;
          --video:#eef3ff;
          --video-frame:#d8e3ff;
          --right:#eef3ff;
          --atlas-bg:#edf8ff;
          --atlas-text:#14384f;
          --img-bg:#e8edff;
          --img-text:#5f6ea5;
          --reader-font: Inter, system-ui, sans-serif;
          --reader-size: 17px;
          --reader-line: 1.65;
          --reader-max: 920px;
        }

        .reader-container.dark {
          --bg:#141618;
          --text:#f3f4f6;
          --top:#1b1e21;
          --panel:#202327;
          --panel-border:rgba(255,255,255,.14);
          --chapter:#2a2e33;
          --chapter-2:#25292d;
          --chapter-active:#34414a;
          --chapter-hover:#30363c;
          --muted:#c0c6cf;
          --card:#2a2f35;
          --card-text:#f3f4f6;
          --video:#252a2f;
          --video-frame:#333940;
          --right:#2a2e33;
          --atlas-bg:#1f3334;
          --atlas-text:#d9f5f1;
          --img-bg:#343a40;
          --img-text:#d9dee6;
        }

        .reader-container.darkplus {
          --bg:#0f1113;
          --text:#f5f7fa;
          --top:#14171a;
          --panel:#181b1f;
          --panel-border:rgba(255,255,255,.16);
          --chapter:#22262b;
          --chapter-2:#1d2125;
          --chapter-active:#2f3a42;
          --chapter-hover:#272d33;
          --muted:#c5cbd3;
          --card:#22272e;
          --card-text:#f5f7fa;
          --video:#1c2025;
          --video-frame:#2c3239;
          --right:#22262b;
          --atlas-bg:#1a2d2e;
          --atlas-text:#e0faf5;
          --img-bg:#2c3239;
          --img-text:#dde3eb;
        }

        .reader-container.sepia {
          --bg:#f4ece1;
          --text:#3c2f1f;
          --top:#eadfce;
          --panel:#fff9f1;
          --panel-border:#decfb8;
          --chapter:#f7eee0;
          --chapter-2:#f5ead8;
          --chapter-active:#eddcbf;
          --chapter-hover:#efe1ca;
          --muted:#7a684f;
          --card:#fffaf3;
          --card-text:#3b2d1f;
          --video:#efe2cf;
          --video-frame:#e1d0b7;
          --right:#f3e7d6;
          --atlas-bg:#f6e8d5;
          --atlas-text:#4a3a27;
        }

        .reader-container.cyan {
          --bg:#eaf8ff;
          --text:#12354a;
          --top:#d5f0ff;
          --panel:#f7fdff;
          --panel-border:#b9e7ff;
          --chapter:#e9f8ff;
          --chapter-2:#def3ff;
          --chapter-active:#cdecff;
          --chapter-hover:#d9f2ff;
          --muted:#4f7388;
          --card:#f7fdff;
          --card-text:#14384b;
          --video:#e6f6ff;
          --video-frame:#cfeeff;
          --right:#e8f7ff;
          --atlas-bg:#ddf3ff;
          --atlas-text:#134056;
        }

        * { box-sizing: border-box; }
        
        .reader-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--bg);
          color: var(--text);
          font-family: var(--reader-font);
          transition: background 0.2s, color 0.2s;
        }

        .reader-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 20px;
          border-bottom: 1px solid var(--panel-border);
          background: var(--top);
          position: sticky;
          top: 0;
          z-index: 8;
          gap: 14px;
          flex-wrap: wrap;
        }

        .reader-crumb { font-size: 12px; color: var(--muted); }
        .reader-header { font-weight: 700; }

        .reader-tools {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .reader-btn {
          padding: 8px 12px;
          border-radius: 9px;
          border: 1px solid var(--panel-border);
          background: transparent;
          color: var(--text);
          text-decoration: none;
          display: inline-block;
          cursor: pointer;
          font-size: 13px;
          transition: background 0.15s;
        }

        .reader-btn:hover { background: var(--chapter-hover); }

        .reader-layout {
          display: grid;
          grid-template-columns: 320px 1fr 320px;
          gap: 14px;
          padding: 14px;
          flex: 1;
          overflow: hidden;
          transition: grid-template-columns 0.25s;
        }

        .reader-container.focus-reader .reader-layout {
          grid-template-columns: 1fr;
        }

        .reader-container.focus-reader .reader-toc,
        .reader-container.focus-reader .reader-right {
          display: none;
        }

        .reader-container.hide-toc .reader-layout {
          grid-template-columns: 1fr 320px;
        }

        .reader-container.hide-toc .reader-toc {
          display: none;
        }

        .reader-container.hide-toc .reader-main-wrap {
          max-width: 1220px;
        }

        .reader-container.focus-reader .reader-main-wrap {
          max-width: 1300px;
        }

        .reader-panel {
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 12px;
          padding: 12px;
          overflow-y: auto;
        }

        .reader-toc { flex: 0 0 320px; }
        .reader-main { flex: 1; min-width: 0; }
        .reader-right { flex: 0 0 320px; }

        .reader-toc-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          font-weight: 700;
          padding-left: 28px;
        }

        .reader-chap {
          margin-bottom: 8px;
          border: 1px solid var(--panel-border);
          border-radius: 10px;
          overflow: hidden;
        }

        .reader-chap-btn {
          width: 100%;
          text-align: left;
          background: var(--chapter);
          color: var(--text);
          border: 0;
          padding: 10px 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .reader-chap-btn:hover { background: var(--chapter-hover); }

        .reader-chap-btn small { font-weight: 500; color: var(--muted); }

        .reader-sec-wrap {
          display: none;
          background: var(--chapter-2);
          padding: 8px;
        }

        .reader-chap.open .reader-sec-wrap { display: block; }

        .reader-sec {
          display: block;
          padding: 8px;
          border-radius: 8px;
          color: var(--text);
          text-decoration: none;
          font-size: 13px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .reader-sec:hover { background: var(--chapter-hover); }

        .reader-sec.active {
          background: var(--chapter-active);
          border-left: 3px solid #39d0c8;
          padding-left: 6px;
        }

        .reader-main-wrap {
          max-width: var(--reader-max);
          margin: 0 auto;
        }

        .reader-main h1 {
          margin: 0;
          font-size: 24px;
        }

        .reader-meta {
          color: var(--muted);
          font-size: 13px;
          margin-top: 6px;
        }

        .reader-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 8px;
        }

        .reader-pill {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 999px;
          border: 1px solid var(--panel-border);
          font-size: 11px;
          color: var(--muted);
        }

        .reader-alert-bar {
          margin-top: 10px;
          padding: 10px;
          border-radius: 10px;
          background: #fff3cd;
          border: 1px solid #e6d58f;
          color: #5e4a08;
          font-size: 13px;
        }

        .reader-card {
          margin-top: 12px;
          background: var(--card);
          color: var(--card-text);
          border-radius: 12px;
          padding: 14px;
        }

        .reader-card h3 {
          margin: 0 0 8px;
          font-size: 18px;
        }

        .reader-card p {
          margin: 0;
          line-height: var(--reader-line);
          font-size: var(--reader-size);
        }

        .reader-video {
          margin-top: 12px;
          background: var(--video);
          border: 1px solid var(--panel-border);
          border-radius: 10px;
          padding: 10px;
        }

        .reader-frame {
          aspect-ratio: 16/9;
          border-radius: 8px;
          background: var(--video-frame);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted);
          margin-top: 8px;
        }

        .reader-right .reader-stat {
          background: var(--right);
          border-radius: 10px;
          padding: 10px;
          margin-bottom: 10px;
          font-size: 13px;
        }

        .reader-atlas {
          margin-top: 10px;
          padding: 10px;
          border: 1px dashed #39d0c8;
          border-radius: 10px;
          background: var(--atlas-bg);
          color: var(--atlas-text);
          font-size: 13px;
        }

        .reader-accordion {
          margin-bottom: 10px;
          border: 1px solid var(--panel-border);
          border-radius: 10px;
          overflow: hidden;
        }

        .reader-acc-btn {
          width: 100%;
          border: 0;
          background: var(--chapter);
          padding: 10px 12px;
          color: var(--text);
          text-align: left;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .reader-acc-btn:hover { background: var(--chapter-hover); }

        .reader-acc-body {
          display: none;
          background: var(--chapter-2);
          padding: 10px;
        }

        .reader-accordion.open .reader-acc-body { display: block; }

        .reader-tool-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }

        .reader-tool-item {
          padding: 9px;
          border: 1px solid var(--panel-border);
          border-radius: 8px;
          background: var(--panel);
          font-size: 12px;
        }

        .reader-modal {
          position: fixed;
          inset: 0;
          background: rgba(8, 16, 32, 0.45);
          display: none;
          align-items: center;
          justify-content: center;
          z-index: 20;
        }

        .reader-modal.show { display: flex; }

        .reader-modal-card {
          width: min(720px, 92vw);
          max-height: 88vh;
          overflow: auto;
          background: var(--panel);
          color: var(--text);
          border: 1px solid var(--panel-border);
          border-radius: 12px;
        }

        .reader-modal-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 14px;
          border-bottom: 1px solid var(--panel-border);
          font-weight: 800;
        }

        .reader-modal-body { padding: 14px; }

        .reader-pref-row {
          margin-bottom: 12px;
        }

        .reader-pref-label {
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 6px;
        }

        .reader-seg {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .reader-seg button {
          padding: 8px 10px;
          border: 1px solid var(--panel-border);
          background: var(--panel);
          color: var(--text);
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s;
        }

        .reader-seg button:hover { background: var(--chapter-hover); }

        .reader-seg button.active {
          background: #39d0c8;
          color: #032320;
          border-color: #39d0c8;
          font-weight: 700;
        }

        .reader-modal select {
          width: 100%;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid var(--panel-border);
          background: var(--panel);
          color: var(--text);
        }

        .reader-float-btn {
          position: fixed;
          left: 20px;
          top: 91px;
          z-index: 30;
          width: 28px;
          height: 28px;
          padding: 0;
          border-radius: 999px;
          border: 1px solid var(--panel-border);
          background: var(--panel);
          color: var(--text);
          cursor: pointer;
          font-weight: 700;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
          line-height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reader-float-btn:hover { background: var(--chapter-hover); }
      `}</style>

      {/* Top Bar */}
      <div className="reader-top">
        <div>
          <div className="reader-crumb">Home / Pharmacology I / Reader</div>
          <div className="reader-header">Reader Demo — Chapter Navigation Accordion</div>
        </div>
        <div className="reader-tools">
          <button className="reader-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          <button className="reader-btn" onClick={() => setFocusReader(!focusReader)}>
            {focusReader ? '↔ Restore Layout' : '↔ Expand Reader'}
          </button>
          <button className="reader-btn" onClick={() => setPrefsModalOpen(true)}>⚙️ Reader Preferences</button>
          <button className="reader-btn" onClick={() => setReadAloudOn(!readAloudOn)}>
            {readAloudOn ? '⏸ Stop Read Aloud' : '🔊 Read Aloud'}
          </button>
          <button className="reader-btn" onClick={() => setNclexOn(!nclexOn)}>
            {nclexOn ? '✅ NCLEX Lens ON' : '🧠 NCLEX Lens'}
          </button>
          <button className="reader-btn">📋 Export Study Sheet</button>
          <a href="/bookshelf" className="reader-btn">Back to Chapter List</a>
        </div>
      </div>

      {/* TOC Float Button */}
      <button className="reader-float-btn" onClick={() => setHideToc(!hideToc)}>
        {hideToc ? '▶' : '◀'}
      </button>

      {/* Main Layout */}
      <div className={`reader-layout ${focusReader ? 'focus-reader' : ''} ${hideToc ? 'hide-toc' : ''}`}>
        {/* Left Panel - TOC */}
        <aside className={`reader-panel reader-toc ${focusReader || hideToc ? 'reader-hidden' : ''}`}>
          <div className="reader-toc-title">
            <h3 style={{ margin: 0 }}>Textbook Navigation</h3>
          </div>

          <div className="reader-chap open">
            <button className="reader-chap-btn" onClick={(e) => handleChapClick(e.currentTarget.closest('.reader-chap'))}>
              Chapter 1: Intro to Pharmacology
              <small>▼</small>
            </button>
            <div className="reader-sec-wrap">
              {chapterData.chapter.sections?.map((section) => (
                <a
                  key={section.id}
                  className={`reader-sec ${selectedSection?.id === section.id ? 'active' : ''}`}
                  onClick={() => handleSectionClick(section)}
                >
                  {section.title}
                  {section.wordCount && <span style={{ fontSize: '11px', color: 'var(--muted)' }}> ({section.wordCount} words)</span>}
                  {section.duration && <span style={{ fontSize: '11px', color: 'var(--muted)' }}> • {section.duration} min</span>}
                </a>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Panel */}
        <main className="reader-panel reader-main" ref={mainScrollRef}>
          <div className="reader-main-wrap">
            {selectedSection ? (
              <>
                <div className="reader-section-label">Chapter Reader</div>
                <h1>{sectionTitle || selectedSection.title}</h1>
                <div className="reader-meta reader-subtle">
                  {selectedSection.duration} min {selectedSection.wordCount && `• ${selectedSection.wordCount} words`}
                </div>
                <div className="reader-pills">
                  {selectedSection.duration && <span className="reader-pill">⏱️ ~{selectedSection.duration} min reading</span>}
                  <span className="reader-pill">📺 1 video</span>
                  <span className="reader-pill">🎴 12 flashcards suggested</span>
                  <span className="reader-pill">📋 Resume point saved</span>
                </div>

                <div className="reader-alert-bar">
                  <strong>{nclexOn ? 'NCLEX Lens:' : 'Exam Alert:'}</strong> {nclexOn ? 'Prioritize safety language, adverse effect recognition, and first nursing action in every question.' : 'Instructor-highlighted topic — High-yield content for next assessment.'}
                </div>

                {currentVideoUrl && (
                  <section className="reader-video">
                    <strong>📺 Featured Lesson Video</strong>
                    <div className="reader-frame" style={{ padding: 0, overflow: 'hidden' }}>
                      <video controls preload="metadata" src={currentVideoUrl} style={{ width: '100%', height: '100%' }} />
                    </div>
                  </section>
                )}

                {selectedSection.content && (
                  <section className="reader-card">
                    {selectedSection.id === 'references' ? (
                      <>
                        <h3>References (APA Style)</h3>
                        <div>
                          {sectionParagraphs.map((refText, idx) => (
                            <p key={idx} className="apa-ref">{cleanBody(refText)}</p>
                          ))}
                        </div>
                      </>
                    ) : (
                      sectionParagraphs.map((para, idx) => {
                        const { heading, body } = splitHeadingFromText(para);
                        const forced = splitForcedSubhead(body || para);
                        return (
                          <div key={idx} style={{ marginBottom: '18px' }}>
                            {heading && <h4 style={{ margin: '0 0 8px 0', fontSize: '1.08rem' }}>{heading}</h4>}
                            {forced ? (
                              <>
                                {forced.before && <p style={{ fontSize: '1rem', lineHeight: 1.75 }}>{forced.before}</p>}
                                <h4 style={{ margin: '8px 0', fontSize: '1.1rem' }}>{forced.heading}</h4>
                                {forced.after && <p style={{ fontSize: '1rem', lineHeight: 1.75 }}>{forced.after}</p>}
                              </>
                            ) : (
                              <p style={{ fontSize: '1rem', lineHeight: 1.75 }}>{body}</p>
                            )}
                          </div>
                        );
                      })
                    )}
                  </section>
                )}

                {selectedSection.contentBlocks && selectedSection.contentBlocks.length > 0 && (
                  <section className="reader-card">
                    <h3>Detailed Reading</h3>
                    {selectedSection.contentBlocks.map((block, idx) => {
                      const imgSrc = currentSectionImages[idx] || null;
                      return (
                        <div key={idx} style={{ marginBottom: '16px' }}>
                          {block.title && <h4 style={{ margin: '0 0 6px 0', fontSize: '1.06rem' }}>{cleanHeading(block.title)}</h4>}
                          {block.htmlReady ? (
                            <div dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                          ) : block.content ? (
                            <p>{block.content}</p>
                          ) : null}
                          {imgSrc && (
                            <img
                              src={imgSrc}
                              alt={`Topic visual ${idx + 1}`}
                              style={{ width: '100%', marginTop: '10px', maxHeight: '420px', objectFit: 'contain', background: 'var(--panel)', borderRadius: '10px' }}
                              loading="lazy"
                            />
                          )}
                        </div>
                      );
                    })}
                  </section>
                )}

                {selectedSection.learningObjectives && (
                  <section className="reader-card">
                    <h3>Learning Objectives</h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 'var(--reader-line)', fontSize: 'var(--reader-size)' }}>
                      {selectedSection.learningObjectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {selectedSection.keyTakeaways && (
                  <section className="reader-card">
                    <h3>Key Takeaways</h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 'var(--reader-line)', fontSize: 'var(--reader-size)' }}>
                      {selectedSection.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx}>{takeaway}</li>
                      ))}
                    </ul>
                  </section>
                )}
              </>
            ) : (
              <p>Loading content...</p>
            )}
          </div>
        </main>

        {/* Right Panel - Study Tools */}
        <aside className={`reader-panel reader-right ${focusReader ? 'reader-hidden' : ''}`}>
          <div className="reader-stat">
            <strong>Instructor Highlights</strong><br />
            Jump to instructor-pinned key concepts and exam focus areas.
          </div>

          <div className="reader-accordion open">
            <button className="reader-acc-btn" onClick={(e) => e.currentTarget.closest('.reader-accordion').classList.toggle('open')}>
              Study Tools
              <span>▼</span>
            </button>
            <div className="reader-acc-body">
              <div className="reader-tool-grid">
                <div className="reader-tool-item">🎴 Flashcards</div>
                <div className="reader-tool-item">❓ Quiz</div>
                <div className="reader-tool-item">🤷 Case Studies</div>
                <div className="reader-tool-item">🧠 Practice Problems</div>
                <div className="reader-tool-item">✅ Learning Outcomes</div>
                <div className="reader-tool-item">📚 References</div>
              </div>
            </div>
          </div>

          <div className="reader-accordion">
            <button className="reader-acc-btn" onClick={(e) => e.currentTarget.closest('.reader-accordion').classList.toggle('open')}>
              Workbook
              <span>▶</span>
            </button>
            <div className="reader-acc-body">
              <div style={{ display: 'grid', gap: '8px', marginBottom: '10px' }}>
                <div style={{ padding: '8px', border: '1px solid var(--panel-border)', borderRadius: '8px', background: 'var(--panel)', fontSize: '13px' }}>📝 Annotations (7)</div>
                <div style={{ padding: '8px', border: '1px solid var(--panel-border)', borderRadius: '8px', background: 'var(--panel)', fontSize: '13px' }}>🔖 Bookmarks (3)</div>
                <div style={{ padding: '8px', border: '1px solid var(--panel-border)', borderRadius: '8px', background: 'var(--panel)', fontSize: '13px' }}>🔍️ Highlights (14)</div>
                <div style={{ padding: '8px', border: '1px solid var(--panel-border)', borderRadius: '8px', background: 'var(--panel)', fontSize: '13px' }}>🎴 My Flashcards (12 created)</div>
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                <button className="reader-btn">+ Add Annotation</button>
                <button className="reader-btn">+ Add Bookmark</button>
                <button className="reader-btn">+ Create Flashcard</button>
              </div>
            </div>
          </div>

          <div className="reader-stat">
            <strong>Quick Jump</strong><br />
            Instructor-saved highlights:
          </div>
          <div className="reader-pills" style={{ gap: '8px', marginTop: '8px' }}>
            <button className="reader-btn">ADME Core Map</button>
            <button className="reader-btn">PD Receptor Effects</button>
          </div>

          <div className="reader-atlas">
            <strong>Atlas says:</strong> "{atlasLine}"
          </div>
        </aside>
      </div>

      {/* Preferences Modal */}
      <div className={`reader-modal ${prefsModalOpen ? 'show' : ''}`} onClick={() => prefsModalOpen && setPrefsModalOpen(false)}>
        <div className="reader-modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="reader-modal-head">
            Reader Preferences
            <button className="reader-btn" onClick={() => setPrefsModalOpen(false)}>✕</button>
          </div>
          <div className="reader-modal-body">
            <div className="reader-pref-row">
              <div className="reader-pref-label">Text Size</div>
              <div className="reader-seg">
                {[15, 17, 19, 21].map((size) => (
                  <button
                    key={size}
                    className={textSize === size ? 'active' : ''}
                    onClick={() => setTextSize(size)}
                  >
                    Aa
                  </button>
                ))}
              </div>
            </div>

            <div className="reader-pref-row">
              <div className="reader-pref-label">Font</div>
              <select value={font} onChange={(e) => setFont(e.target.value)}>
                <option value="Inter, system-ui, sans-serif">Default Font</option>
                <option value="Georgia, serif">Georgia</option>
                <option value="'Times New Roman', serif">Times New Roman</option>
                <option value="Arial, sans-serif">Arial</option>
              </select>
            </div>

            <div className="reader-pref-row">
              <div className="reader-pref-label">Mode</div>
              <div className="reader-seg">
                {['light', 'dark', 'darkplus', 'sepia', 'cyan'].map((m) => (
                  <button
                    key={m}
                    className={theme === m ? 'active' : ''}
                    onClick={() => {
                      setTheme(m);
                      localStorage.setItem('unavidaTheme', m);
                    }}
                  >
                    {m === 'light' ? 'Day' : m === 'dark' ? 'Night' : m === 'darkplus' ? 'Dark+' : m === 'sepia' ? 'Sepia' : 'Cyan'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
              <div>
                <div className="reader-pref-label">Margin / Reader Width</div>
                <div className="reader-seg">
                  {[760, 920, 1080].map((w) => (
                    <button
                      key={w}
                      className={readerWidth === w ? 'active' : ''}
                      onClick={() => setReaderWidth(w)}
                    >
                      {w === 760 ? 'Narrow' : w === 920 ? 'Medium' : 'Wide'}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="reader-pref-label">Line Height</div>
                <div className="reader-seg">
                  {[1.45, 1.65, 1.85].map((lh) => (
                    <button
                      key={lh}
                      className={lineHeight === lh ? 'active' : ''}
                      onClick={() => setLineHeight(lh)}
                    >
                      {lh === 1.45 ? 'Tight' : lh === 1.65 ? 'Default' : 'Relaxed'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterReader;
