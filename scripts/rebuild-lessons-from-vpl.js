#!/usr/bin/env node
/**
 * rebuild-lessons-from-vpl.js
 *
 * Rebuilds lessons.json completely from scratch using the local VPL text file
 * (eng-kjv_vpl.txt) as the source. Handles canonical and Apocrypha books.
 *
 * Usage: node scripts/rebuild-lessons-from-vpl.js
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const VPL_PATH     = path.join(__dirname, '..', 'eng-kjv_vpl.txt');
const LECT_PATH    = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');
const LESSONS_PATH = path.join(__dirname, '..', 'src', 'data', 'lessons.json');

// ── Step 1: Parse VPL file ────────────────────────────────────────────────────
// Format: "GEN 1:1 In the beginning..."
console.log('Parsing VPL file...');
const vplText = fs.readFileSync(VPL_PATH, 'utf8');
// index[CODE][chapter][verse] = text
const index = {};
let lineCount = 0;
for (const line of vplText.split('\n')) {
  const m = line.match(/^([A-Z0-9]+)\s+(\d+):(\d+)\s+(.*)/);
  if (!m) continue;
  const [, code, chStr, vStr, text] = m;
  const ch = parseInt(chStr, 10);
  const v  = parseInt(vStr, 10);
  // Remove ¶ paragraph marks from verse text (KJV section markers)
  const cleaned = text.replace(/¶\s*/g, '').replace(/\[([^\]]+)\]/g, '$1').trim();
  if (!index[code]) index[code] = {};
  if (!index[code][ch]) index[code][ch] = {};
  index[code][ch][v] = cleaned;
  lineCount++;
}
console.log(`  Parsed ${lineCount} verses across ${Object.keys(index).length} books.`);

// ── Step 2: Book name mapping (lectionary name → VPL code) ───────────────────
// Lectionary book name → VPL 3-letter code
const BOOK_CODE = {
  // Canonical OT
  'Genesis':          'GEN', 'Exodus':          'EXO', 'Leviticus':     'LEV',
  'Numbers':          'NUM', 'Deuteronomy':     'DEU', 'Joshua':        'JOS',
  'Judges':           'JDG', 'Ruth':            'RUT', '1 Samuel':      '1SA',
  '2 Samuel':         '2SA', '1 Kings':         '1KI', '2 Kings':       '2KI',
  '1 Chronicles':     '1CH', '2 Chronicles':    '2CH', 'Ezra':          'EZR',
  'Nehemiah':         'NEH', 'Esther':          'EST', 'Job':           'JOB',
  'Psalms':           'PSA', 'Psalm':           'PSA', 'Proverbs':      'PRO',
  'Ecclesiastes':     'ECC', 'Song of Solomon': 'SOL', 'Isaiah':        'ISA',
  'Jeremiah':         'JER', 'Lamentations':    'LAM', 'Ezekiel':       'EZE',
  'Daniel':           'DAN', 'Hosea':           'HOS', 'Joel':          'JOE',
  'Amos':             'AMO', 'Obadiah':         'OBA', 'Jonah':         'JON',
  'Micah':            'MIC', 'Nahum':           'NAH', 'Habakkuk':      'HAB',
  'Zephaniah':        'ZEP', 'Haggai':          'HAG', 'Zechariah':     'ZEC',
  'Malachi':          'MAL',
  // NT
  'Matthew':          'MAT', 'Mark':            'MAR', 'Luke':          'LUK',
  'John':             'JOH', 'Acts':            'ACT', 'Romans':        'ROM',
  '1 Corinthians':    '1CO', '2 Corinthians':   '2CO', 'Galatians':     'GAL',
  'Ephesians':        'EPH', 'Philippians':     'PHI', 'Colossians':    'COL',
  '1 Thessalonians':  '1TH', '2 Thessalonians': '2TH', '1 Timothy':     '1TI',
  '2 Timothy':        '2TI', 'Titus':           'TIT', 'Philemon':      'PHM',
  'Hebrews':          'HEB', 'James':           'JAM', '1 Peter':       '1PE',
  '2 Peter':          '2PE', '1 John':          '1JO', '2 John':        '2JO',
  '3 John':           '3JO', 'Jude':            'JUD', 'Revelation':    'REV',
  // Apocrypha
  'Wisdom':           'WIS', 'Sirach':          'SIR', 'Ecclesiasticus':'SIR',
  'Tobit':            'TOB', 'Judith':          'JDT', 'Baruch':        'BAR',
  '1 Maccabees':      '1MA', '2 Maccabees':     '2MA',
  '1 Esdras':         '1ES', '2 Esdras':        '4ES',
  'Three Children':   'PRA', 'Song of Three Children': 'PRA',
};

