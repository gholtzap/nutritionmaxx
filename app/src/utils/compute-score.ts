import type { NutrientFruit, NutrientKey } from '../types';
import type { ScoreConfig } from './score-defaults';

export interface NutrientBreakdownEntry {
  key: NutrientKey;
  percentDV: number;
  weight: number;
  baseWeight: number;
  contribution: number;
  sharePercent: number;
}

export interface PenaltyEntry {
  key: NutrientKey;
  percentDV: number;
}

export interface ScoreBreakdownData {
  finalScore: number;
  beneficialAvg: number;
  penaltyMultiplier: number;
  penaltyScale: number;
  caloriesFactor: number;
  nutrients: NutrientBreakdownEntry[];
  penalties: PenaltyEntry[];
}

export function computeScoreBreakdown(
  item: NutrientFruit,
  selectedNutrients: Set<NutrientKey>,
  dvMap: Map<NutrientKey, number | null>,
  config: ScoreConfig,
  baseConfig: ScoreConfig
): ScoreBreakdownData | null {
  const calories = item.calories_kcal;
  if (calories === null || calories === 0) return null;

  const entries: NutrientBreakdownEntry[] = [];
  let beneficialWeightedSum = 0;
  let beneficialWeightSum = 0;
  let beneficialCount = 0;

  for (const key of selectedNutrients) {
    const value = item[key];
    if (value === null) continue;
    const dv = dvMap.get(key);
    if (dv === null || dv === undefined || dv === 0) continue;

    const percentDV = Math.min((value / dv) * 100, 100);
    const weight = config.weights.get(key) ?? 1;
    const baseWeight = baseConfig.weights.get(key) ?? 1;
    const contribution = percentDV * weight;

    entries.push({ key, percentDV, weight, baseWeight, contribution, sharePercent: 0 });
    beneficialWeightedSum += contribution;
    beneficialWeightSum += weight;
    beneficialCount++;
  }

  const penalties: PenaltyEntry[] = [];
  let penaltySum = 0;
  let penaltyCount = 0;

  for (const key of config.penaltyNutrients) {
    const value = item[key];
    if (value === null) continue;
    const dv = dvMap.get(key);
    if (dv === null || dv === undefined || dv === 0) continue;

    const percentDV = (value / dv) * 100;
    penalties.push({ key, percentDV });
    penaltySum += percentDV;
    penaltyCount++;
  }

  if (beneficialCount < config.minNutrientCount) return null;

  const beneficialAvg = beneficialWeightedSum / beneficialWeightSum;
  const penaltyAvg = penaltyCount > 0 ? penaltySum / penaltyCount : 0;
  const penaltyMultiplier = Math.max(0, 1 - penaltyAvg / config.penaltyScale);
  const caloriesFactor = 100 / calories;
  const finalScore = beneficialAvg * penaltyMultiplier * caloriesFactor;

  if (beneficialWeightedSum > 0) {
    for (const entry of entries) {
      entry.sharePercent = (entry.contribution / beneficialWeightedSum) * 100;
    }
  }

  entries.sort((a, b) => b.contribution - a.contribution);

  return {
    finalScore,
    beneficialAvg,
    penaltyMultiplier,
    penaltyScale: config.penaltyScale,
    caloriesFactor,
    nutrients: entries,
    penalties,
  };
}

export function computeNutrientDensityScore(
  item: NutrientFruit,
  selectedNutrients: Set<NutrientKey>,
  dvMap: Map<NutrientKey, number | null>,
  config: ScoreConfig
): number | null {
  const calories = item.calories_kcal;
  if (calories === null || calories === 0) return null;

  let beneficialWeightedSum = 0;
  let beneficialWeightSum = 0;
  let beneficialCount = 0;

  let penaltySum = 0;
  let penaltyCount = 0;

  for (const key of selectedNutrients) {
    const value = item[key];
    if (value === null) continue;
    const dv = dvMap.get(key);
    if (dv === null || dv === undefined || dv === 0) continue;

    const cappedDV = Math.min((value / dv) * 100, 100);
    const weight = config.weights.get(key) ?? 1;

    beneficialWeightedSum += cappedDV * weight;
    beneficialWeightSum += weight;
    beneficialCount++;
  }

  for (const key of config.penaltyNutrients) {
    const value = item[key];
    if (value === null) continue;
    const dv = dvMap.get(key);
    if (dv === null || dv === undefined || dv === 0) continue;

    const pctDV = (value / dv) * 100;
    penaltySum += pctDV;
    penaltyCount++;
  }

  if (beneficialCount < config.minNutrientCount) return null;

  const beneficialAvg = beneficialWeightedSum / beneficialWeightSum;
  const penaltyAvg = penaltyCount > 0 ? penaltySum / penaltyCount : 0;
  const penaltyMultiplier = Math.max(0, 1 - penaltyAvg / config.penaltyScale);

  return beneficialAvg * penaltyMultiplier * (100 / calories);
}
