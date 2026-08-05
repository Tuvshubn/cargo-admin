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
      h4: { fontWeight: 700, letterSpacing: '-0.5px' },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 600 },
      subtitle1: { fontWeight: 600 },
      subtitle2: { fontWeight: 600 },
      body2: { color: '#64748B' },
    },
    shape: { borderRadius: 10 },
    shadows: [
      'none',
      '0 1px 2px rgba(0,0,0,0.05)',
      '0 1px 3px rgba(0,0,0,0.08)',
      '0 2px 6px rgba(0,0,0,0.08)',
      '0 4px 12px rgba(0,0,0,0.08)',
      '0 8px 24px rgba(0,0,0,0.08)',
      ...Array(19).fill('none') as string[],
    ] as any,
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 600, borderRadius: 8, boxShadow: 'none', '&:hover': { boxShadow: 'none' } },
          contained: { background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)' },
        },
        defaultProps: { disableElevation: true },
      },
      MuiCard: {
        styleOverrides: {
          root: { borderRadius: 12, border: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' },
        },
        defaultProps: { elevation: 0 },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: { root: { backgroundImage: 'none' } },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#2563EB' },
            },
          },
        },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 600, fontSize: '0.72rem' } } },
      MuiDataGrid: {
        styleOverrides: {
          root: {
            border: 'none',
            '& .MuiDataGrid-columnHeaders': { background: '#F1F5F9', borderRadius: '8px 8px 0 0' },
            '& .MuiDataGrid-columnHeader': { fontWeight: 700, fontSize: '0.78rem', color: '#475569' },
            '& .MuiDataGrid-row:hover': { background: '#F8FAFC' },
            '& .MuiDataGrid-cell': { borderColor: '#F1F5F9' },
          },
        },
      },
      MuiTableCell: { styleOverrides: { head: { fontWeight: 700, background: '#F1F5F9', color: '#475569', fontSize: '0.78rem' } } },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 16, border: '1px solid #E2E8F0' } } },
      MuiDialogTitle: { styleOverrides: { root: { fontWeight: 700, fontSize: '1.1rem' } } },
    },
  }), []);

  const ctx = useMemo(() => ({ toggleMode: ()=>{}, mode: 'light' as const }), []);

  return (
    <Ctx.Provider value={ctx}>
      <ThemeProvider theme={theme}><CssBaseline />{children}</ThemeProvider>
    </Ctx.Provider>
  );
}
