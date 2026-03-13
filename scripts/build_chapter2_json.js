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
  return String(md)
    .replace(/^#+\s+/gm, '') // remove markdown heading markers
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1') // italics
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^>\s?/gm, '') // blockquotes
    .replace(/\r\n/g, '\n')
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

  const sections = [];
  for (let i = 0; i < hits.length; i += 1) {
    const cur = hits[i];
    const next = hits[i + 1];
    const start = md.indexOf('\n', cur.idx) + 1;
    const end = next ? next.idx : md.length;
    const rawBody = md.slice(start, end).trim();

    const id = SECTION_ID_MAP[cur.num] || `sec2_${cur.num.replace('.', '_')}`;
    const title = `Section ${cur.num}: ${cur.titleRest}`;

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
      sections,
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
