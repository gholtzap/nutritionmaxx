import type { NutrientFruit, PlanEntry } from '../../types';
import { useStore } from '../../store';
import { getHistamineWarning } from '../../utils/dietary';
import type { HistamineWarning } from '../../utils/dietary';
import styles from './MealPlanner.module.css';

interface HistamineSummaryProps {
  planEntries: PlanEntry[];
  fruitMap: Map<string, NutrientFruit>;
}

interface FlaggedFood {
  name: string;
  warning: HistamineWarning;
  servingsPerWeek: number;
}

function histamineTypeLabel(type: string): string {
  if (type === 'liberator') return 'Liberator';
  if (type === 'dao_inhibitor') return 'DAO Inhibitor';
  if (type === 'high') return 'Contains';
  return '';
}

export default function HistamineSummary({ planEntries, fruitMap }: HistamineSummaryProps) {
  const sensitivity = useStore((s) => s.histamineSensitivity);
  if (sensitivity === 'off') return null;

  const flagged: FlaggedFood[] = [];
  let totalServings = 0;
  let flaggedServings = 0;

  for (const entry of planEntries) {
    totalServings += entry.servingsPerWeek;
    const fruit = fruitMap.get(entry.name);
    if (!fruit) continue;
    const warning = getHistamineWarning(fruit, sensitivity);
    if (warning) {
      flagged.push({ name: entry.name, warning, servingsPerWeek: entry.servingsPerWeek });
      flaggedServings += entry.servingsPerWeek;
    }
  }

  const flaggedPct = totalServings > 0 ? Math.round((flaggedServings / totalServings) * 100) : 0;
  let rating: 'low' | 'moderate' | 'high';
  if (flaggedPct === 0) rating = 'low';
  else if (flaggedPct <= 25) rating = 'moderate';
  else rating = 'high';

  const ratingClass =
    rating === 'low' ? styles.histamineRatingLow
      : rating === 'moderate' ? styles.histamineRatingModerate
        : styles.histamineRatingHigh;

  const ratingLabel = rating === 'low' ? 'Low' : rating === 'moderate' ? 'Moderate' : 'High';

  return (
    <div className={styles.histamineSummary}>
      <div className={styles.histamineSummaryHeader}>
        <span className={styles.histamineSummaryTitle}>Histamine Rating</span>
        <span className={`${styles.histamineRatingBadge} ${ratingClass}`}>{ratingLabel}</span>
      </div>
      {flagged.length === 0 ? (
        <p className={styles.histamineSummaryNote}>No flagged foods in this plan.</p>
      ) : (
        <>
          <p className={styles.histamineSummaryNote}>
            {flagged.length} of {planEntries.length} foods flagged ({flaggedPct}% of weekly servings)
          </p>
          <div className={styles.histamineFlaggedList}>
            {flagged.map((f) => (
              <div key={f.name} className={styles.histamineFlaggedItem}>
                <span className={styles.histamineFlaggedName}>{f.name}</span>
                <span className={f.warning.severity === 'high' ? styles.histamineHigh : styles.histamineModerate}>
                  {f.warning.severity === 'high' ? 'High' : 'Mod'}
                </span>
                {f.warning.type && (
                  <span className={styles.histamineFlaggedType}>{histamineTypeLabel(f.warning.type)}</span>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
