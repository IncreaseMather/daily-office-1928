const lect   = require('../src/data/lectionary.json');
const lessons = require('../src/data/lessons.json');
const missing = [];
for (const e of Object.values(lect)) {
  for (const svc of ['mp','ep']) {
    for (const part of ['first','second']) {
      const ref = e[svc] && e[svc][part];
      if (ref && ref.trim() && !lessons[ref]) missing.push(ref);
    }
  }
}
const uniq = [...new Set(missing)];
console.log('Missing unique refs:', uniq.length);
console.log('Already in lessons.json:', Object.keys(lect).length * 4 - missing.length);
