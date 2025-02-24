import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import api from "../../services/api";

const ShopUpdate = ({ shopId, shop }) => {
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const [originalName, setOriginalName] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");
  const [originalImage, setOriginalImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!shop) {
      setError("Failed to load shop data.");
      return;
    }

    setLoading(true);
    setShopName(shop.name || "");
    setShopDescription(shop.description || "");
    setOriginalName(shop.name || "");
    setOriginalDescription(shop.description || "");
    setOriginalImage(shop.image || null);
    setLoading(false);
  }, [shop]);

  const handleUpdateShop = async () => {
    const formData = new FormData();
    let hasUpdates = false;

    if (shopName.trim() && shopName !== originalName) {
      formData.append("name", shopName.trim());
      hasUpdates = true;
    }
    if (shopDescription.trim() && shopDescription !== originalDescription) {
      formData.append("description", shopDescription.trim());
      hasUpdates = true;
    }
    if (shopImage && shopImage instanceof File) {
      formData.append("image", shopImage);
      hasUpdates = true;
    }

    if (!hasUpdates) {
      setError("No changes detected.");
      return;
    }

    try {
      await api.patch(`/shops/${shopId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Shop updated successfully");
      setError("");
    } catch (err) {
      console.error("Error updating shop:", err);
      setError(err.response?.data?.error || "Error updating shop.");
    }
  };

  return (
    <Container minWidth="sm">
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Update Shop
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {loading && <CircularProgress />}

          <Stack spacing={2}>
            <TextField
              label="Shop Name"
              variant="outlined"
              fullWidth
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />

            <TextField
              label="Shop Description"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={shopDescription}
              onChange={(e) => setShopDescription(e.target.value)}
            />

            <Button variant="contained" component="label">
              Upload Shop Image
              <input
                type="file"
                hidden
                onChange={(e) => setShopImage(e.target.files[0])}
              />
            </Button>

            {originalImage && (
              <img
                src={
                  shopImage instanceof File
                    ? URL.createObjectURL(shopImage)
                    : originalImage
                }
                alt="Shop"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            )}

            <Button
              variant="contained"
              color="primary"
              onClick={handleUpdateShop}
            >
              Update Shop
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ShopUpdate;
