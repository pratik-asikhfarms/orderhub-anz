import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AdminAuthContext = createContext(null);

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("adminUser");

    if (storedToken && storedAdmin) {
      setToken(storedToken);
      setAdmin(JSON.parse(storedAdmin));
    }

    setIsLoading(false);
  }, []);

  const login = ({ token, admin }) => {
    setToken(token);
    setAdmin(admin);

    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(admin));
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  };

  const value = useMemo(
    () => ({
      admin,
      token,
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
    }),
    [admin, token, isLoading]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }

  return context;
};