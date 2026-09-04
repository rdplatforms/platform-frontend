import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { useBusinessContext } from '@rdplatforms/contexts';
import { hasMembership } from './portalAuth';
import { useAuth } from './authContext';

/**
 * Two independent checks, in order: (1) does this hostname even resolve
 * to a business's portal (Business.portalDomains) — if not, there's
 * nothing to log into; (2) is the signed-in user actually a member of
 * *this* business (or a Super Admin) — a valid token for a different
 * business must not grant access here. Business Owner/Staff-scoped
 * authorization always happens against the token's own membership
 * claims, never just "is there a valid token."
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const { business, isLoading, error } = useBusinessContext();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !business) {
    return (
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 480 }}>
          This domain isn&apos;t set up as a business portal yet.
        </Alert>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!user || !hasMembership(user, business.id)) {
    return (
      <Box
        sx={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Alert severity="warning" sx={{ maxWidth: 480 }}>
          <Typography fontWeight={700}>Access denied</Typography>
          Your account isn&apos;t associated with {business.displayName}.
        </Alert>
      </Box>
    );
  }

  return children;
}
