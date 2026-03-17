const fs = require('fs');
const path = require('path');
const lect = JSON.parse(fs.readFileSync(path.join(__dirname,'..','src','data','lectionary.json'), 'utf8'));
const lessons = JSON.parse(fs.readFileSync(path.join(__dirname,'..','src','data','lessons.json'), 'utf8'));

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

console.log('Total unique lectionary refs:', allRefs.size);
console.log('Covered in lessons.json:', allRefs.size - missing.length);
console.log('Missing:', missing.length);
console.log('\nMissing refs:');
missing.forEach(function(r) { console.log(' ', r); });
