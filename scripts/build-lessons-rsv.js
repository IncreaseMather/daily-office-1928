#!/usr/bin/env node
/**
 * build-lessons-rsv.js
 *
 * Parses RSV Bible .TXT files from "Bible - RSV/" directory and builds:
 *   src/data/lessons-rsv.json             — canonical books only
 *   src/data/lessons-rsv-deuterocanon.json — deuterocanonical books only
 *
 * Usage: node scripts/build-lessons-rsv.js
 */
'use strict';

const fs   = require('fs');
const path = require('path');

const RSV_DIR   = path.join(__dirname, '..', 'Bible - RSV');
const LECT_PATH = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');
const OUT_CANON = path.join(__dirname, '..', 'src', 'data', 'lessons-rsv.json');
const OUT_DEUT  = path.join(__dirname, '..', 'src', 'data', 'lessons-rsv-deuterocanon.json');

// ── Known internal RSV abbreviations used inside verse marker lines ───────────
const KNOWN_ABBREVS = new Set([
  'Gen','Exod','Lev','Num','Deut','Josh','Judg','Ruth',
  '1Sam','2Sam','1Kgs','2Kgs','1Chr','2Chr','Ezra','Neh','Esth',
  'Job','Ps','Prov','Ecc','SongSol','Isa','Jer','Lam','Ezek','Dan',
  'Hos','Joel','Amos','Obad','Jonah','Mic','Nah','Hab','Zeph','Hag','Zech','Mal',
  'Matt','Mark','Luke','John','Acts','Rom','1Cor','2Cor','Gal','Eph','Phil','Col',
  '1Thes','2Thes','1Tim','2Tim','Titus','Phlm','Heb','Jas','1Pet','2Pet',
  '1John','2John','3John','Jude','Rev',
  'Wis','Sir','Tob','Judith','Bar','1Mac','2Mac','1Esdr','4Ezra',
  'AddEsth','PrAzar','PrMan','Sus','Bel','LtrJer','3Mac','4Mac','Ps151',
]);

// Single-chapter books: verse markers have no chapter number (e.g. "Obad 2" not "Obad 1:2")
const SINGLE_CHAPTER_ABBREVS = new Set([
  'Obad','Phlm','2John','3John','Jude','PrAzar','PrMan','Sus','Bel',
]);

// ── Lectionary book name → RSV internal abbreviation ─────────────────────────
const BOOK_TO_ABBREV = {
  'Genesis':'Gen','Exodus':'Exod','Leviticus':'Lev','Numbers':'Num',
  'Deuteronomy':'Deut','Joshua':'Josh','Judges':'Judg','Ruth':'Ruth',
  '1 Samuel':'1Sam','2 Samuel':'2Sam','1 Kings':'1Kgs','2 Kings':'2Kgs',
  '1 Chronicles':'1Chr','2 Chronicles':'2Chr','Ezra':'Ezra','Nehemiah':'Neh',
  'Esther':'Esth','Job':'Job','Psalms':'Ps','Psalm':'Ps','Proverbs':'Prov',
  'Ecclesiastes':'Ecc','Song of Solomon':'SongSol',
  'Isaiah':'Isa','Jeremiah':'Jer','Lamentations':'Lam','Ezekiel':'Ezek',
  'Daniel':'Dan','Hosea':'Hos','Joel':'Joel','Amos':'Amos','Obadiah':'Obad',
  'Jonah':'Jonah','Micah':'Mic','Nahum':'Nah','Habakkuk':'Hab',
  'Zephaniah':'Zeph','Haggai':'Hag','Zechariah':'Zech','Malachi':'Mal',
  'Matthew':'Matt','Mark':'Mark','Luke':'Luke','John':'John','Acts':'Acts',
  'Romans':'Rom','1 Corinthians':'1Cor','2 Corinthians':'2Cor',
  'Galatians':'Gal','Ephesians':'Eph','Philippians':'Phil','Colossians':'Col',
  '1 Thessalonians':'1Thes','2 Thessalonians':'2Thes',
  '1 Timothy':'1Tim','2 Timothy':'2Tim','Titus':'Titus','Philemon':'Phlm',
  'Hebrews':'Heb','James':'Jas','1 Peter':'1Pet','2 Peter':'2Pet',
  '1 John':'1John','2 John':'2John','3 John':'3John','Jude':'Jude',
  'Revelation':'Rev',
  // Deuterocanon
  'Wisdom':'Wis',
  'Sirach':'Sir','Ecclesiasticus':'Sir',
  'Tobit':'Tob',
  'Judith':'Judith',
  'Baruch':'Bar',
  'Three Children':'PrAzar','Song of Three Children':'PrAzar',
  'Letter of Jeremiah':'LtrJer',
  'Susanna':'Sus',
  'Bel':'Bel','Bel and the Dragon':'Bel',
  'Prayer of Manasseh':'PrMan',
  '1 Maccabees':'1Mac',
  '2 Maccabees':'2Mac',
  '1 Esdras':'1Esdr',
  '2 Esdras':'4Ezra',
  'Additions to Esther':'AddEsth',
};

