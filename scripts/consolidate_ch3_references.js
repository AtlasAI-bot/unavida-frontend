#!/usr/bin/env node

/**
 * Consolidate all per-section "References" blocks into a single chapter-end references list.
 *
 * - Extracts content between <h4>References</h4> and the next <h4> that starts a new subsection
 *   (or end of section).
 * - Removes those blocks from each section.
 * - Appends a single "References" block to the end of Section 3.7.
 * - Deduplicates references (normalized whitespace) while preserving first-seen order.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'CHAPTER_3_UNAVIDA_PRODUCTION.json');

function stripTags(s) {
  return String(s || '').replace(/<[^>]+>/g, '');
}

function normalizeRef(s) {
  return stripTags(s)
    .replace(/\s+/g, ' ')
    .replace(/\s*\.(\s*)/g, '. ')
    .trim();
}

function splitRefs(text) {
  // Try to split concatenated citations by detecting ") " or ". " followed by capital letter.
  // Fallback to splitting on period boundaries while keeping abbreviations reasonably intact.
  const t = String(text || '').replace(/\s+/g, ' ').trim();
  if (!t) return [];

  // If there are newline-like separators, use them.
  const byNewline = t.split(/\s*\n\s*/).map(x => x.trim()).filter(Boolean);
  if (byNewline.length > 1) return byNewline;

  // Split on pattern: ". " followed by Capital letter, or ") " followed by Capital
  const parts = t
    .replace(/\)\s+(?=[A-Z])/g, ')\n')
    .replace(/\.\s+(?=[A-Z])/g, '.\n')
    .split('\n')
    .map(x => x.trim())
    .filter(Boolean);

  return parts.length ? parts : [t];
}

function removeAndCollect(html) {
  const collected = [];
  let changed = false;

  // Match references header and following content up to next <h4> that looks like a new subsection
  // or end of string.
  const re = /<h4>\s*References\s*<\/h4>\s*([\s\S]*?)(?=<h4>\s*(?:\d+\.\d+|Clinical Differentiation\b|Severity Triage\b|Key Nursing Actions\b|Table\s+\d+-\d+\.|$)|$)/gi;

  const out = String(html || '').replace(re, (m, body) => {
    const plain = normalizeRef(body);
    if (plain) {
      const refs = splitRefs(plain);
      for (const r of refs) if (r) collected.push(r);
    }
    changed = true;
    return ''; // remove the block
  });

  return { html: out.replace(/\n{3,}/g, '\n\n').trim(), collected, changed };
}

function htmlList(items) {
  const esc = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return `<ul>\n${items.map(i => `  <li>${esc(i)}</li>`).join('\n')}\n</ul>`;
}

function main() {
  const json = JSON.parse(fs.readFileSync(FILE, 'utf8'));

  const seen = new Set();
  const all = [];
  let any = false;

  for (const sec of json.chapter.sections || []) {
    const res = removeAndCollect(sec.content || '');
    if (res.changed) {
      sec.content = res.html;
      any = true;
    }
    for (const r of res.collected) {
      const key = r.toLowerCase().replace(/\s+/g, ' ').trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      all.push(r);
    }
  }

  // Append consolidated references to end of section 3.7
  const endSec = (json.chapter.sections || []).find(s => s.sectionNumber === '3.7') || (json.chapter.sections || []).slice(-1)[0];
  if (!endSec) throw new Error('No end section found');

  // Remove any existing consolidated references to avoid duplication
  endSec.content = String(endSec.content || '').replace(/<h4>\s*Chapter References\s*<\/h4>[\s\S]*$/i, '').trim();

  if (all.length) {
    endSec.content = `${endSec.content}\n\n<h4>Chapter References</h4>\n${htmlList(all)}\n`;
    any = true;
  }

  if (any) {
    // Wordcount update
    const strip = (s) => stripTags(s).replace(/\s+/g, ' ').trim();
    for (const sec of json.chapter.sections || []) {
      sec.wordCount = strip(sec.content).split(' ').filter(Boolean).length;
    }
    json.chapter.metadata.wordCount = (json.chapter.sections || []).reduce((n, s) => n + (s.wordCount || 0), 0);
    json.chapter.metadata.lastUpdated = new Date().toISOString().slice(0, 10);

    fs.writeFileSync(FILE, JSON.stringify(json, null, 2) + '\n');
    console.log('Consolidated references. Total unique refs:', all.length);
  } else {
    console.log('No references blocks found.');
  }
}

main();
