#!/usr/bin/env node
/**
 * build-lessons-nasb-nkjv.js
 *
 * Builds lessons-nasb.json and lessons-nkjv.json from the plain-text
 * NASB and NKJV Bible files.
 *
 * File format:
 *   - Book name on its own line (e.g. "Genesis", "1st Samuel")
 *   - Verse lines: NText... where N is the verse number
 *   - For chapters 2+: first verse line uses the CHAPTER number as N
 *   - Psalms: explicit "PSALM N" headers
 *
 * Chapter boundaries are detected by comparing the verse number to the
 * previous verse number AND by using KJV VPL verse counts as a guide.
 *
 * Usage: node scripts/build-lessons-nasb-nkjv.js
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const VPL_PATH   = path.join(__dirname, '..', 'eng-kjv_vpl.txt');
const NASB_PATH  = path.join(__dirname, '..', 'Bible - New American Standard - NASB.txt');
const NKJV_PATH  = path.join(__dirname, '..', 'Bible - New King James - NKJV.txt');
const LECT_PATH  = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');
const NASB_OUT   = path.join(__dirname, '..', 'src', 'data', 'lessons-nasb.json');
const NKJV_OUT   = path.join(__dirname, '..', 'src', 'data', 'lessons-nkjv.json');

// ── Book name → VPL code (NASB/NKJV use "1st Samuel", "2nd Kings", etc.) ─────
const BOOK_NAME_TO_CODE = {
  'Genesis':'GEN','Exodus':'EXO','Leviticus':'LEV','Numbers':'NUM',
  'Deuteronomy':'DEU','Joshua':'JOS','Judges':'JDG','Ruth':'RUT',
  '1st Samuel':'1SA','2nd Samuel':'2SA','1st Kings':'1KI','2nd Kings':'2KI',
  '1st Chronicles':'1CH','2nd Chronicles':'2CH','Ezra':'EZR','Nehemiah':'NEH',
  'Esther':'EST','Job':'JOB','Psalms':'PSA','Proverbs':'PRO',
  'Ecclesiastes':'ECC','Song of Solomon':'SOL','Isaiah':'ISA','Jeremiah':'JER',
  'Lamentations':'LAM','Ezekiel':'EZE','Daniel':'DAN','Hosea':'HOS','Joel':'JOE',
  'Amos':'AMO','Obadiah':'OBA','Jonah':'JON','Micah':'MIC','Nahum':'NAH',
  'Habakkuk':'HAB','Zephaniah':'ZEP','Haggai':'HAG','Zechariah':'ZEC','Malachi':'MAL',
  'Matthew':'MAT','Mark':'MAR','Luke':'LUK','John':'JOH','Acts':'ACT','Romans':'ROM',
  '1st Corinthians':'1CO','2nd Corinthians':'2CO','Galatians':'GAL','Ephesians':'EPH',
  'Philippians':'PHI','Colossians':'COL','1st Thessalonians':'1TH',
  '2nd Thessalonians':'2TH','1st Timothy':'1TI','2nd Timothy':'2TI','Titus':'TIT',
  'Philemon':'PHM','Hebrews':'HEB','James':'JAM','1st Peter':'1PE','2nd Peter':'2PE',
  '1st John':'1JO','2nd John':'2JO','3rd John':'3JO','Jude':'JUD','Revelation':'REV',
};

// Lectionary book name → VPL code (for reference parsing, same as KJV script)
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

// ── Step 1: Parse KJV VPL to get chapter/verse structure ─────────────────────
console.log('Parsing KJV VPL for chapter/verse counts...');
const vplText = fs.readFileSync(VPL_PATH, 'utf8');
const kjvIndex = {}; // kjvIndex[CODE][ch][v] = text (we only need max verse per ch)
const kjvMaxVerse = {}; // kjvMaxVerse[CODE][ch] = maxVerse

for (const line of vplText.split('\n')) {
  const m = line.match(/^([A-Z0-9]+)\s+(\d+):(\d+)\s+(.*)/);
  if (!m) continue;
  const [, code, chStr, vStr] = m;
  const ch = parseInt(chStr, 10);
  const v  = parseInt(vStr, 10);
  if (!kjvMaxVerse[code])     kjvMaxVerse[code]     = {};
  if (!kjvMaxVerse[code][ch]) kjvMaxVerse[code][ch] = 0;
  if (v > kjvMaxVerse[code][ch]) kjvMaxVerse[code][ch] = v;
}

function getKJVMaxVerse(code, ch) {
  return (kjvMaxVerse[code] && kjvMaxVerse[code][ch]) || 999;
}
function getKJVNumChapters(code) {
  return kjvMaxVerse[code] ? Object.keys(kjvMaxVerse[code]).length : 0;
}

console.log(`  KJV structure loaded for ${Object.keys(kjvMaxVerse).length} books.`);

// ── Step 2: Parse a plain-text NASB/NKJV file into index[CODE][ch][v] ─────────
function parseTranslationFile(filePath, label) {
  console.log(`\nParsing ${label}...`);
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split('\n');

  const index = {};
  let code = null;
  let chapter = 0;
  let verse = 0;
  let chMaxVerse = 0;
  let verseCount = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Skip the table-of-contents section (before the actual text begins)
    // The real text starts when we see a book name followed by verse lines.
    // We detect this by checking if a known book name appears twice.

    // ── PSALM N header ──
    const psalmMatch = line.match(/^PSALM (\d+)$/i);
    if (psalmMatch) {
      code = 'PSA';
      chapter = parseInt(psalmMatch[1], 10);
      verse = 0;
      chMaxVerse = getKJVMaxVerse('PSA', chapter);
      if (!index[code]) index[code] = {};
      if (!index[code][chapter]) index[code][chapter] = {};
      continue;
    }

    // ── Book name ──
    const newCode = BOOK_NAME_TO_CODE[line];
    if (newCode) {
      // Only start parsing at the second occurrence (skip table of contents)
      if (index[newCode] === undefined) {
        // First time seeing this book — skip (it's the TOC)
        index[newCode] = null; // placeholder
        continue;
      }
      if (index[newCode] === null) {
        // Second time — this is the actual text section
        index[newCode] = {};
        code = newCode;
        chapter = 1;
        verse = 0;
        chMaxVerse = getKJVMaxVerse(code, 1);
        if (!index[code][chapter]) index[code][chapter] = {};
        continue;
      }
      // Already parsed this book — shouldn't happen, but guard
      code = newCode;
      continue;
    }

    // ── Skip if no active book ──
    if (!code || index[code] === null) continue;

    // ── Verse line: starts with digit(s) followed by text ──
    const vm = line.match(/^(\d+)(.+)/);
    if (!vm) continue;
    const verseText = vm[2].trim();
    if (!verseText) continue;

    if (!index[code])          index[code]          = {};
    if (!index[code][chapter]) index[code][chapter] = {};

    if (verse === 0) {
      // First verse of this chapter — always stored as verse 1
      // (the leading number N is the chapter marker for ch2+, or "1" for ch1)
      index[code][chapter][1] = verseText;
      verse = 1;
    } else {
      // Regular verse — use the actual number
      const v = parseInt(vm[1], 10);
      index[code][chapter][v] = verseText;
      verse = v;
    }
    verseCount++;

    // Check if we've reached the last verse of this chapter (per KJV counts)
    if (verse >= chMaxVerse) {
      chapter++;
      verse = 0;
      const numCh = getKJVNumChapters(code);
      if (numCh > 0 && chapter > numCh) {
        // Moved past the last chapter of this book
        code = null;
        continue;
      }
      chMaxVerse = getKJVMaxVerse(code, chapter);
      if (!index[code][chapter]) index[code][chapter] = {};
    }
  }

  // Clean up null placeholders (TOC-only books that weren't in text)
  for (const k of Object.keys(index)) {
    if (index[k] === null) delete index[k];
  }

  console.log(`  Parsed ~${verseCount} verses across ${Object.keys(index).length} books.`);
  return index;
}

// ── Step 3: Reference parser (same as KJV script) ────────────────────────────
function parseVerseSpec(book, ch, verseSpec, segments) {
  if (!verseSpec) { segments.push({ book, chapter: ch, verseStart: 1, verseEnd: Infinity }); return; }
  for (const range of verseSpec.split(',').map(r => r.trim())) {
    const dash   = range.match(/^(\d+)-(\d+)$/);
    const single = range.match(/^(\d+)$/);
    if (dash)        segments.push({ book, chapter: ch, verseStart: +dash[1], verseEnd: +dash[2] });
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

function fetchVerses(refStr, index) {
  const segments = parseRef(refStr);
  if (!segments.length) return null;
  const result = [];
  for (const seg of segments) {
    const code = BOOK_CODE[seg.book];
    if (!code) return null;
    if (APOCRYPHA_CODES.has(code)) return null; // fall back to KJV
    const chData = index[code] && index[code][seg.chapter];
    if (!chData) return null;
    const maxVerse = Math.max(...Object.keys(chData).map(Number));
    const vEnd = seg.verseEnd === Infinity ? maxVerse : Math.min(seg.verseEnd, maxVerse);
    for (let v = seg.verseStart; v <= vEnd; v++) {
      if (chData[v] !== undefined) result.push({ verse: v, text: chData[v] });
    }
  }
  return result.length > 0 ? result : null;
}

// ── Step 4: Load lectionary refs ─────────────────────────────────────────────
console.log('\nLoading lectionary...');
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

// ── Step 5: Build each translation ────────────────────────────────────────────
function buildLessons(index, label, outPath) {
  const lessons = {};
  let built = 0, skipped = 0;
  for (const ref of allRefs) {
    const verses = fetchVerses(ref, index);
    if (verses) { lessons[ref] = verses; built++; }
    else skipped++;
  }
  console.log(`\n${label}: ${built} built, ${skipped} skipped (Apocrypha/missing → KJV fallback).`);
  fs.writeFileSync(outPath, JSON.stringify(lessons, null, 2), 'utf8');
  console.log(`Saved ${Object.keys(lessons).length} entries to ${path.basename(outPath)}`);

  const checks = ['Genesis 45','Isaiah 1:1-9','John 1:1-18','Romans 8:1-17','1 Corinthians 12:12-31'];
  console.log('Spot-check:');
  for (const ref of checks) {
    const v = lessons[ref];
    if (!v) { console.log('  MISSING:', ref); continue; }
    console.log(`  OK [${v.length}v]: ${ref} — "${v[0].text.slice(0, 60)}..."`);
  }
}

const nasbIndex = parseTranslationFile(NASB_PATH, 'NASB');
buildLessons(nasbIndex, 'NASB', NASB_OUT);

const nkjvIndex = parseTranslationFile(NKJV_PATH, 'NKJV');
buildLessons(nkjvIndex, 'NKJV', NKJV_OUT);
