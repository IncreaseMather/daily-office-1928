/**
 * Spotify service — OAuth helpers, token persistence, and API calls.
 *
 * The OAuth flow uses PKCE and does NOT require the client secret.
 * The psalm map is now a static local JSON file (src/data/psalm-spotify-map.json).
 */

import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
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
  'user-read-currently-playing',
  'user-read-private',
  'playlist-read-private',
  'playlist-read-collaborative',
];

const SECURE_KEY_ACCESS_TOKEN  = 'spotify_access_token';
const SECURE_KEY_REFRESH_TOKEN = 'spotify_refresh_token';
const SECURE_KEY_EXPIRES_AT    = 'spotify_expires_at';
const SECURE_KEY_DISPLAY_NAME  = 'spotify_display_name';

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

/**
 * Triggers playback of a Spotify track URI on the user's active device via
 * the REST API — no app switch required.
 *
 * Throws:
 *   'no_device'        — no active Spotify device found (HTTP 404)
 *   'premium_required' — account does not have Premium (HTTP 403)
 *   'not_authenticated'— no valid token available
 */
export async function playSpotifyTrack(uri: string): Promise<void> {
  const token = await getValidToken();
  if (!token) throw new Error('not_authenticated');

  const res = await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [uri] }),
  });

  if (res.status === 404) throw new Error('no_device');
  if (res.status === 403) throw new Error('premium_required');
  if (res.status === 204 || res.ok) return; // 204 No Content = success
  throw new Error(`playback_error_${res.status}`);
}

/** Pauses playback on the user's active Spotify device. */
export async function pauseSpotifyPlayback(): Promise<void> {
  const token = await getValidToken();
  if (!token) throw new Error('not_authenticated');

  const res = await fetch('https://api.spotify.com/v1/me/player/pause', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 404) throw new Error('no_device');
  if (res.status === 204 || res.ok) return;
  throw new Error(`pause_error_${res.status}`);
}
