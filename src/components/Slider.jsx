import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../style/Slider.css";

const Slider = ({ shopId }) => {
  const [shop, setShop] = useState("");

  useEffect(() => {
    if (!shopId) {
      console.log("shopId is not set yet. Skipping API call.");
      return;
    }
    const fetchShop = async () => {
      try {
        // Fetch shop data using the shopId passed in props
        const response = await api.get(`/shops/${shopId}`);
        setShop(response.data.shop);
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };

    if (shopId) {
      fetchShop();
    }
  }, [shopId]);

  return (
    <div
      className="slider"
      style={{
        "--background-image": `url(https://menu-backend-rnpu.onrender.com/${shop.image})`,
      }}
    >
      <div className="slide">
        <h1>Welcome to {shop.name}</h1>
        <p>{shop.description}</p>
      </div>
    </div>
  );
};

export default Slider;
