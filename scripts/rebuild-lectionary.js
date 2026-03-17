#!/usr/bin/env node
/**
 * rebuild-lectionary.js
 * Rebuilds lectionary.json with correct 1928/1945 BCP weekday lesson assignments.
 * Sunday lessons are preserved from the existing file.
 * Weekday lessons are replaced with correct data from the 1928 BCP.
 *
 * Usage: node scripts/rebuild-lectionary.js
 */

const fs   = require('fs');
const path = require('path');

const LECTIONARY_PATH = path.join(__dirname, '..', 'src', 'data', 'lectionary.json');

// Helper to create a lesson entry
function day(mp1, mp2, ep1, ep2) {
  return {
    mp: { first: mp1, second: mp2 },
    ep: { first: ep1, second: ep2 }
  };
}

// Read the existing file (to preserve Sunday lessons)
const existing = JSON.parse(fs.readFileSync(LECTIONARY_PATH, 'utf8'));

// Build the new lectionary by starting with existing Sundays and special days,
// then overriding all weekdays with correct 1928 BCP data.

const lect = {};

// ══════════════════════════════════════════════════════════════════════════════
// ADVENT 1
// ══════════════════════════════════════════════════════════════════════════════
lect.advent1Sunday    = existing.advent1Sunday;
lect.advent1Monday    = day('Isaiah 1:1-9',       'Mark 1:1-13',       'Isaiah 1:10-20',       'Revelation 3:14-22');
lect.advent1Tuesday   = day('Isaiah 1:21-28',     'Mark 1:14-28',      'Isaiah 2:1-5',         'Revelation 4:1-11');
lect.advent1Wednesday = day('Isaiah 2:6-19',      'Mark 1:29-39',      'Isaiah 3:1-3, 8-15',   'Revelation 5:1-14');
lect.advent1Thursday  = day('Isaiah 4:2-6',       'Mark 1:40-45',      'Isaiah 5:1-7',         'Revelation 6:1-11');
lect.advent1Friday    = day('Isaiah 5:8-29',      'Mark 2:1-12',       'Isaiah 6:1-11',        'Revelation 7:1-4, 9-17');
lect.advent1Saturday  = day('Isaiah 7:1-9',       'Mark 2:13-22',      'Isaiah 7:10-20',       'Revelation 10:1-11');

// ══════════════════════════════════════════════════════════════════════════════
// ADVENT 2
// ══════════════════════════════════════════════════════════════════════════════
lect.advent2Sunday    = existing.advent2Sunday;
lect.advent2Monday    = day('Isaiah 8:5-8, 11-20', 'Mark 2:23-3:6',   'Isaiah 9:8-17',        'Revelation 11:15-19');
lect.advent2Tuesday   = day('Isaiah 9:18-10:4',   'Mark 3:7-19',       'Isaiah 10:5-7, 13-21', 'Revelation 12:1-12');
lect.advent2Wednesday = day('Isaiah 11:1-10',     'Mark 3:20-35',      'Isaiah 12:1-6',        'Revelation 13:1-10');
lect.advent2Thursday  = day('Isaiah 13:1-5, 17-22','Mark 4:1-20',     'Isaiah 13:6-15',       'Revelation 14:1-13');
lect.advent2Friday    = day('Isaiah 24:16-23',    'Mark 4:21-29',      'Isaiah 26:11-19',      'Revelation 15:1-8');
lect.advent2Saturday  = day('Isaiah 28:1-13',     'Mark 4:30-41',      'Isaiah 28:14-22',      'Revelation 18:1-10');

// ══════════════════════════════════════════════════════════════════════════════
// ADVENT 3
// ══════════════════════════════════════════════════════════════════════════════
lect.advent3Sunday    = existing.advent3Sunday;
lect.advent3Monday    = day('Isaiah 29:1-4, 9-14','Mark 5:1-20',      'Isaiah 29:15-24',      'Revelation 18:11-24');
lect.advent3Tuesday   = day('Isaiah 30:8-17',     'Mark 5:21-43',      'Isaiah 30:18-26',      'Revelation 19:1-16');
lect.advent3Wednesday = day('Jeremiah 23:9-15',   'Luke 12:35-48',     'Jeremiah 23:16-22',    'Matthew 28:16-20');
lect.advent3Thursday  = day('Isaiah 32:1-4, 15-20','Mark 6:1-6',      'Isaiah 33:1-10',       'Revelation 20:1-6');
lect.advent3Friday    = day('Jeremiah 23:23-32',  '2 Corinthians 5:5-21', 'Jeremiah 26:1-7, 10-15', '2 Timothy 3:14-4:8');
lect.advent3Saturday  = day('Malachi 2:1-9',      'Matthew 9:35-10:15','Malachi 3:1-6',        'Hebrews 4:14-5:10');

// ══════════════════════════════════════════════════════════════════════════════
// ADVENT 4
// ══════════════════════════════════════════════════════════════════════════════
lect.advent4Sunday    = existing.advent4Sunday;
lect.advent4Monday    = day('Isaiah 33:13-24',    'Luke 1:5-25',       'Isaiah 35:1-10',       'Revelation 20:7-15');
lect.advent4Tuesday   = day('Isaiah 25:1-9',      'Luke 1:26-38',      'Genesis 49:1-2, 8-10', 'Revelation 21:1-8');
lect.advent4Wednesday = day('Zechariah 8:1-8, 20-23','Luke 1:39-45',  'Haggai 2:1-9',         'Revelation 21:9-27');
lect.advent4Thursday  = day('2 Samuel 7:18-29',   'Luke 1:46-56',      'Zephaniah 3:14-20',    'Revelation 22:1-9');
lect.advent4Friday    = day('1 Samuel 2:1-10',    'Luke 1:57-66',      'Jeremiah 23:5-8',      'Revelation 22:10-21');
lect.advent4Saturday  = day('Baruch 4:36-5:9',    'Luke 1:67-80',      'Zechariah 2:10-13',    'Matthew 1:18-25');

// ══════════════════════════════════════════════════════════════════════════════
// CHRISTMAS DAY (preserve existing — these are curated for the Christmas octave)
// ══════════════════════════════════════════════════════════════════════════════
lect.christmasDaySunday    = existing.christmasDaySunday;
lect.christmasDayMonday    = existing.christmasDayMonday;
lect.christmasDayTuesday   = existing.christmasDayTuesday;
lect.christmasDayWednesday = existing.christmasDayWednesday;
lect.christmasDayThursday  = existing.christmasDayThursday;
lect.christmasDayFriday    = existing.christmasDayFriday;
lect.christmasDaySaturday  = existing.christmasDaySaturday;

// ══════════════════════════════════════════════════════════════════════════════
// CIRCUMCISION (Jan 1 — preserve existing, curated for the feast)
// ══════════════════════════════════════════════════════════════════════════════
lect.circumcisionSunday    = existing.circumcisionSunday;
lect.circumcisionMonday    = existing.circumcisionMonday;
lect.circumcisionTuesday   = existing.circumcisionTuesday;
lect.circumcisionWednesday = existing.circumcisionWednesday;
lect.circumcisionThursday  = existing.circumcisionThursday;

// ══════════════════════════════════════════════════════════════════════════════
// EPIPHANY (Jan 6 and its week — preserve existing)
// ══════════════════════════════════════════════════════════════════════════════
lect.epiphanySunday    = existing.epiphanySunday;
lect.epiphanyMonday    = existing.epiphanyMonday;
lect.epiphanyTuesday   = existing.epiphanyTuesday;
lect.epiphanyWednesday = existing.epiphanyWednesday;
lect.epiphanyThursday  = existing.epiphanyThursday;
lect.epiphanyFriday    = existing.epiphanyFriday;
lect.epiphanySaturday  = existing.epiphanySaturday;

