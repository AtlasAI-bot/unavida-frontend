#!/usr/bin/env node

/**
 * Sanitizes markdown-ish artifacts from chapter JSON content.
 * Targets headings (###), bold (**), horizontal rules (--- / - - -), and labels like "(section summary)".
 */

const fs = require('fs');

const TABLE_SEP_RE = /^\|?\s*[:\-\s\|]+\|?\s*$/; // pipe-table separator row
const HR_RE = /^\s*-{3,}\s*$/; // ---
const DASH_SPACED_RE = /^\s*(?:-\s*){3,}\s*$/; // - - -
const LONG_DASH_RE = /^\s*-{10,}\s*$/; // ----------

function looksLikeHtml(s) {
  // Heuristic: contains at least one tag-looking pattern.
  return /<\/?[a-z][\s\S]*?>/i.test(s);
}

function looksLikeUrl(s) {
  return /^https?:\/\//i.test(s) || /^data:/i.test(s);
}

function sanitizeText(input) {
  if (typeof input !== 'string') return input;
  if (!input) return input;
  if (looksLikeUrl(input)) return input;
  if (looksLikeHtml(input)) return input;

  let s = input;

  // Fast global replacements
  s = s.replace(/\*\*([^*]+)\*\*/g, '$1'); // bold
  s = s.replace(/__([^_]+)__/g, '$1'); // underline-style bold
  s = s.replace(/\(\s*section\s+summary\s*\)/gi, '');

  const lines = s.split('\n');
  const out = [];

  for (let line of lines) {
    const raw = line;
    let l = line.trimEnd();

    // Drop horizontal rule lines (but keep pipe-table separators)
    const trimmed = l.trim();
    const hasPipe = trimmed.includes('|');
    const isTableSep = hasPipe && TABLE_SEP_RE.test(trimmed);
    const isHr = !hasPipe && (HR_RE.test(trimmed) || DASH_SPACED_RE.test(trimmed) || LONG_DASH_RE.test(trimmed));
    if (isHr && !isTableSep) continue;

    // Strip markdown headings
    l = l.replace(/^\s*#{1,6}\s+/, '');

    // Remove stray emphasis markers that occasionally appear as standalone tokens
    l = l.replace(/\*\*/g, '');

    // Clean repeated divider text made of underscores, etc.
    l = l.replace(/^\s*_{3,}\s*$/g, '');

    // If the line became empty, keep as blank to preserve paragraph breaks.
    out.push(l);
  }

  // Collapse 3+ blank lines to max 2
  let joined = out.join('\n');
  joined = joined.replace(/\n{3,}/g, '\n\n');

  // Trim just the ends
  joined = joined.trim();

  return joined;
}

function sanitizeJson(obj, path = '') {
  if (obj == null) return obj;
  if (typeof obj === 'string') return sanitizeText(obj);
  if (Array.isArray(obj)) return obj.map((v, i) => sanitizeJson(v, `${path}[${i}]`));
  if (typeof obj !== 'object') return obj;

  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    // Never touch htmlReady (should already be valid HTML or empty)
    if (k === 'htmlReady') {
      out[k] = v;
      continue;
    }
    out[k] = sanitizeJson(v, path ? `${path}.${k}` : k);
  }
  return out;
}

function run(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const json = JSON.parse(raw);
  const sanitized = sanitizeJson(json);
  fs.writeFileSync(filePath, JSON.stringify(sanitized, null, 2) + '\n');
}

const files = process.argv.slice(2);
if (!files.length) {
  console.error('Usage: node scripts/sanitize_chapter_text.js <file1.json> <file2.json>');
  process.exit(1);
}

for (const f of files) run(f);
console.log('Sanitized:', files.join(', '));
