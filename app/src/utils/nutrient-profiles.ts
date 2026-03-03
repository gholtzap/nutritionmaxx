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
    description: 'Thiamine diphosphate (the active form of B1) is a required cofactor for pyruvate dehydrogenase -- the enzyme that links glycolysis to the citric acid cycle -- and for alpha-ketoglutarate dehydrogenase within the cycle itself, making it indispensable for converting carbohydrates into ATP. In the nervous system, pyruvate dehydrogenase produces acetyl-CoA, the direct precursor of the neurotransmitter acetylcholine, while thiamine also contributes to the synthesis of serotonin, glutamate, and aspartate. Thiamine maintains myelin sheaths and nerve conduction velocity, and independently inhibits acetylcholinesterase, the enzyme that breaks down acetylcholine. The body stores only about 30 mg with a half-life of 1-12 hours, so deficiency can develop within 18 days of insufficient intake -- manifesting as beriberi (peripheral neuropathy and cardiac failure) or Wernicke-Korsakoff syndrome (confusion, ataxia, and irreversible memory loss) when the thalamus and mammillary bodies are damaged.',
    color: 'hsl(45, 85%, 55%)',
    stats: { Brain: 4, Heart: 3, Bones: 0, Eyes: 0, Skin: 0, Immune: 1, Blood: 0, Energy: 5 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Thiamine Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Thiamin-HealthProfessional/' },
      { title: 'Dhir et al. (2023) -- The Importance of Thiamine (Vitamin B1) in Humans, Bioscience Reports', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10568373/' },
      { title: 'Calderon-Ospina & Nava-Mesa (2020) -- B Vitamins in the Nervous System: Thiamine, Pyridoxine, and Cobalamin, CNS Neuroscience & Therapeutics', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6930825/' },
    ],
  },
  {
    key: 'vitamin_b2_mg',
    description: 'Riboflavin converts into two coenzymes -- flavin adenine dinucleotide (FAD) and flavin mononucleotide (FMN) -- that power roughly 70-80 flavoenzymes in the human body. FMN is required by Complex I and FAD by Complex II of the mitochondrial electron transport chain, placing riboflavin at the core of aerobic ATP production. FAD is also required by acyl-CoA dehydrogenase, the enzyme that initiates beta-oxidation of fatty acids, and flavocoenzymes work alongside cytochrome P450 to metabolize drugs and xenobiotics. In the eye, FAD-dependent glutathione reductase regenerates reduced glutathione -- the primary antioxidant concentrated in the lens -- and observational studies have associated adequate riboflavin intake (1.6-2.2 mg/day) with a 33-51% reduction in cataract risk. Deficiency (ariboflavinosis) presents with angular stomatitis, cheilosis, glossitis, and seborrheic dermatitis, and in the retina causes irreversible RPE dystrophy with disrupted fatty acid and TCA cycle metabolism before photoreceptor function visibly declines.',
    color: 'hsl(55, 80%, 50%)',
    stats: { Brain: 2, Heart: 1, Bones: 0, Eyes: 3, Skin: 4, Immune: 1, Blood: 1, Energy: 5 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Riboflavin Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Riboflavin-HealthProfessional/' },
      { title: 'Linus Pauling Institute -- Riboflavin, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/vitamins/riboflavin' },
      { title: 'Sinha et al. (2022) -- Riboflavin Deficiency Leads to Irreversible Cellular Changes in the RPE and Disrupts Retinal Function, Redox Biology', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9233280/' },
    ],
  },
  {
    key: 'vitamin_b3_mg',
    description: 'Over 400 enzymes require niacin\'s coenzyme forms -- NAD and NADP -- more than any other vitamin-derived cofactor. NAD primarily drives catabolic energy production from carbohydrates, fats, proteins, and alcohol, while NADP supports anabolic biosynthesis of fatty acids and steroids and regenerates antioxidant systems. Beyond redox chemistry, NAD+ is the sole substrate for two critical enzyme families: poly(ADP-ribose) polymerases (PARPs), which recruit repair machinery to DNA strand breaks, and the seven human sirtuins (SIRT1-7), NAD+-dependent deacetylases that regulate gene silencing, cell cycle progression, and mitochondrial metabolism. NAD-derived molecules (cADPR and NAADP) also serve as second messengers regulating intracellular calcium signaling. Pharmacological-dose nicotinic acid raises HDL cholesterol and shifts small dense LDL to larger buoyant particles, though the AIM-HIGH and HPS2-THRIVE trials (25,673 participants, 3-4 year follow-up) found no reduction in cardiovascular events when added to statin therapy. Deficiency causes pellagra -- the classic "4 Ds" of dermatitis, diarrhea, dementia, and death if untreated.',
    color: 'hsl(65, 75%, 48%)',
    stats: { Brain: 3, Heart: 4, Bones: 0, Eyes: 0, Skin: 3, Immune: 1, Blood: 2, Energy: 5 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Niacin Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Niacin-HealthProfessional/' },
      { title: 'Linus Pauling Institute -- Niacin, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/vitamins/niacin' },
      { title: 'Makarov, Trammell & Migaud (2019) -- The Chemistry of the Vitamin B3 Metabolome, Biochemical Society Transactions', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6411094/' },
    ],
  },
  {
    key: 'vitamin_b5_mg',
    description: 'Pantothenic acid (B5) is the obligate precursor to coenzyme A (CoA), one of the most widely used cofactors in human metabolism. Acetyl-CoA is the central convergence point where carbohydrate, fat, and protein breakdown enter the citric acid cycle for energy production. CoA is also required for fatty acid synthesis (via malonyl-CoA), cholesterol and steroid hormone synthesis (via the mevalonate pathway), and the production of acetylcholine via choline acetyltransferase. Succinyl-CoA -- another CoA derivative -- is a direct substrate for ALA synthase, the rate-limiting first step of heme biosynthesis; pantothenic acid-deficient animals develop anemia from impaired heme production. The 4\'-phosphopantetheine group derived from CoA also serves as the prosthetic group on acyl carrier protein (ACP), the flexible "swinging arm" that shuttles the growing fatty acid chain between active sites during fatty acid synthase elongation cycles. Deficiency is rare due to the vitamin\'s wide distribution in foods (the name derives from Greek "pantos," meaning everywhere), but experimental depletion causes fatigue, headache, and numbness in the extremities, and the historical "burning feet syndrome" observed in malnourished World War II prisoners of war was relieved specifically by pantothenic acid supplementation.',
    color: 'hsl(80, 70%, 45%)',
    stats: { Brain: 2, Heart: 2, Bones: 0, Eyes: 0, Skin: 3, Immune: 1, Blood: 3, Energy: 4 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Pantothenic Acid Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/PantothenicAcid-HealthProfessional/' },
      { title: 'Linus Pauling Institute -- Pantothenic Acid, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/vitamins/pantothenic-acid' },
      { title: 'Blomhoff et al. (2023) -- Pantothenic Acid: A Scoping Review for Nordic Nutrition Recommendations, Food & Nutrition Research', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10770646/' },
    ],
  },
  {
    key: 'vitamin_b6_mg',
    description: 'Vitamin B6 functions through its active form pyridoxal 5\'-phosphate (PLP), one of the most versatile coenzymes in human biochemistry, participating in over 140 enzymatic reactions -- approximately 4% of all classified enzymatic activities. PLP is a required coenzyme for aromatic L-amino acid decarboxylase, which synthesizes both serotonin (from 5-hydroxytryptophan) and dopamine (from L-DOPA), and for glutamic acid decarboxylase, which produces GABA, the brain\'s principal inhibitory neurotransmitter. PLP also serves as a coenzyme for aminolevulinic acid synthase, the rate-limiting enzyme that condenses succinyl-CoA and glycine to produce delta-aminolevulinic acid -- the committed first step in heme biosynthesis -- and deficiency at this step leads to microcytic anemia. In homocysteine metabolism, two PLP-dependent enzymes (cystathionine beta-synthase and cystathionine gamma-lyase) catalyze the transsulfuration pathway that converts homocysteine to cysteine, helping prevent the elevated homocysteine levels associated with cardiovascular risk. B6 further supports immune function through the tryptophan-kynurenine pathway, whose intermediates regulate T-cell differentiation and cytokine production, while deficiency impairs lymphocyte proliferation and interleukin-2 production.',
    color: 'hsl(95, 65%, 45%)',
    stats: { Brain: 5, Heart: 3, Bones: 0, Eyes: 0, Skin: 1, Immune: 3, Blood: 4, Energy: 3 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin B6 Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminB6-HealthProfessional/' },
      { title: 'Parra, Stahl & Hellmann (2018) -- Vitamin B6 and Its Role in Cell Metabolism and Physiology, Cells', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6071262/' },
      { title: 'Linus Pauling Institute -- Vitamin B6, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/vitamins/vitamin-B6' },
    ],
  },
  {
    key: 'vitamin_b9_mcg',
    description: 'Folate (B9) functions as tetrahydrofolate coenzymes that carry one-carbon units required for DNA synthesis: thymidylate synthase uses 5,10-methylene-THF to convert dUMP to dTMP (the sole pathway for making the DNA base thymine), while 10-formyl-THF donates carbons at two steps in de novo purine ring assembly. Without adequate folate, uracil is misincorporated into DNA in place of thymine, causing strand breaks and genomic instability. In rapidly dividing bone marrow cells, impaired DNA synthesis leads to megaloblastic anemia -- fewer but abnormally large red blood cells due to nuclear-cytoplasmic asynchrony, where the nucleus remains immature while the cytoplasm matures normally. Folate also works with vitamin B12 in the remethylation of homocysteine to methionine via methionine synthase; deficiency of either vitamin causes homocysteine accumulation. Periconceptional folic acid supplementation reduces neural tube defects by approximately 72% (MRC Vitamin Study, 1991, 1,817 women across 33 centers in 7 countries), and US mandatory grain fortification since 1998 has cut NTD prevalence by 28%, preventing an estimated 1,300 affected births annually. Critically, high-dose folic acid can mask B12 deficiency by correcting the anemia while allowing irreversible neurological damage to progress undetected.',
    color: 'hsl(140, 65%, 42%)',
    stats: { Brain: 4, Heart: 3, Bones: 0, Eyes: 0, Skin: 1, Immune: 2, Blood: 5, Energy: 2 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Folate Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Folate-HealthProfessional/' },
      { title: 'MRC Vitamin Study Research Group (1991) -- Prevention of Neural Tube Defects, Lancet', url: 'https://pubmed.ncbi.nlm.nih.gov/1677062/' },
      { title: 'Linus Pauling Institute -- Folate, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/vitamins/folate' },
    ],
  },
  {
    key: 'vitamin_b12_mcg',
    description: 'Vitamin B12 functions through two coenzyme forms: methylcobalamin, a cofactor for methionine synthase that converts homocysteine to methionine while regenerating tetrahydrofolate from 5-methyltetrahydrofolate, and adenosylcobalamin, a cofactor for methylmalonyl-CoA mutase that isomerizes methylmalonyl-CoA to succinyl-CoA during the breakdown of odd-chain fatty acids and the amino acids valine, isoleucine, methionine, and threonine. When B12 is deficient, methionine synthase stalls and folate becomes trapped as 5-methyltetrahydrofolate, starving cells of the tetrahydrofolate needed for DNA synthesis -- producing megaloblastic anemia identical to folate deficiency. Simultaneously, reduced methionine lowers S-adenosylmethionine (SAM), the universal methyl donor required for methylation of myelin basic protein and myelin phospholipids, while accumulated methylmalonyl-CoA feeds abnormal branched-chain fatty acids into myelin lipid synthesis, destabilizing the sheath. This dual mechanism causes subacute combined degeneration of the spinal cord, with progressive demyelination of the dorsal and lateral columns leading to peripheral neuropathy, gait ataxia, and cognitive decline -- neurological damage that may be irreversible if treatment is delayed. Neurological symptoms occur without anemia in roughly 25% of deficient patients. Deficiency risk is highest among vegans (B12 occurs almost exclusively in animal products) and adults over 60 (atrophic gastritis affects 10-30%, impairing absorption).',
    color: 'hsl(160, 60%, 42%)',
    stats: { Brain: 5, Heart: 2, Bones: 0, Eyes: 0, Skin: 0, Immune: 2, Blood: 5, Energy: 3 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin B12 Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminB12-HealthProfessional/' },
      { title: 'Linus Pauling Institute -- Vitamin B12, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/vitamins/vitamin-B12' },
      { title: 'Mascarenhas et al. (2022) -- Human B12-dependent Enzymes: Methionine Synthase and Methylmalonyl-CoA Mutase, Methods in Enzymology', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9420401/' },
    ],
  },
  {
    key: 'vitamin_c_mg',
    description: 'Vitamin C (ascorbic acid) is a potent electron donor that serves as the essential cofactor for iron- and alpha-ketoglutarate-dependent dioxygenases throughout the body. In collagen synthesis, it maintains the ferrous (Fe2+) state of iron at the active site of prolyl 4-hydroxylase, prolyl 3-hydroxylase, and lysyl hydroxylase -- the enzymes that hydroxylate proline and lysine residues to stabilize the collagen triple helix. Without ascorbate, these enzymes become irreversibly inactivated, and the resulting failure of connective tissue maintenance produces scurvy: bleeding gums, poor wound healing, perifollicular hemorrhages, and corkscrew hairs, typically appearing within 8-12 weeks of intake below 10 mg/day. As the primary water-soluble antioxidant in plasma, ascorbate directly scavenges superoxide and hydroxyl radicals and regenerates alpha-tocopherol (vitamin E) from its radical form at cell membrane surfaces, linking water-phase and lipid-phase antioxidant defense. It enhances non-heme iron absorption by reducing ferric iron (Fe3+) to the ferrous form (Fe2+) recognized by intestinal DMT1 transporters, increasing uptake 2- to 6-fold. In the immune system, neutrophils accumulate ascorbate to intracellular concentrations 50- to 100-fold above plasma levels, where it supports chemotaxis, phagocytosis, and reactive oxygen species generation for microbial killing. Ascorbate is also a cofactor for dopamine beta-monooxygenase (norepinephrine synthesis) and two enzymes in the carnitine biosynthetic pathway -- explaining why fatigue is the earliest deficiency symptom, appearing before any connective tissue signs.',
    color: 'hsl(30, 95%, 55%)',
    stats: { Brain: 1, Heart: 2, Bones: 2, Eyes: 1, Skin: 5, Immune: 5, Blood: 2, Energy: 1 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin C Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/' },
      { title: 'Carr & Maggini (2017) -- Vitamin C and Immune Function, Nutrients', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5707683/' },
      { title: 'Linus Pauling Institute -- Vitamin C, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/vitamins/vitamin-C' },
    ],
  },
  {
    key: 'vitamin_d_mcg',
    description: 'Vitamin D3 (cholecalciferol) is biologically inert until hydroxylated twice: first by hepatic CYP2R1 to 25-hydroxyvitamin D (the primary circulating marker of status), then by renal CYP27B1 to 1,25-dihydroxyvitamin D (calcitriol), the active hormone. Calcitriol binds the vitamin D receptor (VDR), a nuclear transcription factor that regulates an estimated 100-1,250 genes. In intestinal epithelial cells, VDR activation upregulates TRPV6 calcium channels, calbindin-D9k, and the basolateral pump PMCA1b for active transcellular calcium transport, while stimulating NaPi-IIb for phosphorus absorption. Without adequate vitamin D, the body absorbs only 10-15% of dietary calcium versus 30-40% when sufficient. Deficiency in children causes rickets (failed bone mineralization with skeletal deformities); adults develop osteomalacia with progressive bone softening and fracture risk. Immune cells including macrophages and T cells express both VDR and CYP27B1; upon pathogen detection via TLR2/1, monocytes locally convert 25(OH)D to calcitriol, which induces the antimicrobial peptide cathelicidin (LL-37) that directly kills bacteria including Mycobacterium tuberculosis. Vitamin D simultaneously suppresses Th1/Th17 inflammatory pathways and promotes regulatory T cell differentiation. In skeletal muscle, VDR signaling maintains type II (fast-twitch) fiber composition; deficiency causes proximal weakness and type II fiber atrophy, increasing fall risk two- to three-fold in older adults. A pooled analysis of 7.9 million participants across 81 countries found 48% of the global population deficient and 76% insufficient.',
    color: 'hsl(48, 90%, 55%)',
    stats: { Brain: 2, Heart: 2, Bones: 5, Eyes: 0, Skin: 1, Immune: 4, Blood: 1, Energy: 1 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin D Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/' },
      { title: 'Bikle (2014) -- Vitamin D Metabolism, Mechanism of Action, and Clinical Applications, Chemistry & Biology', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3968073/' },
      { title: 'Cui et al. (2023) -- Global and Regional Prevalence of Vitamin D Deficiency, Frontiers in Nutrition', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10064807/' },
    ],
  },
  {
    key: 'vitamin_e_mg',
    description: 'Vitamin E refers primarily to alpha-tocopherol, the only form retained in human plasma thanks to the hepatic alpha-tocopherol transfer protein (alpha-TTP), which selectively binds the 2R-stereoisomers and loads them into VLDL particles for whole-body distribution. Alpha-tocopherol functions as a chain-breaking antioxidant embedded in the lipid bilayer of cell membranes: its chromanol hydroxyl group donates a hydrogen atom to lipid peroxyl radicals approximately 1,000 times faster than polyunsaturated fatty acids react with those radicals, halting the lipid peroxidation chain reaction. Just one alpha-tocopherol molecule per ~1,000 membrane phospholipids provides effective protection because vitamin C continuously regenerates the resulting tocopheroxyl radical back to active alpha-tocopherol at the water-lipid interface. As the principal antioxidant in LDL particles, alpha-tocopherol protects polyunsaturated fats from oxidation that would otherwise promote macrophage uptake and foam cell formation in arterial walls -- though the AIM-HIGH and HOPE trials found no cardiovascular event reduction from supplementation. It also enhances T-cell-mediated immunity: a randomized trial in healthy elderly subjects (Meydani et al. 1997, JAMA) found that 200 mg/day for 235 days increased delayed-type hypersensitivity responses by 65%, likely by promoting immune synapse formation and suppressing the age-related rise in prostaglandin E2. Deficiency, though rare in healthy individuals, causes progressive spinocerebellar ataxia, peripheral neuropathy, and retinopathy due to oxidative damage to large myelinated axons; the genetic condition AVED (mutations in the TTPA gene) demonstrates this dramatically, typically manifesting between ages 5 and 15.',
    color: 'hsl(110, 55%, 45%)',
    stats: { Brain: 2, Heart: 3, Bones: 0, Eyes: 2, Skin: 5, Immune: 4, Blood: 2, Energy: 0 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin E Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminE-HealthProfessional/' },
      { title: 'Meydani et al. (1997) -- Vitamin E Supplementation and In Vivo Immune Response in Healthy Elderly Subjects, JAMA', url: 'https://jamanetwork.com/journals/jama/article-abstract/415853' },
      { title: 'Linus Pauling Institute -- Vitamin E, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/vitamins/vitamin-E' },
    ],
  },
  {
    key: 'vitamin_k_mcg',
    description: 'Vitamin K serves as the essential cofactor for gamma-glutamyl carboxylase (GGCX), which converts specific glutamic acid (Glu) residues to gamma-carboxyglutamic acid (Gla) residues -- a post-translational modification that confers calcium-binding ability. During catalysis, the reduced hydroquinone form of vitamin K is oxidized to vitamin K epoxide, then recycled back by vitamin K epoxide reductase (VKORC1); warfarin blocks this recycling to achieve anticoagulation. In hemostasis, gamma-carboxylation activates coagulation factors II (prothrombin), VII, IX, and X, each requiring 9-13 Gla residues to coordinate calcium ions and bind phospholipid membranes, along with anticoagulant proteins C, S, and Z that provide negative feedback. In bone, osteocalcin -- an osteoblast-synthesized protein with three Gla residues whose periodic spacing matches the calcium ion lattice of hydroxyapatite -- regulates mineral crystal growth and maturation; the Framingham Heart Study found subjects in the highest vitamin K intake quartile had 65% lower hip fracture risk than the lowest. In the vasculature, matrix Gla protein (MGP) is the body\'s primary calcification inhibitor: carboxylated MGP physically coats hydroxyapatite crystals and inhibits bone morphogenetic proteins (BMP-2/BMP-4) that would otherwise drive osteoblastic transformation of smooth muscle cells -- MGP-knockout mice develop fatal arterial calcification. Dietary vitamin K exists as K1 (phylloquinone) from green leafy vegetables and K2 (menaquinones) from bacterial fermentation and animal products, with K2 preferentially distributed to extrahepatic tissues. Newborns are uniquely vulnerable due to limited placental transfer and a sterile gut: without prophylaxis, vitamin K deficiency bleeding occurs in 0.25-1.7% of newborns, while late-onset VKDB presents with intracranial hemorrhage in over 50% of cases.',
    color: 'hsl(150, 55%, 40%)',
    stats: { Brain: 0, Heart: 3, Bones: 5, Eyes: 0, Skin: 0, Immune: 1, Blood: 5, Energy: 0 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Vitamin K Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/VitaminK-HealthProfessional/' },
      { title: 'Linus Pauling Institute -- Vitamin K, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/vitamins/vitamin-K' },
      { title: 'El Asmar, Naoum & Arbid (2014) -- Vitamin K Dependent Proteins and the Role of Vitamin K2 in Vascular Calcification, Oman Medical Journal', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4052396/' },
    ],
  },
  {
    key: 'calcium_mg',
    description: 'Calcium is the most abundant mineral in the human body, with over 99% stored in bones and teeth as hydroxyapatite crystals (Ca10(PO4)6(OH)2) that provide skeletal rigidity. The remaining <1% governs several essential physiological processes. In skeletal muscle, an action potential triggers calcium release from the sarcoplasmic reticulum via ryanodine receptor channels; calcium binds troponin C on actin filaments, displacing tropomyosin from myosin-binding sites to initiate contraction. In smooth muscle, calcium instead binds calmodulin, which activates myosin light-chain kinase. At presynaptic nerve terminals, voltage-gated calcium channels open during depolarization, and the resulting calcium influx activates synaptotagmins that trigger synaptic vesicle fusion and neurotransmitter release within a few hundred microseconds. Calcium is designated Factor IV in the coagulation cascade, serving as a required cofactor for the activation of seven vitamin K-dependent clotting factors. Beyond these roles, ionized calcium functions as a ubiquitous intracellular second messenger through calmodulin-activated kinases regulating processes from gene transcription to energy metabolism. Serum calcium is tightly maintained between 8.5 and 10.5 mg/dL through parathyroid hormone (stimulates bone resorption and vitamin D activation), calcitriol (increases intestinal absorption from below 15% to 30-40%), and calcitonin (inhibits osteoclast activity). An estimated 200 million people worldwide have osteoporosis, with roughly 30% of postmenopausal women in the US and Europe affected.',
    color: 'hsl(210, 60%, 65%)',
    stats: { Brain: 1, Heart: 3, Bones: 5, Eyes: 0, Skin: 0, Immune: 1, Blood: 3, Energy: 1 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Calcium Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Calcium-HealthProfessional/' },
      { title: 'Kuo & Bhatt Ehrlich (2015) -- Signaling in Muscle Contraction, Cold Spring Harbor Perspectives in Biology', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4315934/' },
      { title: 'Linus Pauling Institute -- Calcium, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/minerals/calcium' },
    ],
  },
  {
    key: 'iron_mg',
    description: 'Iron is a core component of hemoglobin, the oxygen-transport protein in red blood cells. Each hemoglobin molecule contains four heme groups, each with a central iron atom in the ferrous (Fe2+) state that reversibly binds one molecule of oxygen -- cooperative binding means that when O2 binds one subunit, the resulting T-to-R conformational shift increases the remaining subunits\' oxygen affinity. In muscle, the related protein myoglobin stores oxygen for use during contraction. Iron is also essential to mitochondrial energy production: iron-sulfur clusters and heme-containing cytochromes in Complexes I through IV of the electron transport chain drive the oxidative phosphorylation that generates the vast majority of the body\'s ATP. In the brain, iron is required for myelination, neurotransmitter synthesis (dopamine, serotonin), and neuronal energy production; a 2023 meta-analysis of 13 randomized controlled trials (Gutema et al., PLoS ONE) found iron supplementation significantly improved intelligence, memory, and attention in school-age children. Iron deficiency is the most common nutritional deficiency worldwide, affecting an estimated 4-6 billion people. The body tightly regulates iron through hepcidin, a liver-derived peptide that controls the sole iron exporter ferroportin, along with ferritin (storage) and transferrin (plasma transport). About 20-35 mg of iron is recycled daily from senescent red blood cells -- far exceeding the 1-2 mg absorbed from the diet. Dietary iron exists as heme iron from animal tissues (15-35% absorption) and non-heme iron from plant sources (2-20%, strongly influenced by enhancers like vitamin C and inhibitors like phytates).',
    color: 'hsl(0, 60%, 50%)',
    stats: { Brain: 3, Heart: 2, Bones: 0, Eyes: 0, Skin: 1, Immune: 3, Blood: 5, Energy: 4 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Iron Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Iron-HealthProfessional/' },
      { title: 'Gutema et al. (2023) -- Effects of Iron Supplementation on Cognitive Development in School-Age Children, PLoS ONE', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10298800/' },
      { title: 'Linus Pauling Institute -- Iron, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/minerals/iron' },
    ],
  },
  {
    key: 'magnesium_mg',
    description: 'Magnesium is a cofactor for over 600 enzymes and an activator of 200 more, making it one of the most broadly required minerals in human biochemistry. ATP exists predominantly as a Mg-ATP complex: without magnesium coordinating the beta- and gamma-phosphate groups, kinases and other phosphotransferases cannot catalyze phosphoryl transfer reactions -- magnesium is not merely involved in energy metabolism but structurally required for ATP to function as an energy currency. Magnesium is required for DNA and RNA polymerase activity through a two-metal-ion catalytic mechanism essential for nucleic acid synthesis and repair. In the nervous system, Mg2+ provides a voltage-dependent block of the NMDA receptor ion channel, preventing excessive calcium influx at resting potential and regulating neuronal excitability. In cardiac tissue, it acts as a natural calcium channel antagonist at L-type and T-type channels, suppresses afterdepolarizations, and promotes potassium influx to stabilize heart rhythm -- making intravenous magnesium a first-line treatment for torsades de pointes. It lowers blood pressure through vasodilation by increasing nitric oxide production and blocking calcium entry into vascular smooth muscle; a meta-analysis of 34 trials found a median dose of 368 mg/day reduced systolic BP by 2.00 mmHg and diastolic by 1.78 mmHg. Despite these critical roles, NHANES data show that over half of US adults have inadequate dietary magnesium intake, and subclinical deficiency -- difficult to detect because serum levels drop only after tissue stores are depleted -- is associated with increased risk of type 2 diabetes (22% lower risk in highest vs. lowest intake groups), metabolic syndrome, and cardiovascular disease.',
    color: 'hsl(190, 55%, 50%)',
    stats: { Brain: 4, Heart: 4, Bones: 3, Eyes: 0, Skin: 0, Immune: 2, Blood: 1, Energy: 4 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Magnesium Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Magnesium-HealthProfessional/' },
      { title: 'de Baaij, Hoenderop & Bindels (2015) -- Magnesium in Man: Implications for Health and Disease, Physiological Reviews', url: 'https://journals.physiology.org/doi/full/10.1152/physrev.00012.2014' },
      { title: 'Fiorentini et al. (2021) -- Magnesium: Biochemistry, Nutrition, Detection, and Social Impact of Diseases Linked to Its Deficiency, Nutrients', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8065437/' },
    ],
  },
  {
    key: 'phosphorus_mg',
    description: 'About 85% of the body\'s phosphorus -- roughly 700 g in an adult -- is stored in bones and teeth as hydroxyapatite (Ca10(PO4)6(OH)2), the crystalline mineral that gives the skeleton its rigidity. The remaining 15% is distributed across every cell: phosphorus forms the phosphodiester bonds of the DNA and RNA sugar-phosphate backbone, is the hydrophilic head group of phospholipids composing all cell membranes, and constitutes the phosphoanhydride bonds in ATP whose hydrolysis (-30.5 kJ/mol under standard conditions) powers virtually every energy-requiring process in the body. Reversible phosphorylation of proteins by kinases and phosphatases is the primary on/off switch for intracellular signaling cascades. Serum phosphorus (2.5-4.5 mg/dL) is tightly regulated by a three-hormone axis: PTH increases renal phosphate excretion, calcitriol enhances intestinal absorption of both calcium and phosphate, and FGF-23 (secreted by osteocytes when phosphate is high) suppresses both renal reabsorption and calcitriol synthesis. Chronic excess -- increasingly common from inorganic phosphate additives in processed foods, which are 90-100% absorbed versus 40-60% from natural animal sources -- drives vascular calcification and cardiovascular mortality, while deficiency causes muscle weakness, bone demineralization, and in children, rickets.',
    color: 'hsl(230, 55%, 60%)',
    stats: { Brain: 2, Heart: 1, Bones: 5, Eyes: 0, Skin: 0, Immune: 0, Blood: 1, Energy: 5 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Phosphorus Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Phosphorus-HealthProfessional/' },
      { title: 'Wagner (2023) -- The Basics of Phosphate Metabolism, Pflugers Archiv', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC10828206/' },
      { title: 'Serna & Bergwitz (2020) -- Importance of Dietary Phosphorus for Bone Metabolism and Healthy Aging, Nutrients', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7599912/' },
    ],
  },
  {
    key: 'potassium_mg',
    description: 'Potassium is the body\'s primary intracellular cation, concentrated ~35-fold over its extracellular level (140 vs. 4 mmol/L) by the Na+/K+-ATPase pump, which exports 3 Na+ and imports 2 K+ per ATP -- consuming 20-40% of resting energy expenditure and up to 70% in neurons. This electrochemical gradient generates the resting membrane potential (~-90 mV) that underlies every nerve impulse and muscle contraction: voltage-gated K+ channels drive repolarization after each action potential, and in cardiac muscle, even moderate hypokalemia disrupts this cycle, causing early afterdepolarizations that can trigger fatal ventricular arrhythmias. Potassium lowers blood pressure through two mechanisms -- downregulating the renal NCC sodium-chloride cotransporter to promote natriuresis, and hyperpolarizing vascular endothelium to produce vasodilation -- and meta-analyses of prospective cohorts (Aburto et al. 2013, 9 studies; D\'Elia et al. 2011, 247,510 participants) associate adequate intake (3,500-4,700 mg/day) with a 21-24% reduction in stroke risk. Modern Western diets have inverted the ancestral sodium:potassium ratio from roughly 1:16 to 1.4:1, and average US intake (2,400-3,200 mg/day) falls below the Adequate Intake of 2,600 mg (women) and 3,400 mg (men) per day.',
    color: 'hsl(260, 55%, 60%)',
    stats: { Brain: 2, Heart: 5, Bones: 1, Eyes: 0, Skin: 0, Immune: 1, Blood: 2, Energy: 3 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Potassium Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Potassium-HealthProfessional/' },
      { title: 'Aburto et al. (2013) -- Effect of Increased Potassium Intake on Cardiovascular Risk Factors and Disease, BMJ', url: 'https://pubmed.ncbi.nlm.nih.gov/23558164/' },
      { title: 'D\'Elia et al. (2011) -- Potassium Intake, Stroke, and Cardiovascular Disease: A Meta-Analysis, JACC', url: 'https://www.jacc.org/doi/10.1016/j.jacc.2010.09.070' },
    ],
  },
  {
    key: 'sodium_mg',
    description: 'Sodium is the dominant extracellular cation, and the Na+/K+-ATPase pump -- which consumes 20-40% of resting energy expenditure -- maintains it at concentrations roughly 10x higher outside cells than inside, establishing the electrochemical gradient that powers nerve signaling, muscle contraction, and nutrient absorption. Voltage-gated sodium channels open in ~1 ms during depolarization to generate action potentials, while sodium-dependent co-transporters (SGLT1 with 2 Na+:1 glucose stoichiometry, amino acid carriers) in the intestine and kidney require the gradient to absorb nutrients against their concentration gradients. Sodium governs extracellular fluid volume through osmotic pressure, and the renin-angiotensin-aldosterone system (RAAS) regulates blood pressure by adjusting renal sodium reabsorption. Despite being essential, overconsumption is the real public health concern -- average US intake (~3,400 mg/day) far exceeds the 1,500 mg Adequate Intake, and a meta-analysis of 13 prospective cohorts (177,025 participants) found each 2 g/day excess associates with 17% higher cardiovascular disease risk and 23% higher stroke risk. About 51% of hypertensive individuals are salt-sensitive, and an estimated 1.89 million deaths globally per year are attributed to excess sodium. Conversely, hyponatremia (serum Na+ <136 mmol/L) carries nearly 3x the mortality risk and affects up to 30% of hospitalized patients.',
    color: 'hsl(200, 50%, 58%)',
    stats: { Brain: 2, Heart: 3, Bones: 0, Eyes: 0, Skin: 0, Immune: 0, Blood: 3, Energy: 2 },
    sources: [
      { title: 'American Heart Association -- Sodium and Salt', url: 'https://www.heart.org/en/healthy-living/healthy-eating/eat-smart/sodium/sodium-and-salt' },
      { title: 'Linus Pauling Institute -- Sodium, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/minerals/sodium' },
      { title: 'Mohan et al. (2013) -- Prevalence of Hyponatremia and Association with Mortality: Results from NHANES, American Journal of Medicine', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3933395/' },
    ],
  },
  {
    key: 'zinc_mg',
    description: 'Zinc is required by over 300 enzymes as a catalytic cofactor and is present in approximately 3,000 human proteins (~10% of the proteome), serving catalytic, structural, and regulatory roles across all six enzyme classes. It stabilizes the zinc finger motifs found in roughly 700 transcription factors -- the largest class of DNA-binding proteins in the human genome -- enabling regulation of genes for hormone signaling, cell growth, and differentiation. Both DNA and RNA polymerase are zinc metalloenzymes, making zinc indispensable for cell division; zinc-deprived cells stall in S-phase with increased DNA damage. In the immune system, zinc activates thymulin (a thymic hormone required for T-cell maturation), maintains the Th1/Th2 cytokine balance, and supports natural killer cell cytotoxicity and neutrophil function; an estimated 2 billion people worldwide have suboptimal zinc status, contributing to over 450,000 childhood deaths annually from immune dysfunction. Zinc participates in all phases of wound healing as a cofactor for matrix metalloproteinases (zinc-dependent endopeptidases that remodel extracellular matrix) and SMAD-mediated collagen deposition. It is required for gustin (carbonic anhydrase VI), the primary zinc metalloenzyme in saliva that maintains taste bud structure and function; deficiency causes measurable hypogeusia and hyposmia. Meta-analyses of randomized trials show that zinc lozenges initiated within 24 hours of cold symptom onset reduce illness duration by approximately 33%.',
    color: 'hsl(280, 50%, 58%)',
    stats: { Brain: 2, Heart: 1, Bones: 1, Eyes: 1, Skin: 4, Immune: 5, Blood: 1, Energy: 2 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Zinc Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Zinc-HealthProfessional/' },
      { title: 'Wessels, Maywald & Rink (2017) -- Zinc as a Gatekeeper of Immune Function, Nutrients', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5748737/' },
      { title: 'Hemila (2017) -- Zinc Lozenges and the Common Cold: A Meta-Analysis, JRSM Open', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5418896/' },
    ],
  },
  {
    key: 'copper_mg',
    description: 'Copper is a cofactor for a family of cuproenzymes with distinct roles across the body. Lysyl oxidase uses copper to oxidatively deaminate lysine and hydroxylysine residues in collagen and elastin precursors, forming the covalent cross-links that give connective tissue its tensile strength and elastic recoil. Two copper-dependent ferroxidases -- ceruloplasmin (carrying 60-95% of plasma copper) and membrane-bound hephaestin in intestinal enterocytes -- oxidize ferrous iron to ferric iron so it can bind transferrin and circulate; without them, iron accumulates in tissues but cannot be mobilized, causing anemia unresponsive to iron supplements. Cytochrome c oxidase, the terminal enzyme of the mitochondrial electron transport chain (Complex IV), uses two copper centers (CuA, CuB) alongside two heme irons to reduce oxygen to water and drive ATP synthesis. In the nervous system, the copper enzyme dopamine beta-hydroxylase converts dopamine to norepinephrine, and cytochrome c oxidase in Schwann cells supports the phospholipid synthesis required for myelination -- copper deficiency can produce a myeloneuropathy clinically mimicking B12 deficiency. Cu/Zn-superoxide dismutase (SOD1) protects immune cells from their own antimicrobial oxidative burst, and neutropenia is one of the earliest signs of copper deficiency. Severe deficiency, as in the genetic disorder Menkes disease (ATP7A mutations), causes neurodegeneration, connective tissue failure, and depigmented kinky hair from tyrosinase loss.',
    color: 'hsl(20, 65%, 50%)',
    stats: { Brain: 3, Heart: 2, Bones: 3, Eyes: 0, Skin: 3, Immune: 3, Blood: 3, Energy: 2 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Copper Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Copper-HealthProfessional/' },
      { title: 'Robinson & Winge (2010) -- Copper Metallochaperones, Annual Review of Biochemistry', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3986808/' },
      { title: 'Linus Pauling Institute -- Copper, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/minerals/copper' },
    ],
  },
  {
    key: 'manganese_mg',
    description: 'Manganese forms the catalytic center of manganese superoxide dismutase (MnSOD/SOD2), a homotetrameric enzyme in the mitochondrial matrix that neutralizes superoxide radicals by cycling between Mn3+ and Mn2+ oxidation states, dismutating superoxide into hydrogen peroxide and molecular oxygen -- complete SOD2 knockout in mice is neonatally lethal due to cardiomyopathy and mitochondrial damage. Manganese is a required cofactor for pyruvate carboxylase and activates phosphoenolpyruvate carboxykinase (PEPCK), two enzymes critical for gluconeogenesis. It is a constituent of arginase, the liver enzyme that hydrolyzes arginine to urea and ornithine in the urea cycle, and in the brain, manganese-dependent glutamine synthetase converts the excitatory neurotransmitter glutamate to glutamine. Manganese is the preferred cofactor for glycosyltransferases and xylosyltransferases required for proteoglycan synthesis, providing the structural matrix for healthy cartilage and bone; manganese-deficient animals consistently develop skeletal abnormalities. Dietary deficiency is essentially undocumented in humans because manganese is ubiquitous in plant foods and the body tightly regulates tissue levels through biliary excretion. However, chronic overexposure -- particularly via inhalation in mining and welding -- causes manganism, a progressive neurotoxic syndrome: inhaled manganese bypasses hepatic first-pass metabolism and accumulates in the globus pallidus and striatum, producing dystonia and gait disturbances resembling but distinct from Parkinson\'s disease (no resting tremor, no Lewy bodies, levodopa-unresponsive). Manganese and iron share absorption pathways via DMT1 and ferroportin; iron deficiency enhances manganese absorption and brain accumulation.',
    color: 'hsl(310, 45%, 52%)',
    stats: { Brain: 1, Heart: 1, Bones: 5, Eyes: 0, Skin: 1, Immune: 1, Blood: 3, Energy: 3 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Manganese Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Manganese-HealthProfessional/' },
      { title: 'Holley et al. (2011) -- Manganese Superoxide Dismutase: Guardian of the Powerhouse, International Journal of Molecular Sciences', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3211030/' },
      { title: 'Linus Pauling Institute -- Manganese, Micronutrient Information Center', url: 'https://lpi.oregonstate.edu/mic/minerals/manganese' },
    ],
  },
  {
    key: 'selenium_mcg',
    description: 'Selenium functions through 25 genetically encoded selenoproteins, each containing selenocysteine -- the 21st proteinogenic amino acid, incorporated via a unique UGA-codon recoding mechanism. Five glutathione peroxidase isoforms (GPx1-4, GPx6) reduce hydrogen peroxide and lipid hydroperoxides to water and alcohols by coupling with glutathione oxidation. Three thioredoxin reductases maintain cellular redox balance, regenerate oxidized forms of vitamins C and E, and regulate cell growth signaling. Three iodothyronine deiodinases (DIO1-3) control thyroid hormone activation by converting the prohormone T4 to biologically active T3; selenium deficiency impairs this conversion, elevating the T4-to-T3 ratio and compounding thyroid dysfunction in iodine-poor regions. In immune cells, selenoproteins regulate T cell proliferation, NK cell cytotoxicity, and macrophage inflammatory signaling. GPx4 is essential for male fertility, first protecting developing sperm from oxidative damage and then becoming a structural component of the sperm mitochondrial sheath, while selenoprotein P transports selenium to the testes via apoER2 and megalin receptors. Severe deficiency causes Keshan disease (endemic cardiomyopathy, often fatal) and Kashin-Beck disease (degenerative osteoarthropathy affecting ~2.5 million people). Selenium has a narrow therapeutic window: the RDA is 55 mcg/day and the tolerable upper limit is 400 mcg/day, but adverse metabolic effects -- including elevated risk of type 2 diabetes and hypertension -- appear at intakes only modestly above the RDA, and the SELECT trial (35,533 men) found no cancer-prevention benefit from supplementation in selenium-replete individuals.',
    color: 'hsl(340, 50%, 55%)',
    stats: { Brain: 2, Heart: 3, Bones: 0, Eyes: 0, Skin: 2, Immune: 5, Blood: 1, Energy: 2 },
    sources: [
      { title: 'NIH Office of Dietary Supplements -- Selenium Fact Sheet for Health Professionals', url: 'https://ods.od.nih.gov/factsheets/Selenium-HealthProfessional/' },
      { title: 'Avery & Hoffmann (2018) -- Selenium, Selenoproteins, and Immunity, Nutrients', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6163284/' },
      { title: 'Lippman et al. (2009) -- Effect of Selenium and Vitamin E on Risk of Prostate Cancer (SELECT), JAMA', url: 'https://jamanetwork.com/journals/jama/fullarticle/183163' },
    ],
  },
];

export const NUTRIENT_PROFILE_MAP = new Map(
  NUTRIENT_PROFILES.map((p) => [p.key, p])
);
