'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { useAdminAuth } from '@/lib/adminAuth';

interface StoreData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  aboutTitle: string;
  aboutContent: string;
}

export default function AdminLojaPage() {
  const { token } = useAdminAuth();
  const [data, setData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    apiFetch<StoreData>('/store-info')
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data || !token) return;
    setSaving(true);
    setMessage('');

    try {
      await apiFetch('/admin/store-info', {
        method: 'PUT',
        token,
        body: JSON.stringify(data),
      });
      setMessage('Informações atualizadas com sucesso!');
    } catch {
      setMessage('Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="animate-pulse">Carregando...</div>;
  if (!data) return <div>Erro ao carregar dados da loja</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Informações da Loja</h1>

      {message && (
        <div className="rounded bg-green-50 p-3 text-sm text-green-700">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <Field label="Nome" value={data.name} onChange={(v) => setData({ ...data, name: v })} />
        <Field label="Endereço" value={data.address} onChange={(v) => setData({ ...data, address: v })} />
        <div className="grid grid-cols-3 gap-4">
          <Field label="Cidade" value={data.city} onChange={(v) => setData({ ...data, city: v })} />
          <Field label="Estado" value={data.state} onChange={(v) => setData({ ...data, state: v })} />
          <Field label="CEP" value={data.zipCode} onChange={(v) => setData({ ...data, zipCode: v })} />
        </div>
        <Field label="Telefone" value={data.phone} onChange={(v) => setData({ ...data, phone: v })} />
        <Field label="Título Sobre" value={data.aboutTitle} onChange={(v) => setData({ ...data, aboutTitle: v })} />
        <div>
          <label className="block text-sm font-medium text-primary-light">Conteúdo Sobre</label>
          <textarea
            value={data.aboutContent}
            onChange={(e) => setData({ ...data, aboutContent: e.target.value })}
            rows={5}
            className="mt-1 w-full rounded border border-brand-300 px-3 py-2 focus:border-accent focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent-dark disabled:opacity-50"
        >
          {saving ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-primary-light">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded border border-brand-300 px-3 py-2 focus:border-accent focus:outline-none"
      />
    </div>
  );
}
