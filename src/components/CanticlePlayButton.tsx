import React from 'react';
import { Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/SettingsContext';
import { hasCanticleAudio, toggleCanticle, useCanticlePlaying } from '../audio/canticleAudio';

function PlayMark({ color }: { color: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 12 12">
      <Path d="M3.1 1.15 L10.35 6 L3.1 10.85 Z" fill={color} />
    </Svg>
  );
}

function PauseMark({ color }: { color: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 12 12">
      <Path d="M2.15 1.2 H4.55 V10.8 H2.15 Z M7.45 1.2 H9.85 V10.8 H7.45 Z" fill={color} />
    </Svg>
  );
}

export function CanticlePlayButton({ canticleId }: { canticleId: string }) {
  const { colors } = useTheme();
  const playing = useCanticlePlaying(canticleId);
  if (!hasCanticleAudio(canticleId)) return null;
  return (
    <Pressable
      onPress={() => { toggleCanticle(canticleId); }}
      accessibilityRole="button"
      accessibilityLabel={playing ? 'Pause' : 'Play'}
      hitSlop={8}
      style={{
        width: 28,
        height: 28,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: colors.rule,
        borderRadius: 3,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {playing
        ? <PauseMark color={colors.ink} />
        : <PlayMark color={colors.ink} />}
    </Pressable>
  );
}
