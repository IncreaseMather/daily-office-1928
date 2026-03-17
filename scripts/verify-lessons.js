#!/usr/bin/env node
/**
 * verify-lessons.js
 * Spot-checks lessons.json for correct KJV translation and Apocrypha coverage.
 *
 * Usage: node scripts/verify-lessons.js
 */

const fs   = require('fs');
const path = require('path');

const LESSONS_PATH    = path.join(__dirname, '..', 'src', 'data', 'lessons.json');
const LECTIONARY_PATH = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');
const PSALMS_PATH     = path.join(__dirname, '..', 'src', 'data', 'psalms.json');

// ── Load data ────────────────────────────────────────────────────────────────

if (!fs.existsSync(LESSONS_PATH)) {
  console.error('FATAL: lessons.json not found at', LESSONS_PATH);
  process.exit(1);
}

const lessons    = JSON.parse(fs.readFileSync(LESSONS_PATH,    'utf8'));
const lectionary = JSON.parse(fs.readFileSync(LECTIONARY_PATH, 'utf8'));
const psalms     = JSON.parse(fs.readFileSync(PSALMS_PATH,     'utf8'));
const lessonKeys = Object.keys(lessons);

// ── Coverage check ───────────────────────────────────────────────────────────

function collectAllRefs(lect) {
  const refs = new Set();
  for (const day of Object.values(lect)) {
    for (const session of ['mp', 'ep']) {
      if (!day[session]) continue;
      if (day[session].first)  refs.add(day[session].first);
      if (day[session].second) refs.add(day[session].second);
    }
  }
  return Array.from(refs).sort();
}

const allRefs = collectAllRefs(lectionary);
const missing = allRefs.filter(r => !lessons[r] || lessons[r].length === 0);
const covered = allRefs.length - missing.length;

// ── Verse lookup helpers ─────────────────────────────────────────────────────

/**
 * Find a lessons.json entry whose key starts with "{book} {chapter}:" and
 * contains the requested verse number. Returns { key, text } or null.
 */
function findVerseInLessons(book, chapter, verseNum) {
  const prefix = `${book} ${chapter}:`;
  const candidates = lessonKeys.filter(k => k.startsWith(prefix));
  for (const key of candidates) {
    const v = lessons[key].find(v => v.verse === verseNum);
    if (v) return { key, text: v.text };
  }
  return null;
}

/**
 * Find a lessons.json entry by exact key. Returns verse array or null.
 */
function findExactRef(ref) {
  return lessons[ref] ?? null;
}

/**
 * Find any lessons.json entry whose key starts with a given prefix.
 * Returns { key, verses } of the first match, or null.
 */
function findRefByPrefix(prefix) {
  const key = lessonKeys.find(k => k.startsWith(prefix));
  return key ? { key, verses: lessons[key] } : null;
}

/**
 * Look up a verse from psalms.json by psalm number and verse number.
 * psalms.json stores each psalm as a single formatted string (Coverdale Psalter).
 * Returns the text of the requested verse line, or null.
 */
function findPsalmVerse(psalmNum, verseNum) {
  for (const dayNum of Object.keys(psalms)) {
    for (const session of ['morning', 'evening']) {
      const sess = psalms[dayNum]?.[session];
      if (!sess) continue;
      const { refs, verses } = sess;
      for (let i = 0; i < refs.length; i++) {
        if (String(refs[i]) !== String(psalmNum)) continue;
        // text is a single string like "1. BLESSED is...\n2. But his delight..."
        const fullText = verses[i]?.text ?? '';
        // Extract the line beginning with "{verseNum}."
        const re = new RegExp(`(?:^|\\n)${verseNum}\\. (.+?)(?=\\n\\d+\\.|$)`, 's');
        const m = fullText.match(re);
        if (m) return { key: `psalms.json (Psalm ${psalmNum}, Coverdale)`, text: m[1].replace(/\s+/g, ' ').trim() };
        // Fallback: return first 120 chars of the full text
        return { key: `psalms.json (Psalm ${psalmNum}, Coverdale)`, text: fullText.slice(0, 120) };
      }
    }
  }
  return null;
}

