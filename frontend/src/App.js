import React, { useState } from "react";

function App() {
    const [location, setLocation] = useState("");
    const [geocodeData, setGeocodeData] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [error, setError] = useState("");

    const handleSearch = async () => {
        setError(""); // Clear previous errors

        try {
            // Fetch Geocode Data
            const geocodeResponse = await fetch(`http://127.0.0.1:5000/geocode?location=${location}`);
            const geocodeResult = await geocodeResponse.json();

            if (!geocodeResult.latt || !geocodeResult.longt) {
                setError("Location not found. Please try again.");
                return;
            }

            setGeocodeData(geocodeResult);

            // Fetch Weather Data
            const weatherResponse = await fetch(`http://127.0.0.1:5000/weather?lat=${geocodeResult.latt}&lon=${geocodeResult.longt}`);
            const weatherResult = await weatherResponse.json();

            setWeatherData(weatherResult);
        } catch (err) {
            setError("Error fetching data. Please try again.");
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

            {geocodeData && (
                <div>
                    <h3>Location Data</h3>
                    <p><strong>Latitude:</strong> {geocodeData.latt}</p>
                    <p><strong>Longitude:</strong> {geocodeData.longt}</p>
                </div>
            )}

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