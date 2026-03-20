import { createContext, useContext, useEffect, useState } from "react";

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("admin_token"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("admin_refresh_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch (err) {
        console.error("Invalid admin token");
        logout();
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = (jwt, refresh) => {
    localStorage.setItem("admin_token", jwt);
    if (refresh) localStorage.setItem("admin_refresh_token", refresh);
    setToken(jwt);
    if (refresh) setRefreshToken(refresh);
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_refresh_token");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ token, refreshToken, user, loading, login, logout }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => useContext(AdminAuthContext);
