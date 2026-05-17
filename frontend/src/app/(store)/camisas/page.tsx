import { Suspense } from 'react';
import { apiServer } from '@/lib/api';
import { ShirtGrid } from '@/components/catalog/ShirtGrid';
import { FilterSidebar } from '@/components/catalog/FilterSidebar';

interface ShirtsResponse {
  shirts: Array<{
    id: string;
    name: string;
    price: number;
    primaryImage: { url: string; alt: string } | null;
  }>;
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface FiltersResponse {
  categories: string[];
  colors: string[];
  sizes: string[];
}

interface PageProps {
  searchParams: Promise<{ category?: string; color?: string; size?: string; sort?: string; page?: string }>;
}

export default async function CamisasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][],
  ).toString();

  const [shirtsData, filtersData] = await Promise.all([
    apiServer<ShirtsResponse>(`/shirts${queryString ? `?${queryString}` : ''}`),
    apiServer<FiltersResponse>('/shirts/filters'),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 font-display text-3xl font-bold text-primary">Nossas Camisas</h1>

      <div className="flex flex-col gap-8 md:flex-row">
        <Suspense fallback={<div className="h-64 w-64 animate-pulse rounded bg-brand-100" />}>
          <FilterSidebar
            categories={filtersData.categories}
            colors={filtersData.colors}
            sizes={filtersData.sizes}
          />
        </Suspense>

        <div className="flex-1">
          <ShirtGrid shirts={shirtsData.shirts} />

          {shirtsData.pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              {Array.from({ length: shirtsData.pagination.totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <a
                    key={pageNum}
                    href={`/camisas?${new URLSearchParams({ ...params, page: String(pageNum) }).toString()}`}
                    className={`rounded px-3 py-1 text-sm ${
                      pageNum === shirtsData.pagination.page
                        ? 'bg-accent text-white'
                        : 'bg-brand-100 text-primary-light hover:bg-brand-200'
                    }`}
                  >
                    {pageNum}
                  </a>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
