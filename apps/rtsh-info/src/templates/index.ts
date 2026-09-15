import type { ComponentType } from 'react';
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
 * placement, catalog vs. link list, dark glass vs. warm light), not
 * just a recolor of the same skeleton. Adding a new one is one entry
 * here.
 *
 * Milestone 4's originals (`template1`-`template4`, a `style`+`template`
 * pair going through `CardStyleConfig`) were retired here (TASK-048) —
 * these six replace them entirely, hardcoding their own design tokens
 * (`designTokens.ts`) instead of a swappable recolor system, since each
 * one carries a specific, deliberate palette from its own Stitch
 * DESIGN.md spec (see ExecutiveMinimalTemplate's own comment).
 */
export const CARD_TEMPLATES: Record<
  string,
  { label: string; component: ComponentType<CardTemplateProps> }
> = {
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

const DEFAULT_TEMPLATE = CARD_TEMPLATES['executive-minimal'] as {
  label: string;
  component: ComponentType<CardTemplateProps>;
};

export function resolveCardTemplate(template: string | undefined) {
  return (template && CARD_TEMPLATES[template]) || DEFAULT_TEMPLATE;
}
