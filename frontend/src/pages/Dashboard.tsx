import { useState } from "react";
import NutritionSummary from "../components/dashboard/NutritionSummary";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  // Sample data
  const summaryData = [
    { label: "Calories", value: 1800, goal: 2500, unit: "kcal", color: "red" },
    { label: "Protein", value: 90, goal: 120, unit: "g", color: "green" },
    { label: "Carbs", value: 220, goal: 300, unit: "g", color: "blue" },
    { label: "Fat", value: 70, goal: 80, unit: "g", color: "yellow" },
  ];

  const meals = [
    { id: 1, name: "Oats & Milk", calories: 300 },
    { id: 2, name: "Grilled Chicken", calories: 500 },
    { id: 3, name: "Dal, Rice, Sabzi", calories: 600 },
  ];

  const [waterGoal, setWaterGoal] = useState(3000); // in ml
  const [waterIntake, setWaterIntake] = useState(1500); // in ml

  const addWater = (amount: number) => {
    setWaterIntake((prev) => Math.min(prev + amount, waterGoal));
  };

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">🏋️ Dashboard</h1>

      {/* Nutrition Summary */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">
          Daily Nutrition Summary
        </h2>
        <NutritionSummary data={summaryData} />
      </section>

      {/* Your Meals */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">🍽️ Your Meals</h2>
          <button
            onClick={() => navigate("/meals")}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Add Meal
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <h3 className="text-md font-semibold">{meal.name}</h3>
              <p className="text-gray-500 text-sm">{meal.calories} kcal</p>
            </div>
          ))}
        </div>
      </section>

      {/* Water Intake */}
      <section>
        <h2 className="text-lg font-semibold mb-4 text-gray-700">💧 Water Intake</h2>
        <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">
          <p className="text-gray-700 text-lg font-medium">
            {waterIntake} / {waterGoal} ml
          </p>

          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-blue-400"
              style={{ width: `${Math.min((waterIntake / waterGoal) * 100, 100)}%` }}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {[200, 250, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => addWater(amount)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                +{amount}ml
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
