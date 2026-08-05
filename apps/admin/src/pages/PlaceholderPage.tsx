import { Paper, Stack, Typography } from '@mui/material';
import { Badge } from '@rdplatforms/ui';

export interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Typography variant="h4" fontWeight={700}>
          {title}
        </Typography>
        <Badge label="Coming Soon" color="default" />
      </Stack>
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Typography color="text.secondary">{description}</Typography>
      </Paper>
    </Stack>
  );
}
