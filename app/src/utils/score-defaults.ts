import type { NutrientKey } from '../types';
import { NUTRIENT_META } from './nutrition-meta';

const EXCLUDED: Set<NutrientKey> = new Set([
  'calories_kcal',
  'water_g',
  'fat_g',
  'carbs_g',
  'sugars_g',
  'sodium_mg',
]);

export const DEFAULT_SCORE_NUTRIENTS: Set<NutrientKey> = new Set(
  NUTRIENT_META
    .filter((m) => m.dailyValue !== null && !EXCLUDED.has(m.key))
    .map((m) => m.key)
);
