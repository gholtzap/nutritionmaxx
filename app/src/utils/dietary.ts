import type { NutrientFruit } from '../types';

export type DietaryPreference =
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian'
  | 'halal'
  | 'kosher'
  | 'nut_free'
  | 'peanut_free'
  | 'shellfish_free'
  | 'soy_free'
  | 'gluten_free'
  | 'fish_free';

export type DietaryPreferences = Record<DietaryPreference, boolean>;

export const DEFAULT_PREFERENCES: DietaryPreferences = {
  vegetarian: false,
  vegan: false,
  pescatarian: false,
  halal: false,
  kosher: false,
  nut_free: false,
  peanut_free: false,
  shellfish_free: false,
  soy_free: false,
  gluten_free: false,
  fish_free: false,
};

const MEAT_TYPES = new Set(['beef', 'pork', 'poultry', 'fish_seafood']);
const LAND_MEAT_TYPES = new Set(['beef', 'pork', 'poultry']);
const BUTTER_NAMES = new Set(['Butter (Salted)', 'Butter (Unsalted)']);
const COCONUT_NAMES = new Set(['Coconut', 'Coconut Oil', 'Coconut Cream', 'Walnut Oil']);
const GLUTEN_NAMES = new Set(['Barley', 'Rye', 'Oats', 'Oat Bran', 'Spelt', 'Bulgur']);

export const EXCLUSION_RULES: Record<DietaryPreference, (item: NutrientFruit) => boolean> = {
  vegetarian: (item) => MEAT_TYPES.has(item.type) || item.name === 'Lard',
  vegan: (item) => MEAT_TYPES.has(item.type) || item.name === 'Lard' || BUTTER_NAMES.has(item.name),
  pescatarian: (item) => LAND_MEAT_TYPES.has(item.type) || item.name === 'Lard',
  halal: (item) => item.type === 'pork' || item.name === 'Lard',
  kosher: (item) =>
    item.type === 'pork' ||
    item.category === 'Crustacean' ||
    item.category === 'Mollusk' ||
    item.name === 'Lard',
  nut_free: (item) =>
    item.category === 'Tree Nut' || COCONUT_NAMES.has(item.name),
  peanut_free: (item) => item.category === 'Legume Nut' || item.name === 'Peanut Oil',
  shellfish_free: (item) => item.category === 'Crustacean' || item.category === 'Mollusk',
  soy_free: (item) => item.category === 'Soy' || item.name === 'Soybean Oil',
  gluten_free: (item) => item.category === 'Wheat' || GLUTEN_NAMES.has(item.name),
  fish_free: (item) => item.category === 'Fish',
};

export function isItemExcluded(item: NutrientFruit, preferences: DietaryPreferences): boolean {
  for (const key of Object.keys(preferences) as DietaryPreference[]) {
    if (preferences[key] && EXCLUSION_RULES[key](item)) return true;
  }
  return false;
}

export function countExcluded(fruits: NutrientFruit[], preferences: DietaryPreferences): number {
  let count = 0;
  for (const fruit of fruits) {
    if (isItemExcluded(fruit, preferences)) count++;
  }
  return count;
}

export function countExcludedByRule(
  fruits: NutrientFruit[],
  key: DietaryPreference
): number {
  let count = 0;
  const rule = EXCLUSION_RULES[key];
  for (const fruit of fruits) {
    if (rule(fruit)) count++;
  }
  return count;
}

export interface DietaryOption {
  key: DietaryPreference;
  label: string;
  group: 'diet' | 'allergy';
  description: string;
}

export const DIETARY_OPTIONS: DietaryOption[] = [
  { key: 'vegetarian', label: 'Vegetarian', group: 'diet', description: 'Excludes meat and fish' },
  { key: 'vegan', label: 'Vegan', group: 'diet', description: 'Excludes all animal products' },
  { key: 'pescatarian', label: 'Pescatarian', group: 'diet', description: 'Excludes land meats' },
  { key: 'halal', label: 'Halal', group: 'diet', description: 'Excludes pork products' },
  { key: 'kosher', label: 'Kosher', group: 'diet', description: 'Excludes pork and shellfish' },
  { key: 'nut_free', label: 'Tree Nut Free', group: 'allergy', description: 'Excludes tree nuts and coconut' },
  { key: 'peanut_free', label: 'Peanut Free', group: 'allergy', description: 'Excludes peanuts and peanut oil' },
  { key: 'shellfish_free', label: 'Shellfish Free', group: 'allergy', description: 'Excludes crustaceans and mollusks' },
  { key: 'soy_free', label: 'Soy Free', group: 'allergy', description: 'Excludes soy products' },
  { key: 'gluten_free', label: 'Gluten Free', group: 'allergy', description: 'Excludes wheat, barley, rye, oats' },
  { key: 'fish_free', label: 'Fish Free', group: 'allergy', description: 'Excludes fish' },
];
