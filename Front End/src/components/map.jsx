import React, { useState, useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/map.css"; // Import the CSS file

const Map = ({ onSelectLocation, imageUrl }) => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState([31.7701, 35.2138]); // Default location
  const [description, setDescription] = useState(
    "Default Location Description"
  );
  const [error, setError] = useState(null);

  useEffect(() => {
    const map = L.map("map").setView(coordinates, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const marker = L.marker(coordinates).addTo(map);

    const popupContent = `
      <div>
        <h3>Location Details</h3>
        <p>${description}</p>
        <img src="${imageUrl}" alt="Location" style="width: 100px; height: auto;"/>
      </div>
    `;
    marker.bindPopup(popupContent).openPopup();

    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      setCoordinates([lat, lng]);
      marker.setLatLng([lat, lng]);
      onSelectLocation([lat, lng]);
    });

    return () => {
      map.remove();
    };
  }, [coordinates, description, imageUrl, onSelectLocation]);

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
      setError(null);
      onSelectLocation([parseFloat(lat), parseFloat(lon)]);
    } catch (err) {
      setError("Failed to fetch geocode data. Please try again later.");
    }
  };

  return (
    <div>
      <h1>Interactive Map with Address Geocoding</h1>

      <div className="map-container">
        <input
          type="text"
          placeholder="Enter an address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="map-input"
        />
        <button onClick={handleGeocode} className="map-button">
          Locate
        </button>
        {error && <div className="error-message">{error}</div>}
        <br />
        <input
          type="text"
          placeholder="Enter a description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="description-input"
        />
      </div>

      <div id="map"></div>
    </div>
  );
};

export default Map;
