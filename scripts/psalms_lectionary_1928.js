/**
 * 1928 American Book of Common Prayer
 * Daily Office Psalm Lectionary (as revised 1945)
 *
 * Sources:
 * - Primary: http://www.stpetersaoc.org/Info/1945Tables.pdf
 * - Secondary: http://www.episcopalnet.org/1928bcp/readings/
 *
 * Keys: {weekKey}{DayName}
 * weekKey: see collect naming convention below
 * DayName: Sunday | Monday | Tuesday | Wednesday | Thursday | Friday | Saturday
 *
 * Values: { morning: [...psalm strings], evening: [...psalm strings] }
 * Psalm sections: "119a" = 119:1-16, "119b" = 119:17-32, etc.
 * Psalm portions: "18a" = 18:1-20, "22a" = 22:23-31, etc.
 *
 * NOTE: This table shows the PRIMARY psalm appointment for each service.
 * On Sundays the 1928 BCP table includes secondary ("Second Service")
 * psalm appointments which are not included here.
 */

const psalmLectionary1928 = {

  // ============================================================
  // ADVENT
  // ============================================================

  "advent1Sunday":    { morning: ["50"],          evening: ["48", "126"] },
  "advent1Monday":    { morning: ["1", "3"],       evening: ["4", "8"] },
  "advent1Tuesday":   { morning: ["7"],            evening: ["11", "12"] },
  "advent1Wednesday": { morning: ["9"],            evening: ["15", "19"] },
  "advent1Thursday":  { morning: ["10"],           evening: ["24", "30"] },
  "advent1Friday":    { morning: ["22"],           evening: ["6", "13"] },
  "advent1Saturday":  { morning: ["28", "29"],     evening: ["27"] },

  "advent2Sunday":    { morning: ["25"],           evening: ["119:89-104"] },
  "advent2Monday":    { morning: ["33"],           evening: ["42", "43"] },
  "advent2Tuesday":   { morning: ["48"],           evening: ["46", "47"] },
  "advent2Wednesday": { morning: ["50"],           evening: ["49"] },
  "advent2Thursday":  { morning: ["62", "63"],     evening: ["66"] },
  "advent2Friday":    { morning: ["73"],           evening: ["77"] },
  "advent2Saturday":  { morning: ["80"],           evening: ["65"] },

  // Advent 3 — from PDF (1945Tables.pdf). Ember Days: Wed, Fri, Sat.
  "advent3Sunday":    { morning: ["22:23-31", "99"],  evening: ["132", "134"] },
  "advent3Monday":    { morning: ["84"],               evening: ["75", "76"] },
  "advent3Tuesday":   { morning: ["90"],               evening: ["91"] },
  "advent3Wednesday": { morning: ["1", "15"],          evening: ["92"] },
  "advent3Thursday":  { morning: ["96"],               evening: ["93", "98"] },
  "advent3Friday":    { morning: ["40:1-16"],          evening: ["51"] },
  "advent3Saturday":  { morning: ["42", "43"],         evening: ["103"] },

  "advent4Sunday":    { morning: ["80"],           evening: ["33"] },
  "advent4Monday":    { morning: ["116"],          evening: ["104"] },
  "advent4Tuesday":   { morning: ["130", "131"],   evening: ["114", "122"] },
  "advent4Wednesday": { morning: ["132"],          evening: ["139"] },
  "advent4Thursday":  { morning: ["144"],          evening: ["145"] },
  "advent4Friday":    { morning: ["147"],          evening: ["148", "150"] },
  "advent4Saturday":  { morning: ["50"],           evening: ["85"] },   // Christmas Eve

  // ============================================================
  // CHRISTMASTIDE
  // ============================================================

  "christmasDaySunday":    { morning: ["89:1-30"],     evening: ["45"] },
  // Dec 26 – St. Stephen
  "christmasDayMonday":    { morning: ["118"],         evening: ["30", "31:1-6"] },
  // Dec 27 – St. John the Evangelist
  "christmasDayTuesday":   { morning: ["23", "24"],    evening: ["97"] },
  // Dec 28 – Holy Innocents
  "christmasDayWednesday": { morning: ["8", "26"],     evening: ["19", "126"] },

  // 1st Sunday after Christmas
  "sundayAfterChristmasSunday":    { morning: ["145"],         evening: ["68", "27"] },  // NOTE: EP "68 or 27"
  // Dec 29
  "sundayAfterChristmasMonday":    { morning: ["27"],          evening: ["20", "21:1-6"] },
  // Dec 30
  "sundayAfterChristmasTuesday":   { morning: ["33"],          evening: ["111", "112"] },
  // Dec 31
  "sundayAfterChristmasWednesday": { morning: ["147"],         evening: ["90", "150"] },

  // Jan 1 – Circumcision (New Year)
  "circumcisionSunday":    { morning: ["103"],         evening: ["148"] },
  // NOTE: Circumcision is a fixed day, not a week. The days that
  // follow vary by year. The table below reflects the 1945 pattern
  // for Jan 2-5 (pre-Epiphany days).
  "circumcisionMonday":    { morning: ["37:26-40"],    evening: ["2", "110"] },
  "circumcisionTuesday":   { morning: ["66"],          evening: ["34"] },
  "circumcisionWednesday": { morning: ["92"],          evening: ["91"] },
  "circumcisionThursday":  { morning: ["144"],         evening: [] },
  "circumcisionFriday":    { morning: [],              evening: ["29", "98"] },  // Epiphany Eve EP

  // Jan 6 – Epiphany
  "epiphanySunday":        { morning: ["46", "100"],   evening: ["72"] },
  // Jan 7
  "epiphanyMonday":        { morning: ["85"],          evening: ["97", "99"] },
  // Jan 8
  "epiphanyTuesday":       { morning: ["65"],          evening: ["93", "96"] },
  // Jan 9
  "epiphanyWednesday":     { morning: ["22:23-31", "24"], evening: ["48", "117"] },
  // Jan 10
  "epiphanyThursday":      { morning: ["67", "87"],    evening: ["138", "146"] },
  // Jan 11
  "epiphanyFriday":        { morning: ["102:15-28"],   evening: ["147"] },

  // ============================================================
  // SUNDAYS AFTER EPIPHANY
  // ============================================================

  "epiphany1Sunday":    { morning: ["72", "97"],      evening: ["84", "122"] },
  "epiphany1Monday":    { morning: ["1", "3"],        evening: ["4", "8"] },
  "epiphany1Tuesday":   { morning: ["5"],             evening: ["11", "12"] },
  "epiphany1Wednesday": { morning: ["7"],             evening: ["13", "14"] },
  "epiphany1Thursday":  { morning: ["9"],             evening: ["15", "21"] },
  "epiphany1Friday":    { morning: ["10"],            evening: ["6", "26"] },
  "epiphany1Saturday":  { morning: ["16"],            evening: ["27"] },

  "epiphany2Sunday":    { morning: ["118"],           evening: ["102:15-28", "117"] },
  "epiphany2Monday":    { morning: ["17"],            evening: ["18:1-20"] },
  "epiphany2Tuesday":   { morning: ["23", "24"],      evening: ["25"] },
  "epiphany2Wednesday": { morning: ["28"],            evening: ["31"] },
  "epiphany2Thursday":  { morning: ["30"],            evening: ["33"] },
  "epiphany2Friday":    { morning: ["32"],            evening: ["40:1-16"] },
  "epiphany2Saturday":  { morning: ["36"],            evening: ["34"] },

  "epiphany3Sunday":    { morning: ["42", "43"],      evening: ["27", "134"] },
  "epiphany3Monday":    { morning: ["39"],            evening: ["37:1-24"] },
  "epiphany3Tuesday":   { morning: ["41"],            evening: ["46", "47"] },
  "epiphany3Wednesday": { morning: ["44"],            evening: ["49"] },
  "epiphany3Thursday":  { morning: ["45"],            evening: ["50"] },
  "epiphany3Friday":    { morning: ["51"],            evening: ["54", "57"] },
  "epiphany3Saturday":  { morning: ["55"],            evening: ["29", "99"] },

  "epiphany4Sunday":    { morning: ["66"],            evening: ["145"] },
  "epiphany4Monday":    { morning: ["56", "60:1-5"],  evening: ["65"] },
  "epiphany4Tuesday":   { morning: ["61", "62"],      evening: ["71"] },
  "epiphany4Wednesday": { morning: ["63", "64"],      evening: ["72"] },
  "epiphany4Thursday":  { morning: ["68:1-19"],       evening: ["73"] },
  "epiphany4Friday":    { morning: ["69:1-22", "69:30-36"], evening: ["75", "76"] },
  "epiphany4Saturday":  { morning: ["77"],            evening: ["19", "67"] },

  "epiphany5Sunday":    { morning: ["15", "85"],      evening: ["21", "22:23-31"] },
  "epiphany5Monday":    { morning: ["79"],            evening: ["81"] },
  "epiphany5Tuesday":   { morning: ["82", "101"],     evening: ["90"] },
  "epiphany5Wednesday": { morning: ["86"],            evening: ["91"] },
  "epiphany5Thursday":  { morning: ["89:1-19"],       evening: ["94"] },
  "epiphany5Friday":    { morning: ["92"],            evening: ["102"] },
  "epiphany5Saturday":  { morning: ["97"],            evening: ["84", "122"] },

  "epiphany6Sunday":    { morning: ["75", "138"],     evening: ["9", "76", "96"] },
  "epiphany6Monday":    { morning: ["99", "100"],     evening: ["103"] },
  "epiphany6Tuesday":   { morning: ["107:1-16"],      evening: ["104"] },
  "epiphany6Wednesday": { morning: ["111", "112"],    evening: ["105"] },
  "epiphany6Thursday":  { morning: ["115"],           evening: ["114", "124"] },
  "epiphany6Friday":    { morning: ["106"],           evening: ["116"] },
  "epiphany6Saturday":  { morning: ["118"],           evening: ["85", "134"] },

  // ============================================================
  // PRE-LENT
  // ============================================================

  "septuagesimaSunday":    { morning: ["20", "121"],          evening: ["144"] },
  "septuagesimaMonday":    { morning: ["123", "127"],         evening: ["126", "128", "131"] },
  "septuagesimaTuesday":   { morning: ["135"],               evening: ["129", "130"] },
  "septuagesimaWednesday": { morning: ["137:1-6", "140"],    evening: ["132"] },
  "septuagesimaThursday":  { morning: ["141"],               evening: ["139"] },
  "septuagesimaFriday":    { morning: ["143"],               evening: ["142", "146"] },
  "septuagesimaSaturday":  { morning: ["149"],               evening: ["148", "150"] },

  "sexagesimaSunday":    { morning: ["71"],            evening: ["147"] },
  "sexagesimaMonday":    { morning: ["2", "3"],        evening: ["4", "8"] },
  "sexagesimaTuesday":   { morning: ["5"],             evening: ["11", "12"] },
  "sexagesimaWednesday": { morning: ["7"],             evening: ["13", "14"] },
  "sexagesimaThursday":  { morning: ["9"],             evening: ["17"] },
  "sexagesimaFriday":    { morning: ["22"],            evening: ["6", "26"] },
  "sexagesimaSaturday":  { morning: ["16"],            evening: ["93", "98"] },

  "quinquagesimaSunday":    { morning: ["103"],            evening: ["119:33-48"] },
  "quinquagesimaMonday":    { morning: ["18:1-20"],        evening: ["20", "21:1-6"] },
  "quinquagesimaTuesday":   { morning: ["18:21-36"],       evening: ["25"] },
  // Ash Wednesday is mid-week in Quinquagesima week
  "ashWednesdaySunday":     { morning: ["32", "143"],      evening: ["102", "130"] },  // Ash Wednesday itself
  "quinquagesimaThursday":  { morning: ["27"],             evening: ["29", "30"] },
  "quinquagesimaFriday":    { morning: ["95", "40:1-16"],  evening: ["31"] },
  "quinquagesimaSaturday":  { morning: ["28"],             evening: ["34"] },

  // ============================================================
  // LENT
  // ============================================================

  "lent1Sunday":    { morning: ["50"],             evening: ["15", "92"] },
  "lent1Monday":    { morning: ["36"],             evening: ["42", "43"] },
  "lent1Tuesday":   { morning: ["37:1-24"],        evening: ["46", "47"] },
  "lent1Wednesday": { morning: ["26"],             evening: ["4", "16"] },
  "lent1Thursday":  { morning: ["37:26-40"],       evening: ["49"] },
  "lent1Friday":    { morning: ["95", "84"],       evening: ["77"] },
  "lent1Saturday":  { morning: ["101"],            evening: ["19", "23"] },

  "lent2Sunday":    { morning: ["86", "142"],      evening: ["26", "119:1-16"] },
  "lent2Monday":    { morning: ["39"],             evening: ["50"] },
  "lent2Tuesday":   { morning: ["41"],             evening: ["51"] },
  "lent2Wednesday": { morning: ["56"],             evening: ["65", "67"] },
  "lent2Thursday":  { morning: ["62"],             evening: ["66"] },
  "lent2Friday":    { morning: ["95", "54", "61"], evening: ["69:1-22", "69:30-37"] },
  "lent2Saturday":  { morning: ["63"],             evening: ["72"] },

  "lent3Sunday":    { morning: ["25"],             evening: ["119:113-128", "143"] },
  "lent3Monday":    { morning: ["68:1-19"],        evening: ["71"] },
  "lent3Tuesday":   { morning: ["74"],             evening: ["73"] },
  "lent3Wednesday": { morning: ["75", "76"],       evening: ["77"] },
  "lent3Thursday":  { morning: ["85"],             evening: ["80"] },
  "lent3Friday":    { morning: ["95", "79"],       evening: ["86"] },
  "lent3Saturday":  { morning: ["89:1-19"],        evening: ["103"] },

  "lent4Sunday":    { morning: ["147", "18:1-20"], evening: ["116", "46", "122"] },
  "lent4Monday":    { morning: ["90"],             evening: ["91"] },
  "lent4Tuesday":   { morning: ["93", "96"],       evening: ["92"] },
  "lent4Wednesday": { morning: ["94"],             evening: ["97", "98"] },
  "lent4Thursday":  { morning: ["104"],            evening: ["99", "100"] },
  "lent4Friday":    { morning: ["95", "102"],      evening: ["107:1-16"] },
  "lent4Saturday":  { morning: ["108:1-6", "112"], evening: ["118"] },

  "lent5Sunday":    { morning: ["51"],             evening: ["42", "43"] },
  "lent5Monday":    { morning: ["119:1-16"],       evening: ["119:17-32", "117"] },
  "lent5Tuesday":   { morning: ["123", "127"],     evening: ["120", "121", "122"] },
  "lent5Wednesday": { morning: ["128", "129"],     evening: ["132"] },
  "lent5Thursday":  { morning: ["144"],            evening: ["133", "134", "137:1-6"] },
  "lent5Friday":    { morning: ["95", "141:1-4", "146"], evening: ["139"] },
  "lent5Saturday":  { morning: ["147"],            evening: ["145"] },

  // ============================================================
  // HOLY WEEK (Sixth Sunday in Lent = Palm Sunday)
  // ============================================================

  "palmSundaySunday":    { morning: ["24", "97"],          evening: ["130", "138"] },
  "holyMonday":          { morning: ["71"],                evening: ["42", "43"] },
  "holyTuesday":         { morning: ["6", "12"],           evening: ["51"] },
  "holyWednesday":       { morning: ["94"],                evening: ["74"] },
  "maundyThursday":      { morning: ["116"],               evening: ["142", "143"] },
  "goodFriday":          { morning: ["22", "40:1-16", "54"], evening: ["69:1-22", "88"] },
  "holySaturday":        { morning: ["14", "16"],          evening: ["27"] },

  // ============================================================
  // EASTERTIDE
  // ============================================================

  "easterDaySunday":    { morning: ["93", "111"],   evening: ["98", "114"] },
  "easterDayMonday":    { morning: ["2"],           evening: ["103"] },
  "easterDayTuesday":   { morning: ["30"],          evening: ["115"] },
  "easterDayWednesday": { morning: ["97", "99"],    evening: ["148"] },
  "easterDayThursday":  { morning: ["149", "150"],  evening: ["147"] },
  "easterDayFriday":    { morning: ["124", "125", "126"], evening: ["110", "114"] },
  "easterDaySaturday":  { morning: ["145"],         evening: ["18:1-20"] },

  "easter1Sunday":    { morning: ["66"],            evening: ["33"] },
  "easter1Monday":    { morning: ["1", "3"],        evening: ["4", "11"] },
  "easter1Tuesday":   { morning: ["5"],             evening: ["15", "24"] },
  "easter1Wednesday": { morning: ["22:23-31"],      evening: ["25"] },
  "easter1Thursday":  { morning: ["28"],            evening: ["29", "46"] },
  "easter1Friday":    { morning: ["40:1-16"],       evening: ["39"] },
  "easter1Saturday":  { morning: ["42", "43"],      evening: ["93", "111"] },

  "easter2Sunday":    { morning: ["23", "146"],     evening: ["145"] },
  "easter2Monday":    { morning: ["49"],            evening: ["47", "48"] },
  "easter2Tuesday":   { morning: ["50"],            evening: ["61", "62"] },
  "easter2Wednesday": { morning: ["63"],            evening: ["65"] },
  "easter2Thursday":  { morning: ["66"],            evening: ["71"] },
  "easter2Friday":    { morning: ["51"],            evening: ["73"] },
  "easter2Saturday":  { morning: ["72"],            evening: ["33"] },

  "easter3Sunday":    { morning: ["36:5-12", "138"], evening: ["68:1-20"] },
  "easter3Monday":    { morning: ["85"],             evening: ["77"] },
  "easter3Tuesday":   { morning: ["86"],             evening: ["84", "117"] },
  "easter3Wednesday": { morning: ["89:1-19"],        evening: ["90"] },
  "easter3Thursday":  { morning: ["91"],             evening: ["97", "98"] },
  "easter3Friday":    { morning: ["94"],             evening: ["103"] },
  "easter3Saturday":  { morning: ["99", "100"],      evening: ["23", "30"] },

  "easter4Sunday":    { morning: ["116"],            evening: ["18:1-20"] },
  "easter4Monday":    { morning: ["110", "114"],     evening: ["111", "113"] },
  "easter4Tuesday":   { morning: ["124", "126"],     evening: ["121", "122"] },
  "easter4Wednesday": { morning: ["128", "129"],     evening: ["135"] },
  "easter4Thursday":  { morning: ["132"],            evening: ["145"] },
  "easter4Friday":    { morning: ["143"],            evening: ["130", "138"] },
  "easter4Saturday":  { morning: ["146", "149"],     evening: ["148", "150"] },

  "easter5Sunday":    { morning: ["65", "67"],       evening: ["147"] },
  // Rogation Days
  "easter5Monday":    { morning: ["104"],            evening: ["34"] },    // Rogation Monday
  "easter5Tuesday":   { morning: ["80"],             evening: ["65", "67"] }, // Rogation Tuesday
  "easter5Wednesday": { morning: ["144"],            evening: ["93", "99"] }, // Rogation Wednesday
  "ascensionDay":     { morning: ["96"],             evening: ["24", "47"] },
  "easter5Friday":    { morning: ["15"],             evening: ["20", "29"] },
  "easter5Saturday":  { morning: ["45"],             evening: ["8", "98"] },

  "sundayAfterAscensionSunday":    { morning: ["21:1-6", "24"],  evening: ["93", "96"] },
  "sundayAfterAscensionMonday":    { morning: ["2"],             evening: ["147"] },
  "sundayAfterAscensionTuesday":   { morning: ["92"],            evening: ["57", "138"] },
  "sundayAfterAscensionWednesday": { morning: ["21:1-6", "23"],  evening: ["33"] },
  "sundayAfterAscensionThursday":  { morning: ["66"],            evening: ["72"] },
  "sundayAfterAscensionFriday":    { morning: ["115"],           evening: ["116", "117"] },
  "sundayAfterAscensionSaturday":  { morning: ["81"],            evening: ["46", "133"] },

  // ============================================================
  // WHITSUNTIDE (Pentecost)
  // ============================================================

  "whitsundaySunday":    { morning: ["68"],          evening: ["104"] },
  "whitsundayMonday":    { morning: ["139"],         evening: ["103"] },    // Whit Monday
  "whitsundayTuesday":   { morning: ["148"],         evening: ["145"] },    // Whit Tuesday
  "whitsundayWednesday": { morning: ["132"],         evening: ["84"] },     // Ember Wednesday
  "whitsundayThursday":  { morning: ["48"],          evening: ["18:1-20"] },
  "whitsundayFriday":    { morning: ["122", "125"],  evening: ["43", "134"] }, // Ember Friday
  "whitsundaySaturday":  { morning: ["19"],          evening: ["111", "113"] }, // Ember Saturday

  // ============================================================
  // TRINITY SEASON
  // ============================================================

  "trinitySundaySunday":    { morning: ["29", "99"],  evening: ["98", "100"] },
  "trinitySundayMonday":    { morning: ["2", "3"],    evening: ["4", "8"] },
  "trinitySundayTuesday":   { morning: ["5"],         evening: ["16", "20"] },
  "trinitySundayWednesday": { morning: ["7"],         evening: ["25"] },
  "trinitySundayThursday":  { morning: ["9"],         evening: ["27"] },
  "trinitySundayFriday":    { morning: ["10"],        evening: ["6", "26"] },
  "trinitySundaySaturday":  { morning: ["13", "14"],  evening: ["29", "30"] },

  "trinity1Sunday":    { morning: ["73"],             evening: ["119:33-48"] },
  "trinity1Monday":    { morning: ["28"],             evening: ["31"] },
  "trinity1Tuesday":   { morning: ["32"],             evening: ["33"] },
  "trinity1Wednesday": { morning: ["37:1-24"],        evening: ["34"] },
  "trinity1Thursday":  { morning: ["37:26-40"],       evening: ["39"] },
  "trinity1Friday":    { morning: ["40:1-16"],        evening: ["41", "54"] },
  "trinity1Saturday":  { morning: ["44"],             evening: ["46", "47"] },

  "trinity2Sunday":    { morning: ["15", "19"],       evening: ["112", "113"] },
  "trinity2Monday":    { morning: ["48"],             evening: ["42", "43"] },
  "trinity2Tuesday":   { morning: ["49"],             evening: ["50"] },
  "trinity2Wednesday": { morning: ["57"],             evening: ["61", "62"] },
  "trinity2Thursday":  { morning: ["63"],             evening: ["65"] },
  "trinity2Friday":    { morning: ["71"],             evening: ["77"] },
  "trinity2Saturday":  { morning: ["73"],             evening: ["66"] },

  "trinity3Sunday":    { morning: ["145"],            evening: ["32", "36:5-12"] },
  "trinity3Monday":    { morning: ["86"],             evening: ["84", "85"] },
  "trinity3Tuesday":   { morning: ["89:1-19"],        evening: ["90"] },
  "trinity3Wednesday": { morning: ["92"],             evening: ["104"] },
  "trinity3Thursday":  { morning: ["94"],             evening: ["111", "114"] },
  "trinity3Friday":    { morning: ["102"],            evening: ["116"] },
  "trinity3Saturday":  { morning: ["107:1-16"],       evening: ["93", "99"] },

  "trinity4Sunday":    { morning: ["91"],             evening: ["51"] },
  "trinity4Monday":    { morning: ["119:49-64"],      evening: ["119:65-80", "117"] },
  "trinity4Tuesday":   { morning: ["123", "124"],     evening: ["126", "127", "130"] },
  "trinity4Wednesday": { morning: ["125", "138"],     evening: ["132", "134"] },
  "trinity4Thursday":  { morning: ["136"],            evening: ["144"] },
  "trinity4Friday":    { morning: ["142", "143"],     evening: ["145"] },
  "trinity4Saturday":  { morning: ["147"],            evening: ["148", "150"] },

  "trinity5Sunday":    { morning: ["62", "63"],       evening: ["66"] },
  "trinity5Monday":    { morning: ["11", "12"],       evening: ["8", "19"] },
  "trinity5Tuesday":   { morning: ["17"],             evening: ["13", "14"] },
  "trinity5Wednesday": { morning: ["20", "21:1-6"],   evening: ["27"] },
  "trinity5Thursday":  { morning: ["25"],             evening: ["30"] },
  "trinity5Friday":    { morning: ["26"],             evening: ["32", "36:5-12"] },
  "trinity5Saturday":  { morning: ["28"],             evening: ["47", "48"] },

  "trinity6Sunday":    { morning: ["85"],             evening: ["57", "130"] },
  "trinity6Monday":    { morning: ["39"],             evening: ["42", "43"] },
  "trinity6Tuesday":   { morning: ["45"],             evening: ["49"] },
  "trinity6Wednesday": { morning: ["56"],             evening: ["62", "63"] },
  "trinity6Thursday":  { morning: ["65"],             evening: ["66"] },
  "trinity6Friday":    { morning: ["69:1-22", "69:30-36"], evening: ["71"] },
  "trinity6Saturday":  { morning: ["72"],             evening: ["15", "46"] },

  "trinity7Sunday":    { morning: ["18:1-20"],        evening: ["50"] },
  "trinity7Monday":    { morning: ["75", "76"],       evening: ["73"] },
  "trinity7Tuesday":   { morning: ["7"],              evening: ["74"] },
  "trinity7Wednesday": { morning: ["80"],             evening: ["81"] },
  "trinity7Thursday":  { morning: ["85"],             evening: ["89:1-19"] },
  "trinity7Friday":    { morning: ["86"],             evening: ["91"] },
  "trinity7Saturday":  { morning: ["90"],             evening: ["96", "98"] },

  "trinity8Sunday":    { morning: ["119:33-48"],      evening: ["25"] },
  "trinity8Monday":    { morning: ["104"],            evening: ["116"] },
  "trinity8Tuesday":   { morning: ["111", "114"],     evening: ["118"] },
  "trinity8Wednesday": { morning: ["119:81-96"],      evening: ["119:97-112", "117"] },
  "trinity8Thursday":  { morning: ["128", "129"],     evening: ["132", "134"] },
  "trinity8Friday":    { morning: ["139"],            evening: ["138", "146"] },
  "trinity8Saturday":  { morning: ["145"],            evening: ["147"] },

  "trinity9Sunday":    { morning: ["115"],            evening: ["119:9-24"] },
  "trinity9Monday":    { morning: ["2", "3"],         evening: ["4", "8"] },
  "trinity9Tuesday":   { morning: ["5"],              evening: ["16", "20"] },
  "trinity9Wednesday": { morning: ["9"],              evening: ["19", "23"] },
  "trinity9Thursday":  { morning: ["10"],             evening: ["21:1-6"] },
  "trinity9Friday":    { morning: ["22"],             evening: ["25"] },
  "trinity9Saturday":  { morning: ["18:1-20"],        evening: ["84"] },

  "trinity10Sunday":    { morning: ["145"],           evening: ["15", "46"] },
  "trinity10Monday":    { morning: ["40:1-16"],       evening: ["37:1-24"] },
  "trinity10Tuesday":   { morning: ["41"],            evening: ["37:26-40"] },
  "trinity10Wednesday": { morning: ["44"],            evening: ["39"] },
  "trinity10Thursday":  { morning: ["49"],            evening: ["50"] },
  "trinity10Friday":    { morning: ["51"],            evening: ["54", "57"] },
  "trinity10Saturday":  { morning: ["66"],            evening: ["65", "67"] },

  "trinity11Sunday":    { morning: ["124", "125"],    evening: ["68:1-20"] },
  "trinity11Monday":    { morning: ["71"],            evening: ["77"] },
  "trinity11Tuesday":   { morning: ["73"],            evening: ["78"] },
  "trinity11Wednesday": { morning: ["87", "101"],     evening: ["85", "98"] },
  "trinity11Thursday":  { morning: ["92"],            evening: ["90"] },
  "trinity11Friday":    { morning: ["94"],            evening: ["103"] },
  "trinity11Saturday":  { morning: ["96"],            evening: ["112", "113"] },

  "trinity12Sunday":    { morning: ["139"],           evening: ["27"] },
  "trinity12Monday":    { morning: ["107:1-16"],      evening: ["111", "114"] },
  "trinity12Tuesday":   { morning: ["115"],           evening: ["116"] },
  "trinity12Wednesday": { morning: ["125", "127", "130"], evening: ["121", "123", "124"] },
  "trinity12Thursday":  { morning: ["137:1-6"],       evening: ["144"] },
  "trinity12Friday":    { morning: ["142", "143"],    evening: ["145"] },
  "trinity12Saturday":  { morning: ["147"],           evening: ["148", "150"] },

  "trinity13Sunday":    { morning: ["104"],           evening: ["11", "12"] },
  "trinity13Monday":    { morning: ["7"],             evening: ["4", "8"] },
  "trinity13Tuesday":   { morning: ["16"],            evening: ["13", "14"] },
  "trinity13Wednesday": { morning: ["17"],            evening: ["18:1-20"] },
  "trinity13Thursday":  { morning: ["25"],            evening: ["27"] },
  "trinity13Friday":    { morning: ["32"],            evening: ["22"] },
  "trinity13Saturday":  { morning: ["31"],            evening: ["29", "30"] },

  "trinity14Sunday":    { morning: ["19", "24"],      evening: ["50"] },
  "trinity14Monday":    { morning: ["39"],            evening: ["33"] },
  "trinity14Tuesday":   { morning: ["40:1-16"],       evening: ["36:5-12", "47"] },
  "trinity14Wednesday": { morning: ["45"],            evening: ["62", "63"] },
  "trinity14Thursday":  { morning: ["56"],            evening: ["66"] },
  "trinity14Friday":    { morning: ["69:1-22", "69:30-37"], evening: ["51"] },
  "trinity14Saturday":  { morning: ["68:1-19"],       evening: ["67", "93"] },

  "trinity15Sunday":    { morning: ["49"],            evening: ["26", "128"] },
  "trinity15Monday":    { morning: ["75"],            evening: ["71"] },
  "trinity15Tuesday":   { morning: ["76"],            evening: ["72"] },
  "trinity15Wednesday": { morning: ["77"],            evening: ["73"] },
  "trinity15Thursday":  { morning: ["81"],            evening: ["80"] },
  "trinity15Friday":    { morning: ["85"],            evening: ["89:1-19"] },
  "trinity15Saturday":  { morning: ["92"],            evening: ["46", "96"] },

  "trinity16Sunday":    { morning: ["116"],           evening: ["90"] },
  "trinity16Monday":    { morning: ["103"],           evening: ["104"] },
  "trinity16Tuesday":   { morning: ["118"],           evening: ["111", "113"] },
  "trinity16Wednesday": { morning: ["119:113-128"],   evening: ["119:129-144", "117"] },
  "trinity16Thursday":  { morning: ["126", "128"],    evening: ["121", "122", "138"] },
  "trinity16Friday":    { morning: ["102"],           evening: ["139"] },
  "trinity16Saturday":  { morning: ["143", "149"],    evening: ["97", "98"] },

  "trinity17Sunday":    { morning: ["25"],            evening: ["36:5-12", "130"] },
  "trinity17Monday":    { morning: ["18:1-20"],       evening: ["7"] },
  "trinity17Tuesday":   { morning: ["20", "23"],      evening: ["11", "12"] },
  "trinity17Wednesday": { morning: ["21:1-6", "28"],  evening: ["29", "30"] },
  "trinity17Thursday":  { morning: ["27"],            evening: ["31"] },
  "trinity17Friday":    { morning: ["37:1-24"],       evening: ["22"] },
  "trinity17Saturday":  { morning: ["37:26-40"],      evening: ["145"] },

  "trinity18Sunday":    { morning: ["48", "112"],     evening: ["147"] },
  "trinity18Monday":    { morning: ["41"],            evening: ["33"] },
  "trinity18Tuesday":   { morning: ["42", "43"],      evening: ["39"] },
  "trinity18Wednesday": { morning: ["44"],            evening: ["50"] },
  "trinity18Thursday":  { morning: ["49"],            evening: ["73"] },
  "trinity18Friday":    { morning: ["51"],            evening: ["85", "86"] },
  "trinity18Saturday":  { morning: ["71"],            evening: ["93", "98"] },

  "trinity19Sunday":    { morning: ["72"],            evening: ["80"] },
  "trinity19Monday":    { morning: ["89:1-19"],       evening: ["92"] },
  "trinity19Tuesday":   { morning: ["90"],            evening: ["104"] },
  "trinity19Wednesday": { morning: ["94"],            evening: ["113", "114"] },
  "trinity19Thursday":  { morning: ["100", "110"],    evening: ["116"] },
  "trinity19Friday":    { morning: ["119:145-160"],   evening: ["119:161-176", "117"] },
  "trinity19Saturday":  { morning: ["120", "122", "123"], evening: ["144"] },

  "trinity20Sunday":    { morning: ["11", "12"],      evening: ["145"] },
  "trinity20Monday":    { morning: ["124", "128"],    evening: ["131", "133", "134"] },
  "trinity20Tuesday":   { morning: ["125", "126"],    evening: ["132"] },
  "trinity20Wednesday": { morning: ["127", "130"],    evening: ["135"] },
  "trinity20Thursday":  { morning: ["141", "142"],    evening: ["137:1-6", "138"] },
  "trinity20Friday":    { morning: ["143"],           evening: ["139"] },
  "trinity20Saturday":  { morning: ["149"],           evening: ["19", "46"] },

  "trinity21Sunday":    { morning: ["76", "121"],     evening: ["25"] },
  "trinity21Monday":    { morning: ["2", "3"],        evening: ["4", "8"] },
  "trinity21Tuesday":   { morning: ["5"],             evening: ["11", "12"] },
  "trinity21Wednesday": { morning: ["9"],             evening: ["13", "14"] },
  "trinity21Thursday":  { morning: ["10"],            evening: ["16", "17"] },
  "trinity21Friday":    { morning: ["22"],            evening: ["6", "26"] },
  "trinity21Saturday":  { morning: ["21:1-6", "23"],  evening: ["18:1-20"] },

  "trinity22Sunday":    { morning: ["32", "43"],      evening: ["51"] },
  "trinity22Monday":    { morning: ["18:21-36"],      evening: ["20", "24"] },
  "trinity22Tuesday":   { morning: ["25"],            evening: ["29", "36:5-12"] },
  "trinity22Wednesday": { morning: ["28"],            evening: ["34"] },
  "trinity22Thursday":  { morning: ["30"],            evening: ["37:1-24"] },
  "trinity22Friday":    { morning: ["40:1-16"],       evening: ["37:26-40"] },
  "trinity22Saturday":  { morning: ["31"],            evening: ["27"] },

  "trinity23Sunday":    { morning: ["33"],            evening: ["19", "67"] },
  "trinity23Monday":    { morning: ["41"],            evening: ["42", "43"] },
  "trinity23Tuesday":   { morning: ["44"],            evening: ["46", "85"] },
  "trinity23Wednesday": { morning: ["50"],            evening: ["47", "48"] },
  "trinity23Thursday":  { morning: ["52", "53"],      evening: ["49"] },
  "trinity23Friday":    { morning: ["54", "61"],      evening: ["51"] },
  "trinity23Saturday":  { morning: ["55"],            evening: ["93", "98"] },

  "trinity24Sunday":    { morning: ["66"],            evening: ["139"] },
  "trinity24Monday":    { morning: ["63", "64"],      evening: ["56", "57"] },
  "trinity24Tuesday":   { morning: ["68:1-19"],       evening: ["67", "84"] },
  "trinity24Wednesday": { morning: ["71"],            evening: ["72"] },
  "trinity24Thursday":  { morning: ["74"],            evening: ["77"] },
  "trinity24Friday":    { morning: ["69:1-22", "69:30-37"], evening: ["80"] },
  "trinity24Saturday":  { morning: ["79"],            evening: ["65"] },

  // ============================================================
  // SUNDAYS BEFORE ADVENT (used when Trinity season is long)
  // ============================================================

  // 3rd Sunday Before Advent (= 25th Sunday after Trinity)
  "trinity25Sunday":    { morning: ["15", "85"],      evening: ["21", "22:23-31"] },
  "trinity25Monday":    { morning: ["81"],            evening: ["90"] },
  "trinity25Tuesday":   { morning: ["82", "101"],     evening: ["91"] },
  "trinity25Wednesday": { morning: ["86"],            evening: ["92"] },
  "trinity25Thursday":  { morning: ["94"],            evening: ["103"] },
  "trinity25Friday":    { morning: ["88"],            evening: ["102"] },
  "trinity25Saturday":  { morning: ["104"],           evening: ["145"] },

  // 2nd Sunday Before Advent (= 26th Sunday after Trinity)
  "trinity26Sunday":    { morning: ["75", "138"],     evening: ["9"] },
  "trinity26Monday":    { morning: ["105"],           evening: ["107:1-16"] },
  "trinity26Tuesday":   { morning: ["106"],           evening: ["111", "112"] },
  "trinity26Wednesday": { morning: ["113", "114"],    evening: ["118"] },
  "trinity26Thursday":  { morning: ["115"],           evening: ["121", "122"] },
  "trinity26Friday":    { morning: ["116", "117"],    evening: ["125", "126", "127"] },
  "trinity26Saturday":  { morning: ["120", "123"],    evening: ["99", "100"] },

  // Sunday Next Before Advent (= 27th Sunday after Trinity)
  "trinity27Sunday":    { morning: ["39"],            evening: ["90"] },
  "trinity27Monday":    { morning: ["124", "128"],    evening: ["131", "133", "134"] },
  "trinity27Tuesday":   { morning: ["129", "130"],    evening: ["132"] },
  "trinity27Wednesday": { morning: ["136"],           evening: ["139"] },
  "trinity27Thursday":  { morning: ["137:1-6", "138"], evening: ["140", "141:1-4"] },
  "trinity27Friday":    { morning: ["142", "143"],    evening: ["144"] },
  "trinity27Saturday":  { morning: ["146", "149"],    evening: ["148", "150"] },

};

// Helper: get psalm references for a given day
function getDayPsalms(weekKey, dayName) {
  const key = weekKey + dayName;
  return psalmLectionary1928[key] || null;
}

// Example usage:
// getDayPsalms("lent4", "Sunday")
// => { morning: ["147"], evening: ["116", "46", "122"] }

if (typeof module !== 'undefined') {
  module.exports = { psalmLectionary1928, getDayPsalms };
}
