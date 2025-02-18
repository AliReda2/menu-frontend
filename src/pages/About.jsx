import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../services/api";
import "../style/AboutUs.css";
import { useGlobalState } from "../context/GlobalState";

// Custom Leaflet Marker Icon
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

const AboutUs = () => {
  const [data, setData] = useState("");
  const { shopId } = useGlobalState();
  // console.log("AboutUs shopId:", shopId);

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const response = await api.get(`/aboutUs?shop_id=${shopId}`);

        // Ensure valid latitude and longitude exist before updating state
        if (response.data.latitude && response.data.longitude) {
          setData(response.data);
        } else {
          console.warn("Invalid coordinates received from API");
        }
      } catch (error) {
        console.error("Error fetching About Us data:", error);
      }
    };

    fetchAboutUs();
  }, []);

  return (
    <div className="about-us">
      <h2 className="about-us__title">
        {data.address || "Loading Address..."}
      </h2>
      <p className="about-us__description">
        {data.description || "Loading Description..."}
      </p>
      <div className="about-us__map-section">
        <h3 className="about-us__map-title">Find Us Here:</h3>
        {data.latitude && data.longitude ? (
          <MapContainer
            center={[data.latitude, data.longitude]}
            zoom={15}
            style={{ height: "400px", width: "100%", borderRadius: "8px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[data.latitude, data.longitude]}
              icon={customIcon}
            >
              <Popup>{data.address || "We are here!"}</Popup>
            </Marker>
          </MapContainer>
        ) : (
          <p>Loading map...</p>
        )}
      </div>
    </div>
  );
};

export default AboutUs;
