import React from 'react';
import { View, Text } from 'react-native';
import { Typography } from '../theme';
import { useTheme } from '../context/SettingsContext';

export function SectionHeading({ text }: { text: string }) {
  const { colors, sizes, lineHeights } = useTheme();
  return (
    <Text style={{
      fontFamily: Typography.serifBold,
      fontSize: sizes.heading,
      lineHeight: lineHeights.heading,
      color: colors.ink,
      marginBottom: 6,
    }}>{text}</Text>
  );
}

export function BodyText({ text, indent }: { text: string; indent?: boolean }) {
  const { colors, sizes, lineHeights } = useTheme();
  return (
    <Text style={{
      fontFamily: Typography.serif,
      fontSize: sizes.body,
      lineHeight: lineHeights.body,
      color: colors.ink,
      marginBottom: 4,
      paddingLeft: indent ? 22 : 0,
    }}>{text}</Text>
  );
}

export function MinisterText({ text, indent }: { text: string; indent?: boolean }) {
  const { colors, sizes, lineHeights } = useTheme();
  return (
    <Text style={{
      fontFamily: Typography.serifBold,
      fontSize: sizes.body,
      lineHeight: lineHeights.body,
      color: colors.ink,
      marginBottom: 4,
      paddingLeft: indent ? 22 : 0,
    }}>{text}</Text>
  );
}

export function PeopleText({ text, noIndent }: { text: string; noIndent?: boolean }) {
  const { colors, sizes, lineHeights } = useTheme();
  return (
    <Text style={{
      fontFamily: Typography.serif,
      fontSize: sizes.body,
      lineHeight: lineHeights.body,
      color: colors.ink,
      marginBottom: 4,
      paddingLeft: noIndent ? 0 : 22,
    }}>{text}</Text>
  );
}

export function RubricText({ text, noMark }: { text: string; noMark?: boolean }) {
  const { colors, sizes, lineHeights } = useTheme();
  return (
    <Text style={{
      fontFamily: Typography.serifItalic,
      fontSize: sizes.rubric,
      lineHeight: lineHeights.rubric,
      color: colors.rubric,
      marginBottom: 10,
    }}>{noMark ? text : '¶ ' + text}</Text>
  );
}

export function Divider() {
  const { colors } = useTheme();
  return (
    <View style={{
      height: 1,
      backgroundColor: colors.rule,
      marginVertical: 24,
    }} />
  );
}

export function OrDivider() {
  const { colors, sizes } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.rule }} />
      <Text style={{
        fontFamily: Typography.serifItalic,
        fontSize: sizes.rubric,
        color: colors.rubric,
        marginHorizontal: 14,
      }}>or</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: colors.rule }} />
    </View>
  );
}

export function Section({ title, rubric, children }: {
  title: string;
  rubric?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ marginBottom: 28 }}>
      <SectionHeading text={title} />
      {rubric ? <RubricText text={rubric} /> : null}
      {children}
    </View>
  );
}
