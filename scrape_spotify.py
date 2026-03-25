import requests
from bs4 import BeautifulSoup
import re
import json

PLAYLISTS = [
    "https://open.spotify.com/playlist/2RZzlZql959ayqy80IbCrE",
    "https://open.spotify.com/playlist/0VVABuQD62b6my7lWo6xak",
    "https://open.spotify.com/playlist/6v4gK9ygDGIDysz714Fo3Y"
]

def get_spotify_tracks(playlist_url):
    """Scrape Spotify playlist for track data"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    response = requests.get(playlist_url, headers=headers)
    response.encoding = 'utf-8'
    
    # Look for track data in the HTML - Spotify embeds it as JSON-LD or in window.__data
    match = re.search(r'<script id="__spot">(.+?)</script>', response.text)
    if match:
        try:
            data = json.loads(match.group(1))
            return data
        except:
            pass
    
    # Try alternate method - look for track hrefs
    soup = BeautifulSoup(response.text, 'html.parser')
    tracks = []
    
    # Find all links to tracks
    for link in soup.find_all('a', href=True):
        href = link.get('href')
        if '/track/' in href and 'spotify.com' in href:
            # Extract just the URL without parameters
            track_url = href.split('?')[0]
            if track_url not in tracks:
                tracks.append(track_url)
    
    return tracks

def extract_psalm_number(track_name):
    """Extract psalm number from track name"""
    match = re.search(r'Psalm\s+(\d+)|^(\d+)[\s:\.]|^(\d+)$', track_name, re.IGNORECASE)
    if match:
        psalm_num = match.group(1) or match.group(2) or match.group(3)
        return int(psalm_num)
    return None

print("Fetching playlists...")
psalm_tracks = {}

for playlist_url in PLAYLISTS:
    print(f"\nFetching {playlist_url}...")
    try:
        tracks = get_spotify_tracks(playlist_url)
        print(f"Found {len(tracks)} track URLs")
        for track_url in tracks[:10]:
            print(f"  {track_url}")
    except Exception as e:
        print(f"  Error: {e}")

