import React, { useState } from "react";

function App() {
    const [location, setLocation] = useState("");  // Stores user input
    const [geocodeData, setGeocodeData] = useState(null); // Stores geocode results
    const [weatherData, setWeatherData] = useState(null); // Stores weather data
    const [error, setError] = useState("");  // Stores error messages
    const [selectedLocation, setSelectedLocation] = useState(null); // Stores user-selected location

    const handleSearch = async () => {
        setError("");  // Reset errors
        setGeocodeData(null);
        setWeatherData(null);
        setSelectedLocation(null);

        try {
            // Fetch Geocode Data
            const geocodeResponse = await fetch(`http://127.0.0.1:5000/geocode?location=${location}`);
            const geocodeResult = await geocodeResponse.json();

            // If multiple locations are returned
            if (geocodeResult.results) {
                setGeocodeData(geocodeResult.results); // Store the list of locations
                return; // Stop execution so user can pick a location
            }

            // If only one location is found, fetch weather immediately
            if (geocodeResult.latitude && geocodeResult.longitude) {
                setGeocodeData([geocodeResult]); // Wrap in array for consistency
                fetchWeather(geocodeResult.latitude, geocodeResult.longitude);
            } else {
                setError("Location not found. Please try again.");
            }
        } catch (err) {
            setError("Error fetching geocode data. Please try again.");
        }
    };

    const fetchWeather = async (lat, lon) => {
        try {
            const weatherResponse = await fetch(`http://127.0.0.1:5000/weather?lat=${lat}&lon=${lon}`);
            const weatherResult = await weatherResponse.json();
            setWeatherData(weatherResult);
        } catch (err) {
            setError("Error fetching weather data. Please try again.");
        }
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>Weather Geocode App</h1>

            <input
                type="text"
                placeholder="Enter a location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ padding: "10px", marginRight: "10px" }}
            />
            <button onClick={handleSearch} style={{ padding: "10px" }}>Search</button>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* If multiple locations are found, show dropdown */}
            {geocodeData && geocodeData.length > 1 && (
                <div>
                    <h3>Select a Location</h3>
                    <select
                        onChange={(e) => {
                            const selected = geocodeData.find(loc => loc.latitude === e.target.value);
                            setSelectedLocation(selected);
                            fetchWeather(selected.latitude, selected.longitude);
                        }}
                    >
                        <option value="">-- Select a location --</option>
                        {geocodeData.map((loc, index) => (
                            <option key={index} value={loc.latitude}>
                                {loc.city}, {loc.state}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Show the selected geocode data */}
            {selectedLocation && (
                <div>
                    <h3>Selected Location</h3>
                    <p><strong>City:</strong> {selectedLocation.city}</p>
                    <p><strong>State:</strong> {selectedLocation.state}</p>
                    <p><strong>Latitude:</strong> {selectedLocation.latitude}</p>
                    <p><strong>Longitude:</strong> {selectedLocation.longitude}</p>
                </div>
            )}

            {/* Show weather data if available */}
            {weatherData && (
                <div>
                    <h3>Weather Data</h3>
                    <p><strong>Temperature:</strong> {weatherData.temperature}°F</p>
                    <p><strong>Feels Like:</strong> {weatherData.temperatureApparent}°F</p>
                    <p><strong>Weather Condition:</strong> {weatherData.weather_description}</p>
                </div>
            )}
        </div>
    );
}

export default App;
