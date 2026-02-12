import { useMemo } from 'react';
import { useStore } from '../../store';
import type { NutrientFruit, NutrientKey } from '../../types';
import { NUTRIENT_META } from '../../utils/nutrition-meta';
import { getItemDisplayValue } from '../../utils/format';
import SearchBar from './SearchBar';
import TypeFilter from './TypeFilter';
import CategoryFilter from './CategoryFilter';
import ColumnToggle from './ColumnToggle';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import styles from './DataTable.module.css';

export default function DataTable() {
  const fruits = useStore((s) => s.fruits);
  const searchQuery = useStore((s) => s.searchQuery);
  const selectedType = useStore((s) => s.selectedType);
  const selectedCategories = useStore((s) => s.selectedCategories);
  const sort = useStore((s) => s.sort);
  const visibleColumns = useStore((s) => s.visibleColumns);
  const comparisonFruits = useStore((s) => s.comparisonFruits);
  const setSelectedFruit = useStore((s) => s.setSelectedFruit);
  const toggleComparisonFruit = useStore((s) => s.toggleComparisonFruit);
  const showPerServing = useStore((s) => s.showPerServing);

  const visibleKeys = useMemo(
    () =>
      NUTRIENT_META.filter((m) => visibleColumns.has(m.key)).map(
        (m) => m.key
      ),
    [visibleColumns]
  );

  const filtered = useMemo(() => {
    let result = fruits;

    if (selectedType) {
      result = result.filter((f) => f.type === selectedType);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((f) => f.name.toLowerCase().includes(q));
    }

    if (selectedCategories.size > 0) {
      result = result.filter((f) => selectedCategories.has(f.category));
    }

    return result;
  }, [fruits, searchQuery, selectedType, selectedCategories]);

  const sorted = useMemo(() => {
    const { key, direction } = sort;
    const mult = direction === 'asc' ? 1 : -1;
    const isNutrientKey = NUTRIENT_META.some((m) => m.key === key);

    return [...filtered].sort((a, b) => {
      let aVal: string | number | null;
      let bVal: string | number | null;

      if (isNutrientKey && showPerServing) {
        aVal = getItemDisplayValue(a, key as NutrientKey, true);
        bVal = getItemDisplayValue(b, key as NutrientKey, true);
      } else {
        aVal = a[key as keyof NutrientFruit] as string | number | null;
        bVal = b[key as keyof NutrientFruit] as string | number | null;
      }

      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return mult * aVal.localeCompare(bVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return mult * (aVal - bVal);
      }

      return 0;
    });
  }, [filtered, sort, showPerServing]);

  const comparisonNames = useMemo(
    () => new Set(comparisonFruits.map((f) => f.name)),
    [comparisonFruits]
  );

  const countLabel = selectedType === 'fruit'
    ? sorted.length === 1 ? 'fruit' : 'fruits'
    : selectedType === 'vegetable'
      ? sorted.length === 1 ? 'vegetable' : 'vegetables'
      : selectedType === 'spice'
        ? sorted.length === 1 ? 'spice' : 'spices'
        : selectedType === 'nut_seed'
          ? sorted.length === 1 ? 'nut/seed' : 'nuts & seeds'
          : selectedType === 'legume'
            ? sorted.length === 1 ? 'legume' : 'legumes'
            : selectedType === 'grain'
              ? sorted.length === 1 ? 'grain' : 'grains'
              : selectedType === 'fish_seafood'
                ? sorted.length === 1 ? 'fish/seafood' : 'fish & seafood'
                : sorted.length === 1 ? 'item' : 'items';

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        <SearchBar />
        <ColumnToggle />
      </div>
      <TypeFilter />
      <CategoryFilter />
      <div className={styles.tableInfo}>
        <span className={styles.count}>
          {sorted.length} {countLabel}
        </span>
        {comparisonFruits.length > 0 && (
          <span className={styles.compareCount}>
            {comparisonFruits.length}/3 selected for comparison
          </span>
        )}
      </div>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <TableHeader visibleKeys={visibleKeys} showCheckbox={true} />
          <tbody>
            {sorted.map((fruit) => (
              <TableRow
                key={fruit.name}
                fruit={fruit}
                visibleKeys={visibleKeys as NutrientKey[]}
                isCompared={comparisonNames.has(fruit.name)}
                onSelect={() => setSelectedFruit(fruit)}
                onToggleCompare={() => toggleComparisonFruit(fruit)}
                showCheckbox={true}
              />
            ))}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className={styles.empty}>
            No items match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
