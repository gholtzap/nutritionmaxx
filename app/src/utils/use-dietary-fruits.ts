import { useMemo } from 'react';
import { useStore } from '../store';
import { isItemExcluded } from './dietary';
import type { NutrientFruit } from '../types';

export function useDietaryFruits(): NutrientFruit[] {
  const fruits = useStore((s) => s.fruits);
  const dietaryPreferences = useStore((s) => s.dietaryPreferences);
  const blockedFoods = useStore((s) => s.blockedFoods);
  return useMemo(
    () => fruits.filter((f) => !isItemExcluded(f, dietaryPreferences) && !blockedFoods.has(f.name)),
    [fruits, dietaryPreferences, blockedFoods]
  );
}
