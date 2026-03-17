#!/usr/bin/env node
/**
 * Parses COLLECTS_ONLY_1928BCP.txt using explicit line-number windows so each
 * collect is extracted from exactly the right section of the file.
 *
 * Line numbers below are 1-based (matching text-editor / grep output).
 *
 * Usage: node scripts/parse-collects2.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC  = path.join(ROOT, 'COLLECTS_ONLY_1928BCP.txt');
const OUT  = path.join(ROOT, 'src', 'data', 'collects.json');

// ---------------------------------------------------------------------------
// Read source file into 0-based lines array
// ---------------------------------------------------------------------------
const lines = fs.readFileSync(SRC, 'utf8').split('\n');

// ---------------------------------------------------------------------------
// Key → [searchAfterLine, searchBeforeLine]  (1-based, inclusive)
// Within this window we find the FIRST "Collect." marker, then extract text
// until "Amen."
// ---------------------------------------------------------------------------
const WINDOWS = [
  // Advent
  ['advent1',                 657,  720],
  ['advent2',                 720,  766],
  ['advent3',                 765,  816],
  ['advent4',                 815,  870],

  // Christmas / Epiphany
  ['christmasDay',            867,  892],   // stops before the 2nd communion collect
  ['sundayAfterChristmas',   1003, 1050],
  ['circumcision',           1047, 1118],
  ['epiphany',               1151, 1233],
  ['epiphany1',              1230, 1275],
  ['epiphany2',              1272, 1350],
  ['epiphany3',              1347, 1395],
  ['epiphany4',              1389, 1448],
  ['epiphany5',              1444, 1487],
  ['epiphany6',              1481, 1536],

  // Pre-Lent
  ['septuagesima',           1529, 1582],
  ['sexagesima',             1578, 1638],
  ['quinquagesima',          1633, 1700],

  // Lent
  ['ashWednesday',           1692, 1800],
  ['lent1',                  1793, 1848],
  ['lent2',                  1840, 1888],
  ['lent3',                  1880, 1945],
  ['lent4',                  1936, 1995],
  ['lent5',                  1987, 2072],

  // Holy Week
  ['palmSunday',             2063, 2188],
  ['holyMonday',             2182, 2360],
  ['holyTuesday',            2350, 2455],
  ['holyWednesday',          2441, 2592],
  ['maundyThursday',         2582, 2755],
  ['goodFriday',             2746, 2890],   // "The Collects." — first collect only
  ['holySaturday',           2882, 2978],

  // Easter
  ['easterDay',              2968, 3030],   // main Easter Day collect (before 2nd Communion)
  ['easter1',                3228, 3283],
  ['easter2',                3270, 3323],
  ['easter3',                3314, 3368],
  ['easter4',                3358, 3408],
  ['easter5',                3400, 3460],

  // Ascension & Pentecost
  ['ascensionDay',           3456, 3558],
  ['sundayAfterAscension',   3549, 3593],
  ['whitsunday',             3583, 3840],
  ['trinitySunday',          3827, 3908],

  // Sundays after Trinity
  ['trinity1',               3896, 3968],
  ['trinity2',               3958, 4015],
  ['trinity3',               4005, 4058],
  ['trinity4',               4046, 4100],
  ['trinity5',               4092, 4148],
  ['trinity6',               4136, 4190],
  ['trinity7',               4180, 4230],
  ['trinity8',               4220, 4263],
  ['trinity9',               4253, 4368],
  ['trinity10',              4356, 4407],
  ['trinity11',              4397, 4450],
  ['trinity12',              4439, 4488],
  ['trinity13',              4477, 4540],
  ['trinity14',              4530, 4578],
  ['trinity15',              4568, 4626],
  ['trinity16',              4613, 4663],
  ['trinity17',              4652, 4700],
  ['trinity18',              4690, 4732],
  ['trinity19',              4723, 4782],
  ['trinity20',              4772, 4824],
  ['trinity21',              4814, 4868],
  ['trinity22',              4858, 4920],
  ['trinity23',              4908, 4953],
  ['trinity24',              4944, 5010],
  ['trinity25',              5001, 5095],

  // Saints' Days & Holy Days
  ['stAndrew',               5087, 5148],
  ['stThomas',               5143, 5215],
  ['stStephen',              5205, 5268],
  ['stJohnEvangelist',       5258, 5326],
  ['holyInnocents',          5316, 5367],
  ['conversionOfStPaul',     5355, 5435],
  ['purification',           5422, 5492],
  ['stMatthias',             5482, 5542],
  ['annunciation',           5531, 5588],
  ['stMark',                 5578, 5640],
  ['stPhilipAndStJames',     5630, 5695],
  ['stBarnabas',             5685, 5736],
  ['nativityOfStJohnBaptist',5725, 5815],
  ['stPeter',                5801, 5872],
  ['stJames',                5863, 5920],
  ['transfiguration',        5908, 5962],
  ['stBartholomew',          5950, 5998],
  ['stMatthew',              5987, 6035],
  ['stMichaelAndAllAngels',  6023, 6083],
  ['stLuke',                 6070, 6142],
  ['stSimonAndStJude',       6129, 6213],
  ['allSaints',              6200, 6410],
  ['independenceDay',        6473, 6528],
  ['thanksgivingDay',        6505, 6660],
];

// ---------------------------------------------------------------------------
// Extract collect text from a range of lines
// ---------------------------------------------------------------------------
function isCollectMarker(line) {
  const t = line.trim();
  // "The Collect." or "Collect." or "The Collects." (Good Friday)
  // Requires trailing period so standalone "Collect" (editorial note) is excluded
  return /^(The\s+)?Collects?\.$/.test(t) && t.length < 20;
}

function extractCollect(key, startLine, endLine) {
  // Convert to 0-based indices
  const s = startLine - 1;
  const e = Math.min(endLine - 1, lines.length - 1);

  // Find first collect marker within window
  let collectMarkerIdx = -1;
  for (let i = s; i <= e; i++) {
    if (isCollectMarker(lines[i])) {
      collectMarkerIdx = i;
      break;
    }
  }
  if (collectMarkerIdx === -1) {
    // Try looser: line contains "Collect" and is short
    for (let i = s; i <= e; i++) {
      if (/Collect/i.test(lines[i]) && lines[i].trim().length < 30) {
        collectMarkerIdx = i;
        break;
      }
    }
    if (collectMarkerIdx === -1) {
      console.warn(`  ⚠  No collect marker found for "${key}" in lines ${startLine}–${endLine}`);
      return null;
    }
  }

  // Collect text starts on next non-blank line after the marker
  let bodyLines = [];
  let found = false;
  for (let i = collectMarkerIdx + 1; i <= e + 40; i++) {
    if (i >= lines.length) break;
    const t = lines[i].trim();

    // Skip blank lines before text starts
    if (!found && !t) continue;

    // Stop at Epistle / Gospel (new section)
    if (/^\s*(The\s+)?(Epistle|Gospel)\b/.test(lines[i])) break;
    // Stop at next section
    if (/^===/.test(t)) break;
    // Stop if we hit another collect marker (i.e., next entry)
    if (isCollectMarker(lines[i]) && found) break;

    found = true;
    bodyLines.push(lines[i]);

    // Stop after Amen.
    if (/Amen\.\s*$/.test(t)) break;
  }

  if (bodyLines.length === 0) {
    console.warn(`  ⚠  Empty collect body for "${key}"`);
    return null;
  }

  return cleanText(bodyLines);
}

function cleanText(rawLines) {
  const result = [];
  for (const line of rawLines) {
    const t = line.trim();
    if (!t) {
      // Preserve paragraph breaks
      if (result.length > 0 && result[result.length - 1] !== '') result.push('');
      continue;
    }
    // Skip editorial/footnote lines
    if (/^\*/.test(t)) continue;
    if (/^\[/.test(t)) continue;
    if (/^¶/.test(t)) continue;
    if (/^Rubric\b/i.test(t)) continue;
    if (/^Heading\b/i.test(t)) continue;
    if (/\b(added in|omitted in|until 1|from 1|in 18[0-9][0-9]|in 192[0-9]|in 17[0-9][0-9]|1928:|1892:|1789:)\b/.test(t)) continue;
    if (/^Prop\.\s*$/.test(t) || /^\(1786\)/.test(t)) continue;
    result.push(t);
  }
  // Join, stripping trailing empty strings
  while (result.length > 0 && result[result.length - 1] === '') result.pop();

  return result.join(' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/&#8224;/g, '')
    .replace(/&aelig;/g, 'ae')
    .replace(/&#\d+;/g, '')
    .replace(/\[the\]\*/g, '[the]')
    .replace(/\s*\*\s*/g, ' ')  // stray footnote asterisks mid-text
    .replace(/\s+/g, ' ')
    .trim();
}

// ---------------------------------------------------------------------------
// Build proper-collects map
// ---------------------------------------------------------------------------
const newProper = {};

for (const [key, start, end] of WINDOWS) {
  const text = extractCollect(key, start, end);
  if (text && text.length > 30) {
    newProper[key] = text;
    const preview = text.substring(0, 60).replace(/\n/g, '↵');
    console.log(`  ✓  ${key.padEnd(32)} ${preview}…`);
  } else {
    console.warn(`  ✗  FAILED: ${key}`);
  }
}

// ---------------------------------------------------------------------------
// Merge into collects.json (preserve original 10 Holy Week keys, add new ones)
// ---------------------------------------------------------------------------
const existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));

// Keep only the original hardcoded Holy Week / Easter proper collects,
// replacing any garbled ones that the first parser wrote.
const ORIG_KEYS = [
  'ashWednesday','palmSunday','holyMonday','holyTuesday','holyWednesday',
  'maundyThursday','goodFriday','holySaturday','easterDay','ascensionDay',
];

// The original values are in the source file — let the new parser overwrite them
// if it found cleaner text.  Merge newProper over existing.proper entirely.
existing.proper = Object.assign({}, existing.proper, newProper);

// Some keys from the bad first run that shouldn't have text replaced; remove any
// keys that got in via the bad first parse and are not in WINDOWS or ORIG_KEYS
const validKeys = new Set([...ORIG_KEYS, ...WINDOWS.map(([k]) => k)]);
for (const k of Object.keys(existing.proper)) {
  if (!validKeys.has(k)) {
    console.log(`  Removing invalid key: ${k}`);
    delete existing.proper[k];
  }
}

fs.writeFileSync(OUT, JSON.stringify(existing, null, 2), 'utf8');
console.log(`\nWrote ${Object.keys(newProper).length} collected keys.`);
console.log(`Total proper keys in collects.json: ${Object.keys(existing.proper).length}`);
