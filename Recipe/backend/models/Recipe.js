import mongoose from "mongoose";

const RecipeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: { type: String, required: true },
  ingredients: [String],
  image: { type: String },
  category: { type: String },
  difficulty: { type: String },
  prepTime: { type: Number },
});

export default mongoose.model("Recipe", RecipeSchema);
