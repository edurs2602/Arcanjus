'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AdminAuthProvider, useAdminAuth } from '@/lib/adminAuth';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/camisas', label: 'Camisas', icon: '👕' },
  { href: '/admin/loja', label: 'Loja', icon: '🏪' },
  { href: '/admin/analytics', label: 'Analytics', icon: '📈' },
];

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAdminAuth();
  const pathname = usePathname();

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Carregando...</div>;
  }

  if (!user && pathname !== '/admin/login') {
    return <>{children}</>;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r border-brand-200 bg-white p-6">
        <div className="mb-8">
          <h2 className="font-display text-lg font-bold text-primary">Arcanjus</h2>
          <p className="text-xs text-primary-light">Painel Admin</p>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-accent/10 font-medium text-accent-dark'
                  : 'text-primary-light hover:bg-brand-50'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-8">
          <div className="border-t border-brand-200 pt-4">
            <p className="text-xs text-primary-light">{user?.email}</p>
            <button
              onClick={logout}
              className="mt-2 text-xs text-red-500 hover:underline"
            >
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-brand-50 p-8">{children}</main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminAuthProvider>
  );
}
