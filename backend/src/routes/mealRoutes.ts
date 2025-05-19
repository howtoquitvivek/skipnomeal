import express, { Router } from "express";
import { addMeal, getMeals, editMeal, deleteMeal} from "../controllers/mealController";

const router: Router = express.Router();

router.post("/add-meal", addMeal); 
router.get('/get-meal', getMeals);
router.put("/edit-meal/:id", editMeal);
router.delete("/delete-meal/:id", deleteMeal);

export default router;
