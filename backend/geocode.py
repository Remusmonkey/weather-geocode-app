import requests
from dotenv import load_dotenv
import os
import logging
load_dotenv()
logging.basicConfig(level=logging.DEBUG, format="%(levelname)s:%(message)s")
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


        if isinstance(geo_data['alt']['loc'], list):
            locations = geo_data['alt']['loc']
            return [
                {
                    "city":loc.get("city"),
                    "state":loc.get("prov"),
                    "latitude":loc.get("latt"),
                    "longitude":loc.get("longt")
                }
                for loc in locations
            ]



        else:
            logging.debug("Else code activated")
            return {
                "city": geo_data["standard"].get("city"),
                "state": geo_data["alt"]["loc"].get("prov"),
                "latitude": geo_data.get("latt"),
                "longitude": geo_data.get("longt")
            }

    except requests.exceptions.RequestException as e:
        return {"error": f"API request failed: {e}"}, 500


if __name__ == "__main__":
    location = "New York"
    print("Fetching geo data...")
    result = get_location_data(location)
    print(result)  # Print the API response