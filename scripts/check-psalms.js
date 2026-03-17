const d = require('../src/data/psalms.json');
const days = Object.keys(d).filter(k => k !== '_note' && k !== '_source');
console.log('Days present:', days.length);
console.log('Day keys:', days.sort((a,b) => +a - +b).join(', '));

const p1 = d['1'] && d['1'].morning.verses[0];
if (p1) {
  console.log('\nPsalm 1 subtitle:', p1.subtitle);
  console.log('Psalm 1 text preview:', p1.text.substring(0, 150));
}

const p23entry = d['4'] && d['4'].evening.verses[0];
if (p23entry) {
  console.log('\nDay 4 evening Ps', p23entry.psalm, '-', p23entry.subtitle);
  console.log('Text preview:', p23entry.text.substring(0, 120));
}

// Check Psalm 119
const p119day = d['24'];
if (p119day) {
  const ev = p119day.evening.verses[0];
  console.log('\nPsalm 119 day-24 evening:', ev.psalm, ev.subtitle);
  console.log('refs:', p119day.evening.refs);
  console.log('text preview:', ev.text.substring(0, 150));
}

// Quick stats
let totalVerses = 0;
for (const day of days) {
  for (const session of ['morning', 'evening']) {
    for (const verse of d[day][session].verses) {
      totalVerses++;
    }
  }
}
console.log('\nTotal psalm entries:', totalVerses);
