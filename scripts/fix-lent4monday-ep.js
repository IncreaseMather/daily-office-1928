#!/usr/bin/env node
/**
 * fix-lent4monday-ep.js
 * 1. Updates lectionary.json lent4Monday EP to correct 1945 BCP lessons
 * 2. Fetches those two passages from bible-api.com
 * 3. Adds them to lessons.json
 */
const fs    = require('fs');
const path  = require('path');
const https = require('https');

const LECTIONARY_PATH = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');
const LESSONS_PATH    = path.join(__dirname, '..', 'src', 'data', 'lessons.json');

const CORRECT_EP = {
  first:  'Jeremiah 13:15-27',
  second: 'Mark 12:18-27',
};

function httpGet(url, redirectsLeft = 8) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : require('http');
    const req = mod.get(url, { headers: { 'User-Agent': 'DailyOffice-BCP/1.0' } }, res => {
      const loc = res.headers.location;
      if ([301,302,303,307,308].includes(res.statusCode) && loc && redirectsLeft > 0) {
        return httpGet(loc.startsWith('http') ? loc : new URL(loc, url).href, redirectsLeft - 1)
          .then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let body = '';
      res.setEncoding('utf8');
      res.on('data', c => body += c);
      res.on('end', () => resolve(body));
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error(`Timeout: ${url}`)));
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchPassage(ref) {
  // Handle possible verse-count mismatch by decrementing end verse on 404
  const m = ref.match(/^(.+?) (\d+):(\d+)-(\d+)$/);
  if (!m) throw new Error('Cannot parse ref: ' + ref);
  const [, book, chStr, startStr, endStr] = m;
  let end = parseInt(endStr, 10);
  const chapter = parseInt(chStr, 10);
  const verseStart = parseInt(startStr, 10);

  while (end >= verseStart) {
    const passage = `${book} ${chapter}:${verseStart}-${end}`;
    const url = `https://bible-api.com/${encodeURIComponent(passage)}?translation=kjv`;
    try {
      const body = await httpGet(url);
      const data = JSON.parse(body);
      if (data.error || data.verses.length === 0) { end--; await sleep(1000); continue; }
      return { ref, verses: data.verses.map(v => ({ verse: v.verse, text: v.text.trim() })) };
    } catch (err) {
      if (err.message.includes('HTTP 404') && end > verseStart) { end--; await sleep(1000); continue; }
      throw err;
    }
  }
  throw new Error('No verses returned for ' + ref);
}

async function main() {
  // ── 1. Update lectionary.json ────────────────────────────────────────────
  const lectionary = JSON.parse(fs.readFileSync(LECTIONARY_PATH, 'utf8'));
  const prev = lectionary['lent4Monday'].ep;
  lectionary['lent4Monday'].ep = CORRECT_EP;
  fs.writeFileSync(LECTIONARY_PATH, JSON.stringify(lectionary, null, 2), 'utf8');
  console.log('lectionary.json updated:');
  console.log('  was:', JSON.stringify(prev));
  console.log('  now:', JSON.stringify(CORRECT_EP));

  // ── 2. Fetch missing passages ────────────────────────────────────────────
  const lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));

  for (const ref of [CORRECT_EP.first, CORRECT_EP.second]) {
    if (lessons[ref]) {
      console.log(`\n${ref}: already in lessons.json (${lessons[ref].length} verses) — skipping fetch`);
      continue;
    }
    console.log(`\nFetching: ${ref} ...`);
    await sleep(3000);
    const result = await fetchPassage(ref);
    lessons[ref] = result.verses;
    console.log(`  OK — ${result.verses.length} verses`);
    console.log(`  First verse: "${result.verses[0].text.slice(0, 80)}"`);
  }

  fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons), 'utf8');
  console.log('\nlessons.json saved.');

  // ── 3. Verify ────────────────────────────────────────────────────────────
  console.log('\n── Verification ─────────────────────────');
  const updated = JSON.parse(fs.readFileSync(LECTIONARY_PATH, 'utf8'));
  const ep = updated['lent4Monday'].ep;
  console.log('lent4Monday EP first :', ep.first);
  console.log('lent4Monday EP second:', ep.second);

  const updatedLessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));
  for (const ref of [ep.first, ep.second]) {
    const entry = updatedLessons[ref];
    if (entry && entry.length > 0) {
      console.log(`\n${ref}: ${entry.length} verses`);
      console.log(`  v${entry[0].verse}: "${entry[0].text.slice(0, 100)}"`);
    } else {
      console.log(`\n${ref}: MISSING from lessons.json`);
    }
  }
}

main().catch(err => { console.error('Fatal:', err.message); process.exit(1); });
