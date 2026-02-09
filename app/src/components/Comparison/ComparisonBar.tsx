import type { NutrientFruit, NutrientKey } from '../../types';
import { useStore } from '../../store';
import { NUTRIENT_META, hasDailyValue } from '../../utils/nutrition-meta';
import { formatNutrientDisplay, toDailyValuePercent } from '../../utils/format';
import styles from './Comparison.module.css';

const SLOT_COLORS = ['var(--compare-a)', 'var(--compare-b)', 'var(--compare-c)'];

interface ComparisonBarProps {
  fruits: NutrientFruit[];
}

export default function ComparisonBar({ fruits }: ComparisonBarProps) {
  const showDV = useStore((s) => s.showDailyValue);

  return (
    <div className={styles.bars}>
      {NUTRIENT_META.map((meta) => {
        const key = meta.key as NutrientKey;
        const useDV = showDV && hasDailyValue(key);
        const displayValues = fruits.map((f) => {
          const raw = f[key] as number | null;
          return useDV ? toDailyValuePercent(raw, key) : raw;
        });
        const numericValues = displayValues.filter((v): v is number => v !== null);
        const maxVal = numericValues.length > 0 ? Math.max(...numericValues) : 0;

        return (
          <div key={key} className={styles.barGroup}>
            <div className={styles.barLabel}>
              <span>{meta.label}</span>
              <span className={styles.barUnit}>{useDV ? '% DV' : meta.unit}</span>
            </div>
            <div className={styles.barTracks}>
              {fruits.map((fruit, i) => {
                const raw = fruit[key] as number | null;
                const displayVal = displayValues[i];
                const width = displayVal !== null && maxVal > 0 ? (displayVal / maxVal) * 100 : 0;
                return (
                  <div key={fruit.name} className={styles.barTrack}>
                    <div className={styles.barTrackInner}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${width}%`,
                          background: SLOT_COLORS[i],
                        }}
                      />
                    </div>
                    <span className={`${styles.barValue} ${raw === null ? styles.barValueNull : ''}`}>
                      {formatNutrientDisplay(raw, key, showDV)}
                      {raw !== null && !useDV && (
                        <span className={styles.barValueUnit}>{meta.unit}</span>
                      )}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
