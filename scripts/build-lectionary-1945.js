#!/usr/bin/env node
/**
 * build-lectionary-1945.js
 * Parses scripts/lectionary_source.txt and writes src/data/lectionary.json
 * completely from scratch with correct MP and EP lessons.
 */
const fs   = require('fs');
const path = require('path');

const SRC  = path.join(__dirname, 'lectionary_source.txt');
const DEST = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');

const lines = fs.readFileSync(SRC, 'utf8').split('\n');

// ── Output accumulator ────────────────────────────────────────────────────────
const lect = {};

function set(key, mp1, mp2, ep1, ep2) {
  if (!key) return;
  const entry = {};
  if (mp1 || mp2) entry.mp = { first: mp1 || '', second: mp2 || '' };
  if (ep1 || ep2) entry.ep = { first: ep1 || '', second: ep2 || '' };
  lect[key] = entry;
}

// ── Reference normalisation ────────────────────────────────────────────────────
// Books with only 1 chapter (so "Book N" means chapter 1, verse N)
const SINGLE_CHAPTER_BOOKS = new Set([
  'Obadiah', 'Philemon', '2 John', '3 John', 'Jude',
]);

function norm(ref) {
  if (!ref || ref === '—' || ref === '-' || ref.trim() === '') return '';
  ref = ref.trim();
  // Remove bold markdown **...**
  ref = ref.replace(/\*\*/g, '');
  // Ecclesiasticus → Sirach
  ref = ref.replace(/\bEcclesiasticus\b/g, 'Sirach');
  // Strip trailing verse-letter suffixes like "27a", "31b"
  ref = ref.replace(/(\d)[ab]\b/g, '$1');

  // Expand cross-chapter verse ranges: "Book X:Y-Z:W[, rest]"
  // e.g. "1 Cor 10:23-11:1" → "1 Cor 10:23-200; 1 Cor 11:1"
  // e.g. "Genesis 27:46-28:4, 10-22" → "Genesis 27:46-200; Genesis 28:1-4, 10-22"
  ref = ref.replace(/^((?:\d+\s+)?[A-Za-z][A-Za-z\s]*?)\s+(\d+):(\d+)-(\d+):(\d+)((?:,\s*[\d\-]+)*)$/,
    (_, book, ch1, v1, ch2, v2, rest) =>
      `${book.trim()} ${ch1}:${v1}-200; ${book.trim()} ${ch2}:1-${v2}${rest}`
  );

  // Handle trailing cross-chapter sub-range: "Book Ch:..., V-Ch2:V2"
  // e.g. "Amos 1:1-5, 13-2:3" → "Amos 1:1-5, 13-200; Amos 2:1-3"
  {
    const m2 = ref.match(/^((?:\d+\s+)?[A-Za-z][A-Za-z\s]*?)\s+\d+:.*,\s*(\d+)-(\d+):(\d+)$/);
    if (m2) {
      const book = m2[1].trim();
      const v3 = m2[2], ch2 = m2[3], v4 = m2[4];
      ref = ref.replace(/,\s*(\d+)-(\d+):(\d+)$/, `, $1-200; ${book} ${ch2}:1-${v4}`);
    }
  }
  // Collapse multiple spaces
  ref = ref.replace(/\s+/g, ' ').trim();

  // Three Children uses a unique verse-numbering scheme (not chapter:verse).
  // Keep "Three Children 29-37" as-is (do not expand as chapter range).
  if (ref.startsWith('Three Children')) {
    return ref; // handled as a special Apocrypha passage
  }

  // Expand chapter-range refs like "Jonah 3-4" → "Jonah 3:1-200; Jonah 4:1-200"
  // (Multi-chapter refs for non-single-chapter books)
  const chapRange = ref.match(/^((?:\d+\s+)?[A-Za-z][A-Za-z\s]*?)\s+(\d+)-(\d+)$/);
  if (chapRange && !ref.includes(':')) {
    const book = chapRange[1].trim();
    const startCh = parseInt(chapRange[2], 10);
    const endCh   = parseInt(chapRange[3], 10);
    if (!SINGLE_CHAPTER_BOOKS.has(book)) {
      const parts = [];
      for (let ch = startCh; ch <= endCh; ch++) parts.push(`${book} ${ch}:1-200`);
      ref = parts.join('; ');
    }
  }

  // Expand standalone single-chapter books with no verse info (e.g. "Jude", "Philemon")
  if (SINGLE_CHAPTER_BOOKS.has(ref)) {
    ref = `${ref} 1:1-200`;
  }

  // Expand whole-chapter references: "Book N" → "Book N:1-200"
  // Pattern: ends with book-name then whitespace then integer (no colon)
  // But only if it's not a single-chapter book verse reference
  const wholeChap = ref.match(/^(.*?)\s+(\d+)$/);
  if (wholeChap) {
    const bookPart = wholeChap[1];
    const n = wholeChap[2];
    // Check it's not already a verse range (would have colon before)
    if (!ref.includes(':') && !SINGLE_CHAPTER_BOOKS.has(bookPart)) {
      // Likely a whole chapter — append :1-200 (API decrements to real last verse)
      ref = `${bookPart} ${n}:1-200`;
    }
  }

  return ref;
}