// BCP display name for each lectionary book name
const BCP_DISPLAY = {
  'Sirach':          'Ecclesiasticus',
  'Song of Solomon': 'Song of Solomon',
  'Three Children':  'Song of Three Children',
  '2 Esdras':        '2 Esdras',
  '1 Esdras':        '1 Esdras',
};
function bcpName(bookName) {
  return BCP_DISPLAY[bookName] || bookName;
}

// Books with only one chapter (verse refs have no chapter number)
const SINGLE_CHAPTER = new Set(['Obadiah','Philemon','2 John','3 John','Jude','Three Children']);

// ── Step 3: Reference parser ──────────────────────────────────────────────────
/**
 * Parse a compound reference like:
 *   "Genesis 44"                    → whole chapter
 *   "Genesis 44:1-20"               → verse range, same chapter
 *   "Genesis 44:1-20; 45:1-10"      → cross-chapter (already normalised)
 *   "Isaiah 1:1-3, 8-15"            → non-consecutive verses (comma list)
 *   "Genesis 24:28-38, 49-51, 58-67"→ multiple ranges in same chapter
 *
 * Returns array of {book, chapter, verseStart, verseEnd} segments
 * where verseEnd = Infinity means "end of chapter".
 */
function parseRef(refStr) {
  const segments = [];

  // Split on semicolons for cross-chapter segments
  const parts = refStr.split(';').map(s => s.trim()).filter(Boolean);

  let lastBook = null;
  for (const part of parts) {
    // Case 1: "Book chapter:verseSpec"  e.g. "Genesis 44:1-20"
    const bookChVerseMatch = part.match(/^([1-9]?\s?[A-Za-z][A-Za-z ]*?)\s+(\d+):(.+)$/);
    if (bookChVerseMatch) {
      lastBook = bookChVerseMatch[1].trim();
      const ch = parseInt(bookChVerseMatch[2], 10);
      parseVerseSpec(lastBook, ch, bookChVerseMatch[3].trim(), segments);
      continue;
    }

    // Case 2: "Book ch1-ch2"  e.g. "Jonah 3-4"  (chapter range, no verse spec)
    const bookChRangeMatch = part.match(/^([1-9]?\s?[A-Za-z][A-Za-z ]*?)\s+(\d+)-(\d+)$/);
    if (bookChRangeMatch) {
      lastBook = bookChRangeMatch[1].trim();
      const chFrom = parseInt(bookChRangeMatch[2], 10);
      const chTo   = parseInt(bookChRangeMatch[3], 10);
      // If single-chapter book, treat as verse range in chapter 1
      if (SINGLE_CHAPTER.has(lastBook) || lastBook === 'Three Children') {
        parseVerseSpec(lastBook, 1, `${chFrom}-${chTo}`, segments);
      } else {
        for (let ch = chFrom; ch <= chTo; ch++) {
          segments.push({ book: lastBook, chapter: ch, verseStart: 1, verseEnd: Infinity });
        }
      }
      continue;
    }

    // Case 3: "Book chapter"  e.g. "Genesis 44"  (whole chapter)
    const bookChMatch = part.match(/^([1-9]?\s?[A-Za-z][A-Za-z ]*?)\s+(\d+)$/);
    if (bookChMatch) {
      lastBook = bookChMatch[1].trim();
      const ch = parseInt(bookChMatch[2], 10);
      // If single-chapter book, treat chapter number as starting verse to end
      if (SINGLE_CHAPTER.has(lastBook) || lastBook === 'Three Children') {
        segments.push({ book: lastBook, chapter: 1, verseStart: ch, verseEnd: Infinity });
      } else {
        segments.push({ book: lastBook, chapter: ch, verseStart: 1, verseEnd: Infinity });
      }
      continue;
    }

    // Case 4: Continuation "chapter:ranges" or "chapter" with no book name
    const contVerseMatch = part.match(/^(\d+):(.+)$/);
    if (contVerseMatch && lastBook) {
      const ch = parseInt(contVerseMatch[1], 10);
      parseVerseSpec(lastBook, ch, contVerseMatch[2].trim(), segments);
      continue;
    }
    const contChMatch = part.match(/^(\d+)$/);
    if (contChMatch && lastBook) {
      const ch = parseInt(contChMatch[1], 10);
      segments.push({ book: lastBook, chapter: ch, verseStart: 1, verseEnd: Infinity });
      continue;
    }

    console.warn('  Could not parse part:', JSON.stringify(part), 'in ref:', refStr);
  }
  return segments;
}

