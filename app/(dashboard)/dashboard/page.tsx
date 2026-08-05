'use client';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Alert, Chip } from '@mui/material';
import { Inventory, CheckCircle, Warehouse, TrendingUp, LocalShipping, AllInbox } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { api, STATUS_LABELS, STATUS_COLORS } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import PageHeader from '@/components/PageHeader';
import StatCard from '@/components/StatCard';

const MONTHS = ['1-р','2-р','3-р','4-р','5-р','6-р','7-р','8-р','9-р','10-р','11-р','12-р'];

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Record<string,Record<string,string>>>({});
  const [statusData, setStatusData] = useState<Array<{name:string;value:number;color:string}>>([]);
  const [monthly, setMonthly] = useState<Array<{month:string;карго:number;орлого:number}>>([]);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') { setLoading(false); return; }
    Promise.all([api.get('/reports/summary'), api.get('/reports/status'), api.get('/reports/monthly')])
      .then(([s, st, m]) => {
        setSummary(s.data);
        setStatusData(st.data.map((r: Record<string,string>) => ({
          name: STATUS_LABELS[r.status] || r.status,
          value: parseInt(r.count),
          color: STATUS_COLORS[r.status] || '#CBD5E1'
        })));
        const mData = m.data.map((r: Record<string,string>) => ({
          month: r.month?.slice(5,7) ? MONTHS[parseInt(r.month.slice(5,7))-1] : r.month,
          карго: parseInt(r.count),
          орлого: Math.round((parseFloat(r.revenue||'0'))/1000000)
        }));
        setMonthly(mData.reverse());
      })
      .catch(() => setDbError(true))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
      <CircularProgress />
    </Box>
  );

  if (user?.role !== 'admin') return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <LocalShipping sx={{ fontSize: 64, color: '#CBD5E1', mb: 2 }} />
      <Typography variant="h5" sx={{ fontWeight: 700, color: '#0F172A' }}>Тавтай морил, {user?.name}!</Typography>
      <Typography sx={{ mt: 1, color: '#64748B' }}>Зүүн цэснээс шаардлагатай хэсгээ сонгоно уу.</Typography>
    </Box>
  );

  const p = summary?.parcels || {};
  const b = summary?.batches || {};

  const STATS = [
    { label: 'Нийт ачаа', value: p.total || 0, sub: `${b.total || 0} карго багц`, icon: <Inventory sx={{ fontSize: 22 }} />, color: '#2563EB' },
    { label: 'Хүргэгдсэн', value: p.delivered || 0, sub: 'Амжилттай хүргэлт', icon: <CheckCircle sx={{ fontSize: 22 }} />, color: '#10B981' },
    { label: 'Агуулахад', value: p.in_warehouse || 0, sub: `${p.unpaid_warehouse || 0} төлбөр хүлээж буй`, icon: <Warehouse sx={{ fontSize: 22 }} />, color: '#F59E0B' },
    { label: 'Нийт орлого', value: `${(parseFloat(String(p.total_revenue || 0))/1000000).toFixed(1)}М₮`, sub: `${(parseFloat(String(p.total_remaining || 0))/1000000).toFixed(1)}М₮ үлдэгдэл`, icon: <TrendingUp sx={{ fontSize: 22 }} />, color: '#8B5CF6' },
  ];

  return (
    <Box>
      <PageHeader title="Дашбоард" subtitle="МонтоТрейд карго системийн ерөнхий мэдээлэл" />

      {dbError && (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          <strong>Мэдээллийн сан холбогдоогүй байна.</strong> Vercel-ийн Environment Variables-д DATABASE_URL нэмнэ үү.
        </Alert>
      )}

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {STATS.map((s, i) => (
          <Grid item xs={12} sm={6} lg={3} key={i}>
            <StatCard {...s} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2.5}>
        <Grid item xs={12} lg={7}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
                <Typography sx={{ fontWeight: 700, color: '#0F172A' }}>Сарын карго & орлого</Typography>
                <Chip label="Сүүлийн 12 сар" size="small" sx={{ background: '#EFF6FF', color: '#2563EB', fontWeight: 600 }} />
              </Box>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={monthly} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  <Bar yAxisId="left" dataKey="карго" fill="#2563EB" radius={[4,4,0,0]} name="Карго тоо" />
                  <Bar yAxisId="right" dataKey="орлого" fill="#10B981" radius={[4,4,0,0]} name="Орлого (М₮)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent sx={{ p: 2.5 }}>
              <Typography sx={{ fontWeight: 700, color: '#0F172A', mb: 2.5 }}>Статусаар</Typography>
              {statusData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} paddingAngle={3} dataKey="value">
                        {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E2E8F0' }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                    {statusData.slice(0, 5).map((d, i) => (
                      <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box sx={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                          <Typography sx={{ fontSize: '0.78rem', color: '#475569' }}>{d.name}</Typography>
                        </Box>
                        <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#0F172A' }}>{d.value}</Typography>
                      </Box>
                    ))}
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 200, color: '#CBD5E1' }}>
                  <Typography sx={{ color: '#94A3B8', fontSize: '0.875rem' }}>Мэдээлэл байхгүй</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
