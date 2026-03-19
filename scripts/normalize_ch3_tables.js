#!/usr/bin/env node

/**
 * Normalize Chapter 3 HTML tables produced by conversion scripts.
 * Fixes common misalignment where a 4-column table was inferred as 3 columns
 * and/or a trailing narrative sentence was mistakenly included as a final cell.
 */

const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'data', 'CHAPTER_3_UNAVIDA_PRODUCTION.json');

function stripTags(s) {
  return String(s || '').replace(/<[^>]+>/g, '');
}

function wc(html) {
  const t = stripTags(html).replace(/\s+/g, ' ').trim();
  return t ? t.split(' ').length : 0;
}

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseTable(tableHtml) {
  const th = [];
  const td = [];
  const thRe = /<th>([\s\S]*?)<\/th>/gi;
  const tdRe = /<td>([\s\S]*?)<\/td>/gi;
  let m;
  while ((m = thRe.exec(tableHtml))) th.push(stripTags(m[1]).replace(/\s+/g, ' ').trim());
  while ((m = tdRe.exec(tableHtml))) td.push(stripTags(m[1]).replace(/\s+/g, ' ').trim());
  return { headers: th.filter(Boolean), cells: td.filter(Boolean) };
}

function buildTable(headers, cells, note) {
  const thead = `<thead><tr>${headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>`;
  const rows = [];
  const colCount = headers.length;
  for (let i = 0; i < cells.length; i += colCount) rows.push(cells.slice(i, i + colCount));
  const tbody = `<tbody>${rows.map(r => `<tr>${r.map(c => `<td>${esc(c || '')}</td>`).join('')}</tr>`).join('')}</tbody>`;
  const t = `<table>${thead}${tbody}</table>`;
  return note ? `${t}\n<p>${esc(note)}</p>` : t;
}

function normalize(headers, cells) {
  let note = '';

  // If last cell looks like narrative, peel it off.
  if (cells.length > 8) {
    const last = cells[cells.length - 1];
    if (last.length > 90 && /\.$/.test(last)) {
      // Only peel if doing so makes a clean grid
      const tryCells = cells.slice(0, -1);
      if (headers.length && (tryCells.length % 4 === 0 || tryCells.length % headers.length === 0)) {
        note = last;
        cells = tryCells;
      }
    }
  }

  // If we have 3 headers but the data fits a 4-column grid, upgrade.
  if (headers.length === 3) {
    if (cells.length % 4 === 0) {
      headers = ['Drug/Class', ...headers];
    } else if (cells.length % 4 === 1) {
      // common pattern: one trailing narrative cell got included but not peeled (shorter note)
      const last = cells[cells.length - 1];
      const tryCells = cells.slice(0, -1);
      if (tryCells.length % 4 === 0) {
        note = note || last;
        cells = tryCells;
        headers = ['Drug/Class', ...headers];
      }
    }
  }

  // If headers length is 1 or 2, try to infer 2-column tables.
  if (headers.length === 1 && cells.length % 2 === 0) {
    headers = [headers[0], 'Notes'];
  }

  const colCount = headers.length;
  const rem = cells.length % colCount;
  if (rem !== 0) {
    // Pad to complete last row.
    cells = cells.concat(Array(colCount - rem).fill(''));
  }

  return { headers, cells, note };
}

function processHtml(html) {
  let changed = false;

  const re = /<table>[\s\S]*?<\/table>(?:\s*<p>[\s\S]*?<\/p>)?/gi;

  const out = String(html || '').replace(re, (m) => {
    const { headers, cells } = parseTable(m);
    if (!headers.length || !cells.length) return m;

    const norm = normalize(headers, cells);
    const rebuilt = buildTable(norm.headers, norm.cells, norm.note);
    if (rebuilt !== m) changed = true;
    return rebuilt;
  });

  return { html: out, changed };
}

function main() {
  const json = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  let any = false;

  for (const sec of json.chapter.sections || []) {
    const res = processHtml(sec.content || '');
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
    console.log('Normalized Chapter 3 tables.');
  } else {
    console.log('No table changes.');
  }
}

main();
