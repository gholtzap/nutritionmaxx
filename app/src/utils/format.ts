import type { NutrientKey } from '../types';
import { NUTRIENT_MAP } from './nutrition-meta';

const formatters = new Map<number, Intl.NumberFormat>();

function getFormatter(decimals: number): Intl.NumberFormat {
  let fmt = formatters.get(decimals);
  if (!fmt) {
    fmt = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    formatters.set(decimals, fmt);
  }
  return fmt;
}

export function formatNutrient(
  value: number | null | undefined,
  key: NutrientKey
): string {
  if (value === null || value === undefined) return '--';
  const meta = NUTRIENT_MAP.get(key);
  if (!meta) return String(value);
  return getFormatter(meta.decimals).format(value);
}

export function formatNutrientWithUnit(
  value: number | null | undefined,
  key: NutrientKey
): string {
  if (value === null || value === undefined) return '--';
  const meta = NUTRIENT_MAP.get(key);
  if (!meta) return String(value);
  return `${getFormatter(meta.decimals).format(value)} ${meta.unit}`;
}
