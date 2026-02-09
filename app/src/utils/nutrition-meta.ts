import type { NutrientKey, NutrientGroup } from '../types';

export interface NutrientMeta {
  key: NutrientKey;
  label: string;
  unit: string;
  decimals: number;
  group: NutrientGroup;
}

export const NUTRIENT_META: NutrientMeta[] = [
  { key: 'calories_kcal', label: 'Calories', unit: 'kcal', decimals: 0, group: 'macro' },
  { key: 'protein_g', label: 'Protein', unit: 'g', decimals: 2, group: 'macro' },
  { key: 'fat_g', label: 'Fat', unit: 'g', decimals: 2, group: 'macro' },
  { key: 'carbs_g', label: 'Carbs', unit: 'g', decimals: 1, group: 'macro' },
  { key: 'fiber_g', label: 'Fiber', unit: 'g', decimals: 1, group: 'macro' },
  { key: 'sugars_g', label: 'Sugars', unit: 'g', decimals: 1, group: 'macro' },
  { key: 'water_g', label: 'Water', unit: 'g', decimals: 1, group: 'macro' },

  { key: 'vitamin_a_mcg', label: 'Vitamin A', unit: 'mcg', decimals: 1, group: 'vitamin' },
  { key: 'vitamin_b1_mg', label: 'Vitamin B1', unit: 'mg', decimals: 3, group: 'vitamin' },
  { key: 'vitamin_b2_mg', label: 'Vitamin B2', unit: 'mg', decimals: 3, group: 'vitamin' },
  { key: 'vitamin_b3_mg', label: 'Vitamin B3', unit: 'mg', decimals: 3, group: 'vitamin' },
  { key: 'vitamin_b5_mg', label: 'Vitamin B5', unit: 'mg', decimals: 3, group: 'vitamin' },
  { key: 'vitamin_b6_mg', label: 'Vitamin B6', unit: 'mg', decimals: 3, group: 'vitamin' },
  { key: 'vitamin_b9_mcg', label: 'Folate (B9)', unit: 'mcg', decimals: 1, group: 'vitamin' },
  { key: 'vitamin_b12_mcg', label: 'Vitamin B12', unit: 'mcg', decimals: 2, group: 'vitamin' },
  { key: 'vitamin_c_mg', label: 'Vitamin C', unit: 'mg', decimals: 1, group: 'vitamin' },
  { key: 'vitamin_d_mcg', label: 'Vitamin D', unit: 'mcg', decimals: 1, group: 'vitamin' },
  { key: 'vitamin_e_mg', label: 'Vitamin E', unit: 'mg', decimals: 2, group: 'vitamin' },
  { key: 'vitamin_k_mcg', label: 'Vitamin K', unit: 'mcg', decimals: 1, group: 'vitamin' },

  { key: 'calcium_mg', label: 'Calcium', unit: 'mg', decimals: 1, group: 'mineral' },
  { key: 'iron_mg', label: 'Iron', unit: 'mg', decimals: 2, group: 'mineral' },
  { key: 'magnesium_mg', label: 'Magnesium', unit: 'mg', decimals: 1, group: 'mineral' },
  { key: 'phosphorus_mg', label: 'Phosphorus', unit: 'mg', decimals: 1, group: 'mineral' },
  { key: 'potassium_mg', label: 'Potassium', unit: 'mg', decimals: 1, group: 'mineral' },
  { key: 'sodium_mg', label: 'Sodium', unit: 'mg', decimals: 1, group: 'mineral' },
  { key: 'zinc_mg', label: 'Zinc', unit: 'mg', decimals: 2, group: 'mineral' },
  { key: 'copper_mg', label: 'Copper', unit: 'mg', decimals: 3, group: 'mineral' },
  { key: 'manganese_mg', label: 'Manganese', unit: 'mg', decimals: 3, group: 'mineral' },
  { key: 'selenium_mcg', label: 'Selenium', unit: 'mcg', decimals: 1, group: 'mineral' },
];

export const NUTRIENT_MAP = new Map(
  NUTRIENT_META.map((m) => [m.key, m])
);

export const MACRO_KEYS: NutrientKey[] = NUTRIENT_META
  .filter((m) => m.group === 'macro')
  .map((m) => m.key);

export const VITAMIN_KEYS: NutrientKey[] = NUTRIENT_META
  .filter((m) => m.group === 'vitamin')
  .map((m) => m.key);

export const MINERAL_KEYS: NutrientKey[] = NUTRIENT_META
  .filter((m) => m.group === 'mineral')
  .map((m) => m.key);

export const DEFAULT_VISIBLE_COLUMNS: Set<NutrientKey> = new Set(MACRO_KEYS);

export const CATEGORY_COLORS: Record<string, string> = {
  Pome: 'var(--cat-pome)',
  Citrus: 'var(--cat-citrus)',
  Berry: 'var(--cat-berry)',
  Stone: 'var(--cat-stone)',
  Tropical: 'var(--cat-tropical)',
  Melon: 'var(--cat-melon)',
  Grape: 'var(--cat-grape)',
  Other: 'var(--cat-other)',
};

export const ALL_CATEGORIES = [
  'Pome', 'Citrus', 'Berry', 'Stone', 'Tropical', 'Melon', 'Grape', 'Other',
] as const;
