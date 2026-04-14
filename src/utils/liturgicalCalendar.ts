export type LiturgicalSeason =
  | 'Advent'
  | 'Christmas'
  | 'Epiphany'
  | 'Pre-Lent'
  | 'Lent'
  | 'Easter'
  | 'Trinity';

/** Gregorian calendar Easter date calculation (Anonymous Gregorian algorithm). */
function getEaster(year: number): Date {
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

/** First Sunday of Advent: the Sunday nearest to November 30. */
function getAdventStart(year: number): Date {
  const nov30 = new Date(year, 10, 30);
  const dow = nov30.getDay();
  const offset = dow <= 3 ? -dow : 7 - dow;
  return new Date(year, 10, 30 + offset);
}

/** Shared helper: integer days offset from Easter Sunday for a given date. */
function daysFromEasterFor(date: Date): number {
  const year = date.getFullYear();
  const dateOnly = new Date(year, date.getMonth(), date.getDate());
  return Math.round((dateOnly.getTime() - getEaster(year).getTime()) / 86400000);
}

// ─── Holy day detectors ────────────────────────────────────────────────────

export function isEasterDay(date: Date): boolean {
  return daysFromEasterFor(date) === 0;
}
export function isAshWednesday(date: Date): boolean {
  return daysFromEasterFor(date) === -46;
}
export function isGoodFriday(date: Date): boolean {
  return daysFromEasterFor(date) === -2;
}
/** Ascension Day falls on the 40th day of Easter (Thursday). */
export function isAscensionDay(date: Date): boolean {
  return daysFromEasterFor(date) === 39;
}
/** Whitsunday / Pentecost: the 50th day of Easter. */
export function isWhitsunday(date: Date): boolean {
  return daysFromEasterFor(date) === 49;
}
/** Trinity Sunday: the Sunday after Whitsunday (56th day from Easter). */
export function isTrinitySunday(date: Date): boolean {
  return daysFromEasterFor(date) === 56;
}
export function isChristmasDay(date: Date): boolean {
  return date.getMonth() === 11 && date.getDate() === 25;
}
/** Returns true for Ascension Day through the day before Whitsunday (dfe 39–48). */
export function isAscensiontide(date: Date): boolean {
  const d = daysFromEasterFor(date);
  return d >= 39 && d <= 48;
}
/** Returns true for Whitsunday through the Saturday after (dfe 49–55). */
export function isWhitsuntide(date: Date): boolean {
  const d = daysFromEasterFor(date);
  return d >= 49 && d <= 55;
}
/** Returns true for US Thanksgiving Day (4th Thursday of November). */
export function isThanksgivingDay(date: Date): boolean {
  if (date.getMonth() !== 10) return false;
  return date.getDate() === getThanksgivingDay(date.getFullYear()).getDate();
}
/** Any Sunday that falls within the Lent season. */
export function isLentSunday(date: Date): boolean {
  const d = daysFromEasterFor(date);
  return d >= -46 && d <= -1 && date.getDay() === 0;
}

// ─── Canticle appointment helpers ─────────────────────────────────────────

/**
 * On Easter Day the Easter Anthems (Pascha nostrum) replace the Venite.
 * 1928 American BCP, Morning Prayer rubric.
 */
export function useEasterAnthems(date: Date): boolean {
  return isEasterDay(date);
}

/**
 * The Venite is traditionally omitted on Ash Wednesday and Good Friday,
 * when the office takes a more penitential or Passion form.
 */
export function omitVenite(date: Date): boolean {
  return isAshWednesday(date) || isGoodFriday(date);
}

/**
 * The Benedictus es (Song of the Three Young Men) replaces the Te Deum
 * on Sundays in Lent and on Christmas Day.
 * 1928 American BCP, Morning Prayer rubric after the First Lesson.
 */
export function useBenedictusEs(date: Date): boolean {
  return isChristmasDay(date) || isLentSunday(date);
}

// ─── Seasonal invitatory antiphon for the Venite ──────────────────────────

/**
 * Returns the appointed seasonal invitatory antiphon to precede the Venite,
 * or null if no special antiphon is appointed.
 * Antiphons follow the tradition of the 1928 American BCP and its sources.
 */
export function getVeniteInvitatory(date: Date): string | null {
  const d = daysFromEasterFor(date);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Trinity Sunday (dfe 56)
  if (isTrinitySunday(date)) {
    return 'Father, Son, and Holy Ghost, one God; * O come, let us adore him.';
  }
  // Whitsunday and six days after (dfe 49–55)
  if (d >= 49 && d <= 55) {
    return 'Alleluia. The Spirit of the Lord filleth the world; * O come, let us adore him. Alleluia.';
  }
  // Ascension Day through Whitsunday Eve (dfe 39–48)
  if (d >= 39 && d <= 48) {
    return 'Alleluia. Christ the Lord ascendeth into heaven; * O come, let us adore him. Alleluia.';
  }
  // Monday in Easter Week through Ascension Eve (dfe 1–38)
  if (d >= 1 && d <= 38) {
    return 'Alleluia. The Lord is risen indeed; * O come, let us adore him. Alleluia.';
  }
  // Christmas Day and until Epiphany (Dec 25 – Jan 5)
  if ((month === 12 && day === 25) || (month === 12 && day > 25) || (month === 1 && day <= 5)) {
    return 'Alleluia. Unto us a child is born; * O come, let us adore him. Alleluia.';
  }
  // The Epiphany and seven days after (Jan 6–13)
  if (month === 1 && day >= 6 && day <= 13) {
    return 'The Lord hath manifested forth his glory; * O come, let us adore him.';
  }
  // The Transfiguration (Aug 6)
  if (month === 8 && day === 6) {
    return 'The Lord hath manifested forth his glory; * O come, let us adore him.';
  }
  // The Purification (Feb 2) and The Annunciation (Mar 25)
  if ((month === 2 && day === 2) || (month === 3 && day === 25)) {
    return 'The Word was made flesh, and dwelt among us; * O come, let us adore him.';
  }

  const season = getLiturgicalSeason(date);
  // Sundays in Advent
  if (season === 'Advent') {
    return 'Our King and Saviour draweth nigh; * O come, let us adore him.';
  }

  return null;
}

// ─── Season calculator ─────────────────────────────────────────────────────

/**
 * Returns the liturgical season for the given date, based on the
 * traditional 1928 BCP / pre-Vatican-II Anglican calendar.
 *
 * Season boundaries:
 *   Advent       — Sunday nearest Nov 30 through Dec 24
 *   Christmas    — Dec 25 through Jan 5
 *   Epiphany     — Jan 6 through Septuagesima Eve (Easter–64)
 *   Pre-Lent     — Septuagesima Sun (Easter–63) through Shrove Tue (Easter–47)
 *   Lent         — Ash Wednesday (Easter–46) through Holy Saturday (Easter–1)
 *   Easter       — Easter Day through Whitsunday (Easter+49)
 *   Trinity      — Trinity Sunday (Easter+56) through Advent
 */
export function getLiturgicalSeason(date: Date = new Date()): LiturgicalSeason {
  const year = date.getFullYear();
  const dateOnly = new Date(year, date.getMonth(), date.getDate());
  const ts = dateOnly.getTime();
  const DAY = 86400000;

  const easter = getEaster(year);
  const easterTs = easter.getTime();
  const dfe = Math.round((ts - easterTs) / DAY);

  // Easter season: Easter Day → Whitsunday inclusive
  if (dfe >= 0 && dfe <= 49) return 'Easter';

  // Pre-Lent: Septuagesima Sun → Shrove Tuesday
  if (dfe >= -63 && dfe <= -47) return 'Pre-Lent';

  // Lent: Ash Wednesday → Holy Saturday
  if (dfe >= -46 && dfe <= -1) return 'Lent';

  // Epiphany: Jan 6 → Septuagesima Eve
  const epiphanyTs = new Date(year, 0, 6).getTime();
  if (dfe < -63 && ts >= epiphanyTs) return 'Epiphany';

  // Christmas: Dec 25 → Jan 5
  const month = date.getMonth() + 1;
  const day = date.getDate();
  if (month === 12 && day >= 25) return 'Christmas';
  if (month === 1 && day <= 5) return 'Christmas';

  // Advent: Sunday nearest Nov 30 → Dec 24
  const adventStart = getAdventStart(year);
  const dec24 = new Date(year, 11, 24).getTime();
  if (ts >= adventStart.getTime() && ts <= dec24) return 'Advent';

  // Trinity: Whitsunday+1 through Advent
  if (dfe > 49 && ts < adventStart.getTime()) return 'Trinity';

  return 'Trinity';
}

/** Returns true when the Gloria Patri should be sung (omitted in Advent, Pre-Lent, and Lent). */
export function showGloriaPatri(season: LiturgicalSeason): boolean {
  return season !== 'Advent' && season !== 'Lent' && season !== 'Pre-Lent';
}

/** Returns the traditional Anglican display label for a liturgical season. */
export function getSeasonDisplayLabel(season: LiturgicalSeason): string {
  const labels: Record<LiturgicalSeason, string> = {
    Advent:    'Advent',
    Christmas: 'Christmastide',
    Epiphany:  'Epiphanytide',
    'Pre-Lent': 'Pre-Lent',
    Lent:      'Lent',
    Easter:    'Eastertide',
    Trinity:   'Trinitytide',
  };
  return labels[season];
}

// ─── Proper collect helpers ────────────────────────────────────────────────

export type ProperCollectKey =
  // Advent
  | 'advent1' | 'advent2' | 'advent3' | 'advent4'
  // Christmas
  | 'christmasDay' | 'sundayAfterChristmas' | 'circumcision'
  // Epiphany
  | 'epiphany' | 'epiphany1' | 'epiphany2' | 'epiphany3' | 'epiphany4' | 'epiphany5' | 'epiphany6'
  // Pre-Lent
  | 'septuagesima' | 'sexagesima' | 'quinquagesima'
  // Lent & Holy Week
  | 'ashWednesday' | 'lent1' | 'lent2' | 'lent3' | 'lent4' | 'lent5'
  | 'palmSunday' | 'holyMonday' | 'holyTuesday' | 'holyWednesday'
  | 'maundyThursday' | 'goodFriday' | 'holySaturday'
  // Easter & Ascension
  | 'easterDay' | 'easter1' | 'easter2' | 'easter3' | 'easter4' | 'easter5'
  | 'ascensionDay' | 'sundayAfterAscension' | 'whitsunday' | 'trinitySunday'
  // Sundays after Trinity
  | 'trinity1'  | 'trinity2'  | 'trinity3'  | 'trinity4'  | 'trinity5'
  | 'trinity6'  | 'trinity7'  | 'trinity8'  | 'trinity9'  | 'trinity10'
  | 'trinity11' | 'trinity12' | 'trinity13' | 'trinity14' | 'trinity15'
  | 'trinity16' | 'trinity17' | 'trinity18' | 'trinity19' | 'trinity20'
  | 'trinity21' | 'trinity22' | 'trinity23' | 'trinity24' | 'trinity25'
  // Saints' Days & National Observances
  | 'stAndrew' | 'stThomas' | 'stStephen' | 'stJohnEvangelist' | 'holyInnocents'
  | 'conversionOfStPaul' | 'purification' | 'stMatthias' | 'annunciation'
  | 'stMark' | 'stPhilipAndStJames' | 'stBarnabas' | 'nativityOfStJohnBaptist'
  | 'stPeter' | 'stJames' | 'transfiguration' | 'stBartholomew' | 'stMatthew'
  | 'stMichaelAndAllAngels' | 'stLuke' | 'stSimonAndStJude' | 'allSaints'
  | 'independenceDay' | 'thanksgivingDay';

// ─── Fixed feast collect key lookup ────────────────────────────────────────

const FIXED_FEAST_COLLECT_KEYS: Record<string, ProperCollectKey> = {
  '1-1':   'circumcision',
  '1-6':   'epiphany',
  '1-25':  'conversionOfStPaul',
  '2-2':   'purification',
  '2-24':  'stMatthias',
  '3-25':  'annunciation',
  '4-25':  'stMark',
  '5-1':   'stPhilipAndStJames',
  '6-11':  'stBarnabas',
  '6-24':  'nativityOfStJohnBaptist',
  '6-29':  'stPeter',
  '7-4':   'independenceDay',
  '7-25':  'stJames',
  '8-6':   'transfiguration',
  '8-24':  'stBartholomew',
  '9-21':  'stMatthew',
  '9-29':  'stMichaelAndAllAngels',
  '10-18': 'stLuke',
  '10-28': 'stSimonAndStJude',
  '11-1':  'allSaints',
  '11-30': 'stAndrew',
  '12-21': 'stThomas',
  '12-25': 'christmasDay',
  '12-26': 'stStephen',
  '12-27': 'stJohnEvangelist',
  '12-28': 'holyInnocents',
};

// ─── Sunday collect key helper ─────────────────────────────────────────────

/**
 * Given a date that is a Sunday (and is not already matched by a moveable or
 * fixed feast in the outer function), returns the seasonal Sunday collect key.
 */
function getSundayCollectKey(sunday: Date): ProperCollectKey | null {
  const dfe  = daysFromEasterFor(sunday);
  const month = sunday.getMonth() + 1;
  const day   = sunday.getDate();
  const year  = sunday.getFullYear();
  const MS_WEEK = 7 * 86400000;

  // Pre-Lent Sundays
  if (dfe === -63) return 'septuagesima';
  if (dfe === -56) return 'sexagesima';
  if (dfe === -49) return 'quinquagesima';

  // Lent Sundays
  if (dfe === -42) return 'lent1';
  if (dfe === -35) return 'lent2';
  if (dfe === -28) return 'lent3';
  if (dfe === -21) return 'lent4';
  if (dfe === -14) return 'lent5';

  // Sundays after Easter (dfe 7–35) and Sunday after Ascension (dfe 42)
  if (dfe ===  7) return 'easter1';
  if (dfe === 14) return 'easter2';
  if (dfe === 21) return 'easter3';
  if (dfe === 28) return 'easter4';
  if (dfe === 35) return 'easter5';
  if (dfe === 42) return 'sundayAfterAscension';

  // ── Advent (must be checked before Trinity to handle late-Nov Advent 1) ──
  for (const y of [year, year - 1]) {
    const adventStart = getAdventStart(y);
    const n = Math.round((sunday.getTime() - adventStart.getTime()) / MS_WEEK);
    if (n >= 0 && n <= 3) return `advent${n + 1}` as ProperCollectKey;
  }

  // ── Christmas & Epiphany season ──────────────────────────────────────────
  if (month === 12 && day === 25) return 'christmasDay';

  // Sunday after Christmas (any Sunday Dec 26 – Jan 5)
  if ((month === 12 && day >= 26) || (month === 1 && day <= 5)) {
    return 'sundayAfterChristmas';
  }

  // Epiphany (Jan 6 falling on a Sunday — feast takes priority as Sunday collect too)
  if (month === 1 && day === 6) return 'epiphany';

  // Sundays after Epiphany (Jan 7 onward, before Septuagesima)
  if (dfe < -63) {
    const jan6 = new Date(year, 0, 6);
    const jan6dow = jan6.getDay();
    // First Sunday strictly after Jan 6
    const daysToEpiphany1 = jan6dow === 0 ? 7 : 7 - jan6dow;
    const epiphany1 = new Date(year, 0, 6 + daysToEpiphany1);
    const n = Math.round((sunday.getTime() - epiphany1.getTime()) / MS_WEEK) + 1;
    if (n >= 1 && n <= 6) return `epiphany${n}` as ProperCollectKey;
    if (n > 6) return 'epiphany6'; // reuse 6th for extras
  }

  // ── Sundays after Trinity (Advent already checked above) ─────────────────
  if (dfe >= 63) {
    const n = Math.round((dfe - 56) / 7); // 1 = Trinity 1, 2 = Trinity 2, …
    if (n >= 1 && n <= 25) return `trinity${n}` as ProperCollectKey;
    return 'trinity25'; // reuse last collect for any extras
  }

  return null;
}

/**
 * Returns the key for the proper collect for the given date, covering all
 * Sundays, principal feasts, holy days, and weekday fallback to the most
 * recent Sunday's collect.
 *
 * Priority order:
 *  1. Moveable Holy Week / Easter / Ascension / Pentecost exact days
 *  2. Fixed feasts and national observances
 *  3. Named Sunday in season (if date is a Sunday)
 *  4. Weekday fallback: most recent Sunday's collect
 */
export function getProperCollectKey(date: Date): ProperCollectKey | null {
  const dfe  = daysFromEasterFor(date);
  const month = date.getMonth() + 1;
  const day   = date.getDate();
  const year  = date.getFullYear();
  const dow   = date.getDay(); // 0 = Sunday

  // ── 1. Moveable feasts (exact Easter-relative days) ──────────────────────
  if (dfe === -46) return 'ashWednesday';
  if (dfe === -7)  return 'palmSunday';
  if (dfe === -6)  return 'holyMonday';
  if (dfe === -5)  return 'holyTuesday';
  if (dfe === -4)  return 'holyWednesday';
  if (dfe === -3)  return 'maundyThursday';
  if (dfe === -2)  return 'goodFriday';
  if (dfe === -1)  return 'holySaturday';
  if (dfe >= 0  && dfe <= 6)  return 'easterDay';   // Easter Day through Easter Saturday
  if (dfe === 39)             return 'ascensionDay'; // Ascension Day (Thursday)
  if (dfe >= 40 && dfe <= 41) return 'ascensionDay'; // Fri–Sat after Ascension
  // dfe 42 = Sunday after Ascension — falls through to Sunday / seasonal checks
  if (dfe >= 43 && dfe <= 48) return 'ascensionDay'; // Mon–Sat before Whitsunday
  if (dfe === 49)             return 'whitsunday';
  if (dfe === 56)             return 'trinitySunday';

  // ── 2. Fixed feasts (take priority over weekday Sunday-fallback) ──────────
  const fixedKey = FIXED_FEAST_COLLECT_KEYS[`${month}-${day}`];
  if (fixedKey) return fixedKey;

  // Thanksgiving Day (4th Thursday of November)
  const thanksgiving = getThanksgivingDay(year);
  if (month === 11 && day === thanksgiving.getDate()) return 'thanksgivingDay';

  // ── 3. Named Sunday in season ─────────────────────────────────────────────
  if (dow === 0) return getSundayCollectKey(date);

  // ── 4. Weekday: fall back to most recent Sunday's collect ─────────────────
  const prevSunday = new Date(year, date.getMonth(), day - dow);
  return getProperCollectKey(prevSunday); // safe: prevSunday is always a Sunday (dow === 0)
}

/**
 * Returns all collect keys appointed for the given date, in order.
 *
 * Rules (1928 BCP):
 *  - Moveable principal feasts / Holy Week days → single collect
 *  - Fixed feasts (saints' days, etc.) → [feast collect, week's Sunday collect]
 *    so that both are read; if the feast IS on a Sunday the week collect is its
 *    own proper Sunday collect (which may differ from the feast collect).
 *  - National observances (Independence Day, Thanksgiving) → single collect
 *  - Ordinary Sundays → single collect
 *  - Ordinary weekdays → single collect (preceding Sunday's)
 */
export function getProperCollectKeys(date: Date): ProperCollectKey[] {
  const dfe  = daysFromEasterFor(date);
  const month = date.getMonth() + 1;
  const day   = date.getDate();
  const year  = date.getFullYear();
  const dow   = date.getDay();

  // ── 1. Moveable feasts ────────────────────────────────────────────────────
  if (dfe === -46) return ['ashWednesday'];
  if (dfe === -7)  return ['palmSunday'];
  if (dfe === -6)  return ['holyMonday'];
  if (dfe === -5)  return ['holyTuesday'];
  if (dfe === -4)  return ['holyWednesday'];
  if (dfe === -3)  return ['maundyThursday'];
  if (dfe === -2)  return ['goodFriday'];
  if (dfe === -1)  return ['holySaturday'];
  if (dfe >= 0  && dfe <= 6)  return ['easterDay'];
  if (dfe === 39)             return ['ascensionDay'];
  if (dfe >= 40 && dfe <= 41) return ['ascensionDay'];
  if (dfe >= 43 && dfe <= 48) return ['ascensionDay'];
  if (dfe === 49)             return ['whitsunday'];
  if (dfe === 56)             return ['trinitySunday'];

  // ── 2. Fixed feasts → feast collect + week Sunday collect ─────────────────
  const fixedKey = FIXED_FEAST_COLLECT_KEYS[`${month}-${day}`];
  if (fixedKey) {
    const sundayDate = dow === 0 ? date : new Date(year, date.getMonth(), day - dow);
    const weekKey = getSundayCollectKey(sundayDate);
    if (weekKey && weekKey !== fixedKey) return [fixedKey, weekKey];
    return [fixedKey];
  }

  // ── 3. National observances (single collect) ──────────────────────────────
  const thanksgiving = getThanksgivingDay(year);
  if (month === 11 && day === thanksgiving.getDate()) return ['thanksgivingDay'];

  // ── 4. Named Sunday ───────────────────────────────────────────────────────
  if (dow === 0) {
    const k = getSundayCollectKey(date);
    return k ? [k] : [];
  }

  // ── 5. Weekday: preceding Sunday's collect ────────────────────────────────
  const prevSunday = new Date(year, date.getMonth(), day - dow);
  const k = getSundayCollectKey(prevSunday);
  return k ? [k] : [];
}

/**
 * Returns true when the Lent daily collect (Ash Wednesday collect) should be
 * appended after the Collect of the Day.
 *
 * Applies from the day after Ash Wednesday through the Saturday before
 * Palm Sunday (dfe –45 to –8).  Ash Wednesday itself (dfe –46) uses the
 * Ash Wednesday collect as the sole Collect of the Day — appending it again
 * would duplicate it.
 */
export function showLentDailyCollect(date: Date): boolean {
  const d = daysFromEasterFor(date);
  return d >= -45 && d <= -8;
}

// ─── Feast day detection ───────────────────────────────────────────────────

export interface FeastDay {
  name: string;
  type: 'principalFeast' | 'holyDay' | 'nationalObservance';
}

const FIXED_FEASTS: Record<string, FeastDay> = {
  '1-1':   { name: 'The Circumcision of Christ',                   type: 'holyDay' },
  '1-6':   { name: 'The Epiphany',                                 type: 'principalFeast' },
  '1-25':  { name: 'The Conversion of Saint Paul',                 type: 'holyDay' },
  '2-2':   { name: 'The Purification of Saint Mary the Virgin',    type: 'holyDay' },
  '2-24':  { name: 'Saint Matthias the Apostle',                   type: 'holyDay' },
  '3-19':  { name: 'Saint Joseph',                                 type: 'holyDay' },
  '3-25':  { name: 'The Annunciation of the Blessèd Virgin Mary',  type: 'holyDay' },
  '4-25':  { name: 'Saint Mark the Evangelist',                    type: 'holyDay' },
  '5-1':   { name: 'Saint Philip and Saint James',                 type: 'holyDay' },
  '6-24':  { name: 'The Nativity of Saint John the Baptist',       type: 'principalFeast' },
  '6-29':  { name: 'Saint Peter the Apostle',                      type: 'principalFeast' },
  '7-4':   { name: 'Independence Day',                             type: 'nationalObservance' },
  '8-6':   { name: 'The Transfiguration of Our Lord Jesus Christ', type: 'holyDay' },
  '8-24':  { name: 'Saint Bartholomew the Apostle',                type: 'holyDay' },
  '9-21':  { name: 'Saint Matthew the Apostle and Evangelist',     type: 'holyDay' },
  '9-29':  { name: 'Saint Michael and All Angels',                 type: 'principalFeast' },
  '10-18': { name: 'Saint Luke the Evangelist',                    type: 'holyDay' },
  '10-28': { name: 'Saint Simon and Saint Jude',                   type: 'holyDay' },
  '11-1':  { name: "All Saints' Day",                              type: 'principalFeast' },
  '11-30': { name: 'Saint Andrew the Apostle',                     type: 'holyDay' },
  '12-21': { name: 'Saint Thomas the Apostle',                     type: 'holyDay' },
  '12-25': { name: 'Christmas Day',                                type: 'principalFeast' },
  '12-26': { name: 'Saint Stephen the Martyr',                     type: 'holyDay' },
  '12-27': { name: 'Saint John the Evangelist',                    type: 'holyDay' },
  '12-28': { name: 'The Holy Innocents',                           type: 'holyDay' },
};

/** Returns the 4th Thursday of November for a given year (US Thanksgiving). */
function getThanksgivingDay(year: number): Date {
  const nov1 = new Date(year, 10, 1);
  const dow = nov1.getDay();
  const firstThursday = dow <= 4 ? 1 + (4 - dow) : 1 + (11 - dow);
  return new Date(year, 10, firstThursday + 21);
}

// ─── Appointed Psalm lectionary key ───────────────────────────────────────

const _DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
] as const;

