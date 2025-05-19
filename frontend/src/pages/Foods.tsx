import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Leaf, Beef, Wheat, Milk, Pencil, Trash2 } from "lucide-react";
import EditFoodModal from "../components/foods/EditFoodModal";

type FoodItem = {
  _id: string;
  name: string;
  carbs: number;
  protein: number;
  fats: number;
  calories: number;
  quantityType: "grams" | "ml" | "serving";
  servingLabel?: string | null;
  quantity?: number;
};


export default function Foods() {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const navigate = useNavigate();
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/get-food")
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((err) => console.error("Failed to fetch food items:", err));
  }, []);

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
          {foods.map((food) => (
            <div
              key={food._id}
              className="glass-card p-5 rounded-2xl shadow-lg border border-gray-700/50 transition-all duration-300 hover:border-green-400/50 hover:scale-[1.02]"
            >
              <div
                className="cursor-pointer"
                onClick={() => navigate(`/food/${food._id}`)}
              >
                <h2 className="text-xl font-semibold text-white mb-1">{food.name}</h2>
                <p className="text-sm text-gray-400 mb-2">
                  {food.quantityType === "serving"
                    ? `${food.servingLabel} (${food.quantity}${food.quantityType === "serving" ? "g" : food.quantityType})`
                    : `100 ${food.quantityType}`}
                </p>
                <div className="my-3 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                <div className="text-sm text-gray-300 space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-yellow-400">🔥</span>
                    <span>Calories: {food.calories} kcal</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Beef className="w-4 h-4 text-red-300" />
                    <span>Protein: {food.protein}g</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wheat className="w-4 h-4 text-yellow-300" />
                    <span>Carbs: {food.carbs}g</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Milk className="w-4 h-4 text-amber-300" />
                    <span>Fats: {food.fats}g</span>
                  </div>
                </div>
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
          ))}
        </div>
      )}

      {selectedFood && (
        <EditFoodModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
