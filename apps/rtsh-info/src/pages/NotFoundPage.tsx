import { Box, Stack, Typography } from '@mui/material';
import { CardLookupForm } from '../components/CardLookupForm';

/** Reached only for genuinely unmatched paths (e.g. /some/bad/path) — a bad :identifier is handled inline by CardPage instead, since that still matches the route, and "/" has its own HomePage (the showcase). */
export function NotFoundPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
      <Stack
        spacing={2}
        sx={{ width: '100%', maxWidth: 360 }}
        alignItems="center"
        textAlign="center"
      >
        <Typography variant="h6" fontWeight={700}>
          Nothing here
        </Typography>
        <Typography color="text.secondary">
          Scan a card's QR code, or enter a mobile number to look one up.
        </Typography>
        <CardLookupForm />
      </Stack>
    </Box>
  );
}
