import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import chapter1Data from '../data/CHAPTER_1_UNAVIDA_PRODUCTION.json';
import chapter2Data from '../data/CHAPTER_2_UNAVIDA_PRODUCTION.json';
import chapter3Data from '../data/CHAPTER_3_UNAVIDA_PRODUCTION.json';
import chapter5Data from '../data/CHAPTER_5_UNAVIDA_PRODUCTION.json';
import chapter9Data from '../data/CHAPTER_9_UNAVIDA_PRODUCTION.json';
import chapter2SeedSections from '../content/reader/chapter2SeedSections';
import './ChapterReader.css';

export const ChapterReader = () => {
  const location = useLocation();
  const navigate = useNavigate();
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
  const [selectedMcAnswers, setSelectedMcAnswers] = useState({});
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

  // Image lightbox (click any diagram/image in the reader to expand)
  const [lightbox, setLightbox] = useState({ open: false, src: '', alt: '' });

  const openLightbox = (src, alt = '') => {
    if (!src) return;
    setLightbox({ open: true, src, alt });
  };

  const closeLightbox = () => setLightbox({ open: false, src: '', alt: '' });

  // Hard-fail safe: capture clicks/taps on ANY <img> inside the main reader panel
  // using native event listeners (some environments swallow React onClick for images).
  useEffect(() => {
    const el = mainScrollRef.current;
    if (!el) return;

    const handler = (e) => {
      const target = e.target;
      const img = target?.closest ? target.closest('img') : null;
      if (!img) return;

      // Prevent the same gesture from immediately closing the modal
      // (some browsers deliver the original click to the newly-mounted overlay).
      try {
        e.preventDefault?.();
        e.stopPropagation?.();
        e.stopImmediatePropagation?.();
      } catch {}

      const src = img.getAttribute('src') || img.src;
      const alt = img.getAttribute('alt') || '';

      // Defer open to next tick to avoid same-event close
      setTimeout(() => openLightbox(src, alt), 0);
    };

    // Use pointer/touch events for best cross-device reliability.
    el.addEventListener('pointerup', handler, true);
    el.addEventListener('touchend', handler, true);

    return () => {
      el.removeEventListener('pointerup', handler, true);
      el.removeEventListener('touchend', handler, true);
    };
  }, []);

  const handleInlineImageClick = (e) => {
    const t = e.target;
    if (!t) return;
    if (t.tagName === 'IMG') {
      // For <img src="/path">, the DOM exposes both .src (absolute) and getAttribute('src') (original)
      const src = t.getAttribute('src') || t.src;
      const alt = t.getAttribute('alt') || '';
      openLightbox(src, alt);
    }
  };

  // Mobile Safari can be finicky with click events on images inside scroll containers.
  // Pointer/touch events improve reliability.
  const handleInlineImagePointerUp = (e) => handleInlineImageClick(e);


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
    // Chapter 1
    sec1_overview_introduction: 'https://unavida-videos.s3.us-east-2.amazonaws.com/Pharmacology_+Chapter+1+Introduction_1080p_caption.mp4',
    sec1_1_definitions_scope: 'https://unavida-videos.s3.us-east-2.amazonaws.com/07_definition_and_scope.mp4',
    sec1_3_drug_classification: 'https://unavida-videos.s3.us-east-2.amazonaws.com/06_drug_classification_systems.mp4',
    sec1_4_regulatory_bodies_fda: 'https://unavida-videos.s3.us-east-2.amazonaws.com/02_fda_approval_process.mp4',
    sec1_6_pk_vs_pd: 'https://unavida-videos.s3.us-east-2.amazonaws.com/4982BE2B-4807-F9DC-41B2-6CCF565CF232.mp4',
    sec1_7_drug_interactions: 'https://unavida-videos.s3.us-east-2.amazonaws.com/03_drug_interactions_and_safety.mp4',
    sec1_8_dosage_calculations: 'https://unavida-videos.s3.us-east-2.amazonaws.com/04_dosage_calculations.mp4',
    sec1_10_clinical_story_allergy_decision: 'https://unavida-videos.s3.us-east-2.amazonaws.com/05_clinical_story_allergy_decision.mp4',

    // Chapter 2
    sec2_1_pk_overview: 'https://unavida-videos.s3.us-east-2.amazonaws.com/2.1+Pharmacokinetics+--+The+Body%27s+Interaction+with+Drugs.mp4',
    sec2_2_absorption: 'https://unavida-videos.s3.us-east-2.amazonaws.com/2.2+ABSORPTION+%E2%80%94+GETTING+THE+DRUG+INTO+THE+BODY.mp4',
    sec2_3_distribution: 'https://unavida-videos.s3.us-east-2.amazonaws.com/2.3+DISTRIBUTION+%E2%80%94+WHERE+THE+DRUG+GOES+IN+THE+BODY.mp4',
    sec2_4_metabolism: 'https://unavida-videos.s3.us-east-2.amazonaws.com/2.4+METABOLISM+%E2%80%94+HOW+THE+BODY+BREAKS+DOWN+DRUGS.mp4',
    sec2_5_excretion: 'https://unavida-videos.s3.us-east-2.amazonaws.com/2.5+EXCRETION+%E2%80%94+HOW+THE+BODY+ELIMINATES+DRUGS.mp4',
    sec2_6_half_life_clearance: 'https://unavida-videos.s3.us-east-2.amazonaws.com/2.6+HALF-LIFE%2C+CLEARANCE%2C+AND+STEADY+STATE.mp4',

    // Chapter 3
    ch3_1_adverse_effects: 'https://unavida-videos.s3.us-east-2.amazonaws.com/ch03_s01_v01_%20Toxicity%20Basics.mp4',
    ch3_2_organ_damage: 'https://unavida-videos.s3.us-east-2.amazonaws.com/ch03_s02_v01_%20How%20Drugs%20Cause%20Injury.mp4',
    ch3_3_toxicity_overdose: 'https://unavida-videos.s3.us-east-2.amazonaws.com/ch03_s03_v01_Therapeutic_Window.mp4',
    ch3_4_glucose: 'https://unavida-videos.s3.us-east-2.amazonaws.com/ch03_s04_v01_Glucose%20Management.mp4',
    ch3_5_electrolytes: 'https://unavida-videos.s3.us-east-2.amazonaws.com/ch03_s05_v01_Electrolytes%20%26%20Fluid%20Regulation.mp4',
    ch3_6_neuro_sensory: 'https://unavida-videos.s3.us-east-2.amazonaws.com/ch03_s06_v01_CNS%20%26%20Sensory%20Toxicity.mp4',
    ch3_7_teratogenicity: 'https://unavida-videos.s3.us-east-2.amazonaws.com/ch03_s07_v01_Teratogenicity.mp4',

    // Chapter 5
    ch5_1_foundations: 'https://unavida-videos.s3.us-east-2.amazonaws.com/ch05_s01_v01_The%20Dose%20Detective.mp4',
    ch5_3_ratio_proportion: 'https://unavida-videos.s3.us-east-2.amazonaws.com/ch05_s02_v01_ratio-proportion-dimensional-analysis1.mp4',
    ch5_8_iv_flow_rates: 'https://unavida-videos.s3.us-east-2.amazonaws.com/ch05_s03_v01_iv-rate-drip-calculations%20.mp4',
    ch5_10_safety: 'https://unavida-videos.s3.us-east-2.amazonaws.com/ch05_s04_v01_Units%20Don%E2%80%99t%20Lie.mp4',
  };

  const currentVideoUrl = selectedSection ? sectionVideoMap[selectedSection.id] : null;

  const sectionIllustrationMap = {
    // Chapter 1
    sec1_overview_introduction: [
      '/images/ch1/section-1-0/ch1_s1_0_v01.png',
      '/images/ch1/section-1-0/Pharmacology Overview.png',
      '/images/ch1/section-1-0/Key Principles.png',
      '/images/ch1/section-1-0/Eight Rights Med.png',
      '/images/ch1/section-1-0/Drug Calcutation.png',
      '/images/ch1/section-1-0/Pharmacokinetics vs. Pharmacodynamics.png',
    ],

    // Chapter 2
    sec2_1_pk_overview: [
      '/images/ch2/section-2-1/ch2_s2_1_adme_overview.jpg',
      '/images/ch2/section-2-1/ch2_s2_1_therapeutic_window.jpg',
    ],
    sec2_2_absorption: [
      '/images/ch2/section-2-2/ch2_s2_2_routes_bioavailability.jpg',
      '/images/ch2/section-2-2/ch2_s2_2_first_pass_vs_iv.jpg',
    ],
    sec2_3_distribution: [
      '/images/ch2/section-2-3/ch2_s2_3_blood_brain_barrier.jpg',
      '/images/ch2/section-2-3/ch2_s2_3_vd_protein_binding_vs_lipophilic.jpg',
    ],
    sec2_4_metabolism: [
      '/images/ch2/section-2-4/ch2_s2_4_drug_metabolism_phases.jpg',
      '/images/ch2/section-2-4/ch2_s2_4_cyp_induction_inhibition.jpg',
    ],
    sec2_5_excretion: [
      '/images/ch2/section-2-5/ch2_s2_5_renal_excretion_processes.jpg',
      '/images/ch2/section-2-5/ch2_s2_5_dose_adjustment_nomogram.jpg',
    ],
    sec2_6_half_life_clearance: [
      '/images/ch2/section-2-6/ch2_s2_6_loading_dose_maintenance.jpg',
      '/images/ch2/section-2-6/ch2_s2_6_half_life_accumulation.jpg',
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


  const { chapterId } = useParams();
  const activeChapterId = chapterId || 'ch1_intro';

  const chapter1Sections = [...(chapter1Data.chapter.sections || [])];

  // Chapter 2 is now sourced from a dedicated JSON file, with 2.7–2.8 placeholders
  // filled from the seed module until full content is provided.
  const chapter2SectionsBase = [...(chapter2Data.chapter.sections || [])];
  const chapter2SectionsMerged = [
    ...chapter2SectionsBase,
    ...chapter2SeedSections.filter((s) => !chapter2SectionsBase.some((b) => b.id === s.id)),
  ];

  const chapter3Sections = [...(chapter3Data.chapter.sections || [])];
  const chapter5Sections = [...(chapter5Data.chapter.sections || [])];
  const chapter9Sections = [...(chapter9Data.chapter.sections || [])];

  const getSectionSortKey = (section) => {
    if (!section) return 999;
    if (section.id === 'references' || section.id === 'ch2_references') return 999;

    const raw = section.sectionNumber;
    if (raw === null || raw === undefined || raw === '') return 998;

    const n = Number(raw);
    if (!Number.isNaN(n)) return n;

    const str = String(raw);
    const parsed = Number.parseFloat(str);
    if (!Number.isNaN(parsed)) return parsed;

    return 998;
  };

  // Ensure Chapter 2 navigation/content is ordered (2.1..2.10, then References at the bottom)
  const chapter2Sections = [...chapter2SectionsMerged].sort((a, b) => getSectionSortKey(a) - getSectionSortKey(b));

  const getChapter3ReferencesHtml = () => {
    try {
      const sec37 = chapter3Sections.find((s) => String(s.sectionNumber) === '3.7') || chapter3Sections[chapter3Sections.length - 1];
      const html = String(sec37?.content || '');
      const start = html.search(/<h4>\s*Chapter References\s*<\/h4>/i);
      if (start === -1) return '';
      const slice = html.slice(start);
      // Grab through the first </ul> after the heading.
      const ulEnd = slice.search(/<\/ul>/i);
      if (ulEnd === -1) return slice;
      return slice.slice(0, ulEnd + 5);
    } catch {
      return '';
    }
  };

  const getAllReferencesHtml = () => {
    const ch1Ref = chapter1Sections.find((s) => s.id === 'references');
    const ch2Ref = chapter2Sections.find((s) => s.id === 'ch2_references');
    const ch3Refs = getChapter3ReferencesHtml();

    const wrap = (label, content) => {
      if (!content) return '';
      const isHtml = /<\s*\/?\s*(p|h\d|table|thead|tbody|tr|td|th|ul|ol|li)\b/i.test(String(content || ''));
      const body = isHtml ? String(content) : `<pre>${String(content)}</pre>`;
      return `\n<h3>${label}</h3>\n<div class="references-block">${body}</div>\n`;
    };

    return `
      <div class="reader-html">
        <h2>All Chapter References</h2>
        <p class="reader-subtle"><em>Compiled from the reference sections of each available chapter.</em></p>
        ${wrap('Chapter 1 References', ch1Ref?.content)}
        ${wrap('Chapter 2 References', ch2Ref?.content)}
        ${wrap('Chapter 3 References', ch3Refs)}
      </div>
    `;
  };

  const referencesAllSections = [
    {
      id: 'references_all',
      title: 'References (All Chapters)',
      sectionNumber: 'R',
      content: getAllReferencesHtml(),
      wordCount: 0,
      duration: 5,
    },
  ];

  const allSections = [...chapter1Sections, ...chapter2Sections, ...chapter3Sections, ...chapter5Sections, ...chapter9Sections, ...referencesAllSections];
  const activeSections = activeChapterId === 'references_all'
    ? referencesAllSections
    : activeChapterId.startsWith('ch2')
      ? chapter2Sections
      : activeChapterId.startsWith('ch3')
        ? chapter3Sections
        : activeChapterId.startsWith('ch5')
          ? chapter5Sections
          : activeChapterId.startsWith('ch9')
            ? chapter9Sections
            : chapter1Sections;

  const currentSectionImages = selectedSection ? (sectionIllustrationMap[selectedSection.id] || []) : [];

  const normalizePipeTableParagraphs = (paras = []) => {
    const out = [];
    let i = 0;

    const isPipeLine = (p = '') => {
      const t = String(p || '').trim();
      return t.startsWith('|') && t.includes('|') && t.endsWith('|');
    };

    const isSeparatorLine = (p = '') => {
      const t = String(p || '').trim();
      return isPipeLine(t) && /---/.test(t) && /^\|?\s*[:\-\s\|]+\|?\s*$/.test(t);
    };

    while (i < paras.length) {
      const cur = String(paras[i] || '').trim();

      // Merge pipe-table lines that were split into separate paragraphs by blank lines.
      // We consider a table if we see:
      //   header line (|...|)
      //   separator line (|---|---|)
      //   at least one row line (|...|)
      if (isPipeLine(cur) && i + 1 < paras.length && isSeparatorLine(paras[i + 1])) {
        const tableLines = [cur, String(paras[i + 1]).trim()];
        let j = i + 2;
        while (j < paras.length && isPipeLine(paras[j])) {
          tableLines.push(String(paras[j]).trim());
          j++;
        }
        out.push(tableLines.join('\n'));
        i = j;
        continue;
      }

      out.push(cur);
      i++;
    }

    return out;
  };

  const sectionParagraphs = selectedSection?.content
    ? normalizePipeTableParagraphs(
        selectedSection.content
          .split(/\n\s*\n/)
          .map((p) => p.trim())
          .filter(Boolean)
      )
    : [];

  const coerceText = (value) => {
    if (value == null) return '';
    if (typeof value === 'string') return value;
    if (Array.isArray(value)) return value.map(coerceText).join('\n');
    if (typeof value === 'object') {
      // Common shapes from CMS/parsers
      if (Object.prototype.hasOwnProperty.call(value, 'text')) return coerceText(value.text);
      if (Object.prototype.hasOwnProperty.call(value, 'content')) return coerceText(value.content);
      if (Object.prototype.hasOwnProperty.call(value, 'html')) return coerceText(value.html);
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    return String(value);
  };

  const cleanHeading = (value = '') =>
    coerceText(value)
      .replace(/^\[\s*EXPANDED CONTENT FOR\s*/i, '')
      .replace(/^\(?\s*Comprehensive\s+Overview\s+Section\s*\)?/i, '')
      .replace(/^Section\s+\d+(?:\.\d+)?\s*:\s*/i, '')
      .replace(/^Expanded\s+content\s+for\s*/i, '')
      .replace(/^[-–:\s]+|[-–:\s]+$/g, '')
      .trim();

  const cleanBody = (value = '') =>
    coerceText(value)
      .replace(/\[\s*EXPANDED CONTENT FOR[^\]]*\]/gi, '')
      .replace(/\(\s*Comprehensive\s+Overview\s+Section\s*\)/gi, '')
      .trim();

  const splitHeadingFromText = (text) => {
    const safeText = coerceText(text);
    if (!safeText) return { heading: null, body: '' };
    const lines = safeText.split('\n').map((l) => l.trim()).filter(Boolean);
    const first = lines[0] || '';

    // Never treat pipe-table rows as headings; doing so breaks table rendering.
    if (first.startsWith('|')) {
      return { heading: null, body: cleanBody(safeText) };
    }

    const isHeadingLike = first.length > 0 && first.length < 110 && !first.endsWith('.') && !first.endsWith('?');
    if (isHeadingLike && lines.length > 1) {
      return { heading: cleanHeading(first), body: cleanBody(lines.slice(1).join('\n')) };
    }
    return { heading: null, body: cleanBody(safeText) };
  };

  const countWords = (value = '') =>
    coerceText(value)
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

  // Navigation groupings (chapter sections are sourced above)
  const navChapter1Sections = chapter1Sections;
  const navChapter2Sections = chapter2Sections;
  const navChapter3Sections = chapter3Sections;
  const navChapter5Sections = chapter5Sections;
  const navChapter9Sections = chapter9Sections;

  const chapterScaffoldTitles = [
    'Chapter 10: Antivirals',
    'Chapter 11: Antifungals',
    'Chapter 14: Antineoplastics',
    'Chapter 42: Cardiovascular Introduction',
    'Chapter 43: Blood Pressure',
    'Chapter 44: Cardiotonic',
    'Chapter 45: Antiarrhythmics',
    'Chapter 46: Antianginals',
    'Chapter 47: Lipid-Lowering',
    'Chapter 48: Blood Coagulation',
    'Chapter 49: Anemias',
    'Chapter 53: Respiratory System I',
    'Chapter 54: Respiratory System II',
    'Chapter 55: Respiratory System III',
  ].map((title) => ({
    title,
    sections: ['1.0 Overview (Placeholder)', '1.1 Core Concepts (Placeholder)', '1.2 Clinical Focus (Placeholder)'],
  }));

  const currentSectionIndex = allSections.findIndex((s) => s.id === selectedSection?.id);
  const prevSection = currentSectionIndex > 0 ? allSections[currentSectionIndex - 1] : null;
  const nextSection = currentSectionIndex >= 0 && currentSectionIndex < allSections.length - 1 ? allSections[currentSectionIndex + 1] : null;

  const glossaryEntries = (() => {
    // Preferred: structured glossary block (used by Chapter 1 JSON; also used for future chapters)
    const glossaryBlock = (selectedSection?.contentBlocks || []).find((b) => b && b.type === 'glossary');
    if (glossaryBlock && Array.isArray(glossaryBlock.terms) && glossaryBlock.terms.length) {
      return glossaryBlock.terms
        .filter((t) => t && t.term && t.definition)
        .map((t) => ({ term: String(t.term).trim(), definition: String(t.definition).trim() }));
    }

    // Fallback: parse TERM: definition lines from raw content
    const lines = (selectedSection?.content || '').split('\n').map((l) => l.trim()).filter(Boolean);
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
    'Eight Rights to Medication Administration',
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

  const canonicalEightRights = [
    'Right Patient: Using two identifiers to ensure the correct patient receives the medication',
    'Right Drug: Verifying that the ordered drug is the intended drug, accounting for similar names',
    'Right Dose: Calculating and verifying that the prescribed dose is appropriate',
    'Right Route: Ensuring the medication is administered via the correct route',
    'Right Time: Administering the medication at the appropriate time',
    'Right Documentation: Accurately recording medication administration',
    'Right Reason: Understanding the therapeutic indication for the medication',
    'Right Response: Monitoring for the expected therapeutic response',
  ];

  const isEightRightsText = (value = '') => {
    const normalized = cleanBody(value).replace(/\s+/g, ' ');
    return /Right Patient:/i.test(normalized) && /Right Response:/i.test(normalized);
  };

  const renderCanonicalEightRights = () => (
    <>
      <h4 style={{ margin: '8px 0', fontSize: '1.1rem' }}>Eight Rights to Medication Administration</h4>
      <ol style={{ margin: '0 0 10px 18px', padding: 0 }}>
        {canonicalEightRights.map((item, idx) => (
          <li key={idx} style={{ marginBottom: 6 }}>
            {item}
          </li>
        ))}
      </ol>
    </>
  );

  const renderParagraphWithNumberedList = (text) => {
    if (!isEightRightsText(text) && !/Eight Rights to Medication Administration/i.test(cleanBody(text || ''))) {
      return <p>{text}</p>;
    }

    return renderCanonicalEightRights();
  };

  const getSectionById = (id) => allSections.find((s) => s.id === id);

  const sanitizeReaderText = (value) => {
    const raw = coerceText(value);
    if (!raw) return '';

    // Normalize a few markdown-ish artifacts that can leak into the reader.
    // (We also sanitize the JSON sources, but this keeps the UI resilient.)
    const lines = raw.split('\n');
    const cleaned = [];

    const tableSepRe = /^\|?\s*[:\-\s\|]+\|?\s*$/;
    const hrRe = /^\s*-{3,}\s*$/;
    const dashSpacedRe = /^\s*(?:-\s*){3,}\s*$/;
    const longDashRe = /^\s*-{10,}\s*$/;

    for (let line of lines) {
      let l = String(line ?? '');
      const trimmed = l.trim();
      const hasPipe = trimmed.includes('|');
      const isTableSep = hasPipe && tableSepRe.test(trimmed);
      const isHr = !hasPipe && (hrRe.test(trimmed) || dashSpacedRe.test(trimmed) || longDashRe.test(trimmed));
      if (isHr && !isTableSep) continue;

      // Drop headings like "### "
      l = l.replace(/^\s*#{1,6}\s+/, '');

      // Remove bold markers
      l = l.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*\*/g, '');

      // Remove "(section summary)" labels
      l = l.replace(/\(\s*section\s+summary\s*\)/gi, '');

      cleaned.push(l.trimEnd());
    }

    return cleaned.join('\n').replace(/\n{3,}/g, '\n\n').trim();
  };

  const renderTextbookBody = (text = '') => {
    const raw = sanitizeReaderText(text);
    if (!raw) return null;

    const lines = raw.split('\n').map((l) => l.trim()).filter(Boolean);

    const parseRow = (row) => row
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim());

    const renderPipeTable = (tableLines = []) => {
      if (!tableLines || tableLines.length < 3) return null;
      const headers = parseRow(tableLines[0]);
      const rows = tableLines.slice(2).map(parseRow);

      return (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {headers.map((h, idx) => (
                  <th
                    key={idx}
                    style={{
                      textAlign: 'left',
                      borderBottom: '2px solid var(--panel-border)',
                      padding: '8px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, rIdx) => (
                <tr key={rIdx}>
                  {headers.map((_, cIdx) => (
                    <td
                      key={cIdx}
                      style={{
                        verticalAlign: 'top',
                        borderBottom: '1px solid var(--panel-border)',
                        padding: '8px',
                        minWidth: cIdx === 0 ? 180 : 220,
                      }}
                    >
                      {r[cIdx] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    };

    // Markdown-like pipe table (entire paragraph is a table)
    // Example:
    // | Col A | Col B |
    // |---|---|
    // | a | b |
    const isWholeTable =
      lines.length >= 3 &&
      lines[0].includes('|') &&
      lines[1].includes('|') &&
      /---/.test(lines[1]) &&
      /^\|?\s*[:\-\s\|]+\|?\s*$/.test(lines[1]);

    if (isWholeTable) {
      return renderPipeTable(lines);
    }

    // Mixed content: if a pipe table appears anywhere inside the paragraph,
    // extract it and render it as a table instead of raw pipes.
    const sepIdx = lines.findIndex((l) => l.includes('|') && /---/.test(l) && /^\|?\s*[:\-\s\|]+\|?\s*$/.test(l));
    if (sepIdx > 0) {
      const headerIdx = sepIdx - 1;
      const header = lines[headerIdx];
      if (header && header.includes('|')) {
        // Collect contiguous table rows after separator
        const after = [];
        for (let i = sepIdx + 1; i < lines.length; i++) {
          if (!lines[i].includes('|')) break;
          after.push(lines[i]);
        }
        const beforeText = lines.slice(0, headerIdx).join('\n');
        const afterText = lines.slice(sepIdx + 1 + after.length).join('\n');
        const tableLines = [header, lines[sepIdx], ...after];

        return (
          <>
            {beforeText ? <p>{beforeText}</p> : null}
            {renderPipeTable(tableLines)}
            {afterText ? <p>{afterText}</p> : null}
          </>
        );
      }
    }

    // Numbered list (e.g., 1. ... / 2. ...)
    const isNumbered = lines.length >= 2 && lines.every((l) => /^\d+\.(\s+|$)/.test(l));
    if (isNumbered) {
      return (
        <ol style={{ margin: '0 0 10px 18px', padding: 0 }}>
          {lines.map((l, idx) => (
            <li key={idx} style={{ marginBottom: 6 }}>{l.replace(/^\d+\.\s*/, '')}</li>
          ))}
        </ol>
      );
    }

    // Bullet list (- ... or • ...)
    const isBulleted = lines.length >= 2 && lines.every((l) => /^(-|•)\s+/.test(l));
    if (isBulleted) {
      return (
        <ul style={{ margin: '0 0 10px 18px', padding: 0 }}>
          {lines.map((l, idx) => (
            <li key={idx} style={{ marginBottom: 6 }}>{l.replace(/^(-|•)\s+/, '')}</li>
          ))}
        </ul>
      );
    }

    // Mixed content: render as separate blocks while supporting simple markdown-style
    // headings and bold text used in chapter source content.
    const renderInline = (txt = '') => {
      const parts = String(txt).split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, i) => {
        if (/^\*\*[^*]+\*\*$/.test(part)) return <strong key={i}>{part.slice(2, -2)}</strong>;
        return <React.Fragment key={i}>{part}</React.Fragment>;
      });
    };

    return (
      <>
        {lines.map((l, idx) => {
          if (/^#{1,4}\s+/.test(l)) {
            const level = l.match(/^#+/)[0].length;
            const text = l.replace(/^#{1,4}\s+/, '');
            if (level <= 2) return <h3 key={idx}>{renderInline(text)}</h3>;
            return <h4 key={idx}>{renderInline(text)}</h4>;
          }

          if (/^\d+\.\d+(?:\.\d+)?\s+/.test(l)) {
            return <h4 key={idx}>{renderInline(l)}</h4>;
          }

          return <p key={idx}>{renderInline(l)}</p>;
        })}
      </>
    );
  };

  const fixEightRightsHtml = (html = '') => {
    if (!html || !/Right Patient:/i.test(html) || !/Right Response:/i.test(html)) return html;
    const canonical = `
      <h4>Eight Rights to Medication Administration</h4>
      <ol>
        <li>Right Patient: Using two identifiers to ensure the correct patient receives the medication</li>
        <li>Right Drug: Verifying that the ordered drug is the intended drug, accounting for similar names</li>
        <li>Right Dose: Calculating and verifying that the prescribed dose is appropriate</li>
        <li>Right Route: Ensuring the medication is administered via the correct route</li>
        <li>Right Time: Administering the medication at the appropriate time</li>
        <li>Right Documentation: Accurately recording medication administration</li>
        <li>Right Reason: Understanding the therapeutic indication for the medication</li>
        <li>Right Response: Monitoring for the expected therapeutic response</li>
      </ol>
    `;

    return html
      .replace(/<h[34][^>]*>\s*(The Six Rights \(Extended to Eight\)|Eight Rights to Medication Administration)\s*<\/h[34]>[\s\S]*?(?=<h[34]|$)/i, canonical)
      .replace(/<p>\s*1\.\s*Right Patient:[\s\S]*?8\.\s*Right Response:[\s\S]*?<\/p>/i, canonical);
  };

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
    const all = allSections;
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
    const all = allSections;
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
    const interactive = selectedSection?.id === 'sec2_10_review_questions'
      || selectedSection?.id === 'ch3_9_review_questions'
      || selectedSection?.id === 'ch5_12_review_questions'
      || selectedSection?.id === 'ch9_14_review_questions';

    const show = !!revealedAnswers[key];
    const picked = selectedMcAnswers[key];

    const reveal = () => setRevealedAnswers((prev) => ({ ...prev, [key]: true }));

    return (
      <div key={key} className="reader-card" style={{ marginBottom: '12px' }}>
        <p style={{ fontWeight: 700, marginBottom: '8px' }}>{q.questionNumber}. {q.question}</p>

        {q.options && (
          <div style={{ display: 'grid', gap: '6px', marginBottom: '10px' }}>
            {Object.entries(q.options).map(([letter, text]) => {
              const isPicked = picked === letter;
              const isCorrect = q.correctAnswer === letter;
              const showFeedback = interactive && show;

              const baseStyle = {
                textAlign: 'left',
                borderRadius: '10px',
                padding: '10px 12px',
                border: '1px solid var(--panel-border)',
                background: 'var(--panel)',
                cursor: interactive ? 'pointer' : 'default',
                fontSize: 'var(--reader-size)',
                lineHeight: 'var(--reader-line)',
              };

              const feedbackStyle = showFeedback
                ? isCorrect
                  ? { borderColor: '#22c55e', boxShadow: '0 0 0 2px rgba(34,197,94,0.25) inset' }
                  : isPicked
                    ? { borderColor: '#ef4444', boxShadow: '0 0 0 2px rgba(239,68,68,0.22) inset' }
                    : {}
                : isPicked
                  ? { borderColor: 'var(--accent)', boxShadow: '0 0 0 2px rgba(59,130,246,0.18) inset' }
                  : {};

              if (!interactive) {
                return (
                  <p key={letter} style={{ margin: 0, paddingLeft: '14px' }}>
                    {letter.toLowerCase()}. {text}
                  </p>
                );
              }

              return (
                <button
                  key={letter}
                  className="reader-btn"
                  onClick={() => {
                    setSelectedMcAnswers((prev) => ({ ...prev, [key]: letter }));
                    reveal();
                  }}
                  style={{ ...baseStyle, ...feedbackStyle }}
                >
                  <strong style={{ marginRight: 8 }}>{letter}.</strong> {text}
                </button>
              );
            })}
          </div>
        )}

        {!interactive && (
          <button
            className="reader-btn"
            onClick={() => setRevealedAnswers((prev) => ({ ...prev, [key]: !show }))}
            style={{ marginBottom: '8px' }}
          >
            {show ? 'Hide Answer' : 'Show Answer'}
          </button>
        )}

        {(show || !interactive) && show && (
          <div style={{ background: 'var(--panel)', border: '1px solid var(--panel-border)', borderRadius: '8px', padding: '10px' }}>
            {q.correctAnswer && (
              <p style={{ margin: '0 0 6px 0', fontWeight: 700 }}>
                Correct answer: {q.correctAnswer.toLowerCase()}
                {interactive && picked ? ` (you chose ${picked.toLowerCase()})` : ''}
              </p>
            )}
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

  // Set section from URL query (?section=...), else restore last viewed section
  // Also ensures chapter routes are canonical (Chapter 2 sections live under /reader/ch2_pharmacokinetics).
  useEffect(() => {
    const sections = allSections;
    if (!sections.length) return;

    const query = new URLSearchParams(location.search || '');
    const sectionId = query.get('section');

    if (sectionId) {
      const fromQuery = sections.find((s) => s.id === sectionId);
      if (fromQuery) {
        const isCh2 = fromQuery.id.startsWith('sec2_') || fromQuery.id.startsWith('ch2_') || fromQuery.id === 'ch2_references';
        const isCh3 = fromQuery.id.startsWith('sec3_') || fromQuery.id.startsWith('ch3_') || fromQuery.id === 'ch3_references';
        const isCh5 = fromQuery.id.startsWith('ch5_');
        const isCh9 = fromQuery.id.startsWith('ch9_');
        const targetChapter = isCh2 ? 'ch2_pharmacokinetics' : isCh3 ? 'ch3_toxicity' : isCh5 ? 'ch5_dosage_calculations' : isCh9 ? 'ch9_antibiotics' : 'ch1_intro';
        if (activeChapterId !== targetChapter) {
          navigate(`/reader/${targetChapter}?section=${fromQuery.id}`, { replace: true });
          return;
        }
        setSelectedSection(fromQuery);
        return;
      }
    }

    const savedKey = `unavida:lastReaderSection:${activeChapterId}`;
    const savedId = localStorage.getItem(savedKey);
    const saved = activeSections.find((s) => s.id === savedId);
    setSelectedSection(saved || activeSections[0]);
  }, [location.search, activeChapterId]);

  // Persist currently viewed section
  useEffect(() => {
    if (selectedSection?.id) {
      localStorage.setItem(`unavida:lastReaderSection:${activeChapterId}`, selectedSection.id);
    }
  }, [selectedSection?.id, activeChapterId]);

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
    if (!section) return;
    const isCh2 = section.id?.startsWith('sec2_') || section.id?.startsWith('ch2_') || section.id === 'ch2_references';
    const isCh3 = section.id?.startsWith('sec3_') || section.id?.startsWith('ch3_') || section.id === 'ch3_references';
    const isCh5 = section.id?.startsWith('ch5_');
    const isCh9 = section.id?.startsWith('ch9_');
    const targetChapter = isCh2 ? 'ch2_pharmacokinetics' : isCh3 ? 'ch3_toxicity' : isCh5 ? 'ch5_dosage_calculations' : isCh9 ? 'ch9_antibiotics' : 'ch1_intro';
    const nextUrl = `/reader/${targetChapter}?section=${section.id}`;

    setSelectedSection(section);
    setToolView('content');
    setRevealedAnswers({});

    // Keep URL in sync so chapters/sections have their own address.
    if (typeof window !== 'undefined') {
      const current = `${window.location.pathname}${window.location.search}`;
      if (current !== nextUrl) navigate(nextUrl, { replace: false });
    }

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
          grid-template-columns: 1fr;
          justify-content: stretch;
          padding-left: 0;
          padding-right: 0;
          gap: 0;
          width: 100vw;
          max-width: 100vw;
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
          margin-left: 0 !important;
          margin-right: 0 !important;
          width: 100vw !important;
          max-width: 100vw !important;
          padding: 0 !important;
        }

        .reader-layout.focus-reader .reader-main-wrap {
          margin: 0 !important;
          max-width: none !important;
          width: 100vw !important;
          padding: 0 14px 0 50px !important;
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
        .reader-main { flex: 1; min-width: 0; margin-left: 0; }
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
          color: #111111;
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
          <div className="reader-crumb" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/bookshelf')}>Home</span>
            <span>/</span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/textbook/NUR1100')}>Pharmacology I</span>
            <span>/</span>
            <span style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => navigate('/reader/ch1_intro')}>Reader</span>
          </div>
          <div className="reader-header">Mastering Pharmacology</div>
        </div>
        <div className="reader-tools">
          <button className="reader-btn" onClick={() => setTopMenuOpen((v) => !v)}>☰ Reader Menu</button>
          <a href="/textbook/NUR1100" className="reader-btn">Back to Textbook</a>

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

          <div className={`reader-chap ${activeChapterId.startsWith('ch1') ? 'open' : ''}`}>
            <button className="reader-chap-btn" onClick={(e) => handleChapClick(e.currentTarget.closest('.reader-chap'))}>
              Chapter 1: Intro to Pharmacology
              <small>▼</small>
            </button>
            <div className="reader-sec-wrap">
              {navChapter1Sections.map((section) => (
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

          <div className={`reader-chap ${activeChapterId.startsWith('ch2') ? 'open' : ''}`}>
            <button className="reader-chap-btn" onClick={(e) => handleChapClick(e.currentTarget.closest('.reader-chap'))}>
              Chapter 2: Pharmacokinetics
              <small>▼</small>
            </button>
            <div className="reader-sec-wrap">
              {navChapter2Sections.map((section) => (
                <a
                  key={section.id}
                  className={`reader-sec ${selectedSection?.id === section.id ? 'active' : ''}`}
                  onClick={() => handleSectionClick(section)}
                >
                  {section.title}
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}> ({getSectionWordCount(section)} words)</span>
                </a>
              ))}
            </div>
          </div>

          <div className={`reader-chap ${activeChapterId.startsWith('ch3') ? 'open' : ''}`}>
            <button className="reader-chap-btn" onClick={(e) => handleChapClick(e.currentTarget.closest('.reader-chap'))}>
              Chapter 3: Toxicity
              <small>▼</small>
            </button>
            <div className="reader-sec-wrap">
              {navChapter3Sections.map((section) => (
                <a
                  key={section.id}
                  className={`reader-sec ${selectedSection?.id === section.id ? 'active' : ''}`}
                  onClick={() => handleSectionClick(section)}
                >
                  {section.title}
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}> ({getSectionWordCount(section)} words)</span>
                </a>
              ))}
            </div>
          </div>

          <div className={`reader-chap ${activeChapterId.startsWith('ch5') ? 'open' : ''}`}>
            <button className="reader-chap-btn" onClick={(e) => handleChapClick(e.currentTarget.closest('.reader-chap'))}>
              Chapter 5: Dosage Calculations
              <small>▼</small>
            </button>
            <div className="reader-sec-wrap">
              {navChapter5Sections.map((section) => (
                <a
                  key={section.id}
                  className={`reader-sec ${selectedSection?.id === section.id ? 'active' : ''}`}
                  onClick={() => handleSectionClick(section)}
                >
                  {section.title}
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}> ({getSectionWordCount(section)} words)</span>
                </a>
              ))}
            </div>
          </div>

          <div className={`reader-chap ${activeChapterId.startsWith('ch9') ? 'open' : ''}`}>
            <button className="reader-chap-btn" onClick={(e) => handleChapClick(e.currentTarget.closest('.reader-chap'))}>
              Chapter 9: Antibiotics
              <small>▼</small>
            </button>
            <div className="reader-sec-wrap">
              {navChapter9Sections.map((section) => (
                <a
                  key={section.id}
                  className={`reader-sec ${selectedSection?.id === section.id ? 'active' : ''}`}
                  onClick={() => handleSectionClick(section)}
                >
                  {section.title}
                  <span style={{ fontSize: '11px', color: 'var(--muted)' }}> ({getSectionWordCount(section)} words)</span>
                </a>
              ))}
            </div>
          </div>

          {chapterScaffoldTitles.map((chapter) => (
            <div className="reader-chap" key={chapter.title}>
              <button className="reader-chap-btn" onClick={(e) => handleChapClick(e.currentTarget.closest('.reader-chap'))}>
                {chapter.title}
                <small>▼</small>
              </button>
              <div className="reader-sec-wrap">
                {chapter.sections.map((label) => (
                  <a
                    key={`${chapter.title}-${label}`}
                    className="reader-sec"
                    onClick={() => window.alert('This chapter is mapped and queued for content build.')}
                  >
                    {label}
                    <span style={{ fontSize: '11px', color: 'var(--muted)' }}> (placeholder)</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Main Content Panel */}
        <main className="reader-panel reader-main" ref={mainScrollRef}>
          <div className="reader-main-wrap" onClick={handleInlineImageClick} onPointerUp={handleInlineImagePointerUp}>
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
                  <strong style={{ color: '#111111' }}>Exam Alert:</strong> Instructor-highlighted topic — High-yield content for next assessment.
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
                    {selectedSection.id === 'references' || selectedSection.id === 'ch2_references' ? (
                      <>
                        <h3>References (APA Style)</h3>
                        <div>
                          {sectionParagraphs
                            .map((t) => cleanBody(t))
                            .filter((t) => t && !/^references$/i.test(t) && !/^[-–—]{2,}$/.test(t))
                            .map((refText, idx) => (
                              <p key={idx} className="apa-ref">{refText}</p>
                            ))}
                        </div>
                      </>
                    ) : glossaryEntries.length > 0 && /glossary/i.test(selectedSection.title || '') ? (
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
                    ) : (() => {
                      const looksLikeHtml = (t) => /<\s*\/?\s*(p|h\d|table|thead|tbody|tr|td|th|ul|ol|li)\b/i.test(String(t || ''));

                      const injectChapter3Images = (html = '') => {
                        let out = String(html || '');

                        // Remove any leftover placeholder tags like <<FIGURE_3_...>> that render as "<>".
                        out = out.replace(/<<\s*FIGURE_3_[A-Z0-9_]+\s*>>/g, '');

                        // Only inject for Chapter 3 content.
                        const isChapter3 = selectedSection?.sectionNumber && String(selectedSection.sectionNumber).startsWith('3.');
                        if (!isChapter3) return out;

                        const figureForHeading = [
                          ['3.1.1 General Definition of Adverse Effects', '/images/ch3/FIGURE_3_15_ADVERSE_TYPES.png', 'Types of Adverse Effects'],
                          ['3.1.4 Allergic Reactions', '/images/ch3/FIGURE_3_16_ALLERGY.png', 'Allergic Reactions'],

                          ['3.2.1 Mechanisms of Drug-Induced Injury', '/images/ch3/FIGURE_3_5_ORGAN_DAMAGE.png', 'Drug-Induced Organ Damage'],
                          ['3.2.2 Hepatotoxicity (Drug-Induced Liver Injury)', '/images/ch3/FIGURE_3_12_LIVER_METABOLISM.png', 'Drug Metabolism and Liver Injury'],
                          ['3.2.3 Nephrotoxicity (Drug-Induced Kidney Injury)', '/images/ch3/FIGURE_3_13_KIDNEY_EXCRETION.png', 'Kidney Excretion'],
                          ['3.2.6 Bone Marrow Suppression', '/images/ch3/FIGURE_3_14_BONE_MARROW.png', 'Bone Marrow Suppression'],

                          ['3.3.2 The Therapeutic Window', '/images/ch3/FIGURE_3_1_THERAPEUTIC_WINDOW.png', 'Therapeutic Window'],
                          ['3.3.5 Drug Accumulation', '/images/ch3/FIGURE_3_2_ACCUMULATION.png', 'Drug Accumulation'],

                          ['3.4.1 Physiology of Glucose Regulation', '/images/ch3/FIGURE_3_3_GLUCOSE_REGULATION.png', 'Physiology of Glucose Regulation'],
                          ['3.4.2 Drug-Induced Hyperglycemia', '/images/ch3/FIGURE_3_17_GLUCOSE_SYMPTOMS.png', 'Hyperglycemia and Hypoglycemia Symptoms'],

                          // Two visuals belong under 3.5.1 (keep a big passage between them)
                          ['3.5.1 Normal Electrolyte Balance and Regulation', '/images/ch3/FIGURE_3_18_FLUID_REGULATION.png', 'Fluid Regulation'],
                          ['3.5.1 Normal Electrolyte Balance and Regulation__P3', '/images/ch3/FIGURE_3_4_ELECTROLYTE_DISTRIBUTION.png', 'Electrolyte Distribution'],
                          ['3.5.3 Drug-Induced Potassium Imbalance', '/images/ch3/FIGURE_3_10_POTASSIUM_ECG.png', 'Potassium ECG Changes'],

                          ['3.6.1 Effects of Drugs on the Central Nervous System', '/images/ch3/FIGURE_3_11_CNS_EFFECTS.png', 'CNS Effects'],
                          ['3.6.2 Peripheral Neuropathy', '/images/ch3/FIGURE_3_6_NEUROPATHY.png', 'Peripheral Neuropathy'],
                          ['3.6.3 Ototoxicity', '/images/ch3/FIGURE_3_7_OTOTOXICITY.png', 'Ototoxicity'],

                          ['3.7.1 Placental Transfer of Drugs', '/images/ch3/FIGURE_3_8_PLACENTA_TRANSFER.png', 'Placental Transfer'],
                          ['3.7.2 Critical Periods of Fetal Development', '/images/ch3/FIGURE_3_9_TRIMESTER_RISK.png', 'Trimester Risk'],
                        ];

                        const escapeRegExp = (s = '') => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                        const injectAfterH4NthParagraph = (srcHtml, headingText, paragraphIndex1Based, imgSrc, alt) => {
                          if (!srcHtml || srcHtml.includes(imgSrc)) return srcHtml;

                          const h4 = new RegExp(`<h4>(?:\\s|&nbsp;)*${escapeRegExp(headingText)}(?:\\s|&nbsp;)*<\\/h4>`, 'i');
                          const m = srcHtml.match(h4);
                          if (!m) return srcHtml;

                          const fig = `\n<figure class="reader-figure">\n  <img class="reader-zoomable" src="${imgSrc}" alt="${alt}" />\n</figure>\n`;

                          const idx = srcHtml.search(h4);
                          const headingLen = m[0]?.length || 0;
                          let cursor = idx >= 0 ? idx + headingLen : -1;
                          if (cursor >= 0) {
                            let count = 0;
                            while (count < Math.max(1, paragraphIndex1Based)) {
                              const pCloseIdx = srcHtml.indexOf('</p>', cursor);
                              if (pCloseIdx === -1) break;
                              count += 1;
                              cursor = pCloseIdx + 4;
                              if (count === paragraphIndex1Based) {
                                return srcHtml.slice(0, cursor) + fig + srcHtml.slice(cursor);
                              }
                            }
                          }

                          // Fallback: insert directly after heading
                          return srcHtml.replace(h4, (match) => `${match}${fig}`);
                        };

                        const injectAfterH4 = (srcHtml, headingText, imgSrc, alt) =>
                          injectAfterH4NthParagraph(srcHtml, headingText, 1, imgSrc, alt);

                        for (const [headingText, imgSrc, alt] of figureForHeading) {
                          if (headingText.endsWith('__P3')) {
                            const baseHeading = headingText.replace(/__P3$/, '');
                            out = injectAfterH4NthParagraph(out, baseHeading, 3, imgSrc, alt);
                          } else {
                            out = injectAfterH4(out, headingText, imgSrc, alt);
                          }
                        }

                        // End-of-section / end-of-chapter visuals
                        const appendFigure = (srcHtml, imgSrc, alt) => {
                          if (!srcHtml || srcHtml.includes(imgSrc)) return srcHtml;
                          const fig = `\n<figure class="reader-figure">\n  <img class="reader-zoomable" src="${imgSrc}" alt="${alt}" />\n</figure>\n`;
                          return srcHtml.trimEnd() + fig;
                        };

                        if (String(selectedSection?.sectionNumber) === '3.3') {
                          out = appendFigure(out, '/images/ch3/FIGURE_3_19_TOXICITY_FLOW.png', 'Toxicity Flow');
                        }

                        if (String(selectedSection?.sectionNumber) === '3.7') {
                          out = appendFigure(out, '/images/ch3/FIGURE_3_20_TOXICITY_SUMMARY.png', 'Toxicity Summary');
                        }

                        return out;
                      };

                      // If the section content is already HTML (e.g., imported from DOCX), render it as HTML.
                      const chapter5FigureMap = {
                        FIGURE_5_1_CALCULATION_SETUP: '/images/ch5/FIGURE_5_1_CALCULATION_SETUP.png',
                        FIGURE_5_2_LABEL_READING: '/images/ch5/FIGURE_5_2_LABEL_READING.png',
                        FIGURE_5_3_DECIMAL_SAFETY: '/images/ch5/FIGURE_5_3_DECIMAL_SAFETY.png',
                        FIGURE_5_4_FORMULA_METHOD: '/images/ch5/FIGURE_5_4_FORMULA_METHOD.png',
                        FIGURE_5_5_TABLET_CALCULATION: '/images/ch5/FIGURE_5_5_TABLET_CALCULATION.png',
                        FIGURE_5_6_LIQUID_CALCULATION: '/images/ch5/FIGURE_5_6_LIQUID_CALCULATION.png',
                        FIGURE_5_7_RATIO_PROPORTION_SETUP: '/images/ch5/FIGURE_5_7_RATIO_PROPORTION_SETUP.png',
                        FIGURE_5_8_RATIO_CROSS_MULTIPLY: '/images/ch5/FIGURE_5_8_RATIO_CROSS_MULTIPLY.png',
                        FIGURE_5_9_DIMENSIONAL_ANALYSIS: '/images/ch5/FIGURE_5_9_DIMENSIONAL_ANALYSIS.png',
                        FIGURE_5_10_UNIT_CANCELLATION: '/images/ch5/FIGURE_5_10_UNIT_CANCELLATION.png',
                        FIGURE_5_11_WEIGHT_BASED_SETUP: '/images/ch5/FIGURE_5_11_WEIGHT_BASED_SETUP.png',
                        FIGURE_5_12_METRIC_CONVERSION: '/images/ch5/FIGURE_5_12_METRIC_CONVERSION.png',
                        FIGURE_5_13_LB_TO_KG: '/images/ch5/FIGURE_5_13_LB_TO_KG.png',
                        FIGURE_5_14_HOUSEHOLD_CONVERSION: '/images/ch5/FIGURE_5_14_HOUSEHOLD_CONVERSION.png',
                        FIGURE_5_15_LIQUID_DOSE_DRAW: '/images/ch5/FIGURE_5_15_LIQUID_DOSE_DRAW.png',
                        FIGURE_5_16_RECONSTITUTION: '/images/ch5/FIGURE_5_16_RECONSTITUTION.png',
                        FIGURE_5_17_INSULIN_SYRINGE: '/images/ch5/FIGURE_5_17_INSULIN_SYRINGE.png',
                        FIGURE_5_18_MEQ_DIAGRAM: '/images/ch5/FIGURE_5_18_MEQ_DIAGRAM.png',
                        FIGURE_5_19_MG_PER_KG: '/images/ch5/FIGURE_5_19_MG_PER_KG.png',
                        FIGURE_5_20_SAFE_RANGE: '/images/ch5/FIGURE_5_20_SAFE_RANGE.png',
                        FIGURE_5_21_BSA_FORMULA: '/images/ch5/FIGURE_5_21_BSA_FORMULA.png',
                        FIGURE_5_22_IV_PUMP: '/images/ch5/FIGURE_5_22_IV_PUMP.png',
                        FIGURE_5_23_DROP_FACTOR: '/images/ch5/FIGURE_5_23_DROP_FACTOR.png',
                        FIGURE_5_24_GTT_CALC: '/images/ch5/FIGURE_5_24_GTT_CALC.png',
                        FIGURE_5_25_INFUSION_SETUP: '/images/ch5/FIGURE_5_25_INFUSION_SETUP.png',
                        FIGURE_5_26_MCG_KG_MIN: '/images/ch5/FIGURE_5_26_MCG_KG_MIN.png',
                        FIGURE_5_27_TITRATION: '/images/ch5/FIGURE_5_27_TITRATION.png',
                        FIGURE_5_28_BAG_CHANGE: '/images/ch5/FIGURE_5_28_BAG_CHANGE.png',
                        FIGURE_5_29_SAFETY_CHECK: '/images/ch5/FIGURE_5_29_SAFETY_CHECK.png',
                        FIGURE_5_30_DOUBLE_CHECK: '/images/ch5/FIGURE_5_30_DOUBLE_CHECK.png',
                        FIGURE_5_31_HIGH_ALERT: '/images/ch5/FIGURE_5_31_HIGH_ALERT.png',
                        FIGURE_5_32_REASONABLENESS: '/images/ch5/FIGURE_5_32_REASONABLENESS.png',
                        FIGURE_5_33_CALCULATION_FLOW: '/images/ch5/FIGURE_5_33_CALCULATION_FLOW.png',
                      };

                      const injectChapter5Images = (html) => {
                        if (!html) return html;
                        let out = String(html);
                        Object.entries(chapter5FigureMap).forEach(([key, src]) => {
                          const re = new RegExp(`<<\\s*${key}\\s*>>`, 'g');
                          out = out.replace(
                            re,
                            `<figure style="margin: 14px 0; padding: 10px; border: 1px solid var(--panel-border); border-radius: 12px; background: var(--panel);">
                               <img class="reader-zoomable" src="${src}" alt="${key}" style="width: 100%; max-height: 420px; object-fit: contain;" loading="lazy" />
                             </figure>`
                          );
                        });
                        return out;
                      };

                      const renderFigureToken = (tokenLine) => {
                        const m = String(tokenLine || '').trim().match(/^<<\s*([A-Z0-9_]+)\s*>>$/);
                        if (!m) return null;
                        const key = m[1];
                        const src = chapter5FigureMap[key];
                        if (!src) return null;
                        return (
                          <img
                            className="reader-zoomable"
                            src={src}
                            alt={key}
                            style={{ width: '100%', marginTop: '10px', maxHeight: '420px', objectFit: 'contain', background: 'var(--panel)', borderRadius: '10px', border: '1px solid var(--panel-border)', padding: '8px' }}
                            loading="lazy"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setTimeout(() => openLightbox(src, key), 0);
                            }}
                            onPointerUp={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setTimeout(() => openLightbox(src, key), 0);
                            }}
                          />
                        );
                      };

                      if (looksLikeHtml(selectedSection.content)) {
                        const html = activeChapterId.startsWith('ch5')
                          ? injectChapter5Images(selectedSection.content)
                          : injectChapter3Images(selectedSection.content);

                        return (
                          <div
                            className="reader-html"
                            dangerouslySetInnerHTML={{ __html: html }}
                          />
                        );
                      }

                      // Otherwise, fall back to the legacy paragraph renderer.
                      return sectionParagraphs.map((para, idx) => {
                        const fig = activeChapterId.startsWith('ch5') ? renderFigureToken(para) : null;
                        if (fig) {
                          return (
                            <div key={`fig-${idx}`} style={{ marginBottom: '18px' }}>
                              {fig}
                            </div>
                          );
                        }
                        if (selectedSection.id === 'sec1_overview_introduction' && isEightRightsText(para)) {
                          return (
                            <div key={idx} style={{ marginBottom: '18px' }}>
                              {renderCanonicalEightRights()}
                            </div>
                          );
                        }

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
                                {forced.before && (selectedSection.id === 'sec1_overview_introduction' ? renderParagraphWithNumberedList(forced.before) : renderTextbookBody(forced.before))}
                                <h4 style={{ margin: '8px 0', fontSize: '1.1rem' }}>{forced.heading}</h4>
                                {forced.after && (selectedSection.id === 'sec1_overview_introduction' ? renderParagraphWithNumberedList(forced.after) : renderTextbookBody(forced.after))}
                              </>
                            ) : (
                              selectedSection.id === 'sec1_overview_introduction'
                                ? renderParagraphWithNumberedList(body)
                                : renderTextbookBody(body)
                            )}
                            {imgSrc && (
                              <img
                                className="reader-zoomable"
                                src={imgSrc}
                                alt={`Section visual ${slotIdx + 1}`}
                                style={{ width: '100%', marginTop: '10px', maxHeight: '420px', objectFit: 'contain', background: 'var(--panel)', borderRadius: '10px' }}
                                loading="lazy"
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setTimeout(() => openLightbox(imgSrc, `Section visual ${slotIdx + 1}`), 0);
                                }}
                                onPointerUp={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setTimeout(() => openLightbox(imgSrc, `Section visual ${slotIdx + 1}`), 0);
                                }}
                              />
                            )}
                          </div>
                        );
                      });
                    })()}
                  </section>
                )}

                {selectedSection.id === 'sec1_11_review_questions' || selectedSection.id === 'sec2_10_review_questions' || selectedSection.id === 'ch3_9_review_questions' || selectedSection.id === 'ch5_12_review_questions' || selectedSection.id === 'ch9_14_review_questions' ? (
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
                          selectedSection.id === 'sec1_overview_introduction' && isEightRightsText(block.htmlReady) ? (
                            renderCanonicalEightRights()
                          ) : (
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  selectedSection.id === 'sec1_overview_introduction'
                                    ? fixEightRightsHtml(block.htmlReady)
                                    : block.htmlReady,
                              }}
                            />
                          )
                        ) : block.content ? (
                          selectedSection.id === 'sec1_overview_introduction'
                            ? renderParagraphWithNumberedList(block.content)
                            : <p>{block.content}</p>
                        ) : null}
                      </div>
                    ))}
                  </section>
                )}

                {selectedSection.learningObjectives && selectedSection.learningObjectives.length > 0 && (
                  <section className="reader-card">
                    <h3>Learning Objectives</h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 'var(--reader-line)', fontSize: 'var(--reader-size)' }}>
                      {selectedSection.learningObjectives.map((obj, idx) => (
                        <li key={idx}>{obj}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {selectedSection.keyTakeaways && selectedSection.keyTakeaways.length > 0 && (
                  <section className="reader-card">
                    <h3>Key Takeaways</h3>
                    <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: 'var(--reader-line)', fontSize: 'var(--reader-size)' }}>
                      {selectedSection.keyTakeaways.map((takeaway, idx) => (
                        <li key={idx}>{takeaway}</li>
                      ))}
                    </ul>
                  </section>
                )}

                <section className="reader-card" style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      className="reader-btn"
                      onClick={() => prevSection && handleSectionClick(prevSection)}
                      disabled={!prevSection}
                      style={!prevSection ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
                    >
                      ← Back {prevSection ? `(${cleanHeading(prevSection.title)})` : ''}
                    </button>

                    <button
                      className="reader-btn"
                      onClick={() => nextSection && handleSectionClick(nextSection)}
                      disabled={!nextSection}
                      style={!nextSection ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
                    >
                      Next → {nextSection ? `(${cleanHeading(nextSection.title)})` : ''}
                    </button>
                  </div>
                </section>
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
            {allSections.map((s) => {
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
              <button className="reader-btn" onClick={() => setPrintSelectedIds(allSections.map((s) => s.id))}>Select All</button>
              <button className="reader-btn" onClick={() => setPrintSelectedIds([])}>Clear</button>
              <button
                className="reader-btn"
                onClick={() => {
                  const selected = allSections.filter((s) => printSelectedIds.includes(s.id));
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

        {/* Image lightbox modal */}
        {lightbox.open && (
          <div
            className="reader-lightbox"
            role="dialog"
            aria-modal="true"
            onClick={closeLightbox}
          >
            <div className="reader-lightbox-inner" onClick={(e) => e.stopPropagation()}>
              <button className="reader-lightbox-close" onClick={closeLightbox} aria-label="Close image">
                ✕
              </button>
              <img src={lightbox.src} alt={lightbox.alt || 'Expanded diagram'} />
              {lightbox.alt && <div className="reader-lightbox-caption">{lightbox.alt}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChapterReader;