/**
 * Returns the key into appointedPsalms.json for the given date.
 *
 * Key format:
 *  • Special standalone days  → e.g. 'ashWednesday', 'holyMonday', 'ascensionDay'
 *  • Christmas ordinal days   → 'christmasDay' + ordinal-day-name  (Dec 25–31)
 *  • Circumcision ordinal     → 'circumcision'  + ordinal-day-name (Jan  1– 5)
 *  • Epiphany octave ordinal  → 'epiphany'      + ordinal-day-name (Jan  6–12)
 *  • All other days           → {sundayWeekKey} + actual-day-of-week-name
 */
export function getAppointedPsalmsKey(date: Date): string {
  const dfe   = daysFromEasterFor(date);
  const month = date.getMonth() + 1;
  const day   = date.getDate();
  const year  = date.getFullYear();
  const dow   = date.getDay(); // 0 = Sunday

  // ── 1. Holy Week individual days (Mon–Sat) ───────────────────────────────
  if (dfe === -6) return 'holyMonday';
  if (dfe === -5) return 'holyTuesday';
  if (dfe === -4) return 'holyWednesday';
  if (dfe === -3) return 'maundyThursday';
  if (dfe === -2) return 'goodFriday';
  if (dfe === -1) return 'holySaturday';

  // ── 2. Ash Wednesday ─────────────────────────────────────────────────────
  if (dfe === -46) return 'ashWednesday';

  // ── 3. Ascension Day (Thursday) ──────────────────────────────────────────
  if (dfe === 39) return 'ascensionDay';

  // ── 4. Christmas ordinal period (Dec 25–31) ──────────────────────────────
  // Treat Dec 25 as ordinal position 0 ("Sunday"), Dec 26 as 1 ("Monday"), …
  // This matches the 1928 BCP table's fixed octave appointments regardless of
  // what actual day of the week Dec 25 falls on.
  if (month === 12 && day >= 25) {
    return 'christmasDay' + _DAY_NAMES[day - 25]; // 0-indexed → Sun … Sat
  }

  // ── 5. Circumcision ordinal period (Jan 1–5) ─────────────────────────────
  if (month === 1 && day >= 1 && day <= 5) {
    return 'circumcision' + _DAY_NAMES[day - 1]; // Jan 1=Sun … Jan 5=Thu
  }

  // ── 6. Epiphany octave ordinal period (Jan 6–12) ─────────────────────────
  if (month === 1 && day >= 6 && day <= 12) {
    return 'epiphany' + _DAY_NAMES[day - 6]; // Jan 6=Sun … Jan 12=Sat
  }

  // ── 7. All other days: seasonal week + actual day-of-week ────────────────
  const sundayDate = dow === 0
    ? date
    : new Date(year, date.getMonth(), day - dow);
  const weekKey = _psalmWeekKey(sundayDate);
  return weekKey + _DAY_NAMES[dow];
}

