import { useState, useMemo } from 'react';
import { RULES, findSuggestedFoods } from '../../utils/nutrient-interactions';
import type { InteractionRule } from '../../utils/nutrient-interactions';
import { NUTRIENT_MAP } from '../../utils/nutrition-meta';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import InteractionDetail from './InteractionDetail';
import styles from './Absorption.module.css';

const ENHANCERS = RULES.filter((r) => r.type === 'enhancer');
const INHIBITORS = RULES.filter((r) => r.type === 'inhibitor' || r.type === 'requirement');

const EMPTY_SET = new Set<string>();

function nutrientLabel(key: string): string {
  return NUTRIENT_MAP.get(key as never)?.label ?? key;
}

function InteractionCard({ rule, topFoods, onClick }: { rule: InteractionRule; topFoods: string[]; onClick: () => void }) {
  const isEnhancer = rule.type === 'enhancer';
  const cardColor = isEnhancer ? styles.cardEnhancer : styles.cardWarning;
  const typeStyle = isEnhancer
    ? styles.cardTypeEnhancer
    : rule.type === 'inhibitor'
      ? styles.cardTypeInhibitor
      : styles.cardTypeRequirement;

  return (
    <button type="button" className={`${styles.card} ${cardColor}`} onClick={onClick}>
      <div className={styles.cardHeader}>
        <span className={`${styles.cardType} ${typeStyle}`}>{rule.type}</span>
      </div>
      <div className={styles.cardMessage}>{rule.message}</div>
      <div className={styles.cardNutrients}>
        {rule.nutrients.map((key) => (
          <span key={key} className={styles.nutrientTag}>{nutrientLabel(key)}</span>
        ))}
      </div>
      {topFoods.length > 0 && rule.suggestNutrient && (
        <div className={styles.topFoods}>
          <div className={styles.topFoodsLabel}>
            Top sources of {nutrientLabel(rule.suggestNutrient)}
          </div>
          <div className={styles.foodList}>
            {topFoods.map((name) => (
              <span key={name} className={styles.foodPill}>{name}</span>
            ))}
          </div>
        </div>
      )}
    </button>
  );
}

export default function Absorption() {
  const [selected, setSelected] = useState<InteractionRule | null>(null);
  const fruits = useDietaryFruits();

  const topFoodsMap = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const rule of RULES) {
      if (rule.suggestNutrient) {
        const foods = findSuggestedFoods(rule.suggestNutrient, fruits, EMPTY_SET, 5);
        map.set(rule.id, foods.map((f) => f.name));
      }
    }
    return map;
  }, [fruits]);

  if (selected) {
    return <InteractionDetail rule={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Absorption Interactions</h1>
        <p className={styles.subtitle}>
          How nutrients interact during absorption -- synergies to leverage and conflicts to watch
        </p>
      </div>

      <section>
        <h2 className={styles.groupTitle}>Enhancers</h2>
        <div className={styles.cards}>
          {ENHANCERS.map((rule) => (
            <InteractionCard
              key={rule.id}
              rule={rule}
              topFoods={topFoodsMap.get(rule.id) ?? []}
              onClick={() => setSelected(rule)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className={styles.groupTitle}>Inhibitors &amp; Requirements</h2>
        <div className={styles.cards}>
          {INHIBITORS.map((rule) => (
            <InteractionCard
              key={rule.id}
              rule={rule}
              topFoods={topFoodsMap.get(rule.id) ?? []}
              onClick={() => setSelected(rule)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
