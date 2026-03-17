// Liturgical calendar test suite — uses same algorithm as liturgicalCalendar.ts

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

function getAdventStart(year) {
  const nov30 = new Date(year, 10, 30);
  const dow = nov30.getDay();
  const offset = dow <= 3 ? -dow : 7 - dow;
  return new Date(year, 10, 30 + offset);
}

function daysFromEasterFor(date) {
  const year = date.getFullYear();
  const dateOnly = new Date(year, date.getMonth(), date.getDate());
  return Math.round((dateOnly.getTime() - getEaster(year).getTime()) / 86400000);
}

function isEasterDay(date)     { return daysFromEasterFor(date) === 0; }
function isAshWednesday(date)  { return daysFromEasterFor(date) === -46; }
function isGoodFriday(date)    { return daysFromEasterFor(date) === -2; }
function isWhitsunday(date)    { return daysFromEasterFor(date) === 49; }
function isTrinitySunday(date) { return daysFromEasterFor(date) === 56; }
function isChristmasDay(date)  { return date.getMonth() === 11 && date.getDate() === 25; }

function isLentSunday(date) {
  const d = daysFromEasterFor(date);
  return d >= -46 && d <= -1 && date.getDay() === 0;
}

function getLiturgicalSeason(date) {
  const year = date.getFullYear();
  const dateOnly = new Date(year, date.getMonth(), date.getDate());
  const ts = dateOnly.getTime();
  const DAY = 86400000;
  const easterTs = getEaster(year).getTime();
  const dfe = Math.round((ts - easterTs) / DAY);
  if (dfe >= 0  && dfe <= 49)   return "Easter";
  if (dfe >= -63 && dfe <= -47) return "Pre-Lent";
  if (dfe >= -46 && dfe <= -1)  return "Lent";
  const epiphanyTs = new Date(year, 0, 6).getTime();
  if (dfe < -63 && ts >= epiphanyTs) return "Epiphany";
  const mo = date.getMonth() + 1, dy = date.getDate();
  if (mo === 12 && dy >= 25) return "Christmas";
  if (mo === 1  && dy <= 5)  return "Christmas";
  const adventStart = getAdventStart(year);
  const dec24 = new Date(year, 11, 24).getTime();
  if (ts >= adventStart.getTime() && ts <= dec24) return "Advent";
  return "Trinity";
}

function showGloriaPatri(season) {
  return season !== "Lent" && season !== "Pre-Lent";
}

function veniteStatus(date) {
  if (isEasterDay(date))                          return "EASTER ANTHEMS";
  if (isAshWednesday(date) || isGoodFriday(date)) return "OMITTED";
  return "Venite";
}

function canticle1(date) {
  return (isChristmasDay(date) || isLentSunday(date)) ? "Benedictus es" : "Te Deum";
}

function getProperCollectKey(date) {
  const d = daysFromEasterFor(date);
  if (d === -46) return "ashWednesday";
  if (d === -7)  return "palmSunday";
  if (d === -6)  return "holyMonday";
  if (d === -5)  return "holyTuesday";
  if (d === -4)  return "holyWednesday";
  if (d === -3)  return "maundyThursday";
  if (d === -2)  return "goodFriday";
  if (d === -1)  return "holySaturday";
  if (d >= 0  && d <= 6)  return "easterDay";
  if (d >= 39 && d <= 48) return "ascensionDay";
  return null;
}

function showLentDailyCollect(date) {
  const d = daysFromEasterFor(date);
  return d >= -46 && d <= -8;
}

function getVeniteInvitatory(date) {
  const d = daysFromEasterFor(date);
  const mo = date.getMonth() + 1, dy = date.getDate();
  if (isTrinitySunday(date)) return "Holy, holy, holy, Lord God of hosts: O come, let us worship him.";
  if (isWhitsunday(date))    return "Alleluia. The Spirit of the Lord filleth the world: O come, let us worship him. Alleluia.";
  if (d >= 39 && d <= 48)    return "Alleluia. Christ is ascended up on high: O come, let us worship him. Alleluia.";
  if (d >= 1  && d <= 38)    return "Alleluia. The Lord is risen indeed: O come, let us worship him. Alleluia.";
  if (mo === 12 && dy === 25) return "Alleluia. Unto us a Child is born: O come, let us worship him. Alleluia.";
  if ((mo === 12 && dy > 25) || (mo === 1 && dy <= 5))
    return "Unto us a Child is born: O come, let us worship him.";
  if (mo === 1 && dy >= 6) return "The Lord hath manifested forth his glory: O come, let us worship him.";
  const s = getLiturgicalSeason(date);
  if (s === "Advent")   return "Our King and Saviour draweth nigh: O come, let us worship him.";
  if (s === "Epiphany") return "The Lord hath manifested forth his glory: O come, let us worship him.";
  return null;
}

