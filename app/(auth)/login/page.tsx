'use client';
import { Box, Card, CardContent, TextField, Button, Typography, Alert, CircularProgress, InputAdornment, IconButton, Divider } from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, LocalShipping } from '@mui/icons-material';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try { await login(email, password); }
    catch (err: unknown) {
      const msg = (err as {response?: {data?: {message?: string}}})?.response?.data?.message;
      setError(msg || (err instanceof Error ? err.message : 'Нэвтрэх боломжгүй'));
    }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #0F172A 0%, #1E3A5F 50%, #0F172A 100%)',
    }}>
      {/* Left panel */}
      <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', px: 8, position: 'relative', overflow: 'hidden' }}>
        {/* Background decoration */}
        <Box sx={{ position: 'absolute', top: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(37,99,235,0.08)' }} />
        <Box sx={{ position: 'absolute', bottom: -50, right: -50, width: 300, height: 300, borderRadius: '50%', background: 'rgba(59,130,246,0.06)' }} />

        <Box sx={{ position: 'relative' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 5 }}>
            <Box sx={{ width: 48, height: 48, borderRadius: 3, background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LocalShipping sx={{ color: '#fff', fontSize: 26 }} />
            </Box>
            <Box>
              <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.3rem' }}>МонтоТрейд</Typography>
              <Typography sx={{ color: '#60A5FA', fontSize: '0.8rem', fontWeight: 500 }}>Cargo Management System</Typography>
            </Box>
          </Box>

          <Typography variant="h3" sx={{ color: '#fff', fontWeight: 800, lineHeight: 1.2, mb: 2 }}>
            Карго удирдлагын<br />
            <Box component="span" sx={{ background: 'linear-gradient(135deg, #60A5FA, #818CF8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              систем
            </Box>
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.7, maxWidth: 400 }}>
            Солонгосоос Монгол хүртэлх карго ачааны бүртгэл, хяналт, хүргэлтийг нэг дороос удирдана.
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, mt: 5 }}>
            {[['Хурдан', 'Бодит цагийн хяналт'], ['Найдвартай', 'Аюулгүй өгөгдөл'], ['Хялбар', 'Энгийн интерфейс']].map(([title, sub]) => (
              <Box key={title}>
                <Typography sx={{ color: '#E2E8F0', fontWeight: 700, fontSize: '0.9rem' }}>{title}</Typography>
                <Typography sx={{ color: '#64748B', fontSize: '0.75rem' }}>{sub}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right panel */}
      <Box sx={{ width: { xs: '100%', md: 480 }, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, background: { xs: 'transparent', md: 'rgba(255,255,255,0.02)' }, borderLeft: { md: '1px solid rgba(255,255,255,0.06)' } }}>
        <Card sx={{ width: '100%', maxWidth: 400, borderRadius: 3, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)' }}>
          <CardContent sx={{ p: 4 }}>
            {/* Mobile logo */}
            <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1.5, mb: 3 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: 2, background: 'linear-gradient(135deg, #2563EB, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LocalShipping sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Typography sx={{ fontWeight: 800 }}>МонтоТрейд</Typography>
            </Box>

            <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, color: '#0F172A' }}>Нэвтрэх</Typography>
            <Typography sx={{ color: '#64748B', fontSize: '0.875rem', mb: 3 }}>Системд нэвтрэхийн тулд мэдээллээ оруулна уу</Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2, fontSize: '0.85rem' }}>{error}</Alert>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth label="Имэйл хаяг" type="email" value={email}
                onChange={e => setEmail(e.target.value)} required size="medium"
                InputProps={{ startAdornment: <InputAdornment position="start"><Email sx={{ color: '#94A3B8', fontSize: 20 }} /></InputAdornment> }}
              />
              <TextField
                fullWidth label="Нууц үг" type={showPass ? 'text' : 'password'}
                value={password} onChange={e => setPassword(e.target.value)} required
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock sx={{ color: '#94A3B8', fontSize: 20 }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setShowPass(p => !p)}>
                        {showPass ? <VisibilityOff sx={{ fontSize: 18 }} /> : <Visibility sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
                sx={{ mt: 0.5, py: 1.5, fontSize: '0.95rem', borderRadius: 2 }}>
                {loading ? <CircularProgress size={22} color="inherit" /> : 'Нэвтрэх'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography sx={{ color: '#94A3B8', fontSize: '0.75rem', px: 1 }}>Demo бүртгэл</Typography>
            </Divider>

            <Box sx={{ background: '#F8FAFC', borderRadius: 2, p: 2, border: '1px solid #E2E8F0' }}>
              <Typography sx={{ fontSize: '0.78rem', color: '#475569', mb: 1, fontWeight: 600 }}>Туршилтын нэвтрэлт:</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>📧 admin@cargo.mn</Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#64748B' }}>🔑 admin123!</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
