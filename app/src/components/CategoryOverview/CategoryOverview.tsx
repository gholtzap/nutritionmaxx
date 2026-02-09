import { useMemo } from 'react';
import { useStore } from '../../store';
import type { ItemCategory } from '../../types';
import { NUTRIENT_META, FRUIT_CATEGORIES, VEGETABLE_CATEGORIES, ALL_CATEGORIES } from '../../utils/nutrition-meta';
import { computeCategoryAverages } from '../../utils/aggregations';
import TypeFilter from '../DataTable/TypeFilter';
import CategoryCard from './CategoryCard';
import CategoryChart from './CategoryChart';
import styles from './CategoryOverview.module.css';

export default function CategoryOverview() {
  const fruits = useStore((s) => s.fruits);
  const selectedType = useStore((s) => s.selectedType);

  const filteredItems = useMemo(() => {
    if (!selectedType) return fruits;
    return fruits.filter((f) => f.type === selectedType);
  }, [fruits, selectedType]);

  const categories: ItemCategory[] = useMemo(() => {
    if (selectedType === 'fruit') return [...FRUIT_CATEGORIES];
    if (selectedType === 'vegetable') return [...VEGETABLE_CATEGORIES];
    return [...ALL_CATEGORIES];
  }, [selectedType]);

  const categoryData = useMemo(
    () =>
      computeCategoryAverages(
        filteredItems,
        NUTRIENT_META.map((m) => m.key),
        categories
      ),
    [filteredItems, categories]
  );

  const subtitleType = selectedType === 'fruit'
    ? 'fruit'
    : selectedType === 'vegetable'
      ? 'vegetable'
      : 'item';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Category Overview</h2>
        <p className={styles.subtitle}>Average nutritional values per 100g by {subtitleType} category</p>
      </div>
      <TypeFilter />
      <CategoryChart data={categoryData} />
      <div className={styles.grid}>
        {categoryData.map((d) => (
          <CategoryCard key={d.category} data={d} />
        ))}
      </div>
    </div>
  );
}
