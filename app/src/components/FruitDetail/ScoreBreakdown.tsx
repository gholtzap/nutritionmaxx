import { useState, useMemo } from 'react';
import { CaretDown, CaretRight } from '@phosphor-icons/react';
import type { NutrientFruit } from '../../types';
import { useStore } from '../../store';
import { useEffectiveDailyValues } from '../../utils/use-effective-daily-values';
import { computePersonalizedConfig, hasPersonalization, traceWeightSources } from '../../utils/personalized-score';
import { computeScoreBreakdown } from '../../utils/compute-score';
import type { NutrientBreakdownEntry } from '../../utils/compute-score';
import type { WeightSource } from '../../utils/personalized-score';
import { DEFAULT_SCORE_CONFIG } from '../../utils/score-defaults';
import { NUTRIENT_MAP } from '../../utils/nutrition-meta';
import styles from './FruitDetail.module.css';

interface Props {
  fruit: NutrientFruit;
}

function NutrientRow({
  entry,
  sources,
}: {
  entry: NutrientBreakdownEntry;
  sources: WeightSource[];
}) {
  const meta = NUTRIENT_MAP.get(entry.key);
  const label = meta?.label ?? entry.key;
  const isBoosted = entry.weight !== entry.baseWeight;

  return (
    <div className={styles.breakdownRow}>
      <span className={styles.breakdownLabel}>{label}</span>
      <div className={styles.breakdownBarWrap}>
        <div className={styles.breakdownBar}>
          <div
            className={styles.breakdownBarFill}
            style={{ width: `${Math.min(entry.sharePercent, 100)}%` }}
          />
        </div>
      </div>
      <span className={styles.breakdownDV}>{entry.percentDV.toFixed(0)}%</span>
      {isBoosted && (
        <span className={styles.breakdownWeight}>{entry.weight.toFixed(1)}x</span>
      )}
      <span className={styles.breakdownShare}>{entry.sharePercent.toFixed(1)}%</span>
      {sources.length > 0 && (
        <div className={styles.breakdownSources}>
          {sources.map((s) => (
            <span key={`${s.factor}-${s.label}`} className={styles.sourceBadge}>
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ScoreBreakdown({ fruit }: Props) {
  const scoreNutrients = useStore((s) => s.scoreNutrients);
  const userProfile = useStore((s) => s.userProfile);
  const dietaryPreferences = useStore((s) => s.dietaryPreferences);
  const personalization = useStore((s) => s.personalization);
  const dvMap = useEffectiveDailyValues();
  const [expanded, setExpanded] = useState(false);

  const active = useMemo(
    () => hasPersonalization(userProfile, dietaryPreferences, personalization),
    [userProfile, dietaryPreferences, personalization]
  );

  const config = useMemo(() => {
    if (!active) return null;
    return computePersonalizedConfig(userProfile, dietaryPreferences, personalization, DEFAULT_SCORE_CONFIG);
  }, [active, userProfile, dietaryPreferences, personalization]);

  const breakdown = useMemo(() => {
    if (!config) return null;
    return computeScoreBreakdown(fruit, scoreNutrients, dvMap, config, DEFAULT_SCORE_CONFIG);
  }, [fruit, scoreNutrients, dvMap, config]);

  const weightSources = useMemo(
    () => traceWeightSources(userProfile, dietaryPreferences, personalization),
    [userProfile, dietaryPreferences, personalization]
  );

  if (!active || !breakdown) return null;

  const boosted = breakdown.nutrients.filter((e) => e.weight !== e.baseWeight);
  const remaining = breakdown.nutrients.filter((e) => e.weight === e.baseWeight);
  const topList = boosted.length > 0 ? boosted : breakdown.nutrients.slice(0, 5);
  const restList = boosted.length > 0 ? remaining : breakdown.nutrients.slice(5);
  const hasBoosted = boosted.length > 0;

  return (
    <div className={styles.breakdownSection}>
      <h3 className={styles.sectionTitle}>My Score Breakdown</h3>

      <div className={styles.breakdownFormula}>
        <span>{breakdown.beneficialAvg.toFixed(1)}</span>
        <span className={styles.breakdownOp}>x</span>
        <span>{breakdown.penaltyMultiplier.toFixed(2)}</span>
        <span className={styles.breakdownOp}>x</span>
        <span>{breakdown.caloriesFactor.toFixed(2)}</span>
        <span className={styles.breakdownOp}>=</span>
        <span className={styles.breakdownTotal}>{breakdown.finalScore.toFixed(1)}</span>
      </div>

      <div className={styles.breakdownFormulaLabels}>
        <span>avg nutrients</span>
        <span>penalty</span>
        <span>cal efficiency</span>
        <span>score</span>
      </div>

      {!hasBoosted && (
        <div className={styles.breakdownNote}>
          Score uses default weights only.
        </div>
      )}

      <div className={styles.breakdownHeader}>
        <span className={styles.breakdownHeaderLabel}>Nutrient</span>
        <span className={styles.breakdownHeaderBar}>Share</span>
        <span className={styles.breakdownHeaderDV}>%DV</span>
        <span className={styles.breakdownHeaderWeight}>Wt</span>
        <span className={styles.breakdownHeaderShare}>%</span>
      </div>

      {topList.map((entry) => (
        <NutrientRow
          key={entry.key}
          entry={entry}
          sources={weightSources.get(entry.key) ?? []}
        />
      ))}

      {restList.length > 0 && (
        <>
          <button
            type="button"
            className={styles.breakdownToggle}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <CaretDown size={12} /> : <CaretRight size={12} />}
            <span>{expanded ? 'Hide' : 'Show'} {restList.length} more</span>
          </button>
          {expanded &&
            restList.map((entry) => (
              <NutrientRow
                key={entry.key}
                entry={entry}
                sources={weightSources.get(entry.key) ?? []}
              />
            ))}
        </>
      )}

      {breakdown.penalties.length > 0 && (
        <div className={styles.breakdownPenalty}>
          <h4 className={styles.sectionTitle}>Penalties</h4>
          {breakdown.penalties.map((p) => {
            const meta = NUTRIENT_MAP.get(p.key);
            return (
              <div key={p.key} className={styles.breakdownPenaltyRow}>
                <span>{meta?.label ?? p.key}</span>
                <span className={styles.breakdownPenaltyValue}>
                  {p.percentDV.toFixed(0)}% DV
                </span>
              </div>
            );
          })}
          <div className={styles.breakdownPenaltyRow}>
            <span>Penalty scale</span>
            <span className={styles.breakdownPenaltyValue}>{breakdown.penaltyScale}</span>
          </div>
          <div className={styles.breakdownPenaltyRow}>
            <span>Multiplier</span>
            <span className={styles.breakdownPenaltyValue}>
              x{breakdown.penaltyMultiplier.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
