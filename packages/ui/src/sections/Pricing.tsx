import { Grid, Skeleton, Typography } from '@mui/material';
import { useServices } from '@rdplatforms/hooks';
import { formatCurrency } from '@rdplatforms/utils';
import { Card } from '../primitives/Card';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function Pricing({ business, config }: SectionProps) {
  const { data: services, isLoading } = useServices(business.id);
  const priced = (services ?? []).filter((service) => Boolean(service.price));

  return (
    <PageSection id="pricing">
      <SectionTitle title={config.title ?? 'Pricing'} subtitle={config.subtitle} />

      {isLoading ? (
        <Skeleton variant="rounded" height={220} />
      ) : (
        <Grid container spacing={3}>
          {priced.map((service) => (
            <Grid item xs={12} sm={6} md={4} key={service.id}>
              <Card
                title={service.name}
                description={service.description}
                footer={
                  <Typography variant="h6" color="primary.main" fontWeight={800}>
                    {formatCurrency(service.price as number, service.currency)}
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
