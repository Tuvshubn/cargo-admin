'use client';
import { Box, Grid, Card, CardContent, Typography, Stack, TextField, Button, CircularProgress, Table, TableHead, TableBody, TableRow, TableCell, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState, useEffect } from 'react';
import { api, STATUS_LABELS, STATUS_COLORS, CARGO_TYPE_LABELS } from '@/lib/api';
import PageHeader from '@/components/PageHeader';

type SummaryData = Record<string, Record<string, string>>;
type ChartRow = { name: string; value: number; color: string };
type TypeRow = { name: string; count: number };
type MonthRow = { month: string; count: number; revenue: number };
type WarehouseRow = { id: string; tracking_code: string; mn_name: string; mn_phone: string; arrived_at: string; quantity: number; current_storage_fee: number };

export default function ReportsPage() {
  const [summary, setSummary] = useState<SummaryData>({});
  const [statusData, setStatusData] = useState<ChartRow[]>([]);
  const [typeData, setTypeData] = useState<TypeRow[]>([]);
  const [monthly, setMonthly] = useState<MonthRow[]>([]);
  const [warehouse, setWarehouse] = useState<WarehouseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    try {
      const params = { from:from||undefined, to:to||undefined };
      const [s,st,ty,m,w] = await Promise.all([
        api.get('/reports/summary',{params}), api.get('/reports/status'),
        api.get('/reports/cargo-type'), api.get('/reports/monthly'), api.get('/reports/warehouse'),
      ]);
      setSummary(s.data);
      setStatusData(st.data.map((r: Record<string,string>)=>({ name:STATUS_LABELS[r.status]||r.status, value:parseInt(r.count), color:STATUS_COLORS[r.status]||'#ccc' })));
      setTypeData(ty.data.map((r: Record<string,string>)=>({ name:CARGO_TYPE_LABELS[r.cargo_type]||r.cargo_type, count:parseInt(r.count) })));
      setMonthly(m.data.map((r: Record<string,string>)=>({ month:r.month+'р', count:parseInt(r.count), revenue:Math.round(parseInt(r.revenue)/1000000*10)/10 })));
      setWarehouse(w.data);
    } finally { setLoading(false); }
  };
  useEffect(()=>{ fetchAll(); },[]);

  const p = summary?.parcels || {};
  const STATS = [
    {label:'Нийт ачаа',value:p.total||0,color:'#1565C0'},{label:'Хүргэгдсэн',value:p.delivered||0,color:'#2E7D32'},
    {label:'Агуулахад байгаа',value:p.in_warehouse||0,color:'#FF6F00'},{label:'Нийт орлого',value:`${(parseInt(String(p.total_revenue||0))/1000000).toFixed(1)}М₮`,color:'#7B1FA2'},
    {label:'Авлага үлдэгдэл',value:`${(parseInt(String(p.total_remaining||0))/1000000).toFixed(1)}М₮`,color:'#C62828'},{label:'Нийт багц',value:summary?.batches?.total||0,color:'#0EA5E9'},
  ];
  return (
    <Box>
      <Stack direction={{ xs:'column', sm:'row' }} justifyContent="space-between" alignItems={{ sm:'center' }} sx={{ mb:3 }} spacing={2}>
        <Typography variant="h5" sx={{ fontWeight:800 }}>Тайлан</Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField size="small" type="date" label="Эхлэх" value={from} onChange={e=>setFrom(e.target.value)} InputLabelProps={{ shrink:true }}/>
          <TextField size="small" type="date" label="Дуусах" value={to} onChange={e=>setTo(e.target.value)} InputLabelProps={{ shrink:true }}/>
          <Button variant="contained" size="small" onClick={fetchAll}>Хайх</Button>
        </Stack>
      </Stack>
      {loading?<Box sx={{ textAlign:'center', py:8 }}><CircularProgress/></Box>:(
        <>
          <Grid container spacing={2} sx={{ mb:3 }}>
            {STATS.map((s,i)=>(
              <Grid item xs={6} sm={4} md={2} key={i}>
                <Card><CardContent sx={{ p:2, textAlign:'center' }}>
                  <Typography fontSize={22} color={s.color} sx={{ fontWeight:900 }}>{s.value}</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display:'block' }}>{s.label}</Typography>
                </CardContent></Card>
              </Grid>
            ))}
          </Grid>
          <Grid container spacing={2.5} sx={{ mb:3 }}>
            <Grid item xs={12} lg={8}>
              <Card><CardContent>
                <Typography sx={{ fontWeight:700, mb:2 }}>Сарын дүн</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)"/>
                    <XAxis dataKey="month" tick={{ fontSize:11 }}/>
                    <YAxis yAxisId="l" tick={{ fontSize:11 }}/><YAxis yAxisId="r" orientation="right" tick={{ fontSize:11 }}/>
                    <Tooltip/>
                    <Bar yAxisId="l" dataKey="count" fill="#1565C0" name="Ачаа тоо" radius={[3,3,0,0]}/>
                    <Bar yAxisId="r" dataKey="revenue" fill="#FF6F00" name="Орлого М₮" radius={[3,3,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Card sx={{ height:'100%' }}><CardContent>
                <Typography sx={{ fontWeight:700, mb:2 }}>Статусаар</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart><Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" paddingAngle={3}>
                    {statusData.map((e,i)=><Cell key={i} fill={e.color}/>)}
                  </Pie><Tooltip/></PieChart>
                </ResponsiveContainer>
              </CardContent></Card>
            </Grid>
            <Grid item xs={12}>
              <Card><CardContent>
                <Typography sx={{ fontWeight:700, mb:2 }}>Ачааны төрлөөр</Typography>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={typeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" horizontal={false}/>
                    <XAxis type="number" tick={{ fontSize:11 }}/><YAxis type="category" dataKey="name" width={120} tick={{ fontSize:11 }}/>
                    <Tooltip/><Bar dataKey="count" fill="#1565C0" name="Тоо" radius={[0,3,3,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent></Card>
            </Grid>
          </Grid>
          {warehouse.length>0&&(
            <Card sx={{ border:'2px solid', borderColor:'warning.main' }}>
              <Box sx={{ p:2, bgcolor:'warning.light', borderBottom:'1px solid', borderColor:'warning.main', display:'flex', alignItems:'center', gap:1 }}>
                <Typography color="warning.dark" sx={{ fontWeight:700 }}>🏭 Агуулахад аваагүй байгаа ачаанууд ({warehouse.length})</Typography>
              </Box>
              <Box sx={{ overflow:'auto' }}>
                <Table size="small">
                  <TableHead><TableRow>
                    <TableCell>Трекинг код</TableCell><TableCell>Нэр</TableCell><TableCell>Дугаар</TableCell>
                    <TableCell>Ирсэн огноо</TableCell><TableCell>Хоног</TableCell><TableCell>Хадгалалт</TableCell>
                  </TableRow></TableHead>
                  <TableBody>
                    {warehouse.slice(0,20).map((r)=>{
                      const days = r.arrived_at ? Math.floor((Date.now()-new Date(r.arrived_at).getTime())/86400000) : 0;
                      return (
                        <TableRow key={r.id} sx={{ bgcolor:days>7?'warning.light':undefined }}>
                          <TableCell><Typography color="primary.main" variant="body2" sx={{ fontWeight:700 }}>{r.tracking_code}</Typography></TableCell>
                          <TableCell>{r.mn_name}</TableCell><TableCell>{r.mn_phone}</TableCell>
                          <TableCell>{r.arrived_at?new Date(r.arrived_at).toLocaleDateString('mn-MN'):'-'}</TableCell>
                          <TableCell><Chip size="small" label={`${days} хоног`} color={days>7?'warning':'default'}/></TableCell>
                          <TableCell><Typography sx={{ fontWeight:700 }} color={r.current_storage_fee>0?'error.main':'text.primary'}>{Math.round(r.current_storage_fee).toLocaleString()}₮</Typography></TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Box>
            </Card>
          )}
        </>
      )}
    </Box>
  );
}
