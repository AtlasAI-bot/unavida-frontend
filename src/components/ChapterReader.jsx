import React, { useState, useEffect, useRef } from 'react';
import chapterData from '../data/CHAPTER_1_UNAVIDA_PRODUCTION.json';
import './ChapterReader.css';

export const ChapterReader = () => {
  const [selectedSection, setSelectedSection] = useState(null);
  const [theme, setTheme] = useState('light');
  const [focusReader, setFocusReader] = useState(false);
  const [hideToc, setHideToc] = useState(false);
  const [readAloudOn, setReadAloudOn] = useState(false);
  const [prefsModalOpen, setPrefsModalOpen] = useState(false);
  const [textSize, setTextSize] = useState(17);
  const [font, setFont] = useState('Inter, system-ui, sans-serif');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [readerWidth, setReaderWidth] = useState(920);
  const mainScrollRef = useRef(null);
  const [revealedAnswers, setRevealedAnswers] = useState({});
  const [annotations, setAnnotations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('unavida:annotations') || '[]'); } catch { return []; }
  });
  const [bookmarks, setBookmarks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('unavida:bookmarks') || '[]'); } catch { return []; }
  });
  const [flashcards, setFlashcards] = useState(() => {
    try { return JSON.parse(localStorage.getItem('unavida:flashcards') || '[]'); } catch { return []; }
  });
  const [quickJumpOpen, setQuickJumpOpen] = useState(false);
  const [toolView, setToolView] = useState('content');
  const [flashIndex, setFlashIndex] = useState(0);
  const [flashShowBack, setFlashShowBack] = useState(false);
  const [topMenuOpen, setTopMenuOpen] = useState(false);
  const [flashFilter, setFlashFilter] = useState('all');
  const [printPickerOpen, setPrintPickerOpen] = useState(false);
  const [printSelectedIds, setPrintSelectedIds] = useState([]);
  const [printAction, setPrintAction] = useState('print');
  const [newNote, setNewNote] = useState('');
  const [highlightColor, setHighlightColor] = useState('yellow');

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

  const countWords = (value = '') =>
    value
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .filter(Boolean).length;

  const getSectionWordCount = (section) => {
    if (!section) return 0;
    let total = 0;
    total += countWords(section.content || '');
    (section.contentBlocks || []).forEach((block) => {
      total += countWords(block.title || '');
      total += countWords(block.content || '');
      total += countWords(block.htmlReady || '');
      (block.questions || []).forEach((q) => {
        total += countWords(q.question || '');
        total += countWords(q.rationale || '');
        Object.values(q.options || {}).forEach((opt) => {
          total += countWords(opt || '');
        });
        (q.expectedAnswerElements || []).forEach((el) => {
          total += countWords(el || '');
        });
      });
    });
    return total;
  };

  const sectionTitle = cleanHeading(selectedSection?.title || '');
  const currentWordCount = getSectionWordCount(selectedSection);

  const glossaryEntries = (() => {
    if (selectedSection?.id !== 'sec1_9_key_terms_glossary') return [];
    const lines = (selectedSection.content || '').split('\n').map((l) => l.trim()).filter(Boolean);
    const entries = [];
    let current = null;
    for (const line of lines) {
      const m = line.match(/^([A-Z0-9\-\s\/]+):\s*(.+)$/);
      if (m) {
        if (current) entries.push(current);
        current = { term: m[1].trim(), definition: m[2].trim() };
      } else if (current) {
        current.definition += ' ' + line;
      }
    }
    if (current) entries.push(current);
    return entries;
  })();

  const curatedFlashcardsByTopic = {
    'Clinical Application & Safety': [
      { front: 'What percentage of hospital admissions involve medication errors according to the text?', back: 'Approximately 4-5%.' },
      { front: 'What must a nurse do if a drug name looks or sounds like another?', back: 'Verify the Right Drug carefully to prevent a look-alike/sound-alike error.' },
      { front: 'Is pharmacology a static field? Why?', back: 'No; new drugs, new uses for old drugs, and new resistance patterns are constantly evolving.' },
      { front: 'What is Evidence-Based Practice (EBP) in pharmacology?', back: 'Using the best available research to guide medication interventions and patient care.' },
      { front: 'What role do Advanced Practice Nurses (NPs) play in pharmacology?', back: 'They have prescriptive authority and manage complex therapy regimens.' },
      { front: 'Why is Communication listed as a key principle for safe use?', back: 'To ensure all team members are aware of doses, changes, and patient responses to prevent errors.' },
      { front: "What should a nurse check for in a patient's medical history before administration?", back: 'Contraindications and potential drug-drug interactions.' },
      { front: 'What does the Right Route prevent?', back: 'Complications like tissue damage or lack of efficacy from inappropriate administration route.' },
      { front: 'What is the relationship between drug structure and drug action?', back: "Small changes in chemical structure can drastically change a drug's efficacy or side effect profile." },
      { front: 'What is the ultimate goal of pharmacology in a nursing context?', back: 'To improve human health and ensure patient safety.' },
    ],
    'Core Pharmacological Concepts': [
      { front: 'What is Selective Toxicity?', back: 'The ability of a drug to strike a target (like bacteria) without harming the host (human cells).' },
      { front: 'Define the Dose-Response Relationship.', back: 'The relationship between dose size and the intensity of response produced.' },
      { front: 'What is the difference between Potency and Efficacy?', back: 'Potency is amount needed for effect; Efficacy is the maximum effect a drug can produce.' },
      { front: 'What is a Narrow Therapeutic Index?', back: 'A small range between therapeutic and toxic dose, requiring careful monitoring.' },
      { front: 'Why is Individualization important in pharmacology?', back: 'Because age, weight, genetics, and physiology mean one dose does not fit all patients.' },
      { front: 'What is the Therapeutic Intent of a drug?', back: 'The specific intended beneficial goal of the medication for the patient.' },
    ],
    'Foundations & Definitions': [
      { front: 'What is the literal Greek derivation of the word Pharmacology?', back: 'Pharmakon (drug or poison) and logos (study or science).' },
      { front: 'How is modern pharmacology defined beyond its Greek roots?', back: 'The study of drugs and their interactions with biological systems.' },
      { front: 'What is Pharmacognosy?', back: 'The study of natural drug sources, such as plants, fungi, and animals.' },
      { front: 'What is Pharmaceutics?', back: 'The study of how drugs are formulated and delivered to the body.' },
      { front: 'Define Pharmacokinetics.', back: 'How the body handles a drug: Absorption, Distribution, Metabolism, and Excretion.' },
      { front: 'Define Pharmacodynamics.', back: 'How a drug affects the body: mechanism of action and receptor binding.' },
      { front: 'What does Toxicology specifically examine?', back: 'The harmful effects of drugs and the nature of toxicity.' },
      { front: 'What is Clinical Pharmacology?', back: 'Application of pharmacological principles to treatment of patients.' },
      { front: 'What is Pharmacoepidemiology?', back: 'Study of drug effects and usage at the population level.' },
      { front: 'What is Pharmacogenomics?', back: "Study of how genetic variation affects an individual's response to drugs." },
    ],
    'Historical Context': [
      { front: 'Which ancient civilization used willow bark for pain?', back: 'Ancient Egypt.' },
      { front: 'Who is known as founder of pharmacology and said the dose makes the poison?', back: 'Paracelsus.' },
      { front: 'What drug used for heart conditions comes from foxglove?', back: 'Digoxin.' },
      { front: 'What was the first major synthetic drug created in 1897?', back: 'Acetylsalicylic acid (Aspirin).' },
      { front: 'What drug was first active compound isolated from opium in early 19th century?', back: 'Morphine.' },
      { front: 'Who discovered antibacterial properties of penicillin in 1928?', back: 'Alexander Fleming.' },
      { front: 'Why was streptomycin discovery significant?', back: 'It was the first effective treatment against tuberculosis.' },
    ],
    'Modern Technology & Science': [
      { front: 'How did radioisotope labeling advance pharmacology?', back: 'It allowed scientists to trace exactly how drugs move through the body.' },
      { front: 'What is the benefit of computer modeling in drug development?', back: 'Virtual screening of millions of compounds and modeling receptor interactions.' },
      { front: 'What are Monoclonal Antibodies?', back: 'Highly specific drugs targeting particular proteins, often in cancer/autoimmune care.' },
      { front: 'What are Tyrosine Kinase Inhibitors?', back: 'Drugs that target specific cell signaling pathways.' },
      { front: 'What is the primary concern regarding the Antibiotic Era today?', back: 'Development of antibiotic resistance.' },
    ],
    'Nursing Responsibilities & The Eight Rights': [
      { front: 'Why is the nurse considered the final safeguard in medication administration?', back: 'They are the last point before drug reaches patient and can catch errors.' },
      { front: 'What are the two identifiers used for the Right Patient?', back: 'Typically name and date of birth (or medical record number).' },
      { front: 'What does Right Reason entail for a nurse?', back: "Confirming medication is appropriate for the patient's diagnosis." },
      { front: 'What is Right Response in the extended Eight Rights?', back: 'Monitoring whether the medication achieved desired effect.' },
      { front: 'What does Right Documentation require?', back: 'Recording administration immediately, accurately, and completely.' },
      { front: 'Beyond giving the pill, what is a key post-administration nursing responsibility?', back: 'Ongoing monitoring for adverse and therapeutic effects.' },
      { front: 'What should a nurse provide regarding Patient Education?', back: 'Explain purpose, instructions, and side effects to report.' },
      { front: 'How does kidney function affect the Right Dose?', back: 'Reduced kidney function may require lower dose to prevent toxicity.' },
    ],
    'Regulation & Safety History': [
      { front: 'What did the Pure Food and Drug Act of 1906 require?', back: 'Accurate labeling and prohibition of false claims.' },
      { front: 'What was required by the Food, Drug, and Cosmetic Act of 1938?', back: 'Drugs had to be proven safe before marketing.' },
      { front: 'What tragedy led to 1962 amendments requiring efficacy proof?', back: 'The thalidomide tragedy.' },
      { front: 'What is the modern requirement for drug approval today?', back: 'Drug must be proven both safe and effective.' },
    ],
    'Review & Reflection Concepts': [
      { front: 'What is an Apothecary?', back: 'Historical precursor to pharmacist who prepared drugs from plants and minerals.' },
      { front: 'How does age affect drug response in the elderly?', back: 'Decreased organ function increases toxicity risk.' },
      { front: 'What does Broad-Spectrum mean in antibiotics?', back: 'Effective against a wide variety of bacteria.' },
      { front: 'Why is study of Drug Interactions critical?', back: 'Multiple medications can cancel effects or cause toxic buildup.' },
      { front: 'What is the Right Time window for medication?', back: "Administration within facility-approved timeframe to maintain therapeutic levels." },
      { front: 'What is Selective toxicity in cancer treatment context?', back: 'Attempting to kill cancer cells while sparing healthy cells.' },
      { front: 'Define Bioavailability.', back: 'Proportion of a drug entering circulation and able to produce active effect.' },
      { front: 'What is the Right Patient verification process?', back: "Compare MAR/order with wristband and ask patient to state identity." },
      { front: 'Why is Monitoring considered a nursing duty?', back: 'To detect adverse effects early and verify therapeutic goals are met.' },
      { front: 'What is Pharmacology in Context?', back: 'Understanding drugs as tools within legal, social, and biological patient-care frameworks.' },
    ],
  };

  const flashcardTopics = Object.keys(curatedFlashcardsByTopic).sort();
  const sourceDeck = flashcardTopics.flatMap((topic) =>
    (curatedFlashcardsByTopic[topic] || []).map((card, idx) => ({
      sectionId: topic,
      sectionTitle: topic,
      front: card.front,
      back: card.back,
      idx,
    }))
  );

  const flashcardDeck = sourceDeck
    .filter((c) => flashFilter === 'all' || c.sectionId === flashFilter)
    .slice(0, 120);

  const paragraphImageSlots = sectionParagraphs.length > 0
    ? currentSectionImages.map((_, i) => Math.floor(((i + 1) * sectionParagraphs.length) / (currentSectionImages.length + 1)))
    : [];

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

  const renderReviewQuestionText = (text) => {
    const normalized = cleanBody(text)
      .replace(/\s+/g, ' ')
      .replace(/(\d+\.)\s*/g, '\n$1 ')
      .replace(/\s([a-d]\.)\s*/gi, '\n$1 ')
      .trim();

    const lines = normalized.split('\n').map((l) => l.trim()).filter(Boolean);

    return (
      <div style={{ display: 'grid', gap: '6px' }}>
        {lines.map((line, i) => {
          if (/^\d+\./.test(line)) {
            return <p key={i} style={{ fontWeight: 700, margin: 0 }}>{line}</p>;
          }
          if (/^[a-d]\./i.test(line)) {
            return <p key={i} style={{ margin: 0, paddingLeft: '18px' }}>{line}</p>;
          }
          return <p key={i} style={{ margin: 0 }}>{line}</p>;
        })}
      </div>
    );
  };

  const getSectionById = (id) => (chapterData.chapter.sections || []).find((s) => s.id === id);

  const openTool = (tool) => {
    if (tool === 'flashcards') {
      setToolView('flashcards');
      setFlashIndex(0);
      setFlashShowBack(false);
      return;
    }

    setToolView('content');
    const map = {
      quiz: 'sec1_11_review_questions',
      cases: 'sec1_10_clinical_story_allergy_decision',
      practice: 'sec1_8_dosage_calculations',
    };
    const target = getSectionById(map[tool]);
    if (target) {
      setSelectedSection(target);
      if (mainScrollRef.current) mainScrollRef.current.scrollTop = 0;
    }
  };

  const addAnnotation = () => {
    const text = (newNote || '').trim();
    if (!text) {
      window.alert('Type a note first.');
      return;
    }
    const priorityMap = { orange: 'High', yellow: 'Medium', green: 'Low' };
    const next = [{
      sectionId: selectedSection?.id,
      title: cleanHeading(selectedSection?.title || ''),
      text,
      color: highlightColor,
      priority: priorityMap[highlightColor] || 'Medium',
      ts: Date.now()
    }, ...annotations];
    setAnnotations(next);
    localStorage.setItem('unavida:annotations', JSON.stringify(next));
    setNewNote('');
  };

  const addBookmark = () => {
    if (!selectedSection?.id) return;
    const marker = window.prompt('Optional bookmark label (e.g., "ADME chart", "Exam note"):') || '';
    const exists = bookmarks.some((b) => (typeof b === 'string' ? b === selectedSection.id : b.sectionId === selectedSection.id && b.marker === marker));
    if (exists) {
      window.alert('Bookmark already exists for this section/label.');
      return;
    }
    const entry = { sectionId: selectedSection.id, title: cleanHeading(selectedSection.title || ''), marker: marker.trim(), ts: Date.now() };
    const next = [entry, ...bookmarks.filter((b) => typeof b !== 'string')];
    setBookmarks(next);
    localStorage.setItem('unavida:bookmarks', JSON.stringify(next));
  };

  const deleteAnnotation = (index) => {
    if (!window.confirm('Delete this note?')) return;
    const next = annotations.filter((_, i) => i !== index);
    setAnnotations(next);
    localStorage.setItem('unavida:annotations', JSON.stringify(next));
  };

  const editAnnotation = (index) => {
    const current = annotations[index];
    if (!current) return;
    const updated = window.prompt('Edit note:', current.text || '');
    if (updated === null) return;
    const next = [...annotations];
    next[index] = { ...next[index], text: updated.trim(), editedAt: Date.now() };
    setAnnotations(next);
    localStorage.setItem('unavida:annotations', JSON.stringify(next));
  };

  const deleteBookmark = (index) => {
    if (!window.confirm('Delete this bookmark placeholder?')) return;
    const next = bookmarks.filter((_, i) => i !== index);
    setBookmarks(next);
    localStorage.setItem('unavida:bookmarks', JSON.stringify(next));
  };

  const editBookmark = (index) => {
    const current = bookmarks[index];
    if (!current || typeof current === 'string') return;
    const updated = window.prompt('Edit bookmark label:', current.marker || '');
    if (updated === null) return;
    const next = [...bookmarks];
    next[index] = { ...next[index], marker: updated.trim(), editedAt: Date.now() };
    setBookmarks(next);
    localStorage.setItem('unavida:bookmarks', JSON.stringify(next));
  };

  const quickJump = (target) => {
    const map = {
      adme: 'sec1_6_pk_vs_pd',
      pd: 'sec1_6_pk_vs_pd',
      cp1: 'sec1_11_review_questions',
      cp2: 'sec1_11_review_questions',
    };
    const section = getSectionById(map[target]);
    if (section) {
      setToolView('content');
      setSelectedSection(section);
    }
  };

  const toggleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      window.alert('Read Aloud is not supported in this browser.');
      return;
    }
    if (readAloudOn) {
      window.speechSynthesis.cancel();
      setReadAloudOn(false);
      return;
    }

    const selectedText = (window.getSelection && window.getSelection().toString().trim()) || '';
    const choice = window.prompt('Read aloud options:\n1 = Selected text\n2 = Current section\n3 = Key takeaways only', selectedText ? '1' : '2');

    let text = '';
    if (choice === '1' && selectedText) {
      text = selectedText;
    } else if (choice === '3') {
      text = (selectedSection?.keyTakeaways || []).join('. ');
    } else {
      text = [selectedSection?.title || '', ...(sectionParagraphs || [])].join(' ');
    }

    if (!text.trim()) {
      window.alert('No readable text found for that option.');
      return;
    }

    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.onend = () => setReadAloudOn(false);
    utter.onerror = () => setReadAloudOn(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
    setReadAloudOn(true);
  };

  const buildPrintHtml = (sectionsToPrint) => {
    const sectionToHtml = (s) => {
      const paragraphs = (s.content || '').split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean);
      const images = sectionIllustrationMap[s.id] || [];
      const slots = paragraphs.length > 0 ? images.map((_, i) => Math.floor(((i + 1) * paragraphs.length) / (images.length + 1))) : [];

      const paras = paragraphs.map((p, idx) => {
        const { heading, body } = splitHeadingFromText(p);
        const forced = splitForcedSubhead(body || p);
        let html = '';
        if (forced) {
          html = `${forced.before ? `<p>${cleanBody(forced.before)}</p>` : ''}<h3>${cleanHeading(forced.heading)}</h3>${forced.after ? `<p>${cleanBody(forced.after)}</p>` : ''}`;
        } else if (heading) {
          html = `<h3>${cleanHeading(heading)}</h3><p>${cleanBody(body)}</p>`;
        } else {
          html = `<p>${cleanBody(p)}</p>`;
        }

        const slotIdx = slots.indexOf(idx);
        if (slotIdx >= 0 && images[slotIdx]) {
          html += `<img src="${images[slotIdx]}" style="max-width:100%;height:auto;margin:10px 0;"/>`;
        }
        return html;
      }).join('');

      return `<section style="page-break-inside:avoid;margin-bottom:28px;">\n<h2>${cleanHeading(s.title)}</h2>\n${paras}\n</section>`;
    };

    const blocks = sectionsToPrint.map(sectionToHtml).join('\n');

    return `<!doctype html><html><head><meta charset="utf-8"/><title>Study Sheet</title><style>body{font-family:Georgia,serif;color:#111;line-height:1.5;padding:24px}h1{margin:0 0 16px}h2{margin:20px 0 8px;font-size:24px;font-weight:700}h3{margin:14px 0 6px;font-size:18px;font-weight:700;color:#111}p{margin:0 0 10px;font-size:15px} @media print{body{padding:0 10mm}}</style></head><body><h1>Chapter 1 Study Sheet</h1>${blocks}</body></html>`;
  };

  const openPrintPicker = (actionType) => {
    setPrintAction(actionType);
    setPrintSelectedIds((selectedSection?.id ? [selectedSection.id] : []));
    setPrintPickerOpen(true);
  };

  const runPrintAction = (selected, actionType) => {    if (!selected.length) {
      window.alert(`No sections selected for ${actionType === 'print' ? 'print' : 'study sheet'}.`);
      return;
    }

    if (actionType === 'print') {
      const html = buildPrintHtml(selected);
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (!win) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `Chapter1_Print_${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.alert('Popup blocked. Downloaded printable HTML file instead.');
        return;
      }
      setTimeout(() => { try { win.focus(); } catch {} }, 250);
      return;
    }

    const summary = selected.map((s) => {
      const title = cleanHeading(s.title || '');
      const keyPoints = (s.keyTakeaways || []).slice(0, 3);
      const safety = (s.content || '').match(/(warning|safety|contraindication|allergy|adverse)/gi) ? 'Review safety alerts in this section.' : 'Standard medication safety checks apply.';
      return { title, keyPoints, safety };
    });

    const blocks = summary.map((s) => `
      <section style="margin-bottom:18px;">
        <h2 style="margin:0 0 6px;font-size:20px;">${s.title}</h2>
        <p style="margin:0 0 6px;"><strong>Mechanism/Concept Focus:</strong> Core pharmacology principles and nursing application.</p>
        <p style="margin:0 0 6px;"><strong>Safety Alert:</strong> ${s.safety}</p>
        <p style="margin:0 0 6px;"><strong>Clinical Nursing Considerations:</strong> Verify rights, assess patient status, monitor response, and educate patient.</p>
        <ul style="margin:4px 0 0 18px;">
          ${s.keyPoints.map((k) => `<li>${k}</li>`).join('')}
        </ul>
      </section>
    `).join('');

    const html = `<!doctype html><html><head><meta charset="utf-8"/><title>Chapter 1 Study Sheet</title><style>body{font-family:Arial,sans-serif;color:#111;padding:22px;line-height:1.5}h1{margin:0 0 10px;font-size:28px}h2{font-weight:700}</style></head><body><h1>Chapter 1 Study Sheet</h1><p style="margin:0 0 14px;color:#444;">Structured summary of key pharmacology concepts, safety alerts, dosage reminders, and clinical nursing considerations for rapid review.</p>${blocks}</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    if (!win) {
      const a = document.createElement('a');
      a.href = url;
      a.download = `Chapter1_StudySheet_${Date.now()}.html`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    }
    setTimeout(() => { try { win.focus(); } catch {} }, 250);
  };

  const printReader = () => {
    const all = chapterData.chapter.sections || [];
    if (window.confirm('Print current section only?')) {
      runPrintAction(selectedSection ? [selectedSection] : [], 'print');
      return;
    }
    if (window.confirm('Print all sections?')) {
      runPrintAction(all, 'print');
      return;
    }
    openPrintPicker('print');
  };

  const exportStudySheet = () => {
    const all = chapterData.chapter.sections || [];
    if (window.confirm('Create study sheet for current section only?')) {
      runPrintAction(selectedSection ? [selectedSection] : [], 'study');
      return;
    }
    if (window.confirm('Create study sheet for all sections?')) {
      runPrintAction(all, 'study');
      return;
    }
    openPrintPicker('study');
  };

  const existingReviewQuestions = (selectedSection?.contentBlocks || [])
    .flatMap((b) => b.questions || [])
    .map((q, idx) => ({ ...q, questionNumber: q.questionNumber || idx + 1 }));

  const generatedReviewQuestions = sourceDeck
    .slice(0, Math.max(0, 50 - existingReviewQuestions.length))
    .map((c, i) => ({
      questionNumber: existingReviewQuestions.length + i + 1,
      question: c.front,
      options: {
        A: c.back,
        B: 'This is unrelated to the chapter objective.',
        C: 'This reflects a contraindicated clinical action.',
        D: 'This is not supported by the chapter content.'
      },
      correctAnswer: 'A',
      rationale: c.back,
    }));

  const reviewQuestionBank = [...existingReviewQuestions, ...generatedReviewQuestions].slice(0, 50);

  const renderStructuredQuestion = (q) => {
    const key = `q-${q.questionNumber}`;
    const show = !!revealedAnswers[key];
    return (
      <div key={key} className="reader-card" style={{ marginBottom: '12px' }}>
        <p style={{ fontWeight: 700, marginBottom: '8px' }}>{q.questionNumber}. {q.question}</p>

        {q.options && (
          <div style={{ display: 'grid', gap: '4px', marginBottom: '10px' }}>
            {Object.entries(q.options).map(([letter, text]) => (
              <p key={letter} style={{ margin: 0, paddingLeft: '14px' }}>
                {letter.toLowerCase()}. {text}
              </p>
            ))}
          </div>
        )}

        <button
          className="reader-btn"
          onClick={() => setRevealedAnswers((prev) => ({ ...prev, [key]: !show }))}
          style={{ marginBottom: '8px' }}
        >
          {show ? 'Hide Answer' : 'Show Answer'}
        </button>

        {show && (
          <div style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '10px' }}>
            {q.correctAnswer && <p style={{ margin: '0 0 6px 0', fontWeight: 700 }}>Correct answer: {q.correctAnswer.toLowerCase()}</p>}
            {q.rationale && <p style={{ margin: 0 }}><strong>Rationale:</strong> {q.rationale}</p>}
            {q.expectedAnswerElements && (
              <ul style={{ margin: '6px 0 0 0', paddingLeft: '20px' }}>
                {q.expectedAnswerElements.map((el, i) => <li key={i}>{el}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  };

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('unavidaTheme') || 'light';
    setTheme(savedTheme);
  }, []);

  // Mobile default: keep TOC closed initially
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
      setHideToc(true);
    }
  }, []);

  // Set default section on mount (restore last viewed section if available)
  useEffect(() => {
    const sections = chapterData.chapter.sections || [];
    if (!sections.length) return;

    const savedId = localStorage.getItem('unavida:lastReaderSection:ch1_intro');
    const saved = sections.find((s) => s.id === savedId);
    setSelectedSection(saved || sections[0]);
  }, []);

  // Persist currently viewed section
  useEffect(() => {
    if (selectedSection?.id) {
      localStorage.setItem('unavida:lastReaderSection:ch1_intro', selectedSection.id);
    }
  }, [selectedSection?.id]);

  // Always jump to top when section changes
  useEffect(() => {
    if (mainScrollRef.current) {
      mainScrollRef.current.scrollTop = 0;
    }
  }, [selectedSection?.id]);

  useEffect(() => {
    setFlashIndex(0);
    setFlashShowBack(false);
  }, [flashFilter]);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
    setToolView('content');
    setRevealedAnswers({});
    if (typeof window !== 'undefined' && (window.innerWidth <= 1024 || focusReader)) {
      setHideToc(true);
    }
  };

  const toggleTheme = () => {
    const preferredDark = localStorage.getItem('unavidaThemeLastDark') || 'darkplus';
    const newTheme = theme === 'light' ? preferredDark : 'light';
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
          position: relative;
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

        .reader-layout.focus-reader {
          grid-template-columns: minmax(0, 980px);
          justify-content: flex-start;
          padding-left: 0;
          padding-right: 0;
          gap: 0;
        }

        .reader-layout.focus-reader .reader-right {
          display: none !important;
          width: 0 !important;
          min-width: 0 !important;
          max-width: 0 !important;
          padding: 0 !important;
          border: 0 !important;
          overflow: hidden !important;
        }

        .reader-layout.focus-reader .reader-main {
          margin-left: 50px;
          width: 100%;
          max-width: 930px;
          margin-right: 0;
        }

        .reader-layout.focus-reader .reader-main-wrap {
          margin-right: 0;
        }

        .reader-layout.focus-reader .reader-toc {
          position: fixed;
          left: 10px;
          top: 142px;
          bottom: 10px;
          width: min(90vw, 360px);
          z-index: 60;
          box-shadow: 0 12px 32px rgba(0,0,0,0.28);
        }

        .reader-layout.hide-toc {
          grid-template-columns: 1fr 320px;
        }

        .reader-layout.hide-toc .reader-toc {
          display: none;
        }

        .reader-layout.hide-toc .reader-main-wrap {
          max-width: 1220px;
        }

        .reader-layout.focus-reader .reader-main-wrap {
          max-width: none;
          width: 100%;
        }

        .reader-layout.focus-reader .reader-main {
          width: 100%;
        }

        .reader-panel {
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 12px;
          padding: 12px;
          overflow-y: auto;
        }

        .reader-toc { flex: 0 0 320px; }
        .reader-main { flex: 1; min-width: 0; margin-left: 35px; }
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
          width: min(620px, 90vw);
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

        .reader-menu {
          position: absolute;
          right: 0;
          top: 44px;
          min-width: 220px;
          background: var(--panel);
          border: 1px solid var(--panel-border);
          border-radius: 10px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.16);
          padding: 8px;
          display: grid;
          gap: 6px;
          z-index: 70;
        }

        .reader-menu .reader-btn { width: 100%; text-align: left; }

        @media (max-width: 1024px) {
          .reader-top {
            padding: 10px 12px;
            gap: 10px;
          }

          .reader-tools {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .reader-btn {
            min-height: 40px;
            font-size: 14px;
          }

          .reader-layout {
            grid-template-columns: 1fr;
            padding: 8px;
            gap: 8px;
          }

          .reader-main {
            min-height: calc(100vh - 150px);
          }

          .reader-right {
            display: none;
          }

          .reader-toc {
            position: fixed;
            left: 8px;
            top: 142px;
            bottom: 8px;
            width: min(90vw, 360px);
            z-index: 50;
            box-shadow: 0 12px 32px rgba(0,0,0,0.28);
          }

          .reader-main-wrap h1 {
            font-size: 1.45rem;
          }

          .reader-main-wrap p,
          .reader-main-wrap li {
            font-size: 0.98rem;
          }

          .reader-float-btn {
            top: 100px;
            left: 12px;
            width: 34px;
            height: 34px;
          }
        }

        @media (max-width: 640px) {
          .reader-tools {
            grid-template-columns: 1fr;
          }

          .reader-main-wrap {
            max-width: 100%;
          }

          .reader-card {
            padding: 12px;
            border-radius: 10px;
          }

          .reader-pills {
            gap: 6px;
          }

          .reader-pill {
            font-size: 10px;
          }
        }
      `}</style>

      {/* Top Bar */}
      <div className="reader-top">
        <div>
          <div className="reader-crumb">Home / Pharmacology I / Reader</div>
          <div className="reader-header">Mastering Pharmacology</div>
        </div>
        <div className="reader-tools">
          <button className="reader-btn" onClick={() => setTopMenuOpen((v) => !v)}>☰ Reader Menu</button>
          <a href="/bookshelf" className="reader-btn">Back to Chapter List</a>

          {topMenuOpen && (
            <div className="reader-menu">
              <button className="reader-btn" onClick={() => { toggleTheme(); setTopMenuOpen(false); }}>{theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}</button>
              <button className="reader-btn" onClick={() => { const next = !focusReader; setFocusReader(next); if (next) setHideToc(true); else setHideToc(false); setTopMenuOpen(false); }}>{focusReader ? '↔ Restore Layout' : '↔ Expand Reader'}</button>
              <button className="reader-btn" onClick={() => { setPrefsModalOpen(true); setTopMenuOpen(false); }}>⚙️ Reader Preferences</button>
              <button className="reader-btn" onClick={() => { toggleReadAloud(); setTopMenuOpen(false); }}>{readAloudOn ? '⏸ Stop Read Aloud' : '🔊 Read Aloud'}</button>
              <button className="reader-btn" onClick={() => { printReader(); setTopMenuOpen(false); }}>🖨 Print Section</button>
            </div>
          )}
        </div>
      </div>

      {/* TOC Float Button */}
      <button
        className="reader-float-btn"
        onClick={() => setHideToc(!hideToc)}
      >
        {hideToc ? '▶' : '◀'}
      </button>

      {/* Main Layout */}
      <div className={`reader-layout ${focusReader ? 'focus-reader' : ''} ${hideToc ? 'hide-toc' : ''}`}>
        {/* Left Panel - TOC */}
        <aside className={`reader-panel reader-toc ${hideToc ? 'reader-hidden' : ''}`}>
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
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}> ({getSectionWordCount(section)} words)</span>
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
                {toolView === 'flashcards' && (
                  <section className="reader-card" style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                      <h3 style={{ marginBottom: 0 }}>Flashcards</h3>
                      <button className="reader-btn" onClick={() => setToolView('content')}>← Back to Reader</button>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '8px' }}>
                      <p style={{ margin: 0 }}>Chapter 1 deck ({flashcardDeck.length} cards).</p>
                      <label style={{ fontSize: '12px', color: 'var(--muted)' }}>Topic:</label>
                      <select value={flashFilter} onChange={(e) => setFlashFilter(e.target.value)} style={{ border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '4px 8px', background: 'var(--panel)', color: 'var(--text)' }}>
                        <option value="all">All topics</option>
                        {flashcardTopics.map((topic) => (
                          <option key={topic} value={topic}>{topic}</option>
                        ))}
                      </select>
                    </div>
                    {flashcardDeck.length === 0 ? (
                      <p>No flashcards available yet.</p>
                    ) : (
                      <>
                        <div
                          onClick={() => setFlashShowBack((v) => !v)}
                          style={{
                            border: '1px solid var(--panel-border)',
                            borderRadius: '12px',
                            padding: '18px',
                            background: 'var(--panel)',
                            minHeight: '170px',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '8px' }}>
                            Card {flashIndex + 1} of {flashcardDeck.length} • tap card to flip
                          </div>
                          {!flashShowBack ? (
                            <div>
                              <div style={{ fontWeight: 700, marginBottom: '8px' }}>Question</div>
                              <div>{flashcardDeck[flashIndex].front || flashcardDeck[flashIndex].question || `Flashcard ${flashIndex + 1}`}</div>
                            </div>
                          ) : (
                            <div>
                              <div style={{ fontWeight: 700, marginBottom: '8px' }}>Answer</div>
                              <div>{flashcardDeck[flashIndex].back || flashcardDeck[flashIndex].answer || ''}</div>
                            </div>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                          <button
                            className="reader-btn"
                            onClick={() => {
                              setFlashIndex((i) => Math.max(0, i - 1));
                              setFlashShowBack(false);
                            }}
                            disabled={flashIndex === 0}
                          >
                            ← Prev
                          </button>
                          <button className="reader-btn" onClick={() => setFlashShowBack((v) => !v)}>
                            {flashShowBack ? 'Show Question' : 'Show Answer'}
                          </button>
                          <button
                            className="reader-btn"
                            onClick={() => {
                              setFlashIndex((i) => Math.min(flashcardDeck.length - 1, i + 1));
                              setFlashShowBack(false);
                            }}
                            disabled={flashIndex === flashcardDeck.length - 1}
                          >
                            Next →
                          </button>
                        </div>
                      </>
                    )}
                  </section>
                )}

                {toolView !== 'flashcards' && (
                  <>
                <div className="reader-section-label">Chapter Reader</div>
                <h1>{sectionTitle || selectedSection.title}</h1>
                <div className="reader-meta reader-subtle">
                  {selectedSection.duration} min • {currentWordCount} words
                </div>
                <div className="reader-pills">
                  {selectedSection.duration && <span className="reader-pill">⏱️ ~{selectedSection.duration} min reading</span>}
                  {currentVideoUrl && <span className="reader-pill">📺 1 video</span>}
                  <span className="reader-pill">🎴 60 flashcards available</span>
                  <span className="reader-pill">✅ Progress autosaved</span>
                </div>

                <div className="reader-alert-bar">
                  <strong>Exam Alert:</strong> Instructor-highlighted topic — High-yield content for next assessment.
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
                    ) : selectedSection.id === 'sec1_9_key_terms_glossary' && glossaryEntries.length > 0 ? (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'left', borderBottom: '2px solid var(--panel-border)', padding: '8px', width: '32%' }}>Term</th>
                              <th style={{ textAlign: 'left', borderBottom: '2px solid var(--panel-border)', padding: '8px' }}>Explanation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {glossaryEntries.map((g, idx) => (
                              <tr key={idx}>
                                <td style={{ verticalAlign: 'top', borderBottom: '1px solid var(--panel-border)', padding: '8px', fontWeight: 800 }}>{g.term}</td>
                                <td style={{ verticalAlign: 'top', borderBottom: '1px solid var(--panel-border)', padding: '8px' }}>{g.definition}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      sectionParagraphs.map((para, idx) => {
                        const { heading, body } = splitHeadingFromText(para);
                        const forced = splitForcedSubhead(body || para);
                        const slotIdx = paragraphImageSlots.indexOf(idx);
                        const imgSrc = slotIdx >= 0 ? currentSectionImages[slotIdx] : null;
                        return (
                          <div key={idx} style={{ marginBottom: '18px' }}>
                            {heading && <h4 style={{ margin: '0 0 8px 0', fontSize: '1.08rem' }}>{heading}</h4>}
                            {selectedSection.id === 'sec1_11_review_questions' ? (
                              renderReviewQuestionText(body || para)
                            ) : forced ? (
                              <>
                                {forced.before && <p>{forced.before}</p>}
                                <h4 style={{ margin: '8px 0', fontSize: '1.1rem' }}>{forced.heading}</h4>
                                {forced.after && <p>{forced.after}</p>}
                              </>
                            ) : (
                              <p>{body}</p>
                            )}
                            {imgSrc && (
                              <img
                                src={imgSrc}
                                alt={`Section visual ${slotIdx + 1}`}
                                style={{ width: '100%', marginTop: '10px', maxHeight: '420px', objectFit: 'contain', background: 'var(--panel)', borderRadius: '10px' }}
                                loading="lazy"
                              />
                            )}
                          </div>
                        );
                      })
                    )}
                  </section>
                )}

                {selectedSection.id === 'sec1_11_review_questions' ? (
                  <section className="reader-card">
                    {reviewQuestionBank.map((q) => renderStructuredQuestion(q))}
                  </section>
                ) : selectedSection.contentBlocks && selectedSection.contentBlocks.length > 0 && (
                  <section className="reader-card">
                    <h3>Detailed Reading</h3>
                    {selectedSection.contentBlocks.map((block, idx) => (
                      <div key={idx} style={{ marginBottom: '16px' }}>
                        {block.title && <h4 style={{ margin: '0 0 6px 0', fontSize: '1.06rem' }}>{cleanHeading(block.title)}</h4>}
                        {block.htmlReady ? (
                          <div dangerouslySetInnerHTML={{ __html: block.htmlReady }} />
                        ) : block.content ? (
                          <p>{block.content}</p>
                        ) : null}
                      </div>
                    ))}
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
                )}
              </>
            ) : (
              <p>Loading content...</p>
            )}
          </div>
        </main>

        {/* Right Panel - Study Tools */}
        <aside className={`reader-panel reader-right ${focusReader ? 'reader-hidden' : ''}`} style={focusReader ? { display: 'none', width: 0, minWidth: 0, maxWidth: 0, padding: 0, border: 0, overflow: 'hidden' } : undefined}>
          <div className="reader-accordion open">
            <button className="reader-acc-btn" onClick={(e) => e.currentTarget.closest('.reader-accordion').classList.toggle('open')}>
              Study Tools
              <span>▼</span>
            </button>
            <div className="reader-acc-body">
              <div className="reader-tool-grid">
                <button className="reader-tool-item" onClick={() => openTool('flashcards')}>🎴 Flashcards</button>
                <button className="reader-tool-item" onClick={() => openTool('quiz')}>❓ Quiz</button>
                <button className="reader-tool-item" onClick={() => openTool('cases')}>🤷 Case Studies</button>
                <button className="reader-tool-item" onClick={() => setQuickJumpOpen((v) => !v)}>⚡ Quick Jump</button>
              </div>
              {quickJumpOpen && (
                <div style={{ marginTop: '10px', display: 'grid', gap: '8px' }}>
                  <button className="reader-btn" onClick={() => quickJump('adme')}>ADME Core Map</button>
                  <button className="reader-btn" onClick={() => quickJump('pd')}>PD Receptor Effects</button>
                  <button className="reader-btn" onClick={() => quickJump('cp1')}>Checkpoint #1</button>
                  <button className="reader-btn" onClick={() => quickJump('cp2')}>Checkpoint #2</button>
                </div>
              )}
            </div>
          </div>

          <div className="reader-accordion">
            <button className="reader-acc-btn" onClick={(e) => e.currentTarget.closest('.reader-accordion').classList.toggle('open')}>
              Workbook
              <span>▶</span>
            </button>
            <div className="reader-acc-body">
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'nowrap' }}>
                <div style={{ padding: '4px 7px', border: '1px solid var(--panel-border)', borderRadius: '8px', background: 'var(--panel)', fontSize: '10px', whiteSpace: 'nowrap' }}>🔖 Bookmarks ({bookmarks.length})</div>
                <div style={{ padding: '4px 7px', border: '1px solid var(--panel-border)', borderRadius: '8px', background: 'var(--panel)', fontSize: '10px', whiteSpace: 'nowrap' }}>🔍️ Highlights ({Math.max(annotations.length, 1)})</div>
              </div>
              <div style={{ display: 'grid', gap: '8px' }}>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Write a note for this section..."
                  style={{ minHeight: '78px', borderRadius: '8px', border: '1px solid var(--panel-border)', background: 'var(--panel)', color: 'var(--text)', padding: '8px' }}
                />
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'nowrap', overflowX: 'auto' }}>
                  <span style={{ fontSize: '10px', color: 'var(--muted)', whiteSpace: 'nowrap' }}>Priority:</span>
                  <button className="reader-btn" onClick={() => setHighlightColor('orange')} style={{ padding: '3px 6px', fontSize: '11px', ...(highlightColor === 'orange' ? { background: '#f97316', color: '#111' } : {}) }}>🟧 High</button>
                  <button className="reader-btn" onClick={() => setHighlightColor('yellow')} style={{ padding: '3px 6px', fontSize: '11px', ...(highlightColor === 'yellow' ? { background: '#facc15', color: '#111' } : {}) }}>🟨 Medium</button>
                  <button className="reader-btn" onClick={() => setHighlightColor('green')} style={{ padding: '3px 6px', fontSize: '11px', ...(highlightColor === 'green' ? { background: '#22c55e', color: '#111' } : {}) }}>🟩 Low</button>
                </div>
                <button className="reader-btn" onClick={addAnnotation}>+ Save Highlight</button>
                <button className="reader-btn" onClick={addBookmark}>+ Add Bookmark Placeholder</button>
              </div>
              {(annotations.length > 0 || bookmarks.length > 0) && (
                <div style={{ marginTop: '10px', display: 'grid', gap: '8px' }}>
                  {annotations.slice(0, 4).map((a, i) => (
                    <div key={`a-${i}`} style={{ padding: '8px', border: '1px solid var(--panel-border)', borderRadius: '8px', background: 'var(--panel)', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px', alignItems: 'center' }}>
                        <div>
                          <strong>{a.title || 'Section Note'}</strong>
                          <div style={{ marginTop: '3px', fontSize: '11px' }}>
                            <span style={{ padding: '1px 6px', borderRadius: '999px', background: a.color === 'orange' ? '#fed7aa' : a.color === 'green' ? '#bbf7d0' : '#fef08a', color: '#111' }}>
                              {a.color === 'orange' ? '🟧 High' : a.color === 'green' ? '🟩 Low' : '🟨 Medium'}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button className="reader-btn" style={{ padding: '2px 6px', fontSize: '11px' }} onClick={() => editAnnotation(i)}>Edit</button>
                          <button className="reader-btn" style={{ padding: '2px 6px', fontSize: '11px' }} onClick={() => deleteAnnotation(i)}>Delete</button>
                        </div>
                      </div>
                      <div style={{ marginTop: '4px' }}>{a.text}</div>
                    </div>
                  ))}
                  {bookmarks.slice(0, 4).map((b, i) => {
                    const section = typeof b === 'string' ? getSectionById(b) : getSectionById(b.sectionId);
                    const label = typeof b === 'string' ? '' : (b.marker || '');
                    return (
                      <div key={`b-${i}`} style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="reader-btn"
                          onClick={() => section && setSelectedSection(section)}
                          style={{ textAlign: 'left', flex: 1 }}
                        >
                          🔖 {cleanHeading(section?.title || 'Bookmarked Section')} {label ? `— ${label}` : ''}
                        </button>
                        {typeof b !== 'string' && <button className="reader-btn" style={{ padding: '2px 6px', fontSize: '11px' }} onClick={() => editBookmark(i)}>Edit</button>}
                        <button className="reader-btn" style={{ padding: '2px 6px', fontSize: '11px' }} onClick={() => deleteBookmark(i)}>Delete</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="reader-atlas">
            <strong>Atlas says:</strong> "{atlasLine}"
          </div>
        </aside>
      </div>

      {/* Print/Study Section Picker Modal */}
      <div className={`reader-modal ${printPickerOpen ? 'show' : ''}`} onClick={() => printPickerOpen && setPrintPickerOpen(false)}>
        <div className="reader-modal-card" onClick={(e) => e.stopPropagation()}>
          <div className="reader-modal-head">
            {printAction === 'print' ? 'Print Section Selection' : 'Study Sheet Section Selection'}
            <button className="reader-btn" onClick={() => setPrintPickerOpen(false)}>✕</button>
          </div>
          <div className="reader-modal-body" style={{ display: 'grid', gap: '8px', maxHeight: '52vh', overflowY: 'auto' }}>
            {(chapterData.chapter.sections || []).map((s) => {
              const checked = printSelectedIds.includes(s.id);
              return (
                <label key={s.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      setPrintSelectedIds((prev) => e.target.checked ? [...prev, s.id] : prev.filter((id) => id !== s.id));
                    }}
                  />
                  <span>{cleanHeading(s.title)}</span>
                </label>
              );
            })}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button className="reader-btn" onClick={() => setPrintSelectedIds((chapterData.chapter.sections || []).map((s) => s.id))}>Select All</button>
              <button className="reader-btn" onClick={() => setPrintSelectedIds([])}>Clear</button>
              <button
                className="reader-btn"
                onClick={() => {
                  const selected = (chapterData.chapter.sections || []).filter((s) => printSelectedIds.includes(s.id));
                  setPrintPickerOpen(false);
                  runPrintAction(selected, printAction);
                }}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
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
                      if (m !== 'light') localStorage.setItem('unavidaThemeLastDark', m);
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
