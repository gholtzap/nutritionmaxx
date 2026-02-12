import type { PlanNutrientRow } from '../../utils/plan-calculator';
import NutrientBar from './NutrientBar';
import styles from './MealPlanner.module.css';

interface NutrientCoverageProps {
  rows: PlanNutrientRow[];
  entryCount: number;
}

const GROUP_LABELS: Record<string, string> = {
  macro: 'Macronutrients',
  vitamin: 'Vitamins',
  mineral: 'Minerals',
};

const GROUP_ORDER = ['macro', 'vitamin', 'mineral'] as const;

export default function NutrientCoverage({ rows, entryCount }: NutrientCoverageProps) {
  const tracked = rows.filter((r) => !r.insufficientData);
  const metCount = tracked.filter((r) => r.dailyValue > 0 && r.total >= r.dailyValue).length;

  return (
    <div className={styles.coverage}>
      <div className={styles.coverageSummary}>
        {metCount} of {tracked.length} nutrients at or above 100% DV
      </div>
      {GROUP_ORDER.map((group) => {
        const groupRows = rows.filter((r) => r.group === group);
        if (groupRows.length === 0) return null;
        return (
          <div key={group} className={styles.coverageGroup}>
            <div className={styles.coverageGroupLabel}>{GROUP_LABELS[group]}</div>
            {groupRows.map((row) => (
              <NutrientBar key={row.key} row={row} entryCount={entryCount} />
            ))}
          </div>
        );
      })}
      <p className={styles.disclaimer}>
        Based on produce-only data. A complete diet includes grains, proteins,
        dairy, and fats not tracked here.
      </p>
    </div>
  );
}