// Deuterocanon abbreviations (used to separate output files)
const DEUTEROCANON_ABBREVS = new Set([
  'Wis','Sir','Tob','Judith','Bar','1Mac','2Mac','1Esdr','4Ezra',
  'AddEsth','PrAzar','PrMan','Sus','Bel','LtrJer','3Mac','4Mac','Ps151',
]);

// Single-chapter books for ref parsing (books that take verse ranges without chapter)
const SINGLE_CHAPTER_BOOKS = new Set([
  'Obadiah','Philemon','2 John','3 John','Jude',
  'Three Children','Song of Three Children','Susanna','Bel','Bel and the Dragon',
  'Prayer of Manasseh',
]);

// ── Parse a verse marker line ─────────────────────────────────────────────────
function parseVerseMarker(line) {
  const t = line.trim();
  // ch:v format: "Gen 1:2"
  const m1 = t.match(/^([A-Za-z0-9]+)\s+(\d+):(\d+)\s*$/);
  if (m1 && KNOWN_ABBREVS.has(m1[1])) {
    return { abbrev: m1[1], ch: parseInt(m1[2], 10), v: parseInt(m1[3], 10) };
  }
  // v-only format for single-chapter books: "Obad 2"
  const m2 = t.match(/^([A-Za-z0-9]+)\s+(\d+)\s*$/);
  if (m2 && KNOWN_ABBREVS.has(m2[1]) && SINGLE_CHAPTER_ABBREVS.has(m2[1])) {
    return { abbrev: m2[1], ch: 1, v: parseInt(m2[2], 10) };
  }
  return null;
}

// ── Parse one RSV text file into {ch: {v: text}} ──────────────────────────────
function parseRSVFile(content) {
  const lines = content.split(/\r?\n/);
  const verses = {}; // ch -> v -> text

  let currentCh  = null;
  let currentV   = null;
  let currentBuf = [];
  let firstMarker = null;
  let preBuf = [];  // text before first valid marker

  function saveVerse(ch, v, buf) {
    const text = buf.join(' ').trim().replace(/\s+/g, ' ');
    if (!text) return;
    if (!verses[ch]) verses[ch] = {};
    verses[ch][v] = text;
  }

  for (const line of lines) {
    const marker = parseVerseMarker(line);
    if (marker) {
      if (firstMarker === null) {
        // First valid marker found
        firstMarker = marker;
        // If first marker's verse > 1, the text before it is verse 1
        if (marker.v > 1) {
          saveVerse(marker.ch, 1, preBuf);
        }
        // else: pre-marker text was a heading/prologue, discard
        preBuf = [];
      } else {
        // Save currently accumulated text to previous ch/v
        saveVerse(currentCh, currentV, currentBuf);
      }
      currentCh  = marker.ch;
      currentV   = marker.v;
      currentBuf = [];
    } else {
      const t = line.trim();
      if (firstMarker === null) {
        if (t) preBuf.push(t);
      } else {
        if (t) currentBuf.push(t);
      }
    }
  }
  // Flush last verse
  if (currentCh !== null) saveVerse(currentCh, currentV, currentBuf);

  return verses;
}

