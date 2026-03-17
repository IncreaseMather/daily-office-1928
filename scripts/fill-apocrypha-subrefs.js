#!/usr/bin/env node
/**
 * fill-apocrypha-subrefs.js
 * Extracts verse sub-ranges from existing whole-chapter Apocrypha entries
 * in lessons.json to populate missing specific-verse refs.
 */
const fs   = require('fs');
const path = require('path');

const LECT_PATH    = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');
const LESSONS_PATH = path.join(__dirname, '..', 'src', 'data', 'lessons.json');

const lect   = JSON.parse(fs.readFileSync(LECT_PATH, 'utf8'));
const lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));

// Build an index: "Book Ch" → sorted array of {verseNum, text}
// from all existing lessons entries for that book/chapter
const chapterIndex = {};
for (const [ref, verses] of Object.entries(lessons)) {
  if (!Array.isArray(verses)) continue;
  // Parse "Book Ch:V1-V2" → book + chapter
  const m = ref.match(/^(.*?)\s+(\d+):(\d+)/);
  if (!m) continue;
  const book = m[1].trim();
  const ch   = parseInt(m[2]);
  const key  = `${book}:${ch}`;
  if (!chapterIndex[key]) chapterIndex[key] = {};
  for (const v of verses) {
    chapterIndex[key][v.verse] = v.text;
  }
}

// Get verses for a range from the index
function extractVerses(book, ch, v1, v2) {
  const key = `${book}:${ch}`;
  const chData = chapterIndex[key];
  if (!chData) return null;
  const result = [];
  for (let v = v1; v <= v2; v++) {
    if (chData[v]) result.push({ verse: v, text: chData[v] });
  }
  return result.length > 0 ? result : null;
}

// Parse and extract a potentially complex ref
function extractPassage(ref) {
  // Handle "Three Children" specially — will be handled manually
  if (ref.includes('Three Children')) return null;

  const semiParts = ref.split(';').map(s => s.trim()).filter(Boolean);
  const allVerses = [];
  let lastBook = null, lastCh = null;

  for (const semi of semiParts) {
    const commaParts = semi.split(',').map(s => s.trim()).filter(Boolean);
    for (let ci = 0; ci < commaParts.length; ci++) {
      const part = commaParts[ci];
      let book, ch, v1, v2;
      if (ci === 0) {
        const m1 = part.match(/^(.*?)\s+(\d+):(\d+)-(\d+)$/);
        const m2 = part.match(/^(.*?)\s+(\d+):(\d+)$/);
        if (m1) { book=m1[1].trim(); ch=+m1[2]; v1=+m1[3]; v2=+m1[4]; }
        else if (m2) { book=m2[1].trim(); ch=+m2[2]; v1=+m2[3]; v2=+m2[3]; }
        else continue;
      } else {
        // Continuation: either "Ch:V1-V2" or "V1-V2" in same chapter
        const m3 = part.match(/^(\d+):(\d+)-(\d+)$/);
        const m4 = part.match(/^(\d+):(\d+)$/);
        const m5 = part.match(/^(\d+)-(\d+)$/);
        const m6 = part.match(/^(\d+)$/);
        if (m3) { book=lastBook; ch=+m3[1]; v1=+m3[2]; v2=+m3[3]; }
        else if (m4) { book=lastBook; ch=+m4[1]; v1=+m4[2]; v2=+m4[2]; }
        else if (m5 && lastCh) { book=lastBook; ch=lastCh; v1=+m5[1]; v2=+m5[2]; }
        else if (m6 && lastCh) { book=lastBook; ch=lastCh; v1=+m6[1]; v2=+m6[1]; }
        else continue;
      }
      lastBook = book; lastCh = ch;
      // Handle :1-200 → use all available verses
      const verses = extractVerses(book, ch, v1, Math.min(v2, 300));
      if (!verses || verses.length === 0) return null;
      allVerses.push(...verses);
    }
  }
  return allVerses.length > 0 ? allVerses : null;
}

// Collect missing
const missing = new Set();
for (const e of Object.values(lect)) {
  for (const svc of ['mp','ep']) {
    for (const p of ['first','second']) {
      const ref = e[svc] && e[svc][p];
      if (ref && ref.trim() && !lessons[ref]) missing.add(ref);
    }
  }
}
console.log('Missing:', missing.size);

let filled = 0, stillMissing = [];
for (const ref of missing) {
  const verses = extractPassage(ref);
  if (verses && verses.length > 0) {
    lessons[ref] = verses;
    filled++;
    console.log('Filled:', ref, '(' + verses.length + ' verses)');
  } else {
    stillMissing.push(ref);
  }
}

fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons), 'utf8');
console.log(`\nFilled: ${filled} | Still missing: ${stillMissing.length}`);
stillMissing.forEach(r => console.log(' MISSING:', r));
