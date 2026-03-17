var fs = require('fs');
var path = require('path');
var LECT_PATH = path.join(__dirname,'..','src','data','lectionary.json');
var LESSONS_PATH = path.join(__dirname,'..','src','data','lessons.json');
var lect = JSON.parse(fs.readFileSync(LECT_PATH, 'utf8'));
var lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));

console.log('lessons.json keys:', Object.keys(lessons).length);

var all = new Set();
var days = Object.values(lect);
for (var i = 0; i < days.length; i++) {
  var d = days[i];
  var svcs = ['mp','ep'];
  for (var si = 0; si < svcs.length; si++) {
    var s = svcs[si];
    var parts = ['first','second'];
    for (var pi = 0; pi < parts.length; pi++) {
      var p = parts[pi];
      var r = d[s] && d[s][p];
      if (r) all.add(r);
    }
  }
}

var allArr = Array.from(all);
var miss = allArr.filter(function(r) {
  var v = lessons[r];
  return !v || (Array.isArray(v) && v.length === 0);
});

console.log('Total unique lectionary refs:', allArr.length);
console.log('Covered:', allArr.length - miss.length);
console.log('Missing:', miss.length);
console.log('\nMissing refs:');

// Categorize
var apoc = ['Baruch','Wisdom','Sirach','Tobit','Judith','1 Maccabees','2 Maccabees','1 Esdras','2 Esdras','Three Children'];
var apocMiss = miss.filter(function(r) {
  return apoc.some(function(b) { return r.startsWith(b); });
});
var canonMiss = miss.filter(function(r) {
  return !apoc.some(function(b) { return r.startsWith(b); });
});

console.log('\nApocrypha missing:', apocMiss.length);
apocMiss.forEach(function(r) { console.log(' ', r); });

console.log('\nCanonical still missing:', canonMiss.length);
canonMiss.forEach(function(r) { console.log(' ', r); });
