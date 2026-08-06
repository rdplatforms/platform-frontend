import { Box, Stack } from '@mui/material';
import { useLocale } from '@rdplatforms/hooks';
import { resolveLocalizedText, translateUi } from '@rdplatforms/utils';
import { Button } from '../primitives/Button';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function MapSection({ business, config }: SectionProps) {
  const { locale } = useLocale();
  const { mapEmbedUrl, directionsUrl } = business.contact.address;
  if (!mapEmbedUrl) {
    return null;
  }

  return (
    <PageSection id="map" tone="subtle">
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <SectionTitle
          title={resolveLocalizedText(config.title, locale) || translateUi('findUs', locale)}
          subtitle={resolveLocalizedText(config.subtitle, locale)}
          align="left"
        />
        {directionsUrl ? (
          <Button
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="outlined"
            sx={{ flexShrink: 0 }}
          >
            {translateUi('getDirections', locale)}
          </Button>
        ) : null}
      </Stack>
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
