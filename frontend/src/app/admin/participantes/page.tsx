'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { HomeIcon, UsersIcon, PostIcon, TaskIcon, ChartIcon, CheckIcon, TrashIcon } from '@/components/Icons';
import { users as usersApi } from '@/lib/api';
import { User } from '@/types';

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: <HomeIcon /> },
  { label: 'Participantes', href: '/admin/participantes', icon: <UsersIcon /> },
  { label: 'Posts do Dia', href: '/admin/posts', icon: <PostIcon /> },
  { label: 'Tarefas', href: '/admin/tarefas', icon: <TaskIcon /> },
  { label: 'Relatórios', href: '/admin/relatorios', icon: <ChartIcon /> },
];

export default function ParticipantesPage() {
  const [participantes, setParticipantes] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'ativa' | 'pendente' | 'inativa'>('all');

  useEffect(() => {
    loadParticipantes();
  }, [filter]);

  const loadParticipantes = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { tipo: 'user', status: filter } : { tipo: 'user' };
      const response = await usersApi.getAll(params);
      setParticipantes(response.data);
    } catch (error) {
      console.error('Erro ao carregar participantes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await usersApi.update(id, { status });
      loadParticipantes();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta usuária?')) return;
    try {
      await usersApi.delete(id);
      loadParticipantes();
    } catch (error) {
      console.error('Erro ao excluir:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ativa':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">Ativa</span>;
      case 'pendente':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs">Pendente</span>;
      case 'inativa':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">Inativa</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-rose-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1">
        <Header title="Participantes" />
        <main className="p-8">
          <Link href="/admin" className="text-rose-500 hover:underline mb-4 inline-block">
            ← Voltar ao Dashboard
          </Link>

          <div className="flex gap-2 mb-6">
            {(['all', 'ativa', 'pendente', 'inativa'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === f
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-rose-50'
                }`}
              >
                {f === 'all' ? 'Todas' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : participantes.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-500 text-lg">Nenhuma participante encontrada.</p>
            </div>
          ) : (
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead className="bg-rose-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-rose-100">
                  {participantes.map((p) => (
                    <tr key={p.id} className="hover:bg-rose-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 text-sm font-bold">
                            {p.nome?.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{p.nome}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.whatsapp || '-'}</td>
                      <td className="px-6 py-4">{getStatusBadge(p.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {p.status === 'pendente' && (
                            <button
                              onClick={() => handleStatusChange(p.id, 'ativa')}
                              className="p-1 text-green-600 hover:bg-green-50 rounded"
                              title="Aprovar"
                            >
                              <CheckIcon />
                            </button>
                          )}
                          {p.status === 'ativa' && (
                            <button
                              onClick={() => handleStatusChange(p.id, 'inativa')}
                              className="p-1 text-yellow-600 hover:bg-yellow-50 rounded"
                              title="Inativar"
                            >
                              ⏸
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Excluir"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
