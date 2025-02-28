import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: "Recipe" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
});

export default mongoose.model("Review", ReviewSchema);
