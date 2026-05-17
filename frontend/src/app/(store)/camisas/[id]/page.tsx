import { notFound } from 'next/navigation';
import { apiServer } from '@/lib/api';
import { ImageSwiper } from '@/components/catalog/ImageSwiper';

interface ShirtDetail {
  id: string;
  name: string;
  description: string;
  price: number;
  color: string;
  category: string;
  sizes: string[];
  images: Array<{ id: string; url: string; alt: string; isPrimary: boolean; sortOrder: number }>;
  createdAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ShirtDetailPage({ params }: PageProps) {
  const { id } = await params;

  let shirt: ShirtDetail;
  try {
    shirt = await apiServer<ShirtDetail>(`/shirts/${id}`);
  } catch {
    notFound();
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(shirt.price);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Image gallery */}
        <div className="relative">
          <ImageSwiper images={shirt.images} />
        </div>

        {/* Product details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-wider text-brand-500">{shirt.category}</p>
            <h1 className="mt-1 font-display text-3xl font-bold text-primary">{shirt.name}</h1>
          </div>

          <p className="text-3xl font-bold text-accent-dark">{formattedPrice}</p>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase text-primary-light">
              Tamanhos disponíveis
            </h2>
            <div className="flex gap-2">
              {shirt.sizes.map((size) => (
                <span
                  key={size}
                  className="rounded border border-brand-300 px-4 py-2 text-sm font-medium text-primary"
                >
                  {size}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase text-primary-light">Cor</h2>
            <span className="rounded-full bg-brand-100 px-3 py-1 text-sm capitalize text-primary">
              {shirt.color}
            </span>
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold uppercase text-primary-light">Descrição</h2>
            <p className="leading-relaxed text-primary-light">{shirt.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
