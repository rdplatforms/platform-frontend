import { Box, Stack, Typography } from '@mui/material';
import { useLocale } from '@rdplatforms/hooks';
import { translateUi } from '@rdplatforms/utils';
import { Button } from '@rdplatforms/ui';

export function NotFoundPage() {
  const { locale } = useLocale();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        p: 4,
      }}
    >
      <Stack spacing={2} alignItems="center" textAlign="center">
        <Typography variant="h2" fontWeight={800}>
          404
        </Typography>
        <Typography color="text.secondary">{translateUi('pageNotFound', locale)}</Typography>
        <Button href="/">{translateUi('backToHome', locale)}</Button>
      </Stack>
    </Box>
  );
}
