// Psalms 51-100 Coverdale Psalter

const psalms = {};

function p(num, subtitle, verses) {
  psalms[num] = { subtitle, text: verses.join("\n") };
}

p(51, "Miserere mei, Deus", [
  "HAVE mercy upon me, O God, after thy great goodness; * according to the multitude of thy mercies do away mine offences.",
  "2. Wash me throughly from my wickedness, * and cleanse me from my sin.",
  "3. For I acknowledge my faults, * and my sin is ever before me.",
  "4. Against thee only have I sinned, and done this evil in thy sight; * that thou mightest be justified in thy saying, and clear when thou art judged.",
  "5. Behold, I was shapen in wickedness; * and in sin hath my mother conceived me.",
  "6. But lo, thou requirest truth in the inward parts; * and shalt make me to understand wisdom secretly.",
  "7. Thou shalt purge me with hyssop, and I shall be clean; * thou shalt wash me, and I shall be whiter than snow.",
  "8. Thou shalt make me hear of joy and gladness, * that the bones which thou hast broken may rejoice.",
  "9. Turn thy face from my sins, * and put out all my misdeeds.",
  "10. Make me a clean heart, O God; * and renew a right spirit within me.",
  "11. Cast me not away from thy presence, * and take not thy holy Spirit from me.",
  "12. O give me the comfort of thy help again, * and stablish me with thy free Spirit.",
  "13. Then shall I teach thy ways unto the wicked, * and sinners shall be converted unto thee.",
  "14. Deliver me from blood-guiltiness, O God, thou that art the God of my health; * and my tongue shall sing of thy righteousness.",
  "15. Thou shalt open my lips, O Lord, * and my mouth shall shew thy praise.",
  "16. For thou desirest no sacrifice, else would I give it thee; * but thou delightest not in burnt-offerings.",
  "17. The sacrifice of God is a troubled spirit; * a broken and contrite heart, O God, shalt thou not despise.",
  "18. O be favourable and gracious unto Sion; * build thou the walls of Jerusalem.",
  "19. Then shalt thou be pleased with the sacrifice of righteousness, with the burnt-offerings and oblations; * then shall they offer young bullocks upon thine altar."
]);

p(52, "Quid gloriaris", [
  "WHY boastest thou thyself, thou tyrant, * that thou canst do mischief;",
  "2. Whereas the goodness of God * endureth yet daily?",
  "3. Thy tongue imagineth wickedness, * and with lies thou cuttest like a sharp razor.",
  "4. Thou hast loved unrighteousness more than goodness, * and to talk of lies more than righteousness.",
  "5. Thou hast loved to speak all words that may do hurt, * O thou false tongue.",
  "6. Therefore shall God destroy thee for ever; he shall take thee, and pluck thee out of thy dwelling, and root thee out of the land of the living. * The righteous also shall see this, and fear, and shall laugh him to scorn.",
  "7. Lo, this is the man that took not God for his strength; * but trusted unto the multitude of his riches, and strengthened himself in his wickedness.",
  "8. As for me, I am like a green olive-tree in the house of God; * my trust is in the tender mercy of God for ever and ever.",
  "9. I will alway give thanks unto thee for that thou hast done; * and I will hope in thy Name, for thy saints like it well."
]);

p(53, "Dixit insipiens", [
  "THE fool hath said in his heart, * There is no God.",
  "2. Corrupt are they, and become abominable in their wickedness; * there is none that doeth good.",
  "3. God looked down from heaven upon the children of men, * to see if there were any that would understand, and seek after God.",
  "4. But they are all gone out of the way; they are altogether become abominable; * there is also none that doeth good, no not one.",
  "5. Are not they without understanding, that work wickedness, * eating up my people as if they would eat bread? they have not called upon God.",
  "6. They were afraid where no fear was; * for God hath broken the bones of him that besieged thee: thou hast put them to confusion, because God hath despised them.",
  "7. O that the salvation were given unto Israel out of Sion! * When God turneth the captivity of his people, then shall Jacob rejoice, and Israel shall be glad."
]);

p(54, "Deus, in nomine", [
  "SAVE me, O God, for thy Name's sake, * and avenge me in thy strength.",
  "2. Hear my prayer, O God, * and hearken unto the words of my mouth.",
  "3. For strangers are risen up against me, and tyrants, which have not God before their eyes, seek after my soul. * God is my helper; the Lord is with them that uphold my soul.",
  "4. He shall reward evil unto mine enemies; * destroy thou them in thy truth.",
  "5. An offering of a free heart will I give thee, and praise thy Name, O LORD, * because it is so comfortable.",
  "6. For he hath delivered me out of all my trouble; * and mine eye hath seen his desire upon mine enemies."
]);

p(55, "Exaudi, Deus", [
  "HEAR my prayer, O God, * and hide not thyself from my petition.",
  "2. Take heed unto me, and hear me, * how I mourn in my prayer, and am vexed.",
  "3. The enemy crieth so, and the ungodly cometh on so fast; * for they are minded to do me some mischief; so maliciously are they set against me.",
  "4. My heart is disquieted within me, * and the fear of death is fallen upon me.",
  "5. Fearfulness and trembling are come upon me, * and an horrible dread hath overwhelmed me.",
  "6. And I said, O that I had wings like a dove; * for then would I flee away, and be at rest.",
  "7. Lo, then would I get me away far off, * and remain in the wilderness.",
  "8. I would make haste to escape, * because of the stormy wind and tempest.",
  "9. Destroy their tongues, O Lord, and divide them; * for I have spied unrighteousness and strife in the city.",
  "10. Day and night they go about within the walls thereof; * mischief also and sorrow are in the midst of it.",
  "11. Wickedness is therein; * deceit and guile go not out of their streets.",
  "12. For it is not an open enemy that hath done me this dishonour; for then I could have borne it; * neither was it mine adversary that did magnify himself against me; for then peradventure I would have hid myself from him.",
  "13. But it was even thou, my companion, my guide, and mine own familiar friend. * We took sweet counsel together, and walked in the house of God as friends.",
  "14. Let death seize upon them, and let them go down quick into hell; * for wickedness is in their dwellings, and among them.",
  "15. As for me, I will call upon God; * and the LORD shall save me.",
  "16. In the evening, and morning, and at noon-day, will I pray and that instantly; * and he shall hear my voice.",
  "17. It is he that hath delivered my soul in peace from the battle that was against me; * for there were many with me.",
  "18. Yea, even God, that endureth for ever, shall hear me, and bring them down; * for they will not turn, nor fear God.",
  "19. He laid his hands upon such as be at peace with him, * and he brake his covenant.",
  "20. The words of his mouth were softer than butter, having war in his heart; * his words were smoother than oil, and yet be they very swords.",
  "21. O cast thy burden upon the LORD, and he shall nourish thee; * and shall not suffer the righteous to fall for ever.",
  "22. And as for them, thou, O God, shalt bring them into the pit of destruction; * the blood-thirsty and deceitful men shall not live out half their days; nevertheless, my trust shall be in thee."
]);

p(56, "Miserere mei, Deus", [
  "BE merciful unto me, O God, for man goeth about to devour me; * he is daily fighting, and troubling me.",
  "2. Mine enemies are daily in hand to swallow me up; * for they be many that fight against me, O thou most Highest.",
  "3. Nevertheless, though I am sometime afraid, * yet put I my trust in thee.",
  "4. I will praise God, because of his word; I have put my trust in God, and will not fear * what flesh can do unto me.",
  "5. They daily mistake my words; * all that they imagine is to do me evil.",
  "6. They hold all together, and keep themselves close, * and mark my steps, when they lay wait for my soul.",
  "7. Shall they escape for their wickedness? * thou, O God, in thy displeasure shalt cast down the people.",
  "8. Thou tellest my flittings; put my tears into thy bottle; * are not these things noted in thy book?",
  "9. Whensoever I call upon thee, then shall mine enemies be put to flight; * this I know; for God is on my side.",
  "10. In God's word will I rejoice; in the LORD's word will I comfort me. * Yea, in God have I put my trust; I will not be afraid what man can do unto me.",
  "11. Unto thee, O God, will I pay my vows; * unto thee will I give thanks.",
  "12. For thou hast delivered my soul from death, and my feet from falling, * that I may walk before God in the light of the living."
]);

p(57, "Miserere mei, Deus", [
  "BE merciful unto me, O God, be merciful unto me; for my soul trusteth in thee; * and under the shadow of thy wings shall be my refuge, until this tyranny be over-past.",
  "2. I will call unto the most high God, * even unto the God that shall perform the cause which I have in hand.",
  "3. He shall send from heaven, and save me from the reproof of him that would eat me up; * God shall send forth his mercy and truth.",
  "4. My soul is among lions; and I lie even among the children of men that are set on fire; * whose teeth are spears and arrows, and their tongue a sharp sword.",
  "5. Set up thyself, O God, above the heavens; * and thy glory above all the earth.",
  "6. They have laid a net for my feet, and pressed down my soul; they have digged a pit before me, * and are fallen into the midst of it themselves.",
  "7. My heart is fixed, O God, my heart is fixed; * I will sing and give praise.",
  "8. Awake up, my glory; awake, lute and harp; * I myself will awake right early.",
  "9. I will give thanks unto thee, O LORD, among the people; * and I will sing unto thee among the nations.",
  "10. For the greatness of thy mercy reacheth unto the heavens, * and thy truth unto the clouds.",
  "11. Set up thyself, O God, above the heavens; * and thy glory above all the earth."
]);

p(58, "Si vere utique", [
  "ARE your minds set upon righteousness, O ye congregation; * and do ye judge the thing that is right, O ye sons of men?",
  "2. Yea, ye imagine mischief in your heart upon the earth, * and your hands deal with wickedness.",
  "3. The ungodly are froward, even from their mother's womb; * as soon as they are born, they go astray, and speak lies.",
  "4. They are as venomous as the poison of a serpent; * even like the deaf adder that stoppeth her ears.",
  "5. Which refuseth to hear the voice of the charmer, * charm he never so wisely.",
  "6. Break their teeth, O God, in their mouths; smite the jaw-bones of the lions, O LORD; * let them fall away like water that runneth apace; and when they shoot their arrows, let them be rooted out.",
  "7. Let them consume away like a snail, and be like the untimely fruit of a woman; * and let them not see the sun.",
  "8. Or ever your pots be made hot with thorns, * so let indignation vex him even as a thing that is raw.",
  "9. The righteous shall rejoice when he seeth the vengeance; * he shall wash his footsteps in the blood of the ungodly.",
  "10. So that a man shall say, Verily there is a reward for the righteous; * doubtless there is a God that judgeth the earth."
]);

