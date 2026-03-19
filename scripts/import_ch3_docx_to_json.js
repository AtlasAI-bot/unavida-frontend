#!/usr/bin/env node

/**
 * Import user-provided Chapter 3 DOCX into CHAPTER_3_UNAVIDA_PRODUCTION.json.
 *
 * - Extracts paragraphs + headings + tables from word/document.xml (no external deps).
 * - Converts to simple HTML that the ChapterReader can render.
 * - Splits content into 7 main sections by locating headings starting with:
 *   3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 * - Writes section.content as HTML (paragraphs, h4, tables).
 *
 * NOTE: This is a best-effort converter. For complex DOCX styling it may need tweaks.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO = path.join(__dirname, '..');
const JSON_PATH = path.join(REPO, 'src', 'data', 'CHAPTER_3_UNAVIDA_PRODUCTION.json');
const DOCX = process.argv[2];

if (!DOCX) {
  console.error('Usage: node scripts/import_ch3_docx_to_json.js /path/to/Chapter3.docx');
  process.exit(1);
}

function readDocumentXml(docxPath) {
  const cmd = `unzip -p "${docxPath.replace(/"/g, '\\"')}" word/document.xml`;
  return execSync(cmd, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
}

function decodeXmlEntities(s) {
  return s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x2013;/g, '–')
    .replace(/&#x2014;/g, '—')
    .replace(/&#x00A0;/g, ' ');
}

function stripTags(s) {
  return s.replace(/<[^>]+>/g, '');
}

function extractTextFromTc(tcXml) {
  // Pull all <w:t> including those broken across runs.
  const parts = [];
  const re = /<w:t(?: [^>]*)?>([\s\S]*?)<\/w:t>/g;
  let m;
  while ((m = re.exec(tcXml))) {
    parts.push(decodeXmlEntities(m[1]));
  }
  return parts.join('')
    .replace(/\s+/g, ' ')
    .trim();
}

function paragraphText(pXml) {
  const parts = [];
  const re = /<w:t(?: [^>]*)?>([\s\S]*?)<\/w:t>/g;
  let m;
  while ((m = re.exec(pXml))) parts.push(decodeXmlEntities(m[1]));
  return parts.join('');
}

function isBoldParagraph(pXml) {
  // crude: detect <w:b/> inside paragraph properties or run properties
  return /<w:b\/>/.test(pXml) || /<w:bCs\/>/.test(pXml);
}

function parseBodyToBlocks(xml) {
  // Split into paragraphs and tables in order.
  const bodyMatch = xml.match(/<w:body>[\s\S]*<\/w:body>/);
  const body = bodyMatch ? bodyMatch[0] : xml;

  const blocks = [];
  // Match top-level <w:p> and <w:tbl>
  const re = /<(w:p|w:tbl)(\s|>)[\s\S]*?<\/(w:p|w:tbl)>/g;
  let m;
  while ((m = re.exec(body))) {
    const raw = m[0];
    const kind = m[1];
    blocks.push({ kind: kind === 'w:p' ? 'p' : 'tbl', raw });
  }
  return blocks;
}

function tableToHtml(tblXml) {
  const rowRe = /<w:tr[\s\S]*?<\/w:tr>/g;
  const rows = [];
  let rm;
  while ((rm = rowRe.exec(tblXml))) rows.push(rm[0]);

  const grid = rows.map((rowXml) => {
    const cellRe = /<w:tc[\s\S]*?<\/w:tc>/g;
    const cells = [];
    let cm;
    while ((cm = cellRe.exec(rowXml))) {
      const cellXml = cm[0];
      cells.push(extractTextFromTc(cellXml));
    }
    return cells;
  }).filter(r => r.some(c => c));

  if (!grid.length) return '';

  // Heuristic: first row is header if any cell is in a row marked tblHeader OR if all cells are short.
  const headerRow = grid[0];
  const hasHeaderFlag = /<w:tblHeader\/>/.test(rows[0] || '');
  const looksHeader = hasHeaderFlag || headerRow.every(c => c.length <= 30);

  const esc = (s) => String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  let html = '<table>';
  if (looksHeader && grid.length > 1) {
    html += '<thead><tr>' + headerRow.map(c => `<th>${esc(c)}</th>`).join('') + '</tr></thead>';
    html += '<tbody>';
    for (const row of grid.slice(1)) {
      html += '<tr>' + row.map(c => `<td>${esc(c)}</td>`).join('') + '</tr>';
    }
    html += '</tbody>';
  } else {
    html += '<tbody>';
    for (const row of grid) {
      html += '<tr>' + row.map(c => `<td>${esc(c)}</td>`).join('') + '</tr>';
    }
    html += '</tbody>';
  }
  html += '</table>';
  return html;
}

function blocksToHtml(blocks) {
  const html = [];

  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];

    if (b.kind === 'p') {
      const text = paragraphText(b.raw).replace(/\s+/g, ' ').trim();
      if (!text) continue;

      // Identify headings like "3.5.2 Drug-Induced Sodium Imbalance" or "Introduction"
      const bold = isBoldParagraph(b.raw);
      const isNumberedHeading = /^\d+\.\d+(?:\.\d+)?\s+/.test(text);

      if (bold && (isNumberedHeading || text.length < 80)) {
        html.push(`<h4>${text}</h4>`);
      } else {
        html.push(`<p>${text}</p>`);
      }
    }

    if (b.kind === 'tbl') {
      const t = tableToHtml(b.raw);
      if (t) html.push(t);
    }
  }

  return html.join('\n');
}

function splitByMainSections(fullHtml) {
  // Split by main section headers <h4>3.1 ...</h4> etc.
  const markers = ['3.1', '3.2', '3.3', '3.4', '3.5', '3.6', '3.7'];
  const parts = {};

  // Find indices
  const idx = {};
  for (const m of markers) {
    const re = new RegExp(`<h4>${m.replace('.', '\\.')}(?:[^<]*)<\\/h4>`, 'i');
    const match = fullHtml.match(re);
    idx[m] = match ? fullHtml.indexOf(match[0]) : -1;
  }

  // Order present
  const present = markers.filter(m => idx[m] >= 0).sort((a,b) => idx[a]-idx[b]);
  for (let i=0;i<present.length;i++) {
    const m = present[i];
    const start = idx[m];
    const end = i+1<present.length ? idx[present[i+1]] : fullHtml.length;
    parts[m] = fullHtml.slice(start, end).trim();
  }

  return parts;
}

function wcFromHtml(html) {
  const text = stripTags(html).replace(/\s+/g, ' ').trim();
  return text ? text.split(' ').length : 0;
}

function main() {
  const xml = readDocumentXml(DOCX);
  const blocks = parseBodyToBlocks(xml);
  const fullHtml = blocksToHtml(blocks);
  const parts = splitByMainSections(fullHtml);

  const json = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  const map = {
    '3.1': 'ch3_1_adverse_effects',
    '3.2': 'ch3_2_organ_damage',
    '3.3': 'ch3_3_toxicity_overdose',
    '3.4': 'ch3_4_glucose',
    '3.5': 'ch3_5_electrolytes',
    '3.6': 'ch3_6_neuro_sensory',
    '3.7': 'ch3_7_teratogenicity',
  };

  for (const sec of json.chapter.sections) {
    const key = Object.entries(map).find(([,id]) => id === sec.id)?.[0];
    if (!key) continue;
    if (!parts[key]) {
      console.warn('WARN: missing content for', key, sec.id);
      continue;
    }

    sec.contentBlocks = []; // keep simple; tables embedded in content
    sec.content = parts[key];
    sec.wordCount = wcFromHtml(sec.content);
  }

  // Update chapter metadata wordcount
  const total = json.chapter.sections.reduce((n,s)=>n+(s.wordCount||0),0);
  json.chapter.metadata = {
    ...json.chapter.metadata,
    wordCount: total,
    lastUpdated: new Date().toISOString().slice(0,10),
    status: 'production_ready'
  };

  fs.writeFileSync(JSON_PATH, JSON.stringify(json, null, 2) + '\n');
  console.log('Imported DOCX into Chapter 3. Total words:', total);
}

main();
