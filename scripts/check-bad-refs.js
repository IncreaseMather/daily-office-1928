const fs = require('fs');
const lect = JSON.parse(fs.readFileSync('src/data/lectionary.json', 'utf8'));

const suspicious = [];
for (const [dayKey, day] of Object.entries(lect)) {
  for (const svc of ['mp','ep']) {
    for (const part of ['first','second']) {
      const ref = day[svc] && day[svc][part];
      if (ref && (/\-200|\-150|\-100/.test(ref))) {
        suspicious.push({ dayKey, svc, part, ref });
      }
    }
  }
}
console.log('Remaining suspicious refs:', suspicious.length);
suspicious.forEach(x => console.log(' ', x.ref));

// Also check for any N:start-end where start > end
const badRange = [];
for (const [dayKey, day] of Object.entries(lect)) {
  for (const svc of ['mp','ep']) {
    for (const part of ['first','second']) {
      const ref = day[svc] && day[svc][part];
      if (!ref) continue;
      const segs = ref.split(';');
      for (const seg of segs) {
        const m = seg.match(/:(\d+)-(\d+)/);
        if (m && parseInt(m[1]) > parseInt(m[2])) {
          badRange.push({ dayKey, svc, part, ref, seg: seg.trim() });
        }
      }
    }
  }
}
console.log('\nBad range refs (start > end):', badRange.length);
badRange.forEach(x => console.log(' ', x.ref));
