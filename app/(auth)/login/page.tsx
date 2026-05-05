'use client';
import { Box, Card, CardContent, TextField, Button, Typography, Avatar, Alert, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { LocalShipping, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
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
    catch (err: any) { setError(err.response?.data?.message || 'Нэвтрэх боломжгүй'); }
    finally { setLoading(false); }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0D47A1 0%, #1976D2 50%, #42A5F5 100%)',
      p: 2,
    }}>
      <Card sx={{ width: '100%', maxWidth: 400, borderRadius: 4, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box textAlign="center" mb={4}>
            <Avatar sx={{ bgcolor: 'primary.main', mx: 'auto', mb: 2, width: 60, height: 60 }}>
              <LocalShipping sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h5" fontWeight={800}>МонтоТрейд</Typography>
            <Typography color="text.secondary" variant="body2">Карго удирдлагын систем</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleLogin}>
            <TextField
              fullWidth label="Имэйл" type="email" value={email}
              onChange={e => setEmail(e.target.value)} required
              sx={{ mb: 2 }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Email color="action" /></InputAdornment> }}
            />
            <TextField
              fullWidth label="Нууц үг" type={showPass ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)} required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><Lock color="action" /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPass(p => !p)} edge="end">
                      {showPass ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button fullWidth type="submit" variant="contained" size="large" disabled={loading}
              sx={{ py: 1.5, fontSize: '1rem' }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : 'Нэвтрэх'}
            </Button>
          </Box>

          <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={3}>
            © 2024 МонтоТрейд Карго
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
