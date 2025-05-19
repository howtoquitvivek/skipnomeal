import { useEffect, useState } from "react";
import { Plus, Utensils, X, ChevronDown } from "lucide-react";

export default function AddMeal() {
  type FoodItem = {
    _id: string;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    quantityType: "grams" | "ml" | "serving";
    servingLabel?: string | null;
    // add other fields if needed
  };

  type MealFood = {
    foodItem: FoodItem | null; // now full object or null if not selected
    quantity: number;
  };

  const [name, setName] = useState("");
  const [foods, setFoods] = useState<MealFood[]>([]);
  const [allFoodItems, setAllFoodItems] = useState<FoodItem[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/get-food")
      .then((res) => res.json())
      .then(setAllFoodItems)
      .catch((err) => console.error("Failed to fetch food items", err));
  }, []);

  const addFoodField = () => {
    setFoods([...foods, { foodItem: null, quantity: 100 }]);
  };

  const removeFoodField = (index: number) => {
    const updated = [...foods];
    updated.splice(index, 1);
    setFoods(updated);
  };

  // When food selection changes, set the full foodItem object here
  const updateFood = (index: number, field: keyof MealFood, value: any) => {
    const updated = [...foods];
    if (field === "foodItem") {
      const selectedFood = allFoodItems.find((item) => item._id === value) || null;
      updated[index].foodItem = selectedFood;
    } else {
      updated[index][field] = value;
    }
    setFoods(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare payload matching the required structure
    const payload = {
      name,
      foods: foods.map(({ foodItem, quantity }) => ({
        foodItem,
        quantity,
      })),
    };

    const response = await fetch("http://localhost:5000/api/add-meal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Meal added successfully!");
      setName("");
      setFoods([]);
    } else {
      alert("Error: " + data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
      <div className="glass-card w-full max-w-2xl p-8 rounded-2xl shadow-lg border border-gray-700/50">
        <div className="flex items-center space-x-3 mb-6">
          <Utensils className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Add New Meal</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-medium mb-2 text-gray-300">Meal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              placeholder="e.g. Breakfast Burrito"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block font-medium text-gray-300">Food Items</label>
              <button
                type="button"
                onClick={addFoodField}
                className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Food</span>
              </button>
            </div>

            {foods.length === 0 ? (
              <div className="bg-gray-800/30 border border-dashed border-gray-600 rounded-lg p-4 text-center text-gray-400">
                No food items added yet
              </div>
            ) : (
              <div className="space-y-3">
                {foods.map((food, idx) => {
                  // foodItem can be null initially
                  const selectedFoodItem = food.foodItem;
                  const quantityType = selectedFoodItem?.quantityType;
                  const unit =
                    quantityType === "grams"
                      ? "g"
                      : quantityType === "ml"
                      ? "ml"
                      : "";

                  return (
                    <div key={idx} className="flex gap-3 items-center">
                      <div className="relative flex-1">
                        <select
                          className="w-full bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                          value={selectedFoodItem?._id || ""}
                          onChange={(e) => updateFood(idx, "foodItem", e.target.value)}
                          required
                        >
                          <option value="">-- Select Food --</option>
                          {allFoodItems.map((item) => (
                            <option key={item._id} value={item._id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          min={1}
                          placeholder={unit ? `Quantity (${unit})` : "Quantity"}
                          value={food.quantity}
                          onChange={(e) => updateFood(idx, "quantity", Number(e.target.value))}
                          className="w-32 bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          required
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFoodField(idx)}
                        className="text-red-400 hover:text-red-300 p-2 rounded-full hover:bg-gray-700/50 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500/90 text-white px-5 py-3 rounded-xl hover:bg-blue-600/90 font-medium transition-all duration-300 hover:scale-[1.02] mt-6 flex items-center justify-center space-x-2"
            disabled={foods.length === 0}
          >
            <Plus className="w-5 h-5" />
            <span>Save Meal</span>
          </button>
        </form>
      </div>
    </div>
  );
}
