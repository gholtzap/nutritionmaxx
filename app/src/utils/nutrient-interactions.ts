import type { NutrientKey, NutrientFruit } from '../types';
import type { PlanNutrientRow } from './plan-calculator';

export interface Insight {
  id: string;
  type: 'enhancer' | 'inhibitor' | 'requirement';
  message: string;
  nutrients: NutrientKey[];
  suggestNutrient: NutrientKey | null;
}

export interface InteractionRule {
  id: string;
  type: Insight['type'];
  message: string;
  nutrients: NutrientKey[];
  suggestNutrient: NutrientKey | null;
  check: (pct: (key: NutrientKey) => number) => boolean;
}

export const RULES: InteractionRule[] = [
  {
    id: 'vitc-iron',
    type: 'enhancer',
    message: 'Vitamin C enhances non-heme iron absorption by up to 6x when consumed together',
    nutrients: ['iron_mg', 'vitamin_c_mg'],
    suggestNutrient: 'vitamin_c_mg',
    check: (pct) => pct('iron_mg') >= 25 && pct('vitamin_c_mg') < 50,
  },
  {
    id: 'calcium-iron',
    type: 'inhibitor',
    message: 'High calcium can reduce iron absorption when consumed together',
    nutrients: ['calcium_mg', 'iron_mg'],
    suggestNutrient: null,
    check: (pct) => pct('calcium_mg') >= 50 && pct('iron_mg') >= 25 && pct('iron_mg') < 100,
  },
  {
    id: 'vitd-calcium',
    type: 'enhancer',
    message: 'Vitamin D is needed to absorb calcium effectively',
    nutrients: ['calcium_mg', 'vitamin_d_mcg'],
    suggestNutrient: 'vitamin_d_mcg',
    check: (pct) => pct('calcium_mg') >= 25 && pct('vitamin_d_mcg') < 50,
  },
  {
    id: 'fat-soluble',
    type: 'requirement',
    message: 'Vitamins A, D, E, K are fat-soluble and need dietary fat for absorption',
    nutrients: ['vitamin_a_mcg', 'vitamin_d_mcg', 'vitamin_e_mg', 'vitamin_k_mcg', 'fat_g'],
    suggestNutrient: 'fat_g',
    check: (pct) => {
      const hasFatSoluble =
        pct('vitamin_a_mcg') >= 25 ||
        pct('vitamin_d_mcg') >= 25 ||
        pct('vitamin_e_mg') >= 25 ||
        pct('vitamin_k_mcg') >= 25;
      return hasFatSoluble && pct('fat_g') < 30;
    },
  },
  {
    id: 'zinc-copper',
    type: 'inhibitor',
    message: 'Very high zinc can inhibit copper absorption',
    nutrients: ['zinc_mg', 'copper_mg'],
    suggestNutrient: 'copper_mg',
    check: (pct) => pct('zinc_mg') >= 150 && pct('copper_mg') < 75,
  },
  {
    id: 'mag-vitd',
    type: 'enhancer',
    message: 'Magnesium is needed to activate vitamin D',
    nutrients: ['vitamin_d_mcg', 'magnesium_mg'],
    suggestNutrient: 'magnesium_mg',
    check: (pct) => pct('vitamin_d_mcg') >= 25 && pct('magnesium_mg') < 50,
  },
];

export function analyzeInteractions(rows: PlanNutrientRow[]): Insight[] {
  const rowMap = new Map(rows.map((r) => [r.key, r]));

  const pct = (key: NutrientKey): number => {
    const row = rowMap.get(key);
    if (!row || row.dailyValue <= 0) return 0;
    return (row.total / row.dailyValue) * 100;
  };

  const insights: Insight[] = [];
  for (const rule of RULES) {
    if (rule.check(pct)) {
      insights.push({
        id: rule.id,
        type: rule.type,
        message: rule.message,
        nutrients: rule.nutrients,
        suggestNutrient: rule.suggestNutrient,
      });
    }
  }
  return insights;
}

export function findSuggestedFoods(
  nutrientKey: NutrientKey,
  fruits: NutrientFruit[],
  excludeNames: Set<string>,
  count = 3
): NutrientFruit[] {
  return fruits
    .filter((f) => {
      if (excludeNames.has(f.name)) return false;
      const val = f[nutrientKey] as number | null;
      return val !== null && val > 0;
    })
    .sort((a, b) => {
      const aVal = (a[nutrientKey] as number) * ((a.serving_size_g ?? 100) / 100);
      const bVal = (b[nutrientKey] as number) * ((b.serving_size_g ?? 100) / 100);
      return bVal - aVal;
    })
    .slice(0, count);
}
