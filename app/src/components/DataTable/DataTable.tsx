import { useMemo } from 'react';
import { ArrowRight } from '@phosphor-icons/react';
import { useStore } from '../../store';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import type { NutrientFruit, NutrientKey } from '../../types';
import { NUTRIENT_META } from '../../utils/nutrition-meta';
import { getItemDisplayValue } from '../../utils/format';
import { useScoreFunction } from '../../utils/use-nutrient-density-score';
import { usePersonalizedScoreFunction } from '../../utils/use-personalized-score';
import SearchBar from './SearchBar';
import TypeFilter from './TypeFilter';
import CategoryFilter from './CategoryFilter';
import ColumnToggle from './ColumnToggle';
import TableHeader from './TableHeader';
import TableRow from './TableRow';
import styles from './DataTable.module.css';

export default function DataTable() {
  const allFruits = useStore((s) => s.fruits);
  const setActiveView = useStore((s) => s.setActiveView);
  const fruits = useDietaryFruits();
  const searchQuery = useStore((s) => s.searchQuery);
  const selectedType = useStore((s) => s.selectedType);
  const selectedCategories = useStore((s) => s.selectedCategories);
  const sort = useStore((s) => s.sort);
  const visibleColumns = useStore((s) => s.visibleColumns);
  const comparisonFruits = useStore((s) => s.comparisonFruits);
  const setSelectedFruit = useStore((s) => s.setSelectedFruit);
  const toggleComparisonFruit = useStore((s) => s.toggleComparisonFruit);
  const showPerServing = useStore((s) => s.showPerServing);

  const getScore = useScoreFunction();
  const getPersonalizedScore = usePersonalizedScoreFunction();
  const showPersonalizedScore = getPersonalizedScore !== null;

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

  const scoreMap = useMemo(() => {
    const map = new Map<string, number | null>();
    for (const f of filtered) {
      map.set(f.name, getScore(f));
    }
    return map;
  }, [filtered, getScore]);

  const personalizedScoreMap = useMemo(() => {
    if (!getPersonalizedScore) return new Map<string, number | null>();
    const map = new Map<string, number | null>();
    for (const f of filtered) {
      map.set(f.name, getPersonalizedScore(f));
    }
    return map;
  }, [filtered, getPersonalizedScore]);

  const sorted = useMemo(() => {
    const { key, direction } = sort;
    const mult = direction === 'asc' ? 1 : -1;
    const isNutrientKey = NUTRIENT_META.some((m) => m.key === key);

    return [...filtered].sort((a, b) => {
      let aVal: string | number | null;
      let bVal: string | number | null;

      if (key === 'score') {
        aVal = scoreMap.get(a.name) ?? null;
        bVal = scoreMap.get(b.name) ?? null;
      } else if (key === 'personalizedScore') {
        aVal = personalizedScoreMap.get(a.name) ?? null;
        bVal = personalizedScoreMap.get(b.name) ?? null;
      } else if (isNutrientKey && showPerServing) {
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
  }, [filtered, sort, showPerServing, scoreMap, personalizedScoreMap]);

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
                : selectedType === 'poultry'
                  ? 'poultry'
                  : selectedType === 'beef'
                    ? sorted.length === 1 ? 'beef cut' : 'beef cuts'
                    : selectedType === 'pork'
                      ? sorted.length === 1 ? 'pork cut' : 'pork cuts'
                      : selectedType === 'fat_oil'
                        ? sorted.length === 1 ? 'fat/oil' : 'fats & oils'
                        : selectedType === 'dairy'
                          ? sorted.length === 1 ? 'dairy product' : 'dairy products'
                          : selectedType === 'egg'
                            ? sorted.length === 1 ? 'egg' : 'eggs'
                            : selectedType === 'lamb'
                              ? sorted.length === 1 ? 'lamb cut' : 'lamb cuts'
                              : sorted.length === 1 ? 'item' : 'items';

  return (
    <div className={styles.container}>
      <div className={styles.headline}>
        <div className={styles.headlineText}>
          <h1 className={styles.headlineTitle}>
            Compare the nutrition of {allFruits.length}+ foods, instantly.
          </h1>
          <p className={styles.headlineSubtitle}>
            Find the best foods for energy, immunity, and recovery across 29 nutrients.
          </p>
          <div className={styles.trustBadge}>USDA FoodData Central</div>
        </div>
        <button
          type="button"
          className={styles.headlineCta}
          onClick={() => setActiveView('fixdiet')}
        >
          <span className={styles.ctaContent}>
            <span className={styles.ctaLabel}>Boost your energy, immunity, or recovery</span>
            <span className={styles.ctaDescription}>Take a 2-min quiz — get foods matched to your goals</span>
          </span>
          <ArrowRight size={16} weight="bold" />
        </button>
      </div>
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
          <TableHeader visibleKeys={visibleKeys} showCheckbox={true} showPersonalizedScore={showPersonalizedScore} />
          <tbody>
            {sorted.map((fruit) => (
              <TableRow
                key={fruit.name}
                fruit={fruit}
                visibleKeys={visibleKeys as NutrientKey[]}
                score={scoreMap.get(fruit.name) ?? null}
                personalizedScore={personalizedScoreMap.get(fruit.name) ?? null}
                showPersonalizedScore={showPersonalizedScore}
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
