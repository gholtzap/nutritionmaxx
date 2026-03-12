import type { NutrientFruit, NutrientKey, PlanEntry, ItemType, ItemCategory } from '../types';
import { NUTRIENT_META } from './nutrition-meta';
import type { NutrientMeta } from './nutrition-meta';
import type { EffectiveDailyValues } from './daily-values';

export interface PlanNutrientRow {
  key: NutrientKey;
  label: string;
  unit: string;
  group: 'macro' | 'vitamin' | 'mineral';
  dailyValue: number;
  total: number;
  nullCount: number;
  insufficientData: boolean;
  note?: string;
}

const PLAN_NUTRIENTS: NutrientMeta[] = NUTRIENT_META.filter(
  (m) => m.dailyValue !== null
);

function resolveDV(meta: NutrientMeta, dvMap?: EffectiveDailyValues): number | null {
  if (dvMap) {
    return dvMap.get(meta.key) ?? null;
  }
  return meta.dailyValue;
}

const INSUFFICIENT_THRESHOLD = 0.5;
const EXCESS_THRESHOLD = 2.0;
const EXCESS_PENALTY = 0.3;

const FORCE_INSUFFICIENT: Set<NutrientKey> = new Set(['vitamin_d_mcg', 'sodium_mg']);

const INSUFFICIENT_NOTES: Partial<Record<NutrientKey, string>> = {
  sodium_mg: 'Nearly every modern diet includes enough sodium; add salt to your cooking if you are deficient',
  vitamin_k_mcg: 'USDA does not supply this data',
  vitamin_d_mcg: 'Very few foods contain vitamin D, if you are deficient, get 20 minutes of sun on your arms and legs per day, eat salmon, or take supplements',
};

function getInsufficientNutrients(fruits: NutrientFruit[]): Set<NutrientKey> {
  const result = new Set<NutrientKey>(FORCE_INSUFFICIENT);
  if (fruits.length === 0) return result;
  for (const meta of PLAN_NUTRIENTS) {
    let hasData = 0;
    for (const fruit of fruits) {
      if (fruit[meta.key] !== null) hasData++;
    }
    if (hasData / fruits.length < INSUFFICIENT_THRESHOLD) {
      result.add(meta.key);
    }
  }
  return result;
}

function getDailyContribution(
  fruit: NutrientFruit,
  servingsPerWeek: number
): Map<NutrientKey, number | null> {
  const servingG = fruit.serving_size_g ?? 100;
  const dailyFactor = (servingG / 100) * (servingsPerWeek / 7);
  const result = new Map<NutrientKey, number | null>();
  for (const meta of PLAN_NUTRIENTS) {
    const raw = fruit[meta.key] as number | null;
    result.set(meta.key, raw === null ? null : raw * dailyFactor);
  }
  return result;
}

export function computePlanDailyTotals(
  entries: PlanEntry[],
  fruits: NutrientFruit[],
  dvMap?: EffectiveDailyValues
): PlanNutrientRow[] {
  const fruitMap = new Map(fruits.map((f) => [f.name, f]));
  const insufficient = getInsufficientNutrients(fruits);

  const totals = new Map<NutrientKey, number>();
  const nullCounts = new Map<NutrientKey, number>();

  for (const meta of PLAN_NUTRIENTS) {
    totals.set(meta.key, 0);
    nullCounts.set(meta.key, 0);
  }

  for (const entry of entries) {
    const fruit = fruitMap.get(entry.name);
    if (!fruit) continue;
    const contrib = getDailyContribution(fruit, entry.servingsPerWeek);
    for (const meta of PLAN_NUTRIENTS) {
      const val = contrib.get(meta.key)!;
      if (val === null) {
        nullCounts.set(meta.key, nullCounts.get(meta.key)! + 1);
      } else {
        totals.set(meta.key, totals.get(meta.key)! + val);
      }
    }
  }

  return PLAN_NUTRIENTS.map((meta) => ({
    key: meta.key,
    label: meta.label,
    unit: meta.unit,
    group: meta.group,
    dailyValue: resolveDV(meta, dvMap) ?? meta.dailyValue!,
    total: totals.get(meta.key)!,
    nullCount: nullCounts.get(meta.key)!,
    insufficientData: insufficient.has(meta.key),
    note: INSUFFICIENT_NOTES[meta.key],
  }));
}

