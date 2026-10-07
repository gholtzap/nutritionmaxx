import { ArrowRight, ChartBar, Scales, Table } from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { ViewId } from '../../types';
import styles from './Homepage.module.css';

const MORE_TOOLS: { id: ViewId; label: string; description: string }[] = [
  { id: 'fixdiet', label: 'Get food suggestions', description: 'Answer questions about your diet.' },
  { id: 'categories', label: 'Food categories', description: 'Browse foods by category.' },
  { id: 'nutrientratio', label: 'Nutrient ratios', description: 'Compare two nutrients across foods.' },
  { id: 'nutrients', label: 'Nutrient guide', description: 'Read about nutrients and food sources.' },
  { id: 'absorption', label: 'Nutrient interactions', description: 'See how nutrients affect each other.' },
  { id: 'dietary', label: 'Dietary preferences', description: 'Set the foods you want to include.' },
  { id: 'research', label: 'Research', description: 'Read the research articles.' },
  { id: 'fastfood', label: 'Restaurant foods', description: 'Compare menu items.' },
  { id: 'higherlower', label: 'Higher or Lower', description: 'Play the food score game.' },
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
        <p>Enter the foods you eat in a week. See estimated nutrient gaps and try a useful change.</p>
      </header>

      <section className={styles.primaryTask} aria-labelledby="review-title">
        <div>
          <h2 id="review-title">Start with what you eat</h2>
          <p>Add foods and servings from a normal week. Your results update as you go.</p>
          <button type="button" className={styles.primaryButton} onClick={() => setActiveView('audit')}>
            {auditEntries.length > 0 ? 'Continue review' : 'Review my week'}
            <ArrowRight size={16} weight="regular" />
          </button>
        </div>
        {(auditEntries.length > 0 || savedAudits.length > 0 || planEntries.length > 0) && (
          <div className={styles.currentWork}>
            <h3>Your work</h3>
            {auditEntries.length > 0 && <p>{auditEntries.length} {auditEntries.length === 1 ? 'food' : 'foods'} in your current review</p>}
            {savedAudits.length > 0 && <p>{savedAudits.length} saved {savedAudits.length === 1 ? 'review' : 'reviews'}</p>}
            {planEntries.length > 0 && (
              <button type="button" onClick={() => setActiveView('planner')}>
                Continue plan with {planEntries.length} {planEntries.length === 1 ? 'food' : 'foods'}
                <ArrowRight size={14} weight="regular" />
              </button>
            )}
          </div>
        )}
      </section>

      <section className={styles.nextTasks} aria-label="Other main tasks" data-ui-actions>
        <button type="button" className={styles.task} onClick={() => setActiveView('planner')}>
          <Scales size={18} weight="regular" />
          <span><strong>Plan a week</strong><small>Choose foods and check nutrient targets.</small></span>
          <ArrowRight size={15} weight="regular" />
        </button>
        <button type="button" className={styles.task} onClick={() => setActiveView('table')}>
          <Table size={18} weight="regular" />
          <span><strong>Explore foods</strong><small>Search foods and compare nutrient values.</small></span>
          <ArrowRight size={15} weight="regular" />
        </button>
        <button type="button" className={styles.task} onClick={() => setActiveView('comparison')}>
          <ChartBar size={18} weight="regular" />
          <span><strong>Compare foods</strong><small>View foods side by side.</small></span>
          <ArrowRight size={15} weight="regular" />
        </button>
      </section>

      <details className={styles.moreTools}>
        <summary>More tools</summary>
        <div className={styles.toolGrid} data-ui-actions>
          {MORE_TOOLS.map((tool) => (
            <button key={tool.id} type="button" onClick={() => setActiveView(tool.id)}>
              <span><strong>{tool.label}</strong><small>{tool.description}</small></span>
              <ArrowRight size={14} weight="regular" />
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
