const https = require('https');
const http = require('http');
function get(url) {
  return new Promise((resolve, reject) => {
    const mod = url.startsWith('https') ? https : http;
    const req = mod.get(url, {headers:{'User-Agent':'Mozilla/5.0 DailyOffice/1.0'}}, res => {
      if ([301,302,303].includes(res.statusCode) && res.headers.location) {
        return get(res.headers.location).then(resolve).catch(reject);
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
  // Try getbible.net/v2
  try {
    const r = await get('https://getbible.net/v2/kjv/isaiah/1.json');
    console.log('getbible.net status:', r.status, r.body.slice(0,100));
  } catch(e) { console.log('getbible.net error:', e.message); }

  // Try api.scripture.api.bible (public demo endpoint)
  // try api.bible
  try {
    const r = await get('https://api.esv.org/v3/passage/text/?q=Isaiah+62:1-3');
    console.log('esv.org status:', r.status);
  } catch(e) { console.log('esv.org error:', e.message); }

  // Try thebibleapi.com
  try {
    const r = await get('https://kjvapi.thebibleapi.com/KJV/Isaiah/62');
    console.log('thebibleapi.com status:', r.status, r.body.slice(0,150));
  } catch(e) { console.log('thebibleapi.com error:', e.message); }

  // Try King James Bible online
  try {
    const r = await get('https://kingjamesbibleonline.org/Isaiah-62/');
    console.log('KJB online status:', r.status, r.body.slice(0,50));
  } catch(e) { console.log('KJB online error:', e.message); }
}
main().catch(e => console.error(e.message));
