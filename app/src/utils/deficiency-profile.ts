import type { NutrientKey, NutrientFruit } from '../types';
import { NUTRIENT_META } from './nutrition-meta';

export type BiologicalSex = 'male' | 'female';
export type AgeRange = '19-30' | '31-50' | '51+';
export type DietPattern = 'omnivore' | 'pescatarian' | 'vegetarian' | 'vegan';
export type HealthFocus = 'heart' | 'bone' | 'energy' | 'gut' | 'immune';
export type PregnancyStatus = 'pregnant' | 'breastfeeding';
export type LifestyleFactor = 'smoker' | 'alcohol' | 'caffeine';
export type Symptom = 'fatigue' | 'cramps' | 'bruising' | 'colds';
export type FamilyCondition = 'osteoporosis' | 'heart_disease' | 'neurodegeneration' | 'diabetes';

export interface WizardAnswers {
  sex: BiologicalSex;
  ageRange: AgeRange;
  dietPattern: DietPattern;
  healthFocus: HealthFocus[];
  pregnancyStatus: PregnancyStatus | null;
  lifestyleFactors: LifestyleFactor[];
  symptoms: Symptom[];
  familyHistory: FamilyCondition[];
}

export interface ScoredFood {
  food: NutrientFruit;
  score: number;
  topNutrients: { key: NutrientKey; label: string; percentDV: number }[];
}

type DeficiencyWeights = Map<NutrientKey, number>;

const BASELINE_WEIGHTS: Partial<Record<NutrientKey, number>> = {
  fiber_g: 0.3,
  potassium_mg: 0.3,
  magnesium_mg: 0.25,
  vitamin_e_mg: 0.2,
  vitamin_c_mg: 0.15,
  calcium_mg: 0.2,
  vitamin_a_mcg: 0.15,
};

const DIET_PATTERN_WEIGHTS: Record<DietPattern, Partial<Record<NutrientKey, number>>> = {
  omnivore: {},
  pescatarian: {
    iron_mg: 0.15,
    zinc_mg: 0.1,
  },
  vegetarian: {
    vitamin_b12_mcg: 0.4,
    iron_mg: 0.3,
    zinc_mg: 0.2,
    calcium_mg: 0.15,
    protein_g: 0.15,
    selenium_mcg: 0.1,
  },
  vegan: {
    vitamin_b12_mcg: 0.6,
    iron_mg: 0.35,
    zinc_mg: 0.3,
    calcium_mg: 0.3,
    protein_g: 0.25,
    selenium_mcg: 0.2,
    vitamin_b2_mg: 0.15,
  },
};

const SEX_AGE_WEIGHTS: Record<string, Partial<Record<NutrientKey, number>>> = {
  'female:19-30': { iron_mg: 0.3, vitamin_b9_mcg: 0.2 },
  'female:31-50': { iron_mg: 0.3, vitamin_b9_mcg: 0.2 },
  'female:51+': { vitamin_b12_mcg: 0.2, calcium_mg: 0.2 },
  'male:51+': { vitamin_b12_mcg: 0.15, calcium_mg: 0.15 },
};

const HEALTH_FOCUS_WEIGHTS: Record<HealthFocus, Partial<Record<NutrientKey, number>>> = {
  heart: {
    potassium_mg: 0.3,
    magnesium_mg: 0.25,
    fiber_g: 0.2,
    vitamin_b9_mcg: 0.15,
  },
  bone: {
    calcium_mg: 0.35,
    vitamin_k_mcg: 0.25,
    magnesium_mg: 0.2,
    phosphorus_mg: 0.1,
  },
  energy: {
    iron_mg: 0.3,
    vitamin_b12_mcg: 0.25,
    vitamin_b6_mg: 0.2,
    magnesium_mg: 0.15,
    vitamin_b1_mg: 0.15,
  },
  gut: {
    fiber_g: 0.4,
    magnesium_mg: 0.15,
    potassium_mg: 0.1,
  },
  immune: {
    vitamin_c_mg: 0.35,
    zinc_mg: 0.25,
    vitamin_a_mcg: 0.2,
    selenium_mcg: 0.15,
    vitamin_e_mg: 0.1,
  },
};

