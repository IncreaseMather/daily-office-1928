#!/usr/bin/env node
/**
 * Parses COLLECTS_ONLY_1928BCP.txt to extract proper collects and
 * merges them into src/data/collects.json under the "proper" key.
 *
 * Usage: node scripts/parse-collects.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC  = path.join(ROOT, 'COLLECTS_ONLY_1928BCP.txt');
const OUT  = path.join(ROOT, 'src', 'data', 'collects.json');

// ---------------------------------------------------------------------------
// 1. Read source
// ---------------------------------------------------------------------------
const raw = fs.readFileSync(SRC, 'utf8');
const lines = raw.split('\n');

// ---------------------------------------------------------------------------
// 2. Find every "Collect." marker (handles "The Collect.", standalone
//    "Collect.", or "The\n\nCollect." split-line forms).
// ---------------------------------------------------------------------------
const collectLineNos = [];   // 0-based line indices of lines matching /^Collect\./
for (let i = 0; i < lines.length; i++) {
  if (/^Collect\./.test(lines[i].trim())) {
    collectLineNos.push(i);
  }
}
console.log(`Found ${collectLineNos.length} "Collect." markers.`);

// ---------------------------------------------------------------------------
// 3. For each marker, extract:
//    a) the heading text (scan backwards from marker, skip blank/rubricky lines)
//    b) the collect body (scan forwards until "Amen.")
// ---------------------------------------------------------------------------

function isEditorialLine(line) {
  const t = line.trim();
  if (!t) return false;
  // Footnote markers  "* something in 1892"
  if (/^\*/.test(t)) return true;
  // Rubric-in-brackets  "[rubric]"  or  "¶ ..."
  if (/^\[rubric\]/.test(t) || /^¶/.test(t)) return true;
  // Lines containing edition markers
  if (/\b(1786|1789|1892|1928|added in|omitted|until|only)\b/.test(t)) return true;
  // Source-attribution lines  "  Prop.\n  (1786) Book only"
  if (/^Prop\.$/.test(t)) return true;
  // Heading-section tags like "ADVENT SEASON." or "CHRISTMASTIDE."
  if (/^Heading/.test(t)) return true;
  return false;
}

function isEpistle(line) {
  return /^\s*(The\s+)?Epistle\b/.test(line) || /^\s*(The\s+)?Gospel\b/.test(line);
}

