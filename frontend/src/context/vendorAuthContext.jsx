import { createContext, useContext, useEffect, useState } from "react";

const VendorAuthContext = createContext();

export const VendorAuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("vendor_token"));
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } else {
      setUser(null);
    }
  }, [token]);

  const login = (jwt) => {
    localStorage.setItem("vendor_token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("vendor_token");
    setToken(null);
    setUser(null);
  };

  return (
    <VendorAuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </VendorAuthContext.Provider>
  );
};

export const useVendorAuth = () => useContext(VendorAuthContext);