const PREGNANCY_WEIGHTS: Record<PregnancyStatus, Partial<Record<NutrientKey, number>>> = {
  pregnant: {
    vitamin_b9_mcg: 0.4,
    iron_mg: 0.35,
    calcium_mg: 0.25,
    zinc_mg: 0.2,
  },
  breastfeeding: {
    calcium_mg: 0.3,
    vitamin_b9_mcg: 0.3,
    vitamin_a_mcg: 0.2,
    zinc_mg: 0.2,
  },
};

const LIFESTYLE_WEIGHTS: Record<LifestyleFactor, Partial<Record<NutrientKey, number>>> = {
  smoker: {
    vitamin_c_mg: 0.3,
    vitamin_e_mg: 0.15,
    vitamin_a_mcg: 0.1,
  },
  alcohol: {
    vitamin_b1_mg: 0.25,
    vitamin_b9_mcg: 0.2,
    magnesium_mg: 0.15,
    zinc_mg: 0.1,
  },
  caffeine: {
    iron_mg: 0.2,
    calcium_mg: 0.2,
    magnesium_mg: 0.1,
  },
};

const SYMPTOM_WEIGHTS: Record<Symptom, Partial<Record<NutrientKey, number>>> = {
  fatigue: {
    iron_mg: 0.25,
    vitamin_b12_mcg: 0.25,
    vitamin_b6_mg: 0.15,
    magnesium_mg: 0.1,
  },
  cramps: {
    magnesium_mg: 0.3,
    potassium_mg: 0.25,
    calcium_mg: 0.2,
  },
  bruising: {
    vitamin_c_mg: 0.3,
    vitamin_k_mcg: 0.25,
  },
  colds: {
    vitamin_c_mg: 0.25,
    zinc_mg: 0.2,
    vitamin_a_mcg: 0.15,
    selenium_mcg: 0.1,
  },
};

const FAMILY_HISTORY_WEIGHTS: Record<FamilyCondition, Partial<Record<NutrientKey, number>>> = {
  osteoporosis: {
    calcium_mg: 0.3,
    vitamin_k_mcg: 0.2,
    magnesium_mg: 0.15,
    phosphorus_mg: 0.1,
  },
  heart_disease: {
    potassium_mg: 0.25,
    magnesium_mg: 0.2,
    fiber_g: 0.2,
    vitamin_b9_mcg: 0.15,
  },
  neurodegeneration: {
    vitamin_e_mg: 0.25,
    vitamin_b9_mcg: 0.2,
    vitamin_b12_mcg: 0.2,
    vitamin_b6_mg: 0.15,
  },
  diabetes: {
    fiber_g: 0.3,
    magnesium_mg: 0.25,
    potassium_mg: 0.15,
    zinc_mg: 0.1,
  },
};

const OMEGA3_BONUS_FOODS = new Set([
  'Flaxseed', 'Chia Seeds', 'Walnuts', 'Hemp Seeds',
  'Salmon', 'Sardines', 'Mackerel', 'Trout', 'Herring',
]);

const UNCOMMON_DISCOUNT: Record<string, number> = {
  'Beef Liver': 0.25,
  'Chicken Liver': 0.25,
  'Pork Liver': 0.25,
  'Duck': 0.4,
  'Duck Egg': 0.4,
  'Cornish Hen': 0.4,
  'Pawpaw': 0.4,
  'Teff': 0.4,
  'Amaranth': 0.5,
  'Sorghum': 0.5,
  'Rutabaga': 0.5,
  'Tomatillo': 0.5,
  'Squid': 0.5,
  'Mussel': 0.5,
  'Oyster': 0.5,
  'Herring': 0.6,
  'Anchovy': 0.6,
  'Mackerel': 0.6,
  'Soybean': 0.5,
  'Adzuki Bean': 0.6,
  'Fava Bean': 0.6,
  'Mung Bean': 0.6,
};

const EXCLUDED_NUTRIENTS: Set<NutrientKey> = new Set([
  'vitamin_d_mcg', 'sodium_mg', 'water_g', 'sugars_g',
  'calories_kcal', 'fat_g', 'carbs_g',
]);

function addWeights(
  target: DeficiencyWeights,
  source: Partial<Record<NutrientKey, number>>
): void {
  for (const [key, value] of Object.entries(source)) {
    const k = key as NutrientKey;
    if (EXCLUDED_NUTRIENTS.has(k)) continue;
    target.set(k, Math.min(1, (target.get(k) ?? 0) + value));
  }
}