/** Collapse multi-line, leading-spaces prose into clean single paragraphs. */
function cleanCollectText(rawLines) {
  // 1. Strip editorial/footnote lines
  const kept = rawLines.filter(l => !isEditorialLine(l));
  // 2. Join with spaces, preserving blank lines as paragraph breaks
  let para = '';
  const paras = [];
  for (const l of kept) {
    const t = l.trim();
    if (!t) {
      if (para.trim()) paras.push(para.trim());
      para = '';
    } else {
      para += (para ? ' ' : '') + t;
    }
  }
  if (para.trim()) paras.push(para.trim());
  // 3. Rejoin paragraphs — usually the collect is a single paragraph
  return paras.join('\n\n')
    .replace(/\s{2,}/g, ' ')             // collapse double-spaces left by indents
    .replace(/&#8224;/g, '')             // strip dagger glyph &#8224;
    .replace(/&#\d+;/g, '')              // strip any other HTML entities
    .replace(/\*/g, '')                  // strip stray asterisks (variant footnote refs)
    .trim();
}

const parsed = [];   // { heading: string, collect: string }

for (const ci of collectLineNos) {
  // --- (a) find heading: scan back up to 30 lines ---
  const headingLines = [];
  let j = ci - 1;
  while (j >= 0 && ci - j <= 30) {
    const t = lines[j].trim();
    // Stop at epistle/gospel of a previous entry
    if (isEpistle(lines[j])) break;
    // Stop at previous collect marker
    if (/^Collect\./.test(t)) break;
    // Stop at section markers
    if (/^===/.test(t)) break;
    // Collect heading text (not blank, not editorial, not rubric-only)
    if (t && !isEditorialLine(lines[j]) && !/^¶/.test(t) && !/^\[/.test(t)) {
      headingLines.unshift(lines[j]);
    }
    j--;
  }
  // Clean heading: join the heading lines and normalise whitespace
  const heading = headingLines
    .map(l => l.trim())
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/The\s+$/, '')     // trailing "The" artefact
    .trim();

  // --- (b) extract collect body: from ci+1 until "Amen." ---
  const bodyLines = [];
  let k = ci + 1;
  let done = false;
  while (k < lines.length && !done) {
    const t = lines[k].trim();
    // Stop at epistle/gospel
    if (isEpistle(lines[k])) break;
    // Stop at next section marker
    if (/^===/.test(t)) break;
    bodyLines.push(lines[k]);
    if (/Amen\.$/.test(t) || /Amen\.\s*$/.test(t)) {
      done = true;
    }
    k++;
  }

  if (!done) {
    // Collect may span more lines — try looser search
    // (Some "Amen." lines end without period or have trailing space)
    const rejoined = bodyLines.join(' ');
    if (!/Amen/.test(rejoined)) {
      console.warn(`  WARNING: no "Amen." found for heading "${heading}" at line ${ci + 1}`);
    }
  }

  const collect = cleanCollectText(bodyLines);
  if (collect.length > 20) {
    parsed.push({ heading, collect });
  }
}

console.log(`Extracted ${parsed.length} collects.\n`);

// ---------------------------------------------------------------------------
// 4. Map headings → collect keys
// ---------------------------------------------------------------------------

/**
 * Normalises a heading string by lowercasing and stripping punctuation,
 * so that fuzzy matching is easy.
 */
function norm(s) {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();
}

const HEADING_TO_KEY = [
  // Advent
  [/first sunday.*advent/i,                 'advent1'],
  [/second sunday.*advent/i,                'advent2'],
  [/third sunday.*advent/i,                 'advent3'],
  [/fourth sunday.*advent/i,                'advent4'],

  // Christmas & Epiphany season
  [/nativity.*lord|christmas.?day|birthday.*christ/i, 'christmasDay'],
  [/sunday after christmas/i,               'sundayAfterChristmas'],
  [/circumcision/i,                         'circumcision'],
  [/epiphany.*or.*manifestation|^the epiphany$/i, 'epiphany'],
  [/first sunday after.*epiphany/i,         'epiphany1'],
  [/second sunday after.*epiphany/i,        'epiphany2'],
  [/third sunday after.*epiphany/i,         'epiphany3'],
  [/fourth sunday after.*epiphany/i,        'epiphany4'],
  [/fifth sunday after.*epiphany/i,         'epiphany5'],
  [/sixth sunday after.*epiphany/i,         'epiphany6'],

  // Pre-Lent
  [/septuagesima/i,                         'septuagesima'],
  [/sexagesima/i,                           'sexagesima'],
  [/quinquagesima/i,                        'quinquagesima'],

  // Lent
  // (Ash Wednesday and Holy Week already in collects.json)
  [/ash wednesday/i,                        'ashWednesday'],
  [/first sunday.*lent/i,                   'lent1'],
  [/second sunday.*lent/i,                  'lent2'],
  [/third sunday.*lent/i,                   'lent3'],
  [/fourth sunday.*lent/i,                  'lent4'],
  [/fifth sunday.*lent/i,                   'lent5'],

  // Holy Week
  [/palm sunday|sunday.*passion/i,          'palmSunday'],
  [/monday.*holy week/i,                    'holyMonday'],
  [/tuesday.*holy week/i,                   'holyTuesday'],
  [/wednesday.*holy week/i,                 'holyWednesday'],
  [/maundy thursday|thursday.*holy week/i,  'maundyThursday'],
  [/good friday/i,                          'goodFriday'],
  [/easter eve|holy saturday|saturday.*holy week|saturday.*easter/i, 'holySaturday'],

  // Easter
  [/easter day/i,                           'easterDay'],
  [/first sunday after easter|low sunday/i, 'easter1'],
  [/second sunday after easter/i,           'easter2'],
  [/third sunday after easter/i,            'easter3'],
  [/fourth sunday after easter/i,           'easter4'],
  [/fifth sunday after easter|sunday after ascension.*\brogation\b|rogation sunday/i, 'easter5'],
  [/ascension day/i,                        'ascensionDay'],
  [/sunday after ascension/i,               'sundayAfterAscension'],
  [/whitsunday|pentecost/i,                 'whitsunday'],
  [/trinity sunday/i,                       'trinitySunday'],

  // Sundays after Trinity
  [/first sunday after trinity/i,           'trinity1'],
  [/second sunday after trinity/i,          'trinity2'],
  [/third sunday after trinity/i,           'trinity3'],
  [/fourth sunday after trinity/i,          'trinity4'],
  [/fifth sunday after trinity/i,           'trinity5'],
  [/sixth sunday after trinity/i,           'trinity6'],
  [/seventh sunday after trinity/i,         'trinity7'],
  [/eighth sunday after trinity/i,          'trinity8'],
  [/ninth sunday after trinity/i,           'trinity9'],
  [/tenth sunday after trinity/i,           'trinity10'],
  [/eleventh sunday after trinity/i,        'trinity11'],
  [/twelfth sunday after trinity/i,         'trinity12'],
  [/thirteenth sunday after trinity/i,      'trinity13'],
  [/fourteenth sunday after trinity/i,      'trinity14'],
  [/fifteenth sunday after trinity/i,       'trinity15'],
  [/sixteenth sunday after trinity/i,       'trinity16'],
  [/seventeenth sunday after trinity/i,     'trinity17'],
  [/eighteenth sunday after trinity/i,      'trinity18'],
  [/nineteenth sunday after trinity/i,      'trinity19'],
  [/twentieth sunday after trinity/i,       'trinity20'],
  [/twenty.?first sunday after trinity/i,   'trinity21'],
  [/twenty.?second sunday after trinity/i,  'trinity22'],
  [/twenty.?third sunday after trinity/i,   'trinity23'],
  [/twenty.?fourth sunday after trinity/i,  'trinity24'],
  [/twenty.?fifth sunday after trinity/i,   'trinity25'],
  [/twenty.?sixth sunday after trinity/i,   'trinity26'],
  [/twenty.?seventh sunday after trinity/i, 'trinity27'],

  // Saints' Days & Holy Days
  [/saint andrew|st\.?\s*andrew/i,          'stAndrew'],
  [/saint thomas|st\.?\s*thomas.*apostle/i, 'stThomas'],
  [/saint stephen|st\.?\s*stephen/i,        'stStephen'],
  [/saint john.*evangelist|st\.?\s*john.*evangelist/i, 'stJohnEvangelist'],
  [/holy innocents/i,                       'holyInnocents'],
  [/conversion.*paul|st\.?\s*paul.*conversion/i, 'conversionOfStPaul'],
  [/purification/i,                         'purification'],
  [/saint matthias|st\.?\s*matthias/i,      'stMatthias'],
  [/annunciation/i,                         'annunciation'],
  [/saint mark|st\.?\s*mark/i,              'stMark'],
  [/saint philip.*james|st\.?\s*philip/i,   'stPhilipAndStJames'],
  [/saint barnabas|st\.?\s*barnabas/i,      'stBarnabas'],
  [/nativity.*john.*baptist|st\.?\s*john.*baptist/i, 'nativityOfStJohnBaptist'],
  [/saint james.*apostle|st\.?\s*james.*apostle/i,   'stJames'],
  [/saint peter|st\.?\s*peter/i,            'stPeter'],
  [/transfiguration/i,                      'transfiguration'],
  [/saint bartholomew|st\.?\s*bartholomew/i,'stBartholomew'],
  [/saint matthew|st\.?\s*matthew.*apostle/i, 'stMatthew'],
  [/saint michael|st\.?\s*michael/i,        'stMichaelAndAllAngels'],
  [/saint luke|st\.?\s*luke/i,              'stLuke'],
  [/saint simon.*jude|st\.?\s*simon/i,      'stSimonAndStJude'],
  [/all saints/i,                           'allSaints'],
  [/independence day/i,                     'independenceDay'],
  [/thanksgiving day/i,                     'thanksgivingDay'],
];

function headingToKey(heading) {
  const h = heading.trim();
  for (const [pattern, key] of HEADING_TO_KEY) {
    if (pattern.test(h)) return key;
  }
  return null;
}

// ---------------------------------------------------------------------------
// 5. Build the new proper-collects map
// ---------------------------------------------------------------------------
const newProper = {};
const unmapped = [];

for (const { heading, collect } of parsed) {
  const key = headingToKey(heading);
  if (key) {
    if (newProper[key]) {
      console.log(`  DUPLICATE key "${key}" — keeping first occurrence (heading: "${heading}")`);
    } else {
      newProper[key] = collect;
      console.log(`  ✓  ${key.padEnd(30)} ← "${heading}"`);
    }
  } else {
    unmapped.push(heading);
  }
}

if (unmapped.length) {
  console.log('\nUNMAPPED headings (need manual key assignment):');
  unmapped.forEach(h => console.log('  • ' + h));
}

// ---------------------------------------------------------------------------
// 6. Merge into existing collects.json
// ---------------------------------------------------------------------------
const existing = JSON.parse(fs.readFileSync(OUT, 'utf8'));
existing.proper = Object.assign({}, existing.proper, newProper);

fs.writeFileSync(OUT, JSON.stringify(existing, null, 2), 'utf8');
console.log(`\nWrote ${Object.keys(newProper).length} new keys to ${OUT}`);
console.log('Total proper keys:', Object.keys(existing.proper).length);
