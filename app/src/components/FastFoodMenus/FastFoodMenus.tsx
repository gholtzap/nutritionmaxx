import { useState, useEffect, useMemo } from 'react';
import { CaretDown, CaretUp } from '@phosphor-icons/react';
import { NUTRIENT_META } from '../../utils/nutrition-meta';
import styles from './FastFoodMenus.module.css';

interface MenuItem {
  name: string;
  category: string;
  serving_size_g: number;
  serving_label: string;
  nutrients: Record<string, number | null>;
}

interface StandardRestaurant {
  name: string;
  logo_color: string;
  categories: string[];
  items: MenuItem[];
}

interface BuilderIngredient {
  name: string;
  category: string;
  serving_size_g: number;
  serving_label: string;
  nutrients: Record<string, number | null>;
}

interface PopularCombo {
  name: string;
  ingredients: string[];
}

interface BuilderRestaurant {
  name: string;
  logo_color: string;
  type: 'builder';
  ingredient_categories: string[];
  ingredients: BuilderIngredient[];
  popular: PopularCombo[];
}

type Restaurant = StandardRestaurant | BuilderRestaurant;

function isBuilder(r: Restaurant): r is BuilderRestaurant {
  return (r as BuilderRestaurant).type === 'builder';
}

const PUBLISHED_KEYS = [
  'calories_kcal', 'fat_g', 'saturated_fat_g', 'trans_fat_g',
  'cholesterol_mg', 'sodium_mg', 'carbs_g', 'fiber_g', 'sugars_g', 'protein_g',
];

const PUBLISHED_LABELS: Record<string, string> = {
  calories_kcal: 'Calories',
  fat_g: 'Total Fat',
  saturated_fat_g: 'Sat. Fat',
  trans_fat_g: 'Trans Fat',
  cholesterol_mg: 'Cholesterol',
  sodium_mg: 'Sodium',
  carbs_g: 'Total Carbs',
  fiber_g: 'Fiber',
  sugars_g: 'Sugars',
  protein_g: 'Protein',
};

const PUBLISHED_UNITS: Record<string, string> = {
  calories_kcal: 'kcal',
  fat_g: 'g',
  saturated_fat_g: 'g',
  trans_fat_g: 'g',
  cholesterol_mg: 'mg',
  sodium_mg: 'mg',
  carbs_g: 'g',
  fiber_g: 'g',
  sugars_g: 'g',
  protein_g: 'g',
};

const DV_KEYS = [
  'calories_kcal', 'protein_g', 'fat_g', 'carbs_g', 'fiber_g',
  'sodium_mg', 'vitamin_a_mcg', 'vitamin_c_mg', 'calcium_mg',
  'iron_mg', 'potassium_mg', 'vitamin_d_mcg',
];

function formatNutrient(key: string, value: number | null): string {
  if (value === null || value === undefined) return '--';
  const meta = NUTRIENT_META.find((m) => m.key === key);
  if (meta) {
    return `${value.toFixed(meta.decimals)} ${meta.unit}`;
  }
  const unit = PUBLISHED_UNITS[key] || '';
  return `${Math.round(value)} ${unit}`;
}

function dvPct(key: string, value: number | null): number | null {
  if (value === null || value === undefined) return null;
  const meta = NUTRIENT_META.find((m) => m.key === key);
  if (!meta || !meta.dailyValue) return null;
  return (value / meta.dailyValue) * 100;
}

function dvClass(pct: number): { fill: string; text: string } {
  if (pct <= 100) return { fill: styles.dvFillOk, text: styles.dvPctOk };
  if (pct <= 150) return { fill: styles.dvFillWarn, text: styles.dvPctWarn };
  return { fill: styles.dvFillOver, text: styles.dvPctOver };
}

