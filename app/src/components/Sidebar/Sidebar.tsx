import { Table, GitDiff, SquaresFour } from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { ViewId } from '../../types';
import NavItem from './NavItem';
import styles from './Sidebar.module.css';

const NAV_ITEMS: { id: ViewId; label: string; icon: React.ReactNode }[] = [
  { id: 'table', label: 'Explorer', icon: <Table size={18} weight="regular" /> },
  { id: 'comparison', label: 'Compare', icon: <GitDiff size={18} weight="regular" /> },
  { id: 'categories', label: 'Categories', icon: <SquaresFour size={18} weight="regular" /> },
];

export default function Sidebar() {
  const activeView = useStore((s) => s.activeView);
  const setActiveView = useStore((s) => s.setActiveView);
  const showDailyValue = useStore((s) => s.showDailyValue);
  const toggleDailyValue = useStore((s) => s.toggleDailyValue);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Fruit Nutrition</span>
      </div>
      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeView === item.id}
            onClick={() => setActiveView(item.id)}
          />
        ))}
      </nav>
      <label className={styles.dvToggle}>
        <input
          type="checkbox"
          checked={showDailyValue}
          onChange={toggleDailyValue}
          className={styles.dvCheckbox}
        />
        <span className={styles.dvLabel}>Show % Daily Value</span>
      </label>
      <div className={styles.footer}>
        <span className={styles.footerText}>82 fruits / 29 nutrients</span>
      </div>
    </aside>
  );
}
