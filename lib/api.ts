import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(cfg => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const STATUS_LABELS: Record<string, string> = {
  incheon: 'Инчеон боомт', tianjin: 'Тьянжин боомт',
  erlian: 'Эрээн', zamiin_uud: 'Замын-Үүд',
  customs: 'Гааль', warehouse: 'Агуулах',
  delivering: 'Хүргэлтэнд', delivered: 'Хүргэгдсэн',
};

export const STATUS_COLORS: Record<string, string> = {
  incheon: '#64748b', tianjin: '#3b82f6', erlian: '#8b5cf6',
  zamiin_uud: '#f59e0b', customs: '#ef4444', warehouse: '#10b981',
  delivering: '#0ea5e9', delivered: '#22c55e',
};

export const CARGO_TYPE_LABELS: Record<string, string> = {
  express: 'Газрын экспресс', normal: 'Газрын энгийн',
  online: 'Онлайн', vehicle: 'Автомашин',
  oversized: 'Том оврын', wholesale: 'Бөөний',
};

export const STATUSES = Object.keys(STATUS_LABELS);
