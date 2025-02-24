import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../../services/api";

// Custom Leaflet marker
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

const LocationSelector = ({ location, setLocation }) => {
  useMapEvents({
    click(e) {
      setLocation({ latitude: e.latlng.lat, longitude: e.latlng.lng });
    },
  });

  return location.latitude != null && location.longitude != null ? (
    <Marker
      position={[location.latitude, location.longitude]}
      icon={customIcon}
    />
  ) : null;
};

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
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAboutUs = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/aboutUs?shop_id=${shopId}`);
      const aboutUsData = response.data;
      setAboutUs(aboutUsData || {});
      setEditingAboutUsId(aboutUsData.id);
      setLocation({
        latitude: aboutUsData.latitude || null,
        longitude: aboutUsData.longitude || null,
      });
      setError("");
    } catch (err) {
      console.error("Error fetching About Us:", err);
      setError("Failed to load About Us data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) fetchAboutUs();
  }, [shopId]);

  const handleAboutUsUpdate = async () => {
    if (!aboutUs.description.trim()) {
      setError("Description is required.");
      return;
    }

    try {
      const updateData = {
        address: aboutUs.address,
        description: aboutUs.description,
        latitude: location.latitude,
        longitude: location.longitude,
      };

      await api.patch(`/aboutUs/${editingAboutUsId}`, updateData);
      alert("About Us updated successfully");
      fetchAboutUs();
    } catch (err) {
      console.error("Error updating About Us:", err);
      setError("Error updating About Us.");
    }
  };

  const mapCenter =
    location.latitude != null && location.longitude != null
      ? [location.latitude, location.longitude]
      : [0, 0];

  return (
    <Container
      sx={{
        paddingLeft: 0,
        paddingRight: 0,
        "& .MuiContainer-root": {
          paddingLeft: 0,
          paddingRight: 0,
        },
        "@media (min-width:600px)": {
          paddingLeft: 0,
          paddingRight: 0,
        },
      }}
    >      <Card sx={{ mt: 3, p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Update About Us
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {loading && <CircularProgress sx={{ my: 2 }} />}

          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Address"
              variant="outlined"
              fullWidth
              value={aboutUs.address || ""}
              onChange={(e) =>
                setAboutUs({ ...aboutUs, address: e.target.value })
              }
              placeholder="Enter address"
            />

            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={aboutUs.description || ""}
              onChange={(e) =>
                setAboutUs({ ...aboutUs, description: e.target.value })
              }
              placeholder="Enter new About Us content..."
            />
          </Stack>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Select Location
          </Typography>
          <Box sx={{ height: 400, width: "100%", mt: 2 }}>
            <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <RecenterMap coords={mapCenter} />
              <LocationSelector location={location} setLocation={setLocation} />
            </MapContainer>
          </Box>

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleAboutUsUpdate}
          >
            Update
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
};

export default AboutUsUpdate;
