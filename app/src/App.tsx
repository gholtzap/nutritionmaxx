import { useEffect, useRef } from 'react';
import { List } from '@phosphor-icons/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useStore } from './store';
import type { ItemType, SortDirection, ViewId } from './types';
import { ALL_CATEGORIES } from './utils/nutrition-meta';
import { useIsMobile } from './utils/use-is-mobile';
import { usePreferencesSync } from './hooks/use-preferences-sync';
import Sidebar from './components/Sidebar/Sidebar';
import DataTable from './components/DataTable/DataTable';
import FruitDetail from './components/FruitDetail/FruitDetail';
import Comparison from './components/Comparison/Comparison';
import CategoryOverview from './components/CategoryOverview/CategoryOverview';
import NutrientGuide from './components/NutrientGuide/NutrientGuide';
import Absorption from './components/Absorption/Absorption';
import MealPlanner from './components/MealPlanner/MealPlanner';
import CurrentDietAudit from './components/CurrentDietAudit/CurrentDietAudit';
import DietaryPreferences from './components/DietaryPreferences/DietaryPreferences';
import FixMyDiet from './components/FixMyDiet/FixMyDiet';
import DailyValueSettings from './components/DailyValueSettings/DailyValueSettings';
import Research from './components/Research/Research';
import FastFoodMenus from './components/FastFoodMenus/FastFoodMenus';
import HigherLower from './components/HigherLower/HigherLower';
import Homepage from './components/Homepage/Homepage';
import NutrientRatio from './components/CategoryOverview/NutrientRatio';
import Spinner from './components/shared/Spinner';
import styles from './App.module.css';

const SHAREABLE_VIEWS: ViewId[] = [
  'home',
  'fixdiet',
  'audit',
  'table',
  'comparison',
  'categories',
  'nutrientratio',
  'nutrients',
  'absorption',
  'planner',
  'dietary',
  'research',
  'fastfood',
  'higherlower',
  'settings',
];

function isViewId(value: string | null): value is ViewId {
  return value !== null && SHAREABLE_VIEWS.includes(value as ViewId);
}

const ITEM_TYPES: ItemType[] = [
  'fruit',
  'vegetable',
  'spice',
  'nut_seed',
  'legume',
  'grain',
  'fish_seafood',
  'poultry',
  'beef',
  'pork',
  'fat_oil',
  'dairy',
  'egg',
  'lamb',
];

function isItemType(value: string | null): value is ItemType {
  return value !== null && ITEM_TYPES.includes(value as ItemType);
}

function isSortDirection(value: string | null): value is SortDirection {
  return value === 'asc' || value === 'desc';
}

function getPathView(pathname: string): ViewId | null {
  return pathname === '/play' ? 'higherlower' : null;
}

