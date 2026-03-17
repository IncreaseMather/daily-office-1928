#!/usr/bin/env node
/**
 * fetch-lessons.js
 * Fetches KJV text (including Apocrypha) for every lesson reference in
 * src/data/lectionary.json using bible-api.com and saves to src/data/lessons.json.
 *
 * Usage: node scripts/fetch-lessons.js
 * Saves progress every 10 lessons. Safe to interrupt and resume.
 */

const fs   = require('fs');
const path = require('path');
const https = require('https');

const LECTIONARY_PATH = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');
const LESSONS_PATH    = path.join(__dirname, '..', 'src', 'data', 'lessons.json');
const DELAY_MS        = 5000;  // ms between requests — bible-api.com rate-limits aggressively
const RETRY_ATTEMPTS  = 3;
const RETRY_DELAY_MS  = 3000;
const SAVE_EVERY      = 10;

// ── HTTP helpers ─────────────────────────────────────────────────────────────

function httpGet(url, redirectsLeft = 8) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : require('http');
    const req = mod.get(url, { headers: { 'User-Agent': 'DailyOffice-BCP/1.0' } }, res => {
      const loc = res.headers.location;
      if ([301, 302, 303, 307, 308].includes(res.statusCode) && loc && redirectsLeft > 0) {
        const next = loc.startsWith('http') ? loc : new URL(loc, url).href;
        return httpGet(next, redirectsLeft - 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error(`Timeout: ${url}`)));
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithRetry(url) {
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      return await httpGet(url);
    } catch (err) {
      if (attempt < RETRY_ATTEMPTS) {
        await sleep(RETRY_DELAY_MS);
      } else {
        throw err;
      }
    }
  }
}

// ── Reference parsing ────────────────────────────────────────────────────────
//
// Refs in lectionary.json use full book names (no abbreviations).
// Multi-range refs use semicolons: "Rev 19:17-21; 20:1-15"
// Comma sub-ranges (same chapter): "Exod 28:1-5, 29-43"
//
// Strategy: split on ';', identify the book name in the first segment,
// carry it forward for continuation segments.

function parseRef(refStr) {
  const segments = refStr.split(';').map(s => s.trim()).filter(Boolean);
  const ranges = [];
  let currentBook = null;

  for (const seg of segments) {
    // Try to extract "BookName chapter:verses" from this segment
    // Book names can include spaces and digits: "1 Corinthians", "Song of Solomon", "2 Esdras"
    const m = seg.match(/^((?:\d+\s+)?[A-Za-z][A-Za-z\s]*?)\s+(\d[\d:,\-\s]*)$/);
    if (m) {
      currentBook = m[1].trim();
      const rangePart = m[2].trim();
      parseChapterRanges(currentBook, rangePart, ranges);
    } else if (currentBook) {
      // Continuation: just chapter:verse range
      parseChapterRanges(currentBook, seg, ranges);
    }
  }
  return ranges;
}

function parseChapterRanges(book, rangePart, out) {
  // Split on commas for sub-ranges within same chapter
  const parts = rangePart.split(',').map(s => s.trim()).filter(Boolean);
  let lastChapter = null;
  for (const part of parts) {
    if (part.includes(':')) {
      const [chStr, verseStr] = part.split(':');
      const chapter = parseInt(chStr, 10);
      lastChapter = chapter;
      const [vs, ve] = parseVerseRange(verseStr);
      out.push({ book, chapter, verseStart: vs, verseEnd: ve });
    } else if (lastChapter !== null) {
      // Verse-only continuation in same chapter, e.g. "29-43"
      const [vs, ve] = parseVerseRange(part);
      out.push({ book, chapter: lastChapter, verseStart: vs, verseEnd: ve });
    } else {
      // No chapter seen yet and no colon — single-chapter book (Philemon, Jude, 2 John, 3 John, etc.)
      // Treat as chapter 1, verse range
      const [vs, ve] = parseVerseRange(part);
      if (!isNaN(vs)) {
        lastChapter = 1;
        out.push({ book, chapter: 1, verseStart: vs, verseEnd: ve });
      }
    }
  }
}

function parseVerseRange(str) {
  str = str.trim();
  const dash = str.indexOf('-');
  if (dash === -1) { const v = parseInt(str, 10); return [v, v]; }
  return [parseInt(str.slice(0, dash), 10), parseInt(str.slice(dash + 1), 10)];
}

