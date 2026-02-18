import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Info } from '@phosphor-icons/react';
import { useStore } from '../../store';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import type { BiologicalSex, AgeRange, DietPattern, HealthFocus, WizardAnswers } from '../../utils/deficiency-profile';
import WizardStep from './WizardStep';
import ResultsView from './ResultsView';
import styles from './FixMyDiet.module.css';

const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const AGE_OPTIONS = [
  { value: '19-30', label: '19-30' },
  { value: '31-50', label: '31-50' },
  { value: '51+', label: '51+' },
];

const DIET_OPTIONS = [
  { value: 'omnivore', label: 'Omnivore', description: 'No restrictions' },
  { value: 'pescatarian', label: 'Pescatarian', description: 'Fish but no meat' },
  { value: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
  { value: 'vegan', label: 'Vegan', description: 'No animal products' },
];

const HEALTH_FOCUS_OPTIONS = [
  { value: 'heart', label: 'Heart Health', description: 'Potassium, magnesium, fiber' },
  { value: 'bone', label: 'Bone Strength', description: 'Calcium, vitamin K, magnesium' },
  { value: 'energy', label: 'Energy & Fatigue', description: 'Iron, B12, B6, magnesium' },
  { value: 'gut', label: 'Gut Health', description: 'Fiber, magnesium' },
  { value: 'immune', label: 'Immune Support', description: 'Vitamin C, zinc, selenium' },
];

const TOTAL_STEPS = 4;

export default function FixMyDiet() {
  const fruits = useDietaryFruits();
  const addPlanEntry = useStore((s) => s.addPlanEntry);
  const setActiveView = useStore((s) => s.setActiveView);

  const [step, setStep] = useState(0);
  const [sex, setSex] = useState<BiologicalSex | null>(null);
  const [ageRange, setAgeRange] = useState<AgeRange | null>(null);
  const [dietPattern, setDietPattern] = useState<DietPattern | null>(null);
  const [healthFocus, setHealthFocus] = useState<HealthFocus[]>([]);
  const [showResults, setShowResults] = useState(false);

  const canAdvance =
    step === 0 ? sex !== null :
    step === 1 ? ageRange !== null :
    step === 2 ? dietPattern !== null :
    true;

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  }, [step]);

  const handleBack = useCallback(() => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  }, [step, showResults]);

  const handleHealthFocusSelect = useCallback((value: string) => {
    setHealthFocus((prev) => {
      if (prev.includes(value as HealthFocus)) {
        return prev.filter((v) => v !== value);
      }
      return [...prev, value as HealthFocus];
    });
  }, []);

  const handleAddToPlan = useCallback((name: string) => {
    addPlanEntry(name);
    setActiveView('planner');
  }, [addPlanEntry, setActiveView]);

  const handleStartOver = useCallback(() => {
    setStep(0);
    setSex(null);
    setAgeRange(null);
    setDietPattern(null);
    setHealthFocus([]);
    setShowResults(false);
  }, []);

  if (showResults && sex && ageRange && dietPattern) {
    const answers: WizardAnswers = { sex, ageRange, dietPattern, healthFocus };
    return (
      <div className={styles.container}>
        <ResultsView
          answers={answers}
          foods={fruits}
          onAddToPlan={handleAddToPlan}
          onStartOver={handleStartOver}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Fix My Diet</h1>
        <p className={styles.subtitle}>Answer a few questions to get personalized food recommendations</p>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} />
      </div>
      <div className={styles.stepIndicator}>Step {step + 1} of {TOTAL_STEPS}</div>

      {step === 0 && (
        <WizardStep
          title="Biological Sex"
          subtitle="Used to estimate iron and other nutrient needs"
          options={SEX_OPTIONS}
          selected={sex ?? ''}
          onSelect={(v) => setSex(v as BiologicalSex)}
        />
      )}

      {step === 1 && (
        <WizardStep
          title="Age Range"
          subtitle="Nutrient needs change with age"
          options={AGE_OPTIONS}
          selected={ageRange ?? ''}
          onSelect={(v) => setAgeRange(v as AgeRange)}
        />
      )}

      {step === 2 && (
        <WizardStep
          title="Dietary Pattern"
          subtitle="Helps identify likely nutrient gaps"
          options={DIET_OPTIONS}
          selected={dietPattern ?? ''}
          onSelect={(v) => setDietPattern(v as DietPattern)}
        />
      )}

      {step === 3 && (
        <WizardStep
          title="Health Focus"
          subtitle="What are you optimizing for?"
          options={HEALTH_FOCUS_OPTIONS}
          selected={healthFocus}
          multiSelect
          maxSelections={2}
          optional
          onSelect={handleHealthFocusSelect}
        />
      )}

      <div className={styles.navigation}>
        <button
          type="button"
          className={styles.navButton}
          onClick={handleBack}
          disabled={step === 0}
        >
          <ArrowLeft size={14} weight="bold" />
          <span>Back</span>
        </button>
        <button
          type="button"
          className={`${styles.navButton} ${styles.navButtonPrimary}`}
          onClick={handleNext}
          disabled={!canAdvance}
        >
          <span>{step === TOTAL_STEPS - 1 ? 'See Results' : 'Next'}</span>
          <ArrowRight size={14} weight="bold" />
        </button>
      </div>

      <span className={styles.infoWrapper}>
        <Info size={13} weight="fill" className={styles.infoIcon} />
        <span className={styles.infoLabel}>How do we store your data?</span>
        <span className={styles.infoTooltip}>
          We do not track your data. Once you submit an answer, your settings are updated in your user profile accordingly. You can update them at any time.
        </span>
      </span>
    </div>
  );
}
