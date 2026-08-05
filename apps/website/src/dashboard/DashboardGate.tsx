import { useState, type FormEvent, type ReactNode } from 'react';
import { Alert, Box, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import type { Business } from '@rdplatforms/types';
import { useSettings } from '@rdplatforms/hooks';
import { Button } from '@rdplatforms/ui';
import { isDashboardAuthed, setDashboardAuthed } from './dashboardAuth';

export interface DashboardGateProps {
  business: Business;
  children: ReactNode;
}

export function DashboardGate({ business, children }: DashboardGateProps) {
  const { data: settings, isLoading } = useSettings(business.id);
  const [authed, setAuthed] = useState(() => isDashboardAuthed(business.id));
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!settings?.dashboardPasscode) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', mt: 10, px: 2 }}>
        <Alert severity="warning">
          The dashboard isn&apos;t enabled for {business.displayName} yet — no passcode is
          configured in this business&apos;s settings.
        </Alert>
      </Box>
    );
  }

  if (authed) {
    return <>{children}</>;
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (passcode === settings?.dashboardPasscode) {
      setDashboardAuthed(business.id);
      setAuthed(true);
      setError(undefined);
    } else {
      setError('Incorrect passcode.');
    }
  }

  return (
    <Box sx={{ maxWidth: 360, mx: 'auto', mt: { xs: 8, md: 14 }, px: 2 }}>
      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        <Typography variant="h5" fontWeight={700}>
          {business.displayName} Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Enter the dashboard passcode to continue.
        </Typography>
        <TextField
          label="Passcode"
          type="password"
          value={passcode}
          onChange={(event) => setPasscode(event.target.value)}
          error={Boolean(error)}
          helperText={error}
          autoFocus
          fullWidth
        />
        <Button type="submit" fullWidth>
          Unlock
        </Button>
      </Stack>
    </Box>
  );
}
