import { Navigate } from "react-router-dom";
import { useVendorAuth } from "../context/vendorAuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useVendorAuth();

  return token ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
