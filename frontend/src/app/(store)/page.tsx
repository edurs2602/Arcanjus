import Link from 'next/link';
import { apiServer } from '@/lib/api';
import { ShirtCard } from '@/components/catalog/ShirtCard';

interface ShirtsResponse {
  shirts: Array<{
    id: string;
    name: string;
    price: number;
    primaryImage: { url: string; alt: string } | null;
  }>;
}

export default async function HomePage() {
  let featuredShirts: ShirtsResponse['shirts'] = [];
  try {
    const data = await apiServer<ShirtsResponse>('/shirts?limit=4&sort=newest');
    featuredShirts = data.shirts;
  } catch {
    // API might not be ready yet
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-brand-50 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center">
          <h1 className="font-display text-5xl font-bold text-primary md:text-6xl">Arcanjus</h1>
          <p className="mt-4 text-lg text-primary-light">
            Camisas com estilo, conforto e qualidade
          </p>
          <Link
            href="/camisas"
            className="mt-8 inline-block rounded bg-accent px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dark"
          >
            Ver Coleção
          </Link>
        </div>
      </section>

      {/* Featured shirts */}
      {featuredShirts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="mb-8 text-center font-display text-2xl font-bold text-primary">
            Novidades
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredShirts.map((shirt) => (
              <ShirtCard
                key={shirt.id}
                id={shirt.id}
                name={shirt.name}
                price={shirt.price}
                primaryImage={shirt.primaryImage}
              />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/camisas"
              className="text-sm font-medium text-accent hover:underline"
            >
              Ver todas as camisas →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}
