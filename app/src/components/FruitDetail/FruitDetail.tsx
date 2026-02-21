import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ShareNetwork, Check } from '@phosphor-icons/react';
import { useStore } from '../../store';
import { useScoreFunction } from '../../utils/use-nutrient-density-score';
import Badge from '../shared/Badge';
import MacroChart from './MacroChart';
import NutrientList from './NutrientList';
import styles from './FruitDetail.module.css';

export default function FruitDetail() {
  const selectedFruit = useStore((s) => s.selectedFruit);
  const setSelectedFruit = useStore((s) => s.setSelectedFruit);
  const showPerServing = useStore((s) => s.showPerServing);
  const getScore = useScoreFunction();
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

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

  useEffect(() => {
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  const handleShare = useCallback(() => {
    if (!selectedFruit) return;
    const url = new URL(window.location.href);
    url.searchParams.set('food', selectedFruit.name);
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1500);
  }, [selectedFruit]);

  const basisLabel = showPerServing && selectedFruit?.serving_label
    ? selectedFruit.serving_label
    : 'per 100g';

  const score = selectedFruit ? getScore(selectedFruit) : null;

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
                {score !== null && (
                  <span className={styles.scoreLabel}>Score {score.toFixed(1)}</span>
                )}
              </div>
            </div>
            <div className={styles.headerActions}>
              <button
                type="button"
                className={`${styles.closeButton} ${copied ? styles.shareButtonCopied : ''}`}
                onClick={handleShare}
                aria-label="Copy link to clipboard"
              >
                {copied ? <Check size={16} /> : <ShareNetwork size={16} />}
              </button>
              <button
                type="button"
                className={styles.closeButton}
                onClick={() => setSelectedFruit(null)}
                aria-label="Close detail panel"
              >
                <X size={16} />
              </button>
            </div>
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