interface ScoredCandidate {
  fruit: NutrientFruit;
  score: number;
  servings: number;
}

const LOCKED_NUTRIENT_BOOST = 3;

function scoreCandidate(
  fruit: NutrientFruit,
  totals: Map<NutrientKey, number>,
  insufficient: Set<NutrientKey>,
  dvMap?: EffectiveDailyValues,
  lockedNutrients?: Set<NutrientKey>
): ScoredCandidate | null {
  const servingG = fruit.serving_size_g ?? 100;
  const perNutrientServings: number[] = [];
  let nullCount = 0;
  const sufficientCount = PLAN_NUTRIENTS.length - insufficient.size;

  for (const meta of PLAN_NUTRIENTS) {
    if (insufficient.has(meta.key)) continue;
    const raw = fruit[meta.key] as number | null;
    if (raw === null) {
      nullCount++;
      continue;
    }
    const perServing = raw * (servingG / 100);
    if (perServing <= 0) continue;
    const dv = resolveDV(meta, dvMap) ?? meta.dailyValue!;
    const rem = Math.max(0, dv - totals.get(meta.key)!);
    if (rem <= 0) continue;
    const needed = rem / perServing;
    perNutrientServings.push(needed);
  }

  if (perNutrientServings.length === 0) return null;

  perNutrientServings.sort((a, b) => a - b);
  const median = perNutrientServings[Math.floor(perNutrientServings.length / 2)];
  const cap = maxServingsFor(fruit);
  const servings = Math.max(1, Math.min(cap, Math.round(median * 7)));

  const dailyFactor = (servingG / 100) * (servings / 7);
  let score = 0;
  for (const meta of PLAN_NUTRIENTS) {
    if (insufficient.has(meta.key)) continue;
    const raw = fruit[meta.key] as number | null;
    if (raw === null) continue;
    const contribution = raw * dailyFactor;
    const total = totals.get(meta.key)!;
    const dv = resolveDV(meta, dvMap) ?? meta.dailyValue!;
    const rem = Math.max(0, dv - total);
    const isLocked = lockedNutrients?.has(meta.key) && total < dv;
    const weight = isLocked ? LOCKED_NUTRIENT_BOOST : 1;
    if (rem > 0) {
      score += (Math.min(contribution, rem) / dv) * weight;
    }
    const dvCap = dv * EXCESS_THRESHOLD;
    const addedExcess =
      Math.max(0, total + contribution - dvCap) - Math.max(0, total - dvCap);
    if (addedExcess > 0) {
      score -= (addedExcess / dv) * EXCESS_PENALTY;
    }
  }

  const nullPenalty =
    sufficientCount > 0 ? 1 - (nullCount / sufficientCount) * 0.5 : 1;
  score *= nullPenalty;

  if (score <= 0) return null;

  return { fruit, score, servings };
}

function weightedRandomPick(candidates: ScoredCandidate[]): ScoredCandidate {
  const total = candidates.reduce((sum, c) => sum + c.score, 0);
  let r = Math.random() * total;
  for (const c of candidates) {
    r -= c.score;
    if (r <= 0) return c;
  }
  return candidates[candidates.length - 1];
}

function applySelection(
  picked: ScoredCandidate,
  totals: Map<NutrientKey, number>
) {
  const servingG = picked.fruit.serving_size_g ?? 100;
  const dailyFactor = (servingG / 100) * (picked.servings / 7);
  for (const meta of PLAN_NUTRIENTS) {
    const raw = picked.fruit[meta.key] as number | null;
    if (raw === null) continue;
    const contribution = raw * dailyFactor;
    totals.set(meta.key, totals.get(meta.key)! + contribution);
  }
}


const TYPE_MAX: Record<ItemType, number> = {
  grain: 14,
  fat_oil: 14,
  legume: 7,
  poultry: 7,
  beef: 7,
  pork: 7,
  fish_seafood: 3,
  fruit: 7,
  vegetable: 7,
  nut_seed: 5,
  dairy: 7,
  egg: 7,
  lamb: 7,
  spice: 3,
};

