/**
 * Spotify service — OAuth helpers, token persistence, API calls,
 * and psalm-to-track map construction.
 *
 * The OAuth flow uses PKCE and does NOT require the client secret.
 * The client secret is only used by scripts/buildSpotifyMap.js.
 */

import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Constants ─────────────────────────────────────────────────────────────────

export const SPOTIFY_CLIENT_ID = '6ceca246da474e5f81055528b667e8c2';

export const SPOTIFY_DISCOVERY = {
  authorizationEndpoint: 'https://accounts.spotify.com/authorize',
  tokenEndpoint:         'https://accounts.spotify.com/api/token',
};

export const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-private',
];

// Source playlists in priority order
const PLAYLIST_PRIMARY  = '2RZzlZql959ayqy80IbCrE'; // estatelawdawg — Complete Coverdale Psalter
const PLAYLIST_BACKUP   = '6v4gK9ygDGIDysz714Fo3Y'; // nabef9 — Complete Coverdale Psalter
const PLAYLIST_TERTIARY = '4IhVLw2j8anLVpJ4HyFjAR'; // Dan Conway — Psalm 31 fallback

const SECURE_KEY_ACCESS_TOKEN  = 'spotify_access_token';
const SECURE_KEY_REFRESH_TOKEN = 'spotify_refresh_token';
const SECURE_KEY_EXPIRES_AT    = 'spotify_expires_at';
const SECURE_KEY_DISPLAY_NAME  = 'spotify_display_name';
const ASYNC_KEY_PSALM_MAP      = 'spotify_psalm_map';

// ── Token storage ─────────────────────────────────────────────────────────────

export async function saveTokens(
  accessToken: string,
  refreshToken: string | null,
  expiresIn: number,
): Promise<void> {
  const expiresAt = String(Date.now() + expiresIn * 1000);
  await Promise.all([
    SecureStore.setItemAsync(SECURE_KEY_ACCESS_TOKEN, accessToken),
    SecureStore.setItemAsync(SECURE_KEY_EXPIRES_AT, expiresAt),
    refreshToken
      ? SecureStore.setItemAsync(SECURE_KEY_REFRESH_TOKEN, refreshToken)
      : Promise.resolve(),
  ]);
}

export async function loadTokens(): Promise<{
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number;
}> {
  const [at, rt, exp] = await Promise.all([
    SecureStore.getItemAsync(SECURE_KEY_ACCESS_TOKEN),
    SecureStore.getItemAsync(SECURE_KEY_REFRESH_TOKEN),
    SecureStore.getItemAsync(SECURE_KEY_EXPIRES_AT),
  ]);
  return { accessToken: at, refreshToken: rt, expiresAt: Number(exp ?? 0) };
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    SecureStore.deleteItemAsync(SECURE_KEY_ACCESS_TOKEN),
    SecureStore.deleteItemAsync(SECURE_KEY_REFRESH_TOKEN),
    SecureStore.deleteItemAsync(SECURE_KEY_EXPIRES_AT),
    SecureStore.deleteItemAsync(SECURE_KEY_DISPLAY_NAME),
  ]);
}

export async function saveDisplayName(name: string): Promise<void> {
  await SecureStore.setItemAsync(SECURE_KEY_DISPLAY_NAME, name);
}

export async function loadDisplayName(): Promise<string | null> {
  return SecureStore.getItemAsync(SECURE_KEY_DISPLAY_NAME);
}

// ── Token refresh ─────────────────────────────────────────────────────────────

export async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const result = await AuthSession.refreshAsync(
      { clientId: SPOTIFY_CLIENT_ID, refreshToken },
      SPOTIFY_DISCOVERY,
    );
    await saveTokens(
      result.accessToken,
      result.refreshToken ?? refreshToken,
      result.expiresIn ?? 3600,
    );
    return result.accessToken;
  } catch {
    return null;
  }
}

/** Returns a valid access token, refreshing silently if needed. */
export async function getValidToken(): Promise<string | null> {
  const { accessToken, refreshToken, expiresAt } = await loadTokens();
  if (!accessToken) return null;
  if (Date.now() < expiresAt - 60_000) return accessToken;
  if (!refreshToken) return null;
  return refreshAccessToken(refreshToken);
}

// ── Spotify Web API ───────────────────────────────────────────────────────────

export async function fetchUserProfile(
  token: string,
): Promise<{ display_name: string } | null> {
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

/** Fetches every track from a playlist, handling Spotify's 100-item pagination. */
async function fetchAllPlaylistTracks(
  token: string,
  playlistId: string,
): Promise<Array<{ title: string; uri: string }>> {
  const tracks: Array<{ title: string; uri: string }> = [];
  let url: string | null =
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks` +
    `?fields=next,items(track(name,uri))&limit=100`;

  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) break;
    const data = await res.json();
    for (const item of data.items ?? []) {
      const name: string | undefined = item?.track?.name;
      const uri: string | undefined  = item?.track?.uri;
      if (name && uri) tracks.push({ title: name, uri });
    }
    url = data.next ?? null;
  }
  return tracks;
}

/** Extracts the psalm number from titles like "Psalm 23" or "Psalm 119: Aleph". */
function parsePsalmNumber(title: string): number | null {
  const m = title.match(/^Psalm\s+(\d+)/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 1 && n <= 150 ? n : null;
}

// ── Psalm map ─────────────────────────────────────────────────────────────────

/**
 * Fetches all three playlists with the authenticated user's token, builds the
 * psalm → Spotify URI mapping using the priority rules, and caches it.
 */
export async function buildAndCachePsalmMap(
  token: string,
): Promise<Record<string, string>> {
  const [primary, backup, tertiary] = await Promise.all([
    fetchAllPlaylistTracks(token, PLAYLIST_PRIMARY),
    fetchAllPlaylistTracks(token, PLAYLIST_BACKUP),
    fetchAllPlaylistTracks(token, PLAYLIST_TERTIARY),
  ]);

  const map: Record<string, string> = {};

  for (const track of primary) {
    const n = parsePsalmNumber(track.title);
    if (n && !map[String(n)]) map[String(n)] = track.uri;
  }
  for (const track of backup) {
    const n = parsePsalmNumber(track.title);
    if (n && !map[String(n)]) map[String(n)] = track.uri;
  }
  // Tertiary only fills Psalm 31
  if (!map['31']) {
    for (const track of tertiary) {
      if (parsePsalmNumber(track.title) === 31) {
        map['31'] = track.uri;
        break;
      }
    }
  }

  await AsyncStorage.setItem(ASYNC_KEY_PSALM_MAP, JSON.stringify(map));
  return map;
}

export async function loadCachedPsalmMap(): Promise<Record<string, string>> {
  const raw = await AsyncStorage.getItem(ASYNC_KEY_PSALM_MAP);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch { return {}; }
}

/** Opens a Spotify track URI in the app, falling back to the web player. */
import { Linking } from 'react-native';

export async function openSpotifyTrack(uri: string): Promise<void> {
  // uri format: spotify:track:TRACKID
  const canOpen = await Linking.canOpenURL(uri);
  if (canOpen) {
    await Linking.openURL(uri);
  } else {
    const trackId = uri.replace('spotify:track:', '');
    await Linking.openURL(`https://open.spotify.com/track/${trackId}`);
  }
}
