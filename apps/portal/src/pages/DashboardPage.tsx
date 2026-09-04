import { Paper, Stack, Typography } from '@mui/material';
import { useBusinessContext } from '@rdplatforms/contexts';
import { useAuth } from '../auth/authContext';

/**
 * Deliberately minimal (TASK-010 scope: prove login + business resolution
 * + membership authorization work together end-to-end). Real content —
 * the booking queue, billing, analytics — lands in later milestones
 * (TASK-011+).
 */
export function DashboardPage() {
  const { business } = useBusinessContext();
  const { user } = useAuth();
  const membership = user?.memberships.find((m) => m.businessId === business?.id);
  const role = user?.superAdmin ? 'Super Admin' : membership?.role;

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={700}>
        Welcome to {business?.displayName}
      </Typography>
      <Paper variant="outlined" sx={{ p: 4 }}>
        <Typography color="text.secondary">
          Signed in as {user?.email}
          {role ? ` — ${role}` : ''}.
        </Typography>
      </Paper>
    </Stack>
  );
}
