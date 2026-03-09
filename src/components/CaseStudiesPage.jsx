import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const caseStudyBank = {
  NUR1100: [
    {
      id: 'cs1',
      chapterNumber: 1,
      chapterTitle: 'Chapter 1: Introduction to Pharmacology',
      sectionId: 'sec1_7_drug_interactions',
      sectionLabel: '1.7 Drug Interactions & Patient Safety',
      title: 'Polypharmacy in an Older Adult',
      difficulty: 'Intermediate',
      scenario: 'A 78-year-old patient on 9 medications reports confusion, dizziness, and weakness. Family is concerned about medication interactions.',
      focus: ['interaction risk', 'CNS depressants', 'med reconciliation'],
    },
    {
      id: 'cs2',
      chapterNumber: 1,
      chapterTitle: 'Chapter 1: Introduction to Pharmacology',
      sectionId: 'sec1_4_regulatory_bodies_fda',
      sectionLabel: '1.4 Regulatory Bodies & FDA Process',
      title: 'Adverse Drug Reaction Escalation',
      difficulty: 'Beginner',
      scenario: 'A patient develops rash and shortness of breath hours after first antibiotic dose.',
      focus: ['hypersensitivity', 'urgent escalation', 'patient education'],
    },
    {
      id: 'cs3',
      chapterNumber: 1,
      chapterTitle: 'Chapter 1: Introduction to Pharmacology',
      sectionId: 'sec1_8_dosage_calculations',
      sectionLabel: '1.8 Dosage Calculations',
      title: 'Pediatric Dose Verification',
      difficulty: 'Advanced',
      scenario: 'A parent calls to verify amoxicillin dose for a 6-year-old. Order appears within range but needs precise confirmation.',
      focus: ['mg/kg dosing', 'safe measurement', 'parent instructions'],
    },
    {
      id: 'cs4',
      chapterNumber: 2,
      chapterTitle: 'Chapter 2: Medication Safety Foundations',
      sectionId: 'ch2_1',
      sectionLabel: '2.1 Error Prevention',
      title: 'Near-Miss With High-Alert Medication',
      difficulty: 'Intermediate',
      scenario: 'Insulin infusion bag concentration appears inconsistent during shift handoff.',
      focus: ['double-check workflow', 'documentation', 'harm prevention'],
    },
  ],
  NUR2110: [
    {
      id: 'cs5',
      chapterNumber: 1,
      chapterTitle: 'Chapter 1: Advanced Therapeutics',
      sectionId: 'p2_ch1_1',
      sectionLabel: '1.1 Polypharmacy Strategy',
      title: 'Complex Regimen Prioritization',
      difficulty: 'Advanced',
      scenario: 'A patient with multiple chronic conditions has overlapping medication plans from different specialists.',
      focus: ['prioritization', 'deprescribing discussions', 'cross-team coordination'],
    },
  ],
};

