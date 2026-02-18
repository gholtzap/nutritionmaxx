import { useState, useCallback, useMemo, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Info } from '@phosphor-icons/react';
import { useStore } from '../../store';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import type {
  BiologicalSex,
  AgeRange,
  DietPattern,
  HealthFocus,
  PregnancyStatus,
  LifestyleFactor,
  Symptom,
  WizardAnswers,
} from '../../utils/deficiency-profile';
import WizardStep from './WizardStep';
import ResultsView from './ResultsView';
import styles from './FixMyDiet.module.css';

type StepId = 'sex' | 'age' | 'pregnancy' | 'diet' | 'lifestyle' | 'health' | 'symptoms';

const SEX_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
];

const AGE_OPTIONS = [
  { value: '19-30', label: '19-30' },
  { value: '31-50', label: '31-50' },
  { value: '51+', label: '51+' },
];

const PREGNANCY_OPTIONS = [
  { value: 'pregnant', label: 'Pregnant', description: 'Higher folate, iron, calcium needs' },
  { value: 'breastfeeding', label: 'Breastfeeding', description: 'Higher calcium, folate, vitamin A needs' },
];

const DIET_OPTIONS = [
  { value: 'omnivore', label: 'Omnivore', description: 'No restrictions' },
  { value: 'pescatarian', label: 'Pescatarian', description: 'Fish but no meat' },
  { value: 'vegetarian', label: 'Vegetarian', description: 'No meat or fish' },
  { value: 'vegan', label: 'Vegan', description: 'No animal products' },
];

const LIFESTYLE_OPTIONS = [
  { value: 'smoker', label: 'Smoker', description: 'Increases vitamin C, E, A needs' },
  { value: 'alcohol', label: 'Regular Alcohol', description: 'Increases B1, folate, magnesium needs' },
  { value: 'caffeine', label: 'Heavy Caffeine', description: 'Reduces iron, calcium absorption' },
];

const HEALTH_FOCUS_OPTIONS = [
  { value: 'heart', label: 'Heart Health', description: 'Potassium, magnesium, fiber' },
  { value: 'bone', label: 'Bone Strength', description: 'Calcium, vitamin K, magnesium' },
  { value: 'energy', label: 'Energy & Fatigue', description: 'Iron, B12, B6, magnesium' },
  { value: 'gut', label: 'Gut Health', description: 'Fiber, magnesium' },
  { value: 'immune', label: 'Immune Support', description: 'Vitamin C, zinc, selenium' },
];

const SYMPTOM_OPTIONS = [
  { value: 'fatigue', label: 'Fatigue', description: 'Iron, B12, B6, magnesium' },
  { value: 'cramps', label: 'Muscle Cramps', description: 'Magnesium, potassium, calcium' },
  { value: 'bruising', label: 'Easy Bruising', description: 'Vitamin C, vitamin K' },
  { value: 'colds', label: 'Frequent Colds', description: 'Vitamin C, zinc, vitamin A' },
];

function getSteps(sex: BiologicalSex | null, ageRange: AgeRange | null): StepId[] {
  const steps: StepId[] = ['sex', 'age'];
  if (sex === 'female' && (ageRange === '19-30' || ageRange === '31-50')) {
    steps.push('pregnancy');
  }
  steps.push('diet', 'lifestyle', 'health', 'symptoms');
  return steps;
}

