import { describe, expect, it } from 'vitest';
import type { ItemCategory, ItemType, NutrientFruit } from '../../types';
import { getEffectiveDailyValues } from '../daily-values';
import { analyzeDietAudit } from '../diet-audit';

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
  category: ItemCategory,
  overrides: Partial<NutrientFruit> = {}
): NutrientFruit {
  return {
    name,
    type,
    category,
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

describe('analyzeDietAudit', () => {
  it('reports top gaps and explainable additions for a weak baseline', () => {
    const rice = makeFood('Rice', 'grain', 'Rice', {
      calories_kcal: 130,
      protein_g: 2.7,
      carbs_g: 28,
      magnesium_mg: 12,
      potassium_mg: 35,
      calcium_mg: 10,
    });
    const spinach = makeFood('Spinach', 'vegetable', 'Leafy Green', {
      calories_kcal: 23,
      protein_g: 2.9,
      fiber_g: 2.2,
      vitamin_a_mcg: 469,
      vitamin_c_mg: 28,
      magnesium_mg: 79,
      potassium_mg: 558,
      calcium_mg: 99,
    });
    const beans = makeFood('Black Beans', 'legume', 'Bean', {
      calories_kcal: 132,
      protein_g: 8.9,
      fiber_g: 8.7,
      magnesium_mg: 70,
      potassium_mg: 355,
      iron_mg: 2.1,
    });

    const result = analyzeDietAudit(
      [{ name: rice.name, servingsPerWeek: 7 }],
      [rice, spinach, beans],
      getEffectiveDailyValues(null, {}),
      10,
      'off'
    );

    expect(result.gaps.length).toBeGreaterThan(0);
    expect(result.gaps[0].percent).toBeLessThan(90);
    expect(result.fixes.length).toBeGreaterThan(0);
    expect(result.fixes[0].improves.length).toBeGreaterThan(0);
    expect(result.fixedEntries.length).toBeGreaterThan(1);
  });

  it('flags excessive sodium and missing data confidence drivers', () => {
    const soup = makeFood('Canned Soup', 'vegetable', 'Other', {
      sodium_mg: 1200,
      potassium_mg: null,
      calcium_mg: null,
    });

    const result = analyzeDietAudit(
      [{ name: soup.name, servingsPerWeek: 21 }],
      [soup],
      getEffectiveDailyValues(null, {}),
      10,
      'off'
    );

    expect(result.excesses.map((item) => item.key)).toContain('sodium_mg');
    expect(result.missingData.some((item) => item.key === 'potassium_mg')).toBe(true);
    expect(result.confidence).toBeLessThan(95);
  });
});
