import type { ComponentType } from 'react';
import { StackTemplate } from './StackTemplate';
import { BannerTemplate } from './BannerTemplate';
import { CompactTemplate } from './CompactTemplate';
import { FramedTemplate } from './FramedTemplate';
import type { CardTemplateProps } from './types';

export type { CardTemplateProps } from './types';

/**
 * Every layout/component structure a Card can pick via its `template`
 * field — genuinely different DOM composition per entry (avatar
 * placement, link list vs. icon grid, full-bleed vs. framed card), not
 * just a recolor of the same skeleton (that's what `style`,
 * cardStyles.ts, is for). Adding a new one is one entry here.
 */
export const CARD_TEMPLATES: Record<string, { label: string; component: ComponentType<CardTemplateProps> }> = {
  template1: { label: 'Stack', component: StackTemplate },
  template2: { label: 'Banner', component: BannerTemplate },
  template3: { label: 'Compact', component: CompactTemplate },
  template4: { label: 'Framed', component: FramedTemplate },
};

const DEFAULT_TEMPLATE = CARD_TEMPLATES.template1 as { label: string; component: ComponentType<CardTemplateProps> };

export function resolveCardTemplate(template: string | undefined) {
  return (template && CARD_TEMPLATES[template]) || DEFAULT_TEMPLATE;
}
