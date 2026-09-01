import type { ComponentType } from 'react';
import type { Business, SectionConfig } from '@rdplatforms/types';
import { Hero } from './Hero';
import { About } from './About';
import { Services } from './Services';
import { Gallery } from './Gallery';
import { Testimonials } from './Testimonials';
import { Faq } from './Faq';
import { Cta } from './Cta';
import { Contact } from './Contact';
import { MapSection } from './MapSection';
import { Pricing } from './Pricing';
import { Team } from './Team';
import { Appointment } from './Appointment';
import type { SectionProps } from './types';

const SECTION_COMPONENTS: Record<SectionConfig['type'], ComponentType<SectionProps>> = {
  hero: Hero,
  about: About,
  services: Services,
  gallery: Gallery,
  testimonials: Testimonials,
  faq: Faq,
  cta: Cta,
  contact: Contact,
  map: MapSection,
  pricing: Pricing,
  team: Team,
  appointment: Appointment,
};

export interface SectionRendererProps {
  business: Business;
  sections: SectionConfig[];
}

/**
 * The mechanism behind "enable/disable sections through configuration": the
 * caller has already filtered to enabled sections and sorted them by order
 * (see PageService.getEnabledSections) — this just maps each type to its
 * component. Adding a new section type means adding one map entry, never
 * touching a page.
 */
export function SectionRenderer({ business, sections }: SectionRendererProps) {
  return (
    <>
      {sections.map((section) => {
        const SectionComponent = SECTION_COMPONENTS[section.type];
        return <SectionComponent key={section.type} business={business} config={section} />;
      })}
    </>
  );
}
