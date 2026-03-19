#!/usr/bin/env node

/**
 * Export UnaVida Chapter 1 + Chapter 2 JSON into a single Markdown document for editing/redrafting.
 * - Preserves section titles, learning objectives, key takeaways.
 * - Writes section.content as-is.
 * - Appends any contentBlocks (title + content + htmlReady).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'exports', 'UNAVIDA_CH1_CH2_FULL_CONTENT.md');

const CH1 = path.join(ROOT, 'src', 'data', 'CHAPTER_1_UNAVIDA_PRODUCTION.json');
const CH2 = path.join(ROOT, 'src', 'data', 'CHAPTER_2_UNAVIDA_PRODUCTION.json');

function mdEscape(s) {
  return String(s ?? '').replace(/\r\n/g, '\n');
}

function renderList(items) {
  if (!items || !items.length) return '';
  return items.map((x) => `- ${mdEscape(x)}`).join('\n') + '\n';
}

function renderChapter(json) {
  const meta = json?.chapter?.metadata || {};
  const sections = json?.chapter?.sections || [];

  let out = '';
  out += `# ${mdEscape(meta.title || 'Chapter')}\n\n`;
  if (meta.subtitle) out += `**${mdEscape(meta.subtitle)}**\n\n`;
  const metaLines = [];
  if (meta.courseCode || meta.courseName) metaLines.push(`Course: ${[meta.courseCode, meta.courseName].filter(Boolean).join(' — ')}`);
  if (meta.textbookReference) metaLines.push(`Reference: ${meta.textbookReference}`);
  if (meta.wordCount) metaLines.push(`Original word count (metadata): ${meta.wordCount}`);
  if (meta.lastUpdated) metaLines.push(`Last updated: ${meta.lastUpdated}`);
  if (metaLines.length) out += metaLines.map((l) => `_${mdEscape(l)}_`).join('\n') + '\n\n';

  for (const sec of sections) {
    out += `---\n\n`;
    out += `## ${mdEscape(sec.title || sec.id || 'Section')}\n\n`;
    if (sec.sectionNumber) out += `**Section Number:** ${mdEscape(sec.sectionNumber)}\n\n`;

    if (sec.learningObjectives?.length) {
      out += `### Learning Objectives\n`;
      out += renderList(sec.learningObjectives) + '\n';
    }

    if (sec.keyTakeaways?.length) {
      out += `### Key Takeaways\n`;
      out += renderList(sec.keyTakeaways) + '\n';
    }

    if (sec.content) {
      out += `### Content\n\n`;
      out += `${mdEscape(sec.content).trim()}\n\n`;
    }

    if (sec.contentBlocks?.length) {
      out += `### Content Blocks\n\n`;
      sec.contentBlocks.forEach((b, idx) => {
        out += `#### Block ${idx + 1}${b.title ? `: ${mdEscape(b.title)}` : ''}\n\n`;
        if (b.content) out += `${mdEscape(b.content).trim()}\n\n`;
        if (b.htmlReady) {
          out += `**HTML (as rendered in site):**\n\n`;
          out += `${mdEscape(b.htmlReady).trim()}\n\n`;
        }
      });
    }
  }

  out += '\n';
  return out;
}

function main() {
  const ch1 = JSON.parse(fs.readFileSync(CH1, 'utf8'));
  const ch2 = JSON.parse(fs.readFileSync(CH2, 'utf8'));

  const md = [
    '# UnaVida — Chapter 1 + Chapter 2 (Full Export)\n',
    '_Generated from frontend JSON so you can rewrite/redraft content._\n\n',
    renderChapter(ch1),
    renderChapter(ch2),
  ].join('\n');

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, md);
  console.log('Wrote:', OUT);
}

main();
