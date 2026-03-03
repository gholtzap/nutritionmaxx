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
    description: 'Plant-based (non-heme) iron is poorly absorbed on its own -- typically 2-20% versus 15-35% for heme iron from meat. Vitamin C (ascorbic acid) is the most potent known enhancer of non-heme iron absorption. Hallberg et al. demonstrated a log-linear dose-response: 25 mg of ascorbic acid roughly doubles absorption, 50 mg triples it, and higher doses can push it to a 6-fold increase. The effect is specific to the same meal -- vitamin C consumed hours apart from iron provides no benefit. This interaction is strong enough that the WHO and FAO include vitamin C as a primary dietary strategy for combating iron deficiency in populations relying on plant-based diets.',
    mechanism: 'Ascorbic acid acts through two complementary mechanisms. First, it reduces ferric iron (Fe3+) to ferrous iron (Fe2+) in the acidic environment of the stomach and proximal duodenum; Fe2+ is the form recognized by the divalent metal transporter 1 (DMT1) on the apical membrane of enterocytes. Second, ascorbic acid chelates iron into a soluble iron-ascorbate complex that remains bioavailable even as pH rises in the duodenum and jejunum, where non-heme iron would otherwise precipitate as insoluble ferric hydroxide. This chelation also protects iron from binding to absorption inhibitors like phytate and polyphenols, which work by forming insoluble complexes with Fe3+.',
    tip: 'Pair iron-rich plant foods (spinach, lentils, beans) with a vitamin C source at the same meal -- timing matters because the interaction occurs in the gut lumen during digestion. As little as 25 mg of vitamin C (half an orange, a few strawberries, or a side of bell peppers) meaningfully boosts absorption, and 50 mg or more provides near-maximal benefit.',
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
    description: 'Calcium is unique among nutrients in that it inhibits both heme and non-heme iron absorption -- no other dietary component affects both pathways. Hallberg et al. (1991) showed a clear dose-response: inhibition begins around 40 mg of calcium, reaches about 50-60% at 300-600 mg (roughly one glass of milk or a calcium supplement), and plateaus beyond that. However, longer-term studies (12-16 weeks) consistently fail to show that calcium supplementation worsens iron status, suggesting the body compensates through upregulation of iron absorption over time. This adaptation may explain why populations with high dairy intake do not have higher rates of iron deficiency.',
    mechanism: 'Unlike phytate or polyphenols, which bind iron in the gut lumen, calcium acts after iron has already been taken up by enterocytes. Hallberg proposed that calcium inhibits iron at the common mucosal transfer step -- the basolateral export of iron from the enterocyte into the bloodstream via ferroportin. This explains why both heme iron (absorbed via HCP1/PCFT) and non-heme iron (absorbed via DMT1) are affected: they converge on the same intracellular iron pool and the same ferroportin-mediated export. Roughead et al. (2005) confirmed that calcium primarily reduces initial iron uptake rather than subsequent retention.',
    tip: 'If you rely on plant-based iron or have lower iron status, try to separate your highest-calcium foods (milk, yogurt, cheese, calcium supplements) from your highest-iron meals by 1-2 hours. This matters most for people at risk of iron deficiency. For most people eating a varied diet, the body adapts over time and no special timing is needed.',
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
    description: 'Without adequate vitamin D, the body absorbs only 10-15% of dietary calcium through passive paracellular diffusion alone. With sufficient vitamin D (serum 25(OH)D above 30 ng/mL), active transcellular transport is upregulated and total absorption rises to 30-40%. Heaney et al. (2003) showed that calcium absorption efficiency varies continuously across the normal range of serum 25(OH)D, with no sharp threshold. This dependency is so strong that severe vitamin D deficiency causes rickets in children and osteomalacia in adults regardless of calcium intake, because the gut simply cannot absorb enough calcium to maintain serum levels and the body strips it from bone instead.',
    mechanism: 'The active form of vitamin D (1,25-dihydroxyvitamin D / calcitriol) binds to the vitamin D receptor (VDR) in intestinal epithelial cells and acts as a transcription factor. It upregulates expression of TRPV6 (an apical calcium channel that admits Ca2+ into the enterocyte), calbindin-D9k (an intracellular calcium-binding protein that shuttles Ca2+ across the cytoplasm while buffering it to prevent toxic free Ca2+ levels), and PMCA1b (a basolateral Ca2+-ATPase that pumps Ca2+ into the bloodstream). Together these three proteins drive active transcellular calcium transport. A parallel paracellular pathway (passive diffusion between cells through tight junctions) operates independently of vitamin D and dominates when luminal calcium concentrations are very high, but it cannot compensate for the loss of the active pathway at normal dietary intakes.',
    tip: 'Ensure adequate vitamin D through sun exposure, fatty fish, fortified foods, or supplements. Sun exposure needs vary widely: at latitudes above 40 degrees N (most of the US and Europe), UVB is too weak from November through February to produce meaningful vitamin D regardless of time spent outdoors. During effective months, lighter skin (Fitzpatrick type II-III) needs roughly 5-10 minutes of midday sun on arms and face, while darker skin (type V-VI) may need 25-30 minutes.',
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
    description: 'Fat-soluble vitamins dissolve in lipids, not water, and require incorporation into mixed micelles formed during fat digestion before they can cross the intestinal wall. Brown et al. (2004) demonstrated this dramatically: carotenoid (provitamin A) absorption from salads was negligible with fat-free dressing but increased substantially once dressing fat exceeded about 6 g per meal. Dawson-Hughes et al. (2015) showed that vitamin D3 absorption was 32% higher when taken with a meal containing 11 g of fat versus a fat-free meal. The effect applies to all four fat-soluble vitamins (A, D, E, K) and to carotenoid precursors like beta-carotene and lycopene.',
    mechanism: 'When dietary fat enters the duodenum, it triggers cholecystokinin release, which causes the gallbladder to contract and secrete bile salts into the lumen. Bile salts act as biological detergents, emulsifying dietary fat and fat-soluble vitamins into mixed micelles -- nanoscale aggregates of 3-10 nm diameter with hydrophobic cores. These micelles ferry the vitamins to the brush border membrane of enterocytes, where the vitamins are absorbed by specific transporters (SR-B1, NPC1L1, and CD36). Without sufficient fat to trigger bile secretion and micelle formation, the vitamins remain in insoluble aggregates that pass through the GI tract. Once inside enterocytes, fat-soluble vitamins are packaged into chylomicrons -- large lipoprotein particles -- and exported into the lymphatic system rather than the portal blood, eventually entering the bloodstream via the thoracic duct.',
    tip: 'Include a source of fat when eating foods rich in vitamins A, D, E, or K. Research suggests a threshold of about 6-11 g of fat per meal is sufficient for good absorption. A drizzle of olive oil (one tablespoon = 14 g fat), a quarter avocado (about 7 g fat), or a small handful of nuts (8-12 g fat) is enough.',
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
    description: 'Zinc and copper compete for absorption in the small intestine via a shared metallothionein-dependent mechanism. At normal dietary ratios (roughly 8-10:1 zinc to copper) this is not a concern, but supplemental zinc doses above 40-50 mg/day can induce copper deficiency over weeks to months. The resulting copper deficiency causes sideroblastic anemia (iron is available but cannot be incorporated into hemoglobin without copper-dependent ceruloplasmin), neutropenia, and in severe cases a myelopathy resembling subacute combined degeneration. This interaction is so reliable that zinc acetate (150 mg/day) is FDA-approved as a treatment for Wilson disease, deliberately exploiting the mechanism to block intestinal copper absorption in patients with genetic copper overload.',
    mechanism: 'Excess zinc upregulates metallothionein synthesis in intestinal enterocytes through the metal-responsive transcription factor MTF-1. Metallothionein has 20 cysteine residues and binds copper (Cu+) with approximately 100-fold higher affinity than zinc (Zn2+) due to the thiophilic nature of Cu+. As enterocytes turn over and are sloughed into the intestinal lumen every 3-5 days, the copper sequestered in metallothionein is lost in feces rather than being exported to the bloodstream via the basolateral copper transporter ATP7A. High zinc also induces hepatic metallothionein, which can sequester copper already in circulation. The net effect is a progressive depletion of body copper stores, with clinical deficiency typically appearing after 4-10 months of excessive zinc intake.',
    tip: 'This interaction mainly matters if you take zinc supplements. The tolerable upper intake level (UL) for zinc is 40 mg/day for adults, set specifically to prevent copper depletion. If you must take high-dose zinc short-term (such as for immune support), consider a small copper supplement (1-2 mg/day, taken at a different time) to compensate.',
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
    description: 'Vitamin D is biologically inert when first absorbed or synthesized in the skin. It requires two sequential hydroxylation steps to become the active hormone calcitriol, and both enzymes that perform these conversions are magnesium-dependent. Uwitonze & Razzaque (2018) documented that low magnesium status impairs vitamin D activation even when serum vitamin D levels appear adequate, and that magnesium deficiency can cause a form of vitamin D-resistant rickets that responds to magnesium supplementation but not to additional vitamin D. A randomized controlled trial by Dai et al. (2018) found a more nuanced relationship: magnesium supplementation raised 25(OH)D levels in people whose baseline was low (below 30 ng/mL) but actually lowered 25(OH)D in those whose baseline was high (above 50 ng/mL), suggesting magnesium regulates multiple competing vitamin D metabolic pathways toward an optimal range rather than simply boosting activation.',
    mechanism: 'Magnesium serves as a cofactor for CYP2R1 (the 25-hydroxylase in the liver that performs the first hydroxylation, converting vitamin D to 25(OH)D) and CYP27B1 (the 1-alpha-hydroxylase in the kidney that performs the second hydroxylation, converting 25(OH)D to active 1,25(OH)2D / calcitriol). Both are cytochrome P450 enzymes that require Mg2+ for their catalytic activity. Magnesium is also needed for the activity of CYP24A1, the enzyme that catabolizes both 25(OH)D and 1,25(OH)2D into inactive metabolites, which may explain the bidirectional regulation observed by Dai et al. -- when magnesium is replete, both activation and inactivation pathways function properly, maintaining homeostasis rather than simply maximizing levels.',
    tip: 'If you supplement vitamin D or are working to improve your vitamin D status, make sure you are also getting enough magnesium (RDA: 310-420 mg/day depending on age and sex). Good sources include pumpkin seeds (150 mg per oz), spinach (157 mg per cooked cup), almonds (80 mg per oz), black beans (120 mg per cooked cup), and dark chocolate (65 mg per oz).',
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
