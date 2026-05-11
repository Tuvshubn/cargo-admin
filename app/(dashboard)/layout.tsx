'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Box, CircularProgress } from '@mui/material';
import Sidebar from '@/components/layout/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  if (!user) {
    return (
      <Box sx={{ display:'flex', justifyContent:'center', alignItems:'center', minHeight:'100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display:'flex', height:'100vh', overflow:'hidden', bgcolor:'background.default' }}>
      <Sidebar />
      <Box component="main" sx={{ flex:1, overflow:'auto', bgcolor:'grey.50' }}>
        <Box sx={{ p:3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
