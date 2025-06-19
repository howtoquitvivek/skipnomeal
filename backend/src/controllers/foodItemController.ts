// src/controllers/foodItemController.ts
import { Request, Response } from "express";
import FoodItem from "../models/foodItem";

export const addFoodItem = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, macros, quantityType, quantity, servingLabel } = req.body;

    if (!name || !quantityType || (quantityType !== "serving" && (quantity === undefined || typeof quantity !== "number"))) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    if (quantityType === "serving") {
      if (quantity !== null || macros !== null || !servingLabel) {
        return res.status(400).json({ message: "For 'serving', quantity must be null, macros must be null, and servingLabel is required." });
      }
    } else {
      if (!macros || macros.calories === undefined || macros.protein === undefined || macros.carbs === undefined || macros.fat === undefined) {
        return res.status(400).json({ message: "Macros must be provided for 'ml' or 'gram'." });
      }
    }

    const existingFood = await FoodItem.findOne({ name });

    if (existingFood) {
      return res.status(200).json({ message: "Food item already exists", foodItem: existingFood });
    }

    const validatedServingLabel =
  quantityType === "serving"
    ? Object.entries(servingLabel).reduce((acc, [label, data]: any) => {
        if (
          data.quantity === undefined ||
          data.calories === undefined ||
          data.protein === undefined ||
          data.carbs === undefined ||
          data.fat === undefined
        ) {
          throw new Error(`Missing data for serving label: ${label}`);
        }
        acc[label] = data;
        return acc;
      }, {} as typeof servingLabel)
    : null;

const newFoodItem = new FoodItem({
  name,
  macros: quantityType === "serving" ? null : macros,
  quantityType,
  quantity,
  servingLabel: validatedServingLabel,
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
  const {
    name,
    carbs,
    protein,
    fats, // you probably meant fat
    calories,
    quantityType,
    servingLabel,
  } = req.body;

  try {
    const updateData: any = {
      name,
      quantityType,
    };

    if (quantityType === "serving") {
      updateData.macros = null;
      updateData.servingLabel = servingLabel;
      updateData.quantity = null;
    } else {
      updateData.macros = {
        carbs,
        protein,
        fat: fats, // correct field name in schema
        calories,
      };
      updateData.servingLabel = null;
      updateData.quantity = 100; // optional default
    }

    const updatedFood = await FoodItem.findByIdAndUpdate(id, updateData, {
      new: true,
    });

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