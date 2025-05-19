import { Schema, model } from "mongoose";

const FoodItemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  carbs: {
    type: Number,
    required: true,
    min: 0,
  },

  protein: {
    type: Number,
    required: true,
    min: 0,
  },

  fats: {
    type: Number,
    required: true,
    min: 0,
  },

  calories: {
    type: Number,
    required: true,
    min: 0,
  },

  fiber: {
    type: Number,
    min: 0,
  },

  sugar: {
    type: Number,
    min: 0,
  },

  category: {
    type: String,
    trim: true,
  },

  // New Fields for quantity management
  quantityType: {
    type: String,
    enum: ["grams", "ml", "serving"],
    default: "grams",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 100, // For grams/ml, it’s fixed; for serving, it's user-defined
  },

  servingLabel: {
    type: String,
    trim: true,
    default: null, // e.g., 'small', 'medium', 'large'
  }

}, { timestamps: true });

const FoodItem = model("FoodItem", FoodItemSchema);

export default FoodItem;
