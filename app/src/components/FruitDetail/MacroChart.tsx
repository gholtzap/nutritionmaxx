import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { NutrientFruit, NutrientKey } from '../../types';
import { MACRO_KEYS, NUTRIENT_MAP } from '../../utils/nutrition-meta';
import { formatNutrient } from '../../utils/format';
import styles from './FruitDetail.module.css';

interface MacroChartProps {
  fruit: NutrientFruit;
}

export default function MacroChart({ fruit }: MacroChartProps) {
  const data = MACRO_KEYS.filter((k) => k !== 'water_g').map((key) => {
    const meta = NUTRIENT_MAP.get(key)!;
    const value = fruit[key] as number | null;
    return {
      name: meta.label,
      value: value ?? 0,
      key,
      display: formatNutrient(value, key),
      isNull: value === null,
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
            formatter={(_: unknown, __: unknown, props: { payload: { display: string; key: NutrientKey } }) => {
              const meta = NUTRIENT_MAP.get(props.payload.key);
              return [`${props.payload.display} ${meta?.unit || ''}`, ''];
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
