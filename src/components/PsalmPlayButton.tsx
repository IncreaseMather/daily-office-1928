import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Typography } from '../theme';
import { useTheme } from '../context/SettingsContext';
import { useSpotify } from '../context/SpotifyContext';
import { openSpotifyTrack } from '../services/spotify';

interface Props {
  psalmNumber: number;
}

export function PsalmPlayButton({ psalmNumber }: Props) {
  const { colors, sizes } = useTheme();
  const { isConnected, spotifyEnabled, psalmMap } = useSpotify();

  if (!isConnected || !spotifyEnabled) return null;

  const uri = psalmMap[String(psalmNumber)];
  if (!uri) return null;

  return (
    <TouchableOpacity
      onPress={() => openSpotifyTrack(uri)}
      activeOpacity={0.6}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{ marginLeft: 8, justifyContent: 'center' }}
    >
      <Text style={{
        fontFamily: Typography.serif,
        fontSize: sizes.rubric,
        color: colors.rubric,
        lineHeight: sizes.subheading,
      }}>
        {'▶'}
      </Text>
    </TouchableOpacity>
  );
}
