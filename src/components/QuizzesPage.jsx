import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const quizCatalog = {
  NUR1100: [
    {
      id: 'nur1100-ch1',
      chapterNumber: 1,
      chapterTitle: 'Chapter 1: Introduction to Pharmacology',
      quizTitle: 'Chapter 1 Mastery Quiz',
      questions: [
        {
          q: 'What does pharmacology study?',
          options: ['Only side effects', 'Drugs and their effects on living systems', 'Only medication calculations', 'Only nursing procedures'],
          answer: 1,
        },
        {
          q: 'Which sequence is correct for ADME?',
          options: ['Absorption, Distribution, Metabolism, Excretion', 'Absorption, Metabolism, Distribution, Excretion', 'Distribution, Absorption, Excretion, Metabolism', 'Metabolism, Distribution, Absorption, Excretion'],
          answer: 0,
        },
        {
          q: 'A higher potency drug generally requires:',
          options: ['A larger dose', 'A smaller dose', 'No dose adjustment ever', 'A slower infusion only'],
          answer: 1,
        },
        {
          q: 'Which body system is most responsible for drug excretion?',
          options: ['Respiratory', 'Musculoskeletal', 'Renal', 'Integumentary'],
          answer: 2,
        },
        {
          q: 'Primary nursing priority before medication administration is to:',
          options: ['Memorize all generic names', 'Verify order + patient + safety checks', 'Call pharmacy every time', 'Skip patient education'],
          answer: 1,
        },
      ],
    },
    {
      id: 'nur1100-ch2',
      chapterNumber: 2,
      chapterTitle: 'Chapter 2: Medication Safety Foundations',
      quizTitle: 'Chapter 2 Safety Quiz',
      questions: [
        {
          q: 'Medication error prevention starts with:',
          options: ['Fast med pass', 'Independent double-check habits', 'Skipping documentation', 'Relying on memory only'],
          answer: 1,
        },
        {
          q: 'Best action when an order seems unsafe:',
          options: ['Give medication anyway', 'Hold and clarify with prescriber', 'Ask another student', 'Ignore concern'],
          answer: 1,
        },
      ],
    },
  ],
  NUR2110: [
    {
      id: 'nur2110-ch1',
      chapterNumber: 1,
      chapterTitle: 'Chapter 1: Advanced Therapeutics',
      quizTitle: 'Advanced Therapeutics Readiness Check',
      questions: [
        {
          q: 'Polypharmacy risk increases most with:',
          options: ['Single drug treatment', 'Multiple prescribers and poor reconciliation', 'Pediatric patients only', 'One-time doses'],
          answer: 1,
        },
      ],
    },
  ],
};

