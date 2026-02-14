import { useMemo, useState, useRef, useEffect } from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { useStore } from '../../store';
import { DIETARY_OPTIONS, countExcluded, countExcludedByRule } from '../../utils/dietary';
import type { DietaryPreference } from '../../utils/dietary';
import styles from './DietaryPreferences.module.css';

export default function DietaryPreferences() {
  const fruits = useStore((s) => s.fruits);
  const preferences = useStore((s) => s.dietaryPreferences);
  const toggle = useStore((s) => s.toggleDietaryPreference);
  const clear = useStore((s) => s.clearDietaryPreferences);
  const blockedFoods = useStore((s) => s.blockedFoods);
  const blockFood = useStore((s) => s.blockFood);
  const unblockFood = useStore((s) => s.unblockFood);
  const clearBlockedFoods = useStore((s) => s.clearBlockedFoods);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalExcluded = useMemo(
    () => countExcluded(fruits, preferences),
    [fruits, preferences]
  );

  const ruleCounts = useMemo(() => {
    const map = new Map<DietaryPreference, number>();
    for (const opt of DIETARY_OPTIONS) {
      map.set(opt.key, countExcludedByRule(fruits, opt.key));
    }
    return map;
  }, [fruits]);

  const hasAnyPreference = Object.values(preferences).some(Boolean);
  const hasAny = hasAnyPreference || blockedFoods.size > 0;
  const totalHidden = totalExcluded + blockedFoods.size;

  const diets = DIETARY_OPTIONS.filter((o) => o.group === 'diet');
  const allergies = DIETARY_OPTIONS.filter((o) => o.group === 'allergy');

  const suggestions =
    query.length > 0
      ? fruits
          .filter((f) => !blockedFoods.has(f.name))
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

  function handleSelect(name: string) {
    blockFood(name);
    setQuery('');
    setOpen(false);
  }

  function handleClearAll() {
    clear();
    clearBlockedFoods();
  }

  const sortedBlocked = useMemo(
    () => [...blockedFoods].sort((a, b) => a.localeCompare(b)),
    [blockedFoods]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Dietary Preferences</h2>
        <p className={styles.subtitle}>
          {hasAny ? (
            <><span className={styles.subtitleCount}>{totalHidden}</span> items hidden</>
          ) : (
            'Hide foods that don\u2019t match your diet or allergies'
          )}
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Diets</h3>
        {diets.map((opt) => (
          <div key={opt.key} className={styles.row}>
            <div className={styles.rowInfo}>
              <div className={styles.rowLabel}>{opt.label}</div>
              <div className={styles.rowDescription}>{opt.description}</div>
            </div>
            <span className={styles.rowCount}>{ruleCounts.get(opt.key)} items</span>
            <button
              type="button"
              className={`${styles.toggle} ${preferences[opt.key] ? styles.toggleActive : ''}`}
              onClick={() => toggle(opt.key)}
              aria-pressed={preferences[opt.key]}
              aria-label={opt.label}
            />
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Allergies</h3>
        {allergies.map((opt) => (
          <div key={opt.key} className={styles.row}>
            <div className={styles.rowInfo}>
              <div className={styles.rowLabel}>{opt.label}</div>
              <div className={styles.rowDescription}>{opt.description}</div>
            </div>
            <span className={styles.rowCount}>{ruleCounts.get(opt.key)} items</span>
            <button
              type="button"
              className={`${styles.toggle} ${preferences[opt.key] ? styles.toggleActive : ''}`}
              onClick={() => toggle(opt.key)}
              aria-pressed={preferences[opt.key]}
              aria-label={opt.label}
            />
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Blocked Foods</h3>
        <div className={styles.blockSearchContainer} ref={containerRef}>
          <div className={styles.blockSearch}>
            <MagnifyingGlass size={14} className={styles.blockSearchIcon} />
            <input
              type="text"
              className={styles.blockInput}
              placeholder="Search to block a food..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
              }}
              onFocus={() => setOpen(true)}
            />
          </div>
          {open && suggestions.length > 0 && (
            <ul className={styles.blockSuggestions}>
              {suggestions.map((fruit) => (
                <li key={fruit.name}>
                  <button
                    type="button"
                    className={styles.blockSuggestionItem}
                    onClick={() => handleSelect(fruit.name)}
                  >
                    <span>{fruit.name}</span>
                    <span className={styles.blockSuggestionCategory}>{fruit.category}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {sortedBlocked.length > 0 && (
          <div className={styles.blockedList}>
            {sortedBlocked.map((name) => (
              <div key={name} className={styles.blockedItem}>
                <span className={styles.blockedName}>{name}</span>
                <button
                  type="button"
                  className={styles.blockedRemove}
                  onClick={() => unblockFood(name)}
                  aria-label={`Unblock ${name}`}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {hasAny && (
        <button type="button" className={styles.clearButton} onClick={handleClearAll}>
          Clear all
        </button>
      )}
    </div>
  );
}
