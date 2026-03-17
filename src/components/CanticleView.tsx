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
        }}>{canticle.reference}</Text>
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
