import { ArrowCounterClockwise } from '@phosphor-icons/react';
import type { WizardAnswers } from '../../utils/deficiency-profile';
import {
  buildDeficiencyProfile,
  getTopDeficiencies,
  scoreFoodsForDeficiencies,
  shouldShowB12Note,
} from '../../utils/deficiency-profile';
import type { NutrientFruit } from '../../types';
import FoodCard from './FoodCard';
import styles from './FixMyDiet.module.css';

interface ResultsViewProps {
  answers: WizardAnswers;
  foods: NutrientFruit[];
  onAddToPlan: (name: string) => void;
  onStartOver: () => void;
}

export default function ResultsView({ answers, foods, onAddToPlan, onStartOver }: ResultsViewProps) {
  const profile = buildDeficiencyProfile(answers);
  const topDeficiencies = getTopDeficiencies(profile, 5);
  const recommendations = scoreFoodsForDeficiencies(foods, profile, 3);
  const showB12 = shouldShowB12Note(answers);

  return (
    <div className={styles.results}>
      <div className={styles.resultsHeader}>
        <div>
          <h2 className={styles.resultsTitle}>Your Recommendations</h2>
          <p className={styles.resultsSubtitle}>
            Based on your profile: {answers.sex}, {answers.ageRange}, {answers.dietPattern}
            {answers.pregnancyStatus && ` / ${answers.pregnancyStatus}`}
            {answers.healthFocus.length > 0 && ` / ${answers.healthFocus.join(', ')}`}
            {answers.lifestyleFactors.length > 0 && ` / ${answers.lifestyleFactors.join(', ')}`}
            {answers.symptoms.length > 0 && ` / ${answers.symptoms.join(', ')}`}
            {answers.familyHistory.length > 0 && ` / ${answers.familyHistory.join(', ')}`}
          </p>
        </div>
        <button type="button" className={styles.startOver} onClick={onStartOver}>
          <ArrowCounterClockwise size={14} weight="bold" />
          <span>Start Over</span>
        </button>
      </div>

      <div className={styles.deficiencySection}>
        <h3 className={styles.sectionLabel}>Key Nutrients to Focus On</h3>
        <div className={styles.deficiencyPills}>
          {topDeficiencies.map((d) => (
            <span key={d.key} className={styles.deficiencyPill}>
              {d.label}
            </span>
          ))}
        </div>
      </div>

      {showB12 && (
        <div className={styles.b12Note}>
          Vitamin B12 is not reliably available from plant foods. Consider a B12 supplement or fortified foods.
        </div>
      )}

      {recommendations.length > 0 ? (
        <div className={styles.foodCards}>
          <h3 className={styles.sectionLabel}>Recommended Foods</h3>
          {recommendations.map((r) => (
            <FoodCard key={r.food.name} item={r} onAddToPlan={onAddToPlan} />
          ))}
        </div>
      ) : (
        <div className={styles.noResults}>
          No strong recommendations found for your current food database and dietary preferences.
        </div>
      )}
    </div>
  );
}
