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

  // Fetch shop data
  // const fetchShopData = async () => {
  // try {
  useEffect(() => {
    if (!shop) {
      console.error("Error fetching shop:", err);
      setError("Failed to load shop data.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setShopName(shop.name || "");
    setShopDescription(shop.description || "");
    setOriginalName(shop.name || "");
    setOriginalDescription(shop.description || "");
    setShopImage(null);
    setOriginalImage(shop.image || null);
    setLoading(false);
  },[shop]);
  // const response = await api.get(`/shops/${shopId}`);
  // const shop = response.data;
  // } catch (err) {
  // }
  // };

  // useEffect(() => {
  //   if (shopId) {
  //     fetchShopData();
  //   }
  // }, [shopId]);

  // Handle shop update
  const handleUpdateShop = async () => {
    const formData = new FormData();
    let hasUpdates = false;

    // Only append fields if they have changed
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
      fetchShopData(); // Refresh shop data
    } catch (err) {
      console.error("Error updating shop:", err);
      setError(err.response?.data?.error || "Error updating shop.");
    }
  };

  return (
    <div>
      <h3>Update Shop</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

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
        <input type="file" onChange={(e) => setShopImage(e.target.files[0])} />
      </div>

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
  );
};

export default ShopUpdate;
