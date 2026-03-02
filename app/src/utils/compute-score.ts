import type { NutrientFruit, NutrientKey } from '../types';
import type { ScoreConfig } from './score-defaults';

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
