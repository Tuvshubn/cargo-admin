'use client';
import {
  Box, Grid, Card, CardContent, Typography, Button, Stack, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, IconButton, Tooltip,
  Stepper, Step, StepLabel, Checkbox, Table, TableHead, TableBody, TableRow, TableCell, Alert
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add, Edit, Delete, PlayArrow, MoveDown, CheckBox } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import { api, STATUS_LABELS, STATUS_COLORS, STATUSES } from '@/lib/api';

const STEPS = ['incheon','tianjin','erlian','zamiin_uud','customs','warehouse','delivering','delivered'];

export default function BatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [statusDialog, setStatusDialog] = useState<any>(null);
  const [parcels, setParcels] = useState<any[]>([]);
  const [selParcels, setSelParcels] = useState<string[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [form, setForm] = useState({ name:'', departure_date:'', driver_id:'', notes:'' });

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const [b, d] = await Promise.all([api.get('/batches'), api.get('/users')]);
    setBatches(b.data);
    setDrivers(d.data.filter((u:any) => u.role === 'driver'));
    setLoading(false);
  }, []);

  useEffect(() => { fetch_(); }, [fetch_]);

  const openStatus = async (batch: any) => {
    const { data } = await api.get(`/batches/${batch.id}`);
    setSelected(data);
    setParcels(data.parcels || []);
    setSelParcels([]);
    setStatusDialog({ id: batch.id, status: batch.status });
  };

  const save = async () => {
    if (selected?.id) await api.put(`/batches/${selected.id}`, form);
    else await api.post('/batches', form);
    setDialog(false); fetch_();
  };

  const updateStatus = async () => {
    await api.patch(`/batches/${statusDialog.id}/status`, {
      status: statusDialog.status,
      parcel_ids: selParcels.length ? selParcels : undefined
    });
    setStatusDialog(null); fetch_();
  };

  const del = async (id: string) => {
    if (!confirm('Устгах уу?')) return;
    await api.delete(`/batches/${id}`);
    fetch_();
  };

  const cols: GridColDef[] = [
    { field: 'batch_code', headerName: 'Батч код', width: 140, renderCell: p => <Typography fontWeight={700} color="primary.main">{p.value}</Typography> },
    { field: 'name', headerName: 'Нэр', width: 160 },
    { field: 'departure_date', headerName: 'Хөдлөлтийн огноо', width: 140, renderCell: p => p.value ? new Date(p.value).toLocaleDateString('mn-MN') : '-' },
    { field: 'status', headerName: 'Статус', width: 160, renderCell: p => (
      <Chip size="small" label={STATUS_LABELS[p.value]} sx={{ bgcolor: STATUS_COLORS[p.value]+'22', color: STATUS_COLORS[p.value], fontWeight: 700 }} />
    )},
    { field: 'parcel_count', headerName: 'Ачаа', width: 80, renderCell: p => <Chip size="small" label={p.value} /> },
    { field: 'driver_name', headerName: 'Жолооч', width: 130 },
    { field: 'total_fees', headerName: 'Нийт орлого', width: 130, renderCell: p => `${(parseInt(p.value||0)/1000000).toFixed(2)}М₮` },
    { field: 'actions', headerName: '', width: 140, sortable: false, renderCell: p => (
      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Статус шинэчлэх"><IconButton size="small" color="primary" onClick={() => openStatus(p.row)}><PlayArrow fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Засах"><IconButton size="small" onClick={() => { setForm(p.row); setSelected(p.row); setDialog(true); }}><Edit fontSize="small" /></IconButton></Tooltip>
        <Tooltip title="Устгах"><IconButton size="small" color="error" onClick={() => del(p.row.id)}><Delete fontSize="small" /></IconButton></Tooltip>
      </Stack>
    )},
  ];

  const stepIndex = STEPS.indexOf(statusDialog?.status || 'incheon');

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={800}>Карго багцлах</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setSelected(null); setForm({ name:'', departure_date:'', driver_id:'', notes:'' }); setDialog(true); }}>
          Шинэ багц
        </Button>
      </Stack>

      <Card>
        <DataGrid rows={batches} columns={cols} loading={loading} autoHeight
          getRowId={r => r.id} disableRowSelectionOnClick sx={{ border: 'none' }} />
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={800}>{selected?.id ? 'Багц засах' : 'Шинэ багц үүсгэх'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Багцын нэр" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth size="small" label="Хөдлөлтийн огноо" type="date" value={form.departure_date} onChange={e=>setForm(p=>({...p,departure_date:e.target.value}))} InputLabelProps={{ shrink: true }} /></Grid>
            <Grid item xs={12}>
              <TextField select fullWidth size="small" label="Жолооч" value={form.driver_id} onChange={e=>setForm(p=>({...p,driver_id:e.target.value}))}>
                <MenuItem value="">Сонгох...</MenuItem>
                {drivers.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid item xs={12}><TextField fullWidth size="small" label="Тэмдэглэл" multiline rows={2} value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))} /></Grid>
          </Grid>
        </DialogContent>
        <DialogActions><Button onClick={() => setDialog(false)}>Болих</Button><Button variant="contained" onClick={save}>Хадгалах</Button></DialogActions>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={!!statusDialog} onClose={() => setStatusDialog(null)} maxWidth="lg" fullWidth>
        <DialogTitle fontWeight={800}>Статус шинэчлэх — {statusDialog?.batch_code}</DialogTitle>
        <DialogContent dividers>
          <Box sx={{ overflowX: 'auto', mb: 3 }}>
            <Stepper activeStep={stepIndex} alternativeLabel sx={{ minWidth: 700 }}>
              {STEPS.map(s => <Step key={s}><StepLabel>{STATUS_LABELS[s]}</StepLabel></Step>)}
            </Stepper>
          </Box>
          <TextField select fullWidth label="Шинэ статус" value={statusDialog?.status || ''} onChange={e=>setStatusDialog((p:any)=>({...p,status:e.target.value}))} sx={{ mb: 3 }}>
            {STEPS.map(s => <MenuItem key={s} value={s}>{STATUS_LABELS[s]}</MenuItem>)}
          </TextField>
          <Alert severity="info" sx={{ mb: 2 }}>
            Бүх ачааг шинэчлэхийн тулд сонголт хийхгүйгээр "Хадгалах" дарна. Зарим ачааг сонгоход зөвхөн сонгосон ачаанууд шинэчлэгдэнэ.
          </Alert>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>
            Ачаанууд ({parcels.length}) — {selParcels.length ? `${selParcels.length} сонгогдсон` : 'бүгд'}
          </Typography>
          <Box sx={{ maxHeight: 300, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox checked={selParcels.length === parcels.length && parcels.length > 0}
                      onChange={e => setSelParcels(e.target.checked ? parcels.map((p:any)=>p.id) : [])} />
                  </TableCell>
                  <TableCell>Трекинг код</TableCell><TableCell>Нэр</TableCell><TableCell>Дугаар</TableCell><TableCell>Статус</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {parcels.map((p:any) => (
                  <TableRow key={p.id}>
                    <TableCell padding="checkbox">
                      <Checkbox checked={selParcels.includes(p.id)} onChange={e => setSelParcels(prev => e.target.checked ? [...prev,p.id] : prev.filter(x=>x!==p.id))} />
                    </TableCell>
                    <TableCell><Typography fontWeight={700} color="primary.main" variant="body2">{p.tracking_code}</Typography></TableCell>
                    <TableCell>{p.mn_name}</TableCell><TableCell>{p.mn_phone}</TableCell>
                    <TableCell><Chip size="small" label={STATUS_LABELS[p.status]} sx={{ bgcolor: STATUS_COLORS[p.status]+'22', color: STATUS_COLORS[p.status] }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </DialogContent>
        <DialogActions><Button onClick={() => setStatusDialog(null)}>Болих</Button><Button variant="contained" onClick={updateStatus}>Хадгалах</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
