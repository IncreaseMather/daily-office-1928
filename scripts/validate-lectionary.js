#!/usr/bin/env node
// Quick validation of the rebuilt lectionary
const l = require('../src/data/lectionary.json');
const keys = Object.keys(l);

// 1. All expected keys present
const DAY = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const expected = [];

// Seasons with weekdays
const weekSeasons = [
  'advent1','advent2','advent3','advent4',
  'epiphany1','epiphany2','epiphany3','epiphany4','epiphany5','epiphany6',
  'septuagesima','sexagesima','quinquagesima',
  'lent1','lent2','lent3','lent4','lent5',
  'palmSunday',  // just Sunday
  'easterDay',   // Mon-Sat
  'easter1','easter2','easter3','easter4','easter5',
  'sundayAfterAscension',
  'whitsunday',
  'trinitySunday',
  ...Array.from({length:25},(_,i)=>'trinity'+(i+1)),
];

// Check spot entries
const checks = [
  ['advent1Monday',    'Isaiah 1:1-9',       'Revelation 3:14-22'],
  ['advent3Wednesday', 'Jeremiah 23:9-15',   'Matthew 28:16-20'],
  ['ashWednesday',     'Isaiah 58:1-12',     'Luke 15:10-32'],
  ['lent4Monday',      'Genesis 44:1-200',   'Mark 12:18-27'],
  ['lent4Tuesday',     'Genesis 45:1-200',   'Mark 12:28-37'],
  ['holyMonday',       'Isaiah 42:1-7',      'John 14:15-31'],
  ['maundyThursday',   'Jeremiah 31:31-34',  'John 17:1-200'],
  ['goodFriday',       'Genesis 22:1-18',    '1 Peter 2:11-25'],
  ['holySaturday',     'Job 14:1-14',        'Romans 6:3-11'],
  ['easterDaySunday',  'Isaiah 25:1-9',      'Luke 24:13-35'],
  ['easterDayMonday',  'Isaiah 61:1-3, 10-11','John 20:1-10'],
  ['ascensionDay',     'Daniel 7:9-10, 13-14','Hebrews 4:14-200; Hebrews 5:1-10'],
  ['whitsundaySunday', 'Wisdom 1:1-7',       '1 Corinthians 2:1-200'],
  ['trinitySundaySunday','Isaiah 6:1-8',     'Ephesians 4:1-16'],
  ['trinity1Sunday',   'Jeremiah 23:23-32',  'John 13:1-17, 34-35'],
  ['christmasDaySunday','Isaiah 9:2-7',      '1 John 4:7-14'],
  ['circumcisionSunday','Deuteronomy 30:1-10','Revelation 19:11-16'],
  ['epiphanySunday',   'Isaiah 60:1-9',      'Romans 15:8-21'],
];

let pass = 0, fail = 0;
for (const [key, mpFirst, epSecond] of checks) {
  const e = l[key];
  if (!e) { console.log('MISSING:', key); fail++; continue; }
  const mpOK = e.mp && e.mp.first === mpFirst;
  const epOK = e.ep && e.ep.second === epSecond;
  if (mpOK && epOK) { pass++; }
  else {
    console.log('FAIL', key);
    if (!mpOK) console.log('  mp.first expected:', mpFirst, '\n  got:', e.mp && e.mp.first);
    if (!epOK) console.log('  ep.second expected:', epSecond, '\n  got:', e.ep && e.ep.second);
    fail++;
  }
}

console.log(`\nSpot checks: ${pass} pass, ${fail} fail`);
console.log('Total keys:', keys.length);
console.log('All with mp+ep:', keys.filter(k => l[k].mp && l[k].ep).length);
