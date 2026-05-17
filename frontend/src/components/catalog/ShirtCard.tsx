import Image from 'next/image';
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

  return (
    <Link
      href={`/camisas/${id}`}
      className="group block overflow-hidden rounded-lg border border-brand-200 transition-shadow hover:shadow-md"
      data-shirt-id={id}
    >
      <div className="relative aspect-[3/4] bg-brand-50">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.alt}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAABv/EAB8QAAICAgIDAQAAAAAAAAAAAAECAwQABREhBhITMf/EABQBAQAAAAAAAAAAAAAAAAAAAAX/xAAZEQACAwEAAAAAAAAAAAAAAAABAgADEiH/2gAMAwEAAhEDEEA/AJ7o="
          />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-400">
            <span className="text-sm">Sem imagem</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-sm font-medium text-primary">{name}</h3>
        <p className="mt-1 text-lg font-semibold text-accent-dark">{formattedPrice}</p>
      </div>
    </Link>
  );
}
