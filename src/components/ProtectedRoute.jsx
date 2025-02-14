import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated =
    localStorage.getItem("isAdminAuthenticated") === "true";

  return isAuthenticated ? element : <Navigate to="/admin-login" />;
};

export default ProtectedRoute;