// ── Table row parsing ─────────────────────────────────────────────────────────
// Returns array of cell strings (trimmed, pipes stripped)
function parseCells(line) {
  return line.split('|').map(c => c.trim()).filter((c, i, a) => i > 0 && i < a.length - 1);
}

function isSeparator(line) {
  return /^\|[-| ]+\|/.test(line);
}

function isTableRow(line) {
  return line.startsWith('|') && !isSeparator(line);
}

// ── Day name → suffix ─────────────────────────────────────────────────────────
const DAY_MAP = {
  'sunday': 'Sunday', 'monday': 'Monday', 'tuesday': 'Tuesday',
  'wednesday': 'Wednesday', 'thursday': 'Thursday', 'friday': 'Friday', 'saturday': 'Saturday',
  // Variants in the source
  'ember wed': 'Wednesday', 'ember fri': 'Friday', 'ember sat': 'Saturday',
  'ember wednesday': 'Wednesday', 'ember friday': 'Friday', 'ember saturday': 'Saturday',
  'ash wednesday': 'Wednesday',   // handled specially
  'christmas eve': 'Saturday',    // always Dec 24 = Advent 4 Saturday
  'easter monday': 'Monday', 'easter tuesday': 'Tuesday',
  'rogation mon': 'Monday', 'rogation tue': 'Tuesday', 'rogation wed': 'Wednesday',
  'whit sunday': 'Sunday', 'whit monday': 'Monday', 'whit tuesday': 'Tuesday',
  'whit thursday': 'Thursday',
};

// ── Section state ─────────────────────────────────────────────────────────────
let currentWeek = null;   // string like 'advent1', 'lent4', etc.
let tableType   = null;   // 'weekday7' | 'weekday5' | 'service4' | 'fixed'
let fixedDays   = null;   // array of day→key mappings for fixed-date sections

function weekdayKey(weekKey, dayCell) {
  const d = dayCell.toLowerCase().trim();
  // Standalone special keys
  if (d === 'ash wednesday') return 'ashWednesday';
  if (d === 'ascension day')  return 'ascensionDay';
  const suffix = DAY_MAP[d];
  if (!suffix) return null;
  return weekKey + suffix;
}

// ── Process a standard 7-column weekday row ───────────────────────────────────
// | Day | MP Ps | MP L1 | MP L2 | EP Ps | EP L1 | EP L2 |
function processRow7(cells) {
  const [day, , mp1raw, mp2raw, , ep1raw, ep2raw] = cells;
  const key = weekdayKey(currentWeek, day);
  if (!key) return;
  set(key, norm(mp1raw), norm(mp2raw), norm(ep1raw), norm(ep2raw));
}