// ══════════════════════════════════════════════════════════════════════════════
// EPIPHANY 1
// ══════════════════════════════════════════════════════════════════════════════
lect.epiphany1Sunday    = existing.epiphany1Sunday;
lect.epiphany1Monday    = day('Proverbs 1:7-19',  'Ephesians 1:1-23',  'Ezekiel 1:2-6, 24-28', 'John 1:1-18');
lect.epiphany1Tuesday   = day('Proverbs 2:1-9',   'Ephesians 2:1-10',  'Ezekiel 2:1-10',       'John 1:19-34');
lect.epiphany1Wednesday = day('Proverbs 3:1-7, 11-12','Ephesians 2:11-22','Ezekiel 3:4-14',    'John 1:35-51');
lect.epiphany1Thursday  = day('Proverbs 3:13-20', 'Ephesians 3:1-13',  'Ezekiel 3:16-21',      'John 2:1-12');
lect.epiphany1Friday    = day('Proverbs 3:27-35', 'Ephesians 3:14-21', 'Ezekiel 7:10-15, 23-27','John 2:13-25');
lect.epiphany1Saturday  = day('Proverbs 4:7-18',  'Ephesians 4:1-16',  'Ezekiel 11:14-20',     'John 3:1-13');

// ══════════════════════════════════════════════════════════════════════════════
// EPIPHANY 2
// ══════════════════════════════════════════════════════════════════════════════
lect.epiphany2Sunday    = existing.epiphany2Sunday;
lect.epiphany2Monday    = day('Proverbs 4:20-27', 'Ephesians 4:17-32', 'Ezekiel 12:21-28',     'John 3:14-21');
lect.epiphany2Tuesday   = day('Proverbs 6:12-19', 'Ephesians 5:1-14',  'Ezekiel 13:1-9',       'John 3:22-36');
lect.epiphany2Wednesday = day('Proverbs 8:1-11',  'Ephesians 5:15-33', 'Ezekiel 14:1-11',      'John 4:1-14');
lect.epiphany2Thursday  = day('Proverbs 8:12-20', 'Ephesians 6:1-24',  'Ezekiel 14:12-20',     'John 4:15-26');
lect.epiphany2Friday    = day('Proverbs 8:22-35', 'Philippians 1:1-11','Ezekiel 18:1-4, 19-23','John 4:27-42');
lect.epiphany2Saturday  = day('Proverbs 9:1-6, 13-18','Philippians 1:12-26','Ezekiel 18:26-32','John 4:43-54');

// ══════════════════════════════════════════════════════════════════════════════
// EPIPHANY 3
// ══════════════════════════════════════════════════════════════════════════════
lect.epiphany3Sunday    = existing.epiphany3Sunday;
lect.epiphany3Monday    = day('Proverbs 10:12-14, 18-21','Philippians 1:27-2:11','Ezekiel 27:1-5, 26-36','John 5:1-15');
lect.epiphany3Tuesday   = day('Proverbs 10:22-29','Philippians 2:12-18', 'Ezekiel 33:1-9',    'John 5:16-29');
lect.epiphany3Wednesday = day('Proverbs 11:9-14, 24-30','Philippians 2:19-30','Ezekiel 33:10-20','John 5:30-47');
lect.epiphany3Thursday  = day('Proverbs 14:26-35','Philippians 3:1-16',  'Ezekiel 33:23-33',  'John 6:1-14');
lect.epiphany3Friday    = day('Proverbs 15:16-23, 27-29','Philippians 3:17-4:3','Ezekiel 34:1-10','John 6:15-29');
lect.epiphany3Saturday  = day('Proverbs 16:25-33','Philippians 4:4-23',  'Ezekiel 34:11-16',  'John 6:30-40');

// ══════════════════════════════════════════════════════════════════════════════
// EPIPHANY 4
// ══════════════════════════════════════════════════════════════════════════════
lect.epiphany4Sunday    = existing.epiphany4Sunday;
lect.epiphany4Monday    = day('Proverbs 20:9-12, 17-22','Colossians 1:1-17','Ezekiel 34:25-31','John 6:41-59');
lect.epiphany4Tuesday   = day('Proverbs 21:21-31','Colossians 1:18-2:5', 'Ezekiel 36:22-28',  'John 6:60-71');
lect.epiphany4Wednesday = day('Proverbs 22:1-6, 17-25','Colossians 2:6-19','Ezekiel 37:1-14', 'John 7:1-13');
lect.epiphany4Thursday  = day('Proverbs 23:20-21, 29-35','Colossians 2:20-3:11','Ezekiel 37:21-28','John 7:14-24');
lect.epiphany4Friday    = day('Proverbs 24:23-34','Colossians 3:12-17',  'Ezekiel 39:21-29',  'John 7:25-36');
lect.epiphany4Saturday  = day('Proverbs 25:11-15, 17-22','Colossians 3:18-4:6','Ezekiel 43:1-9','John 7:37-53');

// ══════════════════════════════════════════════════════════════════════════════
// EPIPHANY 5
// ══════════════════════════════════════════════════════════════════════════════
lect.epiphany5Sunday    = existing.epiphany5Sunday;
lect.epiphany5Monday    = day('Proverbs 26:17-28','1 Peter 1:1-12',    'Isaiah 14:3-11',       '1 Thessalonians 1:1-10');
lect.epiphany5Tuesday   = day('Proverbs 27:1-6, 10-12','1 Peter 1:13-25','Isaiah 14:12-20',   '1 Thessalonians 2:1-13');
lect.epiphany5Wednesday = day('Proverbs 28:1-13','1 Peter 2:1-10',     'Isaiah 22:1-5, 12-14', '1 Thessalonians 2:17-3:13');
lect.epiphany5Thursday  = day('Proverbs 29:11-25','1 Peter 2:11-17',   'Isaiah 24:1-6, 10-16','1 Thessalonians 4:1-12');
lect.epiphany5Friday    = day('Proverbs 30:4-9', '1 Peter 2:18-25',    'Isaiah 31:1-9',        '1 Thessalonians 4:13-18');
lect.epiphany5Saturday  = day('Proverbs 31:10-31','1 Peter 3:1-12',    'Isaiah 47:1, 7-15',   '1 Thessalonians 5:1-11');

// ══════════════════════════════════════════════════════════════════════════════
// EPIPHANY 6 (Sunday only - no weekdays in original file)
// ══════════════════════════════════════════════════════════════════════════════
lect.epiphany6Sunday    = existing.epiphany6Sunday;

// ══════════════════════════════════════════════════════════════════════════════
// SEPTUAGESIMA
// ══════════════════════════════════════════════════════════════════════════════
lect.septuagesimaSunday    = existing.septuagesimaSunday;
lect.septuagesimaMonday    = day('Genesis 1:1-19',   'Mark 6:7-13',        'Amos 7:1-8; 8:1-3',   'Galatians 1:1-10');
lect.septuagesimaTuesday   = day('Genesis 1:20-2:3', 'Mark 6:14-29',       'Amos 1:1-5, 13-2:3',  'Galatians 1:11-24');
lect.septuagesimaWednesday = day('Genesis 2:4-9, 16-25','Mark 6:30-44',    'Amos 2:6-16',         'Galatians 2:1-10');
lect.septuagesimaThursday  = day('Genesis 3:1-24',   'Mark 6:45-56',       'Amos 3:1-15',         'Galatians 2:11-21');
lect.septuagesimaFriday    = day('Genesis 4:1-16',   'Mark 7:1-13',        'Amos 4:4-13',         'Galatians 3:1-9');
lect.septuagesimaSaturday  = day('Genesis 6:5-8, 13-22','Mark 7:14-23',    'Amos 5:1-11',         'Galatians 3:10-18');

