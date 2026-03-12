import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ShareNetwork, Check, Trash, Lightning, Export, CircleNotch, Plus } from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { ItemType } from '../../types';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import { computePlanDailyTotals, generateAutoFillPlan, generateAddOne } from '../../utils/plan-calculator';
import { useEffectiveDailyValues } from '../../utils/use-effective-daily-values';
import { useRateLimit } from '../../utils/use-rate-limit.ts';
import PlanFoodSelector from './PlanFoodSelector';
import PlanEntryRow, { servingsLabel } from './PlanEntryRow';
import NutrientCoverage from './NutrientCoverage';
import RateLimitNotice from '../shared/RateLimitNotice';
import styles from './MealPlanner.module.css';

const TYPE_GROUP_LABELS: Record<ItemType, string> = {
  fruit: 'FRUITS',
  vegetable: 'VEGETABLES',
  grain: 'GRAINS',
  legume: 'LEGUMES',
  nut_seed: 'NUTS & SEEDS',
  fish_seafood: 'FISH & SEAFOOD',
  poultry: 'POULTRY',
  beef: 'BEEF',
  pork: 'PORK',
  fat_oil: 'FATS & OILS',
  dairy: 'DAIRY',
  egg: 'EGGS',
  lamb: 'LAMB',
  spice: 'SPICES',
};

const BUDGET_LABELS: Record<number, string> = {
  1: '$',
  2: '$',
  3: '$$',
  4: '$$',
  5: '$$$',
  6: '$$$',
  7: '$$$$',
  8: '$$$$',
  9: '$$$$$',
  10: 'Any',
};

