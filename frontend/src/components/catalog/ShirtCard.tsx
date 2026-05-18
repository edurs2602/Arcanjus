import Link from 'next/link';

interface ShirtCardProps {
  id: string;
  name: string;
  price: number;
  primaryImage: { url: string; alt: string } | null;
}

export function ShirtCard({ id, name, price, primaryImage }: ShirtCardProps) {
  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);

  const imageBase = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') ?? 'http://localhost:3001';

  return (
    <Link
      href={`/camisas/${id}`}
      className="group block"
      data-shirt-id={id}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-brand-100">
        {primaryImage ? (
          <img
            src={`${imageBase}${primaryImage.url}`}
            alt={primaryImage.alt}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-[10px] uppercase tracking-widest-xl text-brand-400">Sem imagem</span>
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/5" />
      </div>
      <div className="mt-4 space-y-1">
        <h3 className="text-sm font-normal text-primary transition-colors group-hover:text-accent-dark">
          {name}
        </h3>
        <p className="text-sm text-primary-light">{formattedPrice}</p>
      </div>
    </Link>
  );
}
