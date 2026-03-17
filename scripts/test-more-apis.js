const https = require('https');
function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {headers:{'User-Agent':'Mozilla/5.0'}}, res => {
      if ([301,302,303,307,308].includes(res.statusCode) && res.headers.location) {
        const loc = res.headers.location.startsWith('http') ? res.headers.location
          : new URL(res.headers.location, url).href;
        return get(loc).then(resolve).catch(reject);
      }
      let b = ''; res.setEncoding('utf8');
      res.on('data', c => b += c);
      res.on('end', () => resolve({status: res.statusCode, body: b}));
    });
    req.on('error', e => reject(e));
    req.setTimeout(10000, () => req.destroy(new Error('timeout')));
  });
}
async function test(name, url) {
  try {
    const r = await get(url);
    console.log(name, ':', r.status, r.body.slice(0,150));
  } catch(e) { console.log(name, 'ERROR:', e.message); }
}
async function main() {
  await test('bibleapi.co', 'https://bible-api.co/api/read/kjv/isaiah/62');
  await test('ourmanna KJV', 'https://ourmanna.com/api/v1/get/?format=json&order=random&translation=kjv');
  await test('apostolic.io', 'https://api.apostolic.io/v1/bible/kjv/books/isaiah/chapters/62/verses');
  await test('bible-api.com single', 'https://bible-api.com/Isaiah+1:1?translation=kjv');
}
main();
