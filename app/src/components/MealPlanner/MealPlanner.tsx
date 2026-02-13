import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { ShareNetwork, Check, Trash, Lightning } from '@phosphor-icons/react';
import { useStore } from '../../store';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import { computePlanDailyTotals, generateAutoFillPlan } from '../../utils/plan-calculator';
import { useEffectiveDailyValues } from '../../utils/use-effective-daily-values';
import PlanFoodSelector from './PlanFoodSelector';
import PlanEntryRow from './PlanEntryRow';
import NutrientCoverage from './NutrientCoverage';
import styles from './MealPlanner.module.css';

export default function MealPlanner() {
  const fruits = useDietaryFruits();
  const planEntries = useStore((s) => s.planEntries);
  const lockedPlanEntries = useStore((s) => s.lockedPlanEntries);
  const clearPlan = useStore((s) => s.clearPlan);
  const setPlanEntries = useStore((s) => s.setPlanEntries);
  const dvMap = useEffectiveDailyValues();

  const [copied, setCopied] = useState(false);
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

  const handleShare = useCallback(() => {
    if (planEntries.length === 0) return;
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
  }, [planEntries]);

  const handleAutoFill = useCallback(() => {
    const locked = planEntries.filter((e) => lockedPlanEntries.has(e.name));
    const plan = generateAutoFillPlan(fruits, locked, 10, dvMap);
    setPlanEntries(plan);
  }, [fruits, planEntries, lockedPlanEntries, setPlanEntries, dvMap]);

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
            className={styles.autoFillButton}
            onClick={handleAutoFill}
          >
            <Lightning size={14} weight="fill" />
            <span>Auto-fill</span>
          </button>
        </div>
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
        <NutrientCoverage rows={nutrientRows} entryCount={planEntries.length} />
      )}
    </div>
  );
}
