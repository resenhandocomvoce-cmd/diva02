'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { HomeIcon, ListIcon, TaskIcon, UserIcon } from '@/components/Icons';
import { conclusoes, posts } from '@/lib/api';
import { TodayProgress, Post } from '@/types';

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { label: 'Feed do Dia', href: '/dashboard/feed', icon: <ListIcon /> },
  { label: 'Minhas Tarefas', href: '/dashboard/tarefas', icon: <TaskIcon /> },
  { label: 'Meu Perfil', href: '/dashboard/perfil', icon: <UserIcon /> },
];

export default function UserDashboard() {
  const [progress, setProgress] = useState<TodayProgress | null>(null);
  const [postsToday, setPostsToday] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [progressRes, postsRes] = await Promise.all([
        conclusoes.getProgress(),
        posts.getToday(),
      ]);
      setProgress(progressRes.data);
      setPostsToday(postsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const percentage = progress && progress.totalTarefas > 0 
    ? Math.round((progress.tarefasConcluidas / progress.totalTarefas) * 100) 
    : 0;

  return (
    <div className="flex min-h-screen bg-rose-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1">
        <Header title="Dashboard" />
        <main className="p-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Progresso do Dia</h3>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-rose-600 bg-rose-200">
                        Tarefas
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-rose-600">
                        {progress?.tarefasConcluidas || 0}/{progress?.totalTarefas || 0}
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-rose-100">
                    <div
                      style={{ width: `${percentage}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-rose-500 transition-all duration-500"
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{percentage}% completo</p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Posts de Hoje</h3>
                <p className="text-3xl font-bold text-rose-500">{postsToday.length}</p>
                <p className="text-sm text-gray-500 mt-2">posts disponíveis</p>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Status</h3>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-gray-700">Ativa no grupo</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Continue assim!</p>
              </div>

              <div className="card p-6 col-span-full">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Posts do Dia</h3>
                {postsToday.length === 0 ? (
                  <p className="text-gray-500">Nenhum post disponível hoje.</p>
                ) : (
                  <div className="space-y-3">
                    {postsToday.slice(0, 5).map((post) => (
                      <div key={post.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                        <span className="text-sm text-gray-700 truncate max-w-md">{post.link}</span>
                        <a
                          href={post.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-rose-500 hover:text-rose-600 text-sm font-medium"
                        >
                          Ir para post →
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                <Link href="/dashboard/feed" className="inline-block mt-4 text-rose-500 hover:underline text-sm">
                  Ver todos os posts →
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
