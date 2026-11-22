import { useState, type ReactNode } from 'react';
import { Link as RouterLink, Outlet, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/theme';

const DRAWER_WIDTH = 220;

export interface SideMenuItem {
  label: string;
  path: string;
  icon: ReactNode;
}

/** Top bar + hamburger side menu + content area. Used by both the customer and admin screens. */
export default function SideMenuLayout({ menu }: { menu: SideMenuItem[] }) {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: colors.brownDark, borderBottom: '1px solid rgba(255,255,255,0.15)' }}
      >
        <Toolbar sx={{ minHeight: 56 }}>
          <IconButton
            color="inherit"
            edge="start"
            aria-label="Toggle menu"
            onClick={() => setMenuOpen((prev) => !prev)}
            sx={{ mr: 1 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 700, flexGrow: 1 }}>
            Insurance Management System
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ flex: 1, display: 'flex', minHeight: 0 }}>
        {/* Left side menu: width becomes 0 when hidden, so the content takes the full width */}
        <Box
          component="nav"
          sx={{
            width: menuOpen ? DRAWER_WIDTH : 0,
            flexShrink: 0,
            overflow: 'hidden',
            bgcolor: colors.brownDark,
            transition: 'width 0.2s ease',
          }}
        >
          <List sx={{ width: DRAWER_WIDTH, pt: 1 }}>
            {menu.map((item) => (
              <ListItemButton
                key={item.path}
                component={RouterLink}
                to={item.path}
                selected={pathname.startsWith(item.path)}
                sx={{
                  color: '#FFFFFF',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                  '&.Mui-selected': { bgcolor: colors.tan },
                  '&.Mui-selected:hover': { bgcolor: colors.tan },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>

        <Box component="main" sx={{ flex: 1, minWidth: 0, overflow: 'auto', p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}