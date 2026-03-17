#!/usr/bin/env node
/**
 * fill-lessons-from-kjv.js
 * Uses local KJV JSON file to populate missing canonical lessons in lessons.json.
 * Apocrypha refs (Wisdom, Sirach, Tobit, etc.) are skipped and handled separately.
 */
const fs = require('fs');
const path = require('path');

const KJV_PATH    = 'C:/Users/aliss/AppData/Local/Temp/kjv-full.json';
const LECT_PATH   = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');
const LESSONS_PATH = path.join(__dirname, '..', 'src', 'data', 'lessons.json');

// ── Load KJV data ─────────────────────────────────────────────────────────────
const raw = fs.readFileSync(KJV_PATH, 'utf8').replace(/^\uFEFF/, '');
const kjvData = JSON.parse(raw); // array of {abbrev, name, chapters}

// Map full names → index into kjvData
const NAME_MAP = {
  'Genesis': 'gn', 'Exodus': 'ex', 'Leviticus': 'lv', 'Numbers': 'nm',
  'Deuteronomy': 'dt', 'Joshua': 'js', 'Judges': 'jud', 'Ruth': 'rt',
  '1 Samuel': '1sm', '2 Samuel': '2sm', '1 Kings': '1kgs', '2 Kings': '2kgs',
  '1 Chronicles': '1ch', '2 Chronicles': '2ch', 'Ezra': 'ezr', 'Nehemiah': 'ne',
  'Esther': 'et', 'Job': 'job', 'Psalms': 'ps', 'Psalm': 'ps',
  'Proverbs': 'prv', 'Ecclesiastes': 'ec', 'Song of Solomon': 'so',
  'Isaiah': 'is', 'Jeremiah': 'jr', 'Lamentations': 'lm', 'Ezekiel': 'ez',
  'Daniel': 'dn', 'Hosea': 'ho', 'Joel': 'jl', 'Amos': 'am', 'Obadiah': 'ob',
  'Jonah': 'jn', 'Micah': 'mi', 'Nahum': 'na', 'Habakkuk': 'hk',
  'Zephaniah': 'zp', 'Haggai': 'hg', 'Zechariah': 'zc', 'Malachi': 'ml',
  'Matthew': 'mt', 'Mark': 'mk', 'Luke': 'lk', 'John': 'jo',
  'Acts': 'act', 'Romans': 'rm', '1 Corinthians': '1co', '2 Corinthians': '2co',
  'Galatians': 'gl', 'Ephesians': 'eph', 'Philippians': 'ph', 'Colossians': 'cl',
  '1 Thessalonians': '1ts', '2 Thessalonians': '2ts', '1 Timothy': '1tm',
  '2 Timothy': '2tm', 'Titus': 'tt', 'Philemon': 'phm', 'Hebrews': 'hb',
  'James': 'jm', '1 Peter': '1pe', '2 Peter': '2pe',
  '1 John': '1jo', '2 John': '2jo', '3 John': '3jo', 'Jude': 'jd',
  'Revelation': 're',
};

// Build abbrev → book data map
const abbrevMap = {};
for (const book of kjvData) abbrevMap[book.abbrev] = book;

// Apocrypha books (not in canonical KJV file)
const APOCRYPHA = new Set([
  'Wisdom', 'Sirach', 'Tobit', 'Judith', 'Baruch',
  '1 Maccabees', '2 Maccabees', '1 Esdras', '2 Esdras',
  'Three Children', 'Song of Three Children',
]);

// ── Strip translator notes in {curly braces} ─────────────────────────────────
function cleanVerse(text) {
  return text.replace(/\s*\{[^}]*\}/g, '').replace(/\s+/g, ' ').trim();
}

// ── Get verses for a range (single chapter:verseStart-verseEnd) ───────────────
function getVerses(book, chapter, verseStart, verseEnd) {
  const abbrev = NAME_MAP[book];
  if (!abbrev) return null;
  const bookData = abbrevMap[abbrev];
  if (!bookData) return null;
  const chapters = bookData.chapters;
  const chIdx = chapter - 1;
  if (chIdx < 0 || chIdx >= chapters.length) return null;
  const chVerses = chapters[chIdx];
  const vs = Math.max(1, verseStart);
  const ve = Math.min(verseEnd, chVerses.length);
  const result = [];
  for (let v = vs; v <= ve; v++) {
    const text = chVerses[v - 1];
    if (text !== undefined) result.push({ verse: v, text: cleanVerse(text) });
  }
  return result;
}

// Single-chapter books: "Book V1-V2" means chapter 1, verses V1-V2
const SINGLE_CHAPTER_BOOKS_LOCAL = new Set(['Obadiah','Philemon','2 John','3 John','Jude']);

