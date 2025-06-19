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
        min: 1,
      },
      servingSize: {
        type: String, // optional, only used for "serving" type items
      },
    },
  ],

  // Cached total macros for the meal
  totalCalories: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalCarbs: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalProtein: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalFats: {
    type: Number,
    default: 0,
    min: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Meal = model("Meal", MealSchema);

export default Meal;
