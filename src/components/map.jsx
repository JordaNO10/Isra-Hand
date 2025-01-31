import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const [address, setAddress] = useState(""); // Address input
  const [coordinates, setCoordinates] = useState([31.7701, 35.2138]); // Default location
  const [description, setDescription] = useState(
    "Default Location Description"
  );
  const [imageUrl, setImageUrl] = useState("https://via.placeholder.com/100"); // Placeholder image
  const [error, setError] = useState(null); // Error state for invalid address

  useEffect(() => {
    const map = L.map("map").setView(coordinates, 13);

    // Add OpenStreetMap tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Add a marker with a popup
    const marker = L.marker(coordinates).addTo(map);

    const popupContent = `
      <div>
        <h3>Location Details</h3>
        <p>${description}</p>
        <img src="${imageUrl}" alt="Location" style="width: 100px; height: auto;"/>
      </div>
    `;
    marker.bindPopup(popupContent).openPopup();

    return () => {
      map.remove();
    };
  }, [coordinates, description, imageUrl]);

  const handleGeocode = async () => {
    if (!address) {
      setError("Please enter a valid address.");
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );

      const data = await response.json();
      if (data.length === 0) {
        setError("Address not found. Please try another one.");
        return;
      }

      const { lat, lon } = data[0];
      setCoordinates([parseFloat(lat), parseFloat(lon)]);
      setError(null); // Clear error
    } catch (err) {
      setError("Failed to fetch geocode data. Please try again later.");
    }
  };

  return (
    <div>
      <h1>Interactive Map with Address Geocoding</h1>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Enter an address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          style={{ marginBottom: "10px", padding: "8px", width: "80%" }}
        />
        <button
          onClick={handleGeocode}
          style={{
            marginLeft: "10px",
            padding: "8px 16px",
            background: "blue",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Locate
        </button>
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
        )}
        <br />
        <input
          type="text"
          placeholder="Enter a description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ marginBottom: "10px", padding: "8px", width: "80%" }}
        />
        <br />
        <input
          type="text"
          placeholder="Enter an image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ marginBottom: "10px", padding: "8px", width: "80%" }}
        />
      </div>

      <div id="map" style={{ width: "600px", height: "450px" }}></div>
    </div>
  );
};

export default Map;
