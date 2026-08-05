import { Card, CardContent, Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface Props { label: string; value: string | number; sub?: string; icon: ReactNode; color: string; }

export default function StatCard({ label, value, sub, icon, color }: Props) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.8, mb: 1 }}>
              {label}
            </Typography>
            <Typography sx={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1, mb: 0.5 }}>
              {value}
            </Typography>
            {sub && <Typography sx={{ fontSize: '0.75rem', color: '#94A3B8', lineHeight: 1.4 }}>{sub}</Typography>}
          </Box>
          <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}
