const https = require('https');
function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {headers:{'User-Agent':'Mozilla/5.0 DailyOffice/1.0'}}, res => {
      if ([301,302,303,307].includes(res.statusCode) && res.headers.location) {
        const loc = res.headers.location.startsWith('http') ? res.headers.location
          : new URL(res.headers.location, url).href;
        return get(loc).then(resolve).catch(reject);
      }
      let b = ''; res.setEncoding('utf8');
      res.on('data', c => b += c);
      res.on('end', () => resolve({status: res.statusCode, body: b}));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy(new Error('timeout')));
  });
}
async function main() {
  // ebible.org USFM API - KJV text
  try {
    const r = await get('https://ebible.org/api/media?id=engkjv&ref=ISA.62&format=text');
    console.log('ebible API status:', r.status, r.body.slice(0,200));
  } catch(e) { console.log('ebible API error:', e.message); }

  // openbible.info
  try {
    const r = await get('https://www.openbible.info/api/passages?q=Isaiah+62:1-5&version=kjv');
    console.log('openbible status:', r.status, r.body.slice(0,200));
  } catch(e) { console.log('openbible error:', e.message); }

  // Try bible-api.com with different approach
  try {
    const r = await get('https://bible-api.com/Isaiah+62:1?translation=kjv');
    console.log('bible-api single verse status:', r.status, r.body.slice(0,100));
  } catch(e) { console.log('bible-api error:', e.message); }
}
main().catch(e => console.error(e.message));
