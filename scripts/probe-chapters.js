#!/usr/bin/env node
// Probes the actual verse counts for chapters that returned 404
const https = require('https');

function httpGet(url, n = 8) {
  return new Promise((res, rej) => {
    require(url.startsWith('https') ? 'https' : 'http')
      .get(url, { headers: { 'User-Agent': 'DailyOffice/1.0' } }, r => {
        const loc = r.headers.location;
        if ([301,302,303,307,308].includes(r.statusCode) && loc && n > 0) {
          const next = loc.startsWith('http') ? loc : new URL(loc, url).href;
          return httpGet(next, n - 1).then(res).catch(rej);
        }
        let b = ''; r.setEncoding('utf8');
        r.on('data', c => b += c);
        r.on('end', () => res({ status: r.statusCode, body: b }));
      }).on('error', rej);
  });
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function probeChapter(passage) {
  const url = 'https://bible-api.com/' + encodeURIComponent(passage) + '?translation=kjv';
  const r = await httpGet(url);
  if (r.status === 200) {
    const d = JSON.parse(r.body);
    if (!d.error) return d.verses.length;
  }
  return 0;
}

const toProbe = [
  ['3 John', 1],
  ['Baruch', 3],
  ['Sirach', 30],
  ['Sirach', 32],
  ['Sirach', 33],
  ['Sirach', 35],
  ['Sirach', 44],
  ['Tobit', 2],
  ['Tobit', 6],
  ['Tobit', 10],
  ['Tobit', 11],
];

(async () => {
  for (const [book, ch] of toProbe) {
    await sleep(3000);
    const count = await probeChapter(`${book} ${ch}:1-999`);
    console.log(`${book} ${ch}: ${count} verses`);
  }
})();
