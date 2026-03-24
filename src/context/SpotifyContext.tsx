import React, {
  createContext, useContext, useState, useEffect, useCallback, useMemo,
} from 'react';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  getValidToken,
  fetchUserProfile,
  buildAndCachePsalmMap,
  loadCachedPsalmMap,
} from '../services/spotify';

// Must be called unconditionally at module load so it runs whenever the app
// opens from a redirect URL (including after remount on Android).
WebBrowser.maybeCompleteAuthSession();

const ASYNC_KEY_SPOTIFY_ENABLED = 'spotify_enabled';
const SECURE_KEY_CODE_VERIFIER  = 'spotify_pkce_verifier';

// ── Context type ──────────────────────────────────────────────────────────────

interface SpotifyContextValue {
  isConnected: boolean;
  isConnecting: boolean;
  isMapBuilding: boolean;
  connectError: string | null;
  displayName: string | null;
  spotifyEnabled: boolean;
  psalmMap: Record<string, string>;
  setSpotifyEnabled: (v: boolean) => void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
}

const SpotifyContext = createContext<SpotifyContextValue>({
  isConnected: false,
  isConnecting: false,
  isMapBuilding: false,
  connectError: null,
  displayName: null,
  spotifyEnabled: false,
  psalmMap: {},
  setSpotifyEnabled: () => {},
  connect: async () => {},
  disconnect: async () => {},
});

export function useSpotify(): SpotifyContextValue {
  return useContext(SpotifyContext);
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function SpotifyProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected]     = useState(false);
  const [isConnecting, setIsConnecting]   = useState(false);
  const [isMapBuilding, setIsMapBuilding] = useState(false);
  const [connectError, setConnectError]   = useState<string | null>(null);
  const [displayName, setDisplayName]     = useState<string | null>(null);
  const [spotifyEnabled, _setEnabled]     = useState(false);
  const [psalmMap, setPsalmMap]           = useState<Record<string, string>>({});

  // Memoised so both useAuthRequest and exchangeCodeAsync always see the
  // identical string — recomputation on every render would rebuild the request.
  const redirectUri = useMemo(() => AuthSession.makeRedirectUri({
    native: 'dailyoffice1928://auth',  // production standalone
    preferLocalhost: true,             // Expo Go: replaces local IP → localhost
  }), []);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    { clientId: SPOTIFY_CLIENT_ID, scopes: SPOTIFY_SCOPES, redirectUri, usePKCE: true },
    SPOTIFY_DISCOVERY,
  );

  // ── Helper: build map from a valid token, with full state management ─────────

  const triggerMapBuild = useCallback(async (token: string) => {
    setIsMapBuilding(true);
    try {
      const map = await buildAndCachePsalmMap(token);
      setPsalmMap(map);
      console.log(`[Spotify] Psalm map built: ${Object.keys(map).length} psalms mapped`);
    } catch (err) {
      console.warn('[Spotify] Failed to build psalm map:', err);
    } finally {
      setIsMapBuilding(false);
    }
  }, []);

  // ── Load persisted state on mount ─────────────────────────────────────────

  useEffect(() => {
    (async () => {
      const [name, enabled, tokens, cachedMap] = await Promise.all([
        loadDisplayName(),
        AsyncStorage.getItem(ASYNC_KEY_SPOTIFY_ENABLED),
        loadTokens(),
        loadCachedPsalmMap(),
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
          if (Object.keys(cachedMap).length > 0) {
            setPsalmMap(cachedMap);
            console.log(`[Spotify] Loaded cached map: ${Object.keys(cachedMap).length} psalms`);
          } else {
            // Map was never built (e.g. first launch after connecting) — build now.
            triggerMapBuild(validToken);
          }
        }
      }

      if (enabled === 'true') _setEnabled(true);
    })();
  }, []);

  // ── Handle OAuth response ─────────────────────────────────────────────────
  //
  // No initDone guard — the response effect must run immediately on any
  // render, including after a remount triggered by the redirect deep link.

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
        // Prefer the live request's verifier; fall back to the value we
        // persisted before opening the browser, in case of a remount.
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

        // Build the psalm map immediately after connecting.
        await triggerMapBuild(tokenResult.accessToken);
      } catch (err: any) {
        setConnectError(err?.message ?? 'Could not complete Spotify sign-in. Please try again.');
        console.warn('[Spotify] Token exchange failed:', err);
      } finally {
        setIsConnecting(false);
      }
    })();
  }, [response]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const connect = useCallback(async () => {
    setConnectError(null);
    setIsConnecting(true);
    // Persist the verifier before opening the browser so it survives a remount.
    if (request?.codeVerifier) {
      await SecureStore.setItemAsync(SECURE_KEY_CODE_VERIFIER, request.codeVerifier);
    }
    await promptAsync();
  }, [promptAsync, request]);

  const disconnect = useCallback(async () => {
    await clearTokens();
    await AsyncStorage.removeItem(ASYNC_KEY_SPOTIFY_ENABLED);
    await SecureStore.deleteItemAsync(SECURE_KEY_CODE_VERIFIER);
    setIsConnected(false);
    setDisplayName(null);
    setConnectError(null);
    _setEnabled(false);
    setPsalmMap({});
  }, []);

  // When the toggle is turned on: if the map is empty but we're connected,
  // fetch a valid token and rebuild. This is the recovery path for a silent
  // build failure on first connect.
  const setSpotifyEnabled = useCallback((v: boolean) => {
    _setEnabled(v);
    AsyncStorage.setItem(ASYNC_KEY_SPOTIFY_ENABLED, String(v));

    if (v && Object.keys(psalmMap).length === 0) {
      getValidToken().then((token) => {
        if (token) triggerMapBuild(token);
      });
    }
  }, [psalmMap, triggerMapBuild]);

  return (
    <SpotifyContext.Provider value={{
      isConnected, isConnecting, isMapBuilding,
      connectError, displayName, spotifyEnabled, psalmMap,
      setSpotifyEnabled, connect, disconnect,
    }}>
      {children}
    </SpotifyContext.Provider>
  );
}
