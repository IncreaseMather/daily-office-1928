#!/usr/bin/env node
/**
 * fix-lectionary-refs.js
 *
 * Fixes malformed references in lectionary.json where ":1-200" (or :1-150, :1-100)
 * was used as a pipeline shorthand for "rest of chapter" or "whole chapter".
 *
 * Rules:
 *   - A segment ending in ":1-200", ":1-150", or ":1-100" (whole chapter) → drop
 *     the verse range entirely, keeping just "Book Chapter"
 *   - A segment ending in ":N-200" (partial chapter, N > 1) → look up real last verse
 *     from KJV data and replace 200 with actual count
 *   - Psalm references are NOT touched (they have their own data)
 *   - After fixing individual segments, if a ref was "Book X; Book X+1" (same book,
 *     consecutive chapters) → collapse to "Book X-X+1"
 *
 * Usage: node scripts/fix-lectionary-refs.js
 */

'use strict';
const fs   = require('fs');
const path = require('path');

const LECT_PATH = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');
const KJV_PATH  = 'C:/Users/aliss/AppData/Local/Temp/kjv-full.json';

// ── Load KJV for chapter-verse-count lookup ──────────────────────────────────

const raw = fs.readFileSync(KJV_PATH, 'utf8').replace(/^\uFEFF/, '');
const kjvData = JSON.parse(raw); // [{abbrev, name, chapters:[string[]]}]

// Build name → chapters array map (full name, case-sensitive as used in lectionary)
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

const abbrevMap = {};
for (const book of kjvData) abbrevMap[book.abbrev] = book;

// Apocrypha chapter-verse-count lookup (derived from actual lessons.json data)
const APOCRYPHA_CHAPTER_LENGTHS = {
  'Baruch':       { 1:22, 2:35, 3:38, 4:37, 5:9 },
  'Wisdom':       { 1:15, 2:24, 3:19, 4:20, 5:23, 6:25, 7:30, 8:21, 9:18,
                    10:21, 11:26, 12:27, 13:19, 14:31, 15:19, 16:28, 17:21, 18:25, 19:22 },
  'Sirach':       { 1:30, 2:18, 3:16, 4:31, 5:15, 6:37, 7:36, 8:19, 9:16,
                    10:31, 11:28, 12:18, 13:26, 14:27, 15:20, 16:23, 17:24, 18:29, 19:30,
                    20:31, 21:28, 22:26, 23:28, 24:34, 25:12, 26:28, 27:29, 28:26, 29:28,
                    30:27, 31:31, 32:26, 33:33, 34:26, 35:20, 36:22, 37:31, 38:34, 39:35,
                    40:27, 41:23, 42:25, 43:33, 44:23, 45:26, 46:20, 47:25, 48:25, 49:16,
                    50:24, 51:30 },
  'Tobit':        { 1:22, 2:14, 3:17, 4:21, 5:22, 6:17, 7:18, 8:21, 9:6,
                    10:13, 11:18, 12:22, 13:18, 14:15 },
  'Judith':       { 1:16, 2:28, 3:10, 4:15, 5:24, 6:21, 7:32, 8:36, 9:14,
                    10:23, 11:23, 12:20, 13:20, 14:19, 15:13, 16:25 },
  '1 Maccabees':  { 1:64, 2:70, 3:60, 4:61, 5:68, 6:63, 7:50, 8:32, 9:73,
                    10:89, 11:74, 12:53, 13:53, 14:49, 15:41, 16:24 },
  '2 Maccabees':  { 1:36, 2:32, 3:40, 4:50, 5:27, 6:31, 7:42, 8:36, 9:29,
                    10:38, 11:38, 12:46, 13:26, 14:46, 15:39 },
  '1 Esdras':     { 1:58, 2:30, 3:24, 4:63, 5:73, 6:34, 7:15, 8:92, 9:55 },
  '2 Esdras':     { 1:40, 2:48, 3:36, 4:52, 5:56, 6:59, 7:140, 8:63, 9:47,
                    10:60, 11:46, 12:51, 13:58, 14:48, 15:63, 16:78 },
};

/** Return the number of verses in a given book+chapter (1-based). Returns null if unknown. */
function getChapterLength(bookName, chapter) {
  // Check Apocrypha lookup first
  if (APOCRYPHA_CHAPTER_LENGTHS[bookName]) {
    return APOCRYPHA_CHAPTER_LENGTHS[bookName][chapter] ?? null;
  }
  const abbrev = NAME_MAP[bookName];
  if (!abbrev) return null;
  const book = abbrevMap[abbrev];
  if (!book) return null;
  const ch = book.chapters[chapter - 1];
  return ch ? ch.length : null;
}

// ── Pattern matching ─────────────────────────────────────────────────────────

