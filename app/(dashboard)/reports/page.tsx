'use client';
import { Box, Grid, Card, CardContent, Typography, Stack, Chip, TextField, Button, CircularProgress, Alert, Table, TableHead, TableBody, TableRow, TableCell, Paper } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { api, STATUS_LABELS, STATUS_COLORS, CARGO_TYPE_LABELS } from '@/lib/api';
import { FileDownload, Warehouse, Warning } from '@mui/icons-material';

const MONTHS = ['1','2','3','4','5','6','7','8','9','10','11','12'];

export default function ReportsPage() {
  const [summary, setSummary] = useState<any>(null);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [typeData, setTypeData] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [warehouse, setWarehouse] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = { from: from || undefined, to: to || undefined };
      const [s, st, ty, m, w] = await Promise.all([
        api.get('/reports/summary', { params }),
        api.get('/reports/status'),
        api.get('/reports/cargo-type'),
        api.get('/reports/monthly'),
        api.get('/reports/warehouse'),
      ]);
      setSummary(s.data);
      setStatusData(st.data.map((r:any) => ({ name: STATUS_LABELS[r.status]||r.status, value: parseInt(r.count), color: STATUS_COLORS[r.status]||'#ccc' })));
      setTypeData(ty.data.map((r:any) => ({ name: CARGO_TYPE_LABELS[r.cargo_type]||r.cargo_type, count: parseInt(r.count), revenue: Math.round(parseInt(r.total_fee)/1000) })));
      setMonthly(m.data.map((r:any) => ({ month: MONTHS[parseInt(r.month)-1]+'р', count: parseInt(r.count), revenue: Math.round(parseInt(r.revenue)/1000000*10)/10 })));
      setWarehouse(w.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const p = summary?.parcels || {};

  return (
    <Box>
      <Stack direction={{ xs:'column', sm:'row' }} justifyContent="space-between" alignItems={{ sm:'center' }} mb={3} spacing={2}>
        <Typography variant="h5" fontWeight={800}>Тайлан</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField size="small" type="date" label="Эхлэх" value={from} onChange={e=>setFrom(e.target.value)} InputLabelProps={{ shrink:true }} />
          <TextField size="small" type="date" label="Дуусах" value={to} onChange={e=>setTo(e.target.value)} InputLabelProps={{ shrink:true }} />
          <Button variant="contained" size="small" onClick={fetchAll}>Хайх</Button>
        </Stack>
      </Stack>

      {loading ? <Box textAlign="center" py={8}><CircularProgress /></Box> : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={2} mb={3}>
            {[
              { label:'Нийт ачаа', value: p.total||0, color:'#1565C0' },
              { label:'Хүргэгдсэн', value: p.delivered||0, color:'#2E7D32' },
              { label:'Агуулахад байгаа', value: p.in_warehouse||0, color:'#FF6F00' },
              { label:'Нийт орлого', value: `${(parseInt(p.total_revenue||0)/1000000).toFixed(1)}М₮`, color:'#7B1FA2' },
              { label:'Үлдэгдэл авлага', value: `${(parseInt(p.total_remaining||0)/1000000).toFixed(1)}М₮`, color:'#C62828' },
              { label:'Солонгосд авсан', value: `${(parseInt(p.total_paid_korea||0)/1000000).toFixed(1)}М₮`, color:'#00838F' },
            ].map((s,i) => (
              <Grid item xs={6} sm={4} md={2} key={i}>
                <Card sx={{ border: `2px solid ${s.color}22` }}>
                  <CardContent sx={{ p: 2, textAlign:'center' }}>
                    <Typography fontSize={22} fontWeight={900} color={s.color}>{s.value}</Typography>
                    <Typography variant="caption" color="text.secondary" display="block">{s.label}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={2.5} mb={3}>
            {/* Monthly Revenue Chart */}
            <Grid item xs={12} lg={8}>
              <Card>
                <CardContent>
                  <Typography fontWeight={700} mb={2}>Сарын дүн</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={monthly}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                      <XAxis dataKey="month" tick={{ fontSize:11 }} />
                      <YAxis yAxisId="l" tick={{ fontSize:11 }} />
                      <YAxis yAxisId="r" orientation="right" tick={{ fontSize:11 }} />
                      <Tooltip formatter={(v:any,n:string)=>n==='revenue'?`${v}М₮`:v} />
                      <Bar yAxisId="l" dataKey="count" fill="#1565C0" name="Ачаа тоо" radius={[3,3,0,0]} />
                      <Bar yAxisId="r" dataKey="revenue" fill="#FF6F00" name="Орлого М₮" radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Pie Chart */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ height:'100%' }}>
                <CardContent>
                  <Typography fontWeight={700} mb={2}>Статусаар</Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={3}>
                        {statusData.map((e,i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>

            {/* Cargo type */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography fontWeight={700} mb={2}>Ачааны төрлөөр</Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={typeData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false} />
                      <XAxis type="number" tick={{ fontSize:11 }} />
                      <YAxis type="category" dataKey="name" width={120} tick={{ fontSize:11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#1565C0" name="Тоо" radius={[0,3,3,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Warehouse - uncollected */}
          {warehouse.length > 0 && (
            <Card sx={{ border: '2px solid', borderColor: 'warning.main' }}>
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                  <Warehouse color="warning" />
                  <Typography fontWeight={700}>Агуулахад аваагүй байгаа ачаанууд ({warehouse.length})</Typography>
                </Stack>
                <Box sx={{ overflowX: 'auto' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Трекинг код</TableCell>
                        <TableCell>Нэр</TableCell>
                        <TableCell>Дугаар</TableCell>
                        <TableCell>Ирсэн огноо</TableCell>
                        <TableCell>Хоног</TableCell>
                        <TableCell>Хадгалалтын төлбөр</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {warehouse.slice(0,20).map((r:any) => {
                        const days = r.arrived_at ? Math.floor((Date.now()-new Date(r.arrived_at).getTime())/86400000) : 0;
                        return (
                          <TableRow key={r.id} sx={{ bgcolor: days > 7 ? 'warning.main' + '11' : 'inherit' }}>
                            <TableCell><Typography fontWeight={700} color="primary.main" variant="body2">{r.tracking_code}</Typography></TableCell>
                            <TableCell>{r.mn_name}</TableCell>
                            <TableCell>{r.mn_phone}</TableCell>
                            <TableCell>{r.arrived_at ? new Date(r.arrived_at).toLocaleDateString('mn-MN') : '-'}</TableCell>
                            <TableCell><Chip size="small" label={`${days} хоног`} color={days > 7 ? 'warning' : 'default'} /></TableCell>
                            <TableCell><Typography fontWeight={700} color={parseInt(r.current_storage_fee)>0?'error.main':'text.primary'}>{parseInt(r.current_storage_fee||0).toLocaleString()}₮</Typography></TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}
