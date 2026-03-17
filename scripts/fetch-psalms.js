'use strict';

/**
 * fetch-psalms.js
 *
 * Fetches the 1928 BCP Psalter from justus.anglican.org (3 pages),
 * parses all 150 psalms, and writes psalms.json to src/data/.
 *
 * Usage: node scripts/fetch-psalms.js
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

// ─── fetch ───────────────────────────────────────────────────────────────────

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    let buf = '';
    const req = http.get(url, { timeout: 30000 }, (res) => {
      res.setEncoding('latin1');   // pages are iso-8859-1
      res.on('data', chunk => buf += chunk);
      res.on('end',  ()    => resolve(buf));
    });
    req.on('error',   reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout: ' + url)); });
  });
}

// ─── HTML utilities ──────────────────────────────────────────────────────────

function stripTags(s) {
  return s.replace(/<[^>]*>/g, '');
}

function decodeEntities(s) {
  return s
    .replace(/&nbsp;/gi,  ' ')
    .replace(/&amp;/gi,   '&')
    .replace(/&lt;/gi,    '<')
    .replace(/&gt;/gi,    '>')
    .replace(/&apos;/gi,  "'")
    .replace(/&quot;/gi,  '"')
    .replace(/&#8212;/g,  '\u2014')
    .replace(/&#8216;/g,  '\u2018')
    .replace(/&#8217;/g,  '\u2019')
    .replace(/&#8220;/g,  '\u201c')
    .replace(/&#8221;/g,  '\u201d');
}

function cleanText(s) {
  return decodeEntities(s).replace(/\s+/g, ' ').trim();
}

// Remove superscript footnote numbers (e.g. "nations1" -> "nations")
function removeFootnotes(s) {
  // Remove <sup>N</sup> style footnotes
  return s.replace(/<sup>\d+<\/sup>/g, '').replace(/\d+$/, '');
}

// ─── extract the left-column HTML ───────────────────────────────────────────
// Split HTML by <tr> rows and take only the first <td> content from each row
// to get the psalm text and skip the annotation column.

function extractLeftColumn(html) {
  const rows = html.split(/<tr[^>]*>/i);
  const leftParts = [];
  for (const row of rows) {
    const tdSplit = row.split(/<td[^>]*>/i);
    if (tdSplit.length >= 2) {
      leftParts.push(tdSplit[1]);
    }
  }
  return leftParts.join('\n');
}

// ─── parse left-column HTML into psalm data ──────────────────────────────────
//
// Key observations about the HTML structure:
// 1. Psalm header spans two lines when converted:
//    "Psalm" (from <font> wrap) then "N. Latin subtitle." (next line)
//    OR on a single stripped line: "Psalm N. Latin subtitle."
// 2. Drop-cap first verse: one line with the capital letter (e.g. "BLESSED"),
//    followed by lines with the verse text. The dropcap letter is in
//    <span class="dropcap2">X</span>.
// 3. Subsequent verses: line starts with "N text" where N is verse number.
//    Long verses wrap across multiple lines.
// 4. Continuation lines starting with "*" or lowercase/punctuation are
//    continuations of the previous verse.
// 5. Psalm 119 section headers: "II. Latin subtitle." (roman numeral lines)

function parsePsalmContent(leftHtml) {
  // Pre-process: convert <br> to \n, paragraph tags to \n
  // Keep em tag content before stripping for subtitle extraction

  // First, insert artificial line breaks before inline verse numbers that appear
  // embedded in text without a preceding <br>. Pattern: "text.NN text" or "text;NN text"
  // where NN is a verse number (1-176) preceded by sentence-ending punctuation.
  // Example: "and maketh my way perfect.34 He maketh..." → insert \n before "34"
  let preHtml = leftHtml.replace(
    /([.;,!?])\s*(\d{1,3})\s+([A-Z])/g,
    (match, punct, num, cap) => {
      const n = parseInt(num, 10);
      if (n >= 2 && n <= 176) {
        // Insert a synthetic line break to separate the verses
        return punct + '\n        ' + num + ' ' + cap;
      }
      return match;
    }
  );

  let processed = preHtml
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi,      '\n')
    .replace(/<p[^>]*>/gi,   '\n')
    .replace(/<div[^>]*>/gi, '\n')
    .replace(/<\/div>/gi,    '\n');

  const rawLines = processed.split('\n');

  // Build a list of "clean lines" with both original (for em extraction) and stripped
  // Filter empty lines but keep track of position
  const lines = [];
  for (const rawLine of rawLines) {
    // Extract em content (subtitle) from the raw line
    const emMatch = rawLine.match(/<em>([^<]*)<\/em>/i);
    // Remove sup footnote tags
    const cleanRaw = removeFootnotes(rawLine);
    // Strip all remaining tags
    const stripped = cleanText(stripTags(cleanRaw));
    if (stripped) {
      lines.push({ raw: rawLine, stripped, subtitle: emMatch ? cleanText(emMatch[1]) : null });
    }
  }

  const psalms = {};
  let curPsalm = null;
  let curVerseNum = 0;
  let lastLineWasPsalmWord = false;  // "Psalm" on its own line
  let lastPsalmWord = null;          // remember the line content

  function getPsalm(num, subtitle) {
    if (!psalms[num]) {
      psalms[num] = {
        number:     num,
        title:      'Psalm ' + num,
        subtitle:   subtitle || '',
        verseTexts: {},
        sections:   []
      };
    } else {
      if (subtitle && !psalms[num].subtitle) psalms[num].subtitle = subtitle;
    }
    return psalms[num];
  }

  function appendToVerse(vNum, text) {
    if (!curPsalm || vNum < 1) return;
    if (curPsalm.verseTexts[vNum]) {
      curPsalm.verseTexts[vNum] += ' ' + text;
    } else {
      curPsalm.verseTexts[vNum] = text;
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const { raw, stripped, subtitle } = lines[i];

    // ── Skip navigation / structural elements that aren't psalm text ─────────
    if (/^(First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eighth|Ninth|Tenth|Eleventh|Twelfth|Thirteenth|Fourteenth|Fifteenth|Sixteenth|Seventeenth|Eighteenth|Nineteenth|Twentieth|Twenty-first|Twenty-second|Twenty-third|Twenty-fourth|Twenty-fifth|Twenty-sixth|Twenty-seventh|Twenty-eighth|Twenty-ninth|Thirtieth)\s+Day/i.test(stripped)) {
      lastLineWasPsalmWord = false;
      continue;
    }
    if (/^The\s+\w[\w-]*\s+Day/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    // Only skip standalone "The" if it's NOT a dropcap line (dropcap "THE" = verse 1 of some psalms)
    if (/^The$/i.test(stripped) && !raw.includes('dropcap2')) { lastLineWasPsalmWord = false; continue; }
    if (/^(Morning|Evening)\s+Prayer/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    if (/^(Morning|Evening)$/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    if (/^Prayer\.?$/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    if (/^BOOK\s+[IVX]+/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    if (/^I\.$/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }  // "BOOK I."
    if (/^The\s+Psalter/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    if (/^or\s+Psalms\s+of\s+David/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    if (/^Go\s+to\s+Psalms/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    if (/^Return\s+to/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    if (/until\s+1892/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    if (/until\s+1928/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    if (/in\s+Engl\.\s+Book/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    if (/^First\s+page/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    // Skip footnote-only lines: starts with digit, short text like "1 the heathen"
    if (/^\d+\s+[a-z]/.test(stripped) && stripped.length < 60) { lastLineWasPsalmWord = false; continue; }
    if (/^blessed\s*\(i\.e\./i.test(stripped)) { lastLineWasPsalmWord = false; continue; }
    if (/^e\.,\s*not\s+capitalized/i.test(stripped)) { lastLineWasPsalmWord = false; continue; }

    // ── Psalm 119 section header (within psalm 119 only) ────────────────────
    // Pattern: "II. In quo corrigit?" or just "II." on one line then subtitle
    // Must start with Roman numerals (I, II, III, ... XXII) followed by dot
    if (curPsalm && curPsalm.number === 119 &&
        /^([IVX]+)\.\s*/i.test(stripped) &&
        !/^Psalm\s/i.test(stripped)) {
      const mSec = stripped.match(/^([IVX]+)\.\s*(.*)/);
      if (mSec) {
        const secSubtitle = subtitle || cleanText(mSec[2]);
        curPsalm.sections.push({
          label:      mSec[1] + '.',
          subtitle:   secSubtitle,
          startVerse: curVerseNum + 1
        });
        lastLineWasPsalmWord = false;
        continue;
      }
    }

    // ── "Psalm" on its own line (the header spans two lines) ─────────────────
    if (/^Psalm$/i.test(stripped)) {
      lastLineWasPsalmWord = true;
      lastPsalmWord = stripped;
      continue;
    }

    // ── Psalm header: "Psalm N. Subtitle" or "N. Subtitle" after "Psalm" line
    // Full: "Psalm N. Subtitle"
    // Split: previous line was "Psalm", this line is "N. Subtitle"
    let psalmHeaderMatch = null;
    if (/^Psalm\s+\d+/i.test(stripped)) {
      psalmHeaderMatch = stripped.match(/^Psalm\s+(\d+)\.?\s*(?:[IVX]+\.\s*)?(.*)/i);
    } else if (lastLineWasPsalmWord && /^\d+\./.test(stripped)) {
      // This line is "N. Subtitle" after "Psalm" on previous line
      psalmHeaderMatch = stripped.match(/^(\d+)\.?\s*(?:[IVX]+\.\s*)?(.*)/);
    }

    if (psalmHeaderMatch) {
      const num = parseInt(psalmHeaderMatch[1], 10);
      const sub = subtitle || cleanText(psalmHeaderMatch[2]).replace(/\.$/, '');
      curPsalm = getPsalm(num, sub);
      curVerseNum = 0;
      lastLineWasPsalmWord = false;
      continue;
    }

    lastLineWasPsalmWord = false;
    if (!curPsalm) continue;

    // ── Drop-cap first verse ─────────────────────────────────────────────────
    // The raw line contains class="dropcap2" with the first letter.
    // Pattern: <span class="dropcap2"><font ...>X</font></span><font ...>REST
    // The drop-cap letter is the last uppercase letter inside the span.
    if (raw.includes('dropcap2')) {
      // Extract the drop-cap letter: get content of the span, strip inner tags
      const mSpan = raw.match(/<span[^>]*dropcap2[^>]*>([\s\S]*?)<\/span>/i);
      const spanInner = mSpan ? stripTags(mSpan[1]).trim() : '';
      const dropLetter = spanInner.replace(/\s/g, '').toUpperCase() || '';

      // Get the verse body text after removing the dropcap span
      const withoutDrop = raw.replace(/<span[^>]*dropcap2[^>]*>[\s\S]*?<\/span>/gi, '');
      const bodyText = cleanText(stripTags(removeFootnotes(withoutDrop)));

      // Full verse 1 text = dropcap letter + body
      const verseText = dropLetter + bodyText;

      // Determine which verse number this is
      // For Psalm 119: after section header, it's curVerseNum + 1
      // For other psalms: it's verse 1 (first verse)
      const targetVerseNum = curVerseNum + 1;

      if (!curPsalm.verseTexts[targetVerseNum]) {
        curPsalm.verseTexts[targetVerseNum] = verseText;
        curVerseNum = targetVerseNum;
      }
      continue;
    }

    // ── Verse number at start: "N text..." or bare "N" ──────────────────────
    // Bare "N" on its own line happens when HTML wraps verse number and text
    // across a physical line break (e.g. "&nbsp;&nbsp;&nbsp; 8\n  The earth...")
    const mV = stripped.match(/^(\d+)\s+(.+)/);
    const mVBare = !mV && stripped.match(/^(\d+)$/);
    if (mV || mVBare) {
      const vNum = parseInt((mV || mVBare)[1], 10);
      if (vNum > 0 && vNum <= 176) {
        if (mV) {
          const vText = cleanText(mV[2]);
          curPsalm.verseTexts[vNum] = vText;
        } else {
          // Bare number — text will come as continuation on next line(s)
          curPsalm.verseTexts[vNum] = '';  // placeholder
        }
        curVerseNum = vNum;
        continue;
      }
    }

    // ── Drop-cap capital letter alone on a line (e.g. "BLESSED") ────────────
    // This happens when dropcap letter was not in a span, or drop-cap is whole-word caps
    // Pattern: ALL_CAPS word(s), and this is right after a psalm header
    // The next line(s) will be the rest of verse 1
    if (curVerseNum === 0 && /^[A-Z][A-Z]+(?:\s+[A-Z]+)*$/.test(stripped) && stripped.length < 20) {
      // Looks like a drop-cap first word
      curPsalm.verseTexts[1] = stripped;
      curVerseNum = 1;
      continue;
    }

    // ── Continuation text ────────────────────────────────────────────────────
    // Append to current verse
    if (curVerseNum > 0) {
      // Don't append if this looks like a footnote
      if (/^\d+\s+[a-z]/.test(stripped) && stripped.length < 80) continue;
      appendToVerse(curVerseNum, stripped);
      continue;
    }

    // ── Text before first verse (e.g. after drop-cap, the first verse body)
    // This handles the case where drop-cap produced verse 1 partial text
    // and now we're getting continuation
    if (curVerseNum === 0 && curPsalm) {
      // Could be beginning of verse 1 if no dropcap was found
      // Some psalms don't use dropcap format
      if (/^[A-Z]/.test(stripped) || /^\*/.test(stripped)) {
        if (!curPsalm.verseTexts[1]) {
          curPsalm.verseTexts[1] = stripped;
          curVerseNum = 1;
        }
      }
    }
  }

  return psalms;
}

