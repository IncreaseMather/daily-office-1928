import React from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/SettingsContext';
import { hasCanticleAudio, restartCanticle, toggleCanticle, useCanticlePlaying } from '../audio/canticleAudio';

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

function RestartMark({ color }: { color: string }) {
  return (
    <Svg width={11} height={11} viewBox="0 0 24 24">
      <Path
        d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z"
        fill={color}
      />
    </Svg>
  );
}

export function CanticlePlayButton({ canticleId }: { canticleId: string }) {
  const { colors } = useTheme();
  const playing = useCanticlePlaying(canticleId);
  if (!hasCanticleAudio(canticleId)) return null;
  const control = {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: colors.rule,
    borderRadius: 3,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
      <Pressable
        onPress={() => { toggleCanticle(canticleId); }}
        accessibilityRole="button"
        accessibilityLabel={playing ? 'Pause' : 'Play'}
        hitSlop={8}
        style={control}
      >
        {playing
          ? <PauseMark color={colors.ink} />
          : <PlayMark color={colors.ink} />}
      </Pressable>
      <Pressable
        onPress={() => { restartCanticle(canticleId); }}
        accessibilityRole="button"
        accessibilityLabel="Restart"
        hitSlop={8}
        style={[control, { marginLeft: 6 }]}
      >
        <RestartMark color={colors.ink} />
      </Pressable>
    </View>
  );
}
