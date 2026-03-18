import type { ResearchArticle } from '../research-articles';

const article: ResearchArticle = {
  slug: 'vegetarian-protein',
  title: 'How can Vegetarians optimize their protein intake?',
  date: '2026-03-16',
  summary: 'Analyzing 371 vegetarian foods across 26 nutrients to find the most practical protein sources, the true caloric cost of plant protein at realistic intake levels, and what separates lacto-ovo vegetarians from vegans nutritionally.',
  tags: ['protein', 'vegetarian', 'nutrient density', 'meal planning'],
  content: [
    { type: 'callout', tone: 'insight', title: 'TLDR', value: 'Protein is not the problem. Egg whites deliver 21g of protein per 100 calories, beating turkey breast (20.8g) and chicken breast (18.8g). Even at 70g daily -- the amount many adults should target -- the top vegetarian sources cost under 30% of daily calories. The real nutritional risks are vitamin B12 (0.33x meat density), vitamin D (0.20x), and niacin (0.34x). For vegans, these gaps widen: tofu and lentils are strong, but B12 supplementation is non-negotiable.' },

    { type: 'text', value: 'The most common question vegetarians hear: "where do you get your protein?" I ran the numbers across all 371 vegetarian foods in our database (everything except beef, pork, poultry, lamb, and fish) to answer it. But the answer turns out to be less interesting than the follow-up questions: how much protein do you actually need, which sources are practical for daily cooking, and what should vegetarians really be worrying about instead?' },

    { type: 'stats', items: [
      { value: '371', label: 'Vegetarian Foods' },
      { value: '21.0g', label: 'Best Protein/100kcal' },
      { value: '17%', label: 'Daily Cal for 70g Protein' },
      { value: '136%', label: 'Protein DV at K=8' },
    ]},

    { type: 'callout', tone: 'method', title: 'Method', value: 'Protein efficiency is measured as grams of protein per 100 calories (not per 100g of food weight). This normalizes for water content: spinach looks protein-rich per calorie but you\'d need 1.7kg to hit 50g. Caloric cost asks: what fraction of a 2,000 calorie day goes to protein from this single source? The optimizer uses the same L-BFGS-B algorithm from the Minimum Viable Diet study, restricted to vegetarian foods only, with pre-filtering to the top 80 foods by single-food loss.' },

    { type: 'divider' },

    { type: 'heading', value: 'The Protein Density Ranking' },

    { type: 'text', value: 'Protein per 100 calories is the metric that matters. Per-weight rankings are misleading because a food that\'s 90% water looks dilute by weight but may be extremely protein-efficient per calorie. Egg whites dominate: 21g of protein per 100 calories, meaning you\'d hit the full 50g daily value in just 239 calories, 12% of a standard day.' },

    { type: 'bars', title: 'Top 10: Protein per 100 calories (vegetarian)', items: [
      { label: 'Egg White', pct: 21.0 },
      { label: 'Greek Yogurt (Nonfat)', pct: 17.3 },
      { label: 'Mushroom (White)', pct: 14.0 },
      { label: 'Cremini Mushroom', pct: 13.9 },
      { label: 'Alfalfa Sprouts', pct: 13.8 },
      { label: 'Fresh Cheese (Low-fat)', pct: 13.5 },
      { label: 'Spinach', pct: 12.4 },
      { label: 'Nori Seaweed', pct: 12.0 },
      { label: 'Tofu (Firm)', pct: 12.0 },
      { label: 'Turnip Greens', pct: 11.8 },
    ]},

    { type: 'text', value: 'Half the top 10 are vegetables. But protein density per calorie is deceiving for low-calorie foods. Mushrooms deliver 14g of protein per 100 calories, but at 22 calories per 100g, you\'d need 2.3kg of mushrooms to hit 50g of protein. The next section filters for foods you can actually build a diet around.' },

    { type: 'divider' },

    { type: 'heading', value: 'Practical Protein Sources' },

    { type: 'text', value: 'Filtering the database for foods that deliver meaningful protein per realistic serving -- enough that you could plausibly eat your way to 50-70g daily without consuming kilograms of leafy greens. These are the foods vegetarians should actually reach for.' },

    { type: 'bars', title: 'Protein per 100 kcal (practical sources only)', items: [
      { label: 'Egg White', pct: 21.0 },
      { label: 'Greek Yogurt (Nonfat)', pct: 17.3 },
      { label: 'Tofu (Firm)', pct: 12.0 },
      { label: 'Cottage Cheese', pct: 11.3 },
      { label: 'Edamame', pct: 9.8 },
      { label: 'Egg (Whole)', pct: 8.9 },
      { label: 'Lentil', pct: 7.0 },
      { label: 'Black Bean', pct: 6.3 },
      { label: 'Chickpea', pct: 5.4 },
    ]},

    { type: 'text', value: 'Egg whites and Greek yogurt lead on efficiency, but the bottom half of this list is where most vegetarians actually get their protein. Lentils, black beans, and chickpeas are the workhorses of plant-based cooking: cheap, shelf-stable, high in fiber, and versatile enough to appear in every meal. Their protein efficiency per calorie is moderate (5-7g per 100 kcal), but their volume per serving is realistic. One cup of cooked lentils delivers roughly 18g of protein -- over a third of the 50g DV in a single bowl of soup.' },

    { type: 'divider' },

    { type: 'heading', value: 'How Much Protein Do You Actually Need?' },

    { type: 'text', value: 'The FDA daily value of 50g assumes a sedentary adult at about 68kg (150 lbs), calculated at roughly 0.8g per kg of body weight. For an 80kg (176 lb) person, that formula gives 64g. For an active person at the same weight, many guidelines recommend 1.0-1.2g per kg, or 80-96g. The 50g DV is a regulatory floor, not a target.' },

    { type: 'bars', title: 'Calories to hit 50g protein (% of 2,000 kcal day)', items: [
      { label: 'Egg White', pct: 12 },
      { label: 'Greek Yogurt (Nonfat)', pct: 14 },
      { label: 'Fresh Cheese (Low-fat)', pct: 18 },
      { label: 'Tofu (Firm)', pct: 21 },
      { label: 'Cottage Cheese', pct: 22 },
      { label: 'Edamame', pct: 25 },
      { label: 'Greek Yogurt (Whole)', pct: 27 },
      { label: 'Parmesan', pct: 27 },
      { label: 'Fava Bean (Fresh)', pct: 27 },
      { label: 'Egg (Whole)', pct: 28 },
    ]},

    { type: 'text', value: 'At 50g, every food in the top 10 costs under 30% of daily calories. But 50g is the floor. Scaling to 70g -- a more realistic target for most adults over 68kg:' },

    { type: 'bars', title: 'Calories to hit 70g protein (% of 2,000 kcal day)', items: [
      { label: 'Egg White', pct: 17 },
      { label: 'Greek Yogurt (Nonfat)', pct: 20 },
      { label: 'Tofu (Firm)', pct: 29 },
      { label: 'Cottage Cheese', pct: 31 },
      { label: 'Edamame', pct: 35 },
      { label: 'Egg (Whole)', pct: 39 },
      { label: 'Lentil', pct: 50 },
    ]},

    { type: 'text', value: 'Even at 70g, the top four sources cost under a third of daily calories. Lentils hit 50%, which is steep from a single source -- but no one eats only lentils. Combining two or three sources (Greek yogurt at breakfast, tofu at dinner, edamame as a snack) covers 70g while leaving most of the caloric budget for everything else.' },

    { type: 'divider' },

    { type: 'heading', value: 'By Food Type' },

    { type: 'text', value: 'Averaging across all foods in each category reveals the protein hierarchy. Eggs lead on efficiency, but legumes offer the best combination of protein density and volume. Nuts and seeds are protein-rich by weight but calorie-dense, pushing their per-calorie efficiency below grains.' },

    { type: 'bars', title: 'Average protein per 100 kcal by type', items: [
      { label: 'Eggs', pct: 9.2 },
      { label: 'Legumes', pct: 7.3 },
      { label: 'Dairy', pct: 6.5 },
      { label: 'Vegetables', pct: 6.2 },
      { label: 'Spices', pct: 4.6 },
      { label: 'Grains', pct: 3.2 },
      { label: 'Nuts & Seeds', pct: 3.0 },
      { label: 'Fruit', pct: 1.7 },
    ]},

    { type: 'callout', tone: 'insight', title: 'The Legume Advantage', value: 'Legumes are the protein workhorse of vegetarian diets. Their median caloric cost for 50g protein is 715 calories (36% of daily intake), close to dairy\'s 845 calories. But unlike dairy, legumes bring iron (3.31x meat density), magnesium (2.93x), and folate (3.70x). Tofu leads the category at 417 calories for 50g protein.' },

    { type: 'divider' },

    { type: 'heading', value: 'Head-to-Head: Vegetarian vs Common Meats' },

    { type: 'text', value: 'Comparing the best vegetarian sources against the meats people actually eat -- chicken, turkey, and salmon -- rather than obscure lean fish like forkbeard or ling. The results are closer than most people expect.' },

    { type: 'bars', title: 'Protein per 100 kcal: Vegetarian vs common meats', items: [
      { label: 'Egg White', pct: 21.0 },
      { label: 'Turkey Breast', pct: 20.8 },
      { label: 'Chicken Breast', pct: 18.8 },
      { label: 'Greek Yogurt (Nonfat)', pct: 17.3 },
      { label: 'Tofu (Firm)', pct: 12.0 },
      { label: 'Cottage Cheese', pct: 11.3 },
      { label: 'Salmon (Atlantic)', pct: 9.8 },
      { label: 'Edamame', pct: 9.8 },
    ]},

    { type: 'text', value: 'Egg whites beat turkey breast. Greek yogurt nearly matches chicken breast. By the time you reach salmon -- the most popular "healthy" fish -- vegetarian sources like tofu and cottage cheese are already ahead. A protein efficiency gap between vegetarian and meat diets exists only at the extreme top of the ranking (lean white fish at 24-25g per 100 kcal). Against the meats people actually eat, vegetarian sources are fully competitive.' },

    { type: 'divider' },

    { type: 'heading', value: 'Lacto-Ovo vs Vegan' },

    { type: 'text', value: 'The nutritional gap between lacto-ovo vegetarians and vegans is larger than the gap between lacto-ovo vegetarians and meat-eaters. Eggs and dairy do enormous work: they provide essentially all the B12, most of the vitamin D, and the two most protein-efficient vegetarian sources (egg whites at 21.0g and Greek yogurt at 17.3g per 100 kcal). Removing them changes the picture entirely.' },

    { type: 'bars', title: 'Calories to hit 50g protein, vegan sources (% of 2,000 kcal day)', items: [
      { label: 'Tofu (Firm)', pct: 21 },
      { label: 'Edamame', pct: 25 },
      { label: 'Lentil', pct: 36 },
      { label: 'Black Bean', pct: 40 },
      { label: 'Chickpea', pct: 46 },
    ]},

    { type: 'text', value: 'Protein is still manageable for vegans: tofu at 21% of daily calories for 50g is efficient by any standard. But the practical ceiling drops. A lacto-ovo vegetarian can hit 50g of protein for 239-290 calories (egg whites or Greek yogurt). A vegan needs at least 417 calories from tofu. The real vegan risk, though, is not protein.' },

    { type: 'callout', tone: 'caveat', title: 'The Vegan Gap', value: 'Vitamin B12 is the critical difference. Eggs and dairy are the only meaningful vegetarian sources of B12; remove them and dietary B12 drops to near zero. Nutritional yeast and fortified foods can help, but no whole plant food provides reliable B12. Supplementation is not optional for vegans -- it is medically necessary. Vitamin D follows a similar pattern: the few vegetarian sources (eggs, fortified dairy) are all animal-derived.' },

    { type: 'divider' },

    { type: 'heading', value: 'The Real Risk: It\'s Not Protein' },

    { type: 'text', value: 'Comparing the average nutrient density of all 371 vegetarian foods against all 173 meat and fish foods reveals the actual nutritional gaps. Protein is fourth on the risk list. The top three are all micronutrients.' },

    { type: 'bars', title: 'Vegetarian avg / Meat avg (lower = bigger gap)', items: [
      { label: 'Vitamin D', pct: 20 },
      { label: 'Vitamin B12', pct: 33 },
      { label: 'Niacin (B3)', pct: 34 },
      { label: 'Protein', pct: 43 },
      { label: 'Vitamin A', pct: 45 },
      { label: 'Pantothenic Acid (B5)', pct: 54 },
      { label: 'Selenium', pct: 55 },
      { label: 'Zinc', pct: 71 },
    ]},

    { type: 'callout', tone: 'caveat', title: 'The B12 Problem', value: 'Vitamin B12 is the one nutrient that vegetarians genuinely struggle with. The average vegetarian food contains 0.33x the B12 of the average meat food. Only eggs and dairy provide meaningful B12. For vegans (no eggs or dairy), B12 supplementation is essentially mandatory. Even for lacto-ovo vegetarians, the optimizer leans heavily on eggs and dairy to hit 100% B12.' },

    { type: 'text', value: 'The flip side is just as revealing. Vegetarian foods crush meat on fiber (infinite ratio, meat has essentially zero), manganese (21x), calcium (7.4x), vitamin C (4.2x), folate (3.7x), vitamin E (3.6x), iron (3.3x), and magnesium (2.9x). A well-planned vegetarian diet doesn\'t just match meat on most nutrients; it exceeds it on many. But those iron and zinc advantages come with a significant asterisk.' },

    { type: 'divider' },

    { type: 'heading', value: 'Bioavailability: What the Numbers Don\'t Show' },

    { type: 'text', value: 'The nutrient density comparisons above use raw USDA values: total milligrams of iron, zinc, or protein per 100 calories. But the body does not absorb all nutrients equally from all sources. Three adjustments matter for vegetarians.' },

    { type: 'text', value: 'Iron: Plant foods contain non-heme iron, which absorbs at 2-20% depending on the meal. Meat contains heme iron, which absorbs at 15-35%. The raw data shows vegetarian foods at 3.3x the iron density of meat. After adjusting for typical absorption rates, that advantage shrinks to roughly 1x -- approximate parity, not a threefold lead. Vegetarians are not iron-deficient by default, but they are not iron-rich either.' },

    { type: 'text', value: 'Zinc: Phytates in legumes, grains, and nuts bind zinc and reduce absorption by 30-40%. The raw data shows vegetarian foods at 0.71x the zinc density of meat. After the phytate adjustment, effective zinc drops closer to 0.45x. This is a genuine gap that the raw numbers obscure.' },

    { type: 'text', value: 'Protein quality: Not all protein is equal at the amino acid level. Most plant proteins are incomplete -- low in one or more essential amino acids. Soy (tofu, edamame) is the exception, scoring near 1.0 on the PDCAAS scale (equivalent to meat). Legumes score 0.6-0.7, grains 0.4-0.5. But combining grains and legumes in the same day covers all essential amino acids. Rice and beans is not folk wisdom; it is biochemistry.' },

    { type: 'callout', tone: 'insight', title: 'Practical Pairings', value: 'Three habits close the bioavailability gap. First, eat vitamin C with iron-rich foods: bell pepper, tomato, or citrus alongside a lentil dish boosts non-heme iron absorption 2-6x. Second, soak or sprout beans and grains before cooking to reduce phytates by 20-50%, freeing up zinc and iron. Third, combine grains and legumes (rice and beans, hummus and pita, lentil soup with bread) to create a complete amino acid profile.' },

    { type: 'divider' },

    { type: 'heading', value: 'A Realistic Day' },

    { type: 'text', value: 'The optimizer produces mathematically optimal but impractical diets (33 cups of arugula). Here is what a realistic lacto-ovo vegetarian day looks like using foods from the database, hitting roughly 75g of protein without unusual quantities of anything.' },

    { type: 'foods', calories: '~1,850', items: [
      { name: 'Egg (Scrambled)', servings: '2/day', detail: '1 large (61g)' },
      { name: 'Greek Yogurt (Nonfat)', servings: '1/day', detail: '1 cup (170g)' },
      { name: 'Tofu (Firm)', servings: '2/day', detail: '100g' },
      { name: 'Lentil', servings: '1/day', detail: '1/4 cup dry (48g)' },
      { name: 'Avocado', servings: '0.5/day', detail: '1 medium (150g)' },
      { name: 'Arugula', servings: '3/day', detail: '1 cup (20g)' },
      { name: 'Almond', servings: '1/day', detail: '1 oz (28g)' },
      { name: 'Whole Wheat Flour', servings: '1/day', detail: '100g' },
    ]},

    { type: 'text', value: 'Two eggs and a cup of Greek yogurt at breakfast delivers roughly 30g of protein. A tofu stir-fry with whole wheat noodles adds another 25g. Lentil soup for dinner with arugula salad and half an avocado covers the remainder, with almonds filling any gap. No single food is doing heroic work; the protein distributes across the day from multiple practical sources. B12 comes from the eggs and yogurt. Iron comes from lentils and tofu, paired naturally with the vitamin C in arugula and any tomato or citrus used in cooking.' },

    { type: 'divider' },

    { type: 'heading', value: 'What the Optimizer Finds' },

    { type: 'text', value: 'Running the same constrained optimization from the Minimum Viable Diet study, restricted to vegetarian foods only. At K=8 foods, the optimizer hits 9 of 26 nutrients in range (RMSE 46.7), compared to 23 of 26 (RMSE 15.9) for the unrestricted diet. The gap comes almost entirely from overshooting: protein (136%), fiber (167%), folate (226%), and magnesium (175%) all land well above 120%. Protein never falls below 100% at any food count -- it is structurally impossible for the optimizer to undershoot it given the foods available.' },

    { type: 'foods', calories: '1,959', items: [
      { name: 'Coconut', servings: '0.70/day (4.9/wk)', detail: '1 cup shredded (80g)' },
      { name: 'Arugula', servings: '33.27/day (232.9/wk)', detail: '1 cup (20g)' },
      { name: 'Avocado', servings: '0.80/day (5.6/wk)', detail: '1 medium (150g)' },
      { name: 'Barley Flour', servings: '2.34/day (16.4/wk)', detail: '100g' },
      { name: 'Duck Egg', servings: '0.43/day (3.0/wk)', detail: '1 egg (70g)' },
      { name: 'Egg (Scrambled)', servings: '1.65/day (11.5/wk)', detail: '1 large (61g)' },
      { name: 'Almond', servings: '0.81/day (5.7/wk)', detail: '1 oz (28g)' },
      { name: 'Corn (Dried)', servings: '0.77/day (5.4/wk)', detail: '100g' },
    ]},

    { type: 'bars', title: 'K=8; 9 of 26 in range', items: [
      { label: 'Calories', pct: 98.0 },
      { label: 'Protein', pct: 135.8 },
      { label: 'Fat', pct: 100.0 },
      { label: 'Carbs', pct: 100.0 },
      { label: 'Fiber', pct: 167.0 },
      { label: 'Folate', pct: 225.5 },
      { label: 'Vitamin B12', pct: 100.0 },
      { label: 'Vitamin E', pct: 100.0 },
      { label: 'Calcium', pct: 100.0 },
      { label: 'Selenium', pct: 100.0 },
    ]},

    { type: 'progress', items: [
      { k: 4, rmse: 59.0, label: 'Egg, Avocado, Wheat Flour, Arugula' },
      { k: 5, rmse: 53.0, label: 'Barley, Arugula, Avocado, Almond, Egg' },
      { k: 6, rmse: 50.0, label: 'Barley, Arugula, Avocado, Almond, Egg, Duck Egg' },
      { k: 7, rmse: 47.4, label: 'Coconut, Arugula, Avocado, Barley, Duck Egg, Egg, Almond' },
      { k: 8, rmse: 46.7, label: 'Coconut, Arugula, Avocado, Barley, Duck Egg, Egg, Almond, Corn' },
    ]},

    { type: 'callout', tone: 'insight', title: 'The Pattern', value: 'Every optimized vegetarian diet follows the same template: a grain (barley or wheat), a leafy green (arugula, always), a fat source (avocado + coconut or almonds), and eggs for B12. No legumes appear in the optimizer\'s top picks despite their high protein density. The algorithm values barley flour and arugula\'s broader micronutrient coverage over legumes\' concentrated protein. Protein is never the bottleneck.' },

    { type: 'callout', tone: 'caveat', title: 'Caveats', value: 'This analysis uses USDA nutrient data per 100g, not bioavailability-adjusted values. The bioavailability section above explains why raw numbers overstate iron and zinc for vegetarians and why protein quality varies by source. The optimizer does not model absorption rates, amino acid profiles, or antinutrient interactions. The realistic day section is meant to complement these optimizer results with practical guidance.' },
  ],
};

export default article;
