import type { FruitCategory } from '../../types';
import { CATEGORY_COLORS } from '../../utils/nutrition-meta';
import styles from './Badge.module.css';

interface BadgeProps {
  category: FruitCategory;
}

export default function Badge({ category }: BadgeProps) {
  const color = CATEGORY_COLORS[category] || 'var(--text-tertiary)';

  return (
    <span
      className={styles.badge}
      style={{ borderColor: color, color }}
    >
      {category}
    </span>
  );
}
