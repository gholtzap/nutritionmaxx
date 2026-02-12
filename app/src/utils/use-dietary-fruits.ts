import { useMemo } from 'react';
import { useStore } from '../store';
import { isItemExcluded } from './dietary';
import type { NutrientFruit } from '../types';

export function useDietaryFruits(): NutrientFruit[] {
  const fruits = useStore((s) => s.fruits);
  const dietaryPreferences = useStore((s) => s.dietaryPreferences);
  return useMemo(
    () => fruits.filter((f) => !isItemExcluded(f, dietaryPreferences)),
    [fruits, dietaryPreferences]
  );
}