p(59, "Eripe me de inimicis", [
  "DELIVER me from mine enemies, O God; * defend me from them that rise up against me.",
  "2. O deliver me from the wicked doers, * and save me from the blood-thirsty men.",
  "3. For lo, they lie waiting for my soul; the mighty men are gathered against me, without any offence or fault of me, O LORD. * They run and prepare themselves without my fault; arise thou therefore to help me, and behold.",
  "4. Stand up, O LORD God of hosts, thou God of Israel, to visit all the heathen; * and be not merciful unto them that offend of malicious wickedness.",
  "5. They go to and fro in the evening; * they grin like a dog, and run about through the city.",
  "6. Behold, they speak with their mouth, and swords are in their lips; * for who doth hear?",
  "7. But thou, O LORD, shalt have them in derision, * and thou shalt laugh all the heathen to scorn.",
  "8. My strength will I ascribe unto thee; * for thou art the God of my refuge.",
  "9. God sheweth me his goodness plenteously; * and God shall let me see my desire upon mine enemies.",
  "10. Slay them not, lest my people forget it; but scatter them abroad among the people, and put them down, O Lord, our defence. * For the sin of their mouth, and for the words of their lips, they shall be taken in their pride; and why? their preaching is of cursing and lies.",
  "11. Consume them in thy wrath, consume them, that they may perish; * and know that it is God that ruleth in Jacob, and unto the ends of the world.",
  "12. And in the evening they will return, grin like a dog, * and will go about the city.",
  "13. They will run here and there for meat, * and grudge if they be not satisfied.",
  "14. As for me, I will sing of thy power, and will praise thy mercy betimes in the morning; * for thou hast been my defence and refuge in the day of my trouble.",
  "15. Unto thee, O my strength, will I sing; * for thou, O God, art my refuge, and my merciful God."
]);

p(60, "Deus, repulisti nos", [
  "O GOD, thou hast cast us out, and scattered us abroad; * thou hast also been displeased; O turn thee unto us again.",
  "2. Thou hast moved the land, and divided it; * heal the sores thereof, for it shaketh.",
  "3. Thou hast shewed thy people heavy things; * thou hast given us a drink of deadly wine.",
  "4. Thou hast given a token for such as fear thee, * that they may triumph because of the truth.",
  "5. Therefore were thy beloved delivered; * help me with thy right hand, and hear me.",
  "6. God hath spoken in his holiness; * I will rejoice, therefore, and divide Sichem, and mete out the valley of Succoth.",
  "7. Gilead is mine, and Manasses is mine; * Ephraim also is the strength of my head; Judah is my law-giver.",
  "8. Moab is my wash-pot; over Edom will I cast out my shoe; * Philistia, be thou glad of me.",
  "9. Who will lead me into the strong city? * who will bring me into Edom?",
  "10. Hast not thou cast us out, O God? * wilt not thou, O God, go out with our hosts?",
  "11. O be thou our help in trouble; * for vain is the help of man.",
  "12. Through God will we do great acts; * for it is he that shall tread down our enemies."
]);

p(61, "Exaudi, Deus", [
  "HEAR my crying, O God; * give ear unto my prayer.",
  "2. From the ends of the earth will I call upon thee, when my heart is in heaviness; * O set me up upon the rock that is higher than I.",
  "3. For thou hast been my hope, * and a strong tower for me against the enemy.",
  "4. I will dwell in thy tabernacle for ever, * and my trust shall be under the covering of thy wings.",
  "5. For thou, O LORD, hast heard my desires, * and hast given an heritage unto those that fear thy Name.",
  "6. Thou shalt grant the King a long life, * that his years may endure throughout all generations.",
  "7. He shall dwell before God for ever; * O prepare thy loving mercy and faithfulness, that they may preserve him.",
  "8. So will I alway sing praise unto thy Name, * that I may daily perform my vows."
]);

p(62, "Nonne Deo", [
  "MY soul truly waiteth still upon God; * for of him cometh my salvation.",
  "2. He verily is my strength and my salvation; * he is my defence, so that I shall not greatly fall.",
  "3. How long will ye imagine mischief against every man? * ye shall be slain all the sort of you; yea, as a tottering wall shall ye be, and like a broken hedge.",
  "4. Their device is only how to put him out whom God will exalt; * their delight is in lies; they give good words with their mouth, but curse with their heart.",
  "5. Nevertheless, my soul, wait thou still upon God; * for my hope is in him.",
  "6. He truly is my strength and my salvation; * he is my defence, so that I shall not fall.",
  "7. In God is my health, and my glory, * the rock of my might; and in God is my trust.",
  "8. O put your trust in him alway, ye people; * pour out your hearts before him; for God is our hope.",
  "9. As for the children of men, they are but vanity; the children of men are deceitful; upon the weights they are altogether lighter than vanity itself. * O trust not in wrong and robbery, give not yourselves unto vanity; if riches increase, set not your heart upon them.",
  "10. God spake once, and twice I have also heard the same, * that power belongeth unto God.",
  "11. And that thou, Lord, art merciful; * for thou rewardest every man according to his work."
]);

p(63, "Deus, Deus meus", [
  "O GOD, thou art my God; * early will I seek thee.",
  "2. My soul thirsteth for thee, my flesh also longeth after thee, * in a barren and dry land where no water is.",
  "3. Thus have I looked for thee in holiness, * that I might behold thy power and glory.",
  "4. For thy loving-kindness is better than the life itself; * my lips shall praise thee.",
  "5. As long as I live will I magnify thee on this manner, * and lift up my hands in thy Name.",
  "6. My soul shall be satisfied, even as it were with marrow and fatness, * when my mouth praiseth thee with joyful lips.",
  "7. Have I not remembered thee in my bed, * and thought upon thee when I was waking?",
  "8. Because thou hast been my helper, * therefore under the shadow of thy wings will I rejoice.",
  "9. My soul hangeth upon thee; * thy right hand hath upholden me.",
  "10. These also that seek the hurt of my soul, * they shall go under the earth.",
  "11. Let them fall upon the edge of the sword, * that they may be a portion for foxes.",
  "12. But the King shall rejoice in God; all they also that swear by him shall be commended, * for the mouth of them that speak lies shall be stopped."
]);

p(64, "Exaudi, Deus", [
  "HEAR my voice, O God, in my prayer; * preserve my life from fear of the enemy.",
  "2. Hide me from the gathering together of the froward, * and from the insurrection of wicked doers.",
  "3. Who have whet their tongue like a sword, * and shoot out their arrows, even bitter words.",
  "4. That they may privily shoot at him that is perfect; * suddenly do they hit him, and fear not.",
  "5. They encourage themselves in mischief, and commune among themselves how they may lay snares; and say that no man shall see them. * They imagine wickedness, and practise it; that they keep secret among themselves, every man in the deep of his heart.",
  "6. But God shall suddenly shoot at them with a swift arrow, * that they shall be wounded.",
  "7. Yea, their own tongues shall make them fall; * insomuch that whoso seeth them shall laugh them to scorn.",
  "8. And all men that see it shall say, This hath God done; * for they shall perceive that it is his work.",
  "9. The righteous shall rejoice in the LORD, and put his trust in him; * and all they that are true of heart shall be glad."
]);

p(65, "Te decet hymnus", [
  "THOU, O God, art praised in Sion; * and unto thee shall the vow be performed in Jerusalem.",
  "2. Thou that hearest the prayer, * unto thee shall all flesh come.",
  "3. My misdeeds prevail against me; * O be thou merciful unto our sins.",
  "4. Blessed is the man whom thou choosest and receivest unto thee; * he shall dwell in thy court, and shall be satisfied with the pleasures of thy house, even of thy holy temple.",
  "5. Thou shalt shew us wonderful things in thy righteousness, O God of our salvation; * thou that art the hope of all the ends of the earth, and of them that remain in the broad sea.",
  "6. Who in his strength setteth fast the mountains, * and is girded about with power.",
  "7. Who stilleth the raging of the sea, and the noise of his waves, * and the madness of the people.",
  "8. They also that dwell in the uttermost parts of the earth shall be afraid at thy tokens; * thou that makest the outgoings of the morning and evening to praise thee.",
  "9. Thou visitest the earth, and blessest it; * thou makest it very plenteous.",
  "10. The river of God is full of water; thou preparest their corn, for so thou providest for the earth. * Thou waterest her furrows, thou sendest rain into the little valleys thereof; thou makest it soft with the drops of rain, and blessest the increase of it.",
  "11. Thou crownest the year with thy goodness; * and thy clouds drop fatness.",
  "12. They shall drop upon the dwellings of the wilderness, * and the little hills shall rejoice on every side.",
  "13. The folds shall be full of sheep; * the valleys also shall stand so thick with corn, that they shall laugh and sing."
]);

p(66, "Jubilate Deo", [
  "O BE joyful in God, all ye lands; * sing praises unto the honour of his Name; make his praise to be glorious.",
  "2. Say unto God, O how wonderful art thou in thy works! through the greatness of thy power shall thine enemies be found liars unto thee. * For all the world shall worship thee, sing of thee, and praise thy Name.",
  "3. O come hither, and behold the works of God; * how wonderful he is in his doing toward the children of men.",
  "4. He turned the sea into dry land; so that they went through the water on foot; * there did we rejoice thereof.",
  "5. He ruleth with his power for ever; his eyes behold the people; * and such as will not believe shall not be able to exalt themselves.",
  "6. O praise our God, ye people, * and make the voice of his praise to be heard.",
  "7. Who holdeth our soul in life, * and suffereth not our feet to slip.",
  "8. For thou, O God, hast proved us; * thou also hast tried us, like as silver is tried.",
  "9. Thou broughtest us into the snare, * and laidest trouble upon our loins.",
  "10. Thou sufferedst men to ride over our heads; we went through fire and water, * and thou broughtest us out into a wealthy place.",
  "11. I will go into thine house with burnt-offerings, * and will pay thee my vows, which I promised with my lips, and spake with my mouth, when I was in trouble.",
  "12. I will offer unto thee fat burnt-sacrifices, with the incense of rams; * I will offer bullocks and goats.",
  "13. O come hither, and hearken, all ye that fear God; * and I will tell you what he hath done for my soul.",
  "14. I called unto him with my mouth, * and gave him praises with my tongue.",
  "15. If I incline unto wickedness with mine heart, * the Lord will not hear me.",
  "16. But God hath heard me, * and considered the voice of my prayer.",
  "17. Praised be God, who hath not cast out my prayer, * nor turned his mercy from me."
]);

