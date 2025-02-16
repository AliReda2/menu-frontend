import React, { useEffect, useState } from "react";
import { useGlobalState } from "../context/GlobalState"; // ✅ Import global state
import CategoryManager from "../components/admin/CategoryManager";
import ProductManager from "../components/admin/ProductManager";
import AddOnManager from "../components/admin/AddOnManager";
import AboutUsUpdate from "../components/admin/AboutUsUpdate";
import api from "../services/api";
import "../style/AdminDashboard.css";

const AdminDashboard = () => {
  const { shopId } = useGlobalState(); // ✅ Use global state
  const [error, setError] = useState("");

  // Fetch shop details and pass them down to ShopUpdate
  const fetchShop = async () => {
    try {
      console.log("Fetching shop data for shopId:", shopId); // Debugging
      const response = await api.get(`/shops/${shopId}`);
      const shop = response.data.shop;
      setShopData({
        name: shop.name || "",
        description: shop.description || "",
      });
      setError("");
    } catch (err) {
      console.error("Error fetching shop:", err);
      setError("Failed to load shop.");
    }
  };

  useEffect(() => {
    if (!shopId) {
      setError("Shop ID is missing.");
      return;
    }
    fetchShop();
  }, [shopId]);

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <CategoryManager shopId={shopId} />
      <ProductManager shopId={shopId} />
      <AddOnManager shopId={shopId} />
      <AboutUsUpdate shopId={shopId} />
    </div>
  );
};

export default AdminDashboard;
