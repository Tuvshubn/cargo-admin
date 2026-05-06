'use client';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, Avatar, Tooltip, Divider, Chip, useTheme
} from '@mui/material';
import {
  Dashboard, People, Inventory, AllInbox, BarChart, Security,
  LocalShipping, Brightness4, Brightness7, Logout, Menu, DeliveryDining,
  Warehouse, Assessment
} from '@mui/icons-material';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useMode } from '@/context/ThemeProvider';
import Link from 'next/link';

const DRAWER_W = 240;

const ALL_NAV = [
  { label: 'Дашбоард', icon: <Dashboard />, path: '/dashboard', roles: ['admin','driver','delivery'] },
  { label: 'Хэрэглэгчид', icon: <People />, path: '/users', roles: ['admin'] },
  { label: 'Эрхийн тохиргоо', icon: <Security />, path: '/permissions', roles: ['admin'] },
  { label: 'Падан / Ачаанууд', icon: <Inventory />, path: '/parcels', roles: ['admin','driver'] },
  { label: 'Карго багцлах', icon: <AllInbox />, path: '/batches', roles: ['admin'] },
  { label: 'Хүргэлт', icon: <DeliveryDining />, path: '/deliveries', roles: ['admin','delivery'] },
  { label: 'Тайлан', icon: <Assessment />, path: '/reports', roles: ['admin'] },
];

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { toggleMode, mode } = useMode();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();

  const navItems = ALL_NAV.filter(n => user && n.roles.includes(user.role));

  const DrawerContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
          <LocalShipping sx={{ fontSize: 20 }} />
        </Avatar>
        <Box>
          <Typography fontSize={15} lineHeight={1.2} sx={{ fontWeight:800 }}>МонтоТрейд</Typography>
          <Typography variant="caption" color="text.secondary">Карго систем</Typography>
        </Box>
      </Box>
      <Divider />

      <List sx={{ flex: 1, px: 1, py: 1.5 }}>
        {navItems.map(item => {
          const active = pathname.startsWith(item.path);
          return (
            <ListItem disablePadding key={item.path} sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link} href={item.path}
                selected={active}
                sx={{
                  borderRadius: 2,
                  '&.Mui-selected': {
                    bgcolor: 'primary.main',
                    color: '#fff',
                    '& .MuiListItemIcon-root': { color: '#fff' },
                    '&:hover': { bgcolor: 'primary.dark' },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: active ? 'inherit' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14, fontWeight: active ? 700 : 500 }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Divider />
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
          <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', fontSize: 13 }}>
            {user?.name[0]}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography fontSize={13} noWrap sx={{ fontWeight:700 }}>{user?.name}</Typography>
            <Chip label={user?.role} size="small" sx={{ fontSize: 10, height: 18 }} color={user?.role === 'admin' ? 'primary' : 'default'} />
          </Box>
          <Tooltip title="Гарах">
            <IconButton size="small" onClick={logout}><Logout fontSize="small" /></IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Desktop Drawer */}
      <Drawer variant="permanent" sx={{
        display: { xs: 'none', md: 'block' },
        width: DRAWER_W,
        '& .MuiDrawer-paper': { width: DRAWER_W, boxSizing: 'border-box', boxShadow: 'none', borderRight: '1px solid', borderColor: 'divider' },
      }}>
        <DrawerContent />
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
        sx={{ display: { md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_W } }}>
        <DrawerContent />
      </Drawer>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AppBar position="static" elevation={0} sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          color: 'text.primary',
        }}>
          <Toolbar>
            <IconButton sx={{ display: { md: 'none' }, mr: 1 }} onClick={() => setMobileOpen(true)}>
              <Menu />
            </IconButton>
            <Typography sx={{ fontWeight:700, flex: 1 }}>
              {navItems.find(n => pathname.startsWith(n.path))?.label || 'Дашбоард'}
            </Typography>
            <Tooltip title={mode === 'dark' ? 'Цайвар' : 'Харанхуй'}>
              <IconButton onClick={toggleMode}>
                {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flex: 1, overflow: 'auto', bgcolor: 'background.default', p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
