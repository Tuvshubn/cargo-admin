import { Box, Typography, Breadcrumbs } from '@mui/material';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 3 }}>
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, color: '#0F172A', letterSpacing: '-0.3px' }}>{title}</Typography>
        {subtitle && <Typography variant="body2" sx={{ mt: 0.5, color: '#64748B' }}>{subtitle}</Typography>}
      </Box>
      {action && <Box sx={{ mt: 0.5 }}>{action}</Box>}
    </Box>
  );
}
