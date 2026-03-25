import requests

CLIENT_ID = "6ceca246da474e5f81055528b667e8c2"
CLIENT_SECRET = "8bd00b13c1064a03abc56c2ea4fceafa"

# Test 1: Get auth token
print("Testing authentication...")
auth_url = "https://accounts.spotify.com/api/token"
data = {
    "grant_type": "client_credentials",
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET
}
response = requests.post(auth_url, data=data)
token_data = response.json()

if "error" in token_data:
    print(f"Auth error: {token_data}")
else:
    print("✓ Auth successful")
    token = token_data["access_token"]
    
    # Test 2: Get one of the playlists
    print("\nTesting playlist access...")
    playlist_id = "2RZzlZql959ayqy80IbCrE"
    url = f"https://api.spotify.com/v1/playlists/{playlist_id}"
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, headers=headers)
    data = response.json()
    
    print(f"Response: {data}")
