import { useMemo } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import type { NutrientProfile, BodySystem } from '../../utils/nutrient-profiles';
import { NUTRIENT_MAP } from '../../utils/nutrition-meta';
import { formatNutrientWithUnit, getItemDisplayValue } from '../../utils/format';
import { useEffectiveDailyValues } from '../../utils/use-effective-daily-values';
import type { NutrientKey } from '../../types';
import { useStore } from '../../store';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
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
  const fruits = useDietaryFruits();
  const showPerServing = useStore((s) => s.showPerServing);
  const dvMap = useEffectiveDailyValues();

  const sortedStats = (Object.entries(profile.stats) as [BodySystem, number][])
    .sort((a, b) => b[1] - a[1]);

  const topSources = useMemo(() => {
    const key = profile.key as NutrientKey;
    return fruits
      .filter((f) => f[key] !== null && f[key] !== undefined)
      .sort((a, b) => {
        const aVal = getItemDisplayValue(a, key, showPerServing) ?? 0;
        const bVal = getItemDisplayValue(b, key, showPerServing) ?? 0;
        return bVal - aVal;
      })
      .slice(0, 5);
  }, [fruits, profile.key, showPerServing]);

  const effectiveDV = dvMap.get(profile.key);
  const dailyValueText = effectiveDV != null && meta
    ? `${effectiveDV} ${meta.unit} / day`
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
        <h3 className={styles.sectionTitle}>Overview</h3>
        <p className={styles.detailDescription}>{profile.description}</p>
      </section>

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
        <h3 className={styles.sectionTitle}>
          Top Sources{showPerServing ? ' (per serving)' : ''}
        </h3>
        <div className={styles.topSources}>
          {topSources.map((item) => {
            const displayVal = getItemDisplayValue(item, profile.key, showPerServing);
            return (
              <div key={item.name} className={styles.sourceRow}>
                <span className={styles.sourceName}>{item.name}</span>
                <Badge category={item.category} />
                <span className={styles.sourceValue}>
                  {formatNutrientWithUnit(displayVal, profile.key)}
                </span>
              </div>
            );
          })}
          {topSources.length === 0 && (
            <span className={styles.noData}>No data available</span>
          )}
        </div>
      </section>

      {profile.sources.length > 0 && (
        <section className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>Sources</h3>
          <ol className={styles.referenceList}>
            {profile.sources.map((src, i) => (
              <li key={i} className={styles.referenceItem}>
                <a href={src.url} target="_blank" rel="noopener noreferrer" className={styles.referenceLink}>
                  {src.title}
                </a>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
