import { describe, expect, it } from 'vitest';
import type { ItemType, NutrientFruit } from '../../types';
import { findFoodReplacements } from '../plan-calculator';

const NUTRIENT_BASE = {
  calories_kcal: 100,
  protein_g: 5,
  fat_g: 2,
  carbs_g: 12,
  fiber_g: 2,
  sugars_g: 2,
  water_g: 70,
  vitamin_a_mcg: 0,
  vitamin_b1_mg: 0,
  vitamin_b2_mg: 0,
  vitamin_b3_mg: 0,
  vitamin_b5_mg: 0,
  vitamin_b6_mg: 0,
  vitamin_b9_mcg: 0,
  vitamin_b12_mcg: 0,
  vitamin_c_mg: 0,
  vitamin_d_mcg: 0,
  vitamin_e_mg: 0,
  vitamin_k_mcg: 0,
  calcium_mg: 0,
  iron_mg: 0,
  magnesium_mg: 0,
  phosphorus_mg: 0,
  potassium_mg: 0,
  sodium_mg: 0,
  zinc_mg: 0,
  copper_mg: 0,
  manganese_mg: 0,
  selenium_mcg: 0,
} as const;

function makeFood(
  name: string,
  type: ItemType,
  overrides: Partial<NutrientFruit> = {}
): NutrientFruit {
  return {
    name,
    type,
    category: type === 'poultry' ? 'Chicken' : 'Other',
    fdc_id: name,
    serving_size_g: 100,
    serving_label: '100g',
    cost_index: 3,
    histamine_level: 0,
    histamine_type: '',
    ...NUTRIENT_BASE,
    ...overrides,
  } as NutrientFruit;
}

describe('findFoodReplacements', () => {
  it('ranks nutritionally similar foods ahead of unrelated foods', () => {
    const chicken = makeFood('Chicken Breast', 'poultry', {
      calories_kcal: 165,
      protein_g: 31,
      fat_g: 3.6,
      carbs_g: 0,
      phosphorus_mg: 228,
      potassium_mg: 256,
    });
    const turkey = makeFood('Turkey Breast', 'poultry', {
      calories_kcal: 157,
      protein_g: 29,
      fat_g: 3.2,
      carbs_g: 0,
      phosphorus_mg: 230,
      potassium_mg: 250,
    });
    const oliveOil = makeFood('Olive Oil', 'fat_oil', {
      calories_kcal: 884,
      protein_g: 0,
      fat_g: 100,
      carbs_g: 0,
      phosphorus_mg: 0,
      potassium_mg: 1,
    });

    const results = findFoodReplacements(
      chicken,
      [chicken, turkey, oliveOil],
      [{ name: chicken.name, servingsPerWeek: 7 }]
    );

    expect(results[0].food.name).toBe('Turkey Breast');
    expect(results.map((r) => r.food.name)).toContain('Olive Oil');
  });

  it('excludes foods already in the plan and above budget tolerance', () => {
    const chicken = makeFood('Chicken Breast', 'poultry', {
      protein_g: 31,
      calories_kcal: 165,
    });
    const turkey = makeFood('Turkey Breast', 'poultry', {
      protein_g: 29,
      calories_kcal: 157,
    });
    const expensiveTurkey = makeFood('Premium Turkey', 'poultry', {
      protein_g: 30,
      calories_kcal: 160,
      cost_index: 8,
    });
    const pork = makeFood('Pork Loin', 'pork', {
      protein_g: 27,
      calories_kcal: 170,
    });

    const results = findFoodReplacements(
      chicken,
      [chicken, turkey, expensiveTurkey, pork],
      [
        { name: chicken.name, servingsPerWeek: 7 },
        { name: turkey.name, servingsPerWeek: 3 },
      ],
      5
    );

    const names = results.map((r) => r.food.name);
    expect(names).not.toContain('Turkey Breast');
    expect(names).not.toContain('Premium Turkey');
    expect(names).toContain('Pork Loin');
  });
});
