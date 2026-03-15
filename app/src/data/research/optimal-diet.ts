import type { ResearchArticle } from '../research-articles';

const article: ResearchArticle = {
  slug: 'optimal-diet-by-food-count',
  title: 'The Mathematically Perfect Diet',
  date: '2026-03-14',
  summary: 'Using constrained optimization across 262 foods and 26 nutrients, we found the best possible diet for every food count from 1 to 8. By 8 foods, 21 of 26 nutrients land in range at 2,021 calories.',
  tags: ['optimization', 'nutrient density', 'daily values'],
  content: [
    { type: 'text', value: 'What if you could only eat one food forever? What about three? We ran a constrained optimization across our entire 262-food database to find the exact combination of foods and daily servings that best covers every Daily Value while staying within 1,800-2,200 calories per day.' },

    { type: 'callout', tone: 'method', title: 'Algorithm', value: 'For each food count K, constrained least squares (L-BFGS-B) optimizes daily servings using an asymmetric penalty function based on Tolerable Upper Intake Levels. Deficiency below 100% DV is penalized. Excess is only penalized above each nutrient\'s UL (e.g. 250% for iron, 192% for calcium). Sodium and sugars are treated as upper limits where lower is better. Calories are constrained to 1,800-2,200 kcal. Volume caps prevent unrealistic quantities (800g/day for most foods, 50g for spices, 150g for fats). K=1-2 are exhaustive. K=3 searches 161,700 combinations. K>=4 uses greedy forward selection with swap-based local search and 10 random restarts.' },

    { type: 'callout', tone: 'caveat', title: 'Excluded from scoring', value: 'Vitamin D (sparse data) and Vitamin K (missing for 87% of foods) are excluded from the optimization. Both are displayed in results but don\'t influence food selection.' },

    { type: 'divider' },

    { type: 'heading', value: 'K=1: The Single Best Food' },

    { type: 'foods', calories: '2,087', items: [
      { name: 'Quinoa', servings: '12.60/day (88.2/wk)', detail: '1/4 cup dry (45g)' },
    ]},

    { type: 'text', value: '4 of 26 nutrients in range. The calorie constraint changes everything. Instead of green beans at 433 calories, the algorithm picks quinoa: a complete protein grain that actually hits 2,087 kcal. Fat is the glaring hole at 44%. No single food comes close to complete, but at least this one keeps you alive.' },

    { type: 'bars', title: 'K=1; 4 of 26 in range', items: [
      { label: 'Calories', pct: 104.3 },
      { label: 'Protein', pct: 160.1 },
      { label: 'Fat', pct: 44.1 },
      { label: 'Carbs', pct: 132.3 },
      { label: 'Vitamin A', pct: 0.6 },
      { label: 'Vitamin B12', pct: 0 },
      { label: 'Vitamin C', pct: 0 },
      { label: 'Calcium', pct: 20.5 },
      { label: 'Potassium', pct: 67.9 },
      { label: 'Selenium', pct: 87.6 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=2: Duck Egg' },

    { type: 'foods', calories: '1,994', items: [
      { name: 'Parsnip', servings: '6.02/day (42.1/wk)', detail: '1 medium (133g)' },
      { name: 'Duck Egg', servings: '10.76/day (75.3/wk)', detail: '1 egg (70g)' },
    ]},

    { type: 'text', value: '4 of 26 in range. The algorithm completely reshuffles: parsnip for its carb and fiber base, duck egg for fat, protein, and micronutrients. B12 explodes to 1,695% (harmless; no upper limit from food). The real problem: carbs crater to 56% and niacin to 44%. Plant + animal pairing is already clear.' },

    { type: 'bars', title: 'K=2; 4 of 26 in range', items: [
      { label: 'Calories', pct: 99.7 },
      { label: 'Protein', pct: 212.2 },
      { label: 'Carbs', pct: 56.3 },
      { label: 'Vitamin B3', pct: 44.4 },
      { label: 'Vitamin B12', pct: 1694.8 },
      { label: 'Vitamin C', pct: 151.1 },
      { label: 'Calcium', pct: 59.2 },
      { label: 'Iron', pct: 187.3 },
      { label: 'Potassium', pct: 99.4 },
      { label: 'Selenium', pct: 524.7 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=3: Ricotta' },

    { type: 'foods', calories: '2,248', items: [
      { name: 'Millet', servings: '6.75/day (47.2/wk)', detail: '1/4 cup dry (45g)' },
      { name: 'Swiss Chard', servings: '20.32/day (142.3/wk)', detail: '1 cup chopped (36g)' },
      { name: 'Ricotta', servings: '5.16/day (36.2/wk)', detail: '1/2 cup (124g)' },
    ]},

    { type: 'text', value: '10 of 26 in range. A huge jump. Millet provides the calorie base, Swiss chard packs Vitamin A, C, iron, and potassium, and ricotta fills in fat, calcium, and B12. Macros are essentially solved: fat 102%, carbs 107%, calories 112%. The remaining overages (Vitamin A 334%, Copper 411%) are all well below their ULs and carry zero health risk.' },

    { type: 'bars', title: 'K=3; 10 of 26 in range', items: [
      { label: 'Calories', pct: 112.4 },
      { label: 'Fat', pct: 101.9 },
      { label: 'Carbs', pct: 107.3 },
      { label: 'Folate', pct: 96.5 },
      { label: 'Vitamin E', pct: 97.9 },
      { label: 'Potassium', pct: 101.4 },
      { label: 'Zinc', pct: 101.2 },
      { label: 'Selenium', pct: 95.6 },
      { label: 'Vitamin A', pct: 334.1 },
      { label: 'Copper', pct: 411.4 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=4: Chili Powder Returns' },

    { type: 'foods', calories: '2,186', items: [
      { name: 'Cornmeal', servings: '6.87/day (48.1/wk)', detail: '1/4 cup (30g)' },
      { name: 'Chili Powder', servings: '14.90/day (104.3/wk)', detail: '1 tsp (2.7g)' },
      { name: 'Ricotta', servings: '5.01/day (35.1/wk)', detail: '1/2 cup (124g)' },
      { name: 'Parsnip', servings: '3.97/day (27.8/wk)', detail: '1 medium (133g)' },
    ]},

    { type: 'text', value: '10 of 26 in range. Full rebuild. Cornmeal replaces millet, chili powder enters at 15 tsp/day (just 40g), and parsnip returns for potassium. Every nutrient that\'s over (B2 224%, B12 220%) is safely below its UL. The old algorithm had chili powder at K=3; it reappears here because the calorie constraint shuffles everything.' },

    { type: 'bars', title: 'K=4; 10 of 26 in range', items: [
      { label: 'Calories', pct: 109.3 },
      { label: 'Fat', pct: 99.9 },
      { label: 'Carbs', pct: 115.8 },
      { label: 'Folate', pct: 110.3 },
      { label: 'Vitamin C', pct: 100.0 },
      { label: 'Iron', pct: 99.9 },
      { label: 'Potassium', pct: 100.3 },
      { label: 'Zinc', pct: 108.0 },
      { label: 'Sodium', pct: 85.3 },
      { label: 'Selenium', pct: 156.9 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=5: The Restart Effect' },

    { type: 'foods', calories: '2,171', items: [
      { name: 'Scallion', servings: '24.79/day (173.5/wk)', detail: '1 medium (15g)' },
      { name: 'Margarine', servings: '4.36/day (30.5/wk)', detail: '1 tbsp (14g)' },
      { name: 'Cornmeal', servings: '10.44/day (73.1/wk)', detail: '1/4 cup (30g)' },
      { name: 'Celery', servings: '17.10/day (119.7/wk)', detail: '1 stalk (40g)' },
      { name: 'Yogurt (Whole)', servings: '2.59/day (18.2/wk)', detail: '1 cup (245g)' },
    ]},

    { type: 'text', value: '16 of 26 in range. Random restart #5 blew away the greedy solution. The entire food set changes: scallion (25 per day is just 372g), celery for potassium and sodium, margarine for fat-soluble vitamins, yogurt for B12 and calcium. Thirteen nutrients land between 100-120%. The algorithm is converging.' },

    { type: 'bars', title: 'K=5; 16 of 26 in range', items: [
      { label: 'Calories', pct: 108.6 },
      { label: 'Protein', pct: 118.3 },
      { label: 'Fat', pct: 106.0 },
      { label: 'Carbs', pct: 115.8 },
      { label: 'Vitamin A', pct: 115.8 },
      { label: 'Vitamin B12', pct: 100.0 },
      { label: 'Vitamin C', pct: 104.8 },
      { label: 'Vitamin E', pct: 100.0 },
      { label: 'Calcium', pct: 102.4 },
      { label: 'Iron', pct: 100.0 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=6: Grass-fed Beef' },

    { type: 'foods', calories: '2,097', items: [
      { name: 'Ground Beef (Grass-fed)', servings: '0.62/day (4.3/wk)', detail: '3 oz (85g)' },
      { name: 'Cornmeal', servings: '8.92/day (62.4/wk)', detail: '1/4 cup (30g)' },
      { name: 'Arugula', servings: '11.90/day (83.3/wk)', detail: '1 cup (20g)' },
      { name: 'Olive Oil', servings: '4.80/day (33.6/wk)', detail: '1 tbsp (14g)' },
      { name: 'Fennel', servings: '5.78/day (40.5/wk)', detail: '1 cup sliced (87g)' },
      { name: 'Kefir (Lowfat)', servings: '2.06/day (14.4/wk)', detail: '1 cup (243g)' },
    ]},

    { type: 'text', value: '15 of 26 in range. Another complete rebuild from a random restart. This reads like an actual meal plan: beef twice a week, arugula salad, olive oil dressing, fennel sides, daily kefir. Five nutrients hit exactly 100%. The only deficiency is sodium, which is a feature not a bug.' },

    { type: 'bars', title: 'K=6; 15 of 26 in range', items: [
      { label: 'Calories', pct: 104.9 },
      { label: 'Fat', pct: 117.0 },
      { label: 'Carbs', pct: 100.0 },
      { label: 'Vitamin B6', pct: 100.0 },
      { label: 'Vitamin B12', pct: 103.5 },
      { label: 'Vitamin E', pct: 100.0 },
      { label: 'Calcium', pct: 100.0 },
      { label: 'Iron', pct: 100.0 },
      { label: 'Potassium', pct: 100.0 },
      { label: 'Zinc', pct: 106.2 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=7: Oregano' },

    { type: 'foods', calories: '2,038', items: [
      { name: 'Cornmeal', servings: '4.07/day (28.5/wk)', detail: '1/4 cup (30g)' },
      { name: 'Oregano', servings: '12.85/day (90.0/wk)', detail: '1 tsp (1.8g)' },
      { name: 'Olive Oil', servings: '4.24/day (29.7/wk)', detail: '1 tbsp (14g)' },
      { name: 'Flank Steak', servings: '1.26/day (8.8/wk)', detail: '3 oz (85g)' },
      { name: 'Kefir (Lowfat)', servings: '2.19/day (15.4/wk)', detail: '1 cup (243g)' },
      { name: 'Celery', servings: '12.02/day (84.1/wk)', detail: '1 stalk (40g)' },
      { name: 'Plantain', servings: '2.03/day (14.2/wk)', detail: '1 medium (179g)' },
    ]},

    { type: 'text', value: '17 of 26 in range. Oregano enters at 13 tsp/day (23g) and loads iron, calcium, and Vitamin A. Flank steak replaces ground beef for better zinc and B12. This is the first solution where every macronutrient (fat, carbs, protein, calories) is within range simultaneously. Eight nutrients sit at exactly 100%.' },

    { type: 'bars', title: 'K=7; 17 of 26 in range', items: [
      { label: 'Calories', pct: 101.9 },
      { label: 'Fat', pct: 100.1 },
      { label: 'Carbs', pct: 102.9 },
      { label: 'Vitamin B1', pct: 100.0 },
      { label: 'Vitamin B12', pct: 117.2 },
      { label: 'Vitamin C', pct: 100.0 },
      { label: 'Vitamin E', pct: 100.0 },
      { label: 'Calcium', pct: 100.0 },
      { label: 'Potassium', pct: 100.0 },
      { label: 'Zinc', pct: 100.0 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=8: The Peak' },

    { type: 'foods', calories: '2,021', items: [
      { name: 'Lamb (Shank)', servings: '0.64/day (4.5/wk)', detail: '4 oz (113g)' },
      { name: 'Cornmeal', servings: '5.12/day (35.8/wk)', detail: '1/4 cup (30g)' },
      { name: 'Nectarine', servings: '1.30/day (9.1/wk)', detail: '1 medium (142g)' },
      { name: 'Margarine', servings: '4.94/day (34.5/wk)', detail: '1 tbsp (14g)' },
      { name: 'Celery', servings: '18.25/day (127.7/wk)', detail: '1 stalk (40g)' },
      { name: 'Plantain', servings: '1.59/day (11.1/wk)', detail: '1 medium (179g)' },
      { name: 'Dill (Dried)', servings: '15.86/day (111.0/wk)', detail: '1 tsp (1.0g)' },
      { name: 'Parmesan', servings: '2.08/day (14.6/wk)', detail: '1 oz (28g)' },
    ]},

    { type: 'text', value: '21 of 26 in range. Lamb shank twice a week for zinc and B12. Nectarine adds Vitamin C and sugars. Dill returns at 16g/day for iron and calcium. Parmesan rounds out the dairy. Only protein (125%), fiber (123%), magnesium (125%), and copper (135%) exceed 120%, all safely below their ULs. Every other nutrient is dialed in.' },

    { type: 'bars', title: 'K=8; 21 of 26 in range', items: [
      { label: 'Calories', pct: 101.0 },
      { label: 'Protein', pct: 124.9 },
      { label: 'Fat', pct: 103.3 },
      { label: 'Carbs', pct: 100.0 },
      { label: 'Fiber', pct: 123.1 },
      { label: 'Vitamin A', pct: 104.7 },
      { label: 'Vitamin B1', pct: 104.5 },
      { label: 'Vitamin B2', pct: 111.0 },
      { label: 'Vitamin B3', pct: 100.0 },
      { label: 'Vitamin B5', pct: 102.7 },
      { label: 'Vitamin B6', pct: 100.0 },
      { label: 'Folate', pct: 102.7 },
      { label: 'Vitamin B12', pct: 105.3 },
      { label: 'Vitamin C', pct: 109.1 },
      { label: 'Vitamin E', pct: 100.0 },
      { label: 'Calcium', pct: 100.0 },
      { label: 'Iron', pct: 105.1 },
      { label: 'Magnesium', pct: 124.9 },
      { label: 'Phosphorus', pct: 104.9 },
      { label: 'Potassium', pct: 100.0 },
      { label: 'Sodium', pct: 81.4 },
      { label: 'Zinc', pct: 100.0 },
      { label: 'Copper', pct: 135.2 },
      { label: 'Manganese', pct: 112.3 },
      { label: 'Selenium', pct: 104.0 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'The Full Progression' },

    { type: 'progress', items: [
      { k: 1, rmse: 121.6, label: 'Quinoa' },
      { k: 2, rmse: 335.8, label: 'Parsnip, Duck Egg' },
      { k: 3, rmse: 111.5, label: 'Millet, Swiss Chard, Ricotta' },
      { k: 4, rmse: 55.6, label: 'Cornmeal, Chili Powder, Ricotta, Parsnip' },
      { k: 5, rmse: 28.8, label: 'Scallion, Margarine, Cornmeal, Celery, Yogurt' },
      { k: 6, rmse: 26.5, label: 'Beef, Cornmeal, Arugula, Olive Oil, Fennel, Kefir' },
      { k: 7, rmse: 21.9, label: 'Cornmeal, Oregano, Olive Oil, Steak, Kefir, Celery, Plantain' },
      { k: 8, rmse: 14.1, label: 'Lamb, Cornmeal, Nectarine, Margarine, Celery, Plantain, Dill, Parmesan' },
    ]},

    { type: 'callout', tone: 'caveat', title: 'Caveats', value: 'This is pure nutrient math; no consideration of palatability, cost, or food safety. 18 celery stalks daily is a lot of celery. Sodium landing under 100% is actually healthy since 2,300mg is an upper limit; sugars landing low is similarly a positive. The RMSE at K=2 spikes because duck eggs push B12 to 1,695% and selenium to 525%; the asymmetric penalty doesn\'t penalize this (no UL from food) but the RMSE-from-100% metric captures the raw deviation. K>=4 uses greedy search with 10 random restarts, finding a local optimum.' },
  ],
};

export default article;