/** Maps a Sunday date to its psalm-table week identifier. */
function _psalmWeekKey(sunday: Date): string {
  const dfe = daysFromEasterFor(sunday);
  const m   = sunday.getMonth() + 1;
  const d   = sunday.getDate();

  // Easter-relative Sundays not handled by getSundayCollectKey
  if (dfe === -7) return 'palmSunday';
  if (dfe ===  0) return 'easterDay';
  if (dfe === 49) return 'whitsunday';
  if (dfe === 56) return 'trinitySunday';

  // Christmas / Epiphany seasonal Sunday anchors
  if (m === 12 && d === 25)                          return 'christmasDay';
  if ((m === 12 && d >= 26) || (m === 1 && d <= 5)) return 'sundayAfterChristmas';
  if (m === 1  && d === 6)                           return 'epiphany';
  // Fallback for any early-January Sunday before Epiphany1
  if (m === 1  && d >= 1 && d <= 12)                return 'circumcision';

  // Standard seasonal Sunday key (Advent, Epiphany1-6, Pre-Lent, Lent, Trinity)
  const k = getSundayCollectKey(sunday);
  return k ?? 'trinity1'; // last-resort fallback
}

/**
 * Returns the feast or holy day for the given date, or null if none.
 * Moveable feasts (Easter-relative) take precedence over fixed feasts
 * when they coincide (e.g. April 25 falling on a Holy Week day).
 */
