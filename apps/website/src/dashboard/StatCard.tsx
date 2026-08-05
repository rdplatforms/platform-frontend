import { Paper, Stack, Typography } from '@mui/material';

export interface StatCardProps {
  label: string;
  value: string;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, flex: '1 1 160px' }}>
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" fontWeight={700}>
          {value}
        </Typography>
      </Stack>
    </Paper>
  );
}
