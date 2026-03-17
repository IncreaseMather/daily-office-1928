#!/usr/bin/env node
// Replaces openingSentences in collects.json with exact 1928 BCP text,
// using separate sentence sets for Morning Prayer and Evening Prayer.
const fs = require('fs');
const path = require('path');

const COLLECTS_PATH = path.join(__dirname, '..', 'src', 'data', 'collects.json');

const morningSentences = {
  default: [
    "The LORD is in his holy temple: let all the earth keep silence before him.   Hab. ii. 20.",
    "I was glad when they said unto me, We will go into the house of the LORD.   Psalm cxxii. 1.",
    "Let the words of my mouth, and the meditation of my heart, be alway acceptable in thy sight, O LORD, my strength and my redeemer.   Psalm xix. 14.",
    "O send out thy light and thy truth, that they may lead me, and bring me unto thy holy hill, and to thy dwelling.   Psalm xliii. 3.",
    "Thus saith the high and lofty One that inhabiteth eternity, whose name is Holy; I dwell in the high and holy place, with him also that is of a contrite and humble spirit, to revive the spirit of the humble, and to revive the heart of the contrite ones.   Isaiah lvii. 15.",
    "The hour cometh, and now is, when the true worshippers shall worship the Father in spirit and in truth: for the Father seeketh such to worship him.   St. John iv. 23.",
    "Grace be unto you, and peace, from God our Father, and from the Lord Jesus Christ.   Phil. i. 2."
  ],
  Advent: [
    "Repent ye, for the Kingdom of heaven is at hand.   St. Matt. iii. 2.",
    "Prepare ye the way of the LORD, make straight in the desert a highway for our God.   Isaiah xl. 3."
  ],
  Christmas: [
    "Behold, I bring you good tidings of great joy, which shall be to all people. For unto you is born this day in the city of David a Saviour, which is Christ the Lord.   St. Luke ii. 10, 11."
  ],
  Epiphany: [
    "From the rising of the sun even unto the going down of the same my Name shall be great among the Gentiles; and in every place incense shall be offered unto my Name, and a pure offering: for my Name shall be great among the heathen, saith the LORD of hosts.   Mal. i. 11.",
    "Awake, awake; put on thy strength, O Zion; put on thy beautiful garments, O Jerusalem.   Isaiah lii. 1."
  ],
  Lent: [
    "Rend your heart, and not your garments, and turn unto the LORD your God: for he is gracious and merciful, slow to anger, and of great kindness, and repenteth him of the evil.   Joel ii. 13.",
    "The sacrifices of God are a broken spirit: a broken and a contrite heart, O God, thou wilt not despise.   Psalm li. 17.",
    "I will arise and go to my father, and will say unto him, Father, I have sinned against heaven, and before thee, and am no more worthy to be called thy son.   St. Luke xv. 18, 19."
  ],
  goodFriday: [
    "Is it nothing to you, all ye that pass by? behold, and see if there be any sorrow like unto my sorrow which is done unto me, wherewith the LORD hath afflicted me.   Lam. i. 12.",
    "In whom we have redemption through his blood, the forgiveness of sins, according to the riches of his grace.   Eph. i. 7."
  ],
  Easter: [
    "He is risen. The Lord is risen indeed.   St. Mark xvi. 6; St. Luke xxiv. 34.",
    "This is the day which the LORD hath made; we will rejoice and be glad in it.   Psalm cxviii. 24."
  ],
  ascensionDay: [
    "Seeing that we have a great High Priest, that is passed into the heavens, Jesus the Son of God, let us come boldly unto the throne of grace, that we may obtain mercy, and find grace to help in time of need.   Heb. iv. 14, 16."
  ],
  whitsunday: [
    "Ye shall receive power, after that the Holy Ghost is come upon you: and ye shall be witnesses unto me both in Jerusalem, and in all Jud\u00e6a, and in Samaria, and unto the uttermost part of the earth.   Acts i. 8.",
    "Because ye are sons, God hath sent forth the Spirit of his Son into your hearts, crying, Abba, Father.   Gal. iv. 6."
  ],
  trinitySunday: [
    "Holy, holy, holy, Lord God Almighty, which was, and is, and is to come.   Rev. iv. 8."
  ],
  thanksgiving: [
    "Honour the LORD with thy substance, and with the first-fruits of all thine increase: so shall thy barns be filled with plenty, and thy presses shall burst out with new wine.   Prov. iii. 9, 10.",
    "The LORD by wisdom hath founded the earth; by understanding hath he established the heavens. By his knowledge the depths are broken up, and the clouds drop down the dew.   Prov. iii. 19, 20."
  ]
};

