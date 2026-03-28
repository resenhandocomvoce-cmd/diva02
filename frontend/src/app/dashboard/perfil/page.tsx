'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { HomeIcon, ListIcon, TaskIcon, UserIcon } from '@/components/Icons';
import { users } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { User } from '@/types';

const sidebarItems = [
  { label: 'Dashboard', href: '/dashboard', icon: <HomeIcon /> },
  { label: 'Feed do Dia', href: '/dashboard/feed', icon: <ListIcon /> },
  { label: 'Minhas Tarefas', href: '/dashboard/tarefas', icon: <TaskIcon /> },
  { label: 'Meu Perfil', href: '/dashboard/perfil', icon: <UserIcon /> },
];

export default function PerfilPage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    nome: '',
    whatsapp: '',
    foto_perfil: '',
  });

  useEffect(() => {
    if (authUser) {
      loadUser();
    }
  }, [authUser]);

  const loadUser = async () => {
    try {
      const response = await users.getById(authUser!.id);
      setUser(response.data);
      setFormData({
        nome: response.data.nome || '',
        whatsapp: response.data.whatsapp || '',
        foto_perfil: response.data.foto_perfil || '',
      });
    } catch (err) {
      console.error('Erro ao carregar usuário:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      await users.update(authUser!.id, formData);
      setSuccess('Perfil atualizado com sucesso!');
      localStorage.setItem('user', JSON.stringify({ ...authUser, ...formData }));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao atualizar perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen bg-rose-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1">
        <Header title="Meu Perfil" />
        <main className="p-8">
          <Link href="/dashboard" className="text-rose-500 hover:underline mb-4 inline-block">
            ← Voltar ao Dashboard
          </Link>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : (
            <div className="max-w-2xl">
              <div className="card p-6 mb-6">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 text-3xl font-bold">
                    {user?.nome?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{user?.nome}</h3>
                    <p className="text-gray-500">{user?.email}</p>
                    <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                      user?.status === 'ativa' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user?.status === 'ativa' ? 'Ativa' : 'Pendente'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Tipo:</span>
                    <span className="ml-2 font-medium capitalize">{user?.tipo}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Penalidades:</span>
                    <span className="ml-2 font-medium">{user?.penalidades || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Membro desde:</span>
                    <span className="ml-2 font-medium">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Editar Perfil</h3>
                
                {success && (
                  <div className="p-3 bg-green-50 text-green-600 text-sm rounded-lg mb-4">
                    {success}
                  </div>
                )}
                
                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg mb-4">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      name="nome"
                      value={formData.nome}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="input"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Foto de Perfil (URL)</label>
                    <input
                      type="text"
                      name="foto_perfil"
                      value={formData.foto_perfil}
                      onChange={handleChange}
                      className="input"
                      placeholder="https://..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full btn-primary py-3 disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar alterações'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