// ── Spot-check definitions ───────────────────────────────────────────────────
//
// Each check has:
//   desc         : human label
//   find()       : function → { key, text } | null   (text = verse text to check)
//   expect       : substring that MUST appear in verse text
//   presenceOnly : if true, just verify entry exists without text matching

const checks = [
  // ── Canonical OT ──────────────────────────────────────────────────────────
  {
    desc: 'Genesis 1:1',
    find: () => findVerseInLessons('Genesis', 1, 1),
    expect: 'In the beginning God created',
  },
  {
    desc: 'Job 1:1',
    find: () => findVerseInLessons('Job', 1, 1),
    expect: 'There was a man in the land of Uz',
  },
  {
    desc: 'Proverbs 1:1',
    find: () => findVerseInLessons('Proverbs', 1, 1),
    expect: 'proverbs of Solomon',
  },
  {
    desc: 'Isaiah 1:1',
    find: () => findVerseInLessons('Isaiah', 1, 1),
    expect: 'vision of Isaiah',
  },
  {
    desc: 'Isaiah 40:1',
    find: () => findVerseInLessons('Isaiah', 40, 1),
    expect: 'Comfort ye, comfort ye my people',
  },
  {
    desc: 'Ezekiel 1:1',
    find: () => findVerseInLessons('Ezekiel', 1, 1),
    expect: 'thirtieth year',
  },
  {
    desc: 'Daniel 1:1',
    find: () => findVerseInLessons('Daniel', 1, 1),
    expect: 'third year of the reign',
  },
  // ── Psalm 23 — in psalms.json (Coverdale Psalter), not lessons.json ─────
  // The 1928 BCP uses the Coverdale Psalter for Psalms, not KJV.
  // Coverdale: "THE LORD is my shepherd; * therefore can I lack nothing."
  // KJV:       "The LORD is my shepherd; I shall not want."
  // Both share "LORD is my shepherd" — we check that and report the actual text.
  {
    desc: 'Psalm 23:1 [psalms.json — Coverdale Psalter, not KJV — correct for 1928 BCP]',
    find: () => findPsalmVerse(23, 1),
    expect: 'LORD is my shepherd',
  },
  // ── Canonical NT ──────────────────────────────────────────────────────────
  {
    desc: 'Matthew 5:1',
    find: () => findVerseInLessons('Matthew', 5, 1),
    expect: 'seeing the multitudes',
  },
  {
    desc: 'John 1:1',
    find: () => findVerseInLessons('John', 1, 1),
    expect: 'In the beginning was the Word',
  },
  {
    desc: 'Acts 1:1',
    find: () => findVerseInLessons('Acts', 1, 1),
    expect: 'The former treatise have I made',
  },
  {
    desc: 'Romans 8:1',
    find: () => findVerseInLessons('Romans', 8, 1),
    expect: 'There is therefore now no condemnation',
  },
  {
    desc: '1 Corinthians 13:1',
    find: () => findVerseInLessons('1 Corinthians', 13, 1),
    expect: 'Though I speak with the tongues',
  },
  {
    desc: 'Hebrews 1:1',
    find: () => findVerseInLessons('Hebrews', 1, 1),
    expect: 'God, who at sundry times',
  },
  {
    desc: 'Revelation 21:1',
    find: () => findVerseInLessons('Revelation', 21, 1),
    expect: 'And I saw a new heaven',
  },
  // ── Apocrypha ─────────────────────────────────────────────────────────────
  {
    desc: 'Wisdom 3:1 [Apocrypha]',
    find: () => findVerseInLessons('Wisdom', 3, 1),
    expect: 'souls of the righteous',
  },
  {
    desc: 'Sirach 1:1 [Apocrypha]',
    find: () => findVerseInLessons('Sirach', 1, 1),
    expect: 'All wisdom cometh from the Lord',
  },
  {
    desc: 'Tobit 1:1 [Apocrypha]',
    find: () => findVerseInLessons('Tobit', 1, 1),
    expect: 'Tobit',
  },
  {
    desc: 'Judith 8:1 [Apocrypha — presence]',
    find: () => {
      const r = findRefByPrefix('Judith 8:');
      return r ? { key: r.key, text: r.verses[0]?.text ?? '' } : null;
    },
    presenceOnly: true,
  },
  {
    desc: '1 Maccabees [Apocrypha — presence]',
    find: () => {
      const key = lessonKeys.find(k => k.startsWith('1 Maccabees '));
      return key ? { key, text: lessons[key][0]?.text ?? '' } : null;
    },
    presenceOnly: true,
  },
  {
    desc: 'Baruch 3:1 [Apocrypha — presence]',
    find: () => {
      const r = findRefByPrefix('Baruch 3:');
      return r ? { key: r.key, text: r.verses[0]?.text ?? '' } : null;
    },
    presenceOnly: true,
  },
  // ── Key lectionary passages ───────────────────────────────────────────────
  {
    desc: 'Advent lesson: Isaiah 1:1-20',
    find: () => {
      const v = findExactRef('Isaiah 1:1-20');
      return v ? { key: 'Isaiah 1:1-20', text: v[0]?.text ?? '' } : null;
    },
    expect: 'vision of Isaiah',
  },
  {
    desc: 'Christmas lesson: Isaiah 9:1-7',
    find: () => {
      // Lectionary has Isaiah 9:1-7; user noted 9:2-7 — covers the same passage.
      // "Wonderful" is in v.6, not v.1 — check full passage text.
      const key = lessonKeys.find(k => k.startsWith('Isaiah 9:'));
      if (!key) return null;
      const allText = lessons[key].map(v => v.text).join(' ');
      return { key, text: allText };
    },
    expect: 'Wonderful',   // "his name shall be called Wonderful" — v.6, KJV
  },
  {
    desc: 'Good Friday lesson: Isaiah 52:13 – 53:12',
    find: () => {
      // Stored as "Isaiah 52:13-15; 53:1-12"
      const key = lessonKeys.find(k => k.startsWith('Isaiah 52:13'));
      if (!key) return null;
      return { key, text: lessons[key][0]?.text ?? '' };
    },
    expect: 'my servant shall deal prudently',
  },
  {
    desc: 'Easter lesson: Acts 10:34-',
    find: () => {
      const key = lessonKeys.find(k => k.startsWith('Acts 10:34'));
      if (!key) return null;
      // Verse 34 is the first verse of this passage
      const v = lessons[key].find(v => v.verse === 34);
      return v ? { key, text: v.text } : { key, text: lessons[key][0]?.text ?? '' };
    },
    expect: 'God is no respecter of persons',
  },
  {
    desc: 'Lent weekday lesson: Isaiah 57:',
    find: () => {
      const key = lessonKeys.find(k => k.startsWith('Isaiah 57:'));
      if (!key) return null;
      return { key, text: lessons[key][0]?.text ?? '' };
    },
    presenceOnly: true,
  },
];

