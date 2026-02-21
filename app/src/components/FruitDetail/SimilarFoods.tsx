import { useMemo } from 'react';
import type { NutrientFruit } from '../../types';
import { useStore } from '../../store';
import { findSimilarFoods } from '../../utils/similarity';
import Badge from '../shared/Badge';
import styles from './FruitDetail.module.css';

interface SimilarFoodsProps {
  fruit: NutrientFruit;
}

export default function SimilarFoods({ fruit }: SimilarFoodsProps) {
  const fruits = useStore((s) => s.fruits);
  const setSelectedFruit = useStore((s) => s.setSelectedFruit);

  const similar = useMemo(
    () => findSimilarFoods(fruit, fruits, 5),
    [fruit, fruits]
  );

  if (similar.length === 0) return null;

  return (
    <div className={styles.similarSection}>
      <h3 className={styles.sectionTitle}>Similar Foods</h3>
      <div className={styles.similarList}>
        {similar.map((item) => (
          <button
            key={item.food.name}
            type="button"
            className={styles.similarRow}
            onClick={() => setSelectedFruit(item.food)}
          >
            <span className={styles.similarName}>{item.food.name}</span>
            <Badge category={item.food.category} />
            <span className={styles.similarScore}>
              {Math.round(item.similarity * 100)}%
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
