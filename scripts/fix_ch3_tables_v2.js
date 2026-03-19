#!/usr/bin/env node

/**
 * Convert Chapter 3 tables that were imported as:
 *   <h4>Table 3-x. ...</h4>
 *   <h4>Header A</h4><h4>Header B</h4>...
 *   <p>cell</p><p>cell</p>...
 * Into proper <table> HTML.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'CHAPTER_3_UNAVIDA_PRODUCTION.json');

const STOP_HEADING_RE = /^\s*(\d+\.\d+|References\b|Key Nursing Actions\b)/i;

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function stripTags(s) {
  return String(s || '').replace(/<[^>]+>/g, '');
}

function wc(html) {
  const t = stripTags(html).replace(/\s+/g, ' ').trim();
  return t ? t.split(' ').length : 0;
}

function makeTable(titleHtml, headers, cells) {
  // Decide columns
  let colCount = headers.length;
  let hdr = headers.slice();

  // Many of these tables omit the first column header (e.g., drug/class)
  if (cells.length % (headers.length + 1) === 0) {
    colCount = headers.length + 1;
    hdr = ['Drug/Class', ...hdr];
  } else if (cells.length % headers.length === 0) {
    colCount = headers.length;
  } else if (cells.length % 4 === 0) {
    colCount = 4;
    // If we only have 2-3 headers, pad with a generic first column.
    while (hdr.length < colCount) hdr = ['Category', ...hdr];
  }

  const rem = cells.length % colCount;
  if (rem !== 0) {
    cells = cells.concat(Array(colCount - rem).fill(''));
  }

  const rows = [];
  for (let i = 0; i < cells.length; i += colCount) rows.push(cells.slice(i, i + colCount));

  const thead = `<thead><tr>${hdr.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>`;
  const tbody = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;

  return `${titleHtml}\n<table>${thead}${tbody}</table>`;
}

function transform(html) {
  let changed = false;

  // Walk through the HTML sequentially by splitting on <h4>
  // Simpler: regex match a Table header and then parse until the next stopping heading.
  const re = /(<h4>\s*Table\s+\d+-\d+\.[\s\S]*?<\/h4>)([\s\S]*?)(?=<h4>\s*(?:\d+\.\d+|References\b|Key Nursing Actions\b)|$)/gi;

  const out = html.replace(re, (match, tableTitle, tail) => {
    // Extract consecutive h4 headers at start of tail
    const headerRe = /^\s*(?:<h4>([\s\S]*?)<\/h4>\s*)+/i;
    const headerMatch = tail.match(headerRe);
    if (!headerMatch) return match;

    // Pull all h4 texts from that header region
    const headerRegion = headerMatch[0];
    const hdrTexts = [];
    const hdrEach = /<h4>([\s\S]*?)<\/h4>/gi;
    let hm;
    while ((hm = hdrEach.exec(headerRegion))) {
      const t = stripTags(hm[1]).replace(/\s+/g, ' ').trim();
      if (t && !STOP_HEADING_RE.test(t)) hdrTexts.push(t);
    }

    // Remaining content after header region
    const rest = tail.slice(headerRegion.length);

    // Stop if next heading looks like a new section (3.x) and there are too few cells
    const cellTexts = [];
    const pEach = /<p>([\s\S]*?)<\/p>/gi;
    let pm;
    while ((pm = pEach.exec(rest))) {
      const t = stripTags(pm[1]).replace(/\s+/g, ' ').trim();
      if (t) cellTexts.push(t);
    }

    if (hdrTexts.length < 1 || cellTexts.length < (hdrTexts.length + 2)) return match;

    const newBlock = makeTable(tableTitle.trim(), hdrTexts, cellTexts);
    changed = true;
    return newBlock;
  });

  return { html: out, changed };
}

function main() {
  const json = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  let any = false;

  for (const sec of json.chapter.sections || []) {
    const res = transform(sec.content || '');
    if (res.changed) {
      sec.content = res.html;
      sec.wordCount = wc(sec.content);
      any = true;
    }
  }

  if (any) {
    json.chapter.metadata.wordCount = (json.chapter.sections || []).reduce((n, s) => n + (s.wordCount || 0), 0);
    json.chapter.metadata.lastUpdated = new Date().toISOString().slice(0, 10);
    fs.writeFileSync(FILE, JSON.stringify(json, null, 2) + '\n');
    console.log('Converted Chapter 3 tables to HTML tables.');
  } else {
    console.log('No convertible tables found.');
  }
}

main();
