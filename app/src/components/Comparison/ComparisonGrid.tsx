import type { NutrientFruit, NutrientKey, NutrientGroup } from '../../types';
import { useStore } from '../../store';
import { NUTRIENT_META, NUTRIENT_MAP, hasDailyValue } from '../../utils/nutrition-meta';
import { formatNutrientDisplay, toDailyValuePercent, getItemDisplayValue } from '../../utils/format';
import styles from './Comparison.module.css';

const SLOT_COLORS = ['var(--compare-a)', 'var(--compare-b)', 'var(--compare-c)'];

const GROUP_LABELS: Record<NutrientGroup, string> = {
  macro: 'Macros',
  vitamin: 'Vitamins',
  mineral: 'Minerals',
};

const GROUP_ORDER: NutrientGroup[] = ['macro', 'vitamin', 'mineral'];

function getDvRatio(raw: number | null, key: NutrientKey, maxInRow: number | null): number {
  if (raw === null) return 0;
  const meta = NUTRIENT_MAP.get(key);
  if (meta?.dailyValue !== null && meta?.dailyValue !== undefined) {
    return raw / meta.dailyValue;
  }
  if (maxInRow !== null && maxInRow > 0) return raw / maxInRow;
  return 0;
}

function getBarStyle(ratio: number): React.CSSProperties {
  const clamped = Math.min(Math.max(ratio, 0), 1);
  const hue = clamped * 142;
  const saturation = 65 + clamped * 5;
  const lightness = 50 + clamped * 2;
  const alpha = 0.18 + clamped * 0.07;
  return {
    width: `${clamped * 100}%`,
    background: `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`,
  };
}

interface ComparisonGridProps {
  fruits: NutrientFruit[];
}

export default function ComparisonGrid({ fruits }: ComparisonGridProps) {
  const showDV = useStore((s) => s.showDailyValue);
  const showPerServing = useStore((s) => s.showPerServing);

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    label: GROUP_LABELS[group],
    nutrients: NUTRIENT_META.filter((m) => m.group === group),
  }));

  return (
    <div className={styles.gridWrapper}>
      <table className={styles.grid}>
        <thead>
          <tr>
            <th className={styles.gridCorner} />
            {fruits.map((fruit, i) => (
              <th key={fruit.name} className={styles.gridHeaderCell}>
                <span
                  className={styles.gridHeaderDot}
                  style={{ background: SLOT_COLORS[i] }}
                />
                {fruit.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {grouped.map(({ group, label, nutrients }) => (
            <GroupSection
              key={group}
              label={label}
              nutrients={nutrients}
              fruits={fruits}
              showDV={showDV}
              showPerServing={showPerServing}
              colCount={fruits.length}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface GroupSectionProps {
  label: string;
  nutrients: typeof NUTRIENT_META;
  fruits: NutrientFruit[];
  showDV: boolean;
  showPerServing: boolean;
  colCount: number;
}

function GroupSection({ label, nutrients, fruits, showDV, showPerServing, colCount }: GroupSectionProps) {
  return (
    <>
      <tr>
        <td className={styles.groupRow} colSpan={colCount + 1}>
          {label}
        </td>
      </tr>
      {nutrients.map((meta) => {
        const key = meta.key as NutrientKey;
        const useDV = showDV && hasDailyValue(key);

        const displayValues = fruits.map((f) => getItemDisplayValue(f, key, showPerServing));
        const displayNonNull = displayValues.filter((v): v is number => v !== null);
        const displayMax = displayNonNull.length > 0 ? Math.max(...displayNonNull) : null;

        const values = fruits.map((_, i) => {
          const display = displayValues[i];
          return {
            raw: display,
            display: formatNutrientDisplay(display, key, showDV),
            numeric: useDV ? toDailyValuePercent(display, key) : display,
            dvRatio: getDvRatio(display, key, displayMax),
          };
        });

        const numericValues = values
          .map((v) => v.numeric)
          .filter((v): v is number => v !== null);
        const maxVal = numericValues.length > 0 ? Math.max(...numericValues) : null;
        const unit = useDV ? '% DV' : meta.unit;

        return (
          <tr key={key}>
            <td className={styles.nutrientCell}>
              <span className={styles.nutrientName}>{meta.label}</span>
              <span className={styles.nutrientUnit}>{unit}</span>
            </td>
            {values.map((v, i) => {
              const isBest =
                maxVal !== null &&
                v.numeric !== null &&
                v.numeric === maxVal &&
                numericValues.length > 1;
              const isNull = v.raw === null;
              const className = [
                styles.valueCell,
                isBest ? styles.valueBest : '',
                isNull ? styles.valueNull : '',
              ]
                .filter(Boolean)
                .join(' ');

              return (
                <td key={fruits[i].name} className={className}>
                  {v.raw !== null && (
                    <span
                      className={styles.valueFill}
                      style={getBarStyle(v.dvRatio)}
                    />
                  )}
                  <span className={styles.valueText}>{v.display}</span>
                </td>
              );
            })}
          </tr>
        );
      })}
    </>
  );
}