const CATEGORY_MAX: Partial<Record<ItemCategory, number>> = {
  'Ancient Grain': 3,
  'Wheat': 0,
  'Animal Fat': 7,
  'Other': 5,
  'Other Cut': 3,
  'Mollusk': 2,
  'Crustacean': 3,
};

const ITEM_MAX: Record<string, number> = {
  'Shortening': 0,
  'Chicken Liver': 1,
  'Fava Bean': 3,
  'Rutabaga': 3,
  'Mung Bean': 3,
  'Ribeye Steak': 2,
};

function maxServingsFor(fruit: NutrientFruit): number {
  const itemCap = ITEM_MAX[fruit.name];
  if (itemCap !== undefined) return itemCap;
  const catCap = CATEGORY_MAX[fruit.category as ItemCategory];
  if (catCap !== undefined) return catCap;
  return TYPE_MAX[fruit.type as ItemType] ?? 7;
}

const MAX_CALORIE_FILLERS = 3;
const TOP_N = 5;
const DIVERSITY_DECAY = 0.7;

function calsPerServing(fruit: NutrientFruit): number {
  const cals = fruit.calories_kcal as number | null;
  if (cals === null || cals <= 0) return 0;
  return cals * ((fruit.serving_size_g ?? 100) / 100);
}

function planDailyCals(
  plan: PlanEntry[],
  fruitMap: Map<string, NutrientFruit>
): number {
  let total = 0;
  for (const entry of plan) {
    const fruit = fruitMap.get(entry.name);
    if (!fruit) continue;
    total += calsPerServing(fruit) * (entry.servingsPerWeek / 7);
  }
  return total;
}

function boostCalories(
  plan: PlanEntry[],
  lockedNames: Set<string>,
  fruitMap: Map<string, NutrientFruit>,
  pool: NutrientFruit[],
  used: Set<string>,
  calorieDV: number
): void {
  let totalCals = planDailyCals(plan, fruitMap);
  if (totalCals >= calorieDV || totalCals <= 0) return;

  const boostable = plan.filter((e) => {
    if (lockedNames.has(e.name)) return false;
    const f = fruitMap.get(e.name);
    return f && e.servingsPerWeek < maxServingsFor(f);
  });
  if (boostable.length > 0) {
    let boostableCals = 0;
    for (const entry of boostable) {
      const fruit = fruitMap.get(entry.name);
      if (!fruit) continue;
      boostableCals += calsPerServing(fruit) * (entry.servingsPerWeek / 7);
    }
    if (boostableCals > 0) {
      const scale = (boostableCals + (calorieDV - totalCals)) / boostableCals;
      for (const entry of boostable) {
        const fruit = fruitMap.get(entry.name)!;
        entry.servingsPerWeek = Math.min(
          maxServingsFor(fruit),
          Math.round(entry.servingsPerWeek * scale)
        );
      }
    }
  }

  totalCals = planDailyCals(plan, fruitMap);
  if (totalCals >= calorieDV) return;

  const fillers = pool
    .filter((f) => !used.has(f.name) && calsPerServing(f) > 0)
    .sort((a, b) => calsPerServing(b) - calsPerServing(a));

  let added = 0;
  for (const fruit of fillers) {
    if (added >= MAX_CALORIE_FILLERS) break;
    const deficit = calorieDV - totalCals;
    if (deficit <= 0) break;

    const cps = calsPerServing(fruit);
    const dailyServings = deficit / cps;
    const cap = maxServingsFor(fruit);
    const spw = Math.min(cap, Math.max(1, Math.round(dailyServings * 7)));

    plan.push({ name: fruit.name, servingsPerWeek: spw });
    used.add(fruit.name);
    totalCals += cps * (spw / 7);
    added++;
  }
}

function nutrientTotal(
  plan: PlanEntry[],
  fruitMap: Map<string, NutrientFruit>,
  key: NutrientKey
): number {
  let total = 0;
  for (const entry of plan) {
    const fruit = fruitMap.get(entry.name);
    if (!fruit) continue;
    const raw = fruit[key] as number | null;
    if (raw === null) continue;
    const servingG = fruit.serving_size_g ?? 100;
    total += raw * (servingG / 100) * (entry.servingsPerWeek / 7);
  }
  return total;
}

function nutrientDensity(fruit: NutrientFruit, key: NutrientKey): number {
  const raw = fruit[key] as number | null;
  if (raw === null || raw <= 0) return 0;
  return raw * ((fruit.serving_size_g ?? 100) / 100);
}

