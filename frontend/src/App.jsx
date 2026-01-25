import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Profile from "./pages/profile";
import Documents from "./pages/documents";
import VendorList from "./pages/vendorList";
import VendorProducts from "./pages/vendorProducts";
import AddProduct from "./pages/addProduct";
import EditProduct from "./pages/editproduct";

import AdminLogin from "./admin/adminlogin";
import AdminDashboard from "./admin/dashboard";
import VendorDetails from "./admin/vendordetails";

import VendorLayout from "./layouts/vendorLayout";
import AdminLayout from "./layouts/adminLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/adminRoutes";

import { VendorAuthProvider } from "./context/vendorAuthContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AboutPage from "./pages/AboutPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" />

      <Routes>

        {/* ---------- VENDOR AUTH ---------- */}
        <Route
          path="/login"
          element={
            <VendorAuthProvider>
              <Login />
            </VendorAuthProvider>
          }
        />

        <Route
          path="/register"
          element={
            <VendorAuthProvider>
              <Register />
            </VendorAuthProvider>
          }
        />

        {/* ---------- VENDOR APP ---------- */}
        <Route
          path="/"
          element={
            <VendorAuthProvider>
              <VendorLayout />
            </VendorAuthProvider>
          }
        >
          <Route index element={<VendorList />} />

          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="documents"
            element={
              <ProtectedRoute>
                <Documents />
              </ProtectedRoute>
            }
          />

          <Route
            path="products"
            element={
              <ProtectedRoute>
                <VendorProducts />
              </ProtectedRoute>
            }
          />

          <Route
            path="products/add"
            element={
              <ProtectedRoute>
                <AddProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="products/edit/:id"
            element={
              <ProtectedRoute>
                <EditProduct />
              </ProtectedRoute>
            }
          />
          <Route path="about" element={<AboutPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="contact" element={<ContactUs />} />
        </Route>

        {/* ---------- ADMIN ---------- */}
        <Route
          path="/admin/login"
          element={
            <AdminAuthProvider>
              <AdminLogin />
            </AdminAuthProvider>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminAuthProvider>
              <AdminProtectedRoute>
                <AdminLayout />
              </AdminProtectedRoute>
            </AdminAuthProvider>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="vendors/:id" element={<VendorDetails />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default App;
