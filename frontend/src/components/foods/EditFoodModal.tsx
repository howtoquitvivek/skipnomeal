import { useState } from "react";

type EditFoodModalProps = {
  food: {
    _id: string;
    name: string;
    carbs: number;
    protein: number;
    fats: number;
    calories: number;
  };
  onClose: () => void;
  onSave: (updatedFood: any) => void;
};

export default function EditFoodModal({ food, onClose, onSave }: EditFoodModalProps) {
  const [formData, setFormData] = useState({ ...food });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/edit-food/${food._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updated = await res.json();
        onSave(updated);
        onClose();
      } else {
        console.error("Failed to update food");
      }
    } catch (err) {
      console.error("Error updating food:", err);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md text-white space-y-4">
        <h2 className="text-xl font-semibold">Edit Food</h2>
        {["name", "calories", "protein", "carbs", "fats"].map((field) => (
          <div key={field} className="flex flex-col">
            <label className="text-sm capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              className="p-2 rounded bg-gray-700 text-white"
            />
          </div>
        ))}
        <div className="flex justify-end space-x-3">
          <button onClick={onClose} className="text-gray-300 hover:text-gray-100">Cancel</button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
