import requests
from dotenv import load_dotenv
import os

load_dotenv()

GEOCODE_API_KEY = os.getenv("GEOCODE_API_KEY")
GEOCODE_URL = "https://geocode.xyz/"

def get_location_data(location):
    if not location:
        return {"error": "Missing location parameter"}, 400
    params = {
        'auth': f'{GEOCODE_API_KEY}',
        'locate': location,
        #'region': '',
        'json': 1,
    }
    try:
        response = requests.get(GEOCODE_URL, params= params)
        response.raise_for_status()
        geo_data = response.json()
        print(f"Geocode API Response: {geo_data}")  # Debugging log
        return geo_data
    except requests.exceptions.RequestException as e:
        return {"error": f"API request failed: {e}"}, 500


