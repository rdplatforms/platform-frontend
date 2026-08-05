import { Grid, Rating, Skeleton, Stack, Typography } from '@mui/material';
import { useTestimonials } from '@rdplatforms/hooks';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function Testimonials({ business, config }: SectionProps) {
  const { data: testimonials, isLoading } = useTestimonials(business.id);

  return (
    <PageSection id="testimonials" tone="subtle">
      <SectionTitle title={config.title ?? 'What People Say'} subtitle={config.subtitle} />

      {isLoading ? (
        <Skeleton variant="rounded" height={200} />
      ) : (
        <Grid container spacing={3}>
          {(testimonials ?? []).map((testimonial) => (
            <Grid item xs={12} md={4} key={testimonial.id}>
              <Stack
                spacing={1.5}
                sx={{ height: '100%', p: 3, bgcolor: 'background.paper', borderRadius: 2 }}
              >
                <Rating value={testimonial.rating} readOnly size="small" />
                <Typography variant="body1" fontStyle="italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  {testimonial.authorName}
                </Typography>
                {testimonial.authorRole ? (
                  <Typography variant="caption" color="text.secondary">
                    {testimonial.authorRole}
                  </Typography>
                ) : null}
              </Stack>
            </Grid>
          ))}
        </Grid>
      )}
    </PageSection>
  );
}
