// Builder script - run with node to generate psalms.json
// Coverdale Psalter (public domain) as used in 1928 American BCP

const GLORIA = "Glory be to the Father, and to the Son, * and to the Holy Ghost;\nAs it was in the beginning, is now, and ever shall be, * world without end. Amen.";

const psalms = {};

function p(num, subtitle, verses) {
  // verses: array of strings, each a full verse line like "1. text * more text"
  psalms[num] = {
    subtitle,
    text: verses.join("\n") + "\n" + GLORIA
  };
}

p(1, "Beatus vir qui non abiit", [
  "BLESSED is the man that hath not walked in the counsel of the ungodly, * nor stood in the way of sinners, and hath not sat in the seat of the scornful.",
  "2. But his delight is in the law of the LORD; * and in his law will he exercise himself day and night.",
  "3. And he shall be like a tree planted by the water-side, * that will bring forth his fruit in due season.",
  "4. His leaf also shall not wither; * and look, whatsoever he doeth, it shall prosper.",
  "5. As for the ungodly, it is not so with them; * but they are like the chaff, which the wind scattereth away from the face of the earth.",
  "6. Therefore the ungodly shall not be able to stand in the judgment, * neither the sinners in the congregation of the righteous.",
  "7. But the LORD knoweth the way of the righteous; * and the way of the ungodly shall perish."
]);

p(2, "Quare fremuerunt gentes", [
  "WHY do the heathen so furiously rage together, * and why do the people imagine a vain thing?",
  "2. The kings of the earth stand up, and the rulers take counsel together, * against the LORD, and against his Anointed.",
  "3. Let us break their bonds asunder, * and cast away their cords from us.",
  "4. He that dwelleth in heaven shall laugh them to scorn; * the Lord shall have them in derision.",
  "5. Then shall he speak unto them in his wrath, * and vex them in his sore displeasure.",
  "6. Yet have I set my King * upon my holy hill of Sion.",
  "7. I will preach the law, whereof the LORD hath said unto me, * Thou art my Son, this day have I begotten thee.",
  "8. Desire of me, and I shall give thee the heathen for thine inheritance, * and the utmost parts of the earth for thy possession.",
  "9. Thou shalt bruise them with a rod of iron, * and break them in pieces like a potter's vessel.",
  "10. Be wise now therefore, O ye kings; * be learned, ye that are judges of the earth.",
  "11. Serve the LORD in fear, * and rejoice unto him with reverence.",
  "12. Kiss the Son, lest he be angry, and so ye perish from the right way; * if his wrath be kindled, yea but a little, blessed are all they that put their trust in him."
]);

p(3, "Domine, quid multiplicati", [
  "LORD, how are they increased that trouble me! * many are they that rise against me.",
  "2. Many one there be that say of my soul, * There is no help for him in his God.",
  "3. But thou, O LORD, art my defender; * thou art my worship, and the lifter up of my head.",
  "4. I did call upon the LORD with my voice, * and he heard me out of his holy hill.",
  "5. I laid me down and slept, and rose up again; * for the LORD sustained me.",
  "6. I will not be afraid for ten thousands of the people, * that have set themselves against me round about.",
  "7. Up, LORD, and help me, O my God; * for thou smitest all mine enemies upon the cheek-bone; thou hast broken the teeth of the ungodly.",
  "8. Salvation belongeth unto the LORD; * and thy blessing is upon thy people."
]);

p(4, "Cum invocarem", [
  "HEAR me when I call, O God of my righteousness; * thou hast set me at liberty when I was in trouble; have mercy upon me, and hearken unto my prayer.",
  "2. O ye sons of men, how long will ye blaspheme mine honour, * and have such pleasure in vanity, and seek after leasing?",
  "3. Know this also, that the LORD hath chosen to himself the man that is godly; * when I call upon the LORD, he will hear me.",
  "4. Stand in awe, and sin not; * commune with your own heart, and in your chamber, and be still.",
  "5. Offer the sacrifice of righteousness, * and put your trust in the LORD.",
  "6. There be many that say, Who will shew us any good? * LORD, lift thou up the light of thy countenance upon us.",
  "7. Thou hast put gladness in my heart, * since the time that their corn and wine and oil increased.",
  "8. I will lay me down in peace, and take my rest; * for it is thou, LORD, only, that makest me dwell in safety."
]);

p(5, "Verba mea auribus", [
  "PONDER my words, O LORD, * consider my meditation.",
  "2. O hearken thou unto the voice of my calling, my King and my God; * for unto thee will I make my prayer.",
  "3. My voice shalt thou hear in the morning, O LORD; * in the morning will I direct my prayer unto thee, and will look up.",
  "4. For thou art the God that hast no pleasure in wickedness; * neither shall any evil dwell with thee.",
  "5. Such as be foolish shall not stand in thy sight; * for thou hatest all them that work vanity.",
  "6. Thou shalt destroy them that speak leasing; * the LORD will abhor both the blood-thirsty and deceitful man.",
  "7. But as for me, I will come into thine house, even upon the multitude of thy mercy; * and in thy fear will I worship toward thy holy temple.",
  "8. Lead me, O LORD, in thy righteousness, because of mine enemies; * make thy way plain before my face.",
  "9. For there is no faithfulness in his mouth; * their inward parts are very wickedness.",
  "10. Their throat is an open sepulchre; * they flatter with their tongue.",
  "11. Destroy thou them, O God; let them perish through their own imaginations; * cast them out in the multitude of their ungodliness; for they have rebelled against thee.",
  "12. And let all them that put their trust in thee rejoice; * they shall ever be giving of thanks, because thou defendest them; they that love thy Name shall be joyful in thee.",
  "13. For thou, LORD, wilt give thy blessing unto the righteous; * and with thy favourable kindness wilt thou defend him as with a shield."
]);

p(6, "Domine, ne in furore", [
  "O LORD, rebuke me not in thine indignation, * neither chasten me in thy displeasure.",
  "2. Have mercy upon me, O LORD, for I am weak; * O LORD, heal me, for my bones are vexed.",
  "3. My soul also is sore troubled; * but, LORD, how long wilt thou punish me?",
  "4. Turn thee, O LORD, and deliver my soul; * O save me for thy mercy's sake.",
  "5. For in death no man remembereth thee; * and who will give thee thanks in the pit?",
  "6. I am weary of my groaning; every night wash I my bed, * and water my couch with my tears.",
  "7. My beauty is gone for very trouble, * and worn away because of all mine enemies.",
  "8. Away from me, all ye that work vanity; * for the LORD hath heard the voice of my weeping.",
  "9. The LORD hath heard my petition; * the LORD will receive my prayer.",
  "10. All mine enemies shall be confounded, and sore vexed; * they shall be turned back, and put to shame suddenly."
]);

p(7, "Domine, Deus meus", [
  "O LORD my God, in thee have I put my trust; * save me from all them that persecute me, and deliver me.",
  "2. Lest he devour my soul, like a lion, * and tear it in pieces, while there is none to help.",
  "3. O LORD my God, if I have done any such thing, * or if there be any wickedness in my hands;",
  "4. If I have rewarded evil unto him that dealt friendly with me, * yea, I have delivered him that without any cause is mine enemy;",
  "5. Then let mine enemy persecute my soul, and take me; * yea, let him tread my life down upon the earth, and lay mine honour in the dust.",
  "6. Stand up, O LORD, in thy wrath, and lift up thyself, because of the indignation of mine enemies; * arise up for me in the judgement that thou hast commanded.",
  "7. And so shall the congregation of the people come about thee; * for their sakes therefore lift up thyself again.",
  "8. The LORD shall judge the people; * give sentence with me, O LORD, according to my righteousness, and according to the innocency that is in me.",
  "9. O let the wickedness of the ungodly come to an end; but guide thou the just; * for the righteous God trieth the very hearts and reins.",
  "10. My help cometh of God, * who preserveth them that are true of heart.",
  "11. God is a righteous Judge, strong and patient; * and God is provoked every day.",
  "12. If a man will not turn, he will whet his sword; * he hath bent his bow, and made it ready.",
  "13. He hath prepared for him the instruments of death; * he ordaineth his arrows against the persecutors.",
  "14. Behold, he travaileth with iniquity; he hath conceived mischief, and brought forth falsehood. * he hath graven and digged up a pit, and is fallen himself into the destruction that he made for other.",
  "15. For his travail shall come upon his own head, * and his wickedness shall fall on his own pate.",
  "16. I will give thanks unto the LORD, according to his righteousness; * and I will praise the Name of the LORD most High."
]);

p(8, "Domine, Dominus noster", [
  "O LORD our Governor, * how excellent is thy Name in all the world; thou that hast set thy glory above the heavens!",
  "2. Out of the mouth of very babes and sucklings hast thou ordained strength, because of thine enemies, * that thou mightest still the enemy, and the avenger.",
  "3. For I will consider thy heavens, even the works of thy fingers; * the moon and the stars, which thou hast ordained.",
  "4. What is man, that thou art mindful of him? * and the son of man, that thou visitest him?",
  "5. Thou madest him lower than the angels, * to crown him with glory and worship.",
  "6. Thou makest him to have dominion of the works of thy hands; * and thou hast put all things in subjection under his feet:",
  "7. All sheep and oxen; * yea, and the beasts of the field;",
  "8. The fowls of the air, and the fishes of the sea; * and whatsoever walketh through the paths of the seas.",
  "9. O LORD our Governor, * how excellent is thy Name in all the world!"
]);