const openingSentences = {
  "Advent":    "In the wilderness prepare ye the way of the LORD...  Isa. 40:3",
  "Christmas": "Fear not: for, behold, I bring you good tidings of great joy...  St. Luke 2:10",
  "Epiphany":  "Arise, shine; for thy light is come...  Isa. 60:1",
  "Pre-Lent":  "Rend your heart, and not your garments...  Joel 2:13",
  "Lent":      "Rend your heart, and not your garments...  Joel 2:13",
  "Easter":    "Christ our passover is sacrificed for us...  I Cor. 5:7, 8",
  "Trinity":   "I was glad when they said unto me, We will go into the house of the LORD.  Ps. 122:1",
};

function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
function fmt(d) { return d.toDateString(); }
function dow(d) { return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d.getDay()]; }

// ---- test data ----

const YEAR = new Date().getFullYear();
const E = getEaster(YEAR);
const ADV = getAdventStart(YEAR);

const cases = [];
// Original 12 cases
cases.push({ n:1,  label:"First Sunday of Advent",   date:ADV,                   es:"Advent",   eg:true,  ev:"Venite",        ec:"Te Deum",      ei:"Our King and Saviour draweth nigh: O come, let us worship him.",             epck:null,              eldc:false });
cases.push({ n:2,  label:"Christmas Day",             date:new Date(YEAR,11,25),  es:"Christmas",eg:true,  ev:"Venite",        ec:"Benedictus es",ei:"Alleluia. Unto us a Child is born: O come, let us worship him. Alleluia.",   epck:null,              eldc:false });
cases.push({ n:3,  label:"Septuagesima (Pre-Lent)",   date:addDays(E,-63),        es:"Pre-Lent", eg:false, ev:"Venite",        ec:"Te Deum",      ei:null,                                                                         epck:null,              eldc:false });
cases.push({ n:4,  label:"Quinquagesima",             date:addDays(E,-49),        es:"Pre-Lent", eg:false, ev:"Venite",        ec:"Te Deum",      ei:null,                                                                         epck:null,              eldc:false });
cases.push({ n:5,  label:"Ash Wednesday",             date:addDays(E,-46),        es:"Lent",     eg:false, ev:"OMITTED",       ec:"Te Deum",      ei:null,                                                                         epck:"ashWednesday",    eldc:true });
cases.push({ n:6,  label:"Second Sunday in Lent",     date:addDays(E,-42),        es:"Lent",     eg:false, ev:"Venite",        ec:"Benedictus es",ei:null,                                                                         epck:null,              eldc:true });
cases.push({ n:7,  label:"Good Friday",               date:addDays(E,-2),         es:"Lent",     eg:false, ev:"OMITTED",       ec:"Te Deum",      ei:null,                                                                         epck:"goodFriday",      eldc:false });
cases.push({ n:8,  label:"Easter Day",                date:E,                     es:"Easter",   eg:true,  ev:"EASTER ANTHEMS",ec:"Te Deum",      ei:null,                                                                         epck:"easterDay",       eldc:false });
cases.push({ n:9,  label:"Ascension Day",             date:addDays(E,39),         es:"Easter",   eg:true,  ev:"Venite",        ec:"Te Deum",      ei:"Alleluia. Christ is ascended up on high: O come, let us worship him. Alleluia.",epck:"ascensionDay",  eldc:false });
cases.push({ n:10, label:"Whitsunday (Pentecost)",    date:addDays(E,49),         es:"Easter",   eg:true,  ev:"Venite",        ec:"Te Deum",      ei:"Alleluia. The Spirit of the Lord filleth the world: O come, let us worship him. Alleluia.",epck:null, eldc:false });
cases.push({ n:11, label:"Trinity Sunday",            date:addDays(E,56),         es:"Trinity",  eg:true,  ev:"Venite",        ec:"Te Deum",      ei:"Holy, holy, holy, Lord God of hosts: O come, let us worship him.",           epck:null,              eldc:false });
cases.push({ n:12, label:"Sunday after Trinity",      date:addDays(E,63),         es:"Trinity",  eg:true,  ev:"Venite",        ec:"Te Deum",      ei:null,                                                                         epck:null,              eldc:false });
// Additional collect cases
cases.push({ n:13, label:"Palm Sunday",               date:addDays(E,-7),         es:"Lent",     eg:false, ev:"Venite",        ec:"Benedictus es",ei:null,  epck:"palmSunday",     eldc:false });
cases.push({ n:14, label:"Monday in Holy Week",       date:addDays(E,-6),         es:"Lent",     eg:false, ev:"Venite",        ec:"Te Deum",      ei:null,  epck:"holyMonday",     eldc:false });
cases.push({ n:15, label:"Maundy Thursday",           date:addDays(E,-3),         es:"Lent",     eg:false, ev:"Venite",        ec:"Te Deum",      ei:null,  epck:"maundyThursday", eldc:false });
cases.push({ n:16, label:"Holy Saturday",             date:addDays(E,-1),         es:"Lent",     eg:false, ev:"Venite",        ec:"Te Deum",      ei:null,  epck:"holySaturday",   eldc:false });
cases.push({ n:17, label:"Easter Saturday",           date:addDays(E,6),          es:"Easter",   eg:true,  ev:"Venite",        ec:"Te Deum",      ei:"Alleluia. The Lord is risen indeed: O come, let us worship him. Alleluia.",  epck:"easterDay",    eldc:false });
cases.push({ n:18, label:"Sat before Palm (Lent daily appended)", date:addDays(E,-8), es:"Lent", eg:false, ev:"Venite",      ec:"Te Deum",      ei:null,  epck:null,              eldc:true });
cases.push({ n:19, label:"Weekday after Ascension",   date:addDays(E,40),         es:"Easter",   eg:true,  ev:"Venite",        ec:"Te Deum",      ei:"Alleluia. Christ is ascended up on high: O come, let us worship him. Alleluia.",epck:"ascensionDay",eldc:false });

