import type { NutrientFruit, NutrientKey } from '../types';
import { NUTRIENT_META } from './nutrition-meta';

interface SimilarFood {
  food: NutrientFruit;
  similarity: number;
}

const SIMILARITY_NUTRIENTS = NUTRIENT_META.filter(
  (m) => m.dailyValue !== null && m.key !== 'calories_kcal'
);

const MIN_SHARED_DIMENSIONS = 5;

function cosineSimilarity(a: NutrientFruit, b: NutrientFruit): number | null {
  let dot = 0;
  let magA = 0;
  let magB = 0;
  let shared = 0;

  for (const meta of SIMILARITY_NUTRIENTS) {
    const key = meta.key as NutrientKey;
    const va = a[key];
    const vb = b[key];
    if (va === null || vb === null) continue;

    const dv = meta.dailyValue!;
    const na = (va as number) / dv;
    const nb = (vb as number) / dv;

    dot += na * nb;
    magA += na * na;
    magB += nb * nb;
    shared++;
  }

  if (shared < MIN_SHARED_DIMENSIONS) return null;

  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  if (denom === 0) return null;

  return dot / denom;
}

export function findSimilarFoods(
  target: NutrientFruit,
  allFoods: NutrientFruit[],
  count: number = 5
): SimilarFood[] {
  const results: SimilarFood[] = [];

  for (const food of allFoods) {
    if (food.name === target.name) continue;
    const similarity = cosineSimilarity(target, food);
    if (similarity === null) continue;
    results.push({ food, similarity });
  }

  results.sort((a, b) => b.similarity - a.similarity);
  return results.slice(0, count);
}
