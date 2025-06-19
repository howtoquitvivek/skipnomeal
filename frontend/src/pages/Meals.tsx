import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  ArrowRight,
  Utensils,
  Drumstick,
  Bed,
  Milk,
  Soup,
  Pizza,
  Trash2,
} from "lucide-react";

// --- Types ---
type FoodItem = {
  _id: string;
  name: string;
  carbs: number;
  protein: number;
  fats: number;
  calories: number;
  quantityType: string;
  servingLabel: object;
  quantity: number;
};

type Food = {
  _id: string;
  foodItem: FoodItem;
  quantity: number;
  servingSize?: string;
};


type Meal = {
  _id: string;
  name: string;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFats: number;
  foods: Food[];
};

export default function Meals() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [hoveredMeal, setHoveredMeal] = useState<string | null>(null);
  const navigate = useNavigate();


  const deleteMealApi = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/delete-meal/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMeals((prev) => prev.filter((meal) => meal._id !== id));
      } else {
        console.error("Failed to delete meal");
      }
    } catch (error) {
      console.error("Error deleting meal:", error);
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/api/get-meal")
      .then((res) => res.json())
      .then((data) => setMeals(data as Meal[])) // ✅ cast response to Meal[]
      .catch((err) => console.error("Failed to fetch meals:", err));
  }, []);

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <Utensils className="w-6 h-6 text-blue-400" />
          <h1 className="text-3xl font-bold text-white">My Meals</h1>
        </div>
        <button
          onClick={() => navigate("/add-meal")}
          className="flex items-center space-x-2 bg-blue-500/90 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600/90 text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg hover:shadow-blue-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Meal</span>
        </button>
      </div>

      {meals.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="glass-card p-8 text-center max-w-md">
            <Soup className="w-10 h-10 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-300 mb-4">You haven't added any meals yet.</p>
            <button
              onClick={() => navigate("/add-meal")}
              className="flex items-center justify-center space-x-2 bg-blue-500/90 text-white px-5 py-2 rounded-xl hover:bg-blue-600/90 text-sm font-medium transition-all duration-300 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Meal</span>
            </button>
          </div>
        </div>
      ) : (
        <ul className="space-y-5">
          {meals.map((meal) => (
            <li
              key={meal._id}
              className={`glass-card p-5 rounded-2xl shadow-lg border border-gray-700/50 transition-all duration-300 hover:border-blue-400/50 ${
                hoveredMeal === meal._id ? "scale-[1.01]" : ""
              }`}
              onMouseEnter={() => setHoveredMeal(meal._id)}
              onMouseLeave={() => setHoveredMeal(null)}
              style={{ cursor: "default" }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <Pizza className="w-5 h-5 text-blue-400" />
                  <h2 className="text-xl font-semibold text-white">
                    {meal.name}
                  </h2>
                </div>
                <span className="flex items-center space-x-2 text-sm bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full">
                  <span>{meal.totalCalories.toFixed(2)} kcal</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <div className="my-4 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

              <div className="text-sm text-gray-300 grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Drumstick className="w-4 h-4 text-red-300" />
                  <span>{meal.totalProtein.toFixed(2)} g protein</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Bed className="w-4 h-4 text-yellow-300" />
                  <span>{meal.totalCarbs.toFixed(2)} g carbs</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Milk className="w-4 h-4 text-amber-300" />
                  <span>{meal.totalFats.toFixed(2)} g fats</span>
                </div>
              </div>

              <div className="pt-2">
                <h3 className="font-medium text-sm text-gray-400 mb-2 flex items-center space-x-2">
                  <Soup className="w-4 h-4" />
                  <span>Foods in this meal:</span>
                </h3>
                <ul className="space-y-2">
                  {meal.foods.map((food) => (
                    <li
                      key={food._id}
                      className="flex items-center text-sm text-gray-300 bg-gray-800/50 px-3 py-2 rounded-lg hover:bg-gray-700/70 transition-colors duration-200"
                    >
                      {food.foodItem ? (
                        <span className="truncate">
                          {food.foodItem.name}{" "}
                          {food.foodItem.quantityType === "serving" && food.servingSize
                            ? (() => {
                                const servingData = (food.foodItem.servingLabel as any)?.[food.servingSize];
                                return servingData 
                                  ? `${food.servingSize} (${servingData.quantity}g)`
                                  : `${food.quantity} servings`;
                              })()
                            : `${food.quantity}${food.foodItem.quantityType}`}
                        </span>
                      ) : (
                        <span className="text-red-400">Unknown Food Item</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-3 flex space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMealApi(meal._id);
                  }}
                  className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Delete</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
