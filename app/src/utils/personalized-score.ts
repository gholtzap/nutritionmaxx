import type { NutrientKey, PersonalizationSettings, HealthGoal, ActivityLevel, LifeStage, DietaryPattern } from '../types';
import type { ScoreConfig } from './score-defaults';
import type { UserProfile } from './daily-values';
import type { DietaryPreferences } from './dietary';

const WEIGHT_CAP = 3.0;

export const DEFAULT_PERSONALIZATION: PersonalizationSettings = {
  healthGoals: [],
  activityLevel: 'sedentary',
  lifeStage: 'default',
  dietaryPattern: 'general',
};

type WeightTable = Partial<Record<NutrientKey, number>>;

const SEX_WEIGHTS: Record<'male' | 'female_pre' | 'female_post', WeightTable> = {
  male: { zinc_mg: 1.1 },
  female_pre: { iron_mg: 1.3, calcium_mg: 1.2 },
  female_post: {},
};

const AGE_WEIGHTS: Record<'young' | 'middle' | 'senior', WeightTable> = {
  young: { magnesium_mg: 1.1 },
  middle: {},
  senior: { vitamin_d_mcg: 1.4, vitamin_b12_mcg: 1.2, calcium_mg: 1.2 },
};

const DIET_TYPE_WEIGHTS: Record<'vegan' | 'vegetarian' | 'none', WeightTable> = {
  vegan: { vitamin_b12_mcg: 2.0, iron_mg: 1.5, zinc_mg: 1.4, calcium_mg: 1.4, vitamin_d_mcg: 1.2 },
  vegetarian: { vitamin_b12_mcg: 1.6, iron_mg: 1.3, zinc_mg: 1.2 },
  none: {},
};

interface PatternConfig {
  weights: WeightTable;
  penaltyScale: number;
}

const DIETARY_PATTERN_CONFIG: Record<DietaryPattern, PatternConfig> = {
  general: { weights: {}, penaltyScale: 200 },
  western: { weights: { fiber_g: 1.5, potassium_mg: 1.3, vitamin_d_mcg: 1.3, calcium_mg: 1.2, magnesium_mg: 1.2 }, penaltyScale: 180 },
  mediterranean: { weights: { vitamin_d_mcg: 1.2, calcium_mg: 1.1 }, penaltyScale: 200 },
  east_asian: { weights: { calcium_mg: 1.5, vitamin_d_mcg: 1.3 }, penaltyScale: 150 },
  south_asian: { weights: { vitamin_d_mcg: 1.5, iron_mg: 1.3, vitamin_b12_mcg: 1.3, calcium_mg: 1.3 }, penaltyScale: 180 },
  latin_american: { weights: { vitamin_b9_mcg: 1.3, vitamin_d_mcg: 1.2 }, penaltyScale: 200 },
};

interface GoalConfig {
  weights: WeightTable;
  penaltyScale: number;
}

const HEALTH_GOAL_CONFIG: Record<HealthGoal, GoalConfig> = {
  heart: { weights: { potassium_mg: 1.5, fiber_g: 1.3, magnesium_mg: 1.3 }, penaltyScale: 150 },
  bone: { weights: { calcium_mg: 1.5, vitamin_d_mcg: 1.5, vitamin_k_mcg: 1.4, magnesium_mg: 1.3, phosphorus_mg: 1.2 }, penaltyScale: 200 },
  energy: { weights: { iron_mg: 1.5, vitamin_b12_mcg: 1.4, vitamin_b6_mg: 1.3, vitamin_b9_mcg: 1.2 }, penaltyScale: 200 },
  immune: { weights: { vitamin_c_mg: 1.4, zinc_mg: 1.4, vitamin_d_mcg: 1.3, vitamin_e_mg: 1.2 }, penaltyScale: 200 },
  digestive: { weights: { fiber_g: 1.6, magnesium_mg: 1.2 }, penaltyScale: 200 },
};

const ACTIVITY_WEIGHTS: Record<ActivityLevel, WeightTable> = {
  sedentary: {},
  light: { magnesium_mg: 1.1, potassium_mg: 1.1 },
  active: { magnesium_mg: 1.2, potassium_mg: 1.2, iron_mg: 1.1 },
  very_active: { magnesium_mg: 1.3, potassium_mg: 1.3, iron_mg: 1.2 },
};

