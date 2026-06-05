import { useState } from 'react';
import { Table, GitDiff, SquaresFour, Pill, ArrowsClockwise, Scales, SlidersHorizontal, GearSix, SidebarSimple, Heartbeat, GithubLogo, Article, Hamburger, DotsThree, ClipboardText, ChartBar } from '@phosphor-icons/react';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useStore } from '../../store';
import type { ViewId } from '../../types';
import { countExcluded } from '../../utils/dietary';
import NavItem from './NavItem';
import styles from './Sidebar.module.css';

type NavItem = { id: ViewId; label: string; icon: React.ReactNode };

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: 'Create',
    items: [
      { id: 'fixdiet', label: 'Fix My Diet', icon: <Heartbeat size={18} weight="regular" /> },
      { id: 'audit', label: 'Diet Audit', icon: <ClipboardText size={18} weight="regular" /> },
      { id: 'planner', label: 'Planner', icon: <Scales size={18} weight="regular" /> },
    ],
  },
  {
    label: 'Learn',
    items: [
      { id: 'table', label: 'Explorer', icon: <Table size={18} weight="regular" /> },
      { id: 'comparison', label: 'Compare', icon: <GitDiff size={18} weight="regular" /> },
      { id: 'categories', label: 'Categories', icon: <SquaresFour size={18} weight="regular" /> },
      { id: 'nutrientratio', label: 'Nutrient Ratio', icon: <ChartBar size={18} weight="regular" /> },
      { id: 'nutrients', label: 'Nutrients', icon: <Pill size={18} weight="regular" /> },
      { id: 'absorption', label: 'Absorption', icon: <ArrowsClockwise size={18} weight="regular" /> },
      { id: 'dietary', label: 'Diet', icon: <SlidersHorizontal size={18} weight="regular" /> },
      { id: 'research', label: 'Research', icon: <Article size={18} weight="regular" /> },
      { id: 'fastfood', label: 'Fast Food', icon: <Hamburger size={18} weight="regular" /> },
    ],
  },
  {
    label: '',
    items: [
      { id: 'settings', label: 'Settings', icon: <GearSix size={18} weight="regular" /> },
    ],
  },
];

const MOBILE_PRIMARY_IDS: ViewId[] = ['fixdiet', 'audit', 'table', 'fastfood'];
const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap(s => s.items);
const MOBILE_PRIMARY = MOBILE_PRIMARY_IDS.map(id => ALL_NAV_ITEMS.find(item => item.id === id)!);
const MOBILE_SECONDARY = ALL_NAV_ITEMS.filter(item => !MOBILE_PRIMARY_IDS.includes(item.id));

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
  const isSecondaryActive = MOBILE_SECONDARY.some(item => item.id === activeView);

  return (
    <>
    <aside className={`${styles.sidebar} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
      <div className={styles.logo}>
        <button
          type="button"
          className={styles.logoText}
          onClick={() => setActiveView('home')}
        >
          Nutritionmaxx
        </button>
        <div className={styles.logoActions}>
          <a
            href="https://github.com/gholtzap/nutrition-db"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.collapseButton}
            aria-label="View source on GitHub"
          >
            <GithubLogo size={16} weight="regular" />
          </a>
          <button
            type="button"
            className={styles.collapseButton}
            onClick={toggleSidebar}
            aria-label="Collapse sidebar"
          >
            <SidebarSimple size={16} weight="regular" />
          </button>
        </div>
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
        {NAV_SECTIONS.map((section) => (
          <div key={section.label || 'ungrouped'} className={styles.navSection}>
            {section.label && <span className={styles.navSectionLabel}>{section.label}</span>}
            {section.items.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeView === item.id}
                onClick={() => setActiveView(item.id)}
              />
            ))}
          </div>
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
      <div className={styles.mobileNav}>
        {MOBILE_PRIMARY.map(item => (
          <button
            key={item.id}
            className={`${styles.mobileNavItem} ${activeView === item.id ? styles.mobileNavItemActive : ''}`}
            onClick={() => { setActiveView(item.id); setMoreOpen(false); }}
            type="button"
          >
            <span className={styles.mobileNavIcon}>{item.icon}</span>
            <span className={styles.mobileNavLabel}>{item.label}</span>
          </button>
        ))}
        <button
          className={`${styles.mobileNavItem} ${moreOpen || isSecondaryActive ? styles.mobileNavItemActive : ''}`}
          onClick={() => setMoreOpen(!moreOpen)}
          type="button"
        >
          <span className={styles.mobileNavIcon}><DotsThree size={18} weight="bold" /></span>
          <span className={styles.mobileNavLabel}>More</span>
        </button>
      </div>
    </aside>
    {moreOpen && (
      <div className={styles.moreOverlay} onClick={() => setMoreOpen(false)}>
        <div className={styles.moreSheet} onClick={e => e.stopPropagation()}>
          {MOBILE_SECONDARY.map(item => (
            <button
              key={item.id}
              className={`${styles.moreSheetItem} ${activeView === item.id ? styles.moreSheetItemActive : ''}`}
              onClick={() => { setActiveView(item.id); setMoreOpen(false); }}
              type="button"
            >
              <span className={styles.moreSheetIcon}>{item.icon}</span>
              <span className={styles.moreSheetLabel}>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    )}
    </>
  );
}
