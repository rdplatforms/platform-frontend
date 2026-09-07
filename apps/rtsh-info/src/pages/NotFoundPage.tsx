import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';

/** Reached only for genuinely unmatched paths (e.g. bare "/") — a bad :identifier is handled inline by CardPage instead, since that still matches the route. */
export function NotFoundPage() {
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      navigate(`/${trimmed}`);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3 }}>
      <Stack spacing={2} sx={{ width: '100%', maxWidth: 360 }} alignItems="center" textAlign="center">
        <Typography variant="h6" fontWeight={700}>
          Nothing here
        </Typography>
        <Typography color="text.secondary">
          Scan a card's QR code, or enter a mobile number to look one up.
        </Typography>
        <Stack component="form" onSubmit={onSubmit} direction="row" spacing={1} sx={{ width: '100%' }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Mobile number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            slotProps={{ htmlInput: { inputMode: 'tel' } }}
          />
          <Button type="submit" variant="contained" disabled={!value.trim()}>
            Go
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
