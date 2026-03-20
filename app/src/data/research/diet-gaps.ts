import type { ResearchArticle } from '../research-articles';

const article: ResearchArticle = {
  slug: 'whats-missing-from-your-diet',
  title: "What's Actually Missing From Your Diet?",
  date: '2026-03-20',
  summary: 'Running a constrained optimizer against 544 foods for five popular dietary patterns -- Standard American, Mediterranean, Keto, Paleo, and Carnivore -- to find which nutrients each one structurally cannot deliver, even with perfect food selection.',
  tags: ['optimization', 'nutrient density', 'dietary patterns', 'daily values'],
  content: [
    { type: 'callout', tone: 'insight', title: 'TLDR', value: 'Every diet except carnivore can theoretically hit 100% of all daily values with the right food choices. Carnivore has four irrecoverable gaps: fiber (0%), potassium (46%), vitamin C (55%), and vitamin E (79%). Keto can cover everything -- but only by eating 162g of carbs, more than triple the ketogenic threshold. The real finding: the gap between what a diet CAN deliver and what its followers actually eat is where the deficiencies live.' },

    { type: 'text', value: 'People are tribal about what they eat. Keto advocates, carnivore adherents, and Mediterranean loyalists all have studies and anecdotes. But there is a question most diet debates skip: given the foods your diet allows, what is the best possible nutritional outcome? Not what you actually eat -- what you could eat if you picked perfectly. The gaps that remain even with perfect selection are structural. They are built into the rules of the diet itself, and no amount of meal planning can fix them.' },

    { type: 'stats', items: [
      { value: '544', label: 'Foods in Database' },
      { value: '26', label: 'Nutrients Tracked' },
      { value: '5', label: 'Diets Analyzed' },
      { value: '0%', label: 'Carnivore Fiber' },
    ]},

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

    { type: 'text', value: 'Zero structural gaps. Even without fish, legumes, or nuts, the SAD food pool can hit every daily value. The optimizer picks barley flour (carbs, B vitamins, fiber, iron), ricotta (calcium, B12, protein), leeks (vitamin C, folate, manganese), parsnips (fiber, potassium), and strawberry tree fruit (vitamin E, vitamin C). This looks nothing like an actual American diet. The problem with the SAD is not the food pool -- it is the food choices. Nobody eating a "standard American diet" is consuming 2.5 leeks and 175g of barley flour daily.' },

    { type: 'callout', tone: 'insight', title: 'The SAD Paradox', value: 'The Standard American Diet has an optimizer loss of 0.04 -- virtually zero, and nearly tied with Mediterranean (0.03). The pool of foods available to a typical American is nutritionally complete. The crisis is entirely in selection, not availability. Every nutrient Americans are deficient in (potassium, fiber, vitamin D) is available in foods they already have access to but do not eat.' },

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

    { type: 'text', value: 'Zero structural gaps. With the full 544-food database, the optimizer finds complete coverage: plantain and cornmeal for carbs and potassium, oregano for manganese and vitamin E, collard greens for calcium and vitamin A, brisket for protein and B12, egg yolks for selenium and B vitamins, and strawberry tree fruit for vitamin C. 19 of 26 nutrients land within 80-120% of their daily value.' },

    { type: 'callout', tone: 'insight', title: 'Why Mediterranean Wins', value: 'The Mediterranean diet\'s advantage is not any single food category -- it is that nothing is excluded. The optimizer uses grains, spices, starchy fruit, leafy greens, beef, dairy, and eggs. Remove any one category (as keto removes grains, paleo removes dairy, carnivore removes plants) and the loss score jumps. Dietary diversity is the mechanism, not any superfood.' },

    { type: 'divider' },

    { type: 'heading', value: 'Ketogenic Diet' },

    { type: 'text', value: 'Keto rules: no grains, no legumes, no fruit except berries, no starchy vegetables, no peanuts. Foods with more than 10g carbs per serving are excluded. Additionally, the optimizer is penalized for total carbs above 50g (18% DV). 338 foods in the pool.' },

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

    { type: 'text', value: 'The optimizer cheated. Despite a heavy penalty on carbs, it landed at 59% DV -- 162 grams of carbohydrates, more than triple the ketogenic threshold of 50g. Where did the carbs come from? 25 shallots (250g), 22 scallions (337g), 334g of wild blackberries, and shiitake mushrooms. The optimizer decided that missing vitamin C, folate, and potassium was worse than breaking the carb limit. It chose the lesser penalty.' },

    { type: 'callout', tone: 'caveat', title: 'The Keto Tradeoff', value: 'This is the central finding for keto: the diet cannot simultaneously stay under 50g of carbs AND cover essential micronutrients from whole foods alone. The optimizer -- which has access to every keto-legal food and can pick perfect quantities -- still breaks the carb budget. In practice, keto dieters who do stay under 50g are almost certainly missing vitamin C, folate, potassium, and fiber unless they supplement or eat very large volumes of leafy greens daily.' },

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

    { type: 'text', value: 'Zero structural gaps. Despite excluding grains, dairy, and legumes -- three entire food groups -- the optimizer found complete coverage. Plantain replaces grains as the carb base (2.86 medium plantains daily, 512g). Paprika at 12 teaspoons daily (27g) delivers vitamin A, vitamin E, and iron. Arugula at 10 cups daily covers calcium and folate without dairy. Chia seed handles omega-3 and fiber. Lamb shank and ribs provide B12, zinc, and selenium.' },

    { type: 'callout', tone: 'insight', title: 'Paleo\'s Hidden Strength', value: 'Paleo scores nearly as well as Mediterranean on the optimizer (loss 0.06 vs 0.03) while excluding three food groups. The reason: paleo\'s allowed foods include the entire vegetable, fruit, nut, fish, and animal kingdom. Grains, legumes, and dairy are nutritionally redundant when you have access to plantains (carbs), arugula (calcium), nuts (fat), and eggs (B12). The optimizer does not miss them. But like SAD, the gap between optimal paleo and actual paleo (chicken breast, sweet potato, broccoli) is enormous.' },

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

    { type: 'text', value: 'Four irrecoverable structural gaps. Even with 228 animal foods and a mathematical optimizer selecting the perfect combination, the carnivore diet cannot reach 80% DV for fiber, potassium, vitamin C, or vitamin E. Fiber is absolute zero -- no animal food contains it. The optimizer picks mussels (manganese at 479% DV, iron, B12), mutton kidney (organ meat for folate and vitamin A), 6 egg yolks daily for micronutrients, lard for calories, and salmon for omega-3. It still falls short on four nutrients.' },

    { type: 'callout', tone: 'caveat', title: 'The Carnivore Gaps Are Not Debatable', value: 'Carnivore advocates often argue that nutrient requirements change on an all-meat diet, or that animal-sourced nutrients are more bioavailable. The bioavailability argument has merit for iron and zinc (heme vs non-heme) but does not apply here. Fiber does not exist in meat. Vitamin C is present in organ meats and shellfish at trace levels (the optimizer found 55% DV as the theoretical maximum from animal sources). Potassium at 46% means chronic under-intake of a mineral the FDA already considers under-consumed in the general population. Vitamin E at 79% has no high-concentration animal source. These are not marginal shortfalls -- they are structural impossibilities.' },

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

    { type: 'text', value: 'The number represents how many real nutrients (excluding sodium, sugars, vitamin D, vitamin K) fall below 80% DV even with optimal selection. SAD, Mediterranean, and Paleo all reach zero structural gaps. Keto reaches zero only by breaking its own carb rule. Carnivore has four nutrients that no amount of food selection can fix.' },

    { type: 'callout', tone: 'insight', title: 'The Diversity Gradient', value: 'The pattern across all five diets is clear: the more food categories you exclude, the harder the optimizer works and the worse the result. Mediterranean (exclude nothing): loss 0.03. SAD (exclude fish, legumes, nuts): loss 0.04. Paleo (exclude grains, legumes, dairy): loss 0.06. Carnivore (exclude all plants): loss 979. Keto (exclude grains, legumes, most fruit, starchy vegetables, plus carb cap): loss 1,293. Nutritional coverage is a direct function of dietary diversity. Every exclusion has a cost.' },

    { type: 'divider' },

    { type: 'heading', value: 'What This Means In Practice' },

    { type: 'text', value: 'The optimizer results represent a ceiling -- the best you could possibly do. Nobody eats optimally. The real-world gap between the optimizer\'s picks and what people actually eat is where deficiencies live.' },

    { type: 'text', value: 'SAD followers have access to barley flour, leeks, and strawberry tree fruit but eat white bread, ground beef, and cheese. Keto followers have access to wild blackberries, shiitake mushrooms, and flaxseed but eat bacon, butter, and steak. Paleo followers have access to plantains, paprika, and arugula but eat chicken breast and sweet potato. In every diet, the optimizer picks foods that the diet\'s typical adherents do not eat. The structural analysis says "your diet could work." The behavioral reality says "it doesn\'t."' },

    { type: 'text', value: 'For carnivore, even the ceiling is broken. If you eat only animal products, supplementation for fiber, vitamin C, potassium, and vitamin E is not optional. It is a mathematical requirement. The optimizer tried 228 foods in every possible combination and could not close the gap.' },

    { type: 'callout', tone: 'caveat', title: 'Caveats', value: 'This analysis uses USDA nutrient data per 100g from our 544-food database. Bioavailability is not modeled: heme iron (meat) absorbs better than non-heme iron (plants), and phytates in grains/legumes reduce zinc absorption. The optimizer does not model amino acid completeness, omega-3/6 ratios, or antinutrient interactions. "Standard American Diet" is approximated by food-type restrictions, not actual consumption data. Keto is modeled with a carb penalty, not a hard ceiling, which is why the optimizer lands at 162g carbs instead of under 50g. Vitamin D and Vitamin K are excluded from scoring due to sparse data in the USDA database.' },
  ],
};

export default article;
