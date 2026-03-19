#!/usr/bin/env node

/**
 * Convert "pseudo-tables" that were imported as sequences of <p> lines into real <table> HTML.
 *
 * Pattern handled:
 *   <h4>Table X-Y. ...</h4>
 *   <p>Header A</p><p>Header B</p><p>Header C</p>
 *   <p>Row1Col1</p><p>Row1Col2</p>...
 *   ... until next <h4> (section heading) or next table.
 *
 * Heuristic:
 * - Assume 3 headers after the title.
 * - If remaining cell count is divisible by 4 (but not by 3), prepend a 4th header "Drug/Class".
 * - Choose column count as 4 if possible, else 3.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'CHAPTER_3_UNAVIDA_PRODUCTION.json');

function stripTags(s) {
  return String(s || '').replace(/<[^>]+>/g, '');
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function makeTable(titleHtml, cells) {
  // cells: array of plain strings
  if (cells.length < 6) return null;

  let headers = cells.slice(0, 3);
  let rest = cells.slice(3);

  let colCount = 3;
  if (rest.length % 4 === 0) {
    colCount = 4;
    headers = ['Drug/Class', ...headers];
  } else if (rest.length % 3 === 0) {
    colCount = 3;
  } else if (rest.length % 4 === 0) {
    colCount = 4;
  } else {
    // last resort: try 4 then 3
    colCount = rest.length % 4 < rest.length % 3 ? 4 : 3;
  }

  // Pad rest if needed to complete rows
  const rem = rest.length % colCount;
  if (rem !== 0) {
    rest = rest.concat(Array(colCount - rem).fill(''));
  }

  const rows = [];
  for (let i = 0; i < rest.length; i += colCount) {
    rows.push(rest.slice(i, i + colCount));
  }

  const head = `<thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>`;
  const body = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>`;

  // Keep the title as an <h4> above the table.
  return `${titleHtml}\n<table>${head}${body}</table>`;
}

function fixHtml(html) {
  let changed = false;

  // Iterate through table blocks.
  // Capture: title h4 + following p tags until next h4.
  const re = /(<h4>\s*Table\s+\d+-\d+\.[\s\S]*?<\/h4>)([\s\S]*?)(?=<h4>|$)/gi;

  const out = html.replace(re, (m, title, following) => {
    // collect all immediate <p>...</p> in following
    const pRe = /<p>([\s\S]*?)<\/p>/gi;
    const cells = [];
    let pm;
    while ((pm = pRe.exec(following))) {
      const t = stripTags(pm[1]).replace(/\s+/g, ' ').trim();
      if (t) cells.push(t);
    }

    // Need at least 3 headers + 1 row
    if (cells.length < 7) return m;

    const tableHtml = makeTable(title.trim(), cells);
    if (!tableHtml) return m;

    changed = true;
    return tableHtml;
  });

  return { html: out, changed };
}

function wc(html) {
  const t = stripTags(html).replace(/\s+/g, ' ').trim();
  return t ? t.split(' ').length : 0;
}

function main() {
  const json = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  let any = false;

  for (const sec of json.chapter.sections || []) {
    const res = fixHtml(sec.content || '');
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
    console.log('Fixed pseudo-tables in Chapter 3.');
  } else {
    console.log('No pseudo-tables detected.');
  }
}

main();