p(9, "Confitebor tibi", [
  "I WILL give thanks unto thee, O LORD, with my whole heart; * I will speak of all thy marvellous works.",
  "2. I will be glad and rejoice in thee; * yea, my songs will I make of thy Name, O thou most Highest.",
  "3. While mine enemies are driven back, * they shall fall and perish at thy presence.",
  "4. For thou hast maintained my right and my cause; * thou art set in the throne that judgest right.",
  "5. Thou hast rebuked the heathen, and destroyed the ungodly; * thou hast put out their name for ever and ever.",
  "6. O thou enemy, destructions are come to a perpetual end; * even as the cities which thou hast destroyed, their memorial is perished with them.",
  "7. But the LORD shall endure for ever; * he hath also prepared his seat for judgement.",
  "8. For he shall judge the world in righteousness, * and minister true judgement unto the people.",
  "9. The LORD also will be a defence for the oppressed, * even a refuge in due time of trouble.",
  "10. And they that know thy Name will put their trust in thee; * for thou, LORD, hast never failed them that seek thee.",
  "11. O praise the LORD which dwelleth in Sion; * shew the people of his doings.",
  "12. For, when he maketh inquisition for blood, he remembereth them; * and forgetteth not the complaint of the poor.",
  "13. Have mercy upon me, O LORD; consider the trouble which I suffer of them that hate me, * thou that liftest me up from the gates of death.",
  "14. That I may shew all thy praises within the ports of the daughter of Sion; * I will rejoice in thy salvation.",
  "15. The heathen are sunk down in the pit that they made; * in the same net which they hid privily is their foot taken.",
  "16. The LORD is known to execute judgement; * the ungodly is trapped in the work of his own hands.",
  "17. The wicked shall be turned into hell, * and all the people that forget God.",
  "18. For the poor shall not alway be forgotten; * the patient abiding of the meek shall not perish for ever.",
  "19. Up, LORD, and let not man have the upper hand; * let the heathen be judged in thy sight.",
  "20. Put them in fear, O LORD, * that the heathen may know themselves to be but men."
]);

p(10, "Ut quid, Domine", [
  "WHY standest thou so far off, O LORD, * and hidest thy face in the needful time of trouble?",
  "2. The ungodly for his own lust doth persecute the poor; * let them be taken in the crafty wiliness that they have imagined.",
  "3. For the ungodly hath made boast of his own heart's desire, * and speaketh good of the covetous, whom God abhorreth.",
  "4. The ungodly is so proud, that he careth not for God; * neither is God in all his thoughts.",
  "5. His ways are always grievous; * thy judgements are far above out of his sight, and therefore defieth he all his enemies.",
  "6. For he hath said in his heart, Tush, I shall never be cast down; * there shall no harm happen unto me.",
  "7. His mouth is full of cursing, deceit, and fraud; * under his tongue is ungodliness and vanity.",
  "8. He sitteth lurking in the thievish corners of the streets, * and privily in his lurking dens doth he murder the innocent; his eyes are set against the poor.",
  "9. For he lieth waiting secretly, even as a lion lurketh he in his den, * that he may ravish the poor.",
  "10. He doth ravish the poor, when he getteth him into his net. * He falleth down, and humbleth himself, that the congregation of the poor may fall into the hands of his captains.",
  "11. He hath said in his heart, Tush, God hath forgotten; * he hideth away his face, and he will never see it.",
  "12. Arise, O LORD God, and lift up thine hand; * forget not the poor.",
  "13. Wherefore should the wicked blaspheme God, * while he doth say in his heart, Tush, thou God carest not for it.",
  "14. Surely thou hast seen it; * for thou beholdest ungodliness and wrong.",
  "15. That thou mayest take the matter into thy hand; * the poor committeth himself unto thee; for thou art the helper of the friendless.",
  "16. Break thou the power of the ungodly and malicious; * take away his ungodliness, and thou shalt find none.",
  "17. The LORD is King for ever and ever; * and the heathen are perished out of the land.",
  "18. LORD, thou hast heard the desire of the poor; * thou preparest their heart, and thine ear hearkeneth thereto.",
  "19. To help the fatherless and poor unto their right, * that the man of the earth be no more exalted against them."
]);

p(11, "In Domino confido", [
  "IN the LORD put I my trust; * how say ye then to my soul, that she should flee as a bird unto the hill?",
  "2. For lo, the ungodly bend their bow, and make ready their arrows within the quiver, * that they may privily shoot at them which are true of heart.",
  "3. For the foundations will be cast down, * and what hath the righteous done?",
  "4. The LORD is in his holy temple; * the LORD's seat is in heaven.",
  "5. His eyes consider the poor, * and his eyelids try the children of men.",
  "6. The LORD alloweth the righteous; * but the ungodly, and him that delighteth in wickedness, doth his soul abhor.",
  "7. Upon the ungodly he shall rain snares, fire and brimstone, storm and tempest; * this shall be their portion to drink.",
  "8. For the righteous LORD loveth righteousness; * his countenance will behold the thing that is just."
]);

p(12, "Salvum me fac", [
  "HELP me, LORD, for there is not one godly man left; * for the faithful are minished from among the children of men.",
  "2. They talk of vanity every one with his neighbour; * they do but flatter with their lips, and dissemble in their double heart.",
  "3. The LORD shall root out all deceitful lips, * and the tongue that speaketh proud things.",
  "4. Which have said, With our tongue will we prevail; * we are they that ought to speak, who is lord over us?",
  "5. Now for the comfortless troubles' sake of the needy, * and because of the deep sighing of the poor,",
  "6. I will up, saith the LORD, * and will help every one from him that swelleth against him, and will set him at rest.",
  "7. The words of the LORD are pure words, * even as the silver, which from the earth is tried, and purified seven times in the fire.",
  "8. Thou shalt keep them, O LORD; * thou shalt preserve him from this generation for ever.",
  "9. The ungodly walk on every side, * when they are exalted, the children of men are put to rebuke."
]);

p(13, "Usquequo, Domine", [
  "HOW long wilt thou forget me, O LORD, for ever? * how long wilt thou hide thy face from me?",
  "2. How long shall I seek counsel in my soul, and be so vexed in my heart? * how long shall mine enemy triumph over me?",
  "3. Consider, and hear me, O LORD my God; * lighten mine eyes, that I sleep not in death.",
  "4. Lest mine enemy say, I have prevailed against him; * for if I be cast down, they that trouble me will rejoice at it.",
  "5. But my trust is in thy mercy; * and my heart is joyful in thy salvation.",
  "6. I will sing of the LORD, because he hath dealt so lovingly with me; * yea, I will praise the Name of the LORD most Highest."
]);

p(14, "Dixit insipiens", [
  "THE fool hath said in his heart, * There is no God.",
  "2. They are corrupt, and become abominable in their doings; * there is none that doeth good, no not one.",
  "3. The LORD looked down from heaven upon the children of men, * to see if there were any that would understand and seek after God.",
  "4. But they are all gone out of the way; they are altogether become abominable; * there is none that doeth good, no not one.",
  "5. Their throat is an open sepulchre, with their tongues have they deceived; * the poison of asps is under their lips.",
  "6. Their mouth is full of cursing and bitterness; their feet are swift to shed blood. * Destruction and unhappiness is in their ways, and the way of peace have they not known; there is no fear of God before their eyes.",
  "7. Have they no knowledge, that they are all such workers of mischief, * eating up my people as it were bread, and call not upon the LORD?",
  "8. There were they brought in great fear; * even where no fear was; for God is in the generation of the righteous.",
  "9. As for you, ye have made a mock at the counsel of the poor, * because he putteth his trust in the LORD.",
  "10. Who shall give salvation unto Israel out of Sion? * When the LORD turneth the captivity of his people, then shall Jacob rejoice, and Israel shall be glad."
]);

p(15, "Domine, quis habitabit", [
  "LORD, who shall dwell in thy tabernacle? * or who shall rest upon thy holy hill?",
  "2. Even he that leadeth an uncorrupt life, * and doeth the thing which is right, and speaketh the truth from his heart.",
  "3. He that hath used no deceit in his tongue, nor done evil to his neighbour, * and hath not slandered his neighbour.",
  "4. He that setteth not by himself, but is lowly in his own eyes, * and maketh much of them that fear the LORD.",
  "5. He that sweareth unto his neighbour, and disappointeth him not, * though it were to his own hindrance.",
  "6. He that hath not given his money upon usury, * nor taken reward against the innocent.",
  "7. Whoso doeth these things * shall never fall."
]);

p(16, "Conserva me, Domine", [
  "PRESERVE me, O God, for in thee have I put my trust. * O my soul, thou hast said unto the LORD, Thou art my God; my goods are nothing unto thee.",
  "2. All my delight is upon the saints that are in the earth, * and upon such as excel in virtue.",
  "3. But they that run after another god * shall have great trouble.",
  "4. Their drink-offerings of blood will I not offer, * neither make mention of their names within my lips.",
  "5. The LORD himself is the portion of mine inheritance, and of my cup; * thou shalt maintain my lot.",
  "6. The lot is fallen unto me in a fair ground; * yea, I have a goodly heritage.",
  "7. I will thank the LORD for giving me warning; * my reins also chasten me in the night-season.",
  "8. I have set God always before me; * for he is on my right hand, therefore I shall not fall.",
  "9. Wherefore my heart was glad, and my glory rejoiced; * my flesh also shall rest in hope.",
  "10. For why? thou shalt not leave my soul in hell, * neither shalt thou suffer thy Holy One to see corruption.",
  "11. Thou shalt shew me the path of life; in thy presence is the fulness of joy, * and at thy right hand there is pleasure for evermore."
]);

p(17, "Exaudi, Domine", [
  "HEAR the right, O LORD, consider my complaint, * and hearken unto my prayer, that goeth not out of feigned lips.",
  "2. Let my sentence come forth from thy presence, * and let thine eyes look upon the thing that is equal.",
  "3. Thou hast proved and visited mine heart in the night-season; thou hast tried me, and shalt find no wickedness in me; * for I am utterly purposed that my mouth shall not offend.",
  "4. Because of men's works, that are done against the words of thy lips, * I have kept me from the ways of the destroyer.",
  "5. O hold thou up my goings in thy paths, * that my footsteps slip not.",
  "6. I have called upon thee, O God, for thou shalt hear me; * incline thine ear to me, and hearken unto my words.",
  "7. Shew thy marvellous loving-kindness, thou that art the Saviour of them which put their trust in thee, * from such as resist thy right hand.",
  "8. Keep me as the apple of an eye; * hide me under the shadow of thy wings.",
  "9. From the ungodly that trouble me; * mine enemies compass me round about to take away my soul.",
  "10. They are inclosed in their own fat, * and their mouth speaketh proud things.",
  "11. They lie waiting in our way on every side, * turning their eyes down to the ground.",
  "12. Like as a lion that is greedy of his prey, * and as it were a lion's whelp lurking in secret places.",
  "13. Up, LORD, disappoint him, and cast him down; * deliver my soul from the ungodly, which is a sword of thine.",
  "14. From men which are thy hand, O LORD, from men of the world, * which have their portion in this life, whose bellies thou fillest with thy treasure.",
  "15. They have children at their desire, * and leave the rest of their substance for their babes.",
  "16. But as for me, I will behold thy presence in righteousness; * and when I awake up after thy likeness, I shall be satisfied with it."
]);