// ══════════════════════════════════════════════════════════════════════════════
// SEXAGESIMA
// ══════════════════════════════════════════════════════════════════════════════
lect.sexagesimaSunday    = existing.sexagesimaSunday;
lect.sexagesimaMonday    = day('Genesis 7:1, 7-10, 17-23','Mark 7:24-37','Amos 5:14-24',        'Galatians 3:19-29');
lect.sexagesimaTuesday   = day('Genesis 8:6-22',     'Mark 8:1-21',        'Amos 6:1-8',          'Galatians 4:1-11');
lect.sexagesimaWednesday = day('Genesis 9:8-17',     'Mark 8:22-38',       'Amos 8:4-12',         'Galatians 4:12-20');
lect.sexagesimaThursday  = day('Genesis 11:1-9',     'Mark 9:1-29',        'Amos 9:1-10',         'Galatians 4:21-31');
lect.sexagesimaFriday    = day('Genesis 11:27-12:8', 'Mark 9:30-50',       'Amos 7:10-17',        'Galatians 5:1-12');
lect.sexagesimaSaturday  = day('Genesis 13:2, 5-18', 'Mark 10:1-31',       'Hosea 4:1-2, 6-10',   'Galatians 5:13-26');

// ══════════════════════════════════════════════════════════════════════════════
// QUINQUAGESIMA
// ══════════════════════════════════════════════════════════════════════════════
lect.quinquagesimaSunday    = existing.quinquagesimaSunday;
lect.quinquagesimaMonday    = day('Genesis 18:1-16',  'Mark 10:32-52',      'Hosea 5:10-6:6',      'Galatians 6:1-10');
lect.quinquagesimaTuesday   = day('Genesis 18:20-33', 'Mark 11:1-26',       'Hosea 11:1-4; 13:5-16','Galatians 6:11-18');

// ══════════════════════════════════════════════════════════════════════════════
// ASH WEDNESDAY
// ══════════════════════════════════════════════════════════════════════════════
lect.ashWednesday = day('Isaiah 58:1-12',       'Hebrews 12:1-14',    'Jonah 3:1-4:11',       'Luke 15:10-32');

// ══════════════════════════════════════════════════════════════════════════════
// LENT 1
// ══════════════════════════════════════════════════════════════════════════════
lect.lent1Sunday    = existing.lent1Sunday;
lect.lent1Monday    = day('Genesis 24:1-27',    '1 Corinthians 3:1-7', 'Jeremiah 3:19-25',    'John 9:1-23');
lect.lent1Tuesday   = day('Genesis 24:28-38, 49-51, 58-67','1 Corinthians 3:18-4:5','Jeremiah 4:1-9','John 9:24-41');
lect.lent1Wednesday = day('Ezekiel 2:1-10',    'Matthew 9:1-13',      'Ezekiel 3:16-27',      '2 Corinthians 4:1-18');
lect.lent1Thursday  = day('Genesis 25:28-34',  '1 Corinthians 4:6-21','Jeremiah 4:11-22',     'John 10:1-10');
lect.lent1Friday    = day('Ezekiel 34:1-16',   'Matthew 10:24-33, 37-42','Ezekiel 37:1-14',   '1 Timothy 4:1-16');
lect.lent1Saturday  = day('Ezekiel 34:17-25, 30-31','2 Timothy 2:1-15','Ezekiel 37:21-28',    '1 Timothy 6:6-21');

// ══════════════════════════════════════════════════════════════════════════════
// LENT 2
// ══════════════════════════════════════════════════════════════════════════════
lect.lent2Sunday    = existing.lent2Sunday;
lect.lent2Monday    = day('Genesis 27:1-29',   '1 Corinthians 5:1-13','Jeremiah 4:23-31',     'John 10:11-21');
lect.lent2Tuesday   = day('Genesis 27:30-40',  '1 Corinthians 6:1-11','Jeremiah 5:1-9',       'John 10:22-38');
lect.lent2Wednesday = day('Genesis 27:46-28:4, 10-22','1 Corinthians 6:12-20','Jeremiah 5:10-19','John 11:1-16');
lect.lent2Thursday  = day('Genesis 29:1-13, 18-20','1 Corinthians 7:1-17','Jeremiah 5:20-31', 'John 11:17-27');
lect.lent2Friday    = day('Genesis 32:22-31',  '1 Corinthians 8:1-13','Jeremiah 6:1-8',       'John 11:28-44');
lect.lent2Saturday  = day('Genesis 35:1-7, 16-20','1 Corinthians 9:1-14','Jeremiah 6:9-21',   'John 11:45-57');

// ══════════════════════════════════════════════════════════════════════════════
// LENT 3
// ══════════════════════════════════════════════════════════════════════════════
lect.lent3Sunday    = existing.lent3Sunday;
lect.lent3Monday    = day('Genesis 37:3-28, 36','1 Corinthians 9:15-27','Jeremiah 7:1-15',    'Mark 10:17-31');
lect.lent3Tuesday   = day('Genesis 40:1-23',   '1 Corinthians 10:1-13','Jeremiah 7:21-29',   'Mark 10:32-45');
lect.lent3Wednesday = day('Genesis 41:1, 8, 14-24','1 Corinthians 10:14-22','Jeremiah 8:4-13','Mark 10:46-52');
lect.lent3Thursday  = day('Genesis 41:25-40',  '1 Corinthians 10:23-11:1','Jeremiah 9:2-16', 'Mark 11:12-26');
lect.lent3Friday    = day('Genesis 42:1-26, 35-38','1 Corinthians 11:17-34','Jeremiah 9:17-24','Mark 12:1-12');
lect.lent3Saturday  = day('Genesis 43:1-5, 11-16, 26-34','1 Corinthians 12:1-11','Jeremiah 10:1-13','Mark 12:13-17');

// ══════════════════════════════════════════════════════════════════════════════
// LENT 4
// ══════════════════════════════════════════════════════════════════════════════
lect.lent4Sunday    = existing.lent4Sunday;
lect.lent4Monday    = day('Genesis 44:1-34',   '1 Corinthians 12:12-31','Jeremiah 13:15-27',  'Mark 12:18-27');
lect.lent4Tuesday   = day('Genesis 45:1-28',   '1 Corinthians 12:31-13:13','Jeremiah 14:1-10','Mark 12:28-37');
lect.lent4Wednesday = day('Genesis 47:29-31; 48:8-20','1 Corinthians 14:1-12','Jeremiah 15:1-9','Mark 12:38-44');
lect.lent4Thursday  = day('Genesis 49:33-50:26','1 Corinthians 14:13-25','Jeremiah 15:10-21', 'Mark 13:1-13');
lect.lent4Friday    = day('Exodus 1:8-14, 22', '1 Corinthians 14:26-40','Jeremiah 16:5-13',   'Mark 13:14-23');
lect.lent4Saturday  = day('Exodus 2:1-22',     '1 Corinthians 15:1-11','Jeremiah 17:5-14',    'Mark 13:24-37');

// ══════════════════════════════════════════════════════════════════════════════
// LENT 5
// ══════════════════════════════════════════════════════════════════════════════
lect.lent5Sunday    = existing.lent5Sunday;
lect.lent5Monday    = day('Exodus 3:1-15',     '1 Corinthians 15:12-19','Jeremiah 20:7-13',   'John 12:1-11');
lect.lent5Tuesday   = day('Exodus 4:10-18, 27-31','1 Corinthians 15:20-34','Jeremiah 22:10-23','John 12:12-19');
lect.lent5Wednesday = day('Exodus 5:1-9, 19-6:1','1 Corinthians 15:35-49','Jeremiah 28:1-2, 10-17','John 12:20-33');
lect.lent5Thursday  = day('Exodus 11:1-8',     '1 Corinthians 15:50-58','Jeremiah 30:12-17, 23-24','John 12:34-43');
lect.lent5Friday    = day('Exodus 12:21-28',   '1 Corinthians 16:1-14','Jeremiah 32:36-42',   'John 12:44-50');
lect.lent5Saturday  = day('Exodus 12:29-39, 42','1 Corinthians 16:15-24','Jeremiah 33:1-9, 14-16','John 13:1-17');

