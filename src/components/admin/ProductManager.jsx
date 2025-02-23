// src/components/ProductManager.js
import { useState, useEffect } from "react";
import api from "../../services/api";

const ProductManager = ({ shopId, categories }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  // const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  // const fetchCategories = async () => {
  //   try {
  //     const response = await api.get(`/categories?shop_id=${shopId}`);
  //     setCategories(response.data);
  //   } catch (err) {
  //     console.error("Error fetching categories:", err);
  //   }
  // };

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/menu?shop_id=${shopId}`);
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    if (shopId) {
      // fetchCategories();
      fetchProducts();
    }
  }, [shopId]);

  const handleAddProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("price", productPrice);
      formData.append("category_id", productCategory);
      formData.append("shop_id", shopId);
      if (productImage) formData.append("image", productImage);

      await api.post("/menu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product added successfully");
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductCategory("");
      setProductImage(null);
      fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Error adding product");
    }
  };

  const handleUpdateProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("price", productPrice);
      formData.append("category_id", productCategory);
      if (productImage) formData.append("image", productImage);

      await api.patch(`/menu/${editingProductId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product updated successfully");
      setEditingProductId(null);
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductCategory("");
      setProductImage(null);
      fetchProducts();
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Error updating product");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/menu/${id}`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Error deleting product");
    }
  };

  const handleEditProduct = (prod) => {
    setEditingProductId(prod.id);
    setProductName(prod.name);
    setProductDescription(prod.description);
    setProductPrice(prod.price);
    setProductCategory(prod.category_id || "");
  };

  return (
    <div>
      <h3>{editingProductId ? "Edit Product" : "Add Product"}</h3>
      <select
        value={productCategory}
        onChange={(e) => setProductCategory(e.target.value)}
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Description"
        value={productDescription}
        onChange={(e) => setProductDescription(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={productPrice}
        onChange={(e) => setProductPrice(e.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setProductImage(e.target.files[0])}
      />
      {editingProductId ? (
        <div>
          <button onClick={handleUpdateProduct}>Update Product</button>
          <button
            onClick={() => {
              setEditingProductId(null);
              setProductName("");
              setProductDescription("");
              setProductPrice("");
              setProductCategory("");
              setProductImage(null);
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button onClick={handleAddProduct}>Add Product</button>
      )}

      <h3>Products</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((prod) => (
            <tr key={prod.id}>
              <td>{prod.name}</td>
              <td>{prod.description}</td>
              <td>{prod.price}</td>
              <td>{prod.category_name}</td>
              <td>
                {prod.image ? (
                  <img
                    src={prod.image}
                    alt={prod.name}
                    width="50"
                  />
                ) : (
                  "No image"
                )}
              </td>
              <td>
                <button onClick={() => handleEditProduct(prod)}>Edit</button>
                <button onClick={() => handleDeleteProduct(prod.id)}>
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

export default ProductManager;
