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

const AddOnManager = ({ shopId }) => {
  const [addOnName, setAddOnName] = useState("");
  const [addOnPrice, setAddOnPrice] = useState("");
  const [addOns, setAddOns] = useState([]);
  const [editingAddOnId, setEditingAddOnId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAddOns = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/addOns?shop_id=${shopId}`);
      setAddOns(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching addOns:", err);
      setError("Failed to load AddOns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (shopId) fetchAddOns();
  }, [shopId]);

  const handleSaveAddOn = async () => {
    if (!addOnName.trim()) {
      setError("AddOn name is required.");
      return;
    }

    try {
      const addOnData = {
        name: addOnName,
        price: parseFloat(addOnPrice) || 0,
        shop_id: shopId,
      };

      if (editingAddOnId) {
        await api.patch(`/addOns/${editingAddOnId}`, addOnData);
        alert("AddOn updated successfully");
      } else {
        await api.post("/addOns", addOnData);
        alert("AddOn added successfully");
      }

      setEditingAddOnId(null);
      setAddOnName("");
      setAddOnPrice("");
      setError("");
      fetchAddOns();
    } catch (err) {
      console.error("Error saving AddOn:", err);
      setError("Error saving AddOn.");
    }
  };

  const handleDeleteAddOn = async (id) => {
    try {
      await api.delete(`/addOns/${id}`);
      alert("AddOn deleted successfully");
      fetchAddOns();
    } catch (err) {
      console.error("Error deleting AddOn:", err);
      setError("Error deleting AddOn.");
    }
  };

  const handleEditAddOn = (addOn) => {
    setEditingAddOnId(addOn.id);
    setAddOnName(addOn.name);
    setAddOnPrice(addOn.price);
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
            {editingAddOnId ? "Edit AddOn" : "Add AddOn"}
          </Typography>

          {error && <Alert severity="error">{error}</Alert>}
          {loading && <CircularProgress sx={{ my: 2 }} />}

          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="AddOn Name"
              variant="outlined"
              fullWidth
              value={addOnName}
              onChange={(e) => setAddOnName(e.target.value)}
            />

            <TextField
              label="Price"
              type="number"
              variant="outlined"
              fullWidth
              value={addOnPrice}
              onChange={(e) => setAddOnPrice(e.target.value)}
            />

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSaveAddOn}
              >
                {editingAddOnId ? "Update AddOn" : "Add AddOn"}
              </Button>
              {editingAddOnId && (
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => {
                    setEditingAddOnId(null);
                    setAddOnName("");
                    setAddOnPrice("");
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
        AddOns
      </Typography>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {addOns.map((addOn) => (
              <TableRow key={addOn.id}>
                <TableCell>{addOn.name}</TableCell>
                <TableCell>${addOn.price}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleEditAddOn(addOn)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => handleDeleteAddOn(addOn.id)}
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

export default AddOnManager;
