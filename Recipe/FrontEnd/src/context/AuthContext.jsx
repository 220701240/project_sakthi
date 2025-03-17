import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);
const API_BASE_URL = "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [recipes, setRecipes] = useState([]); // ✅ Store recipes
  const [favorites, setFavorites] = useState([]); // ✅ Store favorites

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      fetchRecipes(); // ✅ Fetch recipes when app starts
      fetchFavorites(); // ✅ Fetch favorites when app starts
    }
  }, []);

  // ✅ Fetch all recipes from the backend
  const fetchRecipes = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    }
  };

  // ✅ Fetch user favorites from backend
  const fetchFavorites = async () => {
    if (!user || !token) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/favorites/${user.email}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(response.data || []); // ✅ Ensure favorites is always an array
    } catch (error) {
      console.error("Failed to fetch favorites:", error);
      setFavorites([]); // ✅ Prevent crash if fetch fails
    }
  };

  // ✅ Add recipe to favorites
  const saveToFavorites = async (recipe) => {
    if (!user || !token) {
      alert("Please log in to add favorites!");
      return;
    }
    try {
      await axios.post(
        `${API_BASE_URL}/favorites/add/${recipe._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchFavorites(); // ✅ Refresh favorites after adding
      alert("Recipe added to favorites successfully!");
    } catch (error) {
      console.error("Failed to save to favorites:", error);
    }
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  
    // Redirect to home after logout
    window.location.href = "/"; // ✅ Redirects user to home page
  };
  
  // ✅ Remove recipe from favorites
  const removeFromFavorites = async (recipeId) => {
    if (!user || !token) return;
    try {
      await axios.delete(`${API_BASE_URL}/favorites/remove/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFavorites(); // ✅ Refresh favorites after removal
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        recipes,
        fetchRecipes, // ✅ Expose fetchRecipes
        favorites,
        fetchFavorites, // ✅ Expose fetchFavorites
        saveToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