// ── Process a 5-column weekday row (Advent 3, no Psalm columns) ───────────────
// | Day | MP L1 | MP L2 | EP L1 | EP L2 |
function processRow5(cells) {
  const [day, mp1raw, mp2raw, ep1raw, ep2raw] = cells;
  const key = weekdayKey(currentWeek, day);
  if (!key) return;
  set(key, norm(mp1raw), norm(mp2raw), norm(ep1raw), norm(ep2raw));
}

// ── Process a service row (Sunday/feast day) ─────────────────────────────────
// 4-col: | Service | Ps | Lesson 1 | Lesson 2 |
// 3-col: | Service | Lesson 1 | Lesson 2 |  (Holy Week)
// Service = 'MP' or 'EP' or 'EP (Eve)' etc.
let pendingService = {};
function processService4(cells) {
  const svc = cells[0];
  let l1raw, l2raw;
  if (cells.length >= 4) {
    // 4-col with Psalm: skip index 1
    [, , l1raw, l2raw] = cells;
  } else {
    // 3-col without Psalm
    [, l1raw, l2raw] = cells;
  }
  const s = svc.toLowerCase().trim();
  if (s === 'mp') pendingService.mp = { first: norm(l1raw), second: norm(l2raw) };
  else if (s === 'ep') pendingService.ep = { first: norm(l1raw), second: norm(l2raw) };
  // EP (Eve) = vigil — skip
}

function flushService4(key) {
  if (!key) { pendingService = {}; return; }
  const entry = {};
  if (pendingService.mp) entry.mp = pendingService.mp;
  if (pendingService.ep) entry.ep = pendingService.ep;
  if (Object.keys(entry).length) lect[key] = entry;
  pendingService = {};
}

// ── Fixed date rows (DECEMBER 29-31 / JANUARY 2-12) ──────────────────────────
// Each row maps to an explicit key
function processFixedRow(cells) {
  if (!fixedDays || !fixedDays.length) return;
  const mapping = fixedDays.shift();
  if (!mapping) return;
  const { key, cols } = mapping;
  if (!key) return;
  let mp1, mp2, ep1, ep2;
  if (cols === 7) {
    [, , mp1, mp2, , ep1, ep2] = cells;
  } else if (cols === 5) {
    [, mp1, mp2, ep1, ep2] = cells;
  }
  // Merge with existing (e.g., Jan 5 has MP and EP on separate rows)
  const existing = lect[key] || {};
  if (mp1 !== undefined || mp2 !== undefined) {
    const mp = { first: norm(mp1), second: norm(mp2) };
    if (mp.first || mp.second) existing.mp = mp;
  }
  if (ep1 !== undefined || ep2 !== undefined) {
    const ep = { first: norm(ep1), second: norm(ep2) };
    if (ep.first || ep.second) existing.ep = ep;
  }
  if (Object.keys(existing).length) lect[key] = existing;
}

