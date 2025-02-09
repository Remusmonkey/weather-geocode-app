import requests
from dotenv import load_dotenv
import os

load_dotenv()
TOMORROW_IO_API_KEY = os.getenv("TOMORROW_IO_API_KEY")
REALTIME_WEATHER_URL = "https://api.tomorrow.io/v4/weather/realtime" #"?location=thousandoaks&apikey=XefzcxNfC9PKe7jsBeZiEAH4q8Ytx4bW"
def get_weather(lat, long):
    if not lat or not long:
        return {"error": "Missing location parameter"}, 400

    headers = {
        "accept": "application/json",
        "accept-encoding": "deflate, gzip, br"
    }
    params = {
        'apikey': TOMORROW_IO_API_KEY,
        'location': f'{lat},{long}',
        'units': 'imperial'
    }
    try:
        response = requests.get(REALTIME_WEATHER_URL, params=params, headers=headers)
        response.raise_for_status()
        weather_data = response.json()
        #print(f"Weather API Response: {weather_data}")  # Debugging log
        return weather_data
    except requests.exceptions.RequestException as e:
        return {"error": f"API request failed: {e}"}, 500

if __name__ == "__main__":
    lat = "34.0522"
    long = "-118.2437"
    print("Fetching weather data...\n")
    result = get_weather(lat, long)
    print(result)  # Print the API response
