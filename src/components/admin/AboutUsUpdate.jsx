import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Optional: Custom marker icon (using the default icon URL from Leaflet CDN)
const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// Component that listens for map clicks and updates location
const LocationSelector = ({ location, setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });
  return location.latitude && location.longitude ? (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={customIcon}
    />
  ) : null;
};

const AboutUsUpdate = ({ shopId }) => {
  // aboutUs now stores the whole object from the API
  const [aboutUs, setAboutUs] = useState({});
  const [editingAboutUsId, setEditingAboutUsId] = useState(null);
  const [showMap, setShowMap] = useState(false);
  // Location state for latitude/longitude; initialize as null (or use existing data after fetch)
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // Fetch the About Us data for the given shopId
  const fetchAboutUs = async () => {
    try {
      const response = await api.get(`/aboutUs?shop_id=${shopId}`);
      // Assuming response.data is an object, not an array
      const aboutUsData = response.data;
      setAboutUs(aboutUsData || {});
      setEditingAboutUsId(aboutUsData.id);
      // Initialize the location state from fetched data
      setLocation({
        latitude: aboutUsData.latitude || null,
        longitude: aboutUsData.longitude || null,
      });
      // console.log("AboutUs fetched:", aboutUsData);
    } catch (err) {
      console.error("Error fetching AboutUs:", err);
      alert("Error fetching About Us data");
    }
  };

  useEffect(() => {
    if (shopId) fetchAboutUs();
  }, [shopId]);

  // Handle the update action
  const handleAboutUsUpdate = async () => {
    if (!aboutUs.description) {
      alert("Please enter a description to update.");
      return;
    }

    try {
      // Construct update data: send address, description, and the selected location
      const updateData = {
        address: aboutUs.address,
        description: aboutUs.description,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      await api.patch(`/aboutUs/${editingAboutUsId}`, updateData);
      alert("About Us updated successfully");
      // Optionally, refetch the data to update the UI and close the map
      fetchAboutUs();
      setShowMap(false);
    } catch (err) {
      console.error("Error updating AboutUs:", err);
      alert("Error updating About Us");
    }
  };

  return (
    <div>
      <h2>Update About Us</h2>
      <div>
        <label>
          Address:
          <input
            type="text"
            value={aboutUs.address || ""}
            onChange={(e) =>
              setAboutUs({ ...aboutUs, address: e.target.value })
            }
            placeholder="Enter address"
          />
        </label>
      </div>
      <br />
      <div>
        <label>
          Description:
          <textarea
            value={aboutUs.description || ""}
            onChange={(e) =>
              setAboutUs({ ...aboutUs, description: e.target.value })
            }
            placeholder="Enter new About Us content..."
            rows="6"
            cols="60"
          />
        </label>
      </div>
      <div>
        <button onClick={() => setShowMap(!showMap)}>
          {showMap ? "Close Map" : "Select Location on Map"}
        </button>
      </div>
      {showMap && (
        <div style={{ height: "400px", width: "100%", marginTop: "10px" }}>
          <MapContainer
            center={
              location.latitude && location.longitude
                ? [location.latitude, location.longitude]
                : [0, 0]
            }
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationSelector location={location} setLocation={setLocation} />
          </MapContainer>
        </div>
      )}
      <br />
      <button onClick={handleAboutUsUpdate}>Update</button>
    </div>
  );
};

export default AboutUsUpdate;
