import { Plus } from '@phosphor-icons/react';
import type { ScoredFood } from '../../utils/deficiency-profile';
import styles from './FixMyDiet.module.css';

interface FoodCardProps {
  item: ScoredFood;
  onAddToPlan: (name: string) => void;
}

export default function FoodCard({ item, onAddToPlan }: FoodCardProps) {
  const { food, topNutrients } = item;
  const servingLabel = food.serving_label
    ? `${food.serving_size_g}g (${food.serving_label})`
    : `${food.serving_size_g ?? 100}g`;

  return (
    <div className={styles.foodCard}>
      <div className={styles.foodCardHeader}>
        <div>
          <span className={styles.foodName}>{food.name}</span>
          <span className={styles.foodMeta}>{food.type.replace('_', ' ')} / {servingLabel}</span>
        </div>
        <button
          type="button"
          className={styles.addButton}
          onClick={() => onAddToPlan(food.name)}
        >
          <Plus size={14} weight="bold" />
          <span>Add to Plan</span>
        </button>
      </div>
      <div className={styles.nutrientBars}>
        {topNutrients.map((n) => (
          <div key={n.key} className={styles.nutrientRow}>
            <span className={styles.nutrientLabel}>{n.label}</span>
            <div className={styles.barTrack}>
              <div
                className={styles.barFill}
                style={{ width: `${Math.min(100, n.percentDV)}%` }}
              />
            </div>
            <span className={styles.nutrientPct}>{n.percentDV}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