export default function FixMyDiet() {
  const fruits = useDietaryFruits();
  const addPlanEntry = useStore((s) => s.addPlanEntry);
  const setActiveView = useStore((s) => s.setActiveView);

  const [step, setStep] = useState(0);
  const [sex, setSex] = useState<BiologicalSex | null>(null);
  const [ageRange, setAgeRange] = useState<AgeRange | null>(null);
  const [pregnancyStatus, setPregnancyStatus] = useState<PregnancyStatus | null>(null);
  const [dietPattern, setDietPattern] = useState<DietPattern | null>(null);
  const [lifestyleFactors, setLifestyleFactors] = useState<LifestyleFactor[]>([]);
  const [healthFocus, setHealthFocus] = useState<HealthFocus[]>([]);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [showResults, setShowResults] = useState(false);

  const steps = useMemo(() => getSteps(sex, ageRange), [sex, ageRange]);
  const currentStepId = steps[step];
  const totalSteps = steps.length;

  useEffect(() => {
    if (step >= steps.length) {
      setStep(steps.length - 1);
    }
  }, [steps.length, step]);

  useEffect(() => {
    if (!steps.includes('pregnancy')) {
      setPregnancyStatus(null);
    }
  }, [steps]);

  const canAdvance =
    currentStepId === 'sex' ? sex !== null :
    currentStepId === 'age' ? ageRange !== null :
    currentStepId === 'diet' ? dietPattern !== null :
    true;

  const handleNext = useCallback(() => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  }, [step, totalSteps]);

  const handleBack = useCallback(() => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  }, [step, showResults]);

  const handleMultiSelect = useCallback(
    <T extends string>(setter: React.Dispatch<React.SetStateAction<T[]>>) =>
      (value: string) => {
        setter((prev) => {
          if (prev.includes(value as T)) {
            return prev.filter((v) => v !== value);
          }
          return [...prev, value as T];
        });
      },
    []
  );

  const handleHealthFocusSelect = useMemo(() => handleMultiSelect(setHealthFocus), [handleMultiSelect]);
  const handleLifestyleSelect = useMemo(() => handleMultiSelect(setLifestyleFactors), [handleMultiSelect]);
  const handleSymptomSelect = useMemo(() => handleMultiSelect(setSymptoms), [handleMultiSelect]);

  const handleAddToPlan = useCallback((name: string) => {
    addPlanEntry(name);
    setActiveView('planner');
  }, [addPlanEntry, setActiveView]);

  const handleStartOver = useCallback(() => {
    setStep(0);
    setSex(null);
    setAgeRange(null);
    setPregnancyStatus(null);
    setDietPattern(null);
    setLifestyleFactors([]);
    setHealthFocus([]);
    setSymptoms([]);
    setShowResults(false);
  }, []);

  if (showResults && sex && ageRange && dietPattern) {
    const answers: WizardAnswers = {
      sex,
      ageRange,
      dietPattern,
      healthFocus,
      pregnancyStatus,
      lifestyleFactors,
      symptoms,
    };
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
        <div className={styles.progressFill} style={{ width: `${((step + 1) / totalSteps) * 100}%` }} />
      </div>
      <div className={styles.stepIndicator}>Step {step + 1} of {totalSteps}</div>

      {currentStepId === 'sex' && (
        <WizardStep
          title="Biological Sex"
          subtitle="Used to estimate iron and other nutrient needs"
          options={SEX_OPTIONS}
          selected={sex ?? ''}
          onSelect={(v) => setSex(v as BiologicalSex)}
        />
      )}

      {currentStepId === 'age' && (
        <WizardStep
          title="Age Range"
          subtitle="Nutrient needs change with age"
          options={AGE_OPTIONS}
          selected={ageRange ?? ''}
          onSelect={(v) => setAgeRange(v as AgeRange)}
        />
      )}

      {currentStepId === 'pregnancy' && (
        <WizardStep
          title="Pregnancy / Lactation"
          subtitle="Significantly changes nutrient priorities"
          options={PREGNANCY_OPTIONS}
          selected={pregnancyStatus ?? ''}
          optional
          onSelect={(v) => setPregnancyStatus(
            pregnancyStatus === (v as PregnancyStatus) ? null : v as PregnancyStatus
          )}
        />
      )}

      {currentStepId === 'diet' && (
        <WizardStep
          title="Dietary Pattern"
          subtitle="Helps identify likely nutrient gaps"
          options={DIET_OPTIONS}
          selected={dietPattern ?? ''}
          onSelect={(v) => setDietPattern(v as DietPattern)}
        />
      )}

      {currentStepId === 'lifestyle' && (
        <WizardStep
          title="Lifestyle Factors"
          subtitle="These can affect nutrient absorption and needs"
          options={LIFESTYLE_OPTIONS}
          selected={lifestyleFactors}
          multiSelect
          optional
          onSelect={handleLifestyleSelect}
        />
      )}

      {currentStepId === 'health' && (
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

      {currentStepId === 'symptoms' && (
        <WizardStep
          title="Common Symptoms"
          subtitle="Select any you experience regularly"
          options={SYMPTOM_OPTIONS}
          selected={symptoms}
          multiSelect
          maxSelections={3}
          optional
          onSelect={handleSymptomSelect}
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
          <span>{step === totalSteps - 1 ? 'See Results' : 'Next'}</span>
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
