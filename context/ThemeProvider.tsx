'use client';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { createContext, useContext, useMemo, ReactNode } from 'react';

const Ctx = createContext({ toggleMode: ()=>{}, mode: 'light' as 'light'|'dark' });
export const useMode = () => useContext(Ctx);

export function AdminThemeProvider({ children }: { children: ReactNode }) {
  const theme = useMemo(() => createTheme({
    palette: {
      mode: 'light',
      primary: { main: '#2563EB', light: '#3B82F6', dark: '#1D4ED8' },
      secondary: { main: '#F59E0B' },
      success: { main: '#10B981' },
      error: { main: '#EF4444' },
      warning: { main: '#F59E0B' },
      info: { main: '#06B6D4' },
      background: { default: '#F8FAFC', paper: '#FFFFFF' },
      text: { primary: '#0F172A', secondary: '#64748B' },
      divider: '#E2E8F0',
    },
    typography: {
      fontFamily: '"Inter", "Noto Sans", sans-serif',
      button: { textTransform: 'none', fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 8, boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
        },
        defaultProps: { disableElevation: true },
      },
      MuiCard: {
        styleOverrides: { root: { borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' } },
        defaultProps: { elevation: 0 },
      },
      MuiPaper: { defaultProps: { elevation: 0 }, styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiTextField: {
        styleOverrides: {
          root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } },
        },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 600, fontSize: '0.72rem' } } },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { background: '#F8FAFC', borderBottom: '2px solid #E2E8F0' },
            '& .MuiDataGrid-columnHeader': { fontWeight: 700, fontSize: '0.78rem', color: '#475569' },
            '& .MuiDataGrid-row:hover': { background: '#F8FAFC' },
            '& .MuiDataGrid-cell': { borderColor: '#F1F5F9', display: 'flex', alignItems: 'center' },
            '& .MuiDataGrid-footerContainer': { borderTop: '2px solid #E2E8F0' },
          },
        },
      },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 16, border: '1px solid #E2E8F0' } } },
      MuiDialogTitle: { styleOverrides: { root: { fontWeight: 800, fontSize: '1rem', pb: 0 } } },
      MuiTableCell: {
        styleOverrides: {
          head: { fontWeight: 700, background: '#F8FAFC', color: '#475569', fontSize: '0.78rem', padding: '10px 16px' },
          body: { fontSize: '0.875rem', padding: '10px 16px' },
        },
      },
    },
  }), []);

  return (
    <Ctx.Provider value={{ toggleMode: ()=>{}, mode: 'light' }}>
      <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>
    </Ctx.Provider>
  );
}
