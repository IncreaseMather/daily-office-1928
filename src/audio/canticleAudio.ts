import { useSyncExternalStore } from 'react';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

/**
 * Files in the project folder "canticle audio", matched by filename.
 * Nunc Dimittis is spelled "Dimittus" in the filename.
 * "Benedictus es.mp3" is Benedictus es, Domine, not the Song of Zechariah.
 */
const SOURCES: Record<string, number> = {
  venite: require('../../canticle audio/Venite.mp3'),
  'te-deum': require('../../canticle audio/Te Deum.mp3'),
  'benedictus-dominus': require('../../canticle audio/Benedictus es.mp3'),
  jubilate: require('../../canticle audio/Jubilate Deo.mp3'),
  magnificat: require('../../canticle audio/Magnificat.mp3'),
  'nunc-dimittis': require('../../canticle audio/Nunc Dimittus.mp3'),
};

const players = new Map<string, AudioPlayer>();
const finished = new Set<string>();
const listeners = new Set<() => void>();
let activeId: string | null = null;
let audioMode: Promise<void> | null = null;

function emit() {
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function ensureAudioMode() {
  if (!audioMode) {
    audioMode = setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: 'doNotMix',
      allowsRecording: false,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
    });
  }
  return audioMode;
}

function ensurePlayer(id: string): AudioPlayer {
  const existing = players.get(id);
  if (existing) return existing;
  const player = createAudioPlayer(SOURCES[id]);
  player.addListener('playbackStatusUpdate', (status) => {
    if (status.didJustFinish) finished.add(id);
    emit();
  });
  players.set(id, player);
  return player;
}

export function hasCanticleAudio(id: string): boolean {
  return Object.prototype.hasOwnProperty.call(SOURCES, id);
}

export function useCanticlePlaying(id: string): boolean {
  return useSyncExternalStore(
    subscribe,
    () => {
      const player = players.get(id);
      return !!player && activeId === id && player.playing && !finished.has(id);
    },
    () => false,
  );
}

/** Move this canticle back to the start without playing. */
export async function restartCanticle(id: string) {
  if (!hasCanticleAudio(id)) return;
  const player = players.get(id);
  if (!player) return;
  player.pause();
  finished.add(id);
  try {
    await player.seekTo(0);
  } catch {
    // The position is still marked so the next play begins at the start.
  }
  player.pause();
  emit();
}

export async function toggleCanticle(id: string) {
  if (!hasCanticleAudio(id)) return;
  await ensureAudioMode();
  const player = ensurePlayer(id);
  if (activeId === id && player.playing) {
    player.pause();
    emit();
    return;
  }
  if (activeId && activeId !== id) {
    players.get(activeId)?.pause();
  }
  if (finished.has(id)) {
    finished.delete(id);
    await player.seekTo(0);
  }
  activeId = id;
  player.play();
  emit();
}
