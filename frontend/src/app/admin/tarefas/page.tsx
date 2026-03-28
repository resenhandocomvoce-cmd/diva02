'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { HomeIcon, UsersIcon, PostIcon, TaskIcon, ChartIcon, PlusIcon, TrashIcon } from '@/components/Icons';
import { tarefas as tarefasApi } from '@/lib/api';
import { Tarefa } from '@/types';

const sidebarItems = [
  { label: 'Dashboard', href: '/admin', icon: <HomeIcon /> },
  { label: 'Participantes', href: '/admin/participantes', icon: <UsersIcon /> },
  { label: 'Posts do Dia', href: '/admin/posts', icon: <PostIcon /> },
  { label: 'Tarefas', href: '/admin/tarefas', icon: <TaskIcon /> },
  { label: 'Relatórios', href: '/admin/relatorios', icon: <ChartIcon /> },
];

export default function TarefasAdminPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ tipo: 'curtir', descricao: '' });

  useEffect(() => {
    loadTarefas();
  }, []);

  const loadTarefas = async () => {
    try {
      const response = await tarefasApi.getAll();
      setTarefas(response.data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await tarefasApi.create(formData);
      setShowModal(false);
      setFormData({ tipo: 'curtir', descricao: '' });
      loadTarefas();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (id: string, ativa: boolean) => {
    try {
      await tarefasApi.update(id, { ativa: !ativa });
      loadTarefas();
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;
    try {
      await tarefasApi.delete(id);
      loadTarefas();
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
    }
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'curtir': return '❤️';
      case 'comentar': return '💬';
      case 'seguir': return '👤';
      default: return '✅';
    }
  };

  return (
    <div className="flex min-h-screen bg-rose-50">
      <Sidebar items={sidebarItems} />
      <div className="flex-1">
        <Header title="Tarefas" />
        <main className="p-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/admin" className="text-rose-500 hover:underline">
              ← Voltar ao Dashboard
            </Link>
            <button onClick={() => setShowModal(true)} className="btn-primary flex items-center gap-2">
              <PlusIcon /> Nova Tarefa
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tarefas.map((tarefa) => (
                <div key={tarefa.id} className={`card p-4 ${!tarefa.ativa ? 'opacity-60' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTipoIcon(tarefa.tipo)}</span>
                      <div>
                        <h3 className="font-semibold text-gray-800 capitalize">{tarefa.tipo}</h3>
                        <p className="text-sm text-gray-500">{tarefa.descricao}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-rose-100">
                    <button
                      onClick={() => handleToggle(tarefa.id, tarefa.ativa)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        tarefa.ativa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tarefa.ativa ? 'Ativa' : 'Inativa'}
                    </button>
                    <button
                      onClick={() => handleDelete(tarefa.id)}
                      className="p-1 text-red-500 hover:bg-red-50 rounded"
                    >
                      <TrashIcon />
                    </button>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nova Tarefa</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                  className="input"
                >
                  <option value="curtir">Curtir</option>
                  <option value="comentar">Comentar</option>
                  <option value="seguir">Seguir</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  className="input"
                  placeholder="Ex: Curtir o post do dia"
                  required
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
                  {saving ? 'Salvando...' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
