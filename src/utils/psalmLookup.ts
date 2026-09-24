import psalmsData from '../data/psalms.json';

export interface PsalmTextEntry {
  psalm: number;
  title: string;
  subtitle?: string;
  text: string;
}

const psalmTextMap: Record<string, PsalmTextEntry> = (() => {
  const map: Record<string, PsalmTextEntry> = {};
  const data = psalmsData as any;
  for (let d = 1; d <= 30; d++) {
    for (const session of ['morning', 'evening'] as const) {
      const sess = data[String(d)]?.[session];
      if (!sess) continue;
      const refs: (number | string)[] = sess.refs ?? [];
      const verses: PsalmTextEntry[] = sess.verses ?? [];
      for (let i = 0; i < refs.length; i++) {
        const key = String(refs[i]);
        if (!map[key]) map[key] = verses[i];
      }
    }
  }
  return map;
})();

// Psalm text format: "1. verse text\n2. verse text\n..."
function filterPsalmText(text: string, startV: number, endV: number): string {
  const blocks: Array<{ v: number; lines: string[] }> = [];
  let curV = -1;
  let curLines: string[] = [];
  for (const line of text.split('\n')) {
    const m = line.match(/^(\d+)\. /);
    if (m) {
      if (curV >= 0) blocks.push({ v: curV, lines: curLines });
      curV = parseInt(m[1], 10);
      curLines = [line];
    } else if (curV >= 0) {
      curLines.push(line);
    }
  }
  if (curV >= 0) blocks.push({ v: curV, lines: curLines });
  return blocks
    .filter(b => b.v >= startV && b.v <= endV)
    .map(b => b.lines.join('\n'))
    .join('\n');
}

export function lookupPsalm(ref: string): PsalmTextEntry | null {
  if (psalmTextMap[ref]) return psalmTextMap[ref];

  // No colon → whole psalm or lettered section (e.g. "107", "119a")
  if (ref.indexOf(':') < 0) {
    const base = ref.replace(/[a-e]$/, '');
    if (psalmTextMap[base]) return psalmTextMap[base];
    if (base === '119') return psalmTextMap['119a'] ?? null;
    return null;
  }

  // Verse-range ref like "107:1-16" or "119:89-104"
  const colonIdx = ref.indexOf(':');
  const baseNum  = ref.slice(0, colonIdx);
  const rangeStr = ref.slice(colonIdx + 1);
  const dashIdx  = rangeStr.indexOf('-');
  const startV   = parseInt(dashIdx >= 0 ? rangeStr.slice(0, dashIdx) : rangeStr, 10);
  const endV     = dashIdx >= 0 ? parseInt(rangeStr.slice(dashIdx + 1), 10) : startV;

  if (baseNum === '119') {
    let combinedText = '';
    let firstEntry: PsalmTextEntry | null = null;
    for (const sec of ['119a', '119b', '119c', '119d', '119e']) {
      const secEntry = psalmTextMap[sec];
      if (!secEntry) continue;
      const filtered = filterPsalmText(secEntry.text, startV, endV);
      if (filtered) {
        combinedText += (combinedText ? '\n' : '') + filtered;
        if (!firstEntry) firstEntry = secEntry;
      }
    }
    if (!combinedText || !firstEntry) return null;
    return { ...firstEntry, psalm: 119, text: combinedText };
  }

  const baseEntry = psalmTextMap[baseNum];
  if (!baseEntry) return null;
  const filteredText = filterPsalmText(baseEntry.text, startV, endV);
  if (!filteredText) return null;
  return { ...baseEntry, text: filteredText };
}

/** Resolve an appointed reference, retitling a partial selection with its citation. */
export function resolveAppointedPsalm(ref: string): PsalmTextEntry | null {
  const entry = lookupPsalm(ref);
  if (!entry) return null;
  return ref !== String(entry.psalm) ? { ...entry, title: `Psalm ${ref}` } : entry;
}
