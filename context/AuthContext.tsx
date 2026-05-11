'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://cargo-backend-two.vercel.app/api';

interface User { id: string; name: string; email: string; role: string; phone?: string; }
interface AuthCtx { user: User | null; token: string | null; login: (email: string, password: string) => Promise<void>; logout: () => void; }

const AuthContext = createContext<AuthCtx>({ user: null, token: null, login: async () => {}, logout: () => {} });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem('cargo_token');
    const u = localStorage.getItem('cargo_user');
    if (t && u) {
      setToken(t);
      setUser(JSON.parse(u));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('cargo_token', data.token);
    localStorage.setItem('cargo_user', JSON.stringify(data.user));
    // Route by role
    if (data.user.role === 'delivery') router.push('/deliveries');
    else router.push('/dashboard');
  };

  const logout = () => {
    setToken(null); setUser(null);
    localStorage.removeItem('cargo_token');
    localStorage.removeItem('cargo_user');
    router.push('/login');
  };

  if (loading) return null;

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
