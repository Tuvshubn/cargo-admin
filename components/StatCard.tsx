import { Card, CardContent, Box, Typography, Avatar } from '@mui/material';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  color: string;
  trend?: { value: number; label: string };
}

export default function StatCard({ label, value, sub, icon, color }: StatCardProps) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: '1.9rem', fontWeight: 800, color: '#0F172A', lineHeight: 1, mb: 0.5 }}>
              {value}
            </Typography>
            {sub && <Typography sx={{ fontSize: '0.78rem', color: '#94A3B8' }}>{sub}</Typography>}
          </Box>
          <Box sx={{ width: 44, height: 44, borderRadius: 2.5, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
