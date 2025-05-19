type Gender = 'male' | 'female';
type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';

interface UserInput {
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
  activityLevel: ActivityLevel;
  goal: 'maintain' | 'lose' | 'gain';
}

export function calculateBMR({ age, gender, height, weight }: UserInput): number {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very active': 1.9,
  };
  return bmr * activityMultipliers[activityLevel];
}

export function adjustCaloriesForGoal(tdee: number, goal: UserInput['goal']): number {
  switch (goal) {
    case 'lose': return tdee - 500;
    case 'gain': return tdee + 500;
    default: return tdee;
  }
}

export function calculateMacros(calories: number) {
  const proteinCalories = 0.3 * calories;
  const fatCalories = 0.25 * calories;
  const carbCalories = 0.45 * calories;

  return {
    protein: Math.round(proteinCalories / 4), // 4 kcal/g
    fat: Math.round(fatCalories / 9),         // 9 kcal/g
    carbs: Math.round(carbCalories / 4),      // 4 kcal/g
  };
}
