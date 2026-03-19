#!/usr/bin/env node
/**
 * build-lessons-esv.js
 *
 * Builds lessons-esv.json from the PDF-extracted ESV text file.
 * Format in esv_extracted.txt: inline verse refs like "Gen 1:1 text Gen 1:2 text ..."
 * Only canonical books are included (no Apocrypha).
 *
 * Usage: node scripts/build-lessons-esv.js
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const ESV_PATH     = path.join(__dirname, '..', 'esv_extracted.txt');
const LECT_PATH    = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');
const OUT_PATH     = path.join(__dirname, '..', 'src', 'data', 'lessons-esv.json');

// ── ESV book code → VPL code ──────────────────────────────────────────────────
const ESV_CODE_MAP = {
  'Gen':'GEN','Exo':'EXO','Lev':'LEV','Num':'NUM','Deu':'DEU',
  'Jos':'JOS','Jdg':'JDG','Rut':'RUT','1Sa':'1SA','2Sa':'2SA',
  '1Ki':'1KI','2Ki':'2KI','1Ch':'1CH','2Ch':'2CH','Ezr':'EZR',
  'Neh':'NEH','Est':'EST','Job':'JOB','Psa':'PSA','Pro':'PRO',
  'Ecc':'ECC','Sol':'SOL','Isa':'ISA','Jer':'JER','Lam':'LAM',
  'Eze':'EZE','Dan':'DAN','Hos':'HOS','Joe':'JOE','Amo':'AMO',
  'Oba':'OBA','Jon':'JON','Mic':'MIC','Nah':'NAH','Hab':'HAB',
  'Zep':'ZEP','Hag':'HAG','Zec':'ZEC','Mal':'MAL',
  'Mat':'MAT','Mar':'MAR','Luk':'LUK','Joh':'JOH','Act':'ACT',
  'Rom':'ROM','1Co':'1CO','2Co':'2CO','Gal':'GAL','Eph':'EPH',
  'Phi':'PHI','Col':'COL','1Th':'1TH','2Th':'2TH','1Ti':'1TI',
  '2Ti':'2TI','Tit':'TIT','Phm':'PHM','Heb':'HEB','Jam':'JAM',
  '1Pe':'1PE','2Pe':'2PE','1Jo':'1JO','2Jo':'2JO','3Jo':'3JO',
  'Jud':'JUD','Rev':'REV',
};

const VALID_CODES = Object.keys(ESV_CODE_MAP);

// ── Step 1: Parse ESV text into index[VPL_CODE][ch][v] = text ─────────────────
console.log('Parsing ESV extracted text...');
const rawText = fs.readFileSync(ESV_PATH, 'utf8');

// Build a regex that matches any valid ESV book code followed by chapter:verse
// e.g. "Gen 1:1" or "1Sa 3:4"
// Sort longer codes first to prevent prefix-match issues (e.g. "1Ch" before "1Co")
const sortedCodes = [...VALID_CODES].sort((a, b) => b.length - a.length || a.localeCompare(b));
const codePattern = sortedCodes.join('|');
const verseRefRe  = new RegExp(`(${codePattern}) (\\d+):(\\d+)`, 'g');

// Use exec() loop to collect all match positions, then slice text between them.
// (Avoids split() edge cases with large alternations on very large strings.)
const matchList = [];
let m;
while ((m = verseRefRe.exec(rawText)) !== null) {
  matchList.push({ esvCode: m[1], ch: parseInt(m[2], 10), v: parseInt(m[3], 10),
                   start: m.index, end: m.index + m[0].length });
}

const index = {};
let verseCount = 0;

for (let i = 0; i < matchList.length; i++) {
  const r        = matchList[i];
  const textEnd  = i + 1 < matchList.length ? matchList[i + 1].start : rawText.length;
  const text     = rawText.slice(r.end, textEnd).trim().replace(/\s+/g, ' ');
  const vplCode  = ESV_CODE_MAP[r.esvCode];
  if (!vplCode) continue;

  if (!index[vplCode])         index[vplCode]        = {};
  if (!index[vplCode][r.ch])   index[vplCode][r.ch]  = {};
  index[vplCode][r.ch][r.v] = text;
  verseCount++;
}

console.log(`  Parsed ${verseCount} verses across ${Object.keys(index).length} books.`);

// ── Step 2: Reuse ref-parsing + lookup from KJV script ───────────────────────
// (copied verbatim so this script is self-contained)

const BOOK_CODE = {
  'Genesis':'GEN','Exodus':'EXO','Leviticus':'LEV','Numbers':'NUM',
  'Deuteronomy':'DEU','Joshua':'JOS','Judges':'JDG','Ruth':'RUT',
  '1 Samuel':'1SA','2 Samuel':'2SA','1 Kings':'1KI','2 Kings':'2KI',
  '1 Chronicles':'1CH','2 Chronicles':'2CH','Ezra':'EZR','Nehemiah':'NEH',
  'Esther':'EST','Job':'JOB','Psalms':'PSA','Psalm':'PSA','Proverbs':'PRO',
  'Ecclesiastes':'ECC','Song of Solomon':'SOL','Isaiah':'ISA','Jeremiah':'JER',
  'Lamentations':'LAM','Ezekiel':'EZE','Daniel':'DAN','Hosea':'HOS','Joel':'JOE',
  'Amos':'AMO','Obadiah':'OBA','Jonah':'JON','Micah':'MIC','Nahum':'NAH',
  'Habakkuk':'HAB','Zephaniah':'ZEP','Haggai':'HAG','Zechariah':'ZEC','Malachi':'MAL',
  'Matthew':'MAT','Mark':'MAR','Luke':'LUK','John':'JOH','Acts':'ACT','Romans':'ROM',
  '1 Corinthians':'1CO','2 Corinthians':'2CO','Galatians':'GAL','Ephesians':'EPH',
  'Philippians':'PHI','Colossians':'COL','1 Thessalonians':'1TH',
  '2 Thessalonians':'2TH','1 Timothy':'1TI','2 Timothy':'2TI','Titus':'TIT',
  'Philemon':'PHM','Hebrews':'HEB','James':'JAM','1 Peter':'1PE','2 Peter':'2PE',
  '1 John':'1JO','2 John':'2JO','3 John':'3JO','Jude':'JUD','Revelation':'REV',
  'Wisdom':'WIS','Sirach':'SIR','Ecclesiasticus':'SIR','Tobit':'TOB',
  'Judith':'JDT','Baruch':'BAR','1 Maccabees':'1MA','2 Maccabees':'2MA',
  '1 Esdras':'1ES','2 Esdras':'4ES',
  'Three Children':'PRA','Song of Three Children':'PRA',
};

const APOCRYPHA_CODES = new Set(['WIS','SIR','TOB','JDT','BAR','1MA','2MA','1ES','4ES','PRA']);
const SINGLE_CHAPTER  = new Set(['Obadiah','Philemon','2 John','3 John','Jude','Three Children']);

function chapterLength(code, ch) {
  const chData = index[code] && index[code][ch];
  if (!chData) return 0;
  return Math.max(...Object.keys(chData).map(Number));
}

function parseVerseSpec(book, ch, verseSpec, segments) {
  if (!verseSpec) { segments.push({ book, chapter: ch, verseStart: 1, verseEnd: Infinity }); return; }
  for (const range of verseSpec.split(',').map(r => r.trim())) {
    const dash   = range.match(/^(\d+)-(\d+)$/);
    const single = range.match(/^(\d+)$/);
    if (dash)   segments.push({ book, chapter: ch, verseStart: +dash[1],   verseEnd: +dash[2] });
    else if (single) { const v = +single[1]; segments.push({ book, chapter: ch, verseStart: v, verseEnd: v }); }
  }
}

function parseRef(refStr) {
  const segments = [];
  const parts = refStr.split(';').map(s => s.trim()).filter(Boolean);
  let lastBook = null;
  for (const part of parts) {
    const m1 = part.match(/^([1-9]?\s?[A-Za-z][A-Za-z ]*?)\s+(\d+):(.+)$/);
    if (m1) { lastBook = m1[1].trim(); parseVerseSpec(lastBook, +m1[2], m1[3].trim(), segments); continue; }
    const m2 = part.match(/^([1-9]?\s?[A-Za-z][A-Za-z ]*?)\s+(\d+)-(\d+)$/);
    if (m2) {
      lastBook = m2[1].trim();
      if (SINGLE_CHAPTER.has(lastBook)) { parseVerseSpec(lastBook, 1, `${m2[2]}-${m2[3]}`, segments); }
      else { for (let c = +m2[2]; c <= +m2[3]; c++) segments.push({ book: lastBook, chapter: c, verseStart: 1, verseEnd: Infinity }); }
      continue;
    }
    const m3 = part.match(/^([1-9]?\s?[A-Za-z][A-Za-z ]*?)\s+(\d+)$/);
    if (m3) {
      lastBook = m3[1].trim();
      if (SINGLE_CHAPTER.has(lastBook)) segments.push({ book: lastBook, chapter: 1, verseStart: +m3[2], verseEnd: Infinity });
      else segments.push({ book: lastBook, chapter: +m3[2], verseStart: 1, verseEnd: Infinity });
      continue;
    }
    const m4 = part.match(/^(\d+):(.+)$/);
    if (m4 && lastBook) { parseVerseSpec(lastBook, +m4[1], m4[2].trim(), segments); continue; }
    const m5 = part.match(/^(\d+)$/);
    if (m5 && lastBook) { segments.push({ book: lastBook, chapter: +m5[1], verseStart: 1, verseEnd: Infinity }); }
  }
  return segments;
}

function fetchVerses(refStr) {
  const segments = parseRef(refStr);
  if (!segments.length) return null;
  const result = [];
  for (const seg of segments) {
    const code = BOOK_CODE[seg.book];
    if (!code) { console.warn('  Unknown book:', seg.book); return null; }
    if (APOCRYPHA_CODES.has(code)) return null; // caller falls back to KJV
    const chData = index[code] && index[code][seg.chapter];
    if (!chData) { return null; }
    const maxVerse = chapterLength(code, seg.chapter);
    const vEnd = seg.verseEnd === Infinity ? maxVerse : Math.min(seg.verseEnd, maxVerse);
    for (let v = seg.verseStart; v <= vEnd; v++) {
      if (chData[v] !== undefined) result.push({ verse: v, text: chData[v] });
    }
  }
  return result.length > 0 ? result : null;
}

// ── Step 3: Build lessons-esv.json ────────────────────────────────────────────
console.log('Loading lectionary...');
const lect = JSON.parse(fs.readFileSync(LECT_PATH, 'utf8'));

const allRefs = new Set();
for (const day of Object.values(lect)) {
  for (const office of ['mp', 'ep']) {
    if (!day[office]) continue;
    for (const which of ['first', 'second']) {
      if (day[office][which]) allRefs.add(day[office][which]);
    }
  }
}
console.log(`  ${allRefs.size} unique lesson references.`);

const lessons = {};
let built = 0, skipped = 0, failed = 0;

for (const ref of allRefs) {
  const verses = fetchVerses(ref);
  if (verses) {
    lessons[ref] = verses;
    built++;
  } else {
    // Apocrypha or missing → skip (app falls back to KJV at runtime)
    skipped++;
  }
}

console.log(`\nResults: ${built} built, ${skipped} skipped (Apocrypha/missing → KJV fallback).`);
fs.writeFileSync(OUT_PATH, JSON.stringify(lessons, null, 2), 'utf8');
console.log(`Saved ${Object.keys(lessons).length} entries to lessons-esv.json`);

// Spot-check
const checks = ['Genesis 45','Isaiah 1:1-9','John 1:1-18','Romans 8:1-17','1 Corinthians 12:12-31'];
console.log('\nSpot-check:');
for (const ref of checks) {
  const v = lessons[ref];
  if (!v) { console.log('  MISSING:', ref); continue; }
  console.log(`  OK [${v.length}v]: ${ref} — "${v[0].text.slice(0,60)}..."`);
}