// Matches the suspicious high end-verse: e.g.  "Isaiah 62:1-200"  or  "Isaiah 9:18-200"
// group 1 = full book name (may include leading digits and spaces)
// group 2 = chapter number
// group 3 = start verse
// group 4 = the suspicious end verse (100/150/200)
const SUSPICIOUS_RE = /^((?:\d+\s+)?[A-Za-z][A-Za-z\s]*)?\s*(\d+):(\d+)-(100|150|200)$/;

// Detect psalm references
function isPsalmRef(seg) {
  return /^Psalm(s)?\s+\d/i.test(seg.trim());
}

/**
 * Fix a single semicolon-segment.
 * Returns { fixed: string, changed: boolean, note: string|null }
 */
function fixSegment(seg, prevBook) {
  seg = seg.trim();
  if (isPsalmRef(seg)) return { fixed: seg, changed: false, note: null };

  // Try to match: "Book Ch:V1-200" or continuation "Ch:V1-200" (prevBook inherited)
  // We accept Book may be empty for continuations like "4:1-200" after "Galatians 3:27-200"
  const m = seg.match(/^((?:(?:\d+\s+)?[A-Za-z][A-Za-z\s]*)\s+)?(\d+):(\d+)-(100|150|200)$/);
  if (!m) return { fixed: seg, changed: false, note: null };

  const bookPart = m[1] ? m[1].trim() : null;
  const bookName = bookPart || prevBook;
  const chapter  = parseInt(m[2], 10);
  const vStart   = parseInt(m[3], 10);
  // const highEnd  = parseInt(m[4], 10);  // 100/150/200 — we replace this

  if (!bookName) return { fixed: seg, changed: false, note: 'no book name resolved' };
  if (isPsalmRef((bookName + ' ' + chapter).trim())) return { fixed: seg, changed: false, note: null };

  const prefix = bookPart ? `${bookName} ` : '';  // keep book name if it was in this segment

  if (vStart === 1) {
    // Whole chapter shorthand → "Book Chapter"
    const fixed = `${prefix}${chapter}`.trim();
    const note  = `${seg} → ${fixed} (whole chapter)`;
    return { fixed, changed: true, note };
  } else {
    // Partial chapter → look up real last verse
    const lastVerse = getChapterLength(bookName, chapter);
    if (lastVerse === null) {
      // Apocrypha or unknown — leave as-is (will be handled by apocrypha pipeline)
      return { fixed: seg, changed: false, note: `could not resolve chapter length for ${bookName} ${chapter}` };
    }
    const fixed = `${prefix}${chapter}:${vStart}-${lastVerse}`.trim();
    const note  = `${seg} → ${fixed} (real last verse)`;
    return { fixed, changed: true, note };
  }
}

/**
 * Attempt to collapse "Book X; Book X+1" → "Book X-Y" for consecutive chapters.
 * Also collapses "Book X" (no verses) + "Book X+1" to "Book X-X+1".
 *
 * Only collapses when BOTH parts are whole-chapter refs with no verse ranges.
 */
function tryCollapse(parts) {
  if (parts.length < 2) return parts.join('; ');

  const result = [];
  let i = 0;
  while (i < parts.length) {
    const curr = parts[i].trim();

    // Match a whole-chapter ref: "Book N" or "Book N-M"
    const mCurr = curr.match(/^((?:\d+\s+)?[A-Za-z][A-Za-z\s]*)\s+(\d+)(?:-(\d+))?$/);
    if (mCurr && i + 1 < parts.length) {
      const next = parts[i + 1].trim();
      const mNext = next.match(/^((?:\d+\s+)?[A-Za-z][A-Za-z\s]*)\s+(\d+)(?:-(\d+))?$/);

      if (mNext &&
          mCurr[1].trim() === mNext[1].trim()) {
        // Same book — check if consecutive
        const currEnd   = mCurr[3] ? parseInt(mCurr[3], 10) : parseInt(mCurr[2], 10);
        const nextStart = parseInt(mNext[2], 10);
        if (nextStart === currEnd + 1) {
          const nextEnd = mNext[3] ? mNext[3] : mNext[2];
          const collapsed = `${mCurr[1].trim()} ${mCurr[2]}-${nextEnd}`;
          // Replace curr+next with collapsed and re-check
          parts.splice(i, 2, collapsed);
          continue; // re-check same position
        }
      }
    }
    result.push(curr);
    i++;
  }
  return result.join('; ');
}

/**
 * Fix a full reference string (may contain '; ' separating segments, and commas).
 * Returns { fixed: string, changed: boolean, notes: string[] }
 */
