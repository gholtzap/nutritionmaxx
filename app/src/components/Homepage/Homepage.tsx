import { useState, useEffect, useCallback, useRef } from 'react';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import {
  Table,
  GitDiff,
  SquaresFour,
  Pill,
  ArrowsClockwise,
  Scales,
  SlidersHorizontal,
  Heartbeat,
  Article,
  CaretRight,
  CaretLeft,
} from '@phosphor-icons/react';
import { useStore } from '../../store';
import type { ViewId } from '../../types';
import styles from './Homepage.module.css';

interface Feature {
  id: ViewId;
  label: string;
  tag: string;
  desc: string;
  Icon: PhosphorIcon;
  color: string;
}

const HERO_SLIDES: Feature[] = [
  {
    id: 'fixdiet',
    label: 'Fix My Diet',
    tag: 'Personalized',
    desc: 'Analyze your current diet, identify nutritional gaps, and get targeted food suggestions to fill them.',
    Icon: Heartbeat,
    color: '#ef4444',
  },
  {
    id: 'table',
    label: 'Nutrition Explorer',
    tag: 'Database',
    desc: 'Search and filter hundreds of foods across 29 nutrients. Sort, compare, and discover the most nutrient-dense options.',
    Icon: Table,
    color: '#63b3ed',
  },
  {
    id: 'planner',
    label: 'Meal Planner',
    tag: 'Weekly Planning',
    desc: 'Build a weekly meal plan, track cumulative nutrition, and optimize your meals around your goals.',
    Icon: Scales,
    color: '#10b981',
  },
];

const FEATURED: Feature[] = [
  {
    id: 'comparison',
    label: 'Compare Foods',
    tag: '',
    desc: 'Place up to three foods side by side and see exactly where each one wins or falls short.',
    Icon: GitDiff,
    color: '#a78bfa',
  },
  {
    id: 'categories',
    label: 'Categories',
    tag: '',
    desc: 'Average nutrient profiles across food groups.',
    Icon: SquaresFour,
    color: '#f59e0b',
  },
  {
    id: 'nutrients',
    label: 'Nutrient Guide',
    tag: '',
    desc: 'What each nutrient does and where to find it.',
    Icon: Pill,
    color: '#34d399',
  },
];

const DISCOVER: Feature[] = [
  {
    id: 'absorption',
    label: 'Absorption',
    tag: '',
    desc: 'Which nutrients enhance or block each other when eaten together.',
    Icon: ArrowsClockwise,
    color: '#14b8a6',
  },
  {
    id: 'dietary',
    label: 'Dietary Preferences',
    tag: '',
    desc: 'Filter by vegan, halal, low-sodium, and other restrictions.',
    Icon: SlidersHorizontal,
    color: '#f97316',
  },
  {
    id: 'research',
    label: 'Research',
    tag: '',
    desc: 'Data-driven articles on optimal diets and food science.',
    Icon: Article,
    color: '#8b5cf6',
  },
  {
    id: 'fixdiet',
    label: 'Fix My Diet',
    tag: '',
    desc: 'Find nutritional gaps and get targeted suggestions.',
    Icon: Heartbeat,
    color: '#ef4444',
  },
  {
    id: 'planner',
    label: 'Meal Planner',
    tag: '',
    desc: 'Build and optimize a weekly meal plan.',
    Icon: Scales,
    color: '#10b981',
  },
];

