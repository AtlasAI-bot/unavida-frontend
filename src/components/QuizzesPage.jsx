import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const questionBank = {
  NUR1100: [
    {
      id: 'q1',
      chapterNumber: 1,
      chapterTitle: 'Chapter 1: Introduction to Pharmacology',
      sectionId: 'sec1_overview_introduction',
      sectionLabel: '1.0 Overview & Introduction',
      question: 'What does pharmacology study?',
      options: ['Only side effects', 'Drugs and their effects on living systems', 'Only medication calculations', 'Only nursing procedures'],
      answer: 1,
      rationale: 'Pharmacology is the science of drugs and their effects on living organisms, not just one subset of medication-related tasks.',
    },
    {
      id: 'q2',
      chapterNumber: 1,
      chapterTitle: 'Chapter 1: Introduction to Pharmacology',
      sectionId: 'sec1_6_pk_vs_pd',
      sectionLabel: '1.6 Pharmacokinetics vs Pharmacodynamics',
      question: 'Which sequence is correct for ADME?',
      options: ['Absorption, Distribution, Metabolism, Excretion', 'Absorption, Metabolism, Distribution, Excretion', 'Distribution, Absorption, Excretion, Metabolism', 'Metabolism, Distribution, Absorption, Excretion'],
      answer: 0,
      rationale: 'ADME is the foundational order used in pharmacokinetics: absorption first, then distribution, metabolism, and excretion.',
    },
    {
      id: 'q3',
      chapterNumber: 1,
      chapterTitle: 'Chapter 1: Introduction to Pharmacology',
      sectionId: 'sec1_6_pk_vs_pd',
      sectionLabel: '1.6 Pharmacokinetics vs Pharmacodynamics',
      question: 'A higher potency drug generally requires:',
      options: ['A larger dose', 'A smaller dose', 'No dose adjustment ever', 'A slower infusion only'],
      answer: 1,
      rationale: 'Higher potency means less drug is needed to produce a given effect.',
    },
    {
      id: 'q4',
      chapterNumber: 1,
      chapterTitle: 'Chapter 1: Introduction to Pharmacology',
      sectionId: 'sec1_8_dosage_calculations',
      sectionLabel: '1.8 Dosage Calculations',
      question: 'Primary nursing priority before medication administration is to:',
      options: ['Memorize all generic names', 'Verify order, patient, and safety checks', 'Call pharmacy every time', 'Skip patient education'],
      answer: 1,
      rationale: 'Safety verification is the pre-administration priority to prevent avoidable harm.',
    },
    {
      id: 'q5',
      chapterNumber: 2,
      chapterTitle: 'Chapter 2: Medication Safety Foundations',
      sectionId: 'ch2_1',
      sectionLabel: '2.1 Error Prevention',
      question: 'Best action when an order seems unsafe:',
      options: ['Give medication anyway', 'Hold and clarify with prescriber', 'Ask another student only', 'Ignore concern'],
      answer: 1,
      rationale: 'If an order appears unsafe, the nurse should pause and clarify before administration.',
    },
  ],
  NUR2110: [
    {
      id: 'q6',
      chapterNumber: 1,
      chapterTitle: 'Chapter 1: Advanced Therapeutics',
      sectionId: 'p2_ch1_1',
      sectionLabel: '1.1 Polypharmacy Strategy',
      question: 'Polypharmacy risk increases most with:',
      options: ['Single drug treatment', 'Multiple prescribers and poor reconciliation', 'Pediatric patients only', 'One-time doses'],
      answer: 1,
      rationale: 'Risk rises when medication lists are fragmented across providers without strong reconciliation.',
    },
  ],
};

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const QuizzesPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCourse, setActiveCourse] = useState('NUR1100');
  const [mode, setMode] = useState('practice'); // practice | test
  const [selectedChapterNumbers, setSelectedChapterNumbers] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);

  const [sessionQuestions, setSessionQuestions] = useState([]);
  const [sessionIndex, setSessionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(90);

  useEffect(() => {
    const savedTheme = localStorage.getItem('unavidaTheme') || 'darkplus';
    setIsDarkMode(savedTheme !== 'light');
  }, []);

  useEffect(() => {
    if (mode !== 'test' || !sessionQuestions.length || submitted || revealed) return undefined;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitCurrent(null, true);
          return 90;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  });

  const palette = useMemo(() => {
    if (isDarkMode) return { page: '#0f1113', panel: '#181b1f', panel2: '#22262b', text: '#f5f7fa', muted: '#c5cbd3', border: 'rgba(255,255,255,.12)' };
    return { page: '#edf2ff', panel: '#d8e3ff', panel2: '#c8d8ff', text: '#101827', muted: '#334155', border: '#9fb3e8' };
  }, [isDarkMode]);

  const allQuestions = questionBank[activeCourse] || [];

  const chapters = useMemo(() => {
    const map = new Map();
    allQuestions.forEach((q) => {
      if (!map.has(q.chapterNumber)) map.set(q.chapterNumber, q.chapterTitle);
    });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [allQuestions]);

  const sections = useMemo(() => {
    const map = new Map();
    allQuestions
      .filter((q) => selectedChapterNumbers.length === 0 || selectedChapterNumbers.includes(q.chapterNumber))
      .forEach((q) => {
        if (!map.has(q.sectionId)) map.set(q.sectionId, q.sectionLabel);
      });
    return Array.from(map.entries());
  }, [allQuestions, selectedChapterNumbers]);

  const filteredPool = useMemo(() => {
    return allQuestions.filter((q) => {
      const chapterOk = selectedChapterNumbers.length === 0 || selectedChapterNumbers.includes(q.chapterNumber);
      const sectionOk = selectedSectionIds.length === 0 || selectedSectionIds.includes(q.sectionId);
      return chapterOk && sectionOk;
    });
  }, [allQuestions, selectedChapterNumbers, selectedSectionIds]);

  const currentQuestion = sessionQuestions[sessionIndex] || null;

  const toggleChapter = (chapterNumber) => {
    setSelectedChapterNumbers((prev) => (prev.includes(chapterNumber) ? prev.filter((c) => c !== chapterNumber) : [...prev, chapterNumber]));
  };

  const toggleSection = (sectionId) => {
    setSelectedSectionIds((prev) => (prev.includes(sectionId) ? prev.filter((s) => s !== sectionId) : [...prev, sectionId]));
  };

  const buildQuiz = () => {
    const pool = filteredPool;
    if (!pool.length) {
      window.alert('No questions match your selected scope.');
      return;
    }
    const count = Math.max(1, Math.min(Number(questionCount) || 1, pool.length));
    const quiz = shuffle(pool).slice(0, count);
    setSessionQuestions(quiz);
    setSessionIndex(0);
    setResponses([]);
    setSelectedOption(null);
    setRevealed(false);
    setSubmitted(false);
    setTimeLeft(90);
  };

  const handleSubmitCurrent = (forcedOption = null, timedOut = false) => {
    if (!currentQuestion) return;
    const answer = forcedOption !== null ? forcedOption : selectedOption;
    const entry = {
      questionId: currentQuestion.id,
      chapterTitle: currentQuestion.chapterTitle,
      sectionId: currentQuestion.sectionId,
      sectionLabel: currentQuestion.sectionLabel,
      question: currentQuestion.question,
      selected: answer,
      correct: currentQuestion.answer,
      timedOut,
      isCorrect: answer === currentQuestion.answer,
      rationale: currentQuestion.rationale,
      readerLink: `/reader/ch1_intro?section=${currentQuestion.sectionId}`,
      options: currentQuestion.options,
    };
    setResponses((prev) => [...prev, entry]);

    if (mode === 'practice') {
      setRevealed(true);
      return;
    }

    const isLast = sessionIndex >= sessionQuestions.length - 1;
    if (isLast) {
      setSubmitted(true);
    } else {
      setSessionIndex((idx) => idx + 1);
      setSelectedOption(null);
      setTimeLeft(90);
    }
  };

  const goNextPractice = () => {
    const isLast = sessionIndex >= sessionQuestions.length - 1;
    if (isLast) {
      setSubmitted(true);
    } else {
      setSessionIndex((idx) => idx + 1);
      setSelectedOption(null);
      setRevealed(false);
      setTimeLeft(90);
    }
  };

  const result = useMemo(() => {
    if (!submitted) return null;
    const score = responses.filter((r) => r.isCorrect).length;
    const total = responses.length;
    const percentage = total ? Math.round((score / total) * 100) : 0;
    localStorage.setItem('quiz_progress', JSON.stringify({ score, totalQuestions: total, percentage, passed: percentage >= 75, completedAt: new Date().toISOString(), mode }));
    return { score, total, percentage };
  }, [submitted, responses, mode]);

  const answerTextColor = isDarkMode ? '#ffffff' : '#111827';

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${palette.border}`, background: isDarkMode ? '#14171a' : '#dfe8ff' }}>
        <div style={{ fontSize: 13, color: palette.muted }}>Bookshelf / Mastering Pharmacology / Quizzes</div>
        <div style={{ marginTop: 4, fontWeight: 700, fontSize: 22 }}>Quizzes</div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button onClick={() => { const n = !isDarkMode; setIsDarkMode(n); const t = n ? (localStorage.getItem('unavidaThemeLastDark') || 'darkplus') : 'light'; localStorage.setItem('unavidaTheme', t); if (n) localStorage.setItem('unavidaThemeLastDark', t); }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={() => navigate(`/textbook/${activeCourse}`)} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}>
            Back to Textbook
          </button>
        </div>
      </div>

      <div style={{ padding: 20, maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 14 }}>
        <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
          <h3 style={{ margin: '0 0 10px' }}>Build Your Quiz</h3>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {['NUR1100', 'NUR2110'].map((code) => (
              <button key={code} onClick={() => { setActiveCourse(code); setSelectedChapterNumbers([]); setSelectedSectionIds([]); setSessionQuestions([]); setResponses([]); setSubmitted(false); }} style={{ padding: '7px 12px', borderRadius: 999, border: `1px solid ${palette.border}`, background: activeCourse === code ? '#39d0c8' : palette.panel2, color: activeCourse === code ? '#032320' : palette.text, fontWeight: 700, cursor: 'pointer' }}>{code}</button>
            ))}
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: palette.muted, marginBottom: 6 }}>Mode</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setMode('practice')} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: mode === 'practice' ? '#39d0c8' : palette.panel2, color: mode === 'practice' ? '#032320' : palette.text, fontWeight: 700, cursor: 'pointer' }}>Practice</button>
              <button onClick={() => setMode('test')} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: mode === 'test' ? '#39d0c8' : palette.panel2, color: mode === 'test' ? '#032320' : palette.text, fontWeight: 700, cursor: 'pointer' }}>Test</button>
            </div>
            <div style={{ marginTop: 6, fontSize: 12, color: palette.muted }}>
              {mode === 'practice' ? 'Practice: immediate rationale + textbook link after each answer.' : 'Test: 1:30 per question, rationale shown at end.'}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: palette.muted, marginBottom: 6 }}>Chapter scope (none selected = all)</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {chapters.map(([num, title]) => (
                <label key={num} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                  <input type="checkbox" checked={selectedChapterNumbers.includes(num)} onChange={() => toggleChapter(num)} />
                  {title}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: palette.muted, marginBottom: 6 }}>Section scope (none selected = all from selected chapters)</div>
            <div style={{ maxHeight: 140, overflow: 'auto', border: `1px solid ${palette.border}`, borderRadius: 8, padding: 8, background: palette.panel2 }}>
              {sections.map(([id, label]) => (
                <label key={id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 6 }}>
                  <input type="checkbox" checked={selectedSectionIds.includes(id)} onChange={() => toggleSection(id)} />
                  {label}
                </label>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: palette.muted, marginBottom: 6 }}>Number of questions (max {filteredPool.length || 0})</div>
            <input type="number" min={1} max={Math.max(1, filteredPool.length)} value={questionCount} onChange={(e) => setQuestionCount(e.target.value)} style={{ width: 120, padding: '8px 10px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text }} />
          </div>

          <button onClick={buildQuiz} style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: '#39d0c8', color: '#032320', fontWeight: 700, cursor: 'pointer' }}>Generate Quiz</button>
        </section>

        <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
          {!sessionQuestions.length ? (
            <div style={{ color: palette.muted }}>Build a quiz to start.</div>
          ) : submitted ? (
            <div>
              <h3 style={{ marginTop: 0 }}>Results</h3>
              <div style={{ marginBottom: 12 }}>
                Score: <strong>{result?.score}/{result?.total} ({result?.percentage}%)</strong>
              </div>

              <div style={{ display: 'grid', gap: 10 }}>
                {responses.map((r, idx) => (
                  <article key={r.questionId + idx} style={{ border: `1px solid ${palette.border}`, borderRadius: 10, background: palette.panel2, padding: 10 }}>
                    <div style={{ fontSize: 12, color: palette.muted }}>{r.chapterTitle} • {r.sectionLabel}</div>
                    <div style={{ fontWeight: 700, margin: '6px 0' }}>{r.question}</div>
                    <div style={{ fontSize: 13, color: r.isCorrect ? '#22c55e' : '#ef4444' }}>
                      {r.isCorrect ? 'Correct' : 'Incorrect'}
                      {r.timedOut ? ' (timed out)' : ''}
                    </div>
                    <div style={{ marginTop: 6, fontSize: 13 }}>Rationale: {r.rationale}</div>
                    <div style={{ marginTop: 6 }}>
                      <a href={r.readerLink} style={{ color: '#38bdf8', textDecoration: 'underline' }}>Go to textbook section</a>
                    </div>
                  </article>
                ))}
              </div>

              <button onClick={() => { setSessionQuestions([]); setResponses([]); setSubmitted(false); }} style={{ marginTop: 12, padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text, cursor: 'pointer' }}>Build Another Quiz</button>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontSize: 13, color: palette.muted }}>Question {sessionIndex + 1} / {sessionQuestions.length}</div>
                {mode === 'test' && <div style={{ fontWeight: 700, color: timeLeft <= 20 ? '#ef4444' : palette.text }}>⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</div>}
              </div>

              <div style={{ fontSize: 12, color: palette.muted }}>{currentQuestion.chapterTitle} • {currentQuestion.sectionLabel}</div>
              <h3 style={{ margin: '6px 0 10px' }}>{currentQuestion.question}</h3>

              <div style={{ display: 'grid', gap: 8 }}>
                {currentQuestion.options.map((opt, idx) => {
                  const picked = selectedOption === idx;
                  const isCorrect = revealed && idx === currentQuestion.answer;
                  const isWrong = revealed && picked && idx !== currentQuestion.answer;
                  return (
                    <button
                      key={idx}
                      onClick={() => !revealed && setSelectedOption(idx)}
                      style={{
                        textAlign: 'left',
                        borderRadius: 8,
                        border: `1px solid ${palette.border}`,
                        padding: '8px 10px',
                        background: isCorrect ? '#166534' : isWrong ? '#7f1d1d' : picked ? '#0ea5e9' : palette.panel2,
                        color: answerTextColor,
                        cursor: revealed ? 'default' : 'pointer',
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!revealed ? (
                <button
                  onClick={() => {
                    if (selectedOption === null) return window.alert('Select an answer first.');
                    handleSubmitCurrent();
                  }}
                  style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: '#39d0c8', color: '#032320', fontWeight: 700, cursor: 'pointer' }}
                >
                  Submit Answer
                </button>
              ) : (
                <div style={{ marginTop: 10, border: `1px solid ${palette.border}`, borderRadius: 10, padding: 10, background: palette.panel2 }}>
                  <div style={{ fontSize: 13, color: selectedOption === currentQuestion.answer ? '#22c55e' : '#ef4444', fontWeight: 700, marginBottom: 6 }}>
                    {selectedOption === currentQuestion.answer ? 'Correct' : 'Incorrect'}
                  </div>
                  <div style={{ fontSize: 13, marginBottom: 6 }}>Rationale: {currentQuestion.rationale}</div>
                  <a href={`/reader/ch1_intro?section=${currentQuestion.sectionId}`} style={{ color: '#38bdf8', textDecoration: 'underline' }}>Go to textbook section</a>
                  <div>
                    <button onClick={goNextPractice} style={{ marginTop: 10, padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: '#39d0c8', color: '#032320', fontWeight: 700, cursor: 'pointer' }}>
                      {sessionIndex >= sessionQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default QuizzesPage;