const eveningSentences = {
  default: [
    "The LORD is in his holy temple: let all the earth keep silence before him.   Hab. ii. 20.",
    "Lord, I have loved the habitation of thy house, and the place where thine honour dwelleth.   Psalm xxvi. 8.",
    "Let my prayer be set forth in thy sight as the incense; and let the lifting up of my hands be an evening sacrifice.   Psalm cxli. 2.",
    "O worship the LORD in the beauty of holiness; let the whole earth stand in awe of him.   Psalm xcvi. 9.",
    "Let the words of my mouth, and the meditation of my heart, be alway acceptable in thy sight, O LORD, my strength and my redeemer.   Psalm xix. 14, 15."
  ],
  Advent: [
    "Watch ye, for ye know not when the master of the house cometh, at even, or at midnight, or at the cock-crowing, or in the morning: lest coming suddenly he find you sleeping.   St. Mark xiii. 35, 36."
  ],
  Christmas: [
    "Behold, the tabernacle of God is with men, and he will dwell with them, and they shall be his people, and God himself shall be with them, and be their God.   Rev. xxi. 3."
  ],
  Epiphany: [
    "And the Gentiles shall come to thy light, and kings to the brightness of thy rising.   Isaiah lx. 3."
  ],
  Lent: [
    "I acknowledge my transgressions: and my sin is ever before me.   Psalm li. 3.",
    "To the Lord our God belong mercies and forgivenesses, though we have rebelled against him; neither have we obeyed the voice of the LORD our God, to walk in his laws which he set before us.   Dan. ix. 9, 10.",
    "If we say that we have no sin, we deceive ourselves, and the truth is not in us; but if we confess our sins, God is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.   1 St. John i. 8, 9."
  ],
  goodFriday: [
    "All we like sheep have gone astray; we have turned every one to his own way; and the LORD hath laid on him the iniquity of us all.   Isaiah liii. 6."
  ],
  Easter: [
    "Thanks be to God, which giveth us the victory through our Lord Jesus Christ.   1 Cor. xv. 57.",
    "If ye then be risen with Christ, seek those things which are above, where Christ sitteth on the right hand of God.   Col. iii. 1."
  ],
  ascensionDay: [
    "Christ is not entered into the holy places made with hands, which are the figures of the true; but into heaven itself, now to appear in the presence of God for us.   Heb. ix. 24."
  ],
  whitsunday: [
    "There is a river, the streams whereof shall make glad the city of God, the holy place of the tabernacles of the Most High.   Psalm xlvi. 4.",
    "The Spirit and the bride say, Come. And let him that heareth say, Come. And let him that is athirst come. And whosoever will, let him take the water of life freely.   Rev. xxii. 17."
  ],
  trinitySunday: [
    "Holy, holy, holy, is the LORD of hosts: the whole earth is full of his glory.   Isaiah vi. 3."
  ]
};

const collects = JSON.parse(fs.readFileSync(COLLECTS_PATH, 'utf8'));
collects.morning.openingSentences = morningSentences;
collects.evening.openingSentences = eveningSentences;
fs.writeFileSync(COLLECTS_PATH, JSON.stringify(collects, null, 2), 'utf8');
console.log('collects.json updated with exact 1928 BCP opening sentences (separate MP/EP).');
