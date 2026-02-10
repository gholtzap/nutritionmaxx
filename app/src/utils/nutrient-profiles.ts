import type { NutrientKey } from '../types';

export type BodySystem = 'Brain' | 'Heart' | 'Bones' | 'Eyes' | 'Skin' | 'Immune' | 'Blood' | 'Energy';

export const BODY_SYSTEMS: BodySystem[] = [
  'Brain', 'Heart', 'Bones', 'Eyes', 'Skin', 'Immune', 'Blood', 'Energy',
];

export interface NutrientProfile {
  key: NutrientKey;
  description: string;
  color: string;
  stats: Record<BodySystem, number>;
}

export const NUTRIENT_PROFILES: NutrientProfile[] = [
  {
    key: 'vitamin_a_mcg',
    description: 'Vitamin A is essential for maintaining healthy vision, supporting immune function, and promoting cell growth. It plays a critical role in the retina, where it helps form the pigments needed for low-light and color vision.',
    color: 'hsl(25, 90%, 55%)',
    stats: { Brain: 1, Heart: 1, Bones: 2, Eyes: 5, Skin: 4, Immune: 4, Blood: 1, Energy: 0 },
  },
  {
    key: 'vitamin_b1_mg',
    description: 'Thiamine (B1) is vital for converting carbohydrates into usable energy. It supports nervous system function and is required for the synthesis of neurotransmitters that regulate mood and cognition.',
    color: 'hsl(45, 85%, 55%)',
    stats: { Brain: 4, Heart: 3, Bones: 0, Eyes: 0, Skin: 0, Immune: 1, Blood: 0, Energy: 5 },
  },
  {
    key: 'vitamin_b2_mg',
    description: 'Riboflavin (B2) acts as a coenzyme in energy-producing reactions throughout the body. It helps maintain healthy skin and eyes, and supports the metabolism of fats, drugs, and steroids.',
    color: 'hsl(55, 80%, 50%)',
    stats: { Brain: 2, Heart: 1, Bones: 0, Eyes: 3, Skin: 4, Immune: 1, Blood: 1, Energy: 5 },
  },
  {
    key: 'vitamin_b3_mg',
    description: 'Niacin (B3) is involved in over 400 enzymatic reactions, more than any other vitamin-derived coenzyme. It plays a key role in energy metabolism, DNA repair, and maintaining healthy cholesterol levels.',
    color: 'hsl(65, 75%, 48%)',
    stats: { Brain: 3, Heart: 4, Bones: 0, Eyes: 0, Skin: 3, Immune: 1, Blood: 2, Energy: 5 },
  },
  {
    key: 'vitamin_b5_mg',
    description: 'Pantothenic acid (B5) is a component of coenzyme A, which is essential for synthesizing and metabolizing proteins, carbohydrates, and fats. It supports adrenal function and helps produce red blood cells.',
    color: 'hsl(80, 70%, 45%)',
    stats: { Brain: 2, Heart: 2, Bones: 0, Eyes: 0, Skin: 3, Immune: 1, Blood: 3, Energy: 4 },
  },
  {
    key: 'vitamin_b6_mg',
    description: 'Vitamin B6 is crucial for brain development and function. It helps the body make serotonin, norepinephrine, and melatonin. It also plays a role in immune function and hemoglobin production.',
    color: 'hsl(95, 65%, 45%)',
    stats: { Brain: 5, Heart: 3, Bones: 0, Eyes: 0, Skin: 1, Immune: 3, Blood: 4, Energy: 3 },
  },
  {
    key: 'vitamin_b9_mcg',
    description: 'Folate (B9) is essential for DNA synthesis and cell division, making it especially important during periods of rapid growth. It helps prevent neural tube defects and supports red blood cell formation.',
    color: 'hsl(140, 65%, 42%)',
    stats: { Brain: 4, Heart: 3, Bones: 0, Eyes: 0, Skin: 1, Immune: 2, Blood: 5, Energy: 2 },
  },
  {
    key: 'vitamin_b12_mcg',
    description: 'Vitamin B12 is essential for neurological function and the formation of red blood cells. It helps maintain the myelin sheath that protects nerve fibers and is required for DNA synthesis.',
    color: 'hsl(160, 60%, 42%)',
    stats: { Brain: 5, Heart: 2, Bones: 0, Eyes: 0, Skin: 0, Immune: 2, Blood: 5, Energy: 3 },
  },
  {
    key: 'vitamin_c_mg',
    description: 'Vitamin C is a powerful antioxidant that protects cells from damage. It is required for collagen synthesis, wound healing, and iron absorption. It enhances immune defense by supporting cellular functions of the immune system.',
    color: 'hsl(30, 95%, 55%)',
    stats: { Brain: 1, Heart: 2, Bones: 2, Eyes: 1, Skin: 5, Immune: 5, Blood: 2, Energy: 1 },
  },
  {
    key: 'vitamin_d_mcg',
    description: 'Vitamin D regulates calcium and phosphorus absorption, making it essential for building and maintaining strong bones. It also modulates immune function and supports neuromuscular health.',
    color: 'hsl(48, 90%, 55%)',
    stats: { Brain: 2, Heart: 2, Bones: 5, Eyes: 0, Skin: 1, Immune: 4, Blood: 1, Energy: 1 },
  },
  {
    key: 'vitamin_e_mg',
    description: 'Vitamin E is a fat-soluble antioxidant that protects cell membranes from oxidative damage. It supports immune function, skin health, and helps prevent the oxidation of LDL cholesterol.',
    color: 'hsl(110, 55%, 45%)',
    stats: { Brain: 2, Heart: 3, Bones: 0, Eyes: 2, Skin: 5, Immune: 4, Blood: 2, Energy: 0 },
  },
  {
    key: 'vitamin_k_mcg',
    description: 'Vitamin K is essential for blood clotting and bone metabolism. It activates proteins that regulate calcium deposition in bones and arteries, helping maintain both skeletal and cardiovascular health.',
    color: 'hsl(150, 55%, 40%)',
    stats: { Brain: 0, Heart: 3, Bones: 5, Eyes: 0, Skin: 0, Immune: 1, Blood: 5, Energy: 0 },
  },
  {
    key: 'calcium_mg',
    description: 'Calcium is the most abundant mineral in the body, with 99% stored in bones and teeth. Beyond structural support, it is essential for muscle contraction, nerve signaling, and blood clotting.',
    color: 'hsl(210, 60%, 65%)',
    stats: { Brain: 1, Heart: 3, Bones: 5, Eyes: 0, Skin: 0, Immune: 1, Blood: 3, Energy: 1 },
  },
  {
    key: 'iron_mg',
    description: 'Iron is a core component of hemoglobin, the protein in red blood cells that transports oxygen from the lungs to every tissue in the body. It also supports energy metabolism and cognitive function.',
    color: 'hsl(0, 60%, 50%)',
    stats: { Brain: 3, Heart: 2, Bones: 0, Eyes: 0, Skin: 1, Immune: 3, Blood: 5, Energy: 4 },
  },
  {
    key: 'magnesium_mg',
    description: 'Magnesium is involved in over 300 enzymatic reactions including energy production, protein synthesis, and blood pressure regulation. It supports muscle and nerve function, and helps maintain steady heart rhythm.',
    color: 'hsl(190, 55%, 50%)',
    stats: { Brain: 4, Heart: 4, Bones: 3, Eyes: 0, Skin: 0, Immune: 2, Blood: 1, Energy: 4 },
  },
  {
    key: 'phosphorus_mg',
    description: 'Phosphorus works with calcium to build strong bones and teeth. It is a key component of ATP, the molecule that stores and transfers energy in cells, and plays a role in DNA and RNA structure.',
    color: 'hsl(230, 55%, 60%)',
    stats: { Brain: 2, Heart: 1, Bones: 5, Eyes: 0, Skin: 0, Immune: 0, Blood: 1, Energy: 5 },
  },
  {
    key: 'potassium_mg',
    description: 'Potassium is a critical electrolyte that helps maintain fluid balance, nerve transmission, and muscle contraction. Adequate intake is associated with lower blood pressure and reduced risk of stroke.',
    color: 'hsl(260, 55%, 60%)',
    stats: { Brain: 2, Heart: 5, Bones: 1, Eyes: 0, Skin: 0, Immune: 1, Blood: 2, Energy: 3 },
  },
  {
    key: 'sodium_mg',
    description: 'Sodium is an essential electrolyte that regulates fluid balance, blood pressure, and nerve impulse transmission. While necessary for survival, most diets provide more than sufficient amounts.',
    color: 'hsl(200, 50%, 58%)',
    stats: { Brain: 2, Heart: 3, Bones: 0, Eyes: 0, Skin: 0, Immune: 0, Blood: 3, Energy: 2 },
  },
  {
    key: 'zinc_mg',
    description: 'Zinc is required for the activity of over 300 enzymes involved in metabolism, digestion, and immune function. It plays a critical role in wound healing, taste perception, and DNA synthesis.',
    color: 'hsl(280, 50%, 58%)',
    stats: { Brain: 2, Heart: 1, Bones: 1, Eyes: 1, Skin: 4, Immune: 5, Blood: 1, Energy: 2 },
  },
  {
    key: 'copper_mg',
    description: 'Copper helps form collagen and elastin, the structural proteins in connective tissue. It is essential for iron metabolism, energy production, and the function of the nervous and immune systems.',
    color: 'hsl(20, 65%, 50%)',
    stats: { Brain: 3, Heart: 2, Bones: 3, Eyes: 0, Skin: 3, Immune: 3, Blood: 3, Energy: 2 },
  },
  {
    key: 'manganese_mg',
    description: 'Manganese is a trace mineral that supports bone formation, blood clotting, and metabolism of amino acids, cholesterol, and carbohydrates. It also functions as part of the antioxidant enzyme superoxide dismutase.',
    color: 'hsl(310, 45%, 52%)',
    stats: { Brain: 1, Heart: 1, Bones: 5, Eyes: 0, Skin: 1, Immune: 1, Blood: 3, Energy: 3 },
  },
  {
    key: 'selenium_mcg',
    description: 'Selenium is a trace mineral that functions as a component of selenoproteins, which protect cells from oxidative damage. It supports thyroid hormone metabolism, immune defense, and reproductive health.',
    color: 'hsl(340, 50%, 55%)',
    stats: { Brain: 2, Heart: 3, Bones: 0, Eyes: 0, Skin: 2, Immune: 5, Blood: 1, Energy: 2 },
  },
];

export const NUTRIENT_PROFILE_MAP = new Map(
  NUTRIENT_PROFILES.map((p) => [p.key, p])
);
