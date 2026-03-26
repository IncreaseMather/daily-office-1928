import React from 'react';
import { TouchableOpacity, Text, View, Alert } from 'react-native';
import { Typography } from '../theme';
import { useTheme } from '../context/SettingsContext';
import { useSpotify } from '../context/SpotifyContext';

interface Props {
  psalmNumber: number;
}

export function PsalmPlayButton({ psalmNumber }: Props) {
  const { colors, sizes } = useTheme();
  const { isConnected, spotifyEnabled, psalmMap, currentlyPlayingPsalm, playPsalm, pausePlayback } = useSpotify();

  const uri = psalmMap[String(psalmNumber)];

  if (!isConnected || !spotifyEnabled || !uri) return null;

  const isPlaying = currentlyPlayingPsalm === psalmNumber;

  const handlePress = async () => {
    try {
      if (isPlaying) {
        await pausePlayback();
      } else {
        await playPsalm(psalmNumber, uri);
      }
    } catch (err: any) {
      if (err?.message === 'no_device') {
        Alert.alert(
          'No Active Device',
          'Open Spotify on this device first, then try again.',
        );
      } else if (err?.message === 'premium_required') {
        Alert.alert(
          'Spotify Premium Required',
          'Playback requires a Spotify Premium subscription.',
        );
      }
    }
  };

  // Bar dimensions sized to visually match the play triangle
  const barHeight = sizes.rubric;
  const barWidth  = Math.round(barHeight * 0.22);
  const barGap    = Math.round(barHeight * 0.18);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.6}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{ marginLeft: 8, justifyContent: 'center' }}
    >
      {isPlaying ? (
        // Pause: two plain red rectangles
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: barGap }}>
          <View style={{ width: barWidth, height: barHeight, backgroundColor: colors.rubric, borderRadius: 1 }} />
          <View style={{ width: barWidth, height: barHeight, backgroundColor: colors.rubric, borderRadius: 1 }} />
        </View>
      ) : (
        // Play: plain red triangle character
        <Text style={{
          fontFamily: Typography.serif,
          fontSize: sizes.rubric,
          color: colors.rubric,
          lineHeight: sizes.subheading,
        }}>
          {'▶'}
        </Text>
      )}
    </TouchableOpacity>
  );
}
