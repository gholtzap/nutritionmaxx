import { useEffect, useMemo, useState } from 'react';
import type { NutrientKey, ItemType, ItemCategory } from '../../types';
import { useDietaryFruits } from '../../utils/use-dietary-fruits';
import { ALL_CATEGORIES, CATEGORY_COLORS, NUTRIENT_MAP, NUTRIENT_META } from '../../utils/nutrition-meta';
import styles from './CategoryOverview.module.css';

const TYPE_OPTIONS: { label: string; value: ItemType }[] = [
  { label: 'Fruits', value: 'fruit' },
  { label: 'Vegetables', value: 'vegetable' },
  { label: 'Spices', value: 'spice' },
  { label: 'Nuts & Seeds', value: 'nut_seed' },
  { label: 'Legumes', value: 'legume' },
  { label: 'Grains', value: 'grain' },
  { label: 'Fish & Seafood', value: 'fish_seafood' },
  { label: 'Poultry', value: 'poultry' },
  { label: 'Beef', value: 'beef' },
  { label: 'Pork', value: 'pork' },
  { label: 'Fats & Oils', value: 'fat_oil' },
  { label: 'Dairy', value: 'dairy' },
  { label: 'Eggs', value: 'egg' },
  { label: 'Lamb', value: 'lamb' },
];

interface RatioEntry {
  name: string;
  ratio: number | null;
}

interface NutrientRatioProps {
  standalone?: boolean;
}

const DEFAULT_NUMERATOR: NutrientKey = 'protein_g';
const DEFAULT_DENOMINATOR: NutrientKey = 'calories_kcal';
const DEFAULT_GROUPING = 'items';
const GROUPING_OPTIONS = [
  { label: 'Foods', value: 'items' },
  { label: 'Categories', value: 'categories' },
  { label: 'Types', value: 'types' },
] as const;
const TYPE_LABELS: Record<ItemType, string> = {
  fruit: 'Fruits',
  vegetable: 'Vegetables',
  spice: 'Spices',
  nut_seed: 'Nuts & Seeds',
  legume: 'Legumes',
  grain: 'Grains',
  fish_seafood: 'Fish & Seafood',
  poultry: 'Poultry',
  beef: 'Beef',
  pork: 'Pork',
  fat_oil: 'Fats & Oils',
  dairy: 'Dairy',
  egg: 'Eggs',
  lamb: 'Lamb',
};

type RatioGrouping = (typeof GROUPING_OPTIONS)[number]['value'];

function isNutrientKey(value: string | null): value is NutrientKey {
  return value !== null && NUTRIENT_MAP.has(value as NutrientKey);
}

function isItemType(value: string): value is ItemType {
  return TYPE_OPTIONS.some((option) => option.value === value);
}

function isRatioGrouping(value: string | null): value is RatioGrouping {
  return value !== null && GROUPING_OPTIONS.some((option) => option.value === value);
}

