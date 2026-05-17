import { ShirtCard } from './ShirtCard';

interface Shirt {
  id: string;
  name: string;
  price: number;
  primaryImage: { url: string; alt: string } | null;
}

interface ShirtGridProps {
  shirts: Shirt[];
}

export function ShirtGrid({ shirts }: ShirtGridProps) {
  if (shirts.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-primary-light">Nenhuma camisa encontrada.</p>
        <p className="mt-2 text-sm text-brand-500">Tente ajustar os filtros.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {shirts.map((shirt) => (
        <ShirtCard
          key={shirt.id}
          id={shirt.id}
          name={shirt.name}
          price={shirt.price}
          primaryImage={shirt.primaryImage}
        />
      ))}
    </div>
  );
}
