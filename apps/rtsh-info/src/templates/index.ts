import type { ComponentType } from 'react';
import { StackTemplate } from './StackTemplate';
import { BannerTemplate } from './BannerTemplate';
import { CompactTemplate } from './CompactTemplate';
import { FramedTemplate } from './FramedTemplate';
import { ExecutiveMinimalTemplate } from './ExecutiveMinimalTemplate';
import { WhatsAppStorefrontTemplate } from './WhatsAppStorefrontTemplate';
import { CreativePortfolioTemplate } from './CreativePortfolioTemplate';
import { DarkTechGlassmorphismTemplate } from './DarkTechGlassmorphismTemplate';
import { ArtisanalJewelryBoutiqueTemplate } from './ArtisanalJewelryBoutiqueTemplate';
import { BistroDiningTemplate } from './BistroDiningTemplate';
import type { CardTemplateProps } from './types';

export type { CardTemplateProps } from './types';

/**
 * Every layout/component structure a Card can pick via its `template`
 * field — genuinely different DOM composition per entry (avatar
 * placement, link list vs. icon grid, full-bleed vs. framed card), not
 * just a recolor of the same skeleton (that's what `style`,
 * cardStyles.ts, is for). Adding a new one is one entry here.
 *
 * `template1`-`template4` are Milestone 4's originals, on the way out
 * (TASK-047 retires them once all 6 Milestone 9 templates below exist).
 * The Milestone 9 templates use descriptive kebab-case keys instead of
 * continuing the generic numbering, and don't take a `style` — each one
 * hardcodes its own design tokens (see ExecutiveMinimalTemplate's own
 * comment).
 */
export const CARD_TEMPLATES: Record<
  string,
  { label: string; component: ComponentType<CardTemplateProps> }
> = {
  template1: { label: 'Stack', component: StackTemplate },
  template2: { label: 'Banner', component: BannerTemplate },
  template3: { label: 'Compact', component: CompactTemplate },
  template4: { label: 'Framed', component: FramedTemplate },
  'executive-minimal': { label: 'Executive Minimal', component: ExecutiveMinimalTemplate },
  'whatsapp-storefront': { label: 'WhatsApp Storefront', component: WhatsAppStorefrontTemplate },
  'creative-portfolio': { label: 'Creative Portfolio', component: CreativePortfolioTemplate },
  'dark-tech-glassmorphism': {
    label: 'Dark Tech Glassmorphism',
    component: DarkTechGlassmorphismTemplate,
  },
  'artisanal-jewelry-boutique': {
    label: 'Artisanal Jewelry Boutique',
    component: ArtisanalJewelryBoutiqueTemplate,
  },
  'bistro-dining': { label: 'Bistro Dining', component: BistroDiningTemplate },
};

const DEFAULT_TEMPLATE = CARD_TEMPLATES.template1 as {
  label: string;
  component: ComponentType<CardTemplateProps>;
};

export function resolveCardTemplate(template: string | undefined) {
  return (template && CARD_TEMPLATES[template]) || DEFAULT_TEMPLATE;
}
