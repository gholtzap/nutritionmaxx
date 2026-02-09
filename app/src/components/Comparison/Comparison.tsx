import { useStore } from '../../store';
import FruitSelector from './FruitSelector';
import ComparisonBar from './ComparisonBar';
import styles from './Comparison.module.css';

const SLOT_COLORS = ['var(--compare-a)', 'var(--compare-b)', 'var(--compare-c)'];

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
        <>
          <div className={styles.legend}>
            {comparisonFruits.map((fruit, i) => (
              <div key={fruit.name} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ background: SLOT_COLORS[i] }}
                />
                <span>{fruit.name}</span>
              </div>
            ))}
          </div>
          <ComparisonBar fruits={comparisonFruits} />
        </>
      )}
      {comparisonFruits.length < 2 && (
        <div className={styles.empty}>
          Select at least 2 items to see a comparison.
        </div>
      )}
    </div>
  );
}
