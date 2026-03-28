'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { HomeIcon, UsersIcon, PostIcon, TaskIcon, ChartIcon, CrownIcon } from '@/components/Icons';
import { users, posts } from '@/lib/api';
import { Stats, Post } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: <HomeIcon /> },
  { label: 'Participantes', href: '/admin/participantes', icon: <UsersIcon /> },
  { label: 'Posts do Dia', href: '/admin/posts', icon: <PostIcon /> },
  { label: 'Tarefas', href: '/admin/tarefas', icon: <TaskIcon /> },
  { label: 'Relatórios', href: '/admin/relatorios', icon: <ChartIcon /> },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [postsToday, setPostsToday] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsRes, postsRes] = await Promise.all([
        users.getStats(),
        posts.getToday(),
      ]);
      setStats(statsRes.data);
      setPostsToday(postsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const isSuperAdmin = user?.tipo === 'superadmin';

  return (
    <div className="flex min-h-screen bg-rose-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1">
        <Header title="Painel Admin" />
        <main className="p-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                    <UsersIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Usuárias</p>
                    <p className="text-2xl font-bold text-rose-500">{stats?.totalUsuarios || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600">✓</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ativas</p>
                    <p className="text-2xl font-bold text-green-500">{stats?.ativas || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <span className="text-yellow-600">⏳</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Pendentes</p>
                    <p className="text-2xl font-bold text-yellow-500">{stats?.pendentes || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <CrownIcon />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Admins</p>
                    <p className="text-2xl font-bold text-purple-500">{stats?.admins || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Posts de Hoje</h3>
              <Link href="/admin/posts" className="text-rose-500 hover:underline text-sm">
                Gerenciar →
              </Link>
            </div>
            {postsToday.length === 0 ? (
              <p className="text-gray-500">Nenhum post adicionado hoje.</p>
            ) : (
              <div className="space-y-2">
                {postsToday.slice(0, 5).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-3 bg-rose-50 rounded-lg">
                    <span className="text-sm text-gray-700 truncate max-w-md">{post.link}</span>
                    <span className="text-xs text-gray-500">
                      {post.conclusoes?.length || 0} conclusões
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
