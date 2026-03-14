import type { ResearchArticle } from '../research-articles';

const article: ResearchArticle = {
  slug: 'optimal-diet-by-food-count',
  title: 'The Mathematically Perfect Diet',
  date: '2026-03-13',
  summary: 'Using optimization across 262 foods and 26 nutrients, we found the best possible diet for every food count from 1 to 10. By 8 foods, 25 of 26 nutrients land in range with zero overages.',
  tags: ['optimization', 'nutrient density', 'daily values'],
  content: [
    { type: 'text', value: 'What if you could only eat one food forever? What about three? We ran an optimization algorithm across our entire 262-food database to find the exact combination of foods and daily servings that hits 100% of every Daily Value \u2014 penalizing both deficiency and excess equally.' },

    { type: 'callout', tone: 'method', title: 'Algorithm', value: 'For each food count K, non-negative least squares (NNLS) optimizes daily servings to minimize the Root Mean Squared Error of %DV from 100% across 26 nutrients. K=1 and K=2 are exhaustive. K=3 searches 161,700 combinations from the top 100 foods. K\u22654 uses greedy forward selection with swap-based local search.' },

    { type: 'callout', tone: 'caveat', title: 'Excluded from scoring', value: 'Vitamin D (sparse data) and Vitamin K (missing for 87% of foods) are excluded from the optimization. Both are displayed in results but don\'t influence food selection.' },

    { type: 'divider' },

    { type: 'heading', value: 'K=1: The Single Best Food' },

    { type: 'foods', calories: '433', items: [
      { name: 'Green Bean', servings: '12.71/day (89.0/wk)', detail: '1 cup (110g)' },
    ]},

    { type: 'text', value: '8 of 26 nutrients in range. Green bean nails fiber, B vitamins, and Vitamin C \u2014 but has zero B12, almost no fat, and only 433 calories. No single food comes close to complete.' },

    { type: 'bars', title: 'K=1 \u2014 8 of 26 in range', items: [
      { label: 'Calories', pct: 21.7 },
      { label: 'Protein', pct: 51.2 },
      { label: 'Fat', pct: 3.9 },
      { label: 'Fiber', pct: 134.8 },
      { label: 'Vitamin B12', pct: 0 },
      { label: 'Vitamin C', pct: 189.5 },
      { label: 'Calcium', pct: 39.8 },
      { label: 'Iron', pct: 80.0 },
      { label: 'Potassium', pct: 62.8 },
      { label: 'Selenium', pct: 15.3 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=2: Adding Animal Fat' },

    { type: 'foods', calories: '1,108', items: [
      { name: 'Green Bean', servings: '10.38/day (72.7/wk)', detail: '1 cup (110g)' },
      { name: 'Cheddar', servings: '6.56/day (46.0/wk)', detail: '1 oz (28g)' },
    ]},

    { type: 'text', value: '11 of 26 in range. Cheddar fills in fat, Vitamin A, calcium, phosphorus, zinc, and selenium. But carbs crater to 30% and calories are still low. The pattern is already obvious: plant foods and animal foods cover each other\'s blind spots.' },

    { type: 'bars', title: 'K=2 \u2014 11 of 26 in range', items: [
      { label: 'Calories', pct: 55.4 },
      { label: 'Fat', pct: 82.9 },
      { label: 'Carbs', pct: 30.4 },
      { label: 'Vitamin A', pct: 98.1 },
      { label: 'Vitamin B12', pct: 67.4 },
      { label: 'Vitamin E', pct: 40.8 },
      { label: 'Calcium', pct: 133.0 },
      { label: 'Iron', pct: 67.0 },
      { label: 'Potassium', pct: 54.3 },
      { label: 'Selenium', pct: 107.0 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=3: The Chili Powder Surprise' },

    { type: 'foods', calories: '1,398', items: [
      { name: 'Corn', servings: '8.69/day (60.8/wk)', detail: '1 ear (90g)' },
      { name: 'Cheddar', servings: '5.37/day (37.6/wk)', detail: '1 oz (28g)' },
      { name: 'Chili Powder', servings: '14.30/day (100.1/wk)', detail: '1 tsp (2.7g)' },
    ]},

    { type: 'text', value: '17 of 26 in range. The algorithm drops green bean entirely, swapping in corn for its calorie base. Nobody expected chili powder here. 14 teaspoons a day (just 39g) is loaded with Vitamin A, E, B6, iron, and copper.' },

    { type: 'bars', title: 'K=3 \u2014 17 of 26 in range', items: [
      { label: 'Calories', pct: 69.9 },
      { label: 'Protein', pct: 134.5 },
      { label: 'Fat', pct: 85.8 },
      { label: 'Carbs', pct: 61.3 },
      { label: 'Fiber', pct: 103.8 },
      { label: 'Vitamin A', pct: 115.4 },
      { label: 'Vitamin B12', pct: 55.2 },
      { label: 'Vitamin C', pct: 59.4 },
      { label: 'Iron', pct: 61.0 },
      { label: 'Calcium', pct: 93.3 },
      { label: 'Potassium', pct: 63.4 },
      { label: 'Zinc', pct: 98.9 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=4: Filling the Calorie Gap' },

    { type: 'foods', calories: '1,653', items: [
      { name: 'Corn', servings: '5.79/day (40.6/wk)', detail: '1 ear (90g)' },
      { name: 'Cheddar', servings: '5.63/day (39.4/wk)', detail: '1 oz (28g)' },
      { name: 'Chili Powder', servings: '13.70/day (95.9/wk)', detail: '1 tsp (2.7g)' },
      { name: 'Plantain', servings: '1.67/day (11.7/wk)', detail: '1 medium (179g)' },
    ]},

    { type: 'text', value: '20 of 26 in range. Plantain brings calories to 83%, carbs to 83%, and adds potassium and Vitamin C. The remaining gaps: B12 (58%), iron (65%), potassium (75%). Protein, B2, and B5 run slightly over.' },

    { type: 'bars', title: 'K=4 \u2014 20 of 26 in range', items: [
      { label: 'Calories', pct: 82.7 },
      { label: 'Protein', pct: 127.9 },
      { label: 'Carbs', pct: 83.2 },
      { label: 'Vitamin B5', pct: 128.2 },
      { label: 'Vitamin B12', pct: 57.8 },
      { label: 'Vitamin C', pct: 106.8 },
      { label: 'Iron', pct: 64.5 },
      { label: 'Potassium', pct: 75.3 },
      { label: 'Copper', pct: 117.1 },
      { label: 'Selenium', pct: 100.5 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=5: B12' },

    { type: 'foods', calories: '1,592', items: [
      { name: 'Corn', servings: '5.81/day (40.7/wk)', detail: '1 ear (90g)' },
      { name: 'Cheddar', servings: '5.06/day (35.4/wk)', detail: '1 oz (28g)' },
      { name: 'Chili Powder', servings: '13.93/day (97.5/wk)', detail: '1 tsp (2.7g)' },
      { name: 'Plantain', servings: '1.64/day (11.5/wk)', detail: '1 medium (179g)' },
      { name: 'Mussel', servings: '0.12/day (0.8/wk)', detail: '3 oz (85g)' },
    ]},

    { type: 'text', value: '19 of 26 in range. Just one mussel serving every 8 days fixes B12 entirely (58% \u2192 101%). But the optimizer redistributes servings, dropping calories and fat slightly below range. A tradeoff worth making.' },

    { type: 'bars', title: 'K=5 \u2014 19 of 26 in range', items: [
      { label: 'Calories', pct: 79.6 },
      { label: 'Protein', pct: 122.7 },
      { label: 'Fat', pct: 77.9 },
      { label: 'Vitamin B5', pct: 127.4 },
      { label: 'Vitamin B12', pct: 101.2 },
      { label: 'Vitamin C', pct: 106.7 },
      { label: 'Iron', pct: 66.9 },
      { label: 'Potassium', pct: 75.6 },
      { label: 'Copper', pct: 117.6 },
      { label: 'Manganese', pct: 94.8 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=6: Iron' },

    { type: 'foods', calories: '1,539', items: [
      { name: 'Corn', servings: '5.88/day (41.2/wk)', detail: '1 ear (90g)' },
      { name: 'Cheddar', servings: '4.88/day (34.1/wk)', detail: '1 oz (28g)' },
      { name: 'Chili Powder', servings: '12.59/day (88.1/wk)', detail: '1 tsp (2.7g)' },
      { name: 'Plantain', servings: '1.42/day (10.0/wk)', detail: '1 medium (179g)' },
      { name: 'Clam', servings: '0.12/day (0.9/wk)', detail: '3 oz (85g)' },
      { name: 'Dill (Dried)', servings: '12.65/day (88.6/wk)', detail: '1 tsp (1.0g)' },
    ]},

    { type: 'text', value: '20 of 26 in range. Clam swaps in for mussel (better iron numbers), and dried dill enters at just 1g per teaspoon. Iron jumps from 67% to 95%. Calories and fat are still the problem.' },

    { type: 'bars', title: 'K=6 \u2014 20 of 26 in range', items: [
      { label: 'Calories', pct: 76.9 },
      { label: 'Protein', pct: 124.5 },
      { label: 'Fat', pct: 75.6 },
      { label: 'Carbs', pct: 79.8 },
      { label: 'Vitamin B12', pct: 99.5 },
      { label: 'Iron', pct: 95.0 },
      { label: 'Calcium', pct: 102.2 },
      { label: 'Potassium', pct: 79.1 },
      { label: 'Manganese', pct: 98.3 },
      { label: 'Selenium', pct: 94.5 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=7: Lard Enters the Chat' },

    { type: 'foods', calories: '1,725', items: [
      { name: 'Corn', servings: '5.97/day (41.8/wk)', detail: '1 ear (90g)' },
      { name: 'Cheddar', servings: '4.37/day (30.6/wk)', detail: '1 oz (28g)' },
      { name: 'Chili Powder', servings: '12.80/day (89.6/wk)', detail: '1 tsp (2.7g)' },
      { name: 'Plantain', servings: '1.37/day (9.6/wk)', detail: '1 medium (179g)' },
      { name: 'Clam', servings: '0.14/day (1.0/wk)', detail: '3 oz (85g)' },
      { name: 'Dill (Dried)', servings: '13.63/day (95.4/wk)', detail: '1 tsp (1.0g)' },
      { name: 'Lard', servings: '2.11/day (14.8/wk)', detail: '1 tbsp (13g)' },
    ]},

    { type: 'text', value: '23 of 26 in range. Lard is here for the math, not the flavor. It adds calories and fat without extra protein, which is already running high. Calories jump to 86%, fat to 105%. Only carbs (79%), potassium (79%), and B5 (121%) remain out.' },

    { type: 'bars', title: 'K=7 \u2014 23 of 26 in range', items: [
      { label: 'Calories', pct: 86.3 },
      { label: 'Protein', pct: 118.8 },
      { label: 'Fat', pct: 105.0 },
      { label: 'Carbs', pct: 79.2 },
      { label: 'Vitamin B5', pct: 121.2 },
      { label: 'Vitamin B12', pct: 100.8 },
      { label: 'Iron', pct: 98.0 },
      { label: 'Potassium', pct: 79.3 },
      { label: 'Copper', pct: 115.0 },
      { label: 'Selenium', pct: 88.4 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'K=8: The Peak' },

    { type: 'foods', calories: '1,713', items: [
      { name: 'Corn', servings: '5.27/day (36.9/wk)', detail: '1 ear (90g)' },
      { name: 'Cheddar', servings: '4.43/day (31.0/wk)', detail: '1 oz (28g)' },
      { name: 'Chili Powder', servings: '12.65/day (88.6/wk)', detail: '1 tsp (2.7g)' },
      { name: 'Plantain', servings: '1.36/day (9.5/wk)', detail: '1 medium (179g)' },
      { name: 'Clam', servings: '0.14/day (1.0/wk)', detail: '3 oz (85g)' },
      { name: 'Dill (Dried)', servings: '12.48/day (87.4/wk)', detail: '1 tsp (1.0g)' },
      { name: 'Lard', servings: '2.15/day (15.0/wk)', detail: '1 tbsp (13g)' },
      { name: 'Beet', servings: '1.05/day (7.4/wk)', detail: '1 beet (82g)' },
    ]},

    { type: 'text', value: '25 of 26 in range, zero overages. Beet brings folate from 84% to 101% and pulls most other numbers closer to center. Only carbs at 78% stays out. Adding foods 9 and 10 doesn\'t improve the count. This is the peak.' },

    { type: 'bars', title: 'K=8 \u2014 25 of 26 in range, 0 over', items: [
      { label: 'Calories', pct: 85.7 },
      { label: 'Protein', pct: 117.6 },
      { label: 'Fat', pct: 105.3 },
      { label: 'Carbs', pct: 77.6 },
      { label: 'Fiber', pct: 110.2 },
      { label: 'Sugars', pct: 87.8 },
      { label: 'Vitamin A', pct: 102.7 },
      { label: 'Vitamin B1', pct: 98.2 },
      { label: 'Vitamin B2', pct: 110.6 },
      { label: 'Vitamin B3', pct: 90.2 },
      { label: 'Vitamin B5', pct: 114.8 },
      { label: 'Vitamin B6', pct: 99.6 },
      { label: 'Folate', pct: 101.3 },
      { label: 'Vitamin B12', pct: 100.7 },
      { label: 'Vitamin C', pct: 102.4 },
      { label: 'Vitamin E', pct: 97.4 },
      { label: 'Calcium', pct: 96.1 },
      { label: 'Iron', pct: 96.5 },
      { label: 'Magnesium', pct: 104.3 },
      { label: 'Phosphorus', pct: 103.7 },
      { label: 'Potassium', pct: 80.6 },
      { label: 'Sodium', pct: 87.7 },
      { label: 'Zinc', pct: 86.6 },
      { label: 'Copper', pct: 117.3 },
      { label: 'Manganese', pct: 105.9 },
      { label: 'Selenium', pct: 89.4 },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'The Full Progression' },

    { type: 'progress', items: [
      { k: 1, rmse: 56.1, label: 'Green Bean' },
      { k: 2, rmse: 33.8, label: '+ Cheddar' },
      { k: 3, rmse: 22.4, label: 'Corn replaces Green Bean, + Chili Powder' },
      { k: 4, rmse: 17.8, label: '+ Plantain' },
      { k: 5, rmse: 15.1, label: '+ Mussel' },
      { k: 6, rmse: 13.3, label: 'Clam replaces Mussel, + Dill' },
      { k: 7, rmse: 11.5, label: '+ Lard' },
      { k: 8, rmse: 10.7, label: '+ Beet' },
    ]},

    { type: 'divider' },

    { type: 'heading', value: 'Takeaways' },

    { type: 'callout', tone: 'insight', title: 'Spices dominate', value: 'Chili powder and dried dill appear from K=3 onward. A teaspoon of dried dill weighs 1 gram but moves the needle on iron, calcium, and manganese. Spices win because their nutrients are concentrated into almost nothing.' },

    { type: 'callout', tone: 'insight', title: 'Steep diminishing returns', value: 'The first 3 food choices matter far more than the last 5. Going from 1\u21923 foods cuts RMSE by 60%. Going from 3\u21928 only cuts it by another 52%.' },

    { type: 'callout', tone: 'insight', title: 'Each food fixes one thing', value: 'Cheddar fixes fat. Plantain fixes calories. Mussel/Clam fixes B12. Dill fixes iron. Lard fixes the calorie/fat gap. Beet fixes folate. No food duplicates another\'s job.' },

    { type: 'callout', tone: 'caveat', title: 'Caveats', value: 'This is pure nutrient math \u2014 no consideration of palatability, cost, or food safety. 13 tsp of chili powder daily is technically possible but not pleasant. Sodium landing under 100% is actually healthy since 2,300mg is an upper limit. The greedy search for K\u22654 finds a local optimum, not necessarily the global one.' },
  ],
};

export default article;