// ── Parse a single ref segment ────────────────────────────────────────────────
function parseRefSegment(seg, prevBook) {
  seg = seg.trim();
  // Try "Book Ch:V1-V2" or "Book Ch:V" pattern
  const m1 = seg.match(/^(.*?)\s+(\d+):(\d+)-(\d+)$/);
  if (m1) return { book: m1[1].trim(), ch: parseInt(m1[2]), v1: parseInt(m1[3]), v2: parseInt(m1[4]) };
  const m2 = seg.match(/^(.*?)\s+(\d+):(\d+)$/);
  if (m2) return { book: m2[1].trim(), ch: parseInt(m2[2]), v1: parseInt(m2[3]), v2: parseInt(m2[3]) };
  // Single-chapter book: "Obadiah 1-9" → ch=1, v1=1, v2=9
  const ms = seg.match(/^(.*?)\s+(\d+)-(\d+)$/);
  if (ms && SINGLE_CHAPTER_BOOKS_LOCAL.has(ms[1].trim())) {
    return { book: ms[1].trim(), ch: 1, v1: parseInt(ms[2]), v2: parseInt(ms[3]) };
  }
  // Continuation with just "Ch:V1-V2"
  const m3 = seg.match(/^(\d+):(\d+)-(\d+)$/);
  if (m3 && prevBook) return { book: prevBook, ch: parseInt(m3[1]), v1: parseInt(m3[2]), v2: parseInt(m3[3]) };
  const m4 = seg.match(/^(\d+):(\d+)$/);
  if (m4 && prevBook) return { book: prevBook, ch: parseInt(m4[1]), v1: parseInt(m4[2]), v2: parseInt(m4[2]) };
  return null;
}

// ── Fetch passage from local KJV data ─────────────────────────────────────────
function getPassage(ref) {
  const allVerses = [];
  const segments = ref.split(';').map(s => s.trim()).filter(Boolean);
  let lastBook = null;

  for (const seg of segments) {
    const parsed = parseRefSegment(seg, lastBook);
    if (!parsed) continue;
    lastBook = parsed.book;
    // Check if Apocrypha
    if (APOCRYPHA.has(parsed.book) || parsed.book === 'Three Children') return null;
    const verses = getVerses(parsed.book, parsed.ch, parsed.v1, parsed.v2);
    if (!verses) return null;
    allVerses.push(...verses);
  }
  return allVerses.length > 0 ? allVerses : null;
}

// ── Process comma sub-ranges ──────────────────────────────────────────────────
// e.g. "Isaiah 1:1-9, 13-200" → multiple chapter:range calls
function getPassageWithCommas(ref) {
  // Split on ';' first (handled above), then within each segment handle commas
  const semiParts = ref.split(';').map(s => s.trim()).filter(Boolean);
  const allVerses = [];
  let lastBook = null;
  let lastCh = null;

  for (const semi of semiParts) {
    // Handle comma sub-ranges within a segment
    const commaParts = semi.split(',').map(s => s.trim()).filter(Boolean);

    for (let ci = 0; ci < commaParts.length; ci++) {
      const part = commaParts[ci];
      let parsed;

      if (ci === 0) {
        // First part: "Book Ch:V1-V2" or "Book Ch:V1-V2"
        parsed = parseRefSegment(part, lastBook);
      } else {
        // Continuation: "V1-V2" in same chapter, or "Ch:V1-V2"
        if (part.includes(':')) {
          // New chapter in same book
          const m = part.match(/^(\d+):(\d+)(?:-(\d+))?$/);
          if (m) {
            const ch = parseInt(m[1]);
            const v1 = parseInt(m[2]);
            const v2 = m[3] ? parseInt(m[3]) : v1;
            parsed = { book: lastBook, ch, v1, v2 };
          }
        } else {
          // Just verse range in last chapter
          const m = part.match(/^(\d+)(?:-(\d+))?$/);
          if (m && lastBook && lastCh) {
            parsed = { book: lastBook, ch: lastCh, v1: parseInt(m[1]), v2: m[2] ? parseInt(m[2]) : parseInt(m[1]) };
          }
        }
      }

      if (!parsed) continue;
      lastBook = parsed.book;
      lastCh = parsed.ch;
      if (APOCRYPHA.has(parsed.book)) return null;
      const verses = getVerses(parsed.book, parsed.ch, parsed.v1, parsed.v2);
      if (!verses) return null;
      allVerses.push(...verses);
    }
  }
  return allVerses.length > 0 ? allVerses : null;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const lect   = JSON.parse(fs.readFileSync(LECT_PATH, 'utf8'));
const lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));

// Collect missing refs
const missing = new Set();
for (const e of Object.values(lect)) {
  for (const svc of ['mp','ep']) {
    for (const p of ['first','second']) {
      const ref = e[svc] && e[svc][p];
      if (ref && ref.trim() && !lessons[ref]) missing.add(ref);
    }
  }
}
console.log('Missing refs:', missing.size);

let filled = 0, skipped = 0, failed = [];

for (const ref of missing) {
  const verses = getPassageWithCommas(ref);
  if (verses && verses.length > 0) {
    lessons[ref] = verses;
    filled++;
  } else {
    // Check if it's an Apocrypha ref (expected skip)
    const isApoc = APOCRYPHA.has(ref.split(/\s+\d/)[0].trim()) ||
                   [...APOCRYPHA].some(b => ref.startsWith(b));
    if (isApoc || ref.startsWith('Three Children')) {
      skipped++;
    } else {
      failed.push(ref);
    }
  }
}

fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons), 'utf8');
console.log(`Filled: ${filled} | Apocrypha skipped: ${skipped} | Still failed: ${failed.length}`);
if (failed.length <= 40) {
  console.log('\nFailed (non-Apocrypha):');
  failed.forEach(r => console.log(' ', r));
}
