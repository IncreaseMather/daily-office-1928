#!/usr/bin/env node
/**
 * reuse-lessons.js
 * For new lectionary refs that are :1-200 expansions or reformatted versions of
 * existing lessons.json entries, copy the data rather than re-fetching.
 *
 * Strategy: for each missing ref, check if lessons.json already has the same
 * passage under a different key. Matching logic:
 *   - "Book Ch:1-200" → reuse "Book Ch:1-N" for any N (same book/ch/start)
 *   - "Book Ch:V-200" → reuse "Book Ch:V-N" for any N (same book/ch/start)
 *   - "Ref; Ref2" → compose from each part
 */
const fs   = require('fs');
const path = require('path');

const LECT_PATH    = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');
const LESSONS_PATH = path.join(__dirname, '..', 'src', 'data', 'lessons.json');

const lect   = JSON.parse(fs.readFileSync(LECT_PATH, 'utf8'));
const lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));

// Collect all unique refs needed
const needed = new Set();
for (const e of Object.values(lect)) {
  for (const svc of ['mp','ep']) {
    for (const p of ['first','second']) {
      const ref = e[svc] && e[svc][p];
      if (ref && ref.trim() && !lessons[ref]) needed.add(ref);
    }
  }
}
console.log('Missing refs to resolve:', needed.size);

// Build index: book+chapter+verseStart → existing key
// e.g. "Isaiah:62:1" → ["Isaiah 62:1-7", ...]
const bookChVerseIndex = {};
for (const key of Object.keys(lessons)) {
  // Simple single-range refs like "Isaiah 62:1-7"
  const m = key.match(/^(.*?)\s+(\d+):(\d+)-(\d+)$/);
  if (m) {
    const idx = `${m[1].trim()}:${m[2]}:${m[3]}`;
    if (!bookChVerseIndex[idx]) bookChVerseIndex[idx] = [];
    bookChVerseIndex[idx].push(key);
  }
}

let reused = 0, couldNotReuse = [];

function tryReuse(ref) {
  // If it's a compound ref (semicolons), try to compose from parts
  if (ref.includes(';')) {
    const parts = ref.split(';').map(s => s.trim());
    const allVerses = [];
    for (const part of parts) {
      const partVerses = tryReuse(part);
      if (!partVerses) return null;
      allVerses.push(...partVerses);
    }
    return allVerses.length > 0 ? allVerses : null;
  }

  // Try exact match first
  if (lessons[ref]) return lessons[ref];

  // Parse the ref: "Book Ch:V1-V2"
  const m = ref.match(/^(.*?)\s+(\d+):(\d+)-(\d+)$/);
  if (!m) return null;
  const [, book, ch, vs, ve] = m;
  const bookCh = `${book.trim()}:${ch}:${vs}`;

  // Look up existing entries with same book:chapter:verseStart
  const candidates = bookChVerseIndex[bookCh] || [];
  if (candidates.length === 0) return null;

  // Pick the candidate with the most verses (longest range)
  let best = null;
  for (const cand of candidates) {
    const cm = cand.match(/^(.*?)\s+(\d+):(\d+)-(\d+)$/);
    if (!cm) continue;
    const candEnd = parseInt(cm[4], 10);
    const reqEnd  = parseInt(ve, 10);
    // Use if candidate end >= requested end, or if it's a :1-200 expansion
    if (reqEnd >= 100 || candEnd >= reqEnd) {
      if (!best || parseInt(best.match(/\d+$/)[0], 10) < candEnd) best = cand;
    }
  }

  return best ? lessons[best] : null;
}

for (const ref of needed) {
  const verses = tryReuse(ref);
  if (verses && verses.length > 0) {
    lessons[ref] = verses;
    reused++;
  } else {
    couldNotReuse.push(ref);
  }
}

console.log(`Reused: ${reused} | Still missing: ${couldNotReuse.length}`);
if (couldNotReuse.length <= 30) {
  console.log('\nStill need to fetch:');
  couldNotReuse.forEach(r => console.log(' ', r));
}

fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons), 'utf8');
console.log('\nSaved lessons.json');
