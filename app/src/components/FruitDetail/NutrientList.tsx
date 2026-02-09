import { useState } from 'react';
import type { NutrientFruit, NutrientKey } from '../../types';
import { useStore } from '../../store';
import { VITAMIN_KEYS, MINERAL_KEYS, NUTRIENT_MAP, hasDailyValue } from '../../utils/nutrition-meta';
import { formatNutrientDisplay } from '../../utils/format';
import styles from './FruitDetail.module.css';

interface NutrientListProps {
  fruit: NutrientFruit;
}

interface GroupProps {
  title: string;
  keys: NutrientKey[];
  fruit: NutrientFruit;
  showEmpty: boolean;
  showDV: boolean;
}

function NutrientGroup({ title, keys, fruit, showEmpty, showDV }: GroupProps) {
  const filtered = showEmpty ? keys : keys.filter((key) => fruit[key] !== null);

  if (filtered.length === 0) return null;

  return (
    <div className={styles.nutrientGroup}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.nutrientRows}>
        {filtered.map((key) => {
          const meta = NUTRIENT_MAP.get(key)!;
          const value = fruit[key] as number | null;
          const formatted = formatNutrientDisplay(value, key, showDV);
          const isNull = value === null;
          const showUnit = !isNull && !(showDV && hasDailyValue(key));
          return (
            <div key={key} className={styles.nutrientRow}>
              <span className={styles.nutrientLabel}>{meta.label}</span>
              <span className={`${styles.nutrientValue} ${isNull ? styles.nutrientNull : ''}`}>
                {formatted}
                {showUnit && <span className={styles.nutrientUnit}>{meta.unit}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function NutrientList({ fruit }: NutrientListProps) {
  const [showEmpty, setShowEmpty] = useState(false);
  const showDV = useStore((s) => s.showDailyValue);

  return (
    <div>
      <label className={styles.showEmptyToggle}>
        <input
          type="checkbox"
          checked={showEmpty}
          onChange={(e) => setShowEmpty(e.target.checked)}
          className={styles.showEmptyCheckbox}
        />
        <span className={styles.showEmptyLabel}>Show empty values</span>
      </label>
      <NutrientGroup title="Vitamins" keys={VITAMIN_KEYS} fruit={fruit} showEmpty={showEmpty} showDV={showDV} />
      <NutrientGroup title="Minerals" keys={MINERAL_KEYS} fruit={fruit} showEmpty={showEmpty} showDV={showDV} />
    </div>
  );
}
