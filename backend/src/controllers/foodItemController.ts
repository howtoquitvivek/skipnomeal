// src/controllers/foodItemController.ts
import { Request, Response } from "express";
import FoodItem from "../models/foodItem";

export const addFoodItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, carbs, protein, fats, calories, quantityType, quantity, servingLabel } = req.body;

    if (
      !name ||
      carbs === undefined ||
      protein === undefined ||
      fats === undefined ||
      calories === undefined ||
      !quantityType ||
      quantity === undefined ||
      (quantityType === "serving" && !servingLabel)
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if a food item with same values already exists
    const existingFood = await FoodItem.findOne({
      name,
    });

    if (existingFood) {
      return res.status(200).json({ message: "Food item already exists", foodItem: existingFood });
    }

    const newFoodItem = new FoodItem({
      name,
      carbs,
      protein,
      fats,
      calories,
      quantityType,
      quantity,
      servingLabel: quantityType === "serving" ? servingLabel : null,
    });

    await newFoodItem.save();

    return res.status(201).json({ message: "Food item added", foodItem: newFoodItem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const deleteFood = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const deleted = await FoodItem.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ message: "Food item not found" });
      return;
    }

    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("Delete food error:", error);
    res.status(500).json({ message: "Server error while deleting food item" });
  }
};

export const editFood = async (req: Request, res: Response): Promise<any> => {
  const { id } = req.params;
  const { name, carbs, protein, fats, calories, quantityType, servingSize } = req.body;

  try {
    const updatedFood = await FoodItem.findByIdAndUpdate(
      id,
      {
        name,
        carbs,
        protein,
        fats,
        calories,
        quantityType,
        servingSize: quantityType === "serving" ? servingSize : null,
      },
      { new: true }
    );

    if (!updatedFood) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.json(updatedFood);
  } catch (err) {
    res.status(500).json({ message: "Failed to update food item", error: err });
  }
};

export const getFoodItems = async (req: Request, res: Response): Promise<any> => {
  try {
    const foods = await FoodItem.find();
    res.status(200).json(foods);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ message: "Failed to fetch food items" });
  }
};