export default function MealPlanner() {
  const fruits = useDietaryFruits();
  const planEntries = useStore((s) => s.planEntries);
  const lockedPlanEntries = useStore((s) => s.lockedPlanEntries);
  const clearPlan = useStore((s) => s.clearPlan);
  const setPlanEntries = useStore((s) => s.setPlanEntries);
  const budgetTolerance = useStore((s) => s.budgetTolerance);
  const setBudgetTolerance = useStore((s) => s.setBudgetTolerance);
  const lockedNutrients = useStore((s) => s.lockedNutrients);
  const dvMap = useEffectiveDailyValues();

  const autoFillLimit = useRateLimit({ action: 'autofill', windowMs: 60_000, maxRequests: 10, checkServer: true });
  const shareLimit = useRateLimit({ action: 'share', windowMs: 60_000, maxRequests: 20 });

  const [copied, setCopied] = useState(false);
  const [isAutoFilling, setIsAutoFilling] = useState(false);
  const [isAddingOne, setIsAddingOne] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  const fruitMap = useMemo(
    () => new Map(fruits.map((f) => [f.name, f])),
    [fruits]
  );

  const nutrientRows = useMemo(
    () => computePlanDailyTotals(planEntries, fruits, dvMap),
    [planEntries, fruits, dvMap]
  );

  const handleShare = useCallback(async () => {
    if (planEntries.length === 0) return;
    const allowed = await shareLimit.checkLimit();
    if (!allowed) return;
    const url = new URL(window.location.href);
    url.searchParams.set(
      'plan',
      planEntries.map((e) => `${e.name}:${e.servingsPerWeek}`).join(',')
    );
    url.searchParams.delete('food');
    url.searchParams.delete('compare');
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1500);
  }, [planEntries, shareLimit]);

  const handleExport = useCallback(() => {
    if (planEntries.length === 0) return;

    const groups = new Map<string, string[]>();
    for (const entry of planEntries) {
      const fruit = fruitMap.get(entry.name);
      const type = fruit?.type ?? 'other';
      const label = TYPE_GROUP_LABELS[type as ItemType] ?? type.toUpperCase();
      if (!groups.has(label)) groups.set(label, []);
      const serving = fruit?.serving_label ?? '100g';
      groups.get(label)!.push(`  ${entry.name} — ${servingsLabel(entry.servingsPerWeek)} (${serving})`);
    }

    const lines: string[] = ['WEEKLY MEAL PLAN', ''];
    for (const [label, items] of groups) {
      lines.push(label);
      lines.push(...items);
      lines.push('');
    }

    const tracked = nutrientRows.filter((r) => !r.insufficientData);
    const metCount = tracked.filter((r) => r.dailyValue > 0 && r.total >= r.dailyValue).length;
    lines.push(`NUTRIENT COVERAGE (${metCount} of ${tracked.length} at or above 100% DV)`);
    for (const row of tracked) {
      const pct = row.dailyValue > 0 ? Math.round((row.total / row.dailyValue) * 100) : 0;
      const total = row.total < 10 ? row.total.toFixed(1) : Math.round(row.total).toLocaleString();
      lines.push(`  ${row.label.padEnd(16)}${total} ${row.unit.padEnd(10)}${pct}%`);
    }

    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1500);
  }, [planEntries, fruitMap, nutrientRows]);

  const handleAddOne = useCallback(async () => {
    setIsAddingOne(true);
    try {
      const allowed = await autoFillLimit.checkLimit();
      if (!allowed) return;
      const entry = generateAddOne(fruits, planEntries, dvMap, budgetTolerance, lockedNutrients);
      if (entry) setPlanEntries([...planEntries, entry]);
    } finally {
      setIsAddingOne(false);
    }
  }, [fruits, planEntries, setPlanEntries, dvMap, autoFillLimit, budgetTolerance, lockedNutrients]);

  const handleAutoFill = useCallback(async () => {
    setIsAutoFilling(true);
    try {
      const allowed = await autoFillLimit.checkLimit();
      if (!allowed) return;
      const locked = planEntries.filter((e) => lockedPlanEntries.has(e.name));
      const plan = generateAutoFillPlan(fruits, locked, 10, dvMap, budgetTolerance, lockedNutrients);
      setPlanEntries(plan);
    } finally {
      setIsAutoFilling(false);
    }
  }, [fruits, planEntries, lockedPlanEntries, setPlanEntries, dvMap, autoFillLimit, budgetTolerance, lockedNutrients]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Meal Planner</h2>
          <p className={styles.subtitle}>
            Plan your weekly produce intake and see nutrient coverage vs daily values
          </p>
        </div>
        <div className={styles.headerActions}>
          {planEntries.length > 0 && (
            <>
              <button
                type="button"
                className={`${styles.actionButton} ${copied ? styles.actionButtonCopied : ''}`}
                onClick={handleShare}
              >
                {copied ? <Check size={14} /> : <ShareNetwork size={14} />}
                <span>{copied ? 'Copied' : 'Share'}</span>
              </button>
              <button
                type="button"
                className={`${styles.actionButton} ${copied ? styles.actionButtonCopied : ''}`}
                onClick={handleExport}
              >
                {copied ? <Check size={14} /> : <Export size={14} />}
                <span>{copied ? 'Copied' : 'Export'}</span>
              </button>
              <button
                type="button"
                className={styles.actionButton}
                onClick={clearPlan}
              >
                <Trash size={14} />
                <span>Clear</span>
              </button>
            </>
          )}
          <button
            type="button"
            className={styles.addOneButton}
            onClick={handleAddOne}
            disabled={autoFillLimit.isLimited || isAddingOne}
          >
            {isAddingOne
              ? <CircleNotch size={14} className={styles.spinner} />
              : <Plus size={14} weight="bold" />}
            <span>{isAddingOne ? 'Adding...' : 'Add 1'}</span>
          </button>
          <button
            type="button"
            className={styles.autoFillButton}
            onClick={handleAutoFill}
            disabled={autoFillLimit.isLimited || isAutoFilling}
          >
            {isAutoFilling
              ? <CircleNotch size={14} className={styles.spinner} />
              : <Lightning size={14} weight="fill" />}
            <span>{isAutoFilling ? 'Generating...' : 'Auto-fill'}</span>
          </button>
          {autoFillLimit.isLimited && (
            <RateLimitNotice retryAfterMs={autoFillLimit.retryAfterMs} />
          )}
          {shareLimit.isLimited && (
            <RateLimitNotice retryAfterMs={shareLimit.retryAfterMs} />
          )}
        </div>
      </div>

      <div className={styles.budgetRow}>
        <span className={styles.budgetLabel}>Budget</span>
        <input
          type="range"
          className={styles.budgetSlider}
          min={1}
          max={10}
          step={1}
          value={budgetTolerance}
          onChange={(e) => setBudgetTolerance(Number(e.target.value))}
        />
        <span className={styles.budgetValue}>{BUDGET_LABELS[budgetTolerance]}</span>
      </div>

      <PlanFoodSelector />

      {planEntries.length > 0 && (
        <div className={styles.entries}>
          {planEntries.map((entry) => (
            <PlanEntryRow
              key={entry.name}
              entry={entry}
              fruit={fruitMap.get(entry.name)}
              locked={lockedPlanEntries.has(entry.name)}
            />
          ))}
        </div>
      )}

      {planEntries.length === 0 && (
        <div className={styles.empty}>
          Add foods above or use Auto-fill to generate a plan.
        </div>
      )}

      {planEntries.length > 0 && (
        <NutrientCoverage rows={nutrientRows} entryCount={planEntries.length} lockedNutrients={lockedNutrients} />
      )}
    </div>
  );
}
