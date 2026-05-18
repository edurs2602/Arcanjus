import { Suspense } from 'react';
import Link from 'next/link';
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

interface CollectionInfo {
  id: string;
  name: string;
  description: string | null;
  bannerUrl: string;
  bannerAlt: string;
}

interface PageProps {
  searchParams: Promise<{ category?: string; color?: string; size?: string; collection?: string; sort?: string; page?: string }>;
}

export default async function CamisasPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const queryString = new URLSearchParams(
    Object.entries(params).filter(([_, v]) => v !== undefined) as [string, string][],
  ).toString();

  let collectionInfo: CollectionInfo | null = null;

  const [shirtsData, filtersData] = await Promise.all([
    apiServer<ShirtsResponse>(`/shirts${queryString ? `?${queryString}` : ''}`),
    apiServer<FiltersResponse>('/shirts/filters'),
  ]);

  if (params.collection) {
    try {
      collectionInfo = await apiServer<CollectionInfo>(`/collections/${params.collection}`);
    } catch {
      // Collection not found, ignore
    }
  }

  return (
    <div>
      {/* Page header */}
      <section className="bg-white py-16 md:py-20">
        <div className="luxury-container text-center">
          {collectionInfo ? (
            <div>
              <p className="luxury-subheading text-accent">Coleção</p>
              <h1 className="mt-4 font-display text-4xl font-normal text-primary md:text-5xl">
                {collectionInfo.name}
              </h1>
              {collectionInfo.description && (
                <p className="mx-auto mt-4 max-w-xl text-sm text-primary-light">
                  {collectionInfo.description}
                </p>
              )}
              <Link
                href="/camisas"
                className="mt-6 inline-block text-[10px] uppercase tracking-widest-xl text-primary-light transition-colors hover:text-primary"
              >
                ← Ver todas as peças
              </Link>
            </div>
          ) : (
            <div>
              <p className="luxury-subheading text-accent">Catálogo</p>
              <h1 className="mt-4 font-display text-4xl font-normal text-primary md:text-5xl">
                Nossas Peças
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-sm text-primary-light">
                Explore nossa coleção completa de camisas, cada uma criada com atenção aos detalhes e materiais de excelência.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Catalog grid */}
      <section className="py-12 md:py-16">
        <div className="luxury-container">
          <div className="flex flex-col gap-12 md:flex-row md:gap-16">
            <Suspense fallback={<div className="h-64 w-56 animate-pulse" />}>
              <FilterSidebar
                categories={filtersData.categories}
                colors={filtersData.colors}
                sizes={filtersData.sizes}
              />
            </Suspense>

            <div className="flex-1">
              {/* Results count */}
              <div className="mb-8 flex items-center justify-between">
                <p className="text-[10px] uppercase tracking-widest-xl text-primary-light">
                  {shirtsData.pagination.total} {shirtsData.pagination.total === 1 ? 'peça' : 'peças'}
                </p>
              </div>

              <ShirtGrid shirts={shirtsData.shirts} />

              {/* Pagination */}
              {shirtsData.pagination.totalPages > 1 && (
                <div className="mt-16 flex justify-center gap-3">
                  {Array.from({ length: shirtsData.pagination.totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <a
                        key={pageNum}
                        href={`/camisas?${new URLSearchParams({ ...params, page: String(pageNum) }).toString()}`}
                        className={`flex h-10 w-10 items-center justify-center text-sm transition-colors duration-200 ${
                          pageNum === shirtsData.pagination.page
                            ? 'border border-primary bg-primary text-white'
                            : 'border border-brand-200 text-primary-light hover:border-primary hover:text-primary'
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
      </section>
    </div>
  );
}
