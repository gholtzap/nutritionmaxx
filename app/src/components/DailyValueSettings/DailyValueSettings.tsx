import { useState, useCallback } from 'react';
import { ArrowCounterClockwise } from '@phosphor-icons/react';
import { useStore } from '../../store';
import { NUTRIENT_META, MACRO_KEYS, VITAMIN_KEYS, MINERAL_KEYS } from '../../utils/nutrition-meta';
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

interface DvGroupProps {
  title: string;
  keys: NutrientKey[];
  profileValues: Partial<Record<NutrientKey, number>>;
  overrides: Partial<Record<NutrientKey, number>>;
  dvMap: Map<NutrientKey, number | null>;
  onOverride: (key: NutrientKey, value: number | null) => void;
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

function DvGroup({ title, keys, profileValues, overrides, dvMap, onOverride }: DvGroupProps) {
  const filtered = keys.filter((k) => {
    const meta = NUTRIENT_MAP_LOCAL.get(k);
    return meta && meta.dailyValue !== null;
  });

  if (filtered.length === 0) return null;

  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {filtered.map((key) => {
        const meta = NUTRIENT_MAP_LOCAL.get(key)!;
        const baseDV = getBaseDV(key, profileValues);
        const effective = dvMap.get(key);
        const hasOverride = overrides[key] !== undefined;
        const isProfiled = !hasOverride && profileValues[key] !== undefined;
        const pctDisplay = hasOverride && baseDV
          ? toPercent(overrides[key]!, baseDV)
          : '';

        return (
          <div key={key} className={styles.dvRow}>
            <span className={styles.dvLabel}>{meta.label}</span>
            <span className={`${styles.dvEffective} ${isProfiled ? styles.dvProfiled : ''}`}>
              {effective != null ? `${effective} ${meta.unit}` : '--'}
            </span>
            <input
              type="number"
              className={styles.dvInput}
              placeholder="100"
              value={pctDisplay}
              onChange={(e) => {
                if (e.target.value === '' || baseDV === null) {
                  onOverride(key, null);
                  return;
                }
                const pct = parseFloat(e.target.value);
                if (!isFinite(pct)) {
                  onOverride(key, null);
                  return;
                }
                const absolute = baseDV * (pct / 100);
                onOverride(key, Math.round(absolute * 1000) / 1000);
              }}
              min={0}
              step={1}
            />
            <span className={styles.dvUnit}>%</span>
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

export default function DailyValueSettings() {
  const userProfile = useStore((s) => s.userProfile);
  const setUserProfile = useStore((s) => s.setUserProfile);
  const clearUserProfile = useStore((s) => s.clearUserProfile);
  const customDailyValues = useStore((s) => s.customDailyValues);
  const setCustomDailyValue = useStore((s) => s.setCustomDailyValue);
  const clearCustomDailyValues = useStore((s) => s.clearCustomDailyValues);
  const dvMap = useEffectiveDailyValues();

  const [form, setForm] = useState<ProfileFormState>(() => profileToForm(userProfile));

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

      <DvGroup
        title="Macronutrients"
        keys={MACRO_KEYS}
        profileValues={profileValues}
        overrides={customDailyValues}
        dvMap={dvMap}
        onOverride={setCustomDailyValue}
      />
      <DvGroup
        title="Vitamins"
        keys={VITAMIN_KEYS}
        profileValues={profileValues}
        overrides={customDailyValues}
        dvMap={dvMap}
        onOverride={setCustomDailyValue}
      />
      <DvGroup
        title="Minerals"
        keys={MINERAL_KEYS}
        profileValues={profileValues}
        overrides={customDailyValues}
        dvMap={dvMap}
        onOverride={setCustomDailyValue}
      />

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
