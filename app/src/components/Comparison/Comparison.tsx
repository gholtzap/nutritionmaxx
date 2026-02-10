import { useStore } from '../../store';
import FruitSelector from './FruitSelector';
import ComparisonGrid from './ComparisonGrid';
import styles from './Comparison.module.css';

export default function Comparison() {
  const comparisonFruits = useStore((s) => s.comparisonFruits);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Compare</h2>
        <p className={styles.subtitle}>Select up to 3 items to compare their nutritional values</p>
      </div>
      <FruitSelector />
      {comparisonFruits.length >= 2 && (
        <ComparisonGrid fruits={comparisonFruits} />
      )}
      {comparisonFruits.length < 2 && (
        <div className={styles.empty}>
          Select at least 2 items to see a comparison.
        </div>
      )}
    </div>
  );
}
