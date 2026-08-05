import type { Business, SectionConfig } from '@rdplatforms/types';

/**
 * Every section component implements this exact prop shape. That
 * uniformity is what lets SectionRenderer map a SectionConfig to a
 * component without any per-section special-casing.
 */
export interface SectionProps {
  business: Business;
  config: SectionConfig;
}
