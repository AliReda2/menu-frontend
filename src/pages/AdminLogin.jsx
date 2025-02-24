import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
} from "@mui/material";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/users/login", {
        name: username,
        password: password,
      });

      if (response.data.success) {
        const { shop_id } = response.data.user || {};

        if (shop_id) {
          localStorage.setItem("isAdminAuthenticated", "true");
          navigate("/admin");
        } else {
          setErrorMessage("Invalid response. Please contact support.");
        }
      } else {
        setErrorMessage("Invalid username or password.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.error || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 6, textAlign: "center" }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Admin Login
        </Typography>

        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminLogin;