// ── Section header detection ──────────────────────────────────────────────────
function handleH4(title) {
  flushService4(pendingKey);
  pendingKey = null;
  fixedDays = null;
  tableType = null;

  const t = title.toUpperCase().trim();

  // ADVENT
  if (t === '1ST SUNDAY IN ADVENT (SUNDAY ONLY)') {
    currentWeek = null; pendingKey = 'advent1Sunday'; tableType = 'service4';
  } else if (t === 'WEEK OF 1ST SUNDAY IN ADVENT (MON-SAT)') {
    currentWeek = 'advent1'; tableType = 'weekday7';
  } else if (t === 'WEEK OF 2ND SUNDAY IN ADVENT') {
    currentWeek = 'advent2'; tableType = 'weekday7';
  } else if (t === 'WEEK OF 3RD SUNDAY IN ADVENT (EMBER WEEK)') {
    currentWeek = 'advent3'; tableType = 'weekday5';
  } else if (t === 'WEEK OF 4TH SUNDAY IN ADVENT (CHRISTMAS EVE)') {
    currentWeek = 'advent4'; tableType = 'weekday7';

  // CHRISTMAS fixed dates
  } else if (t === 'CHRISTMAS DAY') {
    currentWeek = null; pendingKey = 'christmasDaySunday'; tableType = 'service4';
  } else if (t.includes('ST. STEPHEN')) {
    currentWeek = null; pendingKey = 'christmasDayMonday'; tableType = 'service4';
  } else if (t.includes('ST. JOHN THE EVANGELIST')) {
    currentWeek = null; pendingKey = 'christmasDayTuesday'; tableType = 'service4';
  } else if (t.includes('HOLY INNOCENTS')) {
    currentWeek = null; pendingKey = 'christmasDayWednesday'; tableType = 'service4';
  } else if (t.includes('1ST SUNDAY AFTER CHRISTMAS')) {
    // Same as christmasDay ordinal for whatever Sunday falls Dec 26-31; skip separate key
    currentWeek = null; tableType = null;
  } else if (t.includes('DECEMBER 29-31 AND CIRCUMCISION')) {
    tableType = 'fixed';
    fixedDays = [
      { key: 'christmasDayThursday', cols: 7 },  // Dec 29
      { key: 'christmasDayFriday',   cols: 7 },  // Dec 30
      { key: 'christmasDaySaturday', cols: 7 },  // Dec 31
      { key: 'circumcisionSunday',   cols: 7 },  // Jan 1
    ];
  } else if (t.includes('2ND SUNDAY AFTER CHRISTMAS')) {
    // Rare - skip (no dedicated key)
    currentWeek = null; tableType = null;

  // JANUARY 2-12
  } else if (t.includes('FIXED DAYS JANUARY 2-12')) {
    // Handled in H3 section above — skip if somehow reached as H4
    tableType = null;

  // Skip fixed feasts that have no dedicated key in the app
  } else if (t.includes('ST. PAUL') || t.includes('PURIFICATION') ||
             t.includes('ANNUNCIATION') || t.includes('ST. MATTHIAS') ||
             t.includes('SS. PHILIP') || t.includes('ALL SAINTS') ||
             t.includes('ST. ANDREW') || t.includes('ST. THOMAS')) {
    currentWeek = null; tableType = null;

  // EPIPHANY SEASON
  } else if (t.includes('WEEK OF 1ST SUNDAY AFTER EPIPHANY')) {
    currentWeek = 'epiphany1'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 2ND SUNDAY AFTER EPIPHANY')) {
    currentWeek = 'epiphany2'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 3RD SUNDAY AFTER EPIPHANY')) {
    currentWeek = 'epiphany3'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 4TH SUNDAY AFTER EPIPHANY')) {
    currentWeek = 'epiphany4'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 5TH SUNDAY AFTER EPIPHANY')) {
    currentWeek = 'epiphany5'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 6TH SUNDAY AFTER EPIPHANY')) {
    currentWeek = 'epiphany6'; tableType = 'weekday7';

  // PRE-LENT
  } else if (t === 'SEPTUAGESIMA') {
    currentWeek = 'septuagesima'; tableType = 'weekday7';
  } else if (t === 'SEXAGESIMA') {
    currentWeek = 'sexagesima'; tableType = 'weekday7';
  } else if (t === 'QUINQUAGESIMA') {
    currentWeek = 'quinquagesima'; tableType = 'weekday7';

  // LENT
  } else if (t.includes('WEEK OF 1ST SUNDAY IN LENT')) {
    currentWeek = 'lent1'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 2ND SUNDAY IN LENT')) {
    currentWeek = 'lent2'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 3RD SUNDAY IN LENT')) {
    currentWeek = 'lent3'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 4TH SUNDAY IN LENT')) {
    currentWeek = 'lent4'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 5TH SUNDAY IN LENT')) {
    currentWeek = 'lent5'; tableType = 'weekday7';

  // HOLY WEEK
  } else if (t === 'PALM SUNDAY (6TH SUNDAY IN LENT)') {
    currentWeek = null; pendingKey = 'palmSundaySunday'; tableType = 'service4';
  } else if (t === 'MONDAY BEFORE EASTER') {
    currentWeek = null; pendingKey = 'holyMonday'; tableType = 'service4';
  } else if (t === 'TUESDAY BEFORE EASTER') {
    currentWeek = null; pendingKey = 'holyTuesday'; tableType = 'service4';
  } else if (t === 'WEDNESDAY BEFORE EASTER') {
    currentWeek = null; pendingKey = 'holyWednesday'; tableType = 'service4';
  } else if (t === 'MAUNDY THURSDAY') {
    currentWeek = null; pendingKey = 'maundyThursday'; tableType = 'service4';
  } else if (t === 'GOOD FRIDAY') {
    currentWeek = null; pendingKey = 'goodFriday'; tableType = 'service4';
  } else if (t === 'EASTER EVEN') {
    currentWeek = null; pendingKey = 'holySaturday'; tableType = 'service4';

  // EASTER
  } else if (t === 'EASTER DAY') {
    currentWeek = null; pendingKey = 'easterDaySunday'; tableType = 'service4';
  } else if (t === 'EASTER WEEK') {
    currentWeek = 'easterDay'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 1ST SUNDAY AFTER EASTER')) {
    currentWeek = 'easter1'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 2ND SUNDAY AFTER EASTER')) {
    currentWeek = 'easter2'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 3RD SUNDAY AFTER EASTER')) {
    currentWeek = 'easter3'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 4TH SUNDAY AFTER EASTER')) {
    currentWeek = 'easter4'; tableType = 'weekday7';
  } else if (t.includes('WEEK OF 5TH SUNDAY AFTER EASTER')) {
    currentWeek = 'easter5'; tableType = 'weekday7';
  } else if (t === 'SUNDAY AFTER ASCENSION') {
    currentWeek = 'sundayAfterAscension'; tableType = 'weekday7';

  // WHITSUNTIDE / TRINITY
  } else if (t === 'TRINITY SUNDAY') {
    currentWeek = null; pendingKey = 'trinitySundaySunday'; tableType = 'service4';
  } else if (t === 'WEEK OF TRINITY SUNDAY') {
    currentWeek = 'trinitySunday'; tableType = 'weekday7';

  // PRE-ADVENT SUNDAYS → stored as trinity23-25
  } else if (t === '3RD SUNDAY BEFORE ADVENT') {
    currentWeek = 'trinity23'; tableType = 'weekday7';
  } else if (t === '2ND SUNDAY BEFORE ADVENT') {
    currentWeek = 'trinity24'; tableType = 'weekday7';
  } else if (t === 'SUNDAY NEXT BEFORE ADVENT') {
    currentWeek = 'trinity25'; tableType = 'weekday7';
  } else {
    // Check Trinity N
    const m = t.match(/^TRINITY (\d+)$/);
    if (m) {
      const n = parseInt(m[1]);
      currentWeek = 'trinity' + n;
      tableType = 'weekday7';
    }
  }
}

