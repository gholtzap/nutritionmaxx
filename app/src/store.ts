import { create } from 'zustand';
import type { NutrientFruit, NutrientKey, ItemCategory, SortConfig, ViewId, ItemType, PlanEntry } from './types';
import { DEFAULT_VISIBLE_COLUMNS } from './utils/nutrition-meta';
import { loadFruits } from './utils/parse-csv';
import type { DietaryPreference, DietaryPreferences } from './utils/dietary';
import { DEFAULT_PREFERENCES } from './utils/dietary';

interface AppState {
  fruits: NutrientFruit[];
  loading: boolean;
  error: string | null;

  activeView: ViewId;
  searchQuery: string;
  selectedType: ItemType | null;
  selectedCategories: Set<ItemCategory>;
  sort: SortConfig;
  visibleColumns: Set<NutrientKey>;
  selectedFruit: NutrientFruit | null;
  comparisonFruits: NutrientFruit[];
  showDailyValue: boolean;
  showPerServing: boolean;
  sidebarCollapsed: boolean;

  planEntries: PlanEntry[];
  lockedPlanEntries: Set<string>;

  dietaryPreferences: DietaryPreferences;
  toggleDietaryPreference: (key: DietaryPreference) => void;
  clearDietaryPreferences: () => void;

  fetchFruits: () => Promise<void>;
  setActiveView: (view: ViewId) => void;
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: ItemType | null) => void;
  toggleCategory: (category: ItemCategory) => void;
  setSort: (sort: SortConfig) => void;
  toggleColumn: (key: NutrientKey) => void;
  setColumnGroup: (keys: NutrientKey[], visible: boolean) => void;
  setSelectedFruit: (fruit: NutrientFruit | null) => void;
  setComparisonFruits: (fruits: NutrientFruit[]) => void;
  toggleComparisonFruit: (fruit: NutrientFruit) => void;
  removeComparisonFruit: (name: string) => void;
  clearComparison: () => void;
  toggleDailyValue: () => void;
  togglePerServing: () => void;
  toggleSidebar: () => void;

  addPlanEntry: (name: string) => void;
  removePlanEntry: (name: string) => void;
  setPlanEntryServings: (name: string, servingsPerWeek: number) => void;
  togglePlanEntryLock: (name: string) => void;
  clearPlan: () => void;
  setPlanEntries: (entries: PlanEntry[]) => void;
}

export const useStore = create<AppState>((set, get) => ({
  fruits: [],
  loading: false,
  error: null,

  activeView: 'table',
  searchQuery: '',
  selectedType: null,
  selectedCategories: new Set(),
  sort: { key: 'name', direction: 'asc' },
  visibleColumns: new Set(DEFAULT_VISIBLE_COLUMNS),
  selectedFruit: null,
  comparisonFruits: [],
  showDailyValue: true,
  showPerServing: true,
  sidebarCollapsed: false,

  planEntries: [],
  lockedPlanEntries: new Set(),

  dietaryPreferences: (() => {
    try {
      const stored = localStorage.getItem('dietaryPreferences');
      if (stored) return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    } catch {}
    return { ...DEFAULT_PREFERENCES };
  })(),

  toggleDietaryPreference: (key) =>
    set((state) => {
      const next = { ...state.dietaryPreferences, [key]: !state.dietaryPreferences[key] };
      localStorage.setItem('dietaryPreferences', JSON.stringify(next));
      return { dietaryPreferences: next };
    }),

  clearDietaryPreferences: () => {
    localStorage.removeItem('dietaryPreferences');
    set({ dietaryPreferences: { ...DEFAULT_PREFERENCES } });
  },

  fetchFruits: async () => {
    if (get().fruits.length > 0 || get().loading) return;
    set({ loading: true, error: null });
    try {
      const fruits = await loadFruits();
      set({ fruits, loading: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : 'Failed to load data',
        loading: false,
      });
    }
  },

  setActiveView: (view) => set({ activeView: view, selectedFruit: null }),

  setSearchQuery: (query) => set({ searchQuery: query }),

  setSelectedType: (type) => set({ selectedType: type, selectedCategories: new Set() }),

  toggleCategory: (category) =>
    set((state) => {
      const next = new Set(state.selectedCategories);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return { selectedCategories: next };
    }),

  setSort: (sort) => set({ sort }),

  toggleColumn: (key) =>
    set((state) => {
      const next = new Set(state.visibleColumns);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return { visibleColumns: next };
    }),

  setColumnGroup: (keys, visible) =>
    set((state) => {
      const next = new Set(state.visibleColumns);
      for (const k of keys) {
        if (visible) {
          next.add(k);
        } else {
          next.delete(k);
        }
      }
      return { visibleColumns: next };
    }),

  setSelectedFruit: (fruit) => set({ selectedFruit: fruit }),

  setComparisonFruits: (fruits) => set({ comparisonFruits: fruits }),

  toggleComparisonFruit: (fruit) =>
    set((state) => {
      const exists = state.comparisonFruits.some((f) => f.name === fruit.name);
      if (exists) {
        return {
          comparisonFruits: state.comparisonFruits.filter(
            (f) => f.name !== fruit.name
          ),
        };
      }
      if (state.comparisonFruits.length >= 3) return state;
      return { comparisonFruits: [...state.comparisonFruits, fruit] };
    }),

  removeComparisonFruit: (name) =>
    set((state) => ({
      comparisonFruits: state.comparisonFruits.filter((f) => f.name !== name),
    })),

  clearComparison: () => set({ comparisonFruits: [] }),

  toggleDailyValue: () =>
    set((state) => ({ showDailyValue: !state.showDailyValue })),

  togglePerServing: () =>
    set((state) => ({ showPerServing: !state.showPerServing })),

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  addPlanEntry: (name) =>
    set((state) => {
      if (state.planEntries.some((e) => e.name === name)) return state;
      return { planEntries: [...state.planEntries, { name, servingsPerWeek: 7 }] };
    }),

  removePlanEntry: (name) =>
    set((state) => {
      const nextLocked = new Set(state.lockedPlanEntries);
      nextLocked.delete(name);
      return {
        planEntries: state.planEntries.filter((e) => e.name !== name),
        lockedPlanEntries: nextLocked,
      };
    }),

  setPlanEntryServings: (name, servingsPerWeek) =>
    set((state) => ({
      planEntries: state.planEntries.map((e) =>
        e.name === name ? { ...e, servingsPerWeek } : e
      ),
    })),

  togglePlanEntryLock: (name) =>
    set((state) => {
      const next = new Set(state.lockedPlanEntries);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return { lockedPlanEntries: next };
    }),

  clearPlan: () => set({ planEntries: [], lockedPlanEntries: new Set() }),

  setPlanEntries: (entries) => set({ planEntries: entries }),
}));
