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
  register: (data: { nome: string; email: string; whatsapp?: string; senha: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; senha: string }) =>
    api.post('/auth/login', data),
};

export const users = {
  getAll: (params?: { tipo?: string; status?: string }) =>
    api.get('/users', { params }),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  delete: (id: string) => api.delete(`/users/${id}`),
  getStats: () => api.get('/users/stats'),
};

export const tarefas = {
  getAll: (params?: { ativa?: boolean }) =>
    api.get('/tarefas', { params }),
  create: (data: { tipo: string; descricao: string }) =>
    api.post('/tarefas', data),
  update: (id: string, data: any) => api.put(`/tarefas/${id}`, data),
  delete: (id: string) => api.delete(`/tarefas/${id}`),
};

export const posts = {
  getAll: (params?: { data?: string }) =>
    api.get('/posts', { params }),
  getToday: () => api.get('/posts/today'),
  getById: (id: string) => api.get(`/posts/${id}`),
  create: (data: { link: string; descricao?: string; data?: string }) =>
    api.post('/posts', data),
  update: (id: string, data: any) => api.put(`/posts/${id}`, data),
  delete: (id: string) => api.delete(`/posts/${id}`),
};

export const conclusoes = {
  completeTask: (data: { tarefa_id: string; post_id?: string }) =>
    api.post('/conclusoes/complete', data),
  getProgress: () => api.get('/conclusoes/progress'),
  getByUser: (usuario_id: string) => api.get(`/conclusoes/user/${usuario_id}`),
  getByPost: (post_id: string) => api.get(`/conclusoes/post/${post_id}`),
  getActivity: (usuario_id: string) => api.get(`/conclusoes/activity/${usuario_id}`),
  verificar: (id: string, status: string) =>
    api.put(`/conclusoes/verify/${id}`, { status }),
};

export default api;
