import type { NutrientProfile, BodySystem } from '../../utils/nutrient-profiles';
import { NUTRIENT_MAP } from '../../utils/nutrition-meta';
import StatBar from './StatBar';
import styles from './NutrientGuide.module.css';

interface NutrientCardProps {
  profile: NutrientProfile;
  onClick: () => void;
}

export default function NutrientCard({ profile, onClick }: NutrientCardProps) {
  const meta = NUTRIENT_MAP.get(profile.key);
  const label = meta?.label ?? profile.key;

  const topStats = (Object.entries(profile.stats) as [BodySystem, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      style={{ borderLeftColor: profile.color }}
    >
      <span className={styles.cardName}>{label}</span>
      <div className={styles.cardStats}>
        {topStats.map(([system, value]) => (
          <div key={system} className={styles.cardStatRow}>
            <span className={styles.cardStatLabel}>{system}</span>
            <StatBar value={value} color={profile.color} />
          </div>
        ))}
      </div>
    </button>
  );
}
