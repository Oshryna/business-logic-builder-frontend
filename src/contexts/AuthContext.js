// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is saved in local storage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  // Login function - In a real app, this would authenticate with a backend
  const login = async (email, password) => {
    try {
      // For demo purposes only
      // In a real app, make an API call to your auth backend
      const user = {
        id: "1",
        email,
        name: email.split("@")[0],
        role: "user",
        avatar:
          "https://ui-avatars.com/api/?name=" +
          encodeURIComponent(email.split("@")[0])
      };

      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error.message || "Login failed" };
    }
  };

  // Signup function
  const signup = async (name, email, password) => {
    try {
      // For demo purposes only
      // In a real app, make an API call to your auth backend
      const user = {
        id: "1",
        email,
        name,
        role: "user",
        avatar: "https://ui-avatars.com/api/?name=" + encodeURIComponent(name)
      };

      setCurrentUser(user);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(user));

      return { success: true, data: user };
    } catch (error) {
      return { success: false, error: error.message || "Signup failed" };
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  const value = {
    currentUser,
    isAuthenticated,
    login,
    signup,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
