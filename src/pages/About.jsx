import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../services/api";
import { useGlobalState } from "../context/GlobalState";
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Box,
} from "@mui/material";

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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { shopId } = useGlobalState();

  useEffect(() => {
    const fetchAboutUs = async () => {
      try {
        const response = await api.get(`/aboutUs?shop_id=${shopId}`);

        if (response.data.latitude && response.data.longitude) {
          setData(response.data);
        } else {
          setError("Invalid location data received.");
        }
      } catch (err) {
        console.error("Error fetching About Us data:", err);
        setError("Failed to load About Us information.");
      } finally {
        setLoading(false);
      }
    };

    fetchAboutUs();
  }, [shopId]);

  if (loading)
    return <CircularProgress sx={{ display: "block", margin: "20px auto" }} />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 3, my: 4, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          {data?.address || "Address Not Available"}
        </Typography>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {data?.description || "No description available."}
        </Typography>

        <Typography variant="h6" sx={{ mt: 3 }}>
          Find Us Here:
        </Typography>

        <Box
          sx={{
            height: 400,
            width: "100%",
            mt: 2,
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {data?.latitude && data?.longitude ? (
            <MapContainer
              center={[data.latitude, data.longitude]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker
                position={[data.latitude, data.longitude]}
                icon={customIcon}
              >
                <Popup>{data?.address || "We are here!"}</Popup>
              </Marker>
            </MapContainer>
          ) : (
            <Typography variant="body2" color="textSecondary">
              Map data unavailable.
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default AboutUs;