p(67, "Deus misereatur", [
  "GOD be merciful unto us, and bless us, * and shew us the light of his countenance, and be merciful unto us.",
  "2. That thy way may be known upon earth, * thy saving health among all nations.",
  "3. Let the people praise thee, O God; * yea, let all the people praise thee.",
  "4. O let the nations rejoice and be glad; for thou shalt judge the folk righteously, * and govern the nations upon earth.",
  "5. Let the people praise thee, O God; * yea, let all the people praise thee.",
  "6. Then shall the earth bring forth her increase; * and God, even our own God, shall give us his blessing.",
  "7. God shall bless us; * and all the ends of the world shall fear him."
]);

p(68, "Exurgat Deus", [
  "LET God arise, and let his enemies be scattered; * let them also that hate him flee before him.",
  "2. Like as the smoke vanisheth, so shalt thou drive them away; * and like as wax melteth at the fire, so let the ungodly perish at the presence of God.",
  "3. But let the righteous be glad and rejoice before God; * let them also be merry and joyful.",
  "4. O sing unto God, and sing praises unto his Name; magnify him that rideth upon the heavens, as it were upon an horse; praise him in his Name JAH, and rejoice before him. * He is a Father of the fatherless, and defendeth the cause of the widows; even God in his holy habitation.",
  "5. He is the God that maketh men to be of one mind in an house, and bringeth the prisoners out of captivity; * but letteth the runagates continue in scarceness.",
  "6. O God, when thou wentest forth before the people, * when thou wentest through the wilderness;",
  "7. The earth shook, and the heavens dropped at the presence of God; * even as Sinai also was moved at the presence of God, who is the God of Israel.",
  "8. Thou, O God, sentest a gracious rain upon thine inheritance, * and refreshedst it when it was weary.",
  "9. Thy congregation shall dwell therein; * for thou, O God, hast of thy goodness prepared for the poor.",
  "10. The Lord gave the word; great was the company of the preachers. * Kings with their armies did flee, and were discomfited; and they of the household divided the spoil.",
  "11. Though ye have lien among the pots, yet shall ye be as the wings of a dove, * that is covered with silver wings, and her feathers like gold.",
  "12. When the Almighty scattered kings for their sake, * then were they as white as snow in Salmon.",
  "13. As the hill of Basan, so is God's hill; * even an high hill, as the hill of Basan.",
  "14. Why hop ye so, ye high hills? * this is God's hill, in the which it pleaseth him to dwell; yea, the LORD will abide in it for ever.",
  "15. The chariots of God are twenty thousand, even thousands of angels; * and the Lord is among them, as in the holy place of Sinai.",
  "16. Thou art gone up on high; thou hast led captivity captive, and received gifts for men; * yea, even for thine enemies, that the LORD God might dwell among them.",
  "17. Praised be the Lord daily, * even the God who helpeth us, and poureth his benefits upon us.",
  "18. He is our God, even the God of whom cometh salvation; * God is the Lord, by whom we escape death.",
  "19. God shall wound the head of his enemies, * and the hairy scalp of such a one as goeth on still in his wickedness.",
  "20. The Lord hath said, I will bring my people again, as I did from Basan; mine own will I bring again, as I did sometime from the deep of the sea. * That thy foot may be dipped in the blood of thine enemies, and that the tongue of thy dogs may be red through the same.",
  "21. It is well seen, O God, how thou goest; * how thou, my God and King, goest in the sanctuary.",
  "22. The singers go before, the minstrels follow after, * in the midst are the damsels playing with the timbrels.",
  "23. Give thanks, O Israel, unto God the Lord in the congregations, * from the ground of the heart.",
  "24. There is little Benjamin their ruler, and the princes of Judah their counsel; * the princes of Zabulon, and the princes of Nephthali.",
  "25. Thy God hath sent forth strength for thee; * stablish the thing, O God, that thou hast wrought in us.",
  "26. For thy temple's sake at Jerusalem * shall kings bring presents unto thee.",
  "27. When the company of the spear-men, and multitude of the mighty are scattered abroad among the beasts of the people, so that they humbly bring pieces of silver; * and when he hath scattered the people that delight in war;",
  "28. Then shall the princes come out of Egypt; * the Morians' land shall soon stretch out her hands unto God.",
  "29. Sing unto God, O ye kingdoms of the earth; * O sing praises unto the Lord;",
  "30. Who sitteth in the heavens over all, from the beginning; * lo, he doth send out his voice, yea, and that a mighty voice.",
  "31. Ascribe ye the power to God over Israel; * his worship and strength is in the clouds.",
  "32. O God, wonderful art thou in thy holy places; * even the God of Israel; he will give strength and power unto his people; blessed be God."
]);

p(69, "Salvum me fac", [
  "SAVE me, O God, * for the waters are come in, even unto my soul.",
  "2. I stick fast in the deep mire, where no ground is; * I am come into deep waters, so that the floods run over me.",
  "3. I am weary of crying; my throat is dry; * my sight faileth me for waiting so long upon my God.",
  "4. They that hate me without a cause are more than the hairs of my head; they that are mine enemies, and would destroy me guiltless, are mighty; * and I paid them the things that I never took.",
  "5. God, thou knowest my simpleness; * and my faults are not hid from thee.",
  "6. Let not them that trust in thee, O Lord GOD of hosts, be ashamed for my cause; * let not those that seek thee be confounded through me, O Lord God of Israel.",
  "7. And why? for thy sake have I suffered reproof; * shame hath covered my face.",
  "8. I am become a stranger unto my brethren, * even an alien unto my mother's children.",
  "9. For the zeal of thine house hath even eaten me; * and the rebukes of them that rebuked thee are fallen upon me.",
  "10. I wept, and chastened myself with fasting, * and that was turned to my reproof.",
  "11. I put on sackcloth also; * and they jested upon me.",
  "12. They that sit in the gate speak against me; * and the drunkards make songs upon me.",
  "13. But, LORD, I make my prayer unto thee, * in an acceptable time.",
  "14. Hear me, O God, in the multitude of thy mercy, * even in the truth of thy salvation.",
  "15. Take me out of the mire, that I sink not; * O let me be delivered from them that hate me, and out of the deep waters.",
  "16. Let not the water-flood drown me, neither let the deep swallow me up; * and let not the pit shut her mouth upon me.",
  "17. Hear me, O LORD, for thy loving-kindness is comfortable; * turn thee unto me according to the multitude of thy mercies.",
  "18. And hide not thy face from thy servant, for I am in trouble; * O haste thee, and hear me.",
  "19. Draw nigh unto my soul, and save it; * O deliver me, because of mine enemies.",
  "20. Thou hast known my reproof, my shame, and my dishonour; * mine adversaries are all in thy sight.",
  "21. Thy rebuke hath broken my heart; I am full of heaviness; * I looked for some to have pity on me, but there was no man, neither found I any to comfort me.",
  "22. They gave me gall to eat, * and when I was thirsty, they gave me vinegar to drink.",
  "23. Let their table be made a snare to take themselves withal; * and let the things that should have been for their wealth be unto them an occasion of falling.",
  "24. Let their eyes be blinded, that they see not; * and ever bow thou down their backs.",
  "25. Pour out thine indignation upon them, * and let thy wrathful displeasure take hold of them.",
  "26. Let their habitation be void, * and no man to dwell in their tents.",
  "27. For they persecute him whom thou hast smitten; * and they talk how they may vex them whom thou hast wounded.",
  "28. Let them fall from one wickedness to another, * and not come into thy righteousness.",
  "29. Let them be wiped out of the book of the living, * and not be written among the righteous.",
  "30. As for me, when I am poor and in heaviness, * thy help, O God, shall lift me up.",
  "31. I will praise the Name of God with a song, * and magnify it with thanksgiving.",
  "32. This also shall please the LORD * better than a bullock that hath horns and hoofs.",
  "33. The humble shall consider this, and be glad; * seek ye after God, and your soul shall live.",
  "34. For the LORD heareth the poor, * and despiseth not his prisoners.",
  "35. Let heaven and earth praise him, * the sea, and all that moveth therein.",
  "36. For God will save Sion, and build the cities of Judah, * that men may dwell there, and have it in possession.",
  "37. The posterity also of his servants shall inherit it; * and they that love his Name shall dwell therein."
]);

p(70, "Deus, in adjutorium", [
  "HASTE thee, O God, to deliver me; * make haste to help me, O LORD.",
  "2. Let them be ashamed and confounded that seek after my soul; * let them be turned backward and put to confusion that wish me evil.",
  "3. Let them for their reward be soon brought to shame, * that cry over me, There, there.",
  "4. But let all those that seek thee be joyful and glad in thee; * and let all such as delight in thy salvation say alway, The LORD be praised.",
  "5. As for me, I am poor and in misery; * haste thee unto me, O God.",
  "6. Thou art my helper, and my redeemer; * O LORD, make no long tarrying."
]);