p(18, "Diligam te, Domine", [
  "I WILL love thee, O LORD, my strength; * the LORD is my stony rock, and my defence; my Saviour, my God, and my might, in whom I will trust; my buckler, the horn also of my salvation, and my refuge.",
  "2. I will call upon the LORD, which is worthy to be praised; * so shall I be safe from mine enemies.",
  "3. The sorrows of death compassed me, * and the overflowings of ungodliness made me afraid.",
  "4. The pains of hell came about me; * the snares of death overtook me.",
  "5. In my trouble I will call upon the LORD, * and complain unto my God.",
  "6. So shall he hear my voice out of his holy temple, * and my complaint shall come before him; it shall enter even into his ears.",
  "7. The earth trembled and quaked; the very foundations also of the hills shook, and were removed, * because he was wroth.",
  "8. There went a smoke out in his presence, and a consuming fire out of his mouth, * so that coals were kindled at it.",
  "9. He bowed the heavens also, and came down, * and it was dark under his feet.",
  "10. He rode upon the cherubins, and did fly; * he came flying upon the wings of the wind.",
  "11. He made darkness his secret place; * his pavilion round about him with dark water, and thick clouds to cover him.",
  "12. At the brightness of his presence his clouds removed, * hailstones and coals of fire.",
  "13. The LORD also thundered out of heaven, and the Highest gave his thunder; * hailstones and coals of fire.",
  "14. He sent out his arrows and scattered them; * he cast forth lightnings and destroyed them.",
  "15. The springs of waters were seen, and the foundations of the round world were discovered, at thy chiding, O LORD, * at the blasting of the breath of thy displeasure.",
  "16. He shall send down from on high to fetch me, * and shall take me out of many waters.",
  "17. He shall deliver me from my strongest enemy, and from them which hate me; * for they are too mighty for me.",
  "18. They prevented me in the day of my trouble; * but the LORD was my upholder.",
  "19. He brought me forth also into a place of liberty; * he brought me forth, even because he had a favour unto me.",
  "20. The LORD shall reward me after my righteous dealing; * according to the cleanness of my hands shall he recompense me.",
  "21. Because I have kept the ways of the LORD, * and have not forsaken my God, as the wicked doth.",
  "22. For I have an eye unto all his laws, * and will not cast out his commandments from me.",
  "23. I was also uncorrupt before him, * and eschewed mine own wickedness.",
  "24. Therefore shall the LORD reward me after my righteous dealing, * and according unto the cleanness of my hands in his eye-sight.",
  "25. With the holy thou shalt be holy; * and with a perfect man thou shalt be perfect.",
  "26. With the clean thou shalt be clean; * and with the froward thou shalt learn frowardness.",
  "27. For thou shalt save the people that are in adversity, * and shalt bring down the high looks of the proud.",
  "28. Thou also shalt light my candle; * the LORD my God shall make my darkness to be light.",
  "29. For in thee I shall discomfit an host of men; * and with the help of my God I shall leap over the wall.",
  "30. The way of God is an undefiled way; the word of the LORD also is tried in the fire; * he is the defender of all them that put their trust in him.",
  "31. For who is God, but the LORD? * or who hath any strength, except our God?",
  "32. It is God that girdeth me with strength of war, * and maketh my way perfect.",
  "33. He maketh my feet like harts' feet, * and setteth me up on high.",
  "34. He teacheth mine hands to fight, * and mine arms shall bend even a bow of steel.",
  "35. Thou hast given me the defence of thy salvation; * thy right hand also shall hold me up, and thy loving correction shall make me great.",
  "36. Thou shalt make room enough under me for to go; * and my steps shall not slide.",
  "37. I will follow upon mine enemies, and overtake them; * neither will I turn again till I have destroyed them.",
  "38. I will smite them, that they shall not be able to stand; * but fall under my feet.",
  "39. Thou hast girded me with strength unto the battle; * thou shalt throw down mine enemies under me.",
  "40. Thou hast made mine enemies also to turn their backs upon me; * and I shall destroy them that hate me.",
  "41. They shall cry, but there shall be none to help them; * yea, even unto the LORD shall they cry, but he shall not hear them.",
  "42. I will beat them as small as the dust before the wind; * I will cast them out as the clay in the streets.",
  "43. Thou shalt deliver me from the strivings of the people; * and thou shalt make me the head of the heathen.",
  "44. A people whom I have not known * shall serve me.",
  "45. As soon as they hear of me, they shall obey me; * but the strange children shall dissemble with me.",
  "46. The strange children shall fail, * and be afraid out of their prisons.",
  "47. The LORD liveth; and blessed be my strong helper; * and praised be the God of my salvation.",
  "48. Even the God that seeth that I be avenged, * and subdueth the people unto me.",
  "49. It is he that delivereth me from my cruel enemies, and setteth me up above mine adversaries, * and rid me from the wicked man.",
  "50. For this cause will I give thanks unto thee, O LORD, among the Gentiles, * and sing praises unto thy Name.",
  "51. Great prosperity giveth he unto his King, * and sheweth loving-kindness unto David his Anointed, and unto his seed for evermore."
]);

p(19, "Caeli enarrant", [
  "THE heavens declare the glory of God; * and the firmament sheweth his handy-work.",
  "2. One day telleth another; * and one night certifieth another.",
  "3. There is neither speech nor language, * but their voices are heard among them.",
  "4. Their sound is gone out into all lands, * and their words into the ends of the world.",
  "5. In them hath he set a tabernacle for the sun, * which cometh forth as a bridegroom out of his chamber, and rejoiceth as a giant to run his course.",
  "6. It goeth forth from the uttermost part of the heaven, and runneth about unto the end of it again; * and there is nothing hid from the heat thereof.",
  "7. The law of the LORD is an undefiled law, converting the soul; * the testimony of the LORD is sure, and giveth wisdom unto the simple.",
  "8. The statutes of the LORD are right, and rejoice the heart; * the commandment of the LORD is pure, and giveth light unto the eyes.",
  "9. The fear of the LORD is clean, and endureth for ever; * the judgements of the LORD are true, and righteous altogether.",
  "10. More to be desired are they than gold, yea, than much fine gold; * sweeter also than honey, and the honey-comb.",
  "11. Moreover, by them is thy servant taught; * and in keeping of them there is great reward.",
  "12. Who can tell how oft he offendeth? * O cleanse thou me from my secret faults.",
  "13. Keep thy servant also from presumptuous sins, lest they get the dominion over me; * so shall I be undefiled, and innocent from the great offence.",
  "14. Let the words of my mouth, and the meditation of my heart, * be alway acceptable in thy sight,",
  "15. O LORD, * my strength, and my redeemer."
]);

p(20, "Exaudiat te Dominus", [
  "THE LORD hear thee in the day of trouble; * the Name of the God of Jacob defend thee.",
  "2. Send thee help from the sanctuary, * and strengthen thee out of Sion.",
  "3. Remember all thy offerings, * and accept thy burnt sacrifice.",
  "4. Grant thee thy heart's desire, * and fulfil all thy mind.",
  "5. We will rejoice in thy salvation, and triumph in the Name of the LORD our God; * the LORD perform all thy petitions.",
  "6. Now know I that the LORD helpeth his Anointed, and will hear him from his holy heaven, * even with the wholesome strength of his right hand.",
  "7. Some put their trust in chariots, and some in horses; * but we will remember the Name of the LORD our God.",
  "8. They are brought down and fallen; * but we are risen, and stand upright.",
  "9. Save, LORD, * and hear us, O King of heaven, when we call upon thee."
]);

p(21, "Domine, in virtute tua", [
  "THE King shall rejoice in thy strength, O LORD; * exceeding glad shall he be of thy salvation.",
  "2. Thou hast given him his heart's desire, * and hast not denied him the request of his lips.",
  "3. For thou shalt prevent him with the blessings of goodness, * and shalt set a crown of pure gold upon his head.",
  "4. He asked life of thee, and thou gavest him a long life, * even for ever and ever.",
  "5. His honour is great in thy salvation; * glory and great worship shalt thou lay upon him.",
  "6. For thou shalt give him everlasting felicity, * and make him glad with the joy of thy countenance.",
  "7. And why? because the King putteth his trust in the LORD; * and in the mercy of the most Highest he shall not miscarry.",
  "8. All thine enemies shall feel thine hand; * thy right hand shall find out them that hate thee.",
  "9. Thou shalt make them like a fiery oven in time of thy wrath; * the LORD shall destroy them in his displeasure, and the fire shall consume them.",
  "10. Their fruit shalt thou root out of the earth, * and their seed from among the children of men.",
  "11. For they intended mischief against thee, * and imagined such a device as they are not able to perform.",
  "12. Therefore shalt thou put them to flight, * and the strings of thy bow shalt thou make ready against the face of them.",
  "13. Be thou exalted, LORD, in thine own strength; * so will we sing and praise thy power."
]);

