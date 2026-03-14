/* eslint-disable no-console */
// One-off builder: CH2_READER_CONTENT_DRAFT_2_1_TO_2_6.md -> src/data/CHAPTER_2_UNAVIDA_PRODUCTION.json
// Run: node scripts/build_chapter2_json.js

const fs = require('fs');
const path = require('path');

const SRC_MD = path.join(__dirname, '..', 'docs', 'ch2', 'CH2_READER_CONTENT_DRAFT_2_1_TO_2_6.md');
const OUT_JSON = path.join(__dirname, '..', 'src', 'data', 'CHAPTER_2_UNAVIDA_PRODUCTION.json');

const SECTION_ID_MAP = {
  '2.1': 'sec2_1_pk_overview',
  '2.2': 'sec2_2_absorption',
  '2.3': 'sec2_3_distribution',
  '2.4': 'sec2_4_metabolism',
  '2.5': 'sec2_5_excretion',
  '2.6': 'sec2_6_half_life_clearance',
  '2.7': 'sec2_7_special_populations',
  '2.8': 'sec2_8_clinical_application',
};

function countWords(value = '') {
  return String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean).length;
}

function cleanMarkdownToReaderText(md = '') {
  // Keep content mostly as plain text with lightweight cues.
  // Strip editorial/draft callouts that shouldn't render in the student reader.
  return String(md)
    // Remove markdown heading markers
    .replace(/^#+\s+/gm, '')
    // Remove blockquote markers
    .replace(/^>\s?/gm, '')
    // Remove bracketed production callouts (VIDEO/IMAGE/CALLOUT, etc.)
    // Handles lines like **[VIDEO CALLOUT: 2.1.A]** ...
    .replace(/^\s*(?:\*\*|\*)?\s*\[[^\]]+\]\s*(?:\*\*|\*)?\s*.*$/gmi, '')
    .replace(/^.*\[(?:VIDEO|IMAGE)[^\]]*\].*$/gmi, '')
    // Remove leftover "Draft" markers
    .replace(/\bDraft\b/gi, '')
    // Unwrap basic markdown formatting
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    // Normalize newlines
    .replace(/\r\n/g, '\n')
    // Collapse excessive blank lines
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function parseSections(md) {
  // Split on lines like: ## 2.1 OVERVIEW: ...
  const re = /^##\s+(2\.\d+)\s+(.+)$/gm;
  const hits = [];
  let m;
  while ((m = re.exec(md)) !== null) {
    hits.push({ idx: m.index, num: m[1], titleRest: m[2].trim() });
  }

  // Force chapter-title naming to match Chapter 1 style (Title Case + specific phrasing)
  const TITLE_OVERRIDES = {
    '2.1': 'Pharmacokinetics Overview (ADME)',
    '2.2': 'Absorption & Bioavailability',
    '2.3': 'Distribution — Where Drugs Go',
    '2.4': 'Metabolism & CYP450',
    '2.5': 'Excretion & Drug Elimination',
    '2.6': 'Half-Life, Clearance & Steady State',
  };

  const sections = [];
  for (let i = 0; i < hits.length; i += 1) {
    const cur = hits[i];
    const next = hits[i + 1];
    const start = md.indexOf('\n', cur.idx) + 1;
    const end = next ? next.idx : md.length;
    const rawBody = md.slice(start, end).trim();

    const id = SECTION_ID_MAP[cur.num] || `sec2_${cur.num.replace('.', '_')}`;
    const titleCore = TITLE_OVERRIDES[cur.num] || cur.titleRest;
    const title = `Section ${cur.num}: ${titleCore}`;

    const content = cleanMarkdownToReaderText(rawBody);

    sections.push({
      sectionNumber: cur.num,
      id,
      title,
      duration: 25,
      wordCount: countWords(content),
      learningObjectives: [],
      keyTakeaways: [],
      contentBlocks: [],
      flashcardLinks: [],
      interactiveElements: [],
      content,
    });
  }

  return sections;
}

