import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const atlasPhrases = [
  'Small steps, safe meds, strong nurse.',
  'You are building clinical judgment one section at a time.',
  'Read for understanding, not just completion.',
  'If it seems unclear, slow down and verify.',
  'Confidence comes from repetition + reflection.',
];

const makeScaffoldCourse = (code, name) => ({
  code,
  name,
  chapters: [
    {
      id: `${code.toLowerCase()}_ch1`,
      title: 'Chapter 1: Foundations',
      status: 'Not Started',
      sections: [
        { id: `${code.toLowerCase()}_ch1_s0`, label: '1.0 Course Orientation', status: 'Not Started' },
        { id: `${code.toLowerCase()}_ch1_s1`, label: '1.1 Core Concepts', status: 'Not Started' },
        { id: `${code.toLowerCase()}_ch1_s2`, label: '1.2 Clinical Application', status: 'Not Started' },
      ],
    },
    {
      id: `${code.toLowerCase()}_ch2`,
      title: 'Chapter 2: Patient Care Integration',
      status: 'Not Started',
      sections: [
        { id: `${code.toLowerCase()}_ch2_s0`, label: '2.0 Safety Framework', status: 'Not Started' },
        { id: `${code.toLowerCase()}_ch2_s1`, label: '2.1 Priority Interventions', status: 'Not Started' },
        { id: `${code.toLowerCase()}_ch2_s2`, label: '2.2 Case Reflection', status: 'Not Started' },
      ],
    },
  ],
});