p(22, "Deus, Deus meus", [
  "MY God, my God, look upon me; why hast thou forsaken me? * and art so far from my health, and from the words of my complaint?",
  "2. O my God, I cry in the day-time, but thou hearest not; * and in the night-season also I take no rest.",
  "3. And thou continuest holy, * O thou worship of Israel.",
  "4. Our fathers hoped in thee; * they trusted in thee, and thou didst deliver them.",
  "5. They called upon thee, and were holpen; * they put their trust in thee, and were not confounded.",
  "6. But as for me, I am a worm, and no man; * a very scorn of men, and the outcast of the people.",
  "7. All they that see me laugh me to scorn; * they shoot out their lips, and shake their heads, saying,",
  "8. He trusted in God, that he would deliver him; * let him deliver him, if he will have him.",
  "9. But thou art he that took me out of my mother's womb; * thou wast my hope, when I hanged yet upon my mother's breasts.",
  "10. I have been left unto thee ever since I was born; * thou art my God even from my mother's womb.",
  "11. O go not from me, for trouble is hard at hand; * and there is none to help me.",
  "12. Many oxen are come about me; * fat bulls of Basan close me in on every side.",
  "13. They gape upon me with their mouths, * as it were a ramping and a roaring lion.",
  "14. I am poured out like water, and all my bones are out of joint; * my heart also in the midst of my body is even like melting wax.",
  "15. My strength is dried up like a potsherd; my tongue cleaveth to my gums; * and thou shalt bring me into the dust of death.",
  "16. For many dogs are come about me, * and the council of the wicked layeth siege against me.",
  "17. They pierced my hands and my feet; I may tell all my bones; * they stand staring and looking upon me.",
  "18. They part my garments among them, * and cast lots upon my vesture.",
  "19. But be not thou far from me, O LORD; * thou art my succour, haste thee to help me.",
  "20. Deliver my soul from the sword, * my darling from the power of the dog.",
  "21. Save me from the lion's mouth; * thou hast heard me also from among the horns of the unicorns.",
  "22. I will declare thy Name unto my brethren; * in the midst of the congregation will I praise thee.",
  "23. O praise the LORD, ye that fear him; magnify him, all ye of the seed of Jacob, and fear him, * all ye seed of Israel.",
  "24. For he hath not despised nor abhorred the low estate of the poor; he hath not hid his face from him; * but when he called unto him, he heard him.",
  "25. My praise is of thee in the great congregation; * my vows will I perform in their sight that fear him.",
  "26. The poor shall eat, and be satisfied; they that seek after the LORD shall praise him; * your heart shall live for ever.",
  "27. All the ends of the world shall remember themselves, and be turned unto the LORD; * and all the kindreds of the nations shall worship before him.",
  "28. For the kingdom is the LORD's; * and he is the Governor among the people.",
  "29. All such as be fat upon earth have eaten and worshipped; * all they that go down into the dust shall kneel before him; and no man hath quickened his own soul.",
  "30. My seed shall serve him; * they shall be counted unto the LORD for a generation.",
  "31. They shall come, and the heavens shall declare his righteousness, * unto a people that shall be born, whom the LORD hath made."
]);

p(23, "Dominus regit me", [
  "THE LORD is my shepherd; * therefore can I lack nothing.",
  "2. He shall feed me in a green pasture, * and lead me forth beside the waters of comfort.",
  "3. He shall convert my soul, * and bring me forth in the paths of righteousness, for his Name's sake.",
  "4. Yea, though I walk through the valley of the shadow of death, I will fear no evil; * for thou art with me; thy rod and thy staff comfort me.",
  "5. Thou shalt prepare a table before me against them that trouble me; * thou hast anointed my head with oil, and my cup shall be full.",
  "6. But thy loving-kindness and mercy shall follow me all the days of my life; * and I will dwell in the house of the LORD for ever."
]);

p(24, "Domini est terra", [
  "THE earth is the LORD's, and all that therein is; * the compass of the world, and they that dwell therein.",
  "2. For he hath founded it upon the seas, * and prepared it upon the floods.",
  "3. Who shall ascend into the hill of the LORD? * or who shall rise up in his holy place?",
  "4. Even he that hath clean hands, and a pure heart; * and that hath not lift up his mind unto vanity, nor sworn to deceive his neighbour.",
  "5. He shall receive the blessing from the LORD, * and righteousness from the God of his salvation.",
  "6. This is the generation of them that seek him; * even of them that seek thy face, O Jacob.",
  "7. Lift up your heads, O ye gates, and be ye lift up, ye everlasting doors; * and the King of glory shall come in.",
  "8. Who is the King of glory? * It is the LORD strong and mighty, even the LORD mighty in battle.",
  "9. Lift up your heads, O ye gates, and be ye lift up, ye everlasting doors; * and the King of glory shall come in.",
  "10. Who is the King of glory? * even the LORD of hosts, he is the King of glory."
]);

p(25, "Ad te, Domine, levavi", [
  "UNTO thee, O LORD, will I lift up my soul; my God, I have put my trust in thee; * O let me not be confounded, neither let mine enemies triumph over me.",
  "2. For all they that hope in thee shall not be ashamed; * but such as transgress without a cause shall be put to confusion.",
  "3. Shew me thy ways, O LORD, * and teach me thy paths.",
  "4. Lead me forth in thy truth, and learn me; * for thou art the God of my salvation; in thee hath been my hope all the day long.",
  "5. Call to remembrance, O LORD, thy tender mercies, * and thy loving-kindnesses, which have been ever of old.",
  "6. O remember not the sins and offences of my youth; * but according to thy mercy think thou upon me, O LORD, for thy goodness.",
  "7. Gracious and righteous is the LORD; * therefore will he teach sinners in the way.",
  "8. Them that are meek shall he guide in judgement; * and such as are gentle, them shall he learn his way.",
  "9. All the paths of the LORD are mercy and truth, * unto such as keep his covenant and his testimonies.",
  "10. For thy Name's sake, O LORD, * be merciful unto my sin; for it is great.",
  "11. What man is he that feareth the LORD? * him shall he teach in the way that he shall choose.",
  "12. His soul shall dwell at ease; * and his seed shall inherit the land.",
  "13. The secret of the LORD is among them that fear him; * and he will shew them his covenant.",
  "14. Mine eyes are ever looking unto the LORD; * for he shall pluck my feet out of the net.",
  "15. Turn thee unto me, and have mercy upon me; * for I am desolate and in misery.",
  "16. The sorrows of my heart are enlarged; * O bring thou me out of my troubles.",
  "17. Look upon my adversity and misery, * and forgive me all my sin.",
  "18. Consider mine enemies, how many they are; * and they bear a tyrannous hate against me.",
  "19. O keep my soul, and deliver me; * let me not be confounded, for I have put my trust in thee.",
  "20. Let perfectness and righteous dealing wait upon me; * for my hope hath been in thee.",
  "21. Deliver Israel, O God, * out of all his troubles."
]);

p(26, "Judica me, Domine", [
  "BE thou my Judge, O LORD, for I have walked innocently; * my trust hath been also in the LORD, therefore shall I not fall.",
  "2. Examine me, O LORD, and prove me; * try out my reins and my heart.",
  "3. For thy loving-kindness is ever before mine eyes; * and I will walk in thy truth.",
  "4. I have not dwelt with vain persons; * neither will I have fellowship with the deceitful.",
  "5. I have hated the congregation of the wicked; * and will not sit among the ungodly.",
  "6. I will wash my hands in innocency, O LORD; * and so will I go to thine altar.",
  "7. That I may shew the voice of thanksgiving, * and tell of all thy wondrous works.",
  "8. LORD, I have loved the habitation of thy house, * and the place where thine honour dwelleth.",
  "9. O shut not up my soul with the sinners, * nor my life with the blood-thirsty.",
  "10. In whose hands is wickedness, * and their right hand is full of gifts.",
  "11. But as for me, I will walk innocently; * O deliver me, and be merciful unto me.",
  "12. My foot standeth right; * I will praise the LORD in the congregations."
]);

p(27, "Dominus illuminatio", [
  "THE LORD is my light and my salvation; whom then shall I fear? * the LORD is the strength of my life; of whom then shall I be afraid?",
  "2. When the wicked, even mine enemies and my foes, came upon me to eat up my flesh, * they stumbled and fell.",
  "3. Though an host of men were laid against me, yet shall not my heart be afraid; * and though there rose up war against me, yet will I put my trust in him.",
  "4. One thing have I desired of the LORD, which I will require; * even that I may dwell in the house of the LORD all the days of my life, to behold the fair beauty of the LORD, and to visit his temple.",
  "5. For in the time of trouble he shall hide me in his tabernacle; * yea, in the secret place of his dwelling shall he hide me, and set me up upon a rock of stone.",
  "6. And now shall he lift up mine head * above mine enemies round about me.",
  "7. Therefore will I offer in his dwelling an oblation with great gladness; * I will sing, and speak praises unto the LORD.",
  "8. Hearken unto my voice, O LORD, when I cry unto thee; * have mercy upon me, and hear me.",
  "9. My heart hath talked of thee, Seek ye my face; * Thy face, LORD, will I seek.",
  "10. O hide not thou thy face from me, * nor cast thy servant away in displeasure.",
  "11. Thou hast been my succour; * leave me not, neither forsake me, O God of my salvation.",
  "12. When my father and my mother forsake me, * the LORD taketh me up.",
  "13. Teach me thy way, O LORD; * and lead me in the right way, because of mine enemies.",
  "14. Deliver me not over into the will of mine adversaries; * for there are false witnesses risen up against me, and such as speak wrong.",
  "15. I should utterly have fainted, * but that I believe verily to see the goodness of the LORD in the land of the living.",
  "16. O tarry thou the LORD's leisure; * be strong, and he shall comfort thine heart; and put thou thy trust in the LORD."
]);

p(28, "Ad te, Domine", [
  "UNTO thee will I cry, O LORD my strength; * think no scorn of me; lest, if thou make as though thou hearest not, I become like them that go down into the pit.",
  "2. Hear the voice of my humble petitions, when I cry unto thee, * when I hold up my hands towards the mercy-seat of thy holy temple.",
  "3. O pluck me not away, neither destroy me with the ungodly and wicked doers; * which speak friendly to their neighbours, but imagine mischief in their hearts.",
  "4. Reward them according to their deeds, * and according to the wickedness of their own inventions.",
  "5. Recompense them after the work of their hands; * pay them that they have deserved.",
  "6. For they regard not in their mind the works of the LORD, nor the operation of his hands; * therefore shall he break them down, and not build them up.",
  "7. Praised be the LORD; * for he hath heard the voice of my humble petitions.",
  "8. The LORD is my strength and my shield; my heart hath trusted in him, and I am helped; * therefore my heart danceth for joy, and in my song will I praise him.",
  "9. The LORD is my strength, * and he is the wholesome defence of his Anointed.",
  "10. O save thy people, and give thy blessing unto thine inheritance; * feed them, and lift them up for ever."
]);