interface LifeStageConfig {
  weights: WeightTable;
  penaltyScale: number | null;
}

const LIFE_STAGE_CONFIG: Record<LifeStage, LifeStageConfig> = {
  default: { weights: {}, penaltyScale: null },
  pregnant: { weights: { vitamin_b9_mcg: 2.0, iron_mg: 1.8, calcium_mg: 1.5, vitamin_d_mcg: 1.3 }, penaltyScale: 150 },
  lactating: { weights: { vitamin_d_mcg: 1.5, calcium_mg: 1.4, vitamin_b12_mcg: 1.3 }, penaltyScale: 180 },
  postmenopausal: { weights: { calcium_mg: 1.6, vitamin_d_mcg: 1.5, vitamin_k_mcg: 1.3 }, penaltyScale: 200 },
};

function applyMultipliers(
  accumulated: Map<NutrientKey, number>,
  table: WeightTable
): void {
  for (const [key, mult] of Object.entries(table) as [NutrientKey, number][]) {
    const current = accumulated.get(key) ?? 1;
    accumulated.set(key, Math.min(current * mult, WEIGHT_CAP));
  }
}

function getAgeCategory(age: number | null): 'young' | 'middle' | 'senior' {
  if (age === null || age <= 30) return 'young';
  if (age <= 50) return 'middle';
  return 'senior';
}

export function computePersonalizedConfig(
  userProfile: UserProfile | null,
  dietaryPrefs: DietaryPreferences,
  settings: PersonalizationSettings,
  baseConfig: ScoreConfig
): ScoreConfig {
  const multipliers = new Map<NutrientKey, number>();
  const penaltyScales: number[] = [baseConfig.penaltyScale];

  if (userProfile) {
    const isPostmenopausal = settings.lifeStage === 'postmenopausal';
    if (userProfile.sex === 'female') {
      applyMultipliers(multipliers, isPostmenopausal ? SEX_WEIGHTS.female_post : SEX_WEIGHTS.female_pre);
    } else {
      applyMultipliers(multipliers, SEX_WEIGHTS.male);
    }

    const ageCat = getAgeCategory(userProfile.age);
    applyMultipliers(multipliers, AGE_WEIGHTS[ageCat]);
  }

  if (dietaryPrefs.vegan) {
    applyMultipliers(multipliers, DIET_TYPE_WEIGHTS.vegan);
  } else if (dietaryPrefs.vegetarian) {
    applyMultipliers(multipliers, DIET_TYPE_WEIGHTS.vegetarian);
  }

  const patternCfg = DIETARY_PATTERN_CONFIG[settings.dietaryPattern];
  applyMultipliers(multipliers, patternCfg.weights);
  penaltyScales.push(patternCfg.penaltyScale);

  for (const goal of settings.healthGoals) {
    const goalCfg = HEALTH_GOAL_CONFIG[goal];
    applyMultipliers(multipliers, goalCfg.weights);
    penaltyScales.push(goalCfg.penaltyScale);
  }

  applyMultipliers(multipliers, ACTIVITY_WEIGHTS[settings.activityLevel]);

  if (userProfile?.sex === 'female' && settings.lifeStage !== 'default') {
    const lsCfg = LIFE_STAGE_CONFIG[settings.lifeStage];
    applyMultipliers(multipliers, lsCfg.weights);
    if (lsCfg.penaltyScale !== null) {
      penaltyScales.push(lsCfg.penaltyScale);
    }
  }

  const newWeights = new Map(baseConfig.weights);
  for (const [key, mult] of multipliers) {
    const baseWeight = baseConfig.weights.get(key) ?? 1;
    newWeights.set(key, Math.min(baseWeight * mult, WEIGHT_CAP * baseWeight));
  }

  return {
    ...baseConfig,
    weights: newWeights,
    penaltyScale: Math.min(...penaltyScales),
  };
}

export function hasPersonalization(
  userProfile: UserProfile | null,
  dietaryPrefs: DietaryPreferences,
  settings: PersonalizationSettings
): boolean {
  if (userProfile !== null) return true;
  if (dietaryPrefs.vegan || dietaryPrefs.vegetarian) return true;
  if (settings.healthGoals.length > 0) return true;
  if (settings.activityLevel !== 'sedentary') return true;
  if (settings.dietaryPattern !== 'general') return true;
  if (settings.lifeStage !== 'default') return true;
  return false;
}

