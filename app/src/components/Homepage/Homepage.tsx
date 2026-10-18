import { ArrowRight, ChartBar, Scales, Table } from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { ViewId } from '../../types';
import styles from './Homepage.module.css';

const MORE_TOOLS: { id: ViewId; label: string }[] = [
  { id: 'fixdiet', label: 'Get food suggestions' },
  { id: 'categories', label: 'Food categories' },
  { id: 'nutrientratio', label: 'Nutrient ratios' },
  { id: 'nutrients', label: 'Nutrient guide' },
  { id: 'absorption', label: 'Nutrient interactions' },
  { id: 'dietary', label: 'Dietary preferences' },
  { id: 'research', label: 'Research' },
  { id: 'fastfood', label: 'Restaurant foods' },
  { id: 'higherlower', label: 'Food score game' },
];

export default function Homepage() {
  const setActiveView = useStore((state) => state.setActiveView);
  const auditEntries = useStore((state) => state.currentDietAuditEntries);
  const savedAudits = useStore((state) => state.savedDietAudits);
  const planEntries = useStore((state) => state.planEntries);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Review your usual week</h1>
        <p>Check estimated nutrient gaps in the foods you eat.</p>
        <button type="button" className={styles.primaryButton} onClick={() => setActiveView('audit')}>
          {auditEntries.length > 0 ? 'Continue review' : 'Start review'}
          <ArrowRight size={16} weight="regular" />
        </button>
      </header>

      {(auditEntries.length > 0 || savedAudits.length > 0 || planEntries.length > 0) && (
        <section className={styles.currentWork} aria-label="Your work">
          <h2>Your work</h2>
          {auditEntries.length > 0 && <p>{auditEntries.length} {auditEntries.length === 1 ? 'food' : 'foods'} in your current review</p>}
          {savedAudits.length > 0 && <p>{savedAudits.length} saved {savedAudits.length === 1 ? 'review' : 'reviews'}</p>}
          {planEntries.length > 0 && (
            <button type="button" onClick={() => setActiveView('planner')}>
              Continue plan with {planEntries.length} {planEntries.length === 1 ? 'food' : 'foods'}
              <ArrowRight size={14} weight="regular" />
            </button>
          )}
        </section>
      )}

      <section className={styles.nextTasks} aria-label="Other main tasks" data-ui-actions>
        <button type="button" className={styles.task} onClick={() => setActiveView('planner')}>
          <Scales size={18} weight="regular" />
          <span><strong>Plan a week</strong></span>
          <ArrowRight size={15} weight="regular" />
        </button>
        <button type="button" className={styles.task} onClick={() => setActiveView('table')}>
          <Table size={18} weight="regular" />
          <span><strong>Explore foods</strong></span>
          <ArrowRight size={15} weight="regular" />
        </button>
        <button type="button" className={styles.task} onClick={() => setActiveView('comparison')}>
          <ChartBar size={18} weight="regular" />
          <span><strong>Compare foods</strong></span>
          <ArrowRight size={15} weight="regular" />
        </button>
      </section>

      <details className={styles.moreTools}>
        <summary>More tools</summary>
        <div className={styles.toolGrid} data-ui-actions>
          {MORE_TOOLS.map((tool) => (
            <button key={tool.id} type="button" onClick={() => setActiveView(tool.id)}>
              <span><strong>{tool.label}</strong></span>
              <ArrowRight size={14} weight="regular" />
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
