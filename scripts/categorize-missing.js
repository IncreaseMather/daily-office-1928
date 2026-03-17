const fs = require('fs');
const lect = JSON.parse(fs.readFileSync('src/data/lectionary.json', 'utf8'));
const lessons = JSON.parse(fs.readFileSync('src/data/lessons.json', 'utf8'));

// Find all lectionary refs
const allRefs = new Set();
for (const day of Object.values(lect)) {
  for (const svc of ['mp','ep']) {
    for (const part of ['first','second']) {
      const ref = day[svc] && day[svc][part];
      if (ref) allRefs.add(ref);
    }
  }
}

const missing = Array.from(allRefs).filter(function(r) {
  return !lessons[r] || lessons[r].length === 0;
});

const wholeChapter = missing.filter(function(r) { return r.indexOf(':') === -1; });
const withColon = missing.filter(function(r) { return r.indexOf(':') !== -1; });

console.log('Total unique lectionary refs:', allRefs.size);
console.log('Missing in lessons.json:', missing.length);
console.log('  Whole-chapter refs (no colon):', wholeChapter.length);
console.log('  Verse-specific refs (with colon):', withColon.length);
console.log('\nSample whole-chapter missing:');
wholeChapter.slice(0, 30).forEach(function(r) { console.log(' ', r); });
console.log('\nSample verse-specific missing (first 30):');
withColon.slice(0, 30).forEach(function(r) { console.log(' ', r); });