p(29, "Afferte Domino", [
  "BRING unto the LORD, O ye mighty, * bring young rams unto the LORD; ascribe unto the LORD worship and strength.",
  "2. Give the LORD the honour due unto his Name; * worship the LORD with holy worship.",
  "3. It is the LORD that commandeth the waters; * it is the glorious God that maketh the thunder; it is the LORD that ruleth the sea.",
  "4. The voice of the LORD is mighty in operation; * the voice of the LORD is a glorious voice.",
  "5. The voice of the LORD breaketh the cedar-trees; * yea, the LORD breaketh the cedars of Libanus.",
  "6. He maketh them also to skip like a calf; * Libanus also, and Sirion, like a young unicorn.",
  "7. The voice of the LORD divideth the flames of fire; the voice of the LORD shaketh the wilderness; * yea, the LORD shaketh the wilderness of Cades.",
  "8. The voice of the LORD maketh the hinds to bring forth young, and discovereth the thick bushes; * in his temple doth every man speak of his honour.",
  "9. The LORD sitteth above the water-flood; * and the LORD remaineth a King for ever.",
  "10. The LORD shall give strength unto his people; * the LORD shall give his people the blessing of peace."
]);

p(30, "Exaltabo te, Domine", [
  "I WILL magnify thee, O LORD, for thou hast set me up, * and not made my foes to triumph over me.",
  "2. O LORD my God, I cried unto thee, * and thou hast healed me.",
  "3. Thou, LORD, hast brought my soul out of hell; * thou hast kept my life from them that go down to the pit.",
  "4. Sing praises unto the LORD, O ye saints of his, * and give thanks unto him for a remembrance of his holiness.",
  "5. For his wrath endureth but the twinkling of an eye, and in his pleasure is life; * heaviness may endure for a night, but joy cometh in the morning.",
  "6. And in my prosperity I said, I shall never be removed. * Thou, LORD, of thy goodness hadst made my hill so strong.",
  "7. But thou didst turn thy face from me, * and I was troubled.",
  "8. Then cried I unto thee, O LORD; * and gat me to my LORD right humbly.",
  "9. What profit is there in my blood, when I go down to the pit? * shall the dust give thanks unto thee? or shall it declare thy truth?",
  "10. Hear, O LORD, and have mercy upon me; * LORD, be thou my helper.",
  "11. Thou hast turned my heaviness into joy; * thou hast put off my sackcloth, and girded me with gladness.",
  "12. Therefore shall every good man sing of thy praise without ceasing. * O my God, I will give thanks unto thee for ever."
]);

p(31, "In te, Domine, speravi", [
  "IN thee, O LORD, have I put my trust; let me never be put to confusion; * deliver me in thy righteousness.",
  "2. Bow down thine ear to me; * make haste to deliver me.",
  "3. And be thou my strong rock, and house of defence, * that thou mayest save me.",
  "4. For thou art my strong rock, and my castle; * be thou also my guide, and lead me for thy Name's sake.",
  "5. Draw me out of the net, that they have laid privily for me; * for thou art my strength.",
  "6. Into thy hands I commend my spirit; * for thou hast redeemed me, O LORD, thou God of truth.",
  "7. I have hated them that hold of superstitious vanities; * and my trust hath been in the LORD.",
  "8. I will be glad and rejoice in thy mercy; * for thou hast considered my trouble, and hast known my soul in adversities.",
  "9. Thou hast not shut me up into the hand of the enemy; * but hast set my feet in a large room.",
  "10. Have mercy upon me, O LORD, for I am in trouble; * and mine eye is consumed for very heaviness; yea, my soul and my body.",
  "11. For my life is waxen old with heaviness, * and my years with mourning.",
  "12. My strength faileth me, because of mine iniquity, and my bones are consumed. * I became a reproach among all mine enemies, but especially among my neighbours, and they of mine acquaintance were afraid of me; and they that did see me without conveyed themselves from me.",
  "13. I am clean forgotten, as a dead man out of mind; * I am become like a broken vessel.",
  "14. For I have heard the blasphemy of the multitude; and fear is on every side, * while they conspired together against me, and took their counsel to take away my life.",
  "15. But my hope hath been in thee, O LORD; * I have said, Thou art my God.",
  "16. My time is in thy hand; deliver me from the hand of mine enemies, * and from them that persecute me.",
  "17. Shew thy servant the light of thy countenance, * and save me for thy mercy's sake.",
  "18. Let me not be confounded, O LORD, for I have called upon thee; * let the ungodly be put to confusion, and be put to silence in the grave.",
  "19. Let the lying lips be put to silence, * which cruelly, disdainfully, and despitefully, speak against the righteous.",
  "20. O how plentiful is thy goodness, which thou hast laid up for them that fear thee, * and that thou hast prepared for them that put their trust in thee, even before the sons of men!",
  "21. Thou shalt hide them privily by thine own presence from the provoking of all men; * thou shalt keep them secretly in thy tabernacle from the strife of tongues.",
  "22. Thanks be to the LORD; * for he hath shewed me marvellous great kindness in a strong city.",
  "23. And when I made haste, I said, * I am cast out of the sight of thine eyes.",
  "24. Nevertheless, thou heardest the voice of my prayer, * when I cried unto thee.",
  "25. O love the LORD, all ye his saints; * for the LORD preserveth them that are faithful, and plenteously rewardeth the proud doer.",
  "26. Be strong, and he shall establish your heart, * all ye that put your trust in the LORD."
]);

p(32, "Beati, quorum", [
  "BLESSED is he whose unrighteousness is forgiven, * and whose sin is covered.",
  "2. Blessed is the man unto whom the LORD imputeth no sin, * and in whose spirit there is no guile.",
  "3. For while I held my tongue, * my bones consumed away through my daily complaining.",
  "4. For thy hand was heavy upon me day and night; * and my moisture is like the drought in summer.",
  "5. I acknowledged my sin unto thee, and mine unrighteousness have I not hid. * I said, I will confess my sins unto the LORD; and so thou forgavest the wickedness of my sin.",
  "6. For this shall every one that is godly make his prayer unto thee, in a time when thou mayest be found; * but in the great water-floods they shall not come nigh him.",
  "7. Thou art a place to hide me in; thou shalt preserve me from trouble; * thou shalt compass me about with songs of deliverance.",
  "8. I will inform thee, and teach thee in the way wherein thou shalt go; * and I will guide thee with mine eye.",
  "9. Be ye not like to horse and mule, which have no understanding; * whose mouths must be held with bit and bridle, lest they fall upon thee.",
  "10. Great plagues remain for the ungodly; * but whoso putteth his trust in the LORD, mercy embraceth him on every side.",
  "11. Be glad, O ye righteous, and rejoice in the LORD; * and be joyful, all ye that are true of heart."
]);

p(33, "Exultate, justi", [
  "REJOICE in the LORD, O ye righteous; * for it becometh well the just to be thankful.",
  "2. Praise the LORD with harp; * sing praises unto him with the lute, and instrument of ten strings.",
  "3. Sing unto the LORD a new song; * sing praises lustily unto him with a good courage.",
  "4. For the word of the LORD is true; * and all his works are faithful.",
  "5. He loveth righteousness and judgement; * the earth is full of the goodness of the LORD.",
  "6. By the word of the LORD were the heavens made, * and all the hosts of them by the breath of his mouth.",
  "7. He gathereth the waters of the sea together, as it were upon an heap, * and layeth up the deep, as in a treasure-house.",
  "8. Let all the earth fear the LORD; * stand in awe of him, all ye that dwell in the world.",
  "9. For he spake, and it was done; * he commanded, and it stood fast.",
  "10. The LORD bringeth the counsel of the heathen to nought, * and maketh the devices of the people to be of none effect, and casteth out the counsels of princes.",
  "11. The counsel of the LORD shall endure for ever, * and the thoughts of his heart from generation to generation.",
  "12. Blessed are the people, whose God is the LORD Jehovah; * and blessed are the folk, that he hath chosen to him for his own inheritance.",
  "13. The LORD looked down from heaven, and beheld all the children of men; * from the habitation of his dwelling he considereth all them that dwell on the earth.",
  "14. He fashioneth all the hearts of them, * and understandeth all their works.",
  "15. There is no king that can be saved by the multitude of an host; * neither is any mighty man delivered by much strength.",
  "16. A horse is counted but a vain thing to save a man; * neither shall he deliver any man by his great strength.",
  "17. Behold, the eye of the LORD is upon them that fear him, * and upon them that put their trust in his mercy.",
  "18. To deliver their soul from death, * and to feed them in the time of dearth.",
  "19. Our soul hath patiently tarried for the LORD; * for he is our help and our shield.",
  "20. For our heart shall rejoice in him, * because we have hoped in his holy Name.",
  "21. Let thy merciful kindness, O LORD, be upon us, * like as we do put our trust in thee."
]);

p(34, "Benedicam Dominum", [
  "I WILL alway give thanks unto the LORD; * his praise shall ever be in my mouth.",
  "2. My soul shall make her boast in the LORD; * the humble shall hear thereof, and be glad.",
  "3. O praise the LORD with me, * and let us magnify his Name together.",
  "4. I sought the LORD, and he heard me; * yea, he delivered me out of all my fear.",
  "5. They had an eye unto him, and were lightened; * and their faces were not ashamed.",
  "6. Lo, the poor crieth, and the LORD heareth him; * yea, and saveth him out of all his troubles.",
  "7. The angel of the LORD tarrieth round about them that fear him, * and delivereth them.",
  "8. O taste and see, how gracious the LORD is; * blessed is the man that trusteth in him.",
  "9. O fear the LORD, ye that are his saints; * for they that fear him lack nothing.",
  "10. The lions do lack, and suffer hunger; * but they who seek the LORD shall want no manner of thing that is good.",
  "11. Come, ye children, and hearken unto me; * I will teach you the fear of the LORD.",
  "12. What man is he that lusteth to live, * and would fain see good days?",
  "13. Keep thy tongue from evil, * and thy lips, that they speak no guile.",
  "14. Eschew evil, and do good; * seek peace, and ensue it.",
  "15. The eyes of the LORD are over the righteous, * and his ears are open unto their prayers.",
  "16. The countenance of the LORD is against them that do evil, * to root out the remembrance of them from the earth.",
  "17. The righteous cry, and the LORD heareth them, * and delivereth them out of all their troubles.",
  "18. The LORD is nigh unto them that are of a contrite heart, * and will save such as be of an humble spirit.",
  "19. Great are the troubles of the righteous; * but the LORD delivereth him out of all.",
  "20. He keepeth all his bones, * so that not one of them is broken.",
  "21. But misfortune shall slay the ungodly; * and they that hate the righteous shall be desolate.",
  "22. The LORD delivereth the souls of his servants; * and all they that put their trust in him shall not be destitute."
]);