const courseContent = {
  NUR1100: {
    code: 'NUR1100',
    name: 'Pharmacology I',
    chapters: [
      {
        id: 'nur1100_chapters_1_2_3_5',
        title: 'Unit: Foundations & Medication Safety',
        status: 'In Progress',
        sections: [
          { id: 'sec1_overview_introduction', label: 'Chapter 1: Intro to Drugs', status: 'In Progress' },
          { id: 'sec2_1_pk_overview', label: 'Chapter 2: Pharmacokinetics', status: 'In Progress' },
          { id: 'nur1100_ch3_toxicity', label: 'Chapter 3: Toxicity', status: 'Not Started' },
          { id: 'sec1_8_dosage_calculations', label: 'Chapter 5: Dosage Calculations', status: 'Not Started' },
        ],
      },
      {
        id: 'nur1100_chapters_9_10_11_14',
        title: 'Unit: Anti-Infectives & Antineoplastics',
        status: 'Not Started',
        sections: [
          { id: 'nur1100_ch9_antibiotics', label: 'Chapter 9: Antibiotics', status: 'Not Started' },
          { id: 'nur1100_ch10_antivirals', label: 'Chapter 10: Antivirals', status: 'Not Started' },
          { id: 'nur1100_ch11_antifungals', label: 'Chapter 11: Antifungals', status: 'Not Started' },
          { id: 'nur1100_ch14_antineoplastics', label: 'Chapter 14: Antineoplastics', status: 'Not Started' },
        ],
      },
      {
        id: 'nur1100_chapters_53_54_55',
        title: 'Unit: Respiratory Pharmacology',
        status: 'Not Started',
        sections: [
          { id: 'nur1100_ch53_respiratory_intro', label: 'Chapter 53: Respiratory System I', status: 'Not Started' },
          { id: 'nur1100_ch54_respiratory_advanced', label: 'Chapter 54: Respiratory System II', status: 'Not Started' },
          { id: 'nur1100_ch55_respiratory_clinical', label: 'Chapter 55: Respiratory System III', status: 'Not Started' },
        ],
      },
      {
        id: 'nur1100_chapters_42_43_44',
        title: 'Unit: Cardiovascular Pharmacology (Foundations)',
        status: 'Not Started',
        sections: [
          { id: 'nur1100_ch42_cardiovascular_intro', label: 'Chapter 42: Cardiovascular Introduction', status: 'Not Started' },
          { id: 'nur1100_ch43_blood_pressure', label: 'Chapter 43: Blood Pressure', status: 'Not Started' },
          { id: 'nur1100_ch44_cardiotonic', label: 'Chapter 44: Cardiotonic', status: 'Not Started' },
        ],
      },
      {
        id: 'nur1100_chapters_45_46_47',
        title: 'Unit: Cardiovascular Pharmacology (Therapeutics)',
        status: 'Not Started',
        sections: [
          { id: 'nur1100_ch45_antiarrhythmics', label: 'Chapter 45: Antiarrhythmics', status: 'Not Started' },
          { id: 'nur1100_ch46_antianginals', label: 'Chapter 46: Antianginals', status: 'Not Started' },
          { id: 'nur1100_ch47_lipid_lowering', label: 'Chapter 47: Lipid-Lowering', status: 'Not Started' },
        ],
      },
      {
        id: 'nur1100_chapters_48_49',
        title: 'Unit: Hematology & Coagulation',
        status: 'Not Started',
        sections: [
          { id: 'nur1100_ch48_blood_coagulation', label: 'Chapter 48: Blood Coagulation', status: 'Not Started' },
          { id: 'nur1100_ch49_anemias', label: 'Chapter 49: Anemias', status: 'Not Started' },
        ],
      },

    ],
  },
  NUR2110: {
    code: 'NUR2110',
    name: 'Pharmacology II',
    chapters: [
      {
        id: 'nur2110_chapters_56_57_58_59',
        title: 'Chapters 56, 57, 58, 59',
        status: 'Not Started',
        sections: [
          { id: 'nur2110_ch56_gi_intro', label: 'Chapter 56: GI System I', status: 'Not Started' },
          { id: 'nur2110_ch57_gi_advanced', label: 'Chapter 57: GI System II', status: 'Not Started' },
          { id: 'nur2110_ch58_gi_supportive', label: 'Chapter 58: GI System III', status: 'Not Started' },
          { id: 'nur2110_ch59_gi_clinical', label: 'Chapter 59: GI System IV', status: 'Not Started' },
        ],
      },
      {
        id: 'nur2110_chapters_34_35_36_37_38',
        title: 'Chapters 34, 35, 36, 37, 38',
        status: 'Not Started',
        sections: [
          { id: 'nur2110_ch34_hypothalamic', label: 'Chapter 34: Hypothalamic', status: 'Not Started' },
          { id: 'nur2110_ch35_pituitary', label: 'Chapter 35: Pituitary', status: 'Not Started' },
          { id: 'nur2110_ch36_adrenal', label: 'Chapter 36: Adrenal', status: 'Not Started' },
          { id: 'nur2110_ch37_thyroid', label: 'Chapter 37: Thyroid', status: 'Not Started' },
          { id: 'nur2110_ch38_glucose', label: 'Chapter 38: Glucose', status: 'Not Started' },
        ],
      },
      {
        id: 'nur2110_chapters_50_51_52',
        title: 'Chapters 50, 51, 52',
        status: 'Not Started',
        sections: [
          { id: 'nur2110_ch50_renal_intro', label: 'Chapter 50: Renal System I', status: 'Not Started' },
          { id: 'nur2110_ch51_renal_advanced', label: 'Chapter 51: Renal System II', status: 'Not Started' },
          { id: 'nur2110_ch52_renal_clinical', label: 'Chapter 52: Renal System III', status: 'Not Started' },
        ],
      },
      {
        id: 'nur2110_chapters_15_16',
        title: 'Chapters 15, 16',
        status: 'Not Started',
        sections: [
          { id: 'nur2110_ch15_immune_response', label: 'Chapter 15: Immune Response / Inflammation I', status: 'Not Started' },
          { id: 'nur2110_ch16_immune_response_2', label: 'Chapter 16: Immune Response / Inflammation II', status: 'Not Started' },
        ],
      },
      {
        id: 'nur2110_chapters_24_25_26',
        title: 'Chapters 24, 25, 26',
        status: 'Not Started',
        sections: [
          { id: 'nur2110_ch24_antiparkinsonism', label: 'Chapter 24: Antiparkinsonism', status: 'Not Started' },
          { id: 'nur2110_ch25_muscle_relaxants', label: 'Chapter 25: Muscle Relaxants', status: 'Not Started' },
          { id: 'nur2110_ch26_narcotics_antimigraine', label: 'Chapter 26: Narcotics / Antimigraine', status: 'Not Started' },
        ],
      },
      {
        id: 'nur2110_chapters_17_18',
        title: 'Chapters 17, 18',
        status: 'Not Started',
        sections: [
          { id: 'nur2110_ch17_immune_modulators', label: 'Chapter 17: Immune Modulators', status: 'Not Started' },
          { id: 'nur2110_ch18_vaccines_sera', label: 'Chapter 18: Vaccines / Sera', status: 'Not Started' },
        ],
      },

    ],
  },
  NUR1000: makeScaffoldCourse('NUR1000', 'Fundamentals of Nursing'),
  NUR2200: makeScaffoldCourse('NUR2200', 'Maternal Nursing Care'),
  NUR2300: makeScaffoldCourse('NUR2300', 'Pediatric Nursing'),
  NUR2400: makeScaffoldCourse('NUR2400', 'Medical-Surgical Nursing'),
  NUR2500: makeScaffoldCourse('NUR2500', 'Psychiatric Nursing'),
  NUR2900: makeScaffoldCourse('NUR2900', 'Nursing Leadership'),
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
  const [activeCourse, setActiveCourse] = useState(courseContent[textbookId] ? textbookId : 'NUR1100');
  const [openChapterId, setOpenChapterId] = useState(null);
  const [atlasPhrase] = useState(() => atlasPhrases[Math.floor(Math.random() * atlasPhrases.length)]);
  const [snapshot, setSnapshot] = useState({
    quizAvg: 0,
    flashMastery: 0,
    chaptersCompleted: 0,
    minutesStudied: 0,
  });

  useEffect(() => {
    if (courseContent[textbookId]) setActiveCourse(textbookId);
  }, [textbookId]);

  useEffect(() => {
    try {
      const quiz = JSON.parse(localStorage.getItem('quiz_progress') || '{}');
      const flash = JSON.parse(localStorage.getItem('flashcard_progress') || '{}');
      const progress = JSON.parse(localStorage.getItem('unavida_progress') || '{}');
      const chapterProgress = JSON.parse(localStorage.getItem('unavida_progress_advanced') || '{}');

      const quizAvg = Number(quiz.percentage || 0);
      const mastered = Number(flash?.stats?.cardsMastered || 0);
      const studied = Number(flash?.stats?.cardsStudied || 0);
      const flashMastery = studied > 0 ? Math.round((mastered / studied) * 100) : 0;
      const chaptersCompleted = Object.values(progress || {}).filter((v) => Number(v) >= 100).length;
      const totalMinutes = Math.round(
        Object.values(chapterProgress || {}).reduce((acc, item) => acc + Number(item?.totalTimeSpent || 0), 0) / 60
      );

      setSnapshot({
        quizAvg,
        flashMastery,
        chaptersCompleted,
        minutesStudied: totalMinutes,
      });
    } catch {
      // keep defaults
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

  const course = courseContent[activeCourse];
  const isMasteringPharmacology = textbookId === 'NUR1100' || textbookId === 'NUR2110';
  const selectableCourses = isMasteringPharmacology ? ['NUR1100', 'NUR2110'] : [activeCourse];

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${palette.border}`, background: isDarkMode ? '#14171a' : '#dfe8ff' }}>
        <div style={{ fontSize: 13, color: palette.muted }}>{`Bookshelf / ${course.name}`}</div>
        <div style={{ marginTop: 4, fontWeight: 700, fontSize: 22 }}>{course.name}</div>
        <div style={{ marginTop: 6, fontSize: 13, color: palette.muted }}>
          {`${course.code} • Nursing Education Series`}
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
          <button onClick={() => navigate('/bookshelf')} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}>
            Back to Bookshelf
          </button>
        </div>
      </div>

      <div style={{ padding: 20, display: 'grid', gridTemplateColumns: '1.25fr .75fr', gap: 16 }}>
        <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            {selectableCourses.map((code) => (
              <button
                key={code}
                onClick={() => {
                  if (!isMasteringPharmacology) return;
                  setActiveCourse(code);
                  setOpenChapterId(null);
                }}
                style={{
                  padding: '7px 12px',
                  borderRadius: 999,
                  border: `1px solid ${palette.border}`,
                  background: activeCourse === code ? '#39d0c8' : palette.panel2,
                  color: activeCourse === code ? '#032320' : palette.text,
                  fontWeight: 700,
                  cursor: isMasteringPharmacology ? 'pointer' : 'default',
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
                          onClick={() => {
                            if ((activeCourse === 'NUR1100' || activeCourse === 'NUR2110') && (section.id.startsWith('sec1_') || section.id.startsWith('sec2_'))) {
                              const targetChapter = section.id.startsWith('sec2_') ? 'ch2_pharmacokinetics' : 'ch1_intro';
                              navigate(`/reader/${targetChapter}?section=${section.id}`);
                              return;
                            }

                            // Chapter 3 (Toxicity) mapping
                            if (activeCourse === 'NUR1100' && section.id === 'nur1100_ch3_toxicity') {
                              navigate('/reader/ch3_toxicity');
                              return;
                            }

                            window.alert('This chapter is mapped in the course blueprint. Full reading content is coming soon.');
                          }}
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
              <div style={{ background: palette.panel2, borderRadius: 8, padding: 10 }}><strong>Quiz Avg</strong><div>{snapshot.quizAvg}%</div></div>
              <div style={{ background: palette.panel2, borderRadius: 8, padding: 10 }}><strong>Flashcard Mastery</strong><div>{snapshot.flashMastery}%</div></div>
              <div style={{ background: palette.panel2, borderRadius: 8, padding: 10 }}><strong>Chapters Completed</strong><div>{snapshot.chaptersCompleted} / {course.chapters.length}</div></div>
              <div style={{ background: palette.panel2, borderRadius: 8, padding: 10 }}><strong>Time Studied</strong><div>{snapshot.minutesStudied}m</div></div>
            </div>
          </section>

          <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
            <h3 style={{ margin: '0 0 10px' }}>Study Tools</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              <button onClick={() => navigate('/flashcards')} style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>🎴 Flashcards</button>
              <button onClick={() => navigate('/quizzes')} style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>❓ Quiz</button>
              <button onClick={() => navigate('/case-studies')} style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>🩺 Case Studies</button>
              <button onClick={() => navigate('/reader/references_all')} style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>📚 References (All Chapters)</button>
            </div>
          </section>

          <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
            <h3 style={{ margin: '0 0 10px' }}>Workbook + Video Library</h3>
            <div style={{ display: 'grid', gap: 8 }}>
              <button onClick={() => navigate('/workbook')} style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>📝 Notes</button>
              <button onClick={() => navigate('/workbook')} style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>⚡ Quick Jump</button>
              <button onClick={() => navigate('/workbook')} style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>🔖 Bookmarks</button>
              <button onClick={() => navigate('/video-library')} style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 8, background: palette.panel2, color: palette.text, padding: 9, cursor: 'pointer' }}>🎥 Video Library</button>
            </div>
          </section>

          <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 12 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr minmax(120px,150px)', gap: 10, alignItems: 'end' }}>
              <div style={{ fontSize: 13, alignSelf: 'start' }}>
                <div style={{
                  position: 'relative',
                  background: palette.panel2,
                  border: `1px solid ${palette.border}`,
                  borderRadius: 12,
                  padding: '10px 12px',
                  marginBottom: 8
                }}>
                  <strong>Atlas says:</strong>
                  <div style={{ marginTop: 4 }}>{atlasPhrase}</div>
                  <span style={{
                    position: 'absolute',
                    right: -8,
                    bottom: 14,
                    width: 0,
                    height: 0,
                    borderTop: '8px solid transparent',
                    borderBottom: '8px solid transparent',
                    borderLeft: `10px solid ${palette.panel2}`
                  }} />
                </div>
              </div>
              <img
                src="/assets/atlas-standing.png"
                alt="Atlas"
                style={{ width: '100%', maxHeight: 240, objectFit: 'contain', objectPosition: 'bottom center' }}
              />
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

export default TextbookDashboard;
