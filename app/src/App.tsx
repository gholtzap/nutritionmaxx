import { useEffect } from 'react';
import { useStore } from './store';
import Sidebar from './components/Sidebar/Sidebar';
import DataTable from './components/DataTable/DataTable';
import FruitDetail from './components/FruitDetail/FruitDetail';
import Comparison from './components/Comparison/Comparison';
import CategoryOverview from './components/CategoryOverview/CategoryOverview';
import Spinner from './components/shared/Spinner';
import styles from './App.module.css';

function App() {
  const fetchFruits = useStore((s) => s.fetchFruits);
  const activeView = useStore((s) => s.activeView);
  const loading = useStore((s) => s.loading);
  const error = useStore((s) => s.error);
  const selectedFruit = useStore((s) => s.selectedFruit);

  useEffect(() => {
    fetchFruits();
  }, [fetchFruits]);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={`${styles.content} ${selectedFruit ? styles.contentWithDetail : ''}`}>
        {loading && <Spinner />}
        {error && <div className={styles.status}>{error}</div>}
        {!loading && !error && (
          <>
            {activeView === 'table' && <DataTable />}
            {activeView === 'comparison' && <Comparison />}
            {activeView === 'categories' && <CategoryOverview />}
          </>
        )}
      </main>
      <FruitDetail />
    </div>
  );
}

export default App;
