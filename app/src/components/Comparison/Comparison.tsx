import { useState, useCallback, useRef, useEffect } from 'react';
import { ShareNetwork, Check } from '@phosphor-icons/react';
import { useStore } from '../../store';
import FruitSelector from './FruitSelector';
import ComparisonGrid from './ComparisonGrid';
import styles from './Comparison.module.css';

export default function Comparison() {
  const comparisonFruits = useStore((s) => s.comparisonFruits);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  const handleShare = useCallback(() => {
    if (comparisonFruits.length === 0) return;
    const url = new URL(window.location.href);
    url.searchParams.set('compare', comparisonFruits.map((f) => f.name).join(','));
    url.searchParams.delete('food');
    navigator.clipboard.writeText(url.toString());
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 1500);
  }, [comparisonFruits]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Compare</h2>
          <p className={styles.subtitle}>Select up to 6 items to compare their nutritional values</p>
        </div>
        {comparisonFruits.length >= 2 && (
          <button
            type="button"
            className={`${styles.shareButton} ${copied ? styles.shareButtonCopied : ''}`}
            onClick={handleShare}
            aria-label="Copy comparison link to clipboard"
          >
            {copied ? <Check size={16} /> : <ShareNetwork size={16} />}
            <span>{copied ? 'Copied' : 'Share'}</span>
          </button>
        )}
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