// ---- run ----

const SEP = "=".repeat(68);
console.log(SEP);
console.log("LITURGICAL CALENDAR TEST SUITE  |  Year " + YEAR);
console.log("Easter: " + fmt(E) + "   Advent begins: " + fmt(ADV));
console.log(SEP);

let failures = 0;

cases.forEach(function(tc) {
  const season   = getLiturgicalSeason(tc.date);
  const gloria   = showGloriaPatri(season);
  const venite   = veniteStatus(tc.date);
  const canticle = canticle1(tc.date);
  const invit    = getVeniteInvitatory(tc.date);
  const sentence = openingSentences[season] || "(default)";
  const dfe      = daysFromEasterFor(tc.date);
  const pck      = getProperCollectKey(tc.date);
  const ldc      = showLentDailyCollect(tc.date);

  const ok_s   = season   === tc.es;
  const ok_g   = gloria   === tc.eg;
  const ok_v   = venite   === tc.ev;
  const ok_c   = canticle === tc.ec;
  const ok_i   = JSON.stringify(invit) === JSON.stringify(tc.ei);
  const ok_pck = pck  === tc.epck;
  const ok_ldc = ldc  === tc.eldc;
  const pass = ok_s && ok_g && ok_v && ok_c && ok_i && ok_pck && ok_ldc;
  if (!pass) failures++;

  console.log("");
  console.log(tc.n + ". " + tc.label + " -- " + fmt(tc.date) + " (" + dow(tc.date) + ", dfe=" + dfe + ")  [" + (pass ? "PASS" : "FAIL") + "]");
  console.log("   Season      : " + season   + (ok_s   ? " OK" : " FAIL -- expected " + tc.es));
  console.log("   Sentence    : " + sentence);
  console.log("   Invit.      : " + (invit || "(none)") + (ok_i ? " OK" : " FAIL -- expected " + (tc.ei || "(none)")));
  console.log("   Venite      : " + venite   + (ok_v   ? " OK" : " FAIL -- expected " + tc.ev));
  console.log("   Canticle    : " + canticle + (ok_c   ? " OK" : " FAIL -- expected " + tc.ec));
  console.log("   Gloria      : " + (gloria ? "shown" : "omitted") + (ok_g ? " OK" : " FAIL -- expected " + (tc.eg ? "shown" : "omitted")));
  console.log("   Proper coll.: " + (pck || "(weekly placeholder)") + (ok_pck ? " OK" : " FAIL -- expected " + (tc.epck || "(weekly placeholder)")));
  console.log("   Lent daily  : " + (ldc ? "append Ash Wed collect" : "no") + (ok_ldc ? " OK" : " FAIL -- expected " + (tc.eldc ? "append Ash Wed collect" : "no")));
});

console.log("");
console.log(SEP);
console.log("RESULT: " + (cases.length - failures) + "/" + cases.length + " passed" + (failures ? " -- " + failures + " FAILED" : " -- all clear"));
console.log(SEP);
