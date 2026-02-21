import { useEffect, useRef } from 'react';
import { List } from '@phosphor-icons/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useStore } from './store';
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
import DietaryPreferences from './components/DietaryPreferences/DietaryPreferences';
import FixMyDiet from './components/FixMyDiet/FixMyDiet';
import DailyValueSettings from './components/DailyValueSettings/DailyValueSettings';
import Spinner from './components/shared/Spinner';
import styles from './App.module.css';

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
  const planEntries = useStore((s) => s.planEntries);
  const setPlanEntries = useStore((s) => s.setPlanEntries);

  useEffect(() => {
    fetchFruits();
  }, [fetchFruits]);

  const urlInitialized = useRef(false);

  useEffect(() => {
    if (fruits.length === 0) return;
    const params = new URLSearchParams(window.location.search);

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
      }
    } else {
      const compareParam = params.get('compare');
      if (compareParam) {
        const names = compareParam.split(',').map((n) => n.trim()).filter(Boolean);
        const matched = names
          .map((n) => fruits.find((f) => f.name.toLowerCase() === n.toLowerCase()))
          .filter((f): f is typeof fruits[number] => f != null)
          .slice(0, 3);
        if (matched.length > 0) {
          setComparisonFruits(matched);
          setActiveView('comparison');
        }
      } else {
        const foodParam = params.get('food');
        if (foodParam) {
          const match = fruits.find(
            (f) => f.name.toLowerCase() === foodParam.toLowerCase()
          );
          if (match) setSelectedFruit(match);
        }
      }
    }

    urlInitialized.current = true;
  }, [fruits, setSelectedFruit, setComparisonFruits, setActiveView, setPlanEntries]);

  useEffect(() => {
    if (!urlInitialized.current) return;
    const url = new URL(window.location.href);
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
  }, [selectedFruit, comparisonFruits, activeView, planEntries]);

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
          <span className={styles.mobileTitle}>Nutrition</span>
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
            {activeView === 'fixdiet' && <FixMyDiet />}
            {activeView === 'table' && <DataTable />}
            {activeView === 'comparison' && <Comparison />}
            {activeView === 'categories' && <CategoryOverview />}
            {activeView === 'nutrients' && <NutrientGuide />}
            {activeView === 'absorption' && <Absorption />}
            {activeView === 'planner' && <MealPlanner />}
            {activeView === 'dietary' && <DietaryPreferences />}
            {activeView === 'settings' && <DailyValueSettings />}
          </>
        )}
      </main>
      <FruitDetail />
    </div>
  );
}

export default App;
