import { useMemo } from 'react';
import { useStore } from '../../store';
import type { ItemCategory } from '../../types';
import { FRUIT_CATEGORIES, VEGETABLE_CATEGORIES, SPICE_CATEGORIES, NUT_SEED_CATEGORIES, ALL_CATEGORIES, CATEGORY_COLORS } from '../../utils/nutrition-meta';
import styles from './DataTable.module.css';

export default function CategoryFilter() {
  const selectedType = useStore((s) => s.selectedType);
  const selectedCategories = useStore((s) => s.selectedCategories);
  const toggleCategory = useStore((s) => s.toggleCategory);

  const categories = useMemo(() => {
    if (selectedType === 'fruit') return FRUIT_CATEGORIES as readonly ItemCategory[];
    if (selectedType === 'vegetable') return VEGETABLE_CATEGORIES as readonly ItemCategory[];
    if (selectedType === 'spice') return SPICE_CATEGORIES as readonly ItemCategory[];
    if (selectedType === 'nut_seed') return NUT_SEED_CATEGORIES as readonly ItemCategory[];
    return ALL_CATEGORIES;
  }, [selectedType]);

  return (
    <div className={styles.categoryFilter}>
      {categories.map((cat) => {
        const active = selectedCategories.has(cat);
        const color = CATEGORY_COLORS[cat];
        return (
          <button
            key={cat}
            type="button"
            className={`${styles.categoryPill} ${active ? styles.categoryPillActive : ''}`}
            onClick={() => toggleCategory(cat)}
            style={active ? { borderColor: color, color } : undefined}
          >
            <span
              className={styles.categoryDot}
              style={{ background: color }}
            />
            {cat}
          </button>
        );
      })}
    </div>
  );
}
