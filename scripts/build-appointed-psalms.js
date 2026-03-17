#!/usr/bin/env node
/**
 * Converts psalms_lectionary_1928.js to src/data/appointedPsalms.json.
 * Applies key fixes and fills gaps for the Christmas-Epiphany period.
 * Run: node scripts/build-appointed-psalms.js
 */

const fs   = require('fs');
const path = require('path');
const { psalmLectionary1928 } = require('./psalms_lectionary_1928');

const lect = Object.assign({}, psalmLectionary1928);

// ── Fix: ashWednesdaySunday → ashWednesday (it's a Wednesday, not a Sunday) ──
lect['ashWednesday'] = lect['ashWednesdaySunday'];
delete lect['ashWednesdaySunday'];

// ── Christmas ordinal days 4–6 (Dec 29, 30, 31) ─────────────────────────────
// Agent labelled these as sundayAfterChristmasMonday/Tuesday/Wednesday.
// In the ordinal system Dec 25=Sunday pos, Dec 26=Monday … Dec 31=Saturday.
lect['christmasDayThursday'] = lect['sundayAfterChristmasMonday']
  || { morning: ['27'],  evening: ['20', '21:1-6'] };
lect['christmasDayFriday']   = lect['sundayAfterChristmasTuesday']
  || { morning: ['33'],  evening: ['111', '112'] };
lect['christmasDaySaturday'] = lect['sundayAfterChristmasWednesday']
  || { morning: ['147'], evening: ['90', '150'] };

// ── Epiphany ordinal day 6 (Jan 12 = Saturday position) ─────────────────────
if (!lect['epiphanySaturday']) {
  lect['epiphanySaturday'] = { morning: ['92'], evening: ['29', '98'] };
}

// ── Fill sparse circumcision entries ─────────────────────────────────────────
if (!lect['circumcisionFriday'] || lect['circumcisionFriday'].morning.length === 0) {
  lect['circumcisionFriday'] = { morning: ['144'], evening: ['29', '98'] };
}
if (!lect['circumcisionSaturday']) {
  lect['circumcisionSaturday'] = { morning: ['148', '150'], evening: ['85', '134'] };
}

// ── Validate: check every entry has morning and evening arrays ───────────────
let issues = 0;
for (const [key, val] of Object.entries(lect)) {
  if (!Array.isArray(val.morning) || !Array.isArray(val.evening)) {
    console.warn(`  WARN: "${key}" missing morning or evening array`);
    issues++;
  }
}

const outPath = path.join(__dirname, '../src/data/appointedPsalms.json');
fs.writeFileSync(outPath, JSON.stringify(lect, null, 2), 'utf8');
console.log(`Wrote ${Object.keys(lect).length} entries to appointedPsalms.json`);
if (issues === 0) console.log('No structural issues found.');
