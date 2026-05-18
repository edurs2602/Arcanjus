import Link from 'next/link';
import { apiServer } from '@/lib/api';
import { ShirtCard } from '@/components/catalog/ShirtCard';
import BannerCarousel from '@/components/home/BannerCarousel';

interface ShirtsResponse {
  shirts: Array<{
    id: string;
    name: string;
    price: number;
    primaryImage: { url: string; alt: string } | null;
  }>;
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  bannerUrl: string;
  bannerAlt: string;
}

interface CollectionsResponse {
  collections: Collection[];
}

export default async function HomePage() {
  let featuredShirts: ShirtsResponse['shirts'] = [];
  let collections: Collection[] = [];

  try {
    const [shirtsData, collectionsData] = await Promise.all([
      apiServer<ShirtsResponse>('/shirts?limit=8&sort=newest'),
      apiServer<CollectionsResponse>('/collections'),
    ]);
    featuredShirts = shirtsData.shirts;
    collections = collectionsData.collections;
  } catch {
    // API might not be ready yet
  }

  return (
    <div>
      {/* Hero / Carousel */}
      {collections.length > 0 ? (
        <section className="animate-fade-in">
          <BannerCarousel collections={collections} />
        </section>
      ) : (
        <section className="relative flex min-h-[85vh] items-center justify-center bg-primary">
          <div className="absolute inset-0 bg-[url('/hero-texture.jpg')] bg-cover bg-center opacity-20" />
          <div className="relative z-10 text-center">
            <p className="luxury-subheading text-white/50">Established 2024</p>
            <h1 className="mt-6 font-display text-6xl font-normal tracking-wide text-white md:text-8xl">
              ARCANJUS
            </h1>
            <p className="mt-6 text-sm font-light leading-relaxed text-white/60">
              Elegância atemporal em cada detalhe
            </p>
            <div className="luxury-divider !bg-accent/60" />
            <Link
              href="/camisas"
              className="inline-block border border-white/30 px-12 py-4 text-[10px] font-medium uppercase tracking-widest-xl text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-primary"
            >
              Explorar Coleção
            </Link>
          </div>
        </section>
      )}

      {/* Brand Statement */}
      <section className="py-24 md:py-32">
        <div className="luxury-container text-center">
          <p className="luxury-subheading text-accent">Nossa Essência</p>
          <h2 className="mx-auto mt-6 max-w-3xl font-display text-3xl font-normal leading-snug text-primary md:text-4xl">
            Cada camisa é uma declaração de estilo — feita com tecidos nobres e atenção incomparável aos detalhes
          </h2>
          <div className="luxury-divider" />
        </div>
      </section>

      {/* Featured Collection */}
      {featuredShirts.length > 0 && (
        <section className="bg-white py-20 md:py-28">
          <div className="luxury-container">
            <div className="mb-16 text-center">
              <p className="luxury-subheading text-accent">Novidades</p>
              <h2 className="mt-4 font-display text-3xl font-normal text-primary md:text-4xl">
                Lançamentos Recentes
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredShirts.slice(0, 4).map((shirt) => (
                <ShirtCard
                  key={shirt.id}
                  id={shirt.id}
                  name={shirt.name}
                  price={shirt.price}
                  primaryImage={shirt.primaryImage}
                />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link href="/camisas" className="luxury-button-outline">
                Ver Toda a Coleção
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Craftsmanship Banner */}
      <section className="py-20 md:py-28">
        <div className="luxury-container">
          <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
            <div>
              <p className="luxury-subheading text-accent">Artesanato</p>
              <h2 className="mt-4 font-display text-3xl font-normal leading-snug text-primary md:text-4xl">
                O cuidado que faz a diferença
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-primary-light">
                Nossos tecidos são cuidadosamente selecionados de fornecedores premium.
                Cada peça passa por um rigoroso controle de qualidade, garantindo que você
                receba apenas o melhor.
              </p>
              <Link href="/sobre" className="luxury-button mt-10">
                Conheça Nossa História
              </Link>
            </div>
            <div className="aspect-[4/5] overflow-hidden bg-brand-200">
              <div className="flex h-full items-center justify-center">
                <p className="luxury-subheading text-brand-400">Imagem de Artesanato</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
