import React, { createContext, useState } from "react";

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
  const [recipes, setRecipes] = useState([]); // 🛠 Default: []
  const [favorites, setFavorites] = useState([]); // 🛠 Default: []

  const addRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };

  const saveToFavorites = (recipe) => {
    setFavorites([...favorites, recipe]);
  };

  return (
    <RecipeContext.Provider value={{ recipes, favorites, addRecipe, saveToFavorites }}>
      {children}
    </RecipeContext.Provider>
  );
};
