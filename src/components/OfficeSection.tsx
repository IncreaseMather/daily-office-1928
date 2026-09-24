import React from 'react';
import { View, Text } from 'react-native';
import { Typography } from '../theme';
import { useTheme, useSettings } from '../context/SettingsContext';
import { SignOfTheCross } from './SignOfTheCross';

/** Split text on [bracketed] segments and render them in italic. */
function renderWithBrackets(
  text: string,
  bracketStyle: object,
): React.ReactNode {
  const parts = text.split(/(\[[^\]]+\])/);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    part.startsWith('[') ? (
      <Text key={i} style={bracketStyle}>{part}</Text>
    ) : part
  );
}

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

function renderPrayerText(
  text: string,
  bracketStyle: object,
  crossAfter?: string,
): React.ReactNode {
  if (!crossAfter) return renderWithBrackets(text, bracketStyle);
  const idx = text.indexOf(crossAfter);
  if (idx < 0) return renderWithBrackets(text, bracketStyle);
  const cut = idx + crossAfter.length;
  const head = renderWithBrackets(text.slice(0, cut), bracketStyle);
  const tail = renderWithBrackets(text.slice(cut), bracketStyle);
  return [
    ...(Array.isArray(head) ? head : [head]),
    <SignOfTheCross key="sign-of-the-cross" />,
    ...(Array.isArray(tail) ? tail : [tail]),
  ];
}

export function BodyText({
  text, indent, crossAfter, crossBefore,
}: {
  text: string;
  indent?: boolean;
  /** Insert the sign of the cross immediately after the first match. */
  crossAfter?: string;
  /** Insert the sign of the cross immediately before the text. */
  crossBefore?: boolean;
}) {
  const { colors, sizes, lineHeights } = useTheme();
  const bracketStyle = { fontFamily: Typography.serifItalic, color: colors.inkLight };
  return (
    <Text style={{
      fontFamily: Typography.serif,
      fontSize: sizes.body,
      lineHeight: lineHeights.body,
      color: colors.ink,
      marginBottom: 4,
      paddingLeft: indent ? 22 : 0,
    }}>
      {crossBefore ? <SignOfTheCross /> : null}
      {renderPrayerText(text, bracketStyle, crossAfter)}
    </Text>
  );
}

const LABEL_WIDTH = 76;

export function MinisterText({ text, indent, crossAfter }: { text: string; indent?: boolean; crossAfter?: string }) {
  const { colors, sizes, lineHeights } = useTheme();
  const { leadType } = useSettings();
  const label = leadType === 'priest' ? 'Clergy' : 'Officiant';
  const bracketStyle = { fontFamily: Typography.serifItalic, color: colors.inkLight };
  return (
    <View style={{ flexDirection: 'row', marginBottom: 4, paddingLeft: indent ? 22 : 0 }}>
      <Text style={{
        fontFamily: Typography.serifItalic,
        fontSize: sizes.rubric,
        color: colors.rubric,
        width: LABEL_WIDTH,
        paddingTop: Math.round((lineHeights.body - sizes.rubric) / 2),
      }}>{label}</Text>
      <Text style={{
        fontFamily: Typography.serif,
        fontSize: sizes.body,
        lineHeight: lineHeights.body,
        color: colors.ink,
        flex: 1,
      }}>{renderPrayerText(text, bracketStyle, crossAfter)}</Text>
    </View>
  );
}

export function PeopleText({ text, noIndent }: { text: string; noIndent?: boolean }) {
  const { colors, sizes, lineHeights } = useTheme();
  const bracketStyle = { fontFamily: Typography.serifItalic, color: colors.inkLight };
  return (
    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
      <Text style={{
        fontFamily: Typography.serifItalic,
        fontSize: sizes.rubric,
        color: colors.rubric,
        width: LABEL_WIDTH,
        paddingTop: Math.round((lineHeights.body - sizes.rubric) / 2),
      }}>People</Text>
      <Text style={{
        fontFamily: Typography.serif,
        fontSize: sizes.body,
        lineHeight: lineHeights.body,
        color: colors.ink,
        flex: 1,
      }}>{renderWithBrackets(text, bracketStyle)}</Text>
    </View>
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