p(71, "In te, Domine, speravi", [
  "IN thee, O LORD, have I put my trust; let me never be put to confusion, * but rid me, and deliver me, in thy righteousness; incline thine ear unto me, and save me.",
  "2. Be thou my strong hold, whereunto I may alway resort; * thou hast promised to help me; for thou art my house of defence, and my castle.",
  "3. Deliver me, O my God, out of the hand of the ungodly; * out of the hand of the unrighteous and cruel man.",
  "4. For thou, O Lord GOD, art the thing that I long for; * thou art my hope, even from my youth.",
  "5. Through thee have I been holden up ever since I was born; thou art he that took me out of my mother's womb; * my praise shall be alway of thee.",
  "6. I am become as it were a monster unto many; * but my sure trust is in thee.",
  "7. O let my mouth be filled with thy praise, * that I may sing of thy glory and honour all the day long.",
  "8. Cast me not away in the time of age; * forsake me not when my strength faileth me.",
  "9. For mine enemies speak against me; and they that lay wait for my soul take their counsel together, saying, * God hath forsaken him; persecute him, and take him; for there is none to deliver him.",
  "10. Go not far from me, O God; * my God, haste thee to help me.",
  "11. Let them be confounded and perish that are against my soul; * let them be covered with shame and dishonour that seek to do me evil.",
  "12. As for me, I will patiently abide alway, * and will praise thee more and more.",
  "13. My mouth shall daily speak of thy righteousness and salvation; * for I know no end thereof.",
  "14. I will go forth in the strength of the Lord GOD, * and will make mention of thy righteousness only.",
  "15. Thou, O God, hast taught me from my youth up until now; * therefore will I tell of thy wondrous works.",
  "16. Forsake me not, O God, in mine old age, when I am gray-headed; * until I have shewed thy strength unto this generation, and thy power to all them that are yet for to come.",
  "17. Thy righteousness, O God, is very high, and great things are they that thou hast done; * O God, who is like unto thee?",
  "18. O what great troubles and adversities hast thou shewed me! and yet didst thou turn and refresh me; * yea, and broughtest me from the deep of the earth again.",
  "19. Thou hast brought me to great honour, * and comforted me on every side.",
  "20. Therefore will I praise thee and thy faithfulness, O God, playing upon an instrument of music; * unto thee will I sing upon the harp, O thou Holy One of Israel.",
  "21. My lips will be fain when I sing unto thee; * and so will my soul whom thou hast delivered.",
  "22. My tongue also shall talk of thy righteousness all the day long; * for they are confounded and brought unto shame that seek to do me evil."
]);

p(72, "Deus, judicium", [
  "GIVE the King thy judgements, O God, * and thy righteousness unto the King's son.",
  "2. Then shall he judge thy people according unto right, * and defend the poor.",
  "3. The mountains also shall bring peace, * and the little hills righteousness unto the people.",
  "4. He shall keep the simple folk by their right; defend the children of the poor, * and punish the wrong doer.",
  "5. They shall fear thee, as long as the sun and moon endureth, * from one generation to another.",
  "6. He shall come down like the rain upon the mown grass, * even as the showers that water the earth.",
  "7. In his time shall the righteous flourish; * yea, and abundance of peace, so long as the moon endureth.",
  "8. His dominion shall be also from the one sea to the other, * and from the flood unto the world's end.",
  "9. They that dwell in the wilderness shall kneel before him; * his enemies shall lick the dust.",
  "10. The kings of Tharsis and of the isles shall give presents; * the kings of Arabia and Saba shall bring gifts.",
  "11. All kings shall fall down before him; * all nations shall do him service.",
  "12. For he shall deliver the poor when he crieth; * the needy also, and him that hath no helper.",
  "13. He shall be favourable to the simple and needy, * and shall preserve the souls of the poor.",
  "14. He shall deliver their souls from falsehood and wrong; * and dear shall their blood be in his sight.",
  "15. He shall live, and unto him shall be given of the gold of Arabia; prayer shall be made ever unto him, * and daily shall he be praised.",
  "16. There shall be an heap of corn in the earth, high upon the hills; his fruit shall shake like Libanus, * and shall be green in the city like grass upon the earth.",
  "17. His Name shall endure for ever; his Name shall remain under the sun among the posterities; * which shall be blessed through him; and all the heathen shall praise him.",
  "18. Blessed be the LORD God, even the God of Israel, * which only doeth wondrous things.",
  "19. And blessed be the Name of his majesty for ever; * and all the earth shall be filled with his majesty. Amen, and Amen.",
  "20. The prayers of David the son of Jesse are ended."
]);

p(73, "Quam bonus Israel", [
  "TRULY God is loving unto Israel, * even unto such as are of a clean heart.",
  "2. Nevertheless, my feet were almost gone; * my treadings had well-nigh slipt.",
  "3. And why? I was grieved at the wicked; * I do also see the ungodly in such prosperity.",
  "4. For they are in no peril of death, * but are lusty and strong.",
  "5. They come in no misfortune like other folk; * neither are they plagued like other men.",
  "6. And this is the cause that they are so holden with pride, * and overwhelmed with cruelty.",
  "7. Their eyes swell with fatness, * and they do even what they lust.",
  "8. They corrupt other, and speak of wicked blasphemy; * their talking is against the most High.",
  "9. For they stretch forth their mouth unto the heaven, * and their tongue goeth through the world.",
  "10. Therefore fall the people unto them, * and thereout suck they no small advantage.",
  "11. Tush, say they, how should God perceive it? * is there knowledge in the most High?",
  "12. Lo, these are the ungodly, these prosper in the world, * and these have riches in possession; and I said, Then have I cleansed my heart in vain, and washed mine hands in innocency.",
  "13. All the day long have I been punished, * and chastened every morning.",
  "14. Yea, and I had almost said even as they; * but lo, then I should have condemned the generation of thy children.",
  "15. Then thought I to understand this; * but it was too hard for me.",
  "16. Until I went into the sanctuary of God; * then understood I the end of these men.",
  "17. Namely, how thou dost set them in slippery places, * and castest them down, and destroyest them.",
  "18. O how suddenly do they consume, perish, and come to a fearful end! * Yea, even like as a dream when one awaketh; so shalt thou make their image to vanish out of the city.",
  "19. Thus my heart was grieved, * and it went even through my reins.",
  "20. So foolish was I, and ignorant; * even as it were a beast before thee.",
  "21. Nevertheless, I am alway by thee; * for thou hast holden me by my right hand.",
  "22. Thou shalt guide me with thy counsel, * and after that receive me with glory.",
  "23. Whom have I in heaven but thee? * and there is none upon earth that I desire in comparison of thee.",
  "24. My flesh and my heart faileth; * but God is the strength of my heart, and my portion for ever.",
  "25. For lo, they that forsake thee shall perish; * thou hast destroyed all them that commit fornication against thee.",
  "26. But it is good for me to hold me fast by God, to put my trust in the Lord GOD, * and to speak of all thy works in the gates of the daughter of Sion."
]);

p(74, "Ut quid, Deus", [
  "O GOD, wherefore art thou absent from us so long? * why is thy wrath so hot against the sheep of thy pasture?",
  "2. O think upon thy congregation, * whom thou hast purchased, and redeemed of old.",
  "3. Think upon the tribe of thine inheritance, * and mount Sion, wherein thou hast dwelt.",
  "4. Lift up thy feet, that thou mayest utterly destroy every enemy; * which hath done evil in thy sanctuary.",
  "5. Thine adversaries roar in the midst of thy congregations, * and set up their banners for tokens.",
  "6. He that hewed timber afore out of the thick trees, * was known to bring it to an excellent work.",
  "7. But now they break down all the carved work thereof * with axes and hammers.",
  "8. They have set fire upon thy holy places, * and have defiled the dwelling-place of thy Name, even unto the ground.",
  "9. Yea, they said in their hearts, Let us make havock of them altogether; * thus have they burnt up all the houses of God in the land.",
  "10. We see not our tokens, there is not one prophet more; * no, not one is there among us, that understandeth any more.",
  "11. O God, how long shall the adversary do this dishonour? * how long shall the enemy blaspheme thy Name, for ever?",
  "12. Why withdrawest thou thy hand? why pluckest thou not thy right hand out of thy bosom * to consume the enemy?",
  "13. For God is my King of old; * the help that is done upon earth, he doeth it himself.",
  "14. Thou didst divide the sea through thy power; * thou brakest the heads of the dragons in the waters.",
  "15. Thou smotest the heads of Leviathan in pieces, * and gavest him to be meat for the people in the wilderness.",
  "16. Thou broughtest out fountains and waters out of the hard rocks; * thou driedst up mighty waters.",
  "17. The day is thine, and the night is thine; * thou hast prepared the light and the sun.",
  "18. Thou hast set all the borders of the earth; * thou hast made summer and winter.",
  "19. Remember this, O LORD, how the enemy hath rebuked, * and how the foolish people hath blasphemed thy Name.",
  "20. O deliver not the soul of thy turtle-dove unto the multitude of the enemies; * and forget not the congregation of the poor for ever.",
  "21. Look upon the covenant; * for all the earth is full of darkness, and cruel habitations.",
  "22. O let not the simple go away ashamed; * but let the poor and needy give praise unto thy Name.",
  "23. Arise, O God, maintain thine own cause; * remember how the foolish man blasphemeth thee daily.",
  "24. Forget not the voice of thine enemies; * the presumptuousness of them that hate thee increaseth ever more and more."
]);

p(75, "Confitebimur tibi", [
  "UNTO thee, O God, do we give thanks; * yea, unto thee do we give thanks.",
  "2. Thy Name also is so nigh, * and that do thy wondrous works declare.",
  "3. When I receive the congregation, * I shall judge according unto right.",
  "4. The earth is weak, and all the inhabiters thereof; * I bear up the pillars of it.",
  "5. I said unto the fools, Deal not so madly; * and to the ungodly, Set not up your horn.",
  "6. Set not up your horn on high; * and speak not with a stiff neck.",
  "7. For promotion cometh neither from the east, nor from the west, * nor yet from the south.",
  "8. And why? God is the Judge; * he putteth down one, and setteth up another.",
  "9. For in the hand of the LORD there is a cup, and the wine is red; it is full mixt, and he poureth out of the same. * As for the dregs thereof, all the ungodly of the earth shall drink them, and suck them out.",
  "10. But I will talk of the God of Jacob, * and praise him for ever.",
  "11. All the horns of the ungodly also will I break; * and the horns of the righteous shall be exalted."
]);

p(76, "Notus in Judaea", [
  "IN Jewry is God known; * his Name is great in Israel.",
  "2. At Salem is his tabernacle, * and his dwelling in Sion.",
  "3. There brake he the arrows of the bow, * the shield, the sword, and the battle.",
  "4. Thou art of more honour and might * than the hills of the robbers.",
  "5. The proud are robbed, they have slept their sleep; * and all the men whose hands were mighty have found nothing.",
  "6. At thy rebuke, O God of Jacob, * both the chariot and horse are fallen.",
  "7. Thou, even thou art to be feared; * and who may stand in thy sight when thou art angry?",
  "8. Thou didst cause thy judgement to be heard from heaven; * the earth trembled, and was still.",
  "9. When God arose to judgement, * and to help all the meek upon earth.",
  "10. The fierceness of man shall turn to thy praise; * and the fierceness of them shalt thou refrain.",
  "11. Promise unto the LORD your God, and keep it, all ye that are round about him; * bring presents unto him that ought to be feared.",
  "12. He shall refrain the spirit of princes, * and is wonderful among the kings of the earth."
]);

