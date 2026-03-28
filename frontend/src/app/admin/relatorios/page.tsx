'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { HomeIcon, UsersIcon, PostIcon, TaskIcon, ChartIcon } from '@/components/Icons';
import { users, conclusoes } from '@/lib/api';
import { User, Stats } from '@/types';

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: <HomeIcon /> },
  { label: 'Participantes', href: '/admin/participantes', icon: <UsersIcon /> },
  { label: 'Posts do Dia', href: '/admin/posts', icon: <PostIcon /> },
  { label: 'Tarefas', href: '/admin/tarefas', icon: <TaskIcon /> },
  { label: 'Relatórios', href: '/admin/relatorios', icon: <ChartIcon /> },
];

export default function RelatoriosPage() {
  const [participantes, setParticipantes] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<Record<string, any>>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [usersRes, statsRes] = await Promise.all([
        users.getAll({ tipo: 'user' }),
        users.getStats(),
      ]);
      setParticipantes(usersRes.data);
      setStats(statsRes.data);

      const activity: Record<string, any> = {};
      for (const user of usersRes.data.slice(0, 10)) {
        try {
          const actRes = await conclusoes.getActivity(user.id);
          activity[user.id] = actRes.data;
        } catch {
          activity[user.id] = { conclusoes: [], atividades: [] };
        }
      }
      setActivityData(activity);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getConclusoesCount = (userId: string) => {
    return activityData[userId]?.conclusoes?.filter(
      (c: any) => c.status === 'concluida' || c.status === 'verificada'
    ).length || 0;
  };

  return (
    <div className="flex min-h-screen bg-rose-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1">
        <Header title="Relatórios" />
        <main className="p-8">
          <Link href="/admin" className="text-rose-500 hover:underline mb-6 inline-block">
            ← Voltar ao Dashboard
          </Link>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="card p-6 text-center">
                  <p className="text-3xl font-bold text-rose-500">{stats?.totalUsuarios || 0}</p>
                  <p className="text-sm text-gray-500">Total Usuárias</p>
                </div>
                <div className="card p-6 text-center">
                  <p className="text-3xl font-bold text-green-500">{stats?.ativas || 0}</p>
                  <p className="text-sm text-gray-500">Ativas</p>
                </div>
                <div className="card p-6 text-center">
                  <p className="text-3xl font-bold text-yellow-500">{stats?.pendentes || 0}</p>
                  <p className="text-sm text-gray-500">Pendentes</p>
                </div>
                <div className="card p-6 text-center">
                  <p className="text-3xl font-bold text-red-500">{stats?.inativas || 0}</p>
                  <p className="text-sm text-gray-500">Inativas</p>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Atividade das Participantes</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-rose-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participante</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarefas Concluídas</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penalidades</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-100">
                      {participantes.map((p) => (
                        <tr key={p.id} className="hover:bg-rose-50">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 text-sm font-bold">
                                {p.nome?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{p.nome}</p>
                                <p className="text-xs text-gray-500">{p.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              p.status === 'ativa' ? 'bg-green-100 text-green-700' :
                              p.status === 'pendente' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700">
                            {getConclusoesCount(p.id)}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              p.penalidades > 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                              {p.penalidades || 0}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
