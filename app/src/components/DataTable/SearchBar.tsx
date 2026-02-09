import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { useStore } from '../../store';
import styles from './DataTable.module.css';

export default function SearchBar() {
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const [localValue, setLocalValue] = useState(searchQuery);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(searchQuery);
  }, [searchQuery]);

  function handleChange(value: string) {
    setLocalValue(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setSearchQuery(value);
    }, 150);
  }

  function handleClear() {
    setLocalValue('');
    setSearchQuery('');
  }

  return (
    <div className={styles.searchBar}>
      <MagnifyingGlass size={14} className={styles.searchIcon} />
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search..."
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
      />
      {localValue && (
        <button
          className={styles.clearButton}
          onClick={handleClear}
          type="button"
          aria-label="Clear search"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}
