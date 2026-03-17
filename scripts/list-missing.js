const lect   = require('../src/data/lectionary.json');
const lessons = require('../src/data/lessons.json');
const missing = [];
for (const e of Object.values(lect)) {
  for (const svc of ['mp','ep']) {
    for (const p of ['first','second']) {
      const ref = e[svc] && e[svc][p];
      if (ref && ref.trim() && !lessons[ref]) missing.push(ref);
    }
  }
}
const uniq = [...new Set(missing)].sort();
uniq.forEach(r => console.log(r));
