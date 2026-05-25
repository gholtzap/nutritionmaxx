import type { HistamineSensitivity, NutrientFruit, NutrientKey, PlanEntry } from '../types';
import { computePlanDailyTotals, generateAddOne } from './plan-calculator';
import type { PlanNutrientRow } from './plan-calculator';
import type { EffectiveDailyValues } from './daily-values';
import { getHistamineWarning } from './dietary';

export interface AuditNutrientFinding {
  key: NutrientKey;
  label: string;
  unit: string;
  total: number;
  dailyValue: number;
  percent: number;
  severity: number;
  note?: string;
}

export interface AuditMissingData {
  key: NutrientKey;
  label: string;
  nullCount: number;
  entryCount: number;
  insufficientData: boolean;
  note?: string;
}

export interface AuditFix {
  id: string;
  type: 'add' | 'swap';
  title: string;
  detail: string;
  entries: PlanEntry[];
  improves: { key: NutrientKey; label: string; before: number; after: number }[];
  score: number;
}

export interface DietAuditAnalysis {
  rows: PlanNutrientRow[];
  gaps: AuditNutrientFinding[];
  excesses: AuditNutrientFinding[];
  missingData: AuditMissingData[];
  confidence: number;
  fixes: AuditFix[];
  fixedEntries: PlanEntry[];
}

const GAP_THRESHOLD = 0.9;
const DEFAULT_EXCESS_THRESHOLD = 2;
const MACRO_EXCESS_THRESHOLDS: Partial<Record<NutrientKey, number>> = {
  calories_kcal: 1.3,
  fat_g: 1.5,
  sugars_g: 1.5,
  sodium_mg: 1.1,
};

const EXCLUDED_GAP_KEYS: Set<NutrientKey> = new Set(['sodium_mg', 'sugars_g']);
function percentFor(row: PlanNutrientRow): number {
  if (row.dailyValue <= 0) return 0;
  return (row.total / row.dailyValue) * 100;
}

function roundPercent(value: number): number {
  return Math.max(0, Math.round(value));
}

function formatServing(value: number): string {
  if (Number.isInteger(value)) return String(value);
  return value.toFixed(1).replace(/\.0$/, '');
}

function makeGaps(rows: PlanNutrientRow[]): AuditNutrientFinding[] {
  return rows
    .filter((row) => !row.insufficientData && !EXCLUDED_GAP_KEYS.has(row.key))
    .filter((row) => row.dailyValue > 0 && row.total < row.dailyValue * GAP_THRESHOLD)
    .map((row) => ({
      key: row.key,
      label: row.label,
      unit: row.unit,
      total: row.total,
      dailyValue: row.dailyValue,
      percent: roundPercent(percentFor(row)),
      severity: 1 - row.total / row.dailyValue,
      note: row.note,
    }))
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 5);
}

function makeExcesses(rows: PlanNutrientRow[]): AuditNutrientFinding[] {
  return rows
    .filter((row) => row.dailyValue > 0)
    .filter((row) => row.total > row.dailyValue * (MACRO_EXCESS_THRESHOLDS[row.key] ?? DEFAULT_EXCESS_THRESHOLD))
    .map((row) => {
      const threshold = MACRO_EXCESS_THRESHOLDS[row.key] ?? DEFAULT_EXCESS_THRESHOLD;
      return {
        key: row.key,
        label: row.label,
        unit: row.unit,
        total: row.total,
        dailyValue: row.dailyValue,
        percent: roundPercent(percentFor(row)),
        severity: row.total / (row.dailyValue * threshold),
        note: row.note,
      };
    })
    .sort((a, b) => b.severity - a.severity)
    .slice(0, 5);
}

function makeMissingData(rows: PlanNutrientRow[], entryCount: number): AuditMissingData[] {
  return rows
    .filter((row) => row.insufficientData || row.nullCount > 0)
    .map((row) => ({
      key: row.key,
      label: row.label,
      nullCount: row.nullCount,
      entryCount,
      insufficientData: row.insufficientData,
      note: row.note,
    }))
    .sort((a, b) => Number(b.insufficientData) - Number(a.insufficientData) || b.nullCount - a.nullCount)
    .slice(0, 6);
}

function confidenceFor(rows: PlanNutrientRow[], entryCount: number): number {
  if (entryCount === 0) return 0;
  const tracked = rows.filter((row) => !row.insufficientData);
  if (tracked.length === 0) return 0;
  const known = tracked.reduce((sum, row) => sum + Math.max(0, entryCount - row.nullCount), 0);
  const possible = tracked.length * entryCount;
  const coverage = possible > 0 ? known / possible : 0;
  const entryFactor = Math.min(1, entryCount / 6);
  return Math.max(20, Math.min(95, Math.round((coverage * 0.75 + entryFactor * 0.25) * 100)));
}

function improvementScore(beforeRows: PlanNutrientRow[], afterRows: PlanNutrientRow[], gapKeys: Set<NutrientKey>): number {
  let score = 0;
  for (const key of gapKeys) {
    const before = beforeRows.find((row) => row.key === key);
    const after = afterRows.find((row) => row.key === key);
    if (!before || !after || before.dailyValue <= 0) continue;
    const beforeDeficit = Math.max(0, before.dailyValue - before.total);
    const afterDeficit = Math.max(0, after.dailyValue - after.total);
    score += (beforeDeficit - afterDeficit) / before.dailyValue;
  }
  return score;
}

