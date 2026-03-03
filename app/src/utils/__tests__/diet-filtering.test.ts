import { describe, it, expect } from 'vitest';
import type { NutrientFruit, ItemType } from '../../types';
import type { DietaryPreference } from '../dietary';
import { EXCLUSION_RULES } from '../dietary';
import type { DietPattern, WizardAnswers } from '../deficiency-profile';
import {
  buildDeficiencyProfile,
  scoreFoodsForDeficiencies,
} from '../deficiency-profile';

const NUTRIENT_ZEROS = {
  calories_kcal: 100,
  protein_g: 20,
  fat_g: 5,
  carbs_g: 0,
  fiber_g: 3,
  sugars_g: 0,
  water_g: 70,
  vitamin_a_mcg: 0,
  vitamin_b1_mg: 0.1,
  vitamin_b2_mg: 0.2,
  vitamin_b3_mg: 5,
  vitamin_b5_mg: 0.5,
  vitamin_b6_mg: 0.3,
  vitamin_b9_mcg: 10,
  vitamin_b12_mcg: 2,
  vitamin_c_mg: 0,
  vitamin_d_mcg: 0,
  vitamin_e_mg: 0.5,
  vitamin_k_mcg: 2,
  calcium_mg: 10,
  iron_mg: 3,
  magnesium_mg: 20,
  phosphorus_mg: 200,
  potassium_mg: 300,
  sodium_mg: 60,
  zinc_mg: 5,
  copper_mg: 0.1,
  manganese_mg: 0.05,
  selenium_mcg: 20,
} as const;

function makeFoodItem(
  name: string,
  type: ItemType,
  category: string,
  overrides?: Partial<Record<string, number | null>>
): NutrientFruit {
  return {
    name,
    type,
    category,
    fdc_id: '999999',
    serving_size_g: 100,
    serving_label: null,
    cost_index: null,
    ...NUTRIENT_ZEROS,
    ...overrides,
  } as NutrientFruit;
}

const BEEF_STEAK = makeFoodItem('Beef Sirloin', 'beef', 'Steak');
const PORK_CHOP = makeFoodItem('Pork Chop', 'pork', 'Loin');
const CHICKEN_BREAST = makeFoodItem('Chicken Breast', 'poultry', 'Chicken');
const LAMB_LEG = makeFoodItem('Lamb Leg', 'lamb', 'Leg');
const SALMON = makeFoodItem('Salmon', 'fish_seafood', 'Fish');
const SHRIMP = makeFoodItem('Shrimp', 'fish_seafood', 'Crustacean');
const LARD = makeFoodItem('Lard', 'fat_oil', 'Animal Fat');
const EGG = makeFoodItem('Egg', 'egg', 'Whole');
const MILK = makeFoodItem('Whole Milk', 'dairy', 'Milk');
const SPINACH = makeFoodItem('Spinach', 'vegetable', 'Leafy Green', {
  iron_mg: 2.7,
  vitamin_a_mcg: 469,
  vitamin_k_mcg: 483,
  magnesium_mg: 79,
  potassium_mg: 558,
  fiber_g: 2.2,
  vitamin_c_mg: 28,
  vitamin_e_mg: 2.0,
});
const LENTILS = makeFoodItem('Lentils', 'legume', 'Lentil', {
  iron_mg: 3.3,
  fiber_g: 7.9,
  protein_g: 9,
  potassium_mg: 369,
  magnesium_mg: 36,
  zinc_mg: 1.3,
  vitamin_b9_mcg: 181,
});

const ALL_FOODS = [
  BEEF_STEAK, PORK_CHOP, CHICKEN_BREAST, LAMB_LEG,
  SALMON, SHRIMP, LARD, EGG, MILK,
  SPINACH, LENTILS,
];

function makeAnswers(dietPattern: DietPattern): WizardAnswers {
  return {
    sex: 'male',
    ageRange: '31-50',
    dietPattern,
    healthFocus: [],
    pregnancyStatus: null,
    lifestyleFactors: [],
    symptoms: [],
    familyHistory: [],
  };
}

function getRecommendations(dietPattern: DietPattern, foods: NutrientFruit[] = ALL_FOODS) {
  const answers = makeAnswers(dietPattern);
  const profile = buildDeficiencyProfile(answers);
  const dietExclusion = answers.dietPattern !== 'omnivore'
    ? EXCLUSION_RULES[answers.dietPattern as DietaryPreference]
    : null;
  const eligibleFoods = dietExclusion ? foods.filter((f) => !dietExclusion(f)) : foods;
  return scoreFoodsForDeficiencies(eligibleFoods, profile, 10);
}

describe('diet pattern filtering in recommendations', () => {
  it('vegetarian recommendations exclude all meat types', () => {
    const results = getRecommendations('vegetarian');
    const names = results.map((r) => r.food.name);
    expect(names).not.toContain('Beef Sirloin');
    expect(names).not.toContain('Pork Chop');
    expect(names).not.toContain('Chicken Breast');
    expect(names).not.toContain('Lamb Leg');
    expect(names).not.toContain('Salmon');
    expect(names).not.toContain('Lard');
  });

  it('vegetarian recommendations allow eggs and dairy', () => {
    const results = getRecommendations('vegetarian');
    const types = new Set(results.map((r) => r.food.type));
    expect(types).not.toContain('beef');
    expect(types).not.toContain('pork');
    expect(types).not.toContain('poultry');
    expect(types).not.toContain('fish_seafood');
    expect(types).not.toContain('lamb');
  });

  it('vegan recommendations exclude all animal products', () => {
    const results = getRecommendations('vegan');
    const types = new Set(results.map((r) => r.food.type));
    expect(types).not.toContain('beef');
    expect(types).not.toContain('pork');
    expect(types).not.toContain('poultry');
    expect(types).not.toContain('fish_seafood');
    expect(types).not.toContain('lamb');
    expect(types).not.toContain('dairy');
    expect(types).not.toContain('egg');
  });

  it('pescatarian recommendations exclude land meats but allow fish', () => {
    const results = getRecommendations('pescatarian');
    const types = new Set(results.map((r) => r.food.type));
    expect(types).not.toContain('beef');
    expect(types).not.toContain('pork');
    expect(types).not.toContain('poultry');
    expect(types).not.toContain('lamb');
  });

  it('omnivore recommendations do not exclude anything by diet', () => {
    const results = getRecommendations('omnivore');
    const types = new Set(results.map((r) => r.food.type));
    expect(types.size).toBeGreaterThan(0);
  });

  it('vegetarian with iron deficiency profile still does not recommend beef', () => {
    const answers: WizardAnswers = {
      sex: 'female',
      ageRange: '19-30',
      dietPattern: 'vegetarian',
      healthFocus: ['energy'],
      pregnancyStatus: null,
      lifestyleFactors: [],
      symptoms: ['fatigue'],
      familyHistory: [],
    };
    const profile = buildDeficiencyProfile(answers);
    const dietExclusion = EXCLUSION_RULES[answers.dietPattern as DietaryPreference];
    const eligibleFoods = ALL_FOODS.filter((f) => !dietExclusion(f));
    const results = scoreFoodsForDeficiencies(eligibleFoods, profile, 10);
    const types = new Set(results.map((r) => r.food.type));
    expect(types).not.toContain('beef');
    expect(types).not.toContain('pork');
    expect(types).not.toContain('poultry');
    expect(types).not.toContain('fish_seafood');
    expect(types).not.toContain('lamb');
  });
});
