import { Box, CircularProgress } from '@mui/material';
import type { SectionConfig, SupportedLocale } from '@rdplatforms/types';
import { useBusiness, useLocale, usePageSections } from '@rdplatforms/hooks';
import { Footer, Navbar, SectionRenderer, type NavItem } from '@rdplatforms/ui';
import { translateUi, type UiStringKey } from '@rdplatforms/utils';

const NAV_LABEL_KEYS: Partial<Record<SectionConfig['type'], UiStringKey>> = {
  about: 'navAbout',
  services: 'navServices',
  gallery: 'navGallery',
  team: 'navTeam',
  testimonials: 'navReviews',
  faq: 'navFaq',
  pricing: 'navPricing',
  appointment: 'navAppointment',
  contact: 'navContact',
};

function toNavItems(sections: SectionConfig[], locale: SupportedLocale): NavItem[] {
  return sections
    .filter((section) => NAV_LABEL_KEYS[section.type])
    .map((section) => ({
      label: translateUi(NAV_LABEL_KEYS[section.type] as UiStringKey, locale),
      href: `#${section.type}`,
    }));
}

export function HomePage() {
  const { business } = useBusiness();
  const { locale } = useLocale();
  const { data: sections, isLoading } = usePageSections(business?.id, '/');

  if (!business) {
    return null;
  }

  if (isLoading || !sections) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar
        business={business}
        navItems={toNavItems(sections, locale)}
        ctaLabel={translateUi('contactUs', locale)}
      />
      <SectionRenderer business={business} sections={sections} />
      <Footer business={business} />
    </>
  );
}
