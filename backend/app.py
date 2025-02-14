from flask import Flask, request, jsonify
from geocode import get_location_data
from flask_cors import CORS
from weather import get_weather
import logging
app = Flask(__name__)
CORS(app)
logging.basicConfig(level=logging.DEBUG, format="%(levelname)s:%(message)s")

@app.route('/geocode', methods= ['GET'])
def get_geocode():
    location = request.args.get('location')
    print(location)
    if not location:
        return jsonify({"error": "Missing location parameter"}), 400
    local_data = get_location_data(location)
    return jsonify(local_data)

@app.route('/weather', methods = ['GET'])
def get_realtime_weather():
    latitude = request.args.get('lat')
    longitude = request.args.get('lon')
    logging.debug(f"Received request for weather with lat: {latitude}, lon: {longitude}")
    if not latitude or not longitude:
        logging.warning(f"Invalid request. lat={latitude}, lon={longitude}")
        return jsonify({"error": "Missing latitude or longitude parameters"}), 400
    weather_info = get_weather(latitude, longitude)
    logging.debug(f"Weather API response: {weather_info}")
    return jsonify(weather_info)

if __name__ == "__main__":
    app.run(debug=True)


