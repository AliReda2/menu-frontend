// src/components/Slider.js
import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../style/Slider.css";

const Slider = () => {
  const [shop, setShop] = useState("");

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await api.get("/shops/3");
        setShop(response.data.shop);
      } catch (error) {
        console.error("Error fetching shop:", error);
      }
    };
    fetchShop();
  }, []);

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
