#!/usr/bin/env node
// Patches the 5 remaining passages into lessons.json from manually retrieved text
const fs = require('fs');
const LESSONS_PATH = './src/data/lessons.json';
const lessons = JSON.parse(fs.readFileSync(LESSONS_PATH, 'utf8'));

lessons['Sirach 35:1-26'] = [
  {verse:1,text:"He that keepeth the law bringeth offerings enough: he that taketh heed to the commandment offereth a peace offering."},
  {verse:2,text:"He that requiteth a goodturn offereth fine flour; and he that giveth alms sacrificeth praise."},
  {verse:3,text:"To depart from wickedness is a thing pleasing to the Lord; and to forsake unrighteousness is a propitiation."},
  {verse:4,text:"Thou shalt not appear empty before the Lord."},
  {verse:5,text:"For all these things are to be done because of the commandment."},
  {verse:6,text:"The offering of the righteous maketh the altar fat, and the sweet savour thereof is before the most High."},
  {verse:7,text:"The sacrifice of a just man is acceptable. and the memorial thereof shall never be forgotten."},
  {verse:8,text:"Give the Lord his honour with a good eye, and diminish not the firstfruits of thine hands."},
  {verse:9,text:"In all thy gifts shew a cheerful countenance, and dedicate thy tithes with gladness."},
  {verse:10,text:"Give unto the most High according as he hath enriched thee; and as thou hast gotten, give with a cheerful eye."},
  {verse:11,text:"For the Lord recompenseth, and will give thee seven times as much."},
  {verse:12,text:"Do not think to corrupt with gifts; for such he will not receive: and trust not to unrighteous sacrifices; for the Lord is judge, and with him is no respect of persons."},
  {verse:13,text:"He will not accept any person against a poor man, but will hear the prayer of the oppressed."},
  {verse:14,text:"He will not despise the supplication of the fatherless; nor the widow, when she poureth out her complaint."},
  {verse:15,text:"Do not the tears run down the widow's cheeks? and is not her cry against him that causeth them to fall?"},
  {verse:16,text:"He that serveth the Lord shall be accepted with favour, and his prayer shall reach unto the clouds."},
  {verse:17,text:"The prayer of the humble pierceth the clouds: and till it come nigh, he will not be comforted; and will not depart, till the most High shall behold to judge righteously, and execute judgment."},
  {verse:18,text:"For the Lord will not be slack, neither will the Mighty be patient toward them, till he have smitten in sunder the loins of the unmerciful, and repayed vengeance to the heathen; till he have taken away the multitude of the proud, and broken the sceptre of the unrighteous;"},
  {verse:19,text:"Till he have rendered to every man according to his deeds, and to the works of men according to their devices; till he have judged the cause of his people, and made them to rejoice in his mercy."},
  {verse:20,text:"Mercy is seasonable in the time of affliction, as clouds of rain in the time of drought."}
];

