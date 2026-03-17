import React, { useRef, useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '../theme';
import { formatLiturgicalDate, useToday } from '../utils/dateHelpers';
import {
  getLiturgicalSeason, showGloriaPatri,
  isGoodFriday, isAscensiontide, isWhitsuntide, isTrinitySunday,
  getProperCollectKey, showLentDailyCollect,
  getFeastDay, getAppointedPsalmsKey,
} from '../utils/liturgicalCalendar';
import {
  Section, BodyText, RubricText, Divider, OrDivider, MinisterText, PeopleText,
} from '../components/OfficeSection';
import { CanticleView } from '../components/CanticleView';
import { PsalmView } from '../components/PsalmView';
import { useSettings, useTheme, type PriestAbsolutionForm } from '../context/SettingsContext';
import { ShorterFormScreen } from './ShorterFormScreen';

import collectsData from '../data/collects.json';
import canticlesData from '../data/canticles.json';
import psalmsData from '../data/psalms.json';
import appointedPsalmsData from '../data/appointedPsalms.json';
import lectionaryData from '../data/lectionary.json';
import lessonsData from '../data/lessons.json';

const _psalmTextMapEP: Record<string, any> = (() => {
  const map: Record<string, any> = {};
  const data = psalmsData as any;
  for (let d = 1; d <= 30; d++) {
    for (const session of ['morning', 'evening'] as const) {
      const sess = data[String(d)]?.[session];
      if (!sess) continue;
      const refs: (number | string)[] = sess.refs ?? [];
      const verses: any[] = sess.verses ?? [];
      for (let i = 0; i < refs.length; i++) {
        const key = String(refs[i]);
        if (!map[key]) map[key] = verses[i];
      }
    }
  }
  return map;
})();

function _lookupPsalmEP(ref: string): any | null {
  if (_psalmTextMapEP[ref]) return _psalmTextMapEP[ref];
  const base = ref.includes(':') ? ref.split(':')[0] : ref.replace(/[a-e]$/, '');
  if (_psalmTextMapEP[base]) return _psalmTextMapEP[base];
  if (base === '119') return _psalmTextMapEP['119a'] ?? null;
  return null;
}

const CONFESSION =
  'Almighty and most merciful Father; We have erred, and strayed from thy ways like lost sheep. ' +
  'We have followed too much the devices and desires of our own hearts. We have offended against thy holy laws. ' +
  'We have left undone those things which we ought to have done; And we have done those things which we ought not to have done; ' +
  'And there is no health in us. But thou, O Lord, have mercy upon us, miserable offenders. ' +
  'Spare thou those, O God, who confess their faults. Restore thou those who are penitent; ' +
  'According to thy promises declared unto mankind in Christ Jesus our Lord. And grant, O most merciful Father, for his sake; ' +
  'That we may hereafter live a godly, righteous, and sober life, To the glory of thy holy Name. Amen.';

const LORDS_PRAYER =
  'Our Father, who art in heaven, Hallowed be thy Name. Thy kingdom come. Thy will be done, On earth as it is in heaven. ' +
  'Give us this day our daily bread. And forgive us our trespasses, As we forgive those who trespass against us. ' +
  'And lead us not into temptation, But deliver us from evil. ' +
  'For thine is the kingdom, and the power, and the glory, for ever and ever. Amen.';

const EXHORTATION =
  'Dearly beloved brethren, the Scripture moveth us in sundry places to acknowledge and confess our manifold sins and wickedness; ' +
  'and that we should not dissemble nor cloak them before the face of Almighty God our heavenly Father; but confess them with an ' +
  'humble, lowly, penitent, and obedient heart; to the end that we may obtain forgiveness of the same, by his infinite goodness ' +
  'and mercy. And although we ought at all times humbly to acknowledge our sins before God; yet ought we most chiefly so to do, ' +
  'when we assemble and meet together to render thanks for the great benefits that we have received at his hands, to set forth ' +
  'his most worthy praise, to hear his most holy Word, and to ask those things which are requisite and necessary, as well for ' +
  'the body as the soul. Wherefore I pray and beseech you, as many as are here present, to accompany me with a pure heart and ' +
  'humble voice unto the throne of the heavenly grace.';

// Map lectionary book names → traditional 1928 BCP display names
const BCP_BOOK_NAMES: Record<string, string> = {
  'Sirach':          'Ecclesiasticus',
  'Three Children':  'Song of Three Children',
};
function bcpDisplayRef(ref: string): string {
  return ref.replace(/Sirach|Three Children/g, (m) => BCP_BOOK_NAMES[m] ?? m);
}

const NAV_SECTIONS = [
  { key: 'opening',  label: 'Opening Sentence' },
  { key: 'psalms',   label: 'Psalms' },
  { key: 'lesson1',  label: 'First Lesson' },
  { key: 'lesson2',  label: 'Second Lesson' },
  { key: 'creed',    label: 'Creed' },
  { key: 'collects', label: 'Collects' },
];

export function EveningPrayerScreen() {
  const { colors, sizes, lineHeights, isDark } = useTheme();
  const today = useToday();
  const season = getLiturgicalSeason(today);
  const gloriaInSeason = showGloriaPatri(season);
  const feastDay = getFeastDay(today);
  const insets = useSafeAreaInsets();

  const { leadType, priestAbsolutionForm, layAbsolution, creedChoice, shorterForm } = useSettings();

  if (shorterForm) return <ShorterFormScreen type="evening" />;

  const proper = (collectsData as any).proper;
  const properCollectKey = getProperCollectKey(today);
  const properCollectText: string | null = properCollectKey ? proper[properCollectKey] : null;
  const appendLentCollect = showLentDailyCollect(today);

  const absolution = (collectsData.common as any).absolution[priestAbsolutionForm as PriestAbsolutionForm];

  const appointedKey = getAppointedPsalmsKey(today);
  const appointedRefs: string[] = (appointedPsalmsData as any)[appointedKey]?.evening ?? [];
  const psalmVerses: any[] = appointedRefs
    .map((ref: string) => {
      const entry = _lookupPsalmEP(ref);
      if (!entry) return null;
      return ref !== String(entry.psalm) ? { ...entry, title: `Psalm ${ref}` } : entry;
    })
    .filter(Boolean);

  const epLessons = (lectionaryData as any)[appointedKey]?.ep as { first: string; second: string } | undefined;
  const epFirstRef: string | null = epLessons?.first ?? null;
  const epSecondRef: string | null = epLessons?.second ?? null;
  const epFirstVerses: Array<{ verse: number; text: string }> | null =
    epFirstRef ? ((lessonsData as any)[epFirstRef] ?? null) : null;
  const epSecondVerses: Array<{ verse: number; text: string }> | null =
    epSecondRef ? ((lessonsData as any)[epSecondRef] ?? null) : null;

  const { magnificat, nuncDimittis, cantateDomini, deusMisereatur, bonumEstConfiteri, benedicAnimaMea } =
    canticlesData.evening as any;

  const allSentences = (collectsData.evening.openingSentences as any) as Record<string, string[]>;
  const goodFriday = isGoodFriday(today);
  const sentenceKey = goodFriday ? 'goodFriday'
    : isWhitsuntide(today) ? 'whitsunday'
    : isAscensiontide(today) ? 'ascensionDay'
    : isTrinitySunday(today) ? 'trinitySunday'
    : (season === 'Pre-Lent' || season === 'Trinity') ? 'default'
    : season;
  const openingSentences: string[] = allSentences[sentenceKey] ?? allSentences['default'];

  const { collectForPeace, collectForAid } = collectsData.evening;
  const { prayerForPresident, prayerForClergyAndPeople, prayerForAllConditions,
    generalThanksgiving, prayerOfChrysostom, theGrace } = collectsData.common as any;
  const { apostlesCreed, niceneCreed, collectForTrinity21 } = collectsData.common;

  const creedText = creedChoice === 'nicene' ? niceneCreed : apostlesCreed;
  const creedTitle = creedChoice === 'nicene' ? 'The Nicene Creed' : "The Apostles' Creed";
  const creedRubric = creedChoice === 'nicene'
    ? 'Then shall be said the Nicene Creed by the Minister and People, standing.'
    : "Then shall be said the Apostles' Creed by the Minister and People, standing.";

  // ── Section navigation ──────────────────────────────────────────────────────
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});
  const [navOpen, setNavOpen] = useState(false);

  function scrollToSection(key: string) {
    const y = sectionOffsets.current[key];
    if (y !== undefined) scrollRef.current?.scrollTo({ y: Math.max(0, y - 16), animated: true });
    setNavOpen(false);
  }

  function markSection(key: string) {
    return (e: any) => { sectionOffsets.current[key] = e.nativeEvent.layout.y; };
  }

  const s = {
    scroll:     { flex: 1, backgroundColor: colors.parchment } as const,
    content:    { paddingHorizontal: 24, paddingTop: 28, paddingBottom: 100 } as const,
    dateLabel:  { fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.inkLight, textAlign: 'center' as const, marginBottom: 4 },
    officeTitle:{ fontFamily: Typography.serifBold, fontSize: Math.round(28 * (sizes.body / 18)), lineHeight: Math.round(36 * (sizes.body / 18)), color: colors.ink, textAlign: 'center' as const, marginBottom: 4, letterSpacing: 0.5 },
    seasonLabel:{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.rubric, textAlign: 'center' as const, marginBottom: 4 },
    holyDayLabel:{ fontFamily: Typography.serifBold, fontSize: sizes.rubric, color: colors.rubric, textAlign: 'center' as const, marginBottom: 16 },
    block:      { marginBottom: 28 } as const,
    spacer:     { height: 10 } as const,
    closing:    { alignItems: 'center' as const, paddingVertical: 16 },
    closingText:{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.rubric },
  };

  const fabBottom = insets.bottom + 72;

  return (
    <View style={{ flex: 1, backgroundColor: colors.parchment }}>
      <ScrollView ref={scrollRef} style={s.scroll} contentContainerStyle={s.content}>

        <Text style={s.dateLabel}>{formatLiturgicalDate(today)}</Text>
        <Text style={s.officeTitle}>Evening Prayer</Text>
        <Text style={s.seasonLabel}>{season}</Text>
        {feastDay && <Text style={s.holyDayLabel}>{feastDay.name}</Text>}
        <Divider />

        <View onLayout={markSection('opening')}>
          <Section title="Opening Sentence">
            <RubricText text="The Minister shall begin the Evening Prayer by reading with a loud voice one or more of the following Sentences of Scripture." />
            {openingSentences.map((s2, i) => <BodyText key={`os-${i}`} text={s2} />)}
          </Section>
        </View>

        <View style={s.block}>
          <RubricText text="Then the Minister shall read the Exhortation, or a part thereof, or shall say," />
          <MinisterText text="LET us humbly confess our sins unto Almighty God." />
          <OrDivider />
          <MinisterText text={EXHORTATION} />
        </View>
        <Divider />

        <Section title="A General Confession">
          <RubricText text="Then shall the Minister and People, all kneeling, say the General Confession." />
          <PeopleText noIndent text={CONFESSION} />
        </Section>

        {leadType === 'priest' ? (
          <Section title="The Absolution">
            <RubricText text="Then shall the Priest (or Bishop, if he be present) stand and pronounce the Absolution." />
            <MinisterText text={absolution} />
          </Section>
        ) : layAbsolution === 'kyrie' ? (
          <Section title="Kyrie Eleison">
            <RubricText text="Then shall be said by the Minister and People, all kneeling," />
            <MinisterText text="Lord, have mercy upon us." />
            <PeopleText text="Christ, have mercy upon us." />
            <MinisterText text="Lord, have mercy upon us." />
          </Section>
        ) : (
          <Section title="A Collect for Pardon">
            <RubricText text="Then the Minister shall say the Collect for the Twenty-first Sunday after Trinity." />
            <MinisterText text={collectForTrinity21} />
          </Section>
        )}
        <Divider />

        <Section title="The Lord's Prayer">
          <RubricText text="Then the Minister shall say the Lord's Prayer; the People repeating after him every Petition." />
          <BodyText text={LORDS_PRAYER} />
        </Section>
        <Divider />

        <Section title="Versicles and Responses">
          <RubricText text="Then shall be said," />
          <MinisterText text="O Lord, open thou our lips." />
          <PeopleText text="And our mouth shall shew forth thy praise." />
          <BodyText text="Glory be to the Father, and to the Son: and to the Holy Ghost;" />
          <PeopleText text="As it was in the beginning, is now, and ever shall be: world without end. Amen." />
          <MinisterText text="Praise ye the Lord." />
          <PeopleText text="The Lord's Name be praised." />
        </Section>
        <Divider />

        <View onLayout={markSection('psalms')}>
          <Section title="The Psalms">
            <RubricText text="Then shall follow the Psalms in order as they are appointed." />
            {psalmVerses.length > 0 ? (
              <>
                <RubricText noMark text={'Psalms ' + appointedRefs.join(', ')} />
                {psalmVerses.map((entry: any) => (
                  <PsalmView key={`${appointedKey}-${entry.psalm}`} entry={entry} showGloria={gloriaInSeason} />
                ))}
              </>
            ) : (
              <RubricText noMark text="[Psalms for this day — to be added]" />
            )}
            {!gloriaInSeason && (
              <RubricText noMark text="The Gloria Patri is omitted after each Psalm in Lent and Pre-Lent." />
            )}
          </Section>
        </View>

        <View onLayout={markSection('lesson1')}>
          <Section title="The First Lesson">
            <RubricText text="Here shall be read the First Lesson, taken out of the Old Testament as is appointed." />
            {epFirstRef ? (
              <>
                <RubricText text={'Here beginneth ' + bcpDisplayRef(epFirstRef) + '.'} />
                {epFirstVerses ? (
                  epFirstVerses.map((v) => <BodyText key={`ep1-${v.verse}`} text={`${v.verse} ${v.text}`} />)
                ) : (
                  <RubricText noMark text={`[${bcpDisplayRef(epFirstRef)}]`} />
                )}
                <RubricText text="Here endeth the First Lesson." />
              </>
            ) : (
              <RubricText noMark text="[Lesson for this day — to be added]" />
            )}
          </Section>
        </View>

        <CanticleView canticle={magnificat} showGloria={gloriaInSeason} />
        <OrDivider />
        <CanticleView canticle={cantateDomini} showGloria={gloriaInSeason} />
        <OrDivider />
        <CanticleView canticle={bonumEstConfiteri} showGloria={gloriaInSeason} />

        <View onLayout={markSection('lesson2')}>
          <Section title="The Second Lesson">
            <RubricText text="Here shall be read the Second Lesson, taken out of the New Testament as is appointed." />
            {epSecondRef ? (
              <>
                <RubricText text={'Here beginneth ' + bcpDisplayRef(epSecondRef) + '.'} />
                {epSecondVerses ? (
                  epSecondVerses.map((v) => <BodyText key={`ep2-${v.verse}`} text={`${v.verse} ${v.text}`} />)
                ) : (
                  <RubricText noMark text={`[${bcpDisplayRef(epSecondRef)}]`} />
                )}
                <RubricText text="Here endeth the Second Lesson." />
              </>
            ) : (
              <RubricText noMark text="[Lesson for this day — to be added]" />
            )}
          </Section>
        </View>

        <CanticleView canticle={nuncDimittis} showGloria={gloriaInSeason} />
        <OrDivider />
        <CanticleView canticle={deusMisereatur} showGloria={gloriaInSeason} />
        <OrDivider />
        <CanticleView canticle={benedicAnimaMea} showGloria={gloriaInSeason} />

        <View onLayout={markSection('creed')}>
          <Section title={creedTitle}>
            <RubricText text={creedRubric} />
            <BodyText text={creedText} />
          </Section>
        </View>
        <Divider />

        <Section title="The Prayers">
          <RubricText text="Then the Minister, turning to the People, shall say," />
          <MinisterText text="The Lord be with you." />
          <PeopleText text="And with thy spirit." />
          <MinisterText text="Let us pray." />
          <View style={s.spacer} />
          <RubricText text="Here, if it hath not already been said, shall follow the Lord's Prayer." />
          <View style={s.spacer} />
          <RubricText text="Then shall be said," />
          <MinisterText text="O Lord, shew thy mercy upon us." />
          <PeopleText text="And grant us thy salvation." />
          <MinisterText text="O Lord, save the State." />
          <PeopleText text="And mercifully hear us when we call upon thee." />
          <MinisterText text="Endue thy Ministers with righteousness." />
          <PeopleText text="And make thy chosen people joyful." />
          <MinisterText text="O Lord, save thy people." />
          <PeopleText text="And bless thine inheritance." />
          <MinisterText text="Give peace in our time, O Lord." />
          <PeopleText text="Because there is none other that fighteth for us, but only thou, O God." />
          <MinisterText text="O God, make clean our hearts within us." />
          <PeopleText text="And take not thy Holy Spirit from us." />
        </Section>
        <Divider />

        <View onLayout={markSection('collects')}>
          <Section title="The Collect of the Day">
            <RubricText text="Then shall follow the Collect of the Day." />
            {properCollectText ? (
              <BodyText text={properCollectText} />
            ) : (
              <RubricText noMark text="[Proper Collect — to be added]" />
            )}
            {appendLentCollect && (
              <>
                <View style={s.spacer} />
                <RubricText text="This Collect is to be said every day in Lent, after the Collect appointed for the day, until Palm Sunday." />
                <BodyText text={proper.ashWednesday} />
              </>
            )}
          </Section>
        </View>

        <Section title="A Collect for Peace">
          <BodyText text={collectForPeace} />
        </Section>
        <Section title="A Collect for Aid against Perils">
          <BodyText text={collectForAid} />
        </Section>
        <Divider />

        <Section title="A Prayer for the President of the United States and all in Civil Authority">
          <BodyText text={prayerForPresident} />
        </Section>
        <Section title="A Prayer for the Clergy and People">
          <BodyText text={prayerForClergyAndPeople} />
        </Section>
        <Section title="A Prayer for all Conditions of Men">
          <BodyText text={prayerForAllConditions} />
        </Section>
        <Divider />

        <Section title="A General Thanksgiving">
          <RubricText text="To be said by the whole Congregation, after the Minister, all kneeling." />
          <PeopleText noIndent text={generalThanksgiving} />
        </Section>
        <Section title="A Prayer of St. Chrysostom">
          <BodyText text={prayerOfChrysostom} />
        </Section>
        <Section title="The Grace">
          <RubricText noMark text="2 Corinthians 13:14" />
          <BodyText text={theGrace} />
        </Section>
        <Divider />

        <View style={s.closing}>
          <Text style={s.closingText}>Here endeth Evening Prayer.</Text>
        </View>
      </ScrollView>

      {/* Section nav modal */}
      <Modal transparent visible={navOpen} animationType="fade" onRequestClose={() => setNavOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setNavOpen(false)}>
          <View style={[styles.navMenu, {
            backgroundColor: colors.tabBar,
            borderColor: colors.rule,
            bottom: fabBottom + 52,
          }]}>
            {NAV_SECTIONS.map((sec) => (
              <TouchableOpacity key={sec.key} onPress={() => scrollToSection(sec.key)} style={styles.navItem}>
                <Text style={{ fontFamily: Typography.serif, fontSize: sizes.body, color: colors.ink }}>
                  {sec.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>

      {/* Floating section button */}
      <TouchableOpacity
        style={[styles.fab, { bottom: fabBottom, backgroundColor: colors.tabBar, borderColor: colors.rule }]}
        onPress={() => setNavOpen(true)}
        activeOpacity={0.8}
      >
        <Text style={{ fontFamily: Typography.serifBold, fontSize: 18, color: colors.ink }}>§</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', alignItems: 'flex-end' },
  navMenu: {
    position: 'absolute',
    right: 20,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 6,
    minWidth: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  navItem: {
    paddingVertical: 11,
    paddingHorizontal: 18,
  },
  fab: {
    position: 'absolute',
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
});
