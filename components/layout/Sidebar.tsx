'use client';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Tooltip, Divider, useMediaQuery, useTheme, IconButton
} from '@mui/material';
import {
  Dashboard, People, Inventory, AllInbox, Assessment,
  LocalShipping, Security, DeliveryDining, Logout, Menu, Close
} from '@mui/icons-material';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const DRAWER_W = 252;

const ALL_NAV = [
  { label: 'Дашбоард',        icon: <Dashboard />,     path: '/dashboard',   roles: ['admin','driver','delivery'] },
  { label: 'Падан / Ачаанууд', icon: <Inventory />,     path: '/parcels',     roles: ['admin','driver'] },
  { label: 'Карго багцлах',   icon: <AllInbox />,      path: '/batches',     roles: ['admin'] },
  { label: 'Хүргэлт',         icon: <DeliveryDining />,path: '/deliveries',  roles: ['admin','delivery'] },
  { label: 'Тайлан',          icon: <Assessment />,    path: '/reports',     roles: ['admin'] },
  { label: 'Хэрэглэгчид',     icon: <People />,        path: '/users',       roles: ['admin'] },
  { label: 'Эрхийн тохиргоо', icon: <Security />,      path: '/permissions', roles: ['admin'] },
];

const ROLE_LABELS: Record<string,string> = { admin: 'Админ', driver: 'Жолооч', delivery: 'Хүргэгч' };
const ROLE_COLORS: Record<string,string> = { admin: '#2563EB', driver: '#F59E0B', delivery: '#10B981' };

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [open, setOpen] = useState(false);

  const nav = ALL_NAV.filter(n => n.roles.includes(user?.role || ''));

  const drawerContent = (
    <Box sx={{
      width: DRAWER_W, height: '100vh', display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(180deg, #0F172A 0%, #1E293B 100%)',
      borderRight: 'none',
    }}>
      {/* Logo */}
      <Box sx={{ px: 3, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LocalShipping sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '0.95rem', lineHeight: 1.2 }}>МонтоТрейд</Typography>
          <Typography sx={{ color: '#64748B', fontSize: '0.7rem', fontWeight: 500 }}>Cargo System</Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={() => setOpen(false)} sx={{ ml: 'auto', color: '#64748B' }} size="small">
            <Close fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />

      {/* Nav */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1.5, px: 1.5 }}>
        <Typography sx={{ color: '#475569', fontSize: '0.65rem', fontWeight: 700, letterSpacing: 2, px: 1.5, mb: 1, textTransform: 'uppercase' }}>
          Үндсэн цэс
        </Typography>
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {nav.map(item => {
            const active = pathname.startsWith(item.path);
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  onClick={() => isMobile && setOpen(false)}
                  sx={{
                    borderRadius: 2, px: 1.5, py: 1,
                    background: active ? 'rgba(37,99,235,0.15)' : 'transparent',
                    '&:hover': { background: active ? 'rgba(37,99,235,0.2)' : 'rgba(255,255,255,0.05)' },
                    transition: 'all 0.15s',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36, color: active ? '#60A5FA' : '#64748B' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: active ? 700 : 500, color: active ? '#E2E8F0' : '#94A3B8' }}
                  />
                  {active && <Box sx={{ width: 3, height: 20, borderRadius: 2, background: '#2563EB', ml: 1 }} />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)', mx: 2 }} />

      {/* User */}
      <Box sx={{ p: 2 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          background: 'rgba(255,255,255,0.04)', borderRadius: 2,
          px: 1.5, py: 1, border: '1px solid rgba(255,255,255,0.07)'
        }}>
          <Avatar sx={{ width: 34, height: 34, background: `${ROLE_COLORS[user?.role||'admin']}22`, border: `2px solid ${ROLE_COLORS[user?.role||'admin']}44`, fontSize: '0.8rem', fontWeight: 700, color: ROLE_COLORS[user?.role||'admin'] }}>
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <Typography sx={{ color: '#E2E8F0', fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</Typography>
            <Typography sx={{ color: ROLE_COLORS[user?.role||'admin'], fontSize: '0.68rem', fontWeight: 700 }}>{ROLE_LABELS[user?.role||''] || user?.role}</Typography>
          </Box>
          <Tooltip title="Гарах">
            <IconButton size="small" onClick={() => { logout(); router.push('/login'); }} sx={{ color: '#64748B', '&:hover': { color: '#EF4444', background: 'rgba(239,68,68,0.1)' } }}>
              <Logout fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <Box sx={{ width: DRAWER_W, flexShrink: 0 }}>
          {drawerContent}
        </Box>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <Drawer open={open} onClose={() => setOpen(false)} PaperProps={{ sx: { background: 'transparent', boxShadow: 'none' } }}>
          {drawerContent}
        </Drawer>
      )}

      {/* Main */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: '#F8FAFC' }}>
        {/* Mobile topbar */}
        {isMobile && (
          <Box sx={{ px: 2, py: 1.5, background: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton onClick={() => setOpen(true)} size="small">
              <Menu />
            </IconButton>
            <Typography sx={{ fontWeight: 800, fontSize: '0.95rem' }}>МонтоТрейд</Typography>
          </Box>
        )}
        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
