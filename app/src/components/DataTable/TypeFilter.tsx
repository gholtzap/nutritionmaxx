import { useStore } from '../../store';
import type { ItemType } from '../../types';
import styles from './DataTable.module.css';

const TYPE_OPTIONS: { label: string; value: ItemType | null }[] = [
  { label: 'All', value: null },
  { label: 'Fruits', value: 'fruit' },
  { label: 'Vegetables', value: 'vegetable' },
  { label: 'Spices', value: 'spice' },
  { label: 'Nuts & Seeds', value: 'nut_seed' },
  { label: 'Legumes', value: 'legume' },
  { label: 'Grains', value: 'grain' },
  { label: 'Fish & Seafood', value: 'fish_seafood' },
];

export default function TypeFilter() {
  const selectedType = useStore((s) => s.selectedType);
  const setSelectedType = useStore((s) => s.setSelectedType);

  return (
    <div className={styles.typeFilter}>
      {TYPE_OPTIONS.map((opt) => (
        <button
          key={opt.label}
          type="button"
          className={`${styles.typePill} ${selectedType === opt.value ? styles.typePillActive : ''}`}
          onClick={() => setSelectedType(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
