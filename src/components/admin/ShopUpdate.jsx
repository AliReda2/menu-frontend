// src/components/ShopUpdate.js
import React, { useState, useEffect } from "react";
import api from "../../services/api";

const ShopUpdate = ({ shopId, shopData, onShopUpdate }) => {
  const [shopName, setShopName] = useState(shopData.name);
  const [shopDescription, setShopDescription] = useState(shopData.description);
  const [shopImage, setShopImage] = useState(null);
  const [error, setError] = useState("");

  // Update local state when shopData changes
  useEffect(() => {
    setShopName(shopData.name);
    setShopDescription(shopData.description);
  }, [shopData]);

  const handleUpdateShop = async () => {
    try {
      const formData = new FormData();
      if (shopName.trim()) formData.append("name", shopName.trim());
      if (shopDescription.trim())
        formData.append("description", shopDescription.trim());
      if (shopImage) formData.append("image", shopImage);

      if (
        !formData.has("name") &&
        !formData.has("description") &&
        !formData.has("image")
      ) {
        setError("Please provide at least one field to update.");
        return;
      }

      await api.patch(`/shops/${shopId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Shop updated successfully");
      onShopUpdate(); // Refresh shop data in parent
      setError("");
    } catch (err) {
      console.error("Error updating shop:", err);
      setError(err.response?.data?.message || "Error updating shop");
    }
  };

  return (
    <div>
      <h3>Update Shop</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Shop Name"
        value={shopName}
        onChange={(e) => setShopName(e.target.value)}
      />
      <br />
      <br />
      <textarea
        placeholder="Shop Description"
        value={shopDescription}
        onChange={(e) => setShopDescription(e.target.value)}
      />
      <br />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setShopImage(e.target.files[0])}
      />
      <br />
      <button onClick={handleUpdateShop}>Update Shop</button>
    </div>
  );
};

export default ShopUpdate;
