import { useState, useMemo } from 'react';
import type { NutrientKey, NutrientFruit } from '../../types';
import { NUTRIENT_META, NUTRIENT_MAP } from '../../utils/nutrition-meta';
import styles from './CategoryOverview.module.css';

interface NutrientRatioProps {
  items: NutrientFruit[];
}

interface RatioEntry {
  name: string;
  ratio: number | null;
}

export default function NutrientRatio({ items }: NutrientRatioProps) {
  const [numerator, setNumerator] = useState<NutrientKey>('protein_g');
  const [denominator, setDenominator] = useState<NutrientKey>('calories_kcal');

  const numMeta = NUTRIENT_MAP.get(numerator)!;
  const denMeta = NUTRIENT_MAP.get(denominator)!;

  const ranked = useMemo(() => {
    const entries: RatioEntry[] = items.map((item) => {
      const numVal = item[numerator] as number | null;
      const denVal = item[denominator] as number | null;
      if (numVal === null || denVal === null || denVal === 0) {
        return { name: item.name, ratio: null };
      }
      return { name: item.name, ratio: numVal / denVal };
    });

    return entries.sort((a, b) => {
      if (a.ratio === null && b.ratio === null) return 0;
      if (a.ratio === null) return 1;
      if (b.ratio === null) return -1;
      return b.ratio - a.ratio;
    });
  }, [items, numerator, denominator]);

  const maxRatio = useMemo(() => {
    let max = 0;
    for (const entry of ranked) {
      if (entry.ratio !== null && entry.ratio > max) max = entry.ratio;
    }
    return max;
  }, [ranked]);

  const unitLabel = `${numMeta.unit}/${denMeta.unit}`;

  return (
    <div className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Nutrient Ratio</h3>
        <div className={styles.ratioSelects}>
          <select
            className={styles.chartSelect}
            value={numerator}
            onChange={(e) => setNumerator(e.target.value as NutrientKey)}
          >
            {NUTRIENT_META.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label} ({m.unit})
              </option>
            ))}
          </select>
          <span className={styles.ratioPer}>per</span>
          <select
            className={styles.chartSelect}
            value={denominator}
            onChange={(e) => setDenominator(e.target.value as NutrientKey)}
          >
            {NUTRIENT_META.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label} ({m.unit})
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.ratioList}>
        {ranked.map((entry, i) => (
          <div key={entry.name} className={styles.ratioRow}>
            <span className={styles.ratioRank}>{entry.ratio !== null ? i + 1 : ''}</span>
            <span className={styles.ratioName}>{entry.name}</span>
            <div className={styles.ratioBarTrack}>
              {entry.ratio !== null && maxRatio > 0 && (
                <div
                  className={styles.ratioBarFill}
                  style={{ width: `${(entry.ratio / maxRatio) * 100}%` }}
                />
              )}
            </div>
            <span className={styles.ratioValue}>
              {entry.ratio !== null ? (
                <>
                  {entry.ratio.toFixed(4)}
                  <span className={styles.ratioUnit}> {unitLabel}</span>
                </>
              ) : (
                <span className={styles.ratioNull}>--</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
