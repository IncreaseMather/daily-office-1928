#!/usr/bin/env node
/**
 * patch-apocrypha-missing.js
 * Adds the 4 remaining missing Apocrypha passages to lessons.json.
 * Text from NRSV (BibleGateway).
 */
const fs   = require('fs');
const path = require('path');
const LESSONS_PATH = path.join(__dirname, '..', 'src', 'data', 'lessons.json');
const lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));

// ── 1. Sirach 3:17-31 ─────────────────────────────────────────────────────────
// Note: NRSV omits verse 19 (textual variant). Verses jump 18 → 20.
lessons['Sirach 3:17-31'] = [
  {verse:17, text:"My child, perform your tasks with humility; then you will be loved more than a giver of gifts."},
  {verse:18, text:"The greater you are, the more you must humble yourself; so you will find favor in the sight of the Lord."},
  {verse:20, text:"For great is the might of the Lord, but by the humble he is glorified."},
  {verse:21, text:"Neither seek what is too difficult for you nor investigate what is beyond your power."},
  {verse:22, text:"Reflect upon what you have been commanded, for what is hidden is not your concern."},
  {verse:23, text:"In matters greater than your own affairs, do not meddle, for things beyond human understanding have been shown you."},
  {verse:24, text:"For their conceit has led many astray, and wrong opinion has impaired their judgment."},
  {verse:25, text:"Without eyes there is no light; without knowledge there is no wisdom."},
  {verse:26, text:"A stubborn mind will fare badly at the end, and whoever loves danger will perish in it."},
  {verse:27, text:"A stubborn mind will be burdened by troubles, and the sinner adds sin to sins."},
  {verse:28, text:"When calamity befalls the proud, there is no healing, for an evil plant has taken root in him."},
  {verse:29, text:"The mind of the intelligent appreciates proverbs, and an attentive ear is the desire of the wise."},
  {verse:30, text:"As water extinguishes a blazing fire, so almsgiving atones for sin."},
  {verse:31, text:"Those who repay favors give thought to the future; when they fall they will find support."},
];

// ── 2. Sirach 4:20-200; Sirach 5:1-7 ─────────────────────────────────────────
// Combine Sirach 4:20-31 + Sirach 5:1-7
const sir4_20_31 = [
  {verse:20, text:"Watch for the opportune time, and beware of evil, and do not be ashamed to be yourself."},
  {verse:21, text:"For there is a shame that leads to sin, and there is a shame that is glory and favor."},
  {verse:22, text:"Do not show partiality to your own harm or deference to your downfall."},
  {verse:23, text:"Do not refrain from speaking at the proper moment, and do not hide your wisdom."},
  {verse:24, text:"For wisdom becomes known through speech and education through the words of the tongue."},
  {verse:25, text:"Never speak against the truth, but be ashamed of your ignorance."},
  {verse:26, text:"Do not be ashamed to confess your sins, and do not try to stop the current of a river."},
  {verse:27, text:"Do not subject yourself to a fool or show partiality to a ruler."},
  {verse:28, text:"Fight to the death for truth, and the Lord God will fight for you."},
  {verse:29, text:"Do not be reckless in your speech or sluggish and remiss in your deeds."},
  {verse:30, text:"Do not be like a lion in your home or suspicious of your slaves."},
  {verse:31, text:"Do not let your hand be stretched out to receive and closed when it is time to give back."},
];
const sir5_1_7 = lessons['Sirach 5:1-15']
  ? lessons['Sirach 5:1-15'].filter(v => v.verse >= 1 && v.verse <= 7)
  : [
  {verse:1, text:"Do not rely on your wealth or say, \"I have enough.\""},
  {verse:2, text:"Do not follow your inclination and strength in pursuing the desires of your heart."},
  {verse:3, text:"Do not say, \"Who can have power over me?\" for the Lord will surely punish you."},
  {verse:4, text:"Do not say, \"I sinned, yet what has happened to me?\" for the Lord is slow to anger."},
  {verse:5, text:"Do not be so confident of forgiveness that you add sin to sins."},
  {verse:6, text:"Do not say, \"His mercy is great; he will forgive the multitude of my sins,\" for both mercy and wrath are with him, and his anger will rest on sinners."},
  {verse:7, text:"Do not delay to turn back to the Lord, and do not postpone it from day to day, for suddenly the wrath of the Lord will come forth, and at the time of punishment you will perish."},
];
lessons['Sirach 4:20-200; Sirach 5:1-7'] = [...sir4_20_31, ...sir5_1_7];

// ── 3. Sirach 27:30-200; Sirach 28:1-7 ───────────────────────────────────────
// Sirach 27:30 + first 7 verses of existing Sirach 28:1-26 entry
const sir27_30 = [
  {verse:30, text:"Anger and wrath, these also are abominations, yet a sinner holds on to them."},
];
const sir28_1_7 = lessons['Sirach 28:1-26']
  ? lessons['Sirach 28:1-26'].filter(v => v.verse >= 1 && v.verse <= 7)
  : [];
lessons['Sirach 27:30-200; Sirach 28:1-7'] = [...sir27_30, ...sir28_1_7];

// ── 4. Three Children 29-37 ───────────────────────────────────────────────────
// Song of the Three Young Men (Prayer of Azariah), NRSV verses 29-37
lessons['Three Children 29-37'] = [
  {verse:29, text:"Blessed are you, O Lord, God of our ancestors, and to be praised and highly exalted forever; And blessed is your glorious, holy name, and to be highly praised and highly exalted forever."},
  {verse:30, text:"Blessed are you in the temple of your holy glory, and to be extolled and highly glorified forever."},
  {verse:31, text:"Blessed are you who look into the depths from your throne on the cherubim, and to be praised and highly exalted forever."},
  {verse:32, text:"Blessed are you on the throne of your kingdom, and to be extolled and highly exalted forever."},
  {verse:33, text:"Blessed are you in the firmament of heaven, and to be sung and glorified forever."},
  {verse:34, text:"Bless the Lord, all you works of the Lord; sing praise to him and highly exalt him forever."},
  {verse:35, text:"Bless the Lord, you heavens; sing praise to him and highly exalt him forever."},
  {verse:36, text:"Bless the Lord, you angels of the Lord; sing praise to him and highly exalt him forever."},
  {verse:37, text:"Bless the Lord, all you waters above the heavens; sing praise to him and highly exalt him forever."},
];

fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons), 'utf8');
console.log('Patched lessons.json with 4 missing Apocrypha passages.');
console.log('  Sirach 3:17-31:', lessons['Sirach 3:17-31'].length, 'verses');
console.log('  Sirach 4:20-200; Sirach 5:1-7:', lessons['Sirach 4:20-200; Sirach 5:1-7'].length, 'verses');
console.log('  Sirach 27:30-200; Sirach 28:1-7:', lessons['Sirach 27:30-200; Sirach 28:1-7'].length, 'verses');
console.log('  Three Children 29-37:', lessons['Three Children 29-37'].length, 'verses');
