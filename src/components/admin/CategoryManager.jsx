// src/components/CategoryManager.js
import React, { useState, useEffect } from "react";
import api from "../../services/api";

const CategoryManager = ({ shopId }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  const fetchCategories = async () => {
    try {
      const response = await api.get(`/categories?shop_id=${shopId}`);
      setCategories(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
    }
  };

  useEffect(() => {
    if (shopId) fetchCategories();
  }, [shopId]);

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", categoryName.trim());
      formData.append("shop_id", shopId);
      if (categoryImage) formData.append("image", categoryImage);

      await api.post("/categories", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Category added successfully");
      setCategoryName("");
      setCategoryImage(null);
      setError("");
      fetchCategories();
    } catch (err) {
      console.error("Error adding category:", err);
      setError(err.response?.data?.message || "Error adding category");
    }
  };

  const handleUpdateCategory = async () => {
    if (!categoryName.trim()) {
      setError("Category name is required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", categoryName.trim());
      if (categoryImage) formData.append("image", categoryImage);

      await api.patch(`/categories/${editingCategoryId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Category updated successfully");
      setEditingCategoryId(null);
      setCategoryName("");
      setCategoryImage(null);
      setError("");
      fetchCategories();
    } catch (err) {
      console.error("Error updating category:", err);
      setError(err.response?.data?.message || "Error updating category");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      alert("Category deleted successfully");
      fetchCategories();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError(err.response?.data?.message || "Error deleting category");
    }
  };

  const handleEditCategory = (cat) => {
    setEditingCategoryId(cat.id);
    setCategoryName(cat.name);
  };

  return (
    <div>
      <h3>{editingCategoryId ? "Edit Category" : "Add Category"}</h3>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="text"
        placeholder="Category Name"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setCategoryImage(e.target.files[0])}
      />
      {editingCategoryId ? (
        <div>
          <button onClick={handleUpdateCategory}>Update Category</button>
          <button
            onClick={() => {
              setEditingCategoryId(null);
              setCategoryName("");
              setCategoryImage(null);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={handleAddCategory}>Add Category</button>
      )}

      <h3>Categories</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.name}</td>
              <td>
                {cat.image ? (
                  <img
                    src={`http://localhost:5000/${cat.image}`}
                    alt={cat.name}
                    width="50"
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td>
                <button onClick={() => handleEditCategory(cat)}>Edit</button>
                <button onClick={() => handleDeleteCategory(cat.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryManager;
