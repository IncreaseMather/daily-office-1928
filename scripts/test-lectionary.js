#!/usr/bin/env node
/**
 * test-lectionary.js
 *
 * Comprehensive test suite verifying that every test date maps to the correct
 * liturgical day key, has complete lectionary references, and that lessons.json
 * contains non-empty scripture text for each reference.
 *
 * Uses the same key-generation logic as getAppointedPsalmsKey() in liturgicalCalendar.ts.
 * All dates use Easter 2026 = April 5, 2026 as anchor (verified correct).
 */

'use strict';

const path = require('path');
const lect    = require('../src/data/lectionary.json');
const lessons = require('../src/data/lessons.json');

// ── Replicate calendar helpers from liturgicalCalendar.ts ────────────────────

function getEaster(year) {
  const a = year % 19, b = Math.floor(year / 100), c = year % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day   = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function dfe(date) {
  const year = date.getFullYear();
  const d0   = new Date(year, date.getMonth(), date.getDate());
  return Math.round((d0.getTime() - getEaster(year).getTime()) / 86400000);
}

function getAdventStart(year) {
  const nov30 = new Date(year, 10, 30);
  const dow = nov30.getDay();
  const offset = dow <= 3 ? -dow : 7 - dow;
  return new Date(year, 10, 30 + offset);
}

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MS_WEEK = 7 * 86400000;

function getSundayKey(sunday) {
  const d = dfe(sunday);
  const m = sunday.getMonth() + 1;
  const day = sunday.getDate();
  const year = sunday.getFullYear();

  if (d === -7)  return 'palmSunday';
  if (d === 0)   return 'easterDay';
  if (d === 49)  return 'whitsunday';
  if (d === 56)  return 'trinitySunday';
  if (d === -63) return 'septuagesima';
  if (d === -56) return 'sexagesima';
  if (d === -49) return 'quinquagesima';
  if (d === -42) return 'lent1';
  if (d === -35) return 'lent2';
  if (d === -28) return 'lent3';
  if (d === -21) return 'lent4';
  if (d === -14) return 'lent5';
  if (d === 7)   return 'easter1';
  if (d === 14)  return 'easter2';
  if (d === 21)  return 'easter3';
  if (d === 28)  return 'easter4';
  if (d === 35)  return 'easter5';
  if (d === 42)  return 'sundayAfterAscension';

  if (m === 12 && day === 25) return 'christmasDay';
  if ((m === 12 && day >= 26) || (m === 1 && day <= 5)) return 'sundayAfterChristmas';
  if (m === 1 && day === 6) return 'epiphany';

  for (const y of [year, year - 1]) {
    const adventStart = getAdventStart(y);
    const n = Math.round((sunday.getTime() - adventStart.getTime()) / MS_WEEK);
    if (n >= 0 && n <= 3) return `advent${n + 1}`;
  }

  if (d < -63) {
    const jan6 = new Date(year, 0, 6);
    const jan6dow = jan6.getDay();
    const daysToEp1 = jan6dow === 0 ? 7 : 7 - jan6dow;
    const ep1 = new Date(year, 0, 6 + daysToEp1);
    const n = Math.round((sunday.getTime() - ep1.getTime()) / MS_WEEK) + 1;
    if (n >= 1 && n <= 6) return `epiphany${n}`;
    if (n > 6) return 'epiphany6';
  }

  if (d >= 63) {
    const n = Math.round((d - 56) / 7);
    if (n >= 1 && n <= 25) return `trinity${n}`;
    return 'trinity25';
  }

  return null;
}

function getKey(date) {
  const d = dfe(date);
  const month = date.getMonth() + 1;
  const day   = date.getDate();
  const year  = date.getFullYear();
  const dow   = date.getDay();

  if (d === -6) return 'holyMonday';
  if (d === -5) return 'holyTuesday';
  if (d === -4) return 'holyWednesday';
  if (d === -3) return 'maundyThursday';
  if (d === -2) return 'goodFriday';
  if (d === -1) return 'holySaturday';
  if (d === -46) return 'ashWednesday';
  if (d === 39)  return 'ascensionDay';

  if (month === 12 && day >= 25) return 'christmasDay' + DAY_NAMES[day - 25];
  if (month === 1 && day >= 1 && day <= 5) return 'circumcision' + DAY_NAMES[day - 1];
  if (month === 1 && day >= 6 && day <= 12) return 'epiphany' + DAY_NAMES[day - 6];

  const sundayDate = dow === 0 ? date : new Date(year, date.getMonth(), day - dow);
  const weekKey = getSundayKey(sundayDate);
  return (weekKey || 'trinity1') + DAY_NAMES[dow];
}

// ── Test infrastructure ───────────────────────────────────────────────────────

let passes = 0, failures = 0;
const failedTests = [];

function check(label, date, expectedKey, mpFirst = null, epFirst = null) {
  const actualKey = getKey(date);
  const day = lect[actualKey];

  const keyOk  = actualKey === expectedKey;
  const hasDay = !!day;
  const mpRef1 = day?.mp?.first  ?? null;
  const mpRef2 = day?.mp?.second ?? null;
  const epRef1 = day?.ep?.first  ?? null;
  const epRef2 = day?.ep?.second ?? null;

  const mpText1 = mpRef1 ? (lessons[mpRef1] && lessons[mpRef1].length > 0) : false;
  const mpText2 = mpRef2 ? (lessons[mpRef2] && lessons[mpRef2].length > 0) : false;
  const epText1 = epRef1 ? (lessons[epRef1] && lessons[epRef1].length > 0) : false;
  const epText2 = epRef2 ? (lessons[epRef2] && lessons[epRef2].length > 0) : false;

  const mpFirstOk = mpFirst ? (mpRef1 === mpFirst) : true;
  const epFirstOk = epFirst ? (epRef1 === epFirst) : true;

  const ok = keyOk && hasDay && mpText1 && mpText2 && epText1 && epText2 && mpFirstOk && epFirstOk;

  if (ok) {
    passes++;
    console.log(`  PASS  ${label}`);
    console.log(`        Key: ${actualKey}`);
    console.log(`        MP: ${mpRef1} | ${mpRef2}`);
    console.log(`        EP: ${epRef1} | ${epRef2}`);
  } else {
    failures++;
    const why = [];
    if (!keyOk)     why.push(`key mismatch: got "${actualKey}", expected "${expectedKey}"`);
    if (!hasDay)    why.push(`no lectionary entry for key "${actualKey}"`);
    if (!mpText1)   why.push(`MP first lesson missing/empty: "${mpRef1}"`);
    if (!mpText2)   why.push(`MP second lesson missing/empty: "${mpRef2}"`);
    if (!epText1)   why.push(`EP first lesson missing/empty: "${epRef1}"`);
    if (!epText2)   why.push(`EP second lesson missing/empty: "${epRef2}"`);
    if (!mpFirstOk) why.push(`MP first ref wrong: got "${mpRef1}", expected "${mpFirst}"`);
    if (!epFirstOk) why.push(`EP first ref wrong: got "${epRef1}", expected "${epFirst}"`);
    console.log(`  FAIL  ${label}`);
    why.forEach(w => console.log(`        ! ${w}`));
    if (mpRef1) console.log(`        MP: ${mpRef1} | ${mpRef2}`);
    if (epRef1) console.log(`        EP: ${epRef1} | ${epRef2}`);
    failedTests.push({ label, why });
  }
}

// ── Test cases ─────────────────────────────────────────────────────────────

// Easter 2026 = April 5.  Easter 2025 = April 20.
// Advent 2025 starts Nov 30 (Sunday nearest Nov 30, 2025 = Nov 30 itself).

console.log('\n══════════ ADVENT ══════════');
check('Advent 1 Sunday (Nov 30, 2025)',       new Date(2025,10,30), 'advent1Sunday');
check('Advent 2 Wednesday (Dec 10, 2025)',    new Date(2025,11,10), 'advent2Wednesday');
check('Advent 4 Saturday (Dec 24, 2022)',     new Date(2022,11,24), 'advent4Saturday');
// In 2022: Nov 27 = Advent 1, Dec 18 = Advent 4 Sunday, Dec 24 = Advent 4 Saturday

console.log('\n══════════ CHRISTMAS ══════════');
// Dec 25 → ordinal 0 = "Sunday", Dec 27 → ordinal 2 = "Tuesday"
check('Christmas Day (Dec 25, 2025)',          new Date(2025,11,25), 'christmasDaySunday');
check('St John Evangelist (Dec 27, 2025)',     new Date(2025,11,27), 'christmasDayTuesday');
// Jan 1 → circumcision ordinal 0 = "Sunday"
check('Circumcision / New Year (Jan 1, 2026)', new Date(2026,0,1),  'circumcisionSunday');

console.log('\n══════════ EPIPHANY ══════════');
// Jan 6 → ordinal 0 = "Sunday"
check('Epiphany Sunday (Jan 6, 2026)',         new Date(2026,0,6),  'epiphanySunday');
// Jan 6, 2026 = Tuesday. Epiphany 1 Sunday = Jan 11. Ep3 Sunday = Jan 25. Ep3 Thursday = Jan 29.
check('Epiphany 3 Thursday (Jan 29, 2026)',    new Date(2026,0,29), 'epiphany3Thursday');

console.log('\n══════════ PRE-LENT ══════════');
// Septuagesima = Easter−63 = April 5 − 63 = Feb 1, 2026
check('Septuagesima Sunday (Feb 1, 2026)',     new Date(2026,1,1),  'septuagesimaSunday');
// Quinquagesima = Easter−49 = Feb 15. Monday = Feb 16.
check('Quinquagesima Monday (Feb 16, 2026)',   new Date(2026,1,16), 'quinquagesimaMo' + 'nday'.slice(-5));

console.log('\n══════════ LENT ══════════');
// Ash Wednesday = Easter−46 = Feb 18, 2026
check('Ash Wednesday (Feb 18, 2026)',          new Date(2026,1,18), 'ashWednesday');
// Lent 2 Sunday = Easter−35 = March 1
check('Lent 2 Sunday (March 1, 2026)',         new Date(2026,2,1),  'lent2Sunday');
// Lent 4 Tuesday = March 17, 2026; MP first should be Genesis 45
check('Lent 4 Tuesday (Mar 17, 2026)',         new Date(2026,2,17), 'lent4Tuesday', 'Genesis 45');
// Lent 5 Sunday = Easter−14 = March 22. Friday = March 27.
check('Lent 5 Friday (Mar 27, 2026)',          new Date(2026,2,27), 'lent5Friday');

console.log('\n══════════ HOLY WEEK ══════════');
// Palm Sunday = Easter−7 = March 29
check('Palm Sunday (Mar 29, 2026)',            new Date(2026,2,29), 'palmSundaySunday');
check('Good Friday (Apr 3, 2026)',             new Date(2026,3,3),  'goodFriday');
check('Holy Saturday (Apr 4, 2026)',           new Date(2026,3,4),  'holySaturday');

console.log('\n══════════ EASTER ══════════');
check('Easter Day (Apr 5, 2026)',              new Date(2026,3,5),  'easterDaySunday');
// Easter 3 Sunday = Easter+21 = April 26. Wednesday = April 29.
check('Easter 3 Wednesday (Apr 29, 2026)',     new Date(2026,3,29), 'easter3Wednesday');

console.log('\n══════════ ASCENSION AND AFTER ══════════');
// Ascension = Easter+39 = May 14
check('Ascension Day (May 14, 2026)',          new Date(2026,4,14), 'ascensionDay');
// Whitsunday = Easter+49 = May 24
check('Whitsunday (May 24, 2026)',             new Date(2026,4,24), 'whitsundaySunday');
// Trinity = Easter+56 = May 31
check('Trinity Sunday (May 31, 2026)',         new Date(2026,4,31), 'trinitySundaySunday');

console.log('\n══════════ TRINITY ══════════');
// Trinity 1 = Easter+63 = June 7
check('Trinity 1 Sunday (Jun 7, 2026)',        new Date(2026,5,7),  'trinity1Sunday');
// Trinity 8 Sunday = June 7+49 = July 26. Tuesday = July 28.
check('Trinity 8 Tuesday (Jul 28, 2026)',      new Date(2026,6,28), 'trinity8Tuesday');
// Trinity 15 Sunday = June 7+98 = Sept 13. Friday = Sept 18.
check('Trinity 15 Friday (Sep 18, 2026)',      new Date(2026,8,18), 'trinity15Friday');
// Trinity 25 Sunday = June 7+168 = Nov 22.
check('Trinity 25 Sunday (Nov 22, 2026)',      new Date(2026,10,22),'trinity25Sunday');

console.log('\n══════════ PRINCIPAL FEASTS (fixed dates) ══════════');
// St Peter = June 29, 2026. Trinity 4 Sunday = June 28. Monday = June 29.
check('St Peter (Jun 29, 2026)',               new Date(2026,5,29), 'trinity4Monday');
// All Saints = Nov 1, 2026 = Trinity 22 Sunday.
check('All Saints (Nov 1, 2026)',              new Date(2026,10,1), 'trinity22Sunday');
// St Andrew = Nov 30, 2026 = Advent 1 Monday (Advent 1 Sunday = Nov 29, 2026).
check('St Andrew (Nov 30, 2026)',              new Date(2026,10,30),'advent1Monday');

// ── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${'═'.repeat(50)}`);
console.log(`TOTAL: ${passes + failures} tests   PASS: ${passes}   FAIL: ${failures}`);
if (failedTests.length > 0) {
  console.log('\nFailed tests:');
  failedTests.forEach(t => {
    console.log(`  • ${t.label}`);
    t.why.forEach(w => console.log(`    – ${w}`));
  });
}
console.log('');
process.exit(failures > 0 ? 1 : 0);
