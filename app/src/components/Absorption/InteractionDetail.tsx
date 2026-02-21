import { useMemo } from 'react';
import { ArrowLeft } from '@phosphor-icons/react';
import type { InteractionRule } from '../../utils/nutrient-interactions';
import { findSuggestedFoods } from '../../utils/nutrient-interactions';
import { NUTRIENT_MAP } from '../../utils/nutrition-meta';
import { formatNutrientWithUnit } from '../../utils/format';
import type { NutrientKey } from '../../types';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import { useStore } from '../../store';
import { getItemDisplayValue } from '../../utils/format';
import Badge from '../shared/Badge';
import styles from './Absorption.module.css';

const EMPTY_SET = new Set<string>();

function nutrientLabel(key: NutrientKey): string {
  return NUTRIENT_MAP.get(key)?.label ?? key;
}

interface InteractionDetailProps {
  rule: InteractionRule;
  onBack: () => void;
}

export default function InteractionDetail({ rule, onBack }: InteractionDetailProps) {
  const fruits = useDietaryFruits();
  const showPerServing = useStore((s) => s.showPerServing);
  const isEnhancer = rule.type === 'enhancer';

  const topSourcesByNutrient = useMemo(() => {
    const result: { key: NutrientKey; label: string; foods: ReturnType<typeof findSuggestedFoods> }[] = [];
    for (const key of rule.nutrients) {
      const foods = findSuggestedFoods(key, fruits, EMPTY_SET, 5);
      if (foods.length > 0) {
        result.push({ key, label: nutrientLabel(key), foods });
      }
    }
    return result;
  }, [rule.nutrients, fruits]);

  const typeStyle = isEnhancer
    ? styles.cardTypeEnhancer
    : rule.type === 'inhibitor'
      ? styles.cardTypeInhibitor
      : styles.cardTypeRequirement;

  return (
    <div className={styles.detail}>
      <button type="button" className={styles.backButton} onClick={onBack}>
        <ArrowLeft size={16} weight="bold" />
        <span>All Interactions</span>
      </button>

      <div className={styles.detailHeader}>
        <div className={styles.detailTitleRow}>
          <span className={`${styles.cardType} ${typeStyle}`}>{rule.type}</span>
          <div className={styles.detailNutrients}>
            {rule.nutrients.map((key) => (
              <span key={key} className={styles.nutrientTag}>{nutrientLabel(key)}</span>
            ))}
          </div>
        </div>
        <h2 className={styles.detailName}>{rule.message}</h2>
      </div>

      <section className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Overview</h3>
        <p className={styles.detailDescription}>{rule.description}</p>
      </section>

      <section className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Mechanism</h3>
        <p className={styles.detailDescription}>{rule.mechanism}</p>
      </section>

      <section className={styles.detailSection}>
        <h3 className={styles.sectionTitle}>Practical Tip</h3>
        <p className={styles.detailDescription}>{rule.tip}</p>
      </section>

      {topSourcesByNutrient.map(({ key, label, foods }) => (
        <section key={key} className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>
            Top Sources of {label}{showPerServing ? ' (per serving)' : ''}
          </h3>
          <div className={styles.topSources}>
            {foods.map((item) => {
              const displayVal = getItemDisplayValue(item, key, showPerServing);
              return (
                <div key={item.name} className={styles.sourceRow}>
                  <span className={styles.sourceName}>{item.name}</span>
                  <Badge category={item.category} />
                  <span className={styles.sourceValue}>
                    {formatNutrientWithUnit(displayVal, key)}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {rule.sources.length > 0 && (
        <section className={styles.detailSection}>
          <h3 className={styles.sectionTitle}>Sources</h3>
          <ol className={styles.referenceList}>
            {rule.sources.map((src, i) => (
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
