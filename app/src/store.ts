import { create } from 'zustand';
import type { NutrientFruit, NutrientKey, ItemCategory, SortConfig, ViewId, ItemType } from './types';
import { DEFAULT_VISIBLE_COLUMNS } from './utils/nutrition-meta';
import { loadFruits } from './utils/parse-csv';

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
  sidebarCollapsed: boolean;

  fetchFruits: () => Promise<void>;
  setActiveView: (view: ViewId) => void;
  setSearchQuery: (query: string) => void;
  setSelectedType: (type: ItemType | null) => void;
  toggleCategory: (category: ItemCategory) => void;
  setSort: (sort: SortConfig) => void;
  toggleColumn: (key: NutrientKey) => void;
  setColumnGroup: (keys: NutrientKey[], visible: boolean) => void;
  setSelectedFruit: (fruit: NutrientFruit | null) => void;
  toggleComparisonFruit: (fruit: NutrientFruit) => void;
  removeComparisonFruit: (name: string) => void;
  clearComparison: () => void;
  toggleDailyValue: () => void;
  toggleSidebar: () => void;
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
  sidebarCollapsed: false,

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

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
