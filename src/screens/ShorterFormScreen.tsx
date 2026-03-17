import React from 'react';
import { ScrollView, View, Text } from 'react-native';
import { Typography } from '../theme';
import { useTheme } from '../context/SettingsContext';
import { formatLiturgicalDate } from '../utils/dateHelpers';
import { getLiturgicalSeason, getProperCollectKey, showLentDailyCollect, getFeastDay } from '../utils/liturgicalCalendar';
import { Section, BodyText, RubricText, Divider } from '../components/OfficeSection';
import collectsData from '../data/collects.json';

const LORDS_PRAYER =
  'Our Father, who art in heaven, Hallowed be thy Name. Thy kingdom come. Thy will be done, On earth as it is in heaven. ' +
  'Give us this day our daily bread. And forgive us our trespasses, As we forgive those who trespass against us. ' +
  'And lead us not into temptation, But deliver us from evil. ' +
  'For thine is the kingdom, and the power, and the glory, for ever and ever. Amen.';

const COLLECT_FOR_GRACE =
  'O LORD, our heavenly Father, Almighty and everlasting God, who hast safely brought us to the beginning of this day; ' +
  'Defend us in the same with thy mighty power; and grant that this day we fall into no sin, neither run into any kind of danger; ' +
  'but that all our doings, being ordered by thy governance, may be righteous in thy sight; ' +
  'through Jesus Christ our Lord. Amen.';

const COLLECT_FOR_AID =
  'LIGHTEN our darkness, we beseech thee, O Lord; and by thy great mercy defend us from all perils and dangers of this night; ' +
  'for the love of thy only Son, our Saviour, Jesus Christ. Amen.';

const BLESSING =
  'THE Lord bless us and keep us. The Lord make his face to shine upon us, and be gracious unto us. ' +
  'The Lord lift up his countenance upon us, and give us peace, this night and evermore. Amen.';

const THE_GRACE =
  'THE grace of our Lord Jesus Christ, and the love of God, and the fellowship of the Holy Ghost, be with us all evermore. Amen.';

const OPENING_RUBRIC =
  'After the reading of a brief portion of Holy Scripture, let the Head of the Household, or some other member of the family, ' +
  "say as followeth, all kneeling, and repeating with him the Lord's Prayer.";

export function ShorterFormScreen({ type }: { type: 'morning' | 'evening' }) {
  const { colors, sizes } = useTheme();
  const today = new Date();
  const season = getLiturgicalSeason(today);
  const feastDay = getFeastDay(today);

  const proper = (collectsData as any).proper;
  const properCollectKey = getProperCollectKey(today);
  const properCollectText: string | null = properCollectKey ? proper[properCollectKey] : null;
  const appendLentCollect = showLentDailyCollect(today);
  const officeName = type === 'morning' ? 'Morning Prayer' : 'Evening Prayer';

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.parchment }}
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 28, paddingBottom: 80 }}
    >
      <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.inkLight, textAlign: 'center', marginBottom: 4 }}>
        {formatLiturgicalDate(today)}
      </Text>
      <Text style={{ fontFamily: Typography.serifBold, fontSize: Math.round(28 * (sizes.body / 18)), lineHeight: Math.round(36 * (sizes.body / 18)), color: colors.ink, textAlign: 'center', marginBottom: 4, letterSpacing: 0.5 }}>
        {officeName}
      </Text>
      <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.rubric, textAlign: 'center', marginBottom: 4 }}>
        {season}
      </Text>
      {feastDay && (
        <Text style={{ fontFamily: Typography.serifBold, fontSize: sizes.rubric, color: colors.rubric, textAlign: 'center', marginBottom: 16 }}>
          {feastDay.name}
        </Text>
      )}
      <Divider />

      <Section title="Family Prayer">
        <RubricText text={OPENING_RUBRIC} />
      </Section>
      <Divider />

      <Section title="The Collect of the Day">
        {properCollectText ? (
          <BodyText text={properCollectText} />
        ) : (
          <RubricText noMark text="[Proper Collect — to be added]" />
        )}
        {appendLentCollect && (
          <>
            <View style={{ height: 10 }} />
            <RubricText text="This Collect is to be said every day in Lent, after the Collect appointed for the day, until Palm Sunday." />
            <BodyText text={proper.ashWednesday} />
          </>
        )}
      </Section>
      <Divider />

      <Section title="The Lord's Prayer">
        <BodyText text={LORDS_PRAYER} />
      </Section>
      <Divider />

      {type === 'morning' ? (
        <Section title="A Collect for Grace">
          <BodyText text={COLLECT_FOR_GRACE} />
        </Section>
      ) : (
        <Section title="A Collect for Aid against Perils">
          <BodyText text={COLLECT_FOR_AID} />
        </Section>
      )}
      <Divider />

      <View style={{ marginBottom: 28 }}>
        <RubricText text="Here may be added any special Prayers." />
      </View>
      <Divider />

      {type === 'morning' ? (
        <Section title="The Grace">
          <BodyText text={THE_GRACE} />
        </Section>
      ) : (
        <Section title="The Blessing">
          <BodyText text={BLESSING} />
        </Section>
      )}
      <Divider />

      <View style={{ alignItems: 'center', paddingVertical: 16 }}>
        <Text style={{ fontFamily: Typography.serifItalic, fontSize: sizes.rubric, color: colors.rubric }}>
          {type === 'morning' ? 'Here endeth Morning Prayer.' : 'Here endeth Evening Prayer.'}
        </Text>
      </View>
    </ScrollView>
  );
}
