export interface User {
  id: string;
  nome: string;
  email: string;
  whatsapp?: string;
  foto_perfil?: string;
  tipo: 'superadmin' | 'admin' | 'user';
  status: 'pendente' | 'ativa' | 'inativa' | 'bloqueada';
  penalidades: number;
  created_at?: string;
}

export interface Tarefa {
  id: string;
  tipo: 'curtir' | 'comentar' | 'seguir' | 'outro';
  descricao: string;
  ativa: boolean;
  created_at?: string;
}

export interface Post {
  id: string;
  link: string;
  usuario_id: string;
  usuario_nome?: string;
  descricao?: string;
  data: string;
  created_at?: string;
  conclusoes?: Conclusao[];
}

export interface Conclusao {
  id: string;
  usuario_id: string;
  tarefa_id: string;
  post_id?: string;
  status: 'pendente' | 'concluida' | 'verificada';
  tipo?: string;
  descricao?: string;
  created_at?: string;
  usuario_nome?: string;
  foto_perfil?: string;
}

export interface TodayProgress {
  totalTarefas: number;
  tarefasConcluidas: number;
  tarefasPendentes: number;
  conclusoes: Conclusao[];
}

export interface Stats {
  totalUsuarios: number;
  ativas: number;
  pendentes: number;
  inativas: number;
  admins: number;
}
