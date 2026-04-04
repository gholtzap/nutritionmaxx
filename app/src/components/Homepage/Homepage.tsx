import type { CSSProperties } from 'react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import {
  ArrowsClockwise,
  Article,
  ArrowRight,
  GitDiff,
  Hamburger,
  Heartbeat,
  Pill,
  Scales,
  SlidersHorizontal,
  Table,
} from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { ViewId } from '../../types';
import { countExcluded, DIETARY_OPTIONS } from '../../utils/dietary';
import styles from './Homepage.module.css';

interface StartCard {
  id: ViewId;
  label: string;
  eyebrow: string;
  desc: string;
  cta: string;
  accent: string;
  Icon: PhosphorIcon;
  featured?: boolean;
}

const START_HERE: StartCard[] = [
  {
    id: 'table',
    label: 'Explore the database',
    eyebrow: 'Search',
    desc: 'Browse the full food dataset by nutrient, category, or food name when you want to inspect options directly.',
    cta: 'Explore foods',
    accent: '103 232 249',
    Icon: Table,
  },
  {
    id: 'fixdiet',
    label: 'Fix your diet',
    eyebrow: 'Recommended',
    desc: 'Start with a guided intake and get targeted food suggestions based on likely nutrient gaps.',
    cta: 'Start diagnosis',
    accent: '248 113 113',
    Icon: Heartbeat,
    featured: true,
  },
  {
    id: 'comparison',
    label: 'Compare foods',
    eyebrow: 'Validate tradeoffs',
    desc: 'Put foods side by side when you want to see exactly which option solves the problem better.',
    cta: 'Open comparison',
    accent: '96 165 250',
    Icon: GitDiff,
  },
];

const MORE_TOOLS: StartCard[] = [
  {
    id: 'planner',
    label: 'Meal Planner',
    eyebrow: 'Plan',
    desc: 'Turn good choices into a weekly pattern and check whether your plan holds up across the full week.',
    cta: 'Open planner',
    accent: '52 211 153',
    Icon: Scales,
  },
  {
    id: 'dietary',
    label: 'Dietary Preferences',
    eyebrow: 'Filter',
    desc: 'Apply dietary constraints before you search or compare.',
    cta: 'Set filters',
    accent: '251 146 60',
    Icon: SlidersHorizontal,
  },
  {
    id: 'nutrients',
    label: 'Nutrient Guide',
    eyebrow: 'Learn',
    desc: 'Review what each nutrient does and where it comes from.',
    cta: 'Open guide',
    accent: '74 222 128',
    Icon: Pill,
  },
  {
    id: 'research',
    label: 'Research',
    eyebrow: 'Context',
    desc: 'Read the app’s short research-backed articles and experiments.',
    cta: 'Read articles',
    accent: '196 181 253',
    Icon: Article,
  },
  {
    id: 'absorption',
    label: 'Absorption',
    eyebrow: 'Interactions',
    desc: 'See which nutrients help or block each other.',
    cta: 'View interactions',
    accent: '45 212 191',
    Icon: ArrowsClockwise,
  },
  {
    id: 'fastfood',
    label: 'Fast Food Menus',
    eyebrow: 'Fallback',
    desc: 'Compare restaurant options when convenience matters.',
    cta: 'See menus',
    accent: '244 114 182',
    Icon: Hamburger,
  },
];

interface StatusCard {
  id: ViewId;
  title: string;
  desc: string;
  cta: string;
  accent: string;
  Icon: PhosphorIcon;
}

