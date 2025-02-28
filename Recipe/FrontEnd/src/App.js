import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import NavigationBar from "./components/Navbar";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AddRecipePage from "./pages/AddRecipePage";
import RecipeList from "./pages/RecipeList";
import FavoritesPage from "./pages/FavoritesPage";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Fetch recipes from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/recipes") // Update with your backend URL
      .then((response) => setRecipes(response.data))
      .catch((error) => console.error("Error fetching recipes:", error));
  }, []);

  // Fetch user's favorites from backend
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/favorites/${user.username}`)
        .then((response) => setFavorites(response.data))
        .catch((error) => console.error("Error fetching favorites:", error));
    }
  }, [user]);

  // Function to add a recipe to backend
  const addRecipe = (newRecipe) => {
    axios
      .post("http://localhost:5000/api/recipes/add", newRecipe)
      .then((response) => {
        setRecipes([...recipes, response.data]);
      })
      .catch((error) => console.error("Error adding recipe:", error));
  };

  // Function to save a recipe to favorites in backend
  const saveToFavorites = (recipe) => {
    if (!favorites.some((fav) => fav.id === recipe.id)) {
      axios
        .post(`http://localhost:5000/api/favorites/${user.username}`, recipe)
        .then(() => setFavorites([...favorites, recipe]))
        .catch((error) => console.error("Error adding favorite:", error));
    }
  };

  return (
    <AuthProvider>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/recipe/:id" element={<RecipeDetails />} /> */}
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/recipes" element={<RecipeList recipes={recipes} saveToFavorites={saveToFavorites} />} />
        <Route path="/add-recipe" element={<ProtectedRoute><AddRecipePage addRecipe={addRecipe} /></ProtectedRoute>} />
        <Route path="/favorites" element={<ProtectedRoute><FavoritesPage favorites={favorites} /></ProtectedRoute>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
