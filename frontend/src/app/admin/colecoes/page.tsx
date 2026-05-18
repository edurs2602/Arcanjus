'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiFetch } from '@/lib/api';
import { useAdminAuth } from '@/lib/adminAuth';

interface CollectionItem {
  id: string;
  name: string;
  bannerUrl: string;
  active: boolean;
  order: number;
  _count: { shirts: number };
}

export default function AdminColecoesPage() {
  const { token } = useAdminAuth();
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    apiFetch<{ collections: CollectionItem[] }>('/admin/collections', { token })
      .then((data) => setCollections(data.collections))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [token]);

  async function handleDelete(id: string) {
    if (!confirm('Desativar esta coleção?')) return;
    await apiFetch(`/admin/collections/${id}`, { method: 'DELETE', token: token! });
    setCollections((prev) => prev.map((c) => (c.id === id ? { ...c, active: false } : c)));
  }

  if (loading) return <div className="animate-pulse">Carregando...</div>;

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:3001';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">Coleções</h1>
        <Link
          href="/admin/colecoes/nova"
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
        >
          + Nova Coleção
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {collections.map((collection) => (
          <div key={collection.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="relative aspect-[21/9] w-full overflow-hidden">
              <img
                src={`${apiBase}${collection.bannerUrl}`}
                alt={collection.name}
                className="h-full w-full object-cover"
              />
              {!collection.active && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="rounded bg-red-500 px-2 py-1 text-xs font-bold text-white">INATIVA</span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-primary">{collection.name}</h3>
                <span className="text-xs text-primary-light">Ordem: {collection.order}</span>
              </div>
              <p className="mt-1 text-xs text-primary-light">{collection._count.shirts} camisas</p>
              <div className="mt-3 flex gap-3">
                <Link href={`/admin/colecoes/${collection.id}`} className="text-sm text-accent hover:underline">
                  Editar
                </Link>
                {collection.active && (
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Desativar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {collections.length === 0 && (
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <p className="text-primary-light">Nenhuma coleção criada ainda.</p>
          <Link href="/admin/colecoes/nova" className="mt-2 inline-block text-sm text-accent hover:underline">
            Criar primeira coleção
          </Link>
        </div>
      )}
    </div>
  );
}
