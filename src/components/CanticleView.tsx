import React from 'react';
import { View, Text } from 'react-native';
import { Typography } from '../theme';
import { useTheme } from '../context/SettingsContext';
import { RubricText, Divider } from './OfficeSection';
import canticlesData from '../data/canticles.json';

interface CanticleData {
  id: string;
  title: string;
  reference?: string;
  rubric?: string;
  verses: string[];
  gloria?: boolean;
}

function toRoman(n: number): string {
  const vals = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
  const syms = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];
  let result = '';
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) { result += syms[i]; n -= vals[i]; }
  }
  return result;
}

function psalmRefWithRomans(ref: string): string {
  if (!ref.startsWith('Psalm ')) return ref;
  // Extract only the psalm number(s), drop verse ranges, use lowercase Roman numerals
  const parts = ref.split('; ');
  const numerals = parts.map((part, i) => {
    const m = i === 0 ? part.match(/^Psalm (\d+)/) : part.match(/^(\d+)/);
    return m ? toRoman(parseInt(m[1], 10)).toLowerCase() : '';
  }).filter(Boolean);
  return 'Psalm ' + numerals.join('; ');
}

export function CanticleView({
  canticle,
  showGloria = true,
}: {
  canticle: CanticleData;
  showGloria?: boolean;
}) {
  const { colors, sizes, lineHeights } = useTheme();
  return (
    <View>
      <Text style={{
        fontFamily: Typography.serifBold,
        fontSize: sizes.subheading,
        lineHeight: lineHeights.heading,
        color: colors.ink,
        marginBottom: 2,
      }}>{canticle.title}</Text>
      {canticle.reference ? (
        <Text style={{
          fontFamily: Typography.serifItalic,
          fontSize: sizes.rubric,
          color: colors.inkLight,
          marginBottom: 8,
        }}>{psalmRefWithRomans(canticle.reference)}</Text>
      ) : null}
      {canticle.rubric ? <RubricText text={canticle.rubric} /> : null}
      {canticle.verses.map((verse, i) => (
        <Text key={i} style={{
          fontFamily: Typography.serif,
          fontSize: sizes.body,
          lineHeight: lineHeights.body,
          color: colors.ink,
          marginBottom: 5,
        }}>{verse}</Text>
      ))}
      {canticle.gloria && showGloria ? (
        <Text style={{
          fontFamily: Typography.serifItalic,
          fontSize: sizes.body,
          lineHeight: lineHeights.body,
          color: colors.ink,
          marginTop: 6,
        }}>{(canticlesData as any).gloria}</Text>
      ) : null}
      <Divider />
    </View>
  );
}
