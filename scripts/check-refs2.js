const l = require('../src/data/lectionary.json');
const refs = Object.values(l).flatMap(e =>
  ['mp','ep'].flatMap(s => e[s] ? [e[s].first, e[s].second] : [])
).filter(r => r);
const crossCh = refs.filter(r => /\d+:\d+.*-\d+:\d/.test(r));
console.log('Cross-chapter remaining:', crossCh.length);
crossCh.forEach(r => console.log(' ', r));
const gen27 = refs.filter(r => r.indexOf('Genesis 27') !== -1);
console.log('Genesis 27 refs:', gen27.join(' | '));
const ecc11 = refs.filter(r => r.indexOf('Ecclesiastes 11') !== -1);
console.log('Eccl 11 refs:', ecc11.join(' | '));
