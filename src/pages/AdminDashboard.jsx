import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography } from "@mui/material";
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
  const [shop, setShop] = useState({});
  const [categories, setCategories] = useState([]);

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
        setShop(response.data);
        setCategories(response.data.categories);
        setShopData({
          name: response.data.name || "",
          description: response.data.description || "",
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
    <Container maxWidth="md">
      <br />
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Typography variant="h5">{shopData.name}</Typography>
      <Typography>{shopData.description}</Typography>
      <br />
      <ShopUpdate shopId={shopId} shop={shop} />
      <CategoryManager shopId={shopId} />
      <ProductManager shopId={shopId} categories={categories} />
      <AddOnManager shopId={shopId} />
      <AboutUsUpdate shopId={shopId} />
    </Container>
  );
};

export default AdminDashboard;
