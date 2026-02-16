import { Table, GitDiff, SquaresFour, Pill, Scales, SlidersHorizontal, GearSix, SidebarSimple } from '@phosphor-icons/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useStore } from '../../store';
import type { ViewId } from '../../types';
import { countExcluded } from '../../utils/dietary';
import NavItem from './NavItem';
import styles from './Sidebar.module.css';

const NAV_ITEMS: { id: ViewId; label: string; icon: React.ReactNode }[] = [
  { id: 'table', label: 'Explorer', icon: <Table size={18} weight="regular" /> },
  { id: 'comparison', label: 'Compare', icon: <GitDiff size={18} weight="regular" /> },
  { id: 'categories', label: 'Categories', icon: <SquaresFour size={18} weight="regular" /> },
  { id: 'nutrients', label: 'Nutrients', icon: <Pill size={18} weight="regular" /> },
  { id: 'planner', label: 'Planner', icon: <Scales size={18} weight="regular" /> },
  { id: 'dietary', label: 'Diet', icon: <SlidersHorizontal size={18} weight="regular" /> },
  { id: 'settings', label: 'Settings', icon: <GearSix size={18} weight="regular" /> },
];

export default function Sidebar() {
  const activeView = useStore((s) => s.activeView);
  const setActiveView = useStore((s) => s.setActiveView);
  const showDailyValue = useStore((s) => s.showDailyValue);
  const toggleDailyValue = useStore((s) => s.toggleDailyValue);
  const showPerServing = useStore((s) => s.showPerServing);
  const togglePerServing = useStore((s) => s.togglePerServing);
  const sidebarCollapsed = useStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const fruits = useStore((s) => s.fruits);
  const dietaryPreferences = useStore((s) => s.dietaryPreferences);
  const excluded = countExcluded(fruits, dietaryPreferences);

  return (
    <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.logo}>
        <span className={styles.logoText}>Nutrition</span>
        <button
          type="button"
          className={styles.collapseButton}
          onClick={toggleSidebar}
          aria-label="Collapse sidebar"
        >
          <SidebarSimple size={16} weight="regular" />
        </button>
      </div>
      <div className={styles.auth}>
        <SignedOut>
          <SignInButton>
            <button type="button" className={styles.signInButton}>Sign in</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
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
      <label className={styles.dvToggle}>
        <input
          type="checkbox"
          checked={showPerServing}
          onChange={togglePerServing}
          className={styles.dvCheckbox}
        />
        <span className={styles.dvLabel}>Per Serving</span>
      </label>
      <div className={styles.footer}>
        <span className={styles.footerText}>
          {excluded > 0
            ? `${fruits.length - excluded} / ${fruits.length} items`
            : `${fruits.length} items / 29 nutrients`}
        </span>
      </div>
    </aside>
  );
}
