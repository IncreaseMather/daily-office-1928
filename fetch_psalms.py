import requests
import re

# Spotify API credentials
CLIENT_ID = "6ceca246da474e5f81055528b667e8c2"
CLIENT_SECRET = "8bd00b13c1064a03abc56c2ea4fceafa"

# Playlist IDs
PLAYLISTS = [
    "2RZzlZql959ayqy80IbCrE",
    "0VVABuQD62b6my7lWo6xak",
    "6v4gK9ygDGIDysz714Fo3Y"
]

def get_auth_token():
    """Get Spotify API auth token"""
    auth_url = "https://accounts.spotify.com/api/token"
    data = {
        "grant_type": "client_credentials",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }
    response = requests.post(auth_url, data=data)
    return response.json()["access_token"]

def get_playlist_tracks(playlist_id, token):
    """Get all tracks from a playlist"""
    tracks = []
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}/tracks?limit=50"
    headers = {"Authorization": f"Bearer {token}"}
    
    attempt = 0
    while url and attempt < 100:
        attempt += 1
        response = requests.get(url, headers=headers)
        data = response.json()
        
        if "error" in data:
            print(f"  Error: {data['error']}")
            # Try without tracks endpoint, use public API instead
            print(f"  Retrying with public endpoint...")
            break
        
        items = data.get("items", [])
        if not items and attempt == 1:
            print(f"  No items returned. Full response: {list(data.keys())}")
            break
        
        if items:
            print(f"  Got {len(items)} items")
            tracks.extend(items)
        
        url = data.get("next")
    
    return tracks

def extract_psalm_number(track_name):
    """Extract psalm number from track name"""
    # Look for patterns like "Psalm 1", "Psalm 1:", "1.", etc.
    match = re.search(r'Psalm\s+(\d+)|^(\d+)[\s:\.]|^(\d+)$', track_name, re.IGNORECASE)
    if match:
        psalm_num = match.group(1) or match.group(2) or match.group(3)
        return int(psalm_num)
    return None

def main():
    print("Authenticating with Spotify...")
    token = get_auth_token()
    print("✓ Authenticated")
    
    # Dictionary to store psalm -> track URL mapping
    psalm_tracks = {}
    
    # Fetch from all playlists
    for playlist_id in PLAYLISTS:
        print(f"\nFetching playlist {playlist_id}...")
        tracks = get_playlist_tracks(playlist_id, token)
        print(f"  Found {len(tracks)} tracks")
        
        for track in tracks:
            if track["track"] is None:
                continue
            
            track_name = track["track"]["name"]
            track_url = track["track"]["external_urls"].get("spotify")
            
            psalm_num = extract_psalm_number(track_name)
            
            if psalm_num and 1 <= psalm_num <= 150:
                if psalm_num not in psalm_tracks:
                    psalm_tracks[psalm_num] = track_url
                    print(f"  Psalm {psalm_num}: {track_name}")
    
    # Write to file
    print("\nWriting to file...")
    with open(r"c:\Users\aliss\DailyOffice\SpotifyRefernces.txt", "w") as f:
        for i in range(1, 151):
            if i in psalm_tracks:
                f.write(psalm_tracks[i] + "\n")
            else:
                f.write("\n")
    
    print(f"✓ File updated with {len(psalm_tracks)} psalms")
    print(f"  Coverage: {len(psalm_tracks)}/150 psalms")

if __name__ == "__main__":
    main()
