import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const Favorites = () => {
  const { user, favorites, removeFromFavorites } = useAuth();
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    setFavoriteRecipes(favorites); // Ensure the local state updates
  }, [favorites]);

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center text-white"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}>
      <div className="container mt-4">
        <h2 style={{ color: "black", fontStyle: "italic" }}>My Favorite Recipes</h2>

        {favoriteRecipes.length === 0 ? (
          <p className="text-dark">No favorites yet!</p>
        ) : (
          favoriteRecipes.map((recipe) => (
            <div key={recipe._id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title" style={{ color: "black", fontStyle: "italic" }}>
                  <strong>Title:</strong> {recipe.title}
                </h5>
                <p><strong>Ingredients:</strong> {recipe.ingredients?.join(", ") || "No ingredients provided"}</p>
                <p><strong>Instructions:</strong> {recipe.instructions || "No instructions provided"}</p>
                <p><strong>Category:</strong> {recipe.category}</p>
                <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
                <p><strong>Meal Type:</strong> {recipe.mealType}</p>
                <p><strong>Time Required:</strong> {recipe.timeRequired}</p>

                {recipe.image && <img src={recipe.image} alt="Recipe" className="img-fluid rounded" style={{ maxWidth: "200px" }} />}
                
                <button className="btn btn-danger mt-2" onClick={() => removeFromFavorites(recipe._id)}>
                  Remove from Favorites
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Favorites;
