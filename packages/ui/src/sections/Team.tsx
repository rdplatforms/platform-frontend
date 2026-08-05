import { Avatar, Grid, Skeleton, Stack, Typography } from '@mui/material';
import { useTeam } from '@rdplatforms/hooks';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function Team({ business, config }: SectionProps) {
  const { data: members, isLoading } = useTeam(business.id);

  return (
    <PageSection id="team" tone="subtle">
      <SectionTitle title={config.title ?? 'Meet The Team'} subtitle={config.subtitle} />

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
                  {member.role}
                </Typography>
                {member.bio ? (
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
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
