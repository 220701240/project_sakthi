import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api" });

export const fetchRecipes = async () => {
    try {
      const { data } = await API.get("/recipes");
      return data;
    } catch (error) {
      console.error("Error fetching recipes", error);
    }
  };
  
export const fetchFavorites = async () => {
    try {
      const { data } = await API.get("/favorites");
      return data;
    } catch (error) {
      console.error("Error fetching favorites", error);
    }
  };
  
  export const addFavorite = async (recipeId) => {
    try {
      await API.post(`/favorites/add/${recipeId}`);
    } catch (error) {
      console.error("Error adding to favorites", error);
    }
  };
  
export default API;
