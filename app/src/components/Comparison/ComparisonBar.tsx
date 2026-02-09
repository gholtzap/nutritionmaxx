import type { NutrientFruit, NutrientKey } from '../../types';
import { NUTRIENT_META, NUTRIENT_MAP } from '../../utils/nutrition-meta';
import { formatNutrient } from '../../utils/format';
import styles from './Comparison.module.css';

const SLOT_COLORS = ['var(--compare-a)', 'var(--compare-b)', 'var(--compare-c)'];

interface ComparisonBarProps {
  fruits: NutrientFruit[];
}

export default function ComparisonBar({ fruits }: ComparisonBarProps) {
  return (
    <div className={styles.bars}>
      {NUTRIENT_META.map((meta) => {
        const key = meta.key as NutrientKey;
        const values = fruits.map((f) => f[key] as number | null);
        const numericValues = values.filter((v): v is number => v !== null);
        const maxVal = numericValues.length > 0 ? Math.max(...numericValues) : 0;

        return (
          <div key={key} className={styles.barGroup}>
            <div className={styles.barLabel}>
              <span>{meta.label}</span>
              <span className={styles.barUnit}>{meta.unit}</span>
            </div>
            <div className={styles.barTracks}>
              {fruits.map((fruit, i) => {
                const value = fruit[key] as number | null;
                const width = value !== null && maxVal > 0 ? (value / maxVal) * 100 : 0;
                const nutrientMeta = NUTRIENT_MAP.get(key);
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
                    <span className={`${styles.barValue} ${value === null ? styles.barValueNull : ''}`}>
                      {formatNutrient(value, key)}
                      {value !== null && (
                        <span className={styles.barValueUnit}>{nutrientMeta?.unit}</span>
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
