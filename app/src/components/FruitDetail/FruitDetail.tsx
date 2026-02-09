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

  return (
    <div className={`${styles.panel} ${selectedFruit ? styles.panelOpen : ''}`}>
      {selectedFruit && (
        <div className={styles.panelInner}>
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <h2 className={styles.fruitName}>{selectedFruit.name}</h2>
              <Badge category={selectedFruit.category} />
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
