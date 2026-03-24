/**
 * scripts/buildSpotifyMap.js
 *
 * Generates src/data/psalm-spotify-map.json by fetching track listings from
 * the three source playlists using the Spotify Client Credentials flow.
 *
 * Usage:
 *   EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET=your_secret node scripts/buildSpotifyMap.js
 *
 * The output file maps psalm numbers (1–150) to Spotify URIs:
 *   { "1": "spotify:track:XXXX", "23": "spotify:track:YYYY", ... }
 *
 * Priority:
 *   1. Primary playlist   (2RZzlZql959ayqy80IbCrE) — Complete Coverdale Psalter
 *   2. Backup playlist    (6v4gK9ygDGIDysz714Fo3Y) — Complete Coverdale Psalter
 *   3. Tertiary playlist  (4IhVLw2j8anLVpJ4HyFjAR) — Psalm 31 only
 */

const fs   = require('fs');
const path = require('path');

const CLIENT_ID     = '6ceca246da474e5f81055528b667e8c2';
const CLIENT_SECRET = process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET;

const PLAYLIST_PRIMARY  = '2RZzlZql959ayqy80IbCrE';
const PLAYLIST_BACKUP   = '6v4gK9ygDGIDysz714Fo3Y';
const PLAYLIST_TERTIARY = '4IhVLw2j8anLVpJ4HyFjAR';

const OUTPUT_PATH = path.join(__dirname, '../src/data/psalm-spotify-map.json');

if (!CLIENT_SECRET || CLIENT_SECRET === 'YOUR_CLIENT_SECRET_HERE') {
  console.error(
    'Error: Set EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET before running this script.\n' +
    'Example: EXPO_PUBLIC_SPOTIFY_CLIENT_SECRET=your_secret node scripts/buildSpotifyMap.js',
  );
  process.exit(1);
}

async function getClientCredentialsToken() {
  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type':  'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials',
  });
  if (!res.ok) {
    throw new Error(`Failed to get token: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  return data.access_token;
}

async function fetchAllPlaylistTracks(token, playlistId) {
  const tracks = [];
  let url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=next,items(track(name,uri))&limit=100`;
  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) {
      console.warn(`  Warning: playlist ${playlistId} returned ${res.status}`);
      break;
    }
    const data = await res.json();
    for (const item of data.items ?? []) {
      if (item?.track?.name && item?.track?.uri) {
        tracks.push({ title: item.track.name, uri: item.track.uri });
      }
    }
    url = data.next ?? null;
  }
  return tracks;
}

function parsePsalmNumber(title) {
  const m = title.match(/^Psalm\s+(\d+)/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return n >= 1 && n <= 150 ? n : null;
}

async function main() {
  console.log('Fetching Spotify access token…');
  const token = await getClientCredentialsToken();
  console.log('Token acquired.\n');

  console.log('Fetching primary playlist…');
  const primary = await fetchAllPlaylistTracks(token, PLAYLIST_PRIMARY);
  console.log(`  ${primary.length} tracks`);

  console.log('Fetching backup playlist…');
  const backup = await fetchAllPlaylistTracks(token, PLAYLIST_BACKUP);
  console.log(`  ${backup.length} tracks`);

  console.log('Fetching tertiary playlist…');
  const tertiary = await fetchAllPlaylistTracks(token, PLAYLIST_TERTIARY);
  console.log(`  ${tertiary.length} tracks\n`);

  const map = {};

  for (const t of primary) {
    const n = parsePsalmNumber(t.title);
    if (n && !map[String(n)]) map[String(n)] = t.uri;
  }
  for (const t of backup) {
    const n = parsePsalmNumber(t.title);
    if (n && !map[String(n)]) map[String(n)] = t.uri;
  }
  if (!map['31']) {
    for (const t of tertiary) {
      if (parsePsalmNumber(t.title) === 31) {
        map['31'] = t.uri;
        break;
      }
    }
  }

  const mapped   = Object.keys(map).length;
  const missing  = [];
  for (let i = 1; i <= 150; i++) {
    if (!map[String(i)]) missing.push(i);
  }

  // Write sorted by psalm number
  const sorted = Object.fromEntries(
    Object.entries(map).sort((a, b) => Number(a[0]) - Number(b[0])),
  );
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(sorted, null, 2));

  console.log(`Mapped ${mapped}/150 psalms → ${OUTPUT_PATH}`);
  if (missing.length > 0) {
    console.log(`Missing psalms: ${missing.join(', ')}`);
  } else {
    console.log('All 150 psalms mapped.');
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