// State for Whitsuntide (it's a single table, not week sections)
function handleWhitsuntide() {
  currentWeek = 'whitsunday'; tableType = 'weekday7';
}

// ── Main parse loop ────────────────────────────────────────────────────────────
let pendingKey = null;
let inWhitsuntide = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();

  // H3 headers
  if (line.startsWith('### WHITSUNTIDE')) {
    flushService4(pendingKey); pendingKey = null;
    handleWhitsuntide();
    continue;
  }
  if (line.startsWith('### TRINITY SUNDAY')) {
    flushService4(pendingKey); pendingKey = null;
    currentWeek = null; pendingKey = 'trinitySundaySunday'; tableType = 'service4';
    continue;
  }
  if (line.startsWith('### FIXED DAYS JANUARY 2-12')) {
    flushService4(pendingKey); pendingKey = null;
    tableType = 'fixed';
    fixedDays = [
      { key: 'circumcisionMonday',    cols: 7 },  // Jan 2
      { key: 'circumcisionTuesday',   cols: 7 },  // Jan 3
      { key: 'circumcisionWednesday', cols: 7 },  // Jan 4
      { key: 'circumcisionThursday',  cols: 7 },  // Jan 5 MP
      { key: 'circumcisionThursday',  cols: 7 },  // Epiphany Eve EP (same key, merged)
      { key: 'epiphanySunday',        cols: 7 },  // Jan 6
      { key: 'epiphanyMonday',        cols: 7 },  // Jan 7
      { key: 'epiphanyTuesday',       cols: 7 },  // Jan 8
      { key: 'epiphanyWednesday',     cols: 7 },  // Jan 9
      { key: 'epiphanyThursday',      cols: 7 },  // Jan 10
      { key: 'epiphanyFriday',        cols: 7 },  // Jan 11
      { key: 'epiphanySaturday',      cols: 7 },  // Jan 12
    ];
    continue;
  }
  if (line.startsWith('### ')) {
    flushService4(pendingKey); pendingKey = null;
    continue;
  }

  // H4 headers
  if (line.startsWith('#### ')) {
    const title = line.replace(/^#+\s*/, '');
    handleH4(title);
    continue;
  }

  // Skip separator rows
  if (isSeparator(line)) continue;

  // Table data rows
  if (isTableRow(line)) {
    const cells = parseCells(line);

    // Skip header rows (contain 'MP' or 'Day' as first meaningful cell)
    const first = (cells[0] || '').toLowerCase();
    if (first === 'day' || first === 'service') continue;

    if (tableType === 'weekday7' && cells.length >= 7) {
      if (first === 'service') continue;
      processRow7(cells);
    } else if (tableType === 'weekday5' && cells.length >= 5) {
      if (first === 'day') continue;
      processRow5(cells);
    } else if (tableType === 'service4') {
      if (first === 'service') continue;
      processService4(cells);
    } else if (tableType === 'fixed') {
      if (first === 'day') continue;
      processFixedRow(cells);
    }
  }
}

