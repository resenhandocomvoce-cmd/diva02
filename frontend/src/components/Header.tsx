'use client';

import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-rose-100 px-8 py-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 font-bold">
            {user?.nome?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-700">{user?.nome}</span>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          user?.status === 'ativa' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
          {user?.status === 'ativa' ? 'Ativa' : 'Pendente'}
        </span>
      </div>
    </header>
  );
}
