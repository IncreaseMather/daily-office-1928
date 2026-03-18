import json

litany = [
  # Title / Rubric
  {"type": "rubric", "text": "The Litany, or General Supplication"},
  {"type": "rubric", "text": "To be used after the Third Collect at Morning or Evening Prayer; or before the Holy Communion; or separately."},

  # Opening Invocations
  {"type": "minister", "text": "O God the Father, Creator of heaven and earth;"},
  {"type": "people", "text": "Have mercy upon us."},

  {"type": "minister", "text": "O God the Son, Redeemer of the world;"},
  {"type": "people", "text": "Have mercy upon us."},

  {"type": "minister", "text": "O God the Holy Ghost, Sanctifier of the faithful;"},
  {"type": "people", "text": "Have mercy upon us."},

  {"type": "minister", "text": "O holy, blessed, and glorious Trinity, one God;"},
  {"type": "people", "text": "Have mercy upon us."},

  # Remember not
  {"type": "minister", "text": "Remember not, Lord, our offences, nor the offences of our forefathers; neither take thou vengeance of our sins: Spare us, good Lord, spare thy people, whom thou hast redeemed with thy most precious blood, and be not angry with us for ever."},
  {"type": "people", "text": "Spare us, good Lord."},

  # From all evil — deliver us petitions
  {"type": "minister", "text": "From all evil and mischief; from sin; from the crafts and assaults of the devil; from thy wrath, and from everlasting damnation,"},
  {"type": "people", "text": "Good Lord, deliver us."},

  {"type": "minister", "text": "From all blindness of heart; from pride, vainglory, and hypocrisy; from envy, hatred, and malice, and all uncharitableness,"},
  {"type": "people", "text": "Good Lord, deliver us."},

  {"type": "minister", "text": "From all inordinate and sinful affections; and from all the deceits of the world, the flesh, and the devil,"},
  {"type": "people", "text": "Good Lord, deliver us."},

  {"type": "minister", "text": "From lightning and tempest; from earthquake, fire, and flood; from plague, pestilence, and famine; from battle and murder, and from sudden death,"},
  {"type": "people", "text": "Good Lord, deliver us."},

  {"type": "minister", "text": "From all sedition, privy conspiracy, and rebellion; from all false doctrine, heresy, and schism; from hardness of heart, and contempt of thy Word and Commandment,"},
  {"type": "people", "text": "Good Lord, deliver us."},

  # By the mystery — deliver us petitions
  {"type": "minister", "text": "By the mystery of thy holy Incarnation; by thy holy Nativity and Circumcision; by thy Baptism, Fasting, and Temptation,"},
  {"type": "people", "text": "Good Lord, deliver us."},

  {"type": "minister", "text": "By thine Agony and Bloody Sweat; by thy Cross and Passion; by thy precious Death and Burial; by thy glorious Resurrection and Ascension, and by the Coming of the Holy Ghost,"},
  {"type": "people", "text": "Good Lord, deliver us."},

  {"type": "minister", "text": "In all time of our tribulation; in all time of our prosperity; in the hour of death, and in the day of judgment,"},
  {"type": "people", "text": "Good Lord, deliver us."},

  # We beseech thee — intercessions
  {"type": "minister", "text": "We sinners do beseech thee to hear us, O Lord God; and that it may please thee to rule and govern thy holy Church universal in the right way;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee so to rule the heart of thy servant, The President of the United States, that he may above all things seek thy honour and glory;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to bless and preserve all Christian Rulers and Magistrates, giving them grace to execute justice, and to maintain truth;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to illuminate all Bishops, Priests, and Deacons, with true knowledge and understanding of thy Word; and that both by their preaching and living they may set it forth, and show it accordingly;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to send forth labourers into thy harvest;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to bless and keep all thy people;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to give to all nations unity, peace, and concord;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to give us an heart to love and fear thee, and diligently to live after thy commandments;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to give to all thy people increase of grace to hear meekly thy Word, and to receive it with pure affection, and to bring forth the fruits of the Spirit;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to bring into the way of truth all such as have erred, and are deceived;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to strengthen such as do stand; and to comfort and help the weak-hearted; and to raise up those who fall; and finally to beat down Satan under our feet;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to succour, help, and comfort, all who are in danger, necessity, and tribulation;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to preserve all who travel by land, by water, or by air, all women in child-birth, all sick persons, and young children; and to show thy pity upon all prisoners and captives;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to defend, and provide for, the fatherless children, and widows, and all who are desolate and oppressed;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to have mercy upon all men;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to forgive our enemies, persecutors, and slanderers, and to turn their hearts;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to give and preserve to our use the kindly fruits of the earth, so that in due time we may enjoy them;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  {"type": "minister", "text": "That it may please thee to give us true repentance; to forgive us all our sins, negligences, and ignorances; and to endue us with the grace of thy Holy Spirit to amend our lives according to thy holy Word;"},
  {"type": "people", "text": "We beseech thee to hear us, good Lord."},

  # Son of God
  {"type": "minister", "text": "Son of God, we beseech thee to hear us."},
  {"type": "people", "text": "Son of God, we beseech thee to hear us."},

  # Agnus Dei
  {"type": "minister", "text": "O Lamb of God, who takest away the sins of the world;"},
  {"type": "people", "text": "Grant us thy peace."},

  {"type": "minister", "text": "O Lamb of God, who takest away the sins of the world;"},
  {"type": "people", "text": "Have mercy upon us."},

  # O Christ hear us
  {"type": "minister", "text": "O Christ, hear us."},
  {"type": "people", "text": "O Christ, hear us."},

  # Kyrie
  {"type": "minister", "text": "Lord, have mercy upon us."},
  {"type": "people", "text": "Lord, have mercy upon us."},

  {"type": "minister", "text": "Christ, have mercy upon us."},
  {"type": "people", "text": "Christ, have mercy upon us."},

  {"type": "minister", "text": "Lord, have mercy upon us."},
  {"type": "people", "text": "Lord, have mercy upon us."},

  # Lord's Prayer
  {"type": "rubric", "text": "Then shall the Minister, and the People with him, say the Lord's Prayer."},
  {"type": "rubric", "text": "Minister and People."},
  {"type": "minister", "text": "Our Father, who art in heaven, Hallowed be thy Name. Thy kingdom come. Thy will be done, On earth as it is in heaven. Give us this day our daily bread. And forgive us our trespasses, As we forgive those who trespass against us. And lead us not into temptation, But deliver us from evil. Amen."},

  # Optional section rubric
  {"type": "rubric", "text": "The Minister may, at his discretion, omit all that followeth, to the Prayer, We humbly beseech thee, O Father, etc."},

  # Versicles
  {"type": "rubric", "text": "Minister."},
  {"type": "minister", "text": "O Lord, deal not with us according to our sins."},
  {"type": "people", "text": "Neither reward us according to our iniquities."},

  {"type": "minister", "text": "Let us pray."},

  # Collect
  {"type": "minister", "text": "O God, merciful Father, who despisest not the sighing of a contrite heart, nor the desire of such as are sorrowful; Mercifully assist our prayers which we make before thee in all our troubles and adversities, whensoever they oppress us; and graciously hear us, that those evils which the craft and subtilty of the devil or man worketh against us, may, by thy good providence, be brought to nought; that we thy servants, being hurt by no persecutions, may evermore give thanks unto thee in thy holy Church; through Jesus Christ our Lord. Amen."},

  # Minister and People versicle
  {"type": "rubric", "text": "Minister and People."},
  {"type": "minister", "text": "O Lord, arise, help us, and deliver us for thy Name's sake."},

  # Second versicle set
  {"type": "rubric", "text": "Minister."},
  {"type": "minister", "text": "O God, we have heard with our ears, and our fathers have declared unto us, the noble works that thou didst in their days, and in the old time before them."},

  {"type": "people", "text": "O Lord, arise, help us, and deliver us for thine honour."},

  # Gloria
  {"type": "rubric", "text": "Minister."},
  {"type": "minister", "text": "Glory be to the Father, and to the Son, and to the Holy Ghost;"},
  {"type": "people", "text": "As it was in the beginning, is now, and ever shall be, world without end. Amen."},

  # Suffrages
  {"type": "minister", "text": "From our enemies defend us, O Christ."},
  {"type": "people", "text": "Graciously look upon our afflictions."},

  {"type": "minister", "text": "With pity behold the sorrows of our hearts."},
  {"type": "people", "text": "Mercifully forgive the sins of thy people."},

  {"type": "minister", "text": "Favourably with mercy hear our prayers."},
  {"type": "people", "text": "O Son of David, have mercy upon us."},

  {"type": "minister", "text": "Both now and ever vouchsafe to hear us, O Christ."},
  {"type": "people", "text": "Graciously hear us, O Christ; graciously hear us, O Lord Christ."},

  {"type": "minister", "text": "O Lord, let thy mercy be showed upon us;"},
  {"type": "people", "text": "As we do put our trust in thee."},

  {"type": "minister", "text": "Let us pray."},

  # Final Collect
  {"type": "minister", "text": "We humbly beseech thee, O Father, mercifully to look upon our infirmities; and, for the glory of thy Name, turn from us all those evils that we most justly have deserved; and grant, that in all our troubles we may put our whole trust and confidence in thy mercy, and evermore serve thee in holiness and pureness of living, to thy honour and glory; through our only Mediator and Advocate, Jesus Christ our Lord. Amen."},

  # Closing rubric
  {"type": "rubric", "text": "The Minister may end the Litany here, or at his discretion add other prayers from this Book."},
]

print(json.dumps(litany, indent=2, ensure_ascii=False))
print()
print(f"Total items: {len(litany)}")
minister_count = sum(1 for x in litany if x["type"] == "minister")
people_count = sum(1 for x in litany if x["type"] == "people")
rubric_count = sum(1 for x in litany if x["type"] == "rubric")
print(f"Minister: {minister_count}, People: {people_count}, Rubrics: {rubric_count}")
