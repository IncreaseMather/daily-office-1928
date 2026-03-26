import React from 'react';
import { TouchableOpacity, Text, View, Alert } from 'react-native';
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

  const iconSize = sizes.rubric + 2;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.6}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={{ marginLeft: 8 }}
    >
      <View style={{
        width: iconSize + 8,
        height: iconSize + 8,
        borderRadius: (iconSize + 8) / 2,
        backgroundColor: colors.rubric,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Text style={{
          fontSize: iconSize - 2,
          color: colors.parchment,
          includeFontPadding: false,
          textAlignVertical: 'center',
          lineHeight: iconSize,
        }}>
          {isPlaying ? '⏸' : '▶'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
