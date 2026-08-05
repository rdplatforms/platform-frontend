import { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import type { Business } from '@rdplatforms/types';
import { Button } from '../primitives/Button';

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarProps {
  business: Business;
  navItems: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
}

export function Navbar({ business, navItems, ctaLabel, ctaHref = '#contact' }: NavbarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  const brand = (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Box
        component="img"
        src={business.logoUrl}
        alt={`${business.displayName} logo`}
        sx={{ height: 36, width: 36, objectFit: 'contain' }}
      />
      <Typography variant="h6" component="span" fontWeight={700}>
        {business.displayName}
      </Typography>
    </Stack>
  );

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{ borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {brand}

        {isMobile ? (
          <IconButton onClick={() => setDrawerOpen(true)} aria-label="Open navigation menu">
            <MenuIcon />
          </IconButton>
        ) : (
          <Stack direction="row" spacing={3} alignItems="center">
            {navItems.map((item) => (
              <Typography
                key={item.href}
                component="a"
                href={item.href}
                sx={{ textDecoration: 'none', color: 'text.primary', fontWeight: 500 }}
              >
                {item.label}
              </Typography>
            ))}
            {ctaLabel ? (
              <Button href={ctaHref} size="medium">
                {ctaLabel}
              </Button>
            ) : null}
          </Stack>
        )}
      </Toolbar>

      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          <List>
            {navItems.map((item) => (
              <ListItemButton key={item.href} component="a" href={item.href}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
          {ctaLabel ? (
            <Box sx={{ p: 2 }}>
              <Button href={ctaHref} fullWidth>
                {ctaLabel}
              </Button>
            </Box>
          ) : null}
        </Box>
      </Drawer>
    </AppBar>
  );
}