export interface WeightSource {
  factor: 'sex' | 'age' | 'diet' | 'pattern' | 'goal' | 'activity' | 'lifeStage';
  label: string;
  multiplier: number;
}

function traceTable(
  result: Map<NutrientKey, WeightSource[]>,
  table: WeightTable,
  factor: WeightSource['factor'],
  label: string
): void {
  for (const [key, mult] of Object.entries(table) as [NutrientKey, number][]) {
    if (!result.has(key)) result.set(key, []);
    result.get(key)!.push({ factor, label, multiplier: mult });
  }
}

const GOAL_LABELS: Record<HealthGoal, string> = {
  heart: 'Heart',
  bone: 'Bone',
  energy: 'Energy',
  immune: 'Immune',
  digestive: 'Digestive',
};

const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary',
  light: 'Light',
  active: 'Active',
  very_active: 'Very Active',
};

const PATTERN_LABELS: Record<DietaryPattern, string> = {
  general: 'General',
  western: 'Western',
  mediterranean: 'Mediterranean',
  east_asian: 'East Asian',
  south_asian: 'South Asian',
  latin_american: 'Latin American',
};

const LIFE_STAGE_LABELS: Record<LifeStage, string> = {
  default: 'Default',
  pregnant: 'Pregnant',
  lactating: 'Lactating',
  postmenopausal: 'Postmenopausal',
};

export function traceWeightSources(
  userProfile: UserProfile | null,
  dietaryPrefs: DietaryPreferences,
  settings: PersonalizationSettings
): Map<NutrientKey, WeightSource[]> {
  const result = new Map<NutrientKey, WeightSource[]>();

  if (userProfile) {
    const isPostmenopausal = settings.lifeStage === 'postmenopausal';
    if (userProfile.sex === 'female') {
      const table = isPostmenopausal ? SEX_WEIGHTS.female_post : SEX_WEIGHTS.female_pre;
      traceTable(result, table, 'sex', 'Female');
    } else {
      traceTable(result, SEX_WEIGHTS.male, 'sex', 'Male');
    }

    const ageCat = getAgeCategory(userProfile.age);
    const ageLabels: Record<string, string> = { young: '18-30', middle: '31-50', senior: '51+' };
    traceTable(result, AGE_WEIGHTS[ageCat], 'age', ageLabels[ageCat]);
  }

  if (dietaryPrefs.vegan) {
    traceTable(result, DIET_TYPE_WEIGHTS.vegan, 'diet', 'Vegan');
  } else if (dietaryPrefs.vegetarian) {
    traceTable(result, DIET_TYPE_WEIGHTS.vegetarian, 'diet', 'Vegetarian');
  }

  const patternCfg = DIETARY_PATTERN_CONFIG[settings.dietaryPattern];
  traceTable(result, patternCfg.weights, 'pattern', PATTERN_LABELS[settings.dietaryPattern]);

  for (const goal of settings.healthGoals) {
    traceTable(result, HEALTH_GOAL_CONFIG[goal].weights, 'goal', GOAL_LABELS[goal]);
  }

  traceTable(result, ACTIVITY_WEIGHTS[settings.activityLevel], 'activity', ACTIVITY_LABELS[settings.activityLevel]);

  if (userProfile?.sex === 'female' && settings.lifeStage !== 'default') {
    traceTable(result, LIFE_STAGE_CONFIG[settings.lifeStage].weights, 'lifeStage', LIFE_STAGE_LABELS[settings.lifeStage]);
  }

  return result;
}

export function getTopWeights(
  config: ScoreConfig,
  baseConfig: ScoreConfig,
  limit: number
): Array<{ key: NutrientKey; weight: number }> {
  const entries: Array<{ key: NutrientKey; weight: number }> = [];
  for (const [key, weight] of config.weights) {
    const baseWeight = baseConfig.weights.get(key) ?? 1;
    if (weight !== baseWeight) {
      entries.push({ key, weight });
    }
  }
  entries.sort((a, b) => b.weight - a.weight);
  return entries.slice(0, limit);
}
