import type { NutrientKey, NutrientFruit } from '../types';
import type { PlanNutrientRow } from './plan-calculator';

export interface Insight {
  id: string;
  type: 'enhancer' | 'inhibitor' | 'requirement';
  message: string;
  nutrients: NutrientKey[];
  suggestNutrient: NutrientKey | null;
}

interface Source {
  title: string;
  url: string;
}

export interface InteractionRule {
  id: string;
  type: Insight['type'];
  message: string;
  description: string;
  mechanism: string;
  tip: string;
  nutrients: NutrientKey[];
  suggestNutrient: NutrientKey | null;
  sources: Source[];
  check: (pct: (key: NutrientKey) => number) => boolean;
}

export const RULES: InteractionRule[] = [
  {
    id: 'vitc-iron',
    type: 'enhancer',
    message: 'Vitamin C enhances non-heme iron absorption by up to 6x when consumed together',
    description: 'Plant-based (non-heme) iron is poorly absorbed on its own. Vitamin C (ascorbic acid) is the most potent known enhancer of non-heme iron absorption, with studies showing it can increase uptake 2- to 6-fold depending on the dose.',
    mechanism: 'Ascorbic acid reduces ferric iron (Fe3+) to ferrous iron (Fe2+) in the gut lumen, which is the form recognized by the divalent metal transporter DMT1 on enterocytes. It also chelates iron into a soluble complex that remains bioavailable at the higher pH of the duodenum, preventing precipitation.',
    tip: 'Pair iron-rich plant foods (spinach, lentils, beans) with a vitamin C source at the same meal. Even a small glass of orange juice or a side of bell peppers is enough to meaningfully boost absorption.',
    nutrients: ['iron_mg', 'vitamin_c_mg'],
    suggestNutrient: 'vitamin_c_mg',
    sources: [
      { title: 'Hallberg L, Brune M, Rossander L. Iron absorption in man: ascorbic acid and dose-dependent inhibition by phytate. Am J Clin Nutr. 1989;49(1):140-144', url: 'https://pubmed.ncbi.nlm.nih.gov/2911726/' },
      { title: 'Hurrell R, Egli I. Iron bioavailability and dietary reference values. Am J Clin Nutr. 2010;91(5):1461S-1467S', url: 'https://pubmed.ncbi.nlm.nih.gov/20200263/' },
      { title: 'Lynch SR, Cook JD. Interaction of vitamin C and iron. Ann N Y Acad Sci. 1980;355:32-44', url: 'https://pubmed.ncbi.nlm.nih.gov/6940487/' },
    ],
    check: (pct) => pct('iron_mg') >= 25 && pct('vitamin_c_mg') < 50,
  },
  {
    id: 'calcium-iron',
    type: 'inhibitor',
    message: 'High calcium can reduce iron absorption when consumed together',
    description: 'Calcium is the only nutrient known to inhibit both heme and non-heme iron absorption. Single-meal studies show that 300-600 mg of calcium can reduce iron absorption by 50-60%. However, long-term adaptation may reduce this effect.',
    mechanism: 'Calcium appears to inhibit iron at the common mucosal transfer step shared by both heme and non-heme iron pathways. This occurs within the enterocyte after initial uptake, likely by competing for basolateral transport via ferroportin or by affecting intracellular iron trafficking.',
    tip: 'If you rely on plant-based iron or have lower iron status, try to separate your highest-calcium foods (milk, yogurt, cheese) from your highest-iron meals by 1-2 hours. This matters most for people at risk of iron deficiency.',
    nutrients: ['calcium_mg', 'iron_mg'],
    suggestNutrient: null,
    sources: [
      { title: 'Hallberg L, Brune M, Erlandsson M, et al. Calcium: effect of different amounts on nonheme- and heme-iron absorption in humans. Am J Clin Nutr. 1991;53(1):112-119', url: 'https://pubmed.ncbi.nlm.nih.gov/1984335/' },
      { title: 'Roughead ZK, Zito CA, Hunt JR. Inhibitory effects of dietary calcium on the initial uptake and subsequent retention of heme and nonheme iron. Am J Clin Nutr. 2005;82(3):589-597', url: 'https://pubmed.ncbi.nlm.nih.gov/16155272/' },
      { title: 'Lönnerdal B. Calcium and iron absorption -- mechanisms and public health relevance. Int J Vitam Nutr Res. 2010;80(4-5):293-299', url: 'https://pubmed.ncbi.nlm.nih.gov/21462112/' },
    ],
    check: (pct) => pct('calcium_mg') >= 50 && pct('iron_mg') >= 25 && pct('iron_mg') < 100,
  },
  {
    id: 'vitd-calcium',
    type: 'enhancer',
    message: 'Vitamin D is needed to absorb calcium effectively',
    description: 'Without adequate vitamin D, the body absorbs only 10-15% of dietary calcium. With sufficient vitamin D, absorption rises to 30-40%. This is why vitamin D deficiency reliably leads to calcium deficiency regardless of calcium intake.',
    mechanism: 'The active form of vitamin D (1,25-dihydroxyvitamin D / calcitriol) binds to the vitamin D receptor in intestinal epithelial cells and upregulates expression of calbindin-D9k, TRPV6 calcium channels, and the basolateral calcium pump PMCA1b. Together these proteins drive active transcellular calcium transport across the intestinal wall.',
    tip: 'Ensure adequate vitamin D through sun exposure (15-20 min of midday sun on arms and legs), fatty fish, fortified foods, or supplements. This is especially important if you consume dairy or other calcium-rich foods for bone health.',
    nutrients: ['calcium_mg', 'vitamin_d_mcg'],
    suggestNutrient: 'vitamin_d_mcg',
    sources: [
      { title: 'Christakos S, Dhawan P, Porta A, et al. Vitamin D and intestinal calcium absorption. Mol Cell Endocrinol. 2011;347(1-2):25-29', url: 'https://pubmed.ncbi.nlm.nih.gov/21664413/' },
      { title: 'Heaney RP, Dowell MS, Hale CA, Bendich A. Calcium absorption varies within the reference range for serum 25-hydroxyvitamin D. J Am Coll Nutr. 2003;22(2):142-146', url: 'https://pubmed.ncbi.nlm.nih.gov/12672710/' },
      { title: 'Fleet JC. The role of vitamin D in the endocrinology controlling calcium homeostasis. Mol Cell Endocrinol. 2017;453:36-45', url: 'https://pubmed.ncbi.nlm.nih.gov/28461059/' },
    ],
    check: (pct) => pct('calcium_mg') >= 25 && pct('vitamin_d_mcg') < 50,
  },
  {
    id: 'fat-soluble',
    type: 'requirement',
    message: 'Vitamins A, D, E, K are fat-soluble and need dietary fat for absorption',
    description: 'Fat-soluble vitamins dissolve in lipids, not water. They require incorporation into mixed micelles formed during fat digestion before they can be absorbed by intestinal enterocytes. Meals with very low fat (<5g) dramatically reduce absorption of these vitamins.',
    mechanism: 'Dietary fat triggers bile salt secretion from the gallbladder. Bile salts emulsify fat and fat-soluble vitamins into mixed micelles, which ferry them to the brush border membrane of enterocytes. Without sufficient fat to trigger this process, the vitamins pass through the GI tract largely unabsorbed. Once inside enterocytes, they are packaged into chylomicrons for lymphatic transport.',
    tip: 'Include a source of fat when eating foods rich in vitamins A, D, E, or K. As little as 5-10g of fat is enough. Cook vegetables in olive oil, add nuts or avocado to salads, or dress leafy greens with a vinaigrette.',
    nutrients: ['vitamin_a_mcg', 'vitamin_d_mcg', 'vitamin_e_mg', 'vitamin_k_mcg', 'fat_g'],
    suggestNutrient: 'fat_g',
    sources: [
      { title: 'Reboul E. Mechanisms of carotenoid intestinal absorption. Nutrients. 2019;11(4):838', url: 'https://pubmed.ncbi.nlm.nih.gov/30979058/' },
      { title: 'Dawson-Hughes B, Harris SS, Lichtenstein AH, et al. Dietary fat increases vitamin D-3 absorption. J Acad Nutr Diet. 2015;115(2):225-230', url: 'https://pubmed.ncbi.nlm.nih.gov/25441954/' },
      { title: 'Brown MJ, Ferruzzi MG, Nguyen ML, et al. Carotenoid bioavailability is higher from salads ingested with full-fat than reduced-fat dressing. Am J Clin Nutr. 2004;80(2):396-403', url: 'https://pubmed.ncbi.nlm.nih.gov/15277161/' },
    ],
    check: (pct) => {
      const hasFatSoluble =
        pct('vitamin_a_mcg') >= 25 ||
        pct('vitamin_d_mcg') >= 25 ||
        pct('vitamin_e_mg') >= 25 ||
        pct('vitamin_k_mcg') >= 25;
      return hasFatSoluble && pct('fat_g') < 30;
    },
  },
  {
    id: 'zinc-copper',
    type: 'inhibitor',
    message: 'Very high zinc can inhibit copper absorption',
    description: 'Zinc and copper compete for absorption in the small intestine. At normal dietary ratios this is not a concern, but supplemental zinc doses above 40-50 mg/day can induce copper deficiency over weeks to months, causing anemia and neurological symptoms.',
    mechanism: 'Excess zinc upregulates metallothionein synthesis in intestinal enterocytes. Metallothionein has a higher binding affinity for copper than zinc. As enterocytes turn over and are sloughed into the lumen every 3-5 days, the copper bound to metallothionein is lost in feces rather than being transferred to the bloodstream. This effectively traps dietary copper in the gut wall.',
    tip: 'This interaction mainly matters if you take zinc supplements. Keep supplemental zinc below 40 mg/day unless medically directed. If you must take high-dose zinc short-term, consider a small copper supplement (1-2 mg) to compensate.',
    nutrients: ['zinc_mg', 'copper_mg'],
    suggestNutrient: 'copper_mg',
    sources: [
      { title: 'Prasad AS, Brewer GJ, Schoomaker EB, Rabbani P. Hypocupremia induced by zinc therapy in adults. JAMA. 1978;240(20):2166-2168', url: 'https://pubmed.ncbi.nlm.nih.gov/359843/' },
      { title: 'Fosmire GJ. Zinc toxicity. Am J Clin Nutr. 1990;51(2):225-227', url: 'https://pubmed.ncbi.nlm.nih.gov/2407097/' },
      { title: 'Willis MS, Monaghan SA, Miller ML, et al. Zinc-induced copper deficiency: a report of three cases initially recognized on bone marrow examination. Am J Clin Pathol. 2005;123(1):125-131', url: 'https://pubmed.ncbi.nlm.nih.gov/15762288/' },
    ],
    check: (pct) => pct('zinc_mg') >= 150 && pct('copper_mg') < 75,
  },
  {
    id: 'mag-vitd',
    type: 'enhancer',
    message: 'Magnesium is needed to activate vitamin D',
    description: 'Vitamin D is biologically inert when first absorbed or synthesized in the skin. It requires two hydroxylation steps to become its active form (calcitriol), and both enzymes that perform these conversions are magnesium-dependent. Low magnesium status impairs vitamin D activation even when serum vitamin D levels appear adequate.',
    mechanism: 'Magnesium serves as a cofactor for CYP2R1 (25-hydroxylase in the liver) and CYP27B1 (1-alpha-hydroxylase in the kidney), the two enzymes that convert vitamin D to 25(OH)D and then to the active 1,25(OH)2D (calcitriol). Magnesium is also required for the vitamin D binding protein that transports vitamin D metabolites in the blood.',
    tip: 'If you supplement vitamin D or are working to improve your vitamin D status, make sure you are also getting enough magnesium. Good sources include pumpkin seeds, spinach, almonds, black beans, and dark chocolate.',
    nutrients: ['vitamin_d_mcg', 'magnesium_mg'],
    suggestNutrient: 'magnesium_mg',
    sources: [
      { title: 'Uwitonze AM, Razzaque MS. Role of magnesium in vitamin D activation and function. J Am Osteopath Assoc. 2018;118(3):181-189', url: 'https://pubmed.ncbi.nlm.nih.gov/29480918/' },
      { title: 'Dai Q, Zhu X, Manson JE, et al. Magnesium status and supplementation influence vitamin D status and metabolism. Am J Clin Nutr. 2018;108(6):1249-1258', url: 'https://pubmed.ncbi.nlm.nih.gov/30541089/' },
      { title: 'Reddy V, Sivakumar B. Magnesium-dependent vitamin-D-resistant rickets. Lancet. 1974;1(7864):963-965', url: 'https://pubmed.ncbi.nlm.nih.gov/4133647/' },
    ],
    check: (pct) => pct('vitamin_d_mcg') >= 25 && pct('magnesium_mg') < 50,
  },
];