export function buildDeficiencyProfile(answers: WizardAnswers): DeficiencyWeights {
  const weights: DeficiencyWeights = new Map();

  addWeights(weights, BASELINE_WEIGHTS);
  addWeights(weights, DIET_PATTERN_WEIGHTS[answers.dietPattern]);

  const sexAgeKey = `${answers.sex}:${answers.ageRange}`;
  if (SEX_AGE_WEIGHTS[sexAgeKey]) {
    addWeights(weights, SEX_AGE_WEIGHTS[sexAgeKey]);
  }

  for (const focus of answers.healthFocus) {
    addWeights(weights, HEALTH_FOCUS_WEIGHTS[focus]);
  }

  if (answers.pregnancyStatus) {
    addWeights(weights, PREGNANCY_WEIGHTS[answers.pregnancyStatus]);
  }

  for (const factor of answers.lifestyleFactors) {
    addWeights(weights, LIFESTYLE_WEIGHTS[factor]);
  }

  for (const symptom of answers.symptoms) {
    addWeights(weights, SYMPTOM_WEIGHTS[symptom]);
  }

  for (const condition of answers.familyHistory) {
    addWeights(weights, FAMILY_HISTORY_WEIGHTS[condition]);
  }

  return weights;
}

export function getTopDeficiencies(
  profile: DeficiencyWeights,
  count: number
): { key: NutrientKey; label: string; weight: number }[] {
  const meta = new Map(NUTRIENT_META.map((m) => [m.key, m]));
  return [...profile.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([key, weight]) => ({
      key,
      label: meta.get(key)?.label ?? key,
      weight,
    }));
}

const DV_MAP = new Map(
  NUTRIENT_META.filter((m) => m.dailyValue !== null).map((m) => [m.key, m.dailyValue!])
);

const META_MAP = new Map(NUTRIENT_META.map((m) => [m.key, m]));

function getPercentDV(food: NutrientFruit, key: NutrientKey, servingMultiplier: number): number {
  const raw = food[key] as number | null;
  if (raw === null) return 0;
  const dv = DV_MAP.get(key);
  if (!dv) return 0;
  return (raw * servingMultiplier / dv) * 100;
}

export function scoreFoodsForDeficiencies(
  foods: NutrientFruit[],
  profile: DeficiencyWeights,
  maxResults: number = 3
): ScoredFood[] {
  const eligible = foods.filter((f) => f.type !== 'spice' && f.type !== 'fat_oil');

  const scored: { food: NutrientFruit; score: number; nutrients: { key: NutrientKey; pctDV: number }[] }[] = [];

  for (const food of eligible) {
    const servingG = food.serving_size_g ?? 100;
    const multiplier = servingG / 100;
    let score = 0;
    const nutrients: { key: NutrientKey; pctDV: number }[] = [];

    for (const [key, weight] of profile) {
      const pctDV = getPercentDV(food, key, multiplier);
      if (pctDV > 0) {
        score += (pctDV / 100) * weight;
        nutrients.push({ key, pctDV });
      }
    }

    if (OMEGA3_BONUS_FOODS.has(food.name)) {
      score += 0.15;
    }

    const discount = UNCOMMON_DISCOUNT[food.name];
    if (discount !== undefined) {
      score *= discount;
    }

    if (score > 0.05) {
      scored.push({ food, score, nutrients });
    }
  }

  scored.sort((a, b) => b.score - a.score);

  const results: ScoredFood[] = [];
  const usedTypes = new Set<string>();

  for (const item of scored) {
    if (results.length >= maxResults) break;

    let adjustedScore = item.score;
    if (usedTypes.has(item.food.type)) {
      adjustedScore *= 0.6;
    }

    if (adjustedScore < 0.05) continue;

    const topNutrients = item.nutrients
      .sort((a, b) => b.pctDV - a.pctDV)
      .slice(0, 4)
      .map((n) => ({
        key: n.key,
        label: META_MAP.get(n.key)?.label ?? n.key,
        percentDV: Math.round(n.pctDV),
      }));

    results.push({ food: item.food, score: adjustedScore, topNutrients });
    usedTypes.add(item.food.type);
  }

  return results;
}

export function shouldShowB12Note(answers: WizardAnswers): boolean {
  return answers.dietPattern === 'vegan';
}
