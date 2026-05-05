'use client';
import { Box, Card, CardContent, Typography, Stack, Chip, Switch, Alert, CircularProgress, Grid, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

const ALL_PERMISSIONS: Record<string, string[]> = {
  'Хэрэглэгч': ['users.view','users.create','users.edit','users.delete'],
  'Ачаа / Падан': ['parcels.view','parcels.create','parcels.edit','parcels.delete'],
  'Багц': ['batches.view','batches.create','batches.edit','batches.delete'],
  'Тайлан': ['reports.view'],
  'Эрх': ['permissions.manage'],
  'Төлбөр': ['payments.view'],
  'Хүргэлт': ['deliveries.manage'],
};

const PERM_LABELS: Record<string,string> = {
  'users.view':'Харах','users.create':'Нэмэх','users.edit':'Засах','users.delete':'Устгах',
  'parcels.view':'Харах','parcels.create':'Нэмэх','parcels.edit':'Засах','parcels.delete':'Устгах',
  'batches.view':'Харах','batches.create':'Нэмэх','batches.edit':'Засах','batches.delete':'Устгах',
  'reports.view':'Харах','permissions.manage':'Удирдах','payments.view':'Харах','deliveries.manage':'Удирдах',
};

const ROLES = ['admin','driver','delivery'];
const ROLE_LABELS: Record<string,string> = { admin:'Админ', driver:'Жолооч', delivery:'Хүргэлтийн жолооч' };
const ROLE_COLORS: any = { admin:'primary', driver:'warning', delivery:'success' };

export default function PermissionsPage() {
  const [perms, setPerms] = useState<Record<string,string[]>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetch_ = async () => {
    const { data } = await api.get('/permissions');
    const map: Record<string,string[]> = { admin:[], driver:[], delivery:[] };
    data.forEach((p:any) => { if(map[p.role]) map[p.role].push(p.permission); });
    setPerms(map);
    setLoading(false);
  };

  useEffect(() => { fetch_(); }, []);

  const toggle = async (role: string, perm: string) => {
    const has = perms[role]?.includes(perm);
    setSaving(true);
    try {
      if (has) await api.delete('/permissions', { data: { role, permission: perm } });
      else await api.post('/permissions', { role, permission: perm });
      setPerms(prev => ({
        ...prev,
        [role]: has ? prev[role].filter(p=>p!==perm) : [...(prev[role]||[]), perm]
      }));
    } finally { setSaving(false); }
  };

  if (loading) return <Box sx={{ textAlign: "center" }} ><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} mb={1}>Эрхийн тохиргоо</Typography>
      <Alert severity="info" sx={{ mb: 3 }}>Роль тус бүрт ямар цэс болон үйлдлийг зөвшөөрөхийг тохируулна уу</Alert>

      <Grid container spacing={3}>
        {ROLES.map(role => (
          <Grid item xs={12} md={4} key={role}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography fontWeight={800}>{ROLE_LABELS[role]}</Typography>
                  <Chip label={role} color={ROLE_COLORS[role]} size="small" />
                </Stack>
                <Stack spacing={2}>
                  {Object.entries(ALL_PERMISSIONS).map(([group, items]) => (
                    <Box key={group}>
                      <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform:'uppercase', letterSpacing: 0.5 }}>
                        {group}
                      </Typography>
                      <Stack spacing={0.5} mt={0.5}>
                        {items.map(perm => (
                          <Stack key={perm} direction="row" justifyContent="space-between" alignItems="center"
                            sx={{ py: 0.5, px: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
                            <Typography variant="body2">{PERM_LABELS[perm]}</Typography>
                            <Switch
                              size="small"
                              checked={perms[role]?.includes(perm) || false}
                              onChange={() => toggle(role, perm)}
                              disabled={saving || (role === 'admin' && perm.startsWith('admin'))}
                            />
                          </Stack>
                        ))}
                      </Stack>
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
