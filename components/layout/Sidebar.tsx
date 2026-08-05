'use client';
import {
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Tooltip, Divider, IconButton, Drawer
} from '@mui/material';
import {
  Dashboard, People, Inventory, AllInbox, Assessment,
  LocalShipping, Security, DeliveryDining, Logout, Menu
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const W = 240;

const NAV = [
  { label: 'Дашбоард',        icon: <Dashboard fontSize="small"/>,     path: '/dashboard',   roles: ['admin','driver','delivery'] },
  { label: 'Падан / Ачаанууд', icon: <Inventory fontSize="small"/>,     path: '/parcels',     roles: ['admin','driver'] },
  { label: 'Карго багцлах',   icon: <AllInbox fontSize="small"/>,      path: '/batches',     roles: ['admin'] },
  { label: 'Хүргэлт',         icon: <DeliveryDining fontSize="small"/>, path: '/deliveries',  roles: ['admin','delivery'] },
  { label: 'Тайлан',          icon: <Assessment fontSize="small"/>,    path: '/reports',     roles: ['admin'] },
  { label: 'Хэрэглэгчид',     icon: <People fontSize="small"/>,        path: '/users',       roles: ['admin'] },
  { label: 'Эрхийн тохиргоо', icon: <Security fontSize="small"/>,      path: '/permissions', roles: ['admin'] },
];

const ROLE_COLOR: Record<string,string> = { admin:'#3B82F6', driver:'#F59E0B', delivery:'#10B981' };
const ROLE_LABEL: Record<string,string> = { admin:'Админ', driver:'Жолооч', delivery:'Хүргэгч' };

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const nav = NAV.filter(n => n.roles.includes(user?.role || ''));

  return (
    <Box sx={{ width: W, height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0F172A' }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 64 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <LocalShipping sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ color: '#F1F5F9', fontWeight: 800, fontSize: '0.9rem', lineHeight: 1.2 }}>МонтоТрейд</Typography>
          <Typography sx={{ color: '#475569', fontSize: '0.65rem' }}>Cargo Admin</Typography>
        </Box>
        {onClose && (
          <IconButton size="small" onClick={onClose} sx={{ color: '#475569' }}>
            <Menu fontSize="small" />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* Nav items */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 2 }}>
        <Typography sx={{ color: '#334155', fontSize: '0.6rem', fontWeight: 700, letterSpacing: 1.5, px: 1.5, mb: 1.5, textTransform: 'uppercase' }}>
          Үндсэн цэс
        </Typography>
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {nav.map(item => {
            const active = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link} href={item.path}
                  onClick={onClose}
                  sx={{
                    borderRadius: 1.5, px: 1.5, py: 0.9, minHeight: 40,
                    bgcolor: active ? 'rgba(59,130,246,0.15)' : 'transparent',
                    '&:hover': { bgcolor: active ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.04)' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32, color: active ? '#60A5FA' : '#475569' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: active ? 700 : 500,
                      color: active ? '#E2E8F0' : '#94A3B8',
                    }}
                  />
                  {active && <Box sx={{ width: 3, height: 18, borderRadius: 2, bgcolor: '#3B82F6', flexShrink: 0 }} />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* User */}
      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, py: 1, borderRadius: 1.5, bgcolor: 'rgba(255,255,255,0.04)' }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: `${ROLE_COLOR[user?.role||'admin']}22`, fontSize: '0.75rem', fontWeight: 700, color: ROLE_COLOR[user?.role||'admin'], border: `1.5px solid ${ROLE_COLOR[user?.role||'admin']}44` }}>
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: '#E2E8F0', fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</Typography>
            <Typography sx={{ color: ROLE_COLOR[user?.role||'admin'], fontSize: '0.65rem', fontWeight: 700 }}>{ROLE_LABEL[user?.role||''] || user?.role}</Typography>
          </Box>
          <Tooltip title="Гарах">
            <IconButton size="small" onClick={() => { logout(); router.push('/login'); }} sx={{ color: '#475569', '&:hover': { color: '#EF4444' }, p: 0.5 }}>
              <Logout sx={{ fontSize: 16 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsNarrow(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!mounted) {
    return (
      <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#F8FAFC' }}>
        <Box sx={{ width: W, bgcolor: '#0F172A', flexShrink: 0 }} />
        <Box sx={{ flex: 1, p: 3 }}>{children}</Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Desktop sidebar */}
      {!isNarrow && (
        <Box sx={{ width: W, flexShrink: 0, overflow: 'hidden' }}>
          <SidebarContent />
        </Box>
      )}

      {/* Mobile drawer */}
      {isNarrow && (
        <Drawer open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { bgcolor: 'transparent' } }}>
          <SidebarContent onClose={() => setMobileOpen(false)} />
        </Drawer>
      )}

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Mobile topbar */}
        {isNarrow && (
          <Box sx={{ px: 2, py: 1.5, bgcolor: '#fff', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 56 }}>
            <IconButton onClick={() => setMobileOpen(true)} size="small">
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