lessons['Sirach 44:1-23'] = [
  {verse:1,text:"Let us now praise famous men, and our fathers that begat us."},
  {verse:2,text:"The Lord hath wrought great glory by them through his great power from the beginning."},
  {verse:3,text:"Such as did bear rule in their kingdoms, men renowned for their power, giving counsel by their understanding, and declaring prophecies:"},
  {verse:4,text:"Leaders of the people by their counsels, and by their knowledge of learning meet for the people, wise and eloquent are their instructions:"},
  {verse:5,text:"Such as found out musical tunes, and recited verses in writing:"},
  {verse:6,text:"Rich men furnished with ability, living peaceably in their habitations:"},
  {verse:7,text:"All these were honoured in their generations, and were the glory of their times."},
  {verse:8,text:"There be of them, that have left a name behind them, that their praises might be reported."},
  {verse:9,text:"And some there be, which have no memorial; who are perished, as though they had never been; and are become as though they had never been born; and their children after them."},
  {verse:10,text:"But these were merciful men, whose righteousness hath not been forgotten."},
  {verse:11,text:"With their seed shall continually remain a good inheritance, and their children are within the covenant."},
  {verse:12,text:"Their seed standeth fast, and their children for their sakes."},
  {verse:13,text:"Their seed shall remain for ever, and their glory shall not be blotted out."},
  {verse:14,text:"Their bodies are buried in peace; but their name liveth for evermore."},
  {verse:15,text:"The people will tell of their wisdom, and the congregation will shew forth their praise."},
  {verse:16,text:"Enoch pleased the Lord, and was translated, being an example of repentance to all generations."},
  {verse:17,text:"Noah was found perfect and righteous; in the time of wrath he was taken in exchange for the world; therefore was he left as a remnant unto the earth, when the flood came."},
  {verse:18,text:"An everlasting covenant was made with him, that all flesh should perish no more by the flood."},
  {verse:19,text:"Abraham was a great father of many people: in glory was there none like unto him;"},
  {verse:20,text:"Who kept the law of the most High, and was in covenant with him: he established the covenant in his flesh; and when he was proved, he was found faithful."},
  {verse:21,text:"Therefore he assured him by an oath, that he would bless the nations in his seed, and that he would multiply him as the dust of the earth, and exalt his seed as the stars, and cause them to inherit from sea to sea, and from the river unto the utmost part of the land."},
  {verse:22,text:"With Isaac did he establish likewise for Abraham his father's sake the blessing of all men, and the covenant,"},
  {verse:23,text:"And made it rest upon the head of Jacob. He acknowledged him in his blessing, and gave him an heritage, and divided his portions; among the twelve tribes did he part them."}
];

lessons['Tobit 2:1-23'] = [
  {verse:1,text:"Now when I was come home again, and my wife Anna was restored unto me, with my son Tobias, in the feast of Pentecost, which is the holy feast of the seven weeks, there was a good dinner prepared me, in the which I sat down to eat."},
  {verse:2,text:"And when I saw abundance of meat, I said to my son, Go and bring what poor man soever thou shalt find out of our brethren, who is mindful of the Lord; and, lo, I tarry for thee."},
  {verse:3,text:"But he came again, and said, Father, one of our nation is strangled, and is cast out in the marketplace."},
  {verse:4,text:"Then before I had tasted of any meat, I started up, and took him up into a room until the going down of the sun."},
  {verse:5,text:"Then I returned, and washed myself, and ate my meat in heaviness,"},
  {verse:6,text:"Remembering that prophecy of Amos, as he said, Your feasts shall be turned into mourning, and all your mirth into lamentation."},
  {verse:7,text:"Therefore I wept: and after the going down of the sun I went and made a grave, and buried him."},
  {verse:8,text:"But my neighbours mocked me, and said, This man is not yet afraid to be put to death for this matter: who fled away; and yet, lo, he burieth the dead again."},
  {verse:9,text:"The same night also I returned from the burial, and slept by the wall of my courtyard, being polluted and my face was uncovered:"},
  {verse:10,text:"And I knew not that there were sparrows in the wall, and mine eyes being open, the sparrows muted warm dung into mine eyes, and a whiteness came in mine eyes: and I went to the physicians, but they helped me not: moreover Achiacharus did nourish me, until I went into Elymais."},
  {verse:11,text:"And my wife Anna did take women's works to do."},
  {verse:12,text:"And when she had sent them home to the owners, they paid her wages, and gave her also besides a kid."},
  {verse:13,text:"And when it was in my house, and began to cry, I said unto her, From whence is this kid? is it not stolen? render it to the owners; for it is not lawful to eat any thing that is stolen."},
  {verse:14,text:"But she replied upon me, It was given for a gift more than the wages. Howbeit I did not believe her, but bade her render it to the owners: and I was abashed at her. But she replied upon me, Where are thine alms and thy righteous deeds? behold, thou and all thy works are known."}
];

