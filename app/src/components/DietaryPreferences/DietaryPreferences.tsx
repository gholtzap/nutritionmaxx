import { useMemo } from 'react';
import { useStore } from '../../store';
import { DIETARY_OPTIONS, countExcluded, countExcludedByRule } from '../../utils/dietary';
import type { DietaryPreference } from '../../utils/dietary';
import styles from './DietaryPreferences.module.css';

export default function DietaryPreferences() {
  const fruits = useStore((s) => s.fruits);
  const preferences = useStore((s) => s.dietaryPreferences);
  const toggle = useStore((s) => s.toggleDietaryPreference);
  const clear = useStore((s) => s.clearDietaryPreferences);

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

  const hasAny = Object.values(preferences).some(Boolean);

  const diets = DIETARY_OPTIONS.filter((o) => o.group === 'diet');
  const allergies = DIETARY_OPTIONS.filter((o) => o.group === 'allergy');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Dietary Preferences</h2>
        <p className={styles.subtitle}>
          {hasAny ? (
            <><span className={styles.subtitleCount}>{totalExcluded}</span> items hidden</>
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

      {hasAny && (
        <button type="button" className={styles.clearButton} onClick={clear}>
          Clear all
        </button>
      )}
    </div>
  );
}