// ══════════════════════════════════════════════════════════════════════════════
// HOLY WEEK
// ══════════════════════════════════════════════════════════════════════════════
lect.palmSundaySunday = existing.palmSundaySunday;
lect.holyMonday    = day('Isaiah 42:1-7',      'John 14:1-14',        'Lamentations 1:7-12',  'John 14:15-31');
lect.holyTuesday   = day('Hosea 14:1-9',       'John 15:1-16',        'Lamentations 2:10, 13-19','John 15:17-27');
lect.holyWednesday = day('Zechariah 12:9-10; 13:1, 7-9','John 16:1-15','Lamentations 3:1, 14-33','John 16:16-33');
lect.maundyThursday = day('Jeremiah 31:31-34', 'John 13:18-38',       'Lamentations 3:40-58', 'John 17:1-26');
lect.goodFriday    = day('Genesis 22:1-18',    'John 18:1-40',        'Isaiah 52:13-53:12',   '1 Peter 2:11-25');
lect.holySaturday  = day('Job 14:1-14',        'John 19:38-42',       'Job 19:21-27',         'Romans 6:3-11');

// ══════════════════════════════════════════════════════════════════════════════
// EASTER DAY and EASTER WEEK
// ══════════════════════════════════════════════════════════════════════════════
lect.easterDaySunday    = existing.easterDaySunday;
lect.easterDayMonday    = day('Isaiah 61:1-3, 10-11','Luke 24:1-12',   'Exodus 15:1-13',       'John 20:1-10');
lect.easterDayTuesday   = day('Daniel 12:1-4, 13','1 Thessalonians 4:13-18','Isaiah 30:18-21','John 20:11-18');
lect.easterDayWednesday = day('Micah 7:7-9, 18-20','1 Timothy 6:11-19','Isaiah 26:12-16, 19', 'John 20:19-23');
lect.easterDayThursday  = day('Ezekiel 37:1-14', 'Philippians 3:7-21','Isaiah 52:1-10',       'John 20:24-31');
lect.easterDayFriday    = day('Isaiah 65:17-25', 'Revelation 1:4-18', 'Zephaniah 3:14-20',    'John 21:1-14');
lect.easterDaySaturday  = day('Isaiah 25:1-9',   'Revelation 7:9-17', 'Jeremiah 31:10-14',    'John 21:15-25');

// ══════════════════════════════════════════════════════════════════════════════
// EASTER 1
// ══════════════════════════════════════════════════════════════════════════════
lect.easter1Sunday    = existing.easter1Sunday;
lect.easter1Monday    = day('Numbers 22:2-14',   'Luke 2:21-40',       'Ezra 5:1-2, 6-17',     'Acts 9:1-19');
lect.easter1Tuesday   = day('Numbers 22:15-21, 36-40','Luke 2:41-52', 'Ezra 6:1-12',          'Acts 9:20-31');
lect.easter1Wednesday = day('Numbers 22:41-23:12','Luke 3:1-22',       'Ezra 6:13-18',         'Acts 9:32-43');
lect.easter1Thursday  = day('Numbers 23:13-26',  'Luke 4:1-13',        'Zechariah 7:8-14',     'Acts 10:1-23');
lect.easter1Friday    = day('Numbers 23:27-24:13, 25','Luke 4:14-30',  'Zechariah 8:1-13',     'Acts 10:24-33');
lect.easter1Saturday  = day('Deuteronomy 34:1-12','Luke 4:31-41',      'Zechariah 8:14-23',    'Acts 10:34-48');

// ══════════════════════════════════════════════════════════════════════════════
// EASTER 2
// ══════════════════════════════════════════════════════════════════════════════
lect.easter2Sunday    = existing.easter2Sunday;
lect.easter2Monday    = day('Joshua 1:1-18',     'Luke 4:42-5:11',     'Ezra 7:1, 6-16, 25-28','Acts 11:1-18');
lect.easter2Tuesday   = day('Joshua 3:1-6, 13-17','Luke 5:12-26',      'Ezra 8:15, 21-23, 31-36','Acts 11:19-30');
lect.easter2Wednesday = day('Joshua 4:1-8',      'Luke 5:27-39',       'Nehemiah 1:1-11',      'Acts 12:1-24');
lect.easter2Thursday  = day('Joshua 6:1-7, 11, 14-20','Luke 6:1-11',   'Nehemiah 2:1-8',       'Acts 12:25-13:12');
lect.easter2Friday    = day('Joshua 14:6-15',    'Luke 6:12-26',       'Nehemiah 2:9-20',      'Acts 13:13-25');
lect.easter2Saturday  = day('Joshua 23:1-3, 11-16','Luke 6:27-38',     'Nehemiah 4:6-23',      'Acts 13:26-43');

// ══════════════════════════════════════════════════════════════════════════════
// EASTER 3
// ══════════════════════════════════════════════════════════════════════════════
lect.easter3Sunday    = existing.easter3Sunday;
lect.easter3Monday    = day('Judges 5:1-18',     'Luke 6:39-49',       'Nehemiah 5:1-13',      'Acts 13:44-14:7');
lect.easter3Tuesday   = day('Judges 5:19-31',    'Luke 7:1-10',        'Nehemiah 8:1-3, 5-6, 9-12','Acts 14:8-18');
lect.easter3Wednesday = day('Judges 6:1, 11-16, 33-35','Luke 7:11-17', 'Nehemiah 9:5-15',      'Acts 14:19-28');
lect.easter3Thursday  = day('Judges 7:1-8',      'Luke 7:18-35',       'Nehemiah 9:32-38',     'Acts 15:1-12');
lect.easter3Friday    = day('Judges 7:16-25',    'Luke 7:36-50',       'Nehemiah 13:15-22',    'Acts 15:13-21');
lect.easter3Saturday  = day('Judges 10:17; 11:29-40','Luke 8:1-15',    '1 Maccabees 1:1, 7-15','Acts 15:22-35');

// ══════════════════════════════════════════════════════════════════════════════
// EASTER 4
// ══════════════════════════════════════════════════════════════════════════════
lect.easter4Sunday    = existing.easter4Sunday;
lect.easter4Monday    = day('Judges 13:2-14, 24','Luke 8:16-25',       '1 Maccabees 1:41-53',  'Acts 15:36-16:5');
lect.easter4Tuesday   = day('Judges 16:4-14',   'Luke 8:26-39',        '1 Maccabees 1:54-64',  'Acts 16:6-16');
lect.easter4Wednesday = day('Judges 16:15-22',  'Luke 8:40-56',        '1 Maccabees 2:1-14',   'Acts 16:16-24');
lect.easter4Thursday  = day('Judges 16:23-31',  'Luke 9:1-17',         '1 Maccabees 2:15-30',  'Acts 16:25-40');
lect.easter4Friday    = day('Ruth 1:1-14',       'Luke 9:18-27',        '1 Maccabees 2:31-43',  'Acts 17:1-15');
lect.easter4Saturday  = day('Ruth 1:15-22',      'Luke 9:28-45',        '1 Maccabees 2:49-52, 61-70','Acts 17:16-34');

// ══════════════════════════════════════════════════════════════════════════════
// EASTER 5
// ══════════════════════════════════════════════════════════════════════════════
lect.easter5Sunday    = existing.easter5Sunday;
lect.easter5Monday    = day('Ruth 2:1-13',       'Luke 9:46-62',        '1 Maccabees 3:1-9',    'Acts 18:1-11');
lect.easter5Tuesday   = day('Ruth 2:14-23',      'Luke 10:1-24',        '1 Maccabees 3:42-54',  'Acts 18:12-23');
lect.easter5Wednesday = day('Ruth 3:1-13',       'Luke 10:25-37',       '1 Maccabees 4:36-51',  'Acts 18:24-19:7');
lect.easter5Thursday  = day('Ruth 4:1-8',        'Luke 10:38-11:13',    '1 Maccabees 4:52-61',  'Acts 19:8-20');
lect.easter5Friday    = day('Ruth 4:9-17',       'Luke 11:14-28',       'Daniel 1:1-7, 17-21',  'Acts 19:21-41');
lect.easter5Saturday  = day('1 Samuel 1:1-11',   'Luke 11:29-36',       'Daniel 2:1-6, 10-13',  'Acts 20:1-16');

