import type { NutrientKey } from '../types';
import { parsePreferences } from './preferences';
import type { Preferences } from './preferences';

export type StorePreferenceFields = Omit<Preferences, 'blockedFoods' | 'lockedNutrients' | 'scoreNutrients' | 'visibleColumns' | 'lockedPlanEntries'> & {
  blockedFoods: Set<string>;
  lockedNutrients: Set<NutrientKey>;
  scoreNutrients: Set<NutrientKey>;
  visibleColumns: Set<NutrientKey>;
  lockedPlanEntries: Set<string>;
};

export function serializePreferences(state: StorePreferenceFields): Preferences {
  return parsePreferences({
    ...state,
    blockedFoods: [...state.blockedFoods], lockedNutrients: [...state.lockedNutrients],
    scoreNutrients: [...state.scoreNutrients], visibleColumns: [...state.visibleColumns],
    lockedPlanEntries: [...state.lockedPlanEntries],
  });
}

export function deserializePreferences(value: unknown): StorePreferenceFields {
  const prefs = parsePreferences(value);
  return {
    ...prefs,
    blockedFoods: new Set(prefs.blockedFoods), lockedNutrients: new Set(prefs.lockedNutrients),
    scoreNutrients: new Set(prefs.scoreNutrients), visibleColumns: new Set(prefs.visibleColumns),
    lockedPlanEntries: new Set(prefs.lockedPlanEntries),
  };
}

export async function fetchPreferences(getToken: () => Promise<string | null>, signal?: AbortSignal): Promise<Preferences | null> {
  const token = await getToken();
  if (!token) throw new Error('Sign in again to load your data.');
  const res = await fetch('/api/preferences', { headers: { Authorization: `Bearer ${token}` }, signal });
  if (!res.ok) throw new Error('Cannot load your account data.');
  const data = await res.json();
  return data.preferences === null ? null : parsePreferences(data.preferences);
}

export async function savePreferences(getToken: () => Promise<string | null>, preferences: Preferences, signal?: AbortSignal) {
  const token = await getToken();
  if (!token) throw new Error('Sign in again to save your data.');
  const res = await fetch('/api/preferences', {
    method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ preferences }), signal,
  });
  if (!res.ok) throw new Error('Cannot save your account data.');
}
