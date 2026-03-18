#!/usr/bin/env node

/**
 * Cleanup Chapter 3 content tone and remove dev-ish / conversational phrasing.
 * Also deduplicate accidental repeated blocks (notably 'Clinical reasoning drill').
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'CHAPTER_3_UNAVIDA_PRODUCTION.json');

function applyReplacements(s) {
  let t = String(s);

  // Replace jargon/conversational phrasing
  const reps = [
    [/\bMAR\b/g, 'medication administration record (MAR)'],
    [/\bSBAR\b/g, 'SBAR (Situation–Background–Assessment–Recommendation)'],
    [/Public service announcement:\s*/gi, 'Important: '],
    [/\b(vibes)\b/gi, 'impressions'],
    [/\bname the antidote\b/gi, 'select an antidote'],
    [/\bgame\b/gi, 'approach'],
    [/\bmystical\b/gi, 'unexplained'],
    [/\bsuperpower\b/gi, 'core skill'],
    [/don\’t negotiate with the medication schedule/gi, 'do not continue scheduled dosing in an unsafe situation'],
    [/This is “treat now” medicine\./gi, 'This requires immediate treatment.'],
    [/the clinical version of “their body did something weird\.”/gi, 'an uncommon clinical pattern that should be documented and reported.'],
  ];
  for (const [a, b] of reps) t = t.replace(a, b);

  // Fix double-expansion: some phrases become repeated like 'medication administration record (MAR)'.
  // Collapse duplicated '(MAR)' expansions.
  t = t.replace(/medication administration record \(MAR\)\s*administration record \(MAR\)/gi, 'medication administration record (MAR)');

  return t;
}

function dedupeRepeatedBlocks(s) {
  let t = String(s);

  // Remove repeated identical paragraphs starting with "Clinical reasoning drill (textbook extension)"
  // Keep the first occurrence of each distinct drill paragraph.
  const marker = 'Clinical reasoning drill (textbook extension)';
  if (!t.includes(marker)) return t;

  const parts = t.split('\n');
  const out = [];
  const seen = new Set();

  for (let i = 0; i < parts.length; i++) {
    const line = parts[i];
    if (line.startsWith(marker)) {
      // capture the whole paragraph block until blank line
      let j = i;
      const buf = [];
      while (j < parts.length) {
        buf.push(parts[j]);
        if (j + 1 < parts.length && parts[j + 1].trim() === '') {
          // include the blank line and stop
          buf.push(parts[j + 1]);
          j += 2;
          break;
        }
        j++;
      }
      const block = buf.join('\n');
      const key = block.replace(/\s+/g, ' ').trim();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(...buf);
      }
      i = j - 1;
      continue;
    }
    out.push(line);
  }

  // Collapse too many blank lines
  t = out.join('\n').replace(/\n{3,}/g, '\n\n');
  return t;
}

function main() {
  const json = JSON.parse(fs.readFileSync(FILE, 'utf8'));

  for (const sec of json.chapter.sections || []) {
    if (sec.content) {
      let c = sec.content;
      c = applyReplacements(c);
      c = dedupeRepeatedBlocks(c);
      // Clean any excessive repeated expansions
      c = c.replace(/\(Situation–Background–Assessment–Recommendation\) \(Situation–Background–Assessment–Recommendation\)/g, '(Situation–Background–Assessment–Recommendation)');
      sec.content = c;
    }

    for (const b of (sec.contentBlocks || [])) {
      if (b.title) b.title = applyReplacements(b.title);
      if (b.content) b.content = applyReplacements(b.content);
      if (b.htmlReady) b.htmlReady = applyReplacements(b.htmlReady);
    }
  }

  fs.writeFileSync(FILE, JSON.stringify(json, null, 2) + '\n');
  console.log('Chapter 3 cleanup complete.');
}

main();
