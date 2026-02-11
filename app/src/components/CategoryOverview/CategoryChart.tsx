import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { NutrientKey } from '../../types';
import type { CategoryAverage } from '../../utils/aggregations';
import { useStore } from '../../store';
import { NUTRIENT_META, NUTRIENT_MAP, CATEGORY_COLORS, hasDailyValue } from '../../utils/nutrition-meta';
import { formatNutrientDisplay, toDailyValuePercent } from '../../utils/format';
import styles from './CategoryOverview.module.css';

interface CategoryChartProps {
  data: CategoryAverage[];
}

export default function CategoryChart({ data }: CategoryChartProps) {
  const [selectedKey, setSelectedKey] = useState<NutrientKey>('calories_kcal');
  const meta = NUTRIENT_MAP.get(selectedKey)!;
  const showDV = useStore((s) => s.showDailyValue);
  const useDV = showDV && hasDailyValue(selectedKey);

  const chartData = data
    .map((d) => {
      const rawValue = d.averages[selectedKey];
      const dvPct = toDailyValuePercent(rawValue, selectedKey);
      return {
        category: d.category,
        value: useDV && dvPct !== null ? dvPct : (rawValue ?? 0),
        rawValue,
        isNull: rawValue === null,
        color: CATEGORY_COLORS[d.category],
      };
    })
    .sort((a, b) => b.value - a.value);

  const unitLabel = useDV ? '% DV' : meta.unit;

  return (
    <div className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Average by Category</h3>
        <select
          className={styles.chartSelect}
          value={selectedKey}
          onChange={(e) => setSelectedKey(e.target.value as NutrientKey)}
        >
          {NUTRIENT_META.map((m) => (
            <option key={m.key} value={m.key}>
              {m.label} ({m.unit})
            </option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 4 }}>
          <XAxis
            dataKey="category"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 11 }}
            width={48}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
            contentStyle={{
              background: '#222636',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6,
              fontSize: 12,
              color: '#e2e8f0',
            }}
            labelStyle={{ color: '#94a3b8' }}
            itemStyle={{ color: '#e2e8f0' }}
            formatter={(_: unknown, __: unknown, props: { payload?: { rawValue: number | null } }) => {
              if (!props.payload) return ['', ''];
              return [
                `${formatNutrientDisplay(props.payload.rawValue, selectedKey, showDV)} ${unitLabel}`,
                `Avg ${meta.label}`,
              ];
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {chartData.map((entry) => (
              <Cell
                key={entry.category}
                fill={entry.color}
                fillOpacity={entry.isNull ? 0.2 : 0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
