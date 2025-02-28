import React from "react";

const RecipeCard = ({ recipe, user, deleteRecipe, updateRecipe }) => {
  // Debugging: Log values
  console.log("Logged-in User:", user?.username);
  console.log("Recipe Owner:", recipe.addedBy);

  // Check if logged-in user is the owner of the recipe
  const isOwner = user && user.username?.trim().toLowerCase() === recipe.addedBy?.trim().toLowerCase();
  console.log("Is Owner:", isOwner);

  return (
    <div className="col-md-4 mb-4">
      <div className="card">
        {recipe.image && <img src={recipe.image} className="card-img-top" alt={recipe.title} />}
        <div className="card-body">
          <h5 className="card-title">{recipe.title}</h5>
          <p className="card-text"><strong>Added By:</strong> {recipe.addedBy}</p>
          <p className="card-text"><strong>Ingredients:</strong> {recipe.ingredients}</p>
          <p className="card-text"><strong>Instructions:</strong> {recipe.instructions}</p>

          {isOwner ? (
            <>
              <button className="btn btn-danger me-2" onClick={() => deleteRecipe(recipe.id)}>
                Delete Recipe
              </button>
              <button className="btn btn-primary" onClick={() => updateRecipe(recipe)}>
                Update Recipe
              </button>
            </>
          ) : (
            <p className="text-muted">You cannot modify this recipe.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
