'use client';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';

const Ctx = createContext({ toggleMode: ()=>{}, mode: 'light' as 'light'|'dark' });
export const useMode = () => useContext(Ctx);

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light'|'dark'>('light');
  useEffect(() => { const s = localStorage.getItem('admin-theme') as any; if(s) setMode(s); }, []);

  const ctx = useMemo(() => ({
    toggleMode: () => setMode(p => { const n = p==='light'?'dark':'light'; localStorage.setItem('admin-theme',n); return n; }),
    mode,
  }), [mode]);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: '#1565C0' },
      secondary: { main: '#FF6F00' },
      background: {
        default: mode==='light' ? '#F1F5F9' : '#0F172A',
        paper: mode==='light' ? '#FFFFFF' : '#1E293B',
      },
    },
    typography: { fontFamily: '"Noto Sans", sans-serif', },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 } } },
      MuiCard: { styleOverrides: { root: { borderRadius: 12, border: '1px solid', borderColor: mode==='light'?'rgba(0,0,0,0.07)':'rgba(255,255,255,0.08)' } } },
      MuiDataGrid: {
        styleOverrides: {
          root: { border: 'none', '& .MuiDataGrid-columnHeader': { fontWeight: 700, fontSize: '0.8rem' } },
        },
      },
    },
  }), [mode]);

  return (
    <Ctx.Provider value={ctx}>
      <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>
    </Ctx.Provider>
  );
}
