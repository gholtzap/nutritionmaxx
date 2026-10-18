import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defaultPreferences } from '../preferences';
import { deserializePreferences } from '../preferences-sync';

const harness = vi.hoisted(() => ({
  userId: 'user-a', getToken: vi.fn(async () => 'token'),
  state: {} as Record<string, unknown>, cleanup: undefined as (() => void) | undefined,
  sync: {} as { ready?: boolean; status?: string; owner?: string },
  listeners: new Set<(state: Record<string, unknown>, previous: Record<string, unknown>) => void>(),
}));
vi.mock('react', () => ({
  useState: (initial: unknown) => [initial, (next: typeof harness.sync) => { harness.sync = next; }],
  useEffect: (effect: () => (() => void)) => { harness.cleanup = effect(); },
}));
vi.mock('@clerk/clerk-react', () => ({ useAuth: () => ({ isLoaded: true, userId: harness.userId, getToken: harness.getToken }) }));
vi.mock('../../store', () => ({ useStore: {
  getState: () => harness.state,
  subscribe: (listener: (state: Record<string, unknown>, previous: Record<string, unknown>) => void) => {
    harness.listeners.add(listener);
    return () => harness.listeners.delete(listener);
  },
} }));
import { usePreferencesSync } from '../../hooks/use-preferences-sync';

beforeEach(() => {
  vi.useFakeTimers();
  const data = new Map<string, string>();
  vi.stubGlobal('localStorage', { getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value), removeItem: (key: string) => data.delete(key) });
  localStorage.setItem('nutritionmaxx:guestImported', 'earlier-account');
  harness.userId = 'user-a';
  harness.sync = {};
  harness.listeners.clear();
  harness.state = { ...deserializePreferences(defaultPreferences()), _loadPreferences: (prefs: Record<string, unknown>) => { harness.state = { ...harness.state, ...prefs }; } };
});
afterEach(() => {
  harness.cleanup?.();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
async function settle() { for (let i = 0; i < 20; i++) await Promise.resolve(); }
function editPlan(name: string) {
  const previous = harness.state;
  harness.state = { ...harness.state, planEntries: [{ name, servingsPerWeek: 7 }] };
  harness.listeners.forEach((listener) => listener(harness.state, previous));
}

describe('account sync lifecycle', () => {
  it('imports a guest review only into the first empty account', async () => {
    localStorage.removeItem('nutritionmaxx:guestImported');
    const guest = defaultPreferences();
    guest.currentDietAuditEntries = [{ name: 'Rice', servingsPerWeek: 7 }];
    localStorage.setItem('nutritionmaxx:guest', JSON.stringify(guest));
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({ preferences: null }))
      .mockResolvedValueOnce(Response.json({ ok: true }))
      .mockResolvedValueOnce(Response.json({ preferences: null }));
    vi.stubGlobal('fetch', fetch);
    usePreferencesSync(); await settle();
    expect(harness.state.currentDietAuditEntries).toEqual(guest.currentDietAuditEntries);
    expect(fetch).toHaveBeenCalledTimes(2);
    harness.cleanup?.(); harness.userId = 'user-b';
    usePreferencesSync(); await settle();
    expect(harness.state.currentDietAuditEntries).toEqual([]);
    expect(fetch).toHaveBeenCalledTimes(3);
  });
  it('does not save after an unsuccessful load', async () => {
    const fetch = vi.fn().mockResolvedValue(new Response('', { status: 503 }));
    vi.stubGlobal('fetch', fetch);
    usePreferencesSync(); await settle();
    expect(harness.sync.ready).toBe(false);
    expect(harness.listeners.size).toBe(0);
    await vi.advanceTimersByTimeAsync(10000);
    expect(fetch).toHaveBeenCalledTimes(1);
  });
  it('loads a second account without the first account plan', async () => {
    const a = defaultPreferences(); a.planEntries = [{ name: 'Rice', servingsPerWeek: 7 }];
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(Response.json({ preferences: a }))
      .mockResolvedValueOnce(Response.json({ preferences: null })));
    usePreferencesSync(); await settle();
    expect(harness.state.planEntries).toEqual(a.planEntries);
    harness.cleanup?.(); harness.userId = 'user-b';
    usePreferencesSync(); await settle();
    expect(harness.state.planEntries).toEqual([]);
    expect(harness.sync.owner).toBe('user-b');
  });
  it('keeps a failed save locally and clears pending data only after success', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({ preferences: null }))
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(Response.json({ ok: true }));
    vi.stubGlobal('fetch', fetch);
    usePreferencesSync(); await settle(); editPlan('Rice');
    await vi.advanceTimersByTimeAsync(500);
    expect(localStorage.getItem('nutritionmaxx:user-a:pending')).toBe('true');
    expect(harness.sync.status).toContain('save failed');
    await vi.advanceTimersByTimeAsync(3000);
    expect(localStorage.getItem('nutritionmaxx:user-a:pending')).toBeNull();
    expect(harness.sync.status).toBe('Saved to your account.');
  });
  it('cancels a scheduled save when the account changes', async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ preferences: null }));
    vi.stubGlobal('fetch', fetch);
    usePreferencesSync(); await settle(); editPlan('Rice'); harness.cleanup?.();
    await vi.advanceTimersByTimeAsync(1000);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem('nutritionmaxx:user-a:pending')).toBe('true');
  });
});
