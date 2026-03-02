import { CaretUp, CaretDown } from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { NutrientKey, SortConfig } from '../../types';
import { NUTRIENT_MAP, hasDailyValue } from '../../utils/nutrition-meta';
import styles from './DataTable.module.css';

interface TableHeaderProps {
  visibleKeys: NutrientKey[];
  showCheckbox: boolean;
  showPersonalizedScore: boolean;
}

export default function TableHeader({ visibleKeys, showCheckbox, showPersonalizedScore }: TableHeaderProps) {
  const sort = useStore((s) => s.sort);
  const setSort = useStore((s) => s.setSort);
  const showDV = useStore((s) => s.showDailyValue);

  function handleSort(key: string) {
    const next: SortConfig =
      sort.key === key
        ? { key, direction: sort.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: key === 'name' ? 'asc' : 'desc' };
    setSort(next);
  }

  function renderSortIcon(key: string) {
    if (sort.key !== key) return null;
    return sort.direction === 'asc' ? (
      <CaretUp size={10} weight="bold" />
    ) : (
      <CaretDown size={10} weight="bold" />
    );
  }

  return (
    <thead>
      <tr>
        {showCheckbox && <th className={styles.thCheckbox} />}
        <th
          className={`${styles.th} ${styles.thName}`}
          onClick={() => handleSort('name')}
        >
          <span className={styles.thContent}>
            Name {renderSortIcon('name')}
          </span>
        </th>
        <th
          className={styles.th}
          onClick={() => handleSort('category')}
        >
          <span className={styles.thContent}>
            Category {renderSortIcon('category')}
          </span>
        </th>
        <th
          className={`${styles.th} ${styles.thNumeric}`}
          onClick={() => handleSort('score')}
        >
          <span className={styles.thContent}>
            Score
            {renderSortIcon('score')}
          </span>
        </th>
        {showPersonalizedScore && (
          <th
            className={`${styles.th} ${styles.thNumeric} ${styles.thPersonalized}`}
            onClick={() => handleSort('personalizedScore')}
          >
            <span className={styles.thContent}>
              My Score
              {renderSortIcon('personalizedScore')}
            </span>
          </th>
        )}
        {visibleKeys.map((key) => {
          const meta = NUTRIENT_MAP.get(key);
          return (
            <th
              key={key}
              className={`${styles.th} ${styles.thNumeric}`}
              onClick={() => handleSort(key)}
            >
              <span className={styles.thContent}>
                {meta?.label || key}
                <span className={styles.thUnit}>
                  {showDV && meta && hasDailyValue(key) ? '% DV' : meta?.unit}
                </span>
                {renderSortIcon(key)}
              </span>
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
