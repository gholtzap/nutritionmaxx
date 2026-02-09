import { useStore } from '../../store';
import type { FruitCategory } from '../../types';
import { ALL_CATEGORIES, CATEGORY_COLORS } from '../../utils/nutrition-meta';
import styles from './DataTable.module.css';

export default function CategoryFilter() {
  const selectedCategories = useStore((s) => s.selectedCategories);
  const toggleCategory = useStore((s) => s.toggleCategory);

  return (
    <div className={styles.categoryFilter}>
      {ALL_CATEGORIES.map((cat) => {
        const active = selectedCategories.has(cat as FruitCategory);
        const color = CATEGORY_COLORS[cat];
        return (
          <button
            key={cat}
            type="button"
            className={`${styles.categoryPill} ${active ? styles.categoryPillActive : ''}`}
            onClick={() => toggleCategory(cat as FruitCategory)}
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
