import { useMemo } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import type { NutrientProfile, BodySystem } from '../../utils/nutrient-profiles';
import { NUTRIENT_MAP } from '../../utils/nutrition-meta';
import { formatNutrientWithUnit } from '../../utils/format';
import type { NutrientKey } from '../../types';
import { useStore } from '../../store';
import Badge from '../shared/Badge';
import StatBar from './StatBar';
import styles from './NutrientGuide.module.css';

interface NutrientDetailProps {
  profile: NutrientProfile;
  onBack: () => void;
}

export default function NutrientDetail({ profile, onBack }: NutrientDetailProps) {
  const meta = NUTRIENT_MAP.get(profile.key);
  const label = meta?.label ?? profile.key;
  const fruits = useStore((s) => s.fruits);

  const sortedStats = (Object.entries(profile.stats) as [BodySystem, number][])
    .sort((a, b) => b[1] - a[1]);

  const topSources = useMemo(() => {
    const key = profile.key as NutrientKey;
    return fruits
      .filter((f) => f[key] !== null && f[key] !== undefined)
      .sort((a, b) => (b[key] as number) - (a[key] as number))
      .slice(0, 5);
  }, [fruits, profile.key]);

  const dailyValueText = meta?.dailyValue != null
    ? `${meta.dailyValue} ${meta.unit} / day`
    : null;

  return (
    <div className={styles.detail}>
      <button type="button" className={styles.backButton} onClick={onBack}>
        <ArrowLeft size={16} weight="bold" />
        <span>All Nutrients</span>
      </button>

      <div className={styles.detailHeader}>
        <h2 className={styles.detailName} style={{ color: profile.color }}>{label}</h2>
        {dailyValueText && (
          <span className={styles.detailDv}>Daily Value: {dailyValueText}</span>
        )}
      </div>

      <section className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Body Systems</h3>
        <div className={styles.detailStats}>
          {sortedStats.map(([system, value]) => (
            <div key={system} className={styles.detailStatRow}>
              <span className={styles.detailStatLabel}>{system}</span>
              <StatBar value={value} color={profile.color} />
              <span className={styles.detailStatValue}>{value} / 5</span>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Overview</h3>
        <p className={styles.detailDescription}>{profile.description}</p>
      </section>

      <section className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Top Sources</h3>
        <div className={styles.topSources}>
          {topSources.map((item) => (
            <div key={item.name} className={styles.sourceRow}>
              <span className={styles.sourceName}>{item.name}</span>
              <Badge category={item.category} />
              <span className={styles.sourceValue}>
                {formatNutrientWithUnit(item[profile.key] as number | null, profile.key)}
              </span>
            </div>
          ))}
          {topSources.length === 0 && (
            <span className={styles.noData}>No data available</span>
          )}
        </div>
      </section>
    </div>
  );
}