function fixRef(ref) {
  const notes = [];
  let changed = false;

  // Split on semicolons into segments
  const parts = ref.split(';').map(s => s.trim()).filter(Boolean);
  let lastBook = null;
  const fixedParts = [];

  for (const part of parts) {
    // Detect the book from this part (for carrying forward)
    const bookMatch = part.match(/^((?:\d+\s+)?[A-Za-z][A-Za-z\s]*)\s+\d/);
    const bookInPart = bookMatch ? bookMatch[1].trim() : null;

    // This part may have comma sub-ranges; only the last comma-sub may be malformed
    // e.g. "Amos 1:1-5, 13-200" — the "13-200" part is in the same segment
    // We handle commas by splitting and fixing the last sub only if it matches
    const commaParts = part.split(',').map(s => s.trim()).filter(Boolean);
    const fixedComma = [];
    let lastChapter = null;

    for (let ci = 0; ci < commaParts.length; ci++) {
      const cp = commaParts[ci];
      let result;

      if (ci === 0) {
        result = fixSegment(cp, lastBook);
        // Update lastBook and lastChapter from this first comma-part
        const bm = cp.match(/^((?:\d+\s+)?[A-Za-z][A-Za-z\s]*)\s+(\d+)/);
        if (bm) {
          lastBook = bm[1].trim();
          lastChapter = parseInt(bm[2], 10);
        }
      } else {
        // Continuation within same chapter, e.g. "13-200"
        // Build full ref for fixing: "Book Ch:V-END"
        const rangeMatch = cp.match(/^(\d+)-(100|150|200)$/);
        const chColonMatch = cp.match(/^(\d+):(\d+)-(100|150|200)$/);
        if (rangeMatch && lastBook && lastChapter !== null) {
          const synth = `${lastBook} ${lastChapter}:${rangeMatch[1]}-${rangeMatch[2]}`;
          result = fixSegment(synth, lastBook);
          if (result.changed) {
            // The fixed form may be "Book Ch:V1-VN" — extract just the verse part for comma continuation
            const m = result.fixed.match(/:(\d+-\d+)$/);
            if (m) {
              result.fixed = m[1]; // just "V1-VN" for comma continuation
            } else {
              // Collapsed to whole chapter — drop this comma part (it's now in the chapter ref)
              if (result.note) notes.push(result.note);
              changed = true;
              continue; // skip adding this comma part
            }
          } else {
            result = { fixed: cp, changed: false, note: null };
          }
        } else if (chColonMatch && lastBook) {
          const synth = `${lastBook} ${cp}`;
          result = fixSegment(synth, lastBook);
          if (result.changed) {
            const m = result.fixed.match(/\d+:(.+)$/);
            if (m) result.fixed = `${chColonMatch[1]}:${m[1]}`;
          }
        } else {
          result = { fixed: cp, changed: false, note: null };
        }
      }

      if (result.changed) changed = true;
      if (result.note) notes.push(result.note);
      fixedComma.push(result.fixed);
    }

    // Update lastBook from this part's book if detected
    if (bookInPart) lastBook = bookInPart;

    fixedParts.push(fixedComma.join(', '));
  }

  // Try collapsing consecutive whole-chapter semi-colon parts
  const collapsed = tryCollapse(fixedParts);
  if (collapsed !== fixedParts.join('; ')) {
    notes.push(`Collapsed consecutive chapters: [${fixedParts.join('; ')}] → ${collapsed}`);
    changed = true;
  }

  return { fixed: collapsed, changed, notes };
}

// ── Main ─────────────────────────────────────────────────────────────────────

const lect = JSON.parse(fs.readFileSync(LECT_PATH, 'utf8'));

let totalChanged = 0;
const changeLog = [];
const refMap = {}; // oldRef → newRef (for reporting)

for (const [dayKey, day] of Object.entries(lect)) {
  for (const svc of ['mp', 'ep']) {
    if (!day[svc]) continue;
    for (const part of ['first', 'second']) {
      const ref = day[svc][part];
      if (!ref) continue;

      const { fixed, changed, notes } = fixRef(ref);
      if (changed && fixed !== ref) {
        day[svc][part] = fixed;
        totalChanged++;
        refMap[ref] = fixed;
        changeLog.push({ dayKey, svc, part, from: ref, to: fixed, notes });
      }
    }
  }
}

// Write back
fs.writeFileSync(LECT_PATH, JSON.stringify(lect, null, 2), 'utf8');

console.log('═══════════════════════════════════════════════════════');
console.log('  FIX-LECTIONARY-REFS SUMMARY');
console.log('═══════════════════════════════════════════════════════\n');
console.log(`Total reference strings changed: ${totalChanged}`);
console.log(`Unique old→new mappings: ${Object.keys(refMap).length}\n`);

console.log('── All changes ─────────────────────────────────────────\n');
for (const { dayKey, svc, part, from, to, notes } of changeLog) {
  console.log(`  [${dayKey} ${svc}.${part}]`);
  console.log(`    FROM: ${from}`);
  console.log(`    TO:   ${to}`);
  notes.forEach(n => console.log(`    NOTE: ${n}`));
  console.log();
}

console.log(`\nlectionary.json saved with ${totalChanged} fixes.`);
