import { useMemo, useCallback } from 'react';
import { useStore } from '../store';
import { useEffectiveDailyValues } from './use-effective-daily-values';
import { computeNutrientDensityScore } from './compute-score';
import { computePersonalizedConfig, hasPersonalization } from './personalized-score';
import { DEFAULT_SCORE_CONFIG } from './score-defaults';
import type { NutrientFruit } from '../types';

export function usePersonalizedScoreFunction(): ((item: NutrientFruit) => number | null) | null {
  const scoreNutrients = useStore((s) => s.scoreNutrients);
  const userProfile = useStore((s) => s.userProfile);
  const dietaryPreferences = useStore((s) => s.dietaryPreferences);
  const personalization = useStore((s) => s.personalization);
  const dvMap = useEffectiveDailyValues();

  const active = useMemo(
    () => hasPersonalization(userProfile, dietaryPreferences, personalization),
    [userProfile, dietaryPreferences, personalization]
  );

  const config = useMemo(() => {
    if (!active) return null;
    return computePersonalizedConfig(userProfile, dietaryPreferences, personalization, DEFAULT_SCORE_CONFIG);
  }, [active, userProfile, dietaryPreferences, personalization]);

  const scoreFn = useCallback(
    (item: NutrientFruit) => {
      if (!config) return null;
      return computeNutrientDensityScore(item, scoreNutrients, dvMap, config);
    },
    [config, scoreNutrients, dvMap]
  );

  if (!active) return null;
  return scoreFn;
}
