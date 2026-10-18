import { copyText } from '../../utils/clipboard';
import { useState, useMemo, useCallback, useRef } from 'react';
import { Trash, Lightning, Plus, Copy, Check } from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { ItemType } from '../../types';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import { computePlanDailyTotals, findFoodReplacements, generateAutoFillPlan, generateAddOne } from '../../utils/plan-calculator';
import type { FoodReplacement } from '../../utils/plan-calculator';
import { useEffectiveDailyValues } from '../../utils/use-effective-daily-values';
import { useRateLimit } from '../../utils/use-rate-limit';
import { ITEM_TYPE_GROUP_LABELS } from '../../utils/nutrition-meta';
import { generateShareImage } from '../../utils/generate-share-image';
import type { ShareFood } from '../../utils/generate-share-image';
import { servingsLabel } from '../../utils/servings';
import ShareModal, { ShareButton } from './ShareModal';
import PlanFoodSelector from './PlanFoodSelector';
import PlanEntryRow from './PlanEntryRow';
import NutrientCoverage from './NutrientCoverage';
import HistamineSummary from './HistamineSummary';
import RateLimitNotice from '../shared/RateLimitNotice';
import styles from './MealPlanner.module.css';

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
  const setActiveView = useStore((s) => s.setActiveView);
  const togglePlanEntryLock = useStore((s) => s.togglePlanEntryLock);
  const budgetTolerance = useStore((s) => s.budgetTolerance);
  const setBudgetTolerance = useStore((s) => s.setBudgetTolerance);
  const lockedNutrients = useStore((s) => s.lockedNutrients);
  const histamineSensitivity = useStore((s) => s.histamineSensitivity);
  const dvMap = useEffectiveDailyValues();

  const autoFillLimit = useRateLimit({ action: 'autofill', windowMs: 60_000, maxRequests: 10 });
  const shareLimit = useRateLimit({ action: 'share', windowMs: 60_000, maxRequests: 20 });

  const shareButtonRef = useRef<HTMLButtonElement>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [copiedLLM, setCopiedLLM] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [shareModal, setShareModal] = useState<{ blob: Blob; url: string; exportText: string } | null>(null);

  const fruitMap = useMemo(
    () => new Map(fruits.map((f) => [f.name, f])),
    [fruits]
  );

  const nutrientRows = useMemo(
    () => computePlanDailyTotals(planEntries, fruits, dvMap),
    [planEntries, fruits, dvMap]
  );
  const trackedRows = nutrientRows.filter((row) => !row.insufficientData && row.dailyValue > 0);
  const metCount = trackedRows.filter((row) => row.total >= row.dailyValue).length;

  const replacementsByFood = useMemo(() => {
    const map = new Map<string, FoodReplacement[]>();
    for (const entry of planEntries) {
      const fruit = fruitMap.get(entry.name);
      if (!fruit) continue;
      map.set(
        entry.name,
        findFoodReplacements(
          fruit,
          fruits,
          planEntries,
          budgetTolerance,
          histamineSensitivity
        )
      );
    }
    return map;
  }, [planEntries, fruitMap, fruits, budgetTolerance, histamineSensitivity]);

  const buildPlanText = useCallback(() => {
    const groups = new Map<string, string[]>();
    for (const entry of planEntries) {
      const fruit = fruitMap.get(entry.name);
      const type = fruit?.type ?? 'other';
      const label = ITEM_TYPE_GROUP_LABELS[type as ItemType] ?? type;
      if (!groups.has(label)) groups.set(label, []);
      const serving = fruit?.serving_label ?? '100g';
      groups.get(label)!.push(`  ${entry.name} - ${servingsLabel(entry.servingsPerWeek)} (${serving})`);
    }
    const lines: string[] = ['Weekly meal plan', ''];
    for (const [label, items] of groups) {
      lines.push(label);
      lines.push(...items);
      lines.push('');
    }
    const tracked = nutrientRows.filter((r) => !r.insufficientData);
    const metCount = tracked.filter((r) => r.dailyValue > 0 && r.total >= r.dailyValue).length;
    lines.push(`Nutrient coverage (${metCount} of ${tracked.length} at or above 100% DV)`);
    for (const row of tracked) {
      const pct = row.dailyValue > 0 ? Math.round((row.total / row.dailyValue) * 100) : 0;
      const total = row.total < 10 ? row.total.toFixed(1) : Math.round(row.total).toLocaleString();
      lines.push(`  ${row.label.padEnd(16)}${total} ${row.unit.padEnd(10)}${pct}%`);
    }
    return lines.join('\n');
  }, [planEntries, fruitMap, nutrientRows]);

  const handleCopyForLLM = useCallback(async () => {
    if (planEntries.length === 0) return;
    try { await copyText(buildPlanText()); } catch { setCopyError(true); return; }
    setCopyError(false);
    setCopiedLLM(true);
    setTimeout(() => setCopiedLLM(false), 1500);
  }, [planEntries, buildPlanText]);

  const handleShare = useCallback(async () => {
    if (planEntries.length === 0) return;
    const allowed = shareLimit.checkLimit();
    if (!allowed) return;

    setIsGeneratingImage(true);
    try {
      const foods: ShareFood[] = planEntries.map((e) => {
        const fruit = fruitMap.get(e.name);
        return {
          name: e.name,
          servingsPerWeek: e.servingsPerWeek,
          type: (fruit?.type ?? 'fruit') as ItemType,
        };
      });

      const blob = await generateShareImage({ foods, nutrientRows });

      const url = new URL(window.location.href);
      url.searchParams.set(
        'plan',
        planEntries.map((e) => `${e.name}:${e.servingsPerWeek}`).join(',')
      );
      url.searchParams.delete('food');
      url.searchParams.delete('compare');

      setShareModal({ blob, url: url.toString(), exportText: buildPlanText() });
    } finally {
      setIsGeneratingImage(false);
    }
  }, [planEntries, fruitMap, nutrientRows, shareLimit, buildPlanText]);

  const handleAddOne = useCallback(() => {
    const allowed = autoFillLimit.checkLimit();
    if (!allowed) return;
    const entry = generateAddOne(fruits, planEntries, dvMap, budgetTolerance, lockedNutrients, histamineSensitivity);
    if (entry) setPlanEntries([...planEntries, entry]);
  }, [fruits, planEntries, setPlanEntries, dvMap, autoFillLimit, budgetTolerance, lockedNutrients, histamineSensitivity]);

  const handleReplaceEntry = useCallback((fromName: string, toName: string) => {
    if (fromName === toName) return;
    setPlanEntries(
      planEntries.map((entry) =>
        entry.name === fromName ? { ...entry, name: toName } : entry
      )
    );
    if (lockedPlanEntries.has(fromName)) {
      togglePlanEntryLock(fromName);
      togglePlanEntryLock(toName);
    }
  }, [planEntries, setPlanEntries, lockedPlanEntries, togglePlanEntryLock]);

  const handleAutoFill = useCallback(() => {
    const allowed = autoFillLimit.checkLimit();
    if (!allowed) return;
    const locked = planEntries.filter((e) => lockedPlanEntries.has(e.name));
    const plan = generateAutoFillPlan(fruits, locked, 10, dvMap, budgetTolerance, lockedNutrients, histamineSensitivity);
    setPlanEntries(plan);
  }, [fruits, planEntries, lockedPlanEntries, setPlanEntries, dvMap, autoFillLimit, budgetTolerance, lockedNutrients, histamineSensitivity]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Weekly plan</h1>
        </div>
        <div className={styles.headerActions}>
          {planEntries.length > 0 && (
            <>
              <ShareButton onClick={handleShare} isLoading={isGeneratingImage} buttonRef={shareButtonRef} />
              <button
                type="button"
                className={`${styles.actionButton} ${copiedLLM ? styles.actionButtonCopied : ''}`}
                onClick={handleCopyForLLM}
              >
                {copiedLLM ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedLLM ? 'Copied' : 'Copy plan'}</span>
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
            disabled={autoFillLimit.isLimited}
          >
            <Plus size={14} weight="bold" />
            <span>Suggest one food</span>
          </button>
          <button
            type="button"
            className={styles.autoFillButton}
            onClick={handleAutoFill}
            disabled={autoFillLimit.isLimited}
          >
            <Lightning size={14} weight="fill" />
            <span>{planEntries.length > 0 ? 'Rebuild plan' : 'Build plan'}</span>
          </button>
          {autoFillLimit.isLimited && (
            <RateLimitNotice retryAfterMs={autoFillLimit.retryAfterMs} />
          )}
          {shareLimit.isLimited && (
            <RateLimitNotice retryAfterMs={shareLimit.retryAfterMs} />
          )}
        </div>
      </div>

      {copyError && <p role="alert">Copy failed. Use Share to copy the plan text manually.</p>}
      <div className={styles.budgetRow}>
        <span className={styles.budgetLabel}>Budget</span>
        <input
          type="range"
          className={styles.budgetSlider}
          aria-label="Plan budget"
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
        <section className={styles.planSummary} aria-label="Plan summary">
          <strong>{metCount} of {trackedRows.length} tracked nutrient targets met</strong>
          <span>{planEntries.length} {planEntries.length === 1 ? 'food' : 'foods'}</span>
        </section>
      )}

      {planEntries.length > 0 && (
        <div className={styles.entries}>
          {planEntries.map((entry) => (
            <PlanEntryRow
              key={entry.name}
              entry={entry}
              fruit={fruitMap.get(entry.name)}
              locked={lockedPlanEntries.has(entry.name)}
              replacements={replacementsByFood.get(entry.name) ?? []}
              onReplace={handleReplaceEntry}
            />
          ))}
        </div>
      )}

      {planEntries.length === 0 && (
        <div className={styles.empty}>
          <button type="button" onClick={() => setActiveView('audit')}>Review my week</button>
        </div>
      )}

      {planEntries.length > 0 && (
        <HistamineSummary planEntries={planEntries} fruitMap={fruitMap} />
      )}

      {planEntries.length > 0 && (
        <details className={styles.coverageDetails}>
          <summary>Nutrient targets</summary>
          <NutrientCoverage rows={nutrientRows} entryCount={planEntries.length} lockedNutrients={lockedNutrients} />
        </details>
      )}

      {shareModal && (
        <ShareModal
          imageBlob={shareModal.blob}
          shareUrl={shareModal.url}
          exportText={shareModal.exportText}
          returnFocus={shareButtonRef}
          onClose={() => setShareModal(null)}
        />
      )}
    </div>
  );
}
