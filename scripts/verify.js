/**
 * Verification script for collects.json, psalms.json, and collect-key logic.
 * Run with: node scripts/verify.js
 */
const fs   = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const collects = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/collects.json'), 'utf8'));
const psalms   = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/psalms.json'),   'utf8'));

// ── Re-implement the TypeScript calendar logic in plain JS for testing ──────

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
  const y = date.getFullYear();
  return Math.round((new Date(y, date.getMonth(), date.getDate()) - getEaster(y)) / 86400000);
}
function getAdventStart(year) {
  const nov30 = new Date(year, 10, 30);
  const dow = nov30.getDay();
  const offset = dow <= 3 ? -dow : 7 - dow;
  return new Date(year, 10, 30 + offset);
}
function getThanksgiving(year) {
  const nov1 = new Date(year, 10, 1);
  const dow  = nov1.getDay();
  const firstThu = dow <= 4 ? 1 + (4 - dow) : 1 + (11 - dow);
  return new Date(year, 10, firstThu + 21);
}

const FIXED = {
  '1-1':'circumcision','1-6':'epiphany','1-25':'conversionOfStPaul','2-2':'purification',
  '2-24':'stMatthias','3-25':'annunciation','4-25':'stMark','5-1':'stPhilipAndStJames',
  '6-11':'stBarnabas','6-24':'nativityOfStJohnBaptist','6-29':'stPeter',
  '7-4':'independenceDay','7-25':'stJames','8-6':'transfiguration','8-24':'stBartholomew',
  '9-21':'stMatthew','9-29':'stMichaelAndAllAngels','10-18':'stLuke','10-28':'stSimonAndStJude',
  '11-1':'allSaints','11-30':'stAndrew','12-21':'stThomas','12-25':'christmasDay',
  '12-26':'stStephen','12-27':'stJohnEvangelist','12-28':'holyInnocents',
};

function getSundayKey(sunday) {
  const d = dfe(sunday), m = sunday.getMonth()+1, day = sunday.getDate(), y = sunday.getFullYear();
  const MS_WEEK = 7*86400000;
  if (d === -63) return 'septuagesima';
  if (d === -56) return 'sexagesima';
  if (d === -49) return 'quinquagesima';
  if (d === -42) return 'lent1'; if (d === -35) return 'lent2';
  if (d === -28) return 'lent3'; if (d === -21) return 'lent4'; if (d === -14) return 'lent5';
  if (d ===  7) return 'easter1'; if (d === 14) return 'easter2';
  if (d === 21) return 'easter3'; if (d === 28) return 'easter4'; if (d === 35) return 'easter5';
  if (d === 42) return 'sundayAfterAscension';
  // Advent must be checked BEFORE Trinity (Advent 1 can fall while dfe >= 63)
  for (const yr of [y, y-1]) {
    const adv = getAdventStart(yr);
    const n   = Math.round((sunday - adv) / MS_WEEK);
    if (n >= 0 && n <= 3) return 'advent'+(n+1);
  }
  if (m === 12 && day === 25) return 'christmasDay';
  if ((m === 12 && day >= 26) || (m === 1 && day <= 5)) return 'sundayAfterChristmas';
  if (m === 1 && day === 6) return 'epiphany';
  if (d < -63) {
    const jan6 = new Date(y, 0, 6), jan6dow = jan6.getDay();
    const skip = jan6dow === 0 ? 7 : 7 - jan6dow;
    const ep1  = new Date(y, 0, 6 + skip);
    const n = Math.round((sunday - ep1) / MS_WEEK) + 1;
    if (n >= 1 && n <= 6) return 'epiphany'+n;
    if (n > 6) return 'epiphany6';
  }
  if (d >= 63) { const n = Math.round((d - 56)/7); return n <= 25 ? 'trinity'+n : 'trinity25'; }
  return null;
}

function getKey(date) {
  const d = dfe(date), m = date.getMonth()+1, day = date.getDate(), y = date.getFullYear();
  const dow = date.getDay();
  if (d === -46) return 'ashWednesday';
  if (d === -7)  return 'palmSunday';
  if (d === -6)  return 'holyMonday';
  if (d === -5)  return 'holyTuesday';
  if (d === -4)  return 'holyWednesday';
  if (d === -3)  return 'maundyThursday';
  if (d === -2)  return 'goodFriday';
  if (d === -1)  return 'holySaturday';
  if (d >= 0 && d <= 6)   return 'easterDay';
  if (d === 39)            return 'ascensionDay';
  if (d >= 40 && d <= 41) return 'ascensionDay'; // Fri-Sat after Ascension
  // dfe 42 = Sunday after Ascension: falls through to Sunday checks
  if (d >= 43 && d <= 48) return 'ascensionDay'; // Mon-Sat before Whitsunday
  if (d === 49)  return 'whitsunday';
  if (d === 56)  return 'trinitySunday';
  const fk = FIXED[m+'-'+day];
  if (fk) return fk;
  const tg = getThanksgiving(y);
  if (m === 11 && day === tg.getDate()) return 'thanksgivingDay';
  if (dow === 0) return getSundayKey(date);
  const prevSun = new Date(y, date.getMonth(), day - dow);
  return getKey(prevSun);
}

