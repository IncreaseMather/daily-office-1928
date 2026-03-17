const https = require('https');
https.get('https://cdn.getbible.net/v2/kjv/john/3.json', res => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    const d = JSON.parse(body);
    const keys = Object.keys(d);
    console.log('HTTP', res.statusCode);
    console.log('Keys (verses):', keys.length);
    console.log('Verse 16:', JSON.stringify(d['16']).slice(0, 120));
  });
}).on('error', err => console.log('ERROR:', err.message));
