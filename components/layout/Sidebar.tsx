'use client';
import { Box, Drawer, IconButton, Avatar, Tooltip, Typography } from '@mui/material';
import { Dashboard, People, Inventory, AllInbox, Assessment, LocalShipping, Security, DeliveryDining, Logout, Menu as MenuIcon } from '@mui/icons-material';
import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

const W = 240;

const NAV = [
  { label: 'Дашбоард',        icon: Dashboard,      path: '/dashboard',   roles: ['admin','driver','delivery'] },
  { label: 'Падан / Ачаанууд', icon: Inventory,      path: '/parcels',     roles: ['admin','driver'] },
  { label: 'Карго багцлах',   icon: AllInbox,       path: '/batches',     roles: ['admin'] },
  { label: 'Хүргэлт',         icon: DeliveryDining, path: '/deliveries',  roles: ['admin','delivery'] },
  { label: 'Тайлан',          icon: Assessment,     path: '/reports',     roles: ['admin'] },
  { label: 'Хэрэглэгчид',     icon: People,         path: '/users',       roles: ['admin'] },
  { label: 'Эрхийн тохиргоо', icon: Security,       path: '/permissions', roles: ['admin'] },
];

const ROLE_COLOR: Record<string,string> = { admin:'#3B82F6', driver:'#F59E0B', delivery:'#10B981' };
const ROLE_LABEL: Record<string,string> = { admin:'Админ', driver:'Жолооч', delivery:'Хүргэгч' };

function NavList({ onNav }: { onNav?: ()=>void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const nav = NAV.filter(n => n.roles.includes(user?.role||''));
  const rc = ROLE_COLOR[user?.role||'admin'];

  return (
    <div style={{
      width: W, height: '100vh', display: 'flex', flexDirection: 'column',
      background: '#0F172A', overflow: 'hidden', fontFamily: 'Inter, Noto Sans, sans-serif',
    }}>
      {/* Logo */}
      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(255,255,255,0.07)', minHeight: 60 }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <LocalShipping style={{ color: '#fff', fontSize: 18 }} />
        </div>
        <div>
          <div style={{ color: '#F1F5F9', fontWeight: 800, fontSize: 14, lineHeight: '18px' }}>МонтоТрейд</div>
          <div style={{ color: '#475569', fontSize: 11 }}>Cargo Admin</div>
        </div>
      </div>

      {/* Nav */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px 8px' }}>
        <div style={{ color: '#334155', fontSize: 10, fontWeight: 700, letterSpacing: 2, padding: '0 8px 12px', textTransform: 'uppercase' }}>
          Үндсэн цэс
        </div>
        {nav.map(item => {
          const active = pathname === item.path || pathname.startsWith(item.path + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={onNav}
              style={{ textDecoration: 'none', display: 'block', marginBottom: 2 }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10,
                background: active ? 'rgba(59,130,246,0.18)' : 'transparent',
                cursor: 'pointer', transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = active ? 'rgba(59,130,246,0.18)' : 'transparent'; }}
              >
                <Icon style={{ fontSize: 18, color: active ? '#60A5FA' : '#4B5563', flexShrink: 0 }} />
                <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, color: active ? '#E2E8F0' : '#6B7280', flex: 1 }}>
                  {item.label}
                </span>
                {active && <div style={{ width: 3, height: 18, borderRadius: 99, background: '#3B82F6', flexShrink: 0 }} />}
              </div>
            </Link>
          );
        })}
      </div>

      {/* User */}
      <div style={{ padding: '8px 12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '8px 10px', borderRadius: 10,
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{
            width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: `${rc}22`, border: `1.5px solid ${rc}55`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: rc, fontSize: 13, fontWeight: 800,
          }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#E2E8F0', fontSize: 13, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.name}
            </div>
            <div style={{ color: rc, fontSize: 11, fontWeight: 700 }}>
              {ROLE_LABEL[user?.role||''] || user?.role}
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/login'); }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex', alignItems: 'center', color: '#4B5563' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#EF4444'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#4B5563'; (e.currentTarget as HTMLButtonElement).style.background = 'none'; }}
            title="Гарах"
          >
            <Logout style={{ fontSize: 16 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#F8FAFC' }}>
      {/* Desktop */}
      <Box sx={{ width: W, flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
        <NavList />
      </Box>

      {/* Mobile drawer */}
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        sx={{ display: { lg: 'none' } }}
        PaperProps={{ sx: { boxShadow: 'none' } }}
      >
        <NavList onNav={() => setOpen(false)} />
      </Drawer>

      {/* Main */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        {/* Mobile topbar */}
        <Box sx={{
          display: { xs: 'flex', lg: 'none' }, alignItems: 'center', gap: 1.5,
          px: 2, minHeight: 56, bgcolor: '#fff', borderBottom: '1px solid #E2E8F0', flexShrink: 0,
        }}>
          <IconButton size="small" onClick={() => setOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Box sx={{ width: 26, height: 26, borderRadius: 1, bgcolor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LocalShipping sx={{ color: '#fff', fontSize: 15 }} />
          </Box>
          <Typography sx={{ fontWeight: 800, fontSize: '0.9rem' }}>МонтоТрейд</Typography>
        </Box>

        <Box sx={{ flex: 1, overflowY: 'auto', p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