export const QuizzesPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCourse, setActiveCourse] = useState('NUR1100');
  const [query, setQuery] = useState('');
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('unavidaTheme') || 'darkplus';
    setIsDarkMode(savedTheme !== 'light');
  }, []);

  const palette = useMemo(() => {
    if (isDarkMode) {
      return { page: '#0f1113', panel: '#181b1f', panel2: '#22262b', text: '#f5f7fa', muted: '#c5cbd3', border: 'rgba(255,255,255,.12)' };
    }
    return { page: '#edf2ff', panel: '#d8e3ff', panel2: '#c8d8ff', text: '#101827', muted: '#334155', border: '#9fb3e8' };
  }, [isDarkMode]);

  const quizzes = useMemo(() => {
    const list = [...(quizCatalog[activeCourse] || [])].sort((a, b) => a.chapterNumber - b.chapterNumber);
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((item) => `${item.chapterTitle} ${item.quizTitle}`.toLowerCase().includes(q));
  }, [activeCourse, query]);

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId) || null;

  const submitQuiz = () => {
    if (!selectedQuiz) return;
    setSubmitted(true);
    const score = selectedQuiz.questions.reduce((acc, question, idx) => (answers[idx] === question.answer ? acc + 1 : acc), 0);
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    localStorage.setItem(
      'quiz_progress',
      JSON.stringify({
        score,
        totalQuestions: selectedQuiz.questions.length,
        percentage,
        passed: percentage >= 75,
        completedAt: new Date().toISOString(),
        chapter: selectedQuiz.chapterTitle,
        quizId: selectedQuiz.id,
      })
    );
  };

  const scoreData = useMemo(() => {
    if (!submitted || !selectedQuiz) return null;
    const score = selectedQuiz.questions.reduce((acc, question, idx) => (answers[idx] === question.answer ? acc + 1 : acc), 0);
    const percentage = Math.round((score / selectedQuiz.questions.length) * 100);
    return { score, percentage, total: selectedQuiz.questions.length };
  }, [submitted, selectedQuiz, answers]);

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

      <div style={{ padding: 20, maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 14 }}>
        <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {['NUR1100', 'NUR2110'].map((code) => (
              <button key={code} onClick={() => { setActiveCourse(code); setSelectedQuizId(null); setAnswers({}); setSubmitted(false); }} style={{ padding: '7px 12px', borderRadius: 999, border: `1px solid ${palette.border}`, background: activeCourse === code ? '#39d0c8' : palette.panel2, color: activeCourse === code ? '#032320' : palette.text, fontWeight: 700, cursor: 'pointer' }}>{code}</button>
            ))}
          </div>

          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search quiz by chapter/title..." style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text, marginBottom: 12 }} />

          <div style={{ display: 'grid', gap: 8 }}>
            {quizzes.map((quiz) => (
              <button key={quiz.id} onClick={() => { setSelectedQuizId(quiz.id); setAnswers({}); setSubmitted(false); }} style={{ textAlign: 'left', border: `1px solid ${palette.border}`, borderRadius: 10, background: selectedQuizId === quiz.id ? '#39d0c8' : palette.panel2, color: selectedQuizId === quiz.id ? '#032320' : palette.text, padding: 10, cursor: 'pointer' }}>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{quiz.chapterTitle}</div>
                <div style={{ fontWeight: 700 }}>{quiz.quizTitle}</div>
                <div style={{ fontSize: 12 }}>{quiz.questions.length} questions</div>
              </button>
            ))}
          </div>
        </section>

        <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
          {!selectedQuiz ? (
            <div style={{ color: palette.muted }}>Select a quiz to begin.</div>
          ) : (
            <>
              <h3 style={{ margin: '0 0 10px' }}>{selectedQuiz.quizTitle}</h3>
              <div style={{ fontSize: 13, color: palette.muted, marginBottom: 12 }}>{selectedQuiz.chapterTitle}</div>

              <div style={{ display: 'grid', gap: 12 }}>
                {selectedQuiz.questions.map((question, idx) => (
                  <article key={idx} style={{ border: `1px solid ${palette.border}`, borderRadius: 10, padding: 10, background: palette.panel2 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>{idx + 1}. {question.q}</div>
                    <div style={{ display: 'grid', gap: 6 }}>
                      {question.options.map((opt, oi) => {
                        const picked = answers[idx] === oi;
                        const correct = submitted && question.answer === oi;
                        const wrongPicked = submitted && picked && question.answer !== oi;
                        return (
                          <button key={oi} onClick={() => !submitted && setAnswers((prev) => ({ ...prev, [idx]: oi }))} style={{ textAlign: 'left', borderRadius: 8, border: `1px solid ${palette.border}`, padding: '8px 10px', background: correct ? '#166534' : wrongPicked ? '#7f1d1d' : picked ? '#0ea5e9' : palette.panel, color: '#fff', cursor: submitted ? 'default' : 'pointer' }}>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </article>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                {!submitted ? (
                  <button onClick={submitQuiz} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: '#39d0c8', color: '#032320', fontWeight: 700, cursor: 'pointer' }}>Submit Quiz</button>
                ) : (
                  <button onClick={() => { setAnswers({}); setSubmitted(false); }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text, fontWeight: 700, cursor: 'pointer' }}>Retake</button>
                )}
              </div>

              {scoreData && (
                <div style={{ marginTop: 12, border: `1px solid ${palette.border}`, borderRadius: 10, padding: 10, background: palette.panel2 }}>
                  Score: <strong>{scoreData.score}/{scoreData.total} ({scoreData.percentage}%)</strong>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default QuizzesPage;
