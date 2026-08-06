import { describe, expect, it } from 'vitest';
import { pageService } from '../src/PageService';

describe('PageService', () => {
  it('returns only enabled sections, sorted by order', async () => {
    const sections = await pageService.getEnabledSections('urban-bistro', '/');
    expect(sections.every((section) => section.enabled)).toBe(true);
    expect(sections.find((section) => section.type === 'faq')).toBeUndefined();

    const orders = sections.map((section) => section.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it('returns an empty array for a business with no matching page', async () => {
    const sections = await pageService.getEnabledSections('swami-hair-salon', '/careers');
    expect(sections).toEqual([]);
  });
});