// ══════════════════════════════════════════════════════════════════════════════
// ASCENSION DAY
// ══════════════════════════════════════════════════════════════════════════════
lect.ascensionDay = existing.ascensionDay;

// ══════════════════════════════════════════════════════════════════════════════
// SUNDAY AFTER ASCENSION
// ══════════════════════════════════════════════════════════════════════════════
lect.sundayAfterAscensionSunday    = existing.sundayAfterAscensionSunday;
lect.sundayAfterAscensionMonday    = day('1 Samuel 1:12-20','1 Thessalonians 1:1-10','Daniel 2:14-24','Acts 20:17-38');
lect.sundayAfterAscensionTuesday   = day('1 Samuel 1:21-28; 2:11','1 Thessalonians 2:1-13','Daniel 2:25-35','Acts 21:1-14');
lect.sundayAfterAscensionWednesday = day('1 Samuel 2:18-26','1 Thessalonians 2:17-3:13','Daniel 2:36-45','Acts 21:15-26');
lect.sundayAfterAscensionThursday  = day('1 Samuel 3:1-18','1 Thessalonians 4:1-12','Daniel 3:1-7','Acts 21:27-36');
lect.sundayAfterAscensionFriday    = day('1 Samuel 4:1-11','1 Thessalonians 4:13-18','Daniel 3:8-18','Acts 21:37-22:16');
lect.sundayAfterAscensionSaturday  = day('1 Samuel 4:12-22','1 Thessalonians 5:1-11','Daniel 3:19-30','Acts 22:17-29');

