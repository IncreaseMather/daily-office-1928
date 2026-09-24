import feasts from '../data/catholicFeasts.json';

export interface CatholicObservance {
  name: string;
  collect?: string;
}

interface CatholicFeastData {
  fixed: Record<string, CatholicObservance[]>;
  easterOffset: Record<string, CatholicObservance[]>;
  holyFamily: CatholicObservance[];
}

const DATA = feasts as CatholicFeastData;

const STOP = new Set([
  'a', 'an', 'the', 'of', 'and', 'feast', 'our', 'blessed', 'saint', 'saints',
  'st', 'sts', 'ss', 'apostle', 'apostles', 'evangelist', 'martyr', 'martyrs',
  'bishop', 'confessor', 'virgin', 'doctor', 'abbot', 'abbess', 'king', 'queen',
  'priest', 'deacon', 'pope', 'widow', 'holy', 'day', 'lord', 'jesus', 'christ',
  'spouse', 'blessed',
]);

/** True when two titles are the same feast, such as "St. Matthew" and "Feast of St. Matthew". */
function sameFeast(a: string, b: string): boolean {
  const left = tokens(a);
  const right = tokens(b);
  if (left.size === 0 || right.size === 0) return false;
  const [small, big] = left.size <= right.size ? [left, right] : [right, left];
  for (const token of small) {
    if (!big.has(token)) return false;
  }
  return true;
}

function tokens(name: string): Set<string> {
  const words = name
    .toLowerCase()
    .replace(/blessèd/g, 'blessed')
    .replace(/&/g, ' and ')
    .replace(/[^a-z\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP.has(word));
  return new Set(words);
}

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

function daysFromEaster(date: Date): number {
  const year = date.getFullYear();
  const dateOnly = new Date(year, date.getMonth(), date.getDate());
  return Math.round((dateOnly.getTime() - getEaster(year).getTime()) / 86400000);
}

/** Holy Family: the Sunday in 7–12 January, or 12 January when the 13th is a Sunday. */
function isHolyFamily(date: Date): boolean {
  if (date.getMonth() !== 0) return false;
  const day = date.getDate();
  if (day === 12 && new Date(date.getFullYear(), 0, 13).getDay() === 0) return true;
  return date.getDay() === 0 && day >= 7 && day <= 12;
}

function normCollect(text: string): string {
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Names and proper collects to add for this date.
 * `shownFeastName` is the 1928 feast already on screen. A Sunday title is not passed here.
 */
export function getCatholicAdditions(
  date: Date,
  shownFeastName: string | null,
  existingCollects: string[] = [],
): { names: string[]; collects: string[] } {
  const monthDay = `${date.getMonth() + 1}-${date.getDate()}`;
  const items: CatholicObservance[] = [];
  const movable = DATA.easterOffset[String(daysFromEaster(date))];
  if (movable) items.push(...movable);
  if (isHolyFamily(date)) items.push(...DATA.holyFamily);
  const fixed = DATA.fixed[monthDay];
  if (fixed) items.push(...fixed);

  const seenNames = new Set<string>();
  const kept: CatholicObservance[] = [];
  for (const item of items) {
    const key = item.name.toLowerCase();
    if (seenNames.has(key)) continue;
    seenNames.add(key);
    if (shownFeastName && sameFeast(item.name, shownFeastName)) continue;
    kept.push(item);
  }

  const seenCollects = new Set(existingCollects.map(normCollect));
  const names: string[] = [];
  const collects: string[] = [];
  for (const item of kept) {
    names.push(item.name);
    if (!item.collect) continue;
    const key = normCollect(item.collect);
    if (seenCollects.has(key)) continue;
    seenCollects.add(key);
    collects.push(item.collect);
  }
  return { names, collects };
}
