import { useState, useRef, useEffect } from 'react';
import { Sliders } from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { NutrientKey } from '../../types';
import {
  MACRO_KEYS,
  VITAMIN_KEYS,
  MINERAL_KEYS,
  NUTRIENT_MAP,
} from '../../utils/nutrition-meta';
import styles from './DataTable.module.css';

interface GroupConfig {
  label: string;
  keys: NutrientKey[];
}

const GROUPS: GroupConfig[] = [
  { label: 'Macros', keys: MACRO_KEYS },
  { label: 'Vitamins', keys: VITAMIN_KEYS },
  { label: 'Minerals', keys: MINERAL_KEYS },
];

export default function ColumnToggle() {
  const [open, setOpen] = useState(false);
  const visibleColumns = useStore((s) => s.visibleColumns);
  const toggleColumn = useStore((s) => s.toggleColumn);
  const setColumnGroup = useStore((s) => s.setColumnGroup);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className={styles.columnToggle} ref={dropdownRef}>
      <button
        type="button"
        className={styles.columnToggleButton}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        <Sliders size={14} />
        <span>Columns</span>
      </button>
      {open && (
        <div className={styles.columnDropdown}>
          {GROUPS.map((group) => {
            const allVisible = group.keys.every((k) => visibleColumns.has(k));
            const someVisible = group.keys.some((k) => visibleColumns.has(k));
            return (
              <div key={group.label} className={styles.columnGroup}>
                <label className={styles.columnGroupHeader}>
                  <input
                    type="checkbox"
                    checked={allVisible}
                    ref={(el) => {
                      if (el) el.indeterminate = someVisible && !allVisible;
                    }}
                    onChange={() => setColumnGroup(group.keys, !allVisible)}
                  />
                  <span>{group.label}</span>
                </label>
                {group.keys.map((key) => {
                  const meta = NUTRIENT_MAP.get(key);
                  return (
                    <label key={key} className={styles.columnItem}>
                      <input
                        type="checkbox"
                        checked={visibleColumns.has(key)}
                        onChange={() => toggleColumn(key)}
                      />
                      <span>{meta?.label || key}</span>
                    </label>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
