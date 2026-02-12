import type { NutrientFruit, NutrientKey, PlanEntry } from '../types';
import { NUTRIENT_META } from './nutrition-meta';
import type { NutrientMeta } from './nutrition-meta';

export interface PlanNutrientRow {
  key: NutrientKey;
  label: string;
  unit: string;
  group: 'macro' | 'vitamin' | 'mineral';
  dailyValue: number;
  total: number;
  nullCount: number;
  insufficientData: boolean;
}

const PLAN_NUTRIENTS: NutrientMeta[] = NUTRIENT_META.filter(
  (m) => m.dailyValue !== null
);

const INSUFFICIENT_THRESHOLD = 0.5;
const EXCESS_THRESHOLD = 2.0;
const EXCESS_PENALTY = 0.3;

function getInsufficientNutrients(fruits: NutrientFruit[]): Set<NutrientKey> {
  const result = new Set<NutrientKey>();
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
  fruits: NutrientFruit[]
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
    dailyValue: meta.dailyValue!,
    total: totals.get(meta.key)!,
    nullCount: nullCounts.get(meta.key)!,
    insufficientData: insufficient.has(meta.key),
  }));
}

interface ScoredCandidate {
  fruit: NutrientFruit;
  score: number;
  servings: number;
}

function scoreCandidate(
  fruit: NutrientFruit,
  totals: Map<NutrientKey, number>,
  insufficient: Set<NutrientKey>
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
    const rem = Math.max(0, meta.dailyValue! - totals.get(meta.key)!);
    if (rem <= 0) continue;
    const needed = rem / perServing;
    perNutrientServings.push(needed);
  }

  if (perNutrientServings.length === 0) return null;

  perNutrientServings.sort((a, b) => a - b);
  const median = perNutrientServings[Math.floor(perNutrientServings.length / 2)];
  const servings = Math.max(1, Math.min(14, Math.round(median * 7)));

  const dailyFactor = (servingG / 100) * (servings / 7);
  let score = 0;
  for (const meta of PLAN_NUTRIENTS) {
    if (insufficient.has(meta.key)) continue;
    const raw = fruit[meta.key] as number | null;
    if (raw === null) continue;
    const contribution = raw * dailyFactor;
    const total = totals.get(meta.key)!;
    const dv = meta.dailyValue!;
    const rem = Math.max(0, dv - total);
    if (rem > 0) {
      score += Math.min(contribution, rem) / dv;
    }
    const cap = dv * EXCESS_THRESHOLD;
    const addedExcess =
      Math.max(0, total + contribution - cap) - Math.max(0, total - cap);
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

const TOP_N = 5;
const DIVERSITY_DECAY = 0.7;

export function generateAutoFillPlan(
  fruits: NutrientFruit[],
  lockedEntries: PlanEntry[] = [],
  maxEntries = 10
): PlanEntry[] {
  const pool = fruits.filter((f) => f.type !== 'spice');
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
      const result = scoreCandidate(fruit, totals, insufficient);
      if (!result) continue;
      const count = typeCounts.get(fruit.type) ?? 0;
      result.score *= DIVERSITY_DECAY ** count;
      scored.push(result);
    }

    if (scored.length === 0) break;

    scored.sort((a, b) => b.score - a.score);
    const topCandidates = scored.slice(0, TOP_N);
    const picked = weightedRandomPick(topCandidates);

    plan.push({ name: picked.fruit.name, servingsPerWeek: picked.servings });
    used.add(picked.fruit.name);
    typeCounts.set(picked.fruit.type, (typeCounts.get(picked.fruit.type) ?? 0) + 1);
    applySelection(picked, totals);
  }

  return plan;
}
