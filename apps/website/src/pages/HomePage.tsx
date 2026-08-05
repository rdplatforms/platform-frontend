import { Box, CircularProgress } from '@mui/material';
import type { SectionConfig } from '@rdplatforms/types';
import { useBusiness, usePageSections } from '@rdplatforms/hooks';
import { Footer, Navbar, SectionRenderer, type NavItem } from '@rdplatforms/ui';

const NAV_LABELS: Partial<Record<SectionConfig['type'], string>> = {
  about: 'About',
  services: 'Services',
  gallery: 'Gallery',
  team: 'Team',
  testimonials: 'Reviews',
  faq: 'FAQ',
  pricing: 'Pricing',
  contact: 'Contact',
};

function toNavItems(sections: SectionConfig[]): NavItem[] {
  return sections
    .filter((section) => NAV_LABELS[section.type])
    .map((section) => ({ label: NAV_LABELS[section.type] as string, href: `#${section.type}` }));
}

export function HomePage() {
  const { business } = useBusiness();
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
      <Navbar business={business} navItems={toNavItems(sections)} ctaLabel="Contact Us" />
      <SectionRenderer business={business} sections={sections} />
      <Footer business={business} />
    </>
  );
}
