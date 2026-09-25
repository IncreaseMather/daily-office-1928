import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

const SOURCE = require('../../Kittens Meowing.mp3');

let enabled = false;
let player: AudioPlayer | null = null;
let audioMode: Promise<void> | null = null;
let playing = false;

export function setKittenMeowEnabled(on: boolean) {
  enabled = on;
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

function ensurePlayer(): AudioPlayer {
  if (player) return player;
  player = createAudioPlayer(SOURCE);
  player.loop = false;
  player.addListener('playbackStatusUpdate', (status) => {
    const ended = status.duration > 0 && status.currentTime >= status.duration - 0.25;
    if (status.didJustFinish || (!status.playing && ended)) playing = false;
  });
  return player;
}

/** Play the kittens recording once from the start. A press while it is already playing lets that playback finish. */
export function playKitten(force = false) {
  if (!force && !enabled) return;
  if (playing) return;
  playing = true;
  void (async () => {
    try {
      await ensureAudioMode();
      const current = ensurePlayer();
      current.loop = false;
      try {
        await current.seekTo(0);
      } catch {
        // Still try to play from wherever the player is.
      }
      current.play();
    } catch {
      playing = false;
    }
  })();
}
