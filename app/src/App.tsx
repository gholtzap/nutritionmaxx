import { useEffect, useRef } from 'react';
import { List } from '@phosphor-icons/react';
import { useStore } from './store';
import { useIsMobile } from './utils/use-is-mobile';
import Sidebar from './components/Sidebar/Sidebar';
import DataTable from './components/DataTable/DataTable';
import FruitDetail from './components/FruitDetail/FruitDetail';
import Comparison from './components/Comparison/Comparison';
import CategoryOverview from './components/CategoryOverview/CategoryOverview';
import NutrientGuide from './components/NutrientGuide/NutrientGuide';
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

  const fruits = useStore((s) => s.fruits);
  const setSelectedFruit = useStore((s) => s.setSelectedFruit);

  useEffect(() => {
    fetchFruits();
  }, [fetchFruits]);

  const urlInitialized = useRef(false);

  useEffect(() => {
    if (fruits.length === 0) return;
    const params = new URLSearchParams(window.location.search);
    const foodParam = params.get('food');
    if (foodParam) {
      const match = fruits.find(
        (f) => f.name.toLowerCase() === foodParam.toLowerCase()
      );
      if (match) setSelectedFruit(match);
    }
    urlInitialized.current = true;
  }, [fruits, setSelectedFruit]);

  useEffect(() => {
    if (!urlInitialized.current) return;
    const url = new URL(window.location.href);
    if (selectedFruit) {
      url.searchParams.set('food', selectedFruit.name);
    } else {
      url.searchParams.delete('food');
    }
    window.history.replaceState(null, '', url.toString());
  }, [selectedFruit]);

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
          <label className={styles.mobileDvToggle}>
            <input
              type="checkbox"
              checked={showDailyValue}
              onChange={toggleDailyValue}
              className={styles.mobileDvCheckbox}
            />
            <span className={styles.mobileDvLabel}>% DV</span>
          </label>
        </header>
      )}
      <main className={contentClass}>
        {loading && <Spinner />}
        {error && <div className={styles.status}>{error}</div>}
        {!loading && !error && (
          <>
            {activeView === 'table' && <DataTable />}
            {activeView === 'comparison' && <Comparison />}
            {activeView === 'categories' && <CategoryOverview />}
            {activeView === 'nutrients' && <NutrientGuide />}
          </>
        )}
      </main>
      <FruitDetail />
    </div>
  );
}

export default App;
