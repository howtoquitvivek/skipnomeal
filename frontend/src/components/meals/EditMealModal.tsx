import { useState, useEffect } from "react";

type FoodItem = {
  _id: string;
  name: string;
};

type Food = {
  _id: string;
  foodItem: {
    _id: string;
    name: string;
  };
  quantity: number;
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

type Props = {
  meal: Meal;
  onClose: () => any;
  onSave: (updatedMeal: Meal) => any;
};

export default function EditMealModal({ meal, onClose, onSave }: Props) {
  const [name, setName] = useState(meal.name);
  const [foods, setFoods] = useState<Food[]>(meal.foods);

  const [availableFoods, setAvailableFoods] = useState<FoodItem[]>([]);
  const [selectedFoodId, setSelectedFoodId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(100);

  // Fetch list of all food items for adding
  useEffect(() => {
    fetch("http://localhost:5000/api/get-food") // Change to your actual API endpoint to get all foods
      .then((res) => res.json())
      .then((data) => setAvailableFoods(data))
      .catch((err) => console.error("Failed to fetch food items:", err));
  }, []);

  const handleAddFood = () => {
    if (!selectedFoodId) return;

    const foodItem = availableFoods.find((f) => f._id === selectedFoodId);
    if (!foodItem) return;

    setFoods((prev) => [
      ...prev,
      {
        _id: crypto.randomUUID(),
        foodItem,
        quantity,
      },
    ]);
    setSelectedFoodId("");
    setQuantity(100);
  };

  const handleRemoveFood = (foodId: string) => {
    setFoods((prev) => prev.filter((f) => f._id !== foodId));
  };

  const handleQuantityChange = (foodId: string, qty: number) => {
    setFoods((prev) =>
      prev.map((f) =>
        f._id === foodId ? { ...f, quantity: qty >= 0 ? qty : 0 } : f
      )
    );
  };

  const handleSubmit = async () => {
  const updatedMeal = {
    name,
    foods: foods.map((f) => ({
      foodItem: f.foodItem._id,
      quantity: f.quantity,
    })),
  };

  console.log("Submitting updated meal:", updatedMeal);

  try {
    const res = await fetch(`http://localhost:5000/api/edit-meal/${meal._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedMeal),
    });

    if (res.ok) {
      const data = await res.json();
      console.log("Update response:", data);
      onSave(data);
    } else {
      const errorText = await res.text();
      console.error("Failed to update meal:", res.status, errorText);
    }
  } catch (err) {
    console.error("Error updating meal:", err);
  }
};


  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-auto text-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-white">Edit Meal</h2>

        <div className="space-y-3 mb-4">
          {/* Rename meal */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Meal Name"
          />
        </div>

        {/* Current foods list */}
        <div className="mb-4">
          <h3 className="font-medium mb-2 text-gray-300">Foods in this meal:</h3>
          {foods.length === 0 && <p className="text-gray-500">No foods added.</p>}
          <ul className="space-y-2 max-h-40 overflow-auto">
            {foods.map((food) => (
              <li
                key={food._id}
                className="flex items-center justify-between bg-gray-800 rounded p-2"
              >
                <div className="flex items-center space-x-2">
                  <span>{food.foodItem?.name || "Unknown Food"}</span>
                  <input
                    type="number"
                    min={0}
                    value={food.quantity}
                    onChange={(e) =>
                      handleQuantityChange(food._id, Number(e.target.value))
                    }
                    className="w-16 p-1 border border-gray-700 rounded bg-gray-700 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span>g</span>
                </div>
                <button
                  onClick={() => handleRemoveFood(food._id)}
                  className="text-red-500 hover:text-red-700 text-sm"
                  type="button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Add new food */}
        <div className="mb-4">
          <h3 className="font-medium mb-2 text-gray-300">Add Food Item:</h3>
          <div className="flex space-x-2">
            <select
              value={selectedFoodId}
              onChange={(e) => setSelectedFoodId(e.target.value)}
              className="flex-grow p-2 border border-gray-700 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="text-gray-400">Select food...</option>
              {availableFoods.map((food) => (
                <option key={food._id} value={food._id}>
                  {food.name}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 p-2 border border-gray-700 rounded bg-gray-800 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Qty (g)"
            />
            <button
              onClick={handleAddFood}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              type="button"
            >
              Add
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
            type="button"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
