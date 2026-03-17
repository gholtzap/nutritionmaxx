import type { ResearchArticle } from '../research-articles';

const article: ResearchArticle = {
  slug: 'optimal-diet-by-food-count',
  title: 'The Minimum Viable Diet',
  date: '2026-03-16',
  summary: 'Using constrained optimization across 544 foods and 26 nutrients, I found the best possible diet for every food count from 1 to 8. By 8 foods, 23 of 26 nutrients land in range at 1,959 calories.',
  tags: ['optimization', 'nutrient density', 'daily values'],
  content: [
    { type: 'callout', tone: 'insight', title: 'TLDR', value: 'If you could only eat one food, it\'s quinoa. Eating only 4 foods (arugula, avocado, cornmeal, skim milk) covers most of the nutrients we need to survive. At 8 foods (ricotta, yam, avocado, durum wheat, pumpkin, plantain, samphire, rye flour) you hit 23 of 26 nutrients at 1,959 calories.' },

    { type: 'text', value: 'What if you could only eat one food forever? What about three? I ran a constrained optimization across our entire 544-food database to find the exact combination of foods and daily servings that best covers every Daily Value while staying within 1,800-2,200 calories per day.' },

    { type: 'callout', tone: 'method', title: 'Algorithm', value: 'For each food count K, constrained least squares (L-BFGS-B) optimizes daily servings using an asymmetric penalty function based on Tolerable Upper Intake Levels. Deficiency below 100% DV is penalized. Excess is only penalized above each nutrient\'s UL (e.g. 250% for iron, 192% for calcium). Sodium and sugars are treated as upper limits where lower is better. Calories are constrained to 1,800-2,200 kcal. Volume caps prevent unrealistic quantities (800g/day for most foods, 50g for spices, 150g for fats). K=1-2 are exhaustive. K=3 searches 161,700 combinations. K>=4 uses greedy forward selection with swap-based local search and 10 random restarts.' },

    { type: 'callout', tone: 'caveat', title: 'Excluded from scoring', value: 'Vitamin D (sparse data) and Vitamin K (missing for 87% of foods) are excluded from the optimization. Both are displayed in results but don\'t influence food selection.' },

    { type: 'divider' },

    { type: 'heading', value: 'K=1: The Single Best Food' },

    { type: 'foods', calories: '2,087', items: [
      { name: 'Quinoa', servings: '12.60/day (88.2/wk)', detail: '1/4 cup dry (45g)' },
    ]},

    { type: 'text', value: '4 of 26 nutrients in range. If calories weren\'t a factor, green beans would win at 433 calories, but if we take calories into account (making sure you don\'t starve) the algorithm picks quinoa: a complete protein grain that actually hits 2,087 kcal. Fat is the glaring hole at 44%. No single food comes close to complete, but at least this one keeps you alive.' },

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

    { type: 'heading', value: 'K=3: Egg Yolk' },

    { type: 'foods', calories: '2,239', items: [
      { name: 'Whole Wheat Flour', servings: '3.15/day (22.0/wk)', detail: '100g' },
      { name: 'Egg Yolk', servings: '17.80/day (124.6/wk)', detail: '1 large (17g)' },
      { name: 'Arugula', servings: '40.00/day (280.0/wk)', detail: '1 cup (20g)' },
    ]},

    { type: 'text', value: '7 of 26 in range. Eighteen egg yolks and 40 cups of arugula (800g, hitting the volume cap). Nothing is deficient anymore, but almost everything overshoots: folate 338%, selenium 313%. The optimizer doesn\'t care since none breach their ULs.' },

    { type: 'bars', title: 'K=3; 7 of 26 in range', items: [
      { label: 'Calories', pct: 111.9 },
      { label: 'Protein', pct: 197.7 },
      { label: 'Fat', pct: 119.4 },
      { label: 'Carbs', pct: 99.1 },
      { label: 'Vitamin A', pct: 233.9 },
      { label: 'Vitamin B12', pct: 245.9 },
      { label: 'Vitamin C', pct: 133.3 },
      { label: 'Calcium', pct: 139.4 },
      { label: 'Folate', pct: 338.3 },
      { label: 'Selenium', pct: 312.5 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=4: Avocado' },

    { type: 'foods', calories: '2,205', items: [
      { name: 'Arugula', servings: '27.90/day (195.3/wk)', detail: '1 cup (20g)' },
      { name: 'Avocado (Hass)', servings: '5.43/day (38.0/wk)', detail: '100g' },
      { name: 'Cornmeal', servings: '8.72/day (61.0/wk)', detail: '1/4 cup (30g)' },
      { name: 'Skim Milk', servings: '1.97/day (13.8/wk)', detail: '1 cup (244g)' },
    ]},

    { type: 'text', value: '16 of 26 in range. The biggest jump in the sequence. Adding one food nearly doubles the in-range count from 7 to 16.' },

    { type: 'bars', title: 'K=4; 16 of 26 in range', items: [
      { label: 'Calories', pct: 110.3 },
      { label: 'Protein', pct: 115.5 },
      { label: 'Fat', pct: 138.4 },
      { label: 'Carbs', pct: 99.7 },
      { label: 'Vitamin A', pct: 112.5 },
      { label: 'Vitamin B12', pct: 100.0 },
      { label: 'Vitamin C', pct: 111.1 },
      { label: 'Vitamin E', pct: 99.7 },
      { label: 'Potassium', pct: 113.8 },
      { label: 'Zinc', pct: 100.2 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=5: Pork Belly' },

    { type: 'foods', calories: '2,078', items: [
      { name: 'Arugula', servings: '30.85/day (216.0/wk)', detail: '1 cup (20g)' },
      { name: 'Pork Belly', servings: '1.42/day (9.9/wk)', detail: '3 oz (85g)' },
      { name: 'Cornmeal', servings: '7.08/day (49.5/wk)', detail: '1/4 cup (30g)' },
      { name: 'Yogurt (Whole)', servings: '1.53/day (10.7/wk)', detail: '1 cup (245g)' },
      { name: 'Yam', servings: '2.66/day (18.6/wk)', detail: '100g' },
    ]},

    { type: 'text', value: '18 of 26 in range. Six nutrients hit exactly 100%.' },

    { type: 'bars', title: 'K=5; 18 of 26 in range', items: [
      { label: 'Calories', pct: 103.9 },
      { label: 'Fat', pct: 113.4 },
      { label: 'Carbs', pct: 100.0 },
      { label: 'Fiber', pct: 102.9 },
      { label: 'Vitamin A', pct: 100.0 },
      { label: 'Vitamin B3', pct: 100.0 },
      { label: 'Vitamin B12', pct: 100.0 },
      { label: 'Vitamin C', pct: 117.1 },
      { label: 'Iron', pct: 105.6 },
      { label: 'Potassium', pct: 100.0 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=6: Seven at 100%' },

    { type: 'foods', calories: '1,982', items: [
      { name: 'Sour Cream', servings: '13.77/day (96.4/wk)', detail: '2 tbsp (24g)' },
      { name: 'Arugula', servings: '27.52/day (192.7/wk)', detail: '1 cup (20g)' },
      { name: 'Yam', servings: '3.17/day (22.2/wk)', detail: '100g' },
      { name: 'Eye of Round', servings: '1.19/day (8.4/wk)', detail: '3 oz (85g)' },
      { name: 'Cornmeal', servings: '5.49/day (38.4/wk)', detail: '1/4 cup (30g)' },
      { name: 'Date (Deglet Noor)', servings: '5.45/day (38.2/wk)', detail: '1 date (7g)' },
    ]},

    { type: 'text', value: '16 of 26 in range. The in-range count dips from 18 but RMSE improves: fewer nutrients are far from 100%, even if more are slightly over 120%. Seven nutrients land at exactly 100%.' },

    { type: 'bars', title: 'K=6; 16 of 26 in range', items: [
      { label: 'Calories', pct: 99.1 },
      { label: 'Fat', pct: 100.0 },
      { label: 'Carbs', pct: 100.4 },
      { label: 'Fiber', pct: 100.0 },
      { label: 'Sugars', pct: 100.0 },
      { label: 'Vitamin B12', pct: 100.0 },
      { label: 'Calcium', pct: 100.0 },
      { label: 'Iron', pct: 100.3 },
      { label: 'Potassium', pct: 100.0 },
      { label: 'Zinc', pct: 102.0 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=7: Turmeric' },

    { type: 'foods', calories: '2,056', items: [
      { name: 'Ricotta (Cow)', servings: '4.00/day (28.0/wk)', detail: '100g' },
      { name: 'Corn (Dried)', servings: '1.00/day (7.0/wk)', detail: '100g' },
      { name: 'Avocado', servings: '1.59/day (11.1/wk)', detail: '1 medium (150g)' },
      { name: 'Durum Wheat', servings: '1.34/day (9.4/wk)', detail: '1/4 cup dry (45g)' },
      { name: 'Pumpkin', servings: '2.65/day (18.6/wk)', detail: '100g' },
      { name: 'Plantain', servings: '1.40/day (9.8/wk)', detail: '1 medium (179g)' },
      { name: 'Turmeric (Dried)', servings: '0.25/day (1.7/wk)', detail: '100g' },
    ]},

    { type: 'text', value: '19 of 26 in range. Complete rebuild: five of seven foods are plants. Turmeric at 25g/day is the only unusual quantity.' },

    { type: 'bars', title: 'K=7; 19 of 26 in range', items: [
      { label: 'Calories', pct: 102.8 },
      { label: 'Protein', pct: 119.7 },
      { label: 'Fat', pct: 111.8 },
      { label: 'Carbs', pct: 100.0 },
      { label: 'Vitamin A', pct: 114.0 },
      { label: 'Folate', pct: 100.0 },
      { label: 'Vitamin B12', pct: 100.0 },
      { label: 'Vitamin E', pct: 100.0 },
      { label: 'Calcium', pct: 106.1 },
      { label: 'Potassium', pct: 100.0 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=8: The Peak' },

    { type: 'foods', calories: '1,959', items: [
      { name: 'Ricotta (Cow)', servings: '4.00/day (28.0/wk)', detail: '100g' },
      { name: 'Yam', servings: '1.46/day (10.2/wk)', detail: '100g' },
      { name: 'Avocado', servings: '1.44/day (10.1/wk)', detail: '1 medium (150g)' },
      { name: 'Durum Wheat', servings: '1.31/day (9.2/wk)', detail: '1/4 cup dry (45g)' },
      { name: 'Pumpkin', servings: '1.75/day (12.3/wk)', detail: '100g' },
      { name: 'Plantain', servings: '1.46/day (10.2/wk)', detail: '1 medium (179g)' },
      { name: 'Samphire', servings: '0.55/day (3.8/wk)', detail: '100g' },
      { name: 'Rye Flour (Type 70)', servings: '0.58/day (4.1/wk)', detail: '100g' },
    ]},

    { type: 'text', value: '23 of 26 in range. The three misses: sugars (44%) and sodium (66%) are both upper limits where lower is healthier, and folate (127%) is barely above range.' },

    { type: 'bars', title: 'K=8; 23 of 26 in range', items: [
      { label: 'Calories', pct: 97.9 },
      { label: 'Protein', pct: 109.0 },
      { label: 'Fat', pct: 100.0 },
      { label: 'Carbs', pct: 100.0 },
      { label: 'Fiber', pct: 103.5 },
      { label: 'Vitamin A', pct: 100.0 },
      { label: 'Vitamin B1', pct: 102.6 },
      { label: 'Vitamin B2', pct: 118.1 },
      { label: 'Vitamin B3', pct: 104.3 },
      { label: 'Vitamin B5', pct: 101.7 },
      { label: 'Vitamin B6', pct: 101.7 },
      { label: 'Folate', pct: 126.6 },
      { label: 'Vitamin B12', pct: 100.0 },
      { label: 'Vitamin C', pct: 110.1 },
      { label: 'Vitamin E', pct: 117.9 },
      { label: 'Calcium', pct: 113.9 },
      { label: 'Iron', pct: 104.7 },
      { label: 'Magnesium', pct: 102.6 },
      { label: 'Phosphorus', pct: 119.6 },
      { label: 'Potassium', pct: 100.0 },
      { label: 'Sodium', pct: 66.3 },
      { label: 'Zinc', pct: 100.0 },
      { label: 'Copper', pct: 110.5 },
      { label: 'Manganese', pct: 103.5 },
      { label: 'Selenium', pct: 100.0 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'The Full Progression' },

    { type: 'text', value: 'K is the number of foods. The number next to each bar is the RMSE (root mean square error) of all 26 nutrient percentages from 100% DV. Lower means the diet is closer to perfectly meeting every nutrient target. K=2 spikes because duck eggs push a few nutrients into the thousands of percent; the optimizer doesn\'t penalize that (no upper limit from food), but the RMSE captures the raw deviation.' },

    { type: 'progress', items: [
      { k: 1, rmse: 121.6, label: 'Quinoa' },
      { k: 2, rmse: 335.8, label: 'Parsnip, Duck Egg' },
      { k: 3, rmse: 98.4, label: 'Whole Wheat Flour, Egg Yolk, Arugula' },
      { k: 4, rmse: 43.8, label: 'Arugula, Avocado, Cornmeal, Skim Milk' },
      { k: 5, rmse: 31.6, label: 'Arugula, Pork Belly, Cornmeal, Yogurt, Yam' },
      { k: 6, rmse: 25.9, label: 'Sour Cream, Arugula, Yam, Eye of Round, Cornmeal, Date' },
      { k: 7, rmse: 19.1, label: 'Ricotta, Corn, Avocado, Durum Wheat, Pumpkin, Plantain, Turmeric' },
      { k: 8, rmse: 15.9, label: 'Ricotta, Yam, Avocado, Durum Wheat, Pumpkin, Plantain, Samphire, Rye Flour' },
    ]},

    { type: 'callout', tone: 'caveat', title: 'Caveats', value: 'This is pure nutrient math; no consideration of palatability, cost, or food safety. 28-40 cups of arugula daily is a lot of arugula. Sodium landing under 100% is actually healthy since 2,300mg is an upper limit; sugars landing low is similarly a positive. The RMSE at K=2 spikes because duck eggs push B12 to 1,695% and selenium to 525%; the asymmetric penalty doesn\'t penalize this (no UL from food) but the RMSE-from-100% metric captures the raw deviation. K>=4 uses greedy search with 10 random restarts, finding a local optimum.' },

  ],
};

export default article;
