const https = require('https');
function get(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {headers:{'User-Agent':'DailyOffice/1.0'}}, res => {
      let b = ''; res.setEncoding('utf8');
      res.on('data', c => b += c);
      res.on('end', () => resolve({status: res.statusCode, body: b}));
    });
    req.on('error', reject);
    req.setTimeout(15000, () => req.destroy(new Error('timeout')));
  });
}
async function main() {
  // Test labs.bible.org API
  const r1 = await get('https://labs.bible.org/api/?passage=Isaiah+62:1-3&type=json');
  console.log('labs.bible.org status:', r1.status);
  console.log('body:', r1.body.slice(0, 200));
}
main().catch(e => console.error(e.message));
