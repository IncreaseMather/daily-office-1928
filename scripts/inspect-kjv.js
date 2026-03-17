const fs = require('fs');
const KJV_PATH = process.env.KJV_PATH || 'C:/Users/aliss/AppData/Local/Temp/kjv-full.json';
const raw = fs.readFileSync(KJV_PATH, 'utf8').replace(/^\uFEFF/, '');
const d = JSON.parse(raw);
console.log('Books:', d.length);
console.log('Book structure:', JSON.stringify(Object.keys(d[0])));
console.log('Isaiah (index 22):', d[22].abbrev, 'name:', d[22].name || '(no name field)');
console.log('Isaiah chapters:', d[22].chapters.length);
console.log('Isa 62 v1:', d[22].chapters[61][0].slice(0, 80));
console.log('Rev abbrev:', d[65].abbrev, 'name:', d[65].name || '(no name field)', 'chs:', d[65].chapters.length);
// List all book abbreviations
console.log('\nAll books:', d.map(b => b.abbrev).join(', '));
