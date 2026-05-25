export function servingsLabel(spw: number): string {
  if (spw === 7) return 'daily';
  if (spw === 14) return '2x daily';
  if (spw === 3.5) return 'every other day';
  return `${spw}x / week`;
}
