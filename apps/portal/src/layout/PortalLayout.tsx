import { Outlet } from 'react-router-dom';
import { AppBar, Box, Button, Stack, Toolbar, Typography } from '@mui/material';
import { useBusinessContext } from '@rdplatforms/contexts';
import { useAuth } from '../auth/authContext';

export function PortalLayout() {
  const { business } = useBusinessContext();
  const { user, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700}>
            {business?.displayName} Portal
          </Typography>
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
