import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, TextField } from '@mui/material';

/** A mobile-number lookup, navigating to /<number> — shared by NotFoundPage and the showcase HomePage rather than duplicated in both. */
export function CardLookupForm() {
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
  );
}
