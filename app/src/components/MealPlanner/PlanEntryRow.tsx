import { ArrowsLeftRight, LockSimple, LockSimpleOpen, Minus, Plus, Prohibit, X } from '@phosphor-icons/react';
import { useState } from 'react';
import { useStore } from '../../store';
import type { NutrientFruit, PlanEntry } from '../../types';
import { getHistamineWarning } from '../../utils/dietary';
import type { FoodReplacement } from '../../utils/plan-calculator';
import { servingsLabel } from '../../utils/servings';
import Badge from '../shared/Badge';
import styles from './MealPlanner.module.css';

interface PlanEntryRowProps {
  entry: PlanEntry;
  fruit: NutrientFruit | undefined;
  locked: boolean;
  replacements: FoodReplacement[];
  onReplace: (fromName: string, toName: string) => void;
}

export default function PlanEntryRow({ entry, fruit, locked, replacements, onReplace }: PlanEntryRowProps) {
  const setPlanEntryServings = useStore((s) => s.setPlanEntryServings);
  const removePlanEntry = useStore((s) => s.removePlanEntry);
  const togglePlanEntryLock = useStore((s) => s.togglePlanEntryLock);
  const blockFood = useStore((s) => s.blockFood);
  const histamineSensitivity = useStore((s) => s.histamineSensitivity);
  const histamineWarning = fruit ? getHistamineWarning(fruit, histamineSensitivity) : null;

  const servingLabel = fruit?.serving_label ?? '100g';
  const [draft, setDraft] = useState(String(entry.servingsPerWeek));
  const [editing, setEditing] = useState(false);
  const [showReplacements, setShowReplacements] = useState(false);
  const inputValue = editing ? draft : String(entry.servingsPerWeek);

  function adjust(delta: number) {
    const next = Math.round((entry.servingsPerWeek + delta) * 10) / 10;
    if (next >= 0.5 && next <= 1000) {
      setPlanEntryServings(entry.name, next);
    }
  }

  function commitDraft() {
    setEditing(false);
    const parsed = parseFloat(draft);
    if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 1000) {
      setPlanEntryServings(entry.name, parsed);
    } else {
      setDraft(String(entry.servingsPerWeek));
    }
  }

  return (
    <div className={styles.entryWrap}>
      <div className={`${styles.entryRow} ${locked ? styles.entryRowLocked : ''}`}>
        <div className={styles.entryInfo}>
          <span className={styles.entryName}>{entry.name}</span>
          {fruit && <Badge category={fruit.category} />}
          {histamineWarning && (
            <span className={histamineWarning.severity === 'high' ? styles.histamineHigh : styles.histamineModerate}>
              {histamineWarning.severity === 'high' ? 'High' : 'Mod'}
            </span>
          )}
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
            value={inputValue}
            onFocus={() => {
              setDraft(String(entry.servingsPerWeek));
              setEditing(true);
            }}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitDraft}
            onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
            min={0.5}
            max={1000}
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
            className={`${styles.swapBtn} ${showReplacements ? styles.swapBtnActive : ''}`}
            onClick={() => setShowReplacements((open) => !open)}
            aria-label={`Show replacements for ${entry.name}`}
            aria-expanded={showReplacements}
            disabled={replacements.length === 0}
          >
            <ArrowsLeftRight size={14} />
          </button>
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
      {showReplacements && (
        <div className={styles.replacements}>
          <div className={styles.replacementsHeader}>
            <span>Similar swaps</span>
            <span>Preserves {servingsLabel(entry.servingsPerWeek)}</span>
          </div>
          <div className={styles.replacementList}>
            {replacements.map((replacement) => {
              const warning = getHistamineWarning(replacement.food, histamineSensitivity);
              return (
                <button
                  key={replacement.food.name}
                  type="button"
                  className={styles.replacementItem}
                  onClick={() => {
                    setShowReplacements(false);
                    onReplace(entry.name, replacement.food.name);
                  }}
                >
                  <span className={styles.replacementMain}>
                    <span className={styles.replacementName}>{replacement.food.name}</span>
                    <span className={styles.replacementMeta}>
                      {replacement.food.serving_label ?? '100g'}
                      {replacement.topNutrients.length > 0 && ` · ${replacement.topNutrients.map((n) => n.label).join(', ')}`}
                    </span>
                  </span>
                  <span className={styles.replacementSide}>
                    {warning && (
                      <span className={warning.severity === 'high' ? styles.histamineHigh : styles.histamineModerate}>
                        {warning.severity === 'high' ? 'High' : 'Mod'}
                      </span>
                    )}
                    <span className={styles.replacementMatch}>{replacement.matchPct}%</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
