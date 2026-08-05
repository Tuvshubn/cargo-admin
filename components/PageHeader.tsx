import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

export default function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3, gap: 2, flexWrap: 'wrap' }}>
      <Box>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.2px', lineHeight: 1.3 }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography sx={{ fontSize: '0.82rem', color: '#64748B', mt: 0.5 }}>{subtitle}</Typography>
        )}
      </Box>
      {action}
    </Box>
  );
}
