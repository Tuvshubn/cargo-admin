import axios from 'axios';

const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://cargo-backend-two.vercel.app/api';

export const api = axios.create({ baseURL: BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cargo_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cargo_token');
      localStorage.removeItem('cargo_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const STATUSES = ['incheon','tianjin','erlian','zamiin_uud','customs','warehouse','delivering','delivered'] as const;
export type StatusKey = typeof STATUSES[number];

export const STATUS_LABELS: Record<string,string> = {
  incheon:'Инчеон боомт', tianjin:'Тьянжин боомт', erlian:'Эрээн',
  zamiin_uud:'Замын-Үүд', customs:'Гааль', warehouse:'Агуулахад буусан',
  delivering:'Хүргэлтэнд гарсан', delivered:'Хүргэгдсэн',
};

export const STATUS_COLORS: Record<string,string> = {
  incheon:'#64748b', tianjin:'#3B82F6', erlian:'#8B5CF6', zamiin_uud:'#F59E0B',
  customs:'#EF4444', warehouse:'#10B981', delivering:'#0EA5E9', delivered:'#22C55E',
};

export const CARGO_TYPE_LABELS: Record<string,string> = {
  express:'Газрын экспресс', normal:'Газрын энгийн', online:'Онлайн захиалга',
  vehicle:'Автомашин', oversized:'Том оврын ачаа', wholesale:'Бөөний ачаа',
};
