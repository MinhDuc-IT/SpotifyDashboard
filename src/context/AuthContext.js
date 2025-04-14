import { createContext, useState } from "react";
import { auth } from "../firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  const login = (userData, userRole) => {
    console.log("User data:", userData);
    console.log("User role:", userRole);
    setUser(userData);
    setRole(userRole);
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
