import { useState, useEffect } from "react";
import api from "../../services/api";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Custom marker icon
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
  // Explicit check to ensure valid coordinates (0 is valid)
  return location.latitude != null && location.longitude != null ? (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={customIcon}
    />
  ) : null;
};

// Component to recenter the map and force it to recalc its size
const RecenterMap = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    map.setView(coords);
  }, [coords, map]);
  return null;
};

const AboutUsUpdate = ({ shopId }) => {
  const [aboutUs, setAboutUs] = useState({});
  const [editingAboutUsId, setEditingAboutUsId] = useState(null);
  const [showMap, setShowMap] = useState(false);
  // Location state for latitude/longitude; initialize as null
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  // Fetch the About Us data for the given shopId
  const fetchAboutUs = async () => {
    try {
      const response = await api.get(`/aboutUs?shop_id=${shopId}`);
      const aboutUsData = response.data;
      setAboutUs(aboutUsData || {});
      setEditingAboutUsId(aboutUsData.id);
      // Initialize the location state from fetched data
      setLocation({
        latitude: aboutUsData.latitude || null,
        longitude: aboutUsData.longitude || null,
      });
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
      {showMap &&
        (location.latitude != null && location.longitude != null ? (
          <div style={{ height: "400px", width: "100%", marginTop: "10px" }}>
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <RecenterMap coords={[location.latitude, location.longitude]} />
              <LocationSelector location={location} setLocation={setLocation} />
            </MapContainer>
          </div>
        ) : (
          <p>Loading map...</p>
        ))}
      <br />
      <button onClick={handleAboutUsUpdate}>Update</button>
    </div>
  );
};

export default AboutUsUpdate;
