import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryManager from "../components/admin/CategoryManager";
import ProductManager from "../components/admin/ProductManager";
import AddOnManager from "../components/admin/AddOnManager";
import AboutUsUpdate from "../components/admin/AboutUsUpdate";
import api from "../services/api";
import "../style/AdminDashboard.css";

const AdminDashboard = () => {
  const shopId = localStorage.getItem("shop_id");
  const navigate = useNavigate();
  const [shopData, setShopData] = useState({ name: "", description: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!shopId) {
      setError("Shop ID is missing.");
      navigate("/admin/login"); // Redirect to login
      return;
    }

    const fetchShop = async () => {
      try {
        console.log("Fetching shop data for shopId:", shopId);
        const response = await api.get(`/shops/${shopId}`);
        const shop = response.data.shop;
        setShopData({
          name: shop.name || "",
          description: shop.description || "",
        });
        setError("");
      } catch (err) {
        console.error("Error fetching shop:", err);
        setError(err.response?.data?.error || "Failed to load shop.");
      }
    };

    fetchShop();
  }, [shopId, navigate]);

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
