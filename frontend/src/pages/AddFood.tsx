import { useState } from "react";
import { Plus, Leaf, Beef, Wheat, Milk, Flame } from "lucide-react";

export default function AddFood() {
  const [name, setName] = useState("");
  const [calories, setCalories] = useState<number | "">("");
  const [protein, setProtein] = useState<number | "">("");
  const [carbs, setCarbs] = useState<number | "">("");
  const [fats, setFats] = useState<number | "">("");
  const [quantityType, setQuantityType] = useState("grams");
  const [servingLabel, setServingLabel] = useState("");
  const [quantity, setQuantity] = useState<number | "">(100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !name ||
      calories === "" ||
      protein === "" ||
      carbs === "" ||
      fats === "" ||
      (quantityType === "serving" && (!servingLabel || quantity === ""))
    ) {
      alert("Please fill all fields");
      return;
    }

    const finalQuantity = quantityType === "serving" ? quantity : 100;

    const response = await fetch("http://localhost:5000/api/add-food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        calories: Number(calories),
        protein: Number(protein),
        carbs: Number(carbs),
        fats: Number(fats),
        quantityType,
        quantity: finalQuantity,
        servingLabel: quantityType === "serving" ? servingLabel : null,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Food item added successfully!");
      setName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFats("");
      setQuantityType("grams");
      setServingLabel("");
      setQuantity(100);
    } else {
      alert("Error: " + data.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
      <div className="glass-card w-full max-w-md p-8 rounded-2xl shadow-lg border border-gray-700/50">
        <div className="flex items-center space-x-3 mb-6">
          <Leaf className="w-6 h-6 text-green-400" />
          <h2 className="text-2xl font-bold text-white">Add Food Item</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block font-medium mb-2 text-gray-300">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg"
              required
              placeholder="e.g. Chicken Breast"
            />
          </div>

          {/* Quantity Type */}
          <div>
            <label className="block font-medium mb-2 text-gray-300">Quantity Type</label>
            <select
              value={quantityType}
              onChange={(e) => {
                setQuantityType(e.target.value);
                if (e.target.value !== "serving") {
                  setQuantity(100);
                  setServingLabel("");
                }
              }}
              className="w-full bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg"
            >
              <option value="grams">Grams (per 100g)</option>
              <option value="ml">Milliliters (per 100ml)</option>
              <option value="serving">Serving (e.g., 1 egg)</option>
            </select>
          </div>

          {/* Serving Details */}
          {quantityType === "serving" && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-2 text-gray-300">Serving Label</label>
                <select
                  value={servingLabel}
                  onChange={(e) => setServingLabel(e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg"
                  required
                >
                  <option value="">Select size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-2 text-gray-300">Grams per Serving</label>
                <input
                  type="number"
                  min={1}
                  value={quantity === "" ? "" : quantity}
                  onChange={(e) => setQuantity(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg"
                  placeholder="e.g. 45"
                  required
                />
              </div>
            </div>
          )}

          {/* Macronutrients */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center space-x-2 font-medium mb-2 text-gray-300">
                <Flame className="w-4 h-4 text-yellow-400" />
                <span>Calories (kcal)</span>
              </label>
              <input
                type="number"
                min={0}
                value={calories}
                onChange={(e) => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 font-medium mb-2 text-gray-300">
                <Beef className="w-4 h-4 text-red-300" />
                <span>Protein (g)</span>
              </label>
              <input
                type="number"
                min={0}
                value={protein}
                onChange={(e) => setProtein(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 font-medium mb-2 text-gray-300">
                <Wheat className="w-4 h-4 text-yellow-300" />
                <span>Carbs (g)</span>
              </label>
              <input
                type="number"
                min={0}
                value={carbs}
                onChange={(e) => setCarbs(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 font-medium mb-2 text-gray-300">
                <Milk className="w-4 h-4 text-amber-300" />
                <span>Fats (g)</span>
              </label>
              <input
                type="number"
                min={0}
                value={fats}
                onChange={(e) => setFats(e.target.value === "" ? "" : Number(e.target.value))}
                className="w-full bg-gray-800/50 border border-gray-700 text-white p-3 rounded-lg"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500/90 text-white px-5 py-3 rounded-xl hover:bg-blue-600/90 font-medium transition-all duration-300 hover:scale-[1.02] mt-4 flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Save Food Item</span>
          </button>
        </form>
      </div>
    </div>
  );
}