function getInitialRatioState() {
  const params = new URLSearchParams(window.location.search);
  const numeratorParam = params.get('ratio_num');
  const denominatorParam = params.get('ratio_den');
  const groupingParam = params.get('ratio_group');
  const excludedTypes = (params.get('ratio_types') ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(isItemType);
  const excludedCategories = (params.get('ratio_cats') ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter((value): value is ItemCategory => ALL_CATEGORIES.includes(value as ItemCategory));

  return {
    numerator: isNutrientKey(numeratorParam) ? numeratorParam : DEFAULT_NUMERATOR,
    denominator: isNutrientKey(denominatorParam) ? denominatorParam : DEFAULT_DENOMINATOR,
    grouping: isRatioGrouping(groupingParam) ? groupingParam : DEFAULT_GROUPING,
    excludedTypes: new Set(excludedTypes),
    excludedCategories: new Set(excludedCategories),
  };
}

export default function NutrientRatio({ standalone = false }: NutrientRatioProps) {
  const fruits = useDietaryFruits();
  const [initialRatio] = useState(getInitialRatioState);
  const [numerator, setNumerator] = useState<NutrientKey>(initialRatio.numerator);
  const [denominator, setDenominator] = useState<NutrientKey>(initialRatio.denominator);
  const [grouping, setGrouping] = useState<RatioGrouping>(initialRatio.grouping);
  const [excludedTypes, setExcludedTypes] = useState<Set<ItemType>>(initialRatio.excludedTypes);
  const [excludedCategories, setExcludedCategories] = useState<Set<ItemCategory>>(initialRatio.excludedCategories);

  const numMeta = NUTRIENT_MAP.get(numerator)!;
  const denMeta = NUTRIENT_MAP.get(denominator)!;

  useEffect(() => {
    const url = new URL(window.location.href);
    if (numerator === DEFAULT_NUMERATOR) {
      url.searchParams.delete('ratio_num');
    } else {
      url.searchParams.set('ratio_num', numerator);
    }
    if (denominator === DEFAULT_DENOMINATOR) {
      url.searchParams.delete('ratio_den');
    } else {
      url.searchParams.set('ratio_den', denominator);
    }
    if (grouping === DEFAULT_GROUPING) {
      url.searchParams.delete('ratio_group');
    } else {
      url.searchParams.set('ratio_group', grouping);
    }
    if (excludedTypes.size === 0) {
      url.searchParams.delete('ratio_types');
    } else {
      url.searchParams.set('ratio_types', [...excludedTypes].join(','));
    }
    if (excludedCategories.size === 0) {
      url.searchParams.delete('ratio_cats');
    } else {
      url.searchParams.set('ratio_cats', [...excludedCategories].join(','));
    }
    window.history.replaceState(null, '', url.toString());
  }, [numerator, denominator, grouping, excludedTypes, excludedCategories]);

  const typeFiltered = useMemo(
    () => fruits.filter((f) => !excludedTypes.has(f.type)),
    [fruits, excludedTypes]
  );

  const availableCategories = useMemo(() => {
    const seen = new Set<ItemCategory>();
    for (const item of typeFiltered) {
      seen.add(item.category);
    }
    return [...seen].sort();
  }, [typeFiltered]);

  const filteredItems = useMemo(
    () => typeFiltered.filter((f) => !excludedCategories.has(f.category)),
    [typeFiltered, excludedCategories]
  );

  const ranked = useMemo(() => {
    let entries: RatioEntry[] = [];

    if (grouping === 'items') {
      entries = filteredItems.map((item) => {
        const numVal = item[numerator] as number | null;
        const denVal = item[denominator] as number | null;
        if (numVal === null || denVal === null || denVal === 0) {
          return { name: item.name, ratio: null };
        }
        return { name: item.name, ratio: numVal / denVal };
      });
    } else {
      const grouped = new Map<string, { numeratorValues: number[]; denominatorValues: number[] }>();

      for (const item of filteredItems) {
        const groupName = grouping === 'categories' ? item.category : TYPE_LABELS[item.type];
        const group = grouped.get(groupName) ?? { numeratorValues: [], denominatorValues: [] };
        const numVal = item[numerator] as number | null;
        const denVal = item[denominator] as number | null;
        if (numVal !== null) {
          group.numeratorValues.push(numVal);
        }
        if (denVal !== null) {
          group.denominatorValues.push(denVal);
        }
        grouped.set(groupName, group);
      }

      entries = [...grouped.entries()].map(([name, values]) => {
        if (values.numeratorValues.length === 0 || values.denominatorValues.length === 0) {
          return { name, ratio: null };
        }
        const numeratorAverage =
          values.numeratorValues.reduce((sum, value) => sum + value, 0) / values.numeratorValues.length;
        const denominatorAverage =
          values.denominatorValues.reduce((sum, value) => sum + value, 0) / values.denominatorValues.length;
        if (denominatorAverage === 0) {
          return { name, ratio: null };
        }
        return { name, ratio: numeratorAverage / denominatorAverage };
      });
    }

    return entries.sort((a, b) => {
      if (a.ratio === null && b.ratio === null) return 0;
      if (a.ratio === null) return 1;
      if (b.ratio === null) return -1;
      return b.ratio - a.ratio;
    });
  }, [filteredItems, numerator, denominator, grouping]);

  const maxRatio = useMemo(() => {
    let max = 0;
    for (const entry of ranked) {
      if (entry.ratio !== null && entry.ratio > max) max = entry.ratio;
    }
    return max;
  }, [ranked]);
  const countLabel = grouping === 'items' ? 'items' : grouping === 'categories' ? 'categories' : 'types';

  const toggleType = (type: ItemType) => {
    setExcludedTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };

  const toggleCategory = (cat: ItemCategory) => {
    setExcludedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  const unitLabel = `${numMeta.unit}/${denMeta.unit}`;
  const content = (
    <div className={styles.chartSection}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>Nutrient Ratio</h3>
        <div className={styles.ratioSelects}>
          <select
            className={styles.chartSelect}
            value={grouping}
            onChange={(e) => setGrouping(e.target.value as RatioGrouping)}
          >
            {GROUPING_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            className={styles.chartSelect}
            value={numerator}
            onChange={(e) => setNumerator(e.target.value as NutrientKey)}
          >
            {NUTRIENT_META.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label} ({m.unit})
              </option>
            ))}
          </select>
          <span className={styles.ratioPer}>per</span>
          <select
            className={styles.chartSelect}
            value={denominator}
            onChange={(e) => setDenominator(e.target.value as NutrientKey)}
          >
            {NUTRIENT_META.map((m) => (
              <option key={m.key} value={m.key}>
                {m.label} ({m.unit})
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className={styles.ratioFilters}>
        <div className={styles.ratioFilterRow}>
          <span className={styles.ratioFilterLabel}>Type</span>
          <div className={styles.ratioPills}>
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`${styles.ratioPill} ${excludedTypes.has(opt.value) ? styles.ratioPillOff : styles.ratioPillActive}`}
                onClick={() => toggleType(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.ratioFilterRow}>
          <span className={styles.ratioFilterLabel}>Category</span>
          <div className={styles.ratioPills}>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.ratioPill} ${excludedCategories.has(cat) ? styles.ratioPillOff : styles.ratioPillActive}`}
                onClick={() => toggleCategory(cat)}
              >
                <span className={styles.ratioPillDot} style={{ background: CATEGORY_COLORS[cat] }} />
                {cat}
              </button>
            ))}
          </div>
        </div>
        <span className={styles.ratioCount}>{ranked.length} {countLabel}</span>
      </div>
      <div className={styles.ratioList}>
        {ranked.map((entry, i) => (
          <div key={entry.name} className={styles.ratioRow}>
            <span className={styles.ratioRank}>{entry.ratio !== null ? i + 1 : ''}</span>
            <span className={styles.ratioName}>{entry.name}</span>
            <div className={styles.ratioBarTrack}>
              {entry.ratio !== null && maxRatio > 0 && (
                <div
                  className={styles.ratioBarFill}
                  style={{ width: `${(entry.ratio / maxRatio) * 100}%` }}
                />
              )}
            </div>
            <span className={styles.ratioValue}>
              {entry.ratio !== null ? (
                <>
                  {entry.ratio.toFixed(4)}
                  <span className={styles.ratioUnit}> {unitLabel}</span>
                </>
              ) : (
                <span className={styles.ratioNull}>--</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  if (!standalone) {
    return content;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Nutrient Ratio</h2>
        <p className={styles.subtitle}>Rank foods by any nutrient-per-nutrient ratio and share the exact view</p>
      </div>
      {content}
    </div>
  );
}
