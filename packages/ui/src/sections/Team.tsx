import { Avatar, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useLocale, useTeam } from '@rdplatforms/hooks';
import { resolveLocalizedText, translateUi } from '@rdplatforms/utils';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function Team({ business, config }: SectionProps) {
  const { locale } = useLocale();
  const { data: members, isLoading } = useTeam(business.id);

  return (
    <PageSection id="team" tone="subtle">
      <SectionTitle
        title={resolveLocalizedText(config.title, locale) || translateUi('meetTheTeam', locale)}
        subtitle={resolveLocalizedText(config.subtitle, locale)}
      />

      {isLoading ? (
        <Skeleton variant="rounded" height={220} />
      ) : (
        <Grid container spacing={4}>
          {(members ?? []).map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <Stack spacing={1.5} alignItems="center" textAlign="center">
                <Avatar src={member.photoUrl} alt={member.name} sx={{ width: 96, height: 96 }} />
                <Typography variant="subtitle1" fontWeight={700}>
                  {member.name}
                </Typography>
                <Typography variant="body2" color="primary.main">
                  {resolveLocalizedText(member.role, locale)}
                </Typography>
                {member.bio ? (
                  <Typography variant="body2" color="text.secondary">
                    {resolveLocalizedText(member.bio, locale)}
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
