import { LockSimple, LockSimpleOpen, Minus, Plus, Prohibit, X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useStore } from '../../store';
import type { NutrientFruit, PlanEntry } from '../../types';
import Badge from '../shared/Badge';
import styles from './MealPlanner.module.css';

interface PlanEntryRowProps {
  entry: PlanEntry;
  fruit: NutrientFruit | undefined;
  locked: boolean;
}

export function servingsLabel(spw: number): string {
  if (spw === 7) return 'daily';
  if (spw === 14) return '2x daily';
  if (spw === 3.5) return 'every other day';
  return `${spw}x / week`;
}

export default function PlanEntryRow({ entry, fruit, locked }: PlanEntryRowProps) {
  const setPlanEntryServings = useStore((s) => s.setPlanEntryServings);
  const removePlanEntry = useStore((s) => s.removePlanEntry);
  const togglePlanEntryLock = useStore((s) => s.togglePlanEntryLock);
  const blockFood = useStore((s) => s.blockFood);

  const servingLabel = fruit?.serving_label ?? '100g';
  const [draft, setDraft] = useState(String(entry.servingsPerWeek));
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!editing) setDraft(String(entry.servingsPerWeek));
  }, [entry.servingsPerWeek, editing]);

  function adjust(delta: number) {
    const next = Math.round((entry.servingsPerWeek + delta) * 10) / 10;
    if (next >= 0.5 && next <= 100) {
      setPlanEntryServings(entry.name, next);
    }
  }

  function commitDraft() {
    setEditing(false);
    const parsed = parseFloat(draft);
    if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 100) {
      setPlanEntryServings(entry.name, parsed);
    } else {
      setDraft(String(entry.servingsPerWeek));
    }
  }

  return (
    <div className={`${styles.entryRow} ${locked ? styles.entryRowLocked : ''}`}>
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
          value={draft}
          onFocus={() => setEditing(true)}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commitDraft}
          onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
          min={0.5}
          max={100}
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
          className={`${styles.lockBtn} ${locked ? styles.lockBtnActive : ''}`}
          onClick={() => togglePlanEntryLock(entry.name)}
          aria-label={locked ? `Unlock ${entry.name}` : `Lock ${entry.name}`}
        >
          {locked ? <LockSimple size={14} /> : <LockSimpleOpen size={14} />}
        </button>
        <button
          type="button"
          className={styles.blockBtn}
          onClick={() => { blockFood(entry.name); removePlanEntry(entry.name); }}
          aria-label={`Block ${entry.name}`}
          title="Block from recommendations"
        >
          <Prohibit size={14} />
        </button>
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
