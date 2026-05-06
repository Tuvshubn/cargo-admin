'use client';
import { Box, Grid, Card, CardContent, Typography, Stack, Chip, Button, Alert, CircularProgress, Avatar, Divider } from '@mui/material';
import { CheckCircle, Phone, LocationOn } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { api, STATUS_LABELS, STATUS_COLORS } from '@/lib/api';

type Parcel = { id:string; tracking_code:string; status:string; mn_name:string; mn_phone:string; mn_address?:string; quantity:number; remaining_fee:number; batch_code?:string; collected_at?:string };

export default function DeliveriesPage() {
  const [parcels, setParcels] = useState<Parcel[]>([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState<string|null>(null);

  const fetch_ = async () => {
    setLoading(true);
    const { data } = await api.get('/deliveries');
    setParcels(data);
    setLoading(false);
  };
  useEffect(()=>{ fetch_(); },[]);

  const markDelivered = async (id: string) => {
    if(!confirm('Хүргэгдсэн гэж тэмдэглэх үү?')) return;
    setMarking(id);
    await api.patch(`/deliveries/${id}/delivered`);
    setMarking(null); fetch_();
  };

  const pending = parcels.filter(p=>p.status!=='delivered');
  const done = parcels.filter(p=>p.status==='delivered');
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb:3 }}>
        <Typography variant="h5" sx={{ fontWeight:800 }}>Хүргэлт</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label={`Хүлээгдэж буй: ${pending.length}`} color="warning"/>
          <Chip label={`Хүргэгдсэн: ${done.length}`} color="success"/>
        </Stack>
      </Stack>
      {loading?<Box sx={{ textAlign:'center', py:8 }}><CircularProgress/></Box>:(
        <>
          {pending.length===0&&<Alert severity="success" sx={{ mb:2 }}>Хүргэх ачаа байхгүй байна 🎉</Alert>}
          <Grid container spacing={2}>
            {pending.map((p)=>(
              <Grid item xs={12} sm={6} lg={4} key={p.id}>
                <Card sx={{ border:'2px solid', borderColor:'warning.light', height:'100%' }}>
                  <CardContent sx={{ p:2.5 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb:1.5 }}>
                      <Typography color="primary.main" sx={{ fontWeight:800 }}>{p.tracking_code}</Typography>
                      <Chip size="small" label={STATUS_LABELS[p.status]} sx={{ bgcolor:STATUS_COLORS[p.status]+'22', color:STATUS_COLORS[p.status] }}/>
                    </Stack>
                    <Divider sx={{ mb:1.5 }}/>
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Avatar sx={{ width:24, height:24, fontSize:12 }}>{p.mn_name?.[0]}</Avatar>
                        <Typography sx={{ fontWeight:700 }}>{p.mn_name}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Phone sx={{ fontSize:14, color:'text.secondary' }}/>
                        <Typography variant="body2" color="primary.main" sx={{ fontWeight:600 }}>{p.mn_phone}</Typography>
                      </Stack>
                      {p.mn_address&&<Stack direction="row" spacing={0.5} alignItems="flex-start">
                        <LocationOn sx={{ fontSize:14, color:'text.secondary', mt:0.2 }}/>
                        <Typography variant="body2" color="text.secondary">{p.mn_address}</Typography>
                      </Stack>}
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="caption" color="text.secondary">{p.quantity} ширхэг</Typography>
                        {p.remaining_fee>0&&<Typography variant="caption" color="error.main" sx={{ fontWeight:700 }}>Үлдэгдэл: {parseInt(String(p.remaining_fee)).toLocaleString()}₮</Typography>}
                      </Stack>
                    </Stack>
                    <Button fullWidth variant="contained" color="success" size="small"
                      startIcon={marking===p.id?<CircularProgress size={14} color="inherit"/>:<CheckCircle/>}
                      onClick={()=>markDelivered(p.id)} disabled={marking===p.id} sx={{ mt:2 }}>
                      Хүргэгдсэн
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {done.length>0&&(
            <Box sx={{ mt:4 }}>
              <Typography variant="h6" color="success.main" sx={{ fontWeight:700, mb:2 }}>✅ Хүргэгдсэн ({done.length})</Typography>
              <Grid container spacing={2}>
                {done.map((p)=>(
                  <Grid item xs={12} sm={6} lg={4} key={p.id}>
                    <Card sx={{ opacity:0.7 }}><CardContent sx={{ p:2 }}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary" sx={{ fontWeight:700 }}>{p.tracking_code}</Typography>
                        <Chip size="small" label="Хүргэгдсэн" color="success"/>
                      </Stack>
                      <Typography variant="body2" sx={{ mt:1 }}>{p.mn_name} · {p.mn_phone}</Typography>
                      {p.collected_at&&<Typography variant="caption" color="text.secondary">{new Date(p.collected_at).toLocaleString('mn-MN')}</Typography>}
                    </CardContent></Card>
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