export const CaseStudiesPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCourse, setActiveCourse] = useState('NUR1100');
  const [selectedChapterNumbers, setSelectedChapterNumbers] = useState([]);
  const [query, setQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('unavidaTheme') || 'darkplus';
    setIsDarkMode(savedTheme !== 'light');
  }, []);

  const palette = useMemo(() => {
    if (isDarkMode) return { page: '#0f1113', panel: '#181b1f', panel2: '#22262b', text: '#f5f7fa', muted: '#c5cbd3', border: 'rgba(255,255,255,.12)' };
    return { page: '#edf2ff', panel: '#d8e3ff', panel2: '#c8d8ff', text: '#101827', muted: '#334155', border: '#9fb3e8' };
  }, [isDarkMode]);

  const allCases = caseStudyBank[activeCourse] || [];

  const chapters = useMemo(() => {
    const map = new Map();
    allCases.forEach((c) => { if (!map.has(c.chapterNumber)) map.set(c.chapterNumber, c.chapterTitle); });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [allCases]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allCases.filter((c) => {
      const chapterOk = selectedChapterNumbers.length === 0 || selectedChapterNumbers.includes(c.chapterNumber);
      const qOk = !q || `${c.title} ${c.scenario} ${c.sectionLabel} ${c.chapterTitle}`.toLowerCase().includes(q);
      return chapterOk && qOk;
    });
  }, [allCases, selectedChapterNumbers, query]);

  const grouped = useMemo(() => {
    const map = new Map();
    filtered.forEach((c) => {
      if (!map.has(c.chapterTitle)) map.set(c.chapterTitle, []);
      map.get(c.chapterTitle).push(c);
    });
    return Array.from(map.entries());
  }, [filtered]);

  const toggleChapter = (n) => setSelectedChapterNumbers((prev) => prev.includes(n) ? prev.filter((v) => v !== n) : [...prev, n]);

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${palette.border}`, background: isDarkMode ? '#14171a' : '#dfe8ff' }}>
        <div style={{ fontSize: 13, color: palette.muted }}>Bookshelf / Mastering Pharmacology / Case Studies</div>
        <div style={{ marginTop: 4, fontWeight: 700, fontSize: 22 }}>Case Studies</div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button onClick={() => { const n = !isDarkMode; setIsDarkMode(n); const t = n ? (localStorage.getItem('unavidaThemeLastDark') || 'darkplus') : 'light'; localStorage.setItem('unavidaTheme', t); if (n) localStorage.setItem('unavidaThemeLastDark', t); }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={() => navigate(`/textbook/${activeCourse}`)} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}>Back to Textbook</button>
        </div>
      </div>

      <div style={{ padding: 20, maxWidth: 1050, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          {['NUR1100', 'NUR2110'].map((code) => (
            <button key={code} onClick={() => { setActiveCourse(code); setExpandedId(null); setSelectedChapterNumbers([]); }} style={{ padding: '7px 12px', borderRadius: 999, border: `1px solid ${palette.border}`, background: activeCourse === code ? '#39d0c8' : palette.panel2, color: activeCourse === code ? '#032320' : palette.text, fontWeight: 700, cursor: 'pointer' }}>{code}</button>
          ))}
        </div>

        <div style={{ marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search case studies..." style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text }} />
          <div style={{ border: `1px solid ${palette.border}`, borderRadius: 10, background: palette.panel, padding: '8px 10px' }}>
            <div style={{ fontSize: 12, color: palette.muted, marginBottom: 6 }}>Chapter filter (none = all chapters)</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {chapters.map(([num]) => (
                <button key={num} onClick={() => toggleChapter(num)} style={{ padding: '5px 9px', borderRadius: 999, border: `1px solid ${palette.border}`, background: selectedChapterNumbers.includes(num) ? '#39d0c8' : palette.panel2, color: selectedChapterNumbers.includes(num) ? '#032320' : palette.text, cursor: 'pointer' }}>Chapter {num}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gap: 14 }}>
          {grouped.length === 0 ? (
            <div style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14, color: palette.muted }}>No case studies found for this filter.</div>
          ) : grouped.map(([chapterTitle, studies]) => (
            <section key={chapterTitle}>
              <h2 style={{ margin: '0 0 10px' }}>{chapterTitle}</h2>
              <div style={{ display: 'grid', gap: 10 }}>
                {studies.map((study) => {
                  const open = expandedId === study.id;
                  return (
                    <article key={study.id} style={{ border: `1px solid ${palette.border}`, borderRadius: 12, background: palette.panel, padding: 12 }}>
                      <button onClick={() => setExpandedId(open ? null : study.id)} style={{ width: '100%', textAlign: 'left', background: 'transparent', color: palette.text, border: 'none', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                          <div>
                            <div style={{ fontWeight: 700 }}>{study.title}</div>
                            <div style={{ fontSize: 12, color: palette.muted }}>{study.sectionLabel} • {study.difficulty}</div>
                          </div>
                          <div>{open ? '▲' : '▼'}</div>
                        </div>
                      </button>
                      {open && (
                        <div style={{ marginTop: 10 }}>
                          <p style={{ margin: '0 0 8px', color: palette.muted }}>{study.scenario}</p>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                            {study.focus.map((f) => (
                              <span key={f} style={{ fontSize: 11, borderRadius: 999, padding: '3px 8px', border: `1px solid ${palette.border}`, background: palette.panel2 }}>{f}</span>
                            ))}
                          </div>
                          <a href={`/reader/ch1_intro?section=${study.sectionId}`} style={{ color: '#38bdf8', textDecoration: 'underline' }}>Go to textbook section</a>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudiesPage;
