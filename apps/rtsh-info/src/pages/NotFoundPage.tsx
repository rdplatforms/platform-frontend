import { Box, Typography } from '@mui/material';

/** Reached only for genuinely unmatched paths (e.g. bare "/") — a bad :identifier is handled inline by CardPage instead, since that still matches the route. */
export function NotFoundPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3, textAlign: 'center' }}>
      <Typography variant="h6" fontWeight={700}>
        Nothing here
      </Typography>
      <Typography color="text.secondary">Scan a card's QR code to view it.</Typography>
    </Box>
  );
}