p(35, "Judica, Domine", [
  "PLEAD thou my cause, O LORD, with them that strive with me; * and fight thou against them that fight against me.",
  "2. Lay hand upon the shield and buckler, * and stand up to help me.",
  "3. Bring forth the spear, and stop the way against them that persecute me; * say unto my soul, I am thy salvation.",
  "4. Let them be confounded, and put to shame, that seek after my soul; * let them be turned back and brought to confusion, that imagine mischief for me.",
  "5. Let them be as the dust before the wind, * and the angel of the LORD scattering them.",
  "6. Let their way be dark and slippery, * and let the angel of the LORD persecute them.",
  "7. For they have privily laid their net to destroy me without a cause; * yea, even without a cause have they made a pit for my soul.",
  "8. Let a sudden destruction come upon him unawares, and his net, that he hath laid privily, catch himself; * that he may fall into his own mischief.",
  "9. And my soul shall be joyful in the LORD; * it shall rejoice in his salvation.",
  "10. All my bones shall say, LORD, who is like unto thee, who deliverest the poor from him that is too strong for him; * yea, the poor, and him that is in misery, from him that spoileth him?",
  "11. False witnesses did rise up; * they laid to my charge things that I knew not.",
  "12. They rewarded me evil for good, * to the great discomfort of my soul.",
  "13. Nevertheless, when they were sick, I put on sackcloth, and humbled my soul with fasting, * and my prayer shall turn into mine own bosom.",
  "14. I behaved myself as though it had been my friend or my brother; * I went heavily, as one that mourneth for his mother.",
  "15. But in mine adversity they rejoiced, and gathered themselves together; * yea, the very abjects came together against me unawares, making mouths at me, and ceased not.",
  "16. With the flatterers were busy mockers, * who gnashed upon me with their teeth.",
  "17. LORD, how long wilt thou look upon this? * O deliver my soul from the calamities which they bring on me, and my darling from the lions.",
  "18. So will I give thee thanks in the great congregation; * I will praise thee among much people.",
  "19. O let not them that are mine enemies triumph over me ungodly; * neither let them wink with their eyes that hate me without a cause.",
  "20. And why? their communing is not for peace; * but they imagine deceitful words against them that are quiet in the land.",
  "21. They gaped upon me with their mouths, and said, * Fie on thee, fie on thee; we saw it with our eyes.",
  "22. This thou hast seen, O LORD; hold not thy tongue; * go not far from me, O Lord.",
  "23. Awake, and stand up to judge my quarrel; * avenge thou my cause, my God and my Lord.",
  "24. Judge me, O LORD my God, according to thy righteousness; * and let them not triumph over me.",
  "25. Let them not say in their hearts, There, there, so would we have it; * neither let them say, We have devoured him.",
  "26. Let them be put to confusion and shame together, that rejoice at my trouble; * let them be clothed with rebuke and dishonour that boast themselves against me.",
  "27. Let them be glad and rejoice, that favour my righteous dealing; * yea, let them say alway, Blessed be the LORD, who hath pleasure in the prosperity of his servant.",
  "28. And as for my tongue, it shall be talking of thy righteousness, * and of thy praise, all the day long."
]);

p(36, "Dixit injustus", [
  "MY heart sheweth me the wickedness of the ungodly, * that there is no fear of God before his eyes.",
  "2. For he flattereth himself in his own sight, * until his abominable sin be found out.",
  "3. The words of his mouth are unrighteous, and full of deceit; * he hath left off to behave himself wisely, and to do good.",
  "4. He imagineth mischief upon his bed, and hath set himself in no good way; * neither doth he abhor any thing that is evil.",
  "5. Thy mercy, O LORD, reacheth unto the heavens; * and thy faithfulness unto the clouds.",
  "6. Thy righteousness standeth like the strong mountains; thy judgements are like the great deep; * thou, LORD, shalt save both man and beast.",
  "7. How excellent is thy mercy, O God; * and the children of men shall put their trust under the shadow of thy wings.",
  "8. They shall be satisfied with the plenteousness of thy house; * and thou shalt give them drink of thy pleasures, as out of the river.",
  "9. For with thee is the well of life; * and in thy light shall we see light.",
  "10. O continue thy loving-kindness unto them that know thee, * and thy righteousness unto them that are true of heart.",
  "11. O let not the foot of pride come against me, * and let not the hand of the ungodly cast me down.",
  "12. There are they fallen, all that work wickedness; * they are cast down, and shall not be able to stand."
]);

p(37, "Noli aemulari", [
  "FRET not thyself because of the ungodly; * neither be thou envious against the evil-doers.",
  "2. For they shall soon be cut down like the grass, * and be withered even as the green herb.",
  "3. Put thou thy trust in the LORD, and be doing good; * dwell in the land, and verily thou shalt be fed.",
  "4. Delight thou in the LORD; * and he shall give thee thy heart's desire.",
  "5. Commit thy way unto the LORD, and put thy trust in him; * and he shall bring it to pass.",
  "6. He shall make thy righteousness as clear as the light, * and thy just dealing as the noon-day.",
  "7. Hold thee still in the LORD, and abide patiently upon him; * but grieve not thyself at him whose way doth prosper, against the man that doeth after evil counsels.",
  "8. Leave off from wrath, and let go displeasure; * fret not thyself, else shalt thou be moved to do evil.",
  "9. Wicked doers shall be rooted out; * and they that patiently abide the LORD, those shall inherit the land.",
  "10. Yet a little while, and the ungodly shall be clean gone; * thou shalt look after his place, and he shall be away.",
  "11. But the meek-spirited shall possess the earth, * and shall be refreshed in the multitude of peace.",
  "12. The ungodly seeketh counsel against the just, * and gnasheth upon him with his teeth.",
  "13. The LORD shall laugh him to scorn; * for he hath seen that his day is coming.",
  "14. The ungodly have drawn out the sword, and have bent their bow, to cast down the poor and needy, * and to slay such as are of a right conversation.",
  "15. Their sword shall go through their own heart, * and their bow shall be broken.",
  "16. A small thing that the righteous hath * is better than great riches of the ungodly.",
  "17. For the arms of the ungodly shall be broken; * and the LORD upholdeth the righteous.",
  "18. The LORD knoweth the days of the godly; * and their inheritance shall endure for ever.",
  "19. They shall not be confounded in the perilous time; * and in the days of dearth they shall have enough.",
  "20. As for the ungodly, they shall perish; and the enemies of the LORD shall consume as the fat of lambs; * yea, even as the smoke shall they consume away.",
  "21. The ungodly borroweth, and payeth not again; * but the righteous is merciful, and liberal.",
  "22. Such as are blessed of God shall possess the land; * and they that are cursed of him shall be rooted out.",
  "23. The LORD ordereth a good man's going, * and maketh his way acceptable to himself.",
  "24. Though he fall, he shall not be cast away; * for the LORD upholdeth him with his hand.",
  "25. I have been young, and now am old; * and yet saw I never the righteous forsaken, nor his seed begging their bread.",
  "26. The righteous is ever merciful, and lendeth; * and his seed is blessed.",
  "27. Flee from evil, and do the thing that is good; * and dwell for evermore.",
  "28. For the LORD loveth the thing that is right; he forsaketh not his that be godly, but they are preserved for ever; * the unrighteous shall be punished, and the seed of the ungodly shall be rooted out.",
  "29. The righteous shall inherit the land, * and dwell therein for ever.",
  "30. The mouth of the righteous is exercised in wisdom; * and his tongue will be talking of judgement.",
  "31. The law of his God is in his heart, * and his goings shall not slide.",
  "32. The ungodly seeth the righteous, * and seeketh occasion to slay him.",
  "33. The LORD will not leave him in his hand, * nor condemn him when he is judged.",
  "34. Hope thou in the LORD, and keep his way, and he shall promote thee, that thou shalt possess the land; * when the ungodly shall perish, thou shalt see it.",
  "35. I myself have seen the ungodly in great power, * and flourishing like a green bay-tree.",
  "36. I went by, and lo, he was gone; I sought him, but his place could no where be found. * Keep innocency, and take heed unto the thing that is right; for that shall bring a man peace at the last.",
  "37. As for the transgressors, they shall perish together; * and the end of the ungodly is, they shall be rooted out at the last.",
  "38. But the salvation of the righteous cometh of the LORD; * who is also their strength in the time of trouble.",
  "39. And the LORD shall stand by them, and save them; * he shall deliver them from the ungodly, and shall save them, because they put their trust in him."
]);

p(38, "Domine, ne in furore", [
  "PUT me not to rebuke, O LORD, in thine anger; * neither chasten me in thy heavy displeasure.",
  "2. For thine arrows stick fast in me, * and thy hand presseth me sore.",
  "3. There is no health in my flesh, because of thy displeasure; * neither is there any rest in my bones, by reason of my sin.",
  "4. For my wickednesses are gone over my head, * and as a sore burden they are too heavy for me.",
  "5. My wounds stink, and are corrupt, * through my foolishness.",
  "6. I am brought into so great trouble and misery, * that I go mourning all the day long.",
  "7. For my loins are filled with a sore disease; * and there is no whole part in my body.",
  "8. I am feeble, and sore smitten; * I have roared for the very disquietness of my heart.",
  "9. Lord, thou knowest all my desire, * and my groaning is not hid from thee.",
  "10. My heart panteth, my strength hath failed me; * and the sight of mine eyes is gone from me.",
  "11. My lovers and my neighbours did stand looking upon my trouble, * and my kinsmen stood afar off.",
  "12. They also that sought after my life laid snares for me; and they that went about to do me evil talked of wickedness, * and imagined deceit all the day long.",
  "13. As for me, I was like a deaf man, and heard not; * and as one that is dumb, who doth not open his mouth.",
  "14. I became even as a man that heareth not, * and in whose mouth are no reproofs.",
  "15. For in thee, O LORD, have I put my trust; * thou shalt answer for me, O Lord my God.",
  "16. I have required that they, even mine enemies, should not triumph over me; * for when my foot slipped, they rejoiced greatly against me.",
  "17. And I, truly, am set in the plague; * and my heaviness is ever in my sight.",
  "18. For I will confess my wickedness, * and be sorry for my sin.",
  "19. But mine enemies live, and are mighty; * and they that hate me wrongfully are many in number.",
  "20. They also that reward evil for good are against me; * because I follow the thing that good is.",
  "21. Forsake me not, O LORD my God; * be not thou far from me.",
  "22. Haste thee to help me, * O Lord God of my salvation."
]);

