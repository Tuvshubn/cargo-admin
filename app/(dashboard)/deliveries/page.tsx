'use client';
import { Box, Card, CardContent, Typography, Stack, Chip, Button, Alert, CircularProgress, Grid, Avatar, Divider } from '@mui/material';
import { CheckCircle, LocalShipping, Phone, LocationOn } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { api, STATUS_LABELS, STATUS_COLORS } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function DeliveriesPage() {
  const { user } = useAuth();
  const [parcels, setParcels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string|null>(null);

  const fetch_ = async () => {
    setLoading(true);
    const { data } = await api.get('/deliveries');
    setParcels(data);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const markDelivered = async (id: string) => {
    if (!confirm('Хүргэгдсэн гэж тэмдэглэх үү?')) return;
    setMarking(id);
    await api.patch(`/deliveries/${id}/delivered`);
    setMarking(null);
    fetch_();
  };

  const pending = parcels.filter(p => p.status !== 'delivered');
  const done = parcels.filter(p => p.status === 'delivered');

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={800}>Хүргэлт</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label={`Хүлээгдэж буй: ${pending.length}`} color="warning" />
          <Chip label={`Хүргэгдсэн: ${done.length}`} color="success" />
        </Stack>
      </Stack>

      {loading ? <Box sx={{ textAlign: "center" }} py={8}><CircularProgress /></Box> : (
        <>
          {pending.length === 0 && (
            <Alert severity="success" sx={{ mb: 2 }}>Хүргэх ачаа байхгүй байна 🎉</Alert>
          )}
          <Grid container spacing={2}>
            {pending.map((p: any) => (
              <Grid item xs={12} sm={6} lg={4} key={p.id}>
                <Card sx={{ border: '2px solid', borderColor: 'warning.light' }}>
                  <CardContent sx={{ p: 2.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
                      <Typography fontWeight={800} color="primary.main">{p.tracking_code}</Typography>
                      <Chip size="small" label={STATUS_LABELS[p.status]} sx={{ bgcolor: STATUS_COLORS[p.status]+'22', color: STATUS_COLORS[p.status] }} />
                    </Stack>
                    <Divider sx={{ mb: 1.5 }} />
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>{p.mn_name?.[0]}</Avatar>
                        <Typography fontWeight={700}>{p.mn_name}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Phone sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="body2" color="primary.main" fontWeight={600}>{p.mn_phone}</Typography>
                      </Stack>
                      {p.mn_address && (
                        <Stack direction="row" spacing={0.5} alignItems="flex-start">
                          <LocationOn sx={{ fontSize: 14, color: 'text.secondary', mt: 0.2 }} />
                          <Typography variant="body2" color="text.secondary">{p.mn_address}</Typography>
                        </Stack>
                      )}
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">{p.quantity} ширхэг</Typography>
                        {p.remaining_fee > 0 && (
                          <Typography variant="caption" color="error.main" fontWeight={700}>
                            Үлдэгдэл: {parseInt(p.remaining_fee).toLocaleString()}₮
                          </Typography>
                        )}
                      </Stack>
                      {p.batch_code && <Typography variant="caption" color="text.secondary">Багц: {p.batch_code}</Typography>}
                    </Stack>
                    <Button
                      fullWidth variant="contained" color="success" size="small"
                      startIcon={marking===p.id ? <CircularProgress size={14} color="inherit"/> : <CheckCircle />}
                      onClick={() => markDelivered(p.id)}
                      disabled={marking === p.id}
                      sx={{ mt: 2 }}
                    >
                      Хүргэгдсэн
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {done.length > 0 && (
            <Box mt={4}>
              <Typography variant="h6" fontWeight={700} mb={2} color="success.main">✅ Хүргэгдсэн ({done.length})</Typography>
              <Grid container spacing={2}>
                {done.map((p: any) => (
                  <Grid item xs={12} sm={6} lg={4} key={p.id}>
                    <Card sx={{ opacity: 0.7 }}>
                      <CardContent sx={{ p: 2 }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography fontWeight={700} color="text.secondary">{p.tracking_code}</Typography>
                          <Chip size="small" label="Хүргэгдсэн" color="success" />
                        </Stack>
                        <Typography variant="body2" mt={1}>{p.mn_name} · {p.mn_phone}</Typography>
                        {p.collected_at && <Typography variant="caption" color="text.secondary">{new Date(p.collected_at).toLocaleString('mn-MN')}</Typography>}
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
