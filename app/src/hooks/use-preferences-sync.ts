import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useStore } from '../store';
import { defaultPreferences, parsePreferences } from '../utils/preferences';
import { fetchPreferences, savePreferences, serializePreferences, deserializePreferences } from '../utils/preferences-sync';

const keys = Object.keys(defaultPreferences());

export function usePreferencesSync() {
  const { isLoaded, userId, getToken } = useAuth();
  const owner = userId ?? 'guest';
  const [attempt, setAttempt] = useState(0);
  const [sync, setSync] = useState({ owner: '', ready: false, status: 'Loading saved data…', error: false });

  useEffect(() => {
    const controller = new AbortController();
    let disposed = false;
    let unsubscribe: (() => void) | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let pending: ReturnType<typeof serializePreferences> | null = null;
    let saving = false;
    const storageKey = `nutritionmaxx:${owner}`;

    function status(message: string, error = false, ready = true) {
      if (!disposed) setSync({ owner, ready, status: message, error });
    }

    async function flush() {
      if (saving || disposed || !pending) return;
      const next = pending;
      pending = null;
      saving = true;
      try {
        await savePreferences(getToken, next, controller.signal);
        if (!pending && !disposed) {
          localStorage.removeItem(`${storageKey}:pending`);
          status('Saved to your account.');
        }
      } catch {
        if (!disposed) {
          pending = pending ?? next;
          status('Account save failed. Your changes are saved on this device.', true);
        }
      } finally {
        saving = false;
        if (pending && !disposed) timer = setTimeout(flush, 3000);
      }
    }

    async function load() {
      await Promise.resolve();
      status('Loading saved data…', false, false);
      try {
        if (!localStorage.getItem('nutritionmaxx:owner') && !localStorage.getItem('nutritionmaxx:guest')) {
          localStorage.setItem('nutritionmaxx:guest', JSON.stringify(serializePreferences(useStore.getState())));
        }
        useStore.getState()._loadPreferences(deserializePreferences(defaultPreferences()));
        localStorage.setItem('nutritionmaxx:owner', owner);
        const stored = localStorage.getItem(storageKey);
        const local = stored ? parsePreferences(JSON.parse(stored)) : defaultPreferences();
        const server = userId ? await fetchPreferences(getToken, controller.signal) : null;
        if (disposed) return;
        const hasPending = userId && localStorage.getItem(`${storageKey}:pending`) === 'true';
        const importGuest = userId && server === null && !stored && !localStorage.getItem('nutritionmaxx:guestImported');
        const guest = localStorage.getItem('nutritionmaxx:guest');
        const prefs = hasPending ? local : server ?? (importGuest && guest ? parsePreferences(JSON.parse(guest)) : local);
        useStore.getState()._loadPreferences(deserializePreferences(prefs));
        localStorage.setItem(storageKey, JSON.stringify(prefs));
        status(userId ? 'Saved to your account.' : 'Saved on this device.');
        if (hasPending || importGuest) {
          if (importGuest) localStorage.setItem('nutritionmaxx:guestImported', owner);
          localStorage.setItem(`${storageKey}:pending`, 'true');
          pending = prefs;
          status('Saving to your account…');
          void flush();
        }
        unsubscribe = useStore.subscribe((state, previous) => {
          if (!keys.some((key) => state[key as keyof typeof state] !== previous[key as keyof typeof previous])) return;
          try {
            const next = serializePreferences(state);
            localStorage.setItem(storageKey, JSON.stringify(next));
            if (userId) {
              pending = next;
              localStorage.setItem(`${storageKey}:pending`, 'true');
              status('Saving to your account…');
              clearTimeout(timer);
              timer = setTimeout(flush, 500);
            }
          } catch {
            status('Cannot save these changes on this device.', true);
          }
        });
      } catch {
        status('Cannot load saved data. Select Retry to load it again.', true, false);
      }
    }
    void load();
    return () => {
      disposed = true;
      controller.abort();
      clearTimeout(timer);
      unsubscribe?.();
    };
  }, [isLoaded, userId, owner, getToken, attempt]);

  return {
    ready: sync.owner === owner && sync.ready,
    status: sync.owner === owner ? sync.status : 'Loading saved data…',
    error: sync.owner === owner && sync.error,
    retry: () => setAttempt((value) => value + 1),
  };
}