p(77, "Voce mea ad Dominum", [
  "I WILL cry unto God with my voice; * even unto God will I cry with my voice, and he shall hearken unto me.",
  "2. In the time of my trouble I sought the Lord; * my sore ran, and ceased not in the night-season; my soul refused comfort.",
  "3. When I am in heaviness, I will think upon God; * when my heart is vexed, I will complain.",
  "4. Thou holdest mine eyes waking; * I am so feeble that I cannot speak.",
  "5. I have considered the days of old, * and the years that are past.",
  "6. I call to remembrance my song, * and in the night I commune with mine own heart, and search out my spirits.",
  "7. Will the Lord absent himself for ever? * and will he be no more intreated?",
  "8. Is his mercy clean gone for ever? * and is his promise come utterly to an end for evermore?",
  "9. Hath God forgotten to be gracious? * and will he shut up his loving-kindness in displeasure?",
  "10. And I said, It is mine own infirmity; * but I will remember the years of the right hand of the most Highest.",
  "11. I will remember the works of the LORD, * and call to mind thy wonders of old time.",
  "12. I will think also of all thy works, * and my talking shall be of thy doings.",
  "13. Thy way, O God, is holy; * who is so great a God as our God?",
  "14. Thou art the God that doest wonders; * thou hast declared thy power among the people.",
  "15. Thou hast mightily delivered thy people, * even the sons of Jacob and Joseph.",
  "16. The waters saw thee, O God, the waters saw thee, and were afraid; * the depths also were troubled.",
  "17. The clouds poured out water, the air thundered, * and thine arrows went abroad.",
  "18. The voice of thy thunder was heard round about; the lightnings shone upon the ground; the earth was moved and shook withal. * Thy way is in the sea, and thy paths in the great waters; and thy footsteps are not known.",
  "19. Thou leddest thy people like sheep, * by the hand of Moses and Aaron."
]);

p(78, "Attendite, popule", [
  "HEAR my law, O my people; * incline your ears unto the words of my mouth.",
  "2. I will open my mouth in a parable; * I will declare hard sentences of old.",
  "3. Which we have heard and known, * and such as our fathers have told us.",
  "4. That we should not hide them from the children of the generations to come; * but to shew the honour of the LORD, his mighty and wonderful works that he hath done.",
  "5. He made a covenant with Jacob, and gave Israel a law, * which he commanded our forefathers to teach their children.",
  "6. That their posterity might know it; * and the children which were yet unborn.",
  "7. To the intent that when they came up, * they might shew their children the same.",
  "8. That they might put their trust in God; * and not to forget the works of God, but to keep his commandments.",
  "9. And not to be as their forefathers, a faithless and stubborn generation; * a generation that set not their heart aright, and whose spirit cleaveth not stedfastly unto God.",
  "10. Like as the children of Ephraim, who being harnessed, and carrying bows, * turned themselves back in the day of battle.",
  "11. They kept not the covenant of God, * and would not walk in his law.",
  "12. But forgat what he had done, * and the wonderful works that he had shewed for them.",
  "13. Marvellous things did he in the sight of our forefathers, in the land of Egypt, * even in the field of Zoan.",
  "14. He divided the sea, and let them go through; * he made the waters to stand on an heap.",
  "15. In the day-time also he led them with a cloud, * and all the night through with a light of fire.",
  "16. He clave the hard rocks in the wilderness, * and gave them drink thereof, as it had been out of the great depth.",
  "17. He brought waters out of the stony rock, * so that it gushed out like the rivers.",
  "18. Yet for all this they sinned more against him, * and provoked the most Highest in the wilderness.",
  "19. They tempted God in their hearts, * and required meat for their lust.",
  "20. They spake against God also, saying, * Shall God prepare a table in the wilderness?",
  "21. He smote the stony rock indeed, that the water gushed out, and the streams flowed withal; * but can he give bread also, or provide flesh for his people?",
  "22. When the LORD heard this, he was wroth; * so the fire was kindled in Jacob, and there came up heavy displeasure against Israel.",
  "23. Because they believed not in God, * and put not their trust in his help.",
  "24. So he commanded the clouds above, * and opened the doors of heaven.",
  "25. He rained down manna also upon them for to eat, * and gave them food from heaven.",
  "26. So man did eat angels' food; * for he sent them meat enough.",
  "27. He caused the east-wind to blow under heaven; * and through his power he brought in the south-west-wind.",
  "28. He rained flesh upon them as thick as dust, * and feathered fowls like as the sand of the sea.",
  "29. He let it fall among their tents, * even round about their habitation.",
  "30. So they did eat, and were well filled; * for he gave them their own desire.",
  "31. They were not disappointed of their lust: * but while the meat was yet in their mouths,",
  "32. The heavy wrath of God came upon them, and slew the wealthiest of them; * yea, and smote down the chosen men that were in Israel.",
  "33. But for all this they sinned yet more, * and believed not his wondrous works.",
  "34. Therefore their days did he consume in vanity, * and their years in trouble.",
  "35. When he slew them, they sought him, * and turned them early, and enquired after God.",
  "36. And they remembered that God was their strength, * and that the most High God was their redeemer.",
  "37. Nevertheless, they did but flatter him with their mouth, * and dissembled with him in their tongue.",
  "38. For their heart was not whole with him; * neither continued they stedfast in his covenant.",
  "39. But he was so merciful, that he forgave their misdeeds, * and destroyed them not.",
  "40. Yea, many a time turned he his wrath away, * and would not suffer his whole displeasure to arise.",
  "41. For he considered that they were but flesh; * and that they were even a wind that passeth away, and cometh not again.",
  "42. Many a time did they provoke him in the wilderness, * and grieved him in the desert.",
  "43. They turned back, and tempted God, * and moved the Holy One in Israel.",
  "44. They thought not of his hand, * and of the day when he delivered them from the hand of the enemy.",
  "45. How he had wrought his miracles in Egypt, * and his wonders in the field of Zoan.",
  "46. He turned their waters into blood; * so that they might not drink of the rivers.",
  "47. He sent lice among them, and devoured them up; * and frogs, to destroy them.",
  "48. He gave their fruit unto the caterpillar, * and their labour unto the grasshopper.",
  "49. He destroyed their vines with hailstones, * and their mulberry-trees with the frost.",
  "50. He smote their cattle also with hailstones, * and their flocks with hot thunderbolts.",
  "51. He cast upon them the furiousness of his wrath, anger, displeasure, and trouble; * and sent evil angels among them.",
  "52. He made a way to his indignation, and spared not their soul from death; * but gave their life over to the pestilence.",
  "53. And smote all the first-born in Egypt; * the most principal and mightiest in the dwellings of Ham.",
  "54. But as for his own people, he led them forth like sheep, * and carried them in the wilderness like a flock.",
  "55. He brought them out safely, that they should not fear; * and overwhelmed their enemies with the sea.",
  "56. And brought them within the borders of his sanctuary, * even to his mountain which he purchased with his right hand.",
  "57. He cast out the heathen also before them; caused their land to be divided among them for an heritage, * and made the tribes of Israel to dwell in their tents.",
  "58. So they tempted and displeased the most high God, * and kept not his testimonies.",
  "59. But turned their backs, and fell away like their forefathers; * starting aside like a broken bow.",
  "60. For they grieved him with their hill-altars, * and provoked him to displeasure with their images.",
  "61. When God heard this, he was wroth, * and took sore displeasure at Israel.",
  "62. So that he forsook the tabernacle in Silo, * even the tent that he had pitched among men.",
  "63. He delivered their power into captivity, * and their beauty into the enemy's hand.",
  "64. He gave his people over also unto the sword; * and was wroth with his inheritance.",
  "65. The fire consumed their young men; * and their maidens were not given to marriage.",
  "66. Their priests were slain with the sword; * and there were no widows to make lamentation.",
  "67. So the Lord awaked as one out of sleep, * and like a giant refreshed with wine.",
  "68. He smote his enemies in the hinder parts, * and put them to a perpetual shame.",
  "69. He refused the tabernacle of Joseph, * and chose not the tribe of Ephraim.",
  "70. But chose the tribe of Judah, * even the hill of Sion which he loved.",
  "71. And there he built his temple on high, * and laid the foundation of it like the ground which he hath made continually.",
  "72. He chose David also his servant, * and took him away from the sheep-folds.",
  "73. As he was following the ewes great with young ones, he took him, * that he might feed Jacob his people, and Israel his inheritance.",
  "74. So he fed them with a faithful and true heart, * and ruled them prudently with all his power."
]);

p(79, "Deus, venerunt", [
  "O GOD, the heathen are come into thine inheritance; thy holy temple have they defiled, * and made Jerusalem an heap of stones.",
  "2. The dead bodies of thy servants have they given to be meat unto the fowls of the air; * and the flesh of thy saints unto the beasts of the land.",
  "3. Their blood have they shed like water on every side of Jerusalem; * and there was no man to bury them.",
  "4. We are become an open shame to our enemies, * a very scorn and derision unto them that are round about us.",
  "5. LORD, how long wilt thou be angry? * shall thy jealousy burn like fire for ever?",
  "6. Pour out thine indignation upon the heathen that have not known thee, * and upon the kingdoms that have not called upon thy Name.",
  "7. For they have devoured Jacob, * and laid waste his dwelling-place.",
  "8. O remember not our old sins, but have mercy upon us, and that soon; * for we are come to great misery.",
  "9. Help us, O God of our salvation, for the glory of thy Name; * O deliver us, and be merciful unto our sins, for thy Name's sake.",
  "10. Wherefore do the heathen say, Where is now their God? * let vengeance for the blood of thy servants that is shed be openly shewed among the heathen in our sight.",
  "11. O let the sorrowful sighing of the prisoners come before thee; * according to the greatness of thy power, preserve thou those that are appointed to die.",
  "12. And for the blasphemy wherewith our neighbours have blasphemed thee, * reward thou them, O LORD, seven-fold into their bosom.",
  "13. So we, that are thy people and sheep of thy pasture, shall give thee thanks for ever; * and will alway be shewing forth thy praise from generation to generation."
]);