export function getFeastDay(date: Date): FeastDay | null {
  // Moveable feasts checked first
  const dfe = daysFromEasterFor(date);
  switch (dfe) {
    case -46: return { name: 'Ash Wednesday',          type: 'holyDay' };
    case -7:  return { name: 'Palm Sunday',            type: 'holyDay' };
    case -6:  return { name: 'Monday in Holy Week',    type: 'holyDay' };
    case -5:  return { name: 'Tuesday in Holy Week',   type: 'holyDay' };
    case -4:  return { name: 'Wednesday in Holy Week', type: 'holyDay' };
    case -3:  return { name: 'Maundy Thursday',        type: 'holyDay' };
    case -2:  return { name: 'Good Friday',            type: 'principalFeast' };
    case -1:  return { name: 'Holy Saturday',          type: 'holyDay' };
    case 0:   return { name: 'Easter Day',             type: 'principalFeast' };
    case 39:  return { name: 'Ascension Day',          type: 'principalFeast' };
    case 49:  return { name: 'Whitsunday',             type: 'principalFeast' };
    case 56:  return { name: 'Trinity Sunday',         type: 'principalFeast' };
  }

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  const fixed = FIXED_FEASTS[`${month}-${day}`];
  if (fixed) return fixed;

  // Thanksgiving Day (4th Thursday of November)
  const thanksgiving = getThanksgivingDay(year);
  if (month === 11 && day === thanksgiving.getDate()) {
    return { name: 'Thanksgiving Day', type: 'nationalObservance' };
  }

  return null;
}
