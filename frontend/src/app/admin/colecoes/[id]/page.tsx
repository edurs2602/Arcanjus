'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAdminAuth } from '@/lib/adminAuth';

interface CollectionForm {
  name: string;
  description: string;
  bannerAlt: string;
  order: string;
}

export default function AdminCollectionEditPage() {
  const { token } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nova';

  const [form, setForm] = useState<CollectionForm>({
    name: '',
    description: '',
    bannerAlt: '',
    order: '0',
  });
  const [banner, setBanner] = useState<File | null>(null);
  const [existingBanner, setExistingBanner] = useState('');
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew || !token) {
      setLoading(false);
      return;
    }
    apiFetch<{
      name: string;
      description: string | null;
      bannerUrl: string;
      bannerAlt: string;
      order: number;
    }>(`/admin/collections/${id}`, { token })
      .then((col) => {
        setForm({
          name: col.name,
          description: col.description ?? '',
          bannerAlt: col.bannerAlt,
          order: String(col.order),
        });
        setExistingBanner(col.bannerUrl);
      })
      .catch(() => setError('Coleção não encontrada'))
      .finally(() => setLoading(false));
  }, [id, isNew, token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError('');
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('bannerAlt', form.bannerAlt || form.name);
      formData.append('order', form.order);

      if (banner) {
        formData.append('banner', banner);
      } else if (isNew) {
        setError('Adicione uma imagem de banner');
        setSaving(false);
        return;
      }

      const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';
      const url = isNew
        ? `${apiBase}/admin/collections`
        : `${apiBase}/admin/collections/${id}`;

      await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      router.push('/admin/colecoes');
    } catch {
      setError('Erro ao salvar coleção');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="animate-pulse">Carregando...</div>;

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:3001';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">
          {isNew ? 'Nova Coleção' : `Editar: ${form.name}`}
        </h1>
        <button
          onClick={() => router.push('/admin/colecoes')}
          className="text-sm text-primary-light hover:underline"
        >
          ← Voltar
        </button>
      </div>

      {error && <div className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-primary-light">Nome da Coleção</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="mt-1 w-full rounded border border-brand-300 px-3 py-2 focus:border-accent focus:outline-none"
            placeholder="Coleção Verão 2026"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-primary-light">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="mt-1 w-full rounded border border-brand-300 px-3 py-2 focus:border-accent focus:outline-none"
            placeholder="Descrição opcional da coleção..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-light">Texto alternativo (banner)</label>
            <input
              type="text"
              value={form.bannerAlt}
              onChange={(e) => setForm({ ...form, bannerAlt: e.target.value })}
              className="mt-1 w-full rounded border border-brand-300 px-3 py-2 focus:border-accent focus:outline-none"
              placeholder="Descrição da imagem"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-light">Ordem de exibição</label>
            <input
              type="number"
              min="0"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
              className="mt-1 w-full rounded border border-brand-300 px-3 py-2 focus:border-accent focus:outline-none"
            />
          </div>
        </div>

        {/* Existing banner */}
        {!isNew && existingBanner && (
          <div>
            <label className="block text-sm font-medium text-primary-light">Banner atual</label>
            <div className="mt-2 overflow-hidden rounded border">
              <img
                src={`${apiBase}${existingBanner}`}
                alt={form.bannerAlt || form.name}
                className="aspect-[21/9] w-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Banner upload */}
        <div>
          <label className="block text-sm font-medium text-primary-light">
            {isNew ? 'Banner (obrigatório)' : 'Substituir banner'}
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setBanner(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-sm text-primary-light file:mr-4 file:rounded file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent-dark hover:file:bg-accent/20"
          />
          <p className="mt-1 text-xs text-primary-light">
            Recomendado: 2100x900px (proporção 21:9)
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
          >
            {saving ? 'Salvando...' : isNew ? 'Criar Coleção' : 'Salvar Alterações'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/colecoes')}
            className="rounded border border-brand-300 px-6 py-2 text-sm text-primary-light hover:bg-brand-50"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
