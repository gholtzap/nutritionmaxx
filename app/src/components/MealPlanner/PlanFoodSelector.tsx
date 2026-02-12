import { useState, useRef, useEffect } from 'react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { NutrientFruit } from '../../types';
import styles from './MealPlanner.module.css';

export default function PlanFoodSelector() {
  const fruits = useStore((s) => s.fruits);
  const planEntries = useStore((s) => s.planEntries);
  const addPlanEntry = useStore((s) => s.addPlanEntry);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const planNames = new Set(planEntries.map((e) => e.name));

  const suggestions =
    query.length > 0
      ? fruits
          .filter((f) => !planNames.has(f.name))
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
    addPlanEntry(fruit.name);
    setQuery('');
    setOpen(false);
  }

  return (
    <div className={styles.searchContainer} ref={containerRef}>
      <div className={styles.selectorSearch}>
        <MagnifyingGlass size={14} className={styles.selectorSearchIcon} />
        <input
          type="text"
          className={styles.selectorInput}
          placeholder="Add a food to your plan..."
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
  );
}