function improvedNutrients(beforeRows: PlanNutrientRow[], afterRows: PlanNutrientRow[], gapKeys: Set<NutrientKey>) {
  return [...gapKeys]
    .map((key) => {
      const before = beforeRows.find((row) => row.key === key);
      const after = afterRows.find((row) => row.key === key);
      if (!before || !after || after.total <= before.total) return null;
      return {
        key,
        label: before.label,
        before: roundPercent(percentFor(before)),
        after: roundPercent(percentFor(after)),
      };
    })
    .filter((item): item is { key: NutrientKey; label: string; before: number; after: number } => item !== null)
    .sort((a, b) => b.after - b.before - (a.after - a.before))
    .slice(0, 3);
}

function foodByName(foods: NutrientFruit[]): Map<string, NutrientFruit> {
  return new Map(foods.map((food) => [food.name, food]));
}

function isEligible(food: NutrientFruit, budgetTolerance: number): boolean {
  return food.type !== 'spice' && (food.cost_index === null || food.cost_index <= budgetTolerance);
}

function makeAdditionFixes(
  entries: PlanEntry[],
  foods: NutrientFruit[],
  beforeRows: PlanNutrientRow[],
  gapKeys: Set<NutrientKey>,
  dvMap: EffectiveDailyValues,
  budgetTolerance: number,
  histamineSensitivity: HistamineSensitivity
): AuditFix[] {
  const fixes: AuditFix[] = [];
  let draft = [...entries];
  for (let i = 0; i < 5; i++) {
    const addition = generateAddOne(foods, draft, dvMap, budgetTolerance, gapKeys, histamineSensitivity);
    if (!addition) break;
    const next = [...entries, addition];
    const afterRows = computePlanDailyTotals(next, foods, dvMap);
    const score = improvementScore(beforeRows, afterRows, gapKeys);
    const improves = improvedNutrients(beforeRows, afterRows, gapKeys);
    if (score <= 0 || improves.length === 0) break;
    fixes.push({
      id: `add-${addition.name}`,
      type: 'add',
      title: `Add ${addition.name}`,
      detail: `${formatServing(addition.servingsPerWeek)} servings per week improves ${improves.map((item) => item.label).join(', ')}`,
      entries: next,
      improves,
      score,
    });
    draft = [...draft, addition];
  }
  return fixes;
}

function makeSwapFixes(
  entries: PlanEntry[],
  foods: NutrientFruit[],
  beforeRows: PlanNutrientRow[],
  gapKeys: Set<NutrientKey>,
  dvMap: EffectiveDailyValues,
  budgetTolerance: number,
  histamineSensitivity: HistamineSensitivity
): AuditFix[] {
  const fixes: AuditFix[] = [];
  const foodsByName = foodByName(foods);
  const usedNames = new Set(entries.map((entry) => entry.name));

  for (const entry of entries) {
    const current = foodsByName.get(entry.name);
    if (!current) continue;
    const currentCalories = current.calories_kcal ?? 0;
    let best: AuditFix | null = null;

    for (const candidate of foods) {
      if (candidate.name === current.name || usedNames.has(candidate.name) || !isEligible(candidate, budgetTolerance)) continue;
      if (histamineSensitivity !== 'off' && getHistamineWarning(candidate, histamineSensitivity)) continue;
      if (candidate.type !== current.type && candidate.category !== current.category) continue;
      const candidateCalories = candidate.calories_kcal ?? 0;
      if (currentCalories > 0 && candidateCalories > 0) {
        const ratio = candidateCalories / currentCalories;
        if (ratio < 0.5 || ratio > 2) continue;
      }
      const next = entries.map((item) =>
        item.name === entry.name ? { ...item, name: candidate.name } : item
      );
      const afterRows = computePlanDailyTotals(next, foods, dvMap);
      const score = improvementScore(beforeRows, afterRows, gapKeys);
      const improves = improvedNutrients(beforeRows, afterRows, gapKeys);
      if (score <= 0 || improves.length === 0) continue;
      const fix: AuditFix = {
        id: `swap-${entry.name}-${candidate.name}`,
        type: 'swap',
        title: `Swap ${entry.name} for ${candidate.name}`,
        detail: `Keeps ${formatServing(entry.servingsPerWeek)} weekly servings and improves ${improves.map((item) => item.label).join(', ')}`,
        entries: next,
        improves,
        score,
      };
      if (!best || fix.score > best.score) best = fix;
    }

    if (best) fixes.push(best);
  }

  return fixes.sort((a, b) => b.score - a.score).slice(0, 5);
}

function makeFixedEntries(entries: PlanEntry[], fixes: AuditFix[]): PlanEntry[] {
  if (fixes.length === 0) return entries;
  return fixes[0].entries;
}

export function analyzeDietAudit(
  entries: PlanEntry[],
  foods: NutrientFruit[],
  dvMap: EffectiveDailyValues,
  budgetTolerance: number,
  histamineSensitivity: HistamineSensitivity
): DietAuditAnalysis {
  const rows = computePlanDailyTotals(entries, foods, dvMap);
  const gaps = makeGaps(rows);
  const excesses = makeExcesses(rows);
  const missingData = makeMissingData(rows, entries.length);
  const confidence = confidenceFor(rows, entries.length);
  const gapKeys = new Set(gaps.map((gap) => gap.key));
  const additionFixes = makeAdditionFixes(entries, foods, rows, gapKeys, dvMap, budgetTolerance, histamineSensitivity);
  const swapFixes = makeSwapFixes(entries, foods, rows, gapKeys, dvMap, budgetTolerance, histamineSensitivity);
  const fixes = [...additionFixes, ...swapFixes]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    rows,
    gaps,
    excesses,
    missingData,
    confidence,
    fixes,
    fixedEntries: makeFixedEntries(entries, fixes),
  };
}