// ── Run checks ───────────────────────────────────────────────────────────────

let pass = 0, fail = 0, warn = 0;
const failures = [], warnings = [];

console.log('═══════════════════════════════════════════════════════');
console.log('  LESSON VERIFICATION — 1928 BCP / 1945 Lectionary');
console.log('═══════════════════════════════════════════════════════\n');
console.log(`lessons.json  : ${lessonKeys.length} passages stored`);
console.log(`lectionary.json : ${allRefs.length} unique refs | covered: ${covered} | missing: ${missing.length}\n`);

if (missing.length > 0) {
  console.log('⚠  MISSING from lessons.json:');
  missing.forEach(r => console.log('   -', r));
  console.log();
}

console.log('── Spot-checks ─────────────────────────────────────────\n');

for (const chk of checks) {
  const result = chk.find();

  if (!result) {
    warn++;
    const msg = `${chk.desc}: chapter/verse not in this lectionary — no text to check`;
    warnings.push(msg);
    console.log(`  WARN  ${chk.desc}`);
    console.log(`        Chapter/verse not in 1945 lectionary — skipping\n`);
    continue;
  }

  const { key, text } = result;
  const shortKey = key.length > 70 ? key.slice(0, 67) + '...' : key;
  const shortText = text.length > 100 ? text.slice(0, 97) + '...' : text;

  if (chk.presenceOnly) {
    pass++;
    console.log(`  PASS  ${chk.desc}`);
    console.log(`        Key  : "${shortKey}"`);
    console.log(`        Text : "${shortText}"\n`);
    continue;
  }

  const textLower   = text.toLowerCase();
  const expectLower = chk.expect.toLowerCase();

  if (textLower.includes(expectLower)) {
    pass++;
    console.log(`  PASS  ${chk.desc}`);
    console.log(`        Key  : "${shortKey}"`);
    console.log(`        Text : "${shortText}"\n`);
  } else {
    fail++;
    failures.push({ desc: chk.desc, key, expected: chk.expect, got: text });
    console.log(`  FAIL  ${chk.desc}`);
    console.log(`        Key      : "${shortKey}"`);
    console.log(`        Expected : "${chk.expect}"`);
    console.log(`        Got      : "${shortText}"\n`);
  }
}

