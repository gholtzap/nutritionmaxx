import Papa from 'papaparse';
import type { NutrientFruit, ItemCategory, ItemType } from '../types';

const VALID_CATEGORIES = new Set([
  'Pome', 'Citrus', 'Berry', 'Stone', 'Tropical', 'Melon', 'Grape',
  'Root', 'Leafy Green', 'Cruciferous', 'Legume', 'Allium', 'Nightshade', 'Squash',
  'Herb', 'Seed', 'Pepper', 'Root/Bark',
  'Tree Nut', 'Legume Nut',
  'Bean', 'Lentil', 'Pea', 'Soy',
  'Rice', 'Wheat', 'Ancient Grain',
  'Fish', 'Crustacean', 'Mollusk',
  'Chicken', 'Turkey', 'Other Poultry',
  'Ground', 'Steak', 'Other Cut',
  'Loin', 'Shoulder',
  'Plant Oil', 'Nut & Seed Oil', 'Animal Fat', 'Processed',
  'Other',
]);

const VALID_TYPES = new Set(['fruit', 'vegetable', 'spice', 'nut_seed', 'legume', 'grain', 'fish_seafood', 'poultry', 'beef', 'pork', 'fat_oil']);

function parseNumeric(value: string | undefined): number | null {
  if (value === undefined || value === null || value === '') return null;
  const trimmed = String(value).trim();
  if (trimmed === '') return null;
  const num = Number(trimmed);
  if (Number.isNaN(num)) return null;
  return num;
}

const NUMERIC_FIELDS = [
  'calories_kcal', 'protein_g', 'fat_g', 'carbs_g', 'fiber_g', 'sugars_g', 'water_g',
  'vitamin_a_mcg', 'vitamin_b1_mg', 'vitamin_b2_mg', 'vitamin_b3_mg', 'vitamin_b5_mg',
  'vitamin_b6_mg', 'vitamin_b9_mcg', 'vitamin_b12_mcg', 'vitamin_c_mg', 'vitamin_d_mcg',
  'vitamin_e_mg', 'vitamin_k_mcg', 'calcium_mg', 'iron_mg', 'magnesium_mg',
  'phosphorus_mg', 'potassium_mg', 'sodium_mg', 'zinc_mg', 'copper_mg',
  'manganese_mg', 'selenium_mcg',
];

export async function loadFruits(): Promise<NutrientFruit[]> {
  const response = await fetch('/nutrition.csv');
  if (!response.ok) {
    throw new Error(`Failed to fetch CSV: ${response.status}`);
  }

  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(csvText, {
      header: true,
      skipEmptyLines: true,
      complete(results) {
        if (results.errors.length > 0) {
          const critical = results.errors.filter(
            (e) => e.type !== 'FieldMismatch'
          );
          if (critical.length > 0) {
            reject(new Error(`CSV parse errors: ${JSON.stringify(critical)}`));
            return;
          }
        }

        const fruits: NutrientFruit[] = [];

        for (const row of results.data) {
          const name = row.name?.trim();
          const category = row.category?.trim();
          const type = row.type?.trim();

          if (!name || !category) continue;
          if (!VALID_CATEGORIES.has(category)) continue;
          if (type && !VALID_TYPES.has(type)) continue;

          const fruit: Record<string, unknown> = {
            name,
            type: (type || 'fruit') as ItemType,
            category: category as ItemCategory,
            fdc_id: row.fdc_id?.trim() || '',
            serving_size_g: parseNumeric(row.serving_size_g),
            serving_label: row.serving_label?.trim() || null,
            cost_index: parseNumeric(row.cost_index),
          };

          for (const field of NUMERIC_FIELDS) {
            fruit[field] = parseNumeric(row[field]);
          }

          fruits.push(fruit as NutrientFruit);
        }

        resolve(fruits);
      },
      error(err: Error) {
        reject(err);
      },
    });
  });
}
