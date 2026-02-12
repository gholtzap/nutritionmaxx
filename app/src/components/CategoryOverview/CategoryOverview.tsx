import { useMemo } from 'react';
import { useStore } from '../../store';
import type { ItemCategory } from '../../types';
import { NUTRIENT_META, FRUIT_CATEGORIES, VEGETABLE_CATEGORIES, SPICE_CATEGORIES, NUT_SEED_CATEGORIES, LEGUME_CATEGORIES, ALL_CATEGORIES } from '../../utils/nutrition-meta';
import { computeCategoryAverages } from '../../utils/aggregations';
import TypeFilter from '../DataTable/TypeFilter';
import CategoryCard from './CategoryCard';
import CategoryChart from './CategoryChart';
import NutrientRatio from './NutrientRatio';
import styles from './CategoryOverview.module.css';

export default function CategoryOverview() {
  const fruits = useStore((s) => s.fruits);
  const selectedType = useStore((s) => s.selectedType);
  const showPerServing = useStore((s) => s.showPerServing);

  const filteredItems = useMemo(() => {
    if (!selectedType) return fruits;
    return fruits.filter((f) => f.type === selectedType);
  }, [fruits, selectedType]);

  const categories: ItemCategory[] = useMemo(() => {
    if (selectedType === 'fruit') return [...FRUIT_CATEGORIES];
    if (selectedType === 'vegetable') return [...VEGETABLE_CATEGORIES];
    if (selectedType === 'spice') return [...SPICE_CATEGORIES];
    if (selectedType === 'nut_seed') return [...NUT_SEED_CATEGORIES];
    if (selectedType === 'legume') return [...LEGUME_CATEGORIES];
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
      : selectedType === 'spice'
        ? 'spice'
        : selectedType === 'nut_seed'
          ? 'nut & seed'
          : selectedType === 'legume'
            ? 'legume'
            : 'item';

  const basisLabel = showPerServing ? 'per serving' : 'per 100g';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Category Overview</h2>
        <p className={styles.subtitle}>Average nutritional values {basisLabel} by {subtitleType} category</p>
      </div>
      <TypeFilter />
      <CategoryChart data={categoryData} />
      <NutrientRatio />
      <div className={styles.grid}>
        {categoryData.map((d) => (
          <CategoryCard key={d.category} data={d} />
        ))}
      </div>
    </div>
  );
}
