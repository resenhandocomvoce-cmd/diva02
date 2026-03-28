'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { HomeIcon, ListIcon, TaskIcon, UserIcon, ExternalLinkIcon, CheckIcon } from '@/components/Icons';
import { posts, tarefas, conclusoes } from '@/lib/api';
import { Post, Tarefa } from '@/types';

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { label: 'Feed do Dia', href: '/dashboard/feed', icon: <ListIcon /> },
  { label: 'Minhas Tarefas', href: '/dashboard/tarefas', icon: <TaskIcon /> },
  { label: 'Meu Perfil', href: '/dashboard/perfil', icon: <UserIcon /> },
];

export default function FeedPage() {
  const [postsToday, setPostsToday] = useState<Post[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsRes, tarefasRes] = await Promise.all([
        posts.getToday(),
        tarefas.getAll({ ativa: true }),
      ]);
      setPostsToday(postsRes.data);
      setTarefas(tarefasRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (postId: string, tarefaId: string) => {
    setCompleting(tarefaId);
    try {
      await conclusoes.completeTask({ tarefa_id: tarefaId, post_id: postId });
      await loadData();
    } catch (error) {
      console.error('Erro ao completar tarefa:', error);
    } finally {
      setCompleting(null);
    }
  };

  const isConcluida = (postId: string, tarefaId: string) => {
    const post = postsToday.find(p => p.id === postId);
    if (!post?.conclusoes) return false;
    return post.conclusoes.some(
      c => c.tarefa_id === tarefaId && (c.status === 'concluida' || c.status === 'verificada')
    );
  };

  return (
    <div className="flex min-h-screen bg-rose-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1">
        <Header title="Feed do Dia" />
        <main className="p-8">
          <Link href="/dashboard" className="text-rose-500 hover:underline mb-4 inline-block">
            ← Voltar ao Dashboard
          </Link>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : postsToday.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-500 text-lg">Nenhum post disponível hoje.</p>
              <p className="text-gray-400 mt-2">Volte mais tarde!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {postsToday.map((post) => (
                <div key={post.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Post do dia</h3>
                      <p className="text-sm text-gray-500">{post.descricao || 'Post de engajamento'}</p>
                    </div>
                    <a
                      href={post.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-rose-500 hover:text-rose-600 font-medium"
                    >
                      <ExternalLinkIcon />
                      Ir para post
                    </a>
                  </div>

                  <div className="border-t border-rose-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Tarefas:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {tarefas.map((tarefa) => {
                        const concluida = isConcluida(post.id, tarefa.id);
                        return (
                          <button
                            key={tarefa.id}
                            onClick={() => !concluida && handleComplete(post.id, tarefa.id)}
                            disabled={completing === tarefa.id || concluida}
                            className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                              concluida
                                ? 'bg-green-100 text-green-700'
                                : 'bg-rose-50 hover:bg-rose-100 text-gray-700'
                            } disabled:opacity-50`}
                          >
                            <span className="capitalize">{tarefa.tipo}</span>
                            {concluida ? (
                              <CheckIcon />
                            ) : (
                              <span className="text-xs text-rose-500">Marcar ✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
