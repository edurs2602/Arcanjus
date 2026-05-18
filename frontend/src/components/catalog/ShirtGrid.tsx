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
      <div className="py-24 text-center">
        <p className="font-display text-xl text-primary">Nenhuma peça encontrada</p>
        <p className="mt-3 text-sm text-primary-light">Tente ajustar os filtros para explorar nossa coleção.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
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