function formatCount(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

function accentStyle(accent: string) {
  return { '--feature-accent': accent } as CSSProperties;
}

function summarizePreferences(labels: string[]) {
  if (labels.length <= 2) return labels.join(' + ');
  return `${labels.slice(0, 2).join(' + ')} +${labels.length - 2}`;
}

function StartHereCard({
  card,
  onOpen,
}: {
  card: StartCard;
  onOpen: (view: ViewId) => void;
}) {
  const Icon = card.Icon;
  const className = card.featured
    ? `${styles.startCard} ${styles.startCardFeatured}`
    : styles.startCard;

  return (
    <button
      type="button"
      className={className}
      style={accentStyle(card.accent)}
      onClick={() => onOpen(card.id)}
    >
      <div className={styles.cardTop}>
        <span className={styles.cardEyebrow}>{card.eyebrow}</span>
        <span className={styles.cardIcon}>
          <Icon size={18} weight="regular" />
        </span>
      </div>
      <div className={styles.cardTitle}>{card.label}</div>
      <p className={styles.cardDesc}>{card.desc}</p>
      <span className={styles.cardLink}>
        {card.cta}
        <ArrowRight size={14} weight="bold" />
      </span>
    </button>
  );
}

function ToolCard({
  card,
  onOpen,
}: {
  card: StartCard;
  onOpen: (view: ViewId) => void;
}) {
  const Icon = card.Icon;

  return (
    <button
      type="button"
      className={styles.toolCard}
      style={accentStyle(card.accent)}
      onClick={() => onOpen(card.id)}
    >
      <span className={styles.cardIcon}>
        <Icon size={16} weight="regular" />
      </span>
      <div className={styles.toolContent}>
        <div className={styles.toolLabel}>{card.label}</div>
        <div className={styles.toolDesc}>{card.desc}</div>
      </div>
      <ArrowRight size={14} weight="bold" />
    </button>
  );
}

export default function Homepage() {
  const setActiveView = useStore((state) => state.setActiveView);
  const fruits = useStore((state) => state.fruits);
  const comparisonFruits = useStore((state) => state.comparisonFruits);
  const planEntries = useStore((state) => state.planEntries);
  const dietaryPreferences = useStore((state) => state.dietaryPreferences);

  const activePreferenceLabels = DIETARY_OPTIONS.filter(
    (option) => dietaryPreferences[option.key]
  ).map((option) => option.label);
  const availableFoods = fruits.length - countExcluded(fruits, dietaryPreferences);

  let statusCard: StatusCard | null = null;

  if (planEntries.length > 0) {
    statusCard = {
      id: 'planner',
      title: `${planEntries.length} foods are already in your weekly plan`,
      desc: 'Resume the planner and keep refining servings and coverage.',
      cta: 'Resume planner',
      accent: '52 211 153',
      Icon: Scales,
    };
  } else if (comparisonFruits.length > 0) {
    statusCard = {
      id: 'comparison',
      title: `${comparisonFruits.length} foods are queued for comparison`,
      desc: 'Finish the decision while the current candidates are still selected.',
      cta: 'Resume comparison',
      accent: '96 165 250',
      Icon: GitDiff,
    };
  } else if (activePreferenceLabels.length > 0) {
    statusCard = {
      id: 'dietary',
      title: `${formatCount(availableFoods)} foods match your current filters`,
      desc: `Active filters: ${summarizePreferences(activePreferenceLabels)}.`,
      cta: 'Review filters',
      accent: '251 146 60',
      Icon: SlidersHorizontal,
    };
  }

  const StatusIcon = statusCard?.Icon;

  return (
    <div className={styles.page}>
      {statusCard && StatusIcon && (
        <button
          type="button"
          className={styles.statusBanner}
          style={accentStyle(statusCard.accent)}
          onClick={() => setActiveView(statusCard.id)}
        >
          <span className={styles.cardIcon}>
            <StatusIcon size={16} weight="regular" />
          </span>
          <div className={styles.statusContent}>
            <div className={styles.statusTitle}>{statusCard.title}</div>
            <div className={styles.statusDesc}>{statusCard.desc}</div>
          </div>
          <span className={styles.statusCta}>
            {statusCard.cta}
            <ArrowRight size={14} weight="bold" />
          </span>
        </button>
      )}

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Find what to eat next.</h1>
        <p className={styles.heroCopy}>
          Identify nutrient gaps, compare real foods, and turn good options into a practical weekly plan.
        </p>
        <div className={styles.heroActions}>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={() => setActiveView('table')}
          >
            Explore the database
            <ArrowRight size={15} weight="bold" />
          </button>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>Start here</div>
        </div>
        <div className={styles.startGrid}>
          {START_HERE.map((card) => (
            <StartHereCard key={card.id} card={card} onOpen={setActiveView} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div className={styles.sectionEyebrow}>Explore more</div>
        </div>
        <div className={styles.toolGrid}>
          {MORE_TOOLS.map((card) => (
            <ToolCard key={card.id} card={card} onOpen={setActiveView} />
          ))}
        </div>
      </section>
    </div>
  );
}
