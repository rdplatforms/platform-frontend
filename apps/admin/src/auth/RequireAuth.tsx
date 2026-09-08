import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, Stack, Typography } from '@mui/material';
import { useAuth } from './authContext';

/**
 * Checks two things, not one — found checking only isAuthenticated in a
 * retrospective audit: /auth/login is shared across every account type
 * (Super Admin, Business Owner, Staff), so a Business Owner's own valid
 * token would previously have passed straight through to the admin
 * shell. The backend independently rejects anything requiring
 * superAdmin() regardless, but the app's own gate should say so clearly
 * rather than silently render an admin UI for someone who can't
 * actually do anything in it.
 */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (!user?.superAdmin) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', p: 4 }}>
        <Stack spacing={1} alignItems="center" textAlign="center">
          <Typography variant="h5" fontWeight={700}>
            Super Admin only
          </Typography>
          <Typography color="text.secondary">
            This account doesn't have platform-wide access. Business Owners and Staff manage their own
            business through the portal instead.
          </Typography>
        </Stack>
      </Box>
    );
  }

  return children;
}
