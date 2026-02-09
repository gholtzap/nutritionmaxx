import type { NutrientFruit, NutrientKey, FruitCategory } from '../types';
import { ALL_CATEGORIES } from './nutrition-meta';

export interface CategoryAverage {
  category: FruitCategory;
  count: number;
  averages: Record<NutrientKey, number | null>;
}

function avg(values: (number | null)[]): number | null {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length === 0) return null;
  return valid.reduce((sum, v) => sum + v, 0) / valid.length;
}

export function computeCategoryAverages(
  fruits: NutrientFruit[],
  nutrientKeys: NutrientKey[]
): CategoryAverage[] {
  const grouped = new Map<FruitCategory, NutrientFruit[]>();

  for (const cat of ALL_CATEGORIES) {
    grouped.set(cat as FruitCategory, []);
  }

  for (const fruit of fruits) {
    const group = grouped.get(fruit.category);
    if (group) group.push(fruit);
  }

  const result: CategoryAverage[] = [];

  for (const [category, catFruits] of grouped) {
    const averages: Record<string, number | null> = {};

    for (const key of nutrientKeys) {
      const values = catFruits.map((f) => f[key] as number | null);
      averages[key] = avg(values);
    }

    result.push({
      category,
      count: catFruits.length,
      averages: averages as Record<NutrientKey, number | null>,
    });
  }

  return result;
}