p(39, "Dixi, Custodiam", [
  "I SAID, I will take heed to my ways, * that I offend not in my tongue.",
  "2. I will keep my mouth as it were with a bridle, * while the ungodly is in my sight.",
  "3. I held my tongue, and spake nothing; * I kept silence, yea, even from good words; but it was pain and grief to me.",
  "4. My heart was hot within me, and while I was thus musing the fire kindled; * and at the last I spake with my tongue.",
  "5. LORD, let me know mine end, and the number of my days; * that I may be certified how long I have to live.",
  "6. Behold, thou hast made my days as it were a span long, and mine age is even as nothing in respect of thee; * and verily every man living is altogether vanity.",
  "7. For man walketh in a vain shadow, and disquieteth himself in vain; * he heapeth up riches, and cannot tell who shall gather them.",
  "8. And now, Lord, what is my hope; * truly my hope is even in thee.",
  "9. Deliver me from all mine offences; * and make me not a rebuke unto the foolish.",
  "10. I became dumb, and opened not my mouth; * for it was thy doing.",
  "11. Take thy plague away from me; * I am even consumed by the means of thy heavy hand.",
  "12. When thou with rebukes dost chasten man for sin, thou makest his beauty to consume away, like as it were a moth fretting a garment; * every man therefore is but vanity.",
  "13. Hear my prayer, O LORD, and with thine ears consider my calling; * hold not thy peace at my tears.",
  "14. For I am a stranger with thee, * and a sojourner, as all my fathers were.",
  "15. O spare me a little, that I may recover my strength, * before I go hence, and be no more seen."
]);

p(40, "Expectans expectavi", [
  "I WAITED patiently for the LORD; * and he inclined unto me, and heard my calling.",
  "2. He brought me also out of the horrible pit, out of the mire and clay; * and set my feet upon the rock, and ordered my goings.",
  "3. And he hath put a new song in my mouth, * even a thanksgiving unto our God.",
  "4. Many shall see it, and fear, * and shall put their trust in the LORD.",
  "5. Blessed is the man that hath set his hope in the LORD, and turned not unto the proud, * and to such as go about with lies.",
  "6. O LORD my God, great are the wondrous works which thou hast done, like as be also thy thoughts which are to us-ward; * and yet there is no man that ordereth them unto thee.",
  "7. If I should declare them, and speak of them, * they should be more than I am able to express.",
  "8. Sacrifice, and meat-offering, thou wouldest not; but mine ears hast thou opened; * burnt-offerings, and sacrifice for sin, hast thou not required.",
  "9. Then said I, Lo, I come; * in the volume of the book it is written of me, that I should fulfil thy will, O my God.",
  "10. I am content to do it; yea, thy law is within my heart. * I have declared thy righteousness in the great congregation; lo, I will not refrain my lips, O LORD, and that thou knowest.",
  "11. I have not hid thy righteousness within my heart; my talk hath been of thy truth and of thy salvation; * I have not concealed thy loving-kindness and truth from the great congregation.",
  "12. Withdraw not thou thy mercy from me, O LORD; * let thy loving-kindness and thy truth alway preserve me.",
  "13. For innumerable troubles are come about me; my sins have taken such hold upon me that I am not able to look up; * yea, they are more in number than the hairs of my head, and my heart hath failed me.",
  "14. O LORD, let it be thy pleasure to deliver me; * make haste, O LORD, to help me.",
  "15. Let them be ashamed and confounded together that seek after my soul to destroy it; * let them be driven backward and put to rebuke that wish me evil.",
  "16. Let them be desolate, and rewarded with shame, * that say unto me, Fie upon thee, fie upon thee.",
  "17. Let all those that seek thee be joyful and glad in thee; * and let such as love thy salvation say alway, The LORD be praised.",
  "18. As for me, I am poor and needy; * but the Lord careth for me.",
  "19. Thou art my helper and redeemer; * make no long tarrying, O my God."
]);

p(41, "Beatus qui intelligit", [
  "BLESSED is he that considereth the poor and needy; * the LORD shall deliver him in the time of trouble.",
  "2. The LORD preserve him, and keep him alive, that he may be blessed upon earth, * and deliver not thou him into the will of his enemies.",
  "3. The LORD comfort him, when he lieth sick upon his bed; * make thou all his bed in his sickness.",
  "4. I said, LORD, be merciful unto me; * heal my soul, for I have sinned against thee.",
  "5. Mine enemies speak evil of me; * When shall he die, and his name perish?",
  "6. And if he come to see me, he speaketh vanity; * and his heart conceiveth falsehood within himself, and when he cometh forth he telleth it.",
  "7. All mine enemies whisper together against me; * even against me do they imagine this evil.",
  "8. Let the sentence of guiltiness proceed against him; and now that he lieth, let him rise up no more. * Yea, even mine own familiar friend, whom I trusted, who did also eat of my bread, hath laid great wait for me.",
  "9. But be thou merciful unto me, O LORD; * raise thou me up again, and I shall reward them.",
  "10. By this I know thou favourest me, * that mine enemy doth not triumph against me.",
  "11. And when I am in my health, thou upholdest me, * and shalt set me before thy face for ever.",
  "12. Blessed be the LORD God of Israel, * world without end. Amen and Amen."
]);

p(42, "Quemadmodum", [
  "LIKE as the hart desireth the water-brooks, * so longeth my soul after thee, O God.",
  "2. My soul is athirst for God, yea, even for the living God; * when shall I come to appear before the presence of God?",
  "3. My tears have been my meat day and night, * while they daily say unto me, Where is now thy God?",
  "4. Now when I think thereupon, I pour out my heart by myself; * for I went with the multitude, and brought them forth into the house of God.",
  "5. In the voice of praise and thanksgiving, * among such as keep holy-day.",
  "6. Why art thou so full of heaviness, O my soul; * and why art thou so disquieted within me?",
  "7. Put thy trust in God; * for I will yet give him thanks for the help of his countenance.",
  "8. My God, my soul is vexed within me; * therefore will I remember thee concerning the land of Jordan, and the little hill of Hermon.",
  "9. One deep calleth another, because of the noise of the water-pipes; * all thy waves and storms are gone over me.",
  "10. The LORD hath granted his loving-kindness in the day-time; * and in the night-season did I sing of him, and made my prayer unto the God of my life.",
  "11. I will say unto the God of my strength, Why hast thou forgotten me? * why go I thus heavily, while the enemy oppresseth me?",
  "12. My bones are smitten asunder as with a sword, * while mine enemies that trouble me cast me in the teeth.",
  "13. Namely, while they say daily unto me, * Where is now thy God?",
  "14. Why art thou so vexed, O my soul; * and why art thou so disquieted within me?",
  "15. O put thy trust in God; * for I will yet thank him, which is the help of my countenance, and my God."
]);

p(43, "Judica me, Deus", [
  "GIVE sentence with me, O God, and defend my cause against the ungodly people; * O deliver me from the deceitful and wicked man.",
  "2. For thou art the God of my strength; why hast thou put me from thee? * and why go I so heavily, while the enemy oppresseth me?",
  "3. O send out thy light and thy truth, that they may lead me, * and bring me unto thy holy hill, and to thy dwelling.",
  "4. And that I may go unto the altar of God, even unto the God of my joy and gladness; * and upon the harp will I give thanks unto thee, O God, my God.",
  "5. Why art thou so heavy, O my soul; * and why art thou so disquieted within me?",
  "6. O put thy trust in God; * for I will yet give him thanks, which is the help of my countenance, and my God."
]);

p(44, "Deus, auribus nostris", [
  "WE have heard with our ears, O God, our fathers have told us, * what thou hast done in their time of old.",
  "2. How thou hast driven out the heathen with thy hand, and planted them in; * how thou hast destroyed the nations, and cast them out.",
  "3. For they gat not the land in possession through their own sword, neither was it their own arm that helped them; * but thy right hand, and thine arm, and the light of thy countenance, because thou hadst a favour unto them.",
  "4. Thou art my King, O God; * send help unto Jacob.",
  "5. Through thee will we overthrow our enemies; * and in thy Name will we tread them under that rise up against us.",
  "6. For I will not trust in my bow; * it is not my sword that shall help me.",
  "7. But it is thou that savest us from our enemies, * and puttest them to confusion that hate us.",
  "8. We make our boast of God all day long, * and will praise thy Name for ever.",
  "9. But now thou art far off, and puttest us to confusion, * and goest not forth with our armies.",
  "10. Thou makest us to turn our backs upon our enemies; * and they which hate us spoil our goods.",
  "11. Thou lettest us be eaten up like sheep, * and hast scattered us among the heathen.",
  "12. Thou sellest thy people for nought, * and takest no money for them.",
  "13. Thou makest us to be rebuked of our neighbours, * to be laughed to scorn, and had in derision of them that are round about us.",
  "14. Thou makest us to be a by-word among the heathen, * and that the people shake their heads at us.",
  "15. My confusion is daily before me, * and the shame of my face hath covered me.",
  "16. For the voice of the slanderer and blasphemer; * for the enemy and avenger.",
  "17. And though all this be come upon us, yet do we not forget thee, * nor behave ourselves frowardly in thy covenant.",
  "18. Our heart is not turned back, * neither our steps gone out of thy way.",
  "19. No, not when thou hast smitten us into the place of dragons, * and covered us with the shadow of death.",
  "20. If we have forgotten the Name of our God, and holden up our hands to any strange god; * shall not God search it out? for he knoweth the very secrets of the heart.",
  "21. For thy sake also are we killed all the day long; * and are counted as sheep appointed to be slain.",
  "22. Up, LORD, why sleepest thou? * awake, and be not absent from us for ever.",
  "23. Wherefore hidest thou thy face, * and forgettest our misery and trouble?",
  "24. For our soul is brought low, even unto the dust; * our belly cleaveth unto the ground.",
  "25. Arise, and help us, * and deliver us for thy mercy's sake."
]);

