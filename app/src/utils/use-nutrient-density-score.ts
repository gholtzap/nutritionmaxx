import { useCallback } from 'react';
import { useStore } from '../store';
import { useEffectiveDailyValues } from './use-effective-daily-values';
import { computeNutrientDensityScore } from './compute-score';
import { DEFAULT_SCORE_CONFIG } from './score-defaults';
import type { NutrientFruit } from '../types';

export function useScoreFunction(): (item: NutrientFruit) => number | null {
  const scoreNutrients = useStore((s) => s.scoreNutrients);
  const dvMap = useEffectiveDailyValues();

  return useCallback(
    (item: NutrientFruit) => computeNutrientDensityScore(item, scoreNutrients, dvMap, DEFAULT_SCORE_CONFIG),
    [scoreNutrients, dvMap]
  );
}
