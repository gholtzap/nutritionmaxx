import { type ReactNode } from 'react';
import styles from './Sidebar.module.css';

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
      onClick={onClick}
      type="button"
    >
      <span className={styles.navIcon}>{icon}</span>
      <span>{label}</span>
    </button>
  );
}
