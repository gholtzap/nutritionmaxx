import type { CategoryAverage } from '../../utils/aggregations';
import type { NutrientKey } from '../../types';
import { useStore } from '../../store';
import { CATEGORY_COLORS, NUTRIENT_MAP, hasDailyValue } from '../../utils/nutrition-meta';
import { formatNutrientDisplay } from '../../utils/format';
import styles from './CategoryOverview.module.css';

interface CategoryCardProps {
  data: CategoryAverage;
}

const HIGHLIGHT_KEYS: NutrientKey[] = [
  'calories_kcal',
  'protein_g',
  'carbs_g',
  'fiber_g',
  'vitamin_c_mg',
  'potassium_mg',
];

export default function CategoryCard({ data }: CategoryCardProps) {
  const color = CATEGORY_COLORS[data.category];
  const showDV = useStore((s) => s.showDailyValue);

  return (
    <div className={styles.card} style={{ borderTopColor: color }}>
      <div className={styles.cardHeader}>
        <span className={styles.cardCategory} style={{ color }}>
          {data.category}
        </span>
        <span className={styles.cardCount}>{data.count} fruits</span>
      </div>
      <div className={styles.cardStats}>
        {HIGHLIGHT_KEYS.map((key) => {
          const meta = NUTRIENT_MAP.get(key)!;
          const value = data.averages[key];
          const formatted = formatNutrientDisplay(value, key, showDV);
          const useDV = showDV && hasDailyValue(key);
          return (
            <div key={key} className={styles.cardStat}>
              <span className={styles.cardStatLabel}>{meta.label}</span>
              <span className={`${styles.cardStatValue} ${value === null ? styles.cardStatNull : ''}`}>
                {formatted}
                {value !== null && !useDV && (
                  <span className={styles.cardStatUnit}>{meta.unit}</span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
