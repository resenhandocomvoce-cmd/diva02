'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { HomeIcon, ListIcon, TaskIcon, UserIcon, CheckIcon } from '@/components/Icons';
import { tarefas, conclusoes } from '@/lib/api';
import { Tarefa, TodayProgress } from '@/types';

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { label: 'Feed do Dia', href: '/dashboard/feed', icon: <ListIcon /> },
  { label: 'Minhas Tarefas', href: '/dashboard/tarefas', icon: <TaskIcon /> },
  { label: 'Meu Perfil', href: '/dashboard/perfil', icon: <UserIcon /> },
];

export default function TarefasPage() {
  const [tarefasList, setTarefasList] = useState<Tarefa[]>([]);
  const [progress, setProgress] = useState<TodayProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [tarefasRes, progressRes] = await Promise.all([
        tarefas.getAll({ ativa: true }),
        conclusoes.getProgress(),
      ]);
      setTarefasList(tarefasRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (tarefaId: string) => {
    setCompleting(tarefaId);
    try {
      await conclusoes.completeTask({ tarefa_id: tarefaId });
      await loadData();
    } catch (error) {
      console.error('Erro ao completar tarefa:', error);
    } finally {
      setCompleting(null);
    }
  };

  const isConcluida = (tarefaId: string) => {
    return progress?.conclusoes?.some(
      c => c.tarefa_id === tarefaId && (c.status === 'concluida' || c.status === 'verificada')
    );
  };

  const getTarefaIcon = (tipo: string) => {
    switch (tipo) {
      case 'curtir':
        return '❤️';
      case 'comentar':
        return '💬';
      case 'seguir':
        return '👤';
      default:
        return '✅';
    }
  };

  return (
    <div className="flex min-h-screen bg-rose-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1">
        <Header title="Minhas Tarefas" />
        <main className="p-8">
          <Link href="/dashboard" className="text-rose-500 hover:underline mb-4 inline-block">
            ← Voltar ao Dashboard
          </Link>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumo</h3>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Concluídas</span>
                  <span className="font-bold text-rose-500">{progress?.tarefasConcluidas || 0}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Pendentes</span>
                  <span className="font-bold text-yellow-500">{progress?.tarefasPendentes || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total</span>
                  <span className="font-bold text-gray-800">{progress?.totalTarefas || 0}</span>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Progresso</h3>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-4 mb-2 text-xs flex rounded-full bg-rose-100">
                    <div
                      style={{
                        width: `${
                          progress && progress.totalTarefas > 0
                            ? Math.round((progress.tarefasConcluidas / progress.totalTarefas) * 100)
                            : 0
                        }%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-rose-500 transition-all duration-500"
                    ></div>
                  </div>
                  <p className="text-center text-sm text-gray-600">
                    {progress && progress.totalTarefas > 0
                      ? Math.round((progress.tarefasConcluidas / progress.totalTarefas) * 100)
                      : 0}
                    % completo
                  </p>
                </div>
              </div>

              <div className="card p-6 col-span-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Lista de Tarefas</h3>
                <div className="space-y-3">
                  {tarefasList.map((tarefa) => {
                    const concluida = isConcluida(tarefa.id);
                    return (
                      <div
                        key={tarefa.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          concluida ? 'bg-green-50 border-green-200' : 'bg-white border-rose-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{getTarefaIcon(tarefa.tipo)}</span>
                          <div>
                            <p className="font-medium text-gray-800 capitalize">{tarefa.tipo}</p>
                            <p className="text-sm text-gray-500">{tarefa.descricao}</p>
                          </div>
                        </div>
                        {concluida ? (
                          <span className="flex items-center gap-1 text-green-600 font-medium">
                            <CheckIcon /> Concluída
                          </span>
                        ) : (
                          <button
                            onClick={() => handleComplete(tarefa.id)}
                            disabled={completing === tarefa.id}
                            className="btn-primary disabled:opacity-50"
                          >
                            {completing === tarefa.id ? 'Marcando...' : 'Marcar como concluída'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
