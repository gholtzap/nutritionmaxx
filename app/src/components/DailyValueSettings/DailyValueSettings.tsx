import { useState, useCallback } from 'react';
import { ArrowCounterClockwise } from '@phosphor-icons/react';
import { useStore } from '../../store';
import { NUTRIENT_META, MACRO_KEYS, VITAMIN_KEYS, MINERAL_KEYS, NUTRIENT_MAP } from '../../utils/nutrition-meta';
import { DEFAULT_DEFICIENCY_WEIGHTS } from '../../utils/score-defaults';
import type { NutrientKey } from '../../types';
import type { UserProfile } from '../../utils/daily-values';
import { computeProfileDailyValues } from '../../utils/daily-values';
import { useEffectiveDailyValues } from '../../utils/use-effective-daily-values';
import styles from './DailyValueSettings.module.css';

const NUTRIENT_MAP_LOCAL = new Map(NUTRIENT_META.map((m) => [m.key, m]));

interface ProfileFormState {
  sex: 'male' | 'female';
  weight: string;
  height: string;
  age: string;
}

function profileToForm(p: UserProfile | null): ProfileFormState {
  if (!p) return { sex: 'male', weight: '', height: '', age: '' };
  return {
    sex: p.sex,
    weight: String(p.weight_kg),
    height: String(p.height_cm),
    age: p.age !== null ? String(p.age) : '',
  };
}

function formToProfile(f: ProfileFormState): UserProfile | null {
  const w = parseFloat(f.weight);
  const h = parseFloat(f.height);
  if (!isFinite(w) || w <= 0 || !isFinite(h) || h <= 0) return null;
  const a = f.age ? parseFloat(f.age) : null;
  if (a !== null && (!isFinite(a) || a <= 0)) return null;
  return { sex: f.sex, weight_kg: w, height_cm: h, age: a };
}

type InputMode = 'percent' | 'precise';

interface DvGroupProps {
  title: string;
  keys: NutrientKey[];
  profileValues: Partial<Record<NutrientKey, number>>;
  overrides: Partial<Record<NutrientKey, number>>;
  dvMap: Map<NutrientKey, number | null>;
  onOverride: (key: NutrientKey, value: number | null) => void;
  inputMode: InputMode;
}

function getBaseDV(
  key: NutrientKey,
  profileValues: Partial<Record<NutrientKey, number>>
): number | null {
  const profileVal = profileValues[key];
  if (profileVal !== undefined) return profileVal;
  return NUTRIENT_MAP_LOCAL.get(key)?.dailyValue ?? null;
}

function toPercent(absolute: number, base: number): number {
  return Math.round((absolute / base) * 100);
}

function DvGroup({ title, keys, profileValues, overrides, dvMap, onOverride, inputMode }: DvGroupProps) {
  const filtered = keys.filter((k) => {
    const meta = NUTRIENT_MAP_LOCAL.get(k);
    return meta && meta.dailyValue !== null;
  });

  if (filtered.length === 0) return null;

  const isPct = inputMode === 'percent';

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {filtered.map((key) => {
        const meta = NUTRIENT_MAP_LOCAL.get(key)!;
        const baseDV = getBaseDV(key, profileValues);
        const effective = dvMap.get(key);
        const hasOverride = overrides[key] !== undefined;
        const isProfiled = !hasOverride && profileValues[key] !== undefined;

        let inputValue: string | number = '';
        let placeholder = '';
        let unit = meta.unit;
        let step: string | number = 'any';

        if (isPct) {
          inputValue = hasOverride && baseDV ? toPercent(overrides[key]!, baseDV) : '';
          placeholder = '100';
          unit = '%';
          step = 1;
        } else {
          inputValue = hasOverride ? overrides[key]! : '';
          placeholder = String(baseDV ?? '');
          step = 'any';
        }

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.value === '') {
            onOverride(key, null);
            return;
          }
          const val = parseFloat(e.target.value);
          if (!isFinite(val)) {
            onOverride(key, null);
            return;
          }
          if (isPct) {
            if (baseDV === null) return;
            onOverride(key, Math.round(baseDV * (val / 100) * 1000) / 1000);
          } else {
            onOverride(key, val);
          }
        };

        return (
          <div key={key} className={styles.dvRow}>
            <span className={styles.dvLabel}>{meta.label}</span>
            <span className={`${styles.dvEffective} ${isProfiled ? styles.dvProfiled : ''}`}>
              {effective != null ? `${effective} ${meta.unit}` : '--'}
            </span>
            <input
              type="number"
              className={styles.dvInput}
              placeholder={placeholder}
              value={inputValue}
              onChange={handleChange}
              min={0}
              step={step}
            />
            <span className={styles.dvUnit}>{unit}</span>
            {hasOverride ? (
              <button
                type="button"
                className={styles.dvResetButton}
                onClick={() => onOverride(key, null)}
                aria-label={`Reset ${meta.label}`}
              >
                <ArrowCounterClockwise size={14} />
              </button>
            ) : (
              <span className={styles.dvResetPlaceholder} />
            )}
          </div>
        );
      })}
    </div>
  );
}

