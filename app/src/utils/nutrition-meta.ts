import type { NutrientKey, NutrientGroup, FruitCategory, VegetableCategory, SpiceCategory, ItemCategory } from '../types';

export interface NutrientMeta {
  key: NutrientKey;
  label: string;
  unit: string;
  decimals: number;
  group: NutrientGroup;
  dailyValue: number | null;
}

export const NUTRIENT_META: NutrientMeta[] = [
  { key: 'calories_kcal', label: 'Calories', unit: 'kcal', decimals: 0, group: 'macro', dailyValue: 2000 },
  { key: 'protein_g', label: 'Protein', unit: 'g', decimals: 2, group: 'macro', dailyValue: 50 },
  { key: 'fat_g', label: 'Fat', unit: 'g', decimals: 2, group: 'macro', dailyValue: 78 },
  { key: 'carbs_g', label: 'Carbs', unit: 'g', decimals: 1, group: 'macro', dailyValue: 275 },
  { key: 'fiber_g', label: 'Fiber', unit: 'g', decimals: 1, group: 'macro', dailyValue: 28 },
  { key: 'sugars_g', label: 'Sugars', unit: 'g', decimals: 1, group: 'macro', dailyValue: 50 },
  { key: 'water_g', label: 'Water', unit: 'g', decimals: 1, group: 'macro', dailyValue: null },

  { key: 'vitamin_a_mcg', label: 'Vitamin A', unit: 'mcg', decimals: 1, group: 'vitamin', dailyValue: 900 },
  { key: 'vitamin_b1_mg', label: 'Vitamin B1', unit: 'mg', decimals: 3, group: 'vitamin', dailyValue: 1.2 },
  { key: 'vitamin_b2_mg', label: 'Vitamin B2', unit: 'mg', decimals: 3, group: 'vitamin', dailyValue: 1.3 },
  { key: 'vitamin_b3_mg', label: 'Vitamin B3', unit: 'mg', decimals: 3, group: 'vitamin', dailyValue: 16 },
  { key: 'vitamin_b5_mg', label: 'Vitamin B5', unit: 'mg', decimals: 3, group: 'vitamin', dailyValue: 5 },
  { key: 'vitamin_b6_mg', label: 'Vitamin B6', unit: 'mg', decimals: 3, group: 'vitamin', dailyValue: 1.7 },
  { key: 'vitamin_b9_mcg', label: 'Folate (B9)', unit: 'mcg', decimals: 1, group: 'vitamin', dailyValue: 400 },
  { key: 'vitamin_b12_mcg', label: 'Vitamin B12', unit: 'mcg', decimals: 2, group: 'vitamin', dailyValue: 2.4 },
  { key: 'vitamin_c_mg', label: 'Vitamin C', unit: 'mg', decimals: 1, group: 'vitamin', dailyValue: 90 },
  { key: 'vitamin_d_mcg', label: 'Vitamin D', unit: 'mcg', decimals: 1, group: 'vitamin', dailyValue: 20 },
  { key: 'vitamin_e_mg', label: 'Vitamin E', unit: 'mg', decimals: 2, group: 'vitamin', dailyValue: 15 },
  { key: 'vitamin_k_mcg', label: 'Vitamin K', unit: 'mcg', decimals: 1, group: 'vitamin', dailyValue: 120 },

  { key: 'calcium_mg', label: 'Calcium', unit: 'mg', decimals: 1, group: 'mineral', dailyValue: 1300 },
  { key: 'iron_mg', label: 'Iron', unit: 'mg', decimals: 2, group: 'mineral', dailyValue: 18 },
  { key: 'magnesium_mg', label: 'Magnesium', unit: 'mg', decimals: 1, group: 'mineral', dailyValue: 420 },
  { key: 'phosphorus_mg', label: 'Phosphorus', unit: 'mg', decimals: 1, group: 'mineral', dailyValue: 1250 },
  { key: 'potassium_mg', label: 'Potassium', unit: 'mg', decimals: 1, group: 'mineral', dailyValue: 4700 },
  { key: 'sodium_mg', label: 'Sodium', unit: 'mg', decimals: 1, group: 'mineral', dailyValue: 2300 },
  { key: 'zinc_mg', label: 'Zinc', unit: 'mg', decimals: 2, group: 'mineral', dailyValue: 11 },
  { key: 'copper_mg', label: 'Copper', unit: 'mg', decimals: 3, group: 'mineral', dailyValue: 0.9 },
  { key: 'manganese_mg', label: 'Manganese', unit: 'mg', decimals: 3, group: 'mineral', dailyValue: 2.3 },
  { key: 'selenium_mcg', label: 'Selenium', unit: 'mcg', decimals: 1, group: 'mineral', dailyValue: 55 },
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
  Root: 'var(--cat-root)',
  'Leafy Green': 'var(--cat-leafy-green)',
  Cruciferous: 'var(--cat-cruciferous)',
  Legume: 'var(--cat-legume)',
  Allium: 'var(--cat-allium)',
  Nightshade: 'var(--cat-nightshade)',
  Squash: 'var(--cat-squash)',
  Herb: 'var(--cat-herb)',
  Seed: 'var(--cat-seed)',
  Pepper: 'var(--cat-pepper)',
  'Root/Bark': 'var(--cat-root-bark)',
  Other: 'var(--cat-other)',
};

export const FRUIT_CATEGORIES: FruitCategory[] = [
  'Pome', 'Citrus', 'Berry', 'Stone', 'Tropical', 'Melon', 'Grape', 'Other',
];

export const VEGETABLE_CATEGORIES: VegetableCategory[] = [
  'Root', 'Leafy Green', 'Cruciferous', 'Legume', 'Allium', 'Nightshade', 'Squash', 'Other',
];

export const SPICE_CATEGORIES: SpiceCategory[] = [
  'Herb', 'Seed', 'Pepper', 'Root/Bark', 'Other',
];

export const ALL_CATEGORIES: ItemCategory[] = [
  'Pome', 'Citrus', 'Berry', 'Stone', 'Tropical', 'Melon', 'Grape',
  'Root', 'Leafy Green', 'Cruciferous', 'Legume', 'Allium', 'Nightshade', 'Squash',
  'Herb', 'Seed', 'Pepper', 'Root/Bark',
  'Other',
];

export function hasDailyValue(key: NutrientKey): boolean {
  const meta = NUTRIENT_MAP.get(key);
  return meta?.dailyValue !== null && meta?.dailyValue !== undefined;
}