function showLentDouble(date) {
  const d = dfe(date);
  return d >= -45 && d <= -8;
}

// ── Tests ────────────────────────────────────────────────────────────────────

const proper = collects.proper;
let pass = 0, fail = 0;

function check(label, key, expectedKeyOrText) {
  const text = proper[key];
  if (!text) {
    console.log(`  FAIL [${label}] key "${key}" MISSING from collects.proper`);
    fail++; return;
  }
  if (typeof expectedKeyOrText === 'string' && !text.toLowerCase().startsWith(expectedKeyOrText.toLowerCase())) {
    console.log(`  FAIL [${label}] key "${key}" starts with: "${text.substring(0,50)}"`);
    fail++; return;
  }
  pass++;
}

function checkKey(label, date, expectedKey) {
  const got = getKey(date);
  if (got !== expectedKey) {
    console.log(`  FAIL [${label}] ${date.toDateString()}: expected "${expectedKey}", got "${got}"`);
    fail++; return;
  }
  pass++;
}

function checkDouble(label, date, expected) {
  const got = showLentDouble(date);
  if (got !== expected) {
    console.log(`  FAIL [${label}] ${date.toDateString()}: showLentDailyCollect expected ${expected}, got ${got}`);
    fail++; return;
  }
  pass++;
}

console.log('\n═══ 1. Collects completeness ═══');

// Sundays
const sundayKeys = [
  'advent1','advent2','advent3','advent4',
  'christmasDay','sundayAfterChristmas','circumcision',
  'epiphany','epiphany1','epiphany2','epiphany3','epiphany4','epiphany5','epiphany6',
  'septuagesima','sexagesima','quinquagesima',
  'ashWednesday','lent1','lent2','lent3','lent4','lent5',
  'palmSunday','holyMonday','holyTuesday','holyWednesday','maundyThursday',
  'goodFriday','holySaturday','easterDay',
  'easter1','easter2','easter3','easter4','easter5',
  'ascensionDay','sundayAfterAscension','whitsunday','trinitySunday',
  ...Array.from({length:25}, (_,i)=>'trinity'+(i+1)),
  'stAndrew','stThomas','stStephen','stJohnEvangelist','holyInnocents',
  'conversionOfStPaul','purification','stMatthias','annunciation','stMark',
  'stPhilipAndStJames','nativityOfStJohnBaptist','stPeter','transfiguration',
  'stBartholomew','stMatthew','stMichaelAndAllAngels','stLuke','stSimonAndStJude',
  'allSaints','independenceDay','thanksgivingDay',
];
for (const k of sundayKeys) check(k, k, '');

console.log('\n═══ 2. Collect key logic — spot checks ═══');

// 2026 calendar: Easter is April 5, 2026
// Ash Wednesday = Feb 18, 2026; Palm Sunday = March 29; Ascension = May 14; Whitsunday = May 24; Trinity = May 31
checkKey('Ash Wednesday 2026',    new Date(2026, 1, 18), 'ashWednesday');
checkKey('Lent 1 Sun 2026',       new Date(2026, 1, 22), 'lent1');
checkKey('Lent weekday 2026',     new Date(2026, 1, 24), 'stMatthias'); // Feb 24 = St Matthias
checkKey('Lent weekday non-feast',new Date(2026, 1, 23), 'lent1');   // Mon after Lent 1 Sun
checkKey('Palm Sunday 2026',      new Date(2026, 2, 29), 'palmSunday');
checkKey('Holy Monday 2026',      new Date(2026, 2, 30), 'holyMonday');
checkKey('Good Friday 2026',      new Date(2026, 3, 3),  'goodFriday');
checkKey('Easter Day 2026',       new Date(2026, 3, 5),  'easterDay');
checkKey('Easter week Mon 2026',  new Date(2026, 3, 6),  'easterDay');
checkKey('Easter 1 Sun 2026',     new Date(2026, 3, 12), 'easter1');
checkKey('Ascension Day 2026',    new Date(2026, 4, 14), 'ascensionDay');
checkKey('Ascension weekday+1',   new Date(2026, 4, 15), 'ascensionDay');
checkKey('Sun after Ascension',   new Date(2026, 4, 17), 'sundayAfterAscension');
checkKey('Whitsunday 2026',       new Date(2026, 4, 24), 'whitsunday');
checkKey('Trinity Sunday 2026',   new Date(2026, 4, 31), 'trinitySunday');
checkKey('Trinity 1 Sun 2026',    new Date(2026, 5, 7),  'trinity1');
checkKey('Trinity 1 weekday 2026',new Date(2026, 5, 9),  'trinity1');  // Tue after Trinity 1
checkKey('Trinity 5 2026',        new Date(2026, 6, 5),  'trinity5');
checkKey('Trinity 25 2026',       new Date(2026, 10, 22),'trinity25'); // Late Nov — before Advent

