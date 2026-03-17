import React from 'react';
import { View, Text } from 'react-native';
import { Typography } from '../theme';
import { useTheme } from '../context/SettingsContext';
import { Divider } from './OfficeSection';

interface PsalmEntry {
  psalm: number;
  title: string;
  subtitle?: string;
  text: string;
}

const GLORIA = 'Glory be to the Father, and to the Son: * and to the Holy Ghost;\nAs it was in the beginning, is now, and ever shall be: * world without end. Amen.';

export function PsalmView({ entry, showGloria = true }: { entry: PsalmEntry; showGloria?: boolean }) {
  const { colors, sizes, lineHeights } = useTheme();
  return (
    <View style={{ marginBottom: 4 }}>
      <Text style={{
        fontFamily: Typography.serifBold,
        fontSize: sizes.subheading,
        lineHeight: lineHeights.heading,
        color: colors.ink,
        marginBottom: 2,
      }}>{entry.title}</Text>
      {entry.subtitle ? (
        <Text style={{
          fontFamily: Typography.serifItalic,
          fontSize: sizes.rubric,
          color: colors.rubric,
          marginBottom: 10,
        }}>{entry.subtitle}</Text>
      ) : null}
      <Text style={{
        fontFamily: Typography.serif,
        fontSize: sizes.body,
        lineHeight: lineHeights.body,
        color: colors.ink,
        marginBottom: 6,
      }}>{entry.text}</Text>
      {showGloria ? (
        <Text style={{
          fontFamily: Typography.serifItalic,
          fontSize: sizes.body,
          lineHeight: lineHeights.body,
          color: colors.ink,
          marginTop: 4,
        }}>{GLORIA}</Text>
      ) : null}
      <Divider />
    </View>
  );
}
