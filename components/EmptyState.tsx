import { Box, Typography } from '@mui/material';
import { InboxOutlined } from '@mui/icons-material';
import { ReactNode } from 'react';

export default function EmptyState({ title = 'Мэдээлэл байхгүй', sub = '', icon }: { title?: string; sub?: string; icon?: ReactNode }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, color: '#CBD5E1' }}>
      {icon || <InboxOutlined sx={{ fontSize: 52, mb: 2, color: '#CBD5E1' }} />}
      <Typography sx={{ fontWeight: 600, color: '#94A3B8', fontSize: '0.95rem' }}>{title}</Typography>
      {sub && <Typography sx={{ color: '#CBD5E1', fontSize: '0.8rem', mt: 0.5 }}>{sub}</Typography>}
    </Box>
  );
}
