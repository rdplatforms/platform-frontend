import { Box } from '@mui/material';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function MapSection({ business, config }: SectionProps) {
  const { mapEmbedUrl } = business.contact.address;
  if (!mapEmbedUrl) {
    return null;
  }

  return (
    <PageSection id="map" tone="subtle">
      <SectionTitle title={config.title ?? 'Find Us'} subtitle={config.subtitle} />
      <Box
        component="iframe"
        src={mapEmbedUrl}
        loading="lazy"
        title={`${business.displayName} location map`}
        sx={{ width: '100%', height: 360, border: 0, borderRadius: 2 }}
      />
    </PageSection>
  );
}
