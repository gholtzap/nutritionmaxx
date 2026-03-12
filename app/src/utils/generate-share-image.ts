import type { ItemType } from '../types';
import type { PlanNutrientRow } from './plan-calculator';

const TYPE_LABELS: Record<ItemType, string> = {
  fruit: 'FRUITS',
  vegetable: 'VEGETABLES',
  grain: 'GRAINS',
  legume: 'LEGUMES',
  nut_seed: 'NUTS & SEEDS',
  fish_seafood: 'FISH & SEAFOOD',
  poultry: 'POULTRY',
  beef: 'BEEF',
  pork: 'PORK',
  fat_oil: 'FATS & OILS',
  dairy: 'DAIRY',
  egg: 'EGGS',
  lamb: 'LAMB',
  spice: 'SPICES',
};

export interface ShareFood {
  name: string;
  servingsPerWeek: number;
  type: ItemType;
}

export interface ShareImageInput {
  foods: ShareFood[];
  nutrientRows: PlanNutrientRow[];
}

const W = 1080;
const PAD = 64;
const CW = W - PAD * 2;

const BG = '#0f1117';
const TEXT_1 = '#e2e8f0';
const TEXT_2 = '#94a3b8';
const TEXT_3 = '#64748b';
const ACCENT = '#63b3ed';
const DIVIDER = 'rgba(255,255,255,0.06)';
const GREEN = '#34d399';
const AMBER = '#f59e0b';
const RED = '#ef4444';
const PROTEIN_C = '#63b3ed';
const CARBS_C = '#f59e0b';
const FAT_C = '#a78bfa';

const UI = '-apple-system, BlinkMacSystemFont, Inter, sans-serif';
const MONO = '"Geist Mono", "SF Mono", monospace';

function fmtServings(n: number): string {
  if (Number.isInteger(n)) return `${n}/wk`;
  return `${parseFloat(n.toFixed(1))}/wk`;
}

function pctColor(pct: number): string {
  if (pct >= 100) return GREEN;
  if (pct >= 50) return AMBER;
  return RED;
}

