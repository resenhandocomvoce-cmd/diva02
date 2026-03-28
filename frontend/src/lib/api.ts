import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const auth = {
  register: async (data: { nome: string; email: string; whatsapp?: string; senha: string }) => {
    const res = await api.post('/auth', data);
    return { data: res.data };
  },
  login: async (data: { email: string; senha: string }) => {
    const res = await api.post('/auth/login', data);
    return { data: res.data };
  },
};

export const users = {
  getAll: async (params?: { tipo?: string; status?: string }) => {
    const res = await api.get('/users', { params });
    return { data: res.data };
  },
  getById: async (id: string) => {
    const res = await api.get(`/users/${id}`);
    return { data: res.data };
  },
  update: async (id: string, data: any) => {
    const res = await api.put(`/users/${id}`, data);
    return { data: res.data };
  },
  delete: async (id: string) => {
    const res = await api.delete(`/users/${id}`);
    return { data: res.data };
  },
  getStats: async () => {
    const res = await api.get('/users/stats');
    return { data: res.data };
  },
};

export const tarefas = {
  getAll: async (params?: { ativa?: boolean }) => {
    const res = await api.get('/tarefas', { params });
    return { data: res.data };
  },
  create: async (data: { tipo: string; descricao: string }) => {
    const res = await api.post('/tarefas', data);
    return { data: res.data };
  },
  update: async (id: string, data: any) => {
    const res = await api.put(`/tarefas/${id}`, data);
    return { data: res.data };
  },
  delete: async (id: string) => {
    const res = await api.delete(`/tarefas/${id}`);
    return { data: res.data };
  },
};

export const posts = {
  getAll: async (params?: { data?: string }) => {
    const res = await api.get('/posts', { params });
    return { data: res.data };
  },
  getToday: async () => {
    const res = await api.get('/posts');
    return { data: res.data };
  },
  getById: async (id: string) => {
    const res = await api.get(`/posts/${id}`);
    return { data: res.data };
  },
  create: async (data: { link: string; descricao?: string; data?: string }) => {
    const res = await api.post('/posts', data);
    return { data: res.data };
  },
  update: async (id: string, data: any) => {
    const res = await api.put(`/posts/${id}`, data);
    return { data: res.data };
  },
  delete: async (id: string) => {
    const res = await api.delete(`/posts/${id}`);
    return { data: res.data };
  },
};

export const conclusoes = {
  completeTask: async (data: { tarefa_id: string; post_id?: string }) => {
    const res = await api.post('/conclusoes', data);
    return { data: res.data };
  },
  getProgress: async () => {
    const res = await api.get('/conclusoes');
    return { data: res.data };
  },
  getByUser: async (usuario_id: string) => {
    const res = await api.get(`/conclusoes/user/${usuario_id}`);
    return { data: res.data };
  },
  getByPost: async (post_id: string) => {
    const res = await api.get(`/conclusoes/post/${post_id}`);
    return { data: res.data };
  },
  getActivity: async (usuario_id: string) => {
    const res = await api.get(`/conclusoes/activity/${usuario_id}`);
    return { data: res.data };
  },
  verificar: async (id: string, status: string) => {
    const res = await api.put(`/conclusoes/verify/${id}`, { status });
    return { data: res.data };
  },
};

export default api;
