const l = require('../src/data/lectionary.json');
const refs = new Set();
for (const e of Object.values(l)) {
  for (const svc of ['mp','ep']) {
    if (e[svc]) { refs.add(e[svc].first); refs.add(e[svc].second); }
  }
}
const arr = [...refs].filter(r => r);
const noColon = arr.filter(r => r.indexOf(':') === -1 && r !== 'Three Children 29-37');
console.log('No-colon refs remaining:', noColon.length);
noColon.forEach(r => console.log(' ', r));
const jonah = arr.filter(r => r.indexOf('Jonah') !== -1);
console.log('\nJonah refs:', jonah.join(', '));
console.log('\nashWednesday ep:', JSON.stringify(l.ashWednesday.ep));
console.log('lent4Monday ep:', JSON.stringify(l.lent4Monday.ep));
