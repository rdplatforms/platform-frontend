import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import { useAuth } from '../auth/authContext';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupIcon from '@mui/icons-material/Group';
import StoreIcon from '@mui/icons-material/Store';
import PaletteIcon from '@mui/icons-material/Palette';

const DRAWER_WIDTH = 240;

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: DashboardIcon },
  { label: 'Pages', href: '/pages', icon: ArticleIcon },
  { label: 'Media', href: '/media', icon: PermMediaIcon },
  { label: 'Services', href: '/services', icon: DesignServicesIcon },
  { label: 'Business', href: '/business', icon: StoreIcon },
  { label: 'Theme', href: '/theme', icon: PaletteIcon },
  { label: 'Users', href: '/users', icon: GroupIcon },
  { label: 'Settings', href: '/settings', icon: SettingsIcon },
];

/**
 * Admin is mostly scaffolded, not built: this shell exists so routing,
 * navigation, and page structure are already correct once each section
 * gets real functionality (see TASKS.md). Real auth (TASK-008) gates
 * every route here via RequireAuth in router.tsx.
 */
export function AdminLayout() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700}>
            RD Platforms Admin
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

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: DRAWER_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const selected = location.pathname === item.href;
            return (
              <ListItemButton
                key={item.href}
                component={RouterLink}
                to={item.href}
                selected={selected}
              >
                <ListItemIcon>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