// ══════════════════════════════════════════════════════════════════════════════
// WHITSUNDAY
// ══════════════════════════════════════════════════════════════════════════════
lect.whitsundaySunday    = existing.whitsundaySunday;
lect.whitsundayMonday    = existing.whitsundayMonday;
lect.whitsundayTuesday   = existing.whitsundayTuesday;
// Whitsun Wed-Sat: resume the ordinary week track
// After Whitsunday, continue the Acts track on the NT side
// The OT track continued where Trinity 6 week left off (1 Samuel)
// Using existing data for Whitsunday weekdays - they follow Trinity Sunday pattern
lect.whitsundayWednesday = day('1 Samuel 5:1-12',   'Acts 22:30-23:11',   'Daniel 4:4-5, 10-18', 'Galatians 5:16-26');
lect.whitsundayThursday  = day('1 Samuel 6:1-16',   'Acts 23:12-24',      'Daniel 4:19-27',       'Galatians 6:1-18');
lect.whitsundayFriday    = day('1 Samuel 7:1-17',   'Acts 23:25-24:9',    'Daniel 4:28-37',       'Ephesians 1:1-14');
lect.whitsundaySaturday  = day('1 Samuel 8:1-9',    'Acts 24:10-23',      'Daniel 5:1-9',         'Ephesians 1:15-2:10');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY SUNDAY WEEK
// ══════════════════════════════════════════════════════════════════════════════
lect.trinitySundaySunday    = existing.trinitySundaySunday;
lect.trinitySundayMonday    = day('1 Samuel 10:1-11', 'Acts 25:1-27',    'Daniel 5:10-16',       'Ephesians 2:11-22');
lect.trinitySundayTuesday   = day('1 Samuel 10:17-27','Acts 26:1-23',    'Daniel 5:17-30',       'Ephesians 3:1-21');
lect.trinitySundayWednesday = day('1 Samuel 11:1-13', 'Acts 26:24-27:8', 'Daniel 6:1-8',         'Ephesians 4:1-16');
lect.trinitySundayThursday  = day('1 Samuel 11:14-12:5','Acts 27:9-26',  'Daniel 6:9-15',        'Ephesians 4:17-32');
lect.trinitySundayFriday    = day('1 Samuel 12:19-24','Acts 27:27-44',   'Daniel 6:16-23, 25-27','Ephesians 5:1-21');
lect.trinitySundaySaturday  = day('1 Samuel 15:1-9',  'Acts 28:1-15',    'Esther 2:5-8, 17-23',  'Ephesians 5:22-6:9');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 1
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity1Sunday    = existing.trinity1Sunday;
lect.trinity1Monday    = day('Numbers 22:2-14',   'Luke 2:21-40',       'Ezra 5:1-2, 6-17',     'Acts 9:1-19');
lect.trinity1Tuesday   = day('Numbers 22:15-21, 36-40','Luke 2:41-52', 'Ezra 6:1-12',          'Acts 9:20-31');
lect.trinity1Wednesday = day('Numbers 22:41-23:12','Luke 3:1-22',       'Ezra 6:13-18',         'Acts 9:32-43');
lect.trinity1Thursday  = day('Numbers 23:13-26',  'Luke 4:1-13',        'Zechariah 7:8-14',     'Acts 10:1-23');
lect.trinity1Friday    = day('Numbers 23:27-24:13, 25','Luke 4:14-30',  'Zechariah 8:1-13',     'Acts 10:24-33');
lect.trinity1Saturday  = day('Deuteronomy 34:1-12','Luke 4:31-41',      'Zechariah 8:14-23',    'Acts 10:34-48');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 2
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity2Sunday    = existing.trinity2Sunday;
lect.trinity2Monday    = day('Joshua 1:1-18',     'Luke 4:42-5:11',     'Ezra 7:1, 6-16, 25-28','Acts 11:1-18');
lect.trinity2Tuesday   = day('Joshua 3:1-6, 13-17','Luke 5:12-26',      'Ezra 8:15, 21-23, 31-36','Acts 11:19-30');
lect.trinity2Wednesday = day('Joshua 4:1-8',      'Luke 5:27-39',       'Nehemiah 1:1-11',      'Acts 12:1-24');
lect.trinity2Thursday  = day('Joshua 6:1-7, 11, 14-20','Luke 6:1-11',   'Nehemiah 2:1-8',       'Acts 12:25-13:12');
lect.trinity2Friday    = day('Joshua 14:6-15',    'Luke 6:12-26',       'Nehemiah 2:9-20',      'Acts 13:13-25');
lect.trinity2Saturday  = day('Joshua 23:1-3, 11-16','Luke 6:27-38',     'Nehemiah 4:6-23',      'Acts 13:26-43');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 3
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity3Sunday    = existing.trinity3Sunday;
lect.trinity3Monday    = day('Judges 5:1-18',     'Luke 6:39-49',       'Nehemiah 5:1-13',      'Acts 13:44-14:7');
lect.trinity3Tuesday   = day('Judges 5:19-31',    'Luke 7:1-10',        'Nehemiah 8:1-3, 5-6, 9-12','Acts 14:8-18');
lect.trinity3Wednesday = day('Judges 6:1, 11-16, 33-35','Luke 7:11-17', 'Nehemiah 9:5-15',      'Acts 14:19-28');
lect.trinity3Thursday  = day('Judges 7:1-8',      'Luke 7:18-35',       'Nehemiah 9:32-38',     'Acts 15:1-12');
lect.trinity3Friday    = day('Judges 7:16-25',    'Luke 7:36-50',       'Nehemiah 13:15-22',    'Acts 15:13-21');
lect.trinity3Saturday  = day('Judges 10:17; 11:29-40','Luke 8:1-15',    '1 Maccabees 1:1, 7-15','Acts 15:22-35');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 4
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity4Sunday    = existing.trinity4Sunday;
lect.trinity4Monday    = day('Judges 13:2-14, 24','Luke 8:16-25',       '1 Maccabees 1:41-53',  'Acts 15:36-16:5');
lect.trinity4Tuesday   = day('Judges 16:4-14',   'Luke 8:26-39',        '1 Maccabees 1:54-64',  'Acts 16:6-16');
lect.trinity4Wednesday = day('Judges 16:15-22',  'Luke 8:40-56',        '1 Maccabees 2:1-14',   'Acts 16:16-24');
lect.trinity4Thursday  = day('Judges 16:23-31',  'Luke 9:1-17',         '1 Maccabees 2:15-30',  'Acts 16:25-40');
lect.trinity4Friday    = day('Ruth 1:1-14',       'Luke 9:18-27',        '1 Maccabees 2:31-43',  'Acts 17:1-15');
lect.trinity4Saturday  = day('Ruth 1:15-22',      'Luke 9:28-45',        '1 Maccabees 2:49-52, 61-70','Acts 17:16-34');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 5
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity5Sunday    = existing.trinity5Sunday;
lect.trinity5Monday    = day('Ruth 2:1-13',       'Luke 9:46-62',        '1 Maccabees 3:1-9',    'Acts 18:1-11');
lect.trinity5Tuesday   = day('Ruth 2:14-23',      'Luke 10:1-24',        '1 Maccabees 3:42-54',  'Acts 18:12-23');
lect.trinity5Wednesday = day('Ruth 3:1-13',       'Luke 10:25-37',       '1 Maccabees 4:36-51',  'Acts 18:24-19:7');
lect.trinity5Thursday  = day('Ruth 4:1-8',        'Luke 10:38-11:13',    '1 Maccabees 4:52-61',  'Acts 19:8-20');
lect.trinity5Friday    = day('Ruth 4:9-17',       'Luke 11:14-28',       'Daniel 1:1-7, 17-21',  'Acts 19:21-41');
lect.trinity5Saturday  = day('1 Samuel 1:1-11',   'Luke 11:29-36',       'Daniel 2:1-6, 10-13',  'Acts 20:1-16');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 6
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity6Sunday    = existing.trinity6Sunday;
lect.trinity6Monday    = day('1 Samuel 1:12-20',  'Luke 15:1-10',        'Daniel 2:14-24',       'Acts 20:17-38');
lect.trinity6Tuesday   = day('1 Samuel 1:21-28; 2:11','Luke 15:11-32',   'Daniel 2:25-35',       'Acts 21:1-14');
lect.trinity6Wednesday = day('1 Samuel 2:18-26',  'Luke 16:1-18',        'Daniel 2:36-45',       'Acts 21:15-26');
lect.trinity6Thursday  = day('1 Samuel 3:1-18',   'Luke 16:19-31',       'Daniel 3:1-7',         'Acts 21:27-36');
lect.trinity6Friday    = day('1 Samuel 4:1-11',   'Luke 17:1-10',        'Daniel 3:8-18',        'Acts 21:37-22:16');
lect.trinity6Saturday  = day('1 Samuel 4:12-22',  'Luke 17:11-19',       'Daniel 3:19-30',       'Acts 22:17-29');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 7
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity7Sunday    = existing.trinity7Sunday;
lect.trinity7Monday    = day('1 Samuel 8:4-22',   'Luke 17:20-37',       'Daniel 4:4-5, 10-18',  'Acts 22:30-23:11');
lect.trinity7Tuesday   = day('1 Samuel 9:1-10',   'Luke 18:1-14',        'Daniel 4:19-27',       'Acts 23:12-24');
lect.trinity7Wednesday = day('1 Samuel 9:11-21',  'Luke 18:15-30',       'Daniel 4:28-37',       'Acts 23:25-24:9');
lect.trinity7Thursday  = day('1 Samuel 9:22-27',  'Luke 18:31-43',       'Daniel 5:1-9',         'Acts 24:10-23');
lect.trinity7Friday    = day('1 Samuel 10:1-11',  'Luke 19:1-10',        'Daniel 5:10-16',       'Acts 24:24-25:12');
lect.trinity7Saturday  = day('1 Samuel 10:17-27', 'Luke 19:11-28',       'Daniel 5:17-30',       'Acts 25:1-27');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 8
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity8Sunday    = existing.trinity8Sunday;
lect.trinity8Monday    = day('1 Samuel 11:1-13',  'Luke 15:1-10',        'Daniel 6:1-8',         'Acts 26:1-23');
lect.trinity8Tuesday   = day('1 Samuel 11:14-12:5','Luke 15:11-32',      'Daniel 6:9-15',        'Acts 26:24-27:8');
lect.trinity8Wednesday = day('1 Samuel 12:19-24', 'Luke 16:1-18',        'Daniel 6:16-23, 25-27','Acts 27:9-26');
lect.trinity8Thursday  = day('1 Samuel 15:1-9',   'Luke 16:19-31',       'Esther 2:5-8, 17-23',  'Acts 27:27-44');
lect.trinity8Friday    = day('1 Samuel 15:10-23', 'Luke 17:1-10',        'Esther 3:1-12',        'Acts 28:1-15');
lect.trinity8Saturday  = day('1 Samuel 15:24-34', 'Luke 17:11-19',       'Esther 4:1, 5-17',     'Acts 28:16-31');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 9
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity9Sunday    = existing.trinity9Sunday;
lect.trinity9Monday    = day('1 Samuel 16:1-13',  'Luke 17:20-37',       'Esther 5:1-14',        'Romans 1:1-17');
lect.trinity9Tuesday   = day('1 Samuel 16:14-23', 'Luke 18:1-14',        'Esther 6:1-14',        'Romans 2:1-16');
lect.trinity9Wednesday = day('1 Samuel 17:1-11',  'Luke 18:15-30',       'Esther 7:1-10',        'Romans 2:17-29');
lect.trinity9Thursday  = day('1 Samuel 17:17-27', 'Luke 18:31-43',       'Micah 1:1-7',          'Romans 3:1-20');
lect.trinity9Friday    = day('1 Samuel 17:28-40', 'Luke 19:1-10',        'Micah 2:1-13',         'Romans 3:21-31');
lect.trinity9Saturday  = day('1 Samuel 17:41-51', 'Luke 19:11-28',       'Micah 3:1-8',          'Romans 4:1-12');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 10
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity10Sunday    = existing.trinity10Sunday;
lect.trinity10Monday    = day('1 Samuel 18:1-9',  'Luke 19:29-40',       'Micah 4:1-8',          'Romans 4:13-25');
lect.trinity10Tuesday   = day('1 Samuel 20:1-7, 12-23','Luke 19:47-20:8','Micah 4:9-5:1',       'Romans 5:1-21');
lect.trinity10Wednesday = day('1 Samuel 20:24-39','Luke 20:9-26',        'Micah 6:1-8',          'Romans 6:1-23');
lect.trinity10Thursday  = day('1 Samuel 22:6-23', 'Luke 20:27-40',       'Micah 6:9-16',         'Romans 7:1-13');
lect.trinity10Friday    = day('1 Samuel 23:7-18', 'Luke 20:41-21:4',     'Micah 7:1-9',          'Romans 7:14-25');
lect.trinity10Saturday  = day('1 Samuel 28:3-19', 'Luke 21:5-19',        'Micah 7:14-20',        'Romans 8:1-17');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 11
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity11Sunday    = existing.trinity11Sunday;
lect.trinity11Monday    = day('1 Samuel 31:1-13', 'Luke 21:20-38',       'Nahum 1:3-8, 15',      'Romans 8:18-27');
lect.trinity11Tuesday   = day('2 Samuel 1:1-16',  'Luke 22:1-13',        'Nahum 2:1-13',         'Romans 8:28-39');
lect.trinity11Wednesday = day('2 Samuel 1:17-27', 'Luke 22:14-30',       'Nahum 3:1-19',         'Romans 9:1-5, 14-24, 30-33');
lect.trinity11Thursday  = day('2 Samuel 4:1, 5, 7-12','Luke 22:31-46',   'Habakkuk 1:2-4, 12-2:4','Romans 10:1-21');
lect.trinity11Friday    = day('2 Samuel 5:1-10',  'Luke 22:47-62',       'Habakkuk 2:9-14, 19-20','Romans 11:1-21');
lect.trinity11Saturday  = day('2 Samuel 6:1-11',  'Luke 22:63-23:12',    'Habakkuk 3:2-6, 10-13, 18-19','Romans 11:22-36');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 12
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity12Sunday    = existing.trinity12Sunday;
lect.trinity12Monday    = day('2 Samuel 6:12-15, 17-19','Luke 23:13-25', 'Zephaniah 1:2-3, 7, 14-18','Romans 12:1-21');
lect.trinity12Tuesday   = day('2 Samuel 7:1-11, 16-17','Luke 23:26-38', 'Zephaniah 3:1-8',      'Romans 13:1-14');
lect.trinity12Wednesday = day('2 Samuel 7:18-29', 'Luke 23:39-49',       'Zephaniah 3:9-20',     'Romans 14:1-12');
lect.trinity12Thursday  = day('2 Samuel 9:1-9, 13','Luke 23:50-24:12',   'Sirach 1:1-10',        'Romans 14:13-23');
lect.trinity12Friday    = day('2 Samuel 11:1-13', 'Luke 24:13-35',       'Sirach 1:11-20, 26-27','Romans 15:1-16');
lect.trinity12Saturday  = day('2 Samuel 11:14-27','Luke 24:36-53',       'Sirach 2:1-18',        'Romans 15:17-33');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 13
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity13Sunday    = existing.trinity13Sunday;
lect.trinity13Monday    = day('2 Samuel 12:1-10, 13-15','2 Corinthians 1:1-24','Sirach 3:17-31','Matthew 1:18-25');
lect.trinity13Tuesday   = day('2 Samuel 12:15-23','2 Corinthians 2:1-17','Sirach 4:1-18',      'Matthew 2:1-12');
lect.trinity13Wednesday = day('2 Samuel 15:1-12','2 Corinthians 3:1-18', 'Sirach 4:20-5:7',   'Matthew 2:13-23');
lect.trinity13Thursday  = day('2 Samuel 15:13-29','2 Corinthians 4:1-18','Sirach 15:11-20',    'Matthew 3:1-17');
lect.trinity13Friday    = day('2 Samuel 15:30-16:4','2 Corinthians 5:1-10','Sirach 16:17-30',  'Matthew 4:1-11');
lect.trinity13Saturday  = day('2 Samuel 16:5-19','2 Corinthians 5:11-21','Sirach 19:4-18',     'Matthew 4:12-25');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 14
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity14Sunday    = existing.trinity14Sunday;
lect.trinity14Monday    = day('2 Samuel 16:23-17:14','2 Corinthians 6:1-10','Sirach 19:20-30','Matthew 5:1-16');
lect.trinity14Tuesday   = day('2 Samuel 17:15-23','2 Corinthians 6:11-7:1','Sirach 20:9-20',  'Matthew 5:17-26');
lect.trinity14Wednesday = day('2 Samuel 18:1-17','2 Corinthians 7:2-16',  'Sirach 24:1-9, 18-22','Matthew 5:27-37');
lect.trinity14Thursday  = day('2 Samuel 18:19-33','2 Corinthians 8:1-15', 'Sirach 28:13-26',   'Matthew 5:38-48');
lect.trinity14Friday    = day('2 Samuel 19:1-10','2 Corinthians 8:16-24',  'Sirach 31:12-18, 25-32:2','Matthew 6:1-18');
lect.trinity14Saturday  = day('2 Samuel 19:11-23','2 Corinthians 9:1-15',  'Sirach 34:1-8',    'Matthew 6:19-34');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 15
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity15Sunday    = existing.trinity15Sunday;
lect.trinity15Monday    = day('2 Samuel 19:24-39','2 Corinthians 10:1-18','Sirach 34:18-35:3','Matthew 7:1-12');
lect.trinity15Tuesday   = day('2 Samuel 23:8-17','2 Corinthians 11:1-15','Sirach 36:1-17',    'Matthew 7:13-29');
lect.trinity15Wednesday = day('2 Samuel 24:1, 10-25','2 Corinthians 11:16-33','Sirach 37:6-15','Matthew 8:1-13');
lect.trinity15Thursday  = day('1 Kings 2:1-4, 10-12','2 Corinthians 12:1-13','Sirach 38:24-34','Matthew 8:14-27');
lect.trinity15Friday    = day('1 Kings 3:4-15',  '2 Corinthians 12:14-21','Sirach 42:15-21',  'Matthew 8:28-9:8');
lect.trinity15Saturday  = day('1 Kings 3:16-28', '2 Corinthians 13:1-14', 'Sirach 43:1-12',   'Matthew 9:9-17');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 16
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity16Sunday    = existing.trinity16Sunday;
lect.trinity16Monday    = day('1 Kings 8:1-11',  '1 Thessalonians 1:1-10','Sirach 43:13-19',  'Matthew 9:18-35');
lect.trinity16Tuesday   = day('1 Kings 8:12-21', '1 Thessalonians 2:1-13','Sirach 43:20-33',  'Matthew 9:36-10:15');
lect.trinity16Wednesday = day('1 Kings 8:22-30', '1 Thessalonians 2:17-3:13','Sirach 44:1-15','Matthew 10:16-31');
lect.trinity16Thursday  = day('1 Kings 8:54-63', '1 Thessalonians 4:1-12','Job 1:1-12',        'Matthew 10:32-11:1');
lect.trinity16Friday    = day('1 Kings 9:1-9',   '1 Thessalonians 4:13-18','Job 1:13-22',      'Matthew 11:2-19');
lect.trinity16Saturday  = day('1 Kings 11:26-31, 34-37','1 Thessalonians 5:1-11','Job 2:1-13','Matthew 11:20-30');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 17
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity17Sunday    = existing.trinity17Sunday;
lect.trinity17Monday    = day('1 Kings 12:1-11', '2 Timothy 1:1-14',    'Job 3:1-10, 13-20',    'Matthew 12:1-13');
lect.trinity17Tuesday   = day('1 Kings 12:12-20','2 Timothy 1:15-2:13', 'Job 4:12-21',          'Matthew 12:14-30');
lect.trinity17Wednesday = day('1 Kings 12:25-33','2 Timothy 2:14-26',   'Job 5:8-18',           'Matthew 12:31-50');
lect.trinity17Thursday  = day('1 Kings 16:29-34','2 Timothy 3:1-17',    'Job 10:1-9, 12-18',    'Matthew 13:1-23');
lect.trinity17Friday    = day('1 Kings 17:1-16', '2 Timothy 4:1-8',     'Job 11:7-20',          'Matthew 13:24-30, 36-43');
lect.trinity17Saturday  = day('1 Kings 17:17-24','2 Timothy 4:9-22',    'Job 12:1-10',          'Matthew 13:31-35, 44-52');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 18
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity18Sunday    = existing.trinity18Sunday;
lect.trinity18Monday    = day('1 Kings 18:1-15', 'James 1:12-21',       'Job 12:13-22',         'Matthew 13:53-14:12');
lect.trinity18Tuesday   = day('1 Kings 18:16-24','James 1:22-27',       'Job 14:1-14',          'Matthew 14:13-21');
lect.trinity18Wednesday = day('1 Kings 18:25-30, 36-46','James 2:1-13', 'Job 18:5-7, 14-21',   'Matthew 14:22-36');
lect.trinity18Thursday  = day('1 Kings 19:1-8',  'James 2:14-26',       'Job 21:7-20, 29-33',   'Matthew 15:1-20');
lect.trinity18Friday    = day('1 Kings 19:9-21', 'James 3:1-18',        'Job 24:1-4, 12-20',    'Matthew 15:21-39');
lect.trinity18Saturday  = day('1 Kings 21:1-10', 'James 4:1-12',        'Job 25:2-6; 26:6-14',  'Matthew 16:1-12');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 19
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity19Sunday    = existing.trinity19Sunday;
lect.trinity19Monday    = day('1 Kings 21:11-22','James 4:13-5:11',     'Job 28:12-28',         'Matthew 16:13-28');
lect.trinity19Tuesday   = day('1 Kings 22:1-12', 'James 5:12-20',       'Job 38:1-11, 16-18',   'Matthew 17:1-13');
lect.trinity19Wednesday = day('1 Kings 22:13-28','1 Timothy 1:1-11',    'Job 38:19-30',         'Matthew 17:14-27');
lect.trinity19Thursday  = day('1 Kings 22:29-40','1 Timothy 1:12-20',   'Job 38:31-38',         'Matthew 18:1-14');
lect.trinity19Friday    = day('2 Kings 1:2-8, 17','1 Timothy 2:1-10',   'Job 39:19-30',         'Matthew 18:15-35');
lect.trinity19Saturday  = day('2 Kings 2:1-15',  '1 Timothy 3:1-13',    'Job 42:1-9',           'Matthew 19:1-15');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 20
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity20Sunday    = existing.trinity20Sunday;
lect.trinity20Monday    = day('2 Kings 4:8-17',  '1 Timothy 3:14-4:5',  'Ecclesiastes 1:2-11',  'Matthew 19:16-30');
lect.trinity20Tuesday   = day('2 Kings 4:18-25', '1 Timothy 4:6-16',    'Ecclesiastes 2:1-11',  'Matthew 20:1-16');
lect.trinity20Wednesday = day('2 Kings 4:25-37', '1 Timothy 5:1-16',    'Ecclesiastes 2:18-26', 'Matthew 20:17-34');
lect.trinity20Thursday  = day('2 Kings 5:1-8',   '1 Timothy 5:17-25',   'Ecclesiastes 3:1-2, 9-15','Matthew 21:1-16');
lect.trinity20Friday    = day('2 Kings 5:9-19',  '1 Timothy 6:1-11',    'Ecclesiastes 3:16-22', 'Matthew 21:17-32');
lect.trinity20Saturday  = day('2 Kings 5:20-27', '1 Timothy 6:12-21',   'Ecclesiastes 5:1-7',   'Matthew 21:33-46');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 21
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity21Sunday    = existing.trinity21Sunday;
lect.trinity21Monday    = day('2 Kings 6:8-14',  '2 Timothy 1:1-14',    'Ecclesiastes 5:8-20',  'Matthew 22:15-33');
lect.trinity21Tuesday   = day('2 Kings 6:15-23', '2 Timothy 1:15-2:13', 'Ecclesiastes 6:1-2, 7-12','Matthew 22:34-46');
lect.trinity21Wednesday = day('2 Kings 9:1-6, 10-16','2 Timothy 2:14-26','Ecclesiastes 8:12-9:1','Matthew 23:1-12');
lect.trinity21Thursday  = day('2 Kings 9:17-28', '2 Timothy 3:1-17',    'Ecclesiastes 9:11-18', 'Matthew 23:13-23');
lect.trinity21Friday    = day('2 Kings 9:30-37', '2 Timothy 4:1-8',     'Ecclesiastes 11:1-10', 'Matthew 23:25-39');
lect.trinity21Saturday  = day('2 Kings 11:1-4, 9-16','2 Timothy 4:9-22','Ecclesiastes 12:1-14', 'Matthew 24:1-14');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 22
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity22Sunday    = existing.trinity22Sunday;
lect.trinity22Monday    = day('2 Kings 17:6-8, 12-18','Titus 1:1-16',  'Deuteronomy 4:1-9',    'Matthew 24:15-28');
lect.trinity22Tuesday   = day('2 Kings 21:1-3, 10-18','Titus 2:1-15',  'Deuteronomy 4:15-24',  'Matthew 24:29-41');
lect.trinity22Wednesday = day('2 Kings 22:3-13', 'Titus 3:1-15',       'Deuteronomy 4:25-31',  'Matthew 24:42-51');
lect.trinity22Thursday  = day('2 Kings 22:14-20','Philemon 1-25',       'Deuteronomy 4:32-40',  'Matthew 25:1-13');
lect.trinity22Friday    = day('2 Kings 23:1-4, 11-14, 21-23','2 John 1-13','Deuteronomy 5:1-21','Matthew 25:14-30');
lect.trinity22Saturday  = day('2 Kings 23:24-30','3 John 1-14',         'Deuteronomy 5:22-33',  'Matthew 25:31-46');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 23
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity23Sunday    = existing.trinity23Sunday;
lect.trinity23Monday    = day('Jeremiah 35:1-11','Colossians 1:1-17',    'Deuteronomy 6:1-9',    'Matthew 26:1-16');
lect.trinity23Tuesday   = day('Jeremiah 35:12-19','Colossians 1:18-2:5', 'Deuteronomy 6:10-16, 20-25','Matthew 26:17-30');
lect.trinity23Wednesday = day('Jeremiah 36:1-8', 'Colossians 2:6-19',   'Deuteronomy 7:6-13',   'Matthew 26:31-46');
lect.trinity23Thursday  = day('Jeremiah 36:11-19','Colossians 2:20-3:11','Deuteronomy 8:1-10',   'Matthew 26:47-56');
lect.trinity23Friday    = day('Jeremiah 36:20-26','Colossians 3:12-17',  'Deuteronomy 8:11-20',  'Matthew 26:57-75');
lect.trinity23Saturday  = day('2 Kings 25:8-11, 22, 25-26','Colossians 3:18-4:6','Deuteronomy 9:7-17, 25-29','Matthew 27:1-10');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 24
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity24Sunday    = existing.trinity24Sunday;
lect.trinity24Monday    = day('Leviticus 19:1-2, 9-18','Philippians 1:1-11','Deuteronomy 10:12-22','Matthew 27:11-26');
lect.trinity24Tuesday   = day('Leviticus 19:26-37','Philippians 1:12-26',  'Deuteronomy 13:1-11', 'Matthew 27:27-44');
lect.trinity24Wednesday = day('Leviticus 20:1-8', 'Philippians 1:27-2:18','Deuteronomy 15:7-15', 'Matthew 27:45-56');
lect.trinity24Thursday  = day('Leviticus 25:23-31','Philippians 2:19-30', 'Deuteronomy 17:14-20', 'Matthew 27:57-66');
lect.trinity24Friday    = day('Leviticus 26:1-13', 'Philippians 3:1-21',   'Deuteronomy 18:15-22', 'Matthew 28:1-10');
lect.trinity24Saturday  = day('Leviticus 26:27-42','Philippians 4:1-23',   'Deuteronomy 19:11-21', 'Matthew 28:11-20');

// ══════════════════════════════════════════════════════════════════════════════
// TRINITY 25 (not in episcopalnet; preserve existing which may be correct)
// ══════════════════════════════════════════════════════════════════════════════
lect.trinity25Sunday    = existing.trinity25Sunday;
lect.trinity25Monday    = existing.trinity25Monday;
lect.trinity25Tuesday   = existing.trinity25Tuesday;
lect.trinity25Wednesday = existing.trinity25Wednesday;
lect.trinity25Thursday  = existing.trinity25Thursday;
lect.trinity25Friday    = existing.trinity25Friday;
lect.trinity25Saturday  = existing.trinity25Saturday;

// ══════════════════════════════════════════════════════════════════════════════
// Write the rebuilt file
// ══════════════════════════════════════════════════════════════════════════════

fs.writeFileSync(LECTIONARY_PATH, JSON.stringify(lect, null, 2));
console.log('lectionary.json rebuilt. Total keys:', Object.keys(lect).length);
console.log('Verifying Lent 4 Monday:');
console.log('  MP:', JSON.stringify(lect.lent4Monday.mp));
console.log('  EP:', JSON.stringify(lect.lent4Monday.ep));
