const l = require('../src/data/lessons.json');
const k = Object.keys(l);
console.log('Total entries:', k.length);
const gen44 = k.filter(r => r.indexOf('Genesis 44') !== -1);
console.log('Genesis 44:', gen44.join(', ') || 'NONE');
const isa62 = k.filter(r => r.indexOf('Isaiah 62') !== -1);
console.log('Isaiah 62:', isa62.join(', ') || 'NONE');
const mark12 = k.filter(r => r.indexOf('Mark 12:18') !== -1);
console.log('Mark 12:18:', mark12.join(', ') || 'NONE');
