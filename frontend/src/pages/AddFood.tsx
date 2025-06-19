import React, { useState, useEffect } from "react";

type QuantityType = "ml" | "gram" | "serving";

interface Macros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface ServingMacros {
  [key: string]: Macros & { quantity: number }; // Dynamic serving labels
}

const AddFood: React.FC = () => {
  const [name, setName] = useState("");
  const [quantityType, setQuantityType] = useState<QuantityType>("gram");
  const [,setQuantity] = useState<number | null>(100);
  const [message, setMessage] = useState("");

  // Macros per 100 gm/ml for ml/gram type
  const [macros, setMacros] = useState<Macros>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // Serving labels and quantities
  const [servingLabels, setServingLabels] = useState<{label: string, quantity: number}[]>([
    { label: "Normal", quantity: 100 }
  ]);
  
  // Selected serving label for which macros are known
  const [selectedServingLabel, setSelectedServingLabel] = useState("Normal");
  
  // New serving label input
  const [newServingLabel, setNewServingLabel] = useState("");
  
  // Macros input for selected serving label
  const [servingMacros, setServingMacros] = useState<Macros>({
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  });

  // Calculated macros for all serving labels
  const [allServingMacros, setAllServingMacros] = useState<ServingMacros>({});

  // Recalculate macros when selected serving or macros or serving quantities change
  useEffect(() => {
    const baseServing = servingLabels.find(s => s.label === selectedServingLabel);
    if (!baseServing || baseServing.quantity <= 0) return;

    const newMacros: ServingMacros = {};

    servingLabels.forEach(serving => {
      const factor = serving.quantity / baseServing.quantity;
      newMacros[serving.label] = {
        calories: Math.round(servingMacros.calories * factor * 100) / 100,
        protein: Math.round(servingMacros.protein * factor * 100) / 100,
        carbs: Math.round(servingMacros.carbs * factor * 100) / 100,
        fat: Math.round(servingMacros.fat * factor * 100) / 100,
        quantity: serving.quantity,
      };
    });

    setAllServingMacros(newMacros);
  }, [selectedServingLabel, servingMacros, servingLabels]);

  useEffect(() => {
    if (quantityType === "serving") {
      setQuantity(null);
      setMessage(
        "Add serving labels and quantities. Set macros for one serving and others will be calculated."
      );
    } else {
      setQuantity(100);
      setMessage("Add macros for per 100 gm / ml");
    }
  }, [quantityType]);

  const handleMacroChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Macros,
    forServing = false
  ) => {
    const val = Number(e.target.value);
    if (forServing) {
      setServingMacros((prev) => ({ ...prev, [field]: val }));
    } else {
      setMacros((prev) => ({ ...prev, [field]: val }));
    }
  };

  const handleServingQuantityChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    label: string
  ) => {
    const val = Number(e.target.value);
    setServingLabels(prev => 
      prev.map(serving => 
        serving.label === label ? { ...serving, quantity: val } : serving
      )
    );
  };

  const addServingLabel = () => {
    if (!newServingLabel.trim()) {
      alert("Please enter a label name");
      return;
    }
    
    if (servingLabels.some(s => s.label === newServingLabel)) {
      alert("This label already exists");
      return;
    }
    
    setServingLabels([...servingLabels, { label: newServingLabel, quantity: 100 }]);
    setNewServingLabel("");
  };

  const removeServingLabel = (label: string) => {
    if (selectedServingLabel === label) {
      setSelectedServingLabel("Normal");
    }
    
    setServingLabels(servingLabels.filter(s => s.label !== label));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    if (quantityType === "serving") {
      // Validate serving quantities
      for (const serving of servingLabels) {
        if (serving.quantity <= 0) {
          alert(`Quantity for ${serving.label} must be greater than zero.`);
          return;
        }
      }

      try {
        // Convert to the expected servingLabel format
        const servingLabelObject: ServingMacros = {};
        servingLabels.forEach(serving => {
          const macros = allServingMacros[serving.label];
          servingLabelObject[serving.label] = {
            quantity: serving.quantity,
            calories: macros?.calories ?? 0,
            protein: macros?.protein ?? 0,
            carbs: macros?.carbs ?? 0,
            fat: macros?.fat ?? 0
          };
        });


        const response = await fetch("http://localhost:5000/api/add-food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            macros: null, // null for serving-based
            quantityType,
            quantity: null,
            servingLabel: servingLabelObject, // the object with serving label macros
          }),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Food item added successfully");
          resetForm();
        } else {
          alert(data.message || "Failed to add food item");
        }
      } catch (err) {
        alert("Server error");
      }
    } else {
      // Ml or Gram
      try {
        const response = await fetch("http://localhost:5000/api/add-food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            quantityType,
            quantity: 100,
            macros,
            servingLabel: null,
          }),
        });
        const data = await response.json();
        if (response.ok) {
          alert("Food item added successfully");
          resetForm();
        } else {
          alert(data.message || "Failed to add food item");
        }
      } catch (err) {
        alert("Server error");
      }
    }
  };

  const resetForm = () => {
    setName("");
    setQuantityType("gram");
    setQuantity(100);
    setMacros({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    setServingMacros({ calories: 0, protein: 0, carbs: 0, fat: 0 });
    setServingLabels([
      { label: "small", quantity: 30 },
      { label: "medium", quantity: 60 },
      { label: "large", quantity: 90 }
    ]);
    setSelectedServingLabel("medium");
    setNewServingLabel("");
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add Food Item</h2>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Food Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        {/* Quantity Type */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Quantity Type</label>
          <select
            value={quantityType}
            onChange={(e) => setQuantityType(e.target.value as QuantityType)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="ml">ml</option>
            <option value="gram">gram</option>
            <option value="serving">serving</option>
          </select>
        </div>

        {/* Quantity and Macros Section */}
        {quantityType !== "serving" ? (
          <>
            <p className="mb-2 text-sm text-gray-600">{message}</p>
            <p>Quantity fixed to 100 {quantityType}</p>
            <div className="mb-2 grid grid-cols-2 gap-2">
              <label>
                Calories:
                <input
                  type="number"
                  min={0}
                  value={macros.calories}
                  onChange={(e) => handleMacroChange(e, "calories")}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </label>
              <label>
                Protein:
                <input
                  type="number"
                  min={0}
                  value={macros.protein}
                  onChange={(e) => handleMacroChange(e, "protein")}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </label>
              <label>
                Carbs:
                <input
                  type="number"
                  min={0}
                  value={macros.carbs}
                  onChange={(e) => handleMacroChange(e, "carbs")}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </label>
              <label>
                Fat:
                <input
                  type="number"
                  min={0}
                  value={macros.fat}
                  onChange={(e) => handleMacroChange(e, "fat")}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </label>
            </div>
          </>
        ) : (
          <>
            <p className="mb-2 text-sm text-gray-600">{message}</p>

            {/* Serving Labels */}
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Serving Labels and Quantities</h4>
              
              {servingLabels.map((serving) => (
                <div key={serving.label} className="mb-2 flex items-center">
                  <div className="flex-1">
                    <label className="block mb-1 capitalize">
                      {serving.label} quantity (g/ml):
                    </label>
                    <div className="flex">
                      <input
                        type="number"
                        min={1}
                        value={serving.quantity}
                        onChange={(e) => handleServingQuantityChange(e, serving.label)}
                        className="w-full border rounded px-3 py-2"
                        required
                      />
                      {serving.label !== "Normal" && (
                        <button
                          type="button"
                          onClick={() => removeServingLabel(serving.label)}
                          className="ml-2 bg-red-500 text-white px-3 rounded"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex mt-2">
                <input
                  type="text"
                  value={newServingLabel}
                  onChange={(e) => setNewServingLabel(e.target.value)}
                  placeholder="New label name"
                  className="flex-1 border rounded px-3 py-2"
                />
                <button
                  type="button"
                  onClick={addServingLabel}
                  className="ml-2 bg-green-500 text-white px-3 rounded"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-1 font-medium">Select Serving Label with Known Macros</label>
              <select
                value={selectedServingLabel}
                onChange={(e) => setSelectedServingLabel(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                {servingLabels.map((serving) => (
                  <option key={serving.label} value={serving.label}>
                    {serving.label} ({serving.quantity} g/ml)
                  </option>
                ))}
              </select>
            </div>

            {/* Macros for selected serving */}
            <div className="mb-2 grid grid-cols-2 gap-2">
              <label>
                Calories ({selectedServingLabel}):
                <input
                  type="number"
                  min={0}
                  value={servingMacros.calories}
                  onChange={(e) => handleMacroChange(e, "calories", true)}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </label>
              <label>
                Protein ({selectedServingLabel}):
                <input
                  type="number"
                  min={0}
                  value={servingMacros.protein}
                  onChange={(e) => handleMacroChange(e, "protein", true)}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </label>
              <label>
                Carbs ({selectedServingLabel}):
                <input
                  type="number"
                  min={0}
                  value={servingMacros.carbs}
                  onChange={(e) => handleMacroChange(e, "carbs", true)}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </label>
              <label>
                Fat ({selectedServingLabel}):
                <input
                  type="number"
                  min={0}
                  value={servingMacros.fat}
                  onChange={(e) => handleMacroChange(e, "fat", true)}
                  className="w-full border rounded px-2 py-1"
                  required
                />
              </label>
            </div>

            {/* Calculated macros table */}
            <div className="mt-4">
              <h4 className="font-semibold mb-1">Calculated macros for all serving labels:</h4>
              <table className="table-auto border-collapse border border-gray-300 w-full">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 py-1">Serving</th>
                    <th className="border border-gray-300 px-2 py-1">Quantity</th>
                    <th className="border border-gray-300 px-2 py-1">Calories</th>
                    <th className="border border-gray-300 px-2 py-1">Protein</th>
                    <th className="border border-gray-300 px-2 py-1">Carbs</th>
                    <th className="border border-gray-300 px-2 py-1">Fat</th>
                  </tr>
                </thead>
                <tbody>
                  {servingLabels.map((serving) => (
                    <tr key={serving.label}>
                      <td className="border border-gray-300 px-2 py-1">{serving.label}</td>
                      <td className="border border-gray-300 px-2 py-1">{serving.quantity}g</td>
                      <td className="border border-gray-300 px-2 py-1">{allServingMacros[serving.label]?.calories || 0}</td>
                      <td className="border border-gray-300 px-2 py-1">{allServingMacros[serving.label]?.protein || 0}</td>
                      <td className="border border-gray-300 px-2 py-1">{allServingMacros[serving.label]?.carbs || 0}</td>
                      <td className="border border-gray-300 px-2 py-1">{allServingMacros[serving.label]?.fat || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        <button
          type="submit"
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
        >
          Add Food
        </button>
      </form>
    </div>
  );
};

export default AddFood;