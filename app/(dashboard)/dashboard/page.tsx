'use client';
import { Box, Grid, Card, CardContent, Typography, Avatar, Stack, CircularProgress } from '@mui/material';
import { Inventory, CheckCircle, Warehouse, TrendingUp } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { api, STATUS_LABELS, STATUS_COLORS } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '@/context/AuthContext';

const MONTHS = ['1-р','2-р','3-р','4-р','5-р','6-р','7-р','8-р','9-р','10-р','11-р','12-р'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Record<string,Record<string,string>>>({});
  const [statusData, setStatusData] = useState<Array<{name:string;value:number;color:string}>>([]);
  const [monthly, setMonthly] = useState<Array<{month:string;карго:number;орлого:number}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') { setLoading(false); return; }
    Promise.all([api.get('/reports/summary'), api.get('/reports/status'), api.get('/reports/monthly')])
      .then(([s, st, m]) => {
        setSummary(s.data);
        setStatusData(st.data.map((r: Record<string,string>) => ({ name: STATUS_LABELS[r.status]||r.status, value: parseInt(r.count), color: STATUS_COLORS[r.status]||'#ccc' })));
        setMonthly(m.data.map((r: Record<string,string>) => ({ month: MONTHS[parseInt(r.month)-1], карго: parseInt(r.count), орлого: Math.round(parseInt(r.revenue)/1000000) })));
      }).finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', mt:8 }}><CircularProgress/></Box>;
  if (user?.role !== 'admin') return (
    <Box sx={{ textAlign:'center', mt:8 }}>
      <Typography variant="h5" fontWeight={700}>Тавтай морил, {user?.name}!</Typography>
      <Typography color="text.secondary" sx={{ mt:1 }}>Зүүн цэснээс шаардлагатай хэсгээ сонгоно уу.</Typography>
    </Box>
  );

  const p = summary?.parcels || {};
  const b = summary?.batches || {};
  const STATS = [
    { label:'Нийт ачаа', value:p.total||0, icon:<Inventory/>, color:'#1565C0', sub:`${b.total||0} багц` },
    { label:'Хүргэгдсэн', value:p.delivered||0, icon:<CheckCircle/>, color:'#2E7D32', sub:`${b.delivered||0} багц` },
    { label:'Агуулахад байгаа', value:p.in_warehouse||0, icon:<Warehouse/>, color:'#FF6F00', sub:`${p.unpaid_warehouse||0} төлөөгүй` },
    { label:'Нийт орлого', value:`${(parseInt(String(p.total_revenue||0))/1000000).toFixed(1)}М₮`, icon:<TrendingUp/>, color:'#7B1FA2', sub:`${(parseInt(String(p.total_remaining||0))/1000000).toFixed(1)}М₮ үлдэгдэл` },
  ];
  return (
    <Box>
      <Typography variant="h5" fontWeight={800} sx={{ mb:3 }}>Дашбоард</Typography>
      <Grid container spacing={2.5} sx={{ mb:3 }}>
        {STATS.map((s,i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <Card><CardContent sx={{ p:2.5 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="body2" color="text.secondary" fontWeight={600}>{s.label}</Typography>
                  <Typography variant="h4" fontWeight={800} sx={{ mt:0.5 }}>{s.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{s.sub}</Typography>
                </Box>
                <Avatar sx={{ bgcolor:s.color+'18', width:48, height:48 }}>
                  <Box sx={{ color:s.color }}>{s.icon}</Box>
                </Avatar>
              </Stack>
            </CardContent></Card>
          </Grid>
        ))}
      </Grid>
      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <Card><CardContent>
            <Typography fontWeight={700} sx={{ mb:2.5 }}>Сарын карго & орлого</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)"/>
                <XAxis dataKey="month" tick={{ fontSize:11 }}/>
                <YAxis yAxisId="left" tick={{ fontSize:11 }}/>
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize:11 }}/>
                <Tooltip/>
                <Bar yAxisId="left" dataKey="карго" fill="#1565C0" radius={[4,4,0,0]} name="Карго тоо"/>
                <Bar yAxisId="right" dataKey="орлого" fill="#FF6F00" radius={[4,4,0,0]} name="Орлого (М₮)"/>
              </BarChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card><CardContent>
            <Typography fontWeight={700} sx={{ mb:2.5 }}>Ачааны статусаар</Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} paddingAngle={3} dataKey="value">
                  {statusData.map((entry,i) => <Cell key={i} fill={entry.color}/>)}
                </Pie>
                <Tooltip/>
              </PieChart>
            </ResponsiveContainer>
          </CardContent></Card>
        </Grid>
      </Grid>
    </Box>
  );
}