// ─── 30-day psalter assignment ───────────────────────────────────────────────

const PSALTER_PLAN = {
  "1":  { morning: [1,2,3,4,5],               evening: [6,7,8] },
  "2":  { morning: [9,10,11],                  evening: [12,13,14] },
  "3":  { morning: [15,16,17],                 evening: [18] },
  "4":  { morning: [19,20,21],                 evening: [22,23] },
  "5":  { morning: [24,25,26],                 evening: [27,28,29] },
  "6":  { morning: [30,31],                    evening: [32,33,34] },
  "7":  { morning: [35,36],                    evening: [37] },
  "8":  { morning: [38,39,40],                 evening: [41,42,43] },
  "9":  { morning: [44,45,46],                 evening: [47,48,49] },
  "10": { morning: [50,51,52],                 evening: [53,54,55] },
  "11": { morning: [56,57,58],                 evening: [59,60,61] },
  "12": { morning: [62,63,64],                 evening: [65,66,67] },
  "13": { morning: [68],                       evening: [69,70] },
  "14": { morning: [71,72],                    evening: [73,74] },
  "15": { morning: [75,76,77],                 evening: [78] },
  "16": { morning: [79,80,81],                 evening: [82,83,84,85] },
  "17": { morning: [86,87,88],                 evening: [89] },
  "18": { morning: [90,91,92],                 evening: [93,94] },
  "19": { morning: [95,96,97],                 evening: [98,99,100,101] },
  "20": { morning: [102,103],                  evening: [104] },
  "21": { morning: [105],                      evening: [106] },
  "22": { morning: [107],                      evening: [108,109] },
  "23": { morning: [110,111,112,113],          evening: [114,115] },
  "24": { morning: [116,117,118],              evening: ['119a'] },
  "25": { morning: ['119b'],                   evening: ['119c'] },
  "26": { morning: ['119d'],                   evening: ['119e'] },
  "27": { morning: [120,121,122,123,124,125],  evening: [126,127,128,129,130,131] },
  "28": { morning: [132,133,134,135],          evening: [136,137,138] },
  "29": { morning: [139,140,141],              evening: [142,143] },
  "30": { morning: [144,145,146],              evening: [147,148,149,150] },
};

