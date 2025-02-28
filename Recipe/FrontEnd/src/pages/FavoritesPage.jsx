import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios"; // Import Axios for API calls

const Favorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  // Fetch favorites from backend
  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/favorites/${user.username}`) // Adjust backend URL if needed
        .then((response) => {
          setFavorites(response.data);
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error);
        });
    }
  }, [user]);

  // Remove a recipe from favorites
  const removeFromFavorites = (recipeId) => {
    if (user) {
      axios
        .delete(`http://localhost:5000/api/favorites/${user.username}/${recipeId}`)
        .then(() => {
          setFavorites(favorites.filter((recipe) => recipe.id !== recipeId));
        })
        .catch((error) => {
          console.error("Error removing favorite:", error);
        });
    }
  };

  return (
    <div
      className="container-fluid d-flex flex-column justify-content-center align-items-center text-white"
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/1640773/pexels-photo-1640773.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div className="container mt-4">
        <h2 style={{ color: "black", fontStyle: "italic" }}>My Favorite Recipes</h2>

        {favorites.length === 0 ? (
          <p className="text-dark">No favorites yet!</p>
        ) : (
          favorites.map((recipe) => (
            <div key={recipe.id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title" style={{ color: "black", fontStyle: "italic" }}>
                  <strong>Title:</strong> {recipe.title}
                </h5>
                <p className="card-text" style={{ color: "black", fontStyle: "italic" }}>
                  <strong>Ingredients:</strong> {recipe.ingredients}
                </p>
                <p className="card-text" style={{ color: "black", fontStyle: "italic" }}>
                  <strong>Instructions:</strong> {recipe.instructions}
                </p>
                {recipe.image && (
                  <img
                    src={recipe.image}
                    alt="Recipe"
                    className="img-fluid rounded"
                    style={{ maxWidth: "200px" }}
                  />
                )}
                <button
                  className="btn btn-danger mt-2"
                  style={{ marginLeft: "100px" }}
                  onClick={() => removeFromFavorites(recipe.id)}
                >
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
