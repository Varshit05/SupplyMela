import { createContext, useContext, useEffect, useState } from "react";

const VendorAuthContext = createContext();

export const VendorAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("vendor_token"));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("vendor_refresh_token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser(payload);
      } catch (err) {
        logout();
      }
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (jwt, refresh) => {
    localStorage.setItem("vendor_token", jwt);
    if (refresh) localStorage.setItem("vendor_refresh_token", refresh);
    setToken(jwt);
    if (refresh) setRefreshToken(refresh);
  };

  const logout = () => {
    localStorage.removeItem("vendor_token");
    localStorage.removeItem("vendor_refresh_token");
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <VendorAuthContext.Provider value={{ token, refreshToken, user, login, logout }}>
      {children}
    </VendorAuthContext.Provider>
  );
};

export const useVendorAuth = () => useContext(VendorAuthContext);
