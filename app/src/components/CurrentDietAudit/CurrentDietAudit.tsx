import { useMemo, useRef, useState, useEffect } from 'react';
import { ArrowClockwise, ArrowRight, Check, FloppyDisk, MagnifyingGlass, Minus, Plus, Trash, X } from '@phosphor-icons/react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { useStore } from '../../store';
import type { NutrientFruit, PlanEntry } from '../../types';
import { analyzeDietAudit } from '../../utils/diet-audit';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import { useEffectiveDailyValues } from '../../utils/use-effective-daily-values';
import { servingsLabel } from '../../utils/servings';
import Badge from '../shared/Badge';
import styles from './CurrentDietAudit.module.css';

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

function formatAmount(value: number, unit: string): string {
  const rounded = value < 10 ? value.toFixed(1) : Math.round(value).toLocaleString();
  return `${rounded} ${unit}`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date(value));
}

function EntryRow({ entry, fruit }: { entry: PlanEntry; fruit: NutrientFruit | undefined }) {
  const setServings = useStore((s) => s.setDietAuditEntryServings);
  const removeEntry = useStore((s) => s.removeDietAuditEntry);
  const [draft, setDraft] = useState(String(entry.servingsPerWeek));
  const [editing, setEditing] = useState(false);

  function adjust(delta: number) {
    const next = Math.round((entry.servingsPerWeek + delta) * 10) / 10;
    if (next >= 0.5 && next <= 1000) setServings(entry.name, next);
  }

  function commitDraft() {
    setEditing(false);
    const parsed = parseFloat(draft);
    if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 1000) {
      setServings(entry.name, parsed);
    } else {
      setDraft(String(entry.servingsPerWeek));
    }
  }

  return (
    <div className={styles.entryRow}>
      <div className={styles.entryInfo}>
        <span className={styles.entryName}>{entry.name}</span>
        {fruit && <Badge category={fruit.category} />}
        <span className={styles.entryServing}>{fruit?.serving_label ?? '100g'}</span>
      </div>
      <div className={styles.entryControls}>
        <button type="button" className={styles.iconButton} onClick={() => adjust(-1)} aria-label="Decrease servings">
          <Minus size={12} />
        </button>
        <input
          type="number"
          className={styles.servingInput}
          value={editing ? draft : String(entry.servingsPerWeek)}
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
        <button type="button" className={styles.iconButton} onClick={() => adjust(1)} aria-label="Increase servings">
          <Plus size={12} />
        </button>
        <span className={styles.entryFreq}>{servingsLabel(entry.servingsPerWeek)}</span>
        <button type="button" className={styles.removeButton} onClick={() => removeEntry(entry.name)} aria-label={`Remove ${entry.name}`}>
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

function FoodSelector() {
  const foods = useDietaryFruits();
  const entries = useStore((s) => s.currentDietAuditEntries);
  const addEntry = useStore((s) => s.addDietAuditEntry);
  const budgetTolerance = useStore((s) => s.budgetTolerance);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const entryNames = new Set(entries.map((entry) => entry.name));
  const suggestions = query.length > 0
    ? foods
        .filter((food) => !entryNames.has(food.name))
        .filter((food) => food.cost_index === null || food.cost_index <= budgetTolerance)
        .filter((food) => food.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 10)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectFood(food: NutrientFruit) {
    addEntry(food.name);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className={styles.searchWrap} ref={ref}>
      <div className={styles.searchBox}>
        <MagnifyingGlass size={15} className={styles.searchIcon} />
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Add what you ate this week..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && suggestions.length > 0 && (
        <div className={styles.suggestions}>
          {suggestions.map((food) => (
            <button key={food.name} type="button" className={styles.suggestion} onClick={() => selectFood(food)}>
              <span>{food.name}</span>
              <span className={styles.suggestionMeta}>{food.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CurrentDietAudit() {
  const foods = useDietaryFruits();
  const allFoods = useStore((s) => s.fruits);
  const entries = useStore((s) => s.currentDietAuditEntries);
  const savedAudits = useStore((s) => s.savedDietAudits);
  const clearEntries = useStore((s) => s.clearDietAuditEntries);
  const setEntries = useStore((s) => s.setDietAuditEntries);
  const saveAudit = useStore((s) => s.saveDietAudit);
  const deleteSavedDietAudit = useStore((s) => s.deleteSavedDietAudit);
  const loadSavedDietAudit = useStore((s) => s.loadSavedDietAudit);
  const budgetTolerance = useStore((s) => s.budgetTolerance);
  const setBudgetTolerance = useStore((s) => s.setBudgetTolerance);
  const histamineSensitivity = useStore((s) => s.histamineSensitivity);
  const setPlanEntries = useStore((s) => s.setPlanEntries);
  const setActiveView = useStore((s) => s.setActiveView);
  const dvMap = useEffectiveDailyValues();
  const [saved, setSaved] = useState(false);
  const fruitMap = useMemo(() => new Map(allFoods.map((food) => [food.name, food])), [allFoods]);
  const analysis = useMemo(
    () => analyzeDietAudit(entries, foods, dvMap, budgetTolerance, histamineSensitivity),
    [entries, foods, dvMap, budgetTolerance, histamineSensitivity]
  );
  const completeCount = analysis.rows.filter((row) => !row.insufficientData && row.dailyValue > 0 && row.total >= row.dailyValue).length;
  const trackedCount = analysis.rows.filter((row) => !row.insufficientData && row.dailyValue > 0).length;

  function handleSave() {
    if (entries.length === 0) return;
    saveAudit({
      name: `${entries.length} food audit`,
      baselineEntries: entries,
      fixedEntries: analysis.fixedEntries,
      gapKeys: analysis.gaps.map((gap) => gap.key),
      confidence: analysis.confidence,
    });
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1400);
  }

  function sendFixToPlanner(entriesToUse: PlanEntry[]) {
    setPlanEntries(entriesToUse);
    setActiveView('planner');
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Current Diet Audit</h1>
          <p className={styles.subtitle}>Enter a normal week, then compare gaps, excesses, weak data, and the smallest useful fixes.</p>
        </div>
        <div className={styles.headerActions}>
          <button type="button" className={styles.actionButton} onClick={handleSave} disabled={entries.length === 0}>
            {saved ? <Check size={14} /> : <FloppyDisk size={14} />}
            <span>{saved ? 'Saved' : 'Save audit'}</span>
          </button>
          <button type="button" className={styles.actionButton} onClick={clearEntries} disabled={entries.length === 0}>
            <Trash size={14} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      <div className={styles.syncLine}>
        <SignedIn>
          <span>Signed in: audits sync with your saved preferences.</span>
        </SignedIn>
        <SignedOut>
          <span>Local draft only.</span>
          <SignInButton>
            <button type="button" className={styles.inlineButton}>Sign in to sync</button>
          </SignInButton>
        </SignedOut>
      </div>

      <div className={styles.controls}>
        <FoodSelector />
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
      </div>

      {entries.length > 0 ? (
        <div className={styles.entries}>
          {entries.map((entry) => (
            <EntryRow key={entry.name} entry={entry} fruit={fruitMap.get(entry.name)} />
          ))}
        </div>
      ) : (
        <div className={styles.empty}>Add foods from a normal week to start the audit.</div>
      )}

      {entries.length > 0 && (
        <>
          <section className={styles.summaryGrid}>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Coverage</span>
              <strong className={styles.metricValue}>{completeCount}/{trackedCount}</strong>
              <span className={styles.metricNote}>daily targets met</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Confidence</span>
              <strong className={styles.metricValue}>{analysis.confidence}%</strong>
              <span className={styles.metricNote}>based on known nutrient data</span>
            </div>
            <div className={styles.metric}>
              <span className={styles.metricLabel}>Fixes</span>
              <strong className={styles.metricValue}>{analysis.fixes.length}</strong>
              <span className={styles.metricNote}>ranked changes found</span>
            </div>
          </section>

          <section className={styles.reportGrid}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Top Gaps</h2>
                <span className={styles.panelMeta}>under 90% target</span>
              </div>
              {analysis.gaps.length > 0 ? (
                <div className={styles.findingList}>
                  {analysis.gaps.map((gap) => (
                    <div key={gap.key} className={styles.finding}>
                      <div className={styles.findingTop}>
                        <span>{gap.label}</span>
                        <strong>{gap.percent}%</strong>
                      </div>
                      <div className={styles.track}>
                        <span className={styles.fill} style={{ width: `${Math.min(100, gap.percent)}%` }} />
                      </div>
                      <div className={styles.findingMeta}>{formatAmount(gap.total, gap.unit)} of {formatAmount(gap.dailyValue, gap.unit)}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.panelEmpty}>No major gaps found in tracked nutrients.</div>
              )}
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Excessive</h2>
                <span className={styles.panelMeta}>screening thresholds</span>
              </div>
              {analysis.excesses.length > 0 ? (
                <div className={styles.findingList}>
                  {analysis.excesses.map((item) => (
                    <div key={item.key} className={styles.finding}>
                      <div className={styles.findingTop}>
                        <span>{item.label}</span>
                        <strong>{item.percent}%</strong>
                      </div>
                      <div className={styles.findingMeta}>{formatAmount(item.total, item.unit)} vs {formatAmount(item.dailyValue, item.unit)} target</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.panelEmpty}>No obvious excesses from the current entries.</div>
              )}
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2 className={styles.panelTitle}>Weak Data</h2>
                <span className={styles.panelMeta}>confidence drivers</span>
              </div>
              {analysis.missingData.length > 0 ? (
                <div className={styles.missingList}>
                  {analysis.missingData.map((item) => (
                    <div key={item.key} className={styles.missingItem}>
                      <span>{item.label}</span>
                      <span>{item.insufficientData ? 'Sparse source data' : `${item.nullCount}/${item.entryCount} missing`}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.panelEmpty}>No missing-data warnings for this baseline.</div>
              )}
            </div>
          </section>

          <section className={styles.fixPanel}>
            <div className={styles.panelHeader}>
              <h2 className={styles.panelTitle}>Inline Fix Plan</h2>
              <button type="button" className={styles.primaryButton} onClick={() => sendFixToPlanner(analysis.fixedEntries)} disabled={analysis.fixes.length === 0}>
                <span>Send best fix to planner</span>
                <ArrowRight size={14} />
              </button>
            </div>
            {analysis.fixes.length > 0 ? (
              <div className={styles.fixList}>
                {analysis.fixes.map((fix) => (
                  <div key={fix.id} className={styles.fixItem}>
                    <div className={styles.fixBody}>
                      <span className={styles.fixType}>{fix.type === 'add' ? 'Addition' : 'Swap'}</span>
                      <h3 className={styles.fixTitle}>{fix.title}</h3>
                      <p className={styles.fixDetail}>{fix.detail}</p>
                      <div className={styles.improveList}>
                        {fix.improves.map((item) => (
                          <span key={item.key}>{item.label}: {item.before}% to {item.after}%</span>
                        ))}
                      </div>
                    </div>
                    <button type="button" className={styles.applyButton} onClick={() => setEntries(fix.entries)}>
                      <ArrowClockwise size={14} />
                      <span>Apply</span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.panelEmpty}>No high-confidence fixes found within the current filters.</div>
            )}
          </section>
        </>
      )}

      {savedAudits.length > 0 && (
        <section className={styles.savedPanel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Saved Audits</h2>
            <span className={styles.panelMeta}>{savedAudits.length} stored</span>
          </div>
          <div className={styles.savedList}>
            {savedAudits.map((audit) => (
              <div key={audit.id} className={styles.savedItem}>
                <button type="button" className={styles.savedMain} onClick={() => loadSavedDietAudit(audit.id)}>
                  <span className={styles.savedTitle}>{audit.name}</span>
                  <span className={styles.savedMeta}>{formatDate(audit.createdAt)} · {audit.baselineEntries.length} foods · {audit.confidence}% confidence</span>
                </button>
                <button type="button" className={styles.removeButton} onClick={() => deleteSavedDietAudit(audit.id)} aria-label={`Delete ${audit.name}`}>
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
