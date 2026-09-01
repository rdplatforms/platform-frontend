import { Box, Grid, Typography } from '@mui/material';
import { useLocale } from '@rdplatforms/hooks';
import { getAboutHeading, resolveLocalizedText } from '@rdplatforms/utils';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function About({ business, config }: SectionProps) {
  const { locale } = useLocale();

  return (
    <PageSection id="about">
      <Grid container spacing={{ xs: 3, md: 6 }} alignItems="center">
        <Grid item xs={12} md={6}>
          <SectionTitle
            title={
              resolveLocalizedText(config.title, locale) ||
              getAboutHeading(business.displayName, locale)
            }
            align="left"
          />
          <Typography variant="body1" color="text.secondary">
            {resolveLocalizedText(business.description, locale)}
          </Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            component="img"
            src={business.logoUrl}
            alt={`${business.displayName} logo`}
            sx={{
              width: '100%',
              maxHeight: 320,
              objectFit: 'contain',
              borderRadius: 2,
              bgcolor: 'action.hover',
              p: 4,
            }}
          />
        </Grid>
      </Grid>
    </PageSection>
  );
}
