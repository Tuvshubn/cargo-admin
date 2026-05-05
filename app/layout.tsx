import type { Metadata } from 'next';
import { AdminThemeProvider } from '@/context/ThemeProvider';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

export const metadata: Metadata = {
  title: 'МонтоТрейд Админ',
  description: 'Карго удирдлагын систем',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AdminThemeProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AdminThemeProvider>
      </body>
    </html>
  );
}
