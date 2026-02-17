import type { NutrientKey } from '../types';
import type { DietaryPreferences } from './dietary';
import type { UserProfile } from './daily-values';

export interface SyncedPreferences {
  dietaryPreferences: DietaryPreferences;
  blockedFoods: string[];
  userProfile: UserProfile | null;
  customDailyValues: Partial<Record<NutrientKey, number>>;
  budgetTolerance: number;
  lockedNutrients: NutrientKey[];
  visibleColumns: NutrientKey[];
  showDailyValue: boolean;
  showPerServing: boolean;
}

export interface StorePreferenceFields {
  dietaryPreferences: DietaryPreferences;
  blockedFoods: Set<string>;
  userProfile: UserProfile | null;
  customDailyValues: Partial<Record<NutrientKey, number>>;
  budgetTolerance: number;
  lockedNutrients: Set<NutrientKey>;
  visibleColumns: Set<NutrientKey>;
  showDailyValue: boolean;
  showPerServing: boolean;
}

export function serializePreferences(state: StorePreferenceFields): SyncedPreferences {
  return {
    dietaryPreferences: state.dietaryPreferences,
    blockedFoods: [...state.blockedFoods],
    userProfile: state.userProfile,
    customDailyValues: state.customDailyValues,
    budgetTolerance: state.budgetTolerance,
    lockedNutrients: [...state.lockedNutrients] as NutrientKey[],
    visibleColumns: [...state.visibleColumns] as NutrientKey[],
    showDailyValue: state.showDailyValue,
    showPerServing: state.showPerServing,
  };
}

export function deserializePreferences(json: SyncedPreferences): StorePreferenceFields {
  return {
    dietaryPreferences: json.dietaryPreferences,
    blockedFoods: new Set(json.blockedFoods),
    userProfile: json.userProfile,
    customDailyValues: json.customDailyValues,
    budgetTolerance: json.budgetTolerance,
    lockedNutrients: new Set(json.lockedNutrients),
    visibleColumns: new Set(json.visibleColumns),
    showDailyValue: json.showDailyValue,
    showPerServing: json.showPerServing,
  };
}

export async function fetchPreferences(
  getToken: () => Promise<string | null>
): Promise<SyncedPreferences | null> {
  try {
    const token = await getToken();
    if (!token) return null;

    const res = await fetch('/api/preferences', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return null;
    const data = await res.json();
    return data.preferences ?? null;
  } catch {
    return null;
  }
}

let saveTimeout: ReturnType<typeof setTimeout> | null = null;

export function savePreferencesDebounced(
  getToken: () => Promise<string | null>,
  state: StorePreferenceFields
) {
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const body = serializePreferences(state);
      await fetch('/api/preferences', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ preferences: body }),
      });
    } catch {
      // API unavailable (e.g. local dev without vercel dev)
    }
  }, 1500);
}