// Advent 2026 (nearest Sunday to Nov 30, 2026 = Nov 29)
checkKey('Advent 1 2026',         new Date(2026, 10, 29),'advent1');
checkKey('Advent 2 2026',         new Date(2026, 11, 6), 'advent2');
checkKey('Advent weekday 2026',   new Date(2026, 11, 2), 'advent1');  // Wed in Advent 1 week
checkKey('Christmas Day 2026',    new Date(2026, 11, 25),'christmasDay');
checkKey('St Stephen 2026',       new Date(2026, 11, 26),'stStephen');
checkKey('Holy Innocents 2026',   new Date(2026, 11, 28),'holyInnocents');
checkKey('Circumcision 2026',     new Date(2027, 0, 1),  'circumcision');
checkKey('Epiphany 2027',         new Date(2027, 0, 6),  'epiphany');
checkKey('Epiphany 1 2027',       new Date(2027, 0, 10), 'epiphany1'); // Sun after Jan 6 2027
checkKey('Epiphany weekday 2027', new Date(2027, 0, 12), 'epiphany1'); // Tue in Epiphany 1 wk

// Fixed feasts
checkKey('All Saints',            new Date(2026, 10, 1), 'allSaints');
checkKey('St Michael',            new Date(2026, 8, 29), 'stMichaelAndAllAngels');
checkKey('St Luke',               new Date(2026, 9, 18), 'stLuke');
checkKey('Independence Day',      new Date(2026, 6, 4),  'independenceDay');

console.log('\n═══ 3. Double-collect (Lent daily) logic ═══');
checkDouble('Ash Wednesday — NO double', new Date(2026, 1, 18), false);  // dfe -46
checkDouble('Lent 1 Sun — YES double',   new Date(2026, 1, 22), true);   // dfe -42
checkDouble('Lent weekday — YES double', new Date(2026, 1, 24), true);
checkDouble('Palm Sunday — NO double',   new Date(2026, 2, 29), false);  // dfe -7
checkDouble('Easter — NO double',        new Date(2026, 3, 5),  false);

console.log('\n═══ 4. Psalms completeness ═══');
const psalterDays = Object.keys(psalms).filter(k => !isNaN(+k));
if (psalterDays.length === 30) { console.log('  PASS 30 days present'); pass++; }
else { console.log('  FAIL expected 30 days, got '+psalterDays.length); fail++; }

let psalmCount = 0, missingText = [];
for (const d of psalterDays) {
  for (const session of ['morning','evening']) {
    for (const v of psalms[d][session].verses) {
      psalmCount++;
      if (!v.text || v.text.includes('[Psalm') || v.text.length < 20) {
        missingText.push(`Day ${d} ${session} Ps ${v.psalm}`);
      }
    }
  }
}
if (psalmCount >= 154) { console.log(`  PASS ${psalmCount} psalm entries`); pass++; }
else { console.log(`  FAIL only ${psalmCount} psalm entries`); fail++; }

if (missingText.length === 0) { console.log('  PASS no placeholder text'); pass++; }
else { console.log(`  FAIL ${missingText.length} entries still placeholder:`); missingText.slice(0,5).forEach(x => console.log('    '+x)); fail++; }

// Check Gloria Patri present
const p1text = psalms['1'].morning.verses[0].text;
if (p1text.includes('Glory be to the Father')) { console.log('  PASS Gloria Patri appended'); pass++; }
else { console.log('  FAIL Gloria Patri missing from Psalm 1'); fail++; }

// Check thee/thou language
const lent1 = proper.lent1 || '';
if (/\bthee\b|\bthou\b|\bthy\b/.test(lent1)) { console.log('  PASS traditional thee/thou language'); pass++; }
else { console.log('  FAIL traditional language missing from lent1'); fail++; }

console.log('\n═══ SUMMARY ═══');
console.log(`PASS: ${pass}   FAIL: ${fail}`);
if (fail === 0) console.log('ALL CHECKS PASSED ✓');
