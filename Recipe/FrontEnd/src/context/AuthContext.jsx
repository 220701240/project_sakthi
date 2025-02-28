import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";


// Create AuthContext
const AuthContext = createContext(null);

// Base URL of the backend API
const API_BASE_URL = "http://localhost:5000/api"; // Update this with your backend URL

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Fetch user data if logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      fetchRecipes();
      fetchFavorites();
    }
  }, []);

  // Login function (calls backend)
  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
  
      const data = response.data;
      setUser(data.user);  // ✅ Update user state
      setToken(data.token); // ✅ Update token state
  
      // ✅ Store user and token in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("token", data.token);
  
      return data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // Fetch recipes from the backend
  const fetchRecipes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
  
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Invalid JSON response from server");
      }
  
      const data = await response.json();
      setRecipes(data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };
  

  // Fetch user favorites from the backend
  const fetchFavorites = async () => {
    if (!user || !token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/${user.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setFavorites((prevFavorites) => ({
        ...prevFavorites,
        [user.email]: data,
      }));
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
    }
  };

  // Add a new recipe (sends data to backend)
  const addRecipe = async (newRecipe) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newRecipe),
      });

      if (response.ok) {
        fetchRecipes(); // Refresh recipes after adding
      }
    } catch (error) {
      console.error("Failed to add recipe:", error);
    }
  };

  // Save a recipe to favorites (sends data to backend)
  const saveToFavorites = async (recipe) => {
    if (!user || !token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: user.email, recipe }),
      });

      if (response.ok) {
        fetchFavorites(); // Refresh favorites after saving
      }
    } catch (error) {
      console.error("Failed to save to favorites:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, recipes, addRecipe, favorites, saveToFavorites }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
