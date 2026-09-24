import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/SettingsContext';

/**
 * Filled cross pattée, sized to the surrounding body type.
 * Meant to sit inside a Text node, with a little space on each side.
 */
export function SignOfTheCross() {
  const { colors, sizes } = useTheme();
  const size = Math.max(11, Math.round(sizes.body * 0.78));
  const gap = Math.max(3, Math.round(size * 0.32));
  return (
    <View
      accessible={false}
      collapsable={false}
      style={{
        width: size + gap * 2,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Path
          d="M28 4 L72 4 L58 42 L96 28 L96 72 L58 58 L72 96 L28 96 L42 58 L4 72 L4 28 L42 42 Z"
          fill={colors.rubric}
        />
      </Svg>
    </View>
  );
}

/** Inline cross immediately after the first occurrence of `after`. */
export function withSignOfTheCross(text: string, after: string): React.ReactNode {
  const idx = text.indexOf(after);
  if (idx < 0) return text;
  const cut = idx + after.length;
  return [text.slice(0, cut), <SignOfTheCross key="sign-of-the-cross" />, text.slice(cut)];
}
