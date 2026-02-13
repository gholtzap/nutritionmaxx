import { useMemo } from 'react';
import { useStore } from '../store';
import { getEffectiveDailyValues } from './daily-values';
import type { EffectiveDailyValues } from './daily-values';

export function useEffectiveDailyValues(): EffectiveDailyValues {
  const userProfile = useStore((s) => s.userProfile);
  const customDailyValues = useStore((s) => s.customDailyValues);

  return useMemo(
    () => getEffectiveDailyValues(userProfile, customDailyValues),
    [userProfile, customDailyValues]
  );
}