p(80, "Qui regis Israel", [
  "HEAR, O thou Shepherd of Israel, thou that leadest Joseph like a sheep; * shew thyself also, thou that sittest upon the cherubins.",
  "2. Before Ephraim, Benjamin, and Manasses, * stir up thy strength, and come and help us.",
  "3. Turn us again, O God; * shew the light of thy countenance, and we shall be whole.",
  "4. O LORD God of hosts, * how long wilt thou be angry with thy people that prayeth?",
  "5. Thou feedest them with the bread of tears; * and givest them plenteousness of tears to drink.",
  "6. Thou hast made us a very strife unto our neighbours; * and our enemies laugh us to scorn.",
  "7. Turn us again, thou God of hosts; * shew the light of thy countenance, and we shall be whole.",
  "8. Thou hast brought a vine out of Egypt; * thou hast cast out the heathen, and planted it.",
  "9. Thou madest room for it; * and when it had taken root, it filled the land.",
  "10. The hills were covered with the shadow of it, * and the boughs thereof were like the goodly cedar-trees.",
  "11. She stretched out her branches unto the sea, * and her boughs unto the river.",
  "12. Why hast thou then broken down her hedge, * that all they that go by pluck off her grapes?",
  "13. The wild boar out of the wood doth root it up; * and the wild beasts of the field devour it.",
  "14. Turn thee again, thou God of hosts, look down from heaven; behold and visit this vine, * and the place of the vineyard that thy right hand hath planted, and the branch that thou madest so strong for thyself.",
  "15. It is burnt with fire, and cut down; * and they shall perish at the rebuke of thy countenance.",
  "16. Let thy hand be upon the man of thy right hand, * and upon the son of man whom thou madest so strong for thine own self.",
  "17. And so will not we go back from thee; * O let us live, and we shall call upon thy Name.",
  "18. Turn us again, O LORD God of hosts; * shew the light of thy countenance, and we shall be whole."
]);

p(81, "Exultate Deo", [
  "SING we merrily unto God our strength; * make a cheerful noise unto the God of Jacob.",
  "2. Take the psalm, bring hither the tabret, * the merry harp with the lute.",
  "3. Blow up the trumpet in the new-moon, * even in the time appointed, and upon our solemn feast-day.",
  "4. For this was made a statute for Israel, * and a law of the God of Jacob.",
  "5. This he ordained in Joseph for a testimony, * when he came out of the land of Egypt, and had heard a strange language.",
  "6. I eased his shoulder from the burden, * and his hands were delivered from making the pots.",
  "7. Thou calledst upon me in troubles, and I delivered thee, * and heard thee what time as the storm fell upon thee; I proved thee also at the waters of strife.",
  "8. Hear, O my people, and I will assure thee, O Israel; * if thou wilt hearken unto me,",
  "9. There shall no strange god be in thee; * neither shalt thou worship any other god.",
  "10. I am the LORD thy God, who brought thee out of the land of Egypt; * open thy mouth wide, and I shall fill it.",
  "11. But my people would not hear my voice; * and Israel would not obey me.",
  "12. So I gave them up unto their own hearts' lusts; * and let them follow their own imaginations.",
  "13. O that my people would have hearkened unto me! * for if Israel had walked in my ways,",
  "14. I should soon have put down their enemies; * and turned my hand against their adversaries.",
  "15. The haters of the LORD should have been found liars; * but their time should have endured for ever.",
  "16. He should have fed them also with the finest wheat-flour; * and with honey out of the stony rock should I have satisfied thee."
]);

p(82, "Deus stetit", [
  "GOD standeth in the congregation of princes; * he is a Judge among gods.",
  "2. How long will ye give wrong judgement, * and accept the persons of the ungodly?",
  "3. Defend the poor and fatherless; * see that such as are in need and necessity have right.",
  "4. Deliver the outcast and poor; * save them from the hand of the ungodly.",
  "5. They will not be learned nor understand, but walk on still in darkness; * all the foundations of the earth are out of course.",
  "6. I have said, Ye are gods, * and ye are all children of the most Highest.",
  "7. But ye shall die like men, * and fall like one of the princes.",
  "8. Arise, O God, and judge thou the earth; * for thou shalt take all heathen to thine inheritance."
]);

p(83, "Deus, quis similis", [
  "HOLD not thy tongue, O God, keep not still silence; * refrain not thyself, O God.",
  "2. For lo, thine enemies make a murmuring; * and they that hate thee have lift up their head.",
  "3. They have imagined craftily against thy people, * and taken counsel against thy secret ones.",
  "4. They have said, Come, and let us root them out, that they be no more a people; * and that the name of Israel may be no more in remembrance.",
  "5. For they have cast their heads together with one consent, * and are confederate against thee.",
  "6. The tabernacles of the Edomites, and the Ishmaelites; * the Moabites, and Hagarenes;",
  "7. Gebal, and Ammon, and Amalek; * the Philistines, with them that dwell at Tyre.",
  "8. Assur also is joined with them, * and have holpen the children of Lot.",
  "9. But do thou to them as unto the Madianites; * unto Sisera, and unto Jabin at the brook of Kison.",
  "10. Who perished at Endor; * and became as the dung of the earth.",
  "11. Make them and their princes like Oreb and Zeb; * yea, make all their princes like as Zebah and Salmana.",
  "12. Who say, Let us take to ourselves * the houses of God in possession.",
  "13. O my God, make them like unto a wheel, * and as the stubble before the wind.",
  "14. Like as the fire that burneth up the wood, * and as the flame that consumeth the mountains.",
  "15. Persecute them even so with thy tempest, * and make them afraid with thy storm.",
  "16. Make their faces ashamed, O LORD, * that they may seek thy Name.",
  "17. Let them be confounded and vexed ever more and more; * let them be put to shame, and perish.",
  "18. And they shall know that thou, whose Name is JEHOVAH, * art only the most Highest over all the earth."
]);

p(84, "Quam dilecta", [
  "O HOW amiable are thy dwellings, * thou LORD of hosts!",
  "2. My soul hath a desire and longing to enter into the courts of the LORD; * my heart and my flesh rejoice in the living God.",
  "3. Yea, the sparrow hath found her an house, and the swallow a nest where she may lay her young; * even thy altars, O LORD of hosts, my King and my God.",
  "4. Blessed are they that dwell in thy house; * they will be alway praising thee.",
  "5. Blessed is the man whose strength is in thee; * in whose heart are thy ways.",
  "6. Who going through the vale of misery use it for a well; * and the pools are filled with water.",
  "7. They will go from strength to strength, * and unto the God of gods appeareth every one of them in Sion.",
  "8. O LORD God of hosts, hear my prayer; * hearken, O God of Jacob.",
  "9. Behold, O God our defender, * and look upon the face of thine Anointed.",
  "10. For one day in thy courts * is better than a thousand.",
  "11. I had rather be a door-keeper in the house of my God, * than to dwell in the tents of ungodliness.",
  "12. For the LORD God is a light and defence; * the LORD will give grace and worship, and no good thing shall he withhold from them that live a godly life.",
  "13. O LORD God of hosts, * blessed is the man that putteth his trust in thee."
]);

p(85, "Benedixisti, Domine", [
  "LORD, thou art become gracious unto thy land; * thou hast turned away the captivity of Jacob.",
  "2. Thou hast forgiven the offence of thy people, * and covered all their sins.",
  "3. Thou hast taken away all thy displeasure, * and turned thyself from thy wrathful indignation.",
  "4. Turn us then, O God our Saviour, * and let thine anger cease from us.",
  "5. Wilt thou be displeased at us for ever? * and wilt thou stretch out thy wrath from one generation to another?",
  "6. Wilt thou not turn again and quicken us, * that thy people may rejoice in thee?",
  "7. Shew us thy mercy, O LORD, * and grant us thy salvation.",
  "8. I will hearken what the LORD God will say concerning me; * for he shall speak peace unto his people and to his saints, that they turn not again.",
  "9. For his salvation is nigh them that fear him, * that glory may dwell in our land.",
  "10. Mercy and truth are met together; * righteousness and peace have kissed each other.",
  "11. Truth shall flourish out of the earth; * and righteousness hath looked down from heaven.",
  "12. Yea, the LORD shall shew loving-kindness; * and our land shall give her increase.",
  "13. Righteousness shall go before him; * and he shall direct his going in the way."
]);

p(86, "Inclina, Domine", [
  "BOW down thine ear, O LORD, and hear me; * for I am poor and in misery.",
  "2. Preserve thou my soul, for I am holy; * my God, save thy servant that putteth his trust in thee.",
  "3. Be merciful unto me, O Lord; * for I will call daily upon thee.",
  "4. Comfort the soul of thy servant; * for unto thee, O Lord, do I lift up my soul.",
  "5. For thou, Lord, art good and gracious, * and of great mercy unto all them that call upon thee.",
  "6. Give ear, LORD, unto my prayer; * and ponder the voice of my humble desires.",
  "7. In the time of my trouble I will call upon thee; * for thou hearest me.",
  "8. Among the gods there is none like unto thee, O Lord; * there is not one that can do as thou doest.",
  "9. All nations whom thou hast made shall come and worship thee, O Lord; * and shall glorify thy Name.",
  "10. For thou art great, and doest wondrous things; * thou art God alone.",
  "11. Teach me thy way, O LORD, and I will walk in thy truth; * O knit my heart unto thee, that I may fear thy Name.",
  "12. I will thank thee, O Lord my God, with all my heart; * and will praise thy Name for evermore.",
  "13. For great is thy mercy toward me; * and thou hast delivered my soul from the nethermost hell.",
  "14. O God, the proud are risen against me; and the congregations of naughty men have sought after my soul, * and have not set thee before their eyes.",
  "15. But thou, O Lord God, art full of compassion and mercy; * long-suffering, plenteous in goodness and truth.",
  "16. O turn thee then unto me, and have mercy upon me; * give thy strength unto thy servant, and help the son of thine handmaid.",
  "17. Shew some token upon me for good, that they who hate me may see it, and be ashamed; * because thou, LORD, hast holpen me, and comforted me."
]);