function ItemDetail({ item }: { item: MenuItem }) {
  const extendedKeys = NUTRIENT_META.filter(
    (m) => !PUBLISHED_KEYS.includes(m.key) && item.nutrients[m.key] != null
  );

  return (
    <div className={styles.itemBody}>
      <div>
        <div className={styles.sectionLabel}>Official Nutrition Facts</div>
        <div className={styles.nutrientGrid}>
          {PUBLISHED_KEYS.map((key) => (
            <div key={key} className={styles.nutrientCell}>
              <span className={styles.nutrientLabel}>{PUBLISHED_LABELS[key]}</span>
              <span className={styles.nutrientValue}>{formatNutrient(key, item.nutrients[key])}</span>
            </div>
          ))}
        </div>
      </div>

      {extendedKeys.length > 0 && (
        <div>
          <div className={styles.sectionLabel}>
            Extended Nutrients
            <span className={styles.estimatedTag}>estimated</span>
          </div>
          <div className={styles.nutrientGrid}>
            {extendedKeys.map((meta) => (
              <div key={meta.key} className={styles.nutrientCell}>
                <span className={styles.nutrientLabel}>{meta.label}</span>
                <span className={styles.nutrientValue}>
                  {formatNutrient(meta.key, item.nutrients[meta.key])}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={styles.dvSection}>
        <div className={styles.sectionLabel}>% Daily Value</div>
        {DV_KEYS.map((key) => {
          const pct = dvPct(key, item.nutrients[key]);
          if (pct === null) return null;
          const cls = dvClass(pct);
          const meta = NUTRIENT_META.find((m) => m.key === key);
          const label = meta?.label || PUBLISHED_LABELS[key] || key;
          const width = Math.min(pct, 200) / 2;
          return (
            <div key={key} className={styles.dvBarRow}>
              <span className={styles.dvLabel}>{label}</span>
              <div className={styles.dvTrack}>
                <div
                  className={`${styles.dvFill} ${cls.fill}`}
                  style={{ width: `${width}%` }}
                />
              </div>
              <span className={`${styles.dvPct} ${cls.text}`}>{Math.round(pct)}%</span>
            </div>
          );
        })}
      </div>

      <div className={styles.note}>
        Official values from restaurant nutrition disclosures.
        Extended vitamins and minerals estimated from USDA ingredient data.
      </div>
    </div>
  );
}

function BuilderView({ restaurant }: { restaurant: BuilderRestaurant }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showDetail, setShowDetail] = useState(false);

  const toggle = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const applyCombo = (combo: PopularCombo) => {
    setSelected(new Set(combo.ingredients));
    setShowDetail(false);
  };

  const clearAll = () => {
    setSelected(new Set());
    setShowDetail(false);
  };

  const combinedNutrients = useMemo(() => {
    const totals: Record<string, number | null> = {};
    for (const ing of restaurant.ingredients) {
      if (!selected.has(ing.name)) continue;
      for (const [key, val] of Object.entries(ing.nutrients)) {
        if (val !== null) {
          totals[key] = (totals[key] ?? 0) + val;
        }
      }
    }
    return totals;
  }, [selected, restaurant.ingredients]);

  const totalCal = Math.round(combinedNutrients.calories_kcal ?? 0);
  const totalProtein = Math.round(combinedNutrients.protein_g ?? 0);
  const totalFat = Math.round(combinedNutrients.fat_g ?? 0);
  const totalCarbs = Math.round(combinedNutrients.carbs_g ?? 0);

  const combinedItem: MenuItem = {
    name: 'Custom Order',
    category: '',
    serving_size_g: 0,
    serving_label: '',
    nutrients: combinedNutrients,
  };

  const activeComboName = restaurant.popular.find(
    (c) =>
      c.ingredients.length === selected.size &&
      c.ingredients.every((i) => selected.has(i))
  )?.name ?? null;

  return (
    <div className={styles.builderContainer}>
      <div className={styles.builderPopular}>
        <div className={styles.sectionLabel}>Popular Orders</div>
        <div className={styles.popularRow}>
          {restaurant.popular.map((combo) => (
            <button
              key={combo.name}
              type="button"
              className={
                activeComboName === combo.name
                  ? styles.popularBtnActive
                  : styles.popularBtn
              }
              onClick={() => applyCombo(combo)}
            >
              {combo.name}
            </button>
          ))}
        </div>
      </div>

      {selected.size > 0 && (
        <div className={styles.builderTotal}>
          <div className={styles.builderTotalHeader}>
            <div className={styles.builderTotalLeft}>
              <span className={styles.builderTotalTitle}>Your Order</span>
              <span className={styles.builderTotalCal}>{totalCal} kcal</span>
            </div>
            <div className={styles.builderTotalRight}>
              <span className={styles.builderMacro}>{totalProtein}g protein</span>
              <span className={styles.builderMacroDot} />
              <span className={styles.builderMacro}>{totalFat}g fat</span>
              <span className={styles.builderMacroDot} />
              <span className={styles.builderMacro}>{totalCarbs}g carbs</span>
            </div>
          </div>
          <div className={styles.builderTotalActions}>
            <button
              type="button"
              className={styles.builderToggleDetail}
              onClick={() => setShowDetail((v) => !v)}
            >
              {showDetail ? 'Hide details' : 'Full nutrition'}
              {showDetail ? (
                <CaretUp size={12} weight="bold" />
              ) : (
                <CaretDown size={12} weight="bold" />
              )}
            </button>
            <button
              type="button"
              className={styles.builderClear}
              onClick={clearAll}
            >
              Clear
            </button>
          </div>
          {showDetail && <ItemDetail item={combinedItem} />}
        </div>
      )}

      {restaurant.ingredient_categories.map((cat) => {
        const catIngredients = restaurant.ingredients.filter(
          (i) => i.category === cat
        );
        if (catIngredients.length === 0) return null;
        return (
          <div key={cat} className={styles.builderCategory}>
            <div className={styles.builderCategoryLabel}>{cat}</div>
            <div className={styles.ingredientRow}>
              {catIngredients.map((ing) => (
                <button
                  key={ing.name}
                  type="button"
                  className={
                    selected.has(ing.name)
                      ? styles.ingredientChipActive
                      : styles.ingredientChip
                  }
                  onClick={() => toggle(ing.name)}
                >
                  <span className={styles.ingredientName}>{ing.name}</span>
                  <span className={styles.ingredientCal}>
                    {ing.nutrients.calories_kcal} cal
                  </span>
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {selected.size === 0 && (
        <div className={styles.builderEmpty}>
          Select a popular order above or build your own by choosing ingredients below
        </div>
      )}
    </div>
  );
}

export default function FastFoodMenus() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [activeRestaurant, setActiveRestaurant] = useState(0);
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  useEffect(() => {
    fetch('/fast-food.json')
      .then((res) => res.json())
      .then((data: Restaurant[]) => {
        setRestaurants(data);
      })
      .catch(() => {});
  }, []);

  if (restaurants.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Loading menus...</div>
      </div>
    );
  }

  const restaurant = restaurants[activeRestaurant];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Fast Food Menus -- Extended</h1>
        <p className={styles.subtitle}>
          Official nutrition facts extended with estimated vitamins and minerals
        </p>
      </div>

      <div className={styles.restaurantTabs}>
        {restaurants.map((r, i) => (
          <button
            key={r.name}
            type="button"
            className={i === activeRestaurant ? styles.restaurantTabActive : styles.restaurantTab}
            onClick={() => {
              setActiveRestaurant(i);
              setActiveCategory('All');
              setExpandedItem(null);
            }}
          >
            <span className={styles.dot} style={{ background: r.logo_color }} />
            {r.name}
          </button>
        ))}
      </div>

      {isBuilder(restaurant) ? (
        <BuilderView restaurant={restaurant} />
      ) : (
        <>
          <div className={styles.categoryTabs}>
            {['All', ...restaurant.categories].map((cat) => (
              <button
                key={cat}
                type="button"
                className={cat === activeCategory ? styles.categoryTabActive : styles.categoryTab}
                onClick={() => {
                  setActiveCategory(cat);
                  setExpandedItem(null);
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className={styles.itemsList}>
            {(activeCategory === 'All'
              ? restaurant.items
              : restaurant.items.filter((it) => it.category === activeCategory)
            ).map((item) => {
              const isExpanded = expandedItem === `${restaurant.name}:${item.name}`;
              const key = `${restaurant.name}:${item.name}`;
              return (
                <button
                  key={key}
                  type="button"
                  className={isExpanded ? styles.itemCardExpanded : styles.itemCard}
                  onClick={() => setExpandedItem(isExpanded ? null : key)}
                >
                  <div className={styles.itemHeader}>
                    <span className={styles.itemName}>{item.name}</span>
                    <div className={styles.itemMeta}>
                      <span className={styles.itemCal}>
                        {item.nutrients.calories_kcal ?? '--'} kcal
                      </span>
                      <span className={styles.itemServing}>{item.serving_label}</span>
                      {isExpanded ? (
                        <CaretUp size={14} weight="bold" color="var(--text-tertiary)" />
                      ) : (
                        <CaretDown size={14} weight="bold" color="var(--text-tertiary)" />
                      )}
                    </div>
                  </div>
                  {isExpanded && <ItemDetail item={item} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
