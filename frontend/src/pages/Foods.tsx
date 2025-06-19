import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Leaf, Beef, Wheat, Milk, Pencil, Trash2 } from "lucide-react";
import EditFoodModal from "../components/foods/EditFoodModal";

type Macros = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type ServingMacros = {
  [size: string]: Macros  & { quantity: number }; // e.g. small, medium, large mapped to macros
};

type FoodItem = {
  _id: string;
  name: string;
  macros?: Macros | null;
  quantityType: "gram" | "ml" | "serving";
  quantity?: number | null;
  servingLabel?: ServingMacros | null;
};

export default function Foods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const navigate = useNavigate();
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  // Store selected sizes for each food item by id
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("http://localhost:5000/api/get-food")
      .then((res) => res.json())
      .then((data: FoodItem[]) => {
        setFoods(data);

        // Initialize default selected sizes for serving type foods
        const defaults: Record<string, string> = {};
data.forEach((food) => {
  if (food.quantityType === "serving" && food.servingLabel) {
    const servingKeys = Object.keys(food.servingLabel);
    if (servingKeys.length > 0) {
      defaults[food._id] = servingKeys[0]; // Use the first available serving size
    }
  }
});
        setSelectedSizes(defaults);
      })
      .catch((err) => console.error("Failed to fetch food items:", err));
  }, []);

  const handleSizeChange = (foodId: string, size: string) => {
    setSelectedSizes((prev) => ({ ...prev, [foodId]: size }));
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this food item?")) return;

    try {
      const res = await fetch(`http://localhost:5000/api/delete-food/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setFoods((prev) => prev.filter((food) => food._id !== id));
      } else {
        console.error("Failed to delete food item.");
      }
    } catch (err) {
      console.error("Error deleting food:", err);
    }
  };

  const handleSave = (updatedFood: FoodItem) => {
    setFoods((prev) =>
      prev.map((food) => (food._id === updatedFood._id ? updatedFood : food))
    );
    setSelectedFood(null);
  };

  return (
    <div className="min-h-screen p-6 max-w-6xl mx-auto bg-gray-900">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <Leaf className="w-6 h-6 text-green-400" />
          <h1 className="text-3xl font-bold text-white">All Food Items</h1>
        </div>
        <button
          onClick={() => navigate("/add-food")}
          className="flex items-center space-x-2 bg-blue-500/90 text-white px-5 py-2.5 rounded-xl hover:bg-blue-600/90 text-sm font-medium transition-all duration-300 hover:scale-105 backdrop-blur-sm shadow-lg hover:shadow-blue-500/30"
        >
          <Plus className="w-4 h-4" />
          <span>Add Food</span>
        </button>
      </div>

      {foods.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="glass-card p-8 text-center max-w-md">
            <Leaf className="w-10 h-10 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-300 mb-4">You haven't added any food items yet.</p>
            <button
              onClick={() => navigate("/add-food")}
              className="flex items-center justify-center space-x-2 bg-blue-500/90 text-white px-5 py-2 rounded-xl hover:bg-blue-600/90 text-sm font-medium transition-all duration-300 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Food</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {foods.map((food) => {
            // Determine macros for gram/ml type to fix empty fields
            const macrosForQuantity =
              food.quantityType === "gram" || food.quantityType === "ml"
                ? {
                    calories: food.macros?.calories ?? 0,
                    protein: food.macros?.protein ?? 0,
                    carbs: food.macros?.carbs ?? 0,
                    fat: food.macros?.fat ?? 0,
                  }
                : { calories: 0, protein: 0, carbs: 0, fat: 0 };

            // For serving type, get selected size macros
            const selectedSize = selectedSizes[food._id];
            const selectedServingMacros =
              food.quantityType === "serving" && food.servingLabel && selectedSize
                ? food.servingLabel[selectedSize]
                : null;

            return (
              <div
                key={food._id}
                className="glass-card p-5 rounded-2xl shadow-lg border border-gray-700/50 transition-all duration-300 hover:border-green-400/50 hover:scale-[1.02]"
              >
                <div
                  className="cursor-pointer"
                  // onClick={() => navigate(`/food/${food._id}`)}
                >
                  <h2 className="text-xl font-semibold text-white mb-1">{food.name}</h2>

                  {/* Quantity & Macros display */}
                  {food.quantityType === "serving" && food.servingLabel ? (
                    <>
                      <p className="text-sm text-gray-400 mb-2">Serving Sizes and Macros:</p>

                      {/* Dropdown to select serving size */}
                      <select
                        value={selectedSize || ""}
                        onChange={(e) => handleSizeChange(food._id, e.target.value)}
                        className="mb-3 rounded bg-gray-800 border border-gray-700 text-gray-300 px-2 py-1 text-sm"
                      >
                        {Object.keys(food.servingLabel).map((size) => (
                          <option key={size} value={size}>
                            {size.charAt(0).toUpperCase() + size.slice(1)}
                          </option>
                        ))}
                      </select>

                      {selectedServingMacros ? (
  <div className="border border-gray-700 rounded p-2 bg-gray-800">
    <div className="flex justify-between mb-1">
      <span className="capitalize font-medium">{selectedSize}</span>
      <span>
        {food.quantityType === "serving" && food.quantity
          ? `${food.quantity}g`
          : ""}
      </span>
    </div>
    <div className="text-sm text-gray-300 grid grid-cols-4 gap-2">
      <span>🔥 {selectedServingMacros.calories} kcal</span>
      <span>Protein: {selectedServingMacros.protein}g</span>
      <span>Carbs: {selectedServingMacros.carbs}g</span>
      <span>Fats: {selectedServingMacros.fat}g</span>
    </div>
  </div>
) : (
  <div className="text-sm text-gray-400 italic">No macros available</div>
)}

                    </>
                  ) : (
                    <>
                      <p className="text-sm text-gray-400 mb-2">
                        {food.quantityType === "gram" || food.quantityType === "ml"? `100 ${food.quantityType}`: food.quantity? `${food.quantity} ${food.quantityType}`: ""}
                      </p>
                      <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                      <div className="text-sm text-gray-300 space-y-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-yellow-400">🔥</span>
                          <span>Calories: {macrosForQuantity?.calories ?? 0} kcal</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Beef className="w-4 h-4 text-red-300" />
                          <span>Protein: {macrosForQuantity?.protein ?? 0}g</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Wheat className="w-4 h-4 text-yellow-300" />
                          <span>Carbs: {macrosForQuantity?.carbs ?? 0}g</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Milk className="w-4 h-4 text-amber-300" />
                          <span>Fats: {macrosForQuantity?.fat ?? 0}g</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedFood(food)}
                    className="text-blue-400 hover:text-blue-600"
                  >
                    <Pencil className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(food._id)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedFood && (
        <EditFoodModal
          food={{
            ...selectedFood,
            carbs: selectedFood.macros?.carbs ?? 0,
            protein: selectedFood.macros?.protein ?? 0,
            fats: selectedFood.macros?.fat ?? 0,
            calories: selectedFood.macros?.calories ?? 0,
          }}
          onClose={() => setSelectedFood(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
