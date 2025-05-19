import { Request, Response } from "express";
import Meal from "../models/meal";
import FoodItem from "../models/foodItem";

export const addMeal = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, foods, date } = req.body;

    if (!name || !Array.isArray(foods) || foods.length === 0) {
      return res.status(400).json({ message: "Name and foods are required" });
    }

    for (const item of foods) {
      if (!item.foodItem || typeof item.quantity !== "number" || item.quantity <= 0) {
        return res.status(400).json({ message: "Each food must have foodItem id and positive quantity" });
      }
    }

    const foodIds = foods.map((f: any) => f.foodItem);
    const foundItems = await FoodItem.find({ _id: { $in: foodIds } });
    if (foundItems.length !== foodIds.length) {
      return res.status(400).json({ message: "Some food items are invalid" });
    }

    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFats = 0;

    for (const item of foods) {
      const foodId = typeof item.foodItem === 'string' ? item.foodItem : item.foodItem._id?.toString();
      const food = foundItems.find(f => f._id.toString() === foodId);

      if (food) {
        const baseQty = food.quantity || 100;
        const ratio = item.quantity / baseQty;
        totalCalories += (food.calories || 0) * ratio;
        totalCarbs += (food.carbs || 0) * ratio;
        totalProtein += (food.protein || 0) * ratio;
        totalFats += (food.fats || 0) * ratio;
      }
    }

    totalCalories = Math.round(totalCalories * 100) / 100;
    totalCarbs = Math.round(totalCarbs * 100) / 100;
    totalProtein = Math.round(totalProtein * 100) / 100;
    totalFats = Math.round(totalFats * 100) / 100;

    const newMeal = new Meal({
      name,
      foods,
      date: date ? new Date(date) : new Date(),
      totalCalories,
      totalCarbs,
      totalProtein,
      totalFats,
    });

    const createdMeal = await newMeal.save();
    await createdMeal.populate("foods.foodItem");

    return res.status(201).json({
      message: "Meal created successfully",
      meal: createdMeal.toObject(),
    });
  } catch (error) {
    console.error("Error creating meal:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const editMeal = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { name, foods } = req.body;

  try {
    if (!name || !foods) {
      return res.status(400).json({ message: "Name and foods are required" });
    }

    const foodItemIds = foods.map((f: any) => f.foodItem);
    const foodItems = await FoodItem.find({ _id: { $in: foodItemIds } });
    const foodItemMap = new Map(foodItems.map(fi => [fi._id.toString(), fi]));

    let totalCalories = 0;
    let totalCarbs = 0;
    let totalProtein = 0;
    let totalFats = 0;

    for (const food of foods) {
      const foodId = typeof food.foodItem === 'string' ? food.foodItem : food.foodItem._id?.toString();
      const foodData = foodItemMap.get(foodId);

      if (foodData) {
        const baseQty = foodData.quantity || 100;
        const ratio = food.quantity / baseQty;
        totalCalories += (foodData.calories || 0) * ratio;
        totalCarbs += (foodData.carbs || 0) * ratio;
        totalProtein += (foodData.protein || 0) * ratio;
        totalFats += (foodData.fats || 0) * ratio;
      }
    }

    totalCalories = Math.round(totalCalories * 100) / 100;
    totalCarbs = Math.round(totalCarbs * 100) / 100;
    totalProtein = Math.round(totalProtein * 100) / 100;
    totalFats = Math.round(totalFats * 100) / 100;

    const updated = await Meal.findByIdAndUpdate(
      id,
      {
        name,
        foods,
        totalCalories,
        totalCarbs,
        totalProtein,
        totalFats,
      },
      { new: true }
    ).populate("foods.foodItem");

    if (!updated) return res.status(404).json({ message: "Meal not found" });

    return res.json(updated);
  } catch (err) {
    console.error("Error updating meal:", err);
    return res.status(500).json({ message: "Error updating meal", error: err });
  }
};

export const deleteMeal = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;

  try {
    const deleted = await Meal.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Meal not found" });

    res.json({ message: "Meal deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting meal", error: err });
  }
};

export const getMeals = async (req: Request, res: Response): Promise<any> => {
  try {
    const meals = await Meal.find().populate("foods.foodItem");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch meals' });
  }
};