function main() {
  if (!fs.existsSync(SRC_MD)) {
    console.error('Missing source markdown:', SRC_MD);
    process.exit(1);
  }

  const md = fs.readFileSync(SRC_MD, 'utf8');
  const sections = parseSections(md);

  const missing = ['2.1', '2.2', '2.3', '2.4', '2.5', '2.6'].filter(
    (n) => !sections.some((s) => s.sectionNumber === n)
  );
  if (missing.length) {
    console.error('Missing expected sections:', missing.join(', '));
    process.exit(1);
  }

  const keyTerms = [
    { term: 'Pharmacokinetics', definition: 'What the body does to the drug: absorption, distribution, metabolism, and excretion (ADME).' },
    { term: 'ADME', definition: 'Absorption, Distribution, Metabolism, Excretion — the four core pharmacokinetic processes.' },
    { term: 'Absorption', definition: 'Movement of a drug from its administration site into the bloodstream.' },
    { term: 'Bioavailability', definition: 'Fraction of an administered dose that reaches systemic circulation in active form.' },
    { term: 'First-pass metabolism', definition: 'Metabolism of an oral drug by the liver before it reaches systemic circulation, reducing bioavailability.' },
    { term: 'Distribution', definition: 'Movement of drug from blood into tissues and body fluids.' },
    { term: 'Plasma protein binding', definition: 'Binding of drug (often to albumin); only free/unbound drug is usually active.' },
    { term: 'Free drug', definition: 'Unbound drug in plasma that can cross membranes and exert pharmacologic effects.' },
    { term: 'Albumin', definition: 'Major plasma protein; low levels can increase free drug and toxicity risk for highly protein-bound meds.' },
    { term: 'Volume of distribution (Vd)', definition: 'Apparent volume that relates amount of drug in body to plasma concentration; helps predict distribution.' },
    { term: 'Blood–brain barrier (BBB)', definition: 'Selective barrier limiting many drugs from entering the CNS.' },
    { term: 'Lipid solubility', definition: 'Fat solubility; lipid-soluble drugs cross membranes more easily and may store in adipose tissue.' },
    { term: 'Metabolism (biotransformation)', definition: 'Chemical alteration of a drug, usually in the liver, often to facilitate elimination.' },
    { term: 'Cytochrome P450 (CYP450)', definition: 'Enzyme system responsible for many Phase I metabolism reactions; common source of interactions.' },
    { term: 'Enzyme inhibitor', definition: 'Drug that decreases enzyme activity, raising levels of substrate drugs (toxicity risk).' },
    { term: 'Enzyme inducer', definition: 'Drug that increases enzyme activity, lowering levels of substrate drugs (treatment failure risk).' },
    { term: 'Prodrug', definition: 'Inactive compound that must be metabolized to become active.' },
    { term: 'Excretion', definition: 'Removal of drug/metabolites from the body (kidneys most common).' },
    { term: 'Renal clearance', definition: 'Ability of kidneys to remove drug from plasma; reduced clearance increases accumulation risk.' },
    { term: 'Half-life (t½)', definition: 'Time for plasma drug concentration to decrease by ~50%.' },
    { term: 'Clearance', definition: 'Volume of plasma cleared of drug per unit time; determines maintenance dosing needs.' },
    { term: 'Steady state', definition: 'Stable average drug concentration when rate in equals rate out; typically ~4–5 half-lives.' },
    { term: 'Loading dose', definition: 'Initial larger dose used to reach target concentration quickly (often when half-life is long).' },
    { term: 'Maintenance dose', definition: 'Ongoing dosing to maintain therapeutic concentration once achieved.' },
  ];

  const reviewQuestions = [
    {
      questionNumber: 1,
      type: 'multiple_choice',
      question: 'Which statement best defines pharmacokinetics?',
      options: {
        A: 'It describes how the drug changes the body at the receptor level',
        B: 'It describes what the body does to the drug through ADME processes',
        C: 'It is limited to renal excretion only',
        D: 'It only applies to IV medications',
      },
      correctAnswer: 'B',
      rationale: 'Pharmacokinetics focuses on ADME — absorption, distribution, metabolism, and excretion.'
    },
    {
      questionNumber: 2,
      type: 'multiple_choice',
      question: 'A patient with low albumin is receiving a highly protein-bound medication. What is the primary concern?',
      options: {
        A: 'Decreased free drug causing treatment failure',
        B: 'Increased free drug causing higher toxicity risk',
        C: 'The drug will not be absorbed from the GI tract',
        D: 'The drug will be unable to cross the blood–brain barrier',
      },
      correctAnswer: 'B',
      rationale: 'Low albumin means fewer binding sites → more free/unbound drug → stronger effect/toxicity risk.'
    },
    {
      questionNumber: 3,
      type: 'multiple_choice',
      question: 'First-pass metabolism most directly affects which route of administration?',
      options: { A: 'Intravenous (IV)', B: 'Oral (PO)', C: 'Inhaled', D: 'Transdermal' },
      correctAnswer: 'B',
      rationale: 'Oral medications may be metabolized in the liver before reaching systemic circulation.'
    },
    {
      questionNumber: 4,
      type: 'multiple_choice',
      question: 'A strong CYP450 inhibitor is added to a patient\'s regimen. What is a common clinical outcome for drugs metabolized by that CYP enzyme?',
      options: { A: 'Lower drug levels and reduced effect', B: 'Higher drug levels and increased toxicity risk', C: 'No change in drug levels', D: 'Immediate increased renal excretion' },
      correctAnswer: 'B',
      rationale: 'Inhibitors slow metabolism → drug accumulates → higher levels/toxicity risk.'
    },
    {
      questionNumber: 5,
      type: 'multiple_choice',
      question: 'Approximately how many half-lives does it take most drugs to reach steady state?',
      options: { A: '1', B: '2', C: '4–5', D: '10–12' },
      correctAnswer: 'C',
      rationale: 'Rule of thumb: ~4–5 half-lives to approach steady state.'
    },
    {
      questionNumber: 6,
      type: 'multiple_choice',
      question: 'Which patient scenario most increases risk for accumulation of a renally cleared drug?',
      options: { A: 'Young adult with normal creatinine', B: 'Older adult with decreased eGFR', C: 'Patient with increased appetite', D: 'Patient taking medication with food' },
      correctAnswer: 'B',
      rationale: 'Reduced renal function slows elimination → accumulation and toxicity.'
    },
    {
      questionNumber: 7,
      type: 'multiple_choice',
      question: 'Which concept explains why highly perfused organs receive medication sooner?',
      options: { A: 'Protein binding', B: 'Blood flow', C: 'First-pass metabolism', D: 'Excretion' },
      correctAnswer: 'B',
      rationale: 'Distribution is influenced by perfusion; high blood flow delivers drug faster.'
    },
    {
      questionNumber: 8,
      type: 'multiple_choice',
      question: 'A loading dose is most useful when:',
      options: { A: 'A drug has a long half-life and you need rapid therapeutic levels', B: 'A drug is eliminated very quickly', C: 'A drug has zero protein binding', D: 'A drug is only topical' },
      correctAnswer: 'A',
      rationale: 'Loading doses help reach target concentration faster when half-life is long.'
    },
    {
      questionNumber: 9,
      type: 'multiple_choice',
      question: 'Which statement about lipid-soluble drugs is most accurate?',
      options: { A: 'They distribute poorly into tissues', B: 'They may store in adipose tissue and persist longer', C: 'They cannot cross cell membranes', D: 'They are always eliminated unchanged by kidneys' },
      correctAnswer: 'B',
      rationale: 'Lipid-soluble drugs can distribute widely and may remain longer in fat stores.'
    },
    {
      questionNumber: 10,
      type: 'multiple_choice',
      question: 'Which is the best nursing action when a medication order seems unsafe due to organ impairment?',
      options: { A: 'Give the dose and document', B: 'Hold the dose and clarify with the prescriber/pharmacy', C: 'Ask the patient what they want', D: 'Double the dose to ensure effect' },
      correctAnswer: 'B',
      rationale: 'Patient safety: hold and clarify when contraindications or dose adjustments may be needed.'
    },
  ];

  const glossarySection = {
    sectionNumber: 9,
    id: 'sec2_9_key_terms_glossary',
    title: 'Section 2.9: Key Terms Glossary',
    duration: 20,
    wordCount: 0,
    learningObjectives: [],
    keyTakeaways: [],
    contentBlocks: [
      {
        blockId: 'ch2_glossary',
        type: 'glossary',
        title: 'Pharmacokinetics Terms A–Z',
        terms: keyTerms,
      },
    ],
    flashcardLinks: [],
    interactiveElements: [],
    content: 'Key Terms and Glossary',
  };

  const reviewSection = {
    sectionNumber: 10,
    id: 'sec2_10_review_questions',
    title: 'Section 2.10: Review Questions & Assessment',
    duration: 25,
    wordCount: 0,
    learningObjectives: [],
    keyTakeaways: [],
    contentBlocks: [
      {
        blockId: 'ch2_review',
        type: 'assessment_section',
        title: 'Review Questions',
        questions: reviewQuestions,
      },
    ],
    flashcardLinks: [],
    interactiveElements: [],
    content: 'Review Questions & Assessment',
  };

  const referencesSection = {
    sectionNumber: null,
    id: 'ch2_references',
    title: 'References',
    duration: 10,
    wordCount: 0,
    learningObjectives: [],
    keyTakeaways: [],
    contentBlocks: [],
    flashcardLinks: [],
    interactiveElements: [],
    content:
      'REFERENCES\n\nOpenStax. (2019). Pharmacology for Nurses (Nursing Pharmacology). OpenStax, Rice University.\n\nLilley, L. L., Collins, S. R., & Snyder, J. S. (2020). Pharmacology and the Nursing Process (9th ed.). Elsevier.\n\nLehne, R. A. (2021). Pharmacology for Nursing Care (11th ed.). Elsevier.',
  };

  const json = {
    chapter: {
      metadata: {
        chapterNumber: 2,
        chapterId: 'ch2_pharmacokinetics',
        title: 'Chapter 2: Pharmacokinetics',
        subtitle: 'The Journey of a Drug Through the Body',
        estimatedTimeMinutes: 180,
      },
      learningOutcomes: [],
      sections: [...sections, glossarySection, reviewSection, referencesSection],
      mediaAssets: {
        videos: [],
        images: [],
      },
    },
  };

  fs.writeFileSync(OUT_JSON, JSON.stringify(json, null, 2));
  console.log('Wrote:', OUT_JSON);
  console.log('Sections:', sections.length, 'Total words:', sections.reduce((a, s) => a + (s.wordCount || 0), 0));
}

main();
