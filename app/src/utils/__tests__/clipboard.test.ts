import { afterEach, expect, it, vi } from 'vitest';
import { copyText } from '../clipboard';

afterEach(() => vi.unstubAllGlobals());
it('reports failure when both copy methods fail and removes the temporary field', async () => {
  const remove = vi.fn();
  vi.stubGlobal('HTMLElement', class {});
  vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
  vi.stubGlobal('document', { activeElement: null, createElement: () => ({ style: {}, focus: vi.fn(), select: vi.fn(), remove }),
    body: { appendChild: vi.fn() }, execCommand: vi.fn(() => false) });
  await expect(copyText('Weekly plan')).rejects.toThrow('Copy failed');
  expect(remove).toHaveBeenCalledOnce();
});
it('uses the fallback when the clipboard API rejects the write', async () => {
  const fallback = vi.fn(() => true);
  vi.stubGlobal('navigator', { clipboard: { writeText: vi.fn().mockRejectedValue(new Error('denied')) } });
  vi.stubGlobal('document', { activeElement: null, createElement: () => ({ style: {}, focus: vi.fn(), select: vi.fn(), remove: vi.fn() }),
    body: { appendChild: vi.fn() }, execCommand: fallback });
  vi.stubGlobal('HTMLElement', class {});
  await copyText('Weekly plan');
  expect(fallback).toHaveBeenCalledWith('copy');
});
