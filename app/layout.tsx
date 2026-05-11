import type { Metadata } from 'next';
import { AuthProvider } from '@/context/AuthContext';
import { AdminThemeProvider } from "@/context/ThemeProvider";

export const metadata: Metadata = {
  title: 'МонтоТрейд Админ',
  description: 'Карго удирдлагын систем',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
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