p(87, "Fundamenta ejus", [
  "HER foundations are upon the holy hills; * the LORD loveth the gates of Sion more than all the dwellings of Jacob.",
  "2. Very excellent things are spoken of thee, * thou city of God.",
  "3. I will think upon Rahab and Babylon, * with them that know me.",
  "4. Behold ye the Philistines also, and they of Tyre, with the Morians; * lo, there was he born.",
  "5. And of Sion it shall be reported, that he was born in her; * and the most High shall stablish her.",
  "6. The LORD shall rehearse it, when he writeth up the people, * that he was born there.",
  "7. The singers also and trumpeters shall he rehearse; * All my fresh springs shall be in thee."
]);

p(88, "Domine Deus salutis", [
  "O LORD God of my salvation, I have cried day and night before thee; * O let my prayer enter into thy presence; incline thine ear unto my calling.",
  "2. For my soul is full of trouble, * and my life draweth nigh unto hell.",
  "3. I am counted as one of them that go down into the pit; * and I have been even as a man that hath no strength.",
  "4. Free among the dead, like unto them that are wounded, and lie in the grave; * who are out of remembrance, and are cut away from thy hand.",
  "5. Thou hast laid me in the lowest pit, * in a place of darkness, and in the deep.",
  "6. Thine indignation lieth hard upon me; * and thou hast vexed me with all thy storms.",
  "7. Thou hast put away mine acquaintance far from me; * and made me to be abhorred of them.",
  "8. I am so fast in prison, * that I cannot get forth.",
  "9. My sight faileth for very trouble; * LORD, I have called daily upon thee; I have stretched forth my hands unto thee.",
  "10. Dost thou shew wonders among the dead? * or shall the dead rise up again, and praise thee?",
  "11. Shall thy loving-kindness be shewed in the grave? * or thy faithfulness in destruction?",
  "12. Shall thy wondrous works be known in the dark? * and thy righteousness in the land where all things are forgotten?",
  "13. Unto thee have I cried, O LORD, * and early shall my prayer come before thee.",
  "14. LORD, why abhorrest thou my soul? * and why hidest thou thy face from me?",
  "15. I am in misery, and like unto him that is at the point to die; * even from my youth up thy terrors have I suffered with a troubled mind.",
  "16. Thy wrathful displeasure goeth over me; * and the fear of thee hath undone me.",
  "17. They came round about me daily like water, * and compassed me together on every side.",
  "18. My lovers and friends hast thou put away from me, * and hid mine acquaintance out of my sight."
]);

p(89, "Misericordias Domini", [
  "MY song shall be alway of the loving-kindness of the LORD; * with my mouth will I ever be shewing thy truth from one generation to another.",
  "2. For I have said, Mercy shall be set up for ever; * thy truth shalt thou stablish in the heavens.",
  "3. I have made a covenant with my chosen; * I have sworn unto David my servant.",
  "4. Thy seed will I stablish for ever, * and set up thy throne from one generation to another.",
  "5. O LORD, the very heavens shall praise thy wondrous works; * and thy truth in the congregation of the saints.",
  "6. For who is he among the clouds, that shall be compared unto the LORD? * and what is he among the gods, that shall be like unto the LORD?",
  "7. God is very greatly to be feared in the council of the saints, * and to be had in reverence of all them that are round about him.",
  "8. O LORD God of hosts, who is like unto thee? * thy truth, most mighty LORD, is on every side.",
  "9. Thou rulest the raging of the sea; * thou stillest the waves thereof when they arise.",
  "10. Thou hast subdued Egypt, and destroyed it; * thou hast scattered thine enemies abroad with thy mighty arm.",
  "11. The heavens are thine, the earth also is thine; * thou hast laid the foundation of the round world, and all that therein is.",
  "12. Thou hast made the north and the south; * Tabor and Hermon shall rejoice in thy Name.",
  "13. Thou hast a mighty arm; * strong is thy hand, and high is thy right hand.",
  "14. Righteousness and equity are the habitation of thy seat; * mercy and truth shall go before thy face.",
  "15. Blessed is the people, O LORD, that can rejoice in thee; * they shall walk in the light of thy countenance.",
  "16. Their delight shall be daily in thy Name; * and in thy righteousness shall they make their boast.",
  "17. For thou art the glory of their strength; * and in thy loving-kindness thou shalt lift up our horns.",
  "18. For the LORD is our defence; * the Holy One of Israel is our King.",
  "19. Thou spakest sometime in visions unto thy saints, and saidst; * I have laid help upon one that is mighty; I have exalted one chosen out of the people.",
  "20. I have found David my servant; * with my holy oil have I anointed him.",
  "21. My hand shall hold him fast, * and my arm shall strengthen him.",
  "22. The enemy shall not be able to do him violence; * the son of wickedness shall not hurt him.",
  "23. I will smite down his foes before his face, * and plague them that hate him.",
  "24. My truth also and my mercy shall be with him; * and in my Name shall his horn be exalted.",
  "25. I will set his dominion also in the sea, * and his right hand in the floods.",
  "26. He shall call me, Thou art my Father, * my God, and my strong salvation.",
  "27. And I will make him my first-born; * higher than the kings of the earth.",
  "28. My mercy will I keep for him for evermore, * and my covenant shall stand fast with him.",
  "29. His seed also will I make to endure for ever, * and his throne as the days of heaven.",
  "30. But if his children forsake my law, * and walk not in my judgements;",
  "31. If they break my statutes, and keep not my commandments; * I will visit their offences with the rod, and their sin with scourges.",
  "32. Nevertheless, my loving-kindness will I not utterly take from him, * nor suffer my truth to fail.",
  "33. My covenant will I not break, * nor alter the thing that is gone out of my lips.",
  "34. I have sworn once by my holiness, * that I will not fail David.",
  "35. His seed shall endure for ever, * and his seat is like as the sun before me.",
  "36. He shall stand fast for evermore as the moon, * and as the faithful witness in heaven.",
  "37. But thou hast abhorred and forsaken thine Anointed, * and art displeased at him.",
  "38. Thou hast broken the covenant of thy servant, * and cast his crown to the ground.",
  "39. Thou hast overthrown all his hedges, * and broken down his strong holds.",
  "40. All they that go by spoil him; * and he is become a reproach to his neighbours.",
  "41. Thou hast set up the right hand of his enemies, * and made all his adversaries to rejoice.",
  "42. Thou hast also turned the edge of his sword, * and hast not made him to stand in the battle.",
  "43. Thou hast put out his glory, * and cast his throne down to the ground.",
  "44. The days of his youth hast thou shortened, * and covered him with dishonour.",
  "45. LORD, how long wilt thou hide thyself? for ever? * and shall thy wrath burn like fire?",
  "46. O remember how short my time is; * wherefore hast thou made all men for nought?",
  "47. What man is he that liveth, and shall not see death? * and shall he deliver his soul from the hand of hell?",
  "48. Lord, where are thy old loving-kindnesses, * which thou swarest unto David in thy truth?",
  "49. Remember, Lord, the rebuke that thy servants have; * and how I do bear in my bosom the rebukes of many people.",
  "50. Wherewith thine enemies have blasphemed thee, and slandered the footsteps of thine Anointed; * praised be the LORD for evermore. Amen, and Amen."
]);

p(90, "Domine, refugium", [
  "LORD, thou hast been our refuge, * from one generation to another.",
  "2. Before the mountains were brought forth, or ever the earth and the world were made, * thou art God from everlasting, and world without end.",
  "3. Thou turnest man to destruction; * again thou sayest, Come again, ye children of men.",
  "4. For a thousand years in thy sight are but as yesterday; seeing that is past as a watch in the night. * As soon as thou scatterest them they are even as a sleep; and fade away suddenly like the grass.",
  "5. In the morning it is green, and groweth up; * but in the evening it is cut down, dried up, and withered.",
  "6. For we consume away in thy displeasure; * and are afraid at thy wrathful indignation.",
  "7. Thou hast set our misdeeds before thee; * and our secret sins in the light of thy countenance.",
  "8. For when thou art angry, all our days are gone; * we bring our years to an end, as it were a tale that is told.",
  "9. The days of our age are threescore years and ten; and though men be so strong that they come to fourscore years, * yet is their strength then but labour and sorrow; so soon passeth it away, and we are gone.",
  "10. But who regardeth the power of thy wrath; * for even thereafter as a man feareth, so is thine indignation.",
  "11. So teach us to number our days, * that we may apply our hearts unto wisdom.",
  "12. Turn thee again, O LORD, at the last; * and be gracious unto thy servants.",
  "13. O satisfy us with thy mercy, and that soon; * so shall we rejoice and be glad all the days of our life.",
  "14. Comfort us again now after the time that thou hast plagued us, * and for the years wherein we have suffered adversity.",
  "15. Shew thy servants thy work, * and their children thy glory.",
  "16. And the glorious majesty of the LORD our God be upon us; * prosper thou the work of our hands upon us, O prosper thou our handy-work."
]);

p(91, "Qui habitat", [
  "WHOSO dwelleth under the defence of the most High, * shall abide under the shadow of the Almighty.",
  "2. I will say unto the LORD, Thou art my hope and my stronghold; * my God, in him will I trust.",
  "3. For he shall deliver thee from the snare of the hunter, * and from the noisome pestilence.",
  "4. He shall defend thee under his wings, and thou shalt be safe under his feathers; * his faithfulness and truth shall be thy shield and buckler.",
  "5. Thou shalt not be afraid for any terror by night, * nor for the arrow that flieth by day.",
  "6. For the pestilence that walketh in darkness, * nor for the sickness that destroyeth in the noon-day.",
  "7. A thousand shall fall beside thee, and ten thousand at thy right hand; * but it shall not come nigh thee.",
  "8. Yea, with thine eyes shalt thou behold, * and see the reward of the ungodly.",
  "9. For thou, LORD, art my hope; * thou hast set thine house of defence very high.",
  "10. There shall no evil happen unto thee, * neither shall any plague come nigh thy dwelling.",
  "11. For he shall give his angels charge over thee, * to keep thee in all thy ways.",
  "12. They shall bear thee in their hands, * that thou hurt not thy foot against a stone.",
  "13. Thou shalt go upon the lion and adder; * the young lion and the dragon shalt thou tread under thy feet.",
  "14. Because he hath set his love upon me, therefore will I deliver him; * I will set him up, because he hath known my Name.",
  "15. He shall call upon me, and I will hear him; * yea, I am with him in trouble; I will deliver him, and bring him to honour.",
  "16. With long life will I satisfy him, * and shew him my salvation."
]);