// ── Load all RSV files into master index {abbrev: {ch: {v: text}}} ───────────
console.log('Parsing RSV Bible files...');
const rsvIndex = {}; // abbrev -> ch -> v -> text

const files = fs.readdirSync(RSV_DIR).filter(f => f.endsWith('.TXT'));
let fileCount = 0;
for (const fname of files) {
  const content = fs.readFileSync(path.join(RSV_DIR, fname), 'utf8');
  const verses  = parseRSVFile(content);
  // Determine which abbreviation(s) this file uses by examining its first verses
  for (const [ch, chData] of Object.entries(verses)) {
    for (const [v, text] of Object.entries(chData)) {
      // We determine the abbrev from the verse markers in the file.
      // Since we keyed by abbrev from markers, the abbrev is already in the verses keys.
      // Actually we need to restructure — parseRSVFile returns {ch:{v:text}} without abbrev.
      // We'll discover the abbrev by parsing the file again minimally.
      void text; void ch; void v; // will handle below
    }
  }

  // Re-parse to get the abbreviation from verse markers
  const fileLines = content.split(/\r?\n/);
  let abbrev = null;
  for (const line of fileLines) {
    const marker = parseVerseMarker(line);
    if (marker) { abbrev = marker.abbrev; break; }
  }

  if (!abbrev) {
    // File has no standard verse markers (e.g. REMOVE.LOG) — skip
    continue;
  }

  if (!rsvIndex[abbrev]) rsvIndex[abbrev] = {};
  for (const [ch, chData] of Object.entries(verses)) {
    const chNum = parseInt(ch, 10);
    if (!rsvIndex[abbrev][chNum]) rsvIndex[abbrev][chNum] = {};
    for (const [v, text] of Object.entries(chData)) {
      rsvIndex[abbrev][chNum][parseInt(v, 10)] = text;
    }
  }
  fileCount++;
}

console.log(`  Parsed ${fileCount} files.`);
let totalVerses = 0;
for (const abbrev of Object.keys(rsvIndex)) {
  for (const ch of Object.keys(rsvIndex[abbrev])) {
    totalVerses += Object.keys(rsvIndex[abbrev][ch]).length;
  }
}
console.log(`  Total verses indexed: ${totalVerses}`);

// ── Ref parsing (same logic as build-lessons-esv.js) ─────────────────────────
function chapterLength(abbrev, ch) {
  const chData = rsvIndex[abbrev] && rsvIndex[abbrev][ch];
  if (!chData) return 0;
  return Math.max(...Object.keys(chData).map(Number));
}

function parseVerseSpec(book, ch, verseSpec, segments) {
  if (!verseSpec) { segments.push({ book, chapter: ch, verseStart: 1, verseEnd: Infinity }); return; }
  for (const range of verseSpec.split(',').map(r => r.trim())) {
    const dash   = range.match(/^(\d+)-(\d+)$/);
    const single = range.match(/^(\d+)$/);
    if (dash)        segments.push({ book, chapter: ch, verseStart: +dash[1],   verseEnd: +dash[2] });
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
      if (SINGLE_CHAPTER_BOOKS.has(lastBook)) { parseVerseSpec(lastBook, 1, `${m2[2]}-${m2[3]}`, segments); }
      else { for (let c = +m2[2]; c <= +m2[3]; c++) segments.push({ book: lastBook, chapter: c, verseStart: 1, verseEnd: Infinity }); }
      continue;
    }
    const m3 = part.match(/^([1-9]?\s?[A-Za-z][A-Za-z ]*?)\s+(\d+)$/);
    if (m3) {
      lastBook = m3[1].trim();
      if (SINGLE_CHAPTER_BOOKS.has(lastBook)) segments.push({ book: lastBook, chapter: 1, verseStart: +m3[2], verseEnd: Infinity });
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
    const abbrev = BOOK_TO_ABBREV[seg.book];
    if (!abbrev) { console.warn('  Unknown book:', seg.book, 'in ref:', refStr); return null; }
    const chData = rsvIndex[abbrev] && rsvIndex[abbrev][seg.chapter];
    if (!chData) return null;
    const maxVerse = chapterLength(abbrev, seg.chapter);
    const vEnd = seg.verseEnd === Infinity ? maxVerse : Math.min(seg.verseEnd, maxVerse);
    for (let v = seg.verseStart; v <= vEnd; v++) {
      if (chData[v] !== undefined) result.push({ verse: v, text: chData[v] });
    }
  }
  return result.length > 0 ? result : null;
}

