import type { NutrientKey, PersonalizationSettings, PlanEntry, SavedDietAudit, HistamineSensitivity } from '../types.js';
import { DEFAULT_PREFERENCES } from './dietary.js';
import type { DietaryPreferences } from './dietary.js';
import type { UserProfile } from './daily-values.js';
import { NUTRIENT_META, DEFAULT_VISIBLE_COLUMNS } from './nutrition-meta.js';
import { DEFAULT_SCORE_NUTRIENTS } from './score-defaults.js';
import { DEFAULT_PERSONALIZATION } from './personalized-score.js';

export interface Preferences {
  dietaryPreferences: DietaryPreferences;
  blockedFoods: string[];
  userProfile: UserProfile | null;
  customDailyValues: Partial<Record<NutrientKey, number>>;
  budgetTolerance: number;
  lockedNutrients: NutrientKey[];
  scoreNutrients: NutrientKey[];
  visibleColumns: NutrientKey[];
  showDailyValue: boolean;
  showPerServing: boolean;
  personalization: PersonalizationSettings;
  histamineSensitivity: HistamineSensitivity;
  currentDietAuditEntries: PlanEntry[];
  savedDietAudits: SavedDietAudit[];
  planEntries: PlanEntry[];
  lockedPlanEntries: string[];
}

export function defaultPreferences(): Preferences {
  return {
    dietaryPreferences: { ...DEFAULT_PREFERENCES }, blockedFoods: [], userProfile: null,
    customDailyValues: {}, budgetTolerance: 10, lockedNutrients: [],
    scoreNutrients: [...DEFAULT_SCORE_NUTRIENTS], visibleColumns: [...DEFAULT_VISIBLE_COLUMNS],
    showDailyValue: true, showPerServing: true,
    personalization: { ...DEFAULT_PERSONALIZATION, healthGoals: [] }, histamineSensitivity: 'off',
    currentDietAuditEntries: [], savedDietAudits: [], planEntries: [], lockedPlanEntries: [],
  };
}

const nutrientKeys = new Set<string>(NUTRIENT_META.map((m) => m.key));
function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
function number(value: unknown, min: number, max: number): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}
function text(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= 200;
}
function list(value: unknown, check: (item: unknown) => boolean, limit = 602): value is unknown[] {
  return Array.isArray(value) && value.length <= limit && value.every(check);
}
function nutrients(value: unknown): boolean {
  return list(value, (key) => typeof key === 'string' && nutrientKeys.has(key), 29);
}
export function validPlanEntries(value: unknown): value is PlanEntry[] {
  return list(value, (e) => record(e) && text(e.name) && number(e.servingsPerWeek, 0.5, 1000))
    && new Set(value.map((e) => (e as PlanEntry).name)).size === value.length;
}

export function parsePreferences(value: unknown): Preferences {
  if (!record(value) || !record(value.dietaryPreferences) || !Array.isArray(value.blockedFoods)
    || !('userProfile' in value) || !record(value.customDailyValues)
    || !Array.isArray(value.lockedNutrients) || !Array.isArray(value.visibleColumns)
    || typeof value.showDailyValue !== 'boolean' || typeof value.showPerServing !== 'boolean') {
    throw new Error('Invalid saved data');
  }
  const prefs = { ...defaultPreferences(), ...value };
  const d = prefs.dietaryPreferences;
  const p = prefs.userProfile;
  const s = prefs.personalization;
  if (!record(d) || Object.keys(d).some((key) => !Object.hasOwn(DEFAULT_PREFERENCES, key))
    || Object.keys(DEFAULT_PREFERENCES).some((key) => typeof d[key as keyof DietaryPreferences] !== 'boolean')
    || !list(prefs.blockedFoods, text)
    || !(p === null || (record(p) && ['male', 'female'].includes(String(p.sex))
      && number(p.weight_kg, 1, 1000) && number(p.height_cm, 1, 300)
      && (p.age === null || number(p.age, 1, 120))))
    || !record(prefs.customDailyValues)
    || Object.entries(prefs.customDailyValues).some(([key, v]) => !nutrientKeys.has(key) || !number(v, 0.001, 1000000))
    || !number(prefs.budgetTolerance, 1, 10)
    || !nutrients(prefs.lockedNutrients) || !nutrients(prefs.scoreNutrients) || !nutrients(prefs.visibleColumns)
    || typeof prefs.showDailyValue !== 'boolean' || typeof prefs.showPerServing !== 'boolean'
    || !record(s) || !list(s.healthGoals, (v) => ['heart', 'bone', 'energy', 'immune', 'digestive'].includes(String(v)), 5)
    || !['sedentary', 'light', 'active', 'very_active'].includes(String(s.activityLevel))
    || !['default', 'pregnant', 'lactating', 'postmenopausal'].includes(String(s.lifeStage))
    || !['general', 'western', 'mediterranean', 'east_asian', 'south_asian', 'latin_american'].includes(String(s.dietaryPattern))
    || !['off', 'mild', 'moderate', 'strict'].includes(String(prefs.histamineSensitivity))
    || !validPlanEntries(prefs.currentDietAuditEntries) || !validPlanEntries(prefs.planEntries)
    || !list(prefs.lockedPlanEntries, text)
    || !list(prefs.savedDietAudits, (a) => record(a) && text(a.id) && text(a.name)
      && typeof a.createdAt === 'string' && Number.isFinite(Date.parse(a.createdAt))
      && validPlanEntries(a.baselineEntries) && validPlanEntries(a.fixedEntries)
      && nutrients(a.gapKeys) && number(a.confidence, 0, 100), 12)) {
    throw new Error('Invalid saved data');
  }
  return Object.fromEntries(Object.keys(defaultPreferences()).map((key) => [key, prefs[key as keyof Preferences]])) as unknown as Preferences;
}
