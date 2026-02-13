export type ItemType = 'fruit' | 'vegetable' | 'spice' | 'nut_seed' | 'legume' | 'grain' | 'fish_seafood' | 'poultry' | 'beef' | 'pork' | 'fat_oil';

export type FruitCategory =
  | 'Pome'
  | 'Citrus'
  | 'Berry'
  | 'Stone'
  | 'Tropical'
  | 'Melon'
  | 'Grape'
  | 'Other';

export type VegetableCategory =
  | 'Root'
  | 'Leafy Green'
  | 'Cruciferous'
  | 'Legume'
  | 'Allium'
  | 'Nightshade'
  | 'Squash'
  | 'Other';

export type SpiceCategory =
  | 'Herb'
  | 'Seed'
  | 'Pepper'
  | 'Root/Bark'
  | 'Other';

export type NutSeedCategory =
  | 'Tree Nut'
  | 'Seed'
  | 'Legume Nut';

export type LegumeCategory =
  | 'Bean'
  | 'Lentil'
  | 'Pea'
  | 'Soy';

export type GrainCategory =
  | 'Rice'
  | 'Wheat'
  | 'Ancient Grain'
  | 'Other';

export type FishSeafoodCategory =
  | 'Fish'
  | 'Crustacean'
  | 'Mollusk';

export type PoultryCategory =
  | 'Chicken'
  | 'Turkey'
  | 'Other Poultry';

export type BeefCategory =
  | 'Ground'
  | 'Steak'
  | 'Other Cut';

export type PorkCategory =
  | 'Loin'
  | 'Shoulder'
  | 'Other Cut';

export type FatOilCategory =
  | 'Plant Oil'
  | 'Nut & Seed Oil'
  | 'Animal Fat'
  | 'Processed';

export type ItemCategory = FruitCategory | VegetableCategory | SpiceCategory | NutSeedCategory | LegumeCategory | GrainCategory | FishSeafoodCategory | PoultryCategory | BeefCategory | PorkCategory | FatOilCategory;

export type NutrientKey =
  | 'calories_kcal'
  | 'protein_g'
  | 'fat_g'
  | 'carbs_g'
  | 'fiber_g'
  | 'sugars_g'
  | 'water_g'
  | 'vitamin_a_mcg'
  | 'vitamin_b1_mg'
  | 'vitamin_b2_mg'
  | 'vitamin_b3_mg'
  | 'vitamin_b5_mg'
  | 'vitamin_b6_mg'
  | 'vitamin_b9_mcg'
  | 'vitamin_b12_mcg'
  | 'vitamin_c_mg'
  | 'vitamin_d_mcg'
  | 'vitamin_e_mg'
  | 'vitamin_k_mcg'
  | 'calcium_mg'
  | 'iron_mg'
  | 'magnesium_mg'
  | 'phosphorus_mg'
  | 'potassium_mg'
  | 'sodium_mg'
  | 'zinc_mg'
  | 'copper_mg'
  | 'manganese_mg'
  | 'selenium_mcg';

export interface Fruit {
  name: string;
  type: ItemType;
  category: ItemCategory;
  fdc_id: string;
  serving_size_g: number | null;
  serving_label: string | null;
  [key: string]: string | ItemType | ItemCategory | number | null;
}

export type NutrientFruit = Fruit & {
  [K in NutrientKey]: number | null;
};

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export type ViewId = 'table' | 'comparison' | 'categories' | 'nutrients' | 'planner' | 'dietary' | 'settings';

export type NutrientGroup = 'macro' | 'vitamin' | 'mineral';

export interface PlanEntry {
  name: string;
  servingsPerWeek: number;
}