lessons['Tobit 6:1-18'] = [
  {verse:1,text:"And as they went on their journey, they came in the evening to the river Tigris, and they lodged there."},
  {verse:2,text:"And when the young man went down to wash himself, a fish leaped out of the river, and would have devoured him."},
  {verse:3,text:"Then the angel said unto him, Take the fish. And the young man laid hold of the fish, and drew it to land."},
  {verse:4,text:"To whom the angel said, Open the fish, and take the heart and the liver and the gall, and put them up safely."},
  {verse:5,text:"So the young man did as the angel commanded him; and when they had roasted the fish, they did eat it: then they both went on their way, till they drew near to Ecbatane."},
  {verse:6,text:"Then the young man said to the angel, Brother Azarias, to what use is the heart and the liver and the gal of the fish?"},
  {verse:7,text:"And he said unto him, Touching the heart and the liver, if a devil or an evil spirit trouble any, we must make a smoke thereof before the man or the woman, and the party shall be no more vexed."},
  {verse:8,text:"As for the gall, it is good to anoint a man that hath whiteness in his eyes, and he shall be healed."},
  {verse:9,text:"And when they were come near to Rages,"},
  {verse:10,text:"The angel said to the young man, Brother, to day we shall lodge with Raguel, who is thy cousin; he also hath one only daughter, named Sara; I will speak for her, that she may be given thee for a wife."},
  {verse:11,text:"For to thee doth the right of her appertain, seeing thou only art of her kindred."},
  {verse:12,text:"And the maid is fair and wise: now therefore hear me, and I will speak to her father; and when we return from Rages we will celebrate the marriage: for I know that Raguel cannot marry her to another according to the law of Moses, but he shall be guilty of death, because the right of inheritance doth rather appertain to thee than to any other."},
  {verse:13,text:"Then the young man answered the angel, I have heard, brother Azarias that this maid hath been given to seven men, who all died in the marriage chamber."},
  {verse:14,text:"And now I am the only son of my father, and I am afraid, lest if I go in unto her, I die, as the other before: for a wicked spirit loveth her, which hurteth no body, but those which come unto her; wherefore I also fear lest I die, and bring my father's and my mother's life because of me to the grave with sorrow: for they have no other son to bury them."},
  {verse:15,text:"Then the angel said unto him, Dost thou not remember the precepts which thy father gave thee, that thou shouldest marry a wife of thine own kindred? wherefore hear me, O my brother; for she shall be given thee to wife; and make thou no reckoning of the evil spirit; for this same night shall she be given thee in marriage."},
  {verse:16,text:"And when thou shalt come into the marriage chamber, thou shalt take the ashes of perfume, and shalt lay upon them some of the heart and liver of the fish, and shalt make a smoke with it:"},
  {verse:17,text:"And the devil shall smell it, and flee away, and never come again any more: but when thou shalt come to her, rise up both of you, and pray to God which is merciful, who will have pity on you, and save you: fear not, for she is appointed unto thee from the beginning; and thou shalt preserve her, and she shall go with thee. Moreover I suppose that she shall bear thee children. Now when Tobias had heard these things, he loved her, and his heart was effectually joined to her."}
];

