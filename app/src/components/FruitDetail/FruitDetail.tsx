import { useEffect, useCallback } from 'react';
import { X } from '@phosphor-icons/react';
import { useStore } from '../../store';
import Badge from '../shared/Badge';
import MacroChart from './MacroChart';
import NutrientList from './NutrientList';
import styles from './FruitDetail.module.css';

export default function FruitDetail() {
  const selectedFruit = useStore((s) => s.selectedFruit);
  const setSelectedFruit = useStore((s) => s.setSelectedFruit);
  const showPerServing = useStore((s) => s.showPerServing);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedFruit) {
        setSelectedFruit(null);
      }
    },
    [selectedFruit, setSelectedFruit]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape]);

  const basisLabel = showPerServing && selectedFruit?.serving_label
    ? selectedFruit.serving_label
    : 'per 100g';

  return (
    <div className={`${styles.panel} ${selectedFruit ? styles.panelOpen : ''}`}>
      {selectedFruit && (
        <div className={styles.panelInner}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <h2 className={styles.fruitName}>{selectedFruit.name}</h2>
              <div className={styles.headerMeta}>
                <Badge category={selectedFruit.category} />
                <span className={styles.basisLabel}>{basisLabel}</span>
              </div>
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setSelectedFruit(null)}
              aria-label="Close detail panel"
            >
              <X size={16} />
            </button>
          </div>
          <div className={styles.body}>
            <MacroChart fruit={selectedFruit} />
            <NutrientList fruit={selectedFruit} />
          </div>
        </div>
      )}
    </div>
  );
}
