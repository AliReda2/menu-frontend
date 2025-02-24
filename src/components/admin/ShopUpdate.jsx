import { useState, useEffect } from "react";
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
    <div className="shopUpdate">
      <h3 className="header">Update Shop</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      <div className="shopName">
        <label>Shop Name</label>
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="Shop Name"
        />
      </div>

      <div className="shopImage">
        <label>Shop Image</label>
        <input type="file" onChange={(e) => setShopImage(e.target.files[0])} />
      </div>

      <div className="shopDescription">
        <label>Shop Description</label>
        <textarea
          value={shopDescription}
          onChange={(e) => setShopDescription(e.target.value)}
          placeholder="Shop Description"
        />
      </div>

      <div className="displayedImage">
        <button onClick={handleUpdateShop}>Update Shop</button>

        <h3>Current Shop Image</h3>
        {originalImage && (
          <img
            src={
              shopImage instanceof File
                ? URL.createObjectURL(shopImage)
                : originalImage
            }
            alt="Shop"
            width="100"
          />
        )}
      </div>
    </div>
  );
};

export default ShopUpdate;