export async function generateShareImage(input: ShareImageInput): Promise<Blob> {
  const { foods, nutrientRows } = input;

  const groups = new Map<string, ShareFood[]>();
  for (const food of foods) {
    const label = TYPE_LABELS[food.type] ?? food.type.toUpperCase();
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(food);
  }

  const proteinRow = nutrientRows.find(r => r.key === 'protein_g');
  const fatRow = nutrientRows.find(r => r.key === 'fat_g');
  const carbsRow = nutrientRows.find(r => r.key === 'carbs_g');

  const proteinG = proteinRow?.total ?? 0;
  const fatG = fatRow?.total ?? 0;
  const carbsG = carbsRow?.total ?? 0;
  const proteinCal = proteinG * 4;
  const fatCal = fatG * 9;
  const carbsCal = carbsG * 4;
  const totalCal = proteinCal + fatCal + carbsCal;
  const pPct = totalCal > 0 ? Math.round((proteinCal / totalCal) * 100) : 0;
  const fPct = totalCal > 0 ? Math.round((fatCal / totalCal) * 100) : 0;
  const cPct = totalCal > 0 ? 100 - pPct - fPct : 0;

  const tracked = nutrientRows.filter(r => !r.insufficientData && r.dailyValue > 0);
  const met = tracked.filter(r => r.total >= r.dailyValue).length;

  const tmpCanvas = document.createElement('canvas');
  tmpCanvas.width = W;
  tmpCanvas.height = 4000;
  const ctx = tmpCanvas.getContext('2d')!;

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, 4000);

  let y = PAD;

  ctx.fillStyle = TEXT_1;
  ctx.font = `700 40px ${UI}`;
  ctx.textAlign = 'center';
  ctx.fillText('Weekly Meal Plan', W / 2, y + 40);
  y += 56;

  ctx.fillStyle = TEXT_3;
  ctx.font = `400 22px ${UI}`;
  ctx.fillText(`${foods.length} foods`, W / 2, y + 22);
  y += 50;

  ctx.fillStyle = DIVIDER;
  ctx.fillRect(PAD, y, CW, 1);
  y += 36;

  const groupArr = Array.from(groups.entries());
  const leftGroups: [string, ShareFood[]][] = [];
  const rightGroups: [string, ShareFood[]][] = [];
  let leftH = 0;
  let rightH = 0;

  for (const entry of groupArr) {
    const h = 32 + entry[1].length * 32 + 20;
    if (leftH <= rightH) {
      leftGroups.push(entry);
      leftH += h;
    } else {
      rightGroups.push(entry);
      rightH += h;
    }
  }

  const colW = (CW - 48) / 2;

  const drawFoodColumn = (
    colGroups: [string, ShareFood[]][],
    x: number,
    startY: number
  ): number => {
    let cy = startY;
    for (const [label, items] of colGroups) {
      ctx.fillStyle = TEXT_3;
      ctx.font = `600 15px ${UI}`;
      ctx.textAlign = 'left';
      ctx.fillText(label, x, cy + 15);
      cy += 30;

      for (const item of items) {
        ctx.fillStyle = TEXT_1;
        ctx.font = `500 19px ${UI}`;
        ctx.textAlign = 'left';
        ctx.fillText(item.name, x, cy + 19);

        ctx.fillStyle = TEXT_2;
        ctx.font = `400 17px ${MONO}`;
        ctx.textAlign = 'right';
        ctx.fillText(fmtServings(item.servingsPerWeek), x + colW, cy + 19);

        cy += 32;
      }
      cy += 16;
    }
    return cy;
  };

  const leftEnd = drawFoodColumn(leftGroups, PAD, y);
  const rightEnd = drawFoodColumn(rightGroups, PAD + colW + 48, y);
  y = Math.max(leftEnd, rightEnd) + 8;

  ctx.fillStyle = DIVIDER;
  ctx.fillRect(PAD, y, CW, 1);
  y += 36;

  ctx.fillStyle = TEXT_3;
  ctx.font = `600 15px ${UI}`;
  ctx.textAlign = 'left';
  ctx.fillText('MACRO SPLIT', PAD, y + 15);
  y += 36;

  if (totalCal > 0) {
    const barH = 36;
    const pW = (pPct / 100) * CW;
    const cW2 = (cPct / 100) * CW;
    const fW = CW - pW - cW2;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(PAD, y, CW, barH, 8);
    ctx.clip();

    ctx.fillStyle = PROTEIN_C;
    ctx.fillRect(PAD, y, pW, barH);
    ctx.fillStyle = CARBS_C;
    ctx.fillRect(PAD + pW, y, cW2, barH);
    ctx.fillStyle = FAT_C;
    ctx.fillRect(PAD + pW + cW2, y, fW, barH);

    ctx.restore();
    y += barH + 20;
  }

  const legends = [
    { label: `Protein ${pPct}%`, color: PROTEIN_C },
    { label: `Carbs ${cPct}%`, color: CARBS_C },
    { label: `Fat ${fPct}%`, color: FAT_C },
  ];
  const legSpacing = CW / legends.length;
  for (let i = 0; i < legends.length; i++) {
    const lx = PAD + legSpacing * i;
    ctx.beginPath();
    ctx.arc(lx + 8, y + 11, 7, 0, Math.PI * 2);
    ctx.fillStyle = legends[i].color;
    ctx.fill();

    ctx.fillStyle = TEXT_2;
    ctx.font = `500 17px ${UI}`;
    ctx.textAlign = 'left';
    ctx.fillText(legends[i].label, lx + 24, y + 17);
  }
  y += 44;

  ctx.fillStyle = DIVIDER;
  ctx.fillRect(PAD, y, CW, 1);
  y += 36;

  ctx.fillStyle = TEXT_3;
  ctx.font = `600 15px ${UI}`;
  ctx.textAlign = 'left';
  ctx.fillText('DAILY VALUE COVERAGE', PAD, y + 15);
  y += 36;

  const macros = tracked.filter(r => r.group === 'macro');
  const vitamins = tracked.filter(r => r.group === 'vitamin');
  const minerals = tracked.filter(r => r.group === 'mineral');

  const gridColW = (CW - 32) / 3;
  const colHeaders = ['MACROS', 'VITAMINS', 'MINERALS'];
  const columns = [macros, vitamins, minerals];

  for (let c = 0; c < 3; c++) {
    const cx = PAD + c * (gridColW + 16);
    ctx.fillStyle = TEXT_3;
    ctx.font = `600 13px ${UI}`;
    ctx.textAlign = 'left';
    ctx.fillText(colHeaders[c], cx, y + 13);
  }
  y += 28;

  const maxRows = Math.max(macros.length, vitamins.length, minerals.length);

  for (let r = 0; r < maxRows; r++) {
    for (let c = 0; c < 3; c++) {
      const col = columns[c];
      if (r >= col.length) continue;
      const row = col[r];
      const pct = Math.round((row.total / row.dailyValue) * 100);
      const cx = PAD + c * (gridColW + 16);

      ctx.fillStyle = TEXT_2;
      ctx.font = `400 16px ${UI}`;
      ctx.textAlign = 'left';
      ctx.fillText(row.label, cx, y + 16);

      ctx.fillStyle = pctColor(pct);
      ctx.font = `600 15px ${MONO}`;
      ctx.textAlign = 'right';
      ctx.fillText(`${pct}%`, cx + gridColW, y + 16);
    }
    y += 30;
  }

  y += 20;

  ctx.fillStyle = TEXT_2;
  ctx.font = `500 18px ${UI}`;
  ctx.textAlign = 'center';
  ctx.fillText(
    `${met} of ${tracked.length} tracked nutrients at or above 100% DV`,
    W / 2,
    y + 18
  );
  y += 56;

  ctx.fillStyle = ACCENT;
  ctx.font = `700 22px ${UI}`;
  ctx.textAlign = 'center';
  ctx.fillText('nutritionmaxx', W / 2, y + 22);
  y += 22 + PAD;

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = y;
  const fctx = canvas.getContext('2d')!;
  fctx.drawImage(tmpCanvas, 0, 0);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Failed to generate image'))),
      'image/png'
    );
  });
}
