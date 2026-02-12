import { Minus, Plus, X } from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { NutrientFruit, PlanEntry } from '../../types';
import Badge from '../shared/Badge';
import styles from './MealPlanner.module.css';

interface PlanEntryRowProps {
  entry: PlanEntry;
  fruit: NutrientFruit | undefined;
}

function servingsLabel(spw: number): string {
  if (spw === 7) return 'daily';
  if (spw === 14) return '2x daily';
  if (spw === 3.5) return 'every other day';
  return `${spw}x / week`;
}

export default function PlanEntryRow({ entry, fruit }: PlanEntryRowProps) {
  const setPlanEntryServings = useStore((s) => s.setPlanEntryServings);
  const removePlanEntry = useStore((s) => s.removePlanEntry);

  const servingLabel = fruit?.serving_label ?? '100g';

  function adjust(delta: number) {
    const next = Math.round((entry.servingsPerWeek + delta) * 10) / 10;
    if (next >= 0.5 && next <= 21) {
      setPlanEntryServings(entry.name, next);
    }
  }

  function handleInput(value: string) {
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 21) {
      setPlanEntryServings(entry.name, parsed);
    }
  }

  return (
    <div className={styles.entryRow}>
      <div className={styles.entryInfo}>
        <span className={styles.entryName}>{entry.name}</span>
        {fruit && <Badge category={fruit.category} />}
        <span className={styles.entryServing}>{servingLabel}</span>
      </div>
      <div className={styles.entryControls}>
        <button
          type="button"
          className={styles.stepperBtn}
          onClick={() => adjust(-1)}
          aria-label="Decrease servings"
        >
          <Minus size={12} />
        </button>
        <input
          type="number"
          className={styles.stepperInput}
          value={entry.servingsPerWeek}
          onChange={(e) => handleInput(e.target.value)}
          min={0.5}
          max={21}
          step={0.5}
        />
        <button
          type="button"
          className={styles.stepperBtn}
          onClick={() => adjust(1)}
          aria-label="Increase servings"
        >
          <Plus size={12} />
        </button>
        <span className={styles.entryFreq}>{servingsLabel(entry.servingsPerWeek)}</span>
        <button
          type="button"
          className={styles.removeBtn}
          onClick={() => removePlanEntry(entry.name)}
          aria-label={`Remove ${entry.name}`}
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
