import type { NutrientKey } from '../types';

export type BodySystem = 'Brain' | 'Heart' | 'Bones' | 'Eyes' | 'Skin' | 'Immune' | 'Blood' | 'Energy';

export const BODY_SYSTEMS: BodySystem[] = [
  'Brain', 'Heart', 'Bones', 'Eyes', 'Skin', 'Immune', 'Blood', 'Energy',
];

export interface NutrientSource {
  title: string;
  url: string;
}

export interface NutrientProfile {
  key: NutrientKey;
  description: string;
  color: string;
  stats: Record<BodySystem, number>;
  sources: NutrientSource[];
}

export const NUTRIENT_PROFILES: NutrientProfile[] = [
  {
    key: 'vitamin_a_mcg',
    description: 'Vitamin A is critical for vision as an essential component of rhodopsin, the light-sensitive protein in retinal rod cells that responds to light. When light hits the retina, the vitamin A derivative 11-cis-retinal isomerizes to all-trans-retinal, triggering the phototransduction cascade that enables sight. Without adequate vitamin A, rhodopsin regeneration fails, causing night blindness -- historically one of the earliest recognized deficiency symptoms. Beyond vision, vitamin A supports cell growth and differentiation of the heart, lungs, and other organs, and regulates both innate and adaptive immunity by promoting regulatory T cell differentiation while modulating inflammatory responses. Deficiency remains the world\'s leading preventable cause of childhood blindness, affecting an estimated 250,000-500,000 children annually.',
    color: 'hsl(25, 90%, 55%)',
    stats: { Brain: 1, Heart: 1, Bones: 2, Eyes: 5, Skin: 4, Immune: 4, Blood: 1, Energy: 0 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin A Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminA-HealthProfessional/' },
      { title: 'Huang et al. (2018) -- Role of Vitamin A in the Immune System, Journal of Clinical Medicine', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6162863/' },
      { title: 'Perusek & Maeda (2013) -- Vitamin A Derivatives as Treatment Options for Retinal Degenerative Diseases, Nutrients', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3738993/' },
      { title: 'WHO -- Vitamin A Deficiency', url: 'https://www.who.int/data/nutrition/nlis/info/vitamin-a-deficiency' },
    ],
  },
  {
    key: 'vitamin_b1_mg',
    description: 'Thiamine (B1) is vital for converting carbohydrates into usable energy. It supports nervous system function and is required for the synthesis of neurotransmitters that regulate mood and cognition.',
    color: 'hsl(45, 85%, 55%)',
    stats: { Brain: 4, Heart: 3, Bones: 0, Eyes: 0, Skin: 0, Immune: 1, Blood: 0, Energy: 5 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Thiamine Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Thiamin-HealthProfessional/' },
    ],
  },
  {
    key: 'vitamin_b2_mg',
    description: 'Riboflavin (B2) acts as a coenzyme in energy-producing reactions throughout the body. It helps maintain healthy skin and eyes, and supports the metabolism of fats, drugs, and steroids.',
    color: 'hsl(55, 80%, 50%)',
    stats: { Brain: 2, Heart: 1, Bones: 0, Eyes: 3, Skin: 4, Immune: 1, Blood: 1, Energy: 5 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Riboflavin Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Riboflavin-HealthProfessional/' },
    ],
  },
  {
    key: 'vitamin_b3_mg',
    description: 'Niacin (B3) is involved in over 400 enzymatic reactions, more than any other vitamin-derived coenzyme. It plays a key role in energy metabolism, DNA repair, and maintaining healthy cholesterol levels.',
    color: 'hsl(65, 75%, 48%)',
    stats: { Brain: 3, Heart: 4, Bones: 0, Eyes: 0, Skin: 3, Immune: 1, Blood: 2, Energy: 5 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Niacin Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Niacin-HealthProfessional/' },
    ],
  },
  {
    key: 'vitamin_b5_mg',
    description: 'Pantothenic acid (B5) is a component of coenzyme A, which is essential for synthesizing and metabolizing proteins, carbohydrates, and fats. It supports adrenal function and helps produce red blood cells.',
    color: 'hsl(80, 70%, 45%)',
    stats: { Brain: 2, Heart: 2, Bones: 0, Eyes: 0, Skin: 3, Immune: 1, Blood: 3, Energy: 4 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Pantothenic Acid Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/PantothenicAcid-HealthProfessional/' },
    ],
  },
  {
    key: 'vitamin_b6_mg',
    description: 'Vitamin B6 is crucial for brain development and function. It helps the body make serotonin, norepinephrine, and melatonin. It also plays a role in immune function and hemoglobin production.',
    color: 'hsl(95, 65%, 45%)',
    stats: { Brain: 5, Heart: 3, Bones: 0, Eyes: 0, Skin: 1, Immune: 3, Blood: 4, Energy: 3 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin B6 Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminB6-HealthProfessional/' },
    ],
  },
  {
    key: 'vitamin_b9_mcg',
    description: 'Folate (B9) is essential for DNA synthesis and cell division, making it especially important during periods of rapid growth. It helps prevent neural tube defects and supports red blood cell formation.',
    color: 'hsl(140, 65%, 42%)',
    stats: { Brain: 4, Heart: 3, Bones: 0, Eyes: 0, Skin: 1, Immune: 2, Blood: 5, Energy: 2 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Folate Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/' },
    ],
  },
  {
    key: 'vitamin_b12_mcg',
    description: 'Vitamin B12 is essential for neurological function and the formation of red blood cells. It helps maintain the myelin sheath that protects nerve fibers and is required for DNA synthesis.',
    color: 'hsl(160, 60%, 42%)',
    stats: { Brain: 5, Heart: 2, Bones: 0, Eyes: 0, Skin: 0, Immune: 2, Blood: 5, Energy: 3 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin B12 Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/' },
    ],
  },
  {
    key: 'vitamin_c_mg',
    description: 'Vitamin C is a powerful antioxidant that protects cells from damage. It is required for collagen synthesis, wound healing, and iron absorption. It enhances immune defense by supporting cellular functions of the immune system.',
    color: 'hsl(30, 95%, 55%)',
    stats: { Brain: 1, Heart: 2, Bones: 2, Eyes: 1, Skin: 5, Immune: 5, Blood: 2, Energy: 1 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin C Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/' },
    ],
  },
  {
    key: 'vitamin_d_mcg',
    description: 'Vitamin D regulates calcium and phosphorus absorption, making it essential for building and maintaining strong bones. It also modulates immune function and supports neuromuscular health.',
    color: 'hsl(48, 90%, 55%)',
    stats: { Brain: 2, Heart: 2, Bones: 5, Eyes: 0, Skin: 1, Immune: 4, Blood: 1, Energy: 1 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin D Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/' },
    ],
  },
  {
    key: 'vitamin_e_mg',
    description: 'Vitamin E is a fat-soluble antioxidant that protects cell membranes from oxidative damage. It supports immune function, skin health, and helps prevent the oxidation of LDL cholesterol.',
    color: 'hsl(110, 55%, 45%)',
    stats: { Brain: 2, Heart: 3, Bones: 0, Eyes: 2, Skin: 5, Immune: 4, Blood: 2, Energy: 0 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin E Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminE-HealthProfessional/' },
    ],
  },
  {
    key: 'vitamin_k_mcg',
    description: 'Vitamin K is essential for blood clotting and bone metabolism. It activates proteins that regulate calcium deposition in bones and arteries, helping maintain both skeletal and cardiovascular health.',
    color: 'hsl(150, 55%, 40%)',
    stats: { Brain: 0, Heart: 3, Bones: 5, Eyes: 0, Skin: 0, Immune: 1, Blood: 5, Energy: 0 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin K Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminK-HealthProfessional/' },
    ],
  },
  {
    key: 'calcium_mg',
    description: 'Calcium is the most abundant mineral in the body, with 99% stored in bones and teeth. Beyond structural support, it is essential for muscle contraction, nerve signaling, and blood clotting.',
    color: 'hsl(210, 60%, 65%)',
    stats: { Brain: 1, Heart: 3, Bones: 5, Eyes: 0, Skin: 0, Immune: 1, Blood: 3, Energy: 1 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Calcium Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Calcium-HealthProfessional/' },
    ],
  },
  {
    key: 'iron_mg',
    description: 'Iron is a core component of hemoglobin, the protein in red blood cells that transports oxygen from the lungs to every tissue in the body. It also supports energy metabolism and cognitive function.',
    color: 'hsl(0, 60%, 50%)',
    stats: { Brain: 3, Heart: 2, Bones: 0, Eyes: 0, Skin: 1, Immune: 3, Blood: 5, Energy: 4 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Iron Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/' },
    ],
  },
  {
    key: 'magnesium_mg',
    description: 'Magnesium is involved in over 300 enzymatic reactions including energy production, protein synthesis, and blood pressure regulation. It supports muscle and nerve function, and helps maintain steady heart rhythm.',
    color: 'hsl(190, 55%, 50%)',
    stats: { Brain: 4, Heart: 4, Bones: 3, Eyes: 0, Skin: 0, Immune: 2, Blood: 1, Energy: 4 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Magnesium Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/' },
    ],
  },
  {
    key: 'phosphorus_mg',
    description: 'Phosphorus works with calcium to build strong bones and teeth. It is a key component of ATP, the molecule that stores and transfers energy in cells, and plays a role in DNA and RNA structure.',
    color: 'hsl(230, 55%, 60%)',
    stats: { Brain: 2, Heart: 1, Bones: 5, Eyes: 0, Skin: 0, Immune: 0, Blood: 1, Energy: 5 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Phosphorus Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Phosphorus-HealthProfessional/' },
    ],
  },
  {
    key: 'potassium_mg',
    description: 'Potassium is a critical electrolyte that helps maintain fluid balance, nerve transmission, and muscle contraction. Adequate intake is associated with lower blood pressure and reduced risk of stroke.',
    color: 'hsl(260, 55%, 60%)',
    stats: { Brain: 2, Heart: 5, Bones: 1, Eyes: 0, Skin: 0, Immune: 1, Blood: 2, Energy: 3 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Potassium Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Potassium-HealthProfessional/' },
    ],
  },
  {
    key: 'sodium_mg',
    description: 'Sodium is an essential electrolyte that regulates fluid balance, blood pressure, and nerve impulse transmission. While necessary for survival, most diets provide more than sufficient amounts.',
    color: 'hsl(200, 50%, 58%)',
    stats: { Brain: 2, Heart: 3, Bones: 0, Eyes: 0, Skin: 0, Immune: 0, Blood: 3, Energy: 2 },
    sources: [
      { title: 'American Heart Association -- Sodium and Salt', url: 'https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sodium/sodium-and-salt' },
      { title: 'Harvard T.H. Chan School of Public Health -- Salt and Sodium', url: 'https://nutritionsource.hsph.harvard.edu/salt-and-sodium/' },
    ],
  },
  {
    key: 'zinc_mg',
    description: 'Zinc is required for the activity of over 300 enzymes involved in metabolism, digestion, and immune function. It plays a critical role in wound healing, taste perception, and DNA synthesis.',
    color: 'hsl(280, 50%, 58%)',
    stats: { Brain: 2, Heart: 1, Bones: 1, Eyes: 1, Skin: 4, Immune: 5, Blood: 1, Energy: 2 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Zinc Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/' },
    ],
  },
  {
    key: 'copper_mg',
    description: 'Copper helps form collagen and elastin, the structural proteins in connective tissue. It is essential for iron metabolism, energy production, and the function of the nervous and immune systems.',
    color: 'hsl(20, 65%, 50%)',
    stats: { Brain: 3, Heart: 2, Bones: 3, Eyes: 0, Skin: 3, Immune: 3, Blood: 3, Energy: 2 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Copper Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Copper-HealthProfessional/' },
    ],
  },
  {
    key: 'manganese_mg',
    description: 'Manganese is a trace mineral that supports bone formation, blood clotting, and metabolism of amino acids, cholesterol, and carbohydrates. It also functions as part of the antioxidant enzyme superoxide dismutase.',
    color: 'hsl(310, 45%, 52%)',
    stats: { Brain: 1, Heart: 1, Bones: 5, Eyes: 0, Skin: 1, Immune: 1, Blood: 3, Energy: 3 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Manganese Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Manganese-HealthProfessional/' },
    ],
  },
  {
    key: 'selenium_mcg',
    description: 'Selenium is a trace mineral that functions as a component of selenoproteins, which protect cells from oxidative damage. It supports thyroid hormone metabolism, immune defense, and reproductive health.',
    color: 'hsl(340, 50%, 55%)',
    stats: { Brain: 2, Heart: 3, Bones: 0, Eyes: 0, Skin: 2, Immune: 5, Blood: 1, Energy: 2 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Selenium Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Selenium-HealthProfessional/' },
    ],
  },
];

export const NUTRIENT_PROFILE_MAP = new Map(
  NUTRIENT_PROFILES.map((p) => [p.key, p])
);
