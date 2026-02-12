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
}

const PLAN_NUTRIENTS: NutrientMeta[] = NUTRIENT_META.filter(
  (m) => m.dailyValue !== null
);

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
  }));
}

interface ScoredCandidate {
  fruit: NutrientFruit;
  score: number;
  servings: number;
}

function scoreCandidate(
  fruit: NutrientFruit,
  remaining: Map<NutrientKey, number>
): ScoredCandidate | null {
  const servingG = fruit.serving_size_g ?? 100;
  const perNutrientServings: number[] = [];
  let nullCount = 0;

  for (const meta of PLAN_NUTRIENTS) {
    const raw = fruit[meta.key] as number | null;
    if (raw === null) {
      nullCount++;
      continue;
    }
    const perServing = raw * (servingG / 100);
    if (perServing <= 0) continue;
    const rem = remaining.get(meta.key)!;
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
    const raw = fruit[meta.key] as number | null;
    if (raw === null) continue;
    const contribution = raw * dailyFactor;
    const rem = remaining.get(meta.key)!;
    if (rem <= 0) continue;
    score += Math.min(contribution, rem) / meta.dailyValue!;
  }

  const nullPenalty = 1 - (nullCount / PLAN_NUTRIENTS.length) * 0.5;
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
  remaining: Map<NutrientKey, number>
) {
  const servingG = picked.fruit.serving_size_g ?? 100;
  const dailyFactor = (servingG / 100) * (picked.servings / 7);
  for (const meta of PLAN_NUTRIENTS) {
    const raw = picked.fruit[meta.key] as number | null;
    if (raw === null) continue;
    const contribution = raw * dailyFactor;
    remaining.set(meta.key, Math.max(0, remaining.get(meta.key)! - contribution));
  }
}

const TOP_N = 5;

export function generateAutoFillPlan(
  fruits: NutrientFruit[],
  maxEntries = 10
): PlanEntry[] {
  const pool = fruits.filter((f) => f.type !== 'spice');

  const remaining = new Map<NutrientKey, number>();
  for (const meta of PLAN_NUTRIENTS) {
    remaining.set(meta.key, meta.dailyValue!);
  }

  const plan: PlanEntry[] = [];
  const used = new Set<string>();

  for (let round = 0; round < maxEntries; round++) {
    const scored: ScoredCandidate[] = [];

    for (const fruit of pool) {
      if (used.has(fruit.name)) continue;
      const result = scoreCandidate(fruit, remaining);
      if (result) scored.push(result);
    }

    if (scored.length === 0) break;

    scored.sort((a, b) => b.score - a.score);
    const topCandidates = scored.slice(0, TOP_N);
    const picked = weightedRandomPick(topCandidates);

    plan.push({ name: picked.fruit.name, servingsPerWeek: picked.servings });
    used.add(picked.fruit.name);
    applySelection(picked, remaining);
  }

  return plan;
}
