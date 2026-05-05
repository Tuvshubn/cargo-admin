'use client';
import {
  Box, Card, Typography, Button, Stack, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, MenuItem, IconButton, Tooltip, Avatar
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Add, Edit, Delete } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

const ROLE_COLORS: any = { admin: 'primary', driver: 'warning', delivery: 'success' };
const ROLE_LABELS: any = { admin: 'Админ', driver: 'Жолооч', delivery: 'Хүргэлтийн жолооч' };
const empty = { name:'', email:'', password:'', phone:'', role:'driver', is_active: true };

export default function UsersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState<any>(empty);
  const [editId, setEditId] = useState<string|null>(null);

  const fetch_ = async () => {
    setLoading(true);
    const { data } = await api.get('/users');
    setRows(data);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const save = async () => {
    try {
      if (editId) await api.put(`/users/${editId}`, form);
      else await api.post('/users', form);
      setDialog(false); setForm(empty); setEditId(null); fetch_();
    } catch (err: any) { alert(err.response?.data?.message || 'Алдаа'); }
  };

  const del = async (id: string) => {
    if (!confirm('Хэрэглэгчийг идэвхгүй болгох уу?')) return;
    await api.delete(`/users/${id}`); fetch_();
  };

  const cols: GridColDef[] = [
    { field: 'name', headerName: 'Нэр', width: 160, renderCell: p => (
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar sx={{ width: 30, height: 30, fontSize: 12, bgcolor: 'primary.main' }}>{p.value[0]}</Avatar>
        <Typography variant="body2" fontWeight={600}>{p.value}</Typography>
      </Stack>
    )},
    { field: 'email', headerName: 'Имэйл', width: 200 },
    { field: 'phone', headerName: 'Утас', width: 130 },
    { field: 'role', headerName: 'Эрх', width: 150, renderCell: p => (
      <Chip size="small" label={ROLE_LABELS[p.value]} color={ROLE_COLORS[p.value]} />
    )},
    { field: 'is_active', headerName: 'Төлөв', width: 100, renderCell: p => (
      <Chip size="small" label={p.value ? 'Идэвхтэй' : 'Идэвхгүй'} color={p.value ? 'success' : 'default'} />
    )},
    { field: 'created_at', headerName: 'Огноо', width: 110, renderCell: p => new Date(p.value).toLocaleDateString('mn-MN') },
    { field: 'actions', headerName: '', width: 100, sortable: false, renderCell: p => (
      <Stack direction="row" spacing={0.5}>
        <Tooltip title="Засах">
          <IconButton size="small" onClick={() => { const { password:_, ...rest } = p.row; setForm({...empty,...rest,password:''}); setEditId(p.row.id); setDialog(true); }}>
            <Edit fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Идэвхгүй болгох">
          <IconButton size="small" color="error" onClick={() => del(p.row.id)}><Delete fontSize="small" /></IconButton>
        </Tooltip>
      </Stack>
    )},
  ];

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={800}>Хэрэглэгчид</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => { setForm(empty); setEditId(null); setDialog(true); }}>
          Нэмэх
        </Button>
      </Stack>
      <Card>
        <DataGrid rows={rows} columns={cols} loading={loading} autoHeight getRowId={r=>r.id} disableRowSelectionOnClick sx={{ border: 'none' }} />
      </Card>
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={800}>{editId ? 'Хэрэглэгч засах' : 'Шинэ хэрэглэгч'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField fullWidth size="small" label="Нэр" required value={form.name} onChange={e=>setForm((p:any)=>({...p,name:e.target.value}))} />
            <TextField fullWidth size="small" label="Имэйл" type="email" required value={form.email} onChange={e=>setForm((p:any)=>({...p,email:e.target.value}))} />
            <TextField fullWidth size="small" label={editId ? 'Шинэ нууц үг (хоосон бол өөрчлөхгүй)' : 'Нууц үг *'} type="password" value={form.password} onChange={e=>setForm((p:any)=>({...p,password:e.target.value}))} />
            <TextField fullWidth size="small" label="Утас" value={form.phone} onChange={e=>setForm((p:any)=>({...p,phone:e.target.value}))} />
            <TextField select fullWidth size="small" label="Эрх" value={form.role} onChange={e=>setForm((p:any)=>({...p,role:e.target.value}))}>
              {Object.entries(ROLE_LABELS).map(([k,v]:any)=><MenuItem key={k} value={k}>{v}</MenuItem>)}
            </TextField>
            {editId && (
              <TextField select fullWidth size="small" label="Төлөв" value={form.is_active} onChange={e=>setForm((p:any)=>({...p,is_active:e.target.value==='true'}))}>
                <MenuItem value="true">Идэвхтэй</MenuItem>
                <MenuItem value="false">Идэвхгүй</MenuItem>
              </TextField>
            )}
          </Stack>
        </DialogContent>
        <DialogActions><Button onClick={() => setDialog(false)}>Болих</Button><Button variant="contained" onClick={save}>Хадгалах</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
