import { notFound } from 'next/navigation';
import Link from 'next/link';
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
    <div className="bg-white">
      {/* Breadcrumb */}
      <div className="luxury-container py-6">
        <nav className="flex items-center gap-2 text-[10px] uppercase tracking-widest-xl text-primary-light">
          <Link href="/camisas" className="transition-colors hover:text-primary">
            Camisas
          </Link>
          <span className="text-brand-300">/</span>
          <span className="text-primary">{shirt.category}</span>
        </nav>
      </div>

      <div className="luxury-container pb-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          {/* Image gallery */}
          <div className="relative">
            <ImageSwiper images={shirt.images} />
          </div>

          {/* Product details */}
          <div className="flex flex-col justify-center space-y-8 md:py-8">
            <div>
              <p className="luxury-subheading text-accent">{shirt.category}</p>
              <h1 className="mt-3 font-display text-3xl font-normal text-primary md:text-4xl">
                {shirt.name}
              </h1>
            </div>

            <p className="font-display text-2xl text-primary">{formattedPrice}</p>

            <div className="h-px bg-brand-200" />

            {/* Sizes */}
            <div>
              <h2 className="luxury-subheading mb-4">Tamanhos Disponíveis</h2>
              <div className="flex gap-3">
                {shirt.sizes.map((size) => (
                  <span
                    key={size}
                    className="flex h-12 w-12 items-center justify-center border border-brand-200 text-xs font-medium text-primary transition-colors hover:border-primary"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>

            {/* Color */}
            <div>
              <h2 className="luxury-subheading mb-3">Cor</h2>
              <p className="text-sm capitalize text-primary">{shirt.color}</p>
            </div>

            <div className="h-px bg-brand-200" />

            {/* Description */}
            <div>
              <h2 className="luxury-subheading mb-4">Detalhes</h2>
              <p className="text-sm leading-relaxed text-primary-light">{shirt.description}</p>
            </div>

            {/* Care/quality badges */}
            <div className="flex gap-8 pt-4">
              <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-brand-200">
                  <svg className="h-4 w-4 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="mt-2 text-[9px] uppercase tracking-widest-xl text-primary-light">Qualidade</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-brand-200">
                  <svg className="h-4 w-4 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </div>
                <p className="mt-2 text-[9px] uppercase tracking-widest-xl text-primary-light">Conforto</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-brand-200">
                  <svg className="h-4 w-4 text-primary-light" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H18.75m-7.5-3V6.375c0-.621.504-1.125 1.125-1.125h3.5c.621 0 1.125.504 1.125 1.125V9.75M7.5 12h9" />
                  </svg>
                </div>
                <p className="mt-2 text-[9px] uppercase tracking-widest-xl text-primary-light">Entrega</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
