import { afterEach, describe, expect, it, vi } from 'vitest';
import { defaultPreferences, parsePreferences } from '../preferences';
import { deserializePreferences, serializePreferences, fetchPreferences, savePreferences } from '../preferences-sync';

afterEach(() => vi.unstubAllGlobals());

describe('account preferences', () => {
  it('preserves plans, locks, histamine settings and personalization', () => {
    const prefs = defaultPreferences();
    prefs.planEntries = [{ name: 'Chicken Breast', servingsPerWeek: 3.5 }];
    prefs.lockedPlanEntries = ['Chicken Breast'];
    prefs.histamineSensitivity = 'strict';
    prefs.personalization.healthGoals = ['bone'];
    expect(serializePreferences(deserializePreferences(prefs))).toEqual(prefs);
  });

  it('loads older accounts without losing existing reviews', () => {
    const prefs = defaultPreferences();
    const { planEntries, lockedPlanEntries, histamineSensitivity, ...older } = prefs;
    expect([planEntries, lockedPlanEntries, histamineSensitivity]).toEqual([[], [], 'off']);
    older.currentDietAuditEntries = [{ name: 'Rice', servingsPerWeek: 7 }];
    expect(parsePreferences(older).currentDietAuditEntries).toEqual(older.currentDietAuditEntries);
    expect(parsePreferences(older).planEntries).toEqual([]);
  });

  it.each([null, [], { budgetTolerance: 0 }, { planEntries: [{ name: 'Rice', servingsPerWeek: -1 }] },
    { planEntries: [{ name: 'Rice', servingsPerWeek: Infinity }] },
    { planEntries: [{ name: 'Rice', servingsPerWeek: 7 }, { name: 'Rice', servingsPerWeek: 1 }] },
    { customDailyValues: { protein_g: 0 } }, { dietaryPreferences: { unknown: true } },
    { personalization: { healthGoals: ['unknown'] } }, { savedDietAudits: [{}] },
  ])('rejects invalid saved values %j', (value) => {
    expect(() => parsePreferences(value === null || Array.isArray(value) ? value : { ...defaultPreferences(), ...value })).toThrow();
  });

  it('distinguishes an empty account from a failed load', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(Response.json({ preferences: null }))
      .mockResolvedValueOnce(new Response('', { status: 503 }));
    vi.stubGlobal('fetch', fetch);
    expect(await fetchPreferences(async () => 'token')).toBeNull();
    await expect(fetchPreferences(async () => 'token')).rejects.toThrow('Cannot load');
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('reports a rejected save', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('', { status: 503 })));
    await expect(savePreferences(async () => 'token', defaultPreferences())).rejects.toThrow('Cannot save');
  });
});
