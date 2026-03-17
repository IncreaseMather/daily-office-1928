/**
 * remap-old-apocrypha-keys.js
 * The patch-apocrypha-missing.js stores text under old (pre-fix) lectionary keys.
 * This script copies those to the new (post-fix) keys used by the current lectionary.
 */
var fs = require('fs');
var path = require('path');
var LESSONS_PATH = path.join(__dirname,'..','src','data','lessons.json');
var lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));

var remapped = 0;

// Map: old key → new key
var keyMap = {
  'Sirach 4:20-200; Sirach 5:1-7': 'Sirach 4:20-31; Sirach 5:1-7',
  // 'Sirach 27:30-200; Sirach 28:1-7' was fixed to 'Sirach 28:1-7' — already handled by fill-apocrypha
};

for (var oldKey in keyMap) {
  var newKey = keyMap[oldKey];
  if (lessons[oldKey] && !lessons[newKey]) {
    lessons[newKey] = lessons[oldKey];
    remapped++;
    console.log('Remapped: ' + oldKey + ' -> ' + newKey + ' (' + lessons[newKey].length + ' verses)');
  } else if (lessons[newKey]) {
    console.log('Already exists: ' + newKey);
  } else {
    console.log('Source missing: ' + oldKey);
  }
}

fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons), 'utf8');
console.log('\nRemapped:', remapped, 'keys');