p(92, "Bonum est confiteri", [
  "IT is a good thing to give thanks unto the LORD, * and to sing praises unto thy Name, O most Highest.",
  "2. To tell of thy loving-kindness early in the morning, * and of thy truth in the night-season.",
  "3. Upon an instrument of ten strings, and upon the lute; * upon a loud instrument, and upon the harp.",
  "4. For thou, LORD, hast made me glad through thy works; * and I will rejoice in giving praise for the operations of thy hands.",
  "5. O LORD, how glorious are thy works! * thy thoughts are very deep.",
  "6. An unwise man doth not well consider this, * and a fool doth not understand it.",
  "7. When the ungodly are green as the grass, and when all the workers of wickedness do flourish, * then shall they be destroyed for ever; but thou, LORD, art the most Highest for evermore.",
  "8. For lo, thine enemies, O LORD, lo, thine enemies shall perish; * and all the workers of wickedness shall be destroyed.",
  "9. But mine horn shall be exalted like the horn of an unicorn; * for I am anointed with fresh oil.",
  "10. Mine eye also shall see his lust of mine enemies; * and mine ear shall hear his desire of the wicked that arise up against me.",
  "11. The righteous shall flourish like a palm-tree, * and shall spread abroad like a cedar in Libanus.",
  "12. Such as are planted in the house of the LORD * shall flourish in the courts of the house of our God.",
  "13. They also shall bring forth more fruit in their age; * and shall be fat and well-liking.",
  "14. That they may shew how true the LORD my strength is; * and that there is no unrighteousness in him."
]);

p(93, "Dominus regnavit", [
  "THE LORD is King, and hath put on glorious apparel; * the LORD hath put on his apparel, and girded himself with strength.",
  "2. He hath made the round world so sure, * that it cannot be moved.",
  "3. Ever since the world began hath thy seat been prepared; * thou art from everlasting.",
  "4. The floods are risen, O LORD, the floods have lift up their voice; * the floods lift up their waves.",
  "5. The waves of the sea are mighty, and rage horribly; * but yet the LORD, who dwelleth on high, is mightier.",
  "6. Thy testimonies, O LORD, are very sure; * holiness becometh thine house for ever."
]);

p(94, "Deus ultionum", [
  "O LORD God, to whom vengeance belongeth; * thou God, to whom vengeance belongeth, shew thyself.",
  "2. Arise, thou Judge of the world, * and reward the proud after their deserving.",
  "3. LORD, how long shall the ungodly, * how long shall the ungodly triumph?",
  "4. How long shall all wicked doers speak so disdainfully, * and make such proud boasting?",
  "5. They smite down thy people, O LORD, * and trouble thine heritage.",
  "6. They murder the widow and the stranger, * and put the fatherless to death.",
  "7. And yet they say, Tush, the LORD shall not see; * neither shall the God of Jacob regard it.",
  "8. Take heed, ye unwise among the people; * O ye fools, when will ye understand?",
  "9. He that planted the ear, shall he not hear? * or he that made the eye, shall he not see?",
  "10. Or he that nurtureth the heathen, it is he that teacheth man knowledge, shall not he punish? * and the LORD knoweth the thoughts of man, that they are but vain.",
  "11. Blessed is the man whom thou chastenest, O LORD, * and teachest him in thy law.",
  "12. That thou mayest give him patience in time of adversity, * until the pit be digged up for the ungodly.",
  "13. For the LORD will not fail his people, * neither will he forsake his inheritance.",
  "14. Until righteousness turn again unto judgement; * all such as are true in heart shall follow it.",
  "15. Who will rise up with me against the wicked? * or who will take my part against the evil-doers?",
  "16. If the LORD had not helped me, * it had not failed but my soul had been put to silence.",
  "17. But when I said, My foot hath slipt; * thy mercy, O LORD, held me up.",
  "18. In the multitude of the sorrows that I had in my heart, * thy comforts have refreshed my soul.",
  "19. Wilt thou have any thing to do with the stool of wickedness, * which imagineth mischief as a law?",
  "20. They gather them together against the soul of the righteous, * and condemn the innocent blood.",
  "21. But the LORD is my refuge; * and my God is the strength of my confidence.",
  "22. He shall recompense them their wickedness, and destroy them in their own malice; * yea, the LORD our God shall destroy them."
]);

p(95, "Venite, exultemus", [
  "O COME, let us sing unto the LORD; * let us heartily rejoice in the strength of our salvation.",
  "2. Let us come before his presence with thanksgiving; * and shew ourselves glad in him with psalms.",
  "3. For the LORD is a great God; * and a great King above all gods.",
  "4. In his hand are all the corners of the earth; * and the strength of the hills is his also.",
  "5. The sea is his, and he made it; * and his hands prepared the dry land.",
  "6. O come, let us worship and fall down, * and kneel before the LORD our Maker.",
  "7. For he is the Lord our God; * and we are the people of his pasture, and the sheep of his hand.",
  "8. To-day if ye will hear his voice, harden not your hearts, * as in the provocation, and as in the day of temptation in the wilderness.",
  "9. When your fathers tempted me, * proved me, and saw my works.",
  "10. Forty years long was I grieved with this generation, and said, * It is a people that do err in their hearts; for they have not known my ways.",
  "11. Unto whom I sware in my wrath, * that they should not enter into my rest."
]);

p(96, "Cantate Domino", [
  "O SING unto the LORD a new song; * sing unto the LORD, all the whole earth.",
  "2. Sing unto the LORD, and praise his Name; * be telling of his salvation from day to day.",
  "3. Declare his honour unto the heathen, * and his wonders unto all people.",
  "4. For the LORD is great, and cannot worthily be praised; * he is more to be feared than all gods.",
  "5. As for all the gods of the heathen, they are but idols; * but it is the LORD that made the heavens.",
  "6. Glory and worship are before him; * power and honour are in his sanctuary.",
  "7. Ascribe unto the LORD, O ye kindreds of the people; * ascribe unto the LORD worship and power.",
  "8. Ascribe unto the LORD the honour due unto his Name; * bring presents, and come into his courts.",
  "9. O worship the LORD in the beauty of holiness; * let the whole earth stand in awe of him.",
  "10. Tell it out among the heathen that the LORD is King; and that it is he who hath made the round world so fast that it cannot be moved; * and how that he shall judge the people righteously.",
  "11. Let the heavens rejoice, and let the earth be glad; let the sea make a noise, and all that therein is. * Let the field be joyful, and all that is in it; then shall all the trees of the wood rejoice before the LORD.",
  "12. For he cometh, for he cometh to judge the earth; * and with righteousness to judge the world, and the people with his truth."
]);

p(97, "Dominus regnavit", [
  "THE LORD is King; the earth may be glad thereof; * yea, the multitude of the isles may be glad thereof.",
  "2. Clouds and darkness are round about him; * righteousness and judgement are the habitation of his seat.",
  "3. There shall go a fire before him, * and burn up his enemies on every side.",
  "4. His lightnings gave shine unto the world; * the earth saw it, and was afraid.",
  "5. The hills melted like wax at the presence of the LORD, * at the presence of the Lord of the whole earth.",
  "6. The heavens have declared his righteousness, * and all the people have seen his glory.",
  "7. Confounded be all they that worship carved images, and that delight in vain gods; * worship him, all ye gods.",
  "8. Sion heard of it, and rejoiced; and the daughters of Judah were glad, * because of thy judgements, O LORD.",
  "9. For thou, LORD, art higher than all that are in the earth; * thou art exalted far above all gods.",
  "10. O ye that love the LORD, see that ye hate the thing which is evil; * the LORD preserveth the souls of his saints; he shall deliver them from the hand of the ungodly.",
  "11. There is sprung up a light for the righteous, * and joyful gladness for such as are true-hearted.",
  "12. Rejoice in the LORD, ye righteous; * and give thanks for a remembrance of his holiness."
]);

p(98, "Cantate Domino", [
  "O SING unto the LORD a new song; * for he hath done marvellous things.",
  "2. With his own right hand, and with his holy arm, * hath he gotten himself the victory.",
  "3. The LORD declared his salvation; * his righteousness hath he openly shewed in the sight of the heathen.",
  "4. He hath remembered his mercy and truth toward the house of Israel; * and all the ends of the world have seen the salvation of our God.",
  "5. Shew yourselves joyful unto the LORD, all ye lands; * sing, rejoice, and give thanks.",
  "6. Praise the LORD upon the harp; sing to the harp with a psalm of thanksgiving. * With trumpets also and shawms, O shew yourselves joyful before the LORD the King.",
  "7. Let the sea make a noise, and all that therein is; * the round world, and they that dwell therein.",
  "8. Let the floods clap their hands, and let the hills be joyful together before the LORD; * for he cometh to judge the earth.",
  "9. With righteousness shall he judge the world, * and the people with equity."
]);

p(99, "Dominus regnavit", [
  "THE LORD is King, be the people never so impatient; * he sitteth between the cherubins, be the earth never so unquiet.",
  "2. The LORD is great in Sion; * and high above all people.",
  "3. They shall give thanks unto thy Name, which is great, wonderful, and holy. * The King's power loveth judgement; thou hast prepared equity; thou hast executed judgement and righteousness in Jacob.",
  "4. O magnify the LORD our God, and fall down before his footstool; * for he is holy.",
  "5. Moses and Aaron among his priests, and Samuel among such as call upon his Name; * these called upon the LORD, and he heard them.",
  "6. He spake unto them out of the cloudy pillar; * for they kept his testimonies, and the law that he gave them.",
  "7. Thou heardest them, O LORD our God; * thou forgavest them, O God, and punishedst their own inventions.",
  "8. O magnify the LORD our God, and worship him upon his holy hill; * for the LORD our God is holy."
]);

p(100, "Jubilate Deo", [
  "O BE joyful in the LORD, all ye lands; * serve the LORD with gladness, and come before his presence with a song.",
  "2. Be ye sure that the LORD he is God; it is he that hath made us, and not we ourselves; * we are his people, and the sheep of his pasture.",
  "3. O go your way into his gates with thanksgiving, and into his courts with praise; * be thankful unto him, and speak good of his Name.",
  "4. For the LORD is gracious; his mercy is everlasting; * and his truth endureth from generation to generation."
]);

const fs = require('fs');
fs.writeFileSync('/tmp/psalms_part2.json', JSON.stringify(psalms, null, 2));
console.log('Written psalms 51-100');
