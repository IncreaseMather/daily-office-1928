/**
 * patch-remaining-apocrypha.js
 * Manually fills the 5 remaining Apocrypha gaps after fill-apocrypha-subrefs.js
 */
var fs = require('fs');
var path = require('path');
var LESSONS_PATH = path.join(__dirname,'..','src','data','lessons.json');
var lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));

// Build chapter index from existing lessons.json data
function getVersesFromExisting(book, ch, v1, v2) {
  var key = book + ':' + ch;
  var candidates = Object.keys(lessons).filter(function(k) {
    return k.startsWith(book + ' ' + ch + ':');
  });
  var chData = {};
  for (var i = 0; i < candidates.length; i++) {
    var vv = lessons[candidates[i]];
    if (Array.isArray(vv)) {
      for (var j = 0; j < vv.length; j++) {
        chData[vv[j].verse] = vv[j].text;
      }
    }
  }
  var result = [];
  for (var v = v1; v <= v2; v++) {
    if (chData[v]) result.push({ verse: v, text: chData[v] });
  }
  return result.length > 0 ? result : null;
}

function getWholeChapter(book, ch) {
  var candidates = Object.keys(lessons).filter(function(k) {
    return k.startsWith(book + ' ' + ch + ':');
  });
  var chData = {};
  for (var i = 0; i < candidates.length; i++) {
    var vv = lessons[candidates[i]];
    if (Array.isArray(vv)) {
      for (var j = 0; j < vv.length; j++) {
        chData[vv[j].verse] = vv[j].text;
      }
    }
  }
  var nums = Object.keys(chData).map(Number).sort(function(a,b){return a-b;});
  var result = [];
  for (var i = 0; i < nums.length; i++) {
    result.push({ verse: nums[i], text: chData[nums[i]] });
  }
  return result.length > 0 ? result : null;
}

var filled = 0;
var gaps = [];

// 1. Wisdom 9 → whole chapter = Wisdom 9:1-18
var w9 = getWholeChapter('Wisdom', 9);
if (w9 && w9.length > 0) {
  lessons['Wisdom 9'] = w9;
  filled++;
  console.log('Filled: Wisdom 9 (' + w9.length + ' verses from 9:1-18)');
} else {
  gaps.push('Wisdom 9 - no existing data');
}

// 2. Sirach 2 → whole chapter = Sirach 2:1-18
var s2 = getWholeChapter('Sirach', 2);
if (s2 && s2.length > 0) {
  lessons['Sirach 2'] = s2;
  filled++;
  console.log('Filled: Sirach 2 (' + s2.length + ' verses from 2:1-18)');
} else {
  gaps.push('Sirach 2 - no existing data');
}

// 3. Sirach 3:17-31 → only 16 verses in our data; store available (none after 16)
var s3_17_31 = getVersesFromExisting('Sirach', 3, 17, 31);
if (s3_17_31 && s3_17_31.length > 0) {
  lessons['Sirach 3:17-31'] = s3_17_31;
  filled++;
  console.log('Filled: Sirach 3:17-31 (' + s3_17_31.length + ' verses)');
} else {
  gaps.push('Sirach 3:17-31 - Sirach 3 in our source only has 16 verses (different versification)');
  console.log('GAP: Sirach 3:17-31 - not available (our Sirach 3 ends at v16)');
}

// 4. Sirach 4:20-31; Sirach 5:1-7
var s4_20_31 = getVersesFromExisting('Sirach', 4, 20, 31);
var s5_1_7 = getVersesFromExisting('Sirach', 5, 1, 7);
if (s4_20_31 && s4_20_31.length > 0) {
  var s4_s5 = s4_20_31.concat(s5_1_7 || []);
  lessons['Sirach 4:20-31; Sirach 5:1-7'] = s4_s5;
  filled++;
  console.log('Filled: Sirach 4:20-31; Sirach 5:1-7 (' + s4_s5.length + ' verses)');
} else {
  gaps.push('Sirach 4:20-31; Sirach 5:1-7 - Sirach 4 in our source only has verses 1-10 and 1-18 (different versification, missing 20-31)');
  console.log('GAP: Sirach 4:20-31; Sirach 5:1-7 - not available (our Sirach 4 only has 10/18 verses)');
}

// 5. Three Children 29-37 → not in any canonical KJV source
gaps.push('Three Children 29-37 - Prayer of Azariah, not in KJV or available Apocrypha source');
console.log('GAP: Three Children 29-37 - not in available source');

fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons), 'utf8');
console.log('\nFilled:', filled);
console.log('Remaining gaps:', gaps.length);
gaps.forEach(function(g) { console.log('  -', g); });
