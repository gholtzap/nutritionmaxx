import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { NutrientFruit } from '../../types';
import { useStore } from '../../store';
import { MACRO_KEYS, NUTRIENT_MAP, hasDailyValue } from '../../utils/nutrition-meta';
import { formatNutrientDisplay, toDailyValuePercent, getItemDisplayValue } from '../../utils/format';
import { useEffectiveDailyValues } from '../../utils/use-effective-daily-values';
import styles from './FruitDetail.module.css';

interface MacroChartProps {
  fruit: NutrientFruit;
}

export default function MacroChart({ fruit }: MacroChartProps) {
  const showDV = useStore((s) => s.showDailyValue);
  const showPerServing = useStore((s) => s.showPerServing);
  const dvMap = useEffectiveDailyValues();

  const data = MACRO_KEYS.filter((k) => k !== 'water_g').map((key) => {
    const meta = NUTRIENT_MAP.get(key)!;
    const displayValue = getItemDisplayValue(fruit, key, showPerServing);
    const dvPct = toDailyValuePercent(displayValue, key, dvMap);
    const chartValue = showDV && hasDailyValue(key) && dvPct !== null ? dvPct : (displayValue ?? 0);
    return {
      name: meta.label,
      value: chartValue,
      key,
      display: formatNutrientDisplay(displayValue, key, showDV, dvMap),
      unit: showDV && hasDailyValue(key) ? '% DV' : meta.unit,
      isNull: displayValue === null,
    };
  });

  return (
    <div className={styles.chartSection}>
      <h3 className={styles.sectionTitle}>Macronutrients</h3>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} layout="vertical" margin={{ left: 60, right: 16, top: 4, bottom: 4 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            width={56}
          />
          <Tooltip
            cursor={false}
            contentStyle={{
              background: '#222636',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              fontSize: 12,
              color: '#e2e8f0',
            }}
            labelStyle={{ color: '#94a3b8' }}
            itemStyle={{ color: '#e2e8f0' }}
            formatter={(_: unknown, __: unknown, props: { payload?: { display: string; unit: string } }) => {
              if (!props.payload) return ['', ''];
              return [`${props.payload.display} ${props.payload.unit}`, ''];
            }}
          />
          <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={16}>
            {data.map((entry) => (
              <Cell
                key={entry.key}
                fill={entry.isNull ? '#334155' : '#63b3ed'}
                fillOpacity={entry.isNull ? 0.3 : 0.8}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