export function analyzeInteractions(rows: PlanNutrientRow[]): Insight[] {
  const rowMap = new Map(rows.map((r) => [r.key, r]));

  const pct = (key: NutrientKey): number => {
    const row = rowMap.get(key);
    if (!row || row.dailyValue <= 0) return 0;
    return (row.total / row.dailyValue) * 100;
  };

  const insights: Insight[] = [];
  for (const rule of RULES) {
    if (rule.check(pct)) {
      insights.push({
        id: rule.id,
        type: rule.type,
        message: rule.message,
        nutrients: rule.nutrients,
        suggestNutrient: rule.suggestNutrient,
      });
    }
  }
  return insights;
}

export function findSuggestedFoods(
  nutrientKey: NutrientKey,
  fruits: NutrientFruit[],
  excludeNames: Set<string>,
  count = 3
): NutrientFruit[] {
  return fruits
    .filter((f) => {
      if (excludeNames.has(f.name)) return false;
      const val = f[nutrientKey] as number | null;
      return val !== null && val > 0;
    })
    .sort((a, b) => {
      const aVal = (a[nutrientKey] as number) * ((a.serving_size_g ?? 100) / 100);
      const bVal = (b[nutrientKey] as number) * ((b.serving_size_g ?? 100) / 100);
      return bVal - aVal;
    })
    .slice(0, count);
}
