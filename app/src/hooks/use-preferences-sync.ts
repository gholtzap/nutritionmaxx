import { useEffect, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useStore } from '../store';
import {
  fetchPreferences,
  savePreferencesDebounced,
  deserializePreferences,
} from '../utils/preferences-sync';
import type { StorePreferenceFields } from '../utils/preferences-sync';

const SYNCED_KEYS: (keyof StorePreferenceFields)[] = [
  'dietaryPreferences',
  'blockedFoods',
  'userProfile',
  'customDailyValues',
  'budgetTolerance',
  'lockedNutrients',
  'visibleColumns',
  'showDailyValue',
  'showPerServing',
];

function pickPrefs(state: Record<string, unknown>): StorePreferenceFields {
  const picked: Partial<StorePreferenceFields> = {};
  for (const key of SYNCED_KEYS) {
    (picked as Record<string, unknown>)[key] = state[key];
  }
  return picked as StorePreferenceFields;
}

export function usePreferencesSync() {
  const { isSignedIn, getToken } = useAuth();
  const hasSynced = useRef(false);
  const skipNextSave = useRef(false);

  useEffect(() => {
    if (!isSignedIn) {
      hasSynced.current = false;
      return;
    }

    if (hasSynced.current) return;
    hasSynced.current = true;

    (async () => {
      const serverPrefs = await fetchPreferences(getToken);

      if (serverPrefs) {
        skipNextSave.current = true;
        const deserialized = deserializePreferences(serverPrefs);
        useStore.getState()._loadPreferences(deserialized);
      } else {
        const currentState = pickPrefs(
          useStore.getState() as unknown as Record<string, unknown>
        );
        savePreferencesDebounced(getToken, currentState);
      }
    })();
  }, [isSignedIn, getToken]);

  useEffect(() => {
    if (!isSignedIn) return;

    const unsub = useStore.subscribe((state, prevState) => {
      if (skipNextSave.current) {
        skipNextSave.current = false;
        return;
      }

      const curr = pickPrefs(state as unknown as Record<string, unknown>);
      const prev = pickPrefs(prevState as unknown as Record<string, unknown>);

      const changed = SYNCED_KEYS.some((key) => curr[key] !== prev[key]);
      if (!changed) return;

      savePreferencesDebounced(getToken, curr);
    });

    return unsub;
  }, [isSignedIn, getToken]);
}