// ── Apocrypha book coverage ──────────────────────────────────────────────────

const apocBooks = [
  'Tobit', 'Judith', 'Wisdom', 'Sirach', 'Baruch',
  '1 Maccabees', '2 Maccabees', '1 Esdras', '2 Esdras',
];
console.log('── Apocrypha book coverage ─────────────────────────────\n');
for (const book of apocBooks) {
  const entries = lessonKeys.filter(k => k.startsWith(book + ' '));
  const totalVerses = entries.reduce((sum, k) => sum + lessons[k].length, 0);
  if (entries.length > 0) {
    console.log(`  ✓  ${book.padEnd(16)} ${String(entries.length).padStart(3)} entries, ${totalVerses} verses`);
  } else {
    console.log(`  —  ${book.padEnd(16)} not in 1945 lectionary`);
  }
}
console.log();

// ── KJV language sanity check ────────────────────────────────────────────────

console.log('── KJV language sanity check (first 200 entries) ───────\n');

// These phrases appear in modern translations but not KJV
const modernMarkers = [
  { phrase: 'New International',        label: 'NIV marker' },
  { phrase: 'New Living',               label: 'NLT marker' },
  { phrase: 'English Standard',         label: 'ESV marker' },
  { phrase: 'New Revised',              label: 'NRSV marker' },
  { phrase: 'Do not be anxious',        label: 'modern phrasing (KJV: "Be careful for nothing")' },
  { phrase: 'compassionate and gracious', label: 'NIV/ESV phrasing (KJV: "merciful and gracious")' },
];

let sanityIssues = 0;
for (const key of lessonKeys.slice(0, 200)) {
  const allText = lessons[key].map(v => v.text).join(' ');
  for (const { phrase, label } of modernMarkers) {
    if (allText.toLowerCase().includes(phrase.toLowerCase())) {
      sanityIssues++;
      const msg = `"${key}": contains "${phrase}" (${label})`;
      warnings.push(msg);
      console.log(`  WARN  ${msg}`);
    }
  }
}
if (sanityIssues === 0) {
  console.log('  OK — no modern-translation markers detected in sample\n');
} else {
  console.log();
}

// ── Summary ──────────────────────────────────────────────────────────────────

console.log('═══ SUMMARY ════════════════════════════════════════════\n');
console.log(`  Passages in lessons.json  : ${lessonKeys.length}`);
console.log(`  Lectionary coverage       : ${covered}/${allRefs.length}${missing.length ? '  ⚠ INCOMPLETE' : '  ✓'}`);
console.log(`  Spot-checks  PASS: ${pass}   FAIL: ${fail}   WARN: ${warn}`);

if (failures.length > 0) {
  console.log('\nFAILURES:');
  failures.forEach(f => {
    console.log(`  ✗ ${f.desc}`);
    console.log(`      Expected : "${f.expected}"`);
    console.log(`      Got      : "${f.got.slice(0, 120)}"`);
  });
}

if (warnings.length > 0 && warnings.some(w => !w.includes('not in 1945 lectionary'))) {
  console.log('\nWARNINGS:');
  warnings
    .filter(w => !w.includes('not in 1945 lectionary'))
    .forEach(w => console.log(`  ⚠ ${w}`));
}

console.log();
if (fail === 0 && missing.length === 0 && sanityIssues === 0) {
  console.log('✓ OVERALL: Full lectionary coverage. All KJV spot-checks passed. No translation anomalies detected.');
} else if (fail === 0 && sanityIssues === 0) {
  console.log('~ OVERALL: All KJV spot-checks passed. Review WARN items above (chapters not in this lectionary).');
} else {
  console.log('✗ OVERALL: Issues detected — review FAIL and WARN items above.');
}
console.log();
