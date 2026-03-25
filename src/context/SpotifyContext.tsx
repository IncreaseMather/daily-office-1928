import React, {
  createContext, useContext, useState, useEffect, useCallback, useMemo,
} from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';

import staticPsalmMap from '../data/psalm-spotify-map.json';

import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_DISCOVERY,
  SPOTIFY_SCOPES,
  saveTokens,
  loadTokens,
  clearTokens,
  saveDisplayName,
  loadDisplayName,
  refreshAccessToken,
  fetchUserProfile,
  playSpotifyTrack,
  pauseSpotifyPlayback,
} from '../services/spotify';

WebBrowser.maybeCompleteAuthSession();

const SECURE_KEY_CODE_VERIFIER = 'spotify_pkce_verifier';

// ── Context type ──────────────────────────────────────────────────────────────

interface SpotifyContextValue {
  isConnected: boolean;
  isConnecting: boolean;
  connectError: string | null;
  displayName: string | null;
  spotifyEnabled: boolean;
  psalmMap: Record<string, string>;
  currentlyPlayingPsalm: number | null;
  setSpotifyEnabled: (v: boolean) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  playPsalm: (psalmNumber: number, uri: string) => Promise<void>;
  pausePlayback: () => Promise<void>;
}

const SpotifyContext = createContext<SpotifyContextValue>({
  isConnected: false,
  isConnecting: false,
  connectError: null,
  displayName: null,
  spotifyEnabled: false,
  psalmMap: staticPsalmMap as Record<string, string>,
  currentlyPlayingPsalm: null,
  setSpotifyEnabled: () => {},
  connect: async () => {},
  disconnect: async () => {},
  playPsalm: async () => {},
  pausePlayback: async () => {},
});

export function useSpotify(): SpotifyContextValue {
  return useContext(SpotifyContext);
}

// ── Provider ──────────────────────────────────────────────────────────────────

const ASYNC_KEY_SPOTIFY_ENABLED = 'spotify_enabled';

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected]               = useState(false);
  const [isConnecting, setIsConnecting]             = useState(false);
  const [connectError, setConnectError]             = useState<string | null>(null);
  const [displayName, setDisplayName]               = useState<string | null>(null);
  const [spotifyEnabled, _setEnabled]               = useState(false);
  const [currentlyPlayingPsalm, setCurrentlyPlayingPsalm] = useState<number | null>(null);

  // Psalm map is always the static file — no runtime fetching needed
  const psalmMap = staticPsalmMap as Record<string, string>;

  const redirectUri = useMemo(() => AuthSession.makeRedirectUri({
    native: 'dailyoffice1928://auth',
    preferLocalhost: true,
  }), []);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    { clientId: SPOTIFY_CLIENT_ID, scopes: SPOTIFY_SCOPES, redirectUri, usePKCE: true },
    SPOTIFY_DISCOVERY,
  );

  // ── Load persisted state on mount ─────────────────────────────────────────

  useEffect(() => {
    (async () => {
      const [name, enabled, tokens] = await Promise.all([
        loadDisplayName(),
        import('@react-native-async-storage/async-storage').then(m =>
          m.default.getItem(ASYNC_KEY_SPOTIFY_ENABLED)),
        loadTokens(),
      ]);

      if (tokens.accessToken) {
        let validToken = tokens.accessToken;
        if (Date.now() >= tokens.expiresAt - 60_000 && tokens.refreshToken) {
          validToken =
            (await refreshAccessToken(tokens.refreshToken)) ?? tokens.accessToken;
        }
        if (validToken) {
          setIsConnected(true);
          setDisplayName(name);
        }
      }

      if (enabled === 'true') _setEnabled(true);
    })();
  }, []);

  // ── Handle OAuth response ─────────────────────────────────────────────────

  useEffect(() => {
    if (!response) return;

    if (response.type === 'error') {
      setConnectError(response.error?.message ?? 'Spotify authorisation failed.');
      setIsConnecting(false);
      return;
    }
    if (response.type === 'dismiss' || response.type === 'cancel') {
      setIsConnecting(false);
      return;
    }
    if (response.type !== 'success') return;

    const { code } = response.params;
    if (!code) {
      setConnectError('No authorisation code returned by Spotify.');
      setIsConnecting(false);
      return;
    }

    (async () => {
      try {
        const codeVerifier =
          request?.codeVerifier ??
          (await SecureStore.getItemAsync(SECURE_KEY_CODE_VERIFIER));

        if (!codeVerifier) {
          setConnectError('PKCE verifier missing — please try connecting again.');
          return;
        }

        const tokenResult = await AuthSession.exchangeCodeAsync(
          {
            clientId:    SPOTIFY_CLIENT_ID,
            code,
            redirectUri,
            extraParams: { code_verifier: codeVerifier },
          },
          SPOTIFY_DISCOVERY,
        );

        await SecureStore.deleteItemAsync(SECURE_KEY_CODE_VERIFIER);
        await saveTokens(
          tokenResult.accessToken,
          tokenResult.refreshToken ?? null,
          tokenResult.expiresIn ?? 3600,
        );

        const profile = await fetchUserProfile(tokenResult.accessToken);
        const name = profile?.display_name ?? 'Spotify User';
        await saveDisplayName(name);
        setDisplayName(name);
        setConnectError(null);
        setIsConnected(true);
      } catch (err: any) {
        setConnectError(err?.message ?? 'Could not complete Spotify sign-in. Please try again.');
      } finally {
        setIsConnecting(false);
      }
    })();
  }, [response]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const connect = useCallback(async () => {
    setConnectError(null);
    setIsConnecting(true);
    if (request?.codeVerifier) {
      await SecureStore.setItemAsync(SECURE_KEY_CODE_VERIFIER, request.codeVerifier);
    }
    await promptAsync();
  }, [promptAsync, request]);

  const disconnect = useCallback(async () => {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await clearTokens();
    await AsyncStorage.removeItem(ASYNC_KEY_SPOTIFY_ENABLED);
    await SecureStore.deleteItemAsync(SECURE_KEY_CODE_VERIFIER);
    setIsConnected(false);
    setDisplayName(null);
    setConnectError(null);
    setCurrentlyPlayingPsalm(null);
    _setEnabled(false);
  }, []);

  const playPsalm = useCallback(async (psalmNumber: number, uri: string) => {
    await playSpotifyTrack(uri);
    setCurrentlyPlayingPsalm(psalmNumber);
  }, []);

  const pausePlayback = useCallback(async () => {
    await pauseSpotifyPlayback();
    setCurrentlyPlayingPsalm(null);
  }, []);

  const setSpotifyEnabled = useCallback((v: boolean) => {
    _setEnabled(v);
    import('@react-native-async-storage/async-storage').then(m =>
      m.default.setItem(ASYNC_KEY_SPOTIFY_ENABLED, String(v)));
  }, []);

  return (
    <SpotifyContext.Provider value={{
      isConnected, isConnecting, connectError,
      displayName, spotifyEnabled, psalmMap,
      currentlyPlayingPsalm,
      setSpotifyEnabled, connect, disconnect,
      playPsalm, pausePlayback,
    }}>
      {children}
    </SpotifyContext.Provider>
  );
}
