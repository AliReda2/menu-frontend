import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryManager from "../components/admin/CategoryManager";
import ProductManager from "../components/admin/ProductManager";
import AddOnManager from "../components/admin/AddOnManager";
import AboutUsUpdate from "../components/admin/AboutUsUpdate";
import ShopUpdate from "../components/admin/ShopUpdate";
import api from "../services/api";
import "../style/AdminDashboard.css";

const AdminDashboard = () => {
  const shopId = localStorage.getItem("shop_id");
  const isAdminAuthenticated = localStorage.getItem("isAdminAuthenticated");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [shopData, setShopData] = useState({ name: "", description: "" });

  useEffect(() => {
    // Early return if not authenticated
    if (!shopId || !isAdminAuthenticated) {
      setError("Not authenticated. Please login.");
      navigate("/admin-login"); // Redirect to login
      return;
    }

    // Fetch shop data
    const fetchShop = async () => {
      try {
        // console.log("Fetching shop data for shopId:", shopId);
        const response = await api.get(`/shops/${shopId}`);
        const shop = response.data;
        setShopData({
          name: shop.name || "",
          description: shop.description || "",
        });
        setError(""); // Reset error state if the shop is fetched successfully
      } catch (err) {
        console.error("Error fetching shop:", err);
        setError(err.response?.data?.error || "Failed to load shop.");
      }
    };

    fetchShop();
  }, [shopId, isAdminAuthenticated, navigate]); // Add isAdminAuthenticated as dependency

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h2>{shopData.name}</h2>
      <p>{shopData.description}</p>
      <ShopUpdate shopId={shopId} />
      <CategoryManager shopId={shopId} />
      <ProductManager shopId={shopId} />
      <AddOnManager shopId={shopId} />
      <AboutUsUpdate shopId={shopId} />
    </div>
  );
};

export default AdminDashboard;
