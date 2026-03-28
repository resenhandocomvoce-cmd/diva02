'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { HomeIcon, UsersIcon, PostIcon, TaskIcon, ChartIcon, PlusIcon, TrashIcon, ExternalLinkIcon, CheckIcon } from '@/components/Icons';
import { posts as postsApi, conclusoes as conclusoesApi } from '@/lib/api';
import { Post } from '@/types';

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: <HomeIcon /> },
  { label: 'Participantes', href: '/admin/participantes', icon: <UsersIcon /> },
  { label: 'Posts do Dia', href: '/admin/posts', icon: <PostIcon /> },
  { label: 'Tarefas', href: '/admin/tarefas', icon: <TaskIcon /> },
  { label: 'Relatórios', href: '/admin/relatorios', icon: <ChartIcon /> },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ link: '', descricao: '' });

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await postsApi.getToday();
      setPosts(response.data);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await postsApi.create(formData);
      setShowModal(false);
      setFormData({ link: '', descricao: '' });
      loadPosts();
    } catch (error) {
      console.error('Erro ao criar post:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) return;
    try {
      await postsApi.delete(id);
      loadPosts();
    } catch (error) {
      console.error('Erro ao excluir post:', error);
    }
  };

  const handleVerificar = async (conclusaoId: string, status: string) => {
    try {
      await conclusoesApi.verificar(conclusaoId, status);
      loadPosts();
    } catch (error) {
      console.error('Erro ao verificar:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-rose-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1">
        <Header title="Posts do Dia" />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/admin" className="text-rose-500 hover:underline">
              ← Voltar ao Dashboard
            </Link>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
              <PlusIcon /> Adicionar Post
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-500 text-lg">Nenhum post adicionado hoje.</p>
              <button onClick={() => setShowModal(true)} className="btn-primary mt-4">
                Adicionar primeiro post
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-800">{post.descricao || 'Post do dia'}</h3>
                      <a
                        href={post.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-rose-500 hover:underline text-sm flex items-center gap-1 mt-1"
                      >
                        {post.link} <ExternalLinkIcon />
                      </a>
                    </div>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded"
                    >
                      <TrashIcon />
                    </button>
                  </div>

                  <div className="border-t border-rose-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Conclusões ({post.conclusoes?.length || 0})
                    </h4>
                    {post.conclusoes && post.conclusoes.length > 0 ? (
                      <div className="space-y-2">
                        {post.conclusoes.map((c) => (
                          <div key={c.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 text-xs font-bold">
                                {c.usuario_nome?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-800">{c.usuario_nome}</p>
                                <p className="text-xs text-gray-500 capitalize">{c.tipo}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {c.status === 'concluida' && (
                                <button
                                  onClick={() => handleVerificar(c.id, 'verificada')}
                                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full"
                                >
                                  Verificar ✓
                                </button>
                              )}
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                c.status === 'verificada' ? 'bg-purple-100 text-purple-700' :
                                c.status === 'concluida' ? 'bg-green-100 text-green-700' :
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {c.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">Nenhuma conclusão ainda.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Adicionar Post</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link do Post</label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="input"
                  placeholder="https://instagram.com/p/..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="input"
                  placeholder="Ex: Post da semana"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
