import { Grid, Skeleton, Typography } from '@mui/material';
import { useLocale, useServices } from '@rdplatforms/hooks';
import {
  formatCurrency,
  formatDurationMinutes,
  resolveLocalizedText,
  translateUi,
} from '@rdplatforms/utils';
import { Card } from '../primitives/Card';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function Services({ business, config }: SectionProps) {
  const { locale } = useLocale();
  const { data: services, isLoading } = useServices(business.id);

  return (
    <PageSection id="services" tone="subtle">
      <SectionTitle
        title={resolveLocalizedText(config.title, locale) || translateUi('ourServices', locale)}
        subtitle={resolveLocalizedText(config.subtitle, locale)}
      />

      {isLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Skeleton variant="rounded" height={260} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid container spacing={3}>
          {(services ?? []).map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card
                title={resolveLocalizedText(service.name, locale)}
                description={resolveLocalizedText(service.description, locale)}
                imageUrl={service.imageUrl}
                footer={
                  <Typography variant="subtitle2" color="primary.main" fontWeight={700}>
                    {service.price ? formatCurrency(service.price, service.currency) : 'Custom'}
                    {service.durationMinutes
                      ? ` · ${formatDurationMinutes(service.durationMinutes)}`
                      : ''}
                  </Typography>
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </PageSection>
  );
}
