// Feast day detection test — mirrors getFeastDay from liturgicalCalendar.ts

function getEaster(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function daysFromEaster(date) {
  const year = date.getFullYear();
  const d = new Date(year, date.getMonth(), date.getDate());
  return Math.round((d.getTime() - getEaster(year).getTime()) / 86400000);
}

function getThanksgiving(year) {
  const nov1 = new Date(year, 10, 1);
  const dow = nov1.getDay();
  const firstThursday = dow <= 4 ? 1 + (4 - dow) : 1 + (11 - dow);
  return new Date(year, 10, firstThursday + 21);
}

const FIXED_FEASTS = {
  '1-1':   'The Circumcision of Christ',
  '1-6':   'The Epiphany',
  '1-25':  'The Conversion of Saint Paul',
  '2-2':   'The Purification of Saint Mary the Virgin',
  '2-24':  'Saint Matthias the Apostle',
  '3-19':  'Saint Joseph',
  '3-25':  'The Annunciation of the Blessed Virgin Mary',
  '4-25':  'Saint Mark the Evangelist',
  '5-1':   'Saint Philip and Saint James',
  '6-24':  'The Nativity of Saint John the Baptist',
  '6-29':  'Saint Peter the Apostle',
  '7-4':   'Independence Day',
  '8-6':   'The Transfiguration of Our Lord Jesus Christ',
  '8-24':  'Saint Bartholomew the Apostle',
  '9-21':  'Saint Matthew the Apostle and Evangelist',
  '9-29':  'Saint Michael and All Angels',
  '10-18': 'Saint Luke the Evangelist',
  '10-28': 'Saint Simon and Saint Jude',
  '11-1':  "All Saints' Day",
  '11-30': 'Saint Andrew the Apostle',
  '12-21': 'Saint Thomas the Apostle',
  '12-25': 'Christmas Day',
  '12-26': 'Saint Stephen the Martyr',
  '12-27': 'Saint John the Evangelist',
  '12-28': 'The Holy Innocents',
};

const MOVEABLE = {
  '-46': 'Ash Wednesday',
  '-7':  'Palm Sunday',
  '-6':  'Monday in Holy Week',
  '-5':  'Tuesday in Holy Week',
  '-4':  'Wednesday in Holy Week',
  '-3':  'Maundy Thursday',
  '-2':  'Good Friday',
  '-1':  'Holy Saturday',
  '0':   'Easter Day',
  '39':  'Ascension Day',
  '49':  'Whitsunday',
  '56':  'Trinity Sunday',
};

function getFeastDay(date) {
  const dfe = daysFromEaster(date);
  if (MOVEABLE[String(dfe)]) return MOVEABLE[String(dfe)];
  const mo = date.getMonth() + 1, dy = date.getDate(), yr = date.getFullYear();
  const fixed = FIXED_FEASTS[`${mo}-${dy}`];
  if (fixed) return fixed;
  const tg = getThanksgiving(yr);
  if (mo === 11 && dy === tg.getDate()) return 'Thanksgiving Day';
  return null;
}

function fmt(d) { return d.toDateString(); }

const YEAR = new Date().getFullYear();
const E = getEaster(YEAR);
function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }

const cases = [
  { label: 'Christmas Day',           date: new Date(YEAR, 11, 25), expected: 'Christmas Day' },
  { label: 'Epiphany',                date: new Date(YEAR, 0, 6),   expected: 'The Epiphany' },
  { label: 'Annunciation',            date: new Date(YEAR, 2, 25),  expected: 'The Annunciation of the Blessed Virgin Mary' },
  { label: 'St. John Baptist',        date: new Date(YEAR, 5, 24),  expected: 'The Nativity of Saint John the Baptist' },
  { label: 'All Saints',              date: new Date(YEAR, 10, 1),  expected: "All Saints' Day" },
  { label: 'Easter Day',              date: E,                       expected: 'Easter Day' },
  { label: 'Ascension Day',           date: addDays(E, 39),          expected: 'Ascension Day' },
  { label: 'Good Friday',             date: addDays(E, -2),          expected: 'Good Friday' },
  { label: 'Regular Trinity Sunday',  date: addDays(E, 63),          expected: null },
  // Additional checks
  { label: 'Ash Wednesday',           date: addDays(E, -46),         expected: 'Ash Wednesday' },
  { label: 'Palm Sunday',             date: addDays(E, -7),          expected: 'Palm Sunday' },
  { label: 'Maundy Thursday',         date: addDays(E, -3),          expected: 'Maundy Thursday' },
  { label: 'Holy Saturday',           date: addDays(E, -1),          expected: 'Holy Saturday' },
  { label: 'Whitsunday',              date: addDays(E, 49),           expected: 'Whitsunday' },
  { label: 'Trinity Sunday',          date: addDays(E, 56),           expected: 'Trinity Sunday' },
  { label: 'St. Andrew',              date: new Date(YEAR, 10, 30),  expected: 'Saint Andrew the Apostle' },
  { label: 'St. Michael',             date: new Date(YEAR, 8, 29),   expected: 'Saint Michael and All Angels' },
  { label: 'Independence Day',        date: new Date(YEAR, 6, 4),    expected: 'Independence Day' },
  { label: 'Regular weekday',         date: new Date(YEAR, 6, 10),   expected: null },
];

const SEP = '='.repeat(68);
console.log(SEP);
console.log('FEAST DAY DETECTION TEST  |  Year ' + YEAR);
console.log('Easter: ' + fmt(E));
console.log(SEP);

let failures = 0;
cases.forEach(function(tc, i) {
  const got = getFeastDay(tc.date);
  const pass = got === tc.expected;
  if (!pass) failures++;
  console.log('');
  console.log((i + 1) + '. ' + tc.label + ' — ' + fmt(tc.date) + '  [' + (pass ? 'PASS' : 'FAIL') + ']');
  console.log('   Expected : ' + (tc.expected || '(none)'));
  console.log('   Got      : ' + (got || '(none)'));
});

console.log('');
console.log(SEP);
console.log('RESULT: ' + (cases.length - failures) + '/' + cases.length + ' passed' +
  (failures ? ' -- ' + failures + ' FAILED' : ' -- all clear'));
console.log(SEP);
