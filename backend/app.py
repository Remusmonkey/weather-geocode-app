from flask import Flask, request, jsonify
from geocode import get_location_data
from flask_cors import CORS
from weather import get_weather
app = Flask(__name__)
CORS(app)

@app.route('/geocode', methods= ['GET'])
def geocode():
    location = request.args.get('location')
    print(location)
    if not location:
        return jsonify({"error": "Missing location parameter"}), 400
    local_data = get_location_data(location)
    return jsonify(local_data)




if __name__ == "__main__":
    app.run(debug=True)


