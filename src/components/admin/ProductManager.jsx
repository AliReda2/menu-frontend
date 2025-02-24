import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Stack,
  InputLabel,
  FormControl,
} from "@mui/material";
import api from "../../services/api";

const ProductManager = ({ shopId, categories }) => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/menu?shop_id=${shopId}`);
      setProducts(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) fetchProducts();
  }, [shopId]);

  const handleAddOrUpdateProduct = async () => {
    if (!productName.trim() || !productCategory) {
      setError("Product name and category are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", productName);
      formData.append("description", productDescription);
      formData.append("price", productPrice);
      formData.append("category_id", productCategory);
      formData.append("shop_id", shopId);
      if (productImage) formData.append("image", productImage);

      if (editingProductId) {
        await api.patch(`/menu/${editingProductId}`, formData);
        alert("Product updated successfully");
      } else {
        await api.post("/menu", formData);
        alert("Product added successfully");
      }

      setEditingProductId(null);
      setProductName("");
      setProductDescription("");
      setProductPrice("");
      setProductCategory("");
      setProductImage(null);
      setError("");
      fetchProducts();
    } catch (err) {
      console.error("Error saving product:", err);
      setError("Error saving product.");
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/menu/${id}`);
      alert("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Error deleting product.");
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
    <Container
      sx={{
        paddingLeft: 0,
        paddingRight: 0,
        "& .MuiContainer-root": {
          paddingLeft: 0,
          paddingRight: 0,
        },
        "@media (min-width:600px)": {
          paddingLeft: 0,
          paddingRight: 0,
        },
      }}
    >
      {" "}
      <Card sx={{ mt: 3, p: 3 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {editingProductId ? "Edit Product" : "Add Product"}
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {loading && <CircularProgress />}

          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Select Category</InputLabel>
              <Select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
              >
                <MenuItem value="">Select Category</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Product Name"
              variant="outlined"
              fullWidth
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />

            <TextField
              label="Description"
              variant="outlined"
              fullWidth
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />

            <TextField
              label="Price"
              type="number"
              variant="outlined"
              fullWidth
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />

            <Button variant="contained" component="label">
              Upload Product Image
              <input
                type="file"
                hidden
                onChange={(e) => setProductImage(e.target.files[0])}
              />
            </Button>

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddOrUpdateProduct}
              >
                {editingProductId ? "Update Product" : "Add Product"}
              </Button>
              {editingProductId && (
                <Button
                  variant="outlined"
                  color="secondary"
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
                </Button>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Typography variant="h6" sx={{ mt: 4 }}>
        Products
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod) => (
              <TableRow key={prod.id}>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{prod.description}</TableCell>
                <TableCell>${prod.price}</TableCell>
                <TableCell>{prod.category_name}</TableCell>
                <TableCell>
                  {prod.image ? (
                    <img
                      src={prod.image}
                      alt={prod.name}
                      style={{ width: 50, borderRadius: "8px" }}
                    />
                  ) : (
                    "No image"
                  )}
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEditProduct(prod)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteProduct(prod.id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default ProductManager;
