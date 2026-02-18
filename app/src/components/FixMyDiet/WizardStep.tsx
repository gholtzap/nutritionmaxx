import styles from './FixMyDiet.module.css';

interface Option {
  value: string;
  label: string;
  description?: string;
}

interface WizardStepProps {
  title: string;
  subtitle?: string;
  options: Option[];
  selected: string | string[];
  multiSelect?: boolean;
  maxSelections?: number;
  optional?: boolean;
  onSelect: (value: string) => void;
}

export default function WizardStep({
  title,
  subtitle,
  options,
  selected,
  multiSelect = false,
  maxSelections,
  optional,
  onSelect,
}: WizardStepProps) {
  const selectedSet = new Set(Array.isArray(selected) ? selected : [selected]);

  return (
    <div className={styles.stepContent}>
      <h2 className={styles.stepTitle}>{title}</h2>
      {subtitle && <p className={styles.stepSubtitle}>{subtitle}</p>}
      {optional && <p className={styles.stepOptional}>Optional{maxSelections ? ` (max ${maxSelections})` : ''}</p>}
      <div className={styles.pillGrid}>
        {options.map((opt) => {
          const isSelected = selectedSet.has(opt.value);
          const atMax = multiSelect && maxSelections && !isSelected && selectedSet.size >= maxSelections;
          return (
            <button
              key={opt.value}
              type="button"
              className={`${styles.pill} ${isSelected ? styles.pillActive : ''}`}
              disabled={!!atMax}
              onClick={() => onSelect(opt.value)}
            >
              <span className={styles.pillLabel}>{opt.label}</span>
              {opt.description && <span className={styles.pillDesc}>{opt.description}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
