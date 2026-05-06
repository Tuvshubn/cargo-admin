'use client';
import { Box, Card, Button, Typography, Stack, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Grid, IconButton, Tooltip, CircularProgress } from '@mui/material';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import { Add, Edit, Delete, FileDownload, TrackChanges } from '@mui/icons-material';
import { useState, useEffect, useCallback } from 'react';
import { api, STATUS_LABELS, STATUS_COLORS, CARGO_TYPE_LABELS, STATUSES } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const CARGO_TYPES = ['express','normal','online','vehicle','oversized','wholesale'];
const emptyForm = { kr_name:'',kr_phone:'',kr_address:'',mn_name:'',mn_phone:'',mn_address:'',cargo_type:'express',weight:'',quantity:'1',description:'',paid_in_korea:'0',total_fee:'0',remaining_fee:'0',notes:'',is_fragile:false };
type FormType = typeof emptyForm;
type RowType = FormType & { id:string; status:string; batch_code?:string; remaining_fee:string; is_paid:boolean; created_at:string };

export default function ParcelsPage() {
  const { user } = useAuth();
  const [rows, setRows] = useState<RowType[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormType>(emptyForm);
  const [editId, setEditId] = useState<string|null>(null);
  const [dialog, setDialog] = useState(false);
  const [statusDialog, setStatusDialog] = useState<{id:string;status:string}|null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page:0, pageSize:25 });
  const [exporting, setExporting] = useState(false);

  const fetchParcels = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/parcels', { params:{ search, status:statusFilter, page:paginationModel.page+1, limit:paginationModel.pageSize } });
      setRows(data.data || data);
      setTotal(data.total || data.length);
    } finally { setLoading(false); }
  }, [search, statusFilter, paginationModel]);

  useEffect(() => { fetchParcels(); }, [fetchParcels]);

  const save = async () => {
    try {
      if (editId) await api.put(`/parcels/${editId}`, form);
      else await api.post('/parcels', form);
      setDialog(false); setForm(emptyForm); setEditId(null); fetchParcels();
    } catch (err: unknown) { alert(err instanceof Error ? err.message : 'Алдаа'); }
  };

  const del = async (id: string) => {
    if (!confirm('Устгах уу?')) return;
    await api.delete(`/parcels/${id}`); fetchParcels();
  };

  const updateStatus = async () => {
    if (!statusDialog) return;
    await api.patch(`/parcels/${statusDialog.id}/status`, { status:statusDialog.status });
    setStatusDialog(null); fetchParcels();
  };

  const exportXlsx = async () => {
    setExporting(true);
    try {
      const resp = await api.get('/parcels/export', { responseType:'blob' });
      const url = URL.createObjectURL(resp.data);
      const a = document.createElement('a'); a.href=url; a.download='parcels.xlsx'; a.click();
    } finally { setExporting(false); }
  };

  const columns: GridColDef[] = [
    { field:'tracking_code', headerName:'Трекинг код', width:140, renderCell:p=><Typography variant="body2" color="primary.main" sx={{ fontWeight:700 }}>{p.value}</Typography> },
    { field:'mn_name', headerName:'Монгол нэр', width:130 },
    { field:'mn_phone', headerName:'Дугаар', width:110 },
    { field:'cargo_type', headerName:'Төрөл', width:130, renderCell:p=><Chip size="small" label={CARGO_TYPE_LABELS[p.value]||p.value}/> },
    { field:'quantity', headerName:'Тоо', width:60 },
    { field:'status', headerName:'Статус', width:150, renderCell:p=><Chip size="small" label={STATUS_LABELS[p.value]} sx={{ bgcolor:STATUS_COLORS[p.value]+'22', color:STATUS_COLORS[p.value], fontWeight:700, fontSize:11 }}/> },
    { field:'remaining_fee', headerName:'Үлдэгдэл', width:110, renderCell:p=><Typography variant="body2" sx={{ fontWeight:700 }} color={Number(p.value)>0?'error.main':'success.main'}>{parseInt(String(p.value||0)).toLocaleString()}₮</Typography> },
    { field:'is_paid', headerName:'Төлбөр', width:90, renderCell:p=><Chip size="small" label={p.value?'Төлсөн':'Хүлээгдэж'} color={p.value?'success':'warning'}/> },
    { field:'batch_code', headerName:'Багц', width:120 },
    { field:'created_at', headerName:'Огноо', width:100, renderCell:p=>new Date(p.value).toLocaleDateString('mn-MN') },
    { field:'actions', headerName:'', width:130, sortable:false, renderCell:p=>(
      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Статус"><IconButton size="small" color="primary" onClick={()=>setStatusDialog({id:p.row.id,status:p.row.status})}><TrackChanges fontSize="small"/></IconButton></Tooltip>
        <Tooltip title="Засах"><IconButton size="small" onClick={()=>{setForm({...emptyForm,...p.row});setEditId(p.row.id);setDialog(true);}}><Edit fontSize="small"/></IconButton></Tooltip>
        {user?.role==='admin'&&<Tooltip title="Устгах"><IconButton size="small" color="error" onClick={()=>del(p.row.id)}><Delete fontSize="small"/></IconButton></Tooltip>}
      </Stack>
    )},
  ];

  return (
    <Box>
      <Stack direction={{ xs:'column', sm:'row' }} justifyContent="space-between" alignItems={{ sm:'center' }} sx={{ mb:3 }} spacing={2}>
        <Typography variant="h5" sx={{ fontWeight:800 }}>Падан / Ачаанууд</Typography>
        <Stack direction="row" spacing={1}>
          {user?.role==='admin'&&<Button variant="outlined" startIcon={exporting?<CircularProgress size={16}/>:<FileDownload/>} onClick={exportXlsx} disabled={exporting}>Excel</Button>}
          <Button variant="contained" startIcon={<Add/>} onClick={()=>{setForm(emptyForm);setEditId(null);setDialog(true);}}>Падан нэмэх</Button>
        </Stack>
      </Stack>
      <Card sx={{ mb:2 }}>
        <Box sx={{ p:2 }}>
          <Stack direction={{ xs:'column', sm:'row' }} spacing={2}>
            <TextField size="small" label="Хайх..." value={search} onChange={e=>setSearch(e.target.value)} sx={{ flex:1 }}/>
            <TextField select size="small" label="Статус" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} sx={{ minWidth:160 }}>
              <MenuItem value="">Бүгд</MenuItem>
              {STATUSES.map(s=><MenuItem key={s} value={s}>{STATUS_LABELS[s]}</MenuItem>)}
            </TextField>
          </Stack>
        </Box>
      </Card>
      <Card>
        <DataGrid rows={rows} columns={columns} rowCount={total} loading={loading}
          pageSizeOptions={[25,50,100]} paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel} paginationMode="server"
          getRowId={r=>r.id} autoHeight disableRowSelectionOnClick
          slots={{ toolbar:GridToolbar }} sx={{ border:'none' }}
        />
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={dialog} onClose={()=>setDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight={800}>{editId?'Падан засах':'Шинэ падан нэмэх'}</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ pt:1 }}>
            <Grid item xs={12}><Typography variant="subtitle2" color="primary" sx={{ fontWeight:700 }}>🇰🇷 Солонгос мэдээлэл</Typography></Grid>
            {([['kr_name','Нэр'],['kr_phone','Утасны дугаар'],['kr_address','Хаяг']] as [string,string][]).map(([k,l])=>(
              <Grid item xs={12} sm={4} key={k}>
                <TextField fullWidth size="small" label={l} value={(form as Record<string,string>)[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
              </Grid>
            ))}
            <Grid item xs={12}><Typography variant="subtitle2" color="error" sx={{ fontWeight:700 }}>🇲🇳 Монгол мэдээлэл</Typography></Grid>
            {([['mn_name','Нэр *'],['mn_phone','Утасны дугаар *'],['mn_address','Хаяг']] as [string,string][]).map(([k,l])=>(
              <Grid item xs={12} sm={4} key={k}>
                <TextField fullWidth size="small" label={l} value={(form as Record<string,string>)[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
              </Grid>
            ))}
            <Grid item xs={12}><Typography variant="subtitle2" sx={{ fontWeight:700 }}>📦 Ачааны мэдээлэл</Typography></Grid>
            <Grid item xs={12} sm={4}>
              <TextField select fullWidth size="small" label="Ачааны төрөл" value={form.cargo_type} onChange={e=>setForm(p=>({...p,cargo_type:e.target.value}))}>
                {CARGO_TYPES.map(t=><MenuItem key={t} value={t}>{CARGO_TYPE_LABELS[t]}</MenuItem>)}
              </TextField>
            </Grid>
            {([['quantity','Тоо ширхэг'],['weight','Жин (кг)'],['description','Тайлбар']] as [string,string][]).map(([k,l])=>(
              <Grid item xs={12} sm={4} key={k}>
                <TextField fullWidth size="small" label={l} value={(form as Record<string,string>)[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))}/>
              </Grid>
            ))}
            <Grid item xs={12}><Typography variant="subtitle2" sx={{ fontWeight:700 }}>💳 Төлбөр</Typography></Grid>
            {([['paid_in_korea','Солонгосд төлсөн'],['total_fee','Нийт төлбөр'],['remaining_fee','Үлдэгдэл']] as [string,string][]).map(([k,l])=>(
              <Grid item xs={12} sm={4} key={k}>
                <TextField fullWidth size="small" label={l} type="number" value={(form as Record<string,string>)[k]||''} onChange={e=>setForm(p=>({...p,[k]:e.target.value}))} InputProps={{ endAdornment:'₮' }}/>
              </Grid>
            ))}
            <Grid item xs={12}>
              <TextField fullWidth size="small" label="Тайлбар / Нэмэлт мэдээлэл" multiline rows={2} value={form.notes} onChange={e=>setForm(p=>({...p,notes:e.target.value}))}/>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px:3, py:2 }}>
          <Button onClick={()=>setDialog(false)}>Болих</Button>
          <Button variant="contained" onClick={save}>Хадгалах</Button>
        </DialogActions>
      </Dialog>

      {/* Status Dialog */}
      <Dialog open={!!statusDialog} onClose={()=>setStatusDialog(null)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Статус шинэчлэх</DialogTitle>
        <DialogContent>
          <TextField select fullWidth label="Статус" value={statusDialog?.status||''} onChange={e=>setStatusDialog(p=>p?{...p,status:e.target.value}:null)} sx={{ mt:1 }}>
            {STATUSES.map(s=><MenuItem key={s} value={s}>{STATUS_LABELS[s]}</MenuItem>)}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>setStatusDialog(null)}>Болих</Button>
          <Button variant="contained" onClick={updateStatus}>Хадгалах</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
