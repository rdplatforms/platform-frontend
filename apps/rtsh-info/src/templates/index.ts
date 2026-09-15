import type { ComponentType } from 'react';
import { ExecutiveMinimalTemplate } from './ExecutiveMinimalTemplate';
import { WhatsAppStorefrontTemplate } from './WhatsAppStorefrontTemplate';
import { CreativePortfolioTemplate } from './CreativePortfolioTemplate';
import { DarkTechGlassmorphismTemplate } from './DarkTechGlassmorphismTemplate';
import { ArtisanalJewelryBoutiqueTemplate } from './ArtisanalJewelryBoutiqueTemplate';
import { BistroDiningTemplate } from './BistroDiningTemplate';
import type { CardTemplateProps } from './types';

export type { CardTemplateProps } from './types';

interface TemplateEntry {
  label: string;
  /** One line shown on the showcase page (TASK-049) — who/what this template fits best. */
  description: string;
  component: ComponentType<CardTemplateProps>;
}

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
export const CARD_TEMPLATES: Record<string, TemplateEntry> = {
  'executive-minimal': {
    label: 'Executive Minimal',
    description: 'Consultants, founders, and other individual professionals.',
    component: ExecutiveMinimalTemplate,
  },
  'whatsapp-storefront': {
    label: 'WhatsApp Storefront',
    description: 'Shops and service businesses taking orders over WhatsApp.',
    component: WhatsAppStorefrontTemplate,
  },
  'creative-portfolio': {
    label: 'Creative Portfolio',
    description: 'Designers and creatives who lead with their work.',
    component: CreativePortfolioTemplate,
  },
  'dark-tech-glassmorphism': {
    label: 'Dark Tech Glassmorphism',
    description: 'Engineers, founders, and Web3/tech-flavored profiles.',
    component: DarkTechGlassmorphismTemplate,
  },
  'artisanal-jewelry-boutique': {
    label: 'Artisanal Jewelry Boutique',
    description: 'Jewellery, boutique, and other light-luxury retail.',
    component: ArtisanalJewelryBoutiqueTemplate,
  },
  'bistro-dining': {
    label: 'Bistro Dining',
    description: 'Restaurants, cafes, and dining spots.',
    component: BistroDiningTemplate,
  },
};

const DEFAULT_TEMPLATE = CARD_TEMPLATES['executive-minimal'] as TemplateEntry;

export function resolveCardTemplate(template: string | undefined) {
  return (template && CARD_TEMPLATES[template]) || DEFAULT_TEMPLATE;
}