// Tobit 10:1-12 (ch 10) + Tobit 11:1-19 (ch 11) — combined
lessons['Tobit 10:1-13; 11:1-20'] = [
  {verse:1,text:"Now Tobit his father counted every day: and when the days of the journey were expired, and they came not,"},
  {verse:2,text:"Then Tobit said, Are they detained? or is Gabael dead, and there is no man to give him the money?"},
  {verse:3,text:"Therefore he was very sorry."},
  {verse:4,text:"Then his wife said unto him, My son is dead, seeing he stayeth long; and she began to wail him, and said,"},
  {verse:5,text:"Now I care for nothing, my son, since I have let thee go, the light of mine eyes."},
  {verse:6,text:"To whom Tobit said, Hold thy peace, take no care, for he is safe."},
  {verse:7,text:"But she said, Hold thy peace, and deceive me not; my son is dead. And she went out every day into the way which they went, and did eat no meat on the daytime, and ceased not whole nights to bewail her son Tobias, until the fourteen days of the wedding were expired, which Raguel had sworn that he should spend there. Then Tobias said to Raguel, Let me go, for my father and my mother look no more to see me."},
  {verse:8,text:"But his father in law said unto him, Tarry with me, and I will send to thy father, and they shall declare unto him how things go with thee."},
  {verse:9,text:"But Tobias said, No; but let me go to my father."},
  {verse:10,text:"Then Raguel arose, and gave him Sara his wife, and half his goods, servants, and cattle, and money:"},
  {verse:11,text:"And he blessed them, and sent them away, saying, The God of heaven give you a prosperous journey, my children."},
  {verse:12,text:"And he said to his daughter, Honour thy father and thy mother in law, which are now thy parents, that I may hear good report of thee. And he kissed her. Edna also said to Tobias, The Lord of heaven restore thee, my dear brother, and grant that I may see thy children of my daughter Sara before I die, that I may rejoice before the Lord: behold, I commit my daughter unto thee of special trust; where are do not entreat her evil."},
  {verse:13,text:"After these things Tobias went his way, praising God that he had given him a prosperous journey, and blessed Raguel and Edna his wife, and went on his way till they drew near unto Nineve."},
  {verse:14,text:"Then Raphael said to Tobias, Thou knowest, brother, how thou didst leave thy father:"},
  {verse:15,text:"Let us haste before thy wife, and prepare the house."},
  {verse:16,text:"And take in thine hand the gall of the fish. So they went their way, and the dog went after them."},
  {verse:17,text:"Now Anna sat looking about toward the way for her son."},
  {verse:18,text:"And when she espied him coming, she said to his father, Behold, thy son cometh, and the man that went with him."},
  {verse:19,text:"Then said Raphael, I know, Tobias, that thy father will open his eyes."},
  {verse:20,text:"Therefore anoint thou his eyes with the gall, and being pricked therewith, he shall rub, and the whiteness shall fall away, and he shall see thee."},
  {verse:21,text:"Then Anna ran forth, and fell upon the neck of her son, and said unto him, Seeing I have seen thee, my son, from henceforth I am content to die. And they wept both."},
  {verse:22,text:"Tobit also went forth toward the door, and stumbled: but his son ran unto him,"},
  {verse:23,text:"And took hold of his father: and he strake of the gall on his fathers' eyes, saying, Be of good hope, my father."},
  {verse:24,text:"And when his eyes began to smart, he rubbed them;"},
  {verse:25,text:"And the whiteness pilled away from the corners of his eyes: and when he saw his son, he fell upon his neck."},
  {verse:26,text:"And he wept, and said, Blessed art thou, O God, and blessed is thy name for ever; and blessed are all thine holy angels:"},
  {verse:27,text:"For thou hast scourged, and hast taken pity on me: for, behold, I see my son Tobias. And his son went in rejoicing, and told his father the great things that had happened to him in Media."},
  {verse:28,text:"Then Tobit went out to meet his daughter in law at the gate of Nineve, rejoicing and praising God: and they which saw him go marvelled, because he had received his sight."},
  {verse:29,text:"But Tobias gave thanks before them, because God had mercy on him. And when he came near to Sara his daughter in law, he blessed her, saying, Thou art welcome, daughter: God be blessed, which hath brought thee unto us, and blessed be thy father and thy mother. And there was joy among all his brethren which were at Nineve."},
  {verse:30,text:"And Achiacharus, and Nasbas his brother's son, came:"},
  {verse:31,text:"And Tobias' wedding was kept seven days with great joy."}
];

fs.writeFileSync(LESSONS_PATH, JSON.stringify(lessons), 'utf8');
const total = Object.keys(lessons).length;
console.log('Total lessons: ' + total + ' / 1068');
console.log('Sirach 35:1-26: ' + lessons['Sirach 35:1-26'].length + ' verses');
console.log('Sirach 44:1-23: ' + lessons['Sirach 44:1-23'].length + ' verses');
console.log('Tobit 2:1-23: ' + lessons['Tobit 2:1-23'].length + ' verses (KJV has 14)');
console.log('Tobit 6:1-18: ' + lessons['Tobit 6:1-18'].length + ' verses (KJV has 17)');
console.log('Tobit 10:1-13; 11:1-20: ' + lessons['Tobit 10:1-13; 11:1-20'].length + ' verses');
if (total === 1068) console.log('ALL 1068 LESSONS COMPLETE');
