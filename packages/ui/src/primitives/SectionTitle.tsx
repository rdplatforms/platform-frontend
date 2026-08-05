import { Stack, Typography } from '@mui/material';

export interface SectionTitleProps {
  title?: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export function SectionTitle({ title, subtitle, align = 'center' }: SectionTitleProps) {
  if (!title && !subtitle) {
    return null;
  }
  return (
    <Stack spacing={1} sx={{ textAlign: align, mb: 5 }}>
      {title ? (
        <Typography variant="h3" component="h2" fontWeight={700}>
          {title}
        </Typography>
      ) : null}
      {subtitle ? (
        <Typography variant="body1" color="text.secondary">
          {subtitle}
        </Typography>
      ) : null}
    </Stack>
  );
}
