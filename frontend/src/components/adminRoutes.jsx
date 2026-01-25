import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { token, user, loading } = useAdminAuth();

  if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
      <p>Checking admin access...</p>
    </div>
  );
}

  if (!token) return <Navigate to="/admin/login" replace />;

  if (user?.role !== "admin") return <Navigate to="/" replace />;

  return children;
};

export default AdminProtectedRoute;
