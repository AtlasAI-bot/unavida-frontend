import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const flashcardBank = {
  NUR1100: [
    { id: 'f1', chapterNumber: 1, chapterTitle: 'Chapter 1: Introduction to Pharmacology', sectionId: 'sec1_overview_introduction', sectionLabel: '1.0 Overview & Introduction', front: 'Define pharmacology.', back: 'Pharmacology is the study of drugs and their effects on living organisms.' },
    { id: 'f2', chapterNumber: 1, chapterTitle: 'Chapter 1: Introduction to Pharmacology', sectionId: 'sec1_6_pk_vs_pd', sectionLabel: '1.6 Pharmacokinetics vs Pharmacodynamics', front: 'What does ADME stand for?', back: 'Absorption, Distribution, Metabolism, and Excretion.' },
    { id: 'f3', chapterNumber: 1, chapterTitle: 'Chapter 1: Introduction to Pharmacology', sectionId: 'sec1_6_pk_vs_pd', sectionLabel: '1.6 Pharmacokinetics vs Pharmacodynamics', front: 'Differentiate pharmacokinetics vs pharmacodynamics.', back: 'Pharmacokinetics = what the body does to the drug; Pharmacodynamics = what the drug does to the body.' },
    { id: 'f4', chapterNumber: 1, chapterTitle: 'Chapter 1: Introduction to Pharmacology', sectionId: 'sec1_4_regulatory_bodies_fda', sectionLabel: '1.4 Regulatory Bodies & FDA Process', front: 'What is the FDA’s core medication safety role?', back: 'To evaluate and regulate medications for safety, efficacy, and quality.' },
    { id: 'f5', chapterNumber: 1, chapterTitle: 'Chapter 1: Introduction to Pharmacology', sectionId: 'sec1_8_dosage_calculations', sectionLabel: '1.8 Dosage Calculations', front: 'Why is dosage accuracy critical?', back: 'Dose errors can cause therapeutic failure or toxicity; safe math protects patients.' },
    { id: 'f6', chapterNumber: 2, chapterTitle: 'Chapter 2: Medication Safety Foundations', sectionId: 'ch2_1', sectionLabel: '2.1 Error Prevention', front: 'Best first step when a med order seems unsafe?', back: 'Hold administration and clarify with prescriber/pharmacy before giving.' },
  ],
  NUR2110: [
    { id: 'f7', chapterNumber: 1, chapterTitle: 'Chapter 1: Advanced Therapeutics', sectionId: 'p2_ch1_1', sectionLabel: '1.1 Polypharmacy Strategy', front: 'What increases polypharmacy risk most?', back: 'Multiple prescribers without medication reconciliation.' },
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

export const FlashcardsPage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeCourse, setActiveCourse] = useState('NUR1100');
  const [selectedChapterNumbers, setSelectedChapterNumbers] = useState([]);
  const [selectedSectionIds, setSelectedSectionIds] = useState([]);
  const [cardCount, setCardCount] = useState(6);

  const [deck, setDeck] = useState([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('unavidaTheme') || 'darkplus';
    setIsDarkMode(savedTheme !== 'light');
  }, []);

  const palette = useMemo(() => {
    if (isDarkMode) return { page: '#0f1113', panel: '#181b1f', panel2: '#22262b', text: '#f5f7fa', muted: '#c5cbd3', border: 'rgba(255,255,255,.12)' };
    return { page: '#edf2ff', panel: '#d8e3ff', panel2: '#c8d8ff', text: '#101827', muted: '#334155', border: '#9fb3e8' };
  }, [isDarkMode]);

  const allCards = flashcardBank[activeCourse] || [];

  const chapters = useMemo(() => {
    const map = new Map();
    allCards.forEach((c) => { if (!map.has(c.chapterNumber)) map.set(c.chapterNumber, c.chapterTitle); });
    return Array.from(map.entries()).sort((a, b) => a[0] - b[0]);
  }, [allCards]);

  const sections = useMemo(() => {
    const map = new Map();
    allCards.filter((c) => selectedChapterNumbers.length === 0 || selectedChapterNumbers.includes(c.chapterNumber)).forEach((c) => {
      if (!map.has(c.sectionId)) map.set(c.sectionId, c.sectionLabel);
    });
    return Array.from(map.entries());
  }, [allCards, selectedChapterNumbers]);

  const filteredPool = useMemo(() => allCards.filter((c) => {
    const chapterOk = selectedChapterNumbers.length === 0 || selectedChapterNumbers.includes(c.chapterNumber);
    const sectionOk = selectedSectionIds.length === 0 || selectedSectionIds.includes(c.sectionId);
    return chapterOk && sectionOk;
  }), [allCards, selectedChapterNumbers, selectedSectionIds]);

  const current = deck[cardIndex] || null;

  const toggleChapter = (n) => setSelectedChapterNumbers((prev) => prev.includes(n) ? prev.filter((v) => v !== n) : [...prev, n]);
  const toggleSection = (id) => setSelectedSectionIds((prev) => prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]);

  const buildDeck = () => {
    if (!filteredPool.length) return window.alert('No cards match your selected content.');
    const count = Math.max(1, Math.min(Number(cardCount) || 1, filteredPool.length));
    const nextDeck = shuffle(filteredPool).slice(0, count);
    setDeck(nextDeck);
    setCardIndex(0);
    setFlipped(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: palette.page, color: palette.text }}>
      <div style={{ padding: '16px 22px', borderBottom: `1px solid ${palette.border}`, background: isDarkMode ? '#14171a' : '#dfe8ff' }}>
        <div style={{ fontSize: 13, color: palette.muted }}>Bookshelf / Mastering Pharmacology / Flashcards</div>
        <div style={{ marginTop: 4, fontWeight: 700, fontSize: 22 }}>Flashcards</div>

        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button onClick={() => { const n = !isDarkMode; setIsDarkMode(n); const t = n ? (localStorage.getItem('unavidaThemeLastDark') || 'darkplus') : 'light'; localStorage.setItem('unavidaTheme', t); if (n) localStorage.setItem('unavidaThemeLastDark', t); }} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}>
            {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
          <button onClick={() => navigate(`/textbook/${activeCourse}`)} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel, color: palette.text, cursor: 'pointer' }}>Back to Textbook</button>
        </div>
      </div>

      <div style={{ padding: 20, maxWidth: 1120, margin: '0 auto', display: 'grid', gridTemplateColumns: '0.95fr 1.05fr', gap: 14 }}>
        <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
          <h3 style={{ margin: '0 0 10px' }}>Build Your Flashcards</h3>

          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            {['NUR1100', 'NUR2110'].map((code) => (
              <button key={code} onClick={() => { setActiveCourse(code); setSelectedChapterNumbers([]); setSelectedSectionIds([]); setDeck([]); }} style={{ padding: '7px 12px', borderRadius: 999, border: `1px solid ${palette.border}`, background: activeCourse === code ? '#39d0c8' : palette.panel2, color: activeCourse === code ? '#032320' : palette.text, fontWeight: 700, cursor: 'pointer' }}>{code}</button>
            ))}
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
            <div style={{ fontSize: 12, color: palette.muted, marginBottom: 6 }}>Number of flashcards (max {filteredPool.length || 0})</div>
            <input type="number" min={1} max={Math.max(1, filteredPool.length)} value={cardCount} onChange={(e) => setCardCount(e.target.value)} style={{ width: 120, padding: '8px 10px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text }} />
          </div>

          <button onClick={buildDeck} style={{ padding: '9px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: '#39d0c8', color: '#032320', fontWeight: 700, cursor: 'pointer' }}>Generate Deck</button>
        </section>

        <section style={{ background: palette.panel, border: `1px solid ${palette.border}`, borderRadius: 12, padding: 14 }}>
          {!deck.length ? (
            <div style={{ color: palette.muted }}>Generate a deck to start studying.</div>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: palette.muted }}>
                <span>{current.chapterTitle}</span>
                <span>{cardIndex + 1}/{deck.length}</span>
              </div>
              <div style={{ fontSize: 12, color: palette.muted, marginBottom: 8 }}>{current.sectionLabel}</div>

              <button
                onClick={() => setFlipped((f) => !f)}
                style={{ width: '100%', minHeight: 220, textAlign: 'left', borderRadius: 12, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text, padding: 16, cursor: 'pointer' }}
              >
                <div style={{ fontSize: 12, color: palette.muted, marginBottom: 8 }}>{flipped ? 'Back (answer)' : 'Front (question)'}</div>
                <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.35 }}>{flipped ? current.back : current.front}</div>
              </button>

              <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                <button onClick={() => { setCardIndex((i) => Math.max(0, i - 1)); setFlipped(false); }} disabled={cardIndex === 0} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text, cursor: 'pointer', opacity: cardIndex === 0 ? 0.5 : 1 }}>Previous</button>
                <button onClick={() => setFlipped((f) => !f)} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: '#39d0c8', color: '#032320', fontWeight: 700, cursor: 'pointer' }}>Flip Card</button>
                <button onClick={() => { setCardIndex((i) => Math.min(deck.length - 1, i + 1)); setFlipped(false); }} disabled={cardIndex >= deck.length - 1} style={{ padding: '8px 12px', borderRadius: 8, border: `1px solid ${palette.border}`, background: palette.panel2, color: palette.text, cursor: 'pointer', opacity: cardIndex >= deck.length - 1 ? 0.5 : 1 }}>Next</button>
                <a href={`/reader/ch1_intro?section=${current.sectionId}`} style={{ marginLeft: 'auto', color: '#38bdf8', textDecoration: 'underline', alignSelf: 'center' }}>Go to textbook section</a>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default FlashcardsPage;