// Final flush
flushService4(pendingKey);

// ── Post-processing ────────────────────────────────────────────────────────────
// Clean up any stray keys
Object.keys(lect).filter(k => k.includes(' ')).forEach(k => {
  console.warn('WARNING: key with space:', k);
});

// ── Report ────────────────────────────────────────────────────────────────────
const keys = Object.keys(lect);
console.log('Built', keys.length, 'lectionary entries');

// Validate: spot-check Lent 4 Monday
const l4m = lect['lent4Monday'];
console.log('\nlent4Monday:');
console.log('  mp:', JSON.stringify(l4m?.mp));
console.log('  ep:', JSON.stringify(l4m?.ep));

// Spot check: Advent 1 Monday
const a1m = lect['advent1Monday'];
console.log('\nadvent1Monday:');
console.log('  mp:', JSON.stringify(a1m?.mp));
console.log('  ep:', JSON.stringify(a1m?.ep));

// Count entries with both mp and ep
const both = keys.filter(k => lect[k].mp && lect[k].ep).length;
const mpOnly = keys.filter(k => lect[k].mp && !lect[k].ep).length;
const epOnly = keys.filter(k => !lect[k].mp && lect[k].ep).length;
console.log(`\nEntries: ${keys.length} total, ${both} with MP+EP, ${mpOnly} MP only, ${epOnly} EP only`);

// Write
fs.writeFileSync(DEST, JSON.stringify(lect, null, 2), 'utf8');
console.log('\nWrote', DEST);