function HeroCarousel() {
  const [active, setActive] = useState(0);
  const setActiveView = useStore((s) => s.setActiveView);
  const timerRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [resetTimer]);

  const goTo = (i: number) => {
    setActive(i);
    resetTimer();
  };

  return (
    <div className={styles.carousel}>
      {HERO_SLIDES.map((slide, i) => {
        const SlideIcon = slide.Icon;
        return (
          <button
            key={slide.id}
            type="button"
            className={`${styles.slide} ${i === active ? styles.slideActive : ''}`}
            onClick={() => setActiveView(slide.id)}
          >
            <div
              className={styles.slideGradient}
              style={{
                background: `linear-gradient(135deg, ${slide.color}22 0%, ${slide.color}08 40%, var(--bg-primary) 100%)`,
              }}
            />
            <div className={styles.slideIconWrap}>
              <SlideIcon size={240} weight="regular" />
            </div>
            <div className={styles.slideContent}>
              <span className={styles.slideTag}>{slide.tag}</span>
              <div className={styles.slideTitle}>{slide.label}</div>
              <div className={styles.slideDesc}>{slide.desc}</div>
              <span className={styles.slideCta}>
                Launch
                <CaretRight size={14} weight="bold" />
              </span>
            </div>
          </button>
        );
      })}
      <div className={styles.dots}>
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            type="button"
            className={`${styles.dot} ${i === active ? styles.dotActive : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              goTo(i);
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function FeaturedCard({ feature, wide }: { feature: Feature; wide?: boolean }) {
  const setActiveView = useStore((s) => s.setActiveView);
  const Ic = feature.Icon;

  return (
    <button
      type="button"
      className={`${styles.card} ${wide ? styles.featuredWide : ''}`}
      onClick={() => setActiveView(feature.id)}
    >
      <div
        className={styles.cardGlow}
        style={{
          background: `radial-gradient(ellipse at 30% 80%, ${feature.color}15 0%, transparent 70%)`,
        }}
      />
      <div className={styles.cardBgIcon}>
        <Ic size={wide ? 120 : 80} weight="regular" />
      </div>
      <div className={styles.cardIcon} style={{ color: feature.color }}>
        <Ic size={wide ? 22 : 18} weight="regular" />
      </div>
      <div className={styles.cardTitle}>{feature.label}</div>
      <div className={styles.cardDesc}>{feature.desc}</div>
    </button>
  );
}

function RailCard({ feature }: { feature: Feature }) {
  const setActiveView = useStore((s) => s.setActiveView);
  const Ic = feature.Icon;

  return (
    <button
      type="button"
      className={styles.railCard}
      onClick={() => setActiveView(feature.id)}
    >
      <div
        className={styles.cardGlow}
        style={{
          background: `radial-gradient(ellipse at 30% 80%, ${feature.color}12 0%, transparent 70%)`,
        }}
      />
      <div className={styles.cardBgIcon}>
        <Ic size={64} weight="regular" />
      </div>
      <div className={styles.cardIcon} style={{ color: feature.color }}>
        <Ic size={16} weight="regular" />
      </div>
      <div className={styles.cardTitle}>{feature.label}</div>
      <div className={styles.cardDesc}>{feature.desc}</div>
    </button>
  );
}

function ScrollRail({ label, items }: { label: string; items: Feature[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: number) => {
    railRef.current?.scrollBy({ left: dir * 240, behavior: 'smooth' });
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <span className={styles.sectionLabel}>{label}</span>
        <div className={styles.scrollArrows}>
          <button
            type="button"
            className={styles.scrollArrow}
            onClick={() => scroll(-1)}
            aria-label="Scroll left"
          >
            <CaretLeft size={14} weight="bold" />
          </button>
          <button
            type="button"
            className={styles.scrollArrow}
            onClick={() => scroll(1)}
            aria-label="Scroll right"
          >
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
      </div>
      <div className={styles.rail} ref={railRef}>
        {items.map((f) => (
          <RailCard key={f.id} feature={f} />
        ))}
      </div>
    </div>
  );
}

export default function Homepage() {
  return (
    <div className={styles.wrapper}>
      <HeroCarousel />
      <div className={styles.featured}>
        <FeaturedCard feature={FEATURED[0]} wide />
        <FeaturedCard feature={FEATURED[1]} />
        <FeaturedCard feature={FEATURED[2]} />
      </div>
      <ScrollRail label="Discover" items={DISCOVER} />
    </div>
  );
}
