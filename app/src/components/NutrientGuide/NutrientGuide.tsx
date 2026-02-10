import { useState } from 'react';
import { NUTRIENT_PROFILES } from '../../utils/nutrient-profiles';
import type { NutrientProfile } from '../../utils/nutrient-profiles';
import { VITAMIN_KEYS, MINERAL_KEYS } from '../../utils/nutrition-meta';
import NutrientCard from './NutrientCard';
import NutrientDetail from './NutrientDetail';
import styles from './NutrientGuide.module.css';

const vitaminKeySet = new Set(VITAMIN_KEYS);
const mineralKeySet = new Set(MINERAL_KEYS);

const VITAMIN_PROFILES = NUTRIENT_PROFILES.filter((p) => vitaminKeySet.has(p.key));
const MINERAL_PROFILES = NUTRIENT_PROFILES.filter((p) => mineralKeySet.has(p.key));

export default function NutrientGuide() {
  const [selected, setSelected] = useState<NutrientProfile | null>(null);

  if (selected) {
    return <NutrientDetail profile={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Nutrient Guide</h1>
        <p className={styles.subtitle}>Select a nutrient to explore its body system impact and top food sources</p>
      </div>

      <section>
        <h2 className={styles.groupTitle}>Vitamins</h2>
        <div className={styles.grid}>
          {VITAMIN_PROFILES.map((profile) => (
            <NutrientCard
              key={profile.key}
              profile={profile}
              onClick={() => setSelected(profile)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className={styles.groupTitle}>Minerals</h2>
        <div className={styles.grid}>
          {MINERAL_PROFILES.map((profile) => (
            <NutrientCard
              key={profile.key}
              profile={profile}
              onClick={() => setSelected(profile)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