p(45, "Eructavit cor meum", [
  "MY heart is inditing of a good matter; I speak of the things which I have made unto the King; * my tongue is the pen of a ready writer.",
  "2. Thou art fairer than the children of men; full of grace are thy lips, because God hath blessed thee for ever. * Gird thee with thy sword upon thy thigh, O thou most Mighty, according to thy worship and renown.",
  "3. Good luck have thou with thine honour; ride on, because of the word of truth, of meekness, and righteousness; * and thy right hand shall teach thee terrible things.",
  "4. Thy arrows are very sharp, and the people shall be subdued unto thee; * even in the midst among the King's enemies.",
  "5. Thy seat, O God, endureth for ever; * the sceptre of thy kingdom is a right sceptre.",
  "6. Thou hast loved righteousness, and hated iniquity; * wherefore God, even thy God, hath anointed thee with the oil of gladness above thy fellows.",
  "7. All thy garments smell of myrrh, aloes, and cassia; * out of the ivory palaces, whereby they have made thee glad.",
  "8. Kings' daughters were among thy honourable women; * upon thy right hand did stand the queen in a vesture of gold, wrought about with divers colours.",
  "9. Hearken, O daughter, and consider; incline thine ear; * forget also thine own people, and thy father's house.",
  "10. So shall the King have pleasure in thy beauty; * for he is thy LORD God, and worship thou him.",
  "11. And the daughter of Tyre shall be there with a gift; * like as the rich also among the people shall make their supplication before thee.",
  "12. The King's daughter is all glorious within; * her clothing is of wrought gold.",
  "13. She shall be brought unto the King in raiment of needle-work; * the virgins that be her fellows shall bear her company, and shall be brought unto thee.",
  "14. With joy and gladness shall they be brought; * and shall enter into the King's palace.",
  "15. Instead of thy fathers thou shalt have children, * whom thou mayest make princes in all lands.",
  "16. I will remember thy Name from one generation to another; * therefore shall the people give thanks unto thee, world without end."
]);

p(46, "Deus noster refugium", [
  "GOD is our hope and strength, * a very present help in trouble.",
  "2. Therefore will we not fear, though the earth be moved, * and though the hills be carried into the midst of the sea.",
  "3. Though the waters thereof rage and swell, * and though the mountains shake at the tempest of the same.",
  "4. The rivers of the flood thereof shall make glad the city of God; * the holy place of the tabernacle of the most Highest.",
  "5. God is in the midst of her, therefore shall she not be removed; * God shall help her, and that right early.",
  "6. The heathen make much ado, and the kingdoms are moved; * but God hath shewed his voice, and the earth shall melt away.",
  "7. The LORD of hosts is with us; * the God of Jacob is our refuge.",
  "8. O come hither, and behold the works of the LORD, * what destruction he hath brought upon the earth.",
  "9. He maketh wars to cease in all the world; * he breaketh the bow, and knappeth the spear in sunder, and burneth the chariots in the fire.",
  "10. Be still then, and know that I am God; * I will be exalted among the heathen, and I will be exalted in the earth.",
  "11. The LORD of hosts is with us; * the God of Jacob is our refuge."
]);

p(47, "Omnes gentes, plaudite", [
  "O CLAP your hands together, all ye people; * O sing unto God with the voice of melody.",
  "2. For the LORD is high, and to be feared; * he is the great King upon all the earth.",
  "3. He shall subdue the people under us, * and the nations under our feet.",
  "4. He shall choose out an heritage for us, * even the worship of Jacob, whom he loved.",
  "5. God is gone up with a merry noise, * and the LORD with the sound of the trump.",
  "6. O sing praises, sing praises unto our God; * O sing praises, sing praises unto our King.",
  "7. For God is the King of all the earth; * sing ye praises with understanding.",
  "8. God reigneth over the heathen; * God sitteth upon his holy seat.",
  "9. The princes of the people are joined unto the people of the God of Abraham; * for God, which is very high exalted, doth defend the earth, as it were with a shield."
]);

p(48, "Magnus Dominus", [
  "GREAT is the LORD, and highly to be praised, * in the city of our God, even upon his holy hill.",
  "2. The hill of Sion is a fair place, and the joy of the whole earth; * upon the north-side lieth the city of the great King; God is well known in her palaces as a sure refuge.",
  "3. For lo, the kings of the earth * are gathered, and gone by together.",
  "4. They marvelled to see such things; * they were astonished, and suddenly cast down.",
  "5. Fear came there upon them, and sorrow, * as upon a woman in her travail.",
  "6. Thou shalt break the ships of the sea * through the east-wind.",
  "7. Like as we have heard, so have we seen in the city of the LORD of hosts, in the city of our God; * God upholdeth the same for ever.",
  "8. We wait for thy loving-kindness, O God, * in the midst of thy temple.",
  "9. O God, according to thy Name, so is thy praise unto the world's end; * thy right hand is full of righteousness.",
  "10. Let the mount Sion rejoice, and the daughter of Judah be glad, * because of thy judgements.",
  "11. Walk about Sion, and go round about her, * and tell the towers thereof.",
  "12. Mark well her bulwarks, set up her houses, * that ye may tell them that come after.",
  "13. For this God is our God for ever and ever; * he shall be our guide unto death."
]);

p(49, "Audite haec, omnes", [
  "O HEAR ye this, all ye people; * ponder it with your ears, all ye that dwell in the world.",
  "2. High and low, rich and poor, * one with another.",
  "3. My mouth shall speak of wisdom, * and my heart shall muse of understanding.",
  "4. I will incline mine ear to the parable, * and shew my dark speech upon the harp.",
  "5. Wherefore should I fear in the days of wickedness, * and when the wickedness of my heels compasseth me round about?",
  "6. There be some that put their trust in their goods, * and boast themselves in the multitude of their riches.",
  "7. But no man may deliver his brother, * nor make agreement unto God for him.",
  "8. For it cost more to redeem their souls; * so that he must let that alone for ever.",
  "9. Yea, though he live long, * and see not the grave.",
  "10. For he seeth that wise men also die, and perish together, * as well as the ignorant and foolish, and leave their riches for other.",
  "11. And yet they think that their houses shall continue for ever, and that their dwelling-places shall endure from one generation to another; * and call the lands after their own names.",
  "12. Nevertheless, man will not abide in honour; * seeing he may be compared unto the beasts that perish; this is the way of them.",
  "13. This is their foolishness, * and their posterity praise their saying.",
  "14. They lie in the hell like sheep, death gnaweth upon them, and the righteous shall have domination over them in the morning; * their beauty shall consume in the sepulchre out of their dwelling.",
  "15. But God hath delivered my soul from the place of hell; * for he shall receive me.",
  "16. Be not thou afraid, though one be made rich, * or if the glory of his house be increased.",
  "17. For he shall carry nothing away with him when he dieth, * neither shall his pomp follow him.",
  "18. For while he lived, he counted himself an happy man; * and so long as thou doest well unto thyself, men will speak good of thee.",
  "19. He shall follow the generation of his fathers, * and shall never see light.",
  "20. Man being in honour hath no understanding, * but is compared unto the beasts that perish."
]);

p(50, "Deus deorum", [
  "THE LORD, even the most mighty God, hath spoken, and called the world, * from the rising up of the sun unto the going down thereof.",
  "2. Out of Sion hath God appeared, * in perfect beauty.",
  "3. Our God shall come, and shall not keep silence; there shall go before him a consuming fire, * and a mighty tempest shall be stirred up round about him.",
  "4. He shall call the heaven from above, * and the earth, that he may judge his people.",
  "5. Gather my saints together unto me, * those that have made a covenant with me with sacrifice.",
  "6. And the heavens shall declare his righteousness; * for God is Judge himself.",
  "7. Hear, O my people, and I will speak; I myself will testify against thee, O Israel; * for I am God, even thy God.",
  "8. I will not reprove thee because of thy sacrifices, or for thy burnt-offerings, * because they were not alway before me.",
  "9. I will take no bullock out of thine house, * nor he-goat out of thy folds.",
  "10. For all the beasts of the forest are mine, * and so are the cattle upon a thousand hills.",
  "11. I know all the fowls upon the mountains, * and the wild beasts of the field are in my sight.",
  "12. If I be hungry, I will not tell thee; * for the whole world is mine, and all that is therein.",
  "13. Thinkest thou that I will eat bulls' flesh, * and drink the blood of goats?",
  "14. Offer unto God thanksgiving, * and pay thy vows unto the most Highest.",
  "15. And call upon me in the time of trouble; * so will I hear thee, and thou shalt praise me.",
  "16. But unto the ungodly said God; * Why dost thou preach my laws, and takest my covenant in thy mouth;",
  "17. Whereas thou hatest to be reformed, * and hast cast my words behind thee?",
  "18. When thou sawest a thief, thou consentedst unto him, * and hast been partaker with the adulterers.",
  "19. Thou hast let thy mouth speak wickedness, * and with thy tongue thou hast set forth deceit.",
  "20. Thou satest, and spakest against thy brother; * yea, and hast slandered thine own mother's son.",
  "21. These things hast thou done, and I held my tongue, and thou thoughtest wickedly, that I am even such a one as thyself; * but I will reprove thee, and set before thee the things that thou hast done.",
  "22. O consider this, ye that forget God; * lest I pluck you away, and there be none to deliver you.",
  "23. Whoso offereth me thanks and praise, he honoureth me; * and to him that ordereth his conversation right, will I shew the salvation of God."
]);

// Output the psalms object as JSON for inspection
const fs = require('fs');
fs.writeFileSync('/tmp/psalms_part1.json', JSON.stringify(psalms, null, 2));
console.log('Written psalms 1-50');
