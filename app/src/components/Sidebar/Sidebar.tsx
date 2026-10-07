import { useState } from 'react';
import { Table, GitDiff, SquaresFour, Pill, ArrowsClockwise, Scales, SlidersHorizontal, GearSix, SidebarSimple, Heartbeat, GithubLogo, Article, Hamburger, DotsThree, ClipboardText, ChartBar, GameController, House } from '@phosphor-icons/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useStore } from '../../store';
import type { ViewId } from '../../types';
import { countExcluded } from '../../utils/dietary';
import NavItem from './NavItem';
import styles from './Sidebar.module.css';

type NavigationItem = { id: ViewId; label: string; icon: React.ReactNode };

const PRIMARY_NAV: NavigationItem[] = [
  { id: 'home', label: 'Home', icon: <House size={18} weight="regular" /> },
  { id: 'audit', label: 'Review my week', icon: <ClipboardText size={18} weight="regular" /> },
  { id: 'planner', label: 'Weekly plan', icon: <Scales size={18} weight="regular" /> },
  { id: 'table', label: 'Explore foods', icon: <Table size={18} weight="regular" /> },
  { id: 'comparison', label: 'Compare foods', icon: <GitDiff size={18} weight="regular" /> },
];

const MORE_NAV: NavigationItem[] = [
  { id: 'fixdiet', label: 'Food suggestions', icon: <Heartbeat size={18} weight="regular" /> },
  { id: 'categories', label: 'Food categories', icon: <SquaresFour size={18} weight="regular" /> },
  { id: 'nutrientratio', label: 'Nutrient ratios', icon: <ChartBar size={18} weight="regular" /> },
  { id: 'nutrients', label: 'Nutrient guide', icon: <Pill size={18} weight="regular" /> },
  { id: 'absorption', label: 'Nutrient interactions', icon: <ArrowsClockwise size={18} weight="regular" /> },
  { id: 'dietary', label: 'Dietary preferences', icon: <SlidersHorizontal size={18} weight="regular" /> },
  { id: 'research', label: 'Research', icon: <Article size={18} weight="regular" /> },
  { id: 'fastfood', label: 'Restaurant foods', icon: <Hamburger size={18} weight="regular" /> },
  { id: 'higherlower', label: 'Higher or Lower', icon: <GameController size={18} weight="regular" /> },
  { id: 'settings', label: 'Settings', icon: <GearSix size={18} weight="regular" /> },
];

const MOBILE_PRIMARY = PRIMARY_NAV.filter((item) => item.id !== 'comparison');
const MOBILE_SECONDARY = [PRIMARY_NAV[4], ...MORE_NAV];

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
  const [moreOpen, setMoreOpen] = useState(false);
  const isSecondaryActive = MOBILE_SECONDARY.some((item) => item.id === activeView);

  return (
    <>
      <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.logo}>
          <button type="button" className={styles.logoText} onClick={() => setActiveView('home')}>Nutritionmaxx</button>
          <div className={styles.logoActions}>
            <a href="https://github.com/gholtzap/nutritionmaxx" target="_blank" rel="noopener noreferrer" className={styles.collapseButton} aria-label="View source on GitHub">
              <GithubLogo size={16} weight="regular" />
            </a>
            <button type="button" className={styles.collapseButton} onClick={toggleSidebar} aria-label="Collapse sidebar">
              <SidebarSimple size={16} weight="regular" />
            </button>
          </div>
        </div>
        <div className={styles.auth}>
          <SignedOut><SignInButton><button type="button" className={styles.signInButton}>Sign in</button></SignInButton></SignedOut>
          <SignedIn><UserButton /></SignedIn>
        </div>
        <nav className={styles.nav} aria-label="Main navigation">
          <div className={styles.navSection}>
            {PRIMARY_NAV.map((item) => (
              <NavItem key={item.id} icon={item.icon} label={item.label} active={activeView === item.id} onClick={() => setActiveView(item.id)} />
            ))}
          </div>
          <details className={styles.moreDetails} open={MORE_NAV.some((item) => item.id === activeView) || undefined}>
            <summary>More tools</summary>
            <div className={styles.navSection}>
              {MORE_NAV.map((item) => (
                <NavItem key={item.id} icon={item.icon} label={item.label} active={activeView === item.id} onClick={() => setActiveView(item.id)} />
              ))}
            </div>
          </details>
        </nav>
        <label className={styles.dvToggle}>
          <input type="checkbox" checked={showDailyValue} onChange={toggleDailyValue} className={styles.dvCheckbox} />
          <span className={styles.dvLabel}>Show % daily value</span>
        </label>
        <label className={styles.dvToggle}>
          <input type="checkbox" checked={showPerServing} onChange={togglePerServing} className={styles.dvCheckbox} />
          <span className={styles.dvLabel}>Per serving</span>
        </label>
        <div className={styles.footer}>
          <span className={styles.footerText}>{excluded > 0 ? `${fruits.length - excluded} of ${fruits.length} foods` : `${fruits.length} foods`}</span>
        </div>
        <nav className={styles.mobileNav} aria-label="Mobile navigation" data-ui-actions>
          {MOBILE_PRIMARY.map((item) => (
            <button key={item.id} className={`${styles.mobileNavItem} ${activeView === item.id ? styles.mobileNavItemActive : ''}`} onClick={() => { setActiveView(item.id); setMoreOpen(false); }} type="button" aria-current={activeView === item.id ? 'page' : undefined}>
              <span className={styles.mobileNavIcon}>{item.icon}</span>
              <span className={styles.mobileNavLabel}>{item.id === 'audit' ? 'Review' : item.id === 'planner' ? 'Plan' : item.id === 'table' ? 'Foods' : item.label}</span>
            </button>
          ))}
          <button className={`${styles.mobileNavItem} ${moreOpen || isSecondaryActive ? styles.mobileNavItemActive : ''}`} onClick={() => setMoreOpen(!moreOpen)} type="button" aria-expanded={moreOpen} aria-controls="mobile-more-tools">
            <span className={styles.mobileNavIcon}><DotsThree size={18} weight="regular" /></span>
            <span className={styles.mobileNavLabel}>More</span>
          </button>
        </nav>
      </aside>
      {moreOpen && (
        <div className={styles.moreOverlay}>
          <button type="button" className={styles.moreBackdrop} onClick={() => setMoreOpen(false)} aria-label="Close more tools" />
          <nav className={styles.moreSheet} id="mobile-more-tools" aria-label="More tools">
            {MOBILE_SECONDARY.map((item) => (
              <button key={item.id} className={`${styles.moreSheetItem} ${activeView === item.id ? styles.moreSheetItemActive : ''}`} onClick={() => { setActiveView(item.id); setMoreOpen(false); }} type="button" aria-current={activeView === item.id ? 'page' : undefined}>
                <span className={styles.moreSheetIcon}>{item.icon}</span>
                <span className={styles.moreSheetLabel}>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
