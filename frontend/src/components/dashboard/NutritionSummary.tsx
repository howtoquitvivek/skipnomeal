// src/components/NutritionSummary.tsx
import React from "react";

type Nutrition = {
  label: string;
  value: number;
  goal: number;
  unit?: string;
  color?: string;
};

interface Props {
  data: Nutrition[];
}

const NutritionSummary: React.FC<Props> = ({ data }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {data.map(({ label, value, goal, unit = "g", color = "blue" }, i) => {
        const percentage = Math.min((value / goal) * 100, 100);

        return (
          <div
            key={i}
            className="p-4 bg-white rounded-xl shadow-md border border-gray-100"
          >
            <h4 className="text-sm font-semibold mb-2 text-gray-600">{label}</h4>
            <div className="text-xl font-bold text-gray-900">
              {value} / {goal} {unit}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full bg-${color}-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NutritionSummary;
