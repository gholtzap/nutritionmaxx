import styles from './NutrientGuide.module.css';

interface StatBarProps {
  value: number;
  max?: number;
  color: string;
}

export default function StatBar({ value, max = 5, color }: StatBarProps) {
  return (
    <div className={styles.statBar}>
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={styles.statSegment}
          style={{
            background: i < value ? color : undefined,
          }}
        />
      ))}
    </div>
  );
}
