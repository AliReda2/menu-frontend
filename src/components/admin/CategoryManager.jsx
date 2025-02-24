import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
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
} from "@mui/material";
import api from "../../services/api";

const CategoryManager = ({ shopId }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/categories?shop_id=${shopId}`);
      setCategories(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
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

      await api.post("/categories", formData);
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
            {editingCategoryId ? "Edit Category" : "Add Category"}
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {loading && <CircularProgress />}

          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Category Name"
              variant="outlined"
              fullWidth
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />

            <Button variant="contained" component="label">
              Upload Category Image
              <input
                type="file"
                hidden
                onChange={(e) => setCategoryImage(e.target.files[0])}
              />
            </Button>

            {editingCategoryId ? (
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateCategory}
                >
                  Update Category
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setEditingCategoryId(null);
                    setCategoryName("");
                    setCategoryImage(null);
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddCategory}
              >
                Add Category
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>
      <Typography variant="h6" sx={{ mt: 4 }}>
        Categories
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell>
                  {cat.image ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{ width: 70, borderRadius: "8px" }}
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
                      onClick={() => handleEditCategory(cat)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteCategory(cat.id)}
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

export default CategoryManager;