// ── Fetch a single lesson passage ────────────────────────────────────────────
//
// bible-api.com format: https://bible-api.com/{reference}?translation=kjv
// Response: { reference, verses: [{book_id, book_name, chapter, verse, text}], text }
// On 404 (end verse out of range), retry with decremented end verse.

async function fetchRange(book, chapter, verseStart, verseEnd) {
  let end = verseEnd;
  while (end >= verseStart) {
    const passageStr = `${book} ${chapter}:${verseStart}-${end}`;
    const url = `https://bible-api.com/${encodeURIComponent(passageStr)}?translation=kjv`;
    let body;
    try {
      body = await fetchWithRetry(url);
    } catch (err) {
      if (err.message.includes('HTTP 404') && end > verseStart) {
        end--;
        await sleep(500);
        continue;
      }
      throw err;
    }
    const data = JSON.parse(body);
    if (data.error) {
      if (end > verseStart) { end--; await sleep(500); continue; }
      throw new Error(`API error for "${passageStr}": ${data.error}`);
    }
    if (data.verses.length === 0 && end > verseStart) { end--; await sleep(500); continue; }
    return data.verses.map(v => ({ verse: v.verse, text: v.text.trim() }));
  }
  return [];
}

async function fetchPassage(refStr) {
  const ranges = parseRef(refStr);
  if (ranges.length === 0) throw new Error(`Cannot parse: "${refStr}"`);

  let allVerses = [];

  for (const { book, chapter, verseStart, verseEnd } of ranges) {
    const verses = await fetchRange(book, chapter, verseStart, verseEnd);
    allVerses = allVerses.concat(verses);
    if (ranges.length > 1) await sleep(1000); // extra courtesy delay between sub-ranges
  }

  return allVerses;
}

// ── Collect all unique refs from lectionary ──────────────────────────────────

function collectAllRefs(lectionary) {
  const refs = new Set();
  for (const day of Object.values(lectionary)) {
    for (const session of ['mp', 'ep']) {
      if (!day[session]) continue;
      if (day[session].first)  refs.add(day[session].first);
      if (day[session].second) refs.add(day[session].second);
    }
  }
  return Array.from(refs).sort();
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const lectionary = JSON.parse(fs.readFileSync(LECTIONARY_PATH, 'utf8'));

  let lessons = {};
  if (fs.existsSync(LESSONS_PATH)) {
    try {
      lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));
      console.log(`Resuming: ${Object.keys(lessons).length} lessons already fetched.`);
    } catch (_) {
      console.log('Starting fresh (could not read existing lessons.json).');
    }
  }

  const allRefs  = collectAllRefs(lectionary);
  const pending  = allRefs.filter(ref => !lessons[ref]);
  const total    = allRefs.length;
  const alreadyDone = total - pending.length;

  console.log(`Total unique refs: ${total} | Already done: ${alreadyDone} | Pending: ${pending.length}\n`);

  let successCount = alreadyDone;
  const failed = [];

  for (let i = 0; i < pending.length; i++) {
    const ref = pending[i];
    const n   = alreadyDone + i + 1;
    process.stdout.write(`[${n}/${total}] ${ref} ... `);

    try {
      const verses = await fetchPassage(ref);
      if (verses.length === 0) {
        console.log('WARN: 0 verses returned');
        failed.push(ref);
      } else {
        lessons[ref] = verses;
        successCount++;
        console.log(`OK (${verses.length} verses)`);
      }
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      failed.push(ref);
    }

    if ((i + 1) % SAVE_EVERY === 0) {
      fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons), 'utf8');
      console.log(`  -- progress saved (${successCount} total) --`);
    }

    await sleep(DELAY_MS);
  }

  // Final save
  fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons), 'utf8');

  console.log('\n═══ SUMMARY ═══');
  console.log(`Fetched: ${successCount}/${total}   Failed: ${failed.length}`);
  if (failed.length > 0) {
    console.log('\nFailed refs:');
    failed.forEach(r => console.log('  -', r));
  }
  if (failed.length === 0) console.log('ALL LESSONS FETCHED ✓');
}

main().catch(err => {
  console.error('\nFatal:', err.message);
  process.exit(1);
});
