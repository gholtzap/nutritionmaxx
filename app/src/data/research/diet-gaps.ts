import type { ResearchArticle } from '../research-articles';

const article: ResearchArticle = {
  slug: 'whats-missing-from-your-diet',
  title: "What's Actually Missing From Your Diet?",
  date: '2026-03-20',
  summary: 'Running a constrained optimizer against 544 foods for five popular dietary patterns -- Standard American, Mediterranean, Keto, Paleo, and Carnivore -- to find which nutrients each one structurally cannot deliver, even with perfect food selection.',
  tags: ['optimization', 'nutrient density', 'dietary patterns', 'daily values'],
  content: [
    { type: 'callout', tone: 'insight', title: 'TLDR', value: 'Every diet except carnivore can theoretically hit 100% of all daily values with the right food choices. Carnivore has four unfixable gaps: fiber (0%), potassium (46%), vitamin C (55%), and vitamin E (79%). Keto can cover everything -- but only by eating 162g of carbs, more than triple the ketogenic threshold. The bigger story: the gap between what a diet CAN deliver and what its followers actually eat is where the deficiencies live.' },

    { type: 'text', value: 'People are tribal about what they eat. Keto advocates, carnivore adherents, and Mediterranean loyalists all have studies and anecdotes. But there is a question most diet debates skip: given the foods your diet allows, what is the best possible nutritional outcome? Not what you actually eat -- what you could eat if you picked perfectly. The gaps that remain even with perfect selection are structural. They are baked into the rules of the diet itself, and meal planning cannot fix them.' },

    { type: 'callout', tone: 'method', title: 'Method', value: 'For each diet, I defined the allowed food pool by the diet\'s actual rules (e.g., keto excludes grains, legumes, and fruits; paleo excludes grains, legumes, and dairy; carnivore excludes all plants). I then ran the same L-BFGS-B constrained optimizer from the Minimum Viable Diet study, selecting 8 foods and optimizing daily servings to hit 100% of every daily value within 1,800-2,200 calories. The optimizer represents the best-case scenario: if you ate perfectly within your diet\'s rules, what would you still be missing? Volume caps prevent unrealistic quantities (800g/day for most foods, 50g for spices). Vitamin D and K are excluded from scoring due to sparse data.' },

    { type: 'divider' },

    { type: 'heading', value: 'The Structural Gap Report' },

    { type: 'text', value: 'The loss score measures how far a diet\'s best possible 8-food combination falls from perfect nutrient coverage. Lower is better. Mediterranean and SAD are both near zero (loss 0.03 and 0.04). Carnivore cannot come close (loss 979). The gap between those numbers is the gap between "your diet has options" and "your diet has a wall."' },

    { type: 'bars', title: 'Optimizer loss score (lower = better coverage)', items: [
      { label: 'Mediterranean', pct: 1 },
      { label: 'Standard American', pct: 1 },
      { label: 'Paleo', pct: 1 },
      { label: 'Carnivore', pct: 76 },
      { label: 'Keto', pct: 100 },
    ]},

    { type: 'text', value: 'The loss scores for keto (1,293) and carnivore (979) are off the chart compared to the other three (0.03 to 0.06). Keto\'s high loss comes from the optimizer fighting against the carb restriction to salvage micronutrients. Carnivore\'s comes from nutrients that simply do not exist in animal foods.' },

    { type: 'divider' },

    { type: 'heading', value: 'Standard American Diet' },

    { type: 'text', value: 'I defined SAD as: grains, common meats (beef, pork, poultry), dairy, eggs, common produce (root vegetables, nightshades, alliums, leafy greens, common fruits), and cooking fats. No fish, no legumes, no nuts or seeds. 267 foods in the pool.' },

    { type: 'foods', calories: '1,985', items: [
      { name: 'Strawberry Tree Fruit', servings: '1.20/day', detail: '100g' },
      { name: 'Barley Flour', servings: '1.74/day', detail: '100g' },
      { name: 'Ricotta', servings: '1.44/day', detail: '1/2 cup (124g)' },
      { name: 'Leek', servings: '2.46/day', detail: '1 leek (89g)' },
      { name: 'Butter (Unsalted)', servings: '4.10/day', detail: '1 tbsp (14g)' },
      { name: 'Parsnip', servings: '2.47/day', detail: '1 medium (133g)' },
      { name: 'Egg (Whole)', servings: '1.20/day', detail: '1 large (50g)' },
      { name: 'Duck', servings: '0.74/day', detail: '3 oz (85g)' },
    ]},

    { type: 'bars', title: 'SAD optimal: nutrients in range', items: [
      { label: 'Calories', pct: 99 },
      { label: 'Protein', pct: 114 },
      { label: 'Fat', pct: 104 },
      { label: 'Carbs', pct: 100 },
      { label: 'Fiber', pct: 146 },
      { label: 'Vitamin A', pct: 100 },
      { label: 'Vitamin B12', pct: 100 },
      { label: 'Vitamin C', pct: 104 },
      { label: 'Calcium', pct: 101 },
      { label: 'Iron', pct: 103 },
      { label: 'Potassium', pct: 100 },
    ]},

    { type: 'text', value: 'Zero structural gaps. Even without fish, legumes, or nuts, the SAD food pool can hit every daily value -- barley flour for carbs and fiber, ricotta for calcium and B12, leeks for vitamin C and folate, parsnips for potassium. But this looks nothing like an actual American diet. Nobody is eating 2.5 leeks and 175g of barley flour daily.' },

    { type: 'callout', tone: 'insight', title: 'The SAD Paradox', value: 'The Standard American Diet has an optimizer loss of 0.04 -- virtually zero, nearly tied with Mediterranean (0.03). Every nutrient Americans are commonly deficient in (potassium, fiber, vitamin D) is available in foods they already have access to but do not eat. The pool works. The choices are the problem.' },

    { type: 'divider' },

    { type: 'heading', value: 'Mediterranean Diet' },

    { type: 'text', value: 'The Mediterranean pool includes everything: all meats, fish, dairy, eggs, grains, legumes, nuts, seeds, all produce, olive oil. 544 foods -- the full database. This is the control group: maximum possible coverage.' },

    { type: 'foods', calories: '1,994', items: [
      { name: 'Plantain', servings: '1.89/day', detail: '1 medium (179g)' },
      { name: 'Oregano', servings: '10.15/day', detail: '1 tsp (1.8g)' },
      { name: 'Strawberry Tree Fruit', servings: '1.38/day', detail: '100g' },
      { name: 'Butter (Unsalted)', servings: '4.66/day', detail: '1 tbsp (14g)' },
      { name: 'Egg Yolk', servings: '3.02/day', detail: '1 large (17g)' },
      { name: 'Collard Greens', servings: '2.53/day', detail: '1 cup chopped (36g)' },
      { name: 'Brisket', servings: '1.20/day', detail: '3 oz (85g)' },
      { name: 'Cornmeal', servings: '3.89/day', detail: '1/4 cup (30g)' },
    ]},

    { type: 'text', value: 'Zero structural gaps. 19 of 26 nutrients land within 80-120% of their daily value. The optimizer spreads coverage across every food category: starchy fruit, grains, spices, leafy greens, meat, dairy, and eggs.' },

    { type: 'callout', tone: 'insight', title: 'Why Mediterranean Wins', value: 'The Mediterranean diet\'s advantage is not any single food category -- it is that nothing is excluded. Remove any one category (as keto removes grains, paleo removes dairy, carnivore removes plants) and the loss score jumps. Dietary diversity does the work, not any single superfood.' },

    { type: 'divider' },

    { type: 'heading', value: 'Ketogenic Diet' },

    { type: 'text', value: 'Keto rules: no grains, no legumes, no fruit except berries, no starchy vegetables, no peanuts. Foods with more than 10g carbs per serving are excluded. The optimizer is penalized for total carbs above 50g (18% DV). 338 foods in the pool.' },

    { type: 'foods', calories: '1,800', items: [
      { name: 'Butter (Salted)', servings: '4.53/day', detail: '1 tbsp (14g)' },
      { name: 'Ricotta', servings: '2.97/day', detail: '1/2 cup (124g)' },
      { name: 'Blackberry (Wild)', servings: '3.34/day', detail: '100g' },
      { name: 'Scallion', servings: '22.44/day', detail: '1 medium (15g)' },
      { name: 'Shallot', servings: '24.96/day', detail: '1 shallot (10g)' },
      { name: 'Flaxseed', servings: '4.58/day', detail: '1 tbsp (10g)' },
      { name: 'Mushroom (Shiitake)', servings: '1.84/day', detail: '1 cup sliced (145g)' },
      { name: 'Oregano', servings: '5.76/day', detail: '1 tsp (1.8g)' },
    ]},

    { type: 'bars', title: 'Keto optimal: key nutrients', items: [
      { label: 'Calories', pct: 90 },
      { label: 'Protein', pct: 121 },
      { label: 'Fat', pct: 146 },
      { label: 'Carbs', pct: 59 },
      { label: 'Fiber', pct: 199 },
      { label: 'Vitamin C', pct: 154 },
      { label: 'Vitamin E', pct: 137 },
      { label: 'Calcium', pct: 115 },
      { label: 'Iron', pct: 100 },
      { label: 'Potassium', pct: 100 },
      { label: 'Magnesium', pct: 126 },
    ]},

    { type: 'text', value: 'The optimizer cheated. Despite a heavy carb penalty, it landed at 162g of carbohydrates -- more than triple the 50g ketogenic threshold. The carbs came from 25 shallots, 22 scallions, 334g of wild blackberries, and shiitake mushrooms. It decided that missing vitamin C, folate, and potassium was worse than breaking the carb limit.' },

    { type: 'callout', tone: 'caveat', title: 'The Keto Tradeoff', value: 'The central finding for keto: the diet cannot simultaneously stay under 50g of carbs and cover essential micronutrients from whole foods alone. Even with perfect selection across 338 foods, the optimizer breaks the carb budget. Keto dieters who stay under 50g are almost certainly missing vitamin C, folate, potassium, and fiber unless they supplement.' },

    { type: 'divider' },

    { type: 'heading', value: 'Paleo Diet' },

    { type: 'text', value: 'Paleo rules: no grains, no legumes, no dairy, no refined oils, no corn, no peanuts. Meat, fish, eggs, vegetables, fruits, nuts, and a few natural oils (coconut, olive, avocado). 414 foods in the pool.' },

    { type: 'foods', calories: '1,943', items: [
      { name: 'Strawberry Tree Fruit', servings: '1.47/day', detail: '100g' },
      { name: 'Plantain', servings: '2.86/day', detail: '1 medium (179g)' },
      { name: 'Lamb (Shank)', servings: '0.72/day', detail: '4 oz (113g)' },
      { name: 'Paprika', servings: '11.63/day', detail: '1 tsp (2.3g)' },
      { name: 'Avocado Oil', servings: '4.26/day', detail: '1 tbsp (14g)' },
      { name: 'Arugula', servings: '10.13/day', detail: '1 cup (20g)' },
      { name: 'Country-style Ribs', servings: '0.67/day', detail: '3 oz (85g)' },
      { name: 'Chia Seed', servings: '0.84/day', detail: '1 oz (28g)' },
    ]},

    { type: 'bars', title: 'Paleo optimal: key nutrients', items: [
      { label: 'Calories', pct: 97 },
      { label: 'Protein', pct: 100 },
      { label: 'Fat', pct: 101 },
      { label: 'Carbs', pct: 100 },
      { label: 'Fiber', pct: 148 },
      { label: 'Folate', pct: 109 },
      { label: 'Vitamin B12', pct: 107 },
      { label: 'Vitamin C', pct: 159 },
      { label: 'Vitamin E', pct: 148 },
      { label: 'Calcium', pct: 100 },
      { label: 'Iron', pct: 100 },
      { label: 'Potassium', pct: 133 },
    ]},

    { type: 'text', value: 'Zero structural gaps. Despite excluding three food groups, the optimizer found complete coverage -- plantain replaces grains for carbs, arugula replaces dairy for calcium, and paprika at 12 teaspoons daily covers vitamin A, vitamin E, and iron.' },

    { type: 'callout', tone: 'insight', title: 'Paleo\'s Hidden Strength', value: 'Paleo scores nearly as well as Mediterranean (loss 0.06 vs 0.03) while excluding grains, legumes, and dairy. Those groups are nutritionally redundant when you have the full vegetable, fruit, nut, fish, and animal kingdom. But like SAD, the gap between optimal paleo and actual paleo (chicken breast, sweet potato, broccoli) is enormous.' },

    { type: 'divider' },

    { type: 'heading', value: 'Carnivore Diet' },

    { type: 'text', value: 'Carnivore rules: animal products only. Meat, fish, eggs, and dairy. No plants of any kind. 228 foods in the pool.' },

    { type: 'foods', calories: '2,051', items: [
      { name: 'Mussel', servings: '3.78/day', detail: '3 oz (85g)' },
      { name: 'Ricotta (Cow)', servings: '2.90/day', detail: '100g' },
      { name: 'Lard', servings: '6.06/day', detail: '1 tbsp (13g)' },
      { name: 'Egg Yolk', servings: '5.97/day', detail: '1 large (17g)' },
      { name: 'Salmon (Atlantic)', servings: '0.89/day', detail: '3 oz (85g)' },
      { name: 'Snail', servings: '0.82/day', detail: '100g' },
      { name: 'Mutton Kidney', servings: '0.60/day', detail: '100g' },
      { name: 'Squid', servings: '0.29/day', detail: '3 oz (85g)' },
    ]},

    { type: 'bars', title: 'Carnivore optimal: where the gaps are', items: [
      { label: 'Fiber', pct: 0 },
      { label: 'Carbs', pct: 13 },
      { label: 'Potassium', pct: 46 },
      { label: 'Vitamin C', pct: 55 },
      { label: 'Vitamin E', pct: 79 },
      { label: 'Vitamin B6', pct: 87 },
      { label: 'Folate', pct: 89 },
      { label: 'Calcium', pct: 96 },
      { label: 'Magnesium', pct: 99 },
      { label: 'Iron', pct: 123 },
      { label: 'Protein', pct: 240 },
      { label: 'Vitamin B12', pct: 2473 },
    ]},

    { type: 'text', value: 'Four unfixable gaps. Even with 228 animal foods and perfect optimization, the carnivore diet cannot reach 80% DV for fiber, potassium, vitamin C, or vitamin E. Fiber is absolute zero -- no animal food contains it. The optimizer leans on organ meats, shellfish, and egg yolks for maximum micronutrient density and still falls short.' },

    { type: 'callout', tone: 'caveat', title: 'The Carnivore Gaps Are Not Debatable', value: 'Carnivore advocates often argue that nutrient requirements change on an all-meat diet, or that animal-sourced nutrients are more bioavailable. The bioavailability argument has merit for iron and zinc (heme vs non-heme) but does not apply to these four gaps. Fiber does not exist in meat. Vitamin C exists in organ meats at trace levels -- 55% DV is the theoretical ceiling. Potassium at 46% means chronic under-intake of a mineral the FDA already considers under-consumed. These gaps cannot be closed by food selection alone.' },

    { type: 'divider' },

    { type: 'heading', value: 'The Real Comparison' },

    { type: 'text', value: 'Stripped of sodium and sugars (which the optimizer correctly minimizes as upper limits), here is what each diet structurally cannot fix.' },

    { type: 'bars', title: 'Structural gaps: nutrients below 80% DV with optimal selection', items: [
      { label: 'SAD', pct: 0 },
      { label: 'Mediterranean', pct: 0 },
      { label: 'Paleo', pct: 0 },
      { label: 'Keto (if carbs enforced)', pct: 4 },
      { label: 'Carnivore', pct: 15 },
    ]},

    { type: 'text', value: 'Nutrients (excluding sodium, sugars, vitamin D, vitamin K) below 80% DV even with optimal selection. Keto reaches zero only by breaking its own carb rule. Carnivore has four that no amount of food selection can fix.' },

    { type: 'callout', tone: 'insight', title: 'The Diversity Gradient', value: 'Line up the diets by how much they exclude and the optimizer loss tracks almost perfectly: Mediterranean 0.03, SAD 0.04, Paleo 0.06, Carnivore 979, Keto 1,293. Nutritional coverage tracks directly with dietary diversity.' },

    { type: 'divider' },

    { type: 'heading', value: 'What This Means In Practice' },

    { type: 'text', value: 'The optimizer represents a ceiling -- the best you could possibly do. Nobody eats optimally. SAD followers have access to barley flour and leeks but eat white bread and cheese. Keto followers have access to wild blackberries and flaxseed but eat bacon and steak. Paleo followers have access to plantains and paprika but eat chicken breast and sweet potato. The math says "your diet could work." People say "I\'ll have the bacon."' },

    { type: 'text', value: 'For carnivore, even the ceiling is broken. Supplementation for fiber, vitamin C, potassium, and vitamin E is not optional -- it is a mathematical requirement.' },

    { type: 'callout', tone: 'caveat', title: 'Caveats', value: 'This analysis uses USDA nutrient data per 100g from our 544-food database. Bioavailability is not modeled: heme iron (meat) absorbs better than non-heme iron (plants), and phytates in grains/legumes reduce zinc absorption. The optimizer does not model amino acid completeness, omega-3/6 ratios, or antinutrient interactions. "Standard American Diet" is approximated by food-type restrictions, not actual consumption data. Keto is modeled with a carb penalty, not a hard ceiling, which is why the optimizer lands at 162g carbs instead of under 50g. Vitamin D and Vitamin K are excluded from scoring due to sparse data in the USDA database.' },
  ],
};

export default article;
