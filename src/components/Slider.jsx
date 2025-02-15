import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams
import api from "../services/api";
import "../style/Slider.css";

const Slider = () => {
  const { shopId } = useParams(); // Get shopId from the URL

  const [shop, setShop] = useState("");

  useEffect(() => {
    const fetchShop = async () => {
      try {
        // Use the shopId dynamically from the URL
        const response = await api.get(`/shops/${shopId}`);
        setShop(response.data.shop);
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };

    // Only fetch if shopId is available (i.e., the component is loaded with the shopId)
    if (shopId) {
      fetchShop();
    }
  }, [shopId]); // Ensure useEffect re-runs when shopId changes

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
