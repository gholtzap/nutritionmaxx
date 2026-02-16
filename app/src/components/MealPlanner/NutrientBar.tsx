import { LockSimple, LockSimpleOpen } from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { PlanNutrientRow } from '../../utils/plan-calculator';
import styles from './MealPlanner.module.css';

function barColor(pct: number): string {
  if (pct >= 100) return 'hsl(142, 60%, 45%)';
  if (pct >= 75) return 'hsl(120, 45%, 42%)';
  if (pct >= 50) return 'hsl(50, 80%, 50%)';
  if (pct >= 25) return 'hsl(30, 85%, 50%)';
  return 'hsl(0, 70%, 50%)';
}

interface NutrientBarProps {
  row: PlanNutrientRow;
  entryCount: number;
  locked: boolean;
}

export default function NutrientBar({ row, entryCount, locked }: NutrientBarProps) {
  const toggleLockedNutrient = useStore((s) => s.toggleLockedNutrient);

  if (row.insufficientData) {
    return (
      <div className={`${styles.barRow} ${styles.barRowInsufficient}`}>
        <div className={styles.barLabel}>
          <span className={styles.barName}>{row.label}</span>
          <span className={styles.barValue}>Insufficient data</span>
        </div>
        <div className={styles.barTrack}>
          <div className={styles.barFill} style={{ width: 0 }} />
        </div>
        <span className={styles.barPct}>--</span>
        <span className={styles.nutrientLockPlaceholder} />
        {row.note && <span className={styles.barTooltip}>{row.note}</span>}
      </div>
    );
  }

  const pct = row.dailyValue > 0 ? (row.total / row.dailyValue) * 100 : 0;
  const clampedWidth = Math.min(pct, 100);
  const color = barColor(pct);

  return (
    <div className={styles.barRow}>
      <div className={styles.barLabel}>
        <span className={styles.barName}>{row.label}</span>
        <span className={styles.barValue}>
          {row.total < 0.01 && row.total > 0
            ? '<0.01'
            : row.total.toFixed(row.unit === 'kcal' ? 0 : 1)}
          {' '}{row.unit}
          {row.nullCount > 0 && entryCount > 0 && (
            <span className={styles.barNull}>
              ({row.nullCount}/{entryCount} missing)
            </span>
          )}
        </span>
      </div>
      <div className={styles.barTrack}>
        <div
          className={styles.barFill}
          style={{ width: `${clampedWidth}%`, background: color }}
        />
      </div>
      <span className={styles.barPct} style={{ color }}>
        {pct.toFixed(0)}%
      </span>
      <button
        type="button"
        className={`${styles.nutrientLockBtn} ${locked ? styles.nutrientLockBtnActive : ''}`}
        onClick={() => toggleLockedNutrient(row.key)}
        aria-label={locked ? `Unlock ${row.label}` : `Lock ${row.label}`}
      >
        {locked ? <LockSimple size={12} weight="fill" /> : <LockSimpleOpen size={12} />}
      </button>
    </div>
  );
}