function boostLockedNutrients(
  plan: PlanEntry[],
  lockedEntryNames: Set<string>,
  fruitMap: Map<string, NutrientFruit>,
  pool: NutrientFruit[],
  used: Set<string>,
  lockedNutrients: Set<NutrientKey>,
  insufficient: Set<NutrientKey>,
  dvMap?: EffectiveDailyValues
): void {
  for (const nutrientKey of lockedNutrients) {
    if (insufficient.has(nutrientKey)) continue;
    const meta = PLAN_NUTRIENTS.find((m) => m.key === nutrientKey);
    if (!meta) continue;
    const dv = resolveDV(meta, dvMap) ?? meta.dailyValue!;
    if (dv <= 0) continue;

    let total = nutrientTotal(plan, fruitMap, nutrientKey);
    if (total >= dv) continue;

    const boostable = plan.filter((e) => {
      if (lockedEntryNames.has(e.name)) return false;
      const f = fruitMap.get(e.name);
      if (!f || e.servingsPerWeek >= maxServingsFor(f)) return false;
      return nutrientDensity(f, nutrientKey) > 0;
    });
    boostable.sort(
      (a, b) => nutrientDensity(fruitMap.get(b.name)!, nutrientKey) - nutrientDensity(fruitMap.get(a.name)!, nutrientKey)
    );

    for (const entry of boostable) {
      if (total >= dv) break;
      const fruit = fruitMap.get(entry.name)!;
      const perServing = nutrientDensity(fruit, nutrientKey);
      const deficit = dv - total;
      const spwNeeded = Math.ceil((deficit / perServing) * 7);
      const cap = maxServingsFor(fruit);
      const newSpw = Math.min(cap, entry.servingsPerWeek + spwNeeded);
      const added = newSpw - entry.servingsPerWeek;
      if (added > 0) {
        entry.servingsPerWeek = newSpw;
        total += perServing * (added / 7);
      }
    }

    if (total >= dv) continue;

    const candidates = pool
      .filter((f) => !used.has(f.name) && nutrientDensity(f, nutrientKey) > 0)
      .sort((a, b) => nutrientDensity(b, nutrientKey) - nutrientDensity(a, nutrientKey));

    for (const fruit of candidates) {
      if (total >= dv) break;
      const perServing = nutrientDensity(fruit, nutrientKey);
      const deficit = dv - total;
      const cap = maxServingsFor(fruit);
      const spw = Math.min(cap, Math.max(1, Math.ceil((deficit / perServing) * 7)));
      plan.push({ name: fruit.name, servingsPerWeek: spw });
      used.add(fruit.name);
      total += perServing * (spw / 7);
    }
  }
}

export function generateAddOne(
  fruits: NutrientFruit[],
  currentEntries: PlanEntry[],
  dvMap?: EffectiveDailyValues,
  budgetTolerance = 10,
  lockedNutrients?: Set<NutrientKey>
): PlanEntry | null {
  const pool = fruits.filter(
    (f) => f.type !== 'spice' && (f.cost_index === null || (f.cost_index as number) <= budgetTolerance)
  );
  const fruitMap = new Map(fruits.map((f) => [f.name, f]));
  const insufficient = getInsufficientNutrients(fruits);

  const totals = new Map<NutrientKey, number>();
  for (const meta of PLAN_NUTRIENTS) {
    totals.set(meta.key, 0);
  }

  const used = new Set<string>();
  for (const entry of currentEntries) {
    used.add(entry.name);
    const fruit = fruitMap.get(entry.name);
    if (!fruit) continue;
    const servingG = fruit.serving_size_g ?? 100;
    const dailyFactor = (servingG / 100) * (entry.servingsPerWeek / 7);
    for (const meta of PLAN_NUTRIENTS) {
      const raw = fruit[meta.key] as number | null;
      if (raw === null) continue;
      totals.set(meta.key, totals.get(meta.key)! + raw * dailyFactor);
    }
  }

  const typeCounts = new Map<string, number>();
  for (const entry of currentEntries) {
    const fruit = fruitMap.get(entry.name);
    if (!fruit) continue;
    typeCounts.set(fruit.type, (typeCounts.get(fruit.type) ?? 0) + 1);
  }

  const scored: ScoredCandidate[] = [];
  for (const fruit of pool) {
    if (used.has(fruit.name)) continue;
    const result = scoreCandidate(fruit, totals, insufficient, dvMap, lockedNutrients);
    if (!result) continue;
    const count = typeCounts.get(fruit.type) ?? 0;
    result.score *= DIVERSITY_DECAY ** count;
    scored.push(result);
  }

  if (scored.length === 0) return null;

  scored.sort((a, b) => b.score - a.score);
  const picked = scored[0];
  return { name: picked.fruit.name, servingsPerWeek: picked.servings };
}