interface ScoreGroupConfig {
  label: string;
  keys: NutrientKey[];
}

const SCORE_GROUPS: ScoreGroupConfig[] = [
  { label: 'Macros', keys: MACRO_KEYS.filter((k) => NUTRIENT_MAP.get(k)?.dailyValue !== null) },
  { label: 'Vitamins', keys: VITAMIN_KEYS },
  { label: 'Minerals', keys: MINERAL_KEYS },
];

function ScoreNutrientSection() {
  const scoreNutrients = useStore((s) => s.scoreNutrients);
  const toggleScoreNutrient = useStore((s) => s.toggleScoreNutrient);
  const setScoreNutrientGroup = useStore((s) => s.setScoreNutrientGroup);
  const resetScoreNutrients = useStore((s) => s.resetScoreNutrients);

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>Nutrient Density Score</h3>
      <p className={styles.scoreDescription}>
        Select which nutrients contribute to the density score. Each nutrient's %DV is capped at 100%
        to prevent single-nutrient dominance. Sodium and sugars are penalized rather than rewarded.
        Nutrients of public health concern (potassium, fiber, vitamin D, calcium, iron) receive extra
        weight. Items with fewer than 10 reported nutrients show "--" to avoid inflating sparse data.
      </p>
      {SCORE_GROUPS.map((group) => {
        const allSelected = group.keys.every((k) => scoreNutrients.has(k));
        const someSelected = group.keys.some((k) => scoreNutrients.has(k));
        return (
          <div key={group.label} className={styles.scoreGroup}>
            <label className={styles.scoreGroupHeader}>
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => {
                  if (el) el.indeterminate = someSelected && !allSelected;
                }}
                onChange={() => setScoreNutrientGroup(group.keys, !allSelected)}
              />
              <span>{group.label}</span>
            </label>
            {group.keys.map((key) => {
              const meta = NUTRIENT_MAP.get(key);
              const weight = DEFAULT_DEFICIENCY_WEIGHTS.get(key);
              return (
                <label key={key} className={styles.scoreItem}>
                  <input
                    type="checkbox"
                    checked={scoreNutrients.has(key)}
                    onChange={() => toggleScoreNutrient(key)}
                  />
                  <span>{meta?.label || key}</span>
                  {weight !== undefined && (
                    <span className={styles.weightBadge}>{weight}x</span>
                  )}
                </label>
              );
            })}
          </div>
        );
      })}
      <button type="button" className={styles.clearButton} onClick={resetScoreNutrients}>
        Reset to defaults
      </button>
    </div>
  );
}

