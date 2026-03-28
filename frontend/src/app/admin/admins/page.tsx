'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { HomeIcon, UsersIcon, PostIcon, TaskIcon, ChartIcon, CrownIcon, PlusIcon, TrashIcon } from '@/components/Icons';
import { users as usersApi } from '@/lib/api';
import { User } from '@/types';

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: <HomeIcon /> },
  { label: 'Participantes', href: '/admin/participantes', icon: <UsersIcon /> },
  { label: 'Posts do Dia', href: '/admin/posts', icon: <PostIcon /> },
  { label: 'Tarefas', href: '/admin/tarefas', icon: <TaskIcon /> },
  { label: 'Relatórios', href: '/admin/relatorios', icon: <ChartIcon /> },
  { label: 'Admins', href: '/admin/admins', icon: <CrownIcon /> },
];

export default function AdminsPage() {
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    whatsapp: '',
    senha: '',
    tipo: 'admin',
  });

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      const response = await usersApi.getAll({ tipo: 'admin' });
      setAdmins(response.data);
    } catch (error) {
      console.error('Erro ao carregar admins:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersApi.update(formData.email, { tipo: formData.tipo });
      setShowModal(false);
      setFormData({ nome: '', email: '', whatsapp: '', senha: '', tipo: 'admin' });
      loadAdmins();
    } catch (error) {
      console.error('Erro ao criar admin:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePromote = async (id: string, tipo: 'admin' | 'user') => {
    try {
      await usersApi.update(id, { tipo });
      loadAdmins();
    } catch (error) {
      console.error('Erro ao atualizar:', error);
    }
  };

  const getBadge = (tipo: string) => {
    switch (tipo) {
      case 'superadmin':
        return <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">Super Admin</span>;
      case 'admin':
        return <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs">Admin</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-rose-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1">
        <Header title="Gestão de Admins" />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/admin" className="text-rose-500 hover:underline">
              ← Voltar ao Dashboard
            </Link>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
              <PlusIcon /> Novo Admin
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : admins.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-gray-500 text-lg">Nenhum admin encontrado.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {admins.map((admin) => (
                <div key={admin.id} className="card p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 text-xl font-bold">
                      {admin.nome?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{admin.nome}</h3>
                      {getBadge(admin.tipo)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{admin.email}</p>
                  {admin.tipo !== 'superadmin' && (
                    <button
                      onClick={() => handlePromote(admin.id, 'user')}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remover admin
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="card p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Novo Admin</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email do Usuário</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  placeholder="email@exemplo.com"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">O usuário deve estar cadastrado primeiro</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Acesso</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="input"
                >
                  <option value="admin">Admin</option>
                </select>
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
                  {saving ? 'Salvando...' : 'Promover'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
