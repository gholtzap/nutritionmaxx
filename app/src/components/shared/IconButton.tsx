import { useId } from 'react';
import type { ComponentProps } from 'react';
import styles from './IconButton.module.css';

export default function IconButton({ children, className, ...props }: ComponentProps<'button'>) {
  const id = useId();
  const label = props['aria-label'];
  return (
    <button {...props} className={`${className ?? ''} ${label ? styles.button : ''}`} aria-describedby={label ? id : undefined}>
      {children}
      {label && <span id={id} role="tooltip" className={styles.tooltip}>{label}</span>}
    </button>
  );
}
