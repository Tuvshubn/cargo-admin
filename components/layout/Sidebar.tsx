'use client';
import {
  Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Typography, Avatar, Tooltip, IconButton, Divider, Drawer
} from '@mui/material';
import {
  Dashboard, People, Inventory, AllInbox, Assessment,
  LocalShipping, Security, DeliveryDining, Logout, Menu as MenuIcon
} from '@mui/icons-material';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const W = 240;

const NAV = [
  { label: 'Дашбоард',        icon: <Dashboard fontSize="small"/>,      path: '/dashboard',   roles: ['admin','driver','delivery'] },
  { label: 'Падан / Ачаанууд', icon: <Inventory fontSize="small"/>,      path: '/parcels',     roles: ['admin','driver'] },
  { label: 'Карго багцлах',   icon: <AllInbox fontSize="small"/>,       path: '/batches',     roles: ['admin'] },
  { label: 'Хүргэлт',         icon: <DeliveryDining fontSize="small"/>,  path: '/deliveries',  roles: ['admin','delivery'] },
  { label: 'Тайлан',          icon: <Assessment fontSize="small"/>,     path: '/reports',     roles: ['admin'] },
  { label: 'Хэрэглэгчид',     icon: <People fontSize="small"/>,         path: '/users',       roles: ['admin'] },
  { label: 'Эрхийн тохиргоо', icon: <Security fontSize="small"/>,       path: '/permissions', roles: ['admin'] },
];

const ROLE_COLOR: Record<string,string> = { admin:'#3B82F6', driver:'#F59E0B', delivery:'#10B981' };
const ROLE_LABEL: Record<string,string> = { admin:'Админ', driver:'Жолооч', delivery:'Хүргэгч' };

function NavContent({ onNav }: { onNav?: ()=>void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const nav = NAV.filter(n => n.roles.includes(user?.role || ''));
  const rc = ROLE_COLOR[user?.role||'admin'];

  return (
    <Box sx={{
      width: W, height: '100vh', display: 'flex', flexDirection: 'column',
      bgcolor: '#0F172A', overflow: 'hidden',
    }}>
      {/* Logo */}
      <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 60, flexShrink: 0 }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <LocalShipping sx={{ color: '#fff', fontSize: 18 }} />
        </Box>
        <Box>
          <Typography sx={{ color: '#F1F5F9', fontWeight: 800, fontSize: '0.88rem', lineHeight: 1.2 }}>МонтоТрейд</Typography>
          <Typography sx={{ color: '#475569', fontSize: '0.62rem', letterSpacing: 0.3 }}>Cargo Admin</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />

      {/* Nav */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, pt: 2, pb: 1 }}>
        <Typography sx={{ color: '#334155', fontSize: '0.58rem', fontWeight: 700, letterSpacing: 2, px: 1, mb: 1.5, textTransform: 'uppercase' }}>
          Үндсэн цэс
        </Typography>
        <List disablePadding sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {nav.map(item => {
            const active = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link} href={item.path}
                  onClick={onNav}
                  sx={{
                    borderRadius: 1.5, px: 1.5, py: 0.85, minHeight: 38,
                    bgcolor: active ? 'rgba(59,130,246,0.18)' : 'transparent',
                    '&:hover': { bgcolor: active ? 'rgba(59,130,246,0.22)' : 'rgba(255,255,255,0.05)' },
                    transition: 'background 0.15s',
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 30, color: active ? '#60A5FA' : '#4B5563' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      fontWeight: active ? 700 : 400,
                      color: active ? '#E2E8F0' : '#6B7280',
                    }}
                  />
                  {active && (
                    <Box sx={{ width: 3, height: 18, borderRadius: 99, bgcolor: '#3B82F6', flexShrink: 0, ml: 0.5 }} />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', flexShrink: 0 }} />

      {/* User */}
      <Box sx={{ p: 1.5, flexShrink: 0 }}>
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1.5,
          px: 1.5, py: 1, borderRadius: 1.5,
          bgcolor: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <Avatar sx={{ width: 30, height: 30, bgcolor: `${rc}22`, color: rc, fontSize: '0.75rem', fontWeight: 800, border: `1.5px solid ${rc}55`, flexShrink: 0 }}>
            {user?.name?.[0]?.toUpperCase()}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ color: '#E2E8F0', fontSize: '0.8rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </Typography>
            <Typography sx={{ color: rc, fontSize: '0.62rem', fontWeight: 700 }}>
              {ROLE_LABEL[user?.role||''] || user?.role}
            </Typography>
          </Box>
          <Tooltip title="Гарах">
            <IconButton
              size="small"
              onClick={() => { logout(); router.push('/login'); }}
              sx={{ color: '#4B5563', '&:hover': { color: '#EF4444', bgcolor: 'rgba(239,68,68,0.1)' }, p: 0.5 }}
            >
              <Logout sx={{ fontSize: 15 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Desktop sidebar — CSS display, no JS detection */}
      <Box sx={{
        width: W, flexShrink: 0,
        display: { xs: 'none', lg: 'block' },
      }}>
        <NavContent />
      </Box>

      {/* Mobile drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: { lg: 'none' } }}
        PaperProps={{ sx: { bgcolor: 'transparent', boxShadow: 'none' } }}
      >
        <NavContent onNav={() => setOpen(false)} />
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Mobile topbar */}
        <Box sx={{
          display: { xs: 'flex', lg: 'none' },
          px: 2, py: 1.5, bgcolor: '#fff',
          borderBottom: '1px solid #E2E8F0',
          alignItems: 'center', gap: 1.5, minHeight: 56, flexShrink: 0,
        }}>
          <IconButton onClick={() => setOpen(true)} size="small" sx={{ color: '#374151' }}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ width: 26, height: 26, borderRadius: 1, bgcolor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LocalShipping sx={{ color: '#fff', fontSize: 15 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem', color: '#0F172A' }}>МонтоТрейд</Typography>
        </Box>

        {/* Page content */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
