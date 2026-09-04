import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import { AppBar, Box, Button, Stack, Toolbar, Typography } from '@mui/material';
import { useBusinessContext } from '@rdplatforms/contexts';
import { useAuth } from '../auth/authContext';

export function PortalLayout() {
  const { business } = useBusinessContext();
  const { user, logout } = useAuth();
  const location = useLocation();

  const isOwner =
    user?.superAdmin ||
    user?.memberships.some((m) => m.businessId === business?.id && m.role === 'OWNER');

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={4} alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              {business?.displayName} Portal
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                component={RouterLink}
                to="/"
                color={location.pathname === '/' ? 'primary' : 'inherit'}
              >
                Dashboard
              </Button>
              {isOwner ? (
                <Button
                  component={RouterLink}
                  to="/staff"
                  color={location.pathname === '/staff' ? 'primary' : 'inherit'}
                >
                  Staff
                </Button>
              ) : null}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            {user ? (
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            ) : null}
            <Button size="small" onClick={logout}>
              Sign out
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ p: 4 }}>
        <Outlet />
      </Box>
    </Box>
  );
}
