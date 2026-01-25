import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children, role }) => {
  const storageKey = role === "admin" ? "admin_token" : "vendor_token";

  const [token, setToken] = useState(localStorage.getItem(storageKey));
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
    localStorage.setItem(storageKey, jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => useContext(AuthContext);
