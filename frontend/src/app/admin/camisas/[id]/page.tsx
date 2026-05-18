'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import { useAdminAuth } from '@/lib/adminAuth';

interface ShirtForm {
  name: string;
  description: string;
  price: string;
  color: string;
  category: string;
  sizes: string[];
  collectionId: string;
}

interface CollectionOption {
  id: string;
  name: string;
}

const AVAILABLE_SIZES = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];
const CATEGORIES = ['casual', 'social', 'polo', 'esporte'];

export default function AdminShirtEditPage() {
  const { token } = useAdminAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === 'nova';

  const [form, setForm] = useState<ShirtForm>({
    name: '',
    description: '',
    price: '',
    color: '',
    category: 'casual',
    sizes: [],
    collectionId: '',
  });
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<Array<{ id: string; url: string; alt: string; isAiGenerated?: boolean }>>([]);
  const [collections, setCollections] = useState<CollectionOption[]>([]);
  const [pipelineStatus, setPipelineStatus] = useState<{ pipelineStatus: string; pipelineError: string | null; aiColor: string | null; aiType: string | null; aiDescription: string | null } | null>(null);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [reprocessing, setReprocessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    // Load collections for the dropdown
    apiFetch<{ collections: CollectionOption[] }>('/admin/collections', { token })
      .then((data) => setCollections(data.collections))
      .catch(() => {});
  }, [token]);

  useEffect(() => {
    if (isNew || !token) return;
    apiFetch<{ pipelineStatus: string; pipelineError: string | null; aiColor: string | null; aiType: string | null; aiDescription: string | null }>(
      `/admin/shirts/${id}/pipeline-status`,
      { token },
    )
      .then(setPipelineStatus)
      .catch(() => {});
  }, [id, isNew, token]);

  useEffect(() => {
    if (isNew || !token) {
      setLoading(false);
      return;
    }
    apiFetch<{
      name: string;
      description: string;
      price: number;
      color: string;
      category: string;
      sizes: string[];
      collectionId: string | null;
      images: Array<{ id: string; url: string; alt: string }>;
    }>(`/shirts/${id}`)
      .then((shirt) => {
        setForm({
          name: shirt.name,
          description: shirt.description,
          price: String(shirt.price),
          color: shirt.color,
          category: shirt.category,
          sizes: shirt.sizes,
          collectionId: shirt.collectionId ?? '',
        });
        setExistingImages(shirt.images);
      })
      .catch(() => setError('Camisa não encontrada'))
      .finally(() => setLoading(false));
  }, [id, isNew, token]);

  function toggleSize(size: string) {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setError('');
    setSaving(true);

    try {
      if (isNew) {
        if (images.length === 0) {
          setError('Adicione pelo menos uma imagem');
          setSaving(false);
          return;
        }

        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('description', form.description);
        formData.append('price', form.price);
        formData.append('color', form.color);
        formData.append('category', form.category);
        formData.append('sizes', JSON.stringify(form.sizes));
        if (form.collectionId) formData.append('collectionId', form.collectionId);
        images.forEach((img) => formData.append('images', img));

        await fetch(
          `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'}/admin/shirts`,
          {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          },
        );
      } else {
        await apiFetch(`/admin/shirts/${id}`, {
          method: 'PUT',
          token,
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            price: parseFloat(form.price),
            color: form.color,
            category: form.category,
            sizes: form.sizes,
            collectionId: form.collectionId || null,
          }),
        });
      }

      router.push('/admin/camisas');
    } catch {
      setError('Erro ao salvar camisa');
    } finally {
      setSaving(false);
    }
  }

  async function handleReprocess() {
    if (!token) return;
    setReprocessing(true);
    try {
      await apiFetch(`/admin/shirts/${id}/reprocess`, { method: 'POST', token });
      setPipelineStatus((prev) => prev ? { ...prev, pipelineStatus: 'processing', pipelineError: null } : prev);
    } catch {
      setError('Erro ao reprocessar pipeline');
    } finally {
      setReprocessing(false);
    }
  }

  if (loading) return <div className="animate-pulse">Carregando...</div>;

  const apiBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:3001';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">
          {isNew ? 'Nova Camisa' : `Editar: ${form.name}`}
        </h1>
        <button
          onClick={() => router.push('/admin/camisas')}
          className="text-sm text-primary-light hover:underline"
        >
          ← Voltar
        </button>
      </div>

      {error && <div className="rounded bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6 rounded-lg bg-white p-6 shadow-sm">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-primary-light">Nome</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="mt-1 w-full rounded border border-brand-300 px-3 py-2 focus:border-accent focus:outline-none"
            placeholder="Camisa Polo Clássica"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-primary-light">Descrição</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
            rows={4}
            className="mt-1 w-full rounded border border-brand-300 px-3 py-2 focus:border-accent focus:outline-none"
            placeholder="Descreva a camisa..."
          />
        </div>

        {/* Price + Color */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-light">Preço (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              className="mt-1 w-full rounded border border-brand-300 px-3 py-2 focus:border-accent focus:outline-none"
              placeholder="129.90"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-light">Cor</label>
            <input
              type="text"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              required
              className="mt-1 w-full rounded border border-brand-300 px-3 py-2 focus:border-accent focus:outline-none"
              placeholder="azul"
            />
          </div>
        </div>

        {/* Category + Collection */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-primary-light">Categoria</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 w-full rounded border border-brand-300 px-3 py-2 focus:border-accent focus:outline-none"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-primary-light">Coleção</label>
            <select
              value={form.collectionId}
              onChange={(e) => setForm({ ...form, collectionId: e.target.value })}
              className="mt-1 w-full rounded border border-brand-300 px-3 py-2 focus:border-accent focus:outline-none"
            >
              <option value="">Sem coleção</option>
              {collections.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-primary-light">Tamanhos</label>
          <div className="mt-2 flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`rounded border px-4 py-2 text-sm font-medium transition-colors ${
                  form.sizes.includes(size)
                    ? 'border-accent bg-accent text-white'
                    : 'border-brand-300 text-primary-light hover:border-accent'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          {form.sizes.length === 0 && (
            <p className="mt-1 text-xs text-red-500">Selecione pelo menos um tamanho</p>
          )}
        </div>

        {/* Existing images (edit mode) */}
        {!isNew && existingImages.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-primary-light">Imagens atuais</label>
            <div className="mt-2 flex flex-wrap gap-3">
              {existingImages.map((img) => (
                <div key={img.id} className="relative h-24 w-24 overflow-hidden rounded border">
                  <img src={`${apiBase}${img.url}`} alt={img.alt} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Image upload */}
        <div>
          <label className="block text-sm font-medium text-primary-light">
            {isNew ? 'Imagens (obrigatório)' : 'Adicionar novas imagens'}
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files ?? []))}
            className="mt-2 block w-full text-sm text-primary-light file:mr-4 file:rounded file:border-0 file:bg-accent/10 file:px-4 file:py-2 file:text-sm file:font-medium file:text-accent-dark hover:file:bg-accent/20"
          />
          {images.length > 0 && (
            <p className="mt-1 text-xs text-primary-light">
              {images.length} imagem(ns) selecionada(s)
            </p>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={saving || form.sizes.length === 0}
            className="rounded bg-accent px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-dark disabled:opacity-50"
          >
            {saving ? 'Salvando...' : isNew ? 'Criar Camisa' : 'Salvar Alterações'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/camisas')}
            className="rounded border border-brand-300 px-6 py-2 text-sm text-primary-light hover:bg-brand-50"
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* AI Pipeline Section */}
      {!isNew && pipelineStatus && (
        <div className="max-w-2xl space-y-4 rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary">Pipeline IA</h2>
            <button
              onClick={handleReprocess}
              disabled={reprocessing || pipelineStatus.pipelineStatus === 'processing'}
              className="rounded border border-accent px-4 py-1.5 text-sm font-medium text-accent hover:bg-accent/10 disabled:opacity-50"
            >
              {reprocessing ? 'Enviando...' : 'Reprocessar'}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-primary-light">Status:</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                pipelineStatus.pipelineStatus === 'complete'
                  ? 'bg-green-100 text-green-700'
                  : pipelineStatus.pipelineStatus === 'processing'
                    ? 'bg-blue-100 text-blue-700 animate-pulse'
                    : pipelineStatus.pipelineStatus === 'failed'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {pipelineStatus.pipelineStatus === 'complete' ? 'Completo' : pipelineStatus.pipelineStatus === 'processing' ? 'Processando' : pipelineStatus.pipelineStatus === 'failed' ? 'Falhou' : 'Pendente'}
            </span>
          </div>

          {pipelineStatus.pipelineError && (
            <p className="text-sm text-red-600">Erro: {pipelineStatus.pipelineError}</p>
          )}

          {pipelineStatus.pipelineStatus === 'complete' && (
            <div className="space-y-2 border-t pt-4">
              <h3 className="text-sm font-medium text-primary-light">Resultados da análise IA</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-primary-light">Tipo:</span>{' '}
                  <span className="font-medium capitalize">{pipelineStatus.aiType ?? '—'}</span>
                </div>
                <div>
                  <span className="text-primary-light">Cor:</span>{' '}
                  <span className="font-medium capitalize">{pipelineStatus.aiColor ?? '—'}</span>
                </div>
              </div>
              {pipelineStatus.aiDescription && (
                <p className="text-sm text-primary-light italic">{pipelineStatus.aiDescription}</p>
              )}

              {/* AI-generated images */}
              {existingImages.filter((img) => img.isAiGenerated).length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="mb-2 text-sm font-medium text-primary-light">Fotos com modelo (IA)</h3>
                  <div className="flex flex-wrap gap-3">
                    {existingImages
                      .filter((img) => img.isAiGenerated)
                      .map((img) => (
                        <div key={img.id} className="relative h-32 w-32 overflow-hidden rounded border">
                          <img src={`${apiBase}${img.url}`} alt={img.alt} className="h-full w-full object-cover" />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
