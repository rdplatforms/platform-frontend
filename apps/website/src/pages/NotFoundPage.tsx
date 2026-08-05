import { Box, Stack, Typography } from '@mui/material';
import { Button } from '@rdplatforms/ui';

export function NotFoundPage() {
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
        <Typography color="text.secondary">This page doesn&apos;t exist.</Typography>
        <Button href="/">Back to Home</Button>
      </Stack>
    </Box>
  );
}