const PS119_RANGES = {
  '119a': { start: 1,   end: 32  },
  '119b': { start: 33,  end: 72  },
  '119c': { start: 73,  end: 104 },
  '119d': { start: 105, end: 144 },
  '119e': { start: 145, end: 176 },
};

const GLORIA = 'Glory be to the Father, and to the Son, * and to the Holy Ghost;\nAs it was in the beginning, is now, and ever shall be, * world without end. Amen.';

// ─── format a psalm into a verse object ──────────────────────────────────────

function formatPsalmVerses(psalmData, rangeOpt) {
  const { title, subtitle, verseTexts } = psalmData;
  const allNums = Object.keys(verseTexts).map(Number).sort((a,b) => a - b);
  let nums = allNums;
  if (rangeOpt) {
    nums = allNums.filter(n => n >= rangeOpt.start && n <= rangeOpt.end);
  }
  if (nums.length === 0) return null;

  const verseLines = nums.map(n => n + '. ' + (verseTexts[n] || ''));
  const fullText   = verseLines.join('\n') + '\n' + GLORIA;

  return {
    psalm:    psalmData.number,
    title:    title,
    subtitle: subtitle,
    text:     fullText
  };
}

// ─── build final JSON ─────────────────────────────────────────────────────────

function buildOutput(psalmsMap) {
  const output = {};
  for (const [dayStr, sessions] of Object.entries(PSALTER_PLAN)) {
    output[dayStr] = {};
    for (const [sessionName, refs] of Object.entries(sessions)) {
      const verses = [];
      for (const ref of refs) {
        if (typeof ref === 'string' && ref.startsWith('119')) {
          const range  = PS119_RANGES[ref];
          const psData = psalmsMap[119];
          if (!psData) { console.warn('Psalm 119 not found!'); continue; }
          const vObj = formatPsalmVerses(psData, range);
          if (vObj) { vObj.psalm119section = ref; verses.push(vObj); }
        } else {
          const psData = psalmsMap[ref];
          if (!psData) { console.warn('Psalm ' + ref + ' not found!'); continue; }
          const vObj = formatPsalmVerses(psData, null);
          if (vObj) verses.push(vObj);
        }
      }
      output[dayStr][sessionName] = { refs, verses };
    }
  }
  return output;
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const URLS = [
    'http://justus.anglican.org/resources/bcp/1928/Psalms1.htm',
    'http://justus.anglican.org/resources/bcp/1928/Psalms2.htm',
    'http://justus.anglican.org/resources/bcp/1928/Psalms3.htm',
  ];

  console.log('Fetching psalms pages...');
  const pages = [];
  for (const url of URLS) {
    console.log('  GET ' + url);
    pages.push(await fetchPage(url));
  }
  console.log('All pages fetched.');

  const allPsalms = {};
  for (let i = 0; i < pages.length; i++) {
    console.log('Parsing page ' + (i + 1) + '...');
    const leftHtml   = extractLeftColumn(pages[i]);
    const pagePsalms = parsePsalmContent(leftHtml);
    const found = Object.keys(pagePsalms).map(Number).sort((a,b) => a - b);
    console.log('  Found psalms: ' + found.join(', '));
    for (const [num, data] of Object.entries(pagePsalms)) {
      if (!allPsalms[num]) {
        allPsalms[num] = data;
      } else {
        Object.assign(allPsalms[num].verseTexts, data.verseTexts);
        allPsalms[num].sections.push(...data.sections);
      }
    }
  }

  console.log('\nTotal psalms parsed: ' + Object.keys(allPsalms).length);

  const missing = [];
  for (let i = 1; i <= 150; i++) {
    if (!allPsalms[i] || Object.keys(allPsalms[i].verseTexts).length === 0) missing.push(i);
  }
  if (missing.length > 0) {
    console.warn('WARNING: missing/empty psalms: ' + missing.join(', '));
  } else {
    console.log('All 150 psalms present with verses.');
  }

  for (const n of [1, 23, 119, 150]) {
    if (allPsalms[n]) {
      const vc = Object.keys(allPsalms[n].verseTexts).length;
      const v1 = (allPsalms[n].verseTexts[1] || '(missing)').substring(0, 80);
      console.log('  Psalm ' + n + ': ' + vc + ' verses | "' + allPsalms[n].subtitle + '"');
      console.log('    v1: ' + v1);
    }
  }

  console.log('\nBuilding 30-day psalter JSON...');
  const output = buildOutput(allPsalms);

  const outPath = path.join(__dirname, '..', 'src', 'data', 'psalms.json');
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf8');
  console.log('Wrote ' + outPath);

  const parsed = JSON.parse(fs.readFileSync(outPath, 'utf8'));
  const dayCount = Object.keys(parsed).length;
  console.log('\nValidation:');
  console.log('  Days: ' + dayCount);
  console.log('  Day 1 morning verses: ' + parsed['1'].morning.verses.length);
  console.log('  Day 1 evening verses: ' + parsed['1'].evening.verses.length);
  console.log('  Day 24 evening refs: ' + JSON.stringify(parsed['24'].evening.refs));
  console.log('  Day 25 morning verse count: ' + parsed['25'].morning.verses.length);

  if (dayCount === 30) {
    console.log('\nSUCCESS: psalms.json written with all 30 days.');
  } else {
    console.error('\nERROR: Expected 30 days, got ' + dayCount);
    process.exit(1);
  }
}

main().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