export function generateAutoFillPlan(
  fruits: NutrientFruit[],
  lockedEntries: PlanEntry[] = [],
  maxEntries = 15,
  dvMap?: EffectiveDailyValues,
  budgetTolerance = 10,
  lockedNutrients?: Set<NutrientKey>
): PlanEntry[] {
  const pool = fruits.filter(
    (f) => f.type !== 'spice' && (f.cost_index === null || (f.cost_index as number) <= budgetTolerance)
  );
  const fruitMap = new Map(fruits.map((f) => [f.name, f]));
  const insufficient = getInsufficientNutrients(fruits);

  const totals = new Map<NutrientKey, number>();
  for (const meta of PLAN_NUTRIENTS) {
    totals.set(meta.key, 0);
  }

  const plan: PlanEntry[] = [...lockedEntries];
  const used = new Set<string>(lockedEntries.map((e) => e.name));
  const typeCounts = new Map<string, number>();

  for (const entry of lockedEntries) {
    const fruit = fruitMap.get(entry.name);
    if (!fruit) continue;
    typeCounts.set(fruit.type, (typeCounts.get(fruit.type) ?? 0) + 1);
    const servingG = fruit.serving_size_g ?? 100;
    const dailyFactor = (servingG / 100) * (entry.servingsPerWeek / 7);
    for (const meta of PLAN_NUTRIENTS) {
      const raw = fruit[meta.key] as number | null;
      if (raw === null) continue;
      const contribution = raw * dailyFactor;
      totals.set(meta.key, totals.get(meta.key)! + contribution);
    }
  }

  const slotsToFill = maxEntries - lockedEntries.length;

  for (let round = 0; round < slotsToFill; round++) {
    const scored: ScoredCandidate[] = [];

    for (const fruit of pool) {
      if (used.has(fruit.name)) continue;
      const result = scoreCandidate(fruit, totals, insufficient, dvMap, lockedNutrients);
      if (!result) continue;
      const count = typeCounts.get(fruit.type) ?? 0;
      result.score *= DIVERSITY_DECAY ** count;
      scored.push(result);
    }

    if (scored.length === 0) break;

    scored.sort((a, b) => b.score - a.score);
    const hasUnmetLocked = lockedNutrients && lockedNutrients.size > 0 &&
      [...lockedNutrients].some((key) => {
        if (insufficient.has(key)) return false;
        const meta = PLAN_NUTRIENTS.find((m) => m.key === key);
        if (!meta) return false;
        const dv = resolveDV(meta, dvMap) ?? meta.dailyValue!;
        return totals.get(key)! < dv;
      });
    const picked = hasUnmetLocked
      ? scored[0]
      : weightedRandomPick(scored.slice(0, TOP_N));

    plan.push({ name: picked.fruit.name, servingsPerWeek: picked.servings });
    used.add(picked.fruit.name);
    typeCounts.set(picked.fruit.type, (typeCounts.get(picked.fruit.type) ?? 0) + 1);
    applySelection(picked, totals);
  }

  const lockedNames = new Set(lockedEntries.map((e) => e.name));

  if (lockedNutrients && lockedNutrients.size > 0) {
    boostLockedNutrients(plan, lockedNames, fruitMap, pool, used, lockedNutrients, insufficient, dvMap);
  }

  const calorieMeta = PLAN_NUTRIENTS.find((m) => m.key === 'calories_kcal');
  if (calorieMeta) {
    const calorieDV = resolveDV(calorieMeta, dvMap) ?? calorieMeta.dailyValue!;
    boostCalories(plan, lockedNames, fruitMap, pool, used, calorieDV);
  }

  return plan;
}