function parseVerseSpec(book, ch, verseSpec, segments) {
  if (!verseSpec) {
    // Whole chapter
    segments.push({ book, chapter: ch, verseStart: 1, verseEnd: Infinity });
    return;
  }
  // Handle comma-separated ranges: "28-38, 49-51, 58-67"
  const ranges = verseSpec.split(',').map(r => r.trim());
  for (const range of ranges) {
    const dashMatch = range.match(/^(\d+)-(\d+)$/);
    const singleMatch = range.match(/^(\d+)$/);
    if (dashMatch) {
      segments.push({ book, chapter: ch, verseStart: parseInt(dashMatch[1]), verseEnd: parseInt(dashMatch[2]) });
    } else if (singleMatch) {
      const v = parseInt(singleMatch[1]);
      segments.push({ book, chapter: ch, verseStart: v, verseEnd: v });
    } else {
      console.warn('  Unknown verse spec range:', JSON.stringify(range));
    }
  }
}

// ── Step 4: Fetch verses from index ──────────────────────────────────────────
function chapterLength(code, ch) {
  const chData = index[code] && index[code][ch];
  if (!chData) return 0;
  return Math.max(...Object.keys(chData).map(Number));
}

function fetchVerses(refStr) {
  const segments = parseRef(refStr);
  if (segments.length === 0) return null;

  const result = [];
  for (const seg of segments) {
    const code = BOOK_CODE[seg.book];
    if (!code) {
      console.warn('  Unknown book:', seg.book, 'in ref:', refStr);
      return null;
    }
    const chData = index[code] && index[code][seg.chapter];
    if (!chData) {
      console.warn('  Missing chapter data for', code, seg.chapter, 'in ref:', refStr);
      return null;
    }
    const maxVerse = chapterLength(code, seg.chapter);
    const vEnd = seg.verseEnd === Infinity ? maxVerse : Math.min(seg.verseEnd, maxVerse);
    for (let v = seg.verseStart; v <= vEnd; v++) {
      const text = chData[v];
      if (text !== undefined) {
        result.push({ verse: v, text });
      }
    }
  }
  return result.length > 0 ? result : null;
}

// ── Step 5: Rebuild lessons.json ─────────────────────────────────────────────
console.log('Loading lectionary...');
const lect = JSON.parse(fs.readFileSync(LECT_PATH, 'utf8'));

// Load existing lessons (to keep any we can't rebuild)
let existing = {};
if (fs.existsSync(LESSONS_PATH)) {
  existing = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));
}

// Collect all unique refs
const allRefs = new Set();
for (const day of Object.values(lect)) {
  for (const office of ['mp', 'ep']) {
    if (!day[office]) continue;
    for (const which of ['first', 'second']) {
      if (day[office][which]) allRefs.add(day[office][which]);
    }
  }
}
console.log(`  ${allRefs.size} unique lesson references in lectionary.`);

const lessons = {};
let built = 0, kept = 0, failed = 0;
const failedRefs = [];

for (const ref of allRefs) {
  const verses = fetchVerses(ref);
  if (verses) {
    lessons[ref] = verses;
    built++;
  } else if (existing[ref] && existing[ref].length > 0) {
    lessons[ref] = existing[ref];
    kept++;
    console.log('  KEPT from existing:', ref);
  } else {
    failed++;
    failedRefs.push(ref);
    console.warn('  FAILED:', ref);
  }
}

console.log(`\nResults: ${built} built, ${kept} kept from existing, ${failed} failed.`);
if (failedRefs.length > 0) {
  console.log('Failed refs:');
  failedRefs.forEach(r => console.log(' ', r));
}

// ── Step 6: Save ─────────────────────────────────────────────────────────────
fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons, null, 2), 'utf8');
console.log(`\nSaved ${Object.keys(lessons).length} entries to lessons.json`);

// ── Step 7: Verify cross-chapter verse continuity and report fixed refs ───────
console.log('\nSpot-check verification:');
const checks = [
  'Genesis 45',
  'Isaiah 1:1-20',
  '1 Corinthians 13:1-13',
  'Sirach 3:17-31',
  'Sirach 4:20-31; Sirach 5:1-7',
  'Three Children 29-37',
  'Wisdom 3:1-9',
  'Tobit 4:1-19',
];
for (const ref of checks) {
  const v = lessons[ref];
  if (!v) { console.log('  MISSING:', ref); continue; }
  console.log(`  OK [${v.length} verses]: ${ref} — "${v[0].text.slice(0, 60)}..."`);
}
