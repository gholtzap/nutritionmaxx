import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { useStore } from '../../store';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import type { NutrientFruit } from '../../types';
import styles from './Comparison.module.css';

const SLOT_COLORS = [
  'var(--compare-a)', 'var(--compare-b)', 'var(--compare-c)',
  'var(--compare-d)', 'var(--compare-e)', 'var(--compare-f)',
];

export default function FruitSelector() {
  const fruits = useDietaryFruits();
  const comparisonFruits = useStore((s) => s.comparisonFruits);
  const toggleComparisonFruit = useStore((s) => s.toggleComparisonFruit);
  const removeComparisonFruit = useStore((s) => s.removeComparisonFruit);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const comparisonNames = new Set(comparisonFruits.map((f) => f.name));

  const suggestions = query.length > 0
    ? fruits
        .filter((f) => !comparisonNames.has(f.name))
        .filter((f) => f.name.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 8)
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(fruit: NutrientFruit) {
    toggleComparisonFruit(fruit);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className={styles.selector}>
      <div className={styles.chips}>
        {comparisonFruits.map((fruit, i) => (
          <span
            key={fruit.name}
            className={styles.chip}
            style={{ borderColor: SLOT_COLORS[i] }}
          >
            <span
              className={styles.chipDot}
              style={{ background: SLOT_COLORS[i] }}
            />
            {fruit.name}
            <button
              type="button"
              className={styles.chipRemove}
              onClick={() => removeComparisonFruit(fruit.name)}
              aria-label={`Remove ${fruit.name}`}
            >
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
      {comparisonFruits.length < 6 && (
        <div className={styles.searchContainer} ref={containerRef}>
          <div className={styles.selectorSearch}>
            <MagnifyingGlass size={14} className={styles.selectorSearchIcon} />
            <input
              type="text"
              className={styles.selectorInput}
              placeholder="Add an item to compare..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
            />
          </div>
          {open && suggestions.length > 0 && (
            <ul className={styles.suggestions}>
              {suggestions.map((fruit) => (
                <li key={fruit.name}>
                  <button
                    type="button"
                    className={styles.suggestionItem}
                    onClick={() => handleSelect(fruit)}
                  >
                    <span>{fruit.name}</span>
                    <span className={styles.suggestionCategory}>{fruit.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
