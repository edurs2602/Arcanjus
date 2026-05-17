'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useAdminAuth } from '@/lib/adminAuth';

interface ShirtItem {
  id: string;
  name: string;
  price: number;
  color: string;
  category: string;
  active: boolean;
  clickCount: number;
}

export default function AdminCamisasPage() {
  const { token } = useAdminAuth();
  const [shirts, setShirts] = useState<ShirtItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ shirts: ShirtItem[] }>('/admin/shirts', { token })
      .then((data) => setShirts(data.shirts))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  async function handleDelete(id: string) {
    if (!confirm('Desativar esta camisa?')) return;
    await apiFetch(`/admin/shirts/${id}`, { method: 'DELETE', token: token! });
    setShirts((prev) => prev.map((s) => (s.id === id ? { ...s, active: false } : s)));
  }

  if (loading) return <div className="animate-pulse">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Camisas</h1>
        <Link
          href="/admin/camisas/nova"
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
        >
          + Nova Camisa
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-brand-50">
            <tr>
              <th className="px-4 py-3 font-medium text-primary-light">Nome</th>
              <th className="px-4 py-3 font-medium text-primary-light">Preço</th>
              <th className="px-4 py-3 font-medium text-primary-light">Cor</th>
              <th className="px-4 py-3 font-medium text-primary-light">Status</th>
              <th className="px-4 py-3 font-medium text-primary-light">Cliques</th>
              <th className="px-4 py-3 font-medium text-primary-light">Ações</th>
            </tr>
          </thead>
          <tbody>
            {shirts.map((shirt) => (
              <tr key={shirt.id} className="border-b last:border-0">
                <td className="px-4 py-3 font-medium text-primary">{shirt.name}</td>
                <td className="px-4 py-3">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(shirt.price)}
                </td>
                <td className="px-4 py-3 capitalize">{shirt.color}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      shirt.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {shirt.active ? 'Ativa' : 'Inativa'}
                  </span>
                </td>
                <td className="px-4 py-3">{shirt.clickCount}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/camisas/${shirt.id}`} className="text-accent hover:underline">
                    Editar
                  </Link>
                  {shirt.active && (
                    <button
                      onClick={() => handleDelete(shirt.id)}
                      className="ml-3 text-red-500 hover:underline"
                    >
                      Desativar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
