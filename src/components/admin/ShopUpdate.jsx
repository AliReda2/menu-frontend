import React, { useState, useEffect } from "react";
import api from "../../services/api";

const ShopUpdate = ({ shopId }) => {
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const [shopImage, setShopImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null); // Store the original image URL
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch the shop data when the component mounts
  const fetchShopData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/shops/${shopId}`);
      const shop = response.data;
      setShopName(shop.name || "");
      setShopDescription(shop.description || "");
      setShopImage(shop.image || null);
      setOriginalImage(shop.image || null); // Store the original image URL
      setLoading(false);
    } catch (err) {
      console.error("Error fetching shop:", err);
      setError("Failed to load shop data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) {
      fetchShopData(); // Fetch shop data based on the shopId prop
    }
  }, [shopId]);

  // Handle the update of the shop
  const handleUpdateShop = async () => {
    if (!shopName.trim() && !shopDescription.trim() && !shopImage) {
      setError(
        "At least one field (name, description, or image) must be provided."
      );
      return;
    }

    try {
      const formData = new FormData();

      // Only append fields that have changed
      if (
        shopName.trim() !== "" &&
        shopName !== (originalImage ? shopName : "")
      ) {
        formData.append("name", shopName.trim());
      }
      if (
        shopDescription.trim() !== "" &&
        shopDescription !== (originalImage ? shopDescription : "")
      ) {
        formData.append("description", shopDescription.trim());
      }
      if (shopImage && shopImage !== originalImage) {
        formData.append("image", shopImage); // Only append image if it's updated
      }

      await api.patch(`/shops/${shopId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Shop updated successfully");
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error updating shop:", err);
      setError(err.response?.data?.message || "Error updating shop.");
    }
  };

  return (
    <div>
      <h3>Update Shop</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      {/* Shop name and description input fields */}
      <div>
        <label>Shop Name</label>
        <input
          type="text"
          value={shopName}
          onChange={(e) => setShopName(e.target.value)}
          placeholder="Shop Name"
        />
      </div>

      <div>
        <label>Shop Description</label>
        <textarea
          value={shopDescription}
          onChange={(e) => setShopDescription(e.target.value)}
          placeholder="Shop Description"
        />
      </div>

      <div>
        <label>Shop Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setShopImage(e.target.files[0])}
        />
      </div>

      <button onClick={handleUpdateShop}>Update Shop</button>

      <h3>Current Shop Image</h3>
      {shopImage || originalImage ? (
        <img
          src={
            shopImage
              ? URL.createObjectURL(shopImage)
              : `https://menu-backend-rnpu.onrender.com/${originalImage}`
          }
          alt="Shop Image"
          width="100"
        />
      ) : (
        <p>No image available</p>
      )}
    </div>
  );
};

export default ShopUpdate;
