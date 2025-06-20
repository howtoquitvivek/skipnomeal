import { useEffect, useState } from "react";
import { Plus, Utensils, X, ChevronDown } from "lucide-react";

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type ServingMacros = {
  [size: string]: Macros & { weight?: number } & { quantity?: number };
};

type FoodItem = {
  _id: string;
  name: string;
  macros?: Macros | null;
  quantityType: "grams" | "ml" | "serving";
  quantity?: number | null;
  servingLabel?: ServingMacros | null;
};

type MealFood = {
  foodItem: FoodItem | null;
  quantity: number;
  servingSize?: string;
  isCustomQuantity?: boolean;
};

export default function AddMeal() {
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

  const updateFood = (
    index: number,
    field: keyof MealFood,
    value: string | number | boolean | FoodItem
  ) => {
    const updated = [...foods];
    if (field === "foodItem") {
      const selectedFood = allFoodItems.find((item) => item._id === value) || null;
      const firstServingSize = selectedFood?.servingLabel
        ? Object.keys(selectedFood.servingLabel)[0]
        : undefined;
      const firstWeight =
        selectedFood?.servingLabel?.[firstServingSize!]?.weight || 100;

      updated[index] = {
        ...updated[index],
        foodItem: selectedFood,
        quantity: selectedFood?.quantityType === "serving" ? firstWeight : 100,
        servingSize:
          selectedFood?.quantityType === "serving" ? firstServingSize : undefined,
        isCustomQuantity: false,
      };
    } else if (field === "servingSize") {
      updated[index].servingSize = value as string;
      updated[index].isCustomQuantity = value === "custom";
      if (value === "custom") {
        const foodItem = updated[index].foodItem;
        const fallbackWeight =
          Object.values(foodItem?.servingLabel || {})[0]?.weight || 100;
        updated[index].quantity = fallbackWeight;
      }
    } else if (field === "quantity") {
      updated[index].quantity = value as number;
    } else if (field === "isCustomQuantity") {
      updated[index].isCustomQuantity = value as boolean;
    }
    setFoods(updated);
  };

  const calculateTotal = (): Macros => {
    return foods.reduce(
      (total, { foodItem, quantity, servingSize, isCustomQuantity }) => {
        if (!foodItem) return total;

        if (foodItem.quantityType === "serving" && foodItem.servingLabel) {
          if (isCustomQuantity) {
            const baseServing =
              foodItem.servingLabel["small"] ||
              Object.values(foodItem.servingLabel)[0];
            if (baseServing?.weight) {
              const ratio = quantity / baseServing.weight;
              total.calories += baseServing.calories * ratio;
              total.protein += baseServing.protein * ratio;
              total.carbs += baseServing.carbs * ratio;
              total.fat += baseServing.fat * ratio;
            }
          } else if (servingSize && foodItem.servingLabel[servingSize]) {
            const macros = foodItem.servingLabel[servingSize];
            total.calories += macros.calories;
            total.protein += macros.protein;
            total.carbs += macros.carbs;
            total.fat += macros.fat;
          }
        } else if (foodItem.macros) {
          const baseQty = foodItem.quantity || 100;
          const factor = quantity / baseQty;
          total.calories += foodItem.macros.calories * factor;
          total.protein += foodItem.macros.protein * factor;
          total.carbs += foodItem.macros.carbs * factor;
          total.fat += foodItem.macros.fat * factor;
        }

        return total;
      },
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const total = calculateTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      foods: foods.map(({ foodItem, quantity, servingSize, isCustomQuantity }) => ({
        foodItem,
        quantity,
        servingSize: isCustomQuantity ? "custom" : servingSize,
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

  const isFormIncomplete = foods.some((f) => !f.foodItem || !f.quantity);

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
                  const selectedFood = food.foodItem;
                  const isServingType = selectedFood?.quantityType === "serving";
                  const showCustomQuantity = isServingType && food.isCustomQuantity;
                  const showRegularQuantity = !isServingType;
                  const unit =
                    selectedFood?.quantityType === "grams"
                      ? "g"
                      : selectedFood?.quantityType === "ml"
                      ? "ml"
                      : "x";

                  return (
                    <div key={idx} className="flex gap-3 items-center">
                      <div className="relative flex-1">
                        <select
                          className="w-full bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-8"
                          value={selectedFood?._id || ""}
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

                      {isServingType && selectedFood?.servingLabel ? (
                        <>
                          <select
                            value={food.servingSize || ""}
                            onChange={(e) =>
                              updateFood(idx, "servingSize", e.target.value)
                            }
                            className="bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg flex-1"
                            required
                          >
                            {Object.keys(selectedFood.servingLabel).map((size) => (
                              <option key={size} value={size}>
                                {`${size} (${selectedFood.servingLabel?.[size]?.quantity ?? "?"}g)`}
                              </option>
                            ))}
                            <option value="custom">Custom (g)</option>
                          </select>
                          {showCustomQuantity && (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                min={1}
                                step={1}
                                value={food.quantity}
                                onChange={(e) =>
                                  updateFood(idx, "quantity", Number(e.target.value))
                                }
                                className="w-24 bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg"
                                placeholder="Grams"
                                required
                              />
                              <span className="text-gray-300">g</span>
                            </div>
                          )}
                        </>
                      ) : showRegularQuantity ? (
                        <input
                          type="number"
                          min={1}
                          value={food.quantity}
                          onChange={(e) =>
                            updateFood(idx, "quantity", Number(e.target.value))
                          }
                          className="w-24 bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg"
                          placeholder={`Qty (${unit})`}
                          required
                        />
                      ) : null}

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

          <div className="mt-6 bg-gray-800/50 p-4 rounded-xl border border-gray-700 text-gray-200 space-y-1">
            <h3 className="font-semibold text-white">Total Macros:</h3>
            <p>Calories: {total.calories.toFixed(1)} kcal</p>
            <p>Protein: {total.protein.toFixed(1)} g</p>
            <p>Carbs: {total.carbs.toFixed(1)} g</p>
            <p>Fat: {total.fat.toFixed(1)} g</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500/90 text-white px-5 py-3 rounded-xl hover:bg-blue-600/90 font-medium transition-all duration-300 hover:scale-[1.02] mt-6 flex items-center justify-center space-x-2"
            disabled={foods.length === 0 || isFormIncomplete}
          >
            <Plus className="w-5 h-5" />
            <span>Save Meal</span>
          </button>
        </form>
      </div>
    </div>
  );
}