function App() {
  const fetchFruits = useStore((s) => s.fetchFruits);
  const activeView = useStore((s) => s.activeView);
  const loading = useStore((s) => s.loading);
  const error = useStore((s) => s.error);
  const selectedFruit = useStore((s) => s.selectedFruit);
  const showDailyValue = useStore((s) => s.showDailyValue);
  const toggleDailyValue = useStore((s) => s.toggleDailyValue);
  const sidebarCollapsed = useStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const isMobile = useIsMobile();
  usePreferencesSync();

  const fruits = useStore((s) => s.fruits);
  const setSelectedFruit = useStore((s) => s.setSelectedFruit);
  const comparisonFruits = useStore((s) => s.comparisonFruits);
  const setComparisonFruits = useStore((s) => s.setComparisonFruits);
  const setActiveView = useStore((s) => s.setActiveView);
  const searchQuery = useStore((s) => s.searchQuery);
  const setSearchQuery = useStore((s) => s.setSearchQuery);
  const selectedType = useStore((s) => s.selectedType);
  const setSelectedType = useStore((s) => s.setSelectedType);
  const selectedCategories = useStore((s) => s.selectedCategories);
  const setSelectedCategories = useStore((s) => s.setSelectedCategories);
  const sort = useStore((s) => s.sort);
  const setSort = useStore((s) => s.setSort);
  const planEntries = useStore((s) => s.planEntries);
  const setPlanEntries = useStore((s) => s.setPlanEntries);

  useEffect(() => {
    fetchFruits();
  }, [fetchFruits]);

  const urlInitialized = useRef(false);

  useEffect(() => {
    if (fruits.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    const pathView = getPathView(window.location.pathname);
    const requestedView: ViewId | null = pathView ?? (isViewId(viewParam) ? viewParam : null);

    if (requestedView === 'table') {
      const typeParam = params.get('type');
      setSearchQuery(params.get('q') ?? '');
      setSelectedType(isItemType(typeParam) ? typeParam : null);
      const categoryValues = (params.get('cats') ?? '')
        .split(',')
        .map((value) => value.trim())
        .filter((value): value is (typeof ALL_CATEGORIES)[number] => ALL_CATEGORIES.includes(value as (typeof ALL_CATEGORIES)[number]));
      setSelectedCategories(categoryValues);
      const sortKey = params.get('sort');
      const direction = params.get('dir');
      if (sortKey && isSortDirection(direction)) {
        setSort({ key: sortKey, direction });
      } else {
        setSort({ key: 'name', direction: 'asc' });
      }
    } else if (requestedView === 'categories') {
      const typeParam = params.get('type');
      setSelectedType(isItemType(typeParam) ? typeParam : null);
      setSelectedCategories([]);
      setSearchQuery('');
    }

    const ffParam = params.get('ff');
    if (ffParam) {
      setActiveView('fastfood');
      urlInitialized.current = true;
      return;
    }

    const researchParam = params.get('research');
    if (researchParam) {
      setActiveView('research');
      urlInitialized.current = true;
      return;
    }

    const planParam = params.get('plan');
    if (planParam) {
      const entries = planParam
        .split(',')
        .map((seg) => {
          const idx = seg.lastIndexOf(':');
          if (idx === -1) return null;
          const name = seg.slice(0, idx).trim();
          const spw = parseFloat(seg.slice(idx + 1));
          if (!name || isNaN(spw) || spw <= 0) return null;
          const match = fruits.find((f) => f.name.toLowerCase() === name.toLowerCase());
          if (!match) return null;
          return { name: match.name, servingsPerWeek: spw };
        })
        .filter((e): e is { name: string; servingsPerWeek: number } => e != null);
      if (entries.length > 0) {
        setPlanEntries(entries);
        setActiveView('planner');
      } else if (requestedView) {
        setActiveView(requestedView);
      }
    } else {
      const compareParam = params.get('compare');
      if (compareParam) {
        const names = compareParam.split(',').map((n) => n.trim()).filter(Boolean);
        const matched = names
          .map((n) => fruits.find((f) => f.name.toLowerCase() === n.toLowerCase()))
          .filter((f): f is typeof fruits[number] => f != null)
          .slice(0, 6);
        if (matched.length > 0) {
          setComparisonFruits(matched);
          setActiveView('comparison');
        } else if (requestedView) {
          setActiveView(requestedView);
        }
      } else {
        const foodParam = params.get('food');
        if (foodParam) {
          const match = fruits.find(
            (f) => f.name.toLowerCase() === foodParam.toLowerCase()
          );
          if (match) setSelectedFruit(match);
        }
        if (requestedView) {
          setActiveView(requestedView);
        }
      }
    }

    urlInitialized.current = true;
  }, [fruits, setSelectedFruit, setComparisonFruits, setActiveView, setPlanEntries, setSearchQuery, setSelectedType, setSelectedCategories, setSort]);

  useEffect(() => {
    if (!urlInitialized.current) return;
    const url = new URL(window.location.href);
    url.pathname = activeView === 'higherlower' ? '/play' : '/';
    if (activeView === 'home' || activeView === 'higherlower') {
      url.searchParams.delete('view');
    } else {
      url.searchParams.set('view', activeView);
    }
    url.searchParams.delete('research');
    url.searchParams.delete('ff');
    if (activeView === 'table') {
      if (searchQuery) {
        url.searchParams.set('q', searchQuery);
      } else {
        url.searchParams.delete('q');
      }
      if (selectedType) {
        url.searchParams.set('type', selectedType);
      } else {
        url.searchParams.delete('type');
      }
      if (selectedCategories.size > 0) {
        url.searchParams.set('cats', [...selectedCategories].join(','));
      } else {
        url.searchParams.delete('cats');
      }
      if (sort.key !== 'name' || sort.direction !== 'asc') {
        url.searchParams.set('sort', sort.key);
        url.searchParams.set('dir', sort.direction);
      } else {
        url.searchParams.delete('sort');
        url.searchParams.delete('dir');
      }
    } else if (activeView === 'categories') {
      if (selectedType) {
        url.searchParams.set('type', selectedType);
      } else {
        url.searchParams.delete('type');
      }
      url.searchParams.delete('q');
      url.searchParams.delete('cats');
      url.searchParams.delete('sort');
      url.searchParams.delete('dir');
    } else {
      url.searchParams.delete('q');
      url.searchParams.delete('type');
      url.searchParams.delete('cats');
      url.searchParams.delete('sort');
      url.searchParams.delete('dir');
    }
    if (activeView !== 'nutrientratio') {
      url.searchParams.delete('ratio_num');
      url.searchParams.delete('ratio_den');
      url.searchParams.delete('ratio_types');
      url.searchParams.delete('ratio_cats');
    }
    if (activeView === 'planner' && planEntries.length > 0) {
      url.searchParams.set(
        'plan',
        planEntries.map((e) => `${e.name}:${e.servingsPerWeek}`).join(',')
      );
      url.searchParams.delete('food');
      url.searchParams.delete('compare');
    } else if (activeView === 'comparison' && comparisonFruits.length > 0) {
      url.searchParams.set('compare', comparisonFruits.map((f) => f.name).join(','));
      url.searchParams.delete('food');
      url.searchParams.delete('plan');
    } else if (activeView === 'research') {
      url.searchParams.delete('food');
      url.searchParams.delete('compare');
      url.searchParams.delete('plan');
    } else if (activeView === 'fastfood') {
      url.searchParams.delete('food');
      url.searchParams.delete('compare');
      url.searchParams.delete('plan');
    } else if (selectedFruit) {
      url.searchParams.set('food', selectedFruit.name);
      url.searchParams.delete('compare');
      url.searchParams.delete('plan');
    } else {
      url.searchParams.delete('food');
      url.searchParams.delete('compare');
      url.searchParams.delete('plan');
    }
    window.history.replaceState(null, '', url.toString());
  }, [selectedFruit, comparisonFruits, activeView, planEntries, searchQuery, selectedType, selectedCategories, sort]);

  const contentClass = [
    styles.content,
    selectedFruit ? styles.contentWithDetail : '',
    sidebarCollapsed && !isMobile ? styles.contentCollapsed : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={styles.layout}>
      <Sidebar />
      {!isMobile && sidebarCollapsed && (
        <button
          type="button"
          className={styles.expandButton}
          onClick={toggleSidebar}
          aria-label="Expand sidebar"
        >
          <List size={18} weight="regular" />
        </button>
      )}
      {isMobile && (
        <header className={styles.mobileHeader}>
          <button
            type="button"
            className={styles.mobileTitle}
            onClick={() => setActiveView('home')}
          >
            Nutrition
          </button>
          <div className={styles.mobileHeaderRight}>
            <label className={styles.mobileDvToggle}>
              <input
                type="checkbox"
                checked={showDailyValue}
                onChange={toggleDailyValue}
                className={styles.mobileDvCheckbox}
              />
              <span className={styles.mobileDvLabel}>% DV</span>
            </label>
            <SignedOut>
              <SignInButton>
                <button type="button" className={styles.mobileSignIn}>Sign in</button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </div>
        </header>
      )}
      <main className={contentClass}>
        {loading && <Spinner />}
        {error && <div className={styles.status}>{error}</div>}
        {!loading && !error && (
          <>
            {activeView === 'home' && <Homepage />}
            {activeView === 'fixdiet' && <FixMyDiet />}
            {activeView === 'table' && <DataTable />}
            {activeView === 'comparison' && <Comparison />}
            {activeView === 'categories' && <CategoryOverview />}
            {activeView === 'nutrientratio' && <NutrientRatio standalone />}
            {activeView === 'nutrients' && <NutrientGuide />}
            {activeView === 'absorption' && <Absorption />}
            {activeView === 'planner' && <MealPlanner />}
            {activeView === 'audit' && <CurrentDietAudit />}
            {activeView === 'dietary' && <DietaryPreferences />}
            {activeView === 'research' && <Research />}
            {activeView === 'fastfood' && <FastFoodMenus />}
            {activeView === 'higherlower' && <HigherLower />}
            {activeView === 'settings' && <DailyValueSettings />}
          </>
        )}
      </main>
      <FruitDetail />
    </div>
  );
}

export default App;
