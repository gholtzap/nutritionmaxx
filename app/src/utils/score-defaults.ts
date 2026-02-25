import type { NutrientKey } from '../types';
import { NUTRIENT_META } from './nutrition-meta';

export interface ScoreConfig {
  penaltyNutrients: Set<NutrientKey>;
  weights: Map<NutrientKey, number>;
  minNutrientCount: number;
}

const EXCLUDED: Set<NutrientKey> = new Set([
  'calories_kcal',
  'water_g',
  'fat_g',
  'carbs_g',
]);

export const DEFAULT_PENALTY_NUTRIENTS: Set<NutrientKey> = new Set([
  'sodium_mg',
  'sugars_g',
]);

export const DEFAULT_DEFICIENCY_WEIGHTS: Map<NutrientKey, number> = new Map([
  ['potassium_mg', 2],
  ['fiber_g', 2],
  ['vitamin_d_mcg', 1.5],
  ['calcium_mg', 1.5],
  ['iron_mg', 1.5],
]);

export const MIN_NUTRIENT_COUNT = 10;

export const DEFAULT_SCORE_NUTRIENTS: Set<NutrientKey> = new Set(
  NUTRIENT_META
    .filter((m) => m.dailyValue !== null && !EXCLUDED.has(m.key) && !DEFAULT_PENALTY_NUTRIENTS.has(m.key))
    .map((m) => m.key)
);

export const DEFAULT_SCORE_CONFIG: ScoreConfig = {
  penaltyNutrients: DEFAULT_PENALTY_NUTRIENTS,
  weights: DEFAULT_DEFICIENCY_WEIGHTS,
  minNutrientCount: MIN_NUTRIENT_COUNT,
};