export default function DailyValueSettings() {
  const userProfile = useStore((s) => s.userProfile);
  const setUserProfile = useStore((s) => s.setUserProfile);
  const clearUserProfile = useStore((s) => s.clearUserProfile);
  const customDailyValues = useStore((s) => s.customDailyValues);
  const setCustomDailyValue = useStore((s) => s.setCustomDailyValue);
  const clearCustomDailyValues = useStore((s) => s.clearCustomDailyValues);
  const dvMap = useEffectiveDailyValues();

  const [form, setForm] = useState<ProfileFormState>(() => profileToForm(userProfile));
  const [inputMode, setInputMode] = useState<InputMode>('percent');

  const profileValues = userProfile ? computeProfileDailyValues(userProfile) : {};

  const commitProfile = useCallback(
    (next: ProfileFormState) => {
      const p = formToProfile(next);
      setUserProfile(p);
    },
    [setUserProfile]
  );

  const updateField = useCallback(
    (field: keyof ProfileFormState, value: string) => {
      setForm((prev) => {
        const next = { ...prev, [field]: value };
        commitProfile(next);
        return next;
      });
    },
    [commitProfile]
  );

  const updateSex = useCallback(
    (sex: 'male' | 'female') => {
      setForm((prev) => {
        const next = { ...prev, sex };
        commitProfile(next);
        return next;
      });
    },
    [commitProfile]
  );

  const handleClearProfile = useCallback(() => {
    clearUserProfile();
    setForm({ sex: 'male', weight: '', height: '', age: '' });
  }, [clearUserProfile]);

  const handleClearAll = useCallback(() => {
    clearCustomDailyValues();
    handleClearProfile();
  }, [clearCustomDailyValues, handleClearProfile]);

  const hasProfile = userProfile !== null;
  const hasOverrides = Object.keys(customDailyValues).length > 0;
  const hasAnything = hasProfile || hasOverrides;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Daily Value Settings</h2>
        <p className={styles.subtitle}>
          {hasProfile
            ? 'Daily values adjusted for your profile'
            : 'Set your body profile to personalize daily values, or override individual nutrients'}
        </p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Body Profile</h3>
        <div className={styles.profileGrid}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>Sex</span>
            <div className={styles.sexToggle}>
              <button
                type="button"
                className={`${styles.sexButton} ${form.sex === 'male' ? styles.sexButtonActive : ''}`}
                onClick={() => updateSex('male')}
              >
                Male
              </button>
              <button
                type="button"
                className={`${styles.sexButton} ${form.sex === 'female' ? styles.sexButtonActive : ''}`}
                onClick={() => updateSex('female')}
              >
                Female
              </button>
            </div>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>
              Age <span className={styles.fieldUnit}>(optional)</span>
            </span>
            <input
              type="number"
              className={styles.fieldInput}
              placeholder="e.g. 30"
              value={form.age}
              onChange={(e) => updateField('age', e.target.value)}
              min={1}
              max={120}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>
              Weight <span className={styles.fieldUnit}>(kg)</span>
            </span>
            <input
              type="number"
              className={styles.fieldInput}
              placeholder="e.g. 70"
              value={form.weight}
              onChange={(e) => updateField('weight', e.target.value)}
              min={1}
              step="0.1"
            />
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>
              Height <span className={styles.fieldUnit}>(cm)</span>
            </span>
            <input
              type="number"
              className={styles.fieldInput}
              placeholder="e.g. 175"
              value={form.height}
              onChange={(e) => updateField('height', e.target.value)}
              min={1}
              step="0.1"
            />
          </div>
        </div>
        {hasProfile && (
          <button type="button" className={styles.clearButton} onClick={handleClearProfile}>
            Clear profile
          </button>
        )}
      </div>

      <div className={styles.modeRow}>
        <span className={styles.modeLabel}>Override using</span>
        <div className={styles.modeToggle}>
          <button
            type="button"
            className={`${styles.modeButton} ${inputMode === 'percent' ? styles.modeButtonActive : ''}`}
            onClick={() => setInputMode('percent')}
          >
            % DV
          </button>
          <button
            type="button"
            className={`${styles.modeButton} ${inputMode === 'precise' ? styles.modeButtonActive : ''}`}
            onClick={() => setInputMode('precise')}
          >
            Precise
          </button>
        </div>
      </div>

      <DvGroup
        title="Macronutrients"
        keys={MACRO_KEYS}
        profileValues={profileValues}
        overrides={customDailyValues}
        dvMap={dvMap}
        onOverride={setCustomDailyValue}
        inputMode={inputMode}
      />
      <DvGroup
        title="Vitamins"
        keys={VITAMIN_KEYS}
        profileValues={profileValues}
        overrides={customDailyValues}
        dvMap={dvMap}
        onOverride={setCustomDailyValue}
        inputMode={inputMode}
      />
      <DvGroup
        title="Minerals"
        keys={MINERAL_KEYS}
        profileValues={profileValues}
        overrides={customDailyValues}
        dvMap={dvMap}
        onOverride={setCustomDailyValue}
        inputMode={inputMode}
      />

      <ScoreNutrientSection />

      {hasAnything && (
        <div className={styles.actions}>
          {hasOverrides && (
            <button type="button" className={styles.clearButton} onClick={clearCustomDailyValues}>
              Reset all overrides
            </button>
          )}
          <button type="button" className={styles.clearButton} onClick={handleClearAll}>
            Reset everything
          </button>
        </div>
      )}
    </div>
  );
}
