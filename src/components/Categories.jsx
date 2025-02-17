import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../style/Categories.css";

const Categories = ({ onCategoryClick,  shopId  }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(`/categories?shop_id=${shopId}`); // Use dynamic shopId
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="categories">
      <div className="category-box" onClick={() => onCategoryClick(null)}>
        <span style={{ color: "black", fontSize: "x-Large" }}>
          All Categories
        </span>
      </div>
      {categories.map((category) => (
        <div
          key={category.id}
          className="category-box"
          onClick={() => onCategoryClick(category.id)}
        >
          <img
            src={`https://menu-backend-rnpu.onrender.com/${category.image}`}
            alt={category.name}
            width="50"
          />
          <span>{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Categories;
