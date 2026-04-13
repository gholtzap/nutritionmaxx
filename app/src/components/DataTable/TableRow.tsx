import type { NutrientFruit, NutrientKey } from '../../types';
import { useStore } from '../../store';
import { formatNutrientDisplay, getItemDisplayValue } from '../../utils/format';
import { useEffectiveDailyValues } from '../../utils/use-effective-daily-values';
import type { HistamineWarning } from '../../utils/dietary';
import Badge from '../shared/Badge';
import styles from './DataTable.module.css';

interface TableRowProps {
  fruit: NutrientFruit;
  visibleKeys: NutrientKey[];
  score: number | null;
  personalizedScore: number | null;
  showPersonalizedScore: boolean;
  showHistamine: boolean;
  histamineWarning: HistamineWarning | null;
  isCompared: boolean;
  onSelect: () => void;
  onToggleCompare: () => void;
  showCheckbox: boolean;
}

export default function TableRow({
  fruit,
  visibleKeys,
  score,
  personalizedScore,
  showPersonalizedScore,
  showHistamine,
  histamineWarning,
  isCompared,
  onSelect,
  onToggleCompare,
  showCheckbox,
}: TableRowProps) {
  const showDV = useStore((s) => s.showDailyValue);
  const showPerServing = useStore((s) => s.showPerServing);
  const dvMap = useEffectiveDailyValues();

  return (
    <tr className={styles.row} onClick={onSelect}>
      {showCheckbox && (
        <td className={styles.tdCheckbox}>
          <input
            type="checkbox"
            checked={isCompared}
            onChange={(e) => {
              e.stopPropagation();
              onToggleCompare();
            }}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Compare ${fruit.name}`}
          />
        </td>
      )}
      <td className={`${styles.td} ${styles.tdName}`}>{fruit.name}</td>
      <td className={styles.td}>
        <Badge category={fruit.category} />
      </td>
      <td className={`${styles.td} ${styles.tdNumeric} ${score === null ? styles.tdNull : ''}`}>
        {score !== null ? score.toFixed(1) : '--'}
      </td>
      {showPersonalizedScore && (
        <td className={`${styles.td} ${styles.tdNumeric} ${personalizedScore === null ? styles.tdNull : styles.tdPersonalized}`}>
          {personalizedScore !== null ? personalizedScore.toFixed(1) : '--'}
        </td>
      )}
      {showHistamine && (
        <td className={`${styles.td} ${styles.tdNumeric}`}>
          {histamineWarning && (
            <span className={histamineWarning.severity === 'high' ? styles.histamineDotHigh : styles.histamineDotModerate}>
              {histamineWarning.severity === 'high' ? 'High' : 'Mod'}
            </span>
          )}
        </td>
      )}
      {visibleKeys.map((key) => {
        const value = getItemDisplayValue(fruit, key, showPerServing);
        const formatted = formatNutrientDisplay(value, key, showDV, dvMap);
        const isNull = value === null || value === undefined;
        return (
          <td
            key={key}
            className={`${styles.td} ${styles.tdNumeric} ${isNull ? styles.tdNull : ''}`}
          >
            {formatted}
          </td>
        );
      })}
    </tr>
  );
}
