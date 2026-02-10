import type { NutrientKey } from '../types';
import { NUTRIENT_MAP, hasDailyValue } from './nutrition-meta';

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

const dvFormatter = getFormatter(0);

export function toDailyValuePercent(
  value: number | null | undefined,
  key: NutrientKey
): number | null {
  if (value === null || value === undefined) return null;
  const meta = NUTRIENT_MAP.get(key);
  if (!meta || meta.dailyValue === null) return null;
  return (value / meta.dailyValue) * 100;
}

export function formatDailyValue(
  value: number | null | undefined,
  key: NutrientKey
): string {
  const pct = toDailyValuePercent(value, key);
  if (pct === null) return '--';
  if (pct > 0 && pct < 0.5) return '<1%';
  return `${dvFormatter.format(pct)}%`;
}

export function formatNutrientDisplay(
  value: number | null | undefined,
  key: NutrientKey,
  asDailyValue: boolean
): string {
  if (!asDailyValue || !hasDailyValue(key)) return formatNutrient(value, key);
  return formatDailyValue(value, key);
}

export function formatNutrientWithUnitDisplay(
  value: number | null | undefined,
  key: NutrientKey,
  asDailyValue: boolean
): string {
  if (!asDailyValue || !hasDailyValue(key)) return formatNutrientWithUnit(value, key);
  return formatDailyValue(value, key);
}
