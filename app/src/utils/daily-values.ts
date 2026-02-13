import type { NutrientKey } from '../types';
import { NUTRIENT_META } from './nutrition-meta';

export interface UserProfile {
  sex: 'male' | 'female';
  weight_kg: number;
  height_cm: number;
  age: number | null;
}

type AgeRange = '19-30' | '31-50' | '51+';

function getAgeRange(age: number | null): AgeRange {
  if (age === null || age <= 30) return '19-30';
  if (age <= 50) return '31-50';
  return '51+';
}

const SEX_AGE_RDA: Record<
  'male' | 'female',
  Record<AgeRange, Partial<Record<NutrientKey, number>>>
> = {
  male: {
    '19-30': {
      iron_mg: 8,
      magnesium_mg: 400,
      zinc_mg: 11,
      potassium_mg: 3400,
      fiber_g: 38,
      vitamin_a_mcg: 900,
      vitamin_c_mg: 90,
      vitamin_k_mcg: 120,
      manganese_mg: 2.3,
      vitamin_b1_mg: 1.2,
      vitamin_b2_mg: 1.3,
      vitamin_b3_mg: 16,
      vitamin_b6_mg: 1.3,
    },
    '31-50': {
      iron_mg: 8,
      magnesium_mg: 420,
      zinc_mg: 11,
      potassium_mg: 3400,
      fiber_g: 38,
      vitamin_a_mcg: 900,
      vitamin_c_mg: 90,
      vitamin_k_mcg: 120,
      manganese_mg: 2.3,
      vitamin_b1_mg: 1.2,
      vitamin_b2_mg: 1.3,
      vitamin_b3_mg: 16,
      vitamin_b6_mg: 1.3,
    },
    '51+': {
      iron_mg: 8,
      magnesium_mg: 420,
      zinc_mg: 11,
      potassium_mg: 3400,
      fiber_g: 30,
      vitamin_a_mcg: 900,
      vitamin_c_mg: 90,
      vitamin_k_mcg: 120,
      manganese_mg: 2.3,
      vitamin_b1_mg: 1.2,
      vitamin_b2_mg: 1.3,
      vitamin_b3_mg: 16,
      vitamin_b6_mg: 1.7,
    },
  },
  female: {
    '19-30': {
      iron_mg: 18,
      magnesium_mg: 310,
      zinc_mg: 8,
      potassium_mg: 2600,
      fiber_g: 25,
      vitamin_a_mcg: 700,
      vitamin_c_mg: 75,
      vitamin_k_mcg: 90,
      manganese_mg: 1.8,
      vitamin_b1_mg: 1.1,
      vitamin_b2_mg: 1.1,
      vitamin_b3_mg: 14,
      vitamin_b6_mg: 1.3,
    },
    '31-50': {
      iron_mg: 18,
      magnesium_mg: 320,
      zinc_mg: 8,
      potassium_mg: 2600,
      fiber_g: 25,
      vitamin_a_mcg: 700,
      vitamin_c_mg: 75,
      vitamin_k_mcg: 90,
      manganese_mg: 1.8,
      vitamin_b1_mg: 1.1,
      vitamin_b2_mg: 1.1,
      vitamin_b3_mg: 14,
      vitamin_b6_mg: 1.3,
    },
    '51+': {
      iron_mg: 8,
      magnesium_mg: 320,
      zinc_mg: 8,
      potassium_mg: 2600,
      fiber_g: 21,
      vitamin_a_mcg: 700,
      vitamin_c_mg: 75,
      vitamin_k_mcg: 90,
      manganese_mg: 1.8,
      vitamin_b1_mg: 1.1,
      vitamin_b2_mg: 1.1,
      vitamin_b3_mg: 14,
      vitamin_b6_mg: 1.5,
    },
  },
};

const ACTIVITY_MULTIPLIER = 1.55;

export function computeProfileDailyValues(
  profile: UserProfile
): Partial<Record<NutrientKey, number>> {
  const result: Partial<Record<NutrientKey, number>> = {};
  const ageRange = getAgeRange(profile.age);
  const rdaTable = SEX_AGE_RDA[profile.sex][ageRange];

  for (const [key, value] of Object.entries(rdaTable)) {
    result[key as NutrientKey] = value;
  }

  result.protein_g = Math.round(profile.weight_kg * 0.8);

  if (profile.age !== null) {
    let bmr: number;
    if (profile.sex === 'male') {
      bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age + 5;
    } else {
      bmr = 10 * profile.weight_kg + 6.25 * profile.height_cm - 5 * profile.age - 161;
    }
    result.calories_kcal = Math.round(bmr * ACTIVITY_MULTIPLIER);
  }

  return result;
}

export type EffectiveDailyValues = Map<NutrientKey, number | null>;

export function getEffectiveDailyValues(
  profile: UserProfile | null,
  overrides: Partial<Record<NutrientKey, number>>
): EffectiveDailyValues {
  const profileValues = profile ? computeProfileDailyValues(profile) : {};
  const result = new Map<NutrientKey, number | null>();

  for (const meta of NUTRIENT_META) {
    const override = overrides[meta.key];
    if (override !== undefined) {
      result.set(meta.key, override);
      continue;
    }

    const profileValue = profileValues[meta.key];
    if (profileValue !== undefined) {
      result.set(meta.key, profileValue);
      continue;
    }

    result.set(meta.key, meta.dailyValue);
  }

  return result;
}
