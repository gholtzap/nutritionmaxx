import type { NutrientFruit, NutrientKey } from '../types';

export function computeNutrientDensityScore(
  item: NutrientFruit,
  selectedNutrients: Set<NutrientKey>,
  dvMap: Map<NutrientKey, number | null>
): number | null {
  const calories = item.calories_kcal;
  if (calories === null || calories === 0) return null;

  let sum = 0;
  let count = 0;

  for (const key of selectedNutrients) {
    const value = item[key];
    if (value === null) continue;
    const dv = dvMap.get(key);
    if (dv === null || dv === undefined || dv === 0) continue;
    sum += (value / dv) * 100;
    count++;
  }

  if (count === 0) return null;

  return (sum / count) * (100 / calories);
}
