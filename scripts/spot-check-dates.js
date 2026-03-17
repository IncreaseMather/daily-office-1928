#!/usr/bin/env node
// Spot-check key generation and EP lesson lookup for several dates.
// Mirrors liturgicalCalendar.ts logic in plain JS.

const lect    = require('../src/data/lectionary.json');
const lessons = require('../src/data/lessons.json');

function getEaster(year) {
  const a=year%19, b=Math.floor(year/100), c=year%100,
        d=Math.floor(b/4), e=b%4, f=Math.floor((b+8)/25),
        g=Math.floor((b-f+1)/3), h=(19*a+b-d-g+15)%30,
        i=Math.floor(c/4), k=c%4, l=(32+2*e+2*i-h-k)%7,
        m=Math.floor((a+11*h+22*l)/451),
        month=Math.floor((h+l-7*m+114)/31),
        day=((h+l-7*m+114)%31)+1;
  return new Date(year, month-1, day);
}

function daysFromEaster(date) {
  const y = date.getFullYear();
  const d = new Date(y, date.getMonth(), date.getDate());
  return Math.round((d.getTime() - getEaster(y).getTime()) / 86400000);
}

function getAdventStart(year) {
  const nov30 = new Date(year, 10, 30);
  const dow = nov30.getDay();
  const offset = dow <= 3 ? -dow : 7 - dow;
  return new Date(year, 10, 30 + offset);
}

const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// Simplified version of getAppointedPsalmsKey
function getKey(date) {
  const dfe   = daysFromEaster(date);
  const month = date.getMonth() + 1;
  const day   = date.getDate();
  const year  = date.getFullYear();
  const dow   = date.getDay();

  if (dfe === -6) return 'holyMonday';
  if (dfe === -5) return 'holyTuesday';
  if (dfe === -4) return 'holyWednesday';
  if (dfe === -3) return 'maundyThursday';
  if (dfe === -2) return 'goodFriday';
  if (dfe === -1) return 'holySaturday';
  if (dfe === -46) return 'ashWednesday';
  if (dfe === 39) return 'ascensionDay';

  // Christmas/Circumcision/Epiphany ordinal periods
  if (month === 12 && day >= 25) return 'christmasDay' + DAY_NAMES[day - 25];
  if (month === 1 && day >= 1 && day <= 5) return 'circumcision' + DAY_NAMES[day - 1];
  if (month === 1 && day >= 6 && day <= 12) return 'epiphany' + DAY_NAMES[day - 6];

  // General case: find the week's Sunday key
  const sundayDate = dow === 0 ? date : new Date(year, date.getMonth(), day - dow);
  const sundayDfe  = daysFromEaster(sundayDate);

  let weekKey;
  if (sundayDfe === -7)  weekKey = 'palmSunday';
  else if (sundayDfe === 0)  weekKey = 'easterDay';
  else if (sundayDfe === 49) weekKey = 'whitsunday';
  else if (sundayDfe === 56) weekKey = 'trinitySunday';
  else if (sundayDfe >= -63 && sundayDfe <= -57) weekKey = 'septuagesima';
  else if (sundayDfe >= -56 && sundayDfe <= -50) weekKey = 'sexagesima';
  else if (sundayDfe >= -49 && sundayDfe <= -43) weekKey = 'quinquagesima';
  else if (sundayDfe >= -42 && sundayDfe <= -36) weekKey = 'lent1';
  else if (sundayDfe >= -35 && sundayDfe <= -29) weekKey = 'lent2';
  else if (sundayDfe >= -28 && sundayDfe <= -22) weekKey = 'lent3';
  else if (sundayDfe >= -21 && sundayDfe <= -15) weekKey = 'lent4';
  else if (sundayDfe >= -14 && sundayDfe <= -8)  weekKey = 'lent5';
  else if (sundayDfe >= 7   && sundayDfe <= 13)  weekKey = 'easter1';
  else if (sundayDfe >= 14  && sundayDfe <= 20)  weekKey = 'easter2';
  else if (sundayDfe >= 21  && sundayDfe <= 27)  weekKey = 'easter3';
  else if (sundayDfe >= 28  && sundayDfe <= 34)  weekKey = 'easter4';
  else if (sundayDfe >= 35  && sundayDfe <= 41)  weekKey = 'easter5';
  else if (sundayDfe >= 42  && sundayDfe <= 48)  weekKey = 'sundayAfterAscension';
  else {
    // Advent or Trinity: check Advent
    const adventStart = getAdventStart(sundayDate.getFullYear());
    const MS_WEEK = 7 * 86400000;
    const n = Math.round((sundayDate.getTime() - adventStart.getTime()) / MS_WEEK);
    if (n >= 0 && n <= 3) weekKey = 'advent' + (n + 1);
    else {
      // Trinity: n weeks after Trinity Sunday
      const triN = Math.round((sundayDfe - 56) / 7);
      if (triN >= 1 && triN <= 25) weekKey = 'trinity' + triN;
      else weekKey = 'trinity1';
    }
  }

  return weekKey + DAY_NAMES[dow];
}

function checkDate(date, label, expectEP) {
  const key = getKey(date);
  const entry = lect[key];
  const ep = entry?.ep;
  const epFirst  = ep?.first;
  const epSecond = ep?.second;

  const firstOK  = epFirst  ? (lessons[epFirst]  && lessons[epFirst].length  > 0) : false;
  const secondOK = epSecond ? (lessons[epSecond] && lessons[epSecond].length > 0) : false;

  console.log(label + '  (' + date.toDateString() + ')');
  console.log('  Key     :', key);
  console.log('  EP first :', epFirst  || 'MISSING IN LECTIONARY');
  console.log('  EP second:', epSecond || 'MISSING IN LECTIONARY');
  console.log('  lessons.json first :', firstOK  ? 'FOUND (' + (lessons[epFirst]||[]).length  + ' verses)' : 'MISSING');
  console.log('  lessons.json second:', secondOK ? 'FOUND (' + (lessons[epSecond]||[]).length + ' verses)' : 'MISSING');

  if (expectEP) {
    const firstMatch  = epFirst  === expectEP.first;
    const secondMatch = epSecond === expectEP.second;
    console.log('  Expected first :', expectEP.first,  firstMatch  ? '✓' : '✗ MISMATCH');
    console.log('  Expected second:', expectEP.second, secondMatch ? '✓' : '✗ MISMATCH');
  }
  console.log();
}

// ── Spot checks ───────────────────────────────────────────────────────────────

// 1. Today — the confirmed fix
checkDate(
  new Date(2026, 2, 16),
  'TODAY: Lent 4 Monday',
  { first: 'Jeremiah 13:15-27', second: 'Mark 12:18-27' }
);

// 2. Maundy Thursday — a special moveable feast with its own key
checkDate(
  new Date(2026, 3, 2),
  'Maundy Thursday (2026-04-02)',
  null
);

// 3. Trinity 3 Sunday — a general Sundays-after-Trinity weekday
checkDate(
  new Date(2026, 5, 21),
  'Trinity 3 Sunday (2026-06-21)',
  null
);