// ── Determine if a lectionary ref is deuterocanon ────────────────────────────
const DEUTEROCANON_BOOKS = new Set(Object.keys(BOOK_TO_ABBREV).filter(
  k => DEUTEROCANON_ABBREVS.has(BOOK_TO_ABBREV[k])
));

function isDeuterocanon(refStr) {
  // Check if the ref starts with a deuterocanon book name
  for (const bookName of DEUTEROCANON_BOOKS) {
    if (refStr.startsWith(bookName)) return true;
  }
  return false;
}

// ── Load lectionary and build output files ────────────────────────────────────
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

const canonLessons = {};
const deutLessons  = {};
let canonBuilt = 0, canonSkipped = 0;
let deutBuilt  = 0, deutSkipped  = 0;

for (const ref of allRefs) {
  const isDeut = isDeuterocanon(ref);
  const verses  = fetchVerses(ref);

  if (isDeut) {
    if (verses) { deutLessons[ref] = verses; deutBuilt++; }
    else deutSkipped++;
  } else {
    if (verses) { canonLessons[ref] = verses; canonBuilt++; }
    else canonSkipped++;
  }
}

console.log(`\nCanonical: ${canonBuilt} built, ${canonSkipped} skipped (missing → KJV fallback at runtime).`);
console.log(`Deuterocanon: ${deutBuilt} built, ${deutSkipped} skipped.`);

fs.writeFileSync(OUT_CANON, JSON.stringify(canonLessons, null, 2), 'utf8');
console.log(`Saved ${Object.keys(canonLessons).length} entries → lessons-rsv.json`);

fs.writeFileSync(OUT_DEUT, JSON.stringify(deutLessons, null, 2), 'utf8');
console.log(`Saved ${Object.keys(deutLessons).length} entries → lessons-rsv-deuterocanon.json`);

// ── Spot-check ────────────────────────────────────────────────────────────────
const checks = [
  { ref: 'Genesis 45', label: 'Genesis 45 (canonical)' },
  { ref: 'Isaiah 1:1-9', label: 'Isaiah 1:1-9 (canonical)' },
  { ref: 'John 1:1-18', label: 'John 1:1-18 (canonical)' },
  { ref: 'Romans 8:1-17', label: 'Romans 8:1-17 (canonical)' },
  { ref: 'Wisdom 1:1-7', label: 'Wisdom 1:1-7 (deuterocanon)' },
  { ref: 'Sirach 1:1-10', label: 'Sirach 1:1-10 (deuterocanon)' },
  { ref: 'Three Children 29-37', label: 'Three Children 29-37 (deuterocanon)' },
];
console.log('\nSpot-check:');
for (const { ref, label } of checks) {
  const map = isDeuterocanon(ref) ? deutLessons : canonLessons;
  const v = map[ref];
  if (!v) { console.log(`  MISSING: ${label}`); continue; }
  console.log(`  OK [${v.length}v]: ${label} — "${v[0].text.slice(0, 60)}..."`);
}
