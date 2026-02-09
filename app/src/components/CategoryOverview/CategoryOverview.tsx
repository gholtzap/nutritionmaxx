import { useMemo } from 'react';
import { useStore } from '../../store';
import { NUTRIENT_META } from '../../utils/nutrition-meta';
import { computeCategoryAverages } from '../../utils/aggregations';
import CategoryCard from './CategoryCard';
import CategoryChart from './CategoryChart';
import styles from './CategoryOverview.module.css';

export default function CategoryOverview() {
  const fruits = useStore((s) => s.fruits);

  const categoryData = useMemo(
    () =>
      computeCategoryAverages(
        fruits,
        NUTRIENT_META.map((m) => m.key)
      ),
    [fruits]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Category Overview</h2>
        <p className={styles.subtitle}>Average nutritional values per 100g by fruit category</p>
      </div>
      <CategoryChart data={categoryData} />
      <div className={styles.grid}>
        {categoryData.map((d) => (
          <CategoryCard key={d.category} data={d} />
        ))}
      </div>
    </div>
  );
}
