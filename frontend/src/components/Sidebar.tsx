'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  items: { label: string; href: string; icon: JSX.Element }[];
}

export default function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <aside className="w-64 bg-white border-r border-rose-100 min-h-screen flex flex-col">
      <div className="p-6 border-b border-rose-100">
        <h1 className="text-2xl font-bold text-rose-500 flex items-center gap-2">
          👑 Central Divas
        </h1>
        <p className="text-xs text-rose-300 mt-1">2.0</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-rose-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 font-bold">
            {user?.nome?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.nome}</p>
            <p className="text-xs text-rose-500 capitalize">{user?.tipo}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}
