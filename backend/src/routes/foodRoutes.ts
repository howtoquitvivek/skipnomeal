import express, { Router } from "express";
import { addFoodItem, getFoodItems, deleteFood, editFood } from "../controllers/foodItemController";

const router: Router = express.Router();
router.post("/add-food", addFoodItem);
router.get("/get-food", getFoodItems);
router.delete("/delete-food/:id", deleteFood);
router.put("/edit-food/:id", editFood);

export default router;