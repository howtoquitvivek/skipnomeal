import { Schema, model, Types } from "mongoose";

const MealSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  foods: [
    {
      foodItem: {
        type: Types.ObjectId,
        ref: "FoodItem",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // grams of this FoodItem in the meal
      },
    },
  ],

  // Total nutrition fields cached for quick lookup
  totalCalories: {
    type: Number,
    min: 0,
    default: 0,
  },
  totalCarbs: {
    type: Number,
    min: 0,
    default: 0,
  },
  totalProtein: {
    type: Number,
    min: 0,
    default: 0,
  },
  totalFats: {
    type: Number,
    min: 0,
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Meal = model("Meal", MealSchema);

export default Meal;
