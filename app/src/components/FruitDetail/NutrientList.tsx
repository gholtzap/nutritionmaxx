import { useState } from 'react';
import type { NutrientFruit, NutrientKey } from '../../types';
import { VITAMIN_KEYS, MINERAL_KEYS, NUTRIENT_MAP } from '../../utils/nutrition-meta';
import { formatNutrient } from '../../utils/format';
import styles from './FruitDetail.module.css';

interface NutrientListProps {
  fruit: NutrientFruit;
}

interface GroupProps {
  title: string;
  keys: NutrientKey[];
  fruit: NutrientFruit;
  showEmpty: boolean;
}

function NutrientGroup({ title, keys, fruit, showEmpty }: GroupProps) {
  const filtered = showEmpty ? keys : keys.filter((key) => fruit[key] !== null);

  if (filtered.length === 0) return null;

  return (
    <div className={styles.nutrientGroup}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      <div className={styles.nutrientRows}>
        {filtered.map((key) => {
          const meta = NUTRIENT_MAP.get(key)!;
          const value = fruit[key] as number | null;
          const formatted = formatNutrient(value, key);
          const isNull = value === null;
          return (
            <div key={key} className={styles.nutrientRow}>
              <span className={styles.nutrientLabel}>{meta.label}</span>
              <span className={`${styles.nutrientValue} ${isNull ? styles.nutrientNull : ''}`}>
                {formatted}
                {!isNull && <span className={styles.nutrientUnit}>{meta.unit}</span>}
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
      <NutrientGroup title="Vitamins" keys={VITAMIN_KEYS} fruit={fruit} showEmpty={showEmpty} />
      <NutrientGroup title="Minerals" keys={MINERAL_KEYS} fruit={fruit} showEmpty={showEmpty} />
    </div>
  );
}
